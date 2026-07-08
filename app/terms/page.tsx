import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions of NewsHub BD',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-6">
          Terms and Conditions
        </h1>
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">১. সাধারণ শর্তাবলি</h2>
            <p>
              NewsHub BD অ্যাপ/ওয়েবসাইটটি ব্যবহার করে আপনি আমাদের শর্তাবলির সাথে সম্মত হচ্ছেন। আপনি যদি এসব শর্তে সম্মত না হন, তবে অনুগ্রহ করে আমাদের পরিষেবা ব্যবহার থেকে বিরত থাকুন।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">২. সংবাদ এবং তথ্যের উৎস</h2>
            <p>
              NewsHub BD একটি সংবাদ এগ্রিগেটর বা সংগ্রাহক। আমরা বিভিন্ন জনপ্রিয় এবং নির্ভরযোগ্য সংবাদমাধ্যম থেকে RSS ফিডের মাধ্যমে খবরের শিরোনাম ও সারাংশ সংগ্রহ করি। আমরা নিজে থেকে কোনো সংবাদ তৈরি করি না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">৩. কপিরাইট এবং মেধাস্বত্ব</h2>
            <p>
              সকল সংবাদের কপিরাইট এবং মেধাস্বত্ব মূল প্রকাশকদের নিজস্ব। আমরা কোনো সংবাদ কপি করি না। বিস্তারিত সংবাদ পড়ার জন্য ব্যবহারকারীকে মূল সংবাদমাধ্যমের ওয়েবসাইটে পুনঃনির্দেশ (redirect) করা হয়।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">৪. দায়বদ্ধতা (Liability)</h2>
            <p>
              সংবাদের সত্যতা, নির্ভুলতা বা মতামত সম্পূর্ণভাবে মূল প্রকাশকের ওপর নির্ভরশীল। প্রকাশিত কোনো সংবাদের কারণে সৃষ্ট যেকোনো সমস্যার জন্য NewsHub BD দায়ী থাকবে না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">৫. শর্তাবলির পরিবর্তন</h2>
            <p>
              NewsHub BD কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলি পরিবর্তন বা সংশোধন করার অধিকার সংরক্ষণ করে। যেকোনো পরিবর্তন এই পৃষ্ঠায় আপডেট করা হবে।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
