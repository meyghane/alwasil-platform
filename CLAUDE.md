# Al-Wasil — Brief Claude Code (mis à jour juillet 2026)

Plateforme communautaire musulmane française. Site Next.js déployé sur Vercel via GitHub.
Repo GitHub : https://github.com/meyghane/alwasil-platform
Prod : https://al-wasil.fr
Local : /Users/meyghane/PROJECTS_2026/ALWASIL_SITE

---

## Stack & règles de base

- Next.js 16.2 App Router, React 19, TypeScript strict
- CSS inline uniquement — JAMAIS de classes Tailwind
- Lucide icons uniquement — jamais d'emojis
- Toujours `Link` de next/link pour la navigation
- Données mockées dans src/data/*.ts (Google Sheets à terme)
- Deploy : git push origin main → Vercel auto-deploy

---

## Pages existantes

/, /education, /events, /solidarity, /jobs, /sante, /justice, /librairies, /piscines, /hajj,
/annonceurs, /contact, /connexion, /legal, /blog, /guide, /modo, /admin

---

## Infrastructure Google Sheets

- Sheet PRIVÉ : 1Lrx55hXR_fgAViZOT6B1fb72QXrVu7TgFxwZCkDwJeI
- Sheet PUBLIC : 1jko6Y8y2URu2Xh3dR2T0Ong3X_7RjVLYBj_q8rkpfx0
- Apps Script URL : https://script.google.com/macros/s/AKfycby03-2Z9lbC9nN08Ttca4JIeP3KVQUfoLD1gEox3dFB5QSun7ffU13Kki-vHj5_jvTNOg/exec
- Apps Script accepte : POST {sheetTab, row} pour écrire / GET ?action=listTab&tab=xxx pour lire
- Flux : Scraper → Sheet PRIVÉ → admin valide → Apps Script → Sheet PUBLIC → revalidation site

---

## Système scraping — GitHub Actions (juillet 2026)

Remplacement complet de Make.com + Telegram par :

### Architecture
```
GitHub Actions (serveurs GitHub, indépendant du Mac)
  Cron : 3x/jour (8h, 14h, 20h Paris) + retry automatique 3 tentatives
  → scripts/scraper/src/index.ts (Crawlee + TypeScript)
  → scrapers/helloasso.ts (cagnottes + events)
  → scrapers/launchgood.ts (cagnottes islamiques)
  → utils/gemini.ts (7 stratégies Gemini Search API pour les events)
  → utils/sheets.ts (écriture Apps Script webhook)
  → utils/email.ts (digest HTML Resend avec boutons Valider/Refuser)
  → src/app/api/moderate/route.ts (HMAC, approve → revalidation site)
```

### Catégories manuelles (email digest quotidien)
evenement, cagnotte, solidarite, education → Méghane valide/refuse par email

### Catégories auto-validées
emploi, piscine, hajj → publiés directement sans validation

### Secret GitHub
Un seul secret `SCRAPING_ALWASIL_ALL` contenant ce JSON exact :
```json
{"GEMINI_API_KEY":"AIzaSyAhou4JCWwY3sumVbTIlMja_Nkivw7U6Lk","APPS_SCRIPT_WEBHOOK_URL":"https://script.google.com/macros/s/AKfycby03-2Z9lbC9nN08Ttca4JIeP3KVQUfoLD1gEox3dFB5QSun7ffU13Kki-vHj5_jvTNOg/exec","RESEND_API_KEY":"re_6TzchXyj_Fey8Dhepi5quDiy53h8L3cFU","MODERATE_SECRET":"S@lamAleykoum33?","ADMIN_EMAIL":"al-wasil@hotmail.com"}
```
Méghane a aussi ajouté les secrets individuellement — les deux coexistent.

---

## BUG EN COURS — GitHub Actions exit code 1

### Symptôme
Le workflow .github/workflows/scrape-daily.yml fail sur les 3 tentatives avec "Process completed with exit code 1". Le run dure ~3m50s (npm + playwright install OK, le script lui-même crash).

### Déjà corrigé
- package-lock.json créé dans scripts/scraper/
- Node 20 → 22 dans le workflow
- TypeScript ESM → CommonJS (tsconfig module: commonjs)
- Imports .js supprimés des fichiers TypeScript
- node_modules commité par erreur → supprimé + .gitignore mis à jour

### Pour débugger à la prochaine session
1. GitHub → Actions → dernier run → "Scraping & Email Digest" → voir les logs complets step par step
2. Chercher la vraie erreur (pas juste "exit code 1")
3. Causes possibles :
   - fromJSON(secrets.SCRAPING_ALWASIL_ALL) échoue si le JSON est malformé
   - Crawlee incompatible avec l'environnement GitHub Actions
   - Erreur TypeScript à la compilation (tsc)
4. Test rapide : commenter helloasso + launchgood dans index.ts pour tester juste Gemini + email

### Debug local (si besoin)
```bash
cd /Users/meyghane/PROJECTS_2026/ALWASIL_SITE/scripts/scraper
npm install
npx tsc  # doit compiler sans erreur
GEMINI_API_KEY=xxx APPS_URL=xxx RESEND_API_KEY=xxx MODERATE_SECRET=xxx ADMIN_EMAIL=xxx node dist/index.js
```

---

## Credentials (ne jamais committer dans le code)

- GEMINI_API_KEY : AIzaSyAhou4JCWwY3sumVbTIlMja_Nkivw7U6Lk
- APPS_SCRIPT_WEBHOOK_URL : https://script.google.com/macros/s/AKfycby03-2Z9lbC9nN08Ttca4JIeP3KVQUfoLD1gEox3dFB5QSun7ffU13Kki-vHj5_jvTNOg/exec
- RESEND_API_KEY : re_6TzchXyj_Fey8Dhepi5quDiy53h8L3cFU
- MODERATE_SECRET : S@lamAleykoum33? (dans Vercel + GitHub)
- CRON_SECRET : alwasil-cron-2026
- REVALIDATE_SECRET : alwasil-revalidate-2026
- Admin login : al-wasil@hotmail.com / salamaleykoum
- Telegram token (désactivé) : 8627468735:AAHC7-D_IpyZ7732eOpmJWCL3QsCVrhODsA

---

## Décisions définitives

- PAS de page /halal restaurants (trop controversé)
- CSS inline uniquement — jamais Tailwind
- Données : Google Sheets (pas Supabase pour l'instant)
- Telegram supprimé — remplacé par email Resend
- Make.com scraping supprimé — remplacé par GitHub Actions
- Make.com garde uniquement les soumissions formulaires publics (si encore actif)

---

## Priorités à faire (ordre)

### 1. URGENT — Débugger GitHub Actions
Voir logs détaillés sur GitHub Actions et corriger le exit code 1.

### 2. Bannières publicitaires (AdSense)
Composant AdBanner.tsx + emplacements dans les pages + script dans layout.tsx.
Attendre approbation AdSense (soumettre sur adsense.google.com).

### 3. Audit site
- Lighthouse sur toutes les pages
- og:image manquantes
- Mentions légales / CGU / politique confidentialité
- Mobile 375px

### 4. Plus de sources scraping
SaphirNews, RNA (répertoire national associations), sites mosquées, Instagram via Apify.

### 5. Newsletter
Formulaire inscription email sur homepage + envoi hebdo via Resend.

---

## Homepage — ce qui a été changé (juillet 2026)

- Badge hero : "Qu'est-ce que je cherche aujourd'hui ?"
- Section "Les plus recherchés" : 2 grandes cartes Événements + Solidarité
- SECTIONS reordonnées : Events 1er, Solidarity 2e, Emploi 3e, Education 4e, Hajj 5e
- Navigation : liens directs Événements + Solidarité en haut de nav
- Responsive : classes CSS responsive dans globals.css (sections-grid, steps-grid, featured-duo)
- 25 événements ajoutés dans src/data/events.ts (juil-sept 2026)

---

## Règles de travail importantes

- Ne jamais modifier une info (horaires, prix) sans source vérifiable
- Ne jamais committer node_modules (vérifier .gitignore avant git add .)
- Toujours builder localement avant de push : npm run build
- Pour déployer : git add ... && git commit && git push (Vercel auto-deploy)
- Pour forcer déploiement CLI : npx vercel deploy --prod --yes (depuis le dossier projet)
