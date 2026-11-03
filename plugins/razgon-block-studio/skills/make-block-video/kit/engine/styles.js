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
};


// ---------- GAME-WORLD moods (used by engine/worldsets.js). Every key is used by the set pieces. ----------
const GM = (o) => ({ ambient: '#6f86b0', key: '#fff6e0', rim: '#ffffff', dark: '#1b2433', practical: '#ffd56a', fog: '#dfeaff', ...o });
Object.assign(BASE_MOODS, {
  gameDay:    GM({ sky: ['#2f8cf0', '#5fb2ff', '#a8dcff'], cloud: '#ffffff', cloudShade: '#d6e6f7', sun: '#ffe36a', grass: '#47c24a', grassTop: '#6fe063', dirt: '#9a6a3c', stone: '#9aa3ad', road: '#4c535e', line: '#ffd23f', walk: '#c9ced6', wall: '#f3e6cf', wall2: '#bfe3c8', roof: '#3b6fd4', roof2: '#d9534a', trim: '#ffffff', glass: '#8fd0ff', leaf: ['#3fb34a', '#5fd25a', '#2e8f3c'], trunk: '#8a5a32', floor: '#c9a27a', shadow: 'rgba(20,30,60,.22)', outline: '#2a2f3a', water: '#3aa0ff', lava: '#ff5a1f' }),
  gameSunset: GM({ sky: ['#4a3a9a', '#e0708a', '#ffc27a'], cloud: '#ffe6e0', cloudShade: '#e8a8b0', sun: '#ffb04a', grass: '#3fa04a', grassTop: '#62c25a', dirt: '#8a5a3c', stone: '#8a8a9a', road: '#45465a', line: '#ffcc5a', walk: '#b8b0c0', wall: '#f0d0b8', wall2: '#c8d8b8', roof: '#5a4ab4', roof2: '#c84a4a', trim: '#fff3e6', glass: '#ffb88a', leaf: ['#3a9a4a', '#58b85a', '#2a7a3a'], trunk: '#7a4a2c', floor: '#b8906a', shadow: 'rgba(40,20,60,.25)', outline: '#2a2236', water: '#6a7aff', lava: '#ff5a1f' }),
  gameNight:  GM({ sky: ['#0d1440', '#1f2a7a', '#3a3f9a'], cloud: '#6a74b8', cloudShade: '#4a5290', sun: '#fff6c8', grass: '#2a6a4a', grassTop: '#3a8a5a', dirt: '#5a3a2c', stone: '#5a6070', road: '#262a3a', line: '#c8a83a', walk: '#5a6078', wall: '#6a6aa0', wall2: '#5a7a8a', roof: '#2a3a8a', roof2: '#7a3a5a', trim: '#c8c8ff', glass: '#ffd56a', leaf: ['#2a6a4a', '#3a7a5a', '#1f5a3a'], trunk: '#4a3428', floor: '#5a4a6a', shadow: 'rgba(0,0,20,.35)', outline: '#0f1226', water: '#2a3aa0', lava: '#ff5a1f', key: '#c8d0ff' }),
  gameAlarm:  GM({ sky: ['#5a0610', '#b0141f', '#ff3a2a'], cloud: '#a0202a', cloudShade: '#7a1018', sun: '#ff6a4a', grass: '#8a2a2a', grassTop: '#b03a3a', dirt: '#5a1a14', stone: '#8a4a4a', road: '#4a1a20', line: '#ff8a5a', walk: '#a05a5a', wall: '#e07a6a', wall2: '#c0605a', roof: '#8a1a24', roof2: '#c0302a', trim: '#ffc8c0', glass: '#ff9a8a', leaf: ['#9a2a2a', '#b84040', '#7a1a1a'], trunk: '#5a2018', floor: '#9a4a40', shadow: 'rgba(40,0,0,.3)', outline: '#3a0a10', water: '#c0303a', lava: '#ffb02a', key: '#ffb0a0' }),
  gameStorm:  GM({ sky: ['#2a0f5a', '#6a2ab4', '#b46aff'], cloud: '#8a5ad8', cloudShade: '#6a3ab0', sun: '#e0b0ff', grass: '#3a7a6a', grassTop: '#4a9a7a', dirt: '#5a3a4a', stone: '#6a6a8a', road: '#33304a', line: '#d0a0ff', walk: '#7a70a0', wall: '#a090c8', wall2: '#7a90a8', roof: '#4a2a8a', roof2: '#8a3a8a', trim: '#e8dcff', glass: '#d0b0ff', leaf: ['#3a7a6a', '#4a8a7a', '#2a5a5a'], trunk: '#4a3040', floor: '#6a5a80', shadow: 'rgba(20,0,40,.3)', outline: '#1a0a33', water: '#5a3aff', lava: '#ff5a1f', key: '#e0c8ff' }),
  gameDead:   GM({ sky: ['#6a6e78', '#8a8e98', '#b0b4bc'], cloud: '#c8ccd2', cloudShade: '#a8acb4', sun: '#e0e0e0', grass: '#6a7a6a', grassTop: '#8a988a', dirt: '#6a6058', stone: '#8a8e94', road: '#4a4c52', line: '#9a9a8a', walk: '#a0a4aa', wall: '#c8c6c0', wall2: '#a8b0ac', roof: '#6a707a', roof2: '#807a7a', trim: '#e8e8e8', glass: '#b8c0c8', leaf: ['#7a8a7a', '#8a9a8a', '#6a7a6a'], trunk: '#6a5c50', floor: '#9a948c', shadow: 'rgba(0,0,0,.2)', outline: '#2a2c30', water: '#8a94a0', lava: '#c0a090', key: '#e8e8e8' }),
  gameCave:   GM({ sky: ['#0e0f14', '#1a1c24', '#262a34'], cloud: '#2a2e38', cloudShade: '#1a1c24', sun: '#ffb04a', grass: '#3a4a3a', grassTop: '#4a5a4a', dirt: '#3a2c24', stone: '#4a4e58', road: '#2a2c34', line: '#a08a4a', walk: '#4a4e58', wall: '#3a3e48', wall2: '#30343e', roof: '#2a2c34', roof2: '#3a2c2c', trim: '#8a8e98', glass: '#ffb04a', leaf: ['#2a4a3a', '#3a5a4a', '#1a3a2a'], trunk: '#3a2a20', floor: '#30343e', shadow: 'rgba(0,0,0,.45)', outline: '#07080c', water: '#2a4aa0', lava: '#ff6a1a', key: '#ffb870', practical: '#ffb04a' }),
  gameRoom:   GM({ sky: ['#9fd6ff', '#cfeaff', '#eef8ff'], cloud: '#ffffff', cloudShade: '#dbe9f5', sun: '#ffe36a', grass: '#47c24a', grassTop: '#6fe063', dirt: '#9a6a3c', stone: '#a8aab0', road: '#4c535e', line: '#ffd23f', walk: '#c9ced6', wall: '#f4ece0', wall2: '#e8d6c0', roof: '#3b6fd4', roof2: '#d9534a', trim: '#ffffff', glass: '#bfe6ff', leaf: ['#3fb34a', '#5fd25a', '#2e8f3c'], trunk: '#8a5a32', floor: '#c49a6c', shadow: 'rgba(40,30,20,.2)', outline: '#2f2a26', water: '#3aa0ff', lava: '#ff5a1f' }),
  gameRoomNight: GM({ sky: ['#0d1440', '#1f2a7a', '#3a3f9a'], cloud: '#6a74b8', cloudShade: '#4a5290', sun: '#fff6c8', grass: '#2a6a4a', grassTop: '#3a8a5a', dirt: '#5a3a2c', stone: '#5a5e78', road: '#262a3a', line: '#c8a83a', walk: '#5a6078', wall: '#4a4c8a', wall2: '#3e4078', roof: '#2a3a8a', roof2: '#7a3a5a', trim: '#9a9ce0', glass: '#2a3a8a', leaf: ['#2a6a4a', '#3a7a5a', '#1f5a3a'], trunk: '#4a3428', floor: '#4a3e6a', shadow: 'rgba(0,0,20,.35)', outline: '#0f1226', water: '#2a3aa0', lava: '#ff5a1f', key: '#9aa8ff' }),
});

