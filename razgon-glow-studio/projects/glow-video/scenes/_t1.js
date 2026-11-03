// _t1.js — templates: hook, intro, 7:12 AM, the eye physics, Wells, the dots
import { E, layer, blurLayer, veil, ease, prog, clamp, lerp, mood, circle, ring, seg, rr, glow, alpha, text, FONTS, shade, key, linGrad, rng } from '/engine/core.js';
import { drawGlow, bigGlow, idle, gPosesAt, blinkAt, gWalk, eyes } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd, spring, kText, fg } from '/engine/motion.js';
import * as L from './_lib.js';
const { W, H, you, person, walker, cm, lw } = L;
export const T = {};
const exprAt = (t, keys) => { let e = keys[0][1]; for (const [k, v] of keys) if (t >= k) e = v; return e; };
const invAt = (t, p, info) => Array.isArray(p.inv) ? lerp(p.inv[0], p.inv[1], ease.inOut(prog(t, p.invT?.[0] ?? 0.3, p.invT?.[1] ?? info.dur * 0.7))) : (p.inv ?? 0.94);

// busy street with walkers; YOU in the middle (optionally fading out); many options
T.street = (g, t, info, p) => {
  const cam = cm(t, info, p); const r = G.street(g, t, cam, { mood: p.mood || 'day', car: p.parked ? '#c86a5a' : false, dof: 3 });
  const rimC = r.M.rim, GY = r.GY;
  layer(g, cam, 1, (g) => {
    if (p.prints) for (let i = 0; i < 7; i++) { const tt = i * 0.35; L.footprint(g, W * 0.22 + i * 95, GY + 70 + (i % 2) * 34, 0.9, clamp((t - tt) * 3) * 0.75, false, alpha('#2a3040', 0.8)); }
    const ws = p.walkers ?? 4;
    for (let i = 0; i < ws; i++) { const dir = i % 2 ? -1 : 1; walker(g, t, { x: dir > 0 ? W * (-0.1 + i * 0.12) : W * (1.05 - i * 0.1), y: GY + 10 + (i % 3) * 18, facing: dir, outfit: L.CROWD[(i * 3 + (p.seed || 0)) % 10], s: 1.15, speed: 110 + i * 10, seed: i, expr: p.phones ? 'bored' : 'neutral', prop: p.phones && i % 2 ? 'phone' : null, rimC, look: [dir, p.phones ? 0.6 : 0] }); }
    if (p.dog) { const bk = (Math.sin(t * 9) > 0.2 ? 1 : 0) * (t > (p.dogT ?? 0.4) ? 1 : 0); L.dog(g, W * 0.68, GY + 30, 1.2, { facing: -1, bark: bk, t }); person(g, { x: W * 0.8, y: GY + 20, facing: -1, outfit: L.C.taupe, t, seed: 3, pose: idle('holdFront', t), rimC, expr: 'bored', look: [-1, 0.2] }); seg(g, [[W * 0.8 - 40, GY - 170], [W * 0.68 + 90, GY - 100]], 3, '#3a3a44'); L.barkLines(g, W * 0.68 - 110, GY - 140, t, bk); }
    if (p.you !== false) { const yx = W * (p.youX ?? 0.48) + (p.youWalk ? t * 90 : 0); you(g, { x: yx, y: GY + 40, t, inv: invAt(t, p, info), expr: exprAt(t, p.expr || [[0, 'look']]), look: p.look || [0.3, 0.1], s: 1.5, rimC, pose: p.youWalk ? gWalk(t * 5.6) : idle(p.pose || 'stand', t), turn: p.youWalk ? 0.85 : 0.2, edge: p.mood === 'rainy' ? '#dfe8ff' : '#ffffff' });
      if (p.breath) for (let k = 0; k < 4; k++) { const ph = ((t * 0.55 + k * 0.25) % 1); L.puff(g, yx + 60 + ph * 120, GY + 40 - 390 * 1.5 / 1.5 - ph * 60, 26 + ph * 50, (1 - ph) * 0.9); } }
  });
  if (p.snow) { const R = rng(5); g.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 90; i++) { const x = (R() * W + t * 30 * (R() - 0.3)) % W, y = (R() * H + t * (60 + R() * 60)) % H; circle(g, x, y, 2 + R() * 3, 'rgba(255,255,255,.8)'); } }
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.1, { start: 0.4 });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.82, H * 0.14, { start: lw(info, p.pillW || '', 0.5) });
};

