/**
 * lib/rss.ts — RSS ingestion engine
 *
 * Reads active sources from DB (Source table), falls back to DEFAULT_SOURCES
 * if DB has no configured sources. Deduplicates via urlHash (SHA256).
 * Logs results to FetchLog table and per-source health to SourceHealth table.
 *
 * Features:
 * - Per-source 10 second timeout via AbortController
 * - One retry on failure with 2 second backoff
 * - Separate network vs parse error classification
 * - Per-source health tracking
 * - RSS <category> tag extraction for improved category mapping
 */
import Parser from 'rss-parser';
import { generateSlug, generateUrlHash, sanitizeText, truncate } from './utils';
import { detectCategory, mapRssCategory, DEFAULT_SOURCES, type FeedSource } from './sources';
import {
  createArticle,
  createFetchLog,
  findArticleBySlug,
  findArticleByUrlHash,
  listActiveSources,
  upsertSourceHealth,
} from './db';

const SOURCE_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 2_000;
const MAX_ITEMS_PER_SOURCE = 30;

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure', { keepArray: false }],
      ['category', 'categories', { keepArray: true }],
    ],
  },
  timeout: SOURCE_TIMEOUT_MS,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
});

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  summary?: string;
  categories?: string[] | Array<{ _: string; $?: Record<string, string> }>;
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string; type?: string };
}

function extractImage(item: RSSItem): string | null {
  // Try media:content first
  const mediaUrl = item.mediaContent?.$?.url;
  if (mediaUrl) return mediaUrl;

  // Try media:thumbnail
  const thumbUrl = item.mediaThumbnail?.$?.url;
  if (thumbUrl) return thumbUrl;

  // Try enclosure (only if it's an image type)
  if (item.enclosure?.url) {
    const type = item.enclosure.type || '';
    if (type.startsWith('image/') || /\.(jpe?g|png|gif|webp)/i.test(item.enclosure.url)) {
      return item.enclosure.url;
    }
    // If no type info, still use it as a fallback
    return item.enclosure.url;
  }

  return null;
}

/**
 * Extract category strings from RSS item's <category> tags.
 * rss-parser can return these as strings or objects with {_: text} shape.
 */
function extractRssCategories(item: RSSItem): string[] {
  if (!item.categories || !Array.isArray(item.categories)) return [];
  return item.categories
    .map((cat) => {
      if (typeof cat === 'string') return cat.trim();
      if (typeof cat === 'object' && cat !== null && '_' in cat) return String(cat._).trim();
      return '';
    })
    .filter(Boolean);
}

type ErrorType = 'network' | 'timeout' | 'parse' | 'http' | 'unknown';

