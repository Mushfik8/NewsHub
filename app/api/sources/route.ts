import { NextResponse } from 'next/server';
import { listSources } from '@/lib/db';
import { DEFAULT_SOURCES } from '@/lib/sources';

export async function GET() {
  try {
    const dbSources = await listSources({ activeOnly: true });
    return NextResponse.json({
      sources: dbSources.length > 0 ? dbSources : DEFAULT_SOURCES,
    });
  } catch {
    return NextResponse.json({ sources: DEFAULT_SOURCES });
  }
}
