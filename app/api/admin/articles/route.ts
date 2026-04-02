/**
 * GET /api/admin/articles — List articles for admin dashboard
 * Force Node.js runtime for SQL access.
 */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { deleteArticle, listArticles } from '@/lib/db';

type AdminArticleListItem = {
  id: string;
  title: string;
  slug: string;
  source: string;
  views: number;
  publishedAt: string;
  category: string;
  originalLink: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10));
    const skip = (page - 1) * limit;

    const { items: articles, total } = await listArticles({
      limit,
      offset: skip,
    });

    return NextResponse.json({
      articles: articles.map((article: AdminArticleListItem) => ({
        ...article,
        _id: article.id,
      })),
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

    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    console.error('[Delete Article Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
