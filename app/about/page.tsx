import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে',
  description: 'NewsHub BD সম্পর্কে জানুন',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">
          আমাদের সম্পর্কে
        </h1>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            NewsHub BD একটি বাংলা নিউজ অ্যাগ্রিগেটর। আমরা বিভিন্ন বিশ্বস্ত সংবাদমাধ্যমের
            RSS ফিড থেকে শিরোনাম ও সংক্ষিপ্ত তথ্য দেখাই।
          </p>
          <p>
            আমরা কোনো পূর্ণ সংবাদ কপি করি না। প্রতিটি সংবাদ তার মূল প্রকাশকের ওয়েবসাইটে
            পাঠিয়ে দেয়।
          </p>
          <p>
            এই সাইটের লক্ষ্য হলো এক জায়গায় দ্রুত বাংলা সংবাদ খুঁজে পাওয়া, পড়া, এবং
            মূল সূত্রে যাওয়া।
          </p>
        </div>
      </div>
    </div>
  );
}
