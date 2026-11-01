---
name: render-3d-video
description: "This skill should be used when the user runs /render-3d-video or asks to \"build the 3D scenes\", \"check the shots\", \"show me a contact sheet\", \"preview the Roblox video\", \"fix this shot / camera / animation\", \"render the video\", \"render in 1080p / 4K / 9:16\" or \"export the final MP4\" for a Roblox 3D Studio project. It writes and repairs scene code and shot data with contact-sheet QC, makes previews, runs the frame-by-frame render and muxes the final video with sound."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /render-3d-video: build, QC, preview, final render

Work inside `roblox-3d-studio/` on the active project (`projects/<slug>`; ask if there are several). Read `../make-3d-video/references/quality-bar.md`, `camera.md`, `actions.md` and `render-and-sound.md` first.

1. **Build and repair (loop):**
   1. Run `node render.mjs --project projects/<slug> --sheet --quality draft --scale 0.5`, read every sheet, and fix ERROR/MISSING lines first.
   2. Check key actions with `--stills` at the wind-up, contact and landing.
   3. Check motion with `--from A --to B --quality draft --scale 0.5` plus a frame strip (`ffmpeg … fps=4,tile=6x4`).
   4. Edit `story/shots.json` (acts, cam) or `scenes/*.js` hooks, and repeat until every shot passes the quality bar.
2. **Preview checkpoint:** render the first 15–30 s with `--scale 0.5` and send it to the user with the full-render ETA.
3. **Final:**
   1. Set `config.json` `resolution`/`aspect`/`quality: "final"`. A new aspect needs a fresh sheet review.
   2. Run `nohup node render.mjs --project projects/<slug> > projects/<slug>/build/render.log 2>&1 &`, poll the log, and report progress.
   3. Fix any shot errors listed at the end of the log, then re-render.
4. **Sound and delivery:** run `--events` → `tools/auto_sfx.py` → `audio/mix.py`, QC `out/<title>.mp4` (duration, audio, contact sheet), and send the file.
