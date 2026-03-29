/**
 * /api/admin/sources — Manage news sources from admin dashboard
 * Force Node.js runtime — Prisma requires Node.js
 */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — list all sources
export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ sources });
  } catch (error: any) {
    console.error('[Sources GET Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, feedUrl, siteUrl, defaultCategory, language, isActive } = body;

    if (!name || !slug || !feedUrl || !siteUrl || !defaultCategory) {
      return NextResponse.json(
        { error: 'সব তথ্য দিন (name, slug, feedUrl, siteUrl, defaultCategory)' },
        { status: 400 }
      );
    }

    const source = await prisma.source.create({
      data: {
        name,
        slug,
        feedUrl,
        siteUrl,
        defaultCategory,
        language: language ?? 'bn',
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('Unique constraint')) {
      return NextResponse.json({ error: 'এই slug আগে থেকেই আছে' }, { status: 409 });
    }
    console.error('[Sources POST Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update a source
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID দিন' }, { status: 400 });
    }

    // Only allow specific fields to be updated
    const allowedUpdates: Record<string, unknown> = {};
    const allowed = ['name', 'feedUrl', 'siteUrl', 'defaultCategory', 'language', 'isActive'];
    for (const key of allowed) {
      if (key in updates) allowedUpdates[key] = updates[key];
    }

    const source = await prisma.source.update({
      where: { id },
      data: allowedUpdates,
    });

    return NextResponse.json({ source });
  } catch (error: any) {
    console.error('[Sources PATCH Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove a source
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID দিন' }, { status: 400 });
    }
    await prisma.source.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Sources DELETE Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
