import { shot, closeup, insert, plain, tri, timeCard, ghost, wt, E, V, mood, S, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, rng, glow, alpha, shade, mix, rr, seg, poly, circle, ring, linGrad, radGrad, text, FONTS, drawFigure, POSES, headPos, FX, UI, camPath, camAdd, impact, spring, kText, drift, GYf, CXf, SC, clothes, poseOf } from '../_lib.js';
import { room, street, bp } from '../_sets.js';
import { walker, eyeShape, chair, arrow, bubble2, footprint, steam, hand } from '../_props.js';

const WRITE = { ...POSES.sit, eF: [24, -176], hF: [52, -200] };
const writer = (x, who = 'WELLS') => ({ who, x, s: V(1.5, 1.7), pose: [[0, WRITE]], facing: 1, expr: 'neutral', shadow: false });
const deskFront = (g, env) => { const c = shade(env.M.floor, -0.3); rr(g, E.W / 2 - V(380, 260), env.GY - 200, V(760, 520), 200, 8); g.fillStyle = c; g.fill(); seg(g, [[E.W / 2 - V(330, 220), env.GY - 190], [E.W / 2 + V(330, 220), env.GY - 190]], 4, alpha('#ffd9a0', 0.3)); const px = E.W / 2 - V(40, 20) + 52 * V(1.5, 1.7), py = env.GY - 200 - 24; seg(g, [[px, py], [px + 40 + Math.sin(g._t || 0) * 4, py - 60]], 3, '#e8e4ee'); };
shot('s032', { set: room, opts: { kind: 'study' }, cam: { path: [[0, { z: 1.0, x: -40 }], [1, { z: 1.22, x: 40 }]] }, chars: () => [writer(E.W / 2 - V(40, 20))], mid: (g, t, info, env) => deskFront(g, env), fx: ['dust'] });
insert('s033', { set: room, opts: { kind: 'study' }, cam: { z: [1.2, 1.3] }, draw(g, t, info) { kText(g, t, '1897', E.W / 2, E.H / 2, { start: 0.1, mode: 'drop', size: V(340, 300), font: FONTS.serif, weight: 900, color: S().ui.gold, glow: 30, italic: true }); } });
insert('s034', { set: room, opts: { kind: 'study' }, cam: { z: [1.2, 1.25] }, draw(g, t, info) {
  const k = ease.outBack(prog(t, 0.1, 0.7)), cx = E.W / 2, cy = E.H / 2, w = V(520, 560), h = V(700, 760); g.save(); g.translate(cx, cy); g.rotate(-0.05); g.scale(k, k);
  rr(g, -w / 2 - 10, -h / 2 + 12, w, h, 12); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill(); rr(g, -w / 2, -h / 2, w, h, 10); g.fillStyle = '#7a2a24'; g.fill(); rr(g, -w / 2 + 24, -h / 2 + 24, w - 48, h - 48, 6); g.strokeStyle = S().ui.gold; g.lineWidth = 4; g.stroke();
  text(g, 'THE', 0, -h / 2 + 96, { size: 44, font: FONTS.serif, weight: 900, color: S().ui.gold, italic: true }); text(g, 'INVISIBLE', 0, -h / 2 + 156, { size: 66, font: FONTS.serif, weight: 900, color: S().ui.gold, italic: true }); text(g, 'MAN', 0, -h / 2 + 224, { size: 66, font: FONTS.serif, weight: 900, color: S().ui.gold, italic: true });
  g.fillStyle = '#1a1018'; g.beginPath(); g.ellipse(0, 40, 130, 26, 0, 0, 7); g.fill(); rr(g, -80, -50, 160, 90, 22); g.fill(); g.fillStyle = '#7a2a24'; g.fillRect(-80, 14, 160, 12);
  for (const dx of [-44, 44]) { circle(g, dx, 120, 34, '#0a0a10'); ring(g, dx, 120, 34, 5, S().ui.gold); } seg(g, [[-10, 120], [10, 120]], 5, S().ui.gold); for (let i = 0; i < 3; i++) seg(g, [[-80, 190 + i * 22], [80, 176 + i * 22]], 12, '#e8e0cc');
  g.restore(); } });
shot('s035', { set: room, opts: { kind: 'study' }, cam: { z: [1.0, 1.15], x: [0, 30] }, chars: () => [{ who: 'WELLS', x: 0.3, s: V(1.5, 1.7), facing: 1, pose: 'think', expr: 'confused' }, { who: 'DOC', x: 0.5, s: V(1.5, 1.7), facing: -1, pose: 'shrug', expr: 'confused', seed: 2 }, { who: { top: 'suit', color: '#3a2a3a', head: 'none' }, x: 0.7, s: V(1.5, 1.7), facing: -1, pose: 'think', expr: 'thinking', seed: 4 }],
  over(g, t, info) { for (const [i, x] of [0.3, 0.5, 0.7].entries()) { const a = ease.outBack(prog(t, 0.5 + i * 0.4, 0.9 + i * 0.4)); bubble2(g, E.W * x, E.H * 0.2, '?', { w: 90, h: 80, a, size: 56 }); } }, fx: ['dust'] });
