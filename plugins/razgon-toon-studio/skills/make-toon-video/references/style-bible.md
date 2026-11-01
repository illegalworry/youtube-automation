# Style bible: the Razgon Toon look

Follow this closely. It is the only description of the target look. The reference project `examples/dollar-show` shows every rule below in working code; render its sheet once to see the look.

## The look in one paragraph
Bright, clean, **flat 2.5D vector cartoons in daylight**. Characters have a **big round pure-black head on a thin neck**, a **filled coloured hoodie** (hood behind the neck, two white drawstrings, kangaroo pocket, darker cuffs and hem), coloured sleeves ending in **round black mitten hands**, **dark track pants with a thin cream side stripe**, and **white sneakers**. A thin **cream edge line** traces the lit side of the whole silhouette. Faces are tiny and white: two small vertical oval eyes and a simple curved smile; expressions change on the beat (`><` wince, `o` mouth, star eyes, half-lidded sly look). They act in **everyday places drawn like a picture book for grown-ups**: brick schools with horizontal siding lines and rows of white-framed windows with diagonal reflections, trees made of clustered circles with lighter highlight blobs, boxy parked cars seen from behind, asphalt with stall lines, wooden picket fences with balloons, garages lit by one bulb, boxing rings, concrete car parks. Light is soft and believable (gentle gradients, soft contact shadows, warm light pools) but the palette stays **bright and saturated** — never murky. No letterbox, almost no grain, a very light vignette. The humour comes from acting, timing, signs and props (a cardboard "SHOW $1" sign in handwriting, cash, headphones, boxing gloves).

## Characters (`engine/toon.js`)
- **Draw with `drawToon(g, {...})`**, never `drawFigure` (that is the old stick look). Same skeleton as before, so `POSES`, `posesAt`, `posesSpring`, `breathe`, `walkPose` all work.
- **Proportions are automatic:** head r = 30 rig units on a ~15-unit neck, torso width ≈ 0.7 head width, full height ≈ 250 units at `s = 1`. Kids: `kid: true` (smaller body, relatively bigger head).
- **Outfit:** `{ top: 'hoodie'|'tee'|'jacket'|'sweater'|'tank'|'none', color, color2, pants, stripe (false = none), shoes, head: 'cap'|'capBack'|'beanie'|'headband'|'hood'|'afro'|'bun'|'ponytail'|'short'|'spiky'|'headgear'|'none', headColor, hairColor, face: 'glasses'|'sunglasses', gloves (boxing), headphones (around neck), kid }`.
- **Signature rule:** each recurring character = ONE saturated hoodie colour + ONE head item, identical all video. Good palette: green `#3f9a5a`, grey `#b8bcc2`, red `#d6533c`, yellow `#e8c04a`, teal `#5bb4c8`, purple `#9a5ad0`, blue `#3f63c8`, orange cap `#f08a2c`, blue cap `#3a6ee0`, red headband `#e0503a`. Vary pants (black `#24272e`, navy `#2c3a5a`, brown `#4a3a2c`, jeans `#2c4a8a`) and hair (afro, bun, cap) so a line-up reads at a glance.
- **Edge line:** on by default (`S().outline`, from the upper right). Point it toward the scene's key light with `rim: { dir: [dx, dy] }` (e.g. bulb on the left → `[-0.8, -0.5]`). `rim: false` only for silhouettes.
- **Expressions** (`TEXPR`): `neutral smile grin happy joy excited surprised shocked awe scared worried nervous angry determined sad cry smirk sly squint wince sleepy thinking confused`. Change them **on the word**. Blink every 2.5–4 s with a different period per character. `look: [x, y]` shifts the eyes toward what the character watches — always look at the prop or person that matters.
- **Talking:** only for quoted lines: `talk: talkAmount(info.globalT, a, b)`. Short exclamations go in `toonBubble(g, x, y, 'NO WAY!')` above the head (`toonHeadPos`).
- **Props in hand** (`prop`): `phone`, `cash`, `headphones`, `box`, `cup`, `book`, `mic`, `ball`, `{type:'sign', text:'SHOW $1', w, h, size}` (handwritten). Text props un-mirror automatically when `facing: -1`.
- **Close-ups:** `bigToon(g, cx, cy, r, { outfit, expr, look, rimSide, glow, tilt })` — the giant head on a thin neck with hoodie shoulders, drawstrings and hood collar. r ≈ 240–300 at 1080p, head a little left or right of centre, background = the location blurred (`blurLayer(…, 12–16)`) plus a very light veil. Use for reactions, "you" moments, money moments.
- **Scale:** wide shots `s` 1.2–1.4 (figure ≈ 30 % of frame height), medium shots via camera zoom 1.5–1.9 rather than giant `s`. Feet always on the ground line with the automatic soft shadow.

