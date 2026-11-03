# Worlds: the look follows the video's topic

The format (retention structure, captions, game UI, transitions) is always the same. The **world** — character skin, set pieces, panel skin, fonts and grade — is chosen from what the video is about, so a Minecraft-topic video looks like a cube sandbox and a Fortnite-topic video looks like a cartoon battle royale.

## Choosing the world (Stage 1)
1. Run `python tools/pick_world.py --title "<title>"` (also called automatically by `new_project.py` when `--style auto`, the default). It matches game names in English and Russian.
2. If the title names a game, use that world. If it names a game that has no world yet, use the closest one (table below) and tune the palette with a custom style (Stage 5). If the topic is not a game at all ("What if dogs could talk"), use `blocky` — it is the reference look of the format.
3. Tell the user which world was picked and why in one line. They can override it with `config.json` → `"style"` (or `"world"` to keep a style's grade but swap the world).

| World / style id | Pick for | Characters (`drawHero`) | Sets that sell the world | HUD that sells the world |
|---|---|---|---|---|
| `blocky` (+ `blockyPop`) | Roblox-type avatar platforms, obbies, tycoons, "the whole world became a game", generic What-ifs | rounded block avatar, huge round eyes, dark outline, gloss, logo on the chest | `suburb`, `cityRow`, `bedroom`, `rooftops`, `aerial`, `obby`, `openSky` | `ruleCard`, `gameTile`, `leaderboard`, `diedPanel`, `chatBubble` |
| `voxel` (+ `voxelDusk`) | Minecraft-type sandbox / survival / mining / crafting, Terraria-likes | square head with a PIXEL face, flat-shaded boxes with a darker side face, pixel textures | `plains`, `cave` (ores, torches, lava), plus every town set (rebuilt from pixel blocks) | `hotbar` (items + pixel hearts), `itemIcon`, panels with the pixel font |
| `royale` | Fortnite / PUBG / Free Fire / Apex-type battle royales, shooters, brawlers | glossy cartoon human, round head, big eyes, hair shapes, bendy arms, sneakers | `island` (rolling hills, loot crate with balloon, `storm` wall), `suburb`, `openSky` | `hpShield`, `stormTimer`, `killFeed`, `winBanner`, `lootCrate` rarity colours |

Every location and every UI element works in every world (pieces redraw themselves), so you can still use `bedroom` in a voxel video or `obby` in a royale video. But the **signature sets and HUD in the table are what make the topic recognisable** — use them in the hook and in at least one shot per minute.

## Genre, not copies (non-negotiable)
Draw the GENRE look, never the property itself: no logos, no official characters or skins (no default sandbox hero, no famous green exploding mob, no famous bus, no named llama), no ripped sounds (use `bonk`, not a game's death sound), no exact UI screenshots. Game names may appear in the title and narration (commentary/parody convention), and invented in-world names are fine (`Block_Kid`, `xX_Dan_Xx`, `The WHOLE TOWN`). If a script asks for a specific trademarked character, make an original stand-in with the same role (a green "creeper-like" block monster becomes your own `Boomcube` with a different face and colour).

## Adding a new world-style
Copy the closest entry in `engine/styles.js` → `STYLES`, give it a new id, set `world` to the closest skin (`blocky | voxel | royale`), then change `moods` (sky, grass, roof, leaf… for each `game*` mood), `ui` colours, `fonts` and `grade`. Example: a GTA-type "city crime" topic → copy `royale`, darker asphalt and neon practicals in `gameNight`, `ui.gold` → green cash colour. Re-render a style grid (`--styles new,royale`) and show the user.
