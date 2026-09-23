---
name: alwasil-merge-records
description: Fusionner deux fiches sans perdre leurs données fiables.
---

Objectif : Fusionner deux fiches sans perdre leurs données fiables.

Entrées : Deux identifiants, preuves des champs et version actuelle.

Sorties : Fusion historisée et ancienne fiche archivée.

Procédure et règles : Comparer nom, adresse, téléphone, email, URL, géolocalisation et anciens identifiants. Conserver les conflits pour arbitrage ; ne pas écraser une valeur mieux sourcée.

Erreurs possibles : Conflit, fiches différentes, version modifiée.

Tests : Complément conservé, conflit bloqué, restauration possible.

Validation humaine : Choix de la fiche canonique et résolution des contradictions. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
