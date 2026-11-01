// engine/camera3d.js — cinematic virtual camera. Every shot has a `cam` spec; evalCam() turns it into position/look/fov.
// cam = {
//   shot:   'establish'|'wide'|'full'|'medium'|'mcu'|'close'|'ecu'|'ots'|'pov'|'top'|'low'|'high'   (framing preset)
//   target: 'max' | ['max','bob'] | [x,y,z] | 'spot:door'      (what to frame; 2 actors = two-shot / OTS pair)
//   move:   'static'|'push'|'pull'|'orbit'|'crane'|'rise'|'pan'|'follow'|'track'|'lead'|'dollyZoom'|'tilt'
//   az: 25 (deg around the subject; 0 = in front of the subject's face, 180 = behind, + = subject's left), el (deg up), dist, look (height on subject),
//   from: {az, el, dist, fov, look}, to: {...}      (explicit start/end, overrides the move preset)
//   keys: [[0, {...}], [0.5, {...}], [1, {...}]]    (u = fraction of the shot)
//   fov: 40, ease: 'inOut'|'sine'|'linear'|'out'|'in', rel: true (az relative to subject facing; false = world: az 0 looks from +Z)
//   handheld: 0.15 (0 = locked tripod), shake: true (auto on impacts) | 0.3 (constant) | [{at, amp, dur}], side: 1|-1 (OTS shoulder)
// }
import { THREE, D2R } from './r3d.js';
import { clamp, lerp, ease, noise } from './core.js';

export const SIZES = {
  establish: { dist: 48, el: 20, look: 3, fov: 45 },
  wide:   { dist: 28, el: 12, look: 2.6, fov: 40 },
  full:   { dist: 14, el: 6, look: 2.8, fov: 38 },
  medium: { dist: 10.5, el: 4, look: 3.5, fov: 36 },
  mcu:    { dist: 7, el: 3, look: 4.0, fov: 34 },
  close:  { dist: 4.2, el: 2, look: 4.5, fov: 32 },
  ecu:    { dist: 2.6, el: 0, look: 4.65, fov: 30 },
  top:    { dist: 24, el: 82, look: 1, fov: 40 },
  low:    { dist: 7.5, el: -14, look: 3.6, fov: 42 },
  high:   { dist: 14, el: 42, look: 2.5, fov: 38 },
  ots:    { dist: 0, el: 0, look: 4.4, fov: 36 },
  pov:    { dist: 0, el: 0, look: 4.6, fov: 55 },
};
const EASE = { inOut: ease.inOut, sine: ease.sine, linear: ease.linear, out: ease.out, in: ease.in };

// move presets -> [from, to] deltas applied to the base params
function movePreset(m, b, o) {
  const A = (x) => ({ ...b, ...x });
  switch (m) {
    case 'push': return [A({ dist: b.dist * 1.45 }), A({ dist: b.dist * 0.88 })];
    case 'pull': return [A({ dist: b.dist * 0.85 }), A({ dist: b.dist * 1.7, el: b.el + 6 })];
    case 'orbit': case 'arc': { const a = o.arc ?? 50; return [A({ az: b.az - a / 2 }), A({ az: b.az + a / 2 })]; }
    case 'crane': return [A({ el: b.el + 32, dist: b.dist * 1.25 }), A({})];
    case 'rise': return [A({ el: Math.max(-8, b.el - 6), dist: b.dist * 0.9 }), A({ el: b.el + 38, dist: b.dist * 1.5 })];
    case 'tilt': return [A({ look: b.look - 2.5 }), A({ look: b.look + 0.5 })];
    case 'dollyZoom': return [A({ dist: b.dist * 1.9, fov: b.fov }), A({ dist: b.dist * 0.75, fov: 2 * Math.atan(Math.tan(b.fov * D2R / 2) * 1.9 / 0.75) / D2R })];
    case 'lead': return [A({ az: 0 }), A({ az: 0, dist: b.dist * 0.9 })];
    default: return [A({}), A({})];
  }
}

