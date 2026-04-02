# NewsHub BD

NewsHub BD is a Bangla news aggregator built with Next.js and a simple SQL data layer.

The project now uses:

- Local SQLite automatically in development
- Remote libSQL/Turso in production if you set a database URL
- Plain SQL queries through `@libsql/client`
- Built-in admin login, RSS fetch, source management, and AdSense-ready ad slots

## Quick Start

1. Install packages:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

5. Open `http://localhost:3000/admin`

Local development automatically creates the database at `data/news.db`.

If you do not set admin credentials in `.env.local`, local development falls back to:

- Email: `admin@example.com`
- Password: `admin123`

After login, click `Fetch Now` in the admin panel to pull real RSS news into the database.

## Environment Variables

Use `.env.example` as the template.

Required:

- `JWT_SECRET`
- `CRON_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Recommended:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Optional database variables:

- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN`

Backward-compatible aliases also work:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

## How The APIs Connect

- `/api/news`
  Returns paginated articles for the homepage, category pages, search, and source pages.

- `/api/news/[slug]`
  Returns one article for the article details page and increments its view count.

- `/api/categories`
  Returns unique categories for filtering.

- `/api/sources`
  Returns active news sources for the frontend.

- `/api/admin/login`
  Verifies admin email and password, then sets the `admin_token` cookie.

- `/api/admin/stats`
  Powers the admin dashboard cards, charts, and fetch logs.

- `/api/admin/sources`
  Lets you add, edit, enable, disable, or delete RSS sources.

- `/api/admin/articles`
  Lists articles for admin management and supports deletion.

- `/api/cron/fetch`
  Runs the RSS importer.
  You can call it in two ways:
  - From the admin panel after logging in
  - From a cron job with `Authorization: Bearer <CRON_SECRET>`

## Database Modes

### Local development

If `DATABASE_URL` and `TURSO_DATABASE_URL` are empty, the app uses:

- `data/news.db`

Tables are created automatically on startup.

### Production deployment

For real deployment, use a remote libSQL/Turso database so your data does not disappear between deploys.

Set:

- `DATABASE_URL=libsql://...`
- `DATABASE_AUTH_TOKEN=...`

You can also keep using:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

## Deploy To Vercel

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add these environment variables in Vercel:
   - `NEXT_PUBLIC_SITE_URL`
   - `JWT_SECRET`
   - `CRON_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_NAME`
   - `DATABASE_URL`
   - `DATABASE_AUTH_TOKEN`
4. Deploy.

If you use Vercel Cron, point it to:

- `/api/cron/fetch`

And send:

- `Authorization: Bearer <CRON_SECRET>`

## Google AdSense

The easiest setup is Auto ads.

Set:

- `NEXT_PUBLIC_ADSENSE_CLIENT`

Then turn on Auto ads inside AdSense.

If you want fixed ad positions inside the layout, also set:

- `NEXT_PUBLIC_ADSENSE_SLOT`

Optional per-slot overrides:

- `NEXT_PUBLIC_ADSENSE_SLOT_BANNER`
- `NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE`
- `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`

If no AdSense client is set, the app shows safe placeholder ad boxes instead.

## RSS Sources

You can manage sources from the admin dashboard with the `/api/admin/sources` API.

The app also includes fallback default sources in `lib/sources.ts` so the site still works on a fresh install.

## Legal

This platform aggregates public RSS feeds and links users back to the original publishers.
