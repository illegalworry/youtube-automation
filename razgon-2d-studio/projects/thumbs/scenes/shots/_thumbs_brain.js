// _thumbs_brain.js — ARCHIVE of the approved "100% brain" thumbnails (t1 = 1_100.png sample). Not auto-loaded (underscore).
// To re-render them: copy this file over thumbs.js.
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

const T = {
  // 100%. — a brain gauge pinned past the red
  1(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.4, blur: 18, veil: 0.1, y: -160 }); lift(g);
    const cx = 1420, cy = 720, R = 360;
    circle(g, cx, cy, R + 40, alpha('#0c0c14', 0.85)); ring(g, cx, cy, R + 40, 14, '#f4efe6');
    const segs = 9; for (let i = 0; i < segs; i++) { const a0 = Math.PI + i / segs * Math.PI, a1 = a0 + Math.PI / segs - 0.03; g.strokeStyle = ['#3fb950', '#3fb950', '#8fd14f', '#d9e04a', '#f2c21a', '#f29a1a', '#f2601a', '#e8321a', '#c0101a'][i]; g.lineWidth = 70; g.beginPath(); g.arc(cx, cy, R - 40, a0, a1); g.stroke(); }
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; seg(g, [[cx + Math.cos(a) * (R - 110), cy + Math.sin(a) * (R - 110)], [cx + Math.cos(a) * (R - 140), cy + Math.sin(a) * (R - 140)]], 6, '#f4efe6'); }
    const na = Math.PI * 2.08; glow(g, cx + Math.cos(na) * R * 0.7, cy + Math.sin(na) * R * 0.7, 200, '#ff3a1a', 0.7);
    seg(g, [[cx, cy], [cx + Math.cos(na) * (R - 20), cy + Math.sin(na) * (R - 20)]], 18, '#ff3a1a'); circle(g, cx, cy, 34, '#f4efe6');
    for (let i = 0; i < 4; i++) seg(g, [[cx + 300 + i * 14, cy - 140 + i * 30], [cx + 340 + i * 14, cy - 150 + i * 30]], 6, alpha('#ffffff', 0.7));
    text(g, 'BRAIN', cx, cy + 130, { size: 64, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 8 });
    FX.sparkle(g, cx + R * 0.85, cy - 30, 70, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.3, star: true });
  },
  // TOO LOUD. — sound rings, voices and forks crowding the head
  2(g, t) {
    bgBlur(g, t, 'canteen', {}, { z: 1.3, blur: 16, veil: 0.12, y: -150 }); lift(g, 0.1);
    const x = 620, y = 700, r = 330, cols = ['#f2c21a', '#d64a33', '#5ff2e8', '#f29ac0'];
    for (let i = 0; i < 5; i++) { g.strokeStyle = alpha(cols[i % 4], 0.85 - i * 0.13); g.lineWidth = 16 - i * 2; g.beginPath(); g.arc(x, y, r + 70 + i * 70, 0, Math.PI * 2); g.stroke(); }
    const r2 = rng(5); const words = ['BLAH', 'HAHA', 'CLINK', 'HEY!', 'BZZZ', 'LOL', '!!!'];
    words.forEach((w, i) => { const a = -2.6 + i * 0.75, d = r + 260 + (i % 2) * 90, bx = x + Math.cos(a) * d * 1.4, by = y + Math.sin(a) * d * 0.8; if (bx > E.W - 80 || by < 60 || (bx > 900 && by < 360)) return; g.save(); g.translate(bx, by); g.rotate((r2() - 0.5) * 0.4); rr(g, -120, -50, 240, 100, 40); g.fillStyle = '#f4efe6'; g.fill(); text(g, w, 0, 4, { size: 48, color: '#2a2236', font: FONTS.ui, weight: 900 }); g.restore(); });
    for (let i = 0; i < 4; i++) { const fx = 1380 + i * 120, fy = 820 - (i % 2) * 140; g.save(); g.translate(fx, fy); g.rotate(-0.8 + i * 0.5); seg(g, [[-70, 0], [60, 0]], 14, '#d8dce6'); for (let k = 0; k < 3; k++) seg(g, [[60, -14 + k * 14], [100, -14 + k * 14]], 7, '#d8dce6'); g.restore(); }
    face(g, x, y - 60, 300, 'scared', { halo: '#ff6a3a', haloA: 0.35 });
  },
  // TOO EASY. — a test, every answer ticked, 100 stamp
  3(g, t) {
    bgBlur(g, t, 'exam', {}, { z: 1.3, blur: 16, veil: 0.1, y: -140 }); lift(g, 0.12);
    g.save(); g.translate(1400, 600); g.rotate(0.08); g.fillStyle = '#f6f1e6'; g.fillRect(-330, -420, 660, 860); g.fillStyle = '#c0392b'; g.fillRect(-330, -420, 660, 14);
    for (let i = 0; i < 8; i++) { seg(g, [[-270, -320 + i * 92], [-270 + 360 * (0.6 + (i % 3) * 0.15), -320 + i * 92]], 12, alpha('#8a8a9a', 0.55)); seg(g, [[200, -320 + i * 92], [222, -298 + i * 92], [266, -346 + i * 92]], 12, '#3fb950'); }
    g.save(); g.translate(60, 260); g.rotate(-0.25); ring(g, 0, 0, 150, 16, '#e8321a'); text(g, '100', 0, 6, { size: 120, color: '#e8321a', font: FONTS.ui, weight: 900 }); g.restore(); g.restore();
    FX.clock(g, 1020, 300, 110, 9 * 3600 + 9 * 60, {});
    face(g, 500, 650, 300, 'smug', { halo: '#f2c21a', haloA: 0.35, star: true });
  },
  // 2 SECONDS. — the giant screen falling on Leo, Max's shocked face
  4(g, t) {
    bgBlur(g, t, 'stage', { lightsOn: true }, { z: 1.1, blur: 8, veil: 0.08, y: -60, x: 0 }); lift(g, 0.06);
    const sx = 1380, sy = 380; g.save(); g.translate(sx, sy); g.rotate(-0.18); rr(g, -420, -170, 840, 340, 12); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#1d5a78'; g.fillRect(-400, -150, 800, 300); glow(g, 0, 0, 500, '#5ff2e8', 0.25); text(g, 'LUMEN', 40, 0, { size: 110, color: '#e8fbff', font: FONTS.title, weight: 700, spacing: 12 }); g.restore();
    for (let i = 0; i < 6; i++) seg(g, [[sx - 380 + i * 150, sy - 260 - i * 6], [sx - 380 + i * 150, sy - 400 - i * 6]], 6, alpha('#ffffff', 0.55));
    g.fillStyle = alpha('#000', 0.35); g.beginPath(); g.ellipse(1400, 980, 380, 50, 0, 0, 7); g.fill();
    drawFigure(g, { x: 1330, y: 990, s: 1.1, outfit: CAST.leo, pose: POSES.lie, rot: -1.57, expr: 'sleepy', rim: { color: '#ffe2b0', dir: [0, -1] } });
    poly(g, [[1640, 760], [1720, 620], [1800, 760]], '#f2c21a'); text(g, '!', 1720, 715, { size: 80, color: '#1a1622', font: FONTS.ui, weight: 900 });
    face(g, 470, 650, 300, 'shocked', { halo: '#ff4a3a', haloA: 0.3 });
  },
  // I KNEW. — 5:59, the alarm hasn't rung yet
  5(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 14, veil: 0.05, y: -140 }); lift(g, 0.08);
    const x = 1400, y = 560; rr(g, x - 380, y - 190, 760, 380, 60); g.fillStyle = '#121016'; g.fill(); g.fillStyle = '#0a0a0e'; g.fillRect(x - 320, y - 130, 640, 260);
    glow(g, x, y, 520, '#ff3a2a', 0.3); text(g, '5:59', x, y + 6, { size: 230, color: '#ff4a3a', font: FONTS.ui, weight: 900, glow: 34, glowColor: 'rgba(255,74,58,.8)' });
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) seg(g, [[x + s * (420 + i * 30), y - 150 + i * 90], [x + s * (470 + i * 30), y - 170 + i * 90]], 8, alpha('#ffd0c0', 0.5));
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.35 });
  },
};
for (const s of E.shots) if (s.params?.tpl === 'thumb') registerShot(s.id, { draw(g, t, info) { T[info.k](g, t); } });
