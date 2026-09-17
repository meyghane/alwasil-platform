# Audit local Al-Wasil — Hajj & Omra / Marketplace Lead Engine

Date : 15 septembre 2026  
Périmètre : dépôt local `/Users/meyghane/PROJECTS_2026/ALWASIL_SITE`  
Production : aucun déploiement effectué.

## État de fonctionnement

- Projet identifié : Next.js 16.2, React 19, TypeScript strict.
- Serveur local lancé : `http://127.0.0.1:3000`.
- `npm run build` : compilation et TypeScript OK, mais prerender bloqué sur `/hajj` par l’accès réseau à Neon indisponible dans l’environnement d’audit.
- Avertissement : convention `middleware` dépréciée dans Next.js 16, migration future vers `proxy` à planifier.
- Modifications préexistantes conservées : `src/app/page.tsx`, `src/components/home/RubriqueCard.tsx`, `src/components/home/TestimonialCard.tsx`, `src/lib/tokens.ts`, et `AGENTS.md` non suivi.

## Cartographie

Routes publiques principales : `/`, `/education`, `/events`, `/solidarity`, `/jobs`, `/sante`, `/justice`, `/librairies`, `/piscines`, `/hajj`, `/annonceurs`, `/contact`, `/connexion`, `/legal`, `/blog`, `/guide`.

Routes métier/admin : `/admin`, `/admin/soumissions`, `/admin/comptes`, `/admin/historique`, `/admin/auto`, `/modo/*`.

API : authentification, administration/modération, contact, événements, cagnottes, mosquées, scraping, revalidation, chat interne et nettoyage automatique.

Données : schéma Drizzle/Neon (`items`, `regions`, `moderation_log`, `scrape_runs`) ; les objets métiers historiques sont conservés dans `items.metadata.raw`. Le code contient encore des reliquats Apps Script/Make/Telegram et des variables d’environnement correspondantes.

## Audit UX/UI

Points positifs : parcours Hajj lisible, filtres par type/budget/ville/étoiles, distinction offres/agences/guide, responsive prévu dans les styles globaux, identité visuelle cohérente.

Points à corriger :

1. Chaque offre affiche le même CTA générique `/contact?type=hajj-devis`; l’offre sélectionnée et l’agence ne sont pas transmises.
2. La demande de devis est un formulaire générique ; aucune qualification métier complète (dates, flexibilité, hôtel, chambre, visa, accompagnement, consentement de suivi).
3. L’utilisateur n’a pas de confirmation avec référence de dossier ni espace de suivi.
4. Les agences sont affichées comme des fiches éditoriales, sans statut partenaire, capacité, SLA, historique d’acceptation ou espace sécurisé.
5. Le guide contient des affirmations réglementaires sensibles qui devront être revues, datées et sourcées avant une mise en avant SEO.
6. Les cartes utilisent encore des éléments visuels/emoji dans certaines données, alors que les règles du projet imposent Lucide uniquement.
7. Les états vides, erreurs de chargement et indisponibilité de la base ne sont pas traités de manière suffisamment explicite côté utilisateur.

## Audit architecture et données

Le schéma actuel convient à la publication/modération de contenus, mais pas au marketplace. Il manque des entités et relations dédiées : `partners`, `offers`, `leads`, `lead_assignments`, `lead_events`, `customer_profiles`, `commissions`, `partner_users` et une journalisation d’audit.

Le stockage de données métier dans `metadata` est pratique pour la migration, mais fragile pour filtrer, indexer, valider et historiser les offres et leads. Il faut conserver le fallback éditorial durant la transition, puis basculer progressivement les offres Hajj/Omra vers des tables typées.

Le endpoint `/api/contact` envoie actuellement les données vers Resend et, si configuré, Make et Telegram. Il ne valide pas précisément le schéma, ne crée pas de lead en base, ne déduplique pas et ne garantit pas une attribution traçable. Les appels externes sont lancés sans attendre leur résultat.

## Audit admin / CRM / automatisations

L’admin actuel est conçu pour valider des soumissions et gérer des comptes/modérateurs. Il n’existe pas encore de pipeline lead, de vue kanban, de règles d’attribution, d’acceptation par agence, de relances, de journal des changements ou de calcul de commission.

Les automatisations existantes concernent surtout scraping, nettoyage, modération et revalidation. Elles ne couvrent pas le cycle commercial : création → qualification → attribution → acceptation → devis → réservation → commission.

