---
name: alwasil-create-category
description: Créer une catégorie et son contrat de qualité.
---

Objectif : Créer une catégorie et son contrat de qualité.

Entrées : Nom, schéma, routes publiques et sensibilité.

Sorties : Catégorie cohérente du stockage à la recherche.

Procédure et règles : Mettre à jour types, mapping, politique, page et tests. Aucune catégorie inconnue auto-publiable.

Erreurs possibles : Mapping absent, route introuvable, données incompatibles.

Tests : Fiche complète/incomplète et route publique.

Validation humaine : Élargir les catégories auto-publiables. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
