// sets/story2.js — locations new to "Win Every Argument": hotel lobby (night, chandeliers, black car outside),
// football pitch (dusk floodlights), city council chamber, TV studio (live show), bus stop, office (summer job).
import { E, V, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, rng, FONTS } from '/engine/core.js';
import { ground, bigWindow, wallClock, floor, wall, table, desk, label, shelfBooks, FX } from './_kit.js';
import { car } from './city.js';

// hotel lobby: warm marble, two chandeliers, tall night windows with the black car waiting outside, reception, low table
export function lobby(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.32, color: '#7a5644' });
    // tall windows to the night street
    for (const wx of [CX - 1050, CX - 560]) {
      bigWindow(g, M, wx, GY - 760, 400, 640, { sky: ['#0a0c1c', '#1a1f3a', '#2a2a48'], night: true, cols: 2, rows: 3, seed: 31 + wx, glowA: 0.05, glowC: '#8fa0ff' });
    }
    // the black car outside (through the window), engine running: exhaust puffs
    if (o.car !== false) { g.save(); g.beginPath(); g.rect(CX - 1050, GY - 760, 890, 640); g.clip(); car(g, CX - 700, GY - 150, 1.1, '#0c0c12', 1, { lights: true });
      for (let i = 0; i < 4; i++) { const ph = (t * 0.5 + i / 4) % 1; circle(g, CX - 960 - ph * 120, GY - 190 - ph * 30, 14 + ph * 30, alpha('#c8cce0', 0.18 * (1 - ph))); } g.restore(); }
    // pilasters + gold trim
    for (const px of [CX - 1120, CX - 610, CX - 120, CX + 520, CX + 1100]) { g.fillStyle = shade('#6a4a3a', -0.25); g.fillRect(px - 30, -E.H, 60, GY + E.H); g.fillStyle = alpha('#d9a441', 0.35); g.fillRect(px - 30, GY - 790, 60, 10); }
    // reception desk + key wall + sign
    g.fillStyle = shade('#6a4a3a', -0.5); g.fillRect(CX + 200, GY - 640, 760, 360); for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { rr(g, CX + 240 + i * 120, GY - 600 + j * 100, 70, 70, 6); g.fillStyle = shade('#6a4a3a', -0.35); g.fill(); circle(g, CX + 275 + i * 120, GY - 565 + j * 100, 6, alpha('#d9a441', 0.6)); }
    text(g, 'GRAND HOTEL', CX + 580, GY - 690, { size: 40, color: alpha('#f2d9a0', 0.55), font: FONTS.title, weight: 700, spacing: 10 });
    FX.counter(g, { x: CX + 580, y: GY, w: 820, h: 150, color: '#3a2418', top: '#8a6a3a', doors: 0 });
    // chandeliers
    for (const [cx, cy] of [[CX - 300, GY - 820], [CX + 500, GY - 860]]) { seg(g, [[cx, -E.H], [cx, cy - 40]], 3, '#1a1210'); glow(g, cx, cy, 340, M.practical, 0.45);
      for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2 + t * 0.05; circle(g, cx + Math.cos(a) * 70, cy + Math.sin(a) * 18, 8, '#fff1c8'); } circle(g, cx, cy, 22, '#ffe7b0'); }
    // potted palm
    for (let i = 0; i < 7; i++) { g.save(); g.translate(CX - 40, GY - 150); g.rotate(-1.2 + i * 0.4); g.fillStyle = '#1d3326'; g.beginPath(); g.ellipse(0, -110, 26, 110, 0, 0, 7); g.fill(); g.restore(); }
    rr(g, CX - 90, GY - 150, 100, 150, 14); g.fillStyle = '#2a1a14'; g.fill();
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: '#7a5a46', lines: 'rgba(0,0,0,.12)' }); FX.pool(g, CX - 300, GY + 60, 700, 70, M.key, 0.22); FX.pool(g, CX + 500, GY + 40, 500, 60, M.practical, 0.18); });
  if (o.table !== false) layer(g, cam, 1, (g) => { const top = table(g, o.tx ?? CX, GY, 420, 120, '#2a1810');
    if (o.envelope !== false) { g.save(); g.translate((o.tx ?? CX) - 90, top - 6); g.rotate(-0.06); g.fillStyle = '#e8dcc0'; g.fillRect(-60, -10, 120, 16); g.restore(); }
    if (o.folder !== false) { g.save(); g.translate((o.tx ?? CX) + 70, top - 6); g.fillStyle = '#121016'; g.fillRect(-80, -8, 160, 12); g.restore(); } });
  return { GY, CX, M, rim: [-0.7, -0.6] };
}