T.bigYou = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: p.bx ?? -60, y: -40 }, drift(t, 5, 4));
  const setFn = { bedroom: (g) => G.bedroom(g, t, cam, { mood: p.mood || 'home' }), street: (g) => G.street(g, t, cam, { mood: p.mood || 'day' }), park: (g) => G.park(g, t, cam, {}), studio: (g) => G.studio(g, t, cam, { mood: p.mood || 'data' }), bank: (g) => L.bank(g, t, cam, {}), cafe: (g) => L.cafe(g, t, cam, {}), room: (g) => L.room(g, t, cam, { mood: p.mood || 'home', night: true, lamp: 1 }) }[p.set || 'studio'];
  blurLayer(g, 7, setFn); veil(g, '#101428', 0.12);
  if (p.snow) { const R = rng(5); for (let i = 0; i < 90; i++) { const x = (R() * W + t * 20) % W, y = (R() * H + t * (60 + R() * 60)) % H; circle(g, x, y, 2 + R() * 4, 'rgba(255,255,255,.75)'); } }
  const inv = invAt(t, p, info), sc = spring(t, 0.2, { freq: 1.4, damp: 0.6 });
  const R = p.R ?? 250, cx = W * (p.cx ?? 0.5), cy = H * 0.62;
  const ex = exprAt(t, p.expr || [[0, 'neutral']]), look = p.look || [0, 0];
  if (inv > 0.02) {
    // invisible close-up: glowing outline + white eyes
    g.save(); g.globalAlpha = 1 - inv; bigGlow(g, cx, cy, R, { outfit: L.YOU, expr: ex, look, blink: blinkAt(t, 3.2), rim: { color: '#fff4e0' }, rimSide: -1, turn: 0.1 }); g.restore();
    g.save(); g.globalAlpha = inv; g.strokeStyle = alpha('#eef8ff', 0.85); g.lineWidth = 5; g.shadowColor = '#bfe0ff'; g.shadowBlur = 20; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(cx - R * 1.45, H + 20); g.lineTo(cx - R * 1.45, cy + R * 1.3); g.quadraticCurveTo(cx - R * 1.45, cy + R * 0.86, cx - R * 0.9, cy + R * 0.86); g.lineTo(cx + R * 0.9, cy + R * 0.86); g.quadraticCurveTo(cx + R * 1.45, cy + R * 0.86, cx + R * 1.45, cy + R * 1.3); g.lineTo(cx + R * 1.45, H + 20); g.stroke(); g.restore();
    g.save(); g.globalAlpha = inv; eyes(g, cx, cy, R, { expr: ex, look, blink: blinkAt(t, 3.2), turn: 0.1 }, p.dark ? '#141826' : '#ffffff'); g.restore();
  } else bigGlow(g, cx, cy, R, { outfit: L.YOU, expr: ex, look, blink: blinkAt(t, 3.2), rim: { color: '#fff4e0' }, rimSide: -1, turn: 0.1 });
  if (p.blind) { const k = ease.inOut(prog(t, lw(info, p.blindW || '', p.blind), lw(info, p.blindW || '', p.blind) + 1.2)); veil(g, '#05060c', k * 0.9); }
  if (p.blur) { /* wide eyes, world going soft */ veil(g, '#d8e0f0', 0.25 * ease.inOut(prog(t, p.blur, p.blur + 1.5))); }
  if (p.ringEyes) { const k = spring(t, p.ringEyes, { freq: 1.6, damp: 0.6 }); ring(g, cx, cy, R * 0.75 * k, 6, alpha('#ffad45', 0.9 * clamp(k))); }
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.16, { start: lw(info, p.ktW || '', 0.4), mode: p.ktMode || 'rise', size: 84, color: '#ffffff' });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.8, H * 0.18, { start: lw(info, p.pillW || '', 0.6) });
  if (p.bub) UI.bubble(g, cx + R * 1.3, cy - R * 1.0, { str: p.bub, w: 260, h: 100, t, start: lw(info, p.bubW || '', 0.4), thought: !!p.thought, tail: [-60, 50] });
};

T.parkAlone = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = G.park(g, t, cam, { bench: true });
  layer(g, cam, 1, (g) => { const rim = r.M.rim; for (let i = 0; i < 3; i++) { const k = prog(t, 0.4 + i * 0.25, 2.5 + i * 0.2); walker(g, Math.max(0, t - 0.4 - i * 0.25), { x: W * (0.55 + i * 0.08), y: r.GY - 6 + i * 6, facing: 1, outfit: [L.C.coral, L.C.mustard, L.C.lilac][i], s: 1.25, speed: 120, seed: i, rimC: rim, alpha: 1 - k * 0.2 }); }
    you(g, { x: W * 0.36, y: r.GY, t, inv: 0.93, expr: t > 1.2 ? 'sad' : 'look', look: [1, 0.1], rimC: rim, edge: '#ffe6d8' }); });
};

