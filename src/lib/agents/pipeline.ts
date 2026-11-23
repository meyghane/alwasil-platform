import { randomUUID } from 'node:crypto';
import { createHash } from 'node:crypto';
import { DISCOVERY_CATEGORIES, type Source, type RecordData, type RunReport } from './contracts';
import { discoverSources, searchGroundedSources } from './discovery';
import { extractStructured, firstPartyEvidence, relatedOfficialPage } from './extraction';
import { assessRecord } from './policy';

export type AgentPorts = {
  sources(): Promise<Source[]>;
  fetch(url: string): Promise<string>;
  save(record: RecordData, assessment: ReturnType<typeof assessRecord>): Promise<{ id: string; duplicate: boolean; published: boolean; blocked?: string }>;
  verifyPublic(id: string): Promise<boolean>;
  rollback(id: string): Promise<void>;
  finish(report: RunReport): Promise<void>;
  sourceChecked?(id: string, errorCode: string | null): Promise<void>;
  rememberSource?(source: Source, department: string): Promise<string | null>;
};

export async function runAgents(ports: AgentPorts, now = new Date(), runId: string = randomUUID(), savedCursor?: number): Promise<RunReport> {
  const started = Date.now();
  const report: RunReport = { id: runId, startedAt: now.toISOString(), zones: [], categories: [], sources: [], added: 0, rejectionReasons: [], found: 0, published: 0, corrected: 0, duplicates: 0, rejected: 0, archived: 0, deferred: 0, errors: [], quotaReached: false, uncovered: [], actions: [],
    metrics: { groundingRequests: 0, searchQueries: 0, pagesAttempted: 0, pagesFetched: 0, candidates: 0, writes: 0, visiblePublications: 0 },
    cursor: { start: 0, next: 0, completedSlots: 0, totalSlots: 0 },
  };
  try {
    const sourceRegistry = await ports.sources();
    const plan = discoverSources(sourceRegistry, DISCOVERY_CATEGORIES, 3, Math.floor(now.getTime()/86400000), savedCursor);
    report.uncovered = []; report.quotaReached = false;
    report.cursor = { start: plan.startCursor, next: plan.nextCursor, completedSlots: 0, totalSlots: plan.totalSlots };
    report.actions.push(`Registre : ${sourceRegistry.length} source(s), ${sourceRegistry.filter(s => s.enabled && s.trust === 'trusted').length} fiable(s) activée(s), ${sourceRegistry.filter(s => s.trust === 'pending' || !s.enabled).length} en attente/désactivée(s), ${plan.slots.length} créneau(x) parcouru(s), ${plan.selected.length} source(s) enregistrée(s) exécutée(s).`);
    // Server-side web discovery uses the OpenAI Responses API only. Never
    // forward credentials between providers; ChatGPT subscription access does
    // not itself configure API usage or billing.
    const apiKey = process.env.OPENAI_API_KEY;
    const usedUrls = new Set<string>();
    for (const slot of plan.slots) {
      if (Date.now()-started>44000) { report.quotaReached=true; report.uncovered.push(`${slot.category} · ${slot.territory} : budget de temps atteint`); break; }
      report.cursor.completedSlots++;
      let source = slot.source;
      if (!source) {
        if (!apiKey) {
          report.uncovered.push(`${slot.category} · ${slot.territory} : OPENAI_API_KEY absente, recherche web non lancée`);
          continue;
        }
        try {
          report.zones = [...new Set([...report.zones, ...slot.departments])];
          report.categories = [...new Set([...report.categories, slot.category])];
          report.metrics.groundingRequests++;
          const search = await searchGroundedSources(slot.category, slot.territory, slot.departments, apiKey);
          report.metrics.searchQueries += search.queries.length;
          report.actions.push(`Recherche web · ${slot.category} · ${slot.territory} : ${search.queries.length} requête(s), ${search.urls.length} page(s) source à contrôler.`);
          if (!search.urls.length) report.uncovered.push(`${slot.category} · ${slot.territory} : la recherche web n’a retourné aucune page source exploitable`);
          for (const url of search.urls) {
            if (Date.now()-started>44000 || report.found>=50 || usedUrls.has(url)) break;
            usedUrls.add(url);
            report.metrics.pagesAttempted++;
            try {
              const html = await ports.fetch(url);
              report.metrics.pagesFetched++;
              const legalEvidence = firstPartyEvidence(html, url);
              if (!legalEvidence) {
                report.uncovered.push(`${slot.category} · ${slot.territory} : source repérée mais identité de l’éditeur non établie (${new URL(url).hostname})`);
                continue;
              }
              const discovered: Source = {
                id: `web-${slot.category}-${createSourceId(url)}`, url, category: slot.category,
                departments: [...slot.departments], trust: 'trusted', official: true,
                evidence: `Recherche Google puis vérification de la page originale : ${legalEvidence}`,
                enabled: true,
              };
              report.sources.push(url);
              const before = report.metrics.candidates;
              await processPage(discovered, html, now, started, ports, report);
              if (report.metrics.candidates === before && Date.now()-started <= 35000) {
                const related = relatedOfficialPage(html, url, slot.category);
                if (related && !usedUrls.has(related)) {
                  usedUrls.add(related);
                  report.metrics.pagesAttempted++;
                  const relatedHtml = await ports.fetch(related);
                  report.metrics.pagesFetched++;
                  await processPage({ ...discovered, url: related }, relatedHtml, now, started, ports, report);
                  report.actions.push(`${slot.category} · page officielle liée consultée pour compléter l’extraction : ${new URL(related).hostname}${new URL(related).pathname}`);
                }
              }
            } catch {
              report.errors.push(`${slot.category} · page source inaccessible : ${new URL(url).hostname}`);
            }
          }
          continue;
        } catch (error) {
          const detail = error instanceof Error ? error.message.slice(0, 100) : 'erreur inconnue';
          report.errors.push(`Recherche web indisponible · ${slot.category} · ${slot.territory} · ${detail}`);
          report.uncovered.push(`${slot.category} · ${slot.territory} : recherche de secours en échec`);
          continue;
        }
      }
      if (!source || usedUrls.has(source.url)) continue;
      usedUrls.add(source.url);
      report.zones = [...new Set([...report.zones, ...slot.departments])];
      report.categories = [...new Set([...report.categories, source.category])];
      report.sources.push(source.url);
      let sourceError: string | null = null;
      try {
        report.metrics.pagesAttempted++;
        const html = await ports.fetch(source.url);
        report.metrics.pagesFetched++;
        const before = report.metrics.candidates;
        await processPage(source, html, now, started, ports, report);
        if (report.metrics.candidates === before && Date.now()-started <= 35000) {
          const related = relatedOfficialPage(html, source.url, slot.category);
          if (related && !usedUrls.has(related)) {
            usedUrls.add(related);
            report.metrics.pagesAttempted++;
            try {
              const relatedHtml = await ports.fetch(related);
              report.metrics.pagesFetched++;
              await processPage({ ...source, url: related }, relatedHtml, now, started, ports, report);
              report.actions.push(`${slot.category} · page officielle liée consultée pour compléter l’extraction : ${new URL(related).hostname}${new URL(related).pathname}`);
            } catch { report.uncovered.push(`${slot.category} · page interne officielle inaccessible, extraction de secours poursuivie`); }
          }
        }
        if (report.metrics.candidates === before) {
          if (!apiKey) report.uncovered.push(`${slot.category} · ${slot.territory} : source enregistrée sans fiche exploitable et recherche OpenAI indisponible (clé absente)`);
          else if (Date.now() - started <= 40000) {
            report.metrics.groundingRequests++;
            let search;
            try { search = await searchGroundedSources(slot.category, slot.territory, slot.departments, apiKey); }
            catch (error) {
              const detail = error instanceof Error ? error.message.slice(0, 100) : 'erreur inconnue';
              report.errors.push(`Recherche web indisponible · ${slot.category} · ${slot.territory} · ${detail}`);
              report.uncovered.push(`${slot.category} · ${slot.territory} : recherche de complément bloquée (${detail})`);
              continue;
            }
            report.metrics.searchQueries += search.queries.length;
            report.actions.push(`Source enregistrée sans fiche exploitable · recherche web de complément · ${slot.category} · ${slot.territory} : ${search.queries.length} requête(s), ${search.urls.length} page(s).`);
            if (!search.urls.length) report.uncovered.push(`${slot.category} · ${slot.territory} : aucune page source trouvée après la source enregistrée.`);
            for (const url of search.urls) {
              if (Date.now() - started > 44000 || usedUrls.has(url)) continue;
              usedUrls.add(url);
              report.metrics.pagesAttempted++;
              const discoveredHtml = await ports.fetch(url);
              report.metrics.pagesFetched++;
              const legalEvidence = firstPartyEvidence(discoveredHtml, url);
              if (!legalEvidence) {
                report.uncovered.push(`${slot.category} · source trouvée mais éditeur non établi (${new URL(url).hostname})`);
                continue;
              }
              const discovered: Source = {
                id: `web-${slot.category}-${createSourceId(url)}`, url, category: slot.category,
                departments: [...slot.departments], trust: 'trusted', official: true,
                evidence: `Recherche web puis vérification de la page originale : ${legalEvidence}`,
                enabled: true,
              };
              report.sources.push(url);
              await processPage(discovered, discoveredHtml, now, started, ports, report);
            }
          }
        }
      } catch { sourceError = 'source_or_storage_unavailable'; report.errors.push(`${source.category} : recherche ou enregistrement indisponible.`); }
      finally { await ports.sourceChecked?.(source.id, sourceError); }
    }
    report.uncovered.push('Hajj/Omra, cagnottes, santé et justice ne sont ajoutées que lorsque leurs champs de preuve et de qualité propres à la catégorie sont vérifiés ; aucun emploi n’est recherché.');
    report.cursor.next = (plan.startCursor + report.cursor.completedSlots) % Math.max(1, plan.totalSlots);
    if (report.published === 0) {
      report.errors.push('Aucune nouvelle fiche publique vérifiée pendant ce lancement.');
      report.actions.push(`Diagnostic : ${report.sources.length} source(s) exécutée(s), ${report.found} fiche(s) trouvée(s), ${report.duplicates} doublon(s), ${report.rejected} rejet(s), ${report.deferred} fiche(s) différée(s).`);
    }
  } catch { report.errors.push('Registre de sources indisponible.'); }
  await ports.finish(report);
  return report;
}

