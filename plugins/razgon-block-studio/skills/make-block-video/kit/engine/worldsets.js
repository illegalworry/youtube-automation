// engine/worldsets.js — locations for game-world videos. Every PIECE draws itself in the current world's look
// (blocky = rounded blocks + dark outlines + studs, voxel = pixel-textured cubes, royale = round glossy cartoon),
// so every LOCATION works in every world automatically.
// Location signature: name(g, t, cam, o) → { GY, CX, M, front(g) }   (GY = ground line where feet stand, CX = stage centre)
// Moods: gameDay (default), gameSunset, gameNight, gameAlarm (red emergency), gameStorm (purple), gameDead (grey), gameCave, gameRoom, gameRoomNight
import { E, V, W, S, mood, layer, clamp, lerp, rr, circle, poly, seg, alpha, shade, mix, linGrad, radGrad, glow, text, FONTS, F, noise } from './core.js';
import { voxBox, pixelTex, starShape } from './hero.js';

export const gGround = () => E.H * V(0.84, 0.7);
const OL = () => (W() === 'voxel' ? 0 : (S().outlineW ?? 5) * 0.8);
const ink = (M) => M.outline || '#2a2f3a';
function block(g, x, y, w, h, fill, M, o = {}) {           // the universal "block": rounded+outlined / voxel / cartoon
  const wd = W();
  if (wd === 'voxel') { voxBox(g, x, y, w, h, fill, o.side ?? 0.1, o.top ?? 0); if (o.tex !== false) pixelTex(g, x, y, w, h, fill, Math.max(2, Math.round(w / 16)), Math.max(2, Math.round(h / 16)), 0.09, o.seed || 1); return; }
  rr(g, x, y, w, h, o.r ?? (wd === 'royale' ? Math.min(w, h) * 0.12 : Math.min(10, w * 0.12, h * 0.12))); g.fillStyle = fill; g.fill();
  if (OL() && o.line !== false) { g.lineWidth = o.lw ?? OL(); g.strokeStyle = ink(M); g.lineJoin = 'round'; g.stroke(); }
  if (o.gloss !== false && wd === 'blocky' && w > 30 && h > 30) { rr(g, x + w * 0.06, y + h * 0.1, Math.min(10, w * 0.08), h * 0.55, 5); g.fillStyle = 'rgba(255,255,255,.22)'; g.fill(); }
}
function tri(g, pts, fill, M, lw) { poly(g, pts, fill); if (OL() && lw !== 0) { g.lineWidth = lw ?? OL(); g.strokeStyle = ink(M); g.lineJoin = 'round'; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.stroke(); } }

