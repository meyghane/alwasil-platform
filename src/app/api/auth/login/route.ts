import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createUserToken, getUserCookieName, getUserMaxAge } from '@/lib/user-auth';

export async function POST(req: NextRequest) {
 let body: unknown;
 try { body = await req.json(); } catch { return NextResponse.json({ error: 'Requête invalide' }, { status: 400 }); }
 if (!body || typeof body !== 'object' || !('email' in body) || !('password' in body) || typeof body.email !== 'string' || typeof body.password !== 'string' || body.email.length > 254 || body.password.length > 1024) {
 return NextResponse.json({ error: 'Email et mot de passe invalides' }, { status: 400 });
 }
 const { email, password } = body;
 if ((process.env.ADMIN_SESSION_SECRET || '').length < 32) {
 return NextResponse.json({ error: 'Connexion temporairement indisponible. Contacter l’administration.' }, { status: 503 });
 }
 if (!email || !password) {
 return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
 }

 const session = await authenticateUser(email, password);
 if (!session) {
 return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
 }

 const token = await createUserToken(session);
 const res = NextResponse.json({ ok: true, role: session.role, name: session.name });
 res.cookies.set(getUserCookieName(), token, {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: 'lax',
 maxAge: getUserMaxAge(),
 path: '/',
 });
 return res;
}
