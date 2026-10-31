// sets/mem.js — locations new to "Perfect Memory": living room (couch, morning window), the bank (counter, wall clock,
// teller windows, queue rope), and a house party (night, string lights, crowd).
import { E, V, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, rng, FONTS } from '/engine/core.js';
import { ground, bigWindow, wallClock, floor, wall, table, label, shelfBooks, FX } from './_kit.js';

export function couch(g, x, GY, w = 520, c = '#5a3a4a') {
  const d = shade(c, -0.3);
  rr(g, x - w / 2, GY - 240, w, 130, 30); g.fillStyle = d; g.fill();                       // back
  rr(g, x - w / 2 + 20, GY - 130, w - 40, 70, 18); g.fillStyle = c; g.fill();              // seat
  for (const s of [-1, 1]) { rr(g, x + s * (w / 2 - 30) - 40, GY - 170, 80, 120, 26); g.fillStyle = shade(c, -0.15); g.fill(); }
  g.fillStyle = alpha('#ffd9b0', 0.18); g.fillRect(x - w / 2 + 30, GY - 236, w - 60, 5);
  seg(g, [[x - w / 2 + 40, GY - 60], [x - w / 2 + 44, GY]], 10, '#1a1218'); seg(g, [[x + w / 2 - 40, GY - 60], [x + w / 2 - 44, GY]], 10, '#1a1218');
  return GY - 120;                                                                          // seat height
}

// living room: big morning window behind the couch, floor lamp, bookshelf, TV glow on the right
export function living(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = ground(), CX = E.W / 2, eve = o.mood === 'dusk' || o.mood === 'night';
  layer(g, cam, 0.55, (g) => {
    wall(g, M, GY, { k: -0.28 });
    bigWindow(g, M, CX - 420, GY - 660, 760, 440, { sun: eve ? null : [CX + 120, GY - 380], night: o.mood === 'night', moon: o.mood === 'night' ? [CX + 160, GY - 560] : null, cols: 4, rows: 2, seed: 18, glowA: eve ? 0.08 : 0.2 });
    if (!eve) FX.godRays(g, CX + 120, GY - 380, { count: 8, angle: Math.PI * 0.55, spread: 0.6, len: 900, a: 0.05, t, color: M.key });
    // bookshelf (left)
    g.fillStyle = shade(M.wall, -0.55); g.fillRect(CX - 1060, GY - 640, 300, 640);
    for (let i = 0; i < 4; i++) { g.fillStyle = shade(M.wall, -0.7); g.fillRect(CX - 1050, GY - 500 + i * 140, 280, 10); shelfBooks(g, CX - 1045, GY - 502 + i * 140, 270, i * 5 + 1); }
    // framed photos + clock
    for (const [dx, dy] of [[560, -560], [700, -600], [640, -440]]) { g.fillStyle = '#1a1218'; g.fillRect(CX + dx - 50, GY + dy - 40, 100, 80); g.fillStyle = shade(M.key, -0.35); g.fillRect(CX + dx - 40, GY + dy - 30, 80, 60); }
    wallClock(g, CX - 620, GY - 560, 40, t, { time: o.clock ?? (7 * 3600 + t) });
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: shade(M.floor, 0.05) }); FX.pool(g, CX - 40, GY + 50, 560, 60, M.key, 0.2);
    g.fillStyle = alpha('#7a3a4a', 0.5); g.beginPath(); g.ellipse(CX - 40, GY + 90, 520, 60, 0, 0, 7); g.fill(); });
  layer(g, cam, 1, (g) => {
    couch(g, CX - 40, GY, 560, o.couch || '#6a3a4a');
    // floor lamp (right)
    const lx = CX + 420; seg(g, [[lx, GY], [lx, GY - 520]], 7, '#120d14'); poly(g, [[lx - 60, GY - 520], [lx + 60, GY - 520], [lx + 40, GY - 600], [lx - 40, GY - 600]], '#e8c89a');
    glow(g, lx, GY - 540, 240, M.practical, eve ? 0.55 : 0.3);
    if (eve) FX.lightCone(g, lx, GY - 520, { len: 520, spread: 0.6, color: M.practical, a: 0.1 });
    // coffee table
    rr(g, CX - 200, GY - 70, 300, 14, 6); g.fillStyle = '#2a1c22'; g.fill(); seg(g, [[CX - 180, GY - 60], [CX - 180, GY]], 7, '#2a1c22'); seg(g, [[CX + 80, GY - 60], [CX + 80, GY]], 7, '#2a1c22');
    if (o.keys) { seg(g, [[CX - 60, GY - 76], [CX - 40, GY - 90]], 5, '#d9b44a'); ring(g, CX - 70, GY - 76, 9, 3, '#d9b44a'); }
  });
  return { GY, CX, M, rim: [0.3, -0.9] };
}

