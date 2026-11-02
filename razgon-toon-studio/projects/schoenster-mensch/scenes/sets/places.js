// sets/places.js — new locations for "Der schönste Mensch". Same contract as engine/toonsets.js:
// (g, t, cam, o) → { GY, CX, M, front(g) }. All colours come from mood() so styles keep working.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import { tGround, toonSky, toonTree, bush, lawn, toonWindow, toonHouse, toonFloor, pendantLamp, nightWindow, woodDoor, softEllipse, lightPool, lamplight, cloud, brickWall, hangingBulb, garage, street } from '/engine/toonsets.js';

const done = (GY, CX, M, front) => ({ GY, CX, M, front: front || (() => {}) });
const wallFill = (g, c, GY) => { g.fillStyle = c; g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, GY + E.H * 2); };
const skirting = (g, M, GY, h = 90) => { g.fillStyle = shade(M.wall, -0.1); g.fillRect(-E.W * 2, GY - h, E.W * 5, h); g.fillStyle = M.trim; g.fillRect(-E.W * 2, GY - h - 4, E.W * 5, 8); };

// little city skyline strip (used in windows); x0..x1, base, seed, scroll
export function skyline(g, x0, x1, base, M, seed = 3, o = {}) {
  const R = rng(seed), cols = o.cols || [shade(M.glass, -0.05), shade(M.glass, 0.12), mix(M.glass, '#ffffff', 0.25), shade(M.wall, -0.2)];
  for (let x = x0; x < x1;) { const w = 80 + R() * 120, h = 120 + R() * (o.h || 320), c = cols[(R() * cols.length) | 0];
    g.fillStyle = c; g.fillRect(x, base - h, w - 8, h);
    g.fillStyle = o.night ? alpha(M.practical, 0.75) : alpha('#ffffff', 0.35);
    for (let yy = base - h + 16; yy < base - 20; yy += 34) for (let xx = x + 10; xx < x + w - 24; xx += 26) if (R() < (o.night ? 0.45 : 0.7)) g.fillRect(xx, yy, 12, 18);
    x += w; }
}

// ---------------- bus interior ----------------
export function bus(g, t, cam, o = {}) {
  const M = mood(o.mood || 'indoorDay'), GY = tGround(), CX = E.W / 2, wy = GY - 640, wh = 300, scroll = (t * (o.speed ?? 260)) % 2400;
  layer(g, cam, 0.3, (g) => {   // world outside the windows, scrolling
    const S = mood('sunny'); backdrop(g, S.sky);
    g.save(); g.translate(-scroll, 0);
    for (let k = -1; k < 3; k++) { const ox = k * 2400 - 600;
      for (const [dx, wall, roof] of [[0, '#e9e3d6', '#8a645a'], [600, '#d6dfe6', '#5a6a80'], [1200, '#f0dcc4', '#9a5a4a'], [1800, '#e2e8d6', '#6a7a5a']]) toonHouse(g, ox + dx, wy + wh + 80, 0.9, S, { wall, roof });
      for (const dx of [300, 900, 1500, 2100]) toonTree(g, ox + dx, wy + wh + 100, 0.8, S, dx, { trunk: 200 }); }
    g.restore();
  });
  layer(g, cam, 0.7, (g) => {
    const body = '#e7e2d6';
    g.fillStyle = body; g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, wy + E.H * 2);
    g.fillStyle = body; g.fillRect(-E.W * 2, wy + wh, E.W * 5, GY - wy - wh);
    g.fillStyle = shade(body, -0.1); g.fillRect(-E.W * 2, wy + wh, E.W * 5, 24);
    g.fillStyle = '#3a6ec8'; g.fillRect(-E.W * 2, GY - 150, E.W * 5, 18);          // blue stripe
    for (let x = -E.W * 2; x < E.W * 3; x += 520) { g.fillStyle = shade(body, -0.25); g.fillRect(x, wy - 4, 36, wh + 8); }   // window pillars
    g.fillStyle = alpha('#ffffff', 0.12); for (let x = -E.W * 2; x < E.W * 3; x += 520) poly(g, [[x + 120, wy], [x + 200, wy], [x + 90, wy + wh], [x + 10, wy + wh]], alpha('#ffffff', 0.16));
    g.fillStyle = shade(body, 0.05); g.fillRect(-E.W * 2, wy - 120, E.W * 5, 40);   // ad panel strip
    for (let x = -E.W * 2 + 120; x < E.W * 3; x += 520) { rr(g, x, wy - 114, 260, 28, 4); g.fillStyle = ['#e8c04a', '#5bb4c8', '#d6533c'][Math.abs(Math.round(x / 520)) % 3]; g.fill(); }
    // seats (side view, blue)
    for (let x = -E.W * 2 + 160; x < E.W * 3; x += 520) for (const dx of [0, 230]) { rr(g, x + dx, GY - 330, 46, 260, 14); g.fillStyle = '#2f5aa8'; g.fill(); rr(g, x + dx - 140, GY - 140, 190, 40, 12); g.fillStyle = '#3a6ec8'; g.fill(); g.fillStyle = '#7a7d84'; g.fillRect(x + dx - 60, GY - 100, 14, 100); }
    // ceiling rail + straps
    g.fillStyle = '#c9ccd2'; g.fillRect(-E.W * 2, wy - 190, E.W * 5, 12);
    for (let x = -E.W * 2 + 60; x < E.W * 3; x += 180) { const sw = Math.sin(t * 2 + x) * 4; seg(g, [[x, wy - 180], [x + sw, wy - 90]], 6, '#3a3d44'); ring(g, x + sw, wy - 74, 18, 6, '#e8c04a'); }
  });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: '#7a7d84', tiles: true }); });
  // yellow poles in front of the seats
  layer(g, cam, 0.95, (g) => { for (let x = -E.W * 2 + 420; x < E.W * 3; x += 1040) { rr(g, x, -E.H, 22, E.H + GY + 30, 10); g.fillStyle = '#e8c04a'; g.fill(); g.fillStyle = alpha('#ffffff', 0.35); g.fillRect(x + 4, -E.H, 5, E.H + GY); } });
  return done(GY, CX, M, (g) => { if (o.pole !== false) layer(g, cam, 1.4, (g) => { const x = CX + (o.poleX ?? 760); rr(g, x, -E.H, 34, E.H * 3, 14); g.fillStyle = '#e8c04a'; g.fill(); g.fillStyle = alpha('#fff', 0.35); g.fillRect(x + 6, -E.H, 7, E.H * 3); }); });
}

