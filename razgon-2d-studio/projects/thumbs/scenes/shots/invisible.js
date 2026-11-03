// invisible.js — 10 Ifverse-style "why?" thumbnails for «What If You Turned Invisible and Nobody Noticed?» (params.tpl === 'ifv-invisible').
// Same look as brain10.js: black-headed hoodie hero (close-up / waist-up / full body), one big glowing prop, saturated colour wash.
// Text (English) is added later by story/text2.py via story/invisible_text.sh.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, hero } from './ifverse.js';
import { heroFull } from './brain10.js';

const digits = (g, s, x, y, size, c) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, glow: 36, glowColor: c });
const neon = (g, x, y, w, h, c, rad = 30) => { g.save(); g.shadowColor = c; g.shadowBlur = 36; rr(g, x, y, w, h, rad); g.lineWidth = 7; g.strokeStyle = alpha(shade(c, 0.3), 0.95); g.stroke(); g.restore(); };
const flame = (g, x, y, h, w, c1, c2) => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y - h * 0.4, h * 0.9, c1, 0.5); g.fillStyle = linGrad(g, 0, y - h, 0, y, [alpha(c2, 0.95), alpha(c1, 0.95)]); g.beginPath(); g.moveTo(x - w, y); g.bezierCurveTo(x - w * 1.1, y - h * 0.5, x - w * 0.2, y - h * 0.6, x, y - h); g.bezierCurveTo(x + w * 0.3, y - h * 0.55, x + w * 1.1, y - h * 0.5, x + w, y); g.closePath(); g.fill(); g.restore(); };
const bg = (g, t, set, c1, c2, seed, cols, z = 1.25, veil = 0.3, v = 0.55) => {
  bgBlur(g, t, set, {}, { z, blur: 8, veil, y: -110 });
  wash(g, c1, c2, 0.8); bokeh(g, seed, 24, cols); vign(g, v);
};

