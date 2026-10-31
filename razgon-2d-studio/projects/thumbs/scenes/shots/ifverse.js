// ifverse.js — Ifverse-style thumbnails (shots with params.tpl === 'ifv'). Text is added later by story/text2.py.
// Look: deep saturated cinematic scene, big black head (no headband) in a red hoodie with white drawstrings,
// one strong glowing prop, lots of light; each variant has its own emotion.
import { E, registerShot, alpha, shade, mix, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';

const INK = '#0b0a0f', W = '#f7f3ea';

// ---------- look helpers ----------
const wash = (g, top, bot, a = 0.5, op = 'soft-light') => { g.save(); g.globalCompositeOperation = op; g.globalAlpha = a; g.fillStyle = linGrad(g, 0, 0, 0, E.H, [top, bot]); g.fillRect(0, 0, E.W, E.H); g.restore(); };
const vign = (g, a = 0.55) => { g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * 0.45, E.W * 0.75, ['rgba(0,0,0,0)', `rgba(0,0,0,${a})`]); g.fillRect(0, 0, E.W, E.H); g.restore(); };
const bokeh = (g, seed, n, cols, a = 0.35) => { const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = r() * E.W, y = r() * E.H * 0.8, s = 14 + r() * 50, c = cols[i % cols.length]; g.fillStyle = radGrad(g, x, y, 0, s, [alpha(c, a), alpha(c, a * 0.6), alpha(c, 0)]); g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); } g.restore(); };
const motes = (g, seed, n, c, area = [0, 0, E.W, E.H]) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = area[0] + r() * area[2], y = area[1] + r() * area[3], s = 1.5 + r() * 4; glow(g, x, y, s * 5, c, 0.5); circle(g, x, y, s, alpha('#ffffff', 0.85)); } };
const star = (g, x, y, s, c = '#fff1a0') => { glow(g, x, y, s * 2.6, c, 0.9); glow(g, x, y, s * 1.1, '#ffffff', 0.9); g.fillStyle = '#ffffff'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, d = i % 2 ? s * 0.16 : (i % 4 ? s * 0.6 : s); g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } g.closePath(); g.fill(); };

