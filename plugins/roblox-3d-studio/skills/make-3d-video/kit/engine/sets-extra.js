// engine/sets-extra.js — more locations (forest, desert, winter, beach, space, cave, bedroom, kitchen, shop, castle, spooky, stage)
// and the props they need. Loaded by director.js right after world.js (no circular import). Same conventions as world.js: ground y = 0, action area around the
// origin (x,z ∈ [-12,12] kept mostly clear), default camera on +Z, so backdrops go to -Z and the sides. Deterministic (rng(seed)).
import { defineSet, put, room, windowOn } from './world.js';
import { THREE, part, block, cyl, ball, cone, wedge, ground, patternTex, plastic, neon, glass, textPlane, canvasTex, group, at, prep, D2R } from './r3d.js';
import { defineItem } from './items.js';
import { rng, shade } from './core.js';

// ---------- small helpers ----------
const texMat = (tex, color = '#ffffff', o = {}) => plastic(color, { map: tex, ...o });
const glowBasic = (color) => new THREE.MeshBasicMaterial({ color, fog: false });          // sky objects (moon, planet) ignore fog
const beamMat = (color, op = 0.14) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });
const mistMat = (color, op = 0.16) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false });
const disc = (r, mat, x, y, z, seg = 32) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, seg), typeof mat === 'string' ? plastic(mat) : mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; return m; };
const hemisphere = (r, mat, pos, seg = 24) => { const m = prep(new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg / 2), 0, Math.PI * 2, 0, Math.PI / 2), typeof mat === 'string' ? plastic(mat) : mat)); m.position.set(...pos); return m; };
const plight = (st, color, intensity, dist, x, y, z, decay = 1.6) => { const l = new THREE.PointLight(color, intensity, dist, decay); l.position.set(x, y, z); st.scene.add(l); return l; };
// place n props on a ring/area avoiding a keep-clear test; returns nothing
function scatter(st, n, seed, pick, place) { const r = rng(seed); let tries = 0, k = 0; while (k < n && tries++ < n * 30) { const p = pick(r); if (!p) continue; place(p, r, k++); } }
// keep the camera corridor (+Z in front of the origin) and the action circle free
const clearOf = (x, z, rad = 13) => Math.hypot(x, z) > rad && !(z > 4 && z < 60 && Math.abs(x) < 10 + z * 0.55);

// ---------- props ----------
defineItem('palm', o => {
  const s = o.s || 1, lean = (o.lean ?? 14) * D2R, out = []; let x = 0, y = 0;
  for (let i = 0; i < 6; i++) { const a = lean * (i / 5), h = 1.75 * s, rr = 0.55 * s * (1 - i * 0.07); const seg = cyl(rr * 0.9, rr, h, shade('#a8784a', (i % 2) * 0.1), [x + Math.sin(a) * h / 2, y + Math.cos(a) * h / 2, 0], { seg: 8 }); seg.rotation.z = -a; out.push(seg); x += Math.sin(a) * h; y += Math.cos(a) * h; }
  const top = new THREE.Group(); top.position.set(x, y, 0);
  for (let k = 0; k < 7; k++) { const pv = new THREE.Group(); pv.rotation.order = 'YXZ'; pv.rotation.set((22 + (k % 2) * 14) * D2R, (k * 360 / 7 + 10) * D2R, 0); const f = part(1.4 * s, 0.16, 5.2 * s, shade(o.color || '#3fae3a', (k % 3) * 0.06 - 0.04), [0, 0, 2.5 * s], { round: 0.06 }); pv.add(f); top.add(pv); }
  for (let k = 0; k < 3; k++) top.add(ball(0.42 * s, '#6a4528', [Math.cos(k * 2.1) * 0.55 * s, -0.5 * s, Math.sin(k * 2.1) * 0.55 * s], { seg: 10 }));
  out.push(top); return out;
});
defineItem('cactus', o => {
  const s = o.s || 1, c = o.color || '#3f9a4a', d = shade(c, -0.08);
  const out = [cyl(0.8 * s, 0.9 * s, 6 * s, c, [0, 0, 0], { base: true, seg: 10 }), ball(0.8 * s, c, [0, 6 * s, 0], { seg: 10 })];
  for (const [sx, y, h] of [[1, 2.6, 2.6], [-1, 3.6, 1.8]]) out.push(cyl(0.5 * s, 0.5 * s, 1.6 * s, d, [sx * 1.4 * s, y * s, 0], { rot: [0, 0, 90], seg: 8 }), cyl(0.5 * s, 0.5 * s, h * s, d, [sx * 2.2 * s, y * s, 0], { base: true, seg: 8 }), ball(0.5 * s, d, [sx * 2.2 * s, (y + h) * s, 0], { seg: 8 }));
  if (o.flower) out.push(ball(0.35 * s, '#ff66cc', [0, 6.75 * s, 0], { seg: 8 }));
  return out;
});
defineItem('snowman', o => {
  const w = '#f8fbff', out = [ball(1.7, w, [0, 1.45, 0]), ball(1.2, w, [0, 3.75, 0]), ball(0.9, w, [0, 5.4, 0])];
  out.push(cone(0.2, 1.1, '#ff8a1a', [0, 5.35, 1.35], { rot: [90, 0, 0], seg: 8 }), ball(0.11, '#1b1b1f', [-0.32, 5.65, 0.8], { seg: 6 }), ball(0.11, '#1b1b1f', [0.32, 5.65, 0.8], { seg: 6 }));
  for (const y of [3.4, 3.9, 4.4]) out.push(ball(0.12, '#1b1b1f', [0, y, 1.17], { seg: 6 }));
  out.push(cyl(1.0, 1.0, 0.4, o.scarf || '#c4281c', [0, 4.75, 0], { seg: 16 }), part(0.45, 1.3, 0.2, o.scarf || '#c4281c', [0.5, 4.2, 0.95], { round: 0.06 }));
  out.push(cyl(1.0, 1.0, 0.12, '#1b1b1f', [0, 6.15, 0], { seg: 16 }), cyl(0.62, 0.62, 1.1, '#1b1b1f', [0, 6.2, 0], { base: true, seg: 16 }));
  for (const sx of [-1, 1]) { const a = cyl(0.08, 0.08, 2.4, '#5a3a1a', [sx * 2.0, 4.3, 0], { seg: 5 }); a.rotation.z = sx * -55 * D2R; out.push(a); }
  return out;
});
defineItem('snowPine', o => {
  const s = o.s || 1, c = o.color || '#2f6a44', out = [cyl(0.5 * s, 0.6 * s, 3 * s, '#5a3a24', [0, 0, 0], { base: true, seg: 8 })];
  [[3.3, 4, 2.4], [2.6, 3.6, 4.5], [1.8, 3, 6.6]].forEach(([r, h, y], i) => { out.push(cone(r * s, h * s, shade(c, i * 0.05), [0, y * s, 0], { base: true, seg: 8 })); out.push(cone(r * 0.48 * s, h * 0.44 * s, '#f6faff', [0, (y + h * 0.565) * s, 0], { base: true, seg: 8 })); });
  return out;
});
defineItem('deadTree', o => {
  const s = o.s || 1, c = o.color || '#3a302c', r = rng(o.seed || 5), out = [cyl(0.45 * s, 0.75 * s, 8 * s, c, [0, 0, 0], { base: true, seg: 7 })];
  for (let i = 0; i < 5; i++) { const y = (3.5 + i * 1.0 + r()) * s, sx = i % 2 ? 1 : -1, L = (2.2 + r() * 1.6) * s, a = (40 + r() * 25) * D2R, yaw = r() * 360;
    const g = new THREE.Group(); g.position.set(0, y, 0); g.rotation.y = yaw * D2R; const b = part(0.3 * s, L, 0.3 * s, c, [sx * Math.sin(a) * L / 2, Math.cos(a) * L / 2, 0], { round: 0.06 }); b.rotation.z = -sx * a; g.add(b);
    const tw = part(0.18 * s, L * 0.5, 0.18 * s, c, [sx * Math.sin(a) * L * 0.85, Math.cos(a) * L * 0.85 + L * 0.2, 0], { round: 0.04 }); tw.rotation.z = sx * 0.3; g.add(tw); out.push(g); }
  return out;
});
defineItem('tombstone', o => {
  const c = o.color || '#8a8f96', k = o.kind ?? 0, out = [part(2.6, 0.3, 1.4, '#3a3a30', [0, 0, 0], { base: true, round: 0.1 })];
  if (k === 1) out.push(part(0.55, 3.4, 0.5, c, [0, 0.2, 0], { base: true, round: 0.1 }), part(2.0, 0.55, 0.5, c, [0, 2.6, 0], { round: 0.1 }));
  else if (k === 2) out.push(part(2.2, 1.6, 0.7, c, [0, 0.2, 0], { base: true, round: 0.15 }));
  else out.push(part(2.0, 2.2, 0.5, c, [0, 0.2, 0], { base: true, round: 0.08 }), cyl(1.0, 1.0, 0.5, c, [0, 2.4, 0], { rot: [90, 0, 0], seg: 16 }), block(1.1, 0.12, 0.05, shade(c, -0.3), [0, 2.1, 0.26]), block(0.8, 0.12, 0.05, shade(c, -0.3), [0, 1.7, 0.26]));
  return out;
});
defineItem('ironFence', o => { const n = o.n || 6, c = o.color || '#1e1c24', out = [part(n * 1.2, 0.2, 0.2, c, [0, 2.6, 0]), part(n * 1.2, 0.2, 0.2, c, [0, 0.8, 0])]; for (let i = 0; i <= n; i++) { const x = (i - n / 2) * 1.2; out.push(cyl(0.08, 0.08, 3.2, c, [x, 0, 0], { base: true, seg: 5 }), cone(0.18, 0.5, c, [x, 3.2, 0], { base: true, seg: 4 })); } return out; });
defineItem('pumpkin', o => { const s = o.s || 1, f = neon('#ffb030', o.lit === false ? 0 : 2.2); return [ball(1.1 * s, '#e8741a', [0, 0.9 * s, 0], { scale: [1.15, 0.82, 1.05], seg: 12 }), cyl(0.14 * s, 0.18 * s, 0.6 * s, '#3a6a2a', [0, 1.75 * s, 0], { base: true, seg: 6 }),
  cone(0.22 * s, 0.32 * s, f, [-0.4 * s, 1.15 * s, 1.0 * s], { rot: [90, 0, 0], seg: 3 }), cone(0.22 * s, 0.32 * s, f, [0.4 * s, 1.15 * s, 1.0 * s], { rot: [90, 0, 0], seg: 3 }), part(0.9 * s, 0.22 * s, 0.2 * s, f, [0, 0.62 * s, 1.03 * s], { round: 0.05 })]; });
