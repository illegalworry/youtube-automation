// shots/04_ring_parking.js — the boxing "show", the walk home through the car park, and the end screen.
import { E, V, registerShot, layer } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift } from '/engine/motion.js';
import { drawToon } from '/engine/toon.js';
import { boxingGym, undergroundParking } from '/engine/toonsets.js';
import { labelBox, toonEnd } from '/engine/toonui.js';
import { MAX_BOXING, RIVAL, MAX, LEO, JAY, ZOE, SAM, MIA } from '../cast.js';

// s07 — the ring: both fighters bounce in guard; ROUND 1 pops above them
registerShot('s07', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.42, y: 40, x: -20 }], [info.dur, { z: 1.52, y: 40, x: 0 }]]), drift(t, 4, 8));
  const r = boxingGym(g, t, cam);
  const bob = (k) => Math.abs(Math.sin((t + k) * Math.PI * 2.2)) * -8;
  const guard = { ...POSES.ready, hF: [34, -170], eF: [30, -138], hB: [22, -172], eB: [10, -138] };
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: r.CX - 220, y: r.deck + bob(0), s: 1.25, facing: 1, pose: breathe(guard, t), outfit: MAX_BOXING, expr: 'smile', shadow: false });
    drawToon(g, { x: r.CX + 200, y: r.deck + bob(0.2), s: 1.25, facing: -1, pose: breathe(guard, t, 1, 4), outfit: RIVAL, expr: 'determined', shadow: false });
  });
  r.front(g);
  layer(g, cam, 1, (g) => labelBox(g, t, 'ROUND 1', r.CX, r.deck - 420, { start: 0.3 }));
} });

// s08 — tracking walk through the underground car park; a foreground pillar wipes past
registerShot('s08', { draw(g, t, info) {
  const walkX = -620 + t * 210;                      // world x offset of the pair (constant walk speed)
  const cam = camAdd({ x: walkX * 0.8 + 90, z: 1.3, y: 120 }, drift(t, 3, 6));
  const { GY, CX, front } = undergroundParking(g, t, cam, { pillar: true, pillarX: 520 });
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: CX + walkX, y: GY, s: 1.25, facing: 1, pose: walkPose(t * Math.PI * 2 * 1.2), outfit: LEO, expr: 'happy', prop: { type: 'sign', text: 'SHOW $1', w: 90, h: 44, size: 26 } });
    drawToon(g, { x: CX + walkX + 170, y: GY, s: 1.35, facing: 1, pose: walkPose(t * Math.PI * 2 * 0.9 + 1), outfit: MAX, expr: 'smile', look: [-0.6, 0] });
  });
  front(g);
} });

// s09 — end screen: the question + the whole cast lined up
registerShot('s09', { draw(g, t, info) {
  toonEnd(g, t, { lines: ['WOULD YOU', 'PAY $1?'], bg: '#8cc4ea' });
  const cast = [ZOE, JAY, MAX, LEO, SAM, MIA], GY = E.H * V(0.8, 0.72);
  g.fillStyle = '#86b965'; g.fillRect(-E.W, GY, E.W * 3, E.H);
  cast.forEach((o, i) => drawToon(g, { x: E.W / 2 + (i - 2.5) * V(230, 160), y: GY, s: V(1.45, 1.1), facing: i < 3 ? 1 : -1, pose: breathe(i === 3 ? POSES.cheer : POSES.stand, t, 1, i), outfit: o, expr: i === 3 ? 'joy' : 'smile', blink: (t + i * 0.7) % 3 > 2.9 }));
} });
