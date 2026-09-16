---
name: alwasil-web-quality
description: Préparer et auditer toute interface web destinée à Vercel ou Shopify avant publication, avec contrôle sécurité, conformité, SEO, accessibilité, performance et formulaires.
---

# Qualité web avant publication

Utiliser ce skill pour chaque nouvelle interface HTML/web et chaque refonte Al-Wasil, Meyghane ou projet e-commerce.

## Contrôle obligatoire

- Respecter la DA musulmane du projet dans les visuels : ne jamais représenter un cours religieux ou d’arabe mixte. Pour montrer les deux publics dans une même bannière, utiliser deux salles ou deux groupes clairement séparés — cours réservé aux femmes d’un côté, cours réservé aux hommes de l’autre. Vérifier cette séparation avant toute intégration d’image générée.
- Vérifier qu’aucune clé, URL secrète, token ou identifiant privé n’est envoyé au navigateur; garder les secrets côté serveur et dans les variables d’environnement.
- Vérifier HTTPS, redirections, en-têtes de sécurité adaptés et absence de contenu mixte.
- Prévoir une politique de confidentialité, des CGU adaptées, un bandeau de consentement si analytics/cookies non essentiels sont utilisés, et des choix documentés.
- Ajouter metadata title/description, canonical, Open Graph/Twitter, favicon, sitemap, robots.txt, page 404 et données structurées utiles.
- Donner un texte alternatif pertinent à chaque image, compresser et dimensionner les images, contrôler le chargement mobile et les pages principales.
- Tester le contraste, le clavier, les états focus/erreur/chargement et les libellés de formulaires.
- Valider les formulaires côté serveur, limiter le spam, éviter la fuite de données et afficher des erreurs compréhensibles.
- Installer l’analytics uniquement après consentement quand nécessaire, documenter l’outil et vérifier que les événements importants ne contiennent pas de données personnelles.
- Vérifier les liens internes, les liens externes, les CTA et choisir un CTA principal par page.
- Mesurer performance et erreurs en local/preview; corriger les problèmes bloquants avant toute publication.

## Règles d’exécution

Préserver l’existant, ne jamais déployer sans validation explicite, ne jamais afficher de secret dans les logs, et signaler clairement ce qui nécessite une configuration externe (DNS, Vercel, Shopify, analytics ou fournisseur de consentement). Pour Shopify, appliquer la même checklist au thème, aux pixels, aux apps et au checkout, puis inscrire les travaux dans la roadmap du projet.
