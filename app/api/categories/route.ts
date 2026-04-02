import { NextResponse } from 'next/server';
import { listDistinctCategories } from '@/lib/db';

export async function GET() {
  try {
    const categories = (await listDistinctCategories())
      .filter((c: string) => c && c.trim().length > 0)
      .sort((a: string, b: string) => a.localeCompare(b, 'bn'));

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
