import { E, V, registerShot, layer, blurLayer, veil, clamp, prog, ease, text, FONTS } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring, fg } from '/engine/motion.js';
import { drawToon, bigToon, toonHeadPos, toonBubble } from '/engine/toon.js';
import { classroom } from '/engine/toonsets.js';
import { LYOSHA, BOSS, RITA } from '../cast.js';

const SC = () => V(1.75, 1.7);
const slide = (t, k = 1) => (g, x, y, w, h) => {
  g.save(); g.globalAlpha = k;
  g.fillStyle = '#e8802c'; g.fillRect(x + 30, y + 30, w - 60, 70);
  text(g, 'МОЯ ГЕНИАЛЬНАЯ', x + w / 2, y + 66, { size: 44, font: FONTS.ui, weight: 900, color: '#fff' });
  text(g, 'ПРЕЗЕНТАЦИЯ', x + w / 2, y + 150, { size: 74, font: FONTS.ui, weight: 900, color: '#24272e' });
  for (let i = 0; i < 4; i++) { const bh = 40 + i * 28; g.fillStyle = ['#2fb491', '#e8c04a', '#d6533c', '#3f63c8'][i]; g.fillRect(x + 80 + i * 150, y + h - 30 - bh, 100, bh); }
  g.restore();
};

// s001 — hook: boss presents his slide, asks Lyosha; slow push-in.
registerShot('s001', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.1, x: -40 }], [info.dur, { z: 1.3, x: 10, y: 60 }]]), drift(t, 4, 2));
  const { GY, CX, front } = classroom(g, t, cam, { onBoard: slide(t) });
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX - 470, y: GY, s: SC(), facing: 1, outfit: BOSS, pose: posesSpring(t, [[0, POSES.stand], [0.5, POSES.explain], [1.6, POSES.point]]), expr: 'smile', blink: t % 3.2 > 3.1 });
    drawToon(g, { x: CX + 280, y: GY, s: SC(), facing: -1, outfit: LYOSHA, pose: breathe(POSES.relaxed, t), expr: t > 1.9 ? 'worried' : 'neutral', blink: t % 2.8 > 2.7, look: [-1, 0] });
  });
  front(g);
} });

// s002 — "Мильярик?": boss waits, close-up with a question bubble.
registerShot('s002', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.06 }]]), drift(t, 3, 4));
  const { GY, CX } = classroom(g, t, cam, { onBoard: slide(t) });
  blurLayer(g, 12, (g) => {}, cam, 1);
  layer(g, cam, 1.0, (g) => {
    bigToon(g, CX - 140, GY - V(380, 460), V(270, 300), { outfit: BOSS, expr: t > 0.6 ? 'sly' : 'smile', look: [0.6, 0.2], rimSide: 1, blink: t % 3 > 2.9 });
    const k = clamp(prog(t, 0.35, 0.6)); if (k > 0) toonBubble(g, CX + 360, GY - V(520, 600), '?', { k: ease.outBack(k), size: 70, tail: -30 });
  });
} });