// football pitch: dusk sky, floodlight towers, goal, bench, stand of fans
export function pitch(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H); FX.sun(g, CX + 500, GY - 220, 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.3, (g) => { FX.hills(g, { y: GY - 160, color: mix(M.sky[0], '#0a0812', 0.6), seed: 3 }); });
  layer(g, cam, 0.5, (g) => {
    // stand with crowd
    g.fillStyle = shade(M.wall, -0.55); g.fillRect(-E.W * 1.5, GY - 330, E.W * 4, 230);
    FX.crowd(g, t, { x: -E.W, y: GY - 310, w: E.W * 3, rows: 6, rowH: 34, size: 2.2, color: shade(M.wall, -0.75), seed: 5, cheer: o.cheer || 0 });
    for (const fx of [CX - 900, CX + 900]) { seg(g, [[fx, GY - 100], [fx, GY - 900]], 14, '#120e18'); rr(g, fx - 90, GY - 980, 180, 90, 8); g.fillStyle = '#1a1620'; g.fill();
      for (let i = 0; i < 6; i++) circle(g, fx - 70 + (i % 3) * 70, GY - 955 + Math.floor(i / 3) * 40, 14, '#fff6d8'); glow(g, fx, GY - 940, 420, '#fff3d6', 0.35); FX.lightCone(g, fx, GY - 900, { angle: Math.PI / 2, spread: 0.35, len: 900, color: '#fff3d6', a: 0.1 }); }
  });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 100, 0, GY + 400, [shade(M.grass || '#3a6a3a', -0.1), shade(M.grass || '#3a6a3a', -0.55)]); g.fillRect(-E.W * 1.5, GY - 100, E.W * 4, E.H * 2);
    for (let x = -E.W; x < E.W * 2.5; x += 300) { g.fillStyle = alpha('#000', 0.06); g.fillRect(x, GY - 100, 150, E.H * 2); }
    g.fillStyle = alpha('#f2efe8', 0.4); g.fillRect(-E.W * 1.5, GY - 60, E.W * 4, 6);
    if (o.goal !== false) { const gx = CX + 520, gy = GY - 40; g.strokeStyle = '#f2efe8'; g.lineWidth = 10; g.beginPath(); g.moveTo(gx - 260, gy); g.lineTo(gx - 260, gy - 260); g.lineTo(gx + 260, gy - 260); g.lineTo(gx + 260, gy); g.stroke();
      g.strokeStyle = alpha('#f2efe8', 0.15); g.lineWidth = 2; for (let i = -240; i <= 240; i += 40) { g.beginPath(); g.moveTo(gx + i, gy - 250); g.lineTo(gx + i * 0.9, gy); g.stroke(); } }
    if (o.bench) { rr(g, CX - 860, GY - 70, 380, 20, 6); g.fillStyle = '#2a2030'; g.fill(); seg(g, [[CX - 840, GY - 50], [CX - 840, GY]], 8, '#2a2030'); seg(g, [[CX - 500, GY - 50], [CX - 500, GY]], 8, '#2a2030'); }
  });
  return { GY, CX, M, rim: [0.6, -0.7] };
}

