export interface FeedSource {
  name: string;
  slug: string;
  feedUrl: string;
  siteUrl: string;
  defaultCategory: string;
  language: string;
}

/**
 * Default sources — seeded into the Source table on first run.
 * Each source must be verified as returning live, valid RSS with recent articles.
 *
 * Verified July 2026:
 * ✅ Prothom Alo — confirmed live, multi-category
 * ✅ BBC Bangla — confirmed live
 * ✅ Jago News24 — confirmed live, multi-category (national, international, sports, health, campus)
 * ✅ The Daily Star — needs realistic User-Agent (now handled in rss.ts)
 * ✅ Somoy TV — re-verified
 *
 * ❌ Jugantor — https://www.jugantor.com/feed/rss.xml returns 404 (removed)
 * ❌ bdnews24 — feed URL pattern appears broken (removed until verified)
 */
export const DEFAULT_SOURCES: FeedSource[] = [
  {
    name: 'প্রথম আলো',
    slug: 'prothom-alo',
    feedUrl: 'https://www.prothomalo.com/feed/',
    siteUrl: 'https://www.prothomalo.com',
    defaultCategory: 'বাংলাদেশ',
    language: 'bn',
  },
  {
    name: 'BBC বাংলা',
    slug: 'bbc-bangla',
    feedUrl: 'https://feeds.bbci.co.uk/bengali/rss.xml',
    siteUrl: 'https://www.bbc.com/bengali',
    defaultCategory: 'আন্তর্জাতিক',
    language: 'bn',
  },
  {
    name: 'জাগো নিউজ২৪',
    slug: 'jago-news24',
    feedUrl: 'https://www.jagonews24.com/rss/rss.xml',
    siteUrl: 'https://www.jagonews24.com',
    defaultCategory: 'বাংলাদেশ',
    language: 'bn',
  },
  {
    name: 'দ্য ডেইলি স্টার',
    slug: 'daily-star',
    feedUrl: 'https://www.thedailystar.net/frontpage/rss.xml',
    siteUrl: 'https://www.thedailystar.net',
    defaultCategory: 'বাংলাদেশ',
    language: 'en',
  },
  {
    name: 'সময় টিভি',
    slug: 'somoy-tv',
    feedUrl: 'https://www.somoynews.tv/rss.xml',
    siteUrl: 'https://www.somoynews.tv',
    defaultCategory: 'বাংলাদেশ',
    language: 'bn',
  },
  {
    name: 'বাংলা ট্রিবিউন',
    slug: 'bangla-tribune',
    feedUrl: 'https://www.banglatribune.com/rss.xml',
    siteUrl: 'https://www.banglatribune.com',
    defaultCategory: 'বাংলাদেশ',
    language: 'bn',
  },
  {
    name: 'ঢাকা ট্রিবিউন',
    slug: 'dhaka-tribune',
    feedUrl: 'https://www.dhakatribune.com/rss.xml',
    siteUrl: 'https://www.dhakatribune.com',
    defaultCategory: 'বাংলাদেশ',
    language: 'en',
  },
  {
    name: 'সমকাল',
    slug: 'samakal',
    feedUrl: 'https://samakal.com/rss.xml',
    siteUrl: 'https://samakal.com',
    defaultCategory: 'বাংলাদেশ',
    language: 'bn',
  },
];