// ---------------- bakery ----------------
function bread(g, x, y, s, R) { const c = mix('#d9a35a', '#b9773a', R()); g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 34 * s, 20 * s, 0, 0, Math.PI * 2); g.fill(); seg(g, [[x - 14 * s, y - 6 * s], [x - 4 * s, y + 4 * s]], 3 * s, shade(c, 0.25)); seg(g, [[x + 4 * s, y - 8 * s], [x + 14 * s, y + 2 * s]], 3 * s, shade(c, 0.25)); }
export function baeckerei(g, t, cam, o = {}) {
  const M = mood(o.mood || 'indoorDay'), GY = tGround(), CX = E.W / 2, R = rng(4);
  layer(g, cam, 0.6, (g) => {
    wallFill(g, '#f1dfc0', GY);
    for (let x = -E.W * 2; x < E.W * 3; x += 60) { g.fillStyle = alpha('#d9b98a', 0.35); g.fillRect(x, -E.H, 30, GY + E.H); }   // stripes
    rr(g, CX - 330, GY - 760, 660, 110, 18); g.fillStyle = '#7a4a2c'; g.fill();
    text(g, 'BÄCKEREI', CX, GY - 703, { size: 72, font: FONTS.ui, weight: 900, color: '#f7e2b8', spacing: 6 });
    for (const sx of [-760, -260, 260, 760]) { const x = CX + sx; for (let r = 0; r < 3; r++) { const y = GY - 590 + r * 120; g.fillStyle = '#a97c50'; g.fillRect(x - 210, y + 30, 420, 14); for (let i = 0; i < 5; i++) bread(g, x - 160 + i * 80, y + 10, 1, R); } }
    for (const x of [CX - 520, CX, CX + 520]) pendantLamp(g, x, GY - 820, M, { color: '#2f4a3a' });
    lightPool(g, CX, GY - 300, 900, 300, M.light, 0.25);
  });
  layer(g, cam, 0.9, (g) => toonFloor(g, GY, M, { color: '#c7b8a0', tiles: true }));
  const counterFn = (g) => { const y = GY - 230; rr(g, CX - 1100, y, 2200, 300, 10); g.fillStyle = '#8a5a3a'; g.fill(); g.fillStyle = '#f2e9d8'; g.fillRect(CX - 1110, y - 14, 2220, 22);
    rr(g, CX - 900, y - 150, 700, 140, 8); g.fillStyle = alpha('#cfe6f4', 0.55); g.fill(); for (let i = 0; i < 8; i++) bread(g, CX - 850 + i * 85, y - 40, 0.9, rng(i + 9));
    g.fillStyle = alpha('#ffffff', 0.4); poly(g, [[CX - 800, y - 150], [CX - 740, y - 150], [CX - 820, y - 10], [CX - 880, y - 10]], alpha('#fff', 0.4)); };
  return done(GY, CX, M, (g) => { if (o.counter !== false) layer(g, cam, 1.02, counterFn); });
}

// ---------------- flat graphic backdrop ("Die Regel", stickers, counters) ----------------
export function regel(g, t, cam, o = {}) {
  const M = mood('sunny'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.2, (g) => { backdrop(g, o.sky || ['#7fbbe8', '#b7dcf3', '#e7f3f8']); for (const [x, y, s] of [[CX - 700, 200, 0.9], [CX + 500, 150, 0.7], [CX + 900, 330, 0.5]]) cloud(g, x + Math.sin(t * 0.3 + x) * 20, y, s, '#ffffff', 0.85);
    g.save(); g.globalAlpha = 0.08; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.05; poly(g, [[CX, GY - 300], [CX + Math.cos(a) * 2600, GY - 300 + Math.sin(a) * 2600], [CX + Math.cos(a + 0.18) * 2600, GY - 300 + Math.sin(a + 0.18) * 2600]], '#ffffff'); } g.restore(); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = M.grass; g.fillRect(-E.W * 2, GY, E.W * 5, E.H * 2); g.fillStyle = alpha(shade(M.grass, -0.25), 0.4); g.fillRect(-E.W * 2, GY, E.W * 5, 8); });
  return done(GY, CX, M);
}

