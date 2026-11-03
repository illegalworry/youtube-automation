---
name: block-styles
description: "This skill should be used when the user runs /block-styles or asks to \"show me the worlds\", \"compare blocky / voxel / royale\", \"make it look more like Minecraft / Fortnite / Roblox\", \"pick a visual style\", \"make it brighter / darker\", \"create a custom world style\", or \"change the colour grade\" for a Razgon Block Studio video. It renders the user's own shots in several worlds/styles as a comparison grid, records the choice, and builds custom world styles."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /block-styles: render world/style options and lock the look

Work inside `razgon-block-studio/` on the active project. References: `../make-block-video/references/` (`worlds.md`, `style-bible.md`).

## 1. Something representative to show
Use the user's own shots, never the example. If fewer than 3 shots exist, build `scenes/cast.js`, the 1–2 most-used sets and: a `bigHero` reaction close-up, a street shot with a `ruleCard`, and a UI/alarm shot. Pick a time ~45 % into each.

## 2. Render the grid
```bash
node render.mjs --project projects/<slug> --styles <picked>,blocky,voxel,royale --at <t1>,<t2>,<t3> --scale 0.5
```
Open `build/styles/style_grid.png`, check it, send it with one line per row:
- **blocky — Blocky Avatars:** the competitor's look; rounded block heroes, cube clouds, dark game panels. Roblox-type and non-game topics.
- **voxel — Voxel Sandbox:** pixel-textured cube world, square heads with pixel faces, pixel-font panels. Minecraft-type topics. (`voxelDusk` = moodier survival/horror-lite.)
- **royale — Battle Royale Cartoon:** glossy cartoon humans, vivid island, storm purple, rarity colours. Fortnite-type topics.
- **blockyPop:** blocky with punchier saturation for kids/meme energy.
Recommend the world that matches the title (worlds.md) and ask (AskUserQuestion when available).

## 3. Save or customise
Preset → `"style"` in config.json. Custom → copy the closest entry in `engine/styles.js` → `STYLES`, new id, keep `world`, adjust `moods` (per `game*` mood: sky, grass, grassTop, dirt, stone, roof, roof2, wall, wall2, leaf, cloud, sun…), `ui` colours, `fonts`, `outlineW`, `grade` (lift/gamma/gain, sat, contrast, vignette, grain). Re-render `--styles <new>,<closest>`; iterate; set it in config.json. `verify_kit.py` will then report `engine/styles.js` as changed — expected. Scenes follow a switch only if they take colours from `mood()`/`S()`.
