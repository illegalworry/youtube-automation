#!/usr/bin/env bash
# Install and start VoiceStudio (CPU) and recreate the owner's cloned voice profile.
# Idempotent: safe to run again in the same session.
# Usage: bash .claude/skills/q2d/setup.sh
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
VS_DIR="${VS_DIR:-$HOME/VoiceStudio}"
API="${VS_API:-http://localhost:3900}"
LOG="${VS_LOG:-$HOME/voicestudio-backend.log}"
STATE="$HOME/.q2d-profile-id"

log() { printf '[q2d] %s\n' "$*" >&2; }

# 1. Source checkout
if [ ! -d "$VS_DIR/.git" ]; then
  log "Cloning VoiceStudio into $VS_DIR"
  git clone --depth 1 https://github.com/debpalash/VoiceStudio "$VS_DIR"
fi

# 2. Backend running?
if ! curl -sf "$API/health" >/dev/null 2>&1; then
  if [ ! -d "$VS_DIR/.venv" ]; then
    log "Installing backend dependencies (several minutes)"
    (cd "$VS_DIR" && node scripts/setup-api.mjs) >"$HOME/voicestudio-setup.log" 2>&1 \
      || { log "setup failed, see $HOME/voicestudio-setup.log"; exit 1; }
  fi
  log "Starting backend (log: $LOG)"
  (cd "$VS_DIR" && setsid nohup bun scripts/dev-backend.mjs >"$LOG" 2>&1 < /dev/null &)
  for _ in $(seq 1 100); do curl -sf "$API/health" >/dev/null 2>&1 && break; sleep 3; done
  curl -sf "$API/health" >/dev/null || { log "backend did not start, see $LOG"; exit 1; }
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
    print(f"[q2d] accepted licence: {m['repo_id']} ({m['license']})", file=sys.stderr)
PY
fi
rm -f "$probe"

# 4. Voice profile
pid=""
[ -f "$STATE" ] && pid="$(cat "$STATE")"
if [ -z "$pid" ] || ! curl -sf "$API/profiles/$pid" >/dev/null 2>&1; then
  log "Creating voice profile 'Q2D'"
  pid=$(curl -sf "$API/profiles" -F name="Q2D" -F ref_audio=@"$HERE/voice/ref.wav" \
        -F ref_text="$(cat "$HERE/voice/ref.txt")" -F language=English -F kind=clone \
        | python3 -c 'import json,sys;print(json.load(sys.stdin)["id"])')
  curl -sf "$API/profiles/$pid/attestation" -H 'Content-Type: application/json' -d '{"basis":"own_voice"}' >/dev/null
  echo "$pid" >"$STATE"
fi
log "Profile ID: $pid"
echo "$pid"
