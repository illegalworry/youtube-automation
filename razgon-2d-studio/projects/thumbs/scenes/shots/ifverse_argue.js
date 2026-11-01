// ifverse_argue.js — Ifverse thumbnails for «What If You Could Win Every Argument?» (shots with params.pack === 'argue').
// Same look as ifverse.js: big black head in a red hoodie (left), one big glowing prop (right). Text comes from story/text2.py.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { hero, INK, wash, vign, bokeh, motes, star, panelGlow } from './ifverse.js';

const scan = (g, x, y, w, h, c, step = 22) => { g.save(); rr(g, x, y, w, h, 26); g.clip(); for (let i = 0; i < h / step; i++) { g.fillStyle = alpha(c, 0.05); g.fillRect(x, y + i * step, w, 2); } g.restore(); };
const bubble = (g, x, y, w, h, fill, side) => { rr(g, x, y, w, h, h * 0.42); g.fillStyle = fill; g.fill(); const tx = side < 0 ? x + 18 : x + w - 18; poly(g, [[tx - 16, y + h - 20], [tx + 16, y + h - 20], [tx + side * 26, y + h + 14]], fill); };
const person = (g, x, y, s, c = INK) => { circle(g, x, y, 26 * s, c); rr(g, x - 30 * s, y + 30 * s, 60 * s, 46 * s, 22 * s); g.fillStyle = c; g.fill(); };

