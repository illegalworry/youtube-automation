// engine/hero.js — game-world characters. ONE rig, three skins chosen by the current world (W()):
//   blocky  — rounded block avatar: big rounded-square head, block torso with a logo, block arms/legs, dark outline, glossy highlights
//   voxel   — cube sandbox character: square head with a PIXEL face, flat-shaded boxes with a darker side face, pixel textures
//   royale  — cartoon battle-royale human: round head, big eyes, hair shapes, tapered torso, bendy capsule limbs, sneakers
// Characters stand FRONT-facing by default (like the reference channel); view: 'side' for walking, running and jumping across.
//
// Pose = { aL, aR, lL, lR, eL, eR, y, tilt, ht, sit } — angles in radians:
//   aL/aR arm angle (0 = hanging down, π/2 = straight out, π = straight up), lL/lR leg spread, eL/eR elbow bend (royale),
//   y = body lift (negative = up, e.g. a hop), tilt = whole-body lean, ht = head tilt, sit = 0..1 (legs fold).
// In 'side' view aR/aL swing forward (+) / back (−) instead of out.
import { E, W, S, clamp, lerp, mixVal, ease, rr, circle, poly, seg, alpha, shade, mix, text, F, FONTS } from './core.js';

// ---------- poses ----------
const P0 = { aL: 0.12, aR: 0.12, lL: 0.04, lR: 0.04, eL: 0, eR: 0, y: 0, tilt: 0, ht: 0, sit: 0 };
const P = (o) => ({ ...P0, ...o });
export const HPOSES = {
  idle: P({}),
  relaxed: P({ aL: 0.2, aR: 0.08, lR: 0.08, ht: 0.03 }),
  wave: P({ aR: 2.55, eR: 0.5, aL: 0.15 }),
  cheer: P({ aL: 2.55, aR: 2.55, lL: 0.12, lR: 0.12, eL: 0.2, eR: 0.2 }),
  panic: P({ aL: 2.35, aR: 2.75, lL: 0.14, lR: 0.1, eL: 0.4, eR: 0.2, ht: -0.04 }),      // the "WHAT?!" arms-up V
  shrug: P({ aL: 1.05, aR: 1.05, eL: -0.9, eR: -0.9, ht: 0.06 }),
  tpose: P({ aL: 1.57, aR: 1.57 }),
  armsOut: P({ aL: 0.75, aR: 0.75, eL: 0.3, eR: 0.3 }),                                   // explaining / presenting
  point: P({ aR: 1.5, aL: 0.12 }),
  pointUp: P({ aR: 2.95, aL: 0.15 }),
  think: P({ aR: 2.0, eR: 2.0, aL: 0.4, eL: 1.2, ht: 0.08 }),
  facepalm: P({ aR: 2.3, eR: 1.9, aL: 0.1, ht: 0.12 }),
  handsOnHead: P({ aL: 2.6, aR: 2.6, eL: 2.2, eR: 2.2 }),
  hold: P({ aL: 0.55, aR: 0.55, eL: 0.6, eR: 0.6 }),                                       // holding something in front
  victory: P({ aR: 2.9, aL: 0.4, lL: 0.12, lR: 0.08 }),
  jump: P({ aL: 2.65, aR: 2.65, lL: 0.3, lR: 0.3, eL: 0.2, eR: 0.2 }),
  starJump: P({ aL: 2.3, aR: 2.3, lL: 0.45, lR: 0.45 }),
  fall: P({ aL: 2.2, aR: 1.3, lL: 0.55, lR: 0.18, tilt: 0.35, eL: 0.4 }),
  flail: P({ aL: 2.0, aR: 2.8, lL: 0.4, lR: 0.1, eL: 0.6, eR: 0.3, tilt: -0.15 }),
  sit: P({ aL: 0.3, aR: 0.3, eL: 0.5, eR: 0.5, sit: 1 }),
  sad: P({ aL: 0.04, aR: 0.04, ht: 0.18, y: 4 }),
  crouch: P({ aL: 0.5, aR: 0.5, eL: 0.8, eR: 0.8, sit: 0.55, y: 0 }),
  dab: P({ aL: 1.9, aR: 2.4, eR: 2.1, ht: 0.3 }),
};
export const hpose = (p) => (typeof p === 'string' ? HPOSES[p] || HPOSES.idle : p || HPOSES.idle);
export const heroBlend = (a, b, k) => mixVal(hpose(a), hpose(b), k);
// heroPoseAt(t, [[0,'idle'],[0.6,'panic']], 0.25) — holds poses, blends over `blend` seconds
export function heroPoseAt(t, keys, blend = 0.25) {
  let cur = hpose(keys[0][1]);
  for (let i = 1; i < keys.length; i++) {
    const [ti, pi] = keys[i]; if (t < ti) break;
    const k = clamp((t - ti) / blend); cur = k >= 1 ? hpose(pi) : heroBlend(cur, pi, ease.out(k)); if (k < 1) return cur;
  }
  return cur;
}
function _spring(x, f = 2.8, z = 0.45) { if (x <= 0) return 0; const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x)); }
// heroSpring(t, keys) — like heroPoseAt but every change overshoots and settles (snappy cartoon acting)
export function heroSpring(t, keys, o = {}) {
  let cur = hpose(keys[0][1]);
  for (let i = 1; i < keys.length; i++) { const [ti, pi] = keys[i]; if (t < ti) break; cur = mixVal(cur, hpose(pi), _spring(t - ti, o.freq ?? 2.8, o.damp ?? 0.45)); }
  return cur;
}
// idle life on top of any pose: breathing bob + tiny arm sway (never a frozen character)
export function heroIdle(p, t, amt = 1, seed = 0) {
  const q = { ...hpose(p) }; q.y += Math.sin(t * 2.4 + seed) * 1.6 * amt; q.aL += Math.sin(t * 1.7 + seed) * 0.035 * amt; q.aR += Math.sin(t * 1.9 + seed + 1) * 0.035 * amt; q.ht += Math.sin(t * 1.1 + seed) * 0.015 * amt; return q;
}
// flailing arms for panic moments (adds fast oscillation)
export function heroFlail(p, t, amt = 1) { const q = { ...hpose(p) }; q.aL += Math.sin(t * 17) * 0.35 * amt; q.aR += Math.sin(t * 15 + 2) * 0.35 * amt; q.ht += Math.sin(t * 11) * 0.05 * amt; return q; }
// walk / run cycle for view:'side' (phase = t * 2π * steps/s)
export function heroWalk(phase, o = {}) {
  const run = !!o.run, sw = run ? 0.95 : 0.55, ls = run ? 0.7 : 0.42;
  return P({ aR: Math.sin(phase) * sw, aL: -Math.sin(phase) * sw, lR: -Math.sin(phase) * ls, lL: Math.sin(phase) * ls, eR: run ? 1.2 : 0.2, eL: run ? 1.2 : 0.2,
    y: -Math.abs(Math.sin(phase)) * (run ? 10 : 4), tilt: run ? 0.12 : 0.03 });
}

