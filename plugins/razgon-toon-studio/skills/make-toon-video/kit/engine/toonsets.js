// engine/toonsets.js — the Toon set library: bright flat 2.5D vector pieces and ready-made locations.
// Pieces are plain draw functions in logical units. Locations draw their own parallax layers under a camera and
// return { GY, CX, M, front } — draw characters at depth 1 between the location and `front(g)` (things in front
// of the actors: ring ropes, a foreground pillar…). All colours come from mood(); see styles.js (toon moods).
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, alpha, shade, mix, rng, clamp, lerp, FONTS, text } from './core.js';

export const tGround = () => E.H * V(0.78, 0.7);

// ---------------- light & shadow helpers ----------------
export function softEllipse(g, x, y, rx, ry, col, a = 0.3) {
  g.save(); g.translate(x, y); g.scale(1, ry / Math.max(1, rx)); const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
  gr.addColorStop(0, alpha(col, a)); gr.addColorStop(0.55, alpha(col, a * 0.55)); gr.addColorStop(1, alpha(col, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
}
// warm/cool light pool (floor or wall), additive-ish but never blows out
export function lightPool(g, x, y, rx, ry, col, a = 0.35) { g.save(); g.globalCompositeOperation = 'soft-light'; softEllipse(g, x, y, rx, ry, col, a * 1.6); g.restore(); softEllipse(g, x, y, rx, ry, col, a * 0.5); }
export function lamplight(g, x, y, r, col, a = 0.5) { g.save(); g.globalCompositeOperation = 'lighter'; softEllipse(g, x, y, r, r, col, a * 0.35); g.restore(); }
export function sunGlow(g, x, y, r, M) { lamplight(g, x, y, r * 3, M.sun, 0.6); circle(g, x, y, r, M.sun); }
export function cloud(g, x, y, s, col = '#ffffff', a = 0.9) {
  g.save(); g.globalAlpha *= a; g.fillStyle = col; for (const [dx, dy, r] of [[0, 0, 46], [50, -18, 56], [105, 0, 44], [52, 12, 50], [-40, 10, 34], [145, 14, 30]]) { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// whole-sky gradient with optional sun and clouds (draw at depth ~0.1)
export function toonSky(g, M, o = {}) {
  backdrop(g, M.sky);
  if (o.sun) sunGlow(g, o.sun[0], o.sun[1], o.sun[2] || 50, M);
  (o.clouds || []).forEach(([x, y, s]) => cloud(g, x, y, s, M.cloud, o.cloudA ?? 0.85));
}

// ---------------- trees, bushes, grass ----------------
// cluster-of-circles tree: dark under-blobs, mid body, light highlight blobs (like the reference look)
export function toonTree(g, x, base, s = 1, M, seed = 1, o = {}) {
  const R = rng(seed), [dk, md, lt] = M.leaf, crownY = base - (o.trunk ?? 330) * s;
  g.fillStyle = M.trunk; g.beginPath(); g.moveTo(x - 9 * s, base); g.lineTo(x - 6 * s, crownY + 40 * s); g.lineTo(x + 6 * s, crownY + 40 * s); g.lineTo(x + 9 * s, base); g.closePath(); g.fill();
  g.fillStyle = alpha(shade(M.trunk, -0.3), 0.7); g.fillRect(x + 1 * s, crownY + 60 * s, 6 * s, base - crownY - 60 * s);
  const W = (o.w ?? 230) * s, H = (o.h ?? 150) * s, blobs = [];
  for (let i = 0; i < 16; i++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()); blobs.push([x + Math.cos(a) * W * 0.62 * d, crownY + Math.sin(a) * H * 0.6 * d, (48 + R() * 46) * s]); }
  blobs.sort((a, b) => a[1] - b[1]);
  for (const [bx, by, r] of blobs) circle(g, bx + r * 0.12, by + r * 0.18, r, dk);
  for (const [bx, by, r] of blobs) circle(g, bx, by, r * 0.92, md);
  for (const [bx, by, r] of blobs) if (by < crownY + H * 0.15) circle(g, bx - r * 0.22, by - r * 0.26, r * 0.48, alpha(lt, 0.9));
  for (let i = 0; i < 5; i++) { const [bx, by, r] = blobs[(i * 3) % blobs.length]; circle(g, bx - r * 0.35, by - r * 0.35, r * 0.2, alpha(lt, 0.7)); }
}
export function bush(g, x, base, s = 1, M, seed = 2) { const R = rng(seed), [dk, md, lt] = M.leaf; for (let i = 0; i < 6; i++) { const bx = x + (i - 2.5) * 34 * s, r = (34 + R() * 16) * s; circle(g, bx, base - r * 0.7, r, dk); circle(g, bx - 3 * s, base - r * 0.8, r * 0.88, md); circle(g, bx - r * 0.3, base - r * 1.15, r * 0.35, lt); } }
// striped lawn: alternating mower stripes fanning from the centre (draw from the fence/horizon down)
export function lawn(g, y0, M, o = {}) {
  const y1 = E.H * 3, cx = o.cx ?? E.W / 2;
  g.fillStyle = linGrad(g, 0, y0, 0, y0 + E.H * 0.5, [shade(M.grass, 0.06), M.grass]); g.fillRect(-E.W * 2, y0, E.W * 5, y1);
  g.fillStyle = alpha(shade(M.grass, 0.1), 0.55);
  for (let i = -7; i <= 7; i += 2) { const a = cx + i * 190, b = cx + (i + 1) * 190; poly(g, [[a, y0], [b, y0], [cx + (b - cx) * 4, y0 + 1600], [cx + (a - cx) * 4, y0 + 1600]], alpha(shade(M.grass, 0.08), 0.6)); }
  g.fillStyle = alpha(shade(M.grass, -0.25), 0.35); g.fillRect(-E.W * 2, y0, E.W * 5, 8);
}

// ---------------- buildings ----------------
// window pane with frame, mullion, diagonal reflections and optional poster/paper inside
export function toonWindow(g, x, y, w, h, M, o = {}) {
  const f = o.frame || M.frame, b = o.bar ?? 7;
  g.fillStyle = shade(f, -0.25); g.fillRect(x - b + 3, y - b + 4, w + b * 2, h + b * 2);
  g.fillStyle = f; g.fillRect(x - b, y - b, w + b * 2, h + b * 2);
  g.fillStyle = linGrad(g, x, y, x + w, y + h, o.glass || [shade(M.glass, 0.08), M.glass, shade(M.glass, -0.12)]); g.fillRect(x, y, w, h);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  if (o.inside) o.inside(g, x, y, w, h);
  g.fillStyle = alpha(M.glassHi, o.night ? 0.12 : 0.45); poly(g, [[x + w * 0.15, y + h], [x + w * 0.42, y], [x + w * 0.58, y], [x + w * 0.31, y + h]], alpha(M.glassHi, o.night ? 0.12 : 0.4));
  poly(g, [[x + w * 0.62, y + h], [x + w * 0.82, y], [x + w * 0.88, y], [x + w * 0.68, y + h]], alpha(M.glassHi, o.night ? 0.08 : 0.3));
  g.restore();
  if (o.cols !== 1) { g.fillStyle = f; g.fillRect(x + w / 2 - b * 0.45, y, b * 0.9, h); }
  if (o.sill !== false) { g.fillStyle = shade(f, 0.05); g.fillRect(x - b - 5, y + h + b - 2, w + b * 2 + 10, 7); g.fillStyle = alpha('#000', 0.12); g.fillRect(x - b - 5, y + h + b + 5, w + b * 2 + 10, 4); }
}
// red-brick/siding facade with rows of windows. o: {x0, x1, top, base, rows:[y…], winW, winH, step, sign, signX, door:{x,w,h}, seed, posters}
export function brickFacade(g, M, o) {
  const { x0, x1, top, base } = o, R = rng(o.seed || 4);
  g.fillStyle = M.brick; g.fillRect(x0, top, x1 - x0, base - top);
  g.fillStyle = alpha(M.brickLine, 0.75); for (let y = top + 6; y < base; y += o.lineStep || 11) g.fillRect(x0, y, x1 - x0, 2);
  g.fillStyle = alpha(shade(M.brick, 0.12), 0.5); g.fillRect(x0, top, x1 - x0, 6);
  const ww = o.winW || 104, wh = o.winH || 124, step = o.step || 160;
  for (const ry of o.rows || []) for (let x = x0 + (o.offset ?? 40); x + ww < x1; x += step) {
    if (o.door && x + ww > o.door.x - 20 && x < o.door.x + o.door.w + 20 && ry > base - (o.door.h + 40)) continue;
    const r1 = R(), r2 = R();
    toonWindow(g, x, ry, ww, wh, M, { night: o.night, inside: (o.posters ?? true) ? (g, wx, wy, w, h) => {
      if (r1 < 0.45) { g.fillStyle = '#e46a4f'; g.fillRect(wx + w * (r2 < 0.5 ? 0.12 : 0.6), wy + h * 0.45, w * 0.28, h * 0.32); }
      if (r2 < 0.5) { g.fillStyle = '#f3ede0'; g.fillRect(wx + w * (r1 < 0.45 ? 0.62 : 0.2), wy + h * 0.5, w * 0.22, h * 0.26); }
      if (o.night && r1 > 0.4) { g.fillStyle = alpha(M.practical, 0.7); g.fillRect(wx, wy, w, h); }
    } : null });
  }
  if (o.door) { const d = o.door; g.fillStyle = M.trim; g.fillRect(d.x - 16, base - d.h - 16, d.w + 32, d.h + 16); g.fillStyle = shade(M.glass, -0.05); g.fillRect(d.x, base - d.h, d.w, d.h);
    g.fillStyle = alpha(M.glassHi, 0.4); g.fillRect(d.x + d.w * 0.12, base - d.h + 10, d.w * 0.12, d.h - 10); g.fillStyle = shade(M.glass, -0.3); g.fillRect(d.x + d.w / 2 - 3, base - d.h, 6, d.h); g.fillRect(d.x, base - d.h * 0.55, d.w, 5); }
  if (o.sign) text(g, o.sign, o.signX ?? (x0 + x1) / 2, o.signY ?? top + 60, { size: o.signSize || 46, font: FONTS.ui, weight: 900, color: '#ffffff', spacing: 6, stroke: 0 });
  g.fillStyle = alpha('#000', 0.1); g.fillRect(x0, base - 28, x1 - x0, 28);
}
// simple suburban house (cream walls, brown roof) — used behind fences
export function toonHouse(g, cx, base, s, M, o = {}) {
  const w = 520 * s, h = 300 * s, wall = o.wall || '#e9e3d6', roof = o.roof || '#8a645a';
  poly(g, [[cx - w * 0.62, base - h], [cx, base - h - 210 * s], [cx + w * 0.62, base - h]], roof);
  poly(g, [[cx - w * 0.62, base - h], [cx, base - h - 210 * s], [cx, base - h - 196 * s], [cx - w * 0.55, base - h + 2]], alpha(shade(roof, 0.12), 0.8));
  g.fillStyle = wall; g.fillRect(cx - w / 2, base - h, w, h); g.fillStyle = alpha(shade(wall, -0.12), 0.8); g.fillRect(cx - w / 2, base - h, w, 18 * s);
  for (const dx of [-0.3, 0.3]) { g.fillStyle = shade(M.glass, 0.05); g.fillRect(cx + dx * w - 50 * s, base - h + 60 * s, 100 * s, 90 * s); g.fillStyle = alpha(M.glassHi, 0.45); g.fillRect(cx + dx * w - 30 * s, base - h + 60 * s, 18 * s, 90 * s); }
}
// wooden picket fence from x0 to x1 (top of planks at `top`, ground at `base`)
export function picketFence(g, x0, x1, top, base, M, o = {}) {
  const pw = o.plank || 26, gap = o.gap || 5, R = rng(o.seed || 7);
  g.fillStyle = shade(M.woodDark, -0.15); g.fillRect(x0, top + 18, x1 - x0, base - top - 18);
  for (let x = x0, i = 0; x < x1; x += pw + gap, i++) {
    const post = i % 9 === 0, w = post ? pw + 10 : pw, t0 = post ? top - 14 : top, c = post ? M.woodDark : mix(M.wood, M.woodDark, R() * 0.25);
    rr(g, x - (post ? 5 : 0), t0, w, base - t0, post ? 3 : 7); g.fillStyle = c; g.fill();
    g.fillStyle = alpha(shade(c, -0.25), 0.6); g.fillRect(x + w - 5 - (post ? 5 : 0), t0 + 6, 4, base - t0 - 6);
  }
  for (const k of [0.18, 0.62]) { const y = lerp(top, base, k); g.fillStyle = alpha(shade(M.woodDark, -0.1), 0.85); g.fillRect(x0, y, x1 - x0, 12); }
  g.fillStyle = alpha('#000', 0.12); g.fillRect(x0, base - 14, x1 - x0, 14);
}
export function balloon(g, x, y, r, col, t = 0, seed = 0) {
  const sw = Math.sin(t * 1.6 + seed) * 4; x += sw;
  seg(g, [[x, y + r * 1.15], [x + 3, y + r * 1.6], [x - 2, y + r * 2.2]], 1.6, alpha('#ffffff', 0.7));
  g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r * 0.88, r, 0, 0, Math.PI * 2); g.fill();
  poly(g, [[x - 5, y + r + 6], [x + 5, y + r + 6], [x, y + r - 2]], shade(col, -0.2));
  g.fillStyle = alpha('#ffffff', 0.55); g.beginPath(); g.ellipse(x - r * 0.32, y - r * 0.38, r * 0.18, r * 0.26, -0.5, 0, Math.PI * 2); g.fill();
}

// ---------------- vehicles ----------------
// boxy car seen from behind (or front with o.front). s = 1 → ~300 wide, ~190 tall. o.side: -1|1 shows a side panel.
export function toonCar(g, x, base, s, col, o = {}) {
  const W = 300 * s, bodyH = 92 * s, cabH = 64 * s, wr = 25 * s, sd = o.side || 0, dk = shade(col, -0.22), lt = shade(col, 0.16), glass = o.glass || '#2e3442';
  softEllipse(g, x + sd * 30 * s, base + 4 * s, W * 0.62, 22 * s, '#000', 0.32);
  const bTop = base - wr * 0.9 - bodyH, bBot = base - wr * 0.9;
  if (sd) {   // side panel on the side that faces the frame centre, receding up toward the vanishing point
    const ex = x + sd * (W / 2), dx = sd * 46 * s, dy = -26 * s, cx0 = x + sd * W * 0.42;
    poly(g, [[ex, bTop + 8 * s], [ex + dx, bTop + dy + 8 * s], [ex + dx, bBot + dy], [ex, bBot]], dk);
    poly(g, [[cx0, bTop + 2], [cx0 - sd * 12 * s + dx * 0.8, bTop - cabH + dy * 0.6], [x + sd * W * 0.38, bTop - cabH], [cx0, bTop - 4]], shade(col, -0.3));
    poly(g, [[ex, bTop + 8 * s], [ex + dx, bTop + dy + 8 * s], [cx0 + dx * 0.9, bTop + dy], [cx0, bTop]], shade(col, -0.1));
    circle(g, ex + dx * 0.7, bBot + dy + 6 * s, wr * 0.9, '#1b1c20');
  }
  for (const k of [-1, 1]) { rr(g, x + k * (W / 2 - 36 * s) - 22 * s, base - wr * 2, 44 * s, wr * 2, 10 * s); g.fillStyle = '#1b1c20'; g.fill(); }
  // cabin + rear window
  poly(g, [[x - W * 0.42, bTop + 2], [x - W * 0.38, bTop - cabH], [x + W * 0.38, bTop - cabH], [x + W * 0.42, bTop + 2]], col);
  rr(g, x - W * 0.38, bTop - cabH - 6 * s, W * 0.76, 12 * s, 5 * s); g.fillStyle = lt; g.fill();
  poly(g, [[x - W * 0.36, bTop - 4 * s], [x - W * 0.335, bTop - cabH + 12 * s], [x + W * 0.335, bTop - cabH + 12 * s], [x + W * 0.36, bTop - 4 * s]], glass);
  g.save(); g.beginPath(); g.moveTo(x - W * 0.36, bTop - 4 * s); g.lineTo(x - W * 0.335, bTop - cabH + 12 * s); g.lineTo(x + W * 0.335, bTop - cabH + 12 * s); g.lineTo(x + W * 0.36, bTop - 4 * s); g.clip();
  poly(g, [[x - W * 0.2, bTop], [x - W * 0.05, bTop - cabH], [x + W * 0.04, bTop - cabH], [x - W * 0.11, bTop]], alpha('#ffffff', 0.13)); g.restore();
  // body
  rr(g, x - W / 2, bTop, W, bodyH, 10 * s); g.fillStyle = col; g.fill();
  g.fillStyle = lt; g.fillRect(x - W / 2 + 6 * s, bTop, W - 12 * s, 10 * s);
  g.fillStyle = dk; g.fillRect(x - W / 2, bBot - 22 * s, W, 22 * s);
  const lamp = o.front ? '#f6f1df' : '#c4473b', lamp2 = o.front ? '#f2c66b' : '#e7964a';
  for (const k of [-1, 1]) { const lx = x + k * (W / 2 - 46 * s); rr(g, lx - 30 * s, bTop + 22 * s, 60 * s, 22 * s, 4 * s); g.fillStyle = lamp; g.fill(); g.fillStyle = lamp2; g.fillRect(lx + (k < 0 ? 12 : -30) * s, bTop + 38 * s, 18 * s, 6 * s);
    if (o.lightsOn) lamplight(g, lx, bTop + 33 * s, 90 * s, o.front ? '#fff2c0' : '#ff5a3a', 0.9); }
  if (o.front) { g.fillStyle = '#1f2026'; g.fillRect(x - 60 * s, bTop + 50 * s, 120 * s, 14 * s); }
  rr(g, x - 38 * s, bTop + 58 * s, 76 * s, 20 * s, 3 * s); g.fillStyle = '#f2f2ee'; g.fill();
}

// ---------------- ground ----------------
// asphalt parking lot from y0 down with perspective stall lines. o: {cx, stalls:[x…], spread}
export function parkingLot(g, y0, M, o = {}) {
  const cx = o.cx ?? E.W / 2;
  g.fillStyle = linGrad(g, 0, y0, 0, y0 + E.H * 0.6, [shade(M.asphalt, 0.04), M.asphalt, shade(M.asphalt, -0.06)]); g.fillRect(-E.W * 2, y0, E.W * 5, E.H * 3);
  g.fillStyle = M.concrete; g.fillRect(-E.W * 2, y0 - 18, E.W * 5, 20); g.fillStyle = alpha('#000', 0.15); g.fillRect(-E.W * 2, y0, E.W * 5, 6);
  const len = o.len ?? 150, sp = o.spread ?? 1.6;
  for (const x of o.stalls || []) { const xb = cx + (x - cx) * sp; poly(g, [[x - 3, y0 + 6], [x + 3, y0 + 6], [lerp(x, xb, 1) + 4, y0 + len], [lerp(x, xb, 1) - 4, y0 + len]], alpha(M.line, 0.9)); }
  if (o.cracks !== false) { g.strokeStyle = alpha(shade(M.asphalt, -0.25), 0.4); g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 900, y0 + 420); g.lineTo(cx - 200, y0 + 300); g.lineTo(cx + 700, y0 + 360); g.moveTo(cx + 200, y0 + 560); g.lineTo(cx + 1200, y0 + 470); g.stroke(); }
}
// plain floor with perspective boards/tiles (wood gym floor, garage concrete, classroom)
export function toonFloor(g, y0, M, o = {}) {
  const c = o.color || M.floor, cx = o.cx ?? E.W / 2;
  g.fillStyle = linGrad(g, 0, y0, 0, y0 + E.H * 0.5, [shade(c, 0.05), c, shade(c, -0.08)]); g.fillRect(-E.W * 2, y0, E.W * 5, E.H * 3);
  if (o.boards) { g.strokeStyle = alpha(shade(c, -0.25), 0.5); g.lineWidth = 2; for (let i = -14; i <= 14; i++) { const x = cx + i * (o.boards || 120); g.beginPath(); g.moveTo(x, y0); g.lineTo(cx + (x - cx) * 3.2, y0 + 1400); g.stroke(); } }
  if (o.tiles) { g.strokeStyle = alpha(shade(c, -0.2), 0.35); g.lineWidth = 2; for (let k = 1; k < 9; k++) { const y = y0 + (k * k) * 9; g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); } }
  g.fillStyle = alpha('#000', 0.14); g.fillRect(-E.W * 2, y0, E.W * 5, 10);
}

