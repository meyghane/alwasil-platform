import type { RunReport } from './contracts';
export function formatAgentReport(run: RunReport): string {
  return [
    ...(run.published === 0 ? [[ 'ALERTE ROUGE', String.fromCharCode(0x2014), '0 nouvelle fiche publique' ].join(' ')] : []),
    `Veille Al-Wasil · ${run.startedAt.slice(0,10)}`,
    `Zones explorées : ${run.zones.join(', ') || 'aucune'}`,
    `Catégories exécutées : ${run.categories.join(', ') || 'aucune'}`,
    `Sources utilisées : ${run.sources.join(', ') || 'aucune'}`,
    `Fiches ajoutées : ${run.added}`,
    `Trouvées : ${run.found} · publiées : ${run.published} · corrigées : ${run.corrected}`,
    `Contrôles mesurés : ${run.metrics?.groundingRequests ?? 0} recherches · ${run.metrics?.searchQueries ?? 0} requêtes · ${run.metrics?.pagesAttempted ?? 0} pages consultées (${run.metrics?.pagesFetched ?? 0} chargées) · ${run.metrics?.candidates ?? 0} candidates · ${run.metrics?.writes ?? 0} écritures · ${run.metrics?.visiblePublications ?? 0} visibles publiquement.`,
    `Avancement territoires : ${run.cursor?.completedSlots ?? 0}/${run.cursor?.totalSlots ?? 0} créneaux · prochain curseur ${run.cursor?.next ?? 0}.`,
    `Doublons : ${run.duplicates} · rejetées : ${run.rejected} · archivées : ${run.archived} · en attente : ${run.deferred}`,
    `Quota atteint : ${run.quotaReached ? 'oui' : 'non'}`,
    `Erreurs : ${run.errors.join(' ; ') || 'aucune'}`,
    `Raisons des rejets : ${[...new Set(run.rejectionReasons)].join(' ; ') || 'aucun rejet'}`,
    `Non couvert : ${run.uncovered.join(' ; ') || 'aucune zone demandée'}`,
    `Actions administratrice : ${run.actions.join(' ; ') || 'aucune'}`,
  ].join('\n').slice(0, 3900);
}
