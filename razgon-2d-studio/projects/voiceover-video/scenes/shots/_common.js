// _common.js — helpers shared by the template shots (not auto-loaded).
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, alpha, shade, rr, circle, poly, seg, glow, text, FONTS } from '/engine/core.js';
import { camPath, travel, drift, camAdd } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import { kitchen, bedroom } from '../sets/home.js';
import { school, gym, track } from '../sets/school.js';
import { lab, street } from '../sets/city.js';
import { stageView, hallView } from '../sets/theater.js';
import { living, bank, party } from '../sets/mem.js';
import { cafe, market, hospital, music, fair, clinic, balcony } from '../sets/extra.js';

// set registry: name -> (g, t, cam, opts) => {GY, CX, M, rim}
export const SETS = {
  living: (g, t, c, o) => living(g, t, c, o),
  livingEve: (g, t, c, o) => living(g, t, c, { mood: 'dusk', ...o }),
  bank: (g, t, c, o) => bank(g, t, c, o),
  streetDay: (g, t, c, o) => street(g, t, c, { mood: 'day', ...o }),
  party: (g, t, c, o) => party(g, t, c, o),
  leoKitchen: (g, t, c, o) => kitchen(g, t, c, { mood: 'dusk', ...o }),
  kitchen: (g, t, c, o) => kitchen(g, t, c, o),
  kitchenEve: (g, t, c, o) => kitchen(g, t, c, { mood: 'dusk', ...o }),
  kitchenNight: (g, t, c, o) => kitchen(g, t, c, { mood: 'night', ...o }),
  bedroom: (g, t, c, o) => bedroom(g, t, c, o),
  class: (g, t, c, o) => school(g, t, c, { kind: 'class', ...o }),
  exam: (g, t, c, o) => school(g, t, c, { kind: 'exam', ...o }),
  chess: (g, t, c, o) => school(g, t, c, { kind: 'chess', ...o }),
  canteen: (g, t, c, o) => school(g, t, c, { kind: 'canteen', ...o }),
  library: (g, t, c, o) => school(g, t, c, { kind: 'library', ...o }),
  gym: (g, t, c, o) => gym(g, t, c, o),
  track: (g, t, c, o) => track(g, t, c, o),
  lab: (g, t, c, o) => lab(g, t, c, o),
  street: (g, t, c, o) => street(g, t, c, o),
  streetDusk: (g, t, c, o) => street(g, t, c, { mood: 'dusk', ...o }),
  stage: (g, t, c, o) => stageView(g, t, c, o),
  hall: (g, t, c, o) => hallView(g, t, c, o),
  cafe: (g, t, c, o) => cafe(g, t, c, o),
  market: (g, t, c, o) => market(g, t, c, o),
  hospital: (g, t, c, o) => hospital(g, t, c, o),
  music: (g, t, c, o) => music(g, t, c, o),
  fair: (g, t, c, o) => fair(g, t, c, o),
  clinic: (g, t, c, o) => clinic(g, t, c, o),
  clinicNight: (g, t, c, o) => clinic(g, t, c, { mood: 'night', ...o }),
  balcony: (g, t, c, o) => balcony(g, t, c, o),
  bedroomDay: (g, t, c, o) => bedroom(g, t, c, { mood: 'interiorWarm', ...o }),
  void: (g, t, c, o) => { const M = mood('void'); layer(g, c, 0.3, (g) => { g.fillStyle = M.sky[0]; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.45, E.W * 0.6, '#2a3a6a', 0.35); }); FX.dust(g, t, { count: 30, color: '#9fb6d8', a: 0.25 }); return { GY: E.H * 0.8, CX: E.W / 2, M, rim: [0, -1] }; },
};
export const drawSet = (g, t, name, cam, o = {}) => (SETS[name] || SETS.void)(g, t, cam, o || {});

// blurred, darkened location behind close-ups and inserts
export function bgBlur(g, t, set, so = {}, o = {}) {
  const cam = { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -120, r: 0 };
  blurLayer(g, o.blur ?? 14, (g) => drawSet(g, t, set, camAdd(cam, { x: t * (o.drift ?? 6) }), so)); veil(g, '#0c070c', o.veil ?? 0.38);
}
// local time (seconds into the shot) of a spoken word, or fallback
export function wt(info, word, fb = 0.3) { if (word == null) return fb; if (typeof word === 'number') return word; const w = wordTime(word, info.shot.start - 0.25); return w != null && w < info.shot.end + 0.2 ? w - info.shot.start : fb; }
export const COL = () => { const u = S().ui; return { gold: u.gold, cream: u.cream, accent: u.accent, good: u.good, blue: u.blueprint, text: u.text }; };

// camera presets: motivated moves with braking + organic drift. base = {x, y, z}
export function camPreset(name, t, dur, base = {}, amt = 1, seed = 1) {
  const z = base.z ?? 1, x = base.x ?? 0, y = base.y ?? 0, k = travel(t, 0, dur, { accel: 0.2, brake: 0.55 }), a = amt;
  let c;
  switch (name) {
    case 'pull': c = { z: z * (1 + 0.08 * a) - z * 0.08 * a * k, x: x + 30 * a * k, y }; break;
    case 'left': c = { z: z * (1 + 0.02 * a * k), x: x + 80 * a - 160 * a * k, y }; break;
    case 'right': c = { z: z * (1 + 0.02 * a * k), x: x - 80 * a + 160 * a * k, y }; break;
    case 'up': c = { z: z * (1 + 0.03 * a * k), x, y: y + 70 * a - 140 * a * k }; break;
    case 'down': c = { z: z * (1 + 0.03 * a * k), x, y: y - 70 * a + 140 * a * k }; break;
    case 'crash': { const kk = ease.out(prog(t, 0, Math.min(0.6, dur * 0.4))); c = { z: z * (1 + 0.22 * a * kk + 0.03 * k), x, y }; break; }
    case 'tilt': c = { z: z * (1 + 0.05 * a * k), x: x + 30 * a * k, y, r: -0.025 * a + 0.03 * a * k }; break;
    case 'hold': c = { z, x, y }; break;
    default: c = { z: z * (1 + 0.07 * a * k), x: x - 30 * a * k, y }; // push
  }
  return camAdd(c, drift(t, 5, seed));
}
// screen point -> world point on a given parallax depth
export function toWorld(X, Y, cam, d = 1) { const zd = 1 + ((cam.z ?? 1) - 1) * d; return [(X - E.W / 2) / zd + E.W / 2 + (cam.x || 0) * d, (Y - E.H / 2) / zd + E.H / 2 + (cam.y || 0) * d]; }

// time-stop look: cool tint, hanging droplets, rings, 10x badge
export function freezeLook(g, t, o = {}) {
  FX.drops(g, t, { count: o.count ?? 40, color: '#d8e4ff', rMax: 8, drift: 2 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  badgeTxt(g, o.badge ?? '100%', ease.out(prog(t, 0.15, 0.6)));
}
export function badgeTxt(g, str, a = 1) { text(g, str, E.W - 90, 110, { size: 40, color: COL().gold, glow: 18, glowColor: alpha(COL().gold, 0.6), align: 'right', alpha: a, font: FONTS.ui, weight: 900 }); }
export const fadeIO = (t, dur, i = 0.3, o = 0.3) => clamp(Math.min(t / i, (dur - t) / o));
