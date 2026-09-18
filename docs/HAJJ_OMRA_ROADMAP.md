# Feuille de route Hajj / Omra

## Déjà en place

- [x] Offres Hajj/Omra distinctes dans Neon, avec modération avant publication.
- [x] Fiches enrichies : prix, départ, durée, hôtels, distances, places, inclusions, exclusions et documents.
- [x] Pages détaillées par offre avec demande de devis, FAQ et données structurées.
- [x] Filtres par type de voyage, budget, départ et recherche.
- [x] Score qualité conservé en interne et non affiché au public.
- [x] Noms d’agences masqués sur les cartes publiques.
- [x] Demandes de devis enregistrées comme leads avec pipeline et historique.
- [x] Sitemap, robots.txt et llms.txt présents.

## À terminer

- [ ] Alimenter réellement les offres 2027 à partir de sources publiques vérifiées, sans doublons.
- [ ] Tester de bout en bout : offre publiée, formulaire, création du lead et affichage dans `/admin/leads` en production.
- [ ] Afficher les événements du ticket dans une timeline complète avec auteur et action réversible.
- [ ] Relier proprement une offre Neon à une agence Neon quand un identifiant UUID existe ; conserver les anciennes références comme métadonnées internes.
- [ ] Ajouter les avis externes sourcés et leur date de collecte dans les fiches et le modèle de notation interne.
- [ ] Finaliser les relances et l’attribution d’une demande à une agence depuis le ticket.
- [ ] Vérifier les balises SEO/GEO et les données structurées sur chaque page d’offre publiée.
- [ ] Documenter puis supprimer les derniers chemins historiques Sheets/Make après validation des migrations.

## Règles produit

- Al-Wasil accompagne et met en relation ; le site ne se présente pas comme un simple comparateur.
- Une fiche publique ne montre ni le nom direct de l’agence ni le score interne.
- Les prix, disponibilités et conditions restent à confirmer avant réservation.
- Aucune donnée absente d’une source ne doit être inventée.
