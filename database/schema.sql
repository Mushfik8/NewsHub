CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "hashedPassword" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Article" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "source" TEXT NOT NULL,
  "sourceSlug" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "originalLink" TEXT NOT NULL,
  "publishedAt" TEXT NOT NULL,
  "image" TEXT,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "urlHash" TEXT NOT NULL UNIQUE,
  "views" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Source" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "feedUrl" TEXT NOT NULL,
  "siteUrl" TEXT NOT NULL,
  "defaultCategory" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'bn',
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "FetchLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "timestamp" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "totalNew" INTEGER NOT NULL,
  "errors" INTEGER NOT NULL DEFAULT 0,
  "results" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "Article_publishedAt_idx" ON "Article" ("publishedAt");
CREATE INDEX IF NOT EXISTS "Article_sourceSlug_idx" ON "Article" ("sourceSlug");
CREATE INDEX IF NOT EXISTS "Article_category_idx" ON "Article" ("category");