const V = {
  // 1 SMUG + star eye — holographic scoreboard 999 : 0: "ALWAYS / RIGHT."
  1(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.25, blur: 7, veil: 0.2, y: -120 });
    wash(g, '#2a3cff', '#7a2aff', 0.75); bokeh(g, 12, 26, ['#5fd8ff', '#8a6aff', '#ff5ad8']); vign(g, 0.5);
    const px = 1060, py = 170, pw = 780, ph = 640, c = '#3fe0ff';
    g.fillStyle = linGrad(g, 0, py, 0, py + ph, [alpha('#0a2a4a', 0.84), alpha('#06142a', 0.92)]); rr(g, px, py, pw, ph, 26); g.fill(); panelGlow(g, px, py, pw, ph, c); scan(g, px, py, pw, ph, c);
    text(g, 'ARGUMENTS', px + 40, py + 62, { size: 46, color: c, font: FONTS.ui, weight: 900, align: 'left', spacing: 6 });
    circle(g, px + pw - 150, py + 60, 13, '#ff3a3a'); glow(g, px + pw - 150, py + 60, 40, '#ff3a3a', 0.8);
    text(g, 'LIVE', px + pw - 40, py + 62, { size: 40, color: alpha('#ffffff', 0.85), font: FONTS.ui, weight: 900, align: 'right', spacing: 4 });
    const lx = px + 225, rx = px + pw - 150, ny = py + 340;
    text(g, 'YOU', lx, py + 175, { size: 50, color: '#e8fbff', font: FONTS.ui, weight: 900, spacing: 6 });
    text(g, 'THEM', rx, py + 175, { size: 50, color: alpha('#e8fbff', 0.55), font: FONTS.ui, weight: 900, spacing: 6 });
    // crown over YOU
    const cx = lx, cy = py + 112; glow(g, cx, cy, 90, '#ffd23a', 0.7); poly(g, [[cx - 46, cy + 18], [cx - 50, cy - 26], [cx - 22, cy - 2], [cx, cy - 36], [cx + 22, cy - 2], [cx + 50, cy - 26], [cx + 46, cy + 18]], '#ffd23a');
    glow(g, lx, ny, 260, c, 0.4);
    text(g, '999', lx, ny, { size: 190, color: '#e8fbff', font: FONTS.ui, weight: 900, glow: 34, glowColor: c });
    text(g, ':', px + 485, ny - 14, { size: 160, color: alpha(c, 0.8), font: FONTS.ui, weight: 900 });
    text(g, '0', rx, ny, { size: 210, color: alpha('#ff6a8a', 0.9), font: FONTS.ui, weight: 900, glow: 20, glowColor: '#ff3a6a' });
    const bx = px + 60, by = py + ph - 150, bw = pw - 120; rr(g, bx, by, bw, 46, 23); g.fillStyle = alpha('#000', 0.5); g.fill(); rr(g, bx + 6, by + 6, bw - 12, 34, 17); g.fillStyle = linGrad(g, bx, 0, bx + bw, 0, ['#3fe0ff', '#6affb0']); g.fill();
    text(g, 'WIN RATE 100%', px + pw / 2, by + 96, { size: 50, color: '#e8fbff', font: FONTS.ui, weight: 900, glow: 20, glowColor: c, spacing: 3 });
    motes(g, 4, 30, c, [1000, 80, 900, 900]);
    hero(g, 560, 700, 245, 'smug', { rim: '#5fd8ff', dir: 1 });
  },
  // 2 ANGRY — giant phone, group chat, someone just said "you're wrong": "ADMIT / IT."
  2(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.3, blur: 8, veil: 0.35, y: -140 });
    wash(g, '#ff8a2a', '#5a1a0a', 0.8); bokeh(g, 22, 18, ['#ffb04a', '#ff6a2a']); vign(g, 0.65);
    FX.lightCone(g, 1450, -20, { angle: Math.PI / 2, spread: 0.32, len: 1000, color: '#ffd59a', a: 0.2 });
    const px = 1200, py = 120, pw = 560, ph = 920;
    glow(g, px + pw / 2, py + ph / 2, 620, '#ff9a3a', 0.4);
    g.save(); g.translate(px + pw / 2, py + ph / 2); g.rotate(0.07); g.translate(-pw / 2, -ph / 2);
    g.save(); g.shadowColor = '#ff7a2a'; g.shadowBlur = 60; rr(g, 0, 0, pw, ph, 70); g.fillStyle = '#141018'; g.fill(); g.restore();
    rr(g, 22, 22, pw - 44, ph - 44, 52); g.fillStyle = linGrad(g, 0, 0, 0, ph, ['#221a2a', '#120e18']); g.fill();
    rr(g, pw / 2 - 80, 40, 160, 34, 17); g.fillStyle = '#000'; g.fill();
    text(g, 'GROUP CHAT', pw / 2, 130, { size: 40, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 3 });
    g.fillStyle = alpha('#ffffff', 0.12); g.fillRect(40, 175, pw - 80, 3);
    bubble(g, 50, 220, 330, 96, '#3a3444', -1); text(g, 'u r wrong', 215, 268, { size: 44, color: '#ffffff', font: FONTS.ui, weight: 800 });
    bubble(g, 170, 370, 340, 96, '#2f7cff', 1); text(g, 'source?', 340, 418, { size: 44, color: '#ffffff', font: FONTS.ui, weight: 800 });
    bubble(g, 50, 520, 300, 96, '#3a3444', -1); text(g, 'trust me', 200, 568, { size: 44, color: '#ffffff', font: FONTS.ui, weight: 800 });
    g.save(); g.shadowColor = '#ff2a1a'; g.shadowBlur = 40; bubble(g, 90, 680, 420, 130, '#e8321a', 1); g.restore();
    text(g, '47 SOURCES', 300, 745, { size: 58, color: '#ffffff', font: FONTS.ui, weight: 900 });
    g.restore();
    circle(g, px + pw - 10, py + 20, 58, '#e8321a'); glow(g, px + pw - 10, py + 20, 120, '#ff3a1a', 0.7); text(g, '99+', px + pw - 10, py + 22, { size: 46, color: '#ffffff', font: FONTS.ui, weight: 900 });
    motes(g, 8, 24, '#ffb04a', [900, 80, 1000, 900]);
    hero(g, 560, 700, 245, 'angry', { rim: '#ff9a3a', haloA: 0.32, dir: 1 });
  },
  // 3 SHOCKED — friend counter crashing to 0, friends flying away: "NO / FRIENDS."
  3(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 8, veil: 0.25, y: -120 });
    wash(g, '#3a1aff', '#ff3a9a', 0.7); bokeh(g, 32, 22, ['#ff5ad8', '#5fd8ff', '#ffd06a']); vign(g, 0.5);
    const px = 1080, py = 300, pw = 700, ph = 520, c = '#ff5ad8';
    g.fillStyle = linGrad(g, 0, py, 0, py + ph, [alpha('#2a0a3a', 0.88), alpha('#14061e', 0.94)]); rr(g, px, py, pw, ph, 26); g.fill(); panelGlow(g, px, py, pw, ph, c);
    text(g, 'FRIENDS', px + pw / 2, py + 70, { size: 56, color: '#ffd0f2', font: FONTS.ui, weight: 900, spacing: 10 });
    text(g, '1,204', px + pw / 2, py + 160, { size: 64, color: alpha('#ffffff', 0.5), font: FONTS.ui, weight: 900 });
    seg(g, [[px + pw / 2 - 110, py + 162], [px + pw / 2 + 110, py + 158]], 8, '#ff3a5a');
    glow(g, px + pw / 2, py + 340, 280, '#ff2a4a', 0.55);
    text(g, '0', px + pw / 2, py + 350, { size: 300, color: '#ff4a5a', font: FONTS.ui, weight: 900, glow: 44, glowColor: 'rgba(255,40,70,.95)' });
    poly(g, [[px + pw - 150, py + 270], [px + pw - 90, py + 270], [px + pw - 90, py + 350], [px + pw - 60, py + 350], [px + pw - 120, py + 420], [px + pw - 180, py + 350], [px + pw - 150, py + 350]], '#ff4a5a');
    // friends flying off the card
    const r = rng(5);
    for (let i = 0; i < 7; i++) { const x = px + 80 + i * 105 + (r() - 0.5) * 40, y = py - 60 - r() * 200, s = 0.9 + r() * 0.5;
      g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = linGrad(g, x, y + 60, x, y + 220, [alpha('#ffffff', 0.4), alpha('#ffffff', 0)]); g.lineWidth = 46 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y + 60); g.lineTo(x - 20, y + 220); g.stroke(); g.restore();
      glow(g, x, y + 20, 90 * s, '#ffd0f2', 0.5); person(g, x, y, s, '#1a0a20'); circle(g, x, y, 26 * s - 3, alpha('#ffffff', 0)); g.strokeStyle = '#ffd0f2'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 26 * s, 0, 7); g.stroke(); }
    motes(g, 9, 40, '#ffe0a0', [800, 0, 1120, 1000]);
    hero(g, 560, 700, 245, 'shocked', { rim: '#ff7ad8', haloA: 0.35, dir: 1 });
  },
  // 4 SAD + tear — a winner's trophy in the rain, nobody left to celebrate: "YOU WON / ALONE."
  4(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.25, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#1a4aff', '#0a1a4a', 0.8); bokeh(g, 42, 26, ['#5fa8ff', '#ff6a8a', '#ffd06a'], 0.3); vign(g, 0.6);
    FX.rain(g, 0.6, { count: 260, color: '#bfe0ff', a: 0.35 });
    const x = 1420, y = 470, G = '#ffc23a', Gd = '#c8841a';
    FX.lightCone(g, x, -40, { angle: Math.PI / 2, spread: 0.26, len: 1100, color: '#ffe0a0', a: 0.25 });
    glow(g, x, y, 600, '#ffb03a', 0.5);
    // cup
    g.fillStyle = linGrad(g, x - 200, 0, x + 200, 0, [Gd, G, '#fff0b0', G, Gd]);
    g.beginPath(); g.moveTo(x - 200, y - 260); g.lineTo(x + 200, y - 260); g.bezierCurveTo(x + 200, y - 20, x + 110, y + 70, x + 40, y + 90); g.lineTo(x - 40, y + 90); g.bezierCurveTo(x - 110, y + 70, x - 200, y - 20, x - 200, y - 260); g.fill();
    g.fillStyle = shade(G, 0.25); g.beginPath(); g.ellipse(x, y - 260, 200, 36, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = Gd; g.beginPath(); g.ellipse(x, y - 258, 176, 26, 0, 0, Math.PI * 2); g.fill();
    for (const k of [-1, 1]) { g.strokeStyle = G; g.lineWidth = 30; g.beginPath(); g.arc(x + k * 185, y - 160, 78, k > 0 ? -1.4 : Math.PI - 1.7, k > 0 ? 1.7 : Math.PI + 1.4); g.stroke(); }
    g.fillStyle = linGrad(g, x - 50, 0, x + 50, 0, [Gd, G, Gd]); g.fillRect(x - 40, y + 90, 80, 110);
    g.fillStyle = linGrad(g, x - 170, 0, x + 170, 0, ['#3a2210', '#6a4220', '#3a2210']); rr(g, x - 170, y + 200, 340, 150, 14); g.fill();
    rr(g, x - 130, y + 235, 260, 80, 8); g.fillStyle = G; g.fill(); text(g, '#1 WINNER', x, y + 277, { size: 46, color: '#3a2210', font: FONTS.ui, weight: 900 });
    star(g, x - 90, y - 140, 46, '#ffe0a0'); star(g, x + 160, y - 330, 30, '#ffe0a0');
    motes(g, 12, 20, '#ffd8a0', [1000, 100, 900, 800]);
    hero(g, 560, 700, 245, 'sad', { rim: '#5fa8ff', haloA: 0.3, dir: 1 });
  },
  // 5 CRAZY / overloaded — LOGIC gauge pinned past max, glass cracked: "TOO / SMART."
  5(g, t) {
    bgBlur(g, t, 'class', {}, { z: 1.25, blur: 8, veil: 0.35, y: -120 });
    wash(g, '#ff2a1a', '#3a0a3a', 0.75); bokeh(g, 52, 20, ['#ff5a2a', '#ffb02a', '#ff2a8a']); vign(g, 0.6);
    const cx = 1430, cy = 600, R = 360;
    glow(g, cx, cy - 100, 640, '#ff3a1a', 0.5);
    g.fillStyle = '#121016'; g.beginPath(); g.arc(cx, cy, R + 30, Math.PI, 0); g.lineTo(cx + R + 30, cy + 70); g.lineTo(cx - R - 30, cy + 70); g.closePath(); g.fill();
    g.fillStyle = '#07060a'; g.beginPath(); g.arc(cx, cy, R, Math.PI, 0); g.lineTo(cx + R, cy + 50); g.lineTo(cx - R, cy + 50); g.closePath(); g.fill();
    const a0 = Math.PI * 1.0, a1 = Math.PI * 2.0;
    const arc = (from, to, col, w) => { g.save(); g.shadowColor = col; g.shadowBlur = 30; g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.arc(cx, cy, R - 50, from, to); g.stroke(); g.restore(); };
    arc(a0 + 0.05, a0 + Math.PI * 0.55, '#3aff9a', 36); arc(a0 + Math.PI * 0.55, a0 + Math.PI * 0.78, '#ffd02a', 36); arc(a0 + Math.PI * 0.78, a1 - 0.05, '#ff2a2a', 36);
    for (let i = 0; i <= 10; i++) { const a = a0 + i / 10 * Math.PI, r1 = R - 95, r2 = R - (i % 5 ? 120 : 140); seg(g, [[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], i % 5 ? 5 : 9, '#f4efe6'); }
    text(g, 'LOGIC', cx, cy - 110, { size: 60, color: '#ffb0a0', font: FONTS.ui, weight: 900, spacing: 10 });
    // needle bent past the max
    const na = a1 + 0.22; glow(g, cx, cy, 120, '#ffd08a', 0.6);
    seg(g, [[cx, cy], [cx + Math.cos(na) * (R + 60), cy + Math.sin(na) * (R + 60)]], 16, '#ff4a2a'); circle(g, cx, cy, 34, '#f4efe6'); circle(g, cx, cy, 16, '#ff4a2a');
    // cracks + sparks
    const ck = [[cx - 60, cy - R + 10], [cx - 20, cy - 250], [cx - 90, cy - 190], [cx - 30, cy - 110]];
    seg(g, ck, 7, '#f4efe6'); seg(g, [[cx - 20, cy - 250], [cx + 80, cy - 280], [cx + 120, cy - 220]], 5, '#f4efe6'); seg(g, [[cx - 90, cy - 190], [cx - 200, cy - 170]], 5, '#f4efe6');
    const sx = cx + Math.cos(na) * (R + 20), sy = cy + Math.sin(na) * (R + 20); glow(g, sx, sy, 180, '#ffd08a', 0.8);
    for (let i = 0; i < 10; i++) { const a = -2.4 + i * 0.4; seg(g, [[sx + Math.cos(a) * 40, sy + Math.sin(a) * 40], [sx + Math.cos(a) * (90 + (i % 3) * 35), sy + Math.sin(a) * (90 + (i % 3) * 35)]], 6, alpha('#ffd08a', 0.9)); }
    rr(g, cx - 220, cy + 120, 440, 96, 18); g.fillStyle = '#e8321a'; g.fill(); text(g, '⚠ 300%', cx, cy + 170, { size: 60, color: '#ffffff', font: FONTS.ui, weight: 900 });
    for (let i = 0; i < 3; i++) { const sx2 = 470 + i * 70, sy2 = 300 - i * 40; g.fillStyle = alpha('#ffffff', 0.22 - i * 0.05); g.beginPath(); g.arc(sx2, sy2, 40 + i * 14, 0, 7); g.fill(); }
    motes(g, 15, 30, '#ffb04a', [900, 60, 1000, 950]);
    hero(g, 560, 700, 245, 'crazy', { rim: '#ff8a3a', haloA: 0.35, dir: 1 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv' && s.params.pack === 'argue') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
