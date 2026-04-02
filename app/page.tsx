'use client';

import { useEffect, useState, useCallback } from 'react';
import { Fragment } from 'react';
import NewsCard from '@/components/NewsCard';
import { GridSkeleton, FeaturedCardSkeleton } from '@/components/Skeleton';
import AdSlot from '@/components/AdSlot';
import { BookmarkProvider } from '@/components/BookmarkProvider';
import { TrendingUp, RefreshCw, Flame } from 'lucide-react';
import { CATEGORIES, DEFAULT_SOURCES } from '@/lib/sources';

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

interface SourceItem {
  name: string;
  slug: string;
  siteUrl: string;
}

interface Pagination {
  page: number;
  total: number;
  pages: number;
  hasNext: boolean;
}

const sourceDotColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-pink-500',
];

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trending, setTrending] = useState<Article[]>([]);
  const [sources, setSources] = useState<SourceItem[]>(DEFAULT_SOURCES);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('সব');
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);

  const fetchArticles = useCallback(async (cat: string, pg: number, append = false) => {
    if (!append) setLoading(true); else setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: '15' });
      if (cat && cat !== 'সব') params.set('category', cat);
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      const newArticles = data.articles || [];
      setArticles((prev) => append ? [...prev, ...newArticles] : newArticles);
      setPagination(data.pagination);
    } catch {/**/} finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch('/api/news?limit=5&page=1');
      const data = await res.json();
      setTrending(data.articles?.slice(0, 5) || []);
    } catch {/**/}
  }, []);

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
    fetchArticles('সব', 1);
    fetchTrending();
    fetchSources();
  }, [fetchArticles, fetchTrending, fetchSources]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    fetchArticles(cat, 1);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchArticles(activeCategory, next, true);
  };

  const featured = articles.slice(0, 4);
  const rest = articles.slice(4);

  return (
    <BookmarkProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AdSlot type="banner" className="mb-6 hidden md:flex" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-5 overflow-x-auto scroll-hidden pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={activeCategory === cat ? 'category-pill-active' : 'category-pill-inactive'}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[0, 1, 2, 3].map((i) => <FeaturedCardSkeleton key={i} />)}
                </div>
                <GridSkeleton count={6} />
              </>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                <p className="text-4xl mb-4">📰</p>
                <p className="text-lg font-medium">কোনো সংবাদ পাওয়া যায়নি</p>
                <p className="text-sm mt-2">ডেটাবেসে সংবাদ নেই। অ্যাডমিন থেকে ফেচ করুন।</p>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <h2 className="section-title mb-4">
                    <Flame className="w-5 h-5 text-orange-500" />
                    সর্বশেষ সংবাদ
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {featured.map((article) => (
                      <NewsCard key={article._id} article={article} variant="featured" />
                    ))}
                  </div>
                </div>

                <AdSlot type="rectangle" className="mb-6" />

                <div className="space-y-4">
                  {rest.map((article, index) => (
                    <Fragment key={article._id}>
                      <NewsCard article={article} variant="default" />
                      {(index + 1) % 8 === 0 && <AdSlot type="rectangle" />}
                    </Fragment>
                  ))}
                </div>

                {pagination?.hasNext && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="btn-primary gap-2 px-8 py-3"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} />
                      {loadingMore ? 'লোড হচ্ছে...' : 'আরও সংবাদ'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
            <AdSlot type="sidebar" />

            {trending.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" style={{ boxShadow: 'var(--shadow)' }}>
                <h3 className="section-title mb-4">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  ট্রেন্ডিং
                </h3>
                <div className="space-y-1">
                  {trending.map((article, index) => (
                    <div key={article._id} className="flex gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-2xl font-black text-slate-200 dark:text-slate-700 w-7 flex-shrink-0 leading-none mt-1">
                        {index + 1}
                      </span>
                      <NewsCard article={article} variant="compact" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4" style={{ boxShadow: 'var(--shadow)' }}>
              <h3 className="section-title mb-4">📡 সংবাদ সূত্র</h3>
              {sources.map((source, index) => (
                <a
                  key={source.slug}
                  href={`/source/${source.slug}`}
                  className="flex items-center gap-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg px-2 transition-colors group"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${sourceDotColors[index % sourceDotColors.length]} flex-shrink-0`}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {source.name}
                  </span>
                </a>
              ))}
            </div>

            <AdSlot type="sidebar" />
          </aside>
        </div>
      </div>
    </BookmarkProvider>
  );
}
