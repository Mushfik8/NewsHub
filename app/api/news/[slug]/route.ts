import { NextRequest, NextResponse } from 'next/server';
import { findArticleBySlug, incrementArticleViews } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const article = await findArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    incrementArticleViews(article.id).catch(console.error);

    return NextResponse.json({
      ...article,
      _id: article.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
