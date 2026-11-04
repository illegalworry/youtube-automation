// invisible3.js — polished + re-acted versions of the two favourite grayscale thumbs (params.tpl === 'ifv-invisible3').
// 1 = vault (hero SHOCKED, arms up), 2 = birthday cake (hero ANGRY, pointing at the empty table).
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad } from '/engine/core.js';
import { star, motes } from './ifverse.js';
import { heroFull } from './brain10.js';
import { GH, grayBg, flame, neon, spot } from './invisible2.js';

const V = {
  1(g, t) {
    grayBg(g, t, 'hall', 401, { vig: 0.68 });
    const vx = 880, vy = 500, vw = 660, vh = 560, c = '#ffcf3a';
    // light rays pouring out of the vault
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { g.fillStyle = radGrad(g, vx + 200, vy + 380, 10, 900, [alpha(c, 0.22 - i * 0.03), alpha(c, 0)]); g.beginPath(); g.moveTo(vx + 200, vy + 380); g.lineTo(vx - 700, vy + 60 - i * 170); g.lineTo(vx - 700, vy + 160 - i * 170 + 120); g.fill(); }
    g.restore();
    glow(g, vx + vw / 2, vy + vh / 2, 800, c, 0.5);
    rr(g, vx - 22, vy - 22, vw + 44, vh + 44, 52); g.fillStyle = '#2c2e38'; g.fill(); neon(g, vx - 22, vy - 22, vw + 44, vh + 44, '#aab0c0', 52);
    rr(g, vx, vy, vw, vh, 36); g.fillStyle = linGrad(g, 0, vy, 0, vy + vh, ['#3a2a08', '#120c02']); g.fill();
    glow(g, vx + vw / 2, vy + vh * 0.8, 520, '#fff2a0', 0.55);
    // ingot pyramid
    const ing = (x, y, w, h) => { g.save(); g.shadowColor = '#ffcf3a'; g.shadowBlur = 24; g.beginPath(); g.moveTo(x + w * 0.1, y); g.lineTo(x + w * 0.9, y); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#fff6b0', '#ffc61a', '#d98a0a']); g.fill(); g.restore(); g.fillStyle = alpha('#ffffff', 0.55); g.fillRect(x + w * 0.18, y + h * 0.14, w * 0.5, h * 0.12); };
    const bw = 120, bh = 70;
    for (let r = 0; r < 5; r++) for (let k = 0; k < 5 - r; k++) ing(vx + vw / 2 - (5 - r) * (bw + 8) / 2 + k * (bw + 8) + 4, vy + vh - 40 - (r + 1) * (bh + 6), bw, bh);
    star(g, vx + vw / 2, vy + vh - 40 - 5 * (bh + 6) - 10, 70, '#fff6b0'); star(g, vx + 90, vy + 150, 40, '#fff2a0'); star(g, vx + vw - 80, vy + 240, 34, '#fff2a0');
    // open round door
    g.save(); g.translate(vx + vw + 10, vy + vh / 2); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40;
    g.beginPath(); g.ellipse(130, 0, 180, 310, 0, 0, 7); g.fillStyle = linGrad(g, -50, 0, 310, 0, ['#6a6e7a', '#c8ccd8', '#555966']); g.fill(); g.shadowBlur = 0;
    g.beginPath(); g.ellipse(130, 0, 128, 240, 0, 0, 7); g.lineWidth = 12; g.strokeStyle = '#3a3d48'; g.stroke(); circle(g, 120, 0, 56, '#3a3d48');
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; seg(g, [[120 + Math.cos(a) * 20, Math.sin(a) * 20], [120 + Math.cos(a) * 116, Math.sin(a) * 150]], 14, '#aab0c0'); }
    g.restore();
    // spilled gold coins in front
    const r = rng(41); for (let i = 0; i < 26; i++) { const x = vx - 120 + r() * 520, y = 1010 + r() * 50, s = 22 + r() * 12; glow(g, x, y, s * 2.4, c, 0.5); g.fillStyle = linGrad(g, 0, y - s, 0, y + s, ['#fff2a0', '#e8a010']); g.beginPath(); g.ellipse(x, y, s, s * 0.5, r() * 0.6, 0, 7); g.fill(); g.strokeStyle = '#a8680a'; g.lineWidth = 3; g.stroke(); }
    motes(g, 42, 24, '#fff2a0', [300, 200, 1500, 800]);
    spot(g, 400, 640, 760, '#ff3a2a', 0.38);
    heroFull(g, 400, 1070, 215, 'shocked', { hoodie: '#ff3b2a', pants: '#26307a', pose: 'up', dir: 1, rim: c, haloA: 0.3 });
  },
  2(g, t) {
    grayBg(g, t, 'kitchenNight', 402, { veil: 0.45, vig: 0.7 });
    g.save(); g.translate(-60, 40);
    const cx = 1390, by = 975;
    for (let k = 0; k < 3; k++) { const x = 1090 + k * 270, y = 560; rr(g, x - 66, y, 132, 220, 16); g.fillStyle = '#4a4d58'; g.fill(); rr(g, x - 80, y + 220, 160, 40, 10); g.fillStyle = '#3a3d48'; g.fill(); seg(g, [[x - 58, y + 260], [x - 66, y + 360]], 16, '#3a3d48'); seg(g, [[x + 58, y + 260], [x + 66, y + 360]], 16, '#3a3d48'); poly(g, [[x - 30, y - 74], [x + 30, y - 74], [x, y - 205]], '#9a9eaa'); circle(g, x, y - 208, 11, '#cfd2dc'); }
    rr(g, 900, 945, 1100, 190, 20); g.fillStyle = '#5a5d68'; g.fill(); g.fillStyle = '#80848f'; g.fillRect(900, 945, 1100, 18);
    glow(g, cx, 700, 900, '#ff8a1a', 0.55); glow(g, cx, 760, 420, '#ffd08a', 0.35);
    g.fillStyle = '#d6d9e2'; g.beginPath(); g.ellipse(cx, by, 310, 40, 0, 0, 7); g.fill();
    const tier = (w, y0, h, c1) => { rr(g, cx - w / 2, y0, w, h, 24); g.fillStyle = linGrad(g, 0, y0, 0, y0 + h, [shade(c1, 0.12), c1]); g.fill(); g.fillStyle = '#f0f2f8'; g.beginPath(); for (let i = 0; i <= 9; i++) g.arc(cx - w / 2 + 22 + i * ((w - 44) / 9), y0 + 13, 20, Math.PI, 0, true); g.fill(); };
    tier(520, 870, 105, '#9a9eaa'); tier(390, 770, 100, '#b0b4c0'); tier(270, 680, 90, '#9a9eaa');
    seg(g, [[cx, 680], [cx, 596]], 20, '#e0e3ee'); flame(g, cx, 592, 160, 38, '#ff7a1a', '#fff2a0'); star(g, cx, 510, 44, '#fff2a0');
    g.restore();
    motes(g, 43, 26, '#ffd08a', [900, 250, 900, 700]);
    spot(g, 470, 760, 900, '#ff3a2a', 0.34);
    heroFull(g, 470, 1560, 270, 'angry', { hoodie: '#ff3b2a', pants: '#26307a', pose: 'point', dir: 1, rim: '#ffb060', haloA: 0.3 });
  },
};

