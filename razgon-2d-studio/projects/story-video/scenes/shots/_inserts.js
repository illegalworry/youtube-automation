// _inserts.js — insert / macro close-ups. Each draws a blurred location behind one big, simple object.
// INSERTS[obj](g, t, info) ; info carries the shot params (set, so, words via wt()).
import { E, V, S, mood, ease, prog, clamp, lerp, key, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, measure, rng, noise, FONTS } from '/engine/core.js';
import { spring, impact, smear, kText, drift } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import { bgBlur, wt, COL, fadeIO } from './_common.js';
import { icon } from './_actfx.js';
import { CAST, MAX } from '../cast.js';

const INK = () => S().ink;
const BG = (g, t, info, d = {}) => bgBlur(g, t, info.set || d.set || 'kitchen', info.so || d.so || {}, { z: d.z ?? 1.8, x: d.x ?? 0, y: d.y ?? -120, blur: 16, veil: d.veil ?? 0.42 });
const push = (t, info, a = 0.06) => 1 + a * ease.inOut(t / info.dur);
function zoomAt(g, s, cx = E.W / 2, cy = E.H / 2) { g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); }
// a big cartoon hand (sleeve from an edge). side: 1 = from right
function hand(g, x, y, s, o = {}) {
  const side = o.side ?? 1, ink = INK(), sleeve = o.sleeve || MAX.color, ex = side > 0 ? E.W + 400 : -400;
  seg(g, [[x + 40 * s * side, y + 20 * s], [ex, y + 260 * s]], 70 * s, ink); seg(g, [[x + 150 * s * side, y + 70 * s], [ex, y + 260 * s]], 96 * s, sleeve);
  if (o.closed) { circle(g, x, y, 46 * s, ink); for (let i = 0; i < 4; i++) circle(g, x - 34 * s * side + i * 4 * s * side, y - 30 * s + i * 20 * s, 15 * s, ink); }
  else { circle(g, x + 10 * s * side, y + 6 * s, 40 * s, ink); for (let i = 0; i < 4; i++) { const a = side > 0 ? -2.2 + i * 0.32 : -0.94 - i * 0.32; seg(g, [[x, y], [x + Math.cos(a) * 95 * s, y + Math.sin(a) * 95 * s]], 17 * s, ink); } }
}
function screenPanel(g, x, y, w, h, o = {}) { rr(g, x - 14, y - 14, w + 28, h + 28, 26); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = o.bg || '#141a26'; g.fillRect(x, y, w, h); glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, o.glow || '#9fd8ff', 0.18); }

