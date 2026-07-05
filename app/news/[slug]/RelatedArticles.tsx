'use client';

import { useEffect, useState } from 'react';
import NewsCard from '@/components/NewsCard';
import { BookmarkProvider } from '@/components/BookmarkProvider';

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

export default function RelatedArticles({
  category,
  excludeSlug,
}: {
  category: string;
  excludeSlug: string;
}) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(
          `/api/news/related?category=${encodeURIComponent(category)}&exclude=${encodeURIComponent(excludeSlug)}&limit=3`
        );
        const data = await res.json();
        setArticles(data.articles || []);
      } catch {/**/}
    }
    fetchRelated();
  }, [category, excludeSlug]);

  if (articles.length === 0) return null;

  return (
    <BookmarkProvider>
      <div className="mt-8">
        <h2 className="section-title mb-4">📌 সম্পর্কিত সংবাদ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} variant="featured" />
          ))}
        </div>
      </div>
    </BookmarkProvider>
  );
}
