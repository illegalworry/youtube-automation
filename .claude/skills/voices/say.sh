#!/usr/bin/env bash
# Speak text in one of the library voices. Supports inline tags ([laughter], [pause 1s], [slow]...[/slow]).
# Usage: bash .claude/skills/voices/say.sh NAME "text" out.wav [language]
#        bash .claude/skills/voices/say.sh NAME @script.txt out.wav [language]
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
API="${VS_API:-http://localhost:3900}"
STATE="$HOME/.voice-profiles"
name="${1:?voice NAME required (see voices/)}"; text="${2:?text or @file required}"; out="${3:?output .wav required}"
lang="${4:-$(cat "$HERE/voices/$name/lang" 2>/dev/null || echo Auto)}"

pid="$(awk -v n="$name" 'toupper($1)==toupper(n){print $2}' "$STATE" 2>/dev/null || true)"
[ -n "$pid" ] || { echo "Unknown voice '$name'. Known: $(ls "$HERE/voices" | tr '\n' ' '). Run setup.sh first." >&2; exit 1; }
[ "${text:0:1}" = "@" ] && text="$(cat "${text:1}")"

code=$(curl -s -o "$out" -w '%{http_code}' --max-time 3600 "$API/generate" \
  -F text="$text" -F profile_id="$pid" -F language="$lang")
if [ "$code" != 200 ] || ! ffprobe -v error "$out" >/dev/null 2>&1; then
  echo "Generation failed (HTTP $code):" >&2; head -c 1000 "$out" >&2; echo >&2; exit 1
fi
printf '%s  %s  %ss\n' "$name" "$out" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")"
