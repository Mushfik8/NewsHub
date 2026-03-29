import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSiteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'NewsHub BD – বাংলা নিউজ',
    template: '%s | NewsHub BD',
  },
  description: 'বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ। BBC Bangla, Prothom Alo, Somoy TV-সহ সকল শীর্ষ সংবাদমাধ্যমের খবর এক জায়গায়।',
  keywords: ['বাংলা নিউজ', 'Bangladesh news', 'Bangla news', 'বাংলাদেশ সংবাদ', 'prothom alo', 'bbc bangla', 'somoy tv'],
  authors: [{ name: 'NewsHub BD' }],
  creator: 'NewsHub BD',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: getSiteUrl(),
    siteName: 'NewsHub BD',
    title: 'NewsHub BD – বাংলা নিউজ অ্যাগ্রিগেটর',
    description: 'বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ এক জায়গায়।',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsHub BD',
    description: 'বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ।',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
