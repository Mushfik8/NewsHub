import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreakingNews from '@/components/BreakingNews';
import BottomTabBar from '@/components/BottomTabBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSiteUrl } from '@/lib/utils';

const siteUrl = getSiteUrl();
const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

const matchMediaShimScript = String.raw`
  (function() {
    if (typeof window === 'undefined') {
      return;
    }

    var originalMatchMedia =
      typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : null;

    window.matchMedia = function(query) {
      var mediaQuery = originalMatchMedia ? originalMatchMedia(query) : null;
      var listeners = [];

      if (!mediaQuery || typeof mediaQuery !== 'object') {
        mediaQuery = {
          matches: false,
          media: String(query || ''),
          onchange: null,
        };
      }

      if (typeof mediaQuery.matches !== 'boolean') {
        mediaQuery.matches = false;
      }

      if (typeof mediaQuery.media !== 'string') {
        mediaQuery.media = String(query || '');
      }

      if (!('onchange' in mediaQuery)) {
        mediaQuery.onchange = null;
      }

      if (typeof mediaQuery.addEventListener !== 'function') {
        mediaQuery.addEventListener = function(type, listener) {
          if (type === 'change' && typeof listener === 'function') {
            listeners.push(listener);
          }
        };
      }

      if (typeof mediaQuery.removeEventListener !== 'function') {
        mediaQuery.removeEventListener = function(type, listener) {
          if (type === 'change') {
            listeners = listeners.filter(function(entry) {
              return entry !== listener;
            });
          }
        };
      }

      if (typeof mediaQuery.dispatchEvent !== 'function') {
        mediaQuery.dispatchEvent = function(event) {
          listeners.slice().forEach(function(listener) {
            listener.call(mediaQuery, event);
          });
          return true;
        };
      }

      if (typeof mediaQuery.addListener !== 'function') {
        mediaQuery.addListener = function(listener) {
          mediaQuery.addEventListener('change', listener);
        };
      }

      if (typeof mediaQuery.removeListener !== 'function') {
        mediaQuery.removeListener = function(listener) {
          mediaQuery.removeEventListener('change', listener);
        };
      }

      return mediaQuery;
    };
  })();
`;
const themeInitScript = String.raw`
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var fontSize = localStorage.getItem('fontSize');
      var mediaQuery =
        typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-color-scheme: dark)')
          : null;
      var prefersDark = Boolean(mediaQuery && mediaQuery.matches);

      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.classList.add('dark');
      }

      if (fontSize === 'large') {
        document.documentElement.classList.add('font-large');
      } else if (fontSize === 'xlarge') {
        document.documentElement.classList.add('font-xlarge');
      }
    } catch (error) {}
  })();
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NewsHub BD – বাংলা নিউজ',
    template: '%s | NewsHub BD',
  },
  description: 'বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ। BBC Bangla, Prothom Alo, Jago News24, Daily Star-সহ সকল শীর্ষ সংবাদমাধ্যমের খবর এক জায়গায়।',
  keywords: ['বাংলা নিউজ', 'Bangladesh news', 'Bangla news', 'বাংলাদেশ সংবাদ', 'prothom alo', 'bbc bangla', 'jago news24', 'daily star'],
  authors: [{ name: 'NewsHub BD' }],
  creator: 'NewsHub BD',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NewsHub BD',
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: siteUrl,
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
        <meta name="google-adsense-account" content="ca-pub-4031452060439748" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: matchMediaShimScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <BreakingNews />
          <main className="flex-1 w-full pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomTabBar />
        </ThemeProvider>

        {googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
