import { createHash } from 'crypto';
import slugify from 'slugify';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

export function generateSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, locale: 'bn' });
  const hash = createHash('md5').update(title).digest('hex').slice(0, 6);
  return `${base || 'news'}-${hash}`;
}

export function generateUrlHash(url: string): string {
  return createHash('sha256').update(url).digest('hex');
}

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert Western digits (0-9) to Bangla digits (০-৯)
 */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BANGLA_DIGITS[parseInt(d)]);
}

/**
 * Bangla relative time ("৫ মিনিট আগে", "২ ঘণ্টা আগে")
 */
export function timeAgoBangla(date: Date | string): string {
  try {
    const result = formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: bn,
    });
    return toBanglaDigits(result);
  } catch {
    return '';
  }
}

/**
 * English relative time (fallback)
 */
export function timeAgo(date: Date | string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
}

/**
 * Estimate reading time in minutes based on word count.
 * Assumes ~200 words per minute for Bangla text.
 */
export function estimateReadTime(text: string): number {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')        // strip HTML
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export function truncate(text: string, maxLength = 160): string {
  const clean = sanitizeText(text);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).replace(/\s\S*$/, '…');
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://news-hub-bd.vercel.app';
}
