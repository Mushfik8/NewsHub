import Link from 'next/link';
import { Newspaper, ExternalLink } from 'lucide-react';
import { DEFAULT_SOURCES, CATEGORIES } from '@/lib/sources';

export default function Footer() {
  // Use categories without 'সব'
  const footerCategories = CATEGORIES.filter((c) => c !== 'সব');

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">NewsHub <span className="text-blue-400">BD</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              The latest news from Bangladesh and the world in one place. We do not copy news, we only redirect to the original sources.
            </p>
          </div>

          {/* Categories — dynamically from CATEGORIES */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {footerCategories.map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${encodeURIComponent(cat)}`} className="hover:text-blue-400 transition-colors">
                    {cat === 'সব' ? 'All' :
                     cat === 'বাংলাদেশ' ? 'Bangladesh' :
                     cat === 'আন্তর্জাতিক' ? 'International' :
                     cat === 'রাজনীতি' ? 'Politics' :
                     cat === 'খেলাধুলা' ? 'Sports' :
                     cat === 'বিনোদন' ? 'Entertainment' :
                     cat === 'প্রযুক্তি' ? 'Technology' :
                     cat === 'অর্থনীতি' ? 'Economy' :
                     cat === 'স্বাস্থ্য' ? 'Health' :
                     cat === 'শিক্ষা' ? 'Education' : cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources — dynamically from DEFAULT_SOURCES */}
          <div>
            <h3 className="text-white font-semibold mb-4">News Sources</h3>
            <ul className="space-y-2 text-sm">
              {DEFAULT_SOURCES.map((src) => (
                <li key={src.slug}>
                  <Link href={`/source/${src.slug}`} className="hover:text-blue-400 transition-colors flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {src.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/bookmarks" className="hover:text-blue-400 transition-colors">Bookmarks</Link></li>
              <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Admin Panel</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} NewsHub BD. All rights belong to original publishers.</p>
          <p className="text-slate-500">We aggregate news using RSS feeds. No news is copied.</p>
        </div>
      </div>
    </footer>
  );
}
