// engine/anim.js — the animation library: procedural clips for blocky avatars.
// A clip is { dur, loop?, hold?, loco?: {speed, stride}, travel?(u), expr?, impact?, attach?, release?, blend?, back?, fn(lt, c) -> pose }
// c = { dur, u (0..1), t (global time), phase (locomotion phase, radians), seed, act, side ('L'|'R') }
// Poses are partial; missing joints come from REST (avatar.js). Angles in degrees (see avatar.js for conventions).
import { clamp, lerp, ease, key, mixVal, noise } from './core.js';
import { REST } from './avatar.js';

const S = Math.sin, C = Math.cos, ab = Math.abs, mx = Math.max;
export const full = (p) => { const o = { ...REST }; for (const k in p) o[k] = p[k]; return o; };
export const blend = (a, b, k) => mixVal(full(a), full(b), k);
// pose keyframes over u (0..1): kp(u, [[0, poseA], [0.4, poseB, easeFn?], [1, poseC]])
export const kp = (u, frames, fn = ease.inOut) => key(u, frames.map(([t, p, f]) => [t, full(p), f]), fn);
// mirror a pose left <-> right (for left-handed punches etc.)
export function mirror(p) {
  const o = {}; const sw = { armL: 'armR', armR: 'armL', elbowL: 'elbowR', elbowR: 'elbowL', legL: 'legR', legR: 'legL', kneeL: 'kneeR', kneeR: 'kneeL' };
  for (const k in p) { const v = p[k]; const k2 = sw[k] || k; if (['torso', 'head', 'body'].includes(k)) o[k2] = [v[0], -v[1], -v[2]]; else if (k === 'sway') o[k] = [-v[0], v[1]]; else o[k2] = Array.isArray(v) ? [...v] : v; }
  return o;
}

// ---------- named static poses (usable as act {do:'pose', pose:'tpose'} or inside clips) ----------
export const POSES = {
  stand: {},
  // fists up by the chin, elbows down, slight stance
  guard: { torso: [8, -12, 0], head: [6, 10, 0], armR: [72, -28, -14], elbowR: 67, armL: [91, -54, -8], elbowL: 40, legL: [14, 0, 5], kneeL: 16, legR: [-12, 0, 5], kneeR: 14 },
  // chair sit: `air` lifts the thighs' underside to ~y 1.05 (items.js chair seat top 0.95 + 0.11); feet dangle a little
  sit: { torso: [-4, 0, 0], legL: [88, 0, 5], legR: [88, 0, 5], kneeL: 82, kneeR: 82, armL: [26, -20, -6], armR: [26, -20, -6], elbowL: 44, elbowR: 44, air: 0.5 },
  sitFloor: { torso: [-14, 0, 0], head: [8, 0, 0], legL: [92, 0, 12], legR: [92, 0, 12], kneeL: 6, kneeR: 6, armL: [-38, 0, 16], armR: [-38, 0, 16], elbowL: 0, elbowR: 0 },
  lieBack: { body: [-90, 0, 0], head: [2, 0, 0], armL: [6, 0, 62], armR: [6, 0, 62], elbowL: 8, elbowR: 8, legL: [0, 0, 12], legR: [0, 0, 12], kneeL: 4, kneeR: 4 },
  lieFront: { body: [90, 0, 0], head: [-4, 24, 0], armL: [174, 0, 34], armR: [174, 0, 34], elbowL: 0, elbowR: 0, legL: [0, 0, 10], legR: [0, 0, 10], kneeL: 0, kneeR: 0 },
  crouch: { torso: [28, 0, 0], head: [-18, 0, 0], legL: [55, 0, 8], legR: [55, 0, 8], kneeL: 100, kneeR: 100, armL: [30, 0, 8], armR: [30, 0, 8], elbowL: 40, elbowR: 40 },
  tpose: { armL: [0, 0, 90], armR: [0, 0, 90], elbowL: 0, elbowR: 0 },
  handsUp: { armL: [0, 0, 165], armR: [0, 0, 165], elbowL: 10, elbowR: 10 },
  armsCrossed: { armL: [52, -69, -35], elbowL: 29, armR: [50, -71, -36], elbowR: 14, head: [-4, 0, 0], torso: [-3, 0, 0] },
  handsOnHips: { armL: [-2, -72, 21], armR: [-2, -72, 21], elbowL: 64, elbowR: 64, torso: [-3, 0, 0], legL: [0, 0, 6], legR: [0, 0, 6] },
  point: { armR: [88, 0, -4], elbowR: 0, torso: [0, -8, 0] },
  // biceps: upper arms out level, forearms twisted (yaw 90) so the elbow bend points UP
  flex: { armL: [-7, 90, 104], armR: [-7, 90, 104], elbowL: 95, elbowR: 95, torso: [-5, 0, 0], head: [-6, 0, 0], legL: [0, 0, 7], legR: [0, 0, 7] },
  pray: { armL: [74, -37, -24], armR: [74, -37, -24], elbowL: 41, elbowR: 41, head: [16, 0, 0], torso: [4, 0, 0] },
  salute: { armR: [133, -71, -9], elbowR: 62, torso: [-3, 0, 0], head: [-3, 0, 0] },
  think: { armR: [64, -48, -48], elbowR: 51, armL: [50, -91, -45], elbowL: 17, head: [-6, 8, 10], torso: [3, 0, 0] },
  facepalm: { armR: [92, -45, -38], elbowR: 51, head: [18, 0, -4], torso: [8, 0, 0], armL: [4, 0, 6], elbowL: 10 },
  phone: { armR: [94, -36, -28], elbowR: 126, head: [0, -6, -10], armL: [-5, 0, 8], elbowL: 10 },
  cry: { armL: [83, -31, -37], armR: [83, -31, -37], elbowL: 67, elbowR: 67, head: [18, 0, 0], torso: [14, 0, 0] },
  dab: { torso: [12, -10, 10], head: [28, -30, 0], armR: [150, -66, -14], elbowR: 58, armL: [0, 0, 128], elbowL: 0, legL: [0, 0, 10], legR: [0, 0, 4] },
  kneel: { legL: [60, 0, 4], kneeL: 62, legR: [-8, 0, 4], kneeR: 96, armL: [24, -1, -24], elbowL: 10, armR: [4, 0, 6], elbowR: 12, torso: [4, 0, 0], head: [6, 0, 0] },
  tired: { torso: [38, 0, 0], head: [-30, 0, 0], legL: [28, 0, 8], legR: [28, 0, 8], kneeL: 40, kneeR: 40, armL: [33, 0, -25], armR: [33, 0, -25], elbowL: 4, elbowR: 4 },
  fly: { body: [80, 0, 0], head: [-60, 0, 0], armR: [175, 0, 6], elbowR: 0, armL: [-5, 0, 14], legL: [0, 0, 3], legR: [-4, 0, 3], kneeR: 12, ground: false },
  hang: { armL: [0, 0, 172], armR: [0, 0, 172], elbowL: 8, elbowR: 8, legL: [5, 0, 3], legR: [-5, 0, 3], kneeL: 12, kneeR: 18, ground: false },
};
const P = POSES;

