// engine/fx3d.js — particle effects that are pure functions of time (deterministic for frame-by-frame rendering).
// makeFx(spec, rt) -> { update(t) }.  spec = { t, type, at: 'max' | 'max.head' | 'max.chest' | [x,y,z], color, count, size, dur, ... }
// Burst types (fire once at spec.t): flash, burst, dust, confetti, sparkle, explosion, smoke, hearts, stars, coins, ring, speed
// Ambient types (run all scene long): rain, snow, embers, motes, fire (needs `at`), bubbles
import { THREE, canvasTex } from './r3d.js';
import { rng, clamp, ease } from './core.js';

const starTex = () => canvasTex(128, 128, (g, w, h) => { const c = w / 2; const gr = g.createRadialGradient(c, c, 0, c, c, c); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? c * 0.18 : c * 0.95; g.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r); } g.fill(); }, { key: 'fxstar' });
const softTex = () => canvasTex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, { key: 'fxsoft' });
const heartTex = () => canvasTex(64, 64, (g) => { g.fillStyle = '#ff3a6a'; g.beginPath(); g.moveTo(32, 56); g.bezierCurveTo(0, 30, 10, 4, 32, 20); g.bezierCurveTo(54, 4, 64, 30, 32, 56); g.fill(); }, { key: 'fxheart' });

const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3();
// instanced cube/sphere particles. each particle: pos(t) = p0 + v*τ + ½gτ², spin, scale over life
function particles(rt, o) {
  const n = o.count, r = rng(o.seed || 7), geo = o.geo || new THREE.BoxGeometry(1, 1, 1);
  const mat = o.mat || new THREE.MeshStandardMaterial({ color: o.color || '#ffd23f', roughness: 0.5, emissive: o.emissive || '#000', emissiveIntensity: o.emissive ? 1.2 : 0, transparent: !!o.fade, opacity: 1 });
  const mesh = new THREE.InstancedMesh(geo, mat, n); mesh.castShadow = !!o.shadow; mesh.frustumCulled = false; rt.stage.scene.add(mesh);
  const P = [...Array(n)].map((_, i) => o.init(r, i));
  if (o.colors) { const c = new THREE.Color(); for (let i = 0; i < n; i++) { c.set(o.colors[i % o.colors.length]); mesh.setColorAt(i, c); } }
  return { mesh, update(t) {
    const base = o.origin(t);
    for (let i = 0; i < n; i++) {
      const p = P[i], tau = t - (o.t0 + (p.delay || 0)), life = p.life;
      if (tau < 0 || tau > life || !base) { _m4.makeScale(0, 0, 0); mesh.setMatrixAt(i, _m4); continue; }
      const k = tau / life, g = o.gravity ?? -18;
      _p.set(base.x + p.v[0] * tau, base.y + p.v[1] * tau + 0.5 * g * tau * tau, base.z + p.v[2] * tau);
      if (o.floor !== false && _p.y < (o.floorY ?? 0.1)) _p.y = o.floorY ?? 0.1;
      const sc = p.size * (o.scaleFn ? o.scaleFn(k) : 1 - k * k);
      _e.set(p.spin[0] * tau, p.spin[1] * tau, p.spin[2] * tau); _q.setFromEuler(_e); _s.set(sc, sc, sc); _m4.compose(_p, _q, _s); mesh.setMatrixAt(i, _m4);
    }
    mesh.instanceMatrix.needsUpdate = true; if (o.fade) mat.opacity = clamp(1 - (t - o.t0) / (o.fadeDur || 1.5));
  } };
}
function sprite(rt, tex, color, additive = true) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, fog: false })); s.visible = false; rt.stage.scene.add(s); return s; }

