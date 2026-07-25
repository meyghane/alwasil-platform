// POST /api/scraper/ingest-events
// Appelé par la routine Claude cloud quotidienne (recherche web d'événements).
// Auth : header X-Scraper-Secret. Écrit en base + log de conso + email digest.

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { items, scrapeRuns } from '@/db/schema';
import { EVENT_CATEGORIES } from '@/lib/event-categories';

const INGEST_SECRET = process.env.SCRAPER_INGEST_SECRET || '';
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'al-wasil@hotmail.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-wasil.fr';
const MODERATE_SECRET = process.env.MODERATE_SECRET || 'alwasil-moderate-2026';

type IncomingEvent = {
  title: string;
  category: string;
  description?: string;
  date?: string; // YYYY-MM-DD
  timeStart?: string;
  city?: string;
  department?: string;
  organizer?: string;
  sourceUrl?: string;
  isFree?: boolean;
};

type IngestBody = {
  events: IncomingEvent[];
  tokensUsed?: number;
};

function normalizeCategory(cat: string | undefined): string {
  return cat && (EVENT_CATEGORIES as readonly string[]).includes(cat) ? cat : 'autre';
}

function makeToken(id: string, action: string): string {
  const today = new Date().toISOString().split('T')[0];
  return crypto.createHmac('sha256', MODERATE_SECRET).update(`${id}:${action}:${today}`).digest('hex');
}

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendDigest(inserted: { id: string; title: string; city: string | null; dateIso: string | null }[]) {
  if (!RESEND_KEY || inserted.length === 0) return;

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const rows = inserted
    .map((it) => {
      const approve = `${SITE_URL}/api/moderate?token=${makeToken(it.id, 'approve')}&id=${it.id}&action=approve`;
      const reject = `${SITE_URL}/api/moderate?token=${makeToken(it.id, 'reject')}&id=${it.id}&action=reject`;
      return `
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:16px;">
  <h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#111827;">${escHtml(it.title)}</h3>
  <p style="margin:0 0 14px;font-size:12px;color:#9ca3af;">${it.dateIso ?? ''}${it.city ? ` · ${escHtml(it.city)}` : ''}</p>
  <div style="display:flex;gap:10px;">
    <a href="${approve}" style="background:#059669;color:#fff;font-weight:700;font-size:13px;padding:9px 22px;border-radius:6px;text-decoration:none;">Valider</a>
    <a href="${reject}" style="background:#f3f4f6;color:#6b7280;font-weight:600;font-size:13px;padding:9px 22px;border-radius:6px;text-decoration:none;border:1px solid #e5e7eb;">Refuser</a>
  </div>
</div>`;
    })
    .join('');

  const html = `<!DOCTYPE html><html lang="fr"><body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,sans-serif;">
<div style="max-width:620px;margin:40px auto;padding:0 16px;">
  <div style="background:linear-gradient(135deg,#0a0806 0%,#1a1008 100%);border-radius:12px;padding:28px 32px;margin-bottom:24px;">
    <span style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Al-Wasil · Rapport quotidien</span>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff;">${today}</h1>
    <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">${inserted.length} événement(s) à valider</p>
  </div>
  ${rows}
</div>
</body></html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Al-Wasil Scraper <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `Al-Wasil · ${inserted.length} à valider · ${today}`,
      html,
    }),
  }).catch((e) => console.error('[ingest] Resend error:', e));
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-scraper-secret') || '';
  if (!INGEST_SECRET || secret !== INGEST_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = (await req.json()) as IngestBody;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const events = Array.isArray(body.events) ? body.events : [];
  const inserted: { id: string; title: string; city: string | null; dateIso: string | null }[] = [];

  for (const ev of events) {
    if (!ev.title) continue;
    const category = normalizeCategory(ev.category);
    try {
      const [row] = await db
        .insert(items)
        .values({
          category: 'event',
          status: 'pending',
          title: ev.title,
          description: ev.description || '',
          city: ev.city || null,
          department: ev.department || null,
          region: 'idf',
          dateStart: ev.date ? new Date(ev.date) : null,
          source: 'claude-routine',
          sourceUrl: ev.sourceUrl || null,
          tags: [category],
          isSpam: false,
          metadata: {
            subType: 'event',
            raw: {
              id: `routine-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              title: ev.title,
              category,
              date: ev.date,
              timeStart: ev.timeStart || 'À confirmer',
              location: ev.organizer || ev.city || 'Lieu à confirmer',
              city: ev.city || '',
              department: ev.department || '00',
              organizer: ev.organizer || 'Non précisé',
              description: ev.description || '',
              tags: [category],
              format: 'presentiel',
              isFree: ev.isFree ?? true,
              registrationUrl: ev.sourceUrl || undefined,
            },
          },
        })
        .returning({ id: items.id });

      if (row) {
        inserted.push({ id: row.id, title: ev.title, city: ev.city ?? null, dateIso: ev.date ?? null });
      }
    } catch (e) {
      console.error('[ingest] Insert error:', e);
    }
  }

  await db.insert(scrapeRuns).values({
    runType: 'claude-routine',
    tokensUsed: typeof body.tokensUsed === 'number' ? body.tokensUsed : null,
    itemsFound: events.length,
    itemsInserted: inserted.length,
  });

  await sendDigest(inserted);

  return NextResponse.json({ ok: true, found: events.length, inserted: inserted.length });
}
