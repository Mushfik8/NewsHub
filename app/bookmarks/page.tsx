'use client';

import NewsCard from '@/components/NewsCard';
import { BookmarkProvider, useBookmarks } from '@/components/BookmarkProvider';
import { Bookmark } from 'lucide-react';

function BookmarksList() {
  const { bookmarks } = useBookmarks();
  
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Bookmark className="w-14 h-14 mx-auto mb-4 opacity-25" />
        <p className="text-lg font-medium">কোনো বুকমার্ক নেই</p>
        <p className="text-sm mt-2">সংবাদ পড়তে পড়তে বুকমার্ক আইকনে ক্লিক করুন।</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((a: any) => <NewsCard key={a._id} article={a} />)}
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <BookmarkProvider>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-blue-600" />
          বুকমার্ক করা সংবাদ
        </h1>
        <BookmarksList />
      </div>
    </BookmarkProvider>
  );
}
