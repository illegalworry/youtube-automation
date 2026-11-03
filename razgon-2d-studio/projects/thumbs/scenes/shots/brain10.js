// brain10.js — 10 Ifverse-style "why?" thumbnails for «What If You Used 100% of Your Brain?» (params.tpl === 'ifv2').
// Adds a full-body / medium-shot version of the hero (heroFull) so the character can stand anywhere in the frame.
import { E, registerShot, alpha, shade, rr, circle, poly, seg, glow, text, rng, linGrad, radGrad, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { INK, W, wash, vign, bokeh, motes, star, face, hero } from './ifverse.js';

// ---------- full-body hero ----------
// x = centre, fy = floor (feet) y; put fy below E.H for a medium shot cropped at the thighs. r = head radius.
// o.pose: idle | up | point | head | shrug | hips.  o.dir: +1 looks right, -1 looks left.
const ARMS = { // [elbow, hand] relative to the shoulder, in head radii, for the right-hand arm (mirrored for the left)
  idle: [[0.14, 0.62], [0.1, 1.18]],
  up: [[0.42, -0.5], [0.5, -1.08]],
  head: [[0.62, -0.42], [0.24, -1.1]],
  shrug: [[0.42, 0.5], [0.88, 0.12]],
  hips: [[0.56, 0.55], [-0.08, 1.02]],
  point: [[0.6, 0.02], [1.18, -0.16]],
  wave: [[0.62, -0.12], [0.78, -0.82]],
};
export function heroFull(g, x, fy, r, emo = 'smug', o = {}) {
  const dir = o.dir ?? 1, col = o.hoodie || '#d8402e', rim = o.rim || '#5fd8ff', pants = o.pants || '#1b2140';
  const hy = fy - r * 1.3, sy = hy - r * 1.25, y = sy - r * 0.93;
  glow(g, x + dir * r * 0.2, y + r * 0.6, r * 3.2, rim, o.haloA ?? 0.28);
  // shadow on the floor
  if (fy < E.H) { g.save(); g.fillStyle = radGrad(g, x, fy + 6, 0, r * 1.3, ['rgba(0,0,0,.55)', 'rgba(0,0,0,0)']); g.beginPath(); g.ellipse(x, fy + 6, r * 1.3, r * 0.2, 0, 0, 7); g.fill(); g.restore(); }
  g.lineCap = 'round'; g.lineJoin = 'round';
  // legs + sneakers
  const st = o.stance ?? 0.36;
  for (const k of [-1, 1]) {
    const hx = x + k * r * 0.27, fx = x + k * r * st;
    seg(g, [[hx, hy - r * 0.1], [fx, fy - r * 0.16]], r * 0.36, k === dir ? shade(pants, 0.12) : pants);
    g.fillStyle = W; g.beginPath(); g.ellipse(fx + dir * r * 0.08, fy - r * 0.08, r * 0.3, r * 0.14, 0, 0, 7); g.fill();
    g.fillStyle = shade(W, -0.5); g.fillRect(fx + dir * r * 0.08 - r * 0.3, fy - r * 0.04, r * 0.6, r * 0.05);
  }
  // arms (behind the torso for the far side)
  const pose = o.pose || 'idle';
  const armOf = (k) => (pose === 'point' || pose === 'wave') ? (k === dir ? ARMS[pose] : ARMS.idle) : ARMS[pose] || ARMS.idle;
  const arm = (k) => {
    const [e, h] = armOf(k), shx = x + k * r * 0.66, shy = sy + r * 0.22;
    const ex = shx + k * e[0] * r, ey = shy + e[1] * r, hx2 = shx + k * h[0] * r, hy2 = shy + h[1] * r;
    const c = k === dir ? shade(col, 0.06) : shade(col, -0.25);
    seg(g, [[shx, shy], [ex, ey], [hx2, hy2]], r * 0.31, c);
    circle(g, hx2, hy2, r * 0.17, INK);
    g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(rim, 0.4); g.lineWidth = r * 0.03; g.beginPath(); g.arc(hx2, hy2, r * 0.16, dir > 0 ? -1.2 : Math.PI - 0.4, dir > 0 ? 0.4 : Math.PI + 1.2); g.stroke(); g.restore();
    return [hx2, hy2];
  };
  const hands = {}, over = pose === 'head' || pose === 'up';
  if (!over) hands[-dir] = arm(-dir);
  // torso: hoodie
  g.fillStyle = linGrad(g, x - r * 0.9, 0, x + r * 0.9, 0, dir > 0 ? [shade(col, -0.35), col, shade(col, 0.14)] : [shade(col, 0.14), col, shade(col, -0.35)]);
  g.beginPath(); g.moveTo(x - r * 0.42, sy - r * 0.02);
  g.bezierCurveTo(x - r * 0.78, sy, x - r * 0.88, sy + r * 0.2, x - r * 0.84, sy + r * 0.5);
  g.lineTo(x - r * 0.72, hy + r * 0.08); g.quadraticCurveTo(x, hy + r * 0.2, x + r * 0.72, hy + r * 0.08);
  g.lineTo(x + r * 0.84, sy + r * 0.5); g.bezierCurveTo(x + r * 0.88, sy + r * 0.2, x + r * 0.78, sy, x + r * 0.42, sy - r * 0.02); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha(rim, 0.38); g.lineWidth = r * 0.04; g.beginPath(); g.moveTo(x + dir * r * 0.5, sy); g.bezierCurveTo(x + dir * r * 0.8, sy + r * 0.02, x + dir * r * 0.88, sy + r * 0.2, x + dir * r * 0.84, sy + r * 0.5); g.lineTo(x + dir * r * 0.72, hy + r * 0.06); g.stroke(); g.restore();
  g.fillStyle = shade(col, -0.22); rr(g, x - r * 0.72, hy - r * 0.06, r * 1.44, r * 0.16, r * 0.06); g.fill();              // waistband
  g.fillStyle = shade(col, -0.16); rr(g, x - r * 0.44, hy - r * 0.52, r * 0.88, r * 0.34, r * 0.1); g.fill();             // pocket
  // hood around the neck + drawstrings
  g.fillStyle = shade(col, -0.5); g.beginPath(); g.ellipse(x, sy + r * 0.04, r * 0.56, r * 0.18, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = shade(col, -0.18); g.beginPath(); g.ellipse(x, sy, r * 0.56, r * 0.12, 0, Math.PI, Math.PI * 2); g.fill();
  for (const k of [-1, 1]) { seg(g, [[x + k * r * 0.15, sy + r * 0.12], [x + k * r * 0.19, sy + r * 0.62]], r * 0.035, W); circle(g, x + k * r * 0.19, sy + r * 0.64, r * 0.035, W); }
  if (!o.headless) { g.fillStyle = INK; g.fillRect(x - r * 0.15, y + r * 0.8, r * 0.3, r * 0.2); }
  if (!over) hands[dir] = arm(dir);
  if (o.headless) { g.save(); g.setLineDash([r * 0.12, r * 0.1]); g.strokeStyle = alpha('#ffffff', 0.55); g.lineWidth = r * 0.03; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.restore(); }
  else face(g, x, y, r, emo, { ...o, dir, rim });
  if (over) { hands[-dir] = arm(-dir); hands[dir] = arm(dir); }   // raised hands / hands on the head go in front of it
  return { head: [x, y], hands, top: y - r };
}

// ---------- props ----------
const digits = (g, s, x, y, size, c) => text(g, s, x, y, { size, color: c, font: FONTS.ui, weight: 900, glow: 36, glowColor: c });
const bolt = (g, x1, y1, x2, y2, c, w = 8, seed = 1) => FX.lightning(g, { seed, x1, y1, x2, y2, color: c, w, branches: 2, jag: 70 });
const clockFace = (g, x, y, R, c = '#ffb03a') => {
  glow(g, x, y, R * 2.1, c, 0.45);
  circle(g, x, y, R + 26, '#1a1420'); circle(g, x, y, R + 12, shade(c, 0.1)); circle(g, x, y, R, '#fff4dc');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[x + Math.cos(a) * R * 0.8, y + Math.sin(a) * R * 0.8], [x + Math.cos(a) * R * (i % 3 ? 0.88 : 0.92), y + Math.sin(a) * R * (i % 3 ? 0.88 : 0.92)]], i % 3 ? 6 : 12, '#2a2030'); }
  seg(g, [[x, y], [x + R * 0.38, y - R * 0.3]], 16, '#2a2030'); seg(g, [[x, y], [x - R * 0.12, y - R * 0.66]], 10, '#2a2030'); seg(g, [[x, y + R * 0.15], [x + R * 0.1, y - R * 0.74]], 4, '#e8321a'); circle(g, x, y, 14, '#e8321a');
  seg(g, [[x - R * 0.95, y - R * 0.2], [x - R * 0.55, y - R * 0.1], [x - R * 0.4, y + R * 0.2], [x - R * 0.1, y + R * 0.3]], 5, alpha('#5a4a5a', 0.8));
  seg(g, [[x - R * 0.4, y + R * 0.2], [x - R * 0.5, y + R * 0.6]], 4, alpha('#5a4a5a', 0.8));
};
const burger = (g, x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#e8a04a'; g.beginPath(); g.ellipse(0, -40, 150, 90, 0, Math.PI, Math.PI * 2); g.fill(); g.fillRect(-150, -42, 300, 10);
  for (let i = 0; i < 9; i++) { g.fillStyle = '#fff2c8'; g.beginPath(); g.ellipse(-90 + i * 22 + (i % 2) * 6, -90 + (i % 3) * 18, 7, 4, 0.4, 0, 7); g.fill(); }
  g.fillStyle = '#5bd04a'; g.beginPath(); for (let i = 0; i <= 12; i++) g.lineTo(-165 + i * 27.5, -20 + (i % 2) * 22); g.lineTo(165, -32); g.lineTo(-165, -32); g.fill();
  g.fillStyle = '#ffd02a'; poly(g, [[-160, -18], [160, -18], [120, 30], [60, 2], [-20, 34], [-160, 4]], '#ffd02a');
  g.fillStyle = '#5a2e1a'; rr(g, -158, -4, 316, 52, 24); g.fill();
  g.fillStyle = '#e8321a'; rr(g, -150, 44, 300, 16, 8); g.fill();
  g.fillStyle = '#d88a3a'; rr(g, -150, 58, 300, 54, 26); g.fill(); g.restore(); };
