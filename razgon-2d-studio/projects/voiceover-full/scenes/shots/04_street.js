import { shot, closeup, insert, plain, tri, timeCard, ghost, wt, E, V, mood, S, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, rng, glow, alpha, shade, mix, rr, seg, poly, circle, ring, linGrad, radGrad, text, FONTS, drawFigure, POSES, headPos, FX, UI, camPath, camAdd, impact, spring, kText, drift, GYf, CXf, SC, clothes, poseOf, walkPose } from '../_lib.js';
import { room, street, bp } from '../_sets.js';
import { walker, eyeShape, chair, arrow, bubble2, footprint, steam, hand, bike, car, dog } from '../_props.js';
const SS = () => V(1.5, 1.7);
const prints = (g, GY, x0, x1, k, stride = 95) => { const n = Math.floor(Math.abs(x1 - x0) * k / stride); for (let i = 0; i < n; i++) footprint(g, x0 + (x1 >= x0 ? 1 : -1) * i * stride, GY + 70 + (i % 2) * 26, 1.1, i % 2 ? -1 : 1, 0.8, 'rgba(30,36,60,.5)'); };
const headXY = (x, GY, s, f = 1, p = POSES.stand) => { const [hx, hy, hr] = headPos({ x, y: GY, s, facing: f, pose: p }); return [hx, hy, hr]; };

// s051 — you step outside; the world doesn't care
shot('s051', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.12, 1.0], x: [-60, 30] },
  mid0(g, t, info, env) { FX.door(g, { x: E.W * 0.1, y: env.GY, w: 170, h: 300, color: '#2a1d22', open: 0.8, light: '#ffe2a8' }); },
  chars: () => [{ who: 'YOU', walk: { x0: 0.16, x1: 0.46 }, s: SS(), ga: 0.2 }, walker(0.95, 0.62, { seed: 2 }), walker(0.5, 0.2, { seed: 3, s: 1.2, walk: { t0: 0.6 } })], fx: ['dust'] });
// s052 — people walk straight into you
shot('s052', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.15, 1.2], x: [0, 30] },
  camAdd: (t, info) => { const ti = wt(info, 'straight', 1.2) + 0.3, im = impact(t, ti, { amp: 14, decay: 6 }); return { x: im.x, y: im.y, r: im.r }; },
  chars: (t, info) => { const ti = wt(info, 'straight', 1.2) + 0.3, hit = t > ti, k = clamp(t / ti);
    return [{ who: 'YOU', x: hit ? 0.5 - 0.03 * ease.out(prog(t, ti, ti + 0.4)) : 0.5, s: SS(), pose: hit ? 'fall' : 'stand', ga: 0.22, facing: 1 },
      hit ? { who: 'PLAIN', x: 0.62 + 0.03 * ease.out(prog(t, ti, ti + 0.5)), s: SS(), facing: -1, pose: 'shrug', expr: 'confused' } : walker(0.95, 0.61, { s: SS(), facing: -1, walk: { t0: 0, t1: ti } })]; }, fx: ['dust'] });
// s053 — a cyclist almost knocks you flat
shot('s053', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.08, 1.12], x: [0, 40] },
  chars: (t, info) => { const tc = 1.0, k = clamp(t / 1.8), jump = ease.out(prog(t, tc - 0.3, tc + 0.1));
    return [{ who: 'YOU', x: 0.46 - 0.06 * jump, s: SS(), pose: t < tc - 0.3 ? 'stand' : (t < tc + 0.7 ? 'jump' : 'fall'), ga: 0.22, blend: 0.15 }]; },
  mid(g, t, info, env) { const k = prog(t, 0.2, 1.7), x = lerp(E.W + 300, -500, ease.in(k * 0.5) * 2 * 0.5 + k * 0.5), y = env.GY + 120; bike(g, x, y, 1.4, t); drawFigure(g, { x: x + 10, y: y - 56, s: SS() * 0.95, facing: -1, pose: { ...POSES.crouch, hF: [58, -112], eF: [34, -126] }, outfit: { top: 'tracksuit', color: '#2f7d4a', head: 'cap', headColor: '#3fb950' }, expr: 'scared', rim: { color: env.M.rim, dir: [0, -1], w: 4 }, shadow: false }); FX.speedLines(g, t, { cx: x, cy: y - 120, count: 20, a: 0.2 }); } });
