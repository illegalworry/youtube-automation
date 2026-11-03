// engine/glowsets.js — the Glow set library: soft 2.5D vector places + props in the reference look.
//
// Look rules baked in here: flat shapes with gentle 2-tone shading (lighter top, darker base), NO outlines, rounded
// corners, soft contact shadows, one key light with a big soft pool of light on the wall, glowing practicals (lamps,
// windows, screens), haze on far layers, depth of field (far layers blurred), floor darkening toward the camera.
//
// Every set: fn(g, t, cam, o) → { GY, M, ...anchors }. It draws everything BEHIND the characters through layer()/
// blurLayer() with the given camera, so shots only add characters (layer depth 1) and foregrounds. All colours come
// from mood() so styles re-grade them. GY = the floor line characters stand on (stage units, depth 1).
//   porch  kitchen  farmStand  park  monitorRoom  fogWindow  bedroom  street  classroom  studio
// Pieces (draw in the current transform, x/y = bottom-centre unless noted):
//   siding windowCurtain door wallLamp railing steps pumpkin pedestalTable candyBowl handSign tiles counter menuPoster
//   corkBoard mugTree kettle honestyBox awningStand crate chalkSign fence fieldRows cloud sunDisc telePole blobTree bench
//   streetLamp skylineSoft monitor keyboard mouse fogGlass bokeh bed nightLamp plant frame house car desk chair
//   bookshelf fridge clockWall door leaves lightPool softShadow haze
import { E, V, clamp, lerp, rng, noise, mood, alpha, shade, mix, rr, seg, poly, circle, ring, linGrad, radGrad, glow, backdrop, layer, blurLayer, veil, text, measure, FONTS, ease, prog } from './core.js';
// shrink a font size so the string fits maxW (long Russian/German words on posters, boxes and signs)
export const fitSize = (g, str, size, maxW, font = FONTS.sans, weight = 700) => Math.min(size, size * maxW / Math.max(1, measure(g, str, size, font, weight) + str.length * size * 0.08));

