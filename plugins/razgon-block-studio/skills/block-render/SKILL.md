---
name: block-render
description: "This skill should be used when the user runs /block-render or asks to \"build the scenes\", \"check the shots\", \"show me a contact sheet\", \"preview the video\", \"render the video\", \"render in 4K / 9:16\", \"re-render after a fix\", or \"export the final MP4\" for a Razgon Block Studio project. It writes or repairs shot code in batches with contact-sheet QC, makes preview clips, runs the full frame-by-frame render, and muxes the final video with sound."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /block-render: build → check → preview → final

Work inside `razgon-block-studio/`. Read `../make-block-video/references/engine-api.md`, `style-bible.md`, `retention-playbook.md`, `director-pass.md` and `render-qc.md` once, and look at `examples/whole-town/scenes/`.

## Build in batches of 8–12 shots
1. Missing ids: `node render.mjs --project projects/<slug> --sheet --scale 0.5` marks them `(MISSING)`.
2. Write `scenes/sets/*.js` (from `worldsets.js` pieces) and `scenes/shots/NN_*.js` with `drawHero`/`bigHero`, `gameui.js` cards synced with `wordTime()`, `camPath` moves, `impact` on hits, `look` and transitions in shots.json.
3. Re-render the sheet, open every PNG, run the QC checklist; fix errors printed by the renderer.
4. `--stills` inside each `rewind`/`pop`/`glitch`/`whip` and each `look` change; `--from A --to B --scale 0.5` for motion.

## Preview, final, mix
- Preview: `node render.mjs --project projects/<slug> --from 0 --to 30 --scale 0.5` → `build/preview.mp4`; show the user.
- Final: `node render.mjs --project projects/<slug> [--workers N] [--format jpeg]` (background for long videos; share the ETA).
- Sound: `python audio/mix.py --project projects/<slug>` → `out/<title>.mp4`.
- QC: duration, audio stream, a 1-frame-per-10-s sheet (`ffmpeg -i out.mp4 -vf fps=1/10,scale=320:-1,tile=6x5 sheet.png`), transitions in motion. Send the MP4.
If Playwright's Chromium is missing, run with `CHROMIUM_PATH=/path/to/chrome`.
