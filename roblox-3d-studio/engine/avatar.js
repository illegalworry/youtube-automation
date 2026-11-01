// engine/avatar.js — procedural Roblox-style blocky avatar (R15-like: torso, head, upper/lower arms, upper/lower legs).
// makeAvatar(look) -> avatar { root, setPose(pose), setFace(expr, mouth, blink), hold(item, hand), headWorld(), ... }
//
// look = {
//   skin: '#f5cd30',  face: 'smile',  scale: 1,  faceInk: '#141414', blush: false,
//   shirt: { color, style: 'tshirt|hoodie|jacket|suit|stripes|polo|sweater|tank|dress|uniform|armor|plain', color2, sleeves: 'long|short|none', print: '★' | 'TEXT' },
//   pants: { color, style: 'pants|shorts|skirt', shoes: '#222' },
//   hair:  { style: 'short|spiky|long|ponytail|bob|bangs|mohawk|afro|buns|curly|emo|pigtails|slick|bald', color },
//   hat:   { type: 'cap|capBack|beanie|tophat|crown|cowboy|party|hardhat|knight|headphones|horns|halo|bandana|chef|police|wizard|catEars|bunnyEars|viking', color },
//   acc:   ['glasses' | 'shades' | 'backpack' | 'cape' | 'wings' | 'scarf' | 'necklace' | 'belt' | {type, color}],
//   hold:  'sword' | {item:'phone', hand:'L'}            (item held from the start; acts can change it)
// }
// Pose convention (degrees): body/torso/head [pitch, yaw, roll]; arm*/leg* [pitch (+ = forward), yaw, roll (+ = outward)];
// elbow*/knee* = bend (+). air = feet height above the ground. Feet are auto-grounded every frame.
import { THREE, part, ball, cyl, cone, plastic, neon, canvasTex, prep, D2R, RoundedBoxGeometry } from './r3d.js';
import { faceTexture, FACE_W, FACE_H } from './faces.js';
import { shade, rng } from './core.js';
import { makeItem } from './items.js';

export const REST = { body: [0, 0, 0], torso: [0, 0, 0], head: [0, 0, 0], armL: [0, 0, 4], armR: [0, 0, 4], elbowL: 6, elbowR: 6, legL: [0, 0, 1], legR: [0, 0, 1], kneeL: 2, kneeR: 2, air: 0, sway: [0, 0], cape: 6 };

// ---------- clothing textures: vertical colour bands on the 4 side faces ----------
function bandsTex(bands, o = {}) {   // bands: [[from, to, colour], ...] from top (0) to bottom (1)
  return canvasTex(64, 128, (g, w, h) => {
    for (const [a, b, c] of bands) { g.fillStyle = c; g.fillRect(0, Math.floor(a * h), w, Math.ceil((b - a) * h) + 1); }
    for (let i = 1; i < bands.length; i++) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, bands[i][0] * h - 2, w, 3); }
    if (o.stripes) { g.fillStyle = o.stripes; for (let y = 0; y < (o.stripeTo ?? 1) * h; y += 22) g.fillRect(0, y, w, 9); }
  }, { key: 'bands' + JSON.stringify(bands) + (o.stripes || '') + (o.stripeTo || '') });
}
function boxMats(side, top, bottom, front, back) {   // BoxGeometry face order: +x, -x, +y, -y, +z(front), -z(back)
  return [side, side, top, bottom, front || side, back || side];
}
const mt = (c) => plastic(c);
const tmat = (tex) => { const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 }); return m; };