T.porch = (g, t, info, p) => {
  const cam = cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.08, x0: p.x0 ?? 0, x1: p.x1 ?? -40 }); const open = p.open ? ease.out(prog(t, p.open, p.open + 0.9)) : 0;
  const r = G.porch(g, t, cam, { halloween: false, table: false, doorOpen: open, sign: false });
  layer(g, cam, 1, (g) => { if (p.knock) { const k = [p.knock, p.knock + 0.35, p.knock + 0.7].some(a => t > a && t < a + 0.15); you(g, { x: W * 0.17, y: r.GY, t, inv: 0.93, facing: -1, pose: idle(k ? 'reach' : 'stand', t), expr: open > 0.3 ? 'happy' : 'calm', look: [-1, 0], rimC: r.M.rim, edge: '#ffe6c0' }); if (k) L.barkLines(g, W * 0.08, r.GY - 300, t * 3, 0.6); if (open > 0.4) person(g, { x: W * 0.04, y: r.GY, t, facing: 1, outfit: L.FRIEND, expr: 'joy', alpha: clamp((open - 0.4) * 3), rimC: r.M.rim, look: [1, 0], pose: idle('wave', t) }); }
    else you(g, { x: W * (p.youX ?? 0.6), y: r.GY, t, inv: 0.93, facing: -1, expr: p.ex || 'sad', look: [-1, 0.1], rimC: r.M.rim, edge: '#ffe6c0', pose: idle(p.pose || 'stand', t) }); });
  if (p.endCard) UI.endCard(g, t, { question: p.endCard, start: p.endT ?? 1.2, cta: 'SUBSCRIBE' });
};

T.title = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.08 }); blurLayer(g, 6, (g) => { const r = G.street(g, t, cam, { mood: 'park' }); layer(g, cam, 1, (g) => you(g, { x: W * 0.5, y: r.GY + 30, t, inv: 0.94, rimC: r.M.rim })); });
  UI.titleCard(g, t, { title: p.title, sub: p.sub, start: 0.1, dur: info.dur + 1 });
};

T.studio = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = G.studio(g, t, cam, { mood: p.mood || 'data', spot: 0.18 });
  layer(g, cam, 1, (g) => {
    const tInv = p.invW ? lw(info, p.invW, info.dur * 0.6) : null; const inv = p.inv != null ? p.inv : tInv != null ? ease.inOut(prog(t, tInv, tInv + 1.2)) * 0.94 : 0;
    you(g, { x: W * (p.youX ?? 0.5), y: r.GY, t, inv, s: 1.7, expr: exprAt(t, p.expr || [[0, 'calm']]), look: p.look || [0, 0.1], pose: idle(p.pose ? gPosesAt(t, p.pose) : 'stand', t), rimC: r.M.rim });
    if (p.dots) { const k = clamp((t - 0.3) * 2); for (const dx of [-14, 14]) circle(g, W * (p.youX ?? 0.5) + dx * 1.7, r.GY - 395 * 1.7 / 1.5 + 10, 6, alpha('#ffffff', k)); }
  });
  (p.pills || []).forEach(([str, word, x, y], i) => UI.pill(g, t, str, W * x, H * y, { start: lw(info, word, 0.4 + i * 0.8) }));
  (p.tags || []).forEach(([str, word, x, y, strikeW], i) => { const s0 = lw(info, word, 0.4 + i * 0.7); UI.tag(g, t, str, W * x, H * y, { start: s0, size: 34 }); if (strikeW) L.strike(g, W * x, H * y, str.length * 30 + 40, ease.out(prog(t, s0 + 0.5, s0 + 0.9))); });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * (p.ktY ?? 0.15), { start: lw(info, p.ktW || '', 0.3), mode: p.ktMode || 'rise', size: p.ktSize || 86, color: p.ktColor || '#ffffff' });
  if (p.bub) UI.bubble(g, W * 0.64, H * 0.34, { str: p.bub, w: p.bubWd || 300, h: 100, t, start: lw(info, p.bubW || '', 0.4), tail: [-70, 60] });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
};

