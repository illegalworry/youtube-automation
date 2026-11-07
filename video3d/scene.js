// Real 3D scene (three.js): glossy black-head hoodie characters, low-poly rooms, warm key light + soft shadows, depth of field, 2D infographic overlay.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const q = new URLSearchParams(location.search), W = +q.get('w') || 1920, H = +q.get('h') || 1080, SC = W / 1920;
const glc = document.getElementById('gl'), uic = document.getElementById('ui');
for (const c of [glc, uic]) { c.width = W; c.height = H; c.style.width = W + 'px'; c.style.height = H + 'px'; }
const ui = uic.getContext('2d');
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.95;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k, sm = (k) => { k = clamp(k); return k * k * (3 - 2 * k); };
const spring = (t, t0, f = 9, d = 5) => { const x = t - t0; return x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(f * x); };
const C = (h) => new THREE.Color(h);
const grad = new THREE.DataTexture(new Uint8Array([85, 165, 255]), 3, 1, THREE.RedFormat); grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
const std = (c, o = {}) => new THREE.MeshToonMaterial({ color: C(c), gradientMap: grad, map: o.map || null });
const INK = '#0e1426'; const HULLS = [];
function addOutline(root, px = 3.2) { if (q.has('noout')) return;   // inverted-hull ink outline, constant screen-space width
  const list = []; root.traverse(m => { if (m.isMesh && !m.userData.noOutline && !m.material.isMeshBasicMaterial && !(m.geometry.type === 'PlaneGeometry')) list.push(m); });
  for (const m of list) {
    const g = m.geometry.clone(); g.deleteAttribute('normal'); g.deleteAttribute('uv'); const mg = mergeVertices(g, 1e-4); mg.computeVertexNormals();
    const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { px: { value: px * SC }, res: { value: new THREE.Vector2(W, H) }, col: { value: C(INK) } },
      vertexShader: `uniform float px; uniform vec2 res; void main(){ vec4 c = projectionMatrix*modelViewMatrix*vec4(position,1.0); vec3 n = normalize(normalMatrix*normal); vec2 nc = normalize((projectionMatrix*vec4(n,0.0)).xy + 1e-6); c.xy += nc * px * c.w * 2.0 / res; gl_Position = c; }`,
      fragmentShader: `uniform vec3 col; void main(){ gl_FragColor = vec4(col,1.0); }` });
    const h = new THREE.Mesh(mg, mat); h.userData.noOutline = true; h.castShadow = false; h.receiveShadow = false; h.userData.hull = true; HULLS.push(h); m.add(h);
  }
}
const mesh = (geo, m, x = 0, y = 0, z = 0, shadow = true) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = shadow; o.receiveShadow = true; return o; };
const box = (w, h, d, m, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);

const scene = new THREE.Scene(); scene.background = C('#f3c9a0');
const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 80);

// ---------- lights ----------
const key = new THREE.DirectionalLight(C('#ffd9a8'), 2.3); key.position.set(5, 7, 5); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 }); key.shadow.bias = -0.0004; key.shadow.radius = 5;
scene.add(key, key.target);
const rimL = new THREE.DirectionalLight(C('#ffeccc'), 1.7); rimL.position.set(-4, 4, -6); scene.add(rimL);
const fill = new THREE.HemisphereLight(C('#dfe8ff'), C('#f0b080'), 0.9); scene.add(fill);

// ---------- rooms ----------
function checker(a = '#e8803a', b = '#f8ead2', n = 8) { const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'), s = 512 / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? a : b; g.fillRect(i * s, j * s, s, s); } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function plant(x, z, s = 1) { const g = new THREE.Group(); g.add(mesh(new THREE.CylinderGeometry(0.22 * s, 0.17 * s, 0.34 * s, 10), std('#d9783c'), 0, 0.17 * s, 0)); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; const l = mesh(new THREE.ConeGeometry(0.1 * s, 0.7 * s, 5), std(i % 2 ? '#5fa35a' : '#7bbf62'), Math.cos(a) * 0.12 * s, 0.65 * s, Math.sin(a) * 0.12 * s); l.rotation.z = Math.cos(a) * 0.45; l.rotation.x = -Math.sin(a) * 0.45; g.add(l); } g.position.set(x, 0, z); return g; }
function windowPane(x, y, z, w, h) { const g = new THREE.Group(); g.add(box(w + 0.2, h + 0.2, 0.12, std('#f6ead6'), 0, 0, 0)); const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: C('#bfe3ff') })); glass.position.z = 0.07; g.add(glass); g.add(box(0.06, h, 0.05, std('#f6ead6'), 0, 0, 0.09)); g.add(box(w, 0.06, 0.05, std('#f6ead6'), 0, 0, 0.09)); g.position.set(x, y, z); return g; }