// 3 — "WHERE'S WALDO" poster: flat pop-art blue + sunburst, a dense gray crowd, ONE headless red hoodie circled with a yellow marker.
V[3] = (g, t) => {
  const hx = 1150, fy = 945, r = 160;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1636ff', '#5a1fe0']); g.fillRect(0, 0, E.W, E.H);
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i += 2) { const a0 = i / 40 * Math.PI * 2, a1 = (i + 1) / 40 * Math.PI * 2; g.fillStyle = 'rgba(120,170,255,0.16)'; g.beginPath(); g.moveTo(hx, 640); g.lineTo(hx + Math.cos(a0) * 2600, 640 + Math.sin(a0) * 2600); g.lineTo(hx + Math.cos(a1) * 2600, 640 + Math.sin(a1) * 2600); g.fill(); } g.restore();
  for (let y = 20; y < E.H; y += 36) for (let x = ((y / 36) % 2) * 18 + 10; x < E.W; x += 36) { g.fillStyle = `rgba(255,255,255,${0.05 + 0.07 * (1 - y / E.H)})`; g.beginPath(); g.arc(x, y, 5 + 4 * (1 - y / E.H), 0, 7); g.fill(); }
  const P = (x, y, s, c) => { // sticker-style silhouette with a dark outline
    g.save(); g.lineJoin = 'round'; g.lineWidth = Math.max(4, s * 0.16); g.strokeStyle = '#0a0f3a';
    g.beginPath(); g.moveTo(x - s * 1.3, y); g.lineTo(x - s * 1.2, y - s * 2.2); g.quadraticCurveTo(x - s * 1.1, y - s * 2.95, x, y - s * 3); g.quadraticCurveTo(x + s * 1.1, y - s * 2.95, x + s * 1.2, y - s * 2.2); g.lineTo(x + s * 1.3, y); g.closePath(); g.stroke(); g.fillStyle = c; g.fill();
    g.beginPath(); g.arc(x, y - s * 3.75, s * 0.95, 0, 7); g.stroke(); g.fillStyle = shade(c, 0.08); g.fill(); g.restore(); };
  const rowP = (seed, n, x0, x1, y, s, cols, skip) => { const rg = rng(seed); for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + rg() * 0.6) / n; if (skip && Math.abs(x - hx) < skip) continue; P(x, y + (rg() - 0.5) * 22, s * (0.92 + rg() * 0.2), cols[Math.floor(rg() * cols.length)]); } };
  const grays = ['#eef0f6', '#cfd3e0', '#aeb4c6', '#8e95aa'];
  rowP(61, 30, 0, 1960, 560, 30, grays); rowP(62, 24, 0, 1960, 650, 38, grays); rowP(63, 18, 0, 1960, 760, 50, grays, 200);
  glow(g, hx, 720, 640, '#ff3a2a', 0.5);
  heroFull(g, hx, fy, r, 'smug', { headless: true, hoodie: '#ff2e1f', pants: '#1a2a8a', rim: '#ffb0a0', haloA: 0.2, pose: 'idle', dir: 1 });
  rowP(64, 12, 0, 1960, 990, 78, grays, 280); rowP(65, 7, -40, 2000, 1190, 120, ['#cfd3e0', '#aeb4c6', '#8e95aa'], 330);
  // hand-drawn yellow marker circle (two wobbly loops)
  const cx = hx, cy = 665, rx = 285, ry = 420; g.save(); g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 18;
  for (const [k, w] of [[0, 17], [1, 13]]) { g.strokeStyle = '#ffe01a'; g.lineWidth = w; g.beginPath(); for (let i = 0; i <= 150; i++) { const a = -2 + i / 150 * (Math.PI * 2 * 1.06) + k * 0.12, wob = 1 + 0.025 * Math.sin(a * 3 + k) + 0.012 * Math.sin(a * 7), q = 1 + k * 0.035; const x = cx + Math.cos(a) * rx * wob * q, y = cy + Math.sin(a) * ry * wob * q; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } g.restore();
  // hand-drawn arrow from the right pointing at the circle + a '?' over the missing head
  g.save(); g.strokeStyle = '#ffe01a'; g.lineWidth = 15; g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 14;
  g.beginPath(); g.moveTo(1790, 330); g.bezierCurveTo(1700, 250, 1560, 300, 1420, 450); g.stroke(); g.beginPath(); g.moveTo(1420, 450); g.lineTo(1430, 370); g.moveTo(1420, 450); g.lineTo(1498, 430); g.stroke(); g.restore();
  star(g, 1190, 430, 38, '#ffffff');
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-invisible3') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