const V = {
  // 1 SMUG, full body right — he stands in front of a mirror that shows only the empty room: "EMPTY / MIRROR."
  1(g, t) {
    bg(g, t, 'bedroom', '#1a3aff', '#3a0a8a', 201, ['#5fa8ff', '#5fd8ff', '#ff5ad8']);
    const mx = 380, my = 480, mw = 520, mh = 520, c = '#5fd8ff';
    glow(g, mx + mw / 2, my + mh / 2, 560, c, 0.5);
    rr(g, mx - 26, my - 26, mw + 52, mh + 52, 40); g.fillStyle = '#1a1230'; g.fill(); neon(g, mx - 26, my - 26, mw + 52, mh + 52, c, 40);
    g.save(); rr(g, mx, my, mw, mh, 18); g.clip();
    g.fillStyle = linGrad(g, 0, my, 0, my + mh, ['#9fd8ff', '#3a6aff', '#1a2a8a']); g.fillRect(mx, my, mw, mh);
    g.fillStyle = alpha('#ffffff', 0.85); rr(g, mx + 300, my + 60, 150, 190, 8); g.fill(); g.fillStyle = alpha('#3a6aff', 0.5); g.fillRect(mx + 372, my + 60, 6, 190); g.fillRect(mx + 300, my + 150, 150, 6);
    g.fillStyle = '#12123a'; g.fillRect(mx, my + mh - 120, mw, 120);
    g.fillStyle = '#ffcf6a'; circle(g, mx + 110, my + 140, 38, '#ffcf6a'); glow(g, mx + 110, my + 140, 180, '#ffcf6a', 0.6);
    g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { g.fillStyle = alpha('#ffffff', 0.16 - i * 0.04); g.beginPath(); g.moveTo(mx + 40 + i * 120, my); g.lineTo(mx + 120 + i * 120, my); g.lineTo(mx - 60 + i * 120, my + mh); g.lineTo(mx - 140 + i * 120, my + mh); g.fill(); }
    g.restore();
    star(g, mx + mw - 30, my + 40, 40, '#e8fbff');
    motes(g, 13, 24, '#bfeaff', [0, 0, 1920, 1080]);
    heroFull(g, 1400, 1040, 185, 'smug', { pose: 'hips', dir: -1, rim: c, haloA: 0.3 });
  },
  // 2 SHOCKED, big bust right — the phone's Face ID can't find him: "LOCKED / OUT."
  2(g, t) {
    bg(g, t, 'streetDusk', '#ff2ad8', '#3a0a6a', 202, ['#ff5ad8', '#8a6aff', '#5fd8ff'], 1.3, 0.35);
    const px = 330, py = 500, pw = 360, ph = 540, c = '#ff6ad8';
    g.save(); g.translate(px + pw / 2, py + ph / 2); g.rotate(-0.07); glow(g, 0, 0, 560, c, 0.55);
    rr(g, -pw / 2 - 20, -ph / 2 - 20, pw + 40, ph + 40, 56); g.fillStyle = '#14101c'; g.fill(); neon(g, -pw / 2 - 20, -ph / 2 - 20, pw + 40, ph + 40, c, 56);
    rr(g, -pw / 2, -ph / 2, pw, ph, 38); g.fillStyle = linGrad(g, 0, -ph / 2, 0, ph / 2, ['#2a0a4a', '#0a0414']); g.fill();
    g.strokeStyle = '#ff6ad8'; g.lineWidth = 12; g.lineCap = 'round'; g.shadowColor = '#ff6ad8'; g.shadowBlur = 28;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(sx * 140, sy * 90 - sy * 60); g.lineTo(sx * 140, sy * 90); g.lineTo(sx * 140 - sx * 60, sy * 90); g.stroke(); }
    g.shadowBlur = 0; g.strokeStyle = alpha('#ff6ad8', 0.25); g.setLineDash([14, 16]); g.beginPath(); g.ellipse(0, -30, 95, 120, 0, 0, 7); g.stroke(); g.setLineDash([]);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ff9af0', 0.35); g.fillRect(-160, -40, 320, 14); g.restore();
    digits(g, 'NO FACE', 0, 205, 78, '#ff4ad8');
    g.restore();
    motes(g, 23, 24, '#ffd0f0');
    hero(g, 1400, 610, 330, 'shocked', { rim: '#ff6ad8', haloA: 0.4, dir: -1 });
  },
  // 3 SAD, full body left — a huge $0 price tag: everything is free, but nobody is there: "EVERYTHING / FREE."
  3(g, t) {
    bg(g, t, 'market', '#ff9a1a', '#c8280a', 203, ['#ffb04a', '#ff6a2a', '#ffe08a'], 1.25, 0.28, 0.55);
    const cx = 1260, cy = 760, c = '#ffcf3a';
    g.save(); g.translate(cx, cy); g.rotate(-0.16); glow(g, 0, 0, 640, c, 0.55);
    g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40;
    g.beginPath(); g.moveTo(-330, -120); g.lineTo(-210, -230); g.lineTo(330, -230); g.quadraticCurveTo(370, -230, 370, -190); g.lineTo(370, 190); g.quadraticCurveTo(370, 230, 330, 230); g.lineTo(-210, 230); g.lineTo(-330, 120); g.closePath();
    g.fillStyle = linGrad(g, -330, -230, 370, 230, ['#fff2a0', '#ffcf3a', '#ff9a1a']); g.fill(); g.shadowBlur = 0;
    circle(g, -240, 0, 34, '#3a1a0a'); circle(g, -240, 0, 20, '#ffb04a');
    digits(g, '$0', 70, 100, 330, '#e8321a');
    g.restore();
    star(g, cx + 360, cy - 250, 50, '#fff2a0'); star(g, cx - 330, cy + 250, 34, '#fff2a0');
    motes(g, 33, 26, '#ffd08a', [800, 100, 1100, 900]);
    heroFull(g, 460, 1045, 175, 'sad', { pose: 'idle', dir: 1, rim: '#ffb04a', haloA: 0.3 });
  },
  // 4 ANGRY, big bust left — one camera still sees him: "ONE CAMERA / SAW ME."
  4(g, t) {
    bg(g, t, 'lab', '#ff2a1a', '#4a0a2a', 204, ['#ff5a2a', '#ffb02a', '#ff2a8a'], 1.3, 0.35);
    const lx = 1180, ly = 690, c = '#ff3a2a';
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radGrad(g, lx, ly, 20, 700, [alpha('#ff5a3a', 0.55), alpha('#ff3a2a', 0)]); g.beginPath(); g.moveTo(lx, ly - 30); g.lineTo(lx - 700, ly - 330); g.lineTo(lx - 700, ly + 330); g.lineTo(lx, ly + 30); g.fill(); g.restore();
    seg(g, [[1880, 560], [1620, 600]], 40, '#2a2430'); rr(g, 1830, 380, 70, 360, 10); g.fillStyle = '#2a2430'; g.fill();
    g.save(); g.translate(1450, 700); g.rotate(0.12); glow(g, -140, 0, 520, c, 0.45);
    g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 36; rr(g, -270, -110, 540, 220, 44); g.fillStyle = linGrad(g, 0, -110, 0, 110, ['#f1eef6', '#b8b2c8']); g.fill(); g.shadowBlur = 0;
    rr(g, -280, -118, 130, 236, 50); g.fillStyle = '#2a2430'; g.fill(); circle(g, -228, 0, 72, '#07050a'); circle(g, -228, 0, 52, '#1a1030'); glow(g, -228, 0, 70, '#ff5a8a', 0.5);
    circle(g, -246, -18, 14, alpha('#ffffff', 0.8));
    g.fillStyle = '#e8321a'; rr(g, 120, -86, 120, 56, 14); g.fill(); circle(g, 148, -58, 11, '#fff'); glow(g, 148, -58, 70, '#ff3a2a', 0.9);
    text(g, 'REC', 202, -46, { size: 34, color: '#ffffff', font: FONTS.ui, weight: 900 });
    g.restore();
    motes(g, 44, 40, '#ffcf6a', [300, 400, 1500, 600]);
    hero(g, 520, 640, 300, 'angry', { rim: '#ff8a3a', haloA: 0.4, dir: 1 });
  },
  // 5 SHOCKED, full body right, arms up — calendar with every day crossed off and not one call: "NOT ONE / CALL."
  5(g, t) {
    bg(g, t, 'kitchen', '#0a4aff', '#0a1a6a', 205, ['#3fa8ff', '#5fffd8', '#8a6aff'], 1.25, 0.3);
    const x = 190, y = 520, w = 700, h = 520, c = '#5fd8ff';
    glow(g, x + w / 2, y + h / 2, 640, c, 0.45);
    rr(g, x, y, w, h, 28); g.fillStyle = '#f4f1ea'; g.fill();
    g.save(); rr(g, x, y, w, h, 28); g.clip(); g.fillStyle = '#e8321a'; g.fillRect(x, y, w, 110); g.restore();
    neon(g, x, y, w, h, c, 28);
    digits(g, 'DAY 365', x + w / 2, y + 82, 78, '#ffffff');
    const cw = (w - 60) / 7, ch = (h - 150) / 5;
    for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) { const gx = x + 30 + k * cw + cw / 2, gy = y + 130 + r * ch + ch / 2; text(g, String(r * 7 + k + 1), gx, gy + 10, { size: 38, color: '#6a6a7a', font: FONTS.ui, weight: 800 }); seg(g, [[gx - 24, gy - 24], [gx + 24, gy + 24]], 8, alpha('#e8321a', 0.95)); seg(g, [[gx + 24, gy - 24], [gx - 24, gy + 24]], 8, alpha('#e8321a', 0.95)); }
    star(g, x + w - 10, y + 10, 40, '#e8fbff');
    motes(g, 55, 26, '#bfeaff', [100, 100, 1700, 800]);
    heroFull(g, 1480, 1040, 180, 'shocked', { pose: 'up', dir: -1, rim: c, haloA: 0.3 });
  },
  // 6 CRAZY, full body centre, shrug — a giant dead eye: invisible eyes can't catch light, so he's blind: "I WENT / BLIND."
  6(g, t) {
    bg(g, t, 'bedroom', '#4a2aff', '#0a0a3a', 206, ['#8a6aff', '#5fa8ff', '#ff3a8a'], 1.2, 0.35);
    const ex = 1560, ey = 700, c = '#8a6aff';
    glow(g, ex, ey, 620, c, 0.5);
    g.save(); g.shadowColor = c; g.shadowBlur = 40; g.beginPath(); g.moveTo(ex - 300, ey); g.quadraticCurveTo(ex, ey - 280, ex + 300, ey); g.quadraticCurveTo(ex, ey + 280, ex - 300, ey); g.closePath(); g.fillStyle = '#f4f1ff'; g.fill(); g.restore();
    g.save(); g.beginPath(); g.moveTo(ex - 300, ey); g.quadraticCurveTo(ex, ey - 280, ex + 300, ey); g.quadraticCurveTo(ex, ey + 280, ex - 300, ey); g.closePath(); g.clip();
    circle(g, ex, ey, 150, '#6a3aff'); circle(g, ex, ey, 110, '#2a0a8a'); circle(g, ex, ey, 70, '#05030c'); circle(g, ex - 30, ey - 36, 20, alpha('#ffffff', 0.8));
    g.restore();
    g.save(); g.shadowColor = '#ff2a4a'; g.shadowBlur = 30; seg(g, [[ex - 270, ey - 260], [ex + 270, ey + 260]], 34, '#ff2a4a'); g.restore();
    motes(g, 66, 30, '#b8c8ff');
    heroFull(g, 880, 1040, 175, 'crazy', { pose: 'shrug', dir: 1, rim: c, haloA: 0.35 });
  },
  // 7 ANGRY, full body left, pointing — a car that doesn't brake for a person it can't see: "NEARLY / HIT."
  7(g, t) {
    bg(g, t, 'street', '#12d86a', '#0a2a3a', 207, ['#6affb0', '#5fd8ff', '#ffffff'], 1.25, 0.35, 0.6);
    const cx = 1500, c = '#e8ffb0';
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const hx of [cx - 190, cx + 190]) { g.fillStyle = radGrad(g, hx, 780, 10, 520, [alpha(c, 0.55), alpha(c, 0)]); g.beginPath(); g.moveTo(hx, 760); g.lineTo(hx - 700, 560); g.lineTo(hx - 700, 1060); g.lineTo(hx, 800); g.fill(); }
    g.restore();
    glow(g, cx, 760, 620, '#8affc0', 0.35);
    g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40;
    rr(g, cx - 330, 640, 660, 300, 60); g.fillStyle = linGrad(g, 0, 640, 0, 940, ['#e8321a', '#8a0a1a']); g.fill(); g.restore();
    g.beginPath(); g.moveTo(cx - 250, 650); g.lineTo(cx - 190, 530); g.quadraticCurveTo(cx, 500, cx + 190, 530); g.lineTo(cx + 250, 650); g.closePath(); g.fillStyle = linGrad(g, 0, 520, 0, 650, ['#2a3a5a', '#12182a']); g.fill();
    rr(g, cx - 140, 800, 280, 90, 18); g.fillStyle = '#12101a'; g.fill(); for (let i = 0; i < 6; i++) seg(g, [[cx - 120 + i * 48, 812], [cx - 120 + i * 48, 880]], 8, '#3a3444');
    for (const hx of [cx - 230, cx + 230]) { circle(g, hx, 740, 62, '#12101a'); circle(g, hx, 740, 48, '#ffffff'); glow(g, hx, 740, 120, c, 0.9); }
    for (const hx of [cx - 250, cx + 250]) { circle(g, hx, 950, 66, '#0a080c'); circle(g, hx, 950, 34, '#6a6a7a'); }
    star(g, cx - 230, 740, 40, '#ffffff');
    motes(g, 77, 24, '#c8ffe8');
    const h = heroFull(g, 430, 1045, 180, 'angry', { pose: 'point', dir: 1, rim: '#6affb0', haloA: 0.35 });
  },
  // 8 SAD, waist-up left — a birthday cake with one candle and nobody there: "NO ONE / CAME."
  8(g, t) {
    bg(g, t, 'cafe', '#ff3a5a', '#3a0a3a', 208, ['#ff6a8a', '#ffb04a', '#8a6aff'], 1.3, 0.3);
    const cx = 1290, by = 1030, c = '#ff8ab0';
    glow(g, cx, by - 200, 640, '#ff9a5a', 0.5);
    g.fillStyle = '#e8e4f0'; g.beginPath(); g.ellipse(cx, by + 4, 360, 46, 0, 0, 7); g.fill();
    const tier = (w, y0, h, c1, c2) => { rr(g, cx - w / 2, y0, w, h, 26); g.fillStyle = linGrad(g, 0, y0, 0, y0 + h, [c1, c2]); g.fill(); g.fillStyle = '#fff6ee'; g.beginPath(); for (let i = 0; i <= 10; i++) g.arc(cx - w / 2 + 24 + i * ((w - 48) / 10), y0 + 14, 22, Math.PI, 0, true); g.fill(); };
    tier(560, 920, 110, '#ff7aa8', '#d83a78'); tier(420, 810, 110, '#ffb0c8', '#ff6a98'); tier(300, 710, 100, '#ff7aa8', '#d83a78');
    seg(g, [[cx, 710], [cx, 620]], 22, '#6ad8ff'); seg(g, [[cx - 6, 700], [cx - 6, 630]], 5, '#ffffff');
    flame(g, cx, 616, 100, 26, '#ff8a1a', '#fff2a0'); star(g, cx, 560, 36, '#fff2a0');
    motes(g, 88, 26, '#ffd0f0', [900, 300, 800, 800]);
    heroFull(g, 520, 1500, 245, 'sad', { pose: 'shrug', dir: 1, rim: '#ff6ab0', haloA: 0.3 });
  },
  // 9 CRAZY, waist-up right, hands on head — screamed through a megaphone and nobody turned: "NO ONE / TURNED."
  9(g, t) {
    bg(g, t, 'hall', '#1ac8ff', '#0a1a5a', 209, ['#5fe8ff', '#5fa8ff', '#ffffff'], 1.25, 0.35);
    const c = '#ffd04a';
    glow(g, 520, 760, 560, '#5fe8ff', 0.4);
    g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30;
    poly(g, [[250, 700], [660, 590], [660, 930], [250, 820]], '#ffb01a'); g.restore();
    poly(g, [[250, 700], [330, 678], [330, 842], [250, 820]], '#e8321a'); poly(g, [[520, 630], [580, 614], [580, 906], [520, 890]], '#ffffff');
    g.save(); g.shadowColor = c; g.shadowBlur = 30; g.beginPath(); g.ellipse(700, 760, 70, 190, 0, 0, 7); g.fillStyle = '#e8321a'; g.fill(); g.lineWidth = 12; g.strokeStyle = '#ffd04a'; g.stroke(); g.restore();
    g.beginPath(); g.ellipse(706, 760, 36, 120, 0, 0, 7); g.fillStyle = '#12080c'; g.fill();
    rr(g, 360, 800, 80, 190, 18); g.fillStyle = '#2a2430'; g.fill();
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#ffe08a', 0.85 - i * 0.18); g.lineWidth = 18 - i * 3; g.beginPath(); g.arc(740, 760, 140 + i * 85, -0.62, 0.62); g.stroke(); } g.restore();
    motes(g, 99, 30, '#b8f4ff');
    heroFull(g, 1460, 1460, 240, 'crazy', { pose: 'head', dir: -1, rim: '#5fe8ff', haloA: 0.35 });
  },
  // 10 SMUG, full body left, hands on hips — an open bank vault, no alarm: "I ENTERED / THE VAULT."
  10(g, t) {
    bg(g, t, 'hall', '#8a1aff', '#2a0a5a', 210, ['#ffd02a', '#ff5ad8', '#8a6aff'], 1.25, 0.3);
    const vx = 1000, vy = 520, vw = 560, vh = 540, c = '#ffcf3a';
    glow(g, vx + vw / 2, vy + vh / 2, 660, c, 0.55);
    rr(g, vx - 20, vy - 20, vw + 40, vh + 40, 50); g.fillStyle = '#2a2638'; g.fill(); neon(g, vx - 20, vy - 20, vw + 40, vh + 40, c, 50);
    rr(g, vx, vy, vw, vh, 34); g.fillStyle = linGrad(g, 0, vy, 0, vy + vh, ['#ffe08a', '#a8620a']); g.fill();
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4 - (r % 2); k++) { const bx = vx + 50 + k * 125 + (r % 2) * 62, byy = vy + vh - 110 - r * 100; rr(g, bx, byy, 110, 80, 10); g.fillStyle = linGrad(g, 0, byy, 0, byy + 80, ['#fff2a0', '#ffc02a']); g.fill(); g.strokeStyle = '#c8800a'; g.lineWidth = 4; g.stroke(); }
    star(g, vx + 200, vy + 70, 50, '#ffffff'); star(g, vx + 430, vy + 150, 34, '#fff2a0');
    g.save(); g.translate(vx + vw + 10, vy + vh / 2); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 36;
    g.beginPath(); g.ellipse(120, 0, 170, 300, 0, 0, 7); g.fillStyle = linGrad(g, -50, 0, 290, 0, ['#8a90a8', '#d8dcec', '#6a7088']); g.fill(); g.shadowBlur = 0;
    g.beginPath(); g.ellipse(120, 0, 120, 230, 0, 0, 7); g.lineWidth = 12; g.strokeStyle = '#4a5068'; g.stroke();
    circle(g, 110, 0, 54, '#4a5068'); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; seg(g, [[110 + Math.cos(a) * 20, Math.sin(a) * 20], [110 + Math.cos(a) * 110, Math.sin(a) * 140]], 14, '#c8ccdc'); }
    g.restore();
    motes(g, 110, 28, '#fff2a0', [800, 300, 1000, 700]);
    heroFull(g, 470, 1045, 175, 'smug', { pose: 'hips', dir: 1, rim: c, haloA: 0.3 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-invisible') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
