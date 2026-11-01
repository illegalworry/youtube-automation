# Actions (scene `acts`)

```jsonc
{ "who": "max",                // actor id in this scene
  "t": 13.1,                   // global start second … or anchor on a spoken word:
  "w": "погоню", "dt": -0.2,   // first word starting with "погоню" after the scene start, shifted by dt
                               // (no t and no w → starts when the actor's previous action ends)
  "do": "run",                 // the action (list below)
  "to": [1, -22.5],            // locomotion target ([x,z], [x,y,z], "spot:x", or an actor id)
  "path": [[6,-10],[6,-30]],   // or a multi-point route (walk around props!)
  "speed": 12, "dur": 2.0,     // locomotion: speed in studs/s (dur derived), others: duration / loop length
  "face": "lily",              // turn to an actor / degrees / [x,z] / "camera"
  "expr": "angry",             // expression from now on (persists)
  "target": "bacon",           // attacks: who gets hit (auto-faces, flash, debris, camera shake, reaction)
  "react": "knockback",        // victim reaction: hit (default) | knockback | fall | faceplant | stagger | oof | none
  "reactOpts": { "dist": 9, "h": 2 },   // e.g. knockback distance / height
  "item": "phone", "hand": "R",// put an item in the hand (at the act start; for pickUp at the grab moment); "item": null empties it
  "drop": true,                // empty the hand at t
  "say": true,                 // mouth moves on the voiceover words during this act
  "layer": "upper",            // force upper-body only (over walking); "base" forbids it
  "blend": 0.3,                // custom blend-in seconds
  "h": 3.2, "dist": 7, "from": "front", "turns": 2, "pose": "kneel"   // clip-specific (jump height, knockback distance, getUp side, spin turns, pose name)
}
```

## Catalogue (74 clips; `--catalog` shows the live list)
**Locomotion** (need `to` or `path`; the walk cycle matches the speed, and the actor faces the travel direction):
- `walk` 6/s;
- `run` 14/s;
- `sprint` 20/s;
- `sneak` 3/s;
- `backstep` (walks backwards facing forward);
- `scaredRun` (arms flailing);
- `swim`;
- `fly` (superhero; give `[x,y,z]` targets);
- `climb` (ladder: `[x,y,z]` targets).

**Jumps and falls:**
- `jump` (in place or `to` with `h`);
- `fall` (backwards, stays lying);
- `faceplant` (forwards, stays lying);
- `knockback` (flies back `dist`, lies);
- `getUp` (`from: "front"` after a faceplant);
- `lie`, `sleep`;
- `oof` (the classic Roblox death: the body breaks into flying parts).

**Fighting:**
- `punch`, `uppercut` (launches), `kick`, `slash` (needs a sword), `push` — all with `target`;
- `block`;
- `hit` (recoil, step back);
- `stagger` (dizzy wobble).

**Gestures** (upper-body capable, so they combine with walking):
- `wave`, `point`, `clap`, `facepalm`, `shrug`, `think`;
- `talk` (+mouth), `shout` (+mouth), `phone` (+mouth);
- `nod`, `headShake`, `lookAround`, `lookUp`, `scratchHead`, `salute`;
- `type` (keyboard), `eat`, `hold`.

**Emotions, full body:** `laugh`, `cry`, `scared`, `dizzy`, `sad`, `angry` (stomping), `tired` (hands on knees), `yawn`, `stretch`.

**Celebration and dance:** `cheer`, `celebrate`, `victory`, `flex`, `bow`, `dab`, `dance`, `dance2`, `floss`, `spin`.

**Interaction:**
- `pickUp` (with `item`);
- `throw` (releases the held item and flies it to `to`/`target`);
- `highFive` (actors ~2.6 apart);
- `hug` (~2 apart);
- `handshake` (~3 apart).

**Postures** (they hold until the next act): `sit` (chair seat; on benches/sofas raise the actor's `at` y), `sitFloor`, `crouch`, `kneel`, `standUp`, `pose` with `"pose": "tpose|handsUp|armsCrossed|handsOnHips|pray|guard|…"` (POSES list in `--catalog`), `idle`.

Special non-motion acts:
- `{"do": "face", "expr": "shocked"}`: expression only;
- `{"do": "turn", "face": "max"}`: rotate on the spot;
- `{"do": "teleport", "to": [x,z]}`: jump between places, for cuts;
- `{"do": "say", "dur": 2}`: mouth only.

## How the engine combines acts
- Each actor plays one **base** act at a time, blended over ~0.2 s from the previous one. After a non-holding act ends, the actor relaxes into `idle`.
- **Upper-body** gestures that start during a walk or run play on the arms and head only, so the actor can wave while walking.
- **Holding** acts (`sit`, `lie`, the end of `fall`/`knockback`, `kneel`, `crouch`, `pose`) keep their pose until the next base act (e.g. `getUp`, `standUp`).
- **Attacks with `target`** automatically:
  - spawn a reaction on the victim at the impact frame (punch → `hit`, kick/uppercut → `knockback`, push → `stagger`), unless `react` says otherwise;
  - add a flash and debris at the victim's chest;
  - register an impact for camera shake and auto SFX.
- Landings (jump, fall, knockback) puff dust.
- Facing: locomotion faces its path. `face`/`target` turn the actor smoothly (0.28 s). Otherwise the actor keeps its last heading.

## Staging recipes
- **Meeting:** A walks to 3–4 studs from B (`to` a point in front of B), both `turn` to each other, then `wave`/`talk`.
- **Fight:**
  1. Attacker 3 studs from the victim, both facing.
  2. `punch` (`target`, `react: knockback`).
  3. The victim lies, gets `expr: dizzy`, then `getUp`.
  4. Insert `block`/`hit` exchanges for longer fights, alternating every 0.6–0.9 s.
- **Chase:** the runner `run`s a `path`; the chaser starts 0.5–1 s later at a higher `speed`. Put obstacles on the chaser's path and `jump` over them (`to` past the obstacle, `h` ≈ obstacle height + 0.5).
- **Hand-over:** at the same `t`, the giver gets `{"do":"face","drop":true}` and the receiver gets `{"do":"hold","item":"phone"}`.
- **Steal:** the thief `hold`s the item while the victim `drop`s it, then the thief `run`s away.
- **Crowd reaction:** stagger the extras' `laugh`/`cheer`/`scared` starts by 0.1–0.4 s, and vary loops (`dance` vs `dance2`).
- **Talking scene:** the speaker gets `talk` loops (`dur` = the line) with `say`, or a shot `speaker`. The listener gets `nod`/`think`/`shrug` reactions between lines.
- **Death gag:** `{"do":"oof"}`, then `teleport` the actor back and play `getUp` in a later scene for the respawn joke.
