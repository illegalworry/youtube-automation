// pop5.js — 5 thumbnails in 5 DIFFERENT designs for «Der schönste Mensch der Welt» (params.tpl === 'pop5').
// New main character (flat look from the channel art): big black round head with a slightly lighter "hair" cap,
// white oval eyes, cream rim on the right, yellow hoodie with a dark collar and white drawstrings, arms with a thin
// black outline and black ball hands. Text is drawn in the scene (each design has its own typography).
//   1 comic pop-art (shocked)   2 wanted poster (smug)   3 before/after split (happy → sad)
//   4 extreme close-up eye (crazy)   5 die-cut sticker collage (angry)
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, rng, linGrad, radGrad } from '/engine/core.js';

const LF = 'Lilita One';
try { const ff = new FontFace(LF, 'url(/project/story/fonts/LilitaOne.ttf)'); await ff.load(); document.fonts.add(ff); } catch (e) { console.log('font missing Lilita One'); }

const INK = '#141418', CAP = '#222226', CREAM = '#f4e8c6', WH = '#ffffff', YEL = '#e9bf4a';

// ---------- text ----------
function T(g, s, x, y, size, fill, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  g.font = `${size}px "${LF}"`; g.textAlign = o.align || 'left'; g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
  if ('letterSpacing' in g) g.letterSpacing = `${o.spacing || 0}px`;
  const sw = o.stroke ?? size * 0.12;
  if (o.shadow !== false) { g.fillStyle = 'rgba(0,0,0,.45)'; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = sw; const d = o.shadowD ?? size * 0.06; g.strokeText(s, d, d); g.fillText(s, d, d); }
  if (sw) { g.lineWidth = sw; g.strokeStyle = o.strokeColor || INK; g.strokeText(s, 0, 0); }
  g.fillStyle = fill; g.fillText(s, 0, 0); g.restore();
}
const tw = (g, s, size) => { g.save(); g.font = `${size}px "${LF}"`; const w = g.measureText(s).width; g.restore(); return w; };
// small tilted label box
function tag(g, s, x, y, size, bg, fg = WH, o = {}) {
  const w = tw(g, s, size) + size * 0.8, h = size * 1.35;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.04); const ox = o.align === 'right' ? -w : o.align === 'center' ? -w / 2 : 0;
  g.fillStyle = 'rgba(0,0,0,.4)'; rr(g, ox + 8, 8, w, h, size * 0.2); g.fill();
  g.fillStyle = bg; rr(g, ox, 0, w, h, size * 0.2); g.fill(); g.lineWidth = o.border ?? 6; g.strokeStyle = o.borderColor || INK; g.stroke();
  T(g, s, ox + w / 2, h * 0.72, size, fg, { align: 'center', stroke: o.stroke ?? 0, shadow: false }); g.restore();
}

