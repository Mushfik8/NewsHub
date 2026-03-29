import Parser from 'rss-parser';
import { generateSlug, generateUrlHash, sanitizeText, truncate } from './utils';
import { detectCategory, DEFAULT_SOURCES, FeedSource } from './sources';
import { prisma } from './prisma';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['enclosure', 'enclosure', { keepArray: false }],
    ],
  },
  timeout: 15000,
  headers: {
    'User-Agent': 'NewsHubBD/1.0 (+https://newshubbd.vercel.app)',
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
  mediaContent?: { $?: { url?: string } };
  mediaThumbnail?: { $?: { url?: string } };
  enclosure?: { url?: string };
}

function extractImage(item: RSSItem): string | null {
  return (
    item.mediaContent?.$?.url ||
    item.mediaThumbnail?.$?.url ||
    item.enclosure?.url ||
    null
  );
}

async function fetchSource(source: FeedSource): Promise<number> {
  const feed = await parser.parseURL(source.feedUrl);
  let newCount = 0;

  const items: RSSItem[] = feed.items || [];

  for (const item of items.slice(0, 30)) {
    if (!item.title || !item.link) continue;

    const urlHash = generateUrlHash(item.link);

    const exists = await prisma.article.findUnique({ where: { urlHash } });
    if (exists) continue;

    const rawDescription = item.contentSnippet || item.summary || item.content || '';
    const description = truncate(sanitizeText(rawDescription), 200);
    const title = sanitizeText(item.title);
    const category = detectCategory(title, description);
    const slug = generateSlug(title);
    const image = extractImage(item);
    const publishedAt = item.isoDate
      ? new Date(item.isoDate)
      : item.pubDate
      ? new Date(item.pubDate)
      : new Date();

    await prisma.article.create({
      data: {
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
      }
    });

    newCount++;
  }

  return newCount;
}

export async function runFetchJob(): Promise<{
  totalNew: number;
  results: Array<{ source: string; new: number; error?: string }>;
}> {
  const results: Array<{ source: string; new: number; error?: string }> = [];
  let totalNew = 0;
  let errors = 0;

  for (const source of DEFAULT_SOURCES) {
    try {
      const count = await fetchSource(source);
      results.push({ source: source.name, new: count });
      totalNew += count;
    } catch (err: any) {
      console.error(`[RSS] Failed to fetch ${source.name}:`, err.message);
      results.push({ source: source.name, new: 0, error: err.message });
      errors++;
    }
  }

  // Save fetch log
  await prisma.fetchLog.create({
    data: {
      totalNew,
      errors,
      results: JSON.stringify(results),
    }
  });

  return { totalNew, results };
}
