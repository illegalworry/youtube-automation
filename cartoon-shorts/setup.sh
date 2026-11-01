#!/usr/bin/env bash
# One-shot setup for a fresh session: dependencies + reference frames for the cartoon-3d-short skill.
set -euo pipefail
cd "$(dirname "$0")"
npm ci
pip install -q -r requirements.txt
REF=../.claude/skills/cartoon-3d-short/references
if [ ! -d "$REF/frames" ]; then
  tmp=$(mktemp -d)
  git clone -q --depth 1 https://github.com/mromidev/claude-animated-shorts "$tmp/src"
  cp -r "$tmp/src/references/frames" "$tmp/src/references/sheets" "$REF/"
  rm -rf "$tmp"
fi
echo "cartoon-shorts ready"
