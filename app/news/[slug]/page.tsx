import { notFound } from 'next/navigation';
import { ExternalLink, Clock, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { getSiteUrl, timeAgo } from '@/lib/utils';
import type { Metadata } from 'next';

interface Article {
  _id: string;
  title: string;
  slug: string;
  source: string;
  sourceSlug: string;
  sourceUrl: string;
  originalLink: string;
  publishedAt: string;
  image: string | null;
  category: string;
  description: string;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${getSiteUrl()}/api/news/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'সংবাদ পাওয়া যায়নি' };

  const siteUrl = getSiteUrl();
  return {
    title: article.title,
    description: article.description || `${article.source}-এর সংবাদ: ${article.title}`,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${siteUrl}/news/${article.slug}`,
      images: article.image ? [{ url: article.image }] : [],
      type: 'article',
      publishedTime: article.publishedAt,
    },
    alternates: { canonical: `${siteUrl}/news/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image || undefined,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: article.source, url: article.sourceUrl },
    publisher: { '@type': 'Organization', name: 'NewsHub BD', url: siteUrl },
    url: `${siteUrl}/news/${article.slug}`,
    mainEntityOfPage: `${siteUrl}/news/${article.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> হোম
          </Link>
          <span>/</span>
          <Link href={`/category/${article.category}`} className="hover:text-blue-600 transition-colors">
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300 truncate">{article.source}</span>
        </nav>

        <article className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {/* Image */}
          {article.image && (
            <div className="relative h-64 sm:h-80 bg-slate-200 dark:bg-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Category + Source */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link href={`/category/${article.category}`}>
                <span className="badge-blue">{article.category}</span>
              </Link>
              <Link href={`/source/${article.sourceSlug}`}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                {article.source}
              </Link>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                {timeAgo(article.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Description */}
            {article.description && (
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/20 py-3 rounded-r-lg">
                {article.description}
              </p>
            )}

            {/* Legal Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ⚠️ এটি একটি সংক্ষিপ্ত পূর্বদর্শন। সম্পূর্ণ সংবাদ পড়তে নিচের বোতামে ক্লিক করুন এবং মূল সূত্রে যান।
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={article.originalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center py-3 text-base font-semibold flex-1 sm:flex-none"
              >
                <ExternalLink className="w-5 h-5" />
                {article.source}-এ সম্পূর্ণ সংবাদ পড়ুন
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} – ${siteUrl}/news/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary justify-center py-3"
              >
                <Share2 className="w-4 h-4" />
                শেয়ার করুন
              </a>
            </div>

            {/* Source Attribution */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                সংবাদ সূত্র:{' '}
                <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  {article.source}
                </a>
                {' '}— সকল স্বত্ব মূল প্রকাশকের।
              </p>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
