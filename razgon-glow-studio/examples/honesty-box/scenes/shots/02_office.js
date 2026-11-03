// shots/02_office.js — the office honesty box: chapter title, flowers → eyes, the stat card, the sly look.
import { E, V, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, alpha } from '/engine/core.js';
import { drawGlow, bigGlow, idle, gPosesAt, blinkAt } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd, spring } from '/engine/motion.js';
import { ROB, MAE, JUNE } from '../cast.js';

// the poster picture: a vase of flowers that turns into a pair of watching eyes (k = 0 flowers … 1 eyes)
function posterArt(k) {
  return (g, x, y, w, h) => {
    g.fillStyle = '#efe4cf'; g.fillRect(x, y, w, h);
    if (k < 1) { g.save(); g.globalAlpha *= 1 - k; const cx = x + w / 2, by = y + h * 0.92;
      g.fillStyle = '#4a72b8'; g.beginPath(); g.ellipse(cx, by - h * 0.18, w * 0.13, h * 0.2, 0, 0, Math.PI * 2); g.fill();
      for (const [dx, dy, c] of [[-0.22, 0.42, '#f2c14a'], [0, 0.3, '#e85a5a'], [0.22, 0.4, '#e8823a']]) { g.strokeStyle = '#5a8a4a'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, by - h * 0.3); g.lineTo(cx + dx * w, y + dy * h); g.stroke(); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; circle(g, cx + dx * w + Math.cos(a) * 12, y + dy * h + Math.sin(a) * 12, 9, c); } circle(g, cx + dx * w, y + dy * h, 7, '#fff2c0'); }
      g.restore(); }
    if (k > 0) { g.save(); g.globalAlpha *= k; g.fillStyle = '#2e3452'; g.fillRect(x, y, w, h); for (const dx of [-0.17, 0.17]) { g.fillStyle = '#f2efe8'; g.beginPath(); g.ellipse(x + w * (0.5 + dx), y + h * 0.5, w * 0.08, h * 0.22, 0, 0, Math.PI * 2); g.fill(); } g.restore(); }
  };
}
const menu = (k) => ({ title: 'HONESTY BOX', rows: [['TEA', '30p'], ['COFFEE', '50p'], ['MILK', '10p']], img: posterArt(k) });
const rimOf = (M) => ({ color: M.rim, dir: [0.2, -1] });

// s004 — "Grown-ups are no different. Take an office honesty box."  three colleagues at the counter + chapter title
registerShot('s004', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.04, x: -40 }], [info.dur, { z: 1.0, x: 30 }]]), drift(t, 3, 9));
  const r = G.kitchen(g, t, cam, { menu: menu(0), steam: 0.6, coins: 0 });
  layer(g, cam, 1, (g) => {
    const s = V(1.6, 1.5), rim = rimOf(r.M);
    drawGlow(g, { x: E.W * V(0.3, 0.2), y: r.GY, s, facing: 1, outfit: ROB, pose: idle('give', t, 1, 1), expr: 'calm', look: [1, 0.5], rim, prop: 'kettle', turn: 0.4 });
    drawGlow(g, { x: E.W * V(0.52, 0.5), y: r.GY, s, facing: -1, outfit: MAE, pose: idle('holdFront', t, 1, 2), expr: 'smile', rim, prop: { type: 'mug', color: '#4a68c0' }, blink: blinkAt(t, 3.1) });
    drawGlow(g, { x: E.W * V(0.8, 0.82), y: r.GY, s, facing: -1, outfit: JUNE, pose: idle('phone', t, 1, 3), expr: 'bored', rim, prop: 'phone', turn: 0.2 });
  });
  UI.chapter(g, t, { num: 'Chapter 2', title: 'The eyes on the wall', start: 0.3, dur: info.dur });
} });

// s005 — "Swap the flowers on the poster for a pair of eyes, and payments almost triple."
registerShot('s005', { draw(g, t, info) {
  const cam = camPath(t, [[0, { z: 1.25, x: -80, y: -170 }], [1.2, { z: 1.55, x: -60, y: -230 }], [info.dur, { z: 1.62, x: -40, y: -240 }]]);
  const k = ease.inOut(prog(t, 0.6, 1.2));
  G.kitchen(g, t, cam, { menu: menu(k), dof: 0, mugs: true });
  UI.statCard(g, t, { x: E.W * V(0.64, 0.14), y: E.H * V(0.14, 0.56), w: V(470, 760), h: V(560, 640), start: 1.3, badge: '≈ 3×',
    bars: [{ label: 'FLOWERS', v: 0.3, color: '#d9a8c8', icon: UI.icons.flower }, { label: 'EYES', v: 0.88, color: '#f3a64a', icon: UI.icons.eyes }], cite: 'Bateson, Nettle & Roberts 2006' });
} });

// s006 — "Paper eyes. That's all it takes."  close-up, eyes slide toward the poster, sly
registerShot('s006', { draw(g, t, info) {
  const cam = camAdd({ z: 1.12, x: -120, y: -80 }, drift(t, 5, 4));
  blurLayer(g, 7, (g) => G.kitchen(g, t, cam, { menu: menu(1), steam: 0.4 }));
  veil(g, '#1a2030', 0.12);
  const sl = spring(t, 0.5, { freq: 1.6, damp: 0.6 });
  bigGlow(g, E.W * V(0.62, 0.5), E.H * V(0.6, 0.58), V(240, 250), { outfit: JUNE, expr: t < 0.5 ? 'look' : 'sly', look: [-lerp(0, 1, sl), -0.1], turn: 0.1, rim: { color: '#eef5ff' }, rimSide: -1, blink: blinkAt(t, 2.2) });
} });
