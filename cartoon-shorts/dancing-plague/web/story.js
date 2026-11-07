// Shot plan for "The Dancing Plague of 1518" — timed to voice.mp3 (73.67 s, 30 fps, 2211 frames).
// Word frames (whisper): Hundreds@0 ... stop@161 | Strasbourg@193 July@222 | walks@297 dance@349 | No music@375 no party@402 just dancing@430 |
// week@476 34@494 joined@526 | month@561 400@585 | shoes@655 blood@682 | collapsed@714 some@742 never got up@768-792 |
// Luckily@799 doctors@839 diagnosis@861 Hot blood@894 | Unluckily@929 cure@957 more dancing@980 | council@1027 opened@1035 guild halls@1052 |
// hired musicians@1074 paid@1108 professional dancers@1114 moving@1167 | worse@1203 | Historians@1228 why@1272 | Moldy rye@1299 Probably not@1326 |
// cramps@1377 choreography@1403 | stress@1467 | Hunger@1495 disease@1516 saint@1540 curse@1582 dancing@1610 | yawn@1663 room@1691 |
// One person starts@1716 everyone nearby@1752 catches@1774 | changed its mind@1828-1843 | Music banned@1867 | Dancing banned@1902 |
// shrine@1975 red shoes@2000 | September@2038 over@2067 | finally worked@2095 opposite@2130 first cure@2152 | Silence@2185
import { M, clamp, lerp, lerp3, ramp, camFromKeys, idle, blinkAt, q } from './motion.js';
export const FPS = 30, TOTAL = 2211, DECK = 0;
export const SHOTS = [
  { id: 'hook', a: 0, b: 188, light: 'day' },
  { id: 'town', a: 189, b: 243, light: 'day' },
  { id: 'troffea', a: 244, b: 372, light: 'day' },
  { id: 'nomusic', a: 373, b: 462, light: 'day' },
  { id: 'week', a: 463, b: 547, light: 'day' },
  { id: 'month', a: 548, b: 618, light: 'day' },
  { id: 'shoes', a: 619, b: 702, light: 'day' },
  { id: 'collapse', a: 703, b: 797, light: 'day' },
  { id: 'doctors', a: 798, b: 925, light: 'day' },
  { id: 'cure', a: 926, b: 1017, light: 'day' },
  { id: 'council', a: 1018, b: 1070, light: 'day' },
  { id: 'stage', a: 1071, b: 1190, light: 'day' },
  { id: 'worse', a: 1191, b: 1222, light: 'day' },
  { id: 'historians', a: 1223, b: 1295, light: 'day' },
  { id: 'rye', a: 1296, b: 1350, light: 'day' },
  { id: 'cramps', a: 1351, b: 1434, light: 'day' },
  { id: 'stress', a: 1435, b: 1534, light: 'day' },
  { id: 'saint', a: 1535, b: 1619, light: 'day' },
  { id: 'yawn', a: 1620, b: 1804, light: 'day' },
  { id: 'ban', a: 1805, b: 1862, light: 'day' },
  { id: 'music', a: 1863, b: 1897, light: 'day' },
  { id: 'nodance', a: 1898, b: 1940, light: 'day' },
  { id: 'shrine', a: 1941, b: 1991, light: 'golden' },
  { id: 'redshoes', a: 1992, b: 2031, light: 'golden' },
  { id: 'sept', a: 2032, b: 2086, light: 'golden' },
  { id: 'opposite', a: 2087, b: 2180, light: 'golden' },
  { id: 'silence', a: 2181, b: 2210, light: 'golden' },
];
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;

// ---------- lights ----------
export const LIGHTS = {
  day: { az: 128, el: 46, sky: '#c4d6f2', ground: '#8a8262', hemi: 1.15, sun: '#fff1dc', sunI: 2.5, fog: '#cadcf0', fogNear: 90, fogFar: 1100,
    skyTop: '#3f80d4', skyHor: '#c3daf2', sat: 1.1, waterDeep: '#2c6c8c', waterShal: '#5aaec4', glint: '#effaff', vig: 0.2, shadowExt: 18 },
  golden: { az: 250, el: 10, sky: '#9a90c8', ground: '#6a4c40', hemi: 1.05, sun: '#ffb46c', sunI: 2.9, fog: '#f0b88c', fogNear: 70, fogFar: 900,
    skyTop: '#6f6eb0', skyHor: '#ffc27e', sunDisc: '#fff0c8', sunSize: 0.0035, sat: 1.12, gain: '#fff2e2', waterDeep: '#3d5a86', waterShal: '#d99a6e',
    glint: '#ffe2a8', vig: 0.26, shadowExt: 18 },
};
export const lightFor = (S, f) => {
  const L = { ...LIGHTS[S.light] };
  if (['hook', 'month', 'worse', 'sept'].includes(S.id)) L.shadowExt = 40;
  if (S.id === 'town') L.shadowExt = 90;
  if (S.id === 'shrine' || S.id === 'redshoes') { L.az = 182; L.shadowExt = 24; }
  if (['sept', 'opposite', 'silence'].includes(S.id)) { L.az = 112; L.el = 16; L.hemi = 1.55; L.shadowExt = S.id === 'sept' ? 40 : 18; }
  return L;
};

// ---------- places ----------
const TROF = [-3, 0, -11];          // where Frau Troffea dances
const DOOR = [-3.0, 0, -15.5];      // her front door (north row)
const STAGE_Y = 1.0;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const HEAD = (p, s = 1) => [p[0], p[1] + 1.72 * s, p[2]];

