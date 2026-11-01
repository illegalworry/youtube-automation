# Sets, light, props, effects, looks, custom code

Always run `node render.mjs --project P --catalog` for the live list. The tables below describe the defaults.

## Sets (`scene.set`, `scene.setOpts`)
Each set builds a location around the origin and returns named **spots** (`"at": "spot:door"`). The default camera side is +Z, and interiors are open toward +Z. Units are studs (an avatar is 5 tall).

<!-- SETS_TABLE -->

Mix sets with extra props (`scene.props`) to make each location specific. For example: a classroom plus a `cake` on the teacher desk; a park plus a `tent` and a `campfire`.

## Light (`scene.light`)
`day, golden, sunset, night, interior, storm, studio, space, cave, spooky`

- Each preset sets the sky gradient, sun colour/direction and shadows, ambient, fog, exposure and bloom.
- Override parts with `"lightOverride": { "exposure": 1.2, "fog": ["#…", 30, 150] }`.
- Light is per scene, so time-of-day changes become scene changes (e.g. `golden` for "вечером").

## Looks (global grade, `config.style`)
| Look | Character |
|---|---|
| `bright` | clean, saturated Roblox (default) |
| `cinematic` | teal-orange, contrast, vignette, light grain |
| `cartoon` | extra saturation, soft |
| `horror` | desaturated, crushed, heavy vignette and grain |
| `retro` | faded warm 2008 look |

## Props (`scene.props`)
```json
{ "id": "car1", "item": "car", "at": [x, z] | [x, y, z] | "spot:x", "face": 90, "s": 1.2, "y": 0, "opts": { "color": "#2d7be0" },
  "move": [[t0, [x, z]], [t1, [x, z]]], "show": [t0, t1], "spin": 90 }
```
- `move`: keyframed path with auto-facing along the motion; wheels spin on cars.
- `show`: visible only between t0 and t1.
- `spin`: degrees per second for items with a spinning part (coin, gem, portal).
- Common `opts`: `color`, `s` (size), `text` (sign, tv, computer, whiteboard), `light`/`on` (lamps), `state` (trafficLight: red/yellow/green), `lit` (building windows), `seed`.
- Item list: `--catalog` → items. It covers:
  - hand-held: sword, lightsaber, bat, phone, cup, pizza, book, flashlight, ball, soccer, wand, gun, shield, money, key, microphone, torch, pickaxe;
  - world: tree, pine, bush, rock, flower, lamppost, bench, chair, table, desk, sofa, bed, tv, computer, door, fence, crate, barrel, cone, sign, coin, gem, chest, trophy, gift, cake, spawn, portal, platform, lava, ladder, whiteboard, bookshelf, fridge, counter, plant, lamp, car, house, building, trafficLight, campfire, tent, mailbox, hydrant, rocket;
  - plus the extra set props.

## Effects (`scene.fx`, deterministic particles)
| type | when | notes |
|---|---|---|
| `flash` | one-shot | star flash (impacts, magic) |
| `burst` / `stars` / `coins` | one-shot | flying shards / floating stars / coins |
| `confetti` | one-shot | celebrations |
| `dust` / `smoke` | one-shot | landings, cars, poofs |
| `sparkle` / `hearts` | one-shot | magic, love |
| `explosion` | one-shot | flash + fire balls + smoke + debris (`size`) |
| `ring` | one-shot | shockwave ring on the ground |
| `rain` / `snow` / `embers` / `motes` / `bubbles` | ambient | follow the camera; no `t` needed |
| `fire` | ambient | needs `at` (campfire, torch, burning car) |

- `at` can be an actor (`"max"` = chest), `"max.head"`, `"max.chest"`, `"max.feet"`, a spot, `[x, y, z]` or `[x, z]`.
- `t` (global seconds) or `"w": "word"`; `count`, `color`, `size`, `speed`, `seed`, `follow: true` (fx moves with the actor).
- Fights add flash + debris automatically. Falls add dust.

## Custom code (when JSON is not enough)
Files in `projects/<slug>/scenes/*.js` are loaded automatically (except names starting with `_`). Import from `/engine/...`:
```js
import { sceneHook, shotHook, defineCast } from '/engine/director.js';
import { defineSet, put, room } from '/engine/world.js';
import { defineItem } from '/engine/items.js';
import { defineClip, definePose, kp } from '/engine/anim.js';
import { THREE, part, cyl, ball, plastic, neon } from '/engine/r3d.js';

// a one-off location
defineSet('pizzeria', (st, o) => { room(st, { w: 40, d: 30, wall: '#f2d8b0' }); put(st, 'counter', 0, -10); put(st, 'table', -8, 2); return { spots: { counter: [0, -8], table: [-8, 4] } }; }, { light: 'interior', desc: 'pizza place' });
// a new prop
defineItem('pizzaBox', o => part(2.4, 0.4, 2.4, '#f2efe6', [0, 0, 0], { base: true }));
// a new animation clip (pose keys: see avatar.js conventions)
defineClip('stomp', { dur: 1.2, loop: true, expr: 'angry', fn: (lt, c) => ({ legL: [Math.max(0, Math.sin(lt * 9)) * 40, 0, 4], kneeL: Math.max(0, Math.sin(lt * 9)) * 60, armL: [20, 0, 25], armR: [20, 0, 25], elbowL: 90, elbowR: 90 }) });
// extra per-frame logic on a declarative scene (rt.actors[id].av is the avatar, rt.props[id].obj the prop)
sceneHook('lab', { build(rt) { rt.glow = part(1, 1, 1, neon('#3af0ff'), [0, 3, 0]); rt.stage.add(rt.glow); }, update(rt, t) { rt.glow.rotation.y = t * 2; rt.glow.position.y = 3 + Math.sin(t * 3) * 0.3; } });
// draw 2D graphics over one shot
shotHook('s012', { overlay(g, lt) { /* canvas 2D, logical 1920x1080 */ } });
```
- A fully custom shot: `registerShot(id, { kind: '3d', init(R3D) { … return { stage } }, draw(state, lt), overlay(g, lt) })` (import `registerShot` from `/engine/core.js`, `stage` from `/engine/r3d.js`).
- Determinism: never use `Math.random` or `Date.now`. Use `rng(seed)` / `noise(x)` from `/engine/core.js`. Everything must be a pure function of time, because frames render out of order in parallel workers.