defineItem('cabin', o => {
  const w = o.w || 14, d = o.d || 11, h = o.h || 7, logs = texMat(patternTex('planks', '#9a6438', [1, 2], { n: 7 })), roof = o.roof || '#5a3a24', out = [part(w, h, d, logs, [0, 0, 0], { base: true, round: 0.1 })];
  for (const s of [-1, 1]) { const rw = wedge(w + 1.4, h * 0.55, d / 2 + 0.8, roof, [0, h, s * (d / 4 + 0.2)], { rot: [0, s > 0 ? 180 : 0, 0] }); out.push(rw); if (o.snow !== false) out.push(wedge(w + 1.6, h * 0.55, d / 2 + 0.8, '#f6faff', [0, h + 0.4, s * (d / 4 + 0.15)], { rot: [0, s > 0 ? 180 : 0, 0] })); }
  out.push(part(1.8, 5, 1.8, '#7a7a80', [w / 3, h, -d / 6], { base: true, round: 0.1 }), part(3.2, 5.6, 0.3, '#5a3a24', [0, 0, d / 2 + 0.05], { base: true, round: 0.05 }), ball(0.18, '#f2c22e', [1.1, 2.8, d / 2 + 0.3], { seg: 8 }));
  for (const x of [-w / 3.2, w / 3.2]) out.push(part(3.2, 2.6, 0.3, neon('#ffcf6a', o.lit ? 1.4 : 0.45), [x, 2.6, d / 2 + 0.05], { base: true }), part(3.6, 0.35, 0.6, '#f6faff', [x, 5.3, d / 2 + 0.15], { base: true }), block(0.2, 2.6, 0.4, '#5a3a24', [x, 2.6, d / 2 + 0.1], { base: true }));
  return out;
});
defineItem('umbrella', o => {
  const c = o.color || '#e8304a', t = canvasTex(256, 16, (g, W, H) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : c; g.fillRect(i * W / 8, 0, W / 8, H); } }, { key: 'umb' + c });
  const pole = cyl(0.1, 0.1, 6.2, '#f4f4f4', [0, 0, 0], { base: true, seg: 6 }), top = cone(4, 1.5, texMat(t), [0, 5.4, 0], { base: true, seg: 8 });
  return [group(pole, top, ball(0.2, c, [0, 7.0, 0], { seg: 8 })).rotateZ((o.tilt ?? 6) * D2R)];
});
defineItem('towel', o => { const c = o.color || '#2d7be0'; return [part(2.8, 0.1, 5.4, c, [0, 0, 0], { base: true, round: 0.03 }), block(2.82, 0.11, 0.5, '#ffffff', [0, 0, 1.6], { base: true }), block(2.82, 0.11, 0.5, '#ffffff', [0, 0, -1.6], { base: true })]; });
defineItem('lifeguardTower', o => {
  const out = [], wood = '#f4f4f4', hut = o.color || '#e8304a';
  for (const x of [-2, 2]) for (const z of [-2, 2]) out.push(part(0.4, 5, 0.4, wood, [x, 0, z], { base: true, round: 0.06 }));
  out.push(part(5.6, 0.4, 5.6, '#c8a070', [0, 5, 0], { base: true, round: 0.06 }), part(4.6, 3.6, 4, hut, [0, 5.4, -0.4], { base: true, round: 0.1 }), part(3.4, 1.4, 0.2, glass('#bfe6ff', 0.8), [0, 7.2, 1.62], { round: 0.03 }), part(5.4, 0.35, 5.4, '#f4f4f4', [0, 9.0, -0.2], { base: true, round: 0.1 }));
  out.push(part(0.5, 0.15, 5.2, '#c8a070', [0, 2.6, 4.6], { rot: [-45, 0, 0] }));   // ramp
  const sign = textPlane('LIFEGUARD', 3.6, 0.8, { bg: '#ffffff', color: '#c4281c' }); sign.position.set(0, 6.25, 1.62); out.push(sign);
  out.push(part(0.5, 1.6, 0.12, '#ffffff', [-2.75, 7.0, 0], { rot: [0, 90, 0] }), part(0.5, 0.5, 0.15, '#c4281c', [-2.82, 7.0, 0], { rot: [0, 90, 0] }));
  return out;
});
defineItem('crystal', o => {
  const c = o.color || '#3af0ff', s = o.s || 1, r = rng(o.seed || 7), m = plastic(c, { emissive: c, emissiveIntensity: o.glow ?? 0.9, rough: 0.15, flat: true }), out = [];
  for (let i = 0; i < (o.n || 4); i++) { const h = (1.6 + r() * 2.4) * s, cr = new THREE.Mesh(new THREE.OctahedronGeometry(0.6 * s, 0), m); cr.scale.set(1, h / (1.2 * s), 1); cr.position.set((r() - 0.5) * 1.6 * s, h * 0.4, (r() - 0.5) * 1.2 * s); cr.rotation.set((r() - 0.5) * 0.7, r() * 3, (r() - 0.5) * 0.7); cr.castShadow = true; out.push(cr); }
  return out;
});
defineItem('torchStand', o => [cyl(0.18, 0.24, 4, '#5a3a1a', [0, 0, 0], { base: true, seg: 6 }), cyl(0.55, 0.3, 0.6, '#3a3a40', [0, 4, 0], { base: true, seg: 8 }), cone(0.45, 1.2, neon('#ff7a1a', 2.6), [0, 4.45, 0], { base: true, seg: 7 }), cone(0.25, 0.8, neon('#ffd23f', 3), [0, 4.5, 0], { base: true, seg: 7 })]);
defineItem('minecart', o => {
  const c = o.color || '#7a7a80', out = [part(3.6, 1.9, 2.4, c, [0, 0.7, 0], { base: true, round: 0.12 }), part(3.2, 0.2, 2.0, '#2a2a2e', [0, 2.5, 0], { base: true, round: 0.05 }), part(3.9, 0.3, 2.6, shade(c, -0.25), [0, 2.4, 0], { base: true, round: 0.06 })];
  for (const x of [-1.1, 1.1]) for (const z of [-1.0, 1.0]) out.push(cyl(0.5, 0.5, 0.3, '#2a2a2e', [x, 0.55, z], { rot: [90, 0, 0], seg: 12 }));
  if (o.ore !== false) { const r = rng(4); for (let i = 0; i < 5; i++) out.push(part(0.8, 0.7, 0.8, i % 2 ? '#f2c22e' : '#5a5048', [(r() - 0.5) * 2.2, 2.55, (r() - 0.5) * 1.2], { round: 0.15, rot: [r() * 40, r() * 90, 0] })); }
  return out;
});
defineItem('storeShelf', o => {   // gondola shelf, goods on +Z side (and -Z if o.double)
  const w = o.w || 10, h = o.h || 6, r = rng(o.seed || 11), out = [part(w, h, 0.3, '#c8ccd2', [0, 0, 0], { base: true, round: 0.05 }), ...[-1, 1].map(s => part(0.3, h, 2.6, '#a8acb4', [s * w / 2, 0, 0], { base: true, round: 0.05 }))];
  const cols = o.colors || ['#e8304a', '#2d7be0', '#f5cd30', '#4b974b', '#ff8a2a', '#9a5aff', '#ff66cc', '#12c4d4'];
  for (const side of o.double ? [1, -1] : [1]) for (let lv = 0; lv < 3; lv++) { const y = 0.5 + lv * 1.85; out.push(part(w - 0.4, 0.18, 1.2, '#e8ecf0', [0, y, side * 0.75], { base: true, round: 0.04 })); let x = -w / 2 + 0.5; while (x < w / 2 - 1.2) { const gw = 1.0 + r() * 0.8, gh = 0.9 + r() * 0.6, c = cols[Math.floor(r() * cols.length)]; if (x + gw > w / 2 - 0.4) break; out.push(part(gw, gh, 0.95, c, [x + gw / 2, y + 0.18, side * 0.78], { base: true, round: r() < 0.4 ? 0.2 : 0.06 })); x += gw + 0.12; } }
  return out;
});
defineItem('drinkFridge', o => { const r = rng(5), out = [part(9, 7.6, 2.6, '#2a2e36', [0, 0, 0], { base: true, round: 0.1 }), part(8.4, 6.6, 0.1, neon('#e8f4ff', 0.35), [0, 0.5, 1.0], { base: true })]; const cols = ['#e8304a', '#2d7be0', '#4b974b', '#f5cd30', '#ff8a2a', '#9a5aff'];
  for (let lv = 0; lv < 4; lv++) for (let i = 0; i < 9; i++) out.push(cyl(0.3, 0.3, 1.2, cols[(i + lv * 2) % 6], [-3.6 + i * 0.9, 0.8 + lv * 1.6, 1.15], { base: true, seg: 8 }));
  for (const x of [-1.4, 1.4]) out.push(block(0.2, 6.8, 0.3, '#2a2e36', [x, 0.4, 1.3], { base: true })); out.push(part(8.6, 6.8, 0.15, glass('#cfe8ff', 0.25), [0, 0.4, 1.5], { base: true, round: 0.04 }));
  return out; });
