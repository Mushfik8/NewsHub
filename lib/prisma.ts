/**
 * lib/prisma.ts — Singleton Prisma client for Next.js (App Router)
 *
 * Prisma v7 + @prisma/adapter-libsql + @libsql/client
 * - In production (Turso): uses libSQL adapter with TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
 * - In development: uses local SQLite via libSQL file:// adapter
 * - Singleton pattern prevents multiple instances during hot-reload
 *
 * NOTE: In Prisma v7, the driver adapter pattern requires:
 *   createClient() from @libsql/client  →  new PrismaLibSql(libsql)  →  new PrismaClient({ adapter })
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const isTurso =
    typeof process.env.TURSO_DATABASE_URL === 'string' &&
    process.env.TURSO_DATABASE_URL.startsWith('libsql://');

  let adapterConfig: { url: string; authToken?: string };

  if (isTurso) {
    // Production: Turso cloud database
    adapterConfig = {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  } else {
    // Development: local SQLite file
    const dbPath = `${process.cwd()}/prisma/dev.db`;
    adapterConfig = { url: `file:${dbPath}` };
  }

  // In @prisma/adapter-libsql 7.x it expects a config object with url and authToken.
  const adapter = new PrismaLibSql(adapterConfig);
  return new PrismaClient({ adapter } as any);
}

export const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

// Persist singleton across hot-reloads in development only
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
