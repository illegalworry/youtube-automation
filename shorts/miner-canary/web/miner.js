
// ---------------- Welsh colliery cast, 1920 (our own designs) on the Pen / blob / face helpers above ----------------
FACE.yawn = { eye: ["dash", "dash"], brow: [-2, 2], mouth: "O" };
FACE.sleepy = { eye: ["lid", "lid"], brow: [-1, 1], mouth: "dash" };
FACE.shout = { eye: ["shock", "shock"], brow: [5, -4], mouth: "O" };
FACE.puzzled = { eye: ["dot", "lid"], brow: [-4, 3], mouth: "smirk" };
FACE.sniff = { eye: ["slit", "slit"], brow: [-3, -3], mouth: "dash" };

const LAMP = "#e6b33c", BOOT = "#2a1f1c";
export const MINERS = {
  you: { jacket: "#3e5f8a", pants: "#4a4038", shirt: "#e9dfc7", scarf: "#c8483a", skin: "#ffe2c2", helmet: "new", soot: 0 },
  foreman: { jacket: "#5a4a3a", pants: "#2f2b2a", shirt: "#d9cfb8", scarf: "#3f6a6f", skin: "#ecd0b6", helmet: "old", moustache: "#3a2a20", soot: 1, stout: true },
  crewA: { jacket: "#6a3f2f", pants: "#3a3530", shirt: "#cfc5ad", scarf: "#d9a441", skin: "#f5c9a0", cap: "#4a4a52", soot: 1 },
  crewB: { jacket: "#3f5a3a", pants: "#35302c", shirt: "#d6ccb4", scarf: "#7b5ac9", skin: "#c99067", cap: "#5a4636", soot: 1 },
  crewC: { jacket: "#4a4f63", pants: "#2e2a28", shirt: "#ddd2b9", scarf: "#c25a7a", skin: "#f5c9a0", helmet: "old", soot: 1, moustache: "#6a4a30" },
  inspector: { jacket: "#2f3a52", pants: "#2a2c34", shirt: "#f2efe6", scarf: "#a8282b", skin: "#ecd0b6", cap: "#2a2c34", soot: 0, tie: true },
};