// s054 — you try to cross the road
shot('s054', { set: street, opts: { mood: 'day', cross: true, dim: 0.3 }, cam: { path: [[0, { z: 1.0 }], [1, { z: 1.4, x: -60, y: -20 }]] }, chars: () => [{ who: 'YOU', x: 0.4, s: SS(), pose: 'stand', ga: 0.24, look: [1, 0] }],
  mid(g, t, info, env) { for (const [i, c] of ['#8a3a3a', '#2a3a5a', '#3a6a5a'].entries()) { const x = ((t * 1100 + i * 900) % 3200) - 600; car(g, E.W + 400 - x, env.GY + 200, 1.25, { color: c, facing: -1 }); } }, fx: ['dust'] });
// s055 — no driver will ever stop for you: headlights rushing the camera
plain('s055', (g, t, info) => { const M = mood('day'), k = ease.in(prog(t, 0, info.dur * 0.95)), cx = E.W / 2, hy = E.H * 0.56; backdrop(g, [shade(M.sky[0], -0.5), shade(M.sky[1], -0.5), shade(M.sky[2], -0.6)]);
  g.fillStyle = '#16141c'; poly(g, [[cx - 100, hy], [cx + 100, hy], [cx + 1400, E.H], [cx - 1400, E.H]], '#16141c'); for (let i = 0; i < 12; i++) { const z = ((i / 12 + t * 0.9) % 1), y = hy + (E.H - hy) * z * z, w = 12 + 320 * z * z; g.fillStyle = alpha('#f2efe8', 0.4 * z); g.fillRect(cx - w / 2, y, w, 6 + 40 * z * z); }
  for (let i = -5; i <= 5; i++) { g.fillStyle = alpha('#f2efe8', 0.55); poly(g, [[cx + i * 40 - 8, hy + 140], [cx + i * 40 + 8, hy + 140], [cx + i * 120 + 26, E.H], [cx + i * 120 - 30, E.H]], alpha('#f2efe8', 0.55)); }
  const gx = cx, gh = 230 * (1 - 0.35 * k); g.save(); g.globalAlpha = 0.5; drawFigure(g, { x: gx, y: hy + 150, s: 0.75, facing: 1, pose: POSES.stand, outfit: { top: 'none' }, ink: '#dfe8ff', inkFar: '#dfe8ff', rim: false, shadow: false, expr: 'neutral', alpha: 0.35 }); g.restore();
  const r = 60 + 900 * k * k * k; for (const dx of [-1, 1]) { const x = cx + dx * (150 + 700 * k * k), y = hy + 60 * k + 40; glow(g, x, y, r * 1.2, '#fff3dc', 0.8); circle(g, x, y, r * 0.2, '#ffffff'); } veil(g, '#fff6e0', 0.5 * k * k); });
// s056 — a green man means nothing when there's no man
insert('s056', { set: street, opts: { mood: 'day', cross: true }, cam: { z: [1.4, 1.5], x: [-60, 0] }, draw(g, t, info) { const cx = E.W / 2, cy = E.H / 2, w = V(380, 420), h = V(560, 640), tt = wt(info, 'no', 2.4, info.shot.start + 1.4) ;
  rr(g, cx - w / 2 - 14, cy - h / 2 - 14, w + 28, h + 28, 30); g.fillStyle = '#0b0b12'; g.fill(); rr(g, cx - w / 2, cy - h / 2, w, h, 20); g.fillStyle = '#05140a'; g.fill(); const gone = ease.inOut(prog(t, tt - 0.1, tt + 0.5));
  g.save(); g.translate(cx, cy); glow(g, 0, 0, 380, '#3dff7a', 0.35); g.globalAlpha = 1 - gone; const c = '#52ff8a'; circle(g, 0, -h * 0.28, 34, c); seg(g, [[0, -h * 0.2], [0, 40]], 44, c); seg(g, [[0, -h * 0.17], [-62, 0]], 26, c); seg(g, [[0, -h * 0.17], [62, -20]], 26, c); seg(g, [[0, 40], [-40, h * 0.3]], 26, c); seg(g, [[0, 40], [52, h * 0.3 - 10]], 26, c); g.restore();
  g.save(); g.translate(cx, cy); g.globalAlpha = gone; g.setLineDash([14, 12]); ring(g, 0, -h * 0.28, 34, 5, '#52ff8a'); g.beginPath(); g.moveTo(0, -h * 0.2); g.lineTo(0, 40); g.moveTo(0, 40); g.lineTo(-40, h * 0.3); g.moveTo(0, 40); g.lineTo(52, h * 0.3 - 10); g.strokeStyle = '#52ff8a'; g.lineWidth = 5; g.stroke(); g.restore(); } });
