# Modération Telegram sur mobile

Le même bot sert à deux usages :

- Conversation privée : envoyer des liens, textes, images et vocaux. Chaque nouvelle proposition crée une fiche en attente dans Neon.
- Groupe privé de modération : recevoir les aperçus et utiliser les boutons Valider, Refuser et Modifier.

Les boutons de décision ne fonctionnent que pour l'identifiant utilisateur défini dans `TELEGRAM_CHAT_ID`. Le groupe destinataire est défini séparément dans `TELEGRAM_MODERATION_CHAT_ID`. Si cette seconde variable est absente, les notifications partent dans la conversation privée existante.

## Mise en service

1. Créer un groupe Telegram privé, y ajouter le bot existant, puis y envoyer `/chatid` depuis le compte administrateur autorisé.
2. Copier uniquement l'identifiant numérique du groupe dans la variable Vercel Production `TELEGRAM_MODERATION_CHAT_ID`. Ne jamais mettre le token du bot ou l'identifiant dans le dépôt.
3. Après déploiement, ouvrir `/admin/soumissions` avec une session administrateur et cliquer sur « Activer les boutons Telegram ». Cela réinstalle le webhook avec les mises à jour `callback_query` nécessaires aux boutons. L'ancienne configuration du webhook ne les livre pas.
4. Envoyer une ressource réelle au bot en privé. Vérifier que l'aperçu arrive dans le groupe et que la fiche reste en attente.
5. Tester Refuser sur une fiche de test, puis Valider sur une fiche réelle vérifiée. Contrôler la page publique correspondante.

## Fonctionnement

- Les propositions envoyées personnellement au bot sont notifiées immédiatement.
- Le récapitulatif automatique est envoyé chaque jour à 08:00 UTC. Il donne le total des fiches automatiques en attente et les cinq plus récentes.
- Dans le groupe, `/suivantes` renvoie les cinq fiches en attente les plus récentes. `/suivantes 5` affiche les cinq suivantes, puis `/suivantes 10`, etc.
- Modifier ouvre la fiche dans la modération du site. Une session administrateur valide est requise.
- Une fiche déjà traitée ne peut pas être traitée une seconde fois. Les cagnottes et les fiches incomplètes doivent être vérifiées sur le site avant publication.
- Les décisions prises depuis Telegram sont inscrites dans `moderation_log`.

La configuration ne publie ni n'approuve automatiquement les 91 fiches déjà en attente.
