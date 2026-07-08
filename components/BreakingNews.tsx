'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface BreakingArticle {
  _id: string;
  title: string;
  slug: string;
  source: string;
}

export default function BreakingNews() {
  const [articles, setArticles] = useState<BreakingArticle[]>([]);

  useEffect(() => {
    async function fetchBreaking() {
      try {
        const res = await fetch('/api/news?limit=5&page=1');
        const data = await res.json();
        setArticles(data.articles?.slice(0, 5) || []);
      } catch {/**/}
    }
    fetchBreaking();
    // Refresh every 5 minutes
    const interval = setInterval(fetchBreaking, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (articles.length === 0) return null;

  // Duplicate items so the marquee looks continuous
  const doubled = [...articles, ...articles];

  return (
    <div className="breaking-news-strip text-white overflow-hidden" role="marquee" aria-label="Breaking news"
      style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
    >
      <div className="max-w-7xl mx-auto flex items-center h-full">
        {/* Label */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 md:px-4 py-2 bg-red-800 text-white font-bold text-xs md:text-sm uppercase tracking-wider z-20 shadow-md relative h-full">
          <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300" />
          <span>সর্বশেষ</span>
        </div>

        {/* Scrolling headlines */}
        <div 
          className="overflow-hidden flex-1 py-2 relative h-full flex items-center"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 16px, black 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black 100%)' }}
        >
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
            {doubled.map((article, i) => (
              <Link
                key={`${article._id}-${i}`}
                href={`/news/${article.slug}`}
                className="inline-flex items-center gap-2 text-sm hover:text-yellow-200 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 flex-shrink-0" />
                <span>{article.title}</span>
                <span className="text-white/70 text-xs ml-1">({article.source})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
