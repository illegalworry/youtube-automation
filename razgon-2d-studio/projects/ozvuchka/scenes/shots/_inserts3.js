// _inserts3.js — inserts for "What If You Could Win Every Argument?". Merged into INSERTS.
import { E, S, ease, prog, clamp, lerp, key, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, measure, rng, FONTS } from '/engine/core.js';
import { spring, impact, kText, drift } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import { bgBlur, wt, COL, fadeIO } from './_common.js';
import { INSERTS } from './_inserts.js';
import { CAST, MAX } from '../cast.js';

const INK = () => S().ink;
const BG = (g, t, info, d = {}) => bgBlur(g, t, info.set || d.set || 'kitchen', info.so || d.so || {}, { z: d.z ?? 1.8, x: d.x ?? 0, y: d.y ?? -120, blur: 16, veil: info.veil ?? d.veil ?? 0.45 });
const push = (t, info, a = 0.06) => 1 + a * ease.inOut(t / info.dur);
function zoomAt(g, s, cx = E.W / 2, cy = E.H / 2) { g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); }
const tx = (g, s, x, y, size, color, o = {}) => text(g, s, x, y, { size, color, font: FONTS.ui, weight: 900, ...o });
function hand(g, x, y, s, o = {}) {
  const side = o.side ?? 1, ink = INK(), sleeve = o.sleeve || MAX.color, ex = side > 0 ? E.W + 400 : -400;
  seg(g, [[x + 40 * s * side, y + 20 * s], [ex, y + 260 * s]], 70 * s, ink); seg(g, [[x + 150 * s * side, y + 70 * s], [ex, y + 260 * s]], 96 * s, sleeve);
  if (o.pen) { circle(g, x, y, 44 * s, ink); g.save(); g.translate(x - 30 * s * side, y + 10 * s); g.rotate(side > 0 ? 0.5 : -0.5); rr(g, -8 * s, -10 * s, 16 * s, 170 * s, 6 * s); g.fillStyle = o.penColor || '#d9a441'; g.fill(); poly(g, [[-8 * s, 160 * s], [8 * s, 160 * s], [0, 190 * s]], '#e8e0d0'); g.restore(); circle(g, x - 24 * s * side, y + 24 * s, 18 * s, ink); return; }
  if (o.closed) { circle(g, x, y, 46 * s, ink); for (let i = 0; i < 4; i++) circle(g, x - 34 * s * side + i * 4 * s * side, y - 30 * s + i * 20 * s, 15 * s, ink); }
  else if (o.point) { circle(g, x, y, 44 * s, ink); seg(g, [[x, y], [x - 110 * s * side, y - 30 * s]], 18 * s, ink); }
  else { circle(g, x + 10 * s * side, y + 6 * s, 40 * s, ink); for (let i = 0; i < 4; i++) { const a = side > 0 ? -2.2 + i * 0.32 : -0.94 - i * 0.32; seg(g, [[x, y], [x + Math.cos(a) * 95 * s, y + Math.sin(a) * 95 * s]], 17 * s, ink); } }
}
function circleMark(g, x, y, rx, ry, k, col) { if (k <= 0) return; g.strokeStyle = col; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.ellipse(x, y, rx, ry, -0.05, -1.4, -1.4 + Math.PI * 2.1 * k); g.stroke(); }

