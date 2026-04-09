import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn, createValidationToken } from '@/lib/admin-auth';
import { CATEGORY_FORMS } from '@/lib/admin-forms';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { categorie, data } = await req.json();
  const form = CATEGORY_FORMS[categorie];
  if (!form) {
    return NextResponse.json({ error: 'Catégorie inconnue' }, { status: 400 });
  }

  // Générer un id unique
  const id = `${categorie}-${Date.now()}`;
  const fullData = { ...data, id, categorie, sheetTab: form.sheetTab };

  // Token de validation (valide 24h)
  const token = await createValidationToken(fullData);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://al-wasil.fr';
  const validateUrl = `${baseUrl}/api/admin/valider?token=${token}&action=valider`;
  const rejectUrl  = `${baseUrl}/api/admin/valider?token=${token}&action=rejeter`;

  // Résumé des champs pour l'email
  const fieldsHtml = Object.entries(data)
    .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:600;color:#555">${k}</td><td style="padding:4px 8px">${v || '—'}</td></tr>`)
    .join('');

  await resend.emails.send({
    from: 'Al-Wasil Admin <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL || 'al-wasil@hotmail.com',
    subject: `[Al-Wasil] Nouvelle fiche à valider — ${form.emoji} ${form.label}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0a0a0a;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:1.2rem">Al-Wasil — Validation requise</h1>
        </div>
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px">Une nouvelle fiche <strong>${form.emoji} ${form.label}</strong> est en attente de validation :</p>
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin-bottom:24px">
            ${fieldsHtml}
          </table>
          <div style="display:flex;gap:12px">
            <a href="${validateUrl}" style="display:inline-block;background:#00bf63;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem">
              ✅ Valider et publier
            </a>
            <a href="${rejectUrl}" style="display:inline-block;background:#ef4444;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem">
              ❌ Rejeter
            </a>
          </div>
          <p style="margin-top:16px;font-size:0.75rem;color:#9ca3af">Ce lien expire dans 24h.</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, message: 'Email de validation envoyé !' });
}
