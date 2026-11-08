// luck3.js — 3 maximum-clickbait thumbnails for «What If You Were the Luckiest Human Alive?» (params.tpl === 'ifv-luck3').
// New vs luck9: new emotions (joy = laughing, terrified, hollow = dead-eyed), new poses (cheeks, belly, jump),
// new palettes (gold vs grey split, ice-white high-key, hazard yellow/black) and clickbait devices (red arrows/circles, split screen).
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, face } from './ifverse.js';

const HOODIE = '#a6ee1a';
const RED = '#ff2a2a';

// ---------- new faces ----------
function face2(g, x, y, r, emo, o = {}) {
  if (!['joy', 'terrified', 'hollow'].includes(emo)) return face(g, x, y, r, emo, o);
  const dir = o.dir ?? 1, rim = o.rim || '#5fd8ff';
  circle(g, x, y, r, INK);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  const rg = g.createRadialGradient(x + dir * r * 1.05, y - r * 0.35, r * 0.05, x + dir * r * 1.05, y - r * 0.35, r * 0.95); rg.addColorStop(0, alpha(rim, 0.38)); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(rim, 0.45); g.lineWidth = r * 0.035; g.beginPath(); g.arc(x, y, r - r * 0.02, dir > 0 ? -1.2 : Math.PI - 0.6, dir > 0 ? 0.6 : Math.PI + 1.2); g.stroke();
  g.restore();
  const ex = x + dir * r * 0.3, ey = y - r * 0.06, sp = r * 0.44, mx = x + dir * r * 0.34, my = y + r * 0.36;
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (emo === 'joy') {
    for (const k of [-1, 1]) {
      const cx = ex + k * sp / 2;
      g.strokeStyle = W; g.lineWidth = r * 0.07; g.beginPath(); g.arc(cx, ey + r * 0.06, r * 0.15, Math.PI * 1.08, Math.PI * 1.92); g.stroke();   // closed happy eyes ^ ^
      circle(g, cx + k * r * 0.06, ey + r * 0.32, r * 0.1, alpha('#ff6aa8', 0.45));                                                                    // blush
      // tears of joy flying out
      const tx = cx + k * r * 0.28, ty = ey + r * 0.04; glow(g, tx, ty, r * 0.14, '#8fe8ff', 0.5); g.fillStyle = '#9fe8ff';
      g.beginPath(); g.moveTo(tx + k * r * 0.12, ty - r * 0.07); g.quadraticCurveTo(tx - k * r * 0.02, ty + r * 0.02, tx + k * r * 0.12, ty + r * 0.1); g.quadraticCurveTo(tx + k * r * 0.2, ty + r * 0.02, tx + k * r * 0.12, ty - r * 0.07); g.fill();
    }
    // huge open laugh with tongue
    g.fillStyle = W; g.beginPath(); g.moveTo(mx - r * 0.26, my - r * 0.06); g.lineTo(mx + r * 0.26, my - r * 0.06); g.bezierCurveTo(mx + r * 0.24, my + r * 0.3, mx - r * 0.24, my + r * 0.3, mx - r * 0.26, my - r * 0.06); g.fill();
    g.save(); g.clip(); g.fillStyle = '#e8446a'; g.beginPath(); g.ellipse(mx, my + r * 0.2, r * 0.17, r * 0.12, 0, 0, 7); g.fill(); g.restore();
  } else if (emo === 'terrified') {
    for (const k of [-1, 1]) {
      const cx = ex + k * sp / 2 * 1.1;
      circle(g, cx, ey - r * 0.03, r * 0.23, W); circle(g, cx + dir * r * 0.02, ey - r * 0.03, r * 0.034, INK);                                       // tiny pupils in huge eyes
      seg(g, [[cx - k * r * 0.18, ey - r * 0.44 - r * 0.0], [cx + k * r * 0.1, ey - r * 0.4]], r * 0.045, W);
      seg(g, [[cx - k * r * 0.2, ey - r * 0.4], [cx - k * r * 0.2, ey - r * 0.4]], r * 0.001, W);
    }
    // stretched mouth: white outline + dark inside + tongue
    g.fillStyle = W; g.beginPath(); g.ellipse(mx - dir * r * 0.04, my + r * 0.13, r * 0.17, r * 0.24, 0, 0, 7); g.fill();
    g.fillStyle = '#12060c'; g.beginPath(); g.ellipse(mx - dir * r * 0.04, my + r * 0.14, r * 0.12, r * 0.19, 0, 0, 7); g.fill();
    g.fillStyle = '#e8446a'; g.beginPath(); g.ellipse(mx - dir * r * 0.04, my + r * 0.25, r * 0.08, r * 0.07, 0, 0, 7); g.fill();
    // sweat
    for (const [sx, sy, s] of [[x - r * 0.78, y - r * 0.5, 1], [x + r * 0.72, y - r * 0.7, 0.8], [x - r * 0.55, y - r * 0.9, 0.7]]) { glow(g, sx, sy, r * 0.25 * s, '#9fe8ff', 0.7); g.fillStyle = '#b8eeff'; g.beginPath(); g.moveTo(sx, sy - r * 0.16 * s); g.quadraticCurveTo(sx + r * 0.12 * s, sy + r * 0.05 * s, sx, sy + r * 0.1 * s); g.quadraticCurveTo(sx - r * 0.12 * s, sy + r * 0.05 * s, sx, sy - r * 0.16 * s); g.fill(); }
  } else if (emo === 'hollow') {
    for (const k of [-1, 1]) {
      const cx = ex + k * sp / 2;
      g.fillStyle = '#d8d8dc'; g.beginPath(); g.ellipse(cx, ey, r * 0.15, r * 0.14, 0, 0, 7); g.fill();
      circle(g, cx + dir * r * 0.02, ey + r * 0.03, r * 0.03, INK);                                           // dead little pupil
      g.fillStyle = INK; g.beginPath(); g.rect(cx - r * 0.2, ey - r * 0.2, r * 0.4, r * 0.21); g.fill();      // heavy lids
      seg(g, [[cx - r * 0.17, ey + r * 0.01], [cx + r * 0.17, ey + r * 0.01]], r * 0.03, '#d8d8dc');
      g.strokeStyle = alpha('#7a7a88', 0.8); g.lineWidth = r * 0.025; g.beginPath(); g.arc(cx, ey + r * 0.15, r * 0.14, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); // bags
    }
    seg(g, [[mx - r * 0.1, my + r * 0.05], [mx + r * 0.1, my + r * 0.05]], r * 0.04, alpha('#d8d8dc', 0.85));  // flat mouth
  }
}

