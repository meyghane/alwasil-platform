---
name: alwasil-prepare-vercel-release
description: Préparer une release testée et réversible.
---

Objectif : Préparer une release testée et réversible.

Entrées : Git propre, migrations, variables et contrôles.

Sorties : Commit explicite, rapport et procédure rollback.

Procédure et règles : Tests puis build ; contrôler diff et absence de secrets. Ne pas pousser tant qu’un prérequis bloque. Établir l’état GitHub et Vercel séparément.

Erreurs possibles : Tests rouges, migration manquante, secret invalide.

Tests : Tests, build, routes, diff et rollback.

Validation humaine : Déploiement seulement dans le périmètre autorisé après tous les contrôles. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
