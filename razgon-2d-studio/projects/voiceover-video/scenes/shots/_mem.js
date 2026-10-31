// _mem.js — inserts + blueprint diagrams for "What If You Had a Perfect Memory?". Merged into INSERTS / DIAGRAMS.
import { E, V, S, mood, ease, prog, clamp, lerp, key, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, measure, rng, noise, linGrad, FONTS } from '/engine/core.js';
import { spring, impact, smear, kText, drift } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import { bgBlur, wt, COL, fadeIO } from './_common.js';
import { INSERTS } from './_inserts.js';
import { DIAGRAMS } from './_bp.js';
import { icon } from './_actfx.js';
import { CAST, MAX } from '../cast.js';

const INK = () => S().ink;
const BG = (g, t, info, d = {}) => bgBlur(g, t, info.set || d.set || 'living', info.so || d.so || {}, { z: d.z ?? 1.8, x: d.x ?? 0, y: d.y ?? -120, blur: 16, veil: info.veil ?? d.veil ?? 0.45 });
const push = (t, info, a = 0.06) => 1 + a * ease.inOut(t / info.dur);
function zoomAt(g, s, cx = E.W / 2, cy = E.H / 2) { g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); }
const tx = (g, s, x, y, size, color, o = {}) => text(g, s, x, y, { size, color, font: FONTS.ui, weight: 900, ...o });
const C = () => COL();
const BP = () => UI.bpStroke();
const at = (info, w, fb) => wt(info, w, fb);
function hand(g, x, y, s, o = {}) {
  const side = o.side ?? 1, ink = INK(), sleeve = o.sleeve || MAX.color, ex = side > 0 ? E.W + 400 : -400;
  seg(g, [[x + 40 * s * side, y + 20 * s], [ex, y + 260 * s]], 70 * s, ink); seg(g, [[x + 150 * s * side, y + 70 * s], [ex, y + 260 * s]], 96 * s, sleeve);
  if (o.closed) { circle(g, x, y, 46 * s, ink); for (let i = 0; i < 4; i++) circle(g, x - 34 * s * side + i * 4 * s * side, y - 30 * s + i * 20 * s, 15 * s, ink); }
  else if (o.pen) { circle(g, x, y, 44 * s, ink); g.save(); g.translate(x - 30 * s * side, y + 10 * s); g.rotate(side * 0.5); rr(g, -8 * s, -10 * s, 16 * s, 150 * s, 6 * s); g.fillStyle = '#2a3a6a'; g.fill(); poly(g, [[-8 * s, 140 * s], [8 * s, 140 * s], [0, 170 * s]], '#d8d0c0'); g.restore(); }
  else { circle(g, x + 10 * s * side, y + 6 * s, 40 * s, ink); for (let i = 0; i < 4; i++) { const a = side > 0 ? -2.2 + i * 0.32 : -0.94 - i * 0.32; seg(g, [[x, y], [x + Math.cos(a) * 95 * s, y + Math.sin(a) * 95 * s]], 17 * s, ink); } }
}
function panel(g, x, y, w, h, o = {}) { rr(g, x - 14, y - 14, w + 28, h + 28, o.r ?? 26); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = o.bg || '#141a26'; g.fillRect(x, y, w, h); glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, o.glow || '#9fd8ff', 0.18); }
const lab = (g, t, info, s, x, y, w, o = {}) => { const st = at(info, w, o.fb ?? 0.3); const k = ease.out(prog(t, st - 0.05, st + 0.3)); if (k <= 0) return 0; text(g, s, x, y + (1 - k) * 20, { size: o.size || 44, color: o.color || C().cream, font: FONTS.ui, weight: 900, alpha: k * (o.a ?? 1), spacing: 2, align: o.align || 'center', glow: 10, glowColor: alpha(o.color || C().cream, 0.4) }); return k; };
const big = (g, t, info, s, x, y, w, o = {}) => kText(g, t, s, x, y, { start: at(info, w, o.fb ?? 0.3) - 0.08, mode: o.mode || 'slam', size: o.size || 110, color: o.color || C().gold, glow: 24, glowColor: alpha(o.color || C().gold, 0.6), font: FONTS.ui, weight: 900, out: info.dur - 0.3 });
function headOutline(g, x, y, r, c, lw = 6) { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); g.arc(x, y, r, Math.PI * 0.75, Math.PI * 2.25); g.lineTo(x + r * 0.95, y + r * 0.95); g.lineTo(x + r * 0.35, y + r * 0.95); g.lineTo(x + r * 0.35, y + r * 1.35); g.moveTo(x - r * 0.7, y + r * 0.7); g.lineTo(x - r * 0.55, y + r * 1.35); g.stroke(); }
function wave(g, x, y, w, h, t, c, seed = 1, lw = 4) { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); for (let i = 0; i <= 120; i++) { const u = i / 120, a = 0.2 + 0.8 * Math.abs(noise(u * 9 + seed * 3, 5)); const px = x + u * w, py = y + Math.sin(u * 90 + t * 10) * a * h; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }

