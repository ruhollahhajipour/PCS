#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# PCS Artifact Updater
# Rebuilds pcs-changes.html from git log after every commit.
# Run manually:  bash tools/update_artifacts.sh
# Called by:     .git/hooks/post-commit
# ─────────────────────────────────────────────────────────
set -e

REPO_ROOT="$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)"
SCRATCHPAD="/tmp/claude-0/-home-claude/4cb18274-93e9-5da7-822c-243a52f415b5/scratchpad"
CHANGES_HTML="$SCRATCHPAD/pcs-changes.html"

echo "🔄  Rebuilding PCS Changes page…"
python3 "$REPO_ROOT/tools/build_changes_page.py" "$CHANGES_HTML"
echo "✅  Written → $CHANGES_HTML"
echo ""
echo "⚠️  Open Claude and republish to sync the artifact:"
echo "    Artifact URL: https://claude.ai/artifact/SthTsAbwjVXuxVL1KHUYd2"