// ---------------- hallway of doors ----------------
export const DOOR_COLS = ['#d6533c', '#3f63c8', '#e8c04a', '#3f9a5a', '#9a5ad0', '#5bb4c8', '#f08a2c'];
// open: function(i) → 0..1
export function tueren(g, t, cam, o = {}) {
  const M = mood('indoorDay'), GY = tGround(), CX = E.W / 2, open = o.open || (() => 0);
  layer(g, cam, 0.75, (g) => {
    wallFill(g, '#efe6d6', GY); skirting(g, M, GY);
    for (let i = -6; i <= 8; i++) { const x = CX + i * 420, w = 210, h = 470, y = GY - h, k = Math.max(0, Math.min(1, open(i)));
      g.fillStyle = shade('#efe6d6', -0.2); g.fillRect(x - w / 2 - 14, y - 14, w + 28, h + 14);
      g.fillStyle = '#fff6dc'; g.fillRect(x - w / 2, y, w, h); softEllipse(g, x, y + h * 0.6, w * 0.7, h * 0.5, '#ffffff', 0.6);   // bright room behind
      const dw = w * (1 - 0.82 * k), c = DOOR_COLS[(i + 7) % DOOR_COLS.length];
      g.fillStyle = shade(c, -0.15 * k); g.fillRect(x - w / 2, y, dw, h);
      g.fillStyle = alpha(shade(c, -0.25), 0.6); g.fillRect(x - w / 2 + dw * 0.15, y + 40, dw * 0.7, 160); g.fillRect(x - w / 2 + dw * 0.15, y + 250, dw * 0.7, 180);
      circle(g, x - w / 2 + dw - 24, y + h * 0.55, 9, '#f2d27a');
      if (k > 0.05) lightPool(g, x, GY + 40, 200 * k, 40, M.light, 0.5 * k);
      pendantLamp(g, x + 210, GY - 640, M, { color: '#3a3d44', w: 80 }); }
  });
  layer(g, cam, 0.9, (g) => toonFloor(g, GY, M, { color: M.wood, boards: 130 }));
  return done(GY, CX, M, (g) => { if (o.frames) layer(g, cam, 1.6, (g) => { for (const dx of o.frames) { g.fillStyle = shade(DOOR_COLS[2], -0.1); g.fillRect(CX + dx, -E.H, 90, E.H * 3); } }); });
}

// ---------------- office ----------------
export function buero(g, t, cam, o = {}) {
  const M = mood('indoorDay'), GY = tGround(), CX = E.W / 2;
  if (o.lobby) {   // exterior: glass office tower + entrance
    layer(g, cam, 0.15, (g) => toonSky(g, mood('sunny'), { clouds: [[CX - 700, 160, 0.8], [CX + 600, 120, 0.6]] }));
    layer(g, cam, 0.4, (g) => skyline(g, -E.W, E.W * 2.2, GY - 160, mood('sunny'), 21, { h: 420 }));
    layer(g, cam, 0.65, (g) => { rr(g, CX - 520, -400, 1040, GY + 300, 6); g.fillStyle = '#7fa9d6'; g.fill();
      for (let y = -380; y < GY - 300; y += 90) for (let x = CX - 500; x < CX + 500; x += 125) { g.fillStyle = (x + y) % 3 ? '#a8c8ea' : '#8fb4dc'; g.fillRect(x, y, 112, 78); }
      g.fillStyle = '#e9e1d2'; g.fillRect(CX - 540, GY - 290, 1080, 30); rr(g, CX - 160, GY - 260, 320, 260, 4); g.fillStyle = '#cfe6f4'; g.fill(); g.fillStyle = '#9fb6c8'; g.fillRect(CX - 4, GY - 260, 8, 260);
      text(g, o.sign || 'KAISER & PARTNER', CX, GY - 330, { size: 46, font: FONTS.ui, weight: 900, color: '#ffffff', spacing: 4 }); });
    layer(g, cam, 0.9, (g) => { g.fillStyle = M.concrete; g.fillRect(-E.W * 2, GY - 10, E.W * 5, E.H * 2); g.fillStyle = shade(M.concrete, -0.12); g.fillRect(-E.W * 2, GY - 10, E.W * 5, 10); });
    return done(GY, CX, M);
  }
  layer(g, cam, 0.35, (g) => { const S = mood('sunny'); backdrop(g, S.sky); skyline(g, -E.W, E.W * 2.5, GY - 120, S, 7, { h: 380 }); });
  layer(g, cam, 0.65, (g) => {
    g.fillStyle = '#e7e2d8'; g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, E.H * 2 + GY - 700); g.fillRect(-E.W * 2, GY - 120, E.W * 5, 200);
    for (let x = -E.W * 2; x < E.W * 3; x += 460) { g.fillStyle = '#d0cabe'; g.fillRect(x, GY - 720, 28, 620); }
    g.fillStyle = alpha('#ffffff', 0.18); for (let x = -E.W * 2; x < E.W * 3; x += 460) poly(g, [[x + 140, GY - 700], [x + 230, GY - 700], [x + 120, GY - 120], [x + 30, GY - 120]], alpha('#fff', 0.18));
    // plant
    const px = CX + 820; rr(g, px - 60, GY - 150, 120, 150, 10); g.fillStyle = '#d6533c'; g.fill(); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; seg(g, [[px, GY - 150], [px + Math.cos(a) * 170, GY - 150 + Math.sin(a) * 210]], 26, i % 2 ? '#3f9a5a' : '#5fb46a'); }
  });
  layer(g, cam, 0.9, (g) => toonFloor(g, GY, M, { color: '#a8a39a', tiles: true }));
  const desk = (g) => { const x = CX + (o.deskX ?? 240), y = GY - 210; rr(g, x - 380, y, 760, 40, 8); g.fillStyle = '#f2efe8'; g.fill(); g.fillStyle = '#5a5f66'; g.fillRect(x - 350, y + 40, 24, 170); g.fillRect(x + 326, y + 40, 24, 170); rr(g, x - 360, y + 40, 260, 120, 6); g.fillStyle = '#d9d4ca'; g.fill();
    if (o.monitor !== false) { rr(g, x + 80, y - 220, 280, 180, 10); g.fillStyle = '#2a2d34'; g.fill(); rr(g, x + 92, y - 208, 256, 156, 6); g.fillStyle = '#8fbde3'; g.fill(); g.fillStyle = '#2a2d34'; g.fillRect(x + 205, y - 40, 30, 40); } };
  return done(GY, CX, M, (g) => { if (o.desk !== false) layer(g, cam, 1.02, desk); });
}

