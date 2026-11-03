// engine/glow.js — the Glow character rig (2D canvas): the "soft glow" hoodie figure of the reference look.
//
// Anatomy (adult, s = 1, ≈ 290 units tall): a big round black head (R 44, ~30% of the height) with a soft radial
// sheen toward the light, two white oval eyes with lids (no mouth by default), a short rounded-rectangle hoodie with
// hood (up or down), white drawstrings, a faint kangaroo pocket and a darker hem band, sleeve tubes with round black
// mitten hands, two thin straight stick legs and tiny dark feet. A thin cream/warm EDGE LIGHT runs around the whole
// silhouette (colour = the key light of the mood), slightly stronger on the side facing the light.
//
// Local space: feet on y = 0, up is −y, the figure faces +x (facing: 1 = right, −1 = left). Poses are ANGLES, so the
// same pose works for every build (adult, kid, tall, stocky):
//   aF/aB = [upper-arm angle, elbow bend] for the near/far arm. 0 = hanging straight down, + rotates toward +x (the
//           facing side; for the near arm that is outward/forward, for the far arm inward across the body).
//   lF/lB = [thigh angle, knee bend]. + swings the leg forward; a negative knee bend folds the shin back.
//   lean (torso tilt, + = forward), hx/hy (head offset), ht (head tilt), seat (hip height when sitting), air (jump).
// turn: 0 = front view (the usual framing), 1 = profile. Eyes slide toward the facing side with turn + look.
import { E, S, clamp, lerp, mixVal, seg, circle, ring, alpha, shade, mix, rr, poly, ease, radGrad, linGrad } from './core.js';

// ---------- builds ----------
export const BUILDS = {
  adult:  { R: 44, legLen: 100, legGap: 13, legW: 7.5, torsoH: 118, torsoW: 88, armL1: 47, armL2: 45, sleeveW: 19, handR: 10.5, footL: 15 },
  kid:    { R: 39, legLen: 62, legGap: 10, legW: 6.5, torsoH: 84, torsoW: 70, armL1: 34, armL2: 32, sleeveW: 16, handR: 9, footL: 12 },
  tall:   { R: 42, legLen: 118, legGap: 13, legW: 7.5, torsoH: 126, torsoW: 84, armL1: 50, armL2: 48, sleeveW: 18, handR: 10.5, footL: 15 },
  stocky: { R: 46, legLen: 92, legGap: 15, legW: 8.5, torsoH: 120, torsoW: 106, armL1: 46, armL2: 44, sleeveW: 22, handR: 11.5, footL: 16 },
};
const buildOf = (o) => BUILDS[o.build || o.outfit?.build || (o.outfit?.kid ? 'kid' : 'adult')] || BUILDS.adult;

// ---------- poses (angles, see header) ----------
const P = (o) => ({ aF: [0.12, -0.05], aB: [-0.12, 0.05], lF: [0.02, 0], lB: [-0.02, 0], lean: 0, hx: 0, hy: 0, ht: 0, ...o });
export const GPOSES = {
  stand:      P({}),
  relaxed:    P({ aF: [0.18, 0.12], aB: [-0.16, -0.1], lF: [0.05, 0], lB: [-0.05, 0] }),
  handsOnHips:P({ aF: [0.85, -2.05], aB: [-0.85, 2.05] }),
  handOnHip:  P({ aF: [0.12, -0.05], aB: [-0.85, 2.05] }),
  wave:       P({ aF: [2.45, 0.45] }),
  point:      P({ aF: [1.5, 0.04], hx: 2 }),
  pointUp:    P({ aF: [2.85, 0.1] }),
  pointDown:  P({ aF: [0.75, 0.15], ht: 0.08 }),
  reach:      P({ aF: [1.25, 0.15], lean: 0.07, hx: 3 }),
  give:       P({ aF: [1.15, 0.35], lean: 0.04 }),
  holdFront:  P({ aF: [0.08, -1.3], aB: [-0.08, 1.3] }),
  holdUp:     P({ aF: [0.5, 1.75], aB: [-0.5, -1.75] }),
  carry:      P({ aF: [0.35, 0.9], aB: [0.2, 1.1] }),
  cheer:      P({ aF: [2.65, -0.2], aB: [-2.65, 0.2] }),
  shrug:      P({ aF: [0.62, 1.55], aB: [-0.62, -1.55], ht: 0.1 }),
  crossArms:  P({ aF: [0.06, -1.62], aB: [-0.06, 1.62] }),
  think:      P({ aF: [0.22, 2.7], aB: [-0.06, 1.45], ht: -0.08, hx: 2 }),
  phone:      P({ aF: [0.18, 2.25], hy: 4, ht: 0.12 }),
  facepalm:   P({ aF: [0.06, 2.9], hy: 3, ht: 0.12 }),
  handsOnHead:P({ aF: [2.25, 1.35], aB: [-2.25, -1.35] }),
  scared:     P({ aF: [0.55, 2.35], aB: [-0.55, -2.35], lean: -0.07, lF: [0.1, 0], lB: [-0.12, 0] }),
  sad:        P({ aF: [0.03, 0], aB: [-0.03, 0], lean: 0.1, hy: 7, ht: 0.18 }),
  guilty:     P({ aF: [0.05, -1.4], aB: [-0.05, 1.4], lean: 0.06, hy: 5, ht: 0.14 }),
  sneak:      P({ aF: [0.9, 0.6], aB: [0.5, 0.9], lean: 0.18, lF: [0.35, -0.5], lB: [-0.3, -0.2], hx: 4 }),
  hug:        P({ aF: [1.25, -1.1], aB: [1.0, -0.9], lean: 0.05 }),
  typing:     P({ aF: [0.95, 0.45], aB: [0.75, 0.6], lean: 0.08 }),
  crouch:     P({ aF: [0.5, 0.5], aB: [0.3, 0.6], lF: [1.25, -2.3], lB: [0.95, -2.1], lean: 0.32 }),
  jump:       P({ aF: [2.5, 0.2], aB: [-2.5, -0.2], lF: [0.55, -1.05], lB: [-0.25, -0.7], air: 40 }),
  sit:        P({ aF: [0.45, 0.7], aB: [0.3, 0.8], lF: [1.5, -1.5], lB: [1.45, -1.45], seat: 62 }),          // side view on a bench/chair
  sitFront:   P({ aF: [0.22, -0.55], aB: [-0.22, 0.55], seat: 62, front: true }),                              // front view, legs hang down
  sitPhone:   P({ aF: [0.2, 2.2], aB: [-0.22, 0.55], seat: 62, front: true, hy: 4, ht: 0.12 }),
  lie:        P({}),                                                                                         // use with rot
};
export const gpose = (name) => (typeof name === 'string' ? GPOSES[name] || GPOSES.stand : name);
export const blendG = (a, b, k) => mixVal(gpose(a), gpose(b), ease.inOut(clamp(k)));
// gPosesAt(t, [[0,'stand'],[1.2,'point']], 0.3) — hold each pose, blend over `blend` seconds
export function gPosesAt(t, keys, blend = 0.3) {
  let cur = gpose(keys[0][1]);
  for (let i = 1; i < keys.length; i++) { const [ti, pi] = keys[i]; if (t < ti) break; const k = clamp((t - ti) / blend); cur = k >= 1 ? gpose(pi) : blendG(cur, pi, k); if (k < 1) return cur; }
  return cur;
}
// idle life: breathing + tiny arm sway, on top of any pose
export function idle(p, t, amt = 1, seed = 0) {
  p = gpose(p); const b = Math.sin(t * 2.0 + seed) * amt, w = Math.sin(t * 0.9 + seed * 1.7) * amt;
  return { ...p, breath: b, aF: [p.aF[0] + w * 0.025, p.aF[1] + b * 0.02], aB: [p.aB[0] - w * 0.02, p.aB[1] - b * 0.02], hx: (p.hx || 0) + w * 0.8, ht: (p.ht || 0) + w * 0.012 };
}
// walk / run cycle as a pose (use with turn ≈ 0.8). phase = t * 2π * steps-per-second (walk ≈ 0.9, run ≈ 1.5)
export function gWalk(phase, o = {}) {
  const run = !!o.run, sw = run ? 0.62 : 0.34, kn = run ? 1.25 : 0.55, arm = run ? 0.75 : 0.32;
  const s = Math.sin(phase), c = Math.cos(phase);
  return P({
    lF: [sw * s, -kn * Math.max(0, -c) * 0.9 - 0.05], lB: [-sw * s, -kn * Math.max(0, c) * 0.9 - 0.05],
    aF: [-arm * s + (run ? 0.3 : 0.08), run ? 1.4 : 0.25], aB: [arm * s + (run ? 0.3 : 0.05), run ? 1.4 : 0.25],
    lean: run ? 0.16 : 0.035, bob: (run ? 6 : 3) * Math.abs(c), ht: run ? 0.05 : 0,
  });
}
// deterministic blink: true for ~0.12 s every `period` seconds
export const blinkAt = (t, period = 3.3, seed = 0) => ((t + seed * 0.77) % period) > period - 0.12;

