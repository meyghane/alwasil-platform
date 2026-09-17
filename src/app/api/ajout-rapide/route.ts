import { NextRequest, NextResponse } from 'next/server';
import { isAdminLoggedIn } from '@/lib/admin-auth';
import { getUserSession, hasPermission } from '@/lib/user-auth';
import { ingestManualSubmission } from '@/lib/submission-ingest';

export async function POST(req: NextRequest) {
  const admin = await isAdminLoggedIn();
  const session = await getUserSession();
  if (!admin && !session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  let body: { texte?: string; url?: string; categorie?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }
  const texte = body.texte?.trim() || '';
  if (texte.length < 5 || texte.length > 5000) return NextResponse.json({ error: 'Description invalide' }, { status: 400 });
  if (!body.categorie) return NextResponse.json({ error: 'Choisis une catégorie' }, { status: 400 });
  if (session && !hasPermission(session, body.categorie)) return NextResponse.json({ error: 'Catégorie non autorisée' }, { status: 403 });
  const titre = texte.split(/[\n.!?]/)[0].slice(0, 120).trim() || texte.slice(0, 120);
  const fiche = { categorie: body.categorie, titre, description: texte, site_web: body.url || '', note_djamil: 'À compléter et vérifier avant publication.' };
  try {
    const result = await ingestManualSubmission({
      categoryKey: body.categorie, data: { ...fiche, texte_libre: texte, url_source: body.url || '' },
      actor: session?.name || 'admin', source: 'quick_add',
    });
    if (result.duplicate) return NextResponse.json({ error: 'Fiche similaire déjà présente', id: result.id }, { status: 409 });
    return NextResponse.json({ ok: true, id: result.id, fiche, auteur: session?.name || 'admin' });
  } catch (error) {
    if (error instanceof Error && /^(Catégorie|Titre|URL)/.test(error.message)) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error('[ajout-rapide] persistence error:', error);
    return NextResponse.json({ error: 'Enregistrement indisponible' }, { status: 503 });
  }
}
