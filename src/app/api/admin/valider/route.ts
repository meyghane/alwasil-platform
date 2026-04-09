import { NextRequest, NextResponse } from 'next/server';
import { verifyValidationToken } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const token  = req.nextUrl.searchParams.get('token');
  const action = req.nextUrl.searchParams.get('action');

  if (!token) {
    return new NextResponse('Token manquant', { status: 400 });
  }

  const result = verifyValidationToken(token);
  if (!result) {
    return new NextResponse('Token invalide ou expiré', { status: 400 });
  }

  const { data } = result;
  const now = new Date().toISOString();

  if (action === 'rejeter') {
    return new NextResponse(html('❌ Fiche rejetée', `La fiche "${data.id}" a été rejetée.`, '#ef4444'), {
      headers: { 'content-type': 'text/html' },
    });
  }

  // Écrire dans Google Sheet via Apps Script webhook
  const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetTab: data.sheetTab,
          row: { ...data, publishedAt: now },
        }),
      });
    } catch (e) {
      console.error('[valider] Apps Script webhook error:', e);
    }
  }

  // Enregistrer dans l'historique (fichier JSON local en dev, Sheet "Historique" en prod)
  try {
    const histWebhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (histWebhookUrl) {
      await fetch(histWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetTab: 'Historique',
          row: {
            id:          data.id,
            categorie:   data.categorie,
            sheetTab:    data.sheetTab,
            nom:         data.name || data.title || data.nom || '',
            action:      'PUBLICATION',
            date:        now,
          },
        }),
      });
    }
  } catch {}

  return new NextResponse(
    html('✅ Fiche publiée !', `La fiche a été ajoutée dans l'onglet <strong>${data.sheetTab}</strong>.<br>Elle sera visible sur le site dans la prochaine heure.`, '#00bf63'),
    { headers: { 'content-type': 'text/html' } }
  );
}

function html(title: string, message: string, color: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb">
  <div style="background:white;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="font-size:3rem;margin-bottom:16px">${title.split(' ')[0]}</div>
    <h1 style="font-size:1.5rem;margin:0 0 12px;color:#0a0a0a">${title.slice(2)}</h1>
    <p style="color:#6b7280;line-height:1.6">${message}</p>
    <a href="/admin" style="display:inline-block;margin-top:24px;background:${color};color:white;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600">
      Retour à l'admin
    </a>
  </div>
</body>
</html>`;
}