export const CATEGORIES = [
  'সব',
  'বাংলাদেশ',
  'আন্তর্জাতিক',
  'রাজনীতি',
  'খেলাধুলা',
  'বিনোদন',
  'প্রযুক্তি',
  'অর্থনীতি',
  'স্বাস্থ্য',
  'শিক্ষা',
];

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  রাজনীতি: ['রাজনীতি', 'সরকার', 'নির্বাচন', 'সংসদ', 'দল', 'মন্ত্রী', 'প্রধানমন্ত্রী', 'politics', 'political', 'government', 'election'],
  খেলাধুলা: ['ক্রিকেট', 'ফুটবল', 'টেনিস', 'খেলা', 'টুর্নামেন্ট', 'বিশ্বকাপ', 'অলিম্পিক', 'sports', 'cricket', 'football'],
  বিনোদন: ['চলচ্চিত্র', 'সিনেমা', 'গান', 'নাটক', 'অভিনেতা', 'মিউজিক', 'বিনোদন', 'entertainment', 'movie', 'bollywood', 'hollywood'],
  প্রযুক্তি: ['প্রযুক্তি', 'ডিজিটাল', 'মোবাইল', 'ইন্টারনেট', 'সফটওয়্যার', 'এআই', 'কম্পিউটার', 'technology', 'tech', 'gadget', 'ai', 'software'],
  অর্থনীতি: ['অর্থনীতি', 'বাজেট', 'টাকা', 'ব্যাংক', 'বিনিয়োগ', 'রপ্তানি', 'আমদানি', 'economy', 'business', 'finance', 'market', 'stock'],
  স্বাস্থ্য: ['স্বাস্থ্য', 'হাসপাতাল', 'চিকিৎসা', 'রোগ', 'ওষুধ', 'ডাক্তার', 'করোনা', 'health', 'medical', 'hospital', 'disease'],
  শিক্ষা: ['শিক্ষা', 'পরীক্ষা', 'বিশ্ববিদ্যালয়', 'স্কুল', 'কলেজ', 'ফলাফল', 'ভর্তি', 'education', 'school', 'university', 'exam'],
  আন্তর্জাতিক: ['বিশ্ব', 'আন্তর্জাতিক', 'আমেরিকা', 'ভারত', 'চীন', 'ইউরোপ', 'জাতিসংঘ', 'international', 'world', 'global', 'usa', 'india', 'china'],
};

/**
 * Map RSS <category> tag values from specific sources to our app categories.
 * Each source has its own section/category naming, which we normalize here.
 */
