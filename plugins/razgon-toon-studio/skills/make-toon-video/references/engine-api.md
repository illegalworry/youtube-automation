# Engine reference

## Folder layout
```
razgon-toon-studio/
  render.mjs  player.html  package.json
  engine/   core.js styles.js rig2d.js fx2d.js ui2d.js three-kit.js player.js motion.js
  tools/    doctor.py verify_kit.py new_project.py transcribe.py parse_script.py beats.py common.py
  audio/    dsp.py sfx.py music.py mix.py
  engine/toon.js toonsets.js toonui.js   (the Toon look)
  examples/dollar-show/   (reference project: scenes + story)
  projects/<slug>/
     config.json   input/ (voiceover, script, music)   timeline/ (words, sentences, beats)
     story/shots.json  story/bible.md   scenes/cast.js  scenes/sets/*.js  scenes/shots/*.js
     build/ (sheets, stills, styles, parts, music.wav, mix.wav, video_silent.mp4)   out/<title>.mp4
```
Every `.js` under `scenes/` is loaded automatically (files starting with `_` are skipped). Import the engine with absolute paths (`'/engine/core.js'`) and project files relatively (`'../cast.js'`).

## config.json
`{ title, aspect: "16:9"|"9:16", resolution: "720p"|"1080p"|"1440p"|"2160p", fps: 24, style: "toon", voiceover, script, duration, captions: bool, captionStyle?: {y,size,max}, bars: "none" (default)|"wide"|"scope"|number, fadeIn: 0.5, fadeOut: 0.8, music: {enabled, gainDb, file?, seed?, key?}, sfx: {enabled, gainDb}, loudness: -14 }`

## story/shots.json
```json
{ "title": "…", "duration": 312.4,
  "shots": [ { "id": "s001", "start": 0, "end": 3.4, "line": "spoken words", "scene": "what we see", "set": "cafe",
               "bars": null, "in": {"type": "cut|fade|dip|dipWhite|flash|whip|zoom", "dur": 0.4, "dir": 1},
               "sfx": [{"at": 0.4, "name": "buzz", "gain": -10}], "amb": {"name": "murmur", "gain": -26},
               "params": {}, "vignette": true, "captions": true, "mb": 0, "notes": "" } ],
  "music": [ {"start": 0, "end": 42, "mood": "mystery", "intensity": 0.4} ],
  "sfx": [ {"t": 120.5, "name": "impact", "gain": -6} ] }
```

## Shot modules
```js
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, wordTime, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';          // skeleton + poses only
import { drawToon, bigToon, toonHeadPos, toonBubble } from '/engine/toon.js';
import { schoolLot, backyard, toonCar } from '/engine/toonsets.js';
import { labelBox, sticker } from '/engine/toonui.js';
import { camPath, camAdd, drift, impact, posesSpring, fg } from '/engine/motion.js';
import { MAX, JAY } from '../cast.js';

registerShot('s02', { draw(g, t, info) {              // 2D: g = canvas ctx in logical units, t = seconds into the shot
  const cam = camAdd(camPath(t, [[0, { z: 1.6, y: 150 }], [info.dur, { z: 1.7, y: 160 }]]), drift(t, 5, 3));
  const { GY, CX, front } = schoolLot(g, t, cam);      // location draws its own parallax layers
  layer(g, cam, 1, g => {
    drawToon(g, { x: CX - 90, y: GY, s: 1.35, facing: 1, outfit: MAX, pose: breathe(POSES.stand, t), expr: 'smile' });
    drawToon(g, { x: CX + 90, y: GY, s: 1.35, facing: -1, outfit: JAY, pose: posesSpring(t, [[0, POSES.relaxed], [0.4, POSES.handsOnHead]]), expr: t > 0.45 ? 'wince' : 'grin' });
  });
  front(g);                                            // things in front of the actors (ropes, pillar)
  fg(g, cam, g => toonCar(g, CX + 700, GY + 300, 1.5, '#3f8a55', { side: -1 }), { depth: 1.8, blur: 14 });
}});
```
`info = { dur, globalT, p, line, shot, ...shot.params }`. An exception inside a shot is printed to the console and drawn as red text on the frame, so check the render output. Camera: `cam.y > 0` looks lower (toward the floor), `cam.z` zooms around the frame centre.

## toon.js — characters
- `drawToon(g, {x, y, s, facing, pose, rot, outfit, expr, talk, blink, look:[x,y], rim:{dir, color, w}|false, alpha, prop, shadow, shadowA, trail})`.
- Outfit: `{top: hoodie|tee|jacket|sweater|tank|none, color, color2, pants, stripe|false, shoes, head: cap|capBack|beanie|headband|hood|afro|bun|ponytail|short|spiky|headgear|none, headColor, hairColor, face: glasses|sunglasses, gloves, headphones, kid}`.
- Expressions: `neutral smile grin happy joy excited surprised shocked awe scared worried nervous angry determined sad cry smirk sly squint wince sleepy thinking confused`.
- Props: `phone cash headphones box cup book mic ball {type:'sign', text, w, h, size, rot, dx, dy}` (`hand: 'B'` for the far hand).
- `bigToon(g, cx, cy, r, {outfit, expr, talk, blink, look, rimSide, rimColor, glow, tilt, front, side})` giant close-up. `toonFace(g, x, y, r, o)`, `toonHeadPos(o) → [x, y, r]`, `toonBubble(g, x, y, str, {k, size, tail})`, `toonShadow(g, x, y, rx, ry, a)`.

