// Email digest quotidien — boutons Valider/Refuser par item
import crypto from 'crypto';
import type { ScrapedItem } from '../types.js';
import { MANUAL_REVIEW } from '../types.js';

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'al-wasil@hotmail.com';
const SITE_URL = process.env.SITE_URL || 'https://al-wasil.fr';
const SECRET = process.env.MODERATE_SECRET || 'alwasil-moderate-2026';

function makeToken(id: string, action: string): string {
  const today = new Date().toISOString().split('T')[0];
  return crypto.createHmac('sha256', SECRET).update(`${id}:${action}:${today}`).digest('hex');
}

function approveLink(item: ScrapedItem): string {
  const token = makeToken(item.id, 'approve');
  return `${SITE_URL}/api/moderate?token=${token}&id=${item.id}&action=approve&tab=${item.sheetTab}`;
}

function rejectLink(item: ScrapedItem): string {
  const token = makeToken(item.id, 'reject');
  return `${SITE_URL}/api/moderate?token=${token}&id=${item.id}&action=reject&tab=${item.sheetTab}`;
}

function catLabel(item: ScrapedItem): string {
  const labels: Record<string, string> = {
    evenement: 'Evenement', cagnotte: 'Cagnotte', solidarite: 'Solidarite',
    education: 'Education', emploi: 'Emploi', piscine: 'Piscine', hajj: 'Hajj',
  };
  return labels[item.category] || item.category;
}

function catColor(item: ScrapedItem): string {
  const colors: Record<string, string> = {
    evenement: '#7c3aed', cagnotte: '#dc2626', solidarite: '#059669',
    education: '#d97706', emploi: '#2563eb', piscine: '#0891b2', hajj: '#c9973a',
  };
  return colors[item.category] || '#6b7280';
}

function renderItem(item: ScrapedItem): string {
  const color = catColor(item);
  const label = catLabel(item);
  const date = item.date_iso ? ` · ${item.date_iso}` : '';
  const location = item.ville ? ` · ${item.ville}` : '';
  const source = item.source;

  return `
<div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:16px;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
    <span style="background:${color};color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;">${label}</span>
    <span style="color:#9ca3af;font-size:12px;">via ${source}${date}${location}</span>
  </div>
  <h3 style="margin:0 0 6px;font-size:16px;font-weight:700;color:#111827;line-height:1.3;">${escHtml(item.titre)}</h3>
  ${item.description ? `<p style="margin:0 0 12px;font-size:13px;color:#6b7280;line-height:1.5;">${escHtml(item.description.slice(0, 200))}${item.description.length > 200 ? '...' : ''}</p>` : ''}
  ${item.url_source ? `<p style="margin:0 0 14px;font-size:12px;"><a href="${item.url_source}" style="color:#7c3aed;">Source →</a></p>` : ''}
  ${item.montant_actuel ? `<p style="margin:0 0 12px;font-size:13px;color:#059669;font-weight:600;">Collecte : ${item.montant_actuel.toLocaleString('fr-FR')} ${item.montant_objectif ? `/ ${item.montant_objectif.toLocaleString('fr-FR')}` : ''}</p>` : ''}
  <div style="display:flex;gap:10px;margin-top:4px;">
    <a href="${approveLink(item)}" style="display:inline-block;background:#059669;color:#fff;font-weight:700;font-size:13px;padding:9px 22px;border-radius:6px;text-decoration:none;">Valider</a>
    <a href="${rejectLink(item)}" style="display:inline-block;background:#f3f4f6;color:#6b7280;font-weight:600;font-size:13px;padding:9px 22px;border-radius:6px;text-decoration:none;border:1px solid #e5e7eb;">Refuser</a>
  </div>
</div>`;
}

function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderAutoItem(item: ScrapedItem): string {
  const color = catColor(item);
  const label = catLabel(item);
  return `<li style="margin-bottom:6px;font-size:13px;color:#374151;">
    <span style="background:${color};color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:3px;margin-right:7px;">${label}</span>
    <strong>${escHtml(item.titre)}</strong>
    ${item.ville ? ` · ${item.ville}` : ''}
    ${item.url_source ? ` <a href="${item.url_source}" style="color:#7c3aed;font-size:11px;">→</a>` : ''}
  </li>`;
}

export async function sendDigestEmail(
  toValidate: ScrapedItem[],
  autoApproved: ScrapedItem[],
): Promise<void> {
  if (!RESEND_KEY) {
    console.log('[email] No RESEND_API_KEY, skipping email.');
    return;
  }

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const totalFound = toValidate.length + autoApproved.length;

  if (totalFound === 0) {
    console.log('[email] Nothing to report, skipping email.');
    return;
  }

  const validateSection = toValidate.length > 0 ? `
<div style="margin-bottom:32px;">
  <h2 style="font-size:18px;font-weight:800;color:#111827;margin:0 0 6px;">A VALIDER (${toValidate.length})</h2>
  <p style="font-size:13px;color:#6b7280;margin:0 0 20px;">Clique sur Valider ou Refuser pour chaque element ci-dessous.</p>
  ${toValidate.map(renderItem).join('')}
</div>` : '';

  const autoSection = autoApproved.length > 0 ? `
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin-bottom:24px;">
  <h2 style="font-size:15px;font-weight:700;color:#166534;margin:0 0 12px;">AUTO-VALIDES (${autoApproved.length})</h2>
  <p style="font-size:12px;color:#16a34a;margin:0 0 12px;">Ces elements ont ete publies directement (Emploi, Piscines, Hajj).</p>
  <ul style="margin:0;padding-left:16px;">${autoApproved.map(renderAutoItem).join('')}</ul>
</div>` : '';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
<div style="max-width:620px;margin:40px auto;padding:0 16px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0a0806 0%,#1a1008 100%);border-radius:12px;padding:28px 32px;margin-bottom:24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">
      <div style="width:8px;height:8px;background:#c9973a;border-radius:50%;"></div>
      <span style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Al-Wasil · Rapport quotidien</span>
    </div>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff;line-height:1.2;">${today}</h1>
    <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">${totalFound} element(s) trouve(s) · ${toValidate.length} a valider</p>
  </div>

  ${validateSection}
  ${autoSection}

  <!-- Footer -->
  <div style="text-align:center;padding:16px 0;border-top:1px solid #e5e7eb;margin-top:24px;">
    <a href="${SITE_URL}/admin/soumissions" style="color:#7c3aed;font-size:13px;font-weight:600;text-decoration:none;">Voir tout le dashboard admin →</a>
    <p style="color:#9ca3af;font-size:11px;margin:8px 0 0;">Les liens de validation expirent ce soir a minuit.</p>
  </div>

</div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Al-Wasil Scraper <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `Al-Wasil · ${toValidate.length} a valider · ${today}`,
        html,
      }),
    });

    if (res.ok) {
      const d = await res.json() as { id?: string };
      console.log(`[email] Digest sent → ${d.id}`);
    } else {
      const err = await res.text();
      console.error('[email] Resend error:', err);
    }
  } catch (e) {
    console.error('[email] Send error:', e);
  }
}
