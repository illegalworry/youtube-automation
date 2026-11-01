# Characters (`scenes/cast.js`)

```js
import { defineCast } from '/engine/director.js';
defineCast({
  max: {
    skin: '#f5cd30',                       // classic Roblox yellow; also #f2d3b0 light, #d9a77a tan, #a86f48 brown, #6b4430 dark, #fbe6d4 pale
    face: 'smile',                         // default expression (list below)
    faceInk: '#141414', blush: false,
    shirt: { color: '#2d7be0', style: 'hoodie', color2: '#ffffff', print: '★', printColor: '#fff', sleeves: 'long', tie: '#c4281c' },
    pants: { color: '#2b2f3a', style: 'pants', shoes: '#1d1d1f' },
    hair:  { style: 'spiky', color: '#3a2312' },
    hat:   { type: 'cap', color: '#c4281c' },
    acc:   ['backpack', { type: 'cape', color: '#6b327c' }],
    hold:  'sword',                        // or { item: 'phone', hand: 'L' }
    scale: 1,                              // 0.75 for kids, 1.15 for big guys
  },
});
```

## Options
| Key | Values |
|---|---|
| `shirt.style` | `tshirt` (round neck, short sleeves), `hoodie` (pocket + strings, long), `jacket` (open; `color2` = inner shirt), `suit` (`color2` shirt + `tie`), `stripes` (`color2` stripes), `polo`, `sweater`, `tank` (bare arms), `dress` (makes a skirt), `uniform` (police: badge + pockets), `armor`, `plain` |
| `shirt.print` | 1–2 symbols are drawn big (★ ♥ ☠ ⚡ $ 7). Text is drawn small (e.g. "NOOB", "PRO", "КОТ"). |
| `shirt.sleeves` | `long` / `short` / `none` (the default depends on the style) |
| `pants.style` | `pants`, `shorts`, `skirt` |
| `hair.style` | `short`, `spiky`, `long`, `ponytail` (+`band` colour), `pigtails`, `bob`, `bangs`, `mohawk`, `afro`, `buns`, `curly`, `emo`, `slick`, `bald` |
| `hat.type` | `cap`, `capBack`, `beanie`, `tophat`, `crown`, `cowboy`, `party`, `hardhat`, `knight` (full helmet), `headphones`, `horns`, `halo`, `bandana`/`ninja`, `chef`, `police`, `wizard`, `viking`, `catEars`, `bunnyEars` |
| `acc` | `glasses`, `shades`, `backpack`, `cape` (flutters with speed), `wings`, `scarf`, `necklace`, `belt` (strings or `{type, color}`) |
| `hold` / act `item` | sword, lightsaber, bat, phone, cup, pizza, book, flashlight, ball, soccer, wand, gun (toy blaster), shield, money, key, microphone, torch, pickaxe (any item from `--catalog` can be held) |

## Expressions (`face`, act `expr`)
`smile, happy, grin, laugh, neutral, sad, cry, angry, furious, surprised, shocked, scared, worried, smug, wink, cool, determined, hurt, dead, dizzy, sleepy, love, thinking, evil, nervous, bored`

- Many actions set a temporary expression on their own: punch → angry, hit → hurt, cheer → happy, laugh, cry, scared, think, sleep, oof → dead.
- An explicit act `expr` persists until the next change. Use `{ "who": "max", "t": 8.1, "do": "face", "expr": "surprised" }` to change a face with no motion.
- Blinking is automatic. The mouth moves on the voiceover words when the actor is the shot's `speaker`, inside a `talk` window, or during `talk`/`say`/`shout`/`phone` acts.

## Design rules
- Each recurring character gets **one strong signature**: a colour, hat, hairstyle or print. Make the cast differ by silhouette (hair/hat) and colour. Avoid two protagonists in the same shirt colour.
- Villains: dark or saturated green/red, `evil`/`smug` default faces, horns, a hood.
- Crowds and extras reuse cast entries with `look` overrides on the actor (`"look": { "shirt": { "color": "#…" } }`) so they vary cheaply.
- Faces are decals on the classic cylinder head (the iconic Roblox look). Keep `skin` yellow for the classic style or use realistic tones; never mix styles randomly within one video.
