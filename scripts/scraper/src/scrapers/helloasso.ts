// HelloAsso scraper — cagnottes + événements associations musulmanes
import { CheerioCrawler, RequestList } from 'crawlee';
import type { ScrapedItem } from '../types.js';

const SEARCH_TERMS = ['islam', 'musulman', 'mosquée', 'maraude', 'halal', 'coran'];

export async function scrapeHelloAsso(): Promise<ScrapedItem[]> {
  const items: ScrapedItem[] = [];

  const urls = SEARCH_TERMS.map(term =>
    `https://www.helloasso.com/associations?q=${encodeURIComponent(term)}&type=fundraiser`
  );

  const requestList = await RequestList.open(null, urls.map(url => ({ url })));

  const crawler = new CheerioCrawler({
    requestList,
    maxRequestsPerCrawl: 30,
    requestHandlerTimeoutSecs: 30,
    minConcurrency: 1,
    maxConcurrency: 2,
    async requestHandler({ $, request }) {
      const results: ScrapedItem[] = [];

      // Cagnottes/fundraisers
      $('[data-testid="fundraiser-card"], .fundraiser-card, .campaign-card').each((_, el) => {
        const $el = $(el);
        const titre = $el.find('h3, .title, [class*="title"]').first().text().trim();
        const description = $el.find('p, .description').first().text().trim();
        const url = $el.find('a').first().attr('href') || '';
        const image = $el.find('img').first().attr('src') || '';
        const montantText = $el.find('[class*="amount"], [class*="montant"]').text();
        const montantMatch = montantText.match(/([\d\s]+)/);
        const montant = montantMatch ? parseInt(montantMatch[1].replace(/\s/g, '')) : 0;

        if (!titre || titre.length < 5) return;

        results.push({
          id: `ha-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          category: 'cagnotte',
          sheetTab: 'soumissions_cagnottes',
          titre: titre.slice(0, 120),
          description: description.slice(0, 500),
          ville: '',
          departement: '',
          organisateur: 'HelloAsso',
          url_source: url.startsWith('http') ? url : `https://www.helloasso.com${url}`,
          montant_actuel: montant || undefined,
          image: image || undefined,
          source: 'helloasso',
          scraped_at: new Date().toISOString(),
          status: 'a_verifier',
          gratuit: true,
        });
      });

      // Événements
      $('[data-testid="event-card"], .event-card, [class*="EventCard"]').each((_, el) => {
        const $el = $(el);
        const titre = $el.find('h3, h2, .title').first().text().trim();
        const dateText = $el.find('[class*="date"], time').first().text().trim();
        const ville = $el.find('[class*="location"], [class*="city"]').first().text().trim();
        const url = $el.find('a').first().attr('href') || '';

        if (!titre || titre.length < 5) return;

        results.push({
          id: `ha-ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          category: 'evenement',
          sheetTab: 'soumissions_events',
          titre: titre.slice(0, 120),
          description: dateText,
          date_iso: parseDate(dateText),
          ville: ville.slice(0, 50),
          departement: '',
          organisateur: 'HelloAsso',
          url_source: url.startsWith('http') ? url : `https://www.helloasso.com${url}`,
          source: 'helloasso',
          scraped_at: new Date().toISOString(),
          status: 'a_verifier',
          gratuit: true,
        });
      });

      const relevant = results.filter(item => isIslamicContent(item.titre));
      items.push(...relevant);
      if (relevant.length > 0) {
        console.log(`[helloasso] ${request.url} → ${relevant.length} items`);
      }
    },
    failedRequestHandler({ request, error }) {
      console.warn(`[helloasso] Failed: ${request.url}`, error.message);
    },
  });

  await crawler.run();

  // Dedup by titre
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.titre.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isIslamicContent(text: string): boolean {
  const lower = text.toLowerCase();
  return [
    'islam', 'musulman', 'mosquée', 'mosquee', 'maraude', 'halal',
    'coran', 'ramadan', 'iftar', 'masjid', 'hijab', 'gaza', 'palestine',
    'solidarité', 'humanitaire', 'association', 'collecte',
  ].some(kw => lower.includes(kw));
}

function parseDate(text: string): string | undefined {
  // Try to extract a date from text like "12 juillet 2026"
  const months: Record<string, string> = {
    'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12',
  };
  for (const [month, num] of Object.entries(months)) {
    const re = new RegExp(`(\\d{1,2})\\s+${month}\\s+(\\d{4})`, 'i');
    const m = text.match(re);
    if (m) return `${m[3]}-${num}-${m[1].padStart(2, '0')}`;
  }
  return undefined;
}