const boardCanvas = document.createElement('canvas'); boardCanvas.width = 1024; boardCanvas.height = 576; const boardTex = new THREE.CanvasTexture(boardCanvas); boardTex.colorSpace = THREE.SRGBColorSpace;
function drawBoard(mode, k = 0) {
  const g = boardCanvas.getContext('2d'), w = 1024, h = 576; g.fillStyle = '#f7f3ea'; g.fillRect(0, 0, w, h);
  if (mode === 'slide') {
    g.fillStyle = '#c9574f'; g.fillRect(0, 0, w, 120); g.fillStyle = '#fff'; g.font = '700 54px "Liberation Sans",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('МОЯ ГЕНИАЛЬНАЯ', w / 2, 62);
    g.fillStyle = '#2a2630'; g.font = '800 92px "Liberation Sans",sans-serif'; g.fillText('ПРЕЗЕНТАЦИЯ', w / 2, 240);
    ['#69b39e', '#e0b050', '#c9574f', '#4a6ab8'].forEach((c, i) => { const bh = 60 + i * 50; g.fillStyle = c; g.fillRect(140 + i * 190, 540 - bh, 120, bh); });
  } else if (mode === 'switch') {
    const on = k < 0.5; g.fillStyle = '#2a2630'; g.font = '800 120px "Liberation Sans",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ЛОЖЬ', w / 2, 120);
    g.fillStyle = on ? '#69b39e' : '#9aa0a8'; g.beginPath(); g.roundRect(w / 2 - 190, 220, 380, 190, 95); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2 + lerp(95, -95, sm(k)), 315, 78, 0, 7); g.fill();
    g.fillStyle = on ? '#3f8a74' : '#c9574f'; g.font = '800 80px "Liberation Sans",sans-serif'; g.fillText(on ? 'ВКЛ' : 'ВЫКЛ', w / 2, 500);
  }
  boardTex.needsUpdate = true;
}
function buildOffice() {
  const G = new THREE.Group(), floorTex = checker(); floorTex.repeat.set(12, 12);
  const floor = mesh(new THREE.PlaneGeometry(26, 26), std('#ffffff', { map: floorTex, roughness: 0.55 }), 0, 0, 3, false); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; G.add(floor);
  G.add(box(26, 9, 0.2, std('#eea66f'), 0, 4.5, -3.3)); G.add(box(0.2, 9, 14, std('#e6996a'), -9, 4.5, 3)); G.add(box(26, 0.28, 0.12, std('#f8ead2'), 0, 0.14, -3.18));
  for (const [x0, x1] of [[-8, -3.4], [4.4, 8.5]]) { const w = x1 - x0, cx = (x0 + x1) / 2; G.add(box(w, 0.95, 0.75, std('#3f5f93'), cx, 0.475, -2.8)); G.add(box(w + 0.1, 0.07, 0.82, std('#f6ead6'), cx, 0.98, -2.78)); for (let i = 0; i < Math.floor(w / 1.15); i++) G.add(box(0.04, 0.8, 0.02, std('#2c4772'), x0 + 0.6 + i * 1.15, 0.5, -2.41)); }
  G.add(windowPane(6.1, 2.6, -3.15, 2.2, 1.7));
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.025), new THREE.MeshBasicMaterial({ map: boardTex })); bd.position.set(0.3, 2.35, -3.12); G.add(bd); G.add(box(3.78, 2.2, 0.08, std('#8e949c'), 0.3, 2.35, -3.18));
  const clock = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24), std('#f6ead6'), -2.6, 3.2, -3.1); clock.rotation.x = Math.PI / 2; G.add(clock); G.add(box(0.02, 0.18, 0.02, std('#222'), -2.6, 3.26, -3.06)); G.add(box(0.12, 0.02, 0.02, std('#222'), -2.55, 3.2, -3.06));
  G.add(plant(-3.1, -2.7, 1.3), plant(8.6, -2.0, 1.1)); return G;
}
function buildBedroom() {
  const G = new THREE.Group(), floorTex = checker('#c98a56', '#d99a64', 6); floorTex.repeat.set(10, 10);
  const floor = mesh(new THREE.PlaneGeometry(26, 26), std('#ffffff', { map: floorTex, roughness: 0.6 }), 0, 0, 3, false); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; G.add(floor);
  G.add(box(26, 9, 0.2, std('#e78f72'), 0, 4.5, -3.3)); G.add(box(0.2, 9, 14, std('#df8466'), -9, 4.5, 3)); G.add(box(26, 0.28, 0.12, std('#f8ead2'), 0, 0.14, -3.18));
  G.add(windowPane(2.6, 2.5, -3.15, 2.0, 1.7));
  G.add(box(3.0, 0.45, 2.1, std('#8a5a3a'), -2.4, 0.3, -1.9)); G.add(box(2.9, 0.3, 2.0, std('#4a6ab8'), -2.4, 0.66, -1.9)); G.add(box(0.8, 0.16, 0.5, std('#f8ead2'), -3.2, 0.9, -2.5)); G.add(box(0.2, 1.1, 2.1, std('#8a5a3a'), -3.95, 0.8, -1.9));
  G.add(box(0.7, 0.7, 0.6, std('#8a5a3a'), -0.2, 0.35, -2.8)); const bulb = mesh(new THREE.SphereGeometry(0.13, 12, 10), new THREE.MeshBasicMaterial({ color: C('#fff0c0') }), -0.2, 1.05, -2.8); G.add(bulb); G.add(box(0.05, 0.25, 0.05, std('#555'), -0.2, 0.82, -2.8));
  G.add(box(0.9, 0.7, 0.05, std('#f6ead6'), 5.0, 2.8, -3.15)); G.add(box(0.7, 0.5, 0.06, std('#c9574f'), 5.0, 2.8, -3.12));
  G.add(plant(4.6, -2.5, 1.3), plant(-6, -2.5, 1.0)); return G;
}
const office = buildOffice(), bedroom = buildBedroom(); addOutline(office, 3.0); addOutline(bedroom, 3.0); scene.add(office, bedroom);

