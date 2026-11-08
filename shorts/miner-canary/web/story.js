// Shot plan for "The Miner Who Weighed 20 Grams" — timed to voice.mp3 (77.79 s, 30 fps, 2334 frames).
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, lerp3, ramp } from './motion.js';
export const FPS = 30, TOTAL = 2334;
const Y0 = -60, CG = [18.2, Y0 + 1.55, -0.9]; // gallery floor, cage card origin
const SURF = 0;
export const SHOTS = [
  { id: 'hook', a: 0, b: 171, light: 'mine' },
  { id: 'valley', a: 172, b: 296, light: 'day' },
  { id: 'kit', a: 297, b: 405, light: 'day' },
  { id: 'betty', a: 406, b: 485, light: 'mine' },
  { id: 'laugh', a: 486, b: 515, light: 'mine' },
  { id: 'cut', a: 516, b: 594, light: 'cut', cut: true },
  { id: 'canary', a: 595, b: 691, light: 'mine' },
  { id: 'hour', a: 692, b: 745, light: 'mine' },
  { id: 'hack', a: 746, b: 853, light: 'mine' },
  { id: 'glance', a: 854, b: 963, light: 'mine' },
  { id: 'silence', a: 964, b: 1019, light: 'mine' },
  { id: 'sway', a: 1020, b: 1067, light: 'mine' },
  { id: 'drop', a: 1068, b: 1116, light: 'mine' },
  { id: 'up', a: 1117, b: 1160, light: 'mine' },
  { id: 'feel', a: 1161, b: 1335, light: 'mine' },
  { id: 'co', a: 1336, b: 1529, light: 'mine' },
  { id: 'tap', a: 1530, b: 1665, light: 'day' },
  { id: 'thimble', a: 1666, b: 1698, light: 'day' },
  { id: 'heart', a: 1699, b: 1827, light: 'mine' },
  { id: 'poison', a: 1828, b: 1919, light: 'mine' },
  { id: 'grab', a: 1920, b: 1980, light: 'mine' },
  { id: 'haldane', a: 1981, b: 2112, light: 'day' },
  { id: 'y1986', a: 2113, b: 2229, light: 'golden' },
  { id: 'detect', a: 2230, b: 2333, light: 'golden' },
];
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;

// ---------- lights ----------
export const LIGHTS = {
  day: { az: 70, el: 46, sky: '#c4d6f2', ground: '#8a8262', hemi: 1.15, sun: '#fff1dc', sunI: 2.5, fog: '#c3d6ec', fogNear: 60, fogFar: 700,
    skyTop: '#3f80d4', skyHor: '#c3daf2', sat: 1.08, vig: 0.2, shadowExt: 18, lamps: 0 },
  golden: { az: 20, el: 9, sky: '#9a90c8', ground: '#6a4c40', hemi: 1.0, sun: '#ffb46c', sunI: 2.9, fog: '#f0b88c', fogNear: 50, fogFar: 650,
    skyTop: '#6f6eb0', skyHor: '#ffc27e', sunDisc: '#fff0c8', sunSize: 0.0035, sat: 1.1, gain: '#fff2e2', vig: 0.26, shadowExt: 16, lamps: 0 },
  mine: { az: 115, el: 62, sky: '#8a7660', ground: '#3a2c22', hemi: 1.25, sun: '#ffd9a8', sunI: 1.35, fog: '#21180f', fogNear: 7, fogFar: 40,
    skyTop: '#21180f', skyHor: '#21180f', sat: 1.08, gain: '#fff4e6', vig: 0.34, shadowExt: 7, lamps: 4.5 },
  cut: { az: 80, el: 38, sky: '#c4d6f2', ground: '#8a8262', hemi: 1.2, sun: '#fff1dc', sunI: 2.3, fog: '#c3d6ec', fogNear: 160, fogFar: 900,
    skyTop: '#3f80d4', skyHor: '#c3daf2', sat: 1.08, vig: 0.18, shadowExt: 70, lamps: 4.5 },
};
export const lightFor = (S, f) => {
  const L = { ...LIGHTS[S.light] };
  if (S.id === 'cut') L.shadowExt = lerp(10, 70, smooth(ramp(f, 520, 585)));
  if (S.id === 'valley') L.shadowExt = 40;
  if (S.id === 'tap' || S.id === 'thimble') L.shadowExt = 3;
  if (S.id === 'haldane' || S.id === 'kit') L.shadowExt = 8;
  if (S.id === 'detect') L.shadowExt = 6;
  return L;
};

