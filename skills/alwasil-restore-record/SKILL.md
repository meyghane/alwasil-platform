---
name: alwasil-restore-record
description: Restaurer une fiche archivée sans republier des données périmées.
---

Objectif : Restaurer une fiche archivée sans republier des données périmées.

Entrées : Identifiant et instantané.

Sorties : Fiche restaurée et décision de qualité.

Procédure et règles : Restaurer en pending si la confiance ou la fraîcheur a expiré. Revalider les routes.

Erreurs possibles : Instantané absent, source bloquée.

Tests : Restauration historisée et absence de publication sensible automatique.

Validation humaine : Retour public si les critères automatiques échouent. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
