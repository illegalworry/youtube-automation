// schoen10.js — 10 "why?" thumbnails for «Was wäre, wenn du der schönste Mensch der Welt wärst?» (params.tpl === 'ifv-schoen').
// New look: "BIG FACE + CROWD" — a huge hero (close-up or waist-up) in a spotlight, surrounded by a dark backlit crowd
// raising glowing phones, camera flashes, beauty sparkles and floating hearts; one glowing prop tells the idea.
// Text (German) is added later by story/text2.py via story/schoen10_text.sh.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, face, hero } from './ifverse.js';
import { heroFull } from './brain10.js';

const SIL = '#0c0912';
// props use the same chunky font as the overlay text (Lilita One, has ÄÖÜß and €)
const LF = 'Lilita One'; try { const ff = new FontFace(LF, 'url(/project/story/fonts/LilitaOne.ttf)'); await ff.load(); document.fonts.add(ff); } catch (e) { console.log('font missing Lilita One'); }
const digits = (g, s, x, y, size, c, o = {}) => text(g, s, x, y, { size, color: c, font: LF, weight: 400, glow: 30, glowColor: c, ...o });

// ---------- the crowd ----------
// one backlit fan seen from behind: head radius s, head centre (x, y); o.phone raises an arm with a glowing phone.
function fan(g, x, y, s, rim, o = {}) {
  const c = o.col || SIL, side = o.side ?? 1;
  g.fillStyle = c; g.beginPath(); g.moveTo(x - s * 1.7, y + s * 5);
  g.bezierCurveTo(x - s * 1.65, y + s * 1.7, x - s * 1.15, y + s * 1.2, x, y + s * 1.15);
  g.bezierCurveTo(x + s * 1.15, y + s * 1.2, x + s * 1.65, y + s * 1.7, x + s * 1.7, y + s * 5); g.fill();
  circle(g, x, y, s, c);
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(rim, o.rimA ?? 0.55); g.lineWidth = Math.max(2, s * 0.09);
  g.beginPath(); g.arc(x, y, s * 0.97, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  g.beginPath(); g.moveTo(x - s * 1.15, y + s * 1.3); g.quadraticCurveTo(x, y + s * 1.05, x + s * 1.15, y + s * 1.3); g.stroke(); g.restore();
  if (o.phone) {
    const shx = x + side * s * 1.1, shy = y + s * 1.6, hx = x + side * s * (1.3 + (o.reach || 0)), hy = y - s * (1.5 + (o.lift || 0));
    seg(g, [[shx, shy], [x + side * s * 1.65, y + s * 0.1], [hx, hy]], s * 0.5, c);
    const pw = s * 0.78, ph = s * 1.35, scr = o.scr || '#cfe8ff';
    glow(g, hx, hy - ph * 0.45, s * 2.6, scr, 0.32);
    g.save(); g.translate(hx, hy - ph * 0.45); g.rotate(side * -0.12);
    rr(g, -pw / 2, -ph / 2, pw, ph, s * 0.12); g.fillStyle = '#1a1622'; g.fill();
    rr(g, -pw / 2 + s * 0.06, -ph / 2 + s * 0.08, pw - s * 0.12, ph - s * 0.16, s * 0.08); g.fillStyle = linGrad(g, 0, -ph / 2, 0, ph / 2, ['#ffffff', scr]); g.fill();
    if (o.icon === 'heart') heart(g, 0, 0, s * 0.3, '#ff3a7a', 1, false);
    else if (o.icon === 'rec') circle(g, 0, 0, s * 0.14, '#ff2a3a');
    g.restore();
    circle(g, hx, hy, s * 0.26, c);
  }
}
// a row of fans across [x0, x1]; phones skip the avoid range so they never cover the hero's face
function row(g, seed, y, x0, x1, s, rim, o = {}) {
  const r = rng(seed), pPhone = o.pPhone ?? 0.55, scrs = o.scrs || ['#cfe8ff', '#ffd6f0', '#fff3c0'];
  const out = [];
  for (let x = x0 + r() * s; x < x1 + s; x += s * (2.3 + r() * 0.9)) out.push([x, y + (r() - 0.5) * s * 0.5, s * (0.88 + r() * 0.24), r()]);
  for (const [x, yy, ss, k] of out) {
    const blocked = o.avoid && x > o.avoid[0] && x < o.avoid[1];
    fan(g, x, yy, ss, rim, { phone: !blocked && k < pPhone, side: k < pPhone / 2 ? -1 : 1, scr: scrs[Math.floor(k * 97) % scrs.length], icon: k < 0.2 ? 'heart' : k > 0.45 ? 'rec' : null, lift: (k * 13) % 0.6, col: o.col, rimA: o.rimA });
  }
}
// camera flash bursts scattered in the crowd
function flashes(g, seed, n, area, s = 26) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = area[0] + r() * area[2], y = area[1] + r() * area[3], k = s * (0.6 + r() * 0.8);
    glow(g, x, y, k * 5, '#eaf4ff', 0.45); glow(g, x, y, k * 1.6, '#ffffff', 0.9);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, x - k * 7, 0, x + k * 7, 0, ['rgba(255,255,255,0)', 'rgba(255,255,255,.75)', 'rgba(255,255,255,0)']); g.fillRect(x - k * 7, y - k * 0.08, k * 14, k * 0.16); g.restore();
    star(g, x, y, k, '#ffffff');
  }
}
// ---------- beauty shine ----------
function heart(g, x, y, s, c, a = 0.9, gl = true) { g.save(); g.translate(x, y); g.scale(s / 50, s / 50); if (gl) glow(g, 0, 0, 90, c, 0.5 * a); g.fillStyle = alpha(c, a); g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-62, -14, -28, -62, 0, -28); g.bezierCurveTo(28, -62, 62, -14, 0, 30); g.fill(); g.restore(); }
function hearts(g, seed, n, area, c = '#ff4a8a') { const r = rng(seed); for (let i = 0; i < n; i++) heart(g, area[0] + r() * area[2], area[1] + r() * area[3], 22 + r() * 34, i % 3 ? c : '#ff8ac0', 0.85); }
function shine(g, x, y, r, c = '#ffe6a0') {
  glow(g, x, y, r * 2.1, c, 0.22);
  for (const [a, d, s] of [[-2.4, 1.25, 0.2], [-0.75, 1.3, 0.16], [-1.6, 1.38, 0.12], [2.6, 1.3, 0.11], [0.5, 1.33, 0.1]]) star(g, x + Math.cos(a) * r * d, y + Math.sin(a) * r * d, r * s, c);
}
const spot = (g, x, c = '#fff2d0', a = 0.22, spread = 0.26) => FX.lightCone(g, x, -40, { angle: Math.PI / 2, spread, len: 1200, color: c, a });

