/**
 * lib/feed-verifier.ts — RSS feed verification utility
 *
 * Validates that a given feed URL returns live, valid RSS
 * with recent articles. Used by the admin dashboard for
 * one-click feed health checks before adding new sources.
 */
import Parser from 'rss-parser';

const VERIFY_TIMEOUT_MS = 15_000;

const parser = new Parser({
  timeout: VERIFY_TIMEOUT_MS,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
});

export interface FeedVerificationResult {
  ok: boolean;
  url: string;
  feedTitle?: string;
  itemCount: number;
  latestDate?: string;
  hasImages: boolean;
  sampleCategories: string[];
  error?: string;
}

export async function verifyFeed(url: string): Promise<FeedVerificationResult> {
  const base: FeedVerificationResult = {
    ok: false,
    url,
    itemCount: 0,
    hasImages: false,
    sampleCategories: [],
  };

  try {
    const feed = await parser.parseURL(url);
    const items = feed.items || [];

    if (items.length === 0) {
      return { ...base, error: 'Feed returned 0 items' };
    }

    // Check for recent items (within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dates = items
      .map((item) => {
        const dateStr = item.isoDate || item.pubDate;
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
      })
      .filter((d): d is Date => d !== null);

    const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;
    const hasRecentItems = latestDate ? latestDate >= sevenDaysAgo : false;

    // Check for images
    const hasImages = items.some(
      (item: any) =>
        item.mediaContent?.$?.url ||
        item.mediaThumbnail?.$?.url ||
        item.enclosure?.url
    );

    // Collect sample categories
    const categories = new Set<string>();
    for (const item of items.slice(0, 10)) {
      const cats = (item as any).categories;
      if (Array.isArray(cats)) {
        for (const cat of cats) {
          const str = typeof cat === 'string' ? cat : cat?._ || cat?.toString();
          if (str) categories.add(str.trim());
        }
      }
    }

    return {
      ok: true,
      url,
      feedTitle: feed.title || undefined,
      itemCount: items.length,
      latestDate: latestDate?.toISOString(),
      hasImages,
      sampleCategories: [...categories].slice(0, 15),
      ...(hasRecentItems ? {} : { error: 'Warning: no items from the last 7 days' }),
    };
  } catch (err: any) {
    return {
      ...base,
      error: err.message || 'Unknown error',
    };
  }
}
