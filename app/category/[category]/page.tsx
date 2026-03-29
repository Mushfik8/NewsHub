'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import NewsCard from '@/components/NewsCard';
import { GridSkeleton } from '@/components/Skeleton';
import AdSlot from '@/components/AdSlot';
import { BookmarkProvider } from '@/components/BookmarkProvider';
import { RefreshCw } from 'lucide-react';

interface Article {
  _id: string; title: string; slug: string; source: string; sourceSlug: string;
  originalLink: string; publishedAt: string; image: string | null; category: string; description: string;
}

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchArticles = useCallback(async (pg: number, append = false) => {
    if (!append) setLoading(true); else setLoadingMore(true);
    try {
      const res = await fetch(`/api/news?category=${encodeURIComponent(category)}&page=${pg}&limit=20`);
      const data = await res.json();
      const newArticles = data.articles || [];
      setArticles((prev) => append ? [...prev, ...newArticles] : newArticles);
      setHasNext(data.pagination?.hasNext || false);
    } catch {/**/} finally { setLoading(false); setLoadingMore(false); }
  }, [category]);

  useEffect(() => { setPage(1); fetchArticles(1); }, [fetchArticles]);

  return (
    <BookmarkProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">বিভাগ</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{category}</h1>
        </div>

        <AdSlot type="banner" className="mb-6 hidden md:flex" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {loading ? <GridSkeleton count={8} /> : articles.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-4xl mb-4">📭</p>
                <p>এই বিভাগে কোনো সংবাদ নেই।</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {articles.map((a, i) => (
                    <>
                      <NewsCard key={a._id} article={a} />
                      {(i + 1) % 8 === 0 && <AdSlot type="rectangle" key={`ad-${i}`} />}
                    </>
                  ))}
                </div>
                {hasNext && (
                  <div className="text-center mt-8">
                    <button onClick={() => { const n = page+1; setPage(n); fetchArticles(n, true); }}
                      disabled={loadingMore} className="btn-primary px-8 py-3">
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
