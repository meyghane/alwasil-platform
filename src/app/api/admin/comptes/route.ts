// GET  /api/admin/comptes → liste tous les comptes modo
// POST /api/admin/comptes → crée un compte modo
// PATCH /api/admin/comptes → met à jour un compte (droits, actif)
// DELETE /api/admin/comptes → désactive un compte

import { NextRequest, NextResponse } from 'next/server';
import { getUserSession, getModoAccountsFromEnv, ModoAccount, Permission, UserRole } from '@/lib/user-auth';
import { isAdminLoggedIn } from '@/lib/admin-auth';

const APPS_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';

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
  if (!(await assertAdmin())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { email, password, name, role, permissions } = await req.json();
  if (!email || !password || !name) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });

  const newAccount: ModoAccount = {
    id: `modo-${Date.now()}`,
    email,
    password,
    name,
    role: (role as UserRole) || 'modo',
    permissions: (permissions as Permission[]) || ['all'],
    actif: true,
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  };

  if (APPS_URL) {
    try {
      await fetch(APPS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createUser', user: newAccount }),
      });
    } catch { /* Apps Script indisponible */ }
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
