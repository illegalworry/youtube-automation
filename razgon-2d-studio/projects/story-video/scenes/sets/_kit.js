// _kit.js — shared set-building helpers (not auto-loaded: underscore prefix).
import { E, V, layer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const ground = () => E.H * V(0.8, 0.68);

// a big window with a sky behind (sky: 'day'|'dusk'|'night'), mullions and a soft spill
export function bigWindow(g, M, x, y, w, h, o = {}) {
  const frame = o.frame || shade(M.wall, -0.55), sky = o.sky || M.sky;
  FX.windowFrame(g, { x, y, w, h, cols: o.cols || 3, rows: o.rows || 2, frame, bar: o.bar || 10 }, (g, wx, wy, ww, wh) => {
    g.fillStyle = linGrad(g, 0, y, 0, y + h, sky); g.fillRect(wx, wy, ww, wh);
    if (o.sun) { const [sx, sy] = o.sun; FX.sun(g, sx, sy, o.sunR || 46, '#fff3dc', M.key, 4); }
    if (o.moon) { const [mx, my] = o.moon; FX.moon(g, mx, my, 34); }
    if (o.stars) FX.stars(g, 0, { area: [wx, wy, ww, wh * 0.6], count: 40, seed: 3 });
    if (o.city !== false) FX.skyline(g, { x: x - 40, y: y + h + 4, w: w + 80, minH: h * 0.12, maxH: h * 0.42, color: mix(sky[sky.length - 1], '#0d0a12', o.night ? 0.75 : 0.55), windowColor: alpha(M.practical, o.night ? 0.8 : 0.35), lit: o.night ? 0.35 : 0.12, seed: o.seed || 9 });
    if (o.blinds) { g.fillStyle = alpha(shade(M.wall, -0.3), 0.75); for (let yy = wy; yy < wy + wh * o.blinds; yy += 14) g.fillRect(wx, yy, ww, 7); }
  });
  glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.9, o.glowC || M.key, o.glowA ?? 0.14);
}
export function wallClock(g, x, y, r, t, o = {}) { FX.clock(g, x, y, r, o.time ?? t, { speed: o.speed ?? 1, ...o }); }
export function floor(g, M, GY, o = {}) {
  g.fillStyle = linGrad(g, 0, GY, 0, GY + 420, [shade(o.color || M.floor, -0.05), shade(M.dark, -0.25)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
  FX.floorLines(g, GY, GY + 700, o.lines || 'rgba(0,0,0,.22)', 0.07);
  g.fillStyle = alpha('#000000', 0.25); g.fillRect(-E.W * 1.5, GY - 6, E.W * 4, 8);
}
export function wall(g, M, GY, o = {}) {
  const c = shade(o.color || M.wall, o.k ?? -0.25);
  g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(c, -0.35), c, shade(c, -0.12)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H + 2);
}
export function table(g, x, GY, w = 300, h = 150, c = '#21171c', light = 'rgba(255,214,160,.32)') {
  const top = GY - h; rr(g, x - w / 2, top - 14, w, 18, 8); g.fillStyle = c; g.fill(); g.fillStyle = light; g.fillRect(x - w / 2 + 6, top - 14, w - 12, 3);
  seg(g, [[x - w / 2 + 24, top], [x - w / 2 + 30, GY]], 9, c); seg(g, [[x + w / 2 - 24, top], [x + w / 2 - 30, GY]], 9, c); return top - 14;
}
export function desk(g, x, GY, w = 220, c = '#2a2030') { const top = GY - 112; rr(g, x - w / 2, top, w, 14, 4); g.fillStyle = c; g.fill(); seg(g, [[x - w / 2 + 12, top + 10], [x - w / 2 + 12, GY]], 7, c); seg(g, [[x + w / 2 - 12, top + 10], [x + w / 2 - 12, GY]], 7, c); g.fillStyle = shade(c, -0.2); g.fillRect(x - w / 2 + 16, top + 14, w - 32, 34); return top; }
export function label(g, str, x, y, size, color, a = 1) { text(g, str, x, y, { size, color, font: FONTS.ui, weight: 900, alpha: a, spacing: 2 }); }
export function shelfBooks(g, x, y, w, seed = 1, cols = ['#8a3a3a', '#3a5a8a', '#c9a24a', '#4a7a5a', '#6a4a8a', '#b86a3a']) {
  let xx = x, i = seed; while (xx < x + w - 10) { const bw = 10 + ((i * 37) % 9), bh = 50 + ((i * 53) % 26); g.fillStyle = shade(cols[((i % cols.length) + cols.length) % cols.length], -0.35); g.fillRect(xx, y - bh, bw, bh); xx += bw + 2; i++; }
}
export { FX };