// ---------- cameras ----------
const HF = [-31, 0, -0.5];
const CAMS = {
  hook: [
    { f: 0, pos: [18.2, Y0 + 1.86, 0.20], look: [18.2, Y0 + 1.82, -0.9], fov: 34 },
    { f: 100, pos: [18.2, Y0 + 1.88, 0.10], look: [18.2, Y0 + 1.82, -0.9], fov: 31 },
    { f: 160, pos: [16.2, Y0 + 1.80, 1.5], look: [21.5, Y0 + 1.40, -0.6], fov: 48 },
    { f: 171, pos: [16.0, Y0 + 1.80, 1.55], look: [21.5, Y0 + 1.40, -0.6], fov: 47 },
  ],
  valley: [
    { f: 172, pos: [-2, 9, 38], look: [-30, 10, -6], fov: 52 },
    { f: 232, pos: [-6, 8, 30], look: [-30, 8, -4], fov: 48 },
    { f: 262, pos: [-24, 4.5, 9], look: [-31, 0.6, -0.5], fov: 40 },
    { f: 296, pos: [-25, 4.2, 8.2], look: [-31, -0.2, -0.5], fov: 38 },
  ],
  kit: [
    { f: 297, pos: [-18.9, 1.95, 0.4], look: [-19.1, 1.55, -3.4], fov: 42 },
    { f: 345, pos: [-18.8, 1.9, 0.1], look: [-19.0, 1.55, -3.4], fov: 40 },
    { f: 360, pos: [-18.4, 1.9, 0.6], look: [-18.6, 1.5, -3.3], fov: 44 },
    { f: 405, pos: [-18.4, 1.88, 0.35], look: [-18.6, 1.5, -3.3], fov: 42 },
  ],
  betty: [
    { f: 406, pos: [14.9, Y0 + 1.6, 0.95], look: [18.4, Y0 + 1.6, -0.3], fov: 50 },
    { f: 430, pos: [15.2, Y0 + 1.6, 0.9], look: [18.4, Y0 + 1.65, -0.3], fov: 48 },
    { f: 445, pos: [18.0, Y0 + 1.80, 0.25], look: [18.2, Y0 + 1.82, -0.9], fov: 34, ease: 'easeOut' },
    { f: 485, pos: [18.05, Y0 + 1.80, 0.17], look: [18.2, Y0 + 1.82, -0.9], fov: 32 },
  ],
  laugh: [
    { f: 486, pos: [17.2, Y0 + 1.55, 1.9], look: [18.3, Y0 + 1.45, 0.4], fov: 38 },
    { f: 515, pos: [17.3, Y0 + 1.54, 1.75], look: [18.3, Y0 + 1.45, 0.4], fov: 35, roll: 3 },
  ],
  cut: [
    { f: 516, pos: [8, Y0 + 2.00, 13], look: [8, Y0 + 1.60, 0], fov: 40 },
    { f: 528, pos: [8, Y0 + 2.40, 15], look: [8, Y0 + 2.40, 0], fov: 42 },
    { f: 580, pos: [-12, -8, 92], look: [-12, -30, 0], fov: 50 },
    { f: 594, pos: [-12, -7.6, 93], look: [-12, -30, 0], fov: 49.5 },
  ],
  canary: [
    { f: 595, pos: [21.6, Y0 + 0.50, 1.4], look: [18.2, Y0 + 2.60, -1.0], fov: 60, roll: -4 },
    { f: 634, pos: [21.4, Y0 + 0.55, 1.3], look: [18.2, Y0 + 2.60, -1.0], fov: 56, roll: -4 },
    { f: 652, pos: [18.3, Y0 + 1.78, 0.25], look: [18.2, Y0 + 1.80, -0.9], fov: 38, ease: 'easeOut' },
    { f: 691, pos: [18.28, Y0 + 1.8, 0.15], look: [18.2, Y0 + 1.82, -0.9], fov: 35 },
  ],
  hour: [
    { f: 692, pos: [16.9, Y0 + 1.60, 1.5], look: [21.2, Y0 + 1.35, -0.1], fov: 46 },
    { f: 745, pos: [17.2, Y0 + 1.58, 1.4], look: [21.2, Y0 + 1.35, -0.1], fov: 43 },
  ],
  hack: [
    { f: 746, pos: [21.0, Y0 + 1.50, 1.7], look: [24.5, Y0 + 1.50, -0.2], fov: 46, roll: 2 },
    { f: 853, pos: [21.6, Y0 + 1.50, 1.45], look: [24.5, Y0 + 1.50, -0.2], fov: 42, roll: 3 },
  ],
  glance: [
    { f: 854, pos: [19.0, Y0 + 1.55, 1.7], look: [21.6, Y0 + 1.40, 0.2], fov: 38 },
    { f: 963, pos: [19.4, Y0 + 1.53, 1.55], look: [21.6, Y0 + 1.45, 0.2], fov: 34 },
  ],
  silence: [
    { f: 964, pos: [18.30, Y0 + 1.82, 0.35], look: [18.2, Y0 + 1.82, -0.9], fov: 36 },
    { f: 1019, pos: [18.25, Y0 + 1.82, 0.10], look: [18.2, Y0 + 1.82, -0.9], fov: 33 },
  ],
  sway: [
    { f: 1020, pos: [18.00, Y0 + 1.80, 0.00], look: [18.2, Y0 + 1.82, -0.9], fov: 32, roll: -3 },
    { f: 1067, pos: [18.05, Y0 + 1.80, -0.10], look: [18.2, Y0 + 1.82, -0.9], fov: 30, roll: 3 },
  ],
  drop: [
    { f: 1068, pos: [19.3, Y0 + 1.40, 2.0], look: [21.4, Y0 + 1.40, 0.3], fov: 44 },
    { f: 1116, pos: [19.6, Y0 + 1.40, 1.85], look: [21.4, Y0 + 1.40, 0.3], fov: 41 },
  ],
  up: [
    { f: 1117, pos: [20.2, Y0 + 1.40, 1.75], look: [21.4, Y0 + 1.60, 0.3], fov: 40, roll: -3 },
    { f: 1160, pos: [20.4, Y0 + 1.40, 1.6], look: [21.4, Y0 + 1.65, 0.3], fov: 37, roll: -4.5 },
  ],
  feel: [
    { f: 1161, pos: [15.2, Y0 + 1.55, 1.7], look: [18.3, Y0 + 1.40, 0.2], fov: 40 },
    { f: 1240, pos: [15.6, Y0 + 1.55, 1.6], look: [18.3, Y0 + 1.45, 0.2], fov: 37 },
    { f: 1262, pos: [16.6, Y0 + 1.55, 1.55], look: [18.3, Y0 + 1.50, 0.3], fov: 34 },
    { f: 1335, pos: [16.85, Y0 + 1.54, 1.45], look: [18.3, Y0 + 1.50, 0.3], fov: 31 },
  ],
  co: [
    { f: 1336, pos: [11.5, Y0 + 0.45, 1.4], look: [18, Y0 + 1.20, -0.3], fov: 54 },
    { f: 1398, pos: [12.5, Y0 + 0.50, 1.3], look: [18, Y0 + 1.30, -0.3], fov: 50 },
    { f: 1446, pos: [16.3, Y0 + 1.55, 1.5], look: [18.3, Y0 + 1.45, 0.3], fov: 38 },
    { f: 1529, pos: [16.8, Y0 + 1.50, 1.3], look: [18.3, Y0 + 1.45, 0.3], fov: 33 },
  ],
  tap: [
    { f: 1530, pos: [24, 1.2, 18.2], look: [24, 0.5, 15.4], fov: 46 },
    { f: 1615, pos: [23.95, 0.85, 17.6], look: [23.95, 0.3, 15.38], fov: 42 },
    { f: 1665, pos: [23.78, 0.45, 16.7], look: [23.7, 0.15, 15.38], fov: 38 },
  ],
  thimble: [
    { f: 1666, pos: [23.6, 0.24, 16.12], look: [23.6, 0.12, 15.38], fov: 40 },
    { f: 1698, pos: [23.6, 0.23, 16.04], look: [23.6, 0.12, 15.38], fov: 37 },
  ],
  heart: [
    { f: 1699, pos: [18.15, Y0 + 1.82, 0.25], look: [18.2, Y0 + 1.90, -0.9], fov: 38 },
    { f: 1745, pos: [18.15, Y0 + 1.82, 0.10], look: [18.2, Y0 + 1.90, -0.9], fov: 35 },
    { f: 1748, pos: [14.9, Y0 + 1.6, 0.95], look: [18.3, Y0 + 1.65, -0.25], fov: 50 },
    { f: 1827, pos: [15.25, Y0 + 1.6, 0.9], look: [18.3, Y0 + 1.65, -0.25], fov: 47 },
  ],
  poison: [
    { f: 1828, pos: [14.3, Y0 + 1.3, 1.0], look: [18.3, Y0 + 1.5, -0.25], fov: 52 },
    { f: 1919, pos: [14.7, Y0 + 1.35, 0.95], look: [18.3, Y0 + 1.55, -0.25], fov: 49 },
  ],
  grab: [
    { f: 1920, pos: [13.5, Y0 + 1.40, 1.0], look: [18.5, Y0 + 1.40, -0.3], fov: 44 },
    { f: 1980, pos: [12.4, Y0 + 1.40, 0.9], look: [15.5, Y0 + 1.50, -0.1], fov: 46 },
  ],
  haldane: [
    { f: 1981, pos: [-22.8, 1.35, 0.4], look: [-23.0, 1.15, -2.0], fov: 48 },
    { f: 2040, pos: [-22.85, 1.3, -0.1], look: [-23.0, 1.12, -2.0], fov: 44 },
    { f: 2112, pos: [-22.8, 1.35, 0.1], look: [-23.0, 1.2, -2.0], fov: 48 },
  ],
  y1986: [
    { f: 2113, pos: [-4, 3.2, 26], look: [-31, 11, -3], fov: 48 },
    { f: 2229, pos: [-9, 2.6, 21], look: [-31, 9, -3], fov: 44 },
  ],
  detect: [
    { f: 2230, pos: [-22.97, 1.2, 0.2], look: [-22.97, 0.98, -2.0], fov: 58 },
    { f: 2295, pos: [-22.97, 1.12, -0.3], look: [-22.97, 0.98, -2.0], fov: 54 },
    { f: 2333, pos: [-22.97, 1.1, -0.42], look: [-22.97, 0.98, -2.0], fov: 51 },
  ],
};
const KICKS = [{ f: 1095, a: 0.04 }, { f: 1117, a: 0.03 }, { f: 1140, a: 0.03 }, { f: 794, a: 0.012 }, { f: 814, a: 0.012 }, { f: 834, a: 0.012 }, { f: 2062, a: 0.015 }];
export const camAt = (f) => {
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.001, kicks: KICKS });
  // white flash after the hook, soft flashes at place changes
  c.flash = f >= 172 && f < 180 ? (1 - (f - 172) / 8) * 0.85 : f >= 1530 && f < 1535 ? 0.4 * (1 - (f - 1530) / 5) : f >= 2113 && f < 2119 ? 0.5 * (1 - (f - 2113) / 6) : 0;
  // "and never wake up": the picture sinks to black, then the next scene opens
  c.dark = S.id === 'co' ? 0.96 * smooth(ramp(f, 1488, 1512)) : 0;
  if (S.id === 'tap' || S.id === 'thimble') c.near = 0.02;
  if (['hook', 'betty', 'silence', 'sway', 'canary', 'heart'].includes(S.id)) c.near = 0.03;
  if (S.id === 'cut') c.shadowAt = [-10, -20, 0];
  return c;
};