// ---------- light & atmosphere ----------
export function lightPool(g, x, y, r, color, a = 0.35, sy = 1) { g.save(); g.globalCompositeOperation = 'screen'; g.translate(x, y); g.scale(1, sy); g.fillStyle = radGrad(g, 0, 0, 0, r, [alpha(color, a), alpha(color, a * 0.45), alpha(color, a * 0.12), alpha(color, 0)]); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.restore(); }
export function softShadow(g, x, y, w, h = w * 0.16, a = 0.3) { g.save(); g.translate(x, y); g.scale(1, h / w); g.fillStyle = radGrad(g, 0, 0, 0, w, [alpha('#000', a), alpha('#000', a * 0.5), alpha('#000', 0)]); g.beginPath(); g.arc(0, 0, w, 0, Math.PI * 2); g.fill(); g.restore(); }
export function haze(g, y0, y1, color, a = 0.35) { g.fillStyle = linGrad(g, 0, y0, 0, y1, [alpha(color, 0), alpha(color, a), alpha(color, 0)]); g.fillRect(-E.W, y0, E.W * 3, y1 - y0); }
// floor that darkens toward the camera
function floorGrad(g, y0, y1, c0, c1) { g.fillStyle = linGrad(g, 0, y0, 0, y1, [c0, c1]); g.fillRect(-E.W, y0, E.W * 3, y1 - y0 + E.H); }
export function bokeh(g, t, o = {}) {
  const { seed = 3, count = 40, area = [0, 0, E.W, E.H], colors = ['#ffe2b0', '#ffc890', '#d8e4ff'], r0 = 6, r1 = 26, a = 0.35, drift = 4 } = o, r = rng(seed);
  g.save(); g.globalCompositeOperation = 'screen';
  for (let i = 0; i < count; i++) { const x = area[0] + r() * area[2] + noise(t * 0.2, i) * drift, y = area[1] + r() * area[3], rad = lerp(r0, r1, r() ** 2), c = colors[i % colors.length], tw = 0.75 + 0.25 * Math.sin(t * (0.6 + r()) + i);
    g.fillStyle = radGrad(g, x, y, 0, rad, [alpha(c, a * tw), alpha(c, a * 0.7 * tw), alpha(c, 0)]); g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// falling leaves (park, autumn) — deterministic
export function leaves(g, t, o = {}) {
  const { seed = 7, count = 26, colors = ['#c8763a', '#a85a30', '#d89a40'], area = [0, -E.H * 0.1, E.W, E.H * 1.1], speed = 50, size = 7, a = 0.85 } = o, r = rng(seed);
  for (let i = 0; i < count; i++) { const sp = speed * (0.6 + r() * 0.8), y = area[1] + ((r() * area[3] + t * sp) % area[3]), x = area[0] + r() * area[2] + Math.sin(t * 1.3 + i) * 30 + noise(t * 0.3, i) * 20, ang = t * (1 + r() * 2) + i, s = size * (0.6 + r() * 0.8);
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(1, Math.abs(Math.cos(t * 2 + i)) * 0.7 + 0.3); g.fillStyle = alpha(colors[i % colors.length], a); g.beginPath(); g.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
}

// ---------- house / porch pieces ----------
export function siding(g, x, y, w, h, M, o = {}) {           // horizontal clapboard wall (x,y = top-left)
  const { gap = 46, color = M.wall } = o;
  g.fillStyle = color; g.fillRect(x, y, w, h);
  for (let yy = y + gap; yy < y + h; yy += gap) { g.fillStyle = alpha(shade(color, -0.22), 0.55); g.fillRect(x, yy - 3, w, 3); g.fillStyle = alpha(shade(color, 0.12), 0.35); g.fillRect(x, yy, w, 2); }
}
export function windowCurtain(g, x, y, w, h, M, o = {}) {    // lit window with curtains (x,y = top-left)
  const { frame = shade(M.trim, -0.05), glass = '#7a3a40', lit = '#b8564a', curtain = '#9a3a3c', open = 0.18, sill = true, blinds = false } = o;
  rr(g, x - 14, y - 14, w + 28, h + 28, 6); g.fillStyle = frame; g.fill();
  g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(glass, 0.12), glass]); g.fillRect(x, y, w, h);
  lightPool(g, x + w / 2, y + h * 0.45, Math.max(w, h) * 0.55, lit, 0.35);
  if (blinds) { for (let yy = y + 8; yy < y + h; yy += 16) { g.fillStyle = alpha('#ffffff', 0.14); g.fillRect(x, yy, w, 7); } }
  else { const cw = w * (0.5 - open / 2); g.fillStyle = curtain; for (const [cx, dir] of [[x, 1], [x + w - cw, -1]]) { g.fillRect(cx, y, cw, h); for (let i = 1; i < 4; i++) { g.fillStyle = alpha(shade(curtain, -0.25), 0.35); g.fillRect(cx + (cw / 4) * i, y, 3, h); g.fillStyle = curtain; } }
    g.fillStyle = alpha('#ffd8a0', 0.45); g.fillRect(x + w / 2 - 3, y, 6, h); }
  seg(g, [[x + w / 2, y], [x + w / 2, y + h]], 8, frame);
  if (sill) { rr(g, x - 22, y + h + 8, w + 44, 14, 4); g.fillStyle = shade(frame, 0.08); g.fill(); }
}
export function door(g, x, y, w, h, M, o = {}) {             // x,y = bottom-left
  const { color = '#6a2a34', frame = M.trim, open = 0, light = '#ffd9a0', wreath = false, knob = '#e8c070' } = o;
  rr(g, x - 12, y - h - 12, w + 24, h + 12, 4); g.fillStyle = frame; g.fill();
  if (open > 0) { g.fillStyle = light; g.fillRect(x, y - h, w, h); lightPool(g, x + w / 2, y - h / 2, h * 0.8, light, 0.35 * open); }
  const dw = w * (1 - open * 0.85); g.fillStyle = linGrad(g, x, 0, x + dw, 0, [shade(color, 0.08), color]); g.fillRect(x, y - h, dw, h);
  g.fillStyle = alpha(shade(color, -0.25), 0.6); rr(g, x + dw * 0.14, y - h * 0.9, dw * 0.72, h * 0.36, 4); g.fill(); rr(g, x + dw * 0.14, y - h * 0.48, dw * 0.72, h * 0.4, 4); g.fill();
  circle(g, x + dw * 0.85, y - h * 0.48, 6, knob);
  if (wreath) { const cx = x + w / 2, cy = y - h * 0.72, r = w * 0.26; for (let i = 0; i < 22; i++) { const a = (i / 22) * Math.PI * 2; circle(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.22, ['#7a4a2e', '#a8692e', '#5a6a3a', '#8a3a2e'][i % 4]); } }
}
export function wallLamp(g, x, y, M, o = {}) {               // sconce centre x,y
  const { s = 1, on = 1, color = M.practical } = o;
  if (on) { lightPool(g, x, y + 60 * s, 760 * s, M.key, 0.5 * on); lightPool(g, x, y + 20 * s, 300 * s, M.key, 0.45 * on); lightPool(g, x, y, 120 * s, color, 0.6 * on); }
  rr(g, x - 26 * s, y - 44 * s, 52 * s, 88 * s, 12 * s); g.fillStyle = '#3a3440'; g.fill();
  rr(g, x - 17 * s, y - 34 * s, 34 * s, 68 * s, 10 * s); g.fillStyle = on ? color : '#6a6470'; g.fill();
  if (on) glow(g, x, y, 60 * s, color, 0.55 * on);
}
export function railing(g, x, y, w, h, M, o = {}) {         // x,y = bottom-left on the porch floor
  const { color = M.trim, gap = 30, posts = [] } = o;
  rr(g, x, y - h, w, 14, 4); g.fillStyle = shade(color, 0.06); g.fill();
  g.fillStyle = color; for (let xx = x + 10; xx < x + w - 6; xx += gap) g.fillRect(xx, y - h + 12, 9, h - 12);
  g.fillStyle = shade(color, -0.12); g.fillRect(x, y - 12, w, 12);
  for (const px of posts) { rr(g, px - 14, y - h * 2.6, 28, h * 2.6, 3); g.fillStyle = shade(color, 0.04); g.fill(); g.fillStyle = alpha('#000', 0.12); g.fillRect(px + 6, y - h * 2.6, 8, h * 2.6); }
}
export function steps(g, x, y, w, n, M, o = {}) {            // top-left at porch floor (x, y); steps go down toward the camera
  const { rise = 46, run = 40, color = '#6d5950' } = o;
  for (let i = 0; i < n; i++) { const yy = y + i * rise, xx = x - i * run * 0.8, ww = w + i * run * 1.6; rr(g, xx, yy, ww, rise - 4, 4); g.fillStyle = linGrad(g, 0, yy, 0, yy + rise, [shade(color, 0.1), shade(color, -0.08)]); g.fill(); g.fillStyle = alpha('#ffffff', 0.12); g.fillRect(xx + 4, yy, ww - 8, 3); }
}
export function pumpkin(g, x, y, s = 1, o = {}) {
  const { color = '#d8862e', face = true, lit = true } = o;
  softShadow(g, x, y + 2, 70 * s, 10 * s, 0.35);
  if (lit) glow(g, x, y - 40 * s, 120 * s, '#ffb050', 0.35);
  for (const [dx, w] of [[-26, 34], [26, 34], [-12, 38], [12, 38], [0, 40]]) { g.fillStyle = dx === 0 ? color : shade(color, -0.1 + Math.abs(dx) * -0.004); g.beginPath(); g.ellipse(x + dx * s, y - 42 * s, w * s, 42 * s, 0, 0, Math.PI * 2); g.fill(); }
  seg(g, [[x, y - 82 * s], [x + 6 * s, y - 98 * s]], 8 * s, '#5a6a3a');
  if (face) { const f = lit ? '#ffd27a' : shade(color, -0.4); poly(g, [[x - 22 * s, y - 52 * s], [x - 8 * s, y - 52 * s], [x - 15 * s, y - 64 * s]], f); poly(g, [[x + 22 * s, y - 52 * s], [x + 8 * s, y - 52 * s], [x + 15 * s, y - 64 * s]], f); g.fillStyle = f; g.beginPath(); g.moveTo(x - 26 * s, y - 38 * s); g.quadraticCurveTo(x, y - 18 * s, x + 26 * s, y - 38 * s); g.quadraticCurveTo(x, y - 28 * s, x - 26 * s, y - 38 * s); g.fill(); }
}
export function pedestalTable(g, x, y, s = 1, M, o = {}) {   // returns top y
  const { color = '#8c8ca8', h = 150 } = o; const top = y - h * s;
  softShadow(g, x, y, 90 * s, 10 * s, 0.3);
  poly(g, [[x - 46 * s, y], [x + 46 * s, y], [x + 8 * s, y - 14 * s], [x - 8 * s, y - 14 * s]], '#2a2630'); seg(g, [[x, y - 12 * s], [x, top]], 7 * s, '#2a2630');
  g.fillStyle = color; g.beginPath(); g.ellipse(x, top, 130 * s, 22 * s, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = alpha('#ffffff', 0.12); g.beginPath(); g.ellipse(x, top - 4 * s, 120 * s, 14 * s, 0, 0, Math.PI * 2); g.fill();
  return top;
}
export function candyBowl(g, x, y, s = 1, o = {}) {          // y = table top; fill 0..1 (candy left)
  const { color = '#c8302a', fill = 1, seed = 5 } = o, r = rng(seed), cc = ['#e85a8a', '#4a9ae8', '#f2c14a', '#5ac87a', '#e8823a', '#9a6ae8', '#e84a4a'];
  if (fill > 0) for (let i = 0; i < 46 * fill; i++) { const a = r() * Math.PI, rad = r(), cx = x + Math.cos(a) * 92 * s * rad, cy = y - 46 * s - Math.sin(a) * 28 * s * (0.4 + rad) * fill; g.save(); g.translate(cx, cy); g.rotate(r() * 6); const c = cc[i % cc.length]; g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, 11 * s, 7 * s, 0, 0, Math.PI * 2); g.fill(); poly(g, [[-9 * s, 0], [-17 * s, -6 * s], [-17 * s, 6 * s]], shade(c, -0.1)); poly(g, [[9 * s, 0], [17 * s, -6 * s], [17 * s, 6 * s]], shade(c, -0.1)); g.restore(); }
  g.fillStyle = linGrad(g, x - 110 * s, 0, x + 110 * s, 0, [shade(color, -0.1), color, shade(color, -0.18)]); g.beginPath(); g.moveTo(x - 112 * s, y - 50 * s); g.quadraticCurveTo(x - 100 * s, y - 2 * s, x - 40 * s, y); g.lineTo(x + 40 * s, y); g.quadraticCurveTo(x + 100 * s, y - 2 * s, x + 112 * s, y - 50 * s); g.closePath(); g.fill();
  g.fillStyle = shade(color, -0.25); g.beginPath(); g.ellipse(x, y - 50 * s, 112 * s, 9 * s, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = alpha('#ffffff', 0.25); g.beginPath(); g.ellipse(x - 60 * s, y - 28 * s, 10 * s, 16 * s, 0, 0, Math.PI * 2); g.fill();
}
// handwritten paper/card sign: x,y = centre. lines = ['PLEASE', 'TAKE ONE']
export function handSign(g, x, y, lines, o = {}) {
  const { w = 230, h = 150, color = '#ece6dc', ink = '#b0302e', size = 46, tilt = -0.03, easel = false, font = FONTS.hand, reveal = 1 } = o;
  g.save(); g.translate(x, y); g.rotate(tilt);
  if (easel) { seg(g, [[-w * 0.3, h * 0.45], [-w * 0.4, h * 1.4]], 6, '#3a2a2a'); seg(g, [[w * 0.3, h * 0.45], [w * 0.4, h * 1.4]], 6, '#3a2a2a'); }
  g.fillStyle = alpha('#000', 0.18); rr(g, -w / 2 + 5, -h / 2 + 7, w, h, 5); g.fill();
  rr(g, -w / 2, -h / 2, w, h, 5); g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, [shade(color, 0.04), shade(color, -0.06)]); g.fill();
  const n = lines.length, fs = Math.min(...lines.map(l => fitSize(g, l, size, w * 0.88, font)), size); lines.forEach((ln, i) => { const k = clamp(reveal * n - i); if (k <= 0) return; g.save(); if (k < 1) { g.beginPath(); g.rect(-w / 2, -h / 2, w * (0.1 + 0.9 * k), h); g.clip(); } text(g, ln, 0, (i - (n - 1) / 2) * size * 0.95 + 2, { size: fs, font, weight: 700, color: ink }); g.restore(); });
  g.restore();
}

// ---------- kitchen / office pieces ----------
export function tiles(g, x, y, w, h, M, o = {}) {            // subway tiles (x,y = top-left)
  const { color = shade(M.wall, 0.1), tw = 74, th = 38, line = shade(M.wall, -0.12) } = o;
  g.fillStyle = color; g.fillRect(x, y, w, h); g.fillStyle = alpha(line, 0.55);
  for (let r = 0, yy = y; yy < y + h; r++, yy += th) { g.fillRect(x, yy, w, 2.5); for (let xx = x + (r % 2 ? tw / 2 : 0); xx < x + w; xx += tw) g.fillRect(xx, yy, 2.5, th); }
}
export function counter(g, x, y, w, h, M, o = {}) {          // x,y = top-left of the worktop
  const { top = shade(M.trim, -0.02), front = shade(M.floor, 0.12), edge = '#a07850' } = o;
  g.fillStyle = front; g.fillRect(x, y + 16, w, h);
  g.fillStyle = linGrad(g, 0, y, 0, y + 18, [shade(top, 0.08), top]); g.fillRect(x, y, w, 18);
  g.fillStyle = edge; g.fillRect(x, y + 16, w, 7);
  g.fillStyle = alpha('#000', 0.12); for (let xx = x + 220; xx < x + w; xx += 240) g.fillRect(xx, y + 34, 3, h - 30);
}
// menu / price poster: rows = [['TEA','30p'], …]; img(g,x,y,w,h) optional picture area
export function menuPoster(g, x, y, w, h, o = {}) {
  const { title = 'HONESTY BOX', rows = [], paper = '#e9e8e6', ink = '#4a4b58', price = '#c24c4c', img = null, imgH = 0.38, size = w * 0.085, reveal = 1 } = o;
  g.fillStyle = alpha('#000', 0.15); rr(g, x + 6, y + 8, w, h, 6); g.fill();
  rr(g, x, y, w, h, 6); g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(paper, 0.03), shade(paper, -0.05)]); g.fill();
  for (const [cx, cy] of [[x + 10, y + 8], [x + w - 10, y + 8], [x + 10, y + h - 8], [x + w - 10, y + h - 8]]) { g.fillStyle = alpha('#ffffff', 0.7); g.fillRect(cx - 14, cy - 5, 28, 10); }
  let yy = y + 26; if (img) { img(g, x + 22, y + 22, w - 44, h * imgH); yy = y + 22 + h * imgH + size * 0.6; }
  const ts = fitSize(g, title, size * 1.02, w - 68);
  text(g, title, x + 34, yy + size * 0.7, { size: ts, font: FONTS.sans, weight: 700, color: ink, align: 'left', spacing: ts * 0.08 });
  const rs = Math.min(...rows.map(([a, b]) => fitSize(g, a + '  ' + b, size, w - 68)), size);
  rows.forEach(([a, b], i) => { if (clamp(reveal * rows.length - i) <= 0) return; const ry = yy + size * (2.2 + i * 1.32); text(g, a, x + 34, ry, { size: rs, font: FONTS.sans, weight: 700, color: ink, align: 'left', spacing: rs * 0.06 }); text(g, b, x + w - 34, ry, { size: rs, font: FONTS.sans, weight: 700, color: price, align: 'right' }); });
}
export function corkBoard(g, x, y, w, h, o = {}) {
  const { seed = 4, notes = 7 } = o, r = rng(seed);
  rr(g, x - 10, y - 10, w + 20, h + 20, 6); g.fillStyle = '#8a5a3a'; g.fill(); g.fillStyle = '#b8875a'; g.fillRect(x, y, w, h);
  for (let i = 0; i < notes; i++) { const nw = w * (0.2 + r() * 0.12), nh = nw * (0.7 + r() * 0.5), nx = x + r() * (w - nw), ny = y + r() * (h - nh), c = ['#f2efe6', '#f6e27a', '#a8d4e8', '#f2b8c8', '#c8e6a8'][i % 5];
    g.save(); g.translate(nx + nw / 2, ny + nh / 2); g.rotate((r() - 0.5) * 0.2); g.fillStyle = alpha('#000', 0.15); g.fillRect(-nw / 2 + 3, -nh / 2 + 4, nw, nh); g.fillStyle = c; g.fillRect(-nw / 2, -nh / 2, nw, nh);
      g.fillStyle = alpha('#6a6a7a', 0.45); for (let k = 0; k < 3; k++) g.fillRect(-nw * 0.35, -nh * 0.2 + k * nh * 0.18, nw * (0.5 + r() * 0.2), 2.5); circle(g, 0, -nh / 2 + 6, 4.5, ['#d84a4a', '#4a7ad8', '#e8b84a'][i % 3]); g.restore(); }
}
export function mugTree(g, x, y, s = 1) {
  softShadow(g, x, y, 44 * s, 6 * s, 0.25); rr(g, x - 30 * s, y - 8 * s, 60 * s, 8 * s, 3); g.fillStyle = '#3a3a48'; g.fill(); seg(g, [[x, y - 6 * s], [x, y - 170 * s]], 7 * s, '#3a3a48');
  [[-1, -150, '#d0564a'], [1, -128, '#4a68c0'], [-1, -100, '#d8a83a'], [1, -76, '#4a8a6e']].forEach(([d, yy, c]) => { g.save(); g.translate(x + d * 30 * s, y + yy * s); g.rotate(d * 0.35); rr(g, -18 * s, -16 * s, 34 * s, 32 * s, 5 * s); g.fillStyle = c; g.fill(); g.strokeStyle = c; g.lineWidth = 6 * s; g.beginPath(); g.arc(d * 18 * s, 0, 9 * s, -1.4, 1.4); g.stroke(); g.restore(); });
}
export function kettle(g, x, y, s = 1, o = {}) { const { color = '#e6e4ea', steam = 0, t = 0 } = o; softShadow(g, x, y, 50 * s, 7 * s, 0.25); rr(g, x - 36 * s, y - 70 * s, 72 * s, 70 * s, 16 * s); g.fillStyle = linGrad(g, x - 36 * s, 0, x + 36 * s, 0, [shade(color, 0.05), shade(color, -0.12)]); g.fill(); seg(g, [[x + 34 * s, y - 40 * s], [x + 54 * s, y - 58 * s]], 9 * s, color); rr(g, x - 40 * s, y - 8 * s, 80 * s, 8 * s, 4); g.fillStyle = '#2a2a32'; g.fill(); g.strokeStyle = '#2a2a32'; g.lineWidth = 8 * s; g.beginPath(); g.arc(x, y - 70 * s, 26 * s, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  if (steam > 0) steamWisp(g, x + 56 * s, y - 64 * s, t, s, steam); }
export function steamWisp(g, x, y, t, s = 1, a = 0.5) { g.save(); g.lineCap = 'round'; for (let k = 0; k < 2; k++) { g.strokeStyle = alpha('#ffffff', a * (0.6 - k * 0.2)); g.lineWidth = 4 * s; g.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20, yy = y - u * 90 * s, xx = x + k * 14 * s + Math.sin(u * 7 + t * 3 + k) * 8 * s * u; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); }
export function honestyBox(g, x, y, s = 1, o = {}) {         // x,y = bottom-centre
  const { label = 'PAY HERE', color = '#a8774e', coins = 0 } = o, w = 220 * s, h = 110 * s;
  softShadow(g, x, y, w * 0.6, 10 * s, 0.3);
  g.fillStyle = linGrad(g, 0, y - h, 0, y, [shade(color, 0.08), shade(color, -0.1)]); rr(g, x - w / 2, y - h, w, h, 6 * s); g.fill();
  g.fillStyle = shade(color, 0.14); g.fillRect(x - w / 2, y - h, w, 10 * s); rr(g, x - 40 * s, y - h - 4 * s, 80 * s, 10 * s, 5 * s); g.fillStyle = '#2a2228'; g.fill();
  rr(g, x - w * 0.42, y - h * 0.68, w * 0.84, h * 0.46, 8 * s); g.fillStyle = '#ece9e4'; g.fill();
  text(g, label, x, y - h * 0.45, { size: fitSize(g, label, 30 * s, w * 0.78, FONTS.sans, 800), font: FONTS.sans, weight: 800, color: '#34343e', spacing: 1 });
  for (let i = 0; i < coins; i++) circle(g, x - 30 * s + i * 14 * s, y - h - 10 * s - (i % 2) * 6 * s, 8 * s, '#e8b84a');
}

// ---------- outdoor pieces ----------
export function cloud(g, x, y, w, M, o = {}) {               // flat puffy cloud with a light underside line
  const { color = shade(M.sky[1], -0.04), edge = shade(M.sky[M.sky.length - 1], 0.25), a = 1 } = o;
  g.save(); g.globalAlpha *= a; const lobes = [[-0.38, 0.05, 0.22], [-0.16, -0.12, 0.3], [0.1, -0.18, 0.32], [0.34, -0.02, 0.24], [0.0, 0.08, 0.36]];
  g.fillStyle = edge; for (const [dx, dy, r] of lobes) { g.beginPath(); g.arc(x + dx * w, y + dy * w + 7, r * w, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = color; for (const [dx, dy, r] of lobes) { g.beginPath(); g.arc(x + dx * w, y + dy * w, r * w, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
export function sunDisc(g, x, y, r, M) { glow(g, x, y, r * 7, M.key, 0.5); glow(g, x, y, r * 2.4, '#fffbe8', 0.75); circle(g, x, y, r, '#fffbe8'); }
export function fieldRows(g, y0, y1, M, o = {}) {            // crop rows converging to a vanishing point (horizon band)
  const { color = M.grass, vx = E.W * 0.62, rows = 34 } = o;
  g.fillStyle = linGrad(g, 0, y0, 0, y1, [shade(color, 0.1), shade(color, -0.12)]); g.fillRect(-E.W, y0, E.W * 3, y1 - y0);
  g.strokeStyle = alpha(shade(color, -0.3), 0.55); g.lineWidth = 2; for (let i = -rows; i <= rows; i++) { g.beginPath(); g.moveTo(vx + i * 6, y0); g.lineTo(vx + i * 110, y1); g.stroke(); }
}
export function fence(g, x0, x1, y, h, M, o = {}) {          // picket fence, y = bottom
  const { color = shade(M.wall2, -0.05), gap = 46 } = o;
  g.fillStyle = color; g.fillRect(x0, y - h * 0.72, x1 - x0, 8); g.fillRect(x0, y - h * 0.3, x1 - x0, 8);
  for (let x = x0; x < x1; x += gap) { poly(g, [[x, y], [x, y - h], [x + 6, y - h - 8], [x + 12, y - h], [x + 12, y]], color); }
}
export function telePole(g, x, y, h, o = {}) { const { color = '#4a3a3a', wire = 'rgba(40,30,30,.6)', toX = null } = o; seg(g, [[x, y], [x, y - h]], 9, color); seg(g, [[x - 40, y - h + 16], [x + 40, y - h + 16]], 7, color); if (toX != null) { g.strokeStyle = wire; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 30, y - h + 14); g.quadraticCurveTo((x + toX) / 2, y - h + 60, toX, y - h + 30); g.stroke(); } }
export function awningStand(g, x, y, w, M, o = {}) {         // fruit stand: x,y = bottom-centre; returns { tableY, left, right }
  const { stripes = ['#5e8a5a', '#efe2c8'], wood = '#b07a52', h = 420 } = o;
  const top = y - h, ty = y - h * 0.46;
  seg(g, [[x - w / 2 + 14, y], [x - w / 2 + 14, top + 30]], 10, shade(wood, -0.1)); seg(g, [[x + w / 2 - 14, y], [x + w / 2 - 14, top + 30]], 10, shade(wood, -0.1));
  // awning: stripes with scalloped edge
  const n = 10, sw = (w + 40) / n, ax = x - w / 2 - 20;
  for (let i = 0; i < n; i++) { const c = stripes[i % 2]; g.fillStyle = c; g.beginPath(); g.moveTo(ax + i * sw, top - 24); g.lineTo(ax + (i + 1) * sw, top - 24); g.lineTo(ax + (i + 1) * sw, top + 46); g.quadraticCurveTo(ax + (i + 0.5) * sw, top + 80, ax + i * sw, top + 46); g.closePath(); g.fill(); }
  g.fillStyle = alpha('#000', 0.1); g.fillRect(ax, top - 24, w + 40, 14);
  // table
  rr(g, x - w / 2 - 6, ty - 12, w + 12, 20, 4); g.fillStyle = shade(wood, 0.08); g.fill(); g.fillStyle = shade(wood, -0.08); g.fillRect(x - w / 2, ty + 8, w, 10);
  seg(g, [[x - w / 2 + 30, ty + 10], [x - w / 2 + 30, y]], 10, shade(wood, -0.2)); seg(g, [[x + w / 2 - 30, ty + 10], [x + w / 2 - 30, y]], 10, shade(wood, -0.2));
  return { tableY: ty - 12, left: x - w / 2, right: x + w / 2, top };
}
export function crate(g, x, y, w, h, o = {}) {               // crate with fruit on top: x,y = bottom-centre
  const { wood = '#b07a52', fruit = 'apple', count = 4, color = null, seed = 2 } = o; const r = rng(seed);
  const fc = color || (fruit === 'apple' ? '#e0303a' : fruit === 'pear' ? '#b8c24e' : fruit === 'orange' ? '#f08a30' : '#e0303a');
  for (let row = 1; row >= 0; row--) for (let i = 0; i < count; i++) { const fx = x - w / 2 + (i + 0.5) * (w / count) + (row ? w / count / 2 : 0) * 0, fy = y - h - 18 - row * 26, fr = Math.min(w / count / 2, 30) * (0.95 + r() * 0.1); if (row && i === count - 1) continue;
    g.fillStyle = row ? shade(fc, -0.12) : fc; g.beginPath(); fruit === 'pear' ? g.ellipse(fx, fy, fr * 0.82, fr * 1.05, 0, 0, Math.PI * 2) : g.arc(fx, fy, fr, 0, Math.PI * 2); g.fill(); seg(g, [[fx, fy - fr * 0.9], [fx + 3, fy - fr * 1.3]], 3, '#4a3020'); circle(g, fx - fr * 0.35, fy - fr * 0.3, fr * 0.18, alpha('#ffffff', 0.3)); }
  rr(g, x - w / 2, y - h, w, h, 4); g.fillStyle = linGrad(g, 0, y - h, 0, y, [shade(wood, 0.06), shade(wood, -0.12)]); g.fill(); g.fillStyle = alpha(shade(wood, -0.35), 0.5); g.fillRect(x - w / 2, y - h * 0.5, w, 3);
}
export function chalkSign(g, x, y, lines, o = {}) {          // A-frame chalkboard, x,y = bottom-centre
  const { w = 170, h = 200, tilt = -0.08, size = 44, chalk = '#f2efe6', accent = '#f2b84a', frame = '#9a6a42' } = o;
  g.save(); g.translate(x, y); g.rotate(tilt); softShadow(g, 0, 0, w * 0.6, 10, 0.3);
  rr(g, -w / 2 - 10, -h - 10, w + 20, h + 10, 6); g.fillStyle = frame; g.fill(); g.fillStyle = '#2e2b24'; g.fillRect(-w / 2, -h, w, h - 4);
  lines.forEach((ln, i) => text(g, ln, 0, -h + h * (0.32 + i * 0.36), { size, font: FONTS.hand, weight: 700, color: i ? accent : chalk }));
  g.restore();
}
// blob tree: trunk + cluster of round lobes with inner lobe lines (park trees of the reference)
export function blobTree(g, x, y, s = 1, o = {}) {
  const { color = '#8b613c', trunk = '#4a3430', seed = 3, sway = 0 } = o, r = rng(seed);
  seg(g, [[x, y], [x + sway * 0.3, y - 150 * s]], 16 * s, trunk); seg(g, [[x, y - 110 * s], [x - 30 * s, y - 160 * s]], 9 * s, trunk); seg(g, [[x, y - 120 * s], [x + 34 * s, y - 170 * s]], 9 * s, trunk);
  const cx = x + sway, cy = y - 245 * s, lobes = [];
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2 + r() * 0.4, d = 70 + r() * 30; lobes.push([cx + Math.cos(a) * d * s, cy + Math.sin(a) * d * 0.8 * s, (58 + r() * 22) * s]); }
  lobes.push([cx, cy, 95 * s]);
  g.fillStyle = shade(color, -0.12); for (const [lx, ly, lr] of lobes) { g.beginPath(); g.arc(lx, ly + 6 * s, lr, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = color; for (const [lx, ly, lr] of lobes) { g.beginPath(); g.arc(lx, ly, lr * 0.96, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = alpha(shade(color, -0.28), 0.6); g.lineWidth = 4 * s; g.lineCap = 'round';
  for (const [lx, ly, lr] of lobes.slice(0, 7)) { g.beginPath(); g.arc(lx, ly, lr * 0.62, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }
  g.fillStyle = alpha(shade(color, 0.18), 0.5); for (const [lx, ly, lr] of lobes.slice(2, 6)) { g.beginPath(); g.arc(lx - lr * 0.2, ly - lr * 0.3, lr * 0.4, 0, Math.PI * 2); g.fill(); }
}
export function bench(g, x, y, s = 1, o = {}) {              // park bench, x,y = bottom-centre (front view). returns seat y
  const { wood = '#7a4a3c', iron = '#1e1a20', w = 420 } = o, W = w * s, seat = y - 92 * s;
  softShadow(g, x, y, W * 0.55, 12 * s, 0.32);
  for (let i = 0; i < 3; i++) { rr(g, x - W / 2, y - 210 * s + i * 30 * s, W, 20 * s, 4 * s); g.fillStyle = linGrad(g, 0, y - 210 * s + i * 30 * s, 0, y - 190 * s + i * 30 * s, [shade(wood, 0.1), shade(wood, -0.1)]); g.fill(); }
  for (let i = 0; i < 2; i++) { rr(g, x - W / 2 - 10 * s, seat - 6 * s + i * 22 * s, W + 20 * s, 20 * s, 4 * s); g.fillStyle = i ? shade(wood, -0.15) : shade(wood, 0.04); g.fill(); }
  for (const sx of [-1, 1]) { const lx = x + sx * (W / 2 - 22 * s); g.strokeStyle = iron; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 12 * s;
    g.beginPath(); g.moveTo(lx - sx * 10 * s, y); g.lineTo(lx, seat + 12 * s); g.lineTo(lx + sx * 4 * s, y - 214 * s); g.stroke();                                  // leg + back support
    g.beginPath(); g.moveTo(lx + sx * 12 * s, y); g.lineTo(lx + sx * 6 * s, seat + 12 * s); g.stroke();                                                        // front leg
    g.lineWidth = 10 * s; g.beginPath(); g.moveTo(lx - sx * 2 * s, seat - 52 * s); g.quadraticCurveTo(lx + sx * 26 * s, seat - 58 * s, lx + sx * 22 * s, seat + 4 * s); g.stroke(); }   // arm rest
  return seat;
}
export function streetLamp(g, x, y, h, M, o = {}) {          // victorian lamp post with a glowing lantern
  const { on = 1, color = '#1e1a22', s = 1 } = o, ly = y - h;
  if (on) { lightPool(g, x, ly, 420 * s, M.practical, 0.3 * on); lightPool(g, x, y, 260 * s, M.practical, 0.22 * on, 0.25); }
  seg(g, [[x, y], [x, ly + 30 * s]], 11 * s, color); rr(g, x - 16 * s, y - 40 * s, 32 * s, 40 * s, 4); g.fillStyle = color; g.fill();
  poly(g, [[x - 22 * s, ly], [x + 22 * s, ly], [x + 15 * s, ly + 46 * s], [x - 15 * s, ly + 46 * s]], color);
  rr(g, x - 15 * s, ly + 4 * s, 30 * s, 36 * s, 4 * s); g.fillStyle = on ? M.practical : '#5a5a6a'; g.fill();
  poly(g, [[x - 28 * s, ly + 2 * s], [x + 28 * s, ly + 2 * s], [x, ly - 26 * s]], color); circle(g, x, ly - 30 * s, 6 * s, color);
  if (on) glow(g, x, ly + 22 * s, 70 * s, M.practical, 0.6 * on);
}
export function skylineSoft(g, y, M, o = {}) {               // soft city silhouettes on the horizon (x spans the stage)
  const { seed = 9, color = M.wall, h = 300, count = 16, lit = 0.25, win = M.practical } = o, r = rng(seed);
  for (let i = 0; i < count; i++) { const bw = 90 + r() * 140, bh = h * (0.4 + r() * 0.6), bx = -E.W * 0.2 + (i / count) * E.W * 1.4 + r() * 40; g.fillStyle = shade(color, (r() - 0.5) * 0.12); g.fillRect(bx, y - bh, bw, bh + 4);
    if (lit > 0) { g.fillStyle = alpha(win, 0.5); for (let wy = y - bh + 20; wy < y - 20; wy += 34) for (let wx = bx + 14; wx < bx + bw - 14; wx += 28) if (r() < lit) g.fillRect(wx, wy, 10, 14); } }
}
export function house(g, x, y, w, h, M, o = {}) {            // simple facade with roof + lit windows (x,y = bottom-left)
  const { color = M.wall, roof = shade(M.wall, -0.3), win = M.practical, lit = 0.6, seed = 3 } = o, r = rng(seed);
  g.fillStyle = color; g.fillRect(x, y - h, w, h); poly(g, [[x - 20, y - h], [x + w + 20, y - h], [x + w / 2, y - h - h * 0.45]], roof);
  const cols = Math.max(2, Math.round(w / 140)); for (let i = 0; i < cols; i++) { const wx = x + (i + 0.5) * (w / cols) - 28; for (const wy of [y - h * 0.82, y - h * 0.42]) { const on = r() < lit; rr(g, wx, wy, 56, 70, 4); g.fillStyle = on ? win : shade(color, -0.35); g.fill(); if (on) glow(g, wx + 28, wy + 35, 70, win, 0.25); } }
}
export function car(g, x, y, s = 1, o = {}) {                // side-view hatchback, x,y = bottom-centre
  const { color = '#4a6a9a', lights = 0 } = o, w = 360 * s;
  softShadow(g, x, y, w * 0.55, 12 * s, 0.35);
  rr(g, x - w / 2, y - 110 * s, w, 80 * s, 26 * s); g.fillStyle = linGrad(g, 0, y - 110 * s, 0, y - 30 * s, [shade(color, 0.1), shade(color, -0.12)]); g.fill();
  g.fillStyle = color; g.beginPath(); g.moveTo(x - w * 0.32, y - 106 * s); g.quadraticCurveTo(x - w * 0.22, y - 180 * s, x - w * 0.02, y - 180 * s); g.lineTo(x + w * 0.22, y - 180 * s); g.quadraticCurveTo(x + w * 0.36, y - 160 * s, x + w * 0.42, y - 106 * s); g.closePath(); g.fill();
  g.fillStyle = alpha('#c8d8f0', 0.75); g.beginPath(); g.moveTo(x - w * 0.24, y - 112 * s); g.quadraticCurveTo(x - w * 0.18, y - 166 * s, x - w * 0.02, y - 166 * s); g.lineTo(x + w * 0.2, y - 166 * s); g.quadraticCurveTo(x + w * 0.3, y - 150 * s, x + w * 0.34, y - 112 * s); g.closePath(); g.fill();
  seg(g, [[x + w * 0.06, y - 166 * s], [x + w * 0.06, y - 112 * s]], 8 * s, color);
  for (const dx of [-0.28, 0.28]) { circle(g, x + dx * w, y - 26 * s, 34 * s, '#1a1a20'); circle(g, x + dx * w, y - 26 * s, 15 * s, '#8a8a96'); }
  if (lights) { glow(g, x + w / 2, y - 80 * s, 120 * s, '#fff2c8', 0.5 * lights); }
}

// ---------- room pieces ----------
export function monitor(g, cx, y, w, h, M, o = {}, content = null) {   // desk monitor: cx = centre, y = desk top; content(g, x, y, w, h)
  const { power = 1, bezel = '#3a415b', screen = '#eef2fa' } = o, x = cx - w / 2, top = y - h - 160;
  if (power) { lightPool(g, cx, top + h / 2, w * 1.1, screen, 0.22 * power); lightPool(g, cx, y + 30, w * 0.8, screen, 0.25 * power, 0.25); }
  seg(g, [[cx, top + h], [cx, y - 6]], 26, shade(bezel, -0.1)); rr(g, cx - 90, y - 12, 180, 12, 6); g.fillStyle = shade(bezel, -0.15); g.fill();
  rr(g, x - 14, top - 14, w + 28, h + 28, 12); g.fillStyle = bezel; g.fill();
  g.fillStyle = power ? screen : '#121420'; g.fillRect(x, top, w, h);
  if (power && content) { g.save(); g.beginPath(); g.rect(x, top, w, h); g.clip(); content(g, x, top, w, h); g.restore(); }
  if (power) { g.fillStyle = linGrad(g, x, top, x + w, top + h, [alpha('#ffffff', 0.0), alpha('#ffffff', 0.08), alpha('#ffffff', 0)]); g.fillRect(x, top, w, h); }
  return { x, y: top, w, h };
}
export function keyboard(g, cx, y, w = 380, color = '#3a415b') { rr(g, cx - w / 2, y - 40, w, 40, 6); g.fillStyle = color; g.fill(); g.fillStyle = shade(color, -0.3); for (let r = 0; r < 3; r++) for (let i = 0; i < 14; i++) g.fillRect(cx - w / 2 + 12 + i * ((w - 24) / 14), y - 34 + r * 11, (w - 24) / 14 - 4, 7); }
export function desk(g, y, M, o = {}) { const { color = shade(M.floor, 0.25), depth = 160 } = o; g.fillStyle = linGrad(g, 0, y, 0, y + depth, [shade(color, 0.1), shade(color, -0.25)]); g.fillRect(-E.W, y, E.W * 3, depth + E.H); g.fillStyle = alpha('#ffffff', 0.1); g.fillRect(-E.W, y, E.W * 3, 3); }
export function fogGlass(g, x, y, w, h, t, o = {}) {        // condensation over a window area: soft white veil + droplets (x,y = top-left)
  const { a = 0.5, seed = 12, drops = 160, wipe = null } = o, r = rng(seed);
  g.save(); g.fillStyle = alpha('#d8e0f0', a * 0.55); g.fillRect(x, y, w, h);
  for (let i = 0; i < drops; i++) { const dx = x + r() * w, dy = y + r() * h, dr = 1.5 + r() ** 3 * 6; g.fillStyle = alpha('#203050', 0.18); g.beginPath(); g.arc(dx + 1, dy + 1.5, dr, 0, Math.PI * 2); g.fill(); g.fillStyle = alpha('#ffffff', 0.35); g.beginPath(); g.arc(dx - dr * 0.25, dy - dr * 0.3, dr * 0.45, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// text written with a finger on fogged glass: reveal 0..1 (left → right), returns nothing
export function fogWriting(g, str, x, y, o = {}) {
  const { size = 120, reveal = 1, color = '#1e2a4a', font = FONTS.hand, align = 'center', drip = true } = o; if (reveal <= 0) return;
  g.save(); g.font = `700 ${size}px "${font}"`; const w = g.measureText(str).width, x0 = align === 'center' ? x - w / 2 : x;
  g.beginPath(); g.rect(x0 - 10, y - size, (w + 20) * clamp(reveal), size * 2); g.clip();
  text(g, str, x0, y, { size, font, weight: 700, color: alpha(color, 0.85), align: 'left' });
  if (drip) { const r = rng(str.length); for (let i = 0; i < Math.ceil(str.length / 3); i++) { const dx = x0 + r() * w, len = 10 + r() * 40 * clamp(reveal * 1.5 - 0.5); g.fillStyle = alpha(color, 0.5); g.fillRect(dx, y + size * 0.3, 3, len); } }
  g.restore();
}
export function bed(g, x, y, w, M, o = {}) { const { color = '#5a6aa0', frame = shade(M.wall, -0.35), pillow = '#e8e4f0' } = o; softShadow(g, x + w / 2, y, w * 0.6, 14, 0.3); g.fillStyle = frame; g.fillRect(x, y - 80, w, 80); rr(g, x - 12, y - 190, 26, 190, 6); g.fill(); rr(g, x + 20, y - 120, 140, 44, 18); g.fillStyle = pillow; g.fill(); rr(g, x + 120, y - 104, w - 110, 40, 16); g.fillStyle = linGrad(g, 0, y - 104, 0, y - 64, [shade(color, 0.1), shade(color, -0.12)]); g.fill(); }
export function nightLamp(g, x, y, M, o = {}) { const { on = 1, shadeC = '#e8d8b8' } = o; if (on) { lightPool(g, x, y - 120, 380, M.practical, 0.35 * on); } rr(g, x - 50, y - 18, 100, 18, 4); g.fillStyle = '#4a3a3a'; g.fill(); seg(g, [[x, y - 18], [x, y - 90]], 8, '#4a3a3a'); poly(g, [[x - 50, y - 90], [x + 50, y - 90], [x + 34, y - 160], [x - 34, y - 160]], on ? shadeC : shade(shadeC, -0.4)); if (on) glow(g, x, y - 110, 90, M.practical, 0.5 * on); }
export function plant(g, x, y, s = 1, o = {}) { const { pot = '#c8724a', leaf = '#5a8a5a' } = o; softShadow(g, x, y, 50 * s, 8 * s, 0.3); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; g.save(); g.translate(x, y - 66 * s); g.rotate(a + Math.PI / 2); g.fillStyle = i % 2 ? leaf : shade(leaf, -0.12); g.beginPath(); g.ellipse(0, -60 * s, 16 * s, 60 * s, 0, 0, Math.PI * 2); g.fill(); g.restore(); } poly(g, [[x - 40 * s, y - 70 * s], [x + 40 * s, y - 70 * s], [x + 30 * s, y], [x - 30 * s, y]], pot); g.fillStyle = shade(pot, 0.1); g.fillRect(x - 44 * s, y - 78 * s, 88 * s, 14 * s); }
export function frame(g, x, y, w, h, o = {}) { const { color = '#e8e4dc', art = '#7a9ac8', border = '#5a4a3a' } = o; g.fillStyle = alpha('#000', 0.15); g.fillRect(x + 5, y + 6, w, h); g.fillStyle = border; g.fillRect(x, y, w, h); g.fillStyle = color; g.fillRect(x + 8, y + 8, w - 16, h - 16); g.fillStyle = art; g.fillRect(x + 20, y + 20, w - 40, h - 40); }
export function bookshelf(g, x, y, w, h, o = {}) { const { wood = '#6a4a3a', seed = 6 } = o, r = rng(seed); g.fillStyle = wood; g.fillRect(x, y - h, w, h); g.fillStyle = shade(wood, -0.3); const rows = Math.max(2, Math.round(h / 110)); for (let i = 0; i < rows; i++) { const ry = y - h + 12 + i * (h - 12) / rows; g.fillStyle = shade(wood, -0.35); g.fillRect(x + 10, ry, w - 20, (h - 12) / rows - 12); let bx = x + 14; while (bx < x + w - 30) { const bw = 12 + r() * 16, bh = ((h - 12) / rows - 16) * (0.7 + r() * 0.3); g.fillStyle = ['#c86a5a', '#5a7ab8', '#d8b05a', '#6a9a6a', '#9a6ab0', '#e8e0d0'][Math.floor(r() * 6)]; g.fillRect(bx, ry + ((h - 12) / rows - 12) - bh, bw, bh); bx += bw + 3; } } }
export function chair(g, x, y, s = 1, o = {}) { const { color = '#3a3440' } = o; softShadow(g, x, y, 60 * s, 8 * s, 0.25); seg(g, [[x - 34 * s, y], [x - 30 * s, y - 92 * s]], 8 * s, color); seg(g, [[x + 34 * s, y], [x + 30 * s, y - 92 * s]], 8 * s, color); rr(g, x - 44 * s, y - 100 * s, 88 * s, 14 * s, 5 * s); g.fillStyle = color; g.fill(); seg(g, [[x - 34 * s, y - 100 * s], [x - 38 * s, y - 220 * s]], 9 * s, color); rr(g, x - 46 * s, y - 230 * s, 70 * s, 70 * s, 10 * s); g.fill(); }
export function fridge(g, x, y, o = {}) { const { color = '#e6e8ec' } = o; softShadow(g, x + 90, y, 120, 14, 0.3); rr(g, x, y - 420, 180, 420, 14); g.fillStyle = linGrad(g, x, 0, x + 180, 0, [shade(color, 0.04), shade(color, -0.12)]); g.fill(); g.fillStyle = alpha('#000', 0.18); g.fillRect(x, y - 290, 180, 4); seg(g, [[x + 154, y - 380], [x + 154, y - 310]], 7, '#9a9aa8'); seg(g, [[x + 154, y - 260], [x + 154, y - 170]], 7, '#9a9aa8'); }
export function clockWall(g, x, y, r, t = 0, o = {}) { const { face = '#f2efe8', ink = '#34343e', speed = 1 } = o; circle(g, x, y + 4, r, alpha('#000', 0.15)); circle(g, x, y, r, face); ring(g, x, y, r, r * 0.08, ink); for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; seg(g, [[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.88, y + Math.sin(a) * r * 0.88]], r * 0.05, ink); } const m = t * speed * 0.5, h = m / 12; seg(g, [[x, y], [x + Math.sin(h) * r * 0.45, y - Math.cos(h) * r * 0.45]], r * 0.08, ink); seg(g, [[x, y], [x + Math.sin(m) * r * 0.7, y - Math.cos(m) * r * 0.7]], r * 0.05, ink); circle(g, x, y, r * 0.06, '#c24c4c'); }

// ======================================================================
// LOCATIONS — fn(g, t, cam, o) → { GY, M, … }
// ======================================================================
const D = (o, k, v) => (o[k] ?? v);

// Night porch of a house (siding, curtained window, door + wreath, sconce, railing, steps, navy ground).
// o: { mood:'porch', halloween:true, table:true, sign:['PLEASE','TAKE ONE'], doorOpen:0, lamp:1, bowl:1, dof:0 }
export function porch(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'porch')), GY = E.H * V(0.665, 0.6), W = E.W, H = E.H;
  backdrop(g, [M.dark, M.floor]);
  layer(g, cam, 0.92, (g) => {
    siding(g, -W * 0.4, -H * 0.5, W * 1.8, GY + H * 0.5, M);
    windowCurtain(g, W * 0.5 - V(150, 120), -40, V(300, 240), V(210, 260), M);
    door(g, V(-40, -60), GY, V(190, 170), V(420, 460), M, { wreath: D(o, 'wreath', true), open: D(o, 'doorOpen', 0), color: '#6a2a34' });
    rr(g, W * 0.9, -H * 0.5, 30, GY + H * 0.5, 3); g.fillStyle = shade(M.trim, -0.02); g.fill();
  });
  layer(g, cam, 0.95, (g) => {
    wallLamp(g, V(W * 0.15, W * 0.23), GY * 0.24, M, { on: D(o, 'lamp', 1) });
    if (D(o, 'railing', true)) railing(g, W * V(0.42, 0.44), GY, W * V(0.5, 0.62), V(170, 150), M, { posts: [W * V(0.92, 0.98)] });
  });
  layer(g, cam, 1, (g) => {
    g.fillStyle = shade(M.trim, -0.15); g.fillRect(-W, GY, W * 3, 14); g.fillStyle = alpha(M.trim, 0.6); g.fillRect(-W, GY, W * 3, 3);
    floorGrad(g, GY + 14, H, M.floor, M.floor2);
    if (D(o, 'steps', true)) steps(g, W * V(0.08, 0.05), GY + 16, W * V(0.25, 0.38), 3, M);
    if (D(o, 'halloween', true)) { pumpkin(g, V(30, 40), GY + 8, V(1.1, 1)); pumpkin(g, W - V(60, 70), GY + 8, V(1.15, 1)); }
    lightPool(g, V(W * 0.15, W * 0.23), GY, W * 0.4, M.key, 0.14, 0.18);
  });
  const res = { GY, M, tableX: W * V(0.5, 0.5), lampX: V(W * 0.15, W * 0.23) };
  if (D(o, 'table', true)) layer(g, cam, 1, (g) => {
    const top = pedestalTable(g, res.tableX, GY + 4, V(1, 0.9), M); res.tableTop = top;
    if (o.sign !== false) handSign(g, res.tableX + V(250, 190), top - V(70, 60), o.sign || ['PLEASE', 'TAKE ONE'], { tilt: 0.03, w: V(220, 190), h: V(140, 120), size: V(42, 36) });
    candyBowl(g, res.tableX, top + 6, V(1, 0.9), { fill: D(o, 'bowl', 1) });
  });
  return res;
}

// Office kitchenette / break room (cool daylight): window + city, menu poster, cork board, subway tiles, counter, honesty box.
// o: { mood:'office', menu:{title, rows, img}, box:true, mugs:true, kettle:true, s:1.6, window:true }
export function kitchen(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'office')), s = D(o, 's', 1.6), GY = E.H * V(1.02, 0.86), W = E.W, H = E.H;
  const counterY = GY - 108 * s;
  backdrop(g, [M.wall, M.wall2]);
  blurLayer(g, D(o, 'dof', 0) * 0.6, (g) => {
    g.fillStyle = linGrad(g, 0, -H * 0.5, 0, counterY, [shade(M.wall, -0.04), M.wall]); g.fillRect(-W, -H * 0.5, W * 3, counterY + H * 0.5);
    lightPool(g, W * 0.58, H * 0.05, W * 0.55, M.key, 0.3, 0.8);
    if (D(o, 'window', true)) { const wx = V(-60, -120), wy = H * 0.08, ww = V(360, 300), wh = counterY - H * 0.22; rr(g, wx - 14, wy - 14, ww + 28, wh + 28, 6); g.fillStyle = M.trim; g.fill(); g.fillStyle = linGrad(g, 0, wy, 0, wy + wh, M.sky); g.fillRect(wx, wy, ww, wh);
      g.save(); g.beginPath(); g.rect(wx, wy, ww, wh); g.clip(); for (let i = 0; i < 4; i++) { g.fillStyle = mix('#8a6a6a', M.sky[0], 0.3); g.fillRect(wx + 20 + i * 90, wy + wh * 0.35 + (i % 2) * 30, 70, wh); g.fillStyle = alpha('#ffffff', 0.35); for (let k = 0; k < 4; k++) g.fillRect(wx + 30 + i * 90, wy + wh * 0.42 + k * 40, 16, 20); } g.fillStyle = M.grass; g.fillRect(wx, wy + wh * 0.82, ww, wh); g.restore();
      seg(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 10, M.trim); }
    const m = o.menu || {}; menuPoster(g, W * V(0.4, 0.16), H * 0.02, V(400, 460), V(520, 560), { title: m.title || 'HONESTY BOX', rows: m.rows || [['TEA', '30p'], ['COFFEE', '50p'], ['MILK', '10p']], img: m.img, imgH: m.imgH ?? 0.38, reveal: m.reveal ?? 1 });
    if (D(o, 'cork', true)) corkBoard(g, W * V(0.7, 0.72), H * 0.1, V(300, 260), V(220, 240));
  }, cam, 0.9);
  layer(g, cam, 0.97, (g) => {
    tiles(g, -W, counterY - 160, W * 3, 160, M);
    counter(g, -W, counterY, W * 3, H, M);
  });
  const res = { GY, M, counterY, s };
  layer(g, cam, 0.97, (g) => {
    if (D(o, 'mugs', true)) mugTree(g, W * V(0.1, 0.12), counterY);
    if (D(o, 'kettle', true)) kettle(g, W * V(0.2, 0.3), counterY, 1, { steam: o.steam || 0, t });
    if (D(o, 'box', true)) honestyBox(g, W * V(0.38, 0.6), counterY, 1, { label: o.boxLabel || 'PAY HERE', coins: o.coins || 0 });
  });
  return res;
}

// Farm stand at sunset: peach sky, sun, clouds, field rows, fence, telephone pole, striped awning stand with crates.
export function farmStand(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'sunset')), GY = E.H * V(0.9, 0.78), HZ = E.H * V(0.5, 0.42), W = E.W, H = E.H;
  backdrop(g, M.sky);
  blurLayer(g, D(o, 'dof', 3), (g) => {
    sunDisc(g, W * 0.78, HZ - 20, 44, M);
    cloud(g, W * 0.32, H * 0.12, 420, M, { a: 0.95 }); cloud(g, W * 0.82, H * 0.08, 300, M, { a: 0.8 });
    g.fillStyle = shade(M.ambient, 0.1); for (const [x, r] of [[0.08, 70], [0.72, 60], [0.92, 80]]) { g.beginPath(); g.arc(W * x, HZ + 6, r, Math.PI, 0); g.fill(); }
  }, cam, 0.2);
  layer(g, cam, 0.6, (g) => { fieldRows(g, HZ, HZ + (GY - HZ) * 0.62, M); telePole(g, W * 0.07, HZ + 40, 300, { toX: W * 0.4 }); haze(g, HZ - 60, HZ + 60, M.haze, 0.45); });
  layer(g, cam, 0.85, (g) => { fence(g, -W, W * 2, GY - (GY - HZ) * 0.2, 80, M, { color: shade(M.wall2, -0.08) }); });
  layer(g, cam, 1, (g) => {
    floorGrad(g, GY - (GY - HZ) * 0.2, H, M.floor, shade(M.floor2, -0.05));
    g.strokeStyle = alpha(shade(M.floor, -0.25), 0.4); g.lineWidth = 3; for (let i = 0; i < 6; i++) { const y = GY - 40 + i * 50; g.beginPath(); g.moveTo(-W, y + 80); g.lineTo(W * 2, y - 40); g.stroke(); }
  });
  const res = { GY, M, HZ };
  if (D(o, 'stand', true)) layer(g, cam, 1, (g) => {
    const sx = W * V(0.47, 0.5), sw = V(640, 560), st = awningStand(g, sx, GY - 60, sw, M); res.tableY = st.tableY; res.standX = sx;
    crate(g, sx - sw * 0.24, st.tableY, sw * 0.36, 70, { fruit: 'apple', count: 4, seed: 2 }); crate(g, sx + sw * 0.14, st.tableY, sw * 0.36, 70, { fruit: 'pear', count: 5, seed: 3 });
    honestyBox(g, sx + sw * 0.42, st.tableY, 0.42, { label: '$', color: '#9a6a48' }); handSign(g, sx + sw * 0.42, st.tableY - 92, ['PAY', 'HERE'], { w: 90, h: 70, size: 28, ink: '#3a3a44', tilt: 0.05 });
    chalkSign(g, sx - sw * 0.72, GY + 10, o.chalk || ['APPLES', '50¢']);
  });
  return res;
}

// City park at dusk: pink sky, soft skyline, blob trees in autumn colours, lamp posts, benches, path, lawn, falling leaves.
// o: { mood:'park', bench:true, benchX, lamps:[x…], trees:true, leaves:true, dof:5 }
export function park(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'park')), GY = E.H * V(0.92, 0.8), HZ = E.H * V(0.42, 0.36), W = E.W, H = E.H, PY = E.H * V(0.6, 0.52);
  backdrop(g, M.sky);
  blurLayer(g, D(o, 'dof', 5), (g) => {
    skylineSoft(g, HZ + 40, M, { color: mix(M.wall, M.sky[1], 0.25), h: 360, lit: 0.15 });
    haze(g, HZ - 120, HZ + 140, M.haze, 0.55);
    g.fillStyle = shade(M.grass, 0.05); g.fillRect(-W, HZ + 20, W * 3, PY - HZ);
    const lc = M.leaf; [[-0.02, 0.9, 1], [0.2, 0.75, 4], [0.42, 0.8, 2], [0.62, 0.72, 5], [0.82, 0.85, 3], [1.02, 0.78, 0]].forEach(([x, s, i]) => blobTree(g, W * x, HZ + 90, s, { color: lc[i % lc.length], seed: i + 3, sway: Math.sin(t * 0.8 + i) * 4 }));
    for (const x of [0.12, 0.7]) bench(g, W * x, HZ + 96, 0.5);
    for (const x of [0.33, 0.9]) streetLamp(g, W * x, HZ + 96, 230, M, { s: 0.6 });
  }, cam, 0.45);
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = M.grass; g.fillRect(-W, PY - 40, W * 3, 60);
    g.fillStyle = linGrad(g, 0, PY, 0, PY + 110, [M.floor, M.floor2]); g.fillRect(-W, PY + 10, W * 3, 120);
    g.fillStyle = shade(M.grass, -0.06); g.fillRect(-W, PY + 130, W * 3, 40);
  });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, PY + 170, 0, H, [shade(M.floor, -0.04), M.floor2]); g.fillRect(-W, PY + 170, W * 3, (GY - PY - 140));
    floorGrad(g, GY - 20, H, shade(M.grass, -0.02), shade(M.grass, -0.25));
  });
  const res = { GY, M, PY: PY + 120 };
  layer(g, cam, 1, (g) => {
    if (D(o, 'lamp', true)) streetLamp(g, D(o, 'lampX', W * V(0.78, 0.86)), GY - 10, V(560, 640), M);
    if (D(o, 'bench', true)) res.seatY = bench(g, D(o, 'benchX', W * 0.5), GY - 4, V(1.15, 1)), res.benchX = D(o, 'benchX', W * 0.5);
  });
  if (D(o, 'leaves', true)) leaves(g, t, { colors: [M.leaf[0], M.leaf[2], M.leaf[1]] });
  return res;
}

