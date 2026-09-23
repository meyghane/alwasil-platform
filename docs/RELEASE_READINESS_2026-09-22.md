# Al-Wasil : état de reprise et conditions de release

Audit effectué les 22 et 23 septembre 2026. **Décision : pas de push ni de déploiement à ce stade.** Le code local et les migrations ne constituent pas une validation en production.

## Résultats vérifiés

| Périmètre | Résultat | Limite |
| --- | --- | --- |
| Git initial | Commit bbd6108 confirmé ; arbre initial propre ; main en avance de 4 commits après actualisation de GitHub | Aucun push effectué pendant cette reprise |
| Tests | 58 tests automatisés réussis | Les scénarios de publication, rollback et livraison utilisent des dépendances simulées |
| Compilation | Build Next.js réussi, 96 routes générées ; compilation du scraper réussie | Avertissement existant middleware/proxy |
| Routes locales | 18 contrôles HTTP réussis : pages, chatbot, refus admin/cron/Telegram | Pas de validation Telegram réelle en production |
| Interface | Accueil bureau et mobile 390 × 844 ; réponse du chatbot et liens observés ; aucune largeur débordante sur cette vue | Audit visuel partiel, pas certification exhaustive d’accessibilité |
| Neon | Migrations additives appliquées ; aucune colonne attendue manquante | Ne pas utiliser de synchronisation destructive du schéma partagé |
| CRM | 1 lead, ticket présent, aucun partner_id orphelin après correction historisée | 0 partenaire et 0 offre relationnelle : parcours commercial réel non validable |
| Hajj/Omra | 23 fiches contrôlées : 19 déjà archivées, 4 pending, 0 éligible | Aucune agence, offre ou coordonnée fabriquée ; enrichissement commercial restant |
| Telegram | Webhook existant joignable, bonne URL, callbacks activés, 0 message en attente, aucune erreur remontée | Vérification avec configuration locale ; nouveaux correctifs non déployés |
| Resend | API domaines HTTP 200 ; domaine al-wasil.fr vérifié | Aucun email réel envoyé ; identité d’expédition à confirmer |
| Gemini | Catalogue HTTP 400 avec la clé disponible | Échec externe à résoudre pour les fonctions qui en dépendent |
| Vercel | Déploiement existant Ready, antérieur à cette reprise | Secrets sensibles exportés masqués : leur présence ne prouve pas leur validité |
| GitHub Actions | Dernières exécutions consultées réussies ; noms des secrets requis présents | Ne prouve pas que les nouveaux changements sont déployés |

Les tests d’export Vercel ayant utilisé des valeurs masquées ne doivent pas être interprétés comme une panne réelle de Resend ou Telegram.

## Changements locaux réalisés

- Chatbot public : recherche déterministe dans les fiches approuvées, exclusion du spam et des événements passés, Hajj limité aux offres publiques vérifiées. Aucun modèle génératif utilisé pour fabriquer une réponse. Liens du site, erreurs, absence de résultat et timeout testés.
- Telegram : confirmation après contrôle de récupération publique, remise en attente en cas d’échec, journal de notifications durable, déduplication de fiche et update, exclusion des notifications déjà revendiquées dans /suivantes. Une livraison incertaine nécessite un contrôle humain plutôt qu’un renvoi automatique.
- Qualité : champs structurés de mosquées et instituts conservés, cours requis pour institut, fiches pauvres bloquées. Suppression des retours automatiques vers des données statiques en cas de panne de base.
- Public : mosquées/piscines reliées aux fiches Neon approuvées, données Hajj non vérifiables masquées, disponibilités commerciales non inventées. Compteurs et témoignages non justifiés de l’accueil retirés ; dates récurrentes non extrapolées.
- Formulaires/CRM : agence dérivée de l’offre publique plutôt que de l’entrée visiteur, validation et journal d’erreur email renforcés ; affectations et relances réservées aux partenaires vérifiés et au consentement.
- Publication : anciennes routes de validation directe neutralisées ; le script de publication refuse toute action sans approbation explicite de release.

