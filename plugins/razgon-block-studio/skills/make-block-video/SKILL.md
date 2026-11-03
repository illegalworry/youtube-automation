---
name: make-block-video
description: "This skill should be used when the user wants a narrated animated \"What if\" video in the Razgon Block style — bright game-world cartoons whose look follows the topic: blocky avatars for Roblox-type topics, a pixel cube sandbox for Minecraft-type topics, a glossy cartoon battle royale for Fortnite-type topics — with giant 1–2-word captions, RULE cards, DAY counters, countdown rings, red-alarm and grey-death looks, VHS rewinds and game UI, e.g. \"make a video like my competitor's Roblox video\", \"What if the whole world became Minecraft\", \"Что если ты попал в Фортнайт — сделай ролик\", \"animate my What If voiceover\", \"make a game-style video from this audio\", or \"do the whole video\". It runs the full pipeline: install, world choice from the title, timestamps (Whisper), retention-driven story breakdown, scene building, rendering, music, SFX and final MP4 in 16:9 or 9:16 at 720p to 4K."
metadata:
  version: "1.0.0"
  author: Razgon
---

# Razgon Block Studio: full video pipeline

Turn a voiceover (plus an optional script) into a finished MP4 in the format of a 1M-view "What if <X> became <game>?" competitor: bright flat game worlds, front-facing blocky heroes with huge eyes and a gamer name tag, giant captions, numbered rules, countdowns, colour-coded danger, VHS rewinds and game UI everywhere. Every frame is drawn by code (canvas), captured in headless Chromium and encoded with ffmpeg — no image/video AI, so characters stay consistent and text stays sharp. Invent the pictures for every script; the format stays fixed and **the world follows the topic**.

