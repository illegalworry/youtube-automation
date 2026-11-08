#!/usr/bin/env bash
# Speak text in the owner's cloned voice. Supports inline tags ([laughter], [pause 1s], [slow]...[/slow]).
# Usage: bash .claude/skills/q2d/say.sh "text" out.wav [language]
#        bash .claude/skills/q2d/say.sh @script.txt out.wav [language]
set -euo pipefail

API="${VS_API:-http://localhost:3900}"
STATE="$HOME/.q2d-profile-id"
text="${1:?text or @file required}"; out="${2:?output .wav required}"; lang="${3:-English}"
[ -f "$STATE" ] || { echo "Run setup.sh first" >&2; exit 1; }
[ "${text:0:1}" = "@" ] && text="$(cat "${text:1}")"

code=$(curl -s -o "$out" -w '%{http_code}' --max-time 3600 "$API/generate" \
  -F text="$text" -F profile_id="$(cat "$STATE")" -F language="$lang")
if [ "$code" != 200 ] || ! ffprobe -v error "$out" >/dev/null 2>&1; then
  echo "Generation failed (HTTP $code):" >&2; head -c 1000 "$out" >&2; echo >&2; exit 1
fi
printf '%s  %ss\n' "$out" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")"