// ---------- expressions ----------
// eyes: wide | dot | happy | star | half | x | closed | tiny | heart     mouth: open | smile | grin | o | oBig | wavy | flat | smirk | sad | teeth | tongue
export const HEXPR = {
  neutral:   { eyes: 'dot', mouth: 'smile' },
  smile:     { eyes: 'dot', mouth: 'smile' },
  happy:     { eyes: 'wide', mouth: 'open' },
  grin:      { eyes: 'wide', mouth: 'grin' },
  laugh:     { eyes: 'happy', mouth: 'open' },
  excited:   { eyes: 'star', mouth: 'open' },
  love:      { eyes: 'heart', mouth: 'open', blush: true },
  surprised: { eyes: 'wide', mouth: 'o', brows: 'raised' },
  shocked:   { eyes: 'tiny', mouth: 'oBig', brows: 'raised' },
  scared:    { eyes: 'tiny', mouth: 'wavy', brows: 'worried', sweat: 2 },
  worried:   { eyes: 'wide', mouth: 'wavy', brows: 'worried', sweat: 1 },
  nervous:   { eyes: 'wide', mouth: 'open', brows: 'worried', sweat: 2 },   // "okay okay, I can explain"
  sly:       { eyes: 'half', mouth: 'smirk', brows: 'sly' },
  smug:      { eyes: 'half', mouth: 'grin', brows: 'sly' },
  determined:{ eyes: 'half', mouth: 'flat', brows: 'angry' },
  angry:     { eyes: 'wide', mouth: 'teeth', brows: 'angry' },
  sad:       { eyes: 'dot', mouth: 'sad', brows: 'worried' },
  cry:       { eyes: 'closed', mouth: 'sad', brows: 'worried', tears: true },
  dead:      { eyes: 'x', mouth: 'wavy' },
  sleepy:    { eyes: 'closed', mouth: 'o' },
  confused:  { eyes: 'wide', mouth: 'wavy', brows: 'sly', q: true },
  cool:      { eyes: 'half', mouth: 'smile' },
  silly:     { eyes: 'wide', mouth: 'tongue' },
};

// ---------- outfits ----------
// { skin, hair: fringe|spiky|cap|beanie|long|bun|bald|helmet|quiff|bob|ponytail|none, hairColor, shirt, shirt2, logo: bolt|star|heart|stripe|num|none,
//   logoColor, num, pants, shoes, acc: crown|headphones|cape|backpack|none, accColor, kid }
export const OUTFIT_DEFAULTS = {
  blocky: { skin: '#f1ece6', hair: 'fringe', hairColor: '#9a5a2a', shirt: '#ff4a2a', logo: 'bolt', logoColor: '#ffffff', pants: '#ff4a2a', shoes: null },
  voxel:  { skin: '#e0b090', hair: 'spiky', hairColor: '#e8a020', shirt: '#e8562a', logo: 'none', logoColor: '#ffffff', pants: '#3a3a46', shoes: '#2a2a2a' },   // original look — never the default characters of any real game
  royale: { skin: '#f2c2a0', hair: 'quiff', hairColor: '#f2b02a', shirt: '#3a7aff', logo: 'stripe', logoColor: '#ffcc2a', pants: '#2a3a6a', shoes: '#ffffff' },
};

// ---------- geometry per world (s = 1) ----------
const GEO = {
  blocky: { hip: -84, legL: 84, legW: 36, legX: 19, torW: 80, torH: 84, armL: 84, armW: 32, armX: 56, armY: -158, headW: 78, headH: 72, headY: -207, round: 15 },
  voxel:  { hip: -86, legL: 86, legW: 32, legX: 16, torW: 64, torH: 86, armL: 86, armW: 30, armX: 47, armY: -165, headW: 74, headH: 74, headY: -211, round: 0 },
  royale: { hip: -98, legL: 98, legW: 26, legX: 16, torW: 84, torH: 82, armL: 92, armW: 22, armX: 50, armY: -172, headW: 92, headH: 92, headY: -232, round: 46 },
};
export const heroGeo = (world = W()) => GEO[world] || GEO.blocky;
// head centre + half size of a hero in world coordinates (for bubbles, tags, look-at, close-ups)
export function heroHeadPos(o) {
  const G = heroGeo(o.world), s = (o.s ?? 1) * (o.outfit?.kid ? 0.78 : 1), p = hpose(o.pose);
  return [o.x, o.y + (G.headY + (p.y || 0) + (p.sit || 0) * G.legL * 0.55) * s, G.headW / 2 * s];
}

// ---------- drawing helpers ----------
function box(g, x, y, w, h, r, fill, line, lw) { rr(g, x, y, w, h, Math.max(0.01, r)); g.fillStyle = fill; g.fill(); if (lw > 0) { g.lineWidth = lw; g.strokeStyle = line; g.lineJoin = 'round'; g.stroke(); } }
function gloss(g, x, y, w, h, a = 0.32) { rr(g, x, y, w, h, Math.min(w, h) / 2); g.fillStyle = `rgba(255,255,255,${a})`; g.fill(); }
// flat voxel cuboid seen from the front: front face + a darker right side face + optional lighter top face
function vox(g, x, y, w, h, fill, side = 0.12, top = 0) {
  g.fillStyle = fill; g.fillRect(x, y, w, h);
  if (side) { g.fillStyle = shade(fill, -0.28); g.fillRect(x + w - w * side, y, w * side, h); }
  if (top) { g.fillStyle = shade(fill, 0.18); g.fillRect(x, y, w, h * top); }
}
// cheap deterministic pixel noise texture on a voxel face (n x m pixels)
function pixelTex(g, x, y, w, h, base, n = 8, m = 8, amt = 0.12, seed = 1) {
  const pw = w / n, ph = h / m;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const r = Math.sin((i + 1) * 12.9898 + (j + 1) * 78.233 + seed * 3.7) * 43758.5453, v = (r - Math.floor(r)) * 2 - 1;
    if (Math.abs(v) < 0.45) continue; g.fillStyle = shade(base, v * amt); g.fillRect(x + i * pw, y + j * ph, pw + 0.5, ph + 0.5);
  }
}
const star = (g, x, y, r, col, line) => { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); g.fillStyle = col; g.fill(); if (line) { g.lineWidth = r * 0.18; g.strokeStyle = line; g.stroke(); } };
const heart = (g, x, y, r, col) => { g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.4, y - r * 0.2, x - r * 0.6, y - r * 1.2, x, y - r * 0.35); g.bezierCurveTo(x + r * 0.6, y - r * 1.2, x + r * 1.4, y - r * 0.2, x, y + r * 0.9); g.fillStyle = col; g.fill(); };
export function sweatDrop(g, x, y, r, a = 1) {
  g.save(); g.globalAlpha *= a; g.beginPath(); g.moveTo(x, y - r * 1.5); g.quadraticCurveTo(x + r * 1.05, y - r * 0.1, x, y + r); g.quadraticCurveTo(x - r * 1.05, y - r * 0.1, x, y - r * 1.5); g.closePath();
  g.fillStyle = '#5ab8ff'; g.fill(); g.lineWidth = r * 0.22; g.strokeStyle = '#1a5aa0'; g.stroke(); circle(g, x - r * 0.3, y - r * 0.1, r * 0.25, 'rgba(255,255,255,.85)'); g.restore();
}

