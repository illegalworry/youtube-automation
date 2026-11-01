---
name: make-3d-video
description: "This skill should be used when the user wants a narrated, fully animated 3D video in the Roblox style (blocky avatars, studs, bright plastic worlds) built from a voiceover, e.g. \"make a Roblox video from this voiceover\", \"animate my script in 3D\", \"сделай 3D-анимацию в стиле Роблокс по озвучке\", \"turn this narration into a Roblox story\", \"Roblox animation with fights / chase / school drama\", or \"do the whole 3D video\". It runs the full pipeline: install, timestamps (Whisper), script → scenes/shots breakdown, cast and sets, writing the animation as code, contact-sheet QC, render, auto SFX, music and the final MP4 (16:9 or 9:16, 720p–4K)."
metadata:
  version: "1.0.0"
  author: Razgon
---

# Roblox 3D Studio: voiceover → animated 3D video

The video is **code**: you write the story as data (`story/shots.json`) plus small JS files, and the engine animates it with Three.js. Headless Chromium renders it frame by frame, and ffmpeg muxes it with the voiceover, music and SFX. No image or video AI is involved, so characters stay identical across shots and every frame is deterministic.

The picture is driven by the **voiceover timeline**: Whisper gives word timings, and every action, cut and line of lip-sync is placed on those seconds.

## How the engine thinks (read once)
- **Scene** = one continuous piece of action in one location, on the global timeline. It holds:
  - the set and light;
  - actors with start positions;
  - acts (`walk`, `punch`, `wave`, …) at given seconds or spoken words;
  - props;
  - fx.
- **Shot** = a camera cut over a scene, `start`–`end` on the timeline, with a `cam` spec. Several shots can watch the same scene from different angles, so continuity is automatic: the action keeps running across cuts.
- The engine handles the rest automatically:
  - grounding of feet;
  - walk cycles matched to speed;
  - smooth turns and blending between clips;
  - hit reactions (`punch` with `target` → victim `hit`/`knockback` + flash + debris + camera shake);
  - landing dust;
  - blinking;
  - lip-sync on the voiceover words for the `speaker` of a shot;
  - occlusion-avoiding camera;
  - auto SFX.
- Units: 1 unit = 1 stud. An avatar is 5 studs tall. +Y is up. Facing `0` looks toward +Z, `90` toward +X.

## Bundled resources (this skill's base directory)
- `kit/`: the tested studio. Install it as `roblox-3d-studio/` in the workspace (`references/install.md`). It contains:
  - `render.mjs`;
  - `engine/` (avatar, anim, director, camera, world, items, fx, ui);
  - `tools/`;
  - `audio/`;
  - `examples/max-i-telefon` (a complete 27-second reference project with voiceover).
- `references/story-to-scenes.md`: the script → scenes → shots method, the full JSON schema, and pacing.
- `references/characters.md`: cast options (skin, face, shirt, pants, hair, hats, accessories, held items) and the 26 expressions.
- `references/actions.md`: every action/clip, act fields, interactions (fights, hand-overs, throws, hugs), timing on words, and the upper-body layer.
- `references/camera.md`: shot sizes, moves, two-shots, OTS/POV, smart occlusion, shake, transitions, and the camera grammar.
- `references/sets-props-fx.md`: locations (`spots`), lighting presets, props, effects, looks, and custom sets/props in code.
- `references/quality-bar.md`: the non-negotiables (it must be animation, not a slideshow) and the QC checklist.
- `references/render-and-sound.md`: previews, final render, speed, auto SFX, music, mix, and delivery.

## Pipeline

### 1. Intake
Ask once, skipping anything the user already said:
- voiceover file (required);
- script (optional: plain or timestamped);
- aspect 16:9 / 9:16;
- resolution;
- look: `bright` (default), `cinematic`, `cartoon`, `horror`, or `retro`;
- captions (default on for 9:16);
- music on/off or own track;
- title.

### 2. Studio
If `roblox-3d-studio/render.mjs` is missing, follow `references/install.md`. Otherwise run `python tools/doctor.py` inside it. Never touch `razgon-2d-studio/` or other folders.

