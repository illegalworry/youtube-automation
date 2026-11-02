// beauty.js — 10 Ifverse-style "why?" thumbnails for «What If You Were the Most Beautiful Person in the World?» (params.tpl === 'ifv-beauty').
// Built on brain10.js: heroFull() for full-body / medium shots, hero() for head-and-shoulders. Text is added later by story/beauty_text.sh.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, face, hero } from './ifverse.js';
import { heroFull } from './brain10.js';

// ---------- small helpers ----------
const digits = (g, s, x, y, size, c, o = {}) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, glow: 36, glowColor: c, ...o });
const label = (g, s, x, y, size, c, o = {}) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, ...o });
const panel = (g, x, y, w, h, c, frame = '#141018', rad = 30) => {
  glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, c, 0.45);
  rr(g, x - 22, y - 22, w + 44, h + 44, rad); g.fillStyle = frame; g.fill();
  g.save(); g.shadowColor = c; g.shadowBlur = 36; rr(g, x - 22, y - 22, w + 44, h + 44, rad); g.lineWidth = 6; g.strokeStyle = alpha(shade(c, 0.3), 0.9); g.stroke(); g.restore();
};
const heart = (g, x, y, s, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + s * 0.55); g.bezierCurveTo(x - s * 1.1, y - s * 0.2, x - s * 0.5, y - s * 1.05, x, y - s * 0.45); g.bezierCurveTo(x + s * 0.5, y - s * 1.05, x + s * 1.1, y - s * 0.2, x, y + s * 0.55); g.fill(); };
const sparkles = (g, seed, n, area, c = '#fff1a0', smin = 14, smax = 34) => { const r = rng(seed); for (let i = 0; i < n; i++) star(g, area[0] + r() * area[2], area[1] + r() * area[3], smin + r() * (smax - smin), c); };
const flashes = (g, seed, n, area, c = '#ffffff') => { const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = area[0] + r() * area[2], y = area[1] + r() * area[3], s = 30 + r() * 70; glow(g, x, y, s * 2.2, c, 0.55); g.fillStyle = alpha('#ffffff', 0.85); g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, d = k % 2 ? s * 0.12 : s * 0.7; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); } g.restore(); };

