import { E, V, registerShot, layer, clamp, prog, ease, text } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring, fg, kText } from '/engine/motion.js';
import { drawToon, bigToon, toonHeadPos, toonBubble } from '/engine/toon.js';
import { bedroom } from '/engine/toonsets.js';
import { LYOSHA } from '../cast.js';

const SC = () => V(1.85, 1.7);

// s003 — time skip: morning, the word "НОРМАЛЬНО" slams and gets stuck.
registerShot('s003', { draw(g, t, info) {
  const hit = 1.0, im = impact(t, hit, { amp: 9 });
  const cam = camAdd(camAdd(camPath(t, [[0, { z: 1.2, x: -60, y: 60 }], [info.dur, { z: 1.45, x: 10, y: 90 }]]), drift(t, 4, 6)), { x: im.x, y: im.y, r: im.r });
  const { GY, CX } = bedroom(g, t, cam, { night: false });
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX - 40, y: GY, s: SC(), facing: 1, outfit: LYOSHA, pose: posesSpring(t, [[0, breathe(POSES.stand, t)], [hit + 0.1, POSES.handsOnHead]]), expr: t > hit ? 'scared' : 'smile', blink: t % 3 > 2.9 });
  });
  kText(g, t, 'НОРМАЛЬНО', E.W / 2 + 380, V(130, 300), { start: hit - 0.05, mode: 'slam', size: V(110, 130), font: 'Nunito', weight: 900, color: '#d6533c' });
} });

// s004 — close-up: tries to lie, truth comes out.
registerShot('s004', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.12 }]]), drift(t, 4, 8));
  const { GY, CX } = bedroom(g, t, cam, { night: false });
  layer(g, cam, 1, (g) => {
    bigToon(g, CX - 160, GY - V(380, 460), V(270, 300), { outfit: LYOSHA, expr: t < 1.6 ? 'smile' : t < 2.0 ? 'confused' : 'sad', look: [0.4, 0], rimSide: 1, blink: t % 2.7 > 2.6 });
    const k1 = clamp(prog(t, 0.25, 0.5)) * (1 - clamp(prog(t, 1.45, 1.6)));
    if (k1 > 0) toonBubble(g, CX + 380, GY - V(520, 600), 'ВСЁ ОТЛИЧНО!', { k: ease.outBack(clamp(prog(t, 0.25, 0.5))), size: 40, tail: -30 });
    const k2 = clamp(prog(t, 1.75, 2.0)); if (k2 > 0) toonBubble(g, CX + 380, GY - V(520, 600), 'Я НЕ СПАЛ…', { k: ease.outBack(k2), size: 40, tail: -30 });
  });
} });
