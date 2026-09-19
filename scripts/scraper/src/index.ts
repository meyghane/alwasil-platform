// Al-Wasil — Daily Scraper (GitHub Actions)
// Runs on GitHub servers, not your Mac — 100% free
// Source unique : Gemini + Google Search grounding (pas de scraping HTML direct
// d'un site nommé — HelloAsso/LaunchGood retirés le 25/07/2026 car interdisent
// le scraping dans leurs CGU ; voir ARCHITECTURE.md décision Epic B).
import { randomUUID } from 'node:crypto';
import { getExistingEventKeys, getExistingCagnotteUrls, getDepartmentCounts, getTodayUsage, hadAnyQuotaErrorToday, insertEvent, insertCagnotte, logAutomationError, saveUsage, type CategoryUsage } from './utils/db';
import { prioritizeDepartments, scrapeEventsWithGemini, scrapeCagnottesWithGemini } from './utils/gemini';
import { scrapeEventsFromRss } from './utils/rss-events';
import { sendDigestEmail, sendCagnotteNotice } from './utils/email';
import { normalizeEventCategory } from './types';
import { inferEventCategory } from './utils/event-category';
import type { DigestItem } from './types';

async function notifyTelegram(item: { id: string; title: string; category: string; city?: string | null; sourceUrl?: string | null }): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_MODERATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[telegram] notification ignorée : TELEGRAM_BOT_TOKEN ou identifiant du groupe manquant dans GitHub Actions');
    return;
  }
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: ['À vérifier sur Al-Wasil', `${item.title} (${item.category})`, item.city ? `Ville : ${item.city}` : '', item.sourceUrl ? `Source : ${item.sourceUrl}` : '', `Ouvrir : https://al-wasil.fr/admin/soumissions?item=${item.id}`].filter(Boolean).join('\n'),
      disable_web_page_preview: true,
      reply_markup: { inline_keyboard: [[{ text: 'Valider', callback_data: `a:${item.id}` }, { text: 'Refuser', callback_data: `r:${item.id}` }], [{ text: 'Modifier ou voir', url: `https://al-wasil.fr/admin/soumissions?item=${item.id}` }]] },
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Telegram HTTP ${response.status}`);
}

async function notifyDailyReport(report: { date: string; zones: string[]; eventsFound: number; eventsInserted: number; eventCalls: number; eventQuotaErrors: number; cagnottesFound: number; cagnottesInserted: number; cagnottesCalls: number; errors: string[] }): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_MODERATION_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const text = [
    `Rapport de veille Al-Wasil · ${report.date}`,
    '',
    `Zones interrogées : ${report.zones.length ? report.zones.join(', ') : 'non déterminées'}`,
    `Événements : ${report.eventsFound} trouvés · ${report.eventsInserted} nouvelles soumissions · ${report.eventCalls} recherches`,
    `Cagnottes/solidarité : ${report.cagnottesFound} trouvées · ${report.cagnottesInserted} nouvelles soumissions · ${report.cagnottesCalls} recherches`,
    '',
    'Catégories non exécutées aujourd’hui : mosquées, instituts/cours, santé, librairies, piscines, droit/justice, Hajj/Omra.',
    report.eventQuotaErrors ? `Blocage quota : ${report.eventQuotaErrors} erreur(s), recherches arrêtées.` : '',
    report.errors.length ? `Erreurs ou limites : ${report.errors.join(' · ')}` : 'Aucune erreur bloquante enregistrée.',
    '',
    'Les fiches proposées ci-dessous restent en attente de validation. Les catégories non exécutées ne sont pas considérées comme vérifiées sans résultat.',
  ].filter(Boolean).join('\n');
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Telegram rapport HTTP ${response.status}`);
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`\n==== Al-Wasil Scraper · ${today} ====\n`);

  const required = ['GEMINI_API_KEY', 'DATABASE_URL'];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Configuration manquante: ${missing.join(', ')}. Vérifier les secrets GitHub Actions.`);
  }

  const quotaBlockedToday = await hadAnyQuotaErrorToday();
  if (quotaBlockedToday) {
    console.log('[budget] Quota Gemini 429 déjà rencontré aujourd’hui. Gemini est désactivé, la source de secours reste active.');
    await logAutomationError('gemini_quota_blocked', 'scraper_events');
  }

  const dailyLimit = Math.min(20, Math.max(0, Number.parseInt(process.env.EVENTS_DAILY_CALL_BUDGET || '7', 10) || 0));
  const tokenLimit = Math.min(250_000, Math.max(0, Number.parseInt(process.env.EVENTS_DAILY_TOKEN_BUDGET || '120000', 10) || 0));
  const previous = await getTodayUsage('events');
  if (previous.modelCalls >= dailyLimit || previous.tokensUsed >= tokenLimit) {
    console.log('[budget] Événements en pause : budget quotidien atteint.');
    const cagnottes = await runCagnottes();
    await notifyDailyReport({ date: today, zones: [], eventsFound: 0, eventsInserted: 0, eventCalls: 0, eventQuotaErrors: 0,
      cagnottesFound: cagnottes.itemsFound, cagnottesInserted: cagnottes.itemsInserted, cagnottesCalls: cagnottes.modelCalls,
      errors: ['Événements non exécutés : budget quotidien atteint.'] });
    return;
  }
  const usage: CategoryUsage = { modelCalls: 0, tokensUsed: 0, itemsFound: 0, itemsInserted: 0, quotaErrors: 0 };
  let reportZones: string[] = [];
  const reportErrors: string[] = [];
  let reportCagnottesFound = 0;
  let reportCagnottesInserted = 0;
  let reportCagnottesCalls = 0;
  const runId = randomUUID();
  try {
    console.log('\n--- Gemini Events Search ---');
    const existingKeys = await getExistingEventKeys();
    const departmentCounts = await getDepartmentCounts();
    reportZones = prioritizeDepartments(departmentCounts, Math.floor(Date.now() / 86_400_000)).slice(0, dailyLimit);
    const geminiEvents = quotaBlockedToday ? [] : await scrapeEventsWithGemini(
      existingKeys, departmentCounts, dailyLimit - previous.modelCalls,
      (kind, amount) => { if (kind === 'call') usage.modelCalls += amount; else usage.tokensUsed += amount; },
      () => previous.modelCalls + usage.modelCalls < dailyLimit && previous.tokensUsed + usage.tokensUsed < tokenLimit,
      () => { usage.quotaErrors++; reportErrors.push('Quota Gemini atteint pendant la recherche.'); },
    );
    usage.itemsFound = geminiEvents.length;
    console.log(`Gemini: ${geminiEvents.length} events found`);

    let eventsToInsert = geminiEvents;
    if (geminiEvents.length === 0) {
      await logAutomationError('events_zero_results', 'scraper_events');
      console.warn('[events] Gemini a répondu sans événement. Activation de la source de secours RSS.');
      const fallback = await scrapeEventsFromRss(existingKeys);
      usage.itemsFound = fallback.length;
      if (fallback.length) {
        console.log(`[events] RSS fallback: ${fallback.length} candidats à vérifier`);
        await logAutomationError(`events_fallback_${fallback.length}`, 'scraper_events');
        eventsToInsert = fallback.map(event => ({ ...event, heure: 'À confirmer', organisateur: 'Source RSS à vérifier', categorie: inferEventCategory(event.titre, event.description), gratuit: false }));
      } else {
        await logAutomationError('events_no_source_results', 'scraper_events');
        reportErrors.push('Aucun résultat fiable depuis Gemini ni la source RSS.');
      }
    }

    const digestItems: DigestItem[] = [];

    for (const ev of eventsToInsert) {
      const junkTitle = /^(suivre|voir|like|aimer|inscrivez[- ]vous|en savoir plus|cliquez|share|partager)\b/i.test(ev.titre.trim());
      const eventContext = `${ev.titre} ${ev.description || ''}`;
      const hasEventContext = /(conférence|cours|maraude|séminaire|webinaire|mosquée|iftar|collecte|rencontre|atelier|formation|prière|forum|conférence)/i.test(eventContext);
      if (junkTitle || !hasEventContext) {
        await logAutomationError(`event_rejected_low_quality:${ev.titre.slice(0, 80)}`, 'scraper_events');
        console.warn(`[events] Candidat ignoré : ${ev.titre}`);
        continue;
      }
    const category = inferEventCategory(ev.categorie, ev.titre, ev.description) || normalizeEventCategory(ev.categorie);
    const id = await insertEvent({
      title: ev.titre,
      description: ev.description || '',
      city: ev.ville || null,
      department: ev.departement || null,
      dateStart: ev.date_iso ? new Date(ev.date_iso) : null,
      sourceUrl: ev.url_source || null,
      tags: [category, ...(category === 'maraude' ? ['solidarite'] : [])],
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
        tags: [category, ...(category === 'maraude' ? ['solidarite'] : [])],
        format: 'presentiel',
        isFree: ev.gratuit ?? true,
        registrationUrl: ev.url_source || undefined,
      },
    });

    if (id) {
      usage.itemsInserted++;
      await notifyTelegram({ id, title: ev.titre, category, city: ev.ville, sourceUrl: ev.url_source }).catch(error => console.warn('[telegram] notification échouée:', error instanceof Error ? error.message : 'unknown'));
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

  console.log(`\nInserted: ${digestItems.length}/${eventsToInsert.length}`);

  console.log('\n--- Sending Email Digest ---');
    if (digestItems.length) await sendDigestEmail(digestItems);
    if (usage.quotaErrors) await logAutomationError('gemini_429');

    console.log('\n==== Done ====\n');
  } finally {
    await saveUsage(runId, 'events', usage);
  }
  if (!usage.quotaErrors && !quotaBlockedToday) {
    const cagnottes = await runCagnottes();
    reportCagnottesFound = cagnottes.itemsFound;
    reportCagnottesInserted = cagnottes.itemsInserted;
    reportCagnottesCalls = cagnottes.modelCalls;
  }
  await notifyDailyReport({
    date: today,
    zones: reportZones,
    eventsFound: usage.itemsFound,
    eventsInserted: usage.itemsInserted,
    eventCalls: usage.modelCalls,
    eventQuotaErrors: usage.quotaErrors,
    cagnottesFound: reportCagnottesFound,
    cagnottesInserted: reportCagnottesInserted,
    cagnottesCalls: reportCagnottesCalls,
    errors: reportErrors,
  }).catch(error => console.warn('[telegram] rapport quotidien non envoyé:', error instanceof Error ? error.message : 'unknown'));
  if (usage.itemsFound === 0 && usage.itemsInserted === 0) {
    throw new Error('Scraping événements terminé sans fiche : consulter le journal admin.');
  }
}

async function runCagnottes() {
  const dailyLimit = Math.min(10, Math.max(0, Number.parseInt(process.env.CAGNOTTES_DAILY_CALL_BUDGET || '3', 10) || 0));
  const tokenLimit = Math.min(100_000, Math.max(0, Number.parseInt(process.env.CAGNOTTES_DAILY_TOKEN_BUDGET || '50000', 10) || 0));
  const previous = await getTodayUsage('cagnottes');
  if (previous.quotaErrors > 0 || previous.modelCalls >= dailyLimit || previous.tokensUsed >= tokenLimit) {
    console.log('[budget] Cagnottes en pause : quota ou budget quotidien atteint.');
    return usageSnapshot(0, 0, 0);
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
        if (id) {
          usage.itemsInserted++;
          inserted.push({ title: candidate.titre, url: candidate.url_source });
          await notifyTelegram({ id, title: candidate.titre, category: 'solidarity', city: candidate.pays, sourceUrl: candidate.url_source }).catch(error => console.warn('[telegram] notification échouée:', error instanceof Error ? error.message : 'unknown'));
        }
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
  return usageSnapshot(usage.itemsFound, usage.itemsInserted, usage.modelCalls);
}

function usageSnapshot(itemsFound: number, itemsInserted: number, modelCalls: number) {
  return { itemsFound, itemsInserted, modelCalls };
}

main().catch(async (e) => {
  await logAutomationError('run_failed');
  console.error('Fatal error:', e);
  process.exit(1);
});
