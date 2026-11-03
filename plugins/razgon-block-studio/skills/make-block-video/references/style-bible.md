# Style bible: the Razgon Block look

Follow this closely together with `worlds.md` (which world) and `retention-playbook.md` (what happens every second). The reference project `examples/whole-town` shows every rule in working code; render its sheet once (`--sheet`) and a world grid (`--styles blocky,voxel,royale`) to see the look.

## The look in one paragraph
**Bright, saturated, flat vector game worlds with dark outlines and glossy highlights.** Front-facing blocky characters with huge round eyes act in places built from game pieces: cube clouds, a cube sun with rays, studded floors, cube trees, boxy cars, rows of colourful triangle roofs. The screen is dressed in **game UI** — rounded dark panels with small gold caps over big white words, numbered rule tiles, countdown rings, power gauges, name tags, chat bubbles, "You died" panels, VHS overlays — and **giant 1–2-word captions** with a thick outline sit low in the centre of every frame. Colour carries the story: blue/green normal, red alarm, grey death, night blue for flashbacks, gold for wins. No letterbox, no film grain, almost no vignette. The world skin (blocky / voxel / royale) changes with the topic; everything else stays.

## Characters (`engine/hero.js`)
- **Draw with `drawHero(g, {...})` and `bigHero(...)` only** (never `drawFigure`/`bigFace`, the old stick look).
- **Front-facing by default** (like the reference). `view: 'side'` + `facing` only for walking/running across, jumps along a path and profile two-shots.
- **Poses** (`HPOSES`): `idle relaxed wave cheer panic shrug tpose armsOut point pointUp think facepalm handsOnHead hold victory jump starJump fall flail sit sad crouch dab`. Snap between them with `heroSpring(t, [[0,'idle'],[0.6,'panic']])`; soft changes with `heroPoseAt`; always wrap in `heroIdle(pose, t)` so nobody freezes; `heroFlail` for panic; `heroWalk(phase, {run})` for side-view walking.
- **Expressions** (`HEXPR`, change ON THE WORD): `neutral smile happy grin laugh excited love surprised shocked scared worried nervous sly smug determined angry sad cry dead sleepy confused cool silly`. `nervous`/`scared`/`worried` add sweat drops automatically; `confused` adds `??`.
- **Signature rule:** the hero keeps ONE outfit all video (shirt colour + logo + hair). The hero gets a gamer `name` tag (and `hp` bar when health matters). Side characters get different hair/shirt colours and funny names; crowds are small and colourful.
- **Outfit:** `{ skin, hair: fringe|spiky|cap|beanie|long|bun|bald|helmet|quiff|bob|ponytail|none, hairColor, hatColor, shirt, logo: bolt|star|heart|stripe|num|none, logoColor, num, pants, shoes, acc: crown|headphones|cape, accColor, kid }`. Missing fields come from the world's `OUTFIT_DEFAULTS` (original looks — never a real game's default character).
- **Tools in hand:** `tool: pickaxe|sword|cube|phone|coin|potion|flag|bat`, `toolHand: 'R'|'L'`.
- **Scale:** wides `s` 0.8–1.1, mediums `s` 1.1–1.3 plus camera zoom 1.2–1.4, close-ups `bigHero(g, cx, cy, size)` with size 440–560 at 1080p (the head fills ~40 % of the frame height, shoulders cut by the frame bottom). Feet always on `GY` (or on a platform/roof). Use `lift` for jumps (shadow shrinks automatically).
- **Power moments:** `forcefield(g, x, y, r, t)`, star eyes, `floatText('+1 LIFE')`, sparkles.