defineItem('register', o => [part(1.8, 0.7, 1.6, '#3a3f4c', [0, 0, 0], { base: true, round: 0.1 }), part(1.4, 0.9, 0.15, '#2a2e36', [0, 0.9, -0.3], { round: 0.05 }), part(1.2, 0.7, 0.05, neon('#5ab8ff', 0.8), [0, 0.9, -0.21]), part(1.4, 0.1, 0.8, '#9aa2aa', [0, 0.7, 0.3], { base: true })]);
defineItem('stove', o => { const out = [part(4, 3, 2.6, o.color || '#f0f0f0', [0, 0, 0], { base: true, round: 0.08 }), part(4.05, 0.15, 2.65, '#1b1b1f', [0, 3, 0], { base: true }), part(3.0, 1.5, 0.12, glass('#1b1b1f', 0.85), [0, 0.6, 1.3], { base: true, round: 0.04 }), part(3.0, 0.15, 0.25, '#9aa2aa', [0, 2.3, 1.35])];
  for (const x of [-1, 1]) for (const z of [-0.6, 0.6]) out.push(cyl(0.6, 0.6, 0.08, o.on ? neon('#ff3a1a', 1.2) : '#3a3a40', [x, 3.18, z], { seg: 16 }));
  for (let i = 0; i < 4; i++) out.push(cyl(0.15, 0.15, 0.2, '#2a2e36', [-1.2 + i * 0.8, 2.7, 1.38], { rot: [90, 0, 0], seg: 8 }));
  return out; });
defineItem('wardrobe', o => { const c = o.color || '#9a6438'; return [part(5.4, 8.4, 2.4, c, [0, 0, 0], { base: true, round: 0.1 }), part(5.8, 0.4, 2.7, shade(c, -0.15), [0, 8.4, 0], { base: true, round: 0.08 }), block(0.08, 7.6, 0.1, shade(c, -0.35), [0, 0.4, 1.21], { base: true }), part(2.4, 7.2, 0.12, shade(c, 0.08), [-1.3, 0.6, 1.2], { base: true, round: 0.05 }), part(2.4, 7.2, 0.12, shade(c, 0.08), [1.3, 0.6, 1.2], { base: true, round: 0.05 }), part(0.15, 1.2, 0.2, '#f2c22e', [-0.35, 4, 1.33]), part(0.15, 1.2, 0.2, '#f2c22e', [0.35, 4, 1.33])]; });
defineItem('poster', o => {   // flat wall poster centred on its origin, facing +Z
  const w = o.w || 3.2, h = o.h || 4.4, bg = o.bg || '#2d7be0', fg = o.fg || '#f5cd30', txt = o.text ?? 'GAME', shape = o.shape || 'star';
  const t = canvasTex(256, Math.round(256 * h / w), (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, shade(bg, 0.15)); gr.addColorStop(1, shade(bg, -0.2)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = fg; g.beginPath(); const cx = W / 2, cy = H * 0.42, R = W * 0.3;
    if (shape === 'star') for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    else if (shape === 'circle') g.arc(cx, cy, R, 0, 7); else { g.rect(cx - R * 0.8, cy - R, R * 1.6, R * 2); }
    g.fill(); g.fillStyle = '#ffffff'; g.font = `700 ${W * 0.2}px "Fredoka", sans-serif`; g.textAlign = 'center'; g.fillText(txt, W / 2, H * 0.86); g.strokeStyle = '#ffffff'; g.lineWidth = 10; g.strokeRect(5, 5, W - 10, H - 10); }, { key: `poster${w}${h}${bg}${fg}${txt}${shape}` });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 })); m.position.z = 0.06; m.receiveShadow = true; return [m];
});
defineItem('speaker', o => { const s = o.s || 1; return [part(3 * s, 4.6 * s, 2.4 * s, '#1b1b1f', [0, 0, 0], { base: true, round: 0.12 }), cyl(1.05 * s, 1.05 * s, 0.1, '#55555c', [0, 1.6 * s, 1.21 * s], { rot: [90, 0, 0], seg: 18 }), cyl(0.75 * s, 0.75 * s, 0.14, '#2a2a30', [0, 1.6 * s, 1.24 * s], { rot: [90, 0, 0], seg: 18 }), cyl(0.5 * s, 0.5 * s, 0.1, '#55555c', [0, 3.6 * s, 1.21 * s], { rot: [90, 0, 0], seg: 14 }), cyl(0.25 * s, 0.25 * s, 0.14, '#2a2a30', [0, 3.6 * s, 1.24 * s], { rot: [90, 0, 0], seg: 12 })]; });
defineItem('micStand', o => [cyl(0.6, 0.7, 0.12, '#222', [0, 0, 0], { base: true, seg: 12 }), cyl(0.06, 0.06, 4.4, '#333', [0, 0, 0], { base: true, seg: 6 }), cyl(0.12, 0.09, 0.6, '#222', [0, 4.6, 0.15], { rot: [70, 0, 0], seg: 8 }), ball(0.2, '#888', [0, 4.75, 0.45], { seg: 10 })]);
defineItem('drumKit', o => [cyl(1.4, 1.4, 1.2, '#f4f4f4', [0, 1.4, 0], { rot: [90, 0, 0], seg: 20 }), cyl(1.42, 1.42, 0.2, '#c4281c', [0, 1.4, 0.55], { rot: [90, 0, 0], seg: 20 }), cyl(0.7, 0.7, 0.8, '#c4281c', [-1.4, 2.8, 0.4], { seg: 16 }), cyl(0.7, 0.7, 0.8, '#c4281c', [1.4, 2.8, 0.4], { seg: 16 }), cyl(0.06, 0.06, 4, '#aaa', [-2.6, 0, -0.4], { base: true, seg: 5 }), cyl(1.1, 1.1, 0.06, plastic('#f2c22e', { metal: 0.7, rough: 0.3 }), [-2.6, 4, -0.4], { seg: 18 }), cyl(0.06, 0.06, 3.4, '#aaa', [2.6, 0, -0.2], { base: true, seg: 5 }), cyl(0.9, 0.9, 0.06, plastic('#f2c22e', { metal: 0.7, rough: 0.3 }), [2.6, 3.4, -0.2], { seg: 18 })]);
defineItem('banner', o => { const c = o.color || '#c4281c', e = o.emblem || '#f2c22e'; const em = part(1.2, 1.2, 0.1, e, [0, -2.6, 0.12], { round: 0.03 }); em.rotation.z = 45 * D2R; return [cyl(0.1, 0.1, 3.2, '#6a4528', [0, 0, 0.2], { rot: [0, 0, 90], seg: 6 }), part(2.6, 5.4, 0.15, c, [0, -2.8, 0.1], { round: 0.03 }), em, block(2.6, 0.3, 0.17, e, [0, -5.4, 0.1])]; });   // hangs DOWN from its origin
defineItem('well', o => [cyl(2, 2.1, 2, plastic('#ffffff', { map: patternTex('bricks', '#9a9690', [4, 1]) }), [0, 0, 0], { base: true, seg: 14 }), disc(1.7, '#2a4a6a', 0, 1.6, 0, 16), ...[-1.7, 1.7].map(x => part(0.3, 4.6, 0.3, '#6a4528', [x, 2, 0], { base: true })), wedge(2.2, 1.4, 2.4, '#b5523b', [0, 6.6, -1.1]), wedge(2.2, 1.4, 2.4, '#b5523b', [0, 6.6, 1.1], { rot: [0, 180, 0] }), cyl(0.15, 0.15, 3.4, '#6a4528', [0, 5.0, 0], { rot: [0, 0, 90], seg: 6 })]);
defineItem('hay', o => [part(3, 1.8, 2, '#e8c45a', [0, 0, 0], { base: true, round: 0.3 }), block(3.02, 1.82, 0.15, '#c8a03a', [0, 0, 0.5], { base: true }), block(3.02, 1.82, 0.15, '#c8a03a', [0, 0, -0.5], { base: true })]);
defineItem('mushroom', o => { const s = o.s || 1, c = o.color || '#e8304a'; return [cyl(0.28 * s, 0.35 * s, 1.0 * s, '#f4ecd8', [0, 0, 0], { base: true, seg: 8 }), hemisphere(0.8 * s, c, [0, 0.9 * s, 0], 12), ball(0.13 * s, '#ffffff', [0.35 * s, 1.45 * s, 0.4 * s], { seg: 6 }), ball(0.11 * s, '#ffffff', [-0.45 * s, 1.35 * s, 0.1 * s], { seg: 6 })]; });
defineItem('log', o => { const L = o.l || 5; return [cyl(0.7, 0.7, L, '#7a4f2c', [0, 0.65, 0], { rot: [0, 0, 90], seg: 10 }), ...[-1, 1].map(sx => cyl(0.6, 0.6, 0.05, '#d8b07a', [sx * (L / 2 + 0.01), 0.65, 0], { rot: [0, 0, 90], seg: 10 }))]; });
defineItem('stump', o => [cyl(0.9, 1.1, 1.2, '#7a4f2c', [0, 0, 0], { base: true, seg: 10 }), cyl(0.85, 0.85, 0.06, '#d8b07a', [0, 1.2, 0], { seg: 10 })]);
defineItem('craterRim', o => { const R = o.r || 4, t = new THREE.Mesh(new THREE.TorusGeometry(R, 0.7, 6, 24), plastic(o.color || '#b4b4bc')); t.rotation.x = -Math.PI / 2; t.scale.set(1, 1, 0.35); t.castShadow = true; t.receiveShadow = true; return [t, disc(R, o.inner || '#80808a', 0, 0.06, 0, 24)]; });
defineItem('dome', o => { const R = o.r || 7, out = [cyl(R + 0.3, R + 0.3, 1.2, '#c8ccd2', [0, 0, 0], { base: true, seg: 24 }), hemisphere(R, '#f4f6f8', [0, 1.2, 0], 24)];
  const band = new THREE.Mesh(new THREE.TorusGeometry(R * 0.86, 0.35, 6, 32), neon('#5ab8ff', 0.9)); band.position.y = 1.2 + R * 0.5; band.rotation.x = Math.PI / 2; out.push(band);
  out.push(part(3.6, 4.6, 4, '#d8dce2', [0, 0, R - 0.4], { base: true, round: 0.3 }), part(2.4, 3.6, 0.2, '#3a3f4c', [0, 0.2, R + 1.65], { base: true, round: 0.1 }), part(1.8, 0.3, 0.1, neon('#ff3a3a', 1.5), [0, 4.0, R + 1.62]));
  out.push(cyl(0.12, 0.12, 4, '#9aa2aa', [R * 0.3, R + 0.8, -R * 0.2], { base: true, seg: 6 }), ball(0.3, neon('#ff3a3a', 2), [R * 0.3, R + 4.9, -R * 0.2], { seg: 8 }));
  return out; });