// ---------------- interiors ----------------
export function brickWall(g, x0, y0, x1, y1, base, line, o = {}) {
  const bw = o.bw || 84, bh = o.bh || 30, R = rng(o.seed || 3);
  g.fillStyle = line; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  for (let y = y0, r = 0; y < y1; y += bh, r++) for (let x = x0 - (r % 2 ? bw / 2 : 0); x < x1; x += bw) { g.fillStyle = mix(base, shade(base, R() < 0.5 ? -0.06 : 0.05), R()); g.fillRect(x + 2, y + 2, bw - 4, bh - 4); }
}
export function hangingBulb(g, x, ceil, len, M, t = 0, o = {}) {
  const sw = Math.sin(t * 1.3) * (o.sway ?? 2), bx = x + sw, by = ceil + len;
  seg(g, [[x, ceil], [bx, by - 14]], 2.5, '#2a2622');
  rr(g, bx - 7, by - 18, 14, 12, 2); g.fillStyle = '#5a5650'; g.fill();
  lamplight(g, bx, by + 6, o.r || 300, M.light, 0.9); g.fillStyle = '#fffbe8'; g.beginPath(); g.ellipse(bx, by + 6, 12, 15, 0, 0, Math.PI * 2); g.fill();
}
export function pendantLamp(g, x, y, M, o = {}) {
  const w = o.w || 120, col = o.color || '#2f4a3a';
  seg(g, [[x, -400], [x, y - 30]], 3, '#2a2622');
  poly(g, [[x - 18, y - 32], [x + 18, y - 32], [x + w / 2, y], [x - w / 2, y]], col);
  g.fillStyle = '#fff3cf'; g.beginPath(); g.ellipse(x, y, w / 2, 9, 0, 0, Math.PI * 2); g.fill();
  lamplight(g, x, y + 30, o.r || 340, M.light, 0.65);
}
export function nightWindow(g, x, y, w, h, M, t = 0) {
  g.fillStyle = '#2b2620'; g.fillRect(x - 10, y - 10, w + 20, h + 20);
  g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#16204a', '#24306a']); g.fillRect(x, y, w, h);
  const mx = x + w * 0.62, my = y + h * 0.42; lamplight(g, mx, my, h * 0.6, '#cdd8ff', 0.35);
  circle(g, mx, my, h * 0.17, '#f4f0d8'); circle(g, mx - h * 0.07, my - h * 0.03, h * 0.15, '#1e2a5c');
  const R = rng(5); for (let i = 0; i < 6; i++) circle(g, x + R() * w, y + R() * h * 0.8, 1.6 + R(), alpha('#ffffff', 0.5 + 0.5 * Math.sin(t * 2 + i)));
  g.fillStyle = '#2b2620'; g.fillRect(x + w / 2 - 4, y, 8, h);
}
export function woodDoor(g, x, base, w, h, M, o = {}) {
  const c = o.color || shade(M.wood, -0.35);
  g.fillStyle = shade(c, -0.35); g.fillRect(x - 12, base - h - 12, w + 24, h + 12);
  g.fillStyle = linGrad(g, x, 0, x + w, 0, [shade(c, 0.05), c]); g.fillRect(x, base - h, w, h);
  circle(g, x + w * 0.84, base - h * 0.48, 6, '#d8d0bf');
}
export function cardboardBox(g, x, base, w, h, o = {}) {
  const c = o.color || '#c49562', d = 0.32 * w;
  poly(g, [[x + w, base - h], [x + w + d * 0.6, base - h - d * 0.35], [x + w + d * 0.6, base - d * 0.35], [x + w, base]], shade(c, -0.22));
  poly(g, [[x, base - h], [x + d * 0.6, base - h - d * 0.35], [x + w + d * 0.6, base - h - d * 0.35], [x + w, base - h]], shade(c, 0.1));
  g.fillStyle = c; g.fillRect(x, base - h, w, h); if (o.tape !== false) { g.fillStyle = shade(c, -0.12); g.fillRect(x + w / 2 - 6, base - h, 12, h); }
}
export function shelfUnit(g, x, base, w, h, M, o = {}) {
  const c = o.color || shade(M.wood, -0.3), R = rng(o.seed || 9);
  g.fillStyle = shade(c, -0.25); g.fillRect(x, base - h, w, h); g.fillStyle = c; g.fillRect(x, base - h, 12, h); g.fillRect(x + w - 12, base - h, 12, h);
  const n = o.shelves || 4; for (let i = 0; i <= n; i++) { const y = base - h + (h - 10) * (i / n); g.fillStyle = shade(c, 0.12); g.fillRect(x, y, w, 12); }
  for (let i = 0; i < n; i++) { const y = base - h + (h - 10) * ((i + 1) / n); if (R() < 0.6) cardboardBox(g, x + 30 + R() * (w - 120), y, 60 + R() * 20, 40 + R() * 20, { tape: false }); if (R() < 0.6) { const cc = ['#c0453a', '#3a62a8', '#e8e4da'][Math.floor(R() * 3)]; rr(g, x + w - 80, y - 50, 44, 50, 4); g.fillStyle = cc; g.fill(); g.fillStyle = shade(cc, 0.25); g.fillRect(x + w - 80, y - 50, 44, 8); } }
}
export function bikeOnWall(g, x, y, s = 1) { ring(g, x - 70 * s, y, 62 * s, 5 * s, '#25262b'); ring(g, x + 70 * s, y, 62 * s, 5 * s, '#25262b'); seg(g, [[x - 70 * s, y], [x - 5 * s, y - 70 * s], [x + 70 * s, y]], 6 * s, '#8a3a32'); seg(g, [[x - 5 * s, y - 70 * s], [x + 30 * s, y - 50 * s]], 6 * s, '#8a3a32'); }
export function broom(g, x, base, s = 1) { seg(g, [[x, base - 320 * s], [x + 30 * s, base - 70 * s]], 6 * s, '#b48a54'); poly(g, [[x + 18 * s, base - 72 * s], [x + 44 * s, base - 72 * s], [x + 54 * s, base], [x + 4 * s, base]], '#c8a04a'); }