const plate = (g, x, y, w) => { g.fillStyle = '#e8e4f0'; g.beginPath(); g.ellipse(x, y, w, w * 0.22, 0, 0, 7); g.fill(); g.fillStyle = '#b8b4c8'; g.beginPath(); g.ellipse(x, y + 4, w * 0.95, w * 0.18, 0, 0, Math.PI); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, y - 3, w * 0.6, w * 0.11, 0, 0, 7); g.fill(); };
const flame = (g, x, y, h, w, c1, c2) => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y - h * 0.4, h * 0.9, c1, 0.5); g.fillStyle = linGrad(g, 0, y - h, 0, y, [alpha(c2, 0.95), alpha(c1, 0.95)]); g.beginPath(); g.moveTo(x - w, y); g.bezierCurveTo(x - w * 1.1, y - h * 0.5, x - w * 0.2, y - h * 0.6, x, y - h); g.bezierCurveTo(x + w * 0.3, y - h * 0.55, x + w * 1.1, y - h * 0.5, x + w, y); g.closePath(); g.fill(); g.restore(); };
const panel = (g, x, y, w, h, c, frame = '#141018') => { glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.8, c, 0.45); rr(g, x - 22, y - 22, w + 44, h + 44, 30); g.fillStyle = frame; g.fill(); g.save(); g.shadowColor = c; g.shadowBlur = 36; rr(g, x - 22, y - 22, w + 44, h + 44, 30); g.lineWidth = 6; g.strokeStyle = alpha(shade(c, 0.3), 0.9); g.stroke(); g.restore(); };

