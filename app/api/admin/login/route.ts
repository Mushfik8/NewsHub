import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'ইমেইল এবং পাসওয়ার্ড দিন' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'ভুল ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'ভুল ইমেইল বা পাসওয়ার্ড' }, { status: 401 });
    }

    // Sign JWT
    const token = await signToken({ id: user.id, email: user.email });

    // Set HTTPOnly Cookie
    const response = NextResponse.json({ success: true, message: 'সফলভাবে লগইন হয়েছে' });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
