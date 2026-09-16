# Fiabilité des données — 16 septembre 2026

## Implémentation locale, activation non confirmée

- Migration idempotente 0006 : colonnes de fraîcheur, anciennes fiches actives à revoir immédiatement, journal automation_errors.
- Ne pas inventer last_verified_at : les fiches historiquement non vérifiées gardent NULL. Un lien HTTP accessible ne prouve pas l'exactitude du contenu.
- Cron freshness : authentification obligatoire, événements expirés après leur fin (ou lendemain du début si fin absente), lot de 5 fiches par passage.
- Contrôle des sources HTTP avec adresses publiques IPv4 épinglées, délais et redirections bornés. 404/410 = cassé ; refus, quota, panne ou IPv6 seul = indéterminé.
- Téléphone : validation de format, sans prétendre vérifier la joignabilité.
- URL, téléphone, email et similarité du titre produisent des candidats doublons, sans suppression ni fusion automatique. Événements distincts par date préservés.
- Scraper : répétitions exactes titre/ville/date ignorées ; erreurs terminales journalisées. Concurrence entre insertions : pas encore de contrainte unique ; traitement des doublons approximatifs après insertion.
- Couverture calculée depuis Neon pour les huit catégories, fiches approuvées, départements inconnus affichés.
- Fraîcheur inclut pending/approved sans échéance ; erreurs HTTP affichées.
- Journal protégé accessible via /api/admin/automation-errors, 100 dernières entrées. Interface dédiée et collecte exhaustive des erreurs des anciens pipelines restent à faire.

## Mise en service

Nouvelle tentative le 16 septembre 2026 après validation du build : la connexion Neon reste inaccessible depuis l'environnement Codex. La migration n'a donc pas été déclarée comme appliquée en production.

1. Exécuter `node --env-file=.env.local scripts/apply-data-quality.mjs` avec une connexion Neon fonctionnelle. Cette migration autonome n'est pas ajoutée au journal Drizzle historique (0003–0005 n'y sont pas enregistrées non plus).
2. Tester `node --import tsx --test scripts/data-quality.test.ts`, TypeScript application et scraper, puis le build du contenu exact destiné au commit.
3. Inclure toutes les dépendances : src/lib/data-quality.ts, check-public-link.ts, quality-review.ts ; routes freshness, coverage et automation-errors ; page/client fraîcheur et couverture ; migration et script ; modifications scraper ; planification vercel.json.
4. Vérifier CRON_SECRET côté Vercel, statut Ready, exécuter le contrôle authentifié et consulter les résultats réels.
5. Ne pas déclarer ce chantier terminé tant que la migration, les contrôles Neon et le déploiement ne sont pas confirmés.

## Limites restantes

Lot conservateur de cinq fiches quotidien : augmenter via tâche longue après mesure du volume ; comparaison par catégorie peut nécessiter indexation pour gros catalogue. Pas de certification automatique du contenu ni fusion de fiches. Vue de résolution manuelle des doublons et collecte exhaustive des erreurs restent à compléter.

## Leçon de publication

Un build du dossier de travail inclut les fichiers non committés : il ne valide pas le commit GitHub. Tester le contenu exact publié dans une copie isolée ; vérifier exports, migrations réelles et dépendances. Un schéma TypeScript publié ne crée pas les tables SQL.
