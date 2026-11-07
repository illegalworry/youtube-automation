// Strasbourg, 1518: a painted medieval town square, the cathedral, the river Ill and a hill shrine.
// Everything sits on y = 0. Built once; townState() toggles the per-shot props.
import * as THREE from './lib/three.module.js';

const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

export function buildTown({ scene, add, box, tbox, toon, P, M, waterMat, waterNd }) {
  const world = new THREE.Group(); scene.add(world);
  const rx = (a) => a * Math.PI / 180;
  const tex = (c, a = 1, b = 1) => P.tex(c, a, b);

  // ---------- painted textures ----------
  const cobble = (() => { // rounded setts with dark joints
    const [c, g] = cv(512, 512), r = P.rng(71); g.fillStyle = '#5a5046'; g.fillRect(0, 0, 512, 512);
    for (let row = 0; row < 16; row++) for (let col = -1; col < 17; col++) {
      const x = col * 32 + (row % 2) * 16 + (r() - 0.5) * 4, y = row * 32 + (r() - 0.5) * 3, L = 58 + r() * 14, H = 28 + r() * 14;
      g.fillStyle = hsl(H, 14, L); g.beginPath(); g.ellipse(x + 16, y + 16, 13 + r() * 2, 12 + r() * 2, r(), 0, 7); g.fill();
      g.fillStyle = hsl(H, 14, L + 8, .55); g.beginPath(); g.ellipse(x + 13, y + 12, 7, 4, 0, 0, 7); g.fill();
    }
    return c;
  })();
  const grassC = P.grass(6);
  const pinkStone = P.stone(31, 8, 34, 66, 96, 48);
  const quay = P.stone(32, 34, 12, 58, 128, 64);
  const plasterC = (hue, sat, lig, seed) => {
    const [c, g] = cv(256, 256), r = P.rng(seed); g.fillStyle = hsl(hue, sat, lig); g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 46; i++) { g.fillStyle = hsl(hue, sat * 0.8, lig - 4 - r() * 6, .45); g.beginPath(); g.ellipse(r() * 256, r() * 256, 10 + r() * 30, 6 + r() * 16, 0, 0, 7); g.fill(); }
    return c;
  };
  const roofC = P.roof(9);
  // Alsatian facade colours: cream, ochre, salmon, sage, sky, rose (muted, never lemon)
  const FAC = [[42, 52, 82], [36, 58, 70], [14, 50, 74], [95, 22, 70], [205, 30, 76], [350, 34, 78], [28, 30, 80]];
  const facM = FAC.map(([h, s, l], i) => toon({ map: tex(plasterC(h, s, l, 40 + i), 1, 1) }));
  const timber = toon({ color: '#4a3020' }), shutterCols = ['#3f6e52', '#8e3b2c', '#3c5a86', '#6a4a8a'].map((c) => toon({ color: c }));
  const glass = toon({ color: '#2a2a3a' }), roofM = toon({ map: tex(roofC, 2, 2) });
  const cobM = toon({ map: tex(cobble, 60, 60) }), grassM = toon({ map: tex(grassC, 300, 300) });
  const pinkM = toon({ map: tex(pinkStone, 1, 1) }), pinkFlat = toon({ color: '#c98a78' }), quayM = toon({ map: tex(quay, 1, 1) });
  const woodM = M.wood, plankM = toon({ map: tex(P.planks(5), 1, 1) });

  // ---------- ground ----------
  const ground = add(new THREE.PlaneGeometry(4000, 4000), grassM, 0, -0.02, 0, world, { cast: false }); ground.rotation.x = -Math.PI / 2;
  const sq = add(new THREE.PlaneGeometry(120, 120), cobM, -6, 0, 0, world, { cast: false }); sq.rotation.x = -Math.PI / 2;

  // ---------- half-timbered house (front = local +z) ----------
  const houses = [];
  const house = (x, z, w, d, h, rot, seed, opts = {}) => {
    const r = P.rng(seed), g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; world.add(g);
    const fm = facM[seed % facM.length];
    add(tbox(w, h, d, 2.5), fm, 0, h / 2, 0, g);
    // stone plinth
    add(tbox(w + 0.12, 0.7, d + 0.12, 1.5), quayM, 0, 0.35, 0, g);
    const fz = d / 2 + 0.05, floors = Math.max(2, Math.round(h / 3.1)), fh = h / floors;
    // timber frame on the front face
    for (let k = 1; k <= floors; k++) add(box(w + 0.1, 0.22, 0.12), timber, 0, k * fh - 0.11, fz, g, { cast: false });
    const nv = Math.max(2, Math.round(w / 1.6));
    for (let k = 1; k < floors; k++) for (let i = 0; i <= nv; i++) {
      const vx = -w / 2 + 0.11 + i * (w - 0.22) / nv; add(box(0.18, fh, 0.12), timber, vx, k * fh + fh / 2, fz, g, { cast: false });
      if (i < nv && (i + k + seed) % 3 === 0) { // a diagonal brace in some panels
        const pw = (w - 0.22) / nv, L = Math.hypot(pw, fh), b = add(box(0.14, L * 0.92, 0.1), timber, vx + pw / 2, k * fh + fh / 2, fz, g, { cast: false });
        b.rotation.z = ((i + k) % 2 ? 1 : -1) * Math.atan2(pw, fh);
      }
    }
    // windows with shutters on upper floors, door + shop window below
    const sm = shutterCols[seed % shutterCols.length];
    for (let k = 1; k < floors; k++) for (let i = 0; i < nv; i++) {
      const pw = (w - 0.22) / nv, wx = -w / 2 + 0.11 + (i + 0.5) * pw;
      if ((i + k * 2 + seed) % 4 === 3) continue;
      add(box(0.62, 0.85, 0.1), glass, wx, k * fh + fh * 0.52, fz + 0.01, g, { cast: false });
      for (const s of [-1, 1]) add(box(0.3, 0.88, 0.06), sm, wx + s * 0.48, k * fh + fh * 0.52, fz + 0.04, g, { cast: false });
      add(box(0.8, 0.08, 0.2), timber, wx, k * fh + fh * 0.52 - 0.5, fz + 0.06, g, { cast: false });
    }
    const doorX = opts.doorX ?? (r() - 0.5) * (w - 2.2);
    add(box(1.05, 2.05, 0.14), M.door, doorX, 1.02, fz + 0.02, g, { cast: false });
    add(box(1.35, 0.18, 0.18), timber, doorX, 2.12, fz + 0.04, g, { cast: false });
    const sx = doorX + (doorX > 0 ? -1.9 : 1.9); if (Math.abs(sx) < w / 2 - 0.6) add(box(1.3, 1.0, 0.1), glass, sx, 1.45, fz + 0.01, g, { cast: false });
    // steep gable roof (gable faces the square)
    const rh = w * (0.85 + r() * 0.2), sh = new THREE.Shape(); sh.moveTo(-w / 2 - 0.35, 0); sh.lineTo(w / 2 + 0.35, 0); sh.lineTo(0, rh); sh.closePath();
    const rg = new THREE.ExtrudeGeometry(sh, { depth: d + 0.5, bevelEnabled: false }); rg.translate(0, h, -d / 2 - 0.25);
    const uv = rg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2.2, uv.getY(i) / 2.2);
    add(rg, [fm, roofM], 0, 0, 0, g);
    // gable timber + attic window
    add(box(0.16, rh * 0.8, 0.1), timber, 0, h + rh * 0.4, d / 2 + 0.3, g, { cast: false });
    add(box(0.5, 0.6, 0.08), glass, 0.55, h + rh * 0.3, d / 2 + 0.29, g, { cast: false });
    add(box(0.5, 0.6, 0.08), glass, -0.55, h + rh * 0.3, d / 2 + 0.29, g, { cast: false });
    if (r() < 0.6) add(tbox(0.55, 1.6, 0.55, 1), pinkFlat, (r() - 0.5) * w * 0.4, h + rh * 0.62, -d * 0.2, g);
    g.userData.rad = Math.max(w, d) * 0.6; houses.push(g); return g;
  };
  // square edges: north row (front +z), south row (front -z), west (front +x), east (front -x)
  const N = [[-15, 6.0, 11], [-8.6, 6.2, 12.4], [-2.4, 5.6, 10.2], [3.6, 6.0, 12.8], [9.8, 6.0, 11.2], [15.8, 5.6, 12]];
  N.forEach(([x, w, h], i) => house(x, -19, w - 0.15, 6, h, 0, 3 + i, x === -2.4 ? { doorX: -0.6 } : {}));
  const Sx = [[-14, 6.4, 10.5], [-7.6, 6.0, 12.6], [-1.4, 6.2, 11], [4.8, 6.0, 12.2], [10.8, 5.8, 10.4], [16.6, 5.6, 12.2]];
  Sx.forEach(([x, w, h], i) => house(x, 19, w - 0.15, 6, h, Math.PI, 11 + i));
  [[-10, 6, 11.6], [4, 6.2, 12.4], [10.2, 6.0, 10.8]].forEach(([z, w, h], i) => house(22, z, w - 0.15, 6, h, -Math.PI / 2, 21 + i));
  [[-11, 6, 10.8], [11, 6, 11.8]].forEach(([z, w, h], i) => house(-25, z, w - 0.15, 6, h, Math.PI / 2, 31 + i));
  // town hall (west side, z -6..6): arcade + big hip roof
  const hall = new THREE.Group(); hall.position.set(-25, 0, 0); hall.rotation.y = Math.PI / 2; world.add(hall);
  add(tbox(13, 11, 7, 2.5), pinkM, 0, 5.5, 0, hall);
  for (let i = 0; i < 5; i++) { const ax = -5.2 + i * 2.6; add(box(1.7, 3.2, 0.2), glass, ax, 1.6, 3.55, hall, { cast: false }); add(new THREE.CylinderGeometry(0.85, 0.85, 0.2, 16, 1, false, 0, Math.PI), glass, ax, 3.2, 3.55, hall, { cast: false }).rotation.set(Math.PI / 2, 0, Math.PI / 2); }
  for (let i = 0; i < 6; i++) add(box(0.6, 1.3, 0.1), glass, -5.5 + i * 2.2, 6.3, 3.55, hall, { cast: false });
  for (let i = 0; i < 6; i++) add(box(0.6, 1.3, 0.1), glass, -5.5 + i * 2.2, 9.0, 3.55, hall, { cast: false });
  add(box(13.4, 0.3, 0.3), pinkFlat, 0, 4.4, 3.6, hall); add(box(13.4, 0.4, 0.4), pinkFlat, 0, 11, 3.6, hall);
  const hr = add(new THREE.ConeGeometry(8.2, 6.5, 4), roofM, 0, 14.2, 0, hall); hr.rotation.y = Math.PI / 4; hr.scale.set(1.15, 1, 0.62);
  // town-hall banner (Strasbourg: white field, red bend)
  const flagC = (() => { const [c, g] = cv(256, 512); g.fillStyle = '#f1ece2'; g.fillRect(0, 0, 256, 512); g.strokeStyle = '#c0282e'; g.lineWidth = 70; g.beginPath(); g.moveTo(-20, 40); g.lineTo(276, 470); g.stroke(); return c; })();
  const flagM = toon({ map: tex(flagC), side: THREE.DoubleSide }); flagM.map.wrapS = flagM.map.wrapT = THREE.ClampToEdgeWrapping;
  for (const s of [-1, 1]) add(new THREE.PlaneGeometry(1.4, 2.8), flagM, s * 3.9, 7.6, 3.66, hall, { cast: false });

  // filler houses around the square for the aerials (no detail needed)
  { const r = P.rng(55);
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = 32 + r() * 60, x = -6 + Math.cos(a) * d, z = Math.sin(a) * d;
      if (x > 38 && x < 70) continue; if (Math.abs(x) < 16 && z < -40 && z > -125) continue; // river, cathedral
      house(x, z, 5 + r() * 2.5, 6 + r() * 3, 8 + r() * 4, Math.round(r() * 4) * Math.PI / 2, 60 + i);
    } }

  // ---------- cathedral (pink Vosges sandstone, one north tower) ----------
  const cath = new THREE.Group(); cath.position.set(-2, 0, -62); world.add(cath);
  add(tbox(30, 44, 7, 3), pinkM, 0, 22, 0, cath);                                 // west facade
  add(tbox(20, 30, 46, 3), pinkM, 0, 15, -26, cath);                              // nave
  const nr = add(new THREE.ConeGeometry(14, 12, 4), toon({ color: '#5d4a52' }), 0, 36, -26, cath); nr.rotation.y = Math.PI / 4; nr.scale.set(0.75, 1, 2.4);
  add(tbox(11, 30, 7.4, 3), pinkM, -9, 59, 0, cath);                              // tower
  add(new THREE.CylinderGeometry(4.4, 5.6, 14, 8), pinkM, -9, 81, 0, cath);       // octagon
  add(new THREE.ConeGeometry(4.6, 34, 8), pinkFlat, -9, 105, 0, cath);           // spire
  add(new THREE.SphereGeometry(0.8, 8, 6), toon({ color: '#d9b25a' }), -9, 122.4, 0, cath);
  add(tbox(9, 3, 7.2, 3), pinkM, 9, 45.5, 0, cath);                               // unfinished south stump
  const rose = add(new THREE.CircleGeometry(5.2, 32), glass, 0, 27, 3.56, cath, { cast: false });
  add(new THREE.TorusGeometry(5.3, 0.45, 8, 40), pinkFlat, 0, 27, 3.6, cath);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, sp = add(box(0.25, 5, 0.1), pinkFlat, Math.cos(a) * 2.5, 27 + Math.sin(a) * 2.5, 3.62, cath, { cast: false }); sp.rotation.z = a + Math.PI / 2; }
  for (const px of [-8, 0, 8]) { const pw = px ? 3.2 : 4.4; add(box(pw, px ? 6.5 : 8.5, 0.2), glass, px, px ? 3.25 : 4.25, 3.55, cath, { cast: false });
    const gab = new THREE.Shape(); gab.moveTo(-pw / 2 - 0.6, 0); gab.lineTo(pw / 2 + 0.6, 0); gab.lineTo(0, pw * 1.2); gab.closePath(); add(new THREE.ExtrudeGeometry(gab, { depth: 0.6, bevelEnabled: false }), pinkFlat, px, px ? 6.5 : 8.5, 3.5, cath); }
  for (let i = 0; i < 7; i++) add(box(0.5, 12, 0.5), pinkFlat, -13.6 + i * 4.53, 15 + (i % 2) * 6, 3.7, cath);
  for (let i = 0; i < 10; i++) add(box(1.1, 7, 0.1), glass, -12 + (i % 5) * 6, 40 + 0 * i, 3.55, cath, { cast: false }).visible = i < 5;
  for (let i = 0; i < 4; i++) add(box(1.0, 9, 0.1), glass, -11 + (i % 2) * 4, 55 + Math.floor(i / 2) * 12, 3.75, cath, { cast: false });
  for (let i = 0; i < 6; i++) add(box(0.6, 7, 3.2), pinkFlat, 10.3, 9, -6 - i * 7.6, cath);   // buttresses
  for (let i = 0; i < 6; i++) add(box(0.6, 7, 3.2), pinkFlat, -10.3, 9, -6 - i * 7.6, cath);

  // ---------- river Ill with stone quays ----------
  const water = new THREE.Mesh(new THREE.PlaneGeometry(16, 2300), waterMat); water.rotation.x = -Math.PI / 2; water.position.set(54, -1.2, 0);
  water.userData.nd = waterNd; water.receiveShadow = false; scene.add(water);
  for (const s of [-1, 1]) add(tbox(4, 2.4, 600, 2), quayM, 54 + s * 10, -0.9, 0, world);
  const brg = add(tbox(18, 0.6, 5, 2), quayM, 54, 0.1, 30, world);
  // ---------- trees outside ----------
  const tree = (x, z, h = 6) => { const g = new THREE.Group(); g.position.set(x, 0, z); world.add(g); add(new THREE.CylinderGeometry(0.22, 0.3, h * 0.5, 6), M.trunk, 0, h * 0.25, 0, g); const c = add(new THREE.SphereGeometry(1, 12, 9), M.pine, 0, h * 0.6, 0, g); c.scale.set(h * 0.36, h * 0.32, h * 0.36); return g; };
  { const r = P.rng(81); for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, d = 105 + r() * 120; tree(-6 + Math.cos(a) * d, Math.sin(a) * d, 6 + r() * 5); } }
  // far hills + Vosges silhouettes
  { const r = P.rng(82);
    for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, d = 330 + r() * 200; const h = add(new THREE.SphereGeometry(60 + r() * 50, 20, 10), i % 2 ? M.hill : M.hillFar, Math.cos(a) * d, -18, Math.sin(a) * d, world, { cast: false }); h.scale.y = 0.4 + r() * 0.25; }
    for (let i = 0; i < 12; i++) { const a = r() * Math.PI * 2, d = 700 + r() * 200, hh = 90 + r() * 80, r_ = 140 + r() * 70; add(new THREE.ConeGeometry(r_, hh, 7), M.mount, Math.cos(a) * d, hh / 2 - 5, Math.sin(a) * d, world, { cast: false }); } }

  // ---------- square props ----------
  // well
  const well = new THREE.Group(); well.position.set(-9, 0, 7); world.add(well);
  add(new THREE.CylinderGeometry(1.25, 1.35, 1.0, 20), quayM, 0, 0.5, 0, well);
  add(new THREE.CylinderGeometry(1.0, 1.0, 0.05, 20), toon({ color: '#2c4c5c' }), 0, 0.98, 0, well, { cast: false });
  for (const s of [-1, 1]) add(tbox(0.18, 2.6, 0.18, 1), woodM, s * 1.1, 1.3, 0, well);
  const wr = add(new THREE.ConeGeometry(1.8, 1.0, 4), roofM, 0, 3.0, 0, well); wr.rotation.y = Math.PI / 4;
  // market stalls (east side)
  const stall = (x, z, col, seed) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = -Math.PI / 2; world.add(g);
    add(tbox(3, 0.9, 1.2, 1), plankM, 0, 0.45, 0, g); for (const s of [-1, 1]) for (const t of [-1, 1]) add(tbox(0.1, 2.4, 0.1, 1), woodM, s * 1.4, 1.2, t * 0.55, g);
    const [c, gg] = cv(256, 64); for (let i = 0; i < 8; i++) { gg.fillStyle = i % 2 ? '#f1ece0' : col; gg.fillRect(i * 32, 0, 32, 64); }
    const aw = add(box(3.3, 0.08, 1.8), toon({ map: tex(c) }), 0, 2.45, 0.2, g); aw.rotation.x = 0.25;
    for (let i = 0; i < 5; i++) add(new THREE.SphereGeometry(0.16, 8, 6), toon({ color: ['#c24a2c', '#e2a83a', '#7a9a3a'][(i + seed) % 3] }), -1 + i * 0.5, 1.0, 0, g); return g; };
  stall(17, 9, '#3c6aa0', 1); stall(17, 13, '#b8382e', 2);
  // barrels + crates near houses
  const barrel = (x, z) => add(new THREE.CylinderGeometry(0.38, 0.38, 0.9, 12), toon({ color: '#7a5434' }), x, 0.45, z, world);
  [[-17.5, 13.5], [-16.7, 14.2], [13.5, -14.6], [19.5, 15]].forEach(([x, z]) => barrel(x, z));

  // ---------- per-shot props ----------
  // wooden dance stage (built by the council)
  const stage = new THREE.Group(); stage.position.set(10.5, 0, -9.5); world.add(stage);
  add(tbox(8, 1.0, 4.2, 1.2), plankM, 0, 0.5, 0, stage);
  for (const s of [-1, 1]) add(tbox(0.22, 3.6, 0.22, 1), woodM, s * 3.9, 1.8, -2.0, stage);
  { const [c, gg] = cv(256, 64); for (let i = 0; i < 8; i++) { gg.fillStyle = i % 2 ? '#f1d68a' : '#b8382e'; gg.beginPath(); gg.moveTo(i * 32, 0); gg.lineTo(i * 32 + 32, 0); gg.lineTo(i * 32 + 16, 60); gg.fill(); }
    const bunt = add(new THREE.PlaneGeometry(7.8, 0.6), toon({ map: tex(c), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }), 0, 3.3, -2.0, stage, { cast: false }); bunt.userData.ndSkip = true; }
  for (let i = 0; i < 3; i++) add(tbox(1.6, 0.33 * (i + 1), 0.5, 1), plankM, -2.2, 0.165 * (i + 1), 2.35 + (2 - i) * 0.5, stage);
  // council table (in front of the town hall)
  const council = new THREE.Group(); council.position.set(-17.5, 0, 0); world.add(council);
  add(tbox(1.4, 0.95, 5.2, 1), toon({ color: '#2f5a3c' }), 0, 0.475, 0, council);
  add(tbox(1.5, 0.08, 5.3, 1), plankM, 0, 0.99, 0, council);
  const quill = add(new THREE.ConeGeometry(0.05, 0.5, 5), toon({ color: '#f4f1ea' }), 0.2, 1.3, 1.2, council); quill.rotation.z = 0.5;
  const parch = add(box(0.6, 0.02, 0.8), toon({ color: '#efe1bd' }), 0.1, 1.04, 0.4, council, { cast: false });
  // pews in front of the south houses for the yawn ("a quiet room")
  const pews = new THREE.Group(); pews.position.set(2, 0, 14.2); world.add(pews);
  add(tbox(7, 0.8, 0.12, 1), plankM, 0, 0.4, 0, pews); add(tbox(7, 0.1, 0.55, 1), plankM, 0, 0.55, 0.32, pews);
  for (const s of [-1, 1]) add(tbox(0.12, 0.9, 0.62, 1), woodM, s * 3.5, 0.45, 0.3, pews);
  // statue pedestal (Saint Vitus)
  const ped = new THREE.Group(); ped.position.set(-6, 0, -2); world.add(ped);
  add(tbox(1.6, 1.8, 1.6, 1.2), quayM, 0, 0.9, 0, ped); add(tbox(1.9, 0.25, 1.9, 1.2), quayM, 0, 1.9, 0, ped);
  // ---------- the shrine of St Vitus on a hill road (far west, out of town) ----------
  const SHR = new THREE.Vector3(-340, 0, 0);
  const road = add(new THREE.PlaneGeometry(120, 4.4), M.dirt, -290, 0.0, 0, world, { cast: false }); road.rotation.x = -Math.PI / 2;
  const chapel = new THREE.Group(); chapel.position.copy(SHR); chapel.rotation.y = Math.PI / 2; world.add(chapel);
  const white = toon({ map: tex(plasterC(40, 25, 86, 91)) });
  add(tbox(6, 5, 9, 2), white, 0, 2.5, 0, chapel);
  { const sh = new THREE.Shape(); sh.moveTo(-3.4, 0); sh.lineTo(3.4, 0); sh.lineTo(0, 3.4); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: 9.6, bevelEnabled: false }); g.translate(0, 5, -4.8); add(g, [white, roofM], 0, 0, 0, chapel); }
  add(tbox(1.8, 4, 1.8, 2), white, 0, 9.4, 3.6, chapel); const sp = add(new THREE.ConeGeometry(1.5, 3, 4), roofM, 0, 12.9, 3.6, chapel); sp.rotation.y = Math.PI / 4;
  add(box(1.5, 2.6, 0.12), M.door, 0, 1.3, 4.52, chapel, { cast: false });
  add(new THREE.CircleGeometry(0.6, 20), glass, 0, 3.6, 4.52, chapel, { cast: false });
  add(box(0.12, 1.0, 0.1), timber, 0, 15, 3.6, chapel); add(box(0.6, 0.12, 0.1), timber, 0, 15.2, 3.6, chapel);
  { const r = P.rng(93); for (let i = 0; i < 40; i++) { const x = -235 - r() * 130, z = (r() < 0.5 ? -1 : 1) * (5 + r() * 40); if (Math.hypot(x - SHR.x, z) < 9) continue; tree(x, z, 5 + r() * 5); } }
  for (let i = 0; i < 6; i++) { const h = add(new THREE.SphereGeometry(50, 20, 10), i % 2 ? M.hill : M.hillFar, -420 - i * 30, -20, -90 + i * 36, world, { cast: false }); h.scale.y = 0.6; }

  const state = (W, f) => {
    stage.visible = !!W.stage; council.visible = !!W.council; pews.visible = !!W.pews; ped.visible = !!W.pedestal;
    waterMat.uniforms.t.value = f / 30;
  };
  return { state, houses, stage, SHR };
}
