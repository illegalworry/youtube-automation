// shots/01_porch.js — the Halloween porch: the watcher, the 57 %, the watcher fades, the 8 %.
import { E, V, registerShot, layer, ease, prog, clamp, lerp } from '/engine/core.js';
import { drawGlow, gPosesAt, idle, blinkAt } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd } from '/engine/motion.js';
import { NEIGHBOUR, WITCH, GHOST, SKY, ASTRO } from '../cast.js';

const rimOf = (M) => ({ color: M.rim, dir: [-0.85, -0.5] });          // key light = the sconce on the left
const neighbourX = () => E.W * V(0.17, 0.2);

function neighbour(g, M, GY, t, o = {}) {
  drawGlow(g, { x: neighbourX(), y: GY, s: V(1.55, 1.5), facing: 1, outfit: NEIGHBOUR, pose: idle('stand', t, 1, 1), expr: o.expr || 'neutral', look: o.look || [0.6, 0.1],
    turn: 0.35, blink: blinkAt(t, 3.4), rim: rimOf(M), invisible: o.invisible || 0, edgeColor: '#ffe6c0' });
}

// s001 — "A bowl of candy, and a sign: please take one."  wide, slow push toward the bowl
registerShot('s001', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.0, x: -30 }], [info.dur, { z: 1.06, x: 20 }]]), drift(t, 3, 2));
  const r = G.porch(g, t, cam, { bowl: 1 });
  layer(g, cam, 1, (g) => {
    neighbour(g, r.M, r.GY, t);
    const kx = r.tableX + V(200, 150), s = V(1.45, 1.35), rim = rimOf(r.M);
    drawGlow(g, { x: kx, y: r.GY, s, facing: -1, outfit: WITCH, pose: idle('stand', t, 1, 2), expr: 'calm', look: [0.8, 0.3], rim, blink: blinkAt(t, 2.9, 1) });
    drawGlow(g, { x: kx + V(150, 120), y: r.GY, s, facing: -1, outfit: GHOST, pose: idle('holdFront', t, 1, 3), rim, prop: 'bucket' });
    drawGlow(g, { x: kx + V(290, 230), y: r.GY, s, facing: -1, outfit: SKY, pose: idle('stand', t, 1, 4), expr: 'open', look: [1, 0.4], rim, blink: blinkAt(t, 3.6, 2) });
  });
  G.leaves(g, t, { count: 8, colors: ['#8a6a4a', '#6a4a3a'], speed: 30, a: 0.5 });
} });

// s002 — "When someone is watching, fifty-seven percent take just one."  the witch takes ONE candy, pill counts to 57 %
registerShot('s002', { draw(g, t, info) {
  const cam = camAdd({ z: 1.08, x: 60, y: -10 }, drift(t, 4, 5));
  const r = G.porch(g, t, cam, { bowl: 0.95 });
  layer(g, cam, 1, (g) => {
    neighbour(g, r.M, r.GY, t, { look: [0.8, 0.15] });
    const kx = r.tableX + V(170, 130), s = V(1.45, 1.35), rim = rimOf(r.M);
    const take = gPosesAt(t, [[0, 'stand'], [0.5, 'reach'], [1.3, 'holdFront']], 0.35);
    drawGlow(g, { x: kx, y: r.GY, s, facing: -1, outfit: WITCH, pose: idle(take, t, 1, 2), expr: t > 1.3 ? 'smile' : 'look', look: [0.6, 0.5], rim, prop: t > 0.9 ? { type: 'candy', color: '#4a9ae8' } : null });
    drawGlow(g, { x: kx + V(150, 120), y: r.GY, s, facing: -1, outfit: GHOST, pose: idle('holdFront', t, 1, 3), rim, prop: 'bucket' });
    drawGlow(g, { x: kx + V(290, 230), y: r.GY, s, facing: -1, outfit: SKY, pose: idle('stand', t, 1, 4), expr: 'look', look: [1, 0.2], rim });
  });
  UI.countPill(g, t, { from: 0, to: 57, start: 1.0, dur: 0.9, x: E.W * V(0.78, 0.72), y: E.H * V(0.15, 0.2) });
} });

// s003 — "But when the watcher fades away… only eight percent do."  the neighbour fades out, the astronaut grabs a handful
registerShot('s003', { draw(g, t, info) {
  const cam = camPath(t, [[0, { z: 1.06, x: -10 }], [1.6, { z: 1.08, x: 10 }], [info.dur, { z: 1.12, x: 70 }]]);
  const inv = ease.inOut(prog(t, 0.25, 1.6)) * 0.94, grab = prog(t, 1.9, 2.3);
  const r = G.porch(g, t, cam, { bowl: lerp(0.95, 0.55, grab) });
  layer(g, cam, 1, (g) => {
    neighbour(g, r.M, r.GY, t, { invisible: inv, expr: 'calm' });
    const kx = r.tableX + V(160, 120), rim = rimOf(r.M);
    const look = t < 1.7 ? [-1, 0.1] : [0.2, 0.6];
    const pose = gPosesAt(t, [[0, 'holdFront'], [1.9, 'reach'], [2.4, 'holdUp']], 0.3);
    drawGlow(g, { x: kx, y: r.GY, s: V(1.45, 1.35), facing: t < 1.7 ? -1 : -1, outfit: ASTRO, pose: idle(pose, t, 1, 6), expr: t < 1.7 ? 'look' : 'sly', look, turn: 0.15, rim, prop: t < 1.9 ? 'bucket' : { type: 'candy', color: '#f2c14a' }, blink: blinkAt(t, 2.6) });
  });
  if (t > 0.1) UI.pill(g, t, t < 2.0 ? '57 %' : `${Math.round(lerp(57, 8, ease.out(prog(t, 2.0, 2.6))))} %`, E.W * V(0.78, 0.72), E.H * V(0.15, 0.2), { start: -1 });
} });
