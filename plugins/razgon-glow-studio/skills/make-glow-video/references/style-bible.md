# Style bible: the Glow look

Follow this closely. It describes the target look, measured from reference frames of soft-lit "What if…?" explainer videos. No reference images ship with the plugin; this page and the engine (`engine/glow.js`, `glowsets.js`, `glowui.js`, `styles.js`) are the reference.

## The look in one paragraph
Simple hoodie characters with **big round black heads**, two small **white oval eyes** (no mouth most of the time), short rounded hoodies in muted colours, **thin black stick legs** and round black mitten hands, outlined by a **thin cream or warm edge light** that matches the scene's key light. They act inside **soft, gently lit 2.5D vector places**: flat shapes with mild 2-tone shading and no outlines, one key light per scene (a porch sconce, a window, a low sun, a street lamp, a monitor) that throws a **big soft pool of light** on the wall, glowing practicals, (in the `soft` style) a milky haze on far layers, **shallow depth of field** (blurred backgrounds, sometimes blurred foreground grass), slow camera drifts and push-ins, a soft bloom and almost no grain. Colours are calm and slightly desaturated: lavender-grey and navy at night, grey-blue offices, peach sunsets, pink-mauve dusk parks, near-black rooms lit by a white screen. Numbers appear as **small dark pills with an orange value**, studies as a **dark navy card with two bars, an "≈ 3×" badge and a tiny citation**. Signs are **handwritten** (marker on paper, chalk on boards, a finger on fogged glass). The overall feel: quiet, curious, cosy, observational — a thought experiment watched through a soft lens.

## Characters (`engine/glow.js`)
- **Proportions (adult, `s = 1` ≈ 290 units tall):** head radius 44 (≈ 30% of the height, about as wide as the torso), hoodie ≈ 41%, legs ≈ 34%. Builds: `adult`, `kid` (shorter body and legs, relatively bigger head), `tall`, `stocky`. The head overlaps the top of the hoodie; there is no visible neck.
- **Head:** near-black circle with a faint sheen toward the light, tinted by the key light (warm near lamps, cool in offices). Never draw a nose, ears or hair outline (exceptions: `hat: 'bun' | 'ponytail'`, readable only through the edge light).
- **Eyes = the acting.** Two white ovals, placed off-centre toward where the character looks (`turn` + `look`). Default lids are half-closed and calm (`neutral`, `calm`). Expressions (`GEXPR`): `neutral calm open look happy joy smile content sly smirk bored sleepy angry determined sad worried guilty nervous scared surprised shocked awe sideEye thinking confused closed cry love tiny`. Happy = white arcs `^ ^`; sly = half lids with a lifted lower lid; sad/worried = outer corners dropped; surprised/shocked = larger open ovals + a tiny white "o" mouth. A mouth appears only for strong emotions or when a character speaks a quoted line (`talk`).
- **Blinks:** `blink: blinkAt(t, period, seed)`, different period per character (2.6–3.8 s).
- **Hoodie:** rounded rectangle, darker hem band, faint kangaroo-pocket line, two white drawstrings, hood down (collar mound behind the head) or **hood up** (`hood: 'up'`, frames the head). Other tops: `sweater tee jacket coat labcoat dress none`. Accessories: `hat: witch|cap|beanie|headphones|party|crown|bun|ponytail`, `glasses: true|'sun'`, `cape`, `patch` (chest badge), `scarf`, `costume: 'ghost'` (white sheet with eye holes).
- **Signature colour:** every recurring character = ONE muted hoodie colour, identical in every shot. Good set (from the reference): taupe `#857062`, mustard `#c8a868`, lilac `#9a86b8`, purple `#7a5ab0`, slate `#7d8aa8`, coral `#a24b49`, teal `#69b39e`, olive `#5e7441`, navy `#4a5a8a`, pink `#c86a9a`, blue `#4a6ab8`. Background people: same rig, `dim: 0.5`, smaller, blurred with the background.
- **Edge light on every character:** `rim: { color: M.rim, dir: [dx, dy] }`, `dir` pointing toward the key light. It is thin (≈ 3 px at 1080p) all around, a little stronger on the lit side. It is what separates black heads from dark backgrounds, so never switch it off in lit scenes.
- **Poses** are angles (`GPOSES`): `stand relaxed handsOnHips handOnHip wave point pointUp pointDown reach give holdFront holdUp carry cheer shrug crossArms think phone facepalm handsOnHead scared sad guilty sneak hug typing crouch jump sit sitFront sitPhone lie`. Use `gPosesAt(t, [[0,'stand'],[0.6,'reach']])` for changes, wrap standing/sitting figures in `idle(pose, t, 1, seed)` so nobody is frozen, `gWalk(phase, {run})` + `turn: 0.85` for walking (walk: phase = t × 2π × 0.9, x += ~110–160 units/s × s).
- **Framing:** mostly **front or three-quarter** views (`turn` 0–0.4), eyes doing the looking. Profiles (`turn` ≈ 0.85) for walking and side conversations. Back views (`back: true`, or `bigGlow(..., {back: true})`) for over-the-shoulder shots toward a screen or window.
- **Invisible person** (the signature trick): `invisible: 0..1` fades the fill and leaves a glowing outline + white eyes (`edgeColor`). Use it for "nobody is watching", ghosts, memories, imagined people.
- **Props in hand:** `prop: 'phone'|'mug'|'bucket'|'apple'|'coin'|'paper'|'book'|'bag'|'umbrella'|'candy'|'kettle'|'pen'` (or `{type, color, hand:'B'}`).
- **Close-ups:** `bigGlow(g, cx, cy, R, {outfit, expr, look, turn, rim, rimSide, back})` — head radius 200–280 at 1080p, head in the upper-middle, shoulders cropped by the frame bottom, background = the same set blurred (`blurLayer(g, 6–9, g => set(...))`).
- **Screen people:** `blobby(g, x, y, s, colour, {wave})` — the soft blobby avatars shown inside monitors, phones and diagrams ("YOU").

