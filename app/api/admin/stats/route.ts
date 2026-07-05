/**
 * GET /api/admin/stats
 * Force Node.js runtime for SQL access and RSS tooling.
 */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import {
  countActiveSources,
  countArticles,
  getCategoryBreakdown,
  getLatestFetchLog,
  getPerSourceArticleCounts,
  getSourceBreakdown,
  listFetchLogs,
  listSourceHealth,
} from '@/lib/db';

export async function GET() {
  try {
    const [totalArticles, lastLog, recentLogs, categories, sources, totalSources, sourceHealth, perSourceCounts] =
      await Promise.all([
        countArticles(),
        getLatestFetchLog(),
        listFetchLogs(10),
        getCategoryBreakdown(),
        getSourceBreakdown(),
        countActiveSources(),
        listSourceHealth(),
        getPerSourceArticleCounts(),
      ]);

    return NextResponse.json({
      totalArticles,
      lastFetch: lastLog?.timestamp ?? null,
      totalSources,
      categoryBreakdown: categories.map((category) => ({
        _id: category.category,
        count: category.count,
      })),
      sourceBreakdown: sources.map((source) => ({
        _id: source.source,
        count: source.count,
      })),
      recentLogs: recentLogs.map((log) => ({
        timestamp: log.timestamp,
        totalNew: log.totalNew,
        errors: log.errors,
        results: (() => {
          try {
            return JSON.parse(log.results);
          } catch {
            return [];
          }
        })(),
      })),
      sourceHealth: sourceHealth.map((sh) => ({
        sourceSlug: sh.sourceSlug,
        lastSuccessAt: sh.lastSuccessAt,
        lastErrorAt: sh.lastErrorAt,
        lastError: sh.lastError,
        articleCount: sh.articleCount,
        consecutiveFailures: sh.consecutiveFailures,
        updatedAt: sh.updatedAt,
      })),
      perSourceCounts: perSourceCounts.map((psc) => ({
        sourceSlug: psc.sourceSlug,
        source: psc.source,
        count: psc.count,
        latestAt: psc.latestAt,
      })),
    });
  } catch (error: any) {
    console.error('[Stats Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