function torsoTex(sh, pants, skin, front) {
  const c = sh.color || '#2d7be0', c2 = sh.color2 || shade(c, 0.35), st = sh.style || 'tshirt', pc = pants?.style === 'skirt' || st === 'dress' ? null : (pants?.color || '#2b2f3a');
  return canvasTex(256, 256, (g, W, H) => {
    g.fillStyle = c; g.fillRect(0, 0, W, H);
    const dk = shade(c, -0.22), lt = shade(c, 0.18);
    if (st === 'stripes') { g.fillStyle = c2; for (let y = 10; y < H; y += 40) g.fillRect(0, y, W, 18); }
    if (st === 'sweater') { g.strokeStyle = dk; g.lineWidth = 3; for (let y = 30; y < H - 30; y += 24) { g.beginPath(); for (let x = 0; x <= W; x += 16) g.lineTo(x, y + ((x / 16) % 2 ? 8 : 0)); g.stroke(); } }
    if (st === 'tank' && front) { g.fillStyle = skin; g.beginPath(); g.ellipse(W / 2, 0, W * 0.2, H * 0.14, 0, 0, 7); g.fill(); g.fillRect(0, 0, W * 0.12, H * 0.25); g.fillRect(W * 0.88, 0, W * 0.12, H * 0.25); }
    if (front) {
      if (st === 'tshirt' || st === 'stripes' || st === 'dress' || st === 'plain') { g.fillStyle = skin; g.beginPath(); g.ellipse(W / 2, 0, W * 0.16, H * 0.09, 0, 0, 7); g.fill(); g.strokeStyle = dk; g.lineWidth = 6; g.beginPath(); g.ellipse(W / 2, 0, W * 0.16, H * 0.09, 0, 0, Math.PI); g.stroke(); }
      if (st === 'hoodie') { g.fillStyle = dk; g.beginPath(); g.moveTo(W * 0.22, H * 0.62); g.lineTo(W * 0.78, H * 0.62); g.lineTo(W * 0.85, H * 0.86); g.lineTo(W * 0.15, H * 0.86); g.fill(); g.strokeStyle = '#f2f2f2'; g.lineWidth = 5; g.beginPath(); g.moveTo(W * 0.42, H * 0.04); g.lineTo(W * 0.4, H * 0.3); g.moveTo(W * 0.58, H * 0.04); g.lineTo(W * 0.6, H * 0.3); g.stroke(); g.fillStyle = dk; g.beginPath(); g.ellipse(W / 2, 0, W * 0.28, H * 0.12, 0, 0, Math.PI); g.fill(); }
      if (st === 'jacket') { g.fillStyle = c2; g.beginPath(); g.moveTo(W * 0.36, 0); g.lineTo(W * 0.64, 0); g.lineTo(W * 0.6, H); g.lineTo(W * 0.4, H); g.fill(); g.fillStyle = dk; g.fillRect(W * 0.355, 0, 7, H); g.fillRect(W * 0.62, 0, 7, H); g.fillStyle = lt; g.beginPath(); g.moveTo(W * 0.2, 0); g.lineTo(W * 0.36, 0); g.lineTo(W * 0.38, H * 0.25); g.fill(); g.beginPath(); g.moveTo(W * 0.8, 0); g.lineTo(W * 0.64, 0); g.lineTo(W * 0.62, H * 0.25); g.fill(); }
      if (st === 'suit') { g.fillStyle = c2 || '#f4f4f4'; g.beginPath(); g.moveTo(W * 0.32, 0); g.lineTo(W * 0.68, 0); g.lineTo(W / 2, H * 0.55); g.fill(); g.fillStyle = sh.tie || '#c4281c'; g.beginPath(); g.moveTo(W * 0.47, H * 0.05); g.lineTo(W * 0.53, H * 0.05); g.lineTo(W * 0.56, H * 0.42); g.lineTo(W / 2, H * 0.5); g.lineTo(W * 0.44, H * 0.42); g.fill(); g.strokeStyle = dk; g.lineWidth = 5; g.beginPath(); g.moveTo(W * 0.32, 0); g.lineTo(W / 2, H * 0.55); g.lineTo(W * 0.68, 0); g.stroke(); for (const y of [0.66, 0.8]) { g.fillStyle = '#111'; g.beginPath(); g.arc(W / 2, H * y, 6, 0, 7); g.fill(); } }
      if (st === 'polo') { g.fillStyle = c2; g.beginPath(); g.moveTo(W * 0.3, 0); g.lineTo(W / 2, H * 0.18); g.lineTo(W * 0.7, 0); g.fill(); for (const y of [0.22, 0.32]) { g.fillStyle = '#eee'; g.beginPath(); g.arc(W / 2, H * y, 5, 0, 7); g.fill(); } }
      if (st === 'uniform') { g.fillStyle = dk; g.fillRect(W * 0.14, H * 0.3, W * 0.24, H * 0.18); g.fillRect(W * 0.62, H * 0.3, W * 0.24, H * 0.18); g.fillStyle = '#f2c94c'; g.beginPath(); g.moveTo(W * 0.74, H * 0.1); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 9 : 22; g.lineTo(W * 0.74 + Math.cos(a) * r, H * 0.18 + Math.sin(a) * r); } g.fill(); g.fillStyle = '#ddd'; g.fillRect(W / 2 - 3, 0, 6, H); }
      if (st === 'armor') { g.fillStyle = lt; g.fillRect(W * 0.1, H * 0.08, W * 0.8, H * 0.38); g.strokeStyle = dk; g.lineWidth = 6; g.strokeRect(W * 0.1, H * 0.08, W * 0.8, H * 0.38); g.fillStyle = dk; for (let y = 0.52; y < 0.86; y += 0.1) g.fillRect(W * 0.12, H * y, W * 0.76, 6); }
      if (sh.print) { const p = String(sh.print); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = sh.printColor || '#ffffff'; g.font = `700 ${p.length <= 2 ? 96 : Math.min(64, 300 / p.length)}px "Fredoka", sans-serif`; g.fillText(p, W / 2, H * 0.45); }
    } else if (st === 'hoodie') { g.fillStyle = dk; g.beginPath(); g.ellipse(W / 2, 0, W * 0.34, H * 0.3, 0, 0, Math.PI); g.fill(); }
    if (pc) { g.fillStyle = pc; g.fillRect(0, H * 0.86, W, H * 0.14); g.fillStyle = shade(pc, -0.3); g.fillRect(0, H * 0.86, W, 5); if (front) { g.fillStyle = '#c9a227'; g.fillRect(W / 2 - 12, H * 0.88, 24, H * 0.09); } }
  }, { key: `torso_${JSON.stringify(sh)}_${JSON.stringify(pants)}_${skin}_${front}` });
}

