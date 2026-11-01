// engine/r3d.js — Three.js renderer, stage (sky, sun + shadows, ambient, fog, bloom) and building blocks.
// 1 world unit = 1 stud. A standard avatar is 5 studs tall. +Y up. Facing yaw 0 = looking towards +Z.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { E, rng, shade } from './core.js';
import { LIGHTS } from './looks.js';
export { THREE, RoundedBoxGeometry };

export const D2R = Math.PI / 180;
// render quality (config.json "quality" or ?quality=): draft = fast previews, final = full look
const QUALITY = { draft: { msaa: 0, bloom: false, shadowRes: 1024, soft: false }, final: { msaa: 4, bloom: true, shadowRes: 2048, soft: true } };
export const Q = () => QUALITY[new URLSearchParams(location.search).get('quality') || E.cfg.quality || 'final'] || QUALITY.final;
let R = null;
export function getRenderer(canvas) {
  if (R) return R;
  R = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, alpha: false, powerPreference: 'high-performance' });
  R.setPixelRatio(1); R.setSize(Math.round(E.W * E.PX), Math.round(E.H * E.PX), false);
  R.shadowMap.enabled = true; R.shadowMap.type = Q().soft ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
  R.toneMapping = THREE.NeutralToneMapping; R.toneMappingExposure = 1.0; R.outputColorSpace = THREE.SRGBColorSpace;
  return R;
}
export const renderer = () => R;

// ---------- materials (cached) ----------
const C = (c) => new THREE.Color(c);
const _mats = new Map();
// plastic(colour) — the Roblox "SmoothPlastic" look. Options: rough, metal, emissive, emissiveIntensity, map, transparent, opacity
export function plastic(color, o = {}) {
  const k = color + JSON.stringify(o, (key, v) => (v && v.isTexture ? v.uuid : v));
  if (!o.map && !o.noCache && _mats.has(k)) return _mats.get(k);
  const m = new THREE.MeshStandardMaterial({ color: C(color), roughness: o.rough ?? 0.55, metalness: o.metal ?? 0, map: o.map || null,
    emissive: o.emissive ? C(o.emissive) : C('#000'), emissiveIntensity: o.emissiveIntensity ?? (o.emissive ? 1 : 0),
    transparent: !!o.transparent, opacity: o.opacity ?? 1, side: o.side ?? THREE.FrontSide, flatShading: !!o.flat });
  if (!o.map && !o.noCache) _mats.set(k, m); return m;
}
export const neon = (color, i = 1.6) => plastic(color, { emissive: color, emissiveIntensity: i, rough: 0.4 });
export const glass = (color = '#bfe6ff', op = 0.35) => plastic(color, { transparent: true, opacity: op, rough: 0.1, metal: 0.1 });

