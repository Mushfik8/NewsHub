'use client';

import { useEffect, useState, useCallback } from 'react';
import { Fragment } from 'react';
import { useParams } from 'next/navigation';
import NewsCard from '@/components/NewsCard';
import { GridSkeleton } from '@/components/Skeleton';
import AdSlot from '@/components/AdSlot';
import { BookmarkProvider } from '@/components/BookmarkProvider';
import { DEFAULT_SOURCES } from '@/lib/sources';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: string;
  source: string;
  sourceSlug: string;
  originalLink: string;
  publishedAt: string;
  image: string | null;
  category: string;
  description: string;
}

interface SourceInfo {
  name: string;
  slug: string;
  siteUrl: string;
}

export default function SourcePage() {
  const params = useParams();
  const sourceSlug = (params?.source as string) || '';
  const [sources, setSources] = useState<SourceInfo[]>(DEFAULT_SOURCES);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const sourceInfo = sources.find((source) => source.slug === sourceSlug);

  const fetchArticles = useCallback(async (pg: number, append = false) => {
    if (!append) setLoading(true); else setLoadingMore(true);
    try {
      const res = await fetch(`/api/news?source=${sourceSlug}&page=${pg}&limit=20`);
      const data = await res.json();
      const newArticles = data.articles || [];
      setArticles((prev) => append ? [...prev, ...newArticles] : newArticles);
      setHasNext(data.pagination?.hasNext || false);
    } catch {/**/} finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sourceSlug]);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      if (Array.isArray(data.sources) && data.sources.length > 0) {
        setSources(data.sources);
      }
    } catch {/**/}
  }, []);

  useEffect(() => {
    fetchArticles(1);
    fetchSources();
  }, [fetchArticles, fetchSources]);

  return (
    <BookmarkProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold">📡 সূত্র</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {sourceInfo?.name || sourceSlug}
            </h1>
            {sourceInfo && (
              <a
                href={sourceInfo.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
              >
                <ExternalLink className="w-4 h-4" /> {sourceInfo.siteUrl}
              </a>
            )}
          </div>
        </div>
        <AdSlot type="banner" className="mb-6 hidden md:flex" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {loading ? <GridSkeleton count={8} /> : (
              <>
                <div className="space-y-4">
                  {articles.map((article, index) => (
                    <Fragment key={article._id}>
                      <NewsCard article={article} />
                      {(index + 1) % 8 === 0 && <AdSlot type="rectangle" />}
                    </Fragment>
                  ))}
                </div>
                {hasNext && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => {
                        const next = page + 1;
                        setPage(next);
                        fetchArticles(next, true);
                      }}
                      disabled={loadingMore}
                      className="btn-primary px-8 py-3"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} />
                      {loadingMore ? 'লোড হচ্ছে...' : 'আরও সংবাদ'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <AdSlot type="sidebar" />
          </aside>
        </div>
      </div>
    </BookmarkProvider>
  );
}
