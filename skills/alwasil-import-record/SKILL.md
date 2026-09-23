---
name: alwasil-import-record
description: Importer une fiche structurée avec provenance.
---

Objectif : Importer une fiche structurée avec provenance.

Entrées : Fiche, URL exacte, catégorie, source enregistrée.

Sorties : Identifiant et décision de politique journalisée.

Procédure et règles : Utiliser le pipeline ; conserver les champs et leur provenance. Ne pas approuver directement en SQL.

Erreurs possibles : Source absente, doublon, schéma incorrect.

Tests : Doublon idempotent et fiche pauvre différée.

Validation humaine : Cas sensibles et sources non approuvées. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
