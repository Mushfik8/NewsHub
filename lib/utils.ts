import { createHash } from 'crypto';
import slugify from 'slugify';
import { formatDistanceToNow } from 'date-fns';

export function generateSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, locale: 'bn' });
  const hash = createHash('md5').update(title).digest('hex').slice(0, 6);
  return `${base || 'news'}-${hash}`;
}

export function generateUrlHash(url: string): string {
  return createHash('sha256').update(url).digest('hex');
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
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
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://newshubbd.vercel.app';
}
