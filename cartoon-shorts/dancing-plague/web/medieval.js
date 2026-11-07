
// ---------------- Strasbourg 1518 cast + props (our own designs), appended after roman.js ----------------
const LINEN = "#f6f1e6";
function coifBehind(p, H, cx, hc, light, thick, ow, col) { // kerchief framing the face, hangs to the shoulders
  const cp = blobPts(cx, hc + 0.12 * H.b, { ...H, a: H.a * 1.16, b: H.b * 1.16, egg: -0.05, asym: 0, noise: 0.004, seed: H.seed + 5 });
  p.shadedFill(cp, col, mul(col, SH_CLOTH), light, H.a * 1.16); p.inkRing(cp, ow * 0.85, thick);
}
function coifFront(p, H, cx, hc, light, thick, ow, col, u) { // the cloth over the crown, a soft fold line on the forehead
  const top = ellPts(cx, hc - 0.28 * H.b, H.a * 1.06, H.b * 0.82, 180, 360, 0, 40);
  top.push([cx + H.a * 1.06, hc - 0.18 * H.b], [cx - H.a * 1.06, hc - 0.18 * H.b]);
  p.shadedFill(top, col, mul(col, SH_CLOTH), light, H.a, 0.35);
  p.poly(top, null, ow * 0.85);
  p.stroke(ellPts(cx, hc - 0.2 * H.b, H.a * 0.8, H.b * 0.12, 200, 340, 0, 16), 1.6 * u, mul(col, [0.75, 0.75, 0.8]));
}
function beretOn(p, H, cx, hc, light, thick, ow, col, u, facing) { // flat 16th-c. bonnet, worn tilted
  const crown = hc - H.b, x = cx + 6 * u * (facing || 0.4);
  const dome = ellPts(x, crown + 0.22 * H.b, H.a * 0.95, H.b * 0.42, 180, 360, -6, 30);
  dome.push([x + H.a * 0.95, crown + 0.26 * H.b], [x - H.a * 0.95, crown + 0.3 * H.b]);
  p.shadedFill(dome, col, mul(col, SH_FELT), light, H.a, 0.4); p.poly(dome, null, ow * 0.85);
  p.ell(x, crown + 0.3 * H.b, H.a * 1.28, H.b * 0.15, mul(col, [0.82, 0.82, 0.86]), ow * 0.85, 0, 360, -6);
}

Object.assign(OUTFITS, {
  // Frau Troffea: mustard dress, linen apron + coif
  troffea: { tunic: "#c9943a", dress: "#c9943a", apron: LINEN, coif: LINEN, skin: "#f5d2ae", dressLen: 0.55, laces: "#5a3b2a" },
  wifeA: { tunic: "#3f6f9e", dress: "#3f6f9e", apron: "#e8dcc4", coif: LINEN, skin: "#f0c7a2", dressLen: 0.55 },
  wifeB: { tunic: "#8e3b4c", dress: "#8e3b4c", coif: "#e9dcb8", skin: "#d9a07a", dressLen: 0.55 },
  wifeC: { tunic: "#5d7a3a", dress: "#5d7a3a", apron: "#efe6d2", coif: "#f1e6c8", skin: SKIN, dressLen: 0.55 },
  manA: { tunic: "#4f7fb8", skin: "#f5c9a0", cap: "#7a4a2a" },
  manB: { tunic: "#a5522e", skin: "#d9a07a", hair: "#2b211c", moustache: "#2b211c" },
  manC: { tunic: "#5d6b3a", skin: "#ecd0b6", beret: "#3a2c3e", stout: true },
  manD: { tunic: "#6a4a8a", skin: "#c99067", cap: "#c2733a" },
  doctor: { tunic: "#2c2633", dress: "#2c2633", robe: true, fur: "#9a7a58", beret: "#7d1f2a", skin: "#f3d6bb", beard: "#8c8279", dressLen: 0.18 },
  doctor2: { tunic: "#7d1f2a", dress: "#7d1f2a", robe: true, fur: "#a88a62", beret: "#241d29", skin: "#f5c9a0", moustache: "#4a3020", dressLen: 0.18 },
  council: { tunic: "#3a4a7a", dress: "#3a4a7a", robe: true, fur: "#b89a72", beret: "#1f1b26", skin: "#f5c9a0", stout: true, moustache: "#5a3b2a", dressLen: 0.18 },
  council2: { tunic: "#6b2c3a", dress: "#6b2c3a", robe: true, fur: "#b89a72", beret: "#1f1b26", skin: "#ecd0b6", beard: "#d9d3c8", dressLen: 0.18 },
  musician: { tunic: "#c0353a", skin: "#f5c9a0", beret: "#e2b84a", belt: "#3a2a20" },
  musician2: { tunic: "#2f7a6a", skin: "#d9a07a", cap: "#e2b84a", belt: "#3a2a20" },
  pro: { tunic: "#e2b84a", skin: "#ffe2c2", beret: "#2f7a6a", belt: "#7a2a2a" },
  scholar: { tunic: "#3c3a52", dress: "#3c3a52", robe: true, beret: "#141218", skin: "#f3d6bb", beard: "#6a5a4a", dressLen: 0.16 },
  scholar2: { tunic: "#4e2c2c", dress: "#4e2c2c", robe: true, beret: "#141218", skin: "#d9a07a", dressLen: 0.16 },
  guard: { tunic: "#3a4048", skin: "#f5c9a0", cap: "#8e2a2a", moustache: "#3a2a20", belt: "#2a2028" },
  saint: { tunic: "#a9a496", dress: "#a9a496", robe: true, skin: "#c4c0b4", hair: "#8e897c", dressLen: 0.08 },
});

