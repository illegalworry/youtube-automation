---
name: toon-styles
description: "This skill should be used when the user runs /toon-styles or asks to \"show me style options\", \"compare the looks\", \"pick a visual style\", \"make it warmer / brighter / softer / darker\", \"create a custom style\", or \"change the colour grade\" for a Razgon Toon Studio video. It renders the same shots of the user's story in five Toon presets (toon, toonWarm, toonPop, toonSoft, toonEvening) as a comparison grid, records the choice, and builds custom styles.
"
metadata:
  version: "0.1.0"
  author: Razgon
---

# /toon-styles: render style options and lock the look

Work inside `razgon-toon-studio/` on the active project (`projects/<slug>`; if several exist, ask which one). Shared references are in `../make-toon-video/references/` relative to this skill's base directory.

## 1. Make sure there is something representative to show
The grid uses the user's own shots, never the bundled example. If the project has fewer than 3 finished shots, first build (following `../make-toon-video/references/style-bible.md` and `engine-api.md`):
- `scenes/cast.js` and the 1–2 most-used sets,
- a wide set shot with ≥ 2 characters, a `bigToon` close-up, and an insert or label/sticker shot.

Pick one time inside each shot (about 45% through it) for the grid columns.

## 2. Render the grid
```bash
node render.mjs --project projects/<slug> --styles toon,toonWarm,toonPop,toonSoft,toonEvening --at <t1>,<t2>,<t3> --scale 0.5
```
Open `build/styles/style_grid.png` (one row per style) and check it, then send it to the user with one line each:
- **toon — Flat Daylight:** bright flat vector daylight, cream edge line, no letterbox (the reference look).
- **toonWarm — Warm Afternoon:** creamier highlights, peachy shadows; friendly and nostalgic.
- **toonPop — Bright Pop:** punchier saturation and contrast, white edge line; kids, memes, high energy.
- **toonSoft — Soft Pastel:** lower contrast, milky pastels, light paper grain; calm, cosy.
- **toonEvening — Moody Evening:** cooler shadows, warm practicals, stronger vignette; tense or emotional stories.

Ask which they want (AskUserQuestion when available).

## 3. Save or customise
- Preset chosen → set `"style"` in `projects/<slug>/config.json`.
- Tweaks requested → add a new entry to `STYLES` in `engine/styles.js`. Copy the closest Toon preset, give it a new id and a `name`/`desc`, then adjust:
  - `moods` overrides (per mood: `sky`, `key`, `rim`, `wall`, `floor`, `practical`),
  - `grade`: `lift` [r,g,b] tints the shadows (raise b for cooler shadows), `gain` [r,g,b] tints the highlights (raise r for warmer), `gamma` [r,g,b], `sat`, `contrast`, `vignette`, `grain`, `bloom` (3D),
  - `ui` colours (gold, accent, cream, blueprint), `outline` (the characters' edge-line colour), `rimWidth`, and `toon` tokens (`pants`, `stripe`, `shoe`, `sole`, `hand`, `hair`, `shadow`).

  Re-render with `--styles <newid>,<closest preset> --at …` so the user can compare, iterate until they're happy, then set it in config.json. `tools/verify_kit.py` will now report `engine/styles.js` as changed; that's expected.

Scenes only follow a style switch if they take colours from `mood()`/`S()`. If one shot ignores the style, find the hard-coded colours in it and replace them.