// ---------- expressions (eyes first; the mouth is optional and small) ----------
// lid: share of the eye covered from the top (0 open … 1 closed); slant: + = inner corners lower (angry/sly),
// − = outer corners lower (sad/worried); low: share covered from the bottom (smiling cheeks); sc: eye scale;
// kind: 'oval' | 'arc' (happy ^ ^) | 'closed' (thin curve) | 'dot' (tiny far-away eyes); mouth: null|'o'|'oBig'|'smile'|'grin'|'smirk'|'frown'|'flat'|'wavy'
export const GEXPR = {
  neutral:    { lid: 0.3 },
  calm:       { lid: 0.42 },
  open:       { lid: 0.06 },
  look:       { lid: 0.18 },
  happy:      { kind: 'arc' },
  joy:        { kind: 'arc', mouth: 'grin', sc: 1.05 },
  smile:      { lid: 0.22, low: 0.32, mouth: 'smile' },
  content:    { lid: 0.38, low: 0.3 },
  sly:        { lid: 0.46, slant: 0.1, low: 0.2 },
  smirk:      { lid: 0.46, slant: 0.1, low: 0.2, mouth: 'smirk' },
  bored:      { lid: 0.56, low: 0.12 },
  sleepy:     { lid: 0.74 },
  angry:      { lid: 0.42, slant: 0.5 },
  determined: { lid: 0.4, slant: 0.32 },
  sad:        { lid: 0.34, slant: -0.42 },
  worried:    { lid: 0.12, slant: -0.4, sc: 1.05 },
  guilty:     { lid: 0.36, slant: -0.32, look: [0.2, 0.7] },
  nervous:    { lid: 0.16, slant: -0.3, sweat: true },
  scared:     { lid: 0, slant: -0.25, sc: 1.18, mouth: 'wavy' },
  surprised:  { lid: 0, sc: 1.22, mouth: 'o' },
  shocked:    { lid: 0, sc: 1.36, mouth: 'oBig' },
  awe:        { lid: 0, sc: 1.2, glint: true },
  sideEye:    { lid: 0.5, low: 0.08, look: [1, 0] },
  thinking:   { lid: 0.28, look: [0.6, -0.8] },
  confused:   { lid: 0.12, lidR: 0.5, slant: -0.15 },
  closed:     { kind: 'closed' },
  cry:        { lid: 0.34, slant: -0.42, tears: true },
  love:       { kind: 'arc', blush: true, mouth: 'smile' },
  tiny:       { kind: 'dot' },
};

// ---------- small helpers ----------
// the head: near-black with a faint sheen tinted by the key light (warm by lamps, cool in offices)
function headFill(g, lx, ly, R, light) { const st = S(); return radGrad(g, lx, ly, R * 0.04, R * 1.5, [[0, mix(st.ink, light, 0.15)], [0.45, mix(st.ink, light, 0.055)], [1, st.ink]]); }
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const dirv = (a) => [Math.sin(a), Math.cos(a)];

// skeleton in local space (before facing flip and scale)
function skeleton(o) {
  const B = buildOf(o), p = gpose(o.pose || 'stand'), turn = clamp(o.turn ?? 0.3, 0, 1);
  const L = B.legLen, gap = B.legGap * (1 - 0.7 * turn);
  const legEnd = (a, k) => { const t = dirv(a[0]), sh = dirv(a[0] + a[1]); return { knee: [t[0] * L / 2, t[1] * L / 2], foot: [t[0] * L / 2 + sh[0] * L / 2, t[1] * L / 2 + sh[1] * L / 2] }; };
  let hipH;
  const front = !!p.front;
  if (p.seat != null) hipH = p.seat * (B.legLen / 100);
  else { const a = legEnd(p.lF), b = legEnd(p.lB); hipH = Math.max(a.foot[1], b.foot[1]); }
  const bob = p.bob || 0;
  const hipY = -hipH - (p.air || 0) + bob * 0.6;
  let legs;
  if (front) {                                    // sitting facing camera: legs hang straight from the seat edge to the floor
    legs = { F: { hip: [gap, hipY], knee: [gap + 2, hipY * 0.5], foot: [gap + 3, 0] }, B: { hip: [-gap, hipY], knee: [-gap - 2, hipY * 0.5], foot: [-gap - 3, 0] } };
  } else {
    const a = legEnd(p.lF), b = legEnd(p.lB);
    legs = { F: { hip: [gap, hipY], knee: add([gap, hipY], a.knee), foot: add([gap, hipY], a.foot) }, B: { hip: [-gap, hipY], knee: add([-gap, hipY], b.knee), foot: add([-gap, hipY], b.foot) } };
  }
  const breath = p.breath || 0;
  const hem = [0, hipY + 7], top = hem[1] - B.torsoH - breath * 0.8;
  const lean = p.lean || 0;
  const tr = (pt) => add(hem, rot([pt[0] - hem[0], pt[1] - hem[1]], lean));   // lean rotates around the hem centre
  const sx = (B.torsoW / 2 - B.sleeveW * 0.42);
  const shF = tr([sx * (1 - 0.12 * turn), top + B.sleeveW * 0.62]), shB = tr([-sx * (1 - 0.75 * turn), top + B.sleeveW * 0.62]);
  const arm = (sh, a) => { const u = dirv(a[0] + lean), f = dirv(a[0] + a[1] + lean); const el = [sh[0] + u[0] * B.armL1, sh[1] + u[1] * B.armL1]; return { sh, el, hand: [el[0] + f[0] * B.armL2, el[1] + f[1] * B.armL2] }; };
  const head = tr([turn * B.R * 0.1 + (p.hx || 0), top - B.R * 0.6 + (p.hy || 0)]);
  return { B, p, turn, legs, hem, top, lean, tr, arms: { F: arm(shF, p.aF), B: arm(shB, p.aB) }, head, ht: (p.ht || 0) + lean * 0.4 };
}

