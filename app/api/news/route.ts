import { NextRequest, NextResponse } from 'next/server';
import { listArticles } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20', 10));
    const category = searchParams.get('category') || '';
    const source = searchParams.get('source') || '';
    const q = searchParams.get('q') || '';
    const skip = (page - 1) * limit;

    const { items: articles, total } = await listArticles({
      category: category && category !== 'সব' ? category : undefined,
      sourceSlug: source || undefined,
      query: q || undefined,
      limit,
      offset: skip,
      // Diversity: Limit to 3 articles per source on the home page (when not filtering by source)
      rankLimit: source ? undefined : 3, 
    });

    return NextResponse.json({
      articles: articles.map((article) => ({ ...article, _id: article.id })),
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