// ---------------- restaurant ----------------
export function restaurant(g, t, cam, o = {}) {
  const M = mood('indoorNight'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.6, (g) => {
    wallFill(g, '#8a4a3c', GY);
    g.fillStyle = '#6b3a2f'; g.fillRect(-E.W * 2, GY - 360, E.W * 5, 360); g.fillStyle = '#c99a5a'; g.fillRect(-E.W * 2, GY - 366, E.W * 5, 10);
    for (let x = -E.W * 2; x < E.W * 3; x += 160) { g.fillStyle = alpha('#000', 0.12); g.fillRect(x, GY - 350, 6, 350); }
    nightWindow(g, CX - 140, GY - 760, 520, 300, M, t);
    for (const x of [CX - 760, CX - 140 + 260, CX + 780]) { pendantLamp(g, x, GY - 620, M, { color: '#c99a5a' }); lamplight(g, x, GY - 590, 420, M.practical, 0.7); }
    for (const x of [CX - 1000, CX + 1000]) { rr(g, x - 70, GY - 640, 140, 180, 6); g.fillStyle = '#e8d6b8'; g.fill(); rr(g, x - 60, GY - 630, 120, 160, 4); g.fillStyle = ['#5bb4c8', '#e8c04a'][x > CX ? 1 : 0]; g.fill(); }
  });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: '#6a4a3a', boards: 120 }); softEllipse(g, CX, GY + 40, 900, 120, M.practical, 0.18); });
  const table = (g) => { const x = CX + (o.tableX ?? 0), y = GY - 170; rr(g, x - 300, y, 600, 34, 8); g.fillStyle = '#f6f1e6'; g.fill(); poly(g, [[x - 300, y + 20], [x + 300, y + 20], [x + 280, y + 120], [x - 280, y + 120]], '#efe7d6'); g.fillStyle = '#3a2a24'; g.fillRect(x - 12, y + 120, 24, 170 - 120 + 10);
    circle(g, x - 140, y - 4, 8, '#ffd98c'); lamplight(g, x - 140, y - 30, 120, M.practical, 0.8); seg(g, [[x - 140, y - 4], [x - 140, y - 40]], 10, '#f6f1e6');
    if (o.reserved) { rr(g, x + 40, y - 60, 160, 56, 6); g.fillStyle = '#2a2d34'; g.fill(); text(g, 'RESERVIERT', x + 120, y - 31, { size: 24, font: FONTS.ui, weight: 900, color: '#f7c948' }); } };
  return done(GY, CX, M, (g) => { if (o.table !== false) layer(g, cam, 1.02, table); });
}

// ---------------- park ----------------
export function park(g, t, cam, o = {}) {
  const M = mood('sunny'), GY = tGround(), CX = E.W / 2, hz = GY - 260;
  layer(g, cam, 0.15, (g) => toonSky(g, M, { clouds: [[CX - 600, hz - 520, 0.8], [CX + 700, hz - 600, 0.6]] }));
  layer(g, cam, 0.4, (g) => { for (let i = -6; i < 8; i++) toonTree(g, CX + i * 330, hz + 10, 0.8, M, i + 20, { trunk: 220 }); });
  layer(g, cam, 0.7, (g) => { lawn(g, hz, M); poly(g, [[CX - 4000, GY - 40], [CX + 4000, GY - 40], [CX + 4000, GY + 120], [CX - 4000, GY + 120]], '#e2d3b0'); g.fillStyle = alpha('#000', 0.08); g.fillRect(-E.W * 3, GY - 40, E.W * 8, 8);
    for (const dx of [-900, 700]) { const x = CX + dx; rr(g, x - 160, GY - 140, 320, 26, 6); g.fillStyle = '#b07a4a'; g.fill(); rr(g, x - 160, GY - 190, 320, 22, 6); g.fill(); g.fillStyle = '#3a3d44'; g.fillRect(x - 140, GY - 114, 14, 80); g.fillRect(x + 126, GY - 114, 14, 80); }
    for (const dx of [-1300, -300, 400, 1300]) bush(g, CX + dx, GY - 40, 1.1, M, dx); });
  return done(GY, CX, M, (g) => { if (o.tree != null) layer(g, cam, 1.0, (g) => toonTree(g, CX + o.tree, GY + 10, 1.25, M, 31, { trunk: 380, w: 260, h: 200 })); });
}