// ---------- the main character ----------
const POSES = { // [control, hand] in head radii relative to the head centre, for side k (+1 = right)
  up: k => [[k * 1.6, 1.75], [k * 1.55, 0.82]],
  head: k => [[k * 1.8, 1.1], [k * 1.0, -0.42]],
  down: k => [[k * 1.38, 2.3], [k * 1.3, 3.15]],
  hips: k => [[k * 1.8, 2.2], [k * 1.05, 2.8]],
};
export function heroY(g, x, y, r, emo = 'happy', o = {}) {
  const dir = o.dir ?? 1, col = o.col || YEL, pose = o.pose || 'down';
  const armOf = k => pose === 'point' ? (k === dir ? [[k * 1.5, 1.45], [k * 2.45, 0.95]] : POSES.hips(k)) : (POSES[pose] || POSES.down)(k);
  const hands = [];
  const arm = (k, handOnly) => {
    const [c, h] = armOf(k), sx = x + k * r * 0.95, sy = y + r * 1.62, cx = x + c[0] * r, cy = y + c[1] * r, hx = x + h[0] * r, hy = y + h[1] * r;
    if (!handOnly) {
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.strokeStyle = INK; g.lineWidth = r * 0.34; g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(cx, cy, hx, hy); g.stroke();
      g.strokeStyle = col; g.lineWidth = r * 0.26; g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(cx, cy, hx, hy); g.stroke();
    }
    if (handOnly !== false) circle(g, hx, hy, r * 0.2, INK);
    hands.push([hx, hy]);
  };
  const late = pose === 'head';
  arm(-1, late ? false : undefined); arm(1, late ? false : undefined);
  // torso (hoodie)
  const L = x - r * 1.25, R = x + r * 1.3, top = y + r * 1.28, bot = o.bottom ?? E.H + 40;
  g.save(); rr(g, L, top, R - L, bot - top, r * 0.42); g.clip();
  g.fillStyle = col; g.fillRect(L, top, R - L, bot - top);
  g.fillStyle = shade(col, -0.17); g.beginPath(); g.moveTo(L, top); g.lineTo(L + r * 0.36, top); g.lineTo(L + r * 0.4, bot); g.lineTo(L, bot); g.fill();
  g.fillStyle = CREAM; g.fillRect(R - r * 0.06, top, r * 0.06, bot - top);
  g.restore();
  g.fillStyle = shade(col, -0.1); g.beginPath(); g.ellipse(x + r * 0.03, y + r * 1.42, r * 0.62, r * 0.18, 0, 0, 7); g.fill();
  g.fillStyle = INK; g.beginPath(); g.ellipse(x + r * 0.04, y + r * 1.39, r * 0.19, r * 0.065, 0, 0, 7); g.fill();
  g.lineCap = 'round'; seg(g, [[x - r * 0.08, y + r * 1.56], [x - r * 0.06, y + r * 2.5]], r * 0.03, WH); seg(g, [[x + r * 0.2, y + r * 1.53], [x + r * 0.25, y + r * 2.45]], r * 0.03, WH);
  // neck + head
  g.fillStyle = INK; g.fillRect(x - r * 0.13, y + r * 0.8, r * 0.27, r * 0.58);
  if (o.glow) glow(g, x, y, r * 1.9, o.glow, o.glowA ?? 0.35);
  circle(g, x + r * 0.035, y + r * 0.01, r, CREAM);
  circle(g, x, y, r, INK);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  g.fillStyle = CAP; g.beginPath(); g.ellipse(x - r * 0.05, y - r * 0.95, r * 1.25, r * 0.75, -0.22, 0, 7); g.fill();
  g.restore();
  g.strokeStyle = alpha(WH, 0.85); g.lineWidth = Math.max(2, r * 0.012); g.beginPath(); g.arc(x - r * 0.01, y + r * 0.01, r * 1.0, Math.PI * 0.55, Math.PI * 1.0); g.stroke();
  faceY(g, x, y, r, emo, dir, o);
  if (late) { arm(-1, true); arm(1, true); }
  return { head: [x, y], hands };
}
function star4(g, x, y, s, c = '#fff6c0') { glow(g, x, y, s * 2.4, c, 0.85); g.fillStyle = WH; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, d = i % 2 ? s * 0.17 : s; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); }
export function faceY(g, x, y, r, emo, dir = 1, o = {}) {
  const fx = x + dir * r * 0.1, ey = y - r * 0.12, sp = r * 0.27;
  const oval = (cx, cy, rx, ry) => { g.fillStyle = WH; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.fill(); };
  const lid = (cx, cy, rx, ry, yl, yr, c = WH) => { g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.clip(); g.fillStyle = c; g.beginPath(); g.moveTo(cx - rx - 2, yl); g.lineTo(cx + rx + 2, yr); g.lineTo(cx + rx + 2, cy + ry + 2); g.lineTo(cx - rx - 2, cy + ry + 2); g.fill(); g.restore(); };
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (emo === 'happy') {
    for (const k of [-1, 1]) oval(fx + k * sp, ey, r * 0.085, r * 0.125);
    g.strokeStyle = WH; g.lineWidth = r * 0.055; g.beginPath(); g.arc(fx, y + r * 0.08, r * 0.19, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
  } else if (emo === 'shocked') {
    for (const k of [-1, 1]) { oval(fx + k * sp * 1.1, ey, r * 0.12, r * 0.17); circle(g, fx + k * sp * 1.1 + dir * r * 0.03, ey + r * 0.02, r * 0.045, INK); seg(g, [[fx + k * sp * 1.1 - r * 0.11, ey - r * 0.3 - k * r * 0.0], [fx + k * sp * 1.1 + r * 0.11, ey - r * 0.33]], r * 0.04, WH); }
    oval(fx, y + r * 0.3, r * 0.075, r * 0.11);
  } else if (emo === 'sad') {
    for (const k of [-1, 1]) { const cx = fx + k * sp; lid(cx, ey, r * 0.09, r * 0.12, ey - r * 0.02 - k * r * 0.06, ey - r * 0.02 + k * r * 0.06);
      seg(g, [[cx - r * 0.1, ey - r * 0.2 - k * r * 0.05], [cx + r * 0.1, ey - r * 0.2 + k * r * 0.05]], r * 0.035, WH); }
    const tx = fx - sp, ty = ey + r * 0.2; glow(g, tx, ty, r * 0.18, '#7fd8ff', 0.8); g.fillStyle = '#8fe2ff'; g.beginPath(); g.moveTo(tx, ty - r * 0.06); g.quadraticCurveTo(tx + r * 0.06, ty + r * 0.06, tx, ty + r * 0.1); g.quadraticCurveTo(tx - r * 0.06, ty + r * 0.06, tx, ty - r * 0.06); g.fill();
    g.strokeStyle = WH; g.lineWidth = r * 0.055; g.beginPath(); g.arc(fx, y + r * 0.4, r * 0.17, Math.PI * 1.18, Math.PI * 1.82); g.stroke();
  } else if (emo === 'angry') {
    for (const k of [-1, 1]) { const cx = fx + k * sp; glow(g, cx, ey, r * 0.3, '#ff6a1a', 0.7); lid(cx, ey, r * 0.1, r * 0.12, ey - r * 0.02 + k * r * 0.08, ey - r * 0.02 - k * r * 0.08, '#ffd23a');
      seg(g, [[cx - r * 0.13, ey - r * 0.08 + k * r * 0.09], [cx + r * 0.13, ey - r * 0.08 - k * r * 0.09]], r * 0.05, WH); }
    g.fillStyle = WH; rr(g, fx - r * 0.17, y + r * 0.2, r * 0.34, r * 0.13, r * 0.05); g.fill();
    g.strokeStyle = INK; g.lineWidth = r * 0.018; g.beginPath(); g.moveTo(fx - r * 0.17, y + r * 0.265); g.lineTo(fx + r * 0.17, y + r * 0.265); for (let i = -2; i <= 2; i++) { g.moveTo(fx + i * r * 0.065, y + r * 0.2); g.lineTo(fx + i * r * 0.065, y + r * 0.33); } g.stroke();
  } else if (emo === 'smug') {
    for (const k of [-1, 1]) { const cx = fx + k * sp; lid(cx, ey, r * 0.1, r * 0.12, ey + r * 0.005 - k * dir * r * 0.015, ey + r * 0.005 + k * dir * r * 0.015);
      seg(g, [[cx - r * 0.12, ey + k * dir * r * 0.015], [cx + r * 0.12, ey - k * dir * r * 0.015]], r * 0.035, WH); }
    if (o.star !== false) star4(g, fx + dir * sp, ey + r * 0.05, r * 0.13);
    g.strokeStyle = WH; g.lineWidth = r * 0.055; g.beginPath(); g.moveTo(fx - dir * r * 0.15, y + r * 0.2); g.quadraticCurveTo(fx + dir * r * 0.02, y + r * 0.3, fx + dir * r * 0.2, y + r * 0.1); g.stroke();
  } else if (emo === 'crazy') {
    const big = fx + dir * sp, sm = fx - dir * sp;
    oval(big, ey - r * 0.02, r * 0.17, r * 0.19); circle(g, big + dir * r * 0.03, ey, r * 0.045, INK);
    seg(g, [[sm - r * 0.09, ey - r * 0.08], [sm + r * 0.07, ey], [sm - r * 0.09, ey + r * 0.08]], r * 0.05, WH);
    g.fillStyle = WH; rr(g, fx - r * 0.24, y + r * 0.2, r * 0.46, r * 0.16, r * 0.07); g.fill();
    seg(g, [[fx - r * 0.22, y + r * 0.28], [fx - r * 0.13, y + r * 0.22], [fx - r * 0.04, y + r * 0.34], [fx + r * 0.05, y + r * 0.22], [fx + r * 0.14, y + r * 0.34], [fx + r * 0.21, y + r * 0.26]], r * 0.02, INK);
    const cr = [[x - r * 0.3, y - r * 0.95], [x - r * 0.2, y - r * 0.7], [x - r * 0.36, y - r * 0.52], [x - r * 0.2, y - r * 0.32]];
    g.save(); g.globalCompositeOperation = 'lighter'; seg(g, cr, r * 0.12, alpha('#ff7a1a', 0.45)); g.restore(); seg(g, cr, r * 0.045, '#ffd36a'); glow(g, x - r * 0.3, y - r * 0.8, r * 0.5, '#ff8a2a', 0.55);
  }
}

// ---------- shared bits ----------
function heart(g, x, y, s, c, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s / 50, s / 50); g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-62, -14, -28, -62, 0, -28); g.bezierCurveTo(28, -62, 62, -14, 0, 30); g.closePath(); if (o.line) { g.lineWidth = o.line; g.strokeStyle = INK; g.stroke(); } g.fillStyle = c; g.fill(); g.restore(); }
function flash(g, x, y, s) { glow(g, x, y, s * 5, '#ffffff', 0.5); glow(g, x, y, s * 1.6, '#ffffff', 0.95); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, x - s * 6, 0, x + s * 6, 0, ['rgba(255,255,255,0)', 'rgba(255,255,255,.8)', 'rgba(255,255,255,0)']); g.fillRect(x - s * 6, y - s * 0.07, s * 12, s * 0.14); g.restore(); star4(g, x, y, s, '#ffffff'); }
// a hand (black ball + yellow-free dark sleeve) coming in from outside the frame, holding a phone with its flash on
function phoneHand(g, fromX, fromY, hx, hy, s, rot, o = {}) {
  g.lineCap = 'round'; seg(g, [[fromX, fromY], [hx, hy]], s * 0.55, o.sleeve || '#24202a'); circle(g, hx, hy, s * 0.36, INK);
  g.save(); g.translate(hx, hy - s * 0.5); g.rotate(rot); const w = s * 0.95, h = s * 1.7;
  rr(g, -w / 2, -h / 2, w, h, s * 0.16); g.fillStyle = '#1c1a22'; g.fill(); g.lineWidth = 4; g.strokeStyle = '#3a3644'; g.stroke();
  circle(g, -w * 0.22, -h * 0.34, s * 0.11, '#4a4656'); g.restore();
  if (o.flash !== false) flash(g, hx - Math.sin(rot) * s * -0.0 - s * 0.2, hy - s * 1.15, s * 0.42);
}
const vign = (g, a = 0.5, c = '0,0,0') => { g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * 0.42, E.W * 0.72, [`rgba(${c},0)`, `rgba(${c},${a})`]); g.fillRect(0, 0, E.W, E.H); g.restore(); };

