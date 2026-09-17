# Roadmap Al-Wasil — produit, automatisation et design

## Vision

Al-Wasil devient un média-annuaire communautaire fiable : les données sont découvertes et actualisées automatiquement, tandis que l’équipe intervient seulement pour les cas sensibles, les signalements et les décisions éditoriales.

## Priorité immédiate — fiabilité des données

- [x] Ajouter un moteur de fraîcheur et une expiration des événements passés.
- [x] Ajouter une vue admin Fraîcheur.
- [x] Ajouter une vue admin Couverture géographique.
- [x] Ajouter des événements vérifiés récents avec sources.
- [ ] Ajouter `last_verified_at`, `next_review_at` à toutes les fiches déjà migrées.
- [ ] Ajouter dédoublonnage par URL, téléphone, email et similarité du titre.
- [ ] Ajouter contrôle automatique des liens et numéros invalides.
- [ ] Ajouter un journal des erreurs d’automatisation.

## Phase 1 — automatisation par catégorie

| Catégorie | Fréquence | Traitement | Validation |
|---|---:|---|---|
| Événements | quotidienne | découverte, dates, liens, images, dédoublonnage | automatique puis signalement |
| Cagnottes | quotidienne | lien, statut, montant, clôture | manuelle si doute |
| Instituts/cours | hebdomadaire | programmes, inscriptions, villes, formats | automatique + contrôle périodique |
| Psychologues/hijama/roqya | hebdomadaire | coordonnées, disponibilité, département | toujours contrôlée |
| Associations | hebdomadaire | activité, contact, site, zone d’action | contrôle si nouvelle fiche |
| Mosquées | hebdomadaire | adresse, site, horaires, département | validation locale |
| Librairies/piscines | mensuelle | horaires, adresse, fermeture, tarifs | automatique + signalement |

Ordre géographique : Paris, 93, 94, 92, 95, 91, 78, 77, puis grandes métropoles françaises.

## Phase 2 — contrôle qualité léger

- Page « nouvelles fiches ou douteuses ».
- Actions : valider, corriger, archiver, demander une nouvelle vérification.
- Vue couverture par département et catégorie.
- Vue des erreurs de collecte.
- Badge public « vérifié le… ».
- Système de signalement visiteur.

## Phase 3 — Hajj/Omra et leads

- Formulaire lié à l’offre avec `offer_id`, `partner_id`, `lead_id`.
- Qualification et consentement.
- Pipeline CRM.
- Attribution et acceptation par partenaire.
- Espace agence sécurisé.
- Notifications et relances.
- Commissions et suivi anti-contournement.

## Phase 4 — refonte design

Direction : interface éditoriale claire, lumineuse et épurée, inspirée de la référence fournie.

- Accueil : vert émeraude dominant.
- Éducation : turquoise/vert doux.
- Praticiens : rose poudré/corail.
- Événements : jaune doré.
- Hajj/Omra : violet profond + or.
- Solidarité : orange/rouge chaleureux.
- Emploi : bleu.
- Mosquées : vert profond.
- Admin : crème, noir, or.

Règle : une couleur dominante par page, avec l’arc-en-ciel réservé aux détails de marque, transitions et éléments de rassemblement.

Structure type : hero clair, bloc texte/image, sections alternées, cartes aérées, bandeau coloré, CTA principal, footer simple.

## Phase 5 — SEO + GEO

- Corriger les URLs canoniques vers `al-wasil.fr`.
- Créer les métadonnées propres à chaque page.
- Ajouter données structurées Event, Organization, LocalBusiness et FAQ.
- Créer les pages locales par ville/département.
- Ajouter les dates de vérification et sources.
- Optimiser `llms.txt` et les contenus citables par les moteurs génératifs.
- Créer des FAQ conversationnelles.
- Mesurer les événements analytics sans envoyer de données personnelles.

## Phase 6 — sécurité et exploitation

- Régénérer les secrets exposés.
- Supprimer les reliquats Telegram/Make inutilisés.
- Rate limiting et honeypot sur les formulaires.
- Sauvegarde et procédure de restauration.
- Environnement de test Neon séparé.
- Déploiement uniquement après build, test des routes et validation humaine.

## Règle de pilotage

Chaque automatisation doit produire un résultat vérifiable, une source, une date de collecte et un état. Une fiche sans source ou sans date ne doit jamais devenir automatiquement visible comme fiable.
# Feuille de route qualité transverse

## Checklist systématique pour chaque interface web

- Sécurité : secrets côté serveur, HTTPS, en-têtes, validation serveur et anti-spam.
- Conformité : politique de confidentialité, CGU, consentement cookies et gestion des choix.
- SEO/GEO : title, description, canonical, Open Graph, Twitter, sitemap, robots.txt, données structurées et contenus citables.
- UX : 404 utile, liens vérifiés, CTA principal unique, contrastes, clavier, textes alternatifs et états d’erreur.
- Performance : images optimisées, chargement mobile, scripts tiers différés et mesure Lighthouse.
- Exploitation : analytics respectueux, suivi des erreurs et vérification en preview avant publication.

## Projet Shopify Meyghane — à reprendre

À traiter dès la reprise du projet : appliquer cette checklist au thème, vérifier les pixels et apps après consentement, sécuriser les clés, contrôler le checkout, les images, les métadonnées, les liens, la vitesse mobile et les pages légales.
