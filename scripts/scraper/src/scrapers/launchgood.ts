// LaunchGood scraper — cagnottes islamiques France
import { CheerioCrawler, RequestList } from 'crawlee';
import type { ScrapedItem } from '../types';

const URLS = [
  'https://www.launchgood.com/discover?c=fr',
  'https://www.launchgood.com/discover?category=mosque',
  'https://www.launchgood.com/discover?category=community',
  'https://www.launchgood.com/discover?category=education',
  'https://www.launchgood.com/discover?category=emergency',
];

export async function scrapeLaunchGood(): Promise<ScrapedItem[]> {
  const items: ScrapedItem[] = [];

  const requestList = await RequestList.open(null, URLS.map(url => ({ url })));

  const crawler = new CheerioCrawler({
    requestList,
    maxRequestsPerCrawl: 20,
    requestHandlerTimeoutSecs: 30,
    minConcurrency: 1,
    maxConcurrency: 2,
    async requestHandler({ $, request }) {
      const results: ScrapedItem[] = [];

      // LaunchGood campaign cards
      $('[class*="CampaignCard"], [class*="campaign-card"], .campaign').each((_, el) => {
        const $el = $(el);
        const titre = $el.find('h2, h3, [class*="title"]').first().text().trim();
        const description = $el.find('p, [class*="description"]').first().text().trim();
        const url = $el.find('a').first().attr('href') || '';
        const image = $el.find('img').first().attr('src') || '';
        const raisedText = $el.find('[class*="raised"], [class*="amount"]').text();
        const goalText = $el.find('[class*="goal"]').text();
        const raised = parseAmount(raisedText);
        const goal = parseAmount(goalText);
        const org = $el.find('[class*="creator"], [class*="organizer"]').first().text().trim();

        if (!titre || titre.length < 5) return;

        results.push({
          id: `lg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          category: 'cagnotte',
          sheetTab: 'soumissions_cagnottes',
          titre: titre.slice(0, 120),
          description: description.slice(0, 500),
          ville: '',
          departement: '',
          organisateur: org || 'LaunchGood',
          url_source: url.startsWith('http') ? url : `https://www.launchgood.com${url}`,
          montant_actuel: raised || undefined,
          montant_objectif: goal || undefined,
          image: image || undefined,
          source: 'launchgood',
          scraped_at: new Date().toISOString(),
          status: 'a_verifier',
          gratuit: true,
        });
      });

      // Filter for France-related or general Islamic content
      const relevant = results.filter(item =>
        isFranceRelated(item.titre) || isFranceRelated(item.description)
      );
      items.push(...relevant);
      if (relevant.length > 0) {
        console.log(`[launchgood] ${request.url} → ${relevant.length} items`);
      }
    },
    failedRequestHandler({ request }: { request: { url: string } }) {
      console.warn(`[launchgood] Failed: ${request.url}`);
    },
  });

  await crawler.run();

  // Dedup
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.titre.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isFranceRelated(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return [
    'france', 'paris', 'lyon', 'marseille', 'mosque', 'masjid',
    'islam', 'muslim', 'ummah', 'gaza', 'palestine', 'orphan',
    'water well', 'puits', 'ramadan', 'zakat', 'sadaqa',
  ].some(kw => lower.includes(kw));
}

function parseAmount(text: string): number | undefined {
  if (!text) return undefined;
  const match = text.replace(/,/g, '').match(/[\d]+/);
  return match ? parseInt(match[0]) : undefined;
}
