// sets/city.js — City University lab (interiorCool, monitors + night window) and the street (night/dusk, lamps, road, house gate).
import { E, V, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { ground, bigWindow, wallClock, floor, wall, desk, label, FX } from './_kit.js';

export function lab(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    wall(g, M, GY, { k: -0.2 });
    bigWindow(g, M, CX + 260, GY - 660, 560, 420, { night: true, moon: [CX + 700, GY - 600], cols: 4, rows: 2, seed: 31, glowA: 0.1 });
    // whiteboard with formulas
    rr(g, CX - 900, GY - 640, 900, 380, 10); g.fillStyle = '#d8dde6'; g.fill(); g.fillStyle = '#eef1f6'; g.fillRect(CX - 888, GY - 628, 876, 356);
    const eq = o.board || ['v = d / t', 'E = ½mv²', 'P ≈ 20 W', 'Δt = 0.025 s'];
    eq.forEach((s, i) => text(g, s, CX - 840 + (i % 2) * 430, GY - 560 + Math.floor(i / 2) * 120, { size: 46, color: i % 3 === 2 ? '#c0392b' : '#2a3a5a', font: FONTS.title, weight: 600, align: 'left' }));
    seg(g, [[CX - 860, GY - 340], [CX - 700, GY - 420], [CX - 560, GY - 380], [CX - 380, GY - 460], [CX - 120, GY - 330]], 4, '#3a6ea5');
    for (let i = 0; i < 3; i++) FX.screen(g, { x: CX - 760 + i * 260, y: GY - 230, w: 200, h: 120, glowC: M.practical, a: 0.18 }, (g, x, y, w, h) => { seg(g, Array.from({ length: 20 }, (_, k) => [x + k * w / 19, y + h * 0.5 + Math.sin(k * 0.9 + t * 3 + i) * h * 0.3]), 3, M.practical); });
    for (const x of [CX - 500, CX + 300]) { seg(g, [[x, -E.H], [x, GY - 720]], 3, '#0e1018'); rr(g, x - 120, GY - 724, 240, 14, 6); g.fillStyle = '#e8f0ff'; g.fill(); glow(g, x, GY - 700, 360, '#cfe0ff', 0.25); }
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: shade(M.floor, 0.1) }); FX.pool(g, CX - 100, GY + 60, 700, 70, '#cfe0ff', 0.12); desk(g, CX - 520, GY + 30, 520, '#1e2030'); });
  return { GY, CX, M, rim: [0.5, -0.8] };
}

export function car(g, x, GY, s = 1, color = '#7c818c', facing = 1, o = {}) {
  g.save(); g.translate(x, GY); g.scale(s * facing, s);
  rr(g, -210, -110, 420, 80, 30); g.fillStyle = color; g.fill(); poly(g, [[-120, -110], [-70, -180], [90, -180], [150, -110]], color);
  poly(g, [[-104, -112], [-62, -168], [10, -168], [10, -112]], alpha('#0e1220', 0.85)); poly(g, [[22, -112], [22, -168], [84, -168], [130, -112]], alpha('#0e1220', 0.85));
  g.fillStyle = alpha('#ffffff', 0.15); g.fillRect(-200, -100, 400, 6);
  for (const wx of [-120, 130]) { circle(g, wx, -30, 38, '#0c0c12'); circle(g, wx, -30, 16, '#5a5a66'); }
  if (o.lights !== false) { circle(g, 200, -84, 10, '#fff6d8'); g.restore(); if (o.lights !== false) { g.save(); g.translate(x, GY); g.scale(s * facing, s); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,240,200,.12)'; g.beginPath(); g.moveTo(205, -84); g.lineTo(760, -150); g.lineTo(760, 20); g.closePath(); g.fill(); } }
  circle(g, -205, -84, 9, '#ff4a3a'); g.restore();
}

export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H); FX.stars(g, 0, { area: [-E.W, -E.H, E.W * 3, E.H * 1.2], count: 120, seed: 4 }); if (o.mood !== 'dusk') FX.moon(g, CX - 520, GY - 760, 40); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W * 1.5, y: GY - 200, w: E.W * 4, minH: 120, maxH: 480, color: mix(M.sky[0], '#05050c', 0.4), windowColor: alpha(M.practical, 0.7), lit: 0.25, seed: 14 }));
  layer(g, cam, 0.55, (g) => {
    for (let i = -4; i <= 4; i++) FX.facade(g, { x: CX + i * 380 - 170, y: GY - 120, w: 340, h: 420 + ((i * 53) % 3) * 70, color: shade(M.wall, -0.15 - (i % 2) * 0.08), win: M.practical, dark: shade(M.wall, -0.55), cols: 3, rows: 3, lit: 0.45, seed: 40 + i });
    g.fillStyle = shade(M.road, -0.2); g.fillRect(-E.W * 1.5, GY - 120, E.W * 4, 40);
  });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 80, 0, GY + 300, [shade(M.road, 0.05), shade(M.road, -0.4)]); g.fillRect(-E.W * 1.5, GY - 80, E.W * 4, E.H);
    for (let x = -E.W; x < E.W * 2.5; x += 260) { g.fillStyle = alpha('#f2efe8', 0.35); g.fillRect(x, GY - 10, 130, 8); }
    if (o.crosswalk !== false) for (let k = 0; k < 7; k++) poly(g, [[CX + 200 + k * 60, GY - 78], [CX + 236 + k * 60, GY - 78], [CX + 236 + k * 90 + 20, GY + 120], [CX + 200 + k * 90 + 20, GY + 120]], alpha('#f2efe8', 0.18));
  });
  layer(g, cam, 0.92, (g) => {
    for (const x of [CX - 760, CX + 40, CX + 840]) FX.lampPost(g, x, GY + 140, 520, { light: M.practical, a: 0.16 });
    // traffic light
    const lx = CX + 560, ly = GY + 140; seg(g, [[lx, ly], [lx, ly - 470]], 9, '#15121c'); rr(g, lx - 28, ly - 600, 56, 150, 12); g.fillStyle = '#121018'; g.fill();
    const col = o.light || 'red'; [['red', '#ff3a2a'], ['amber', '#ffb02a'], ['green', '#3aff8a']].forEach(([n, c], i) => { circle(g, lx, ly - 570 + i * 46, 17, n === col ? c : alpha(c, 0.15)); if (n === col) glow(g, lx, ly - 570 + i * 46, 120, c, 0.6); });
    // house gate (Max's home) on the left
    if (o.gate) { for (let k = 0; k < 14; k++) { const x = CX - 1100 + k * 34; poly(g, [[x, GY + 140], [x, GY + 40], [x + 11, GY + 26], [x + 22, GY + 40], [x + 22, GY + 140]], '#d8d0c4'); } g.fillStyle = '#d8d0c4'; g.fillRect(CX - 1100, GY + 70, 470, 10); }
    FX.pool(g, CX + 40, GY + 150, 300, 40, M.practical, 0.3);
  });
  return { GY: GY + 140, CX, M, rim: [0.4, -1] };
}
