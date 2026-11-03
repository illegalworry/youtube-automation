// _sets.js — reusable locations. Each set(g, t, cam, opts) draws the background and returns { GY, CX, M, ... }.
import { E, V, mood, layer, backdrop, veil, rr, seg, poly, circle, ring, linGrad, radGrad, glow, alpha, shade, mix, rng, FX, GYf, CXf, ease, prog, text, FONTS } from './_lib.js';

const wallFill = (g, c1, c2, gy) => { g.fillStyle = linGrad(g, 0, gy - V(1000, 1700), 0, gy, [c1, c2]); g.fillRect(-E.W * 1.2, -E.H * 2, E.W * 3.4, gy + E.H * 2); };
const floorFill = (g, c1, c2, gy, lines = 'rgba(0,0,0,.22)') => { g.fillStyle = linGrad(g, 0, gy, 0, gy + 700, [c1, c2]); g.fillRect(-E.W * 1.2, gy, E.W * 3.4, E.H * 2); FX.floorLines(g, gy, gy + 700, lines, 0.07); };
const skyWin = (g, M, x, y, w, h, o = {}) => FX.windowFrame(g, { x, y, w, h, cols: o.cols ?? 3, rows: o.rows ?? 1, frame: shade(M.wall, -0.6), bar: o.bar ?? 9, blinds: o.blinds ?? 0 }, (g, X, Y, W, H) => {
  g.fillStyle = linGrad(g, 0, Y, 0, Y + H, o.sky || M.sky); g.fillRect(X, Y, W, H);
  if (o.stars) FX.stars(g, 0, { count: 40, area: [X, Y, W, H * 0.7] });
  if (o.moon) FX.moon(g, X + W * 0.72, Y + H * 0.28, W * 0.06);
  if (o.sun) FX.sun(g, X + W * (o.sunX ?? 0.5), Y + H * (o.sunY ?? 0.62), W * 0.07, '#fff7e6', M.key, 4);
  if (o.city !== false) FX.skyline(g, { x: X, y: Y + H, w: W, maxH: H * 0.55, color: alpha(shade(M.wall, -0.35), 0.85), windowColor: alpha(M.practical, o.stars || o.moon ? 0.9 : 0.55), lit: o.stars || o.moon ? 0.5 : 0.18, seed: o.seed ?? 4 });
});
const MOODS = { bedroom: 'interiorWarm', hall: 'interiorWarm', kitchen: 'interiorWarm', bank: 'interiorCool', shop: 'interiorCool', study: 'interiorWarm', office: 'interiorCool', palace: 'golden', cave: 'void', living: 'interiorWarm' };

