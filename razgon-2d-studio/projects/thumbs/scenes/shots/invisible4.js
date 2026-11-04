// invisible4.js — 5 flat pop-poster thumbnails (params.tpl === 'ifv-invisible4'), one strong "why?" object each.
// 1 mirror with no reflection · 2 CCTV frame with only a hoodie · 3 ID card "who are you?" · 4 mom walks past · 5 transparent-checkerboard head.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import { star } from './ifverse.js';
import { heroFull } from './brain10.js';

const HOOD = { hoodie: '#ff2e1f', pants: '#1a2a8a', rim: '#ffb0a0', haloA: 0.2, headless: true, dir: 1 };
const flat = (g, th, cx = 960, cy = 600) => {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, th.bg); g.fillRect(0, 0, E.W, E.H);
  g.save(); g.globalCompositeOperation = th.rayOp || 'source-over';
  for (let i = 0; i < 40; i += 2) { const a0 = i / 40 * Math.PI * 2, a1 = (i + 1) / 40 * Math.PI * 2; g.fillStyle = th.ray; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a0) * 2800, cy + Math.sin(a0) * 2800); g.lineTo(cx + Math.cos(a1) * 2800, cy + Math.sin(a1) * 2800); g.fill(); }
  g.restore();
  for (let y = 20; y < E.H; y += 36) for (let x = ((y / 36) % 2) * 18 + 10; x < E.W; x += 36) { g.fillStyle = `rgba(${th.dot},${0.06 + 0.08 * (1 - y / E.H)})`; g.beginPath(); g.arc(x, y, 5 + 4 * (1 - y / E.H), 0, 7); g.fill(); }
};
const sticker = (g, x, y, s, c, line = '#14102a') => { // faceless silhouette with a dark outline; (x, y) = bottom centre
  g.save(); g.lineJoin = 'round'; g.lineWidth = Math.max(4, s * 0.16); g.strokeStyle = line;
  g.beginPath(); g.moveTo(x - s * 1.3, y); g.lineTo(x - s * 1.2, y - s * 2.2); g.quadraticCurveTo(x - s * 1.1, y - s * 2.95, x, y - s * 3); g.quadraticCurveTo(x + s * 1.1, y - s * 2.95, x + s * 1.2, y - s * 2.2); g.lineTo(x + s * 1.3, y); g.closePath(); g.stroke(); g.fillStyle = c; g.fill();
  g.beginPath(); g.arc(x, y - s * 3.75, s * 0.95, 0, 7); g.stroke(); g.fillStyle = shade(c, 0.08); g.fill(); g.restore(); };
const outlined = (g, drawPath, fill, line = '#14102a', w = 8) => { drawPath(); g.lineWidth = w; g.lineJoin = 'round'; g.strokeStyle = line; g.stroke(); g.fillStyle = fill; g.fill(); };

