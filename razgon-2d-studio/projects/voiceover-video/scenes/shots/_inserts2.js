// _inserts2.js — insert / macro close-ups for "What if you used 100% of your brain?". Merged into INSERTS.
import { E, V, S, mood, ease, prog, clamp, lerp, key, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, measure, rng, noise, FONTS } from '/engine/core.js';
import { spring, impact, smear, kText, drift } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import { bgBlur, wt, COL, fadeIO } from './_common.js';
import { INSERTS } from './_inserts.js';
import { CAST, MAX, BAND } from '../cast.js';
import { scanHead } from '../sets/extra.js';

const INK = () => S().ink;
const BG = (g, t, info, d = {}) => bgBlur(g, t, info.set || d.set || 'bedroom', info.so || d.so || {}, { z: d.z ?? 1.8, x: d.x ?? 0, y: d.y ?? -120, blur: 16, veil: info.veil ?? d.veil ?? 0.45 });
const push = (t, info, a = 0.06) => 1 + a * ease.inOut(t / info.dur);
function zoomAt(g, s, cx = E.W / 2, cy = E.H / 2) { g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); }
function hand(g, x, y, s, o = {}) {
  const side = o.side ?? 1, ink = INK(), sleeve = o.sleeve || MAX.color, ex = side > 0 ? E.W + 400 : -400;
  seg(g, [[x + 40 * s * side, y + 20 * s], [ex, y + 260 * s]], 70 * s, ink); seg(g, [[x + 150 * s * side, y + 70 * s], [ex, y + 260 * s]], 96 * s, sleeve);
  if (o.closed) { circle(g, x, y, 46 * s, ink); for (let i = 0; i < 4; i++) circle(g, x - 34 * s * side + i * 4 * s * side, y - 30 * s + i * 20 * s, 15 * s, ink); }
  else if (o.pinch) { circle(g, x, y, 42 * s, ink); seg(g, [[x, y], [x - 70 * s * side, y - 70 * s]], 17 * s, ink); seg(g, [[x, y], [x - 90 * s * side, y - 20 * s]], 17 * s, ink); }
  else if (o.point) { circle(g, x, y, 44 * s, ink); seg(g, [[x, y], [x - 110 * s * side, y - 30 * s]], 18 * s, ink); }
  else { circle(g, x + 10 * s * side, y + 6 * s, 40 * s, ink); for (let i = 0; i < 4; i++) { const a = side > 0 ? -2.2 + i * 0.32 : -0.94 - i * 0.32; seg(g, [[x, y], [x + Math.cos(a) * 95 * s, y + Math.sin(a) * 95 * s]], 17 * s, ink); } }
}
function panel(g, x, y, w, h, o = {}) { rr(g, x - 14, y - 14, w + 28, h + 28, o.r ?? 26); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = o.bg || '#141a26'; g.fillRect(x, y, w, h); glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, o.glow || '#9fd8ff', 0.16); }
const tx = (g, s, x, y, size, color, o = {}) => text(g, s, x, y, { size, color, font: FONTS.ui, weight: 900, ...o });

// the headband itself: a glowing cyan band with the tiny red switch. {hot, dead, labels:[{s, at}], press}
export function drawBand(g, x, y, w, t, o = {}) {
  const h = w * 0.16, col = o.dead ? '#3a3f4a' : mix(BAND, '#ff6a3a', clamp(o.hot || 0));
  g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  g.lineCap = 'round'; g.strokeStyle = shade(col, -0.35); g.lineWidth = h; g.beginPath(); g.ellipse(0, 0, w / 2, w * 0.18, 0, Math.PI * 0.05, Math.PI * 0.95, true); g.stroke();
  g.strokeStyle = col; g.lineWidth = h * 0.8; g.beginPath(); g.ellipse(0, 0, w / 2, w * 0.18, 0, Math.PI * 0.08, Math.PI * 0.92, true); g.stroke();
  if (!o.dead) { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i * 0.105), px = Math.cos(a) * w / 2, py = Math.sin(a) * w * 0.18, k = 0.5 + 0.5 * Math.sin(t * 5 - i * 0.8); circle(g, px, py, h * 0.12, alpha('#ffffff', 0.4 + 0.5 * k)); } glow(g, 0, -w * 0.12, w * 0.7, col, 0.22 + 0.2 * (o.hot || 0)); }
  const sx = w * 0.3, sy = -w * 0.15; rr(g, sx - h * 0.4, sy - h * 0.3, h * 0.8, h * 0.6, h * 0.15); g.fillStyle = '#1a1620'; g.fill(); const pr = o.press || 0;
  rr(g, sx - h * 0.25, sy - h * 0.2 + pr * h * 0.1, h * 0.5, h * 0.35, h * 0.1); g.fillStyle = o.dead ? '#4a2a2a' : '#ff3a2a'; g.fill(); if (!o.dead) glow(g, sx, sy, h * 1.2, '#ff3a2a', 0.5);
  if (o.hot > 0.3) for (let i = 0; i < 5; i++) { const ph = (t * 0.7 + i / 5) % 1; seg(g, [[-w * 0.3 + i * w * 0.15, -w * 0.25 - ph * w * 0.3], [-w * 0.3 + i * w * 0.15 + 8, -w * 0.25 - ph * w * 0.3 - 26]], 4, alpha('#ff9a6a', (1 - ph) * o.hot)); }
  g.restore();
  return [x + Math.cos(o.rot || 0) * sx - Math.sin(o.rot || 0) * sy, y + Math.sin(o.rot || 0) * sx + Math.cos(o.rot || 0) * sy];
}

