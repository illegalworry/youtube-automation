// invisible2.js — "GRAYSCALE WORLD" thumbnails for «What If You Turned Invisible and Nobody Noticed?» (params.tpl === 'ifv-invisible2').
// Idea: the world that doesn't see you is drained of colour; exactly ONE thing keeps its colour (the hero, a prop, his eyes, a flame...).
// One scene flips it: a colourful party where the hero is a see-through gray ghost.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, hero } from './ifverse.js';
import { heroFull } from './brain10.js';

export const GH = { hoodie: '#868a96', pants: '#3a3d48', rim: '#e8ebf4' };            // gray hero
export const mono = (g) => { g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(0, 0, E.W, E.H); g.restore(); };
export const grayBg = (g, t, set, seed, o = {}) => {
  bgBlur(g, t, set, {}, { z: o.z ?? 1.25, blur: 7, veil: o.veil ?? 0.3, y: -110 }); mono(g);
  wash(g, '#e6e9f2', '#0c0e16', 0.55); bokeh(g, seed, 22, ['#ffffff', '#c4c8d4', '#9aa0b0'], 0.2); vign(g, o.vig ?? 0.62);
};
export const spot = (g, x, y, r, c, a = 0.4) => glow(g, x, y, r, c, a);
// faceless silhouette; (x, y) = bottom centre. s = head radius scale.
export const person = (g, x, y, s, c, o = {}) => {
  g.save();
  if (o.arms) for (const k of [-1, 1]) seg(g, [[x + k * s * 1.0, y - s * 2.3], [x + k * s * 1.7, y - s * 3.4], [x + k * s * 1.5, y - s * 4.6]], s * 0.42, c);
  g.fillStyle = linGrad(g, 0, y - s * 3, 0, y, [shade(c, 0.1), shade(c, -0.15)]);
  g.beginPath(); g.moveTo(x - s * 1.3, y); g.lineTo(x - s * 1.2, y - s * 2.2); g.quadraticCurveTo(x - s * 1.1, y - s * 2.95, x, y - s * 3); g.quadraticCurveTo(x + s * 1.1, y - s * 2.95, x + s * 1.2, y - s * 2.2); g.lineTo(x + s * 1.3, y); g.closePath(); g.fill();
  circle(g, x, y - s * 3.75, s * 0.95, shade(c, 0.06));
  if (o.phone) { const px = x + (o.dir || 1) * s * 0.55; rr(g, px - s * 0.28, y - s * 2.35, s * 0.56, s * 0.86, s * 0.08); g.fillStyle = o.phone; g.fill(); glow(g, px, y - s * 1.95, s * 1.6, o.phone, 0.35); }
  g.restore();
};
export const row = (g, seed, n, x0, x1, y, s, cols, o = {}) => { const r = rng(seed); for (let i = 0; i < n; i++) person(g, x0 + (x1 - x0) * (i + r() * 0.5) / n, y + (r() - 0.5) * 24, s * (0.9 + r() * 0.25), cols[i % cols.length], { ...o, dir: r() < 0.5 ? -1 : 1, phone: o.phone && r() < 0.6 ? o.phone : null, arms: o.arms && r() < 0.8 }); };
const digits = (g, s, x, y, size, c) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, glow: 36, glowColor: c });
export const flame = (g, x, y, h, w, c1, c2) => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y - h * 0.4, h * 0.9, c1, 0.6); g.fillStyle = linGrad(g, 0, y - h, 0, y, [alpha(c2, 0.95), alpha(c1, 0.95)]); g.beginPath(); g.moveTo(x - w, y); g.bezierCurveTo(x - w * 1.1, y - h * 0.5, x - w * 0.2, y - h * 0.6, x, y - h); g.bezierCurveTo(x + w * 0.3, y - h * 0.55, x + w * 1.1, y - h * 0.5, x + w, y); g.closePath(); g.fill(); g.restore(); };
export const neon = (g, x, y, w, h, c, rad = 30) => { g.save(); g.shadowColor = c; g.shadowBlur = 36; rr(g, x, y, w, h, rad); g.lineWidth = 7; g.strokeStyle = alpha(c, 0.95); g.stroke(); g.restore(); };
export const G = ['#7a7e8a', '#656975', '#575b66'];

