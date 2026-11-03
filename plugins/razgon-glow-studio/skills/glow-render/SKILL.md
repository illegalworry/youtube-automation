---
name: glow-render
description: "This skill should be used when the user runs /glow-render or asks to \"build the scenes\", \"check the shots\", \"show me a contact sheet\", \"preview the video\", \"render the video\", \"render in 4K / 9:16\", \"re-render after a fix\", or \"export the final MP4\" for a Razgon Glow Studio project. It writes or repairs shot code in batches with contact-sheet QC, makes preview clips, runs the full frame-by-frame render, and muxes the final video with sound.
"
metadata:
  version: "1.0.0"
  author: Razgon
---

# /glow-render: build, QC, preview and final render

Work inside `razgon-glow-studio/` on the active project (`projects/<slug>`; if several exist, ask which one). Shared references are in `../make-glow-video/references/` relative to this skill's base directory. Read `engine-api.md`, `style-bible.md`, `director-pass.md` and `render-qc.md` before writing or fixing scenes.

## 1. Build or repair shots (batches of 8–12)
- List what's missing: `node render.mjs --project projects/<slug> --sheet --scale 0.4`. The console lists MISSING shots and shot errors, and `build/sheets/sheet_XX.png` shows one still per shot.
- Write `scenes/sets/*.js` and `scenes/shots/NN_name.js` (`registerShot(id, …)` for each shot id). Start from the ready-made sets in `engine/glowsets.js`; study `examples/honesty-box/scenes/` for working patterns (porch, office, close-up over a blurred set, invisible outline, pills and the study card).
- After each batch, re-run the sheet and **open every sheet PNG** against the QC checklist in `render-qc.md`. Fix and repeat until there are no MISSING or ERROR frames and every shot passes.
- Check every non-cut transition and every impact with `--stills` at 2–3 moments inside it (director-pass.md §8).
- To check motion, use `--stills t1,t2,t3` (several moments of one shot) or `--from A --to B --scale 0.5` (writes `build/preview.mp4`).

## 2. Preview checkpoint
Render `node render.mjs --project projects/<slug> --from 0 --to 30 --scale 0.5` and send the user the preview, or the contact sheets, before the long render. Mention the expected render time (speed guide in `render-qc.md`: frames = seconds × 24; the 24 s example renders at ~6 frames/s at 360p preview size on 4 CPU threads, 1080p is ~4× slower per frame, 4K ~16×, desktops with a GPU are faster).

## 3. Final render
- To change resolution or aspect, edit `projects/<slug>/config.json` (`resolution`, `aspect`). Switching aspect needs a fresh sheet review, because 9:16 framing differs.
- Run `node render.mjs --project projects/<slug> [--workers N] [--format jpeg]` and run it in the background for anything over a minute or two: `nohup node render.mjs --project projects/<slug> > build/render.log 2>&1 &`. Poll the log and report progress and ETA at sensible intervals.
- Use fewer workers if memory is tight (about 1–1.5 GB each at 1080p, more at 4K). With no GPU, add `--gl swiftshader` (already the Linux default).
- Output: `build/video_silent.mp4`. The end of the log lists any shot errors. Fix them and re-render if there are any.

## 4. Sound, mux and deliver
Make sure the music plan and SFX are set (see `/glow-sound`). If Chromium had to come from a pre-installed path, keep the `CHROMIUM_PATH=…` prefix on every render command, then run `python audio/mix.py --project projects/<slug>`, which writes `out/<title>.mp4`. QC: `ffprobe` duration ≈ `story/shots.json` duration, an audio stream is present, and a contact sheet of the final file (`ffmpeg -i out/<file>.mp4 -vf fps=1/10,scale=320:-1,tile=6x5 -frames:v 1 build/final_sheet.png`) looks right. Send the MP4 to the user and say in plain words where it was saved.