export function room(g, t, cam, o = {}) {
  const kind = o.kind || 'bedroom', M = mood(o.mood || MOODS[kind]), GY = GYf(), CX = CXf(), wall = shade(M.wall, o.dim ? -0.5 : -0.2), ext = {};
  layer(g, cam, 0.5, (g) => {
    wallFill(g, shade(wall, -0.25), wall, GY);
    g.fillStyle = shade(wall, -0.35); g.fillRect(-E.W, GY - 36, E.W * 3, 40);                                           // skirting
    if (kind === 'bedroom') {
      skyWin(g, M, CX - V(700, 560), GY - V(640, 980), V(640, 560), V(420, 560), { sun: true, sunX: 0.7, sunY: 0.7, blinds: 5, sky: o.sky, stars: o.night, moon: o.night });
      FX.godRays(g, CX - V(380, 280), GY - V(380, 560), { count: 10, angle: 0.5, spread: 0.7, len: 1400, a: o.night ? 0.02 : 0.07, t });
      rr(g, CX + V(380, 260), GY - V(500, 760), 160, 110, 6); g.fillStyle = shade(wall, -0.35); g.fill();                  // picture
      g.fillStyle = alpha(M.key, 0.25); g.fillRect(CX + V(392, 272), GY - V(488, 748), 136, 86);
    } else if (kind === 'hall' || kind === 'living') {
      for (const x of [-860, -260, 340, 940]) { g.fillStyle = shade(wall, 0.05); g.fillRect(CX + x, GY - V(900, 1500), 8, V(900, 1500) - 40); }  // panel seams
      FX.door(g, { x: CX - V(780, 560), y: GY, w: 150, h: V(450, 520), color: shade(M.wall, -0.5), open: 0, light: M.practical });
      if (kind === 'hall') {
        const mx = CX + V(180, 80), my = GY - V(520, 760);                                                               // mirror
        rr(g, mx - 12, my - 12, 244, 424, 14); g.fillStyle = shade(M.wall, -0.65); g.fill();
        g.fillStyle = linGrad(g, mx, my, mx + 220, my + 400, [shade(M.wall, -0.1), shade(M.wall, 0.25), shade(M.wall, -0.05)]); g.fillRect(mx, my, 220, 400);
        seg(g, [[mx + 30, my + 380], [mx + 200, my + 40]], 8, alpha('#ffffff', 0.07)); ext.mirror = { x: mx, y: my, w: 220, h: 400 };
        for (const i of [0, 1, 2]) { seg(g, [[CX + V(560, 400) + i * 70, GY - V(520, 700)], [CX + V(560, 400) + i * 70, GY - V(520, 700) + 14]], 8, '#cbbfd0'); }
        FX.door(g, { x: CX + V(680, 460), y: GY, w: 180, h: V(480, 560), color: shade(M.wall, -0.55), open: o.doorOpen ?? 0, light: o.doorLight || '#cfe0ff' }); ext.door = { x: CX + V(680, 460), w: 180 };
      } else { skyWin(g, M, CX - V(220, 160), GY - V(620, 920), V(520, 420), V(340, 440), { stars: true, moon: true, cols: 2, seed: 7 }); }
    } else if (kind === 'kitchen') {
      skyWin(g, M, CX - V(300, 220), GY - V(620, 900), V(440, 380), V(300, 400), { stars: true, moon: true, cols: 2, sky: ['#0b1028', '#1d2550', '#3a3570'] });
      g.fillStyle = shade(wall, -0.1); for (const x of [-860, -700, -540, 360, 520, 680]) rr(g, CX + x, GY - V(700, 1000), 140, 190, 6), g.fill();       // upper cabinets
      FX.counter(g, { x: CX - V(900, 600), y: GY - 30, w: V(520, 480), h: 130, color: shade(M.wall, -0.45), top: shade(M.wall, -0.15), doors: 4 });
      FX.lampPost && 0;
    } else if (kind === 'bank') {
      for (const x of [-900, -420, 420, 900]) { g.fillStyle = shade(wall, 0.07); g.fillRect(CX + x - 60, GY - V(900, 1500), 120, V(900, 1500) - 36); g.fillStyle = alpha('#fff', 0.05); g.fillRect(CX + x - 60, GY - V(900, 1500), 12, V(900, 1500) - 36); }
      const vx = CX + V(640, 300), vy = GY - V(320, 420); ext.vault = { x: vx, y: vy };                                // vault door
      circle(g, vx, vy, 270, shade(M.wall, -0.55)); circle(g, vx, vy, 236, shade(M.wall, -0.2)); ring(g, vx, vy, 200, 14, shade(M.wall, 0.15)); ring(g, vx, vy, 150, 6, shade(M.wall, 0.1));
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 0.0; seg(g, [[vx, vy], [vx + Math.cos(a) * 90, vy + Math.sin(a) * 90]], 12, shade(M.wall, 0.2)); } circle(g, vx, vy, 28, shade(M.wall, 0.3));
      for (const x of [-700, 0]) { rr(g, CX + x - 120, GY - V(760, 1180), 240, 140, 10); g.fillStyle = alpha(M.practical, 0.18); g.fill(); }
    } else if (kind === 'shop') {
      const r = rng(5);
      for (let row = 0; row < 3; row++) { const y = GY - V(300, 360) - row * V(210, 250); g.fillStyle = shade(M.wall, -0.4); g.fillRect(-E.W * 0.6, y, E.W * 2.2, 14);
        for (let x = -E.W * 0.6; x < E.W * 1.6; x += 62) { const c = ['#c0486a', '#3a6ea5', '#f2c21a', '#3fb950', '#d64a33', '#8a5ad6'][Math.floor(r() * 6)]; const h = 70 + r() * 70; g.fillStyle = shade(c, -0.45); g.fillRect(x, y - h, 52, h); g.fillStyle = alpha('#fff', 0.1); g.fillRect(x + 4, y - h + 6, 44, 10); } }
      for (const x of [-700, 100, 900]) { g.fillStyle = alpha('#e8f2ff', 0.8); g.fillRect(CX + x, GY - V(900, 1400), 420, 10); glow(g, CX + x + 210, GY - V(890, 1390), 360, '#cfe0ff', 0.1); }
    } else if (kind === 'study') {
      const r = rng(9); for (const bx of [-900, -460, 560]) { g.fillStyle = shade(M.wall, -0.55); g.fillRect(CX + bx, GY - V(800, 1250), 360, V(800, 1250) - 36);
        for (let row = 0; row < 5; row++) for (let x = 0; x < 340; x += 22) { g.fillStyle = shade(['#8f3328', '#2f4a7a', '#4a6a3a', '#7a5a2a', '#5a3a6a'][Math.floor(r() * 5)], -0.35); g.fillRect(CX + bx + 10 + x, GY - V(800, 1250) + 24 + row * 130 + 60 - (r() * 40), 17, 40 + r() * 40); g.fillStyle = shade(M.wall, -0.6); g.fillRect(CX + bx, GY - V(800, 1250) + 14 + row * 130 + 110, 360, 8); } }
      skyWin(g, M, CX - V(180, 120), GY - V(600, 900), V(330, 300), V(340, 420), { stars: true, moon: true, cols: 2, seed: 2 });
    } else if (kind === 'office') {
      skyWin(g, M, CX - V(780, 520), GY - V(640, 900), V(1560, 1000), V(430, 560), { cols: 5, seed: 12, sky: o.sky });
    } else if (kind === 'palace') {
      for (const x of [-980, -520, 520, 980]) { g.fillStyle = shade(M.wall, 0.0); g.fillRect(CX + x - 54, GY - V(920, 1500), 108, V(920, 1500) - 30); g.fillStyle = shade(M.wall, 0.2); g.fillRect(CX + x - 70, GY - V(940, 1520), 140, 30); g.fillRect(CX + x - 70, GY - 70, 140, 40); g.fillStyle = alpha('#000', 0.18); g.fillRect(CX + x + 20, GY - V(920, 1500), 34, V(920, 1500) - 30); }
      for (const x of [-250, 250]) { g.fillStyle = '#8f3328'; g.fillRect(CX + x - 70, GY - V(900, 1400), 140, 460); poly(g, [[CX + x - 70, GY - V(900, 1400) + 460], [CX + x + 70, GY - V(900, 1400) + 460], [CX + x, GY - V(900, 1400) + 520]], '#8f3328'); }
      const tx = CX, ty = GY; rr(g, tx - 100, ty - 330, 200, 330, 14); g.fillStyle = '#6a2a24'; g.fill(); rr(g, tx - 82, ty - 300, 164, 160, 10); g.fillStyle = '#8f3328'; g.fill(); g.fillStyle = M.key; g.fillRect(tx - 100, ty - 120, 200, 18); ext.throne = { x: tx, y: ty };
      for (const x of [-700, 700]) { glow(g, CX + x, GY - V(520, 700), 280, '#ffb860', 0.28); circle(g, CX + x, GY - V(520, 700), 14, '#ffd59a'); }
    } else if (kind === 'cave') {
      const r = rng(4); g.fillStyle = shade(M.wall, -0.4); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
      for (let i = 0; i < 14; i++) { const x = -E.W * 0.3 + i * 190 + r() * 60; poly(g, [[x, -E.H], [x + 120 + r() * 120, -E.H], [x + 60 + r() * 60, GY - V(700, 1000) + r() * 260]], shade(M.wall, 0.02 + r() * 0.06)); }
    }
  });
  layer(g, cam, 0.9, (g) => {
    if (kind === 'bedroom' || kind === 'living') floorFill(g, shade(M.floor, 0.05), M.dark, GY, 'rgba(0,0,0,.18)');
    else if (kind === 'bank') floorFill(g, shade(M.floor, 0.1), M.dark, GY, 'rgba(255,255,255,.07)');
    else if (kind === 'shop') floorFill(g, shade(M.floor, 0.15), M.dark, GY, 'rgba(255,255,255,.07)');
    else if (kind === 'palace') floorFill(g, shade('#5a3a34', 0.0), M.dark, GY, 'rgba(0,0,0,.25)');
    else if (kind === 'cave') floorFill(g, shade(M.floor, 0.1), M.dark, GY, 'rgba(0,0,0,.3)');
    else floorFill(g, M.floor, M.dark, GY);
    if (kind === 'bedroom') {                                                                                          // carpet + bed + lamp
      g.fillStyle = shade('#4a3a5a', -0.2); g.beginPath(); g.ellipse(CX - V(120, 40), GY + 60, V(560, 420), 80, 0, 0, 7); g.fill();
      const r = rng(2); for (let i = 0; i < 90; i++) { const a = r() * 6.28, d = Math.sqrt(r()); circle(g, CX - V(120, 40) + Math.cos(a) * d * V(540, 400), GY + 60 + Math.sin(a) * d * 70, 2.2, alpha('#d8c8f0', 0.15)); }
      FX.bed(g, { x: CX + V(420, 260), y: GY + 6, w: V(520, 400), color: shade('#5a5aa0', -0.25), frame: shade(M.wall, -0.55), pillow: '#cfc9de' });
      FX.pool(g, CX - V(380, 280), GY + 60, 420, 70, M.key, o.night ? 0.05 : 0.22);
    }
    if (kind === 'hall' || kind === 'living') FX.pool(g, CX, GY + 40, 520, 60, M.key, 0.14);
    if (kind === 'bank') { FX.counter(g, { x: CX - V(900, 500), y: GY - 6, w: V(980, 640), h: 200, color: shade('#5a4a4a', -0.4), top: shade(M.wall, 0.25), doors: 6 }); ext.counterTop = GY - 212; FX.pool(g, CX - V(400, 200), GY + 30, 520, 60, M.practical, 0.2); }
    if (kind === 'shop') FX.pool(g, CX - 100, GY + 40, 700, 80, '#cfe0ff', 0.12);
    if (kind === 'kitchen') {
      const tx = CX + V(40, 20), top = GY - 150; ext.tableX = tx; ext.tableTop = top - 12;
      FX.lightCone(g, tx, GY - V(760, 1100), { angle: Math.PI / 2, spread: 0.55, len: 800, color: M.practical, a: 0.16 });
      FX.pool(g, tx, GY + 20, 440, 60, M.practical, 0.28);
    }
    if (kind === 'palace') { g.fillStyle = '#7a2a24'; poly(g, [[CX - 110, GY], [CX + 110, GY], [CX + 260, GY + 400], [CX - 260, GY + 400]], '#7a2a24'); FX.pool(g, CX, GY + 20, 520, 60, '#ffd59a', 0.2); }
    if (kind === 'cave') { FX.fog(g, GY - 150, 260, '#6a6a90', 0.2); }
    if (kind === 'study') {
      rr(g, CX - V(380, 260), GY - 200, V(760, 520), 26, 6); g.fillStyle = shade(M.floor, -0.2); g.fill(); seg(g, [[CX - V(340, 230), GY - 176], [CX - V(340, 230), GY - 8]], 14, shade(M.floor, -0.2)); seg(g, [[CX + V(340, 230), GY - 176], [CX + V(340, 230), GY - 8]], 14, shade(M.floor, -0.2));
      ext.deskTop = GY - 200; glow(g, CX - V(180, 120), GY - 260, 280, '#ffb860', 0.35); rr(g, CX - V(200, 140), GY - 270, 36, 70, 6); g.fillStyle = '#e8b860'; g.fill();
    }
    if (kind === 'office') {
      rr(g, CX - V(300, 260), GY - 190, V(600, 520), 24, 6); g.fillStyle = shade(M.floor, 0.1); g.fill();
      FX.screen(g, { x: CX - 100, y: GY - 360, w: 200, h: 130, glowC: '#7fd0d6', a: 0.3 }, (g, x, y, w, h) => { for (let i = 0; i < 5; i++) { g.fillStyle = alpha('#cfe0ff', 0.5); g.fillRect(x + 14, y + 14 + i * 22, 60 + (i * 37) % 90, 8); } });
    }
  });
  ext.GY = GY; ext.CX = CX; ext.M = M; return ext;
}

