import { NextResponse } from 'next/server';
import { getUserCookieName } from '@/lib/user-auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getUserCookieName(), '', { maxAge: 0, path: '/' });
  return res;
}