// ---------- cartoon face (blocky + royale) ----------
function cartoonFace(g, cx, cy, w, h, o, ex, ink) {
  const look = o.look || [0, 0], blink = o.blink, sz = Math.min(w, h), ex2 = { ...ex }, side = o.view === 'side' ? (o.facing || 1) : 0;
  const ox = side * w * 0.16, ey = cy - h * 0.06, sep = (side ? 0.2 : 0.235) * w, er = sz * 0.165;
  const eyes = blink && !['x', 'closed', 'happy'].includes(ex2.eyes) ? 'closed' : ex2.eyes;
  for (const sd of [-1, 1]) {
    const x = cx + ox + sd * sep, y = ey;
    if (side && sd === -side) { if (eyes !== 'closed') continue; }
    switch (eyes) {
      case 'wide': case 'tiny': case 'half': {
        circle(g, x, y, er, '#ffffff'); g.lineWidth = sz * 0.035; g.strokeStyle = ink; g.beginPath(); g.arc(x, y, er, 0, Math.PI * 2); g.stroke();
        const pr = eyes === 'tiny' ? er * 0.28 : er * 0.42; circle(g, x + look[0] * er * 0.42, y + look[1] * er * 0.42 + (eyes === 'half' ? er * 0.2 : 0), pr, ink);
        if (eyes !== 'tiny') circle(g, x + look[0] * er * 0.42 - pr * 0.35, y + look[1] * er * 0.42 - pr * 0.35 + (eyes === 'half' ? er * 0.2 : 0), pr * 0.28, '#ffffff');
        if (eyes === 'half') { g.save(); g.beginPath(); g.arc(x, y, er + 1, 0, Math.PI * 2); g.clip(); g.fillStyle = o._skin; g.fillRect(x - er - 2, y - er - 2, er * 2 + 4, er * 0.95); g.restore(); seg(g, [[x - er * 1.05, y - er * 0.08], [x + er * 1.05, y - er * 0.08]], sz * 0.04, ink); }
        break; }
      case 'dot': g.fillStyle = ink; g.beginPath(); g.ellipse(x + look[0] * er * 0.3, y + look[1] * er * 0.3, er * 0.42, er * 0.62, 0, 0, Math.PI * 2); g.fill(); circle(g, x - er * 0.12 + look[0] * er * 0.3, y - er * 0.25, er * 0.14, '#fff'); break;
      case 'happy': g.lineWidth = sz * 0.05; g.strokeStyle = ink; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + er * 0.35, er * 0.7, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); break;
      case 'closed': seg(g, [[x - er * 0.7, y + er * 0.1], [x + er * 0.7, y + er * 0.1]], sz * 0.045, ink); break;
      case 'star': star(g, x, y, er * 1.05, '#ffd23f', ink); break;
      case 'heart': heart(g, x, y, er * 0.9, '#ff3a6a'); break;
      case 'x': g.lineCap = 'round'; seg(g, [[x - er * 0.6, y - er * 0.6], [x + er * 0.6, y + er * 0.6]], sz * 0.05, ink); seg(g, [[x - er * 0.6, y + er * 0.6], [x + er * 0.6, y - er * 0.6]], sz * 0.05, ink); break;
    }
    // brows
    const bw = sz * 0.04, by = y - er * 1.35;
    if (ex2.brows === 'worried') seg(g, [[x - sd * er * 0.9, by + er * 0.05], [x + sd * er * 0.7, by - er * 0.35]].map(([a, b]) => [a, b]), bw, ink);
    else if (ex2.brows === 'angry') seg(g, [[x - sd * er * 0.9, by - er * 0.3], [x + sd * er * 0.8, by + er * 0.25]], bw, ink);
    else if (ex2.brows === 'raised') { g.lineWidth = bw; g.strokeStyle = ink; g.lineCap = 'round'; g.beginPath(); g.arc(x, by + er * 0.5, er * 0.85, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
    else if (ex2.brows === 'sly') seg(g, sd > 0 ? [[x - er * 0.8, by - er * 0.35], [x + er * 0.8, by - er * 0.1]] : [[x - er * 0.8, by + er * 0.15], [x + er * 0.8, by + er * 0.15]], bw, ink);
  }
  // mouth
  const mx = cx + ox * 1.1, my = cy + h * 0.27, mw = w * 0.2, talk = o.talk || 0;
  let mouth = ex2.mouth; if (talk > 0.15 && !['open', 'oBig', 'grin'].includes(mouth)) mouth = 'open';
  g.lineCap = 'round'; g.lineJoin = 'round';
  const dark = '#3a0f1a', tongue = '#ff7a9a';
  switch (mouth) {
    case 'smile': g.lineWidth = sz * 0.045; g.strokeStyle = ink; g.beginPath(); g.arc(mx, my - mw * 0.6, mw * 0.85, Math.PI * 0.2, Math.PI * 0.8); g.stroke(); break;
    case 'open': case 'grin': case 'tongue': {
      const oh = (mouth === 'grin' ? 0.75 : 0.95 + talk * 0.4) * mw;
      g.beginPath(); g.moveTo(mx - mw, my - oh * 0.35); g.lineTo(mx + mw, my - oh * 0.35); g.quadraticCurveTo(mx + mw * 0.95, my + oh * 0.9, mx, my + oh * 0.95); g.quadraticCurveTo(mx - mw * 0.95, my + oh * 0.9, mx - mw, my - oh * 0.35); g.closePath();
      g.fillStyle = dark; g.fill(); g.save(); g.clip();
      g.fillStyle = '#fff'; g.fillRect(mx - mw, my - oh * 0.4, mw * 2, oh * 0.32);
      if (mouth !== 'grin') { g.fillStyle = tongue; g.beginPath(); g.ellipse(mx, my + oh * 0.75, mw * 0.6, oh * 0.45, 0, 0, Math.PI * 2); g.fill(); }
      g.restore(); g.lineWidth = sz * 0.035; g.strokeStyle = ink; g.stroke();
      if (mouth === 'tongue') { g.fillStyle = tongue; rr(g, mx - mw * 0.35, my + oh * 0.6, mw * 0.7, oh * 0.8, mw * 0.35); g.fill(); g.lineWidth = sz * 0.025; g.stroke(); }
      break; }
    case 'o': g.fillStyle = dark; g.beginPath(); g.ellipse(mx, my + mw * 0.15, mw * 0.32, mw * 0.42, 0, 0, Math.PI * 2); g.fill(); g.lineWidth = sz * 0.03; g.strokeStyle = ink; g.stroke(); break;
    case 'oBig': g.fillStyle = dark; g.beginPath(); g.ellipse(mx, my + mw * 0.3, mw * 0.55, mw * 0.8, 0, 0, Math.PI * 2); g.fill(); g.save(); g.clip(); circle(g, mx, my + mw * 0.95, mw * 0.4, tongue); g.restore(); g.lineWidth = sz * 0.035; g.strokeStyle = ink; g.stroke(); break;
    case 'wavy': { g.lineWidth = sz * 0.045; g.strokeStyle = ink; g.beginPath(); for (let i = 0; i <= 16; i++) { const u = i / 16; g.lineTo(mx - mw * 0.8 + u * mw * 1.6, my + Math.sin(u * Math.PI * 3) * mw * 0.16); } g.stroke(); break; }
    case 'flat': seg(g, [[mx - mw * 0.55, my + mw * 0.05], [mx + mw * 0.55, my + mw * 0.05]], sz * 0.045, ink); break;
    case 'smirk': g.lineWidth = sz * 0.045; g.strokeStyle = ink; g.beginPath(); g.moveTo(mx - mw * 0.6, my + mw * 0.1); g.quadraticCurveTo(mx + mw * 0.2, my + mw * 0.35, mx + mw * 0.75, my - mw * 0.25); g.stroke(); break;
    case 'sad': g.lineWidth = sz * 0.045; g.strokeStyle = ink; g.beginPath(); g.arc(mx, my + mw * 0.75, mw * 0.7, Math.PI * 1.22, Math.PI * 1.78); g.stroke(); break;
    case 'teeth': { box(g, mx - mw * 0.85, my - mw * 0.3, mw * 1.7, mw * 0.65, mw * 0.2, '#fff', ink, sz * 0.03); for (let i = 1; i < 4; i++) seg(g, [[mx - mw * 0.85 + i * mw * 0.425, my - mw * 0.3], [mx - mw * 0.85 + i * mw * 0.425, my + mw * 0.35]], sz * 0.02, ink); seg(g, [[mx - mw * 0.85, my + mw * 0.02], [mx + mw * 0.85, my + mw * 0.02]], sz * 0.02, ink); break; }
  }
  if (ex2.blush) { circle(g, cx - w * 0.33 + ox, cy + h * 0.15, sz * 0.07, 'rgba(255,90,120,.45)'); circle(g, cx + w * 0.33 + ox, cy + h * 0.15, sz * 0.07, 'rgba(255,90,120,.45)'); }
  if (ex2.tears) for (const sd of [-1, 1]) { g.fillStyle = 'rgba(90,184,255,.9)'; rr(g, cx + ox + sd * sep - er * 0.25, ey + er * 0.5, er * 0.5, h * 0.35, er * 0.25); g.fill(); }
}

// ---------- pixel face (voxel) — 8×8 grid on the head front ----------
function pixelFace(g, x0, y0, w, h, o, ex, of) {
  const px = w / 8, ink = '#2a1a12', white = '#ffffff', dark = '#5a2a1a';
  const P = (i, j, c, ww = 1, hh = 1) => { g.fillStyle = c; g.fillRect(x0 + i * px, y0 + j * px, ww * px + 0.6, hh * px + 0.6); };
  const side = o.view === 'side' ? (o.facing || 1) : 0, shift = side;
  const lk = Math.round(clamp((o.look?.[0] || 0), -1, 1));
  let eyes = o.blink && !['x', 'closed', 'happy'].includes(ex.eyes) ? 'closed' : ex.eyes;
  for (const [ix, sd] of [[1, -1], [5, 1]]) {
    const i = ix + shift; if (side && sd === -side) continue;
    switch (eyes) {
      case 'closed': case 'happy': P(i, 4, ink, 2, 1); break;
      case 'x': P(i, 3, ink); P(i + 1, 4, ink); P(i, 5, ink); P(i + 1, 3, ink); P(i, 4, ink); P(i + 1, 5, ink); break;
      case 'star': P(i, 4, '#ffd23f', 2, 1); P(i + (sd > 0 ? 0 : 1), 3, '#ffd23f'); break;
      case 'heart': P(i, 4, '#ff3a6a', 2, 1); P(i, 3, '#ff3a6a'); break;
      case 'tiny': P(i, 3, white, 2, 2); P(i + (sd > 0 ? 0 : 1), 4, ink); break;
      case 'half': P(i, 4, white, 2, 1); P(i + (lk > 0 ? 1 : sd > 0 ? 0 : 1), 4, ink); P(i, 3, shade(of.skin, -0.25), 2, 1); break;
      default: P(i, 4, white, 2, 1); P(i + (lk > 0 ? 1 : lk < 0 ? 0 : sd > 0 ? 0 : 1), 4, eyes === 'dot' ? '#4a3aa8' : ink); break;
    }
    if (ex.brows === 'angry') P(i + (sd > 0 ? 0 : 1), 3, ink), P(i + (sd > 0 ? 1 : 0), 2, ink);
    if (ex.brows === 'worried') P(i + (sd > 0 ? 1 : 0), 3, ink), P(i + (sd > 0 ? 0 : 1), 2, ink);
  }
  const m = (o.talk || 0) > 0.2 ? 'oBig' : ex.mouth, mi = 3 + shift;
  switch (m) {
    case 'open': case 'oBig': case 'o': P(mi, 6, dark, 2, 1); if (m !== 'o') P(mi, 7, dark, 2, 1); break;
    case 'grin': case 'tongue': P(mi - 1, 6, white, 4, 1); P(mi - 1, 7, dark, 4, 1); break;
    case 'smile': case 'smirk': P(mi - 1, 6, dark); P(mi, 7, dark, 2, 1); P(mi + 2, 6, dark); break;
    case 'sad': P(mi - 1, 7, dark); P(mi, 6, dark, 2, 1); P(mi + 2, 7, dark); break;
    case 'wavy': P(mi - 1, 6, dark); P(mi, 7, dark); P(mi + 1, 6, dark); P(mi + 2, 7, dark); break;
    case 'teeth': P(mi - 1, 6, white, 4, 1); break;
    default: P(mi, 6, dark, 2, 1);
  }
  if (ex.tears) { P(1 + shift, 5, '#5ab8ff'); P(6 + shift, 5, '#5ab8ff'); P(1 + shift, 6, '#5ab8ff'); }
  if (ex.blush) { P(0 + shift, 5, '#ff7a8a'); P(7 + shift, 5, '#ff7a8a'); }
}

// ---------- hair / hats ----------
function hairBlocky(g, cx, top, w, h, of, ink, lw, front) {
  const c = of.hairColor, kind = of.hair, x0 = cx - w / 2, r = w * 0.2;
  const outline = () => { g.lineWidth = lw; g.strokeStyle = ink; g.lineJoin = 'round'; g.stroke(); };
  if (kind === 'none' || kind === 'bald') return;
  if (kind === 'fringe' || kind === 'long' || kind === 'bun') {
    g.beginPath(); g.moveTo(x0 - w * 0.06, top + h * (kind === 'long' ? 1.05 : 0.62)); g.lineTo(x0 - w * 0.08, top + h * 0.15); g.quadraticCurveTo(x0 - w * 0.06, top - h * 0.18, cx, top - h * 0.2); g.quadraticCurveTo(x0 + w * 1.06, top - h * 0.18, x0 + w * 1.08, top + h * 0.15);
    g.lineTo(x0 + w * 1.06, top + h * (kind === 'long' ? 1.05 : 0.62));
    // jagged fringe across the forehead
    const n = 6; for (let i = n; i >= 0; i--) { const xx = x0 + w * 1.02 - (i === n ? 0 : (n - i) * w * 1.04 / n); g.lineTo(x0 + w * (1.0 - (n - i) / n * 1.0), top + h * (i % 2 ? 0.34 : 0.22)); }
    g.closePath(); g.fillStyle = c; g.fill(); outline();
    g.lineWidth = lw * 0.7; g.strokeStyle = shade(c, -0.3); for (let k = 0; k < 3; k++) { g.beginPath(); const yy = top - h * 0.04 + k * h * 0.06; g.moveTo(x0 + w * 0.15, yy); for (let i = 0; i <= 8; i++) g.lineTo(x0 + w * 0.15 + i * w * 0.0875, yy + Math.sin(i * 1.7) * h * 0.02); g.stroke(); }
    if (kind === 'bun') { circle(g, cx, top - h * 0.3, w * 0.2, c); g.lineWidth = lw; g.strokeStyle = ink; g.beginPath(); g.arc(cx, top - h * 0.3, w * 0.2, 0, Math.PI * 2); g.stroke(); }
  } else if (kind === 'spiky') {
    g.beginPath(); g.moveTo(x0 - w * 0.06, top + h * 0.35); for (let i = 0; i <= 6; i++) { const u = i / 6; g.lineTo(x0 + u * w * 1.12 - w * 0.06, top - h * (i % 2 ? 0.05 : 0.32)); } g.lineTo(x0 + w * 1.06, top + h * 0.35); g.lineTo(x0 + w * 0.5, top + h * 0.18); g.closePath(); g.fillStyle = c; g.fill(); outline();
  } else if (kind === 'cap' || kind === 'beanie' || kind === 'helmet') {
    const cc = of.hatColor || c; rr(g, x0 - w * 0.05, top - h * 0.18, w * 1.1, h * 0.48, r); g.fillStyle = cc; g.fill(); outline();
    if (kind === 'cap') { rr(g, cx - w * 0.1, top + h * 0.2, w * 0.75, h * 0.12, h * 0.06); g.fillStyle = shade(cc, -0.15); g.fill(); outline(); }
    if (kind === 'beanie') { circle(g, cx, top - h * 0.24, w * 0.1, '#fff'); g.fillStyle = shade(cc, -0.12); g.fillRect(x0 - w * 0.05, top + h * 0.18, w * 1.1, h * 0.12); }
    if (kind === 'helmet') { g.fillStyle = '#2a2f3a'; g.fillRect(x0 + w * 0.1, top + h * 0.3, w * 0.8, h * 0.08); }
  }
}
function hairVoxel(g, x0, y0, w, h, of) {
  const px = w / 8, c = of.hairColor, kind = of.hair; if (kind === 'none' || kind === 'bald') return;
  const P = (i, j, ww = 1, hh = 1, col = c) => { g.fillStyle = col; g.fillRect(x0 + i * px, y0 + j * px, ww * px + 0.6, hh * px + 0.6); };
  if (kind === 'cap' || kind === 'helmet' || kind === 'beanie') { const cc = of.hatColor || c; P(-0.3, -0.6, 8.6, 2.2, cc); if (kind === 'cap') P(3, 1.4, 5.6, 0.7, shade(cc, -0.2)); if (kind === 'helmet') P(-0.3, 1.6, 8.6, 0.5, shade(cc, -0.3)); return; }
  P(0, 0, 8, 2); P(0, 2, 1, kind === 'long' ? 5 : 2); P(7, 2, 1, kind === 'long' ? 5 : 2); P(1, 2, 1, 1); if (kind === 'spiky') { P(1, -1, 1, 1); P(3, -1, 1, 1); P(5, -1, 1, 1); }
  pixelTex(g, x0, y0, w, px * 2, c, 8, 2, 0.18, 7);
}
function hairRoyale(g, cx, cy, r, of, ink, lw) {
  const c = of.hairColor, kind = of.hair; if (kind === 'none' || kind === 'bald') return;
  const st = () => { g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); };
  g.beginPath();
  if (kind === 'quiff' || kind === 'fringe') { g.moveTo(cx - r * 1.02, cy - r * 0.05); g.quadraticCurveTo(cx - r * 1.1, cy - r * 1.1, cx - r * 0.1, cy - r * 1.25); g.quadraticCurveTo(cx + r * 0.9, cy - r * 1.55, cx + r * 1.1, cy - r * 0.6); g.quadraticCurveTo(cx + r * 1.05, cy - r * 0.2, cx + r * 0.98, cy - r * 0.05); g.quadraticCurveTo(cx + r * 0.6, cy - r * 0.55, cx - r * 0.1, cy - r * 0.6); g.quadraticCurveTo(cx - r * 0.75, cy - r * 0.55, cx - r * 1.02, cy - r * 0.05); }
  else if (kind === 'bob' || kind === 'long') { g.moveTo(cx - r * 1.12, cy + r * (kind === 'long' ? 1.2 : 0.55)); g.quadraticCurveTo(cx - r * 1.3, cy - r * 1.3, cx, cy - r * 1.18); g.quadraticCurveTo(cx + r * 1.3, cy - r * 1.3, cx + r * 1.12, cy + r * (kind === 'long' ? 1.2 : 0.55)); g.lineTo(cx + r * 0.85, cy + r * 0.2); g.quadraticCurveTo(cx + r * 0.6, cy - r * 0.6, cx, cy - r * 0.55); g.quadraticCurveTo(cx - r * 0.6, cy - r * 0.6, cx - r * 0.85, cy + r * 0.2); }
  else if (kind === 'ponytail' || kind === 'bun') { circle(g, cx + r * 0.9, cy - r * 0.9, r * 0.38, c); g.beginPath(); g.moveTo(cx - r * 1.02, cy - r * 0.05); g.quadraticCurveTo(cx - r * 1.1, cy - r * 1.2, cx, cy - r * 1.12); g.quadraticCurveTo(cx + r * 1.1, cy - r * 1.2, cx + r * 1.02, cy - r * 0.05); g.quadraticCurveTo(cx, cy - r * 0.62, cx - r * 1.02, cy - r * 0.05); }
  else if (kind === 'spiky') { g.moveTo(cx - r * 1.02, cy - r * 0.1); for (let i = 0; i <= 7; i++) { const a = Math.PI * (1.05 + i * 0.13); const rr2 = i % 2 ? r * 1.05 : r * 1.45; g.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2); } g.lineTo(cx + r * 1.02, cy - r * 0.1); g.quadraticCurveTo(cx, cy - r * 0.6, cx - r * 1.02, cy - r * 0.1); }
  else if (kind === 'cap' || kind === 'beanie' || kind === 'helmet') { const cc = of.hatColor || c; g.moveTo(cx - r * 1.05, cy - r * 0.15); g.quadraticCurveTo(cx - r * 1.05, cy - r * 1.25, cx, cy - r * 1.2); g.quadraticCurveTo(cx + r * 1.05, cy - r * 1.25, cx + r * 1.05, cy - r * 0.15); g.closePath(); g.fillStyle = cc; g.fill(); st(); if (kind === 'cap') { g.beginPath(); g.ellipse(cx + r * 0.6, cy - r * 0.2, r * 0.7, r * 0.16, -0.1, 0, Math.PI * 2); g.fillStyle = shade(cc, -0.15); g.fill(); st(); } return; }
  g.closePath(); g.fillStyle = c; g.fill(); st();
  g.save(); g.globalAlpha *= 0.35; g.beginPath(); g.ellipse(cx - r * 0.3, cy - r * 0.95, r * 0.35, r * 0.1, -0.3, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); g.restore();
}