/** pickaxe: handle from the hands (hx,hy) along angle a (rad, 0 = +x, canvas y down), head at the far end */
const pickaxe = (p, hx, hy, a, u, back = 0.18) => {
  const L = 112 * u, dx = Math.cos(a), dy = Math.sin(a);
  const x0 = hx - dx * L * back, y0 = hy - dy * L * back, x1 = hx + dx * L, y1 = hy + dy * L;
  p.band([[x0, y0], [x1, y1]], "#9a6a3a", 5.5 * u, 1.6 * u, "round");
  const nx = -dy, ny = dx, hw = 52 * u;
  const head = [[x1 + nx * hw, y1 + ny * hw], [x1 + nx * hw * 0.45 + dx * 9 * u, y1 + ny * hw * 0.45 + dy * 9 * u], [x1 + dx * 12 * u, y1 + dy * 12 * u], [x1 - nx * hw * 0.45 + dx * 9 * u, y1 - ny * hw * 0.45 + dy * 9 * u], [x1 - nx * hw, y1 - ny * hw]];
  const curvd = []; for (let i = 0; i <= 12; i++) { const t = i / 12 * 2 - 1, k = 1 - t * t; curvd.push([x1 + nx * hw * t + dx * (10 * u * k + 3 * u), y1 + ny * hw * t + dy * (10 * u * k + 3 * u)]); }
  p.band(curvd, "#7d848c", 9 * u, 1.8 * u, "round");
  p.stroke(curvd.slice(2, 7), 2 * u, "#c9d0d8");
  p.ell(x1, y1, 7 * u, 7 * u, "#5c6168", 1.6 * u);
  void head;
};
const sandwich = (p, x, y, u) => {
  p.poly([[x - 26 * u, y - 4 * u], [x + 26 * u, y - 4 * u], [x + 22 * u, y + 16 * u], [x - 22 * u, y + 16 * u]], "#e8c88a", 2.4 * u);
  p.band([[x - 24 * u, y + 2 * u], [x + 24 * u, y + 2 * u]], "#7ab84a", 4 * u, 1 * u, "round");
  p.poly([[x - 28 * u, y - 14 * u], [x + 28 * u, y - 14 * u], [x + 26 * u, y - 2 * u], [x - 26 * u, y - 2 * u]], "#f0d49a", 2.4 * u);
};
/** miner's helmet: hard leather dome + brim + carbide lamp */
const minerHelmet = (p, H, cx, hc, light, thick, ow, kind, u, lampOn = 1) => {
  const col = kind === "new" ? "#3a3f48" : "#2c2a2a", top = hc - H.b * 0.32;
  const dome = ellPts(cx, top, H.a * 1.0, H.b * 0.82, 180, 360, 0, 48);
  p.shadedFill(dome, col, mul(col, [0.55, 0.55, 0.62]), light, H.a, 0.4);
  p.clip(dome, () => {
    p.stroke(ellPts(cx - 24 * u, top - 0.45 * H.b, 0.28 * H.a, 0.2 * H.b, 200, 300, 0, 16), 6 * u, kind === "new" ? "#ffffff66" : "#ffffff30");
    p.band([[cx, top - 0.85 * H.b], [cx, top]], mul(col, [1.25, 1.25, 1.25]), 10 * u, 1.2 * u);
  });
  p.inkRing(dome, ow, thick);
  const brim = ellPts(cx, top + 2 * u, H.a * 1.22, H.b * 0.14, 0, 360, 0, 40);
  p.poly(brim, mul(col, [1.15, 1.15, 1.15]), ow * 0.8);
  // lamp
  const ly = top - 0.42 * H.b;
  p.poly(rrect(cx - 14 * u, ly - 14 * u, cx + 14 * u, ly + 18 * u, 4 * u), "#b08a3a", 2 * u);
  p.ell(cx, ly + 2 * u, 10 * u, 10 * u, lampOn ? "#fff3b0" : "#6a6250", 2 * u);
  if (lampOn) p.ell(cx - 3 * u, ly - 1 * u, 3.5 * u, 3.5 * u, "#ffffff", 0);
};