// ---------- the character ----------
// emo: smug | angry | shocked | sad | crazy.  o.dir: +1 looks right, -1 looks left.  o.rim: rim-light colour.
export function hero(g, x, y, r, emo = 'smug', o = {}) {
  const dir = o.dir ?? 1, col = o.hoodie || '#d8402e', rim = o.rim || '#5fd8ff';
  glow(g, x + dir * r * 0.2, y - r * 0.1, r * 2.2, rim, o.haloA ?? 0.28);
  // hoodie (shoulders + hood + drawstrings), cropped by the bottom edge
  g.fillStyle = linGrad(g, x - r * 1.4, 0, x + r * 1.4, 0, dir > 0 ? [shade(col, -0.35), col, shade(col, 0.12)] : [shade(col, 0.12), col, shade(col, -0.35)]);
  g.beginPath(); g.moveTo(x - r * 1.45, E.H + 20); g.bezierCurveTo(x - r * 1.4, y + r * 1.35, x - r * 1.05, y + r * 1.08, x - r * 0.5, y + r * 0.98);
  g.lineTo(x + r * 0.5, y + r * 0.98); g.bezierCurveTo(x + r * 1.05, y + r * 1.08, x + r * 1.4, y + r * 1.35, x + r * 1.45, E.H + 20); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(rim, 0.35); g.lineWidth = r * 0.05; g.beginPath(); const sx = x + dir * r * 1.45; g.moveTo(sx, E.H); g.bezierCurveTo(x + dir * r * 1.4, y + r * 1.35, x + dir * r * 1.05, y + r * 1.08, x + dir * r * 0.5, y + r * 0.98); g.stroke(); g.restore();
  g.fillStyle = shade(col, -0.5); g.beginPath(); g.ellipse(x, y + r * 1.0, r * 0.62, r * 0.2, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = shade(col, -0.2); g.beginPath(); g.ellipse(x, y + r * 0.96, r * 0.62, r * 0.13, 0, Math.PI, Math.PI * 2); g.fill();
  for (const k of [-1, 1]) { seg(g, [[x + k * r * 0.17, y + r * 1.1], [x + k * r * 0.21, y + r * 1.62]], r * 0.035, W); circle(g, x + k * r * 0.21, y + r * 1.64, r * 0.035, W); }
  g.fillStyle = INK; g.fillRect(x - r * 0.16, y + r * 0.78, r * 0.32, r * 0.24);                                  // neck
  // head with a soft one-sided rim
  circle(g, x, y, r, INK);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  const rg = g.createRadialGradient(x + dir * r * 1.05, y - r * 0.35, r * 0.05, x + dir * r * 1.05, y - r * 0.35, r * 0.95); rg.addColorStop(0, alpha(rim, 0.38)); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(rim, 0.45); g.lineWidth = r * 0.035; g.beginPath(); g.arc(x, y, r - r * 0.02, dir > 0 ? -1.2 : Math.PI - 0.6, dir > 0 ? 0.6 : Math.PI + 1.2); g.stroke();
  g.restore();
  const ex = x + dir * r * 0.3, ey = y - r * 0.06, sp = r * 0.44;
  const mx = x + dir * r * 0.34, my = y + r * 0.36;
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (emo === 'smug') {
    for (const k of [-1, 1]) { const cx = ex + k * sp / 2; g.fillStyle = W; g.beginPath(); g.ellipse(cx, ey, r * 0.15, r * 0.085, 0, 0, Math.PI); g.fill(); circle(g, cx + dir * r * 0.07, ey + r * 0.03, r * 0.05, INK); seg(g, [[cx - r * 0.19, ey - r * 0.02 + k * dir * r * 0.025], [cx + r * 0.19, ey - r * 0.02 - k * dir * r * 0.025]], r * 0.05, W); }
    if (o.star !== false) star(g, ex + dir * sp / 2, ey + r * 0.01, r * 0.2);
    g.strokeStyle = W; g.lineWidth = r * 0.055; g.beginPath(); g.moveTo(mx - r * 0.15, my + r * 0.01); g.quadraticCurveTo(mx + r * 0.02, my + r * 0.09, mx + dir * r * 0.17, my - r * 0.07); g.stroke();
  } else if (emo === 'angry') {
    const c = o.eye || '#ffb21f';
    for (const k of [-1, 1]) { const cx = ex + k * sp / 2; glow(g, cx, ey, r * 0.7, '#ff6a00', 0.9); g.fillStyle = c; g.beginPath(); g.moveTo(cx - r * 0.17, ey - r * 0.04 * -k * 1 - r * 0.03); g.lineTo(cx + r * 0.17, ey + r * 0.04 * -k - r * 0.03); g.quadraticCurveTo(cx, ey + r * 0.16, cx - r * 0.17, ey - r * 0.04 * -k * 1 - r * 0.03); g.closePath(); g.fill();
      g.fillStyle = INK; g.beginPath(); g.moveTo(cx - r * 0.22, ey - r * 0.12 - k * r * 0.07); g.lineTo(cx + r * 0.22, ey - r * 0.12 + k * r * 0.07); g.lineTo(cx + r * 0.22, ey - r * 0.02 + k * r * 0.1); g.lineTo(cx - r * 0.22, ey - r * 0.02 - k * r * 0.1); g.fill(); circle(g, cx, ey + r * 0.03, r * 0.025, '#fff6d0'); }
    seg(g, [[mx - r * 0.12, my + r * 0.04], [mx + r * 0.12, my + r * 0.02]], r * 0.05, alpha('#ffb21f', 0.9));
  } else if (emo === 'shocked') {
    [[-1, 0.17], [1, 0.2]].forEach(([k, s]) => { const cx = ex + k * sp / 2 * 1.08; circle(g, cx, ey - r * 0.02, r * s, W); circle(g, cx + dir * r * 0.04, ey, r * 0.065, INK); circle(g, cx + dir * r * 0.06, ey - r * 0.03, r * 0.02, W); });
    g.fillStyle = W; g.beginPath(); g.ellipse(mx - dir * r * 0.04, my + r * 0.06, r * 0.075, r * 0.11, 0, 0, Math.PI * 2); g.fill();
    for (const k of [-1, 1]) seg(g, [[ex + k * sp / 2 * 1.08 - r * 0.13, ey - r * 0.3 - k * dir * r * 0.0], [ex + k * sp / 2 * 1.08 + r * 0.13, ey - r * 0.34]], r * 0.04, W);
  } else if (emo === 'sad') {
    for (const k of [-1, 1]) { const cx = ex + k * sp / 2; circle(g, cx, ey, r * 0.14, W); circle(g, cx + dir * r * 0.03, ey + r * 0.05, r * 0.06, INK); circle(g, cx + dir * r * 0.05, ey + r * 0.03, r * 0.018, W);
      g.fillStyle = INK; g.beginPath(); g.moveTo(cx - r * 0.2, ey - r * 0.2); g.lineTo(cx + r * 0.2, ey - r * 0.2); g.lineTo(cx + r * 0.2, ey - r * 0.04 + k * r * 0.08); g.lineTo(cx - r * 0.2, ey - r * 0.04 - k * r * 0.08); g.fill(); }
    const tx = ex - dir * sp / 2 + dir * r * 0.02, ty = ey + r * 0.2; glow(g, tx, ty + r * 0.08, r * 0.3, '#5fc8ff', 0.8); g.fillStyle = '#8fe0ff'; g.beginPath(); g.moveTo(tx, ty - r * 0.06); g.quadraticCurveTo(tx + r * 0.07, ty + r * 0.08, tx, ty + r * 0.12); g.quadraticCurveTo(tx - r * 0.07, ty + r * 0.08, tx, ty - r * 0.06); g.fill();
    g.strokeStyle = W; g.lineWidth = r * 0.05; g.beginPath(); g.arc(mx, my + r * 0.12, r * 0.11, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
  } else if (emo === 'crazy') {
    const c1 = ex - dir * sp / 2, c2 = ex + dir * sp / 2;
    circle(g, c2, ey - r * 0.03, r * 0.22, W); circle(g, c2 + dir * r * 0.02, ey - r * 0.02, r * 0.045, INK);
    seg(g, [[c1 - r * 0.12, ey - r * 0.08], [c1 + r * 0.1, ey], [c1 - r * 0.12, ey + r * 0.08]], r * 0.05, W);
    g.fillStyle = W; rr(g, mx - r * 0.2, my - r * 0.02, r * 0.38, r * 0.15, r * 0.06); g.fill();
    seg(g, [[mx - r * 0.18, my + r * 0.055], [mx - r * 0.1, my + r * 0.01], [mx - r * 0.02, my + r * 0.1], [mx + r * 0.06, my + r * 0.01], [mx + r * 0.14, my + r * 0.1]], r * 0.02, INK);
    // glowing crack in the skull
    const cr = [[x - r * 0.35, y - r * 0.93], [x - r * 0.25, y - r * 0.68], [x - r * 0.4, y - r * 0.5], [x - r * 0.22, y - r * 0.3]];
    seg(g, cr, r * 0.05, '#ffcf6a'); g.save(); g.globalCompositeOperation = 'lighter'; seg(g, cr, r * 0.13, alpha('#ff7a1a', 0.45)); g.restore(); glow(g, x - r * 0.33, y - r * 0.85, r * 0.6, '#ff8a2a', 0.6);
  }
}

// ---------- props ----------
const brain = (g, x, y, s, c) => { // stylised brain outline (two lobes of bumps)
  g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = c; g.fillStyle = alpha(c, 0.16); g.lineJoin = 'round';
  g.beginPath(); for (let i = 0; i <= 14; i++) { const a = Math.PI * 0.95 - i / 14 * Math.PI * 1.9, px = Math.cos(a) * 150, py = Math.sin(a) * -105; if (!i) g.moveTo(px, py); else g.quadraticCurveTo(Math.cos(a + 0.07) * 185, Math.sin(a + 0.07) * -135, px, py); } g.closePath(); g.fill(); g.stroke();
  for (const [p, q] of [[[0, -110], [0, 90]], [[-100, -40], [-40, -10]], [[-70, 40], [-20, 20]], [[100, -50], [40, -20]], [[80, 40], [30, 30]], [[-120, 10], [-90, -10]]]) { g.beginPath(); g.moveTo(...p); g.quadraticCurveTo((p[0] + q[0]) / 2, p[1] - 25, ...q); g.stroke(); }
  g.beginPath(); g.moveTo(10, 100); g.quadraticCurveTo(30, 140, 0, 175); g.stroke(); g.restore();
};
const panelGlow = (g, x, y, w, h, c, a = 0.9) => { glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.85, c, 0.35); g.save(); g.shadowColor = c; g.shadowBlur = 40; rr(g, x, y, w, h, 26); g.lineWidth = 8; g.strokeStyle = alpha(shade(c, 0.4), a); g.stroke(); g.restore(); };
const photo = (g, x, y, s, rot, sky, draw) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = alpha('#000', 0.35); g.fillRect(-108, -118, 236, 276); g.fillStyle = '#f6f1e6'; g.fillRect(-118, -128, 236, 276); g.fillStyle = sky; g.fillRect(-100, -110, 200, 190); draw && draw(g); g.restore(); };
const pic = {
  sun: (g) => { circle(g, 40, -50, 28, '#ffe27a'); poly(g, [[-100, 80], [-30, -10], [40, 80]], '#2f6a4a'); poly(g, [[0, 80], [60, 10], [100, 80]], '#3f8a5a'); },
  cake: (g) => { g.fillStyle = '#f29ac0'; g.fillRect(-60, 10, 120, 60); g.fillStyle = '#fff'; g.fillRect(-60, 5, 120, 14); seg(g, [[0, 5], [0, -30]], 8, '#5ff2e8'); glow(g, 0, -40, 34, '#ffd06a', 0.9); },
  two: (g) => { circle(g, -35, -20, 30, INK); circle(g, 38, -14, 27, INK); g.fillStyle = '#d8402e'; g.fillRect(-62, 14, 54, 66); g.fillStyle = '#3a6ae0'; g.fillRect(12, 18, 52, 62); },
  heart: (g) => { g.fillStyle = '#e8321a'; g.beginPath(); g.moveTo(0, 50); g.bezierCurveTo(-100, -20, -45, -100, 0, -45); g.bezierCurveTo(45, -100, 100, -20, 0, 50); g.fill(); },
  dog: (g) => { g.fillStyle = '#c98a4a'; g.beginPath(); g.ellipse(0, 30, 60, 38, 0, 0, 7); g.fill(); circle(g, 50, -10, 30, '#c98a4a'); circle(g, 60, -16, 5, INK); },
  house: (g) => { poly(g, [[-70, 0], [0, -60], [70, 0]], '#c0392b'); g.fillStyle = '#f2d6a0'; g.fillRect(-55, 0, 110, 75); g.fillStyle = '#4a7ac0'; g.fillRect(-20, 25, 40, 50); },
};

