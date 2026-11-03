# Engine reference

## Folder layout
```
razgon-glow-studio/
  render.mjs  player.html  package.json
  engine/   core.js styles.js glow.js glowsets.js glowui.js motion.js player.js three-kit.js
            rig2d.js fx2d.js ui2d.js   (legacy stick-figure rig, FX and UI from Razgon 2D Studio — still usable)
  tools/    doctor.py verify_kit.py new_project.py transcribe.py parse_script.py beats.py common.py
  audio/    dsp.py sfx.py music.py mix.py
  examples/honesty-box/    (reference project: 8 shots, 24 s — porch, office, farm stand, park)
  projects/<slug>/
     config.json   input/ (voiceover, script, music)   timeline/ (words, sentences, beats)
     story/shots.json  story/bible.md   scenes/cast.js  scenes/sets/*.js  scenes/shots/*.js
     build/ (sheets, stills, styles, parts, music.wav, mix.wav, video_silent.mp4)   out/<title>.mp4
```
Every `.js` under `scenes/` is loaded automatically (files starting with `_` are skipped). Import the engine with absolute paths (`'/engine/core.js'`) and project files relatively (`'../cast.js'`).

## config.json
`{ title, aspect: "16:9"|"9:16", resolution: "720p"|"1080p"|"1440p"|"2160p", fps: 24, style: "vivid", voiceover, script, duration, captions: bool, captionStyle?: {y,size,max}, bars: null|"wide"|"scope"|"none"|number, fadeIn: 0.5, fadeOut: 0.8, music: {enabled, gainDb (default −6), duckDb (default −7), file?, seed?, key?}, sfx: {enabled, gainDb}, loudness: -14 }`

## story/shots.json
```json
{ "title": "…", "duration": 312.4,
  "shots": [ { "id": "s001", "start": 0, "end": 3.4, "line": "spoken words", "scene": "what we see", "set": "cafe",
               "bars": null, "in": {"type": "cut|fade|dip|dipWhite|flash|whip|zoom", "dur": 0.4, "dir": 1},
               "sfx": [{"at": 0.4, "name": "buzz", "gain": -10}], "amb": {"name": "murmur", "gain": -26},
               "params": {}, "vignette": true, "captions": true, "mb": 0, "glow": null, "notes": "" } ],
  "music": [ {"start": 0, "end": 42, "mood": "mystery", "intensity": 0.4} ],
  "sfx": [ {"t": 120.5, "name": "impact", "gain": -6} ] }
```

## Shot modules
```js
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, wordTime, talkAmount } from '/engine/core.js';
import { drawGlow, bigGlow, gPosesAt, idle, gWalk, blinkAt, headPosG, handPosG, blobby } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';  import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd, spring, fg, kText } from '/engine/motion.js';
import { MAE, JUNE } from '../cast.js';

registerShot('s013', { draw(g, t, info) {            // 2D: g = canvas ctx in logical units, t = seconds into the shot
  const cam = camAdd(camPath(t, [[0, { z: 1.0, x: -30 }], [info.dur, { z: 1.06, x: 20 }]]), drift(t, 3, 2));
  const r = G.kitchen(g, t, cam, { steam: 0.6 });                     // draws the whole set behind the characters
  layer(g, cam, 1, g => drawGlow(g, { x: E.W * 0.5, y: r.GY, s: 1.6, facing: -1, outfit: MAE,
        pose: idle(gPosesAt(t, [[0, 'stand'], [0.4, 'give']]), t), expr: 'smile', prop: 'mug',
        rim: { color: r.M.rim, dir: [0, -1] }, blink: blinkAt(t, 3.1) }));
  const at = wordTime('fifty', info.shot.start - 0.2);                 // sync graphics to the narration
  UI.countPill(g, t, { to: 57, start: at != null ? at - info.shot.start : 1.0 });
}});
registerShot('s008', { kind: '3d',                   // 3D: init once (T = three-kit), draw per frame, optional 2D overlay
  init(T, info) { const st = T.stage({ mood: 'park' }); st.add(T.ground(40, 40, mood('park').grass)); st.hero = T.glowFigure3D(MAE, { rim: mood('park').rim }); st.add(st.hero); return { stage: st }; },
  draw(s, t, info, T) { s.stage.hero.walk(t * 6); T.orbit(s.stage.camera, t, { target: [0, 1, 0], radius: 6, height: 2.2, from: -0.6, to: 0.2, dur: info.dur }); },
  overlay(g, t, info, s) { /* 2D graphics on top, logical units */ } });
```
`info = { dur, globalT, p, line, shot, ...shot.params }`. An exception inside a shot is printed to the console and drawn as red text on the frame, so check the render output.

