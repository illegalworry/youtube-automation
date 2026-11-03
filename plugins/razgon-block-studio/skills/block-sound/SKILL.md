---
name: block-sound
description: "This skill should be used when the user runs /block-sound or asks to \"add music\", \"add sound effects\", \"make it sound like a game\", \"the music is too loud/quiet\", \"use my own music\", \"remix the audio\", or \"redo the soundtrack\" for a Razgon Block Studio video. It plans mood-based generated music (bouncy, panic, triumph…), places game SFX on every visual event, mixes them under the voiceover with ducking and loudness normalisation, and muxes the final MP4."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /block-sound: music + SFX + mix

Work inside `razgon-block-studio/`. Read `../make-block-video/references/sound-design.md`.

1. **Music plan** in `story/shots.json` → `music`: contiguous sections. `bouncy` for normal game life, `panic` for countdowns / red alarms / chases, `triumph` for wins, `mystery` for the "how did this happen" flashback if it's eerie. No dead air anywhere. Audition: `python audio/music.py --mood bouncy --dur 20 --out test.wav`. Own track: `config.music.file`.
2. **SFX on every visual event** (`sfx` per shot, `at` = seconds into the shot): `pop` UI cards, `pagetear` DAY flips, `typing` with typewriter captions, `notify`/`click` pop-ups, `alarm` red looks, `glitch`/`rewind` transitions, `boing` jumps, `bonk` hits/deaths, `sizzle` lava, `respawn` forcefields, `coin`/`levelup` rewards, `crunch`/`place_block` voxel digging, `whoosh`/`swish` camera moves. List: `python audio/sfx.py --list`; audition: `--demo build/sfx_demo`. Max ~2 cues at the same instant.
3. **Levels:** `config.music.gainDb` ≈ −6, `duckDb` ≈ −7 (dense bed like the competitor), `config.sfx.gainDb` ≈ −6; master −14 LUFS.
4. `python audio/mix.py --project projects/<slug>` → `build/mix.wav` and, if `build/video_silent.mp4` exists, `out/<title>.mp4`. Listen to the hook and one alarm section; adjust and re-mix (no re-render needed).
