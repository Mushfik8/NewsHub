'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Bookmark, Search } from 'lucide-react';

const tabs = [
  { href: '/', label: 'হোম', icon: Home },
  { href: '/category/বাংলাদেশ', label: 'বিভাগ', icon: LayoutGrid, matchPrefix: '/category' },
  { href: '/bookmarks', label: 'বুকমার্ক', icon: Bookmark },
  { href: '/search', label: 'সার্চ', icon: Search },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.matchPrefix) return pathname.startsWith(tab.matchPrefix);
    return pathname === tab.href;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bottom-tab-glass border-t border-slate-200 dark:border-slate-700 animate-slide-in-bottom"
      role="tablist"
      aria-label="Main navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={active}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                active ? 'bg-blue-100 dark:bg-blue-900/40 scale-110' : ''
              }`}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium leading-none ${active ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