// ---------- locomotion ----------
function walkPose(ph, k = 1, o = {}) {
  const sw = o.legA ?? 28, ar = o.armA ?? 24;
  return {
    legL: [sw * S(ph) * k, 0, 1], legR: [-sw * S(ph) * k, 0, 1],
    kneeL: 4 + (o.kneeA ?? 42) * mx(0, C(ph)) ** 1.4 * k + (o.knee0 || 0), kneeR: 4 + (o.kneeA ?? 42) * mx(0, -C(ph)) ** 1.4 * k + (o.knee0 || 0),
    armL: [-ar * S(ph) * k + (o.arm0 || 0), 0, 5], armR: [ar * S(ph) * k + (o.arm0 || 0), 0, 5], elbowL: (o.elbow ?? 14) + 10 * mx(0, -S(ph)), elbowR: (o.elbow ?? 14) + 10 * mx(0, S(ph)),
    torso: [(o.lean ?? 4), 6 * S(ph) * k, 0], head: [-(o.lean ?? 4) * 0.6, -5 * S(ph) * k, 0], sway: [0.06 * C(ph) * k, 0], air: (o.air || 0) * mx(0, -C(2 * ph)) * k,
  };
}
const rampTravel = (dur) => (u) => { const a = Math.min(0.2 / Math.max(dur, 0.01), 0.3); if (u < a) return (u * u) / (2 * a) / (1 - a); if (u > 1 - a) return 1 - ((1 - u) ** 2) / (2 * a) / (1 - a); return (u - a / 2) / (1 - a); };