// ---------- cameras ----------
const CAMS = {
  hook: [
    { f: 0, pos: [-1.6, 1.8, -6.6], look: [-3, 1.72, -11], fov: 32 },
    { f: 34, pos: [-1.7, 1.85, -6.4], look: [-3, 1.72, -11], fov: 32 },
    { f: 140, pos: [9, 15, 18], look: [-3, 4, -14], fov: 50, path: [[0, 4.5, -1]] },
    { f: 188, pos: [9.6, 16, 19.5], look: [-3, 4.4, -14], fov: 49 },
  ],
  town: [
    { f: 189, pos: [78, 34, 62], look: [-2, 30, -52], fov: 44 },
    { f: 243, pos: [72, 31, 56], look: [-2, 31, -52], fov: 42 },
  ],
  troffea: [
    { f: 244, pos: [0.6, 1.9, -4.4], look: [-3, 1.6, -13.2], fov: 42 },
    { f: 372, pos: [0.1, 1.85, -5.4], look: [-3, 1.55, -12.6], fov: 38 },
  ],
  nomusic: [
    { f: 373, pos: [-7.4, 1.65, -5.2], look: [-2.6, 1.45, -11.6], fov: 40 },
    { f: 462, pos: [-6.8, 1.65, -5.9], look: [-2.6, 1.45, -11.6], fov: 37 },
  ],
  week: [
    { f: 463, pos: [-0.6, 2.6, -1.8], look: [-3, 1.1, -10.2], fov: 50 },
    { f: 547, pos: [-0.9, 2.5, -2.6], look: [-3, 1.1, -10.2], fov: 48 },
  ],
  month: [
    { f: 548, pos: [16, 26, 22], look: [-2, 0, -5], fov: 46 },
    { f: 618, pos: [13, 21.5, 17.5], look: [-2, 0, -5], fov: 46 },
  ],
  shoes: [
    { f: 619, pos: [-2.2, 0.4, -4.4], look: [-2.2, 0.45, -9.2], fov: 52 },
    { f: 702, pos: [-2.2, 0.38, -5.0], look: [-2.2, 0.42, -9.2], fov: 50 },
  ],
  collapse: [
    { f: 703, pos: [-1.6, 2.2, -3.0], look: [-1.8, 0.8, -9.8], fov: 50 },
    { f: 797, pos: [-1.6, 2.0, -3.9], look: [-1.8, 0.7, -9.8], fov: 48 },
  ],
  doctors: [
    { f: 798, pos: [2.0, 1.8, -1.2], look: [1.9, 1.5, -7.6], fov: 50 },
    { f: 880, pos: [2.0, 1.8, -1.9], look: [1.9, 1.55, -7.6], fov: 48 },
    { f: 900, pos: [2.1, 1.9, -4.2], look: [1.9, 1.85, -8.3], fov: 40 },
    { f: 925, pos: [2.1, 1.9, -4.5], look: [1.9, 1.85, -8.3], fov: 39 },
  ],
  cure: [
    { f: 926, pos: [4.6, 1.8, -3.6], look: [3.5, 1.65, -7.3], fov: 36 },
    { f: 975, pos: [4.5, 1.78, -3.9], look: [3.5, 1.65, -7.3], fov: 35 },
    { f: 990, pos: [6.6, 2.0, -1.4], look: [1.5, 1.3, -8.4], fov: 44, ease: 'easeOut' },
    { f: 1017, pos: [6.4, 2.0, -1.8], look: [1.5, 1.3, -8.4], fov: 43 },
  ],
  council: [
    { f: 1018, pos: [-12.4, 1.95, 0.3], look: [-18.4, 1.55, 0], fov: 46 },
    { f: 1070, pos: [-13.0, 1.9, 0.2], look: [-18.4, 1.6, 0], fov: 44 },
  ],
  stage: [
    { f: 1071, pos: [11.4, 2.6, -1.6], look: [10.4, 2.1, -10], fov: 44 },
    { f: 1100, pos: [11.2, 2.6, -2.2], look: [10.4, 2.1, -10], fov: 43 },
    { f: 1125, pos: [13.0, 2.4, -4.6], look: [12.4, 2.2, -10.2], fov: 38 },
    { f: 1150, pos: [12.6, 2.6, -3.6], look: [11.4, 2.0, -10.0], fov: 46 },
    { f: 1190, pos: [12.8, 3.0, -1.2], look: [10.6, 1.8, -10.0], fov: 50 },
  ],
  worse: [
    { f: 1191, pos: [-15, 15, 14], look: [1, 0, -6], fov: 52 },
    { f: 1222, pos: [-12.5, 12.5, 11], look: [1, 0, -6], fov: 50, ease: 'easeOut' },
  ],
  historians: [
    { f: 1223, pos: [0.2, 1.75, 6.2], look: [0.2, 1.5, 11.6], fov: 46 },
    { f: 1295, pos: [0.2, 1.72, 6.8], look: [0.2, 1.5, 11.6], fov: 44 },
  ],
  rye: [
    { f: 1296, pos: [-0.2, 1.55, 8.4], look: [-0.4, 1.45, 11.4], fov: 40 },
    { f: 1350, pos: [-0.25, 1.52, 8.8], look: [-0.4, 1.47, 11.4], fov: 38 },
  ],
  cramps: [
    { f: 1351, pos: [7.2, 1.7, 9.6], look: [7.2, 1.25, 4], fov: 48 },
    { f: 1434, pos: [7.2, 1.66, 9.0], look: [7.2, 1.25, 4], fov: 46 },
  ],
  stress: [
    { f: 1435, pos: [0.9, 1.85, 9.0], look: [0.9, 1.6, 3.0], fov: 48 },
    { f: 1534, pos: [0.9, 1.82, 8.2], look: [0.9, 1.65, 3.0], fov: 46 },
  ],
  saint: [
    { f: 1535, pos: [-2.6, 1.3, 4.4], look: [-6, 3.0, -2], fov: 42 },
    { f: 1580, pos: [-3.0, 1.25, 3.6], look: [-6, 3.1, -2], fov: 40 },
    { f: 1590, pos: [-4.0, 1.6, 1.4], look: [-6, 3.75, -2], fov: 36, ease: 'easeOut' },
    { f: 1619, pos: [-4.1, 1.6, 1.2], look: [-6, 3.75, -2], fov: 35 },
  ],
  yawn: [
    { f: 1620, pos: [2, 1.45, 8.4], look: [2, 1.05, 14.6], fov: 46 },
    { f: 1745, pos: [2, 1.42, 9.0], look: [2, 1.05, 14.6], fov: 44 },
    { f: 1804, pos: [2, 1.4, 9.3], look: [2, 1.05, 14.6], fov: 43 },
  ],
  ban: [
    { f: 1805, pos: [-12.8, 1.9, -0.2], look: [-18.4, 1.6, 0], fov: 44 },
    { f: 1862, pos: [-13.8, 1.85, -0.1], look: [-18.4, 1.65, 0], fov: 40 },
  ],
  music: [
    { f: 1863, pos: [9.45, 2.4, -5.4], look: [9.45, 2.0, -10.5], fov: 46 },
    { f: 1897, pos: [9.45, 2.4, -5.9], look: [9.45, 2.0, -10.5], fov: 44 },
  ],
  nodance: [
    { f: 1898, pos: [2.8, 1.7, 0.8], look: [-1.4, 1.35, -6.6], fov: 42 },
    { f: 1940, pos: [2.4, 1.7, 0.1], look: [-1.4, 1.35, -6.6], fov: 40 },
  ],
  shrine: [
    { f: 1941, pos: [-294, 2.4, 4.8], look: [-336, 3.4, 0], fov: 40 },
    { f: 1991, pos: [-299, 2.3, 4.0], look: [-336, 3.4, 0], fov: 39 },
  ],
  redshoes: [
    { f: 1992, pos: [-310.5, 0.34, 2.3], look: [-314.5, 0.34, 0.2], fov: 40 },
    { f: 2031, pos: [-312, 0.34, 2.1], look: [-316, 0.34, 0.2], fov: 40 },
  ],
  sept: [
    { f: 2032, pos: [9, 2.4, 7], look: [-2, 2.8, -12], fov: 48 },
    { f: 2086, pos: [7, 2.3, 5.5], look: [-3, 2.6, -12], fov: 46 },
  ],
  opposite: [
    { f: 2087, pos: [-1.8, 1.8, -7.4], look: [-2.5, 1.55, -14.4], fov: 46 },
    { f: 2180, pos: [-2.0, 1.78, -8.4], look: [-2.6, 1.57, -14.4], fov: 42 },
  ],
  silence: [
    { f: 2181, pos: [-2.75, 1.78, -12.3], look: [-3.0, 1.74, -14.6], fov: 32 },
    { f: 2210, pos: [-2.8, 1.77, -12.7], look: [-3.0, 1.74, -14.6], fov: 30 },
  ],
};
const KICKS = [{ f: 585, a: 0.03 }, { f: 716, a: 0.04 }, { f: 744, a: 0.03 }, { f: 896, a: 0.03 }, { f: 1080, a: 0.02 }, { f: 1203, a: 0.05 },
  { f: 1336, a: 0.03 }, { f: 1377, a: 0.03 }, { f: 1582, a: 0.04 }, { f: 1843, a: 0.04 }, { f: 1875, a: 0.04 }, { f: 1911, a: 0.04 }];
