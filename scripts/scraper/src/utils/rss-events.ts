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
  const communitySources = ['https://evenements-musulmans.com/'];
  for (const source of communitySources) {
    try {
      const response = await fetch(source, { headers: { 'user-agent': 'Al-Wasil event discovery' } });
      if (response.ok) {
        const html = await response.text();
        let extracted = 0;
        for (const match of html.matchAll(/href=["']([^"']*(?:evenement|event)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
          const link = new URL(match[1], source).toString();
          const title = decode(match[2]).replace(/\s+/g, ' ').trim();
          if (!title || title.length < 8 || title.length > 240 || found.some(event => event.url_source === link)) continue;
          const key = title.toLowerCase() + '||';
          if ([...existingKeys].some(existing => existing.startsWith(key))) continue;
          found.push({ titre: title, description: 'Événement repéré sur ' + new URL(source).hostname + ', à vérifier avant publication.', ville: 'France', departement: '', url_source: link, date_iso: '' });
          extracted++;
        }
        console.log('[fallback] ' + new URL(source).hostname + ': ' + extracted + ' candidat(s)');
      } else {
        console.warn('[fallback] ' + new URL(source).hostname + ': HTTP ' + response.status);
      }
    } catch (error) {
      console.warn('[fallback] ' + new URL(source).hostname + ' inaccessible:', error instanceof Error ? error.message : 'unknown');
    }
  }
  for (const query of QUERIES) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=fr&gl=FR&ceid=FR:fr`;
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Al-Wasil event discovery' } });
      if (!response.ok) {
        console.warn('[fallback] Google News RSS HTTP ' + response.status);
        continue;
      }
      const xml = await response.text();
      let extracted = 0;
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
        extracted++;
      }
      console.log('[fallback] Google News RSS "' + query + '": ' + extracted + ' candidat(s)');
    } catch (error) {
      console.warn('[rss] source de secours inaccessible:', error instanceof Error ? error.message : 'unknown');
    }
  }
  return found.slice(0, 10);
}
