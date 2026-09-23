# Al-Wasil — Brief Codex (mis à jour juillet 2026)

## Politique actuelle du 22 septembre 2026

Lire `docs/AGENT_ARCHITECTURE.md`. La demande actuelle autorise une publication automatique contrôlée pour les catégories ordinaires explicitement permises et les sources officielles approuvées. Les imports Telegram/manuels restent pending ; Hajj/Omra et catégories sensibles exigent une validation. Neon est la source principale et Telegram sert à la modération. Ces règles remplacent les passages historiques contradictoires ci-dessous.

## Direction artistique actuelle — priorité sur les anciennes palettes ci-dessous
Lire `DIRECTION_ARTISTIQUE.md` avant toute intervention visuelle. DA validée le 16 septembre 2026 : blanc, citron #ECFF58, noir #080808, violet #7652CA ; boutons pilules ; photos lumineuses ; mosaïque de carrés arrondis/ovales. Header blanc commun et logo compact. Les anciennes descriptions noir/or, corail et palettes multicolores ci-dessous sont historiques.

Plateforme communautaire musulmane française. Site Next.js déployé sur Vercel via GitHub.
Repo GitHub : https://github.com/meyghane/alwasil-platform
Prod : https://al-wasil.fr
Local : /Users/meyghane/PROJECTS_2026/ALWASIL_SITE

IMPORTANT : Ne jamais écrire de clés API, mots de passe ou tokens dans ce fichier.
Les credentials sont dans .env.local (local) et dans les secrets Vercel/GitHub.

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
- Apps Script : voir variable d'env APPS_SCRIPT_WEBHOOK_URL dans .env.local
- Apps Script accepte : POST {sheetTab, row} pour écrire / GET ?action=listTab&tab=xxx pour lire
- Flux : Scraper → Sheet PRIVÉ → admin valide → Apps Script → Sheet PUBLIC → revalidation site

---

## Système scraping — GitHub Actions (juillet 2026)

### Architecture
```
GitHub Actions (serveurs GitHub, indépendant du Mac)
  Cron : 3x/jour (8h, 14h, 20h Paris) + retry automatique 3 tentatives
  → scripts/scraper/src/index.ts (Crawlee + TypeScript CommonJS)
  → scrapers/helloasso.ts (cagnottes + events HelloAsso)
  → scrapers/launchgood.ts (cagnottes islamiques LaunchGood)
  → utils/gemini.ts (7 stratégies Gemini Search API pour les events)
  → utils/sheets.ts (écriture Apps Script webhook)
  → utils/email.ts (digest HTML Resend avec boutons Valider/Refuser)
  → src/app/api/moderate/route.ts (HMAC, approve → revalidation site)
```

### Secret GitHub
Un seul secret SCRAPING_ALWASIL_ALL sur GitHub (JSON avec toutes les clés).
Les clés individuelles sont aussi ajoutées séparément sur GitHub.

### Catégories manuelles (email digest quotidien)
evenement, cagnotte, solidarite, education → validation par email

### Catégories auto-validées
emploi, piscine, hajj → publiés directement

---

## BUG EN COURS — GitHub Actions exit code 1

### Symptôme
Le workflow .github/workflows/scrape-daily.yml fail sur les 3 tentatives.

### Déjà corrigé
- package-lock.json créé dans scripts/scraper/
- Node 20 → 22 dans le workflow
- TypeScript ESM → CommonJS
- Imports .js supprimés
- node_modules supprimé du repo + .gitignore mis à jour
- AGENTS.md nettoyé (clés API supprimées)

### Pour débugger
1. GitHub → Actions → dernier run → "Scraping & Email Digest" → logs complets
2. Chercher la vraie erreur (pas juste "exit code 1")
3. Causes possibles :
   - fromJSON(secrets.SCRAPING_ALWASIL_ALL) échoue si le JSON est malformé
   - Crawlee incompatible avec GitHub Actions
   - Erreur de compilation TypeScript
4. Test rapide : commenter helloasso + launchgood dans index.ts, tester juste Gemini + email

### Debug local
```bash
cd /Users/meyghane/PROJECTS_2026/ALWASIL_SITE/scripts/scraper
npm install && npx tsc
# puis lancer avec les vars d'env du .env.local
```

---

