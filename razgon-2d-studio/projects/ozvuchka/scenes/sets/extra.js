// sets/extra.js — locations new to this story: café (Spanish lunch), supermarket, hospital room, music room,
// school fair (night, string lights), Dr. Lee's clinic (scan screen), balcony (dusk city).
import { E, V, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, rng, FONTS } from '/engine/core.js';
import { ground, bigWindow, wallClock, floor, wall, table, desk, label, shelfBooks, FX } from './_kit.js';

// café: warm, big front window onto a golden street, hanging bulbs, counter with an espresso machine
export function cafe(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.3 });
    bigWindow(g, M, CX - 760, GY - 660, 820, 460, { sun: [CX - 300, GY - 300], cols: 4, rows: 2, seed: 61, glowA: 0.2 });
    text(g, 'CAFÉ SOL', CX - 350, GY - 620, { size: 40, color: alpha('#ffe7b0', 0.35), font: FONTS.title, weight: 700, spacing: 10 });
    FX.counter(g, { x: CX + 260, y: GY, w: 900, h: 140, color: shade(M.wall, -0.55), top: shade(M.wall, -0.1), doors: 5 });
    rr(g, CX + 520, GY - 260, 160, 120, 14); g.fillStyle = '#9aa0aa'; g.fill(); glow(g, CX + 600, GY - 200, 120, M.practical, 0.3);
    g.fillStyle = shade(M.wall, -0.6); g.fillRect(CX + 260, GY - 640, 900, 200); ['TAPAS', 'CAFÉ', 'PAELLA'].forEach((s, i) => text(g, s, CX + 360 + i * 260, GY - 560, { size: 34, color: alpha('#f2efe8', 0.7), font: FONTS.ui, weight: 900, spacing: 3 }));
    for (let i = 0; i < 5; i++) { const x = CX - 600 + i * 330; seg(g, [[x, -E.H], [x, GY - 760 + (i % 2) * 40]], 2, '#120d14'); circle(g, x, GY - 750 + (i % 2) * 40, 14, '#fff1c8'); glow(g, x, GY - 750 + (i % 2) * 40, 160, M.practical, 0.45); }
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: '#4a2e24' }); FX.pool(g, CX - 300, GY + 50, 700, 60, M.key, 0.22); });
  if (o.table !== false) layer(g, cam, 1, (g) => { const top = table(g, CX - 80, GY, 300, 140, '#2a1a16'); rr(g, CX - 140, top - 10, 60, 12, 6); g.fillStyle = '#f2ece4'; g.fill(); circle(g, CX - 20, top - 8, 28, '#e0a040'); });
  return { GY, CX, M, rim: [-0.6, -0.8] };
}

// supermarket: cold fluorescent strips, shelves of colourful packs, a checkout with a price screen
export function market(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.1 });
    for (let i = -5; i <= 5; i++) { const x = CX + i * 340; g.fillStyle = shade(M.wall, -0.5); g.fillRect(x - 150, GY - 620, 300, 620); for (let j = 0; j < 5; j++) { g.fillStyle = shade(M.wall, -0.7); g.fillRect(x - 146, GY - 600 + j * 120 + 100, 292, 10); { let xx = x - 140, k = i * 5 + j * 7 + 40; const cols = ['#d64a33', '#f2c21a', '#3fb950', '#3a6ea5', '#f29ac0', '#e8e0d0']; while (xx < x + 120) { const bw = 34 + (k * 13) % 18, bh = 40 + (k * 7) % 30, yb = GY - 600 + j * 120 + 100; if (k % 3 === 0) { rr(g, xx, yb - bh, bw, bh, bw / 2); g.fillStyle = shade(cols[k % 6], -0.3); g.fill(); } else { g.fillStyle = shade(cols[k % 6], -0.3); g.fillRect(xx, yb - bh, bw, bh); g.fillStyle = alpha('#ffffff', 0.25); g.fillRect(xx + 4, yb - bh + 8, bw - 8, 8); } xx += bw + 4; k++; } } } }
    for (let i = -3; i <= 3; i++) { rr(g, CX + i * 520 - 160, GY - 820, 320, 16, 8); g.fillStyle = '#eef6ff'; g.fill(); glow(g, CX + i * 520, GY - 800, 320, '#dfefff', 0.25); }
  });
  layer(g, cam, 0.9, (g) => {
    floor(g, M, GY, { color: '#8a9098', lines: 'rgba(0,0,0,.1)' }); FX.pool(g, CX, GY + 60, 900, 80, '#dfefff', 0.16);
    if (o.checkout !== false) { const x = CX + 260; rr(g, x - 300, GY - 130, 600, 130, 10); g.fillStyle = '#2a2e38'; g.fill(); g.fillStyle = '#121418'; g.fillRect(x - 280, GY - 130, 560, 14);
      seg(g, [[x + 220, GY - 130], [x + 220, GY - 260]], 8, '#1a1c22'); rr(g, x + 150, GY - 330, 150, 90, 8); g.fillStyle = '#0a0e14'; g.fill(); text(g, o.price || '€ 42.60', x + 225, GY - 285, { size: 30, color: '#5fd39a', font: FONTS.ui, weight: 900 }); glow(g, x + 225, GY - 285, 100, '#5fd39a', 0.3); }
  });
  return { GY, CX, M, rim: [0, -1] };
}

