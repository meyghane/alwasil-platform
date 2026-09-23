---
name: alwasil-verify-deployment
description: Vérifier un déploiement existant et sa version.
---

Objectif : Vérifier un déploiement existant et sa version.

Entrées : Domaine, commit et déploiement.

Sorties : Correspondance commit, état et routes.

Procédure et règles : Comparer GitHub/Vercel ; tester pages, API et rollback. Ne pas confondre build local et production.

Erreurs possibles : Ancien commit, route 500, protection d’accès.

Tests : Version attendue et réponses HTTP.

Validation humaine : Nouveau déploiement ou rollback effectif. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