// ---------- logos / tools ----------
function logo(g, kind, x, y, sz, col, ink, num) {
  if (!kind || kind === 'none') return;
  g.save(); g.lineJoin = 'round';
  if (kind === 'bolt') { g.beginPath(); const p = [[0.1, -0.55], [-0.32, 0.08], [-0.02, 0.08], [-0.14, 0.6], [0.34, -0.12], [0.03, -0.12], [0.18, -0.55]]; p.forEach(([a, b], i) => (i ? g.lineTo : g.moveTo).call(g, x + a * sz, y + b * sz)); g.closePath(); g.fillStyle = col; g.fill(); g.lineWidth = sz * 0.07; g.strokeStyle = ink; g.stroke(); }
  else if (kind === 'star') star(g, x, y, sz * 0.42, col, ink);
  else if (kind === 'heart') heart(g, x, y, sz * 0.36, col);
  else if (kind === 'stripe') { g.fillStyle = col; g.fillRect(x - sz * 0.62, y - sz * 0.12, sz * 1.24, sz * 0.24); }
  else if (kind === 'num') text(g, String(num ?? 1), x, y, { size: sz * 0.8, font: FONTS.ui, weight: 900, color: col, stroke: sz * 0.08, strokeColor: ink });
  g.restore();
}
// tools are drawn in the hand's local frame (arm points down +y, hand at y = L)
function tool(g, kind, L, s, ink, lw) {
  if (!kind) return; g.save(); g.translate(0, L); g.lineJoin = 'round';
  const o = (fn) => { fn(); g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); };
  if (kind === 'pickaxe') { g.rotate(0.15); box(g, -6, -10, 12, 120, 3, '#8a5a32', ink, lw); g.beginPath(); g.moveTo(-58, 96); g.quadraticCurveTo(0, 72, 58, 96); g.lineTo(54, 110); g.quadraticCurveTo(0, 90, -54, 110); g.closePath(); g.fillStyle = '#9ae6ff'; g.fill(); g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); }
  else if (kind === 'sword') { box(g, -7, -6, 14, 26, 3, '#8a5a32', ink, lw); box(g, -26, 18, 52, 12, 4, '#ffd23f', ink, lw); g.beginPath(); g.moveTo(-11, 30); g.lineTo(11, 30); g.lineTo(11, 130); g.lineTo(0, 146); g.lineTo(-11, 130); g.closePath(); g.fillStyle = '#bfefff'; g.fill(); g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); }
  else if (kind === 'cube') box(g, -26, -4, 52, 52, W() === 'voxel' ? 0 : 8, '#7ccc3e', ink, lw);
  else if (kind === 'phone') box(g, -18, -10, 36, 62, 7, '#1a1f2a', ink, lw);
  else if (kind === 'coin') { circle(g, 0, 18, 22, '#ffd23f'); g.lineWidth = lw; g.strokeStyle = ink; g.beginPath(); g.arc(0, 18, 22, 0, Math.PI * 2); g.stroke(); }
  else if (kind === 'potion') { box(g, -18, 4, 36, 40, 14, '#3fe0ff', ink, lw); box(g, -7, -10, 14, 16, 3, '#c8a07a', ink, lw); }
  else if (kind === 'flag') { box(g, -4, -110, 8, 140, 3, '#e8e8e8', ink, lw); g.beginPath(); g.moveTo(4, -110); g.lineTo(74, -88); g.lineTo(4, -66); g.closePath(); g.fillStyle = '#ff3a3a'; g.fill(); g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); }
  else if (kind === 'bat') { g.rotate(0.1); box(g, -9, -10, 18, 130, 9, '#c8905a', ink, lw); }
  g.restore();
}

