---
name: alwasil-audit-environment
description: Auditer la présence et le fonctionnement des variables sans les exposer.
---

Objectif : Auditer la présence et le fonctionnement des variables sans les exposer.

Entrées : Environnement cible et noms requis.

Sorties : Présence et vérifications fonctionnelles masquées.

Procédure et règles : Utiliser scripts/external-readiness.mjs et scripts/check-vercel-production.mjs. Aucun affichage de valeurs ; supprimer les fichiers temporaires contenant des secrets.

Erreurs possibles : Variable absente, clé refusée, permissions insuffisantes.

Tests : Sortie sans secret et service identifié.

Validation humaine : Rotation ou remplacement d’une clé. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
