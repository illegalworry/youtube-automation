# Installing the studio (once per workspace)

The studio ships in this skill's `kit/` folder. Copy it into a writable workspace folder named **`roblox-3d-studio/`**: it needs `node_modules`, projects and renders next to it. It is independent of `razgon-2d-studio/` (the 2D stick-figure studio), so never copy one over the other.

1. **Locate the kit:** `kit/` in the `make-3d-video` skill's base directory (from stage skills: `../make-3d-video/kit/`). If unsure, run `find / -path "*make-3d-video/kit/render.mjs" 2>/dev/null | head -1`.
2. **Copy:**
   - If `roblox-3d-studio/render.mjs` already exists, skip to step 4 and never overwrite `projects/`.
   - Otherwise run `mkdir -p roblox-3d-studio && cp -r "<kit>/." roblox-3d-studio/`, then `python tools/verify_kit.py` inside it (it must report all files OK).
   - **Updating** an install: copy the kit over it. That replaces `engine/`, `tools/`, `audio/`, `render.mjs` and `examples/`, and never touches `projects/`.
3. **Dependencies.** Tell the user in one short list what is being installed and why:

   | Need | Command |
   |---|---|
   | ffmpeg + ffprobe | `sudo apt-get install -y ffmpeg` / `brew install ffmpeg` / `winget install --id Gyan.FFmpeg -e` |
   | Node.js ≥ 18 | distro / `brew install node` / `winget install OpenJS.NodeJS.LTS` |
   | JS packages (Three.js, Playwright, fonts) | `npm install` (inside `roblox-3d-studio`) |
   | Headless Chromium | `npx playwright install chromium`. Not needed if a Chromium is preinstalled (`/opt/pw-browsers`, or set `CHROMIUM_PATH`). |
   | Python packages | `python -m pip install numpy scipy faster-whisper` (`--break-system-packages` on managed Pythons) |

   `python tools/doctor.py --install` runs the safe automatic fixes.
4. **Check and self-test:**
   1. `python tools/doctor.py` until every line is OK.
   2. `node render.mjs --project examples/max-i-telefon --sheet --quality draft --scale 0.4`. It must write `examples/max-i-telefon/build/sheets/sheet_01.png` (14 shots: a park, three Roblox characters, a chase, a punch, a celebration) with no ERROR lines. Open it to confirm, then delete `examples/max-i-telefon/build/`.

## Notes
- **No GPU** (servers, Cowork VM, cloud containers): Chromium uses SwiftShader automatically, which works but is slower. With a desktop GPU, pass `--gl gpu`.
- **Android/Termux:** Chromium-based rendering is the most portable route (Blender has no Android build), but phones are slow. Render at 720p `draft` for previews, or render on a desktop or cloud machine.
- **Disk:** ~400 MB for `node_modules` + Chromium, plus the Whisper model (~500 MB for `small`), plus renders.
