import { MetadataRoute } from 'next';
import { listSitemapArticles } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newshubbd.vercel.app';

  try {
    const articles = await listSitemapArticles(500);

    const newsUrls = articles.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 1.0,
      },
      ...newsUrls,
    ];
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 1.0,
      },
    ];
  }
}
