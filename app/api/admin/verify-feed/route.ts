/**
 * POST /api/admin/verify-feed — Verify an RSS feed URL
 * Admin-authenticated only.
 */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { verifyFeed } from '@/lib/feed-verifier';

export async function POST(request: NextRequest) {
  // Auth check
  const token = request.cookies.get('admin_token')?.value;
  const isAdmin = token ? !!(await verifyToken(token)) : false;
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing feed URL' }, { status: 400 });
    }

    const result = await verifyFeed(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
