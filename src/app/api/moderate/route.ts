// /api/moderate?token=xxx&id=<uuid>&action=approve|reject
// Appelé depuis les boutons dans l'email digest quotidien
// Retourne une page HTML de confirmation (pas de JSON)

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { items } from '@/db/schema';

const SECRET = process.env.MODERATE_SECRET || 'alwasil-moderate-2026';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-wasil.fr';

const CATEGORY_PATH: Record<string, string> = {
  event: '/events',
  job: '/jobs',
  solidarity: '/solidarity',
  institute: '/education',
  health: '/sante',
  library: '/librairies',
  pool: '/piscines',
  hajj: '/hajj',
};

function verifyToken(token: string, id: string, action: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const expected = crypto.createHmac('sha256', SECRET).update(`${id}:${action}:${today}`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
}

function htmlPage(title: string, message: string, color: string, icon: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} · Al-Wasil</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; background: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size: 56px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 10px; }
    p { font-size: 15px; color: #6b7280; line-height: 1.6; margin-bottom: 28px; }
    a { display: inline-block; background: ${color}; color: #fff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${SITE_URL}/admin">Retour au dashboard</a>
  </div>
</body>
</html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';
  const action = searchParams.get('action') || '';

  if (!token || !id || !action) {
    return htmlPage('Lien invalide', 'Ce lien est incomplet ou mal formé.', '#6b7280', 'L');
  }

  if (!['approve', 'reject'].includes(action)) {
    return htmlPage('Action inconnue', 'Action non reconnue.', '#6b7280', 'L');
  }

  if (!/^[0-9a-f]{64}$/i.test(token)) {
    return htmlPage('Lien invalide', 'Token mal formé.', '#ef4444', 'X');
  }

  let valid = false;
  try {
    valid = verifyToken(token, id, action);
  } catch {
    return htmlPage('Lien expiré', "Ce lien a expiré. Les liens sont valides uniquement le jour de réception de l'email.", '#f59e0b', '!');
  }

  if (!valid) {
    return htmlPage('Lien expiré ou invalide', "Ce lien n'est plus valide. Retournez au dashboard pour modérer manuellement.", '#ef4444', 'X');
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  try {
    const [updated] = await db
      .update(items)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning({ category: items.category });

    if (updated) {
      const path = CATEGORY_PATH[updated.category] ?? '/';
      revalidatePath(path);
      revalidatePath('/');
    }
  } catch (e) {
    console.error('[moderate] DB update error:', e);
    return htmlPage('Erreur', "Une erreur est survenue lors de la mise à jour. Réessaie depuis le dashboard.", '#ef4444', 'X');
  }

  if (action === 'approve') {
    return htmlPage('Validé !', "L'élément a été validé et est publié sur Al-Wasil.", '#059669', 'O');
  }
  return htmlPage('Refusé', "L'élément a été refusé et ne sera pas publié.", '#6b7280', 'X');
}