// ------------------------------------------------------------------------------------------- INSERTS
Object.assign(INSERTS, {
  // a remembered moment as a glowing polaroid: {figs:[{c,x,pose,expr,f}], sky:'day'|'rain'|'night'|'dusk', caption, capAt, date, dateAt, extra:'dog'|'bike'|'stage'|'rain'|'cake', tag, tagAt, gray}
  memory(g, t, info) {
    BG(g, t, info, { veil: 0.6 }); const k = spring(t, 0.02, { freq: 2, damp: 0.6 }), w = 860, h = 620, cx = E.W / 2 + (info.dx ?? 0) * E.W, cy = E.H * 0.45;
    g.save(); g.translate(cx, cy); g.rotate((info.rot ?? -0.04) + (1 - clamp(k)) * 0.3); const sc = clamp(k, 0.3, 1.08) * push(t, info, 0.05); g.scale(sc, sc);
    glow(g, 0, 0, 640, info.gray ? '#9aa0aa' : C().gold, 0.22);
    g.fillStyle = '#f2ece0'; g.fillRect(-w / 2 - 30, -h / 2 - 30, w + 60, h + 150);
    g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip();
    const EX = [].concat(info.extra || []);
    const M = mood(info.sky === 'rain' ? 'storm' : info.sky === 'night' ? 'night' : info.sky === 'dusk' ? 'dusk' : info.sky === 'stage' ? 'interiorWarm' : 'day');
    g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, M.sky); g.fillRect(-w / 2, -h / 2, w, h);
    if (info.sky === 'stage') { g.fillStyle = '#1a1014'; g.fillRect(-w / 2, -h / 2, w, h); glow(g, 0, 0, 300, '#fff3d0', 0.5); FX.lightCone(g, 0, -h / 2, { len: h, spread: 0.5, color: '#fff3d0', a: 0.25 }); }
    else FX.skyline(g, { x: -w / 2 - 20, y: h * 0.22, w: w + 40, maxH: 200, color: shade(M.sky[M.sky.length - 1], -0.5), windowColor: alpha(M.practical, 0.5), seed: 5 });
    const GY = h * 0.38; g.fillStyle = shade(M.road || '#3a3040', -0.2); g.fillRect(-w / 2, GY, w, h);
    if (EX.includes('bus')) { g.fillStyle = '#2a3446'; g.fillRect(150, GY - 230, 14, 230); rr(g, 110, GY - 280, 100, 60, 8); g.fillStyle = '#3a6ea5'; g.fill(); tx(g, 'BUS', 160, GY - 250, 28, '#fff'); }
    if (EX.includes('bike')) { for (const bx of [-140, 20]) ring(g, bx, GY - 50, 50, 8, INK()); seg(g, [[-140, GY - 50], [-80, GY - 120], [20, GY - 50], [-60, GY - 50], [-80, GY - 120], [0, GY - 130]], 7, '#d64a33'); }
    (info.figs || []).forEach((f, i) => { const of = CAST[f.c] || CAST.man; drawFigure(g, { x: (f.x ?? 0) * w, y: GY + (f.y ?? 0), s: f.s ?? 1.75, facing: f.f ?? 1, outfit: of, pose: typeof f.pose === 'string' ? POSES[f.pose] || POSES.stand : POSES.stand, expr: f.expr || 'neutral', rim: { color: M.rim, dir: [0, -1], w: 4 }, blink: (t + i) % 3.3 > 3.2, rot: f.rot }); });
    if (EX.includes('dog')) { const dx = 120, dy = GY; g.fillStyle = '#5a3a2a'; g.beginPath(); g.ellipse(dx, dy - 50, 70, 34, 0, 0, 7); g.fill(); circle(g, dx + 70, dy - 90, 30, '#5a3a2a'); poly(g, [[dx + 58, dy - 112], [dx + 46, dy - 80], [dx + 70, dy - 100]], '#3a2418'); for (const lx of [-40, -15, 30, 50]) seg(g, [[dx + lx, dy - 30], [dx + lx, dy]], 9, '#5a3a2a'); seg(g, [[dx - 66, dy - 60], [dx - 100, dy - 90 + Math.sin(t * 12) * 10]], 8, '#5a3a2a'); circle(g, dx + 82, dy - 96, 4, '#fff'); }
    if (info.sky === 'rain' || EX.includes('rain')) { g.save(); g.translate(-w / 2, -h / 2); FX.rain(g, t, { count: 60, area: [0, 0, w, h] }); g.restore(); }
    if (info.gray) { g.globalCompositeOperation = 'saturation'; g.fillStyle = 'rgba(128,128,128,0.9)'; g.fillRect(-w / 2, -h / 2, w, h); g.globalCompositeOperation = 'source-over'; }
    g.fillStyle = alpha(info.gray ? '#000' : '#ffd9a0', 0.08); g.fillRect(-w / 2, -h / 2, w, h);
    g.restore();
    if (info.caption) kText(g, t, info.caption, 0, h / 2 + 60, { start: at(info, info.capAt, 0.4), mode: 'rise', size: Math.min(46, 46 * 26 / Math.max(26, info.caption.length)), color: '#2a2236', font: FONTS.ui, weight: 900, spacing: 2, out: 99 });
    g.restore();
    if (info.date) { const dk = ease.out(prog(t, at(info, info.dateAt, 0.6), at(info, info.dateAt, 0.6) + 0.3)); if (dk > 0) UI.readout(g, { label: info.dateLabel || 'SAVED', value: info.date, x: E.W * 0.05, y: E.H * 0.1, a: dk * fadeIO(t, info.dur, 0.01, 0.25), color: C().gold }); }
    if (info.tag) big(g, t, info, info.tag, E.W * 0.5, E.H * 0.1, info.tagAt, { size: 70, color: C()[info.tagColor || 'accent'], mode: 'slam' });
    if (!info.gray) { const ph = (t * 0.5) % 1; ring(g, E.W * 0.88, E.H * 0.12, 30, 4, alpha(C().gold, 0.8)); poly(g, [[E.W * 0.88 - 8, E.H * 0.12 - 14], [E.W * 0.88 + 14, E.H * 0.12], [E.W * 0.88 - 8, E.H * 0.12 + 14]], C().gold); FX.rings(g, E.W * 0.88, E.H * 0.12, t, { count: 1, r0: 30, r1: 70, color: C().gold, a: 0.4 * (1 - ph) }); }
  },
  // bus timetable on a stop pole: rows light up as Max recites them
  timetable(g, t, info) {
    BG(g, t, info, { set: 'streetDay', veil: 0.5 }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.3, y = E.H * 0.1, w = E.W * 0.4, h = E.H * 0.8;
    panel(g, x, y, w, h, { bg: '#f2f0e8', glow: '#ffe7b0', r: 12 }); g.fillStyle = '#3a6ea5'; g.fillRect(x, y, w, 90); tx(g, 'LINE 14  ·  TIMETABLE', x + w / 2, y + 46, 38, '#fff', { spacing: 3 });
    const stops = ['CENTRAL', 'MARKET ST', 'OLD BRIDGE', 'PARK GATE', 'MUSEUM', 'HARBOR', 'NORTH SQ', 'STATION', 'UNIVERSITY', 'HOSPITAL'];
    const st = at(info, info.at, 0.3), sp = info.speed ?? 4;
    stops.forEach((s, i) => { const yy = y + 140 + i * 66, on = (t - st) * sp > i; if (on) { g.fillStyle = alpha(C().gold, 0.35); g.fillRect(x + 10, yy - 28, w - 20, 56); }
      tx(g, s, x + 40, yy, 32, '#2a2a34', { align: 'left' }); tx(g, ['07:02', '07:09', '07:15', '07:21', '07:26', '07:34', '07:41', '07:48', '07:55', '08:03'][i] + '   ' + ['08:02', '08:09', '08:15', '08:21', '08:26', '08:34', '08:41', '08:48', '08:55', '09:03'][i], x + w - 40, yy, 30, '#4a4a56', { align: 'right' }); });
    g.restore();
  },
  // license plate, characters pop one by one: {s, at, gap}
  plate(g, t, info) {
    BG(g, t, info, { set: 'streetDay', veil: 0.5 }); g.save(); zoomAt(g, push(t, info, 0.08)); const s = info.s || 'KX7 4RM2', w = 1100, h = 280, x = E.W / 2, y = E.H * 0.5;
    rr(g, x - w / 2 - 40, y - h / 2 - 40, w + 80, h + 80, 30); g.fillStyle = '#3a2a2e'; g.fill(); rr(g, x - w / 2, y - h / 2, w, h, 26); g.fillStyle = '#f4efe2'; g.fill(); g.strokeStyle = '#1a1a22'; g.lineWidth = 10; g.stroke();
    const st = at(info, info.at, 0.2), gap = info.gap ?? 0.16, chars = s.split(''), cw = (w - 120) / chars.length;
    chars.forEach((ch, i) => { const k = spring(t, st + i * gap, { freq: 3, damp: 0.55 }); if (k <= 0 || ch === ' ') return; g.save(); g.translate(x - w / 2 + 60 + cw * (i + 0.5), y + 10); g.scale(clamp(k, 0, 1.3), clamp(k, 0, 1.3)); tx(g, ch, 0, 0, 190, '#1a1a22'); g.restore(); });
    g.restore(); const n = chars.filter(c => c !== ' ').length, done = st + gap * chars.length; if (t > done) { UI.readout(g, { label: 'CHARACTERS', value: String(n), x: E.W * 0.07, y: E.H * 0.86, a: ease.out(prog(t, done, done + 0.3)) * fadeIO(t, info.dur, 0.01, 0.25) }); }
  },
  // a shuffled deck: 52 cards flip into a grid at one glance: {at, label}
  cards(g, t, info) {
    BG(g, t, info, { set: 'clinic', veil: 0.55 }); const st = at(info, info.at, 0.3), sp = info.speed ?? 40, r = rng(3), suits = ['♠', '♥', '♦', '♣'], ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    for (let i = 0; i < 52; i++) { const col = i % 13, row = (i / 13) | 0, x = E.W * 0.12 + col * E.W * 0.06 + 4, y = E.H * 0.2 + row * E.H * 0.17, k = ease.out(clamp((t - st) * sp - i));
      const su = (r() * 4) | 0, rk = (r() * 13) | 0, fx = lerp(E.W / 2, x, k), fy = lerp(E.H * 0.9, y, k), flip = Math.abs(Math.cos(k * Math.PI));
      g.save(); g.translate(fx, fy); g.scale(Math.max(0.05, k >= 1 ? 1 : flip), 1); rr(g, -48, -68, 96, 136, 10); g.fillStyle = k >= 0.5 ? '#f6f2ea' : '#8a1a2a'; g.fill();
      if (k >= 0.5) { const c = su === 1 || su === 2 ? '#c0392b' : '#1a1a22'; tx(g, ranks[rk], 0, -18, 40, c); tx(g, suits[su], 0, 30, 40, c); } g.restore(); }
    if (info.label) big(g, t, info, info.label, E.W / 2, E.H * 0.1, info.labelAt, { size: 70 });
  },
  // three stolen codes: phone PIN, locker dial, laptop login: {at:[w1,w2,w3]}
  codes(g, t, info) {
    BG(g, t, info, { set: 'class', veil: 0.55 }); const items = [['JAKE · PHONE', '4 1 9 7'], ["MIA · LOCKER", '27-14-3'], ['DR. LEE · LAPTOP', 'neuro_88']], ats = info.at || [0.2, 1.2, 2.2];
    items.forEach(([l, v], i) => { const st = at(info, ats[i], 0.3 + i), k = spring(t, st, { freq: 2.6, damp: 0.55 }); if (k <= 0) return; const x = E.W * (0.2 + i * 0.3), y = E.H * 0.5;
      g.save(); g.translate(x, y); g.scale(clamp(k, 0, 1.15), clamp(k, 0, 1.15)); rr(g, -250, -170, 500, 340, 30); g.fillStyle = '#121822'; g.fill(); g.strokeStyle = alpha(C().gold, 0.6); g.lineWidth = 4; g.stroke();
      tx(g, l, 0, -110, 32, '#8fa0b8', { spacing: 2 }); const rv = clamp((t - st - 0.3) * 1.5); const shown = v.split('').map((ch, j) => (j / v.length < rv ? ch : '•')).join(''); tx(g, shown, 0, 20, 70, C().gold, { glow: 14 });
      // lock icon
      rr(g, -30, 90, 60, 50, 8); g.fillStyle = rv >= 1 ? C().accent : '#5a6a80'; g.fill(); g.strokeStyle = rv >= 1 ? C().accent : '#5a6a80'; g.lineWidth = 8; g.beginPath(); g.arc(0, 90, 22, Math.PI, rv >= 1 ? Math.PI * 1.7 : Math.PI * 2); g.stroke(); g.restore(); });
  },
  // phone chat thread: {head, lines:[{s, at, me}], stamp, stampAt}
  chat(g, t, info) {
    BG(g, t, info, { set: 'bedroom', veil: 0.6 }); const x = E.W * 0.34, y = E.H * 0.05, w = E.W * 0.32, h = E.H * 0.9; rr(g, x - 16, y - 16, w + 32, h + 32, 50); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#10141c'; g.fillRect(x, y, w, h);
    tx(g, info.head || 'MIA', x + w / 2, y + 60, 32, '#e8eef8', { spacing: 3 }); seg(g, [[x, y + 100], [x + w, y + 100]], 2, '#2a3446'); let yy = y + 150;
    (info.lines || []).forEach((ln, i) => { const k = spring(t, at(info, ln.at, 0.3 + i * 0.7), { freq: 2.6, damp: 0.6 }); if (k <= 0) { yy += 130; return; } const bw = Math.min(w - 80, measure(g, ln.s, 34) + 80);
      g.save(); g.globalAlpha = clamp(k); const bx = ln.me ? x + w - 30 - bw : x + 30; rr(g, bx, yy, bw, 100, 26); g.fillStyle = ln.me ? '#d64a33' : '#2a3446'; g.fill(); tx(g, ln.s, bx + bw / 2, yy + 50, 34, '#f4efe6'); if (ln.time) tx(g, ln.time, bx + bw / 2, yy + 120, 20, '#8fa0b8'); g.restore(); yy += 150; });
    if (info.stamp) { const k = spring(t, at(info, info.stampAt, 1.2), { freq: 3, damp: 0.5 }); if (k > 0) { g.save(); g.translate(x + w / 2, y + h * 0.78); g.rotate(-0.14); g.scale(clamp(2 - k, 0.9, 2), clamp(2 - k, 0.9, 2)); g.globalAlpha = clamp(k); rr(g, -230, -60, 460, 120, 16); g.strokeStyle = C().accent; g.lineWidth = 10; g.stroke(); tx(g, info.stamp, 0, 4, 56, C().accent); g.restore(); } }
  },
  // secret knock on a table (or the bank counter): hand taps two fast, one slow; meanings appear: {at, counter, means:true}
  tap(g, t, info) {
    BG(g, t, info, { set: info.counter ? 'bank' : 'leoKitchen', veil: 0.5 }); const st = at(info, info.at, 0.25), hits = [0, 0.2, 0.95].map(d => st + d * (info.slow ?? 1)), x = E.W * 0.5, y = E.H * 0.62;
    g.fillStyle = info.counter ? '#2a2e40' : '#5a3a2a'; g.fillRect(-50, y + 40, E.W + 100, E.H); g.fillStyle = alpha('#fff', 0.12); g.fillRect(-50, y + 40, E.W + 100, 8);
    if (!info.counter) for (let i = 0; i < 6; i++) seg(g, [[-50, y + 90 + i * 60], [E.W + 50, y + 100 + i * 60]], 2, alpha('#000', 0.25));
    let off = 90; hits.forEach(h => { const q = t - h; if (q > -0.12 && q < 0.12) off = Math.abs(q) / 0.12 * 90; });
    hand(g, x + 40, y - 30 - off + 90, 1.5, { side: 1, closed: true, sleeve: info.sleeve || '#3fb950' });
    const C_ = C(); hits.forEach((h, i) => { if (t > h) { FX.rings(g, x - 20, y + 40, t - h, { count: 1, r0: 30, r1: 220, color: '#fff3e0', a: 0.6 * (1 - prog(t, h, h + 0.7)) });
      tx(g, i < 2 ? 'TAP' : 'TAAAP', E.W * (0.25 + i * 0.16), E.H * 0.2, i < 2 ? 60 : 70, i < 2 ? C_.gold : C_.cream, { alpha: clamp((t - h) * 4) * fadeIO(t, info.dur, 0.01, 0.3), glow: 14 }); } });
    if (info.means) { lab(g, t, info, "= I'M HERE", E.W * 0.31, E.H * 0.31, info.means1 ?? 'here', { color: C_.gold, size: 46 }); lab(g, t, info, "= IT'S OKAY", E.W * 0.57, E.H * 0.31, info.means2 ?? 'okay', { color: C_.cream, size: 46 }); }
  },
  // a stack of burnt pancakes, counter to 412: {at, to}
  pancakes(g, t, info) {
    BG(g, t, info, { set: 'leoKitchen', veil: 0.45 }); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W * 0.36, y = E.H * 0.78;
    rr(g, x - 320, y - 10, 640, 40, 20); g.fillStyle = '#e8e2d6'; g.fill();
    const n = 9; for (let i = 0; i < n; i++) { const k = spring(t, 0.1 + i * 0.12, { freq: 2.8, damp: 0.6 }); if (k <= 0) continue; const yy = y - 20 - i * 46 - (1 - clamp(k)) * 200;
      g.fillStyle = i % 3 === 1 ? '#3a2014' : '#5a3218'; g.beginPath(); g.ellipse(x + Math.sin(i * 1.7) * 14, yy, 260, 40, 0, 0, 7); g.fill(); g.fillStyle = '#2a140c'; for (let j = 0; j < 5; j++) circle(g, x - 180 + j * 80 + Math.sin(i + j) * 20, yy - 6, 10, '#1e0e08'); }
    for (let i = 0; i < 6; i++) { const ph = (t * 0.5 + i / 6) % 1; circle(g, x - 120 + i * 50 + Math.sin(t + i) * 20, y - 470 - ph * 240, 20 + ph * 30, alpha('#3a3436', 0.3 * (1 - ph))); }
    g.restore(); const st = at(info, info.at, 0.5), k = ease.out(prog(t, st - 0.6, st + 0.2)), v = Math.round((info.to ?? 412) * k);
    if (k > 0) { const ih = impact(t, st + 0.2, { amp: 10 }); text(g, String(v), E.W * 0.74 + ih.x, E.H * 0.45 + ih.y, { size: 220, color: C().gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(C().gold, 0.6) }); tx(g, 'BURNT PANCAKES', E.W * 0.74, E.H * 0.62, 46, C().cream, { spacing: 4, alpha: clamp(k * 2) }); }
  },
  // words dissolving into dust (Leo forgetting): {items:[{s, at}], gold}
  fade(g, t, info) {
    BG(g, t, info, { set: 'leoKitchen', veil: 0.6 }); const items = info.items || [], r = rng(8);
    items.forEach((it, i) => { const st = at(info, it.at, 0.3 + i * 0.8), k = ease.out(prog(t, st - 0.05, st + 0.3)), d = ease.inOut(prog(t, st + 0.9, st + 2.2)); if (k <= 0) return;
      const x = E.W * (0.22 + i * 0.28), y = E.H * 0.48, col = mix(C().cream, '#6a6a76', d);
      text(g, it.s, x, y + (1 - k) * 30, { size: 72, color: col, font: FONTS.ui, weight: 900, alpha: k * (1 - d * 0.85), spacing: 4 });
      if (d > 0) for (let j = 0; j < 40; j++) { const px = x - 160 + r() * 320 + d * (40 + r() * 140), py = y - 30 + r() * 60 - d * (40 + r() * 160); circle(g, px, py, 3 + r() * 4, alpha('#c8c8d0', (1 - d) * 0.8)); } });
  },
  // the sticky note on the fridge: {lines:[{s, at}]}
  sticky(g, t, info) {
    BG(g, t, info, { set: 'kitchen', veil: 0.35 }); g.save(); zoomAt(g, push(t, info, 0.08)); g.fillStyle = '#d8dce2'; g.fillRect(E.W * 0.2, -40, E.W * 0.6, E.H + 80); g.fillStyle = alpha('#000', 0.15); g.fillRect(E.W * 0.2, E.H * 0.55, E.W * 0.6, 8);
    const x = E.W / 2, y = E.H * 0.47; g.save(); g.translate(x, y); g.rotate(0.04); g.fillStyle = alpha('#000', 0.25); g.fillRect(-300, -270, 620, 600); g.fillStyle = '#ffe680'; g.fillRect(-320, -300, 620, 600); g.fillStyle = '#f2d050'; g.fillRect(-320, -300, 620, 70);
    circle(g, -10, -290, 22, '#c0392b');
    (info.lines || []).forEach((ln, i) => { const st = at(info, ln.at, 0.3 + i * 0.6), k = clamp((t - st) / 0.5); if (k <= 0) return; g.save(); g.beginPath(); g.rect(-300, -200 + i * 150, 580 * k, 140); g.clip();
      text(g, ln.s, -10 + Math.sin(i * 3) * 10, -130 + i * 150, { size: 92, color: '#2a3a6a', font: FONTS.title, weight: 600, rot: Math.sin(i * 2.1) * 0.04 }); g.restore(); });
    g.restore(); g.restore();
  },
  // phone calling screen: {name, status, statusAt, rings}
  call(g, t, info) {
    BG(g, t, info, { set: info.set || 'kitchen', veil: 0.6 }); const x = E.W * 0.36, y = E.H * 0.06, w = E.W * 0.28, h = E.H * 0.88; rr(g, x - 16, y - 16, w + 32, h + 32, 50); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#121822'; g.fillRect(x, y, w, h);
    const cx = x + w / 2, cy = y + h * 0.33; circle(g, cx, cy, 110, '#2a3446'); if (info.face !== false) { g.save(); g.beginPath(); g.arc(cx, cy, 108, 0, 7); g.clip(); bigFace(g, cx, cy + 30, 80, { outfit: CAST[info.who] || CAST.leo, expr: 'smile', rimColor: '#ffd59a', rimSide: -1 }); g.restore(); }
    else tx(g, '?', cx, cy, 120, '#8fa0b8');
    FX.rings(g, cx, cy, t, { count: 3, r0: 110, r1: 220, color: info.ringC || '#7fd0d6', a: 0.35 });
    tx(g, info.name || 'GRANDPA LEO', cx, y + h * 0.56, 44, '#e8eef8', { spacing: 2 });
    const sAt = at(info, info.statusAt, 99), late = t > sAt; tx(g, late ? info.status || 'NO ANSWER' : (info.calling || 'calling…'), cx, y + h * 0.63, late ? 46 : 34, late ? C().accent : '#8fa0b8', { glow: late ? 14 : 0 });
    if (info.green) { circle(g, cx - 110, y + h * 0.85, 50, '#3fb950'); circle(g, cx + 110, y + h * 0.85, 50, '#e04a3a'); } else circle(g, cx, y + h * 0.85, 50, '#e04a3a');
    if (info.buzz) { const b = Math.sin(t * 60) * 4 * (t % 1 < 0.5 ? 1 : 0); g.translate(b, 0); }
  },
  // a form with a signature line; pen descends; {touchAt, stopAt, downAt}
  sign(g, t, info) {
    BG(g, t, info, { set: 'bank', veil: 0.4 }); g.save(); zoomAt(g, push(t, info, 0.08)); g.save(); g.translate(E.W * 0.44, E.H * 0.55); g.rotate(-0.06);
    g.fillStyle = '#f2ece0'; g.fillRect(-520, -460, 1040, 900); tx(g, 'TRANSFER AUTHORIZATION', 0, -400, 40, '#2a2a34', { spacing: 4 }); tx(g, 'TO: "SAFE ACCOUNT" #4471-0092', -470, -320, 30, '#c0392b', { align: 'left' });
    for (let i = 0; i < 6; i++) seg(g, [[-470, -240 + i * 60], [-470 + 900 * (0.5 + ((i * 37) % 40) / 100), -240 + i * 60]], 8, alpha('#8a8a9a', 0.45));
    tx(g, 'AMOUNT:  ALL SAVINGS', -470, 170, 34, '#2a2a34', { align: 'left' }); seg(g, [[-120, 330], [420, 330]], 4, '#2a2a34'); tx(g, 'SIGNATURE', 150, 370, 24, '#6a6a76');
    const touch = at(info, info.touchAt, 99), stop = at(info, info.stopAt, 99), down = at(info, info.downAt, 99);
    let px = -80 + Math.min(t, stop) * 0, py = lerp(-60, 300, ease.inOut(prog(t, 0, Math.min(touch, info.dur)))); if (t > touch) { const w = Math.min(t, stop) - touch; px = -80 + w * 200; py = 318 - Math.abs(Math.sin(w * 18)) * 20;
      g.strokeStyle = '#2a3a6a'; g.lineWidth = 5; g.beginPath(); for (let u = 0; u < w; u += 0.02) { const xx = -80 + u * 200, yy = 318 - Math.abs(Math.sin(u * 18)) * 20; u ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
    if (t > down) { const k = ease.inOut(prog(t, down, down + 0.8)); px = lerp(px, 520, k); py = lerp(py, 120, k); }
    g.restore(); const gx = E.W * 0.44 + px, gy = E.H * 0.55 + py; hand(g, gx + 60, gy - 180, 1.2, { side: 1, pen: true, sleeve: '#3fb950' });
    if (t > stop && t < down) { FX.rings(g, gx, gy, t - stop, { count: 2, r0: 30, r1: 140, color: '#cfe0ff', a: 0.5 }); }
    g.restore();
  },
  // TV news broadcast: Max at the front door, lower third, LIVE bug: {head, sub}
  tv(g, t, info) {
    g.fillStyle = '#08070c'; g.fillRect(0, 0, E.W, E.H); const x = E.W * 0.1, y = E.H * 0.08, w = E.W * 0.8, h = E.H * 0.78; rr(g, x - 30, y - 30, w + 60, h + 60, 30); g.fillStyle = '#16141c'; g.fill();
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); const M = mood('day'); g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h);
    FX.facade(g, { x: x + w * 0.2, y: y + h * 0.85, w: w * 0.6, h: h * 0.7, color: '#4a3a4a', win: M.practical, dark: '#2a2030', cols: 3, rows: 2, lit: 0.2, seed: 3, door: true });
    g.fillStyle = '#3a3040'; g.fillRect(x, y + h * 0.85, w, h); drawFigure(g, { x: x + w * 0.5, y: y + h * 0.88, s: 1.5, outfit: MAX, pose: POSES.shrug, expr: 'nervous', rim: { color: M.rim, dir: [0, -1] }, blink: t % 3 > 2.9 });
    seg(g, [[x + w * 0.66, y + h * 1.0], [x + w * 0.58, y + h * 0.66]], 18, '#2a2a36'); circle(g, x + w * 0.58, y + h * 0.64, 30, '#1a1a22');
    g.fillStyle = '#c0392b'; g.fillRect(x, y + h - 150, w * 0.72, 80); tx(g, info.head || 'TEEN WITH A PERFECT MEMORY', x + 30, y + h - 110, 42, '#fff', { align: 'left' }); g.fillStyle = '#16141c'; g.fillRect(x, y + h - 70, w * 0.72, 50); tx(g, info.sub || 'CITY NEWS · LIVE', x + 30, y + h - 45, 28, '#e8eef8', { align: 'left' });
    rr(g, x + w - 180, y + 30, 140, 56, 10); g.fillStyle = '#e04a3a'; g.fill(); tx(g, 'LIVE', x + w - 110, y + 58, 32, '#fff'); g.restore();
    for (let i = 0; i < E.H; i += 6) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x, i, w, 2); }
  },
});

