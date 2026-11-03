import { shot, closeup, insert, plain, tri, timeCard, ghost, ghostFace, eyesAt, wt, E, V, mood, S, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, rng, glow, alpha, shade, mix, rr, seg, poly, circle, ring, linGrad, radGrad, text, FONTS, drawFigure, POSES, headPos, FX, UI, camPath, camAdd, impact, spring, kText, drift, GYf, CXf, SC, poseOf, walkPose } from '../_lib.js';
import { room, street, bp, voidBg, hill } from '../_sets.js';
import { walker, eyeShape, phone, table, chair, arrow, hand, bubble2 } from '../_props.js';

timeCard('s012', 7, 12, 'AM', { mood: 'golden', from: 6, sunX: 0.3, sunY: 0.62, sub: 'IT STARTS' });

// s013 — POV down: the carpet, and nothing where your feet should be
plain('s013', (g, t, info) => {
  const M = mood('interiorWarm'), k = ease.inOut(prog(t, 0, info.dur)), cy = E.H * 0.5 + (1 - k) * -200;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, [shade('#5a3f66', -0.3), shade('#5a3f66', -0.05), shade('#5a3f66', -0.4)]); g.fillRect(0, 0, E.W, E.H);
  const r = rng(3); for (let i = 0; i < 260; i++) { circle(g, r() * E.W, ((r() * E.H * 1.4) + (1 - k) * 200) % E.H, 2.6, alpha('#d8c8f0', 0.12)); }
  g.fillStyle = shade('#2a2238', -0.2); poly(g, [[0, 0], [E.W * 0.34, 0], [E.W * 0.2, E.H * 0.2 + (1 - k) * 80], [0, E.H * 0.28 + (1 - k) * 80]], shade('#2a2238', -0.1));
  for (const [dx, f] of [[-170, 1], [170, 1]]) { const x = E.W / 2 + dx, y = cy + 330; g.save(); g.setLineDash([14, 12]); g.strokeStyle = 'rgba(220,232,255,.5)'; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y, 62, 150, 0, 0, 7); g.stroke(); g.setLineDash([]); g.fillStyle = 'rgba(220,232,255,.07)'; g.beginPath(); g.ellipse(x, y, 62, 150, 0, 0, 7); g.fill(); g.restore(); }
  glow(g, E.W * 0.78, E.H * 0.2, 700, '#ffd59a', 0.25); veil(g, '#000', 0.25);
});
// s014 — "No hands, no feet." two faint hands held up
insert('s014', { set: room, opts: { kind: 'bedroom' }, cam: { z: [1.5, 1.6], x: [-60, 0] }, draw(g, t, info) {
  const w = ease.out(prog(t, 0.3, 1.0));
  g.save(); g.globalAlpha = 0.2 * (1 - 0.3 * Math.sin(t * 3)); hand(g, E.W * 0.34, E.H * 0.5 - 20 * w, 1.9, { ink: '#dfe8ff', sleeve: '#dfe8ff', facing: -1, rim: '#ffffff' }); hand(g, E.W * 0.66, E.H * 0.52 - 20 * w, 1.9, { ink: '#dfe8ff', sleeve: '#dfe8ff', facing: 1, rim: '#ffffff' }); g.restore();
  for (const x of [0.34, 0.66]) { g.save(); g.setLineDash([12, 10]); g.strokeStyle = 'rgba(220,232,255,.55)'; g.lineWidth = 3; g.beginPath(); g.arc(E.W * x, E.H * 0.5, 130, 0, 7); g.stroke(); g.restore(); }
} });
// s015 — the carpet straight through where your stomach should be
shot('s015', { set: room, opts: { kind: 'bedroom' }, cam: { path: [[0, { z: 1.05 }], [1, { z: 1.55, y: -40 }]] },
  chars: (t) => [{ who: 'YOU', x: 0.5, s: V(1.7, 1.9), pose: 'relaxed', look: [0.3, 1] , ga: 0.2 }],
  over(g, t, info, env, cam) { const s = V(1.7, 1.9), k = ease.out(prog(t, 0.6, 1.2)), z = cam.z; const x = E.W / 2 + (3 - (cam.x || 0)) , y = E.H / 2 + ((env.GY - 130 * s) - E.H / 2 - (cam.y || 0)) * z;
    g.save(); g.setLineDash([14, 10]); g.strokeStyle = alpha(S().ui.gold, 0.9 * k); g.lineWidth = 4; g.beginPath(); g.arc(E.W / 2 + (x - E.W / 2) * 1, y, 90 * z * k, 0, 7); g.stroke(); g.restore(); } });
