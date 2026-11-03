---
name: glow-styles
description: "Use when the user runs /glow-styles or asks to compare looks, pick a visual style, make it brighter/warmer/cooler, or create a custom colour grade for a Razgon Glow Studio video. Renders the user's shots in the Glow presets (vivid, soft, clear, nocturne, peach, pastel, crisp) as a grid and saves the choice."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /glow-styles: render style options and lock the look

Work inside `razgon-glow-studio/` on the active project (`projects/<slug>`; if several exist, ask which one). Shared references are in `../make-glow-video/references/` relative to this skill's base directory.

## 1. Make sure there is something representative to show
The grid uses the user's own shots, never the bundled example. If the project has fewer than 3 finished shots, first build (following `../make-glow-video/references/style-bible.md` and `engine-api.md`):
- `scenes/cast.js` and the 1–2 most-used sets,
- a wide set shot with ≥ 2 characters, a `bigGlow` close-up, and a data shot (a `pill` or a `statCard`).

Pick one time inside each shot (about 45% through it) for the grid columns.

## 2. Render the grid
```bash
node render.mjs --project projects/<slug> --styles vivid,soft,clear,nocturne,peach,pastel,crisp --at <t1>,<t2>,<t3> --scale 0.5
```
Open `build/styles/style_grid.png` (one row per style) and check it, then send it to the user with one line each:
- **vivid — Vivid (default):** juicy saturated colours, clean contrast, no milky haze or grain; glow only around lamps and screens.
- **clear — Clear:** the soft palette without haze.
- **soft — Soft Glow:** the hazy reference look: milky shadows, one warm or cool key light, cream edge light, gentle bloom.
- **nocturne — Nocturne:** cooler and deeper, navy shadows, blue-white edges; night, mystery, loneliness.
- **peach — Peach Hour:** warm peach highlights, honey edges, bigger bloom; memories, summer, hope.
- **pastel — Pastel Air:** lighter, lifted shadows, low contrast; family and wholesome topics.
- **crisp — Crisp:** more contrast and saturation, less haze; Shorts and fast topics.

Ask which they want (AskUserQuestion when available).

## 3. Save or customise
- Preset chosen → set `"style"` in `projects/<slug>/config.json`.
- Tweaks requested → add a new entry to `STYLES` in `engine/styles.js`. Copy the closest preset, give it a new id and a `name`/`desc`, then adjust:
  - `moods` overrides (per mood: `sky`, `key`, `rim`, `wall`, `floor`, `practical`),
  - `grade`: `lift` [r,g,b] tints the shadows (raise b for cooler shadows), `gain` [r,g,b] tints the highlights (raise r for warmer), `gamma` [r,g,b], `sat`, `contrast`, `vignette`, `grain`, `bloom` (3D), `glow` + `glowRadius` (the soft 2D bloom),
  - `ui` colours (gold = pill numbers, card, price, paper, cream) and `rimWidth` (edge light), `ink`/`inkHi` (head colour and sheen), `feature` (eye colour).

  Re-render with `--styles <newid>,<closest preset> --at …` so the user can compare, iterate until they're happy, then set it in config.json. `tools/verify_kit.py` will now report `engine/styles.js` as changed; that's expected.

Scenes only follow a style switch if they take colours from `mood()`/`S()`. If one shot ignores the style, find the hard-coded colours in it and replace them.
