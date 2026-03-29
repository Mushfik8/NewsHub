import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const category = searchParams.get('category') || '';
    const source = searchParams.get('source') || '';
    const q = searchParams.get('q') || '';
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && category !== 'সব') where.category = category;
    if (source) where.sourceSlug = source;
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } }
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles: articles.map((a: any) => ({ ...a, _id: a.id })), // Map id to _id for frontend compatibility
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error('[API /news]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
