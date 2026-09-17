import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession, hasPermission } from '@/lib/user-auth';
import { CATEGORY_FORMS } from '@/lib/admin-forms';
import { ingestManualSubmission } from '@/lib/submission-ingest';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const oldAdmin = await isAdminLoggedIn();
  const session = await getUserSession();
  if (!oldAdmin && !session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  let body: { categorie?: string; data?: Record<string, unknown> };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }
  const categorie = body.categorie || '';
  const form = CATEGORY_FORMS[categorie];
  if (!form || !body.data || typeof body.data !== 'object' || Array.isArray(body.data)) {
    return NextResponse.json({ error: 'Catégorie ou données invalides' }, { status: 400 });
  }
  const missing = form.fields.filter(field => field.required && (body.data?.[field.key] === undefined || body.data[field.key] === null || String(body.data[field.key]).trim() === ''));
  if (missing.length) return NextResponse.json({ error: `Champs requis manquants : ${missing.map(field => field.label).join(', ')}` }, { status: 400 });
  if (session && !hasPermission(session, categorie)) return NextResponse.json({ error: 'Catégorie non autorisée' }, { status: 403 });
  try {
    const result = await ingestManualSubmission({ categoryKey: categorie, data: body.data, actor: session?.name || 'admin', source: 'admin_form' });
    if (result.duplicate) return NextResponse.json({ error: 'Fiche similaire déjà présente dans la modération', id: result.id }, { status: 409 });
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Al-Wasil <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL || 'al-wasil@hotmail.com',
        subject: `[Al-Wasil] Nouvelle fiche ${form.label} à vérifier`,
        text: `Une nouvelle fiche ${form.label} attend votre validation : https://al-wasil.fr/admin/soumissions\nIdentifiant : ${result.id}`,
      }).catch(error => console.error('[soumettre] notification email:', error));
    }
    return NextResponse.json({ ok: true, id: result.id, message: 'Fiche enregistrée dans la modération.' });
  } catch (error) {
    if (error instanceof Error && /^(Catégorie|Titre|URL)/.test(error.message)) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error('[soumettre] persistence error:', error);
    return NextResponse.json({ error: 'Enregistrement indisponible' }, { status: 503 });
  }
}
