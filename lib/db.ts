import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient, type Client, type InValue, type Row } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_SOURCES, type FeedSource } from './sources';

export interface ArticleRecord {
  id: string;
  title: string;
  slug: string;
  source: string;
  sourceSlug: string;
  sourceUrl: string;
  originalLink: string;
  publishedAt: string;
  image: string | null;
  category: string;
  description: string;
  urlHash: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface SourceRecord {
  id: string;
  name: string;
  slug: string;
  feedUrl: string;
  siteUrl: string;
  defaultCategory: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  hashedPassword: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FetchLogRecord {
  id: string;
  timestamp: string;
  totalNew: number;
  errors: number;
  results: string;
}

export interface ListArticlesInput {
  category?: string;
  sourceSlug?: string;
  query?: string;
  limit?: number;
  offset?: number;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  source: string;
  sourceSlug: string;
  sourceUrl: string;
  originalLink: string;
  publishedAt: Date | string;
  image?: string | null;
  category: string;
  description: string;
  urlHash: string;
  views?: number;
}

export interface CreateSourceInput {
  name: string;
  slug: string;
  feedUrl: string;
  siteUrl: string;
  defaultCategory: string;
  language?: string;
  isActive?: boolean;
}

export interface UpdateSourceInput {
  name?: string;
  feedUrl?: string;
  siteUrl?: string;
  defaultCategory?: string;
  language?: string;
  isActive?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __newsDbClient: Client | undefined;
  // eslint-disable-next-line no-var
  var __newsDbInitPromise: Promise<void> | undefined;
}

const localDatabaseFile = path.join(process.cwd(), 'data', 'news.db');
const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.TURSO_DATABASE_URL?.trim() ||
  `file:${localDatabaseFile.replace(/\\/g, '/')}`;
const databaseAuthToken =
  process.env.DATABASE_AUTH_TOKEN?.trim() ||
  process.env.TURSO_AUTH_TOKEN?.trim() ||
  undefined;
const usesRemoteDatabase = /^(libsql|https?|wss?):/i.test(databaseUrl);

if (!usesRemoteDatabase) {
  fs.mkdirSync(path.dirname(localDatabaseFile), { recursive: true });
}

const client =
  global.__newsDbClient ??
  createClient({
    url: databaseUrl,
    authToken: databaseAuthToken,
    intMode: 'number',
  });

if (process.env.NODE_ENV !== 'production') {
  global.__newsDbClient = client;
}

const schemaSql = `
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
`;

function asString(value: unknown): string {
  return typeof value === 'string' ? value : String(value ?? '');
}

function asNullableString(value: unknown): string | null {
  return value == null ? null : String(value);
}

function asNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value ?? 0);
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}

