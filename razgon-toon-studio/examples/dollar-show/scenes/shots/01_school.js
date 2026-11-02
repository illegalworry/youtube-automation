// shots/01_school.js — the school parking lot: Max arrives, Jay waves; then Jay's "no way" reaction.
import { V, registerShot, layer, clamp, prog, ease } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring, fg, travel } from '/engine/motion.js';
import { drawToon, toonHeadPos, toonBubble } from '/engine/toon.js';
import { schoolLot, toonCar } from '/engine/toonsets.js';
import { MAX, JAY } from '../cast.js';

const S = () => V(1.35, 1.5);

// s01 — wide establishing: the camera drifts right with Max as he walks in; Jay waves him over.
registerShot('s01', { draw(g, t, info) {
  const cam = camPath(t, [[0, { z: 1.0, x: -140 }], [1.9, { z: 1.04, x: -50 }], [info.dur, { z: 1.08, x: -10 }]]);
  const { GY, CX, front } = schoolLot(g, t, cam);
  const walkEnd = 1.9, k = travel(t, 0, walkEnd, { accel: 0.05, brake: 0.18 }), mx = CX - 600 + 480 * k;
  const maxPose = t < walkEnd ? walkPose(t * Math.PI * 2 * 0.9) : breathe(POSES.stand, t);
  const jayPose = posesSpring(t, [[0, breathe(POSES.stand, t, 1, 2)], [1.4, POSES.wave], [2.9, breathe(POSES.relaxed, t, 1, 2)]]);
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: mx, y: GY, s: S(), facing: 1, pose: maxPose, outfit: MAX, expr: t > 1.6 ? 'smile' : 'neutral', blink: t % 3.1 > 3.0 });
    drawToon(g, { x: CX + 90, y: GY, s: S(), facing: -1, pose: jayPose, outfit: JAY, expr: t > 1.3 ? 'grin' : 'smile', blink: t % 2.7 > 2.6 });
  });
  front(g);
} });

// s02 — medium two-shot: Jay hears the plan, hands on head, wince ("NO WAY"); soft car in the foreground.
registerShot('s02', { draw(g, t, info) {
  const hit = 0.55, im = impact(t, hit, { amp: 10 });
  const base = camPath(t, [[0, { z: 1.62, x: 20, y: 150 }], [info.dur, { z: 1.72, x: 40, y: 160 }]]);
  const cam = camAdd(camAdd(base, drift(t, 5, 3)), { x: im.x, y: im.y, r: im.r });
  const { GY, CX } = schoolLot(g, t, cam);
  const jay = { x: CX + 90, y: GY, s: S(), facing: -1, outfit: JAY, pose: posesSpring(t, [[0, POSES.relaxed], [hit - 0.15, POSES.handsOnHead]]), expr: t > hit - 0.1 ? 'wince' : 'grin' };
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX - 90, y: GY, s: S(), facing: 1, pose: breathe(POSES.stand, t), outfit: MAX, expr: t > hit + 0.25 ? 'surprised' : 'smile', blink: t % 3.1 > 3.0 });
    drawToon(g, jay);
    const [hx, hy, hr] = toonHeadPos(jay);
    const k = clamp(prog(t, hit, hit + 0.18)); if (k > 0) toonBubble(g, hx + 30, hy - hr - 30, 'NO WAY!', { k: ease.outBack(k), size: 30, tail: -20 });
  });
  fg(g, cam, (g) => toonCar(g, CX + 700, GY + 300, 1.5, '#3f8a55', { side: -1 }), { depth: 1.8, blur: 14 });
} });
