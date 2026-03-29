import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-4">৪০৪</div>
        <Newspaper className="w-16 h-16 text-blue-600 mx-auto mb-4 opacity-60" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">পৃষ্ঠাটি পাওয়া যায়নি</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">আপনি যে পৃষ্ঠাটি খুঁজছেন তা মুছে ফেলা হয়েছে বা সরানো হয়েছে।</p>
        <Link href="/" className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          হোম পেজে ফিরুন
        </Link>
      </div>
    </div>
  );
}
