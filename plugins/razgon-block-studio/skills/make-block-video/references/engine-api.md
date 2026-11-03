# Engine reference

## Folder layout
```
razgon-block-studio/
  render.mjs  player.html  package.json
  engine/   core.js styles.js player.js motion.js            (runtime, styles/worlds, transitions, director toolkit)
            hero.js worldsets.js gameui.js                    (THE BLOCK LOOK: characters, locations, game UI)
            rig2d.js fx2d.js ui2d.js three-kit.js             (old stick-figure kit, kept for compatibility)
  tools/    doctor.py verify_kit.py new_project.py pick_world.py transcribe.py parse_script.py beats.py common.py
  audio/    dsp.py sfx.py music.py mix.py
  examples/whole-town/   (reference project: 13 shots, 31 s, hook → rewind → rules; no voice file)
  projects/<slug>/  config.json  input/  timeline/  story/{shots.json,bible.md}  scenes/{cast.js,sets/,shots/}  build/  out/
```
Every `.js` under `scenes/` loads automatically (`_` prefix = skipped). Import the engine with absolute paths (`'/engine/hero.js'`), project files relatively (`'../cast.js'`).

## config.json
`{ title, aspect, resolution, fps: 24, style: "blocky"|"voxel"|"royale"|…, world: null|"blocky"|"voxel"|"royale", voiceover, script, duration, captions: true, captionStyle: { mode: "game"|"classic", max: 2, size, y, emph: {"word": "#color"} }, bars: "none", fadeIn, fadeOut, music: {enabled, gainDb, duckDb, file?}, sfx: {enabled, gainDb}, loudness: -14 }`

## story/shots.json (per shot)
`id, start, end, line, scene, set, in, look, captions, capMode ("type"), capY (0..1), emph {word: colour}, sfx [{at, name, gain}], amb, params, mb, notes`.
- `"in"`: `cut | pop | glitch | rewind {dur, time} | whip {dir, vertical, dur} | push | iris {at} | match {from, to, scale} | smash | flash | dip | dipWhite | fade | zoom`.
- `"look"`: `"alarm" | "dead" | "night" | "vhs"` or `{type, from, dur, mode: 'play'|'rew'|'ff'|'pause', time: '2:00:00'}` (`from` = seconds into the shot when it fades in).

## Shot module
```js
import { E, V, registerShot, layer, blurLayer, veil, ease, prog, clamp, wordTime } from '/engine/core.js';
import { drawHero, bigHero, heroSpring, heroIdle, heroPoseAt, heroFlail, heroWalk, heroHeadPos, forcefield } from '/engine/hero.js';
import { suburb, cityRow, bedroom, obby, lavaPool } from '/engine/worldsets.js';
import { ruleCard, gauge, countdown, onoma, bigWord } from '/engine/gameui.js';
import { camPath, camAdd, drift, impact, spring } from '/engine/motion.js';
import { HERO, NAME } from '../cast.js';

registerShot('s10', { draw(g, t, info) {
  const tJ = (wordTime('jump', info.globalT - 1) ?? info.globalT + 2) - info.shot.start;      // shot-local time of a word
  const cam = camAdd(camPath(t, [[0, { z: 1.25, y: 90 }], [tJ, { z: 1.3, y: 100 }], [info.dur, { z: 1.1, y: -120 }]]), impact(t, tJ, { amp: 12 }));
  const { GY, CX } = suburb(g, t, cam, {});
  layer(g, cam, 1, g => drawHero(g, { x: CX, y: GY + 10, s: 1.2, outfit: HERO, name: NAME, t,
    pose: heroIdle(heroPoseAt(t, [[0, 'idle'], [tJ - 0.6, 'crouch'], [tJ, 'jump']], 0.2), t), expr: t < tJ ? 'determined' : 'excited',
    lift: t > tJ ? -ease.in(clamp((t - tJ) / 0.7)) * 1400 : 0 }));
  ruleCard(g, t, { n: 1, str: 'Jump 10x higher!', start: 0.05 });
  gauge(g, t, { value: 10, max: 10, label: 'JUMP', start: 0.6 });
}});
```
`info = { dur, globalT, p, line, shot, ...shot.params }`. Shot errors print in the render log and draw red text on the frame.

## hero.js
- `drawHero(g, {x, y, s, pose, facing, view: 'front'|'side', outfit, expr, look:[x,y], blink, talk, name, hp, tool, toolHand, lift, rot, squash, alpha, shadow, world, t})` — `t` animates sweat drops.
- `bigHero(g, cx, cy, size, o)` — head of width `size` centred at (cx, cy).
- Poses: `HPOSES`, `hpose(name)`, `heroPoseAt(t, keys, blend)`, `heroSpring(t, keys, {freq, damp})`, `heroIdle(p, t, amt, seed)`, `heroFlail(p, t, amt)`, `heroWalk(phase, {run})`, `heroBlend(a, b, k)`. Pose fields: `aL aR lL lR eL eR y tilt ht sit` (radians; arms 0 = down, π = up).
- `HEXPR`, `OUTFIT_DEFAULTS`, `heroGeo(world)`, `heroHeadPos(o) → [x, y, halfWidth]`, `forcefield(g, x, y, r, t, {color, alpha})`, `sweatDrop(g, x, y, r)`; helpers `starShape heartShape voxBox pixelTex roundBox gloss`.

