# Quality bar: animation, not a slideshow

## Non-negotiables (every shot)
1. **Motion:** at least one actor performs an act during the shot (locomotion, gesture, fight, reaction, idle loop with a turn or expression change), and/or the camera moves. Prefer both.
2. **Changing poses:** a shot longer than 3 s gets 2+ acts or a looping act (`talk`, `dance`, `lookAround`) plus an expression change.
3. **Motivated camera:** the move matches the beat (push on emotion, follow on runs, shake on hits, rise at endings). No random orbits.
4. **Narrative sync:** the action the narrator names happens on that word (`"w": "word"` anchors). Impacts land on "бам/hit/punch".
5. **One style:** one `config.style` look, consistent cast outfits, sets that match the script's world, and the same light inside a scene.
6. **Readable staging:** faces visible in talking shots (`az` between −45 and 45 relative to the speaker), no unintended occlusion, and actors not cut by the frame edge.
7. **Physical plausibility:** feet on the ground (automatic); no walking through props (route `path` around them or `jump`); fighters 2.8–3.5 studs apart and facing; objects handed over really change hands (`drop` + `item` at the same t).
8. **Life in the background:** extras idle, talk or walk, ambient fx (birds/motes/rain) where it fits, moving props (cars `move`, spinning coins).

## QC checklist (contact sheets and stills)
- [ ] No `MISSING SHOT` and no `ERROR` lines in the renderer output (unknown action, set, item, spot or cast id).
- [ ] Each sheet frame: is the subject framed and in focus, and is the expression readable?
- [ ] `--stills` inside every key action: wind-up, contact, flight, landing. The victim reacts **after** contact, not before.
- [ ] Chase continuity: runners keep their screen direction across cuts.
- [ ] Text overlays don't cover faces, Russian letters render, and nothing is cut at the frame edge (9:16 especially).
- [ ] 9:16 needs closer sizes (`medium`/`close`) and vertical arrangements; re-check the sheets after switching aspect.
- [ ] Motion check: a short `--from/--to` preview of the busiest 10 s, viewed as a strip (fps=4 tile), to confirm smooth movement with no pops between clips or teleporting actors.

## Common fixes
| Problem | Fix |
|---|---|
| Subject hidden by a tree, wall or other actor | change `az`, move the actor, or remove/shift the prop (smart camera tries ±90° first) |
| Punch misses / hits air | set the attacker 3 studs from the target and `face` it (`target` auto-faces at the act start) |
| Actor slides without stepping | use `walk`/`run` (not a prop move); for a custom speed set `speed`, and the stride adapts |
| Actor pops between poses | add a short gap, or set `"blend": 0.35` on the act |
| Shot feels dead | add an act inside it (`lookAround`, `nod`, `talk`), set `move: push`, or cut it shorter |
| Too dark interior | `light: interior`, or add `"lightOverride": { "exposure": 1.2 }` |
| Camera inside a wall in interiors | smaller `dist` (`medium`/`close`) or `az` toward the open +Z side |