// ---------------- Paris rooftops ----------------
export function paris(g, t, cam, o = {}) {
  const M = mood('sunset'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); circle(g, CX + 520, GY - 520, 70, '#ffe2a8'); lamplight(g, CX + 520, GY - 520, 400, '#ffd29a', 0.8); });
  layer(g, cam, 0.25, (g) => {   // tower silhouette
    const x = CX - 380, b = GY - 120, h = 760, c = alpha('#5a4a6a', 0.85);
    poly(g, [[x - 150, b], [x - 18, b - h], [x + 18, b - h], [x + 150, b], [x + 95, b], [x, b - 200], [x - 95, b]], c);
    g.fillStyle = c; g.fillRect(x - 110, b - 260, 220, 22); g.fillRect(x - 60, b - 500, 120, 18); g.fillRect(x - 4, b - h - 60, 8, 60);
  });
  layer(g, cam, 0.45, (g) => { const R = rng(5);
    for (let x = -E.W; x < E.W * 2.4;) { const w = 180 + R() * 160, h = 180 + R() * 140, b = GY - 60, c = mix('#e8d2b8', '#d9b89a', R());
      g.fillStyle = c; g.fillRect(x, b - h, w - 6, h);
      poly(g, [[x - 8, b - h], [x + 22, b - h - 80], [x + w - 34, b - h - 80], [x + w + 2, b - h]], '#6a7290');
      g.fillStyle = '#8a6a5a'; g.fillRect(x + w * 0.6, b - h - 120, 28, 50);
      for (let yy = b - h + 30; yy < b - 40; yy += 70) for (let xx = x + 22; xx < x + w - 40; xx += 52) { g.fillStyle = R() < 0.4 ? '#ffd892' : '#7a8ab0'; g.fillRect(xx, yy, 26, 42); g.fillStyle = '#2a2a30'; g.fillRect(xx - 3, yy + 40, 32, 5); }
      x += w; } });
  layer(g, cam, 0.9, (g) => { g.fillStyle = M.concrete; g.fillRect(-E.W * 2, GY - 60, E.W * 5, E.H * 2); g.fillStyle = M.asphalt; g.fillRect(-E.W * 2, GY + 80, E.W * 5, E.H * 2);
    for (const dx of [-700, 300, 1200]) { seg(g, [[CX + dx, GY - 60], [CX + dx, GY - 480]], 10, '#2a2a30'); circle(g, CX + dx, GY - 490, 22, '#ffe2a8'); lamplight(g, CX + dx, GY - 490, 200, '#ffd29a', 0.6); } });
  return done(GY, CX, M);
}

// ---------------- runway / fashion show ----------------
export function audienceRow(g, x0, x1, y, s, t, seed = 1, o = {}) {
  const R = rng(seed), cols = ['#d6533c', '#3f63c8', '#e8c04a', '#3f9a5a', '#9a5ad0', '#5bb4c8', '#e86aa0', '#f2efe6'];
  for (let x = x0; x < x1; x += 100 * s) { const c = cols[(R() * cols.length) | 0], bob = Math.sin(t * 2 + x) * 2;
    rr(g, x - 44 * s, y - 70 * s + bob, 88 * s, 120 * s, 30 * s); g.fillStyle = c; g.fill();
    circle(g, x, y - 104 * s + bob, 38 * s, '#131316');
    if (o.phones && R() < o.phones) { rr(g, x + 10 * s, y - 180 * s + bob, 30 * s, 50 * s, 5 * s); g.fillStyle = '#2a2d34'; g.fill(); g.fillStyle = '#bfe0ff'; g.fillRect(x + 14 * s, y - 175 * s + bob, 22 * s, 38 * s); }
    if (o.stars) { g.fillStyle = '#fff'; text(g, '★ ★', x, y - 108 * s + bob, { size: 22 * s, font: FONTS.ui, weight: 900, color: '#ffffff' }); } }
}
export function laufsteg(g, t, cam, o = {}) {
  const M = mood('indoorNight'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    backdrop(g, ['#3a2f5a', '#5a4a80']);
    for (let x = -E.W * 2; x < E.W * 3; x += 300) { g.fillStyle = alpha('#ffffff', 0.05); g.fillRect(x, -E.H, 150, GY + E.H); }
    rr(g, CX - 420, GY - 760, 840, 120, 12); g.fillStyle = '#f2efe6'; g.fill(); text(g, o.sign || 'PARIS FASHION WEEK', CX, GY - 700, { size: 54, font: FONTS.ui, weight: 900, color: '#2a2440', spacing: 6 });
    for (let i = -3; i <= 3; i++) { const x = CX + i * 380, a = Math.sin(t * 0.8 + i) * 0.25; g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[x - 20, -100], [x + 20, -100], [x + 260 * Math.sin(a) + 260, GY], [x + 260 * Math.sin(a) - 260, GY]], alpha('#fff3d0', 0.07)); g.restore(); }
  });
  layer(g, cam, 0.75, (g) => audienceRow(g, CX - 2200, CX + 2200, GY - 210, 0.9, t, 3, { stars: o.stars }));
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#2a2440'; g.fillRect(-E.W * 2, GY - 60, E.W * 5, E.H * 2); rr(g, -E.W * 2, GY - 40, E.W * 5, 70, 4); g.fillStyle = '#f6f1e6'; g.fill(); g.fillStyle = alpha('#000', 0.18); g.fillRect(-E.W * 2, GY + 20, E.W * 5, 10);
    softEllipse(g, CX, GY - 10, 700, 80, '#fff6d8', 0.5); });
  return done(GY + 0, CX, M, (g) => { if (o.front !== false) layer(g, cam, 1.3, (g) => audienceRow(g, CX - 2200, CX + 2200, GY + 330, 1.5, t, 7, { phones: o.phones, stars: o.stars })); });
}

