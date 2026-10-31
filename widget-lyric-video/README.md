# Widget lyric video («Рэперы тоже могут любить»)

iOS-style "widget" lyric video (Dynamic Island, pastel gradient, 3D-tilting cards, sparkles),
modelled on the visual style of a reference reel.

- **Music fragment:** 116.35 s → 156.35 s of the track (40.0 s): final double chorus.
  Drop lands at 0:01.08 of the video; it ends on the hook «Рэперы тоже могут любить».
- **Tempo:** ~92 BPM. Card cuts are snapped to kick onsets (`audio.json`).
- `out/repery_tozhe_mogut_lyubit_1080.mp4` — final 1080×1080, 30 fps, H.264 + AAC.

## Re-render
```bash
ffmpeg -ss 116.35 -t 40 -i track.mp3 -af "afade=t=in:d=0.03,afade=t=out:st=39.3:d=0.7" -ar 44100 cut.wav
NODE_PATH=$(npm root -g) node render.js full out/video.mp4      # full render
NODE_PATH=$(npm root -g) node render.js preview 3.2 12 25       # single frames
```
Title/artist/pill text are set in `CFG` at the top of the script in `scene.html`.
