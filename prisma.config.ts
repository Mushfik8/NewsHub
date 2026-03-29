import path from 'node:path';
import { defineConfig } from 'prisma/config';

/**
 * prisma.config.ts — Prisma v7 configuration
 *
 * In Prisma v7, the `url` in schema.prisma's datasource block is REMOVED.
 * Instead, configure via prisma.config.ts.
 *
 * For libSQL (Turso) the adapter is passed to PrismaClient() in lib/prisma.ts.
 * Here we define the schema path and (optionally) the datasource URL for migrate/introspect.
 */
export default defineConfig({
  schema: path.join(import.meta.dirname, 'prisma/schema.prisma'),

  // datasource.url is used by Prisma CLI (migrate, introspect) only.
  // Runtime connection is handled via the adapter in lib/prisma.ts.
  datasource: {
    url:
      process.env.TURSO_DATABASE_URL ??
      `file:${path.join(import.meta.dirname, 'prisma/dev.db')}`,
  },
});