## Audit SEO / tracking

Le site possède metadata globales, sitemap, robots et GTM. À améliorer : base URL canonique actuellement orientée vers `alwasil-platform.vercel.app` alors que le domaine public documenté est `al-wasil.fr`, metadata propres à `/hajj`, pages d’offres indexables si elles deviennent publiques, données structurées `Product/Offer/Organization`, suivi des événements CTA/formulaire et conservation UTM/referrer.

Le tracking doit rester sans données personnelles dans les analytics : utiliser un identifiant de lead interne, des événements comme `hajj_offer_view`, `hajj_quote_start`, `hajj_quote_submit`, `lead_assigned`, `partner_accepted`, et séparer les données CRM des outils marketing.

## Chantier mémorisé — ordre recommandé

### Phase 0 — sécurité et fondations

- Vérifier/régénérer les secrets signalés dans `AGENTS.md` avant tout nouveau branchement.
- Retirer ou désactiver les chemins historiques Make/Telegram si non utilisés.
- Ajouter validation serveur, rate limiting, honeypot/anti-spam et politique de conservation des leads.
- Créer migrations Drizzle dédiées, sans supprimer le fallback existant.

### Phase 1 — modèle marketplace

- `partners` : identité, agrément vérifié, coordonnées, statut, SLA, commission par défaut.
- `offers` : `offer_id`, `partner_id`, type Hajj/Omra, prix, période, départs, capacité, contenu, statut et dates de validité.
- `leads` : `lead_id`, coordonnées, qualification, consentement, source, UTM, statut pipeline et timestamps.
- `lead_assignments` : lead/offre/partenaire, token de suivi, statut proposé/accepté/refusé/expiré, échéance.
- `lead_events` : journal append-only de chaque changement.
- `commissions` : réservation confirmée, montant forfaitaire ou pourcentage, état dû/payé/contesté.

### Phase 2 — parcours public

- Remplacer le CTA générique par `/hajj/offres/[offerId]/demande` ou un drawer lié à `offer_id`.
- Garder une demande générale possible, mais créer une offre candidate si l’utilisateur vient d’une carte.
- Ajouter qualification progressive : voyage, période, nombre de personnes, départ, budget, niveau hôtel, chambre, besoins particuliers, téléphone/email et consentement.
- Afficher une référence `lead_id` publique non devinable et une confirmation claire.

### Phase 3 — CRM admin

- Tableau pipeline : nouveau, à qualifier, attribué, accepté, devis reçu, relancé, gagné, perdu, expiré.
- Filtres par type, agence, date, budget, source et statut.
- Actions protégées : attribuer, réattribuer, accepter un refus, ajouter une note, changer de statut.
- Historique complet et permissions admin/modo séparées.

### Phase 4 — espace partenaire

- Invitation agence, connexion sécurisée, profil et offres.
- Réception d’un lead sans exposer plus de données que nécessaire avant acceptation.
- Acceptation/refus avec motif, délai de réponse, dépôt du devis et statut de réservation.
- Notifications email et liens signés à durée limitée.

### Phase 5 — commissions et anti-contournement

- Référence de dossier persistante et attribution pendant une durée définie contractuellement.
- Journal des contacts et changements ; aucune donnée de paiement sensible dans Al-Wasil.
- Commission calculée sur une réservation confirmée selon contrat, avec validation manuelle au début.
- Conditions partenaires, consentement et politique de litige avant ouverture à plusieurs agences.

## Décision de mise en œuvre

Ne pas déployer le marketplace en production à ce stade. Le prochain lot sûr est une implémentation locale et isolée du schéma `partners/offers/leads/lead_assignments/lead_events`, puis un formulaire Hajj lié à l’offre et une vue CRM admin en données de test. Toute connexion réelle à des agences, tout envoi de lead réel ou déploiement devra être validé séparément.

## SEO + GEO — étape dédiée ultérieure

Le chantier visibilité couvrira à la fois le SEO classique et le GEO : données structurées fiables, pages locales, réponses directement compréhensibles par les moteurs génératifs, fichiers de découverte (`llms.txt`), entités clairement reliées, sources citées, dates de vérification visibles et contenus FAQ conçus pour les recherches conversationnelles. Cette étape commencera après la mise en place du moteur de fraîcheur et la fiabilisation des fiches.