// s016 — excitement
shot('s016', { set: room, opts: { kind: 'bedroom' }, cam: { path: [[0, { z: 1.1, x: -30 }], [1, { z: 1.0, x: 40 }]] },
  chars: () => [{ who: 'YOU', x: 0.5, s: V(1.7, 1.9), pose: [[0, 'stand'], [0.5, 'jump'], [1.1, 'cheer'], [1.8, 'jump'], [2.4, 'cheer']], spring: false, blend: 0.18, ga: 0.22 }],
  fx: ['dust', 'streak'], over(g, t) { for (let i = 0; i < 9; i++) { const a = t * 1.6 + i * 0.7; FX.sparkle(g, E.W * 0.5 + Math.cos(a) * (240 + i * 14), E.H * 0.36 + Math.sin(a * 1.3) * 130, 12 + (i % 3) * 5, '#ffe9b0', 0.8); } } });
// s017 — every kid has played this game: hiding under a blanket
shot('s017', { set: room, opts: { kind: 'living' }, cam: { z: [1.05, 1.2], x: [-30, 40] },
  mid0(g, t, info, env) { rr(g, E.W * 0.58, env.GY - 150, 520, 150, 24); g.fillStyle = shade(env.M.wall, -0.3); g.fill(); rr(g, E.W * 0.58, env.GY - 250, 520, 120, 24); g.fillStyle = shade(env.M.wall, -0.2); g.fill(); },
  chars: () => [{ who: 'KID', x: 0.34, s: V(2.0, 2.2), pose: 'facepalm', expr: 'happy', facing: 1, look: [0, 0] }, { who: 'KID', x: 0.46, s: V(1.7, 1.9), pose: [[0, 'stand'], [1, 'wave']], facing: -1, expr: 'smile', seed: 3 }], fx: ['dust'] });
