// sets/school.js — school interiors (classroom / canteen / library / chess club) + gym + track.
// One row of tall windows is the key light; walls in shadow. Variants share the shell so continuity holds.
import { E, V, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { ground, bigWindow, wallClock, floor, wall, desk, label, shelfBooks, FX } from './_kit.js';

function windowsRow(g, M, GY, CX, o = {}) {
  for (const i of o.at || [-2, -1, 1, 2]) bigWindow(g, M, CX + i * 420 - 150, GY - 660, 300, 430, { cols: 2, rows: 3, sun: i === (o.sunAt ?? 1) && !o.noSun ? [CX + i * 420, GY - 520] : null, sunR: 34, seed: 20 + i, glowA: 0.1, night: o.night });
}
function blackboard(g, M, x, y, w, h, o = {}) {
  rr(g, x - 12, y - 12, w + 24, h + 24, 8); g.fillStyle = '#3a2a22'; g.fill(); g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#24402f', '#1b3326']); g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 6; i++) g.fillRect(x + 40 + i * 140, y + 30 + (i % 3) * 30, 90, 18);
  if (o.lines) o.lines.forEach((ln, i) => text(g, ln, x + 40, y + 70 + i * 64, { size: 44, color: alpha('#f2f0e6', 0.85), font: FONTS.title, weight: 600, align: 'left', alpha: o.reveal ? Math.min(1, Math.max(0, o.reveal * o.lines.length - i)) : 1 }));
}

export function school(g, t, cam, o = {}) {
  const kind = o.kind || 'class', M = mood(o.mood || 'interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.2 });
    g.fillStyle = shade(M.wall, -0.5); g.fillRect(-E.W * 1.5, GY - 180, E.W * 4, 180);     // wainscot
    if (kind === 'class' || kind === 'exam' || kind === 'chess') {
      windowsRow(g, M, GY, CX, { at: [-3, 2, 3], sunAt: 2 });
      blackboard(g, M, CX - 520, GY - 600, 900, 330, { lines: o.board, reveal: o.reveal });
      wallClock(g, CX + 520, GY - 600, 52, t, { time: o.clock ?? (9 * 3600 + t * (o.clockSpeed ?? 1)) });
      if (kind === 'chess') { g.fillStyle = '#1e1a28'; g.fillRect(CX - 600, GY - 680, 1100, 40); label(g, 'CHESS CLUB', CX - 50, GY - 660, 26, M.practical, 0.9); }
    } else if (kind === 'canteen') {
      windowsRow(g, M, GY, CX, { at: [-2, -1, 1, 2], sunAt: -1 });
      FX.counter(g, { x: CX + 420, y: GY, w: 1200, h: 130, color: shade(M.wall, -0.55), top: '#b9b2bd', doors: 6 });
      for (let i = 0; i < 5; i++) { const x = CX + 480 + i * 140; rr(g, x, GY - 160, 110, 26, 6); g.fillStyle = '#c9c0b0'; g.fill(); }
      for (const x of [CX - 600, CX, CX + 600]) { seg(g, [[x, -E.H], [x, GY - 700]], 3, '#120d14'); circle(g, x, GY - 690, 26, '#1a1418'); glow(g, x, GY - 680, 260, M.practical, 0.4); }
    } else if (kind === 'library') {
      for (let i = -4; i <= 4; i++) { const x = CX + i * 300 - 130; g.fillStyle = shade(M.wall, -0.55); g.fillRect(x, GY - 680, 260, 680); for (let j = 0; j < 5; j++) { g.fillStyle = shade(M.wall, -0.7); g.fillRect(x + 8, GY - 660 + j * 130 + 110, 244, 10); shelfBooks(g, x + 12, GY - 660 + j * 130 + 110, 236, i * 7 + j * 3 + 20); } }
      bigWindow(g, M, CX - 170, GY - 680, 340, 460, { cols: 2, rows: 3, sun: [CX + 40, GY - 560], sunR: 40, glowA: 0.2 });
      FX.godRays(g, CX, GY - 450, { count: 8, angle: Math.PI * 0.55, spread: 0.5, len: 800, a: 0.06, t, color: M.key });
    }
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: shade(M.floor, 0.08) }); FX.pool(g, CX, GY + 60, 700, 70, M.key, 0.14); });
  return { GY, CX, M, rim: [0.3, -1] };
}
// classroom desks in front of the characters (call after characters, at depth 1.0-1.2)
export function schoolDesk(g, x, GY, s = 1) { const c = '#2a2030'; rr(g, x - 90 * s, GY - 118 * s, 180 * s, 14 * s, 4 * s); g.fillStyle = c; g.fill(); seg(g, [[x - 74 * s, GY - 106 * s], [x - 74 * s, GY]], 6 * s, c); seg(g, [[x + 74 * s, GY - 106 * s], [x + 74 * s, GY]], 6 * s, c); return GY - 118 * s; }

