---
name: alwasil-accessibility-review
description: Vérifier l’accessibilité d’une interface.
---

Objectif : Vérifier l’accessibilité d’une interface.

Entrées : Pages, tailles d’écran, navigation clavier.

Sorties : Constats reproductibles.

Procédure et règles : Vérifier noms accessibles, focus, erreurs, contraste et débordements ; tester mobile et clavier.

Erreurs possibles : Contrôle sans nom, focus perdu, contenu masqué.

Tests : Parcours clavier et tailles 390/1280 pixels.

Validation humaine : Aucune pour corrections dans le périmètre demandé. Les autorisations explicites déjà données restent applicables.

Dans Al-Wasil, lire les contrats de [l’architecture](../../docs/AGENT_ARCHITECTURE.md) pour les noms de tables, la politique et les routes. Pour un autre projet, adapter ces paramètres avant toute mutation ; ne pas réutiliser les identifiants ou secrets d’Al-Wasil.
