---
name: make-glow-video
description: "This skill should be used when the user wants a narrated animated video in the Razgon Glow style (soft-lit 2.5D 'What if…?' look: big round black heads with white oval eyes, muted hoodies with drawstrings, thin stick legs, a thin warm edge light; cosy night porches, office kitchens, sunset farm stands, dusk parks, monitor-lit rooms; invisible outline people, orange percentage pills, navy study cards, handwritten signs), e.g. \"make a glow video from this voiceover\", \"animate my script in the soft What If style\", \"make a video in my competitor's style with black-headed hoodie characters\", \"turn this narration into a thought-experiment video\", or \"do the whole video\". It runs the full pipeline: install, timestamps (Whisper), story breakdown, style choice, scene building, rendering, music, SFX and final MP4 in 16:9 or 9:16 at 720p to 4K.\n"
metadata:
  version: "1.0.0"
  author: Razgon
---

# Razgon Glow Studio: full video pipeline

Turn a voiceover (plus an optional script) into a finished MP4 where every frame is drawn by code (HTML canvas + Three.js), captured frame by frame in headless Chromium and encoded with ffmpeg. No image or video generation models are used, so characters stay consistent and text stays crisp. Invent the visuals fresh for every script; only the style is fixed.

This is a separate studio built on the Razgon 2D Studio pipeline (same tools, renderer, director pass and sound engine) with a new look: a new character rig (`engine/glow.js`), a set library (`engine/glowsets.js`), graphics (`engine/glowui.js`), soft-glow styles and a 2D bloom. It installs into its own folder `razgon-glow-studio/` and never touches an existing `razgon-2d-studio/`.