// hospital room: pale cool day, big window, bed with rails, monitor with a heartbeat, flowers
export function hospital(g, t, cam, o = {}) {
  const M = mood(o.mood || 'day'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.35, color: '#7f93a8' });
    bigWindow(g, M, CX - 200, GY - 660, 620, 420, { cols: 3, rows: 2, sun: [CX + 260, GY - 520], seed: 71, glowA: 0.22, blinds: 0.25 });
    FX.godRays(g, CX + 100, GY - 450, { count: 8, angle: Math.PI * 0.6, spread: 0.5, len: 900, a: 0.06, t, color: M.key });
    const mx = CX + 640, my = GY - 480; rr(g, mx - 110, my - 70, 220, 140, 10); g.fillStyle = '#0a1410'; g.fill();
    g.strokeStyle = '#5fd39a'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60, ph = (u * 3 + t * 1.2) % 1, v = ph < 0.08 ? -Math.sin(ph / 0.08 * Math.PI) : 0; i ? g.lineTo(mx - 100 + u * 200, my + v * 40) : g.moveTo(mx - 100, my); } g.stroke(); glow(g, mx, my, 140, '#5fd39a', 0.2);
    seg(g, [[mx, my + 70], [mx, GY]], 6, '#2a2e36');
    if (o.door !== false) FX.door(g, { x: CX - 820, y: GY, w: 170, h: 380, color: shade('#7f93a8', -0.45) });
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: '#9aa4b0', lines: 'rgba(0,0,0,.08)' }); FX.pool(g, CX + 100, GY + 50, 700, 70, M.key, 0.2); });
  if (o.bed !== false) layer(g, cam, 1, (g) => {
    const bx = CX + (o.bedX ?? 120); rr(g, bx - 330, GY - 150, 660, 60, 14); g.fillStyle = '#e8eef4'; g.fill(); rr(g, bx - 330, GY - 170, 180, 40, 18); g.fillStyle = '#f6f8fa'; g.fill();
    g.fillStyle = '#5a6a7a'; g.fillRect(bx - 340, GY - 92, 680, 18); seg(g, [[bx - 320, GY - 74], [bx - 320, GY]], 8, '#3a4450'); seg(g, [[bx + 320, GY - 74], [bx + 320, GY]], 8, '#3a4450');
    seg(g, [[bx - 60, GY - 200], [bx + 300, GY - 200]], 6, alpha('#c8d0da', 0.9)); for (let k = 0; k < 6; k++) seg(g, [[bx - 40 + k * 60, GY - 200], [bx - 40 + k * 60, GY - 150]], 3, alpha('#c8d0da', 0.8));
    const vx = bx + 420; seg(g, [[vx, GY - 360], [vx, GY]], 4, '#2a2e36'); rr(g, vx - 60, GY - 260, 50, 80, 12); g.fillStyle = '#f2c21a'; g.fill(); circle(g, vx - 35, GY - 280, 22, '#d64a33'); circle(g, vx - 15, GY - 300, 18, '#f29ac0');
  });
  return { GY, CX, M, rim: [0.5, -0.8], bedTop: GY - 150 };
}