// ---------- 1 COMIC POP-ART ----------
function bubble(g, s, x, y, size, tailX, tailY, o = {}) {
  const w = tw(g, s, size) + size * 1.1, h = size * 1.7;
  g.save(); g.lineJoin = 'round';
  const path = () => { g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, 0, 7); };
  g.fillStyle = 'rgba(0,0,0,.35)'; g.save(); g.translate(10, 10); path(); g.fill(); poly(g, [[x - size * 0.4, y + h * 0.2], [x + size * 0.4, y + h * 0.2], [tailX, tailY]], 'rgba(0,0,0,.35)'); g.restore();
  g.fillStyle = o.bg || WH; g.strokeStyle = INK; g.lineWidth = 8;
  g.beginPath(); g.moveTo(x - size * 0.45, y + h * 0.3); g.lineTo(tailX, tailY); g.lineTo(x + size * 0.45, y + h * 0.3); g.closePath(); g.fill(); g.stroke();
  path(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x - size * 0.4, y + h * 0.33); g.lineTo(x + size * 0.4, y + h * 0.33); g.lineWidth = 12; g.strokeStyle = o.bg || WH; g.stroke();
  T(g, s, x, y + size * 0.36, size, o.fg || INK, { align: 'center', stroke: 0, shadow: false, rot: o.rot || 0 });
  g.restore();
}
function envelope(g, x, y, w, rot, c = WH) {
  const h = w * 0.64; g.save(); g.translate(x, y); g.rotate(rot); g.lineJoin = 'round';
  g.fillStyle = 'rgba(0,0,0,.25)'; rr(g, -w / 2 + 6, -h / 2 + 8, w, h, 8); g.fill();
  g.fillStyle = c; g.strokeStyle = INK; g.lineWidth = 6; rr(g, -w / 2, -h / 2, w, h, 8); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-w / 2 + 4, -h / 2 + 4); g.lineTo(0, h * 0.08); g.lineTo(w / 2 - 4, -h / 2 + 4); g.lineWidth = 5; g.stroke();
  heart(g, 0, h * 0.06, w * 0.13, '#ff2a5a', { line: 4 }); g.restore();
}
function comic(g) {
  const cx = 600, cy = 560;
  g.fillStyle = '#1f5fe0'; g.fillRect(0, 0, E.W, E.H);
  for (let i = 0; i < 28; i++) { const a0 = i / 28 * Math.PI * 2, a1 = a0 + Math.PI / 28; g.fillStyle = i % 2 ? '#2f74ff' : '#1a52c8'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a0) * 2600, cy + Math.sin(a0) * 2600); g.lineTo(cx + Math.cos(a1) * 2600, cy + Math.sin(a1) * 2600); g.closePath(); g.fill(); }
  for (let yy = 0; yy < E.H + 30; yy += 30) for (let xx = (yy / 30 % 2) * 15; xx < E.W + 30; xx += 30) { const d = Math.hypot(xx - cx, yy - cy) / 1400; const rr2 = Math.min(11, d * 12); if (rr2 > 1) circle(g, xx, yy, rr2, alpha('#0c2a7a', 0.35)); }
  glow(g, cx, cy, 520, '#ffe9a0', 0.35);
  // pile of love letters on the right + some flying in
  const r = rng(41), cols = [WH, '#ffd6e6', '#fff1b8', '#d6ecff'];
  for (let i = 0; i < 46; i++) { const k = i / 46; envelope(g, 1180 + r() * 700, 1120 - k * 300 - r() * 120 + Math.abs(r() - 0.5) * 80 * (1 - k), 150 + r() * 40, (r() - 0.5) * 1.2, cols[i % 4]); }
  for (const [x, y, rot] of [[1240, 640, -0.4], [1500, 560, 0.3], [1760, 650, -0.2], [1080, 520, 0.5]]) { g.lineCap = 'round'; for (let j = 0; j < 3; j++) seg(g, [[x + 70, y - 60 + j * 26], [x + 170, y - 120 + j * 26]], 7, alpha(WH, 0.85)); envelope(g, x, y, 150, rot, cols[(x / 10) % 4 | 0]); }
  heart(g, 1650, 860, 60, '#ff2a5a', { line: 6, rot: 0.2 }); heart(g, 1320, 900, 46, '#ff2a5a', { line: 6, rot: -0.3 });
  // the hero
  heroY(g, cx, cy, 205, 'shocked', { pose: 'head', dir: 1, glow: '#fff4c0', glowA: 0.3 });
  for (const [a, d] of [[-2.6, 300], [-2.2, 330], [-0.9, 330], [-0.5, 300]]) { g.lineCap = 'round'; seg(g, [[cx + Math.cos(a) * d, cy + Math.sin(a) * d], [cx + Math.cos(a) * (d + 70), cy + Math.sin(a) * (d + 70)]], 12, INK); }
  // speech bubbles from the crowd outside the frame
  bubble(g, 'HEIRATE MICH!', 880, 150, 46, 780, 330);
  bubble(g, 'BITTE!!', 165, 300, 52, 330, 430);
  bubble(g, 'ICH LIEBE DICH!', 230, 890, 46, 380, 760);
  // headline
  T(g, '10.000', 1870, 235, 205, '#ffd21a', { align: 'right', stroke: 26, shadowD: 14 });
  T(g, 'ANTRÄGE.', 1870, 380, 130, WH, { align: 'right', stroke: 20, shadowD: 10 });
  tag(g, 'JEDEN TAG!', 1870, 410, 58, '#ff2a5a', WH, { align: 'right', rot: 0.03 });
}

