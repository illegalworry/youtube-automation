// _t2.js — templates: 8 AM hallway, 9 AM street, 10:30 bank, reddit
import { E, layer, blurLayer, veil, ease, prog, clamp, lerp, mood, circle, ring, seg, rr, glow, alpha, text, FONTS, shade, linGrad, rng, poly } from '/engine/core.js';
import { drawGlow, bigGlow, idle, gPosesAt, blinkAt, gWalk, eyes } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd, spring, kText, impact } from '/engine/motion.js';
import * as L from './_lib.js';
const { W, H, you, person, walker, cm, lw } = L;
export const T = {};

T.hallway = (g, t, info, p) => {
  const cam = cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.07, x0: p.x0 ?? -20, x1: p.x1 ?? 20 });
  const r = L.room(g, t, cam, { mood: 'day', wall: '#b8a898', door: true, doorX: W * 0.82, window: false, frame: true, frameX: W * 0.08, plant: false, rug: '#5a7ab8',
    extraBack: (g, M, GY) => { if (p.mirror !== false) { const mx = W * 0.5, my = GY - 30; rr(g, mx - 170, my - 620, 340, 600, 160); g.fillStyle = '#c8a868'; g.fill(); rr(g, mx - 150, my - 600, 300, 560, 145); g.fillStyle = linGrad(g, 0, my - 600, 0, my, ['#dce8f0', '#a8b8c8']); g.fill(); g.save(); rr(g, mx - 150, my - 600, 300, 560, 145); g.clip(); g.translate(mx, my); g.scale(0.62, 0.62); if (p.mode !== 'nude') L.emptyClothes(g, { x: 0, y: 0, t, pose: idle('stand', t), facing: -1 }); g.restore(); g.fillStyle = alpha('#ffffff', 0.25); g.beginPath(); g.moveTo(mx - 100, my - 520); g.lineTo(mx - 40, my - 560); g.lineTo(mx - 120, my - 200); g.closePath(); g.fill(); } } });
  layer(g, cam, 1, (g) => {
    const x = W * (p.youX ?? 0.3);
    if (p.mode === 'clothes') L.emptyClothes(g, { x, y: r.GY + 40, t, pose: idle(gPosesAt(t, [[0, 'stand'], [1.4, 'shrug']]), t) });
    else if (p.mode === 'drop') { const k = ease.in(prog(t, 0.8, 1.5)); if (k < 1) L.emptyClothes(g, { x, y: r.GY + 40, t, alpha: 1 - k, pose: idle('stand', t) }); if (k > 0) { g.save(); g.globalAlpha *= k; g.fillStyle = L.YOU.color; g.beginPath(); g.ellipse(x, r.GY + 30, 120, 26, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#3c5a8c'; g.beginPath(); g.ellipse(x + 60, r.GY + 44, 90, 18, 0.1, 0, Math.PI * 2); g.fill(); g.restore(); } you(g, { x, y: r.GY + 40, t, inv: 0.95, alpha: k, expr: 'nervous', rimC: '#fff' }); }
    else if (p.mode === 'mirror') { you(g, { x: W * 0.3, y: r.GY + 40, t, inv: 0.95, expr: 'surprised', look: [1, 0], rimC: '#fff', alpha: 0.6 }); L.emptyClothes(g, { x: W * 0.3, y: r.GY + 40, t, pose: idle('stand', t) }); }
    else you(g, { x, y: r.GY + 40, t, inv: 0.95, expr: 'look', rimC: '#fff' });
  });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.8, H * 0.14, { start: lw(info, p.pillW || '', 0.5) });
};

T.items = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); const r = G.studio(g, t, cam, { mood: 'data', spot: 0.14 });
  layer(g, cam, 1, (g) => you(g, { x: W * 0.5, y: r.GY, t, inv: 0.95, s: 1.6, expr: 'look', look: [0, 0.3], rimC: '#fff' }));
  const list = p.items || [['HOODIE', 'clothes'], ['PHONE', 'phone'], ['KEYS', 'keys'], ['SHOES', 'shoes']];
  list.forEach(([lab, w], i) => { const s0 = lw(info, w, 0.4 + i * 0.8), k = spring(t, s0, { freq: 1.5, damp: 0.55 }); if (t < s0) return; const x = W * (0.16 + (i % 2) * 0.68), y = H * (0.3 + Math.floor(i / 2) * 0.36); g.save(); g.translate(x, y); g.scale(k, k);
    circle(g, 0, 0, 110, alpha('#2a3256', 0.9)); ring(g, 0, 0, 110, 3, alpha('#a9b8e8', 0.4));
    if (lab === 'HOODIE') { drawGlow(g, { x: 0, y: 90, s: 0.5, outfit: L.YOU, rim: false, expr: 'tiny', eyeColor: 'rgba(0,0,0,0)', alpha: 0.999 }); }
    else if (lab === 'PHONE') L.phoneProp(g, 0, 0, 1.2, 0.5);
    else if (lab === 'KEYS') { ring(g, -20, -20, 26, 6, '#c8c8d0'); for (const [a, c] of [[0.4, '#e8c04a'], [1.0, '#c8c8d0']]) { g.save(); g.rotate(a); rr(g, -6, 0, 12, 70, 4); g.fillStyle = c; g.fill(); circle(g, 0, 0, 18, c); g.restore(); } }
    else if (lab === 'SHOES') { for (const dx of [-40, 40]) { rr(g, dx - 40, 0, 80, 34, 14); g.fillStyle = '#f2efe8'; g.fill(); rr(g, dx - 40, 24, 84, 12, 6); g.fillStyle = '#d8453a'; g.fill(); } }
    text(g, lab, 0, 150, { size: 30, font: FONTS.sans, weight: 800, color: '#fff6e8', spacing: 4 }); g.restore(); });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.08, { start: 0.2 });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.1, { start: lw(info, p.ktW || '', 0.3), mode: 'rise', size: 70 });
};

