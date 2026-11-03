// _props.js — small drawn objects reused across shots.
import { E, V, mood, layer, backdrop, rr, seg, poly, circle, ring, linGrad, radGrad, glow, alpha, shade, mix, rng, FX, UI, ease, prog, clamp, lerp, text, FONTS, S, drawFigure, POSES, headPos, GYf, CXf } from './_lib.js';

export const walker = (x0, x1, o = {}) => ({ who: 'PLAIN', facing: x1 >= x0 ? 1 : -1, walk: { x0, x1, ...(o.walk || {}) }, s: o.s ?? V(1.3, 1.5), ...o });
export function eyeShape(g, cx, cy, w, h, o = {}) {      // a big stylised eye. o: {a, lid, look:[x,y], iris, glowK}
  const a = o.a ?? 1, lid = o.lid ?? 1, L = o.look || [0, 0], iris = o.iris || '#5a8ac0';
  g.save(); g.globalAlpha *= a; g.translate(cx, cy);
  g.beginPath(); g.moveTo(-w / 2, 0); g.quadraticCurveTo(0, -h * lid, w / 2, 0); g.quadraticCurveTo(0, h * lid, -w / 2, 0); g.closePath(); g.save(); g.clip();
  g.fillStyle = '#f2efe8'; g.fillRect(-w, -h, w * 2, h * 2);
  const ix = L[0] * w * 0.18, iy = L[1] * h * 0.2, ir = Math.min(h, w) * 0.46;
  circle(g, ix, iy, ir, iris); ring(g, ix, iy, ir * 0.7, ir * 0.08, shade(iris, 0.3)); circle(g, ix, iy, ir * 0.42, '#06070c'); circle(g, ix - ir * 0.18, iy - ir * 0.2, ir * 0.12, 'rgba(255,255,255,.85)');
  g.restore(); g.strokeStyle = '#0a0a10'; g.lineWidth = Math.max(3, h * 0.05); g.lineJoin = 'round';
  g.beginPath(); g.moveTo(-w / 2, 0); g.quadraticCurveTo(0, -h * lid, w / 2, 0); g.quadraticCurveTo(0, h * lid, -w / 2, 0); g.closePath(); g.stroke(); g.restore();
}
export function phone(g, cx, cy, w, h, fn, o = {}) {      // phone body; fn(g, x, y, w, h) draws the screen
  rr(g, cx - w / 2 - 14, cy - h / 2 - 14, w + 28, h + 28, 46); g.fillStyle = '#0b0b12'; g.fill();
  g.save(); rr(g, cx - w / 2, cy - h / 2, w, h, 34); g.clip(); g.fillStyle = o.bg || '#131a2a'; g.fillRect(cx - w / 2, cy - h / 2, w, h); fn(g, cx - w / 2, cy - h / 2, w, h); g.restore();
  glow(g, cx, cy, Math.max(w, h) * 0.9, o.glow || '#7fb0ff', 0.1);
}
export function dining(g, t, env, o = {}) {      // chairs + table + plates for the kitchen. returns seat x's
  const tx = env.tableX, GY = env.GY, M = env.M, top = GY - 150, s = V(1.45, 1.6);
  const seats = { empty: tx - 360, mum: tx - 110, kid: tx + 110, dad: tx + 350 };
  return { tx, top, seats, s };
}
export function table(g, tx, GY, M, o = {}) {
  const top = GY - 150, c = shade(M.wall, -0.5);
  seg(g, [[tx - 250, top], [tx - 250, GY - 6]], 12, c); seg(g, [[tx + 250, top], [tx + 250, GY - 6]], 12, c);
  rr(g, tx - 330, top - 14, 660, 20, 8); g.fillStyle = shade(M.wall, -0.15); g.fill(); g.fillStyle = alpha('#ffd9a0', 0.35); g.fillRect(tx - 320, top - 14, 640, 3);
  for (const dx of [-210, -70, 70, 210]) { g.fillStyle = '#e8e4ee'; g.beginPath(); g.ellipse(tx + dx, top - 16, 42, 7, 0, 0, 7); g.fill(); if (o.food !== false) { circle(g, tx + dx, top - 22, 14, '#a8643a'); } }
  return top - 14;
}
export function chair(g, x, GY, s, facing, color = '#24181e') { g.save(); g.translate(x, 0); g.scale(facing, 1); FX.chair(g, -18 * s, GY, s, color); g.restore(); }
export function cashStack(g, x, y, s = 1, o = {}) {
  for (let i = 0; i < (o.n ?? 4); i++) { g.save(); g.translate(x, y - i * 12 * s); g.rotate((o.rot || 0) + (i % 2 ? 0.02 : -0.02)); rr(g, -60 * s, -14 * s, 120 * s, 26 * s, 3); g.fillStyle = i % 2 ? '#7fb87a' : '#8fc78a'; g.fill(); g.fillStyle = '#4f8a55'; g.fillRect(-60 * s, -4 * s, 120 * s, 6 * s); g.restore(); }
  g.fillStyle = '#d8c89a'; rr(g, x - 20 * s, y - ((o.n ?? 4) - 1) * 12 * s - 15 * s, 40 * s, 30 * s, 3); g.fill();
}
export function croissant(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  const bite = o.bite ?? 0;
  g.fillStyle = '#c98a3a'; g.beginPath(); g.moveTo(-90, 20); g.quadraticCurveTo(-110, -40, -40, -50); g.quadraticCurveTo(0, -80, 40, -50); g.quadraticCurveTo(110, -40, 90, 20); g.quadraticCurveTo(50, 40, 0, 26); g.quadraticCurveTo(-50, 40, -90, 20); g.fill();
  g.strokeStyle = '#8a5524'; g.lineWidth = 6; g.lineCap = 'round'; for (const dx of [-55, -18, 18, 55]) { g.beginPath(); g.moveTo(dx, -52 + Math.abs(dx) * 0.15); g.quadraticCurveTo(dx * 0.7, -10, dx * 0.9, 24); g.stroke(); }
  g.fillStyle = 'rgba(255,230,170,.35)'; g.beginPath(); g.ellipse(-20, -40, 50, 10, -0.2, 0, 7); g.fill();
  if (bite > 0) { g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 4; i++) circle(g, 80 - i * 10, -10 + (i % 2) * 22 - 12, 22 * bite, '#000'); g.globalCompositeOperation = 'source-over'; }
  g.restore();
}
export function hand(g, x, y, s, o = {}) {      // a thick-capsule hand coming from the right edge (insert close-ups)
  const ink = o.ink || S().ink, sl = o.sleeve || '#d64a33', f = o.facing ?? 1, rim = o.rim;
  const draw = (g, dx, dy, c, c2) => { seg(g, [[x + 40 * s * f + dx, y + 20 * s + dy], [x + 900 * f, y + 260 * s]], 70 * s, c); seg(g, [[x + 150 * s * f + dx, y + 70 * s + dy], [x + 900 * f, y + 260 * s]], 96 * s, c2);
    circle(g, x + 10 * s * f + dx, y + 6 * s + dy, 40 * s, c);
    if (o.point) seg(g, [[x + dx, y + dy], [x - f * 90 * s + dx, y - 30 * s + dy]], 17 * s, c);
    else for (let i = 0; i < 4; i++) { const a = -2.2 + i * 0.32; seg(g, [[x + dx, y + dy], [x + Math.cos(a) * 95 * s * f + dx, y + Math.sin(a) * 95 * s + dy]], 17 * s, c); } };
  if (rim) draw(g, -4 * f, -5, rim, rim); draw(g, 0, 0, ink, sl);
}
export function dog(g, x, y, s, o = {}) {
  const f = o.facing ?? 1, ink = S().ink, far = S().inkFar, rim = o.rim || '#ffc68a', head = o.head ?? 0, tail = Math.sin((o.t || 0) * 10) * (o.wag ?? 0.4), b = o.bark ?? 0;
  g.save(); g.translate(x, y); g.scale(f * s, s);
  const body = (c, dx = 0, dy = 0) => { g.save(); g.translate(dx, dy);
    seg(g, [[-60, -46], [-66, -4]], 11, shade(c, 0)); seg(g, [[-30, -46], [-34, -4]], 11, c); seg(g, [[40, -46], [44, -4]], 11, c); seg(g, [[68, -46], [72, -4]], 11, c);
    g.fillStyle = c; g.beginPath(); g.ellipse(0, -64, 82, 34, 0, 0, 7); g.fill();
    seg(g, [[-76, -76], [-110, -76 + tail * 40 - 20]], 10, c); g.beginPath(); g.ellipse(84, -86 + head, 30, 26, 0, 0, 7); g.fill();
    poly(g, [[92, -100 + head], [124, -80 + head], [124, -68 + head], [88, -66 + head]], c); poly(g, [[78, -106 + head], [64, -132 + head], [92, -112 + head]], c); g.restore(); };
  body(rim, -2, -2); body(ink);
  circle(g, 100, -92 + head, 4.5, '#f4efe6'); circle(g, 123, -76 + head, 5, '#06070c');
  if (b > 0) { g.strokeStyle = '#f4efe6'; g.lineWidth = 4; g.beginPath(); g.moveTo(118, -68 + head); g.lineTo(138, -60 + head + b * 8); g.stroke(); }
  g.restore();
}
export function arrow(g, x1, y1, x2, y2, c, w = 4, head = 16) { seg(g, [[x1, y1], [x2, y2]], w, c); const a = Math.atan2(y2 - y1, x2 - x1); poly(g, [[x2, y2], [x2 - Math.cos(a - 0.5) * head, y2 - Math.sin(a - 0.5) * head], [x2 - Math.cos(a + 0.5) * head, y2 - Math.sin(a + 0.5) * head]], c); }
export function footprint(g, x, y, s = 1, flip = 1, a = 1, c = '#1a1018') { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s * flip, s); g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, 11, 22, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, -30, 10, 12, 0, 0, 7); g.fill(); for (let i = 0; i < 4; i++) circle(g, -12 + i * 8, -50 + Math.abs(i - 1.5) * 4, 3.5, c); g.restore(); }
export function steam(g, x, y, t, o = {}) {   // breath puffs rising from (x, y)
  const n = o.n ?? 5, col = o.color || '#e8f0ff', s = o.s ?? 1;
  for (let i = 0; i < n; i++) { const ph = ((t * (o.speed ?? 0.5) + i / n) % 1), k = ease.out(ph); const px = x + (o.dir ?? 1) * 70 * k * s + Math.sin(ph * 6 + i) * 8, py = y - 90 * k * s; const r = (10 + 38 * k) * s; glow(g, px, py, r * 1.7, col, 0.36 * (1 - ph)); }
}
export function bubble2(g, x, y, str, o = {}) {
  const w = o.w ?? Math.max(120, str.length * 20 + 50), h = o.h ?? 74, a = o.a ?? 1; g.save(); g.globalAlpha *= a;
  rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = o.color || '#f4efe6'; g.fill(); poly(g, [[x - w * 0.18, y + h / 2 - 4], [x - w * 0.3, y + h / 2 + 26], [x - w * 0.02, y + h / 2 - 4]], o.color || '#f4efe6');
  text(g, str, x, y + 2, { size: o.size ?? 34, color: o.ink || '#1a1622', weight: 800, font: FONTS.ui }); g.restore();
}
export function lump(g, x, y, s = 1, t = 0) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#7a4a26'; g.beginPath(); for (let i = 0; i <= 10; i++) { const a = i / 10 * 6.283, r = 30 + Math.sin(i * 3.1 + t * 2) * 5 + (i % 3) * 3; g.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.8); } g.closePath(); g.fill();
  circle(g, -8, -9, 6, 'rgba(255,225,170,.5)'); circle(g, 11, 6, 4, '#a8703a'); circle(g, -14, 10, 3, '#5a3418'); g.restore();
}
export function bike(g, x, y, s, t, o = {}) {
  const ink = S().ink, rim = o.rim || '#ffc68a', w = 62 * s, sp = (o.spin ?? 1) * t * 16;
  const draw = (c, dx = 0, dy = 0) => { g.save(); g.translate(dx, dy); for (const wx of [x - 90 * s, x + 90 * s]) { ring(g, wx, y - w, w, 6 * s, c); for (let i = 0; i < 4; i++) { const a = sp + i * 0.785; seg(g, [[wx + Math.cos(a) * w, y - w + Math.sin(a) * w], [wx - Math.cos(a) * w, y - w - Math.sin(a) * w]], 2 * s, c); } }
    seg(g, [[x - 90 * s, y - w], [x - 20 * s, y - w - 70 * s], [x + 90 * s, y - w], [x + 30 * s, y - w - 78 * s], [x - 20 * s, y - w - 70 * s]], 7 * s, c); seg(g, [[x + 30 * s, y - w - 78 * s], [x + 40 * s, y - w - 116 * s], [x + 62 * s, y - w - 120 * s]], 6 * s, c); g.restore(); };
  draw(rim, -3, -3); draw(ink);
}
export function car(g, x, y, s, o = {}) {
  const c = o.color || '#2a3a5a', ink = S().ink; g.save(); g.translate(x, y); g.scale((o.facing ?? 1) * s, s);
  rr(g, -150, -70, 300, 56, 18); g.fillStyle = c; g.fill(); poly(g, [[-90, -70], [-60, -118], [60, -118], [100, -70]], shade(c, -0.15)); poly(g, [[-76, -74], [-54, -108], [50, -108], [84, -74]], alpha('#9fc0e8', 0.5));
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-150, -34, 300, 18); for (const wx of [-90, 90]) { circle(g, wx, -12, 30, ink); circle(g, wx, -12, 14, '#3a3a44'); } circle(g, 144, -50, 9, '#fff3dc'); glow(g, 150, -50, 150, '#fff3dc', 0.3); circle(g, -146, -52, 7, '#ff4a40'); g.restore();
}