// ---------- exterior: street ----------
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'day'), GY = GYf(), CX = CXf(), dim = o.dim ?? 0.2, night = o.night, ext = {};
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); if (night) { FX.stars(g, t, { count: 120 }); FX.moon(g, E.W * 0.78, E.H * 0.2, 54); } else FX.sun(g, E.W * 0.8, GY - V(520, 900), 60, '#fff3dc', M.key, 4);
    if (!night) FX.clouds(g, { y: GY - V(800, 1400), h: 200, color: '#ffffff', a: 0.12, seed: 4 }); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W, y: GY - V(300, 460), w: E.W * 3, minH: 90, maxH: V(300, 480), color: mix(M.sky[Math.min(1, M.sky.length - 1)], M.dark, 0.7), windowColor: alpha(M.practical, night ? 0.9 : 0.5), lit: night ? 0.4 : 0.15, seed: o.seed ?? 8 }));
  layer(g, cam, 0.55, (g) => {                                                                                         // facades
    const r = rng(o.seed ?? 3); let x = -E.W * 0.8;
    while (x < E.W * 1.9) { const w = 340 + r() * 220, h = V(520, 820) + r() * 120, c = shade(M.wall, -dim - r() * 0.25); const bank = o.bank && x > CX - 80 && x < CX + 400;
      g.fillStyle = linGrad(g, 0, GY - h, 0, GY, [shade(c, 0.05), c, shade(c, -0.3)]); g.fillRect(x, GY - h, w, h + 4);
      for (let wy = GY - h + 70; wy < GY - 190; wy += 120) for (let wx = x + 36; wx < x + w - 70; wx += 100) { const lit = r() < (night ? 0.6 : 0.3); g.fillStyle = lit ? alpha(M.practical, night ? 0.85 : 0.55) : shade(c, -0.4); g.fillRect(wx, wy, 52, 72); if (lit) glow(g, wx + 26, wy + 36, 90, M.practical, night ? 0.12 : 0.05); }
      g.fillStyle = shade(c, -0.5); g.fillRect(x, GY - 150, w, 150); g.fillStyle = alpha(M.practical, night ? 0.5 : 0.25); g.fillRect(x + 24, GY - 128, w - 48, 100);                                // shop fronts
      x += w + 8; }
    if (o.bank) { const bx = CX - 160, bw = 520; g.fillStyle = shade('#6a6a80', -0.3); g.fillRect(bx, GY - V(640, 900), bw, V(640, 900)); for (let i = 0; i < 5; i++) { g.fillStyle = shade('#8a8aa0', -0.25); g.fillRect(bx + 20 + i * 100, GY - V(580, 840), 44, V(520, 780)); }
      g.fillStyle = shade('#8a8aa0', -0.2); poly(g, [[bx - 20, GY - V(640, 900)], [bx + bw + 20, GY - V(640, 900)], [bx + bw / 2, GY - V(760, 1020)]], shade('#8a8aa0', -0.3)); text(g, 'BANK', bx + bw / 2, GY - V(585, 845), { size: 40, color: '#e8e4ee', weight: 800 });
      FX.door(g, { x: bx + bw / 2 - 90, y: GY, w: 180, h: 250, color: '#1c2a38', open: o.doorOpen ?? 0, light: '#ffe2a8' }); ext.bankDoor = bx + bw / 2; }
  });
  layer(g, cam, 0.9, (g) => {                                                                                          // sidewalk + road
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 110, [shade(M.floor, 0.12), shade(M.floor, -0.05)]); g.fillRect(-E.W * 1.2, GY, E.W * 3.4, 110);
    g.fillStyle = shade(M.dark, -0.1); g.fillRect(-E.W * 1.2, GY + 110, E.W * 3.4, E.H * 2); FX.floorLines(g, GY, GY + 110, 'rgba(0,0,0,.2)', 0.1);
    g.fillStyle = shade(M.floor, 0.3); g.fillRect(-E.W * 1.2, GY + 106, E.W * 3.4, 8);
    if (o.cross) { for (let i = -8; i <= 8; i++) { poly(g, [[CX + i * 110 - 34, GY + 128], [CX + i * 110 + 22, GY + 128], [CX + i * 118 + 30, GY + 230], [CX + i * 118 - 28, GY + 230]], alpha('#f2efe8', 0.7)); } }
    else { g.fillStyle = alpha('#f2efe8', 0.35); for (let x = -E.W; x < E.W * 2; x += 280) g.fillRect(x, GY + 190, 140, 8); }
    if (o.lamps !== false) for (const x of [-700, 500, 1700]) FX.lampPost(g, x, GY + 10, 380, { light: M.practical, on: night || o.lampsOn, a: night ? 0.25 : 0.08 });
  });
  veil(g, '#0a1226', o.tone ?? (night ? 0.0 : 0.28)); ext.GY = GY; ext.CX = CX; ext.M = M; return ext;
}
export const crossing = (g, t, cam, o = {}) => street(g, t, cam, { cross: true, ...o });