defineItem('solarPanel', o => [cyl(0.15, 0.15, 2, '#9aa2aa', [0, 0, 0], { base: true, seg: 6 }), part(4, 0.15, 2.6, plastic('#1e3a8a', { metal: 0.5, rough: 0.25, map: patternTex('tiles', '#1e3a8a', [1, 1], { n: 4 }) }), [0, 2.2, 0], { rot: [-25, 0, 0], round: 0.03 })]);
defineItem('flag', o => [cyl(0.08, 0.08, 6, '#d8dce2', [0, 0, 0], { base: true, seg: 6 }), part(2.6, 1.6, 0.06, o.color || '#2d7be0', [1.35, 5.1, 0], { round: 0.02 }), part(0.9, 0.9, 0.08, o.emblem || '#f4f4f4', [1.0, 5.1, 0], { round: 0.2 })]);
defineItem('sandcastle', o => { const c = '#e0c080'; return [part(4, 1.6, 4, c, [0, 0, 0], { base: true, round: 0.2 }), ...[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map(([x, z]) => cyl(0.6, 0.7, 2.6, c, [x, 0, z], { base: true, seg: 10 })), cyl(0.9, 1.1, 3.2, c, [0, 1.4, 0], { base: true, seg: 10 }), cone(0.9, 1.0, c, [0, 4.6, 0], { base: true, seg: 10 }), flagSmall()]; });
function flagSmall() { return group(cyl(0.04, 0.04, 1.2, '#f4f4f4', [0, 5.4, 0], { base: true, seg: 4 }), part(0.8, 0.5, 0.04, '#e8304a', [0.42, 6.35, 0], { round: 0.01 })); }

// ---------- outdoor sets ----------
defineSet('forest', (st, o) => {
  st.add(ground(1200, 1200, '#4a8a3c', { tex: patternTex('grass', '#4a8a3c', [150, 150]) }));
  st.add(disc(12, plastic('#ffffff', { map: patternTex('grass', '#6e8a3a', [6, 6]), rough: 0.95 }), 0, 0.02, -2, 28));   // clearing (trampled grass / dirt)
  const r = rng(o.seed || 12);
  scatter(st, o.trees || 52, o.seed || 12, (q) => { const a = q() * Math.PI * 2, d = 16 + Math.pow(q(), 0.7) * 60, x = Math.cos(a) * d, z = Math.sin(a) * d - 4; return clearOf(x, z, 15) ? [x, z] : null; },
    ([x, z], q, i) => put(st, q() < 0.6 ? 'pine' : 'tree', x, z, q() * 360, { s: 1.1 + q() * 0.9, seed: i, color: q() < 0.5 ? undefined : (q() < 0.5 ? '#2a6a34' : '#3a8a3a') }));
  scatter(st, 14, 77, (q) => { const a = q() * Math.PI * 2, d = 12 + q() * 16, x = Math.cos(a) * d, z = Math.sin(a) * d - 4; return clearOf(x, z, 12) ? [x, z] : null; }, ([x, z], q) => put(st, 'bush', x, z, q() * 360, { s: 0.8 + q() * 0.6, color: '#3a8a34' }));
  scatter(st, 8, 31, (q) => { const x = (q() - 0.5) * 34, z = (q() - 0.5) * 28 - 4; return clearOf(x, z, 9) ? [x, z] : null; }, ([x, z], q, i) => put(st, 'mushroom', x, z, q() * 360, { s: 0.7 + q() * 0.6, color: i % 3 ? '#e8304a' : '#ff8a2a' }));
  put(st, 'rock', -13, -10, 20, { s: 1.2 }); put(st, 'rock', 15, -14, 70, { s: 0.9 }); put(st, 'stump', 10, -9, 0); put(st, 'log', -11, 4, 30, { l: 6 });
  const spots = { clearing: [0, 0], edge: [10, -10], stump: [10, -9], rock: [-13, -10] };
  if (o.campfire !== false) { put(st, 'campfire', 0, -5); plight(st, '#ff9a3a', o.night ? 40 : 14, 24, 0, 2.5, -5); put(st, 'log', -4.2, -6.5, 70, { l: 4 }); put(st, 'log', 4.2, -6.5, -70, { l: 4 }); Object.assign(spots, { campfire: [0, -5], seatL: [-4.2, -6.5], seatR: [4.2, -6.5] }); }
  if (o.tent !== false) { put(st, 'tent', -9, -12, 30, { color: '#e07a2a' }); put(st, 'tent', 9, -14, -20, { color: '#2d7be0' }); Object.assign(spots, { tent: [-8, -9], tent2: [8.5, -11] }); }
  return { spots };
}, { light: 'day', desc: 'dense forest of pines and trees around a clearing at the origin; campfire at [0,-5] with log seats, two tents behind (opts {campfire:false, tent:false, trees:N, night:true})' });

defineSet('desert', (st, o) => {
  const sand = '#e6c385';
  st.add(ground(1200, 1200, sand, { tex: patternTex('noise', sand, [120, 120]) }));
  const r = rng(o.seed || 14);
  // dunes: big squashed spheres half-buried, mostly behind and to the sides
  for (let i = 0; i < 14; i++) { const a = Math.PI * (1.05 + r() * 0.9) + (i % 2 ? 0 : (r() - 0.5) * 1.2), d = 45 + r() * 120, R = 18 + r() * 26; st.add(ball(R, shade(sand, (r() - 0.5) * 0.14), [Math.cos(a) * d, -R * 0.05, Math.sin(a) * d], { scale: [1.4, 0.28, 1], seg: 18 })); }
  // far pyramids
  const pyr = (x, z, R, H) => { const p = cone(R, H, plastic('#ffffff', { map: patternTex('bricks', '#d8b070', [6, 6]) }), [x, 0, z], { base: true, seg: 4 }); p.rotation.y = 45 * D2R; st.add(p); };
  pyr(-70, -230, 60, 62); pyr(10, -290, 44, 46); pyr(90, -250, 30, 32);
  // mesas left and right
  for (const [x, z, w, h] of [[-120, -60, 50, 26], [140, -90, 60, 34]]) st.add(part(w, h, w * 0.6, '#c8784a', [x, 0, z], { base: true, round: 2 }), part(w * 0.7, h * 0.4, w * 0.45, '#b8683a', [x, h, z], { base: true, round: 1.5 }));
  scatter(st, 16, 21, (q) => { const x = (q() - 0.5) * 90, z = -q() * 70 + 14; return clearOf(x, z, 12) ? [x, z] : null; }, ([x, z], q, i) => put(st, 'cactus', x, z, q() * 360, { s: 0.8 + q() * 0.6, flower: i % 4 === 0 }));
  scatter(st, 10, 22, (q) => { const x = (q() - 0.5) * 80, z = -q() * 60 + 10; return clearOf(x, z, 10) ? [x, z] : null; }, ([x, z], q) => put(st, 'rock', x, z, q() * 360, { s: 0.6 + q() * 1.0, color: q() < 0.5 ? '#b5704a' : '#a88a6a' }));
  put(st, 'cactus', -8, -6, 0, { s: 1.1, flower: true }); put(st, 'rock', 9, -8, 30, { s: 1.4, color: '#b5704a' });
  put(st, 'sign', 7, 2, -30, { text: 'OASIS →', bg: '#e8d0a0', color: '#6a3a1a' });
  st.add(part(1.4, 0.5, 0.8, '#f4f0e0', [-5, 0, 6], { base: true, round: 0.2 }));   // bleached bone-ish rock
  return { spots: { center: [0, 0], cactus: [-8, -3.5], rock: [9, -5.5], sign: [7, 3.5], dune: [0, -40] } };
}, { light: 'day', desc: 'sandy desert: rounded dunes, cacti, red rocks, mesas, pyramids far away at -Z, an "OASIS" sign. spots cactus, rock, sign' });

defineSet('winter', (st, o) => {
  const snow = '#eef4fa';
  st.add(ground(1200, 1200, snow, { tex: patternTex('noise', snow, [120, 120]), rough: 0.95 }));
  // frozen pond
  st.add(disc(9, plastic('#a8d8f0', { rough: 0.08, metal: 0.15 }), 15, 0.04, -9, 32)); st.add(disc(9.8, '#d8e8f4', 15, 0.025, -9, 32));
  scatter(st, o.trees || 30, o.seed || 15, (q) => { const a = q() * Math.PI * 2, d = 18 + Math.pow(q(), 0.7) * 60, x = Math.cos(a) * d, z = Math.sin(a) * d - 6; return clearOf(x, z, 17) && Math.hypot(x - 15, z + 9) > 12 && Math.hypot(x + 14, z + 22) > 12 ? [x, z] : null; },
    ([x, z], q) => put(st, 'snowPine', x, z, q() * 360, { s: 1.0 + q() * 0.8 }));
  scatter(st, 10, 16, (q) => { const x = (q() - 0.5) * 60, z = -q() * 40 + 8; return clearOf(x, z, 10) && Math.hypot(x - 15, z + 9) > 13 && Math.hypot(x + 14, z + 22) > 10 ? [x, z] : null; }, ([x, z], q) => st.add(ball(1.5 + q() * 1.6, snow, [x, -0.6, z], { scale: [1.4, 0.6, 1], seg: 12 })));
  put(st, 'cabin', -14, -22, 15); plight(st, '#ffcf6a', 10, 18, -12, 3, -14);
  put(st, 'snowman', -9, -1, 30); put(st, 'fence', 2, -18, 0, { n: 5, color: '#8a5a3a' });
  put(st, 'barrel', -6, -16, 0, { color: '#7a4f2c' }); st.add(part(4, 2.4, 3, plastic('#ffffff', { map: patternTex('planks', '#8a5a3a', [1, 1]) }), [-20, 0, -15], { base: true, round: 0.1 }));   // woodpile
  return { spots: { center: [0, 0], snowman: [-7, 1], pond: [15, -9], pondEdge: [8, -6], cabin: [-12, -15], cabinDoor: [-12.6, -15.5] } };
}, { light: 'day', desc: 'snowy winter landscape: snow ground, snowy pines, snowman at [-9,-1], frozen pond at [15,-9], log cabin with glowing windows behind-left' });

defineSet('beach', (st, o) => {
  const sand = '#ecd29a';
  st.add(ground(1200, 1200, sand, { tex: patternTex('noise', sand, [120, 120]) }));
  st.add(ground(1200, 6, '#d4b47a', { z: -17, y: 0.02 }));                                       // wet sand
  st.add(ground(1200, 2, '#f4fbff', { z: -19.6, y: 0.05 }));                                      // foam line
  const sea = ground(1200, 600, '#2aa8d8', { y: 0.06, z: -320, rough: 0.12 }); sea.material.metalness = 0.2; st.add(sea);
  st.add(ground(1200, 30, '#56c8e6', { y: 0.065, z: -35, rough: 0.12 }));                          // shallow band
  for (const [x, z, s, l] of [[-16, -8, 1.2, 16], [-22, 4, 1.0, 22], [17, -4, 1.15, -18], [26, 8, 1.0, -10], [-30, -10, 1.3, 10]]) put(st, 'palm', x, z, l < 0 ? 180 : 0, { s, lean: Math.abs(l) });
  put(st, 'umbrella', -6, -7, 0, { color: '#e8304a' }); put(st, 'towel', -6.5, -3.5, 10, { color: '#2d7be0' }); put(st, 'towel', -3, -4, -8, { color: '#ff66cc' });
  put(st, 'umbrella', 8, -10, 0, { color: '#f5cd30', tilt: -6 }); put(st, 'towel', 8, -6.5, 0, { color: '#4b974b' });
  put(st, 'lifeguardTower', 15, -12, -20); put(st, 'sandcastle', 3, -12, 0, { s0: 0.8 }); put(st, 'ball', 3, 4, 0, { r: 0.9, color: '#ff8a2a', y: 0.3 });
  st.add(part(1.4, 5.6, 0.35, '#f5cd30', [-12, 0, -1], { base: true, round: 0.17, rot: [0, 30, 4] }));    // surfboard in the sand
  put(st, 'rock', -38, -24, 0, { s: 2.2, color: '#8a8070' }); put(st, 'rock', 34, -26, 40, { s: 1.6, color: '#8a8070' });
  // boat on the sea
  st.add(group(part(8, 2, 3, '#f4f4f4', [0, 0, 0], { base: true, round: 0.4 }), part(3, 2, 2.4, '#2d7be0', [-1, 2, 0], { base: true, round: 0.2 })).translateX(-40).translateZ(-110));
  return { spots: { towel1: [-6.5, -3.5], towel2: [-3, -4], towel3: [8, -6.5], umbrella: [-6, -7], tower: [15, -8], water: [0, -24], shore: [0, -17], center: [0, 0] } };
}, { light: 'day', desc: 'sunny beach: sand, ocean towards -Z (shore at z=-17), palm trees, striped umbrellas with towels, lifeguard tower, sandcastle, surfboard, boat' });

defineSet('space', (st, o) => {
  const g = '#9c9ca4';
  st.add(ground(1200, 1200, g, { tex: patternTex('noise', g, [100, 100]) }));
  for (const [x, z, R] of [[-9, 12, 3.5], [20, -4, 5], [-24, -30, 8], [12, -34, 6], [40, -60, 12], [-50, -70, 14], [-8, -50, 4], [28, 20, 4]]) put(st, 'craterRim', x, z, 0, { r: R });
  scatter(st, 14, 41, (q) => { const x = (q() - 0.5) * 90, z = -q() * 70 + 10; return clearOf(x, z, 10) ? [x, z] : null; }, ([x, z], q) => put(st, 'rock', x, z, q() * 360, { s: 0.4 + q() * 0.9, color: '#7a7a82' }));
  // hills on the horizon
  for (let i = 0; i < 6; i++) st.add(ball(40 + i * 6, shade(g, -0.08 - i * 0.02), [-200 + i * 80, -14, -260 - (i % 2) * 60], { scale: [1.6, 0.5, 1], seg: 16 }));
  // planet with a ring + small moon (fog-free basic materials so they read on black)
  const planet = new THREE.Mesh(new THREE.SphereGeometry(70, 32, 20), plastic('#4a7ae8', { emissive: '#2a4aa8', emissiveIntensity: 0.55 })); planet.position.set(-160, 150, -520); st.add(planet);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(115, 7, 4, 48), plastic('#e8c890', { emissive: '#8a6a40', emissiveIntensity: 0.5 })); ring.position.copy(planet.position); ring.rotation.set(1.25, 0.3, 0.2); ring.scale.set(1, 1, 0.12); st.add(ring);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(16, 20, 14), plastic('#e8a070', { emissive: '#8a4a2a', emissiveIntensity: 0.5 })); moon.position.set(180, 120, -480); st.add(moon);
  put(st, 'rocket', 13, -12, -20, { s0: 1.4 }); st.add(cyl(5, 5.4, 0.8, '#5a5e66', [13, 0, -12], { base: true, seg: 8 }));
  put(st, 'dome', -15, -16, 25, { r: 7 }); put(st, 'solarPanel', -24, -8, 30); put(st, 'solarPanel', -27, -13, 30);
  put(st, 'flag', 5, -6, 0, { color: '#c4281c' });
  return { spots: { center: [0, 0], rocket: [10, -6], domeDoor: [-11.5, -8.5], flag: [5, -4.5], crater: [-9, 12] } };
}, { light: 'space', desc: 'moon surface: grey cratered ground, ringed planet in the black starry sky, rocket on a launch pad at [13,-12], white base dome with airlock at [-15,-16], solar panels, flag' });

