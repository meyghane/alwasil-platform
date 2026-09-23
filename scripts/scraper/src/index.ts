// GitHub Actions delegates to the same authorized-source pipeline as Vercel.
// No unrestricted Google search, RSS fallback or independent publication path.
async function main() {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error('CRON_SECRET manquant : veille non exécutée.');
  let response: Response;
  try {
    response = await fetch('https://al-wasil.fr/api/cron/agents', {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(60000),
    });
  } catch { throw new Error('Service de veille indisponible : aucune recherche locale de secours.'); }
  if (!response.ok) throw new Error(`Service de veille HTTP ${response.status} : vérifier déploiement et configuration.`);
  const result = await response.json() as {ok?:boolean;alreadyRun?:boolean;report?:{found:number;added:number;published:number;duplicates:number;errors:string[]}};
  if (result.alreadyRun) { console.log('Veille quotidienne déjà revendiquée ; aucune relance ni notification répétée.'); return; }
  if (!result.ok || !result.report) throw new Error('Veille en attention : consulter le rapport administrateur.');
  console.log(JSON.stringify({found:result.report.found,added:result.report.added,published:result.report.published,duplicates:result.report.duplicates}));
}
main().catch(() => { console.error('Veille non confirmée : consulter les variables CRON_SECRET et le journal administrateur. Aucun repli vers une recherche non autorisée.'); process.exitCode=1; });
