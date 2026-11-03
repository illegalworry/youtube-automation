// engine/styles.js — colour moods + switchable visual styles for Razgon Glow Studio.
// A MOOD is the lighting situation of a location. The Glow moods (porch, office, sunset, park, dark, rainy,
// day, home, school, data) were measured from the reference look: soft, slightly desaturated, milky shadows,
// one warm or cool key light, glowing practicals. The legacy moods (golden, dusk, night, storm, interiorWarm,
// interiorCool, void) stay available so every old helper keeps working.
// A STYLE re-grades every mood (palette overrides + a lift/gamma/gain colour grade + soft 2D bloom + post).
// Scenes must take colours from mood()/S() so a style switch re-themes the whole video.
//
// Mood keys: sky[] (top→horizon), ambient, key (main light), rim (edge light on characters), wall, wall2 (darker
// wall band / far wall), trim (frames, rails, skirting), floor, floor2 (near floor, darker), dark (deepest tone),
// practical (lamp / window / screen colour), grass, road, fog, haze (light haze over far layers), leaf[] (tree colours).

export const BASE_MOODS = {
  // ---- Glow moods (reference look) ----
  porch:  { sky: ['#0b0f2a', '#161c42', '#232a58'], ambient: '#2a2f55', key: '#ffd9a0', rim: '#f2b866', wall: '#7a778c', wall2: '#646074', trim: '#9c99b0', floor: '#1a2146', floor2: '#141a3a', dark: '#0d1130', practical: '#fff1cc', grass: '#1f3838', road: '#1c2240', fog: '#3a4070', haze: '#8b8aa8', leaf: ['#5a3a3a', '#6a5a3a', '#3a4a3a'] },
  office: { sky: ['#9fb9d2', '#d6e2ec'], ambient: '#5a6472', key: '#f4f8ff', rim: '#eef5ff', wall: '#7b848e', wall2: '#6b737e', trim: '#a2abb5', floor: '#4d5c71', floor2: '#435166', dark: '#2a323e', practical: '#ffffff', grass: '#6f9a64', road: '#5a6270', fog: '#c9d3dc', haze: '#b9c2cc', leaf: ['#6f9a64', '#8fb070', '#5a8060'] },
  sunset: { sky: ['#d97f80', '#ee9a7a', '#f6b77c', '#fbd69a'], ambient: '#a8645a', key: '#fff2c8', rim: '#ffe1a6', wall: '#bb8159', wall2: '#a06e4e', trim: '#d9a173', floor: '#e29c60', floor2: '#c98450', dark: '#5e342e', practical: '#fffbe0', grass: '#9d7b3e', road: '#c98a5a', fog: '#f6c08e', haze: '#f2b58e', leaf: ['#b05a3a', '#c8903a', '#7a8a3a'] },
  park:   { sky: ['#a85a78', '#cf7a7c', '#e59c88'], ambient: '#6a4a5a', key: '#ffd7b0', rim: '#f6c2a0', wall: '#8f6c82', wall2: '#7a5c74', trim: '#b08a96', floor: '#a8817a', floor2: '#94716b', dark: '#2e2230', practical: '#ffe2b8', grass: '#475033', road: '#94716b', fog: '#c08a92', haze: '#c99aa2', leaf: ['#7c4d3b', '#8b613c', '#a0763c', '#5a6a3c', '#6e3e30'] },
  dark:   { sky: ['#06050f', '#0c0b1c'], ambient: '#141428', key: '#e9effa', rim: '#c8d6ff', wall: '#0b0a18', wall2: '#08070f', trim: '#1c1c34', floor: '#2a3046', floor2: '#1c2136', dark: '#04030a', practical: '#ebeffa', grass: '#1a2a2a', road: '#14182a', fog: '#1a1a34', haze: '#2a2a48', leaf: ['#1a2a2a', '#22303a', '#2a2a3a'] },
  rainy:  { sky: ['#1b2440', '#2c3858', '#46557a'], ambient: '#2c3654', key: '#dfe6ff', rim: '#cfd9ff', wall: '#3a4462', wall2: '#2c3550', trim: '#56607e', floor: '#262e48', floor2: '#1e253c', dark: '#10142a', practical: '#ffe7b0', grass: '#25443e', road: '#232a40', fog: '#8a96b8', haze: '#6a7698', leaf: ['#2a4a44', '#34504a', '#3a4a5a'] },
  day:    { sky: ['#8fbde2', '#c6def0', '#efe9dc'], ambient: '#7a8698', key: '#fff6e0', rim: '#fff2d8', wall: '#c9b8a8', wall2: '#b3a292', trim: '#e2d6c8', floor: '#9aa0a8', floor2: '#888e98', dark: '#3a4252', practical: '#ffffff', grass: '#7aa05a', road: '#8a8a92', fog: '#e0e8f0', haze: '#d6e2ee', leaf: ['#6a9a4a', '#88b05a', '#4f8a50'] },
  home:   { sky: ['#1e2450', '#33386a', '#4a4a7a'], ambient: '#5a4048', key: '#ffd59a', rim: '#ffcf8f', wall: '#8a6f6a', wall2: '#745c58', trim: '#a88a80', floor: '#5a4440', floor2: '#4a3834', dark: '#2a1c22', practical: '#ffe2a8', grass: '#3d5a48', road: '#3a3040', fog: '#a07a70', haze: '#a08890', leaf: ['#4a5a3a', '#5a6a3a', '#3a4a3a'] },
  school: { sky: ['#a6c8e6', '#d8e8f2'], ambient: '#6a7480', key: '#fff8ea', rim: '#fff3dc', wall: '#a7b29a', wall2: '#929d86', trim: '#c9cfbd', floor: '#8a7a6a', floor2: '#7a6a5a', dark: '#3a3a3a', practical: '#ffffff', grass: '#7aa05a', road: '#7a7a82', fog: '#dfe6e8', haze: '#cfd8dc', leaf: ['#6a9a4a', '#88b05a', '#4f8a50'] },
  data:   { sky: ['#191e34', '#242a46'], ambient: '#20263f', key: '#ffffff', rim: '#a9b8e8', wall: '#20263f', wall2: '#1a2036', trim: '#2e3656', floor: '#181d30', floor2: '#141828', dark: '#0d1020', practical: '#ffb347', grass: '#1d3a33', road: '#151a28', fog: '#2a3256', haze: '#3a4266', leaf: ['#2a3a4a', '#3a4a5a', '#2a3a3a'] },
  // ---- legacy moods (kept for the old helpers and for variety) ----
  golden:       { sky: ['#7a6a9e', '#e8a07a', '#f9d49c'], ambient: '#6a5060', key: '#ffd59a', rim: '#ffcf96', wall: '#8a6a5a', wall2: '#74584a', trim: '#a8806a', floor: '#6a5048', floor2: '#5a4440', dark: '#3a2620', practical: '#ffe7b0', grass: '#6a8a4a', road: '#6a5a5a', fog: '#f0c49a', haze: '#e8b898', leaf: ['#9a6a3a', '#b08a3a', '#6a7a3a'] },
  dusk:         { sky: ['#4d4370', '#9a6a90', '#e8a07a', '#f7cf98'], ambient: '#4b3b4d', key: '#ffc68a', rim: '#ffc68a', wall: '#6a5466', wall2: '#5a4658', trim: '#8a7086', floor: '#4d3c48', floor2: '#40323c', dark: '#2a2030', practical: '#ffd59a', grass: '#4d6a58', road: '#4a4050', fog: '#c09a9a', haze: '#b08a98', leaf: ['#7a4a4a', '#8a6a4a', '#4a5a4a'] },
  night:        { sky: ['#0d1230', '#1d2550', '#3a3570'], ambient: '#232a4c', key: '#c9d4ff', rim: '#b9c6ff', wall: '#363a5a', wall2: '#2c3050', trim: '#4a4e70', floor: '#22263e', floor2: '#1b1e33', dark: '#10132a', practical: '#ffc070', grass: '#22433a', road: '#24263a', fog: '#3a4270', haze: '#4a5280', leaf: ['#22433a', '#2a4a44', '#2a3a4a'] },
  storm:        { sky: ['#141a33', '#2a3358', '#3d4670'], ambient: '#232a48', key: '#dfe6ff', rim: '#cfd9ff', wall: '#2b3150', wall2: '#232840', trim: '#3d4466', floor: '#1c2238', floor2: '#161b2e', dark: '#0d1020', practical: '#bcd0ff', grass: '#25483e', road: '#232838', fog: '#4a5580', haze: '#5a6590', leaf: ['#25483e', '#2a4a44', '#2a3a4a'] },
  interiorWarm: { sky: ['#c98a74', '#f2b585', '#f7cf98'], ambient: '#5a4652', key: '#ffd59a', rim: '#ffcf8f', wall: '#7a5f62', wall2: '#664e52', trim: '#987a7a', floor: '#5a4448', floor2: '#4a383c', dark: '#2a1c22', practical: '#ffd28a', grass: '#3d5a48', road: '#3a3040', fog: '#a87a70', haze: '#a08080', leaf: ['#4a5a3a', '#5a6a3a', '#3a4a3a'] },
  interiorCool: { sky: ['#3a4570', '#6a7ab0'], ambient: '#3a3c58', key: '#cbd6ff', rim: '#c0ccff', wall: '#4a4e6e', wall2: '#3e4260', trim: '#5e6284', floor: '#2e3048', floor2: '#26283e', dark: '#161a30', practical: '#9fe0ff', grass: '#22433a', road: '#24263a', fog: '#4a5080', haze: '#5a6090', leaf: ['#22433a', '#2a4a44', '#2a3a4a'] },
  void:         { sky: ['#0a0e1a', '#121a2e'], ambient: '#151c30', key: '#ffffff', rim: '#8fb8e8', wall: '#121a2e', wall2: '#0e1424', trim: '#1e2840', floor: '#0d1322', floor2: '#0a0f1c', dark: '#070a12', practical: '#ffd47e', grass: '#1d3a33', road: '#151a28', fog: '#1d2740', haze: '#2a3450', leaf: ['#1d3a33', '#2a3a4a', '#1d2a3a'] },
};