// ---------- lens ----------
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const BIRD = [18.2, Y0 + 1.82, -0.9];
export const dofAt = (f) => {
  const S = shotAt(f), C = camAt(f);
  switch (S.id) {
    case 'hook': return { focus: dist(C.pos, BIRD), cinf: lerp(15, 9, smooth(ramp(f, 100, 160))) };
    case 'betty': return f < 440 ? { focus: dist(C.pos, [19.0, Y0 + 1.5, -0.4]), cinf: 10 } : { focus: dist(C.pos, BIRD), cinf: 14 };
    case 'canary': return f < 640 ? { focus: dist(C.pos, BIRD), cinf: 4 } : { focus: dist(C.pos, BIRD), cinf: 13 };
    case 'silence': case 'sway': case 'heart': return f >= 1748 ? { focus: dist(C.pos, [18.3, Y0 + 1.5, 0.4]), cinf: 9 } : { focus: dist(C.pos, BIRD), cinf: 15 };
    case 'laugh': case 'feel': return { focus: dist(C.pos, [18.3, Y0 + 1.5, 0.4]), cinf: 12 };
    case 'co': return f < 1440 ? { focus: dist(C.pos, [16, Y0 + 0.5, 0]), cinf: 5 } : { focus: dist(C.pos, [18.3, Y0 + 1.5, 0.4]), cinf: 12 };
    case 'kit': return { focus: dist(C.pos, [-19, 1.9, -3.4]), cinf: 11 };
    case 'hour': case 'hack': case 'glance': case 'drop': case 'up': return { focus: dist(C.pos, [21.4, Y0 + 1.45, 0.3]), cinf: 10 };
    case 'tap': return { focus: dist(C.pos, [24, 0.35, 15.38]), cinf: lerp(8, 12, smooth(ramp(f, 1530, 1660))) };
    case 'thimble': return { focus: dist(C.pos, [23.62, 0.12, 15.38]), cinf: 15 };
    case 'poison': return { focus: dist(C.pos, [18.3, Y0 + 1.5, -0.2]), cinf: 7 };
    case 'grab': return { focus: dist(C.pos, [16, Y0 + 1.4, 0]), cinf: 6 };
    case 'haldane': case 'detect': return { focus: dist(C.pos, [-23.0, 1.1, -2.0]), cinf: 12 };
  }
  return { focus: 10, cinf: 0 };
};