## Décisions définitives

- PAS de page /halal restaurants (trop controversé)
- CSS inline uniquement — jamais Tailwind
- Données : Google Sheets (pas Supabase pour l'instant)
- Telegram supprimé — remplacé par email Resend
- Make.com scraping supprimé — remplacé par GitHub Actions

---

## Priorités à faire (ordre)

1. URGENT — Régénérer toutes les clés API exposées (voir section sécurité)
2. URGENT — Débugger GitHub Actions (exit code 1)
3. Bannières publicitaires AdSense
4. Audit site (Lighthouse, SEO, mobile)
5. Plus de sources scraping
6. Newsletter

---

## SÉCURITÉ — Clés exposées à régénérer

Suite à un commit accidentel dans AGENTS.md, ces clés ont été exposées sur GitHub public.
Toutes doivent être régénérées AVANT la prochaine session :

- RESEND_API_KEY : déjà révoquée par Resend → en créer une nouvelle sur resend.com/api-keys
- GEMINI_API_KEY : à régénérer sur aistudio.google.com
- APPS_SCRIPT_WEBHOOK_URL : republier le script Apps Script pour obtenir une nouvelle URL
- MODERATE_SECRET : changer le mot de passe (variable Vercel + secret GitHub)
- Mot de passe admin /admin : le changer dans le code (src/lib/user-auth.ts)

Après régénération : mettre à jour .env.local + Vercel env vars + secret GitHub SCRAPING_ALWASIL_ALL

---

## Homepage — changements juillet 2026

- Badge hero : "Qu'est-ce que je cherche aujourd'hui ?"
- Section "Les plus recherchés" : 2 grandes cartes Événements + Solidarité
- SECTIONS reordonnées : Events 1er, Solidarity 2e, Emploi 3e, Education 4e, Hajj 5e
- Navigation : liens directs Événements + Solidarité en haut de nav
- Responsive : classes CSS dans globals.css (sections-grid, steps-grid, featured-duo)
- 25 événements ajoutés dans src/data/events.ts (juil-sept 2026)

---

## Règles de travail importantes

- Ne jamais mettre de clés API dans AGENTS.md ou dans le code commité
- Ne jamais committer node_modules (vérifier .gitignore avant git add .)
- Toujours builder localement avant de push : npm run build
- Pour déployer : git push origin main (Vercel auto-deploy)
- Pour forcer déploiement CLI : npx vercel deploy --prod --yes (depuis le dossier projet)

## Imported Claude Cowork project instructions

Stack technique :                                         
  - Next.js App Router, React 19, TypeScript                                                             
  - CSS inline uniquement (pas de Tailwind)                                                              
  - Déployé sur Vercel via GitHub (repo : meyghane/alwasil-platform)
                                                                                                         
  Design :                                                                                               
  - Style Konbini / néobrutalist
  - Palette : violet #5e17eb, orange #fb4102, bleu #1540ff, vert #00bf63, jaune #F6C840, lavande #EDD0FF,
   ardoise #D0DDEF                                                                                       
  - Font titres : Poppins 900, font body : Glacial Indifference                                          
  - Bordures noires 2px solid #0a0a0a, ombres offset 4px 4px 0 #0a0a0a
                                                                                                         
  Pages existantes :                                                                                     
  / /education /events /solidarity /jobs /sante /justice /librairies /piscines /hajj /contact /connexion 
  /blog                                                                                                  
                                                            
  Données :                                                                                              
  - Actuellement dans src/data/*.ts (statique)              
  - Google Sheet PUBLIC : 1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU                                   
  - Google Sheet PRIVÉ : 1Lrx55hXR_fgAViZOT6B1fb72QXrVu7TgFxwZCkDwJeI 
  - Objectif : synchroniser Sheet → site automatiquement (3x/jour via cron)                              
                                                                                                         
  Décisions importantes :                                                                                
  - Pas de page /halal-restaurants                                                                       
  - /connexion = liste d'attente email uniquement (pas de vrai login)                                    
  - App mobile (Expo) uniquement après validation complète du site   
  - Budget quasi zéro (Vercel Hobby gratuit)                                                             
                                                                                                         
  Emails : Resend API → al-wasil@hotmail.com                                                             
  Apps Script projet : AlWasil_Routing (routing formulaire
