---
name: new-3d-video
description: "This skill should be used when the user runs /new-3d-video or asks to \"start a new Roblox 3D video\", \"set up a 3D animation from this voiceover\", \"timestamp my voiceover for the 3D video\", \"break my script into 3D scenes\" or \"plan the shots / cast / locations\" in Roblox 3D Studio. It covers intake, installing or checking the studio, creating the project, word timestamps (Whisper or a timestamped script) and the script → scenes → shots breakdown with cast and sets."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /new-3d-video: intake → studio → timeline → scenes and shots

This covers stages 1–4 of the `make-3d-video` pipeline. Shared docs are in `../make-3d-video/references/` and the kit is in `../make-3d-video/kit/` (paths relative to this skill's base directory).

1. **Intake:** run the `make-3d-video` SKILL.md "Intake" questions (voiceover is required).
2. **Studio:** if `roblox-3d-studio/render.mjs` is missing, follow `install.md` in full. Otherwise run `python tools/doctor.py`.
3. **Project and timeline:** run `new_project.py` → `transcribe.py` (or `parse_script.py`) → `beats.py`, exactly as in `make-3d-video` Stage 3. Confirm `timeline/transcript.txt` reads correctly.
4. **Breakdown:**
   1. Read `story-to-scenes.md`, `characters.md`, `actions.md`, `camera.md` and `sets-props-fx.md`.
   2. Run `node render.mjs --project projects/<slug> --catalog`.
   3. Write `story/bible.md`, `scenes/cast.js` and `story/shots.json` (scenes + shots + music).
   4. Render a first `--sheet --quality draft --scale 0.5` and fix obvious problems.
   5. Send the user a 5–10 line summary plus the sheet.

Next step: `/render-3d-video` (or continue with `make-3d-video` if the user asked for the whole video).
