Projet
  Plateforme communautaire musulmane française. Site Next.js déployé sur Vercel via GitHub.
  Repo : /Users/meyghane/PROJECTS_2026/ALWASIL_SITE
  Stack : Next.js App Router, React 19, TypeScript. Pas de Tailwind — CSS inline uniquement.

  ## Pages existantes
  /, /education, /events, /solidarity, /jobs, /sante, /justice, /librairies, /piscines, /hajj, /annonceurs,
   /contact, /connexion, /legal

  ## Décisions définitives (ne pas revenir dessus)
  - PAS de page /halal restaurants (trop controversé)
  - OUI aux cours dans les mosquées → intégrer dans /education
  - App mobile (React Native/Expo) UNIQUEMENT après que le site est 100% validé
  - /connexion = liste d'attente email pour laisser des avis, pas de vrai login
  - Données : Google Sheets pour l'instant (pas Supabase)
  - Salle de prière chez des particuliers = killer feature à développer (page /salle-de-priere +
  réservation via app)

  ## Infrastructure Google Sheets
  - Sheet PRIVÉ : 1Lrx55hXR_fgAViZOT6B1fb72QXrVu7TgFxwZCkDwJeI (soumissions, mosquées brutes)
  - Sheet PUBLIC : 1jko6Y8y2URu2Xh3dR2T0Ong3X_7RjVLYBj_q8rkpfx0 (données IMPORTRANGE depuis privé)
  - Apps Script projet : AlWasil_Routing (Code.gs routing formulaires, Import OSM.gs, Sync Public.gs)
  - 1040 mosquées importées depuis OSM (France + DOM-TOM)
  - Email réception formulaires : al-wasil@hotmail.com

  ## Emails
  - Resend API branché sur /api/contact → route.ts
  - RESEND_API_KEY dans .env.local (ne jamais committer)
  - From : onboarding@resend.dev (à changer quand domaine alwasil.fr acheté)

  ## Règles de travail
  - Ne jamais modifier une info (horaires, prix) sans source vérifiable
  - CSS inline uniquement, pas de classes Tailwind
  - Toujours utiliser Link de next/link (pas <button>) pour la navigation
  - Données mockées dans src/data/*.ts (à terme → Supabase)
  - Backlog complet dans la mémoire projet Claude (project_alwasil_backlog.md)

  ## Budget actuel
  Quasi 0 — tout sur Vercel Hobby gratuit + GitHub gratuit
  Domaine cible : alwasil.fr (OVH ~7€) dès que budget dispo

  ## Priorités backlog
  1. Pages individuelles /sante/[id], /piscines/[id], /librairies/[id]
  2. Enrichir /justice (avocats discrimination religieuse)
  3. Page /ecoles, /mariage, /funeraire
  4. OG image (logo placeholder pour l'instant, refaire avec la vraie DA)
  5. DA et design global à refaire avant le lancement
  6. Régie pub légère (pixel tracking + CSV export)