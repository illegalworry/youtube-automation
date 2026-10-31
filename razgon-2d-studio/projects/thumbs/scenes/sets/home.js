// sets/home.js — Max's home: kitchen (morning / evening) and bedroom (night).
// Kitchen: the big window behind the table is the key light; figures sit in front of it. Bedroom: moon window + desk lamp + laptop.
import { E, V, mood, layer, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { ground, bigWindow, wallClock, floor, wall, table, desk, FX } from './_kit.js';

export function kitchen(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = ground(), CX = E.W / 2, eve = o.mood === 'dusk' || o.mood === 'night';
  layer(g, cam, 0.55, (g) => {
    wall(g, M, GY);
    // window behind the table
    bigWindow(g, M, CX - 430, GY - 640, 640, 420, { sun: eve ? null : [CX - 170, GY - 330], moon: o.mood === 'night' ? [CX - 250, GY - 540] : null, night: o.mood === 'night', cols: 3, rows: 2, seed: 4, glowA: eve ? 0.1 : 0.18 });
    // fridge with drawings (left)
    rr(g, CX - 980, GY - 470, 210, 470, 16); g.fillStyle = shade(M.wall, 0.05); g.fill(); g.fillStyle = alpha('#000', 0.25); g.fillRect(CX - 980, GY - 300, 210, 4);
    for (const [dx, dy, c] of [[30, 90, '#f2c21a'], [110, 70, '#f29ac0'], [60, 190, '#7fb8e8']]) { g.save(); g.translate(CX - 980 + dx, GY - 470 + dy); g.rotate((dx % 7 - 3) * 0.03); g.fillStyle = '#efe6d6'; g.fillRect(0, 0, 70, 58); seg(g, [[10, 40], [25, 18], [40, 36], [58, 14]], 4, c); g.restore(); }
    // counter + cabinets (right)
    const cx0 = CX + 330, cw = 1300;
    g.fillStyle = shade(M.wall, -0.45); g.fillRect(cx0, GY - 640, cw, 170); for (let x = cx0; x < cx0 + cw; x += 160) { g.strokeStyle = alpha('#000', 0.35); g.lineWidth = 3; g.strokeRect(x + 8, GY - 630, 144, 150); circle(g, x + 140, GY - 500, 5, alpha(M.practical, 0.5)); }
    FX.counter(g, { x: cx0, y: GY, w: cw, h: 150, color: shade(M.wall, -0.5), top: shade(M.wall, -0.15), doors: 8 });
    // toaster + kettle
    const tx = CX + 470, ty = GY - 150; rr(g, tx - 60, ty - 74, 120, 74, 18); g.fillStyle = '#b9b2bd'; g.fill(); g.fillStyle = alpha('#fff', 0.35); g.fillRect(tx - 48, ty - 66, 96, 6);
    g.fillStyle = '#2a2230'; g.fillRect(tx - 36, ty - 76, 28, 6); g.fillRect(tx + 8, ty - 76, 28, 6);
    const kx = CX + 700; poly(g, [[kx - 46, ty], [kx - 36, ty - 90], [kx + 36, ty - 90], [kx + 46, ty]], '#3a5a7a'); seg(g, [[kx + 40, ty - 70], [kx + 70, ty - 50], [kx + 46, ty - 20]], 7, '#2a3a4a');
    if (o.steam) for (let i = 0; i < 5; i++) { const ph = (t * 0.6 + i * 0.2) % 1; circle(g, kx - 30 + Math.sin(t * 2 + i) * 14, ty - 110 - ph * 160, 14 + ph * 20, alpha('#ffffff', 0.12 * (1 - ph))); }
    // pendant lamp + clock
    seg(g, [[CX + 40, -E.H], [CX + 40, GY - 700]], 3, '#120d14'); poly(g, [[CX + 0, GY - 700], [CX + 80, GY - 700], [CX + 104, GY - 660], [CX - 24, GY - 660]], '#1a1418');
    glow(g, CX + 40, GY - 650, 200, M.practical, eve ? 0.55 : 0.25);
    if (eve) FX.lightCone(g, CX + 40, GY - 660, { len: 640, spread: 0.55, color: M.practical, a: 0.12 });
    wallClock(g, CX + 290, GY - 560, 46, t, { time: o.clock ?? (7.25 * 3600 + t) });
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY); FX.pool(g, CX - 110, GY + 40, 420, 60, eve ? M.practical : M.key, 0.22); });
  if (o.table !== false) layer(g, cam, 1, (g) => {
    const top = table(g, CX - 100, GY, 320, 150);
    if (o.tableProps) o.tableProps(g, CX - 100, top);
  });
  return { GY, CX, M, rim: [0, -1], tableX: CX - 100 };
}