// city council chamber: wood panels, curved dais with members, flag, tall windows, a podium for Max
export function council(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.4, color: '#5a3a2a' });
    for (const wx of [CX - 1000, CX + 620]) bigWindow(g, M, wx, GY - 760, 360, 560, { sun: [wx + 180, GY - 380], cols: 2, rows: 3, seed: 21, glowA: 0.16 });
    text(g, o.sign || 'CITY COUNCIL', CX, GY - 720, { size: 46, color: alpha('#f2d9a0', 0.5), font: FONTS.title, weight: 700, spacing: 14 });
    ring(g, CX, GY - 560, 90, 10, alpha('#d9a441', 0.5)); text(g, '★', CX, GY - 556, { size: 70, color: alpha('#d9a441', 0.5) });
    // dais
    g.fillStyle = '#3a2418'; g.fillRect(CX - 760, GY - 300, 1520, 300); g.fillStyle = '#6a4a2a'; g.fillRect(CX - 780, GY - 316, 1560, 22);
    for (let i = 0; i < 11; i++) { const x = CX - 700 + i * 140, s = 0.55; circle(g, x, GY - 400, 26 * s * 1.4, '#120d10'); g.fillStyle = '#120d10'; g.beginPath(); g.ellipse(x, GY - 316, 40, 60, 0, Math.PI, Math.PI * 2); g.fill();
      if (o.vote) { const k = Math.max(0, Math.min(1, (t - o.vote - i * 0.12) / 0.25)); if (k > 0) { seg(g, [[x + 22, GY - 330], [x + 30, GY - 420 * k - 330 * (1 - k)]], 9, '#120d10'); circle(g, x + 30, GY - 420 * k - 330 * (1 - k), 12, '#120d10'); } } }
    for (let i = 0; i < 11; i++) { rr(g, CX - 720 + i * 140, GY - 300 + 40, 40, 30, 4); g.fillStyle = alpha('#fff1c8', 0.25); g.fill(); }
    // flag
    seg(g, [[CX + 880, GY], [CX + 880, GY - 640]], 6, '#d9a441'); poly(g, [[CX + 884, GY - 630], [CX + 1060, GY - 600 + Math.sin(t * 2) * 8], [CX + 1060, GY - 480 + Math.sin(t * 2 + 1) * 8], [CX + 884, GY - 510]], '#3a6ea5');
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: '#4a2e24' }); FX.pool(g, CX, GY + 60, 800, 70, M.key, 0.22); });
  if (o.podium !== false) layer(g, cam, 1.04, (g) => { const px = CX + (o.px ?? 0); poly(g, [[px - 90, GY + 30], [px + 90, GY + 30], [px + 70, GY - 150], [px - 70, GY - 150]], '#2a1810'); rr(g, px - 100, GY - 170, 200, 24, 6); g.fillStyle = '#4a3020'; g.fill(); seg(g, [[px + 30, GY - 170], [px + 60, GY - 250]], 4, '#120d10'); circle(g, px + 62, GY - 256, 10, '#120d10'); });
  return { GY, CX, M, rim: [0.5, -0.8] };
}

// TV studio: dark, purple-blue, a hosts' desk, big LED wall with the show logo, studio lights, LIVE sign
export function studio(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = '#0a0812'; g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    for (let i = -6; i <= 6; i++) { const x = CX + i * 260; seg(g, [[x, -E.H], [x, GY - 840]], 3, '#1a1622'); rr(g, x - 40, GY - 860, 80, 50, 8); g.fillStyle = '#16121e'; g.fill(); glow(g, x, GY - 820, 140, i % 2 ? '#8a5ad6' : '#5ff2e8', 0.25); }
    // LED wall
    rr(g, CX - 760, GY - 760, 1520, 520, 16); g.fillStyle = '#120e24'; g.fill(); const gr = g.createLinearGradient(CX - 740, 0, CX + 740, 0); gr.addColorStop(0, '#3a1a5a'); gr.addColorStop(0.5, '#1a2a6a'); gr.addColorStop(1, '#3a1a5a'); g.fillStyle = gr; g.fillRect(CX - 740, GY - 740, 1480, 480);
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2 + t * 0.2; seg(g, [[CX, GY - 500], [CX + Math.cos(a) * 900, GY - 500 + Math.sin(a) * 300]], 2, alpha('#9fb6ff', 0.08)); }
    text(g, o.logo || 'THE BIG DEBATE', CX, GY - 500, { size: 96, color: '#f2efe8', glow: 30, glowColor: alpha('#8a5ad6', 0.8), font: FONTS.title, weight: 700, spacing: 10 });
    glow(g, CX, GY - 500, 900, '#6a5aff', 0.2);
    // LIVE sign
    rr(g, CX + 820, GY - 760, 180, 70, 12); g.fillStyle = '#2a0a0a'; g.fill(); const on = (t % 1.2) < 0.9; text(g, 'LIVE', CX + 910, GY - 724, { size: 40, color: on ? '#ff4a3a' : '#5a1a1a', font: FONTS.ui, weight: 900, glow: on ? 20 : 0, glowColor: '#ff4a3a' });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#1a1428', '#08060e']); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); FX.pool(g, CX, GY + 60, 900, 80, '#8a5ad6', 0.25); });
  if (o.desk !== false) layer(g, cam, 1.05, (g) => { poly(g, [[CX - 520, GY + 20], [CX + 520, GY + 20], [CX + 480, GY - 120], [CX - 480, GY - 120]], '#1e1a30'); g.fillStyle = alpha('#5ff2e8', 0.6); g.fillRect(CX - 480, GY - 120, 960, 6); });
  return { GY, CX, M, rim: [0, -1] };
}

