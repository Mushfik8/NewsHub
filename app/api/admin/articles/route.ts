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
    const articles = await prisma.article.findMany({
      orderBy: { views: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        slug: true,
        source: true,
        views: true,
        publishedAt: true,
        category: true,
      }
    });

    return NextResponse.json({ articles: articles.map(a => ({ ...a, _id: a.id })) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
