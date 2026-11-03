# Razgon Block Studio

Turn any voiceover into a finished **"What if <X> became <game>?"** video in the format of a 1M-view competitor — and the **look follows the topic**:

| Title mentions… | World | Looks like |
|---|---|---|
| Roblox, obby, tycoon… (or no game at all) | `blocky` | rounded block avatars with huge eyes, cube clouds, cube sun, studded floors, dark game panels (the competitor's look) |
| Minecraft, crafting, mining… | `voxel` | pixel-textured cube terrain, ores, torches, square heads with pixel faces, hotbar + pixel hearts |
| Fortnite, PUBG, Free Fire, battle royale… | `royale` | glossy cartoon humans, island, purple storm, loot with rarity colours, HP/shield bars, "#1 WINNER" |

Same retention machine in every world: giant 1–2-word captions with coloured key words, a 15-second hook (premise → structure → deadline → "okay, I can explain" → **VHS rewind**), DAY chapters, numbered RULE cards that type in, countdown rings, red-alarm / grey-death / night colour beats, game-tile and pop-up UI, chat bubbles, comic onomatopoeia, name tags, forcefield respawns, bouncy/panic music with SFX on every event.

Why it works and how each trick maps to the engine: **`ANALYSIS_RU.md`** (Russian breakdown of the competitor) and `skills/make-block-video/references/retention-playbook.md`.

Built on Razgon 2D Studio (the old plugin is untouched): same Whisper timestamps, frame-by-frame renderer, director pass and mixer; new characters (`engine/hero.js`), locations (`engine/worldsets.js`), game UI (`engine/gameui.js`), world styles, transitions (`rewind`, `glitch`, `pop`), shot looks (`alarm`, `dead`, `night`, `vhs`), 15 new SFX and 2 new music moods.

Genre, not copies: worlds evoke a game *genre*; no logos, official characters, skins or ripped sounds are drawn or used.

## What you can say
- "Make a video like my competitor's from this voiceover" / «Сделай ролик "Что если ты попал в Майнкрафт"» — full pipeline.
- `/block-new-video` — intake, world from the title, timestamps, story breakdown.
- `/block-styles` — your shots in blocky / voxel / royale side by side; custom world styles.
- `/block-render` — build, check, preview, final render.
- `/block-sound` — music moods, game SFX, mix.

## Inputs and options
Voiceover (any format), optional script (timestamped or plain), any Whisper language (en, ru…), 16:9 or 9:16, 720p–4K, captions on by default, generated or own music.

## First-time setup (automatic)
Claude copies the kit into `razgon-block-studio/` in your project and installs ffmpeg, Node packages (renderer, fonts), headless Chromium, and numpy/scipy/faster-whisper. About 1 GB.

## Render times
The 31-second example renders at 720p in ~2 minutes on 4 CPU threads (≈ 6 frames/s). 1080p ≈ 2×, 4K ≈ 8×.

No API keys or connectors are required.