// s057 — a dog stops dead and barks right at you
shot('s057', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.05, 1.3], x: [-30, 150] }, chars: () => [{ who: 'YOU', x: 0.26, s: SS(), pose: [[0, 'stand'], [0.9, 'ready']], ga: 0.24, facing: 1 }],
  mid(g, t, info, env) { const bk = t > 0.8 ? (Math.sin(t * 22) > 0 ? 1 : 0) : 0, x = E.W * 0.72 - (t < 0.8 ? 90 * (1 - ease.out(t / 0.8)) : 0); dog(g, x, env.GY + 10, V(1.5, 1.7), { facing: -1, bark: bk, head: bk * -4, t, rim: env.M.rim }); if (bk) FX.rings(g, x - 140, env.GY - 150, t, { count: 3, r0: 30, r1: 260, speed: 2.4, color: '#ffffff', a: 0.4 }); }, fx: ['dust'] });
// s058 — dogs don't need to see you; they smell you
insert('s058', { set: street, opts: { mood: 'day' }, cam: { z: [1.3, 1.4] }, draw(g, t, info) { const nx = E.W * 0.7, ny = E.H * 0.55, c = S().ink;
  for (let i = 0; i < 6; i++) { g.save(); g.strokeStyle = alpha('#cfe0ff', 0.45); g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); for (let x = -50; x <= nx - 150; x += 20) { const k = x / (nx - 150), y = ny - 30 + (i - 2.5) * 36 * (1 - k * 0.8) + Math.sin(x * 0.02 - t * 5 + i) * 26 * (1 - k * 0.5); g.lineTo(x, y); } g.stroke(); g.restore(); }
  g.fillStyle = mood('day').rim; g.beginPath(); g.ellipse(nx - 3, ny - 3, 250, 190, 0, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.ellipse(nx, ny, 250, 190, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(nx + 280, ny + 40, 380, 240, 0, 0, 7); g.fill();
  const sn = 1 + 0.12 * Math.sin(t * 9); g.fillStyle = '#251a22'; g.beginPath(); g.ellipse(nx - 130, ny - 20, 60 * sn, 82 * sn, -0.2, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.ellipse(nx - 150, ny - 50, 14, 22, -0.2, 0, 7); g.fill(); circle(g, nx + 120, ny - 150, 16, '#f4efe6'); circle(g, nx + 124, ny - 148, 8, '#06070c'); } });
// s059 — and a dog's nose works just fine on someone invisible: a scent trail from you to the dog
shot('s059', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.0, 1.15], x: [0, 60] }, chars: () => [{ who: 'YOU', x: 0.22, s: SS(), pose: 'stand', ga: 0.24 }],
  mid(g, t, info, env) { const gy = env.GY, x0 = E.W * 0.26, x1 = E.W * 0.6; g.save(); for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#d8e4ff', 0.5 - i * 0.12); g.lineWidth = 6 - i; g.lineCap = 'round'; g.beginPath(); const L = prog(t, 0.2, 2.2); for (let x = x0; x <= x0 + (x1 - x0) * L; x += 14) g.lineTo(x, gy - 40 - i * 22 + Math.sin(x * 0.03 - t * 4 + i) * 20); g.stroke(); } g.restore();
    dog(g, E.W * 0.7, gy + 10, V(1.5, 1.7), { facing: -1, head: 14, t, rim: env.M.rim, wag: 0.9 }); UI.callout(g, t, { at: [E.W * 0.66, gy - 80], to: [E.W * 0.6, gy - 380], str: 'SMELL', start: 1.6, color: S().ui.gold }); }, fx: ['dust'] });
// s060 — every breath makes a little cloud of steam (a close-up of nothing breathing)
closeup('s060', { ghost: true, set: street, opts: { mood: 'day' }, mood: 'day', cam: { z: [1.3, 1.45] }, ga: 0.24, veilA: 0.3, look: (t) => [0.2, 0.1],
  over(g, t, info, c) { steam(g, c.cx + c.r * 0.25, c.cy + c.r * 0.42, t, { n: 6, s: V(2.4, 2.4), speed: 0.35, dir: 1, color: '#f4f8ff' }); } });
// s061 — a ghost breathing on a busy street
shot('s061', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.25, 1.0], x: [30, -20] }, chars: () => [walker(0.04, 0.34, { seed: 1 }), walker(0.96, 0.66, { seed: 2, s: 1.2 }), { who: 'YOU', x: 0.5, s: V(1.6, 1.8), pose: 'stand', ga: 0.24 }, walker(0.3, 0.1, { seed: 5, s: 1.35, walk: { t0: 0.5 } })],
  mid(g, t, info, env) { const [hx, hy] = headXY(E.W * 0.5, env.GY, V(1.6, 1.8)); steam(g, hx + 30, hy + 20, t, { n: 5, s: 1.1 }); }, fx: ['dust'] });