// ---------- world state ----------
export const worldAt = (f) => {
  const S = shotAt(f), W = { cut: !!S.cut };
  if (S.id === 'valley') W.lift = -15 * M.easeIn(ramp(f, 250, 296));
  if (S.id === 'cut') W.cutLift = lerp(-4, Y0 + 2, smooth(ramp(f, 516, 594)));
  if (S.id === 'tap' || S.id === 'thimble') {
    W.tap = f >= 1588 ? 1 : 0;
    W.thimble = clamp((f - 1590) / 46); W.bucket = clamp((f - 1590) / 46) * 0.06 + (S.id === 'thimble' ? 0.02 : 0);
  }
  return W;
};

// ---------- actors (2D cards) ----------
const MN = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.minerFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ground: pos[1], ...extra });
const CAGE = (T, o, pos = CG, extra = {}) => ({ key: 'cage' + JSON.stringify(o), draw: (p) => T.canaryCage(p, o), x: pos[0], y: pos[1], z: pos[2], s: 0.3, blob: false, ...extra });
const sing = (f, k = 1) => q(k * Math.max(0, Math.sin(f * 0.55)) ** 0.7, 1);
const live = (f, seed) => { const i = idle(f, seed); return { bob: q(i.bob, 3), tilt: q(i.tilt, 1), headTilt: q(i.headTilt, 1), blink: blinkAt(f, seed) }; };
const YOU = [18.3, Y0, 0.4], FORE = [21.4, Y0, 0.3], CA = [23.6, Y0, -0.9], CB = [23.1, Y0, 0.95];
const swingAt = (f, ph, per = 22) => { const t = ((f + ph) % per) / per; return q(t < 0.55 ? 0.05 + 0.1 * t : t < 0.7 ? 0.1 + (t - 0.55) / 0.15 * 0.85 : 0.95 - (t - 0.7) / 0.3 * 0.9, 2); };