/** front-facing miner. opts: expr, blink, look, facing, seed, L/R arm poses, swing (0..1 pickaxe), prop, tilt, headTilt, bob, step, lamp */
export const minerFront = (p, key, opts = {}) => {
  const O = typeof key === "string" ? MINERS[key] : key;
  const { expr = "neutral", blink = 0, look = 0, facing = 0, seed = 3, tilt = 0, headTilt = 0, bob = 0, step = 0,
    light = rad(-120), swing = null, lamp = 1, items = {} } = opts;
  let { L = "hang", R = "hang" } = opts;
  const lid = lidOf(blink), skin = O.skin ?? SKIN;
  const H = headBlob(seed, 118, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const torsoL = O.stout ? 1.1 : 1.06, legsL = 1.38, sole = 975;
  const torsoBot = sole - legsL * HH - bob * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b, hipY = torsoBot - 0.12 * HH;
  const thick = thickAngle(light), ow = 5 * u, cx = 300;
  const legCol = mix(O.pants, INK, 0.45), armCol = mix(O.jacket, INK, 0.35);
  p.rot = null;
  // ---- legs ----
  for (const side of [-1, 1]) {
    const ph = step + (side > 0 ? 0.5 : 0), up = step ? Math.max(0, Math.sin(Math.PI * 2 * ph)) * 34 : 0, sw = step ? Math.cos(Math.PI * 2 * ph) * 12 * u : 0;
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u + sw, fy = sole - 4 * u - up;
    p.stroke(curve([hx, hipY], [(hx + fx) / 2 + side * 3 * u, (hipY + fy) / 2], [fx, fy]), 7 * u, legCol);
    const toe = facing ? facing * 14 * u : side * 10 * u;
    p.stroke([[fx - toe * 0.3, fy], [fx + toe, fy + 0.5 * u]], 9 * u + 3, INK);
    p.stroke([[fx - toe * 0.3, fy], [fx + toe, fy + 0.5 * u]], 9 * u, BOOT);
  }
  // ---- upper body ----
  p.rot = tilt ? [rad(tilt), cx, hipY] : null;
  const T = { a: (0.42 * W) / 1.06 * (O.stout ? 1.14 : 1), b: 0.5 * (torsoBot - (chin - 0.25 * HH)), nTop: 2.2, nBot: 2.6, egg: O.stout ? 0.17 : 0.1, asym: 0.04 * facing, rot: 0, noise: 0.006, seed: seed + 7 };
  const tcx = cx + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
  const S = (side) => [tcx + side * 0.85 * T.a, chin + 0.12 * HH];
  const X = (side, k) => tcx + side * (T.a * 1.1 + k * u);
  let pick = null;
  const arm = (side, pose) => {
    const s = S(side);
    switch (pose) {
      case "up": return { pts: [s, [X(side, 14), s[1] - 0.3 * HH], [X(side, 18), s[1] - 0.78 * HH]], front: false };
      case "point": return { pts: [s, [X(side, 28), s[1] - 0.02 * HH], [X(side, 62), s[1] - 0.12 * HH]], front: false, finger: true };
      case "shrug": return { pts: [s, [X(side, 22), s[1] + 0.32 * HH], [X(side, 40), s[1] + 0.05 * HH]], front: false, open: true };
      case "hip": return { pts: [s, [X(side, 22), s[1] + 0.3 * HH], [tcx + side * T.a * 0.95, torsoBot - 0.3 * HH]], front: false };
      case "belly": return { pts: [s, [X(side, 8), s[1] + 0.45 * HH], [tcx + side * 0.25 * T.a, torsoBot - 0.35 * HH]], front: true };
      case "hold": return { pts: [s, [X(side, 10), s[1] + 0.42 * HH], [tcx + side * 0.75 * T.a, s[1] + 0.3 * HH]], front: true };
      case "holdUp": return { pts: [s, [X(side, 18), s[1] + 0.12 * HH], [X(side, 24), s[1] - 0.18 * HH]], front: false };
      case "nose": return { pts: [s, [X(side, 6), s[1] + 0.35 * HH], [cx + side * 10 * u, hc + 0.3 * H.b]], front: true };
      case "mouth": return { pts: [s, [X(side, 6), s[1] + 0.35 * HH], [cx + side * 24 * u, hc + 0.5 * H.b]], front: true };
      case "cheek": return { pts: [s, [X(side, 16), s[1] + 0.05 * HH], [cx + side * (H.a + 2 * u), hc + 0.25 * H.b]], front: false };
      case "run": { const k = Math.sin(Math.PI * 2 * (step + (side > 0 ? 0 : 0.5))); return { pts: [s, [X(side, 8 + 10 * k), s[1] + 0.3 * HH], [X(side, 14 + 22 * k), s[1] + 0.1 * HH - 0.2 * HH * k]], front: false }; }
      case "chest": return { pts: [s, [X(side, 6), s[1] + 0.4 * HH], [tcx + side * 0.15 * T.a, chin + 0.35 * HH]], front: true };
      default: return { pts: [s, [X(side, 4), s[1] + 0.48 * HH], [X(side, 3), chin + 1.04 * HH]], front: false };
    }
  };
  let arms;
  if (swing !== null) { // both hands on the pickaxe; 0 = raised over the shoulder, 1 = struck down toward `facing` side
    const d = facing || 1, k = swing;
    const hand = [cx + d * lerpN(-30, 60, k) * u, lerpN(chin - 0.55 * HH, torsoBot - 0.05 * HH, k)];
    const ang = Math.atan2(1, 0) + d * lerpN(-2.6, -1.0, k) * -1; // radians
    pick = { x: hand[0], y: hand[1], a: d > 0 ? lerpN(-Math.PI * 0.62, Math.PI * 0.18, k) : Math.PI - lerpN(-Math.PI * 0.62, Math.PI * 0.18, k) };
    void ang;
    arms = [-1, 1].map((side) => { const s = S(side); return { pts: [s, [(s[0] + hand[0]) / 2 + side * 10 * u, (s[1] + hand[1]) / 2 + 10 * u], [hand[0] + side * 4 * u, hand[1] + side * 6 * u]], front: true }; });
  } else arms = [arm(-1, L), arm(1, R)];
  const drawArm = (a) => {
    p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 6.5 * u, armCol);
    const [hx, hy] = a.pts[2];
    p.dot(hx, hy, 6 * u);
    if (a.finger) { const dx = a.pts[2][0] - a.pts[1][0], dy = a.pts[2][1] - a.pts[1][1], l = Math.hypot(dx, dy); p.stroke([[hx, hy], [hx + dx / l * 14 * u, hy + dy / l * 14 * u]], 2.8 * u); }
    if (a.open) for (const k of [-1, 0, 1]) p.stroke([[hx, hy], [hx + Math.sign(hx - cx) * 8 * u + k * 4 * u, hy - 10 * u]], 2.4 * u);
  };
  // pickaxe carried on the shoulder / held in a hand
  if (items.pick === "hand") { const h = arm(1, R).pts[2]; pickaxe(p, h[0], h[1] + 4 * u, -Math.PI / 2 - 0.12, u, 0.5); }
  for (const a of arms) if (!a.front) drawArm(a);
  // torso: jacket with shirt V and neckerchief
  p.gradFill(tp, O.jacket, mul(O.jacket, SH_CLOTH), light);
  p.clip(tp, () => {
    p.poly([[tcx - 0.3 * T.a, chin - 0.1 * HH], [tcx + 0.3 * T.a, chin - 0.1 * HH], [tcx + 0.12 * T.a, chin + 0.5 * HH], [tcx - 0.12 * T.a, chin + 0.5 * HH]], O.shirt, 1.6 * u);
    for (const s of [-1, 1]) p.stroke([[tcx + s * 0.32 * T.a, chin - 0.05 * HH], [tcx + s * 0.16 * T.a, chin + 0.62 * HH], [tcx + s * 0.1 * T.a, torsoBot]], 2.2 * u);
    for (let i = 0; i < 3; i++) p.dot(tcx + 0.26 * T.a, chin + (0.62 + i * 0.16) * HH, 2.6 * u, "#2a2420");
    p.band([[tcx - 1.4 * T.a, torsoBot - 0.18 * HH], [tcx + 1.4 * T.a, torsoBot - 0.18 * HH]], "#3a2a1e", 0.06 * HH, 1.2 * u);
    p.poly(rrect(tcx - 7 * u, torsoBot - 0.22 * HH, tcx + 7 * u, torsoBot - 0.14 * HH, 2 * u), "#c9a24a", 1.2 * u);
    if (O.soot) for (let i = 0; i < 6; i++) p.ell(tcx + Math.sin(i * 2.1 + seed) * 0.7 * T.a, tcy + Math.cos(i * 1.3) * 0.6 * T.b, (5 + (i % 3) * 3) * u, (3 + (i % 2) * 2) * u, "#00000030", 0);
  });
  p.inkRing(tp, ow, thick);
  // neckerchief
  p.poly([[tcx - 0.42 * T.a, chin - 0.02 * HH], [tcx + 0.42 * T.a, chin - 0.02 * HH], [tcx + 0.06 * T.a, chin + 0.26 * HH], [tcx - 0.08 * T.a, chin + 0.24 * HH]], O.scarf, 2 * u);
  if (O.tie) p.poly([[tcx - 5 * u, chin], [tcx + 5 * u, chin], [tcx + 7 * u, chin + 0.45 * HH], [tcx, chin + 0.52 * HH], [tcx - 7 * u, chin + 0.45 * HH]], O.scarf, 1.6 * u);
  for (const a of arms) if (a.front) drawArm(a);
  if (pick) pickaxe(p, pick.x, pick.y, pick.a, u);
  // hand-held items (drawn over the hands)
  if (items.sandwich) { const h = arms[0].pts[2]; sandwich(p, h[0], h[1] - 8 * u, u * 1.1); }
  if (items.cage) { const h = (items.cageHand === "R" ? arms[1] : arms[0]).pts[2]; p.g.save(); p.g.translate(h[0], h[1] - 4 * u); p.g.scale(0.42, 0.42); p.g.translate(-300, -330); canaryCage(p, { ...items.cage, bare: true }); p.g.restore(); }
  if (items.box) { const h = arms[0].pts[2], h2 = arms[1].pts[2]; p.g.save(); p.g.translate((h[0] + h2[0]) / 2, (h[1] + h2[1]) / 2 + 30 * u); p.g.scale(0.5, 0.5); p.g.translate(-300, -720); haldaneBox(p, items.box); p.g.restore(); }
  // ---- head ----
  const [cpx, cpy] = rotAbout([cx, chin], rad(tilt), [cx, hipY]);
  const Ah = tilt + headTilt;
  p.rot = Ah ? [rad(Ah), cx, chin, cpx - cx, cpy - chin] : null;
  const hp = blobPts(cx, hc, H);
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  if (O.soot) p.clip(hp, () => { p.ell(cx + 0.5 * H.a, hc + 0.5 * H.b, 0.14 * H.a, 0.05 * H.b, "#2a2a3440", 0, 0, 360, -10); p.ell(cx - 0.25 * H.a, hc - 0.5 * H.b, 0.16 * H.a, 0.05 * H.b, "#2a2a3438", 0, 0, 360, 8); });
  if (O.helmet && !opts.nohelmet) minerHelmet(p, H, cx, hc, light, thick, ow, O.helmet, u, lamp);
  else if (opts.nohelmet) hatOn(p, { hat: "hair", hair: "#5a3b2a", jacket: O.jacket }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.cap) hatOn(p, { hat: "cap", cap: O.cap, jacket: O.jacket }, hp, H, cx, hc, light, seed, facing, false);
  faceFront(p, cx, hc, W, expr, facing, look, lid, !!O.helmet && !opts.nohelmet, skin, O.moustache, !!O.stout);
  p.rot = null;
};
const lerpN = (a, b, t) => a + (b - a) * t;

