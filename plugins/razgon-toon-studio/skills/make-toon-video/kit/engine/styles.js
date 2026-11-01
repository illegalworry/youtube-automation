// engine/styles.js — colour moods + switchable visual styles.
// A MOOD is the lighting situation of a location (day, dusk, night, storm, interiors, void).
// A STYLE re-grades every mood (palette overrides + a lift/gamma/gain colour grade on the final frame + post settings).
// grade: contrast (around mid-grey), sat (saturation), lift/gamma/gain per RGB channel (lift tints shadows, gain tints highlights).
// Scenes must take colours from mood()/S() so a style switch re-themes the whole video.

export const BASE_MOODS = {
  day:          { sky: ['#8fb0d8', '#cfdcea', '#efe3d2'], ambient: '#6f7d96', key: '#fff3dc', rim: '#fff1d6', wall: '#8d8496', floor: '#5f5866', dark: '#2f2a36', practical: '#ffe2a8', grass: '#4f8a55', road: '#5d5a66', fog: '#dfe4f0' },
  golden:       { sky: ['#6b5a8e', '#e89a6a', '#f9d49c'], ambient: '#4a3a50', key: '#ffcf8f', rim: '#ffc68a', wall: '#5a3a34', floor: '#45302a', dark: '#2a1814', practical: '#ffe7b0', grass: '#4d6b3c', road: '#4a3c40', fog: '#f0c49a' },
  dusk:         { sky: ['#3d3360', '#8a5a86', '#e8956b', '#f7cf98'], ambient: '#3b2b3d', key: '#ffc68a', rim: '#ffc68a', wall: '#4a3646', floor: '#3d2c38', dark: '#231a27', practical: '#ffd59a', grass: '#3d5a48', road: '#3a3040', fog: '#c08a8a' },
  night:        { sky: ['#0b1028', '#1d2550', '#3a3570'], ambient: '#1e2444', key: '#c9d4ff', rim: '#a9b8ff', wall: '#262a46', floor: '#1b1e33', dark: '#0f1122', practical: '#ffb860', grass: '#22433a', road: '#24263a', fog: '#3a4270' },
  storm:        { sky: ['#141a33', '#2a3358', '#3d4670'], ambient: '#232a48', key: '#dfe6ff', rim: '#cfd9ff', wall: '#2b3150', floor: '#1c2238', dark: '#0d1020', practical: '#bcd0ff', grass: '#25483e', road: '#232838', fog: '#4a5580' },
  interiorWarm: { sky: ['#c98a74', '#f2b585', '#f7cf98'], ambient: '#4a3646', key: '#ffd59a', rim: '#ffcf8f', wall: '#4f3a40', floor: '#3a2a2e', dark: '#21171c', practical: '#ffd28a', grass: '#3d5a48', road: '#3a3040', fog: '#a87a70' },
  interiorCool: { sky: ['#2a3560', '#5a6aa0'], ambient: '#2a2c48', key: '#cbd6ff', rim: '#b8c6ff', wall: '#2e3150', floor: '#22243a', dark: '#121426', practical: '#9fe0ff', grass: '#22433a', road: '#24263a', fog: '#4a5080' },
  void:         { sky: ['#0a0e1a', '#121a2e'], ambient: '#151c30', key: '#ffffff', rim: '#8fb8e8', wall: '#121a2e', floor: '#0d1322', dark: '#070a12', practical: '#ffd47e', grass: '#1d3a33', road: '#151a28', fog: '#1d2740' },
  // ---- Toon moods (bright flat 2.5D look). Extra keys used by engine/toonsets.js:
  //  brick, brickLine, siding, glass, glassHi, frame, trim, leaf:[dark, mid, light], trunk, wood, woodDark, concrete,
  //  asphalt, line (road paint), shadow (contact shadows), light (light pools), sun, cloud
  sunny:      { sky: ['#8cc4ea', '#b9def3', '#dcefF7'], ambient: '#9aa6b2', key: '#fff7e2', rim: '#fbf0cf', wall: '#c9704f', floor: '#5c5f67', dark: '#34363d', practical: '#fff1b8', grass: '#86b965', road: '#5a5d65', fog: '#e8f1f5',
                brick: '#c8714f', brickLine: '#b5603f', siding: '#bb6545', glass: '#7fa9d6', glassHi: '#a8c8ea', frame: '#f3efe6', trim: '#e9e1d2', leaf: ['#5f9a4f', '#79b25f', '#9fcd7c'], trunk: '#6a4630', wood: '#cfa271', woodDark: '#a97c50', concrete: '#d8d2c6', asphalt: '#5f6168', line: '#eeeeea', shadow: 'rgba(25,30,40,.28)', light: '#fff4cf', sun: '#fff6d8', cloud: '#ffffff' },
  overcast:   { sky: ['#a9bccb', '#cbd7df', '#e3e9ec'], ambient: '#8d98a2', key: '#eef3f6', rim: '#eef0e6', wall: '#a8664f', floor: '#5b5e64', dark: '#33363c', practical: '#ffe9b0', grass: '#7da563', road: '#585b61', fog: '#dfe6ea',
                brick: '#b06650', brickLine: '#9d5843', siding: '#a65d47', glass: '#8aa6c0', glassHi: '#b1c6d8', frame: '#ebe8e1', trim: '#dcd6cb', leaf: ['#5c8a52', '#71a062', '#90b97c'], trunk: '#5f4434', wood: '#bf9a72', woodDark: '#9b7853', concrete: '#cdc8bf', asphalt: '#5c5e64', line: '#e6e6e2', shadow: 'rgba(25,30,40,.22)', light: '#f4f1e4', sun: '#f6f6f2', cloud: '#f4f6f7' },
  afternoon:  { sky: ['#86b4dc', '#c3d9e8', '#f3e4c8'], ambient: '#a39a96', key: '#ffe9c4', rim: '#ffe7b8', wall: '#c56c4a', floor: '#5d5c62', dark: '#36333a', practical: '#ffe2a0', grass: '#8fb95f', road: '#5c5b62', fog: '#f2e6d2',
                brick: '#cc6f4a', brickLine: '#b75f3c', siding: '#c0653f', glass: '#86a8cf', glassHi: '#c3d5ea', frame: '#f5eee2', trim: '#ece2d0', leaf: ['#63954a', '#7fb158', '#a8cf78'], trunk: '#6d4630', wood: '#d4a46f', woodDark: '#ad7c4c', concrete: '#ddd3c2', asphalt: '#5f5e64', line: '#f0ece2', shadow: 'rgba(40,28,30,.28)', light: '#ffefc8', sun: '#fff0cc', cloud: '#fff8ee' },
  sunset:     { sky: ['#6f7fb8', '#e7a283', '#f8d39b'], ambient: '#8a7480', key: '#ffd29a', rim: '#ffd8a6', wall: '#b45e45', floor: '#55505a', dark: '#2e2830', practical: '#ffd892', grass: '#7b9c52', road: '#56505a', fog: '#f0c7a6',
                brick: '#b8604a', brickLine: '#a2523e', siding: '#ab5843', glass: '#8b8fbf', glassHi: '#e9b9a3', frame: '#f2e4d2', trim: '#e5d2bc', leaf: ['#4f7a48', '#668f52', '#86ab66'], trunk: '#5a3b2c', wood: '#c58f62', woodDark: '#9b6c45', concrete: '#cfc0ad', asphalt: '#57525b', line: '#ece0d0', shadow: 'rgba(40,20,30,.3)', light: '#ffdfae', sun: '#ffe2a8', cloud: '#fde3cf' },
  nightOut:   { sky: ['#1b2447', '#2c3a68', '#475a8c'], ambient: '#3a4366', key: '#d7e0ff', rim: '#e9e3cc', wall: '#6e4a46', floor: '#3c3f4a', dark: '#1a1c24', practical: '#ffd98c', grass: '#3f5f4a', road: '#3b3e48', fog: '#56628c',
                brick: '#7a4c42', brickLine: '#683f37', siding: '#704740', glass: '#3c4f7c', glassHi: '#ffd98c', frame: '#c9c4bb', trim: '#b9b2a6', leaf: ['#2f4a3e', '#3b5a49', '#4d7058'], trunk: '#3a2a26', wood: '#8d6e52', woodDark: '#6c533e', concrete: '#8a8780', asphalt: '#3d4049', line: '#b9bcc4', shadow: 'rgba(5,8,20,.4)', light: '#ffdf9a', sun: '#f4f0dc', cloud: '#56628c' },
  garage:     { sky: ['#1d2550', '#2f3c78'], ambient: '#4b4741', key: '#ffe3a6', rim: '#f5e2b4', wall: '#8b8780', floor: '#5f5d5a', dark: '#1f1c19', practical: '#fff0c0', grass: '#4f6a48', road: '#55534f', fog: '#77726a',
                brick: '#8f8b83', brickLine: '#77736c', siding: '#84807a', glass: '#1d2550', glassHi: '#3a4a8a', frame: '#3e3a35', trim: '#56514a', leaf: ['#3f5a3c', '#506e4a', '#66865c'], trunk: '#4a3628', wood: '#7e5a3c', woodDark: '#5c412b', concrete: '#7c7a75', asphalt: '#55534f', line: '#c8c4bb', shadow: 'rgba(10,8,5,.4)', light: '#ffe6a8', sun: '#f6efd2', cloud: '#2f3c78' },
  gym:        { sky: ['#3a2a26', '#5a3a30'], ambient: '#6a5048', key: '#ffe4b0', rim: '#fbe9c4', wall: '#a75c45', floor: '#8c6a4c', dark: '#2a1d18', practical: '#fff0c4', grass: '#5a7a48', road: '#5d544f', fog: '#b98a70',
                brick: '#a95e46', brickLine: '#8f4c38', siding: '#9e5641', glass: '#7f9fc0', glassHi: '#b9d0e6', frame: '#2a2a2e', trim: '#d8cfc0', leaf: ['#4f7a48', '#668f52', '#86ab66'], trunk: '#5a3b2c', wood: '#9a7656', woodDark: '#7a5a40', concrete: '#d6d0c4', asphalt: '#5d544f', line: '#e8dcc0', shadow: 'rgba(30,18,10,.32)', light: '#ffe8b8', sun: '#fff0cc', cloud: '#e8d8c8' },
  underground:{ sky: ['#5c5b62', '#6a6970'], ambient: '#8c8a88', key: '#f6f4ec', rim: '#f4efdc', wall: '#bdb7ad', floor: '#6c6c70', dark: '#3c3c42', practical: '#ffffff', grass: '#5a7a48', road: '#6a6a6f', fog: '#a8a49c',
                brick: '#bdb7ad', brickLine: '#aaa499', siding: '#b3ada3', glass: '#3e4a60', glassHi: '#6a7a96', frame: '#a8a298', trim: '#cbc5bb', leaf: ['#4f7a48', '#668f52', '#86ab66'], trunk: '#5a3b2c', wood: '#a08060', woodDark: '#7f6248', concrete: '#bdb7ad', asphalt: '#6a6a6f', line: '#e2c45c', shadow: 'rgba(20,20,25,.3)', light: '#fbf8ee', sun: '#ffffff', cloud: '#c8c4bc' },
  indoorDay:  { sky: ['#9fcbea', '#cfe6f4'], ambient: '#a49c94', key: '#fff4dc', rim: '#fbefd0', wall: '#e7dcc8', floor: '#b88d63', dark: '#3d3530', practical: '#fff2c4', grass: '#86b965', road: '#5a5d65', fog: '#efe6d6',
                brick: '#d9cdb8', brickLine: '#c9bca6', siding: '#d6cab4', glass: '#8fbde3', glassHi: '#c5e0f3', frame: '#f6f2ea', trim: '#c9b79c', leaf: ['#5f9a4f', '#79b25f', '#9fcd7c'], trunk: '#6a4630', wood: '#b88d63', woodDark: '#946c48', concrete: '#d8d2c6', asphalt: '#5f6168', line: '#eeeeea', shadow: 'rgba(40,30,20,.24)', light: '#fff4d6', sun: '#fff6d8', cloud: '#ffffff' },
  indoorNight:{ sky: ['#1b2447', '#2c3a68'], ambient: '#4a4258', key: '#ffdca0', rim: '#f6e2b6', wall: '#6d6478', floor: '#5a4a44', dark: '#1e1a22', practical: '#ffd98c', grass: '#3f5f4a', road: '#3b3e48', fog: '#5a5068',
                brick: '#6d6478', brickLine: '#5d5568', siding: '#675e72', glass: '#1d2550', glassHi: '#3a4a8a', frame: '#d9d0c4', trim: '#8a7a6a', leaf: ['#2f4a3e', '#3b5a49', '#4d7058'], trunk: '#3a2a26', wood: '#7e5f4c', woodDark: '#5f4636', concrete: '#7a7480', asphalt: '#3d4049', line: '#b9bcc4', shadow: 'rgba(10,6,15,.38)', light: '#ffdc9c', sun: '#f4f0dc', cloud: '#2c3a68' },
};