// ---------- 2 WANTED POSTER ----------
function wanted(g) {
  for (let i = 0; i < 9; i++) { const y = i * 124; g.fillStyle = ['#7a4a26', '#875330', '#6e4220'][i % 3]; g.fillRect(0, y, E.W, 124);
    const r = rng(60 + i); g.strokeStyle = alpha('#3a1e0a', 0.35); g.lineWidth = 3; for (let j = 0; j < 6; j++) { const yy = y + 14 + r() * 96; g.beginPath(); g.moveTo(0, yy); for (let x = 0; x <= E.W; x += 120) g.lineTo(x, yy + Math.sin(x * 0.004 + j) * 6); g.stroke(); }
    g.fillStyle = '#2a1608'; g.fillRect(0, y + 120, E.W, 6); circle(g, 120 + (i % 2) * 900, y + 62, 7, '#3a2412'); circle(g, 1800 - (i % 2) * 500, y + 62, 7, '#3a2412'); }
  glow(g, 760, 480, 900, '#ffd890', 0.35); vign(g, 0.65);
  // the poster
  g.save(); g.translate(720, 545); g.rotate(-0.035);
  const w = 790, h = 1010, r = rng(7);
  g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(-w / 2 + 18, -h / 2 + 22, w, h);
  g.beginPath(); g.moveTo(-w / 2, -h / 2); for (let x = -w / 2; x <= w / 2; x += 30) g.lineTo(x, -h / 2 + r() * 10); for (let y = -h / 2; y <= h / 2; y += 30) g.lineTo(w / 2 - r() * 10, y); for (let x = w / 2; x >= -w / 2; x -= 30) g.lineTo(x, h / 2 - r() * 10); for (let y = h / 2; y >= -h / 2; y -= 30) g.lineTo(-w / 2 + r() * 10, y); g.closePath();
  g.fillStyle = radGrad(g, 0, 0, 100, 650, ['#f6e7c2', '#d9bd88']); g.fill();
  g.strokeStyle = '#3a2412'; g.lineWidth = 6; g.strokeRect(-w / 2 + 34, -h / 2 + 34, w - 68, h - 68);
  T(g, 'GESUCHT', 0, -h / 2 + 175, 158, '#3a2412', { align: 'center', stroke: 0, shadow: false, spacing: 6 });
  // mugshot
  const mx = -250, my = -h / 2 + 205, mw = 500, mh = 390;
  g.fillStyle = '#e4cfa0'; g.fillRect(mx, my, mw, mh);
  g.strokeStyle = alpha('#3a2412', 0.35); g.lineWidth = 3; for (let i = 1; i < 7; i++) { g.beginPath(); g.moveTo(mx, my + i * 56); g.lineTo(mx + mw, my + i * 56); g.stroke(); }
  g.save(); g.beginPath(); g.rect(mx, my, mw, mh); g.clip(); heroY(g, 0, my + 165, 118, 'smug', { pose: 'down', dir: 1 }); g.restore();
  g.lineWidth = 10; g.strokeStyle = '#3a2412'; g.strokeRect(mx, my, mw, mh);
  T(g, 'WEGEN:', 0, my + mh + 78, 56, '#3a2412', { align: 'center', stroke: 0, shadow: false, spacing: 4 });
  T(g, 'ZU SCHÖN', 0, my + mh + 205, 150, '#c8241a', { align: 'center', stroke: 0, shadow: false });
  g.fillStyle = '#3a2412'; g.fillRect(-300, my + mh + 232, 600, 5);
  T(g, 'BELOHNUNG: 1.000.000 €', 0, my + mh + 300, 52, '#3a2412', { align: 'center', stroke: 0, shadow: false });
  for (const [px, py] of [[-w / 2 + 40, -h / 2 + 40], [w / 2 - 40, -h / 2 + 40], [-w / 2 + 40, h / 2 - 40], [w / 2 - 40, h / 2 - 40]]) { circle(g, px + 3, py + 4, 15, 'rgba(0,0,0,.4)'); circle(g, px, py, 14, '#8a8a92'); circle(g, px - 4, py - 4, 5, '#d8d8e0'); }
  g.restore();
  // the real one, proudly next to his poster
  heroY(g, 1545, 470, 170, 'smug', { pose: 'hips', dir: -1, glow: '#ffd890', glowA: 0.4 });
  star4(g, 1340, 330, 30); star4(g, 1760, 300, 22); star4(g, 1250, 520, 18);
}

