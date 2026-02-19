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
    const record = await upsertItem('tasks', body);
    return withCors(NextResponse.json({ ok: true, task: record }));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error';
    return withCors(NextResponse.json({ ok: false, error: msg }, { status: 400 }));
  }
}