**Bundled resources (this skill's base directory):**
- `kit/`: the tested studio (renderer, engine incl. `hero.js` / `worldsets.js` / `gameui.js`, tools, audio, the `examples/whole-town` reference project). Install it into the workspace as `razgon-block-studio/` (`references/install.md`).
- `references/worlds.md`: **which world for which topic** (blocky / voxel / royale), genre-not-copies rule, adding worlds.
- `references/retention-playbook.md`: **what the viewer feels every second** — hook, open loop, rewind, chapters, numbered rules, escalation by three, captions, easter eggs, ending. Learned from the competitor (Russian breakdown: `../../ANALYSIS_RU.md` from this skill folder).
- `references/style-bible.md`: **the look** (characters, sets, colour = story, camera, editing, graphics, 9:16, don'ts).
- `references/director-pass.md`: the motion (camera paths, weight, impacts, transitions).
- `references/story-breakdown.md`: writing `story/bible.md` and `story/shots.json`, pacing.
- `references/engine-api.md`: config/shots.json schemas and the full API.
- `references/sound-design.md`: music moods, SFX library, levels. `references/render-qc.md`: preview, final render, QC, troubleshooting.

Stage commands re-run one stage: `/block-new-video` (1–4), `/block-styles` (5), `/block-render` (6 and 8), `/block-sound` (7).

## Golden rules
1. **Keep the narration intact.** Never rewrite, add, drop or reorder spoken words. Every shot illustrates the words spoken while it's on screen.
2. **The world follows the title.** Minecraft-type topic → `voxel`, Fortnite-type → `royale`, Roblox-type or no game → `blocky` (`tools/pick_world.py`). Use that world's signature sets and HUD in the hook.
3. **Genre, never copies.** No logos, official characters, skins or ripped sounds of real games (worlds.md). Invented names and stand-ins only.
4. **Retention first.** Apply `retention-playbook.md` to every shot: something new every 0.5–1 s, expressions on the word, captions always on, colour = stakes, open loop paid off at the end.
5. **Draft, look, fix, then render.** Open contact sheets and stills yourself before any long render.
6. **Three user checkpoints:** setup choices, world/style from rendered samples, preview before the final render. If the user is away, take the defaults, say what was assumed, continue.
7. **Files are the truth.** Each video lives in `razgon-block-studio/projects/<slug>/`; `story/shots.json` owns all timing.

## Stage 1: Intake
Ask once (AskUserQuestion when available), skipping anything already given: **voiceover** (required), **script** (timestamped / plain / none), **title** (it decides the world), **aspect** 16:9 or 9:16, **resolution** 720p / 1080p (recommended) / 1440p / 2160p, **music** generated / own / none, **SFX** on/off. Captions are ON by default in both aspects (the format depends on them). Then run `python tools/pick_world.py --title "<title>"` and tell the user the world in one line.
Defaults: 16:9, 1080p, 24 fps, world from the title, captions on, generated music + SFX, no letterbox.

## Stage 2: Install or check the studio
Follow `references/install.md`: copy `kit/` to `razgon-block-studio/` (skip if present, never touch `projects/`), install dependencies, `python tools/verify_kit.py`, `python tools/doctor.py`, then the example self-test. Report what was installed in one short list.

## Stage 3: Project + timeline (inside `razgon-block-studio/`)
```bash
python tools/new_project.py --name <slug> --voice "<voiceover>" [--script "<script>"] --aspect 16:9 --resolution 1080p --title "<title>" [--style auto|blocky|voxel|royale|…] [--no-captions]
```
- Timestamped script → `python tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.<ext>`
- Plain script → `python tools/transcribe.py --project projects/<slug> --script projects/<slug>/input/script.txt --lang <en|ru|…> --model small` (≥ 90 % match, else tell the user).
- No script → `python tools/transcribe.py --project projects/<slug> --lang <code> --model small`.
Check `timeline/transcript.txt`, then `python tools/beats.py --project projects/<slug>` for the beat sheet and a draft shots.json.

## Stage 4: Story breakdown (the retention pass)
Read `worlds.md`, `retention-playbook.md`, `style-bible.md`, `director-pass.md`, `story-breakdown.md`. Write `story/bible.md`: logline, who "you" is, the world and why, cast (hero outfit + gamer name, side characters with funny names), locations with moods, **the open loop and where it pays off**, chapters (days/levels) and numbered rules, colour plan (day → alarm → dead → night…), easter eggs, music plan. Write 3 options for the hook (first 15 s) and for the climax; pick one each. Write `scenes/cast.js`. Rewrite `story/shots.json` (median 2–3 s, a new visual event every 0.5–1 s, transitions `rewind`/`pop`/`glitch`/`whip` chosen with both shots, `look` for colour beats, `captionStyle.emph` words in config.json). Send the user a 5–10 line plan and continue unless they object.

## Stage 5: World / style check
Build the 1–2 most-used sets plus 3 representative shots (a giant `bigHero` reaction, a street shot with a `ruleCard`, a full-frame UI or alarm shot). Render the grid:
```bash
node render.mjs --project projects/<slug> --styles <picked>,blocky,voxel,royale --at <t1>,<t2>,<t3> --scale 0.5
```
Open `build/styles/style_grid.png`, show it with one line per row, recommend the picked world, save the choice in `config.json` → `style` (`blockyPop` / `voxelDusk` variants; custom styles per worlds.md).

## Stage 6: Build every shot
Read `engine-api.md` and `examples/whole-town/scenes/` once. Batches of 8–12 shots:
1. Use `worldsets.js` locations; compose new places from the pieces in `scenes/sets/<name>.js` (`{GY, CX, M, front}` contract). Characters only with `drawHero`/`bigHero`. Shots in `scenes/shots/NN_<name>.js` with `registerShot('<id>', …)`.
2. `node render.mjs --project projects/<slug> --sheet --scale 0.5`; open every sheet and run the QC checklist (`render-qc.md`). Fix errors, MISSING shots and composition.
3. Motion: `--stills` inside every transition, impact and look change; `--from A --to B --scale 0.5` previews.

Non-negotiables: world-correct characters and sets; expressions change on the word; every number/rule/day said appears on screen synced with `wordTime()`; a motivated camera move and weight on every arrival; colours from `mood()`/`S()`; caption zone clear; `V()` for aspect-dependent values; no `Math.random`/`Date.now`.

## Stage 7: Sound
Read `sound-design.md`. `music` sections (`bouncy` default, `panic` for countdowns/alarms, `triumph` for wins), an SFX on every visual event (`pop` on UI, `boing` on jumps, `bonk` on hits, `rewind` on VHS, `alarm` on red looks, `typing` with `capMode: type`, `notify` on pop-ups, `respawn`, `coin`, `crunch`…). No dead air.

## Stage 8: Render and deliver
1. Preview `node render.mjs --project projects/<slug> --from 0 --to 30 --scale 0.5`; show the user before the long render.
2. Final `node render.mjs --project projects/<slug>` (background for long videos; share the ETA from the log).
3. `python audio/mix.py --project projects/<slug>` → `out/<title>.mp4` (music ducked under the voice, −14 LUFS).
4. QC: duration, audio, a 1-frame-per-10-s sheet, transitions in motion. Send the MP4, say where it is, and give one line on thumbnail/title per retention-playbook §E.

## Defaults and judgement calls
- Unsure about a visual → the more literal, funnier, more game-like option: a giant reaction close-up for emotion, a UI card for any number, an onomatopoeia for any impact, escalation by three for any list.
- 20–30 shots per minute; 1 rule/day card per mention; 1 colour change every 30–45 s; 2–4 easter eggs per minute; 1 rewind or flash-forward per video.
- The hero's outfit and name never change; keep screen direction within a scene.