// ---------- drawing ----------
// drawGlow(g, { x, y, s, facing, pose, turn, outfit, expr, look:[x,y], blink, talk, rim:{color, w, dir:[dx,dy]} | false,
//               light:[dx,dy], back, invisible (0..1), alpha, dim (0..1), shadow, prop, rot, eyeColor, edgeOnly })
// outfit: { top: 'hoodie'|'sweater'|'tee'|'jacket'|'coat'|'labcoat'|'dress'|'none', color, color2, hood: 'up'|'down'|false,
//           strings (default true for hoodies), pocket, hat: 'witch'|'cap'|'beanie'|'headphones'|'party'|'crown'|'bun'|'ponytail',
//           hatColor, glasses: true|'sun', cape: colour, costume: 'ghost', patch: colour, scarf: colour, legs: colour, build }
export function drawGlow(g, o) {
  const a = o.alpha ?? 1, inv = clamp(o.invisible || 0);
  if (a <= 0.001) return;
  if (a < 0.999 || inv > 0.001) return offscreen(g, (x) => drawGlowOpaque(x, { ...o, alpha: 1, invisible: 0 }, inv), a, inv, o);
  drawGlowOpaque(g, o, 0);
}
function drawGlowOpaque(g, o, inv) {
  const st = S(), K = skeleton(o), B = K.B, s = o.s ?? 1, f = o.facing ?? 1;
  const of = { top: 'hoodie', hood: 'down', ...(o.outfit || {}) };
  const rimO = o.rim === false ? null : { color: '#f2c890', w: st.rimWidth ?? 3, dir: [-0.6, -0.8], ...(o.rim || {}) };
  const light = o.light || rimO?.dir || [-0.6, -0.8];
  g.save();
  // contact shadow (soft)
  if (o.shadow !== false && !o.rot && !K.p.air) { g.save(); g.translate(o.x, o.y + 1); g.scale(1, 0.16); g.fillStyle = radGrad(g, 0, 0, 0, 62 * s * (B.torsoW / 88), ['rgba(0,0,0,.34)', 'rgba(0,0,0,.18)', 'rgba(0,0,0,0)']); g.beginPath(); g.arc(0, 0, 62 * s * (B.torsoW / 88), 0, Math.PI * 2); g.fill(); g.restore(); }
  const tf = (dx = 0, dy = 0) => { g.translate(o.x + dx, o.y + dy); g.scale(f * s, s); if (o.rot) { g.translate(0, K.hem[1]); g.rotate(o.rot * f); g.translate(0, -K.hem[1]); } };
  if (rimO) {
    const w = rimO.w;
    g.save(); tf(); parts(g, o, K, of, { sil: alpha(rimO.color, 0.92), grow: w / s }); g.restore();                     // uniform thin edge
    const d = Math.hypot(rimO.dir[0], rimO.dir[1]) || 1;
    g.save(); tf((rimO.dir[0] / d) * w * 0.8, (rimO.dir[1] / d) * w * 0.8); parts(g, o, K, of, { sil: rimO.color, grow: (w * 0.55) / s }); g.restore();   // brighter lit side
  }
  g.save(); tf(); parts(g, o, K, of, { light: [light[0] * f, light[1]], rimColor: rimO?.color || '#f2c890', dim: o.dim || 0 }); g.restore();
  g.restore();
}
// draw into a same-size buffer, then composite with alpha (no overlapping seams) or as an "invisible" outline
const _pool = [];
function buf(w, h) { let c = _pool.find(b => !b.busy && b.width === w && b.height === h); if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; _pool.push(c); } c.busy = true; return c; }
function offscreen(g, fn, a, inv, o) {
  const W = g.canvas.width, H = g.canvas.height, c = buf(W, H), x = c.getContext('2d'), m = g.getTransform();
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.setTransform(m); fn(x);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (inv > 0) {
    // outline + eyes of an invisible person: edge = silhouette minus a shrunken silhouette
    const c2 = buf(W, H), y = c2.getContext('2d'); y.setTransform(1, 0, 0, 1, 0, 0); y.clearRect(0, 0, W, H); y.setTransform(m);
    const K = skeleton(o), s = o.s ?? 1, f = o.facing ?? 1, of = { top: 'hoodie', hood: 'down', ...(o.outfit || {}) }, col = o.edgeColor || o.rim?.color || '#fff4e0';
    const tf = () => { y.translate(o.x, o.y); y.scale(f * s, s); };
    y.save(); tf(); parts(y, o, K, of, { sil: col, grow: 2.2 / s }); y.globalCompositeOperation = 'destination-out'; parts(y, o, K, of, { sil: '#000', grow: -0.8 / s }); y.restore();
    y.globalCompositeOperation = 'source-over';
    y.save(); tf(); const h = K.head; y.translate(h[0], h[1]); y.rotate(K.ht); eyes(y, 0, 0, K.B.R, { ...o, turn: K.turn }, o.eyeColor || '#ffffff'); y.restore();
    g.globalAlpha = a * (1 - inv); g.drawImage(c, 0, 0);
    g.globalAlpha = a * Math.min(1, inv * 1.4) * (o.edgeAlpha ?? 0.9); g.drawImage(c2, 0, 0); g.globalCompositeOperation = 'screen'; g.globalAlpha = a * inv * 0.35; g.drawImage(c2, 0, 0);
    c2.busy = false;
  } else { g.globalAlpha = a; g.drawImage(c, 0, 0); }
  g.restore(); c.busy = false;
}

