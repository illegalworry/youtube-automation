# Lyric Cards Studio

Karaoke lyric videos in the "song + animated UI cards" format (square 1080×1080 and vertical 1080×1920, 60 fps).

- `engine/` — page with background, karaoke lyrics (word-by-word fill), card library (`cards.js`), particles, progress bar.
- `projects/<name>/config.json` — audio, artist, title, formats; `song.js` — words with start times + one card per line.
- `tools/analyze.py` — loudness envelope and beat grid (drives pulses and equaliser).

```
npm install
python3 tools/analyze.py projects/ija
node render.mjs --project projects/ija                    # -> out/ИЙА_square.mp4
node render.mjs --project projects/ija --fmt vertical     # -> out/ИЙА_vertical.mp4
node render.mjs --project projects/ija --stills 2,9,15    # quick PNG checks
```
Word timings were taken with faster-whisper (`language="kk"`) and matched to the lyrics by hand.
