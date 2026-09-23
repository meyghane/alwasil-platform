import type { RunReport } from './contracts';
export function formatAgentReport(run: RunReport): string {
  return [
    `Veille Al-Wasil · ${run.startedAt.slice(0,10)}`,
    `Zones explorées : ${run.zones.join(', ') || 'aucune'}`,
    `Catégories exécutées : ${run.categories.join(', ') || 'aucune'}`,
    `Sources utilisées : ${run.sources.join(', ') || 'aucune'}`,
    `Fiches ajoutées : ${run.added}`,
    `Trouvées : ${run.found} · publiées : ${run.published} · corrigées : ${run.corrected}`,
    `Doublons : ${run.duplicates} · rejetées : ${run.rejected} · archivées : ${run.archived} · en attente : ${run.deferred}`,
    `Quota atteint : ${run.quotaReached ? 'oui' : 'non'}`,
    `Erreurs : ${run.errors.join(' ; ') || 'aucune'}`,
    `Raisons des rejets : ${[...new Set(run.rejectionReasons)].join(' ; ') || 'aucun rejet'}`,
    `Non couvert : ${run.uncovered.join(' ; ') || 'aucune zone demandée'}`,
    `Actions administratrice : ${run.actions.join(' ; ') || 'aucune'}`,
  ].join('\n').slice(0, 3900);
}