// ---------- props ----------
function receipt(g, x, y, rot) {
  g.save(); g.translate(x, y); g.rotate(rot); glow(g, 0, 0, 520, '#ffd06a', 0.55);
  const w = 400, h = 560; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40;
  g.fillStyle = '#fffaf0'; g.beginPath(); g.moveTo(-w / 2, -h / 2);
  for (let i = 0; i <= 16; i++) g.lineTo(-w / 2 + i * w / 16, -h / 2 + (i % 2 ? 16 : 0));
  g.lineTo(w / 2, h / 2); for (let i = 16; i >= 0; i--) g.lineTo(-w / 2 + i * w / 16, h / 2 - (i % 2 ? 16 : 0)); g.closePath(); g.fill(); g.shadowBlur = 0;
  text(g, 'KASSENBON', 0, -h / 2 + 80, { size: 44, color: '#2a2030', font: LF, weight: 400, spacing: 4 });
  const items = ['KAFFEE', 'ESSEN', 'TAXI', 'KLEID'];
  items.forEach((s, i) => { text(g, s, -w / 2 + 40, -h / 2 + 160 + i * 58, { size: 36, color: '#4a4050', font: LF, weight: 400, align: 'left' }); text(g, '0,00 €', w / 2 - 40, -h / 2 + 160 + i * 58, { size: 36, color: '#4a4050', font: LF, weight: 400, align: 'right' }); });
  g.setLineDash([12, 10]); g.strokeStyle = '#8a8090'; g.lineWidth = 4; g.beginPath(); g.moveTo(-w / 2 + 30, 160); g.lineTo(w / 2 - 30, 160); g.stroke(); g.setLineDash([]);
  text(g, '0,00 €', 0, 250, { size: 96, color: '#e8321a', font: LF, weight: 400 });
  g.restore();
}
function bigPhone(g, x, y, w, h, rot, c, drawScr) {
  g.save(); g.translate(x, y); g.rotate(rot); glow(g, 0, 0, Math.max(w, h) * 0.95, c, 0.5);
  rr(g, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 56); g.fillStyle = '#121018'; g.fill();
  g.save(); g.shadowColor = c; g.shadowBlur = 40; rr(g, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 56); g.lineWidth = 6; g.strokeStyle = alpha(shade(c, 0.4), 0.9); g.stroke(); g.restore();
  g.save(); rr(g, -w / 2, -h / 2, w, h, 36); g.clip(); drawScr(g, w, h); g.restore();
  rr(g, -60, -h / 2 + 14, 120, 26, 13); g.fillStyle = '#121018'; g.fill();
  g.restore();
}
function paperStamp(g, x, y, rot) {
  g.save(); g.translate(x, y); g.rotate(rot); glow(g, 0, 0, 520, '#ff4a3a', 0.5);
  const w = 470, h = 600; g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40; rr(g, -w / 2, -h / 2, w, h, 10); g.fillStyle = '#f8f4ea'; g.fill(); g.shadowBlur = 0;
  text(g, 'ARBEITSVERTRAG', 0, -h / 2 + 76, { size: 40, color: '#2a2030', font: LF, weight: 400, spacing: 2 });
  for (let i = 0; i < 9; i++) { g.fillStyle = '#c8c0cc'; rr(g, -w / 2 + 44, -h / 2 + 130 + i * 40, (w - 88) * (i % 3 === 2 ? 0.6 : 1), 12, 6); g.fill(); }
  g.save(); g.rotate(-0.28); g.shadowColor = '#ff2a1a'; g.shadowBlur = 24; g.strokeStyle = '#e8241a'; g.lineWidth = 12; rr(g, -210, 70, 420, 120, 16); g.stroke();
  text(g, 'GEKÜNDIGT', 0, 158, { size: 74, color: '#e8241a', font: LF, weight: 400, spacing: 2 }); g.restore();
  g.restore();
}
function screenWall(g, cells, c) { // billboards / TVs all showing the hero's face
  for (const [x, y, w, h, emo] of cells) {
    glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, c, 0.35);
    rr(g, x - 12, y - 12, w + 24, h + 24, 16); g.fillStyle = '#100c16'; g.fill();
    g.save(); rr(g, x, y, w, h, 8); g.clip(); g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(c, 0.35), shade(c, -0.35)]); g.fillRect(x, y, w, h);
    const r = Math.min(w, h) * 0.32; glow(g, x + w / 2, y + h * 0.5, r * 1.8, '#fff0d0', 0.35); hero(g, x + w / 2, y + h * 0.46, r, emo || 'smug', { rim: '#fff0d0', haloA: 0.1, dir: x + w / 2 > 960 ? -1 : 1 });
    for (let i = 0; i < h; i += 7) { g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x, y + i, w, 2); }
    g.restore();
    g.save(); g.shadowColor = c; g.shadowBlur = 26; rr(g, x - 12, y - 12, w + 24, h + 24, 16); g.lineWidth = 4; g.strokeStyle = alpha(shade(c, 0.5), 0.9); g.stroke(); g.restore();
  }
}
function mic(g, x, y, s, c) { // stage microphone on a stand, glowing
  glow(g, x, y, 380 * s, c, 0.5);
  seg(g, [[x, y + 90 * s], [x, y + 700 * s]], 22 * s, '#2a2632'); seg(g, [[x - 160 * s, y + 720 * s], [x, y + 680 * s], [x + 160 * s, y + 720 * s]], 22 * s, '#2a2632');
  rr(g, x - 34 * s, y + 40 * s, 68 * s, 150 * s, 20 * s); g.fillStyle = '#3a3644'; g.fill();
  g.fillStyle = linGrad(g, x - 90 * s, 0, x + 90 * s, 0, ['#9aa0b0', '#f0f2f8', '#8a90a0']); g.beginPath(); g.ellipse(x, y - 30 * s, 90 * s, 110 * s, 0, 0, 7); g.fill();
  g.strokeStyle = alpha('#5a6070', 0.7); g.lineWidth = 4 * s; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(x + i * 24 * s, y - 130 * s); g.lineTo(x + i * 24 * s, y + 70 * s); g.stroke(); g.beginPath(); g.moveTo(x - 90 * s, y - 30 * s + i * 26 * s); g.lineTo(x + 90 * s, y - 30 * s + i * 26 * s); g.stroke(); }
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(c, 0.8); g.lineWidth = 6 * s; g.beginPath(); g.ellipse(x, y - 30 * s, 92 * s, 112 * s, 0, -2.2, -0.6); g.stroke(); g.restore();
}
function gavel(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); glow(g, 0, 40, 460, '#ffcf5a', 0.6);
  g.fillStyle = '#5a2e14'; rr(g, -230, 170, 460, 70, 16); g.fill(); g.fillStyle = '#7a4420'; rr(g, -170, 120, 340, 60, 14); g.fill();
  g.save(); g.rotate(-0.55);
  seg(g, [[0, 0], [0, 330]], 34, '#8a5028');
  g.fillStyle = linGrad(g, -170, 0, 170, 0, ['#5a2e14', '#a8642e', '#5a2e14']); rr(g, -170, -70, 340, 140, 30); g.fill();
  g.fillStyle = '#ffcf5a'; g.fillRect(-120, -70, 26, 140); g.fillRect(94, -70, 26, 140); g.restore();
  for (let i = 0; i < 6; i++) { const a = -2.6 + i * 0.32; seg(g, [[Math.cos(a) * 230 + 40, 160 + Math.sin(a) * 120], [Math.cos(a) * 300 + 40, 160 + Math.sin(a) * 170]], 10, alpha('#fff2c0', 0.9)); }
  g.restore();
}
function hourglass(g, x, y, s, c) {
  g.save(); g.translate(x, y); g.scale(s, s); glow(g, 0, 0, 480, c, 0.55);
  g.fillStyle = '#5a3a24'; rr(g, -190, -330, 380, 50, 14); g.fill(); rr(g, -190, 280, 380, 50, 14); g.fill();
  for (const k of [-1, 1]) seg(g, [[k * 170, -290], [k * 170, 290]], 18, '#7a5234');
  g.fillStyle = alpha('#dff6ff', 0.25); g.beginPath(); g.moveTo(-140, -280); g.lineTo(140, -280); g.quadraticCurveTo(130, -40, 14, 0); g.quadraticCurveTo(130, 40, 140, 280); g.lineTo(-140, 280); g.quadraticCurveTo(-130, 40, -14, 0); g.quadraticCurveTo(-130, -40, -140, -280); g.fill();
  g.save(); g.shadowColor = c; g.shadowBlur = 30; g.fillStyle = shade(c, 0.2);
  g.beginPath(); g.moveTo(-50, -60); g.lineTo(50, -60); g.lineTo(8, -4); g.lineTo(-8, -4); g.fill();
  g.fillRect(-5, -4, 10, 230); g.beginPath(); g.moveTo(-135, 276); g.quadraticCurveTo(0, 120, 135, 276); g.fill(); g.restore();
  g.strokeStyle = alpha('#ffffff', 0.6); g.lineWidth = 6; g.beginPath(); g.moveTo(-110, -250); g.quadraticCurveTo(-100, -120, -40, -50); g.stroke();
  g.restore();
}
function windowCrowd(g, x, y, w, h, c, t) { // a night window with fans pressed outside, flashing
  glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.85, c, 0.45);
  g.save(); rr(g, x, y, w, h, 10); g.clip();
  g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(c, -0.1), shade(c, -0.6)]); g.fillRect(x, y, w, h);
  flashes(g, 404, 6, [x + 40, y + 60, w - 80, h * 0.5], 22);
  row(g, 41, y + h * 0.42, x - 40, x + w, 46, '#ffffff', { pPhone: 0.85, rimA: 0.7 });
  row(g, 42, y + h * 0.72, x - 60, x + w, 66, '#ffffff', { pPhone: 0.7, rimA: 0.7 });
  g.fillStyle = alpha('#dff6ff', 0.08); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.35, y); g.lineTo(x, y + h * 0.5); g.fill();
  g.restore();
  g.fillStyle = '#1a141e'; for (const [a, b, ww, hh] of [[x - 26, y - 26, w + 52, 30], [x - 26, y + h - 4, w + 52, 34], [x - 26, y - 26, 30, h + 56], [x + w - 4, y - 26, 30, h + 56], [x + w / 2 - 12, y, 24, h], [x, y + h / 2 - 12, w, 24]]) g.fillRect(a, b, ww, hh);
  g.save(); g.shadowColor = c; g.shadowBlur = 30; g.strokeStyle = alpha(shade(c, 0.5), 0.8); g.lineWidth = 5; g.strokeRect(x - 26, y - 26, w + 52, h + 56); g.restore();
}

