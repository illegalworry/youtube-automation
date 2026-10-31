// thumbs.js — 5 YouTube thumbnails for "What If Your Hearing Was 100x Sharper?" (text is added later in PIL). Previous set: _thumbs_brain.js
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

// sound waves: concentric arcs fanning out from (x,y) toward angle a
const waves = (g, x, y, a, n, r0, step, col, w = 14, spread = 0.7) => { g.lineCap = 'round'; for (let i = 0; i < n; i++) { g.strokeStyle = alpha(col, 0.95 - i * (0.6 / n)); g.lineWidth = w; g.beginPath(); g.arc(x, y, r0 + i * step, a - spread, a + spread); g.stroke(); } };
const heartPath = (g, x, y, s) => { g.beginPath(); g.moveTo(x, y + s * 0.95); g.bezierCurveTo(x - s * 1.5, y + s * 0.1, x - s * 1.05, y - s * 1.05, x, y - s * 0.4); g.bezierCurveTo(x + s * 1.05, y - s * 1.05, x + s * 1.5, y + s * 0.1, x, y + s * 0.95); g.closePath(); };

// Hearing 100x sharper — "What If Your Hearing Was 100x Sharper?"
const T = {
  // TOO LOUD. / OVERLOAD — a decibel gauge pinned past the red (closest to the approved 1_100 sample)
  1(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.4, blur: 18, veil: 0.04, y: -160 }); lift(g, 0.14);
    const cx = 1420, cy = 720, R = 360;
    circle(g, cx, cy, R + 40, alpha('#0c0c14', 0.88)); ring(g, cx, cy, R + 40, 14, '#f4efe6');
    const segs = 9; for (let i = 0; i < segs; i++) { const a0 = Math.PI + i / segs * Math.PI, a1 = a0 + Math.PI / segs - 0.03; g.strokeStyle = ['#3fb950', '#3fb950', '#8fd14f', '#d9e04a', '#f2c21a', '#f29a1a', '#f2601a', '#e8321a', '#c0101a'][i]; g.lineWidth = 70; g.beginPath(); g.arc(cx, cy, R - 40, a0, a1); g.stroke(); }
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; seg(g, [[cx + Math.cos(a) * (R - 110), cy + Math.sin(a) * (R - 110)], [cx + Math.cos(a) * (R - 140), cy + Math.sin(a) * (R - 140)]], 6, '#f4efe6'); }
    const na = Math.PI * 2.1; glow(g, cx + Math.cos(na) * R * 0.7, cy + Math.sin(na) * R * 0.7, 220, '#ff3a1a', 0.75);
    seg(g, [[cx, cy], [cx + Math.cos(na) * (R - 20), cy + Math.sin(na) * (R - 20)]], 18, '#ff3a1a'); circle(g, cx, cy, 34, '#f4efe6');
    for (let i = 0; i < 4; i++) seg(g, [[cx + 300 + i * 14, cy - 140 + i * 30], [cx + 340 + i * 14, cy - 150 + i * 30]], 6, alpha('#ffffff', 0.7));
    text(g, 'dB', cx, cy + 130, { size: 84, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 4 });
    FX.sparkle(g, cx + R * 0.88, cy + 40, 70, '#fff3c0', 1);
    face(g, 500, 650, 300, 'shocked', { hoodie: '#2f6fd6', halo: '#ff8a3a', haloA: 0.35 });
  },
  // I HEAR IT. / YOUR HEARTBEAT — a glowing heart with a pulse line, waves running to the head
  2(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.4, blur: 18, veil: 0.04, y: -160 }); lift(g, 0.12);
    const hx = 1430, hy = 560, s = 300;
    glow(g, hx, hy + 60, 620, '#ff3a5a', 0.55);
    heartPath(g, hx, hy, s); const hg = g.createLinearGradient(hx, hy - s, hx, hy + s); hg.addColorStop(0, '#ff6a7a'); hg.addColorStop(1, '#c0102a'); g.fillStyle = hg; g.fill();
    g.save(); heartPath(g, hx, hy, s); g.clip(); glow(g, hx - s * 0.6, hy - s * 0.55, s * 0.6, '#ffffff', 0.45); g.restore();
    seg(g, [[hx - 520, hy + 60], [hx - 200, hy + 60], [hx - 140, hy - 40], [hx - 70, hy + 230], [hx + 10, hy - 200], [hx + 80, hy + 140], [hx + 130, hy + 60], [hx + 480, hy + 60]], 22, '#0b0a0f');
    seg(g, [[hx - 520, hy + 60], [hx - 200, hy + 60], [hx - 140, hy - 40], [hx - 70, hy + 230], [hx + 10, hy - 200], [hx + 80, hy + 140], [hx + 130, hy + 60], [hx + 480, hy + 60]], 11, '#f6f2ea');
    text(g, 'BA-DUM', hx, hy + 410, { size: 72, color: '#fff3e8', font: FONTS.ui, weight: 900, spacing: 6, glow: 18, glowColor: 'rgba(255,60,90,.8)' });
    waves(g, hx - 380, hy + 60, Math.PI, 3, 60, 55, '#ffd0d8', 10, 0.6);
    face(g, 500, 650, 300, 'smug', { hoodie: '#7a3fd6', halo: '#ff5a7a', haloA: 0.35, star: true });
  },
  // 0 SECRETS. / THROUGH WALLS — a closed door, a whisper leaking through as waves
  3(g, t) {
    bgBlur(g, t, 'hall', {}, { z: 1.3, blur: 16, veil: 0.04, y: -150 }); lift(g, 0.12);
    const dx = 1440, dy = 600, dw = 420, dh = 860;
    glow(g, dx, dy, 700, '#5ff2e8', 0.3);
    rr(g, dx - dw / 2 - 30, dy - dh / 2 - 30, dw + 60, dh + 80, 10); g.fillStyle = '#2a1a16'; g.fill();
    rr(g, dx - dw / 2, dy - dh / 2, dw, dh + 40, 6); const dg = g.createLinearGradient(dx - dw / 2, 0, dx + dw / 2, 0); dg.addColorStop(0, '#a4683c'); dg.addColorStop(1, '#6e3e22'); g.fillStyle = dg; g.fill();
    for (const [py, ph] of [[-360, 300], [20, 380]]) { rr(g, dx - dw / 2 + 50, dy + py, dw - 100, ph, 8); g.strokeStyle = alpha('#2a1408', 0.6); g.lineWidth = 10; g.stroke(); }
    circle(g, dx - dw / 2 + 60, dy + 10, 22, '#f2c21a'); glow(g, dx - dw / 2 + 60, dy + 10, 60, '#ffe08a', 0.6);
    g.fillStyle = alpha('#fff2b0', 0.85); g.fillRect(dx - dw / 2 - 6, dy + dh / 2 + 34, dw + 12, 10); glow(g, dx, dy + dh / 2 + 40, 300, '#ffe08a', 0.4);
    waves(g, dx - dw / 2 - 10, dy - 40, Math.PI, 4, 70, 60, '#5ff2e8', 14, 0.55);
    g.save(); g.translate(dx + 40, dy - 300); g.rotate(-0.06); rr(g, -190, -60, 380, 120, 50); g.fillStyle = '#f6f2ea'; g.fill(); poly(g, [[-120, 50], [-170, 110], [-60, 56]], '#f6f2ea'); text(g, 'psst...', 0, 4, { size: 64, color: '#2a2236', font: FONTS.ui, weight: 900 }); g.restore();
    face(g, 500, 650, 300, 'smug', { hoodie: '#d64a33', halo: '#5ff2e8', haloA: 0.35, star: true });
  },
  // STOMP. / ANT FOOTSTEPS — a tiny ant, giant shock rings under its feet
  4(g, t) {
    bgBlur(g, t, 'balcony', {}, { z: 1.3, blur: 16, veil: 0.02, y: -150 }); lift(g, 0.14);
    const ax = 1420, ay = 760;
    glow(g, ax, ay, 600, '#f2c21a', 0.45);
    g.save(); g.translate(ax, ay + 110); g.scale(1, 0.28); for (let i = 0; i < 5; i++) ring(g, 0, 0, 150 + i * 120, 22 - i * 3, alpha(['#ffffff', '#ffe08a', '#f2c21a', '#ff9a3a', '#ff5a3a'][i], 0.9 - i * 0.14)); g.restore();
    const ink = '#1a0f0c', by = ay - 90;
    for (const [kx, fx, far] of [[-230, -300, 1], [-20, -60, 1], [190, 250, 1], [-190, -250, 0], [10, -10, 0], [160, 200, 0]]) seg(g, [[ax + (far ? 10 : -10), by + 10], [ax + kx, by + 70 - far * 10], [ax + fx, ay + 110 - far * 14]], far ? 12 : 17, far ? '#3a2620' : ink);
    g.fillStyle = ink; g.beginPath(); g.ellipse(ax - 210, by - 40, 150, 110, -0.15, 0, 7); g.fill();
    g.beginPath(); g.ellipse(ax, by - 20, 70, 55, 0, 0, 7); g.fill();
    g.beginPath(); g.ellipse(ax + 160, by - 70, 100, 90, 0, 0, 7); g.fill();
    seg(g, [[ax + 190, by - 140], [ax + 230, by - 260], [ax + 320, by - 300]], 12, ink); seg(g, [[ax + 150, by - 150], [ax + 150, by - 280], [ax + 220, by - 350]], 12, ink);
    g.save(); g.globalCompositeOperation = 'screen'; g.strokeStyle = alpha('#ffd08a', 0.55); g.lineWidth = 10; g.beginPath(); g.ellipse(ax - 210, by - 40, 140, 100, -0.15, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); g.beginPath(); g.ellipse(ax + 160, by - 70, 90, 80, 0, Math.PI * 1.2, Math.PI * 1.7); g.stroke(); g.restore();
    circle(g, ax + 200, by - 90, 16, '#ffffff');
    for (let i = 0; i < 3; i++) seg(g, [[ax - 420 - i * 30, ay - 260 + i * 70], [ax - 480 - i * 30, ay - 290 + i * 70]], 9, alpha('#ffffff', 0.8));
    face(g, 500, 650, 300, 'shocked', { hoodie: '#2f9a5a', halo: '#f2c21a', haloA: 0.4 });
  },
  // 1 KM. / I HEAR A PIN DROP — a falling pin far away, giant waves
  5(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 16, veil: 0.04, y: -120, x: 200 }); lift(g, 0.14);
    const px = 1460, py = 640;
    glow(g, px, py, 620, '#5ff2e8', 0.4);
    waves(g, px, py + 160, Math.PI * 1.5, 5, 140, 90, '#5ff2e8', 14, 1.3);
    g.save(); g.translate(px, py); g.rotate(0.5); const pg = g.createLinearGradient(-20, 0, 20, 0); pg.addColorStop(0, '#f6f2ea'); pg.addColorStop(1, '#9aa4b0'); g.fillStyle = pg; g.beginPath(); g.moveTo(-14, -230); g.lineTo(14, -230); g.lineTo(0, 240); g.closePath(); g.fill(); circle(g, 0, -260, 62, '#e8321a'); glow(g, -18, -280, 40, '#ffffff', 0.6); g.restore();
    seg(g, [[px - 120, py + 290], [px + 160, py + 290]], 8, alpha('#ffffff', 0.7));
    text(g, 'TING!', px + 230, py - 330, { size: 96, color: '#ffffff', font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(95,242,232,.9)' });
    face(g, 500, 650, 300, 'smug', { hoodie: '#e07a1a', halo: '#5ff2e8', haloA: 0.35, star: true });
  },
};
for (const s of E.shots) if (s.params?.tpl === 'thumb') registerShot(s.id, { draw(g, t, info) { T[info.k](g, t); } });