// ---------- the five variants ----------
const V = {
  // 1 SMUG + star eye — holographic brain at 100%: "NOTHING / LOST."
  1(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.25, blur: 7, veil: 0.2, y: -120 });
    wash(g, '#2a3cff', '#7a2aff', 0.75); bokeh(g, 11, 26, ['#5fd8ff', '#8a6aff', '#ff5ad8']); vign(g, 0.5);
    const px = 1080, py = 170, pw = 740, ph = 620, c = '#3fe0ff';
    g.fillStyle = linGrad(g, 0, py, 0, py + ph, [alpha('#0a2a4a', 0.82), alpha('#06142a', 0.9)]); rr(g, px, py, pw, ph, 26); g.fill(); panelGlow(g, px, py, pw, ph, c);
    g.save(); rr(g, px, py, pw, ph, 26); g.clip(); for (let i = 0; i < 30; i++) { g.fillStyle = alpha(c, 0.05); g.fillRect(px, py + i * 22, pw, 2); } g.restore();
    text(g, 'MEMORY', px + 40, py + 60, { size: 46, color: c, font: FONTS.ui, weight: 900, align: 'left', spacing: 6 });
    text(g, 'SCAN', px + pw - 40, py + 60, { size: 40, color: alpha(c, 0.6), font: FONTS.ui, weight: 900, align: 'right', spacing: 4 });
    glow(g, px + pw / 2, py + 300, 360, c, 0.45); brain(g, px + pw / 2, py + 300, 1.35, '#bff6ff');
    for (const [a, b] of [[[px + 120, py + 200], [px + 190, py + 250]], [[px + pw - 120, py + 380], [px + pw - 200, py + 330]]]) { seg(g, [a, b], 4, alpha(c, 0.7)); circle(g, a[0], a[1], 9, c); }
    const bx = px + 60, by = py + ph - 120, bw = pw - 120; rr(g, bx, by, bw, 46, 23); g.fillStyle = alpha('#000', 0.5); g.fill(); rr(g, bx + 6, by + 6, bw - 12, 34, 17); g.fillStyle = linGrad(g, bx, 0, bx + bw, 0, ['#3fe0ff', '#6affb0']); g.fill();
    text(g, '100%', px + pw / 2, by + 90, { size: 54, color: '#e8fbff', font: FONTS.ui, weight: 900, glow: 20, glowColor: c });
    motes(g, 4, 30, c, [1000, 80, 900, 900]);
    hero(g, 560, 700, 245, 'smug', { rim: '#5fd8ff', dir: 1 });
  },
  // 2 ANGRY glowing eyes — CCTV replay of a lie from years ago: "YOU / LIED."
  2(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.3, blur: 8, veil: 0.35, y: -140 });
    wash(g, '#ff8a2a', '#5a1a0a', 0.8); bokeh(g, 21, 18, ['#ffb04a', '#ff6a2a']); vign(g, 0.65);
    FX.lightCone(g, 1450, -20, { angle: Math.PI / 2, spread: 0.32, len: 1000, color: '#ffd59a', a: 0.22 });
    const px = 1040, py = 230, pw = 780, ph = 520; glow(g, px + pw / 2, py + ph / 2, 560, '#ff9a3a', 0.35);
    rr(g, px - 24, py - 24, pw + 48, ph + 48, 30); g.fillStyle = '#16121a'; g.fill();
    g.save(); rr(g, px, py, pw, ph, 14); g.clip(); g.fillStyle = linGrad(g, 0, py, 0, py + ph, ['#3a5a6a', '#1a2a34']); g.fillRect(px, py, pw, ph);
    g.fillStyle = alpha('#0a1418', 0.6); g.fillRect(px, py + ph * 0.66, pw, ph); g.fillStyle = alpha('#c8e8ff', 0.18); g.fillRect(px + 60, py + 60, 220, 200); g.fillRect(px + 520, py + 60, 200, 200);
    const fx = px + 420, fy = py + 300; circle(g, fx, fy - 70, 58, '#0e1418'); rr(g, fx - 70, fy - 10, 140, 200, 40); g.fillStyle = '#0e1418'; g.fill();
    for (let i = 0; i < ph; i += 6) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(px, py + i, pw, 2); } g.restore();
    g.save(); g.shadowColor = '#ff2a1a'; g.shadowBlur = 30; g.strokeStyle = '#ff3a2a'; g.lineWidth = 12; g.beginPath(); g.ellipse(fx, fy + 20, 150, 210, -0.1, 0, Math.PI * 2); g.stroke(); g.restore();
    circle(g, px + 50, py + 46, 16, '#ff2a1a'); glow(g, px + 50, py + 46, 50, '#ff2a1a', 0.8);
    text(g, 'REPLAY', px + 80, py + 48, { size: 40, color: '#ffffff', font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
    text(g, '03.14.2011  21:47', px + pw - 30, py + ph - 40, { size: 40, color: '#ffffff', font: FONTS.ui, weight: 800, align: 'right' });
    text(g, '◀◀', px + pw - 30, py + 48, { size: 42, color: '#ffffff', font: FONTS.ui, weight: 900, align: 'right' });
    motes(g, 8, 24, '#ffb04a', [900, 80, 1000, 900]);
    hero(g, 560, 700, 245, 'angry', { rim: '#ff9a3a', haloA: 0.32, dir: 1 });
  },
  // 3 SHOCKED — a flood of memories pouring into the head: "TOO / MUCH."
  3(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 8, veil: 0.25, y: -120 });
    wash(g, '#3a1aff', '#ff3a9a', 0.7); bokeh(g, 31, 22, ['#ff5ad8', '#5fd8ff', '#ffd06a']); vign(g, 0.5);
    const hx = 560, hy = 700;
    FX.speedLines(g, 0, { cx: hx, cy: hy, count: 70, color: '#ffffff', a: 0.12, inner: 420 });
    const r = rng(7), kinds = ['sun', 'cake', 'two', 'heart', 'dog', 'house'], skies = ['#7fc6ff', '#3a2a5a', '#ffb07a', '#2a2a40', '#9ad08a', '#a8d8ff'];
    const pts = []; for (let i = 0; i < 11; i++) { const k = i / 10, x = lerp2(1880, 900, k) + (r() - 0.5) * 260, y = lerp2(120, 520, k) + (r() - 0.5) * 380; pts.push([x, y, 1.05 - k * 0.55 + r() * 0.2, (r() - 0.5) * 0.8, i]); }
    for (const [x, y] of pts) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = linGrad(g, x, y, x + 260, y - 120, [alpha('#ffffff', 0.45), alpha('#ffffff', 0)]); g.lineWidth = 50; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 260, y - 120); g.stroke(); g.restore(); }
    pts.sort((a, b) => a[2] - b[2]).forEach(([x, y, s, rot, i]) => { glow(g, x, y, 200 * s, '#fff0c0', 0.35); photo(g, x, y, s * 0.85, rot, skies[i % 6], pic[kinds[i % 6]]); });
    motes(g, 9, 40, '#ffe0a0', [800, 0, 1120, 1000]);
    hero(g, hx, hy, 245, 'shocked', { rim: '#ff7ad8', haloA: 0.35, dir: 1 });
  },
  // 4 SAD + tear — one memory you can never lose, in the rain: "IT / HURTS."
  4(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.25, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#1a4aff', '#0a1a4a', 0.8); bokeh(g, 41, 26, ['#5fa8ff', '#ff6a8a', '#ffd06a'], 0.3); vign(g, 0.6);
    FX.rain(g, 0.6, { count: 260, color: '#bfe0ff', a: 0.35 });
    const x = 1420, y = 520; glow(g, x, y, 560, '#ffb06a', 0.45);
    photo(g, x, y, 1.9, 0.08, '#f2a46a', (g) => { pic.two(g); seg(g, [[-8, -110], [12, -40], [-14, 10], [10, 80]], 7, '#f6f1e6'); });
    g.save(); g.translate(x, y); g.rotate(0.08); text(g, 'SUMMER 2014', 0, 225, { size: 34, color: '#3a3040', font: FONTS.ui, weight: 900 }); g.restore();
    star(g, x + 200, y - 260, 50, '#ffe0a0');
    motes(g, 12, 20, '#ffd8a0', [1000, 100, 900, 800]);
    hero(g, 560, 700, 245, 'sad', { rim: '#5fa8ff', haloA: 0.3, dir: 1 });
  },
  // 5 CRAZY / overloaded — cracked memory counter, skull cracked: "BRAIN / BROKE."
  5(g, t) {
    bgBlur(g, t, 'class', {}, { z: 1.25, blur: 8, veil: 0.35, y: -120 });
    wash(g, '#ff2a1a', '#3a0a3a', 0.75); bokeh(g, 51, 20, ['#ff5a2a', '#ffb02a', '#ff2a8a']); vign(g, 0.6);
    const px = 1010, py = 260, pw = 840, ph = 360; glow(g, px + pw / 2, py + ph / 2, 600, '#ff3a1a', 0.45);
    rr(g, px - 20, py - 20, pw + 40, ph + 40, 34); g.fillStyle = '#121016'; g.fill(); rr(g, px, py, pw, ph, 20); g.fillStyle = '#060508'; g.fill();
    text(g, 'MEMORIES', px + pw / 2, py + 60, { size: 44, color: '#ff8a7a', font: FONTS.ui, weight: 900, spacing: 10 });
    text(g, '9,999,999', px + pw / 2, py + 200, { size: 170, color: '#ff4a3a', font: FONTS.ui, weight: 900, glow: 40, glowColor: 'rgba(255,60,40,.9)' });
    const ck = [[px + 520, py - 10], [px + 480, py + 90], [px + 560, py + 150], [px + 500, py + 260], [px + 540, py + ph + 10]];
    seg(g, ck, 10, '#f4efe6'); seg(g, [[px + 560, py + 150], [px + 660, py + 120], [px + 700, py + 180]], 7, '#f4efe6'); seg(g, [[px + 500, py + 260], [px + 400, py + 300]], 6, '#f4efe6');
    for (let i = 0; i < 9; i++) { const a = -1.2 + i * 0.32, sx = px + 560, sy = py + 150; seg(g, [[sx + Math.cos(a) * 60, sy + Math.sin(a) * 60], [sx + Math.cos(a) * (110 + (i % 3) * 30), sy + Math.sin(a) * (110 + (i % 3) * 30)]], 6, alpha('#ffd08a', 0.9)); }
    glow(g, px + 560, py + 150, 160, '#ffd08a', 0.7);
    rr(g, px + 220, py + ph + 50, 400, 90, 18); g.fillStyle = '#e8321a'; g.fill(); text(g, '⚠ NO SPACE', px + 420, py + ph + 96, { size: 50, color: '#ffffff', font: FONTS.ui, weight: 900 });
    for (let i = 0; i < 3; i++) { const sx = 470 + i * 70, sy = 300 - i * 40; g.fillStyle = alpha('#ffffff', 0.22 - i * 0.05); g.beginPath(); g.arc(sx, sy, 40 + i * 14, 0, 7); g.fill(); }
    motes(g, 15, 30, '#ffb04a', [900, 60, 1000, 950]);
    hero(g, 560, 700, 245, 'crazy', { rim: '#ff8a3a', haloA: 0.35, dir: 1 });
  },
};
function lerp2(a, b, k) { return a + (b - a) * k; }

for (const s of E.shots) if (s.params?.tpl === 'ifv') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