## Locations (`engine/worldsets.js`)
`suburb`, `cityRow`, `bedroom` (`night`, returns `bedTop`), `rooftops` (`roofA/roofB`), `openSky`, `aerial` (`rowY`), `obby` (`platforms`, `kind: lava|checkpoint|ice`), `plains`, `cave` (`lava`), `island` (`loot`, `balloon`, `storm`), `voidStage`. All `(g, t, cam, o) → { GY, CX, M, front }`, `o.mood` = `gameDay | gameSunset | gameNight | gameAlarm | gameStorm | gameDead | gameCave | gameRoom | gameRoomNight`.
- Pieces for new places: `sky sun moon cloud tree bush ground house building skyline roofRow car mailbox fence floor wall bed nightstand roomWindow bunting poster platform lavaPool ore torch chest lootCrate stormWall buildWall` — compose them in `scenes/sets/<name>.js` with `layer(g, cam, depth, fn)`: sky 0.1 → skyline 0.3 → buildings 0.5–0.6 → props 0.8–0.9 → actors 1.0 → foreground 1.3–1.8.
- **Value structure:** bright and clean; big flat areas, details one shade darker/lighter, characters outlined so they always read. Stage the hero against sky or a light wall.
- Text in the world is short, caps, invented (`SCHOOL`, `MALL`, `FOOD`, `LAVA`).

## Colour = story
- Moods per location; switch the whole frame with `"look"`: `alarm` (danger, deadlines — can start mid-shot with `{type:'alarm', from: 1.4}` on the word), `dead` (died / lost), `night` (fallback darkening), `vhs` (flashback tape: PLAY label + timecode + scanlines).
- Styles (graded on top): `blocky`, `blockyPop`, `voxel`, `voxelDusk`, `royale`. Take every set colour from `M`/`S()` so worlds and styles switch cleanly.

## Camera
Every shot moves (director-pass.md): pushes into reactions, pull-backs for scale reveals, a camera that FOLLOWS the action (jump → the camera tilts up into the sky), whips between places, `impact()` on slams and landings. `cam.y < 0` looks up, `cam.x` follows movement.
**Shot vocabulary:** giant reaction close-up (15–20 %), medium hero on the street with UI (30 %), wide town/aerial scale reveal (10 %), UI full-frames (game tile, calendar, pop-up dialog, 10 %), action (jumps, falls, flights, 20 %), crowd/panic (5–10 %), end screen.

## Editing
Cuts 70 %+. Signature transitions: `rewind` into flashbacks, `pop` (zoom punch) into reveals and UI cards, `glitch` into system messages / server events, `whip` (also `vertical`) between places, `smash` for the biggest shock (max 1–2), `dip` for "that night".

## Graphics and type (`engine/gameui.js`)
`gameCaptions` (automatic), `ruleCard`, `dayCard`, `countdown` (`tickRate: 1` to tick), `starburst`, `gameTile`, `alertBanner`, `gauge`, `chatBubble`, `diedPanel`, `leaderboard`, `onoma` (comic SFX words), `bigWord` (multicolour letters), `titleSlam`, `popupDialog` (+ `cursor` click), `floatText`, `highlight` (red circle + arrow), `vhs`, `hotbar`, `itemIcon`, `hpShield`, `stormTimer`, `killFeed`, `winBanner`, `gameEnd`, `panel`, `gameText`.
Fonts: Lilita One (captions, big words), Nunito Black (panels), Press Start 2P (voxel panels, clocks, VHS), Luckiest Guy (royale). Every number the narrator says appears (synced with `wordTime()`); max 2 UI elements + the caption at once; keep the caption zone (y ≈ 0.68–0.8 H) clear of faces and UI.

## Don't
No stick figures, no moody low-key sets, no letterbox, no heavy grain, no photos/emoji art, no static shots, no floating characters (except jumps/flights), no outfit changes, no walls of text, no copied logos/characters/sounds from real games, no hard-coded colours that ignore `mood()`/`S()`, no `Math.random()`/`Date.now()`.

## 9:16 vertical
Stage 1080×1920, `V(landscape, vertical)` for aspect-dependent values. Closer framing; UI cards move below the top platform UI (the helpers already use `V()`); captions at ~0.68 H; ground line `GY = E.H * 0.7`. Check with `--sheet` before rendering.