const AMBIENT = new Set(['rain', 'snow', 'embers', 'motes', 'fire', 'bubbles']);
export function makeFx(spec, rt) {
  const type = spec.type, t0 = spec.t ?? 0, origin = (t) => rt.resolvePoint(spec.at ?? [0, 1, 0], t0 + (spec.follow ? (t - t0) : 0)), col = spec.color;
  const fixed = () => origin(t0);
  switch (type) {
    case 'flash': { const s = sprite(rt, starTex(), col || '#fff6c0'); const d = spec.dur || 0.28, sz = spec.size || 4; return { update(t) { const k = (t - t0) / d; if (k < 0 || k > 1) { s.visible = false; return; } s.visible = true; s.position.copy(fixed()); s.scale.setScalar(sz * (0.4 + ease.out(k))); s.material.opacity = (1 - k) ** 1.5; s.material.rotation = k * 0.6; } }; }
    case 'burst': case 'stars': case 'coins': return particles(rt, { count: spec.count || 14, t0, seed: spec.seed, color: col || (type === 'coins' ? '#ffcf1a' : '#ffffff'), emissive: type === 'coins' ? '#6a4a00' : (col || '#ffffff'), geo: type === 'coins' ? new THREE.CylinderGeometry(0.5, 0.5, 0.12, 12) : undefined, origin: fixed, gravity: type === 'stars' ? -4 : -20,
      init: (r) => { const a = r() * Math.PI * 2, e = r() * 1.2, s = (spec.speed || 7) * (0.5 + r()); return { v: [Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s + 3, Math.sin(a) * Math.cos(e) * s], spin: [r() * 12, r() * 12, r() * 12], size: (spec.size || 0.32) * (0.6 + r() * 0.8), life: 0.5 + r() * 0.5 }; } });
    case 'confetti': return particles(rt, { count: spec.count || 120, t0, seed: spec.seed, colors: ['#ff3a6a', '#ffd23f', '#3af0ff', '#4bd04b', '#9a5aff', '#ff8a2a'], origin: fixed, gravity: -5, geo: new THREE.BoxGeometry(1, 0.08, 0.6),
      init: (r) => { const a = r() * Math.PI * 2, s = (spec.speed || 9) * (0.4 + r()); return { v: [Math.cos(a) * s * 0.6, 6 + r() * 8, Math.sin(a) * s * 0.6], spin: [r() * 15, r() * 15, r() * 15], size: 0.35 + r() * 0.2, life: 2.2 + r() * 1.5, delay: r() * 0.15 }; }, scaleFn: k => (k < 0.85 ? 1 : (1 - k) / 0.15) });
    case 'dust': case 'smoke': { const sm = type === 'smoke'; return particles(rt, { count: spec.count || (sm ? 18 : 12), t0, seed: spec.seed, color: col || (sm ? '#6a6a70' : '#d8cfc0'), geo: new THREE.SphereGeometry(1, 8, 6), origin: fixed, gravity: sm ? 2 : 0, floor: false,
      init: (r) => { const a = r() * Math.PI * 2, s = sm ? 1.2 : 4 * (0.5 + r()); return { v: [Math.cos(a) * s, sm ? 2 + r() * 2 : 0.6 + r(), Math.sin(a) * s], spin: [0, 0, 0], size: (spec.size || (sm ? 1.2 : 0.6)) * (0.6 + r() * 0.6), life: sm ? 1.8 + r() : 0.6 + r() * 0.4, delay: sm ? r() * 0.6 : 0 }; }, scaleFn: k => ease.out(Math.min(1, k * 3)) * (1 - k) * 1.8 }); }
    case 'sparkle': return particles(rt, { count: spec.count || 26, t0, seed: spec.seed, color: col || '#fff6a0', emissive: col || '#fff6a0', geo: new THREE.OctahedronGeometry(1), origin: fixed, gravity: 1, floor: false,
      init: (r) => { const a = r() * Math.PI * 2; return { v: [Math.cos(a) * 2.2 * r(), 1 + r() * 3, Math.sin(a) * 2.2 * r()], spin: [0, r() * 6, 0], size: 0.12 + r() * 0.14, life: 0.8 + r() * 0.8, delay: r() * (spec.dur || 0.8) }; }, scaleFn: k => Math.sin(k * Math.PI) });
    case 'hearts': { const n = spec.count || 8, r = rng(spec.seed || 3), S = [...Array(n)].map(() => ({ s: sprite(rt, heartTex(), '#ffffff', false), dx: (r() - 0.5) * 2.4, d: r() * 0.8, sp: 1.5 + r() })); return { update(t) { const o = fixed(); for (const h of S) { const k = (t - t0 - h.d) / 1.6; if (k < 0 || k > 1) { h.s.visible = false; continue; } h.s.visible = true; h.s.position.set(o.x + h.dx + Math.sin(k * 8) * 0.2, o.y + k * 3 * h.sp, o.z); h.s.scale.setScalar(0.7 * Math.sin(Math.min(1, k * 3) * Math.PI / 2)); h.s.material.opacity = 1 - k * k; } } }; }
    case 'explosion': { const fl = makeFx({ ...spec, type: 'flash', size: (spec.size || 1) * 12, dur: 0.45, color: '#ffb347' }, rt), fire = particles(rt, { count: 30, t0, seed: spec.seed, color: '#ff7a1a', emissive: '#ff5a10', geo: new THREE.SphereGeometry(1, 10, 8), origin: fixed, gravity: 2, floor: false,
      init: (r) => { const a = r() * Math.PI * 2, e = r() * 1.4, s = 7 * (0.3 + r()) * (spec.size || 1); return { v: [Math.cos(a) * Math.cos(e) * s, Math.sin(e) * s, Math.sin(a) * Math.cos(e) * s], spin: [0, 0, 0], size: (1 + r() * 1.3) * (spec.size || 1), life: 0.5 + r() * 0.4 }; }, scaleFn: k => Math.sin(Math.min(1, k * 4) * Math.PI / 2) * (1 - k) * 1.4 }),
      smoke = makeFx({ ...spec, type: 'smoke', t: t0 + 0.2, count: 22, size: 2.2 * (spec.size || 1) }, rt), deb = makeFx({ ...spec, type: 'burst', color: '#3a3a3a', count: 16, speed: 14 }, rt); return { update(t) { fl.update(t); fire.update(t); smoke.update(t); deb.update(t); } }; }
    case 'ring': { const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 6, 40), new THREE.MeshBasicMaterial({ color: col || '#ffffff', transparent: true, fog: false })); m.rotation.x = Math.PI / 2; m.visible = false; rt.stage.scene.add(m); const d = spec.dur || 0.5; return { update(t) { const k = (t - t0) / d; if (k < 0 || k > 1) { m.visible = false; return; } m.visible = true; m.position.copy(fixed()); m.scale.setScalar(0.3 + ease.out(k) * (spec.size || 4)); m.material.opacity = 1 - k; } }; }
    // ---------- ambient ----------
    case 'rain': case 'snow': case 'embers': case 'motes': case 'bubbles': {
      const n = spec.count || { rain: 1400, snow: 900, embers: 160, motes: 200, bubbles: 120 }[type], r = rng(spec.seed || 5), box = spec.box || [70, 40, 70];
      const geo = type === 'rain' ? new THREE.BoxGeometry(0.03, 0.9, 0.03) : type === 'snow' ? new THREE.SphereGeometry(0.09, 5, 4) : new THREE.SphereGeometry(0.06, 5, 4);
      const mat = new THREE.MeshBasicMaterial({ color: col || { rain: '#a8c8ff', snow: '#ffffff', embers: '#ffae4a', motes: '#fff6d8', bubbles: '#bfefff' }[type], transparent: true, opacity: type === 'rain' ? 0.45 : 0.85, fog: true });
      const mesh = new THREE.InstancedMesh(geo, mat, n); mesh.frustumCulled = false; rt.stage.scene.add(mesh);
      const P = [...Array(n)].map(() => [r() * box[0] - box[0] / 2, r() * box[1], r() * box[2] - box[2] / 2, r()]);
      const sp = { rain: -32, snow: -2.2, embers: 1.6, motes: 0.25, bubbles: 1.2 }[type];
      return { update(t) { const c = rt.camFocus || new THREE.Vector3(); for (let i = 0; i < n; i++) { const [x, y, z, ph] = P[i]; let yy = ((y + sp * t) % box[1] + box[1]) % box[1]; const wob = type === 'rain' ? 0 : Math.sin(t * 1.3 + ph * 20) * 0.5; _p.set(c.x + x + wob, yy, c.z + z + (type === 'snow' ? Math.cos(t + ph * 9) * 0.4 : 0)); _m4.makeTranslation(_p.x, _p.y, _p.z); mesh.setMatrixAt(i, _m4); } mesh.instanceMatrix.needsUpdate = true; } };
    }
    case 'fire': return loopFire(spec, rt);
    default: console.log(`ERROR unknown fx type "${type}"`); return { update() {} };
  }
}
// fire needs looping emitters: re-emit each particle on a period
function loopFire(spec, rt) {
  const n = spec.count || 40, r = rng(spec.seed || 9), mesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1), new THREE.MeshStandardMaterial({ color: '#ff8a1a', emissive: '#ff5a10', emissiveIntensity: 1.6 }), n); mesh.frustumCulled = false; rt.stage.scene.add(mesh);
  const P = [...Array(n)].map(() => ({ ph: r(), per: 0.7 + r() * 0.5, v: [(r() - 0.5) * 0.9, 2 + r() * 1.8, (r() - 0.5) * 0.9], sz: (spec.size || 0.35) * (0.6 + r()) }));
  return { update(t) { const o = rt.resolvePoint(spec.at, t); for (let i = 0; i < n; i++) { const p = P[i], k = ((t / p.per + p.ph) % 1); _p.set(o.x + p.v[0] * k, o.y + p.v[1] * k, o.z + p.v[2] * k); const s = p.sz * Math.sin(k * Math.PI) * (1 - k * 0.5); _e.set(k * 3, k * 2, 0); _q.setFromEuler(_e); _s.set(s, s, s); _m4.compose(_p, _q, _s); mesh.setMatrixAt(i, _m4); } mesh.instanceMatrix.needsUpdate = true; } };
}
export const isAmbient = (type) => AMBIENT.has(type);
