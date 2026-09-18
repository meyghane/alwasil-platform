type RssEvent = { titre: string; description: string; ville: string; departement: string; url_source: string; date_iso: string };

const QUERIES = [
  'événement musulman Paris conférence maraude cours',
  'site:mosquee.fr événement France conférence',
  'site:institut* islamique France cours événement',
];

function decode(value: string): string {
  return value.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<[^>]+>/g, '').trim();
}

export async function scrapeEventsFromRss(existingKeys: Set<string>): Promise<RssEvent[]> {
  const found: RssEvent[] = [];
  for (const query of QUERIES) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=fr&gl=FR&ceid=FR:fr`;
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Al-Wasil event discovery' } });
      if (!response.ok) continue;
      const xml = await response.text();
      for (const item of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const block = item[1];
        const title = decode(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '').replace(/\s+-\s+[^-]+$/, '').trim();
        const link = decode(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '');
        const published = decode(block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '');
        if (!title || !link || !/(conférence|cours|maraude|séminaire|webinaire|mosquée|iftar|collecte|rencontre)/i.test(title)) continue;
        const key = `${title.toLowerCase()}||`;
        if ([...existingKeys].some(existing => existing.startsWith(key))) continue;
        if (found.some(event => event.url_source === link)) continue;
        found.push({ titre: title.slice(0, 240), description: `Source de secours à vérifier : ${title}`, ville: 'France', departement: '', url_source: link, date_iso: Number.isNaN(Date.parse(published)) ? '' : new Date(published).toISOString().slice(0, 10) });
      }
    } catch (error) {
      console.warn('[rss] source de secours inaccessible:', error instanceof Error ? error.message : 'unknown');
    }
  }
  return found.slice(0, 10);
}
