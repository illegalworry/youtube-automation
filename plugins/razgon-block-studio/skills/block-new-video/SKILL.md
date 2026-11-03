---
name: block-new-video
description: "This skill should be used when the user runs /block-new-video or asks to \"start a new game-style video\", \"set up a What If video from this voiceover\", \"pick the world for my video\", \"timestamp my voiceover\", \"import my SRT/timestamped script\", or \"plan the shots for my script\" in the Razgon Block Studio. It covers intake, world choice from the title, installing or checking the studio, creating the project, word-level timestamps (Whisper or the user's script), and the retention-driven story breakdown with the shot list."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /block-new-video: intake → world → install → timeline → story breakdown

Stages 1–4 of the Razgon Block Studio pipeline. Shared references are in `../make-block-video/references/` (relative to this skill's base directory); the studio kit is `../make-block-video/kit/`.

## 1. Intake
Ask once (AskUserQuestion when available), skipping what the user already said: **voiceover** (required), **script** (timestamped / plain / none), **title**, **aspect** 16:9 or 9:16, **resolution** 720p / 1080p / 1440p / 2160p, **music** generated / own / none, **SFX** on/off. Captions are on by default.

## 2. World
Run `python tools/pick_world.py --title "<title>"` inside the studio (or read `../make-block-video/references/worlds.md` if not installed yet). Tell the user: "World: voxel — the title mentions Minecraft" (or blocky/royale). Respect an explicit user choice.

## 3. Studio, project and timestamps
If `razgon-block-studio/render.mjs` doesn't exist, follow `../make-block-video/references/install.md`; else run `python tools/doctor.py`. Then:
```bash
python tools/new_project.py --name <slug> --voice "<voiceover>" [--script "<script>"] --aspect <16:9|9:16> --resolution <res> --title "<title>" [--style auto|blocky|voxel|royale]
```
Timestamped script → `python tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.<ext>`. Plain script → `python tools/transcribe.py --project projects/<slug> --script projects/<slug>/input/script.txt --lang <code> --model small` (≥ 90 % match). No script → `python tools/transcribe.py --project projects/<slug> --lang <code> --model small`. Check `timeline/transcript.txt`, then `python tools/beats.py --project projects/<slug>` (`--force` to overwrite).

## 4. Story breakdown
Read `worlds.md`, `retention-playbook.md`, `style-bible.md` and `story-breakdown.md` fully, then write `story/bible.md` (world, who "you" is, cast with gamer names, locations, open loop + payoff, chapters, rules, colour plan, easter eggs, 3 hook options → pick one, music plan), `scenes/cast.js`, the full `story/shots.json`, and `captionStyle.emph` in config.json. Send a 5–10 line summary (world, cast, hook, shot count, highlights). Next step: `/block-styles` (or continue with `make-block-video` for the whole video).
