// _lib.js — shared helpers, props and extra sets for "What If You Turned Invisible?"
import { E, mood, layer, blurLayer, backdrop, rr, seg, poly, circle, ring, linGrad, radGrad, glow, alpha, shade, mix, text, FONTS, clamp, lerp, ease, prog, rng, veil, S } from '/engine/core.js';
import { drawGlow, bigGlow, idle, gPosesAt, blinkAt, gWalk, headPosG } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import { camPath, drift, camAdd } from '/engine/motion.js';

export const W = 1920, H = 1080;
// ---------- timing ----------
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
export const wt = (word, after = 0) => { const m = norm(word); const w = E.words.find(w => w.start >= after - 0.05 && norm(w.word).startsWith(m)); return w ? w.start : null; };
// local time (seconds into the shot) of a word spoken during this shot, else fallback
export const lw = (info, word, fb = 0.5) => { const a = wt(word, info.shot.start - 0.3); return a != null && a < info.shot.end + 0.3 ? Math.max(0, a - info.shot.start) : fb; };
export const cm = (t, info, p = {}) => camAdd(camPath(t, [[0, { z: p.z0 ?? 1.0, x: p.x0 ?? -25, y: p.y0 ?? 0 }], [info.dur, { z: p.z1 ?? 1.06, x: p.x1 ?? 25, y: p.y1 ?? 0 }]]), drift(t, 3, p.seed ?? 1));

// ---------- cast ----------
export const YOU = { top: 'hoodie', color: '#69b39e' };
export const C = {
  coral: { top: 'hoodie', color: '#a24b49' }, mustard: { top: 'hoodie', color: '#c8a868' }, lilac: { top: 'hoodie', color: '#9a86b8', hood: 'up' },
  slate: { top: 'jacket', color: '#7d8aa8' }, olive: { top: 'hoodie', color: '#5e7441' }, navy: { top: 'coat', color: '#4a5a8a' }, pink: { top: 'hoodie', color: '#c86a9a' },
  taupe: { top: 'sweater', color: '#857062' }, purple: { top: 'hoodie', color: '#7a5ab0' }, blue: { top: 'tee', color: '#4a6ab8' },
};
export const CROWD = [C.coral, C.mustard, C.lilac, C.slate, C.olive, C.navy, C.pink, C.taupe, C.purple, C.blue];
export const GUARD = { top: 'jacket', color: '#33405e', hat: 'cap', hatColor: '#22293e', patch: '#e8c04a' };
export const WOMAN = { top: 'coat', color: '#c86a9a', hat: 'bun' };
export const MOM = { top: 'sweater', color: '#c8a868', hat: 'ponytail' }, DAD = { top: 'sweater', color: '#7d8aa8', glasses: true }, SIB = { top: 'hoodie', color: '#9a86b8', build: 'kid' };
export const COP = { top: 'jacket', color: '#2c3a66', hat: 'cap', hatColor: '#1c2440', patch: '#e8c04a' }, DOC = { top: 'labcoat', color: '#eceaf0', glasses: true }, FRIEND = { top: 'hoodie', color: '#e0874a' };
export const SHEP = { top: 'dress', color: '#8a6a4a', build: 'adult' }, KING = { top: 'dress', color: '#7a3a8a', hat: 'crown', hatColor: '#f2c14a', cape: '#a8323a' }, QUEEN = { top: 'dress', color: '#c86a9a', hat: 'crown', hatColor: '#f2c14a' };
export const PLATO = { top: 'dress', color: '#e8e2d4' }, KID = { top: 'hoodie', color: '#69b39e', build: 'kid' };

export function you(g, o) {
  drawGlow(g, { s: 1.5, facing: 1, outfit: YOU, invisible: o.inv ?? 0.94, edgeColor: o.edge || '#eef8ff', rim: { color: o.rimC || '#fff4e0', dir: [-0.6, -0.8] }, blink: blinkAt(o.t || 0, 3.3, 2), turn: 0.2, pose: idle('stand', o.t || 0, 1, 4), ...o });
}
export function person(g, o) { drawGlow(g, { s: 1.4, facing: 1, turn: 0.25, rim: { color: o.rimC || '#fff4e0', dir: [-0.6, -0.8] }, blink: blinkAt(o.t || 0, 3.0 + (o.seed || 0) * 0.3, o.seed || 0), pose: idle('stand', o.t || 0, 1, o.seed || 0), ...o }); }
export function walker(g, t, o) { const sp = o.speed ?? 120, x = o.x + (o.facing || 1) * sp * t * (o.s || 1.2); drawGlow(g, { s: 1.2, turn: 0.85, rim: { color: o.rimC || '#fff4e0', dir: [-0.6, -0.8] }, pose: gWalk(t * 5.6 * (o.run ? 1.6 : 1) + (o.seed || 0), { run: o.run }), ...o, x }); return x; }

// clothes with nobody inside: draw the figure with the head clipped away
export function emptyClothes(g, o) {
  const hp = headPosG({ s: 1.5, facing: 1, turn: 0.2, ...o });
  g.save(); g.beginPath(); g.rect(-W, -H, W * 3, H * 3); g.arc(hp[0], hp[1], hp[2] * 1.12, 0, Math.PI * 2); g.clip('evenodd');
  drawGlow(g, { s: 1.5, facing: 1, turn: 0.2, outfit: { ...YOU, legs: '#3c5a8c', strings: true }, rim: { color: '#fff4e0', dir: [-0.6, -0.8] }, ...o, expr: 'tiny', eyeColor: 'rgba(0,0,0,0)' });
  g.restore();
}

