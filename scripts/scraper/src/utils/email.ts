// Email digest quotidien — boutons Valider/Refuser par item
import crypto from 'crypto';
import type { DigestItem, EventCategory } from '../types';

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'al-wasil@hotmail.com';
const SITE_URL = process.env.SITE_URL || 'https://al-wasil.fr';
const SECRET = process.env.MODERATE_SECRET || 'alwasil-moderate-2026';

function makeToken(id: string, action: string): string {
  const today = new Date().toISOString().split('T')[0];
  return crypto.createHmac('sha256', SECRET).update(`${id}:${action}:${today}`).digest('hex');
}

function approveLink(item: DigestItem): string {
  const token = makeToken(item.id, 'approve');
  return `${SITE_URL}/api/moderate?token=${token}&id=${item.id}&action=approve`;
}

function rejectLink(item: DigestItem): string {
  const token = makeToken(item.id, 'reject');
  return `${SITE_URL}/api/moderate?token=${token}&id=${item.id}&action=reject`;
}

const CATEGORY_LABELS: Record<EventCategory, string> = {
  conference: 'Conférence',
  maraude: 'Maraude',
  cours: 'Cours',
  iftar: 'Iftar',
  webinaire: 'Webinaire',
  jeunesse: 'Jeunesse',
  famille: 'Famille',
  collecte: 'Collecte',
  autre: 'Autre',
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  conference: '#7c3aed',
  maraude: '#dc2626',
  cours: '#2563eb',
  iftar: '#c9973a',
  webinaire: '#0891b2',
  jeunesse: '#059669',
  famille: '#d97706',
  collecte: '#dc2626',
  autre: '#6b7280',
};

function renderItem(item: DigestItem): string {
  const color = CATEGORY_COLORS[item.category];
  const label = CATEGORY_LABELS[item.category];
  const date = item.dateIso ? ` · ${item.dateIso}` : '';
  const location = item.city ? ` · ${item.city}` : '';

  return `
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:16px;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <span style="background:${color};color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;">${label}</span>
    <span style="color:#9ca3af;font-size:12px;">via Gemini${date}${location}</span>
  </div>
  <h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#111827;line-height:1.3;">${escHtml(item.title)}</h3>
  ${item.description ? `<p style="margin:0 0 12px;font-size:13px;color:#6b7280;line-height:1.5;">${escHtml(item.description.slice(0, 200))}${item.description.length > 200 ? '...' : ''}</p>` : ''}
  ${item.sourceUrl ? `<p style="margin:0 0 14px;font-size:12px;"><a href="${item.sourceUrl}" style="color:#7c3aed;">Source →</a></p>` : ''}
  <div style="display:flex;gap:10px;margin-top:4px;">
    <a href="${approveLink(item)}" style="display:inline-block;background:#059669;color:#fff;font-weight:700;font-size:13px;padding:9px 22px;border-radius:6px;text-decoration:none;">Valider</a>
    <a href="${rejectLink(item)}" style="display:inline-block;background:#f3f4f6;color:#6b7280;font-weight:600;font-size:13px;padding:9px 22px;border-radius:6px;text-decoration:none;border:1px solid #e5e7eb;">Refuser</a>
  </div>
</div>`;
}

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendDigestEmail(items: DigestItem[]): Promise<void> {
  if (!RESEND_KEY) {
    console.log('[email] No RESEND_API_KEY, skipping email.');
    return;
  }

  if (items.length === 0) {
    console.log('[email] Nothing to report, skipping email.');
    return;
  }

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
<div style="max-width:620px;margin:40px auto;padding:0 16px;">

  <div style="background:linear-gradient(135deg,#0a0806 0%,#1a1008 100%);border-radius:12px;padding:28px 32px;margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">
      <div style="width:8px;height:8px;background:#c9973a;border-radius:50%;"></div>
      <span style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Al-Wasil · Rapport quotidien</span>
    </div>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff;line-height:1.2;">${today}</h1>
    <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">${items.length} événement(s) à valider</p>
  </div>

  <div style="margin-bottom:32px;">
    ${items.map(renderItem).join('')}
  </div>

  <div style="text-align:center;padding:16px 0;border-top:1px solid #e5e7eb;margin-top:24px;">
    <a href="${SITE_URL}/admin" style="color:#7c3aed;font-size:13px;font-weight:600;text-decoration:none;">Voir tout le dashboard admin →</a>
    <p style="color:#9ca3af;font-size:11px;margin:8px 0 0;">Les liens de validation expirent ce soir à minuit.</p>
  </div>

</div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Al-Wasil Scraper <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `Al-Wasil · ${items.length} à valider · ${today}`,
        html,
      }),
    });

    if (res.ok) {
      const d = (await res.json()) as { id?: string };
      console.log(`[email] Digest sent → ${d.id}`);
    } else {
      const err = await res.text();
      console.error('[email] Resend error:', err);
    }
  } catch (e) {
    console.error('[email] Send error:', e);
  }
}
