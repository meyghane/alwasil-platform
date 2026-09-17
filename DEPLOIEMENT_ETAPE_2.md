# Passage en production : fiabilité et scraping

## État au 17 septembre 2026

Le code de la fiabilité existe, mais la base Neon contrôlée n'a ni les colonnes de fraîcheur ni `automation_errors`. Ne pas pousser le code avant les migrations. Le nouveau pipeline découvre des événements et des cagnottes avec budgets quotidiens séparés, arrêt global sur 429 et suivi dans `/admin/scraping`. Les événements sont recherchés en priorité dans les départements les moins couverts.

Les cagnottes découvertes sont uniquement des **candidates en attente de modération**. Le scraper n'accepte que des URL HTTPS HelloAsso ou LaunchGood et n'invente aucun montant. Une notification email renvoie vers la modération, sans bouton d'approbation direct. La page de modération demande explicitement de vérifier l'organisateur, l'activité de la collecte, la destination des dons et la page source avant approbation. L'ancien `/api/cron/scrape-cagnottes` reste un placeholder. Les deux anciens scrapers Google Sheets sont désactivés par défaut (`410`) et les boutons correspondants ont été retirés de l'admin. Les autres endpoints Sheets et Make restent à inventorier avant retrait ; ne pas annoncer leur unification comme terminée.

## Depuis le terminal local connecté à Neon et GitHub

1. Vérifier que `DATABASE_URL` pointe bien vers la base Neon de production. Si `DATABASE_URL_UNPOOLED` est disponible, les migrations l'utilisent en priorité. Ne pas afficher ces valeurs.
2. Exécuter `node --env-file=.env.local scripts/apply-data-quality.mjs`.
3. Exécuter `node --env-file=.env.local scripts/apply-scrape-usage.mjs`.
4. Exécuter `node --env-file=.env.local scripts/verify-scraping-readiness.mjs`. Le résultat doit indiquer zéro fiche active sans échéance de revue.
5. Exécuter `node --import tsx --test scripts/data-quality.test.ts scripts/scraper/test/gemini.test.ts`, puis `npm --prefix scripts/scraper run build`, puis `npm run build`.
6. Vérifier les changements avec `git status --short` et publier seulement les fichiers du chantier validé. Le changement local de suppression des cadratins dans `src/lib/db-queries.ts` et `src/lib/typography.ts` doit être inclus ou explicitement différé.
7. Après le push, vérifier le déploiement Vercel Ready, lancer le workflow `Scraping Quotidien Al-Wasil` une fois, puis consulter `/admin/scraping` et `/api/admin/automation-errors` en session admin.

`CRON_SECRET` doit être présent dans Vercel pour le contrôle quotidien de fraîcheur. `GEMINI_API_KEY` et `DATABASE_URL` doivent être présents dans GitHub Actions. Aucun secret ne doit être commité.

## Garde-fous

- `EVENTS_DAILY_CALL_BUDGET` est fixé à 7 appels par jour et `CAGNOTTES_DAILY_CALL_BUDGET` à 3. Les plafonds complémentaires sont 120 000 et 50 000 tokens déclarés par Gemini. Un 429 arrête toutes les catégories pour la journée, sans nouvelle tentative dans le même run.
- Le suivi est agrégé par catégorie et par jour. Les tokens sont ceux déclarés par Gemini, sans estimation si l'API n'en renvoie pas.
- Les nouvelles fiches restent en attente de modération. Aucun contenu Gemini n'est publié automatiquement.
- Les deux anciens endpoints de scraping Google Sheets ne peuvent plus appeler Gemini sauf si `LEGACY_SHEETS_SCRAPING_ENABLED=true` est explicitement configuré. Ne pas activer cette variable en production : ces appels contourneraient le budget.

## Inventaire des flux historiques, à migrer séparément

- `/api/auto/scrape` et `/api/auto/scrape-events` : ancienne découverte Gemini vers Sheets, neutralisée par défaut. L'interface `/admin/auto` ne les lance plus.
- `/api/cron/scrape-events` et `/api/cron/scrape-cagnottes` : placeholders non planifiés dans `vercel.json`, non utilisés par le nouveau pipeline.
- `/api/admin/soumissions` : lecture des fiches Neon prioritaire, avec lecture facultative des soumissions Sheets. Une panne Sheets ne masque plus Neon. L'écriture des anciennes soumissions reste dans Sheets.
- `/api/admin/soumettre`, `/api/admin/valider`, `/api/ajout-rapide` : soumissions et validation historiques via Apps Script ou Make, à migrer avec tests de parité avant coupure.
- `/api/evenements`, `/api/cagnottes`, `/api/mosques` et certaines fonctions de `src/lib/sheets.ts` : lectures Sheets historiques, à comparer aux pages réelles avant retrait.
- `/api/contact`, `/api/auth/change-password`, `/api/auth/reset-password`, `/api/admin/comptes`, `/api/chat-interne` : usages de Make ou Apps Script hors scraping. Ne pas les désactiver au titre de l'étape 2 sans parcours de remplacement.

La migration complète des anciens flux et la collecte exhaustive de leurs erreurs restent un chantier ouvert.