// ---------- props / fx (all on the 600x1000 design canvas) ----------
export const fxHalo = (p) => { p.ell(300, 300, 200, 200, null, 34, 0, 360); const g = p.g; g.save(); g.strokeStyle = "#ffd76a"; g.lineWidth = 22; g.beginPath(); g.ellipse(300, 300, 200, 200, 0, 0, 7); g.stroke(); g.restore(); };
export const fxBread = (p, mold = 0) => {
  p.ell(300, 520, 230, 150, "#9a5a2e", 14);
  p.ell(270, 470, 150, 70, "#b87240", 0);
  for (let i = -2; i <= 2; i++) p.stroke([[300 + i * 70 - 30, 440], [300 + i * 70 + 30, 560]], 10, "#5e3416");
  if (mold > 0) { for (let i = 0; i < 11; i++) { const a = i * 2.39, d = 40 + (i * 37) % 150; p.ell(300 + Math.cos(a) * d, 520 + Math.sin(a) * d * 0.55, (16 + (i % 3) * 10) * mold, (12 + (i % 2) * 8) * mold, i % 3 ? "#5e7a3a" : "#2e3a22", 5); } }
};
export const fxBowl = (p) => {
  p.poly([[110, 470], [490, 470], [430, 620], [170, 620]], "#9a6a3e", 14);
  p.ell(300, 470, 190, 46, "#5a3a1e", 14);
  p.ell(300, 476, 150, 30, "#3a2414", 0);
  p.stroke([[420, 430], [560, 300]], 18, "#c9b48a"); p.ell(575, 285, 34, 22, "#c9b48a", 10, 0, 360, -40);
};
export const fxCoin = (p, t = 0) => { const w = Math.abs(Math.cos(t * Math.PI)) * 150 + 18; p.ell(300, 500, w, 150, "#e6b84a", 14); p.ell(300, 500, w * 0.72, 108, "#f3d27a", 6); p.stroke([[300, 440], [300, 560]], 12, "#b88a2a"); };
export const fxFlask = (p) => {
  p.ell(300, 600, 130, 130, "#d8eef6", 12); p.clip(ellPts(300, 600, 130, 130), () => { p.poly([[150, 620], [450, 620], [450, 760], [150, 760]], "#e9b24a", 0); });
  p.poly([[265, 330], [335, 330], [335, 480], [265, 480]], "#d8eef6", 12); p.stroke(ellPts(250, 560, 40, 70, 200, 260, 0, 8), 12, "#ffffff");
};
export const fxFife = (p) => { p.band([[60, 520], [540, 470]], "#c89a5a", 34, 10, "round"); for (let i = 0; i < 6; i++) p.dot(200 + i * 52, 503 - i * 5, 9, INK); };
export const fxBook = (p) => {
  p.poly([[60, 420], [300, 470], [300, 700], [60, 650]], "#f4ecd8", 12); p.poly([[300, 470], [540, 420], [540, 650], [300, 700]], "#efe4cb", 12);
  for (let k = 0; k < 5; k++) { p.stroke([[100, 480 + k * 34], [270, 518 + k * 34]], 6, "#8a7a62"); p.stroke([[330, 518 + k * 34], [500, 480 + k * 34]], 6, "#8a7a62"); }
};
export const fxFlame = (p, t = 0) => {
  const fl = (x, y, s, col) => { const k = 1 + 0.12 * Math.sin(t * 9 + x); p.poly([[x, y - 170 * s * k], [x + 70 * s, y - 40 * s], [x + 55 * s, y + 40 * s], [x, y + 60 * s], [x - 55 * s, y + 40 * s], [x - 70 * s, y - 40 * s]], col, 10); };
  fl(300, 560, 1.4, "#f2662c"); fl(300, 600, 0.9, "#ffc93c");
};
export const fxSweat = (p) => { p.poly([[300, 380], [360, 520], [300, 580], [240, 520]], "#9fd4ff", 12); };
export const fxCross = (p) => { p.band([[140, 340], [460, 660]], "#d33a2c", 70, 14, "round"); p.band([[460, 340], [140, 660]], "#d33a2c", 70, 14, "round"); };
export const fxShoe = (p) => { p.poly([[120, 560], [380, 540], [480, 600], [470, 660], [120, 660]], "#c4282c", 14); p.stroke([[180, 560], [330, 548]], 8, "#7e1418"); };
export const fxSnap = (p, t) => { // a drumstick breaking in two
  const a = t * 0.9; p.g.save(); p.g.translate(300, 500); p.g.rotate(-a); p.band([[-260, 0], [-10, 0]], "#c89a5a", 30, 9, "round"); p.g.restore();
  p.g.save(); p.g.translate(300, 500); p.g.rotate(a); p.band([[10, 0], [260, 0]], "#c89a5a", 30, 9, "round"); p.g.restore();
};