// ---------- textures ----------
const _tex = new Map();
export function canvasTex(w, h, draw, o = {}) {
  if (o.key && _tex.has(o.key)) return _tex.get(o.key);
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (o.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...o.repeat); }
  if (o.nearest) { t.magFilter = THREE.NearestFilter; }
  if (o.key) _tex.set(o.key, t); return t;
}
// classic baseplate studs (top surface of parts). rep = tiles per texture repeat
export function studsTex(color = '#4b974b', rep = [32, 32], o = {}) {
  const t = canvasTex(64, 64, (g, w, h) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    g.strokeStyle = shade(color, -0.12); g.lineWidth = 2; g.strokeRect(0, 0, w, h);
    const r = w * 0.26; g.fillStyle = shade(color, 0.07); g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.fill();
    g.strokeStyle = shade(color, -0.1); g.lineWidth = 2; g.beginPath(); g.arc(w / 2 + 1, h / 2 + 1, r, 0.2, 2.4); g.stroke();
  }, { key: 'studs' + color + (o.v || ''), repeat: rep });
  return t;
}
// subtle noise / plank / brick / tile textures for sets
export function patternTex(kind, color, rep = [4, 4], o = {}) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h); const r = rng(o.seed || 7);
    const dk = shade(color, -0.16), lt = shade(color, 0.08);
    if (kind === 'planks') { const n = o.n || 6; for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? lt : color; g.fillRect(0, i * h / n, w, h / n); g.fillStyle = dk; g.fillRect(0, i * h / n, w, 2); g.fillRect(((i * 97) % 256), i * h / n, 2, h / n); } }
    else if (kind === 'bricks') { const rows = 8; g.fillStyle = dk; for (let i = 0; i <= rows; i++) g.fillRect(0, i * h / rows - 2, w, 4); for (let i = 0; i < rows; i++) for (let j = 0; j <= 4; j++) g.fillRect(j * w / 4 + (i % 2) * w / 8 - 2, i * h / rows, 4, h / rows); }
    else if (kind === 'tiles') { const n = o.n || 4; g.fillStyle = dk; for (let i = 0; i <= n; i++) { g.fillRect(i * w / n - 1.5, 0, 3, h); g.fillRect(0, i * h / n - 1.5, w, 3); } }
    else if (kind === 'checker') { const n = o.n || 4; g.fillStyle = o.color2 || lt; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2) g.fillRect(i * w / n, j * h / n, w / n, h / n); }
    else if (kind === 'road') { g.fillStyle = '#f2d23a'; for (let i = 0; i < 4; i++) g.fillRect(w / 2 - 4, i * h / 4 + 10, 8, h / 4 - 20); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(6, 0, 6, h); g.fillRect(w - 12, 0, 6, h); }
    else if (kind === 'grass') { for (let i = 0; i < 380; i++) { g.fillStyle = r() < 0.5 ? dk : lt; g.globalAlpha = 0.35; g.fillRect(r() * w, r() * h, 3, 6); } g.globalAlpha = 1; }
    else if (kind === 'noise') { for (let i = 0; i < 600; i++) { g.fillStyle = r() < 0.5 ? dk : lt; g.globalAlpha = 0.25; g.fillRect(r() * w, r() * h, 4, 4); } g.globalAlpha = 1; }
    else if (kind === 'carpet') { g.strokeStyle = dk; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28); g.strokeStyle = lt; g.lineWidth = 3; g.strokeRect(30, 30, w - 60, h - 60); }
  }, { key: `pat_${kind}_${color}_${rep}_${o.n || ''}_${o.color2 || ''}`, repeat: rep });
}