Object.assign(INSERTS, {
  // broccoli on a spoon: label FRUIT? crossed, FLOWER pops: {at}
  broccoli(g, t, info) {
    BG(g, t, info, { set: 'kitchen' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.07)); const x = E.W * 0.46, y = E.H * 0.58;
    g.save(); g.translate(x, y); g.rotate(-0.25); rr(g, -30, 40, 60, 520, 24); g.fillStyle = '#c8ccd6'; g.fill(); g.fillStyle = '#c8ccd6'; g.beginPath(); g.ellipse(0, 0, 150, 90, 0, 0, 7); g.fill(); g.restore();
    seg(g, [[x, y - 30], [x + 10, y - 150]], 40, '#7ab05a'); const r = rng(3);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, d = 60 + (i % 3) * 30; circle(g, x + 10 + Math.cos(a) * d, y - 210 + Math.sin(a) * d * 0.7, 56 + r() * 20, i % 2 ? '#3f8a3a' : '#4fa04a'); }
    for (let i = 0; i < 10; i++) circle(g, x - 40 + (i % 5) * 26, y - 260 + Math.floor(i / 5) * 40, 10, alpha('#c8f0a0', 0.6));
    if (info.fruit) { kText(g, t, 'FRUIT?', E.W * 0.76, E.H * 0.3, { start: wt(info, info.fruit, 0.2), mode: 'drop', size: 90, color: C.cream, glow: 16, out: info.dur - 0.25 }); }
    if (info.at) { const st = wt(info, info.at, 0.8), k = ease.out(prog(t, st, st + 0.25)); if (k > 0 && info.fruit) seg(g, [[E.W * 0.66, E.H * 0.3 + 20], [E.W * 0.66 + 340 * k, E.H * 0.3 - 20]], 12, C.accent);
      kText(g, t, 'FLOWER', E.W * 0.76, E.H * 0.48, { start: st, mode: 'slam', size: 110, color: C.gold, glow: 22, out: info.dur - 0.25 }); }
    g.restore();
  },
  // bus timetable on a pole; one row highlights and ticks: {at}
  timetable(g, t, info) {
    BG(g, t, info, { set: 'busstop' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W / 2, y = E.H * 0.5;
    rr(g, x - 440, y - 400, 880, 800, 20); g.fillStyle = '#f2efe8'; g.fill(); g.fillStyle = '#3a6ea5'; g.fillRect(x - 440, y - 400, 880, 110); tx(g, 'LINE 12  ·  TIMETABLE', x, y - 345, 46, '#fff', { spacing: 4 });
    const rows = ['07:42', '07:57', '08:12', '08:27', '08:42', '08:57'], hl = info.row ?? 2, st = wt(info, info.at, 0.6);
    rows.forEach((r, i) => { const yy = y - 220 + i * 100; tx(g, r, x - 220, yy, 56, '#2a2a34'); seg(g, [[x - 60, yy], [x + 320, yy]], 8, alpha('#8a8a9a', 0.5));
      if (i === hl) { const k = ease.out(prog(t, st, st + 0.35)); g.fillStyle = alpha(C.gold, 0.35 * k); g.fillRect(x - 420, yy - 42, 840 * k, 84); if (k >= 1) tx(g, '✓ ON TIME', x + 220, yy, 46, '#2a7a3a'); } });
    if (info.hand !== false) hand(g, x + 240 + 60 * ease.out(prog(t, 0, 0.5)), y - 220 + hl * 100, 1.1, { side: 1, point: true });
    g.restore();
  },
  // a street sign with exact wording; words light up as quoted: {lines:[{s, at}]}
  sign(g, t, info) {
    BG(g, t, info, { set: info.set || 'street', so: { mood: 'day' } }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.07)); const x = E.W / 2, y = E.H * 0.46;
    seg(g, [[x, y + 300], [x, E.H + 40]], 30, '#3a3a46'); rr(g, x - 420, y - 300, 840, 600, 26); g.fillStyle = '#f2efe8'; g.fill(); rr(g, x - 400, y - 280, 800, 560, 18); g.strokeStyle = '#c0392b'; g.lineWidth = 12; g.stroke();
    const lines = info.lines || [{ s: 'BICYCLE PARKING' }, { s: 'ONLY' }, { s: 'NO CARS' }];
    lines.forEach((ln, i) => { const st = wt(info, ln.at, 0.4 + i * 0.5), k = ease.out(prog(t, st, st + 0.3)); const yy = y - 160 + i * 150;
      tx(g, ln.s, x, yy, ln.size || 76, mix('#5a5a66', ln.red ? '#c0392b' : '#1a1a22', k)); if (k > 0 && ln.hl) { g.fillStyle = alpha(C.gold, 0.3 * k); g.fillRect(x - 360, yy - 50, 720 * k, 100); } });
    g.restore();
  },
  // the cat sitting on the keyboard; letters pour out: {at}
  cat(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.5, y = E.H * 0.8, ink = INK();
    poly(g, [[x - 620, y], [x + 620, y], [x + 560, y - 120], [x - 560, y - 120]], '#2a2a36'); for (let i = 0; i < 4; i++) for (let j = 0; j < 14; j++) { rr(g, x - 520 + j * 75, y - 108 + i * 26, 64, 20, 4); g.fillStyle = '#3a3a48'; g.fill(); }
    rr(g, x - 560, y - 640, 1120, 520, 18); g.fillStyle = '#121620'; g.fill(); g.fillStyle = '#1a2230'; g.fillRect(x - 530, y - 610, 1060, 460);
    const n = Math.floor(t * 30); let s = ''; for (let i = 0; i < n; i++) s += 'jjjjjjjjjkkkkkkk;;;;;'[i % 21]; for (let row = 0; row * 40 < s.length; row++) tx(g, s.slice(row * 40, row * 40 + 40), x - 500, y - 570 + row * 46, 34, '#9fd8ff', { align: 'left', weight: 800 });
    const br = Math.sin(t * 2) * 6; g.fillStyle = ink; g.beginPath(); g.ellipse(x + 60, y - 150 + br * 0.3, 260, 130 + br, 0, 0, 7); g.fill(); circle(g, x - 190, y - 240, 100, ink);
    poly(g, [[x - 270, y - 300], [x - 250, y - 400], [x - 200, y - 320]], ink); poly(g, [[x - 170, y - 330], [x - 120, y - 410], [x - 110, y - 310]], ink);
    if ((t % 3.3) < 3.15) { circle(g, x - 230, y - 250, 14, '#f2c21a'); circle(g, x - 160, y - 250, 14, '#f2c21a'); } else { seg(g, [[x - 244, y - 250], [x - 216, y - 250]], 5, '#f2c21a'); seg(g, [[x - 174, y - 250], [x - 146, y - 250]], 5, '#f2c21a'); }
    g.strokeStyle = ink; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 300, y - 130); g.quadraticCurveTo(x + 460, y - 160 + Math.sin(t * 3) * 40, x + 420, y - 330 + Math.sin(t * 3) * 30); g.stroke();
    glow(g, x, y - 400, 700, '#9fd8ff', 0.12); g.restore();
  },
  // a sentence typed out as it is spoken; weak words get red circles: {words:['...'], weak:[{i, at}], label}
  sentence(g, t, info) {
    BG(g, t, info, { set: info.set || 'cafe', veil: 0.6 }); const C = COL(), ws = info.words || ['BUSES', 'NEVER', 'COME', 'ON', 'TIME'];
    g.font = `900 72px ${FONTS.ui}`; const sp = 26, widths = ws.map(w => g.measureText(w).width), total = widths.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let x = E.W / 2 - total / 2; const y = E.H * 0.48, n = clamp((t - 0.1) / (info.typeDur ?? 1.2)) * ws.length;
    ws.forEach((w, i) => { const a = clamp(n - i); if (a > 0) tx(g, w, x + widths[i] / 2, y - (1 - a) * 20, 72, alpha(C.cream, a)); const wk = (info.weak || []).find(q => q.i === i);
      if (wk) { const k = ease.out(prog(t, wt(info, wk.at, 1.2), wt(info, wk.at, 1.2) + 0.35)); circleMark(g, x + widths[i] / 2, y, widths[i] / 2 + 30, 64, k, C.accent); if (k >= 1 && wk.note) tx(g, wk.note, x + widths[i] / 2, y + 120, 36, C.accent); }
      x += widths[i] + sp; });
    if (info.label) kText(g, t, info.label, E.W / 2, E.H * 0.22, { start: wt(info, info.labelAt, 0.6), mode: 'rise', size: 64, color: C.gold, glow: 16, font: FONTS.ui, weight: 900, out: info.dur - 0.25 });
  },
  // a horse drawing; five legs counted: {at}
  horse(g, t, info) {
    BG(g, t, info, { set: 'kitchen' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.07)); g.translate(E.W / 2, E.H / 2); g.rotate(0.03);
    g.fillStyle = '#efe6d2'; g.fillRect(-540, -400, 1080, 800); const pk = '#b0508a'; g.strokeStyle = pk; g.lineWidth = 12; g.lineCap = 'round';
    g.beginPath(); g.ellipse(0, -20, 260, 120, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(200, -80); g.lineTo(300, -240); g.stroke(); g.beginPath(); g.ellipse(340, -260, 80, 50, -0.3, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(-250, -40); g.quadraticCurveTo(-360, 20, -330, 140); g.stroke(); circle(g, 370, -275, 9, pk);
    const legs = [-180, -80, 20, 120, 210]; legs.forEach((lx, i) => { seg(g, [[lx, 90], [lx + 6, 300]], 12, pk); const st = wt(info, info.at, 0.6) + i * 0.14, k = ease.outBack(prog(t, st, st + 0.3)); if (k > 0) { circle(g, lx + 6, 340, 34 * k, C.gold); tx(g, String(i + 1), lx + 6, 342, 40 * k, '#2a2236'); } });
    for (let i = 0; i < 5; i++) seg(g, [[-480 + i * 30, 380], [-460 + i * 30, 300]], 8, '#3fb950'); FX.sun ? null : null; circle(g, -420, -300, 60, '#f2c21a');
    g.restore();
  },
  // CCTV frame: timestamp vs claimed time, mismatch flashes: {claim, cam, at}
  cctv(g, t, info) {
    g.fillStyle = '#05060a'; g.fillRect(0, 0, E.W, E.H); const C = COL(), x = E.W * 0.12, y = E.H * 0.1, w = E.W * 0.76, h = E.H * 0.66;
    rr(g, x - 12, y - 12, w + 24, h + 24, 14); g.fillStyle = '#121418'; g.fill(); g.fillStyle = '#2a3038'; g.fillRect(x, y, w, h);
    g.fillStyle = '#3a4048'; g.fillRect(x, y + h * 0.65, w, h * 0.35); for (let i = 0; i < 5; i++) { g.fillStyle = '#20252c'; g.fillRect(x + 80 + i * 300, y + h * 0.45, 200, h * 0.2); }
    drawFigure(g, { x: x + w * 0.6, y: y + h * 0.92, s: 1.1, facing: -1, outfit: { top: 'none', head: 'curly' }, pose: POSES.holdFront, prop: null, rim: { color: '#c8d0da', dir: [0, -1] } });
    g.globalAlpha = 0.15; for (let yy = y; yy < y + h; yy += 6) { g.fillStyle = '#000'; g.fillRect(x, yy, w, 2); } g.globalAlpha = 1;
    if ((t % 1) < 0.6) circle(g, x + 50, y + 50, 14, '#ff3a2a'); tx(g, 'CAM 3', x + 80, y + 52, 34, '#e8eef8', { align: 'left' }); tx(g, info.cam || '14:52', x + w - 40, y + 52, 40, '#e8eef8', { align: 'right' });
    const st = wt(info, info.at, 1.2), k = ease.out(prog(t, st, st + 0.3));
    tx(g, 'HIS STORY: ' + (info.claim || '15:20'), E.W * 0.3, E.H * 0.88, 52, C.cream); tx(g, 'CAMERA: ' + (info.cam || '14:52'), E.W * 0.7, E.H * 0.88, 52, mix(C.cream, C.accent, k));
    if (k > 0) { ring(g, x + w - 110, y + 52, 70 * k + 10, 6, C.accent); kText(g, t, '≠', E.W / 2, E.H * 0.88, { start: st, mode: 'slam', size: 90, color: C.accent, glow: 20 }); }
  },
  // vending machine that ignores the argument; coin stuck: {}
  vending(g, t, info) {
    BG(g, t, info, { set: 'canteen' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.05)); const x = E.W * 0.5, y = E.H * 0.06;
    rr(g, x - 360, y, 720, E.H, 30); g.fillStyle = '#c0392b'; g.fill(); rr(g, x - 320, y + 40, 460, 760, 14); g.fillStyle = '#0e1820'; g.fill(); glow(g, x - 90, y + 400, 400, '#9fd8ff', 0.2);
    const cols = ['#f2c21a', '#3a6ea5', '#3fb950', '#f29ac0', '#d64a33']; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { rr(g, x - 300 + j * 108, y + 70 + i * 145, 80, 110, 12); g.fillStyle = cols[(i + j) % 5]; g.fill(); seg(g, [[x - 300 + j * 108, y + 190 + i * 145], [x - 220 + j * 108, y + 190 + i * 145]], 6, '#6a7080'); }
    rr(g, x + 170, y + 120, 150, 90, 8); g.fillStyle = '#0a1a10'; g.fill(); tx(g, info.screen || 'ERROR', x + 245, y + 166, 30, (t % 0.8) < 0.5 ? '#5fd39a' : '#2a5a3a');
    rr(g, x + 220, y + 260, 50, 90, 10); g.fillStyle = '#2a2a34'; g.fill(); circle(g, x + 245, y + 290, 14, '#d9a441'); text(g, '?', x + 245, y + 400, { size: 70, color: alpha('#fff', 0.5) });
    g.restore();
  },
  // top-down road: bright yellow crosswalk paints itself; a little girl with a backpack crosses: {at, girl}
  crosswalk(g, t, info) {
    g.fillStyle = '#3a3a46'; g.fillRect(0, 0, E.W, E.H); const C = COL(), cx = E.W / 2; g.save(); zoomAt(g, push(t, info, 0.08));
    g.fillStyle = '#5a5a66'; g.fillRect(0, 0, E.W, E.H * 0.16); g.fillRect(0, E.H * 0.84, E.W, E.H * 0.16); for (let x = 0; x < E.W; x += 220) { g.fillStyle = alpha('#f2efe8', 0.5); g.fillRect(x, E.H / 2 - 6, 110, 12); }
    const st = wt(info, info.at, 0.2); for (let i = 0; i < 8; i++) { const k = ease.out(prog(t, st + i * 0.12, st + i * 0.12 + 0.3)); g.fillStyle = '#f2c21a'; g.fillRect(cx - 360 + i * 95, E.H * 0.16, 60, E.H * 0.68 * k); }
    if (info.girl) { const gk = ease.inOut(prog(t, wt(info, info.girl, 1), info.dur)); const gy = lerp(E.H * 0.92, E.H * 0.08, gk), gx = cx + 40; circle(g, gx, gy, 34, INK()); rr(g, gx - 34, gy + 18, 68, 50, 14); g.fillStyle = '#f29ac0'; g.fill();
      const ph = Math.sin(t * 9) * 16; seg(g, [[gx - 14, gy - 30], [gx - 14 + ph * 0.3, gy - 70]], 12, INK()); seg(g, [[gx + 14, gy - 30], [gx + 14 - ph * 0.3, gy - 70]], 12, INK()); }
    g.restore(); glow(g, E.W * 0.85, E.H * 0.1, 500, '#ffe7b0', 0.15);
  },
  // trophy that turns into a receipt: {at}
  trophy(g, t, info) {
    BG(g, t, info, { set: 'bedroom', veil: 0.55 }); const C = COL(), st = wt(info, info.at, 1.4), k = ease.inOut(prog(t, st, st + 0.6)), x = E.W / 2, y = E.H * 0.55;
    if (k < 1) { g.save(); g.globalAlpha = 1 - k; g.translate(x, y); g.scale(1 - 0.3 * k, 1 - 0.3 * k); poly(g, [[-200, -260], [200, -260], [150, 20], [-150, 20]], C.gold); ring(g, -230, -160, 70, 22, C.gold); ring(g, 230, -160, 70, 22, C.gold); rr(g, -40, 20, 80, 120, 10); g.fillStyle = shade(C.gold, -0.2); g.fill(); rr(g, -160, 140, 320, 70, 14); g.fill(); glow(g, 0, -100, 400, C.gold, 0.4); FX.sparkle(g, 120, -220, 40, '#fff6d0', 1); g.restore(); }
    if (k > 0) { g.save(); g.globalAlpha = k; g.translate(x, y); g.rotate(0.03); poly(g, (() => { const p = [[-180, -300], [180, -300]]; for (let i = 0; i <= 12; i++) p.push([180 - i * 30, 300 + (i % 2) * 18]); return p; })(), '#f4f2ec');
      ['WIN', 'WIN', 'WIN', 'WIN', 'WIN'].forEach((s, i) => { tx(g, s, -120, -220 + i * 70, 34, '#5a5a66', { align: 'left' }); tx(g, '1.00', 120, -220 + i * 70, 34, '#5a5a66', { align: 'right' }); }); seg(g, [[-140, 140], [140, 140]], 3, '#8a8a9a'); tx(g, 'TOTAL  0 FEELINGS', 0, 200, 34, '#2a2a34'); g.restore(); }
  },
  // Leo's drawing: two stick figures, one with a trophy, one with churros, "MAX + LEO": {}
  leodrawing(g, t, info) {
    BG(g, t, info, { set: 'bedroom' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.08)); g.translate(E.W / 2, E.H / 2); g.rotate(-0.025);
    g.fillStyle = '#efe6d2'; g.fillRect(-560, -400, 1120, 800); for (const [px, py] of [[-520, -370], [520, -370]]) circle(g, px, py, 12, '#c0392b');
    const fig = (fx, col) => { g.strokeStyle = '#2a2236'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.arc(fx, -120, 60, 0, 7); g.stroke(); seg(g, [[fx, -60], [fx, 120]], 10, '#2a2236'); seg(g, [[fx, 120], [fx - 50, 230]], 10, '#2a2236'); seg(g, [[fx, 120], [fx + 50, 230]], 10, '#2a2236'); seg(g, [[fx, -10], [fx - 90, 40]], 10, '#2a2236'); seg(g, [[fx, -10], [fx + 90, -60]], 10, '#2a2236'); g.strokeStyle = col; g.lineWidth = 8; g.beginPath(); g.arc(fx, -120, 70, 3.6, 5.8); g.stroke(); };
    fig(-230, '#d64a33'); fig(230, '#f2c21a');
    poly(g, [[-170, -120], [-90, -120], [-100, -60], [-160, -60]], '#d9a441'); seg(g, [[-130, -60], [-130, -40]], 8, '#d9a441');
    for (let i = 0; i < 3; i++) { g.save(); g.translate(310 + i * 18, -100 + i * 6); g.rotate(-0.6 + i * 0.25); rr(g, -10, -70, 20, 110, 8); g.fillStyle = '#c98a4a'; g.fill(); g.restore(); }
    kText(g, t, 'MAX + LEO', 0, 320, { start: 0.2, mode: 'type', size: 70, color: '#8a3a5a', font: FONTS.title, weight: 700, spacing: 4 });
    g.restore();
  },
  // churros in a paper cone, sugar sparkles: {n}
  churros(g, t, info) {
    BG(g, t, info, { set: info.set || 'pitch' }); g.save(); zoomAt(g, push(t, info, 0.07)); const x = E.W / 2, y = E.H * 0.62;
    for (let i = 0; i < (info.n ?? 5); i++) { g.save(); g.translate(x - 80 + i * 40, y - 60); g.rotate(-0.4 + i * 0.2); rr(g, -26, -380, 52, 420, 24); g.fillStyle = '#c98a4a'; g.fill(); for (let k = 0; k < 8; k++) seg(g, [[-16, -350 + k * 48], [16, -330 + k * 48]], 5, '#a86a2a'); g.restore(); }
    poly(g, [[x - 240, y - 80], [x + 240, y - 80], [x + 120, y + 380], [x - 120, y + 380]], '#f2efe8'); for (let i = 0; i < 5; i++) seg(g, [[x - 200 + i * 100, y - 80], [x - 100 + i * 50, y + 380]], 14, alpha('#d64a33', 0.8));
    for (let i = 0; i < 14; i++) FX.sparkle(g, x - 200 + ((i * 97) % 400), y - 300 + ((i * 53) % 200) + Math.sin(t * 2 + i) * 10, 10, '#fff6d0', 0.6 + 0.4 * Math.sin(t * 4 + i));
    g.restore();
  },
  // search results page: NO RESULTS for the club: {q, at}
  search(g, t, info) {
    BG(g, t, info, { set: 'bedroom', veil: 0.6 }); const C = COL(), x = E.W * 0.34, y = E.H * 0.05, w = E.W * 0.32, h = E.H * 0.9;
    rr(g, x - 16, y - 16, w + 32, h + 32, 50); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#f4f6f8'; g.fillRect(x, y, w, h);
    rr(g, x + 30, y + 80, w - 60, 80, 40); g.fillStyle = '#e4e8ee'; g.fill(); const q = info.q || 'MR BLACK BIG CLUB SCOUT'; const n = Math.floor(clamp(t / 1.0) * q.length);
    tx(g, q.slice(0, n) + ((t % 0.6) < 0.3 ? '|' : ''), x + 60, y + 122, 26, '#2a2a34', { align: 'left' });
    const st = wt(info, info.at, 1.2); ['NO RESULTS', 'NO WEBSITE', 'NO PHONE NUMBER'].forEach((s, i) => { const k = ease.out(prog(t, st + i * 0.6, st + i * 0.6 + 0.3)); if (k <= 0) return; g.globalAlpha = k; tx(g, '✕  ' + s, x + w / 2, y + 300 + i * 130, 40, i ? '#5a5a66' : C.accent); g.globalAlpha = 1; });
  },
  // the envelope in dad's handwriting on the table: {label}
  envelope(g, t, info) {
    BG(g, t, info, { set: 'lobby' }); g.save(); zoomAt(g, push(t, info, 0.07)); const x = E.W / 2, y = E.H * 0.55;
    g.fillStyle = '#2a1810'; g.fillRect(-100, E.H * 0.7, E.W + 200, E.H); g.save(); g.translate(x, y); g.rotate(-0.06); rr(g, -420, -240, 840, 480, 10); g.fillStyle = '#e8dcc0'; g.fill();
    poly(g, [[-420, -240], [0, 40], [420, -240]], shade('#e8dcc0', -0.08)); g.strokeStyle = shade('#e8dcc0', -0.2); g.lineWidth = 3; g.beginPath(); g.moveTo(-420, -240); g.lineTo(0, 40); g.lineTo(420, -240); g.stroke();
    kText(g, t, info.label || "FOR LEO'S FUTURE", 0, 140, { start: wt(info, info.at, 0.4), mode: 'type', size: 62, color: '#2a3a6a', font: FONTS.title, weight: 600, spacing: 2, stagger: 0.05 });
    if (info.thick) for (let i = 0; i < 6; i++) { g.fillStyle = shade('#7a9a6a', -i * 0.04); g.fillRect(-300 + i * 4, -280 - i * 6, 600, 40); } g.restore();
    glow(g, x, y - 300, 600, '#ffd59a', 0.18); g.restore();
  },
  // glossy folder: crest, signature line, stadium photo; crest pixelates on zoom: {at, zoomAt}
  crest(g, t, info) {
    BG(g, t, info, { set: 'lobby' }); const C = COL(), zk = info.zoomAt != null ? ease.inOut(prog(t, wt(info, info.zoomAt, 1), wt(info, info.zoomAt, 1) + 0.8)) : 0;
    g.save(); zoomAt(g, push(t, info, 0.04) * (1 + 1.4 * zk), E.W * 0.34, E.H * 0.42);
    rr(g, E.W * 0.1, E.H * 0.1, E.W * 0.8, E.H * 0.8, 18); g.fillStyle = '#121016'; g.fill(); g.fillStyle = '#f4f2ee'; g.fillRect(E.W * 0.13, E.H * 0.14, E.W * 0.36, E.H * 0.72); g.fillRect(E.W * 0.51, E.H * 0.14, E.W * 0.36, E.H * 0.72);
    const cx = E.W * 0.31, cy = E.H * 0.38, px = info.pix ? 18 : 0;
    const shield = () => { g.beginPath(); g.moveTo(cx - 150, cy - 160); g.lineTo(cx + 150, cy - 160); g.lineTo(cx + 150, cy + 20); g.quadraticCurveTo(cx, cy + 200, cx - 150, cy + 20); g.closePath(); };
    shield(); g.fillStyle = '#1a3a6a'; g.fill(); g.lineWidth = 12; g.strokeStyle = '#d9a441'; g.stroke(); text(g, '★', cx, cy - 30, { size: 140, color: '#d9a441' });
    if (px && zk > 0.3) { const r = rng(2); for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, d = 140 + r() * 40; g.fillStyle = r() < 0.5 ? '#1a3a6a' : '#d9a441'; g.fillRect(cx + Math.cos(a) * d - px / 2, cy - 20 + Math.sin(a) * d * 0.9 - px / 2, px, px); } }
    seg(g, [[E.W * 0.17, E.H * 0.72], [E.W * 0.45, E.H * 0.72]], 4, '#5a5a66'); tx(g, 'SIGN HERE', E.W * 0.31, E.H * 0.77, 26, '#8a8a9a');
    g.fillStyle = '#2a3a5a'; g.fillRect(E.W * 0.55, E.H * 0.2, E.W * 0.28, E.H * 0.34); g.fillStyle = '#3a8a4a'; g.fillRect(E.W * 0.55, E.H * 0.42, E.W * 0.28, E.H * 0.12); for (let i = 0; i < 6; i++) circle(g, E.W * 0.57 + i * 90, E.H * 0.24, 16, '#fff6d8');
    for (let i = 0; i < 6; i++) seg(g, [[E.W * 0.55, E.H * 0.6 + i * 34], [E.W * 0.55 + 300 + (i * 61) % 160, E.H * 0.6 + i * 34]], 8, alpha('#8a8a9a', 0.5));
    g.restore();
    if (info.label) kText(g, t, info.label, E.W / 2, E.H * 0.9, { start: wt(info, info.at, 1.2), mode: 'slam', size: 70, color: C.accent, glow: 18, font: FONTS.ui, weight: 900, out: info.dur - 0.25 });
  },
  // Leo's hand with the pen over the paper; distance shrinks on the spoken numbers: {d:[[word|t, cm]], drop, freeze}
  pen2(g, t, info) {
    BG(g, t, info, { set: 'lobby', veil: 0.55 }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.1), E.W * 0.4, E.H * 0.6);
    g.fillStyle = '#2a1810'; g.fillRect(-100, E.H * 0.56, E.W + 200, E.H); g.save(); g.translate(E.W * 0.3, E.H * 0.72); g.rotate(-0.04); g.fillStyle = '#f4f2ee'; g.fillRect(-300, -120, 600, 240); seg(g, [[-220, 60], [180, 60]], 4, '#5a5a66'); tx(g, 'SIGN HERE', -20, 100, 22, '#8a8a9a'); g.restore();
    const ks = (info.d || [[0, 40]]).map(([a, v]) => [typeof a === 'string' ? wt(info, a, 0) : a, v]), cm = key(t, ks, ease.inOut);
    const tipX = E.W * 0.32 + cm * 16, tipY = E.H * 0.78 - 20 - cm * 6;
    if (info.drop) { const dt = wt(info, info.drop, 1); if (t > dt) { const q = t - dt; const px = E.W * 0.36 + q * 300, py = Math.min(E.H * 0.7, E.H * 0.7 - 80 + q * q * 2000); g.save(); g.translate(px, py); g.rotate(q * 6); rr(g, -10, -90, 20, 180, 8); g.fillStyle = '#d9a441'; g.fill(); g.restore(); } else hand(g, tipX + 40, tipY - 160, 1.1, { side: 1, pen: true, sleeve: CAST.leo.color }); }
    else hand(g, tipX + 40, tipY - 160, 1.1, { side: 1, pen: true, sleeve: CAST.leo.color });
    if (!info.drop || t < wt(info, info.drop, 1)) UI.dimension(g, t, { x1: E.W * 0.32, y1: E.H * 0.79, x2: E.W * 0.32, y2: tipY + 10 > E.H * 0.79 - 10 ? E.H * 0.79 - 10 : tipY + 10, str: `${Math.round(cm)} cm`, start: 0 });
    g.restore();
    if (info.freeze) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.3)'; g.fillRect(0, 0, E.W, E.H); g.restore(); }
    const big = Math.round(cm); text(g, `${big} CM`, E.W * 0.78, E.H * 0.3, { size: 130, color: big <= 5 ? C.accent : C.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(big <= 5 ? C.accent : C.gold, 0.6) });
  },
  // a police drawer full of identical envelopes: {at}
  drawer(g, t, info) {
    BG(g, t, info, { set: 'office', so: { mood: 'night' } }); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W / 2, y = E.H * 0.5, open = info.empty ? 1 - ease.inOut(prog(t, wt(info, info.at, 0.3), wt(info, info.at, 0.3) + 0.35)) : ease.out(prog(t, 0.1, 0.9));
    rr(g, x - 560, y - 320 + 0, 1120, 700, 16); g.fillStyle = '#4a4e58'; g.fill(); rr(g, x - 520, y - 260 - 120 * open, 1040, 600, 12); g.fillStyle = '#2a2e38'; g.fill();
    if (!info.empty) for (let i = 0; i < 14; i++) { g.save(); g.translate(x - 440 + (i % 7) * 140, y - 200 - 120 * open + Math.floor(i / 7) * 220); g.rotate(((i * 37) % 10 - 5) * 0.02); g.fillStyle = '#e8dcc0'; g.fillRect(-60, -80, 120, 180); tx(g, 'FOR', 0, -20, 18, '#2a3a6a'); tx(g, 'FUTURE', 0, 10, 18, '#2a3a6a'); g.restore(); }
    rr(g, x - 80, y + 300, 160, 30, 10); g.fillStyle = '#9aa0aa'; g.fill(); FX.lightCone(g, x - 400, -100, { angle: 1.1, spread: 0.4, len: 1200, color: '#fff6d8', a: 0.14 }); g.restore();
  },
  // police phone call: manager's hand + phone, "CALLING 911"-style label: {label}
  call(g, t, info) {
    BG(g, t, info, { set: info.set || 'lobby' }); g.save(); zoomAt(g, push(t, info, 0.06)); const x = E.W * 0.52, y = E.H * 0.52;
    rr(g, x - 140, y - 260, 280, 520, 36); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#16202e'; g.fillRect(x - 120, y - 230, 240, 460);
    tx(g, info.label || 'POLICE', x, y - 150, 34, '#e8eef8'); tx(g, (info.timer ? `0:${String(Math.floor(t) % 60).padStart(2, '0')}` : 'CALLING…'), x, y - 100, 26, '#8fa0b8');
    circle(g, x, y + 150, 40, '#3fb950'); FX.rings(g, x, y - 20, t, { count: 3, r0: 60, r1: 220, color: '#9fd8ff', a: 0.4 }); hand(g, x + 60, y + 120, 1.2, { side: 1, closed: true, sleeve: info.sleeve || '#2a2836' }); g.restore();
  },
  // a pay slip: old vs new number: {from, to, at}
  payslip(g, t, info) {
    BG(g, t, info, { set: 'kitchenNight' }); const C = COL(); g.save(); zoomAt(g, push(t, info, 0.06)); g.translate(E.W / 2, E.H / 2); g.rotate(0.03);
    g.fillStyle = '#f4f2ec'; g.fillRect(-420, -360, 840, 720); tx(g, 'PAYCHECK', 0, -300, 48, '#2a2a34', { spacing: 6 }); for (let i = 0; i < 6; i++) seg(g, [[-360, -200 + i * 60], [-360 + 380 + (i * 47) % 200, -200 + i * 60]], 8, alpha('#8a8a9a', 0.45));
    const st = wt(info, info.at, 0.8), k = ease.out(prog(t, st, st + 0.8)), v = Math.round(lerp(info.from ?? 1840, info.to ?? 2410, k)); seg(g, [[-360, 200], [360, 200]], 3, '#5a5a66');
    tx(g, 'TOTAL', -240, 260, 44, '#5a5a66'); tx(g, '$' + v.toLocaleString('en-US'), 200, 260, 72, k > 0.99 ? '#2a7a3a' : '#2a2a34'); if (k > 0.99) kText(g, t, '+ EVERY HOUR', 0, 400, { start: st + 0.8, mode: 'slam', size: 60, color: C.good, font: FONTS.ui, weight: 900 });
    g.restore();
  },
  // flat-earth test: lamp, ball (orange), curved shadow on the wall; 60 s readout: {at}
  earth(g, t, info) {
    BG(g, t, info, { set: 'class', veil: 0.65 }); const C = COL(), x = E.W * 0.46, y = E.H * 0.52, st = wt(info, info.at, 1.2), k = ease.out(prog(t, st, st + 0.6));
    seg(g, [[E.W * 0.12, E.H * 0.9], [E.W * 0.12, E.H * 0.5], [E.W * 0.18, E.H * 0.42]], 10, '#1a1622'); poly(g, [[E.W * 0.16, E.H * 0.36], [E.W * 0.24, E.H * 0.4], [E.W * 0.21, E.H * 0.47], [E.W * 0.14, E.H * 0.42]], '#2a2230');
    glow(g, E.W * 0.21, E.H * 0.44, 300 * (0.3 + k), '#fff3d6', 0.6 * k); FX.lightCone(g, E.W * 0.22, E.H * 0.44, { angle: 0.1, spread: 0.35, len: 1100, color: '#fff3d6', a: 0.16 * k });
    circle(g, x, y, 130, '#3a6ea5'); g.save(); g.beginPath(); g.arc(x, y, 130, 0, 7); g.clip(); circle(g, x - 40, y - 30, 70, '#3fb950'); circle(g, x + 60, y + 50, 50, '#3fb950'); g.fillStyle = alpha('#000', 0.45); g.fillRect(x, y - 140, 140, 280); g.restore();
    seg(g, [[x, y + 130], [x + 10, y + 380]], 16, '#c8ccd6');
    g.fillStyle = alpha('#05040a', 0.55 * k); g.beginPath(); g.ellipse(E.W * 0.8, y, 190 * k + 1, 200 * k + 1, 0, 0, 7); g.fill();
    if (k > 0.5) { UI.callout(g, t, { at: [E.W * 0.8, y - 200], to: [E.W * 0.8, E.H * 0.16], str: 'ROUND SHADOW', start: st + 0.4, color: C.gold }); }
    UI.readout(g, { label: 'PROOF', value: '60 s', x: E.W * 0.06, y: E.H * 0.12, a: fadeIO(t, info.dur) });
  },
});