export const camAt = (f) => {
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.flash = f >= 189 && f < 195 ? (1 - (f - 189) / 6) * 0.8 : f >= 1582 && f < 1586 ? 0.3 * (1 - (f - 1582) / 4) : 0;
  if (S.id === 'town') c.shadowAt = [-2, 0, -20];
  if (S.id === 'month' || S.id === 'worse' || S.id === 'hook') c.shadowAt = [-2, 0, -6];
  if (S.id === 'sept') c.shadowAt = [-2, 0, -8];
  return c;
};

// ---------- lens ----------
export const dofAt = (f) => {
  const S = shotAt(f), C = camAt(f);
  switch (S.id) {
    case 'hook': return { focus: dist(C.pos, HEAD(TROF)), cinf: lerp(13, 0, smooth(ramp(f, 36, 80))) };
    case 'troffea': return { focus: dist(C.pos, HEAD(f < 330 ? [-3, 0, lerp(-15.3, -11, ramp(f, 297, 330))] : TROF)), cinf: 7 };
    case 'nomusic': return { focus: dist(C.pos, HEAD(TROF)), cinf: 10 };
    case 'week': return { focus: dist(C.pos, HEAD(TROF)), cinf: 5 };
    case 'shoes': return { focus: dist(C.pos, [-2.4, 0.3, -8.6]), cinf: 13 };
    case 'collapse': return { focus: dist(C.pos, [-1.5, 1.0, -8.6]), cinf: 8 };
    case 'doctors': return { focus: dist(C.pos, HEAD([1.9, 0, -8.3])), cinf: f > 890 ? 12 : 9 };
    case 'cure': return f < 985 ? { focus: dist(C.pos, HEAD([3.6, 0, -7.2])), cinf: 13 } : { focus: dist(C.pos, HEAD([3.6, 0, -7.2])), cinf: 6 };
    case 'council': case 'ban': return { focus: dist(C.pos, HEAD([-18.2, 0, 0])), cinf: 11 };
    case 'stage': return { focus: dist(C.pos, HEAD([10.5, STAGE_Y, -10.4])), cinf: 7 };
    case 'historians': return { focus: dist(C.pos, HEAD([0.2, 0, 11.6])), cinf: 10 };
    case 'rye': return { focus: dist(C.pos, [-0.6, 1.4, 11.3]), cinf: 12 };
    case 'cramps': return { focus: dist(C.pos, HEAD([7.2, 0, 4.1])), cinf: 10 };
    case 'stress': return { focus: dist(C.pos, HEAD([0.9, 0, 3.1])), cinf: 11 };
    case 'saint': return { focus: dist(C.pos, [-6, 3.8, -2]), cinf: 10, near: 1 };
    case 'yawn': return { focus: dist(C.pos, [2, 1.3, 14.75]), cinf: 10 };
    case 'music': return { focus: dist(C.pos, HEAD([9.4, STAGE_Y, -10.4])), cinf: 11 };
    case 'nodance': return { focus: dist(C.pos, HEAD([-1, 0, -4.2])), cinf: 9 };
    case 'shrine': return { focus: dist(C.pos, [-306, 1.4, 0]), cinf: 5 };
    case 'redshoes': return { focus: dist(C.pos, [-314.5, 0.3, 0]), cinf: 13 };
    case 'opposite': return { focus: dist(C.pos, HEAD([-3, 0, -14.6])), cinf: 10 };
    case 'silence': return { focus: dist(C.pos, HEAD([-3, 0, -14.6])), cinf: 15 };
  }
  return { focus: 10, cinf: 0 };
};

