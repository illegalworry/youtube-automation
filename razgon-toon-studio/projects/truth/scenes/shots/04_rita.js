import { E, V, registerShot, layer, clamp, prog, ease, text } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring } from '/engine/motion.js';
import { drawToon, bigToon, toonHeadPos, toonBubble } from '/engine/toon.js';
import { classroom } from '/engine/toonsets.js';
import { LYOSHA, RITA } from '../cast.js';

const SC = () => V(1.75, 1.7);

// s008 — Rita with a folder asks a loaded question.
registerShot('s008', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.15, x: 20 }], [info.dur, { z: 1.3, x: -10, y: 60 }]]), drift(t, 4, 5));
  const { GY, CX, front } = classroom(g, t, cam, { onBoard: (g, x, y, w, h) => { g.fillStyle = '#f7f7f4'; g.fillRect(x, y, w, h); } });
  const rita = { x: CX - 300, y: GY, s: SC(), facing: 1, outfit: RITA, pose: posesSpring(t, [[0, POSES.holdFront], [0.7, POSES.shrug]]), expr: 'smile', prop: 'book', blink: t % 3.4 > 3.3 };
  layer(g, cam, 1, (g) => {
    drawToon(g, rita);
    drawToon(g, { x: CX + 270, y: GY, s: SC(), facing: -1, outfit: LYOSHA, pose: breathe(POSES.relaxed, t), expr: t > 1.6 ? 'nervous' : 'neutral', look: [-1, 0] });
    const [hx, hy, hr] = toonHeadPos(rita);
    const k = clamp(prog(t, 0.9, 1.15)); if (k > 0) toonBubble(g, hx + 40, hy - hr - 40, 'ТЫ ВЕДЬ НЕ ЗЛИШЬСЯ?', { k: ease.outBack(k), size: 34, tail: -20 });
  });
  front(g);
} });

// s009 — cliffhanger: Lyosha opens his mouth, sweat, push-in.
registerShot('s009', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 0.95 }], [2.2, { z: 1.12 }], [info.dur, { z: 1.22 }]]), drift(t, 5, 1));
  const { GY, CX } = classroom(g, t, cam, {});
  layer(g, cam, 1, (g) => {
    bigToon(g, CX, GY - V(380, 460), V(280, 320), { outfit: LYOSHA, expr: t < 1.2 ? 'nervous' : 'shocked', look: [0, 0], rimSide: 1, blink: false });
    const sw = clamp(prog(t, 0.5, 1.2)); if (sw > 0) { g.fillStyle = '#9ad3ef'; g.beginPath(); g.ellipse(CX + 230, GY - V(560, 640) + sw * 60, 18, 28, 0, 0, 7); g.fill(); }
  });
} });
