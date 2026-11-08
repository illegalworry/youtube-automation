import * as THREE from './lib/three.module.js';
import * as T from './toon.js';
import * as P from './paint.js';
import { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt } from './story.js';

const W = 1080, H = 1920;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.08, 1500);
const rx = (a) => a * Math.PI / 180;

// ---------- materials ----------
const grad = (() => { const d = new Uint8Array([90, 90, 90, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 2, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (opts) => new THREE.MeshToonMaterial({ gradientMap: grad, ...opts });
const texM = (c, rx_ = 1, ry_ = 1, color = '#ffffff') => toon({ map: P.tex(c, rx_, ry_), color });

// ---------- ink / normal-depth contract ----------
const NOINK = 'noink'; // userData flag: never outlined (cards, fx, water handled specially)
const ndMat = new THREE.ShaderMaterial({
  vertexShader: `varying vec3 vN; varying float vD; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }`,
  side: THREE.DoubleSide,
});
const cardNd = (map) => new THREE.ShaderMaterial({
  uniforms: { map: { value: map } },
  vertexShader: `varying vec2 vUv; varying float vD; void main(){ vUv=uv; vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying float vD; void main(){ if(texture2D(map,vUv).a<.5) discard; gl_FragColor=vec4(0.,0.,0.,vD); }`,
  side: THREE.DoubleSide,
});
const waterNd = new THREE.ShaderMaterial({
  vertexShader: `varying float vD; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vD; void main(){ gl_FragColor=vec4(.5,1.,.5,vD); }`,
});

// ---------- helpers ----------
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene, opts = {}) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = opts.cast ?? true; m.receiveShadow = true; parent.add(m); return m;
};
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const uvScale = (geo, su, sv) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); return geo; };
/** box with world-scaled UVs per face (texel density 1 tile per `t` metres) */
const tbox = (w, h, d, t = 2) => {
  const g = box(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / t, uv.getY(i) * dims[f][1] / t); }
  return g;
};

