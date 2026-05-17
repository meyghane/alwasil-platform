// POST /api/auth/change-password
// Le modo change son propre mot de passe
// → le nouveau mot de passe est haché SHA-256 avant stockage dans le Sheet
// → l'admin ne voit jamais le mot de passe en clair

import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/user-auth';

async function sha256(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { oldPassword, newPassword } = await req.json();
  if (!oldPassword || !newPassword) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
  if (newPassword.length < 6) return NextResponse.json({ error: 'Minimum 6 caractères' }, { status: 400 });

  const oldHash = await sha256(oldPassword);
  const newHash = await sha256(newPassword);

  // Vérifier l'ancien mot de passe via Apps Script
  const appsUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (!appsUrl) return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });

  try {
    // Vérifier que l'ancien mot de passe est correct
    const checkRes = await fetch(appsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: session.email, password: oldHash }),
    });
    const checkData = await checkRes.json();
    if (!checkData.success) {
      return NextResponse.json({ error: 'Ancien mot de passe incorrect' }, { status: 401 });
    }

    // Mettre à jour avec le nouveau hash
    await fetch(appsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updatePassword', email: session.email, newPassword: newHash }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
