// GET /api/admin/comptes → liste tous les comptes modo
// POST /api/admin/comptes → crée un compte modo
// PATCH /api/admin/comptes → met à jour un compte (droits, actif)
// DELETE /api/admin/comptes → désactive un compte

import { NextRequest, NextResponse } from 'next/server';
import { getUserSession, getModoAccountsFromEnv, ModoAccount, Permission, UserRole } from '@/lib/user-auth';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { createHmac } from 'node:crypto';

const APPS_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';

async function sha256(value: string): Promise<string> {
 const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
 return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function assertAdmin() {
 if (await isAdminLoggedIn()) return true;
 const session = await getUserSession();
 return !!(session && session.role === 'admin');
}

export async function GET() {
 if (!(await assertAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

 // Comptes depuis env var (test)
 const envAccounts = getModoAccountsFromEnv();

 // Comptes depuis Apps Script (Sheet "Comptes")
 let sheetAccounts: ModoAccount[] = [];
 if (APPS_URL) {
 try {
 const res = await fetch(`${APPS_URL}?action=listUsers`, { cache: 'no-store' });
 if (res.ok) {
 const data = await res.json();
 sheetAccounts = data.users || [];
 }
 } catch { /* Apps Script indisponible */ }
 }

 // Fusionner (sheet en priorité, env en fallback)
 const allAccounts = [...sheetAccounts, ...envAccounts.filter(e => !sheetAccounts.find(s => s.email === e.email))];
 // Masquer les mots de passe
 const safe = allAccounts.map(({ password: _p, ...rest }) => rest);
 return NextResponse.json({ comptes: safe });
}

export async function POST(req: NextRequest) {
 const body = await req.json();
 const admin = await assertAdmin();
 let inviteData: { email: string; name?: string; role?: UserRole; permissions?: Permission[] } | null = null;
 if (!admin && typeof body._inviteToken === 'string') {
  const [payload, signature] = body._inviteToken.split('.');
  try {
   const secret = process.env.ADMIN_SESSION_SECRET || 'fallback';
   const expected = createHmac('sha256', secret).update(payload).digest('hex');
   const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
   if (signature === expected && decoded.email && decoded.exp && Date.now() <= decoded.exp) inviteData = decoded;
  } catch { /* token invalide */ }
 }
 if (!admin && !inviteData) return NextResponse.json({ error: 'Invitation invalide ou expirée' }, { status: 401 });

 const email = inviteData?.email || body.email;
 const password = body.password;
 const name = inviteData?.name || body.name;
 const role = inviteData?.role || body.role;
 const permissions = inviteData?.permissions || body.permissions;
 if (!email || !password || !name) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });

 const newAccount: ModoAccount = {
 id: `modo-${Date.now()}`,
 email,
 password: /^[a-f0-9]{64}$/i.test(password) ? password.toLowerCase() : await sha256(password),
 name,
 role: (role as UserRole) || 'modo',
 permissions: (permissions as Permission[]) || ['all'],
 actif: true,
 createdAt: new Date().toISOString(),
 createdBy: 'admin',
 };

 if (APPS_URL) {
 try {
 const response = await fetch(APPS_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ action: 'createUser', user: newAccount }),
 });
 const result = await response.json().catch(() => null);
 if (!response.ok || !result?.success) return NextResponse.json({ error: result?.error || 'Le compte n’a pas pu être enregistré.' }, { status: 502 });
 } catch { return NextResponse.json({ error: 'Le service de comptes est indisponible.' }, { status: 503 }); }
 } else {
  return NextResponse.json({ error: 'Le stockage des comptes n’est pas configuré.' }, { status: 503 });
 }

 return NextResponse.json({ ok: true, user: { ...newAccount, password: undefined } });
}

export async function PATCH(req: NextRequest) {
 if (!(await assertAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

 const body = await req.json();
 if (APPS_URL) {
 try {
 await fetch(APPS_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ action: 'updateUser', ...body }),
 });
 } catch { /* Apps Script indisponible */ }
 }
 return NextResponse.json({ ok: true });
}
