import { randomUUID } from 'node:crypto';
import { AUTO_CATEGORIES, type Source, type RecordData, type RunReport } from './contracts';
import { discoverSources } from './discovery';
import { extractStructured } from './extraction';
import { assessRecord } from './policy';

export type AgentPorts = {
  sources(): Promise<Source[]>;
  fetch(url: string): Promise<string>;
  save(record: RecordData, assessment: ReturnType<typeof assessRecord>): Promise<{ id: string; duplicate: boolean; published: boolean }>;
  verifyPublic(id: string): Promise<boolean>;
  rollback(id: string): Promise<void>;
  finish(report: RunReport): Promise<void>;
};

export async function runAgents(ports: AgentPorts, now = new Date(), runId: string = randomUUID()): Promise<RunReport> {
  const started = Date.now();
  const report: RunReport = { id: runId, startedAt: now.toISOString(), zones: [], categories: [], found: 0, published: 0, corrected: 0, duplicates: 0, rejected: 0, archived: 0, deferred: 0, errors: [], quotaReached: false, uncovered: [], actions: [] };
  try {
    const plan = discoverSources(await ports.sources(), AUTO_CATEGORIES, 3, Math.floor(now.getTime()/86400000));
    report.uncovered = plan.uncovered; report.quotaReached = plan.quotaReached;
    if (!plan.selected.length) report.actions.push('Enregistrer des sources officielles pour les catégories et zones demandées.');
    for (const source of plan.selected) {
      if (Date.now()-started>35000) { report.quotaReached=true; report.uncovered.push(`${source.category} : budget de temps atteint`); break; }
      report.zones = [...new Set([...report.zones, ...source.departments.filter(d => plan.plannedZones.includes(d as never))])];
      report.categories = [...new Set([...report.categories, source.category])];
      try {
        const candidates = extractStructured(await ports.fetch(source.url), source, now.toISOString());
        if (!candidates.length) report.actions.push(`${source.category} : source sans fiche structurée exploitable, adaptateur nécessaire.`);
        for (const record of candidates) {
          if (report.found >= 50 || Date.now()-started>35000) { report.quotaReached = true; break; }
          report.found++;
          const assessment = assessRecord(record, source, false, now);
          if (assessment.decision === 'blocked') { report.rejected++; continue; }
          const saved = await ports.save(record, assessment);
          if (saved.duplicate) { report.duplicates++; continue; }
          if (!saved.published) { report.deferred++; continue; }
          let visible = false;
          try { visible = await ports.verifyPublic(saved.id); } catch { /* Never confirm unverified publication. */ }
          if (visible) report.published++;
          else { await ports.rollback(saved.id); report.deferred++; report.errors.push('Publication non visible : remise en attente.'); }
        }
      } catch { report.errors.push(`${source.category} : recherche ou enregistrement indisponible.`); }
    }
    report.uncovered.push('Hajj/Omra, cagnottes, santé, droit : validation humaine ; emploi non demandé.');
  } catch { report.errors.push('Registre de sources indisponible.'); }
  await ports.finish(report);
  return report;
}

export function freshnessProposal(record: RecordData, reachable: boolean, now = new Date()) {
  if (record.date && record.date < now.toISOString().slice(0,10)) return { action: 'archive', reason: 'événement expiré' };
  if (!reachable) return { action: 'reverify', reason: 'source inaccessible, fermeture non confirmée' };
  if (now.getTime()-Date.parse(record.verifiedAt)>30*86400000) return { action: 'reverify', reason: 'vérification ancienne' };
  return { action: 'none', reason: 'aucune modification démontrée' };
}
