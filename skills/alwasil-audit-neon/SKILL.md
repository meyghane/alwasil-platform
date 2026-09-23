---
name: alwasil-audit-neon
description: Auditer schéma, migrations et cohérence de Neon.
---

Objectif : Auditer schéma, migrations et cohérence de Neon.

Entrées : Connexion existante, schéma et migrations.

Sorties : Écarts, compteurs et plan additif.

Procédure et règles : Utiliser scripts/production-readiness.mjs en lecture d’abord. Base partagée : ne pas utiliser schema push destructif.

Erreurs possibles : Migration absente, lien orphelin, enum incompatible.

Tests : Schéma attendu et migrations idempotentes.

Validation humaine : Migration destructive ou modification hors périmètre. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
