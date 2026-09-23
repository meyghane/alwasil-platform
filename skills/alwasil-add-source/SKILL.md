---
name: alwasil-add-source
description: Ajouter une source officielle à un annuaire modéré.
---

Objectif : Ajouter une source officielle à un annuaire modéré.

Entrées : URL, catégorie, départements et preuve de propriété.

Sorties : Source enregistrée avec confiance justifiée.

Procédure et règles : Vérifier le domaine et les droits d’accès ; conserver la preuve dans agent_sources. Une source nouvelle reste pending. Tester une extraction avant de la marquer trusted.

Erreurs possibles : URL privée, redirection hors domaine, interdiction d’accès, source non officielle.

Tests : URL privée refusée ; source pending ne publie pas.

Validation humaine : Accorder ou retirer le statut trusted. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