// music room: dusk window, grand piano silhouette, music stands
export function music(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.25 });
    bigWindow(g, M, CX - 120, GY - 660, 520, 420, { cols: 3, rows: 2, sun: [CX + 150, GY - 300], seed: 81, glowA: 0.2 });
    for (let i = 0; i < 4; i++) { g.fillStyle = shade(M.wall, -0.5); g.fillRect(CX - 900 + i * 110, GY - 560, 80, 110); }
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: '#4a2e2a' }); FX.pool(g, CX + 100, GY + 50, 700, 60, M.key, 0.24); });
  if (o.piano !== false) layer(g, cam, 1, (g) => {
    const px = CX + (o.pianoX ?? 200), c = '#0e0a10';
    g.beginPath(); g.moveTo(px - 300, GY - 230); g.lineTo(px + 220, GY - 230); g.quadraticCurveTo(px + 420, GY - 230, px + 360, GY - 120); g.lineTo(px - 300, GY - 120); g.closePath(); g.fillStyle = c; g.fill();
    poly(g, [[px - 280, GY - 232], [px + 120, GY - 470], [px + 140, GY - 456], [px - 230, GY - 232]], c); g.fillStyle = alpha(M.key, 0.25); g.fillRect(px - 300, GY - 232, 520, 4);
    for (let i = 0; i < 22; i++) { g.fillStyle = '#f2efe8'; g.fillRect(px - 300 + i * 14, GY - 130, 12, 26); } for (const lx of [px - 260, px + 300]) seg(g, [[lx, GY - 120], [lx, GY]], 10, c);
  });
  return { GY, CX, M, rim: [0.5, -0.8] };
}

// school fair at night: string lights, stalls, a stage board, crowd
export function fair(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H); FX.stars(g, 0, { area: [-E.W, -E.H, E.W * 3, E.H * 1.2], count: 100, seed: 8 }); });
  layer(g, cam, 0.4, (g) => FX.skyline(g, { x: -E.W * 1.5, y: GY - 160, w: E.W * 4, minH: 100, maxH: 360, color: mix(M.sky[0], '#05050c', 0.5), windowColor: alpha(M.practical, 0.6), lit: 0.2, seed: 18 }));
  layer(g, cam, 0.6, (g) => {
    for (let i = -3; i <= 3; i++) { const x = CX + i * 460; poly(g, [[x - 180, GY - 300], [x, GY - 400], [x + 180, GY - 300]], ['#c0392b', '#3a6ea5', '#d9a441'][((i % 3) + 3) % 3]); g.fillStyle = shade(M.wall, -0.4); g.fillRect(x - 170, GY - 300, 340, 200); g.fillStyle = alpha(M.practical, 0.6); g.fillRect(x - 150, GY - 280, 300, 60); }
    if (o.board !== false) { rr(g, CX - 380, GY - 700, 760, 230, 14); g.fillStyle = '#0c0c14'; g.fill(); text(g, o.digits || '3.14159265358979323846', CX, GY - 585, { size: 52, color: '#ffcf6a', font: FONTS.ui, weight: 900, spacing: 4, glow: 14 }); text(g, 'MEMORY CONTEST', CX, GY - 660, { size: 26, color: alpha('#f2efe8', 0.7), font: FONTS.ui, weight: 900, spacing: 6 }); }
    for (let k = 0; k < 3; k++) { g.strokeStyle = alpha('#2a2230', 0.9); g.lineWidth = 2; g.beginPath(); const y0 = GY - 760 + k * 60; for (let x = -E.W; x < E.W * 2; x += 20) { const y = y0 + Math.abs(Math.sin((x + k * 200) / 300)) * 70; x === -E.W ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
      for (let x = -E.W; x < E.W * 2; x += 70) { const y = y0 + Math.abs(Math.sin((x + k * 200) / 300)) * 70; circle(g, x, y + 6, 6, '#ffe7a0'); glow(g, x, y + 6, 30, '#ffcf6a', 0.4); } }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY - 20, 0, GY + 400, ['#2a2230', '#120d16']); g.fillRect(-E.W * 1.5, GY - 20, E.W * 4, E.H); FX.pool(g, CX, GY + 40, 800, 70, M.practical, 0.25);
    if (o.crowd !== false) FX.crowd(g, t, { x: -E.W * 0.4, y: GY + 120, w: E.W * 1.8, rows: 2, rowH: 50, size: 2.2, color: '#0c0910', seed: 12, cheer: o.cheer ?? 0.3 }); });
  return { GY, CX, M, rim: [0, -1] };
}