// s018 — "What would I do if nobody could see me?"
shot('s018', { set: room, opts: { kind: 'living' }, cam: { z: [1.15, 1.3], x: [0, -40] }, chars: () => [{ who: 'KID', x: 0.4, s: V(2.0, 2.2), pose: 'think', expr: 'thinking', facing: 1 }],
  over(g, t, info) { const a = ease.outBack(prog(t, 0.3, 0.8)), bx = E.W * 0.62, by = E.H * 0.28; g.save(); g.translate(bx, by); g.scale(a, a);
    for (const [x, y, r] of [[-190, 190, 14], [-150, 150, 22]]) circle(g, x, y, r, '#f4efe6'); g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(0, 0, 210, 120, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(30,40,80,.16)'; g.beginPath(); g.arc(0, -40, 26, 0, 7); g.fill(); seg(g, [[0, -14], [0, 50]], 30, 'rgba(30,40,80,.14)'); seg(g, [[0, 50], [-16, 96]], 14, 'rgba(30,40,80,.14)'); seg(g, [[0, 50], [16, 96]], 14, 'rgba(30,40,80,.14)');
    for (const dx of [-10, 12]) { circle(g, dx, -44, 4.2, '#0a0a12'); } text(g, '?', 120, 0, { size: 90, color: '#d64a33', weight: 800 }); g.restore(); } });

// s019 — any cinema, any concert, any locker room
const eyesDot = (g, x, y, s = 1) => { for (const dx of [0, 14]) { circle(g, x + dx * s, y, 3.4 * s, '#05060a'); ring(g, x + dx * s, y, 5.2 * s, 1.4, 'rgba(210,225,255,.6)'); } };
tri('s019', [
  (g, t, info) => { const M = mood('night'); g.fillStyle = '#07070d'; g.fillRect(0, 0, E.W, E.H); const sx = E.W * 0.2, sw = E.W * 0.6, sy = E.H * 0.1;
    g.fillStyle = linGrad(g, 0, sy, 0, sy + E.H * 0.4, ['#f2efe8', '#7aa0d8']); g.fillRect(sx, sy, sw, E.H * 0.4); FX.godRays(g, E.W / 2, sy + E.H * 0.2, { count: 8, angle: Math.PI / 2, spread: 1.2, len: 1100, a: 0.05, t });
    for (let row = 0; row < 5; row++) for (let i = 0; i < 12; i++) { const x = E.W * 0.1 + i * E.W * 0.075 + (row % 2) * 30, y = E.H * 0.62 + row * 74; circle(g, x, y, 28 + row * 5, '#07070d'); g.fillStyle = '#07070d'; g.fillRect(x - 36 - row * 4, y + 12, 72 + row * 8, 90); }
    eyesDot(g, E.W * 0.5, E.H * 0.62 + 2 * 74 - 8, 2.2); text(g, 'CINEMA', E.W * 0.5, E.H * 0.9, { size: 40, color: alpha('#cfe0ff', 0.7), font: FONTS.ui, weight: 900, spacing: 8 }); },
  (g, t, info) => { backdrop(g, ['#14081f', '#3a1450', '#7a2a6a']); for (let i = 0; i < 6; i++) { const x = E.W * (0.1 + i * 0.16), a = Math.sin(t * 2 + i) * 0.3; g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radGrad(g, x, 0, 0, E.H, [alpha(['#ff4fa3', '#5ff2e8', '#ffd47e'][i % 3], 0.35), 'rgba(0,0,0,0)']); g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 260 + a * 200, E.H); g.lineTo(x - 260 + a * 200, E.H); g.fill(); g.restore(); }
    FX.crowd(g, t, { x: -40, y: E.H * 0.62, w: E.W + 80, rows: 6, rowH: 70, size: 3.4, color: '#0a0710', cheer: 1, seed: 8 }); eyesDot(g, E.W * 0.5, E.H * 0.68, 2.2); text(g, 'CONCERT', E.W * 0.5, E.H * 0.12, { size: 40, color: alpha('#ffffff', 0.7), font: FONTS.ui, weight: 900, spacing: 8 }); },
  (g, t, info) => { const M = mood('interiorCool'); backdrop(g, [shade(M.wall, -0.3), shade(M.wall, -0.1)]); const r = rng(6); for (let i = 0; i < 9; i++) { const x = i * E.W * 0.12 - 40; g.fillStyle = ['#2a4a6a', '#3a5a7a'][i % 2]; g.fillRect(x, E.H * 0.18, E.W * 0.1, E.H * 0.5); for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + 30, E.H * 0.24 + k * 14, E.W * 0.05, 4); } g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 6, E.H * 0.18, 8, E.H * 0.5); }
    g.fillStyle = shade(M.floor, 0.05); g.fillRect(0, E.H * 0.68, E.W, E.H); rr(g, E.W * 0.3, E.H * 0.72, E.W * 0.4, 40, 8); g.fillStyle = '#6a4a2a'; g.fill(); glow(g, E.W / 2, E.H * 0.1, 800, '#e8f2ff', 0.2); eyesDot(g, E.W * 0.5, E.H * 0.5, 2.4); text(g, 'LOCKER ROOM', E.W * 0.5, E.H * 0.9, { size: 40, color: alpha('#cfe0ff', 0.7), font: FONTS.ui, weight: 900, spacing: 8 }); },
]);