// ---------------- the canary ----------------
/** canary in her domed brass cage (or bare bird with cage:false). opts: mode sing|idle|sway|droop|out, beak 0..1, tilt deg, puff 0..1, look, blink, cage, bare */
export const canaryCage = (p, o = {}) => {
  const { beak = 0, tilt = 0, puff = 0, blink = 0, eye = "dot", cage = true, perch = true, wing = 0, look = 0, bird = true, glow = 0 } = o;
  const cx = 300, base = 860, top = 360, rw = 175;
  const BR = "#c9973a", BRD = "#8a6224";
  if (cage) {
    // hook + ring
    p.arc(cx, top - 70, 22, 22, 180, 540, 6, INK); p.arc(cx, top - 70, 22, 22, 180, 540, 3.5, BR);
    p.band([[cx, top - 48], [cx, top - 10]], BR, 5, 2);
    // back bars (dimmer)
    for (let i = -6; i <= 6; i++) { const x = cx + i * rw / 6.6, yTop = top + 60 - Math.sqrt(Math.max(0, 1 - (i / 6.6) ** 2)) * 70; p.band([[x, yTop + 40], [x, base - 20]], BRD, 2.4, 1); }
  }
  if (perch) { p.band([[cx - rw + 30, 700], [cx + rw - 30, 700]], "#9a6a3a", 9, 2.5, "round"); }
  if (bird) {
    p.rot = tilt ? [rad(tilt), cx, 700] : null;
    const by = 610 - puff * 6, bx = cx;
    const Y = "#ffd43a", YD = "#e8a82a";
    // tail
    p.poly([[bx + 40, by + 50], [bx + 120, by + 120], [bx + 96, by + 136], [bx + 30, by + 75]], YD, 6);
    // legs
    for (const s of [-1, 1]) p.stroke([[bx + s * 16, by + 70], [bx + s * 18, 698]], 4, "#d9873a");
    // body
    const body = ellPts(bx, by + 18, 78 + puff * 8, 70 + puff * 6, 0, 360, -12, 48);
    p.shadedFill(body, Y, "#d99a20", rad(-120), 75);
    p.inkRing(body, 8, rad(60));
    // chest fluff
    p.clip(body, () => { p.ell(bx - 22, by + 34, 46 + puff * 10, 40 + puff * 8, "#fff3a8", 0); });
    // wing
    const wy = by + 20, wa = -wing * 40;
    p.poly(ellPts(bx + 26, wy, 50, 30, 0, 360, 25 + wa, 30), YD, 6);
    p.stroke([[bx + 10, wy + 6], [bx + 54, wy + 22]], 3, "#b87818");
    // head
    const hx = bx - 26 + look * 6, hy = by - 62;
    const head = ellPts(hx, hy, 56, 52, 0, 360, 0, 40);
    p.shadedFill(head, Y, "#d99a20", rad(-120), 55);
    p.inkRing(head, 8, rad(60));
    // tuft
    p.poly([[hx - 4, hy - 50], [hx + 10, hy - 74], [hx + 16, hy - 48]], Y, 5);
    // beak (open = sing)
    const bk = hx - 54, ba = beak * 26;
    p.poly([[bk + 6, hy - 10], [bk - 34, hy + 2 - ba * 0.4], [bk + 8, hy + 8]], "#f08a2c", 5);
    if (beak > 0.05) { p.poly([[bk + 6, hy + 10], [bk - 26, hy + 14 + ba * 0.8], [bk + 8, hy + 20]], "#e0701c", 5); p.poly([[bk + 4, hy + 8], [bk - 16, hy + 6 + ba * 0.2], [bk + 4, hy + 13]], "#5a1e28", 0); }
    // eye
    const ex = hx - 14, ey = hy - 8;
    if (blink >= 1 || eye === "dash") p.stroke([[ex - 11, ey + 2], [ex + 11, ey + 2]], 6);
    else if (eye === "x") { p.stroke([[ex - 10, ey - 10], [ex + 10, ey + 10]], 6); p.stroke([[ex - 10, ey + 10], [ex + 10, ey - 10]], 6); }
    else if (eye === "spiral") { const pts = []; for (let i = 0; i < 30; i++) { const t = i / 30 * Math.PI * 4, r = 1 + i * 0.45; pts.push([ex + Math.cos(t) * r, ey + Math.sin(t) * r]); } p.stroke(pts, 3.5); }
    else if (eye === "half") { p.ell(ex, ey, 11, 12, INK, 0); p.poly([[ex - 14, ey - 14], [ex + 14, ey - 14], [ex + 14, ey], [ex - 14, ey]], "#ffd43a", 0); p.stroke([[ex - 13, ey], [ex + 13, ey]], 4); }
    else { p.ell(ex, ey, 11, 13, INK, 0); }
    // cheek blush-free; tiny brow when singing proudly
    if (o.proud) p.stroke([[ex - 14, ey - 22], [ex + 10, ey - 26]], 5);
    p.rot = null;
  }
  if (cage) {
    // front bars + dome + base tray
    for (let i = -6; i <= 6; i++) { const x = cx + i * rw / 6.6, yTop = top + 60 - Math.sqrt(Math.max(0, 1 - (i / 6.6) ** 2)) * 70; p.band([[x, yTop], [x, base]], BR, 4.2, 2); }
    p.band(ellPts(cx, top + 60, rw, 70, 180, 360, 0, 30), BR, 7, 2.5);
    p.band([[cx - rw, top + 60], [cx - rw, base]], BR, 6, 2.5); p.band([[cx + rw, top + 60], [cx + rw, base]], BR, 6, 2.5);
    p.band([[cx - rw, 560], [cx + rw, 560]], BR, 4, 2);
    p.poly(rrect(cx - rw - 18, base - 10, cx + rw + 18, base + 46, 10), "#b5823a", 6);
    p.band([[cx - rw - 10, base + 8], [cx + rw + 10, base + 8]], "#e2b55a", 5, 0);
    p.poly(rrect(cx - 22, top - 12, cx + 22, top + 4, 6), BR, 5);
  }
  if (glow) { p.g.save(); p.g.globalAlpha = glow; p.ell(cx, 610, 230, 230, "rgba(255,240,170,.35)", 0); p.g.restore(); }
};

