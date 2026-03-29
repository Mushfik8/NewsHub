'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
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

  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group">
        {article.image && (
          <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
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
        <div className="flex-1 min-w-0">
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{article.source}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="card group relative overflow-hidden">
        {article.image ? (
          <div className="relative h-56 bg-slate-200 dark:bg-slate-700">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="badge-blue mb-2 inline-block">{article.category}</span>
              <Link href={`/news/${article.slug}`}>
                <h2 className="text-white font-bold text-lg leading-tight line-clamp-2 hover:text-blue-300 transition-colors">
                  {article.title}
                </h2>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <span className="badge-blue mb-2 inline-block">{article.category}</span>
            <Link href={`/news/${article.slug}`}>
              <h2 className="text-slate-900 dark:text-slate-100 font-bold text-lg leading-tight line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {article.title}
              </h2>
            </Link>
          </div>
        )}
        <div className="p-4 pt-3">
          {!article.image && (
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">{article.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{article.source}</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {timeAgo(article.publishedAt)}
              </span>
            </div>
            <button
              onClick={() => toggleBookmark(article._id, article)}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Bookmark"
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
    <div className="card group flex flex-col sm:flex-row gap-0 overflow-hidden">
      {article.image && (
        <div className="relative sm:w-40 h-44 sm:h-auto flex-shrink-0 bg-slate-200 dark:bg-slate-700">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 160px"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-blue">{article.category}</span>
          </div>
          <Link href={`/news/${article.slug}`}>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-1">
              {article.title}
            </h3>
          </Link>
          {article.description && (
            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{article.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/source/${article.sourceSlug}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {article.source}
            </Link>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {timeAgo(article.publishedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(article._id, article)}
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-blue-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <a
              href={article.originalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
