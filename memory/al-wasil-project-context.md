# AL-WASIL — Mémoire complète de reprise du projet

> Document de reprise pour une nouvelle conversation avec Astra/Codex.
> Ce fichier ne contient aucun secret, token, mot de passe ou identifiant privé.
> Dernière mise à jour : 23 septembre 2026.

> Point de reprise vérifié : 58 tests passent, build Next.js et scraper réussis, migrations Neon additives appliquées. Aucun push ni déploiement des correctifs. Registre d’agents vide ; Gemini renvoie HTTP 400. Les 4 offres Hajj pending restent bloquées, les 19 anciennes fiches archivées sont conservées. Lire `docs/RELEASE_READINESS_2026-09-22.md` pour distinguer code local, preuves réelles et validations encore nécessaires. Ne pas présenter le projet comme terminé.

> Nouvelle instruction de l’utilisatrice reçue le 22 septembre : créer huit agents et dix-neuf skills réutilisables, avec publication automatique contrôlée des catégories ordinaires à forte confiance. Cette instruction remplace la prohibition générale d’auto-publication présente dans les sections historiques. Les imports Telegram/manuels et Hajj/Omra restent soumis à validation. Consulter `docs/AGENT_ARCHITECTURE.md`. Les changements de cette reprise sont en cours de vérification ; leur présence locale ne signifie pas qu’ils sont déployés.

## 1. Mission du projet

Al-Wasil est un annuaire communautaire musulman français. Le site doit aider les utilisateurs à trouver :

- des événements et rencontres ;
- des initiatives de solidarité ;
- des instituts, écoles, cours et mosquées ;
- des services utiles : emploi, santé, droit, librairies, piscines ;
- des lieux de prière ;
- des offres Hajj/Omra fiables ;
- des ressources pour les convertis.

Le site doit être utile, fiable, chaleureux, lisible et exploitable commercialement sans publier de données inventées.

## 2. Stack et règles impératives

- Repository : `https://github.com/meyghane/alwasil-platform`
- Projet local : `/Users/meyghane/PROJECTS_2026/ALWASIL_SITE`
- Production : `https://al-wasil.fr`
- Framework : Next.js App Router, React, TypeScript strict.
- Base principale : Neon/PostgreSQL.
- Déploiement : GitHub `main` → Vercel.
- CSS inline uniquement ; pas de Tailwind.
- Icônes Lucide uniquement ; pas d’emojis dans l’interface.
- Navigation avec `next/link`.
- Ne jamais écrire de secrets dans le code ou dans ce document.
- Toujours lancer les tests et le build avant publication.
- Ne jamais publier automatiquement une nouvelle fiche.
- Une source publique doit être vérifiable ; ne jamais inventer un téléphone, un email, un réseau social ou une agence.

## 3. Direction artistique

DA validée :

- blanc, noir `#080808`, citron `#ECFF58`, violet `#7652CA` ;
- boutons en forme de pilule ;
- photos lumineuses et cohérentes ;
- mosaïque de formes arrondies, carrés et ovales ;
- header blanc commun ;
- style éditorial vivant, proche de Konbini, sans transformer tous les textes en cartes ;
- une couleur dominante par univers/page lorsque cela sert la compréhension ;
- aucune mixité incohérente dans les photos : une image doit respecter le contexte de sa page.

Lire `DIRECTION_ARTISTIQUE.md` avant toute nouvelle modification visuelle.

## 4. Pages principales et comportement attendu

### Accueil `/`

Page d’entrée éditoriale :

- présenter les usages principaux du site ;
- mettre en avant événements et solidarité ;
- guider vers apprentissage, services, lieux et Hajj/Omra ;
- rester rapide et lisible sur mobile ;
- ne pas afficher de données internes, de score qualité ou de sources privées.

### Événements `/events`

- afficher uniquement les événements validés ;
- filtres par département, catégorie, recherche et présence/en ligne ;
- les fiches doivent avoir une source, une date, une ville et une description suffisante ;
- les événements passés doivent être signalés ou archivés.

### Solidarité `/solidarity`

- distinguer cagnottes, associations, initiatives et dispositifs organisés ;
- privilégier les associations/fondations et les programmes de visite ou d’accompagnement ;
- ne jamais créer un profil individuel à partir d’une simple mention ;
- vérifier qu’une cagnotte est encore active.

### Apprentissage `/education`

