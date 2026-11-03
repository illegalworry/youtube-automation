# Story breakdown (the creative pass)

Read the whole transcript twice. Then write `story/bible.md` (short, practical):
- **Logline and tone** (wonder / suspense / comedy / drama), plus who "you" is if the script is in second person.
- **Cast table.** For each recurring character: id, role, outfit `{top, color, hood, hat, hatColor, glasses, cape, patch, costume, build}` (glow.js), signature hoodie colour, personality, and the expressions they use most. Every recurring character gets exactly ONE distinct muted hoodie colour (style-bible.md, Characters). Put the outfits in `scenes/cast.js`.
- **Locations (sets).** For each: name, mood (`porch|office|sunset|park|dark|rainy|day|home|school|data`, legacy `golden|dusk|night|storm|interiorWarm|interiorCool|void`), the ready-made set it starts from (`porch kitchen farmStand park monitorRoom fogWindow bedroom street classroom studio`) or the pieces it needs, where the key light comes from, the window/view, 3–6 signature props, and the layers (sky → far → mid → floor → foreground).
- **Motifs:** recurring visual devices tied to the story, such as the invisible outline with eyes, a percentage pill that counts, a handwritten sign that changes, a poster that turns into eyes, fogged-glass writing for rules.
- **Act / music plan:** sections with a mood and intensity (sound-design.md).

Then **rewrite `story/shots.json`** (schema in engine-api.md, story/shots.json). For every shot set:
`id, start, end, line, scene` (one concrete sentence describing the picture, e.g. "porch wide: neighbour by the door, three kids at the bowl, slow push; pill 57 %"), `set`, `bars`, `in` (transition), `sfx`, `amb`, `notes`.

Pacing rules:
- Shots are **contiguous**: each `end` equals the next `start`. The first starts at 0 and the last ends at `duration`, which is the voiceover length plus about 1.5 s.
- Cut on phrase boundaries. Start a shot **0.1–0.2 s before** the phrase it illustrates.
- Target a **median of 2–3.5 s**. Fast action: 0.8–2 s cuts (split one phrase into several shots). Emotional or dialogue holds: 4–8 s. Never go beyond ~10 s without a new action or camera move.
- Every new location opens with an establishing shot (wide 2D or 3D).
- Expect roughly **15–25 shots per minute** of narration.

Give the user a 5–10 line summary: the cast, the locations, the number of shots, and the visual highlights per act. Continue unless they object.

