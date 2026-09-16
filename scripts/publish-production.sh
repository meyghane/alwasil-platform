#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Publication annulée : la branche active doit être main."
  exit 1
fi

echo "1/4 — Vérification du code"
git diff --check
npm run build

echo "2/4 — Préparation du commit"
git add -u
git add src public package.json scripts/publish-production.sh DIRECTION_ARTISTIQUE.md

if git diff --cached --quiet; then
  echo "Aucune modification à publier."
  exit 0
fi

message="${1:-Publish Al-Wasil updates}"

echo "3/4 — Création du commit"
git commit -m "$message"

echo "4/4 — Envoi sur GitHub"
git push origin main

echo "Publication envoyée. Vercel va construire automatiquement la production."