// ---------- world state ----------
export const worldAt = (f) => {
  const S = shotAt(f);
  return {
    stage: f >= 1071,                      // the council builds the dance stage
    council: ['council', 'ban'].includes(S.id),
    pews: S.id === 'yawn',
    pedestal: S.id === 'saint' || S.id === 'stress',
  };
};

// ---------- actors (2D cards) ----------
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const rnd = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const CROWD_WHO = ['wifeA', 'manA', 'wifeB', 'manB', 'wifeC', 'manC', 'manD'];
/** dance pose for a card: two steps per second, arms cycle through four figures; tired > 0 slows and slumps it */
const dance = (f, seed, tired = 0) => {
  const sp = 1 - 0.45 * tired, t = f * sp / 15 + seed * 0.37, ph = t % 1, k = Math.floor(t) % 4;
  const A = [['up', 'up'], ['wave', 'hip'], ['hip', 'wave'], ['kick', 'up']][(k + seed) % 4];
  return {
    L: A[0], R: A[1], wv: q(ph * 6.28, 1), step: q(Math.round(ph * 8) / 8 || 0.001, 3),
    tilt: q(9 * Math.sin((f * sp / 30 + seed) * Math.PI * 2) * (1 - tired * 0.5), 0), bob: q(0.025 * Math.abs(Math.sin(t * Math.PI)), 3),
    headTilt: q(7 * Math.sin((f * sp / 22 + seed * 2.1) * Math.PI), 0),
  };
};
const hop = (f, seed) => 0.07 * Math.sin((f / 15 + seed * 0.37) * Math.PI * 2);
/** a crowd of dancers in the square; n cards, deterministic layout around (cx, cz) */
const crowd = (T, out, f, n, { cx = -2, cz = -5, rx_ = 9, rz = 7, tired = 0, skip = [], expr = null, shoes = null, tint = '#ffffff', y = 0, from = 0, clear = 3.2, keep = [] } = {}) => {
  const C = camAt(f);
  for (let i = from; i < n; i++) {
    if (skip.includes(i)) continue;
    const a = rnd(i, 1) * Math.PI * 2, r = Math.sqrt(rnd(i, 2));
    const x = cx + Math.cos(a) * r * rx_, z = cz + Math.sin(a) * r * rz;
    if (Math.hypot(x - C.pos[0], z - C.pos[2]) < clear) continue;            // never right in front of the lens
    if (keep.some(([kx, kz]) => Math.hypot(x - kx, z - kz) < 1.1)) continue;  // keep heroes clear
    const who = CROWD_WHO[i % CROWD_WHO.length], d = dance(f, i + 3, tired);
    const e = expr || ['grin', 'trance', 'laugh', 'dazed', 'trance'][i % 5];
    out.push(R(T, who, { seed: 5 + (i % 9), expr: e, blink: blinkAt(f, i + 5), facing: i % 3 - 1, ...d, ...(shoes ? { shoes } : {}) }, [x + hop(f, i), y, z], { tint }));
  }
};
const troffea = (T, out, f, o = {}, pos = TROF, extra = {}) => out.push(R(T, 'troffea', { seed: 4, blink: blinkAt(f, 4), ...o }, pos, extra));
const idleO = (f, s) => { const i = idle(f, s); return { bob: q(i.bob, 3), tilt: q(i.tilt, 0), headTilt: q(i.headTilt, 0) }; };

