# MODE D'EMPLOI — Al-Wasil

> Ce fichier est pour TOI, Méghane. Pas de jargon technique inutile. À lire en premier si tu reviens sur le projet après une pause. Mis à jour à chaque grosse évolution.

## En une phrase

Le site se remplit tout seul chaque jour (scraping automatique). Tu reçois un email récap, tu cliques Valider ou Refuser sur chaque nouvelle fiche. C'est tout ce que tu as à faire au quotidien.

## Ce qui est 100% automatique

- **Chaque jour à 8h**, un agent Claude programmé (une "routine" cloud) cherche sur le web de nouveaux événements islamiques à venir en France, structure les infos, et les envoie au site.
- Chaque run écrit une ligne dans une table de log (`scrape_runs`) avec le nombre de tokens consommés, pour que tu puisses suivre la conso dans le temps et me demander de réduire la fréquence ou le nombre de recherches si besoin.
- Les événements passés sont supprimés automatiquement chaque nuit.

**Pourquoi une routine Claude et pas Gemini (Google) ?** On a testé Gemini d'abord, mais Google bloque tout accès gratuit à son API tant qu'aucune carte bancaire n'est liée au projet, et même avec une carte il n'existe aucun plafond de dépense garanti (juste des alertes email, pas un vrai blocage). On a préféré rester sur ton abonnement Claude Pro que tu maîtrises déjà, où le pire cas est "le service s'arrête", jamais une facture surprise.

## Ce que TOI tu dois faire

- **Recevoir l'email digest quotidien** (à `al-wasil@hotmail.com`) et cliquer Valider/Refuser pour : événements, cagnottes, solidarité, éducation.
- Rien d'autre. Pas de saisie manuelle. Si tu vois un manque flagrant dans une catégorie, dis-le en session plutôt que d'éditer le code toi-même.

## Où voir si tout tourne bien

- **Statut de la routine quotidienne** : claude.ai/code/routines → "Al-Wasil — Découverte quotidienne d'événements" → historique des runs.
- **Dashboard admin** : al-wasil.fr/admin (login : al-wasil@hotmail.com / salamaleykoum).
- **Le site en direct** : al-wasil.fr

## Les 3 fichiers de pilotage du projet

- `PRD.md` — ce qu'on construit et pourquoi (le "quoi")
- `ARCHITECTURE.md` — comment c'est construit techniquement (le "comment")
- `MODE_EMPLOI.md` (ce fichier) — comment toi tu l'utilises au quotidien

Si tu reviens après plusieurs semaines : demande-moi de relire ces 3 fichiers avant de repartir sur du nouveau.

## Où sont les mots de passe / clés

Rien à retenir — tout est dans ma mémoire persistante (fichiers `project_alwasil_tech.md` etc.), je les retrouve automatiquement à chaque session. Si une clé doit être régénérée (Gemini, Resend...), donne-la moi et je synchronise partout (GitHub, Vercel).

## Soumettre le site à Google AdSense — étapes (à faire seulement quand Epic D sera terminé)

1. Vérifier la checklist Epic D dans `PRD.md` (100% coché)
2. Aller sur adsense.google.com → Ajouter un site → al-wasil.fr
3. Coller le code fourni par Google dans `public/ads.txt` (je le fais pour toi)
4. Attendre la review Google (3-14 jours en général)
5. Si refusé : Google donne une raison précise → je corrige → on attend 2-4 semaines avant de resoumettre (ne jamais resoumettre trop vite, ça peut jouer contre nous)
6. Une fois approuvé : les emplacements de pub (`AdBanner`) s'activent automatiquement, rien à faire de plus

**Important sur les revenus** : le CPM (ce que rapporte 1000 vues de pub) dépend du pays des VISITEURS, pas du site. Un site en français avec une audience française aura un CPM plus bas qu'un site avec une audience américaine — c'est normal, pas un problème à résoudre. Une fois AdSense approuvé, on pourra regarder des réseaux complémentaires (Ezoic, Newor Media) qui augmentent les revenus de 20 à 70% par rapport à AdSense seul.

## Glossaire rapide

- **Scraping** : le robot qui va chercher l'info automatiquement sur d'autres sites
- **Cron** : une tâche programmée qui se lance toute seule à une heure fixe
- **DB / base de données** : là où toutes les fiches (événements, emplois...) sont stockées — avant c'était mal branché, c'est en train d'être corrigé (voir ARCHITECTURE.md)
- **AdSense** : le système Google qui affiche des pubs sur ton site et te paie en échange
- **CPM** : ce que rapportent 1000 affichages de pub
- **pSEO** : générer plein de pages automatiquement (ex: une page par ville) pour être trouvé sur Google
- **Thin content** : trop de pages vides ou quasi-identiques → Google pénalise tout le site pour ça, d'où l'importance de n'ouvrir une ville/région que quand elle a du vrai contenu

## Où on en est (26 juillet 2026)

Epic A (base de données Neon Postgres) et Epic B (découverte automatique d'événements) terminés. La routine Claude quotidienne est créée et testée. Prochaines étapes possibles : Epic C (expansion géographique hors IDF), Epic D (préparation AdSense), ou contacter HelloAsso pour un accès partenaire API si tu veux élargir les sources.