export const INSERTS = {
  _missing(g, t, info) { BG(g, t, info); text(g, info.obj || '?', E.W / 2, E.H / 2, { size: 60, color: '#fff' }); },

  // digital alarm clock "7:15" with blinking colon
  digiclock(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.1));
    const x = E.W / 2, y = E.H / 2; rr(g, x - 380, y - 170, 760, 340, 60); g.fillStyle = '#121016'; g.fill(); g.fillStyle = '#0a0a0e'; g.fillRect(x - 320, y - 120, 640, 240);
    const [h, m] = (info.s || '7:15').split(':'), red = '#ff4a3a';
    kText(g, t, h, x - 120, y + 8, { start: 0, mode: 'slam', size: 190, color: red, glow: 30, glowColor: alpha(red, 0.7), font: FONTS.ui, weight: 900 });
    if (t % 1 < 0.55) { circle(g, x - 20, y - 36, 12, red); circle(g, x - 20, y + 46, 12, red); }
    kText(g, t, m, x + 120, y + 8, { start: wt(info, info.at2 ?? '15', 0.35), mode: 'slam', size: 190, color: red, glow: 30, glowColor: alpha(red, 0.7), font: FONTS.ui, weight: 900 });
    glow(g, x, y, 500, red, 0.18); g.restore();
  },
  // toaster pops: toast springs up
  toast(g, t, info) {
    BG(g, t, info); const tp = wt(info, info.at || 'pops', info.popFb ?? 0.4), ih = impact(t, tp, { amp: 10 }); g.save(); zoomAt(g, push(t, info, 0.08)); g.translate(ih.x, ih.y);
    const x = E.W / 2, y = E.H * 0.72, k = spring(t, tp, { freq: 3, damp: 0.35 });
    for (const dx of [-90, 90]) { g.save(); g.translate(x + dx, y - 230 - 150 * clamp(k, 0, 1.4)); g.rotate(dx * 0.0008 * k); rr(g, -70, -90, 140, 180, 34); g.fillStyle = '#c98a4a'; g.fill(); rr(g, -56, -76, 112, 152, 26); g.fillStyle = '#e8b878'; g.fill(); g.restore(); }
    rr(g, x - 300, y - 260, 600, 300, 70); g.fillStyle = '#b9b2bd'; g.fill(); g.fillStyle = alpha('#fff', 0.3); g.fillRect(x - 260, y - 240, 520, 14);
    g.fillStyle = '#1a1620'; rr(g, x - 170, y - 268, 160, 22, 8); g.fill(); rr(g, x + 10, y - 268, 160, 22, 8); g.fill(); rr(g, x + 300, y - 150, 30, 70, 10); g.fillStyle = '#2a2230'; g.fill();
    if (t > tp) { FX.rings(g, x, y - 300, t - tp, { count: 2, r0: 60, r1: 320, speed: 1.6, color: '#fff3e0', a: 0.5 * (1 - prog(t, tp, tp + 1)) }); for (let i = 0; i < 12; i++) { const a = -Math.PI * (0.15 + 0.7 * (i / 11)), d = (t - tp) * 500; circle(g, x + Math.cos(a) * d, y - 300 + Math.sin(a) * d + (t - tp) ** 2 * 400, 5, alpha('#e8b878', clamp(1 - (t - tp)))); } }
    g.restore();
  },
  // a shoe under the couch, behind a blue bag
  shoe(g, t, info) {
    BG(g, t, info, { set: 'kitchen', veil: 0.55 }); g.save(); zoomAt(g, push(t, info, 0.08), E.W * 0.55, E.H * 0.6);
    g.fillStyle = '#2a2034'; g.fillRect(-100, E.H * 0.18, E.W + 200, 160); for (let x = 0; x < E.W; x += 160) seg(g, [[x, E.H * 0.18 + 160], [x + 20, E.H * 0.18 + 220]], 18, '#1a1420');
    g.fillStyle = '#120d16'; g.fillRect(-100, E.H * 0.18 + 160, E.W + 200, E.H); glow(g, E.W * 0.6, E.H * 0.7, 500, '#ffd59a', 0.12);
    const k = ease.out(prog(t, wt(info, 'behind', 0.8), wt(info, 'behind', 0.8) + 0.6));
    rr(g, E.W * 0.36 + 200 * k, E.H * 0.48, 420, 300, 60); g.fillStyle = '#3a6ea5'; g.fill(); seg(g, [[E.W * 0.36 + 200 * k + 80, E.H * 0.48], [E.W * 0.36 + 200 * k + 210, E.H * 0.36], [E.W * 0.36 + 200 * k + 340, E.H * 0.48]], 16, '#2a5080');
    const sx = E.W * 0.38, sy = E.H * 0.74; poly(g, [[sx, sy], [sx + 280, sy], [sx + 300, sy - 60], [sx + 200, sy - 90], [sx + 120, sy - 150], [sx + 30, sy - 150], [sx, sy - 70]], '#f29ac0'); g.fillStyle = '#f2efe8'; g.fillRect(sx - 4, sy - 16, 310, 18);
    UI.callout(g, t, { at: [sx + 150, sy - 120], to: [sx + 420, sy - 380], str: 'LEFT SHOE', start: wt(info, 'Under', 0.2), color: COL().gold });
    g.restore();
  },
  // blackboard with a problem; answer slams: {lines, answer, at}
  board(g, t, info) {
    BG(g, t, info, { set: 'class' }); g.save(); zoomAt(g, push(t, info, 0.07));
    const x = E.W * 0.1, y = E.H * 0.14, w = E.W * 0.8, h = E.H * 0.66; rr(g, x - 20, y - 20, w + 40, h + 40, 12); g.fillStyle = '#3a2a22'; g.fill(); g.fillStyle = '#1e3a2a'; g.fillRect(x, y, w, h);
    const lines = info.lines || ['37 + 58 − 12 + 93', '× 4 − 17 ÷ 1 + 6', '− 29 + 11 = ?'];
    lines.forEach((ln, i) => { const k = info.answer ? 1 : clamp((t - 0.2 - i * 0.5) / 0.6); g.save(); g.beginPath(); g.rect(x, y, 80 + (w - 120) * k, h); g.clip(); text(g, ln, x + 70, y + 120 + i * 120, { size: 76, color: alpha('#f2f0e6', 0.9), font: FONTS.title, weight: 600, align: 'left' }); g.restore(); });
    if (info.answer) kText(g, t, info.answer, x + w * 0.72, y + h * 0.8, { start: wt(info, info.at, 1.2), mode: 'slam', size: 150, color: COL().gold, glow: 26 });
    g.restore();
  },
  // soup splash 1 cm from the shoe
  soup(g, t, info) {
    BG(g, t, info, { set: 'canteen', veil: 0.5 }); g.save(); zoomAt(g, push(t, info, 0.05));
    g.fillStyle = '#3a2a2e'; g.fillRect(-100, E.H * 0.66, E.W + 200, E.H); const tl = wt(info, 'misses', 0.4), k = ease.out(prog(t, tl, tl + 0.3));
    const sx = E.W * 0.32; poly(g, [[sx - 300, E.H * 0.7], [sx + 10, E.H * 0.7], [sx + 30, E.H * 0.62], [sx - 60, E.H * 0.56], [sx - 160, E.H * 0.48], [sx - 260, E.H * 0.48], [sx - 300, E.H * 0.6]], MAX.color);
    g.fillStyle = INK(); g.fillRect(sx - 304, E.H * 0.68, 340, 24);
    const px = sx + 90; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, r = (80 + (i % 4) * 30) * k; circle(g, px + 160 + Math.cos(a) * r * 1.6, E.H * 0.71 + Math.sin(a) * r * 0.3, 20 + (i % 3) * 10, '#e0a040'); }
    g.fillStyle = '#e0a040'; g.beginPath(); g.ellipse(px + 160, E.H * 0.71, 150 * k, 30 * k, 0, 0, 7); g.fill();
    UI.dimension(g, t, { x1: sx + 36, y1: E.H * 0.56, x2: px + 4, y2: E.H * 0.56, str: '1 cm', start: wt(info, 'centimeter', 1.2) - 0.4 });
    g.restore();
  },
  // tea steeping: cup + tea bag + slow timer
  tea(g, t, info) {
    BG(g, t, info, { set: 'kitchenEve' }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.42, y = E.H * 0.78;
    rr(g, x - 200, y - 320, 400, 320, 50); g.fillStyle = '#f2ece4'; g.fill(); ring(g, x + 230, y - 180, 70, 26, '#f2ece4');
    g.fillStyle = '#7a3a1a'; g.beginPath(); g.ellipse(x, y - 316, 186, 30, 0, 0, 7); g.fill(); const steep = clamp(t / info.dur); g.fillStyle = alpha('#3a1a0a', 0.3 + 0.5 * steep); g.beginPath(); g.ellipse(x, y - 316, 186, 30, 0, 0, 7); g.fill();
    seg(g, [[x + 40, y - 330], [x + 120, y - 560]], 3, '#e8e0d0'); rr(g, x + 100, y - 600, 50, 50, 6); g.fillStyle = '#e8d090'; g.fill();
    for (let i = 0; i < 6; i++) { const ph = (t * 0.25 + i / 6) % 1; circle(g, x - 80 + i * 30 + Math.sin(t + i) * 20, y - 360 - ph * 260, 26 + ph * 30, alpha('#ffffff', 0.12 * (1 - ph))); }
    UI.readout(g, { label: 'BREWING', value: `0:${String(Math.floor(2 + t * 0.3)).padStart(2, '0')}`, x: E.W * 0.66, y: E.H * 0.3, a: fadeIO(t, info.dur) }); g.restore();
  },
  // exam paper with ticks + clock 1 hour
  exam(g, t, info) {
    BG(g, t, info, { set: 'exam' }); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W * 0.22, y = E.H * 0.1;
    g.save(); g.translate(x, y); g.rotate(-0.04); g.fillStyle = '#f2ece0'; g.fillRect(0, 0, 760, 920); g.fillStyle = '#c0392b'; g.fillRect(0, 0, 760, 10);
    for (let i = 0; i < 8; i++) { const k = clamp((t * (info.fast ? 6 : 1.4) - i * 0.4)); seg(g, [[60, 110 + i * 100], [60 + 520 * Math.min(1, 0.4 + (i % 3) * 0.2), 110 + i * 100]], 10, alpha('#8a8a9a', 0.6)); if (k > 0 && info.ticks) { g.save(); g.globalAlpha = k; seg(g, [[640, 110 + i * 100], [660, 130 + i * 100], [700, 80 + i * 100]], 10, COL().good); g.restore(); } }
    g.restore(); FX.clock(g, E.W * 0.78, E.H * 0.34, 150, 3600 * 9 + t * 60, {}); UI.readout(g, { label: 'TIME', value: info.clockTxt || '1:00:00', x: E.W * 0.68, y: E.H * 0.62, a: fadeIO(t, info.dur) }); g.restore();
  },
  // hand writing at normal speed (pen inches along)
  pen(g, t, info) {
    BG(g, t, info, { set: 'exam' }); g.save(); zoomAt(g, push(t, info, 0.04)); g.fillStyle = '#f2ece0'; g.fillRect(-100, E.H * 0.35, E.W + 200, E.H);
    for (let i = 0; i < 4; i++) seg(g, [[E.W * 0.12, E.H * 0.48 + i * 110], [E.W * 0.88, E.H * 0.48 + i * 110]], 2, alpha('#9ab0d0', 0.5));
    const px = E.W * 0.14 + t * 70; g.strokeStyle = '#2a3a6a'; g.lineWidth = 6; g.beginPath(); for (let x = E.W * 0.14; x < px; x += 4) { const y = E.H * 0.47 - Math.abs(Math.sin(x * 0.07)) * 30; x === E.W * 0.14 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    g.save(); g.translate(px, E.H * 0.47); g.rotate(-0.7); rr(g, -12, -420, 24, 420, 10); g.fillStyle = '#3a6ea5'; g.fill(); poly(g, [[-12, 0], [12, 0], [0, 30]], '#e8d0a0'); g.restore();
    hand(g, px + 70, E.H * 0.5, 1.2, { side: 1, closed: true }); g.restore();
  },
  // chess board with move arrows: {n}
  chessboard(g, t, info) {
    BG(g, t, info, { set: 'chess' }); g.save(); zoomAt(g, push(t, info, 0.06)); const s = 92, x0 = E.W / 2 - 4 * s, y0 = E.H / 2 - 4 * s;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#5a3a2a' : '#e8d8b8'; g.fillRect(x0 + i * s, y0 + j * s, s, s); }
    const r = rng(7); for (let k = 0; k < 14; k++) { const i = Math.floor(r() * 8), j = Math.floor(r() * 8); const c = k % 2 ? '#f2efe8' : '#16131c'; circle(g, x0 + i * s + s / 2, y0 + j * s + s / 2 - 8, 22, c); poly(g, [[x0 + i * s + 20, y0 + j * s + s - 14], [x0 + i * s + s - 20, y0 + j * s + s - 14], [x0 + i * s + s / 2 + 12, y0 + j * s + s / 2], [x0 + i * s + s / 2 - 12, y0 + j * s + s / 2]], c); }
    const n = info.n || 5, r2 = rng(3); let px = x0 + s * 1.5, py = y0 + s * 6.5;
    for (let k = 0; k < n; k++) { const kk = ease.out(prog(t, 0.3 + k * (info.step ?? 0.3), 0.6 + k * (info.step ?? 0.3))); if (kk <= 0) break; const nx = x0 + (Math.floor(r2() * 8) + 0.5) * s, ny = y0 + (Math.floor(r2() * 8) + 0.5) * s;
      seg(g, [[px, py], [lerp(px, nx, kk), lerp(py, ny, kk)]], 9, alpha(COL().gold, 0.85)); if (kk >= 1) { circle(g, nx, ny, 16, COL().gold); text(g, String(k + 1), nx, ny, { size: 20, color: '#1a1622', font: FONTS.ui, weight: 900 }); } px = nx; py = ny; }
    g.restore();
  },
  // trembling handshake
  handshake(g, t, info) {
    BG(g, t, info, { set: 'chess' }); g.save(); zoomAt(g, push(t, info, 0.05)); const tr = Math.sin(t * 50) * 4;
    hand(g, E.W * 0.47, E.H * 0.52 + tr, 1.5, { side: -1, closed: true, sleeve: '#2a2836' }); hand(g, E.W * 0.53, E.H * 0.5, 1.5, { side: 1, closed: true });
    for (let i = 0; i < 3; i++) seg(g, [[E.W * 0.36 - i * 20, E.H * 0.38 + i * 30], [E.W * 0.33 - i * 20, E.H * 0.4 + i * 30]], 5, alpha('#fff', 0.5)); g.restore();
  },
  // book page + eye that jumps 3 times a second
  book(g, t, info) {
    BG(g, t, info, { set: 'library' }); g.save(); zoomAt(g, push(t, info, 0.05));
    for (const s of [-1, 1]) { g.save(); g.translate(E.W / 2, E.H * 0.55); g.scale(s, 1); poly(g, [[0, -340], [700, -380], [720, 360], [0, 400]], '#f2ece0'); for (let i = 0; i < 12; i++) seg(g, [[60, -280 + i * 55], [640, -300 + i * 55]], 9, alpha('#8a8a9a', 0.45)); g.restore(); }
    const jumps = Math.floor(t * 3), jx = E.W / 2 - 640 + (jumps % 8) * 170 * (info.fast ? 1 : 1), jy = E.H * 0.55 - 270 + Math.floor(jumps / 8) * 55;
    ring(g, jx, jy, 40, 6, COL().gold); glow(g, jx, jy, 90, COL().gold, 0.4);
    UI.readout(g, { label: 'EYE JUMPS', value: '3 / s', x: E.W * 0.08, y: E.H * 0.1, a: fadeIO(t, info.dur) }); g.restore();
  },
  // sports car stuck in traffic (side view row of boxy cars)
  traffic(g, t, info) {
    BG(g, t, info, { set: 'street' }); g.save(); zoomAt(g, push(t, info, 0.04)); const y = E.H * 0.78;
    for (let i = -2; i <= 3; i++) { const x = E.W / 2 + i * 420; if (i === 0) { rr(g, x - 190, y - 90, 380, 70, 30); g.fillStyle = '#d64a33'; g.fill(); poly(g, [[x - 100, y - 90], [x - 40, y - 140], [x + 80, y - 140], [x + 150, y - 90]], '#d64a33'); glow(g, x, y - 60, 300, '#ff6a4a', 0.15); } else { rr(g, x - 180, y - 160, 360, 140, 24); g.fillStyle = '#3a3448'; g.fill(); } circle(g, x - 110, y - 20, 34, '#0c0c12'); circle(g, x + 110, y - 20, 34, '#0c0c12'); circle(g, x - 190, y - 70, 10, '#ff3a2a'); }
    g.fillStyle = '#1a1622'; g.fillRect(-100, y + 10, E.W + 200, E.H); g.restore();
  },
  // napkin with bus routes and -11 MIN
  napkin(g, t, info) {
    BG(g, t, info, { set: 'lab' }); g.save(); zoomAt(g, push(t, info, 0.06)); g.save(); g.translate(E.W / 2, E.H / 2); g.rotate(0.05); g.fillStyle = '#f4f0ea'; g.fillRect(-420, -360, 840, 720); for (let i = 0; i < 6; i++) { g.fillStyle = alpha('#d8d0c4', 0.5); g.fillRect(-420, -360 + i * 120, 840, 3); } g.restore();
    const routes = [['#c0392b', [[-300, -200], [-100, -150], [60, -220], [300, -120]]], ['#3a6ea5', [[-320, 40], [-80, 80], [120, -20], [320, 60]]], ['#3a8a5a', [[-280, 240], [-20, 180], [180, 260], [300, 200]]]];
    routes.forEach(([c, pts], i) => { const k = ease.inOut(prog(t, 0.2 + i * 0.4, 1 + i * 0.4)); const P = pts.map(([a, b]) => [E.W / 2 + a, E.H / 2 + b]); const n = Math.max(2, Math.ceil(k * P.length)); seg(g, P.slice(0, n), 9, c); P.slice(0, n).forEach(p => circle(g, p[0], p[1], 12, c)); });
    if (info.big) kText(g, t, info.big, E.W / 2 + 280, E.H / 2 + 300, { start: wt(info, info.at, 1.6), mode: 'slam', size: 90, color: COL().good, glow: 20 }); g.restore();
  },
  // falling coffee cup caught by a hand
  coffee(g, t, info) {
    BG(g, t, info, { set: 'lab' }); const land = wt(info, 'catch', 0.9), d = ease.in(prog(t, 0, land)); const hx = E.W * 0.5, hy = E.H * 0.72, cy = lerp(E.H * 0.1, hy - 80, d);
    hand(g, hx, hy, 1.3, { side: -1 }); g.save(); g.translate(hx, cy); g.rotate(-0.6 * (1 - d)); rr(g, -60, -80, 120, 140, 18); g.fillStyle = '#f2ece4'; g.fill(); ring(g, 80, -10, 30, 12, '#f2ece4'); g.restore();
    for (let i = 0; i < 6; i++) if (t < land) circle(g, hx - 30 + i * 12, cy - 100 - i * 18, 8, '#6a3a22');
    if (t > land) FX.rings(g, hx, hy - 60, t - land, { count: 2, r0: 40, r1: 220, color: '#fff3e0', a: 0.5 * (1 - prog(t, land, land + 1)) });
  },
  // guitar fretboard: notes glow (brain) while fingers stay stuck
  guitar(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.05)); g.save(); g.translate(E.W / 2, E.H / 2); g.rotate(-0.12);
    g.fillStyle = '#4a2a1a'; g.fillRect(-900, -130, 1800, 260); for (let i = 0; i < 12; i++) g.fillRect(-900 + i * 150, -130, 6, 260), g.fillStyle = '#c9b8a0'; for (let s = 0; s < 6; s++) seg(g, [[-900, -110 + s * 44], [900, -110 + s * 44]], 2 + s * 0.6, '#d8d0c4');
    const r = rng(5); for (let i = 0; i < 14; i++) { const k = ease.outBack(prog(t, 0.2 + i * 0.08, 0.5 + i * 0.08)); const x = -820 + Math.floor(r() * 11) * 150 + 75, y = -110 + Math.floor(r() * 6) * 44; if (k > 0) { circle(g, x, y, 16 * k, COL().gold); glow(g, x, y, 50, COL().gold, 0.4 * k); } }
    g.restore(); hand(g, E.W * 0.36 + Math.sin(t * 2) * 10, E.H * 0.56, 1.2, { side: -1 }); g.restore();
  },
  // game monitor: 20 planned moves vs slow cursor
  game(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.16, y = E.H * 0.12, w = E.W * 0.68, h = E.H * 0.66; screenPanel(g, x, y, w, h, { bg: '#10202a' });
    const r = rng(11); let px = x + 100, py = y + h - 100; const n = 20, kk = ease.out(prog(t, 0.1, 1.2));
    for (let i = 0; i < n * kk; i++) { const nx = x + 80 + r() * (w - 160), ny = y + 60 + r() * (h - 120); g.setLineDash([8, 8]); seg(g, [[px, py], [nx, ny]], 3, alpha(COL().gold, 0.7)); g.setLineDash([]); circle(g, nx, ny, 8, COL().gold); px = nx; py = ny; }
    const cx = x + 100 + t * 40, cy = y + h - 100 - t * 20; poly(g, [[cx, cy], [cx + 30, cy + 34], [cx + 12, cy + 34], [cx + 4, cy + 50]], '#ffffff'); g.restore();
  },
  // boiling pot: 100 °C + 10:00 timer
  pot(g, t, info) {
    BG(g, t, info, { set: 'kitchenEve' }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.44, y = E.H * 0.8;
    g.fillStyle = '#1a1620'; g.fillRect(x - 380, y, 760, 60); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI; glow(g, x - 260 + i * 58, y + 10, 40, '#ff6a2a', 0.4 + 0.2 * Math.sin(t * 6 + i)); }
    rr(g, x - 320, y - 380, 640, 380, 40); g.fillStyle = '#5a6070'; g.fill(); g.fillStyle = alpha('#fff', 0.15); g.fillRect(x - 300, y - 360, 30, 340); seg(g, [[x - 380, y - 320], [x - 320, y - 320]], 22, '#2a2a34'); seg(g, [[x + 320, y - 320], [x + 380, y - 320]], 22, '#2a2a34');
    for (let i = 0; i < 10; i++) { const ph = (t * 0.7 + i / 10) % 1; circle(g, x - 240 + i * 52 + Math.sin(i * 3 + t) * 20, y - 400 - ph * 320, 30 + ph * 40, alpha('#ffffff', 0.12 * (1 - ph))); }
    UI.readout(g, { value: info.temp || '100 °C', x: E.W * 0.7, y: E.H * 0.3, a: fadeIO(t, info.dur) }); UI.readout(g, { label: 'PASTA', value: '10:00', x: E.W * 0.7, y: E.H * 0.42, color: COL().cream, a: fadeIO(t, info.dur) }); g.restore();
  },
  // waiting: REAL vs FELT bars with a label: {what, real, felt, rv, fv}
  wait(g, t, info) {
    BG(g, t, info, { set: info.set || 'street', veil: 0.6 }); const C = COL(), st = wt(info, info.at, 0.2);
    text(g, info.what || 'ELEVATOR', E.W / 2, E.H * 0.24, { size: 64, color: C.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.05, 0.3)) });
    [[info.la || 'REAL', info.real, info.rv ?? 0.1, C.blue], [info.lb || 'FELT', info.felt, info.fv ?? 1, C.accent]].forEach(([lab, val, v, col], i) => { const y = E.H * (0.45 + i * 0.2), k = ease.out(prog(t, st + i * (info.gap ?? 0.5), st + i * (info.gap ?? 0.5) + (i ? 1.4 : 0.4))), x0 = E.W * 0.3, w = E.W * 0.56;
      text(g, lab, x0 - 30, y, { size: 40, color: col, font: FONTS.ui, weight: 900, align: 'right' }); rr(g, x0, y - 26, w, 52, 26); g.fillStyle = alpha(col, 0.12); g.fill(); rr(g, x0, y - 26, Math.max(52, w * v * k), 52, 26); g.fillStyle = col; g.fill();
      text(g, val, x0 + Math.max(52, w * v * k) + 24, y + 2, { size: 52, color: col, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(k * 4) }); });
  },
  // petri dish + calendar 28 days
  petri(g, t, info) {
    BG(g, t, info, { set: 'lab' }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.32, y = E.H * 0.52;
    circle(g, x, y, 260, alpha('#cfe8ff', 0.25)); ring(g, x, y, 260, 8, alpha('#e8f4ff', 0.8)); const r = rng(2), n = Math.floor(10 + t * 6); for (let i = 0; i < n; i++) { const a = r() * 6.28, d = r() * 220; circle(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 6 + r() * 10, alpha('#9fd86a', 0.8)); }
    const cx = E.W * 0.7, cy = E.H * 0.5; rr(g, cx - 220, cy - 220, 440, 440, 20); g.fillStyle = '#f2ece0'; g.fill(); g.fillStyle = '#c0392b'; g.fillRect(cx - 220, cy - 220, 440, 80);
    const days = Math.min(28, Math.floor(1 + t * 8)); for (let i = 0; i < 28; i++) { const gx = cx - 190 + (i % 7) * 55, gy = cy - 110 + Math.floor(i / 7) * 70; text(g, String(i + 1), gx + 20, gy + 20, { size: 24, color: '#2a2236', font: FONTS.ui, weight: 900 }); if (i < days) seg(g, [[gx + 4, gy + 4], [gx + 36, gy + 36]], 5, alpha('#c0392b', 0.8)); }
    g.restore();
  },
  // heart-rate monitor 80 BPM
  pulse(g, t, info) {
    BG(g, t, info, { set: 'lab' }); const x = E.W * 0.18, y = E.H * 0.2, w = E.W * 0.64, h = E.H * 0.5; screenPanel(g, x, y, w, h, { bg: '#08140e', glow: '#5fd39a' });
    g.strokeStyle = '#5fd39a'; g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= 200; i++) { const u = i / 200, ph = (u * 4 + t * 1.33) % 1, v = ph < 0.08 ? Math.sin(ph / 0.08 * Math.PI) * -1 : ph < 0.12 ? 0.4 : 0; const px = x + u * w, py = y + h * 0.55 + v * h * 0.35; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
    text(g, String(info.bpm || 80), x + w - 60, y + 90, { size: 110, color: '#5fd39a', font: FONTS.ui, weight: 900, align: 'right', glow: 18, glowColor: alpha('#5fd39a', 0.6) }); text(g, 'BPM', x + w - 60, y + 160, { size: 34, color: '#5fd39a', font: FONTS.ui, weight: 900, align: 'right' });
  },
  // phone with the clip + view counter: {from, to, label}
  views(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); const x = E.W * 0.36, y = E.H * 0.06, w = E.W * 0.28, h = E.H * 0.88; g.save(); g.translate(0, (1 - ease.out(prog(t, 0, 0.4))) * 80);
    rr(g, x - 16, y - 16, w + 32, h + 32, 50); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#121822'; g.fillRect(x, y, w, h);
    g.fillStyle = '#2a2236'; g.fillRect(x, y + 60, w, w * 0.9); g.save(); g.beginPath(); g.rect(x, y + 60, w, w * 0.9); g.clip(); drawFigure(g, { x: x + w / 2, y: y + 60 + w * 0.85, s: 1.3, outfit: MAX, pose: POSES.cheer, expr: 'smirk', rim: { color: '#ffc68a', dir: [0, -1] } }); for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1; g.save(); g.translate(x + w / 2 + Math.sin(ph * 6.28) * 60, y + 120 + Math.abs(Math.cos(ph * 3.14)) * 60); g.rotate(t * 6 + i); rr(g, -24, -4, 48, 8, 3); g.fillStyle = ['#3a6ea5', '#c0392b', '#f2c21a'][i]; g.fill(); g.restore(); } g.restore();
    const k = ease.inOut(prog(t, 0.3, info.dur - 0.4)), v = Math.round(lerp(info.from ?? 0, info.to ?? 40000, k));
    text(g, v.toLocaleString('en-US') + ' views', x + 30, y + 60 + w * 0.9 + 70, { size: 46, color: COL().gold, font: FONTS.ui, weight: 900, align: 'left', glow: 12 });
    text(g, info.label || 'catching pens lol', x + 30, y + 60 + w * 0.9 + 130, { size: 30, color: alpha('#e8eef8', 0.8), font: FONTS.ui, weight: 800, align: 'left' });
    if (t % 1 < 0.6) circle(g, x + w - 40, y + 30, 10, '#ff3a2a'); g.restore();
  },
  // comments list: {lines:[...], dm}
  comments(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); const x = E.W * 0.26, w = E.W * 0.48, C = COL();
    (info.lines || []).forEach((ln, i) => { const st = wt(info, ln.at, 0.2 + i * 0.45), k = spring(t, st, { freq: 2.6, damp: 0.6 }); if (k <= 0) return; const y = E.H * 0.2 + i * 170 + (1 - clamp(k)) * 40;
      g.save(); g.globalAlpha = clamp(k); rr(g, x, y, w, 130, 24); g.fillStyle = ln.dark ? '#1a1218' : 'rgba(18,28,48,.94)'; g.fill(); if (ln.dark) { g.strokeStyle = alpha(C.accent, 0.7); g.lineWidth = 3; g.stroke(); }
      circle(g, x + 70, y + 65, 38, ln.dark ? '#2a2a30' : ['#3a6ea5', '#c0392b', '#3a8a5a', '#8a5ad6'][i % 4]); if (ln.dark) text(g, '?', x + 70, y + 66, { size: 40, color: '#6a6a74', font: FONTS.ui, weight: 900 });
      text(g, ln.s, x + 140, y + 66, { size: ln.size || 42, color: ln.dark ? C.cream : '#e8eef8', font: FONTS.ui, weight: 900, align: 'left' }); g.restore(); });
  },
  // someone watching the clip frame by frame (gray hand, notes)
  spy(g, t, info) {
    g.fillStyle = '#060508'; g.fillRect(0, 0, E.W, E.H); const x = E.W * 0.12, y = E.H * 0.1, w = E.W * 0.76, h = E.H * 0.6; screenPanel(g, x, y, w, h, { bg: '#0e1218', glow: '#cfe0ff' });
    for (let i = 0; i < 5; i++) { const fx = x + 40 + i * (w - 80) / 5, k = ease.out(prog(t, 0.2 + i * 0.35, 0.5 + i * 0.35)); g.save(); g.globalAlpha = k; g.fillStyle = '#1a2230'; g.fillRect(fx, y + 60, (w - 80) / 5 - 20, h - 160);
      drawFigure(g, { x: fx + ((w - 80) / 5 - 20) / 2, y: y + h - 140, s: 0.9, outfit: MAX, pose: [POSES.stand, POSES.reach, POSES.cheer, POSES.reach, POSES.point][i], expr: 'neutral', rim: { color: '#cfe0ff', dir: [0, -1] } }); text(g, `#${1204 + i}`, fx + 16, y + 84, { size: 22, color: '#8fa0b8', font: FONTS.ui, weight: 900, align: 'left' }); g.restore(); }
    ring(g, x + 40 + 2.5 * (w - 80) / 5, y + h * 0.45, 120, 5, alpha(COL().accent, 0.8 * ease.out(prog(t, 1.4, 1.8))));
    seg(g, [[E.W * 0.7, E.H + 40], [E.W * 0.66, E.H * 0.82]], 90, '#6c717c'); circle(g, E.W * 0.655, E.H * 0.8, 48, '#0c0a10');
    g.fillStyle = '#e8e0d0'; g.save(); g.translate(E.W * 0.28, E.H * 0.86); g.rotate(-0.08); g.fillRect(-160, -60, 320, 160); for (let i = 0; i < 3; i++) seg(g, [[-130, -30 + i * 34], [-130 + 260 * clamp(t / info.dur * 1.5 - i * 0.3), -30 + i * 34]], 4, '#3a3446'); g.restore();
  },
  // Mia's drawing: big head, tiny legs
  drawing(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.07)); g.translate(E.W / 2, E.H / 2); g.rotate(-0.03);
    g.fillStyle = '#efe6d2'; g.fillRect(-520, -400, 1040, 800); g.strokeStyle = '#d64a33'; g.lineWidth = 12; g.beginPath(); g.arc(0, -90, 230, 0, 7); g.stroke();
    circle(g, -70, -120, 18, '#2a2236'); circle(g, 70, -120, 18, '#2a2236'); g.strokeStyle = '#2a2236'; g.lineWidth = 8; g.beginPath(); g.arc(0, -60, 70, 0.3, Math.PI - 0.3); g.stroke();
    seg(g, [[0, 140], [0, 190]], 10, '#2a2236'); seg(g, [[0, 190], [-24, 240]], 8, '#2a2236'); seg(g, [[0, 190], [24, 240]], 8, '#2a2236');
    for (let i = 0; i < 4; i++) { g.strokeStyle = alpha('#f2c21a', 0.9); g.lineWidth = 6; g.beginPath(); g.arc(0, -90, 260 + i * 26, -2.6 + i * 0.1, -0.5 - i * 0.1); g.stroke(); }
    kText(g, t, 'MY BROTHER, THE BRAIN', 0, 320, { start: wt(info, 'brother', 0.4), mode: 'type', size: 58, color: '#8a3a5a', font: FONTS.title, weight: 700, spacing: 3 });
    if (info.legs) ring(g, 0, 210, 70, 6, alpha(COL().accent, ease.out(prog(t, wt(info, 'legs', 0.5), wt(info, 'legs', 0.5) + 0.3)))); g.restore();
  },
  // the contract; clauses highlight on words: {hl:[{s, at}]}
  contract(g, t, info) {
    BG(g, t, info, { set: info.set || 'kitchenEve' }); g.save(); zoomAt(g, push(t, info, 0.06)); g.translate(E.W / 2, E.H * 0.52 + (1 - ease.out(prog(t, 0, 0.5))) * 120); g.rotate(-0.04);
    g.fillStyle = '#f2ece0'; g.fillRect(-460, -440, 920, 900); text(g, 'HALDEN INSTITUTE', 0, -370, { size: 46, color: '#2a2a34', font: FONTS.ui, weight: 900, spacing: 6 }); text(g, 'RESEARCH AGREEMENT', 0, -320, { size: 26, color: '#6a6a74', font: FONTS.ui, weight: 900, spacing: 4 });
    for (let i = 0; i < 12; i++) seg(g, [[-380, -240 + i * 52], [-380 + 760 * (0.6 + ((i * 37) % 40) / 100), -240 + i * 52]], 8, alpha('#8a8a9a', 0.45));
    (info.hl || []).forEach((h, i) => { const k = ease.out(prog(t, wt(info, h.at, 0.4 + i), wt(info, h.at, 0.4 + i) + 0.4)); if (k <= 0) return; const y = -240 + (h.row ?? 3 + i * 4) * 52; g.fillStyle = alpha(COL().accent, 0.25); g.fillRect(-392, y - 22, 784 * k, 44); text(g, h.s, -370, y, { size: 30, color: '#8a1a1a', font: FONTS.ui, weight: 900, align: 'left', alpha: k }); });
    if (info.sign) seg(g, [[-200, 380], [200, 380]], 3, '#2a2a34'); g.restore();
  },
  // phone recording / playback: {mode:'rec'|'play'}
  phone(g, t, info) {
    BG(g, t, info, { set: info.set || 'kitchenEve' }); const x = E.W * 0.38, y = E.H * 0.1, w = E.W * 0.24, h = E.H * 0.8; rr(g, x - 14, y - 14, w + 28, h + 28, 46); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#121822'; g.fillRect(x, y, w, h);
    const rec = info.mode !== 'play'; text(g, rec ? 'REC' : '▶ PLAYING', x + w / 2, y + 90, { size: 44, color: rec ? '#ff4a3a' : COL().good, font: FONTS.ui, weight: 900 }); if (rec && t % 1 < 0.6) circle(g, x + w / 2 - 80, y + 90, 12, '#ff4a3a');
    g.strokeStyle = rec ? '#ff6a5a' : COL().good; g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 80; i++) { const u = i / 80, a = 0.2 + 0.8 * Math.abs(noise(u * 12 + t * 3, 2)); const px = x + 30 + u * (w - 60), py = y + h / 2 + Math.sin(u * 60 + t * 12) * a * 80; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
    text(g, `00:${String(Math.floor(t + (info.t0 ?? 3))).padStart(2, '0')}`, x + w / 2, y + h - 90, { size: 48, color: '#e8eef8', font: FONTS.ui, weight: 900 });
    hand(g, x + w * 0.2, y + h * 0.85, 1.1, { side: -1, closed: true });
  },
  // cable strands snapping one by one: {snaps:['Tink','Tink','Tink'], total, gone0}
  cable(g, t, info) {
    g.fillStyle = '#07050a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.5, E.H * 1.1, 900, '#ffd59a', 0.18); g.save(); zoomAt(g, push(t, info, 0.12));
    const n = info.total ?? 16, cx = E.W / 2, snaps = (info.snaps || []).map((w, i) => wt(info, w, 0.6 + i * 0.6)); const gone0 = info.gone0 ?? 0;
    let gone = gone0; snaps.forEach(s => { if (t >= s) gone++; });
    for (let i = 0; i < n; i++) { const x = cx - n * 9 + i * 18, broken = i < gone, sn = i >= gone0 && i < gone ? snaps[i - gone0] : -9, kk = clamp((t - sn) / 0.4);
      if (!broken) seg(g, [[x, -40], [x + 4, E.H + 40]], 8, '#b8b0a0'); else { seg(g, [[x, -40], [x + 30 * kk, E.H * 0.46 - 60 * kk]], 8, '#8a8270'); seg(g, [[x + 4, E.H + 40], [x - 30 * kk, E.H * 0.54 + 60 * kk]], 8, '#8a8270'); if (t - sn < 0.4 && t > sn) { FX.sparkle(g, x, E.H / 2, 60 * (1 - kk), '#fff6d0'); glow(g, x, E.H / 2, 160, '#fff3d0', 0.6 * (1 - kk)); } } }
    g.restore(); UI.readout(g, { label: 'STRANDS', value: `${n - gone} / ${n}`, x: E.W * 0.08, y: E.H * 0.86, color: n - gone < 10 ? COL().accent : COL().gold });
  },
  // laptop message: {lines:[{s, at}]}
  laptop(g, t, info) {
    g.fillStyle = '#06070c'; g.fillRect(0, 0, E.W, E.H); const x = E.W * 0.14, y = E.H * 0.08, w = E.W * 0.72, h = E.H * 0.72; screenPanel(g, x, y, w, h, { bg: '#0a1018', glow: '#5ff2e8' });
    poly(g, [[x - 60, y + h + 20], [x + w + 60, y + h + 20], [x + w + 140, E.H], [x - 140, E.H]], '#1a1a24');
    (info.lines || []).forEach((ln, i) => { const st = wt(info, ln.at, 0.2 + i * 0.5); const n = Math.floor(clamp((t - st) * 24 / ln.s.length) * ln.s.length); if (n <= 0) return; text(g, ln.s.slice(0, n) + (n < ln.s.length && t % 0.5 < 0.25 ? '▌' : ''), x + 90, y + 150 + i * 120, { size: ln.size || 70, color: ln.color === 'gold' ? COL().gold : '#5ff2e8', font: FONTS.ui, weight: 900, align: 'left', glow: 14, glowColor: 'rgba(95,242,232,.5)' }); });
  },
  // Nova in a glass room (photo loading)
  photo(g, t, info) {
    g.fillStyle = '#06070c'; g.fillRect(0, 0, E.W, E.H); const x = E.W * 0.22, y = E.H * 0.1, w = E.W * 0.56, h = E.H * 0.7, k = ease.out(prog(t, 0.1, 1.4)); screenPanel(g, x, y, w, h, { bg: '#0c1a22', glow: '#5ff2e8' });
    g.save(); g.beginPath(); g.rect(x, y, w, h * k); g.clip(); g.fillStyle = linG(g, y, h); g.fillRect(x, y, w, h);
    for (let i = 1; i < 4; i++) seg(g, [[x + w * i / 4, y], [x + w * i / 4, y + h]], 3, alpha('#cfe8ff', 0.3)); seg(g, [[x, y + h * 0.8], [x + w, y + h * 0.8]], 3, alpha('#cfe8ff', 0.3));
    FX.chair(g, x + w / 2, y + h * 0.8, 1.6, '#1a2a32'); drawFigure(g, { x: x + w / 2 + 10, y: y + h * 0.8, s: 1.5, outfit: CAST.nova, pose: POSES.sit, expr: 'sleepy', rim: { color: '#5ff2e8', dir: [0, -1] } });
    for (const s of [-1, 1]) seg(g, [[x + w / 2 + 14 + s * 30, y + h * 0.8 - 290], [x + w / 2 + s * 200, y], [x + w / 2 + s * 240, y - 10]], 3, '#5ff2e8'); g.restore();
    if (info.name) kText(g, t, 'NOVA', E.W / 2, E.H * 0.9, { start: wt(info, 'Nova', 1.5), mode: 'spread', size: 80, color: '#5ff2e8', glow: 26, glowColor: 'rgba(95,242,232,.7)', spacing: 18 });
    if (info.x100) kText(g, t, '100x', E.W * 0.86, E.H * 0.2, { start: wt(info, 'hundred', 0.5), mode: 'slam', size: 120, color: '#5ff2e8', glow: 30, glowColor: 'rgba(95,242,232,.7)', font: FONTS.ui, weight: 900 });
  },
  // the wall clock ticking slower and slower: {slow}
  wallclock(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.1)); const sp = info.slow ? Math.max(0.05, 1 - t * 0.3) : 1, x = E.W / 2, y = E.H / 2, r = 330;
    circle(g, x, y, r, '#f2efe8'); ring(g, x, y, r, 18, '#1a1622'); for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; seg(g, [[x + Math.cos(a) * r * (i % 5 ? 0.9 : 0.82), y + Math.sin(a) * r * (i % 5 ? 0.9 : 0.82)], [x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95]], i % 5 ? 3 : 8, '#1a1622'); }
    const secT = info.slow ? Math.floor((t * sp) * 1.2) : Math.floor(t), sa = secT / 60 * Math.PI * 2 - Math.PI / 2;
    seg(g, [[x, y], [x + Math.cos(-1.1) * r * 0.5, y + Math.sin(-1.1) * r * 0.5]], 16, '#1a1622'); seg(g, [[x, y], [x + Math.cos(0.35) * r * 0.72, y + Math.sin(0.35) * r * 0.72]], 10, '#1a1622'); seg(g, [[x, y], [x + Math.cos(sa) * r * 0.82, y + Math.sin(sa) * r * 0.82]], 4, '#e04a3a'); circle(g, x, y, 14, '#e04a3a'); g.restore();
  },
  // sandwich in a hand
  sandwich(g, t, info) { BG(g, t, info, { set: info.set || 'hall' }); g.save(); zoomAt(g, push(t, info, 0.05)); hand(g, E.W * 0.45, E.H * 0.62, 1.4, { side: 1, closed: true }); poly(g, [[E.W * 0.3, E.H * 0.56], [E.W * 0.52, E.H * 0.56], [E.W * 0.41, E.H * 0.36]], '#e8c890'); seg(g, [[E.W * 0.32, E.H * 0.55], [E.W * 0.5, E.H * 0.55]], 12, '#6fbf5a'); g.restore(); },
  // starter pistol fires
  starter(g, t, info) {
    BG(g, t, info, { set: 'track' }); const tf = wt(info, 'fires', 0.4), ih = impact(t, tf, { amp: 14 }); g.save(); g.translate(ih.x, ih.y); g.save(); g.translate(E.W * 0.55, E.H * 0.5); g.rotate(-0.5);
    rr(g, -220, -40, 300, 80, 16); g.fillStyle = '#1a1620'; g.fill(); rr(g, 30, 10, 70, 160, 20); g.fill(); g.restore(); hand(g, E.W * 0.6, E.H * 0.66, 1.2, { side: 1, closed: true, sleeve: '#2a2836' });
    if (t > tf) { glow(g, E.W * 0.38, E.H * 0.28, 300 * clamp(1 - (t - tf)), '#fff3d0', 0.9); FX.rings(g, E.W * 0.38, E.H * 0.28, t - tf, { count: 3, r0: 40, r1: 420, speed: 1.6, color: '#fff3e0', a: 0.6 * clamp(1 - (t - tf)) }); for (let i = 0; i < 6; i++) { const ph = ((t - tf) * 0.4 + i / 6) % 1; circle(g, E.W * 0.36 - ph * 200, E.H * 0.26 - ph * 300, 30 + ph * 60, alpha('#c9c0b0', 0.25 * (1 - ph))); } }
    g.restore();
  },
  // Lee's notes: bridge, cure, battery sketches
  notes(g, t, info) {
    BG(g, t, info, { set: 'library' }); g.save(); zoomAt(g, push(t, info, 0.05)); g.save(); g.translate(E.W / 2, E.H / 2); g.rotate(0.03); g.fillStyle = '#f2ece0'; g.fillRect(-760, -420, 1520, 840); for (let i = 0; i < 14; i++) seg(g, [[-720, -360 + i * 56], [720, -360 + i * 56]], 2, alpha('#9ab0d0', 0.4)); g.restore();
    ['bridge', 'cure', 'battery'].forEach((n, i) => { const k = ease.outBack(prog(t, wt(info, n === 'cure' ? 'cure' : n === 'bridge' ? 'bridge' : 'battery', 0.3 + i * 0.6), wt(info, n === 'cure' ? 'cure' : n === 'bridge' ? 'bridge' : 'battery', 0.3 + i * 0.6) + 0.4)); if (k > 0) icon(g, n, E.W * (0.27 + i * 0.23), E.H * 0.46, 260 * k, '#2a3a6a'); });
    if (info.week) kText(g, t, '1 WEEK = 1 DAY', E.W / 2, E.H * 0.82, { start: wt(info, 'week', 2), mode: 'rise', size: 70, color: '#8a1a1a', font: FONTS.ui, weight: 900 }); g.restore();
  },
  // hamster named Doctor
  hamster(g, t, info) { BG(g, t, info, { set: 'kitchenEve' }); g.save(); zoomAt(g, push(t, info, 0.07)); const x = E.W / 2, y = E.H * 0.6; g.fillStyle = '#d9a46a'; g.beginPath(); g.ellipse(x, y, 260, 190, 0, 0, 7); g.fill(); circle(g, x - 170, y - 150, 60, '#d9a46a'); circle(g, x + 170, y - 150, 60, '#d9a46a'); circle(g, x - 170, y - 150, 32, '#f29ac0'); circle(g, x + 170, y - 150, 32, '#f29ac0'); g.fillStyle = '#f2e0c8'; g.beginPath(); g.ellipse(x, y + 60, 150, 110, 0, 0, 7); g.fill(); circle(g, x - 80, y - 40, 22, '#1a1622'); circle(g, x + 80, y - 40, 22, '#1a1622'); circle(g, x, y + 10, 16, '#c06a7a');
    g.strokeStyle = '#2a3a6a'; g.lineWidth = 8; for (const s of [-1, 1]) { g.beginPath(); g.arc(x + s * 80, y - 40, 44, 0, 7); g.stroke(); } seg(g, [[x - 36, y - 40], [x + 36, y - 40]], 8, '#2a3a6a');
    kText(g, t, 'DOCTOR', x, E.H * 0.18, { start: wt(info, 'Doctor', 0.8), mode: 'drop', size: 110, color: COL().gold, glow: 24 }); g.restore(); },
};
function linG(g, y, h) { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#16303a'); gr.addColorStop(1, '#0a161c'); return gr; }
