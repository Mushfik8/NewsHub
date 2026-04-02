/**
 * proxy.ts - Edge proxy for admin route protection
 *
 * IMPORTANT: This runs in the Edge Runtime.
 * - jose is Edge-compatible (pure JS, no Node crypto)
 * - Database code is NOT imported here (Node.js only)
 * - Only cookie-based JWT verification happens here
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /api/admin/* routes EXCEPT /api/admin/login and /api/admin/logout
  if (
    pathname.startsWith('/api/admin') &&
    !pathname.endsWith('/login') &&
    !pathname.endsWith('/logout')
  ) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match admin page and all admin API routes
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