- séparer clairement les instituts/écoles/cours des mosquées ;
- filtres pour Coran, tajwid, langue arabe, sciences islamiques, enfants ;
- ne pas présenter une simple mosquée comme un institut sans information de cours ;
- les informations de cours doivent être dans des champs structurés.

### Lieux de prière `/lieux-priere`

- afficher une vraie carte visuelle ;
- bouton de géolocalisation avec consentement navigateur ;
- position utilisateur visible uniquement après accord ;
- pins pour les lieux référencés ;
- adresse et itinéraire Google Maps ;
- séparer les photos selon le contexte et ne pas utiliser de photo mixte inadaptée.

### Convertis `/convertis`

- page dédiée avec bannière spécifique ;
- contenu éditorial normal : titres, paragraphes et listes, pas une succession de cartes décoratives ;
- ressources fiables, accompagnement et lieux utiles.

### Services

Le menu doit contenir, dans l’ordre validé par l’utilisatrice :

- Convertis ;
- Mosquées ;
- Emploi ;
- Santé ;
- Droit & justice ;
- Librairies ;
- Piscines.

Les emplois sont actuellement masqués de la veille automatique. Ne pas relancer la recherche d’emploi sans demande explicite.

### Hajj/Omra `/hajj`

- afficher uniquement les offres publiques suffisamment documentées ;
- ne jamais présenter une agence comme partenaire sans accord ;
- chaque offre doit être liée à une agence réelle ou rester non publiée ;
- offre complète minimale : agence identifiable, contact public, source officielle, ville, départ, prix, durée, période, description et détail de contenu ;
- bouton de demande de devis : conserver `offer_id`, `partner_id` et référence `AW-...` ;
- les offres incomplètes restent pending/enrichissement, jamais publiques.

### CRM Hajj/Omra `/admin/leads`

Vue attendue :

- liste des tickets à gauche ;
- référence visible `AW-AAAA-XXXXXX` ;
- recherche par référence, client ou voyage ;
- filtres par statut : nouveau, qualifié, attribué, pris en charge, devis demandé, finalisé, sans suite, archivé ;
- temps depuis création et depuis changement de statut ;
- vue détaillée du client, de l’offre et de l’agence ;
- messages séparés pour le client et l’agence ;
- historique complet et réversible ;
- contact agence activé uniquement si une vraie agence est liée.

## 5. État technique actuel

### Réalisé

- validation serveur des formulaires ;
- consentement Hajj bloquant ;
- création de leads Neon ;
- dédoublonnage amélioré ;
- provenance des formulaires ;
- références persistées `AW-...` ;
- CRM et historique de modération ;
- contrôles Hajj/Omra avant Telegram et avant publication ;
- blocage de `agence-a-verifier` ;
- rapport de veille Telegram structuré ;
- séparation instituts/mosquées ;
- page lieux de prière avec carte et géolocalisation ;
- bannières Convertis et Mosquées ;
- script d’audit des offres Hajj/Omra ;
- documentation de production ;
- tests automatisés : 16/16 réussis ;
- build Next.js réussi.

### Audit Neon effectué

Audit du 19 septembre 2026 :

- 23 offres Hajj/Omra analysées ;
- 0 offre conforme aux critères complets ;
- 19 anciennes offres publiées archivées ;
- 4 offres conservées en pending pour enrichissement ;
- aucune fiche supprimée.

Commande :

```bash
npm run audit:hajj
npm run audit:hajj -- --archive
```

### Commits locaux importants

- `918d425` — finalisation production/audit ;
- `2587c18` — correction du script d’audit.

Le dépôt local était en avance sur `origin/main` et n’a pas encore forcément été poussé après ces commits.

## 6. Automatisations attendues

### Veille quotidienne

Objectif maximum : 50 nouvelles fiches/jour, jamais artificiellement remplies.

Plafonds indicatifs :

- mosquées : 15 ;
- instituts/cours : 10 ;
- solidarité/cagnottes : 8 ;
- santé/hijama : 5 ;
- librairies : 4 ;
- piscines : 3 ;
- droit/justice : 3 ;
- voyages/Hajj/Omra : 2.

La veille doit produire un rapport Telegram contenant :

- zones réellement interrogées ;
- catégories exécutées ;
- résultats trouvés ;
- fiches insérées ;
- doublons ;
- fiches rejetées et raisons ;
- erreurs et quotas ;
- catégories non exécutées ;
- zones encore non couvertes.

