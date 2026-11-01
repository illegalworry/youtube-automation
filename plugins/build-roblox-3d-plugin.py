"""plugins/build-roblox-3d-plugin.py — sync the tested studio into the plugin kit, regenerate tools/verify_kit.py and zip the plugin.

  python plugins/build-roblox-3d-plugin.py        -> plugins/roblox-3d-studio/skills/make-3d-video/kit/  +  plugins/roblox-3d-studio.zip
Source of truth: roblox-3d-studio/ (engine, tools, audio, render.mjs, …) and its reference project projects/max-i-telefon.
"""
import hashlib, os, shutil, subprocess, zipfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIO = os.path.join(ROOT, "roblox-3d-studio"); PLUG = os.path.join(ROOT, "plugins", "roblox-3d-studio"); KIT = os.path.join(PLUG, "skills", "make-3d-video", "kit")
FILES = ["render.mjs", "player.html", "package.json", "package-lock.json"]
DIRS = ["engine", "tools", "audio"]
EXAMPLE = ("projects/max-i-telefon", "examples/max-i-telefon")
shutil.rmtree(KIT, ignore_errors=True); os.makedirs(KIT)
for f in FILES: shutil.copy2(os.path.join(STUDIO, f), os.path.join(KIT, f))
for d in DIRS: shutil.copytree(os.path.join(STUDIO, d), os.path.join(KIT, d), ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "verify_kit.py"))
src, dst = os.path.join(STUDIO, EXAMPLE[0]), os.path.join(KIT, EXAMPLE[1])
shutil.copytree(src, dst, ignore=shutil.ignore_patterns("build", "out", "*.wav"))
# the example's voiceover ships as a small mp3
wav = os.path.join(src, "input", "voiceover.wav")
if os.path.exists(wav):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", wav, "-ac", "1", "-b:a", "64k", os.path.join(dst, "input", "voiceover.mp3")], check=True)
    import json; cp = os.path.join(dst, "config.json"); c = json.load(open(cp, encoding="utf-8")); c["voiceover"] = "input/voiceover.mp3"; json.dump(c, open(cp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# verify_kit.py with the hashes of exactly these files
def h(p): return hashlib.sha256(open(p, "rb").read().replace(b"\r\n", b"\n").strip()).hexdigest()[:16]
rels = []
for base, _, fs in os.walk(KIT):
    for f in fs:
        rel = os.path.relpath(os.path.join(base, f), KIT).replace("\\", "/")
        if rel.endswith((".mp3", ".wav")) or rel == "package-lock.json": continue
        rels.append(rel)
exp = "\n".join(f'    "{r}": "{h(os.path.join(KIT, r))}",' for r in sorted(rels))
open(os.path.join(KIT, "tools", "verify_kit.py"), "w", encoding="utf-8").write(f'''"""tools/verify_kit.py — confirm every Roblox 3D Studio file was copied exactly (run right after installing).

  python tools/verify_kit.py
Prints MISMATCH/MISSING for any file that differs from the tested version; copy those files again from the plugin kit folder.
(Line endings and leading/trailing blank lines are ignored. Files you customise later will of course differ.)
"""
import hashlib, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXPECTED = {{
{exp}
}}
bad = 0
for rel, want in EXPECTED.items():
    p = os.path.join(ROOT, *rel.split("/"))
    if not os.path.exists(p):
        print(f"MISSING   {{rel}}"); bad += 1; continue
    got = hashlib.sha256(open(p, "rb").read().replace(b"\\r\\n", b"\\n").strip()).hexdigest()[:16]
    if got != want:
        print(f"MISMATCH  {{rel}}"); bad += 1
print(f"{{len(EXPECTED) - bad}}/{{len(EXPECTED)}} files verified." + ("" if not bad else "  Copy the files listed above again from the plugin's kit folder, then run this again."))
sys.exit(1 if bad else 0)
''')
shutil.copy2(os.path.join(KIT, "tools", "verify_kit.py"), os.path.join(STUDIO, "tools", "verify_kit.py"))
# zip
z = os.path.join(ROOT, "plugins", "roblox-3d-studio.zip")
with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
    for base, _, fs in os.walk(PLUG):
        for f in fs:
            p = os.path.join(base, f); zf.write(p, os.path.relpath(p, PLUG))
print(f"kit: {len(rels)} files verified-set, zip: {z} ({os.path.getsize(z) // 1024} KB)")