// ---------- characters ----------
const black = new THREE.MeshToonMaterial({ color: C('#05060a'), gradientMap: grad });
const white = new THREE.MeshBasicMaterial({ color: C('#fffdf0') }), cream = new THREE.MeshBasicMaterial({ color: C('#fad29c') });
const R = 0.30; // head radius (head is ~38% narrower than the bell-shaped hoodie, like the reference)
function makeChar(o) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body); const hoodie = std(o.color);
  const dark = std(new THREE.Color(o.color).multiplyScalar(0.62).getStyle()), hemC = std('#161b2c');
  // hoodie = one wide bell-shaped tube, no waist, hem hanging to the hips
  const pts = [[0.001, 0], [0.33, 0], [0.358, 0.05], [0.352, 0.3], [0.315, 0.55], [0.245, 0.72], [0.135, 0.8], [0.001, 0.83]].map(p => new THREE.Vector2(p[0], p[1]));
  const torso = mesh(new THREE.LatheGeometry(pts, 32), hoodie, 0, 0.86, 0); torso.scale.z = 0.76; body.add(torso);
  const hem = mesh(new THREE.CylinderGeometry(0.364, 0.352, 0.075, 32), hemC, 0, 0.893, 0); hem.scale.z = 0.76; body.add(hem);
  const col = mesh(new THREE.TorusGeometry(0.17, 0.075, 10, 28), dark, 0, 1.66, -0.01); col.rotation.x = Math.PI / 2; body.add(col);
  body.add(mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.16, 12), black, 0, 1.74, 0));
  for (const s of [-1, 1]) { const st = mesh(new THREE.BoxGeometry(0.024, 0.3, 0.012), std('#f08a2c'), s * 0.08 - 0.02, 1.43, 0.222); body.add(st); body.add(mesh(new THREE.SphereGeometry(0.027, 10, 8), std('#f08a2c'), s * 0.08 - 0.02, 1.27, 0.225)); }
  // arms = short thick smooth tubes with a soft bend, small black mitten hands
  const arms = {};
  for (const s of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(s * 0.275, 1.56, 0); body.add(sh);
    sh.add(mesh(new THREE.SphereGeometry(0.11, 16, 12), hoodie, 0, 0, 0)); sh.add(mesh(new THREE.CapsuleGeometry(0.098, 0.26, 8, 14), hoodie, 0, -0.22, 0));
    const el = new THREE.Group(); el.position.y = -0.45; sh.add(el); el.add(mesh(new THREE.SphereGeometry(0.098, 14, 10), hoodie, 0, 0, 0)); el.add(mesh(new THREE.CapsuleGeometry(0.09, 0.2, 8, 14), hoodie, 0, -0.2, 0));
    const hand = new THREE.Group(); hand.position.y = -0.43; el.add(hand); hand.add(mesh(new THREE.SphereGeometry(0.105, 16, 12), black, 0, 0, 0));
    arms[s] = { sh, el, hand };
  }
  // legs = very long thin black sticks, tiny white shoes
  const legs = [];
  for (const s of [-1, 1]) { const hip = new THREE.Group(); hip.position.set(s * 0.12, 0.9, 0); root.add(hip); hip.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), black, 0, -0.45, 0)); const shoe = mesh(new THREE.SphereGeometry(0.07, 12, 10), std('#f5f5f0'), 0, -0.9, 0.05); shoe.scale.set(1, 0.6, 1.6); hip.add(shoe); legs.push(hip); }
  root.scale.setScalar(0.78);
  // head
  const head = new THREE.Group(); head.position.set(0, 1.7, 0); body.add(head);
  const hs = mesh(new THREE.SphereGeometry(R, 48, 32), black, 0, 0.32, 0); head.add(hs);
  const crescent = new THREE.Mesh(new THREE.SphereGeometry(R * 1.04, 32, 24), cream); crescent.castShadow = false; crescent.scale.setScalar(0.78); scene.add(crescent);
  const face = new THREE.Group(); face.position.y = 0.32; head.add(face);
  const gtex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,.55)'); r.addColorStop(0.4, 'rgba(255,255,255,.15)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const eyes = [-1, 1].map(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), white); e.scale.set(0.058, 0.04, 0.02); e.userData.noOutline = true; face.add(e); return e; });
  const glows = [-1, 1].map(s => { if (q.has('noglow')) return new THREE.Object3D(); const gm = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.14), new THREE.MeshBasicMaterial({ map: gtex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); gm.userData.noOutline = true; face.add(gm); return gm; });
  const brows = [-1, 1].map(s => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.012, 0.01), white); b.userData.noOutline = true; face.add(b); return b; });
  const mouth = new THREE.Group(); face.add(mouth);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 20, Math.PI), white), ring = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.009, 6, 16), white), line = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.011, 0.01), white);
  mouth.add(arc, ring, line);
  if (o.glasses) for (const s of [-1, 1]) { const gl = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.01, 8, 24), cream); gl.userData.s = s; face.add(gl); o._gl = (o._gl || []).concat(gl); }
  if (o.bun) { const bn = mesh(new THREE.SphereGeometry(0.095, 16, 12), black, 0, 0.56, -0.15); head.add(bn); const bk = new THREE.Mesh(new THREE.SphereGeometry(0.118, 16, 12), cream); bk.position.set(0, 0.63, -0.16); bk.visible = false; }
  const place = (m, dx, dy, off = 0) => { const z = Math.sqrt(Math.max(1e-4, R * R - dx * dx - dy * dy)); m.position.set(dx, dy, z + off); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(dx, dy, z).normalize()); };
  root.traverse(m => { if (m.isMesh) { m.castShadow = true; } }); crescent.castShadow = false;
  addOutline(root, 3.4);
  const hl = new THREE.Mesh(new THREE.RingGeometry(0.235, 0.255, 40, 1, 1.75, 1.35), new THREE.MeshBasicMaterial({ color: C('#ffffff'), side: THREE.DoubleSide })); hl.userData.noOutline = true; hl.scale.setScalar(0.78); if (!q.has('nohl')) scene.add(hl);
  const ch = { root, body, head, arms, legs, crescent, hl, o, drop: null };
  ch.set = (p) => {
    const A = (s, f, sd, e) => { arms[s].sh.rotation.set(-f, 0, s * sd); arms[s].el.rotation.set(-e, 0, 0); };
    A(1, p.af, p.as, p.ae); A(-1, p.bf, p.bs, p.be);
    body.rotation.x = p.lean || 0; head.rotation.set(p.hx || 0, p.hy || 0, p.hz || 0); const br = Math.sin(p.t * 2.2 + (o.seed || 0)) * 0.01; body.scale.y = 1 + br; head.position.y = 1.7 + br * 0.4;
    const ex = p.expr || 'neutral', blink = p.blink ? 0.12 : 1, lx = (p.look?.[0] || 0) * 0.04, ly = (p.look?.[1] || 0) * 0.03;
    const E = { neutral: [1, 0.62, 0, 'line'], calm: [1, 0.55, 0, 'line'], smile: [1, 0.8, 0, 'smile'], sly: [1, 0.42, 0.05, 'smile'], smirk: [1, 0.5, 0.0, 'smile'], worried: [1, 0.85, -0.38, 'frown'], sad: [1, 0.8, -0.45, 'frown'], confused: [1, 0.8, -0.2, 'line'], angry: [1, 0.55, 0.45, 'line'], shocked: [1.25, 1.55, 0, 'o'], scared: [1.1, 1.35, -0.2, 'o'], nervous: [1, 1.0, -0.25, 'frown'] }[ex] || [1, 0.62, 0, 'line'];
    eyes.forEach((e, i) => { const s = i ? 1 : -1; place(e, s * 0.14 + lx, 0.04 + ly, 0.002); e.scale.set(0.057 * E[0], 0.038 * E[1] * blink, 0.02); e.rotateZ(-s * E[2]);
      place(glows[i], s * 0.14 + lx, 0.04 + ly, 0.004); glows[i].scale.set(E[0], E[1] * blink + 0.3, 1);
      place(brows[i], s * 0.14 + lx, 0.04 + ly + 0.038 * E[1] + 0.01, 0.003); brows[i].rotateZ(-s * (E[2] * 0.9 + (ex === 'sly' || ex === 'smirk' ? 0.12 : 0))); brows[i].visible = ex !== 'shocked' && ex !== 'scared' ? true : true; brows[i].position.y += (ex === 'shocked' || ex === 'scared') ? 0.03 : 0; });
    arc.visible = E[3] === 'smile' || E[3] === 'frown'; arc.rotation.z = E[3] === 'smile' ? Math.PI : 0; arc.position.y = E[3] === 'smile' ? 0.02 : -0.04; ring.visible = E[3] === 'o'; line.visible = E[3] === 'line';
    place(mouth, lx * 0.5, -0.1, 0.002); if (o._gl) o._gl.forEach(gl => { place(gl, gl.userData.s * 0.14, 0.04, 0.01); });
  };
  ch.pos = (x, z, ry) => root.position.set(x, 0, z), ch.rot = (ry) => root.rotation.y = ry;
  scene.add(root); return ch;
}
const LYOSHA = makeChar({ color: '#2fb491', seed: 1 }), BOSS = makeChar({ color: '#d4603f', glasses: true, seed: 2 }), RITA = makeChar({ color: '#9a7ac8', bun: true, seed: 3 });
const chars = [LYOSHA, BOSS, RITA];
const POSE = {
  stand: { af: 0.05, as: 0.1, ae: 0.12, bf: 0.05, bs: 0.1, be: 0.12 },
  relaxed: { af: 0.12, as: 0.14, ae: 0.3, bf: 0.1, bs: 0.14, be: 0.3 },
  point: { af: 0.5, as: 1.5, ae: 0.1, bf: 0.05, bs: 0.1, be: 0.2 },
  hip: { af: 0.15, as: 0.75, ae: 1.7, bf: 0.05, bs: 0.1, be: 0.2 },
  head: { af: 1.2, as: 0.55, ae: 2.35, bf: 1.2, bs: 0.55, be: 2.35 },
  shrug: { af: 0.3, as: 0.7, ae: 1.0, bf: 0.3, bs: 0.7, be: 1.0 },
  hold: { af: 0.7, as: 0.15, ae: 1.5, bf: 0.7, bs: 0.15, be: 1.5 },
};
const KS = Object.keys(POSE.stand);
const poseAt = (lt, keys) => { let a = keys[0], b = keys[keys.length - 1]; for (let i = 0; i < keys.length - 1; i++) if (lt >= keys[i][0] && lt <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; } const k = lt <= keys[0][0] ? 0 : lt >= b[0] ? 1 : sm((lt - a[0]) / (b[0] - a[0])); const out = {}; for (const kk of KS) out[kk] = lerp(POSE[a[1]][kk], POSE[b[1]][kk], k); return out; };
const blinkOf = (t, per, seed = 0) => ((t + seed) % per) > per - 0.12;
const folder = box(0.34, 0.03, 0.26, std('#4a6ab8'), 0, 0, 0.1); RITA.arms[1].hand.add(folder); folder.visible = false;
const sweat = mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: C('#9ad3ef') }), 0, 0, 0, false); sweat.scale.y = 1.5; scene.add(sweat); sweat.visible = false;

// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt); composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
const bokeh = new BokehPass(scene, camera, { focus: 6, aperture: 0.004, maxblur: 0.012 }); composer.addPass(bokeh); bokeh.enabled = !q.has('nodof'); { const orig = bokeh.render.bind(bokeh); bokeh.render = (...a) => { HULLS.forEach(h => h.visible = false); orig(...a); HULLS.forEach(h => h.visible = true); }; } composer.addPass(new OutputPass());

// ---------- overlay helpers ----------
const proj = (v3) => { const v = v3.clone().project(camera); return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H]; };
const headWorld = (ch) => { const v = new THREE.Vector3(); ch.head.localToWorld(v.set(0, 0.32, 0)); return v; };
function bubble(str, x, y, lt, t0, o = {}) {
  const k = spring(lt, t0, 11, 6); if (k <= 0 || (o.end && lt > o.end)) return;
  const size = (o.size || 42) * SC; ui.save(); ui.translate(x, y); ui.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); ui.globalAlpha = clamp((lt - t0) / 0.1);
  ui.font = `800 ${size}px "Liberation Sans",sans-serif`; const w = ui.measureText(str).width + 60 * SC, h = size * 1.9;
  ui.fillStyle = '#fbf8f0'; ui.strokeStyle = 'rgba(0,0,0,.18)'; ui.lineWidth = 3 * SC; ui.beginPath(); ui.roundRect(-w / 2, -h / 2, w, h, h / 2); ui.fill(); ui.stroke();
  ui.beginPath(); ui.moveTo(-w * 0.2, h / 2 - 2); ui.lineTo(-w * 0.32, h / 2 + 40 * SC); ui.lineTo(-w * 0.05, h / 2 - 2); ui.fill();
  ui.fillStyle = '#2a2630'; ui.textAlign = 'center'; ui.textBaseline = 'middle'; ui.fillText(str, 0, 3 * SC); ui.restore();
}
function slam(str, x, y, lt, t0, o = {}) {
  if (lt < t0) return; const size = (o.size || 120) * SC; ui.save(); ui.font = `800 ${size}px "Liberation Sans",sans-serif`; ui.textBaseline = 'middle'; ui.textAlign = 'left';
  const ws = [...str].map(c => ui.measureText(c).width + 6 * SC), tw = ws.reduce((a, b) => a + b, 0); let cx = x - tw / 2;
  [...str].forEach((c, i) => { const k = clamp((lt - t0 - i * 0.03) / 0.22), s = lerp(1.7, 1, sm(k)), a = clamp(k * 3); ui.save(); ui.globalAlpha = a; ui.translate(cx + ws[i] / 2, y); ui.scale(s, s); ui.textAlign = 'center'; ui.lineWidth = 12 * SC; ui.strokeStyle = 'rgba(30,20,40,.75)'; ui.lineJoin = 'round'; ui.strokeText(c, 0, 0); ui.fillStyle = o.color || '#fff'; ui.fillText(c, 0, 0); ui.restore(); cx += ws[i]; });
  ui.restore();
}
function vignette() { const g = ui.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95); g.addColorStop(0, 'rgba(20,10,30,0)'); g.addColorStop(1, 'rgba(20,10,30,.38)'); ui.fillStyle = g; ui.fillRect(0, 0, W, H); }