defineSet('cave', (st, o) => {
  const rk = '#6a5e54'; st.scene.add(new THREE.HemisphereLight('#b8a090', '#3a3028', 0.9));
  st.add(ground(400, 400, '#5a4e44', { tex: patternTex('noise', '#5a4e44', [40, 40]) }));
  const r = rng(o.seed || 17);
  const rock = (x, y, z, w, h, d) => { const p = part(w, h, d, shade(rk, (r() - 0.5) * 0.25), [x, y, z], { round: Math.min(2.5, w / 4, h / 4, d / 4), rot: [(r() - 0.5) * 20, r() * 60, (r() - 0.5) * 20] }); st.add(p); return p; };
  for (let x = -40; x <= 40; x += 9) rock(x, 7, -24 - r() * 3, 12 + r() * 4, 18 + r() * 6, 8);                // back wall
  for (const s of [-1, 1]) for (let z = -24; z <= 22; z += 8) rock(s * (25 + r() * 3), 7, z, 8, 18 + r() * 6, 11 + r() * 3);   // side walls
  const ceil = part(80, 3, 60, '#2e2824', [0, 19, -4], { round: 1 }); ceil.castShadow = false; st.add(ceil);
  for (let i = 0; i < 16; i++) { const x = (r() - 0.5) * 44, z = -22 + r() * 34; st.add(cone(0.6 + r() * 0.9, 3 + r() * 4, shade(rk, -0.1), [x, 17.6, z], { rot: [180, 0, 0], seg: 6 })); }
  scatter(st, 9, 18, (q) => { const x = (q() - 0.5) * 44, z = -20 + q() * 30; return clearOf(x, z, 13) ? [x, z] : null; }, ([x, z], q) => st.add(cone(0.7 + q() * 0.8, 2.5 + q() * 3.5, shade(rk, 0.05), [x, 0, z], { base: true, seg: 6 })));
  // crystals
  const cc = ['#3af0ff', '#c05aff', '#ff4ad0', '#3af0ff', '#7affb0', '#c05aff'];
  [[-18, -17], [-21, -6], [18, -18], [21, 2], [-6, -20], [9, -21]].forEach(([x, z], i) => put(st, 'crystal', x, z, i * 50, { color: cc[i], s: 1.1 + (i % 3) * 0.3, seed: i + 3 }));
  plight(st, '#9a6aff', 70, 34, -17, 4, -13); plight(st, '#3af0ff', 60, 34, 18, 4, -12);
  // mine rails along X at z=-8 with a cart
  for (const dz of [-1, 1]) st.add(block(80, 0.25, 0.3, plastic('#8a8a92', { metal: 0.6, rough: 0.35 }), [0, 0.3, -8 + dz * 1.0], { base: true }));
  for (let x = -38; x <= 38; x += 2.4) st.add(block(0.6, 0.3, 3, '#5a3a24', [x, 0, -8], { base: true }));
  put(st, 'minecart', 9, -8, 90); put(st, 'pickaxe', -10, -9.6, 0, { y: 0.1 });
  // torches
  for (const [x, z] of [[-12, -14], [12, -15]]) { put(st, 'torchStand', x, z); plight(st, '#ff9a3a', 60, 32, x, 5.5, z + 1.5); }
  put(st, 'barrel', -14, -11, 0); put(st, 'crate', 15, -12, 20, { s: 0.8 });
  return { spots: { center: [0, 0], rails: [0, -8], minecart: [9, -6], crystals: [-17, -14], crystals2: [17, -15], torch1: [-12, -12], torch2: [12, -13] } };
}, { light: 'cave', desc: 'dark underground cave: rock walls and ceiling with stalactites, glowing crystals (purple/cyan light), torches, mine rails along X at z=-8 with an ore minecart' });