// ---------------- world map ----------------
export const CONT = [[[-560, -220], [-380, -300], [-240, -260], [-260, -120], [-340, -40], [-300, 40], [-420, -20], [-520, -100]], [[-300, 60], [-220, 80], [-180, 200], [-240, 320], [-290, 220]], [[-60, -300], [120, -320], [380, -280], [520, -200], [460, -60], [300, -40], [200, -120], [60, -100], [-20, -180]], [[-40, -60], [100, -40], [140, 100], [60, 260], [-10, 140]], [[380, 140], [520, 120], [560, 230], [430, 260]]];
export function weltkarte(g, t, cam) {
  const M = mood('sunny'), GY = tGround(), CX = E.W / 2, CY = E.H / 2;
  layer(g, cam, 0.8, (g) => { backdrop(g, ['#5bb4d8', '#7fc8e6']); g.strokeStyle = alpha('#ffffff', 0.2); g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 120) { g.beginPath(); g.moveTo(x, -E.H); g.lineTo(x, E.H * 2); g.stroke(); } for (let y = -E.H; y < E.H * 2; y += 120) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
    for (const c of CONT) { poly(g, c.map(([x, y]) => [CX + x * 1.4 + 8, CY + y * 1.2 + 10]), alpha('#2a6a8a', 0.4)); poly(g, c.map(([x, y]) => [CX + x * 1.4, CY + y * 1.2]), '#9fcd7c'); } });
  return done(GY, CX, M);
}

// ---------------- music studio ----------------
export function studio(g, t, cam) {
  const M = mood('indoorDay'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.65, (g) => { wallFill(g, '#3a3d50', GY);
    for (let x = -E.W * 2; x < E.W * 3; x += 220) for (let y = GY - 760; y < GY - 120; y += 220) { rr(g, x + 10, y + 10, 200, 200, 10); g.fillStyle = (x / 220 + y / 220) % 2 ? '#4a4f68' : '#555a75'; g.fill(); }
    rr(g, CX + 380, GY - 620, 480, 260, 10); g.fillStyle = '#1e2030'; g.fill(); rr(g, CX + 396, GY - 604, 448, 228, 6); g.fillStyle = '#5a6aa0'; g.fill(); text(g, 'ON AIR', CX + 620, GY - 680, { size: 40, font: FONTS.ui, weight: 900, color: '#ef5a4a' });
    lamplight(g, CX - 400, GY - 500, 600, M.practical, 0.5); });
  layer(g, cam, 0.9, (g) => toonFloor(g, GY, M, { color: '#5a4a44', boards: 140 }));
  return done(GY, CX, M);
}

// ---------------- party living room ----------------
export function party(g, t, cam) {
  const M = mood('indoorNight'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.6, (g) => { wallFill(g, '#7a6a8a', GY); skirting(g, M, GY);
    nightWindow(g, CX + 380, GY - 700, 380, 260, M, t);
    for (let i = 0; i < 40; i++) { const x = CX - 1400 + i * 72, y = GY - 760 + Math.sin(i * 0.5) * 30; circle(g, x, y, 9, ['#ffd98c', '#ff9a8a', '#9fe0ff', '#c8f59a'][i % 4]); lamplight(g, x, y, 40, '#ffd98c', 0.5); }
    rr(g, CX - 900, GY - 420, 300, 420, 10); g.fillStyle = '#5a4a44'; g.fill(); lamplight(g, CX - 300, GY - 450, 700, M.practical, 0.45); });
  layer(g, cam, 0.9, (g) => toonFloor(g, GY, M, { color: '#6a5048', boards: 120 }));
  return done(GY, CX, M);
}

// ---------------- front door of Sam's house ----------------
export function haustuer(g, t, cam, o = {}) {
  const M = mood(o.mood || 'afternoon'), GY = tGround(), CX = E.W / 2, open = o.open || 0;
  layer(g, cam, 0.15, (g) => toonSky(g, M, { clouds: [[CX - 900, 120, 0.7]] }));
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = '#f0dcc4'; g.fillRect(CX - 1300, -E.H, 2600, GY + E.H);
    for (let y = GY - 40; y > -E.H; y -= 40) { g.fillStyle = alpha('#b89a7a', 0.35); g.fillRect(CX - 1300, y, 2600, 3); }
    g.fillStyle = '#d6c2a8'; g.fillRect(CX - 1300, GY - 30, 2600, 30);
    const dw = 260, dh = 520, dx = CX - dw / 2 + (o.doorX ?? 0), dy = GY - dh - 30;
    g.fillStyle = '#f6f1e6'; g.fillRect(dx - 24, dy - 24, dw + 48, dh + 24);
    g.fillStyle = '#3a2f2a'; g.fillRect(dx, dy, dw, dh); softEllipse(g, dx + dw / 2, dy + dh * 0.6, 150, 220, M.practical, 0.35 * open);
    const w = dw * (1 - 0.85 * open); g.fillStyle = '#2f6a4a'; g.fillRect(dx, dy, w, dh); g.fillStyle = alpha('#000', 0.15); g.fillRect(dx + w * 0.15, dy + 50, w * 0.7, 180); g.fillRect(dx + w * 0.15, dy + 280, w * 0.7, 190); circle(g, dx + w - 30, dy + dh * 0.55, 11, '#f2d27a');
    // doorbell camera
    rr(g, dx + dw + 50, dy + 210, 44, 90, 10); g.fillStyle = '#2a2d34'; g.fill(); circle(g, dx + dw + 72, dy + 238, 13, '#5a8ac8'); circle(g, dx + dw + 72, dy + 238, 5, '#131316');
    if ((t * 2) % 1 < 0.5) circle(g, dx + dw + 72, dy + 280, 5, '#ef5a4a');
    for (const sx of [-1, 1]) { toonWindow(g, CX + sx * 620 - 160, GY - 600, 320, 260, M, {}); }
    for (const sx of [-1, 1]) { rr(g, CX + sx * 280 - 60, GY - 130, 120, 130, 10); g.fillStyle = '#c4523f'; g.fill(); bush(g, CX + sx * 280, GY - 130, 0.8, M, sx + 5); }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = M.concrete; g.fillRect(-E.W * 2, GY, E.W * 5, E.H * 2); g.fillStyle = shade(M.concrete, -0.12); g.fillRect(-E.W * 2, GY, E.W * 5, 10); lawn(g, GY + 160, M); });
  return done(GY, CX, M);
}