// ---------- head: rounded cylinder (classic Roblox head) ----------
const HEAD_R = 0.62, HEAD_H = 1.2, HEAD_Y = 0.66;
let _headGeo = null, _faceGeo = null;
function headGeo() {
  if (_headGeo) return _headGeo;
  const r = HEAD_R, h = HEAD_H / 2, c = 0.24, pts = [new THREE.Vector2(0, -h)];
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI / 2; pts.push(new THREE.Vector2(r - c + Math.cos(a) * c, -h + c + Math.sin(a) * c)); }
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI / 2; pts.push(new THREE.Vector2(r - c + Math.cos(a) * c, h - c + Math.sin(a) * c)); }
  pts.push(new THREE.Vector2(0, h));
  _headGeo = new THREE.LatheGeometry(pts, 32); _headGeo.__shared = true; return _headGeo;
}
function faceGeo() {
  if (_faceGeo) return _faceGeo;
  const arcLen = 1.95, hh = HEAD_H - 0.44; _faceGeo = new THREE.CylinderGeometry(HEAD_R + 0.006, HEAD_R + 0.006, hh, 24, 1, true, -arcLen / 2, arcLen); _faceGeo.__shared = true;
  return _faceGeo;
}

// ---------- hair ----------
function hair(h, head, look) {
  const style = h.style || 'short'; if (style === 'bald' || style === 'none') return;
  const m = plastic(h.color || '#3a2312', { rough: 0.7 }), y = HEAD_Y, add = (o) => { o.castShadow = true; head.add(o); return o; };
  const cap = () => add(part(1.36, 0.46, 1.36, m, [0, y + 0.47, -0.02], { round: 0.2 }));
  const back = (len = 0.9) => add(part(1.34, len, 0.42, m, [0, y + 0.55 - len / 2 + 0.05, -0.5], { round: 0.16 }));
  const sides = (len = 0.5) => { add(part(0.16, len, 0.62, m, [0.64, y + 0.5 - len / 2 + 0.05, -0.1], { round: 0.06 })); add(part(0.16, len, 0.62, m, [-0.64, y + 0.5 - len / 2 + 0.05, -0.1], { round: 0.06 })); };
  const fringe = (w = 1.24, tilt = 0) => add(part(w, 0.3, 0.24, m, [0, y + 0.42, 0.55], { round: 0.1, rot: [10, 0, tilt] }));
  switch (style) {
    case 'short': cap(); back(0.6); sides(0.36); fringe(1.2, 6); break;
    case 'slick': cap(); back(0.5); break;
    case 'spiky': cap(); back(0.6); sides(0.34); for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2, rr = i ? 0.38 : 0; const c = add(cone(0.22, 0.6, m, [Math.cos(a) * rr, y + 0.78, Math.sin(a) * rr - 0.05], { seg: 6 })); c.rotation.set(Math.sin(a) * 0.5 - 0.15, 0, -Math.cos(a) * 0.5); } fringe(1.2, -8); break;
    case 'long': cap(); back(1.75); sides(1.25); fringe(1.24, 0); break;
    case 'bob': cap(); back(1.05); sides(0.95); fringe(1.3, 0); break;
    case 'bangs': cap(); back(0.75); sides(0.6); add(part(1.3, 0.42, 0.24, m, [0, y + 0.38, 0.56], { round: 0.1 })); break;
    case 'ponytail': { cap(); back(0.6); sides(0.32); fringe(1.2, 5); const t = add(part(0.42, 1.2, 0.42, m, [0, y - 0.05, -0.86], { round: 0.18, rot: [24, 0, 0] })); add(cyl(0.2, 0.2, 0.14, h.band || '#e8304a', [0, y + 0.45, -0.72], { rot: [24, 0, 0] })); t.name = 'ponytail'; break; }
    case 'pigtails': cap(); back(0.6); for (const s of [-1, 1]) add(part(0.36, 1.0, 0.36, m, [s * 0.8, y + 0.0, -0.25], { round: 0.16, rot: [0, 0, s * 18] })); fringe(1.2, 0); break;
    case 'buns': cap(); back(0.55); fringe(1.2, 0); for (const s of [-1, 1]) add(ball(0.33, m, [s * 0.46, y + 0.8, -0.12])); break;
    case 'mohawk': for (let i = 0; i < 6; i++) add(part(0.22, 0.6 - Math.abs(i - 2.5) * 0.06, 0.26, m, [0, y + 0.82, 0.55 - i * 0.23], { round: 0.06 })); break;
    case 'afro': add(ball(0.98, m, [0, y + 0.42, -0.12], { scale: [1, 0.88, 1], seg: 18 })); break;
    case 'curly': cap(); { const r = rng(5); for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; add(ball(0.24 + r() * 0.08, m, [Math.cos(a) * 0.6, y + 0.45 + r() * 0.3, Math.sin(a) * 0.6 - 0.06], { seg: 10 })); } } break;
    case 'emo': cap(); back(0.9); sides(0.7); add(part(1.0, 0.75, 0.24, m, [0.18, y + 0.22, 0.57], { round: 0.1, rot: [6, 0, -14] })); break;
    default: cap(); back(0.6);
  }
}