T.trade = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.04 }); blurLayer(g, 6, (g) => G.street(g, t, cam, { mood: 'rainy' })); veil(g, '#101428', 0.25);
  UI.statCard(g, t, { x: W * 0.3, y: H * 0.14, w: 760, h: 700, start: 0.2, title: 'THE FIRST TRADE', bars: p.bars || [{ label: 'UNSEEN', v: 0.9, color: '#9ac0f2', icon: UI.icons.eyes }, { label: 'EXPOSED', v: 0.9, color: '#f3a64a', icon: UI.icons.person }] });
};

T.walkStreet = (g, t, info, p) => { // events on the 9 AM street
  const cam0 = cm(t, info, { z0: 1.02, z1: 1.08 }); let cam = cam0;
  const hitT = p.hit != null ? lw(info, p.hitW || '', p.hit) : null; if (hitT != null) { const im = impact(t, hitT, { amp: 14, decay: 6 }); cam = camAdd(cam0, im); }
  const r = G.street(g, t, cam, { mood: 'day', dof: 3 }); const GY = r.GY, rimC = r.M.rim;
  layer(g, cam, 1, (g) => {
    const yx = W * 0.5; let fall = 0;
    if (p.ev === 'bump') { const wx = walker(g, t, { x: W * 0.12, y: GY + 40, facing: 1, outfit: L.C.coral, s: 1.5, speed: 160, rimC, expr: t > hitT ? 'confused' : 'bored', prop: 'phone' }); }
    if (p.ev === 'cyclist') { const bx = W * -0.2 + t * 900; L.bike(g, bx, GY + 70, 1.3, '#d8453a', t * 12); drawGlow(g, { x: bx - 10, y: GY + 70 - 120, s: 1.2, facing: 1, outfit: L.C.olive, pose: { ...gPosesAt(0, [[0, 'sit']]), aF: [1.3, 0.3], aB: [1.2, 0.3] }, turn: 0.85, expr: 'surprised', rim: { color: rimC, dir: [-0.6, -0.8] }, shadow: false }); fall = ease.out(prog(t, hitT ?? 0.6, (hitT ?? 0.6) + 0.5)); }
    if (p.ev === 'bump') fall = 0;
    you(g, { x: yx + (p.ev === 'bump' && t > hitT ? 30 : 0), y: GY + 40, t, inv: 0.95, rot: -fall * 0.5, expr: t > (hitT ?? 99) ? 'shocked' : 'look', look: [-1, 0], pose: idle(t > (hitT ?? 99) ? 'scared' : 'stand', t), rimC, facing: -1 });
    if (p.ev === 'bump' && hitT && t > hitT && t < hitT + 0.6) { const k = (t - hitT) / 0.6; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; seg(g, [[yx - 40 + Math.cos(a) * 60 * (1 + k), GY - 300 + Math.sin(a) * 60 * (1 + k)], [yx - 40 + Math.cos(a) * 90 * (1 + k), GY - 300 + Math.sin(a) * 90 * (1 + k)]], 6, alpha('#ffffff', 1 - k)); } }
  });
};