// ---------- interiors ----------
defineSet('bedroom', (st, o) => {
  room(st, { w: 36, d: 26, h: 13, wall: o.wall || '#cfe0f5', floor: '#b88a5a' });
  st.add(disc(6, plastic('#ffffff', { map: patternTex('carpet', '#9a6ad6', [1, 1]) }), -1, 0.04, 0, 32));
  put(st, 'bed', -10, -8.0, 0, { color: o.bedColor || '#e8304a' });
  st.add(part(2.4, 2.4, 2.2, '#9a6438', [-14.6, 0, -11], { base: true, round: 0.1 }), part(2.0, 0.6, 0.1, '#7a4f2c', [-14.6, 1.4, -9.85]));    // nightstand
  put(st, 'lamp', -14.6, -11, 0, { y: 2.4, s0: 0.5 });
  put(st, 'desk', 8, -11.2, 0, { color: '#f4f4f4' }); put(st, 'computer', 8, -11.5, 0, { y: 2.45, text: o.screen || '', screen: '#2a6ad6' }); put(st, 'chair', 8, -8.6, 180, { color: '#2d7be0' });
  put(st, 'wardrobe', 16.3, -2, -90); put(st, 'bookshelf', 16.6, -9.5, -90, { seed: 5 });
  windowOn(st, -1.5, 7, -12.6, 6, 4.4, 0);
  put(st, 'poster', 8, -12.45, 0, { y: 7.6, text: 'GAME', bg: '#2d7be0', fg: '#f5cd30', shape: 'star' });
  put(st, 'poster', 12.5, -12.45, 0, { y: 7.2, text: 'OBBY', bg: '#e8304a', fg: '#ffffff', shape: 'circle', w: 2.8, h: 3.6 });
  put(st, 'poster', -17.45, -2.5, 90, { y: 7, text: 'NOOB', bg: '#4b974b', fg: '#f5cd30', shape: 'square' });
  st.add(ball(1.6, '#f5cd30', [-13, 1.0, 3], { scale: [1.2, 0.7, 1.2] }));   // beanbag
  put(st, 'gift', -15, 8, 20, { color: '#2d7be0', s0: 0.7 }); put(st, 'plant', 3.5, -11, 0);
  return { spots: { center: [0, 0], bed: [-10, -4], bedSide: [-6, -6], desk: [8, -8.6], computer: [8, -9], wardrobe: [13, -2], window: [-1.5, -10] } };
}, { light: 'interior', desc: 'kid bedroom: bed (back-left), nightstand+lamp, desk with computer and chair (back-right), wardrobe and bookshelf on the right wall, window, posters, round rug, beanbag' });

defineSet('kitchen', (st, o) => {
  room(st, { w: 36, d: 26, h: 13, wall: o.wall || '#f4ead0', floor: '#f0f0f0', floorTex: patternTex('checker', '#f2f2f2', [36 / 6, 26 / 6], { color2: '#2a2e36', n: 4 }) });
  const zc = -11.2;
  put(st, 'fridge', -14.6, zc, 0, { color: '#e8ecf0' });
  put(st, 'counter', -8.5, zc, 0, { w: 7, color: '#6aa8d8' }); put(st, 'stove', -3, zc, 0, { on: !!o.cooking });
  put(st, 'counter', 5, zc, 0, { w: 12, color: '#6aa8d8' });
  st.add(part(3.6, 0.2, 1.8, plastic('#c8ccd2', { metal: 0.6, rough: 0.3 }), [4, 3.32, zc + 0.1], { round: 0.05 }), cyl(0.12, 0.12, 1.4, '#c8ccd2', [4, 3.3, zc - 1.0], { base: true, seg: 8 }), part(0.2, 0.2, 1.0, '#c8ccd2', [4, 4.6, zc - 0.6]));   // sink + faucet
  for (const [x, w] of [[-8.5, 7], [9, 4]]) { st.add(part(w, 3.4, 1.6, '#6aa8d8', [x, 7.4, -11.7], { base: true, round: 0.06 })); }
  st.add(part(4.4, 1.6, 2, '#c8ccd2', [-3, 8.4, -11.4], { base: true, round: 0.1 }));   // range hood
  windowOn(st, 3, 8.2, -12.6, 5, 3.6, 0);
  put(st, 'pot', -4, zc, 0, { y: 3.25 }); put(st, 'cup', -9, zc, 0, { y: 3.3, color: '#f5cd30' }); put(st, 'plant', 10, zc, 0, { y: 3.3, s0: 0.6 });
  st.add(cyl(1.1, 1.1, 0.2, '#ffffff', [-8.5, 9.6, -12.4], { rot: [90, 0, 0], seg: 20 }), cyl(1.2, 1.2, 0.15, '#2a2e36', [-8.5, 9.6, -12.45], { rot: [90, 0, 0], seg: 20 }));   // clock
  put(st, 'table', 8, 3, 0, { w: 6, d: 4, h: 2.4, color: '#c69a62' });
  const seats = { seat1: [5.6, 0.2], seat2: [10.4, 0.2], seat3: [5.6, 5.8], seat4: [10.4, 5.8] };
  put(st, 'chair', 6.2, 0.3, 0, { color: '#e8304a' }); put(st, 'chair', 9.8, 0.3, 0, { color: '#e8304a' }); put(st, 'chair', 6.2, 5.7, 180, { color: '#e8304a' }); put(st, 'chair', 9.8, 5.7, 180, { color: '#e8304a' });
  put(st, 'cake', 8, 3, 0, { y: 2.55, s0: 0.6 });
  return { spots: { center: [0, 0], stove: [-3, -8.5], fridge: [-14.6, -8.6], sink: [4, -8.6], counter: [-8.5, -8.6], table: [8, 3], ...seats } };
}, { light: 'interior', desc: 'kitchen: checker floor, blue counters along the back wall with fridge, stove (opts {cooking:true} glows), sink under a window, upper cabinets, table with 4 chairs at [8,3] (spots seat1..seat4)' });
defineItem('pot', o => [cyl(0.8, 0.7, 0.9, plastic('#9aa2aa', { metal: 0.6, rough: 0.3 }), [0, 0, 0], { base: true, seg: 14 }), part(0.6, 0.15, 0.15, '#2a2e36', [1.05, 0.7, 0])]);