// ---------- hats ----------
function hat(h, head) {
  const type = typeof h === 'string' ? h : h.type, c = (typeof h === 'object' && h.color) || '#c4281c', m = plastic(c), y = HEAD_Y, add = (o) => { o.castShadow = true; head.add(o); return o; };
  const dome = (r = 0.72, sy = 0.62, yy = y + 0.42, mm = m) => { const d = add(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mm)); d.scale.y = sy; d.position.y = yy; return d; };
  switch (type) {
    case 'cap': dome(); add(part(1.0, 0.07, 0.75, m, [0, y + 0.44, 0.78], { round: 0.03, rot: [-6, 0, 0] })); break;
    case 'capBack': dome(); add(part(1.0, 0.07, 0.75, m, [0, y + 0.44, -0.78], { round: 0.03, rot: [6, 0, 0] })); break;
    case 'beanie': dome(0.71, 0.85, y + 0.32); add(cyl(0.72, 0.72, 0.24, shade(c, -0.15), [0, y + 0.34, 0])); add(ball(0.2, shade(c, 0.4), [0, y + 0.98, 0])); break;
    case 'tophat': add(cyl(0.95, 0.95, 0.06, m, [0, y + 0.62, 0], { seg: 28 })); add(cyl(0.52, 0.52, 1.0, m, [0, y + 1.14, 0], { seg: 24 })); add(cyl(0.53, 0.53, 0.16, '#c4281c', [0, y + 0.72, 0], { seg: 24 })); break;
    case 'crown': { const g = plastic('#f2c22e', { metal: 0.6, rough: 0.3 }); add(cyl(0.56, 0.56, 0.32, g, [0, y + 0.74, 0], { seg: 20 })); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; add(cone(0.11, 0.32, g, [Math.cos(a) * 0.5, y + 1.05, Math.sin(a) * 0.5], { seg: 4 })); add(ball(0.06, i % 2 ? '#e8304a' : '#2d7be0', [Math.cos(a) * 0.57, y + 0.74, Math.sin(a) * 0.57])); } break; }
    case 'cowboy': add(cyl(1.2, 1.2, 0.07, m, [0, y + 0.58, 0], { seg: 28 })); add(cyl(0.48, 0.58, 0.6, m, [0, y + 0.9, 0], { seg: 20 })); add(cyl(0.59, 0.59, 0.12, shade(c, -0.4), [0, y + 0.66, 0], { seg: 20 })); break;
    case 'party': { const k = add(cone(0.42, 1.1, m, [0, y + 1.1, 0], { seg: 18 })); k.rotation.z = 0.15; add(ball(0.13, '#ffd23f', [-0.08, y + 1.66, 0])); break; }
    case 'hardhat': dome(0.74, 0.7, y + 0.4, plastic(c === '#c4281c' ? '#f5c518' : c)); add(cyl(0.88, 0.88, 0.06, plastic(c === '#c4281c' ? '#f5c518' : c), [0, y + 0.42, 0.06], { seg: 28 })); break;
    case 'knight': { const s = plastic('#b8bec6', { metal: 0.7, rough: 0.35 }); add(part(1.5, 1.42, 1.5, s, [0, y + 0.04, 0], { round: 0.3 })); add(part(1.0, 0.1, 0.1, '#111', [0, y + 0.12, 0.76], { round: 0.02 })); add(cone(0.12, 0.6, '#c4281c', [0, y + 1.0, 0])); break; }
    case 'headphones': add(new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.07, 8, 24, Math.PI), m)).position.y = y + 0.05; for (const s of [-1, 1]) add(cyl(0.26, 0.26, 0.22, shade(c, -0.3), [s * 0.72, y + 0.0, 0], { rot: [0, 0, 90] })); break;
    case 'horns': for (const s of [-1, 1]) { const k = add(cone(0.15, 0.6, '#f2e6c8', [s * 0.48, y + 0.85, 0.05], { seg: 10 })); k.rotation.z = -s * 0.5; } break;
    case 'halo': { const ring = add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 32), neon('#ffe680', 2.2))); ring.rotation.x = Math.PI / 2; ring.position.y = y + 1.05; ring.castShadow = false; break; }
    case 'bandana': case 'ninja': add(cyl(0.645, 0.645, 0.2, m, [0, y + 0.3, 0], { seg: 28 })); for (const s of [-1, 1]) add(part(0.12, 0.5, 0.1, m, [s * 0.12, y + 0.08, -0.7], { rot: [20, 0, s * 15], round: 0.03 })); break;
    case 'chef': add(cyl(0.64, 0.64, 0.4, '#ffffff', [0, y + 0.72, 0])); add(ball(0.72, '#ffffff', [0, y + 1.1, 0], { scale: [1, 0.6, 1] })); break;
    case 'police': dome(0.7, 0.45, y + 0.48, plastic('#1b2a55')); add(cyl(0.74, 0.74, 0.22, '#1b2a55', [0, y + 0.6, 0])); add(part(0.9, 0.06, 0.5, '#111', [0, y + 0.5, 0.7], { round: 0.02 })); add(part(0.22, 0.24, 0.05, '#f2c22e', [0, y + 0.66, 0.74], { round: 0.03 })); break;
    case 'wizard': add(cyl(1.05, 1.05, 0.06, m, [0, y + 0.6, 0], { seg: 28 })); { const k = add(cone(0.6, 1.6, m, [0, y + 1.42, 0], { seg: 20 })); k.rotation.x = -0.15; } break;
    case 'viking': dome(0.72, 0.7, y + 0.38, plastic('#8a8f96', { metal: 0.6, rough: 0.4 })); for (const s of [-1, 1]) { const k = add(cone(0.14, 0.7, '#f2e6c8', [s * 0.8, y + 0.8, 0], { seg: 10 })); k.rotation.z = -s * 0.9; } break;
    case 'catEars': case 'bunnyEars': for (const s of [-1, 1]) { if (type === 'catEars') add(cone(0.22, 0.42, m, [s * 0.4, y + 0.82, 0], { seg: 4 })); else add(part(0.24, 0.9, 0.12, m, [s * 0.28, y + 1.1, 0], { round: 0.11, rot: [0, 0, -s * 8] })); } break;
  }
}

