# Razgon Toon Studio

Turn any voiceover into a finished **bright flat cartoon video** in the "hoodie characters" look: big round black heads on thin necks, coloured hoodies (hood, drawstrings, pocket), track pants with a side stripe, white sneakers and a cream edge line, acting in clean 2.5D places — a brick school with a parking lot, a garage at night, a backyard with a picket fence and balloons, a boxing gym, an underground car park, a classroom, a street, a bedroom.

It is the successor of Razgon 2D Studio: the same tested pipeline (Whisper timestamps, frame-by-frame render, director pass with camera paths, weight, whip/push/iris/match/smash transitions, music and SFX), with a new character rig, a new set library, new flat graphics and five new styles.

Every frame is drawn by code. No image or video AI is used, so characters stay consistent and text stays sharp. Visuals are invented for each script; the style stays the same.

## What you can say
- "Make a toon video from this voiceover": runs the whole pipeline.
- `/toon-new-video`: set up a video, timestamp the narration, plan the shots.
- `/toon-styles`: see your own shots in 5 looks (Flat Daylight, Warm Afternoon, Bright Pop, Soft Pastel, Moody Evening).
- `/toon-render`: build and check the scenes, preview, render the final video.
- `/toon-sound`: music moods, sound effects, ambience, final mix.

## What's new compared with Razgon 2D Studio
- `engine/toon.js`: the hoodie character (`drawToon`), giant close-up (`bigToon`), 24 expressions incl. `><` wince, star eyes, sly half-lids; props (handwritten sign, cash, headphones, box, phone…), boxing gloves and headgear, speech bubbles.
- `engine/toonsets.js`: 8 ready-made locations + ~35 pieces (brick facade with windows, circle-cluster trees, boxy cars, parking lot, picket fence, house, balloons, bulbs, pendant lamps, ring, pillars…).
- `engine/toonui.js`: flat graphics — label box ("ROUND 1"), outlined titles, handwritten notes, price stickers, counters, arrows, end screen.
- 10 daylight/interior moods and 5 Toon styles; no letterbox by default; handwriting font.
- Reference project `examples/dollar-show` (9 shots, 28 s) used as the install self-test.

## Inputs and options
Voiceover (any common format), optional script (timestamped or plain), 16:9 or 9:16, 720p–4K, optional captions, generated or own music, 36 SFX.

## First-time setup (automatic)
Claude copies the bundled studio into your project folder (`razgon-toon-studio/`) and installs ffmpeg, Node packages (renderer, Three.js, fonts), a headless Chromium, and Python's numpy, scipy and faster-whisper. About 1 GB of disk.

## Render times
The 28-second example renders as a 360p preview in about 1 minute on 4 CPU threads; 1080p takes roughly 4× longer per frame, 4K about 16×.

No API keys or connectors are required.
