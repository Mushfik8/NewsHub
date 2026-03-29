import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categoriesResult = await prisma.article.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    
    const categories = categoriesResult
      .map(c => c.category)
      .filter(c => c && c.trim().length > 0)
      .sort((a, b) => a.localeCompare(b, 'bn'));

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
