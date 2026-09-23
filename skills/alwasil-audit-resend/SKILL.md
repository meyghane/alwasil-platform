---
name: alwasil-audit-resend
description: Vérifier configuration email et traitement des erreurs.
---

Objectif : Vérifier configuration email et traitement des erreurs.

Entrées : Expéditeur, domaine et droits de clé.

Sorties : État du domaine et journal des erreurs.

Procédure et règles : Vérification de domaine en lecture ; aucun email test envoyé sans autorisation. Une demande sauvegardée survit à l’échec email.

Erreurs possibles : Domaine non validé, clé restreinte, rejet fournisseur.

Tests : Erreur simulée, demande conservée, journal créé.

Validation humaine : Envoi externe réel ou changement DNS. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
