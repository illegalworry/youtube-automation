// thumbs.js — 5 YouTube thumbnails (text is added later in PIL). Bright background, big knowing face, one explanatory prop.
import { E, S, registerShot, mood, ease, clamp, lerp, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, rng, FONTS } from '/engine/core.js';
import { bigFace, drawFigure, POSES, EXPR } from '/engine/rig2d.js';
EXPR.smug = { eyes: 'dot', brows: 'angry', mouth: 'smirk' };
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { CAST } from '../cast.js';
import { drawBand } from './_inserts2.js';

// competitor-style character: full big head (not cropped) on a thin neck + narrow hoodie torso; small flat
// half-lidded eyes shifted toward the gaze; tiny smirk; thin cyan band; soft rim light, no outline ring.
const face = (g, x, y, r, expr, o = {}) => {
  const dir = o.dir ?? 1, col = o.hoodie || '#d64a33', ink = '#0b0a0f';
  glow(g, x, y, r * 2.3, o.halo || '#ffd59a', o.haloA ?? 0.35);
  // torso + hood behind the neck
  g.fillStyle = shade(col, -0.15); g.beginPath(); g.moveTo(x - r * 0.75, E.H + 20); g.quadraticCurveTo(x - r * 0.7, y + r * 1.05, x, y + r * 1.0); g.quadraticCurveTo(x + r * 0.7, y + r * 1.05, x + r * 0.75, E.H + 20); g.closePath(); g.fill();
  g.fillStyle = shade(col, -0.45); g.beginPath(); g.ellipse(x, y + r * 1.02, r * 0.42, r * 0.16, 0, 0, Math.PI * 2); g.fill();
  seg(g, [[x - r * 0.12, y + r * 1.25], [x - r * 0.18, E.H]], r * 0.03, alpha('#f4efe6', 0.6)); seg(g, [[x + r * 0.12, y + r * 1.25], [x + r * 0.18, E.H]], r * 0.03, alpha('#f4efe6', 0.6));
  g.fillStyle = ink; g.fillRect(x - r * 0.13, y + r * 0.8, r * 0.26, r * 0.3);                       // neck
  circle(g, x, y, r, ink);                                                                            // head
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  const rg = g.createRadialGradient(x + dir * r * 0.9, y - r * 0.6, r * 0.1, x + dir * r * 0.9, y - r * 0.6, r * 1.1); rg.addColorStop(0, alpha(o.rim || '#ffe2b0', 0.35)); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  if (o.band !== false) { g.fillStyle = '#5ff2e8'; g.beginPath(); g.moveTo(x - r, y - r * 0.5); g.quadraticCurveTo(x, y - r * 0.62, x + r, y - r * 0.5); g.lineTo(x + r, y - r * 0.32); g.quadraticCurveTo(x, y - r * 0.44, x - r, y - r * 0.32); g.closePath(); g.fill(); glow(g, x, y - r * 0.45, r, '#5ff2e8', 0.12); }
  g.restore();
  if (o.band !== false) { g.fillStyle = '#4ad8ce'; g.beginPath(); g.moveTo(x - dir * r * 0.97, y - r * 0.42); g.quadraticCurveTo(x - dir * r * 1.3, y - r * 0.3, x - dir * r * 1.38, y - r * 0.02); g.lineTo(x - dir * r * 1.24, y - r * 0.02); g.quadraticCurveTo(x - dir * r * 1.18, y - r * 0.24, x - dir * r * 0.97, y - r * 0.3); g.fill(); }
  const ex = x + dir * r * 0.24, ey = y - r * 0.02, sp = r * 0.44, W2 = '#f6f2ea';
  for (const k of [-1, 1]) {
    const cx = ex + k * sp / 2;
    if (expr === 'smug') { g.fillStyle = W2; g.beginPath(); g.ellipse(cx, ey, r * 0.165, r * 0.095, 0, 0, Math.PI); g.fill(); g.fillStyle = ink; circle(g, cx + dir * r * 0.07, ey + r * 0.035, r * 0.055, ink); seg(g, [[cx - r * 0.2, ey - r * 0.01 - k * dir * r * 0.02], [cx + r * 0.2, ey + r * 0.01 + k * dir * r * 0.02]], r * 0.04, W2); }
    else { circle(g, cx, ey, r * (expr === 'shocked' ? 0.18 : 0.16), W2); circle(g, cx + dir * r * 0.05, ey + r * 0.01, r * 0.08, ink); }
  }
  if (o.star) { const sx = ex + sp / 2 * (dir > 0 ? -1 : 1), sy = ey; glow(g, sx, sy, r * 0.5, '#fff3c0', 0.7); FX.sparkle(g, sx, sy, r * 0.28, '#ffffff', 1); }
  const mx = x + dir * r * 0.3, my = y + r * 0.38; g.strokeStyle = W2; g.lineCap = 'round'; g.lineWidth = r * 0.05; g.beginPath();
  if (expr === 'smug') { g.moveTo(mx - r * 0.14, my); g.quadraticCurveTo(mx + r * 0.02, my + r * 0.07, mx + r * 0.16 * dir, my - r * 0.06); g.stroke(); }
  else if (expr === 'shocked') { g.ellipse(mx, my, r * 0.08, r * 0.11, 0, 0, Math.PI * 2); g.fillStyle = W2; g.fill(); }
  else { g.moveTo(mx - r * 0.14, my); for (let i = 1; i <= 4; i++) g.lineTo(mx - r * 0.14 + i * r * 0.07, my + (i % 2 ? -1 : 1) * r * 0.03); g.stroke(); }
};
const lift = (g, a = 0.12) => { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(255,220,180,${a})`; g.fillRect(0, 0, E.W, E.H); g.restore(); };

// saturated bokeh discs + a coloured wash, so the blurred set reads bright, not brown
const bokeh = (g, seed, cols, n = 26) => { const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = r() * E.W, y = r() * E.H * 0.85, s = 30 + r() * 90; g.fillStyle = alpha(cols[i % cols.length], 0.10 + r() * 0.14); g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); } g.restore(); };
const wash = (g, c1, c2, a = 0.28) => { g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createLinearGradient(0, 0, E.W, E.H); gr.addColorStop(0, alpha(c1, a)); gr.addColorStop(1, alpha(c2, a)); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); g.restore(); };
const lines = (g, x, y, n, len, col, dx = -1) => { for (let i = 0; i < n; i++) seg(g, [[x, y + i * 34], [x + dx * len * (0.6 + (i % 3) * 0.2), y + i * 34]], 7, alpha(col, 0.75 - i * 0.08)); };

// "What If You Could Think 10x Faster?"
const T = {
  // 10x. — a THOUGHT SPEED gauge (1x..10x) with the needle pinned past 10x
  1(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.4, blur: 18, veil: 0.04, y: -160 }); wash(g, '#3a8cff', '#ff4ad8', 0.3); bokeh(g, 3, ['#5ff2e8', '#ff6ad5', '#ffd25a']); lift(g, 0.1);
    const cx = 1420, cy = 720, R = 360;
    glow(g, cx, cy - 80, 620, '#3aa0ff', 0.35);
    circle(g, cx, cy, R + 40, alpha('#0c0c18', 0.9)); ring(g, cx, cy, R + 40, 14, '#f4efe6');
    const segs = 10, cs = ['#3fb950', '#5fc94f', '#8fd14f', '#c6e04a', '#f2d21a', '#f2b21a', '#f29a1a', '#f2601a', '#e8321a', '#c0101a'];
    for (let i = 0; i < segs; i++) { const a0 = Math.PI + i / segs * Math.PI, a1 = a0 + Math.PI / segs - 0.03; g.strokeStyle = cs[i]; g.lineWidth = 64; g.beginPath(); g.arc(cx, cy, R - 40, a0, a1); g.stroke(); }
    for (let i = 1; i <= 10; i += 3) { const a = Math.PI + (i - 0.5) / 10 * Math.PI; text(g, i === 10 ? '10x' : i + 'x', cx + Math.cos(a) * (R - 150), cy + Math.sin(a) * (R - 150), { size: 44, color: '#f4efe6', font: FONTS.ui, weight: 900 }); }
    const na = Math.PI * 2.1; glow(g, cx + Math.cos(na) * R * 0.75, cy + Math.sin(na) * R * 0.75, 230, '#ff3a1a', 0.8);
    seg(g, [[cx, cy], [cx + Math.cos(na) * (R - 10), cy + Math.sin(na) * (R - 10)]], 18, '#ff3a1a'); circle(g, cx, cy, 34, '#f4efe6');
    for (let i = 0; i < 4; i++) seg(g, [[cx + 310 + i * 14, cy - 150 + i * 32], [cx + 350 + i * 14, cy - 160 + i * 32]], 6, alpha('#ffffff', 0.75));
    text(g, 'THOUGHTS', cx, cy + 120, { size: 56, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 6 });
    FX.sparkle(g, cx + R * 0.86, cy - 20, 80, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.4, star: true, hoodie: '#2f6fe0' });
  },
  // FROZEN. — a coffee cup tipping over, the splash frozen mid-air with speed ticks
  2(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.4, blur: 18, veil: 0.02, y: -160 }); wash(g, '#ff9a3a', '#ff3a8a', 0.32); bokeh(g, 7, ['#ffd25a', '#ff8a5a', '#fff0c0']); lift(g, 0.12);
    const cx = 1430, cy = 640; glow(g, cx, cy, 560, '#ffd28a', 0.45);
    g.save(); g.translate(cx + 40, cy + 170); g.rotate(-0.55);                                          // tipped mug
    rr(g, -110, -150, 220, 260, 30); g.fillStyle = '#f4efe6'; g.fill(); ring(g, 120, -20, 60, 26, '#f4efe6'); g.fillStyle = '#d64a33'; g.fillRect(-110, -60, 220, 40); g.restore();
    const r2 = rng(11); g.fillStyle = '#7a4320';                                                      // the frozen splash
    g.beginPath(); g.moveTo(cx - 40, cy + 30); g.bezierCurveTo(cx - 160, cy - 60, cx - 120, cy - 250, cx + 10, cy - 300); g.bezierCurveTo(cx + 80, cy - 200, cx + 40, cy - 80, cx + 60, cy + 40); g.closePath(); g.fill();
    g.strokeStyle = alpha('#ffe2b0', 0.7); g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 70, cy - 20); g.bezierCurveTo(cx - 120, cy - 110, cx - 90, cy - 220, cx - 10, cy - 260); g.stroke();
    for (let i = 0; i < 14; i++) { const a = -2.6 + r2() * 2.2, d = 160 + r2() * 220, s = 12 + r2() * 26; circle(g, cx + Math.cos(a) * d, cy - 80 + Math.sin(a) * d, s, '#7a4320'); circle(g, cx + Math.cos(a) * d - s * 0.3, cy - 80 + Math.sin(a) * d - s * 0.3, s * 0.3, alpha('#ffe2b0', 0.8)); }
    g.strokeStyle = alpha('#ffffff', 0.85); g.lineWidth = 10; g.setLineDash([26, 22]); g.beginPath(); g.arc(cx, cy - 60, 400, -2.9, -0.2); g.stroke(); g.setLineDash([]);
    FX.sparkle(g, cx + 250, cy - 330, 70, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#ffb35a', haloA: 0.45, star: true, hoodie: '#2fa86a' });
  },
  // TOO SLOW. — a glowing snail labelled EVERYONE: the rest of the world now crawls
  3(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.3, blur: 18, veil: 0.02, y: -150 }); wash(g, '#3ad8ff', '#a05aff', 0.32); bokeh(g, 21, ['#5ff2e8', '#c08aff', '#ffd25a']); lift(g, 0.1);
    const cx = 1430, cy = 700; glow(g, cx, cy - 60, 600, '#8affd0', 0.35);
    g.fillStyle = '#8fd14f'; g.beginPath(); g.moveTo(cx - 380, cy + 230); g.quadraticCurveTo(cx - 400, cy + 120, cx - 300, cy + 110); g.lineTo(cx + 300, cy + 130); g.quadraticCurveTo(cx + 400, cy + 160, cx + 380, cy + 240); g.closePath(); g.fill();   // body
    g.fillStyle = '#8fd14f'; g.beginPath(); g.moveTo(cx - 300, cy + 140); g.quadraticCurveTo(cx - 400, cy, cx - 340, cy - 60); g.lineTo(cx - 280, cy - 40); g.quadraticCurveTo(cx - 300, cy + 40, cx - 220, cy + 120); g.fill(); // neck/head
    for (const k of [0, 1]) { seg(g, [[cx - 330 + k * 40, cy - 50], [cx - 380 + k * 70, cy - 170]], 12, '#8fd14f'); circle(g, cx - 380 + k * 70, cy - 170, 22, '#f4efe6'); circle(g, cx - 384 + k * 70, cy - 166, 10, '#0b0a0f'); }
    circle(g, cx + 40, cy - 30, 230, '#f2a23a'); g.strokeStyle = '#a8551a'; g.lineWidth = 26; g.beginPath(); for (let i = 0; i < 120; i++) { const a = i / 120 * Math.PI * 5.2, r = 200 - i * 1.62; const px = cx + 40 + Math.cos(a) * r, py = cy - 30 + Math.sin(a) * r; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
    glow(g, cx - 40, cy - 140, 160, '#fff0c0', 0.35);
    lines(g, cx + 430, cy - 20, 4, 90, '#ffffff', 1);
    rr(g, cx - 160, cy + 260, 340, 80, 14); g.fillStyle = alpha('#0c0c14', 0.85); g.fill(); text(g, 'EVERYONE', cx + 10, cy + 302, { size: 50, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 4 });
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.4, star: true, hoodie: '#d64a33' });
  },
  // TOO HOT. — shocked: a glowing BRAIN chip running at 10x, red-hot and smoking
  4(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.3, blur: 16, veil: 0.02, y: -140 }); wash(g, '#ff7a2a', '#ff2a6a', 0.34); bokeh(g, 33, ['#ffd25a', '#ff6a3a', '#fff0c0']); lift(g, 0.08);
    const cx = 1420, cy = 600, s = 300; glow(g, cx, cy, 640, '#ff5a1a', 0.6);
    for (let i = 0; i < 7; i++) { const o = -s + 50 + i * (2 * s - 100) / 6; for (const [x0, y0, x1, y1] of [[o, -s, o, -s - 70], [o, s, o, s + 70], [-s, o, -s - 70, o], [s, o, s + 70, o]]) seg(g, [[cx + x0, cy + y0], [cx + x1, cy + y1]], 20, '#d8c070'); }
    rr(g, cx - s, cy - s, 2 * s, 2 * s, 30); g.fillStyle = '#1a1420'; g.fill();
    rr(g, cx - s * 0.7, cy - s * 0.7, s * 1.4, s * 1.4, 18); g.fillStyle = '#ff4a1a'; g.fill(); glow(g, cx, cy, s, '#ffd04a', 0.7);
    text(g, 'BRAIN', cx, cy - 40, { size: 84, color: '#1a0a06', font: FONTS.ui, weight: 900, spacing: 6 }); text(g, '10x', cx, cy + 60, { size: 96, color: '#fff6d0', font: FONTS.ui, weight: 900 });
    for (let i = 0; i < 3; i++) { const sx = cx - 140 + i * 140; g.strokeStyle = alpha('#f4efe6', 0.75); g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(sx, cy - s - 100); g.bezierCurveTo(sx - 50, cy - s - 160, sx + 50, cy - s - 210, sx, cy - s - 280); g.stroke(); }
    face(g, 470, 650, 300, 'shocked', { halo: '#ff4a3a', haloA: 0.4, hoodie: '#2f6fe0' });
  },
  // 1 HOUR = 10. — a wall clock with ten ghost minute hands sweeping in one hour
  5(g, t) {
    bgBlur(g, t, 'library', {}, { z: 1.3, blur: 16, veil: 0.02, y: -140 }); wash(g, '#ffd23a', '#3ad89a', 0.3); bokeh(g, 45, ['#fff0a0', '#8affc0', '#ffb35a']); lift(g, 0.1);
    const cx = 1420, cy = 560, R = 390; glow(g, cx, cy, 620, '#ffe08a', 0.5);
    circle(g, cx, cy, R + 30, '#1a1420'); circle(g, cx, cy, R, '#fbf6ea'); ring(g, cx, cy, R + 30, 12, '#f2c21a');
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * (R - 20), cy + Math.sin(a) * (R - 20)], [cx + Math.cos(a) * (R - (i % 3 ? 50 : 80)), cy + Math.sin(a) * (R - (i % 3 ? 50 : 80))]], i % 3 ? 8 : 16, '#2a2236'); }
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * 0.6; seg(g, [[cx, cy], [cx + Math.cos(a) * (R - 70), cy + Math.sin(a) * (R - 70)]], 14, alpha('#e8321a', 0.18 + i * 0.08)); }
    g.strokeStyle = alpha('#e8321a', 0.5); g.lineWidth = 22; g.beginPath(); g.arc(cx, cy, R - 120, -Math.PI / 2, -Math.PI / 2 + 5.4); g.stroke();
    seg(g, [[cx, cy], [cx + 0, cy - R * 0.45]], 24, '#2a2236'); circle(g, cx, cy, 30, '#2a2236');
    rr(g, cx - 90, cy + 140, 180, 90, 16); g.fillStyle = '#e8321a'; g.fill(); text(g, 'x10', cx, cy + 186, { size: 64, color: '#ffffff', font: FONTS.ui, weight: 900 });
    FX.sparkle(g, cx - R * 0.8, cy - R * 0.6, 70, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#ffd25a', haloA: 0.4, star: true, hoodie: '#7a4ad8' });
  },
};
for (const s of E.shots) if (s.params?.tpl === 'thumb') registerShot(s.id, { draw(g, t, info) { T[info.k](g, t); } });