const V = {
  // 1 — mirror that shows only the empty room
  1(g, t) {
    flat(g, { bg: ['#ff2d95', '#8a1fd8'], ray: 'rgba(255,255,255,0.2)', dot: '255,255,255' }, 1460, 560);
    const mx = 1150, my = 120, mw = 640, mh = 900;
    g.save(); g.shadowColor = 'rgba(40,0,60,.55)'; g.shadowBlur = 50; outlined(g, () => { rr(g, mx - 36, my - 36, mw + 72, mh + 72, 56); }, '#ffffff', '#2a0a3a', 9); g.restore();
    g.save(); rr(g, mx, my, mw, mh, 30); g.clip();
    g.fillStyle = '#dfe2ec'; g.fillRect(mx, my, mw, mh); g.fillStyle = '#aab0c4'; g.fillRect(mx, my + mh * 0.72, mw, mh * 0.28);
    g.fillStyle = '#f7f9ff'; rr(g, mx + 70, my + 110, 250, 330, 10); g.fill(); g.strokeStyle = '#9aa0b4'; g.lineWidth = 10; g.stroke(); seg(g, [[mx + 195, my + 110], [mx + 195, my + 440]], 8, '#9aa0b4'); seg(g, [[mx + 70, my + 275], [mx + 320, my + 275]], 8, '#9aa0b4');
    seg(g, [[mx + 520, my + mh * 0.72], [mx + 520, my + 330]], 12, '#8a90a4'); poly(g, [[mx + 450, my + 330], [mx + 590, my + 330], [mx + 560, my + 230], [mx + 480, my + 230]], '#c8ccda');
    g.fillStyle = '#8a90a4'; g.fillRect(mx + 430, my + mh * 0.72 - 8, 180, 16);
    g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(255,255,255,${0.30 - i * 0.08})`; g.beginPath(); g.moveTo(mx + 40 + i * 170, my); g.lineTo(mx + 150 + i * 170, my); g.lineTo(mx - 120 + i * 170, my + mh); g.lineTo(mx - 230 + i * 170, my + mh); g.fill(); } g.restore();
    star(g, mx + mw - 40, my + 50, 44, '#ffffff');
    heroFull(g, 700, 1345, 210, 'smug', { ...HOOD, pose: 'point' });
  },
  // 2 — a CCTV monitor where only the hoodie shows up
  2(g, t) {
    g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#06302c', '#010807']); g.fillRect(0, 0, E.W, E.H); glow(g, 1080, 760, 1000, '#39ff88', 0.28);
    const x = 330, y = 450, w = 1500, h = 610;
    g.save(); g.shadowColor = '#39ff88'; g.shadowBlur = 50; outlined(g, () => { rr(g, x - 20, y - 20, w + 40, h + 40, 34); }, '#0b1412', '#39ff88', 10); g.restore();
    g.save(); rr(g, x, y, w, h, 22); g.clip();
    g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#3a4c4a', '#15201f']); g.fillRect(x, y, w, h);
    poly(g, [[x, y + h], [x + 380, y + h * 0.55], [x + w - 380, y + h * 0.55], [x + w, y + h]], '#26302f'); for (let i = 0; i <= 8; i++) seg(g, [[x + w / 2 + (i - 4) * 70, y + h * 0.55], [x + w / 2 + (i - 4) * 260, y + h]], 3, 'rgba(255,255,255,.08)');
    rr(g, x + w / 2 - 150, y + 90, 300, y + h * 0.55 - y - 90, 8); g.fillStyle = '#10181a'; g.fill(); g.fillStyle = '#d8ffe8'; g.globalAlpha = 0.5; g.fillRect(x + w / 2 - 360, y + 20, 720, 14); g.globalAlpha = 1;
    g.fillStyle = 'rgba(57,255,136,.10)'; g.fillRect(x, y, w, h);
    heroFull(g, 1080, 1040, 132, 'smug', { ...HOOD, pose: 'idle', haloA: 0.3 });
    for (let yy = y; yy < y + h; yy += 6) { g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x, yy, w, 2); }
    g.restore();
    g.strokeStyle = '#39ff88'; g.lineWidth = 8; g.lineCap = 'round'; for (const [sx, sy] of [[x + 30, y + 30], [x + w - 30, y + 30], [x + 30, y + h - 30], [x + w - 30, y + h - 30]]) { const dx = sx < x + w / 2 ? 1 : -1, dy = sy < y + h / 2 ? 1 : -1; g.beginPath(); g.moveTo(sx, sy + dy * 50); g.lineTo(sx, sy); g.lineTo(sx + dx * 50, sy); g.stroke(); }
    circle(g, x + 90, y + 74, 16, '#ff2a2a'); glow(g, x + 90, y + 74, 60, '#ff2a2a', 0.9); text(g, 'REC', x + 160, y + 90, { size: 44, color: '#ffffff', font: FONTS.ui, weight: 900 });
    text(g, '03:17 AM', x + w - 190, y + 90, { size: 44, color: '#d8ffe8', font: FONTS.ui, weight: 900 });
  },
  // 3 — an ID card with a blank photo
  3(g, t) {
    flat(g, { bg: ['#12d0ff', '#0a5ae0'], ray: 'rgba(255,255,255,0.22)', dot: '255,255,255' }, 1380, 700);
    g.save(); g.translate(1390, 720); g.rotate(-0.07); g.shadowColor = 'rgba(0,20,80,.55)'; g.shadowBlur = 50;
    outlined(g, () => { rr(g, -450, -290, 900, 580, 44); }, '#ffffff', '#0a1a4a', 9); g.shadowBlur = 0;
    g.save(); rr(g, -450, -290, 900, 580, 44); g.clip(); g.fillStyle = '#1a3aff'; g.fillRect(-450, -290, 900, 120); g.restore();
    text(g, 'IDENTITY CARD', 0, -205, { size: 64, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 4 });
    rr(g, -405, -140, 290, 350, 14); g.fillStyle = '#e4e8f4'; g.fill(); g.save(); g.setLineDash([16, 12]); g.lineWidth = 7; g.strokeStyle = '#6a7290'; g.stroke(); g.restore();
    text(g, '?', -260, 120, { size: 300, color: '#8a92ae', font: FONTS.ui, weight: 900 });
    text(g, 'NAME  ? ? ?', 120, -80, { size: 56, color: '#14102a', font: FONTS.ui, weight: 900 });
    for (let i = 0; i < 3; i++) rr(g, -60, -30 + i * 62, 440 - i * 90, 30, 15), g.fillStyle = '#c8cee0', g.fill();
    for (let i = 0; i < 28; i++) g.fillStyle = '#14102a', g.fillRect(-60 + i * 14.5, 200, 5 + (i % 3) * 3, 60);
    g.restore();
    star(g, 1830, 380, 46, '#ffffff');
    heroFull(g, 560, 1370, 205, 'smug', { ...HOOD, pose: 'point' });
  },
  // 4 — mom walks past the invisible kid
  4(g, t) {
    flat(g, { bg: ['#ffa51a', '#ff4a1a'], ray: 'rgba(255,255,255,0.26)', dot: '255,255,255' }, 1300, 640);
    const mx = 1560, my = 1180, s = 165;
    g.save(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineCap = 'round'; for (let i = 0; i < 7; i++) { g.lineWidth = 10 + (i % 2) * 6; g.beginPath(); g.moveTo(mx + 330 + i * 26, 560 + i * 80); g.lineTo(mx + 620, 560 + i * 80); g.stroke(); } g.restore();
    sticker(g, mx, my, s, '#9aa0b4');
    outlined(g, () => { g.beginPath(); g.arc(mx + s * 0.1, my - s * 3.75 - s * 1.2, s * 0.55, 0, 7); }, '#8a90a4', '#14102a', 12);
    sticker(g, mx, my, s, '#9aa0b4'); // head again over the bun
    outlined(g, () => { g.beginPath(); g.moveTo(mx - s * 0.85, my); g.lineTo(mx - s * 0.7, my - s * 1.7); g.lineTo(mx + s * 0.7, my - s * 1.7); g.lineTo(mx + s * 0.85, my); g.closePath(); }, '#fff4e0', '#14102a', 10);
    seg(g, [[mx - s * 0.7, my - s * 1.7], [mx - s * 0.5, my - s * 2.75]], 10, '#14102a'); seg(g, [[mx + s * 0.7, my - s * 1.7], [mx + s * 0.5, my - s * 2.75]], 10, '#14102a'); outlined(g, () => { rr(g, mx - s * 0.4, my - s * 1.2, s * 0.8, s * 0.55, 10); }, '#ffe3b8', '#14102a', 8);
    heroFull(g, 780, 1360, 205, 'smug', { ...HOOD, pose: 'wave' });
  },
  // 5 — head replaced by the Photoshop "transparent" checkerboard
  5(g, t) {
    flat(g, { bg: ['#8a2bff', '#2a0a9a'], ray: 'rgba(255,255,255,0.14)', dot: '255,255,255' }, 1440, 540);
    const hx = 1440, hy = 540, R = 310;
    heroFull(g, hx, hy + R * 3.48, R, 'smug', { ...HOOD, pose: 'idle', haloA: 0.25 });
    g.save(); g.beginPath(); g.arc(hx, hy, R, 0, 7); g.clip(); const c = 44;
    for (let j = 0; j * c < R * 2 + c; j++) for (let i = 0; i * c < R * 2 + c; i++) { g.fillStyle = (i + j) % 2 ? '#c9c9d4' : '#ffffff'; g.fillRect(hx - R + i * c, hy - R + j * c, c, c); }
    g.fillStyle = radGrad(g, hx, hy, R * 0.5, R * 1.05, ['rgba(40,0,90,0)', 'rgba(40,0,90,.35)']); g.fillRect(hx - R, hy - R, R * 2, R * 2); g.restore();
    g.save(); g.setLineDash([22, 16]); g.lineWidth = 8; g.strokeStyle = '#ffffff'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 12; g.strokeRect(hx - R - 14, hy - R - 14, R * 2 + 28, R * 2 + 28); g.restore();
    for (const [px, py] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) { const x = hx + px * (R + 14), y = hy + py * (R + 14); g.fillStyle = '#ffffff'; g.fillRect(x - 15, y - 15, 30, 30); g.lineWidth = 5; g.strokeStyle = '#14102a'; g.strokeRect(x - 15, y - 15, 30, 30); }
  },
};
for (const s of E.shots) if (s.params?.tpl === 'ifv-invisible4') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
