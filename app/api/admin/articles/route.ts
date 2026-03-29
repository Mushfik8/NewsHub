/**
 * GET /api/admin/articles — List articles for admin dashboard
 * Force Node.js runtime — Prisma requires Node.js
 */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10));
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          source: true,
          views: true,
          publishedAt: true,
          category: true,
          originalLink: true,
        },
      }),
      prisma.article.count(),
    ]);

    return NextResponse.json({
      articles: articles.map((a) => ({ ...a, _id: a.id })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('[Articles Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID দিন' }, { status: 400 });
    }
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Delete Article Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
