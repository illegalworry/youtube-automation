"""tools/verify_kit.py — confirm every studio file was written exactly (run right after installing).

  python tools/verify_kit.py
Prints MISMATCH/MISSING for any file that differs from the tested version; copy those files again from the plugin kit folder.
(Line endings and leading/trailing blank lines are ignored. Files you customise later, e.g. engine/styles.js, will of course differ.)
"""
import hashlib, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPECTED = {
    "audio/dsp.py": "589d305d94d8acc3",
    "audio/mix.py": "13cf769488fe76b7",
    "audio/music.py": "2fb3ce1df2fe5c7d",
    "audio/sfx.py": "2fa56141e2423718",
    "engine/core.js": "7dd9558586582ff6",
    "engine/fx2d.js": "d09f93f6d44366fa",
    "engine/glow.js": "8b2f7d41bf08271b",
    "engine/glowsets.js": "0f81b79f3af0626b",
    "engine/glowui.js": "ae5ac16955a00517",
    "engine/motion.js": "274ef93daa740a41",
    "engine/player.js": "f1668f521dc74782",
    "engine/rig2d.js": "ec2a665e0aa8ffed",
    "engine/styles.js": "0d3cb18573d912a0",
    "engine/three-kit.js": "d61f2689483ed615",
    "engine/ui2d.js": "babd2978a5d2a6db",
    "examples/honesty-box/config.json": "c6be17a4e4db6e14",
    "examples/honesty-box/scenes/cast.js": "6971f2166a127c77",
    "examples/honesty-box/scenes/shots/01_porch.js": "1baec49d9dacac3f",
    "examples/honesty-box/scenes/shots/02_office.js": "21fc30d49292722a",
    "examples/honesty-box/scenes/shots/03_outdoor.js": "a93d6b8a241c16a8",
    "examples/honesty-box/story/bible.md": "874bc7c0ffa10b12",
    "examples/honesty-box/story/shots.json": "c242bf93cdbd85d4",
    "package.json": "2e3eb13d070d5afe",
    "player.html": "5ffdd7da4a48cd4b",
    "render.mjs": "e9bec4ed674effdb",
    "tools/beats.py": "eb42a8aef4d87584",
    "tools/common.py": "e237321f2f12416e",
    "tools/doctor.py": "d4aa2d2c12418031",
    "tools/new_project.py": "6c91fcf6420b35dc",
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