Les nouvelles fiches sont toujours `pending` dans Neon et proposées à validation. Aucun auto-publish.

### Architecture cible des données

```text
Sources publiques fiables
        ↓
Scraper / import contrôlé
        ↓
Neon : items pending
        ↓
Modération humaine
        ↓
Publication publique
```

Neon doit être la source de vérité. Google Sheets peut rester export/sauvegarde, pas une seconde source concurrente. Les anciens chemins Make doivent rester désactivés. Telegram sert à l’import et à la modération, pas à publier directement.

## 7. Ce qui reste à faire

### Bugs prioritaires signalés

- Telegram affiche parfois « publié » alors que la fiche n’est pas visible sur la page publique : vérifier la transition `pending → approved`, la revalidation du bon chemin, les filtres publics, le cache et la réponse Telegram. Le bouton ne doit confirmer « publié » que lorsque la mise à jour Neon a réussi et que la fiche est réellement récupérable par la route publique. Sinon, afficher « publication échouée » avec une action de correction.
- Telegram renvoie plusieurs fois les mêmes notifications : ajouter une déduplication durable par identifiant de fiche, identifiant `update_id`, source Telegram et type de notification. Une notification déjà envoyée ne doit pas être renvoyée à chaque passage, redémarrage du webhook ou commande `/suivantes`. Les envois doivent être journalisés avec date, destinataire et résultat.
- Les fiches remontées par la recherche sont trop pauvres : instaurer une qualité minimale par catégorie avant soumission/modération. Pour mosquées/instituts : nom, type exact, ville, département, adresse ou zone, téléphone ou contact public, source officielle, description utile, horaires si disponibles et informations de cours lorsque l’établissement est présenté comme institut. Une fiche pauvre doit rester à enrichir et ne doit pas être proposée comme fiche publiable.
- Les fiches Telegram doivent conserver les champs structurés extraits : catégorie, sous-catégorie, ville, département, adresse, contact, source, date de vérification, niveau de confiance, tags, description, horaires/cours et liens utiles. Ne pas réduire une fiche riche à une simple description libre.
- Le chatbot doit être audité et réparé : vérifier le modèle configuré, les erreurs d’appel, les timeouts, les réponses vides, la recherche dans les seules fiches publiques approuvées, les liens vers les pages existantes, la non-divulgation des sources et statuts internes, ainsi que l’interdiction d’inventer une fiche ou un contact. Ajouter un état d’erreur clair et un fallback utile lorsque la question ne peut pas être traitée.

### Obligatoire avant communication publique large

- pousser les commits vers GitHub ;
- vérifier le déploiement Vercel et les logs ;
- vérifier `DATABASE_URL` et appliquer les migrations production ;
- vérifier Resend et le domaine `al-wasil.fr` ;
- configurer `megane@al-wasil.fr` comme expéditeur vérifié ;
- vérifier les variables Vercel et GitHub Actions ;
- réinstaller le webhook Telegram avec son secret ;
- tester formulaire → email → ticket → CRM → agence ;
- vérifier consentement, suppression et politique de conservation ;
- vérifier les pages mobiles et les erreurs runtime.

### Hajj/Omra

- créer les agences réelles dans `partners` ;
- enregistrer email, téléphone, source et statut de vérification ;
- relier chaque offre à `partner_id` ;
- enrichir les 4 fiches pending restantes ou les archiver ;
- ajouter acceptation/refus par agence ;
- ajouter relances email planifiées ;
- suivre les commissions et les conversions ;
- prévoir un accord écrit d’affiliation avec chaque agence.

### Sécurité et exploitation

- rate limiting durable ;
- honeypot anti-robots ;
- suppression/conservation des données ;
- journalisation fiable des emails Resend ;
- sauvegarde et restauration Neon ;
- environnement Neon de test séparé ;
- tests API automatisés plus complets ;
- surveillance runtime ;
- migration future middleware → proxy si nécessaire.

## 8. Variables externes à vérifier par l’administratrice

Ne jamais les écrire dans le chat ou dans Git :