// Dark room lit by a monitor (back view of the viewer, tiny screen people, keyboard). content(g, x, y, w, h) draws the screen.
export function monitorRoom(g, t, cam, o = {}, content = null) {
  const M = mood(D(o, 'mood', 'dark')), W = E.W, H = E.H, deskY = E.H * V(0.8, 0.66);
  backdrop(g, [M.sky[0], M.sky[1]]);
  blurLayer(g, 6, (g) => { g.fillStyle = shade(M.wall, 0.06); for (const [x, w, h] of [[0.06, 0.12, 0.5], [0.8, 0.14, 0.6]]) g.fillRect(W * x, deskY - H * h, W * w, H * h); }, cam, 0.5);
  let scr = null;
  layer(g, cam, 0.95, (g) => { desk(g, deskY, M, { color: '#56607a' }); scr = monitor(g, W * D(o, 'screenX', V(0.6, 0.5)), deskY, V(680, 820), V(400, 520), M, { power: D(o, 'power', 1) }, content); keyboard(g, W * D(o, 'screenX', V(0.6, 0.5)), deskY + 60); circle(g, W * D(o, 'screenX', V(0.6, 0.5)) + 280, deskY + 40, 20, '#1a1d2a'); });
  return { GY: deskY + 200, M, deskY, screen: scr };
}

