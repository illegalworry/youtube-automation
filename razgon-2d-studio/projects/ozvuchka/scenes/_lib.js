// _lib.js — sets, props and the generic spec-driven shot renderer for the Genghis Khan film.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, rng, noise, shake, talkAmount, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, backdrop, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { camPath, travel, drift, camAdd, spring, impact, posesSpring, fg, kText } from '/engine/motion.js';
import { WHO } from './cast.js';

export const GYf = () => E.H * V(0.8, 0.68);
const CXf = () => E.W / 2;

// ------------------------------------------------------------------ SETS
function skyBlock(g, M, o, cam) {
  const GY = GYf(), CX = CXf();
  layer(g, cam, 0.12, (g) => {
    backdrop(g, M.sky);
    if (o.stars) FX.stars(g, 0, { count: 160, area: [-E.W * 0.3, -E.H * 0.2, E.W * 1.6, GY * 0.8] });
    if (o.moon) FX.moon(g, CX + (o.moonX ?? 420), GY - V(560, 900), 60);
    if (o.sun) FX.sun(g, CX + (o.sunX ?? -380), GY - (o.sunY ?? V(210, 380)), 70, '#fff3dc', M.key, 5.5);
    FX.clouds(g, { y: GY - V(780, 1300), h: 240, color: o.moon ? '#8a8ac0' : '#ffe0c0', a: 0.14, seed: 4 });
  });
}
function hillsBlock(g, M, o, cam) {
  const GY = GYf();
  const dark = shade(M.dark, 0.12);
  layer(g, cam, 0.3, (g) => FX.hills(g, { y: GY - V(190, 330), amp: 110, color: mix(M.sky[Math.min(1, M.sky.length - 1)], dark, 0.7), seed: 3, freq: 0.0028 }));
  layer(g, cam, 0.5, (g) => {
    FX.hills(g, { y: GY - V(70, 150), amp: 80, color: mix(M.grass, dark, 0.6), seed: 9, freq: 0.0035 });
    if (o.farYurts) for (let i = 0; i < o.farYurts; i++) { const x = (i * 613 + 200) % (E.W * 1.4) - E.W * 0.2; yurt(g, x, GY - V(40, 80), 0.32 + (i % 3) * 0.05, M, { lit: o.night, far: true }); }
    if (o.haze) FX.fog(g, GY - V(250, 420), 260, M.sky[M.sky.length - 1], 0.25);
  });
}
function groundBlock(g, M, o, cam) {
  const GY = GYf();
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 4, 0, GY + 420, [shade(M.grass, o.night ? -0.55 : -0.35), shade(M.dark, -0.2), shade(M.dark, -0.5)]);
    g.fillRect(-E.W * 1.2, GY - 4, E.W * 4, E.H * 2);
    const r = rng(7);
    for (let i = 0; i < 60; i++) { const x = (r() * 3.4 - 1.2) * E.W, y = GY + 10 + r() * 330, w = 20 + r() * 50; seg(g, [[x, y], [x + w, y - 2]], 2, alpha(shade(M.grass, 0.1), 0.25)); }
  });
}
function grassFg(g, M, cam, t, sway = 1) {
  const GY = GYf();
  fg(g, cam, (g) => {
    const r = rng(21), col = shade(M.dark, -0.55);
    for (let i = 0; i < 26; i++) { const x = (r() * 2.4 - 0.7) * E.W, h = 120 + r() * 200, sw = Math.sin(t * 1.4 + i) * 10 * sway; g.fillStyle = col; g.beginPath(); g.moveTo(x - 10, GY + 330); g.quadraticCurveTo(x + sw * 0.4, GY + 330 - h * 0.6, x + sw + 4, GY + 330 - h); g.quadraticCurveTo(x + 4, GY + 330 - h * 0.6, x + 12, GY + 330); g.fill(); }
  }, { depth: 1.8, blur: 14 });
}