T.clock = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.1 }); const r = L.room(g, t, cam, { mood: p.mood || 'home', night: p.night ?? true, window: true, windowX: W * 0.68, frame: false, plant: false });
  const [h0, m0] = p.from || [7, 0], [h1, m1] = p.to || [23, 59]; const k = ease.inOut(prog(t, 0.2, info.dur - 0.3)), mins = lerp(h0 * 60 + m0, h1 * 60 + m1, k);
  layer(g, cam, 1, (g) => { L.clockFace(g, W * 0.4, H * 0.42, 260, Math.floor(mins / 60), mins % 60); });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.4, H * 0.86, { start: 0.3 });
  if (p.kt) kText(g, t, p.kt, W * 0.76, H * 0.8, { start: lw(info, p.ktW || '', 0.4), mode: 'slam', size: 80 });
};

T.board = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const er = p.erase ? ease.inOut(prog(t, p.erase, p.erase + 1.2)) : 0;
  const r = G.classroom(g, t, cam, { board: (g, x, y, w, h) => { g.save(); g.globalAlpha *= 1 - er; (p.lines || []).forEach((ln, i) => text(g, ln, x + w / 2, y + h * (0.25 + i * 0.25), { size: 54, font: FONTS.hand, color: '#f2efe0', alpha: clamp((t - 0.3 - i * 0.6) * 2) })); seg(g, [[x + w * 0.1, y + h * 0.85], [x + w * (0.1 + 0.8 * clamp(t / 2)), y + h * 0.85]], 5, '#f2c14a'); g.restore(); if (p.after && er > 0.5) text(g, p.after, x + w / 2, y + h / 2, { size: 64, font: FONTS.hand, color: '#f2efe0', alpha: (er - 0.5) * 2 }); } });
  layer(g, cam, 1, (g) => { you(g, { x: W * 0.82, y: r.GY, t, inv: p.inv ?? 0.93, facing: -1, pose: idle('point', t), expr: 'calm', look: [-1, -0.3], rimC: r.M.rim }); });
};

T.fogRule = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); const r = G.fogWindow(g, t, cam, { fog: 0.6 });
  const s0 = lw(info, p.w || '', 0.3);
  G.fogWriting(g, p.str, W * 0.5, H * 0.38, { size: 150, reveal: prog(t, s0, s0 + 1.2) });
  if (p.sub) G.fogWriting(g, p.sub, W * 0.5, H * 0.62, { size: 80, reveal: prog(t, (p.subT ?? s0 + 1.2), (p.subT ?? s0 + 1.2) + 1.2) });
};

T.bedroom = (g, t, info, p) => {
  const cam = cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.08, x0: p.x0 ?? -20, x1: p.x1 ?? 20, y0: p.y0 ?? 0, y1: p.y1 ?? 0 }); const r = G.bedroom(g, t, cam, { mood: p.mood || 'day', lamp: p.lamp ?? 0 });
  layer(g, cam, 1, (g) => {
    const x = W * (p.youX ?? 0.56);
    if (p.mode === 'wake') { const inv = ease.inOut(prog(t, 0.6, 2.2)) * 0.94; you(g, { x: W * 0.3, y: r.GY - 12, t, inv, pose: idle('sitFront', t), expr: t > 1.8 ? 'surprised' : 'sleepy', look: [0, 0.6], rimC: r.M.rim }); }
    else if (p.mode === 'joy') { const j = Math.abs(Math.sin(t * 4.2)); you(g, { x, y: r.GY - j * 120, t, inv: 0.94, pose: gPosesAt(t, [[0, 'cheer']]), expr: 'joy', rimC: r.M.rim, shadow: false }); G.softShadow(g, x, r.GY, 80 - j * 30, 10, 0.3); }
    else if (p.mode === 'dressed') { const k = ease.out(prog(t, 0.5, 1.6)); L.emptyClothes(g, { x, y: r.GY, pose: idle(gPosesAt(t, [[0, 'stand'], [1.4, 'handsOnHips']]), t), alpha: k, t }); you(g, { x, y: r.GY, t, inv: 0.94, alpha: 1 - k * 0.7, rimC: r.M.rim }); }
    else if (p.mode === 'down') you(g, { x, y: r.GY, t, inv: 0.94, expr: exprAt(t, p.expr || [[0, 'surprised']]), look: [0.1, 1], pose: idle(gPosesAt(t, [[0, 'stand'], [0.6, 'holdUp']]), t), rimC: r.M.rim });
    else you(g, { x, y: r.GY, t, inv: 0.94, expr: exprAt(t, p.expr || [[0, 'look']]), rimC: r.M.rim, pose: idle(p.pose || 'stand', t) });
    if (p.rug) { /* carpet visible straight through the body */ g.fillStyle = alpha('#c86a5a', 0.85); g.beginPath(); g.ellipse(x, r.GY + 40, 380, 60, 0, 0, Math.PI * 2); g.fill(); }
  });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.8, H * 0.16, { start: lw(info, p.pillW || '', 0.6) });
};

