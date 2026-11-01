# Render and sound

## Render commands (inside `roblox-3d-studio/`)
| Command | Output |
|---|---|
| `node render.mjs --project P --catalog` | everything usable in the story |
| `node render.mjs --project P --sheet --quality draft --scale 0.5` | `build/sheets/sheet_XX.png`: one still per shot (45% into it) |
| `node render.mjs --project P --stills 3.2,3.5,3.8 --quality draft` | `build/stills/`: exact moments |
| `node render.mjs --project P --from 10 --to 20 --scale 0.5` | `build/preview.mp4` |
| `node render.mjs --project P` | `build/video_silent.mp4`: the full video |
| `node render.mjs --project P --events` | `build/events.json` (for auto SFX) |

- Options:
  - `--workers N` (default: CPU threads/2);
  - `--quality draft|final` (draft: no bloom, no MSAA, harder shadows, about 2× faster);
  - `--format png|jpeg` (video default jpeg);
  - `--crf 18`;
  - `--style bright|cinematic|cartoon|horror|retro`;
  - `--debug` (shot id + time burned in).
- `config.json`: `resolution` (720p/1080p/1440p/2160p), `aspect`, `fps` (24), `style`, `quality`, `captions`, `fadeIn`/`fadeOut`, `music`, `sfx`, `loudness`.
- Chromium:
  - Playwright's own build is used when installed.
  - Otherwise `render.mjs` finds a preinstalled Chromium (`/opt/pw-browsers`, `~/.cache/ms-playwright`).
  - Or set `CHROMIUM_PATH`.
  - No GPU → SwiftShader (the Linux default).

## Speed guide (CPU, SwiftShader)
- About 1.7 frames/s at 720p `final` on a 4-thread cloud machine with 4 workers, and about 3 frames/s at `draft`. A 1-minute video at 720p final takes ~14 min.
- 1080p takes ~2× longer, and 4K ~6–8× longer. A desktop with a GPU (`--gl gpu`) is 5–20× faster.
- Each worker needs ~0.8–1.5 GB of RAM at 1080p.
- Long renders run in the background, `nohup node render.mjs --project P > P/build/render.log 2>&1 &`. Poll the log (fps + ETA) and report progress.

## Sound
1. **Auto SFX:** `node render.mjs --project P --events && python tools/auto_sfx.py --project P`. It writes global `story.sfx` cues marked `"auto"`; re-running replaces only those. Cues by trigger:
   - footsteps from the stride of each walk/run;
   - swish before strikes, `hit`/`impact` on contact;
   - jump swish + landing;
   - fall impacts;
   - throw whoosh;
   - pops for confetti/oof, `ding` for cheers;
   - whoosh on `whip`/`push` transitions.

   Shift the level with `--gain -3`; turn steps off with `--no-steps`.
2. **Hand-placed cues:** per shot `"sfx": [{"at": 0.3, "name": "riser", "gain": -8}]` (`at` = seconds from the shot start) and ambience beds `"amb": {"name": "city", "gain": -24}`.
   - Library: `whoosh, swish, impact, hit, riser, slowmo, freeze, tick, clock, heartbeat, pop, blip, counter, ding, shimmer, stinger, footstep, kick, whistle, carpass, phonebuzz, phonering, cheer, applause, murmur, rain, thunder, wind, roomtone, city, hum, powerup, glitch, flash, buzz` (`python audio/sfx.py --list`).
   - `name` can also be a path to the user's own WAV/MP3 inside the project.
3. **Music:** `story.music` sections `{start, end, mood, intensity}`.
   - Moods: `mystery, tension, action, wonder, hopeful, sad, triumph, playful, calm, dark, epic`.
   - Change sections at story turns.
   - Use the user's own track with `config.music.file = "input/music.mp3"`.
   - Levels: `config.music.gainDb` (−17 default) and `duckDb` (−9, music ducking under the voice).
4. **Mix:** `python audio/mix.py --project P` writes `build/mix.wav` (−14 LUFS) and muxes `out/<title>.mp4`.

## Delivery QC
- `ffprobe` duration ≈ `story.duration`, and an audio stream is present.
- Contact sheet: `ffmpeg -i out/<file>.mp4 -vf fps=1/3,scale=320:-1,tile=6x5 -frames:v 1 build/final_sheet.png`. Look at it.
- Send the MP4 to the user, say where it is, and offer the next tweaks (camera, pacing, music level).