/** the resuscitation box: metal cage with a round glass door and an oxygen bottle on top */
export const haldaneBox = (p, o = {}) => {
  const { bird = "droop", gas = 0, beak = 0 } = o;
  const x0 = 120, x1 = 480, y0 = 520, y1 = 900;
  // oxygen bottle on top
  p.poly(rrect(170, 420, 430, 500, 38), "#3d7a52", 6);
  p.stroke([[200, 440], [400, 440]], 6, "#ffffff40");
  p.poly(rrect(420, 445, 470, 475, 6), "#b0b6bc", 5);
  p.ell(470, 460, 16, 16, "#c9973a", 5);
  p.band([[300, 500], [300, 524]], "#8a8f96", 10, 3);
  // box
  p.poly(rrect(x0, y0, x1, y1, 18), "#8f969e", 7);
  p.poly(rrect(x0 + 16, y0 + 16, x1 - 16, y0 + 40, 6), "#a8afb6", 0);
  for (const [x, y] of [[x0 + 24, y0 + 24], [x1 - 24, y0 + 24], [x0 + 24, y1 - 24], [x1 - 24, y1 - 24]]) p.dot(x, y, 6, "#4a4f56");
  // round window
  p.ell(300, 720, 128, 128, "#2a2f3a", 8);
  p.clip(ellPts(300, 720, 122, 122, 0, 360, 0, 48), () => {
    p.ell(300, 720, 122, 122, "#cfe4ee", 0);
    if (gas > 0) for (let i = 0; i < 6; i++) p.ell(240 + i * 26, 780 - ((gas * 120 + i * 33) % 120), 10, 10, "rgba(255,255,255,.7)", 2);
    p.g.save(); p.g.translate(300, 728); p.g.scale(0.5, 0.5); p.g.translate(-300, -640);
    if (bird === "droop") canaryCage(p, { cage: false, perch: true, tilt: 18, eye: "half", wing: 0.2 });
    else canaryCage(p, { cage: false, perch: true, beak, proud: true, wing: beak * 0.5, puff: beak * 0.6 });
    p.g.restore();
    p.stroke([[220, 650], [270, 610]], 10, "#ffffff70");
  });
  p.ell(300, 720, 128, 128, null, 10);
  p.poly(rrect(470, 690, 500, 750, 6), "#4a4f56", 5);
};

