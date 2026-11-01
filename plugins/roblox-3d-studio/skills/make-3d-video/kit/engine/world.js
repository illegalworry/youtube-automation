// engine/world.js — locations ("sets"). defineSet(name, builder) ; buildSet(name, stage, opts) -> { spots, light, bounds }
// A builder adds meshes to stage.scene and returns named spots ({ door: [x, z], desk: [x, z], ... }) the story can use.
// Conventions: the action area is around the origin, ground at y = 0, roughly x,z ∈ [-40, 40]; the default camera side is +Z.
import { THREE, part, block, cyl, ball, ground, studsTex, patternTex, plastic, neon, glass, textPlane, group, at, D2R } from './r3d.js';
import { makeItem } from './items.js';
import { rng, shade } from './core.js';

const SETS = {};
export function defineSet(name, fn, meta = {}) { SETS[name] = { fn, meta }; }
export const setNames = () => Object.keys(SETS);
export const setMeta = (n) => SETS[n]?.meta || {};
// put(stage, 'tree', x, z, yawDeg, opts) — place an item from items.js
export function put(st, name, x = 0, z = 0, yaw = 0, o = {}) { const it = makeItem(name, o); at(it, x, o.y || 0, z, yaw, o.s0 || 1); st.scene.add(it); return it; }
export function buildSet(name, st, o = {}) {
  const S = SETS[name] || SETS.baseplate; if (!SETS[name]) console.log(`ERROR missing set "${name}" (using baseplate)`);
  const r = S.fn(st, o) || {}; return { spots: {}, ...r, light: r.light || S.meta.light };
}

// floor + walls for interiors. Opening on +Z side (towards the camera) unless o.closed.
export function room(st, o = {}) {
  const w = o.w || 40, d = o.d || 30, h = o.h || 14, wall = o.wall || '#e8dcc0', floor = o.floor || '#b88a5a';
  st.add(ground(w, d, floor, { tex: o.floorTex || patternTex('planks', floor, [w / 8, d / 8]) }));
  st.add(block(w, h, 1, wall, [0, 0, -d / 2], { base: true }), block(1, h, d, wall, [-w / 2, 0, 0], { base: true }), block(1, h, d, wall, [w / 2, 0, 0], { base: true }));
  if (o.closed) st.add(block(w, h, 1, wall, [0, 0, d / 2], { base: true }));
  if (o.ceiling !== false) { const c = block(w, 1, d, o.ceilColor || '#f4f0e8', [0, h, 0]); c.castShadow = false; st.add(c); }
  st.add(block(w, 0.6, 0.3, shade(wall, -0.25), [0, 0, -d / 2 + 0.6], { base: true }));
  // ceiling light so interiors are not lit only by the sun
  const pl = new THREE.PointLight('#fff2dc', o.lamp ?? 60, 60, 1.6); pl.position.set(0, h - 2, 0); st.scene.add(pl);
  return { w, d, h };
}
export function windowOn(st, x, y, z, w = 6, h = 4, yaw = 0) {
  const g = group(block(w + 0.6, h + 0.6, 0.4, '#f4f4f4', [0, 0, 0]), block(w, h, 0.5, glass('#bfe6ff', 0.8), [0, 0, 0.05]), block(0.25, h, 0.6, '#f4f4f4', [0, 0, 0.06]), block(w, 0.25, 0.6, '#f4f4f4', [0, 0, 0.06]));
  return st.add(at(g, x, y, z, yaw));
}

// ---------------- sets ----------------
defineSet('baseplate', (st, o) => {
  st.add(ground(1200, 1200, o.color || '#4b974b', { tex: studsTex(o.color || '#4b974b', [600, 600]) }));
  put(st, 'spawn', 0, -14);
  return { spots: { spawn: [0, -14], center: [0, 0] } };
}, { light: 'day', desc: 'classic green studded baseplate with a spawn pad — the iconic empty Roblox world' });

defineSet('park', (st, o) => {
  st.add(ground(1200, 1200, '#58a84a', { tex: patternTex('grass', '#58a84a', [150, 150]) }));
  st.add(ground(8, 200, '#d7c59a', { z: 0, y: 0.02 }).rotateZ(0)); // path along Z
  const r = rng(o.seed || 4);
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = 22 + r() * 60; put(st, r() < 0.7 ? 'tree' : 'pine', Math.cos(a) * d, Math.sin(a) * d - 10, r() * 360, { s: 0.8 + r() * 0.5, seed: i }); }
  for (let i = 0; i < 14; i++) put(st, 'bush', (r() < 0.5 ? -1 : 1) * (7 + r() * 12), -40 + r() * 70, r() * 360, { s: 0.7 + r() * 0.5 });
  for (let i = 0; i < 30; i++) put(st, 'flower', (r() - 0.5) * 50, (r() - 0.5) * 50, 0, { color: ['#ff66cc', '#ffd23f', '#ffffff', '#ff6a4a'][i % 4] });
  put(st, 'bench', -8, -6, 90); put(st, 'bench', 8, 6, -90); put(st, 'lamppost', -6, 10, 90); put(st, 'lamppost', 6, -18, -90);
  // pond
  const pond = new THREE.Mesh(new THREE.CircleGeometry(9, 32), plastic('#3a8fd6', { rough: 0.15, metal: 0.1 })); pond.rotation.x = -Math.PI / 2; pond.position.set(20, 0.04, -12); pond.receiveShadow = true; st.add(pond);
  return { spots: { bench1: [-8, -6], bench2: [8, 6], pond: [20, -12], path: [0, 0] } };
}, { light: 'day', desc: 'sunny park: grass, path along Z, trees, bushes, flowers, benches, lamp posts, a pond' });

