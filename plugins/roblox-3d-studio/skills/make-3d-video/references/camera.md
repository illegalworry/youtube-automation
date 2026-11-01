# Camera (`shot.cam`)

```jsonc
"cam": {
  "shot": "medium",            // establish | wide | full | medium | mcu | close | ecu | low | high | top | ots | pov
  "target": "max",             // actor | [actorA, actorB] (two-shot / OTS pair) | [x,y,z] | "spot:door" | prop id
  "move": "push",              // static | push | pull | orbit | crane | rise | pan | follow | track | lead | dollyZoom | tilt
  "az": 25,                    // degrees around the subject: 0 = in front of the face, 90 = subject's left side, 180 = behind
  "el": 4, "dist": 10, "look": 3.5, "fov": 36,    // optional overrides of the size preset
  "arc": 50,                   // orbit width in degrees
  "from": { "az": -20, "dist": 14 }, "to": { "az": 30, "dist": 7 },     // explicit move (overrides the preset)
  "keys": [[0, { "az": 0 }], [0.6, { "az": 40, "dist": 6 }], [1, { "az": 60 }]],   // u = fraction of the shot
  "ease": "inOut",             // inOut | sine | linear | in | out
  "rel": true,                 // az relative to the subject's facing; false = world (az 0 = from +Z, 90 = from +X)
  "handheld": 0.12,            // gentle life (0 = locked tripod, 0.4 = nervous handheld)
  "shake": true,               // true = strong shake on impacts in this shot (default: soft), a number = constant tremble, or [{at, amp, dur}]
  "side": 1,                   // OTS: which shoulder (1 / -1)
  "lookOffset": [0, 0, 0], "roll": 0, "avoid": true
}
```

## Sizes (subject 5 studs tall)
| shot | dist | use |
|---|---|---|
| `establish` | 48, high | the first shot of a location |
| `wide` | 28 | geography, crowds, chases |
| `full` | 14 | the whole body: action, fights, dances |
| `medium` | 10.5 | waist up: talking, gestures |
| `mcu` | 7 | chest up |
| `close` | 4.2 | face: emotion, reactions |
| `ecu` | 2.6 | eyes/mouth: shock, punchlines |
| `low` | from below | heroes, threats, arrivals |
| `high` | from above | defeat, small, overview |
| `top` | straight down | maps, funny overheads |
| `ots` | behind A's shoulder looking at B | dialogue, confrontations (`target: [A, B]`) |
| `pov` | from A's eyes | discoveries |

## Moves
- `push`: slow dolly-in. Emphasis, realisation. **The default for talking shots.**
- `pull`: reveal the surroundings or the consequences.
- `orbit`: circle around. Celebrations, tension, showing off a character.
- `crane`: comes down from high to the framing. Arrivals.
- `rise`: goes up and back. Endings, "and so…", leaving.
- `pan`: the camera stays where the shot starts and turns to follow the subject. Someone runs past.
- `follow`: the camera moves with the subject at a fixed offset. Use `rel:false` + `az:90` for a side tracking shot; `rel:true` keeps it relative to the subject's facing.
- `lead`: in front of a walking or running subject, moving backwards.
- `track`: like follow, with sine easing.
- `dollyZoom`: vertigo effect (the background stretches). Shock moments.
- `tilt`: from the feet up to the face. Reveals.

## Two-shots and pairs
- With `target: ["a", "b"]`, the camera frames the midpoint, sits perpendicular to the line between them (on the +Z side, so screen direction stays stable) and backs off to fit both.
- `az` turns it from there. Use ±30 to favour one face.

## Smart camera
- Before a shot renders, the director samples it (start/middle/end) and casts rays from the subject's feet, body and head to the lens. If walls, props or other actors block the subject, it swings `az` by the smallest offset (±20…90°) that clears the view.
- Turn it off with `"avoid": false` for deliberate foreground framing. OTS/POV/top shots are never adjusted.
- It cannot fix a bad layout, so stage actors with space around them.

## Camera grammar (what makes it cinematic)
- Every shot moves, even if only `push` at 10% or `handheld`. Static shots need strong actor motion.
- Alternate sizes: wide → medium → close. Don't cut between two shots of the same size and angle (a jump cut).
- Keep the 180° rule inside a scene: keep pair `az` on the same side and use `rel:false` world azimuths for chases so runners keep their screen direction.
- Action: the punch lands in a `full`/`medium` two-shot with `shake: true`. Cut to the reaction (`close` on the victim or a `wide` of the flight). Add a `slam` text on the impact word.
- Speed: `low` + `follow` for running, `whip` transitions between chase shots, and `mb: 3` on the fastest shot (slow to render).
- Emotion: `close`/`ecu` + `push`, held 2–4 s, with the matching expression.