## Sets (`engine/glowsets.js`)
- **Ready-made places** (each returns `{GY, M, …anchors}` and draws everything behind the characters): `porch` (night house porch: siding, red-curtained window, door + wreath, sconce, railing, steps, pumpkins, candy bowl on a pedestal table, handwritten sign), `kitchen` (office break room: window + city, menu poster, cork board, subway tiles, counter, mug tree, kettle, PAY HERE box), `farmStand` (sunset field, sun, puffy clouds, fence, telephone pole, striped awning stand, crates of apples/pears, chalk sign), `park` (pink dusk, soft skyline, autumn blob trees, lamps, benches, path, falling leaves), `monitorRoom` (dark room, glowing monitor with content callback, keyboard), `fogWindow` (fogged glass over a blurred night city — write on it with `fogWriting`), `bedroom`, `street`, `classroom`, `studio` (soft gradient backdrop for explanations).
- **Invent new places from the pieces** (`siding windowCurtain door wallLamp railing steps pumpkin pedestalTable candyBowl handSign tiles counter menuPoster corkBoard mugTree kettle honestyBox cloud sunDisc fieldRows fence telePole awningStand crate chalkSign blobTree bench streetLamp skylineSoft house car monitor keyboard desk fogGlass bed nightLamp plant frame bookshelf chair fridge clockWall`) + atmosphere (`lightPool softShadow haze bokeh leaves steamWisp`). Put new sets in `scenes/sets/<name>.js` with the same signature.
- **Shape language:** flat fills, soft linear gradients (lighter top, darker base), rounded corners, **no outlines**, soft contact shadows (`softShadow`), no textures except planks, tiles, field rows and slats. Props are simple and slightly chunky.
- **Value structure:** mid-tone walls (not dark, not white) lit by a big soft pool from the key light; floors darker toward the camera; 1–3 glowing practicals. Characters stand where their heads read: a black head in front of a lit wall, a window or a sky.
- **Clean, juicy colour (default `vivid`):** bright saturated walls, skies and hoodies, clean blacks; haze is a style setting (`S().haze`), not something to paint into scenes by hand.
- **Depth:** far layers blurred (`blurLayer`, 3–10) and hazed (`haze`), the character plane sharp, sometimes blurred foreground grass/railing/plants (`fg` from motion.js, blur 12–20). Close-ups: whole set blurred.
- **Atmosphere in most shots:** floating light motes, falling leaves outdoors in autumn, steam from cups, bokeh behind glass, soft dust in light pools.

