import { createHash, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/db';
import { automationErrors, formSubmissions, leadEvents, leads, reports } from '@/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { validateContactFields } from '@/lib/contact-validation';
import { getHajjPackages } from '@/lib/db-queries';
import { deliverRecordedEmail } from '@/lib/email-delivery';

const resend = new Resend(process.env.RESEND_API_KEY);
const FORM_TYPES = new Set(['initiative', 'evenement', 'profil-emploi', 'offre-emploi', 'cagnotte', 'librairie', 'revendiquer-librairie', 'piscine', 'correction', 'question-juridique', 'hajj-devis', 'avis', 'mosquee', 'suggestion', 'annonceur', 'general']);
const MAX_FIELDS = 40;

type ContactBody = {
  type?: unknown;
  fields?: unknown;
  offerId?: unknown;
  partnerId?: unknown;
  honeypot?: unknown;
  provenance?: { page?: unknown; campaign?: unknown; referrer?: unknown; utm?: unknown };
};

function clean(value: unknown, max = 2000): string {
  return typeof value === 'string' ? value.replace(/[\u2012\u2013\u2014]/g, ' - ').replace(/\s+/g, ' ').trim().slice(0, max) : '';
}
function hash(value: string): string { return createHash('sha256').update(value).digest('hex'); }
function clientIp(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ContactBody;
    const type = clean(body.type, 40);
    const fields = body.fields && typeof body.fields === 'object' && !Array.isArray(body.fields) ? body.fields as Record<string, unknown> : null;
    if (!FORM_TYPES.has(type) || !fields || Object.keys(fields).length > MAX_FIELDS) return NextResponse.json({ error: 'Formulaire invalide.' }, { status: 400 });
    if (clean(body.honeypot)) return NextResponse.json({ ok: true });
    const originalError = validateContactFields(type, fields);
    if (originalError) return NextResponse.json({ error: originalError }, { status: 400 });
    const requestedOfferId = clean(body.offerId, 80);
    const selectedOffer = type === 'hajj-devis' && requestedOfferId ? (await getHajjPackages()).find(offer => offer.id === requestedOfferId) : undefined;
    if (type === 'hajj-devis' && requestedOfferId && !selectedOffer) return NextResponse.json({ error: 'Cette offre n’est plus disponible. Recharge la page ou envoie une demande générale.' }, { status: 422 });
    if (type === 'hajj-devis' && body.partnerId && (!selectedOffer || clean(body.partnerId, 80) !== selectedOffer.agenceId)) return NextResponse.json({ error: 'Agence non vérifiée pour cette offre.' }, { status: 422 });

    const normalized = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, clean(value)]));
    const email = clean(normalized.email, 240);
    const validationError = validateContactFields(type, normalized);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const ipHash = hash(clientIp(req));
    // Une même personne doit pouvoir envoyer une nouvelle demande si son
    // projet change. Le fingerprint ne doit donc pas dépendre uniquement de
    // l'email : sinon tous les formulaires avec message vide sont fusionnés.
    const fingerprint = hash([
      type,
      requestedOfferId,
      email.toLowerCase(),
      clean(normalized.nom).toLowerCase(),
      clean(normalized.phone).replace(/\D/g, ''),
      clean(normalized.type).toLowerCase(),
      clean(normalized.budget).toLowerCase(),
      clean(normalized.ville_depart || normalized.depart).toLowerCase(),
      clean(normalized.titre).toLowerCase(),
      clean(normalized.message).toLowerCase(),
    ].join('|'));
    const recent = new Date(Date.now() - 30 * 60 * 1000);
    const [duplicate] = await db.select({ id: formSubmissions.id }).from(formSubmissions).where(and(eq(formSubmissions.fingerprint, fingerprint), gt(formSubmissions.createdAt, recent))).limit(1);
    if (duplicate) return NextResponse.json({ error: 'Cette demande a déjà été reçue récemment.' }, { status: 409 });
    const [recentIp] = await db.select({ id: formSubmissions.id }).from(formSubmissions).where(and(eq(formSubmissions.ipHash, ipHash), gt(formSubmissions.createdAt, new Date(Date.now() - 30 * 1000)))).limit(1);
    if (recentIp) return NextResponse.json({ error: 'Merci de patienter avant une nouvelle demande.' }, { status: 429 });

    const provenance = body.provenance || {};
    const rawUtm = provenance.utm && typeof provenance.utm === 'object' ? provenance.utm as Record<string, unknown> : {};
    const utm = Object.fromEntries(Object.entries(rawUtm).filter(([key, value]) => key.startsWith('utm_') && typeof value === 'string').map(([key, value]) => [key, clean(value, 160)]));
    const [submission] = await db.insert(formSubmissions).values({ fingerprint, formType: type, ipHash, page: clean(provenance.page, 240), campaign: clean(provenance.campaign, 160), referrer: clean(provenance.referrer, 500), utm }).returning({ id: formSubmissions.id });

    let leadId: string | undefined;
    if (type === 'correction') {
      await db.insert(reports).values({ type, page: clean(normalized.page, 120) || undefined, element: clean(normalized.element, 240) || undefined, message: clean(normalized.correction, 2000) || clean(normalized.message, 2000) || undefined, email: email || undefined });
    }
    if (type === 'hajj-devis') {
      // Les anciennes cartes utilisent encore des identifiants lisibles comme
      // « pkg6 »/« a5 ». Ils ne sont pas des UUID Neon : on ne les injecte pas
      // dans les colonnes relationnelles, mais on conserve l’offre dans
      // qualification pour garder la traçabilité de la demande.
      const legacyOfferId = clean(body.offerId, 80);
      const legacyPartnerId = selectedOffer?.agenceId || '';
      // Les colonnes offer_id et partner_id sont textuelles pour conserver les
      // anciennes cartes (pkg1, a1, db-hajj-...). Ne pas les convertir en
      // UUID : cela supprimait le rattachement de l’offre au ticket.
      const ticketReference = `AW-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
      const [lead] = await db.insert(leads).values({ ticketReference, offerId: legacyOfferId || undefined, partnerId: legacyPartnerId || undefined, name: clean(normalized.nom, 120), email, phone: clean(normalized.phone, 40) || undefined, travelType: clean(normalized.type, 80), qualification: { ...normalized, offerId: legacyOfferId || undefined, partnerId: legacyPartnerId || undefined }, source: 'hajj-offer', utm, consentFollowUp: true }).returning({ id: leads.id });
      leadId = lead.id;
      await db.insert(leadEvents).values({ leadId, event: 'created', actor: 'public_form', payload: { submissionId: submission.id, page: clean(provenance.page, 240) } });
    }

    const to = process.env.CONTACT_EMAIL || 'meyghvne@gmail.com';
    const text = `Nouvelle soumission Al-Wasil - ${type}\n${JSON.stringify(normalized, null, 2)}\nPage: ${clean(provenance.page, 240) || 'non renseignée'}`;
    await deliverRecordedEmail(() => resend.emails.send({ from: process.env.RESEND_FROM_EMAIL || 'Mégane - Al-Wasil <megane@al-wasil.fr>', to: [to], subject: `[Al-Wasil] Nouvelle soumission : ${type}${leadId ? ` - ${leadId}` : ''}`, text, replyTo: email || undefined }), async () => {
      await db.insert(automationErrors).values({ stage: 'contact_email', code: 'send_failed' });
      await db.update(formSubmissions).set({ status: 'email_failed', errorCode: 'send_failed' }).where(eq(formSubmissions.id, submission.id));
      console.error('[contact] email delivery failed');
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] request failed:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Impossible de traiter la demande pour le moment.' }, { status: 500 });
  }
}
