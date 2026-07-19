// /api/moderate?token=xxx&id=yyy&action=approve|reject&tab=soumissions_events
// Appelé depuis les boutons dans l'email digest quotidien
// Retourne une page HTML de confirmation (pas de JSON)

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.MODERATE_SECRET || 'alwasil-moderate-2026';
const APPS_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-wasil.fr';

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
    <a href="${SITE_URL}/admin/soumissions">Retour au dashboard</a>
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
  const tab = searchParams.get('tab') || '';

  // Validate params
  if (!token || !id || !action || !tab) {
    return htmlPage('Lien invalide', 'Ce lien est incomplet ou mal formé.', '#6b7280', 'L');
  }

  if (!['approve', 'reject'].includes(action)) {
    return htmlPage('Action inconnue', 'Action non reconnue.', '#6b7280', 'L');
  }

  // Token is 64 hex chars
  if (!/^[0-9a-f]{64}$/i.test(token)) {
    return htmlPage('Lien invalide', 'Token mal forme.', '#ef4444', 'X');
  }

  // Verify HMAC
  let valid = false;
  try {
    valid = verifyToken(token, id, action);
  } catch {
    return htmlPage('Lien expire', 'Ce lien a expire. Les liens sont valides uniquement le jour de reception de l\'email.', '#f59e0b', '!');
  }

  if (!valid) {
    return htmlPage('Lien expire ou invalide', 'Ce lien n\'est plus valide. Retournez au dashboard pour moderer manuellement.', '#ef4444', 'X');
  }

  // Update status in Google Sheets via Apps Script
  if (APPS_URL) {
    const newStatus = action === 'approve' ? 'validé' : 'refusé';
    try {
      await fetch(APPS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          sheetTab: tab,
          id,
          status: newStatus,
        }),
      });
    } catch (e) {
      console.error('[moderate] Apps Script update error:', e);
    }

    // If approved: trigger Apps Script to move to PUBLIC sheet
    if (action === 'approve') {
      try {
        await fetch(APPS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'publishItem',
            sheetTab: tab,
            id,
          }),
        });
      } catch {}

      // Revalidate site cache
      if (REVALIDATE_SECRET) {
        const pageToRevalidate = tab.includes('event') ? '/events'
          : tab.includes('solidar') || tab.includes('cagnotte') ? '/solidarity'
          : tab.includes('education') ? '/education'
          : '/';
        fetch(`${SITE_URL}/api/revalidate?secret=${REVALIDATE_SECRET}&path=${pageToRevalidate}`).catch(() => {});
      }
    }
  }

  if (action === 'approve') {
    return htmlPage(
      'Valide !',
      'L\'element a ete valide et sera publie sur Al-Wasil dans quelques instants.',
      '#059669',
      'O'
    );
  } else {
    return htmlPage(
      'Refuse',
      'L\'element a ete refuse et ne sera pas publie. Il reste visible dans le dashboard admin.',
      '#6b7280',
      'X'
    );
  }
}