/** electric gas detector, 1986: grey box, round dial, green/red lamp */
export const detector = (p, o = {}) => {
  const { led = 1, needle = 0.2 } = o;
  p.poly(rrect(160, 560, 440, 920, 22), "#e2a42a", 8);
  p.poly(rrect(180, 580, 420, 640, 10), "#3a3a40", 5);
  for (let i = 0; i < 5; i++) p.stroke([[200 + i * 50, 600], [230 + i * 50, 600]], 6, "#5a5a62");
  p.ell(300, 750, 92, 92, "#f2efe6", 7);
  for (let i = 0; i <= 8; i++) { const a = rad(200 + i * 17.5); p.stroke([[300 + Math.cos(a) * 80, 750 + Math.sin(a) * 80], [300 + Math.cos(a) * 66, 750 + Math.sin(a) * 66]], 4, i > 6 ? "#c0302c" : INK); }
  const na = rad(200 + needle * 140); p.stroke([[300, 750], [300 + Math.cos(na) * 70, 750 + Math.sin(na) * 70]], 6, "#c0302c"); p.dot(300, 750, 9);
  p.ell(230, 870, 20, 20, led ? "#7dff8a" : "#2c4a30", 5); p.ell(370, 870, 20, 20, "#5a2a2a", 5);
  if (led) p.ell(224, 864, 6, 6, "#ffffff", 0);
  p.poly(rrect(250, 500, 350, 566, 14), null, 10);
};

