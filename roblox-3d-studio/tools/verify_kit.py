"""tools/verify_kit.py — confirm every Roblox 3D Studio file was copied exactly (run right after installing).

  python tools/verify_kit.py
Prints MISMATCH/MISSING for any file that differs from the tested version; copy those files again from the plugin kit folder.
(Line endings and leading/trailing blank lines are ignored. Files you customise later will of course differ.)
"""
import hashlib, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPECTED = {
    "audio/dsp.py": "589d305d94d8acc3",
    "audio/mix.py": "7b0fd7f74327404f",
    "audio/music.py": "2fb3ce1df2fe5c7d",
    "audio/sfx.py": "2fa56141e2423718",
    "engine/anim.js": "e38c987f9ed5bfc5",
    "engine/avatar.js": "a6929c672d5d4736",
    "engine/camera3d.js": "47a90d19bb8bc8d4",
    "engine/core.js": "ea052c1714c41f71",
    "engine/director.js": "c39072a17e3976b3",
    "engine/faces.js": "dc964645e947299a",
    "engine/fx3d.js": "002e054cae73f570",
    "engine/items.js": "f434c2b0ea9af295",
    "engine/looks.js": "5724bfd777972e74",
    "engine/player.js": "cd31be4089a03380",
    "engine/r3d.js": "a6b183fff097b00d",
    "engine/sets-extra.js": "bc0be5839e8129d2",
    "engine/ui.js": "410d937924710c9d",
    "engine/world.js": "5414a804a35adb26",
    "examples/max-i-telefon/config.json": "d340611db18f4d64",
    "examples/max-i-telefon/input/script.txt": "f9c68a8239231b28",
    "examples/max-i-telefon/scenes/cast.js": "1cac7e833d5d73ae",
    "examples/max-i-telefon/story/shots.json": "1d0ed3e1d547211f",
    "examples/max-i-telefon/timeline/beats.json": "a77d36480452d6f6",
    "examples/max-i-telefon/timeline/sentences.json": "c4882c533e971565",
    "examples/max-i-telefon/timeline/transcript.txt": "cde406337f7be361",
    "examples/max-i-telefon/timeline/words.json": "87f929ccf0adf592",
    "package.json": "d2fdeb9781aa58c1",
    "player.html": "5ffdd7da4a48cd4b",
    "render.mjs": "3fea055e5d45196d",
    "tools/auto_sfx.py": "2902880450649fd2",
    "tools/beats.py": "1032c7806d6e0143",
    "tools/common.py": "e237321f2f12416e",
    "tools/doctor.py": "fefdb25e529d777c",
    "tools/new_project.py": "9ff6f711feaed31c",
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