const RSS_CATEGORY_MAP: Record<string, Record<string, string>> = {
  'prothom-alo': {
    // Prothom Alo uses Bangla section names and English paths
    'বাংলাদেশ': 'বাংলাদেশ',
    'bangladesh': 'বাংলাদেশ',
    'আন্তর্জাতিক': 'আন্তর্জাতিক',
    'international': 'আন্তর্জাতিক',
    'world': 'আন্তর্জাতিক',
    'রাজনীতি': 'রাজনীতি',
    'politics': 'রাজনীতি',
    'খেলা': 'খেলাধুলা',
    'খেলাধুলা': 'খেলাধুলা',
    'sports': 'খেলাধুলা',
    'বিনোদন': 'বিনোদন',
    'entertainment': 'বিনোদন',
    'lifestyle': 'বিনোদন',
    'প্রযুক্তি': 'প্রযুক্তি',
    'technology': 'প্রযুক্তি',
    'tech': 'প্রযুক্তি',
    'অর্থনীতি': 'অর্থনীতি',
    'economy': 'অর্থনীতি',
    'business': 'অর্থনীতি',
    'চাকরি': 'অর্থনীতি',
    'স্বাস্থ্য': 'স্বাস্থ্য',
    'health': 'স্বাস্থ্য',
    'শিক্ষা': 'শিক্ষা',
    'education': 'শিক্ষা',
    'মতামত': 'বাংলাদেশ',
    'opinion': 'বাংলাদেশ',
  },
  'jago-news24': {
    'জাতীয়': 'বাংলাদেশ',
    'national': 'বাংলাদেশ',
    'আন্তর্জাতিক': 'আন্তর্জাতিক',
    'international': 'আন্তর্জাতিক',
    'রাজনীতি': 'রাজনীতি',
    'politics': 'রাজনীতি',
    'খেলাধুলা': 'খেলাধুলা',
    'sports': 'খেলাধুলা',
    'বিনোদন': 'বিনোদন',
    'entertainment': 'বিনোদন',
    'প্রযুক্তি': 'প্রযুক্তি',
    'technology': 'প্রযুক্তি',
    'অর্থনীতি': 'অর্থনীতি',
    'economy': 'অর্থনীতি',
    'স্বাস্থ্য': 'স্বাস্থ্য',
    'health': 'স্বাস্থ্য',
    'শিক্ষা': 'শিক্ষা',
    'campus': 'শিক্ষা',
    'education': 'শিক্ষা',
  },
  'bbc-bangla': {
    'বাংলাদেশ': 'বাংলাদেশ',
    'আন্তর্জাতিক': 'আন্তর্জাতিক',
    'খেলাধুলা': 'খেলাধুলা',
    'বিজ্ঞান-প্রযুক্তি': 'প্রযুক্তি',
  },
  'daily-star': {
    'bangladesh': 'বাংলাদেশ',
    'frontpage': 'বাংলাদেশ',
    'politics': 'রাজনীতি',
    'sports': 'খেলাধুলা',
    'entertainment': 'বিনোদন',
    'business': 'অর্থনীতি',
    'tech-startup': 'প্রযুক্তি',
    'tech': 'প্রযুক্তি',
    'health': 'স্বাস্থ্য',
    'education': 'শিক্ষা',
    'world': 'আন্তর্জাতিক',
    'international': 'আন্তর্জাতিক',
  },
  'somoy-tv': {
    'জাতীয়': 'বাংলাদেশ',
    'আন্তর্জাতিক': 'আন্তর্জাতিক',
    'রাজনীতি': 'রাজনীতি',
    'খেলাধুলা': 'খেলাধুলা',
    'বিনোদন': 'বিনোদন',
    'অর্থনীতি': 'অর্থনীতি',
    'তথ্যপ্রযুক্তি': 'প্রযুক্তি',
  },
  'bangla-tribune': {
    'জাতীয়': 'বাংলাদেশ',
    'আন্তর্জাতিক': 'আন্তর্জাতিক',
    'রাজনীতি': 'রাজনীতি',
    'খেলা': 'খেলাধুলা',
    'বিনোদন': 'বিনোদন',
    'অর্থনীতি': 'অর্থনীতি',
    'তথ্যপ্রযুক্তি': 'প্রযুক্তি',
    'স্বাস্থ্য': 'স্বাস্থ্য',
    'শিক্ষা': 'শিক্ষা',
  },
  'dhaka-tribune': {
    'bangladesh': 'বাংলাদেশ',
    'world': 'আন্তর্জাতিক',
    'politics': 'রাজনীতি',
    'sport': 'খেলাধুলা',
    'sports': 'খেলাধুলা',
    'showtime': 'বিনোদন',
    'entertainment': 'বিনোদন',
    'business': 'অর্থনীতি',
    'tech': 'প্রযুক্তি',
    'health': 'স্বাস্থ্য',
    'education': 'শিক্ষা',
  },
  'samakal': {
    'জাতীয়': 'বাংলাদেশ',
    'আন্তর্জাতিক': 'আন্তর্জাতিক',
    'রাজনীতি': 'রাজনীতি',
    'খেলাধুলা': 'খেলাধুলা',
    'বিনোদন': 'বিনোদন',
    'অর্থনীতি': 'অর্থনীতি',
    'তথ্যপ্রযুক্তি': 'প্রযুক্তি',
    'স্বাস্থ্য': 'স্বাস্থ্য',
    'শিক্ষা': 'শিক্ষা',
  },
};

/**
 * Try to map RSS <category> tags to an app category using source-specific mapping.
 * Returns the matched category or null if no match found.
 */
export function mapRssCategory(sourceSlug: string, rssCategories: string[]): string | null {
  const mapping = RSS_CATEGORY_MAP[sourceSlug];
  if (!mapping || rssCategories.length === 0) return null;

  for (const cat of rssCategories) {
    const lower = cat.toLowerCase().trim();
    // Try exact match first
    if (mapping[cat]) return mapping[cat];
    // Try lowercase match
    if (mapping[lower]) return mapping[lower];
    // Try partial match (RSS category might contain the key)
    for (const [key, value] of Object.entries(mapping)) {
      if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
        return value;
      }
    }
  }

  return null;
}

export function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k.toLowerCase()))) return category;
  }
  return 'বাংলাদেশ';
}
