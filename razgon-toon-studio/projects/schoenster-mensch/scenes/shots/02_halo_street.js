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

// s061 — wide: ring of phones around Sam, counter "30 HANDYS"
registerShot('s061', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.2, y: 60, x: 0 }], [info.dur, { z: 1.32, y: 70, x: 20 }]]), drift(t, 4, 2));
  const { GY, CX, M } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    const ring = [[-560, 0, 1], [-400, 30, 1], [-250, 50, 1], [250, 50, -1], [400, 30, -1], [560, 0, -1], [-690, -20, 1], [690, -20, -1]];
    ring.forEach(([dx, dy, f], i) => drawToon(g, { x: CX + dx, y: GY + dy - 30, s: 1.15, facing: f, outfit: EXTRAS[i % EXTRAS.length], pose: breathe(PHONE_UP, t, 1, i), prop: 'phone', expr: 'awe', look: [-f * -0.5, 0], blink: blinkAt(t, 3 + i * 0.3, i) }));
    drawToon(g, { x: CX, y: GY + 20, s: 1.3, facing: 1, outfit: SAM, pose: breathe(POSES.crossArms, t), expr: 'nervous', look: [0.4, -0.1], blink: blinkAt(t, 2.8) });
  });
  counter(g, t, { from: 0, to: 30, start: 0.2, dur: 1.0, x: E.W * 0.5, y: E.H * 0.2, label: 'HANDYS' });
} });

// s065 — giant close-up: Sam confused, "…WAS EIGENTLICH?"
registerShot('s065', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.5, x: 200, y: -150 })); veil(g, '#ffffff', 0.06);
  const im = impact(t, 0.15, { amp: 6 });
  g.save(); g.translate(im.x, im.y);
  const r = V(260, 290) * (1 + 0.03 * t);
  bigToon(g, E.W * 0.42, E.H * 0.5, r, { outfit: SAM, expr: 'confused', look: [0.5, -0.2], rimSide: 1, tilt: -0.06, blink: blinkAt(t, 2.6) });
  toonBubble(g, E.W * 0.74, E.H * 0.3, '…WAS EIGENTLICH?', { size: 46, k: Math.min(1, t * 5) });
  g.restore();
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
