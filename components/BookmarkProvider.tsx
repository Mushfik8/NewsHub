'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface BookmarkArticle {
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

interface BookmarkContextType {
  bookmarks: BookmarkArticle[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string, article: BookmarkArticle) => void;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  isBookmarked: () => false,
  toggleBookmark: () => {},
});

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkArticle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bookmarks');
      if (stored) setBookmarks(JSON.parse(stored));
    } catch { /**/ }
  }, []);

  const isBookmarked = (id: string) => bookmarks.some((b) => b._id === id);

  const toggleBookmark = (id: string, article: BookmarkArticle) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b._id === id);
      const next = exists ? prev.filter((b) => b._id !== id) : [article, ...prev];
      try { localStorage.setItem('bookmarks', JSON.stringify(next)); } catch { /**/ }
      return next;
    });
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
