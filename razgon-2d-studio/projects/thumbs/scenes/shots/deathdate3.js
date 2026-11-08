// deathdate3.js — 3 clickbait "why?" thumbnails for «What If Everyone Could See Their Death Date?»
// (params.tpl === 'ifv-death'). New emotions (terror, maniac, cry), new poses (cover, flail, reach)
// and new palettes (acid green, ice + fire, blood red). Text is added by story/deathdate3_text.sh.
import { E, registerShot, alpha, shade, rr, circle, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star } from './ifverse.js';
import { heroFull } from './brain10.js';

// ---------- new faces (drawn over the blank head heroFull leaves for an unknown emotion) ----------
function feat(g, x, y, r, emo, dir = 1, o = {}) {
  const ex = x + dir * r * 0.3, ey = y - r * 0.06, sp = r * 0.44, mx = x + dir * r * 0.34, my = y + r * 0.36;
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (emo === 'terror') {
    // huge eyes, pinpoint pupils, brows shot up, sweat
    for (const k of [-1, 1]) {
      const cx = ex + k * sp / 2 * 1.12, R = r * (k === dir ? 0.21 : 0.18);
      glow(g, cx, ey, R * 2.2, '#ffffff', 0.25); circle(g, cx, ey, R, W);
      circle(g, cx + dir * r * 0.03, ey + r * 0.01, r * 0.028, INK);
      seg(g, [[cx - R * 0.95, ey - R * 1.55 + k * dir * r * 0.04], [cx + R * 0.95, ey - R * 1.75 - k * dir * r * 0.04]], r * 0.05, W);
    }
    if (!o.noMouth) { g.fillStyle = W; g.beginPath(); g.ellipse(mx, my + r * 0.1, r * 0.14, r * 0.2, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#3a0a14'; g.beginPath(); g.ellipse(mx, my + r * 0.12, r * 0.1, r * 0.15, 0, 0, Math.PI * 2); g.fill(); }
    for (const [sx, sy, s] of [[x - dir * r * 0.55, y - r * 0.55, 1], [x - dir * r * 0.75, y - r * 0.15, 0.7]]) { glow(g, sx, sy, r * 0.25, '#8fe8ff', 0.6); g.fillStyle = '#bff2ff'; g.beginPath(); g.moveTo(sx, sy - r * 0.1 * s); g.quadraticCurveTo(sx + r * 0.07 * s, sy + r * 0.05 * s, sx, sy + r * 0.08 * s); g.quadraticCurveTo(sx - r * 0.07 * s, sy + r * 0.05 * s, sx, sy - r * 0.1 * s); g.fill(); }
  } else if (emo === 'maniac') {
    // mismatched wide eyes (one spiral), giant toothy grin
    const c1 = ex - dir * sp / 2, c2 = ex + dir * sp / 2;
    circle(g, c2, ey - r * 0.04, r * 0.23, W); circle(g, c2 + dir * r * 0.05, ey - r * 0.02, r * 0.035, INK);
    circle(g, c1, ey, r * 0.16, W);
    g.strokeStyle = INK; g.lineWidth = r * 0.028; g.beginPath(); for (let i = 0; i < 60; i++) { const a = i * 0.32, d = r * 0.004 + i * r * 0.0022; i ? g.lineTo(c1 + Math.cos(a) * d, ey + Math.sin(a) * d) : g.moveTo(c1, ey); } g.stroke();
    seg(g, [[c2 - r * 0.2, ey - r * 0.33], [c2 + r * 0.2, ey - r * 0.4]], r * 0.05, W);
    seg(g, [[c1 - r * 0.16, ey - r * 0.24], [c1 + r * 0.14, ey - r * 0.32]], r * 0.05, W);
    g.fillStyle = W; g.beginPath(); g.moveTo(mx - r * 0.34, my - r * 0.06); g.quadraticCurveTo(mx, my + r * 0.42, mx + r * 0.36, my - r * 0.1); g.quadraticCurveTo(mx, my + r * 0.06, mx - r * 0.34, my - r * 0.06); g.fill();
    g.strokeStyle = INK; g.lineWidth = r * 0.018; for (let i = 1; i < 7; i++) { const tx = mx - r * 0.34 + i * r * 0.1; g.beginPath(); g.moveTo(tx, my - r * 0.04); g.lineTo(tx, my + r * 0.2 - Math.abs(i - 3.5) * r * 0.035); g.stroke(); }
    g.beginPath(); g.moveTo(mx - r * 0.3, my + r * 0.06); g.quadraticCurveTo(mx, my + r * 0.16, mx + r * 0.32, my + r * 0.03); g.stroke();
  } else if (emo === 'cry') {
    // eyes squeezed shut, two rivers of tears, wailing mouth
    for (const k of [-1, 1]) {
      const cx = ex + k * sp / 2;
      seg(g, [[cx - r * 0.15, ey + r * 0.02], [cx, ey - r * 0.08], [cx + r * 0.15, ey + r * 0.02]], r * 0.055, W);
      seg(g, [[cx - r * 0.17, ey - r * 0.26 + k * dir * r * 0.06], [cx + r * 0.17, ey - r * 0.2 - k * dir * r * 0.0]], r * 0.045, W);
      const pts = [[cx, ey + r * 0.06], [cx + r * 0.03, ey + r * 0.3], [cx - r * 0.02, ey + r * 0.55], [cx + r * 0.02, ey + r * 0.8]];
      g.save(); g.globalCompositeOperation = 'lighter'; seg(g, pts, r * 0.16, alpha('#3fb8ff', 0.35)); g.restore();
      seg(g, pts, r * 0.07, '#9ae6ff');
      g.fillStyle = '#c8f2ff'; g.beginPath(); g.ellipse(cx + r * 0.02, ey + r * 0.86, r * 0.05, r * 0.07, 0, 0, 7); g.fill();
    }
    g.fillStyle = W; g.beginPath(); g.moveTo(mx - r * 0.2, my + r * 0.1); g.quadraticCurveTo(mx, my - r * 0.12, mx + r * 0.2, my + r * 0.1); g.quadraticCurveTo(mx, my + r * 0.3, mx - r * 0.2, my + r * 0.1); g.fill();
    g.fillStyle = '#3a0a14'; g.beginPath(); g.moveTo(mx - r * 0.15, my + r * 0.1); g.quadraticCurveTo(mx, my - r * 0.05, mx + r * 0.15, my + r * 0.1); g.quadraticCurveTo(mx, my + r * 0.24, mx - r * 0.15, my + r * 0.1); g.fill();
  }
}

// a glowing date tag like the ones above everyone's head in the video
const dateTag = (g, x, y, s, label, c = '#ffffff', glowC = '#bfe0ff') => {
  g.save(); g.translate(x, y); g.scale(s, s);
  glow(g, 0, 0, 260, glowC, 0.45);
  rr(g, -230, -52, 460, 104, 52); g.fillStyle = alpha('#0b0a14', 0.55); g.fill();
  text(g, label, 0, 26, { size: 76, color: c, font: FONTS.ui, weight: 800, spacing: 8, glow: 30, glowColor: glowC });
  seg(g, [[-190, 46], [190, 46]], 4, alpha(c, 0.6));
  g.restore();
};

const V = {
  // 1 TERROR, hands over the mouth, waist-up right — a friend's text on a huge phone: "SHE SAW / MY DATE."
  1(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 7, veil: 0.35, y: -100 });
    wash(g, '#39ff14', '#00261a', 0.85); wash(g, '#000000', '#0a3a10', 0.35, 'multiply');
    bokeh(g, 301, 26, ['#7aff3a', '#c8ff2a', '#ff3ad8'], 0.34); vign(g, 0.6);
    // the phone (left, cut by the bottom edge)
    const px = 250, py = 470, pw = 600, ph = 820, c = '#ff3ad8';
    glow(g, px + pw / 2, py + 260, 560, c, 0.5);
    g.save(); g.translate(px + pw / 2, py + ph / 2); g.rotate(-0.06); g.translate(-(px + pw / 2), -(py + ph / 2));
    rr(g, px - 26, py - 26, pw + 52, ph + 52, 70); g.fillStyle = '#0c0b10'; g.fill();
    g.save(); g.shadowColor = c; g.shadowBlur = 40; rr(g, px - 26, py - 26, pw + 52, ph + 52, 70); g.lineWidth = 6; g.strokeStyle = alpha('#ff9ae8', 0.9); g.stroke(); g.restore();
    rr(g, px, py, pw, ph, 50); g.fillStyle = linGrad(g, 0, py, 0, py + ph, ['#1d1530', '#0c0a18']); g.fill();
    rr(g, px, py, pw, 120, 50); g.fillStyle = '#2a1a44'; g.fill(); g.fillStyle = '#2a1a44'; g.fillRect(px, py + 60, pw, 60);
    circle(g, px + 80, py + 62, 36, '#e86aa0'); circle(g, px + 80, py + 52, 18, INK);
    text(g, 'Mia', px + 140, py + 78, { size: 46, color: '#ffffff', font: FONTS.ui, weight: 900, align: 'left' });
    text(g, 'online', px + 230, py + 76, { size: 28, color: '#7aff3a', font: FONTS.ui, weight: 800, align: 'left' });
    const bubble = (by, bw, s) => { rr(g, px + 34, by, bw, 92, 30); g.fillStyle = '#f4f0ff'; g.fill(); text(g, s, px + 64, by + 62, { size: 44, color: '#1a1424', font: FONTS.ui, weight: 800, align: 'left' }); };
    bubble(py + 170, 470, 'I saw your date...');
    bubble(py + 285, 420, "I'm so sorry.");
    rr(g, px + 34, py + 400, 150, 70, 35); g.fillStyle = '#f4f0ff'; g.fill(); for (let i = 0; i < 3; i++) circle(g, px + 74 + i * 36, py + 435, 11, '#8a80a0');
    g.restore();
    motes(g, 302, 34, '#c8ff8a');
    const h = heroFull(g, 1440, 1520, 250, 'none', { pose: 'cover', dir: -1, rim: '#7aff3a', haloA: 0.4 });
    feat(g, h.head[0], h.head[1], 250, 'terror', -1, { noMouth: true });
  },
  // 2 MANIAC grin, falling head-first through the frame, arms flailing — his date glows: "I CAN'T / DIE."
  2(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.2, blur: 6, veil: 0.2, y: -60 });
    wash(g, '#00e5ff', '#ff5a00', 0.9); wash(g, '#2ad8ff', '#ff7a1a', 0.55, 'overlay'); bokeh(g, 311, 24, ['#8af4ff', '#ffb04a', '#ffffff'], 0.3);
    FX.speedLines(g, 0, { cx: 1300, cy: 520, count: 90, color: '#ffffff', a: 0.16, inner: 380 });
    // wind streaks rushing up past him
    const r0 = rng(312); g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) { const x = 900 + r0() * 1000, y = r0() * E.H, l = 120 + r0() * 260; g.strokeStyle = linGrad(g, x, y, x, y - l, [alpha('#ffffff', 0.45), alpha('#ffffff', 0)]); g.lineWidth = 3 + r0() * 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - l); g.stroke(); }
    g.restore();
    vign(g, 0.45);
    // the hero, tumbling backwards through the air, centre-right
    const R = 205;
    g.save(); g.translate(1360, 610); g.rotate(-0.62);
    const h = heroFull(g, 0, 420, R, 'none', { pose: 'flail', dir: -1, rim: '#ffb04a', haloA: 0.45 });
    feat(g, h.head[0], h.head[1], R, 'maniac', -1);
    g.restore();
    // his own date tag, blazing (the camera sees it; he never can)
    dateTag(g, 1090, 150, 1.0, 'JUN 5 2091', '#ffffff', '#ffb04a');
    star(g, 1330, 110, 34, '#fff1a0');
    motes(g, 313, 30, '#fff0d0', [900, 0, 1000, 1080]);
  },
  // 3 CRY, full body left, reaching for a giant calendar page — a crowd of red dates behind: "2 BILLION / ONE DAY."
  3(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 7, veil: 0.35, y: -100 });
    wash(g, '#ff1a3a', '#1a0008', 0.95); wash(g, '#000000', '#2a0008', 0.4, 'multiply');
    bokeh(g, 321, 26, ['#ff3a4a', '#ff8a5a', '#ffffff'], 0.3);
    // a sea of people, every one with the same red date
    const r = rng(322);
    for (let row = 0; row < 3; row++) for (let i = 0; i < 14; i++) {
      const s = 0.45 + row * 0.18, x = 40 + i * 140 + (row % 2) * 70 + (r() - 0.5) * 30, y = 700 + row * 90;
      g.fillStyle = alpha('#0a0006', 0.85); circle(g, x, y, 34 * s, alpha('#0a0006', 0.9)); rr(g, x - 30 * s, y + 30 * s, 60 * s, 120 * s, 24 * s); g.fill();
      glow(g, x, y - 70 * s, 50 * s, '#ff3a4a', 0.35);
      text(g, 'SEP 9', x, y - 58 * s, { size: 30 * s + 6, color: '#ffb0b8', font: FONTS.ui, weight: 900 });
    }
    vign(g, 0.6);
    // the giant tear-off calendar page (right)
    const cx = 1440, cy = 770, cw = 540, ch = 540;
    g.save(); g.translate(cx, cy); g.rotate(0.07);
    glow(g, 0, 0, 640, '#ff2a3a', 0.6);
    g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 50; rr(g, -cw / 2, -ch / 2, cw, ch, 30); g.fillStyle = '#fbf6ee'; g.fill(); g.shadowBlur = 0;
    rr(g, -cw / 2, -ch / 2, cw, 150, 30); g.fillStyle = '#d8162a'; g.fill(); g.fillStyle = '#d8162a'; g.fillRect(-cw / 2, -ch / 2 + 80, cw, 70);
    for (const k of [-1, 1]) { circle(g, k * 150, -ch / 2, 22, '#2a2030'); rr(g, k * 150 - 10, -ch / 2 - 50, 20, 60, 10); g.fillStyle = '#c8ccd8'; g.fill(); }
    text(g, 'SEPTEMBER', 0, -ch / 2 + 108, { size: 70, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 6 });
    text(g, '9', 0, 140, { size: 300, color: '#1a1424', font: FONTS.ui, weight: 900 });
    text(g, '2031', 0, 232, { size: 56, color: '#d8162a', font: FONTS.ui, weight: 900, spacing: 10 });
    g.save(); g.globalCompositeOperation = 'multiply'; g.strokeStyle = alpha('#d8162a', 0.85); g.lineWidth = 18; g.beginPath(); g.ellipse(0, 50, 170, 150, -0.15, 0, Math.PI * 2); g.stroke(); g.restore();
    g.restore();
    motes(g, 323, 34, '#ffc8c8');
    const R = 175;
    const h = heroFull(g, 560, 1045, R, 'none', { pose: 'reach', dir: 1, rim: '#ff5a6a', haloA: 0.4 });
    feat(g, h.head[0], h.head[1], R, 'cry', 1);
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv-death') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
