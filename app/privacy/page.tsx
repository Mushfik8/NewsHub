import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি',
  description: 'NewsHub BD এর গোপনীয়তা নীতি',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">
          গোপনীয়তা নীতি
        </h1>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            NewsHub BD সীমিত পরিমাণ তথ্য ব্যবহার করে, যেমন ব্রাউজার কুকি বা
            অ্যানালিটিক্স, যাতে সাইটটি ভালোভাবে কাজ করে।
          </p>
          <p>
            আপনি যদি বুকমার্ক ব্যবহার করেন, সেটি আপনার নিজের ব্রাউজারের লোকাল স্টোরেজে
            সংরক্ষিত হয়।
          </p>
          <p>
            ভবিষ্যতে Google AdSense বা Analytics ব্যবহার করা হলে, তাদের নিজস্ব নীতিও
            প্রযোজ্য হবে।
          </p>
        </div>
      </div>
    </div>
  );
}
