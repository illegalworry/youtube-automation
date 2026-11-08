// luck9.js — 10 Ifverse-style "why?" thumbnails for «What If You Were the Luckiest Human Alive?» (params.tpl === 'ifv-luck9').
// Hero = the channel's own character: big black glossy head, LIME hoodie with white drawstrings (change HOODIE to switch).
// One big glowing prop per frame that explains the paradox; text is added later by story/text2.py.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, hero } from './ifverse.js';
import { heroFull } from './brain10.js';

const HOODIE = '#a6ee1a';
const HF = (g, x, fy, r, emo, o = {}) => heroFull(g, x, fy, r, emo, { hoodie: HOODIE, pants: '#14182e', ...o });
const HB = (g, x, y, r, emo, o = {}) => hero(g, x, y, r, emo, { hoodie: HOODIE, ...o });
const digits = (g, s, x, y, size, c) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, glow: 36, glowColor: c });

// ---------- props ----------
const trafficLight = (g, x, y, h, lit = 'green', a = 1) => {
  const w = h * 0.4, r = w * 0.3;
  g.save(); g.globalAlpha = a;
  seg(g, [[x, y + h], [x, y + h * 1.9]], w * 0.12, '#2a2d3a');
  rr(g, x - w / 2, y, w, h, w * 0.22); g.fillStyle = '#151824'; g.fill();
  g.save(); g.shadowColor = '#3dff7a'; g.shadowBlur = 30; rr(g, x - w / 2, y, w, h, w * 0.22); g.lineWidth = 5; g.strokeStyle = alpha('#3dff7a', 0.6); g.stroke(); g.restore();
  const ys = [y + h * 0.18, y + h * 0.5, y + h * 0.82];
  circle(g, x, ys[0], r, '#3a1a1a'); circle(g, x, ys[1], r, '#3a331a');
  glow(g, x, ys[2], r * 4.2, '#3dff7a', 0.85); circle(g, x, ys[2], r, '#4dff8a'); circle(g, x - r * 0.3, ys[2] - r * 0.3, r * 0.3, '#eafff0');
  g.restore();
};
const roulette = (g, x, y, R) => {
  glow(g, x, y, R * 2, '#ff2a4a', 0.5);
  circle(g, x, y, R + 30, '#3a1a10'); circle(g, x, y, R + 12, '#d8b24a'); circle(g, x, y, R, '#1a0e10');
  const N = 24; for (let i = 0; i < N; i++) { const a0 = i / N * Math.PI * 2, a1 = (i + 1) / N * Math.PI * 2; g.fillStyle = i === 0 ? '#1f9a4a' : i % 2 ? '#e0242a' : '#14141a'; g.beginPath(); g.moveTo(x, y); g.arc(x, y, R - 8, a0, a1); g.closePath(); g.fill(); g.strokeStyle = alpha('#e8d28a', 0.8); g.lineWidth = 3; g.stroke(); }
  circle(g, x, y, R * 0.42, '#d8b24a'); circle(g, x, y, R * 0.36, '#2a1a10'); circle(g, x, y, R * 0.12, '#d8b24a');
  const a = -0.9; circle(g, x + Math.cos(a) * R * 0.72, y + Math.sin(a) * R * 0.72, R * 0.07, '#ffffff'); glow(g, x + Math.cos(a) * R * 0.72, y + Math.sin(a) * R * 0.72, R * 0.3, '#ffffff', 0.6);
};
const scoreboard = (g, x, y, w, h) => {
  glow(g, x + w / 2, y + h / 2, w * 0.8, '#3fe0ff', 0.45);
  rr(g, x - 22, y - 22, w + 44, h + 44, 30); g.fillStyle = '#0c1020'; g.fill();
  g.save(); g.shadowColor = '#3fe0ff'; g.shadowBlur = 36; rr(g, x - 22, y - 22, w + 44, h + 44, 30); g.lineWidth = 6; g.strokeStyle = '#8af0ff'; g.stroke(); g.restore();
  digits(g, '0', x + w * 0.27, y + h * 0.7, h * 0.7, '#eaf8ff'); digits(g, ':', x + w * 0.5, y + h * 0.62, h * 0.6, '#6a7aa8'); digits(g, '3', x + w * 0.73, y + h * 0.7, h * 0.7, '#ffd34a');
  text(g, 'GOAL!', x + w / 2, y + h * 0.2, { size: h * 0.22, color: '#ff5a6a', font: FONTS.ui, weight: 900, glow: 20, glowColor: '#ff3a4a', spacing: 6 });
};
const truckFront = (g, x, y, w, h) => {
  glow(g, x + w * 0.2, y + h * 0.62, w * 0.5, '#fff2c0', 0.5); glow(g, x + w * 0.8, y + h * 0.62, w * 0.5, '#fff2c0', 0.5);
  rr(g, x, y, w, h, 40); g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#c8201a', '#7a0e12']); g.fill();
  rr(g, x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.34, 24); g.fillStyle = linGrad(g, 0, y, 0, y + h * 0.4, ['#6ab4e8', '#1a3a5a']); g.fill();
  g.fillStyle = alpha('#ffffff', 0.18); poly(g, [[x + w * 0.16, y + h * 0.1], [x + w * 0.36, y + h * 0.1], [x + w * 0.22, y + h * 0.4], [x + w * 0.12, y + h * 0.4]], alpha('#ffffff', 0.18));
  for (const k of [0.18, 0.82]) { circle(g, x + w * k, y + h * 0.62, w * 0.075, '#fffbe8'); circle(g, x + w * k, y + h * 0.62, w * 0.045, '#ffffff'); }
  rr(g, x + w * 0.32, y + h * 0.5, w * 0.36, h * 0.24, 14); g.fillStyle = '#14101a'; g.fill();
  for (let i = 0; i < 5; i++) seg(g, [[x + w * 0.34, y + h * (0.53 + i * 0.04)], [x + w * 0.66, y + h * (0.53 + i * 0.04)]], 6, '#9aa0b0');
  rr(g, x - w * 0.03, y + h * 0.82, w * 1.06, h * 0.14, 14); g.fillStyle = '#c8ccd8'; g.fill();
  for (let i = 0; i < 5; i++) { glow(g, x + w * (0.3 + i * 0.1), y - 8, 34, '#ffb020', 0.8); rr(g, x + w * (0.3 + i * 0.1) - 14, y - 22, 28, 22, 6); g.fillStyle = '#ffb020'; g.fill(); }
  for (const k of [-1, 1]) { const mx = k < 0 ? x - w * 0.09 : x + w * 1.01; rr(g, mx, y + h * 0.16, w * 0.08, h * 0.24, 10); g.fillStyle = '#14101a'; g.fill(); }
  text(g, 'TRUCK', x + w / 2, y + h * 0.9, { size: h * 0.075, color: '#7a0e12', font: FONTS.ui, weight: 900, spacing: 12 });
};
const ticket = (g, x, y, s, rot) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  glow(g, 0, 0, 420, '#ffd34a', 0.55);
  g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40; rr(g, -330, -200, 660, 400, 28); g.fillStyle = '#fff6d6'; g.fill(); g.shadowBlur = 0;
  rr(g, -330, -200, 660, 90, 28); g.fillStyle = '#e8321a'; g.fill(); g.fillRect(-330, -150, 660, 40);
  text(g, 'LOTTERY', 0, -125, { size: 70, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 8 });
  const nums = [7, 14, 23, 38, 52, 9];
  nums.forEach((n, i) => { const cx = -250 + i * 100, cy = -10; circle(g, cx, cy, 40, '#7aff9a'); g.strokeStyle = '#2a9a4a'; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, 40, 0, 7); g.stroke(); text(g, String(n), cx, cy + 16, { size: 46, color: '#0a2a14', font: FONTS.ui, weight: 900 }); });
  text(g, 'ALL 6 MATCH', 0, 130, { size: 64, color: '#c8321a', font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
};
const shield = (g, x, y, s, c = '#3dffb0') => {
  glow(g, x, y, s * 2.4, c, 0.5);
  g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = c; g.shadowBlur = 50; g.beginPath(); g.moveTo(0, -160); g.bezierCurveTo(70, -130, 140, -120, 150, -110); g.bezierCurveTo(150, 40, 100, 120, 0, 175); g.bezierCurveTo(-100, 120, -150, 40, -150, -110); g.bezierCurveTo(-140, -120, -70, -130, 0, -160); g.closePath();
  g.fillStyle = linGrad(g, -150, -160, 150, 175, [shade(c, 0.2), shade(c, -0.35)]); g.fill(); g.shadowBlur = 0; g.lineWidth = 12; g.strokeStyle = '#eafff6'; g.stroke();
  g.beginPath(); g.moveTo(0, -120); g.lineTo(0, 130); g.moveTo(-100, -50); g.lineTo(100, -50); g.lineWidth = 8; g.strokeStyle = alpha('#eafff6', 0.55); g.stroke();
  g.restore();
};
const cloudStorm = (g, x, y, s) => {
  glow(g, x, y, s * 2.2, '#8a5aff', 0.5);
  const blob = (cx, cy, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x + cx * s, y + cy * s, r * s, 0, 7); g.fill(); };
  blob(-150, 20, 110, '#3a3a66'); blob(-30, -50, 150, '#4a4a80'); blob(120, -10, 130, '#3a3a66'); blob(190, 50, 90, '#34345a'); blob(-60, 60, 120, '#44447a');
  g.fillStyle = '#44447a'; g.fillRect(x - 200 * s, y + 30 * s, 460 * s, 100 * s);
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha('#c8b8ff', 0.4); g.lineWidth = 8; g.beginPath(); g.arc(x - 30 * s, y - 50 * s, 150 * s, Math.PI * 1.1, Math.PI * 1.7); g.stroke(); g.restore();
  FX.lightning(g, { seed: 4, x1: x + 20 * s, y1: y + 110 * s, x2: x - 40 * s, y2: y + 420 * s, color: '#fff2a0', w: 14, branches: 2, jag: 60 });
  const r = rng(7); for (let i = 0; i < 26; i++) { const rx = x - 220 * s + r() * 480 * s, ry = y + 140 * s + r() * 300 * s; seg(g, [[rx, ry], [rx - 14, ry + 40]], 5, alpha('#9ad0ff', 0.7)); }
};
const heart = (g, x, y, s) => {
  glow(g, x, y, s * 2.4, '#ff3a7a', 0.55);
  g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = '#ff2a6a'; g.shadowBlur = 50; g.beginPath(); g.moveTo(0, 150); g.bezierCurveTo(-210, -10, -130, -190, 0, -80); g.bezierCurveTo(130, -190, 210, -10, 0, 150); g.closePath();
  g.fillStyle = linGrad(g, 0, -150, 0, 150, ['#ff5a8a', '#c8123a']); g.fill(); g.shadowBlur = 0;
  g.fillStyle = alpha('#ffffff', 0.3); g.beginPath(); g.ellipse(-80, -60, 36, 70, -0.6, 0, 7); g.fill();
  seg(g, [[0, -78], [-26, -20], [22, 20], [-18, 70], [8, 150]], 12, '#1a0a14'); seg(g, [[0, -78], [-26, -20], [22, 20], [-18, 70], [8, 150]], 4, alpha('#ffb0c8', 0.8));
  g.restore();
};
const moneyPile = (g, x, y, s) => {
  glow(g, x, y - 100 * s, s * 520, '#ffcf3a', 0.55);
  const r = rng(21);
  for (let row = 0; row < 7; row++) for (let i = 0; i < 9 - row; i++) {
    const cx = x + (i - (8 - row) / 2) * 92 * s + (r() - 0.5) * 12, cy = y - row * 48 * s + (r() - 0.5) * 8;
    g.fillStyle = '#b8801a'; g.beginPath(); g.ellipse(cx, cy + 10 * s, 52 * s, 20 * s, 0, 0, 7); g.fill();
    g.fillStyle = linGrad(g, cx - 50 * s, 0, cx + 50 * s, 0, ['#ffd34a', '#fff0a0', '#e8a21a']); g.beginPath(); g.ellipse(cx, cy, 52 * s, 22 * s, 0, 0, 7); g.fill();
    g.strokeStyle = '#a8701a'; g.lineWidth = 3; g.stroke();
  }
  for (const [dx, dy, rot] of [[-300, -20, -0.2], [320, -10, 0.25]]) { g.save(); g.translate(x + dx * s, y + dy * s); g.rotate(rot); rr(g, -110 * s, -50 * s, 220 * s, 100 * s, 10); g.fillStyle = '#3dbf6a'; g.fill(); g.strokeStyle = '#1f7a40'; g.lineWidth = 5; g.stroke(); text(g, '$100', 0, 14 * s, { size: 54 * s, color: '#d9ffe6', font: FONTS.ui, weight: 900 }); g.restore(); }
  star(g, x - 40 * s, y - 330 * s, 46 * s, '#fff2a0'); star(g, x + 200 * s, y - 200 * s, 30 * s, '#fff2a0');
};
const calendar = (g, x, y, s) => {
  glow(g, x, y, s * 2.2, '#b05aff', 0.5);
  g.save(); g.translate(x, y); g.rotate(-0.06); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40; rr(g, -250, -300, 500, 600, 36); g.fillStyle = '#fbf6ea'; g.fill(); g.shadowBlur = 0;
  rr(g, -250, -300, 500, 150, 36); g.fillStyle = '#e8321a'; g.fill(); g.fillRect(-250, -230, 500, 80);
  for (const k of [-1, 1]) { rr(g, k * 120 - 14, -330, 28, 70, 12); g.fillStyle = '#d8dce6'; g.fill(); }
  text(g, 'DAY', 0, -185, { size: 90, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 10 });
  text(g, '9', 0, 190, { size: 420, color: '#1a1226', font: FONTS.ui, weight: 900 });
  seg(g, [[-250, -40], [-120, 40], [-170, 120], [-30, 210], [-70, 300]], 14, '#1a0a14'); seg(g, [[-250, -40], [-120, 40], [-170, 120], [-30, 210], [-70, 300]], 5, alpha('#ff7aa8', 0.85));
  g.restore();
};
const confetti = (g, seed, n, area) => { const r = rng(seed), cols = ['#ff5a6a', '#ffd34a', '#5fd8ff', '#8aff7a', '#ff8aff']; for (let i = 0; i < n; i++) { g.save(); g.translate(area[0] + r() * area[2], area[1] + r() * area[3]); g.rotate(r() * 6); g.fillStyle = cols[i % cols.length]; g.fillRect(-8, -4, 16, 8); g.restore(); } };
const note = (g, x, y, label, c) => { g.save(); g.translate(x, y); g.rotate(-0.04); rr(g, -150, -52, 300, 104, 14); g.fillStyle = 'rgba(8,12,22,.85)'; g.fill(); g.lineWidth = 5; g.strokeStyle = c; g.stroke(); text(g, label, 0, 20, { size: 62, color: c, font: FONTS.ui, weight: 900, glow: 18, glowColor: c }); g.restore(); };