// ---------- geometry helpers (all meshes cast + receive shadows) ----------
const _geo = new Map();
const geoCache = (k, make) => { if (!_geo.has(k)) _geo.set(k, make()); return _geo.get(k); };
export const prep = (m, cast = true, recv = true) => { m.castShadow = cast; m.receiveShadow = recv; return m; };
const M = (m) => (typeof m === 'string' ? plastic(m) : m);
// part(w,h,d, material, [x,y,z]) — a Roblox "Part": slightly rounded block. y is the BOTTOM of the part when o.base
export function part(w, h, d, material, pos = [0, 0, 0], o = {}) {
  const r = o.round ?? Math.min(0.12, w / 4, h / 4, d / 4);
  const geo = r > 0.01 ? geoCache(`rb${w},${h},${d},${r}`, () => new RoundedBoxGeometry(w, h, d, 2, r)) : geoCache(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d));
  const m = prep(new THREE.Mesh(geo, M(material)), o.cast ?? true, true);
  m.position.set(pos[0], pos[1] + (o.base ? h / 2 : 0), pos[2]); if (o.rot) m.rotation.set(o.rot[0] * D2R, o.rot[1] * D2R, (o.rot[2] || 0) * D2R); return m;
}
export const block = (w, h, d, material, pos, o = {}) => part(w, h, d, material, pos, { round: 0, ...o });
export function cyl(rt, rb, h, material, pos = [0, 0, 0], o = {}) { const m = prep(new THREE.Mesh(geoCache(`c${rt},${rb},${h},${o.seg || 20}`, () => new THREE.CylinderGeometry(rt, rb, h, o.seg || 20)), M(material))); m.position.set(pos[0], pos[1] + (o.base ? h / 2 : 0), pos[2]); if (o.rot) m.rotation.set(o.rot[0] * D2R, o.rot[1] * D2R, (o.rot[2] || 0) * D2R); return m; }
export function ball(r, material, pos = [0, 0, 0], o = {}) { const m = prep(new THREE.Mesh(geoCache(`s${r},${o.seg || 20}`, () => new THREE.SphereGeometry(r, o.seg || 20, Math.round((o.seg || 20) * 0.7))), M(material))); m.position.set(...pos); if (o.scale) m.scale.set(...o.scale); return m; }
export function cone(r, h, material, pos = [0, 0, 0], o = {}) { const m = prep(new THREE.Mesh(geoCache(`k${r},${h},${o.seg || 16}`, () => new THREE.ConeGeometry(r, h, o.seg || 16)), M(material))); m.position.set(pos[0], pos[1] + (o.base ? h / 2 : 0), pos[2]); if (o.rot) m.rotation.set(o.rot[0] * D2R, o.rot[1] * D2R, (o.rot[2] || 0) * D2R); return m; }
export function wedge(w, h, d, material, pos = [0, 0, 0], o = {}) {   // Roblox WedgePart: slope rises towards -Z
  const geo = geoCache(`w${w},${h},${d}`, () => { const s = new THREE.Shape(); s.moveTo(-d / 2, 0); s.lineTo(d / 2, 0); s.lineTo(-d / 2, h); s.closePath(); const g = new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: false }); g.translate(0, 0, -w / 2); g.rotateY(Math.PI / 2); return g; });
  const m = prep(new THREE.Mesh(geo, M(material))); m.position.set(...pos); if (o.rot) m.rotation.set(o.rot[0] * D2R, o.rot[1] * D2R, (o.rot[2] || 0) * D2R); return m;
}
// flat ground plane with optional texture
export function ground(w, d, color, o = {}) {
  const mt = plastic(color, { map: o.tex || null, rough: o.rough ?? 0.8, noCache: !!o.tex });
  const m = prep(new THREE.Mesh(new THREE.PlaneGeometry(w, d), mt), false, true); m.rotation.x = -Math.PI / 2; m.position.set(o.x || 0, o.y || 0, o.z || 0); return m;
}
export const group = (...kids) => { const g = new THREE.Group(); kids.flat().forEach(k => k && g.add(k)); return g; };
export const at = (obj, x = 0, y = 0, z = 0, yawDeg = 0, s = 1) => { obj.position.set(x, y, z); obj.rotation.y = yawDeg * D2R; if (s !== 1) obj.scale.setScalar(s); return obj; };

// text on a sign / screen (canvas texture on a plane)
export function textPlane(str, w, h, o = {}) {
  const px = 128; const t = canvasTex(Math.round(w * px), Math.round(h * px), (g, W, H) => {
    g.fillStyle = o.bg || '#ffffff'; g.fillRect(0, 0, W, H);
    g.fillStyle = o.color || '#1b2a35'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const lines = String(str).split('\n'); let fs = o.size ? o.size * px : Math.min(H / lines.length * 0.7, W / Math.max(...lines.map(l => l.length)) * 1.7);
    g.font = `700 ${fs}px "Fredoka", sans-serif`; lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.1));
  });
  const mt = new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, emissive: o.glow ? C('#ffffff') : C('#000'), emissiveMap: o.glow ? t : null, emissiveIntensity: o.glow ? 0.9 : 0 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); m.receiveShadow = true; return m;
}