## toonsets.js — locations and pieces
- Locations `(g, t, cam, o) → {GY, CX, M, front}`: `schoolLot({mood, sign, cars, lightsOn})`, `garage`, `backyard({balloons, shed})`, `boxingGym({label}) → +deck`, `undergroundParking({pillar, pillarX, pillarLabel, exit})`, `classroom({board, onBoard(g,x,y,w,h)})`, `street({mood})`, `bedroom({night})`. `LOCATIONS` maps names to functions. `tGround()` = the shared ground line.
- Pieces: `toonSky(g, M, {sun:[x,y,r], clouds:[[x,y,s]]})`, `cloud`, `sunGlow`, `toonTree(g, x, base, s, M, seed, {trunk, w, h})`, `bush`, `lawn(g, y0, M)`, `toonWindow(g, x, y, w, h, M, {inside, glass, night, cols})`, `brickFacade(g, M, {x0, x1, top, base, rows, winW, winH, step, door, sign})`, `toonHouse(g, cx, base, s, M, {wall, roof})`, `picketFence(g, x0, x1, top, base, M)`, `balloon(g, x, y, r, col, t)`, `toonCar(g, x, base, s, col, {side, front, lightsOn, glass})`, `parkingLot(g, y0, M, {stalls})`, `toonFloor(g, y0, M, {color, boards, tiles})`, `brickWall(g, x0, y0, x1, y1, base, line)`, `hangingBulb(g, x, ceil, len, M, t)`, `pendantLamp(g, x, y, M)`, `nightWindow`, `woodDoor`, `cardboardBox(g, x, base, w, h)`, `shelfUnit`, `bikeOnWall`, `broom`, `ringBack/ringFront`, `concretePillar(g, x, base, w, h, M, {label})`, `garageCeiling`, `softEllipse(g, x, y, rx, ry, col, a)`, `lightPool`, `lamplight`.

## toonui.js — flat graphics
`labelBox(g, t, str, x, y, {start, out, size})`, `toonTitle(g, t, lines, {y, size, color, start, out})`, `paperNote(g, t, str, x, y, {rot, color})`, `sticker(g, t, str, x, y, {start, r, color})`, `counter(g, t, {from, to, start, dur, x, y, prefix, suffix, label})`, `arrow(g, t, from, to, {start})`, `toonEnd(g, t, {lines, bg, cta})`. All pop in on a spring at `start` and fade at `out`.

## Core, rig, FX and UI API (logical units: 16:9 → 1920×1080, 9:16 → 1080×1920)
- **core.js:** `E` (W, H, PX, fps, vertical, cfg, words, shots), `V(h, v)`, `clamp lerp prog ease{linear,in,out,inOut,sine,outBack,outElastic} key(t, [[t,v],…], ease) mixVal rng(seed) noise(x, seed) shake(t, amp, freq, seed) talkAmount(globalT, from, to) wordTime(word, afterGlobalT)`, colour `rgb css mix alpha shade`, `mood(name) S() setStyle`, draw `rr seg poly circle ring linGrad radGrad glow fillRect backdrop veil text measure FONTS`, camera `layer(g, cam, depth, fn) blurLayer(g, amount, fn, cam?, depth?)`, `registerShot getShot`.
- **rig2d.js** (skeleton; the old stick look is kept only for compatibility — use toon.js): `drawFigure(g, {x, y, s, facing, pose, rot, outfit, expr, talk, blink, look:[x,y], rim:{color, dir, w}, dim, alpha, prop, shadow, trail})`. Poses: `POSES.{stand, relaxed, talk, explain, point, pointUp, wave, cheer, handsOnHead, crossArms, think, shrug, holdFront, phone, reach, sad, facepalm, ready, crouch, sit, sitBack, kneel, lie(+rot), dive(+rot), kick, jump, fall}`, plus `posesAt, blendPose, breathe, walkPose(phase, {run})`, `face(g, x, y, r, {expr, talk, blink, look, front})`, `bigFace(g, cx, cy, r, {outfit, expr, talk, blink, look, rimColor, rimSide, tilt})`, `headPos(o) → [x, y, r]`, `soccerBall(g, x, y, r, rot)`. Props: `phone, ball, paper, cup, paddle, pointer, tablet, flashlight`. Outfit: `top: hoodie|labcoat|trench|jersey|tshirt|suit|dress|tracksuit|none, color, color2, legs, head: cap|capBack|beanie|fedora|headband|visor|hood|ponytail|bun|curly|spiky|none, headColor, face: glasses|sunglasses, gloves, number, kid`. Custom poses are plain objects with the 11 points; edit a copy (`{...POSES.sit, hF:[34,-188]}`).
- **fx2d.js:** `rain drops dust snow stars fog sun moon godRays lightCone pool lensStreak sparkle lightning speedLines rings skyline hills clouds tree pine lampPost windowFrame facade door chair stool counter screen bed clock floorLines crowd`.
- **ui2d.js:** `titleCard bigLine badge readout callout dimension dataCard compareBars meter blueprint bpStroke lineFigure bubble endScreen captions`.

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
`T.stage({mood, fov, fog:[near, far], sky, keyPos, keyIntensity, ambient, bloom})` → `{scene, camera, composer, sun, add(...objs), render(), dispose()}`. Builders: `box cyl cone sphere plane ground(w, d, color, tex) planks tiles windowPane(w, h, {glowColor, cols, rows, power, interior}) shaft(w, len, color, opacity) building(w, h, d, {color, win, lit}) tree3D pine3D crowd3D({rows, perRow, width, step, rise, colors}) figure3D(outfit, {rim, pose, s}) → .setPose(pose)`, `mat basic canvasTex`, and cameras `orbit(camera, t, {target, radius, height, from, to, dur})` and `dolly(camera, t, [[t, {pos, look, fov}], …])`. Units are metres, a figure is ~1.7 m and faces +x. 3D shots get the same grade, bars and grain automatically. 3D figures are the old stick style; in the Toon look prefer 2.5D sets and use 3D only for big fly-overs with bright, flat colours.

