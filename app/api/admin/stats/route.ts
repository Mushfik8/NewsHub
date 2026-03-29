/**
 * GET /api/admin/stats
 * Force Node.js runtime — Prisma requires Node.js
 */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalArticles, lastLog, recentLogs, categories, sources, totalSources] =
      await Promise.all([
        prisma.article.count(),
        prisma.fetchLog.findFirst({ orderBy: { timestamp: 'desc' } }),
        prisma.fetchLog.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
        prisma.article.groupBy({
          by: ['category'],
          _count: { category: true },
          orderBy: { _count: { category: 'desc' } },
        }),
        prisma.article.groupBy({
          by: ['source'],
          _count: { source: true },
          orderBy: { _count: { source: 'desc' } },
        }),
        prisma.source.count({ where: { isActive: true } }),
      ]);

    return NextResponse.json({
      totalArticles,
      lastFetch: lastLog?.timestamp ?? null,
      totalSources,
      categoryBreakdown: categories.map((c) => ({
        _id: c.category,
        count: c._count.category,
      })),
      sourceBreakdown: sources.map((s) => ({
        _id: s.source,
        count: s._count.source,
      })),
      recentLogs: recentLogs.map((l) => ({
        timestamp: l.timestamp,
        totalNew: l.totalNew,
        errors: l.errors,
        results: (() => {
          try { return JSON.parse(l.results); } catch { return []; }
        })(),
      })),
    });
  } catch (error: any) {
    console.error('[Stats Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
