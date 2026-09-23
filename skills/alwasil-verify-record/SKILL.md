---
name: alwasil-verify-record
description: Vérifier une fiche contre sa source officielle.
---

Objectif : Vérifier une fiche contre sa source officielle.

Entrées : Identifiant, source et date de contrôle.

Sorties : Champs contrôlés, confiance et motifs.

Procédure et règles : Une réponse HTTP 200 ne prouve ni l’exactitude ni un numéro actif. Distinguer validité syntaxique, présence dans la source et vérification directe.

Erreurs possibles : Lien mort, téléphone absent, contradiction.

Tests : Source fermée, coordonnées douteuses, champs manquants.

Validation humaine : Contact direct ou vérification commerciale. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
