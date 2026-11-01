"""tools/new_project.py — create a project folder for one Roblox-style 3D video.

  python tools/new_project.py --name my-video --voice "C:/path/voiceover.mp3" [--script path] \
      --aspect 16:9|9:16 --resolution 720p|1080p|1440p|2160p [--style bright|cinematic|cartoon|horror|retro] [--fps 24] [--captions]
"""
import argparse, os, shutil, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import probe_duration, save_json

ap = argparse.ArgumentParser()
ap.add_argument("--name", required=True)
ap.add_argument("--voice", required=True)
ap.add_argument("--script")
ap.add_argument("--aspect", default="16:9", choices=["16:9", "9:16"])
ap.add_argument("--resolution", default="1080p", choices=["720p", "1080p", "1440p", "2160p", "4k"])
ap.add_argument("--style", default="bright", choices=["bright", "cinematic", "cartoon", "horror", "retro"])
ap.add_argument("--fps", type=int, default=24)
ap.add_argument("--title", default="")
ap.add_argument("--captions", action="store_true", help="burn word-by-word captions (recommended for 9:16)")
a = ap.parse_args()

root = os.path.join("projects", a.name)
for d in ["input", "timeline", "story", "scenes", "build", "out"]:
    os.makedirs(os.path.join(root, d), exist_ok=True)
voice_dst = os.path.join("input", "voiceover" + os.path.splitext(a.voice)[1].lower())
shutil.copy2(a.voice, os.path.join(root, voice_dst))
script_dst = None
if a.script:
    script_dst = os.path.join("input", "script" + os.path.splitext(a.script)[1].lower())
    shutil.copy2(a.script, os.path.join(root, script_dst))
dur = probe_duration(os.path.join(root, voice_dst))
cfg = {"title": a.title or a.name, "aspect": a.aspect, "resolution": a.resolution, "fps": a.fps, "style": a.style,
       "voiceover": voice_dst.replace("\\", "/"), "script": script_dst.replace("\\", "/") if script_dst else None,
       "duration": round(dur, 3), "captions": bool(a.captions), "bars": None, "fadeIn": 0.4, "fadeOut": 0.8, "quality": "final",
       "music": {"enabled": True, "gainDb": -17}, "sfx": {"enabled": True, "gainDb": -6}, "loudness": -14}
save_json(os.path.join(root, "config.json"), cfg)
cast = os.path.join(root, "scenes", "cast.js")
if not os.path.exists(cast):
    open(cast, "w", encoding="utf-8").write("""// scenes/cast.js — the characters of this video (see references/characters.md for every option)
import { defineCast } from '/engine/director.js';
defineCast({
  hero: { skin: '#f5cd30', face: 'smile', shirt: { color: '#2d7be0', style: 'hoodie' }, pants: { color: '#2b2f3a' }, hair: { style: 'short', color: '#3a2312' } },
});
""")
print(f"created {root}  (voiceover {dur:.1f}s, {a.aspect} {a.resolution} @ {a.fps}fps, style {a.style})")