export const actorsAt = (f, T) => {
  const S = shotAt(f), out = [];
  const tint = S.light === 'golden' ? '#ffe6cc' : '#ffffff';
  switch (S.id) {
    case 'hook': {
      troffea(T, out, f, { expr: 'trance', ...dance(f, 1) }, [TROF[0] + hop(f, 1), 0, TROF[2]]);
      crowd(T, out, f, 46, { cx: -2, cz: -5.5, rx_: 11, rz: 8, keep: [[TROF[0], TROF[2]], [-2.3, -8.8]], clear: f < 60 ? 6 : 3.2 });
      break;
    }
    case 'troffea': {
      const t = ramp(f, 297, 330), z = lerp(DOOR[2] + 0.2, TROF[2], t), walking = f >= 297 && f < 330;
      const wk = walking ? { step: q(((f - 297) / 9) % 1, 2) } : {};
      if (f < 349) troffea(T, out, f, { expr: f < 334 ? 'neutral' : 'dazed', look: 0.2, ...wk, ...(walking ? {} : idleO(f, 4)) }, [-3, 0, z]);
      else troffea(T, out, f, { expr: 'trance', ...dance(f, 1) }, [TROF[0] + hop(f, 1), 0, TROF[2]]);
      // a neighbour carrying on with her day
      out.push(R(T, 'manA', { seed: 9, step: q(((f) / 9) % 1, 2), look: f > 352 ? -0.6 : 0, expr: f > 352 ? 'shock' : 'neutral', blink: blinkAt(f, 9) }, [lerp(3, -6.5, ramp(f, 244, 372)), 0, -13.4]));
      break;
    }
    case 'nomusic': {
      troffea(T, out, f, { expr: 'trance', ...dance(f, 1) }, [TROF[0] + hop(f, 1), 0, TROF[2]]);
      const shrug = f >= 404 && f < 432;
      out.push(R(T, 'manB', { seed: 6, L: shrug ? 'up' : 'hip', R: shrug ? 'up' : 'hip', expr: f > 400 ? 'squint' : 'neutral', look: 0.6, facing: 1, blink: blinkAt(f, 6), ...idleO(f, 6) }, [-5.7, 0, -11.6]));
      out.push(R(T, 'wifeB', { seed: 7, L: 'cheek', R: 'cheek', expr: f > 378 ? 'nervous' : 'neutral', look: -0.6, facing: -1, blink: blinkAt(f, 7), ...idleO(f, 7) }, [-1.2, 0, -12.4]));
      break;
    }
    case 'week': {
      troffea(T, out, f, { expr: 'trance', ...dance(f, 1) }, [TROF[0] + hop(f, 1), 0, TROF[2]]);
      // joiners arrive one by one until "joined her"
      for (let i = 3; i < 17; i++) {
        const tj = 466 + (i - 3) * 4.2, k = M.smooth(ramp(f, tj, tj + 14));
        if (f < tj) continue;
        const a = rnd(i, 1) * Math.PI * 2, r = 0.35 + 0.65 * Math.sqrt(rnd(i, 2)), x = -3 + Math.cos(a) * r * 5.5, z = -10 + Math.sin(a) * r * 3.4;
        const sx = x + (x > -3 ? 4 : -4) * (1 - k);
        const o = k < 1 ? { step: q(((f - tj) / 7) % 1, 2), expr: 'dazed' } : { ...dance(f, i + 3), expr: ['grin', 'trance', 'laugh'][i % 3] };
        out.push(R(T, CROWD_WHO[i % 7], { seed: 5 + (i % 9), blink: blinkAt(f, i), facing: i % 3 - 1, ...o }, [sx + hop(f, i) * k, 0, z]));
      }
      break;
    }
    case 'month': crowd(T, out, f, 90, { cx: -2, cz: -4, rx_: 15, rz: 11 }); break;
    case 'worse': crowd(T, out, f, 110, { cx: -1, cz: -3, rx_: 17, rz: 12.5, tired: 0.2 }); break;
    case 'shoes': {
      const red = ramp(f, 640, 684), col = T.mix('#5a3b2a', '#9e1b22', red);
      [[-2.9, -8.6], [-2.1, -9.1], [-1.4, -8.5], [-3.3, -9.8], [-1.0, -9.9]].forEach(([x, z], i) =>
        out.push(R(T, CROWD_WHO[(i + 2) % 7], { seed: 5 + i, ...dance(f, i + 2, red * 0.4), shoes: col }, [x + hop(f, i), 0, z])));
      break;
    }
    case 'collapse': {
      const falls = [{ i: 0, t: 712, s: 1 }, { i: 1, t: 740, s: -1 }, { i: 2, t: 764, s: 1 }];
      const pos = [[-3.2, -8.4], [-0.6, -9.6], [-2.0, -10.6], [-4.6, -10.0], [0.8, -11.2], [-5.6, -11.8], [1.8, -9.0]];
      pos.forEach(([x, z], i) => {
        const fl = falls.find((q_) => q_.i === i), who = CROWD_WHO[(i + 3) % 7];
        if (fl && f >= fl.t) {
          const k = M.easeIn(ramp(f, fl.t, fl.t + 9)), bounce = f > fl.t + 9 && f < fl.t + 14 ? Math.sin((f - fl.t - 9) / 5 * Math.PI) * 0.04 : 0;
          out.push(R(T, who, { seed: 5 + i, expr: i === 2 ? 'snore' : 'dazed', blink: i === 2 ? 1 : 0, L: 'up', R: 'up' }, [x, 0.05 + bounce, z], { roll: q(-fl.s * k * Math.PI / 2, 2), blob: false, shadow: false }));
        } else out.push(R(T, who, { seed: 5 + i, expr: f > 712 ? 'tired' : 'trance', blink: blinkAt(f, i), ...dance(f, i + 3, 0.7), shoes: '#7e1a20' }, [x + hop(f, i), 0, z]));
      });
      break;
    }
    case 'doctors': {
      troffea(T, out, f, { expr: f > 894 ? 'pained' : 'trance', ...dance(f, 1, 0.3) }, [1.9 + hop(f, 1), 0, -8.3]);
      const nod = f > 861 && f < 880 ? q(6 * Math.sin((f - 861) / 19 * Math.PI * 2), 0) : 0;
      out.push(R(T, 'doctor', { seed: 8, expr: f > 896 ? 'stern' : 'neutral', L: 'cross', R: f > 855 ? 'point' : 'hang', look: -0.6, facing: -1, blink: blinkAt(f, 8), headTilt: nod }, [3.0, 0, -7.2]));
      out.push(R(T, 'doctor2', { seed: 12, expr: f > 896 ? 'shock' : 'squint', L: 'hang', R: 'lift', look: 0.6, facing: 1, blink: blinkAt(f, 12), ...idleO(f, 12) }, [0.8, 0, -7.1]));
      break;
    }
    case 'cure': {
      const jig = f >= 980;
      out.push(R(T, 'doctor', { seed: 8, expr: jig ? 'grin' : 'smile', ...(jig ? dance(f, 2) : { L: 'cross', R: f > 955 ? 'point' : 'hang', ...idleO(f, 8) }), look: -0.3, facing: -1, blink: blinkAt(f, 8) }, [3.6 + (jig ? hop(f, 2) : 0), 0, -7.2]));
      troffea(T, out, f, { expr: 'trance', ...dance(f, 1, 0.3) }, [1.4 + hop(f, 1), 0, -9.0]);
      if (f >= 985) crowd(T, out, f, 14, { cx: 0, cz: -11, rx_: 5, rz: 2.5, from: 3 });
      break;
    }
    case 'council': case 'ban': {
      const ban = S.id === 'ban', slam = ban && f >= 1840;
      out.push(R(T, 'council', { seed: 10, expr: ban ? (slam ? 'stern' : 'squint') : (f > 1035 ? 'smile' : 'neutral'), L: 'hang', R: ban ? (slam ? 'palm' : 'hang') : (f > 1033 ? 'up' : 'hang'), look: 0.3, blink: blinkAt(f, 10), ...idleO(f, 10) }, [-18.4, 0, -0.6]));
      out.push(R(T, 'council2', { seed: 14, expr: ban ? (f > 1845 ? 'stern' : 'nervous') : 'smile', L: 'cross', R: 'hang', look: -0.3, blink: blinkAt(f, 14), ...idleO(f, 14) }, [-18.5, 0, 0.65]));
      break;
    }
    case 'stage': {
      const Y = STAGE_Y, play = f >= 1078;
      const beat = play ? q(Math.abs(Math.sin(f / 7.5 * Math.PI)) * 0.02, 3) : 0;
      out.push(R(T, 'musician', { seed: 15, expr: play ? 'grin' : 'neutral', L: 'hold', R: play ? (f % 10 < 5 ? 'up' : 'hold') : 'hold', bob: beat, blink: blinkAt(f, 15) }, [8.4, Y, -10.6], { ground: Y }));
      out.push(R(T, 'musician2', { seed: 16, expr: play ? 'whistle' : 'neutral', L: 'kick', R: 'kick', bob: beat, blink: blinkAt(f, 16), headTilt: play ? q(4 * Math.sin(f / 9), 0) : 0 }, [9.7, Y, -10.7], { ground: Y }));
      if (f >= 1114) { out.push(R(T, 'pro', { seed: 17, expr: 'laugh', ...dance(f, 7) }, [11.6 + hop(f, 7), Y, -10.0], { ground: Y })); out.push(R(T, 'pro', { seed: 18, expr: 'grin', ...dance(f, 9) }, [13.0 + hop(f, 9), Y, -10.3], { ground: Y })); }
      crowd(T, out, f, 22, { cx: 6, cz: -6, rx_: 7, rz: 2.2, from: 4 });
      break;
    }
    case 'historians': case 'rye': {
      const turn = Math.floor((f - 1223) / 22) % 2;
      const aTalk = S.id === 'rye' ? true : turn === 0;
      const shake = S.id === 'rye' && f >= 1326 && f < 1346 ? q(9 * Math.sin((f - 1326) / 20 * Math.PI * 4), 0) : 0;
      out.push(R(T, 'scholar', { seed: 19, expr: S.id === 'rye' ? (f > 1326 ? 'squint' : 'grin') : aTalk ? 'stern' : 'squint', L: S.id === 'rye' ? 'lift' : 'hang', R: aTalk && S.id !== 'rye' ? 'point' : 'hang', facing: 1, look: 0.6, blink: blinkAt(f, 19), ...idleO(f, 19) }, [-0.55, 0, 11.5]));
      out.push(R(T, 'scholar2', { seed: 20, expr: shake ? 'stern' : aTalk ? 'squint' : 'stern', L: !aTalk ? 'point' : 'cross', R: 'hang', facing: -1, look: -0.6, blink: blinkAt(f, 20), headTilt: shake, ...(shake ? {} : { bob: q(idle(f, 20).bob, 3) }) }, [0.95, 0, 11.7]));
      break;
    }
    case 'cramps': {
      const cramp = f >= 1374, dz = f >= 1400;
      const jit = cramp ? (f % 2 ? 0.012 : -0.012) : 0;
      out.push(R(T, 'manB', { seed: 6, expr: cramp ? 'pained' : 'neutral', L: cramp ? 'belly' : 'hang', R: cramp ? 'belly' : 'hang', tilt: cramp ? 8 : 0, blink: blinkAt(f, 6), facing: 1 }, [6.45 + jit, 0, 4.1]));
      out.push(R(T, 'wifeC', dz ? { seed: 7, expr: 'grin', ...dance(f, 5) } : { seed: 7, expr: 'neutral', look: -0.5, blink: blinkAt(f, 7), ...idleO(f, 7) }, [7.95 + (dz ? hop(f, 5) : 0), 0, 4.0]));
      break;
    }
    case 'stress': {
      const ppl = [['wifeA', -0.35, 3.0], ['manC', 0.9, 3.35], ['wifeB', 2.15, 3.0]];
      ppl.forEach(([who, x, z], i) => {
        const cough = i === 1 && f >= 1514 && f < 1534;
        out.push(R(T, who, { seed: 21 + i, expr: f > 1467 ? (cough ? 'pained' : i === 2 && f > 1520 ? 'shock' : 'nervous') : 'neutral', L: cough ? 'mouth' : i === 0 && f > 1492 ? 'belly' : 'hang', R: 'hang', look: i === 2 && f > 1524 ? -0.7 : (i - 1) * -0.4, blink: blinkAt(f, 21 + i), ...idleO(f, 21 + i) }, [x + (cough ? (f % 3 - 1) * 0.01 : 0), 0, z]));
      });
      break;
    }
    case 'saint': {
      const curse = f >= 1580;
      out.push(R(T, 'saint', { seed: 22, expr: curse ? 'stern' : 'neutral', L: 'cross', R: curse ? 'point' : 'hang', look: 0.4, facing: 1 }, [-6, 2.0, -2], { s: 1.3, ground: 2.0, blob: false, order: 3 }));
      [['manA', -3.6, 1.6], ['wifeA', -4.9, 1.1]].forEach(([who, x, z], i) =>
        out.push(R(T, who, { seed: 23 + i, expr: curse ? 'shock' : 'nervous', L: curse ? 'cheek' : 'hang', R: curse ? 'cheek' : 'hang', look: -0.6, facing: -1, blink: curse ? 0 : blinkAt(f, 23 + i), ...idleO(f, 23 + i) }, [x, 0, z])));
      break;
    }
    case 'yawn': {
      const xs = [0.7, 1.35, 2.0, 2.65, 3.3], who = ['wifeA', 'manC', 'troffea', 'manA', 'wifeC'];
      const start = [1774, 1752, 1716, 1754, 1777];
      xs.forEach((x, i) => {
        const y0 = start[i], yawning = f >= y0 && f < y0 + 26;
        const o = yawning ? { expr: 'yawn', L: i % 2 ? 'mouth' : 'hang', R: i % 2 ? 'hang' : 'up', headTilt: q(-8 * Math.sin(ramp(f, y0, y0 + 26) * Math.PI), 0) } : { expr: f > y0 ? 'tired' : 'neutral', blink: blinkAt(f, 30 + i), ...idleO(f, 30 + i) };
        out.push(R(T, who[i], { seed: 30 + i, facing: i < 2 ? 1 : i > 2 ? -1 : 0, look: f > 1720 && f < y0 ? (i < 2 ? 0.6 : -0.6) : 0, ...o }, [x, -0.3, 14.75], { blob: false, ground: -0.3 }));
      });
      break;
    }
    case 'music': {
      const Y = STAGE_Y, snapped = f >= 1873;
      out.push(R(T, 'musician', { seed: 15, expr: snapped ? 'shock' : 'grin', L: 'hold', R: snapped ? 'hang' : (f % 10 < 5 ? 'up' : 'hold'), blink: snapped ? 0 : blinkAt(f, 15) }, [8.6, Y, -10.5], { ground: Y }));
      out.push(R(T, 'guard', { seed: 24, expr: 'stern', L: f >= 1866 ? 'lift' : 'hang', R: f >= 1866 ? 'lift' : 'hang', look: -0.5, facing: -1, blink: blinkAt(f, 24) }, [10.3, Y, -10.3], { ground: Y }));
      break;
    }
    case 'nodance': {
      const stop = f >= 1909;
      out.push(R(T, 'guard', { seed: 24, expr: 'stern', L: 'hang', R: f >= 1900 ? 'palm' : 'hang', look: -0.4, facing: -1, blink: blinkAt(f, 24), ...idleO(f, 24) }, [0.2, 0, -4.4]));
      const froze = 1909;
      [[-1.8, -7.2], [-3.4, -8.0], [-0.4, -8.6], [-2.4, -9.6], [0.9, -7.4]].forEach(([x, z], i) => {
        const d = dance(stop ? froze : f, i + 3);
        out.push(R(T, CROWD_WHO[i % 7], { seed: 5 + i, ...d, expr: stop ? 'shock' : 'trance', blink: stop ? 0 : blinkAt(f, i) }, [x + (stop ? hop(froze, i) : hop(f, i)), 0, z]));
      });
      break;
    }
    case 'shrine': {
      for (let i = 0; i < 9; i++) {
        const x = -304 - (i % 3) * 1.4 - Math.floor(i / 3) * 1.6 - (f - 1941) * 0.028, z = ((i % 3) - 1) * 1.1 + rnd(i, 4) * 0.3;
        out.push(R(T, i === 4 ? 'troffea' : CROWD_WHO[i % 7], { seed: 5 + i, step: q(((f + i * 3) / 10) % 1, 2), expr: 'tired', shoes: '#c4282c', tilt: q(2 * Math.sin(f / 9 + i), 0) }, [x, 0, z], { tint }));
      }
      out.push(R(T, 'guard', { seed: 24, step: q((f / 10) % 1, 2), expr: 'neutral' }, [-302.2 - (f - 1941) * 0.028, 0, 2.0], { tint }));
      break;
    }
    case 'redshoes': {
      for (let i = 0; i < 4; i++) out.push(R(T, CROWD_WHO[i % 7], { seed: 5 + i, step: q(((f + i * 4) / 10) % 1, 2), shoes: '#c4282c' }, [-314.4 - i * 0.9 - (f - 1992) * 0.03, 0, (i % 2 ? -0.45 : 0.5)], { tint }));
      break;
    }
    case 'opposite': {
      const stopIt = f >= 2150;
      troffea(T, out, f, { expr: f > 2130 ? (stopIt ? 'stern' : 'squint') : 'calm', L: stopIt ? 'palm' : 'cross', R: stopIt ? 'hang' : 'cross', look: f > 2128 ? 0.6 : 0, facing: f > 2128 ? 1 : 0, ...idleO(f, 4) }, [-3, 0, -14.6], { tint });
      const mx = lerp(0.6, -1.7, M.smooth(ramp(f, 2112, 2150))), stopped = f >= 2156;
      if (f >= 2108) out.push(R(T, 'musician2', { seed: 16, expr: stopped ? 'nervous' : 'whistle', L: 'kick', R: 'kick', step: f < 2150 ? q(((f) / 9) % 1, 2) : 0, look: -0.6, facing: -1, blink: blinkAt(f, 16) }, [mx + (stopped ? (f - 2156) * 0.03 : 0), 0, -13.9], { tint }));
      break;
    }
    case 'silence':
      troffea(T, out, f, { expr: 'calm', L: 'shh', R: 'hang', ...idleO(f, 4) }, [-3, 0, -14.6], { tint });
      break;
  }
  return out;
};