function classifyError(err: unknown): { type: ErrorType; message: string; statusCode?: number } {
  if (!(err instanceof Error)) {
    return { type: 'unknown', message: String(err) };
  }

  const msg = err.message || '';

  // AbortController / timeout
  if (msg.includes('aborted') || msg.includes('timeout') || err.name === 'AbortError') {
    return { type: 'timeout', message: `Request timed out after ${SOURCE_TIMEOUT_MS}ms` };
  }

  // Network errors
  if (
    msg.includes('ECONNREFUSED') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('ECONNRESET') ||
    msg.includes('fetch failed') ||
    msg.includes('network')
  ) {
    return { type: 'network', message: msg };
  }

  // HTTP errors (rss-parser sometimes throws with status info)
  const statusMatch = msg.match(/status\s*(?:code\s*)?(\d{3})/i);
  if (statusMatch) {
    return { type: 'http', message: msg, statusCode: parseInt(statusMatch[1]) };
  }

  // XML parse errors
  if (
    msg.includes('Invalid XML') ||
    msg.includes('Non-whitespace before first tag') ||
    msg.includes('Unexpected close tag') ||
    msg.includes('not well-formed') ||
    msg.includes('XML') ||
    msg.includes('parse')
  ) {
    return { type: 'parse', message: msg };
  }

  return { type: 'unknown', message: msg };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSourceWithRetry(source: FeedSource): Promise<{
  newCount: number;
  error?: { type: ErrorType; message: string };
}> {
  try {
    return await fetchSource(source);
  } catch (firstErr: unknown) {
    const classified = classifyError(firstErr);
    console.warn(
      `[RSS] First attempt failed for ${source.name} (${classified.type}): ${classified.message}. Retrying in ${RETRY_DELAY_MS}ms...`
    );

    await sleep(RETRY_DELAY_MS);

    try {
      return await fetchSource(source);
    } catch (retryErr: unknown) {
      const retryClassified = classifyError(retryErr);
      console.error(
        `[RSS] Retry also failed for ${source.name} (${retryClassified.type}): ${retryClassified.message}`
      );
      return { newCount: 0, error: retryClassified };
    }
  }
}

async function fetchSource(source: FeedSource): Promise<{ newCount: number }> {
  const feed = await parser.parseURL(source.feedUrl);
  let newCount = 0;

  const items: RSSItem[] = feed.items || [];

  for (const item of items.slice(0, MAX_ITEMS_PER_SOURCE)) {
    if (!item.title || !item.link) continue;

    const urlHash = generateUrlHash(item.link);
    const exists = await findArticleByUrlHash(urlHash);
    if (exists) continue;

    const rawDescription =
      item.contentSnippet || item.summary || item.content || '';
    const description = truncate(sanitizeText(rawDescription), 200);
    const title = sanitizeText(item.title);

    // Category detection priority:
    // 1. Map RSS <category> tags using source-specific mapping
    // 2. Fall back to keyword-based detection
    // 3. Fall back to source default category
    const rssCategories = extractRssCategories(item);
    let category = mapRssCategory(source.slug, rssCategories);
    if (!category) {
      category = detectCategory(title, description);
    }

    let slug = generateSlug(title);
    const slugExists = await findArticleBySlug(slug);
    if (slugExists) {
      slug = `${slug}-${urlHash.slice(0, 6)}`;
    }

    const image = extractImage(item);
    const publishedAt = item.isoDate
      ? new Date(item.isoDate)
      : item.pubDate
        ? new Date(item.pubDate)
        : new Date();

    try {
      await createArticle({
        title,
        slug,
        source: source.name,
        sourceSlug: source.slug,
        sourceUrl: source.siteUrl,
        originalLink: item.link,
        publishedAt,
        image,
        category,
        description,
        urlHash,
        views: 0,
      });
      newCount++;
    } catch (createError: any) {
      if (
        !createError.message?.includes('UNIQUE') &&
        !createError.message?.includes('constraint')
      ) {
        throw createError;
      }
    }
  }

  return { newCount };
}

async function getActiveSources(): Promise<FeedSource[]> {
  try {
    const dbSources = await listActiveSources();
    if (dbSources.length > 0) {
      return dbSources;
    }
  } catch {
    console.warn('[RSS] Could not read sources from DB, using DEFAULT_SOURCES');
  }

  return DEFAULT_SOURCES;
}

export interface SourceFetchResult {
  source: string;
  sourceSlug: string;
  new: number;
  error?: string;
  errorType?: ErrorType;
}

export interface FetchJobResult {
  totalNew: number;
  results: SourceFetchResult[];
}

export async function runFetchJob(): Promise<FetchJobResult> {
  const sources = await getActiveSources();
  const results: SourceFetchResult[] = [];
  let totalNew = 0;
  let errors = 0;

  for (const source of sources) {
    const startTime = Date.now();
    try {
      const result = await fetchSourceWithRetry(source);
      const elapsed = Date.now() - startTime;

      if (result.error) {
        // Failed after retry
        console.error(
          `[RSS] ${source.name}: FAILED (${result.error.type}) after ${elapsed}ms — ${result.error.message}`
        );
        results.push({
          source: source.name,
          sourceSlug: source.slug,
          new: 0,
          error: result.error.message,
          errorType: result.error.type,
        });
        errors++;

        // Update source health — failure
        await upsertSourceHealth(source.slug, {
          success: false,
          error: `[${result.error.type}] ${result.error.message}`,
        }).catch((e) => console.warn('[RSS] Failed to update source health:', e.message));
      } else {
        // Success
        console.log(`[RSS] ${source.name}: +${result.newCount} new articles (${elapsed}ms)`);
        results.push({
          source: source.name,
          sourceSlug: source.slug,
          new: result.newCount,
        });
        totalNew += result.newCount;

        // Update source health — success
        await upsertSourceHealth(source.slug, {
          success: true,
          newArticles: result.newCount,
        }).catch((e) => console.warn('[RSS] Failed to update source health:', e.message));
      }
    } catch (err: any) {
      // Unexpected error (shouldn't reach here normally due to fetchSourceWithRetry)
      const elapsed = Date.now() - startTime;
      const classified = classifyError(err);
      console.error(
        `[RSS] ${source.name}: UNEXPECTED ERROR (${classified.type}) after ${elapsed}ms — ${classified.message}`
      );
      results.push({
        source: source.name,
        sourceSlug: source.slug,
        new: 0,
        error: classified.message,
        errorType: classified.type,
      });
      errors++;

      await upsertSourceHealth(source.slug, {
        success: false,
        error: `[${classified.type}] ${classified.message}`,
      }).catch((e) => console.warn('[RSS] Failed to update source health:', e.message));
    }
  }

  await createFetchLog({
    totalNew,
    errors,
    results: JSON.stringify(results),
  });

  return { totalNew, results };
}