## Agents, skills et automatisations

Huit rôles documentés et implémentés sous forme de modules déterministes : découverte, extraction, dédoublonnage, qualité, publication, fraîcheur, rapport, sécurité. Ce ne sont pas huit modèles autonomes ni une recherche universelle du Web.

Dix-neuf skills versionnées : ajouter une source, créer une catégorie, importer, fusionner, vérifier, archiver, restaurer, générer un rapport, veille par zone, tester une route, vérifier un déploiement, SEO, accessibilité, direction artistique, variables, Neon, Telegram, Resend, release Vercel. Le format et les liens locaux sont validés ; le validateur standard n’a pas pu être utilisé, PyYAML étant absent. Les skills alwasil-best-practices et skill-creator ont guidé les garde-fous et la séparation des contrats.

Nouveau cron préparé à 07:30 UTC : trois sources au maximum, cinquante candidats au maximum, rotation des régions, rapport quotidien dédupliqué. **Non activé en production.** Console /admin/agents : sources, décisions, archivage, restauration, fusion, revérification et historique avec retour arrière de sept jours.

Publication automatique possible pour mosquées, instituts, événements, associations et librairies uniquement depuis une source officiellement autorisée, avec données complètes et visibilité confirmée. Piscines différées tant que les modalités de tenue/créneau ne sont pas vérifiées. Hajj/Omra, cagnottes, santé, droit et emploi restent soumis à validation.

Le registre Neon contient actuellement **0 source et 0 exécution réelle d’agents**. La répétition en lecture seule produit correctement : aucune zone explorée, aucune catégorie exécutée, zéro résultat, zones non couvertes et action d’enregistrement des sources. Aucun message Telegram n’a été envoyé par ce test.

## Travaux et validations restant nécessaires

1. Rétablir une clé Gemini valide pour la veille et l’analyse Telegram existantes ; ne jamais la coller dans une conversation ou un commit.
2. Confirmer les identifiants administrateur/modérateur Telegram et l’expéditeur Resend dans Vercel. Tester les secrets dans leur environnement réel, pas à partir d’exports masqués.
3. Autoriser explicitement des sources officielles dans le registre. L’adaptateur initial accepte du JSON-LD compatible ; les sites sans données structurées exigent un adaptateur, pas une fiche inventée.
4. Compléter les quatre offres Hajj en attente et créer des partenaires réellement vérifiés avant toute publication commerciale. Les sources officielles consultées ne suffisent pas à certifier toutes les anciennes dates et formules.
5. Effectuer une recette avec une fiche réelle autorisée dans un environnement de test isolé : clic Telegram, visibilité effective, répétition /suivantes, redémarrage, rollback et restauration. Les tests simulés ne remplacent pas cette recette.
6. Trancher puis mettre en œuvre la conservation des données : les mentions indiquent 12 mois maximum, le nettoyage des soumissions est à 90 jours, et la purge/anonymisation des leads n’est pas finalisée. Aucune suppression de données personnelles exécutée ici.
7. Poursuivre l’audit des sources des fiches historiques hors Hajj et l’audit visuel/SEO/accessibilité exhaustif. L’état approved historique n’est pas, à lui seul, une preuve factuelle.
8. Vérifier les limites restantes : comparaison des champs de fraîcheur encore partielle ; compteurs détaillés du scraper historique incomplets ; fusion complémentaire corrective, pas enrichissement automatique général ; protections réseau à durcir avant d’accepter des sources non maîtrisées.
9. Après ces validations seulement : autoriser la release, pousser le commit, vérifier le déploiement Vercel et refaire les contrôles sur le domaine public.

**État global : socle local implémenté et testé, migrations présentes ; préparation de production incomplète et déploiement volontairement bloqué.**