// ---------- sky ----------
const skyU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, sunCol: { value: new THREE.Color() }, sunSize: { value: 0 } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, hor, sunDir, sunCol; uniform float sunSize; varying vec3 vP;
    void main(){ float h = clamp(vP.y,0.,1.); vec3 c = mix(hor, top, pow(h, .55)); if(vP.y<0.) c = hor;
      float s = dot(normalize(vP), normalize(sunDir)); c += sunCol * (smoothstep(1.-sunSize, 1.-sunSize*.6, s) + .35*pow(max(s,0.), 24.)*step(.001,sunSize));
      gl_FragColor = vec4(c,1.); }`,
}));
sky.userData.sky = true; scene.add(sky);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight('#ffffff', '#ffffff', 1); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffffff', 2); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; sun.shadow.radius = 2;
scene.add(sun); scene.add(sun.target);
scene.fog = new THREE.Fog('#ffffff', 40, 600);


// ---------- materials ----------
const M = {
  grass: texM(P.grass(6), 60, 60), dirt: texM(P.dirt(7), 1, 1), rock: texM(P.rock(21), 1, 1), rockC: texM(P.rock(27, 30, 12, 44), 1, 1),
  coal: texM(P.coal(22), 1, 1), strata: texM(P.strata(23), 1, 1), rubble: texM(P.rubble(24), 1, 1), slate: texM(P.slate(25), 1, 1),
  brick: texM(P.stone(28, 10, 42, 46, 48, 22), 1, 1), timber: texM(P.beam(2, [32, 42, 38]), 1, 1), timberD: texM(P.beam(3, [28, 30, 26]), 1, 1),
  ironT: texM(P.iron(26), 1, 1), plaster: texM(P.plaster(8, 42), 1, 1), flag: texM(P.stone(29, 30, 8, 60, 128, 128), 1, 1),
  iron: toon({ color: '#3d4148' }), steel: toon({ color: '#8b939c' }), zinc: toon({ color: '#a9b2b8' }), wood: toon({ color: '#7a5434' }),
  door: toon({ color: '#3d5a7a' }), door2: toon({ color: '#8a2f2a' }), window: toon({ color: '#2b2a36' }), sill: toon({ color: '#e8e0cc' }),
  hill: toon({ color: '#6f9e45' }), hillFar: toon({ color: '#82a85e' }), hillBack: toon({ color: '#93ad7a' }), tip: toon({ color: '#3a3a40' }), tip2: toon({ color: '#4c4a4e' }),
  coalHeap: toon({ color: '#22232a' }), rail: toon({ color: '#6c6f75' }), sleeper: toon({ color: '#4a3524' }), red: toon({ color: '#9c2f28' }),
  water: toon({ color: '#6cc0f0', emissive: '#1d4d6a' }), thimble: toon({ color: '#c9ccd2' }), chimneyTop: toon({ color: '#5a3a30' }),
  lampGlass: new THREE.MeshBasicMaterial({ color: '#ffe9a8' }), black: new THREE.MeshBasicMaterial({ color: '#0d0b0a' }),
  pine: toon({ color: '#3f6b36' }), trunk: toon({ color: '#5a4030' }), bush: toon({ color: '#5f8f3a' }),
};
const NOSH = { cast: false };
const tex2 = (m, rx_, ry_) => { const c = m.clone(); c.map = m.map.clone(); c.map.repeat.set(rx_, ry_); c.map.needsUpdate = true; return c; };

// ---------- world ----------
const world = new THREE.Group(); scene.add(world);
const surf = new THREE.Group(); world.add(surf);           // everything above ground
const mine = new THREE.Group(); world.add(mine);           // the gallery 60 m down
const earth = new THREE.Group(); world.add(earth);         // cutaway block (only for the cross-section shot)
const Y0 = -60, TW = 2.1, TH = 3.6, TX0 = -34, TX1 = 26;   // gallery floor, half width, height, x range
const HF = new THREE.Vector3(-31, 0, -0.5);                // headframe / shaft centre

// ground: full plane for surface shots, cut plane (ends at the cut face) for the cross-section
const groundFull = add(new THREE.PlaneGeometry(1600, 1600), M.grass, 0, 0, 0, surf, NOSH); groundFull.rotation.x = -Math.PI / 2;
const groundCut = add(new THREE.PlaneGeometry(1600, 800), M.grass, 0, 0, -400 + 2.3, earth, NOSH); groundCut.rotation.x = -Math.PI / 2;
// pit yard: cinder ground around the headframe
const yard = add(new THREE.PlaneGeometry(60, 34), tex2(M.dirt, 8, 5), -32, 0.02, -2, surf, NOSH); yard.rotation.x = -Math.PI / 2;
yard.material.color.set('#7d7266');
// rails across the yard
for (const z of [3.2, 4.4]) add(tbox(50, 0.08, 0.08, 2), M.rail, -30, 0.06, z, surf, NOSH);
for (let x = -54; x < -6; x += 1.2) add(box(0.25, 0.05, 1.8), M.sleeper, x, 0.03, 3.8, surf, NOSH);

// headframe: four lattice legs, platform, two sheave wheels, back struts
const hf = new THREE.Group(); hf.position.copy(HF); surf.add(hf);
const HH_ = 19;
for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
  const leg = add(tbox(0.45, HH_ + 0.4, 0.45, 2), M.ironT, sx * 2.4, HH_ / 2, sz * 2.0, hf); leg.rotation.z = -sx * 0.06; leg.rotation.x = sz * 0.05;
}
for (let y = 3; y < HH_; y += 3.2) {
  const w = 2.4 - y * 0.06 * 0.98, d = 2.0 - y * 0.05;
  for (const sz of [-1, 1]) add(tbox(w * 2 + 0.3, 0.22, 0.22, 2), M.ironT, 0, y, sz * d, hf);
  for (const sx of [-1, 1]) add(tbox(0.22, 0.22, d * 2 + 0.3, 2), M.ironT, sx * w, y, 0, hf);
  for (const sz of [-1, 1]) { const b = add(tbox(Math.hypot(w * 2, 3.2), 0.14, 0.14, 2), M.ironT, 0, y + 1.6, sz * d, hf); b.rotation.z = ((y / 3.2) % 2 > 1 ? 1 : -1) * Math.atan2(3.2, w * 2); }
}
add(tbox(3.6, 0.35, 5.2, 2), M.ironT, 0, HH_ + 0.2, 0, hf);
const sheaves = [];
for (const sz of [-1.2, 1.2]) {
  const wg = new THREE.Group(); wg.position.set(0, HH_ + 2.3, sz); hf.add(wg); sheaves.push(wg);
  const rim = add(new THREE.TorusGeometry(2.0, 0.13, 8, 40), M.red, 0, 0, 0, wg);
  add(new THREE.TorusGeometry(1.75, 0.07, 6, 40), M.red, 0, 0, 0, wg);
  for (let i = 0; i < 6; i++) { const sp = add(box(0.1, 3.9, 0.1), M.red, 0, 0, 0, wg); sp.rotation.z = i * Math.PI / 6; }
  add(new THREE.CylinderGeometry(0.25, 0.25, 0.4, 12), M.iron, 0, 0, 0, wg).rotation.x = Math.PI / 2;
  add(tbox(0.3, 2.3, 0.3, 2), M.ironT, 0, -1.2, 0, wg);
  void rim;
}
for (const sz of [-1, 1]) { const st = add(tbox(0.4, 22, 0.4, 2), M.ironT, -7.5, 9.6, sz * 1.8, hf); st.rotation.z = -Math.atan2(7.6, 19.5); }
// cables from the sheaves down the shaft
const cables = [];
for (const sz of [-1.2, 1.2]) { const c = add(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), M.iron, 2.0, 0, sz, hf, NOSH); cables.push(c); }
// shaft collar + black hole
for (const [x, z, w, d] of [[0, -2.15, 4.6, 0.5], [0, 2.15, 4.6, 0.5], [-2.15, 0, 0.5, 3.8], [2.15, 0, 0.5, 3.8]]) add(tbox(w, 0.7, d, 1), M.brick, x, 0.35, z, hf);
const hole = add(new THREE.PlaneGeometry(3.8, 3.8), M.black, 0, 0.04, 0, hf, NOSH); hole.rotation.x = -Math.PI / 2;
// the lift cage (goes down)
const lift = new THREE.Group(); hf.add(lift);
add(tbox(2.6, 0.12, 2.2, 1), M.ironT, 0, 0, 0, lift); add(tbox(2.6, 0.12, 2.2, 1), M.ironT, 0, 2.7, 0, lift);
for (const [x, z] of [[-1.25, -1.05], [1.25, -1.05], [-1.25, 1.05], [1.25, 1.05]]) add(tbox(0.1, 2.7, 0.1, 1), M.ironT, x, 1.35, z, lift);
for (let i = -3; i <= 3; i++) { add(tbox(0.04, 2.6, 0.04, 1), M.iron, i * 0.36, 1.35, -1.05, lift, NOSH); add(tbox(0.04, 2.6, 0.04, 1), M.iron, -1.25, 1.35, i * 0.3, lift, NOSH); }
add(tbox(2.6, 0.06, 0.06, 1), M.iron, 0, 1.6, 1.05, lift, NOSH);
// engine house (brick, slate roof, arched windows)
const engine = new THREE.Group(); engine.position.set(-45, 0, -5); surf.add(engine);
add(tbox(9, 8.5, 7.5, 2.5), M.brick, 0, 4.25, 0, engine);
{ const sh = new THREE.Shape(); sh.moveTo(-5.1, 0); sh.lineTo(5.1, 0); sh.lineTo(0, 3.2); sh.closePath();
  const rf = add(new THREE.ExtrudeGeometry(sh, { depth: 8.1, bevelEnabled: false }), M.slate, 0, 8.5, -4.05, engine); rf.material = M.slate;
  for (const s of [-1, 1]) { const r = add(tbox(5.9, 0.18, 8.3, 2), M.slate, s * 2.55, 10.1, 0, engine); r.rotation.z = -s * Math.atan2(3.2, 5.1); } }
for (const x of [-2.6, 0, 2.6]) { add(box(1.3, 2.8, 0.12), M.window, x, 5.2, 3.78, engine, NOSH); add(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16, 1, false, 0, Math.PI), M.window, x, 6.6, 3.78, engine, NOSH).rotation.set(Math.PI / 2, 0, Math.PI / 2); add(box(1.6, 0.18, 0.3), M.sill, x, 3.75, 3.85, engine, NOSH); }
add(box(1.8, 3.2, 0.12), M.door2, 4.6, 1.6, 0, engine, NOSH).rotation.y = Math.PI / 2;
// lamp room / pithead shed (where the new boy gets his kit)
const shed = new THREE.Group(); shed.position.set(-20, 0, -7.5); surf.add(shed);
add(tbox(8, 4.2, 5, 2.5), M.rubble, 0, 2.1, 0, shed);
{ for (const s of [-1, 1]) { const r = add(tbox(4.7, 0.16, 5.6, 2), M.slate, s * 2.15, 5.0, 0, shed); r.rotation.z = -s * 0.42; } }
add(box(1.2, 2.3, 0.1), M.door, -2.2, 1.15, 2.53, shed, NOSH); for (const x of [0.6, 2.6]) { add(box(1.0, 1.1, 0.1), M.window, x, 2.5, 2.53, shed, NOSH); add(box(1.25, 0.14, 0.24), M.sill, x, 1.9, 2.6, shed, NOSH); }
// crate in front of the lamp room (the resuscitation box / the detector sit on it)
add(tbox(1.1, 0.8, 0.8, 0.8), M.timber, -23.0, 0.4, -2.0, surf);
add(tbox(1.0, 0.95, 0.75, 0.8), M.timber, -23.6, 0.47, 3.4, surf);
// chimney stack
const chim = add(new THREE.CylinderGeometry(0.95, 1.35, 30, 16), M.brick, -53, 15, -16, surf);
add(new THREE.CylinderGeometry(1.15, 1.15, 0.8, 16), M.chimneyTop, -53, 30.2, -16, surf);
// coal heap + slag tips
add(new THREE.ConeGeometry(4.5, 3.5, 9), M.coalHeap, -10, 1.75, -9, surf);
for (const [x, z, r, h] of [[30, -110, 45, 26], [-70, -140, 55, 30], [95, -60, 35, 20]]) add(new THREE.ConeGeometry(r, h, 10), M.tip, x, h / 2 - 1, z, surf, NOSH);
// terraced houses climbing the valley side
const terrace = (x0, z, y, n, rot = 0) => {
  const g = new THREE.Group(); g.position.set(x0, y, z); g.rotation.y = rot; surf.add(g);
  if (y > 0) add(tbox(n * 5 + 4, y + 0.5, 12, 4), tex2(M.grass, 3, 1), n * 2.5 - 2.5, -y / 2 - 0.25, -2, g, NOSH);
  add(tbox(n * 5, 6, 6, 2.5), M.rubble, n * 2.5 - 2.5, 3, 0, g);
  for (const s of [-1, 1]) { const r = add(tbox(n * 5 + 0.4, 0.18, 3.9, 2), M.slate, n * 2.5 - 2.5, 7.15, s * 1.62, g); r.rotation.x = s * 0.62; }
  for (let i = 0; i < n; i++) {
    const x = i * 5;
    add(box(1.0, 2.1, 0.1), i % 3 === 1 ? M.door2 : M.door, x - 1.3, 1.05, 3.03, g, NOSH);
    add(box(1.1, 1.2, 0.1), M.window, x + 1.0, 1.7, 3.03, g, NOSH); add(box(1.1, 1.2, 0.1), M.window, x + 1.0, 4.3, 3.03, g, NOSH); add(box(1.1, 1.2, 0.1), M.window, x - 1.3, 4.3, 3.03, g, NOSH);
    for (const [wx, wy] of [[x + 1.0, 1.1], [x + 1.0, 3.7], [x - 1.3, 3.7]]) add(box(1.3, 0.14, 0.22), M.sill, wx, wy, 3.1, g, NOSH);
    if (i % 2 === 0) { add(tbox(0.7, 1.6, 0.9, 1), M.brick, x + 2.5, 8.2, 0, g); add(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 8), M.chimneyTop, x + 2.3, 9.2, 0, g); }
  }
  return g;
};
terrace(4, -30, 0, 8); terrace(12, -46, 4, 7); terrace(-6, -64, 9, 9); terrace(40, -18, 0, 5, -0.5);
// valley sides: big green hills
const rt = P.rng(44);
for (let i = 0; i < 14; i++) { const s = i % 2 ? 1 : -1, x = s * (130 + rt() * 60), z = -60 - rt() * 260; const h = add(new THREE.SphereGeometry(80 + rt() * 50, 24, 12), i % 3 ? M.hill : M.hillFar, x, -20, z, surf, NOSH); h.scale.set(1, 0.55 + rt() * 0.25, 1.2); }
for (let i = 0; i < 8; i++) { const x = -260 + i * 75, z = -380 - rt() * 60; const h = add(new THREE.SphereGeometry(110 + rt() * 40, 24, 12), M.hillBack, x, -30, z, surf, NOSH); h.scale.y = 0.75; }
{ const h = add(new THREE.SphereGeometry(90, 24, 12), M.hill, 20, -38, -150, surf, NOSH); h.scale.set(1.6, 0.6, 0.9); }
// trees on the valley floor + hedges
const tree = (x, z, h = 6) => { const g = new THREE.Group(); g.position.set(x, 0, z); surf.add(g); add(new THREE.CylinderGeometry(0.2, 0.3, h * 0.5, 6), M.trunk, 0, h * 0.25, 0, g); const c = add(new THREE.SphereGeometry(1, 12, 8), M.pine, 0, h * 0.6, 0, g); c.scale.set(h * 0.35, h * 0.38, h * 0.35); };
for (let i = 0; i < 26; i++) { const x = -110 + rt() * 220, z = -20 - rt() * 120; if (Math.abs(x + 30) < 30 && z > -40) continue; tree(x, z, 5 + rt() * 4); }
for (let i = 0; i < 10; i++) tree(30 + rt() * 50, 18 + rt() * 30, 4 + rt() * 3);
// back-yard with the standpipe (thimble / bucket analogy)
const YD = new THREE.Vector3(24, 0, 16);
const yd = new THREE.Group(); yd.position.copy(YD); surf.add(yd);
const flags = add(new THREE.PlaneGeometry(6, 4), tex2(M.flag, 3, 2), 0, 0.02, 0.6, yd, NOSH); flags.rotation.x = -Math.PI / 2;
add(tbox(8, 1.6, 0.5, 1.5), M.rubble, 0, 0.8, -1.0, yd);
add(tbox(8, 0.12, 0.6, 1), M.flag, 0, 1.66, -1.0, yd);
add(new THREE.CylinderGeometry(0.045, 0.05, 1.1, 10), M.iron, 0, 0.55, -0.62, yd);                     // standpipe
add(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 10), M.iron, 0, 1.05, -0.62, yd).rotation.z = Math.PI / 2; // header pipe
for (const x of [-0.33, 0.33]) { const sp = add(new THREE.CylinderGeometry(0.025, 0.02, 0.16, 10), M.steel, x, 0.98, -0.62, yd); sp.rotation.x = 0; }
add(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), M.red, 0, 1.18, -0.62, yd);                     // the one tap handle
add(box(0.16, 0.025, 0.025), M.red, 0, 1.2, -0.62, yd);
// bucket (open zinc), thimble (scaled up slightly for the lens)
const bucket = new THREE.Group(); bucket.position.set(0.33, 0.02, -0.62); yd.add(bucket);
{ const g = new THREE.CylinderGeometry(0.17, 0.13, 0.32, 24, 1, true); const m = M.zinc.clone(); m.side = THREE.DoubleSide; add(g, m, 0, 0.16, 0, bucket);
  add(new THREE.CylinderGeometry(0.13, 0.13, 0.01, 24), M.zinc, 0, 0.005, 0, bucket); add(new THREE.TorusGeometry(0.17, 0.008, 6, 24), M.steel, 0, 0.32, 0, bucket).rotation.x = Math.PI / 2;
  const hd = add(new THREE.TorusGeometry(0.17, 0.006, 6, 24, Math.PI), M.iron, 0, 0.32, 0, bucket, NOSH); hd.rotation.y = 0.4; }
const bucketWater = add(new THREE.CylinderGeometry(0.14, 0.13, 1, 24), M.water, 0, 0, 0, bucket, NOSH);
const thimble = new THREE.Group(); thimble.position.set(-0.33, 0.02, -0.62); yd.add(thimble);
{ const g = new THREE.CylinderGeometry(0.022, 0.02, 0.05, 20, 1, true); const m = M.thimble.clone(); m.side = THREE.DoubleSide; add(g, m, 0, 0.025, 0, thimble);
  add(new THREE.SphereGeometry(0.022, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.thimble, 0, 0.05, 0, thimble, NOSH).visible = false;
  add(new THREE.TorusGeometry(0.022, 0.003, 6, 20), M.steel, 0, 0.05, 0, thimble, NOSH).rotation.x = Math.PI / 2; }
const thimbleWater = add(new THREE.CylinderGeometry(0.019, 0.019, 1, 20), M.water, 0, 0, 0, thimble, NOSH);
const streams = [-0.33, 0.33].map((x) => add(new THREE.CylinderGeometry(0.008, 0.008, 1, 8), M.water, x, 0, -0.62, yd, NOSH));
const overflow = add(new THREE.CylinderGeometry(0.03, 0.045, 0.004, 20), M.water, -0.33, 0.02, -0.62, yd, NOSH);

// ---------- the gallery (60 m down) ----------
const GL = TX1 - TX0, GX = (TX0 + TX1) / 2;
const gfloor = add(tbox(GL + 4, 0.3, TW * 2 + 0.6, 2), tex2(M.dirt, 1, 1), GX, Y0 - 0.15, 0, mine, NOSH); gfloor.material.color.set('#8a7a68');
const gceil = add(tbox(GL + 4, 0.6, TW * 2 + 0.6, 2.2), M.rock, GX, Y0 + TH + 0.3, 0, mine, NOSH);
const gback = add(tbox(GL + 4, TH, 0.5, 1.3), M.rock, GX, Y0 + TH / 2, -TW - 0.25, mine, NOSH);
const gfront = add(tbox(GL + 4, TH, 0.5, 1.3), M.rock, GX, Y0 + TH / 2, TW + 0.25, mine, NOSH);
add(tbox(0.6, TH, TW * 2, 2.2), M.rock, TX0 - 2.3, Y0 + TH / 2, 0, mine, NOSH);
// coal face: seam band between rock
const face = new THREE.Group(); face.position.set(TX1, Y0, 0); mine.add(face);
add(tbox(0.8, 1.0, TW * 2, 2), M.rockC, 0.4, 0.5, 0, face, NOSH); add(tbox(0.8, 1.9, TW * 2, 1.2), M.coal, 0.15, 1.95, 0, face, NOSH); add(tbox(0.8, 0.7, TW * 2, 2), M.rockC, 0.4, 3.25, 0, face, NOSH);
for (let i = 0; i < 9; i++) { const r = P.rng(70 + i); const c = add(new THREE.DodecahedronGeometry(0.12 + r() * 0.14, 0), M.coalHeap, -0.4 - r() * 1.6, 0.08, -1.6 + r() * 3.2, face); c.rotation.set(r() * 3, r() * 3, 0); }
// rails + sleepers
for (const z of [-0.5, 0.5]) add(tbox(GL, 0.07, 0.07, 2), M.rail, GX, Y0 + 0.08, z, mine, NOSH);
for (let x = TX0; x < TX1 - 1; x += 0.9) add(box(0.2, 0.06, 1.5), M.sleeper, x, Y0 + 0.03, 0, mine, NOSH);
// timber sets: two leaning posts + a cap beam, every 2.6 m
const SETS = []; for (let x = TX0 + 1.5; x < TX1 - 0.8; x += 2.6) SETS.push(x);
for (const x of SETS) {
  for (const s of [-1, 1]) { if (s > 0 && x > 14 && x < 20) continue; const p = add(new THREE.CylinderGeometry(0.13, 0.15, TH - 0.1, 8), M.timber, x, Y0 + TH / 2 - 0.1, s * (TW - 0.28), mine); p.rotation.x = -s * 0.07; }
  add(new THREE.CylinderGeometry(0.15, 0.15, TW * 2 + 0.2, 8), M.timberD, x, Y0 + TH - 0.12, 0, mine).rotation.x = Math.PI / 2;
  for (let k = -2; k <= 2; k++) add(box(0.9, 0.06, 0.2), M.timberD, x + 0.9, Y0 + TH - 0.02, k * 0.8, mine, NOSH); // lagging boards
}
// coal tubs on the rails
const tub = (x) => { const g = new THREE.Group(); g.position.set(x, Y0 + 0.14, 0); mine.add(g); add(tbox(1.5, 0.75, 1.05, 1), M.ironT, 0, 0.55, 0, g);
  const c = add(tbox(1.35, 0.15, 0.9, 1), M.coal, 0, 0.92, 0, g, NOSH); void c;
  for (const [wx, wz] of [[-0.45, -0.55], [0.45, -0.55], [-0.45, 0.55], [0.45, 0.55]]) add(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 12), M.iron, wx, 0.1, wz, g).rotation.x = Math.PI / 2; return g; };
tub(-6.5); tub(-8.2); tub(-21);
// hanging lamps (bright glass + a warm point light each)
const LAMPS = [-27, -15.5, -4, 7.5, 18], lampLights = [];
for (const x of LAMPS) {
  const g = new THREE.Group(); g.position.set(x + 0.25, Y0 + TH - 0.55, -1.5); mine.add(g);
  add(new THREE.CylinderGeometry(0.09, 0.11, 0.24, 10), M.lampGlass, 0, 0, 0, g, NOSH); add(new THREE.ConeGeometry(0.14, 0.12, 10), M.iron, 0, 0.17, 0, g, NOSH);
  add(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 10), M.iron, 0, -0.13, 0, g, NOSH);
  const L = new THREE.PointLight('#ffc27a', 0, 11, 1.4); L.position.set(x + 0.25, Y0 + TH - 0.8, -1.2); scene.add(L); lampLights.push(L);
}
// Betty's chain (cage hangs from it)
add(new THREE.CylinderGeometry(0.012, 0.012, 1.55, 6), M.iron, 18.2, Y0 + 2.8, -0.9, mine, NOSH);
// a stack of spare props + water barrel
add(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 14), M.wood, -12, Y0 + 0.45, -1.6, mine);
for (let i = 0; i < 4; i++) add(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 8), M.timber, -17 + i * 0.05, Y0 + 0.14 + i * 0.22, 1.55 - (i % 2) * 0.24, mine).rotation.z = Math.PI / 2;
// shaft bottom (landing) with a light from above
add(tbox(3.6, 0.2, 3.6, 1), M.ironT, TX0 + 2, Y0 + TH + 0.6, 0, mine, NOSH);

// ---------- cutaway earth block (cross-section shot only) ----------
const EZ = TW + 0.5, EB = 34; // front face z, depth
const eb = (x0, x1, y0, y1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, EB); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (x1 - x0) / 22, uv.getY(i) * (y1 - y0) / 44 + (y0 + 64) / 44); return add(g, M.strata, (x0 + x1) / 2, (y0 + y1) / 2, EZ - EB / 2, earth, NOSH); };
M.strata.map.wrapS = M.strata.map.wrapT = THREE.RepeatWrapping;
eb(-90, 90, Y0 + TH + 0.6, -0.05); eb(-90, 90, -160, Y0 - 0.3); eb(-90, TX0 - 2.6, Y0 - 0.3, Y0 + TH + 0.6); eb(TX1 + 0.8, 90, Y0 - 0.3, Y0 + TH + 0.6);
// the shaft drawn on the cut face
const shaftFace = add(box(3.8, -Y0 - TH, 0.12), M.black, HF.x, (Y0 + TH) / 2, EZ + 0.06, earth, NOSH);
const cutLift = add(box(2.4, 2.6, 0.2), M.ironT, HF.x, -12, EZ + 0.14, earth, NOSH);
const cutCable = add(new THREE.CylinderGeometry(0.06, 0.06, 1, 6), M.steel, HF.x, -6, EZ + 0.16, earth, NOSH);
earth.visible = false;
// clouds: painted billboards far away (no fog, no ink)
const clouds = [];
{ const r = P.rng(90);
  for (let i = 0; i < 14; i++) {
    const c = document.createElement('canvas'); c.width = 600; c.height = 400; const pen = new T.Pen(c.getContext('2d')); pen.ol = 0;
    pen.g.translate(300, 200); pen.g.scale(1.4, 1.2); pen.g.translate(-300, -200); T.fxCloud(pen, i + 1);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.667), new THREE.MeshBasicMaterial({ map: P.tex(c), transparent: true, fog: false, depthWrite: false }));
    const a = r() * Math.PI * 2, d = 650 + r() * 250; m.position.set(Math.cos(a) * d, 120 + r() * 160, Math.sin(a) * d); m.scale.setScalar(160 + r() * 140);
    m.userData.ndSkip = true; m.renderOrder = -1; scene.add(m); clouds.push(m);
  } }
// ---------- cards ----------
const CW = 1200, CH = 2000, CM = 2.25; // canvas px, card height in metres (design 600x1000 -> 2.25 m)
const cardGeo = new THREE.PlaneGeometry(CM * 0.6, CM); cardGeo.translate(0, CM / 2 - CM * 0.025, 0);
const blobTex = P.tex(P.radial('20,14,30', 0.6));
class Card {
  constructor(scale = 1) {
    [this.c, this.g] = (() => { const c = document.createElement('canvas'); c.width = CW; c.height = CH; return [c, c.getContext('2d')]; })();
    this.t = new THREE.CanvasTexture(this.c); this.t.colorSpace = THREE.SRGBColorSpace; this.t.anisotropy = 4;
    this.mat = new THREE.MeshBasicMaterial({ map: this.t, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, fog: true });
    this.mesh = new THREE.Mesh(cardGeo, this.mat); this.mesh.userData.nd = cardNd(this.t); this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.t, alphaTest: 0.5 });
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, fog: true }));
    this.blob.rotation.x = -Math.PI / 2; this.blob.userData.ndSkip = true; this.blob.renderOrder = 1;
    scene.add(this.mesh); scene.add(this.blob); this.key = ''; this.mesh.visible = this.blob.visible = false;
  }
  draw(key, fn) {
    if (key === this.key) return; this.key = key;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, CW, CH); g.setTransform(CW / 600, 0, 0, CH / 1000, 0, 0);
    const p = new T.Pen(g); fn(p); this.t.needsUpdate = true;
  }
}
const cards = []; const getCard = (i) => cards[i] || (cards[i] = new Card());

// ---------- render targets & post ----------
const rtColor = new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType });
const rtNd = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const rtInk = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsGeo = new THREE.PlaneGeometry(2, 2);
const fs = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(fsGeo, mat)); return s; };
const inkU = { col: { value: rtColor.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, px: { value: 1.6 }, fogCol: { value: new THREE.Color() },
  sat: { value: 1.08 }, lift: { value: new THREE.Color(0, 0, 0) }, gain: { value: new THREE.Color(1, 1, 1) }, vig: { value: 0.22 }, flash: { value: 0 }, dark: { value: 0 } };
const inkScene = fs(new THREE.ShaderMaterial({ uniforms: inkU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D col, nd; uniform vec2 res; uniform float px, sat, vig, flash, dark; uniform vec3 fogCol, lift, gain; varying vec2 vUv;
  float edgeAt(vec2 uv, float r){
    vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01) return 0.; float d = c.a; vec3 n = c.rgb*2.-1.;
    float e = 0.; float rr = r * clamp(7./d, .62, 1.25);
    for (int i=0;i<16;i++){ float a = float(i)*.785398 + (i>7 ? .39 : 0.); float k = i>7 ? .5 : 1.;
      vec2 o = vec2(cos(a), sin(a))*rr*k/res; vec4 s = texture2D(nd, uv+o);
      float ds = s.a; bool card = dot(s.rgb,s.rgb) < .01;
      if (card && ds > 0.) continue;            // character cards: never outlined by the world ink
      if (card) ds = 1e4;                        // sky
      vec3 ns = s.rgb*2.-1.;
      e = max(e, smoothstep(.006, .02, (ds - d)/d));                           // depth jump, near side only
      if (!card && abs(ds-d)/d < .06) e = max(e, smoothstep(.88, .72, dot(n, ns)) * .9); // crease
    }
    return e * (1. - smoothstep(140., 520., d)*.8);
  }
  void main(){
    vec3 c = texture2D(col, vUv).rgb;
    float e = edgeAt(vUv, px);
    c = mix(c, vec3(.012,.01,.014), e);
    if (flash < -0.5) c = vec3(e);
    float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
    c = c*gain + lift;
    vec2 q = vUv-.5; c *= 1. - vig*dot(q*vec2(1.,.75), q*vec2(1.,.75))*2.2;
    c = mix(c, vec3(1.), flash); c *= 1. - dark;
    gl_FragColor = vec4(c,1.); }` }));