// s020 — stand behind the most powerful people on Earth and listen
shot('s020', { set: room, opts: { kind: 'office', mood: 'interiorWarm' }, cam: { path: [[0, { z: 1.0, x: -80 }], [1, { z: 1.3, x: 80, y: -30 }]] },
  mid0(g, t, info, env) { chair(g, E.W * 0.3, env.GY, 1.5, 1); chair(g, E.W * 0.7, env.GY, 1.5, -1); },
  chars: (t, info, env) => { const o = (c, x, f, p = 'sit') => ({ who: { top: 'suit', color: c, head: 'none' }, x: E.W * x, s: 1.5, facing: f, pose: p, expr: 'neutral', shadow: false }); return [{ who: 'YOU', x: 0.52, y: env.GY - 30, s: 1.2, pose: 'stand', ga: 0.1, look: [0, 0] }, o('#2a3a5a', 0.3, 1), o('#4a2a3a', 0.4, 1), { ...o('#2a2a3a', 0.7, -1), talk: (t % 2 < 1.2) ? 0.6 : 0 }, o('#3a4a3a', 0.6, -1)]; },
  mid(g, t, info, env) { rr(g, E.W * 0.22, env.GY - 150, E.W * 0.56, 22, 8); g.fillStyle = shade(env.M.wall, -0.1); g.fill(); seg(g, [[E.W * 0.28, env.GY - 130], [E.W * 0.28, env.GY - 6]], 12, shade(env.M.wall, -0.4)); seg(g, [[E.W * 0.72, env.GY - 130], [E.W * 0.72, env.GY - 6]], 12, shade(env.M.wall, -0.4)); }, fx: ['dust'] });

// s021 — take whatever you want from any shop; no camera ever catches your face
shot('s021', { set: room, opts: { kind: 'shop' }, cam: { z: [1.0, 1.18], x: [-60, 40] },
  chars: () => [{ who: 'YOU', x: 0.48, s: V(1.6, 1.8), pose: [[0, 'stand'], [0.8, 'reach'], [3, 'holdFront']], ga: 0.18 }],
  mid(g, t, info, env) { const gy = env.GY, cols = ['#d64a33', '#f2c21a', '#3a6ea5', '#3fb950'];
    for (let i = 0; i < 4; i++) { const k = ease.inOut(prog(t, 0.8 + i * 0.9, 1.9 + i * 0.9)); const x = lerp(E.W * (0.2 + i * 0.1), E.W * 0.55 + i * 22, k), y = lerp(gy - 340, gy - 250 - i * 14, k) - Math.sin(k * 3.14) * 90; rr(g, x - 28, y - 36, 56, 72, 6); g.fillStyle = cols[i]; g.fill(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x - 28, y + 8, 56, 28); }
    const cx = E.W * 0.82, cy = gy - V(660, 900), a = -0.4 + Math.sin(t * 1.2) * 0.9;                                          // CCTV sweeping
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radGrad(g, cx, cy, 0, 620, ['rgba(255,80,60,.28)', 'rgba(255,80,60,0)']); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(Math.PI / 2 + a + 0.35) * 680, cy + Math.sin(Math.PI / 2 + a + 0.35) * 680); g.lineTo(cx + Math.cos(Math.PI / 2 + a - 0.35) * 680, cy + Math.sin(Math.PI / 2 + a - 0.35) * 680); g.fill(); g.restore();
    rr(g, cx - 40, cy - 22, 80, 44, 8); g.fillStyle = '#16141c'; g.fill(); circle(g, cx - 30, cy, 9, '#0a0a10'); circle(g, cx + 28, cy - 12, 5, Math.sin(t * 6) > 0 ? '#ff3a30' : '#601510'); },
  fx: ['dust'] });

// s022 — the greatest morning of your life: rooftop sunrise
function rooftop(g, t, cam) { const M = mood('golden'), GY = GYf(); layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.7, GY - V(240, 500), 100, '#fff3dc', M.key, 6); FX.godRays(g, E.W * 0.7, GY - V(240, 500), { count: 16, angle: -Math.PI / 2, spread: Math.PI * 1.7, len: 1900, a: 0.07, t }); FX.clouds(g, { y: GY - V(700, 1200), h: 220, color: '#ffe7c7', a: 0.2, seed: 5 }); });
  layer(g, cam, 0.4, (g) => FX.skyline(g, { x: -E.W, y: GY - 10, w: E.W * 3, minH: 120, maxH: V(420, 640), color: shade(M.dark, 0.2), windowColor: alpha(M.practical, 0.8), lit: 0.25, seed: 14 }));
  layer(g, cam, 0.9, (g) => { g.fillStyle = shade(M.dark, -0.1); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); g.fillStyle = shade(M.dark, 0.2); g.fillRect(-E.W, GY - 12, E.W * 3, 16); });
  return { GY, CX: E.W / 2, M }; }