function createSourceId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 20);
}

async function processPage(source: Source, html: string, now: Date, started: number, ports: AgentPorts, report: RunReport) {
  const candidates = extractStructured(html, source, now.toISOString());
  report.metrics.candidates += candidates.length;
  if (!candidates.length) report.actions.push(`${source.category} · ${new URL(source.url).hostname} : page consultée, aucune fiche assez structurée pour être candidate.`);
  for (const record of candidates) {
    if (report.found >= 50 || Date.now()-started>44000) { report.quotaReached = true; return; }
    report.found++;
    let recordSource = source;
    let recordData = record;
    const discoveredSource = source.id.startsWith('web-');
    if (discoveredSource) {
      const department = record.department;
      const onlineEvent = record.category === 'evenement' && /en ligne|online|webinaire|visioconférence/i.test(`${record.format.join(' ')} ${record.description}`);
      if ((!department && !onlineEvent) || !ports.rememberSource) {
        report.deferred++;
        report.uncovered.push(`${record.category} · ${record.title} : source officielle trouvée, mais territoire précis ou enregistrement historisé indisponible`);
        continue;
      }
      recordSource = { ...source, departments: department ? [department] : [] };
    }
    let assessment = assessRecord(recordData, recordSource, false, now);
    if (assessment.decision === 'blocked') { report.rejected++; report.rejectionReasons.push(...assessment.reasons); continue; }
    if (discoveredSource && assessment.decision !== 'automatic') {
      report.deferred++;
      report.uncovered.push(`${record.category} · ${record.title} : source non inscrite, fiche incomplète ou garde-fou de publication non satisfait (${assessment.reasons.join(', ')})`);
      continue;
    }
    const links = [...new Set([
      recordData.website,
      recordData.registrationUrl,
      recordData.qualificationUrl,
      recordData.adaptationEvidence?.url,
    ].filter((url): url is string => !!url && url !== source.url))];
    let deadLink = false;
    for (const link of links) {
      report.metrics.pagesAttempted++;
      try { await ports.fetch(link); report.metrics.pagesFetched++; }
      catch { deadLink = true; report.rejectionReasons.push(`Lien public inaccessible (${new URL(link).hostname})`); break; }
    }
    if (deadLink) { report.deferred++; continue; }
    if (discoveredSource) {
      const department = recordData.department;
      const qualified = await ports.rememberSource?.({ ...recordSource, departments: [department] }, department);
      if (!qualified) {
        report.deferred++;
        report.uncovered.push(`${record.category} · ${record.title} : source non ajoutée au registre (source bloquée ou conflit de catégorie)`);
        continue;
      }
      recordSource = { ...recordSource, id: qualified };
      recordData = { ...recordData, provenance: { ...recordData.provenance, sourceId: qualified } };
      assessment = assessRecord(recordData, recordSource, false, now);
      if (assessment.decision !== 'automatic') {
        report.deferred++;
        report.uncovered.push(`${record.category} · ${record.title} : requalification refusée après inscription de la source`);
        continue;
      }
    }
    const saved = await ports.save(recordData, assessment);
    if (saved.blocked) {
      report.deferred++;
      report.uncovered.push(`${record.category} · ${record.title} : ${saved.blocked}`);
      continue;
    }
    if (saved.duplicate) { report.duplicates++; continue; }
    report.metrics.writes++;
    report.added++;
    if (!saved.published) { report.deferred++; continue; }
    let visible = false;
    try { visible = await ports.verifyPublic(saved.id); } catch { /* Unconfirmed remains unconfirmed. */ }
    if (visible) { report.published++; report.metrics.visiblePublications++; }
    else { await ports.rollback(saved.id); report.deferred++; report.errors.push('Publication non visible : remise en attente.'); }
  }
}

export function freshnessProposal(record: RecordData, reachable: boolean, now = new Date()) {
  if (record.date && record.date < now.toISOString().slice(0,10)) return { action: 'archive', reason: 'événement expiré' };
  if (!reachable) return { action: 'reverify', reason: 'source inaccessible, fermeture non confirmée' };
  if (now.getTime()-Date.parse(record.verifiedAt)>30*86400000) return { action: 'reverify', reason: 'vérification ancienne' };
  return { action: 'none', reason: 'aucune modification démontrée' };
}