// ---------- props ----------
// a long shop receipt with every line at $0.00
const receipt = (g, x, y, w, h, rot) => {
  g.save(); g.translate(x, y); g.rotate(rot);
  glow(g, 0, 0, Math.max(w, h) * 0.75, '#ffcf6a', 0.55);
  g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40;
  g.fillStyle = '#fffaf0'; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2, h / 2);
  for (let i = 0; i <= 14; i++) g.lineTo(w / 2 - i * w / 14, h / 2 - (i % 2 ? 22 : 0)); g.closePath(); g.fill(); g.shadowBlur = 0;
  label(g, 'RECEIPT', 0, -h / 2 + 80, 58, '#2a2030', { spacing: 8 });
  seg(g, [[-w / 2 + 40, -h / 2 + 115], [w / 2 - 40, -h / 2 + 115]], 4, alpha('#2a2030', 0.4));
  const items = ['DINNER', 'TAXI', 'SHOES', 'HOTEL', 'COFFEE'];
  items.forEach((s, i) => { const yy = -h / 2 + 175 + i * 58; label(g, s, -w / 2 + 44, yy, 36, '#4a4050', { align: 'left' }); label(g, '$0.00', w / 2 - 44, yy, 36, '#4a4050', { align: 'right' }); });
  const ty = -h / 2 + 175 + items.length * 58 + 10; seg(g, [[-w / 2 + 40, ty], [w / 2 - 40, ty]], 6, '#2a2030');
  label(g, 'TOTAL', -w / 2 + 44, ty + 70, 46, '#2a2030', { align: 'left' });
  digits(g, '$0.00', w / 2 - 44, ty + 74, 72, '#e8321a', { align: 'right', glow: 14 });
  for (let i = 0; i < 22; i++) g.fillRect(-w / 2 + 60 + i * ((w - 120) / 22), h / 2 - 110, (i % 3 ? 6 : 12), 60);
  g.restore();
};
// traffic light — every lamp red, the top one is a heart
const trafficLight = (g, x, y, s) => {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -26, 300, 52, 900, 20); g.fillStyle = '#1c1a24'; g.fill();
  glow(g, 0, 0, 520, '#ff2a2a', 0.6);
  rr(g, -150, -330, 300, 640, 70); g.fillStyle = '#16141c'; g.fill();
  g.save(); g.shadowColor = '#ff3a3a'; g.shadowBlur = 30; rr(g, -150, -330, 300, 640, 70); g.lineWidth = 8; g.strokeStyle = alpha('#ff6a6a', 0.7); g.stroke(); g.restore();
  for (let i = 0; i < 3; i++) {
    const cy = -190 + i * 190; circle(g, 0, cy, 90, '#06050a');
    g.fillStyle = '#16141c'; g.beginPath(); g.moveTo(-110, cy - 92); g.lineTo(110, cy - 92); g.lineTo(80, cy - 60); g.lineTo(-80, cy - 60); g.fill();
    glow(g, 0, cy, 210, '#ff1a2a', 0.85);
    if (i === 0) { circle(g, 0, cy, 80, '#3a0a10'); heart(g, 0, cy + 10, 95, '#ff2a3a'); g.save(); g.globalCompositeOperation = 'lighter'; heart(g, 0, cy + 6, 70, alpha('#ffb0b8', 0.6)); g.restore(); }
    else { circle(g, 0, cy, 80, '#ff2a3a'); circle(g, -20, cy - 22, 30, alpha('#ffd0d4', 0.6)); }
  }
  g.restore();
};
// smartphone with zero messages
const phone = (g, x, y, w, h, rot, c) => {
  g.save(); g.translate(x, y); g.rotate(rot);
  glow(g, 0, 0, Math.max(w, h) * 0.8, c, 0.5);
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; rr(g, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 70); g.fillStyle = '#0e0c14'; g.fill(); g.shadowBlur = 0;
  g.save(); g.shadowColor = c; g.shadowBlur = 30; rr(g, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 70); g.lineWidth = 6; g.strokeStyle = alpha(shade(c, 0.3), 0.9); g.stroke(); g.restore();
  rr(g, -w / 2, -h / 2, w, h, 52); g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#2a0a3a', '#12061e']); g.fill();
  rr(g, -70, -h / 2 + 18, 140, 34, 17); g.fillStyle = '#0e0c14'; g.fill();
  label(g, 'Messages', 0, -h / 2 + 120, 50, '#ffffff');
  seg(g, [[-w / 2 + 30, -h / 2 + 160], [w / 2 - 30, -h / 2 + 160]], 3, alpha('#ffffff', 0.2));
  digits(g, '0', 0, 90, 300, c, { glow: 60 });
  label(g, 'new messages', 0, 170, 40, alpha('#ffffff', 0.8), { weight: 800 });
  for (let i = 0; i < 3; i++) { rr(g, -w / 2 + 40, h / 2 - 210 + i * 62, w - 80, 44, 22); g.fillStyle = alpha('#ffffff', 0.07); g.fill(); }
  g.restore();
};
// big screen: thumbs-down counter
const thumbDown = (g, x, y, s, c) => {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c;
  rr(g, -90, -110, 160, 150, 34); g.fill();                     // fist
  rr(g, 70, -120, 50, 170, 16); g.fill();                       // cuff
  rr(g, -50, 10, 62, 150, 31); g.fill();                        // thumb pointing down
  for (let i = 0; i < 3; i++) seg(g, [[-80, -70 + i * 36], [40, -70 + i * 36]], 5, alpha('#000', 0.25));
  g.restore();
};
// "you" duplicated on a wall of screens
const faceWall = (g, x0, y0, cols, rows, cw, ch, gap, c, seed) => {
  const r = rng(seed), emos = ['smug', 'smug', 'shocked', 'smug', 'angry', 'smug', 'sad', 'smug', 'smug'];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = x0 + i * (cw + gap), y = y0 + j * (ch + gap);
    glow(g, x + cw / 2, y + ch / 2, cw * 0.9, c, 0.25);
    rr(g, x - 10, y - 10, cw + 20, ch + 20, 16); g.fillStyle = '#0a0a12'; g.fill();
    g.save(); rr(g, x, y, cw, ch, 10); g.clip(); g.fillStyle = linGrad(g, 0, y, 0, y + ch, [shade(c, -0.35), shade(c, -0.7)]); g.fillRect(x, y, cw, ch);
    g.fillStyle = '#c8402e'; g.beginPath(); g.ellipse(x + cw / 2, y + ch * 1.02, cw * 0.38, ch * 0.3, 0, 0, 7); g.fill();
    face(g, x + cw / 2, y + ch * 0.5, ch * 0.3, emos[(i + j * cols) % emos.length], { dir: r() < 0.5 ? -1 : 1, rim: c, star: false });
    for (let k = 0; k < ch; k += 8) { g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x, y + k, cw, 3); }
    g.restore();
    g.save(); g.shadowColor = c; g.shadowBlur = 18; rr(g, x - 10, y - 10, cw + 20, ch + 20, 16); g.lineWidth = 4; g.strokeStyle = alpha(shade(c, 0.4), 0.8); g.stroke(); g.restore();
  }
};
// hourglass — top almost empty
const hourglass = (g, x, y, s, c) => {
  g.save(); g.translate(x, y); g.scale(s, s);
  glow(g, 0, 0, 520, c, 0.55);
  const wood = '#5a2e1a';
  rr(g, -230, -380, 460, 60, 24); g.fillStyle = wood; g.fill(); rr(g, -230, 320, 460, 60, 24); g.fill();
  for (const k of [-1, 1]) { rr(g, k * 200 - 18, -330, 36, 660, 14); g.fillStyle = shade(wood, 0.15); g.fill(); }
  const glass = new Path2D(); glass.moveTo(-170, -320); glass.bezierCurveTo(-170, -80, -30, -50, -24, 0); glass.bezierCurveTo(-30, 50, -170, 80, -170, 320); glass.lineTo(170, 320); glass.bezierCurveTo(170, 80, 30, 50, 24, 0); glass.bezierCurveTo(30, -50, 170, -80, 170, -320); glass.closePath();
  g.fillStyle = alpha('#d8f0ff', 0.14); g.fill(glass);
  g.save(); g.clip(glass);
  g.fillStyle = linGrad(g, 0, -80, 0, -20, ['#ffe08a', '#ffb03a']); g.beginPath(); g.moveTo(-60, -50); g.quadraticCurveTo(0, -80, 60, -50); g.lineTo(0, 0); g.closePath(); g.fill();   // last grains on top
  g.fillStyle = linGrad(g, 0, 120, 0, 320, ['#ffe08a', '#ff9a2a']); g.beginPath(); g.moveTo(-170, 320); g.lineTo(-170, 230); g.quadraticCurveTo(0, 90, 170, 230); g.lineTo(170, 320); g.closePath(); g.fill();
  g.restore();
  seg(g, [[0, 0], [0, 150]], 6, '#ffd06a'); glow(g, 0, 100, 80, '#ffd06a', 0.6);
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha('#ffffff', 0.5); g.lineWidth = 8; g.stroke(glass);
  g.strokeStyle = alpha('#ffffff', 0.35); g.lineWidth = 14; g.beginPath(); g.moveTo(-130, -280); g.quadraticCurveTo(-130, -140, -70, -90); g.stroke(); g.restore();
  g.restore();
};
// golden insurance shield with a $ lock
const shield = (g, x, y, s) => {
  g.save(); g.translate(x, y); g.scale(s, s);
  glow(g, 0, 0, 560, '#ffcf3a', 0.6);
  const p = new Path2D(); p.moveTo(0, -330); p.bezierCurveTo(120, -260, 210, -250, 270, -250); p.bezierCurveTo(280, 40, 200, 230, 0, 340); p.bezierCurveTo(-200, 230, -280, 40, -270, -250); p.bezierCurveTo(-210, -250, -120, -260, 0, -330); p.closePath();
  g.fillStyle = linGrad(g, -270, -330, 270, 340, ['#fff2a0', '#ffc22a', '#c8801a']); g.fill(p);
  g.save(); g.scale(0.82, 0.82); g.fillStyle = linGrad(g, 0, -330, 0, 340, ['#7a2ad8', '#3a0a8a']); g.fill(p); g.restore();
  g.save(); g.shadowColor = '#ffe06a'; g.shadowBlur = 40; g.lineWidth = 10; g.strokeStyle = '#fff6c0'; g.stroke(p); g.restore();
  // padlock
  g.strokeStyle = '#ffd84a'; g.lineWidth = 30; g.beginPath(); g.arc(0, -40, 80, Math.PI, 0); g.stroke();
  seg(g, [[-80, -40], [-80, 10]], 30, '#ffd84a'); seg(g, [[80, -40], [80, 10]], 30, '#ffd84a');
  rr(g, -130, 0, 260, 200, 30); g.fillStyle = linGrad(g, 0, 0, 0, 200, ['#ffe27a', '#e8a01a']); g.fill();
  label(g, '$', 0, 160, 170, '#5a2a0a');
  g.restore();
};
// press camera with a flash going off
const camera = (g, x, y, s, rot) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  glow(g, 0, -40, 600, '#fff2c0', 0.55);
  rr(g, -300, -170, 600, 360, 50); g.fillStyle = linGrad(g, 0, -170, 0, 190, ['#2a2832', '#121018']); g.fill();
  rr(g, -150, -250, 220, 100, 24); g.fillStyle = '#1c1a22'; g.fill();
  rr(g, 120, -260, 150, 110, 18); g.fillStyle = '#e8e8f0'; g.fill();               // flash head
  glow(g, 195, -205, 360, '#ffffff', 1); glow(g, 195, -205, 140, '#ffffff', 1);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffffff', 0.9); g.beginPath(); for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, d = k % 2 ? 40 : 260; g.lineTo(195 + Math.cos(a) * d, -205 + Math.sin(a) * d); } g.closePath(); g.fill(); g.restore();
  circle(g, 0, 20, 190, '#0a0a10'); circle(g, 0, 20, 160, '#2a2a36'); circle(g, 0, 20, 120, '#06060c');
  g.fillStyle = radGrad(g, -30, -10, 0, 120, ['#7ab8ff', '#2a3a8a', '#06060c']); g.beginPath(); g.arc(0, 20, 110, 0, 7); g.fill();
  circle(g, -45, -25, 28, alpha('#ffffff', 0.75)); circle(g, 40, 60, 12, alpha('#ffffff', 0.5));
  circle(g, -240, -110, 18, '#e8321a'); glow(g, -240, -110, 50, '#ff2a1a', 0.9);
  g.restore();
};
// employee badge on a lanyard with a red stamp
const badge = (g, x, y, s, rot) => {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  seg(g, [[-120, -700], [-40, -250]], 26, '#3a6ae0'); seg(g, [[120, -700], [40, -250]], 26, '#2a4ab0');
  glow(g, 0, 0, 520, '#8ab0ff', 0.5);
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40; rr(g, -240, -250, 480, 620, 40); g.fillStyle = '#f6f4fa'; g.fill(); g.shadowBlur = 0;
  rr(g, -60, -230, 120, 30, 15); g.fillStyle = '#9aa0b8'; g.fill();
  rr(g, -240, -180, 480, 90, 0); g.fillStyle = '#3a6ae0'; g.fill(); label(g, 'STAFF', 0, -118, 58, '#ffffff', { spacing: 10 });
  rr(g, -110, -60, 220, 230, 20); g.fillStyle = '#c8d4f0'; g.fill();
  g.save(); rr(g, -110, -60, 220, 230, 20); g.clip(); g.fillStyle = '#d8402e'; g.beginPath(); g.ellipse(0, 190, 100, 70, 0, 0, 7); g.fill(); circle(g, 0, 60, 72, INK); star(g, 22, 50, 18); g.restore();
  for (let i = 0; i < 2; i++) { rr(g, -160, 205 + i * 50, i ? 220 : 320, 26, 13); g.fillStyle = '#b8bcd0'; g.fill(); }
  // big red X stamp
  g.save(); g.globalAlpha = 0.92; g.strokeStyle = '#ff2a2a'; g.lineCap = 'round'; g.lineWidth = 56; g.shadowColor = '#ff2a2a'; g.shadowBlur = 30;
  g.beginPath(); g.moveTo(-200, -60); g.lineTo(200, 330); g.moveTo(200, -60); g.lineTo(-200, 330); g.stroke(); g.restore();
  g.restore();
};
// standing mirror with a cracked, wrong reflection
const mirror = (g, x, y, w, h, c) => {
  glow(g, x, y, Math.max(w, h) * 0.75, c, 0.55);
  g.save(); g.translate(x, y);
  g.fillStyle = linGrad(g, -w / 2, 0, w / 2, 0, ['#ffd06a', '#fff2b0', '#c8801a']); g.beginPath(); g.ellipse(0, 0, w / 2 + 30, h / 2 + 30, 0, 0, 7); g.fill();
  g.save(); g.shadowColor = c; g.shadowBlur = 40; g.lineWidth = 8; g.strokeStyle = alpha(c, 0.9); g.beginPath(); g.ellipse(0, 0, w / 2 + 34, h / 2 + 34, 0, 0, 7); g.stroke(); g.restore();
  g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, 7); g.save(); g.clip();
  g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#3a1a6a', '#0a3a5a']); g.fillRect(-w, -h, w * 2, h * 2);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffffff', 0.1); g.beginPath(); g.moveTo(-w / 2, -h * 0.2); g.lineTo(-w * 0.1, -h / 2); g.lineTo(w * 0.1, -h / 2); g.lineTo(-w / 2, h * 0.05); g.fill(); g.restore();
  // the reflection: same hoodie, but an angry, warped face
  g.save(); g.translate(0, h * 0.06); g.scale(1.12, 0.9); g.fillStyle = '#b8302a'; g.beginPath(); g.ellipse(0, h * 0.45, w * 0.42, h * 0.22, 0, 0, 7); g.fill();
  face(g, 0, 0, w * 0.27, 'angry', { dir: -1, rim: c }); g.restore();
  // crack
  const cx = w * 0.12, cy = -h * 0.12, r = rng(31);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + r() * 0.4, pts = [[cx, cy]]; let px = cx, py = cy; for (let k = 0; k < 4; k++) { const d = 50 + r() * 80; px += Math.cos(a + (r() - 0.5) * 0.7) * d; py += Math.sin(a + (r() - 0.5) * 0.7) * d; pts.push([px, py]); } seg(g, pts, 5, alpha('#ffffff', 0.9)); seg(g, pts, 14, alpha(c, 0.35)); }
  g.beginPath(); g.arc(cx, cy, 60, 0, 7); g.lineWidth = 4; g.strokeStyle = alpha('#ffffff', 0.7); g.stroke(); glow(g, cx, cy, 120, '#ffffff', 0.6);
  g.restore(); g.restore();
  rr(g, -26, h / 2 + 20, 52, 300, 16); g.fillStyle = '#c8801a'; g.fill();
  g.restore();
};

