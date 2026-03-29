# NewsHub BD

A simple, fast, and local Bangla news aggregator built with **Next.js 14, Tailwind CSS, and SQLite (Prisma)**. 

No complex cloud databases or Redis instances are required. Everything runs locally out-of-the-box!

## 🚀 Features
- 📰 Automated RSS Aggregation (BBC Bangla, Prothom Alo, etc.)
- ⚡ **Local SQLite Database** (Zero cloud setup!)
- 🔐 Secure Admin Dashboard (Email + Password + JWT cookies)
- 🌙 Dark Mode & Bookmarks
- 📱 Mobile-First Responsive UI
- 📊 Fully-functional Admin Panel with Fetch Logs

---

## 🛠️ 1-Minute Local Setup

Follow these exact steps to run the application on your computer:

### 1. Install Packages
```bash
npm install
```

### 2. Generate the Local Database
We use Prisma ORM to create a local SQLite database (`dev.db`).
```bash
npx prisma db push --accept-data-loss
```

### 3. Seed Default Data
Seed the database with the default Admin account and some mock Bengali news articles so the homepage isn't empty:
```bash
node prisma/seed.js
```

### 4. Start the Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** to see the website!

---

## 🔐 Admin Dashboard

To access the admin panel and manually trigger the RSS scraper to fetch real news:

1. Go to **[http://localhost:3000/admin](http://localhost:3000/admin)**
2. Default Email: `admin@example.com`
3. Default Password: `admin123`

Inside the dashboard, click **"এখনই ফেচ করুন" (Fetch Now)** to pull down the latest real news from the connected RSS feeds straight into your SQLite database.

---

## 📡 Managing RSS Sources
You can easily add new TV channels or Newspapers by modifying the default sources inside `prisma/seed.js` and running the seed command again, or you can build out a UI in the admin panel to do it dynamically.

## ⚖️ Legal
This platform aggregates publicly available RSS feeds. All articles redirect to original publishers. No content is scraped without attribution.