// ---------- stage ----------
// stage({ light:'day', fov:40, bloom, fog:false|[near,far], shadow: 60 (shadow box half size), ground: false })
export function stage(o = {}) {
  const L = { ...(LIGHTS[o.light] || LIGHTS.day), ...(o.lightOverride || {}) };
  const scene = new THREE.Scene();
  scene.background = canvasTex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, L.sky[0]); gr.addColorStop(0.62, L.sky[1]); gr.addColorStop(1, L.sky[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h); }, { key: 'sky' + L.sky });
  if (L.fog && o.fog !== false) scene.fog = new THREE.Fog(C(L.fog[0]), ...(Array.isArray(o.fog) ? o.fog : [L.fog[1], L.fog[2]]));
  const camera = new THREE.PerspectiveCamera(o.fov || 40, E.W / E.H, 0.1, 2000);
  const hemi = new THREE.HemisphereLight(C(L.hemi[0]), C(L.hemi[1]), L.hemi[2]); scene.add(hemi);
  const sun = new THREE.DirectionalLight(C(L.sun[0]), L.sun[1]); sun.castShadow = true;
  const sdir = new THREE.Vector3(...L.sun[2]).normalize();
  const ss = o.shadow || 34, sres = o.shadowRes || Q().shadowRes; sun.shadow.mapSize.set(sres, sres);
  Object.assign(sun.shadow.camera, { left: -ss, right: ss, top: ss, bottom: -ss, near: 1, far: 400 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.04; sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  // sky dressing: stars / clouds (cheap, far away)
  if (L.stars) { const r = rng(9), n = L.stars, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const th = r() * Math.PI * 2, ph = Math.acos(r() * 0.95), R0 = 800; pos.set([Math.sin(ph) * Math.cos(th) * R0, Math.cos(ph) * R0 * 0.9 + 40, Math.sin(ph) * Math.sin(th) * R0], i * 3); } const gm = new THREE.BufferGeometry(); gm.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const st = new THREE.Points(gm, new THREE.PointsMaterial({ color: '#ffffff', size: 2.2, sizeAttenuation: false, fog: false })); scene.add(st); }
  if (L.clouds && o.clouds !== false) scene.add(clouds(o.seed || 3));
  const w = Math.round(E.W * E.PX), h = Math.round(E.H * E.PX);
  const bloomK = o.bloom ?? L.bloom ?? 0.2;
  let composer = null, bloom = null;
  if (bloomK > 0.01 && Q().bloom) {
    composer = new EffectComposer(R, new THREE.WebGLRenderTarget(w, h, { samples: o.msaa ?? Q().msaa, type: THREE.HalfFloatType }));
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(Math.round(w / 2), Math.round(h / 2)), bloomK, 0.45, 0.82); composer.addPass(bloom); composer.addPass(new OutputPass());
  }
  const focus = new THREE.Vector3();
  const api = {
    scene, camera, composer, sun, hemi, L, bloom, sunDir: sdir,
    add: (...objs) => { objs.flat().forEach(ob => ob && scene.add(ob)); return objs[0]; },
    // keep the shadow box centred on what the camera looks at
    focusShadow(p) { focus.copy(p); sun.target.position.copy(p); sun.position.copy(p).addScaledVector(sdir, 150); sun.target.updateMatrixWorld(); },
    render() { R.toneMappingExposure = L.exposure ?? 1; if (composer) composer.render(); else R.render(scene, camera); },
    dispose() { scene.traverse(x => { if (x.geometry && !x.geometry.__shared) x.geometry.dispose(); }); composer?.renderTarget1?.dispose(); composer?.renderTarget2?.dispose(); },
  };
  if (o.ground !== false && o.groundColor) scene.add(ground(2000, 2000, o.groundColor));
  return api;
}

// puffy blocky clouds high in the sky
export function clouds(seed = 3, n = 14) {
  const r = rng(seed), g = new THREE.Group(), m = plastic('#ffffff', { rough: 1, emissive: '#ffffff', emissiveIntensity: 0.35 });
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = 260 + r() * 260, c = new THREE.Group();
    for (let k = 0; k < 4; k++) { const b = part(18 + r() * 22, 6 + r() * 6, 14 + r() * 14, m, [(k - 1.5) * 14 + r() * 6, r() * 5, r() * 8 - 4], { round: 2.5, cast: false }); b.receiveShadow = false; c.add(b); }
    c.position.set(Math.cos(a) * d, 90 + r() * 70, Math.sin(a) * d); c.lookAt(0, c.position.y, 0); g.add(c);
  }
  return g;
}
