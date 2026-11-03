# Installing the studio (once per machine or workspace)

The studio is a small Node + Python toolkit that ships inside this plugin, in the `kit/` folder of the `make-block-video` skill. Copy it into a writable workspace folder, because the plugin folder may be read-only and the studio needs `node_modules`, projects and renders next to it.

## 1. Locate the kit
- The kit is `kit/` inside the `make-block-video` skill's base directory. Stage commands (`block-new-video`, `block-styles`, `block-render`, `block-sound`) reach it at `../make-block-video/kit/` from their own base directory.
- If the path is unclear, search for it: `find / -path "*make-block-video/kit/render.mjs" 2>/dev/null | head -1` (Linux/macOS/Cowork VM), or `Get-ChildItem -Recurse -Filter render.mjs -Path $HOME\.claude | Select-Object -First 1` (PowerShell).

## 2. Choose the workspace and copy
- Use the user's connected project folder if there is one, otherwise the current working directory. Create `razgon-block-studio/` there.
- If `razgon-block-studio/` already exists with `render.mjs` and `engine/hero.js` inside, it's already installed. Skip to step 4 (doctor), and never overwrite the user's `projects/` folder.
- **Migrating an older studio install.** If `razgon-block-studio/` doesn't exist yet but another folder in the same place contains `render.mjs`, `engine/` and `projects/` (a studio installed earlier under a different name), tell the user its name and rename it to `razgon-block-studio/` (`mv "<old>" razgon-block-studio`, or `Rename-Item` in PowerShell), then copy this kit over it as below. Copying the kit updates `engine/`, `render.mjs` and `tools/` and never touches `projects/`, so existing videos keep working. Re-add any custom styles from `engine/styles.js` afterwards.
- Copy all of `kit/` into it: `cp -r "<kit>/." razgon-block-studio/` (bash) or `Copy-Item -Recurse "<kit>\*" razgon-block-studio\` (PowerShell).
- Run `python tools/verify_kit.py` inside `razgon-block-studio/`. It must report all files verified. If anything is missing or mismatched, copy those files again.

## 3. Install dependencies
Tell the user, in one short list, what is being installed and why: ffmpeg (video/audio encoding), Node.js packages (renderer, Three.js, fonts incl. Lilita One, Press Start 2P, Luckiest Guy), a headless Chromium (draws the frames), and numpy, scipy and faster-whisper (sound synthesis and timestamps).

| Need | Windows | macOS | Linux |
|---|---|---|---|
| ffmpeg + ffprobe | `winget install --id Gyan.FFmpeg -e` (then open a new terminal) | `brew install ffmpeg` | `sudo apt-get install -y ffmpeg` |
| Node.js ≥ 18 | `winget install OpenJS.NodeJS.LTS` | `brew install node` | nodesource or distro package |
| Python ≥ 3.9 | python.org installer | `brew install python` | distro package |
| JS packages | `npm install` (inside razgon-block-studio) | same | same |
| Headless Chromium | `npx playwright install chromium` | same | same (`npx playwright install-deps chromium` if libraries are missing) |
| Python packages | `python -m pip install numpy scipy faster-whisper` | same | add `--break-system-packages` on managed Pythons |

## 4. Check and self-test
1. `python tools/doctor.py`. Use `python3` where `python` isn't Python 3, and `py -3` on some Windows setups. Repeat until every line is OK. `python tools/doctor.py --install` runs the npm, playwright and pip fixes automatically.
2. Self-test: `node render.mjs --project examples/whole-town --sheet --scale 0.3`. It should write `examples/whole-town/build/sheets/sheet_01.png` with 13 finished frames (a giant shocked close-up, the town row, a DAY card, a game tile, a red-alarm town and street, a VHS bedroom with a pop-up, rule cards, an obby, a grey 'You died' frame, a forcefield respawn) and print no errors. Optionally also `--styles blocky,voxel,royale --at 0.8,12.9,21.3` to see the three worlds. Open the PNG to confirm, then delete `examples/whole-town/build/`.
3. Whisper downloads its model the first time it runs (~75 MB for `base`, ~500 MB for `small`). That needs internet access to huggingface.co.

## Notes
- On Linux servers and the Cowork VM there's no GPU. Chromium uses SwiftShader automatically (`--gl swiftshader` is the Linux default), so everything works, just slower.
- Disk: ~600 MB for node_modules + Chromium, plus renders (a 10-minute 1080p video is ~150–300 MB).
- Updating: when the plugin is updated, copy the new `kit/` over the existing install. It never touches `projects/`, so the user's videos are safe. Custom styles added to `engine/styles.js` would need re-adding, so check first.

- **Playwright's Chromium can't be downloaded** (offline/sandboxed machines) → point the renderer at any Chrome/Chromium: `CHROMIUM_PATH=/path/to/chrome node render.mjs …` (doctor.py accepts it too).
