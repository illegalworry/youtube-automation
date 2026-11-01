// shots/02_garage.js — night in the garage: Max finds the old headphones on the shelf.
import { V, registerShot, layer } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, posesSpring } from '/engine/motion.js';
import { drawToon } from '/engine/toon.js';
import { garage } from '/engine/toonsets.js';
import { MAX } from '../cast.js';

// s03 — slow push toward Max by the shelf; he lifts the headphones and looks at them (look follows the prop)
registerShot('s03', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.3, x: -200, y: 90 }], [info.dur, { z: 1.42, x: -180, y: 100 }]]), drift(t, 4, 5));
  const { GY, CX } = garage(g, t, cam);
  const lift = 0.9, pose = posesSpring(t, [[0, breathe(POSES.stand, t)], [lift, { ...POSES.holdFront, hF: [30, -168], eF: [22, -140] }]]);
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX - V(250, 120) + 40, y: GY, s: V(1.45, 1.6), facing: 1, pose, outfit: MAX, expr: t > lift + 0.4 ? 'sly' : 'neutral', look: t > lift ? [0.8, 0.6] : [0, 0],
      prop: t > lift - 0.1 ? { type: 'headphones', color: '#e0883a' } : null, blink: t % 3.3 > 3.2 });
  });
} });
