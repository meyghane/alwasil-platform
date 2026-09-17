import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/db';
import { leads, leadEvents, reports } from '@/db/schema';
const recentSubmissions = new Map<string, number>();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
 try {
 const body = await req.json();
 const { type, fields, offerId, partnerId } = body;
 const key = `${req.headers.get('x-forwarded-for') ?? 'local'}:${type}`;
 const previous = recentSubmissions.get(key) ?? 0;
 if (Date.now() - previous < 30_000) return NextResponse.json({ error: 'Merci de patienter avant une nouvelle demande.' }, { status: 429 });
 if (type === 'hajj-devis' && (!fields?.nom || !fields?.email || !fields?.type)) return NextResponse.json({ error: 'Champs Hajj requis manquants' }, { status: 400 });
 if (type === 'hajj-devis' && fields.consentFollowUp !== 'true') return NextResponse.json({ error: 'Le consentement de suivi est requis.' }, { status: 400 });
 // Le refus d'un formulaire incomplet ne doit pas consommer le délai anti-spam.
 recentSubmissions.set(key, Date.now());

 let leadId: string | undefined;
 if (type === 'correction') {
   try {
     await db.insert(reports).values({
       type,
       page: fields?.page ? String(fields.page).slice(0, 120) : undefined,
       element: fields?.element ? String(fields.element).slice(0, 240) : undefined,
       message: fields?.correction ? String(fields.correction).slice(0, 2000) : (fields?.message ? String(fields.message).slice(0, 2000) : undefined),
       email: fields?.email ? String(fields.email).slice(0, 240) : undefined,
     });
   } catch (error) { console.error('[contact] report persistence error:', error); }
 }
 if (type === 'hajj-devis') {
   const [lead] = await db.insert(leads).values({ offerId: offerId || undefined, partnerId: partnerId || undefined, name: String(fields.nom).slice(0, 120), email: String(fields.email).slice(0, 240), phone: fields.phone ? String(fields.phone).slice(0, 40) : undefined, travelType: String(fields.type), qualification: fields, source: 'hajj-offer', consentFollowUp: true }).returning({ id: leads.id });
   leadId = lead.id;
   await db.insert(leadEvents).values({ leadId, event: 'created', actor: 'public_form', payload: { offerId, partnerId } });
 }

 const TO_EMAIL = process.env.CONTACT_EMAIL || 'meyghvne@gmail.com';
 const now = new Date().toLocaleString('fr-FR');

 // ── 1. Email via Resend ─────────────────────────────────────
 const subject = `[Al-Wasil] Nouvelle soumission : ${type}${leadId ? ` - ${leadId}` : ''}`;
 const html = `
 <h2>Nouvelle soumission via Al-Wasil - ${type}</h2>
 <table style="border-collapse:collapse;width:100%">
 ${Object.entries(fields as Record<string, string>)
 .map(([k, v]) => `
 <tr>
 <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb;width:180px">${k}</td>
 <td style="padding:8px 12px;border:1px solid #e5e7eb">${v || ' - '}</td>
 </tr>`)
 .join('')}
 </table>
 <p style="margin-top:24px">
 <a href="https://alwasil-platform.vercel.app/admin/soumissions" style="background:#c9973a;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700">
 Valider dans l'admin
 </a>
 </p>
 <p style="margin-top:16px;color:#6b7280;font-size:13px">Envoyé depuis al-wasil.fr - ${now}</p>
 `;

 resend.emails.send({
 from: 'Al-Wasil <onboarding@resend.dev>',
 to: [TO_EMAIL],
 subject,
 html,
 replyTo: (fields as Record<string, string>)?.email || undefined,
 }).catch(e => console.error('[contact] Resend error:', e));

 // ── 2. Make webhook → Gemini → Google Sheet ─────────────────
 const makeUrl = process.env.MAKE_WEBHOOK_URL;
 if (makeUrl) {
 const row = {
 id: `${type}-${Date.now()}`,
 categorie: type,
 status: 'à vérifier',
 soumis_le: new Date().toISOString(),
 soumis_par: 'public',
 ...fields,
 };
 fetch(makeUrl, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(row),
 }).catch(e => console.error('[contact] Make webhook error:', e));
 }

 // ── 3. Telegram notification ────────────────────────────────
 const tgToken = process.env.TELEGRAM_BOT_TOKEN;
 const tgChatId = process.env.TELEGRAM_CHAT_ID;
 if (tgToken && tgChatId) {
 const nom = (fields as Record<string, string>)?.name ||
 (fields as Record<string, string>)?.nom ||
 (fields as Record<string, string>)?.titre || '';
 const ville = (fields as Record<string, string>)?.ville || '';
 const text = ` <b>Nouvelle soumission publique</b>\n\n <b>${type}</b>${nom ? `\n ${nom}` : ''}${ville ? `\n ${ville}` : ''}\n\n <a href="https://alwasil-platform.vercel.app/admin/soumissions">Valider maintenant</a>`;

 fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ chat_id: tgChatId, text, parse_mode: 'HTML' }),
 }).catch(e => console.error('[contact] Telegram error:', e));
 }

 return NextResponse.json({ ok: true });
 } catch (e) {
 return NextResponse.json({ error: String(e) }, { status: 500 });
 }
}