// bus stop: day street with a shelter and a timetable board
export function busstop(g, t, cam, o = {}) {
  const M = mood(o.mood || 'day'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H); FX.clouds(g, { y: GY - 700, seed: 2, color: alpha('#ffffff', 0.5) }); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W * 1.5, y: GY - 160, w: E.W * 4, minH: 120, maxH: 420, color: mix(M.sky[M.sky.length - 1], '#3a3550', 0.55), windowColor: alpha('#ffffff', 0.2), lit: 0.1, seed: 8 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.road || '#4a4a58', -0.1); g.fillRect(-E.W * 1.5, GY - 40, E.W * 4, E.H); g.fillStyle = '#8a8496'; g.fillRect(-E.W * 1.5, GY - 40, E.W * 4, 40); for (const x of [CX - 700, CX + 800]) FX.tree(g, x, GY - 30, 2, '#2a3a2a'); });
  layer(g, cam, 0.95, (g) => {
    const sx = CX - 180; g.fillStyle = alpha('#cfe4ff', 0.18); g.fillRect(sx - 300, GY - 420, 600, 380); g.fillStyle = '#2a2a36'; g.fillRect(sx - 320, GY - 440, 640, 30); seg(g, [[sx - 300, GY - 410], [sx - 300, GY]], 10, '#2a2a36'); seg(g, [[sx + 300, GY - 410], [sx + 300, GY]], 10, '#2a2a36');
    rr(g, sx - 220, GY - 140, 440, 20, 6); g.fillStyle = '#3a3446'; g.fill();
    const bx = sx + 420; seg(g, [[bx, GY], [bx, GY - 520]], 8, '#2a2a36'); rr(g, bx - 90, GY - 640, 180, 140, 10); g.fillStyle = '#f2efe8'; g.fill(); circle(g, bx, GY - 570, 46, '#3a6ea5'); text(g, 'BUS', bx, GY - 568, { size: 32, color: '#fff', font: FONTS.ui, weight: 900 });
  });
  return { GY, CX, M, rim: [0.6, -0.8] };
}

// small office: blinds window, desk with a monitor, a plant (summer job interview, phone agent)
export function office(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.3 });
    bigWindow(g, M, CX - 820, GY - 680, 620, 440, { sky: ['#9fc0e8', '#d8e8f8'], blinds: 0.45, cols: 3, rows: 2, seed: 44, glowA: 0.16 });
    shelfBooks(g, CX + 360, GY - 540, 560, 5); shelfBooks(g, CX + 360, GY - 400, 560, 9);
    wallClock(g, CX + 120, GY - 600, 44, t, { time: 10.25 * 3600 + t });
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: '#5a5a6a' }); FX.pool(g, CX - 400, GY + 50, 600, 60, M.key, 0.2); });
  if (o.desk !== false) layer(g, cam, 1, (g) => { const top = desk(g, CX + (o.dx ?? 0), GY, 420, '#2a2a36'); rr(g, CX + (o.dx ?? 0) - 70, top - 110, 140, 90, 8); g.fillStyle = '#121620'; g.fill(); glow(g, CX + (o.dx ?? 0), top - 65, 160, '#9fd8ff', 0.3); });
  return { GY, CX, M, rim: [-0.7, -0.6] };
}
