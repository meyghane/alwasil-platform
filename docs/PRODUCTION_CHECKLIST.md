# Mise en production Al-Wasil

## 1. Vérifications locales

```bash
npm run test
npm run build
git diff --check
```

## 2. Audit des offres Hajj/Omra

Le rapport sans modification permet d’identifier les fiches incomplètes :

```bash
npm run audit:hajj
```

L’archivage des offres déjà publiées doit être lancé séparément, après lecture du rapport :

```bash
npm run audit:hajj -- --archive
```

Une offre est considérée comme exploitable uniquement si elle possède une agence identifiable, un contact public, une source officielle, une ville, un départ, un prix, une durée, une période, une description et un détail de contenu.

## 3. Secrets à vérifier dans Vercel

Production doit contenir `DATABASE_URL`, `RESEND_API_KEY`, `CRON_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_MODERATION_CHAT_ID`, `GEMINI_API_KEY` et `MODERATE_SECRET`. Les valeurs ne doivent jamais être commitées.

## 4. Publication

```bash
git add -A
git commit -m "Finaliser le contrôle production Hajj et le CRM"
git push origin main
```

Vercel lance ensuite le déploiement GitHub. Après publication : tester un formulaire Hajj, vérifier la création du ticket, l’email, l’apparition dans l’admin, puis le webhook Telegram.