const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
// rt: { point(target, t, look) -> Vector3 (subject point at height `look`), heading(target, t) -> rad, impacts: [{t}] }
export function evalCam(cam = {}, lt, dur, rt, t) {
  const sz = SIZES[cam.shot || 'medium'] || SIZES.medium;
  const multi = Array.isArray(cam.target) && typeof cam.target[0] === 'string' && cam.target.length > 1;
  const tg = cam.target ?? rt.defaultTarget;
  const b = { az: cam.az ?? (multi ? 0 : 25), el: cam.el ?? sz.el, dist: cam.dist ?? sz.dist, look: cam.look ?? sz.look, fov: cam.fov ?? sz.fov };
  let p0, p1, kfs = cam.keys;
  if (!kfs) { [p0, p1] = movePreset(cam.move || 'static', b, cam); p0 = { ...p0, ...(cam.from || {}) }; p1 = { ...p1, ...(cam.to || {}) }; }
  const e = EASE[cam.ease || (cam.move === 'orbit' || cam.move === 'track' ? 'sine' : 'inOut')] || ease.inOut;
  const u = clamp(lt / Math.max(dur, 0.01));
  let P;
  if (kfs) { const ks = kfs.map(([x, v]) => [x, { ...b, ...v }]); P = ks[0][1]; for (let i = 1; i < ks.length; i++) if (u <= ks[i][0] || i === ks.length - 1) { const k = e(clamp((u - ks[i - 1][0]) / Math.max(1e-4, ks[i][0] - ks[i - 1][0]))); P = {}; for (const kk in ks[i][1]) P[kk] = lerp(ks[i - 1][1][kk] ?? b[kk], ks[i][1][kk], k); break; } }
  else { const k = e(u); P = {}; for (const kk in p1) P[kk] = lerp(p0[kk] ?? b[kk], p1[kk], k); }
  const tPos = cam.move === 'pan' ? t - lt : t;   // pan: camera placed for the shot start, only the aim follows
  let look = new THREE.Vector3(), pos = new THREE.Vector3(), fov = P.fov;
  if (cam.shot === 'ots' || cam.shot === 'pov') {   // over-the-shoulder of A looking at B / point of view of A
    const [A, B] = cam.target; const a = rt.point(A, t, P.look), bb = rt.point(B, t, P.look);
    const dir = tmpA.copy(bb).sub(a); dir.y = 0; const d = dir.length(); dir.normalize(); const right = tmpB.set(-dir.z, 0, dir.x);
    if (cam.shot === 'ots') { const sd = cam.side ?? 1; pos.copy(a).addScaledVector(dir, -(cam.dist ?? 7)).addScaledVector(right, 3.2 * sd).add(new THREE.Vector3(0, 0.5 + (P.el || 0) * 0.05, 0)); look.copy(bb).addScaledVector(right, -0.6 * sd); }
    else { pos.copy(a).addScaledVector(dir, 0.7); look.copy(bb); }
    if (d < 0.01) look.copy(a).add(new THREE.Vector3(0, 0, 1));
  } else {
    const heading = cam.rel === false ? 0 : (multi ? pairHeading(rt, tg, t) : rt.heading(tg, t));
    const center = rt.point(tg, tPos, P.look);
    let dist = P.dist;
    if (multi) { const sep = pairSep(rt, tg, t); dist = Math.max(P.dist * 0.7, sep * 1.35 + 5); }
    const ang = heading + P.az * D2R, el = clamp(P.el, -80, 85) * D2R;
    pos.set(center.x + Math.sin(ang) * Math.cos(el) * dist, center.y + Math.sin(el) * dist, center.z + Math.cos(ang) * Math.cos(el) * dist);
    look.copy(cam.move === 'pan' ? rt.point(tg, t, P.look) : center);
    if (cam.lookOffset) look.add(new THREE.Vector3(...cam.lookOffset));
  }
  // life: handheld drift + impact shake
  const hh = cam.handheld ?? 0.12, sk = shakeAmt(cam, t, lt, rt);
  if (hh > 0 || sk > 0) {
    const d = pos.distanceTo(look), amp = hh * 0.015 * d + sk;
    const f = 0.45 + sk * 6; pos.x += noise(t * f, 11) * amp; pos.y += noise(t * f, 23) * amp * 0.7; look.x += noise(t * f * 1.1, 37) * amp * 0.6; look.y += noise(t * f * 1.1, 41) * amp * 0.6;
  }
  if (pos.y < 0.4) pos.y = 0.4;
  return { pos, look, fov, roll: (cam.roll || 0) * D2R };
}
function shakeAmt(cam, t, lt, rt) {
  let s = 0; const sh = cam.shake;
  if (sh === true || sh === undefined) for (const im of rt.impacts || []) { const dt = t - im.t; if (dt >= 0 && dt < 0.6) s += (im.amp ?? 0.35) * Math.exp(-dt * 9) * (sh === true ? 1.6 : 0.5); }
  if (typeof sh === 'number') s += sh;
  if (Array.isArray(sh)) for (const k of sh) { const dt = lt - k.at; if (dt >= 0 && dt < (k.dur || 0.6)) s += (k.amp ?? 0.4) * Math.exp(-dt * 8); }
  return s;
}
function pairSep(rt, tg, t) { const a = rt.point(tg[0], t, 0), b = rt.point(tg[1], t, 0); return Math.hypot(a.x - b.x, a.z - b.z); }
function pairHeading(rt, tg, t) {   // perpendicular to the A-B line, on the side facing +Z (keeps screen direction stable)
  const a = rt.point(tg[0], t, 0), b = rt.point(tg[1], t, 0); const dx = b.x - a.x, dz = b.z - a.z; let h = Math.atan2(-dz, dx) + 0; // normal (-dz, dx) rotated
  const nx = Math.sin(h), nz = Math.cos(h); if (nz < 0 || (Math.abs(nz) < 1e-3 && nx < 0)) h += Math.PI; return h;
}
export function applyCam(camera, c) {
  camera.position.copy(c.pos); camera.up.set(Math.sin(c.roll), Math.cos(c.roll), 0); camera.lookAt(c.look);
  if (camera.fov !== c.fov) { camera.fov = c.fov; camera.updateProjectionMatrix(); }
}