// ------------------------------------------------------------------------------------------- DIAGRAMS (blueprint)
Object.assign(DIAGRAMS, {
  // working memory: 7 slots vs 7,000: {at1, at2}
  span(g, t, info) {
    const c = BP(), cc = C(); headOutline(g, E.W * 0.22, E.H * 0.45, 170, c); lab(g, t, info, 'MOST PEOPLE', E.W * 0.22, E.H * 0.16, 0.1, { size: 44 });
    for (let i = 0; i < 7; i++) { const k = ease.outBack(prog(t, at(info, info.at1, 0.3) + i * 0.08, at(info, info.at1, 0.3) + i * 0.08 + 0.3)); rr(g, E.W * 0.22 - 140 + (i % 4) * 72, E.H * 0.38 + ((i / 4) | 0) * 80, 56 * k, 56 * k, 8); g.fillStyle = alpha(c, 0.8); g.fill(); }
    big(g, t, info, '7', E.W * 0.22, E.H * 0.82, info.at1, { size: 130, color: c });
    headOutline(g, E.W * 0.66, E.H * 0.45, 230, cc.gold); lab(g, t, info, 'YOU', E.W * 0.66, E.H * 0.1, info.at2, { size: 50, color: cc.gold });
    const st = at(info, info.at2, 1.5), k = ease.out(prog(t, st - 0.3, st + 0.8)), n = Math.floor(700 * k), r = rng(4);
    for (let i = 0; i < n; i++) { const a = r() * 6.28, d = Math.sqrt(r()); circle(g, E.W * 0.66 + Math.cos(a) * 190 * d, E.H * 0.42 + Math.sin(a) * 170 * d, 4, alpha(cc.gold, 0.85)); }
    big(g, t, info, '7,000', E.W * 0.66, E.H * 0.86, info.at2, { size: 130 });
  },
  // forgetting / fading curves: {kind:'forget'|'feel', at1, at2, at3}
  curve(g, t, info) {
    const c = BP(), cc = C(), x0 = E.W * 0.16, x1 = E.W * 0.86, y0 = E.H * 0.82, y1 = E.H * 0.2; seg(g, [[x0, y1 - 20], [x0, y0], [x1 + 20, y0]], 4, c);
    lab(g, t, info, 'MEMORY', x0 - 20, y1 - 50, 0.05, { size: 32, color: c, align: 'left' }); lab(g, t, info, info.kind === 'feel' ? 'TIME →' : 'DAYS →', x1, y0 + 50, 0.05, { size: 32, color: c, align: 'right' });
    const draw = (fn, col, w0, lw = 6) => { const st = at(info, w0, 0.3), k = ease.inOut(prog(t, st, st + 1.2)); if (k <= 0) return; g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); for (let i = 0; i <= 80 * k; i++) { const u = i / 80; const x = lerp(x0, x1, u), y = lerp(y0, y1, fn(u)); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); return k; };
    if (info.kind === 'feel') {
      draw(u => 0.92 * Math.exp(-u * 1.2), alpha(c, 0.9), info.at1); lab(g, t, info, 'GOOD FEELINGS', x1 - 10, lerp(y0, y1, 0.92 * Math.exp(-1.2)) - 34, info.at1, { size: 34, color: c, align: 'right', fb: 1.2 });
      draw(u => 0.92 * Math.exp(-u * 4), cc.accent, info.at2); lab(g, t, info, 'BAD FEELINGS', x0 + 330, lerp(y0, y1, 0.92 * Math.exp(-0.8 * 4)) + 40, info.at2, { size: 34, color: cc.accent, align: 'left', fb: 1.8 });
      if (info.at3) { draw(() => 0.95, cc.gold, info.at3, 9); lab(g, t, info, "YOURS DON'T", x1 - 10, y1 - 40, info.at3, { size: 46, color: cc.gold, align: 'right' }); }
    } else {
      draw(u => 0.1 + 0.85 * Math.exp(-u * 5), alpha(c, 0.9), info.at1); lab(g, t, info, 'NORMAL BRAIN', x1 - 10, y0 - 90, info.at1, { size: 38, color: c, align: 'right', fb: 1.2 });
      if (info.at2) { draw(() => 0.95, cc.gold, info.at2, 9); lab(g, t, info, 'YOU · 100%', x1 - 10, y1 - 40, info.at2, { size: 46, color: cc.gold, align: 'right' }); }
      if (info.label) big(g, t, info, info.label, E.W / 2, E.H * 0.5, info.labelAt, { size: 80, color: cc.cream, mode: 'rise' });
    }
  },
  // sounds, smells, feelings fly into the head and lock: {at1, at2, at3, lockAt}
  saved(g, t, info) {
    const c = BP(), cc = C(), hx = E.W * 0.5, hy = E.H * 0.46; headOutline(g, hx, hy, 210, c);
    [['SOUNDS', 'note', info.at1, -1], ['SMELLS', 'pancake', info.at2, 0], ['FEELINGS', 'gift', info.at3, 1]].forEach(([s, ic, w, side], i) => {
      const st = at(info, w, 0.4 + i * 0.6), k = ease.inOut(prog(t, st, st + 0.9)); if (t < st - 0.05) return; const sx = hx + side * 640, sy = E.H * 0.25 + Math.abs(side) * 120 + (side === 0 ? -80 : 0);
      const x = lerp(sx, hx + side * 60, k), y = lerp(sy, hy - 30 + i * 30, k); circle(g, x, y, 48, alpha('#f4efe6', 0.9)); icon(g, ic, x, y, 54, '#2a2236');
      text(g, s, sx, sy + 90, { size: 40, color: cc.cream, font: FONTS.ui, weight: 900, alpha: clamp((t - st) * 4) * (1 - k * 0.6) }); });
    if (info.lockAt) { const k = ease.outBack(prog(t, at(info, info.lockAt, 2.5), at(info, info.lockAt, 2.5) + 0.4)); if (k > 0) { glow(g, hx, hy, 300, cc.gold, 0.25 * k); big(g, t, info, 'SAVED FOREVER', hx, E.H * 0.88, info.lockAt, { size: 80 }); } }
  },
  // leaves vs forest: {at1, at2}
  forest(g, t, info) {
    const c = BP(), cc = C(), r = rng(6), st = at(info, info.at1, 0.3), k = ease.out(prog(t, st, st + 1.5));
    for (let i = 0; i < 220 * k; i++) { const x = E.W * 0.08 + r() * E.W * 0.84, y = E.H * 0.15 + r() * E.H * 0.6, a = r() * 6.28; g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = alpha(c, 0.75); g.lineWidth = 2.5; g.beginPath(); g.ellipse(0, 0, 18, 8, 0, 0, 7); g.stroke(); seg(g, [[-18, 0], [18, 0]], 1.5, alpha(c, 0.6)); g.restore(); }
    lab(g, t, info, 'EVERY LEAF', E.W * 0.5, E.H * 0.86, info.at1, { size: 56, color: cc.gold });
    const f = ease.inOut(prog(t, at(info, info.at2, 2), at(info, info.at2, 2) + 0.8)); if (f > 0) { g.fillStyle = alpha('#0b1a33', 0.75 * f); g.fillRect(0, 0, E.W, E.H); for (let i = 0; i < 9; i++) { const x = E.W * (0.15 + i * 0.09), h = 200 + (i * 53 % 120); poly(g, [[x - 70, E.H * 0.72], [x, E.H * 0.72 - h], [x + 70, E.H * 0.72]], alpha(c, 0.5 * f)); }
      lab(g, t, info, '…AND MISS THE FOREST', E.W * 0.5, E.H * 0.86, info.at2, { size: 56, color: cc.accent }); }
  },
  // memory is rebuilt every recall: pieces fly into a frame: {at1, at2, hurt}
  rebuild(g, t, info) {
    const c = BP(), cc = C(), x = E.W * 0.5, y = E.H * 0.46, w = 620, h = 420, r = rng(2), st = at(info, info.at1, 0.3);
    g.strokeStyle = alpha(c, 0.8); g.lineWidth = 4; g.setLineDash([12, 10]); g.strokeRect(x - w / 2, y - h / 2, w, h); g.setLineDash([]);
    for (let i = 0; i < 24; i++) { const col = i % 6, row = (i / 6) | 0, tx0 = x - w / 2 + col * w / 6, ty0 = y - h / 2 + row * h / 4, a = r() * 6.28, d = 500 + r() * 300, k = ease.inOut(prog(t, st + i * 0.04, st + 0.8 + i * 0.04));
      const px = lerp(x + Math.cos(a) * d, tx0, k), py = lerp(y + Math.sin(a) * d * 0.6, ty0, k); g.fillStyle = info.hurt && k >= 1 ? alpha(cc.accent, 0.35 + 0.1 * Math.sin(t * 6 + i)) : alpha(c, 0.25 + 0.2 * (i % 3) / 2); g.fillRect(px + 3, py + 3, w / 6 - 6, h / 4 - 6); }
    lab(g, t, info, 'RECALL', E.W * 0.16, E.H * 0.46, info.at1, { size: 50, color: cc.cream }); lab(g, t, info, '= REBUILD', E.W * 0.84, E.H * 0.46, info.at2, { size: 50, color: cc.gold });
    if (info.label) big(g, t, info, info.label, x, E.H * 0.88, info.labelAt, { size: 76, color: info.hurt ? cc.accent : cc.gold });
  },
  // three calls, one voice: waveforms with dates; MATCH: {at:[w1,w2,w3], matchAt}
  voices(g, t, info) {
    const cc = C(), rows = [['3 WEEKS AGO', 'WATER CO.'], ['11 DAYS AGO', 'INSURANCE'], ['TODAY', 'BANK SECURITY']], ats = info.at || [0.3, 1.3, 2.3];
    rows.forEach(([d, wh], i) => { const st = at(info, ats[i], 0.3 + i), k = ease.out(prog(t, st - 0.05, st + 0.4)); if (k <= 0) return; const y = E.H * (0.26 + i * 0.22);
      g.save(); g.globalAlpha = k; tx(g, d, E.W * 0.06, y - 30, 36, cc.cream, { align: 'left' }); tx(g, wh, E.W * 0.06, y + 22, 30, BP(), { align: 'left' }); wave(g, E.W * 0.32, y, E.W * 0.58 * k, 60, 0, i === 2 ? cc.accent : cc.gold, 7, 5); g.restore(); });
    const mk = spring(t, at(info, info.matchAt, 99), { freq: 3, damp: 0.5 }); if (mk > 0) { g.save(); g.translate(E.W * 0.62, E.H * 0.48); g.rotate(-0.12); g.scale(clamp(2 - mk, 0.9, 2), clamp(2 - mk, 0.9, 2)); g.globalAlpha = clamp(mk); rr(g, -260, -70, 520, 140, 18); g.strokeStyle = cc.accent; g.lineWidth = 12; g.stroke(); tx(g, 'SAME VOICE', 0, 4, 72, cc.accent); g.restore(); }
  },
  // 20 m, 5 m/s, 4 s vs 2 s: {at1 (20), at2 (five), at3 (four), at4 (slow), sigAt}
  distance(g, t, info) {
    const cc = C(), c = BP(), gy = E.H * 0.6, xa = E.W * 0.14, xb = E.W * 0.84; seg(g, [[E.W * 0.05, gy], [E.W * 0.95, gy]], 3, alpha(c, 0.6));
    const run = ease.inOut(prog(t, at(info, info.at3, 2), at(info, info.at3, 2) + 1.4)) * 0.45; UI.lineFigure(g, { x: lerp(xa, xb, run), y: gy, s: 1, pose: run > 0 && run < 0.45 ? POSES.ready : POSES.stand, color: cc.gold });
    UI.lineFigure(g, { x: xb, y: gy, s: 1, pose: POSES.sit, color: c, facing: -1 }); lab(g, t, info, 'MAX', xa, gy + 50, 0.1, { size: 32, color: cc.gold }); lab(g, t, info, 'LEO', xb, gy + 50, 0.1, { size: 32, color: c });
    UI.dimension(g, t, { x1: xa, y1: gy - 280, x2: xb, y2: gy - 280, str: '', color: cc.gold, start: at(info, info.at1, 0.3) }); big(g, t, info, '20 m', E.W / 2, gy - 340, info.at1, { size: 80 });
    lab(g, t, info, '5 m / s', E.W * 0.3, gy + 150, info.at2, { size: 60, color: cc.cream }); lab(g, t, info, '= 4 s', E.W * 0.5, gy + 150, info.at3, { size: 60, color: cc.accent });
    lab(g, t, info, 'SIGNATURE: 2 s', E.W * 0.76, gy + 150, info.sigAt, { size: 50, color: c }); if (info.at4) big(g, t, info, 'TOO SLOW', E.W / 2, E.H * 0.14, info.at4, { size: 110, color: cc.accent });
  },
  // Miller 1956: 7 ± 2: {at1, at2}
  miller(g, t, info) {
    const cc = C(), c = BP(); big(g, t, info, '1956', E.W * 0.22, E.H * 0.2, info.at1, { size: 120, color: c, mode: 'drop' }); lab(g, t, info, 'GEORGE MILLER', E.W * 0.22, E.H * 0.33, info.at1, { size: 40, color: cc.cream, fb: 0.6 });
    for (let i = 0; i < 9; i++) { const st = at(info, info.at2, 1.5) + i * 0.09, k = ease.outBack(prog(t, st, st + 0.3)), x = E.W * 0.47 + i * 100; if (k <= 0) continue; rr(g, x - 40 * k, E.H * 0.5 - 40 * k, 80 * k, 80 * k, 12); g.fillStyle = i < 7 ? alpha(cc.gold, 0.9) : alpha(c, 0.3); g.fill(); }
    big(g, t, info, '≈ 7 ITEMS', E.W * 0.66, E.H * 0.7, info.at2, { size: 90 }); if (info.realAt) big(g, t, info, 'REAL', E.W * 0.22, E.H * 0.66, info.realAt, { size: 100, color: cc.good });
  },
  // HSAM 2006: calendar of days lighting up: {at1, at2}
  hsam(g, t, info) {
    const cc = C(), c = BP(); big(g, t, info, '2006', E.W * 0.2, E.H * 0.24, info.at1, { size: 120, color: c, mode: 'drop' }); lab(g, t, info, 'HSAM', E.W * 0.2, E.H * 0.38, info.at1, { size: 60, color: cc.gold, fb: 0.6 }); lab(g, t, info, 'A RARE FEW', E.W * 0.2, E.H * 0.48, 0.2, { size: 36, color: cc.cream });
    const st = at(info, info.at2, 1.0); for (let i = 0; i < 84; i++) { const x = E.W * 0.42 + (i % 12) * 86, y = E.H * 0.18 + ((i / 12) | 0) * 86, on = (t - st) * 40 > i; rr(g, x, y, 72, 72, 8); g.strokeStyle = alpha(c, 0.5); g.lineWidth = 2; g.stroke(); if (on) { g.fillStyle = alpha(cc.gold, 0.55); g.fill(); } tx(g, String((i % 31) + 1), x + 36, y + 38, 24, on ? '#1a1a22' : alpha(c, 0.6)); }
    if (info.label) lab(g, t, info, info.label, E.W * 0.5, E.H * 0.92, info.at2, { size: 40, color: cc.cream, fb: 1.5 });
  },
  // 2013: confident false memory: {at1, at2}
  falsemem(g, t, info) {
    const cc = C(), c = BP(); big(g, t, info, '2013', E.W * 0.2, E.H * 0.22, info.at1, { size: 120, color: c, mode: 'drop' }); lab(g, t, info, 'STUDY', E.W * 0.2, E.H * 0.35, info.at1, { size: 44, color: cc.cream, fb: 0.6 });
    const x = E.W * 0.62, y = E.H * 0.46; rr(g, x - 300, y - 220, 600, 440, 20); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); UI.lineFigure(g, { x: x - 120, y: y + 150, s: 1.1, pose: POSES.point, color: cc.cream }); circle(g, x + 140, y - 40, 70, alpha(cc.gold, 0.25)); ring(g, x + 140, y - 40, 70, 5, cc.gold); tx(g, '?', x + 140, y - 36, 80, cc.gold);
    const k = ease.out(prog(t, at(info, info.at2, 1.5), at(info, info.at2, 1.5) + 0.3)); if (k > 0) { seg(g, [[x + 60, y - 120], [x + 60 + 160 * k, y + 40]], 14, cc.accent); seg(g, [[x + 220, y - 120], [x + 220 - 160 * k, y + 40]], 14, cc.accent); big(g, t, info, 'FALSE MEMORY', x, E.H * 0.88, info.at2, { size: 80, color: cc.accent }); }
  },
  // Borges 1942: a man buried in details: {at1, at2}
  borges(g, t, info) {
    const cc = C(), c = BP(), r = rng(11); big(g, t, info, '1942', E.W * 0.2, E.H * 0.2, info.at1, { size: 120, color: c, mode: 'drop' }); lab(g, t, info, 'BORGES', E.W * 0.2, E.H * 0.33, info.at1, { size: 50, color: cc.cream, fb: 0.6 }); lab(g, t, info, '"FUNES THE MEMORIOUS"', E.W * 0.2, E.H * 0.42, info.at1, { size: 30, color: c, fb: 0.9 });
    const x = E.W * 0.64, y = E.H * 0.7, k = ease.in(prog(t, 0.5, info.dur)); UI.lineFigure(g, { x, y, s: 1.3, pose: POSES.handsOnHead, color: cc.gold });
    for (let i = 0; i < 400 * (0.2 + k); i++) { const a = r() * 6.28, d = 120 + r() * 420 * (1 - k * 0.4); const px = x + Math.cos(a) * d, py = y - 200 + Math.sin(a) * d * 0.7; if (r() < 0.5) circle(g, px, py, 3, alpha(c, 0.7)); else seg(g, [[px, py], [px + 12, py]], 2, alpha(cc.cream, 0.6)); }
    if (info.at2) big(g, t, info, "HE COULDN'T THINK", E.W / 2, E.H * 0.9, info.at2, { size: 80, color: cc.accent });
  },
});
