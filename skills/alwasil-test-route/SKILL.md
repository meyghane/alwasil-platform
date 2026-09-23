---
name: alwasil-test-route
description: Tester une route et ses erreurs sans polluer la production.
---

Objectif : Tester une route et ses erreurs sans polluer la production.

Entrées : URL, contrat, environnement isolé.

Sorties : Résultats HTTP et assertions.

Procédure et règles : Tester authentification, validation, données vides et indisponibilité. Aucun envoi réel de messages ni fausse fiche publique.

Erreurs possibles : Neon indisponible, timeout, accès refusé.

Tests : Succès et erreurs observables.

Validation humaine : Test externe avec effet réel non déjà autorisé. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
