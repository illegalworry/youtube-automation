// shots/02_halo_street.js — Halo board, the ring of phones, Sam's confused close-up; plus the final street two-shot.
import { E, V, registerShot, layer, blurLayer, veil, text, FONTS, S, circle, seg, wordTime } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring, fg } from '/engine/motion.js';
import { drawToon, bigToon, toonBubble, toonHeadPos } from '/engine/toon.js';
import { classroom, street, toonTree } from '/engine/toonsets.js';
import { labelBox, counter } from '/engine/toonui.js';
import { SAM, JONAS, EXTRAS, NORMAL } from '../cast.js';

const blinkAt = (t, per, off = 0) => (t + off) % per > per - 0.12;
const PHONE_UP = { ...POSES.holdFront, hF: [34, -196], eF: [26, -160] };

// s031 — whiteboard: "HALO-EFFEKT", a head drawn on the board, a golden halo is drawn above it
registerShot('s031', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.45, y: -150, x: -60 }], [info.dur, { z: 1.6, y: -170, x: -70 }]]), drift(t, 3, 4));
  classroom(g, t, cam, { onBoard: (g, x, y, w, h) => {
    const ui = S().ui, cx = x + w * 0.3, cy = y + h * 0.58;
    circle(g, cx, cy, 70, '#1b1b20'); seg(g, [[cx, cy + 70], [cx, cy + 120]], 10, '#1b1b20');
    const p = Math.min(1, Math.max(0, (t - 0.4) / 0.6));
    if (p > 0) { g.save(); g.strokeStyle = ui.gold; g.lineWidth = 12; g.beginPath(); g.ellipse(cx, cy - 100, 90, 24, 0, -Math.PI, -Math.PI + p * Math.PI * 2); g.stroke(); g.restore(); }
    text(g, 'HALO-EFFEKT', x + w * 0.68, y + h * 0.5, { size: 64, font: FONTS.hand, weight: 400, color: '#2c4a8a' });
  } });
  layer(g, cam, 1, (g) => {});
} });

// s167 — two-shot on the street at dusk: Sam and Jonas laughing, "real"
registerShot('s167', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.6, y: 120, x: -20 }], [info.dur, { z: 1.72, y: 130, x: 0 }]]), drift(t, 4, 5));
  const { GY, CX, M } = street(g, t, cam, { mood: 'sunset' });
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX - 100, y: GY, s: 1.35, facing: 1, outfit: SAM, pose: posesSpring(t, [[0, POSES.relaxed], [0.3, POSES.cheer]]), expr: 'joy', blink: blinkAt(t, 2.9) });
    drawToon(g, { x: CX + 110, y: GY, s: 1.35, facing: -1, outfit: JONAS, pose: breathe(POSES.handsOnHead, t, 1, 2), expr: 'happy', blink: blinkAt(t, 3.4, 1) });
  });
  fg(g, cam, (g) => toonTree(g, CX + 820, GY + 900, 1.6, M, 4, { trunk: 600, w: 300, h: 220 }), { depth: 1.8, blur: 16 });
  labelBox(g, t, 'ENDLICH ECHT', E.W * 0.5, E.H * 0.14, { start: 0.3 });
} });
