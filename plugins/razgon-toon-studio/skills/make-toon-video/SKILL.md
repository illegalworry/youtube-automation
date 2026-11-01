---
name: make-toon-video
description: "This skill should be used when the user wants a narrated animated video in the Razgon Toon style (bright flat 2.5D cartoon: big black round heads on thin necks, coloured hoodies with drawstrings, track pants with a stripe, white sneakers, cream edge line; brick schools, round trees, parked cars, garages, backyards, boxing rings, car parks; signs, stickers and label boxes), e.g. \"make a toon video from this voiceover\", \"animate my story like the hoodie cartoon channels\", \"make a video in my competitor's flat cartoon style\", \"turn this narration into a cartoon story\", or \"do the whole video\". It runs the full pipeline: install, timestamps (Whisper), story breakdown, style choice, scene building, rendering, music, SFX and final MP4 in 16:9 or 9:16 at 720p to 4K.
"
metadata:
  version: "0.1.0"
  author: Razgon
---

# Razgon Toon Studio: full video pipeline

Turn a voiceover (plus an optional script) into a finished MP4 where every frame is drawn by code (HTML canvas + Three.js), captured frame by frame in headless Chromium and encoded with ffmpeg. No image or video generation models are used, so characters stay consistent and text stays crisp. Invent the visuals fresh for every script; only the style is fixed. The look is the bright flat hoodie-cartoon style described in `references/style-bible.md` (engine: `engine/toon.js` characters, `engine/toonsets.js` locations, `engine/toonui.js` graphics).