// ---------- park ----------
export function park(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYf(), CX = CXf(), ext = {};
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); if (o.night) { FX.stars(g, t, { count: 130 }); FX.moon(g, E.W * 0.2, E.H * 0.2, 56); } else FX.sun(g, E.W * 0.2, GY - V(300, 500), 70, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.3, (g) => { FX.hills(g, { y: GY - V(160, 300), amp: 90, color: shade(M.dark, 0.18), seed: 3 }); FX.skyline(g, { x: -E.W * 0.5, y: GY - V(150, 280), w: E.W * 2, minH: 50, maxH: 190, color: shade(M.dark, 0.1), windowColor: alpha(M.practical, 0.7), lit: 0.3, seed: 6 }); });
  layer(g, cam, 0.6, (g) => { for (let i = 0; i < 9; i++) FX.tree(g, -E.W * 0.4 + i * 300 + (i % 2) * 70, GY + 10, 1.3 + (i % 3) * 0.3, shade(M.grass, -0.55)); });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.grass, -0.35), shade(M.grass, -0.65)]); g.fillRect(-E.W * 1.2, GY, E.W * 3.4, E.H * 2);
    g.fillStyle = alpha('#b8a888', 0.3); poly(g, [[CX - 100, GY], [CX + 100, GY], [CX + 420, GY + 500], [CX - 420, GY + 500]], alpha('#b8a888', 0.22));
    for (const x of [-600, 1500]) FX.lampPost(g, x, GY + 10, 400, { light: M.practical, on: true, a: 0.2 });
  });
  ext.GY = GY; ext.CX = CX; ext.M = M; return ext;
}
export function bench(g, x, GY, s = 1, color = '#2a1d22') {
  rr(g, x - 150 * s, GY - 110 * s, 300 * s, 16 * s, 6); g.fillStyle = color; g.fill(); rr(g, x - 150 * s, GY - 190 * s, 300 * s, 14 * s, 6); g.fill(); rr(g, x - 150 * s, GY - 160 * s, 300 * s, 12 * s, 6); g.fill();
  for (const dx of [-130, 130]) { seg(g, [[x + dx * s, GY - 110 * s], [x + dx * s, GY - 6]], 10 * s, color); seg(g, [[x + dx * s, GY - 190 * s], [x + dx * s, GY - 110 * s]], 8 * s, color); }
}