shot('s022', { set: rooftop, cam: { path: [[0, { z: 1.25, y: 70 }], [1, { z: 1.0, y: -10 }]] }, chars: () => [{ who: 'YOU', x: 0.36, s: V(1.7, 1.9), pose: [[0, 'stand'], [0.8, 'cheer']], ga: 0.3, eyeGlow: 0.5 }], fx: ['dust', 'streak'] });

// s023 — you try to open your eyes wider, and something's wrong
closeup('s023', { ghost: true, set: room, opts: { kind: 'bedroom' }, mood: 'interiorWarm', cam: { z: [1.2, 1.7] }, open: (t, info) => 1 + 0.5 * ease.out(prog(t, 0.3, 1.2)) - 0.9 * ease.inOut(prog(t, 3.2, 4.8)) * (0.6 + 0.4 * Math.sin(t * 40)), ga: 0.2, veilA: 0.45,
  over(g, t, info, c) { const d = ease.inOut(prog(t, 2.8, 5)); g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * (0.55 - 0.3 * d), E.H * 0.9, ['rgba(0,0,0,0)', `rgba(0,0,0,${0.35 + 0.6 * d})`]); g.fillRect(0, 0, E.W, E.H); g.restore(); } });

// s024 — Rule #1
plain('s024', (g, t, info) => { UI.blueprint(g); const gold = S().ui.gold, cx = E.W / 2, cy = E.H / 2, k = ease.outBack(prog(t, 0.1, 0.7));
  g.save(); g.translate(cx, cy - 20); g.scale(k, k); ring(g, 0, 0, V(210, 200), 8, gold); glow(g, 0, 0, 360, gold, 0.18); text(g, '1', 0, 6, { size: V(280, 260), color: gold, weight: 800, glow: 30, glowColor: alpha(gold, 0.6) }); g.restore();
  kText(g, t, 'THE FIRST RULE', cx, cy + V(300, 290), { start: 0.5, mode: 'rise', size: V(64, 60), color: S().ui.cream, spacing: 8, glow: 12 }); });

