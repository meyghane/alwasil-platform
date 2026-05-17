import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createUserToken, getUserCookieName, getUserMaxAge } from '@/lib/user-auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const session = await authenticateUser(email, password);
  if (!session) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  const token = await createUserToken(session);
  const res   = NextResponse.json({ ok: true, role: session.role });

  res.cookies.set(getUserCookieName(), token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   getUserMaxAge(),
    path:     '/',
  });

  return res;
}
