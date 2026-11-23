import { createHash } from 'node:crypto';
import type { AgentCategory, RecordData, Source } from './contracts';
type JsonObject = Record<string, unknown>;
const text = (value: unknown): string => typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : '';
const object = (value: unknown): JsonObject => value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
const strings = (value: unknown): string[] => (Array.isArray(value) ? value : [value]).map(v => text(v) || text(object(v).name)).filter(Boolean);
const decodeHtml = (value: string) => value
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&').replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
function visibleText(html: string): string {
  return decodeHtml(html.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim();
}
function explicitMuslimEvidence(value: string): string | undefined {
  const match = value.match(/[^.!?]{0,110}\b(?:musulman(?:e|es)?|islam(?:ique|iques)?|mosqu(?:e|ée)|halal|ramadan|omra|hajj|coran(?:ique|iques)?|burkini)\b[^.!?]{0,150}/i);
  return match?.[0]?.trim();
}
function absoluteHttps(value: unknown, base: string): string {
  const raw = text(value);
  if (!raw) return '';
  try { const url = new URL(raw, base); return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : ''; }
  catch { return ''; }
}
export function firstPartyEvidence(html: string, pageUrl: string): string | undefined {
  try {
    const page = new URL(pageUrl);
    const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map(match => {
      try { return new URL(decodeHtml(match[1]), page).hostname.toLowerCase().replace(/^www\./, ''); } catch { return ''; }
    });
    const host = page.hostname.toLowerCase().replace(/^www\./, '');
    const textContent = visibleText(html);
    const legal = /mentions? légales|informations? légales|siret|siren|rna\s*[:#]?\s*[wW]?\d{5,}/i.test(textContent);
    const contact = /contact|nous joindre|nous trouver/i.test(textContent) &&
      (/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(textContent) || /(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}/.test(textContent) || /\d{1,3}\s+(?:rue|avenue|boulevard|place|chemin)\b/i.test(textContent));
    if (legal && contact && links.includes(host)) return `Le site contient des mentions d’identification légale et un contact public, avec un lien interne au domaine ${host}.`;
  } catch { /* Invalid page URL never passes first-party checks. */ }
  return undefined;
}
const pageTerms: Record<string, RegExp> = {
  mosquee: /cours|enseignement|activit[eé]|contact|acc[eè]s|adresse/i,
  institut: /cours|formation|programme|planning|mati[eè]re|contact/i,
  evenement: /agenda|[eé]v[eé]nement|calendrier|inscription|rencontre/i,
  association: /action|projet|activit[eé]|solidarit[eé]|association|contact/i,
  librairie: /librairie|catalogue|boutique|livre|contact|adresse/i,
  piscine: /r[eè]glement|tenue|piscine|conditions|acc[eè]s/i,
  hajj: /hajj|omra|offre|s[eé]jour|voyage/i,
  cagnotte: /collecte|don|campagne|helloasso/i,
  sante: /soin|accompagnement|praticien|consultation|contact/i,
  justice: /droit|juridique|permanence|contact/i,
};
/** One same-site page likely to contain category details, never an external redirect. */
export function relatedOfficialPage(html: string, pageUrl: string, category: AgentCategory): string | undefined {
  try {
    const base = new URL(pageUrl);
    const terms = pageTerms[category];
    if (!terms) return undefined;
    const candidates = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map(match => {
        try {
          const target = new URL(decodeHtml(match[1]), base);
          const label = `${match[2].replace(/<[^>]+>/g, ' ')} ${target.pathname}`.replace(/\s+/g, ' ');
          if (target.protocol !== 'https:' || target.hostname !== base.hostname || target.username || target.password || target.origin !== base.origin || !terms.test(label)) return '';
          target.hash = '';
          return target.toString();
        } catch { return ''; }
      }).filter(Boolean);
    return [...new Set(candidates)].find(url => url !== base.toString());
  } catch { return undefined; }
}
// A trusted domain does not make every entity on its pages a place in this category.
const schemaTypes: Record<string, string[]> = {
  mosquee: ['Mosque'], institut: ['EducationalOrganization', 'School'],
  evenement: ['Event', 'EducationEvent', 'SocialEvent', 'Festival', 'BusinessEvent'],
  association: ['Organization', 'NGO'], librairie: ['BookStore'], piscine: ['PublicSwimmingPool'],
};

export function extractStructured(html: string, source: Source, fetchedAt: string): RecordData[] {
  const documents: JsonObject[] = [];
  const pageText = visibleText(html);
  function visit(value: unknown) {
    if (Array.isArray(value)) { value.forEach(visit); return; }
    const node = object(value);
    if (node['@graph']) visit(node['@graph']);
    if (node.itemListElement) visit(node.itemListElement);
    if (node.item) visit(node.item);
    const types = strings(node['@type']).map(type => type.replace(/^https?:\/\/schema\.org\//, ''));
    if (node.name && types.some(type => (schemaTypes[source.category] || []).includes(type))) documents.push(node);
  }
  for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { visit(JSON.parse(match[1])); } catch { /* Invalid structured source is not invented from prose. */ }
  }
  const structuredRecords = documents.slice(0, 50).map(node => {
    const address = object(node.address || object(node.location).address);
    const geo = object(node.geo || object(node.location).geo);
    const postalCode = text(address.postalCode);
    const corsicaCode = Number(postalCode);
    const department = postalCode.startsWith('97') ? postalCode.slice(0,3) : postalCode.startsWith('20')
      ? (corsicaCode >= 20000 && corsicaCode <= 20190 ? '2A' : corsicaCode >= 20200 && corsicaCode <= 20620 ? '2B' : '')
      : postalCode.slice(0,2);
    const title = text(node.name); const description = text(node.description);
    const poolTypeValue = text(node.poolType || node.type || node.category || node.additionalType).toLocaleLowerCase('fr-FR');
    const poolType: RecordData['poolType'] = /associat/.test(poolTypeValue) ? 'associative' : /priv[eé]/.test(poolTypeValue) ? 'privee' : /municip/.test(poolTypeValue) ? 'municipale' : undefined;
    const relevanceExcerpt = explicitMuslimEvidence([title, description, strings(node.keywords).join(', '), pageText].join(' '));
    return {
      title, description, category: source.category, subType: source.category,
      commercial: !!node.offers || !!node.priceRange,
      city: text(address.addressLocality), department, address: text(address.streetAddress),
      phone: text(node.telephone), email: text(node.email), website: absoluteHttps(node.url, source.url) || source.url,
      registrationUrl: source.category === 'evenement' ? absoluteHttps(object(node.offers).url, source.url) || undefined : undefined,
      hours: strings(node.openingHours || node.schedule), courses: strings(node.hasCourse), audience: strings(node.audience),
      format: strings(node.courseMode), tags: strings(node.keywords), verifiedAt: fetchedAt,
      image: text(node.image) || text(object(node.image).url) || undefined,
      date: text(node.startDate).slice(0,10) || undefined, organizer: text(object(node.organizer).name) || undefined,
      latitude: typeof geo.latitude === 'number' ? geo.latitude : undefined,
      longitude: typeof geo.longitude === 'number' ? geo.longitude : undefined,
      poolType,
      relevanceEvidence: relevanceExcerpt ? { url: source.url, excerpt: relevanceExcerpt, reason: 'Mention explicite trouvée dans le contenu visible de la source.' } : undefined,
      provenance: { sourceId: source.id, url: source.url, fetchedAt, contentHash: createHash('sha256').update(html).digest('hex'), fields: Object.keys(node) },
    };
  }).filter(record => !!record.title);
  if (structuredRecords.length) return structuredRecords;

  // Prose-only first-party pages are candidates too. We preserve only text that
  // can be read directly from the page; missing address/date/contact stay blank
  // and the quality gate will keep incomplete records out of publication.
  const title = decodeHtml(html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']og:title["'][^>]*>/i)?.[1] ||
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
    html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, '').trim();
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => match[0]);
  const descriptionTag = metaTags.find(tag => /(?:name|property)=["'](?:description|og:description)["']/i.test(tag));
  const description = decodeHtml(descriptionTag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] || '');
  const evidence = explicitMuslimEvidence(`${title}. ${description}. ${pageText}`);
  if (!title || !description || description.length < 40 || !evidence) return [];

  const email = pageText.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || '';
  const phone = pageText.match(/(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}/)?.[0].replace(/[ .-]/g, '') || '';
  const addressMatch = pageText.match(/(?:adresse|nous trouver|localisation)\s*[:\-]?\s*([^.!?]{8,120})/i) ||
    pageText.match(/\b\d{1,4}(?:\s?(?:bis|ter))?\s+(?:rue|avenue|boulevard|place|chemin|allée|impasse|route)\b[^.!?]{0,90}/i);
  const postal = pageText.match(/\b(\d{5})\s+([A-ZÀ-Ÿ][\p{L}'’ -]{1,40})\b/u);
  const postalCode = postal?.[1] || '';
  const department = postalCode.startsWith('97') ? postalCode.slice(0,3) : postalCode.startsWith('20')
    ? (Number(postalCode) <= 20190 ? '2A' : Number(postalCode) <= 20620 ? '2B' : '') : postalCode.slice(0,2);
  return [{
    title, description, category: source.category, subType: source.category,
    commercial: source.category === 'librairie', city: postal?.[2]?.trim() || '', department,
    address: addressMatch?.[1]?.trim() || '', phone, email,
    website: source.url, hours: [], courses: [], audience: [], format: [], tags: [],
    verifiedAt: fetchedAt,
    relevanceEvidence: { url: source.url, excerpt: evidence, reason: 'Mention explicite trouvée dans le contenu visible de la source.' },
    provenance: { sourceId: source.id, url: source.url, fetchedAt, contentHash: createHash('sha256').update(html).digest('hex'), fields: ['title', 'meta description', ...(email ? ['email'] : []), ...(phone ? ['phone'] : []), ...(addressMatch ? ['address'] : []), 'relevanceEvidence'] },
  }];
}