const UI = { card: 'rgba(18,28,48,.94)', cardLine: 'rgba(150,180,230,.25)', text: '#9fb6d8', sub: '#6f84a6', accent: '#ff6f61', gold: '#ffd47e', cream: '#fff1dc', blueprint: '#8fb8e8', bpBg: '#0b1324', good: '#5fd39a' };
const GAME_UI = { ...UI, panel: 'rgba(22,28,40,.92)', panelLine: 'rgba(255,255,255,.14)', gold: '#ffd23f', accent: '#ff3b3b', good: '#3ee05a', cyan: '#3fe0ff', purple: '#b46aff', cream: '#ffffff' };
// A STYLE here = a GAME WORLD (character skin, set pieces, UI skin, fonts) + a colour grade.
//   world: 'blocky' (avatar-platform look, the competitor reference) | 'voxel' (cube sandbox / mining world) | 'royale' (cartoon battle-royale)
// Pick the world from the video's topic (see references/worlds.md). Moods are the shared game* moods above.
const GRADE = { contrast: 1.04, sat: 1.08, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.12, grain: 0, bloom: 0.4 };
export const STYLES = {
  blocky: {
    name: 'Blocky Avatars', desc: 'Competitor reference: rounded block avatars with dark outlines and glossy highlights, cube clouds and a cube sun, studded floors, rounded dark game panels.',
    world: 'blocky', ink: '#2a2f3a', inkFar: '#4a5060', feature: '#ffffff', rimWidth: 0, outlineW: 5, ui: GAME_UI,
    fonts: { cap: 'Lilita One', panel: 'Nunito', big: 'Lilita One' },
    grade: { ...GRADE }, moods: {},
  },
  voxel: {
    name: 'Voxel Sandbox', desc: 'Cube mining world: pixel-textured grass/dirt/stone blocks, square heads with pixel faces, flat pixel clouds and a square sun, grey bevelled panels with a pixel font.',
    world: 'voxel', ink: '#1a1a1a', inkFar: '#3a3a3a', feature: '#ffffff', rimWidth: 0, outlineW: 0, ui: { ...GAME_UI, panel: 'rgba(40,40,40,.88)', panelLine: '#8b8b8b', gold: '#ffe14a', accent: '#ff4a4a', good: '#5aff3a' },
    fonts: { cap: 'Lilita One', panel: 'Press Start 2P', big: 'Lilita One' },
    grade: { ...GRADE, sat: 1.12, contrast: 1.06 },
    moods: { gameDay: { sky: ['#6aa8ff', '#86baff', '#b8d8ff'], grass: '#5aa832', grassTop: '#7ccc3e', dirt: '#8a5a36', leaf: ['#3f8f2a', '#4fa632', '#2f7020'], cloud: '#ffffff', cloudShade: '#e8eef6' } },
  },
  royale: {
    name: 'Battle Royale Cartoon', desc: 'Glossy cartoon island: rounded humans with big eyes, vivid saturated colours, purple storm, rarity colours (grey/green/blue/purple/gold), slanted italic HUD panels.',
    world: 'royale', ink: '#1a1630', inkFar: '#3a3460', feature: '#ffffff', rimWidth: 0, outlineW: 4, ui: { ...GAME_UI, panel: 'rgba(20,24,70,.9)', panelLine: 'rgba(120,200,255,.5)', gold: '#ffcc2a', accent: '#ff3a6a', cyan: '#2ad8ff' },
    fonts: { cap: 'Luckiest Guy', panel: 'Nunito', big: 'Luckiest Guy' },
    grade: { ...GRADE, sat: 1.18, contrast: 1.06, gain: [1.02, 1.0, 1.04] },
    moods: { gameDay: { sky: ['#1a7aff', '#4ab0ff', '#9ae0ff'], grass: '#3ac25a', grassTop: '#6ae06a', leaf: ['#2fb04a', '#58d060', '#1f8a3a'] } },
  },
  blockyPop: {
    name: 'Blocky Pop', desc: 'Blocky world, punchier saturation and contrast for kids / meme energy.',
    world: 'blocky', ink: '#22262f', inkFar: '#4a5060', feature: '#ffffff', rimWidth: 0, outlineW: 5, ui: GAME_UI,
    fonts: { cap: 'Lilita One', panel: 'Nunito', big: 'Lilita One' },
    grade: { ...GRADE, sat: 1.3, contrast: 1.1, vignette: 0.08 }, moods: {},
  },
  voxelDusk: {
    name: 'Voxel Dusk', desc: 'Voxel world with a warmer, moodier grade for survival / horror-lite stories.',
    world: 'voxel', ink: '#1a1a1a', inkFar: '#3a3a3a', feature: '#ffffff', rimWidth: 0, outlineW: 0, ui: { ...GAME_UI, panel: 'rgba(40,40,40,.88)', panelLine: '#8b8b8b', gold: '#ffe14a' },
    fonts: { cap: 'Lilita One', panel: 'Press Start 2P', big: 'Lilita One' },
    grade: { ...GRADE, sat: 0.95, contrast: 1.1, lift: [0.02, 0.0, 0.04], gain: [1.08, 0.98, 0.9], vignette: 0.35 },
    moods: { gameDay: { sky: ['#4a5aa0', '#c08a8a', '#f0c08a'] } },
  },
  // the original cinematic styles stay available for non-game segments
  dusk: { name: 'Cinematic Dusk', desc: 'Old Razgon 2D look (kept for compatibility).', world: 'blocky', ink: '#0e0b12', inkFar: '#2b2333', feature: '#f4efe6', rimWidth: 4, outlineW: 5, ui: { ...GAME_UI }, fonts: { cap: 'Lilita One', panel: 'Nunito', big: 'Lilita One' },
    grade: { contrast: 1.0, sat: 1.0, lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], vignette: 0.55, grain: 0.055, bloom: 0.55 }, moods: {} },
};
export const STYLE_IDS = Object.keys(STYLES);
