import { NextRequest, NextResponse } from 'next/server';
import { listItems } from '@/lib/store';
import { requireAuth, withCors } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export async function OPTIONS() { return withCors(NextResponse.json({ ok: true })); }
export async function GET(req: NextRequest) {
  const unauth = requireAuth(req); if (unauth) return withCors(unauth);
  const items = await listItems('memories');
  return withCors(NextResponse.json({ ok: true, memories: items }));
}