// Fogged-up window at night: blurred city bokeh behind glass, condensation, frame. Use fogWriting() on top.
export function fogWindow(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'rainy')), W = E.W, H = E.H, fx = V(140, 60), fy = 0, fw = W - V(280, 120), fh = H * V(0.86, 0.8);
  backdrop(g, M.sky);
  blurLayer(g, 10, (g) => { skylineSoft(g, H * 0.95, M, { color: shade(M.wall, -0.1), h: 520, lit: 0.35, count: 14 }); bokeh(g, t, { count: 50, area: [0, H * 0.3, W, H * 0.7], colors: [M.practical, '#ffffff', '#ffc890'], r0: 8, r1: 30, a: 0.45 }); circle(g, W * 0.72, H * 0.16, 30, '#f2f4ff'); glow(g, W * 0.72, H * 0.16, 160, '#dfe6ff', 0.4); }, cam, 0.4);
  layer(g, cam, 1, (g) => { fogGlass(g, fx, fy, fw, fh, t, { a: D(o, 'fog', 0.55) }); g.fillStyle = shade(M.wall, -0.2); g.fillRect(-W, -H, fx + W, H * 3); g.fillRect(fx + fw, -H, W * 2, H * 3); g.fillRect(-W, fh, W * 3, H * 2); g.fillStyle = shade(M.trim, -0.1); g.fillRect(fx - 24, fy - 30, 24, fh + 30); g.fillRect(-W, fh, W * 3, 24); g.fillStyle = alpha('#ffffff', 0.08); g.fillRect(-W, fh, W * 3, 4); });
  return { GY: E.H, M, glass: { x: fx, y: fy, w: fw, h: fh } };
}