## glow.js — the characters
- `drawGlow(g, {x, y, s, facing, pose, turn, outfit, expr, look:[x,y], blink, talk, rim:{color, w, dir}|false, light:[dx,dy], back, invisible:0..1, edgeColor, edgeAlpha, alpha, dim, shadow, prop, rot, eyeColor, eyeScale, face:{lid,slant,low,sc,kind,mouth}})`. `y` = floor line (feet). `s` 1 ≈ 290 units tall (wide shots 0.9–1.3, medium 1.4–1.8). `turn` 0 front … 1 profile (default 0.3). `rot` for lying/falling (radians).
- `outfit = {top: 'hoodie'|'sweater'|'tee'|'jacket'|'coat'|'labcoat'|'dress'|'none', color, hood: 'up'|'down'|false, strings, pocket, stringColor, hat: 'witch'|'cap'|'beanie'|'headphones'|'party'|'crown'|'bun'|'ponytail', hatColor, hatColor2, glasses: true|'sun', cape, patch, scarf, costume: 'ghost', legs, build: 'adult'|'kid'|'tall'|'stocky'}`.
- Poses: `GPOSES.{stand relaxed handsOnHips handOnHip wave point pointUp pointDown reach give holdFront holdUp carry cheer shrug crossArms think phone facepalm handsOnHead scared sad guilty sneak hug typing crouch jump sit sitFront sitPhone lie}`. A pose = `{aF:[upper, elbow], aB, lF:[thigh, knee], lB, lean, hx, hy, ht, seat, air, front}` (angles in radians; 0 = hanging down; + rotates toward the facing side). Make custom ones with `{...GPOSES.point, aB: [0.8, -2]}`.
- Helpers: `gpose(name)`, `blendG(a, b, k)`, `gPosesAt(t, keys, blend)`, `idle(pose, t, amt, seed)`, `gWalk(phase, {run})`, `blinkAt(t, period, seed)`, `headPosG(o) → [x, y, r]`, `handPosG(o, 'F'|'B') → [x, y]`, `figureHeight(o)`, `eyes(g, cx, cy, R, o, colour)`, `GEXPR`, `BUILDS`.
- `bigGlow(g, cx, cy, R, {outfit, expr, look, blink, talk, turn, rim:{color, w}, rimSide: -1|1, light, tilt, back, shoulders})` — giant head + shoulders.
- `blobby(g, x, y, s, colour, {wave, facing, eyes, shadow})` — soft screen avatars.

## glowsets.js — places and props
- Sets `fn(g, t, cam, o) → {GY, M, …}`: `porch {halloween, table, sign, bowl, doorOpen, lamp, railing, steps, wreath} → {tableX, tableTop, lampX}`, `kitchen {menu:{title, rows, img, imgH, reveal}, box, boxLabel, coins, mugs, kettle, steam, cork, window, s, dof} → {counterY}`, `farmStand {stand, chalk, dof} → {standX, tableY, HZ}`, `park {bench, benchX, lamp, lampX, leaves, dof} → {seatY, benchX, PY}`, `monitorRoom(g, t, cam, {screenX, power}, content(g, x, y, w, h)) → {deskY, screen}`, `fogWindow {fog} → {glass}`, `bedroom {lamp}`, `street {car, lamp, lampOn, dof}`, `classroom {board(g,x,y,w,h), dof}`, `studio {spot}`. All take `mood` to override the mood.
- Pieces: `siding windowCurtain door wallLamp railing steps pumpkin pedestalTable candyBowl handSign tiles counter menuPoster corkBoard mugTree kettle steamWisp honestyBox cloud sunDisc fieldRows fence telePole awningStand crate chalkSign blobTree bench streetLamp skylineSoft house car monitor keyboard desk fogGlass fogWriting bed nightLamp plant frame bookshelf chair fridge clockWall`.
- Atmosphere: `lightPool(g, x, y, r, colour, a, squashY)`, `softShadow(g, x, y, w, h, a)`, `haze(g, y0, y1, colour, a)`, `bokeh(g, t, {area, colors, count})`, `leaves(g, t, {colors, count, speed})`.
- Text fitting: `fitSize(g, str, size, maxW, font, weight)` (posters, boxes and signs already auto-fit long words).
- Handwriting: `handSign(g, x, y, ['PLEASE', 'TAKE ONE'], {w, h, size, ink, tilt, easel, reveal})`, `chalkSign(g, x, y, lines)`, `fogWriting(g, 'Rule 6', x, y, {size, reveal})`.

## glowui.js — graphics
`pill(g, t, '57 %', x, y, {start, end, size, color})`, `countPill(g, t, {from, to, suffix, prefix, dec, start, dur, x, y})`, `statCard(g, t, {x, y, w, h, bars:[{label, v, color, icon, value}], badge, cite, title, start, end})` + `icons.{flower eyes coin person heart clock}`, `cite(g, str, {t, start, a})`, `tag(g, t, 'YOU', x, y, {start, end, plate})`, `chapter(g, t, {num, title, start, dur})`, `titleCard(g, t, {title, sub, start, dur})`, `bubble(g, x, y, {str, icon, thought, tail, t, start, end})`, `meterBar(g, t, {label, v, x, y, w, start})`, `arrow(g, t, p0, p1, {start, bend})`, `endCard(g, t, {question, cta, start})`. Captions still come from `ui2d.captions` (config `captions: true`).