// ---------------- boxing ring (two halves so actors stand between the ropes) ----------------
export function ringBack(g, cx, base, w, M, o = {}) {
  const apronH = o.apronH || 170, deck = base - apronH, depth = o.depth || 120, wTop = w * 0.84;
  poly(g, [[cx - w / 2, deck], [cx - wTop / 2, deck - depth], [cx + wTop / 2, deck - depth], [cx + w / 2, deck]], o.canvas || '#d9d2c4');
  for (const k of [-1, 1]) { g.fillStyle = '#5a5a60'; g.fillRect(cx + k * wTop / 2 - 7, deck - depth - 250, 14, 250); rr(g, cx + k * wTop / 2 - 13, deck - depth - 260, 26, 200, 8); g.fillStyle = k < 0 ? '#c8443a' : '#3f63c8'; g.fill(); }
  for (const [i, c] of [[0, '#3f63c8'], [1, '#f2efe8'], [2, '#c8443a']].map(([i, c]) => [i, c])) { const y = deck - depth - 220 + i * 70; seg(g, [[cx - wTop / 2, y], [cx + wTop / 2, y]], 6, c); }
  return { deck, back: deck - depth };
}
export function ringFront(g, cx, base, w, M, o = {}) {
  const apronH = o.apronH || 170, deck = base - apronH;
  g.fillStyle = o.apron || '#2f4f8f'; g.fillRect(cx - w / 2, deck, w, apronH); g.fillStyle = alpha('#000', 0.18); g.fillRect(cx - w / 2, deck, w, 16);
  if (o.label !== '') text(g, o.label || 'EASTSIDE BOXING', cx, deck + apronH * 0.55, { size: o.labelSize || 64, font: FONTS.ui, weight: 900, color: '#e9e6df', spacing: 2 });
  for (const k of [-1, 1]) { g.fillStyle = '#5a5a60'; g.fillRect(cx + k * w / 2 - 9, deck - 300, 18, 300 + apronH); rr(g, cx + k * w / 2 - 18, deck - 330, 36, 260, 10); g.fillStyle = k < 0 ? '#3f63c8' : '#c8443a'; g.fill(); }
  for (const [i, c] of [[0, '#3f63c8'], [1, '#f2efe8'], [2, '#c8443a']]) { const y = deck - 290 + i * 88; seg(g, [[cx - w / 2, y], [cx + w / 2, y]], 8, c); g.fillStyle = alpha('#fff', 0.25); g.fillRect(cx - w / 2, y - 3, w, 2); }
}