// ---------- 3 BEFORE / AFTER SPLIT ----------
function split(g) {
  const sx0 = 1030, sx1 = 890; // divider top / bottom x
  const left = () => { g.beginPath(); g.moveTo(0, 0); g.lineTo(sx0, 0); g.lineTo(sx1, E.H); g.lineTo(0, E.H); g.closePath(); };
  const right = () => { g.beginPath(); g.moveTo(sx0, 0); g.lineTo(E.W, 0); g.lineTo(E.W, E.H); g.lineTo(sx1, E.H); g.closePath(); };
  // BEFORE: warm, ordinary, friends
  g.save(); left(); g.clip();
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#9ed1a0', '#5fa86a']); g.fillRect(0, 0, E.W, E.H);
  circle(g, 760, 260, 90, '#fff2b0'); glow(g, 760, 260, 300, '#fff2b0', 0.5);
  g.fillStyle = '#4f9a5a'; g.beginPath(); g.ellipse(500, 1120, 900, 300, 0, 0, 7); g.fill();
  heroY(g, 190, 640, 120, 'happy', { pose: 'down', dir: 1, col: '#5b8ee8' });
  heroY(g, 790, 650, 120, 'happy', { pose: 'down', dir: -1, col: '#e86a8a' });
  heroY(g, 480, 600, 150, 'happy', { pose: 'up', dir: 1 });
  heart(g, 330, 330, 40, '#ff4a6a', { line: 5, rot: -0.2 }); heart(g, 640, 300, 34, '#ff4a6a', { line: 5, rot: 0.2 });
  g.restore();
  // AFTER: neon spotlight, alone, phones everywhere
  g.save(); right(); g.clip();
  g.fillStyle = radGrad(g, 1420, 560, 60, 1000, ['#ff4ab0', '#8a1ad0', '#2a0a5a']); g.fillRect(0, 0, E.W, E.H);
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; g.fillStyle = alpha('#ffffff', 0.05); g.beginPath(); g.moveTo(1420, 560); g.lineTo(1420 + Math.cos(a) * 1500, 560 + Math.sin(a) * 1500); g.lineTo(1420 + Math.cos(a + 0.12) * 1500, 560 + Math.sin(a + 0.12) * 1500); g.fill(); }
  heroY(g, 1420, 600, 160, 'sad', { pose: 'down', dir: -1, glow: '#ffb0e0', glowA: 0.35 });
  phoneHand(g, 2000, 300, 1800, 430, 92, 0.25);
  phoneHand(g, 2000, 900, 1790, 770, 100, -0.2);
  phoneHand(g, 1000, 1200, 1090, 930, 90, 0.15);
  phoneHand(g, 1500, -200, 1660, 170, 82, -0.4, {});
  g.restore();
  // divider + arrow
  g.lineCap = 'butt'; seg(g, [[sx0, -10], [sx1, E.H + 10]], 30, INK); seg(g, [[sx0, -10], [sx1, E.H + 10]], 16, WH);
  const ax = 960, ay = 560; g.save(); g.translate(ax, ay); g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.moveTo(-90 + 8, -40 + 8); g.lineTo(20 + 8, -40 + 8); g.lineTo(20 + 8, -90 + 8); g.lineTo(110 + 8, 0 + 8); g.lineTo(20 + 8, 90 + 8); g.lineTo(20 + 8, 40 + 8); g.lineTo(-90 + 8, 40 + 8); g.fill();
  g.fillStyle = '#ffd21a'; g.strokeStyle = INK; g.lineWidth = 8; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-90, -40); g.lineTo(20, -40); g.lineTo(20, -90); g.lineTo(110, 0); g.lineTo(20, 90); g.lineTo(20, 40); g.lineTo(-90, 40); g.closePath(); g.fill(); g.stroke(); g.restore();
  // labels
  T(g, 'VORHER', 60, 150, 128, WH, { stroke: 18 });
  T(g, 'NACHHER', 1860, 150, 128, '#ffd21a', { align: 'right', stroke: 18 });
  tag(g, 'PLATZ 1 WELTWEIT', 1860, 180, 52, '#ff2a4a', WH, { align: 'right', rot: 0.03 });
  tag(g, 'GANZ NORMAL', 66, 180, 52, WH, INK, { rot: -0.03 });
}

