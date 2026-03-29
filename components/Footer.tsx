import Link from 'next/link';
import { Newspaper, ExternalLink } from 'lucide-react';

export default function Footer() {
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
              বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ এক জায়গায়। আমরা কোনো সংবাদ কপি করি না, শুধুমাত্র মূল সূত্রে পুনঃনির্দেশ করি।
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">বিভাগ</h3>
            <ul className="space-y-2 text-sm">
              {['বাংলাদেশ', 'আন্তর্জাতিক', 'রাজনীতি', 'খেলাধুলা', 'বিনোদন', 'প্রযুক্তি'].map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${encodeURIComponent(cat)}`} className="hover:text-blue-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h3 className="text-white font-semibold mb-4">সংবাদ সূত্র</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'BBC বাংলা', slug: 'bbc-bangla' },
                { name: 'প্রথম আলো', slug: 'prothom-alo' },
                { name: 'সময় টিভি', slug: 'somoy-tv' },
                { name: 'যুগান্তর', slug: 'jugantor' },
                { name: 'বিডিনিউজ২৪', slug: 'bdnews24' },
              ].map((src) => (
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
            <h3 className="text-white font-semibold mb-4">তথ্য</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">গোপনীয়তা নীতি</Link></li>
              <li><Link href="/bookmarks" className="hover:text-blue-400 transition-colors">বুকমার্ক</Link></li>
              <li><Link href="/admin" className="hover:text-blue-400 transition-colors">অ্যাডমিন</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} NewsHub BD। সকল সংবাদের স্বত্ব মূল প্রকাশকের।</p>
          <p className="text-slate-500">আমরা RSS ফিড ব্যবহার করে সংবাদ সংগ্রহ করি। কোনো সংবাদ কপি করা হয় না।</p>
        </div>
      </div>
    </footer>
  );
}