// the bank: marble hall, tall windows behind, counter with teller windows, big wall clock, queue rope, ceiling lamps
export function bank(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.35, (g) => {
    wall(g, M, GY, { k: -0.12 });
    for (let i = -3; i <= 3; i++) { const x = CX + i * 420; bigWindow(g, M, x - 110, GY - 900, 220, 520, { sky: mood('day').sky, cols: 1, rows: 3, seed: 70 + i, glowA: 0.1, city: true }); }
    text(g, 'CITY SAVINGS BANK', CX, GY - 960, { size: 54, color: alpha('#e8eef8', 0.5), font: FONTS.title, weight: 700, spacing: 14 });
  });
  layer(g, cam, 0.6, (g) => {
    // columns
    for (let i = -4; i <= 4; i++) { const x = CX + i * 420 + 210; g.fillStyle = linGrad(g, x - 50, 0, x + 50, 0, [shade(M.wall, -0.1), shade(M.wall, 0.25), shade(M.wall, -0.2)]); g.fillRect(x - 50, GY - 1000, 100, 1000); }
    // big clock above the counter
    const cx = CX + (o.clockX ?? 0), cy = GY - 640; circle(g, cx, cy, 120, '#f2efe8'); ring(g, cx, cy, 120, 14, '#1a1622');
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * 92, cy + Math.sin(a) * 92], [cx + Math.cos(a) * 108, cy + Math.sin(a) * 108]], 5, '#1a1622'); }
    const mins = o.minutes ?? (1 + t / 60); const ma = mins / 60 * Math.PI * 2 - Math.PI / 2, ha = (12 + mins / 60) / 12 * Math.PI * 2 - Math.PI / 2;
    seg(g, [[cx, cy], [cx + Math.cos(ha) * 60, cy + Math.sin(ha) * 60]], 10, '#1a1622'); seg(g, [[cx, cy], [cx + Math.cos(ma) * 92, cy + Math.sin(ma) * 92]], 6, '#1a1622'); circle(g, cx, cy, 9, '#c0392b');
    glow(g, cx, cy, 220, '#fff3dc', 0.12);
    // counter with glass teller windows
    const top = GY - 210; g.fillStyle = shade(M.wall, -0.55); g.fillRect(-E.W, top, E.W * 3, 210); g.fillStyle = shade(M.wall, -0.2); g.fillRect(-E.W, top - 16, E.W * 3, 18);
    for (let i = -3; i <= 3; i++) { const x = CX + i * 380; g.fillStyle = alpha('#cfe0ff', 0.1); g.fillRect(x - 150, top - 300, 300, 284); g.strokeStyle = alpha('#cfe0ff', 0.35); g.lineWidth = 4; g.strokeRect(x - 150, top - 300, 300, 284);
      text(g, String(i + 4), x, top - 330, { size: 30, color: alpha('#e8eef8', 0.6), font: FONTS.ui, weight: 900 }); glow(g, x, top - 360, 160, '#e8f4ff', 0.12); }
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: shade(M.floor, 0.15), lines: 'rgba(255,255,255,.05)' }); FX.pool(g, CX, GY + 40, 700, 60, '#e8f4ff', 0.12); });
  if (o.rope !== false) layer(g, cam, 1.05, (g) => { for (let i = 0; i < 4; i++) { const x = CX - 700 + i * 330; seg(g, [[x, GY + 60], [x, GY - 60]], 8, '#c9a24a'); circle(g, x, GY - 64, 10, '#e8c46a'); if (i < 3) { g.strokeStyle = '#8a1a2a'; g.lineWidth = 8; g.beginPath(); g.moveTo(x, GY - 50); g.quadraticCurveTo(x + 165, GY + 10, x + 330, GY - 50); g.stroke(); } } });
  return { GY, CX, M, rim: [0, -1], top };
}

// house party: night window, string lights, warm practicals, a dense crowd silhouette band behind the hero
export function party(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = ground(), CX = E.W / 2, r = rng(5);
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { color: '#3a2a4a', k: -0.2 });
    bigWindow(g, M, CX - 300, GY - 680, 600, 380, { night: true, moon: [CX + 180, GY - 600], cols: 3, rows: 2, seed: 22, glowA: 0.08 });
    for (let k = 0; k < 2; k++) { g.strokeStyle = '#120d14'; g.lineWidth = 2; g.beginPath(); for (let x = -E.W; x < E.W * 2; x += 20) { const y = GY - 760 + k * 120 + Math.sin(x / 300) * 40; x === -E.W ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
      for (let x = -E.W; x < E.W * 2; x += 90) { const y = GY - 760 + k * 120 + Math.sin(x / 300) * 40 + 12, c = ['#ffd28a', '#f29ac0', '#7fd0d6', '#f2c21a'][((x / 90) | 0) & 3], tw = 0.7 + 0.3 * Math.sin(t * 3 + x); circle(g, x, y, 8, c); glow(g, x, y, 50, c, 0.35 * tw); } }
  });
  layer(g, cam, 0.75, (g) => { floor(g, M, GY, { color: '#2a1e2e' }); FX.crowd(g, t, { x: -E.W, w: E.W * 3, y: GY - 60, rows: 2, rowH: 70, size: 6.5, color: '#1a1220', seed: 7, cheer: o.cheer ?? 0.6 }); });
  layer(g, cam, 0.9, (g) => { FX.pool(g, CX, GY + 60, 700, 70, '#ffd28a', 0.18); });
  return { GY, CX, M, rim: [0, -1] };
}
