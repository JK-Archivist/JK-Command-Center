import { NextRequest, NextResponse } from 'next/server';

export function requireAuth(req: NextRequest): NextResponse | null {
  const header = req.headers.get('authorization') || '';
  const token = process.env.MISSION_CONTROL_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
  const ok = header.startsWith('Bearer ') && header.slice(7).trim() === token;
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

export function withCors(res: NextResponse) {
  const origins = (process.env.MISSION_CONTROL_CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (origins.length) {
    res.headers.set('Access-Control-Allow-Origin', origins[0]);
    res.headers.set('Vary', 'Origin');
  }
  res.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  return res;
}
