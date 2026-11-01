"""tools/auto_sfx.py — place sound effects on the animation automatically (footsteps, whooshes, hits, landings, pops).

  node render.mjs --project projects/<slug> --events      # 1) export exact action timings -> build/events.json
  python tools/auto_sfx.py --project projects/<slug>      # 2) write story/shots.json "sfx" (global cues, marked auto)

Re-running replaces only the cues marked "auto"; hand-placed shot "sfx" and story cues without "auto" are kept.
Options: --no-steps (skip footsteps), --gain DB (shift every auto cue).
"""
import argparse, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import load_json, save_json

ap = argparse.ArgumentParser(); ap.add_argument("--project", required=True); ap.add_argument("--no-steps", action="store_true"); ap.add_argument("--gain", type=float, default=0)
a = ap.parse_args()
ev_path = os.path.join(a.project, "build", "events.json")
if not os.path.exists(ev_path): sys.exit(f"{ev_path} missing — run: node render.mjs --project {a.project} --events")
events = load_json(ev_path); story_path = os.path.join(a.project, "story", "shots.json"); story = load_json(story_path)
dur = story.get("duration") or story["shots"][-1]["end"]
# a scene's actions only sound while one of its shots is on screen
win = {}
for s in story["shots"]: win.setdefault(s.get("scene"), []).append((s["start"], s["end"]))
def visible(scene, t): return t is not None and any(s0 <= t < s1 for s0, s1 in win.get(scene, []))
cues = []
def cue(t, name, gain, scene, **kw):
    if visible(scene, t) and 0 <= t < dur: cues.append({"t": round(t, 3), "name": name, "gain": gain + a.gain, "auto": True, **kw})
STEP = {"walk": -20, "run": -15, "sprint": -13, "sneak": -24, "scaredRun": -15, "backstep": -22, "climb": -22}
for e in events:
    sc = e.get("scene")
    if e["type"] == "move" and e["do"] in STEP and not a.no_steps:
        n = max(1, int(e["dist"] / (e["stride"] / 2))); span = e["t1"] - e["t0"]
        for i in range(n): cue(e["t0"] + (i + 0.5) * span / n, "footstep", STEP[e["do"]], sc, seed=i % 5)
    if e["type"] != "act": continue
    d, t, im = e["do"], e["t"], e.get("impact")
    if d in ("punch", "uppercut", "slash", "kick", "push"):
        cue((im or t) - 0.12, "swish", -10, sc)
        if e.get("target"): cue(im, "impact" if d in ("kick", "uppercut") else "hit", -5, sc)
    elif d == "jump": cue(t + 0.25, "swish", -14, sc); cue(im, "footstep", -10, sc)
    elif d in ("fall", "faceplant", "knockback"): cue(im, "impact", -8, sc)
    elif d == "hit": pass
    elif d == "throw": cue(e.get("release"), "whoosh", -10, sc)
    elif d == "highFive": cue(im, "hit", -10, sc, pitch=1.6)
    elif d == "oof": cue(t, "pop", -6, sc); cue(t + 0.05, "hit", -10, sc, pitch=0.7)
    elif d in ("cheer", "victory", "celebrate"): cue(t, "ding", -14, sc)
    elif d == "spin": cue(t, "whoosh", -12, sc)
    elif d == "pickUp": cue(t + 0.45, "pop", -16, sc)
for e in events:
    if e["type"] == "fx": cue(e.get("t"), {"confetti": "pop", "explosion": "impact", "sparkle": "shimmer", "coins": "ding", "hearts": "shimmer", "flash": "flash"}.get(e["fx"], "pop"), -10, e.get("scene"))
for s in story["shots"]:   # designed transitions get a whoosh
    tr = (s.get("in") or {}).get("type")
    if tr in ("whip", "push"): cues.append({"t": round(max(0, s["start"] - 0.05), 3), "name": "whoosh", "gain": -11 + a.gain, "auto": True})
cues.sort(key=lambda c: c["t"])
# thin out: never more than 3 cues within 60 ms
thin = []
for c in cues:
    if sum(1 for x in thin[-4:] if abs(x["t"] - c["t"]) < 0.06) < 3: thin.append(c)
story["sfx"] = [c for c in story.get("sfx", []) or [] if not c.get("auto")] + thin
save_json(story_path, story)
kinds = {}
for c in thin: kinds[c["name"]] = kinds.get(c["name"], 0) + 1
print(f"auto sfx: {len(thin)} cue(s) — " + ", ".join(f"{k}×{v}" for k, v in sorted(kinds.items())))