// ---- eye diagram (blueprint) ----
export function eyeDiagram(g, t, o = {}) {
  const c = UI.bpStroke(), gold = S().ui.gold, cx = o.cx ?? E.W * 0.55, cy = o.cy ?? E.H * 0.5, R = o.R ?? V(250, 230), p = o.p ?? 1, through = o.through, rays = o.rays ?? 5;
  g.save(); g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke(); g.fillStyle = alpha(c, 0.05); g.fill();
  g.beginPath(); g.ellipse(cx - R * 0.55, cy, R * 0.1, R * 0.38, 0, 0, 7); g.stroke(); g.fillStyle = alpha(c, 0.12); g.fill();
  seg(g, [[cx - R * 0.78, cy - R * 0.6], [cx - R * 0.55, cy - R * 0.42]], 5, c); seg(g, [[cx - R * 0.78, cy + R * 0.6], [cx - R * 0.55, cy + R * 0.42]], 5, c);
  const retA = o.retinaA ?? 1; g.setLineDash(o.retinaDash ? [12, 12] : []); g.strokeStyle = alpha(through ? c : gold, retA * (o.retinaDash ? 0.5 : 1)); g.lineWidth = 11; g.beginPath(); g.arc(cx, cy, R - 10, -0.95, 0.95); g.stroke(); g.setLineDash([]);
  if (o.nerve) { seg(g, [[cx + R * 0.7, cy + R * 0.62], [cx + R * 1.0, cy + R * 0.9], [o.nerve[0], o.nerve[1]]], 8, alpha(c, 0.7)); }
  const F = [cx + R - 14, cy]; const x0 = cx - R - V(520, 300);
  for (let i = 0; i < rays; i++) { const k = i - (rays - 1) / 2, y0 = cy + k * R * 0.17, L = [cx - R * 0.55, cy + k * R * 0.17 * 0.95];
    const dx = F[0] - L[0], dy = F[1] - L[1], ex = through ? cx + R + V(520, 280) : F[0], ey = through ? F[1] + dy / dx * (ex - F[0]) : F[1];
    const pts = [[x0, y0], L, [F[0], F[1]], ...(through ? [[ex, ey]] : [])];
    let len = 0; const ls = []; for (let j = 1; j < pts.length; j++) { ls.push(Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1])); len += ls[j - 1]; }
    let rem = len * p; const dr = [pts[0]]; for (let j = 1; j < pts.length && rem > 0; j++) { const f = Math.min(1, rem / ls[j - 1]); dr.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)]); rem -= ls[j - 1]; }
    seg(g, dr, 4, alpha('#fff3dc', 0.85)); const h = dr[dr.length - 1]; if (p < 1 || !through) glow(g, h[0], h[1], 26, '#fff3dc', 0.8); }
  if (!through && p > 0.95) glow(g, F[0], F[1], 90, gold, 0.8 * (0.7 + 0.3 * Math.sin(t * 8)));
  g.restore(); return { F, cx, cy, R };
}
const brainIcon = (g, x, y, r, c) => { g.strokeStyle = c; g.lineWidth = 6; for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(x + dx * r, y, r * 0.42, r * 0.6, 0, 0, 7); g.stroke(); } seg(g, [[x - r * 0.5, y - r * 0.1], [x - r * 0.2, y + r * 0.15]], 5, c); seg(g, [[x + r * 0.5, y - r * 0.1], [x + r * 0.2, y + r * 0.15]], 5, c); };
const label = (g, str, x, y, c, a = 1, size = V(38, 36)) => text(g, str, x, y, { size, color: c, font: FONTS.ui, weight: 900, spacing: 3, alpha: a });

plain('s025', (g, t, info) => { UI.blueprint(g); const e = eyeDiagram(g, t, { p: ease.inOut(prog(t, 0.3, 3.2)) }); label(g, 'LIGHT', E.W * 0.14, E.H * 0.34, '#fff3dc', ease.out(prog(t, 0.2, 0.6))); label(g, 'EYE', e.cx, e.cy + e.R + 80, UI.bpStroke()); });
plain('s026', (g, t, info) => { UI.blueprint(g); const gold = S().ui.gold, tr = wt(info, 'retina', 1.3), tb = wt(info, 'brain', 3.0);
  const e = eyeDiagram(g, t, { cx: E.W * 0.36, p: ease.inOut(prog(t, 0.1, 1.5)), nerve: [E.W * 0.74, E.H * 0.74] }); label(g, 'RETINA', e.cx + e.R + 40, e.cy - e.R * 0.9, gold, ease.out(prog(t, tr, tr + 0.3)));
  const k = ease.out(prog(t, tb - 0.3, tb + 0.3)); g.save(); g.globalAlpha = k; brainIcon(g, E.W * 0.78, E.H * 0.74, 120, gold); glow(g, E.W * 0.78, E.H * 0.74, 220, gold, 0.15); g.restore(); label(g, 'BRAIN', E.W * 0.78, E.H * 0.74 + 150, gold, k);
  const pf = ease.outBack(prog(t, tb + 0.8, tb + 1.3)); if (pf > 0) { g.save(); g.translate(E.W * 0.78, E.H * 0.28); g.scale(pf, pf); rr(g, -160, -110, 320, 220, 14); g.fillStyle = 'rgba(8,16,36,.9)'; g.fill(); g.strokeStyle = gold; g.lineWidth = 5; g.stroke(); poly(g, [[-120, 70], [-40, -20], [10, 40], [50, -10], [120, 70]], alpha(gold, 0.8)); circle(g, 80, -50, 20, '#fff3dc'); g.restore(); label(g, 'PICTURE', E.W * 0.78, E.H * 0.28 + 150, gold, pf); } });