// ---------- full-body hero with the new poses and a head tilt ----------
const ARMS = {
  idle: [[0.14, 0.62], [0.1, 1.18]],
  up: [[0.42, -0.5], [0.5, -1.08]],
  jump: [[0.62, -0.38], [0.92, -1.1]],
  cheeks: [[0.72, -0.12], [0.1, -0.86]],
  belly: [[0.34, 0.5], [-0.42, 0.86]],
  point: [[0.6, 0.02], [1.18, -0.16]],
  hips: [[0.56, 0.55], [-0.08, 1.02]],
};
export function heroFull2(g, x, fy, r, emo = 'smug', o = {}) {
  const dir = o.dir ?? 1, col = o.hoodie || HOODIE, rim = o.rim || '#5fd8ff', pants = o.pants || '#14182e', grey = o.grey;
  const hy = fy - r * 1.3, sy = hy - r * 1.25, y = sy - r * 0.93;
  if (!grey) glow(g, x + dir * r * 0.2, y + r * 0.6, r * 3.2, rim, o.haloA ?? 0.28);
  g.lineCap = 'round'; g.lineJoin = 'round';
  const st = o.stance ?? 0.36;
  for (const k of [-1, 1]) {
    const hx = x + k * r * 0.27, fx = x + k * r * st;
    seg(g, [[hx, hy - r * 0.1], [fx, fy - r * 0.16]], r * 0.36, k === dir ? shade(pants, 0.12) : pants);
    g.fillStyle = W; g.beginPath(); g.ellipse(fx + dir * r * 0.08, fy - r * 0.08, r * 0.3, r * 0.14, 0, 0, 7); g.fill();
  }
  const pose = o.pose || 'idle';
  const arm = (k) => {
    const [e, h] = ARMS[pose] || ARMS.idle, shx = x + k * r * 0.66, shy = sy + r * 0.22;
    const ex = shx + k * e[0] * r, ey = shy + e[1] * r, hx2 = shx + k * h[0] * r, hy2 = shy + h[1] * r;
    seg(g, [[shx, shy], [ex, ey], [hx2, hy2]], r * 0.31, k === dir ? shade(col, 0.06) : shade(col, -0.25));
    circle(g, hx2, hy2, r * 0.17, INK);
  };
  const front = ['cheeks', 'belly'].includes(pose);
  if (!front) arm(-dir);
  g.fillStyle = linGrad(g, x - r * 0.9, 0, x + r * 0.9, 0, dir > 0 ? [shade(col, -0.35), col, shade(col, 0.14)] : [shade(col, 0.14), col, shade(col, -0.35)]);
  g.beginPath(); g.moveTo(x - r * 0.42, sy - r * 0.02);
  g.bezierCurveTo(x - r * 0.78, sy, x - r * 0.88, sy + r * 0.2, x - r * 0.84, sy + r * 0.5);
  g.lineTo(x - r * 0.72, hy + r * 0.08); g.quadraticCurveTo(x, hy + r * 0.2, x + r * 0.72, hy + r * 0.08);
  g.lineTo(x + r * 0.84, sy + r * 0.5); g.bezierCurveTo(x + r * 0.88, sy + r * 0.2, x + r * 0.78, sy, x + r * 0.42, sy - r * 0.02); g.closePath(); g.fill();
  g.fillStyle = shade(col, -0.22); rr(g, x - r * 0.72, hy - r * 0.06, r * 1.44, r * 0.16, r * 0.06); g.fill();
  g.fillStyle = shade(col, -0.16); rr(g, x - r * 0.44, hy - r * 0.52, r * 0.88, r * 0.34, r * 0.1); g.fill();
  g.fillStyle = shade(col, -0.5); g.beginPath(); g.ellipse(x, sy + r * 0.04, r * 0.56, r * 0.18, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = shade(col, -0.18); g.beginPath(); g.ellipse(x, sy, r * 0.56, r * 0.12, 0, Math.PI, Math.PI * 2); g.fill();
  for (const k of [-1, 1]) { seg(g, [[x + k * r * 0.15, sy + r * 0.12], [x + k * r * 0.19, sy + r * 0.62]], r * 0.035, W); circle(g, x + k * r * 0.19, sy + r * 0.64, r * 0.035, W); }
  g.fillStyle = INK; g.fillRect(x - r * 0.15, y + r * 0.8, r * 0.3, r * 0.2);
  if (!front) arm(dir);
  // head with tilt around the neck
  g.save(); g.translate(x, sy); g.rotate((o.tilt ?? 0) * dir); g.translate(-x, -sy);
  face2(g, x, y, r, emo, { ...o, dir, rim });
  g.restore();
  if (front) { arm(-dir); arm(dir); }
}

// ---------- props ----------
const digits = (g, s, x, y, size, c) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, glow: 36, glowColor: c });
const coinPile = (g, x, y, s, glowC = '#ffcf3a', grey = false) => {
  glow(g, x, y - 100 * s, s * 520, glowC, grey ? 0.15 : 0.5);
  const r = rng(21);
  for (let row = 0; row < 6; row++) for (let i = 0; i < 9 - row; i++) {
    const cx = x + (i - (8 - row) / 2) * 90 * s + (r() - 0.5) * 12, cy = y - row * 46 * s + (r() - 0.5) * 8;
    g.fillStyle = grey ? '#555560' : '#b8801a'; g.beginPath(); g.ellipse(cx, cy + 10 * s, 52 * s, 20 * s, 0, 0, 7); g.fill();
    g.fillStyle = grey ? '#8a8a96' : linGrad(g, cx - 50 * s, 0, cx + 50 * s, 0, ['#ffd34a', '#fff0a0', '#e8a21a']); g.beginPath(); g.ellipse(cx, cy, 52 * s, 22 * s, 0, 0, 7); g.fill();
    g.strokeStyle = grey ? '#3a3a44' : '#a8701a'; g.lineWidth = 3; g.stroke();
  }
};
const bills = (g, seed, n, area, c = '#3dbf6a') => { const r = rng(seed); for (let i = 0; i < n; i++) { g.save(); g.translate(area[0] + r() * area[2], area[1] + r() * area[3]); g.rotate((r() - 0.5) * 2.2); rr(g, -46, -22, 92, 44, 5); g.fillStyle = c; g.fill(); g.strokeStyle = shade(c, -0.4); g.lineWidth = 3; g.stroke(); text(g, '$', 0, 11, { size: 30, color: shade(c, 0.6), font: FONTS.ui, weight: 900 }); g.restore(); } };
const redArrow = (g, x1, y1, x2, y2, w = 26) => { const a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.4; glow(g, x2, y2, 90, RED, 0.5); seg(g, [[x1, y1], [x2 - Math.cos(a) * h * 0.6, y2 - Math.sin(a) * h * 0.6]], w, '#000'); seg(g, [[x1, y1], [x2 - Math.cos(a) * h * 0.6, y2 - Math.sin(a) * h * 0.6]], w - 8, RED); poly(g, [[x2, y2], [x2 - Math.cos(a - 0.5) * h, y2 - Math.sin(a - 0.5) * h], [x2 - Math.cos(a + 0.5) * h, y2 - Math.sin(a + 0.5) * h]], RED); };
const redCircle = (g, x, y, rx, ry, w = 14) => { g.save(); g.shadowColor = RED; g.shadowBlur = 30; g.lineWidth = w + 8; g.strokeStyle = '#000'; g.beginPath(); g.ellipse(x, y, rx, ry, -0.1, 0, 7); g.stroke(); g.lineWidth = w; g.strokeStyle = RED; g.beginPath(); g.ellipse(x, y, rx, ry, -0.1, 0, 7); g.stroke(); g.restore(); };
const truckFront = (g, x, y, w, h) => {
  glow(g, x + w * 0.2, y + h * 0.62, w * 0.55, '#fff2c0', 0.6); glow(g, x + w * 0.8, y + h * 0.62, w * 0.55, '#fff2c0', 0.6);
  rr(g, x, y, w, h, 44); g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#e8281e', '#7a0e12']); g.fill();
  rr(g, x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.34, 26); g.fillStyle = linGrad(g, 0, y, 0, y + h * 0.4, ['#8ad0ff', '#1a3a5a']); g.fill();
  poly(g, [[x + w * 0.16, y + h * 0.1], [x + w * 0.36, y + h * 0.1], [x + w * 0.22, y + h * 0.4], [x + w * 0.12, y + h * 0.4]], alpha('#ffffff', 0.2));
  for (const k of [0.18, 0.82]) { circle(g, x + w * k, y + h * 0.62, w * 0.08, '#fffbe8'); circle(g, x + w * k, y + h * 0.62, w * 0.05, '#ffffff'); }
  rr(g, x + w * 0.32, y + h * 0.5, w * 0.36, h * 0.24, 14); g.fillStyle = '#14101a'; g.fill();
  for (let i = 0; i < 5; i++) seg(g, [[x + w * 0.34, y + h * (0.53 + i * 0.04)], [x + w * 0.66, y + h * (0.53 + i * 0.04)]], 6, '#9aa0b0');
  rr(g, x - w * 0.03, y + h * 0.82, w * 1.06, h * 0.14, 14); g.fillStyle = '#d8dce8'; g.fill();
  for (let i = 0; i < 5; i++) { glow(g, x + w * (0.3 + i * 0.1), y - 8, 34, '#ffb020', 0.8); rr(g, x + w * (0.3 + i * 0.1) - 14, y - 22, 28, 22, 6); g.fillStyle = '#ffb020'; g.fill(); }
};
const hazard = (g, y, h) => { g.save(); g.beginPath(); g.rect(0, y, E.W, h); g.clip(); g.fillStyle = '#ffd400'; g.fillRect(0, y, E.W, h); g.fillStyle = '#111'; for (let i = -2; i < 40; i++) { g.beginPath(); g.moveTo(i * 90, y + h); g.lineTo(i * 90 + 45, y + h); g.lineTo(i * 90 + 45 + h, y); g.lineTo(i * 90 + h, y); g.closePath(); g.fill(); } g.restore(); };
const girl = (g, x, fy, s, c = '#ff5ab8') => {
  glow(g, x, fy - 200 * s, 420 * s, c, 0.6);
  circle(g, x, fy - 330 * s, 62 * s, INK); circle(g, x + 54 * s, fy - 350 * s, 26 * s, INK); seg(g, [[x + 40 * s, fy - 355 * s], [x + 100 * s, fy - 320 * s], [x + 96 * s, fy - 250 * s]], 30 * s, INK);
  poly(g, [[x - 40 * s, fy - 270 * s], [x + 40 * s, fy - 270 * s], [x + 100 * s, fy - 60 * s], [x - 100 * s, fy - 60 * s]], c);
  seg(g, [[x - 28 * s, fy - 60 * s], [x - 28 * s, fy]], 22 * s, INK); seg(g, [[x + 28 * s, fy - 60 * s], [x + 28 * s, fy]], 22 * s, INK);
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(c, 0.7); g.lineWidth = 7 * s; g.beginPath(); g.arc(x, fy - 330 * s, 62 * s, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.restore();
};

// ---------- the three variants ----------
const V = {
  // 1 SPLIT «DAY 1 | DAY 9» — left: joy, jumping, gold; right: the same hero, hollow, grey.   (text drawn by luck3_text.py)
  1(g, t) {
    bgBlur(g, t, 'fair', {}, { z: 1.25, blur: 8, veil: 0.2, y: -100 });
    // right half: drain every colour
    g.save(); g.beginPath(); g.moveTo(1080, 0); g.lineTo(E.W, 0); g.lineTo(E.W, E.H); g.lineTo(900, E.H); g.closePath(); g.clip();
    g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(0, 0, E.W, E.H);
    g.globalCompositeOperation = 'multiply'; g.fillStyle = '#9a9aa6'; g.fillRect(0, 0, E.W, E.H); g.restore();
    // left half: hot gold
    g.save(); g.beginPath(); g.moveTo(0, 0); g.lineTo(1080, 0); g.lineTo(900, E.H); g.lineTo(0, E.H); g.closePath(); g.clip();
    wash(g, '#ffd21a', '#ff6a00', 0.9, 'overlay'); bokeh(g, 301, 24, ['#ffd34a', '#ff8a2a', '#fff2a0'], 0.4);
    g.restore();
    // the cut
    g.save(); g.shadowColor = '#fff'; g.shadowBlur = 40; seg(g, [[1080, 0], [900, E.H]], 14, '#ffffff'); g.restore();
    vign(g, 0.5);
    // day 1: money everywhere, jumping with joy
    coinPile(g, 450, 1085, 0.95); bills(g, 31, 26, [60, 80, 780, 700]); motes(g, 31, 36, '#fff2a0', [0, 0, 900, 1000]);
    heroFull2(g, 460, 1055, 172, 'joy', { pose: 'jump', stance: 0.62, dir: 1, rim: '#ffd34a', haloA: 0.4 });
    // day 9: same pile, same hero, nothing inside
    coinPile(g, 1460, 1090, 0.85, '#888', true);
    heroFull2(g, 1450, 1065, 172, 'hollow', { pose: 'idle', dir: -1, tilt: 0.18, rim: '#9aa0b0', haloA: 0.08, hoodie: '#7c8a52', pants: '#2a2c36', grey: true });
  },
  // 2 TERRIFIED, big, right — «FINALLY SCARED. AFTER 8 DAYS» (ice-white high-key) with a glowing girl and a red arrow.
  2(g, t) {
    bgBlur(g, t, 'clinic', {}, { z: 1.3, blur: 9, veil: 0.0, y: -120 });
    g.save(); g.fillStyle = radGrad(g, 1150, 520, 80, 1300, ['rgba(255,255,255,.95)', 'rgba(110,220,255,.9)']); g.fillRect(0, 0, E.W, E.H); g.restore();
    bokeh(g, 302, 22, ['#ffffff', '#7fe6ff', '#ff8ac8'], 0.5); vign(g, 0.35);
    FX.lightCone(g, 470, -40, { angle: Math.PI / 2, spread: 0.2, len: 1100, color: '#ff8ad8', a: 0.4 });
    girl(g, 500, 1045, 1.45);
    star(g, 640, 540, 50, '#ff8ad8'); digits(g, '?', 760, 640, 280, '#ff2ab0');
    redArrow(g, 960, 790, 720, 720);
    motes(g, 32, 30, '#ffffff');
    heroFull2(g, 1450, 1560, 330, 'terrified', { pose: 'cheeks', dir: -1, tilt: -0.1, rim: '#ff4a6a', haloA: 0.25 });
  },
  // 3 LAUGHING with a truck one inch behind him — hazard yellow/black.   «I CAN'T DIE.  9 DAYS OF LUCK»
  3(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.2, blur: 10, veil: 0.1, y: -90 });
    g.save(); g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['rgba(255,235,20,.9)', 'rgba(255,150,0,.9)']); g.fillRect(0, 0, E.W, E.H); g.restore();
    bokeh(g, 303, 18, ['#fff2a0', '#ffb02a', '#ff5a2a'], 0.4); vign(g, 0.55);
    hazard(g, 0, 56); hazard(g, E.H - 56, 56);
    truckFront(g, 1040, 250, 860, 720);
    // the one-inch gap, marked like a crime scene
    redCircle(g, 990, 840, 62, 120);
    text(g, '1 INCH', 1350, 925, { size: 96, color: '#ff2a2a', font: FONTS.ui, weight: 900, glow: 22, glowColor: '#ffffff' });
    redArrow(g, 1190, 905, 1040, 860, 22);
    motes(g, 33, 24, '#fff6c0');
    heroFull2(g, 740, 1330, 200, 'joy', { pose: 'belly', dir: -1, tilt: -0.12, rim: '#ffee5a', haloA: 0.3 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-luck3') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
