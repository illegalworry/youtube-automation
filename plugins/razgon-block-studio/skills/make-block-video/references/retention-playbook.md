# Retention playbook (learned from a 1M-view competitor; full Russian breakdown in the plugin's ANALYSIS_RU.md)

Apply every rule below in Stage 4 (story breakdown) and check them again on the contact sheet. They are about **what the viewer feels each second**, not about the drawing style.

## A. Hook: first 15 seconds (write 3 options in bible.md, pick one)
1. **0–3 s — the premise as an event, not a question.** First frame is a giant reaction close-up (`bigHero`, `shocked`/`nervous`) or the world transforming. Never a logo, never a slow establishing shot.
2. **3–6 s — promise a structure.** "Seven days. One game." → `dayCard` flips / `gameTile`. The viewer now knows there is a countdown to the end.
3. **6–10 s — stakes + deadline.** Flash-forward to the worst moment: red `look: alarm`, `countdown` ring, `alertBanner`, panicking crowd with `chatBubble`s.
4. **10–15 s — break the fourth wall, then rewind.** Hero close-up "Okay, okay, I can explain" → transition `rewind` (VHS ◀◀ REW) → `look: vhs` "Last night." This open loop is the reason people stay to the end — pay it off in the last minute.
If the user's script doesn't start like this, don't rewrite the narration (golden rule 1): build the same feeling with pictures (flash-forward visuals under the first line, a countdown that only resolves at the end, a rewind transition into the first story beat).

## B. Body: chapters and numbered rules
- Chapters = **days / levels / phases** (`dayCard`, `bigWord('DAY 2')`). Numbered items = **rules / powers / steps** (`ruleCard` n = 1, 2, 3…, text types in). On screen every time the narrator says it.
- Each rule gets: the card (0.1 s before "Rule"), a literal demonstration, an **escalation by three** (normal → bigger → absurd: roof → neighbour's roof → a passing bird), and a reaction close-up on the punch word.
- Every 30–45 s change the colour of the world (day → alarm red → dead grey → night blue → victory gold) so the mood reads even with the sound off.

## C. Moment-to-moment rules (the "never let go" layer)
- **Something new every 0.5–1 s:** expression change on the word, a graphic popping in, a camera push/whip, an onomatopoeia, a pose snap. A cut every ~2–3.5 s; never hold a picture > 4 s without a new event.
- **Expressions on the beat:** surprised → nervous on "but", star eyes (`excited`) on powers, `sly` on "you figure out", `worried` on danger words, `dead` on dying. Sweat drops (`nervous`, `scared`) whenever the narrator is uneasy.
- **Captions always on** (16:9 too), 1–2 words, emphasis words in `captionStyle.emph` (numbers, the game's key nouns, danger words in red, powers in cyan, rewards in gold). `"capMode": "type"` for system messages. `"captions": false` only where a `titleSlam`/`bigWord` already says the same words.
- **Second person:** when the script says "you", the hero is the viewer — give the hero a gamer name tag (`name`) and an `hp` bar; no other character steals focus.
- **No dead air:** music under everything (`bouncy` default, `panic` for countdowns), an SFX on every pop, slam, landing and transition (`sound-design.md`).
- **Easter eggs for pauses and comments:** absurd numbers on UI (`7,900,000,000 playing`), crowd chat (`mom??`, `who pressed YES`), funny name tags, a sign in the background. 2–4 per minute.
- **Literal and specific:** "hot tub" → draw a hot tub glowing red with a `LAVA` sign; "a passing bird" → a blocky bird with `onoma('SQUAWK!')`.

## D. Ending
Pay off the open loop (the countdown hits 0 → what happens), then a question to the viewer on `gameEnd` ("Which rule would YOU break first?") — comment bait — and a subscribe pill. The last 5 s can tease the next What-if.

## E. Thumbnail and title (tell the user, even if they make them elsewhere)
Title: `What If <huge scope> Became <game>?` / `Что если <масштаб> стал <игра>?`. Thumbnail: the hero's giant shocked face + the world-changing element + one short word in the caption font; same world look as the video.