// ---------- infographic card (dark space with grid, like the reference) ----------
function card(lt, strike) {
  ui.save(); ui.scale(SC, SC); const w = 1920, h = 1080;
  let g = ui.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0a1020'); g.addColorStop(1, '#16223f'); ui.fillStyle = g; ui.fillRect(0, 0, w, h);
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 160; i++) { ui.fillStyle = `rgba(190,205,255,${0.15 + rnd() * 0.5})`; ui.fillRect(rnd() * w, rnd() * h * 0.8, 1.5 + rnd() * 1.5, 1.5 + rnd() * 1.5); }
  ui.strokeStyle = 'rgba(110,140,200,.16)'; ui.lineWidth = 1.5; for (let i = -12; i <= 12; i++) { ui.beginPath(); ui.moveTo(w / 2 + i * 40, 780); ui.lineTo(w / 2 + i * 260, h); ui.stroke(); } for (let j = 0; j < 8; j++) { const y = 780 + (j * j) * 5 + j * 6; ui.beginPath(); ui.moveTo(0, y); ui.lineTo(w, y); ui.stroke(); }
  const a1 = clamp(lt / 0.3); ui.globalAlpha = a1; ui.textAlign = 'left'; ui.textBaseline = 'alphabetic';
  ui.font = '700 24px "Liberation Sans",sans-serif'; ui.fillStyle = '#8ea0c8'; if ('letterSpacing' in ui) ui.letterSpacing = '6px'; ui.fillText('НАШЕ «ЧТО, ЕСЛИ»', 110, 170);
  ui.font = '800 132px "Liberation Sans",sans-serif'; if ('letterSpacing' in ui) ui.letterSpacing = '3px'; g = ui.createLinearGradient(0, 200, 0, 300); g.addColorStop(0, '#fff'); g.addColorStop(1, '#b6c4dc'); ui.shadowColor = 'rgba(160,200,255,.85)'; ui.shadowBlur = 38; ui.fillStyle = g; ui.fillText('ВРЕМЯ', 104, 300); ui.shadowBlur = 0;
  ui.font = '800 104px "Liberation Sans",sans-serif'; ui.shadowColor = 'rgba(47,180,145,.9)'; ui.shadowBlur = 34; ui.fillStyle = '#2fb491'; ui.fillText('РЕАКЦИИ', 108, 408); ui.shadowBlur = 0;
  if ('letterSpacing' in ui) ui.letterSpacing = '0px';
  // mini hero (flat, like the reference card)
  const hx = 250, hy = 780; ui.fillStyle = 'rgba(0,0,0,.35)'; ui.beginPath(); ui.ellipse(hx, hy + 150, 60, 12, 0, 0, 7); ui.fill();
  ui.fillStyle = '#2fb491'; ui.beginPath(); ui.moveTo(hx - 52, hy + 40); ui.lineTo(hx + 52, hy + 40); ui.lineTo(hx + 62, hy + 140); ui.lineTo(hx - 62, hy + 140); ui.closePath(); ui.fill();
  ui.fillStyle = '#05060a'; ui.beginPath(); ui.arc(hx, hy, 46, 0, 7); ui.fill(); ui.strokeStyle = '#fad29c'; ui.lineWidth = 3; ui.beginPath(); ui.arc(hx, hy, 48, 3.5, 4.9); ui.stroke(); ui.fillStyle = '#fff'; for (const dx of [-17, 17]) { ui.beginPath(); ui.ellipse(hx + dx, hy + 4, 9, 6, 0, 0, 7); ui.fill(); }
  // panel
  const p = sm((lt - 0.1) / 0.4); ui.globalAlpha = p; { const pg = ui.createLinearGradient(0, 540, 0, 900); pg.addColorStop(0, 'rgba(40,58,104,.92)'); pg.addColorStop(1, 'rgba(16,26,54,.92)'); ui.fillStyle = pg; ui.strokeStyle = 'rgba(150,185,240,.4)'; ui.lineWidth = 2.5; ui.shadowColor = 'rgba(0,0,0,.5)'; ui.shadowBlur = 30; ui.beginPath(); ui.roundRect(470, 540, 1330, 360, 26); ui.fill(); ui.shadowBlur = 0; ui.stroke(); }
  const x0 = 560, x1 = 1700, yA = 790; ui.strokeStyle = 'rgba(160,185,230,.55)'; ui.lineWidth = 3; ui.beginPath(); ui.moveTo(x0, yA); ui.lineTo(x1, yA); ui.stroke();
  ui.font = '600 22px "Liberation Sans",sans-serif'; ui.fillStyle = '#8ea0c8'; ui.textAlign = 'center'; for (let i = 0; i <= 6; i++) { const x = lerp(x0, x1, i / 6); ui.beginPath(); ui.moveTo(x, yA); ui.lineTo(x, yA + 12); ui.stroke(); ui.fillText((i / 10).toFixed(1).replace('.', ',') + ' с', x, yA + 42); }
  const mk = (val, label, col, t0, dead) => { const x = lerp(x0, x1, val / 0.6), k = sm((lt - t0) / 0.5), hh = 150 * k; ui.globalAlpha = p * clamp(k * 2); ui.fillStyle = dead ? '#6b7388' : col; ui.fillRect(x - 6, yA - hh, 12, hh); ui.font = '800 46px "Liberation Sans",sans-serif'; ui.textAlign = 'center'; ui.fillText(label, x, yA - hh - 36); ui.font = '700 36px "DejaVu Sans Mono",monospace'; ui.fillStyle = '#fff'; ui.fillText(val.toFixed(1).replace('.', ',') + ' с', x, yA + 90); { const chip = val < 0.3 ? 'РЕФЛЕКС' : 'РАСЧЁТ', cw = 170; ui.fillStyle = dead ? '#6b7388' : (val < 0.3 ? '#cfeee5' : '#f4c27a'); ui.beginPath(); ui.roundRect(x - cw / 2, yA + 105, cw, 40, 20); ui.fill(); ui.fillStyle = '#10182e'; ui.font = '800 22px "Liberation Sans",sans-serif'; ui.fillText(chip, x, yA + 133); } if (dead) { ui.strokeStyle = '#e0674f'; ui.lineWidth = 8; ui.beginPath(); ui.moveTo(x - 110, yA - hh - 40); ui.lineTo(x + 110, yA - hh - 32); ui.stroke(); } };
  mk(0.1, 'ПРАВДА', '#2fb491', 0.5, false); mk(0.5, 'ЛОЖЬ', '#e8a24c', 1.3, strike);
  const k5 = sm((lt - 2.0) / 0.4); if (k5 > 0 && !strike) { ui.globalAlpha = k5; ui.fillStyle = '#e8c04a'; ui.beginPath(); ui.roundRect(1100, 600, 150, 70, 35); ui.fill(); ui.fillStyle = '#241c10'; ui.font = '800 44px "Liberation Sans",sans-serif'; ui.textAlign = 'center'; ui.fillText('×5', 1175, 650); }
  ui.restore();
}