export const actorsAt = (f, T) => {
  const S = shotAt(f), out = [];
  const tint = S.light === 'mine' ? '#ffe8cc' : S.light === 'golden' ? '#ffe2c8' : '#ffffff';
  const crewHack = (k = 1) => {
    out.push(MN(T, 'crewA', { expr: 'stern', swing: swingAt(f, 0), facing: 1, seed: 21, blink: blinkAt(f, 21) }, CA, { tint }));
    out.push(MN(T, 'crewB', { expr: 'stern', swing: swingAt(f, 9), facing: 1, seed: 22, blink: blinkAt(f, 22) }, CB, { tint }));
    void k;
  };
  const betty = (o = {}) => out.push(CAGE(T, { beak: 0, blink: blinkAt(f, 5) ? 1 : 0, ...o }, CG, { tint }));
  switch (S.id) {
    case 'hook': {
      const proud = f >= 52 && f < 98;
      betty({ beak: f >= 98 || f < 40 ? sing(f) : 0, puff: proud ? 1 : 0, proud, wing: f > 98 ? q(0.3 * Math.sin(f * 0.4), 1) : 0 });
      crewHack();
      out.push(MN(T, 'foreman', { expr: 'neutral', swing: swingAt(f, 5, 26), facing: 1, seed: 23, blink: blinkAt(f, 23) }, FORE, { tint }));
      break;
    }
    case 'valley': {
      if (f >= 232) { const ly = -15 * M.easeIn(ramp(f, 250, 296)) + 0.06;
        out.push(MN(T, 'you', { expr: f > 255 ? 'nervous' : 'neutral', seed: 3, ...live(f, 3), L: 'cheek' }, [HF[0] - 0.45, ly, HF[2] + 0.5], { tint, ground: undefined }));
        out.push(MN(T, 'foreman', { expr: 'smile', seed: 23, ...live(f, 23) }, [HF[0] + 0.55, ly, HF[2] + 0.2], { tint, ground: undefined })); }
      break;
    }
    case 'kit': {
      const items = {};
      if (f >= 312) items.pick = 'hand';
      if (f >= 331) items.sandwich = 1;
      const pop = (t0) => f >= t0 && f < t0 + 4 ? 0.02 : 0;
      out.push(MN(T, 'you', { expr: f >= 346 ? 'nervous' : f >= 298 ? 'grin' : 'smile', seed: 3, ...live(f, 3), bob: pop(298) + pop(312) + pop(331), nohelmet: f < 298, L: f >= 331 ? 'hold' : 'hang', R: 'hang', look: f >= 352 ? 0.6 : 0, items }, [-19.1, SURF, -3.4], { tint }));
      if (f >= 346) { const sl = M.easeOut(ramp(f, 346, 362)); out.push(MN(T, 'foreman', { expr: 'smile', seed: 23, ...live(f, 23), L: 'holdUp', facing: -1, items: { cage: { beak: sing(f) } }, look: -0.6 }, [lerp(-16.4, -18.0, sl), SURF, -3.1], { tint })); }
      break;
    }
    case 'betty': {
      betty({ beak: f >= 434 ? 0 : sing(f, 0.6), puff: f >= 442 ? 1 : 0, proud: f >= 442, look: f >= 442 ? -0.5 : 0 });
      if (f < 446) out.push(MN(T, 'foreman', { expr: 'smile', seed: 23, ...live(f, 23), R: 'point', facing: -1, look: -0.5 }, [18.6, Y0, 0.3], { tint }));
      break;
    }
    case 'laugh': {
      const lb = q(Math.abs(Math.sin(f * 0.6)) * 0.02, 3);
      out.push(MN(T, 'you', { expr: 'laugh', seed: 3, bob: lb, tilt: q(-4 + 3 * Math.sin(f * 0.5), 1), L: 'belly', R: 'belly' }, YOU, { tint }));
      betty({ beak: 0, look: 0.6 });
      break;
    }
    case 'cut': {
      out.push(MN(T, 'you', { expr: 'neutral', seed: 3, ...live(f, 3) }, [7, Y0, 0.6], { tint }));
      out.push(MN(T, 'crewA', { expr: 'stern', swing: swingAt(f, 0), facing: 1, seed: 21 }, [9.5, Y0, 0.2], { tint }));
      break;
    }
    case 'canary': {
      betty({ beak: f >= 646 ? 0.6 : sing(f, 0.5), proud: f >= 646, puff: f >= 646 ? 1 : 0 });
      if (f < 640) out.push(MN(T, 'you', { expr: 'nervous', seed: 3, ...live(f, 3), look: -0.7 }, [17.5, Y0, 0.9], { tint }));
      break;
    }
    case 'hour': case 'hack': {
      betty({ beak: sing(f), wing: q(0.3 * Math.sin(f * 0.3), 1) });
      crewHack();
      out.push(MN(T, 'foreman', { expr: 'stern', swing: swingAt(f, 5, 26), facing: 1, seed: 23, blink: blinkAt(f, 23) }, FORE, { tint }));
      break;
    }
    case 'glance': {
      crewHack();
      const g = (f >= 877 && f < 896) || (f >= 925 && f < 944);
      out.push(MN(T, 'foreman', { expr: g ? 'squint' : 'stern', swing: g ? 0.05 : swingAt(f, 5, 26), facing: 1, seed: 23, blink: blinkAt(f, 23), look: g ? -0.9 : 0.4, headTilt: g ? -6 : 0 }, FORE, { tint }));
      betty({ beak: sing(f, 0.8) });
      break;
    }
    case 'silence': betty({ beak: 0, blink: 0 }); break;
    case 'sway': { const t = (f - 1020) / 47; betty({ beak: 0, tilt: q(14 * Math.sin(f * 0.22) * (0.5 + t), 0), eye: f > 1040 ? 'spiral' : 'half' }); break; }
    case 'drop': {
      const d = f >= 1083;
      out.push(MN(T, 'foreman', { expr: d ? 'shock' : 'stern', swing: d ? null : swingAt(f, 5, 26), facing: 1, seed: 23, L: d ? 'cheek' : 'hang', R: d ? 'cheek' : 'hang', look: -0.7 }, FORE, { tint }));
      crewHack();
      break;
    }
    case 'up': {
      out.push(MN(T, 'foreman', { expr: 'shout', seed: 23, L: 'up', R: f >= 1140 ? 'point' : 'up', facing: -1, bob: f % 4 < 2 ? 0.01 : 0, tilt: -3 }, FORE, { tint }));
      out.push(MN(T, 'crewA', { expr: 'shock', seed: 21, facing: -1, L: 'cheek', R: 'hang' }, CA, { tint }));
      out.push(MN(T, 'crewB', { expr: 'shock', seed: 22, facing: -1 }, CB, { tint }));
      break;
    }
    case 'feel': {
      const pose = f >= 1287 ? ['shrug', 'shrug', 'puzzled'] : f >= 1242 ? ['shrug', 'hang', 'puzzled'] : f >= 1198 ? ['nose', 'hang', 'sniff'] : ['hang', 'hang', 'puzzled'];
      out.push(MN(T, 'you', { expr: pose[2], seed: 3, ...live(f, 3), L: pose[0], R: pose[1], look: f < 1198 ? 0.6 : 0 }, YOU, { tint }));
      // the crew runs past behind him, toward the shaft (-x)
      for (const [who, s0, z, ph] of [['crewA', 1161, -1.2, 0], ['crewB', 1172, -0.8, 0.3], ['foreman', 1186, -1.4, 0.6]]) {
        const t = (f - s0) / 30; if (t < 0) continue; const x = 23 - t * 4.2; if (x < 13) continue;
        out.push(MN(T, who, { expr: 'nervous', seed: who === 'foreman' ? 23 : who === 'crewA' ? 21 : 22, L: 'run', R: 'run', step: q((t * 1.6 + ph) % 1, 2), facing: -1, items: who === 'foreman' ? { cage: { beak: 0, eye: 'half', tilt: 14 }, cageHand: 'R' } : {} }, [x, Y0, z], { tint }));
      }
      break;
    }
    case 'co': {
      const sleepy = f >= 1450;
      out.push(MN(T, 'you', { expr: f >= 1486 ? 'snore' : sleepy ? (f < 1470 ? 'yawn' : 'sleepy') : f >= 1426 ? 'sniff' : 'neutral', seed: 3, ...live(f, 3), blink: f >= 1486 ? 1 : blinkAt(f, 3),
        L: f >= 1426 && f < 1448 ? 'nose' : sleepy && f < 1478 ? 'mouth' : 'hang', tilt: sleepy ? q(-6 * smooth(ramp(f, 1450, 1510)), 1) : 0, headTilt: sleepy ? q(-10 * smooth(ramp(f, 1460, 1510)), 1) : 0 }, YOU, { tint }));
      break;
    }
    case 'tap': case 'thimble': {
      if (S.id === 'thimble') out.push({ key: 'bird-bare', draw: (p) => T.canaryCage(p, { cage: false, perch: false, beak: 0, look: 0.6, proud: true, puff: 1 }), x: 23.53, y: 0.0, z: 15.42, s: 0.085, ground: 0, tint });
      break;
    }
    case 'heart': {
      if (f < 1748) betty({ beak: 0, puff: 0.5 });
      else {
        betty({ beak: 0, look: 0.4 });
        out.push(MN(T, 'you', { expr: 'neutral', seed: 3, ...live(f, 3), look: -0.5, L: 'chest' }, YOU, { tint }));
      }
      break;
    }
    case 'poison': {
      const hit = f >= 1850;
      betty({ beak: 0, tilt: hit ? q(18 * smooth(ramp(f, 1850, 1870)), 0) : 0, eye: hit ? (f > 1880 ? 'x' : 'half') : 'dot' });
      out.push(MN(T, 'you', { expr: 'smile', seed: 3, ...live(f, 3), look: 0.5 }, YOU, { tint }));
      break;
    }
    case 'grab': {
      const t = (f - 1920) / 30, x = 19.2 - t * 2.4;
      out.push(MN(T, 'foreman', { expr: 'nervous', seed: 23, L: 'run', R: 'run', step: q((t * 1.6) % 1, 2), facing: -1, items: { box: { bird: 'droop', gas: q(t, 1) } } }, [x, Y0, 0.1], { tint }));
      out.push(MN(T, 'you', { expr: 'nervous', seed: 3, L: 'run', R: 'run', step: q((t * 1.6 + 0.5) % 1, 2), facing: -1 }, [x + 1.4, Y0, -0.6], { tint }));
      break;
    }
    case 'haldane': case 'detect': case 'y1986': {
      if (S.id === 'y1986') {
        out.push(MN(T, 'inspector', { expr: 'smile', seed: 31, ...live(f, 31), L: 'hold', items: { box: null } }, [-24.6, 0, 3.2], { tint }));
        out.push({ key: 'cageY', draw: (p) => T.canaryCage(p, { beak: sing(f, 0.7) }), x: -23.6, y: 0.95, z: 3.4, s: 0.3, tint, blob: false });
        break;
      }
      const revive = S.id === 'haldane' && f >= 2062, detect = S.id === 'detect';
      if (!detect) out.push({ key: 'box' + revive + q((f % 20) / 20, 1) + (revive ? sing(f) : 0), draw: (p) => T.haldaneBox(p, { bird: revive ? 'sing' : 'droop', gas: q((f % 20) / 20, 1), beak: revive ? sing(f) : 0 }), x: -23.0, y: 0.75, z: -1.9, s: 0.42, tint, blob: false });
      else {
        out.push({ key: 'cageD' + sing(f), draw: (p) => T.canaryCage(p, { beak: f >= 2299 ? sing(f) : 0, proud: f >= 2299, puff: f >= 2299 ? 1 : 0, look: f < 2299 ? 0.6 : 0 }), x: -23.22, y: 0.76, z: -1.9, s: 0.36, tint, blob: false });
        const on = f >= 2245; if (on) { const sl = M.back(ramp(f, 2245, 2262)); out.push({ key: 'det' + ((f >> 3) % 2), draw: (p) => T.detector(p, { led: (f >> 3) % 2, needle: 0.15 }), x: -22.72, y: lerp(1.4, 0.73, sl), z: -1.85, s: 0.3, tint, blob: false }); }
      }
      // crate the box sits on is a card-free 3D-less prop: the miners stand behind
      if (!detect) {
        out.push(MN(T, 'foreman', { expr: revive ? 'grin' : 'nervous', seed: 23, ...live(f, 23), L: revive ? 'up' : 'hang', look: 0.3 }, [-23.65, 0, -2.9], { tint }));
        out.push(MN(T, 'you', { expr: revive ? 'laugh' : 'nervous', seed: 3, ...live(f, 3), L: revive ? 'belly' : 'cheek', R: revive ? 'belly' : 'hang', look: -0.3 }, [-22.35, 0, -2.95], { tint }));
      } else out.push(MN(T, 'inspector', { expr: f >= 2299 ? 'neutral' : 'smile', seed: 31, ...live(f, 31), R: f < 2262 ? 'hold' : 'hip', look: -0.4 }, [-22.1, 0, -3.1], { tint }));
      break;
    }
  }
  return out;
};

