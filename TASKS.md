# Tasks

## Active

- [ ] **Finaliser le flux Hajj 2027** - remplacer les anciennes données de démonstration par des offres réelles et sourcées, les importer dans Neon en `à vérifier`, puis les envoyer sur Telegram.
  - Vérifier agence, source officielle, dates, prix, Atout France, APST et autorisation Hajj saoudienne.
  - Ne jamais publier une offre sans source et date de dernière vérification.
  - Le dédoublonnage consulte d'abord les fiches existantes et ne traite pas une URL partagée comme un doublon : une même page peut contenir plusieurs départs et formules.
- [ ] **Terminer la modération Telegram et site** - valider, modifier, archiver et remettre en ligne depuis Telegram ou l’admin, avec synchronisation immédiate et confirmation pour les actions sensibles.
- [ ] **Finaliser la recherche et les filtres admin** - recherche globale par mots-clés, statut, catégorie et sous-catégorie, avec compteurs de notifications fiables.
- [ ] **Corriger la catégorisation automatique** - permettre plusieurs dimensions pour une fiche, par exemple `événement` + `solidarité` + `maraude`, et distinguer cours, conférences, maraudes et collectes.
- [ ] **Fiabiliser les dates de solidarité et cagnottes** - archiver les fiches expirées, vérifier les liens actifs et ajouter de nouvelles sources vérifiées.
- [ ] **Terminer l’import des mosquées** - traiter les lots restants, dédoublonner, enrichir adresses/sites/réseaux sociaux, générer Google Maps, puis modérer par Telegram.
- [ ] **Créer l’espace “Lieux de prière”** - mosquées et salles de prière, carte, lieux proches et itinéraire Google Maps.
- [ ] **Créer l’espace “Convertis”** - intégrer le contenu “Premiers pas” et organiser les ressources utiles.
- [ ] **Améliorer l’interface admin mobile** - menu utilisable sur petit écran, cartes lisibles, actions accessibles et responsive réel.
- [ ] **Finaliser l’étape 4 : formulaires et sécurité** - schéma serveur strict, honeypot, rate limiting durable, anti-doublons, conservation/suppression, provenance UTM/référent, journal email et audit des secrets.
- [ ] **Rééquilibrer le remplissage du site** - quotas par catégorie pour ne pas surproduire les événements et développer mosquées, instituts, cours, santé, justice, librairies, piscines, solidarité et Hajj/Omra.
- [ ] **Auditer la valeur ajoutée Hajj/Omra** - comparaison normalisée : départ, durée, hôtels, distance, pension, guide, accessibilité, familles, annulation, garanties et date de vérification.
- [ ] **Clarifier le positionnement Hajj/Omra** - présenter Al-Wasil comme un service d'accompagnement et de mise en relation, avec éventuelle affiliation transparente, pas comme un simple comparateur.
- [ ] **Créer les pages détaillées des offres** - une fiche publique par offre avec toutes les informations disponibles, sources, avis sourcés, date de mise à jour et formulaire de demande de devis.
  - Champs prêts pour les tarifs par chambre, compagnie, hôtels, documents requis et dernière vérification ; les données effectivement confirmées restent à enrichir offre par offre.
- [ ] **Ajouter le SEO/GEO Hajj/Omra** - titres, descriptions, maillage interne, FAQ, données structurées Organization/Offer/Product/Breadcrumb, sitemap, robots.txt et fichier d'instructions LLM.
- [ ] **Documenter la méthode éditoriale** - page Qui sommes-nous, transparence du classement, vérification des agences, sources, avis, prix et distinction sponsorisé/naturel.
  - Pour chaque professionnel : distinguer identité légale/immatriculation, qualité des informations de l’offre, avis externes sourcés et affirmations marketing non vérifiées.
  - Ne pas convertir automatiquement « leader », « agréé », « + de 7 000 pèlerins » ou une note affichée par le site source en score Al-Wasil sans preuve indépendante et date de vérification.
- [ ] **Finaliser le suivi audience et publicité** - mesurer les pages et emplacements après consentement, puis ajouter des emplacements Partenaire Al-Wasil clairement signalés.

## Waiting On

- [ ] **Source Google Sheets des mosquées** - le lien fourni avait renvoyé “fichier introuvable”; utiliser la nouvelle source ou le fichier exporté si nécessaire.
- [ ] **Validation des données Hajj 2027** - les dates et offres officielles doivent être publiées par les agences/autorités avant intégration.

## Someday

- [ ] **Ajouter des associations de visites** - personnes malades, âgées, enfants et personnes fragiles.
- [ ] **Ajouter psychologues, praticiens hijama et voyages humanitaires** - par lots modérés et sources publiques.
- [ ] **Mettre en place un tableau de bord de couverture** - suivi des départements et catégories peu remplis.

## Done

- [x] ~~**Préparer l’interface Hajj 2027**~~ (2026-09-18) - anciennes offres Hajj 2026 retirées de l’affichage, libellés corrigés et scraper orienté Hajj 2027/Omra 2026-2027.
- [x] ~~**Créer le suivi qualité et consommation du scraping**~~ (2026-09-18)
- [x] ~~**Ajouter les boutons de validation Telegram**~~ (2026-09-18)