shot('s036', { set: room, opts: { kind: 'bedroom' }, cam: { z: [1.1, 1.3], x: [-40, 20] }, chars: () => [{ who: 'YOU', x: 0.5, s: V(1.8, 2.0), pose: [[0, 'stand'], [0.6, 'pointUp']], blend: 0.2, ga: 0.22, eyeOpen: 1 }],
  over(g, t) { const k = ease.out(prog(t, 0.7, 1.1)); for (let i = 0; i < 6; i++) FX.sparkle(g, E.W * 0.5 + 60 + Math.cos(i * 1.2 + t * 2) * 100, E.H * 0.26 + Math.sin(i * 1.7 + t * 2) * 60, 14 * k, '#ffe9b0', 0.8 * k); }, fx: ['dust'] });
closeup('s037', { ghost: true, set: room, opts: { kind: 'bedroom' }, mood: 'interiorWarm', cam: { z: [1.4, 1.7] }, ga: 0.2, veilA: 0.5, look: (t) => [Math.sin(t * 1.1) * 0.7, 0.1],
  over(g, t, info, c) { const k = 0.5 + 0.5 * Math.sin(t * 4); for (const dx of [-0.3, 0.3]) FX.rings(g, c.cx + dx * c.r, c.cy - c.r * 0.06, t, { count: 3, r0: c.r * 0.14, r1: c.r * 0.5, color: '#cfe0ff', a: 0.35 + 0.15 * k, speed: 0.8 }); } });
shot('s038', { set: room, opts: { kind: 'hall' }, cam: { z: [1.0, 1.12], x: [-30, 30] }, chars: () => [{ who: 'YOU', x: 0.46, s: V(1.7, 1.9), pose: 'stand', ga: 0.0 }],
  over(g, t, info, env) { const s = V(1.7, 1.9), hx = E.W * 0.46 + 3 * s, hy = env.GY - 208 * s, k = ease.out(prog(t, 0.6, 1.4)); UI.dimension(g, t, { x1: hx + 150, y1: env.GY, x2: hx + 150, y2: hy, str: 'HEAD HEIGHT', start: 0.6 }); g.save(); g.setLineDash([8, 10]); g.strokeStyle = alpha('#cfe0ff', 0.5 * k); g.lineWidth = 2; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + 150, hy); g.stroke(); g.restore(); }, fx: ['dust'] });
closeup('s039a', { ghost: true, set: room, opts: { kind: 'hall' }, mood: 'interiorWarm', cam: { z: [1.5, 1.9] }, ga: 0.03, veilA: 0.6, open: (t) => 1 + 0.12 * Math.sin(t * 5), look: (t) => [0, 0],
  over(g, t, info, c) { for (const dx of [-0.3, 0.3]) glow(g, c.cx + dx * c.r, c.cy - c.r * 0.06, c.r * (0.45 + 0.08 * Math.sin(t * 5)), '#cfe0ff', 0.2); } });
timeCard('t0800', 8, 0, 'AM', { mood: 'day', from: 7.2, sunX: 0.8, sunY: 0.5 });

// 8 a.m.: getting dressed, the mirror, the empty hoodie
shot('s040', { set: room, opts: { kind: 'bedroom' }, cam: { z: [1.15, 1.0], x: [-40, 20] },
  chars: (t) => { const k = ease.inOut(prog(t, 0.2, 1.6)); return [{ who: 'YOU', x: 0.5, s: V(1.7, 1.9), pose: [[0, 'stand'], [0.4, 'reach'], [1.3, 'stand']], ga: 0.2, clothes: k > 0.01, clothesA: k }]; }, fx: ['dust'] });
shot('s041', { set: room, opts: { kind: 'hall' }, cam: { still: true, z: 1 }, chars: () => [{ who: 'YOU', x: 0.3, s: V(1.7, 1.9), pose: 'stand', ga: 0.2, clothes: true, look: [1, 0] }],
  mid(g, t, info, env) { const m = env.mirror, s = V(1.7, 1.9); if (!m) return; g.save(); g.beginPath(); g.rect(m.x, m.y, m.w, m.h); g.clip(); g.globalAlpha = 0.85; clothes(g, { x: m.x + m.w * 0.5, y: m.y + m.h + 40, s: s * 0.78, facing: -1, pose: 'stand', alpha: 1 }); g.restore(); }, fx: ['dust'] });