// close insert: invisible body in front of a patterned carpet (hands / feet / stomach)
T.carpet = (g, t, info, p) => {
  const cam = camAdd(camPath(t, [[0, { z: p.z0 ?? 1.0 }], [info.dur, { z: p.z1 ?? 1.08 }]]), drift(t, 4, 2));
  layer(g, cam, 1, (g) => { g.fillStyle = '#b85a4a'; g.fillRect(-W, -H, W * 3, H * 3); g.strokeStyle = alpha('#f2d8a0', 0.6); g.lineWidth = 10; rr(g, W * 0.06, H * 0.08, W * 0.88, H * 0.84, 30); g.stroke();
    for (let i = -2; i < 18; i++) for (let k = -1; k < 10; k++) { g.save(); g.translate(i * 120 + (k % 2) * 60, k * 120); g.rotate(Math.PI / 4); g.fillStyle = (i + k) % 3 ? '#e8b84a' : '#5a7ab8'; g.fillRect(-22, -22, 44, 44); g.restore(); }
    const s = p.big ? 3.4 : 2.4; you(g, { x: W * 0.5, y: H * (p.big ? 1.3 : 1.12), t, inv: 0.96, s, pose: idle(gPosesAt(t, [[0, 'stand'], [0.5, 'holdUp']]), t), expr: 'shocked', look: [0, 1], rimC: '#fff4e0', shadow: false });
    if (p.big) { glow(g, W * 0.5, H * 0.62, 260, '#ffffff', 0.12); } });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.1, { start: 0.4 });
};

T.dream = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = G.bedroom(g, t, cam, { mood: 'home', lamp: 1 });
  layer(g, cam, 1, (g) => person(g, { x: W * 0.36, y: r.GY, t, s: 1.6, outfit: L.KID, expr: 'thinking', pose: idle('think', t), rimC: r.M.rim }));
  UI.bubble(g, W * 0.6, H * 0.3, { t, start: 0.5, w: 360, h: 220, thought: true, tail: [-160, 120], icon: (g, x, y) => { drawGlow(g, { x, y: y + 90, s: 0.55, outfit: L.KID, invisible: 0.94, edgeColor: '#5a8ad8', expr: 'sly', rim: false }); } });
  if (p.q) kText(g, t, p.q, W * 0.5, H * 0.88, { start: lw(info, 'what', 0.3), mode: 'rise', size: 60, font: FONTS.serif, weight: 900 });
};

T.venue = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.08, x0: -30, x1: 30 }); const fn = { cinema: L.cinema, concert: L.concert, lockers: L.lockers }[p.v];
  const r = fn(g, t, cam, {});
  layer(g, cam, 1.05, (g) => { const y = p.v === 'lockers' ? r.GY : H * 0.98; you(g, { x: W * 0.2 + t * 70, y, t, s: p.v === 'lockers' ? 1.5 : 1.7, inv: 0.94, pose: gWalk(t * 5.4), turn: 0.85, expr: 'sly', rimC: '#fff', edge: '#e8f2ff' }); });
  if (p.v === 'lockers') layer(g, cam, 1, (g) => { for (let i = 0; i < 2; i++) person(g, { x: W * (0.62 + i * 0.16), y: r.GY, t, outfit: [L.C.olive, L.C.blue][i], seed: i, expr: 'bored', facing: -1, pose: idle(i ? 'phone' : 'crossArms', t), prop: i ? 'phone' : null, rimC: r.M.rim }); });
  UI.tag(g, t, p.label, W * 0.5, H * 0.08, { start: 0.15 });
};

T.power = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.1, x0: 30, x1: -30 }); const r = L.meetingRoom(g, t, cam, {});
  layer(g, cam, 1, (g) => { const rim = '#cfe0ff'; for (let i = 0; i < 4; i++) person(g, { x: W * (0.24 + i * 0.17), y: r.GY - 190, s: 1.4, t, seed: i, outfit: { top: 'jacket', color: ['#2a3046', '#3a3a4a', '#4a3a3a', '#2a3a4a'][i], ...(i === 1 ? { glasses: true } : {}) }, facing: i < 2 ? 1 : -1, pose: idle(i === 1 ? 'point' : 'sitFront', t), expr: i === 1 ? 'determined' : 'calm', look: [i < 2 ? 1 : -1, 0], rimC: rim, talk: i === 1 ? 0.5 + 0.5 * Math.sin(t * 15) : 0 });
    L.boardTable(g, r.GY); you(g, { x: W * 0.47, y: r.GY - 240, t, inv: 0.95, s: 1.5, expr: 'sly', look: [-0.6, 0.2], rimC: rim, edge: '#dfe8ff' }); });
  UI.tag(g, t, 'TOP SECRET MEETING', W * 0.5, H * 0.08, { start: 0.3 });
};