## Light and colour (`engine/styles.js`)
- **Moods** (pick per location; take every colour from `M = mood(...)`): `porch` (night, warm sconce), `office` (cool daylight), `sunset` (peach, low sun), `park` (mauve-pink dusk), `dark` (black room, white screen), `rainy` (blue night, bokeh), `day`, `home` (warm evening interior), `school`, `data` (navy backdrop for cards). Legacy moods (`golden dusk night storm interiorWarm interiorCool void`) still work.
- Mood keys: `sky[] ambient key rim wall wall2 trim floor floor2 dark practical grass road fog haze leaf[]`.
- **Styles:** `vivid` (default: saturated, clean, no haze — viewers' eyes stay on it), `soft` (the hazy reference), `clear` (soft palette, no haze), `nocturne` (cooler, deeper), `peach` (warm, nostalgic), `pastel` (lighter, family), `crisp` (more contrast, for Shorts). Each sets a lift/gamma/gain grade, saturation, vignette, grain and a **soft 2D bloom** (`grade.glow`, per-shot override `"glow": 0..1`).
- One key light per shot, shown and spilled: `wallLamp`, `streetLamp`, `sunDisc`, windows and screens already pour `lightPool`s; add more pools where the light should land.

## Camera
Calm and continuous. Every shot moves a little: slow push-ins (z 1.0 → 1.06–1.12), lateral drifts (±20–70), gentle `drift()` on holds. Faster moves only for reveals (`camPath` through a key word, `travel`). Push into props when they matter (the poster in the example goes z 1.25 → 1.6). Keep the director pass (`director-pass.md`) for weight, transitions and kinetic type, but the Glow tempo is softer: fewer shakes, almost no smash cuts, more `fade`, `dip`, `push` and soft `whip`.

**Shot vocabulary** (rough proportions):
1. **Establishing wide** (15%): the place with small figures, slow push. Opens each scene.
2. **Group / two-shot** (25%): front-facing characters in a row or facing each other, eyes doing the acting.
3. **Close-up** (`bigGlow`, 15%): reactions, sly looks, realisations; blurred set behind.
4. **Over-the-shoulder / back view** (10%): `bigGlow(..., {back:true})` in front of a screen, a window, a poster.
5. **Insert** (15%): the poster, the sign, the bowl, the price list, a phone — big, simple, pushed into.
6. **Data moment** (as needed): `pill`/`countPill` for percentages, `statCard` for study comparisons + `cite`, `meterBar`, `tag`.
7. **Invisible / imagined** (signature, 1–3 per video): outlines with eyes, ghosts fading in or out.
8. **Screen-in-screen** (as needed): `monitorRoom` with `blobby` avatars, labels like "YOU".
9. **Handwriting moment**: `fogWriting` on glass, `handSign` reveals, `chalkSign`.
10. **Chapter title** (`chapter`) at chapter changes, **title card** after the hook, **end card** with the question.
11. **3D** (optional, ≤ 1 per minute): `glowFigure3D` in a `three-kit` stage for big spaces.

**Letterbox:** none by default (full frame). `bars` still works per shot if wanted.

## Editing and transitions
Hard cut by default (75%+). `fade` and `dip` for time and place changes, `push` for returning to a place, soft `whip` for energetic jumps, `iris` into round things (an eye, a lens, a clock), `match` for shape rhymes (a head → the moon, a bowl → a pie chart). `flash` and `smash` only for real shocks.

## On-screen graphics and typography (`engine/glowui.js`)
- **Fonts:** Montserrat (`FONTS.sans`/`title`, Latin + Cyrillic) for titles, labels and posters, spaced caps; Caveat (`FONTS.hand`) for handwriting on signs, chalkboards and fogged glass; Nunito (`FONTS.ui`) for small UI text and captions; Playfair Display italic (`FONTS.serif`) for the end-card question.
- **Numbers:** every number the narrator says appears, synced with `wordTime()`: a `pill` with an orange value (`S().ui.gold`) on a dark rounded plate, counting with `countPill`. Studies: `statCard` (two bars with tiny icons, `≈ 3×` badge, citation) + optionally `cite` in the corner.
- **Prices and lists** live on paper inside the world (`menuPoster`: dark ink rows, muted red prices), not floating in the air.
- Keep text minimal: at most one card or two labels at once; no sentences except titles, the question and signs that exist in the world.
- Pop graphics in with a soft spring (built in) and a `pop`/`blip` SFX; fade them before the cut.

## Story conventions
"What if…?" thought experiments, psychology and behaviour studies, everyday science: a concrete scene → a twist (someone disappears, a rule changes) → the measured result as a number → a second, different scene that confirms it → the study card → the question to the viewer. Explainers, history and documentary scripts use the same vocabulary.

## Don't
No thick outlines, no realistic shading on characters, no photos, emoji or clip-art, no pure white or pure black full-frame backgrounds (except the monitor room), no harsh contrast or heavy grain, no lip-sync for the narrator, no walls of text, no hard-coded colours that ignore `mood()`/`S()`, no outfit colour changes, no floating figures (always on `GY` with a contact shadow), no `Math.random()`/`Date.now()` in scenes (use `rng(seed)` and `t`), no more than ~5 characters in focus.

## 9:16 vertical rules
The stage is 1080×1920 (`E.vertical`). Use `V(landscape, vertical)` for every aspect-dependent size and position (all sets and UI already do). Closer framing, characters in the middle third, `bigGlow` close-ups dominate; captions sit at ~79% of the height (`captions: true`), so keep faces and cards above it. Check a `--sheet` in 9:16 before rendering.
