# Story breakdown (the creative pass)

Read the whole transcript twice, then `worlds.md` and `retention-playbook.md`. Then write `story/bible.md` (short, practical):
- **Logline and tone** (wonder / suspense / comedy / drama), plus who "you" is if the script is in second person.
- **Cast table.** For each recurring character: id, role, gamer name tag, outfit `{hair, hairColor, shirt, logo, logoColor, pants, acc, kid}`, personality, and the expressions they use most. The hero keeps ONE signature look (shirt colour + logo + hair) all video. Put the outfits in `scenes/cast.js` (see `examples/whole-town/scenes/cast.js`).
- **Locations (sets).** For each: the `worldsets.js` location or the pieces you compose, mood (`gameDay|gameSunset|gameNight|gameAlarm|gameStorm|gameDead|gameCave|gameRoom|gameRoomNight`), 3–6 signature props, and the layers (sky → skyline → buildings → props → actors → foreground).
- **Motifs:** the open loop (e.g. the countdown that only resolves at the end), chapter device (DAY cards), rule cards, the colour plan (`look` alarm/dead/night/vhs), a power colour, the gauge/HUD of the world, easter eggs.
- **Act / music plan:** sections with a mood and intensity (sound-design.md).

Then **rewrite `story/shots.json`** (schema in engine-api.md, story/shots.json). For every shot set:
`id, start, end, line, scene` (one concrete sentence describing the picture, e.g. "hero on the street, RULE 1 card types in, JUMP gauge fills to 5x, crouch then launch, camera tilts up"), `set`, `in` (transition), `look`, `emph`, `capMode`, `captions`, `sfx`, `amb`, `notes`.

Pacing rules:
- Shots are **contiguous**: each `end` equals the next `start`. The first starts at 0 and the last ends at `duration`, which is the voiceover length plus about 1.5 s.
- Cut on phrase boundaries. Start a shot **0.1–0.2 s before** the phrase it illustrates.
- Target a **median of 2–3 s**, with a new visual event inside the shot every 0.5–1 s (retention-playbook §C). Fast action: 0.8–2 s cuts (split one phrase into several shots). Emotional or dialogue holds: 4–8 s. Never go beyond ~10 s without a new action or camera move.
- Every new location opens with an establishing shot (a wide of the place, or `aerial`/`cityRow` for scale).
- Expect roughly **20–30 shots per minute** of narration.
- Hook (first ~15 s): premise → structure → stakes/deadline → fourth-wall line → `rewind`. Chapters and numbered rules get their cards on the exact word. Colour changes (`look`) on the stakes words.
- Fill `captionStyle.emph` in config.json with the 10–25 words that must pop (numbers, the game's nouns, danger words red, powers cyan, rewards gold).

Give the user a 5–10 line summary: the cast, the locations, the number of shots, and the visual highlights per act. Continue unless they object.


**World:** state the world (blocky / voxel / royale) and why, which signature sets/HUD appear in the hook, and the stand-ins for any trademarked characters the script mentions (worlds.md).