// ---------------- living room (couch, pizza, TV) ----------------
export function wohnzimmer(g, t, cam, o = {}) {
  const M = mood('indoorNight'), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.6, (g) => { wallFill(g, '#5a6a8a', GY); skirting(g, M, GY);
    nightWindow(g, CX - 760, GY - 720, 320, 240, M, t);
    g.fillStyle = '#e8c04a'; g.fillRect(CX + 520, GY - 640, 200, 260); g.fillStyle = '#3f63c8'; g.fillRect(CX + 540, GY - 620, 160, 120);
    rr(g, CX - 520, GY - 330, 1040, 130, 30); g.fillStyle = '#c4523f'; g.fill(); rr(g, CX - 580, GY - 230, 1160, 170, 30); g.fillStyle = '#d6603f'; g.fill(); rr(g, CX - 620, GY - 300, 110, 240, 30); g.fill(); rr(g, CX + 510, GY - 300, 110, 240, 30); g.fill();
    lamplight(g, CX + 900, GY - 400, 700, M.practical, 0.5); lightPool(g, CX, GY - 200, 900, 300, '#9fc8ff', o.tv ? 0.25 : 0); });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: '#7e5f4c', boards: 140 }); softEllipse(g, CX, GY + 60, 800, 90, '#c8a070', 0.3); });
  const table = (g) => { const y = GY + 40; rr(g, CX - 360, y, 720, 34, 8); g.fillStyle = '#8a6a4a'; g.fill(); g.fillStyle = '#5a4430'; g.fillRect(CX - 330, y + 34, 22, 120); g.fillRect(CX + 308, y + 34, 22, 120);
    if (o.pizza !== false) { rr(g, CX - 180, y - 24, 260, 24, 3); g.fillStyle = '#e8d6b0'; g.fill(); g.fillStyle = '#e8a040'; g.beginPath(); g.ellipse(CX - 50, y - 26, 110, 18, 0, 0, Math.PI * 2); g.fill(); for (const d of [-60, -10, 40]) circle(g, CX - 50 + d, y - 28, 8, '#c4473b'); }
    if (o.phoneDown) { rr(g, CX + 160, y - 12, 90, 14, 4); g.fillStyle = '#2a2d34'; g.fill(); } };
  return done(GY, CX, M, (g) => { if (o.table !== false) layer(g, cam, 1.15, table); });
}

// ---------------- Brandt agency: tower outside / office inside ----------------
export function agentur(g, t, cam, o = {}) {
  const M = mood('indoorDay'), GY = tGround(), CX = E.W / 2;
  if (o.tower) {
    layer(g, cam, 0.15, (g) => toonSky(g, mood('sunny'), { clouds: [[CX - 700, 200, 0.8], [CX + 700, 100, 0.6]] }));
    layer(g, cam, 0.35, (g) => skyline(g, -E.W, E.W * 2.2, GY - 100, mood('sunny'), 13, { h: 500 }));
    layer(g, cam, 0.6, (g) => { rr(g, CX - 380, -1500, 760, GY + 1600, 6); g.fillStyle = '#6a5a9a'; g.fill();
      for (let y = -1480; y < GY - 120; y += 80) for (let x = CX - 360; x < CX + 360; x += 90) { g.fillStyle = (x * 3 + y) % 7 ? '#9a8ad0' : '#b9aae6'; g.fillRect(x, y, 80, 68); }
      rr(g, CX - 300, -760, 600, 120, 10); g.fillStyle = '#131316'; g.fill(); text(g, 'BRANDT AGENTUR', CX, -700, { size: 58, font: FONTS.ui, weight: 900, color: '#f7c948', spacing: 4 }); });
    layer(g, cam, 0.9, (g) => { g.fillStyle = M.concrete; g.fillRect(-E.W * 2, GY - 10, E.W * 5, E.H * 2); });
    return done(GY, CX, M);
  }
  layer(g, cam, 0.35, (g) => { const S = mood('sunny'); backdrop(g, S.sky); skyline(g, -E.W, E.W * 2.5, GY + 100, S, 17, { h: 600 }); });
  layer(g, cam, 0.65, (g) => { g.fillStyle = '#2a2a34'; g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, E.H * 2 + GY - 760); g.fillRect(-E.W * 2, GY - 100, E.W * 5, 200);
    for (let x = -E.W * 2; x < E.W * 3; x += 380) { g.fillStyle = '#3a3a46'; g.fillRect(x, GY - 770, 20, 680); }
    if (o.board) { const bx = CX - 760, by = GY - 640; rr(g, bx, by, 420, 300, 8); g.fillStyle = '#c9a77a'; g.fill(); o.board(g, bx, by, 420, 300); } });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: '#3a3440' }); softEllipse(g, CX, GY + 40, 900, 100, '#ffffff', 0.08); });
  const desk = (g) => { const x = CX + (o.deskX ?? 200), y = GY - 200; rr(g, x - 420, y, 840, 36, 6); g.fillStyle = '#131316'; g.fill(); g.fillStyle = '#9a5ad0'; g.fillRect(x - 420, y + 30, 840, 8); rr(g, x - 380, y + 36, 760, 170, 4); g.fillStyle = '#1e1e26'; g.fill(); };
  return done(GY, CX, M, (g) => { if (o.desk !== false) layer(g, cam, 1.02, desk); });
}