const UI = { card: 'rgba(18,28,48,.94)', cardLine: 'rgba(150,180,230,.25)', text: '#9fb6d8', sub: '#6f84a6', accent: '#ff6f61', gold: '#ffd47e', cream: '#fff1dc', blueprint: '#8fb8e8', bpBg: '#0b1324', good: '#5fd39a' };

export const STYLES = {
  // ---- Toon styles (default family). `outline` = the cream edge light on characters, `toon` = character tokens.
  toon: {
    name: 'Flat Daylight', desc: 'Reference look: bright flat 2.5D vector sets, soft daylight, black-headed hoodie characters with a cream edge line, no letterbox, almost no grain.',
    ink: '#131316', inkFar: '#232329', feature: '#ffffff', rimWidth: 3, outline: '#f7eccb', ui: { ...UI, card: 'rgba(22,22,26,.92)', cardLine: 'rgba(255,255,255,.18)', text: '#f2efe8', sub: '#c9c3b8', gold: '#f7c948', accent: '#ef5a4a', cream: '#fff6e4', blueprint: '#9cc6ee', bpBg: '#16253d' },
    toon: { pants: '#262a33', stripe: '#efe4c4', shoe: '#f4f4f0', sole: '#c9c6bf', hand: '#131316', hair: '#1c1612', shadow: 'rgba(25,28,36,.26)' },
    grade: { contrast: 1.0, sat: 1.0, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.2, grain: 0.012, bloom: 0.25 },
    moods: {},
  },
  toonWarm: {
    name: 'Warm Afternoon', desc: 'Same flat world in late warm sun: creamier highlights, peachy shadows, slightly richer colour.',
    ink: '#151213', inkFar: '#2a2426', feature: '#fffaf0', rimWidth: 3, outline: '#ffe6b0', ui: { ...UI, card: 'rgba(30,22,20,.92)', cardLine: 'rgba(255,220,180,.2)', text: '#fff1dc', sub: '#d8c2a8', gold: '#ffc94a', accent: '#f0603f', cream: '#fff1dc', blueprint: '#a8c8ee', bpBg: '#1e2238' },
    toon: { pants: '#2a2526', stripe: '#f6dfb0', shoe: '#fbf6ec', sole: '#d6c8b4', hand: '#151213', hair: '#22160f', shadow: 'rgba(50,28,20,.28)' },
    grade: { contrast: 1.03, sat: 1.08, lift: [0.02, 0.01, 0.0], gamma: [1.04, 1.01, 0.96], gain: [1.06, 1.0, 0.9], vignette: 0.24, grain: 0.015, bloom: 0.35 },
    moods: { sunny: { sky: ['#8ab6dc', '#c9dceb', '#f6e2c4'] } },
  },
  toonPop: {
    name: 'Bright Pop', desc: 'Punchier saturation and contrast for kids/meme energy; whiter edge line, cleaner skies.',
    ink: '#0f0f12', inkFar: '#1f1f25', feature: '#ffffff', rimWidth: 3.2, outline: '#ffffff', ui: { ...UI, card: 'rgba(16,16,22,.94)', cardLine: 'rgba(255,255,255,.2)', text: '#ffffff', sub: '#d0d0d8', gold: '#ffd23f', accent: '#ff4d5a', cream: '#ffffff', blueprint: '#7fc4ff', bpBg: '#10213d' },
    toon: { pants: '#22263a', stripe: '#ffffff', shoe: '#ffffff', sole: '#cfd2d8', hand: '#0f0f12', hair: '#17110d', shadow: 'rgba(20,24,40,.26)' },
    grade: { contrast: 1.07, sat: 1.22, lift: [0, 0, 0.01], gamma: [1, 1, 1.02], gain: [1.02, 1.02, 1.03], vignette: 0.12, grain: 0.0, bloom: 0.3 },
    moods: { sunny: { sky: ['#6fb6f0', '#a8d8f8', '#dff1fb'] } },
  },
  toonSoft: {
    name: 'Soft Pastel', desc: 'Lower contrast, milky pastel tones, gentle paper grain — calm, cosy, family-friendly.',
    ink: '#1c1a22', inkFar: '#3a3644', feature: '#fffdf6', rimWidth: 3.4, outline: '#fff4dc', ui: { ...UI, card: 'rgba(40,36,52,.9)', cardLine: 'rgba(255,255,255,.2)', text: '#fff6ea', sub: '#d8cfe0', gold: '#ffd98a', accent: '#ff8a7a', cream: '#fff6ea', blueprint: '#b0d0f0', bpBg: '#2a3350' },
    toon: { pants: '#3a3846', stripe: '#fff1d8', shoe: '#fffdf6', sole: '#ddd6cc', hand: '#1c1a22', hair: '#2a2024', shadow: 'rgba(60,50,80,.2)' },
    grade: { contrast: 0.9, sat: 0.88, lift: [0.06, 0.05, 0.075], gamma: [1.08, 1.06, 1.04], gain: [1.02, 1.0, 0.98], vignette: 0.12, grain: 0.04, bloom: 0.25 },
    moods: {},
  },
  toonEvening: {
    name: 'Moody Evening', desc: 'The flat world after sunset: cooler blue shadows, warm practical lights, stronger vignette — for tense or emotional beats.',
    ink: '#101116', inkFar: '#22242e', feature: '#f6f4ff', rimWidth: 3, outline: '#ffe2a8', ui: { ...UI, card: 'rgba(14,16,28,.94)', cardLine: 'rgba(170,190,255,.22)', text: '#e8ecff', sub: '#a8b0cc', gold: '#ffc861', accent: '#ff6a5a', cream: '#f4f0ff', blueprint: '#8fb8e8', bpBg: '#0e1830' },
    toon: { pants: '#1f2230', stripe: '#d8d4c4', shoe: '#e8e8ec', sole: '#a8aab4', hand: '#101116', hair: '#141016', shadow: 'rgba(5,8,25,.36)' },
    grade: { contrast: 1.05, sat: 0.9, lift: [0.0, 0.015, 0.06], gamma: [0.94, 0.97, 1.06], gain: [0.94, 0.96, 1.06], vignette: 0.42, grain: 0.03, bloom: 0.55 },
    moods: { sunny: { sky: ['#4a5a96', '#8a86b8', '#e8a888'], key: '#ffd8a8' } },
  },
  dusk: {
    name: 'Cinematic Dusk', desc: 'Reference look: mauve-purple shadows, amber key light, cream rim light, soft grain, 2:1 letterbox.',
    ink: '#0e0b12', inkFar: '#2b2333', feature: '#f4efe6', rimWidth: 4, ui: UI,
    grade: { contrast: 1.0, sat: 1.0, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.55, grain: 0.055, bloom: 0.55 },
    moods: {},
  },
  midnight: {
    name: 'Midnight Blue', desc: 'Cold navy world, blue-white rim light, sodium-orange practical lights, rain-friendly, higher contrast.',
    ink: '#0a0c16', inkFar: '#232a40', feature: '#eef3ff', rimWidth: 4, ui: { ...UI, accent: '#ff8a5c', gold: '#ffc66e' },
    grade: { contrast: 1.06, sat: 0.8, lift: [0.0, 0.025, 0.09], gamma: [0.92, 0.98, 1.08], gain: [0.84, 0.95, 1.15], vignette: 0.65, grain: 0.06, bloom: 0.7 },
    moods: { dusk: { sky: ['#141a3a', '#2c3470', '#5a5aa0', '#c08aa0'], key: '#d8dcff', rim: '#b8c8ff', wall: '#2a2c4a', floor: '#1e2036' }, golden: { rim: '#ffd6a8' }, interiorWarm: { wall: '#3a3448', sky: ['#5a5a90', '#c09ab0'] } },
  },
  golden: {
    name: 'Golden Hour', desc: 'Warm orange-and-teal daylight, big sun glows, brighter mid-tones, warm cream rim light.',
    ink: '#120c0a', inkFar: '#3a2a26', feature: '#fff6e6', rimWidth: 4.5, ui: { ...UI, card: 'rgba(30,26,40,.92)', accent: '#ff7a4a' },
    grade: { contrast: 1.04, sat: 1.18, lift: [0.035, 0.015, 0.0], gamma: [1.1, 1.04, 0.94], gain: [1.12, 1.02, 0.8], vignette: 0.45, grain: 0.045, bloom: 0.75 },
    moods: { night: { sky: ['#14183a', '#2e2c5a', '#6a4a6a'], rim: '#ffcf9a' }, dusk: { sky: ['#4a3a6a', '#d0786a', '#f2a46a', '#fbd8a0'] } },
  },
  neon: {
    name: 'Neon Noir', desc: 'Deep blacks, magenta + teal two-tone rim lights, glowing signage, strong bloom, cool shadows.',
    ink: '#07060c', inkFar: '#1e1830', feature: '#f6f0ff', rimWidth: 4, ui: { ...UI, card: 'rgba(14,10,28,.94)', cardLine: 'rgba(200,120,255,.3)', text: '#c9a8ff', accent: '#ff4fa3', gold: '#5ff2e8', blueprint: '#7fe8ff' },
    grade: { contrast: 1.15, sat: 1.4, lift: [0.01, 0.0, 0.04], gamma: [1.0, 0.9, 1.06], gain: [1.12, 0.86, 1.18], vignette: 0.7, grain: 0.06, bloom: 0.9 },
    moods: { dusk: { sky: ['#120a2a', '#3a1a5a', '#a03a8a', '#ff7a9a'], rim: '#ff6ac8', key: '#ff8ad0', practical: '#5ff2e8' }, night: { sky: ['#06061a', '#140f3a', '#2a1a5a'], rim: '#5ff2e8', practical: '#ff4fa3' }, interiorWarm: { rim: '#ff7ab8', practical: '#5ff2e8', wall: '#2a1e3a' }, day: { rim: '#7ff0ff' } },
  },
  storybook: {
    name: 'Soft Storybook', desc: 'Lighter pastel palette, lower contrast, lavender shadows, gentle paper grain — friendlier, family tone.',
    ink: '#1a1622', inkFar: '#4a4258', feature: '#fffaf0', rimWidth: 5, ui: { ...UI, card: 'rgba(40,36,60,.9)', accent: '#ff8a7a', gold: '#ffd98a' },
    grade: { contrast: 0.92, sat: 0.92, lift: [0.07, 0.055, 0.085], gamma: [1.12, 1.1, 1.06], gain: [1.06, 1.03, 0.98], vignette: 0.3, grain: 0.07, bloom: 0.45 },
    moods: { night: { sky: ['#2a2f5a', '#4a4f80', '#6a6aa0'], wall: '#3e4266' }, dusk: { sky: ['#6a5a90', '#c08aa8', '#f2b0a0', '#fbe0b8'] } },
  },
};
export const STYLE_IDS = Object.keys(STYLES);
