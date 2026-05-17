// GET  /api/admin/soumissions → liste toutes les soumissions depuis Apps Script
// PATCH /api/admin/soumissions → met à jour le status d'une soumission

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession } from '@/lib/user-auth';

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';

async function isAuthorized() {
  return (await isAdminLoggedIn()) || !!(await getUserSession());
}

// Lire depuis le Sheet "Soumissions"
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    // Appelle l'Apps Script pour lire les soumissions
    const res = await fetch(`${APPS_SCRIPT_URL}?action=list`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      // Fallback : retourne des données vides si l'Apps Script n'est pas déployé
      return NextResponse.json({ soumissions: [], source: 'fallback' });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ soumissions: [], error: 'Apps Script non disponible' });
  }
}

// Mettre à jour le status d'une soumission
export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'id et status requis' }, { status: 400 });
  }

  if (!['en ligne', 'pas en ligne', 'à vérifier', 'expiré'].includes(status)) {
    return NextResponse.json({ error: 'Status invalide' }, { status: 400 });
  }

  try {
    // Met à jour via Apps Script
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateStatus',
        id,
        status,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Erreur Apps Script' }, { status: 500 });
    }

    // Si "en ligne" → invalider le cache du site
    if (status === 'en ligne') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://alwasil-platform.vercel.app'}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-secret': process.env.REVALIDATE_SECRET || '',
          },
          body: JSON.stringify({ paths: ['/', '/events', '/education', '/piscines', '/jobs', '/solidarity'] }),
        });
      } catch {
        // Revalidation non critique
      }
    }

    return NextResponse.json({ ok: true, id, status });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
