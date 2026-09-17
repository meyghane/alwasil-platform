// Al-Wasil — Daily Scraper (GitHub Actions)
// Runs on GitHub servers, not your Mac — 100% free
// Source unique : Gemini + Google Search grounding (pas de scraping HTML direct
// d'un site nommé — HelloAsso/LaunchGood retirés le 25/07/2026 car interdisent
// le scraping dans leurs CGU ; voir ARCHITECTURE.md décision Epic B).
import { randomUUID } from 'node:crypto';
import { getExistingEventKeys, getExistingCagnotteUrls, getDepartmentCounts, getTodayUsage, hadAnyQuotaErrorToday, insertEvent, insertCagnotte, logAutomationError, saveUsage, type CategoryUsage } from './utils/db';
import { scrapeEventsWithGemini, scrapeCagnottesWithGemini } from './utils/gemini';
import { sendDigestEmail, sendCagnotteNotice } from './utils/email';
import { normalizeEventCategory } from './types';
import type { DigestItem } from './types';

async function main() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`\n==== Al-Wasil Scraper · ${today} ====\n`);

  const required = ['GEMINI_API_KEY', 'DATABASE_URL'];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Configuration manquante: ${missing.join(', ')}. Vérifier les secrets GitHub Actions.`);
  }

  if (await hadAnyQuotaErrorToday()) {
    console.log('[budget] Quota Gemini 429 déjà rencontré aujourd’hui. Toutes les catégories sont en pause.');
    return;
  }

  const dailyLimit = Math.min(20, Math.max(0, Number.parseInt(process.env.EVENTS_DAILY_CALL_BUDGET || '7', 10) || 0));
  const tokenLimit = Math.min(250_000, Math.max(0, Number.parseInt(process.env.EVENTS_DAILY_TOKEN_BUDGET || '120000', 10) || 0));
  const previous = await getTodayUsage('events');
  if (previous.quotaErrors > 0 || previous.modelCalls >= dailyLimit || previous.tokensUsed >= tokenLimit) {
    console.log('[budget] Événements en pause : quota 429 ou budget quotidien atteint.');
    await runCagnottes();
    return;
  }
  const usage: CategoryUsage = { modelCalls: 0, tokensUsed: 0, itemsFound: 0, itemsInserted: 0, quotaErrors: 0 };
  const runId = randomUUID();
  try {
    console.log('\n--- Gemini Events Search ---');
    const existingKeys = await getExistingEventKeys();
    const departmentCounts = await getDepartmentCounts();
    const geminiEvents = await scrapeEventsWithGemini(
      existingKeys, departmentCounts, dailyLimit - previous.modelCalls,
      (kind, amount) => { if (kind === 'call') usage.modelCalls += amount; else usage.tokensUsed += amount; },
      () => previous.modelCalls + usage.modelCalls < dailyLimit && previous.tokensUsed + usage.tokensUsed < tokenLimit,
      () => { usage.quotaErrors++; },
    );
    usage.itemsFound = geminiEvents.length;
    console.log(`Gemini: ${geminiEvents.length} events found`);

    const digestItems: DigestItem[] = [];

    for (const ev of geminiEvents) {
    const category = normalizeEventCategory(ev.categorie);
    const id = await insertEvent({
      title: ev.titre,
      description: ev.description || '',
      city: ev.ville || null,
      department: ev.departement || null,
      dateStart: ev.date_iso ? new Date(ev.date_iso) : null,
      sourceUrl: ev.url_source || null,
      tags: [category],
      raw: {
        id: `scraped-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: ev.titre,
        category,
        date: ev.date_iso,
        timeStart: ev.heure || 'À confirmer',
        location: ev.organisateur || ev.ville || 'Lieu à confirmer',
        city: ev.ville || '',
        department: ev.departement || '00',
        organizer: ev.organisateur || 'Non précisé',
        description: ev.description || '',
        tags: [category],
        format: 'presentiel',
        isFree: ev.gratuit ?? true,
        registrationUrl: ev.url_source || undefined,
      },
    });

    if (id) {
      usage.itemsInserted++;
      digestItems.push({
        id,
        title: ev.titre,
        category,
        description: ev.description || '',
        dateIso: ev.date_iso,
        city: ev.ville,
        sourceUrl: ev.url_source,
      });
    }
    }

  console.log(`\nInserted: ${digestItems.length}/${geminiEvents.length}`);

  console.log('\n--- Sending Email Digest ---');
    if (digestItems.length) await sendDigestEmail(digestItems);
    if (usage.quotaErrors) await logAutomationError('gemini_429');

    console.log('\n==== Done ====\n');
  } finally {
    await saveUsage(runId, 'events', usage);
  }
  if (!usage.quotaErrors) await runCagnottes();
}

async function runCagnottes() {
  const dailyLimit = Math.min(10, Math.max(0, Number.parseInt(process.env.CAGNOTTES_DAILY_CALL_BUDGET || '3', 10) || 0));
  const tokenLimit = Math.min(100_000, Math.max(0, Number.parseInt(process.env.CAGNOTTES_DAILY_TOKEN_BUDGET || '50000', 10) || 0));
  const previous = await getTodayUsage('cagnottes');
  if (previous.quotaErrors > 0 || previous.modelCalls >= dailyLimit || previous.tokensUsed >= tokenLimit) {
    console.log('[budget] Cagnottes en pause : quota ou budget quotidien atteint.');
    return;
  }
  const usage: CategoryUsage = { modelCalls: 0, tokensUsed: 0, itemsFound: 0, itemsInserted: 0, quotaErrors: 0 };
  try {
    const existingUrls = await getExistingCagnotteUrls();
    const found = await scrapeCagnottesWithGemini(
      existingUrls, dailyLimit - previous.modelCalls,
      (kind, amount) => { if (kind === 'call') usage.modelCalls += amount; else usage.tokensUsed += amount; },
      () => previous.modelCalls + usage.modelCalls < dailyLimit && previous.tokensUsed + usage.tokensUsed < tokenLimit,
      () => { usage.quotaErrors++; },
    );
    usage.itemsFound = found.length;
    const inserted: { title: string; url: string }[] = [];
    for (const candidate of found) {
      try {
        const id = await insertCagnotte({
          title: candidate.titre, organizer: candidate.organisateur || 'À vérifier',
          category: candidate.categorie || 'urgence', country: candidate.pays || 'À vérifier',
          description: candidate.description || '', sourceUrl: candidate.url_source,
        });
        if (id) { usage.itemsInserted++; inserted.push({ title: candidate.titre, url: candidate.url_source }); }
      } catch (error) {
        await logAutomationError('cagnotte_insert_failed');
        console.error('[db] Cagnotte insert error:', error);
      }
    }
    await sendCagnotteNotice(inserted);
    if (usage.quotaErrors) await logAutomationError('gemini_429');
    console.log(`[cagnottes] ${usage.itemsInserted}/${usage.itemsFound} en attente de modération.`);
  } finally {
    await saveUsage(randomUUID(), 'cagnottes', usage);
  }
}

main().catch(async (e) => {
  await logAutomationError('run_failed');
  console.error('Fatal error:', e);
  process.exit(1);
});