// ---------- void / blueprint / dark ----------
export function voidBg(g, t, cam, o = {}) { const M = mood(o.mood || 'void'); layer(g, cam, 0.3, (g) => { backdrop(g, M.sky); if (o.stars) FX.stars(g, t, { count: 90 }); }); return { GY: GYf(), CX: CXf(), M }; }
export function bp(g, t, cam, o = {}) { UI.blueprint(g, o); return { GY: GYf(), CX: CXf(), M: mood('void') }; }
import * as UI from '/engine/ui2d.js';

// ---------- hillside (ancient Greece) ----------
export function hill(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = GYf(), CX = CXf();
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.75, GY - V(380, 700), 80, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - V(800, 1400), h: 200, color: '#ffe7c7', a: 0.18, seed: 6 }); });
  layer(g, cam, 0.3, (g) => FX.hills(g, { y: GY - V(130, 260), amp: 120, color: shade(M.dark, 0.35), seed: 2 }));
  layer(g, cam, 0.55, (g) => { FX.hills(g, { y: GY - V(30, 90), amp: 70, color: shade(M.grass, -0.5), seed: 5, freq: 0.006 }); for (const x of [200, 900, 1500, 2100]) FX.pine(g, x, GY - 20, 1.4, shade(M.grass, -0.65)); for (const x of [-100, 600, 1250]) { g.fillStyle = shade('#c9b8a4', -0.35); g.fillRect(x, GY - 250, 36, 230); g.fillRect(x - 14, GY - 262, 64, 16); } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.grass, -0.35), shade(M.grass, -0.7)]); g.fillRect(-E.W * 1.2, GY, E.W * 3.4, E.H * 2); });
  return { GY, CX, M };
}
export function cafeSet(g, t, cam, o = {}) {   // street café at golden hour (lunch)
  const M = mood(o.mood || 'golden'), GY = GYf(), CX = CXf(); const wall = shade(M.wall, -0.3), wallDark = shade(M.wall, -0.6);
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, CX + V(620, 300), GY - V(560, 1000), 64, '#fff3dc', M.key, 5); FX.skyline(g, { x: -E.W, y: GY - V(420, 700), w: E.W * 3, minH: 80, maxH: V(260, 420), color: mix(M.sky[1], wallDark, 0.75), windowColor: alpha(M.practical, 0.5), lit: 0.15, seed: 8 }); });
  layer(g, cam, 0.55, (g) => {
    const top = GY - V(560, 860), left = CX - 1500, w = 3000; g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.06), wall, wallDark]); g.fillRect(left, top, w, GY - top + 4);
    const ay = GY - V(430, 560), ah = 58;
    for (const i of [-3, -2, -1, 1, 2, 3]) { const ww = 210, wh = V(250, 300), wx = CX + i * 300 - ww / 2 + (i > 0 ? 30 : -30), wy = ay + 46;
      FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 1, frame: wallDark, bar: 9 }, (g, x, y, w2, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, [M.practical, shade(M.practical, -0.45), shade(M.practical, -0.7)]); g.fillRect(x, y, w2, h); });
      glow(g, wx + ww / 2, wy + wh / 2, 230, M.practical, 0.1); }
    FX.door(g, { x: CX - 70, y: GY, w: 140, h: V(330, 380), color: wallDark, open: 0.3, light: M.practical });
    for (let x = left, k = 0; x < left + w; x += 56, k++) { g.fillStyle = k % 2 ? '#c9b8a4' : '#8f3328'; g.fillRect(x, ay - ah, 56, ah); g.beginPath(); g.arc(x + 28, ay, 28, 0, Math.PI); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(left, ay - ah, w, 12);
    rr(g, CX - 100, ay - ah - 66, 200, 50, 10); g.fillStyle = wallDark; g.fill(); text(g, 'CAFÉ', CX, ay - ah - 40, { size: 28, color: M.practical, weight: 700 });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.25)', 0.08); for (const i of [-2, 0, 2]) FX.pool(g, CX + i * 300, GY + 30, 200, 34, M.practical, 0.18); });
  return { GY, CX, M };
}