**Bundled resources (this skill's base directory):**
- `kit/`: the tested studio (renderer, engine, tools, audio, the `examples/honesty-box` reference project). Install it into the workspace as `razgon-glow-studio/` (see `references/install.md`).
- `references/style-bible.md`: **the look** (characters, eyes and expressions, sets, light, camera, graphics, 9:16 rules, don'ts). Read it fully before designing any shot.
- `references/director-pass.md`: **the motion** (camera paths, weight, transitions, kinetic type, sound on events), at the calmer Glow tempo.
- `references/story-breakdown.md`: writing `story/bible.md` and `story/shots.json`, plus pacing rules.
- `references/engine-api.md`: the scene API (glow.js, glowsets.js, glowui.js, motion.js, three-kit), config and shots.json schemas.
- `references/sound-design.md`: the music plan, SFX library, ambience and levels.
- `references/render-qc.md`: preview and final render, speed guide, QC checklist, troubleshooting.

Stage commands from this plugin re-run one stage: `/glow-new-video` (stages 1–4), `/glow-styles` (5), `/glow-render` (6 and 8), `/glow-sound` (7). When running end to end, follow this file and load references as each stage needs them.

## Golden rules
1. **Keep the narration intact.** Never rewrite, add, drop or reorder spoken words. Every shot illustrates the words spoken while it is on screen.
2. **Same style, new pictures.** Invent places, props, characters and actions from this script. Use `examples/honesty-box` only to learn the API.
3. **Show what is said, literally and specifically.** Abstract lines become a concrete everyday scene, an invisible outline, a sign, a poster, a number pill or a study card.
4. **The eyes do the acting.** Change expressions and eye direction on the beat of the words; keep bodies simple and calm.
5. **Draft, look, fix, then render.** Open contact sheets and stills yourself (read the PNGs) before any full render. Rendering is slow; looking is fast.
6. **Three user checkpoints:** setup choices, style choice from rendered samples, and the preview before the final render. If the user is away, take the defaults, state what was assumed, and continue.
7. **Files are the truth.** Each video lives in `razgon-glow-studio/projects/<slug>/`, and `story/shots.json` owns all timing.

## Stage 1: Intake
Ask once (AskUserQuestion when available) for:
- **Voiceover file** (required).
- **Script:** timestamped (SRT/VTT/JSON/TXT with `[mm:ss]`), plain text (best: aligned to the audio, keeping exact wording), or none (transcribed).
- **Aspect:** 16:9 or 9:16.
- **Resolution:** 720p / 1080p (recommended) / 1440p / 2160p (4K). Mention that higher resolutions take much longer to render.
- **Captions:** default on for 9:16, off for 16:9.
- **Music:** generated, the user's own file, or none. **SFX:** on or off.
- **Title** and the **language** of the narration (Russian and other Cyrillic scripts are supported in on-screen text).

Don't ask about style yet. Defaults: 16:9, 1080p, 24 fps, generated music (gain −6 dB, ducking −7 dB) + SFX, style `soft`.

## Stage 2: Install or check the studio
Follow `references/install.md`: copy `kit/` to `razgon-glow-studio/` in the workspace (skip if already present), install dependencies, run `python tools/verify_kit.py` and `python tools/doctor.py`, then run the example self-test. Report what was installed in one short list. If Chromium can't be downloaded but one is installed, prefix renders with `CHROMIUM_PATH=<path>`.

## Stage 3: Project + timeline
Run inside `razgon-glow-studio/`. Use `python3` where `python` isn't Python 3.
```bash
python tools/new_project.py --name <slug> --voice "<voiceover path>" [--script "<script path>"] --aspect 16:9 --resolution 1080p --title "<title>" [--captions]
```
- Timestamped script: `python tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.<ext>`
- Plain script: `python tools/transcribe.py --project projects/<slug> --script projects/<slug>/input/script.txt --lang <code> --model small`. The match must be ≥ 90%; if it's lower, tell the user the script and audio differ.
- No script: `python tools/transcribe.py --project projects/<slug> --lang <code> --model small` (`base` on slow machines, `large-v3` for hard audio).

Check `timeline/transcript.txt` (its end should be near the voiceover length), then run `python tools/beats.py --project projects/<slug>` to get the beat sheet and a draft `story/shots.json`.

## Stage 4: Story breakdown
Read `references/style-bible.md`, `references/director-pass.md` and `references/story-breakdown.md`. Write `story/bible.md` (logline, cast with one hoodie colour each, locations with mood, key light and the ready-made set or pieces they use, motifs, music plan). Write `scenes/cast.js`. Rewrite `story/shots.json`: contiguous shots, cut on phrase boundaries 0.1–0.2 s early, a median of 2.5–4 s (the Glow pace is calm), an establishing shot per new location, and a concrete `scene` description for each. For the key shots (hook, title, the twist, the study, the question) write 3–4 different options in the bible and pick one. Send the user a 5–10 line plan summary and continue unless they object.

## Stage 5: Style choice
Build the 1–2 most-used sets plus 3 representative shots (a wide group shot, a `bigGlow` close-up, a data shot with a pill or a study card). Then render:
```bash
node render.mjs --project projects/<slug> --styles soft,nocturne,peach,pastel,crisp --at <t1>,<t2>,<t3> --scale 0.5
```
Open `build/styles/style_grid.png`, then show it with one line per style: **soft** (the reference look: milky shadows, warm/cool key light, gentle bloom), **nocturne** (cooler and deeper, for night and mystery), **peach** (warm, nostalgic), **pastel** (lighter, family-friendly), **crisp** (more contrast and colour, for Shorts). Save the pick in `config.json` → `style`. For tweaks, add a custom entry to `STYLES` in `engine/styles.js` (moods overrides plus the `grade`: lift/gamma/gain, sat, contrast, vignette, grain, bloom, glow) and re-render that row.

## Stage 6: Build every shot
Read `references/engine-api.md`, `references/director-pass.md` and the example scenes in `examples/honesty-box/scenes/` once. Work in batches of 8–12 shots:
1. Use the ready-made sets from `glowsets.js` where they fit (`porch kitchen farmStand park monitorRoom fogWindow bedroom street classroom studio`), otherwise write `scenes/sets/<location>.js` from the pieces (same signature `fn(g, t, cam, o) → {GY, M, …}`, walls/floors/skies extended past the frame). Write `scenes/shots/NN_<name>.js` with `registerShot('<id>', {...})` for the ids in shots.json.
2. Run `node render.mjs --project projects/<slug> --sheet --scale 0.5`. Open every `build/sheets/sheet_XX.png` and check it against the QC checklist in `references/render-qc.md`. Fix any MISSING shots, errors printed by the renderer, and composition problems.
3. Check motion with `--stills t1,t2,t3` or `--from A --to B --scale 0.5` (writes `build/preview.mp4`).

Non-negotiables from the style bible:
- Glow characters only (`drawGlow`/`bigGlow`/`glowFigure3D`), each with the edge light (`rim: {color: M.rim, dir}`), contact shadow, blinking, `idle()` life.
- Eyes and expressions change on the words; the invisible outline (`invisible`) for "nobody watching"/imagined people.
- Colours from `mood()`/`S()`; one key light per shot with its light pool; far layers blurred and hazed; close-ups over a blurred set.
- A calm motivated camera move in every shot (`camPath`/`drift`/push into the prop).
- Numbers as pills/cards synced with `wordTime()`; signs handwritten inside the world; study cards with a citation when the script names a study.
- `V()` for every aspect-dependent value. No `Math.random`/`Date.now`.

## Stage 7: Sound
Read `references/sound-design.md`. Fill `story/shots.json` → `music` (contiguous mood sections; `mystery`, `calm`, `wonder` and `playful` fit the Glow tone best) and add per-shot `sfx` cues and `amb` beds (wind on porches, roomtone in offices, city in parks). Put a cue on every new visual event (a pill pops, a card appears, a person fades out). Mixing happens after the final render (Stage 8), or run `python audio/mix.py --project projects/<slug>` now to audition `build/mix.wav`.

## Stage 8: Render and deliver
Read `references/render-qc.md`.
1. Preview: `node render.mjs --project projects/<slug> --from 0 --to 30 --scale 0.5`. Show the user the preview or a contact sheet before the long render.
2. Final: `node render.mjs --project projects/<slug>`. Run it in the background for long videos and poll the log. The log prints fps and ETA, so share the estimate.
3. Run `python audio/mix.py --project projects/<slug>`, which generates music and SFX, ducks the music under the voice, normalises to −14 LUFS and muxes `out/<title>.mp4`.
4. QC the final file: duration matches, audio is present, a 1-frame-per-10-s contact sheet looks right, transitions look right in motion. Deliver the MP4 (send the file), then give the location in plain words and one line on what to tweak next if needed.

## Defaults and judgement calls
- When unsure about a visual, choose the more concrete, everyday option: a real place, a real object, a face reacting.
- Keep about 14–22 shots per minute. Use 1–3 invisible/imagined moments per video and at most one 3D shot per minute.
- Keep each character's hoodie colour fixed for the whole video, and keep screen direction consistent within a scene.
- Prefer re-rendering a fixed shot range over the whole video only when the user is comfortable splicing. Otherwise re-render everything.
