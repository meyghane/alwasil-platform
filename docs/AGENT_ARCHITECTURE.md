# Agents réutilisables Al-Wasil

La demande du 22 septembre 2026 autorise une publication automatique contrôlée. Elle remplace la règle historique imposant une validation individuelle pour toute fiche. Les imports manuels et Telegram restent en attente ; seul le pipeline de confiance peut publier automatiquement.

## Contrats et responsabilités

Les contrats TypeScript sont dans `src/lib/agents/contracts.ts`. Les huit agents sont des modules déterministes indépendants, pas huit conversations ni huit modèles payants.

| Agent | Entrée | Sortie | Permissions et logs |
| --- | --- | --- | --- |
| Découverte | Registre, catégories, rotation, quota | Sources sélectionnées et zones non couvertes | Lecture `agent_sources`, appels HTTPS limités |
| Extraction | Page officielle JSON-LD | Champs séparés, URL, empreinte, date, champs observés | Aucun accès en écriture |
| Dédoublonnage | Candidat et fiches existantes | Correspondances, compléments, contradictions | Lecture des fiches ; fusion corrective historisée |
| Qualité | Fiche et preuve de fiabilité | Confiance, décision, motifs | Fonction pure testable |
| Publication | Décision autorisée | Fiche, instantané et confirmation publique | Écriture atomique `items` + `agent_item_history` |
| Fraîcheur | Date et état de la source | Proposition de revérification ou archivage | Ne déduit jamais une fermeture d’une panne HTTP |
| Rapport | Compteurs de l’exécution | Rapport Telegram unique | `agent_runs` et `telegram_deliveries` |
| Sécurité | Source, contenu, accès | Refus de destination privée, contenu suspect ou permission absente | Erreurs masquées, aucun secret dans les logs |

## Politique de confiance

Catégories auto-publiables : mosquées, instituts, événements, associations, librairies et piscines. Il faut une source officielle explicitement `trusted`, une preuve de fiabilité, une extraction fraîche, les champs essentiels, aucun doublon démontré ni contradiction connue. Les données restent celles observées dans la source ; une disponibilité, un prix, un numéro actif ou une certification ne sont pas déduits.

Hajj/Omra, cagnottes, santé, droit et emploi ne sont pas auto-publiables. Emploi n’est pas recherché automatiquement. Les piscines peuvent être découvertes mais restent différées dans cet adaptateur : une entrée PublicSwimmingPool ne prouve ni les créneaux ni l'autorisation d'une tenue couvrante. Une source absente ou bloquée, un contenu malveillant ou privé bloque la publication. Une fiche pauvre ou une source non validée diffère la publication.

La source est enregistrée dans `/admin/agents`, avec URL exacte, catégorie, départements et preuve. Elle commence `pending`. L’administratrice peut la rendre `trusted` ou `blocked`. Aucun registre réel n’est fabriqué au déploiement.

## Exécution et limites

`GET /api/cron/agents`, protégé par `CRON_SECRET`, est prévu chaque jour à 07:30 UTC dans `vercel.json`. Le run quotidien est revendiqué durablement avant travail ; trois sources au maximum sont consultées et cinquante candidats au maximum traités. Les régions tournent chaque jour. Le rapport distingue les zones réellement interrogées et celles sans source. Les catégories sensibles sont explicitement signalées comme non exécutées.

L’adaptateur initial lit le JSON-LD officiel. Une page sans JSON-LD compatible ne produit aucune fiche ; un adaptateur supplémentaire est nécessaire. La découverte porte sur le registre autorisé, pas sur un moteur de recherche généraliste. Le module de fraîcheur produit des propositions ; le cron historique de fraîcheur reste en place. Les modifications de réseaux sociaux et de téléphone ne sont pas garanties par une simple lecture HTTP.

Après une écriture approuvée, le pipeline revalide les routes et interroge `https://al-wasil.fr/api/public/items/{id}`. Toute absence ou erreur remet la fiche en attente, avec historique. Le déploiement de cette route est donc un prérequis à l’activation réelle.

## Correction et retour arrière

`/admin/agents` affiche les publications automatiques récentes, motifs, confiance, sources, rapports et livraisons incertaines. Les champs sont modifiables dans `/admin/soumissions`. La console propose archivage, restauration, revérification, fusion et annulation ; les contrôles serveur exigent une session administrateur.

Les instantanés avant/après sont conservés. La fenêtre d’annulation rapide est de sept jours. Au-delà, l’archivage reste possible. Restaurer ne contourne pas les critères de confiance : une fiche non éligible retourne en attente. Une fusion conserve les compléments et bloque les valeurs contradictoires.

## Livraison Telegram

Les clés de notification sont stables par destinataire, type et fiche ; source et `update_id` sont journalisés. Un envoi déjà revendiqué n’est pas renvoyé après redémarrage. En cas de résultat incertain, le journal demande une vérification humaine : Telegram ne fournit pas de clé d’idempotence permettant de garantir un nouvel envoi sans doublon.

## Réutilisation et skills

Les 19 dossiers `skills/alwasil-*/SKILL.md` sont versionnés avec le projet. Ils ne sont pas installés globalement. Pour un autre projet, adapter le stockage, les catégories, les adaptateurs, les URL publiques et les contrôles d’accès. Les interfaces `AgentPorts` permettent d’injecter d’autres services sans changer le moteur.

Chaque skill définit objectif, entrées, sorties, règles, erreurs, tests et autorité humaine. Le skill `skill-creator` a guidé cette séparation et la conservation des frontières d’autorisation.

## Contrôles avant release

1. `npm run test`, compilation du scraper et `npm run build`.
2. `node --env-file=.env.local scripts/production-readiness.mjs` ; migrations additives avec `--apply` seulement sur la base ciblée.
3. `node scripts/check-vercel-production.mjs` : configuration temporaire supprimée après vérification, valeurs masquées.
4. Tests HTTP des routes publiques et des refus d’accès admin/cron.
5. Vérification responsive, navigation clavier et absence de données internes.
6. Commit local, état GitHub et déploiement Vercel vérifiés séparément. Ne pas pousser si les prérequis externes échouent.

La base Neon est partagée avec d’autres tables : ne pas utiliser une synchronisation destructive globale de schéma. Les migrations `0012`, `0013` et `0014` ajoutent respectivement le journal Telegram, les preuves des agences et les tables d’agents.