/** beating heart (s: pump 0..1) */
export const fxHeart = (p, s = 0, col = "#e0353a") => {
  const k = 1 + 0.18 * s, pts = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI * 2, x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); pts.push([300 + x * 11 * k, 500 + y * 11 * k]); }
  p.poly(pts, col, 12);
  p.stroke([[220, 430], [250, 400]], 14, "#ffffff80");
};
/** the invisible gas: wavy dashed contour, translucent (t animates) */
export const fxGas = (p, t, a = 1) => {
  const g = p.g; g.save(); g.globalAlpha = a;
  const pts = []; for (let i = 0; i <= 80; i++) { const th = i / 80 * Math.PI * 2, r = 1 + 0.12 * Math.sin(th * 5 + t * 6) + 0.06 * Math.sin(th * 9 - t * 4); pts.push([300 + Math.cos(th) * 260 * r, 600 + Math.sin(th) * 170 * r]); }
  g.setLineDash([26, 22]); g.lineDashOffset = -t * 90;
  p.path(pts, true); g.fillStyle = "rgba(235,240,255,.10)"; g.fill(); g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 9; g.stroke();
  g.setLineDash([]);
  for (let i = 0; i < 5; i++) { const k = (t * 0.6 + i / 5) % 1; p.ell(170 + i * 65, 640 - k * 160, 14 + 8 * k, 14 + 8 * k, null, 0); g.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - k)).toFixed(2)})`; g.lineWidth = 5; g.beginPath(); g.arc(170 + i * 65, 640 - k * 160, 12 + 10 * k, 0, 7); g.stroke(); }
  g.restore();
};
/** flying coal chips */
export const fxChips = (p, t) => {
  for (let i = 0; i < 7; i++) { const a = rad(200 + i * 22), d = 60 + 260 * t, x = 300 + Math.cos(a) * d, y = 600 + Math.sin(a) * d * 0.7 + 380 * t * t, s = 20 * (1 - t * 0.5);
    p.poly([[x - s, y], [x, y - s * 0.8], [x + s * 0.9, y + s * 0.2], [x - s * 0.2, y + s]], "#25242a", 5); }
};
/** water stream from the tap (len in card px) */
export const fxStream = (p, t) => {
  p.poly([[285, 0], [315, 0], [312 + Math.sin(t * 9) * 3, 1000], [288 + Math.sin(t * 9) * 3, 1000]], "#9fd4ff", 5);
  p.stroke([[296, 40], [296, 960]], 5, "#ffffffa0");
};
/** clank lines (impact) */
export const fxClank = (p, t) => { for (let i = 0; i < 8; i++) { const a = rad(i * 45 + 20), r0 = 60 + 120 * t, r1 = r0 + 70 * (1 - t); p.stroke([[300 + Math.cos(a) * r0, 500 + Math.sin(a) * r0], [300 + Math.cos(a) * r1, 500 + Math.sin(a) * r1]], 14 * (1 - t) + 3, "#fff6c8"); } };
/** a falling pickaxe card */
export const pickCard = (p) => pickaxe(p, 230, 640, -0.5, 2.36, 0.5);
