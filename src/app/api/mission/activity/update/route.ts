import { NextRequest, NextResponse } from 'next/server';
import { upsertItem } from '@/lib/store';
import { requireAuth, withCors } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return withCors(NextResponse.json({ ok: true }));
}

export async function POST(req: NextRequest) {
  const unauth = requireAuth(req);
  if (unauth) return withCors(unauth);
  try {
    const body = await req.json();
    const record = await upsertItem('activity', body);
    return withCors(NextResponse.json({ ok: true, activity: record }));
  } catch (e: unknown) {
    return withCors(NextResponse.json({ ok: false, error: (e instanceof Error ? e.message : 'error') }, { status: 400 }));
  }
}
