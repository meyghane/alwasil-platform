# Pending events — file d'attente routine → site

La routine Claude Code cloud (recherche quotidienne d'événements) dépose ici
un fichier JSON par run (`{timestamp}.json`), car elle n'a pas d'accès réseau
sortant vers al-wasil.fr (politique de sécurité de l'environnement sandboxé).

Le workflow `.github/workflows/process-pending-events.yml` se déclenche sur
chaque push touchant ce dossier, envoie le contenu à `/api/scraper/ingest-events`,
puis supprime le fichier traité.

Format attendu :
```json
{"events": [{"title": "...", "category": "conference", "date": "2026-09-01", ...}], "tokensUsed": 189000}
```
