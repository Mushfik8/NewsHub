export interface FeedSource {
  name: string;
  slug: string;
  feedUrl: string;
  siteUrl: string;
  defaultCategory: string;
  language: string;
}

export const DEFAULT_SOURCES: FeedSource[] = [
  {
    name: 'BBC বাংলা',
    slug: 'bbc-bangla',
    feedUrl: 'https://feeds.bbci.co.uk/bengali/rss.xml',
    siteUrl: 'https://www.bbc.com/bengali',
    defaultCategory: 'আন্তর্জাতিক',
    language: 'bn',
  },
  {
    name: 'প্রথম আলো',
    slug: 'prothom-alo',
    feedUrl: 'https://www.prothomalo.com/feed',
    siteUrl: 'https://www.prothomalo.com',
    defaultCategory: 'সাধারণ',
    language: 'bn',
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
    name: 'যুগান্তর',
    slug: 'jugantor',
    feedUrl: 'https://www.jugantor.com/feed/rss.xml',
    siteUrl: 'https://www.jugantor.com',
    defaultCategory: 'বাংলাদেশ',
    language: 'bn',
  },
  {
    name: 'বিডিনিউজ২৪',
    slug: 'bdnews24',
    feedUrl: 'https://bangla.bdnews24.com/rss/rss.xml',
    siteUrl: 'https://bangla.bdnews24.com',
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
  রাজনীতি: ['রাজনীতি', 'সরকার', 'নির্বাচন', 'সংসদ', 'দল', 'মন্ত্রী', 'প্রধানমন্ত্রী'],
  খেলাধুলা: ['ক্রিকেট', 'ফুটবল', 'টেনিস', 'খেলা', 'টুর্নামেন্ট', 'বিশ্বকাপ', 'অলিম্পিক'],
  বিনোদন: ['চলচ্চিত্র', 'সিনেমা', 'গান', 'নাটক', 'অভিনেতা', 'মিউজিক', 'বিনোদন'],
  প্রযুক্তি: ['প্রযুক্তি', 'ডিজিটাল', 'মোবাইল', 'ইন্টারনেট', 'সফটওয়্যার', 'এআই', 'কম্পিউটার'],
  অর্থনীতি: ['অর্থনীতি', 'বাজেট', 'টাকা', 'ব্যাংক', 'বিনিয়োগ', 'রপ্তানি', 'আমদানি'],
  স্বাস্থ্য: ['স্বাস্থ্য', 'হাসপাতাল', 'চিকিৎসা', 'রোগ', 'ওষুধ', 'ডাক্তার', 'করোনা'],
  শিক্ষা: ['শিক্ষা', 'পরীক্ষা', 'বিশ্ববিদ্যালয়', 'স্কুল', 'কলেজ', 'ফলাফল', 'ভর্তি'],
  আন্তর্জাতিক: ['বিশ্ব', 'আন্তর্জাতিক', 'আমেরিকা', 'ভারত', 'চীন', 'ইউরোপ', 'জাতিসংঘ'],
};

export function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return category;
  }
  return 'বাংলাদেশ';
}