// ---------- camera ----------
function kc(lt, keys) { let a = keys[0], b = keys[keys.length - 1]; for (let i = 0; i < keys.length - 1; i++) if (lt >= keys[i][0] && lt <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; } const k = lt <= a[0] ? 0 : lt >= b[0] ? 1 : sm((lt - a[0]) / (b[0] - a[0])); const L = (i) => a[i].map((v, j) => lerp(v, b[i][j], k)); return { pos: L(1), look: L(2), fov: lerp(a[3], b[3], k) }; }
function applyCam(c, lt, ap = 0.0004, mb = 0.012) { const d = Math.sin(lt * 1.3) * 0.015; camera.position.set(c.pos[0] + d, c.pos[1] + d * 0.5, c.pos[2]); camera.lookAt(c.look[0], c.look[1], c.look[2]); camera.fov = c.fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld(); bokeh.uniforms.focus.value = camera.position.distanceTo(new THREE.Vector3(...c.look)); bokeh.uniforms.aperture.value = q.has('ap') ? +q.get('ap') : ap; bokeh.uniforms.maxblur.value = mb; }

// ---------- shots ----------
const SH = [['s001', 0, 2.5], ['s002', 2.5, 3.65], ['s003', 3.65, 6.1], ['s004', 6.1, 8.75], ['s005', 8.75, 11.8], ['s006', 11.8, 14.6], ['s007', 14.6, 16.4], ['s008', 16.4, 19.4], ['s009', 19.4, 22.96]];
const hide = () => { chars.forEach(c => c.root.visible = false); chars.forEach(c => { c.crescent.visible = false; c.hl.visible = false; }); folder.visible = false; sweat.visible = false; };
const show = (...cs) => cs.forEach(c => { c.root.visible = true; c.crescent.visible = true; c.hl.visible = true; });
const DUR = 22.96;
function drawFrame(T) {
  const sh = SH.find(s => T >= s[1] && T < s[2]) || SH[SH.length - 1], id = sh[0], lt = T - sh[1], dur = sh[2] - sh[1];
  ui.clearRect(0, 0, W, H); hide();
  const isCard = id === 's006' || id === 's007'; glc.style.visibility = isCard ? 'hidden' : 'visible';
  const bed = id === 's003' || id === 's004'; office.visible = !bed; bedroom.visible = bed;
  scene.background = C(bed ? '#e9a27c' : '#f0b383');
  if (isCard) { card(id === 's006' ? lt : lt + 3.5, id === 's007'); if (id === 's007') slam('ВЫКЛЮЧЕНО', W / 2, 1010 * SC, lt, 0.65, { size: 96, color: '#f0765a' }); }
  else {
    let cam, ap = 0.0004, mb = 0.012; const P = (ch, pos, ry, keys, extra = {}) => { ch.root.position.set(pos[0], 0, pos[1]); ch.root.rotation.y = ry; ch.set({ ...poseAt(lt, keys), t: T, ...extra }); };
    if (id === 's001') {
      show(BOSS, LYOSHA); P(BOSS, [-1.7, -0.7], 0.7, [[0, 'stand'], [0.6, 'point'], [2.5, 'point']], { expr: 'smile', look: [1, 0], blink: blinkOf(T, 3.3) }); P(LYOSHA, [1.7, -0.5], -0.7, [[0, 'relaxed'], [2.5, 'relaxed']], { expr: lt > 1.9 ? 'worried' : 'neutral', look: [-1, 0], blink: blinkOf(T, 2.8, 1) });
      drawBoard('slide'); cam = kc(lt, [[0, [0.3, 1.55, 6.6], [0, 1.3, -0.6], 34], [dur, [0.1, 1.5, 5.0], [0, 1.3, -0.6], 34]]);
    } else if (id === 's002') {
      show(BOSS); P(BOSS, [-1.2, -0.4], 0.25, [[0, 'point'], [dur, 'hip']], { expr: lt > 0.5 ? 'sly' : 'smile', look: [0.6, 0], blink: blinkOf(T, 3.3) }); drawBoard('slide'); ap = 0.0011; mb = 0.012;
      cam = kc(lt, [[0, [-0.2, 1.6, 1.9], [-1.2, 1.55, -0.4], 30], [dur, [-0.35, 1.6, 1.6], [-1.2, 1.55, -0.4], 30]]);
    } else if (id === 's003') {
      show(LYOSHA); const hit = 1.0; P(LYOSHA, [0.3, -0.5], -0.15, [[0, 'stand'], [hit, 'stand'], [hit + 0.35, 'head'], [dur, 'head']], { expr: lt > hit ? 'scared' : 'neutral', look: [0.3, 0], blink: blinkOf(T, 3.0, 2), hx: lt > hit ? Math.sin(lt * 40) * 0.03 : 0 });
      cam = kc(lt, [[0, [0.3, 1.45, 5.4], [0.3, 1.2, -0.5], 34], [dur, [0.3, 1.45, 4.0], [0.3, 1.3, -0.5], 34]]);
    } else if (id === 's004') {
      show(LYOSHA); P(LYOSHA, [0.3, -0.5], -0.12, [[0, 'relaxed'], [dur, 'relaxed']], { expr: lt < 1.5 ? 'smile' : lt < 1.9 ? 'confused' : 'sad', look: [0.35, 0], blink: blinkOf(T, 2.7, 5) }); ap = 0.0011; mb = 0.012;
      cam = kc(lt, [[0, [0.65, 1.6, 1.9], [0.3, 1.55, -0.5], 30], [dur, [0.55, 1.58, 1.65], [0.3, 1.55, -0.5], 30]]);
    } else if (id === 's005') {
      show(LYOSHA); P(LYOSHA, [1.9, -0.4], -0.95, [[0, 'relaxed'], [1.0, 'relaxed'], [1.4, 'shrug'], [dur, 'shrug']], { expr: lt > 1.0 ? 'calm' : 'worried', look: [-1, -0.2], blink: blinkOf(T, 2.8, 3) });
      drawBoard('switch', clamp((lt - 0.9) / 0.35)); cam = kc(lt, [[0, [0.6, 1.65, 5.2], [0.4, 1.7, -1], 32], [dur, [1.0, 1.6, 4.0], [0.6, 1.7, -1], 32]]);
    } else if (id === 's008') {
      show(RITA, LYOSHA); folder.visible = true; P(RITA, [-1.4, -0.3], 0.65, [[0, 'hold'], [0.8, 'hold'], [1.2, 'shrug']], { expr: 'smile', look: [0.7, 0], blink: blinkOf(T, 3.4, 3) }); P(LYOSHA, [1.5, -0.2], -0.65, [[0, 'relaxed'], [dur, 'relaxed']], { expr: lt > 1.6 ? 'nervous' : 'neutral', look: [-1, 0], blink: blinkOf(T, 2.8, 4) });
      drawBoard('slide', 0); const g2 = boardCanvas.getContext('2d'); g2.fillStyle = '#f7f3ea'; g2.fillRect(0, 0, 1024, 576); boardTex.needsUpdate = true;
      cam = kc(lt, [[0, [0.0, 1.45, 5.0], [0, 1.3, -0.2], 34], [dur, [0.1, 1.4, 4.0], [0, 1.3, -0.2], 34]]);
    } else { // s009
      show(LYOSHA); P(LYOSHA, [0.2, -0.2], 0, [[0, 'relaxed'], [dur, 'stand']], { expr: lt < 1.2 ? 'nervous' : 'shocked', look: [0, 0], blink: false, hx: Math.sin(lt * 31) * 0.012 * (lt < 1.2 ? 1 : 0) }); ap = 0.0011; mb = 0.012;
      cam = kc(lt, [[0, [0.2, 1.55, 3.6], [0.2, 1.52, -0.2], 32], [2.2, [0.2, 1.55, 2.5], [0.2, 1.52, -0.2], 32], [dur, [0.2, 1.55, 2.0], [0.2, 1.52, -0.2], 32]]);
      sweat.visible = lt > 0.5; if (sweat.visible) { const h = headWorld(LYOSHA); sweat.position.set(h.x + 0.3, h.y + 0.12 - clamp((lt - 0.5) / 1.5) * 0.25, h.z + 0.2); }
    }
    applyCam(cam, lt, ap, mb);
    chars.forEach(c => { if (!c.root.visible) return; const h = headWorld(c); const f = new THREE.Vector3().subVectors(camera.position, h).normalize(), r = new THREE.Vector3().crossVectors(camera.up, f).normalize().multiplyScalar(-1), u = new THREE.Vector3().crossVectors(f, r.clone().multiplyScalar(-1)).normalize(); const n = u.clone(); c.crescent.position.copy(h).addScaledVector(r, 0.02).addScaledVector(u, 0.018).addScaledVector(f, -0.04); c.hl.position.copy(h).addScaledVector(f, 0.133); c.hl.quaternion.copy(camera.quaternion); });
    composer.render();
    // overlays on top of the 3D picture
    const hw = (c) => proj(headWorld(c).add(new THREE.Vector3(0.45, 0.5, 0)));
    if (id === 's002') bubble('?', W * 0.76, H * 0.24, lt, 0.35, { size: 80 });
    if (id === 's003') slam('НОРМАЛЬНО', W / 2 + Math.sin(lt * 50) * (lt > 1 && lt < 1.5 ? 6 : 0), 170 * SC, lt, 0.95, { size: 120 });
    if (id === 's004') { const p = [W * 0.74, H * 0.2]; bubble('ВСЁ ОТЛИЧНО!', ...p, lt, 0.25, { size: 38, end: 1.45 }); bubble('Я НЕ СПАЛ…', ...p, lt, 1.75, { size: 38 }); }
    if (id === 's008') bubble('ТЫ ВЕДЬ НЕ ЗЛИШЬСЯ?', ...proj(headWorld(RITA).add(new THREE.Vector3(0.2, 0.85, 0))), lt, 0.9, { size: 34 });
    vignette();
  }
  // transitions: dip-in on the time skip, flash into the cliffhanger, global fades
  let fade = 0; if (id === 's003') fade = Math.max(fade, 1 - lt / 0.3); if (T < 0.5) fade = Math.max(fade, 1 - T / 0.5); if (T > DUR - 0.8) fade = Math.max(fade, (T - (DUR - 0.8)) / 0.8);
  if (fade > 0) { ui.fillStyle = `rgba(8,6,14,${clamp(fade)})`; ui.fillRect(0, 0, W, H); }
  if (id === 's009' && lt < 0.2) { ui.fillStyle = `rgba(255,255,255,${1 - lt / 0.2})`; ui.fillRect(0, 0, W, H); }
  if (id === 's006' && lt < 0.25) { ui.fillStyle = `rgba(255,255,255,${(1 - lt / 0.25) * 0.8})`; ui.fillRect(0, 0, W, H); }
}
window.drawFrame = drawFrame; await document.fonts.ready; drawFrame(0.1); window.ready = true;
