---
name: alwasil-audit-telegram
description: Vérifier webhook, livraison et visibilité publique.
---

Objectif : Vérifier webhook, livraison et visibilité publique.

Entrées : Configuration existante et journaux.

Sorties : État et erreurs sans token.

Procédure et règles : Contrôler callback_query, secret, utilisateur/chat autorisés, journal durable. Un timeout n’autorise pas un renvoi aveugle.

Erreurs possibles : Publication invisible, livraison uncertain, quota.

Tests : Succès/échec, redémarrage, /suivantes et accès refusé.

Validation humaine : Envoi réel de test et réconciliation d’un résultat incertain. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