// ---------- 4 EXTREME CLOSE-UP EYE ----------
function eyeShot(g) {
  g.fillStyle = radGrad(g, 300, 300, 50, 1200, ['#14606e', '#082a33']); g.fillRect(0, 0, E.W, E.H);
  const r0 = rng(77); for (let i = 0; i < 40; i++) { const x = r0() * 700, y = r0() * 700; glow(g, x, y, 10 + r0() * 30, '#6af0ff', 0.4); }
  const hx = 1200, hy = 800, R = 880;
  glow(g, hx, hy, R * 1.25, '#3fe0ff', 0.25);
  circle(g, hx + 30, hy + 8, R, CREAM); circle(g, hx, hy, R, INK);
  g.save(); g.beginPath(); g.arc(hx, hy, R, 0, 7); g.clip(); g.fillStyle = CAP; g.beginPath(); g.ellipse(hx - 40, hy - R * 0.95, R * 1.25, R * 0.72, -0.22, 0, 7); g.fill(); g.restore();
  // the huge eye with a crowd + flashes reflected in it
  const ex = 1380, ey = 520, er = 285;
  glow(g, ex, ey, er * 1.6, '#bff6ff', 0.3);
  circle(g, ex, ey, er, WH);
  g.save(); g.beginPath(); g.arc(ex + 20, ey + 10, er * 0.74, 0, 7); g.clip();
  g.fillStyle = radGrad(g, ex, ey - 40, 10, er, ['#bff6ff', '#2a8aa8', '#0a2030']); g.fillRect(ex - er, ey - er, er * 2, er * 2);
  const r = rng(5);
  for (const [fx2, fy2] of [[-140, -120], [40, -150], [150, -70], [-60, -40], [110, 20]]) flash(g, ex + fx2, ey + fy2, 13);
  for (const [rowY, s, n] of [[ey + 10, 24, 12], [ey + 90, 36, 8], [ey + 180, 50, 6]]) for (let i = 0; i < n; i++) { const x = ex - er + 30 + i * (er * 2 / n) + r() * 14; circle(g, x, rowY, s, '#061018'); g.fillStyle = '#061018'; g.beginPath(); g.ellipse(x, rowY + s * 1.9, s * 1.5, s * 1.1, 0, 0, 7); g.fill(); if (r() < 0.6) { seg(g, [[x + s, rowY + s], [x + s * 1.3, rowY - s * 1.2]], s * 0.45, '#061018'); g.fillStyle = '#ffffff'; rr(g, x + s * 1.05, rowY - s * 2.2, s * 0.6, s, s * 0.1); g.fill(); glow(g, x + s * 1.35, rowY - s * 1.7, s * 1.2, '#ffffff', 0.6); } }
  g.restore();
  circle(g, ex + 120, ey - 130, 46, alpha(WH, 0.95)); circle(g, ex + 60, ey - 60, 18, alpha(WH, 0.9));
  // the other, squinting eye + grin + glowing crack
  g.lineCap = 'round'; g.lineJoin = 'round'; seg(g, [[790, 450], [960, 540], [790, 630]], 46, WH);
  g.fillStyle = WH; rr(g, 900, 920, 640, 210, 80); g.fill();
  seg(g, [[930, 1010], [1010, 950], [1090, 1060], [1170, 950], [1250, 1060], [1330, 950], [1410, 1060], [1500, 980]], 16, INK);
  const cr = [[1640, -10], [1580, 120], [1690, 210], [1600, 330]];
  g.save(); g.globalCompositeOperation = 'lighter'; seg(g, cr, 70, alpha('#ff7a1a', 0.45)); g.restore(); seg(g, cr, 22, '#ffd36a'); glow(g, 1630, 150, 260, '#ff8a2a', 0.5);
  vign(g, 0.35);
  T(g, 'SIE SIND', 60, 175, 150, WH, { stroke: 20 });
  T(g, 'ÜBERALL.', 60, 320, 150, '#5ff4ff', { stroke: 20 });
  tag(g, 'IN JEDEM HANDY', 66, 355, 54, '#ff2a4a', WH, { rot: -0.04 });
}