// Bedroom at night: wall + window with moon, bed, bedside lamp, frame, plant.
export function bedroom(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'home')), GY = E.H * V(0.82, 0.7), W = E.W, H = E.H;
  backdrop(g, [M.wall, M.wall2]);
  layer(g, cam, 0.9, (g) => { g.fillStyle = M.wall; g.fillRect(-W, -H, W * 3, GY + H); const wx = W * V(0.56, 0.5), wy = H * 0.1; rr(g, wx - 14, wy - 14, 388, 328, 6); g.fillStyle = M.trim; g.fill(); g.fillStyle = linGrad(g, 0, wy, 0, wy + 300, M.sky); g.fillRect(wx, wy, 360, 300); circle(g, wx + 260, wy + 80, 26, '#f2f0ff'); glow(g, wx + 260, wy + 80, 120, '#dfe6ff', 0.35); seg(g, [[wx + 180, wy], [wx + 180, wy + 300]], 10, M.trim); seg(g, [[wx, wy + 150], [wx + 360, wy + 150]], 10, M.trim); frame(g, W * V(0.18, 0.08), H * 0.14, 180, 140); });
  layer(g, cam, 1, (g) => { floorGrad(g, GY, H, M.floor, M.floor2); g.fillStyle = shade(M.trim, -0.1); g.fillRect(-W, GY - 14, W * 3, 14); bed(g, W * V(0.08, 0.02), GY, V(560, 480), M); nightLamp(g, W * V(0.42, 0.66), GY - 4, M, { on: D(o, 'lamp', 1) }); plant(g, W * V(0.88, 0.9), GY, 1.1); });
  return { GY, M };
}

