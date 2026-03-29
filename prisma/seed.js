const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // 1. Create Default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      hashedPassword,
      name: 'System Admin',
    },
  });
  console.log('✅ Admin user seeded (admin@example.com / admin123)');

  // 2. Create Default Sources
  const defaultSources = [
    { name: 'BBC বাংলা', slug: 'bbc-bangla', feedUrl: 'https://feeds.bbci.co.uk/bengali/rss.xml', siteUrl: 'https://www.bbc.com/bengali', defaultCategory: 'বাংলাদেশ' },
    { name: 'প্রথম আলো', slug: 'prothom-alo', feedUrl: 'https://www.prothomalo.com/feed', siteUrl: 'https://www.prothomalo.com', defaultCategory: 'সর্বশেষ' },
  ];

  for (const src of defaultSources) {
    await prisma.source.upsert({
      where: { slug: src.slug },
      update: {},
      create: src,
    });
  }
  console.log('✅ Default news sources seeded');

  // 3. Create mock news articles for homepage
  const mockArticles = [
    {
      title: "বাংলাদেশ ক্রিকেট দলের নতুন কোচ ঘোষণা",
      slug: "bangladesh-cricket-new-coach-2026",
      source: "BBC বাংলা",
      sourceSlug: "bbc-bangla",
      sourceUrl: "https://www.bbc.com/bengali",
      originalLink: "https://www.bbc.com/bengali/news-123",
      publishedAt: new Date(),
      image: "https://images.unsplash.com/photo-1540747913346-19e32fc3e6ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "খেলা",
      description: "বাংলাদেশ ক্রিকেট দলের নতুন প্রধান কোচ হিসেবে নিয়োগ পেয়েছেন। বিসিবি তাকে ২ বছরের জন্য চুক্তিবদ্ধ করেছে।",
      urlHash: "hash_sports_1",
    },
    {
      title: "ঢাকায় নতুন মেট্রো রেল রুটের ভিত্তিপ্রস্তর স্থাপন",
      slug: "dhaka-metro-rail-new-route",
      source: "প্রথম আলো",
      sourceSlug: "prothom-alo",
      sourceUrl: "https://www.prothomalo.com",
      originalLink: "https://www.prothomalo.com/bangladesh/capital/123",
      publishedAt: new Date(Date.now() - 3600000), // 1 hour ago
      image: "https://images.unsplash.com/photo-1570535947712-4fdbf7df5de3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "বাংলাদেশ",
      description: "রাজধানীর যানজট নিরসনে নতুন মেট্রোরেল রুটের কাজ শুরু হলো।",
      urlHash: "hash_bd_1",
    },
    {
      title: "বিশ্ববাজারে স্বর্ণের দাম আবারও রেকর্ড উচ্চতায়",
      slug: "global-gold-prices-record-high",
      source: "প্রথম আলো",
      sourceSlug: "prothom-alo",
      sourceUrl: "https://www.prothomalo.com",
      originalLink: "https://www.prothomalo.com/economy/123",
      publishedAt: new Date(Date.now() - 7200000), // 2 hours ago
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "অর্থনীতি",
      description: "আন্তর্জাতিক বাজারে স্বর্ণের দাম আউন্স প্রতি নতুন রেকর্ড স্পর্শ করেছে।",
      urlHash: "hash_economy_1",
    },
    {
      title: "সিলিকন ভ্যালিতে এআই প্রযুক্তির নতুন দিগন্ত",
      slug: "ai-technology-silicon-valley",
      source: "BBC বাংলা",
      sourceSlug: "bbc-bangla",
      sourceUrl: "https://www.bbc.com/bengali",
      originalLink: "https://www.bbc.com/bengali/technology-123",
      publishedAt: new Date(Date.now() - 10800000), // 3 hours ago
      image: null,
      category: "বিজ্ঞান ও প্রযুক্তি",
      description: "কৃত্রিম বুদ্ধিমত্তার সর্বশেষ মডেলটি মানুষের মতই স্বাভাবিক কথোপকথনের কাজ করতে সক্ষম।",
      urlHash: "hash_tech_1",
    },
    {
      title: "হলিউডের নতুন সাই-ফাই সিনেমা বক্স অফিসে ঝড় তুলেছে",
      slug: "hollywood-new-sci-fi-movie-box-office",
      source: "প্রথম আলো",
      sourceSlug: "prothom-alo",
      sourceUrl: "https://www.prothomalo.com",
      originalLink: "https://www.prothomalo.com/entertainment/123",
      publishedAt: new Date(Date.now() - 14400000), // 4 hours ago
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "বিনোদন",
      description: "নতুন ক্রিস্টোফার নোলানের স্পেস থ্রিলার সারা বিশ্বের প্রেক্ষাগৃহে রেকর্ড ব্রেকিং ব্যবসা করছে।",
      urlHash: "hash_ent_1",
    }
  ];

  for (const article of mockArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log(`✅ Seeded ${mockArticles.length} mock articles`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