// ---------- the ten variants ----------
const V = {
  // 1 SMUG, full body right, hands on hips — a receipt where everything costs $0: "FREE / EVERYTHING."
  1(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.25, blur: 7, veil: 0.25, y: -100 });
    wash(g, '#ffb01a', '#8a2a0a', 0.85); bokeh(g, 201, 26, ['#ffd04a', '#ff8a2a', '#ff5ad8']); vign(g, 0.55);
    receipt(g, 800, 820, 450, 680, -0.06);
    sparkles(g, 21, 6, [500, 520, 620, 460], '#fff1a0', 16, 30);
    motes(g, 211, 30, '#ffe08a');
    heroFull(g, 1460, 1040, 185, 'smug', { pose: 'hips', dir: -1, rim: '#ffcf3a', haloA: 0.32 });
  },
  // 2 SHOCKED, full body left, arms up — every traffic light turns red (a heart): "TRAFFIC / STOPPED."
  2(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.25, blur: 8, veil: 0.3, y: -100 });
    wash(g, '#ff1a3a', '#1a0a6a', 0.85); bokeh(g, 202, 30, ['#ff3a4a', '#ffd04a', '#5fa8ff'], 0.4); vign(g, 0.55);
    const r = rng(22); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const x = 700 + r() * 1200, y = 860 + r() * 140; glow(g, x, y, 60, i % 3 ? '#ff2a2a' : '#fff2c0', 0.55); } g.restore();
    trafficLight(g, 1060, 560, 0.82);
    motes(g, 212, 30, '#ffd0d0');
    heroFull(g, 470, 1040, 180, 'shocked', { pose: 'up', dir: 1, rim: '#ff5a6a', haloA: 0.34 });
  },
  // 3 SAD, medium shot left, shrugging — a phone with 0 messages: "NOBODY / TEXTS ME."
  3(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#ff2a9a', '#4a0a6a', 0.85); bokeh(g, 203, 24, ['#ff5ad8', '#ffb0e0', '#8a6aff']); vign(g, 0.55);
    phone(g, 1450, 850, 380, 640, 0.1, '#ff4ad8');
    motes(g, 213, 30, '#ffd0f0');
    heroFull(g, 520, 1500, 245, 'sad', { pose: 'shrug', dir: 1, rim: '#ff6ad8', haloA: 0.32 });
  },
  // 4 ANGRY, full body right, pointing — a screen full of thumbs-down: "THEY / HATE ME."
  4(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#ff1a4a', '#3a0a3a', 0.9); bokeh(g, 204, 24, ['#ff3a5a', '#ff8a2a', '#ff5ad8']); vign(g, 0.6);
    const x = 190, y = 500, w = 720, h = 450, c = '#ff3a4a'; panel(g, x, y, w, h, c);
    g.save(); rr(g, x, y, w, h, 12); g.clip(); g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#3a0812', '#14040a']); g.fillRect(x, y, w, h); for (let i = 0; i < h; i += 6) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, y + i, w, 2); } g.restore();
    glow(g, x + 200, y + h / 2, 220, c, 0.6); thumbDown(g, x + 185, y + h / 2 - 20, 1.1, '#ff4a5a');
    digits(g, '9.9M', x + 545, y + h / 2 + 30, 128, '#ffd0d4');
    label(g, 'DISLIKES', x + 545, y + h / 2 + 105, 40, alpha('#ff8a9a', 0.9), { spacing: 6 });
    motes(g, 214, 30, '#ffd0d0');
    const hh = heroFull(g, 1440, 1040, 180, 'angry', { pose: 'point', dir: -1, rim: '#ff5a6a', haloA: 0.35 });
  },
  // 5 CRAZY, big bust centre — a wall of screens with a thousand copies of your face: "WHICH ONE / IS ME?"
  5(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.3, blur: 9, veil: 0.35, y: -120 });
    wash(g, '#0affd8', '#0a2a5a', 0.85); bokeh(g, 205, 24, ['#3fffd0', '#5fd8ff', '#d0ff5a']); vign(g, 0.6);
    faceWall(g, 1330, 130, 3, 4, 150, 170, 34, '#3fffd0', 5);
    faceWall(g, 60, 590, 2, 2, 150, 170, 34, '#3fffd0', 7);
    hero(g, 920, 720, 255, 'crazy', { rim: '#3fffd0', haloA: 0.42, dir: 1 });
    motes(g, 215, 40, '#c8fff0');
  },
  // 6 SHOCKED, head-and-shoulders left — an hourglass almost run out: "IT LASTED / 10 YEARS."
  6(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#1a3aff', '#0a0a4a', 0.9); bokeh(g, 206, 24, ['#5fa8ff', '#8a6aff', '#ffd06a'], 0.32); vign(g, 0.55);
    FX.stars(g, 0, { seed: 16, count: 90, area: [900, 0, 1020, 500] });
    hourglass(g, 1440, 760, 0.78, '#ffb03a');
    motes(g, 216, 40, '#ffe0a0', [1100, 400, 700, 600]);
    hero(g, 560, 720, 250, 'shocked', { rim: '#ffb03a', haloA: 0.35, dir: 1 });
  },
  // 7 SMUG, full body left, waving — a golden insurance shield with a $ lock: "MY FACE / IS INSURED."
  7(g, t) {
    bgBlur(g, t, 'stage', {}, { z: 1.25, blur: 12, veil: 0.3, y: -100 });
    wash(g, '#8a1aff', '#3a0a6a', 0.85); bokeh(g, 207, 28, ['#ffd02a', '#ff5ad8', '#8a6aff']); vign(g, 0.55);
    shield(g, 1260, 720, 0.82);
    const r = rng(27); for (let i = 0; i < 26; i++) { const x = 1000 + r() * 560, y = 950 + r() * 110, s = 22 + r() * 12; glow(g, x, y, s * 2, '#ffcf3a', 0.5); g.fillStyle = '#ffcf3a'; g.beginPath(); g.ellipse(x, y, s, s * (0.35 + r() * 0.5), r() * 3, 0, 7); g.fill(); g.strokeStyle = '#c8901a'; g.lineWidth = 4; g.stroke(); }
    sparkles(g, 17, 6, [950, 380, 650, 300]);
    motes(g, 217, 30, '#fff2a0');
    heroFull(g, 470, 1045, 178, 'smug', { pose: 'wave', dir: 1, rim: '#ffcf3a', haloA: 0.3 });
  },
  // 8 ANGRY, medium shot right, pointing — a paparazzi camera flashing: "I CAN'T / GO OUTSIDE."
  8(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.3, blur: 9, veil: 0.35, y: -120 });
    wash(g, '#ffc01a', '#8a1a0a', 0.85); bokeh(g, 208, 24, ['#ffe04a', '#ff8a2a', '#ffffff']); vign(g, 0.6);
    flashes(g, 28, 9, [0, 450, 1100, 600]);
    camera(g, 620, 760, 0.9, -0.08);
    motes(g, 218, 30, '#fff0c0');
    heroFull(g, 1450, 1470, 240, 'angry', { pose: 'point', dir: -1, rim: '#ffcf3a', haloA: 0.35 });
  },
  // 9 SAD, full body centre — an employee badge crossed out: "I GOT / FIRED."
  9(g, t) {
    bgBlur(g, t, 'class', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#3a2aff', '#1a0a5a', 0.9); bokeh(g, 209, 24, ['#5fa8ff', '#8a6aff', '#ff5ad8'], 0.32); vign(g, 0.55);
    badge(g, 1530, 640, 0.78, 0.12);
    motes(g, 219, 30, '#c8d8ff');
    heroFull(g, 900, 1045, 180, 'sad', { pose: 'idle', dir: 1, rim: '#8ab0ff', haloA: 0.32 });
  },
  // 10 CRAZY, full body right, hands on head — a cracked mirror with a scary reflection: "MIRRORS / SCARE ME."
  10(g, t) {
    bgBlur(g, t, 'bedroomDay', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#ff2ad8', '#0a4a6a', 0.85); bokeh(g, 210, 26, ['#3fffe0', '#ff5ad8', '#ffd06a']); vign(g, 0.6);
    mirror(g, 1000, 670, 380, 540, '#3fffe0');
    motes(g, 220, 40, '#d0fff8');
    heroFull(g, 1520, 1045, 180, 'crazy', { pose: 'head', dir: -1, rim: '#ff5ad8', haloA: 0.35 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-beauty') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