T.shop = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const r = L.shop(g, t, cam, { noSign: !!p.label });
  layer(g, cam, 1, (g) => {
    const x = W * (p.youX ?? 0.42) + (p.walk ? t * 80 : 0);
    if (p.thermal) { /* nothing */ }
    you(g, { x, y: r.GY, t, inv: 0.95, s: 1.6, expr: exprAt(t, p.expr || [[0, 'sly']]), pose: p.walk ? gWalk(t * 5.4) : idle(gPosesAt(t, [[0, 'stand'], [1.0, 'holdUp']]), t), turn: p.walk ? 0.85 : 0.2, rimC: '#ffffff', edge: '#cfe0ff' });
    if (p.floatItem) { const k = ease.out(prog(t, 1.0, 1.6)); rr(g, x + 46, r.GY - 380 - k * 40, 60, 90, 10); g.fillStyle = '#e86a5a'; g.fill(); rr(g, x + 46, r.GY - 350 - k * 40, 60, 24, 4); g.fillStyle = '#f2efe8'; g.fill(); }
    if (p.cashier) person(g, { x: W * 0.8, y: r.GY, t, outfit: L.C.mustard, facing: -1, expr: 'bored', pose: idle('phone', t), prop: 'phone', look: [-0.2, 0.7], rimC: '#fff' });
  });
  if (p.cctv) { L.cctv(g, W * 0.86, H * 0.06, 1.4, 2.6); const s0 = lw(info, 'camera', 2); UI.tag(g, t, 'NO ONE DETECTED', W * 0.76, H * 0.4, { start: s0, size: 28 }); }
  if (p.label) UI.tag(g, t, p.label, W * 0.5, H * 0.08, { start: 0.2 });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
};

T.eye = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.04 }); G.studio(g, t, cam, { mood: 'data', spot: 0.1 });
  const cx = W * 0.42, cy = H * 0.5, R = 260, m = p.mode;
  layer(g, cam, 1, (g) => {
    L.eyeDiagram(g, t, cx, cy, R, { inv: m === 'through' || m === 'none' ? 1 : 0 });
    const s0 = lw(info, p.w || '', 0.4), k = prog(t, s0, s0 + 1.2), sx = W * 0.98;
    if (m === 'catch' || m === 'retina') { L.lightRay(g, sx, cy - 30, cx - R * 0.86, cy, k); if (k >= 1) { glow(g, cx - R * 0.88, cy, 120, '#ff8a6a', 0.6 * (0.7 + 0.3 * Math.sin(t * 6))); } }
    if (m === 'retina') { const k2 = ease.out(prog(t, lw(info, 'brain', 2.2), lw(info, 'brain', 2.2) + 0.8)); UI.arrow(g, t, [cx - R * 1.45, cy - 20], [W * 0.12, H * 0.3], { start: lw(info, 'brain', 2.2) - 0.3 }); if (k2 > 0) { g.save(); g.globalAlpha *= k2; rr(g, W * 0.02, H * 0.06, 260, 180, 14); g.fillStyle = '#f2efe8'; g.fill(); g.fillStyle = linGrad(g, 0, H * 0.06, 0, H * 0.06 + 180, ['#9ac4f2', '#e8f2ff']); g.fillRect(W * 0.02 + 14, H * 0.06 + 14, 232, 152); circle(g, W * 0.02 + 180, H * 0.06 + 60, 26, '#f2c14a'); G.blobTree(g, W * 0.02 + 80, H * 0.06 + 160, 0.35, { color: '#5a9a5a', seed: 2 }); g.restore(); } }
    if (m === 'through' || m === 'none') { L.lightRay(g, sx, cy - 30, -50, cy + 20, k); if (k > 0.75) glow(g, 40, cy, 200, '#ffe27a', 0.4); }
    if (p.labels !== false) { UI.tag(g, t, 'RETINA', cx - R * 0.7, cy + R * 0.82, { start: 0.3, size: 26 }); UI.tag(g, t, 'LENS', cx + R * 0.8, cy - R * 0.62, { start: 0.5, size: 26 }); }
  });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.8, H * 0.2, { start: lw(info, p.pillW || '', 0.5) });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.12, { start: lw(info, p.ktW || '', 0.5), mode: p.ktMode || 'rise', size: 64, color: '#ffffff' });
  if (p.meter != null) UI.meterBar(g, t, { label: 'LIGHT ABSORBED', v: p.meter, x: W * 0.62, y: H * 0.86, w: W * 0.3, start: 0.3 });
};

