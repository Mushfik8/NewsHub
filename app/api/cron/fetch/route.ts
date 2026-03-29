import { NextRequest, NextResponse } from 'next/server';
import { runFetchJob } from '@/lib/rss';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const isAdmin = token ? await verifyToken(token) : false;

  // Allow if admin is logged in, OR if valid cron secret is provided
  if (!isAdmin && (process.env.CRON_SECRET || process.env.NODE_ENV === 'production')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized manual fetch' }, { status: 401 });
    }
  }

  try {
    const result = await runFetchJob();
    return NextResponse.json({
      success: true,
      message: `ফেচ সফল হয়েছে। নতুন সংবাদ: ${result.totalNew}টি`,
      details: result.results,
    });
  } catch (error: any) {
    console.error('[CRON ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
