'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsCard from '@/components/NewsCard';
import { GridSkeleton } from '@/components/Skeleton';
import { BookmarkProvider } from '@/components/BookmarkProvider';
import { Search } from 'lucide-react';

interface Article {
  _id: string; title: string; slug: string; source: string; sourceSlug: string;
  originalLink: string; publishedAt: string; image: string | null; category: string; description: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQ);

  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}&limit=30`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {/**/} finally { setLoading(false); }
  }, []);

  useEffect(() => { 
    if (initialQ) {
      doSearch(initialQ);
    }
  }, [initialQ, doSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      setHasSearched(true);
      // Update URL without full reload for better UX
      window.history.replaceState({}, '', `/search?q=${encodeURIComponent(q)}`);
      doSearch(q);
    }
  };

  return (
    <>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="যেকোনো সংবাদ খুঁজুন..."
            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none dark:text-white"
            autoFocus={!initialQ}
          />
          <button
            type="submit"
            className="absolute right-2.5 top-2.5 bottom-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            খুঁজুন
          </button>
        </form>
      </div>

      {!hasSearched ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <Search className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">সংবাদ অনুসন্ধান</h2>
          <p>আপনার পছন্দের বিষয়, ব্যক্তি বা জায়গার নাম লিখে খুঁজুন।</p>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            &ldquo;{q}&rdquo; এর ফলাফল
            {!loading && <span className="text-base font-normal text-slate-500 ml-2">({articles.length}টি সংবাদ)</span>}
          </h1>
          {loading ? <GridSkeleton count={6} /> : articles.length === 0 ? (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">কোনো ফলাফল পাওয়া যায়নি</h2>
              <p>দয়া করে ভিন্ন বা সহজ কোনো শব্দ দিয়ে আবার চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map(a => <NewsCard key={a._id} article={a} />)}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <BookmarkProvider>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Suspense fallback={<GridSkeleton count={6} />}>
          <SearchResults />
        </Suspense>
      </div>
    </BookmarkProvider>
  );
}