const V = {
  // 1 SMUG, full body — a gray crowd, only he has colour, waving at 1000 people who don't see him: "1000 PEOPLE. / 0 NOTICED."
  1(g, t) {
    grayBg(g, t, 'street', 301);
    row(g, 11, 17, 40, 1900, 800, 42, ['#8a8e9a', '#777b87'], { phone: '#e8ebf4' });
    row(g, 12, 11, 40, 1900, 940, 62, ['#5a5e6a', '#4a4e5a'], { phone: '#d0d4e0' });
    spot(g, 1280, 660, 620, '#ff3a2a', 0.4);
    heroFull(g, 1280, 1050, 175, 'smug', { pose: 'wave', dir: -1, rim: '#ff7a5a', haloA: 0.4 });
    row(g, 13, 5, 0, 760, 1170, 100, ['#24262e', '#1c1e26'], { phone: '#9aa0b0' });
    row(g, 14, 3, 1650, 1960, 1170, 100, ['#24262e', '#1c1e26']);
  },
  // 2 SAD, full body — REVERSED: a vivid party, and he is the see-through gray ghost: "EVERYONE / DANCED."
  2(g, t) {
    bgBlur(g, t, 'fair', {}, { z: 1.25, blur: 7, veil: 0.25, y: -110 });
    wash(g, '#ff2ad8', '#3a0a8a', 0.85); bokeh(g, 302, 30, ['#ff5ad8', '#ffd02a', '#2affd0', '#7a4aff'], 0.4); vign(g, 0.5);
    const cols = ['#ff3aa8', '#ffb02a', '#2affd0', '#7a4aff', '#3aa8ff', '#ff5a3a'];
    row(g, 21, 9, 60, 1000, 1010, 64, cols, { arms: true });
    row(g, 22, 4, 1200, 1900, 1010, 64, cols, { arms: true });
    row(g, 23, 6, 0, 1960, 1180, 100, ['#ff3aa8', '#ffb02a', '#7a4aff'], { arms: true });
    const r = rng(7); for (let i = 0; i < 90; i++) { g.save(); g.translate(r() * 1920, r() * 1000); g.rotate(r() * 6); g.fillStyle = cols[i % 6]; g.fillRect(-6, -3, 12, 6); g.restore(); }
    g.save(); g.globalAlpha = 0.55; g.filter = 'saturate(0)'; heroFull(g, 1420, 1050, 180, 'sad', { ...GH, pose: 'idle', dir: -1, haloA: 0.1 }); g.restore();
  },
  // 3 ANGRY, huge bust — a gray world, only the burning eyes keep colour: "ONLY MY / EYES LEFT."
  3(g, t) {
    grayBg(g, t, 'library', 303, { veil: 0.5, vig: 0.7 });
    row(g, 31, 7, 40, 900, 1010, 58, G, { phone: '#c4c8d4' });
    spot(g, 1330, 560, 700, '#ff8a1a', 0.25);
    hero(g, 1330, 620, 345, 'angry', { ...GH, haloA: 0.2, dir: -1, rim: '#cfd3e0' });
    motes(g, 34, 26, '#e0e3ee', [900, 100, 1000, 800]);
  },
  // 4 SAD, full body — a gray classroom, only he is in colour, hand up for hours: "HAND UP. / FOR 3 HOURS."
  4(g, t) {
    grayBg(g, t, 'class', 304);
    for (let rw = 0; rw < 3; rw++) { const y = 700 + rw * 130, s = 38 + rw * 12; for (let k = 0; k < 6; k++) { const x = 130 + k * 150 + rw * 40; person(g, x, y, s, G[rw], {}); rr(g, x - s * 1.6, y - s * 0.4, s * 3.2, s * 0.5, 8); g.fillStyle = shade(G[rw], -0.35); g.fill(); } }
    spot(g, 1500, 680, 640, '#ff3a2a', 0.4);
    heroFull(g, 1500, 1060, 180, 'sad', { pose: 'up', dir: -1, rim: '#ff7a5a', haloA: 0.4 });
  },
  // 5 SMUG, full body — a gray bank vault, only the gold keeps its colour: "I ENTERED / THE VAULT."
  5(g, t) {
    grayBg(g, t, 'hall', 305);
    const vx = 1000, vy = 520, vw = 560, vh = 540, c = '#ffcf3a';
    rr(g, vx - 20, vy - 20, vw + 40, vh + 40, 50); g.fillStyle = '#2c2e38'; g.fill(); neon(g, vx - 20, vy - 20, vw + 40, vh + 40, '#9aa0b0', 50);
    rr(g, vx, vy, vw, vh, 34); g.fillStyle = '#12131a'; g.fill();
    glow(g, vx + vw / 2, vy + vh * 0.75, 620, c, 0.6);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4 - (r % 2); k++) { const bx = vx + 50 + k * 125 + (r % 2) * 62, by = vy + vh - 110 - r * 100; rr(g, bx, by, 110, 80, 10); g.fillStyle = linGrad(g, 0, by, 0, by + 80, ['#fff2a0', '#ffc02a']); g.fill(); g.strokeStyle = '#c8800a'; g.lineWidth = 4; g.stroke(); }
    star(g, vx + 200, vy + 150, 46, '#fff2a0');
    g.save(); g.translate(vx + vw + 10, vy + vh / 2); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 36;
    g.beginPath(); g.ellipse(120, 0, 170, 300, 0, 0, 7); g.fillStyle = linGrad(g, -50, 0, 290, 0, ['#6a6e7a', '#b8bcc8', '#555966']); g.fill(); g.shadowBlur = 0;
    g.beginPath(); g.ellipse(120, 0, 120, 230, 0, 0, 7); g.lineWidth = 12; g.strokeStyle = '#3a3d48'; g.stroke(); circle(g, 110, 0, 54, '#3a3d48');
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; seg(g, [[110 + Math.cos(a) * 20, Math.sin(a) * 20], [110 + Math.cos(a) * 110, Math.sin(a) * 140]], 14, '#9aa0b0'); }
    g.restore();
    heroFull(g, 470, 1045, 175, 'smug', { ...GH, pose: 'hips', dir: 1, rim: c, haloA: 0.25 });
  },
  // 6 SAD, waist-up — an empty party table in gray, only the candle flame is alive: "NO ONE / CAME."
  6(g, t) {
    grayBg(g, t, 'kitchenNight', 306, { veil: 0.4 });
    for (let k = 0; k < 4; k++) { const x = 1000 + k * 250, y = 600; rr(g, x - 60, y, 120, 200, 14); g.fillStyle = '#4a4d58'; g.fill(); rr(g, x - 74, y + 200, 148, 36, 10); g.fillStyle = '#3a3d48'; g.fill(); seg(g, [[x - 54, y + 236], [x - 60, y + 330]], 14, '#3a3d48'); seg(g, [[x + 54, y + 236], [x + 60, y + 330]], 14, '#3a3d48'); poly(g, [[x - 28, y - 70], [x + 28, y - 70], [x, y - 190]], '#8a8e9a'); }
    rr(g, 880, 930, 1100, 190, 20); g.fillStyle = '#5a5d68'; g.fill(); g.fillStyle = '#7a7e8a'; g.fillRect(880, 930, 1100, 16);
    const cx = 1330, by = 935; glow(g, cx, 700, 700, '#ff8a1a', 0.45);
    g.fillStyle = '#cfd2dc'; g.beginPath(); g.ellipse(cx, by, 270, 34, 0, 0, 7); g.fill();
    const tier = (w, y0, h, c1) => { rr(g, cx - w / 2, y0, w, h, 22); g.fillStyle = c1; g.fill(); g.fillStyle = '#eceef4'; g.beginPath(); for (let i = 0; i <= 8; i++) g.arc(cx - w / 2 + 20 + i * ((w - 40) / 8), y0 + 12, 18, Math.PI, 0, true); g.fill(); };
    tier(440, 845, 90, '#9a9eaa'); tier(330, 760, 90, '#b0b4c0'); tier(230, 680, 84, '#9a9eaa');
    seg(g, [[cx, 680], [cx, 610]], 18, '#d8dbe6'); flame(g, cx, 606, 120, 30, '#ff7a1a', '#fff2a0'); star(g, cx, 540, 38, '#fff2a0');
    heroFull(g, 500, 1500, 245, 'sad', { ...GH, pose: 'shrug', dir: 1, rim: '#ffb060', haloA: 0.2 });
  },
  // 7 SHOCKED, full body — gray calendar, only the crosses are red: "NOT ONE / CALL."
  7(g, t) {
    grayBg(g, t, 'kitchen', 307);
    const x = 190, y = 520, w = 700, h = 520;
    rr(g, x, y, w, h, 28); g.fillStyle = '#e4e6ee'; g.fill(); g.save(); rr(g, x, y, w, h, 28); g.clip(); g.fillStyle = '#4a4d58'; g.fillRect(x, y, w, 110); g.restore(); neon(g, x, y, w, h, '#c4c8d4', 28);
    digits(g, 'DAY 365', x + w / 2, y + 82, 78, '#eceef6');
    const cw = (w - 60) / 7, ch = (h - 150) / 5;
    for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) { const gx = x + 30 + k * cw + cw / 2, gy = y + 130 + r * ch + ch / 2; text(g, String(r * 7 + k + 1), gx, gy + 10, { size: 38, color: '#8a8e9a', font: FONTS.ui, weight: 800 }); g.save(); g.shadowColor = '#ff2a1a'; g.shadowBlur = 16; seg(g, [[gx - 26, gy - 26], [gx + 26, gy + 26]], 10, '#ff2a1a'); seg(g, [[gx + 26, gy - 26], [gx - 26, gy + 26]], 10, '#ff2a1a'); g.restore(); }
    heroFull(g, 1480, 1040, 180, 'shocked', { ...GH, pose: 'up', dir: -1, haloA: 0.25 });
  },
  // 8 CRAZY, full body — gray world, only the iris (and the crack in his skull) keep colour: "I WENT / BLIND."
  8(g, t) {
    grayBg(g, t, 'bedroom', 308, { veil: 0.4 });
    const ex = 1560, ey = 700, c = '#b45cff';
    glow(g, ex, ey, 600, c, 0.35);
    g.save(); g.beginPath(); g.moveTo(ex - 300, ey); g.quadraticCurveTo(ex, ey - 280, ex + 300, ey); g.quadraticCurveTo(ex, ey + 280, ex - 300, ey); g.closePath(); g.fillStyle = '#e8eaf2'; g.fill(); g.clip();
    circle(g, ex, ey, 150, c); circle(g, ex, ey, 108, '#6a1fd0'); circle(g, ex, ey, 66, '#05030c'); circle(g, ex - 30, ey - 36, 20, alpha('#ffffff', 0.85)); g.restore();
    g.save(); g.shadowColor = c; g.shadowBlur = 30; seg(g, [[ex - 270, ey - 260], [ex + 270, ey + 260]], 34, c); g.restore();
    heroFull(g, 880, 1040, 175, 'crazy', { ...GH, pose: 'shrug', dir: 1, haloA: 0.2 });
  },
  // 9 HEADLESS hoodie — only the red hoodie is visible (the invisible head is a dashed ghost): "A HOODIE / WALKED IN."
  9(g, t) {
    grayBg(g, t, 'street', 309);
    row(g, 91, 15, 40, 1900, 800, 42, ['#8a8e9a', '#777b87'], { phone: '#e8ebf4' });
    row(g, 92, 9, 40, 1900, 940, 62, ['#5a5e6a', '#4a4e5a'], { phone: '#d0d4e0' });
    spot(g, 1240, 660, 620, '#ff3a2a', 0.4);
    heroFull(g, 1240, 1060, 195, 'smug', { pose: 'idle', dir: 1, rim: '#ff7a5a', haloA: 0.4, headless: true, pants: '#3a3d48' });
    row(g, 93, 4, 0, 700, 1170, 100, ['#24262e', '#1c1e26']);
  },
  // 10 SMUG, full body — a gray queue, only the guy who skipped it has colour: "SKIPPED / THE LINE."
  10(g, t) {
    grayBg(g, t, 'cafe', 310);
    for (let k = 0; k < 9; k++) person(g, 140 + k * 125, 960 + (k % 2) * 8, 54 - k * 1.5, G[k % 3], { phone: k % 3 === 0 ? '#d0d4e0' : null, dir: 1 });
    seg(g, [[60, 986], [1230, 986]], 8, '#9aa0b0');
    spot(g, 1560, 700, 640, '#ff3a2a', 0.4);
    heroFull(g, 1560, 1060, 185, 'smug', { pose: 'hips', dir: -1, rim: '#ff7a5a', haloA: 0.4 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-invisible2') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
