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
  const q = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}&limit=30`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {/**/} finally { setLoading(false); }
  }, []);

  useEffect(() => { doSearch(q); }, [q, doSearch]);

  if (!q) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">সংবাদ খুঁজতে উপরের সার্চ বার ব্যবহার করুন।</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        &ldquo;{q}&rdquo; এর ফলাফল
        {!loading && <span className="text-base font-normal text-slate-400 ml-2">({articles.length}টি সংবাদ)</span>}
      </h1>
      {loading ? <GridSkeleton count={6} /> : articles.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>&ldquo;{q}&rdquo; এর জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((a: Article) => <NewsCard key={a._id} article={a} />)}
        </div>
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