plain('s027', (g, t, info) => { UI.blueprint(g); const c = UI.bpStroke(), k = ease.inOut(prog(t, 0.2, 2.6)), fx = E.W * 0.5, fy = E.H * 0.82;
  UI.lineFigure(g, { x: fx, y: fy, s: V(2.2, 2.2), pose: POSES.stand, color: alpha(c, 0.35) });
  for (let i = 0; i < 9; i++) { const y = E.H * (0.2 + i * 0.07), xe = lerp(-100, E.W + 100, k); seg(g, [[-100, y], [xe, y]], 4, alpha('#fff3dc', 0.8)); glow(g, xe, y, 22, '#fff3dc', 0.8); }
  label(g, 'LIGHT KEEPS GOING', E.W * 0.5, E.H * 0.1, '#fff3dc', ease.out(prog(t, 1.0, 1.5))); });
plain('s028', (g, t, info) => { UI.blueprint(g); const c = UI.bpStroke(), cx = E.W / 2, cy = E.H / 2, k = ease.inOut(prog(t, 0.2, 1.7));
  g.save(); g.setLineDash([14, 12]); ring(g, cx, cy, V(230, 220), 5, alpha(c, 0.7)); g.fillStyle = alpha(c, 0.07); g.beginPath(); g.arc(cx, cy, V(230, 220), 0, 7); g.fill(); g.restore();
  const xe = lerp(-60, E.W + 60, k); seg(g, [[-60, cy], [xe, cy]], 7, alpha('#fff3dc', 0.9)); glow(g, xe, cy, 50, '#fff3dc', 0.9); });
plain('s029', (g, t, info) => { UI.blueprint(g); const c = UI.bpStroke(), p = ease.inOut(prog(t, 0.3, 3.4)), tb = wt(info, 'head', 4.2);
  const e = eyeDiagram(g, t, { cx: E.W * 0.45, p, through: true, retinaDash: true, retinaA: 1 }); label(g, 'INVISIBLE RETINA', e.cx + e.R * 0.2, e.cy - e.R - 50, c, ease.out(prog(t, 1.0, 1.5)));
  label(g, 'OUT THE BACK', E.W * 0.86, e.cy - 80, '#fff3dc', ease.out(prog(t, tb, tb + 0.4))); });
plain('s030', (g, t, info) => { UI.blueprint(g); const gold = S().ui.gold, coral = S().ui.accent, cx = E.W / 2, cy = E.H * 0.46, k = ease.inOut(prog(t, 0.2, 1.8));
  const v = Math.round(100 * (1 - k)); ring(g, cx, cy, V(220, 210), 12, alpha(UI.bpStroke(), 0.3)); g.save(); g.strokeStyle = v > 0 ? gold : coral; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, V(220, 210), -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - k)); g.stroke(); g.restore();
  text(g, v + '%', cx, cy, { size: V(180, 170), color: v > 0 ? gold : coral, weight: 800, glow: 24, glowColor: alpha(v > 0 ? gold : coral, 0.5) }); label(g, 'LIGHT CAUGHT', cx, cy + V(300, 290), UI.bpStroke(), 1); });
// s031 — a truly invisible person is blind
shot('s031', { set: room, opts: { kind: 'bedroom', night: true, dim: true }, cam: { z: [1.0, 1.3] }, chars: () => [{ who: 'YOU', x: 0.5, s: V(1.7, 1.9), pose: 'relaxed', ga: 0.14, eyeOpen: 0.15, look: [0, 0] }],
  over(g, t, info) { const tb = wt(info, 'blind', 2.9), k = ease.inOut(prog(t, 0.2, tb + 0.4)); veil(g, '#000', 0.78 * k); const ti = tb; kText(g, t, 'BLIND', E.W / 2, E.H * 0.3, { start: ti - 0.1, mode: 'slam', size: V(170, 150), color: S().ui.accent, glow: 30 }); } });