// Street: house facades with lit windows, sidewalk, road, lamp posts, round trees, parked car. o.mood 'day'|'porch'|'rainy'|'park'
export function street(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'day')), GY = E.H * V(0.82, 0.72), W = E.W, H = E.H;
  backdrop(g, M.sky);
  blurLayer(g, D(o, 'dof', 3), (g) => { skylineSoft(g, GY - 260, M, { color: mix(M.wall2, M.sky[1], 0.4), h: 300, lit: 0.1 }); for (let i = 0; i < 4; i++) house(g, -W * 0.1 + i * W * 0.32, GY - 60, W * 0.26, 300, M, { color: [M.wall, M.wall2, shade(M.wall, 0.08), shade(M.wall2, -0.05)][i], seed: i + 2, lit: M === mood('day') ? 0.1 : 0.6 }); haze(g, GY - 300, GY - 40, M.haze, 0.35); }, cam, 0.55);
  layer(g, cam, 0.85, (g) => { [0.16, 0.6, 0.98].forEach((x, i) => blobTree(g, W * x, GY - 50, 0.8, { color: M.leaf[i % M.leaf.length], seed: i + 7 })); });
  layer(g, cam, 1, (g) => { g.fillStyle = shade(M.trim, -0.1); g.fillRect(-W, GY - 50, W * 3, 50); g.fillStyle = alpha('#ffffff', 0.15); g.fillRect(-W, GY - 50, W * 3, 3); floorGrad(g, GY, H, M.road, shade(M.road, -0.2)); g.fillStyle = alpha('#ffffff', 0.5); for (let x = -W; x < W * 2; x += 220) g.fillRect(x, GY + (H - GY) * 0.55, 110, 8);
    if (D(o, 'lamp', true)) streetLamp(g, W * V(0.82, 0.88), GY - 46, V(520, 620), M, { on: D(o, 'lampOn', 1) });
    if (o.car) car(g, W * V(0.3, 0.3), GY + 90, 1, { color: o.car === true ? '#4a6a9a' : o.car }); });
  return { GY, M };
}

