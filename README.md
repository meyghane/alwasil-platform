# Al-Wasil Platform (Prototype)

Plateforme communautaire centralisée pour l'éducation, la solidarité et l'entraide.

## Démarrage Rapide

1.  Installer les dépendances :
    ```bash
    npm install
    ```

2.  Lancer le serveur de développement :
    ```bash
    npm run dev
    ```

3.  Ouvrir [http://localhost:3000](http://localhost:3000)

## Structure du Projet

*   `src/app/` : Pages et Layout (Next.js App Router)
    *   `page.tsx` : Page d'accueil (Tableau de bord)
    *   `education/` : Module Éducation (Annuaire Instituts/Profs)
*   `src/components/` : Composants réutilisables (Navigation, Cards...)
*   `src/app/globals.css` : Styles globaux et variables de thème (Teal/Sand)

## Fonctionnalités Implémentées (Phase 1)

*   ✅ **Architecture** : Next.js + TypeScript + CSS Modules.
*   ✅ **Design System** : Thème moderne, épuré, responsive.
*   ✅ **Navigation** : Barre de menu complète avec version mobile.
*   ✅ **Module Éducation** : Interface de recherche et listing (Mock).
