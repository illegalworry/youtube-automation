"""tools/verify_kit.py — confirm every studio file was written exactly (run right after installing).

  python tools/verify_kit.py
Prints MISMATCH/MISSING for any file that differs from the tested version; copy those files again from the plugin kit folder.
(Line endings and leading/trailing blank lines are ignored. Files you customise later, e.g. engine/styles.js, will of course differ.)
"""
import hashlib, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPECTED = {
    "audio/dsp.py": "589d305d94d8acc3",
    "audio/mix.py": "7b0fd7f74327404f",
    "audio/music.py": "2fb3ce1df2fe5c7d",
    "audio/sfx.py": "2fa56141e2423718",
    "engine/core.js": "005118e1c6f08402",
    "engine/fx2d.js": "d09f93f6d44366fa",
    "engine/motion.js": "274ef93daa740a41",
    "engine/player.js": "56c7175ca828476b",
    "engine/rig2d.js": "ec2a665e0aa8ffed",
    "engine/styles.js": "7aaddb13295efb4e",
    "engine/three-kit.js": "02e249e302b95420",
    "engine/toon.js": "3b6dd5e866786e8f",
    "engine/toonsets.js": "4ac52f48313e861b",
    "engine/toonui.js": "720ac6c2a3d34e30",
    "engine/ui2d.js": "babd2978a5d2a6db",
    "examples/dollar-show/config.json": "7ad759b84c31ac04",
    "examples/dollar-show/scenes/cast.js": "339d541db4b8c54f",
    "examples/dollar-show/scenes/sets/props.js": "6218c8067d8d1371",
    "examples/dollar-show/scenes/shots/01_school.js": "25c136afb65f549b",
    "examples/dollar-show/scenes/shots/02_garage.js": "d42b356024f4cba4",
    "examples/dollar-show/scenes/shots/03_backyard.js": "973f380a12edcb02",
    "examples/dollar-show/scenes/shots/04_ring_parking.js": "8e8a03a51b02ab70",
    "examples/dollar-show/story/bible.md": "04d0f111be51ec9c",
    "examples/dollar-show/story/shots.json": "fd80061c6a0a9349",
    "package.json": "7cd48acde78ec9f3",
    "player.html": "5ffdd7da4a48cd4b",
    "render.mjs": "1418d4c14f7137e5",
    "tools/beats.py": "eb42a8aef4d87584",
    "tools/common.py": "e237321f2f12416e",
    "tools/doctor.py": "c0ef32e88d3cbabc",
    "tools/new_project.py": "473c2e05a6a07f38",
    "tools/parse_script.py": "5163cf3162b2579b",
    "tools/transcribe.py": "ecd48d05a6655d13",
}
bad = 0
for rel, want in EXPECTED.items():
    p = os.path.join(ROOT, *rel.split("/"))
    if not os.path.exists(p):
        print(f"MISSING   {rel}"); bad += 1; continue
    got = hashlib.sha256(open(p, "rb").read().replace(b"\r\n", b"\n").strip()).hexdigest()[:16]
    if got != want:
        print(f"MISMATCH  {rel}"); bad += 1
print(f"{len(EXPECTED) - bad}/{len(EXPECTED)} files verified." + ("" if not bad else "  Copy the files listed above again from the plugin's kit folder, then run this again."))
sys.exit(1 if bad else 0)