// ---------------- crime scene: studio at night with the open safe ----------------
export function tatort(g, t, cam, o = {}) {
  const r = garage(g, t, cam, {}), { GY, CX, M } = r;
  layer(g, cam, 0.85, (g) => { const x = CX + 120, y = GY - 340; rr(g, x - 170, y, 340, 340, 12); g.fillStyle = '#5a5f66'; g.fill(); rr(g, x - 150, y + 20, 300, 300, 8); g.fillStyle = '#1e1f24'; g.fill();
    g.fillStyle = '#2a2b30'; g.fillRect(x - 150, y + 160, 300, 8);
    const dk = o.open ?? 1; poly(g, [[x + 170, y], [x + 170 + 200 * dk, y + 30], [x + 170 + 200 * dk, y + 310], [x + 170, y + 340]], '#6a6f76'); circle(g, x + 170 + 110 * dk, y + 170, 36 * dk, '#3a3d44');
    if (o.cash) for (let i = 0; i < 4; i++) { rr(g, x - 120 + i * 60, y + 230, 54, 70, 4); g.fillStyle = '#5fb46a'; g.fill(); } });
  return r;
}

// ---------------- press hall / stage / backstage ----------------
export function pressesaal(g, t, cam, o = {}) {
  const M = mood('indoorNight'), GY = tGround(), CX = E.W / 2;
  if (o.backstage) {
    layer(g, cam, 0.6, (g) => { wallFill(g, '#3a3440', GY); for (let x = -E.W * 2; x < E.W * 3; x += 70) { g.fillStyle = (x / 70) % 2 ? '#a3333a' : '#8f2a31'; g.fillRect(x + (CX < 0 ? 0 : 0), -E.H, 70, GY + E.H); }
      g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W * 2, -E.H, E.W * 5, 120 + E.H);
      lamplight(g, CX + 300, GY - 600, 600, M.practical, 0.5); });
    layer(g, cam, 0.9, (g) => toonFloor(g, GY, M, { color: '#3a3036', boards: 160 }));
    return done(GY, CX, M);
  }
  layer(g, cam, 0.55, (g) => { wallFill(g, '#283a6a', GY);
    rr(g, CX - 700, GY - 820, 1400, 140, 10); g.fillStyle = '#16244a'; g.fill(); text(g, 'PRESSEKONFERENZ', CX, GY - 750, { size: 68, font: FONTS.ui, weight: 900, color: '#ffffff', spacing: 8 });
    for (let x = CX - 1200; x < CX + 1300; x += 180) for (let y = GY - 640; y < GY - 120; y += 120) { g.fillStyle = alpha('#ffffff', ((x + y) / 60) % 2 ? 0.06 : 0.1); g.fillRect(x, y, 170, 110); }
    // LIVE sign
    if (o.live !== false) { const on = (t * 1.2) % 1 < 0.75; rr(g, CX + 560, GY - 640, 220, 80, 12); g.fillStyle = on ? '#e8443a' : '#8a2a24'; g.fill(); text(g, '● LIVE', CX + 670, GY - 598, { size: 44, font: FONTS.ui, weight: 900, color: '#ffffff' }); }
    g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[CX - 40, -200], [CX + 40, -200], [CX + 420, GY], [CX - 420, GY]], alpha('#fff3d0', 0.12)); g.restore(); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#16203e'; g.fillRect(-E.W * 2, GY - 40, E.W * 5, E.H * 2); rr(g, -E.W * 2, GY - 60, E.W * 5, 40, 4); g.fillStyle = '#c9a77a'; g.fill(); softEllipse(g, CX, GY - 30, 500, 60, '#fff6d8', 0.5); });
  const podium = (g) => { const x = CX + (o.podiumX ?? 0); poly(g, [[x - 130, GY - 230], [x + 130, GY - 230], [x + 110, GY - 40], [x - 110, GY - 40]], '#f2efe6'); g.fillStyle = '#16244a'; g.fillRect(x - 80, GY - 180, 160, 64); circle(g, x, GY - 148, 24, '#f7c948');
    seg(g, [[x + 40, GY - 230], [x + 70, GY - 330]], 6, '#2a2d34'); rr(g, x + 56, GY - 362, 30, 42, 13); g.fillStyle = '#2a2d34'; g.fill(); };
  const cams = (g) => { for (let i = -6; i <= 6; i++) { const x = CX + i * 330, y = GY + 360; seg(g, [[x, y], [x, y + 300]], 12, '#2a2d34'); rr(g, x - 90, y - 90, 180, 110, 12); g.fillStyle = '#2a2d34'; g.fill(); circle(g, x + (i < 0 ? 100 : -100), y - 36, 40, '#131316'); circle(g, x + (i < 0 ? 100 : -100), y - 36, 22, '#3a4a6a');
    if (o.flash && ((t * 3 + i * 0.37) % 1) < 0.08) lamplight(g, x, y - 60, 300, '#ffffff', 1); } };
  return done(GY, CX, M, (g) => { if (o.podium !== false) layer(g, cam, 1.0, podium); if (o.cams) layer(g, cam, 1.35, cams); });
}

export const PLACES = { bus, baeckerei, regel, tueren, buero, restaurant, park, paris, laufsteg, weltkarte, studio, party, haustuer, wohnzimmer, agentur, tatort, pressesaal };