defineSet('city', (st, o) => {
  st.add(ground(1200, 1200, '#6a6e76', { tex: patternTex('noise', '#6a6e76', [100, 100]) }));
  const road = ground(16, 1200, '#3a3d44', { tex: patternTex('road', '#3a3d44', [1, 120]), y: 0.03 }); st.add(road);
  for (const s of [-1, 1]) st.add(block(6, 0.4, 1200, '#b8b8b0', [s * 11, 0, 0], { base: true }));
  const r = rng(o.seed || 6), cols = ['#8a8f96', '#b5523b', '#d8c8a8', '#5a6ab8', '#4a5a6a', '#c8b8a0', '#7a8a6a'];
  for (const s of [-1, 1]) for (let z = -160; z < 120; z += 19) { const h = 22 + r() * 50; put(st, 'building', s * (24 + r() * 3), z, s > 0 ? -90 : 90, { color: cols[Math.floor(r() * cols.length)], h, w: 16, d: 16, seed: Math.floor(r() * 99), lit: o.night ? 0.55 : 0.12 }); }
  for (let z = -100; z < 80; z += 24) { put(st, 'lamppost', -9, z, 90, { on: !!o.night }); put(st, 'lamppost', 9, z + 12, -90, { on: !!o.night }); }
  put(st, 'trafficLight', 8.5, -30, -90); put(st, 'hydrant', -9.5, 6, 0); put(st, 'mailbox', 9.5, -4, -90);
  if (o.cars !== false) { put(st, 'car', -4, -40, 0, { color: '#c4281c' }); put(st, 'car', 4, 30, 180, { color: '#2d7be0' }); }
  return { spots: { sidewalkL: [-11, 0], sidewalkR: [11, 0], road: [0, 0], crossing: [0, -30] } };
}, { light: 'day', desc: 'city street along Z: road with markings, sidewalks at x=±11, tall buildings both sides, lamp posts, cars, traffic light. opts {night:true}' });

defineSet('suburb', (st, o) => {
  st.add(ground(1200, 1200, '#58a84a', { tex: patternTex('grass', '#58a84a', [150, 150]) }));
  st.add(ground(14, 1200, '#4a4d54', { tex: patternTex('road', '#4a4d54', [1, 120]), x: 0, y: 0.03 }));
  const r = rng(o.seed || 8), cols = ['#e8dcc0', '#c8d8f0', '#f0d0c8', '#d8f0d0', '#f4f4f4'], roofs = ['#b5523b', '#4a5a6a', '#6a4a3a', '#2d5ab8'];
  for (const s of [-1, 1]) for (let z = -120; z < 100; z += 30) { put(st, 'house', s * 26, z, s > 0 ? -90 : 90, { color: cols[Math.floor(r() * 5)], roof: roofs[Math.floor(r() * 4)] }); put(st, 'fence', s * 14, z + 2, 90, { n: 6 }); put(st, 'tree', s * 16, z + 13, 0, { s: 0.7 }); put(st, 'mailbox', s * 12, z - 6, s > 0 ? -90 : 90); }
  return { spots: { houseL: [-26, -0], houseR: [26, 0], road: [0, 0], lawnL: [-18, 0], lawnR: [18, 0] } };
}, { light: 'day', desc: 'suburban street: road along Z, houses with lawns, fences, trees and mailboxes on both sides' });

defineSet('classroom', (st, o) => {
  room(st, { w: 44, d: 34, h: 14, wall: '#e8e0c8', floor: '#c8a070' });
  put(st, 'whiteboard', 0, -16.4, 0, { text: o.board || '2 + 2 = ?' }); put(st, 'desk', 0, -11, 0, { color: '#8a5a3a' }); put(st, 'chair', 0, -13.5, 0, { color: '#4a5a6a' });
  const desks = {}; let k = 1;
  for (let row = 0; row < 3; row++) for (let col = -1; col <= 1; col++) { const x = col * 11, z = -2 + row * 8; put(st, 'desk', x, z, 0); put(st, 'chair', x, z + 2.5, 180, { color: ['#c4281c', '#2d7be0', '#4b974b'][(row + col + 3) % 3] }); desks['desk' + k++] = [x, z + 2.3]; }
  windowOn(st, -21.4, 7, -4, 8, 5, 90); windowOn(st, -21.4, 7, 8, 8, 5, 90); put(st, 'bookshelf', 18, -14, 0); put(st, 'plant', -18, -14, 0); put(st, 'door', 21.3, 4, -90, { color: '#7a4f2c' });
  return { spots: { teacher: [0, -13], board: [0, -14], door: [19, 4], ...desks } };
}, { light: 'interior', desc: 'school classroom: whiteboard at the back (z=-16), teacher desk, 3x3 student desks with chairs (spots desk1..desk9 = seat positions), windows, door at x=+19' });