// Dr. Lee's clinic: cool, night window, light box with brain scans, a big scan monitor
export function clinic(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.2 });
    bigWindow(g, M, CX + 380, GY - 660, 460, 400, { night: true, moon: [CX + 700, GY - 600], cols: 3, rows: 2, seed: 91, glowA: 0.1 });
    rr(g, CX - 900, GY - 640, 760, 300, 10); g.fillStyle = '#dfefff'; g.fill(); glow(g, CX - 520, GY - 490, 500, '#cfe8ff', 0.25);
    for (let i = 0; i < 4; i++) scanHead(g, CX - 810 + i * 190, GY - 490, 70, t, { hot: o.hot ?? 0.4, seed: i });
    rr(g, CX - 80, GY - 600, 380, 260, 12); g.fillStyle = '#0a0e16'; g.fill(); scanHead(g, CX + 110, GY - 470, 100, t, { hot: o.hot ?? 0.6, dark: true }); glow(g, CX + 110, GY - 470, 260, '#5ff2e8', 0.18);
    for (const x of [CX - 500, CX + 300]) { seg(g, [[x, -E.H], [x, GY - 720]], 3, '#0e1018'); rr(g, x - 120, GY - 724, 240, 14, 6); g.fillStyle = '#e8f0ff'; g.fill(); glow(g, x, GY - 700, 360, '#cfe0ff', 0.25); }
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: shade(M.floor, 0.12) }); FX.pool(g, CX - 100, GY + 60, 700, 70, '#cfe0ff', 0.14); desk(g, CX + 520, GY + 30, 420, '#1e2030'); });
  return { GY, CX, M, rim: [0.5, -0.8] };
}
// a brain scan (top view): grey brain with glowing hot spots. hot 0..1
export function scanHead(g, x, y, r, t, o = {}) {
  g.fillStyle = o.dark ? '#1a2230' : '#9aa6b4'; g.beginPath(); g.ellipse(x, y, r * 0.8, r, 0, 0, 7); g.fill();
  g.strokeStyle = o.dark ? '#3a4a5a' : '#6a7684'; g.lineWidth = Math.max(2, r * 0.03); seg(g, [[x, y - r], [x, y + r]], Math.max(2, r * 0.04), g.strokeStyle);
  for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x + (i % 2 ? 1 : -1) * r * 0.4, y - r * 0.6 + i * r * 0.24, r * 0.18, 0.3, Math.PI - 0.3); g.stroke(); }
  const rr2 = rng(o.seed ?? 1), n = Math.round(12 * (o.hot ?? 0.5));
  for (let i = 0; i < n; i++) { const a = rr2() * 6.28, d = rr2() * 0.75, px = x + Math.cos(a) * r * 0.7 * d, py = y + Math.sin(a) * r * 0.9 * d, k = 0.6 + 0.4 * Math.sin(t * 3 + i);
    glow(g, px, py, r * 0.35, i % 3 ? '#ffb02a' : '#ff4a3a', 0.55 * k); circle(g, px, py, r * 0.06, '#fff3c0'); }
  if (o.spot) { const k = 0.6 + 0.4 * Math.sin(t * 4); glow(g, x + r * 0.25, y - r * 0.2, r * 0.5, '#5ff2e8', 0.9 * k); circle(g, x + r * 0.25, y - r * 0.2, r * 0.08, '#e8fbff'); }
}

// balcony at dusk: railing in the foreground, city below
export function balcony(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY + 200, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H + 400); FX.sun(g, CX - 500, GY - 200, 70, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - 700, h: 200, color: '#ffd8c0', a: 0.12, seed: 3 }); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W * 1.5, y: GY + 220, w: E.W * 4, minH: 200, maxH: 620, color: mix(M.sky[M.sky.length - 1], '#0d0a12', 0.6), windowColor: alpha(M.practical, 0.6), lit: 0.25, seed: 33 }));
  layer(g, cam, 0.85, (g) => { g.fillStyle = shade(M.wall, -0.5); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H); g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W * 1.5, GY, E.W * 4, 10); g.fillStyle = shade(M.wall, -0.35); g.fillRect(CX + 260, -E.H, E.W * 2, GY + E.H); FX.door(g, { x: CX + 520, y: GY, w: 200, h: 420, color: shade(M.wall, -0.6), open: 0.3 }); });
  return { GY, CX, M, rim: [-0.7, -0.6] };
}
// railing drawn in front of characters (depth 1.1)
export function railing(g, cam, GY, CX) { layer(g, cam, 1.1, (g) => { const c = '#120d14'; seg(g, [[-E.W, GY - 150], [CX + 260, GY - 150]], 12, c); for (let x = -E.W; x < CX + 260; x += 60) seg(g, [[x, GY - 150], [x, GY]], 5, c); }); }
