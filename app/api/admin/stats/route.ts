import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Check auth
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalArticles = await prisma.article.count();
    const lastLog = await prisma.fetchLog.findFirst({ orderBy: { timestamp: 'desc' } });
    const recentLogs = await prisma.fetchLog.findMany({ orderBy: { timestamp: 'desc' }, take: 10 });
    
    // Grouping manually since Prisma SQLite group by can be limited
    const categories = await prisma.article.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } }
    });
    
    const sources = await prisma.article.groupBy({
      by: ['source'],
      _count: { source: true },
      orderBy: { _count: { source: 'desc' } }
    });

    return NextResponse.json({
      totalArticles,
      lastFetch: lastLog?.timestamp || null,
      totalSources: 5,
      categoryBreakdown: categories.map(c => ({ _id: c.category, count: c._count.category })),
      sourceBreakdown: sources.map(s => ({ _id: s.source, count: s._count.source })),
      recentLogs: recentLogs.map(l => ({
        timestamp: l.timestamp,
        totalNew: l.totalNew,
        results: JSON.parse(l.results)
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
