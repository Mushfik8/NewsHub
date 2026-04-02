/**
 * POST /api/admin/login
 * Force Node.js runtime — bcrypt requires Node crypto
 */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ইমেইল এবং পাসওয়ার্ড দিন' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'ভুল ইমেইল বা পাসওয়ার্ড' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: 'ভুল ইমেইল বা পাসওয়ার্ড' },
        { status: 401 }
      );
    }

    const token = await signToken({ id: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      message: 'সফলভাবে লগইন হয়েছে',
    });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error('[Login Error]', error);
    return NextResponse.json(
      { error: 'সার্ভার ত্রুটি হয়েছে' },
      { status: 500 }
    );
  }
}