- Resend : clé API, domaine vérifié, adresse `megane@al-wasil.fr` ;
- Vercel Production : `DATABASE_URL`, `RESEND_API_KEY`, `CRON_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_MODERATION_CHAT_ID`, `GEMINI_API_KEY`, `MODERATE_SECRET` ;
- GitHub Actions : `DATABASE_URL`, `GEMINI_API_KEY`, `RESEND_API_KEY`, secret de scraping, secret de modération ;
- Telegram : webhook actif et secret correct.

## 9. Procédure de reprise avec Astra

Copier ce document dans la nouvelle conversation puis donner cette consigne :

```text
Tu reprends le projet Al-Wasil depuis le fichier memory/al-wasil-project-context.md.

Lis d’abord AGENTS.md, DIRECTION_ARTISTIQUE.md et ce fichier mémoire.
Ne suppose jamais qu’une tâche est terminée sans vérifier le dépôt, Neon, les tests et le build.
Ne fabrique aucune donnée d’agence, aucun contact, aucune source et aucun résultat de veille.
Travaille dans l’ordre suivant :
1. vérifier git, les commits et le build ;
2. pousser uniquement les commits validés puis vérifier Vercel ;
3. vérifier les variables externes sans afficher leurs valeurs ;
4. tester formulaire Hajj/Omra, email, ticket CRM et modération Telegram ;
5. enrichir ou archiver les fiches pending selon les sources officielles ;
6. finaliser partners, partner_id, attribution, relances et commissions ;
7. réparer et tester le chatbot sur des questions événements, mosquées, instituts, solidarité et Hajj/Omra ;
8. réparer Telegram : publication réellement visible, déduplication des notifications, journal des envois et contrôles d’échec ;
9. renforcer la qualité minimale et l’extraction structurée des fiches mosquées/instituts ;
10. améliorer les automatisations de veille et leurs rapports ;
11. ne jamais publier automatiquement une fiche nouvelle.

À chaque étape, indique : ce qui a été réellement exécuté, ce qui a été vérifié, ce qui est bloqué, et ce que l’administratrice doit faire elle-même.
Ne dis jamais “terminé” si c’est seulement codé localement ou si ce n’est pas déployé.
``` 

## 10. État final attendu

Le projet sera considéré comme terminé lorsque :

- toutes les pages publiques sont accessibles, cohérentes et responsives ;
- aucune fiche publique ne contient de données fictives ou internes ;
- chaque offre Hajj/Omra publiée possède une agence et un contact vérifiés ;
- chaque demande crée un ticket complet et traçable ;
- le client et l’agence peuvent être contactés proprement ;
- les statuts, relances, réponses et commissions sont historisés ;
- Neon est la source principale ;
- les imports sont pending par défaut ;
- le rapport quotidien de veille est fiable et honnête ;
- Resend, Telegram, GitHub Actions et Vercel sont configurés ;
- tests, build, migrations et sauvegardes sont documentés ;
- un déploiement propre a été vérifié sur le domaine public.

## Point de reprise vérifié : 23 septembre 2026

Le lot suivant 7c552df est décrit dans docs/RELEASE_READINESS_2026-09-23.md. Il reste local, sans push ni déploiement. Tests : 73 réussis ; build Next.js 16.3.6 : 97 routes ; relais scraper compilé. Contrôles HTTP locaux : pages testées 200, API privées 401, JSON de connexion invalide 400, configuration de session insuffisante 503.

Neon vérifié : migrations 0015/0016 présentes, deux partenaires vérifiés sans accord commercial présumé, un lead avec ticket, aucun lien partenaire invalide ; quatre propositions Hajj archivées avec instantanés, total 23 archivées et zéro pending. Aucune nouvelle offre publiée. Zéro source autorisée et zéro exécution d’agent : ne pas présenter une couverture comme réalisée.

Blocages : secret de session local trop court (minimum 32 caractères désormais), rotation des anciens identifiants codés en dur nécessaire, Gemini HTTP 400, RESEND_FROM_EMAIL absent, CRON_SECRET GitHub à configurer, identifiants Telegram dédiés à confirmer, autorisation des sources et politique de conservation à valider. Aucun effacement/anonymisation de données personnelles exécuté. Ne jamais afficher les valeurs des secrets.

Recette persistante PostgreSQL isolée réussie, mais transport Telegram simulé et visibilité contrôlée par SQL dans cette recette : ne remplace pas la recette HTTP/Telegram de production. Confirmation de livraison email finale, recette visuelle authentifiée et audit anti-tentatives répétées restent à réaliser. Demander validation du bilan avant tout push.