// ---------- the ten variants ----------
const V = {
  // 1 SMUG, big close-up left — nobody lets him pay, receipt 0,00 €: "ALLES / GRATIS." + "SEIT 3 JAHREN"
  1(g, t) {
    bgBlur(g, t, 'market', {}, { z: 1.25, blur: 8, veil: 0.25, y: -110 });
    wash(g, '#ffb01a', '#8a2a0a', 0.85); bokeh(g, 201, 28, ['#ffd06a', '#ff8a3a', '#ff5ad8']); vign(g, 0.55);
    row(g, 11, 640, 900, 1920, 40, '#ffcf6a', { pPhone: 0.6, rimA: 0.45 });
    flashes(g, 12, 5, [1000, 520, 900, 160], 20);
    spot(g, 560, '#fff0c0', 0.24);
    shine(g, 560, 650, 290, '#ffe6a0');
    hero(g, 560, 650, 290, 'smug', { rim: '#ffcf6a', haloA: 0.35, dir: 1 });
    row(g, 13, 1030, -40, 1960, 70, '#ffb04a', { pPhone: 0.55, avoid: [250, 1700] });
    receipt(g, 1400, 740, 0.1);
    hearts(g, 14, 6, [880, 150, 300, 400]);
  },
  // 2 SHOCKED, waist-up right, hands on head — a live-stream of his life, millions watching: "NIE MEHR / ALLEIN." + "24/7 BEOBACHTET"
  2(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.25, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#8a1aff', '#3a0a8a', 0.85); bokeh(g, 202, 26, ['#c86aff', '#5fd8ff', '#ff5ad8']); vign(g, 0.55);
    row(g, 21, 700, -40, 1100, 42, '#c88aff', { pPhone: 0.8, rimA: 0.5 });
    flashes(g, 22, 9, [0, 480, 1100, 260], 22);
    bigPhone(g, 500, 780, 400, 560, -0.08, '#c86aff', (g, w, h) => {
      g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#5a2a9a', '#1a0a3a']); g.fillRect(-w / 2, -h / 2, w, h);
      glow(g, 0, 40, 220, '#ffd6ff', 0.4); hero(g, 0, 30, 110, 'shocked', { rim: '#ffd6ff', haloA: 0.1, dir: 1 });
      rr(g, -w / 2 + 24, -h / 2 + 60, 130, 50, 10); g.fillStyle = '#ff2a3a'; g.fill(); text(g, 'LIVE', -w / 2 + 89, -h / 2 + 97, { size: 34, color: '#fff', font: LF, weight: 400 });
      text(g, '2,4 MIO', w / 2 - 24, -h / 2 + 97, { size: 32, color: '#fff', font: LF, weight: 400, align: 'right' });
      for (let i = 0; i < 4; i++) heart(g, w / 2 - 50 - (i % 2) * 30, h / 2 - 60 - i * 70, 30, '#ff4a8a', 0.95);
    });
    spot(g, 1450, '#f0d8ff', 0.22);
    shine(g, 1450, 1450 - 235 * 3.48, 235, '#ffd6ff');
    heroFull(g, 1450, 1480, 235, 'shocked', { pose: 'head', dir: -1, rim: '#d88aff', haloA: 0.35 });
    row(g, 23, 1040, -40, 1960, 68, '#c86aff', { pPhone: 0.6, avoid: [1100, 1800] });
  },
  // 3 SAD, big close-up right — 12 million followers, zero friends: "KEINE / FREUNDE." + "NUR FANS"
  3(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.25, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#1a4aff', '#0a1a5a', 0.85); bokeh(g, 203, 26, ['#5fa8ff', '#8a6aff', '#ff6a9a'], 0.3); vign(g, 0.6);
    FX.rain(g, 0.6, { count: 220, color: '#bfe0ff', a: 0.3 });
    row(g, 31, 690, -40, 1000, 40, '#7ab0ff', { pPhone: 0.75, rimA: 0.45 });
    flashes(g, 32, 6, [0, 480, 1000, 220], 18);
    const phone3 = () => bigPhone(g, 820, 740, 360, 520, 0.07, '#5fa8ff', (g, w, h) => {
      g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#f4f8ff', '#cfe0ff']); g.fillRect(-w / 2, -h / 2, w, h);
      circle(g, 0, -h / 2 + 140, 70, INK); glow(g, 0, -h / 2 + 140, 90, '#5fa8ff', 0.3); star(g, 24, -h / 2 + 130, 16, '#fff1a0');
      text(g, '12.000.000', 0, -h / 2 + 290, { size: 64, color: '#1a2a5a', font: LF, weight: 400 });
      text(g, 'FOLLOWER', 0, -h / 2 + 340, { size: 34, color: '#5a6a9a', font: LF, weight: 400, spacing: 4 });
      rr(g, -w / 2 + 40, h / 2 - 120, w - 80, 70, 35); g.fillStyle = '#3a6aff'; g.fill(); text(g, 'FOLGEN', 0, h / 2 - 82, { size: 40, color: '#fff', font: LF, weight: 400 });
    });
    spot(g, 1400, '#d8e8ff', 0.2);
    shine(g, 1400, 660, 280, '#d8ecff');
    hero(g, 1400, 660, 280, 'sad', { rim: '#7ab0ff', haloA: 0.32, dir: -1 });
    row(g, 33, 1035, -40, 1960, 70, '#5fa8ff', { pPhone: 0.5, avoid: [560, 1720] });
    phone3();
  },
  // 4 ANGRY, full body left, pointing — fired on day one for being "too distracting": "SOFORT / GEFEUERT." + "AM ERSTEN TAG"
  4(g, t) {
    bgBlur(g, t, 'hall', {}, { z: 1.25, blur: 14, veil: 0.35, y: -100 });
    wash(g, '#ff2a1a', '#4a0a1a', 0.85); bokeh(g, 204, 24, ['#ff5a3a', '#ffb02a', '#ff2a8a']); vign(g, 0.6);
    row(g, 41, 700, -40, 1960, 44, '#ff8a6a', { pPhone: 0.65, rimA: 0.45, avoid: [200, 760] });
    flashes(g, 42, 7, [0, 470, 1920, 200], 20);
    paperStamp(g, 1360, 760, 0.08);
    spot(g, 480, '#ffd8c8', 0.22);
    shine(g, 480, 1040 - 175 * 3.48, 175, '#ffd8b0');
    heroFull(g, 480, 1040, 175, 'angry', { pose: 'point', dir: 1, rim: '#ff8a3a', haloA: 0.35 });
    row(g, 43, 1060, -40, 1960, 62, '#ff5a3a', { pPhone: 0.4, avoid: [180, 1800] });
  },
  // 5 CRAZY, giant bust centre — his face on every screen in the city: "ÜBERALL / ICH." + "OHNE ERLAUBNIS"
  5(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.3, blur: 9, veil: 0.3, y: -120 });
    wash(g, '#ff2a9a', '#4a0a5a', 0.85); bokeh(g, 205, 26, ['#ff5ad8', '#ffb04a', '#8a6aff']); vign(g, 0.55);
    screenWall(g, [[1340, 110, 300, 210, 'smug'], [1660, 230, 230, 300, 'shocked'], [1300, 400, 260, 190, 'sad'], [1590, 590, 300, 200, 'smug'], [20, 560, 220, 160, 'angry']], '#ff6ad8');
    row(g, 51, 760, -40, 1960, 40, '#ff8ad8', { pPhone: 0.7, rimA: 0.45, avoid: [640, 1280] });
    flashes(g, 52, 7, [0, 560, 1920, 220], 20);
    spot(g, 960, '#ffd8f0', 0.2, 0.3);
    shine(g, 960, 690, 270, '#ffd6f0');
    hero(g, 960, 690, 270, 'crazy', { rim: '#ff8ad8', haloA: 0.38, dir: 1 });
    row(g, 53, 1040, -40, 1960, 70, '#ff5ad8', { pPhone: 0.55, avoid: [600, 1320] });
  },
  // 6 SHOCKED, waist-up left, arms up — on stage, the whole hall films him, nobody listens: "NIEMAND / HÖRT ZU." + "SIE STARREN NUR"
  6(g, t) {
    bgBlur(g, t, 'stage', {}, { z: 1.25, blur: 14, veil: 0.3, y: -100 });
    wash(g, '#0affc8', '#0a3a5a', 0.85); bokeh(g, 206, 26, ['#3fffd0', '#5fa8ff', '#d0ff5a']); vign(g, 0.55);
    spot(g, 560, '#d8fff4', 0.26, 0.3);
    mic(g, 1260, 620, 0.95, '#3fffc8');
    shine(g, 560, 1480 - 235 * 3.48, 235, '#c8fff0');
    heroFull(g, 560, 1480, 235, 'shocked', { pose: 'up', dir: 1, rim: '#3fffc8', haloA: 0.35 });
    flashes(g, 62, 7, [900, 820, 1000, 160], 22);
    row(g, 61, 960, 820, 1960, 48, '#3fffc8', { pPhone: 0.85, rimA: 0.55 });
    row(g, 63, 1050, -40, 1960, 74, '#3fffc8', { pPhone: 0.7, avoid: [200, 940] });
  },
  // 7 SMUG, full body right, hands on hips — courts keep letting him go: "IMMER / UNSCHULDIG." + "HALO-EFFEKT"
  7(g, t) {
    bgBlur(g, t, 'hall', {}, { z: 1.25, blur: 14, veil: 0.3, y: -100 });
    wash(g, '#ffcf1a', '#7a3a0a', 0.85); bokeh(g, 207, 26, ['#ffe06a', '#ffb02a', '#ff8a3a']); vign(g, 0.55);
    row(g, 71, 700, -40, 1200, 42, '#ffd06a', { pPhone: 0.7, rimA: 0.45 });
    flashes(g, 72, 7, [0, 500, 1200, 200], 22);
    gavel(g, 830, 700, 1.05);
    spot(g, 1460, '#fff4d0', 0.24);
    shine(g, 1460, 1040 - 180 * 3.48, 180, '#ffe6a0');
    heroFull(g, 1460, 1040, 180, 'smug', { pose: 'hips', dir: -1, rim: '#ffcf3a', haloA: 0.35 });
    row(g, 73, 1060, -40, 1960, 62, '#ffb02a', { pPhone: 0.5, avoid: [400, 1800] });
  },
  // 8 ANGRY, big close-up right — 999+ messages a day, fans at the door: "LASST MICH / IN RUHE." + "TAG UND NACHT"
  8(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 8, veil: 0.35, y: -120 });
    wash(g, '#ff3a2a', '#5a0a2a', 0.85); bokeh(g, 208, 24, ['#ff5a5a', '#ffb04a', '#ff2a8a']); vign(g, 0.6);
    row(g, 81, 720, -40, 1000, 42, '#ff8a6a', { pPhone: 0.8, rimA: 0.45 });
    flashes(g, 82, 7, [0, 500, 1000, 230], 20);
    bigPhone(g, 640, 770, 340, 500, -0.09, '#ff4a3a', (g, w, h) => {
      g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#2a1a2a', '#120a14']); g.fillRect(-w / 2, -h / 2, w, h);
      for (let i = 0; i < 5; i++) { rr(g, -w / 2 + 20, -h / 2 + 80 + i * 78, w - 40, 64, 14); g.fillStyle = alpha('#ffffff', 0.9 - i * 0.12); g.fill(); circle(g, -w / 2 + 52, -h / 2 + 112 + i * 78, 18, '#ff4a8a'); g.fillStyle = '#b0a8b8'; rr(g, -w / 2 + 84, -h / 2 + 96 + i * 78, w - 140, 12, 6); g.fill(); rr(g, -w / 2 + 84, -h / 2 + 118 + i * 78, (w - 140) * 0.6, 10, 5); g.fill(); }
    });
    circle(g, 640 + 175, 770 - 265, 82, '#ff2a2a'); glow(g, 815, 505, 150, '#ff2a2a', 0.7); text(g, '999+', 815, 525, { size: 52, color: '#fff', font: LF, weight: 400 });
    spot(g, 1400, '#ffd8d0', 0.2);
    shine(g, 1400, 670, 285, '#ffd8c0');
    hero(g, 1400, 670, 285, 'angry', { rim: '#ff8a3a', haloA: 0.35, dir: -1 });
    row(g, 83, 1040, -40, 1960, 70, '#ff4a3a', { pPhone: 0.55, avoid: [1060, 1760] });
  },
  // 9 SAD, full body left of centre — beauty runs out, the crowd turns away: "ICH WERDE / ALT." + "UND DANN?"
  9(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#3a2aff', '#0a0a3a', 0.85); bokeh(g, 209, 22, ['#8a6aff', '#5fa8ff', '#ffb04a'], 0.28); vign(g, 0.6);
    row(g, 91, 720, 900, 1960, 40, '#8a7aff', { pPhone: 0.25, rimA: 0.3, col: '#120e1e' });
    hourglass(g, 1460, 770, 0.85, '#ffb04a');
    spot(g, 640, '#e0d8ff', 0.2);
    shine(g, 640, 1040 - 175 * 3.48, 175, '#d8d0ff');
    heroFull(g, 640, 1040, 175, 'sad', { pose: 'idle', dir: 1, rim: '#8a7aff', haloA: 0.3 });
    row(g, 93, 1060, -40, 1960, 60, '#8a6aff', { pPhone: 0.15, avoid: [380, 900], rimA: 0.35 });
    motes(g, 94, 40, '#ffd08a', [1200, 300, 520, 800]);
  },
  // 10 CRAZY, big close-up left — locked in his flat, the crowd outside the window: "ICH BIN / GEFANGEN." + "IN MEINER WOHNUNG"
  10(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 8, veil: 0.35, y: -120 });
    wash(g, '#0ac8ff', '#0a2a4a', 0.85); bokeh(g, 210, 24, ['#3fe0ff', '#5fa8ff', '#ff5ad8'], 0.3); vign(g, 0.6);
    windowCrowd(g, 1160, 540, 600, 470, '#3fc8ff', t);
    spot(g, 560, '#d8f8ff', 0.2);
    shine(g, 560, 680, 290, '#d0f4ff');
    hero(g, 560, 680, 290, 'crazy', { rim: '#3fe0ff', haloA: 0.38, dir: 1 });
    motes(g, 104, 30, '#c8f4ff');
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-schoen') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