// ---------- accessories ----------
function accessory(a, rig) {
  const type = typeof a === 'string' ? a : a.type, c = (typeof a === 'object' && a.color) || null, add = (p, o) => { o.castShadow = true; p.add(o); return o; };
  const y = HEAD_Y;
  switch (type) {
    case 'glasses': { const f = plastic(c || '#151515'); for (const s of [-1, 1]) { const r = add(rig.head, new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 6, 16), f)); r.position.set(s * 0.24, y + 0.12, 0.64); } add(rig.head, part(0.2, 0.04, 0.04, f, [0, y + 0.14, 0.66], { round: 0.01 })); break; }
    case 'shades': { const f = plastic(c || '#0c0c0c', { rough: 0.2 }); add(rig.head, part(1.0, 0.24, 0.08, f, [0, y + 0.12, 0.64], { round: 0.06 })); break; }
    case 'backpack': add(rig.torso, part(1.5, 1.6, 0.6, plastic(c || '#c4281c'), [0, 1.05, -0.78], { round: 0.2 })); add(rig.torso, part(1.1, 0.6, 0.2, plastic(shade(c || '#c4281c', -0.2)), [0, 0.7, -1.1], { round: 0.08 })); break;
    case 'cape': { const p = new THREE.Group(); p.position.set(0, 1.95, -0.55); const cl = part(2.0, 3.4, 0.08, plastic(c || '#c4281c', { side: THREE.DoubleSide }), [0, -1.7, 0], { round: 0.03 }); p.add(cl); rig.torso.add(p); rig.cape = p; break; }
    case 'wings': for (const s of [-1, 1]) { const w = add(rig.torso, part(2.2, 1.4, 0.08, plastic(c || '#ffffff'), [s * 1.3, 1.5, -0.65], { round: 0.04, rot: [0, s * -25, s * 20] })); w.name = 'wing'; } break;
    case 'scarf': add(rig.torso, new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.17, 8, 20), plastic(c || '#e8304a'))).rotation.x = Math.PI / 2; rig.torso.children[rig.torso.children.length - 1].position.y = 1.98; add(rig.torso, part(0.32, 0.9, 0.14, plastic(c || '#e8304a'), [0.4, 1.45, 0.56], { round: 0.05 })); break;
    case 'necklace': add(rig.torso, new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 6, 20), plastic(c || '#f2c22e', { metal: 0.8, rough: 0.3 }))).rotation.x = Math.PI / 2 - 0.5; rig.torso.children[rig.torso.children.length - 1].position.set(0, 1.75, 0.3); break;
    case 'belt': add(rig.torso, part(2.06, 0.18, 1.06, plastic(c || '#2a1a10'), [0, 0.12, 0], { round: 0.04 })); break;
  }
}

