# cartoon-shorts — Remotion project for the `cartoon-3d-short` skill

Working project for the skill from [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts)
(installed in `../.claude/skills/cartoon-3d-short/`). It contains the full source of the reference short
"The Bridge That Fell for a Song" (`src/videos/bridge/`, composition `BridgeShort`, 1080x1920, 30 fps).

## Setup
```bash
cartoon-shorts/setup.sh   # npm ci + pip (numpy, scipy, pillow) + skill reference frames
```
Start a new short in Claude Code: *"Use the cartoon short skill and make a short about …"*.

## Commands
| What | Command |
|---|---|
| Type check | `npm run check` |
| Stills (QA) | `REMOTION_TMP=/tmp/remotion-tmp node scripts/bridge-stills.mjs out/bridge/x_ 100,1200 0.5` |
| 2K video | `npm run render` (on Linux, `remotion.config.ts` turns on swangle, the local Chromium, timeout 10 min, 2 tabs) |
| Frame QA | `python scripts/short_qa.py final.mp4 out/<name>/qa shots.json` |

Useful env vars for `bridge-stills.mjs`: `BRIDGE_ENTRY` (sandbox entry), `COMP` (composition id),
`STILL_PROPS='{"post":{"ink":false}}'` (inputProps for A/B switches), `REMOTION_GL`, `BROWSER_EXECUTABLE`, `STILL_DEBUG=1` (all browser logs).

## Changes from the original template (to make it run in a Linux cloud without a GPU)
- **`@react-three/postprocessing` is pinned to exactly 3.0.4.** In 3.1+ the EffectComposer is created asynchronously
  (useEffect → setState), and under Remotion's `frameloop="never"` the frame stays empty (only the background colour).
  `three` is pinned to 0.186.x (postprocessing 6.39 requires `< 0.187`). **Don't bump these versions without testing a still.**
- `bridge-stills.mjs`: on Linux it uses `/opt/pw-browsers/chromium` and `gl: "swangle"` (software WebGL); otherwise Chrome + `angle`, as in the original.
- `Bridge.tsx`: `null` → `<></>` in the EffectComposer children (3.0.4 types).
- `bridge_merge.py`: ROOT = the project folder.
- `remotion.config.ts`: Linux settings for the CLI render.

## Reference frames
`references/frames` and `references/sheets` (the skill's private study material) are not committed to this repo; `setup.sh` pulls them from the original repo.

## Limitations of this environment
- With no GPU, rendering is software-only: about 25–55 s per still, and ~17 s per frame at 0.5 scale with 2 tabs.
  A full 2K short (~2000 frames) would take many hours here, so render finals on a machine with a GPU.
- **Kenney CC0 models** (`public/bridge/kenney/*.glb`: tree_oak, lantern, stall-red, banner-red, windmill, canoe …, list in
  `src/videos/bridge/world.ts`) are not included: kenney.nl is blocked by the cloud's network policy. Without them the
  scene still renders (the loader skips missing models), just without those props. Download the Nature Kit and the
  Fantasy Town Kit from kenney.nl and put the `.glb` files into `public/bridge/kenney/` (they are in .gitignore).
- The voice (`voice.wav` + `words.json`) is yours: ElevenLabs/Piper + Whisper word timings.
