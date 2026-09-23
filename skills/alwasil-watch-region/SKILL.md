---
name: alwasil-watch-region
description: Lancer la découverte sur une zone selon quotas.
---

Objectif : Lancer la découverte sur une zone selon quotas.

Entrées : Région, catégories autorisées, budget.

Sorties : Run et couverture documentés.

Procédure et règles : Utiliser le registre de sources. Ne pas relancer emploi sans demande. Une zone sans source est non couverte.

Erreurs possibles : Quota, source absente, erreur HTTP.

Tests : Rotation et arrêt budget.

Validation humaine : Élargissement du budget ou catégorie sensible. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
