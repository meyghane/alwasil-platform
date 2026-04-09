import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, getSessionCookieName, getSessionMaxAge } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: getSessionMaxAge(),
    path: '/',
  });
  return res;
}
