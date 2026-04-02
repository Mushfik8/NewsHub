/**
 * /api/admin/sources — Manage news sources from admin dashboard
 * Force Node.js runtime for SQL access.
 */
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import {
  createSource,
  deleteSource,
  listSources,
  type UpdateSourceInput,
  updateSource,
} from '@/lib/db';

export async function GET() {
  try {
    const sources = await listSources();
    return NextResponse.json({ sources });
  } catch (error: any) {
    console.error('[Sources GET Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const source = await createSource({
      name,
      slug,
      feedUrl,
      siteUrl,
      defaultCategory,
      language,
      isActive,
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'SOURCE_SLUG_EXISTS') {
      return NextResponse.json({ error: 'এই slug আগে থেকেই আছে' }, { status: 409 });
    }
    console.error('[Sources POST Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID দিন' }, { status: 400 });
    }

    const allowedUpdates: UpdateSourceInput = {};

    if ('name' in updates) allowedUpdates.name = updates.name;
    if ('feedUrl' in updates) allowedUpdates.feedUrl = updates.feedUrl;
    if ('siteUrl' in updates) allowedUpdates.siteUrl = updates.siteUrl;
    if ('defaultCategory' in updates) allowedUpdates.defaultCategory = updates.defaultCategory;
    if ('language' in updates) allowedUpdates.language = updates.language;
    if ('isActive' in updates) allowedUpdates.isActive = updates.isActive;

    const source = await updateSource(id, allowedUpdates);
    return NextResponse.json({ source });
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }
    console.error('[Sources PATCH Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID দিন' }, { status: 400 });
    }

    await deleteSource(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }
    console.error('[Sources DELETE Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