Object.assign(INSERTS, {
  // headband on a palm / table with optional labels: {hot, dead, labels:[{s, at, color}], hand}
  band(g, t, info) {
    BG(g, t, info, { set: info.set || 'street' }); g.save(); zoomAt(g, push(t, info, 0.08)); const x = E.W * 0.46, y = E.H * 0.55;
    if (info.hand !== false) hand(g, x + 40, y + 200, 2.2, { side: 1 });
    const hot = info.hotK ? key(t, info.hotK.map(([a, v]) => [wt(info, a, 0), v])) : info.hot || 0;
    const [sx, sy] = drawBand(g, x, y, 640, t, { hot, dead: info.dead, rot: -0.08 });
    if (info.ring) { const k = ease.outBack(prog(t, wt(info, info.ring, 0.4), wt(info, info.ring, 0.4) + 0.4)); if (k > 0) { ring(g, sx, sy, 70 * k, 6, COL().accent); UI.callout(g, t, { at: [sx + 40, sy - 40], to: [sx + 280, sy - 260], str: info.ringLabel || 'BURST', start: wt(info, info.ring, 0.4), color: COL().accent }); } }
    (info.labels || []).forEach((l, i) => kText(g, t, l.s, E.W * (l.x ?? 0.5), E.H * (l.y ?? 0.16), { start: wt(info, l.at, 0.3 + i * 0.5) - 0.06, mode: l.mode || 'slam', size: l.size || 84, color: COL()[l.color || 'gold'], glow: 20, font: FONTS.ui, weight: 900, out: info.dur - 0.25 }));
    g.restore();
  },
  // thumb pressing the red switch: flash + rings
  switch(g, t, info) {
    g.fillStyle = '#07060a'; g.fillRect(0, 0, E.W, E.H); const tp = wt(info, info.at || 'press', 0.6), k = ease.inOut(prog(t, tp - 0.4, tp)), ih = impact(t, tp, { amp: 18 });
    g.save(); g.translate(ih.x, ih.y); zoomAt(g, 1 + 0.12 * ease.out(prog(t, 0, info.dur)));
    drawBand(g, E.W * 0.45, E.H * 0.62, 1500, t, { press: k, rot: -0.05 });
    hand(g, E.W * 0.45 + 450 + 120 * (1 - k), E.H * 0.62 - 330 - 160 * (1 - k), 2.6, { side: 1, point: true });
    if (t > tp) { const q = t - tp; glow(g, E.W * 0.6, E.H * 0.45, 900 * clamp(q * 2), '#ff4a3a', 0.6 * clamp(1 - q)); FX.rings(g, E.W * 0.6, E.H * 0.45, q, { count: 3, r0: 60, r1: 900, speed: 1.4, color: '#ffd0c0', a: 0.6 * clamp(1 - q / 1.5) }); }
    g.restore();
  },
  // book pages flipping fast + counter
  bookflip(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W / 2, y = E.H * 0.6, n = info.n || 12, st = wt(info, info.at || 'glance', 0.3), sp = info.speed || 8;
    for (const s of [-1, 1]) { g.save(); g.translate(x, y); g.scale(s, 1); poly(g, [[0, -300], [620, -340], [640, 300], [0, 340]], '#f2ece0'); for (let i = 0; i < 11; i++) seg(g, [[60, -250 + i * 52], [580, -270 + i * 52]], 8, alpha('#8a8a9a', 0.4)); g.restore(); }
    const flips = Math.min(n, Math.max(0, (t - st) * sp)); const ph = flips % 1;
    if (flips < n && t > st) { const a = ph * Math.PI; g.save(); g.translate(x, y); g.scale(Math.cos(a), 1); poly(g, [[0, -300], [620, -340 - Math.sin(a) * 30], [640, 300], [0, 340]], '#e8e0d0'); g.restore(); }
    UI.readout(g, { label: info.label || 'PAGES', value: String(Math.floor(flips)), x: E.W * 0.08, y: E.H * 0.12, a: fadeIO(t, info.dur) });
    if (info.done && flips >= n) kText(g, t, info.done, x, E.H * 0.18, { start: st + n / sp, mode: 'slam', size: 110, color: COL().gold, glow: 24 });
    g.restore();
  },
  // spoken list: words pop as numbered tags in order: {items:[{s, at}]}
  list(g, t, info) {
    BG(g, t, info, { set: 'kitchen' }); const C = COL(), items = info.items || [];
    items.forEach((it, i) => { const st = wt(info, it.at || it.s, 0.3 + i * 0.4), k = spring(t, st - 0.05, { freq: 2.8, damp: 0.55 }); if (k <= 0) return;
      const cols = items.length > 4 ? 3 : 2, x = E.W * (0.24 + (i % cols) * (0.52 / (cols - 1))), y = E.H * (0.3 + Math.floor(i / cols) * 0.22);
      g.save(); g.translate(x, y); g.scale(clamp(k, 0, 1.2), clamp(k, 0, 1.2)); g.rotate((i % 2 ? 1 : -1) * 0.03); rr(g, -190, -60, 380, 120, 24); g.fillStyle = it.bad ? alpha('#2a3a2a', 0.95) : 'rgba(244,239,230,.95)'; g.fill();
      circle(g, -140, 0, 34, C.gold); tx(g, String(i + 1), -140, 2, 36, '#2a2236'); tx(g, it.s.toUpperCase(), 30, 2, 44, it.bad ? '#bfe0a0' : '#2a2236'); g.restore(); });
  },
  // number counting up with a label: {label, to, at, dur, unit}
  count(g, t, info) {
    BG(g, t, info, { set: info.set || 'street' }); const st = wt(info, info.at, 0.1), k = ease.out(prog(t, st, st + (info.cdur ?? 0.6))), v = Math.round((info.to ?? 41) * k);
    const C = COL(); tx(g, info.label || 'CARS', E.W / 2, E.H * 0.3, 60, C.cream, { spacing: 10, alpha: ease.out(prog(t, 0, 0.3)) });
    const ih = impact(t, st + (info.cdur ?? 0.6), { amp: 10 }); text(g, v.toLocaleString('en-US') + (info.unit || ''), E.W / 2 + ih.x, E.H * 0.55 + ih.y, { size: 260, color: C.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(C.gold, 0.6) });
    if (info.icon) for (let i = 0; i < Math.min(30, v); i++) circle(g, E.W * 0.2 + (i % 15) * E.W * 0.04, E.H * 0.8 + Math.floor(i / 15) * 50, 12, alpha(C.cream, 0.6));
  },
  // a sheet of paper: {title, lines, notes, stamp, stampAt, circles:[{at, row}]}
  paper(g, t, info) {
    BG(g, t, info, { set: info.set || 'class' }); g.save(); zoomAt(g, push(t, info, 0.06)); g.translate(E.W / 2, E.H * 0.53 + (1 - ease.out(prog(t, 0, 0.4))) * 100); g.rotate(-0.03);
    g.fillStyle = '#f2ece0'; g.fillRect(-440, -440, 880, 900); if (info.title) tx(g, info.title, 0, -380, 44, '#2a2a34', { spacing: 5 });
    const rows = info.rows ?? 12; for (let i = 0; i < rows; i++) seg(g, [[-370, -290 + i * 56], [-370 + 740 * (0.55 + ((i * 37) % 40) / 100), -290 + i * 56]], 8, alpha('#8a8a9a', 0.45));
    if (info.notes) { const n = Math.floor(clamp((t - wt(info, info.notesAt, 0.3)) * (info.notesSpeed ?? 8)) * rows); for (let i = 0; i < n; i++) { seg(g, [[200, -300 + i * 56], [380, -284 + i * 56]], 4, '#c0392b'); circle(g, 180, -290 + i * 56, 6, '#c0392b'); } }
    (info.circles || []).forEach((c, i) => { const k = ease.out(prog(t, wt(info, c.at, 0.5 + i * 0.4), wt(info, c.at, 0.5 + i * 0.4) + 0.3)); if (k <= 0) return; g.strokeStyle = '#c0392b'; g.lineWidth = 7; g.beginPath(); g.ellipse(-150 + (i % 2) * 220, -290 + c.row * 56, 160, 40, 0, 0, Math.PI * 2 * k); g.stroke(); });
    if (info.stamp) { const k = spring(t, wt(info, info.stampAt, 0.8), { freq: 3, damp: 0.5 }); if (k > 0) { g.save(); g.translate(240, 300); g.rotate(-0.2); g.scale(clamp(2 - k, 0.9, 2), clamp(2 - k, 0.9, 2)); g.globalAlpha = clamp(k); rr(g, -150, -70, 300, 140, 16); g.strokeStyle = info.stampColor || '#c0392b'; g.lineWidth = 10; g.stroke(); tx(g, info.stamp, 0, 4, info.stampSize || 76, info.stampColor || '#c0392b'); g.restore(); } }
    if (info.timer) UI.readout(g, { label: 'TIME', value: info.timer, x: -900, y: -420, a: fadeIO(t, info.dur) });
    g.restore();
  },
  // a phone falls and is caught between two fingers
  phonecatch(g, t, info) {
    BG(g, t, info, { set: 'balcony', veil: 0.35 }); const land = wt(info, info.at || 'catch', 0.9), d = ease.in(prog(t, 0, land)), hx = E.W * 0.5, hy = E.H * 0.7, cy = lerp(-E.H * 0.1, hy - 120, d), ih = impact(t, land, { amp: 10 });
    g.save(); g.translate(ih.x, ih.y); hand(g, hx + 60, hy + 40, 1.4, { side: 1, pinch: true }); g.save(); g.translate(hx - 30, cy); g.rotate(-1.2 * (1 - d) - 0.25); rr(g, -55, -110, 110, 220, 18); g.fillStyle = '#121018'; g.fill(); g.fillStyle = '#3a6ea5'; g.fillRect(-45, -96, 90, 180); g.restore();
    if (t < land) for (let i = 0; i < 5; i++) seg(g, [[hx - 90 + i * 30, cy - 150 - i * 10], [hx - 90 + i * 30, cy - 260 - i * 10]], 4, alpha('#ffffff', 0.3));
    if (t > land) { FX.rings(g, hx - 30, hy - 120, t - land, { count: 2, r0: 40, r1: 260, color: '#fff3e0', a: 0.5 * (1 - prog(t, land, land + 1)) }); kText(g, t, info.label || 'TWO FINGERS', E.W / 2, E.H * 0.16, { start: land + 0.1, mode: 'rise', size: 70, color: COL().gold, glow: 18, font: FONTS.ui, weight: 900 }); }
    g.restore();
  },
  // checkout screen: list of items, one wrong price flashes: {at}
  receipt(g, t, info) {
    BG(g, t, info, { set: 'market' }); const x = E.W * 0.26, y = E.H * 0.12, w = E.W * 0.48, h = E.H * 0.72; panel(g, x, y, w, h, { bg: '#0a1410', glow: '#5fd39a' }); const C = COL();
    const items = [['MILK', '1.19'], ['EGGS', '2.49'], ['RICE', '1.89'], ['SOAP', '0.99'], ['BLUE CHEESE', '3.79'], ['BREAD', '1.29'], ['RICE', '1.89']];
    const st = wt(info, info.at || 'Wrong', 1.2), bad = 4;
    items.forEach(([n, p], i) => { const k = ease.out(prog(t, 0.1 + i * 0.12, 0.3 + i * 0.12)); if (k <= 0) return; const yy = y + 80 + i * 76, hl = i === bad && t > st;
      if (hl) { g.fillStyle = alpha(C.accent, 0.25 + 0.15 * Math.sin(t * 10)); g.fillRect(x + 20, yy - 34, w - 40, 64); }
      tx(g, n, x + 50, yy, 40, hl ? C.accent : '#5fd39a', { align: 'left', alpha: k }); tx(g, hl ? '5.79' : p, x + w - 50, yy, 40, hl ? C.accent : '#5fd39a', { align: 'right', alpha: k }); });
    if (t > st + 0.5) { const k = spring(t, st + 0.5); ring(g, x + w - 120, y + 80 + bad * 76, 70 * clamp(k, 0, 1.2), 6, C.accent); kText(g, t, '+2 COINS', x + w + 220, y + 80 + bad * 76, { start: wt(info, 'coins', st + 0.6), mode: 'slam', size: 64, color: C.accent, glow: 18, font: FONTS.ui, weight: 900 }); }
  },
  // remembered faces pop in a grid with captions: {faces:[{s, at, outfit}]}
  faces(g, t, info) {
    BG(g, t, info, { set: info.set || 'street', veil: 0.6 }); const fs = info.faces || [], C = COL();
    fs.forEach((f, i) => { const st = wt(info, f.at, 0.3 + i * 0.7), k = spring(t, st - 0.05, { freq: 2.4, damp: 0.55 }); if (k <= 0) return; const x = E.W * (0.2 + i * (0.6 / Math.max(1, fs.length - 1))), y = E.H * 0.46, r = 150 * clamp(k, 0, 1.15);
      circle(g, x, y, r * 1.12, alpha('#f4efe6', 0.15)); g.save(); g.beginPath(); g.arc(x, y, r * 1.1, 0, 7); g.clip(); bigFace(g, x, y + r * 0.15, r * 0.85, { outfit: CAST[f.outfit] || CAST.man, expr: f.expr || 'smile', rimColor: '#ffd59a', rimSide: -1, blink: (t + i) % 3 > 2.9 }); g.restore(); ring(g, x, y, r * 1.1, 6, C.gold);
      tx(g, f.s, x, y + 230, 34, C.cream, { alpha: clamp(k), spacing: 2 }); });
  },
  // a basketball clanks off the rim: {at}
  rim(g, t, info) {
    BG(g, t, info, { set: 'gym', veil: 0.35, z: 2.2, y: -360 }); const C = COL(), x = E.W * 0.55, y = E.H * 0.45, hit = wt(info, info.at || 'rim', 0.9), ih = impact(t, hit, { amp: 14 });
    g.save(); g.translate(ih.x * 0.5, ih.y * 0.5); g.fillStyle = '#e8ecf4'; g.fillRect(x - 330, y - 420, 660, 400); g.strokeStyle = '#e04a3a'; g.lineWidth = 12; g.strokeRect(x - 140, y - 300, 280, 200);
    g.lineWidth = 18; g.strokeStyle = '#ff7a3a'; g.beginPath(); g.ellipse(x, y, 190, 40, 0, 0, Math.PI * 2); g.stroke(); for (let i = -5; i <= 5; i++) seg(g, [[x + i * 34, y + 10], [x + i * 22, y + 220]], 4, alpha('#ffffff', 0.6));
    let bx, by; if (t < hit) { const k = t / hit; bx = lerp(-200, x + 170, k); by = lerp(E.H * 0.9, y - 60, k) - Math.sin(k * Math.PI) * 400; } else { const q = t - hit; bx = x + 170 + q * 700; by = y - 60 - q * 600 + q * q * 1600; }
    circle(g, bx, by, 95, '#e0742a'); seg(g, [[bx - 95, by], [bx + 95, by]], 5, '#2a1410'); seg(g, [[bx, by - 95], [bx, by + 95]], 5, '#2a1410');
    if (t > hit) FX.rings(g, x + 170, y - 30, t - hit, { count: 2, r0: 30, r1: 240, color: '#fff3e0', a: 0.6 * (1 - prog(t, hit, hit + 0.8)) });
    if (info.label) kText(g, t, info.label, E.W * 0.22, E.H * 0.2, { start: hit + 0.1, mode: 'slam', size: 90, color: C.accent, glow: 20, font: FONTS.ui, weight: 900 }); g.restore();
  },
  // game leaderboard: your name climbs to the top: {to}
  rank(g, t, info) {
    BG(g, t, info, { set: 'bedroom', so: { laptopOn: true } }); const x = E.W * 0.2, y = E.H * 0.1, w = E.W * 0.6, h = E.H * 0.76, C = COL(); panel(g, x, y, w, h, { bg: '#0e1220', glow: '#8a5ad6' });
    tx(g, 'WORLD RANKING', x + w / 2, y + 60, 44, '#c8b8ff', { spacing: 6 }); const k = ease.inOut(prog(t, 0.3, info.dur - 0.6)), pos = Math.round(lerp(info.from ?? 48210, info.to ?? 3, Math.pow(k, 0.25)));
    ['#1  KAI_ZERO', '#2  N1GHTOWL', `#${pos}  MAX_R`, '#4  VEXA', '#5  ORBIT'].forEach((s, i) => { const me = i === 2, yy = y + 160 + i * 110; if (me) { rr(g, x + 30, yy - 44, w - 60, 88, 14); g.fillStyle = alpha(C.gold, 0.25); g.fill(); } tx(g, s, x + 80, yy, 50, me ? C.gold : '#b8c0d8', { align: 'left' }); });
  },
  // stream of digits typed out, with a counter: {to, at}
  digits(g, t, info) {
    g.fillStyle = '#07070c'; g.fillRect(0, 0, E.W, E.H); const C = COL(), st = wt(info, info.at, 0.2), n = Math.min(info.to ?? 400, Math.floor(Math.max(0, t - st) * (info.speed ?? 160))), r = rng(4);
    let s = ''; for (let i = 0; i < 400; i++) s += Math.floor(r() * 10); const per = 40;
    for (let row = 0; row < 10; row++) { const part = s.slice(row * per, Math.min(n, row * per + per)); if (!part) break; tx(g, part, E.W * 0.08, E.H * (0.14 + row * 0.072), 40, alpha(C.cream, 0.85), { align: 'left', spacing: 9 }); }
    UI.readout(g, { label: 'DIGITS', value: String(n), x: E.W * 0.72, y: E.H * 0.88, color: C.gold });
  },
  // piano keys light up under two hands: {at}
  piano(g, t, info) {
    BG(g, t, info, { set: 'music' }); g.save(); zoomAt(g, push(t, info, 0.05)); const y = E.H * 0.5, kw = 76, n = 26, x0 = E.W / 2 - n * kw / 2, C = COL(), st = wt(info, info.at, 0.2);
    g.fillStyle = '#0e0a10'; g.fillRect(x0 - 40, y - 140, n * kw + 80, 140);
    for (let i = 0; i < n; i++) { const lit = t > st && Math.floor((t - st) * 9 + i * 7) % 5 === 0; rr(g, x0 + i * kw, y, kw - 4, 360, 6); g.fillStyle = lit ? '#fff3c0' : '#f2efe8'; g.fill(); if (lit) glow(g, x0 + i * kw + kw / 2, y + 300, 80, C.gold, 0.6); }
    for (let i = 0; i < n - 1; i++) if (![2, 6, 9, 13, 16, 20, 23].includes(i % 26)) { rr(g, x0 + i * kw + kw * 0.65, y, kw * 0.6, 220, 4); g.fillStyle = '#121016'; g.fill(); }
    if (t > st) { hand(g, E.W * 0.36 + Math.sin(t * 9) * 40, y + 120, 1.3, { side: -1 }); hand(g, E.W * 0.64 + Math.cos(t * 8) * 40, y + 120, 1.3, { side: 1 }); }
    g.restore();
  },
  // the city drawn on a wall: streets draw themselves, houses pop: {at}
  mural(g, t, info) {
    BG(g, t, info, { set: 'streetDusk', veil: 0.5 }); g.save(); zoomAt(g, push(t, info, 0.06)); const C = COL(), x0 = E.W * 0.08, y0 = E.H * 0.12, w = E.W * 0.84, h = E.H * 0.74;
    g.fillStyle = '#d8cfc0'; g.fillRect(x0, y0, w, h); for (let i = 0; i < 6; i++) { g.fillStyle = alpha('#000', 0.05); g.fillRect(x0, y0 + i * h / 6, w, 3); }
    const r = rng(6), k = ease.inOut(prog(t, wt(info, info.at, 0.1), info.dur - 0.3));
    for (let i = 0; i < 9; i++) { const yy = y0 + 40 + i * h / 9; seg(g, [[x0 + 20, yy], [x0 + 20 + (w - 40) * clamp(k * 1.6 - i * 0.05), yy + Math.sin(i) * 20]], 5, '#3a3446'); }
    for (let i = 0; i < 12; i++) { const xx = x0 + 30 + (w - 60) * (i / 11); seg(g, [[xx, y0 + 20], [xx + Math.sin(i) * 30, y0 + 20 + (h - 40) * clamp(k * 1.6 - i * 0.04)]], 4, '#3a3446'); }
    for (let i = 0; i < 70; i++) { const q = ease.outBack(prog(k, i / 90, i / 90 + 0.1)); if (q <= 0) continue; const xx = x0 + 40 + r() * (w - 80), yy = y0 + 40 + r() * (h - 80), s = (16 + r() * 22) * q; g.fillStyle = ['#c0392b', '#3a6ea5', '#d9a441', '#3a8a5a', '#6a4a8a'][i % 5]; g.fillRect(xx - s / 2, yy - s / 2, s, s * 0.8); poly(g, [[xx - s * 0.6, yy - s / 2], [xx, yy - s], [xx + s * 0.6, yy - s / 2]], '#3a3446'); }
    if (info.hl) { const q = ease.outBack(prog(t, wt(info, info.hl, 1), wt(info, info.hl, 1) + 0.4)); if (q > 0) { ring(g, x0 + w * 0.64, y0 + h * 0.42, 70 * q, 6, C.gold); glow(g, x0 + w * 0.64, y0 + h * 0.42, 140, C.gold, 0.4 * q); } }
    g.restore();
  },
  // Wi-Fi bars filling + a timer: {at}
  wifi(g, t, info) {
    BG(g, t, info, { set: 'library' }); const C = COL(), x = E.W / 2, y = E.H * 0.66, k = ease.out(prog(t, wt(info, info.at, 0.2), info.dur - 0.4));
    for (let i = 0; i < 4; i++) { const on = k * 4 > i + 0.5; g.strokeStyle = on ? C.good : alpha(C.cream, 0.25); g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, 90 + i * 110, -Math.PI * 0.75, -Math.PI * 0.25); g.stroke(); if (on) glow(g, x, y - 90 - i * 110, 120, C.good, 0.3); }
    circle(g, x, y, 34, k > 0.1 ? C.good : alpha(C.cream, 0.25)); UI.readout(g, { label: 'FIXED IN', value: `${Math.round(6 * k)}:00`, x: E.W * 0.08, y: E.H * 0.86, color: C.gold });
  },
  // the fridge opens: empty shelves, cold light
  fridge(g, t, info) {
    BG(g, t, info, { set: 'kitchenNight' }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.36, y = E.H * 0.06, w = E.W * 0.36, h = E.H * 0.92, k = ease.out(prog(t, 0, 0.6));
    rr(g, x - 40, y - 40, w + 80, h + 120, 30); g.fillStyle = '#9aa0aa'; g.fill(); g.fillStyle = '#e8f4ff'; g.fillRect(x, y, w, h); for (let i = 0; i < 3; i++) { rr(g, x + w * 0.1 + i * w * 0.28, y + h * 0.82, w * 0.22, h * 0.14, 10); g.fillStyle = alpha('#c8dcef', 0.9); g.fill(); } glow(g, x + w / 2, y + h * 0.3, w, '#dff2ff', 0.5); for (let i = 1; i < 5; i++) { g.fillStyle = alpha('#a8c0d8', 0.8); g.fillRect(x, y + i * h / 5, w, 8); }
    if (info.crumb) circle(g, x + w * 0.7, y + h * 0.6 - 8, 6, '#c98a4a'); g.save(); g.translate(x + w, y); g.scale(1 - k * 0.85, 1); g.fillStyle = '#c8ccd4'; g.fillRect(0, 0, w, h); g.restore();
    if (info.label) kText(g, t, info.label, E.W * 0.84, E.H * 0.4, { start: wt(info, info.at || 'Empty', 0.4), mode: 'slam', size: 96, color: COL().accent, glow: 22, font: FONTS.ui, weight: 900 }); g.restore();
  },
  // bowls of rice stacking up: {n, at}
  rice(g, t, info) {
    BG(g, t, info, { set: 'kitchenEve' }); const n = info.n || 5, C = COL();
    for (let i = 0; i < n; i++) { const k = spring(t, wt(info, info.at, 0.1) + i * 0.18); if (k <= 0) continue; const x = E.W * 0.5, y = E.H * 0.86 - i * 120 - (1 - clamp(k)) * 80;
      g.fillStyle = '#e8ecf4'; g.beginPath(); g.ellipse(x, y - 90, 180, 40, 0, 0, 7); g.fill(); g.fillStyle = '#3a6ea5'; g.beginPath(); g.moveTo(x - 200, y - 90); g.quadraticCurveTo(x, y + 60, x + 200, y - 90); g.closePath(); g.fill(); g.fillStyle = alpha('#fff', 0.3); g.fillRect(x - 160, y - 70, 320, 6); }
    kText(g, t, `${n} BOWLS`, E.W * 0.8, E.H * 0.3, { start: wt(info, info.at, 0.1) + n * 0.18, mode: 'slam', size: 90, color: C.gold, glow: 20, font: FONTS.ui, weight: 900 });
  },
  // newspaper / framed headline: {s, sub, frame}
  headline(g, t, info) {
    BG(g, t, info, { set: info.set || 'kitchen' }); g.save(); zoomAt(g, push(t, info, 0.07)); const k = spring(t, 0.05, { freq: 2, damp: 0.6 }); g.translate(E.W / 2, E.H / 2); g.rotate(-0.05 + (1 - clamp(k)) * 0.6); g.scale(clamp(k, 0.2, 1.1), clamp(k, 0.2, 1.1));
    if (info.frame) { rr(g, -560, -420, 1120, 840, 10); g.fillStyle = '#6a4a2a'; g.fill(); rr(g, -520, -380, 1040, 760, 4); g.fillStyle = '#d9a441'; g.fill(); }
    g.fillStyle = '#efe8da'; g.fillRect(-500, -360, 1000, 720); tx(g, 'THE DAILY CITY', 0, -300, 40, '#2a2a34', { spacing: 8 }); seg(g, [[-460, -260], [460, -260]], 4, '#2a2a34');
    tx(g, info.s || 'TEEN GENIUS BREAKS MATH', 0, -170, 78, '#1a1a22'); g.fillStyle = '#5a5a66'; g.fillRect(-460, -100, 420, 300); drawFigure(g, { x: -250, y: 190, s: 1.0, outfit: MAX, pose: POSES.shrug, expr: 'smile', rim: { color: '#fff', dir: [0, -1] } });
    for (let i = 0; i < 9; i++) seg(g, [[0, -90 + i * 34], [440, -90 + i * 34]], 7, alpha('#8a8a9a', 0.5)); g.restore();
  },
  // brain scan monitor: {hot, spot, label, sugar}
  scan(g, t, info) {
    BG(g, t, info, { set: 'clinic' }); const x = E.W * 0.2, y = E.H * 0.1, w = E.W * 0.6, h = E.H * 0.74, C = COL(); panel(g, x, y, w, h, { bg: '#060a12', glow: '#5ff2e8' }); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const k = info.hotK ? key(t, info.hotK.map(([a, v]) => [wt(info, a, 0), v])) : info.hot ?? 0.7; scanHead(g, x + w / 2, y + h / 2, h * 0.38, t, { hot: k, dark: true, spot: info.spot, seed: 3 });
    if (info.sweep !== false) { const sy = y + ((t * 0.4) % 1) * h; g.fillStyle = alpha('#5ff2e8', 0.12); g.fillRect(x, sy, w, 12); } g.restore();
    if (info.label) kText(g, t, info.label, x + w / 2, y + h + 60, { start: wt(info, info.at, 0.4), mode: info.mode || 'rise', size: 60, color: C[info.color || 'gold'], glow: 16, font: FONTS.ui, weight: 900 });
    if (info.tap) { const tp = wt(info, info.tap, 0.6); if (t > tp) { hand(g, x + w * 0.62, y + h * 0.42, 1.0, { side: 1, point: true, sleeve: '#e8ecf0' }); FX.rings(g, x + w * 0.62 - 110, y + h * 0.42 - 30, t - tp, { count: 2, r0: 20, r1: 120, color: '#5ff2e8', a: 0.6 }); } }
  },
  // Mr. Black's spreadsheet: 41 rows, 6 red with HOSPITAL; note DO NOT TELL PARENTS
  table(g, t, info) {
    g.fillStyle = '#06070c'; g.fillRect(0, 0, E.W, E.H); const x = E.W * 0.1, y = E.H * 0.06, w = E.W * 0.8, h = E.H * 0.8, C = COL(); panel(g, x, y, w, h, { bg: '#f4f6f8', glow: '#cfe0ff', r: 14 }); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const scroll = (info.scroll ?? 0) * ease.inOut(prog(t, 0, info.dur)), rows = 41, rh = 44, red = [4, 9, 17, 23, 30, 36], redAt = wt(info, info.redAt || 'red', 0.8), hosAt = wt(info, info.hosAt || 'Hospital', 99);
    g.fillStyle = '#2a3a5a'; g.fillRect(x, y, w, 56); ['#', 'NAME', 'AGE', 'STATUS', 'NOTE'].forEach((s, i) => tx(g, s, x + 40 + [0, 80, 560, 740, 1060][i], y + 30, 26, '#e8eef8', { align: 'left' }));
    const r = rng(12); for (let i = 0; i < rows; i++) { const yy = y + 80 + i * rh - scroll * rh * 20; if (yy < y + 40 || yy > y + h + 40) { r(); r(); continue; } const isRed = red.includes(i) && t > redAt;
      if (isRed) { g.fillStyle = alpha('#e04a3a', 0.35); g.fillRect(x, yy - rh / 2, w, rh); } seg(g, [[x, yy + rh / 2], [x + w, yy + rh / 2]], 1, alpha('#8a8a9a', 0.4));
      tx(g, String(i + 1), x + 40, yy, 24, '#4a4a56', { align: 'left' }); g.fillStyle = alpha('#4a4a56', 0.5); g.fillRect(x + 120, yy - 8, 200 + r() * 200, 16); tx(g, String(13 + Math.floor(r() * 5)), x + 600, yy, 24, '#4a4a56', { align: 'left' });
      tx(g, isRed ? 'ADVERSE' : 'OK', x + 780, yy, 24, isRed ? '#b0201a' : '#3a8a5a', { align: 'left' }); if (isRed && t > hosAt) tx(g, 'HOSPITAL', x + 1100, yy, 26, '#b0201a', { align: 'left' }); }
    g.restore();
    UI.readout(g, { label: 'TRIAL', value: info.count || '41 NAMES', x: E.W * 0.06, y: E.H * 0.93, a: fadeIO(t, info.dur), size: 44 });
    if (info.note) { const k = spring(t, wt(info, info.noteAt || 'note', 0.6), { freq: 2.4, damp: 0.5 }); if (k > 0) { g.save(); g.translate(E.W * 0.7, E.H * 0.62); g.rotate(0.06); g.scale(clamp(k, 0, 1.2), clamp(k, 0, 1.2)); g.fillStyle = '#ffe680'; g.fillRect(-300, -120, 600, 240); tx(g, 'DO NOT', 0, -40, 66, '#b0201a'); tx(g, 'TELL PARENTS', 0, 40, 66, '#b0201a'); g.restore(); } }
  },
  // the bolt in the ceiling stretching; cable shaking: {at, stretch}
  bolt(g, t, info) {
    g.fillStyle = '#07050a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.5, E.H * 1.1, 900, '#ffd59a', 0.15); g.save(); zoomAt(g, push(t, info, 0.12));
    const tc = wt(info, info.at || 'click', 0.5), st = (info.stretch ?? 0.3) + 0.3 * ease.in(prog(t, tc, info.dur)), ih = impact(t, tc, { amp: 10 }); g.translate(ih.x, ih.y);
    g.fillStyle = '#1a1620'; g.fillRect(0, 0, E.W, E.H * 0.24); for (let x = 0; x < E.W; x += 120) seg(g, [[x, E.H * 0.24], [x + 60, 0]], 4, '#2a2630');
    const bx = E.W / 2, sh = info.shake ? Math.sin(t * 60) * 6 : 0; rr(g, bx - 90, E.H * 0.2, 180, 60, 10); g.fillStyle = '#5a5664'; g.fill();
    rr(g, bx - 26 + sh, E.H * 0.24, 52, 160 + st * 160, 6); g.fillStyle = '#9a96a4'; g.fill(); for (let i = 0; i < 8; i++) seg(g, [[bx - 26 + sh, E.H * 0.26 + i * (20 + st * 20)], [bx + 26 + sh, E.H * 0.28 + i * (20 + st * 20)]], 4, '#6a6674');
    glow(g, bx, E.H * 0.24 + 80 + st * 80, 160, '#ff4a3a', 0.25 * st); rr(g, bx - 70 + sh, E.H * 0.4 + st * 160, 140, 40, 8); g.fillStyle = '#3a3640'; g.fill();
    seg(g, [[bx + sh, E.H * 0.44 + st * 160], [bx + sh * 3, E.H + 40]], 16, '#b8b0a0');
    if (t > tc) { FX.sparkle(g, bx, E.H * 0.25, 60 * clamp(1 - (t - tc) * 2), '#fff6d0'); kText(g, t, 'CLICK', E.W * 0.75, E.H * 0.35, { start: tc, mode: 'slam', size: 110, color: COL().accent, glow: 22, font: FONTS.ui, weight: 900 }); }
    g.restore();
  },
  // a hand full of candy and sugar cubes: {at}
  cubes(g, t, info) {
    BG(g, t, info, { set: 'stage', so: { rigDrop: 1.2, spot: true } }); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W * 0.48, y = E.H * 0.6;
    hand(g, x + 60, y + 60, 2.4, { side: 1 }); const r = rng(3); for (let i = 0; i < 7; i++) { const k = spring(t, wt(info, info.at, 0.3) + i * 0.08); if (k <= 0) continue; const px = x - 120 + (i % 4) * 70 + r() * 20, py = y - 40 - Math.floor(i / 4) * 60 - (1 - clamp(k)) * 60;
      if (i % 3 === 2) { circle(g, px, py, 30, ['#d64a33', '#f2c21a', '#3fb950'][i % 3]); seg(g, [[px - 50, py], [px + 50, py]], 10, alpha('#f2efe8', 0.6)); } else { rr(g, px - 30, py - 30, 60, 60, 8); g.fillStyle = '#f6f4ee'; g.fill(); g.fillStyle = alpha('#c8c4bc', 0.6); g.fillRect(px - 30, py + 14, 60, 16); } }
    g.restore();
  },
  // broadcast camera with the red LIVE light
  live(g, t, info) {
    BG(g, t, info, { set: 'stage', so: { rigDrop: 1.2 } }); g.save(); zoomAt(g, push(t, info, 0.07)); const x = E.W * 0.44, y = E.H * 0.5, ink = '#121016';
    rr(g, x - 360, y - 170, 600, 300, 30); g.fillStyle = ink; g.fill(); rr(g, x + 240, y - 120, 220, 200, 20); g.fill(); circle(g, x + 470, y - 20, 120, ink); circle(g, x + 470, y - 20, 84, '#1e2a3a'); circle(g, x + 450, y - 40, 30, alpha('#9fd8ff', 0.5));
    seg(g, [[x - 60, y + 130], [x - 260, E.H + 40]], 22, ink); seg(g, [[x - 60, y + 130], [x + 140, E.H + 40]], 22, ink);
    if (t % 1 < 0.7) { circle(g, x - 280, y - 110, 26, '#ff3a2a'); glow(g, x - 280, y - 110, 140, '#ff3a2a', 0.7); } tx(g, 'LIVE', x - 190, y - 108, 50, '#ff5a4a', { align: 'left' }); g.restore();
  },
  // headbands dropping on the floor one by one: {at, n}
  bands(g, t, info) {
    BG(g, t, info, { set: 'hall', so: { phones: 0.3 }, veil: 0.55 }); g.fillStyle = alpha('#2a1a18', 0.9); g.fillRect(0, E.H * 0.72, E.W, E.H); const n = info.n || 12, st = wt(info, info.at, 0.2);
    for (let i = 0; i < n; i++) { const t0 = st + i * (info.gap ?? 0.28), q = t - t0; if (q < 0) continue; const x = E.W * (0.12 + ((i * 37) % 76) / 100), land = E.H * (0.78 + (i % 3) * 0.05), y = Math.min(land, E.H * 0.1 + 0.5 * 3000 * q * q);
      drawBand(g, x, y, 170, t, { dead: true, rot: (i % 5 - 2) * 0.25 }); if (y >= land && q < 0.9) FX.rings(g, x, land, q - Math.sqrt((land - E.H * 0.1) / 1500), { count: 1, r0: 20, r1: 110, color: '#fff3e0', a: 0.5 }); }
    if (info.label) kText(g, t, info.label, E.W / 2, E.H * 0.2, { start: wt(info, info.labelAt || 'Click', 0.6), mode: 'type', size: 90, color: COL().cream, glow: 18, font: FONTS.ui, weight: 900 });
  },
  // text message on a phone: {lines:[{s, at}], photo, date}
  sms(g, t, info) {
    BG(g, t, info, { set: info.set || 'clinic', veil: 0.6 }); const x = E.W * 0.34, y = E.H * 0.05, w = E.W * 0.32, h = E.H * 0.9, C = COL(); rr(g, x - 16, y - 16, w + 32, h + 32, 50); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#10141c'; g.fillRect(x, y, w, h);
    tx(g, 'UNKNOWN NUMBER', x + w / 2, y + 60, 30, '#8fa0b8', { spacing: 3 }); let yy = y + 150;
    (info.lines || []).forEach((ln, i) => { const k = spring(t, wt(info, ln.at, 0.3 + i * 0.7), { freq: 2.6, damp: 0.6 }); if (k <= 0) { yy += 140; return; } g.save(); g.globalAlpha = clamp(k); rr(g, x + 30, yy, w - 80, 110, 26); g.fillStyle = '#2a3446'; g.fill(); tx(g, ln.s, x + 60, yy + 55, ln.size || 38, '#e8eef8', { align: 'left' }); g.restore(); yy += 140; });
    if (info.photo) { const k = ease.out(prog(t, wt(info, info.photo, 1.5), wt(info, info.photo, 1.5) + 0.5)); if (k > 0) { g.save(); g.globalAlpha = k; rr(g, x + 30, yy, w - 80, 300, 20); g.fillStyle = '#1a1018'; g.fill(); glow(g, x + w / 2, yy + 150, 200, '#ffd59a', 0.3); drawBand(g, x + w / 2 - 20, yy + 170, 260, t, { hot: 0, rot: -0.1 }); g.restore(); } }
    if (info.date) kText(g, t, info.date, x + w / 2, y + h - 80, { start: wt(info, info.dateAt || 'date', 2), mode: 'slam', size: 60, color: C.accent, glow: 18, font: FONTS.ui, weight: 900 });
  },
  // knuckles knocking a window: two fast, one slow: {at, rail}
  knock(g, t, info) {
    BG(g, t, info, { set: info.set || 'bedroom' }); const C = COL(), st = wt(info, info.at, 0.2), hits = [0, 0.18, 0.75].map(d => st + d), x = E.W * 0.5, y = E.H * 0.5;
    if (!info.rail) { g.fillStyle = alpha('#9fb6d8', 0.12); g.fillRect(E.W * 0.15, E.H * 0.05, E.W * 0.7, E.H * 0.9); g.strokeStyle = '#1a1626'; g.lineWidth = 24; g.strokeRect(E.W * 0.15, E.H * 0.05, E.W * 0.7, E.H * 0.9); seg(g, [[E.W / 2, E.H * 0.05], [E.W / 2, E.H * 0.95]], 18, '#1a1626'); }
    else { seg(g, [[0, E.H * 0.62], [E.W, E.H * 0.62]], 26, '#c8d0da'); }
    let off = 60; hits.forEach(h => { const q = t - h; if (q > -0.12 && q < 0.12) off = Math.abs(q) / 0.12 * 60; });
    hand(g, x + 100 + off, y + (info.rail ? 30 : 0), 1.6, { side: 1, closed: true, sleeve: info.sleeve || '#34303f' });
    hits.forEach((h, i) => { if (t > h) { FX.rings(g, x - 20, y, t - h, { count: 1, r0: 30, r1: 200, color: '#fff3e0', a: 0.6 * (1 - prog(t, h, h + 0.7)) }); tx(g, i < 2 ? 'FAST' : 'SLOW', E.W * (0.3 + i * 0.2), E.H * 0.2, 54, i < 2 ? C.gold : C.cream, { alpha: clamp((t - h) * 4) * fadeIO(t, info.dur, 0.01, 0.3) }); } });
  },
  // earplugs pushed in: {n}
  earplugs(g, t, info) {
    BG(g, t, info, { set: 'kitchenEve' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.45, y = E.H * 0.5;
    bigFace(g, x - 260, y + 80, 420, { outfit: MAX, expr: 'worried', blink: false, rimColor: '#ffc68a', rimSide: 1, look: [1, 0] });
    for (let i = 0; i < (info.n || 1); i++) { const k = ease.out(prog(t, 0.3 + i * 0.6, 0.6 + i * 0.6)); rr(g, x + 140 + i * 40 + (1 - k) * 200, y - 20 + i * 70, 90, 50, 25); g.fillStyle = '#ff9a3a'; g.fill(); }
    if (info.n > 1) kText(g, t, 'x2', E.W * 0.8, E.H * 0.3, { start: 1.0, mode: 'slam', size: 120, color: C.accent, glow: 20, font: FONTS.ui, weight: 900 }); g.restore();
  },
});
