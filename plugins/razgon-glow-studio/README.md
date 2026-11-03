# Razgon Glow Studio

Turn any voiceover into a finished **soft-lit 2.5D "What if…?" video**: simple characters with big round black heads, two white oval eyes, muted hoodies with drawstrings, thin stick legs and a thin warm edge light, acting out the narration in cosy, gently lit places — a night porch on Halloween, an office kitchen with an honesty box, a farm stand at sunset, a city park at dusk, a dark room lit by a monitor, a fogged-up window. Numbers pop up as small dark pills with an orange value, studies as navy cards with two bars and a citation, signs are handwritten, and people can turn **invisible** (a glowing outline with eyes).

It is a separate, upgraded successor of **Razgon 2D Studio**: the same tested pipeline (Whisper timestamps, frame-by-frame render, director pass with camera paths, weight and designed transitions, generated music and SFX), with a new character rig, a new set library, new graphics, seven new styles and a soft 2D bloom. It installs into its own folder (`razgon-glow-studio/`) and never touches Razgon 2D Studio or its projects.

Every frame is drawn by code. No image or video AI is used, so characters stay consistent and text stays sharp. Visuals are invented for each script; the style stays the same.

## What you can say
- "Make a glow video from this voiceover": runs the whole pipeline.
- `/glow-new-video`: set up a video, timestamp the narration, plan the shots.
- `/glow-styles`: see your own shots in 7 looks (Vivid — default, Soft Glow, Clear, Nocturne, Peach Hour, Pastel Air, Crisp), pick one or design your own.
- `/glow-render`: build and check the scenes, preview, render the final video.
- `/glow-sound`: music moods, sound effects, ambience, final mix.

## What's new compared with Razgon 2D Studio
- `engine/glow.js`: the Glow character (`drawGlow`): adult/kid/tall/stocky builds, 29 eye expressions with lids (half-lidded calm, sly, happy arcs, worried, shocked…), hood up/down, drawstrings, pocket, sweaters/tees/jackets/coats/lab coats, witch hat, cap, beanie, headphones, glasses, capes, chest patches, a ghost-sheet costume, 30 angle-based poses + a walk/run cycle, 12 hand props, an **invisible** mode (outline + eyes), back views, giant close-ups (`bigGlow`) and tiny screen avatars (`blobby`).
- `engine/glowsets.js`: 10 ready-made places (porch, kitchen, farmStand, park, monitorRoom, fogWindow, bedroom, street, classroom, studio) and ~45 pieces (siding, curtained windows, wreathed doors, sconces, railings, pumpkins, candy bowls, subway tiles, menu posters, cork boards, mug trees, honesty boxes, striped awnings, fruit crates, chalk signs, blob trees, benches, lamp posts, monitors, fogged glass with finger writing…), light pools, haze, bokeh, falling leaves.
- `engine/glowui.js`: number pills that count, study cards with bars/icons/≈ badge/citation, chapter titles, title and end cards, tags, bubbles, meter bars, arrows.
- `engine/three-kit.js`: `glowFigure3D` for 3D establishing shots.
- Styles: `vivid` (default: juicy, no haze), `soft`, `clear`, `nocturne`, `peach`, `pastel`, `crisp`, 10 new moods, soft 2D bloom, full frame by default.
- Fonts with **Cyrillic**: Montserrat, Caveat (handwriting), Nunito, Playfair Display.
- Mix defaults: music −6 dB with −7 dB ducking; `CHROMIUM_PATH` support for pre-installed browsers.
- Reference project `examples/honesty-box` (8 shots, 24 s) used as the install self-test.

## Inputs and options
Voiceover (any common format), optional script (timestamped or plain), 16:9 or 9:16, 720p–4K, optional captions, generated or own music, 36 SFX.

## First-time setup (automatic)
Claude copies the bundled studio into your project folder (`razgon-glow-studio/`) and installs ffmpeg, Node packages (renderer, Three.js, fonts), a headless Chromium, and Python's numpy, scipy and faster-whisper. About 1 GB of disk.

## Render times
The 24-second example renders as a 360p preview in about 1.5 minutes on 4 CPU threads; 1080p takes roughly 4× longer per frame, 4K about 16×.

No API keys or connectors are required.

---

## Коротко по-русски
**Razgon Glow Studio** — отдельный плагин (старый Razgon 2D Studio не изменён). Делает ролики в мягком «What if…?»-стиле: чёрные круглые головы с белыми овальными глазами, худи приглушённых цветов со шнурками, ноги-палочки, тонкий тёплый контур; уютные локации (крыльцо ночью, офисная кухня, фермерский прилавок на закате, парк в сумерках, комната с монитором), «невидимки»-контуры, оранжевые проценты в тёмных «таблетках», тёмно-синие карточки исследований, рукописные таблички, сочные яркие цвета по умолчанию (стиль `vivid`, без тумана), размытие фона.

Команды: «сделай glow-видео из этой озвучки» (весь цикл), `/glow-new-video`, `/glow-styles`, `/glow-render`, `/glow-sound`. Поддерживается кириллица в надписях.