export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.55, (g) => {
    wall(g, M, GY, { k: -0.3 });
    bigWindow(g, M, CX - 60, GY - 640, 420, 380, { moon: [CX + 220, GY - 560], night: true, stars: true, cols: 2, rows: 2, seed: 12, glowA: 0.12, glowC: M.key });
    FX.godRays(g, CX + 150, GY - 450, { count: 7, angle: Math.PI * 0.62, spread: 0.45, len: 900, a: 0.05, t, color: M.key });
    // drawing above the desk: big head, tiny legs
    const dx = CX + 640, dy = GY - 560; g.save(); g.translate(dx, dy); g.rotate(-0.03); g.fillStyle = '#ece3d0'; g.fillRect(-110, -90, 220, 170);
    g.strokeStyle = '#d64a33'; g.lineWidth = 5; g.beginPath(); g.arc(0, -20, 52, 0, 7); g.stroke(); seg(g, [[0, 32], [0, 50]], 4, '#3a3446'); seg(g, [[0, 50], [-8, 64]], 3, '#3a3446'); seg(g, [[0, 50], [8, 64]], 3, '#3a3446');
    text(g, 'MAX + LEO', 0, 72, { size: 13, color: '#8a3a5a', font: FONTS.ui, weight: 900 }); g.restore();
    wallClock(g, CX - 520, GY - 560, 40, t, { time: o.clock ?? (23.5 * 3600 + t * (o.clockSpeed ?? 1)) });
    // poster
    g.fillStyle = shade(M.wall, -0.4); g.fillRect(CX - 820, GY - 600, 150, 200); FX.stars(g, 0, { area: [CX - 810, GY - 590, 130, 180], count: 14, seed: 7, color: '#c9d4ff' });
  });
  layer(g, cam, 0.9, (g) => { floor(g, M, GY, { color: shade(M.floor, 0.05) }); FX.pool(g, CX + 160, GY + 50, 420, 50, M.key, 0.18); FX.pool(g, CX + 620, GY + 20, 260, 40, M.practical, 0.25); });
  layer(g, cam, 1, (g) => {
    if (o.bed !== false) FX.bed(g, { x: CX - 760, y: GY, w: 460, color: '#3b3f6e', frame: '#1a1628' });
    const top = desk(g, CX + 640, GY, 260);
    // lamp + laptop
    seg(g, [[CX + 540, top], [CX + 540, top - 90], [CX + 580, top - 120]], 5, '#120d14'); poly(g, [[CX + 560, top - 136], [CX + 610, top - 110], [CX + 590, top - 96], [CX + 548, top - 120]], '#1a1418');
    glow(g, CX + 590, top - 100, 180, M.practical, o.lamp === false ? 0 : 0.5);
    const lx = CX + 680, scr = o.laptop || '#7fb8e8'; poly(g, [[lx - 60, top], [lx + 60, top], [lx + 70, top + 4], [lx - 70, top + 4]], '#2a2a36');
    g.save(); g.translate(lx, top); g.rotate(-0.05); g.fillStyle = '#16161e'; g.fillRect(-58, -76, 116, 76); g.fillStyle = alpha(scr, o.laptopOn ? 0.9 : 0.3); g.fillRect(-52, -70, 104, 64); g.restore();
    if (o.laptopOn) glow(g, lx, top - 40, 260, scr, 0.35);
  });
  return { GY, CX, M, rim: [0.6, -0.8] };
}