// a figure-shaped body with rays passing straight through it
T.through = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = G.studio(g, t, cam, { mood: 'data', spot: 0.14 });
  layer(g, cam, 1, (g) => { you(g, { x: W * 0.5, y: r.GY, t, inv: 0.95, s: 1.9, expr: 'look', look: [1, 0], rimC: '#fff' }); for (let i = 0; i < 5; i++) { const y = H * (0.2 + i * 0.12), k = prog(t, 0.3 + i * 0.15, 1.6 + i * 0.15); L.lightRay(g, W * 1.02, y, -40, y + 10, k, i % 2 ? '#ffe27a' : '#fff4c8', 7); }
    if (p.warm) { glow(g, W * 0.5, r.GY - 300, 380, '#ff8a3a', 0.5 * (0.8 + 0.2 * Math.sin(t * 3))); L.heat(g, W * 0.5, r.GY - 520, 200, t, 1); }
    if (p.heart) { const b = 1 + 0.18 * Math.max(0, Math.sin(t * 7)); L.heart(g, W * 0.5 + 20, r.GY - 390, 3.2 * b); glow(g, W * 0.5 + 20, r.GY - 390, 160, '#ff5a6a', 0.35 * b); } });
  (p.tags || []).forEach(([str, word, x, y], i) => UI.tag(g, t, str, W * x, H * y, { start: lw(info, word, 0.4 + i * 0.8), size: 32 }));
};

T.writer = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.1 }); const r = L.room(g, t, cam, { mood: 'home', night: true, shelf: true, shelfX: W * 0.08, window: true, windowX: W * 0.55, lamp: 1, lampX: W * 0.42 });
  layer(g, cam, 1, (g) => { G.desk ? 0 : 0; rr(g, W * 0.46, r.GY - 200, 560, 30, 8); g.fillStyle = '#6a4a3a'; g.fill(); seg(g, [[W * 0.48, r.GY - 170], [W * 0.48, r.GY]], 14, '#4a3228'); seg(g, [[W * 0.72, r.GY - 170], [W * 0.72, r.GY]], 14, '#4a3228'); for (let i = 0; i < 3; i++) { rr(g, W * 0.5 + i * 18, r.GY - 220 - i * 4, 160, 20, 3); g.fillStyle = '#efe6d0'; g.fill(); }
    person(g, { x: W * 0.66, y: r.GY, t, s: 1.6, outfit: { top: 'coat', color: '#4a3a3a', glasses: true }, facing: -1, pose: idle('typing', t), expr: 'thinking', look: [-0.6, 0.6], rimC: r.M.rim, prop: 'pen' }); });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.84, H * 0.14, { start: lw(info, p.pillW || '', 0.5) });
};

T.book = (g, t, info, p) => {
  const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.08 }]]), drift(t, 3, 3)); blurLayer(g, 8, (g) => L.room(g, t, cam, { mood: 'home', night: true, shelf: true, lamp: 1 })); veil(g, '#1a1420', 0.25);
  const k = spring(t, 0.15, { freq: 1.2, damp: 0.7 }), bx = W * 0.36, by = H * 0.5;
  g.save(); g.translate(bx, by); g.rotate(-0.06 + 0.04 * (1 - k)); g.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
  g.fillStyle = 'rgba(0,0,0,.35)'; rr(g, -200, -270, 420, 560, 16); g.fill(); rr(g, -210, -280, 420, 560, 16); g.fillStyle = '#5a2a2a'; g.fill(); g.fillStyle = '#4a2020'; g.fillRect(-210, -280, 40, 560);
  text(g, 'THE', 20, -170, { size: 44, font: FONTS.sans, weight: 800, color: '#f2c14a', spacing: 8 }); text(g, 'INVISIBLE', 20, -110, { size: 54, font: FONTS.sans, weight: 800, color: '#f2c14a', spacing: 4 }); text(g, 'MAN', 20, -50, { size: 64, font: FONTS.sans, weight: 800, color: '#f2c14a', spacing: 10 });
  drawGlow(g, { x: 20, y: 200, s: 0.65, outfit: { top: 'coat', color: '#3a2a2a', hat: 'cap', hatColor: '#2a1a1a', glasses: 'sun' }, invisible: 0.9, edgeColor: '#f2c14a', rim: false }); text(g, 'H. G. WELLS', 20, 250, { size: 30, font: FONTS.sans, weight: 700, color: '#e8d8b8', spacing: 6 });
  g.restore();
  if (p.pill) UI.pill(g, t, p.pill, W * 0.72, H * 0.3, { start: lw(info, p.pillW || '', 0.4) });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.72, H * 0.5, { start: lw(info, p.tagW || '', 0.8) });
  if (p.cite) UI.cite(g, p.cite, { t, start: 0.6 });
};

