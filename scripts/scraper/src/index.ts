// Al-Wasil — Daily Scraper (GitHub Actions)
// Runs on GitHub servers, not your Mac — 100% free
import { checkAlreadyRanToday, getExistingTitles, writeItem, logRun } from './utils/sheets';
import { scrapeEventsWithGemini } from './utils/gemini';
import { scrapeHelloAsso } from './scrapers/helloasso';
import { scrapeLaunchGood } from './scrapers/launchgood';
import { sendDigestEmail } from './utils/email';
import { MANUAL_REVIEW, AUTO_APPROVED, SHEET_TAB } from './types';
import type { ScrapedItem } from './types';

async function main() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`\n==== Al-Wasil Scraper · ${today} ====\n`);

  // Idempotency: skip if already ran today
  const alreadyRan = await checkAlreadyRanToday();
  if (alreadyRan) {
    console.log('Already ran today. Exiting.');
    process.exit(0);
  }

  const allItems: ScrapedItem[] = [];

  // 1. Events via Gemini + Google Search
  console.log('\n--- Gemini Events Search ---');
  const existingEventTitles = await getExistingTitles('soumissions_events');
  const geminiEvents = await scrapeEventsWithGemini(existingEventTitles);
  for (const ev of geminiEvents) {
    allItems.push({
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category: mapGeminiCategory(ev.categorie),
      sheetTab: mapGeminiCategory(ev.categorie) === 'evenement'
        ? 'soumissions_events'
        : SHEET_TAB[mapGeminiCategory(ev.categorie)],
      titre: ev.titre,
      description: ev.description || '',
      date_iso: ev.date_iso,
      heure: ev.heure,
      ville: ev.ville,
      departement: ev.departement,
      organisateur: ev.organisateur,
      url_source: ev.url_source || '',
      gratuit: ev.gratuit,
      source: 'gemini',
      scraped_at: new Date().toISOString(),
      status: 'a_verifier',
    });
  }
  console.log(`Gemini: ${geminiEvents.length} events`);

  // 2. HelloAsso — cagnottes + events
  console.log('\n--- HelloAsso ---');
  try {
    const helloItems = await scrapeHelloAsso();
    allItems.push(...helloItems);
    console.log(`HelloAsso: ${helloItems.length} items`);
  } catch (e) {
    console.error('HelloAsso error:', e);
  }

  // 3. LaunchGood — cagnottes islamiques
  console.log('\n--- LaunchGood ---');
  try {
    const lgItems = await scrapeLaunchGood();
    allItems.push(...lgItems);
    console.log(`LaunchGood: ${lgItems.length} items`);
  } catch (e) {
    console.error('LaunchGood error:', e);
  }

  console.log(`\nTotal items found: ${allItems.length}`);

  // 4. Separate: manual review vs auto-approved
  const toValidate: ScrapedItem[] = [];
  const autoApproved: ScrapedItem[] = [];

  for (const item of allItems) {
    if (AUTO_APPROVED.includes(item.category)) {
      item.status = 'auto_approuve';
      autoApproved.push(item);
    } else {
      toValidate.push(item);
    }
  }

  console.log(`\nTo validate (manual): ${toValidate.length}`);
  console.log(`Auto-approved: ${autoApproved.length}`);

  // 5. Write all to Google Sheets PRIVÉ
  console.log('\n--- Writing to Sheets ---');
  let written = 0;
  for (const item of allItems) {
    const ok = await writeItem(item);
    if (ok) written++;
    await sleep(300); // gentle rate limit on Apps Script
  }
  console.log(`Written: ${written}/${allItems.length}`);

  // 6. Send email digest
  console.log('\n--- Sending Email Digest ---');
  await sendDigestEmail(toValidate, autoApproved);

  // 7. Log the run (idempotency marker)
  await logRun(today, allItems.length);

  console.log('\n==== Done ====\n');
}

function mapGeminiCategory(cat: string): ScrapedItem['category'] {
  const map: Record<string, ScrapedItem['category']> = {
    conference: 'evenement',
    maraude: 'solidarite',
    cours: 'education',
    iftar: 'evenement',
    webinaire: 'evenement',
    collecte: 'cagnotte',
    autre: 'evenement',
  };
  return map[cat] || 'evenement';
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
