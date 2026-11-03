"""tools/verify_kit.py — confirm every studio file was written exactly (run right after installing).

  python tools/verify_kit.py
Prints MISMATCH/MISSING for any file that differs from the tested version; copy those files again from the plugin kit folder.
(Line endings and leading/trailing blank lines are ignored. Files you customise later, e.g. engine/styles.js, will of course differ.)
"""
import hashlib, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPECTED = {
    "audio/dsp.py": "589d305d94d8acc3",
    "audio/mix.py": "8e04e11a790020f2",
    "audio/music.py": "a21486a718eb55c7",
    "audio/sfx.py": "01fd5c58b87b3f76",
    "engine/core.js": "5d8857bd629bb57a",
    "engine/fx2d.js": "d09f93f6d44366fa",
    "engine/gameui.js": "aa2ee2fc4ee3fd4a",
    "engine/hero.js": "baaea12b7868ea20",
    "engine/motion.js": "274ef93daa740a41",
    "engine/player.js": "f94c5e411f04fdd5",
    "engine/rig2d.js": "ec2a665e0aa8ffed",
    "engine/styles.js": "90cacdccfa906843",
    "engine/three-kit.js": "02e249e302b95420",
    "engine/ui2d.js": "babd2978a5d2a6db",
    "engine/worldsets.js": "53676146e91b13bf",
    "examples/whole-town/config.json": "f6ca89f354b4036f",
    "examples/whole-town/scenes/cast.js": "8c998828f651604f",
    "examples/whole-town/scenes/shots/01_opening.js": "84cf8d26c353d43b",
    "examples/whole-town/scenes/shots/02_rules.js": "65dc7160abc77cbc",
    "examples/whole-town/story/script.txt": "47d94cd107516430",
    "examples/whole-town/story/shots.json": "08011ec11e024206",
    "examples/whole-town/timeline/words.json": "f90ed95b4a84acda",
    "package.json": "4f6c3cca3feb2875",
    "player.html": "5ffdd7da4a48cd4b",
    "render.mjs": "1418d4c14f7137e5",
    "tools/beats.py": "eb42a8aef4d87584",
    "tools/common.py": "e237321f2f12416e",
    "tools/doctor.py": "541d02f8e2e14f70",
    "tools/new_project.py": "f1aaa1f3a5990813",
    "tools/parse_script.py": "5163cf3162b2579b",
    "tools/pick_world.py": "3f5a976fa25eac68",
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
