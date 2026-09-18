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
- `/api/admin/soumettre` et `/api/ajout-rapide` : nouvelles soumissions dans `items` Neon en attente de modération. Make, Apps Script et Telegram ne sont plus appelés par ces deux routes. L'ajout rapide ne prétend plus enrichir automatiquement avec l'ancien modèle Gemini : il crée une fiche brute bloquée à la publication tant qu'un parcours de complétion n'existe pas. `/api/admin/valider` conserve le traitement des anciens liens envoyés par email et reste à migrer.
- `/api/evenements` et `/api/cagnottes` : lisent maintenant les mêmes fiches Neon approuvées que les pages publiques. Leur forme de réponse historique est conservée par des adaptateurs, sans inventer les montants des cagnottes.
- `/api/mosques` fusionne les mosquées approuvées dans Neon avec les anciennes données Sheets, en évitant les doublons évidents par nom et ville. Sheets reste une source historique temporaire ; les anciennes fiches doivent être migrées avant sa suppression.
- `/api/contact` : les demandes Hajj/Omra sont enregistrées dans Neon comme leads et une notification est envoyée par Resend. Les anciens identifiants d'offre non-UUID sont conservés dans les métadonnées sans bloquer la création du lead. Les autres formulaires suivent encore leurs parcours dédiés.
- `/api/auth/change-password`, `/api/auth/reset-password`, `/api/admin/comptes`, `/api/chat-interne` : certains usages historiques de Sheets/Apps Script restent séparés du flux Hajj/Omra.

Telegram reste un canal d'import voulu par Méghane. Son webhook reçoit texte, image ou vocal depuis le chat autorisé, utilise Gemini pour extraire une proposition et enregistre une fiche `pending` dans Neon. Il n'écrit plus dans Sheets et ne publie jamais automatiquement. Le webhook exige un secret Telegram dérivé du token du bot et `TELEGRAM_CHAT_ID` doit être configuré. Après le déploiement, un administrateur doit réinstaller le webhook avec une requête POST authentifiée vers `/api/telegram-setup`, puis tester un message et vérifier son apparition dans `/admin/soumissions`. Un ancien webhook configuré sans secret ne peut pas atteindre le nouveau traitement tant qu'il n'est pas réinstallé. Ne pas envoyer le token du bot dans une conversation ni dans le dépôt.

La migration complète reste ouverte pour les comptes, le chat interne et les fiches historiques encore lues depuis Sheets. Le formulaire Hajj/Omra n'utilise plus Make ni Telegram pour créer le lead : Neon est la source du ticket, et Resend sert à notifier l'équipe. Les anciennes fiches en attente dans Sheets restent visibles dans `/api/admin/soumissions` et peuvent toujours être traitées. Ne pas supprimer Apps Script ou ses secrets avant reprise des parcours encore dépendants.

### Critère de fin ajouté à l'étape 2

L'unification des anciens endpoints Google Sheets, Make et Telegram avec le scraper GitHub signifie : toutes les **nouvelles fiches** doivent aboutir dans `items` Neon en statut `pending`, être visibles dans la modération, puis être approuvées dans un seul parcours. GitHub Actions reste responsable de la découverte programmée ; Telegram et les formulaires humains alimentent le même parcours en temps réel. La migration des soumissions publiques de `/api/contact`, des anciens liens de validation, des fiches historiques et des catégories encore lues dans Sheets doit être testée avant de déclarer l'étape terminée. Les fonctions de comptes et de chat constituent des migrations de données distinctes, non un flux de scraping.

## Suite locale après le commit `6cee418`

Ces changements ont été faits après le commit de publication initial et nécessitent une publication distincte :

- L'Essonne (91) entre dans la rotation des huit départements franciliens. À nombre égal de fiches, l'ordre tourne d'un jour à l'autre. Quand chacun possède au moins trois événements à venir, une recherche s'étend vers un département voisin sous-couvert, sans relever le quota d'appels.
- `/api/evenements` et `/api/cagnottes` lisent les fiches Neon et gardent leur format JSON historique. Les API ne dépendent plus de Sheets pour ces deux catégories.
- Le tableau `/admin/scraping` affiche les consommations face aux limites actuellement configurées dans GitHub Actions.

Avant de publier cette suite, lancer `node --import tsx --test scripts/public-api-adapters.test.ts scripts/scraper/test/gemini.test.ts`, `npm --prefix scripts/scraper run build` et `npm run build`.