## worldsets.js
Locations (see style-bible): `suburb({mood, car, carColor, label, lit, fgTree})`, `cityRow({mood, crowd, labels})`, `bedroom({night, mood, time, blanket, wallColor, door, rug}) → +bedTop`, `rooftops() → +roofA, roofB`, `openSky({roofs, sun})`, `aerial() → +rowY`, `obby({platforms:[[x,y,w,kind]]}) → +platforms`, `plains({flat})`, `cave({lava})`, `island({loot, balloon, storm: x})` (`front(g)` draws the storm), `voidStage()`. `PLACES` maps names → functions; `gGround()` = shared ground line.
Pieces: `sky(g, M, {stars, t}) sun(g,x,y,r,M,t) moon cloud(g,x,y,s,M) tree(g,x,base,s,M,seed) bush ground(g, top, M, {road, roadH, walk}) house(g,cx,base,s,M,{w,h,wall,roof,floors,chimney,shutters,lit,label,door}) building(g,x,base,w,h,M,{color,label,lit}) skyline roofRow car(g,x,base,s,M,{color,facing}) mailbox fence floor wall bed nightstand(…,{time}) roomWindow bunting poster platform(g,x,y,w,M,{kind,t}) lavaPool(g,x,base,w,M,t) ore torch chest lootCrate(…,{rarity, balloon}) stormWall(g,x,M,t) buildWall(…,{ghost})`, `RARITY`.

## gameui.js
`gameCaptions(g, globalT, captionStyle)` (called by the player), `panel(g,x,y,w,h)`, `gameText(g,str,x,y,{size,color,stroke,font,align,a})`, `ruleCard(g,t,{n,str,start,out,color,label,typeDur})`, `countdown(g,t,{value,start,tickRate,x,y,r,color,label})`, `starburst(g,x,y,r,col,t)`, `dayCard(g,t,{day,start,color,burst,icon:'drop'|'bars'|'skull'|'clock',label})`, `gameTile(g,t,{title,hi,players,thumb(g,x,y,w,h),press})`, `alertBanner(g,t,{str,start})`, `gauge(g,t,{value,max,label,start,fillDur})`, `chatBubble(g,t,str,x,y,{start})`, `diedPanel(g,t,{start,from,rate,title,sub})`, `leaderboard(g,t,{rows,head,hi})`, `onoma(g,t,str,x,y,{start,color,rot})`, `bigWord(g,t,str,x,y,{start,colors,size})`, `titleSlam(g,t,lines,{start,y,size})`, `popupDialog(g,t,{title,body,buttons,click,hi})`, `cursor(g,x,y,down)`, `floatText(g,t,str,x,y,{start,color})`, `highlight(g,t,x,y,r,{start})`, `vhs(g,t,{mode,time,noise})`, `hotbar(g,t,{items,sel,hp,max})`, `itemIcon(g,kind,x,y,s)`, `hpShield(g,t,{hp,shield})`, `stormTimer(g,t,{time,alive})`, `killFeed(g,t,rows,{start})`, `winBanner(g,t,{str,sub,start})`, `gameEnd(g,t,{question,start})`. All pop in on a spring at `start` (shot seconds) and fade at `out`.

## core.js additions
`W()` current world, `F('cap'|'panel'|'big')` world font, `FONTS.cap|pixel|comic`, `mood('gameDay')` default. Everything else as before: `E V clamp lerp prog ease key mixVal rng noise shake talkAmount wordTime rgb css mix alpha shade S setStyle rr seg poly circle ring linGrad radGrad glow veil fillRect backdrop text measure layer blurLayer registerShot`.

## motion.js (director pass)
`camPath(t, keys)`, `travel`, `drift`, `camAdd`, `spring(t, t0, {freq, damp})`, `impact(t, tHit, {amp})`, `squashAt`, `smear`, `fg(g, cam, fn, {depth, blur})`, `kText`. (`posesSpring` is for the old rig — use `heroSpring`.)

## Render flags
`node render.mjs --project P [--sheet] [--stills t1,t2] [--styles blocky,voxel,royale --at t1,t2] [--from A --to B] [--scale 0.5] [--workers N] [--format jpeg]`. Set `CHROMIUM_PATH=/path/to/chrome` when Playwright's own Chromium isn't installed.