export function steppe(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYf();
  skyBlock(g, M, o, cam); hillsBlock(g, M, o, cam); groundBlock(g, M, o, cam);
  return { GY, M };
}
// inside a ger (yurt): felt wall, lattice, central fire, smoke hole light
export function gerIn(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = GYf(), CX = CXf();
  layer(g, cam, 0.6, (g) => {
    const top = GY - V(780, 1250);
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(M.wall, -0.55), shade(M.wall, -0.2), shade(M.wall, -0.45)]); g.fillRect(-E.W, top - 400, E.W * 3, GY - top + 420);
    g.strokeStyle = alpha(shade(M.wall, -0.7), 0.55); g.lineWidth = 3;
    for (let x = -E.W * 0.6; x < E.W * 1.7; x += 70) { g.beginPath(); g.moveTo(x, GY - V(420, 600)); g.lineTo(x + 130, GY); g.moveTo(x + 130, GY - V(420, 600)); g.lineTo(x, GY); g.stroke(); }
    for (let k = 0; k < 14; k++) seg(g, [[CX + (k - 7) * 260, top - 200], [CX + (k - 7) * 120, top + 150]], 8, shade(M.wall, -0.6));
    g.fillStyle = shade(M.wall, -0.7); g.fillRect(-E.W, GY - V(430, 620), E.W * 3, 26);
    // door + daylight
    FX.door(g, { x: CX + V(560, 300), y: GY, w: 160, h: V(330, 420), color: shade(M.wall, -0.6), open: 0.65, light: M.key });
    glow(g, CX + V(640, 380), GY - V(160, 200), 340, M.key, 0.28);
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.1), shade(M.dark, -0.4)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    g.fillStyle = alpha(M.practical, 0.12); g.beginPath(); g.ellipse(CX, GY + 70, 520, 70, 0, 0, 7); g.fill();
  });
  return { GY, M };
}
export function river(g, t, cam, o = {}) {
  const night = (o.mood || 'night') === 'night';
  const base = steppe(g, t, cam, { ...o, mood: o.mood || 'night', stars: night, moon: night, night });
  const { GY, M } = base;
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, GY + 120, [alpha(M.sky[1], 0.9), alpha(shade(M.sky[0], -0.3), 0.95)]); g.fillRect(-E.W, GY - 40, E.W * 3, 170);
    for (let i = 0; i < 26; i++) { const x = ((i * 197 + t * 24) % (E.W * 1.8)) - E.W * 0.4; seg(g, [[x, GY - 30 + (i % 5) * 24], [x + 70, GY - 30 + (i % 5) * 24]], 2.5, alpha(M.key, 0.25)); } });
  return base;
}
export function city(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = GYf(), CX = CXf();
  skyBlock(g, M, { sun: true, sunX: 300, ...o }, cam); hillsBlock(g, M, { haze: true }, cam);
  layer(g, cam, 0.55, (g) => {
    const wallC = shade(M.wall, -0.1), w = 2600, h = V(330, 520), top = GY - h;
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wallC, 0.08), wallC, shade(wallC, -0.4)]); g.fillRect(CX - w / 2, top, w, h + 6);
    for (let x = CX - w / 2; x < CX + w / 2; x += 70) g.fillRect(x, top - 34, 40, 36);
    for (const tx of [-1000, -420, 420, 1000]) { g.fillStyle = shade(wallC, -0.15); g.fillRect(CX + tx - 70, top - 150, 140, h + 150); for (let x = -70; x < 70; x += 46) g.fillRect(CX + tx + x, top - 188, 28, 40); g.fillStyle = M.practical; g.fillRect(CX + tx - 8, top - 90, 16, 54); glow(g, CX + tx, top - 62, 90, M.practical, 0.5); }
    // dome + minaret behind
    g.fillStyle = shade(wallC, -0.3); g.beginPath(); g.arc(CX, top - 40, 180, Math.PI, 0); g.fill(); seg(g, [[CX, top - 220], [CX, top - 300]], 6, shade(wallC, -0.3));
    // gate
    g.fillStyle = shade(M.dark, -0.4); g.beginPath(); g.moveTo(CX - 90, GY); g.lineTo(CX - 90, GY - 170); g.arc(CX, GY - 170, 90, Math.PI, 0); g.lineTo(CX + 90, GY); g.fill();
    glow(g, CX, GY - 120, 160, M.practical, o.burn ? 0.7 : 0.25);
    if (o.burn) { const tt = t; for (let i = 0; i < 9; i++) flame(g, CX + (i - 4) * 260 + Math.sin(i * 4) * 60, top + 20 + (i % 3) * 20, 1.6 + (i % 2) * 0.7, tt + i); glow(g, CX, top, 900, '#ff7a30', 0.35); }
  });
  groundBlock(g, M, {}, cam);
  return { GY, M };
}
export function assembly(g, t, cam, o = {}) {
  const base = steppe(g, t, cam, { mood: o.mood || 'golden', sun: true, sunX: 200, farYurts: 0, haze: true, ...o });
  layer(g, cam, 0.62, (g) => { const GY = base.GY; for (let i = 0; i < 22; i++) yurt(g, -E.W * 0.5 + i * 230 + (i % 3) * 40, GY - 30, 0.55 + (i % 4) * 0.08, base.M, { far: true }); });
  return base;
}
export function voidSet(g, t, cam, o = {}) {
  const M = mood('void'); g.fillStyle = M.sky[0]; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  UI.blueprint(g, { a: 0.09 }); return { GY: GYf(), M };
}
export function grave(g, t, cam, o = {}) {
  const M = mood(o.mood || 'storm'), GY = GYf();
  skyBlock(g, M, { stars: true, moon: true, moonX: -300 }, cam); hillsBlock(g, M, { haze: true }, cam); groundBlock(g, M, { night: true }, cam);
  layer(g, cam, 0.8, (g) => { for (let i = 0; i < 6; i++) FX.pine(g, -E.W * 0.3 + i * 520 + (i % 2) * 90, GY - 30, 1.5, shade(M.dark, -0.5)); });
  return { GY, M };
}
export const SETS = { steppe, ger: gerIn, river, city, assembly, void: voidSet, grave };