// s062 — nobody looks scared
shot('s062', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.0, 1.08] }, chars: () => [walker(0.0, 0.3, { seed: 1, s: V(1.9, 2.1), expr: 'neutral', prop: 'phone', pose: undefined }), walker(1.0, 0.7, { seed: 2, s: V(1.7, 1.9), expr: 'neutral' }), { who: 'YOU', x: 0.5, s: SS(), pose: 'stand', ga: 0.2 }, walker(0.1, 0.4, { seed: 3, s: V(1.4, 1.6), expr: 'neutral', walk: { t0: 0.8 } })], fx: ['dust'] });
// s063 — nobody says "did you see that?"
shot('s063', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.1, 1.2], x: [0, 40] }, chars: () => [{ who: 'PLAIN', x: 0.6, s: V(1.7, 1.9), facing: -1, pose: 'stand', expr: 'neutral' }, { who: 'YOU', x: 0.38, s: V(1.7, 1.9), pose: 'stand', ga: 0.2 }],
  over(g, t, info, env) { const k = ease.outBack(prog(t, 0.3, 0.7)) * (1 - ease.in(prog(t, 1.2, 1.8))); g.save(); g.setLineDash([12, 10]); g.globalAlpha = k; const x = E.W * 0.6, y = E.H * 0.28; rr(g, x - 150, y - 55, 300, 110, 55); g.strokeStyle = alpha('#f4efe6', 0.8); g.lineWidth = 5; g.stroke(); g.restore(); if (k > 0) text(g, '...', x, y - 6, { size: 70, color: alpha('#f4efe6', 0.8 * k), weight: 800 }); } });
// s064 — a footprint, a puff of breath, a barking dog... and they just keep walking
shot('s064', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { z: [1.0, 1.1], x: [-20, 40] },
  mid0: (g, t, info, env) => { const tf = wt(info, 'footprint', 0.4); prints(g, env.GY, E.W * 0.12, E.W * 0.12 + E.W * 0.3 * ease.linear(prog(t, tf, tf + 1.4)), 1, 90); },
  chars: () => [{ who: 'YOU', x: 0.46, s: V(1.6, 1.8), pose: 'stand', ga: 0.22 }, walker(0.0, 0.5, { seed: 1, walk: { t0: 0.0, t1: 5 }, s: 1.35 }), walker(0.98, 0.6, { seed: 4, s: 1.3, walk: { t0: 2.2 } })],
  mid(g, t, info, env) { const [hx, hy] = headXY(E.W * 0.46, env.GY, V(1.6, 1.8)); const tp = wt(info, 'breath', 1.6); if (t > tp - 0.2) steam(g, hx + 30, hy + 20, t - tp, { n: 4 }); const td = wt(info, 'barking', 2.8); if (t > td - 0.3) { const bk = Math.sin(t * 20) > 0 ? 1 : 0; dog(g, E.W * 0.82, env.GY + 10, V(1.3, 1.5), { facing: -1, bark: bk, head: -3 * bk, t, rim: env.M.rim }); if (bk) FX.rings(g, E.W * 0.82 - 120, env.GY - 130, t, { count: 2, r0: 30, r1: 200, speed: 2.4, a: 0.3 }); } }, fx: ['dust'] });
// s065 — they look straight past you
closeup('s065', { who: 'PLAIN', set: street, opts: { mood: 'day' }, mood: 'day', cam: { z: [1.2, 1.3] }, expr: 'neutral', look: (t, info) => [0.15 + 0.85 * ease.inOut(prog(t, 0.2, 1.4)), 0], side: -1, veilA: 0.3 });
// s066a — honestly, that part feels familiar
shot('s066a', { set: street, opts: { mood: 'day', dim: 0.35 }, cam: { path: [[0, { z: 1.3, y: 20 }], [1, { z: 1.0, y: 0 }]] }, chars: () => [{ who: 'YOU', x: 0.5, s: V(1.6, 1.8), pose: 'sad', ga: 0.26, look: [0, 1] }, walker(0.0, 0.34, { seed: 2, s: 1.3 }), walker(1.0, 0.7, { seed: 4, s: 1.2 }), walker(0.15, 0.4, { seed: 7, s: 1.45, walk: { t0: 0.8 } })], fx: ['dust'] });
timeCard('t1030', 10, 30, 'AM', { mood: 'day', from: 9.2, sunX: 0.76, sunY: 0.32 });