// ---------- sky ----------
export function sky(g, M, o = {}) {
  g.fillStyle = linGrad(g, 0, -E.H * 0.2, 0, E.H, M.sky); g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, E.H * 5);
  if (o.stars) for (let i = 0; i < 70; i++) { const x = ((i * 977) % 2600) - 340, y = ((i * 613) % 900) - 100, k = 0.5 + 0.5 * Math.sin((o.t || 0) * 2 + i); if (W() === 'voxel') { g.fillStyle = alpha('#ffffff', 0.4 + 0.5 * k); g.fillRect(x, y, 6, 6); } else circle(g, x, y, 2 + (i % 3), alpha('#ffffff', 0.35 + 0.5 * k)); }
}
export function sun(g, x, y, r, M, t = 0) {
  const wd = W();
  glow(g, x, y, r * 3.2, M.sun, 0.45);
  if (wd === 'voxel') { g.fillStyle = M.sun; g.fillRect(x - r, y - r, r * 2, r * 2); g.fillStyle = shade(M.sun, 0.35); g.fillRect(x - r * 0.6, y - r * 0.6, r * 1.2, r * 1.2); return; }
  if (wd === 'royale') { circle(g, x, y, r, M.sun); circle(g, x - r * 0.25, y - r * 0.25, r * 0.55, shade(M.sun, 0.35)); return; }
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + t * 0.3; seg(g, [[x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], r * 0.12, alpha(M.sun, 0.7)); }
  // cube sun: front face + lighter top + side
  const s = r * 1.5; poly(g, [[x - s / 2, y - s / 2], [x - s / 2 + s * 0.25, y - s / 2 - s * 0.2], [x + s / 2 + s * 0.25, y - s / 2 - s * 0.2], [x + s / 2, y - s / 2]], shade(M.sun, 0.45));
  poly(g, [[x + s / 2, y - s / 2], [x + s / 2 + s * 0.25, y - s / 2 - s * 0.2], [x + s / 2 + s * 0.25, y + s / 2 - s * 0.2], [x + s / 2, y + s / 2]], shade(M.sun, -0.12));
  rr(g, x - s / 2, y - s / 2, s, s, s * 0.08); g.fillStyle = M.sun; g.fill(); g.lineWidth = 3; g.strokeStyle = shade(M.sun, -0.3); g.stroke();
}
export function moon(g, x, y, r, M) { glow(g, x, y, r * 3, '#c8d0ff', 0.35); if (W() === 'voxel') { g.fillStyle = '#e8ecff'; g.fillRect(x - r, y - r, r * 2, r * 2); g.fillStyle = '#c8cce0'; g.fillRect(x - r * 0.5, y - r * 0.3, r * 0.5, r * 0.5); return; } circle(g, x, y, r, '#f4f2e0'); circle(g, x + r * 0.45, y - r * 0.2, r * 0.85, M.sky[0]); }
export function cloud(g, x, y, s, M) {
  const wd = W(), c = M.cloud, cs = M.cloudShade;
  if (wd === 'voxel') { g.fillStyle = alpha(c, 0.95); g.fillRect(x - 120 * s, y - 24 * s, 240 * s, 48 * s); g.fillRect(x - 70 * s, y - 52 * s, 130 * s, 30 * s); g.fillStyle = alpha(cs, 0.9); g.fillRect(x - 120 * s, y + 14 * s, 240 * s, 10 * s); return; }
  if (wd === 'royale') { for (const [dx, dy, r] of [[-70, 10, 42], [-20, -18, 56], [45, -4, 48], [90, 16, 34]]) circle(g, x + dx * s, y + dy * s, r * s, c); g.fillStyle = cs; rr(g, x - 110 * s, y + 16 * s, 230 * s, 34 * s, 17 * s); g.fill(); for (const [dx, dy, r] of [[-70, 10, 40], [-20, -18, 54], [45, -4, 46], [90, 16, 32]]) circle(g, x + dx * s, y + dy * s - 3 * s, r * s, c); return; }
  // blocky: stacked cubes with a lit top face (the reference look)
  const u = 34 * s; const cells = [[-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [-2, -1], [-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2]];
  for (const [i, j] of cells) { const cx = x + i * u, cy = y + j * u; g.fillStyle = cs; g.fillRect(cx, cy, u, u); g.fillStyle = c; g.fillRect(cx, cy, u - 2 * s, u - 5 * s); }
  g.lineWidth = 2 * s; g.strokeStyle = alpha(shade(cs, -0.15), 0.8); for (const [i, j] of cells) g.strokeRect(x + i * u, y + j * u, u, u);
}
// ---------- nature ----------
export function tree(g, x, base, s, M, seed = 1) {
  const wd = W(), L = M.leaf;
  if (wd === 'voxel') { const B = 40 * s; voxBox(g, x - B / 2, base - B * 3, B, B * 3, M.trunk, 0.15); pixelTex(g, x - B / 2, base - B * 3, B, B * 3, M.trunk, 2, 6, 0.15, seed);
    for (const [i, j] of [[-2, -5], [-1, -5], [0, -5], [1, -5], [-2, -4], [-1, -4], [0, -4], [1, -4], [-1, -6], [0, -6], [-3, -4], [2, -4], [-3, -5], [2, -5]]) { const c = L[(i * 3 + j * 7 + seed) % 3 < 0 ? 0 : (i * 3 + j * 7 + seed) % 3]; voxBox(g, x + i * B, base + j * B - B * 0.5, B, B, c, 0.1); pixelTex(g, x + i * B, base + j * B - B * 0.5, B, B, c, 3, 3, 0.2, seed + i + j); } return; }
  if (wd === 'royale') { block(g, x - 12 * s, base - 120 * s, 24 * s, 120 * s, M.trunk, M, { r: 8 * s }); for (const [dx, dy, r, k] of [[-46, -150, 56, 2], [40, -156, 60, 2], [0, -205, 66, 0], [-10, -150, 60, 1]]) { circle(g, x + dx * s, y0(base, dy, s), r * s, L[k]); } circle(g, x - 20 * s, base - 225 * s, 22 * s, alpha('#ffffff', 0.25)); return; }
  block(g, x - 14 * s, base - 110 * s, 28 * s, 110 * s, M.trunk, M);
  block(g, x - 62 * s, base - 200 * s, 124 * s, 100 * s, L[0], M); block(g, x - 44 * s, base - 260 * s, 88 * s, 70 * s, L[1], M);
}
const y0 = (base, dy, s) => base + dy * s;
export function bush(g, x, base, s, M) { if (W() === 'voxel') { voxBox(g, x - 40 * s, base - 40 * s, 80 * s, 40 * s, M.leaf[0], 0.12); pixelTex(g, x - 40 * s, base - 40 * s, 80 * s, 40 * s, M.leaf[0], 4, 2, 0.2, 3); return; } if (W() === 'royale') { circle(g, x - 24 * s, base - 22 * s, 30 * s, M.leaf[2]); circle(g, x + 18 * s, base - 26 * s, 34 * s, M.leaf[0]); return; } block(g, x - 46 * s, base - 50 * s, 92 * s, 50 * s, M.leaf[0], M); }
// ground strip: grass (+ optional road with yellow dashes + sidewalk)
export function ground(g, top, M, o = {}) {
  const wd = W(), x0 = -E.W, x1 = E.W * 2;
  if (wd === 'voxel') { const B = o.block || 64; for (let x = Math.floor(x0 / B) * B; x < x1; x += B) for (let j = 0; j < 8; j++) { const y = top + j * B; const c = j === 0 ? M.grass : j < 3 ? M.dirt : M.stone; voxBox(g, x, y, B, B, c, 0, 0); pixelTex(g, x, y, B, B, c, 8, 8, 0.14, (x / B) * 7 + j); if (j === 0) { g.fillStyle = M.grassTop; g.fillRect(x, y, B, B * 0.28); g.fillStyle = M.dirt; for (let k = 0; k < 8; k += 2) g.fillRect(x + k * B / 8, y + B * 0.28, B / 8, B * (0.08 + ((k * 3 + x) % 3) * 0.06)); } } }
  else { g.fillStyle = M.grass; g.fillRect(x0, top, x1 - x0, E.H * 2); g.fillStyle = M.grassTop; g.fillRect(x0, top, x1 - x0, 14); if (wd === 'blocky') { for (let x = -E.W; x < E.W * 2; x += 120) { g.fillStyle = alpha(shade(M.grass, -0.12), 0.6); g.fillRect(x, top + 40, 60, 10); } } }
  if (o.road) {
    const ry = o.road, rh = o.roadH || 150;
    if (o.walk !== false) { g.fillStyle = M.walk; g.fillRect(x0, ry - 46, x1 - x0, 46); g.fillStyle = shade(M.walk, -0.18); g.fillRect(x0, ry - 8, x1 - x0, 8); if (wd !== 'royale') for (let x = -E.W; x < E.W * 2; x += 90) { g.fillStyle = shade(M.walk, -0.1); g.fillRect(x, ry - 46, 3, 38); } }
    g.fillStyle = M.road; g.fillRect(x0, ry, x1 - x0, rh); g.fillStyle = shade(M.road, -0.2); g.fillRect(x0, ry, x1 - x0, 6);
    for (let x = -E.W; x < E.W * 2; x += 160) { g.fillStyle = M.line; g.fillRect(x, ry + rh / 2 - 5, 80, 10); }
    g.fillStyle = M.walk; g.fillRect(x0, ry + rh, x1 - x0, 30); g.fillStyle = M.grass; g.fillRect(x0, ry + rh + 30, x1 - x0, E.H);
  }
}
// ---------- buildings ----------
function windowPane(g, x, y, w, h, M, o = {}) {
  block(g, x, y, w, h, o.lit ? M.practical : M.glass, M, { gloss: false, lw: OL() * 0.7, r: W() === 'royale' ? 6 : 3, tex: false });
  if (W() !== 'voxel') { seg(g, [[x + w / 2, y], [x + w / 2, y + h]], 3, M.trim); seg(g, [[x, y + h / 2], [x + w, y + h / 2]], 3, M.trim); poly(g, [[x + w * 0.15, y + h * 0.85], [x + w * 0.45, y + h * 0.15], [x + w * 0.58, y + h * 0.15], [x + w * 0.28, y + h * 0.85]], 'rgba(255,255,255,.35)'); }
  else { g.fillStyle = M.trim; g.fillRect(x + w / 2 - 2, y, 4, h); g.fillRect(x, y + h / 2 - 2, w, 4); }
  if (o.shutters) { block(g, x - w * 0.32, y, w * 0.28, h, o.shutters, M, { gloss: false, tex: false }); block(g, x + w * 1.04, y, w * 0.28, h, o.shutters, M, { gloss: false, tex: false }); }
}
// a house seen from the front: walls, windows, door, roof (triangle or flat block roof)
export function house(g, cx, base, s, M, o = {}) {
  const w = (o.w || 420) * s, h = (o.h || 260) * s, x = cx - w / 2, y = base - h, wall = o.wall || M.wall, roof = o.roof || M.roof, wd = W();
  block(g, x, y, w, h, wall, M, { seed: 5 });
  if (wd === 'voxel') { const B = 32 * s; for (let i = 0; i <= w / B; i++) { voxBox(g, x - B * 0.5 + i * B, y - B, B, B, roof, 0.1); } for (let k = 1; k < 4; k++) for (let i = k; i <= w / B - k; i++) voxBox(g, x - B * 0.5 + i * B, y - B - k * B, B, B, shade(roof, k * 0.05), 0.1); }
  else tri(g, [[x - 30 * s, y + 4 * s], [cx, y - h * 0.62], [x + w + 30 * s, y + 4 * s]], roof, M);
  if (o.chimney) block(g, x + w * 0.72, y - h * 0.5, 40 * s, h * 0.42, M.roof2, M, { gloss: false });
  const ww = 70 * s, wh = 70 * s, rows = o.floors || 2;
  for (let r = 0; r < rows; r++) for (const fx of [0.2, 0.8]) windowPane(g, x + w * fx - ww / 2, y + h * (0.15 + r * 0.45), ww, wh, M, { lit: o.lit, shutters: o.shutters });
  if (o.door !== false) { const dw = 64 * s, dh = 110 * s; block(g, cx - dw / 2, base - dh, dw, dh, o.doorColor || '#a0582a', M, { gloss: false }); circle(g, cx + dw * 0.28, base - dh * 0.45, 5 * s, '#ffd23f'); }
  if (o.label) { block(g, cx - 110 * s, y + 8 * s, 220 * s, 46 * s, '#ffffff', M, { gloss: false, tex: false }); text(g, o.label, cx, y + 32 * s, { size: 32 * s, font: F('panel') === 'Press Start 2P' ? FONTS.pixel : FONTS.ui, weight: 900, color: o.labelColor || '#d9443a' }); }
}
// a city building for skylines / the town row (school, mall, shops)
export function building(g, x, base, w, h, M, o = {}) {
  const col = o.color || M.wall2;
  block(g, x, base - h, w, h, col, M, { seed: (x | 0) % 9 });
  const cw = o.cell || 46, cols = Math.max(1, Math.floor((w - 20) / cw)), rows = Math.max(1, Math.floor((h - (o.label ? 70 : 30)) / (cw + 8)));
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) windowPane(g, x + 12 + i * ((w - 24) / cols) + 4, base - h + (o.label ? 64 : 18) + j * (cw + 8), (w - 24) / cols - 8, cw - 6, M, { lit: o.lit && (i + j) % 3 !== 1 });
  if (o.label) { block(g, x + w * 0.15, base - h + 10, w * 0.7, 44, '#ffffff', M, { gloss: false, tex: false }); text(g, o.label, x + w / 2, base - h + 33, { size: 28, font: FONTS.ui, weight: 900, color: o.labelColor || shade(col, -0.45) }); }
  if (o.roofBlock !== false) block(g, x - 8, base - h - 18, w + 16, 22, shade(col, -0.25), M, { gloss: false });
}
// the far skyline: pale building silhouettes with window grids
export function skyline(g, base, M, o = {}) {
  const c = mix(M.sky[M.sky.length - 1], M.wall2, 0.35), c2 = shade(c, -0.08);
  for (let i = 0; i < 26; i++) { const x = -E.W * 0.6 + i * 150 + ((i * 53) % 40), h = 160 + ((i * 97) % 220), w = 110 + ((i * 31) % 50); g.fillStyle = i % 2 ? c : c2; g.fillRect(x, base - h, w, h + 400); g.fillStyle = alpha('#ffffff', 0.25); for (let a = 0; a < Math.floor(w / 30); a++) for (let b = 0; b < Math.floor(h / 40); b++) g.fillRect(x + 10 + a * 30, base - h + 14 + b * 40, 14, 20); }
}
// colourful roof triangles (the foreground row of the reference "whole town" shot)
export function roofRow(g, base, M, o = {}) {
  const cols = o.colors || ['#d9443a', '#3b6fd4', '#3fb34a', '#8a4ad4', '#f08a2c', '#e0c03a'];
  for (let i = 0; i < 18; i++) { const x = -E.W * 0.5 + i * 210, w = 240, h = 110 + (i % 3) * 18; tri(g, [[x, base + 20], [x + w / 2, base - h], [x + w, base + 20]], cols[(i * 5) % cols.length], M); }
}
export function car(g, x, base, s, M, o = {}) {
  const col = o.color || '#d9443a', f = o.facing || 1, wd = W();
  g.save(); g.translate(x, base); g.scale(s * f, s);
  block(g, -150, -88, 300, 60, col, M, { r: wd === 'royale' ? 24 : 12 }); block(g, -90, -138, 160, 56, col, M, { r: wd === 'royale' ? 20 : 10 });
  block(g, -78, -128, 66, 40, M.glass, M, { gloss: false, tex: false }); block(g, -4, -128, 64, 40, M.glass, M, { gloss: false, tex: false });
  for (const wx of [-90, 92]) { if (wd === 'voxel') { g.fillStyle = '#222'; g.fillRect(wx - 30, -50, 60, 50); g.fillStyle = '#888'; g.fillRect(wx - 12, -32, 24, 14); } else { circle(g, wx, -26, 32, '#2a2f3a'); circle(g, wx, -26, 14, '#b8bcc4'); } }
  block(g, 132, -78, 16, 18, '#ffe36a', M, { gloss: false, tex: false });
  g.restore();
}
export function mailbox(g, x, base, s, M) { block(g, x - 6 * s, base - 90 * s, 12 * s, 90 * s, '#6a5a4a', M, { gloss: false }); block(g, x - 26 * s, base - 120 * s, 52 * s, 36 * s, '#3b6fd4', M, { gloss: false }); block(g, x + 20 * s, base - 130 * s, 6 * s, 24 * s, '#d9443a', M, { gloss: false, tex: false }); }
export function fence(g, x0, x1, base, M, o = {}) { const h = o.h || 80, c = o.color || '#ffffff'; block(g, x0, base - h * 0.7, x1 - x0, 12, c, M, { gloss: false, tex: false }); for (let x = x0; x < x1; x += 34) block(g, x, base - h, 22, h, c, M, { gloss: false, tex: false, lw: OL() * 0.6 }); }
// studded floor (blocky), plank floor (voxel), smooth wood (royale)
export function floor(g, top, M, o = {}) {
  const wd = W(), c = o.color || M.floor; g.fillStyle = c; g.fillRect(-E.W, top, E.W * 3, E.H * 2);
  if (wd === 'blocky') for (let y = top + 24, r = 0; y < E.H + 200; y += 46, r++) for (let x = -E.W + (r % 2) * 30; x < E.W * 2; x += 60) { g.fillStyle = shade(c, -0.12); g.beginPath(); g.ellipse(x, y + 3, 16, 7, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = shade(c, 0.1); g.beginPath(); g.ellipse(x, y, 16, 7, 0, 0, Math.PI * 2); g.fill(); }
  else if (wd === 'voxel') { const B = 64; for (let x = -E.W; x < E.W * 2; x += B * 2) for (let y = top, r = 0; y < E.H + 200; y += B / 2, r++) { g.fillStyle = shade(c, ((x / B + r) % 3) * 0.04 - 0.04); g.fillRect(x + (r % 2) * B, y, B * 2 - 3, B / 2 - 3); } }
  else { for (let y = top; y < E.H + 200; y += 38) { g.fillStyle = shade(c, -0.06); g.fillRect(-E.W, y, E.W * 3, 3); } }
  g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-E.W, top, E.W * 3, 16);
}
export function wall(g, M, o = {}) { const c = o.color || M.wall; g.fillStyle = c; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); if (W() === 'voxel') { for (let x = -E.W; x < E.W * 2; x += 64) for (let y = -64; y < E.H; y += 64) pixelTex(g, x, y, 64, 64, c, 4, 4, 0.05, x + y); } else { g.fillStyle = shade(c, -0.05); for (let x = -E.W; x < E.W * 2; x += 180) g.fillRect(x, -E.H, 4, E.H * 3); } }
// ---------- room props ----------
export function bed(g, x, base, s, M, o = {}) {
  const col = o.color || '#3b6fd4', wd = W();
  block(g, x - 190 * s, base - 300 * s, 380 * s, 210 * s, o.wood || '#c8905a', M);                  // headboard
  if (wd === 'blocky') for (let i = 0; i < 6; i++) block(g, x - 165 * s + i * 58 * s, base - 300 * s - 22 * s, 40 * s, 24 * s, shade(o.wood || '#c8905a', -0.05), M, { gloss: false });
  block(g, x - 160 * s, base - 200 * s, 320 * s, 70 * s, '#ffffff', M, { gloss: false });            // pillow
  block(g, x - 210 * s, base - 140 * s, 420 * s, 140 * s, col, M);                                    // blanket
  if (wd === 'blocky') for (let i = 0; i < 7; i++) for (let j = 0; j < 2; j++) { g.fillStyle = shade(col, 0.12); g.beginPath(); g.ellipse(x - 170 * s + i * 56 * s, base - 110 * s + j * 50 * s, 14 * s, 6 * s, 0, 0, Math.PI * 2); g.fill(); }
}
export function nightstand(g, x, base, s, M, o = {}) {
  block(g, x - 60 * s, base - 120 * s, 120 * s, 120 * s, '#f0ece4', M); block(g, x - 46 * s, base - 100 * s, 92 * s, 36 * s, '#f0ece4', M, { gloss: false }); block(g, x - 46 * s, base - 54 * s, 92 * s, 36 * s, '#f0ece4', M, { gloss: false });
  block(g, x - 56 * s, base - 186 * s, 112 * s, 66 * s, '#d9443a', M); g.fillStyle = '#1a1010'; g.fillRect(x - 44 * s, base - 176 * s, 88 * s, 46 * s);
  text(g, o.time || '2:00', x, base - 152 * s, { size: 20 * s, font: FONTS.pixel, weight: 400, color: '#ff4a3a' });
}
export function roomWindow(g, x, y, w, h, M, o = {}) {
  block(g, x - 14, y - 14, w + 28, h + 28, M.trim, M);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); const SM = mood(o.night ? 'gameNight' : 'gameDay'); sky(g, SM, { stars: o.night, t: o.t });
  if (o.night) moon(g, x + w * 0.7, y + h * 0.3, 30, SM); else { sun(g, x + w * 0.75, y + h * 0.3, 24, SM, o.t || 0); cloud(g, x + w * 0.3, y + h * 0.4, 0.45, SM); }
  g.restore(); g.fillStyle = M.trim; g.fillRect(x + w / 2 - 5, y, 10, h); g.fillRect(x, y + h / 2 - 5, w, 10);
  if (o.curtains !== false) { block(g, x - 60, y - 30, 56, h + 60, o.curtain || '#e8704a', M); block(g, x + w + 4, y - 30, 56, h + 60, o.curtain || '#e8704a', M); }
}
export function bunting(g, x0, x1, y, M, t = 0) { const cols = ['#ff4a3a', '#ffd23f', '#3fb34a', '#3b6fd4', '#8a4ad4', '#3fe0ff']; seg(g, [[x0, y], [x1, y]], 3, alpha(M.outline, 0.5)); for (let i = 0, x = x0; x < x1 - 30; x += 52, i++) { const sw = Math.sin(t * 2 + i) * 2; tri(g, [[x, y], [x + 40, y], [x + 20 + sw, y + 46]], cols[i % cols.length], M, 2); } }
export function poster(g, x, y, w, h, M, o = {}) { block(g, x, y, w, h, o.bg || '#ff7a8a', M); const c = o.fig || '#3fb34a'; block(g, x + w * 0.38, y + h * 0.12, w * 0.24, w * 0.24, '#ffd23f', M, { gloss: false }); block(g, x + w * 0.3, y + h * 0.12 + w * 0.26, w * 0.4, h * 0.36, c, M, { gloss: false }); block(g, x + w * 0.32, y + h * 0.12 + w * 0.26 + h * 0.36, w * 0.14, h * 0.24, c, M, { gloss: false }); block(g, x + w * 0.54, y + h * 0.12 + w * 0.26 + h * 0.36, w * 0.14, h * 0.24, c, M, { gloss: false }); }
// ---------- game objects ----------
// floating obby platform; kind: 'normal' | 'lava' (glowing red) | 'checkpoint' | 'ice'
export function platform(g, x, y, w, M, o = {}) {
  const kind = o.kind || 'normal', col = kind === 'lava' ? '#ff3a2a' : kind === 'checkpoint' ? '#3fe05a' : kind === 'ice' ? '#bfefff' : o.color || '#8a4ad4', h = o.h || 34;
  if (kind === 'lava') glow(g, x + w / 2, y + h / 2, w * 0.9, '#ff5a1f', 0.5 + 0.25 * Math.sin((o.t || 0) * 5 + x));
  block(g, x, y, w, h, col, M);
  if (kind === 'lava') { g.fillStyle = 'rgba(255,220,120,.6)'; g.fillRect(x + 6, y + 4, w - 12, 6); }
  if (kind === 'checkpoint') { block(g, x + w / 2 - 4, y - 90, 8, 90, '#e8e8e8', M, { gloss: false }); poly(g, [[x + w / 2 + 4, y - 90], [x + w / 2 + 60, y - 72], [x + w / 2 + 4, y - 54]], '#3fe05a'); }
}
// lava hot tub / pool: a tub with glowing lava, rising bubbles and an optional warning sign
export function lavaPool(g, x, base, w, M, t = 0, o = {}) {
  const h = o.h ?? 90; glow(g, x + w / 2, base - h * 0.8, w * 0.85, '#ff5a1f', 0.55 + 0.1 * Math.sin(t * 5));
  block(g, x, base - h, w, h, o.tub || '#8a5a3a', M, { gloss: false });
  block(g, x + 14, base - h + 12, w - 28, 30, '#ff6a1a', M, { gloss: false, lw: 3 }); g.fillStyle = 'rgba(255,230,120,.75)'; g.fillRect(x + 24, base - h + 16, w - 48, 6);
  for (let i = 0; i < 7; i++) { const bx = x + 30 + ((i * 97) % (w - 60)), k = (t * 1.4 + i * 0.37) % 1; circle(g, bx, base - h + 14 - k * 50, 9 * (1 - k), alpha('#ffd06a', 1 - k)); }
  if (o.sign !== false) { block(g, x + w + 20, base - 150, 10, 150, '#6a5a4a', M, { gloss: false }); block(g, x + w - 20, base - 190, 120, 56, '#ffd23f', M, { gloss: false }); text(g, '⚠LAVA', x + w + 40, base - 162, { size: 26, font: FONTS.ui, weight: 900, color: '#d9443a' }); }
}
export function ore(g, x, y, B, kind = 'gold') { const c = { gold: '#ffd23f', diamond: '#5ae8ff', ruby: '#ff3a5a', emerald: '#3fe05a', coal: '#1a1a1a' }[kind] || kind; for (const [i, j] of [[1, 1], [5, 2], [3, 4], [6, 5], [2, 6]]) { g.fillStyle = c; g.fillRect(x + i * B / 8, y + j * B / 8, B / 8 * 1.6, B / 8 * 1.2); g.fillStyle = shade(c, 0.4); g.fillRect(x + i * B / 8, y + j * B / 8, B / 16, B / 16); } }
export function torch(g, x, y, s, t = 0) { glow(g, x, y - 40 * s, 160 * s, '#ffb04a', 0.45 + 0.08 * Math.sin(t * 13)); g.fillStyle = '#8a5a32'; g.fillRect(x - 6 * s, y - 40 * s, 12 * s, 50 * s); g.fillStyle = '#ffd06a'; g.fillRect(x - 8 * s, y - 56 * s, 16 * s, 16 * s); g.fillStyle = '#ff7a2a'; g.fillRect(x - 4 * s, y - 52 * s, 8 * s, 8 * s); }
export function chest(g, x, base, s, M, o = {}) { const c = o.color || '#c8905a'; block(g, x - 60 * s, base - 90 * s, 120 * s, 90 * s, c, M); block(g, x - 60 * s, base - 90 * s, 120 * s, 30 * s, shade(c, -0.1), M, { gloss: false }); block(g, x - 10 * s, base - 70 * s, 20 * s, 22 * s, '#ffd23f', M, { gloss: false, tex: false }); }
// supply drop / loot crate with a balloon (royale), rarity colours
export const RARITY = { common: '#b8bcc4', uncommon: '#3fe05a', rare: '#3a9aff', epic: '#b46aff', legendary: '#ffb02a', mythic: '#ffd23f' };
export function lootCrate(g, x, base, s, M, o = {}) { const c = RARITY[o.rarity || 'rare'] || o.rarity; glow(g, x, base - 60 * s, 160 * s, c, 0.35); block(g, x - 70 * s, base - 110 * s, 140 * s, 110 * s, '#3a4a6a', M); block(g, x - 70 * s, base - 110 * s, 140 * s, 26 * s, c, M, { gloss: false }); block(g, x - 16 * s, base - 70 * s, 32 * s, 32 * s, c, M, { gloss: false }); if (o.balloon) { seg(g, [[x, base - 110 * s], [x, base - 230 * s]], 3 * s, '#e8e8e8'); circle(g, x, base - 270 * s, 50 * s, '#3a9aff'); circle(g, x - 16 * s, base - 286 * s, 14 * s, 'rgba(255,255,255,.5)'); } }
// the closing storm wall (royale) — a translucent purple curtain with crackles at screen x
export function stormWall(g, x, M, t = 0, o = {}) { const w = o.w || 900; g.fillStyle = linGrad(g, x, 0, x + w, 0, ['rgba(140,60,255,0)', 'rgba(140,60,255,.55)', 'rgba(90,20,200,.85)']); g.fillRect(x, -E.H, w + E.W, E.H * 3); g.strokeStyle = 'rgba(220,180,255,.9)'; g.lineWidth = 4; for (let i = 0; i < 4; i++) { if (((t * 3 + i * 0.37) % 1) > 0.25) continue; g.beginPath(); let px = x + 100 + i * 180, py = -20; g.moveTo(px, py); for (let k = 0; k < 8; k++) { px += noise(t * 9 + k + i * 3, i) * 50; py += 140; g.lineTo(px, py); } g.stroke(); } }
// build piece (royale ramp/wall made of planks)
export function buildWall(g, x, base, s, M, o = {}) { const w = 220 * s, h = 220 * s; g.save(); g.globalAlpha *= o.ghost ? 0.45 : 1; block(g, x - w / 2, base - h, w, h, o.ghost ? '#6ad0ff' : '#c8905a', M); for (let i = 1; i < 4; i++) seg(g, [[x - w / 2 + 6, base - h + i * h / 4], [x + w / 2 - 6, base - h + i * h / 4]], 4 * s, o.ghost ? '#ffffff' : '#8a5a32'); g.restore(); }