defineSet('livingRoom', (st, o) => {
  room(st, { w: 40, d: 30, h: 13, wall: o.wall || '#d8e4f0', floor: '#a8784a' });
  const rug = ground(16, 11, '#c4504a', { tex: patternTex('carpet', '#c4504a', [1, 1]), y: 0.04, z: 0 }); st.add(rug);
  put(st, 'sofa', 0, -9, 0); put(st, 'tv', 0, 9, 180, { text: o.tv || '' }); put(st, 'table', 0, -2, 0, { w: 6, d: 3, h: 1.4, color: '#7a4f2c' });
  put(st, 'lamp', -12, -11, 0); put(st, 'plant', 13, -12, 0); put(st, 'bookshelf', -17, 2, 90); windowOn(st, 8, 7, -14.4, 8, 5, 0); windowOn(st, -8, 7, -14.4, 8, 5, 0); put(st, 'door', 19.3, 4, -90);
  return { spots: { sofa: [0, -8.6], sofaL: [-2.5, -8.6], sofaR: [2.5, -8.6], tv: [0, 8], door: [17, 4], center: [0, 2] } };
}, { light: 'interior', desc: 'living room: sofa at z=-9 facing a TV at z=+9, rug, coffee table, lamp, bookshelf, windows, door at x=+17' });

defineSet('obby', (st, o) => {
  const lava = block(600, 0.6, 600, neon('#ff4a1a', 1.2), [0, -6, 0]); lava.receiveShadow = true; st.add(lava);
  const r = rng(o.seed || 3), cols = ['#2d7be0', '#e8304a', '#4b974b', '#f5cd30', '#9a5aff', '#ff8a2a'], plats = {};
  st.add(part(14, 2, 14, '#a3a2a5', [0, -2, 12], { base: true })); put(st, 'spawn', 0, 12);
  let x = 0, z = 0, y = 0;
  for (let i = 1; i <= 9; i++) { z -= 9 + r() * 3; x += (r() - 0.5) * 8; y += r() < 0.4 ? 1.5 : 0; const w = 4 + r() * 3; st.add(part(w, 1.2, w, cols[i % cols.length], [x, y - 1.2, z], { base: true })); plats['p' + i] = [x, y, z]; }
  st.add(part(14, 2, 14, '#f5cd30', [x, y - 2, z - 14], { base: true })); put(st, 'trophy', x, z - 16, 0, { y }); plats.finish = [x, y, z - 12];
  return { spots: { start: [0, 12], ...plats }, light: 'day' };
}, { light: 'day', desc: 'obby: floating coloured platforms over glowing lava, start pad at z=+12, platforms p1..p9 ([x,y,z] incl. height) going to -Z, finish pad with trophy' });

defineSet('arena', (st, o) => {
  st.add(ground(1200, 1200, '#3a3f4c'));
  st.add(part(40, 1, 40, '#a3a2a5', [0, -1, 0], { base: true, round: 0.2 }));
  const fl = ground(38, 38, '#c4281c', { tex: patternTex('checker', '#c4281c', [4, 4], { color2: '#a82018', n: 4 }), y: 0.02 }); st.add(fl);
  for (const [x, z] of [[-19, -19], [19, -19], [-19, 19], [19, 19]]) st.add(cyl(0.6, 0.6, 5, '#f4f4f4', [x, 0, z], { base: true }));
  for (const s of [-1, 1]) { st.add(block(38, 0.3, 0.3, '#ffffff', [0, 2.5, s * 19])); st.add(block(0.3, 0.3, 38, '#ffffff', [s * 19, 2.5, 0])); st.add(block(38, 0.3, 0.3, '#ffffff', [0, 4, s * 19])); st.add(block(0.3, 0.3, 38, '#ffffff', [s * 19, 4, 0])); }
  const r = rng(5); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; for (let k = 0; k < 3; k++) st.add(block(60, 3, 6, shade('#2a2e36', k * 0.06), [Math.sin(a) * (36 + k * 6), k * 3, Math.cos(a) * (36 + k * 6)], { base: true, rot: [0, a / D2R, 0] })); }
  for (const s of [-1, 1]) { const sp = new THREE.SpotLight('#ffffff', 900, 120, 0.5, 0.5, 1.5); sp.position.set(s * 30, 40, 30); sp.target.position.set(0, 0, 0); st.scene.add(sp, sp.target); }
  return { spots: { red: [-8, 0], blue: [8, 0], center: [0, 0] } };
}, { light: 'night', desc: 'fighting arena: square ring (38x38) with ropes and corner posts on a dark floor, tiered stands, spotlights. fighters at red [-8,0] / blue [8,0]' });
