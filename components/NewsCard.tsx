'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { timeAgoBangla, toBanglaDigits, estimateReadTime } from '@/lib/utils';
import { useBookmarks } from './BookmarkProvider';

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

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article._id);
  const relativeTime = timeAgoBangla(article.publishedAt);
  const readTime = estimateReadTime(article.description);

  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group relative">
        {/* Main link overlay */}
        <Link href={`/news/${article.slug}`} className="absolute inset-0 z-10" aria-label={article.title} />
        
        {article.image && (
          <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 z-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0 z-20 pointer-events-none">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Link
              href={`/source/${article.sourceSlug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline pointer-events-auto relative z-30"
            >
              {article.source}
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{relativeTime}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="card group relative overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 animate-slide-up">
        {/* Full card link with z-10 */}
        <Link href={`/news/${article.slug}`} className="absolute inset-0 z-10" aria-label={article.title} />
        
        {article.image ? (
          <div className="relative h-56 bg-slate-200 dark:bg-slate-700">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 z-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-blue translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">{article.category}</span>
                <span className="text-white/60 text-xs">{toBanglaDigits(readTime)} মিনিট পড়া</span>
              </div>
              <h2 className="text-white font-bold text-lg leading-tight line-clamp-2 transition-colors">
                {article.title}
              </h2>
            </div>
          </div>
        ) : (
          <div className="p-5 z-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-blue translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">{article.category}</span>
              <span className="text-slate-400 text-xs">{toBanglaDigits(readTime)} মিনিট পড়া</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 font-bold text-lg leading-tight line-clamp-2 transition-colors">
              {article.title}
            </h2>
          </div>
        )}

        <div className="p-4 pt-3 flex-1 flex flex-col justify-between relative z-20 pointer-events-none">
          {!article.image && (
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">{article.description}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Link
                href={`/source/${article.sourceSlug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pointer-events-auto relative z-30"
              >
                {article.source}
              </Link>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {relativeTime}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(article._id, article);
              }}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pointer-events-auto relative z-30 p-1 -m-1"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-blue-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div className="card group flex flex-col sm:flex-row gap-0 overflow-hidden relative hover:shadow-lg transition-all duration-300 animate-slide-up">
      {/* Full card link overlay */}
      <Link href={`/news/${article.slug}`} className="absolute inset-0 z-10 cursor-pointer" aria-label={article.title} />
      
      {article.image && (
        <div className="relative sm:w-40 h-44 sm:h-auto flex-shrink-0 bg-slate-200 dark:bg-slate-700">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, 160px"
            unoptimized
          />
        </div>
      )}
      
      <div className="flex-1 p-4 flex flex-col justify-between relative z-20 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-blue">{article.category}</span>
            <span className="text-slate-400 text-xs">{toBanglaDigits(readTime)} মিনিট পড়া</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{article.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/source/${article.sourceSlug}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pointer-events-auto relative z-30"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              📰 {article.source}
            </Link>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {relativeTime}
            </span>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto relative z-30">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(article._id, article);
              }}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 -m-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-blue-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <a
              href={article.originalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 -m-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Read original article"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