function mapArticle(row: Row): ArticleRecord {
  return {
    id: asString(row.id),
    title: asString(row.title),
    slug: asString(row.slug),
    source: asString(row.source),
    sourceSlug: asString(row.sourceSlug),
    sourceUrl: asString(row.sourceUrl),
    originalLink: asString(row.originalLink),
    publishedAt: asString(row.publishedAt),
    image: asNullableString(row.image),
    category: asString(row.category),
    description: asString(row.description),
    urlHash: asString(row.urlHash),
    views: asNumber(row.views),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

function mapSource(row: Row): SourceRecord {
  return {
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    feedUrl: asString(row.feedUrl),
    siteUrl: asString(row.siteUrl),
    defaultCategory: asString(row.defaultCategory),
    language: asString(row.language),
    isActive: asBoolean(row.isActive),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

function mapUser(row: Row): UserRecord {
  return {
    id: asString(row.id),
    email: asString(row.email),
    hashedPassword: asString(row.hashedPassword),
    name: asNullableString(row.name),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

function mapFetchLog(row: Row): FetchLogRecord {
  return {
    id: asString(row.id),
    timestamp: asString(row.timestamp),
    totalNew: asNumber(row.totalNew),
    errors: asNumber(row.errors),
    results: asString(row.results),
  };
}

function createDbError(code: string, message: string): Error & { code: string } {
  const error = new Error(message) as Error & { code: string };
  error.code = code;
  return error;
}

async function execute(sql: string, args: InValue[] = []) {
  await ensureDatabase();
  return client.execute({ sql, args });
}

async function seedDefaultSourcesIfNeeded() {
  const countResult = await client.execute('SELECT COUNT(*) AS count FROM "Source"');
  const count = asNumber(countResult.rows[0]?.count);

  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();
  await client.batch(
    DEFAULT_SOURCES.map((source) => ({
      sql: `
        INSERT INTO "Source" (
          "id", "name", "slug", "feedUrl", "siteUrl",
          "defaultCategory", "language", "isActive", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        randomUUID(),
        source.name,
        source.slug,
        source.feedUrl,
        source.siteUrl,
        source.defaultCategory,
        source.language,
        1,
        now,
        now,
      ],
    })),
    'write'
  );
}

async function seedAdminIfNeeded() {
  const countResult = await client.execute('SELECT COUNT(*) AS count FROM "User"');
  const count = asNumber(countResult.rows[0]?.count);

  if (count > 0) {
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const email =
    adminEmail || (process.env.NODE_ENV !== 'production' ? 'admin@example.com' : '');
  const password =
    adminPassword || (process.env.NODE_ENV !== 'production' ? 'admin123' : '');

  if (!email || !password) {
    return;
  }

  const now = new Date().toISOString();
  const hashedPassword = await bcrypt.hash(password, 10);

  await client.execute({
    sql: `
      INSERT INTO "User" (
        "id", "email", "hashedPassword", "name", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      randomUUID(),
      email,
      hashedPassword,
      process.env.ADMIN_NAME?.trim() || 'System Admin',
      now,
      now,
    ],
  });
}

async function initializeDatabase() {
  await client.executeMultiple(schemaSql);
  await seedDefaultSourcesIfNeeded();
  await seedAdminIfNeeded();
}

export async function ensureDatabase() {
  if (!global.__newsDbInitPromise) {
    global.__newsDbInitPromise = initializeDatabase().catch((error) => {
      global.__newsDbInitPromise = undefined;
      throw error;
    });
  }

  await global.__newsDbInitPromise;
}

function buildArticleWhere(filters: ListArticlesInput) {
  const clauses: string[] = [];
  const args: InValue[] = [];

  if (filters.category) {
    clauses.push('"category" = ?');
    args.push(filters.category);
  }

  if (filters.sourceSlug) {
    clauses.push('"sourceSlug" = ?');
    args.push(filters.sourceSlug);
  }

  if (filters.query) {
    const search = `%${escapeLike(filters.query)}%`;
    clauses.push('("title" LIKE ? ESCAPE \'\\\\\' OR "description" LIKE ? ESCAPE \'\\\\\')');
    args.push(search, search);
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    args,
  };
}

export async function listArticles(filters: ListArticlesInput = {}) {
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;
  const { whereSql, args } = buildArticleWhere(filters);

  const [articlesResult, countResult] = await Promise.all([
    execute(
      `
        SELECT * FROM "Article"
        ${whereSql}
        ORDER BY "publishedAt" DESC
        LIMIT ? OFFSET ?
      `,
      [...args, limit, offset]
    ),
    execute(`SELECT COUNT(*) AS count FROM "Article" ${whereSql}`, args),
  ]);

  return {
    items: articlesResult.rows.map(mapArticle),
    total: asNumber(countResult.rows[0]?.count),
  };
}

export async function findArticleBySlug(slug: string) {
  const result = await execute(
    'SELECT * FROM "Article" WHERE "slug" = ? LIMIT 1',
    [slug]
  );
  const row = result.rows[0];
  return row ? mapArticle(row) : null;
}

export async function findArticleByUrlHash(urlHash: string) {
  const result = await execute(
    'SELECT * FROM "Article" WHERE "urlHash" = ? LIMIT 1',
    [urlHash]
  );
  const row = result.rows[0];
  return row ? mapArticle(row) : null;
}

export async function createArticle(input: CreateArticleInput) {
  const now = new Date().toISOString();
  const article: ArticleRecord = {
    id: randomUUID(),
    title: input.title,
    slug: input.slug,
    source: input.source,
    sourceSlug: input.sourceSlug,
    sourceUrl: input.sourceUrl,
    originalLink: input.originalLink,
    publishedAt: toIsoString(input.publishedAt),
    image: input.image ?? null,
    category: input.category,
    description: input.description,
    urlHash: input.urlHash,
    views: input.views ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  await execute(
    `
      INSERT INTO "Article" (
        "id", "title", "slug", "source", "sourceSlug", "sourceUrl",
        "originalLink", "publishedAt", "image", "category", "description",
        "urlHash", "views", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      article.id,
      article.title,
      article.slug,
      article.source,
      article.sourceSlug,
      article.sourceUrl,
      article.originalLink,
      article.publishedAt,
      article.image,
      article.category,
      article.description,
      article.urlHash,
      article.views,
      article.createdAt,
      article.updatedAt,
    ]
  );

  return article;
}

export async function incrementArticleViews(id: string) {
  await execute(
    'UPDATE "Article" SET "views" = "views" + 1, "updatedAt" = ? WHERE "id" = ?',
    [new Date().toISOString(), id]
  );
}

export async function deleteArticle(id: string) {
  const result = await execute('DELETE FROM "Article" WHERE "id" = ?', [id]);
  if (result.rowsAffected === 0) {
    throw createDbError('NOT_FOUND', 'Article not found');
  }
}

export async function listDistinctCategories() {
  const result = await execute(
    `
      SELECT DISTINCT "category" AS category
      FROM "Article"
      WHERE TRIM("category") <> ''
    `
  );

  return result.rows.map((row) => asString(row.category));
}

export async function countArticles() {
  const result = await execute('SELECT COUNT(*) AS count FROM "Article"');
  return asNumber(result.rows[0]?.count);
}

export async function getCategoryBreakdown() {
  const result = await execute(`
    SELECT "category" AS category, COUNT(*) AS count
    FROM "Article"
    GROUP BY "category"
    ORDER BY count DESC, "category" ASC
  `);

  return result.rows.map((row) => ({
    category: asString(row.category),
    count: asNumber(row.count),
  }));
}

export async function getSourceBreakdown() {
  const result = await execute(`
    SELECT "source" AS source, COUNT(*) AS count
    FROM "Article"
    GROUP BY "source"
    ORDER BY count DESC, "source" ASC
  `);

  return result.rows.map((row) => ({
    source: asString(row.source),
    count: asNumber(row.count),
  }));
}

export async function listSitemapArticles(limit = 500) {
  const result = await execute(
    `
      SELECT "slug" AS slug, "updatedAt" AS updatedAt
      FROM "Article"
      ORDER BY "publishedAt" DESC
      LIMIT ?
    `,
    [limit]
  );

  return result.rows.map((row) => ({
    slug: asString(row.slug),
    updatedAt: asString(row.updatedAt),
  }));
}

export async function listSources(options: { activeOnly?: boolean } = {}) {
  const whereSql = options.activeOnly ? 'WHERE "isActive" = 1' : '';
  const result = await execute(
    `
      SELECT * FROM "Source"
      ${whereSql}
      ORDER BY "createdAt" DESC, "name" ASC
    `
  );

  return result.rows.map(mapSource);
}

export async function listActiveSources(): Promise<FeedSource[]> {
  const sources = await listSources({ activeOnly: true });
  return sources.map((source) => ({
    name: source.name,
    slug: source.slug,
    feedUrl: source.feedUrl,
    siteUrl: source.siteUrl,
    defaultCategory: source.defaultCategory,
    language: source.language,
  }));
}

async function findSourceBySlug(slug: string) {
  const result = await execute(
    'SELECT * FROM "Source" WHERE "slug" = ? LIMIT 1',
    [slug]
  );
  const row = result.rows[0];
  return row ? mapSource(row) : null;
}

async function findSourceById(id: string) {
  const result = await execute(
    'SELECT * FROM "Source" WHERE "id" = ? LIMIT 1',
    [id]
  );
  const row = result.rows[0];
  return row ? mapSource(row) : null;
}

export async function createSource(input: CreateSourceInput) {
  const existing = await findSourceBySlug(input.slug);
  if (existing) {
    throw createDbError('SOURCE_SLUG_EXISTS', 'Source slug already exists');
  }

  const now = new Date().toISOString();
  const source: SourceRecord = {
    id: randomUUID(),
    name: input.name,
    slug: input.slug,
    feedUrl: input.feedUrl,
    siteUrl: input.siteUrl,
    defaultCategory: input.defaultCategory,
    language: input.language ?? 'bn',
    isActive: input.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };

  await execute(
    `
      INSERT INTO "Source" (
        "id", "name", "slug", "feedUrl", "siteUrl",
        "defaultCategory", "language", "isActive", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      source.id,
      source.name,
      source.slug,
      source.feedUrl,
      source.siteUrl,
      source.defaultCategory,
      source.language,
      source.isActive ? 1 : 0,
      source.createdAt,
      source.updatedAt,
    ]
  );

  return source;
}

export async function updateSource(id: string, updates: UpdateSourceInput) {
  const existing = await findSourceById(id);
  if (!existing) {
    throw createDbError('NOT_FOUND', 'Source not found');
  }

  const assignments: string[] = [];
  const args: InValue[] = [];

  const addAssignment = (column: string, value: InValue) => {
    assignments.push(`"${column}" = ?`);
    args.push(value);
  };

  if (updates.name !== undefined) addAssignment('name', updates.name);
  if (updates.feedUrl !== undefined) addAssignment('feedUrl', updates.feedUrl);
  if (updates.siteUrl !== undefined) addAssignment('siteUrl', updates.siteUrl);
  if (updates.defaultCategory !== undefined) addAssignment('defaultCategory', updates.defaultCategory);
  if (updates.language !== undefined) addAssignment('language', updates.language);
  if (updates.isActive !== undefined) addAssignment('isActive', updates.isActive ? 1 : 0);

  if (assignments.length === 0) {
    return existing;
  }

  addAssignment('updatedAt', new Date().toISOString());
  args.push(id);

  await execute(
    `UPDATE "Source" SET ${assignments.join(', ')} WHERE "id" = ?`,
    args
  );

  return (await findSourceById(id)) as SourceRecord;
}

export async function deleteSource(id: string) {
  const result = await execute('DELETE FROM "Source" WHERE "id" = ?', [id]);
  if (result.rowsAffected === 0) {
    throw createDbError('NOT_FOUND', 'Source not found');
  }
}

export async function countActiveSources() {
  const result = await execute(
    'SELECT COUNT(*) AS count FROM "Source" WHERE "isActive" = 1'
  );
  return asNumber(result.rows[0]?.count);
}

export async function findUserByEmail(email: string) {
  const result = await execute(
    'SELECT * FROM "User" WHERE "email" = ? LIMIT 1',
    [email]
  );
  const row = result.rows[0];
  return row ? mapUser(row) : null;
}

export async function createFetchLog(input: {
  totalNew: number;
  errors: number;
  results: string;
}) {
  const log: FetchLogRecord = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    totalNew: input.totalNew,
    errors: input.errors,
    results: input.results,
  };

  await execute(
    `
      INSERT INTO "FetchLog" (
        "id", "timestamp", "totalNew", "errors", "results"
      ) VALUES (?, ?, ?, ?, ?)
    `,
    [log.id, log.timestamp, log.totalNew, log.errors, log.results]
  );

  return log;
}

export async function getLatestFetchLog() {
  const result = await execute(
    'SELECT * FROM "FetchLog" ORDER BY "timestamp" DESC LIMIT 1'
  );
  const row = result.rows[0];
  return row ? mapFetchLog(row) : null;
}

export async function listFetchLogs(limit = 10) {
  const result = await execute(
    `
      SELECT * FROM "FetchLog"
      ORDER BY "timestamp" DESC
      LIMIT ?
    `,
    [limit]
  );

  return result.rows.map(mapFetchLog);
}

export function getDatabaseMode() {
  return {
    url: databaseUrl,
    remote: usesRemoteDatabase,
  };
}