export function gym(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.15 });
    for (let i = -4; i <= 4; i++) bigWindow(g, M, CX + i * 300 - 100, GY - 760, 200, 110, { cols: 2, rows: 1, city: false, glowA: 0.06 });
    // bleachers
    for (let j = 0; j < 5; j++) { g.fillStyle = shade(M.wall, -0.45 - j * 0.04); g.fillRect(-E.W, GY - 60 - j * 50, E.W * 1.25 + CX - 500, 50); }
    FX.crowd(g, t, { x: -E.W * 0.3, y: GY - 80, w: E.W * 0.9, rows: 4, rowH: 50, size: 1.6, color: shade(M.wall, -0.2), seed: 5, cheer: o.cheer || 0 });
    // hoop
    const hx = CX + 640; g.fillStyle = '#e8ecf4'; g.fillRect(hx - 90, GY - 620, 180, 120); g.strokeStyle = '#e04a3a'; g.lineWidth = 5; g.strokeRect(hx - 40, GY - 580, 80, 60);
    ring(g, hx, GY - 500, 42, 6, '#ff7a3a'); for (let i = -3; i <= 3; i++) seg(g, [[hx + i * 12, GY - 498], [hx + i * 8, GY - 430]], 2, alpha('#ffffff', 0.6));
    seg(g, [[hx, GY - 620], [hx, -E.H]], 10, '#1a1e2c');
    for (const x of [CX - 600, CX, CX + 600]) { glow(g, x, GY - 800, 320, M.practical, 0.5); circle(g, x, GY - 800, 22, '#f2f8ff'); }
  });
  layer(g, cam, 0.9, (g) => {
    floor(g, M, GY, { color: '#7a5a3a', lines: 'rgba(0,0,0,.15)' });
    g.strokeStyle = alpha('#f2efe8', 0.5); g.lineWidth = 4; g.beginPath(); g.ellipse(CX, GY + 120, 300, 60, 0, 0, 7); g.stroke(); seg(g, [[CX, GY], [CX, GY + 400]], 4, alpha('#f2efe8', 0.5));
    FX.pool(g, CX, GY + 60, 800, 80, M.practical, 0.18);
  });
  return { GY, CX, M, rim: [0, -1] };
}

export function track(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H); FX.sun(g, CX + 420, GY - 520, 60, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - 760, h: 160, color: '#ffe7c7', a: 0.14, seed: 4 }); });
  layer(g, cam, 0.45, (g) => {
    // stands + floodlight rigs
    poly(g, [[-E.W * 1.5, GY - 120], [E.W * 2.5, GY - 120], [E.W * 2.5, GY - 380], [-E.W * 1.5, GY - 300]], shade(M.wall, -0.4));
    FX.crowd(g, t, { x: -E.W * 0.6, y: GY - 330, w: E.W * 2.2, rows: 7, rowH: 30, size: 1.2, color: shade(M.wall, -0.1), seed: 9, cheer: o.cheer ?? 0.4, flags: 0.03 });
    for (const x of [CX - 800, CX + 900]) { seg(g, [[x, GY - 120], [x, GY - 760]], 10, '#1a1418'); g.fillStyle = '#1a1418'; g.fillRect(x - 70, GY - 800, 140, 50); for (let k = 0; k < 4; k++) { circle(g, x - 50 + k * 34, GY - 775, 11, '#fff6e0'); } glow(g, x, GY - 775, 260, M.practical, 0.35); }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 120, 0, GY + 400, ['#a8483a', '#7a3028', shade(M.dark, -0.2)]); g.fillRect(-E.W * 1.5, GY - 120, E.W * 4, E.H * 2);
    for (let k = 0; k < 6; k++) { const y = GY - 110 + k * 50 + k * k * 6; seg(g, [[-E.W, y], [E.W * 3, y]], 3, alpha('#f2efe8', 0.55)); }
    seg(g, [[CX - 300, GY - 120], [CX - 420, GY + 400]], 6, alpha('#f2efe8', 0.8));
  });
  return { GY, CX, M, rim: [0.6, -0.6] };
}
