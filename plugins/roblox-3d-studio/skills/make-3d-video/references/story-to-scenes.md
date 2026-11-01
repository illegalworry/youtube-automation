# Script → scenes → shots (the creative pass)

Read `timeline/transcript.txt` twice. Then decide **what happens physically** in every sentence. Narration often describes feelings or facts, so turn each sentence into a visible action, a reaction or a camera reveal.

## 1. Bible (`story/bible.md`, short)
- **Logline and tone:** comedy / adventure / drama / horror / explainer. Who is "you" in second-person scripts? Give them an avatar.
- **Cast table:** id, role, look summary, signature colour, typical expressions.
- **Locations:** for each one, the set name, light, `setOpts`, and a **layout in studs**: who starts where, the paths they take, the `spots` used, and extra props. Sketch it as a list of coordinates, e.g. "lily at bench [-8,-6]; Max enters from [0,-22] along the path (+Z)". Keep the action inside about ±15 studs of the origin unless it is a chase.
- **Music plan:** sections with mood and intensity (`render-and-sound.md`).

## 2. Scenes
One scene = one continuous action in one place. Start a new scene when the location changes, when there is a time jump, or when the action would be simpler to restage. A two-minute video usually has 3–8 scenes.

```jsonc
{
  "id": "park",                    // referenced by shots
  "set": "park",                   // see --catalog / sets-props-fx.md
  "setOpts": { "night": true },    // optional, set-specific
  "light": "day",                  // optional, defaults to the set's light
  "look": null,                    // (colour grade is global: config.style)
  "fog": [40, 200], "bloom": 0.3,  // optional overrides
  "actors": {
    "max":   { "cast": "max", "at": [0, -22], "face": 0, "expr": "smile" },
    "lily":  { "at": "spot:bench1", "face": "max", "pose": "sit", "hold": "phone" },
    "extra1":{ "cast": "kid", "at": [12, 4], "look": { "shirt": { "color": "#e8304a" } } }   // a cast variant
  },
  "acts": [ /* see actions.md */ ],
  "props": [ { "id": "car1", "item": "car", "at": [-4, -40], "face": 0, "opts": { "color": "#2d7be0" },
               "move": [[12.0, [-4, -40]], [14.5, [-4, 30]]] } ],
  "fx":    [ { "t": 24.4, "type": "confetti", "at": [4, 7, -34] }, { "type": "rain" } ],
  "talk":  [ { "who": "max", "from": 3.2, "to": 5.0 } ]
}
```
- `at`: `[x, z]`, `[x, y, z]`, a spot (`"spot:door"` or `"door"`), or another actor's id.
- `face`: degrees, an actor id, a point, or `"camera"`.
- `pose`: a held starting pose (`sit`, `lie`, `crouch`, …).
- `hold`: the item in the right hand from the start.
- Several actors can reuse the same `cast` entry. Override details with `look`.

## 3. Shots
```jsonc
{
  "id": "s007", "start": 11.3, "end": 13.01, "scene": "park",
  "line": "и убегает!",                       // the narration (for you / QC)
  "desc": "Lily shouts, Bacon runs off behind her",
  "cam": { "shot": "close", "target": "lily", "az": -15, "move": "push" },
  "speaker": "lily",                         // mouth moves on the voiceover words in this shot
  "text": [ { "at": 0.1, "dur": 1.4, "str": "ЭЙ!", "style": "slam", "color": "#ff4a6a" } ],
  "in": { "type": "whip" },                  // transition from the previous shot
  "mb": 3,                                   // optional motion blur (slow: only on very fast shots)
  "sfx": [ { "at": 0.2, "name": "whoosh", "gain": -8 } ], "amb": { "name": "wind", "gain": -24 }
}
```
- Shots are **contiguous**: each `end` equals the next `start`. The first starts at 0, and the last ends at `duration` (the voiceover length + about 1.5 s).
- Cut on phrase boundaries, 0.1–0.2 s **before** the phrase.
- Shot lengths: median 2–4 s. Action 0.8–2 s (split one sentence into 2–3 angles). Emotional holds 4–6 s with a slow move. Never more than about 8 s without a new action or camera change.
- `text` styles:
  - `title`: big centred title;
  - `pop`: bouncy word;
  - `slam`: hit word, e.g. "БАМ!";
  - `tag` / `lower`: name plate, e.g. "МАКС";
  - `banner`: e.g. "3 ЧАСА СПУСТЯ…";
  - `end`: end card with `sub`.

  Russian text works.
- `in.type` transitions:
  - `cut` (default);
  - `whip` (fast pan with motion blur, for action);
  - `push`;
  - `smash` (hard cut with a flash shake, for impacts);
  - `flash`;
  - `fade`;
  - `dip`/`dipWhite`;
  - `zoom`;
  - `iris` (`at: [0.5, 0.4]`);
  - `match` (`from`/`to` anchors).

## 4. Turning narration into action (method)
For every beat, ask:
1. **Who acts?**
2. **What do they physically do?** Pick a clip (`actions.md`).
3. **Who reacts?**
4. **Where is the camera, and what is it doing?**

Examples:

| Narration | Scene acts | Shots |
|---|---|---|
| "Это Макс." | Max walks toward camera | `medium` + `lead`, name tag |
| "Он очень злой." | Max `angry` idle, `stomp`/`shout` | `close`, `push`, low angle |
| "Тут появляется хулиган" | bully `run` in on a path | `low` + `follow`, `whip` in |
| "…и бьёт его" | `punch` with `target` + `react: knockback` | `full` two-shot `pull` + `shake`, `slam` "БАМ!" |
| "Все смеются" | 3 extras `laugh` (staggered `t`) | `wide` `orbit` |
| "Прошло 3 часа" | (new scene, `golden` light) | `banner` text, `establish` + `rise` |
| "Он думает…" | `think` | `ecu` + `dollyZoom` |

Staggering helps: crowds should not all start an act at the same `t`, so offset them by 0.1–0.4 s. Give background actors an `idle` or `talk` loop so the world feels alive.

## 5. Checklist before rendering
- Every actor in a shot's target exists in that scene.
- Paths do not cross props: walk around benches and cars, or `jump` over them.
- Attacker and target are about **2.8–3.5 studs** apart and facing each other at the impact time.
- Chairs: sit at the chair position; the seat height suits `sit`.
- Times are global seconds and lie inside the scene's shots.
- Every shot has motion: an actor act running during it, or a camera `move` (ideally both).
