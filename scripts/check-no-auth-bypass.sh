#!/usr/bin/env bash
# Fails if the preview-only authentication bypass flag appears in source.
set -euo pipefail
if git grep -n "__PCS_PREVIEW_AUTH_BYPASS__" -- frontend/src frontend/vite.config.ts frontend/index.html; then
  echo "ERROR: preview auth bypass flag found. It must never ship in this branch." >&2
  exit 1
fi
echo "OK: no preview auth bypass flag."
