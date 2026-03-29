/**
 * /api/cron/fetch — RSS fetch trigger
 *
 * Supports two callers:
 * 1. Vercel Cron Job → GET request with Authorization: Bearer <CRON_SECRET> header
 * 2. Admin manual trigger → POST request with valid admin_token cookie
 *
 * Force Node.js runtime — Prisma cannot run in Edge.
 */
export const runtime = 'nodejs';
export const maxDuration = 60; // 60s timeout for Vercel Hobby plan (paid plans can set higher)

import { NextRequest, NextResponse } from 'next/server';
import { runFetchJob } from '@/lib/rss';
import { verifyToken } from '@/lib/auth';

async function handleFetch(request: NextRequest) {
  // Check 1: Admin cookie (manual trigger from dashboard)
  const token = request.cookies.get('admin_token')?.value;
  const isAdmin = token ? !!(await verifyToken(token)) : false;

  if (!isAdmin) {
    // Check 2: Cron secret header (Vercel scheduled cron)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const result = await runFetchJob();
    return NextResponse.json({
      success: true,
      message: `ফেচ সফল হয়েছে। নতুন সংবাদ: ${result.totalNew}টি`,
      totalNew: result.totalNew,
      details: result.results,
    });
  } catch (error: any) {
    console.error('[CRON ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Vercel Cron calls GET
export async function GET(request: NextRequest) {
  return handleFetch(request);
}

// Admin dashboard calls POST
export async function POST(request: NextRequest) {
  return handleFetch(request);
}
