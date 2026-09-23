---
name: alwasil-archive-record
description: Archiver une fiche en gardant son historique.
---

Objectif : Archiver une fiche en gardant son historique.

Entrées : Identifiant, motif, version actuelle.

Sorties : Statut expired, instantané et revalidation.

Procédure et règles : Utiliser la route corrective administrateur ; aucune suppression physique.

Erreurs possibles : Conflit de version, accès refusé.

Tests : Invisible publiquement, instantané restaurable.

Validation humaine : Archivage hors règles de fraîcheur préautorisées. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