shot('s042', { set: room, opts: { kind: 'hall' }, cam: { path: [[0, { z: 1.0, x: -40 }], [1, { z: 1.3, x: 20, y: -30 }]] }, chars: () => [{ who: 'YOU', x: 0.5, s: V(1.8, 2.0), pose: 'relaxed', ga: 0.0, clothes: true, look: [0, 0] }], fx: ['dust'] });
shot('s043', { set: room, opts: { kind: 'hall' }, cam: { z: [1.0, 1.08] }, chars: () => [{ who: 'YOU', x: 0.32, s: V(1.7, 1.9), pose: 'stand', ga: 0.2 }, { who: 'YOU', x: 0.68, s: V(1.7, 1.9), pose: 'stand', ga: 0.0, eyes: false, clothes: true, facing: -1, seed: 3 }],
  over(g, t, info, env) { const s = V(1.7, 1.9); UI.callout(g, t, { at: [E.W * 0.32, env.GY - 120 * s], to: [E.W * 0.17, E.H * 0.2], str: 'BODY: INVISIBLE', start: 0.4 }); UI.callout(g, t, { at: [E.W * 0.68, env.GY - 120 * s], to: [E.W * 0.83, E.H * 0.2], str: 'STUFF: VISIBLE', start: wt(info, 'stuff', 2.0) - 0.3, color: S().ui.gold }); }, fx: ['dust'] });
insert('s044', { set: room, opts: { kind: 'hall' }, cam: { z: [1.3, 1.35] }, draw(g, t, info) {
  const items = [['clothes', 'clothes', 0.5], ['phone', 'phone', 2.4], ['keys', 'keys', 3.0], ['shoes', 'shoes', 3.8]], y = E.H * 0.5;
  items.forEach(([n, w, d], i) => { const k = ease.outBack(prog(t, wt(info, w, d) - 0.1, wt(info, w, d) + 0.35)), x = E.W * (0.2 + i * 0.2); g.save(); g.translate(x, y); g.scale(k, k);
    glow(g, 0, 0, 200, '#ffe2a8', 0.12);
    if (i === 0) { seg(g, [[0, -60], [0, 60]], 70, '#d64a33'); seg(g, [[-30, -40], [-70, 40]], 24, '#d64a33'); seg(g, [[30, -40], [70, 40]], 24, '#d64a33'); circle(g, 0, -68, 24, shade('#d64a33', -0.25)); }
    if (i === 1) { rr(g, -44, -80, 88, 160, 14); g.fillStyle = '#0b0b12'; g.fill(); g.fillStyle = '#9fd8ff'; g.fillRect(-36, -68, 72, 124); }
    if (i === 2) { ring(g, -20, -30, 34, 9, '#e8e4ee'); for (let j = 0; j < 3; j++) { seg(g, [[10, 0 + j * 18], [70, 0 + j * 18]], 9, '#e8e4ee'); } seg(g, [[70, 0], [70, 14]], 8, '#e8e4ee'); }
    if (i === 3) for (const dx of [-60, 60]) { rr(g, dx - 50, 10, 100, 44, 18); g.fillStyle = '#f2eef6'; g.fill(); rr(g, dx - 50, -12, 50, 36, 12); g.fill(); g.fillStyle = '#d64a33'; g.fillRect(dx - 44, 42, 90, 8); }
    g.restore(); }); } });
insert('s045', { set: room, opts: { kind: 'hall' }, cam: { z: [1.2, 1.3] }, draw(g, t, info) { const cx = E.W * 0.55, cy = E.H * 0.5, k = ease.inOut(prog(t, 1.0, 1.7));
  rr(g, cx - 330, -50, 660, E.H + 100, 6); g.fillStyle = shade(mood('interiorWarm').wall, -0.45); g.fill(); rr(g, cx - 270, 80, 540, E.H - 140, 4); g.strokeStyle = alpha('#000', 0.3); g.lineWidth = 6; g.stroke();
  g.fillStyle = alpha('#cfe0ff', 0.25 * k); g.fillRect(cx - 330, E.H * 0.93, 660, 14); g.save(); g.translate(cx - 200, cy); circle(g, 0, 0, 38, '#c8bcd0'); g.rotate(-0.5 * k); rr(g, -14, -9, 150, 20, 10); g.fillStyle = '#e8e0f0'; g.fill(); g.restore();
  g.save(); g.globalAlpha = 0.18; hand(g, cx - 290, cy - 10 + 10 * k, 1.5, { ink: '#dfe8ff', sleeve: '#dfe8ff', facing: 1 }); g.restore(); } });
