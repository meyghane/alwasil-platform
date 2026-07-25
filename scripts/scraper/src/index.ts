// Al-Wasil — Daily Scraper (GitHub Actions)
// Runs on GitHub servers, not your Mac — 100% free
// Source unique : Gemini + Google Search grounding (pas de scraping HTML direct
// d'un site nommé — HelloAsso/LaunchGood retirés le 25/07/2026 car interdisent
// le scraping dans leurs CGU ; voir ARCHITECTURE.md décision Epic B).
import { checkAlreadyRanToday, getExistingEventTitles, insertEvent } from './utils/db';
import { scrapeEventsWithGemini } from './utils/gemini';
import { sendDigestEmail } from './utils/email';
import { normalizeEventCategory } from './types';
import type { DigestItem } from './types';

async function main() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`\n==== Al-Wasil Scraper · ${today} ====\n`);

  const alreadyRan = await checkAlreadyRanToday();
  if (alreadyRan) {
    console.log('Already ran today. Exiting.');
    process.exit(0);
  }

  console.log('\n--- Gemini Events Search ---');
  const existingTitles = await getExistingEventTitles();
  const geminiEvents = await scrapeEventsWithGemini(existingTitles);
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
  await sendDigestEmail(digestItems);

  console.log('\n==== Done ====\n');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