// ------------------------------------------------------------------ PROPS
export function flame(g, x, y, s, t) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [k, c, a] of [[1, '#ff7a28', 0.55], [0.7, '#ffc24a', 0.7], [0.4, '#fff1b0', 0.8]]) {
    const w = 22 * s * k, h = (60 + Math.sin(t * 17 + x) * 8 + Math.sin(t * 29) * 5) * s * k;
    g.fillStyle = alpha(c, a); g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x - w * 0.6 + Math.sin(t * 12) * 4, y - h * 0.6, x + Math.sin(t * 15) * 5, y - h); g.quadraticCurveTo(x + w * 0.7, y - h * 0.5, x + w, y); g.closePath(); g.fill();
  }
  g.restore();
}
export function fire(g, t, x, GY, s = 1, M = mood('night')) {
  glow(g, x, GY - 30 * s, 340 * s, '#ff8a3a', 0.45); FX.pool(g, x, GY + 14, 360 * s, 60 * s, '#ff8a3a', 0.35);
  seg(g, [[x - 40 * s, GY + 4], [x + 38 * s, GY - 14 * s]], 12 * s, '#1a1018'); seg(g, [[x + 40 * s, GY + 4], [x - 38 * s, GY - 14 * s]], 12 * s, '#241420');
  flame(g, x, GY - 4 * s, 1.6 * s, t);
  const r = rng(Math.floor(x));
  for (let i = 0; i < 10; i++) { const ph = (t * 0.7 + r()) % 1; circle(g, x + (r() - 0.5) * 60 * s + Math.sin(t * 3 + i) * 12, GY - 30 * s - ph * 280 * s, 2.2 * (1 - ph), alpha('#ffc860', 0.9 * (1 - ph))); }
}
export function torch(g, t, x, y, s = 1) {
  seg(g, [[x, y], [x - 4 * s, y + 80 * s]], 7 * s, '#1a1018'); flame(g, x, y + 2, 0.9 * s, t); glow(g, x, y - 30 * s, 190 * s, '#ff9a40', 0.5);
}
export function yurt(g, x, GY, s, M, o = {}) {
  const wallC = shade(M.wall, o.far ? -0.35 : -0.5);
  g.fillStyle = wallC; g.fillRect(x - 130 * s, GY - 110 * s, 260 * s, 110 * s);
  g.beginPath(); g.moveTo(x - 150 * s, GY - 108 * s); g.quadraticCurveTo(x, GY - 330 * s, x + 150 * s, GY - 108 * s); g.closePath(); g.fillStyle = shade(wallC, 0.05); g.fill();
  g.fillStyle = shade(wallC, -0.4); g.fillRect(x - 150 * s, GY - 112 * s, 300 * s, 10 * s);
  g.beginPath(); g.moveTo(x - 36 * s, GY); g.lineTo(x - 36 * s, GY - 72 * s); g.arc(x, GY - 72 * s, 36 * s, Math.PI, 0); g.lineTo(x + 36 * s, GY); g.fillStyle = o.lit ? M.practical : shade(M.dark, -0.4); g.fill();
  if (o.lit) glow(g, x, GY - 50 * s, 190 * s, M.practical, 0.4);
  seg(g, [[x, GY - 219 * s], [x, GY - 246 * s]], 4 * s, wallC);
}
// horse (side view, faces +x); returns saddle position
export function horse(g, t, x, GY, s, o = {}) {
  const ink = S().ink, far = S().inkFar, f = o.facing ?? 1, ph = (o.phase ?? t * 8.5) * (o.gait === 'still' ? 0 : 1);
  const bob = o.gait === 'still' ? 0 : Math.abs(Math.sin(ph)) * 7;
  g.save(); g.translate(x, GY); g.scale(f * s, s);
  const leg = (hx, p, col) => {
    const hip = [hx, -112 - bob], fh = o.gait === 'still' ? [hx + 4, 0] : [hx + 46 * Math.sin(p), -34 * Math.max(0, Math.cos(p))];
    const kn = [lerp(hip[0], fh[0], 0.5) + 12, lerp(hip[1], fh[1], 0.5) - 4];
    seg(g, [hip, kn, [fh[0], fh[1] - 6]], 13, col); seg(g, [[fh[0] - 4, fh[1] - 2], [fh[0] + 10, fh[1]]], 11, col);
  };
  leg(56, ph + 2.6, far); leg(-56, ph + 3.3, far);
  g.fillStyle = ink;
  g.beginPath(); g.ellipse(0, -128 - bob, 80, 32, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(52, -132 - bob, 36, 38, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(-54, -128 - bob, 36, 34, 0, 0, 7); g.fill();
  const hb = o.gait === 'still' ? Math.sin(t * 1.3) * 5 : Math.sin(ph) * 8;
  poly(g, [[56, -150 - bob], [92, -232 - bob + hb], [124, -222 - bob + hb], [86, -120 - bob]], ink);
  g.beginPath(); g.ellipse(124, -216 - bob + hb, 36, 17, 0.55, 0, 7); g.fill(); poly(g, [[102, -238 - bob + hb], [108, -262 - bob + hb], [116, -236 - bob + hb]], ink);
  seg(g, [[82, -236 - bob + hb], [60, -200 - bob], [50, -168 - bob]], 9, shade(ink, 0.1));
  const tw = Math.sin(ph * 0.5 + 1) * 14; seg(g, [[-84, -146 - bob], [-122 + tw * 0.4, -112], [-128 + tw, -62]], 12, ink);
  leg(56, ph, ink); leg(-56, ph + 0.7, ink);
  if (o.rim) { g.strokeStyle = alpha(o.rim, 0.55); g.lineWidth = 2.5; g.beginPath(); g.ellipse(0, -131 - bob, 80, 32, 0, Math.PI * 1.15, Math.PI * 1.8); g.stroke(); }
  g.restore();
  return [x + f * 4 * s, GY - (160 + bob) * s];
}
export function banner(g, t, x, GY, s = 1, M = mood('golden')) {
  seg(g, [[x, GY], [x, GY - 520 * s]], 9 * s, '#2a1a14');
  seg(g, [[x - 60 * s, GY - 470 * s], [x + 60 * s, GY - 470 * s]], 8 * s, '#2a1a14');
  circle(g, x, GY - 540 * s, 16 * s, M.key);
  for (let i = 0; i < 9; i++) { const px = x - 56 * s + i * 14 * s, sw = Math.sin(t * 2.2 + i * 0.7) * 12 * s; g.fillStyle = '#f4efe6'; g.beginPath(); g.moveTo(px - 5 * s, GY - 470 * s); g.quadraticCurveTo(px + sw, GY - 400 * s, px + sw * 1.4, GY - 330 * s - (i % 3) * 18 * s); g.quadraticCurveTo(px + sw + 4, GY - 400 * s, px + 5 * s, GY - 470 * s); g.fill(); }
}
export function tent(g, x, GY, s, M, lit) {
  const c = shade(M.wall, -0.45); poly(g, [[x - 150 * s, GY], [x, GY - 190 * s], [x + 150 * s, GY]], c);
  poly(g, [[x - 40 * s, GY], [x, GY - 90 * s], [x + 40 * s, GY]], lit ? M.practical : shade(c, -0.5)); if (lit) glow(g, x, GY - 40 * s, 170 * s, M.practical, 0.4);
}
export function cart(g, t, x, GY, s = 1, wool = true) {
  const ink = S().ink; rr(g, x - 120 * s, GY - 120 * s, 240 * s, 60 * s, 10 * s); g.fillStyle = '#3a2a22'; g.fill();
  if (wool) for (let i = 0; i < 8; i++) circle(g, x - 100 * s + i * 28 * s, GY - 130 * s - (i % 2) * 14 * s, 34 * s, i % 2 ? '#d8d0c0' : '#c8bfae');
  for (const dx of [-70, 70]) { ring(g, x + dx * s, GY - 40 * s, 40 * s, 8 * s, ink); const a = t * 2; for (let k = 0; k < 4; k++) seg(g, [[x + dx * s, GY - 40 * s], [x + dx * s + Math.cos(a + k * 1.57) * 38 * s, GY - 40 * s + Math.sin(a + k * 1.57) * 38 * s]], 4 * s, ink); }
  seg(g, [[x + 120 * s, GY - 80 * s], [x + 200 * s, GY - 30 * s]], 8 * s, ink);
}
export function collarOn(g, hp, s, tilt = 0) { // wooden board (cangue) around the neck; hp = [x,y,r] of head
  g.save(); g.translate(hp[0], hp[1] + hp[2] * 1.45); g.rotate(tilt); rr(g, -62 * s, -11 * s, 124 * s, 24 * s, 6 * s); g.fillStyle = '#7a5532'; g.fill();
  g.fillStyle = 'rgba(255,220,170,.35)'; g.fillRect(-58 * s, -9 * s, 116 * s, 4 * s); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-62 * s, 5 * s, 124 * s, 7 * s); g.restore();
}
export function arrows(g, t, x, y, o = {}) { // arrow shafts: single/bundle; snap=time of snapping for single
  const { n = 1, snap = 99, len = 380, thick = 9 } = o, wood = '#b88a54';
  const one = (dx, dy, rot, l, th) => { g.save(); g.translate(x + dx, y + dy); g.rotate(rot); seg(g, [[-l / 2, 0], [l / 2, 0]], th, wood); poly(g, [[l / 2, -th], [l / 2 + th * 3, 0], [l / 2, th]], '#d8d4cc'); poly(g, [[-l / 2, 0], [-l / 2 - th, -th * 1.6], [-l / 2 + th * 2, -th * 0.6]], '#e8e0d0'); g.restore(); };
  if (n === 1) {
    if (t < snap) one(0, 0, -0.08, len, thick);
    else { const k = ease.out(prog(t, snap, snap + 0.35)); one(-40 * k, 22 * k, -0.08 - 0.3 * k, len * 0.5, thick); one(60 * k, -14 * k, -0.08 + 0.35 * k, len * 0.5, thick); if (t < snap + 0.2) FX.sparkle(g, x, y, 60, '#fff1d6', 0.9 * (1 - (t - snap) / 0.2)); }
  } else { const r = rng(5); for (let i = 0; i < n; i++) one((r() - 0.5) * 40, (i - n / 2) * thick * 1.15, -0.08 + (r() - 0.5) * 0.08, len, thick * 0.95); seg(g, [[x - 20, y - n * thick * 0.6], [x - 20, y + n * thick * 0.6]], 12, '#6a4a2a'); }
}
export function scroll(g, x, y, w, h, c = '#e9dcc0') { rr(g, x - w / 2, y - h / 2, w, h, 8); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(70,40,10,.55)'; for (let i = 0; i < 6; i++) g.fillRect(x - w / 2 + 18, y - h / 2 + 22 + i * (h - 44) / 6, (w - 36) * (0.6 + 0.4 * ((i * 37) % 10) / 10), 4); }
export function bag(g, x, GY, s, c = '#8a6a3a') { g.fillStyle = c; g.beginPath(); g.ellipse(x, GY - 34 * s, 40 * s, 36 * s, 0, 0, 7); g.fill(); seg(g, [[x - 12 * s, GY - 66 * s], [x + 12 * s, GY - 66 * s]], 10 * s, shade(c, -0.3)); }
export function hillTop(g, M) { /* reserved */ }
export function waterOver(g, t, GY, M, depth = 120) { // water surface covering lower part of figures
  g.fillStyle = linGrad(g, 0, GY - depth, 0, GY + 300, [alpha('#3a5a8a', 0.55), alpha('#101a38', 0.9)]); g.fillRect(-E.W, GY - depth, E.W * 3, 600);
  for (let i = 0; i < 18; i++) { const x = ((i * 233 + t * 30) % (E.W * 1.6)) - E.W * 0.3; seg(g, [[x, GY - depth + 6 + (i % 4) * 20], [x + 90, GY - depth + 6 + (i % 4) * 20]], 2.5, alpha('#cfe0ff', 0.28)); }
  seg(g, [[-E.W, GY - depth], [E.W * 2, GY - depth]], 3, alpha('#cfe0ff', 0.4));
}
export function riders(g, t, GY, M, o = {}) { // a line of tiny horsemen crossing the background
  const { n = 8, y = GY - 20, s = 0.45, dir = 1, speed = 230, seed = 3, col } = o, r = rng(seed);
  for (let i = 0; i < n; i++) { const sx = ((i * 190 + t * speed * dir) % (E.W * 1.8) + E.W * 1.8) % (E.W * 1.8) - E.W * 0.35; const sc = s * (0.85 + r() * 0.3); const sp = horse(g, t, sx, y + (i % 3) * 14, sc, { facing: dir, phase: t * 8.5 + i * 1.3, rim: o.rim });
    drawFigure(g, { x: sp[0], y: sp[1] + 72 * sc * 0.9, s: sc * 0.9, facing: dir, outfit: WHO.x, pose: POSES.sit, shadow: false }); }
}
export function army(g, t, GY, M, o = {}) { // marching mass of foot soldiers with spears (silhouettes)
  const { rows = 3, cols = 16, x = 0, w = E.W, s = 0.45, dir = 1 } = o;
  for (let j = rows - 1; j >= 0; j--) for (let i = 0; i < cols; i++) {
    const px = x + (i + (j % 2) * 0.5) * (w / cols), py = GY + j * 18 + 20, ph = t * 5 + i * 0.9 + j;
    drawFigure(g, { x: px, y: py, s: s * (1 + j * 0.08), facing: dir, outfit: WHO.x, pose: walkPose(ph), shadow: false });
    seg(g, [[px + 18 * s, py - 90 * s], [px + 18 * s, py - 330 * s]], 3 * s * 2, S().ink);
  }
}

// ------------------------------------------------------------------ GENERIC SHOT RENDERER
const sampleKeys = (t, arr, def) => { // [[t, v], ...] -> hold last value whose time <= t
  if (!Array.isArray(arr)) return arr ?? def; if (!Array.isArray(arr[0])) return arr;
  let v = arr[0][1]; for (const [ti, vi] of arr) if (t >= ti) v = vi; return v; };

function camFor(spec, t, dur, idx) {
  const c = spec.cam || 'push', dirSign = (idx % 2) ? -1 : 1, e = travel(t, 0, dur, { accel: 0.15, brake: 0.6 });
  let keys;
  if (Array.isArray(c)) { const [z0, z1, x0, x1, y0 = 0, y1 = 0] = c; keys = [[0, { z: z0, x: x0, y: y0 }], [dur, { z: z1, x: x1, y: y1 }]]; }
  else if (c === 'push') keys = [[0, { z: 1.0, x: -20 * dirSign }], [dur, { z: 1.09, x: 28 * dirSign }]];
  else if (c === 'pull') keys = [[0, { z: 1.12, x: 20 * dirSign }], [dur, { z: 1.0, x: -20 * dirSign }]];
  else if (c === 'pan') keys = [[0, { z: 1.05, x: -90 * dirSign }], [dur, { z: 1.05, x: 90 * dirSign }]];
  else if (c === 'rise') keys = [[0, { z: 1.02, y: 90 }], [dur, { z: 1.06, y: -70 }]];
  else if (c === 'fall') keys = [[0, { z: 1.05, y: -80 }], [dur, { z: 1.02, y: 60 }]];
  else if (c === 'dolly') keys = [[0, { z: 1.0, x: -160 * dirSign }], [dur * 0.5, { z: 1.05, x: 0 }], [dur, { z: 1.14, x: 120 * dirSign }]];
  else keys = [[0, { z: 1.03 }], [dur, { z: 1.05 }]];
  void e; return camAdd(camPath(t, keys), drift(t, 4, idx + 1));
}

function drawEntry(g, t, info, spec, e, GY, M, cam) {
  const [kind, name, xf, o = {}] = e, dur = info.dur;
  const px = (v) => Array.isArray(v) ? lerp(v[0], v[1], ease.inOut(prog(t, o.t0 ?? 0, o.t1 ?? dur))) * E.W : v * E.W;
  const x = px(xf), rimC = M.rim;
  if (kind === 'fig') {
    const outfit = { ...(WHO[name] || WHO.x), ...(o.outfit || {}) }, s = (o.s ?? V(1.25, 1.35)) * 1.18;
    let pose;
    if (o.walk) { const sp = Array.isArray(xf) ? Math.abs(xf[1] - xf[0]) * E.W / dur : 0; pose = walkPose(t * (o.run ? 9 : 5.2), { run: !!o.run }); void sp; }
    else if (Array.isArray(o.pose)) pose = posesSpring(t, o.pose.map(([a, b]) => [a, typeof b === 'string' ? POSES[b] : b]), { freq: 3, damp: 0.5 });
    else pose = typeof o.pose === 'string' ? POSES[o.pose] || POSES.stand : (o.pose || POSES.stand);
    if (!o.walk && !o.noBreathe) pose = breathe(pose, t, 1, (name.charCodeAt(0) % 7));
    const expr = sampleKeys(t, o.expr, 'neutral'), fx = x + (o.dx || 0), fy = GY + (o.dy || 0) + (o.hop ? -Math.abs(Math.sin(t * 8)) * 12 : 0);
    const fo = { x: fx, y: fy, s, facing: o.f ?? 1, outfit, pose, expr, rim: { color: rimC, dir: o.light || [0, -1], w: 4 }, rot: o.rot || 0, blink: ((t + name.length) % 3.4) > 3.3, look: o.look, alpha: o.alpha, prop: o.prop, trail: o.trail };
    if (o.talk) fo.talk = talkAmount(info.globalT, o.talk[0], o.talk[1]);
    if (o.y != null) fo.y = o.y;
    drawFigure(g, fo);
    if (o.collar) collarOn(g, headPos(fo), s, 0.05 * Math.sin(t * 2));
    if (o.torch) torch(g, t, fx + (o.f ?? 1) * 62 * s, fy - 150 * s, 0.9);
    if (o.bow) { g.save(); g.translate(fx + (o.f ?? 1) * 40 * s, fy - 150 * s); g.scale(o.f ?? 1, 1); g.strokeStyle = '#8a6a3a'; g.lineWidth = 4 * s; g.beginPath(); g.arc(0, 0, 46 * s, -1.2, 1.2); g.stroke(); seg(g, [[46 * s * Math.cos(1.2), 46 * s * Math.sin(1.2)], [46 * s * Math.cos(-1.2), -46 * s * Math.sin(1.2)]], 1.5, '#e8e0d0'); g.restore(); }
  } else if (kind === 'it') {
    const s = Array.isArray(o.s) ? lerp(o.s[0], o.s[1], ease.inOut(prog(t, 0, dur))) : (o.s ?? 1);
    switch (name) {
      case 'yurt': yurt(g, x, GY + (o.dy || 0), s * V(1.3, 1.3), M, { lit: o.lit }); break;
      case 'fire': fire(g, t, x, GY + (o.dy || 0), s, M); break;
      case 'tent': tent(g, x, GY, s * 1.2, M, o.lit); break;
      case 'torch': torch(g, t, x, o.y ?? GY - 200 * s, s); break;
      case 'banner': banner(g, t, x, GY + (o.dy || 0), s * V(1.2, 1.2), M); break;
      case 'cart': cart(g, t, x, GY, s * 1.3, o.wool !== false); break;
      case 'bag': bag(g, x, GY, s * 1.4, o.color); break;
      case 'horse': { const f = o.f ?? 1; const sp = horse(g, t, x, GY + (o.dy || 0), s * V(1.15, 1.2) * 1.12, { facing: f, gait: o.gait, rim: rimC, phase: o.still ? 0 : t * (o.speed || 8.5) });
        if (o.rider) { const rs = s * V(1.05, 1.1); drawFigure(g, { x: sp[0], y: sp[1] + 70 * rs * 0.95, s: rs, facing: f, outfit: { ...(WHO[o.rider] || WHO.x), ...(o.outfit || {}) }, pose: posesAt(t, [[0, o.rpose || 'sit']]), expr: sampleKeys(t, o.expr, 'determined'), rim: { color: rimC, dir: [0, -1] }, shadow: false }); } break; }
      case 'riders': riders(g, t, GY, M, { dir: o.f ?? 1, n: o.n || 8, s: o.s || 0.5, speed: o.speed || 230, y: GY + (o.dy || -10), rim: rimC, seed: o.seed || 3 }); break;
      case 'army': army(g, t, GY + (o.dy || 0), M, { x: o.x0 ?? -E.W * 0.1, w: E.W * 1.2, s: o.s || 0.5, dir: o.f ?? 1, rows: o.rows || 3, cols: o.cols || 14 }); break;
      case 'arrows': arrows(g, t, x, o.y ?? E.H * 0.5, o); break;
      case 'scroll': scroll(g, x, o.y ?? E.H * 0.5, o.w || 260, o.h || 190); break;
      case 'tree': FX.pine(g, x, GY + 30, s * 1.6, shade(M.dark, -0.4)); break;
      case 'lamp': glow(g, x, o.y ?? GY - 120, 260 * s, o.color || M.practical, 0.5); break;
      case 'rope': { const x2 = (o.to ?? 0.6) * E.W; g.strokeStyle = '#c0392b'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, GY - 150 * s); g.quadraticCurveTo((x + x2) / 2, GY - 150 * s + 70, x2, GY - 150 * s); g.stroke(); break; }
      case 'bowl': { const cy = o.y ?? E.H * 0.55; rr(g, x - 110 * s, cy, 220 * s, 80 * s, 36 * s); g.fillStyle = '#3a2a22'; g.fill(); g.fillStyle = o.poison ? '#4fd36a' : '#c9a36a'; g.beginPath(); g.ellipse(x, cy + 4, 104 * s, 20 * s, 0, 0, 7); g.fill(); if (o.poison) { glow(g, x, cy, 300 * s, '#4fd36a', 0.4); for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i / 6) % 1; circle(g, x + Math.sin(t * 2 + i * 2) * 60 * s, cy - ph * 160 * s, 6 * s * (1 - ph), alpha('#9fffb0', 0.8 * (1 - ph))); } } break; }
      case 'cup': { const cy = o.y ?? E.H * 0.5; rr(g, x - 40 * s, cy - 40 * s, 80 * s, 70 * s, 12 * s); g.fillStyle = '#d8d0c0'; g.fill(); break; }
      case 'wolf': { const ink = S().ink; g.save(); g.translate(x, GY); g.scale((o.f ?? 1) * s, s); g.fillStyle = ink; g.beginPath(); g.ellipse(0, -48, 50, 20, 0, 0, 7); g.fill(); poly(g, [[36, -60], [76, -74], [84, -56], [40, -38]], ink); poly(g, [[60, -72], [64, -90], [72, -72]], ink); seg(g, [[-48, -52], [-84, -36]], 8, ink); for (const lx of [-34, -14, 22, 38]) seg(g, [[lx, -36], [lx + Math.sin(t * 6 + lx) * 5, 0]], 7, ink); if (!o.noEyes) circle(g, 72, -62, 3, '#ffe27a'); g.restore(); break; }
      default: break;
    }
  } else if (kind === 'fx') {
    switch (name) {
      case 'water': waterOver(g, t, GY, M, o.depth || 130); break;
    }
  }
}