// ---------------- underground parking ----------------
export function concretePillar(g, x, base, w, h, M, o = {}) {
  const top = base - h, d = w * 0.22;
  g.fillStyle = shade(M.concrete, -0.12); g.fillRect(x + w, top, d, h);
  g.fillStyle = linGrad(g, x, 0, x + w, 0, [shade(M.concrete, -0.05), shade(M.concrete, 0.04)]); g.fillRect(x, top, w, h);
  const sh = o.stripeH ?? 160; for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#1f1d1a' : '#b39a4a'; g.fillRect(x + i * (w / 9), base - sh, w / 9 + 0.5, sh); }
  if (o.label) text(g, o.label, x + w / 2, o.labelY ?? base - h * 0.62, { size: o.labelSize || 62, font: FONTS.ui, weight: 900, color: o.labelColor || '#3f6fe0' });
}
export function garageCeiling(g, yBot, M, o = {}) {
  const cx = o.cx ?? E.W / 2;
  g.fillStyle = shade(M.sky[0], -0.05); g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, yBot + E.H * 2);
  for (let i = -6; i <= 6; i++) { const x = cx + i * 420; poly(g, [[x - 60, -E.H], [x + 60, -E.H], [cx + (x - cx) * 0.45 + 25, yBot], [cx + (x - cx) * 0.45 - 25, yBot]], alpha(shade(M.sky[0], -0.22), 0.8)); }
  for (const [x, y, w] of o.lights || [[cx - 500, yBot - 150, 340], [cx + 520, yBot - 150, 340], [cx - 860, yBot - 70, 230], [cx + 120, yBot - 70, 230], [cx + 900, yBot - 70, 230]]) { rr(g, x - w / 2, y, w, 14, 3); g.fillStyle = '#fbfaf3'; g.fill(); lamplight(g, x, y + 30, w * 0.8, M.light, 0.45); }
}

