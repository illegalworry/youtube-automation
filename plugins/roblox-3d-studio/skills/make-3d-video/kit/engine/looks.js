// engine/looks.js — the visual identity of Roblox 3D Studio.
// LOOKS  = whole-video colour grade (applied by the player after every frame).
// LIGHTS = per-scene lighting presets (sky, sun, ambient, fog, exposure, bloom) used by r3d.stage().

// grade: lift/gamma/gain per channel, contrast, sat, vignette (0..1), grain (0..0.1), tint [colour, blendMode, amount]
export const LOOKS = {
  bright:    { name: 'Bright Roblox',  grade: { contrast: 1.04, sat: 1.12, vignette: 0.16, grain: 0, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1] } },
  cinematic: { name: 'Cinematic',      grade: { contrast: 1.1, sat: 1.0, vignette: 0.34, grain: 0.025, lift: [0.0, 0.015, 0.03], gamma: [1.0, 1.0, 0.98], gain: [1.03, 1.0, 0.96] } },
  cartoon:   { name: 'Cartoon Pop',    grade: { contrast: 1.0, sat: 1.28, vignette: 0.1, grain: 0, lift: [0.02, 0.02, 0.03], gamma: [1.05, 1.05, 1.05], gain: [1, 1, 1] } },
  horror:    { name: 'Horror',         grade: { contrast: 1.18, sat: 0.62, vignette: 0.55, grain: 0.05, lift: [0.0, 0.02, 0.03], gamma: [0.95, 1.0, 1.02], gain: [0.95, 1.0, 1.02] } },
  retro:     { name: 'Retro 2008',     grade: { contrast: 0.96, sat: 0.86, vignette: 0.28, grain: 0.045, lift: [0.04, 0.03, 0.0], gamma: [1.02, 1.0, 0.95], gain: [1.02, 0.99, 0.92] } },
};

// sky: [zenith, horizon] gradient; sun: colour, intensity, direction (from target towards the sun);
// hemi: [skyColour, groundColour, intensity]; fog: [colour, near, far]; stars: n; clouds: true
export const LIGHTS = {
  day:      { sky: ['#3f8ee8', '#bfe3ff'], sun: ['#fff4e0', 2.9, [0.45, 1, 0.35]], hemi: ['#d6ecff', '#8a7a5a', 1.25], fog: ['#cfe6fb', 90, 340], exposure: 1.0, bloom: 0.18, clouds: true },
  golden:   { sky: ['#4f78c8', '#ffc98a'], sun: ['#ffcf8f', 3.0, [-0.8, 0.45, 0.4]], hemi: ['#ffe0b8', '#6a4a3a', 0.95], fog: ['#f6c79a', 70, 300], exposure: 1.02, bloom: 0.3, clouds: true },
  sunset:   { sky: ['#3a2a6a', '#ff8a5a'], sun: ['#ff9a5a', 2.6, [-0.9, 0.25, 0.2]], hemi: ['#ffb08a', '#3a2a40', 0.8], fog: ['#e88a6a', 60, 260], exposure: 1.0, bloom: 0.4, clouds: true },
  night:    { sky: ['#050a1c', '#1c2a55'], sun: ['#9fb8ff', 1.1, [0.4, 1, -0.5]], hemi: ['#5a6aa8', '#141420', 0.55], fog: ['#121a36', 40, 200], exposure: 1.05, bloom: 0.6, stars: 900 },
  interior: { sky: ['#e8d8c0', '#e8d8c0'], sun: ['#fff0d8', 2.2, [0.6, 1, 0.8]], hemi: ['#fff2e0', '#6a5040', 1.25], fog: null, exposure: 1.0, bloom: 0.22 },
  storm:    { sky: ['#2a3038', '#5a6470'], sun: ['#c8d4e0', 1.2, [0.2, 1, 0.3]], hemi: ['#8a96a8', '#2a2a30', 0.9], fog: ['#4a525c', 30, 160], exposure: 1.0, bloom: 0.2 },
  studio:   { sky: ['#20232c', '#3a3f4c'], sun: ['#ffffff', 2.6, [0.5, 1, 0.7]], hemi: ['#e8eeff', '#30303a', 1.1], fog: null, exposure: 1.0, bloom: 0.2 },
  space:    { sky: ['#000000', '#0a0c22'], sun: ['#ffffff', 3.2, [-0.7, 0.6, 0.4]], hemi: ['#4050a0', '#101018', 0.35], fog: null, exposure: 1.0, bloom: 0.5, stars: 2200 },
  cave:     { sky: ['#0a0806', '#14100c'], sun: ['#ffb070', 1.0, [0.2, 1, 0.4]], hemi: ['#6a5a50', '#0a0806', 0.45], fog: ['#0e0a08', 18, 90], exposure: 1.1, bloom: 0.55 },
  spooky:   { sky: ['#0c0a18', '#3a2a4a'], sun: ['#b8a0ff', 1.0, [-0.3, 1, -0.6]], hemi: ['#6a5a90', '#100c14', 0.6], fog: ['#2a2238', 25, 140], exposure: 1.0, bloom: 0.5, stars: 400 },
};

// Roblox-like palette (classic BrickColor names) — use these for clothes, props and sets.
export const BRICK = {
  brightYellow: '#f5cd30', brightRed: '#c4281c', brightBlue: '#0d69ac', brightGreen: '#4b974b', brightOrange: '#da8541',
  brightViolet: '#6b327c', reallyRed: '#ff0000', reallyBlue: '#0000ff', limeGreen: '#00ff00', cyan: '#12eed4',
  institutionalWhite: '#f8f8f8', black: '#1b2a35', darkStoneGrey: '#636769', mediumStoneGrey: '#a3a2a5', lightStoneGrey: '#e5e4df',
  reddishBrown: '#694028', nougat: '#cc8e69', lightOrange: '#eab892', pastelBlue: '#80bbdb', pink: '#ff66cc', hotPink: '#ff00bf',
  teal: '#12a0a0', navy: '#002060', camo: '#3a7d15', sand: '#d7c59a', brick: '#8f4c2a', grass: '#4b974b', water: '#3a8fd6',
  // skin tones
  skinYellow: '#f5cd30', skinLight: '#f2d3b0', skinTan: '#d9a77a', skinBrown: '#a86f48', skinDark: '#6b4430', skinPale: '#fbe6d4',
};