**Bundled resources (this skill's base directory):**
- `kit/`: the tested studio (renderer, engine, tools, audio, the `examples/dollar-show` reference project). Install it into the workspace as `razgon-toon-studio/` (see `references/install.md`).
- `references/install.md`: install, dependency table, doctor, self-test.
- `references/director-pass.md`: **the motion** (camera speed waves, weight, motion blur, designed transitions, kinetic type, sound on events). Read it with the style bible before designing any shot.
- `references/style-bible.md`: **the look** (characters, sets, light, camera, editing, graphics, 9:16 rules, don'ts). Read it fully before designing any shot.
- `references/story-breakdown.md`: writing `story/bible.md` and `story/shots.json`, plus pacing rules.
- `references/engine-api.md`: the scene API, config and shots.json schemas, and the three-kit reference.
- `references/sound-design.md`: the music plan, SFX library, ambience and levels.
- `references/render-qc.md`: preview and final render, speed guide, QC checklist, troubleshooting.

Stage commands from this plugin re-run one stage: `/toon-new-video` (stages 1–4), `/toon-styles` (5), `/toon-render` (6 and 8), `/toon-sound` (7). When running end to end, follow this file and load references as each stage needs them.

## Golden rules
1. **Keep the narration intact.** Never rewrite, add, drop or reorder spoken words. Every shot illustrates the words spoken while it is on screen.
2. **Same style, new pictures.** Invent sets, props, characters and actions from this script. Use `examples/dollar-show` only to learn the API.
3. **Show what is said, literally and specifically.** Abstract lines become visual metaphors, diagrams or close-up reactions.
4. **Draft, look, fix, then render.** Open contact sheets and stills yourself (read the PNGs) before any full render. Rendering is slow; looking is fast.
5. **Three user checkpoints:** setup choices, style choice from rendered samples, and the preview before the final render. If the user is away, take the defaults, state what was assumed, and continue.
6. **Files are the truth.** Each video lives in `razgon-toon-studio/projects/<slug>/`, and `story/shots.json` owns all timing.

## Stage 1: Intake
Ask once (AskUserQuestion when available) for:
- **Voiceover file** (required).
- **Script:** timestamped (SRT/VTT/JSON/TXT with `[mm:ss]`), plain text (best: aligned to the audio, keeping exact wording), or none (transcribed).
- **Aspect:** 16:9 or 9:16.
- **Resolution:** 720p / 1080p (recommended) / 1440p / 2160p (4K). Mention that higher resolutions take much longer to render.
- **Captions:** default on for 9:16, off for 16:9.
- **Music:** generated, the user's own file, or none. **SFX:** on or off.
- **Title.**

Don't ask about style yet. Defaults: 16:9, 1080p, 24 fps, generated music + SFX, style `toon`, no letterbox.

## Stage 2: Install or check the studio
Follow `references/install.md`: copy `kit/` to `razgon-toon-studio/` in the workspace (skip if already present), install dependencies, run `python tools/verify_kit.py` and `python tools/doctor.py`, then run the example self-test. Report what was installed in one short list.

## Stage 3: Project + timeline
Run inside `razgon-toon-studio/`. Use `python3` where `python` isn't Python 3.
```bash
python tools/new_project.py --name <slug> --voice "<voiceover path>" [--script "<script path>"] --aspect 16:9 --resolution 1080p --title "<title>" [--captions]
```
- Timestamped script: `python tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.<ext>`
- Plain script: `python tools/transcribe.py --project projects/<slug> --script projects/<slug>/input/script.txt --lang en --model small`. The match must be ≥ 90%; if it's lower, tell the user the script and audio differ.
- No script: `python tools/transcribe.py --project projects/<slug> --lang en --model small` (`base` on slow machines, `large-v3` for hard audio).

Check `timeline/transcript.txt` (its end should be near the voiceover length), then run `python tools/beats.py --project projects/<slug>` to get the beat sheet and a draft `story/shots.json`.

## Stage 4: Story breakdown
Read `references/style-bible.md`, `references/director-pass.md` and `references/story-breakdown.md`. Write `story/bible.md` (logline, cast with one signature colour each, locations with moods and key lights, motifs, music plan). Write `scenes/cast.js`. Rewrite `story/shots.json`: contiguous shots, cut on phrase boundaries 0.1–0.2 s early, a median of 2–3.5 s, an establishing shot per new location, and a concrete `scene` description for each. For the key shots (hook, title, freezes, climax) write 3–4 different options in the bible and pick one. Choose each non-cut transition together with both shots it joins (`whip`/`push`/`iris`/`match`/`smash`, director-pass.md §4). Send the user a 5–10 line plan summary and continue unless they object.

## Stage 5: Style choice
Build the 1–2 most-used locations plus 3 representative shots (a wide shot with ≥ 2 characters, a `bigToon` close-up, an insert or label/sticker moment). Then render:
```bash
node render.mjs --project projects/<slug> --styles toon,toonWarm,toonPop,toonSoft,toonEvening --at <t1>,<t2>,<t3> --scale 0.5
```
Open `build/styles/style_grid.png`, then show it with one line per style: **toon** (Flat Daylight, the reference look), **toonWarm** (late warm sun), **toonPop** (punchy saturation, kids/meme energy), **toonSoft** (milky pastel, calm), **toonEvening** (cooler, darker, for tense or emotional videos). Save the pick in `config.json` → `style`. For tweaks, add a custom entry to `STYLES` in `engine/styles.js` (copy `toon`; adjust `outline`, `toon` tokens, mood overrides and `grade`) and re-render that row.

## Stage 6: Build every shot
Read `references/engine-api.md`, `references/director-pass.md` and the example scenes in `examples/dollar-show/scenes/` once. Work in batches of 8–12 shots:
1. Use the ready-made locations from `/engine/toonsets.js` where they fit; for new places write `scenes/sets/<location>.js` from the pieces (anchored to `GY = tGround()` and `CX = E.W/2`, returning `{GY, CX, M, front}`, with walls, floor and sky extended past the frame). Draw characters only with `drawToon`/`bigToon`. Then write `scenes/shots/NN_<name>.js` with `registerShot('<id>', {...})` for the ids in shots.json.
2. Run `node render.mjs --project projects/<slug> --sheet --scale 0.5`. Open every `build/sheets/sheet_XX.png` and check it against the QC checklist in `references/render-qc.md`. Fix any MISSING shots, errors printed by the renderer, and composition problems.
3. Check motion with `--stills t1,t2,t3` or `--from A --to B --scale 0.5` (writes `build/preview.mp4`).

Non-negotiables from the style bible:
- Characters with `drawToon`/`bigToon` only (never `drawFigure`/`bigFace`), edge line pointed at the key light.
- Colours from `mood()`/`S()`.
- A motivated camera move in every shot (`camPath`/`travel`, not a lone linear zoom), and a soft foreground in most medium shots.
- Weight on every arrival and contact (`spring`, `posesSpring`, `impact`); kinetic type for titles and slammed words.
- `"mb"` motion blur only on fast shots; check transitions and impacts with `--stills` inside them.
- Life in the frame: blinking, breathing, swaying balloons/bulbs, expressions on the beat.
- Bright flat value structure: clean saturated colours, soft shadows, no murky frames, no letterbox.
- Graphics synced to words with `wordTime()`.
- `V()` for every aspect-dependent value.
- No `Math.random`/`Date.now`.

## Stage 7: Sound
Read `references/sound-design.md`. Fill `story/shots.json` → `music` (contiguous mood sections) and add per-shot `sfx` cues and `amb` beds. Put a cue on every new visual event from the director pass (door stop, slammed word, landing, smash cut) at the frame it happens. Mixing happens after the final render (Stage 8), or run `python audio/mix.py --project projects/<slug>` now to audition `build/mix.wav`.

## Stage 8: Render and deliver
Read `references/render-qc.md`.
1. Preview: `node render.mjs --project projects/<slug> --from 0 --to 30 --scale 0.5`. Show the user the preview or a contact sheet before the long render.
2. Final: `node render.mjs --project projects/<slug>`. Run it in the background for long videos and poll the log. The log prints fps and ETA, so share the estimate.
3. Run `python audio/mix.py --project projects/<slug>`, which generates music and SFX, ducks the music under the voice, normalises to −14 LUFS and muxes `out/<title>.mp4`.
4. QC the final file: duration matches, audio is present, a 1-frame-per-10-s contact sheet looks right, and the transitions and impacts look right in motion (director-pass.md §8). Deliver the MP4 (send the file), then give the location in plain words and one line on what to tweak next if needed.

## Defaults and judgement calls
- When unsure about a visual, choose the more literal, more cinematic option: a `bigToon` close-up for emotion, an insert for objects (signs, cash, phones), a classroom whiteboard (`onBoard`) for explanations, a wide for new places.
- Keep about 15–25 shots per minute. Use 1–3 `bigToon` money/reaction close-ups per minute, labels and stickers for every number, and keep 3D rare (2.5D sets are the look).
- Keep each character's outfit colour fixed for the whole video, and keep screen direction consistent within a scene.
- Prefer re-rendering a fixed shot range over the whole video only when the user is comfortable splicing. Otherwise re-render everything.