## Locations (`engine/toonsets.js`)
Ready-made: `schoolLot`, `garage`, `backyard`, `boxingGym` (returns `deck` for the fighters' y and `front()` for the ropes), `undergroundParking` (`{pillar: true, pillarX, pillarLabel}` adds a foreground pillar via `front()`), `classroom` (`onBoard` callback draws on the whiteboard), `street` (`mood: 'nightOut'` for lamps), `bedroom` (`night`). Each is `(g, t, cam, o) → { GY, CX, M, front }`.
Pieces for new places: `toonSky cloud sunGlow toonTree bush lawn toonWindow brickFacade toonHouse picketFence balloon toonCar parkingLot toonFloor brickWall hangingBulb pendantLamp nightWindow woodDoor cardboardBox shelfUnit bikeOnWall broom ringBack ringFront concretePillar garageCeiling softEllipse lightPool lamplight`.
- Invent new places from the script by composing pieces in `scenes/sets/<name>.js`; same return contract, layers at sky 0.15 → building 0.45–0.6 → trees 0.6 → cars/props 0.85 → floor 0.9 → actors 1.0 → foreground 1.6–1.9.
- **Value structure:** bright and readable. Large flat areas of mid-light colour (brick, sky, grass, wall), details in slightly darker/lighter steps of the same hue, black heads as the strongest dark. Stage heads against lighter areas (window, sky, wall) so they read.
- Typical places: school (lot, hallway, classroom, lockers, cafeteria), homes (bedroom, kitchen, garage, backyard), streets, shops, gyms, parks, parking garages, offices, hospitals. Keep text on buildings short and in caps (`HIGH SCHOOL`, `EASTSIDE BOXING`, `EXIT`, `B3`).

## Light and colour
- **Moods** (`mood(name)`): `sunny` (default day), `overcast`, `afternoon` (warm), `sunset`, `nightOut`, `garage` (night interior, one bulb), `gym`, `underground`, `indoorDay`, `indoorNight`. Extra tokens used by the pieces: `brick brickLine glass glassHi frame trim leaf[3] trunk wood woodDark concrete asphalt line shadow light sun cloud`.
- One key light per shot, shown softly: a bulb with `hangingBulb`, lamps with `pendantLamp`, the sun via sky gradient; spill it with `lightPool`/`softEllipse` on floor and wall. Never black, crushed scenes — even night interiors keep mid-grey walls.
- **Styles** (graded on top, `config.style`): `toon` Flat Daylight (reference), `toonWarm` Warm Afternoon, `toonPop` Bright Pop, `toonSoft` Soft Pastel, `toonEvening` Moody Evening. Take every colour from `M` / `S()` / the cast so switching styles works.

## Camera
Every shot moves (director-pass.md): slow pushes, lateral slides along a queue, tracking walks, a hit on a punchline. Camera convention: `cam.y > 0` looks **lower** (toward the floor) — use it with zoom for medium shots so feet/hands stay framed; `cam.x` follows walkers (`cam.x ≈ walkX * 0.8`).
**Shot vocabulary:** establishing wide (location + small figures), medium two-shot (side view, facing each other), close-up `bigToon`, insert (prop large: sign, cash, phone, headphones), queue/crowd wide, tracking walk with a foreground pillar/tree/car wiping past (`fg()` or `front()`), label moments (`labelBox('ROUND 1')`), money/number moments (`sticker`, `counter`), end screen.
**No letterbox** (`bars: "none"`). Vignette is light and automatic.

## Editing
Hard cuts by default (80 %+). `whip` between places with energy, `push` for returning, `dip` for "that night"/time skips, `smash` for a punchline shock (max 1–2), `fade` into the end screen. Keep screen direction (hero on the left facing right in conversations).

## Graphics and type (`engine/toonui.js`)
Flat and bold, never glowing: `labelBox` (black box, gold caps — round/chapter/day labels), `toonTitle` (white + gold heavy letters with thick dark outline and hard shadow), `paperNote` (handwritten tilted note), `sticker` (round coloured badge for prices/multipliers), `counter` (counting number with label), `arrow`, `toonBubble`, `toonEnd` (question + subscribe pill; draw the cast yourself). Fonts: Nunito Black for UI, `FONTS.hand` (Patrick Hand) for anything written by a character. Every number the narrator says appears, synced with `wordTime()`. Max 1–2 labels at once.

## Don't
No `drawFigure`/`bigFace` (old stick look), no dark moody low-key sets, no glowing titles, no letterbox, no heavy grain, no thick black outlines on sets, no photos/emoji/clip-art, no static shots, no floating figures, no outfit colour changes, no more than ~5 characters in focus, no hard-coded colours that ignore `mood()`/`S()`, no `Math.random()`/`Date.now()`.

## 9:16 vertical
Logical stage 1080×1920, `V(landscape, vertical)` for aspect-dependent values. Closer framing (medium shots and close-ups dominate), wides become tall stacks (sky → building → ground). Ground line `GY = E.H * 0.7`; keep faces and text in the central ~900×1500, captions at ~79 % height. Check with `--sheet` in 9:16 before rendering.