defineSet('shop', (st, o) => {
  room(st, { w: 44, d: 32, h: 14, wall: o.wall || '#f4eee0', floor: '#e8e8ec', floorTex: patternTex('tiles', '#e8e8ec', [44 / 6, 32 / 6], { n: 3 }), lamp: 80 });
  st.add(block(44, 2.4, 0.4, '#e8304a', [0, 11, -15.3]));
  const sg = textPlane(o.name || 'SUPER SHOP', 14, 2.2, { bg: '#e8304a', color: '#ffffff' }); sg.position.set(0, 12.1, -15.05); st.add(sg);
  put(st, 'storeShelf', -14, -14.1, 0, { w: 11, seed: 3 }); put(st, 'drinkFridge', 5, -14.1, 0); put(st, 'storeShelf', 15, -14.1, 0, { w: 9, seed: 4 });
  put(st, 'storeShelf', -16, -3, 90, { w: 11, double: true, seed: 6 }); put(st, 'storeShelf', -9, -3, 90, { w: 11, double: true, seed: 7, colors: ['#f5cd30', '#ff8a2a', '#e8304a', '#ffffff', '#c45a2a'] });
  // checkout counter on the right
  st.add(part(2.6, 3.4, 9, '#2d7be0', [12, 0, 5], { base: true, round: 0.1 }), part(3, 0.3, 9.4, '#f4f4f4', [12, 3.4, 5], { base: true, round: 0.06 }));
  put(st, 'register', 12, 2.8, -90, { y: 3.7 }); put(st, 'storeShelf', 12, 9, -90, { w: 2.6, h: 3.4, seed: 9, colors: ['#ff66cc', '#f5cd30', '#12c4d4'] });
  // entrance door on the right wall + OPEN sign
  st.add(part(5, 8, 0.3, glass('#bfe6ff', 0.55), [21.35, 0, -6], { base: true, rot: [0, 90, 0] }), block(0.5, 8.4, 5.6, '#8a8f96', [21.4, 0, -6], { base: true }).translateX(0.05));
  st.add(part(5.4, 0.5, 0.2, '#8a8f96', [21.2, 8.1, -6], { rot: [0, 90, 0] }));
  const op = textPlane('OPEN', 3, 1.2, { bg: '#1b1b1f', color: '#ff3a6a', glow: true }); op.position.set(21.2, 9.6, -6); op.rotation.y = -Math.PI / 2; st.add(op);
  // ceiling light panels
  for (const x of [-10, 10]) for (const z of [-8, 4]) st.add(block(6, 0.15, 1.6, neon('#ffffff', 0.9), [x, 13.4, z]));
  put(st, 'plant', -19, 10, 0); st.add(part(2.4, 1.4, 1.6, '#c4281c', [-19.5, 0, 4], { base: true, round: 0.1 }));   // basket stack
  return { spots: { center: [0, 0], counter: [8.8, 4], cashier: [15, 4], register: [12, 2.8], aisle: [-12.5, -2], aisle2: [-5.5, -2], fridge: [5, -11], shelf: [-14, -11], door: [19, -6] } };
}, { light: 'interior', desc: 'store interior: SUPER SHOP sign, wall shelves of colourful goods and a glass drinks fridge at the back, two aisle shelves on the left, blue checkout counter with register on the right (customer at counter, clerk at cashier), glass door + OPEN sign on the right wall' });

// ---------- castle / spooky / stage ----------
defineSet('castle', (st, o) => {
  st.add(ground(1200, 1200, '#58a84a', { tex: patternTex('grass', '#58a84a', [150, 150]) }));
  st.add(ground(48, 40, '#b0aca0', { tex: patternTex('tiles', '#b0aca0', [12, 10], { n: 2 }), y: 0.02, z: -4 }));
  const stoneC = o.stone || '#a3a2a5', stone = (w, h) => plastic('#ffffff', { map: patternTex('bricks', stoneC, [Math.max(1, Math.round(w / 8)), Math.max(1, Math.round(h / 6))]) });
  const H = 13, B = -24;
  const wallSeg = (cx, cz, len, alongX) => { st.add(part(alongX ? len : 3, H, alongX ? 3 : len, stone(len, H), [cx, 0, cz], { base: true, round: 0.1 })); for (let k = -len / 2 + 1; k <= len / 2 - 1; k += 3) st.add(part(1.6, 1.6, 3.2, stoneC, alongX ? [cx + k, H, cz] : [cx, H, cz + k], { base: true, round: 0.1, rot: [0, alongX ? 0 : 90, 0] })); };
  wallSeg(-15.5, B, 17, true); wallSeg(15.5, B, 17, true);                // back wall with gate gap |x|<7
  wallSeg(-25.5, -6, 36, false); wallSeg(25.5, -6, 36, false);          // side walls
  for (const s of [-1, 1]) { st.add(part(6, H + 5, 6, stone(6, H + 5), [s * 7, 0, B], { base: true, round: 0.1 })); for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) st.add(part(1.6, 1.6, 1.6, stoneC, [s * 7 + dx, H + 5, B + dz], { base: true, round: 0.1 })); }   // gatehouse towers
  st.add(part(8.5, 4, 3, stone(8, 4), [0, 9.5, B], { base: true, round: 0.1 }));   // lintel over the gate
  st.add(part(8, 9.5, 0.4, '#3a2a1e', [0, 0, B - 1.2], { base: true, round: 0.05 }), part(8, 9.5, 0.4, plastic('#ffffff', { map: patternTex('planks', '#7a4f2c', [2, 1]) }), [0, 0, B - 0.9], { base: true, round: 0.05 }));   // wooden gate
  for (let x = -3.2; x <= 3.2; x += 1.6) st.add(block(0.25, 4.5, 0.25, '#2a2a30', [x, 5, B + 1.6], { base: true }));   // raised portcullis
  st.add(block(7.6, 0.3, 0.3, '#2a2a30', [0, 5.1, B + 1.6], { base: true }), block(7.6, 0.3, 0.3, '#2a2a30', [0, 7.4, B + 1.6], { base: true }));
  for (const s of [-1, 1]) {   // corner towers
    const x = s * 25.5; st.add(cyl(5, 5.4, 22, stone(30, 22), [x, 0, B], { base: true, seg: 16 }), cone(6.2, 8, s < 0 ? '#2d5ab8' : '#c4281c', [x, 22, B], { base: true, seg: 16 }), cyl(0.1, 0.1, 3, '#6a4528', [x, 30, B], { base: true, seg: 5 }), part(2.2, 1.3, 0.08, '#f5cd30', [x + 1.15, 32.2, B]));
    st.add(part(1.4, 2.4, 0.4, '#1b1b1f', [x, 15, B + 5.1], { round: 0.1 }));   // tower window
  }
  // keep behind the gate
  st.add(part(30, 26, 14, stone(30, 26), [0, 0, -46], { base: true, round: 0.1 }), cone(14, 12, '#2d5ab8', [0, 26, -46], { base: true, seg: 4 }).rotateY(45 * D2R));
  const ban = [['#c4281c', '#f5cd30'], ['#2d5ab8', '#f4f4f4'], ['#c4281c', '#f5cd30'], ['#2d5ab8', '#f4f4f4']];
  [-18, -12, 12, 18].forEach((x, i) => put(st, 'banner', x, B + 1.55, 0, { y: 12.4, color: ban[i][0], emblem: ban[i][1] }));
  put(st, 'banner', -23.95, -10, 90, { y: 12.4, color: '#2d5ab8', emblem: '#f4f4f4' }); put(st, 'banner', 23.95, -10, -90, { y: 12.4, color: '#c4281c', emblem: '#f5cd30' });
  put(st, 'well', -12, -8, 20); put(st, 'hay', 14, -14, -10); put(st, 'barrel', 18, -10, 0); put(st, 'crate', 19, -16, 15, { s: 0.9 }); put(st, 'torchStand', -5, -19); put(st, 'torchStand', 5, -19);
  put(st, 'barrel', -20, -18, 0, { color: '#7a4f2c' });
  return { spots: { courtyard: [0, 0], center: [0, 0], gate: [0, -20], gateOut: [0, -30], well: [-12, -5], towerL: [-21, -20], towerR: [21, -20], hay: [14, -11] } };
}, { light: 'day', desc: 'medieval castle courtyard: stone-tiled yard, crenellated walls, gatehouse with wooden gate and raised portcullis at z=-24, round towers with red/blue roofs, keep behind, hanging banners, well, hay, barrels, torches' });

