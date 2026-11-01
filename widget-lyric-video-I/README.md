# Widget video «И» — 9:16, 1080×1920, 120 fps, 90 Mbit/s

Full track (56.66 s, ~85 BPM, instrumental), iOS-widget style (same look as `widget-lyric-video/`).

Audio edits (`audio_fx.py`, then loudnorm to −14 LUFS / −1 dBTP):
- 22.66–23.36 s: low-pass sweep + −2.5 dB dip into the section at 23.36 (+1.2 dB lift after).
- 40.26–45.62 s: "underwater" break — low-pass ~650 Hz opening to 6 kHz, −5 dB rising back, noise riser from 43.14 s.
- 45.62–45.88 s: silence gap (freeze-frame), 45.88 s drop: sub-boom + noise impact, +2 dB decaying.
- 55.3 s → end: fade-out.

Render (4 parallel workers, frames are chunk-encoded then concatenated):
```bash
NODE_PATH=$(npm root -g) node render2.js full 0 1700 parts/p0.mp4   # ... 1700-3400, 3400-5100, 5100-6799
ffmpeg -f concat -safe 0 -i list.txt -i final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k out.mp4
```
The rendered MP4 (~640 MB) is not committed (GitHub 100 MB limit).
