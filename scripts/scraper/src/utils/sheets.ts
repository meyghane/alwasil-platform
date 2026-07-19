// Google Sheets via Apps Script webhook (already configured)
import type { ScrapedItem } from '../types.js';

const APPS_URL = process.env.APPS_SCRIPT_WEBHOOK_URL || '';

export async function checkAlreadyRanToday(): Promise<boolean> {
  if (process.env.FORCE_RUN === 'true') return false;
  if (!APPS_URL) return false;

  const today = new Date().toISOString().split('T')[0];

  try {
    const res = await fetch(`${APPS_URL}?action=listTab&tab=SearchLog`);
    if (!res.ok) return false;
    const data = await res.json() as { rows?: { DATE?: string }[] };
    const rows = data.rows || [];
    const ranToday = rows.some(r => (r.DATE || '').startsWith(today));
    if (ranToday) console.log(`[sheets] Already ran today (${today}), skipping.`);
    return ranToday;
  } catch (e) {
    console.warn('[sheets] Could not check run log:', e);
    return false;
  }
}

export async function getExistingTitles(tab: string): Promise<Set<string>> {
  if (!APPS_URL) return new Set();
  try {
    const res = await fetch(`${APPS_URL}?action=listTab&tab=${tab}`);
    if (!res.ok) return new Set();
    const data = await res.json() as { rows?: { titre?: string }[] };
    return new Set((data.rows || []).map(r => (r.titre || '').toLowerCase()).filter(Boolean));
  } catch {
    return new Set();
  }
}

export async function writeItem(item: ScrapedItem): Promise<boolean> {
  if (!APPS_URL) {
    console.log(`[sheets] No APPS_URL — would write: ${item.titre}`);
    return false;
  }

  try {
    const res = await fetch(APPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sheetTab: item.sheetTab,
        row: {
          id: item.id,
          titre: item.titre,
          description: item.description,
          date_iso: item.date_iso || '',
          heure: item.heure || '',
          ville: item.ville,
          departement: item.departement,
          organisateur: item.organisateur,
          url_source: item.url_source,
          gratuit: item.gratuit ?? true,
          montant_objectif: item.montant_objectif ?? '',
          montant_actuel: item.montant_actuel ?? '',
          image: item.image || '',
          source: item.source,
          status: item.status,
          soumis_par: 'Scraper Auto',
          soumis_le: item.scraped_at,
        },
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('[sheets] Write error:', e);
    return false;
  }
}

export async function logRun(date: string, itemsFound: number): Promise<void> {
  if (!APPS_URL) return;
  try {
    await fetch(APPS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sheetTab: 'SearchLog',
        row: {
          DATE: new Date().toISOString(),
          QUERY: 'GitHub Actions Scraper',
          STRATEGY: 'Daily Auto',
          EVENTS_FOUND: itemsFound,
          URLS: `Run ${date}`,
        },
      }),
    });
  } catch {}
}
