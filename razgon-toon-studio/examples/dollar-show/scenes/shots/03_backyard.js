// shots/03_backyard.js — Leo's "SHOW $1" stand: the sign, the queue, the money close-up.
import { E, V, registerShot, layer, blurLayer, veil } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring, fg } from '/engine/motion.js';
import { drawToon, bigToon } from '/engine/toon.js';
import { backyard, toonTree } from '/engine/toonsets.js';
import { sticker } from '/engine/toonui.js';
import { ticketStand } from '../sets/props.js';
import { LEO, ZOE, SAM, MIA } from '../cast.js';

const SIGN = { type: 'sign', text: 'SHOW $1', w: 104, h: 50, size: 30, dy: -6 };

// s04 — medium on Leo behind his box, holding the sign up; push in, sign pops up on the spring
registerShot('s04', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.75, y: 70, x: 30 }], [info.dur, { z: 1.9, y: 80, x: 40 }]]), drift(t, 4, 2));
  const { GY, CX, M } = backyard(g, t, cam);
  const up = 0.35, pose = posesSpring(t, [[0, breathe(POSES.stand, t)], [up, { ...POSES.holdFront, hF: [30, -176], eF: [26, -150], hB: [20, -178], eB: [14, -150] }]]);
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX + 20, y: GY - 10, s: 1.6, facing: 1, pose, outfit: LEO, expr: t > up ? 'grin' : 'smile', prop: t > up - 0.05 ? SIGN : null, blink: t % 2.9 > 2.8, look: [0.4, 0] });
    ticketStand(g, CX + 40, GY + 12, 0.9);
  });
  fg(g, cam, (g) => toonTree(g, CX - 760, GY + 900, 1.6, M, 7, { trunk: 600, w: 300, h: 220 }), { depth: 1.8, blur: 16 });
} });

// s05 — wide: the queue. The camera slides along the line of kids toward the stand.
registerShot('s05', { draw(g, t, info) {
  const cam = camPath(t, [[0, { z: 1.25, x: 260, y: 70 }], [info.dur, { z: 1.2, x: -40, y: 60 }]]);
  const { GY, CX } = backyard(g, t, cam);
  const queue = [[ZOE, 'smile', POSES.stand, null], [SAM, 'smirk', POSES.think, null], [MIA, 'happy', { ...POSES.holdFront, hF: [30, -176], eF: [24, -146] }, 'cash']];
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX - 470, y: GY, s: 1.35, facing: 1, pose: breathe(POSES.relaxed, t), outfit: LEO, expr: 'happy', blink: t % 2.9 > 2.8 });
    ticketStand(g, CX - 360, GY + 20, 0.75);
    queue.forEach(([o, ex, p, prop], i) => drawToon(g, { x: CX - 120 + i * 230, y: GY + 10 + i * 12, s: 1.35 + i * 0.03, facing: -1, pose: breathe(p, t, 1, i + 3), outfit: o, expr: ex, prop, blink: (t + i) % 3.2 > 3.1 }));
  });
} });

// s06 — giant close-up: Leo counts the money, star eyes; "$3" sticker slams in with a camera hit
registerShot('s06', { draw(g, t, info) {
  const hit = 0.45, im = impact(t, hit, { amp: 12 });
  blurLayer(g, 14, (g) => backyard(g, t, { z: 1.6, x: -200, y: -260 })); veil(g, '#ffffff', 0.06);
  g.save(); g.translate(im.x, im.y);
  const r = V(250, 280) * (1 + 0.04 * t);
  bigToon(g, E.W * V(0.4, 0.5), E.H * V(0.48, 0.45), r, { outfit: LEO, expr: t > hit ? 'excited' : 'grin', rimSide: 1, glow: '#fff3c8' });
  sticker(g, t, '$3', E.W * V(0.72, 0.72), E.H * V(0.34, 0.2), { start: hit - 0.05, r: V(110, 120), color: '#3fae5a' });
  g.restore();
} });
