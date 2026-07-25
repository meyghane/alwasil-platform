# ARCHITECTURE — Al-Wasil (الواصل)

> Document technique. Justifie chaque décision. Dernière révision : 24 juillet 2026.

## 1. Stack définitive

| Couche | Choix | Justification |
|---|---|---|
| Hébergement | Vercel Hobby (inchangé) | Budget 0€, décision validée |
| Frontend | Next.js 16.2 App Router, React 19, TS strict, CSS inline | Inchangé, déjà en place |
| Base de données | **Neon Postgres** (Vercel Marketplace integration) | Free tier réel, scale-to-zero, branching, intégration native Vercel — recommandé 2026 pour ce cas d'usage |
| ORM | **Drizzle ORM** | Léger, compatible edge/serverless, migrations SQL lisibles, bonne intégration driver Neon serverless (`@neondatabase/serverless`) |
| Scraping | GitHub Actions (existant, conservé) | Gratuit, granularité suffisante, déjà en place et partiellement debuggé |
| Sources scraping | API HelloAsso (officielle) + flux RSS | Décision validée : zéro scraping de sources qui l'interdisent en CGU |
| Enrichissement | Gemini API (existant) | Nettoyage titre/description/tags/département, détection spam |
| Modération | Email digest Resend (existant, Valider/Refuser) | Conservé tel quel — Méghane clique, rien d'autre |
| Publicité | Google AdSense (après Epic D) | — |

## 2. Ce qui disparaît

- **Google Sheets comme stockage** (`src/lib/sheets.ts`, onglets `soumissions_*`) → migré vers Postgres. Le Sheet peut rester en lecture archive mais n'est plus la source de vérité.
- **Apps Script (`SoumissionsRouter.gs`)** → remplacé par des routes API Next.js qui écrivent directement en Postgres.
- **Make.com scénario "Al-Wasil Soumissions"** → remplacé par l'écriture directe scraper → Postgres.
- **Bot Telegram** → déjà retiré (confirmé en juillet 2026).
- **`src/data/prayer_spaces.ts` et `priere-espaces.ts`** → fichiers morts, supprimés (doublon, aucun import).
- **Routes API mortes** `/api/evenements`, `/api/mosques`, `/api/cagnottes` → soit supprimées, soit reconnectées si utiles au nouveau schéma (à trancher en Epic A).

## 3. Schéma de données (Neon Postgres, via Drizzle)

Une table par catégorie serait redondante — schéma unifié avec table `items` + colonne `category` (enum), plus tables de support :

```
items
  id            uuid pk
  category      enum (event, job, solidarity, institute, health, library, pool, hajj)
  status        enum (pending, approved, rejected, expired)
  title         text
  description   text
  city          text
  department    text (code 2 chiffres)
  region        text        -- Epic C : pilotage expansion géographique
  date_start    timestamptz nullable  -- events
  date_end      timestamptz nullable
  source        text        -- 'helloasso_api' | 'rss:xxx' | 'manual'
  source_url    text
  tags          text[]
  is_spam       boolean default false
  created_at    timestamptz default now()
  updated_at    timestamptz default now()

regions
  code          text pk    -- 'idf', 'aura', 'paca', ...
  name          text
  is_active     boolean default false   -- quality gate Epic C
  min_items_threshold int default 15

moderation_log
  id            uuid pk
  item_id       uuid fk → items
  action        enum (approved, rejected)
  actor         text        -- email admin
  acted_at      timestamptz default now()
```

**Quality gate région (Epic C)** : une région n'est requêtée/affichée publiquement que si `regions.is_active = true`. Un job quotidien vérifie si `count(items where region=X and status=approved) >= min_items_threshold` et active automatiquement la région le cas échéant (avec notification à Méghane).

## 4. Flux de données cible

```
GitHub Actions (cron quotidien, horaires différenciés par catégorie)
  → Scraper (API HelloAsso + RSS)
  → Gemini (nettoyage + tags + département + détection spam)
  → INSERT Postgres (status='pending')
  → Email digest Resend (récap du jour, boutons Valider/Refuser par item)
  → Méghane clique
  → /api/moderate (HMAC sécurisé, existant) → UPDATE Postgres (status='approved'|'rejected')
  → revalidateTag Next.js → page publique à jour
```

Catégories **auto-validées** (déjà décidé en juillet 2026, inchangé) : emploi, piscine, hajj — pas d'email, publication directe si `is_spam=false`.
Catégories **modération manuelle** : événement, cagnotte, solidarité, éducation.

## 5. Fréquence de scraping par catégorie (GitHub Actions cron)

| Catégorie | Fréquence | Justification |
|---|---|---|
| Événements | Quotidien | Forte fraîcheur requise, dates qui expirent vite |
| Emploi | Quotidien | Offres pourvues rapidement |
| Cagnottes/solidarité | Quotidien | Urgences (Gaza, familles) |
| Éducation, santé, librairies, piscines, hajj | Hebdomadaire | Faible churn, pas besoin de fraîcheur quotidienne |
| Purge (expiration) | Quotidien, 3h du matin | Existant, à reconnecter sur Postgres |

## 6. Expansion géographique (Epic C)

Ordre proposé (à valider avec Méghane en Sprint Epic C) : IDF → Hauts-de-France/Lyon/Marseille (grandes métropoles à forte communauté musulmane) → reste du territoire. Chaque région : scraping activé en amont mais `is_active=false` (données en base, invisibles publiquement) jusqu'au seuil atteint. Évite le thin content pénalisant pour le SEO.

## 7. AdSense readiness (Epic D)

- Éclater `/legal` (page unique à ancres) en 3 routes indexables séparées : `/mentions-legales`, `/confidentialite`, `/cgu`
- `public/ads.txt` avec l'ID éditeur AdSense une fois le compte créé
- Composant `AdBanner.tsx` (spec déjà en mémoire projet, `ad-container:empty { display:none }` pour éviter les blocs vides)
- Ne candidater qu'une fois : 0 événement expiré visible + volume éditorial blog renforcé + pages légales étoffées

## 8. Ce qui ne change PAS

- Design système (noir #0a0806 + or #c9973a), CSS inline, pas de Tailwind
- GTM (GTM-PD96NMKQ)
- Structure des pages publiques existantes
- Emails Resend, domaine al-wasil.fr

## 9. Risques identifiés

- **Migration Neon** : nécessite de réécrire toutes les pages qui lisent `src/data/*.ts` — gros chantier mais mécanique, faisable page par page (Epic A, sprint dédié).
- **API HelloAsso** : à vérifier si accès gratuit/rate limits suffisants pour un usage quotidien national à terme.
- **Deux sources de vérité pendant la migration** : pendant la transition, garder les fichiers `src/data/*.ts` en fallback (comme `/piscines` le fait déjà) le temps que Postgres soit peuplé et validé, puis les supprimer.
