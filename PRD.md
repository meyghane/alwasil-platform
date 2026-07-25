# PRD — Al-Wasil (الواصل)

> Document vivant. Mis à jour à chaque changement de cap majeur. Dernière révision : 24 juillet 2026.

## 1. Vision

Centraliser toutes les ressources utiles à la communauté musulmane de France (Île-de-France en priorité, extension nationale progressive) : événements, solidarité, emploi, éducation, hajj/omra, santé, librairies, piscines, justice/droits.

**Principe directeur validé par Méghane :** le site doit se remplir **automatiquement** (scraping quotidien + enrichissement IA), Méghane n'intervient que pour **valider/refuser** par email digest. Aucune saisie manuelle de contenu au quotidien.

## 2. Audience

- Primaire : communauté musulmane francophone, France, mobile-first.
- Secondaire (revenu) : annonceurs halal/muslim-friendly, Google AdSense.

## 3. État actuel vs cible (résumé audit du 24/07/2026)

| Dimension | Actuel | Cible |
|---|---|---|
| Stockage | `src/data/*.ts` statique + Google Sheets non branché | Neon Postgres, source unique de vérité |
| Couverture géo | 100% Île-de-France | IDF consolidée puis extension région par région |
| Scraping | GitHub Actions 3x/jour, sources HelloAsso+LaunchGood scrapées sans API officielle | Sources officielles (API HelloAsso, RSS) uniquement |
| Fraîcheur | Événements passés non purgés (37/53 obsolètes au 23/07) | Purge automatique quotidienne |
| Monétisation | Rien d'implémenté | AdSense après mise en conformité contenu |

## 4. Décisions produit validées (24/07/2026)

1. **Infra** : 100% gratuit — GitHub Actions (scraping) + Neon Postgres (données), Vercel Hobby conservé.
2. **Sources** : uniquement sources officielles (API HelloAsso, flux RSS). Pas de scraping de sites qui l'interdisent dans leurs CGU (Instagram, LaunchGood en scraping direct).
3. **Géographie** : consolider l'Île-de-France (qualité + volume) avant d'ouvrir une nouvelle région. Une région ne devient visible publiquement que si elle atteint un seuil minimum de contenu réel (voir ARCHITECTURE.md — quality gate).
4. **AdSense** : on prépare le terrain avant de candidater (purge contenu obsolète, contenu éditorial suffisant, pages légales étoffées) plutôt que de soumettre immédiatement.

## 5. Epics (ordre d'exécution proposé)

### Epic A — Fondation données (bloquant, tout en dépend)
En tant qu'admin, je veux que toutes les données du site vivent dans une vraie base de données, afin que le scraping puisse écrire directement sans passer par des fichiers de code ou un Sheet à moitié branché.
- Migration Neon Postgres + schéma unique par catégorie
- Suppression des fichiers morts (`prayer_spaces.ts`, `priere-espaces.ts`)
- Toutes les pages publiques lisent la DB (plus de données codées en dur)
- Retrait de Google Sheets / Apps Script / Make.com du flux de production (conservés en archive si besoin ponctuel)

### Epic B — Scraper conforme + fraîcheur
En tant qu'admin, je veux un scraping qui n'utilise que des sources autorisées et qui purge automatiquement le contenu expiré, afin de ne prendre aucun risque juridique et d'avoir un site toujours à jour.
- Bascule HelloAsso scraping → API officielle HelloAsso
- Recherche RSS/sources ouvertes pour compléter (au lieu de LaunchGood/Instagram scraping direct)
- Écriture directe en base (fin de l'écriture vers Sheets)
- Purge quotidienne réelle des événements passés
- Fréquences différenciées par catégorie (quotidien pour événements/emploi/cagnottes, hebdo pour le reste — à confirmer en Architecture)

### Epic C — Expansion géographique pilotée
En tant qu'admin, je veux que chaque nouvelle région ne s'affiche publiquement que si elle a assez de contenu réel, afin d'éviter le thin content qui pénaliserait le référencement de tout le site.
- Champ région/département structuré sur chaque item
- Seuil de publication par ville/région (quality gate)
- Plan d'expansion (ordre des régions à activer)

### Epic D — AdSense readiness
En tant qu'admin, je veux que le site soit conforme aux exigences AdSense avant de candidater, afin de maximiser les chances d'approbation dès la première soumission.
- Pages légales séparées et étoffées (mentions légales, confidentialité RGPD, CGU)
- `ads.txt` + composant `AdBanner`
- Contenu éditorial (blog) renforcé
- Checklist finale + soumission

### Epic E — Pilotage & documentation
En tant que Méghane, je veux un fichier unique qui m'explique tout ce qui est automatique et ce que j'ai à faire, afin de piloter le projet sans avoir à comprendre le code.
- `MODE_EMPLOI.md` (livré avec ce PRD)
- Dashboard admin de suivi scraping (statut dernier run, erreurs, items en attente de validation)

## 6. Hors périmètre pour l'instant

App mobile, chatbot IA juridique, système de notation/avis, authentification NextAuth — repris après que le socle (Epics A-D) soit stable.

## 7. Métriques de succès

- 0 donnée codée en dur en production (tout vient de la DB)
- 0 événement expiré visible publiquement
- Taux de contenu conforme CGU sources : 100%
- Dossier AdSense soumis avec checklist Epic D complète à 100%