function overlays(g, t, info, spec, M) {
  if (spec.tint) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = spec.tint; g.fillRect(0, 0, E.W, E.H); g.restore(); }
  const T = spec.txt; if (T) {
    const [str, to = {}] = Array.isArray(T) ? T : [T];
    const st = to.at != null ? (typeof to.at === 'number' ? to.at : Math.max(0, wordTime(to.at, info.globalT - 0.3) - info.globalT + t)) : 0.2;
    const y = to.y ?? E.H * V(0.2, 0.3);
    kText(g, t, str, E.W / 2, y, { start: st, mode: to.mode || 'drop', size: to.size || V(92, 88), color: to.color || S().ui.gold, glow: 26, glowColor: 'rgba(255,140,50,.75)', spacing: 5, out: to.out ?? info.dur - 0.35 });
  }
  if (spec.badge) UI.badge(g, { str: spec.badge, a: ease.out(prog(t, 0.2, 0.6)) });
  if (spec.card) UI.dataCard(g, t, { ...spec.card, total: info.dur });
}

function atmos(g, t, spec, M, GY, cam) {
  for (const f of spec.fx || []) {
    if (f === 'dust') FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
    else if (f === 'dustHeavy') FX.dust(g, t, { count: 120, color: '#d8b890', a: 0.35 });
    else if (f === 'snow') FX.snow(g, t, { count: 140, speed: 120 });
    else if (f === 'rain') FX.rain(g, t, {});
    else if (f === 'fog') FX.fog(g, GY - 200, 320, M.sky[M.sky.length - 1], 0.35);
    else if (f === 'rays') FX.godRays(g, E.W * 0.8, -40, { t, color: M.key, a: 0.09, angle: Math.PI * 0.62 });
    else if (f === 'streak') FX.lensStreak(g, E.W / 2, E.H * 0.34, E.W * 1.2, M.key, 0.16);
    else if (f === 'embers') { const r = rng(9); for (let i = 0; i < 40; i++) { const ph = (t * 0.25 + r()) % 1; circle(g, r() * E.W + Math.sin(t * 2 + i) * 20, E.H * 0.9 - ph * E.H, 2.4, alpha('#ffb050', 0.8 * (1 - ph))); } }
    else if (f === 'lightning') { if ((t * 1.7) % 4 < 0.12) { g.save(); g.fillStyle = 'rgba(200,215,255,.22)'; g.fillRect(0, 0, E.W, E.H); g.restore(); } }
  }
}