// ---------- the ten variants ----------
const V = {
  // 1 SMUG, full body right — the world froze, rain hangs in the air: "TIME / STOPPED."
  1(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.2, blur: 7, veil: 0.25, y: -100 });
    wash(g, '#1a3aff', '#3a0a8a', 0.8); bokeh(g, 101, 26, ['#5fa8ff', '#ffb03a', '#ff5ad8'], 0.32); vign(g, 0.5);
    clockFace(g, 760, 690, 250);
    const r = rng(5); for (let i = 0; i < 150; i++) { const x = r() * E.W, y = r() * E.H, s = 0.6 + r() * 1.2; glow(g, x, y, 14 * s, '#9fd8ff', 0.5); g.fillStyle = alpha('#e6f6ff', 0.9); g.beginPath(); g.moveTo(x, y - 12 * s); g.quadraticCurveTo(x + 5 * s, y + 2 * s, x, y + 5 * s); g.quadraticCurveTo(x - 5 * s, y + 2 * s, x, y - 12 * s); g.fill(); }
    motes(g, 3, 20, '#ffd08a', [300, 300, 900, 700]);
    heroFull(g, 1440, 1040, 185, 'smug', { pose: 'hips', dir: -1, rim: '#ffb03a', haloA: 0.3 });
  },
  // 2 SHOCKED, medium shot right, hands on head — vision is pure static: "I SAW / NOTHING."
  2(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#8a1aff', '#ff2a9a', 0.75); bokeh(g, 102, 22, ['#ff5ad8', '#8a6aff', '#5fd8ff']); vign(g, 0.5);
    const x = 170, y = 470, w = 700, h = 470; panel(g, x, y, w, h, '#ff6ad8');
    g.save(); rr(g, x, y, w, h, 10); g.clip(); const r = rng(9); for (let i = 0; i < w; i += 10) for (let j = 0; j < h; j += 10) { const v = Math.floor(60 + r() * 195); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x + i, y + j, 10, 10); }
    g.fillStyle = alpha('#ffffff', 0.15); g.fillRect(x, y + h * 0.42, w, 40); g.restore();
    rr(g, x + w / 2 - 230, y + h / 2 - 56, 460, 112, 16); g.fillStyle = '#0a0612'; g.fill(); digits(g, 'NO SIGNAL', x + w / 2, y + h / 2 + 30, 82, '#ff4ad8');
    motes(g, 22, 30, '#ffd0f0', [0, 0, 1920, 1080]);
    heroFull(g, 1420, 1450, 235, 'shocked', { pose: 'head', dir: -1, rim: '#ff6ad8', haloA: 0.35 });
  },
  // 3 SAD, full body left — hungry all the time, plates piled up: "ALWAYS / HUNGRY."
  3(g, t) {
    bgBlur(g, t, 'kitchenNight', {}, { z: 1.25, blur: 8, veil: 0.25, y: -100 });
    wash(g, '#ff8a1a', '#8a1a0a', 0.8); bokeh(g, 103, 22, ['#ffb04a', '#ff6a2a', '#ffe08a']); vign(g, 0.55);
    for (let i = 0; i < 13; i++) plate(g, 1640 + (i % 2) * 6, 1020 - i * 26, 170);
    for (let i = 0; i < 8; i++) plate(g, 1330 - (i % 2) * 6, 1040 - i * 26, 150);
    glow(g, 1010, 660, 400, '#ffcf6a', 0.55); burger(g, 1010, 660, 1.05);
    star(g, 1140, 560, 34, '#ffe0a0');
    motes(g, 33, 30, '#ffd08a', [900, 100, 1000, 900]);
    heroFull(g, 470, 1045, 175, 'sad', { pose: 'idle', dir: 1, rim: '#ffb04a', haloA: 0.3 });
  },
  // 4 CRAZY, big bust centre — head literally on fire, thermometer at 42°: "HEAD / ON FIRE."
  4(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.3, blur: 9, veil: 0.35, y: -120 });
    wash(g, '#ff2a1a', '#4a0a2a', 0.85); bokeh(g, 104, 22, ['#ff5a2a', '#ffb02a', '#ff2a8a']); vign(g, 0.55);
    const tx = 1620, ty = 120, th = 720; glow(g, tx, ty + th / 2, 460, '#ff3a1a', 0.5);
    rr(g, tx - 60, ty, 120, th, 60); g.fillStyle = '#f4efe6'; g.fill(); circle(g, tx, ty + th + 40, 110, '#f4efe6');
    rr(g, tx - 34, ty + 30, 68, th, 34); g.fillStyle = '#2a1a22'; g.fill();
    g.save(); g.shadowColor = '#ff2a1a'; g.shadowBlur = 40; rr(g, tx - 30, ty - 10, 60, th + 40, 30); g.fillStyle = '#ff2a1a'; g.fill(); circle(g, tx, ty + th + 40, 84, '#ff2a1a'); g.restore();
    for (let i = 0; i < 9; i++) seg(g, [[tx - 120, ty + 80 + i * 75], [tx - (i % 2 ? 85 : 70), ty + 80 + i * 75]], 7, '#f4efe6');
    star(g, tx, ty - 10, 46, '#ffe0a0'); digits(g, '42°C', tx - 250, ty + 160, 120, '#ffd08a');
    const hx = 930, hy = 690, r = 270;
    for (let i = 0; i < 7; i++) flame(g, hx - r * 0.75 + i * r * 0.25, hy - r * 0.7 + Math.abs(i - 3) * 30, 230 + (i % 2) * 120, 70, '#ff4a1a', '#ffe06a');
    hero(g, hx, hy, r, 'crazy', { rim: '#ff8a3a', haloA: 0.4, dir: 1 });
    for (let i = 0; i < 5; i++) { const sx = hx - 260 + i * 110, sy = hy - r - 90 - (i % 2) * 60; g.fillStyle = alpha('#ffffff', 0.12); g.beginPath(); g.arc(sx, sy, 50 + (i % 3) * 16, 0, 7); g.fill(); }
    motes(g, 44, 50, '#ffcf6a', [500, 0, 1400, 700]);
  },
  // 5 SHOCKED, full body right, arms up — a stopwatch frozen at 3 seconds: "IT LASTED / 3 SECONDS."
  5(g, t) {
    bgBlur(g, t, 'gym', {}, { z: 1.25, blur: 8, veil: 0.3, y: -100 });
    wash(g, '#0affc8', '#0a2a6a', 0.75); bokeh(g, 105, 24, ['#3fffd0', '#5fa8ff', '#d0ff5a']); vign(g, 0.55);
    const cx = 760, cy = 700, R = 270, c = '#3fffc8';
    glow(g, cx, cy, R * 2, c, 0.45);
    rr(g, cx - 50, cy - R - 90, 100, 70, 14); g.fillStyle = '#d8dce6'; g.fill(); rr(g, cx - 80, cy - R - 110, 160, 34, 12); g.fill();
    circle(g, cx, cy, R + 30, '#d8dce6'); circle(g, cx, cy, R + 8, '#0a1218'); circle(g, cx, cy, R - 8, '#060a0e');
    g.save(); g.shadowColor = c; g.shadowBlur = 30; g.strokeStyle = c; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, R - 34, -Math.PI / 2, -Math.PI / 2 + 0.3); g.stroke(); g.restore();
    g.strokeStyle = alpha(c, 0.15); g.lineWidth = 22; g.beginPath(); g.arc(cx, cy, R - 34, -Math.PI / 2 + 0.36, Math.PI * 1.5 - 0.06); g.stroke();
    digits(g, '00:03', cx, cy + 50, 150, '#d8fff4'); text(g, 'SEC', cx, cy + 120, { size: 40, color: alpha(c, 0.8), font: FONTS.ui, weight: 900, spacing: 8 });
    motes(g, 55, 30, '#c8fff0', [200, 200, 1700, 800]);
    heroFull(g, 1500, 1040, 180, 'shocked', { pose: 'up', dir: -1, rim: c, haloA: 0.3 });
  },
  // 6 CRAZY, full body centre — 3:33 at night, eyes wide open: "I CAN'T / SLEEP."
  6(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.2, blur: 7, veil: 0.35, y: -100 });
    wash(g, '#2a1aff', '#0a0a3a', 0.85); bokeh(g, 106, 20, ['#8a6aff', '#5fa8ff', '#ff3a5a'], 0.3); vign(g, 0.55);
    FX.moon(g, 1620, 190, 90, '#eef0ff'); circle(g, 1650, 170, 80, alpha('#1a1440', 0.55));
    FX.stars(g, 0, { seed: 6, count: 120, area: [900, 0, 1020, 500] });
    const bx = 1390, by = 650, bw = 440, bh = 220; glow(g, bx + bw / 2, by + bh / 2, 420, '#ff2a2a', 0.5);
    rr(g, bx, by, bw, bh, 40); g.fillStyle = '#121016'; g.fill(); rr(g, bx + 24, by + 24, bw - 48, bh - 48, 22); g.fillStyle = '#050306'; g.fill();
    digits(g, '3:33', bx + bw / 2, by + bh / 2 + 52, 150, '#ff3a3a');
    for (const k of [0.2, 0.8]) seg(g, [[bx + bw * k, by + bh], [bx + bw * k + (k - 0.5) * 40, by + bh + 40]], 14, '#121016');
    text(g, 'AM', bx + bw - 50, by + 60, { size: 30, color: '#ff6a6a', font: FONTS.ui, weight: 900 });
    motes(g, 66, 30, '#b8c8ff');
    heroFull(g, 960, 1040, 175, 'crazy', { pose: 'shrug', dir: 1, rim: '#8a6aff', haloA: 0.35 });
  },
  // 7 ANGRY, full body right, pointing — electricity bursts the light bulb: "DON'T / TOUCH ME."
  7(g, t) {
    bgBlur(g, t, 'street', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#5a2aff', '#0a0a5a', 0.85); bokeh(g, 107, 22, ['#8affff', '#8a6aff', '#ffffff'], 0.3); vign(g, 0.6);
    const bx = 620, by = 640; glow(g, bx, by, 520, '#fff2a0', 0.75); glow(g, bx, by, 220, '#ffffff', 0.8);
    circle(g, bx, by, 150, alpha('#fffbe0', 0.92)); rr(g, bx - 70, by + 130, 140, 120, 16); g.fillStyle = '#9aa0b0'; g.fill();
    for (let i = 0; i < 4; i++) { g.fillStyle = '#6a7080'; g.fillRect(bx - 70, by + 150 + i * 26, 140, 8); }
    seg(g, [[bx - 40, by + 40], [bx - 20, by - 30], [bx, by + 30], [bx + 20, by - 30], [bx + 40, by + 40]], 8, '#ff9a2a');
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, d = 200 + (i % 3) * 60; g.save(); g.translate(bx + Math.cos(a) * d, by + Math.sin(a) * d); g.rotate(a); poly(g, [[0, -14], [34, 0], [0, 14]], alpha('#e8f4ff', 0.85)); g.restore(); }
    const h = heroFull(g, 1420, 1040, 180, 'angry', { pose: 'point', dir: -1, rim: '#8affff', haloA: 0.35 });
    bolt(g, h.hands[-1][0], h.hands[-1][1], bx + 130, by + 20, '#9affff', 9, 3);
    bolt(g, h.head[0] - 120, h.head[1] - 150, h.head[0] - 380, h.head[1] - 380, '#9affff', 6, 7);
    bolt(g, h.head[0] + 150, h.head[1] - 100, h.head[0] + 380, h.head[1] - 320, '#9affff', 6, 8);
    motes(g, 77, 30, '#c8ffff');
  },
  // 8 SAD, medium shot left — forgot his own name: "I FORGOT / MY NAME."
  8(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.3, blur: 8, veil: 0.3, y: -120 });
    wash(g, '#ff2a8a', '#3a0a5a', 0.8); bokeh(g, 108, 24, ['#ff5ad8', '#ffb04a', '#8a6aff']); vign(g, 0.55);
    g.save(); g.translate(1390, 720); g.rotate(0.08); glow(g, 0, 0, 520, '#ff6ab0', 0.45);
    g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40; rr(g, -380, -250, 760, 500, 40); g.fillStyle = '#e8321a'; g.fill(); g.shadowBlur = 0;
    text(g, 'HELLO', 0, -150, { size: 110, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 8 });
    text(g, 'my name is', 0, -90, { size: 46, color: '#ffffff', font: FONTS.ui, weight: 800 });
    rr(g, -340, -50, 680, 260, 20); g.fillStyle = '#ffffff'; g.fill();
    text(g, '? ? ?', 0, 135, { size: 190, color: '#1a1a2a', font: FONTS.ui, weight: 900 });
    g.restore();
    motes(g, 88, 30, '#ffd0f0', [900, 100, 1000, 900]);
    heroFull(g, 540, 1500, 245, 'sad', { pose: 'shrug', dir: 1, rim: '#ff6ab0', haloA: 0.3 });
  },
  // 9 ANGRY, medium shot right, covering ears — a giant speaker blasting: "TOO / LOUD."
  9(g, t) {
    bgBlur(g, t, 'music', {}, { z: 1.25, blur: 8, veil: 0.35, y: -100 });
    wash(g, '#ffb01a', '#8a0a1a', 0.8); bokeh(g, 109, 24, ['#ffd04a', '#ff6a2a', '#ff2a6a']); vign(g, 0.55);
    const sx = 220, sy = 490, sw = 480, sh = 640; glow(g, sx + sw / 2, sy + sh / 2, 560, '#ffb03a', 0.45);
    rr(g, sx, sy, sw, sh, 30); g.fillStyle = '#16121a'; g.fill(); g.save(); g.shadowColor = '#ffb03a'; g.shadowBlur = 30; rr(g, sx, sy, sw, sh, 30); g.lineWidth = 6; g.strokeStyle = '#ffb03a'; g.stroke(); g.restore();
    for (const [cy, R] of [[sy + 150, 95], [sy + 430, 165]]) { circle(g, sx + sw / 2, cy, R + 14, '#2a2430'); circle(g, sx + sw / 2, cy, R, '#0a080c'); circle(g, sx + sw / 2, cy, R * 0.38, '#3a3440'); glow(g, sx + sw / 2, cy, R * 0.4, '#ffb03a', 0.4); }
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { g.strokeStyle = alpha('#ffd06a', 0.75 - i * 0.1); g.lineWidth = 16 - i * 1.5; g.beginPath(); g.arc(sx + sw / 2, sy + 430, 230 + i * 120, -0.6, 0.6); g.stroke(); } g.restore();
    motes(g, 99, 40, '#ffe08a');
    heroFull(g, 1450, 1460, 240, 'angry', { pose: 'head', dir: -1, rim: '#ffb03a', haloA: 0.35 });
  },
  // 10 SMUG, full body left — jackpot machine pouring coins: "BANNED / FOREVER."
  10(g, t) {
    bgBlur(g, t, 'fair', {}, { z: 1.25, blur: 8, veil: 0.3, y: -100 });
    wash(g, '#8a1aff', '#2a0a5a', 0.8); bokeh(g, 110, 28, ['#ffd02a', '#ff5ad8', '#8a6aff']); vign(g, 0.55);
    const mx = 1120, my = 540, mw = 560, mh = 640; glow(g, mx + mw / 2, my + mh / 2, 560, '#ffcf3a', 0.45);
    rr(g, mx, my, mw, mh, 40); g.fillStyle = linGrad(g, mx, 0, mx + mw, 0, ['#5a1a9a', '#8a3ad8', '#4a1488']); g.fill();
    rr(g, mx + 30, my - 110, mw - 60, 130, 30); g.fillStyle = '#e8321a'; g.fill(); g.save(); g.shadowColor = '#ffd02a'; g.shadowBlur = 30; rr(g, mx + 30, my - 110, mw - 60, 130, 30); g.lineWidth = 8; g.strokeStyle = '#ffd02a'; g.stroke(); g.restore();
    digits(g, 'JACKPOT', mx + mw / 2, my - 22, 84, '#fff2a0');
    rr(g, mx + 40, my + 80, mw - 80, 230, 20); g.fillStyle = '#0a0612'; g.fill();
    for (let i = 0; i < 3; i++) { const wx = mx + 60 + i * ((mw - 120) / 3); rr(g, wx + 6, my + 96, (mw - 120) / 3 - 12, 198, 14); g.fillStyle = '#fff6e0'; g.fill(); text(g, '7', wx + (mw - 120) / 6, my + 260, { size: 170, color: '#e8321a', font: FONTS.ui, weight: 900 }); }
    seg(g, [[mx + mw, my + 300], [mx + mw + 70, my + 300], [mx + mw + 70, my + 80]], 18, '#c8ccd8'); circle(g, mx + mw + 70, my + 70, 40, '#e8321a');
    rr(g, mx + 120, my + 460, mw - 240, 70, 20); g.fillStyle = '#0a0612'; g.fill();
    const r = rng(10); for (let i = 0; i < 46; i++) { const x = mx + 60 + r() * (mw + 200) - 100, y = my + 520 + r() * 520 - (i % 4) * 140, s = 26 + r() * 14; glow(g, x, y, s * 2, '#ffcf3a', 0.5); g.fillStyle = '#ffcf3a'; g.beginPath(); g.ellipse(x, y, s, s * (0.4 + r() * 0.6), r() * 3, 0, 7); g.fill(); g.strokeStyle = '#c8901a'; g.lineWidth = 4; g.stroke(); }
    star(g, mx + 80, my - 120, 44, '#fff2a0'); star(g, mx + mw - 40, my + 40, 30, '#fff2a0');
    heroFull(g, 470, 1045, 175, 'smug', { pose: 'hips', dir: 1, rim: '#ffcf3a', haloA: 0.3 });
  },
};

for (const s of E.shots) if (s.params?.tpl === 'ifv2') registerShot(s.id, { draw(g, t, info) { V[info.k](g, t); } });