// ======================= LOCATIONS =======================
const anchor = () => ({ GY: gGround(), CX: E.W / 2 });
// suburban street in front of the hero's house (reference: rules scenes)
export function suburb(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  layer(g, cam, 0.12, g => { sky(g, M, { stars: /Night/.test(o.mood || ''), t }); sun(g, CX - 520, GY - 760, 46, M, t); cloud(g, CX + 520, GY - 720, 0.9, M); cloud(g, CX - 120, GY - 820, 0.6, M); });
  layer(g, cam, 0.5, g => { house(g, CX - 900, GY - 120, 1.05, M, { wall: '#f0c8a8', roof: M.roof2, floors: 2 }); house(g, CX + 820, GY - 120, 1.05, M, { wall: M.wall2, roof: '#8a4ad4' }); });
  layer(g, cam, 0.7, g => { house(g, CX, GY - 110, 1.6, M, { wall: M.wall, roof: M.roof, chimney: true, shutters: '#3b6fd4', lit: o.lit, label: o.label }); fence(g, CX - 1400, CX - 380, GY - 110, M); fence(g, CX + 380, CX + 1400, GY - 110, M); tree(g, CX - 460, GY - 100, 1.1, M, 2); tree(g, CX + 470, GY - 100, 1.1, M, 5); });
  layer(g, cam, 0.85, g => { ground(g, GY - 110, M, { road: GY + 40, roadH: 150 }); mailbox(g, CX - 330, GY - 40, 1, M); if (o.car !== false) car(g, CX + 330, GY - 40, 1, M, { color: o.carColor || '#d9443a' }); });
  const front = (g) => { if (o.fgTree) layer(g, cam, 1.4, g => tree(g, CX - 980, GY + 260, 1.6, M, 7)); };
  return { GY, CX, M, front };
}
// the whole town row: skyline, school, shops, mall, houses, colourful roof row in front (reference: "WHOLE WORLD" shot)
export function cityRow(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  layer(g, cam, 0.1, g => { sky(g, M, { stars: /Night/.test(o.mood || ''), t }); if (!/Alarm|Dead/.test(o.mood || '')) sun(g, CX + 560, GY - 800, 48, M, t); cloud(g, CX - 600, GY - 760, 0.85, M); cloud(g, CX + 160, GY - 870, 0.6, M); cloud(g, CX + 820, GY - 650, 0.7, M); });
  layer(g, cam, 0.3, g => skyline(g, GY - 240, M));
  layer(g, cam, 0.55, g => {
    building(g, CX - 760, GY - 160, 330, 300, M, { color: '#d9604a', label: o.labels?.[0] ?? 'SCHOOL', labelColor: '#d9443a' });
    building(g, CX - 400, GY - 160, 170, 200, M, { color: M.wall2, label: o.labels?.[1] ?? 'SHOP' });
    house(g, CX - 110, GY - 160, 0.75, M, { wall: '#f0e0b8', roof: M.roof2, floors: 1 });
    building(g, CX + 150, GY - 160, 230, 250, M, { color: '#5aa0e0', label: o.labels?.[2] ?? 'MALL', labelColor: '#2a5aa8' });
    building(g, CX + 420, GY - 160, 200, 180, M, { color: '#e8b04a', label: o.labels?.[3] ?? 'FOOD' });
    house(g, CX + 760, GY - 160, 0.8, M, { wall: M.wall, roof: M.roof, floors: 1 });
    for (const k of [-980, -560, 40, 640, 990]) tree(g, CX + k, GY - 150, 0.65, M, (k / 10) | 0);
  });
  layer(g, cam, 0.8, g => { ground(g, GY - 160, M); roofRow(g, GY + 40, M); });
  if (o.crowd) layer(g, cam, 0.62, g => { for (let i = 0; i < o.crowd; i++) { const x = CX - 700 + i * (1400 / o.crowd), k = Math.sin(t * 9 + i) * 3; g.fillStyle = ['#ff4a2a', '#3b6fd4', '#3fb34a', '#ffd23f', '#8a4ad4'][i % 5]; g.fillRect(x - 6, GY - 186 + k, 12, 22); g.fillStyle = '#f1ece6'; g.fillRect(x - 6, GY - 200 + k, 12, 12); } });
  return { GY, CX, M, front: () => {} };
}
// kid's bedroom (day or night): window, bed, nightstand clock, poster, bunting (reference: "woke up" + respawn shots)
export function bedroom(g, t, cam, o = {}) {
  const night = !!o.night, M = mood(o.mood || (night ? 'gameRoomNight' : 'gameRoom')), { GY, CX } = anchor();
  layer(g, cam, 0.6, g => {
    wall(g, M, { color: o.wallColor }); g.fillStyle = shade(M.wall, -0.08); g.fillRect(-E.W, GY - 330, E.W * 3, 14);
    roomWindow(g, CX + 360, GY - 760, 330, 300, M, { night, t }); bunting(g, CX - 520, CX + 260, GY - 760, M, t);
    poster(g, CX - 860, GY - 720, 170, 240, M); if (o.door !== false) block(g, CX + 820, GY - 560, 200, 420, '#5aa0e0', M);
  });
  layer(g, cam, 0.85, g => { floor(g, GY - 140, M); if (o.rug !== false) { g.fillStyle = alpha('#ff7aa8', 0.8); rr(g, CX + 80, GY - 30, 460, 80, 12); g.fill(); } });
  layer(g, cam, 0.92, g => { bed(g, CX - 40, GY - 20, 1.25, M, { color: o.blanket || '#3b6fd4' }); nightstand(g, CX - 470, GY - 20, 1.15, M, { time: o.time || (night ? '2:00' : '7:00') }); });
  if (night) layer(g, cam, 0.6, g => { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, CX + 520, GY - 600, CX + 160, GY, ['rgba(160,180,255,.18)', 'rgba(160,180,255,0)']); poly(g, [[CX + 360, GY - 460], [CX + 690, GY - 460], [CX + 420, GY + 40], [CX - 140, GY + 40]], 'rgba(150,170,255,.12)'); g.restore(); });
  return { GY, CX, M, front: () => {}, bedTop: GY - 160 };
}
// rooftops + big sky (jumping / flying scenes)
export function rooftops(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  layer(g, cam, 0.1, g => { sky(g, M, { t }); sun(g, CX - 560, GY - 380, 44, M, t); for (const [x, y, s] of [[-500, -760, 0.8], [400, -820, 0.7], [800, -520, 0.9], [-120, -560, 0.5]]) cloud(g, CX + x, GY + y, s, M); });
  layer(g, cam, 0.4, g => { for (let i = 0; i < 8; i++) house(g, CX - 1100 + i * 320, GY + 160, 0.55, M, { wall: [M.wall, M.wall2, '#f0c8a8'][i % 3], roof: ['#d9443a', '#3b6fd4', '#8a4ad4', '#3fb34a'][i % 4], floors: 1 }); });
  layer(g, cam, 0.9, g => { tri(g, [[CX - 620, GY + 260], [CX - 300, GY - 10], [CX + 20, GY + 260]], M.roof, M); block(g, CX - 220, GY - 70, 44, 90, M.roof2, M); tri(g, [[CX + 200, GY + 260], [CX + 520, GY + 10], [CX + 840, GY + 260]], '#8a4ad4', M); });
  return { GY, CX, M, front: () => {}, roofA: [CX - 300, GY - 10], roofB: [CX + 520, GY + 10] };
}
// open sky (mid-air shots, falling, flying): clouds at several depths, optional far ground
export function openSky(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  layer(g, cam, 0.1, g => { sky(g, M, { t, stars: /Night/.test(o.mood || '') }); if (o.sun !== false) sun(g, CX - 400, GY - 160, 44, M, t); });
  layer(g, cam, 0.35, g => { for (let i = 0; i < 6; i++) cloud(g, CX - 900 + i * 380, GY - 700 + ((i * 271) % 500), 0.55 + (i % 3) * 0.15, M); });
  if (o.roofs) layer(g, cam, 0.6, g => { for (let i = 0; i < 6; i++) tri(g, [[CX - 1000 + i * 380, GY + 300], [CX - 860 + i * 380, GY + 140], [CX - 720 + i * 380, GY + 300]], ['#d9443a', '#3b6fd4', '#8a4ad4'][i % 3], M); });
  return { GY, CX, M, front: () => {} };
}
// top-down aerial neighbourhood (rows of houses + roads); returns rowY[] for placing tiny figures
export function aerial(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor(), rowY = [];
  layer(g, cam, 0.15, g => { sky(g, M, { t }); if (o.sun !== false) sun(g, CX + 700, 120, 40, M, t); });
  layer(g, cam, 0.6, g => {
    const top = V(250, 560); g.fillStyle = M.grass; g.fillRect(-E.W, top, E.W * 3, E.H * 2);
    for (let r = 0; r < 5; r++) { const y = top + 40 + r * 170; rowY.push(y + 112); g.fillStyle = M.road; g.fillRect(-E.W, y + 120, E.W * 3, 34); for (let x = -E.W; x < E.W * 2; x += 110) { g.fillStyle = M.line; g.fillRect(x, y + 135, 50, 5); }
      for (let i = 0; i < 14; i++) { const hx = -320 + i * 190 + (r % 2) * 90, hw = 120, col = ['#d9443a', '#3b6fd4', '#3fb34a', '#8a4ad4', '#f08a2c', '#e0c03a'][(i + r * 2) % 6]; block(g, hx, y + 50, hw, 60, M.wall, M, { gloss: false, lw: 3 }); tri(g, [[hx - 10, y + 54], [hx + hw / 2, y + 6], [hx + hw + 10, y + 54]], col, M, 3); if ((i + r) % 3 === 0) tree(g, hx + hw + 34, y + 110, 0.28, M, i); } }
  });
  return { GY, CX, M, front: () => {}, rowY };
}
// obby course: floating coloured platforms in the sky; o.platforms = [[x, y, w, kind], …] (stage coords)
export function obby(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  const P = o.platforms || [[CX - 640, GY - 40, 260, 'normal'], [CX - 240, GY - 160, 200, 'lava'], [CX + 120, GY - 280, 180, 'normal'], [CX + 460, GY - 420, 200, 'lava'], [CX + 760, GY - 560, 220, 'checkpoint']];
  layer(g, cam, 0.1, g => { sky(g, M, { t }); sun(g, CX - 760, GY - 760, 40, M, t); });
  layer(g, cam, 0.3, g => { for (let i = 0; i < 5; i++) cloud(g, CX - 900 + i * 450, GY - 820 + (i % 2) * 160, 0.6, M); });
  layer(g, cam, 0.9, g => P.forEach(([x, y, w, kind]) => platform(g, x, y, w, M, { kind, t })));
  return { GY, CX, M, front: () => {}, platforms: P };
}
// voxel plains: terrain columns with hills, trees, ores; works in every world (blocky/royale show it as stylised blocks)
export function plains(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor(), B = 64;
  layer(g, cam, 0.1, g => { sky(g, M, { t, stars: /Night/.test(o.mood || '') }); if (/Night/.test(o.mood || '')) moon(g, CX + 600, GY - 760, 40, M); else sun(g, CX + 600, GY - 760, 44, M, t); cloud(g, CX - 500, GY - 720, 0.9, M); cloud(g, CX + 200, GY - 840, 0.7, M); });
  layer(g, cam, 0.35, g => { for (let i = -16; i < 46; i++) { const h = 3 + Math.round(2 + noise(i * 0.25, 3) * 3); for (let j = 0; j < h; j++) { const c = j === h - 1 ? shade(M.grass, 0.15) : shade(M.dirt, 0.1); g.fillStyle = mix(c, M.sky[M.sky.length - 1], 0.45); g.fillRect(i * 48, GY - 140 - j * 48, 48, 48); } } });
  layer(g, cam, 0.7, g => { for (const k of [-760, -280, 520, 980]) tree(g, CX + k, GY - B * (k === -280 ? 2 : 1), 1.0, M, (k / 7) | 0); });
  layer(g, cam, 0.9, g => {
    for (let i = -24; i < 40; i++) { const x = i * B, hh = o.flat ? 0 : Math.max(0, Math.round(noise(i * 0.35, 7) * 1.4)), top = GY - hh * B;
      for (let j = 0; j < 9; j++) { const y = top + j * B, c = j === 0 ? M.grass : j < 3 ? M.dirt : M.stone; if (W() === 'voxel') { voxBox(g, x, y, B, B, c, 0, 0); pixelTex(g, x, y, B, B, c, 8, 8, 0.15, i * 13 + j); if (j === 0) { g.fillStyle = M.grassTop; g.fillRect(x, y, B, B * 0.28); } } else block(g, x + 1, y + 1, B - 2, B - 2, j === 0 ? M.grassTop : c, M, { gloss: false, lw: 2 }); if (j >= 4 && ((i * 7 + j * 3) % 11 === 0)) ore(g, x, y, B, ['gold', 'diamond', 'coal', 'ruby'][(i + j) & 3]); } }
  });
  return { GY, CX, M, front: () => {} };
}
// cave: dark stone walls, ores, torches, lava glow at the bottom
export function cave(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameCave'), { GY, CX } = anchor(), B = 72;
  layer(g, cam, 0.5, g => { g.fillStyle = M.sky[0]; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = -14; i < 40; i++) for (let j = -2; j < 16; j++) { const x = i * B, y = j * B; const c = shade(M.stone, -0.25 + ((i * 3 + j * 5) % 4) * 0.03); if (W() === 'voxel') { g.fillStyle = c; g.fillRect(x, y, B, B); pixelTex(g, x, y, B, B, c, 6, 6, 0.12, i * 7 + j); } else { g.fillStyle = c; g.fillRect(x, y, B - 3, B - 3); } if ((i * 13 + j * 7) % 17 === 0) ore(g, x, y, B, ['diamond', 'gold', 'emerald', 'ruby'][(i + j) & 3]); } });
  layer(g, cam, 0.6, g => { for (const k of [-600, 200, 900]) torch(g, CX + k, GY - 360, 1.3, t); });
  layer(g, cam, 0.9, g => { for (let i = -20; i < 40; i++) { const x = i * B; if (W() === 'voxel') { voxBox(g, x, GY, B, B * 4, M.stone, 0, 0); pixelTex(g, x, GY, B, B, M.stone, 8, 8, 0.15, i); } else block(g, x + 1, GY, B - 2, B * 4, M.stone, M, { gloss: false, lw: 2 }); } if (o.lava) lavaPool(g, CX + 300, GY + 6, 520, M, t); });
  return { GY, CX, M, front: () => {} };
}
// battle-royale island: rolling hills, round trees, colourful shacks, optional storm wall and loot
export function island(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  layer(g, cam, 0.1, g => { sky(g, M, { t }); sun(g, CX - 600, GY - 760, 46, M, t); for (const [x, y, s] of [[-300, -820, 0.8], [520, -740, 1], [900, -880, 0.6]]) cloud(g, CX + x, GY + y, s, M); });
  layer(g, cam, 0.3, g => { g.fillStyle = mix(M.grass, M.sky[2], 0.5); g.beginPath(); g.moveTo(-E.W, GY - 120); for (let x = -E.W; x <= E.W * 2; x += 60) g.lineTo(x, GY - 240 - Math.sin(x * 0.004) * 110 - Math.sin(x * 0.011) * 40); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill(); });
  layer(g, cam, 0.55, g => { house(g, CX - 700, GY - 120, 0.7, M, { wall: '#ffd06a', roof: '#3a9aff', floors: 1 }); house(g, CX + 620, GY - 130, 0.8, M, { wall: '#ff8a7a', roof: '#8a4ad4', floors: 1 }); for (const k of [-1000, -320, 200, 980]) tree(g, CX + k, GY - 110, 0.9, M, k); });
  layer(g, cam, 0.85, g => { ground(g, GY - 100, M); if (o.loot) lootCrate(g, CX + 380, GY - 40, 0.9, M, { rarity: o.loot, balloon: o.balloon }); });
  const front = (g) => { if (o.storm != null) layer(g, cam, 1, g => stormWall(g, o.storm, M, t)); };
  return { GY, CX, M, front };
}
// plain colourful backdrop for UI moments (calendar pages, title cards, explainers)
export function voidStage(g, t, cam, o = {}) {
  const M = mood(o.mood || 'gameDay'), { GY, CX } = anchor();
  layer(g, cam, 0.15, g => { sky(g, M, { t }); if (o.sun !== false) sun(g, CX + 640, GY - 760, 44, M, t); for (const [x, y, s] of [[-700, -700, 0.8], [-200, -380, 0.5], [500, -320, 0.7], [800, -600, 0.6], [-560, -200, 0.6]]) cloud(g, CX + x, GY + y, s, M); });
  return { GY, CX, M, front: () => {} };
}
export const PLACES = { suburb, cityRow, bedroom, rooftops, openSky, aerial, obby, plains, cave, island, voidStage };