// All shapes. mode.sil = single colour silhouette (with mode.grow extra thickness); otherwise full colour.
function parts(g, o, K, of, mode) {
  const st = S(), B = K.B, sil = mode.sil, grow = mode.grow || 0, R = B.R, turn = K.turn, back = !!o.back;
  const ink = sil || (mode.dim ? mix(st.ink, st.inkFar, mode.dim) : st.ink), inkFar = sil || st.inkFar;
  const col = of.color || '#8a7a9a', dark = sil || shade(col, -0.16), darker = sil || shade(col, -0.3);
  const F = (c) => sil || c;
  g.lineCap = 'round'; g.lineJoin = 'round';
  // cape (behind everything)
  if (of.cape) { const t = K.top, h = K.hem[1]; g.save(); g.fillStyle = F(of.cape); g.beginPath(); g.moveTo(-B.torsoW * 0.36, t + 10); g.lineTo(B.torsoW * 0.36, t + 10); g.lineTo(B.torsoW * 0.78, h + B.legLen * 0.62); g.quadraticCurveTo(0, h + B.legLen * 0.72, -B.torsoW * 0.78, h + B.legLen * 0.62); g.closePath(); g.fill(); if (grow) { g.strokeStyle = sil; g.lineWidth = grow * 2; g.stroke(); } g.restore(); }
  // legs (far then near) — thin straight sticks + tiny feet
  const leg = (Lg, far) => {
    const c = sil || (of.legs ? (far ? shade(of.legs, -0.25) : of.legs) : far ? inkFar : ink);
    seg(g, [Lg.hip, Lg.knee, Lg.foot], B.legW + grow * 2, c);
    const fl = B.footL, dir = turn > 0.5 || K.p.seat != null && !K.p.front ? 1 : (far ? -0.35 : 0.35);
    g.fillStyle = c; g.beginPath(); g.ellipse(Lg.foot[0] + fl * 0.35 * dir, Lg.foot[1] - 2, fl * (0.55 + 0.25 * Math.abs(dir)) + grow, 4.6 + grow, 0, 0, Math.PI * 2); g.fill();
  };
  if (of.costume !== 'ghost' || true) { leg(K.legs.B, true); leg(K.legs.F, false); }
  // far arm behind the body when turned
  const farBehind = turn > 0.45 || back;
  if (farBehind) arm(g, K.arms.B, B, of, mode, true);
  // hood / collar behind the head
  const hd = K.head;
  if (of.top === 'hoodie' && of.hood !== 'up' && of.hood !== false) { g.fillStyle = F(dark); g.beginPath(); g.ellipse(hd[0] - turn * R * 0.32 - 0.5, K.top + 4, R * 0.78 + grow, R * 0.36 + grow, 0, 0, Math.PI * 2); g.fill(); }
  if (of.hood === 'up' && of.top !== 'none') { const hc = sil || shade(col, -0.06); circle(g, hd[0] - turn * R * 0.16, hd[1] + R * 0.06, R * 1.2 + grow, hc); if (!sil) { g.fillStyle = hc; g.beginPath(); g.ellipse(hd[0] - turn * R * 0.1, K.top + 8, R * 0.95, R * 0.45, 0, 0, Math.PI * 2); g.fill(); } }
  if (of.hat === 'ponytail') { g.strokeStyle = ink; g.lineWidth = R * 0.42 + grow * 2; g.beginPath(); g.moveTo(hd[0] - R * 0.6, hd[1] - R * 0.5); g.quadraticCurveTo(hd[0] - R * 1.5, hd[1] - R * 0.3, hd[0] - R * 1.25, hd[1] + R * 0.7); g.stroke(); }
  // torso
  torso(g, K, B, of, mode, back);
  // costume: ghost sheet covers head and torso
  if (of.costume === 'ghost') { ghostSheet(g, K, B, mode); if (!farBehind) arm(g, K.arms.B, B, of, mode, true, true); arm(g, K.arms.F, B, of, mode, false, true); prop(g, o, K, mode); return; }
  if (!farBehind) arm(g, K.arms.B, B, of, mode, true);
  // head
  g.save(); g.translate(hd[0], hd[1]); g.rotate(K.ht);
  if (of.hat === 'bun') circle(g, -R * 0.5, -R * 0.9, R * 0.42 + grow, ink);
  if (sil) circle(g, 0, 0, R + grow, sil);
  else {
    const l = mode.light, ln = Math.hypot(l[0], l[1]) || 1, lx = (l[0] / ln) * R * 0.5, ly = (l[1] / ln) * R * 0.5;
    g.fillStyle = headFill(g, lx, ly, R, mode.rimColor); g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
  }
  if (of.hood === 'up' && !sil && of.top !== 'none') { g.strokeStyle = alpha(shade(col, 0.22), 0.9); g.lineWidth = R * 0.07; g.beginPath(); g.arc(0, 0, R * 1.04, Math.PI * 0.62, Math.PI * 2.38); g.stroke(); }
  hat(g, of, R, mode, turn);
  if (!sil && !back) eyes(g, 0, 0, R, { ...o, turn }, o.eyeColor || st.feature);
  if (!sil && !back && of.glasses) glasses(g, R, o, turn, of.glasses);
  g.restore();
  // near arm on top
  arm(g, K.arms.F, B, of, mode, false);
  if (!sil && of.scarf) { g.fillStyle = of.scarf; rr(g, -B.torsoW * 0.36, K.top - 4, B.torsoW * 0.72, 16, 8); g.fill(); g.fillRect(B.torsoW * 0.08, K.top + 6, 14, 40); }
  prop(g, o, K, mode);
}
function torso(g, K, B, of, mode, back) {
  const sil = mode.sil, grow = mode.grow || 0, turn = K.turn, st = S();
  const top = K.top, hem = K.hem[1], w = B.torsoW * (1 - 0.14 * turn);
  const kind = of.top || 'hoodie', col = kind === 'labcoat' ? '#eceaf0' : kind === 'none' ? st.ink : of.color || '#8a7a9a';
  const long = ['coat', 'labcoat', 'dress'].includes(kind) ? B.legLen * (kind === 'dress' ? 0.45 : 0.55) : 0;
  const hw0 = w / 2 - 1, hw1 = w / 2 + (kind === 'dress' ? 14 : 2), y0 = top, y1 = hem + long, rs = Math.min(w * 0.3, 28), rb = 7;
  g.save(); g.translate(K.hem[0], K.hem[1]); g.rotate(K.lean); g.translate(-K.hem[0], -K.hem[1]);
  const path = () => { g.beginPath(); g.moveTo(-hw1 + rb, y1); g.lineTo(hw1 - rb, y1); g.quadraticCurveTo(hw1, y1, hw1, y1 - rb); g.lineTo(hw0, y0 + rs); g.quadraticCurveTo(hw0, y0, hw0 - rs, y0); g.lineTo(-hw0 + rs, y0); g.quadraticCurveTo(-hw0, y0, -hw0, y0 + rs); g.lineTo(-hw1, y1 - rb); g.quadraticCurveTo(-hw1, y1, -hw1 + rb, y1); g.closePath(); };
  if (sil) { path(); g.fillStyle = sil; g.fill(); if (grow) { g.strokeStyle = sil; g.lineWidth = grow * 2; g.stroke(); } g.restore(); return; }
  const l = mode.light[0] >= 0 ? 1 : -1;
  path(); g.fillStyle = linGrad(g, -hw1 * l, 0, hw1 * l, 0, [shade(col, -0.13), col, shade(col, 0.06)]); g.fill();
  g.save(); path(); g.clip();
  // soft top-light and a darker bottom (2-tone flat shading)
  g.fillStyle = linGrad(g, 0, y0, 0, y1, [alpha('#ffffff', 0.06), alpha('#ffffff', 0), alpha('#000000', 0.08)]); g.fillRect(-hw1 - 4, y0, hw1 * 2 + 8, y1 - y0);
  const dk = shade(col, -0.2), dk2 = shade(col, -0.3), cx = (back ? -1 : 1) * turn * w * 0.2;
  if (kind === 'hoodie' || kind === 'sweater') { g.fillStyle = shade(col, -0.14); g.fillRect(-hw1 - 4, y1 - (kind === 'hoodie' ? 10 : 8), hw1 * 2 + 8, 12); }
  if (kind === 'hoodie' && !back && of.pocket !== false) {
    g.strokeStyle = alpha(dk2, 0.55); g.lineWidth = 2; const pw = w * 0.32, pt = y1 - (y1 - y0) * 0.36, pb = y1 - 12;
    g.beginPath(); g.moveTo(cx - pw - 6, pb); g.lineTo(cx - pw + 4, pt); g.lineTo(cx + pw - 4, pt); g.lineTo(cx + pw + 6, pb); g.stroke();
  }
  if (kind === 'jacket' || kind === 'coat' || kind === 'labcoat') { seg(g, [[cx, y0 + 6], [cx, y1]], 2.2, alpha(dk2, 0.6)); seg(g, [[cx - 14, y0 + 2], [cx, y0 + 26], [cx + 14, y0 + 2]], 2.4, alpha(dk2, 0.55)); }
  if (kind === 'labcoat') { g.fillStyle = alpha('#9aa0b0', 0.5); g.fillRect(cx + 10, y0 + 40, 16, 3); }
  if (kind === 'tee') { g.fillStyle = alpha(dk, 0.6); g.beginPath(); g.ellipse(cx, y0 + 2, 15, 7, 0, 0, Math.PI); g.fill(); }
  if (of.patch && !back) { const pw = w * 0.36; rr(g, cx - pw / 2, y0 + (y1 - y0) * 0.22, pw, (y1 - y0) * 0.26, 4); g.fillStyle = of.patch; g.fill(); rr(g, cx - pw / 2 + 4, y0 + (y1 - y0) * 0.22 + 10, pw - 8, (y1 - y0) * 0.26 - 15, 3); g.fillStyle = '#f4f1ea'; g.fill(); seg(g, [[cx - pw / 2 + 9, y0 + (y1 - y0) * 0.39], [cx + pw / 2 - 9, y0 + (y1 - y0) * 0.39]], 1.6, alpha('#6a6a7a', 0.7)); for (let i = 0; i < 3; i++) { g.fillStyle = '#f4f1ea'; g.fillRect(cx - pw / 2 + 6 + i * 8, y0 + (y1 - y0) * 0.22 + 3, 5, 4); } }
  g.restore();
  if (kind === 'hoodie' && of.strings !== false && !back) {                     // drawstrings
    const sc = of.stringColor || mix(col, '#ffffff', 0.8), len = (y1 - long - y0) * 0.3;
    for (const dx of [-7.5, 7.5]) { const x0 = cx + dx * (1 - 0.3 * turn); seg(g, [[x0, y0 + 5], [x0 + dx * 0.08, y0 + 5 + len]], 2.1, sc); circle(g, x0 + dx * 0.08, y0 + 6 + len, 1.9, shade(sc, -0.25)); }
  }
  g.restore();
}
function arm(g, A, B, of, mode, far, overSheet) {
  const sil = mode.sil, grow = mode.grow || 0, st = S();
  const kind = of.top || 'hoodie', col = overSheet ? '#eeeaf2' : kind === 'labcoat' ? '#eceaf0' : kind === 'none' ? st.ink : of.color || '#8a7a9a';
  const c = sil || (far ? shade(col, -0.18) : shade(col, -0.04)), outline = sil ? null : alpha(shade(col, -0.32), 0.55);
  const short = kind === 'tee' && !overSheet;
  const wrist = short ? [lerp(A.sh[0], A.el[0], 0.9), lerp(A.sh[1], A.el[1], 0.9)] : [lerp(A.el[0], A.hand[0], 0.86), lerp(A.el[1], A.hand[1], 0.86)];
  if (short) seg(g, [A.el, A.hand], B.legW + 1.5 + grow * 2, sil || (far ? st.inkFar : st.ink));
  if (outline) seg(g, short ? [A.sh, wrist] : [A.sh, A.el, wrist], B.sleeveW + 2.4, outline);
  seg(g, short ? [A.sh, wrist] : [A.sh, A.el, wrist], B.sleeveW + grow * 2, c);
  if (!sil && !short && kind === 'hoodie') { const d = [A.hand[0] - A.el[0], A.hand[1] - A.el[1]], n = Math.hypot(...d) || 1; seg(g, [[wrist[0] - d[0] / n * 6, wrist[1] - d[1] / n * 6], wrist], B.sleeveW * 0.96, shade(col, far ? -0.3 : -0.18)); }
  circle(g, A.hand[0], A.hand[1], B.handR + grow, sil || (far ? st.inkFar : st.ink));
}
function ghostSheet(g, K, B, mode) {
  const sil = mode.sil, grow = mode.grow || 0, hd = K.head, R = B.R, bot = K.hem[1] + B.legLen * 0.42, hw = B.torsoW * 0.62;
  g.save(); g.beginPath(); g.moveTo(hd[0] - R * 1.05, hd[1]); g.arc(hd[0], hd[1], R * 1.05, Math.PI, 0); g.lineTo(hd[0] + hw, bot);
  for (let i = 0; i <= 4; i++) { const x = hd[0] + hw - (i / 4) * hw * 2; g.quadraticCurveTo(x + hw / 4, bot + 10, x, bot); }
  g.closePath();
  if (sil) { g.fillStyle = sil; g.fill(); if (grow) { g.strokeStyle = sil; g.lineWidth = grow * 2; g.stroke(); } g.restore(); return; }
  g.fillStyle = linGrad(g, hd[0] - hw, 0, hd[0] + hw, 0, ['#d9d6e0', '#f7f5f8', '#e8e5ee']); g.fill(); g.restore();
  for (const dx of [-0.3, 0.3]) { g.fillStyle = '#1a1820'; g.beginPath(); g.ellipse(hd[0] + dx * R + K.turn * R * 0.3, hd[1] - R * 0.05, R * 0.15, R * 0.22, 0, 0, Math.PI * 2); g.fill(); circle(g, hd[0] + dx * R + K.turn * R * 0.3 + R * 0.04, hd[1] - R * 0.12, R * 0.05, '#ffffff'); }
  g.strokeStyle = 'rgba(120,110,140,.35)'; g.lineWidth = 2; g.beginPath(); g.arc(hd[0] + R * 0.1, hd[1] + R * 0.7, R * 0.45, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
}
function hat(g, of, R, mode, turn) {
  const sil = mode.sil, grow = mode.grow || 0, c = of.hatColor || '#4a3a6a', F = (x) => sil || x;
  switch (of.hat) {
    case 'witch': { g.fillStyle = F(c); g.beginPath(); g.ellipse(0, -R * 0.62, R * 1.35 + grow, R * 0.2 + grow, -0.06, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(-R * 0.68 - grow, -R * 0.68); g.lineTo(R * 0.12, -R * 2.35 - grow); g.quadraticCurveTo(R * 0.5, -R * 2.0, R * 0.68 + grow, -R * 0.68); g.closePath(); g.fill();
      if (!sil) { g.fillStyle = of.hatColor2 || '#e0a03a'; g.beginPath(); g.moveTo(-R * 0.66, -R * 0.78); g.lineTo(R * 0.66, -R * 0.78); g.lineTo(R * 0.6, -R * 0.98); g.lineTo(-R * 0.58, -R * 0.98); g.closePath(); g.fill(); } break; }
    case 'cap': { g.fillStyle = F(c); g.beginPath(); g.arc(0, -R * 0.12, R * 1.0 + grow, Math.PI * 1.05, Math.PI * 1.95); g.closePath(); g.fill(); g.beginPath(); g.ellipse(R * (0.45 + 0.4 * turn), -R * 0.3, R * (0.7 + 0.2 * turn) + grow, R * 0.13 + grow, 0.05, 0, Math.PI * 2); g.fillStyle = F(shade(c, -0.2)); g.fill(); break; }
    case 'beanie': { g.fillStyle = F(c); g.beginPath(); g.arc(0, -R * 0.08, R * 1.04 + grow, Math.PI, Math.PI * 2); g.closePath(); g.fill(); if (!sil) { rr(g, -R * 1.06, -R * 0.36, R * 2.12, R * 0.3, R * 0.12); g.fillStyle = shade(c, -0.15); g.fill(); } circle(g, 0, -R * 1.12, R * 0.22 + grow, F(shade(c, 0.2))); break; }
    case 'headphones': { g.strokeStyle = F('#2a2a34'); g.lineWidth = R * 0.12 + grow * 2; g.beginPath(); g.arc(0, 0, R * 1.08, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); for (const sx of [-1, 1]) { rr(g, sx * R * 1.0 - R * 0.17 - grow, -R * 0.25 - grow, R * 0.34 + grow * 2, R * 0.55 + grow * 2, R * 0.14); g.fillStyle = F(c); g.fill(); } break; }
    case 'party': { g.fillStyle = F(c); g.beginPath(); g.moveTo(-R * 0.45 - grow, -R * 0.82); g.lineTo(R * 0.05, -R * 1.9 - grow); g.lineTo(R * 0.5 + grow, -R * 0.82); g.closePath(); g.fill(); circle(g, R * 0.05, -R * 1.92, R * 0.14 + grow, F(of.hatColor2 || '#ffd25a')); break; }
    case 'crown': { g.fillStyle = F(c === '#4a3a6a' ? '#f2c14a' : c); g.beginPath(); g.moveTo(-R * 0.6, -R * 0.78); for (let i = 0; i <= 4; i++) { g.lineTo(-R * 0.6 + i * R * 0.3, -R * (i % 2 ? 1.05 : 1.35)); } g.lineTo(R * 0.6, -R * 0.78); g.closePath(); g.fill(); break; }
  }
}
function glasses(g, R, o, turn, kind) {
  const fx = turn * R * 0.42 + (o.look?.[0] || 0) * R * 0.1, y = -R * 0.06, sp = R * 0.27 * (1 - 0.25 * turn);
  if (kind === 'sun') { g.fillStyle = '#0a0a10'; for (const dx of [-sp, sp]) { rr(g, fx + dx - R * 0.2, y - R * 0.13, R * 0.4, R * 0.26, R * 0.08); g.fill(); } seg(g, [[fx - sp + R * 0.2, y - R * 0.04], [fx + sp - R * 0.2, y - R * 0.04]], R * 0.04, '#0a0a10'); return; }
  g.strokeStyle = alpha('#e9e4ea', 0.85); g.lineWidth = R * 0.045; for (const dx of [-sp, sp]) { g.beginPath(); g.arc(fx + dx, y, R * 0.21, 0, Math.PI * 2); g.stroke(); } seg(g, [[fx - sp + R * 0.21, y], [fx + sp - R * 0.21, y]], R * 0.04, alpha('#e9e4ea', 0.85));
}

// ---------- eyes + optional mouth ----------
// eyes(g, cx, cy, R, { expr, look:[x,y], blink, talk, turn, face:{…override} }, colour)
export function eyes(g, cx, cy, R, o = {}, col = '#fbf7f0') {
  const ex = { ...(GEXPR[o.expr] || GEXPR.neutral), ...(o.face || {}) };
  const look = o.look || ex.look || [0, 0], turn = o.turn ?? 0.3;
  const fx = cx + turn * R * 0.42 + look[0] * R * 0.16, fy = cy - R * 0.05 + look[1] * R * 0.1;
  const sp = R * 0.26 * (1 - 0.25 * turn), sc = (ex.sc || 1) * (o.eyeScale || 1);
  const rx = R * 0.112 * sc, ry = R * 0.165 * sc;
  const xs = [fx - sp, fx + sp];
  g.save(); g.lineCap = 'round';
  const kind = o.blink ? 'closed' : ex.kind || 'oval';
  xs.forEach((x, i) => {
    const near = i === 1, k = near ? 1 : 1 - 0.12 * turn, erx = rx * k, ery = ry;
    if (kind === 'arc') { g.strokeStyle = col; g.lineWidth = R * 0.075 * sc; g.beginPath(); g.arc(x, fy + ery * 0.35, erx * 1.15, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); return; }
    if (kind === 'closed') { g.strokeStyle = col; g.lineWidth = R * 0.05; g.beginPath(); g.arc(x, fy - ery * 0.5, erx * 1.2, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); return; }
    if (kind === 'dot') { circle(g, x, fy, R * 0.07, col); return; }
    const lid = clamp(i === 1 && ex.lidR != null ? ex.lidR : ex.lid ?? 0.3), low = clamp(ex.low || 0), sl = (ex.slant || 0) * (i === 0 ? 1 : -1);   // inner corner = toward the other eye
    g.save(); g.beginPath(); g.ellipse(x, fy, erx, ery, 0, 0, Math.PI * 2); g.clip();
    const yTop = fy - ery + lid * ery * 2, yBot = fy + ery - low * ery * 2, w = erx * 1.6;
    g.fillStyle = col; g.beginPath();
    g.moveTo(x - w, yTop - sl * erx * 1.4); g.lineTo(x + w, yTop + sl * erx * 1.4);
    g.lineTo(x + w, yBot); low > 0 ? g.quadraticCurveTo(x, yBot - ery * 0.5 * low, x - w, yBot) : g.lineTo(x - w, yBot);
    g.closePath(); g.fill(); g.restore();
    if (ex.glint) circle(g, x + erx * 0.35, fy - ery * 0.35, erx * 0.28, alpha('#ffffff', 0.9));
  });
  // mouth (small, white) — only for strong expressions or when talking
  const mx = fx + R * 0.02, my = fy + R * 0.42, talk = o.talk || 0;
  g.fillStyle = col; g.strokeStyle = col; g.lineWidth = R * 0.05;
  if (talk > 0.05) { g.beginPath(); g.ellipse(mx, my, R * 0.1, R * (0.03 + 0.11 * talk), 0, 0, Math.PI * 2); g.fill(); }
  else switch (ex.mouth) {
    case 'o': g.beginPath(); g.ellipse(mx, my, R * 0.07, R * 0.09, 0, 0, Math.PI * 2); g.fill(); break;
    case 'oBig': g.beginPath(); g.ellipse(mx, my + R * 0.03, R * 0.11, R * 0.15, 0, 0, Math.PI * 2); g.fill(); break;
    case 'smile': g.beginPath(); g.arc(mx, my - R * 0.14, R * 0.15, 0.45, Math.PI - 0.45); g.stroke(); break;
    case 'grin': g.beginPath(); g.moveTo(mx - R * 0.18, my - R * 0.05); g.quadraticCurveTo(mx, my + R * 0.24, mx + R * 0.18, my - R * 0.05); g.closePath(); g.fill(); break;
    case 'smirk': g.beginPath(); g.moveTo(mx - R * 0.1, my); g.quadraticCurveTo(mx + R * 0.04, my + R * 0.04, mx + R * 0.15, my - R * 0.07); g.stroke(); break;
    case 'frown': g.beginPath(); g.arc(mx, my + R * 0.14, R * 0.13, Math.PI + 0.5, Math.PI * 2 - 0.5); g.stroke(); break;
    case 'flat': seg(g, [[mx - R * 0.1, my], [mx + R * 0.1, my]], R * 0.05, col); break;
    case 'wavy': g.beginPath(); for (let i = 0; i <= 12; i++) { const u = i / 12, x = mx - R * 0.14 + u * R * 0.28, y = my + Math.sin(u * Math.PI * 2) * R * 0.035; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); break;
  }
  if (ex.tears) { g.fillStyle = 'rgba(160,215,255,.9)'; for (const x of xs) { g.beginPath(); g.ellipse(x, fy + ry * 1.5, R * 0.035, R * 0.07, 0, 0, Math.PI * 2); g.fill(); } }
  if (ex.sweat) { g.fillStyle = 'rgba(170,220,255,.85)'; g.beginPath(); g.ellipse(cx - R * 0.62, cy - R * 0.45, R * 0.06, R * 0.1, 0, 0, Math.PI * 2); g.fill(); }
  if (ex.blush) { g.fillStyle = 'rgba(255,120,140,.28)'; for (const x of xs) { g.beginPath(); g.ellipse(x, fy + ry * 1.35, R * 0.11, R * 0.05, 0, 0, Math.PI * 2); g.fill(); } }
  g.restore();
}

// ---------- props (held in the near hand unless hand:'B') ----------
// prop: 'phone'|'mug'|'bucket'|'apple'|'coin'|'paper'|'book'|'bag'|'umbrella'|'candy'|'kettle'|'cup'|'pen' or {type, color, hand, glow, rot}
function prop(g, o, K, mode) {
  if (!o.prop) return; const t = typeof o.prop === 'string' ? { type: o.prop } : o.prop, h = (t.hand === 'B' ? K.arms.B : K.arms.F).hand, sil = mode.sil, grow = mode.grow || 0;
  const F = (c) => sil || c, R = K.B.handR;
  g.save(); g.translate(h[0], h[1]); if (t.rot) g.rotate(t.rot);
  switch (t.type) {
    case 'phone': rr(g, -6 - grow, -26 - grow, 15 + grow * 2, 26 + grow * 2, 3); g.fillStyle = F('#1a1a22'); g.fill(); if (!sil) { g.fillStyle = t.glow || '#8fb8ff'; g.fillRect(-4, -24, 11, 21); } break;
    case 'mug': case 'cup': rr(g, -2 - grow, -24 - grow, 20 + grow * 2, 22 + grow * 2, 3); g.fillStyle = F(t.color || '#d9614f'); g.fill(); g.strokeStyle = F(t.color || '#d9614f'); g.lineWidth = 3.5 + grow * 2; g.beginPath(); g.arc(19, -14, 6, -1.4, 1.4); g.stroke(); break;
    case 'bucket': { const c = t.color || '#e8822e'; g.strokeStyle = F('#3a2a2a'); g.lineWidth = 2 + grow * 2; g.beginPath(); g.arc(0, 8, 15, Math.PI, 0); g.stroke(); g.fillStyle = F(c); g.beginPath(); g.ellipse(0, 26, 19 + grow, 17 + grow, 0, 0, Math.PI * 2); g.fill(); if (!sil) { g.strokeStyle = shade(c, -0.35); g.lineWidth = 1.8; g.beginPath(); g.arc(-6, 22, 3, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(6, 22, 3, Math.PI, 0); g.stroke(); seg(g, [[-7, 31], [7, 31]], 1.8, shade(c, -0.35)); } break; }
    case 'apple': circle(g, 6, -4, 11 + grow, F(t.color || '#e0353a')); if (!sil) { seg(g, [[6, -14], [8, -20]], 2, '#4a3020'); circle(g, 2, -8, 3, 'rgba(255,255,255,.35)'); } break;
    case 'coin': circle(g, 6, -6, 8 + grow, F('#e8b84a')); if (!sil) ring(g, 6, -6, 5, 1.5, '#c8962a'); break;
    case 'paper': g.fillStyle = F('#f2efe8'); g.fillRect(-4 - grow, -36 - grow, 30 + grow * 2, 38 + grow * 2); if (!sil) { g.strokeStyle = '#b0aab8'; g.lineWidth = 1.4; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(1, -28 + i * 8); g.lineTo(21, -28 + i * 8); g.stroke(); } } break;
    case 'book': rr(g, -4 - grow, -30 - grow, 34 + grow * 2, 28 + grow * 2, 3); g.fillStyle = F(t.color || '#5a7ab8'); g.fill(); if (!sil) { g.fillStyle = '#f2efe8'; g.fillRect(-2, -6, 30, 3); } break;
    case 'bag': g.strokeStyle = F('#3a3030'); g.lineWidth = 2.5 + grow * 2; g.beginPath(); g.arc(0, 10, 10, Math.PI, 0); g.stroke(); rr(g, -16 - grow, 10 - grow, 32 + grow * 2, 34 + grow * 2, 4); g.fillStyle = F(t.color || '#c9a77a'); g.fill(); break;
    case 'umbrella': seg(g, [[0, 0], [0, -120]], 3 + grow * 2, F('#2a2a32')); g.fillStyle = F(t.color || '#c84a4a'); g.beginPath(); g.moveTo(-70 - grow, -110); g.quadraticCurveTo(0, -190 - grow, 70 + grow, -110); for (let i = 0; i < 4; i++) g.quadraticCurveTo(52 - i * 35, -118, 35 - i * 35, -110); g.closePath(); g.fill(); break;
    case 'candy': g.fillStyle = F(t.color || '#e85a8a'); g.beginPath(); g.ellipse(6, -4, 8 + grow, 6 + grow, 0, 0, Math.PI * 2); g.fill(); poly(g, [[-2, -4], [-9, -9], [-9, 1]], F(t.color || '#e85a8a')); poly(g, [[14, -4], [21, -9], [21, 1]], F(t.color || '#e85a8a')); break;
    case 'kettle': rr(g, -6 - grow, -30 - grow, 36 + grow * 2, 30 + grow * 2, 10); g.fillStyle = F(t.color || '#e8e6ea'); g.fill(); seg(g, [[28, -18], [40, -28]], 5 + grow * 2, F(t.color || '#e8e6ea')); g.strokeStyle = F('#2a2a32'); g.lineWidth = 4 + grow * 2; g.beginPath(); g.arc(12, -30, 12, Math.PI, 0); g.stroke(); break;
    case 'pen': seg(g, [[0, 0], [16, -30]], 4 + grow * 2, F(t.color || '#3a6ab8')); break;
  }
  g.restore();
}

// world position of the head centre and its radius (for bubbles, rings, labels, eye-lines)
export function headPosG(o) {
  const K = skeleton(o), s = o.s ?? 1, f = o.facing ?? 1; let [x, y] = K.head;
  if (o.rot) { const c = Math.cos(o.rot * f), sn = Math.sin(o.rot * f), hy = K.hem[1]; [x, y] = [x * c - (y - hy) * sn, x * sn + (y - hy) * c + hy]; }
  return [o.x + x * f * s, o.y + y * s, K.B.R * s];
}
export function handPosG(o, which = 'F') { const K = skeleton(o), s = o.s ?? 1, f = o.facing ?? 1, h = K.arms[which].hand; return [o.x + h[0] * f * s, o.y + h[1] * s]; }
export const figureHeight = (o) => { const K = skeleton(o); return -(K.head[1] - K.B.R) * (o.s ?? 1); };

// ---------- giant close-up (head + shoulders fill the frame) ----------
// bigGlow(g, cx, cy, R, { outfit, expr, look, blink, talk, turn, rim:{color,w}, rimSide:-1|1, light:[dx,dy], tilt, back, shoulders })
export function bigGlow(g, cx, cy, R, o = {}) {
  const st = S(), of = { top: 'hoodie', hood: 'down', ...(o.outfit || {}) }, col = of.top === 'labcoat' ? '#eceaf0' : of.color || '#8a7a9a';
  const rc = o.rim?.color || o.rimColor || '#f2c890', rw = (o.rim?.w ?? st.rimWidth ?? 3) * (R / 110), side = o.rimSide ?? -1, turn = o.turn ?? 0.35;
  const light = o.light || [side, -0.7];
  g.save(); g.translate(cx, cy); if (o.tilt) g.rotate(o.tilt);
  const sw = R * (o.shoulders ?? 1.45), top = R * 0.86, sx = -turn * R * 0.18;
  const body = (grow, fill) => { g.fillStyle = fill; g.beginPath(); g.moveTo(sx - sw - grow, R * 3); g.lineTo(sx - sw - grow, top + R * 0.5); g.quadraticCurveTo(sx - sw - grow, top - grow, sx - sw + R * 0.55, top - grow); g.lineTo(sx + sw - R * 0.55, top - grow); g.quadraticCurveTo(sx + sw + grow, top - grow, sx + sw + grow, top + R * 0.5); g.lineTo(sx + sw + grow, R * 3); g.closePath(); g.fill(); };
  // edge light on shoulders + head (uniform + lit side)
  body(rw, alpha(rc, 0.92)); circle(g, 0, 0, R + rw, alpha(rc, 0.92));
  if (of.hood === 'up') circle(g, -turn * R * 0.14, R * 0.08, R * 1.2 + rw, alpha(rc, 0.92));
  g.save(); g.translate(side * rw * 0.9, -rw * 0.4); circle(g, 0, 0, R + rw * 0.6, rc); g.restore();
  body(0, linGrad(g, sx - sw, 0, sx + sw, 0, side < 0 ? [shade(col, 0.05), col, shade(col, -0.14)] : [shade(col, -0.14), col, shade(col, 0.05)]));
  if (of.top !== 'none') {
    // hood (down = collar mound around the neck, up = frame around the head)
    if (of.hood === 'up') circle(g, -turn * R * 0.14, R * 0.08, R * 1.2, shade(col, -0.06));
    else if (of.hood !== false && of.top === 'hoodie') { g.fillStyle = shade(col, -0.15); g.beginPath(); g.ellipse(sx - turn * R * 0.2, top + R * 0.06, R * 0.95, R * 0.34, 0, 0, Math.PI * 2); g.fill(); }
    if (of.top === 'hoodie' && of.strings !== false && !o.back) { const sc = of.stringColor || mix(col, '#ffffff', 0.8); for (const dx of [-0.17, 0.17]) { const x0 = sx + turn * R * 0.25 + dx * R; seg(g, [[x0, top + R * 0.2], [x0 + dx * R * 0.06, top + R * 0.95]], R * 0.04, sc); circle(g, x0 + dx * R * 0.06, top + R * 0.98, R * 0.035, shade(sc, -0.25)); } }
  }
  const lx = (light[0] / (Math.hypot(...light) || 1)) * R * 0.55, ly = (light[1] / (Math.hypot(...light) || 1)) * R * 0.55;
  g.fillStyle = headFill(g, lx, ly, R, rc); g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
  if (of.hood === 'up') { g.strokeStyle = alpha(shade(col, 0.22), 0.9); g.lineWidth = R * 0.05; g.beginPath(); g.arc(0, 0, R * 1.03, Math.PI * 0.62, Math.PI * 2.38); g.stroke(); }
  hat(g, of, R, {}, turn);
  if (!o.back) { eyes(g, 0, 0, R, { ...o, turn }, o.eyeColor || st.feature); if (of.glasses) glasses(g, R, o, turn, of.glasses); }
  g.restore();
}

// ---------- tiny "screen people" (inside monitors, phones, diagrams, maps) ----------
// blobby(g, x, y, s, colour, { wave: 0..1, facing, eyes: true, shadow: true })
export function blobby(g, x, y, s = 1, col = '#e88a84', o = {}) {
  g.save(); g.translate(x, y); g.scale((o.facing || 1) * s, s);
  if (o.shadow !== false) { g.fillStyle = 'rgba(40,50,80,.16)'; g.beginPath(); g.ellipse(0, 2, 30, 6, 0, 0, Math.PI * 2); g.fill(); }
  const d = shade(col, -0.08);
  rr(g, -13, -26, 10, 26, 4); g.fillStyle = d; g.fill(); rr(g, 3, -26, 10, 26, 4); g.fill();
  rr(g, -21, -70, 42, 50, 18); g.fillStyle = col; g.fill();
  const wv = o.wave ?? 0; seg(g, [[14, -58], [30, -66 - 14 * wv], [40 + 6 * wv, -80 - 8 * wv]], 9, col);
  circle(g, 0, -88, 20, col);
  if (o.eyes !== false) { circle(g, -6, -90, 3.2, '#ffffff'); circle(g, 6, -90, 3.2, '#ffffff'); }
  g.restore();
}