// ---------- 5 DIE-CUT STICKER COLLAGE ----------
function stickerize(g, draw, outline = 16) {
  const c = document.createElement('canvas'); c.width = E.W; c.height = E.H; const cg = c.getContext('2d'); draw(cg);
  const sil = (col) => { const s = document.createElement('canvas'); s.width = E.W; s.height = E.H; const sg = s.getContext('2d'); sg.drawImage(c, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = col; sg.fillRect(0, 0, E.W, E.H); return s; };
  const blk = sil(INK), wht = sil(WH), shd = sil('rgba(0,0,0,.4)');
  for (let a = 0; a < 24; a++) { const dx = Math.cos(a / 24 * Math.PI * 2), dy = Math.sin(a / 24 * Math.PI * 2); g.drawImage(shd, dx * (outline + 6) + 16, dy * (outline + 6) + 20); }
  for (let a = 0; a < 24; a++) { const dx = Math.cos(a / 24 * Math.PI * 2), dy = Math.sin(a / 24 * Math.PI * 2); g.drawImage(blk, dx * (outline + 6), dy * (outline + 6)); }
  for (let a = 0; a < 24; a++) { const dx = Math.cos(a / 24 * Math.PI * 2), dy = Math.sin(a / 24 * Math.PI * 2); g.drawImage(wht, dx * outline, dy * outline); }
  g.drawImage(c, 0, 0);
}
function sticker(g) {
  g.fillStyle = linGrad(g, 0, 0, E.W, E.H, ['#ff8a1a', '#ff3a6a']); g.fillRect(0, 0, E.W, E.H);
  g.save(); g.globalAlpha = 0.14; g.fillStyle = WH; for (let i = -10; i < 30; i++) { g.beginPath(); g.moveTo(i * 120, 0); g.lineTo(i * 120 + 60, 0); g.lineTo(i * 120 - 540, E.H); g.lineTo(i * 120 - 600, E.H); g.fill(); } g.restore();
  glow(g, 520, 560, 600, '#fff0a0', 0.35);
  // the rejection letter
  const lx = 1390, ly = 740;
  stickerize(g, (cg) => { cg.save(); cg.translate(lx, ly); cg.rotate(0.07); cg.fillStyle = '#ffffff'; cg.fillRect(-270, -320, 540, 640);
    T(cg, 'BEWERBUNG', 0, -230, 68, '#2a2430', { align: 'center', stroke: 0, shadow: false });
    for (let i = 0; i < 6; i++) { cg.fillStyle = '#cfcad6'; rr(cg, -220, -170 + i * 44, i % 3 === 2 ? 260 : 440, 16, 8); cg.fill(); }
    cg.save(); cg.rotate(-0.22); cg.strokeStyle = '#e0201a'; cg.lineWidth = 14; rr(cg, -215, 100, 430, 125, 18); cg.stroke(); T(cg, 'ABGELEHNT', 0, 193, 78, '#e0201a', { align: 'center', stroke: 0, shadow: false }); cg.restore();
    cg.restore(); }, 14);
  // red marker circle + arrow, YouTube style
  g.save(); g.strokeStyle = '#ff1a1a'; g.lineWidth = 16; g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 10;
  g.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 60 * Math.PI * 2 - 0.4, rx = 330 + Math.sin(i * 0.7) * 8, ry = 150; g.lineTo(lx + 10 + Math.cos(a) * rx, ly + 140 + Math.sin(a) * ry + i * 0.4); } g.stroke(); g.restore();
  // the hero as a sticker, angry, pointing at it
  stickerize(g, (cg) => heroY(cg, 520, 500, 175, 'angry', { pose: 'point', dir: 1, bottom: 500 + 175 * 3.6 }), 18);
  // small stickers
  const burst = (x, y, R, c, s, size, rot) => { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, d = i % 2 ? R * 0.78 : R; g.lineTo(Math.cos(a) * d, Math.sin(a) * d); } g.closePath(); g.fillStyle = 'rgba(0,0,0,.35)'; g.save(); g.translate(8, 10); g.fill(); g.restore(); g.fillStyle = c; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(); T(g, s, 0, size * 0.36, size, INK, { align: 'center', stroke: 0, shadow: false }); g.restore(); };
  burst(190, 175, 150, '#ffe23a', 'WARUM?!', 46, -0.18);
  // headline
  T(g, 'ZU SCHÖN', 1880, 190, 170, WH, { align: 'right', stroke: 24, shadowD: 12 });
  T(g, 'FÜR DEN JOB?', 1880, 330, 118, '#ffe23a', { align: 'right', stroke: 20, shadowD: 10 });
}

const V = { 1: comic, 2: wanted, 3: split, 4: eyeShot, 5: sticker };
for (const s of E.shots) if (s.params?.tpl === 'pop5') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
