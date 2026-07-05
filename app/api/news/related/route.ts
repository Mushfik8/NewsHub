import { NextRequest, NextResponse } from 'next/server';
import { listArticles } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const excludeSlug = searchParams.get('exclude') || '';
    const limit = Math.min(6, parseInt(searchParams.get('limit') || '3', 10));

    if (!category) {
      return NextResponse.json({ articles: [] });
    }

    const { items } = await listArticles({
      category,
      limit: limit + 1, // Fetch one extra in case we need to exclude
    });

    const filtered = items
      .filter((a) => a.slug !== excludeSlug)
      .slice(0, limit)
      .map((a) => ({ ...a, _id: a.id }));

    return NextResponse.json({ articles: filtered });
  } catch (error: any) {
    console.error('[API /news/related]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