T.crossing = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = G.street(g, t, cam, { mood: 'day', lamp: false });
  layer(g, cam, 1, (g) => { const GY = r.GY; for (let i = 0; i < 8; i++) { rr(g, W * 0.2 + i * 160, GY + 60, 100, H - GY, 4); g.fillStyle = alpha('#ffffff', 0.7); g.fill(); }
    L.trafficLight(g, W * 0.12, GY - 40, 0.8, 1, 1);
    you(g, { x: W * 0.36, y: GY + 20, t, inv: 0.95, expr: t > 1.2 ? 'worried' : 'look', look: [1, 0.2], rimC: r.M.rim, pose: idle(t > 1.4 && p.car ? 'scared' : 'stand', t) });
    if (p.car) { const cx = W * 1.3 - ease.inOut(prog(t, p.carT ?? 0.6, (p.carT ?? 0.6) + 1.4)) * W * 1.8; G.car(g, cx, GY + 180, 1.5, { color: '#4a6a9a' }); if (cx > W * 0.1 && cx < W * 0.9) for (let k = 0; k < 4; k++) seg(g, [[cx + 180 + k * 30, GY + 80 + k * 22], [cx + 320 + k * 40, GY + 80 + k * 22]], 5, alpha('#ffffff', 0.6)); person(g, { x: cx - 30, y: GY + 60, s: 0.7, outfit: L.C.slate, pose: 'sitFront', expr: 'bored', look: [-1, 0], rim: false, shadow: false, alpha: 0 }); }
    for (let i = 0; i < 2; i++) person(g, { x: W * (0.6 + i * 0.12), y: GY + 10, t, seed: i, outfit: [L.C.mustard, L.C.navy][i], facing: -1, expr: 'bored', rimC: r.M.rim });
  });
};

T.signal = (g, t, info, p) => {
  const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.1 }]]), drift(t, 3, 4)); blurLayer(g, 8, (g) => G.street(g, t, cam, { mood: 'day' }));
  const k = ease.inOut(prog(t, lw(info, 'no', 1.6), lw(info, 'no', 1.6) + 0.7));
  layer(g, cam, 1, (g) => { L.trafficLight(g, W * 0.4, H * 1.15, 1.4, 1, 1 - k * 0.9); if (k > 0) { const x = W * 0.4, y = H * 1.15 - 1.4 * 460; drawGlow(g, { x, y: y + 40, s: 0.18, outfit: L.YOU, invisible: 0.95, edgeColor: '#eafff0', rim: false, alpha: k }); } });
  UI.tag(g, t, 'WALK', W * 0.66, H * 0.4, { start: 0.3, size: 40 }); if (k > 0.5) UI.tag(g, t, '…FOR WHOM?', W * 0.66, H * 0.54, { start: lw(info, 'no', 1.6) + 0.4, size: 40 });
};