const dofU = { src: { value: rtInk.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 5 }, cinf: { value: 0 }, near: { value: 1 } };
const dofScene = fs(new THREE.ShaderMaterial({ uniforms: dofU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D src, nd; uniform vec2 res; uniform float focus, cinf, near; varying vec2 vUv;
  float coc(vec2 uv){ float d = texture2D(nd, uv).a; if (d <= 0.) d = 2000.; float k = 1. - focus/d; return k > 0. ? cinf*k : min(-k*cinf*near, cinf*1.4); }
  void main(){
    float c0 = coc(vUv);
    if (cinf < .5 || c0 < .6) { gl_FragColor = linearToOutputTexel(vec4(texture2D(src, vUv).rgb, 1.)); return; }
    vec3 acc = vec3(0.); float wsum = 0.;
    for (int i=0;i<48;i++){ float fi = float(i); float r = sqrt((fi+.5)/48.); float a = fi*2.39996;
      vec2 o = vec2(cos(a), sin(a))*r*c0/res; float cs = coc(vUv+o);
      float w = smoothstep(r*c0-1.5, r*c0+.5, cs + .5);
      acc += texture2D(src, vUv+o).rgb*w; wsum += w; }
    gl_FragColor = linearToOutputTexel(vec4(acc/max(wsum,1e-3), 1.)); }` }));
// final copy with sRGB handled by the renderer output (we render to screen with linear->sRGB in the shader chunk)
dofScene.children[0].material.toneMapped = false;

// ---------- per-frame state ----------
const tmpV = new THREE.Vector3();
function applyLight(L, f) {
  hemi.color.set(L.sky); hemi.groundColor.set(L.ground); hemi.intensity = L.hemi;
  sun.color.set(L.sun); sun.intensity = L.sunI;
  scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
  skyU.top.value.set(L.skyTop); skyU.hor.value.set(L.skyHor); skyU.sunCol.value.set(L.sunDisc || '#000'); skyU.sunSize.value = L.sunSize || 0;
  inkU.sat.value = L.sat; inkU.gain.value.set(L.gain || '#ffffff'); inkU.lift.value.set(L.lift || '#000000');
}
function placeSun(L, focus) {
  // sun direction from azimuth/elevation in world space
  const az = rx(L.az), el = rx(L.el); tmpV.set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
  skyU.sunDir.value.copy(tmpV);
  sun.position.copy(focus).addScaledVector(tmpV, 80); sun.target.position.copy(focus);
  const ext = L.shadowExt || 30, sc = sun.shadow.camera; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = 200; sc.updateProjectionMatrix();
}

function worldState(S, f, Lt) {
  const cut = !!S.cut;
  earth.visible = cut; groundFull.visible = !cut; gfront.visible = !cut;
  // lift: y in metres (0 = at the surface), sheaves turn with it
  lift.position.y = S.lift ?? 0; lift.visible = S.lift === undefined || S.lift > -12;
  for (const w of sheaves) w.rotation.z = (S.lift ?? 0) / 2.0;
  cables.forEach((c) => { const top = HH_ + 2.3, bot = (S.lift ?? 0) + 2.7; c.scale.y = Math.max(0.1, top - bot); c.position.y = (top + bot) / 2; c.position.x = 0; });
  cutLift.position.y = S.cutLift ?? -20; cutCable.scale.y = -0.05 - (S.cutLift ?? -20) - 1.3; cutCable.position.y = ((S.cutLift ?? -20) + 1.3) / 2;
  // tap analogy
  const tw = S.thimble ?? 0, bw = S.bucket ?? 0;
  thimbleWater.visible = tw > 0.01; thimbleWater.scale.y = Math.max(0.001, tw * 0.048); thimbleWater.position.y = tw * 0.024 + 0.002;
  bucketWater.visible = bw > 0.005; bucketWater.scale.y = Math.max(0.001, bw * 0.3); bucketWater.position.y = bw * 0.15 + 0.01;
  streams.forEach((s, i) => { const on = S.tap ?? 0; s.visible = on > 0; const top = 0.9, bot = i === 0 ? 0.04 : 0.04 + bw * 0.3; s.scale.set(on, top - bot, on); s.position.y = (top + bot) / 2; });
  overflow.visible = tw >= 1; overflow.scale.setScalar(1 + 0.15 * Math.sin(f * 0.9));
  // mine lamps on only underground
  lampLights.forEach((L, i) => { L.intensity = (Lt.lamps || 0) * (1 + 0.06 * Math.sin(f * 0.7 + i * 2)); });
}

function drawActors(list, cam) {
  cards.forEach((c) => { c.mesh.visible = c.blob.visible = false; });
  list.forEach((a, i) => {
    const c = getCard(i);
    c.draw(a.key, a.draw);
    c.mesh.visible = true; c.mesh.position.set(a.x, a.y, a.z);
    const s = a.s || 1; c.mesh.scale.set(s * (a.flip ? -1 : 1), s, s);
    c.mesh.rotation.set(0, Math.atan2(cam.position.x - a.x, cam.position.z - a.z) + (a.yaw || 0), a.roll || 0);
    c.mat.color.set(a.tint || '#ffffff'); c.mat.opacity = a.alpha ?? 1; c.mat.transparent = true;
    c.mesh.castShadow = a.shadow !== false;
    c.mesh.renderOrder = a.order || 2;
    if (a.ground !== undefined && a.blob !== false) { c.blob.visible = true; c.blob.position.set(a.x, a.ground + 0.02, a.z); c.blob.scale.set(0.95 * s, 0.6 * s, 1); }
  });
}

const swapForNd = (on) => {
  scene.traverse((o) => {
    if (!o.isMesh) return;
    if (on) {
      o.userData.mat0 = o.material;
      if (o.userData.ndSkip || o.userData.sky) { o.userData.vis0 = o.visible; o.visible = false; return; }
      o.material = o.userData.nd || ndMat;
    } else {
      o.material = o.userData.mat0; if (o.userData.vis0 !== undefined) { o.visible = o.userData.vis0; delete o.userData.vis0; }
    }
  });
};

window.renderFrame = (f) => {
  const S = shotAt(f), L = lightFor(S, f), C = camAt(f);
  applyLight(L, f);
  camera.position.set(...C.pos); camera.up.set(0, 1, 0); camera.lookAt(...C.look); camera.rotateZ(rx(C.roll || 0));
  camera.fov = C.fov; camera.near = C.near || 0.08; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  const W_ = worldAt(f); worldState(W_, f, L);
  placeSun(L, new THREE.Vector3(...(C.shadowAt || C.look)));
  drawActors([...actorsAt(f, T), ...fxAt(f, T)], camera);
  sky.position.copy(camera.position);
  for (const c of clouds) c.quaternion.copy(camera.quaternion);
  renderer.setRenderTarget(rtColor); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, camera);
  const fog = scene.fog; scene.fog = null; const sm = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false; renderer.shadowMap.autoUpdate = false;
  swapForNd(true); renderer.setRenderTarget(rtNd); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, camera); swapForNd(false);
  scene.fog = fog; renderer.shadowMap.enabled = sm; renderer.shadowMap.autoUpdate = true;
  const D = dofAt(f);
  inkU.px.value = 2.5; inkU.flash.value = C.flash || 0; inkU.dark.value = C.dark || 0; inkU.vig.value = L.vig ?? 0.22;
  renderer.setRenderTarget(rtInk); renderer.render(inkScene, fsCam);
  dofU.focus.value = D.focus; dofU.cinf.value = D.cinf; dofU.near.value = D.near ?? 1;
  renderer.setRenderTarget(null); renderer.render(dofScene, fsCam);
  return true;
};
window.TOTAL = TOTAL;
window.ready = true;
