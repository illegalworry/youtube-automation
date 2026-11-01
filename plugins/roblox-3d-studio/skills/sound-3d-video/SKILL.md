---
name: sound-3d-video
description: "This skill should be used when the user runs /sound-3d-video or asks to \"add sound effects to the 3D video\", \"auto SFX\", \"add music\", \"change the music mood\", \"use my own music\", \"music too loud/quiet\" or \"remix the audio\" for a Roblox 3D Studio project. It places SFX on the animation automatically (footsteps, hits, landings, whooshes) plus hand-placed cues and ambience, plans generated music, mixes under the voiceover and muxes the final MP4."
metadata:
  version: "1.0.0"
  author: Razgon
---

# /sound-3d-video: auto SFX, music, mix

Inside `roblox-3d-studio/`, read `../make-3d-video/references/render-and-sound.md` ("Sound"), then:

1. **Auto SFX:** run `node render.mjs --project projects/<slug> --events` then `python tools/auto_sfx.py --project projects/<slug>` (re-run after any change to acts).
2. **Story cues:**
   - Add hand-placed shot `sfx` for things the engine can't know (doors, phone ring, `riser` before reveals, `stinger` on twists).
   - Add `amb` beds per location (`city`, `wind`, `rain`, `roomtone`, `murmur`).
3. **Music:**
   - Use `story.music` sections that follow the story turns, or `config.music.file` for the user's own track.
   - Audition a mood with `python audio/music.py --mood action --dur 20 --out build/test.wav`.
   - Levels: `config.music.gainDb`, `duckDb`, `config.sfx.gainDb`.
4. **Mix:** run `python audio/mix.py --project projects/<slug>` (needs `build/video_silent.mp4` to mux), check the result, and send `out/<title>.mp4`.