T.dogClose = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.05, z1: 1.15, x0: 20, x1: -20 }); blurLayer(g, 5, (g) => G.street(g, t, cam, { mood: 'day' }));
  layer(g, cam, 1, (g) => { const GY = H * 0.86; floorFake(g, GY); const bk = p.bark ? (Math.sin(t * 9) > 0.2 ? 1 : 0) : 0; L.dog(g, W * 0.36, GY, 2.4, { facing: 1, bark: bk, t }); L.barkLines(g, W * 0.36 + 360, GY - 300, t, bk);
    you(g, { x: W * 0.8, y: GY + 60, t, inv: 0.95, s: 1.8, facing: -1, expr: 'nervous', look: [-1, 0.5], rimC: '#fff4e0' });
    if (p.sniff) for (let i = 0; i < 4; i++) { const k = ((t * 0.6 + i / 4) % 1); g.save(); g.globalAlpha *= (1 - k) * 0.8; g.strokeStyle = '#ffe2a0'; g.lineWidth = 6; g.beginPath(); for (let j = 0; j <= 20; j++) { const x = lerp(W * 0.74, W * 0.36 + 230, (j / 20)), y = GY - 270 - i * 30 + Math.sin(j * 0.8 + t * 5 + i) * 14; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore(); } });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.12, { start: lw(info, p.ktW || '', 0.3), mode: 'rise', size: 72 });
};
function floorFake(g, GY) { g.fillStyle = linGrad(g, 0, GY - 40, 0, H, ['#9aa0a8', '#787e88']); g.fillRect(-W, GY - 40, W * 3, H); }

T.breath = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: -40, y: -40 }, drift(t, 5, 4)); blurLayer(g, 7, (g) => G.street(g, t, cam, { mood: 'day' })); veil(g, '#d8e4f0', 0.12);
  const R = 220, cx = W * 0.42, cy = H * 0.62;
  g.save(); g.strokeStyle = alpha('#ffffff', 0.85); g.lineWidth = 5; g.shadowColor = '#bfe0ff'; g.shadowBlur = 20; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.restore();
  eyes(g, cx, cy, R, { expr: 'calm', look: [1, 0], blink: blinkAt(t, 3.2), turn: 0.4 }, '#ffffff');
  for (let k = 0; k < 3; k++) { const ph = ((t * 0.45 + k / 3) % 1); L.puff(g, cx + R * 0.9 + ph * 420, cy + 40 - ph * 120, 50 + ph * 120, (1 - ph) * 1.0); }
  if (p.tag) UI.tag(g, t, p.tag, W * 0.74, H * 0.14, { start: lw(info, p.tagW || '', 0.5) });
};

T.bigPerson = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: 40, y: -40 }, drift(t, 5, 7)); blurLayer(g, 7, (g) => { const r = G.street(g, t, cam, { mood: p.mood || 'day' }); layer(g, cam, 1, (g) => you(g, { x: W * 0.22, y: r.GY + 40, t, inv: 0.94, rimC: '#fff' })); }); veil(g, '#101428', 0.08);
  bigGlow(g, W * 0.62, H * 0.64, 240, { outfit: p.outfit || L.C.coral, expr: p.expr || 'bored', look: p.look || [1, 0], blink: blinkAt(t, 3), rim: { color: '#fff4e0' }, rimSide: -1, turn: 0.2 });
  if (p.arrow) UI.arrow(g, t, [W * 0.5, H * 0.32], [W * 0.92, H * 0.3], { start: 0.6, bend: -0.15 });
  if (p.bub) { UI.bubble(g, W * 0.82, H * 0.2, { str: p.bub, w: 400, h: 100, t, start: 0.3, size: 34, tail: [-60, 50] }); if (p.strike) L.strike(g, W * 0.82, H * 0.2, 360, ease.out(prog(t, 1.0, 1.4))); }
};