// =====================================================================================
// READY-MADE LOCATIONS. Each: (g, t, cam, o) → { GY, CX, M, front(g) }.
// =====================================================================================
const done = (GY, CX, M, front) => ({ GY, CX, M, front: front || (() => {}) });

// school parking lot: brick school with rows of windows + "HIGH SCHOOL" sign, round trees, parked cars, asphalt
export function schoolLot(g, t, cam, o = {}) {
  const M = mood(o.mood || 'sunny'), GY = tGround(), CX = E.W / 2, curb = GY - V(150, 260);
  layer(g, cam, 0.15, (g) => toonSky(g, M, { clouds: [[CX - 700, curb - 760, 0.8], [CX + 500, curb - 820, 0.6]] }));
  layer(g, cam, 0.5, (g) => {
    brickFacade(g, M, { x0: CX - 2300, x1: CX + 2300, top: curb - V(900, 1300), base: curb - 10, rows: [curb - V(710, 950), curb - V(330, 520)], winW: 104, winH: 124, step: 160, offset: 40,
      door: { x: CX + 620, w: 180, h: 200 }, sign: o.sign ?? 'HIGH SCHOOL', signX: CX + 710, signY: curb - V(390, 580), seed: 11, night: (o.mood || '').startsWith('night') });
  });
  layer(g, cam, 0.62, (g) => { for (const [dx, s, sd] of [[-1000, 1.05, 2], [-330, 1.1, 5], [330, 1.08, 8], [1300, 1.0, 3]]) toonTree(g, CX + dx, curb - 6, s, M, sd, { trunk: V(420, 640) }); });
  layer(g, cam, 0.85, (g) => {
    parkingLot(g, curb, M, { stalls: [-1150, -830, -510, -190, 130, 450, 770, 1090].map(x => CX + x) });
    const cars = o.cars || [[-990, '#c4523f', 0], [-670, '#2e3036', 0], [-350, '#e2c35c', 0], [290, '#a9acb1', 1], [610, '#3f8a55', 1], [930, '#ecebe6', 1]];
    for (const [dx, c, sd] of cars) toonCar(g, CX + dx, curb + V(120, 150), 0.95, c, { side: dx < 0 ? 1 : -1, lightsOn: o.lightsOn && o.lightsOn.includes(dx) });
  });
  layer(g, cam, 1, (g) => { softEllipse(g, CX, GY + 10, 900, 90, M.light, 0.08); });
  return done(GY, CX, M);
}
// garage / workshop at night: grey brick wall, hanging bulb, moon window, door, shelf, bike on the wall
export function garage(g, t, cam, o = {}) {
  const M = mood(o.mood || 'garage'), GY = tGround(), CX = E.W / 2, ceil = V(100, 300);
  layer(g, cam, 0.7, (g) => {
    brickWall(g, -E.W, ceil, E.W * 2.2, GY + 4, M.brick, M.brickLine, { bw: 92, bh: 34, seed: 4 });
    g.fillStyle = '#17140f'; g.fillRect(-E.W, -E.H, E.W * 3.2, ceil + E.H);
    woodDoor(g, CX - V(700, 380), GY, 220, V(470, 520), M);
    bikeOnWall(g, CX - V(900, 300), GY - V(470, 640), 1.0);
    nightWindow(g, CX + V(380, 120), GY - V(600, 900), 200, 130, M, t);
    g.fillStyle = shade(M.wood, -0.2); g.fillRect(CX + V(220, 0), GY - V(330, 470), 720, 10);
    for (let i = 0; i < 9; i++) { const x = CX + V(260, 40) + i * 72, c = ['#e8c04a', '#4f86d8', '#d8463a', '#5fb46a', '#9a5ad0'][i % 5]; rr(g, x, GY - V(366, 506), 9, 34, 3); g.fillStyle = c; g.fill(); g.fillStyle = '#f2efe8'; g.fillRect(x, GY - V(352, 492), 9, 6); }
    shelfUnit(g, CX - V(260, 120), GY, 230, V(450, 520), M, { seed: 3 });
    broom(g, CX - V(400, 240), GY, 1.1);
    cardboardBox(g, CX - V(1020, 470), GY + 30, 190, 120);
    hangingBulb(g, CX + V(480, 220), ceil, V(160, 260), M, t, { r: V(520, 600) });
    softEllipse(g, CX + V(380, 160), GY - V(200, 300), 700, 420, M.light, 0.12);
  });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: M.floor }); g.strokeStyle = alpha('#000', 0.18); g.lineWidth = 2; g.beginPath(); g.moveTo(CX - 1400, GY + 260); g.lineTo(CX + 200, GY + 40); g.lineTo(CX + 2000, GY + 220); g.stroke(); softEllipse(g, CX + V(450, 200), GY + 80, 760, 160, M.light, 0.14); });
  return done(GY, CX, M);
}
// backyard party: blue sky, round trees, house behind a picket fence, balloons on the fence, striped lawn
export function backyard(g, t, cam, o = {}) {
  const M = mood(o.mood || 'sunny'), GY = tGround(), CX = E.W / 2, fenceBase = GY - V(170, 300), fenceTop = fenceBase - V(250, 300);
  layer(g, cam, 0.15, (g) => toonSky(g, M, { clouds: [[CX - 600, fenceTop - 520, 0.7]] }));
  layer(g, cam, 0.35, (g) => { toonHouse(g, CX + 40, fenceBase - 40, V(1.15, 1.3), M); });
  layer(g, cam, 0.45, (g) => { for (const [dx, s, sd] of [[-1300, 1.1, 1], [-700, 1.25, 4], [600, 1.25, 6], [1200, 1.1, 2], [1800, 1.2, 9], [-1900, 1.2, 12]]) toonTree(g, CX + dx, fenceBase, s, M, sd, { trunk: 200, w: 260, h: 200 }); });
  layer(g, cam, 0.7, (g) => {
    picketFence(g, CX - 2400, CX + 2400, fenceTop, fenceBase, M, { seed: 3 });
    const cols = ['#4f86d8', '#5fb46a', '#d8463a', '#9a5ad0', '#e88a3a', '#4f86d8', '#e8c04a', '#d8463a'];
    if (o.balloons !== false) for (let i = 0; i < 8; i++) balloon(g, CX - 1440 + i * 210, fenceTop - 8, 36, cols[i], t, i);
    if (o.shed !== false) { g.fillStyle = '#7f8c9a'; g.fillRect(CX + V(1000, 520), fenceTop - 140, 700, fenceBase - fenceTop + 260); g.fillStyle = '#93a0ad'; g.fillRect(CX + V(1000, 520), fenceTop - 140, 30, fenceBase - fenceTop + 260); }
  });
  layer(g, cam, 0.9, (g) => { lawn(g, fenceBase, M); softEllipse(g, CX + 700, GY + 120, 900, 140, M.leaf[0], 0.25); });
  return done(GY, CX, M);
}
// boxing gym: red brick wall, green pendant lamps, ring with coloured posts and ropes, wooden floor.
// Actors stand on the ring deck: use the returned `deck` as their y, then call front(g).
export function boxingGym(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gym'), GY = tGround(), CX = E.W / 2, w = V(1300, 980);
  let deck = GY - 170 - 40;
  layer(g, cam, 0.6, (g) => {
    brickWall(g, -E.W, -E.H, E.W * 2.5, GY, M.brick, M.brickLine, { bw: 70, bh: 26, seed: 8 });
    softEllipse(g, CX, GY - 560, 900, 420, M.light, 0.18);
    g.fillStyle = '#f4f2ee'; g.fillRect(CX - V(760, 520), GY - 560, 230, 170); g.fillStyle = '#8a7a6a'; g.fillRect(CX - V(780, 540), GY - 580, 270, 10);
    rr(g, CX - V(520, 330), GY - 540, 74, 92, 4); g.fillStyle = '#f6f3ec'; g.fill(); g.fillStyle = '#c8443a'; g.fillRect(CX - V(520, 330), GY - 540, 74, 16); text(g, '12', CX - V(483, 293), GY - 485, { size: 34, font: FONTS.ui, weight: 900, color: '#1d1d22' });
    for (const k of [-1, 0, 1]) pendantLamp(g, CX + k * 600, V(90, 260), M, { color: '#2f4a3a', r: 380 });
  });
  layer(g, cam, 0.85, (g) => { toonFloor(g, GY - 6, M, { color: M.wood, boards: 110 }); });
  layer(g, cam, 0.95, (g) => { softEllipse(g, CX, GY + 20, w * 0.7, 80, '#000', 0.25); deck = ringBack(g, CX, GY + 40, w, M).deck; });
  return { GY, CX, M, deck: GY + 40 - 170 - 50, front: (g) => layer(g, cam, 0.95, (g) => ringFront(g, CX, GY + 40, w, M, { label: o.label })) };
}
// underground car park: dark ceiling with beams and strip lights, beige wall with a blue stripe,
// numbered pillars (B2/B3) with hazard stripes, parked cars, dashed yellow lane line. Bright EXIT stair on the left.
export function undergroundParking(g, t, cam, o = {}) {
  const M = mood(o.mood || 'underground'), GY = tGround(), CX = E.W / 2, wallBase = GY - V(110, 200), wallTop = wallBase - V(370, 500);
  layer(g, cam, 0.55, (g) => {
    g.fillStyle = M.wall; g.fillRect(-E.W, wallTop, E.W * 3, wallBase - wallTop + 4);
    for (let x = -E.W; x < E.W * 2; x += 300) { g.fillStyle = alpha(shade(M.wall, -0.06), 0.8); g.fillRect(x, wallTop, 4, wallBase - wallTop); }
    g.fillStyle = '#6a84b8'; g.fillRect(-E.W, wallBase - V(250, 300), E.W * 3, 38);
    if (o.exit !== false) { const ex = CX - V(830, 520); g.fillStyle = '#f2ecd8'; g.fillRect(ex - 260, wallTop, 440, wallBase - wallTop + 4); poly(g, [[ex - 260, wallBase], [ex - 10, wallBase - 200], [ex + 180, wallBase - 200], [ex + 180, wallBase]], '#ddd5bf'); text(g, 'EXIT', ex - 50, wallTop + 70, { size: 54, font: FONTS.ui, weight: 900, color: '#3f6fe0' }); lamplight(g, ex - 40, wallTop + 200, 380, '#fff6dc', 0.6); }
    garageCeiling(g, wallTop + 2, M);
    toonCar(g, CX - V(380, 200), wallBase + 50, 0.92, '#a9adb6', { side: 1 });
    toonCar(g, CX + V(380, 260), wallBase + 50, 0.92, '#c9483c', {});
    toonCar(g, CX + V(1050, 700), wallBase + 50, 0.92, '#eceae4', { side: -1 });
  });
  layer(g, cam, 0.62, (g) => { concretePillar(g, CX - V(870, 470), wallBase + 70, 110, wallBase + 70 - wallTop + 40, M, { label: 'B2', labelSize: 50, stripeH: 100 }); concretePillar(g, CX + V(740, 450), wallBase + 70, 110, wallBase + 70 - wallTop + 40, M, { label: 'B3', labelSize: 50, stripeH: 100 }); });
  layer(g, cam, 0.85, (g) => {
    toonFloor(g, wallBase, M, { color: M.asphalt });
    for (const k of [-1, 1]) for (const dx of [500, 900]) seg(g, [[CX + k * dx, wallBase + 40], [CX + k * (dx + 120), wallBase + 140]], 6, alpha('#eeeae0', 0.85));
    for (let x = -E.W; x < E.W * 2; x += 120) { g.fillStyle = M.line; g.fillRect(x, GY - V(40, 80), 70, 14); }
    softEllipse(g, CX - 300, GY + 40, 700, 120, '#ffffff', 0.08);
  });
  return { GY, CX, M, front: (g) => { if (o.pillar) layer(g, cam, 1.12, (g) => concretePillar(g, CX + (o.pillarX ?? -70), E.H + 100, 150, E.H + 300, M, { label: o.pillarLabel ?? 'B3', labelY: E.H * 0.33, labelSize: 76, stripeH: 230 })); } };
}
// classroom: whiteboard, posters, big windows with sky + tree tops, desks, wooden floor
export function classroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'indoorDay'), GY = tGround(), CX = E.W / 2, top = GY - V(700, 1100);
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = M.wall; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H); g.fillStyle = shade(M.wall, -0.08); g.fillRect(-E.W, GY - 120, E.W * 3, 120); g.fillStyle = M.trim; g.fillRect(-E.W, GY - 124, E.W * 3, 10);
    rr(g, CX - 520, top + 120, 880, 360, 10); g.fillStyle = '#5a5f66'; g.fill(); rr(g, CX - 505, top + 135, 850, 330, 6); g.fillStyle = o.board || '#f7f7f4'; g.fill();
    g.fillStyle = '#7a8088'; g.fillRect(CX - 450, top + 470, 760, 12);
    for (const [dx, c] of [[-760, '#e8c04a'], [-660, '#4f86d8']]) { g.fillStyle = c; g.fillRect(CX + dx, top + 160, 80, 110); }
    toonWindow(g, CX + 560, top + 80, 260, 380, M, { glass: [M.sky[0], M.sky[1]], inside: (g, x, y, w, h) => { circle(g, x + 60, y + h - 30, 110, M.leaf[1]); circle(g, x + 200, y + h, 90, M.leaf[0]); } });
    toonWindow(g, CX + 900, top + 80, 260, 380, M, { glass: [M.sky[0], M.sky[1]] });
    lightPool(g, CX + 800, GY + 60, 500, 120, M.light, 0.25);
    if (o.onBoard) o.onBoard(g, CX - 505, top + 135, 850, 330);
  });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: M.wood, boards: 140 }); });
  return done(GY, CX, M);
}
// suburban street: houses, sidewalk, road, round trees, lamp posts
export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'sunny'), GY = tGround(), CX = E.W / 2, walk = GY - V(120, 220);
  const night = (o.mood || '').startsWith('night');
  layer(g, cam, 0.15, (g) => toonSky(g, M, { clouds: night ? [] : [[CX - 400, walk - 700, 0.8], [CX + 700, walk - 640, 0.6]], sun: night ? [CX + 600, walk - 680, 40] : null }));
  layer(g, cam, 0.45, (g) => { for (const [dx, wall, roof] of [[-1500, '#e9e3d6', '#8a645a'], [-800, '#d6dfe6', '#5a6a80'], [-100, '#f0dcc4', '#9a5a4a'], [600, '#e2e8d6', '#6a7a5a'], [1300, '#e9e3d6', '#7a5a6a']]) toonHouse(g, CX + dx, walk - 40, 1.0, M, { wall: night ? shade(wall, -0.45) : wall, roof }); });
  layer(g, cam, 0.6, (g) => { for (const [dx, s, sd] of [[-1150, 1, 3], [-450, 0.95, 6], [250, 1.05, 2], [950, 1, 7]]) toonTree(g, CX + dx, walk - 20, s, M, sd, { trunk: 260 }); });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = M.concrete; g.fillRect(-E.W * 2, walk - 40, E.W * 5, 60); g.fillStyle = shade(M.concrete, -0.15); g.fillRect(-E.W * 2, walk + 16, E.W * 5, 10);
    g.fillStyle = M.asphalt; g.fillRect(-E.W * 2, walk + 26, E.W * 5, E.H * 2);
    for (let x = -E.W; x < E.W * 2; x += 260) { g.fillStyle = alpha(M.line, 0.8); g.fillRect(x, GY + V(90, 150), 140, 12); }
    for (const dx of [-800, 500]) { seg(g, [[CX + dx, walk], [CX + dx, walk - 470]], 10, '#3a3d44'); seg(g, [[CX + dx, walk - 470], [CX + dx + 60, walk - 480]], 8, '#3a3d44'); rr(g, CX + dx + 40, walk - 490, 54, 20, 6); g.fillStyle = night ? '#fff0c0' : '#d8dde2'; g.fill(); if (night) { lamplight(g, CX + dx + 66, walk - 470, 360, M.light, 0.8); softEllipse(g, CX + dx + 66, walk + 10, 260, 60, M.light, 0.35); } }
  });
  return done(GY, CX, M);
}
// bedroom: wall, bed, window (day or night), poster, lamp
export function bedroom(g, t, cam, o = {}) {
  const night = o.night ?? true, M = mood(o.mood || (night ? 'indoorNight' : 'indoorDay')), GY = tGround(), CX = E.W / 2;
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = M.wall; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H); g.fillStyle = shade(M.wall, -0.1); g.fillRect(-E.W, GY - 90, E.W * 3, 90);
    if (night) nightWindow(g, CX + V(300, 80), GY - V(620, 900), 300, 230, M, t); else toonWindow(g, CX + V(300, 80), GY - V(620, 900), 300, 230, M, { glass: [M.sky[0], M.sky[1]] });
    g.fillStyle = '#d8463a'; g.fillRect(CX - V(620, 380), GY - 560, 150, 200); g.fillStyle = '#f2efe8'; g.fillRect(CX - V(600, 360), GY - 520, 110, 60);
    const bx = CX - V(260, 380); rr(g, bx, GY - 230, 560, 160, 12); g.fillStyle = shade(M.wood, -0.1); g.fill(); rr(g, bx - 10, GY - 340, 40, 340, 8); g.fill();
    rr(g, bx + 20, GY - 270, 520, 90, 20); g.fillStyle = '#5a7ac8'; g.fill(); rr(g, bx + 30, GY - 300, 120, 50, 18); g.fillStyle = '#f2efe8'; g.fill();
    rr(g, CX + V(560, 300), GY - 170, 120, 170, 6); g.fillStyle = shade(M.wood, -0.2); g.fill(); seg(g, [[CX + V(620, 360), GY - 170], [CX + V(620, 360), GY - 260]], 5, '#2a2622');
    poly(g, [[CX + V(590, 330), GY - 300], [CX + V(650, 390), GY - 300], [CX + V(670, 410), GY - 250], [CX + V(570, 310), GY - 250]], '#e8c04a');
    if (night) lamplight(g, CX + V(620, 360), GY - 260, 380, M.light, 0.8);
  });
  layer(g, cam, 0.9, (g) => { toonFloor(g, GY, M, { color: M.floor, boards: 150 }); });
  return done(GY, CX, M);
}
export const LOCATIONS = { schoolLot, garage, backyard, boxingGym, undergroundParking, classroom, street, bedroom };