### 3. Project + timeline
Run inside `roblox-3d-studio/`:
```bash
python tools/new_project.py --name <slug> --voice "<audio>" [--script "<txt>"] --aspect 16:9 --resolution 1080p --style bright --title "<title>" [--captions]
```
Then build the timeline with one of these, depending on the script:
- **Timestamped script:** `python tools/parse_script.py --project projects/<slug> --script <file>`.
- **Plain script:** `python tools/transcribe.py --project projects/<slug> --script projects/<slug>/input/script.txt --lang <ru|en|…> --model small`.
- **No script:** the same command without `--script`.

Read `timeline/transcript.txt`, then run `python tools/beats.py --project projects/<slug>` (it writes `timeline/beats.json` and a draft `story/shots.json`).

### 4. Breakdown: script → scenes → shots
Read `references/story-to-scenes.md` and work through these steps:
1. Write `story/bible.md`: the logline; the cast (one signature colour/item each); the locations with a layout sketch in studs (who stands where, paths, `spots`); the act/music plan.
2. Write `scenes/cast.js` (`references/characters.md`).
3. Write `story/shots.json`:
   - `scenes` with actors, acts anchored on seconds or `"w": "word"`, props and fx;
   - `shots` with `cam`, `speaker`, `text`, transitions and `line`;
   - a `music` plan.

Every shot must contain visible motion. Run `node render.mjs --project projects/<slug> --catalog` to see every available action, set, item, expression, light, shot size, move and fx.

Tell the user in 5–10 lines: the cast, the locations, the scene and shot count, and the highlights.

### 5. Build and QC (loop)
1. `node render.mjs --project projects/<slug> --sheet --quality draft --scale 0.5` → open every `build/sheets/sheet_XX.png`.
2. Check motion inside shots with `--stills t1,t2,t3` (moments inside an action: wind-up, impact, landing).
3. For short motion previews use `--from A --to B --quality draft --scale 0.5` (writes `build/preview.mp4`). Make a contact strip with `ffmpeg -i build/preview.mp4 -vf fps=4,scale=320:-1,tile=6x4 -frames:v 1 build/strip.png` and look at it.
4. Fix against `references/quality-bar.md`: framing, occlusion, actors standing too far apart for a hit, feet through props, wrong facing, dead shots without motion, text overlaps. Repeat until clean.

For things the declarative format can't express, add JS in `scenes/*.js`:
- `sceneHook(id, {build, update})`;
- `shotHook(id, {update, overlay})`;
- `defineSet`, `defineItem`, `defineClip`;
- or a fully custom `registerShot`.

See `references/sets-props-fx.md` → "Custom code".

### 6. Preview checkpoint
Render 15–30 s with `--quality final --scale 0.5` and send it (or the sheets) to the user before the long render. Quote the ETA (`references/render-and-sound.md`).

### 7. Final render, sound, delivery
1. Final render: `node render.mjs --project projects/<slug>`. For anything over ~1 min, run it in the background with `nohup … > build/render.log 2>&1 &` and poll the log, which prints fps and ETA.
2. Auto SFX: `node render.mjs --project projects/<slug> --events`, then `python tools/auto_sfx.py --project projects/<slug>`. This places footsteps, swishes, hits, landings, pops and whooshes on the exact animation frames. Add hand-placed `sfx`/`amb` where the story needs them.
3. Mix: `python audio/mix.py --project projects/<slug>` (voice + music ducked + SFX, −14 LUFS) → `out/<title>.mp4`.
4. QC the final file: duration, an audio stream, and a 1-frame-per-5-s contact sheet. Then send the MP4 and say where it is saved.

## Defaults and judgement calls
- Keep **12–22 shots per minute**, with a median shot of 2–4 s. Fast action (chases, fights) cuts at 0.8–2 s. Never hold a static frame: if the camera is `static`, the actors must be moving.
- Open each new location with an establishing shot (`establish`/`wide` with `rise`/`crane`/`orbit`). Use close-ups for emotions, low angles for threats or heroes, and high angles for defeat.
- Keep each character's look identical for the whole video, and keep screen direction consistent within a scene (`rel:false` world azimuths help).
- When the narration names an action ("he jumps", "бам!"), anchor that act on the word (`"w": "прыжок"`), so the picture lands on the voice.
- Prefer the declarative scene format. Write custom JS only for special set-pieces.
