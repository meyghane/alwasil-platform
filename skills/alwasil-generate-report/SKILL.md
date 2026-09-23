---
name: alwasil-generate-report
description: Générer un rapport de veille fidèle aux exécutions.
---

Objectif : Générer un rapport de veille fidèle aux exécutions.

Entrées : Run enregistré et journal de livraison.

Sorties : Rapport avec compteurs et zones non couvertes.

Procédure et règles : Utiliser les appels réellement exécutés ; distinguer zéro résultat, non-exécuté, quota et erreur. Dédoublonner par run et destinataire.

Erreurs possibles : Journal absent, Telegram incertain.

Tests : Sommes cohérentes et rapport unique.

Validation humaine : Renvoi d’une livraison incertaine. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