// ---------- the avatar ----------
export function makeAvatar(look = {}, opts = {}) {
  const skin = look.skin || '#f5cd30', sh = { color: '#2d7be0', style: 'tshirt', ...(look.shirt || {}) }, pa = { color: '#2b2f3a', style: 'pants', shoes: '#1d1d1f', ...(look.pants || {}) };
  if (sh.style === 'dress') pa.style = 'skirt';
  const sleeves = sh.sleeves || ({ hoodie: 'long', jacket: 'long', suit: 'long', sweater: 'long', uniform: 'long', armor: 'long', tank: 'none' }[sh.style] || 'short');
  const root = new THREE.Group(), hips = new THREE.Group(), torso = new THREE.Group(), neck = new THREE.Group();
  root.add(hips); hips.add(torso); torso.add(neck); hips.position.y = 2;
  const parts = [];   // [mesh, halfExtents] for grounding + oof
  const reg = (m, hx, hy, hz) => { m.castShadow = true; m.receiveShadow = true; parts.push({ m, h: [hx, hy, hz] }); return m; };
  // torso
  const shirtSide = tmat(torsoTex(sh, pa, skin, false)), shirtFront = tmat(torsoTex(sh, pa, skin, true));
  const tMesh = reg(new THREE.Mesh(new RoundedBoxGeometry(2, 2, 1, 2, 0.1), boxMats(shirtSide, mt(sh.color), mt(pa.style === 'skirt' ? sh.color : pa.color), shirtFront, shirtSide)), 1, 1, 0.5);
  tMesh.position.y = 1; torso.add(tMesh);
  // head
  const headMat = plastic(skin);
  const hMesh = reg(new THREE.Mesh(headGeo(), headMat), HEAD_R, HEAD_H / 2, HEAD_R); hMesh.position.y = HEAD_Y; neck.add(hMesh);
  neck.position.y = 2.0; const neckStub = cyl(0.3, 0.3, 0.2, headMat, [0, 0.02, 0]); neck.add(neckStub);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture(look.face || 'smile', 0, false, { ink: look.faceInk, blush: look.blush }), transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false });
  const fMesh = new THREE.Mesh(faceGeo(), faceMat); fMesh.position.y = HEAD_Y; neck.add(fMesh);
  // limbs: shoulder -> upper arm -> elbow -> lower arm ; hip -> upper leg -> knee -> lower leg
  const sleeveTop = sleeves === 'none' ? [[0, 1, skin]] : sleeves === 'short' ? [[0, 0.6, sh.color], [0.6, 1, skin]] : [[0, 1, sh.color]];
  const sleeveLow = sleeves === 'long' ? [[0, 0.72, sh.color], [0.72, 1, skin]] : [[0, 1, skin]];
  const stripes = sh.style === 'stripes' ? sh.color2 || shade(sh.color, 0.35) : null;
  const upArmMat = tmat(bandsTex(sleeveTop, { stripes: sleeves !== 'none' ? stripes : null, stripeTo: sleeves === 'short' ? 0.6 : 1 })), loArmMat = tmat(bandsTex(sleeveLow, { stripes: sleeves === 'long' ? stripes : null, stripeTo: 0.72 }));
  const shorts = pa.style === 'shorts', skirt = pa.style === 'skirt';
  const upLegMat = tmat(bandsTex(skirt ? [[0, 1, skin]] : shorts ? [[0, 0.62, pa.color], [0.62, 1, skin]] : [[0, 1, pa.color]]));
  const loLegMat = tmat(bandsTex(skirt || shorts ? [[0, 0.68, skin], [0.68, 1, pa.shoes]] : [[0, 0.68, pa.color], [0.68, 1, pa.shoes]]));
  const limbGeoU = new RoundedBoxGeometry(0.98, 1.06, 0.98, 2, 0.1), limbGeoL = new RoundedBoxGeometry(0.96, 1.0, 0.96, 2, 0.1);
  const joints = {};
  for (const [side, sx] of [['L', 1], ['R', -1]]) {
    const sho = new THREE.Group(); sho.position.set(1.5 * sx, 1.88, 0); sho.rotation.order = 'XZY'; torso.add(sho);
    const ua = reg(new THREE.Mesh(limbGeoU, boxMats(upArmMat, mt(sleeves === 'none' ? skin : sh.color), upArmMat)), 0.49, 0.53, 0.49); ua.position.y = -0.42; sho.add(ua);
    const elb = new THREE.Group(); elb.position.y = -0.92; sho.add(elb);
    const la = reg(new THREE.Mesh(limbGeoL, boxMats(loArmMat, loArmMat, mt(skin))), 0.48, 0.5, 0.48); la.position.y = -0.5; elb.add(la);
    const hand = new THREE.Group(); hand.position.set(0, -0.92, 0.05); elb.add(hand);
    const hip = new THREE.Group(); hip.position.set(0.5 * sx, 0, 0); hip.rotation.order = 'XZY'; hips.add(hip);
    const ul = reg(new THREE.Mesh(limbGeoU, boxMats(upLegMat, mt(pa.color), upLegMat)), 0.49, 0.53, 0.49); ul.position.y = -0.5; hip.add(ul);
    const kn = new THREE.Group(); kn.position.y = -1.0; hip.add(kn);
    const ll = reg(new THREE.Mesh(limbGeoL, boxMats(loLegMat, mt(pa.color), mt(pa.shoes))), 0.48, 0.5, 0.48); ll.position.y = -0.5; kn.add(ll);
    joints['arm' + side] = sho; joints['elbow' + side] = elb; joints['hand' + side] = hand; joints['leg' + side] = hip; joints['knee' + side] = kn;
  }
  if (skirt) { const sk = prep(new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.45, 1.1, 20, 1, true), plastic(sh.color2 || sh.color, { side: THREE.DoubleSide }))); sk.position.y = -0.45; hips.add(sk); }
  torso.rotation.order = 'YXZ'; neck.rotation.order = 'YXZ'; hips.rotation.order = 'YXZ';
  const rig = { root, hips, torso, head: neck, cape: null };
  if (look.hair !== null) hair(look.hair || { style: 'short' }, neck, look);
  if (look.hat) hat(look.hat, neck);
  for (const a of look.acc || []) accessory(a, rig);
  const s = look.scale || 1; root.scale.setScalar(s);

  // ---- state
  let curFace = '', heldItems = { L: null, R: null };
  const faceStyle = { ink: look.faceInk, blush: look.blush };
  const v = new THREE.Vector3(), corners = [];
  for (const p of parts) for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push([p.m, new THREE.Vector3(x * p.h[0] * 0.92, y * p.h[1], z * p.h[2] * 0.92)]);
  // rest positions of the parts in root space (for "oof")
  const restInfo = parts.map((p, i) => ({ p, i }));
  const setRot = (obj, a, sx = 1) => { obj.rotation.x = -(a[0] || 0) * D2R; obj.rotation.y = (a[1] || 0) * D2R * sx; obj.rotation.z = (a[2] || 0) * D2R * sx; };

  const av = {
    root, rig, joints, look, parts, height: 5 * s,
    setPose(P) {
      P = { ...REST, ...P };
      hips.rotation.set((P.body[0]) * D2R, P.body[1] * D2R, -P.body[2] * D2R);
      torso.rotation.set(P.torso[0] * D2R, P.torso[1] * D2R, -P.torso[2] * D2R);
      neck.rotation.set(P.head[0] * D2R, P.head[1] * D2R, -P.head[2] * D2R);
      setRot(joints.armL, P.armL, 1); setRot(joints.armR, P.armR, -1); setRot(joints.legL, P.legL, 1); setRot(joints.legR, P.legR, -1);
      joints.elbowL.rotation.x = -P.elbowL * D2R; joints.elbowR.rotation.x = -P.elbowR * D2R; joints.kneeL.rotation.x = P.kneeL * D2R; joints.kneeR.rotation.x = P.kneeR * D2R;
      if (rig.cape) rig.cape.rotation.x = -(P.cape ?? 6) * D2R;
      for (const p of parts) { p.m.position.copy(p.m.userData.rest || (p.m.userData.rest = p.m.position.clone())); p.m.rotation.set(0, 0, 0); }
      if (P.oof != null) this._oof(P.oof);
      // ground: lowest corner of the body sits at `air` above the root
      hips.position.set(P.sway[0] || 0, 2, P.sway[1] || 0);
      if (P.ground !== false && P.oof == null) {
        root.updateMatrixWorld(true); let minY = 1e9;
        const ry = root.position.y, sc = root.scale.y;
        for (const [m, c] of corners) { v.copy(c).applyMatrix4(m.matrixWorld); if (v.y < minY) minY = v.y; }
        hips.position.y += (P.air || 0) - (minY - ry) / sc;
      } else hips.position.y += P.air || 0;
      return av;
    },
    _oof(tau) {   // Roblox death: parts fly apart, bounce and settle (deterministic)
      const r = rng(31); hips.rotation.set(0, 0, 0); torso.rotation.set(0, 0, 0); neck.rotation.set(0, 0, 0);
      for (const j of Object.values(joints)) j.rotation.set(0, 0, 0);
      const ctr = new THREE.Vector3(0, 3, 0), rest = new THREE.Vector3();
      for (const p of parts) {
        root.updateMatrixWorld(true); p.m.getWorldPosition(rest); root.worldToLocal(rest);
        const dir = rest.clone().sub(ctr); dir.y = 0; if (dir.lengthSq() < 0.01) dir.set(r() - 0.5, 0, r() - 0.5); dir.normalize();
        const sp = 3 + r() * 4, vy = 5 + r() * 5, gsc = 30, tl = (vy + Math.sqrt(vy * vy + 2 * gsc * Math.max(0, rest.y - p.h[1]))) / gsc;
        const tt = Math.min(tau, tl), slide = Math.max(0, Math.min(tau - tl, 0.4)) * sp * 0.4;
        const off = dir.clone().multiplyScalar(sp * tt + slide); off.y = tau < tl ? vy * tau - 0.5 * gsc * tau * tau : (p.h[1] - rest.y);
        p.m.position.add(off);
        const spin = Math.min(tau, tl + 0.3) * (4 + r() * 6); p.m.rotation.set(spin * (r() - 0.5), spin * (r() - 0.5), tau > tl ? Math.PI / 2 * Math.round(spin * (r() - 0.5) / 1.57) * 0 : spin * (r() - 0.5));
        if (tau > tl) { p.m.rotation.x = Math.round(p.m.rotation.x / (Math.PI / 2)) * Math.PI / 2; p.m.rotation.z = Math.round(p.m.rotation.z / (Math.PI / 2)) * Math.PI / 2; }
      }
      fMesh.visible = tau < 0.02; // the decal stays with the head mesh below
      if (tau >= 0.02) { const hm = parts[1].m; if (!hm.userData.face) { const f2 = fMesh.clone(); f2.position.set(0, 0, 0); hm.add(f2); hm.userData.face = f2; } hm.userData.face.visible = true; }
    },
    setFace(expr, mouth = 0, blink = false) {
      const k = `${expr}|${Math.round(Math.min(1, mouth) * 3)}|${blink}`; if (k === curFace) return; curFace = k;
      faceMat.map = faceTexture(expr, mouth, blink, faceStyle); faceMat.needsUpdate = true;
      const f2 = parts[1].m.userData.face; if (f2) f2.material = faceMat;
    },
    hold(item, hand = 'R') {   // item: name | Object3D | null
      const h = joints['hand' + hand]; if (heldItems[hand]) { h.remove(heldItems[hand]); heldItems[hand] = null; }
      if (!item) return null; const obj = typeof item === 'string' ? makeItem(item) : item; h.add(obj); heldItems[hand] = obj; return obj;
    },
    held: (hand = 'R') => heldItems[hand],
    worldPoint(name, out = new THREE.Vector3()) {   // 'head' | 'chest' | 'handL' | 'handR' | 'feet'
      root.updateMatrixWorld(true);
      if (name === 'head') return parts[1].m.getWorldPosition(out);
      if (name === 'chest') return out.set(0, 1.2, 0.5).applyMatrix4(tMesh.matrixWorld);
      if (name === 'handL' || name === 'handR') return joints['hand' + name.slice(-1)].getWorldPosition(out);
      return root.getWorldPosition(out);
    },
  };
  if (look.hold) { const h = typeof look.hold === 'string' ? { item: look.hold } : look.hold; av.hold(h.item, h.hand || 'R'); }
  av.setPose({});
  return av;
}
