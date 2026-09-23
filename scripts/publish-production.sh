#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# This script can trigger a production deployment. Approval must follow the
# external checklist; passing a local build alone never authorizes publishing.
if [[ "${ALWASIL_RELEASE_APPROVED:-}" != "1" ]]; then
  echo "Publication bloquée : valider d'abord la checklist de release et les services externes."
  echo "Aucun commit ni push effectué. Voir docs/RELEASE_READINESS_2026-09-22.md."
  exit 1
fi

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Publication annulée : la branche active doit être main."
  exit 1
fi

echo "1/4 — Vérification du code"
git diff --check
npm run test
npm run build
node --env-file=.env.local scripts/production-readiness.mjs

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
