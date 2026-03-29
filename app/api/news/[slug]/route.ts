import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const slug = (await params).slug;
    const article = await prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    // Fire and forget view increment
    prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    }).catch(console.error);

    return NextResponse.json({
      ...article,
      _id: article.id // Map id for frontend compatibility
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
