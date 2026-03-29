import { NextResponse } from 'next/server';
import { DEFAULT_SOURCES } from '@/lib/sources';

export async function GET() {
  return NextResponse.json({ sources: DEFAULT_SOURCES });
}