// ---------- small graphics ----------
export function floor(g, y0, c0, c1) { g.fillStyle = linGrad(g, 0, y0, 0, H, [c0, c1]); g.fillRect(-W, y0, W * 3, H * 2); }
export function puff(g, x, y, r, a) { if (a <= 0) return; g.save(); g.globalAlpha *= a; for (let i = 0; i < 4; i++) circle(g, x + Math.cos(i * 1.7) * r * 0.45, y + Math.sin(i * 2.3) * r * 0.3, r * (0.55 + i * 0.08), 'rgba(240,246,255,.55)'); g.restore(); }
export function footprint(g, x, y, s = 1, a = 1, flip = false, col = '#3a2a24') { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(flip ? -s : s, s * 0.45); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 14, 26, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(0, 36, 10, 12, 0, 0, Math.PI * 2); g.fill(); for (let i = 0; i < 5; i++) circle(g, -10 + i * 5, -32 + Math.abs(i - 1.5) * 2, 3.6, col); g.restore(); }
export function fingerprint(g, x, y, r, a = 1, col = 'rgba(70,80,110,.8)') { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = r * 0.07; for (let i = 1; i <= 6; i++) { g.beginPath(); g.ellipse(x, y, r * i / 6 * 0.75, r * i / 6, 0, Math.PI * (0.1 + i * 0.03), Math.PI * (2.0 - i * 0.02)); g.stroke(); } g.restore(); }
export function cash(g, x, y, s = 1, n = 5) { for (let i = 0; i < n; i++) { const yy = y - i * 9 * s, dx = Math.sin(i * 2.1) * 6 * s; rr(g, x - 60 * s + dx, yy - 26 * s, 120 * s, 26 * s, 3 * s); g.fillStyle = i % 2 ? '#6aa86a' : '#7cbc78'; g.fill(); rr(g, x - 14 * s + dx, yy - 26 * s, 28 * s, 26 * s, 2); g.fillStyle = '#e8d890'; g.fill(); } }
export function croissant(g, x, y, s = 1, bite = 0) { g.save(); g.translate(x, y); g.scale(s, s); const n = Math.round(5 * (1 - bite)); for (let i = 0; i < 5; i++) { if (i >= n && i > 0) continue; const a = -0.9 + i * 0.45; g.fillStyle = i % 2 ? '#e0a050' : '#d08a3a'; g.beginPath(); g.ellipse(Math.sin(a) * 60, -Math.cos(a) * 18 + 10, 26 - Math.abs(i - 2) * 5, 22 - Math.abs(i - 2) * 4, a, 0, Math.PI * 2); g.fill(); } g.fillStyle = 'rgba(255,240,200,.35)'; g.beginPath(); g.ellipse(-8, -6, 30, 6, -0.1, 0, Math.PI * 2); g.fill(); g.restore(); }
export function lump(g, x, y, r) { g.fillStyle = '#c9a070'; g.beginPath(); for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI * 2, rr2 = r * (0.8 + 0.25 * Math.sin(i * 2.7)); i ? g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2) : g.moveTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); g.fill(); circle(g, x - r * 0.3, y - r * 0.3, r * 0.25, 'rgba(255,240,210,.5)'); }
export function cctv(g, x, y, s = 1, ang = 0.3, M) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, 0], [0, 40]], 10, '#5a6070'); g.translate(0, 40); g.rotate(ang); rr(g, -20, -22, 110, 44, 10); g.fillStyle = '#e8eaee'; g.fill(); rr(g, 86, -16, 26, 32, 6); g.fillStyle = '#2a2e3a'; g.fill(); circle(g, 99, 0, 9, '#4a6aa8'); circle(g, 20, -10, 5, '#e84a4a'); g.restore(); }
export function phoneProp(g, x, y, s = 1, glowA = 0.6) { rr(g, x - 26 * s, y - 50 * s, 52 * s, 100 * s, 8 * s); g.fillStyle = '#1c1e2a'; g.fill(); rr(g, x - 22 * s, y - 44 * s, 44 * s, 86 * s, 5 * s); g.fillStyle = mix('#8ab8ff', '#ffffff', 0.3); g.globalAlpha *= 1; g.fill(); glow(g, x, y, 90 * s, '#9ac0ff', glowA * 0.4); }
export function bike(g, x, y, s = 1, col = '#d8453a', ph = 0) { g.save(); g.translate(x, y); g.scale(s, s); for (const wx of [-70, 70]) { ring(g, wx, -40, 40, 7, '#2a2a34'); for (let k = 0; k < 3; k++) { const a = ph + k * 1.05; seg(g, [[wx + Math.cos(a) * 36, -40 + Math.sin(a) * 36], [wx - Math.cos(a) * 36, -40 - Math.sin(a) * 36]], 2, '#6a6a7a'); } } seg(g, [[-70, -40], [-10, -40], [40, -100], [-30, -100], [-70, -40]], 8, col); seg(g, [[-10, -40], [-40, -110]], 8, col); seg(g, [[40, -100], [70, -40]], 8, col); seg(g, [[40, -100], [46, -128], [62, -128]], 7, '#2a2a34'); rr(g, -58, -118, 36, 10, 5); g.fillStyle = '#2a2a34'; g.fill(); g.restore(); }
export function dog(g, x, y, s = 1, o = {}) {
  const { facing = 1, bark = 0, t = 0, col = '#c8955a' } = o; g.save(); g.translate(x, y); g.scale(s * facing, s);
  G.softShadow(g, 0, 0, 90, 10, 0.3); const wag = Math.sin(t * 14) * 0.4;
  seg(g, [[-70, -70], [-100 + wag * 20, -110]], 12, shade(col, -0.1));
  for (const lx of [-50, -30, 40, 58]) seg(g, [[lx, -50], [lx, 0]], 13, shade(col, lx < 0 ? -0.15 : -0.05));
  rr(g, -80, -95, 160, 60, 30); g.fillStyle = col; g.fill();
  const hy = -112 - bark * 6; g.save(); g.translate(80, hy); g.rotate(-bark * 0.15); circle(g, 0, 0, 38, col); rr(g, 14, -8, 52, 30, 14); g.fillStyle = shade(col, 0.08); g.fill(); circle(g, 64, -2, 9, '#2a2024');
  if (bark > 0.2) { g.fillStyle = '#5a2a2a'; g.beginPath(); g.ellipse(46, 24, 16, 10 * bark, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = shade(col, -0.3); g.beginPath(); g.ellipse(-16, -14, 14, 30, 0.4, 0, Math.PI * 2); g.fill(); circle(g, 14, -10, 7, '#1a1418'); circle(g, 16, -12, 2.5, '#fff'); g.restore();
  g.restore();
}
export function barkLines(g, x, y, t, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; for (let i = 0; i < 3; i++) { const k = ((t * 2.2 + i / 3) % 1); g.strokeStyle = alpha('#ffffff', 0.85 * (1 - k)); g.lineWidth = 6; g.beginPath(); g.arc(x, y, 30 + k * 90, -0.5, 0.5); g.stroke(); } g.restore(); }
export function trafficLight(g, x, y, s = 1, green = 1, man = 1) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, 0], [0, -420]], 16, '#3a3e4a'); rr(g, -70, -620, 140, 220, 18); g.fillStyle = '#2a2e3a'; g.fill(); for (const [yy, on, c] of [[-560, !green, '#e84a4a'], [-460, green, '#4ae87a']]) { circle(g, 0, yy, 42, on ? c : shade(c, -0.75)); if (on) glow(g, 0, yy, 140, c, 0.45); if (on && yy === -460 && man) { g.globalAlpha *= man; circle(g, 0, yy - 22, 8, '#eafff0'); seg(g, [[0, yy - 12], [0, yy + 10]], 9, '#eafff0'); seg(g, [[0, yy + 8], [-10, yy + 28]], 7, '#eafff0'); seg(g, [[0, yy + 8], [12, yy + 26]], 7, '#eafff0'); seg(g, [[0, yy - 6], [-12, yy + 6]], 6, '#eafff0'); seg(g, [[0, yy - 6], [12, yy + 2]], 6, '#eafff0'); g.globalAlpha = 1; } } g.restore(); }
export function bigPhone(g, cx, cy, h, draw) { const w = h * 0.5; g.fillStyle = alpha('#000', 0.3); rr(g, cx - w / 2 + 8, cy - h / 2 + 14, w, h, w * 0.14); g.fill(); rr(g, cx - w / 2, cy - h / 2, w, h, w * 0.14); g.fillStyle = '#16181f'; g.fill(); const ix = cx - w / 2 + w * 0.05, iy = cy - h / 2 + w * 0.05, iw = w * 0.9, ih = h - w * 0.1; g.save(); rr(g, ix, iy, iw, ih, w * 0.1); g.clip(); g.fillStyle = '#f4f2f6'; g.fillRect(ix, iy, iw, ih); draw(g, ix, iy, iw, ih); g.restore(); rr(g, cx - w * 0.14, iy + 10, w * 0.28, 18, 9); g.fillStyle = '#16181f'; g.fill(); }
export function tvSet(g, x, y, w, h, on, t) { rr(g, x - 8, y - 8, w + 16, h + 16, 10); g.fillStyle = '#1a1c24'; g.fill(); g.fillStyle = on ? linGrad(g, 0, y, 0, y + h, ['#6ab0e8', '#3a6aa8']) : '#14161c'; g.fillRect(x, y, w, h); if (on) { for (let i = 0; i < 3; i++) G.cloud ? null : 0; circle(g, x + w * (0.3 + 0.1 * Math.sin(t)), y + h * 0.6, h * 0.18, '#f2c14a'); rr(g, x + w * 0.55, y + h * 0.35, w * 0.25, h * 0.5, 8); g.fillStyle = '#e86a5a'; g.fill(); glow(g, x + w / 2, y + h / 2, w, '#8ac0ff', 0.25); } seg(g, [[x + w / 2, y + h + 8], [x + w / 2, y + h + 40]], 12, '#2a2c34'); }
export function doorway(g, x, y, w, h, open, col = '#6a4a3a', light = '#ffd59a') { // x,y bottom-left
  g.fillStyle = shade(col, -0.35); g.fillRect(x - 14, y - h - 14, w + 28, h + 14);
  if (open > 0) { g.fillStyle = light; g.fillRect(x, y - h, w, h); glow(g, x + w / 2, y - h / 2, h, light, 0.5 * open); }
  const dw = w * (1 - open * 0.85); rr(g, x, y - h, dw, h, 4); g.fillStyle = col; g.fill(); g.fillStyle = shade(col, -0.12); rr(g, x + dw * 0.12, y - h * 0.9, dw * 0.76, h * 0.36, 4); g.fill(); rr(g, x + dw * 0.12, y - h * 0.48, dw * 0.76, h * 0.4, 4); g.fill(); circle(g, x + dw * 0.86, y - h * 0.48, 8, '#e8c04a');
}
export function ringGold(g, x, y, r, t, a = 1) { g.save(); g.globalAlpha *= a; glow(g, x, y, r * 5, '#ffd27a', 0.6); ring(g, x, y, r, r * 0.35, '#f2c14a'); ring(g, x, y - r * 0.08, r * 0.92, r * 0.1, '#fff2b0'); circle(g, x, y - r, r * 0.3, '#8ae8ff'); g.restore(); }
export function strike(g, x, y, w, p, col = '#ff6a5c') { if (p <= 0) return; seg(g, [[x - w / 2, y + 6], [x - w / 2 + w * p, y - 4]], 8, col); }
export function heat(g, x, y, r, t, a = 1) { g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha *= a; for (let i = 0; i < 3; i++) { const k = ((t * 0.7 + i / 3) % 1); g.strokeStyle = alpha('#ffa060', 0.55 * (1 - k)); g.lineWidth = 6; g.beginPath(); for (let j = 0; j <= 20; j++) { const yy = y - k * r * 1.4 - j * 8; const xx = x + (i - 1) * r * 0.5 + Math.sin(j * 0.6 + t * 4 + i) * 10; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); }
export function heart(g, x, y, s, col = '#e84a5a') { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + 9 * s); g.bezierCurveTo(x - 16 * s, y - 2 * s, x - 8 * s, y - 14 * s, x, y - 5 * s); g.bezierCurveTo(x + 8 * s, y - 14 * s, x + 16 * s, y - 2 * s, x, y + 9 * s); g.fill(); }
export function clockFace(g, x, y, r, hh, mm) { circle(g, x, y + 6, r, alpha('#000', 0.25)); circle(g, x, y, r, '#f2efe8'); ring(g, x, y, r, r * 0.06, '#34343e'); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8], [x + Math.sin(a) * r * 0.9, y - Math.cos(a) * r * 0.9]], r * 0.04, '#34343e'); } const am = mm / 60 * Math.PI * 2, ah = (hh % 12 + mm / 60) / 12 * Math.PI * 2; seg(g, [[x, y], [x + Math.sin(ah) * r * 0.5, y - Math.cos(ah) * r * 0.5]], r * 0.07, '#34343e'); seg(g, [[x, y], [x + Math.sin(am) * r * 0.75, y - Math.cos(am) * r * 0.75]], r * 0.045, '#d8453a'); circle(g, x, y, r * 0.06, '#34343e'); }

