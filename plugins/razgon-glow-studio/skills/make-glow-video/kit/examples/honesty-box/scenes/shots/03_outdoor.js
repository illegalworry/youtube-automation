// shots/03_outdoor.js — the invisible hand at the farm stand, the park ending + end card.
import { E, V, registerShot, layer, ease, prog, lerp } from '/engine/core.js';
import { drawGlow, idle, gPosesAt, gWalk, blinkAt } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd } from '/engine/motion.js';
import { RED, TEAL, NAVY } from '../cast.js';

// s007 — "So what would you do… if you were truly invisible?"  an outline reaches for an apple; the pay box waits
registerShot('s007', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.02, x: -40 }], [info.dur, { z: 1.1, x: 40 }]]), drift(t, 3, 3));
  const r = G.farmStand(g, t, cam, {});
  layer(g, cam, 1, (g) => {
    const pose = gPosesAt(t, [[0, 'stand'], [0.9, 'reach'], [1.7, 'holdUp']], 0.4);
    drawGlow(g, { x: r.standX - V(40, 30), y: r.GY, s: V(1.6, 1.5), facing: 1, outfit: RED, pose: idle(pose, t, 1, 5), expr: t < 1.7 ? 'look' : 'sly', look: [0.6, 0.3], invisible: 0.93, edgeColor: '#fff0d8', rim: { color: r.M.rim }, prop: t > 1.4 ? 'apple' : null });
  });
} });

// s008 — park at dusk: friends on the bench, a walker, invisible eyes watching; end card question
registerShot('s008', { draw(g, t, info) {
  const cam = camAdd({ z: 1.0, x: 0 }, drift(t, 4, 7));
  const r = G.park(g, t, cam, {});
  layer(g, cam, 1, (g) => {
    const rim = { color: r.M.rim, dir: [0.7, -0.7] }, s = V(1.35, 1.3);
    drawGlow(g, { x: r.benchX - V(90, 80), y: r.GY, s, facing: 1, outfit: RED, pose: idle('sitPhone', t, 1, 1), expr: 'calm', rim, prop: 'phone', turn: 0.1 });
    drawGlow(g, { x: r.benchX + V(90, 80), y: r.GY, s, facing: -1, outfit: NAVY, pose: idle('sitFront', t, 1, 2), expr: 'content', rim, turn: 0.2, blink: blinkAt(t, 3) });
    drawGlow(g, { x: E.W * V(0.15, 0.1) + t * 110, y: r.GY, s: s * 0.95, facing: 1, outfit: TEAL, pose: gWalk(t * 5.6), turn: 0.85, expr: 'happy', rim });
    drawGlow(g, { x: E.W * V(0.3, 0.25), y: r.GY - 10, s, facing: 1, outfit: RED, pose: idle('stand', t), expr: 'open', invisible: 0.95, edgeColor: '#ffe6d8', rim, look: [1, 0.2] });
  });
  UI.endCard(g, t, { question: 'What would you do?', start: 0.8 });
} });