// ---------- the ten variants (emotions: smug 1,6 · shocked 2,8 · sad 3,7 · angry 4,9 · crazy 5,10) ----------
const V = {
  // 1 SMUG, full body right — traffic lights all green: "EVERY LIGHT / WAS GREEN."   (text L)
  1(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 7, veil: 0.25, y: -100 });
    wash(g, '#0affb0', '#073a4a', 0.8); bokeh(g, 201, 26, ['#3dff7a', '#ffd34a', '#5fd8ff'], 0.35); vign(g, 0.5);
    trafficLight(g, 360, 470, 380, 'green', 0.55); trafficLight(g, 1000, 500, 360, 'green', 0.55);
    trafficLight(g, 690, 450, 520, 'green', 1);
    motes(g, 2, 26, '#c8ffd8', [200, 300, 1000, 700]);
    HF(g, 1480, 1040, 190, 'smug', { pose: 'hips', dir: -1, rim: '#3dff7a', haloA: 0.3 });
  },
  // 2 SHOCKED, medium shot left, hands on head — roulette wheel: "RED. / THREE TIMES."   (text R)
  2(g, t) {
    bgBlur(g, t, 'fair', {}, { z: 1.3, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#ff2a4a', '#3a0a2a', 0.8); bokeh(g, 202, 24, ['#ff5a6a', '#ffd34a', '#ff2a8a']); vign(g, 0.55);
    roulette(g, 1340, 715, 240);
    note(g, 1340, 1035, 'RED · RED · RED', '#ff6a7a');
    motes(g, 3, 22, '#ffd0d8');
    HF(g, 430, 1450, 240, 'shocked', { pose: 'head', dir: 1, rim: '#ff5a6a', haloA: 0.35 });
  },
  // 3 SAD, full body right — the whole stadium cheers, he feels nothing: "I FELT / NOTHING."   (text L)
  3(g, t) {
    bgBlur(g, t, 'track', {}, { z: 1.25, blur: 8, veil: 0.3, y: -100 });
    wash(g, '#2a6aff', '#0a1a4a', 0.8); bokeh(g, 203, 24, ['#5fd8ff', '#ffd34a', '#ff5ad8']); vign(g, 0.55);
    scoreboard(g, 230, 560, 760, 360);
    confetti(g, 31, 90, [0, 0, 1920, 900]);
    motes(g, 4, 24, '#d8f4ff');
    HF(g, 1500, 1045, 185, 'sad', { pose: 'idle', dir: -1, rim: '#5fd8ff', haloA: 0.25 });
  },
  // 4 ANGRY, full body left, pointing — a truck stopped one inch away: "IT STOPPED / AN INCH."   (text L)
  4(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.25, blur: 9, veil: 0.4, y: -100 });
    wash(g, '#ff6a1a', '#4a0a0a', 0.85); bokeh(g, 204, 22, ['#ffb04a', '#ff5a2a', '#fff2c0'], 0.3); vign(g, 0.6);
    truckFront(g, 1060, 330, 780, 640);
    // the one-inch gap
    seg(g, [[840, 700], [1040, 700]], 6, '#ffffff'); seg(g, [[840, 670], [840, 730]], 6, '#ffffff'); seg(g, [[1040, 670], [1040, 730]], 6, '#ffffff');
    text(g, '1 INCH', 940, 650, { size: 54, color: '#ffffff', font: FONTS.ui, weight: 900, glow: 18, glowColor: '#ffd34a' });
    motes(g, 5, 24, '#ffe0a0');
    HF(g, 560, 1320, 190, 'angry', { pose: 'point', dir: 1, rim: '#ffb04a', haloA: 0.35 });
  },
  // 5 CRAZY, big bust right — a lottery ticket with every number matching: "1 IN / 292 MILLION."   (text L)
  5(g, t) {
    bgBlur(g, t, 'market', {}, { z: 1.3, blur: 9, veil: 0.3, y: -120 });
    wash(g, '#ffcf1a', '#7a1a8a', 0.8); bokeh(g, 205, 26, ['#ffd34a', '#ff5ad8', '#5fd8ff']); vign(g, 0.55);
    ticket(g, 600, 770, 0.95, -0.1);
    motes(g, 6, 30, '#fff2a0');
    HB(g, 1430, 640, 275, 'crazy', { rim: '#ffd34a', haloA: 0.4, dir: -1 });
  },
  // 6 SMUG, full body left, hands on hips — an energy shield, nothing gets through: "NOTHING / HURTS."   (text R)
  6(g, t) {
    bgBlur(g, t, 'balcony', {}, { z: 1.25, blur: 8, veil: 0.3, y: -100 });
    wash(g, '#0affc8', '#0a2a5a', 0.8); bokeh(g, 206, 24, ['#3dffb0', '#5fa8ff', '#d0ff5a']); vign(g, 0.55);
    shield(g, 1330, 730, 2.0, '#2fe8a8');
    motes(g, 7, 28, '#c8fff0');
    HF(g, 520, 1045, 190, 'smug', { pose: 'hips', dir: 1, rim: '#3dffb0', haloA: 0.3 });
  },
  // 7 SAD, big bust right — he wants a storm: "I WANT / A BAD DAY."   (text L)
  7(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 9, veil: 0.4, y: -120 });
    wash(g, '#7a3aff', '#14083a', 0.85); bokeh(g, 207, 22, ['#8a6aff', '#5fa8ff', '#ff5ad8'], 0.3); vign(g, 0.6);
    cloudStorm(g, 560, 700, 1.25);
    motes(g, 8, 26, '#d8ccff');
    HB(g, 1430, 650, 270, 'sad', { rim: '#8a6aff', haloA: 0.35, dir: -1 });
  },
  // 8 SHOCKED, medium shot right — she said no, and it was the best feeling in 9 days: "SHE SAID / NO."   (text L)
  8(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.3, blur: 8, veil: 0.35, y: -120 });
    wash(g, '#ff2a8a', '#3a0a4a', 0.85); bokeh(g, 208, 24, ['#ff5ad8', '#ffb04a', '#8a6aff']); vign(g, 0.55);
    heart(g, 590, 740, 1.5);
    motes(g, 9, 26, '#ffd0f0');
    HF(g, 1400, 1450, 245, 'shocked', { pose: 'head', dir: -1, rim: '#ff6ab0', haloA: 0.35 });
  },
  // 9 ANGRY, full body left, pointing — a mountain of money he never earned: "I DID / NOTHING."   (text R)
  9(g, t) {
    bgBlur(g, t, 'hall', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#ffb01a', '#6a0a1a', 0.85); bokeh(g, 209, 26, ['#ffd34a', '#ff6a2a', '#ff2a6a']); vign(g, 0.55);
    moneyPile(g, 1370, 960, 1.15);
    motes(g, 10, 36, '#ffe08a');
    HF(g, 480, 1045, 190, 'angry', { pose: 'point', dir: 1, rim: '#ffb03a', haloA: 0.35 });
  },
  // 10 CRAZY, full body right, hands on head — the calendar cracks on day 9: "IT ALMOST / BROKE ME."   (text L)
  10(g, t) {
    bgBlur(g, t, 'bedroomDay', {}, { z: 1.25, blur: 8, veil: 0.4, y: -100 });
    wash(g, '#b02aff', '#20083a', 0.85); bokeh(g, 210, 24, ['#c86aff', '#ff5ad8', '#5fd8ff']); vign(g, 0.6);
    calendar(g, 650, 745, 0.9);
    motes(g, 11, 28, '#ecd0ff');
    HF(g, 1500, 1045, 188, 'crazy', { pose: 'head', dir: -1, rim: '#c86aff', haloA: 0.35 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-luck9') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