// ---------- main draw ----------
// drawHero(g, { x, y, s, pose, facing, view:'front'|'side', outfit, expr, look:[x,y], blink, talk, name, hp, tool, toolHand:'R'|'L',
//               alpha, shadow, squash, rot, world, outline })
export function drawHero(g, o) {
  const world = o.world || W(), G = heroGeo(world), st = S(), ink = o.ink || (world === 'voxel' ? '#1a1a1a' : st.ink);
  const of = { ...OUTFIT_DEFAULTS[world] || OUTFIT_DEFAULTS.blocky, ...(o.outfit || {}) };
  const s = (o.s ?? 1) * (of.kid ? 0.78 : 1), p = hpose(o.pose), f = o.facing || 1, side = o.view === 'side';
  const lw = (o.outline ?? st.outlineW ?? 5) * (world === 'voxel' ? 0 : 1), ex = { ...(HEXPR[o.expr] || HEXPR[o.expr === undefined ? 'neutral' : 'neutral']) };
  if (o.shadow !== false) { g.save(); g.globalAlpha *= (o.alpha ?? 1) * 0.28 * clamp(1 + (p.y || 0) / 300 + (o.lift || 0) / -500, 0.2, 1); g.fillStyle = '#000'; g.beginPath(); g.ellipse(o.x, o.y + 2, 62 * s, 12 * s, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  g.save(); g.globalAlpha *= o.alpha ?? 1; g.translate(o.x, o.y + (o.lift || 0)); if (o.rot) g.rotate(o.rot);
  if (o.squash) g.scale(1 + o.squash, 1 - o.squash);
  g.scale(s, s); g.translate(0, (p.y || 0)); if (p.tilt) g.rotate(p.tilt * f);
  const sit = p.sit || 0, legL = G.legL * (1 - sit * 0.55), hip = G.hip + G.legL - legL - G.legL * 0;  // sitting lowers the body
  g.translate(0, G.legL - legL);
  const sideW = side ? 0.6 : 1, torW = G.torW * sideW;
  const skin = of.skin, shirt = of.shirt, pants = of.pants, shoes = of.shoes;
  const limb = (px, py, ang, L, w, col, sideCol, far, kind) => {
    g.save(); g.translate(px, py); g.rotate(ang);
    const c = far ? shade(col, -0.18) : col;
    if (world === 'voxel') { vox(g, -w / 2, -w * 0.25, w, L + w * 0.25, c, 0.18); pixelTex(g, -w / 2, -w * 0.25, w * 0.82, L + w * 0.25, c, 4, 12, 0.1, kind === 'leg' ? 3 : 5); if (kind === 'arm') { g.fillStyle = far ? shade(skin, -0.18) : skin; g.fillRect(-w / 2, L - w * 0.55, w, w * 0.55); g.fillStyle = shade(skin, -0.3); g.fillRect(w / 2 - w * 0.18, L - w * 0.55, w * 0.18, w * 0.55); } else if (shoes) { g.fillStyle = far ? shade(shoes, -0.18) : shoes; g.fillRect(-w / 2, L - w * 0.35, w, w * 0.35); } }
    else if (world === 'royale') {
      if (kind === 'arm') {
        const e = (o._bend || 0), L1 = L * 0.52, L2 = L * 0.5; g.lineCap = 'round';
        const ex2 = 0, ey2 = L1, hx = Math.sin(e) * L2 * f * (o._sd || 1), hy = L1 + Math.cos(e) * L2;
        g.lineWidth = w + lw * 2; g.strokeStyle = ink; g.beginPath(); g.moveTo(0, 0); g.lineTo(ex2, ey2); g.lineTo(hx, hy); g.stroke();
        g.lineWidth = w; g.strokeStyle = c; g.beginPath(); g.moveTo(0, 0); g.lineTo(ex2, ey2); g.stroke(); g.strokeStyle = far ? shade(skin, -0.18) : skin; g.beginPath(); g.moveTo(ex2, ey2); g.lineTo(hx, hy); g.stroke();
        g.strokeStyle = c; g.lineWidth = w * 1.05; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, L1 * 0.9); g.stroke();
        circle(g, hx, hy, w * 0.62, far ? shade(skin, -0.18) : skin); g.lineWidth = lw * 0.8; g.strokeStyle = ink; g.beginPath(); g.arc(hx, hy, w * 0.62, 0, Math.PI * 2); g.stroke();
        g.translate(hx, hy - L); // so tool() lands on the hand
      } else {
        box(g, -w / 2, -w * 0.3, w, L * 0.95, w / 2, c, ink, lw);
        box(g, -w * 0.62 + (side ? f * w * 0.25 : 0), L - w * 0.62, w * 1.24 + (side ? w * 0.4 : 0), w * 0.66, w * 0.3, far ? shade(shoes || '#fff', -0.18) : shoes || '#fff', ink, lw);
      }
    } else {
      box(g, -w / 2, -w * 0.28, w, L + w * 0.28, G.round * 0.55, c, ink, lw); if (!far) gloss(g, -w / 2 + w * 0.14, w * 0.05, w * 0.16, L * 0.62, 0.3);
      if (kind === 'leg' && shoes) { g.save(); rr(g, -w / 2, -w * 0.28, w, L + w * 0.28, G.round * 0.55); g.clip(); g.fillStyle = shoes; g.fillRect(-w, L - w * 0.38, w * 2, w); g.restore(); g.lineWidth = lw; g.strokeStyle = ink; rr(g, -w / 2, -w * 0.28, w, L + w * 0.28, G.round * 0.55); g.stroke(); }
    }
    if (kind === 'arm' && o._tool) tool(g, o._tool, L, s, ink, Math.max(3, lw * 0.8));
    g.restore();
  };
  // which arm holds the tool
  const toolHand = o.toolHand || 'R';
  const arm = (sd, far) => {
    const a = sd > 0 ? p.aR : p.aL, e = sd > 0 ? p.eR : p.eL;
    const ang = side ? -f * a : -sd * a;
    const px = side ? 0 : sd * G.armX * (world === 'voxel' ? 1 : 1), py = G.armY + (side ? 4 : 0);
    o._tool = ((sd > 0 ? 'R' : 'L') === toolHand) ? o.tool : null; o._bend = side ? e : -e * 0.9; o._sd = side ? 1 : -sd;
    limb(px, py, ang, G.armL, G.armW, shirt, null, far, 'arm');
    o._tool = null;
  };
  const leg = (sd, far) => {
    const l = sd > 0 ? p.lR : p.lL, ang = side ? -f * l : -sd * l;
    const px = side ? 0 : sd * G.legX;
    if (sit > 0.5 && !side) { limb(px, G.hip, -sd * (0.15 + l), legL, G.legW, pants, null, far, 'leg'); return; }
    limb(px, G.hip, ang, legL, G.legW, pants, null, far, 'leg');
  };
  // back layer (side view: far limbs)
  if (side) { arm(-1, true); leg(-1, true); leg(1, false); } else { leg(-1, false); leg(1, false); }
  if (o.outfit?.acc === 'cape') { g.save(); g.beginPath(); g.moveTo(-torW * 0.45, G.armY - 6); g.lineTo(torW * 0.45, G.armY - 6); g.lineTo(torW * 0.7, G.hip + 40); g.lineTo(-torW * 0.7, G.hip + 40); g.closePath(); g.fillStyle = shade(of.accColor || '#d62a3a', -0.15); g.fill(); g.lineWidth = lw; g.strokeStyle = ink; g.stroke(); g.restore(); }
  // torso
  const tx = -torW / 2, ty = G.hip - G.torH;
  if (world === 'voxel') { vox(g, tx, ty, torW, G.torH, shirt, side ? 0.3 : 0.12); pixelTex(g, tx, ty, torW * 0.88, G.torH, shirt, 8, 10, 0.08, 11); g.fillStyle = pants; g.fillRect(tx, G.hip - G.torH * 0.12, torW, G.torH * 0.12); g.fillStyle = shade(skin, 0); g.fillRect(tx + torW * 0.32, ty, torW * 0.36, G.torH * 0.08); }
  else if (world === 'royale') {
    g.beginPath(); g.moveTo(tx - 4, ty + 8); g.quadraticCurveTo(0, ty - 12, tx + torW + 4, ty + 8); g.lineTo(tx + torW * 0.86, G.hip + 6); g.quadraticCurveTo(0, G.hip + 14, tx + torW * 0.14, G.hip + 6); g.closePath();
    g.fillStyle = shirt; g.fill(); g.lineWidth = lw; g.strokeStyle = ink; g.lineJoin = 'round'; g.stroke();
    g.save(); g.clip(); g.fillStyle = shade(shirt, -0.15); g.fillRect(tx + torW * 0.6, ty - 20, torW, G.torH + 40); g.fillStyle = pants; g.fillRect(tx - 10, G.hip - 14, torW + 20, 30); g.restore();
    if (o.outfit?.acc === 'backpack' && !side) {}
  } else { box(g, tx, ty, torW, G.torH, G.round * 0.5, shirt, ink, lw); gloss(g, tx + torW * 0.08, ty + G.torH * 0.08, torW * 0.08, G.torH * 0.7, 0.28); g.save(); rr(g, tx, ty, torW, G.torH, G.round * 0.5); g.clip(); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(tx, ty + G.torH * 0.75, torW, G.torH); g.restore(); }
  if (!side || world === 'voxel') logo(g, of.logo, side ? f * 4 : 0, ty + G.torH * 0.48, G.torH * 0.62, of.logoColor, ink, of.num);
  // arms (front view: both after the torso)
  if (side) { /* near arm after head */ } else { arm(-1, false); arm(1, false); }
  // head
  const hy = G.headY + (p.ht ? 0 : 0), hw = G.headW, hh = G.headH;
  g.save(); g.translate(0, hy + hh / 2); g.rotate((p.ht || 0) * (side ? f : 1)); g.translate(0, -(hy + hh / 2));
  const fx = side ? f * hw * 0.05 : 0;
  if (world === 'voxel') {
    const x0 = -hw / 2, y0 = hy - hh / 2; vox(g, x0, y0, hw, hh, skin, side ? 0.25 : 0.1); pixelTex(g, x0, y0, hw * 0.9, hh, skin, 8, 8, 0.06, 2);
    const fx0 = side ? x0 + (f > 0 ? hw * 0.25 : 0) : x0; const fw = side ? hw * 0.75 : hw * 0.9;
    hairVoxel(g, x0, y0, hw * 0.9, hh, of); pixelFace(g, fx0, y0, fw, hh, { ...o, facing: f, view: o.view }, { ...ex, ...(o.blink ? {} : {}) }, of);
  } else if (world === 'royale') {
    const r = hw / 2; g.save(); g.fillStyle = skin; g.fillRect(-10, hy + r * 0.7, 20, 26); g.restore();
    if (of.hair === 'long' || of.hair === 'bob') hairRoyale(g, fx, hy, r, { ...of, hair: of.hair }, ink, lw);
    g.beginPath(); g.ellipse(fx, hy, r, r * 0.98, 0, 0, Math.PI * 2); g.fillStyle = skin; g.fill(); g.lineWidth = lw; g.strokeStyle = ink; g.stroke();
    if (!side) { circle(g, -r * 0.98, hy + r * 0.1, r * 0.17, skin); circle(g, r * 0.98, hy + r * 0.1, r * 0.17, skin); }
    g.save(); g.beginPath(); g.ellipse(fx, hy, r, r * 0.98, 0, 0, Math.PI * 2); g.clip(); g.fillStyle = 'rgba(0,0,0,.08)'; g.beginPath(); g.ellipse(fx + r * 0.5, hy + r * 0.3, r * 0.8, r, 0, 0, Math.PI * 2); g.fill(); g.restore();
    cartoonFace(g, fx, hy + r * 0.08, hw * 0.92, hh * 0.92, { ...o, _skin: skin, facing: f }, ex, ink);
    if (!(of.hair === 'long' || of.hair === 'bob')) hairRoyale(g, fx, hy, r, of, ink, lw); else hairRoyale(g, fx, hy, r, { ...of, hair: 'none' }, ink, lw);
  } else {
    box(g, -hw / 2, hy - hh / 2, hw, hh, G.round, skin, ink, lw); gloss(g, -hw / 2 + hw * 0.1, hy - hh * 0.32, hw * 0.1, hh * 0.45, 0.3);
    cartoonFace(g, fx, hy + hh * 0.06, hw, hh, { ...o, _skin: skin, facing: f }, ex, ink);
    hairBlocky(g, 0, hy - hh / 2, hw, hh, of, ink, lw);
  }
  if (ex.sweat) for (let i = 0; i < ex.sweat; i++) sweatDrop(g, hw * (0.52 - i * 0.12) * (i ? 1 : 1), hy - hh * (0.25 - i * 0.28) + Math.sin((o.t || 0) * 6 + i) * 2, hw * (0.085 - i * 0.02));
  if (ex.q) { text(g, '?', hw * 0.62, hy - hh * 0.62, { size: hh * 0.42, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: 6, strokeColor: ink }); text(g, '?', hw * 0.86, hy - hh * 0.4, { size: hh * 0.3, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: 5, strokeColor: ink }); }
  if (o.outfit?.acc === 'crown') { g.beginPath(); const cy0 = hy - hh / 2 - hh * 0.12; g.moveTo(-hw * 0.32, cy0 + hh * 0.12); g.lineTo(-hw * 0.32, cy0 - hh * 0.18); g.lineTo(-hw * 0.14, cy0 - hh * 0.02); g.lineTo(0, cy0 - hh * 0.26); g.lineTo(hw * 0.14, cy0 - hh * 0.02); g.lineTo(hw * 0.32, cy0 - hh * 0.18); g.lineTo(hw * 0.32, cy0 + hh * 0.12); g.closePath(); g.fillStyle = '#ffd23f'; g.fill(); g.lineWidth = Math.max(3, lw); g.strokeStyle = ink; g.stroke(); }
  if (o.outfit?.acc === 'headphones') { g.lineWidth = hw * 0.07; g.strokeStyle = '#2a2f3a'; g.beginPath(); g.arc(0, hy, hw * 0.58, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); box(g, -hw * 0.66, hy - hh * 0.05, hw * 0.16, hh * 0.32, 6, of.accColor || '#ff3a6a', ink, lw); box(g, hw * 0.5, hy - hh * 0.05, hw * 0.16, hh * 0.32, 6, of.accColor || '#ff3a6a', ink, lw); }
  g.restore();
  if (side) arm(1, false);
  g.restore();
  // name tag + health bar (gamer identity above the head)
  if (o.name) {
    const [nx, ny, hr] = heroHeadPos({ ...o, world });
    const ts = Math.max(18, 26 * s), y = ny - hr * (world === 'royale' ? 1.6 : 1.45) - ts * 0.7;
    text(g, o.name, nx, y, { size: ts, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: ts * 0.22, strokeColor: 'rgba(20,24,34,.9)', alpha: o.alpha ?? 1 });
    if (o.hp != null) { const bw = ts * 3.2, bh = ts * 0.26; rr(g, nx - bw / 2, y + ts * 0.62, bw, bh, bh / 2); g.fillStyle = 'rgba(20,24,34,.8)'; g.fill(); rr(g, nx - bw / 2, y + ts * 0.62, bw * clamp(o.hp), bh, bh / 2); g.fillStyle = o.hp > 0.35 ? '#3ee05a' : '#ff3b3b'; g.fill(); }
  }
}
// bigHero(g, cx, cy, size, o) — giant close-up: the head (≈ `size` wide) centred at cx, cy; shoulders/arms below the frame edge
export function bigHero(g, cx, cy, size, o = {}) {
  const world = o.world || W(), G = heroGeo(world), s = size / G.headW;
  drawHero(g, { pose: 'idle', ...o, world, x: cx, y: cy - G.headY * s, s: s / ((o.outfit?.kid) ? 0.78 : 1), shadow: false });
}
// forcefield bubble around a hero (respawn protection, shields, powers)
export function forcefield(g, x, y, r, t = 0, o = {}) {
  const col = o.color || '#9ae6ff';
  g.save(); g.globalAlpha *= o.alpha ?? 1;
  g.fillStyle = (() => { const gr = g.createRadialGradient(x, y, r * 0.6, x, y, r); gr.addColorStop(0, alpha(col, 0.05)); gr.addColorStop(1, alpha(col, 0.32)); return gr; })(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.lineWidth = r * 0.025; g.strokeStyle = alpha('#ffffff', 0.7); g.stroke();
  g.lineWidth = r * 0.05; g.strokeStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(x, y, r * 0.86, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + t * 1.3, rr2 = r * (0.5 + 0.45 * ((i * 37) % 10) / 10), k = 0.5 + 0.5 * Math.sin(t * 5 + i); star(g, x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * 0.9, r * 0.035 * (0.6 + k), `rgba(255,255,255,${0.5 + 0.5 * k})`); }
  g.restore();
}
export { star as starShape, heart as heartShape, vox as voxBox, pixelTex, box as roundBox, gloss };
