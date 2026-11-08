#!/usr/bin/env bash
# Install and start VoiceStudio (CPU) and create a profile for every voice in voices/<NAME>/.
# Idempotent: safe to run again in the same session.
# Usage: bash .claude/skills/voices/setup.sh
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
VS_DIR="${VS_DIR:-$HOME/VoiceStudio}"
API="${VS_API:-http://localhost:3900}"
LOG="${VS_LOG:-$HOME/voicestudio-backend.log}"
STATE="$HOME/.voice-profiles"   # one "NAME ID" per line

log() { printf '[voices] %s\n' "$*" >&2; }

# 1. Source checkout
if [ ! -d "$VS_DIR/.git" ]; then
  log "Cloning VoiceStudio into $VS_DIR"
  git clone --depth 1 https://github.com/debpalash/VoiceStudio "$VS_DIR"
fi

# 2. Backend running?
if ! curl -sf -m 5 "$API/health" >/dev/null 2>&1; then
  if [ ! -d "$VS_DIR/.venv" ]; then
    log "Installing backend dependencies (several minutes)"
    (cd "$VS_DIR" && node scripts/setup-api.mjs) >"$HOME/voicestudio-setup.log" 2>&1 \
      || { log "setup failed, see $HOME/voicestudio-setup.log"; exit 1; }
  fi
  log "Starting backend (log: $LOG)"
  (cd "$VS_DIR" && setsid nohup bun scripts/dev-backend.mjs >"$LOG" 2>&1 < /dev/null &)
  for _ in $(seq 1 100); do curl -sf -m 5 "$API/health" >/dev/null 2>&1 && break; sleep 3; done
  curl -sf -m 5 "$API/health" >/dev/null || { log "backend did not start, see $LOG"; exit 1; }
fi
log "Backend: $(curl -s "$API/health")"

# 3. Licences (owner accepted OmniVoice CC-BY-NC + higgs tokenizer on 2026-11-08).
#    Read the current fingerprints from the 403 the speech route returns, then accept them.
probe="$(mktemp)"
code=$(curl -s -o "$probe" -w '%{http_code}' "$API/v1/audio/speech" -H 'Content-Type: application/json' \
  -d '{"model":"tts-1","voice":"alloy","input":"Hi.","response_format":"wav"}')
if [ "$code" = 403 ]; then
  python3 - "$probe" "$API" <<'PY'
import json, sys, urllib.request
body = json.load(open(sys.argv[1]))
for m in body.get("detail", {}).get("models", []):
    req = urllib.request.Request(sys.argv[2] + "/models/licenses/accept", method="POST",
        data=json.dumps({"repo_id": m["repo_id"], "fingerprint": m["fingerprint"], "accepted": True}).encode(),
        headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req).read()
    print(f"[voices] accepted licence: {m['repo_id']} ({m['license']})", file=sys.stderr)
PY
fi
rm -f "$probe"

# 4. One profile per voice folder
touch "$STATE"
for dir in "$HERE"/voices/*/; do
  name="$(basename "$dir")"
  pid="$(awk -v n="$name" '$1==n{print $2}' "$STATE")"
  if [ -n "$pid" ] && curl -sf "$API/profiles/$pid" >/dev/null 2>&1; then
    log "$name -> $pid"; continue
  fi
  lang="$(cat "$dir/lang" 2>/dev/null || echo Auto)"
  pid=$(curl -sf "$API/profiles" -F name="$name" -F ref_audio=@"$dir/ref.wav" \
        -F ref_text="$(cat "$dir/ref.txt")" -F language="$lang" -F kind=clone \
        | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')
  basis="$(cat "$dir/basis" 2>/dev/null || echo own_voice)"
  curl -sf "$API/profiles/$pid/attestation" -H 'Content-Type: application/json' -d "{\"basis\":\"$basis\"}" >/dev/null
  { grep -v "^$name " "$STATE" || true; echo "$name $pid"; } >"$STATE.tmp" && mv "$STATE.tmp" "$STATE"
  log "$name -> $pid (created)"
done
cat "$STATE"