T.crowdPast = (g, t, info, p) => { // you alone among walkers who look past you
  const cam = cm(t, info, { z0: 1.0, z1: 1.1 }); const r = G.street(g, t, cam, { mood: p.mood || 'day', dof: 4 });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 6; i++) { const dir = i % 2 ? -1 : 1; walker(g, t, { x: dir > 0 ? W * (-0.05 + i * 0.1) : W * (1.05 - i * 0.08), y: r.GY + 20 + (i % 3) * 22, facing: dir, outfit: L.CROWD[(i * 7) % 10], s: 1.2, speed: 100 + i * 12, seed: i, expr: 'bored', prop: i % 3 === 0 ? 'phone' : null, rimC: r.M.rim, look: [dir, 0.5] }); }
    you(g, { x: W * 0.5, y: r.GY + 50, t, inv: p.inv ?? 0.94, expr: p.ex || 'sad', look: [0, 0.3], rimC: r.M.rim, s: 1.55 }); });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.82, H * 0.14, { start: lw(info, p.pillW || '', 0.5) });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.4), mode: p.ktMode || 'rise', size: 84 });
};

T.bankOutside = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.08 }); const r = G.street(g, t, cam, { mood: 'day', lamp: false });
  const open = ease.inOut(prog(t, 1.0, 1.8)) * (1 - ease.inOut(prog(t, 4.2, 5.0)));
  layer(g, cam, 1, (g) => { const bx = W * 0.3, GY = r.GY - 46; g.fillStyle = '#d8d0c0'; g.fillRect(bx - 60, GY - 640, 900, 640); poly(g, [[bx - 90, GY - 640], [bx + 870, GY - 640], [bx + 390, GY - 760]], '#e8e0d0'); text(g, 'CITY BANK', bx + 390, GY - 600, { size: 54, font: FONTS.sans, weight: 800, color: '#6a5a3a', spacing: 12 }); for (let i = 0; i < 5; i++) { g.fillStyle = '#ece6da'; g.fillRect(bx - 30 + i * 200, GY - 560, 46, 560); }
    const dx = bx + 300, dw = 180; g.fillStyle = '#2a3446'; g.fillRect(dx - 10, GY - 380, dw * 2 + 20, 380); g.fillStyle = '#ffe2b0'; g.fillRect(dx, GY - 370, dw * 2, 370); g.fillStyle = alpha('#9ac0e0', 0.75); g.fillRect(dx - dw * open, GY - 370, dw, 370); g.fillRect(dx + dw + dw * open, GY - 370, dw, 370); seg(g, [[dx + dw - dw * open, GY - 370], [dx + dw - dw * open, GY]], 4, '#5a6a80'); seg(g, [[dx + dw + dw * open, GY - 370], [dx + dw + dw * open, GY]], 4, '#5a6a80');
    const wx = W * 0.95 - t * 120; walker(g, 0, { x: Math.max(dx + dw, wx), y: r.GY + 10, facing: -1, outfit: L.C.navy, s: 1.3, rimC: r.M.rim, expr: 'calm', speed: 0 });
    you(g, { x: W * 0.9 - t * 110, y: r.GY + 30, t, inv: 0.95, pose: gWalk(t * 5.4), turn: 0.85, facing: -1, expr: 'sly', rimC: r.M.rim }); });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
};