T.question = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const r = L.room(g, t, cam, { mood: 'home', night: true, lamp: 1, shelf: true, shelfX: W * 0.86, plant: false });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) person(g, { x: W * (0.22 + i * 0.16), y: r.GY, t, seed: i, outfit: [L.C.taupe, L.C.navy, L.C.mustard, L.C.coral][i], facing: i < 2 ? 1 : -1, pose: idle(i === 1 ? 'pointUp' : i === 2 ? 'think' : 'holdFront', t), prop: i === 0 || i === 3 ? 'book' : null, expr: i === 2 ? 'confused' : 'thinking', look: [i < 2 ? 1 : -1, -0.2], rimC: r.M.rim }); });
  UI.bubble(g, W * 0.5, H * 0.18, { str: p.bub || '?', w: p.bubWd || 140, h: 110, t, start: 0.5, size: p.bub ? 40 : 64, tail: [-60, 60] });
};

T.wellsMan = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: -40 }, drift(t, 5, 6)); blurLayer(g, 7, (g) => G.street(g, t, cam, { mood: 'rainy' })); veil(g, '#101428', 0.15);
  const R = 230, cx = W * 0.5, cy = H * 0.62;
  bigGlow(g, cx, cy, R, { outfit: { top: 'coat', color: '#3a2a2a', hat: 'cap', hatColor: '#2a1a1a' }, expr: 'neutral', rim: { color: '#dfe6ff' }, eyeColor: 'rgba(0,0,0,0)' });
  // bandages + dark glasses
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip(); for (let i = 0; i < 9; i++) { g.save(); g.translate(cx, cy - R + i * 52); g.rotate(i % 2 ? 0.08 : -0.08); rr(g, -R * 1.2, -20, R * 2.4, 44, 10); g.fillStyle = i % 2 ? '#efe8dc' : '#e2d8c8'; g.fill(); g.restore(); } g.restore();
  for (const dx of [-70, 70]) { circle(g, cx + dx, cy - 20, 58, '#1a1a22'); circle(g, cx + dx - 16, cy - 36, 12, alpha('#ffffff', 0.4)); } seg(g, [[cx - 14, cy - 24], [cx + 14, cy - 24]], 10, '#1a1a22');
  if (p.bub) UI.bubble(g, W * 0.8, H * 0.24, { str: p.bub, w: 340, h: 110, t, start: 0.4, thought: true, tail: [-120, 60], size: 34 });
};

T.dots = (g, t, info, p) => {
  const cam = camAdd(camPath(t, [[0, { z: p.z0 ?? 1.0 }], [info.dur, { z: p.z1 ?? 1.12 }]]), drift(t, 3, 8)); const r = L.room(g, t, cam, { mood: 'day', door: true, doorX: W * 0.06, frame: true, frameX: W * 0.72, window: false, plant: true });
  const hy = r.GY - 360, x = W * 0.5 + Math.sin(t * 0.8) * 8, b = blinkAt(t, 3.5);
  layer(g, cam, 1, (g) => { for (const dx of [-26, 26]) { g.fillStyle = '#14141e'; g.beginPath(); g.ellipse(x + dx, hy + Math.sin(t * 1.3) * 3, 9, b ? 1.5 : 12, 0, 0, Math.PI * 2); g.fill(); } G.softShadow(g, x, r.GY, 60, 8, 0.12);
    if (p.ruler) { const k = ease.out(prog(t, lw(info, 'height', 2.5), lw(info, 'height', 2.5) + 0.8)); seg(g, [[W * 0.62, r.GY], [W * 0.62, r.GY - 360 * k]], 4, '#ffad45'); seg(g, [[W * 0.6, r.GY - 360 * k], [W * 0.64, r.GY - 360 * k]], 4, '#ffad45'); if (k > 0.9) text(g, '≈ 1.7 m', W * 0.66, r.GY - 180, { size: 40, font: FONTS.sans, weight: 800, color: '#ffad45', align: 'left' }); } });
  if (p.ringT != null) { const k = spring(t, p.ringT, { freq: 1.4, damp: 0.6 }); layer(g, cam, 1, (g) => ring(g, x, hy, 90 * k, 5, alpha('#ffad45', clamp(k)))); }
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.1, { start: lw(info, p.tagW || '', 0.5) });
};