export function drawSpec(g, t, info, spec, idx) {
  const dur = info.dur, setFn = SETS[spec.set || 'steppe'] || steppe;
  const cam = camFor(spec, t, dur, idx);
  if (spec.face) {
    const F = spec.face; const M0 = mood(spec.mood || 'dusk');
    blurLayer(g, 14, (g) => setFn(g, t, { z: 1.5, x: (idx % 2 ? 120 : -120), y: -100 }, { mood: spec.mood, ...(spec.opt || {}) })); veil(g, '#120a10', 0.4);
    const r = V(300, 330) * (1 + 0.05 * (t / dur)), cx = E.W / 2 + (F.dx ?? 0), cy = E.H * V(0.62, 0.56);
    const pc = camAdd(camPath(t, [[0, { z: 1.0 }], [dur, { z: 1.04 }]]), drift(t, 3, idx));
    layer(g, pc, 1, (g) => {
      bigFace(g, cx, cy, r, { outfit: { ...(WHO[F.who] || WHO.temu), ...(F.outfit || {}) }, expr: sampleKeys(t, F.expr, 'neutral'), talk: F.talk ? talkAmount(info.globalT, F.talk[0], F.talk[1]) : 0, look: F.look, rimColor: M0.rim, rimSide: F.side ?? -1, blink: ((t + idx) % 3.1) > 3.0 });
      if (F.collar) { const o = { x: cx, y: cy }; rr(g, cx - r * 1.5, cy + r * 1.05, r * 3, r * 0.34, 14); g.fillStyle = '#7a5532'; g.fill(); g.fillStyle = 'rgba(255,220,170,.3)'; g.fillRect(cx - r * 1.45, cy + r * 1.1, r * 2.9, 6); void o; }
      if (F.tear && t > 0.8) circle(g, cx + r * 0.38, cy + r * 0.05 + ((t - 0.8) * 90) % (r * 0.7), 8, alpha('#cfe4ff', 0.9));
    });
    atmos(g, t, spec, M0, GYf(), cam); if (spec.over) spec.over(g, t, info); overlays(g, t, info, spec, M0); return;
  }
  const base = setFn(g, t, cam, { mood: spec.mood, ...(spec.opt || {}) });
  const GY = base.GY, M = base.M;
  layer(g, cam, 1, (g) => {
    for (const e of spec.a || []) drawEntry(g, t, info, spec, e, GY, M, cam);
  });
  if (spec.water) layer(g, cam, 1.05, (g) => waterOver(g, t, GY, M, spec.water));
  if (spec.set !== 'ger' && spec.set !== 'void' && !spec.noFg) grassFg(g, M, cam, t);
  if (spec.fgs) layer(g, cam, 1, (g) => 0);
  atmos(g, t, spec, M, GY, cam);
  if (spec.over) spec.over(g, t, info, GY, M, cam);
  overlays(g, t, info, spec, M);
}

export function registerAll(SPECS) {
  for (const [id, spec] of Object.entries(SPECS)) {
    const idx = parseInt(id.replace(/\D/g, ''), 10);
    if (spec.draw) registerShot(id, { draw: (g, t, info) => spec.draw(g, t, info, spec, idx) });
    else registerShot(id, { draw: (g, t, info) => drawSpec(g, t, info, spec, idx) });
  }
}
export { WHO, POSES, FX, UI, kText, spring, impact, camPath, drift, camAdd, travel, fg, wordTime, ease, prog, E, V, S, mood, layer, blurLayer, veil, seg, circle, ring, rr, poly, glow, alpha, shade, mix, rng, bigFace, drawFigure, breathe, walkPose, posesAt, clamp, lerp, text, linGrad, radGrad, backdrop };