## Core API (logical units: 16:9 → 1920×1080, 9:16 → 1080×1920)
- **core.js:** `E` (W, H, PX, fps, vertical, cfg, words, shots), `V(h, v)`, `clamp lerp prog ease{linear,in,out,inOut,sine,outBack,outElastic} key(t, [[t,v],…], ease) mixVal rng(seed) noise(x, seed) shake(t, amp, freq, seed) talkAmount(globalT, from, to) wordTime(word, afterGlobalT)`, colour `rgb css mix alpha shade`, `mood(name) S() setStyle`, draw `rr seg poly circle ring linGrad radGrad glow fillRect backdrop veil text measure FONTS {title, sans, ui, hand, round, serif}`, camera `layer(g, cam, depth, fn) blurLayer(g, amount, fn, cam?, depth?)` (nest-safe: you can blur a whole set), `registerShot getShot`.
- **Legacy (still available):** `rig2d.js` (`drawFigure`, `bigFace`, stick-figure `POSES`), `fx2d.js` (`rain drops dust snow stars fog sun moon godRays lightCone pool lensStreak sparkle lightning speedLines rings skyline hills clouds tree pine lampPost windowFrame facade door chair stool counter screen bed clock floorLines crowd`), `ui2d.js` (`titleCard bigLine badge readout callout dimension dataCard compareBars meter blueprint bpStroke lineFigure bubble endScreen captions`). Mix them in when useful (rain, snow, stars, blueprint diagrams, crowds), but characters must be Glow characters.

## motion.js (director pass — see director-pass.md)
```js
import { camPath, travel, drift, camAdd, spring, impact, squashAt, posesSpring, smear, fg, kText } from '/engine/motion.js';
```
- `camPath(t, [[t, {z, x, y, r}], …])` → cam; flows through middle keys (continuous velocity), soft ends.
- `travel(t, t0, t1, {accel, brake})` → 0..1 with short acceleration and long braking. `drift(t, amp, seed)` → tiny organic offset. `camAdd(a, b)`.
- `spring(t, t0, {freq, damp})` → 0, then overshoots 1 and settles. `impact(t, tHit, {amp, decay, len, squash})` → `{x, y, r, sq}`. `squashAt(g, x, y, sq, fn)`.
- `posesSpring(t, [[0, POSES.shrug], [0.6, POSES.point]], {freq, damp})` → pose with overshooting blends.
- `smear(g, dx, dy, fn, n)` → directional blur of one element. `fg(g, cam, fn, {depth, blur})` → soft parallax foreground.
- `kText(g, t, str, x, y, {start, mode: 'drop'|'rise'|'slam'|'spread'|'type', stagger, size, font, weight, color, glow, spacing, align, out})`.

## Transitions and motion blur (shots.json)
`"in"`: `cut | fade | dip | dipWhite | flash | zoom | whip {dir, vertical, dur, shutter} | push {dir, vertical, dur} | iris {at:[fx,fy], dur, r0} | match {from:[fx,fy], to:[fx,fy], scale, dur} | smash {dur}`. Coordinates are fractions of the frame.
`"mb": n` (or `{"n": 4, "shutter": 0.5}`) renders n sub-frames per frame for that shot (motion blur). Cost scales with n.

## three-kit.js (passed as `T` to `init`/`draw`)
`T.stage({mood, fov, fog:[near, far], sky, keyPos, keyIntensity, ambient, bloom})` (any Glow mood works) → `{scene, camera, composer, sun, add(...objs), render(), dispose()}`. Builders: `box cyl cone sphere plane ground(w, d, color, tex) planks tiles windowPane(w, h, {glowColor, cols, rows, power, interior}) shaft(w, len, color, opacity) building(w, h, d, {color, win, lit}) tree3D pine3D crowd3D({rows, perRow, width, step, rise, colors}) figure3D(outfit, {rim, pose, s}) → .setPose(pose)` (legacy stick figure), **`glowFigure3D(outfit, {rim, s, build}) → .walk(phase, amt) .arms(aF, aB)`** (Glow character in 3D), `mat basic canvasTex`, and cameras `orbit(camera, t, {target, radius, height, from, to, dur})` and `dolly(camera, t, [[t, {pos, look, fov}], …])`. Units are metres, a figure is ~1.7 m and faces +x. 3D shots get the same grade, bars and grain automatically. Keep exposure moody: let windows and lamps be the brightest things, and keep the floor dark.