// Classroom: board, desks row, window strip, clock.
export function classroom(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'school')), GY = E.H * V(0.86, 0.72), W = E.W, H = E.H;
  backdrop(g, [M.wall, M.wall2]);
  blurLayer(g, D(o, 'dof', 1.5), (g) => { g.fillStyle = M.wall; g.fillRect(-W, -H, W * 3, GY + H); lightPool(g, W * 0.3, H * 0.2, W * 0.6, M.key, 0.25); rr(g, W * 0.24, H * 0.1, W * 0.5, H * 0.36, 8); g.fillStyle = '#8a6a4a'; g.fill(); g.fillStyle = '#3e5a4a'; g.fillRect(W * 0.24 + 14, H * 0.1 + 14, W * 0.5 - 28, H * 0.36 - 28); if (o.board) o.board(g, W * 0.24 + 14, H * 0.1 + 14, W * 0.5 - 28, H * 0.36 - 28); clockWall(g, W * 0.86, H * 0.16, 54, t); }, cam, 0.85);
  layer(g, cam, 1, (g) => { floorGrad(g, GY, H, M.floor, M.floor2); g.fillStyle = shade(M.trim, -0.2); g.fillRect(-W, GY - 12, W * 3, 12); });
  return { GY, M };
}

// Soft studio backdrop (for explanations, data, isolated characters): gradient wall, floor, a soft spotlight pool.
export function studio(g, t, cam, o = {}) {
  const M = mood(D(o, 'mood', 'data')), GY = E.H * V(0.8, 0.7), W = E.W, H = E.H;
  backdrop(g, [shade(M.wall, 0.06), M.wall]);
  layer(g, cam, 1, (g) => { floorGrad(g, GY, H, shade(M.floor, 0.08), M.floor2); lightPool(g, W / 2, GY * 0.55, W * 0.5, M.key, D(o, 'spot', 0.12)); lightPool(g, W / 2, GY, W * 0.3, M.key, 0.12, 0.2); });
  return { GY, M };
}

export const SETS = { porch, kitchen, farmStand, park, monitorRoom, fogWindow, bedroom, street, classroom, studio };