// ---------- extra sets: fn(g, t, cam, o) → { GY, M, … } ----------
// generic interior room: wall, skirting, floor, optional window, door, frame, plant, lamp
export function room(g, t, cam, o = {}) {
  const M = mood(o.mood || 'home'), GY = o.GY ?? H * 0.84;
  backdrop(g, [M.wall, M.wall2]);
  blurLayer(g, o.dof ?? 1.5, (g) => {
    g.fillStyle = linGrad(g, 0, -H, 0, GY, [shade(o.wall || M.wall, -0.06), o.wall || M.wall]); g.fillRect(-W, -H, W * 3, GY + H);
    if (o.stripes) { g.fillStyle = alpha('#ffffff', 0.04); for (let x = -W; x < W * 2; x += 80) g.fillRect(x, -H, 36, GY + H); }
    if (o.window !== false) { const wx = o.windowX ?? W * 0.62, wy = H * 0.12, ww = 380, wh = 360; rr(g, wx - 14, wy - 14, ww + 28, wh + 28, 6); g.fillStyle = M.trim; g.fill(); g.fillStyle = linGrad(g, 0, wy, 0, wy + wh, M.sky); g.fillRect(wx, wy, ww, wh); if (o.night) { circle(g, wx + 280, wy + 80, 24, '#f2f0ff'); glow(g, wx + 280, wy + 80, 110, '#dfe6ff', 0.35); } else { G.skylineSoft ? null : 0; g.fillStyle = alpha(shade(M.sky[0], -0.2), 0.6); for (let i = 0; i < 5; i++) g.fillRect(wx + 10 + i * 76, wy + wh * (0.45 + (i % 2) * 0.12), 60, wh); } seg(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 10, M.trim); seg(g, [[wx, wy + wh / 2], [wx + ww, wy + wh / 2]], 10, M.trim); G.lightPool(g, wx + ww / 2, wy + wh, 520, M.key, 0.22, 0.6); }
    if (o.frame !== false) G.frame(g, o.frameX ?? W * 0.22, H * 0.16, 200, 150);
    if (o.door) doorway(g, o.doorX ?? W * 0.08, GY, 200, 440, o.doorOpen || 0, '#7a5a48', M.key);
    if (o.clock) G.clockWall(g, o.clockX ?? W * 0.45, H * 0.16, 56, t);
    if (o.shelf) G.bookshelf(g, o.shelfX ?? W * 0.82, GY, 260, 420);
    if (o.extraBack) o.extraBack(g, M, GY);
  }, cam, 0.92);
  layer(g, cam, 1, (g) => { g.fillStyle = shade(M.trim, -0.18); g.fillRect(-W, GY - 16, W * 3, 16); floor(g, GY, o.floor || M.floor, o.floor2 || M.floor2); if (o.rug) { g.fillStyle = alpha(o.rug, 0.85); g.beginPath(); g.ellipse(W * 0.5, GY + 90, 560, 70, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = alpha('#ffffff', 0.25); g.lineWidth = 6; g.beginPath(); g.ellipse(W * 0.5, GY + 90, 500, 56, 0, 0, Math.PI * 2); g.stroke(); }
    if (o.plant !== false) G.plant(g, o.plantX ?? W * 0.93, GY + 6, 1.3); if (o.lamp) G.nightLamp(g, o.lampX ?? W * 0.86, GY, M, { on: o.lamp }); if (o.extra) o.extra(g, M, GY); });
  return { GY, M };
}

export function bank(g, t, cam, o = {}) {
  const M = mood('office'), GY = H * 0.86, CY = GY - 230;
  backdrop(g, ['#c8c2b8', '#a8a294']);
  blurLayer(g, o.dof ?? 2, (g) => {
    g.fillStyle = linGrad(g, 0, -H, 0, GY, ['#b8b0a2', '#d8d0c0']); g.fillRect(-W, -H, W * 3, GY + H);
    for (let x = -W; x < W * 2; x += 360) { g.fillStyle = '#e6dfd0'; g.fillRect(x, -H, 70, GY + H); g.fillStyle = alpha('#000', 0.08); g.fillRect(x + 60, -H, 10, GY + H); }
    text(g, 'CITY BANK', W * 0.42, H * 0.12, { size: 64, font: FONTS.sans, weight: 800, color: '#6a5a3a', spacing: 14 });
    // vault
    const vx = o.vaultX ?? W * 0.82, vy = H * 0.46, vr = 210; circle(g, vx, vy, vr + 30, '#7a7a84'); circle(g, vx, vy, vr, '#2a2a34'); glow(g, vx, vy, vr, '#ffd27a', 0.35);
    for (let i = 0; i < 4; i++) cash(g, vx - 80 + i * 55, vy + 120 - (i % 2) * 40, 0.6, 3);
    g.save(); g.translate(vx + vr * 0.95, vy); g.scale(0.32, 1); circle(g, 0, 0, vr, '#a8a8b4'); ring(g, 0, 0, vr * 0.6, 22, '#7a7a84'); g.restore();
    for (const lx of [0.15, 0.55]) { seg(g, [[W * lx, -H], [W * lx, H * 0.05]], 4, '#5a5a5a'); circle(g, W * lx, H * 0.07, 34, '#fff2d0'); glow(g, W * lx, H * 0.07, 220, '#ffe2a0', 0.5); }
  }, cam, 0.85);
  layer(g, cam, 1, (g) => { floor(g, GY - 6, '#8a7a6a', '#5a4e44'); g.fillStyle = alpha('#ffffff', 0.06); for (let x = -W; x < W * 2; x += 160) g.fillRect(x, GY, 4, H); });
  layer(g, cam, 1, (g) => { const cx0 = o.counterX0 ?? W * 0.18, cx1 = o.counterX1 ?? W * 0.66; g.fillStyle = linGrad(g, 0, CY, 0, GY, ['#6a4a3a', '#4a3228']); g.fillRect(cx0, CY, cx1 - cx0, GY - CY); g.fillStyle = '#8a6a50'; g.fillRect(cx0 - 20, CY - 22, cx1 - cx0 + 40, 26); g.fillStyle = alpha('#cfe4f0', 0.25); g.fillRect(cx0, CY - 260, cx1 - cx0, 238); seg(g, [[cx0, CY - 260], [cx1, CY - 260]], 6, '#aab'); });
  return { GY, M, CY };
}

export function cafe(g, t, cam, o = {}) {
  const M = mood('day'), GY = H * 0.86, CY = GY - 200;
  backdrop(g, ['#e8cfa8', '#d8b88a']);
  blurLayer(g, o.dof ?? 2, (g) => {
    g.fillStyle = linGrad(g, 0, -H, 0, GY, ['#d9b48a', '#ecd2a8']); g.fillRect(-W, -H, W * 3, GY + H);
    rr(g, W * 0.06, H * 0.08, 520, 300, 10); g.fillStyle = '#3a4a3e'; g.fill(); text(g, 'CAFÉ', W * 0.06 + 260, H * 0.08 + 60, { size: 56, font: FONTS.hand, color: '#f2efe0' }); for (let i = 0; i < 4; i++) { text(g, ['Coffee', 'Latte', 'Tea', 'Croissant'][i], W * 0.06 + 70, H * 0.08 + 130 + i * 42, { size: 34, font: FONTS.hand, color: '#e8e6d8', align: 'left' }); text(g, ['2.5', '3.2', '2.0', '2.8'][i], W * 0.06 + 460, H * 0.08 + 130 + i * 42, { size: 34, font: FONTS.hand, color: '#f2c14a', align: 'right' }); }
    for (let i = 0; i < 4; i++) { const lx = W * (0.4 + i * 0.16); seg(g, [[lx, -H], [lx, H * 0.1]], 3, '#3a3a3a'); poly(g, [[lx - 40, H * 0.16], [lx + 40, H * 0.16], [lx + 18, H * 0.1], [lx - 18, H * 0.1]], '#2a4a3e'); glow(g, lx, H * 0.18, 160, '#ffd59a', 0.55); }
    rr(g, W * 0.68, H * 0.1, 520, 330, 8); g.fillStyle = M.trim; g.fill(); g.fillStyle = linGrad(g, 0, H * 0.1, 0, H * 0.4, M.sky); g.fillRect(W * 0.68 + 14, H * 0.1 + 14, 492, 302);
    for (let i = 0; i < 3; i++) G.blobTree(g, W * 0.72 + i * 170, H * 0.42, 0.45, { color: M.leaf[i % M.leaf.length], seed: i + 2 });
  }, cam, 0.85);
  layer(g, cam, 1, (g) => { floor(g, GY - 6, '#8a6448', '#5e4232'); g.fillStyle = alpha('#000', 0.08); for (let x = -W; x < W * 2; x += 120) g.fillRect(x, GY, 6, H); });
  if (o.counter !== false) layer(g, cam, 0.97, (g) => { const cx0 = o.counterX0 ?? -W * 0.2, cx1 = o.counterX1 ?? W * 0.36; g.fillStyle = linGrad(g, 0, CY, 0, GY, ['#7a5440', '#5a3a2a']); g.fillRect(cx0, CY, cx1 - cx0, GY - CY); g.fillStyle = '#e8dccc'; g.fillRect(cx0 - 10, CY - 18, cx1 - cx0 + 20, 22);
    rr(g, cx0 + 60, CY - 150, 360, 132, 10); g.fillStyle = alpha('#e8f4ff', 0.35); g.fill(); for (let i = 0; i < 3; i++) croissant(g, cx0 + 130 + i * 110, CY - 50, 0.6); G.kettle(g, cx1 - 120, CY - 18, 1, { steam: 0.5, t }); });
  return { GY, M, CY };
}
export function cafeTable(g, x, GY, s = 1) { G.softShadow(g, x, GY, 120 * s, 14, 0.3); seg(g, [[x, GY], [x, GY - 130 * s]], 12 * s, '#3a3a40'); seg(g, [[x - 50 * s, GY], [x + 50 * s, GY]], 10 * s, '#3a3a40'); rr(g, x - 110 * s, GY - 150 * s, 220 * s, 22 * s, 10 * s); g.fillStyle = '#f2ece2'; g.fill(); rr(g, x - 20 * s, GY - 180 * s, 40 * s, 32 * s, 6 * s); g.fillStyle = '#e8e4ea'; g.fill(); return GY - 150 * s; }

export function shop(g, t, cam, o = {}) {
  const M = mood('office'), GY = H * 0.86;
  backdrop(g, ['#dfe6ea', '#c6d0d6']);
  blurLayer(g, o.dof ?? 2.5, (g) => {
    g.fillStyle = '#cfd8de'; g.fillRect(-W, -H, W * 3, GY + H);
    for (let i = 0; i < 6; i++) { const x = -W * 0.2 + i * 420; seg(g, [[x, H * 0.03], [x + 260, H * 0.03]], 18, '#f8fbff'); glow(g, x + 130, H * 0.05, 200, '#ffffff', 0.4); }
    if (!o.noSign) text(g, o.sign || 'GROCERY', W * 0.5, H * 0.12, { size: 46, font: FONTS.sans, weight: 800, color: '#3a7a5a', spacing: 10 });
    for (const sx of [W * 0.02, W * 0.62]) { const sw = W * 0.4, top = H * 0.22; g.fillStyle = '#c8ccd2'; g.fillRect(sx, top, sw, GY - top); for (let r = 0; r < 4; r++) { const y = top + 30 + r * 150; g.fillStyle = '#9aa0aa'; g.fillRect(sx, y + 110, sw, 12); const rnd = rng(r * 7 + (sx > W * 0.5 ? 50 : 1)); for (let k = 0; k < 11; k++) { const c = ['#e86a5a', '#f2c14a', '#5aa8e8', '#7ac87a', '#e88ac8', '#f2924a'][Math.floor(rnd() * 6)], ih = 60 + rnd() * 40; rr(g, sx + 12 + k * (sw / 11), y + 110 - ih, sw / 11 - 12, ih, 6); g.fillStyle = c; g.fill(); } } }
  }, cam, 0.8);
  layer(g, cam, 1, (g) => { floor(g, GY - 6, '#b8c0c8', '#8a929c'); g.fillStyle = alpha('#ffffff', 0.25); g.beginPath(); g.ellipse(W / 2, GY + 60, 600, 30, 0, 0, Math.PI * 2); g.fill(); });
  return { GY, M };
}

export function cinema(g, t, cam, o = {}) {
  const M = mood('dark'); backdrop(g, ['#0c0b1c', '#16142a']); const GY = H * 0.96;
  layer(g, cam, 0.85, (g) => { const sx = W * 0.18, sy = H * 0.06, sw = W * 0.64, sh = H * 0.42; glow(g, W / 2, sy + sh / 2, W * 0.6, '#8ab0ff', 0.35); g.fillStyle = linGrad(g, 0, sy, 0, sy + sh, ['#9ac4f2', '#4a6aa8']); g.fillRect(sx, sy, sw, sh); circle(g, sx + sw * (0.3 + 0.05 * Math.sin(t)), sy + sh * 0.55, 60, '#f2c14a'); G.cloud(g, sx + sw * 0.7, sy + sh * 0.3, 200, mood('day'), { a: 0.9 });
    g.fillStyle = 'rgba(120,150,255,.06)'; poly(g, [[W / 2 - 30, H * 1.1], [sx, sy], [sx + sw, sy], [W / 2 + 30, H * 1.1]], 'rgba(150,180,255,.06)'); });
  layer(g, cam, 1, (g) => { for (let r = 0; r < 3; r++) { const y = H * (0.66 + r * 0.14); for (let i = -2; i < 14; i++) { const x = i * 150 + (r % 2) * 75; circle(g, x, y - 40, 44 + r * 6, '#0a0a16'); rr(g, x - 60, y - 10, 120, 120, 20); g.fillStyle = '#5a1e2a'; g.fill(); } } });
  return { GY, M };
}

export function concert(g, t, cam, o = {}) {
  const M = mood('dark'); backdrop(g, ['#160a2a', '#2a1240']); const GY = H * 0.62;
  layer(g, cam, 0.85, (g) => { for (let i = 0; i < 5; i++) { const x = W * (0.1 + i * 0.2), a = Math.sin(t * 1.3 + i) * 0.35; const c = ['#ff5aa8', '#5ac8ff', '#ffd25a', '#a85aff', '#5affb0'][i]; g.save(); g.globalCompositeOperation = 'screen'; g.translate(x, 0); g.rotate(a); g.fillStyle = linGrad(g, 0, 0, 0, H, [alpha(c, 0.55), alpha(c, 0)]); g.beginPath(); g.moveTo(-10, 0); g.lineTo(10, 0); g.lineTo(160, H); g.lineTo(-160, H); g.fill(); g.restore(); circle(g, x, 6, 18, c); }
    g.fillStyle = '#2a1a3a'; g.fillRect(-W, GY, W * 3, 40); glow(g, W / 2, GY - 120, 400, '#ff9ad8', 0.35);
    for (const x of [0.38, 0.5, 0.62]) drawGlow(g, { x: W * x, y: GY, s: 1.1, facing: x < 0.5 ? 1 : -1, outfit: { top: 'tee', color: ['#e86a5a', '#f2c14a', '#5aa8e8'][Math.round(x * 10) % 3] }, pose: idle(x === 0.5 ? 'cheer' : 'holdFront', t, 1.5, x * 10), turn: 0.1, rim: { color: '#ffb0e8', dir: [0, -1] } }); });
  layer(g, cam, 1, (g) => { for (let r = 0; r < 2; r++) for (let i = -2; i < 16; i++) { const x = i * 130 + r * 65, y = H * (0.86 + r * 0.12) + Math.sin(t * 6 + i) * 6; circle(g, x, y - 50, 46, '#0c0614'); rr(g, x - 50, y - 10, 100, 140, 30); g.fillStyle = '#0c0614'; g.fill(); if (i % 3 === 0) { seg(g, [[x + 30, y - 10], [x + 60, y - 90 + Math.sin(t * 6 + i) * 10]], 18, '#0c0614'); } } });
  return { GY, M };
}

export function lockers(g, t, cam, o = {}) {
  const M = mood('school'), GY = H * 0.86; backdrop(g, ['#9aa8b4', '#7a8894']);
  blurLayer(g, o.dof ?? 1.5, (g) => { g.fillStyle = '#b8c4cc'; g.fillRect(-W, -H, W * 3, GY + H); for (let i = -3; i < 22; i++) { const x = i * 110; rr(g, x + 6, H * 0.12, 98, GY - H * 0.12 - 120, 6); g.fillStyle = i % 2 ? '#4a7ab8' : '#4a72ae'; g.fill(); for (let k = 0; k < 5; k++) seg(g, [[x + 30, H * 0.16 + k * 12], [x + 80, H * 0.16 + k * 12]], 4, alpha('#000', 0.25)); rr(g, x + 80, H * 0.45, 10, 40, 4); g.fillStyle = '#c8d0d8'; g.fill(); } g.fillStyle = '#8a6a4a'; g.fillRect(-W, GY - 120, W * 3, 40); for (let i = -2; i < 20; i++) { seg(g, [[i * 160, GY - 80], [i * 160, GY]], 10, '#5a5a62'); } }, cam, 0.85);
  layer(g, cam, 1, (g) => floor(g, GY, '#a8a49c', '#88847c'));
  return { GY, M };
}

export function meetingRoom(g, t, cam, o = {}) {
  const M = mood('office'), GY = H * 0.9;
  backdrop(g, ['#3a4258', '#2a3046']);
  blurLayer(g, 2, (g) => { g.fillStyle = linGrad(g, 0, -H, 0, GY, ['#4a5470', '#5a6680']); g.fillRect(-W, -H, W * 3, GY + H); for (let i = 0; i < 3; i++) { const x = W * (0.12 + i * 0.3); rr(g, x, H * 0.08, 360, 420, 8); g.fillStyle = '#2a3046'; g.fill(); g.fillStyle = linGrad(g, 0, H * 0.1, 0, H * 0.5, ['#1a2448', '#4a5a90']); g.fillRect(x + 12, H * 0.08 + 12, 336, 396); G.skylineSoft ? 0 : 0; for (let k = 0; k < 4; k++) { g.fillStyle = '#2a3460'; g.fillRect(x + 20 + k * 84, H * 0.25 + (k % 2) * 40, 60, 300); g.fillStyle = 'rgba(255,220,140,.5)'; for (let j = 0; j < 6; j++) g.fillRect(x + 30 + k * 84, H * 0.28 + (k % 2) * 40 + j * 36, 12, 14); } } G.frame(g, W * 0.86, H * 0.2, 160, 120, { art: '#c8a868' }); }, cam, 0.9);
  layer(g, cam, 1, (g) => floor(g, GY, '#3a3040', '#2a2230'));
  return { GY, M };
}
export function boardTable(g, GY) { g.fillStyle = alpha('#000', 0.3); g.beginPath(); g.ellipse(W / 2, GY - 10, 760, 50, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = linGrad(g, 0, GY - 260, 0, GY - 200, ['#7a5440', '#5a3a2a']); g.beginPath(); g.ellipse(W / 2, GY - 230, 760, 60, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#4a3024'; g.fillRect(W / 2 - 740, GY - 230, 1480, 70); g.fillStyle = '#5a3a2a'; g.beginPath(); g.ellipse(W / 2, GY - 160, 740, 40, 0, 0, Math.PI); g.fill(); }

export function busShelter(g, x, GY, s = 1) { g.save(); g.translate(x, GY); g.scale(s, s); G.softShadow(g, 0, 0, 380, 20, 0.3); seg(g, [[-320, 0], [-320, -460]], 14, '#5a6070'); seg(g, [[320, 0], [320, -460]], 14, '#5a6070'); rr(g, -350, -490, 700, 40, 10); g.fillStyle = '#3a4a6a'; g.fill(); g.fillStyle = alpha('#cfe8ff', 0.28); g.fillRect(-320, -450, 640, 360); rr(g, 180, -440, 120, 200, 6); g.fillStyle = '#e8b84a'; g.fill(); text(g, 'BUS', 240, -340, { size: 40, font: FONTS.sans, weight: 800, color: '#2a2a34' }); rr(g, -260, -150, 360, 24, 8); g.fillStyle = '#7a5a48'; g.fill(); seg(g, [[-220, -126], [-220, 0]], 8, '#5a6070'); seg(g, [[60, -126], [60, 0]], 8, '#5a6070'); g.restore(); }

export function busInterior(g, t, cam, o = {}) {
  const M = mood('day'), GY = H * 0.92; backdrop(g, ['#c8d4dc', '#a8b4bc']);
  blurLayer(g, 1.5, (g) => { g.fillStyle = '#dfe6ea'; g.fillRect(-W, -H, W * 3, GY + H); for (let i = -1; i < 5; i++) { const x = i * 480 + ((t * 300) % 480) * 0; rr(g, x + 30, H * 0.12, 400, 300, 24); g.fillStyle = '#4a5a6a'; g.fill(); g.save(); rr(g, x + 42, H * 0.12 + 12, 376, 276, 18); g.clip(); g.fillStyle = linGrad(g, 0, H * 0.12, 0, H * 0.4, M.sky); g.fillRect(x, H * 0.1, 480, 320); for (let k = 0; k < 4; k++) { const hx = ((x + k * 140 - t * 260) % 1920 + 1920) % 1920 - 100; G.house(g, hx, H * 0.4, 120, 140, M, { seed: k + i }); } g.restore(); } seg(g, [[-W, H * 0.06], [W * 2, H * 0.06]], 10, '#c8ccd2'); for (let i = 0; i < 8; i++) { const x = i * 260 + 60; seg(g, [[x, H * 0.06], [x, H * 0.16]], 4, '#c8ccd2'); ring(g, x, H * 0.18, 20, 6, '#e8b84a'); } }, cam, 0.85);
  layer(g, cam, 1, (g) => floor(g, GY, '#6a7280', '#4a525e'));
  return { GY, M };
}
export function seatRow(g, x, GY, s = 1) { rr(g, x - 70 * s, GY - 260 * s, 140 * s, 180 * s, 20 * s); g.fillStyle = '#3a5aa0'; g.fill(); rr(g, x - 76 * s, GY - 100 * s, 152 * s, 40 * s, 14 * s); g.fillStyle = '#2a4a8a'; g.fill(); }

export function greek(g, t, cam, o = {}) {
  const M = mood('sunset'), GY = H * 0.86, HZ = H * 0.55; backdrop(g, ['#f2a878', '#f6c890', '#fbe0b0']);
  blurLayer(g, 3, (g) => { G.sunDisc(g, W * 0.76, HZ - 80, 50, M); G.cloud(g, W * 0.25, H * 0.12, 380, M, { a: 0.9 }); g.fillStyle = '#c88a6a'; g.beginPath(); g.moveTo(-W, HZ + 40); for (let i = 0; i <= 12; i++) g.lineTo(-W + i * 360, HZ - 60 - Math.sin(i * 1.3) * 90); g.lineTo(W * 2, H); g.lineTo(-W, H); g.fill();
    if (o.temple) { const tx = W * 0.72, ty = HZ + 30; poly(g, [[tx - 230, ty - 260], [tx + 230, ty - 260], [tx, ty - 340]], '#f2e6d0'); for (let i = 0; i < 6; i++) g.fillRect(tx - 210 + i * 80, ty - 250, 34, 250); g.fillStyle = '#e8dcc6'; g.fillRect(tx - 240, ty, 480, 24); } }, cam, 0.5);
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#b8a060'; g.beginPath(); g.moveTo(-W, HZ + 120); for (let i = 0; i <= 16; i++) g.lineTo(-W + i * 300, HZ + 60 - Math.sin(i * 0.9) * 40); g.lineTo(W * 2, H); g.lineTo(-W, H); g.fill(); for (let i = 0; i < 3; i++) G.blobTree(g, W * (0.08 + i * 0.4), HZ + 110, 0.55, { color: '#7a8a4a', seed: i }); });
  layer(g, cam, 1, (g) => floor(g, GY - 40, '#c8a868', '#a88848'));
  return { GY, M };
}
export function sheep(g, x, y, s = 1, t = 0) { g.save(); g.translate(x, y); g.scale(s, s); G.softShadow(g, 0, 0, 70, 10, 0.25); for (const lx of [-30, 30]) seg(g, [[lx, -30], [lx, 0]], 8, '#3a3034'); for (let i = 0; i < 7; i++) circle(g, -40 + i * 13, -60 + Math.sin(i * 2) * 10, 30, '#f4f0e8'); circle(g, 50, -70 + Math.sin(t * 2) * 2, 22, '#3a3034'); circle(g, 56, -74, 4, '#fff'); g.restore(); }

export function cave(g, t, cam, o = {}) {
  const M = mood('dark'), GY = H * 0.84; backdrop(g, ['#1a1420', '#2a2030']);
  layer(g, cam, 0.85, (g) => { g.fillStyle = '#3a2e3a'; g.beginPath(); g.moveTo(-W, -H); g.lineTo(W * 2, -H); g.lineTo(W * 2, H * 2); g.lineTo(-W, H * 2); g.closePath(); g.moveTo(W * 0.85, GY); g.quadraticCurveTo(W * 0.85, H * 0.05, W * 0.5, H * 0.05); g.quadraticCurveTo(W * 0.15, H * 0.05, W * 0.15, GY); g.closePath(); g.fill('evenodd'); glow(g, W / 2, H * 0.3, W * 0.4, '#ffcf8a', 0.18); for (let i = 0; i < 8; i++) poly(g, [[W * (0.2 + i * 0.09), H * 0.02], [W * (0.24 + i * 0.09), H * 0.02], [W * (0.22 + i * 0.09), H * (0.12 + (i % 3) * 0.04)]], '#2a2230'); });
  layer(g, cam, 1, (g) => floor(g, GY, '#4a3a40', '#2a2028'));
  return { GY, M };
}
export function palace(g, t, cam, o = {}) {
  const M = mood('home'), GY = H * 0.86; backdrop(g, ['#5a3a4a', '#3a2434']);
  blurLayer(g, 1.5, (g) => { g.fillStyle = linGrad(g, 0, -H, 0, GY, ['#6a3e4e', '#8a5a5a']); g.fillRect(-W, -H, W * 3, GY + H); for (let i = -1; i < 8; i++) { const x = i * 300 + 40; g.fillStyle = '#e8d8b8'; g.fillRect(x, H * 0.04, 60, GY - H * 0.04); g.fillStyle = alpha('#000', 0.12); g.fillRect(x + 44, H * 0.04, 16, GY - H * 0.04); g.fillStyle = '#d8c8a8'; g.fillRect(x - 12, H * 0.04, 84, 30); } g.fillStyle = '#a8323a'; g.fillRect(W * 0.38, H * 0.04, W * 0.24, GY); glow(g, W * 0.2, H * 0.3, 300, '#ffb050', 0.4); glow(g, W * 0.8, H * 0.3, 300, '#ffb050', 0.4); }, cam, 0.88);
  layer(g, cam, 1, (g) => { floor(g, GY, '#8a6a5a', '#5a4038'); g.fillStyle = '#a8323a'; g.beginPath(); g.moveTo(W * 0.42, GY); g.lineTo(W * 0.58, GY); g.lineTo(W * 0.7, H); g.lineTo(W * 0.3, H); g.fill(); });
  if (o.throne !== false) layer(g, cam, 1, (g) => { const tx = W * 0.5; rr(g, tx - 110, GY - 420, 220, 330, 30); g.fillStyle = '#d8a83a'; g.fill(); rr(g, tx - 85, GY - 395, 170, 280, 20); g.fillStyle = '#8a2a3a'; g.fill(); rr(g, tx - 140, GY - 140, 280, 60, 14); g.fillStyle = '#c8982a'; g.fill(); seg(g, [[tx - 120, GY - 80], [tx - 120, GY]], 16, '#a8781a'); seg(g, [[tx + 120, GY - 80], [tx + 120, GY]], 16, '#a8781a'); });
  return { GY, M, seatY: GY - 140 };
}

// eye cross-section diagram (data mood). k: 0..1 animation; mode 'catch' | 'retina' | 'through' | 'none'
export function eyeDiagram(g, t, cx, cy, R, o = {}) {
  const inv = o.inv || 0;
  g.save(); g.globalAlpha *= 1 - inv * 0.75;
  circle(g, cx, cy, R, '#f2efe8'); circle(g, cx, cy, R * 0.94, '#f6e4e4');
  g.strokeStyle = '#e8506a'; g.lineWidth = R * 0.09; g.beginPath(); g.arc(cx, cy, R * 0.88, Math.PI * 0.62, Math.PI * 1.38); g.stroke();   // retina at the back (left)
  seg(g, [[cx - R, cy], [cx - R * 1.5, cy + R * 0.1]], R * 0.14, '#e8b0a0');                                                             // optic nerve
  g.fillStyle = '#5a8ad8'; g.beginPath(); g.ellipse(cx + R * 0.93, cy, R * 0.08, R * 0.36, 0, 0, Math.PI * 2); g.fill();                  // iris
  g.fillStyle = alpha('#ffffff', 0.85); g.beginPath(); g.ellipse(cx + R * 0.74, cy, R * 0.12, R * 0.26, 0, 0, Math.PI * 2); g.fill();    // lens
  g.restore();
  if (inv > 0.3) { g.save(); g.setLineDash([12, 10]); g.strokeStyle = alpha('#eef8ff', 0.8); g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.restore(); }
}
export function lightRay(g, x0, y0, x1, y1, p, col = '#ffe27a', w = 10) { if (p <= 0) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p); g.save(); g.globalCompositeOperation = 'screen'; seg(g, [[x0, y0], [x, y]], w * 2.4, alpha(col, 0.25)); seg(g, [[x0, y0], [x, y]], w, col); circle(g, x, y, w * 1.2, '#fffbe8'); g.restore(); }