T.bank = (g, t, info, p) => {
  const cam = p.insert ? camAdd(camPath(t, [[0, { z: 1.6, x: -180, y: 120 }], [info.dur, { z: 1.8, x: -200, y: 130 }]]), drift(t, 3, 2)) : cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.06, x0: p.x0 ?? -30, x1: p.x1 ?? 30 });
  const r = L.bank(g, t, cam, {}); const CY = r.CY;
  layer(g, cam, 1, (g) => {
    const lift = p.lift ? ease.out(prog(t, lw(info, 'lifts', 1.5), lw(info, 'lifts', 1.5) + 1.2)) : 0, drop = p.drop ? ease.in(prog(t, lw(info, 'drop', 0.4), lw(info, 'drop', 0.4) + 0.4)) : 0;
    const cxm = W * 0.36, cy = CY - 22 - lift * 160 + Math.sin(t * 2) * 6 * lift + drop * 160;
    if (!p.taken) { L.cash(g, cxm, p.drop ? Math.min(cy, CY - 22) : cy, 1.2, 6); if (lift > 0.1) { g.save(); g.globalAlpha *= lift; glow(g, cxm, cy - 40, 160, '#aaffaa', 0.25); g.restore(); } }
    // guard
    const gl = p.guardLook ? t > lw(info, 'looks', 0.3) : false;
    person(g, { x: W * 0.58, y: r.GY, t, s: 1.6, outfit: L.GUARD, facing: -1, pose: idle(gl ? 'stand' : 'phone', t), prop: gl ? null : 'phone', expr: gl ? 'shocked' : 'bored', look: gl ? [-1, 0] : [-0.3, 0.7], rimC: '#fff4e0', seed: 2 });
    const yx = W * (p.youX ?? 0.26) + (p.run ? -ease.in(prog(t, 0.3, 1.2)) * W * 0.5 : 0);
    you(g, { x: yx, y: r.GY, t, inv: 0.95, s: 1.6, facing: p.run ? -1 : 1, expr: p.run ? 'scared' : p.ex || 'sly', look: [1, 0.3], pose: p.run ? gWalk(t * 9, { run: true }) : idle(p.reach || p.lift ? 'reach' : 'stand', t), turn: p.run ? 0.85 : 0.2, rimC: '#fff4e0' });
    if (p.prints) { const s0 = lw(info, 'evidence', 0.8); for (let i = 0; i < 5; i++) L.fingerprint(g, cxm - 60 + i * 30, CY - 70 - (i % 2) * 20, 22, clamp((t - s0 - i * 0.15) * 4)); }
  });
  if (p.tag) UI.tag(g, t, p.tag, W * (p.tagX ?? 0.5), H * 0.08, { start: lw(info, p.tagW || '', 0.4) });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.4), mode: p.ktMode || 'slam', size: 86 });
  if (p.labels) p.labels.forEach(([s, w, x, y]) => UI.tag(g, t, s, W * x, H * y, { start: lw(info, w, 0.5), size: 28 }));
};

T.reddit = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.1 });
  G.monitorRoom(g, t, cam, {}, (g, x, y, w, h) => { g.fillStyle = '#f4f4f6'; g.fillRect(x, y, w, h); g.fillStyle = '#ff5a2a'; g.fillRect(x, y, w, 40); text(g, 'r/AskAnything', x + 20, y + 21, { size: 20, font: FONTS.ui, weight: 900, color: '#fff', align: 'left' });
    text(g, 'You turn invisible. What do you do first?', x + 20, y + 74, { size: 21, font: FONTS.ui, weight: 900, color: '#2a2a34', align: 'left' });
    const rows = [['Steal as much money as possible', '48.2k'], ['Sneak into a concert', '9.1k'], ['Prank my friends', '6.4k'], ['Save someone', '1.2k']];
    rows.forEach(([s, v], i) => { const a = clamp((t - 0.5 - i * 0.35) * 3); const yy = y + 120 + i * 62, hi = p.hi && i === 0; g.save(); g.globalAlpha *= a; rr(g, x + 16, yy - 24, w - 32, 50, 8); g.fillStyle = hi ? '#ffe6c8' : '#e8e8ee'; g.fill(); if (hi) { g.strokeStyle = '#ff7a3a'; g.lineWidth = 3; g.stroke(); } text(g, '▲ ' + v, x + 34, yy + 1, { size: 17, font: FONTS.ui, weight: 900, color: '#ff5a2a', align: 'left' }); text(g, s, x + 130, yy + 1, { size: 19, font: FONTS.ui, weight: 800, color: '#2a2a34', align: 'left' }); g.restore(); });
  });
  if (p.hi) UI.pill(g, t, '#1 ANSWER', W * 0.84, H * 0.16, { start: 0.3 });
};

T.strikes = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.04 }); blurLayer(g, 7, (g) => L.bank(g, t, cam, {})); veil(g, '#141626', 0.35);
  (p.items || []).forEach(([s, w, y, st], i) => { const s0 = lw(info, w, 0.2 + i * 0.6); kText(g, t, s, W * 0.5, H * y, { start: s0, mode: st ? 'rise' : 'slam', size: st ? 70 : 96, color: st ? '#dfe4f0' : '#ffad45' }); if (st) L.strike(g, W * 0.5, H * y, s.length * 52, ease.out(prog(t, s0 + 0.5, s0 + 0.9))); });
};