shot('s046', { set: room, opts: { kind: 'hall', doorOpen: 0.9, doorLight: '#dfeaff' }, cam: { z: [1.05, 1.0], x: [-60, 40] },
  mid0(g, t, info, env) { const x = E.W * 0.36; g.fillStyle = '#d64a33'; g.beginPath(); g.ellipse(x, env.GY - 8, 110, 24, 0, 0, 7); g.fill(); g.fillStyle = '#2c3a5a'; g.beginPath(); g.ellipse(x + 70, env.GY - 14, 70, 18, 0.1, 0, 7); g.fill(); seg(g, [[x - 40, env.GY - 20], [x + 20, env.GY - 36]], 16, shade('#d64a33', -0.2)); },
  chars: () => [{ who: 'YOU', walk: { x0: 0.46, x1: 0.8 }, s: V(1.7, 1.9), ga: 0.0 }], fx: ['dust'] });
shot('s047', { set: room, opts: { kind: 'study' }, cam: { path: [[0, { z: 1.3, x: 60 }], [1, { z: 1.0, x: 0 }]] }, chars: () => [writer(E.W / 2 - V(40, 20))], mid: (g, t, info, env) => deskFront(g, env), fx: ['dust'] });

// s048 — London in winter: footprints appearing in snow, steam from nowhere
const prints = (g, GY, x0, x1, k, stride = 95) => { const n = Math.floor(Math.abs(x1 - x0) * k / stride); for (let i = 0; i < n; i++) footprint(g, x0 + (x1 - x0 >= 0 ? 1 : -1) * i * stride, GY + 70 + (i % 2) * 26, 1.1, i % 2 ? -1 : 1, 0.8, 'rgba(30,36,60,.55)'); };
shot('s048', { set: street, opts: { mood: 'night', night: true, lampsOn: true, seed: 11, dim: 0.35 }, cam: { z: [1.1, 1.0], x: [-50, 60] },
  mid0: (g, t, info, env) => prints(g, env.GY, E.W * 0.12, E.W * 0.12 + (E.W * 0.55) * clamp(t / info.dur), 1, 90),
  chars: (t, info) => [{ who: 'YOU', walk: { x0: 0.12, x1: 0.67 }, s: V(1.5, 1.7), ga: 0.2, pose: 'crossArms' }],
  mid(g, t, info, env) { const x = E.W * (0.12 + 0.55 * clamp(t / info.dur)); steam(g, x + 30, env.GY - 210 * V(1.5, 1.7), t, { n: 4 }); }, fx: [['snow', { count: 220 }]] });
plain('s049', (g, t, info) => { UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, cx = E.W / 2, cy = E.H * 0.45, tilt = 0.28 * spring(t, 0.5, { freq: 3, damp: 5 }) - 0.0;
  seg(g, [[cx, cy + 60], [cx, cy + 330]], 10, alpha(c, 0.8)); seg(g, [[cx - 150, cy + 340], [cx + 150, cy + 340]], 12, alpha(c, 0.8));
  g.save(); g.translate(cx, cy); g.rotate(-tilt); seg(g, [[-360, 0], [360, 0]], 12, c); circle(g, 0, 0, 22, gold);
  for (const sx of [-1, 1]) { const x = sx * 360; seg(g, [[x, 0], [x - 90, 190]], 3, alpha(c, 0.7)); seg(g, [[x, 0], [x + 90, 190]], 3, alpha(c, 0.7)); g.save(); g.translate(x, 190); g.rotate(tilt); g.fillStyle = alpha(c, 0.25); g.beginPath(); g.ellipse(0, 0, 110, 22, 0, 0, Math.PI); g.fill();
    if (sx < 0) { g.setLineDash([8, 8]); ring(g, 0, -60, 44, 4, '#dfe8ff'); g.setLineDash([]); for (const dx of [-12, 12]) circle(g, dx, -64, 5, '#dfe8ff'); } else { for (let i = 0; i < 6; i++) seg(g, [[0, -60], [Math.cos(i * 1.047) * 52, -60 + Math.sin(i * 1.047) * 52]], 6, '#bfe0ff'); }
    g.restore(); } g.restore();
  kText(g, t, 'TRADE #1', cx, E.H * 0.13, { start: 0.1, mode: 'slam', size: V(110, 100), color: gold, glow: 22 }); });
shot('s050a', { set: street, opts: { mood: 'storm', dim: 0.4 }, cam: { z: [1.15, 1.05], x: [-20, 30] }, chars: () => [{ who: 'YOU', x: 0.5, s: V(1.7, 1.9), pose: [[0, 'stand'], [1.2, 'sad']], ga: 0.28 }, walker(0.96, 0.7, { s: 1.2, seed: 2, walk: { t0: 0.3 } })], fx: [['rain', { count: 340, a: 0.45 }]], over(g, t) { FX.fog(g, E.H * 0.6, 200, '#9fb8ff', 0.1); } });
timeCard('t0900', 9, 0, 'AM', { mood: 'day', from: 8.2, sunX: 0.75, sunY: 0.4 });