// UI tokens. card = the dark navy stat card; pill = the dark rounded number pill ("57 %"); gold = its orange number;
// price = the muted red price colour on posters; paper = posters and signs; ink2 = dark text on paper.
const UI = { card: 'rgba(24,29,52,.96)', cardLine: 'rgba(170,185,230,.18)', text: '#eef1f8', sub: '#8e97b4', accent: '#ff6a5c', gold: '#ffad45', cream: '#fff6e8',
  blueprint: '#8fb8e8', bpBg: '#141a30', good: '#7fd39a', pill: 'rgba(28,30,44,.92)', pillLine: 'rgba(255,255,255,.08)', price: '#c24c4c', paper: '#eceae6', paperShade: '#d2d0cf', ink2: '#3c3d4a', chalk: '#2d2a22', bar1: '#d9a8c8', bar2: '#f3a64a' };

export const STYLES = {
  soft: {
    name: 'Soft Glow', desc: 'The reference look: soft milky shadows, one warm or cool key light, cream edge light on every character, gentle bloom, light haze, full frame.',
    ink: '#16131b', inkFar: '#211d27', inkHi: '#3a3340', feature: '#fbf7f0', rimWidth: 3, ui: UI,
    grade: { contrast: 0.95, sat: 0.94, lift: [0.018, 0.018, 0.03], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.3, grain: 0.022, bloom: 0.5, glow: 0.32, glowRadius: 14 },
    moods: {},
  },
  clear: {
    name: 'Clear', desc: 'Same look without the haze: no milky shadows or grain, normal contrast, light bloom only around lamps and screens.', ink: '#16131b', inkFar: '#211d27', inkHi: '#3a3340', feature: '#fbf7f0', rimWidth: 3, ui: UI,
    grade: { contrast: 1.03, sat: 1.0, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.2, grain: 0, bloom: 0.4, glow: 0.12, glowRadius: 10 },
    moods: {},
  },
  nocturne: {
    name: 'Nocturne', desc: 'Cooler and deeper: navy shadows, blue-white edge light, warm lamps pop harder. Night, mystery, loneliness.',
    ink: '#0f0e16', inkFar: '#1c1b28', inkHi: '#2e2c40', feature: '#f2f5ff', rimWidth: 3, ui: { ...UI, gold: '#ffb85c' },
    grade: { contrast: 1.02, sat: 0.86, lift: [0.0, 0.012, 0.05], gamma: [0.95, 0.98, 1.06], gain: [0.9, 0.96, 1.08], vignette: 0.42, grain: 0.03, bloom: 0.65, glow: 0.38, glowRadius: 16 },
    moods: { park: { sky: ['#4a3f6e', '#7a5f88', '#b07a8a'], rim: '#e8c8d8' }, sunset: { sky: ['#7a5a8a', '#c8787e', '#eea07e'] }, office: { wall: '#6a7484', rim: '#e6efff' } },
  },
  peach: {
    name: 'Peach Hour', desc: 'Warm and nostalgic: peach highlights, honey edge light, teal-leaning shadows, bigger bloom. Happy memories, summer, hope.',
    ink: '#1a1416', inkFar: '#2a2024', inkHi: '#463438', feature: '#fff8ee', rimWidth: 3.2, ui: { ...UI, card: 'rgba(40,30,44,.95)', gold: '#ffb04a' },
    grade: { contrast: 0.96, sat: 1.06, lift: [0.03, 0.018, 0.012], gamma: [1.05, 1.02, 0.97], gain: [1.06, 1.0, 0.9], vignette: 0.32, grain: 0.022, bloom: 0.7, glow: 0.4, glowRadius: 18 },
    moods: { porch: { rim: '#ffc078', key: '#ffd08a' }, office: { wall: '#8a8a8e', rim: '#fff0dc', key: '#fff2e0' }, dark: { rim: '#ffd8b8' } },
  },
  pastel: {
    name: 'Pastel Air', desc: 'Lighter and friendlier: lifted shadows, pastel walls, low contrast, thin bright edges. Family, kids, wholesome topics.',
    ink: '#221e2a', inkFar: '#2e2a36', inkHi: '#4a4456', feature: '#ffffff', rimWidth: 3, ui: { ...UI, card: 'rgba(44,48,74,.94)' },
    grade: { contrast: 0.88, sat: 0.9, lift: [0.06, 0.055, 0.07], gamma: [1.08, 1.08, 1.06], gain: [1.03, 1.03, 1.02], vignette: 0.18, grain: 0.018, bloom: 0.45, glow: 0.26, glowRadius: 12 },
    moods: { porch: { sky: ['#2a3060', '#3a4278'], floor: '#2a3460', wall: '#8e8ba2' }, dark: { wall: '#16162a', floor: '#3a4260' } },
  },
  crisp: {
    name: 'Crisp', desc: 'Sharper and punchier for Shorts: more contrast and saturation, thinner haze, slightly thicker edge light.',
    ink: '#121016', inkFar: '#1e1a24', inkHi: '#34303e', feature: '#ffffff', rimWidth: 3.6, ui: UI,
    grade: { contrast: 1.08, sat: 1.12, lift: [0, 0, 0.01], gamma: [1, 1, 1], gain: [1.02, 1.02, 1.02], vignette: 0.3, grain: 0.015, bloom: 0.45, glow: 0.2, glowRadius: 10 },
    moods: {},
  },
};
export const STYLE_IDS = Object.keys(STYLES);
export const DEFAULT_STYLE = 'soft';