export const CLIPS = {
  idle: { dur: 2, loop: true, fn: (lt, c) => { const b = S(c.t * 2.1 + c.seed); return { torso: [1 + b, noise(c.t * 0.3, c.seed) * 3, 0], head: [-1 + noise(c.t * 0.4, c.seed + 2) * 3, noise(c.t * 0.25, c.seed + 5) * 10, noise(c.t * 0.3, c.seed + 7) * 3], armL: [2 + b, 0, 5 + b * 1.5], armR: [2 - b, 0, 5 + b * 1.5], elbowL: 8, elbowR: 8, legL: [0, 0, 2], legR: [0, 0, 2], kneeL: 3, kneeR: 3, sway: [noise(c.t * 0.35, c.seed + 9) * 0.07, 0] }; } },
  walk: { loco: { speed: 6, stride: 5.6 }, fn: (lt, c) => walkPose(c.phase, 1, { legA: 26 }) },
  run: { loco: { speed: 14, stride: 9.2 }, fn: (lt, c) => walkPose(c.phase, 1, { legA: 42, kneeA: 100, knee0: 14, armA: 58, elbow: 85, lean: 14, air: 0.35 }) },
  sprint: { loco: { speed: 20, stride: 11.6 }, fn: (lt, c) => walkPose(c.phase, 1, { legA: 52, kneeA: 115, knee0: 18, armA: 70, elbow: 90, lean: 22, air: 0.5 }) },
  sneak: { loco: { speed: 3, stride: 4.4 }, expr: 'determined', fn: (lt, c) => ({ ...walkPose(c.phase, 1, { legA: 20, kneeA: 40, knee0: 40, armA: 10, arm0: 30, elbow: 70, lean: 26 }), head: [-20, 0, 0] }) },
  backstep: { loco: { speed: 3, stride: 4.6 }, back: true, fn: (lt, c) => walkPose(-c.phase, 0.8) },
  scaredRun: { loco: { speed: 15, stride: 9.6 }, expr: 'scared', fn: (lt, c) => ({ ...walkPose(c.phase, 1, { legA: 44, kneeA: 100, knee0: 14, armA: 20, elbow: 20, lean: 10, air: 0.35 }), armL: [10 + 30 * S(c.phase * 2), 0, 150], armR: [10 - 30 * S(c.phase * 2), 0, 150] }) },
  swim: { loco: { speed: 5, stride: 5 }, fn: (lt, c) => ({ body: [75, 0, 0], head: [-55, 0, 0], armL: [150 + 40 * S(c.phase), 0, 25], armR: [150 - 40 * S(c.phase), 0, 25], legL: [12 * S(c.phase * 2), 0, 4], legR: [-12 * S(c.phase * 2), 0, 4], ground: false, air: 0 }) },
  fly: { loco: { speed: 18, stride: 30 }, fn: (lt, c) => ({ ...P.fly, legL: [3 * S(c.t * 3), 0, 3], cape: 70 }) },
  // ---------- jumps / falls ----------
  jump: { dur: 1.0, impact: 0.82, travel: u => clamp((u - 0.28) / 0.52), loco: { speed: 10 }, fn: (lt, c) => {
    const u = c.u, h = c.act.h ?? (c.act.to ? 3 : 4), v = clamp((u - 0.28) / 0.52);
    const p = kp(u, [[0, {}], [0.2, { torso: [22, 0, 0], legL: [30, 0, 4], legR: [30, 0, 4], kneeL: 60, kneeR: 60, armL: [-35, 0, 10], armR: [-35, 0, 10], elbowL: 10, elbowR: 10 }], [0.3, { torso: [-4, 0, 0], armL: [160, 0, 12], armR: [160, 0, 12], legL: [-6, 0, 2], legR: [-6, 0, 2], kneeL: 6, kneeR: 6 }], [0.55, { torso: [6, 0, 0], armL: [120, 0, 30], armR: [120, 0, 30], legL: [28, 0, 4], legR: [10, 0, 4], kneeL: 48, kneeR: 32 }], [0.8, { armL: [60, 0, 30], armR: [60, 0, 30], legL: [12, 0, 4], legR: [8, 0, 4], kneeL: 12, kneeR: 10 }], [0.88, { torso: [20, 0, 0], legL: [35, 0, 6], legR: [35, 0, 6], kneeL: 70, kneeR: 70, armL: [30, 0, 20], armR: [30, 0, 20] }], [1, {}]]);
    p.air = u > 0.28 && u < 0.8 ? 4 * h * v * (1 - v) : 0; return p; } },
  fall: { dur: 1.0, hold: true, impact: 0.72, expr: 'hurt', fn: (lt, c) => { const p = kp(c.u, [[0, {}], [0.22, { torso: [-18, 0, 0], head: [-15, 0, 0], armL: [50, 0, 60], armR: [50, 0, 60], legL: [-8, 0, 4], legR: [12, 0, 4], kneeL: 20 }], [0.72, P.lieBack, ease.in], [0.82, { ...P.lieBack, body: [-82, 0, 0], legL: [20, 0, 12], legR: [14, 0, 12] }], [1, P.lieBack]]); return p; } },
  faceplant: { dur: 0.9, hold: true, impact: 0.7, expr: 'dizzy', fn: (lt, c) => kp(c.u, [[0, {}], [0.2, { torso: [20, 0, 0], armL: [-30, 0, 30], armR: [-30, 0, 30], legL: [-20, 0, 3] }], [0.7, P.lieFront, ease.in], [0.8, { ...P.lieFront, body: [82, 0, 0] }], [1, P.lieFront]]) },
  knockback: { dur: 0.85, hold: true, impact: 0.78, expr: 'hurt', back: true, travel: u => ease.out(clamp(u / 0.8)), fn: (lt, c) => { const p = kp(c.u, [[0, { torso: [-25, 10, 0], head: [-30, 0, 0], armL: [70, 0, 40], armR: [70, 0, 40] }], [0.4, { body: [-50, 0, 0], torso: [-10, 0, 0], head: [-20, 0, 0], armL: [120, 0, 60], armR: [110, 0, 60], legL: [40, 0, 10], legR: [20, 0, 10], kneeL: 40, kneeR: 20 }], [0.78, P.lieBack, ease.in], [0.86, { ...P.lieBack, body: [-80, 0, 0] }], [1, P.lieBack]]); const v = clamp(c.u / 0.78); p.air = 4 * (c.act.h ?? 1.6) * v * (1 - v); return p; } },
  getUp: { dur: 1.3, fn: (lt, c) => kp(c.u, [[0, c.act.from === 'front' ? P.lieFront : P.lieBack], [0.35, c.act.from === 'front' ? { body: [60, 0, 0], armL: [90, 0, 10], armR: [90, 0, 10], legL: [60, 0, 5], legR: [60, 0, 5], kneeL: 110, kneeR: 110 } : { body: [-40, 0, 0], torso: [25, 0, 0], armL: [-40, 0, 20], armR: [-40, 0, 20], legL: [70, 0, 6], legR: [60, 0, 6], kneeL: 110, kneeR: 90 }], [0.7, P.crouch], [1, {}]]) },
  lie: { dur: 1, hold: true, fn: () => P.lieBack },
  sleep: { dur: 1, hold: true, expr: 'sleepy', fn: (lt, c) => ({ ...P.lieBack, armL: [0, 0, 20], armR: [0, 0, 20], torso: [S(c.t * 1.4) * 1.5, 0, 0] }) },
  oof: { dur: 2.5, hold: true, expr: 'dead', fn: (lt) => ({ oof: lt }) },
  // ---------- fighting ----------
  punch: { dur: 0.55, impact: 0.42, expr: 'angry', fn: (lt, c) => side(c, kp(c.u, [[0, P.guard], [0.3, { ...P.guard, armR: [40, 0, 12], elbowR: 118, torso: [6, -28, 0], head: [6, 24, 0] }], [0.42, { ...P.guard, armR: [88, 0, -8], elbowR: 0, torso: [12, 28, 0], head: [8, -22, 0], legL: [24, 0, 5], kneeL: 18, armL: [62, -40, -8], elbowL: 105 }, ease.out], [0.62, { ...P.guard, armR: [86, 0, -8], elbowR: 6, torso: [10, 24, 0], head: [8, -18, 0], legL: [22, 0, 5], armL: [62, -40, -8], elbowL: 105 }], [1, P.guard]])) },
  uppercut: { dur: 0.6, impact: 0.45, expr: 'furious', fn: (lt, c) => side(c, kp(c.u, [[0, P.guard], [0.32, { ...P.guard, torso: [22, -18, 0], head: [-8, 16, 0], armR: [-10, 0, 12], elbowR: 100, legL: [30, 0, 5], kneeL: 50, legR: [10, 0, 5], kneeR: 45 }], [0.45, { ...P.guard, torso: [-12, 22, 0], head: [-10, -16, 0], armR: [160, 0, -12], elbowR: 40, legL: [6, 0, 5], legR: [-14, 0, 5], kneeR: 30, air: 0.4 }, ease.out], [0.65, { ...P.guard, torso: [-10, 16, 0], head: [-8, -12, 0], armR: [150, 0, -10], elbowR: 40 }], [1, P.guard]])) },
  kick: { dur: 0.75, impact: 0.45, expr: 'angry', fn: (lt, c) => side(c, kp(c.u, [[0, P.guard], [0.28, { ...P.guard, torso: [-4, -6, 0], legR: [70, 0, 0], kneeR: 115, legL: [0, 0, 2], kneeL: 12 }], [0.45, { torso: [-22, 10, 0], head: [12, -8, 0], legR: [88, 0, -4], kneeR: 0, legL: [-4, 0, 2], kneeL: 10, armL: [40, 0, 55], elbowL: 30, armR: [-25, 0, 45], elbowR: 30 }, ease.out], [0.65, { torso: [-18, 8, 0], head: [10, -6, 0], legR: [80, 0, 0], kneeR: 15, armL: [40, 0, 50], armR: [-20, 0, 40] }], [1, P.guard]])) },
  slash: { dur: 0.65, impact: 0.45, expr: 'angry', fn: (lt, c) => side(c, kp(c.u, [[0, P.guard], [0.3, { ...P.guard, armR: [165, 0, 20], elbowR: 40, torso: [-8, -26, 0], head: [0, 20, 0] }], [0.45, { ...P.guard, armR: [42, 0, -32], elbowR: 0, torso: [16, 32, 0], head: [4, -24, 0], legL: [25, 0, 5], kneeL: 20 }, ease.out], [0.7, { ...P.guard, armR: [32, 0, -26], elbowR: 5, torso: [14, 26, 0], head: [4, -20, 0], legL: [22, 0, 5] }], [1, P.guard]])) },
  block: { dur: 1, hold: false, fn: (lt, c) => ({ ...P.guard, armL: [95, 0, -28], armR: [95, 0, -28], elbowL: 125, elbowR: 125, torso: [10, 0, 0], head: [12, 0, 0] }) },
  hit: { dur: 0.6, impact: 0.0, expr: 'hurt', back: true, travel: u => ease.out(clamp(u / 0.4)), fn: (lt, c) => kp(c.u, [[0, {}], [0.18, { torso: [-24, 18, 8], head: [-28, 12, 6], armL: [30, 0, 40], armR: [25, 0, 35], elbowL: 30, elbowR: 30, legL: [-14, 0, 4], kneeL: 20, legR: [10, 0, 4] }, ease.out], [0.45, { torso: [-10, 8, 4], head: [-8, 5, 2], armL: [15, 0, 20], armR: [10, 0, 20] }], [1, {}]]) },
  stagger: { dur: 1.2, expr: 'dizzy', fn: (lt, c) => ({ torso: [10 * S(lt * 5), 8 * S(lt * 3), 12 * S(lt * 4)], head: [10 * S(lt * 6), 15 * S(lt * 4), 10 * S(lt * 5)], armL: [20, 0, 30 + 15 * S(lt * 6)], armR: [20, 0, 30 + 15 * S(lt * 5)], legL: [10 * S(lt * 4), 0, 6], legR: [-10 * S(lt * 4), 0, 6], kneeL: 20, kneeR: 20, sway: [0.4 * S(lt * 3), 0] }) },
  // ---------- gestures (upper-body capable) ----------
  wave: { dur: 2, loop: true, upper: true, expr: 'happy', fn: (lt) => ({ armR: [12, 0, 150 + 14 * S(lt * 10)], elbowR: 28 + 18 * S(lt * 10 + 1), torso: [0, -4, 3], head: [0, -6, 8] }) },
  point: { dur: 1.6, upper: true, fn: (lt, c) => side(c, { ...P.point, head: [0, -6, 0] }) },
  cheer: { dur: 2, loop: true, expr: 'happy', fn: (lt) => ({ armL: [10, 0, 155 + 12 * S(lt * 13)], armR: [10, 0, 155 + 12 * S(lt * 13 + 1.5)], elbowL: 15, elbowR: 15, head: [-12, 0, 0], torso: [-5, 0, 0], air: 0.55 * ab(S(lt * Math.PI * 2.2)), kneeL: 10 + 20 * (1 - ab(S(lt * Math.PI * 2.2))), kneeR: 10 + 20 * (1 - ab(S(lt * Math.PI * 2.2))) }) },
  clap: { dur: 1.6, loop: true, upper: true, expr: 'happy', fn: (lt) => { const k = ab(C(lt * 10)) ** 0.6; return { armL: [58, -21, -30 * k], armR: [58, -21, -30 * k], elbowL: 34 - 9 * k, elbowR: 34 - 9 * k, head: [-4, 0, 0], torso: [-2 + 2 * k, 0, 0] }; } },
  facepalm: { dur: 1.8, upper: true, expr: 'bored', fn: (lt, c) => side(c, { ...P.facepalm, head: [18 + 2 * S(lt * 3), 3 * S(lt * 5), -4], torso: [8 + 2 * S(lt * 3), 0, 0] }) },
  shrug: { dur: 1.4, upper: true, expr: 'smug', fn: (lt, c) => { const k = ease.inOut(clamp(lt / 0.3)) * (1 - ease.inOut(clamp((lt - c.dur + 0.35) / 0.35))); return { armL: [4 + 15 * k, 28 * k, 4 + 29 * k], armR: [4 + 15 * k, 28 * k, 4 + 29 * k], elbowL: 8 + 36 * k, elbowR: 8 + 36 * k, head: [-4 * k, 0, 14 * k], torso: [-4 * k, 0, 0] }; } },
  think: { dur: 2.5, upper: true, expr: 'thinking', fn: (lt, c) => side(c, { ...P.think, head: [-6 + 3 * S(lt * 2), 8, 10], elbowR: 51 + 4 * S(lt * 2) }) },
  talk: { dur: 2.5, loop: true, upper: true, say: true, fn: (lt, c) => { const n = (k) => noise(c.t * 1.4, c.seed + k); return { armR: [22 + 16 * n(1), 0, 8 + 8 * n(2)], elbowR: 55 + 30 * n(3), armL: [14 + 10 * n(4), 0, 6 + 5 * n(5)], elbowL: 35 + 25 * n(6), head: [2 + 4 * n(7), 10 * n(8), 5 * n(9)], torso: [2, 5 * n(10), 0] }; } },
  shout: { dur: 1.5, upper: true, say: true, expr: 'furious', fn: (lt, c) => ({ armL: [40, 0, 40], armR: [40, 0, 40], elbowL: 60, elbowR: 60, torso: [12 + 4 * S(lt * 9), 0, 0], head: [-10, 0, 0] }) },
  phone: { dur: 3, upper: true, say: true, fn: (lt, c) => side(c, { ...P.phone, head: [2 * S(lt * 2.3), -6, -10] }) },
  nod: { dur: 1.2, upper: true, fn: (lt) => ({ head: [12 * S(lt * 9), 0, 0] }) },
  headShake: { dur: 1.2, upper: true, fn: (lt) => ({ head: [0, 28 * S(lt * 10), 0] }) },
  lookAround: { dur: 3, upper: true, expr: 'worried', fn: (lt) => ({ head: [-4, 55 * S(lt * 1.6), 0], torso: [0, 15 * S(lt * 1.6), 0] }) },
  laugh: { dur: 2, loop: true, expr: 'laugh', fn: (lt) => ({ torso: [-12 + 8 * S(lt * 15), 0, 0], head: [-18 + 6 * S(lt * 15), 0, 0], armL: [22, 0, -26], armR: [22, 0, -26], elbowL: 85, elbowR: 85, kneeL: 6 + 4 * S(lt * 15), kneeR: 6 + 4 * S(lt * 15) }) },
  cry: { dur: 2.5, loop: true, expr: 'cry', fn: (lt) => { const sob = ab(S(lt * 9)); return { ...P.cry, torso: [14 + 4 * sob, 0, 0], kneeL: 6 + 4 * sob, kneeR: 6 + 4 * sob }; } },
  scared: { dur: 2, loop: true, expr: 'scared', fn: (lt, c) => ({ ...P.crouch, legL: [35, 0, 10], legR: [35, 0, 10], kneeL: 60, kneeR: 60, torso: [18, 0, 0], armL: [110, 0, -20], armR: [110, 0, -20], elbowL: 125, elbowR: 125, head: [10, 0, 0], sway: [0.05 * S(c.t * 47), 0] }) },
  dizzy: { dur: 2, loop: true, expr: 'dizzy', fn: (lt) => ({ torso: [8 * S(lt * 4), 0, 8 * C(lt * 4)], head: [10 * S(lt * 4 + 1), 0, 12 * C(lt * 4 + 1)], armL: [10, 0, 25], armR: [10, 0, 25], sway: [0.25 * S(lt * 4), 0.25 * C(lt * 4)] }) },
  victory: { dur: 2, expr: 'happy', fn: (lt, c) => kp(c.u, [[0, {}], [0.12, { ...P.crouch, armL: [-20, 0, 20], armR: [-20, 0, 20], elbowL: 10, elbowR: 10, head: [0, 0, 0] }], [0.28, { ...P.handsUp, torso: [-8, 0, 0], head: [-15, 0, 0], legL: [-6, 0, 4], legR: [10, 0, 4], kneeR: 40, air: 1.4 }, ease.out], [0.45, { ...P.flex, legL: [12, 0, 7], legR: [12, 0, 7], kneeL: 30, kneeR: 30 }, ease.in], [0.55, P.flex], [1, { ...P.flex, elbowL: 105, elbowR: 85 }]]) },
  flex: { dur: 2, expr: 'cool', fn: (lt) => { const k = S(lt * 5); return { ...P.flex, elbowL: 95 + 12 * k, elbowR: 95 - 12 * k, torso: [-5, 6 * k, 0], head: [-6, -6 * k, 0] }; } },
  bow: { dur: 1.6, fn: (lt, c) => kp(c.u, [[0, {}], [0.35, { torso: [50, 0, 0], head: [10, 0, 0], armL: [-10, 0, 4], armR: [-10, 0, 4] }], [0.7, { torso: [50, 0, 0], head: [10, 0, 0] }], [1, {}]]) },
  salute: { dur: 1.6, upper: true, expr: 'determined', fn: () => P.salute },
  stretch: { dur: 2.2, expr: 'sleepy', fn: (lt, c) => kp(c.u, [[0, {}], [0.4, { armL: [0, 0, 168], armR: [0, 0, 168], elbowL: 15, elbowR: 15, torso: [-14, 0, 0], head: [-20, 0, 0] }], [0.75, { armL: [0, 0, 168], armR: [0, 0, 168], torso: [-14, 0, 6], head: [-20, 0, 6] }], [1, {}]]) },
  dance: { dur: 4, loop: true, expr: 'happy', fn: (lt) => { const w = lt * Math.PI * 4; return { armL: [45 + 45 * S(w), 0, 30], armR: [45 - 45 * S(w), 0, 30], elbowL: 90, elbowR: 90, torso: [4, 10 * S(w / 2), 8 * S(w)], head: [0, 0, -8 * S(w)], kneeL: 18 + 18 * ab(S(w)), kneeR: 18 + 18 * ab(C(w)), legL: [10 * ab(S(w)), 0, 6], legR: [10 * ab(C(w)), 0, 6], sway: [0.35 * S(w / 2), 0] }; } },
  dance2: { dur: 4, loop: true, expr: 'grin', fn: (lt) => { const w = lt * Math.PI * 4; return { armL: [0, 0, 130 + 30 * S(w)], armR: [0, 0, 130 - 30 * S(w)], elbowL: 30 + 30 * S(w), elbowR: 30 - 30 * S(w), torso: [0, 25 * S(w / 2), 0], kneeL: 25 + 25 * S(w), kneeR: 25 - 25 * S(w), legL: [15 + 15 * S(w), 0, 10], legR: [15 - 15 * S(w), 0, 10], air: 0.2 * ab(S(w)) }; } },
  floss: { dur: 3, loop: true, expr: 'grin', fn: (lt) => { const w = lt * Math.PI * 3, s = S(w); return { armL: [-34 * s, 0, 12 + 46 * s], armR: [34 * s, 0, 12 - 46 * s], elbowL: 4, elbowR: 4, torso: [0, 0, -5 * s], head: [0, 0, 6 * s], legL: [0, 0, 4 - 6 * s], legR: [0, 0, 4 + 6 * s], sway: [-0.35 * s, 0] }; } },
  spin: { dur: 1, fn: (lt, c) => ({ body: [0, 360 * ease.inOut(c.u) * (c.act.turns || 1), 0], armL: [0, 0, 70], armR: [0, 0, 70] }) },
  // ---------- interactions ----------
  pickUp: { dur: 1.0, attach: 0.45, fn: (lt, c) => side(c, kp(c.u, [[0, {}], [0.45, { torso: [65, 0, 0], head: [-20, 0, 0], legL: [35, 0, 6], legR: [35, 0, 6], kneeL: 55, kneeR: 55, armR: [30, 0, 0], elbowR: 10, armL: [20, 0, 10] }], [1, { armR: [38, 0, -6], elbowR: 72 }]])) },
  hold: { dur: 1, hold: true, upper: true, fn: (lt, c) => side(c, { armR: [38, 0, -6], elbowR: 72 }) },
  throw: { dur: 0.8, release: 0.5, impact: 0.5, fn: (lt, c) => side(c, kp(c.u, [[0, { armR: [38, 0, -6], elbowR: 72 }], [0.38, { armR: [-70, 0, 25], elbowR: 80, torso: [-6, -32, 0], head: [0, 26, 0], armL: [40, 0, 10], legL: [22, 0, 4], kneeL: 12 }], [0.5, { armR: [140, 0, 0], elbowR: 10, torso: [16, 28, 0], head: [4, -22, 0], armL: [-20, 0, 15], legL: [28, 0, 4], kneeL: 25 }, ease.out], [0.7, { armR: [110, 0, -10], elbowR: 10, torso: [14, 22, 0], head: [4, -18, 0] }], [1, {}]])) },
  push: { dur: 0.7, impact: 0.45, fn: (lt, c) => kp(c.u, [[0, {}], [0.3, { armL: [70, 0, 0], armR: [70, 0, 0], elbowL: 100, elbowR: 100, torso: [5, 0, 0] }], [0.45, { armL: [88, 0, -4], armR: [88, 0, -4], elbowL: 10, elbowR: 10, torso: [20, 0, 0], legL: [25, 0, 4], kneeL: 20, legR: [-20, 0, 4] }, ease.out], [0.7, { armL: [85, 0, -4], armR: [85, 0, -4], elbowL: 15, elbowR: 15, torso: [16, 0, 0] }], [1, {}]]) },
  highFive: { dur: 1.0, impact: 0.45, expr: 'happy', fn: (lt, c) => side(c, kp(c.u, [[0, {}], [0.3, { armR: [130, 0, -14], elbowR: 40, torso: [-4, 8, 0], head: [-6, -6, 0] }], [0.45, { armR: [140, 0, -20], elbowR: 8, torso: [6, 12, 0], head: [-4, -8, 0], legL: [18, 0, 4], kneeL: 10 }, ease.out], [0.7, { armR: [130, 0, -14], elbowR: 20, torso: [2, 8, 0] }], [1, {}]])) },
  hug: { dur: 2, expr: 'happy', fn: (lt, c) => kp(c.u, [[0, {}], [0.25, { armL: [80, 0, -28], armR: [80, 0, -28], elbowL: 60, elbowR: 60, torso: [8, 0, 0], head: [6, 15, 0] }], [0.8, { armL: [80, 0, -32], armR: [80, 0, -32], elbowL: 70, elbowR: 70, torso: [8, 0, 0], head: [6, 15, 0] }], [1, {}]]) },
  handshake: { dur: 1.6, fn: (lt, c) => ({ armR: [55, 0, -12], elbowR: 30 + 10 * S(lt * 12), torso: [4, 0, 0] }) },
  type: { dur: 2, loop: true, upper: true, fn: (lt, c) => ({ armL: [52 + 4 * S(lt * 23), 0, -12], armR: [52 + 4 * S(lt * 19 + 1), 0, -12], elbowL: 60, elbowR: 60, head: [14, 0, 0] }) },
  eat: { dur: 2, loop: true, upper: true, fn: (lt) => { const k = ease.inOut(ab(S(lt * 3))); return { armR: [lerp(41, 96, k), lerp(-26, -57, k), lerp(-10, -40, k)], elbowR: lerp(49, 39, k), head: [4 - 4 * k, 0, 0] }; } },
  climb: { loco: { speed: 3, stride: 2 }, fn: (lt, c) => ({ armL: [175 - 25 * S(c.phase), 0, 10], armR: [175 + 25 * S(c.phase), 0, 10], elbowL: 30 + 30 * S(c.phase), elbowR: 30 - 30 * S(c.phase), legL: [35 + 30 * S(c.phase), 0, 6], legR: [35 - 30 * S(c.phase), 0, 6], kneeL: 60 + 30 * S(c.phase), kneeR: 60 - 30 * S(c.phase), ground: false }) },
  sit: { dur: 1, hold: true, fn: () => P.sit },
  sitFloor: { dur: 1, hold: true, fn: () => P.sitFloor },
  crouch: { dur: 1, hold: true, fn: () => P.crouch },
  standUp: { dur: 0.8, fn: (lt, c) => kp(c.u, [[0, P.sit], [0.5, { torso: [30, 0, 0], legL: [40, 0, 5], legR: [40, 0, 5], kneeL: 50, kneeR: 50 }], [1, {}]]) },
  dab: { dur: 1.4, expr: 'cool', fn: (lt, c) => side(c, kp(c.u, [[0, {}], [0.16, P.dab, ease.out], [0.8, { ...P.dab, head: [30, -32, 0] }], [1, {}]])) },
  kneel: { dur: 1.2, hold: true, fn: (lt, c) => side(c, kp(c.u, [[0, {}], [0.45, { ...P.crouch, torso: [12, 0, 0], head: [0, 0, 0], legR: [20, 0, 4], kneeR: 110, legL: [70, 0, 4], kneeL: 90 }], [1, P.kneel]])) },
  lookUp: { dur: 2.5, upper: true, expr: 'surprised', fn: (lt, c) => ({ head: [-42 + 3 * S(lt * 1.5), 6 * S(lt * 0.9), 0], torso: [-8, 0, 0], armL: [6, 0, 10], armR: [6, 0, 10], elbowL: 14, elbowR: 14 }) },
  scratchHead: { dur: 2, upper: true, expr: 'thinking', fn: (lt, c) => { const k = S(lt * 18); return side(c, { armR: [165 + 4 * k, -70, -1], elbowR: 62 + 7 * k, head: [-4, -6, -10], torso: [0, -4, 0], armL: [4, 0, 6] }); } },
  yawn: { dur: 2.6, expr: 'sleepy', fn: (lt, c) => kp(c.u, [[0, {}], [0.3, { armL: [8, 0, 150], armR: [8, 0, 150], elbowL: 30, elbowR: 30, torso: [-10, 0, 0], head: [-26, 0, 0], kneeL: 4, kneeR: 4 }], [0.55, { armL: [6, 0, 158], armR: [6, 0, 158], elbowL: 22, elbowR: 22, torso: [-12, 0, 0], head: [-28, 0, 0] }], [0.75, { armR: [86, -34, -52], elbowR: 49, head: [-20, 0, 0], torso: [-6, 0, 0], armL: [4, 0, 8] }], [1, {}]]) },
  sad: { dur: 3, loop: true, expr: 'sad', fn: (lt, c) => { const b = S(c.t * 1.3 + c.seed); return { torso: [16 + 1.5 * b, 0, 0], head: [24 + 2 * b, noise(c.t * 0.2, c.seed) * 6, 4], armL: [6, 0, 1], armR: [6, 0, 1], elbowL: 6, elbowR: 6, legL: [0, 0, 1], legR: [0, 0, 1], kneeL: 8, kneeR: 8, sway: [0, -0.15] }; } },
  angry: { dur: 2.4, loop: true, expr: 'angry', fn: (lt, c) => { const w = lt * Math.PI * 2.6, sL = mx(0, S(w)) ** 2, sR = mx(0, -S(w)) ** 2, sh = S(c.t * 41) * 2; return { torso: [14, sh, 0], head: [-10, 0, sh], armL: [22 + 10 * sL, -20, 10], armR: [22 + 10 * sR, -20, 10], elbowL: 78 + 12 * sR, elbowR: 78 + 12 * sL, legL: [40 * sL, 0, 5], legR: [40 * sR, 0, 5], kneeL: 6 + 55 * sL, kneeR: 6 + 55 * sR }; } },
  celebrate: { dur: 2, loop: true, expr: 'happy', fn: (lt) => { const w = lt * Math.PI * 2.4, hop = ab(S(w)), pump = S(w * 2); return { armL: [12, 0, 150 + 14 * pump], armR: [12, 0, 150 - 14 * pump], elbowL: 20 + 15 * (1 - hop), elbowR: 20 + 15 * (1 - hop), head: [-16, 0, 6 * S(w)], torso: [-8, 0, 4 * S(w)], air: 1.1 * hop, legL: [10 * hop, 0, 6], legR: [24 * hop, 0, 6], kneeL: 10 + 30 * (1 - hop) + 20 * hop, kneeR: 10 + 30 * (1 - hop) + 45 * hop }; } },
  tired: { dur: 2.5, loop: true, expr: 'sleepy', fn: (lt, c) => { const b = ab(S(lt * 7)); return { ...P.tired, torso: [38 + 3 * b, 0, 0], head: [-30 + 2 * b, 0, 0], armL: [33 - 2 * b, 0, -25], armR: [33 - 2 * b, 0, -25] }; } },
  pose: { dur: 1, hold: true, fn: (lt, c) => P[c.act.pose] || c.act.pose || {} },
};
// left-handed variants (act.hand = 'L' or clip used with side 'L')
function side(c, p) { return c.side === 'L' ? mirror(p) : p; }

export function defineClip(name, clip) { CLIPS[name] = clip; }
export function definePose(name, pose) { POSES[name] = pose; }
export const isLoco = (name) => !!CLIPS[name]?.loco && !CLIPS[name]?.dur;
export const clipNames = () => Object.keys(CLIPS);
export { rampTravel };