defineSet('spooky', (st, o) => {
  st.add(ground(1200, 1200, '#3a4a38', { tex: patternTex('grass', '#3a4a38', [150, 150]) }));
  st.scene.add(new THREE.HemisphereLight('#9a8ad8', '#2a2a3a', 0.9));
  const ml = new THREE.DirectionalLight('#b8c0ff', 1.2); ml.position.set(30, 40, 60); st.scene.add(ml);   // cool moon fill from the camera side
  st.add(ground(5, 26, '#4a3e34', { y: 0.02, z: -12 }));    // path to the house
  // haunted house at the back
  const hx = 0, hz = -32, wall = '#4a4258', roof = '#231c2c';
  st.add(part(22, 13, 12, plastic('#ffffff', { map: patternTex('planks', wall, [2, 3], { n: 8 }) }), [hx, 0, hz], { base: true, round: 0.1 }));
  st.add(wedge(23, 7, 6.8, roof, [hx, 13, hz - 3.2]), wedge(23, 7, 6.8, roof, [hx, 13, hz + 3.2], { rot: [0, 180, 0] }));
  st.add(part(7, 24, 7, plastic('#ffffff', { map: patternTex('planks', shade(wall, -0.08), [1, 4], { n: 8 }) }), [hx + 13, 0, hz + 1], { base: true, round: 0.1 }), cone(5.8, 9, roof, [hx + 13, 24, hz + 1], { base: true, seg: 4 }).rotateY(45 * D2R));   // tower
  st.add(part(1.6, 6, 1.6, '#3a3440', [hx - 7, 15, hz - 2], { base: true, rot: [0, 0, 8] }));   // crooked chimney
  const win = (x, y, z, lit) => { st.add(part(2.6, 3.2, 0.3, lit ? neon('#ffd84a', 1.1) : '#14101c', [x, y, z], { round: 0.05 }), block(3.0, 0.3, 0.5, '#231c2c', [x, y - 1.7, z])); if (!lit) for (const a of [30, -30]) st.add(block(3.2, 0.4, 0.2, '#6a5040', [x, y, z + 0.25], { rot: [0, 0, a] })); };
  win(-6.5, 4.5, hz + 6.1, true); win(6.5, 4.5, hz + 6.1, false); win(-6.5, 10, hz + 6.1, false); win(0, 10, hz + 6.1, true); win(6.5, 10, hz + 6.1, true); win(hx + 13, 19, hz + 4.6, true);
  st.add(part(3.6, 6, 0.3, '#2a1a14', [0, 0, hz + 6.15], { base: true, round: 0.05 }), part(8, 0.5, 4, '#3a2e28', [0, 0, hz + 8], { base: true }), part(9, 0.4, 4.6, roof, [0, 7, hz + 8.2]), ...[-3.8, 3.8].map(x => part(0.4, 7, 0.4, '#3a2e28', [x, 0, hz + 10], { base: true })));   // door + porch
  plight(st, '#7aff8a', 14, 22, 0, 5, hz + 10);
  // moon
  const moon = new THREE.Mesh(new THREE.SphereGeometry(22, 24, 16), glowBasic('#fff2c8')); moon.position.set(90, 120, -380); st.add(moon);
  // graveyard on the left with an iron fence
  const gx = -13, gz = -11;
  [[-4, -4, 0], [0, -4.5, 1], [4, -4, 2], [-4, 1, 1], [0, 0.5, 0], [4, 1.5, 0], [-4, 6, 2], [1, 6, 1]].forEach(([dx, dz, k], i) => put(st, 'tombstone', gx + dx, gz + dz, (i * 37) % 20 - 10, { kind: k, color: i % 2 ? '#8a8f96' : '#7a8078' }));
  put(st, 'ironFence', gx, gz - 7.5, 0, { n: 12 }); put(st, 'ironFence', gx + 7.2, gz, 90, { n: 12 }); put(st, 'ironFence', gx - 7.2, gz, 90, { n: 12 });
  put(st, 'ironFence', gx - 4.4, gz + 7.5, 0, { n: 5 });
  for (const [x, z, s, sd] of [[-24, -20, 1.4, 1], [18, -14, 1.2, 2], [24, -2, 1.5, 3], [-26, 4, 1.1, 4], [12, -24, 1.3, 5], [-20, -32, 1.6, 6]]) put(st, 'deadTree', x, z, sd * 60, { s, seed: sd });
  put(st, 'pumpkin', 3.5, -18, -10); put(st, 'pumpkin', -3.2, -20, 15, { s: 0.8 }); put(st, 'pumpkin', 7, -6, -30, { s: 1.2 }); plight(st, '#ff8a2a', 10, 14, 4, 2, -16);
  // low ground mist
  const r = rng(29); for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 8), mistMat('#a898c8', 0.12)); m.scale.set(10 + r() * 8, 1.4, 6 + r() * 4); m.position.set((r() - 0.5) * 60, 0.2, -6 - r() * 34); st.add(m); }
  return { spots: { center: [0, 0], path: [0, -10], porch: [0, -22], door: [0, -24.5], graveyard: [-13, -11], graveyardGate: [-11, -2], pumpkins: [3, -15] } };
}, { light: 'spooky', desc: 'haunted house at night: crooked purple house with glowing and boarded windows and a tower at -Z, porch, dirt path, graveyard with tombstones and iron fence on the left, dead trees, jack-o-lanterns, moon, low purple mist' });

defineSet('stage', (st, o) => {
  st.add(ground(1200, 1200, '#24242c', { tex: patternTex('noise', '#24242c', [100, 100]) }));
  st.scene.add(new THREE.HemisphereLight('#8a7ad8', '#1a1a24', 0.7));
  for (const [x, z, c] of [[-14, 2, '#ff3ad0'], [14, 2, '#3af0ff'], [0, 10, '#f5cd30']]) st.add(disc(5, beamMat(c, 0.12), x, 0.05, z, 24));   // coloured light pools on the crowd floor
  const SZ = -15, SH = 3;   // stage centre z, height (front edge at z = -8)
  st.add(part(40, SH, 14, '#2a2e36', [0, 0, SZ], { base: true, round: 0.1 }), part(40.2, 0.2, 14.2, '#1b1b1f', [0, SH, SZ], { base: true }));
  st.add(block(40, 0.3, 0.3, neon('#ff3ad0', 2), [0, SH - 0.4, SZ + 7.1]), block(40, 0.3, 0.3, neon('#3af0ff', 2), [0, 0.4, SZ + 7.1]));
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) st.add(part(3, (k + 1) * 1, 1.4, '#3a3f4c', [s * 18.5, 0, SZ + 8.6 - k * 1.2 + 1.2], { base: true }));   // steps
  // LED screen backdrop
  const scr = textPlane(o.text || '★ LIVE ★', 24, 9, { bg: '#2a0a4a', color: '#ff7ae8', glow: true }); scr.position.set(0, SH + 6.5, SZ - 6.3); st.add(scr, part(25.2, 10.2, 0.5, '#111116', [0, SH + 6.5, SZ - 6.6], { round: 0.1 }));
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) st.add(block(0.4, 10, 0.4, neon(k % 2 ? '#3af0ff' : '#ff3ad0', 1.8), [s * (14 + k * 1.6), SH, SZ - 6], { base: true }));
  // truss
  const tm = plastic('#9aa2aa', { metal: 0.6, rough: 0.35 });
  for (const s of [-1, 1]) st.add(block(1.2, 20, 1.2, tm, [s * 20, 0, SZ + 6], { base: true }), block(1.2, 20, 1.2, tm, [s * 20, 0, SZ - 6], { base: true }), block(1.2, 1.2, 13, tm, [s * 20, 19.4, SZ]));
  st.add(block(41, 1.2, 1.2, tm, [0, 19.4, SZ + 6]), block(41, 1.2, 1.2, tm, [0, 19.4, SZ - 6]));
  const beamCols = ['#ff3ad0', '#3af0ff', '#f5cd30', '#3af0ff', '#ff3ad0'];
  beamCols.forEach((c, i) => { const x = -14 + i * 7; st.add(cyl(0.6, 0.8, 1.4, '#1b1b1f', [x, 18, SZ + 6], { seg: 10 }), cyl(0.55, 0.55, 0.1, neon(c, 3), [x, 17.25, SZ + 6], { seg: 10 })); const b = new THREE.Mesh(new THREE.ConeGeometry(3.2, 15, 16, 1, true), beamMat(c, 0.1)); b.position.set(x + (i - 2) * -0.8, 17.2 - 7.5 + 0.1, SZ + 4); b.rotation.x = -0.25; b.rotation.z = (i - 2) * 0.1; st.add(b); });
  // speaker stacks
  for (const s of [-1, 1]) { for (let k = 0; k < 3; k++) put(st, 'speaker', s * 24, SZ + 4, s * -10, { y: k * 4.6, s: 1.0 }); put(st, 'speaker', s * 12, SZ + 5.6, 0, { y: SH, s: 0.6 }); }
  put(st, 'micStand', 0, SZ + 4, 0, { y: SH }); put(st, 'drumKit', -9, SZ - 2.5, 15, { y: SH }); put(st, 'speaker', 7, SZ - 3, 0, { y: SH, s: 0.8 });
  // crowd barrier
  for (let x = -18; x <= 18; x += 4) st.add(block(4, 0.25, 0.25, '#9aa2aa', [x, 2.2, -6.5]), block(4, 0.25, 0.25, '#9aa2aa', [x, 0.8, -6.5]), block(0.25, 2.4, 0.25, '#9aa2aa', [x - 2, 0, -6.5], { base: true }));
  st.add(block(0.25, 2.4, 0.25, '#9aa2aa', [20, 0, -6.5], { base: true }));
  for (const [s, c] of [[-1, '#ff3ad0'], [1, '#3af0ff']]) { const sp = new THREE.SpotLight(c, 900, 70, 0.5, 0.6, 1.5); sp.position.set(s * 14, 22, 8); sp.target.position.set(s * -2, SH, SZ + 2); st.scene.add(sp, sp.target); }
  plight(st, '#b07aff', 30, 40, 0, 8, -2);
  return { spots: { stage: [0, SH, -13], mic: [0, SH, -10.6], stageL: [-8, SH, -12], stageR: [8, SH, -12], drums: [-9, SH, -15], crowd: [0, 2], front: [0, -4.5], center: [0, 0] } };
}, { light: 'night', desc: 'concert: raised stage (top y=3, front edge z=-8) with LED screen, neon bars, lighting truss with coloured beams, speaker stacks, drum kit and mic stand; crowd area at the origin behind a barrier at z=-6.5. 3-value spots [x,y,z] are on the stage' });