// ---------- 2D effects ----------
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const notes = (T, f, out, base, k = 1, col = '#2a3a6a') => {
  for (let i = 0; i < 3; i++) {
    const t = ((f * 0.022 * k + i / 3) % 1);
    out.push(FX('note' + (i % 2) + q(t, 1), (p) => { const g = p.g; g.save(); g.globalAlpha = Math.min(1, (1 - t) * 3); g.translate(220, 640); g.scale(1.6, 1.6); T.fxNote(p, i % 2, col); g.restore(); },
      [base[0] - 0.08 - t * 0.1 + Math.sin(t * 6 + i) * 0.04, base[1] + 0.12 + t * 0.32, base[2] + 0.06], 0.11));
  }
};
export const fxAt = (f, T) => {
  const S = shotAt(f), out = [];
  const birdTop = [CG[0], CG[1] + 0.18, CG[2] + 0.05];
  if ((S.id === 'hook' && (f >= 98 || f < 40)) || S.id === 'hour' || S.id === 'hack' || S.id === 'glance' || (S.id === 'canary' && f < 640) || (S.id === 'betty' && f < 434)) notes(T, f, out, birdTop, 1);
  if (S.id === 'hack' || S.id === 'hour' || S.id === 'glance' || S.id === 'hook') for (const [ph, pos] of [[0, [25.1, Y0 + 1.5, -0.8]], [9, [25.0, Y0 + 1.3, 0.9]]]) {
    const t = ((f + ph) % 22) / 22; if (t > 0.68 && t < 0.95) { const k = q((t - 0.68) / 0.27, 1); out.push(FX('chips' + k, (p) => T.fxChips(p, k), pos, 0.35)); }
  }
  if (S.id === 'drop') { // the pickaxe falls and clanks
    if (f >= 1083) { const t = clamp((f - 1083) / 12); out.push(FX('pickfall', (p) => T.pickCard(p), [FORE[0] + 0.35, Y0 + 1.2 - 1.15 * t * t, FORE[2] + 0.25], 0.55, { roll: q(-t * 1.4, 2), order: 4 })); }
    if (f >= 1095 && f < 1110) { const t = q((f - 1095) / 15); out.push(FX('clank' + t, (p) => T.fxClank(p, t), [FORE[0] + 0.3, Y0 - 0.5, FORE[2] + 0.35], 0.6)); }
  }
  if (S.id === 'sway') { const t = q(((f - 1020) / 40) % 1, 2); if (f > 1040) out.push(FX('stars' + t, (p) => T.fxStars(p, t), [CG[0] + 0.04, CG[1] + 0.3, CG[2] + 0.05], 0.12)); }
  if (S.id === 'up') for (let i = 0; i < 2; i++) { const t = q(((f - 1117) / 10 + i * 0.5) % 1, 1); out.push(FX('burst' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0', 8, 30, 120); }, [FORE[0] - 0.35, Y0 + 2.25, FORE[2] + 0.1], 0.4)); }
  if (S.id === 'co' || S.id === 'poison') {
    // the gas creeps along the floor toward the cage / the boy
    const t = S.id === 'co' ? (f - 1336) / 190 : (f - 1828) / 90;
    const alpha = S.id === 'co' ? q(clamp((f - 1345) / 25) * 0.9, 2) : 0.8;
    for (let i = 0; i < 3; i++) {
      const x = S.id === 'co' ? lerp(12.5, 17.5, t) + i * 0.9 : lerp(16.5, 19.8, smooth(clamp(t * 1.4))) - i * 1.1;
      const y = S.id === 'co' ? Y0 + 0.05 + i * 0.25 : Y0 + lerp(0.2, 1.6, smooth(clamp(t * 1.3))) - i * 0.5;
      out.push(FX('gas' + i + q((f * 0.02 + i * 0.3) % 1, 2), (p) => T.fxGas(p, (f * 0.02 + i * 0.3) % 1, alpha), [x, y, -0.4 + i * 0.4], 0.8 + i * 0.15, { order: 6 }));
    }
  }
  if (S.id === 'heart') {
    if (f < 1748) { const s = q(Math.max(0, Math.sin(f * 1.5)) ** 3, 1); out.push(FX('hb' + s, (p) => T.fxHeart(p, s), [CG[0] - 0.05, CG[1] + 0.4, CG[2] + 0.12], 0.06)); }
    else {
      const s1 = q(Math.max(0, Math.sin(f * 1.5)) ** 3, 1), s2 = q(Math.max(0, Math.sin(f * 0.16)) ** 3, 1);
      out.push(FX('hb' + s1, (p) => T.fxHeart(p, s1), [CG[0] - 0.02, CG[1] + 0.52, CG[2] + 0.1], 0.13));
      out.push(FX('hy' + s2, (p) => T.fxHeart(p, s2), [YOU[0] + 0.05, Y0 + 1.78, YOU[2] + 0.1], 0.24));
    }
  }
  if (S.id === 'haldane' && f >= 2062) notes(T, f, out, [-23.0, 0.75 + 0.45, -1.8], 1.2);
  if (S.id === 'y1986') notes(T, f, out, [-23.6, 0.95 + 0.2, 3.45], 1);
  if (S.id === 'detect' && f >= 2299) notes(T, f, out, [-23.22, 0.76 + 0.3, -1.8], 1.2);
  if (S.id === 'tap' || S.id === 'thimble') {
    if (f >= 1636) { const t = q(((f - 1636) / 14) % 1, 1); out.push(FX('spill' + t, (p) => { p.g.translate(0, 130); p.g.scale(0.75, 0.75); T.fxSplash(p, t); }, [23.67, 0.0, 15.40], 0.05)); }
  }
  if (S.id === 'valley' || S.id === 'y1986') for (let i = 0; i < 4; i++) { // chimney smoke
    const t = ((f * 0.006 + i / 4) % 1), k = q(t, 2);
    out.push(FX('smoke' + k, (p) => T.fxDust(p, k * 0.8, S.light === 'golden' ? '#d8c0b0' : '#c8c8cc'), [-53 + t * 6, 31 + t * 9, -16], 5 + t * 7, { order: 1 }));
  }
  return out;
};