// ---------- 2D effects ----------
// FX pos = centre of the design
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const pop = (f, f0, d = 8) => M.back(ramp(f, f0, f0 + d));
export const fxAt = (f, T) => {
  const S = shotAt(f), out = [];
  if (S.id === 'doctors') {
    if (f >= 858) out.push(FX('flask', (p) => T.fxFlask(p), [0.55, 1.55 + 0.02 * Math.sin(f / 8), -6.95], 0.32 * pop(f, 858)));
    if (f >= 892) {
      const t = q(((f - 892) / 14) % 1, 2);
      out.push(FX('flame' + t, (p) => T.fxFlame(p, t * 6), [1.9 + hop(f, 1), 2.25, -8.25], 0.55 * pop(f, 892)));
      out.push(FX('puffd' + t, (p) => { p.g.translate(120, 300); p.g.scale(1.2, 1.2); T.fxPuff(p, t); }, [2.2, 2.4 + t * 0.4, -8.2], 0.7));
    }
  }
  if (S.id === 'stage' && f >= 1076) {
    out.push(FX('drum', (p) => { p.g.translate(40, 240); p.g.scale(2, 2); T.fxDrum(p); }, [8.55, STAGE_Y + 0.75, -10.35], 0.5));
    out.push(FX('fife', (p) => T.fxFife(p), [9.85, STAGE_Y + 1.42, -10.55], 0.26));
    for (let i = 0; i < 4; i++) { const t = ((f - 1078) / 40 + i / 4) % 1; out.push(FX('note' + (i % 2), (p) => { p.g.translate(200, 300); p.g.scale(1.4, 1.4); T.fxNote(p, i % 2, '#1f2a44'); }, [8.6 + i * 0.5 + Math.sin(t * 6 + i) * 0.2, STAGE_Y + 2.2 + t * 1.6, -10.3], 0.5, { alpha: 1 - t })); }
    if (f >= 1106 && f < 1140) for (let i = 0; i < 3; i++) { const t = ramp(f, 1106 + i * 4, 1124 + i * 4); if (t <= 0) continue; const k = q(t, 2); out.push(FX('coin' + q(((f / 3) % 1), 1), (p) => T.fxCoin(p, f / 6 + i), [lerp(7.5, 11.8 + i * 0.6, k), STAGE_Y + 1.2 + Math.sin(k * Math.PI) * 1.4, -9.6], 0.22)); }
  }
  if (S.id === 'rye') {
    const mold = q(ramp(f, 1299, 1318), 2);
    out.push(FX('bread' + mold, (p) => T.fxBread(p, mold), [-0.85, 1.05 + idle(f, 19).bob, 11.15], 0.5 * pop(f, 1296, 10)));
    if (f >= 1330 && f < 1350) out.push(FX('crossR', (p) => T.fxCross(p), [-0.85, 1.12, 11.05], 0.42 * pop(f, 1330, 6)));
  }
  if (S.id === 'cramps' && f >= 1377) {
    const t = q(((f - 1377) / 12) % 1, 2);
    out.push(FX('creakc' + t, (p) => { p.g.translate(150, 350); T.fxCreak(p, t); }, [6.45, 1.3, 4.3], 0.6));
  }
  if (S.id === 'cramps' && f >= 1403) for (let i = 0; i < 2; i++) { const t = ((f - 1403) / 30 + i / 2) % 1; out.push(FX('notec' + i, (p) => { p.g.translate(200, 300); p.g.scale(1.4, 1.4); T.fxNote(p, i, '#1f2a44'); }, [7.95 + Math.sin(t * 6) * 0.3, 2.3 + t * 1.0, 4.1], 0.45, { alpha: 1 - t })); }
  if (S.id === 'stress') {
    if (f >= 1493) out.push(FX('bowl', (p) => T.fxBowl(p), [-0.35, 2.55 + 0.04 * Math.sin(f / 9), 3.05], 0.5 * pop(f, 1493)));
    if (f >= 1515) { const t = q(((f - 1515) / 10) % 1, 2); out.push(FX('cough' + t, (p) => { p.g.translate(105, 266); p.g.scale(1.3, 1.3); T.fxPuff(p, t); }, [1.25, 1.65, 3.4], 0.45)); }
  }
  if (S.id === 'saint') {
    out.push(FX('halo', (p) => T.fxHalo(p), [-6, 2.0 + 1.72 * 1.3 + 0.05, -2.12], 0.42, { order: 1 }));
    if (f >= 1582) { const t = q(ramp(f, 1582, 1600), 2); out.push(FX('burst' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0'); }, [-6, 3.9, -1.9], 1.0, { alpha: 1 - t * 0.7 })); }
  }
  if (S.id === 'music') {
    const snapT = q(ramp(f, 1873, 1880), 2);
    out.push(FX('drum2', (p) => { p.g.translate(40, 240); p.g.scale(2, 2); T.fxDrum(p); }, [8.75, STAGE_Y + 0.75, -10.25], 0.5));
    if (f < 1873) out.push(FX('stick', (p) => T.fxSnap(p, 0), [10.15, STAGE_Y + 2.05, -10.2], 0.22));
    else out.push(FX('snap' + snapT, (p) => T.fxSnap(p, snapT), [10.15, STAGE_Y + 2.05 - snapT * 0.3, -10.2], 0.22));
    if (f >= 1873 && f < 1888) { const t = q((f - 1873) / 15, 2); out.push(FX('puffm' + t, (p) => { p.g.translate(150, 320); T.fxPuff(p, t); }, [10.0, STAGE_Y + 1.8, -10.0], 0.6)); }
  }
  if (S.id === 'sept' || S.id === 'opposite') {
    for (let i = 0; i < 10; i++) {
      const t = ((f - 2032) * 0.008 + i / 10) % 1, cols = ['#d9822b', '#c4452c', '#e6b13a'];
      const x = -8 + i * 1.6 + Math.sin(t * 7 + i) * 0.8, y = 5.5 - t * 5.4, z = -12 + (i % 4) * 2.6 + (S.id === 'opposite' ? -1 : 0);
      out.push(FX('leaf' + i % 3, (p) => T.fxLeaf(p, cols[i % 3]), [x, y, z], 0.14, { roll: q(t * 8 + i, 1) }));
    }
  }
  return out;
};
