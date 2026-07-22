import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with NewsHub BD',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-6">
          Contact Us
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          If you have any questions, suggestions, or concerns regarding our app or website, please feel free to reach out to us. We value your feedback and aim to respond to all inquiries as quickly as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Get in Touch</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Email</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">support@newshubbd.com</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Send us an email anytime.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">+880 1711-000000</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Mon-Fri from 9am to 6pm.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Developer Information</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Address</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Dhaka, Bangladesh
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  NewsHub BD Development Team
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>For Publishers:</strong> We are a news aggregator. We do not host or copy full articles. All news links redirect users to the original publisher's website. If you are a publisher and have concerns about your content, please contact us via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
