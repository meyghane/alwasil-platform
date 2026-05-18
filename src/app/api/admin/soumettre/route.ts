// POST /api/admin/soumettre
// Écrit la fiche dans l'onglet "Soumissions" du Google Sheet avec status "à vérifier"
// + email de notification simple (admin valide directement dans le Sheet)

import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession, hasPermission } from '@/lib/user-auth';
import { CATEGORY_FORMS } from '@/lib/admin-forms';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_PRIVE_ID || '1Lrx55hXR_fgAViZOT6B1fb72QXrVu7TgFxwZCkDwJeI'}/edit#gid=0`;

export async function POST(req: NextRequest) {
  // Accepte admin (ancien cookie) OU session modo/admin (nouveau cookie)
  const oldAdmin  = await isAdminLoggedIn();
  const userSess  = await getUserSession();
  const { categorie, data } = await req.json();

  if (!oldAdmin && !userSess) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (userSess && !hasPermission(userSess, categorie)) {
    return NextResponse.json({ error: 'Catégorie non autorisée pour ce compte' }, { status: 403 });
  }

  const soumis_par = userSess?.name || 'admin';
  const form = CATEGORY_FORMS[categorie];
  if (!form) {
    return NextResponse.json({ error: 'Catégorie inconnue' }, { status: 400 });
  }

  const id = `${categorie}-${Date.now()}`;
  const now = new Date().toISOString();

  const row = {
    id,
    categorie,
    destinationTab: form.sheetTab,
    status: 'à vérifier',
    soumis_le: now,
    soumis_par,
    ...data,
  };

  // ── VOIE 1 : Make.com webhook (AI + Sheet + Email) ─────────────
  const makeUrl = process.env.MAKE_WEBHOOK_URL;
  let sheetWriteOk = false;

  if (makeUrl) {
    try {
      const res = await fetch(makeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      });
      sheetWriteOk = res.ok;
    } catch (e) {
      console.error('[soumettre] Make webhook error:', e);
    }
  }

  // ── VOIE 2 : Apps Script (fallback si Make indisponible) ────────
  if (!sheetWriteOk) {
    const appsScriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (appsScriptUrl) {
      try {
        const res = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sheetTab: 'Soumissions', row }),
        });
        sheetWriteOk = res.ok;
      } catch (e) {
        console.error('[soumettre] Apps Script fallback error:', e);
      }
    }
  }

  // Email de notification (simple — admin valide dans le Sheet)
  const fieldsHtml = Object.entries(data)
    .map(([k, v]) => `<tr>
      <td style="padding:5px 10px;font-weight:600;color:#555;border-bottom:1px solid #f3f4f6">${k}</td>
      <td style="padding:5px 10px;color:#111;border-bottom:1px solid #f3f4f6">${String(v || '—')}</td>
    </tr>`)
    .join('');

  let emailError = '';
  try {
    const emailResult = await resend.emails.send({
      from: 'Al-Wasil <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'al-wasil@hotmail.com',
      subject: `[Al-Wasil] Nouvelle soumission à vérifier — ${form.emoji} ${form.label}`,
      html: `
        <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#fff">
          <div style="background:#0a0a0a;padding:20px 24px;border-radius:10px 10px 0 0;display:flex;align-items:center;gap:12px">
            <span style="font-size:1.5rem">${form.emoji}</span>
            <div>
              <h1 style="color:white;margin:0;font-size:1rem;font-weight:700">Nouvelle soumission — ${form.label}</h1>
              <p style="color:#9ca3af;margin:4px 0 0;font-size:0.8rem">Soumis le ${new Date(now).toLocaleString('fr-FR')}</p>
            </div>
          </div>

          <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px">
            <table style="width:100%;border-collapse:collapse;font-size:0.875rem;margin-bottom:24px;border:1px solid #f3f4f6;border-radius:8px;overflow:hidden">
              ${fieldsHtml}
            </table>

            <div style="background:#f0fdf4;border:1px solid #f0dea0;border-radius:8px;padding:16px;margin-bottom:20px">
              <p style="margin:0;font-size:0.875rem;color:#a87830;font-weight:600">Pour publier cette fiche sur le site :</p>
              <ol style="margin:8px 0 0;padding-left:20px;color:#8a6025;font-size:0.85rem;line-height:1.8">
                <li>Ouvrir le Google Sheet (bouton ci-dessous)</li>
                <li>Aller dans l'onglet <strong>"Soumissions"</strong></li>
                <li>Changer le statut de <code style="background:#fdfbf0;padding:1px 5px;border-radius:3px">"à vérifier"</code> → <code style="background:#fdfbf0;padding:1px 5px;border-radius:3px">"en ligne"</code></li>
                <li>L'Apps Script copie automatiquement la ligne dans l'onglet <strong>${form.sheetTab}</strong></li>
              </ol>
            </div>

            <a href="${SHEET_URL}" style="display:inline-block;background:#0a0a0a;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.9rem">
              📊 Ouvrir le Google Sheet
            </a>

            <p style="margin:16px 0 0;font-size:0.75rem;color:#9ca3af">
              Mettre <code>"pas en ligne"</code> pour rejeter. La fiche ne sera pas publiée sur le site.
            </p>
          </div>
        </div>
      `,
    });
    console.log('[soumettre] Resend result:', JSON.stringify(emailResult));
  } catch (e: unknown) {
    emailError = e instanceof Error ? e.message : String(e);
    console.error('[soumettre] Resend error:', emailError);
  }

  // ── Notification Telegram ────────────────────────────────────
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    try {
      const nom = (data.name || data.titre || data.nom || '(sans titre)') as string;
      const ville = (data.ville || data.city || '') as string;
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: `🔔 <b>Nouvelle soumission Al-Wasil</b>\n\n📁 <b>${form.label}</b>\n📝 ${nom}${ville ? `\n📍 ${ville}` : ''}\n\n👉 <a href="https://alwasil-platform.vercel.app/admin/soumissions">Valider maintenant</a>`,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });
    } catch (e) {
      console.error('[soumettre] Telegram error:', e);
    }
  }

  return NextResponse.json({
    ok: true,
    sheetWriteOk,
    emailSentTo: process.env.CONTACT_EMAIL || 'meyghvne@gmail.com',
    emailError: emailError || null,
    message: sheetWriteOk
      ? 'Fiche enregistrée dans le Sheet (onglet Soumissions) — email envoyé.'
      : 'Email envoyé. Vérifier la connexion Apps Script.',
  });
}
