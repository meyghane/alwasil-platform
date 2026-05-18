// GET /api/auto/cleanup
// Supprime les fiches expirées (emploi > 60j, cagnottes > 90j, events passés)
// Appelé par Vercel Cron chaque nuit à 3h

import { NextRequest, NextResponse } from 'next/server';

const APPS_URL    = process.env.APPS_SCRIPT_WEBHOOK_URL || '';
const CRON_SECRET = process.env.CRON_SECRET || '';
const TG_TOKEN    = process.env.TELEGRAM_BOT_TOKEN || '';
const TG_CHAT     = process.env.TELEGRAM_CHAT_ID || '';

const TABS_TO_CLEAN = [
  { tab: 'soumissions_emploi',    expiryField: 'expires_at' },
  { tab: 'soumissions_cagnottes', expiryField: 'expires_at' },
  { tab: 'soumissions_events',    expiryField: 'date_iso'   },
];

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];
  let totalExpired = 0;

  for (const { tab, expiryField } of TABS_TO_CLEAN) {
    if (!APPS_URL) continue;
    try {
      // Marquer comme expirés via Apps Script
      await fetch(APPS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'expireRows',
          tab,
          expiryField,
          today,
        }),
      });
      totalExpired++;
    } catch { continue; }
  }

  if (TG_TOKEN && TG_CHAT) {
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: `🧹 Nettoyage automatique effectué (${today})\n${totalExpired} onglet(s) nettoyés des fiches expirées.`,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, today, cleaned: totalExpired });
}
