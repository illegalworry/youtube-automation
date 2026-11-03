import { shot, closeup, insert, plain, tri, timeCard, ghost, wt, E, V, mood, S, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, rng, glow, alpha, shade, mix, rr, seg, poly, circle, ring, linGrad, text, FONTS, drawFigure, POSES, FX, UI, camPath, camAdd, impact, spring, kText, drift, GYf, CXf, SC } from '../_lib.js';
import { room, street, bp, voidBg } from '../_sets.js';
import { walker, eyeShape, phone, table, chair, arrow } from '../_props.js';

// s001 — cold open: a ghost-like silhouette stands still while the morning crowd flows around it
shot('s001', { set: street, opts: { mood: 'day', dim: 0.3 }, cam: { path: [[0, { z: 1, x: 0 }], [0.6, { z: 1.08, x: 20 }], [1, { z: 1.42, x: 40, y: -30 }]] },
  chars: () => [walker(0.04, 0.34, { seed: 1, s: 1.15 }), walker(0.97, 0.62, { seed: 2 }), { who: 'YOU', x: 0.52, s: 1.5, pose: 'stand', facing: 1 }, walker(0.7, 0.45, { seed: 3, s: 1.2, walk: { t0: 0.3 } }), walker(0.1, 0.3, { seed: 4, s: 1.3 })],
  fx: ['dust'], fgl: (g) => { g.fillStyle = alpha('#10141c', 0.9); g.fillRect(E.W * 0.78, E.H * 0.2, 90, E.H); } });

// s002 — "In one second, you'd go blind." an eye that fades out of existence
plain('s002', (g, t, info) => {
  const M = mood('night'), tb = wt(info, 'blind', 1.6), k = ease.inOut(prog(t, tb - 0.1, tb + 1.1)); backdrop(g, M.sky);
  glow(g, E.W / 2, E.H / 2, 900, '#9fb8ff', 0.18 * (1 - k)); const cam = 1 + 0.05 * t;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(cam, cam); g.translate(-E.W / 2, -E.H / 2);
  eyeShape(g, E.W / 2, E.H / 2, V(900, 820), V(430, 400), { a: 1 - 0.97 * k, look: [Math.sin(t * 2) * 0.4, 0], lid: 1 - 0.1 * k });
  g.restore(); veil(g, '#000000', 0.9 * k);
  if (k > 0.5) for (const dx of [-0.5, 0.5]) { circle(g, E.W / 2 + dx * 90, E.H / 2, 6, '#05060a'); ring(g, E.W / 2 + dx * 90, E.H / 2, 9, 2, 'rgba(210,225,255,.5)'); }
  FX.dust(g, t, { count: 20, a: 0.2 });
});

// s003 — "In one day, you'd lose everyone." avatars drop out one by one
insert('s003', { set: room, opts: { kind: 'bedroom', night: true }, cam: { z: [1.5, 1.55], x: [0, 20] }, draw(g, t, info) {
  const cx = E.W / 2, cy = E.H / 2, cols = ['#d64a33', '#f2c21a', '#3a6ea5', '#f29ac0', '#3fb950', '#8a5ad6'];
  phone(g, cx, cy, V(520, 600), V(780, 1000), (g, x, y, w, h) => {
    text(g, 'FRIENDS', x + w / 2, y + 70, { size: 38, color: '#9fb6d8', font: FONTS.ui, weight: 900, spacing: 4 });
    for (let i = 0; i < 5; i++) { const ay = y + 170 + i * (h - 260) / 5, tf = 0.5 + i * 0.35, k = ease.inOut(prog(t, tf, tf + 0.5)), c = cols[i];
      circle(g, x + 90, ay, 44, alpha(c, 1 - 0.85 * k)); circle(g, x + 90, ay - 8, 14, alpha('#0e0b12', 1 - k)); rr(g, x + 160, ay - 20, 220 - i * 18, 16, 8); g.fillStyle = alpha('#9fb6d8', 0.7 - 0.5 * k); g.fill(); rr(g, x + 160, ay + 8, 150, 12, 6); g.fillStyle = alpha('#9fb6d8', 0.35 - 0.25 * k); g.fill(); }
  }, { glow: '#7fb0ff' });
}, over(g, t, info) { UI.badge(g, { str: '1 DAY', a: ease.out(prog(t, 0.2, 0.7)) }); } });

// s004 — the dinner table with one empty chair
shot('s004', { set: room, opts: { kind: 'kitchen' }, cam: { path: [[0, { z: 1.25, x: -90 }], [1, { z: 1.0, x: 30 }]] },
  mid0(g, t, info, env) { const s = V(1.45, 1.6); chair(g, env.tableX - 360, env.GY, s, 1); chair(g, env.tableX + 350, env.GY, s, -1); chair(g, env.tableX - 110, env.GY - 24, s * 0.9, -1); chair(g, env.tableX + 110, env.GY - 24, s * 0.9, -1); },
  mid(g, t, info, env) { table(g, env.tableX, env.GY, env.M); FX.dust(g, t, { count: 20 }); },
  chars: (t, info, env) => [{ who: 'MUM', x: env.tableX - 110, y: env.GY - 24, s: V(1.3, 1.45), facing: -1, pose: 'sit', expr: 'smile', shadow: false }, { who: 'KID', x: env.tableX + 110, y: env.GY - 24, s: V(1.45, 1.6), facing: -1, pose: 'sit', expr: 'happy', shadow: false, seed: 2 }, { who: 'DAD', x: env.tableX + 350, s: V(1.45, 1.6), facing: -1, pose: 'sit', expr: 'neutral', shadow: false, seed: 1 }] });

// s005 — "So, let's do it properly." the clock rewinds to the start of the day
plain('s005', (g, t, info) => {
  const M = mood('void'); backdrop(g, M.sky); const cx = E.W / 2, cy = E.H / 2, r = V(300, 330), k = ease.inOut(prog(t, 0, info.dur * 0.9));
  FX.stars(g, t, { count: 60 }); glow(g, cx, cy, r * 1.8, '#8fb8e8', 0.18); FX.clock(g, cx, cy, r, lerp(24 * 3600, 7 * 3600 + 12 * 60, k) * 1, { face: '#f2efe8' });
  for (let i = 0; i < 24; i++) { const a = -Math.PI / 2 + (i / 24) * 6.283; const act = i / 24 > 1 - k; seg(g, [[cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40)], [cx + Math.cos(a) * (r + 62), cy + Math.sin(a) * (r + 62)]], 4, act ? S().ui.gold : alpha('#8fb8e8', 0.4)); }
});

// s006 — one ordinary person, one ordinary day... and one thing that's different
shot('s006', { set: street, opts: { mood: 'day', cross: true }, cam: { z: [1.05, 1.0], x: [-40, 60] },
  chars: (t, info) => { const td = wt(info, 'different', 3.4), k = ease.inOut(prog(t, td, td + 0.7)), w = { x0: 0.18, x1: 0.62, ease: false };
    return [walker(0.9, 0.7, { seed: 5, s: 1.2 }), { who: 'YOU', x: 0.5, s: 1.4, walk: w, alpha: 1 - k, ghost: false }, { who: 'YOU', x: 0.5, s: 1.4, walk: w, ga: 0.2 * k, eyeGlow: k, ghost: true, eyes: k > 0.05 }]; },
  over(g, t, info, env) { const td = wt(info, 'different', 3.4); if (t > td - 0.05 && t < td + 1.2) { const x = E.W * (0.18 + 0.44 * (td / info.dur)) ; FX.rings(g, x + 30, E.H * 0.5, t - td, { count: 2, r0: 40, r1: 260, speed: 1.1, color: '#ffffff', a: 0.4 * (1 - prog(t, td, td + 1.2)) }); FX.sparkle(g, x + 30, E.H * 0.5, 40 * (1 - prog(t, td, td + 0.8)), '#ffffff', 0.8); } } });

// s007 — "You are completely, perfectly invisible."
shot('s007', { set: room, opts: { kind: 'hall' }, cam: (() => null)() || { path: [[0, { z: 1.05, x: -50 }], [1, { z: 1.2, x: 30, y: -20 }]] },
  chars: () => [{ who: 'YOU', x: 0.44, s: V(1.6, 1.8), pose: [[0, 'stand'], [1.2, 'explain']], facing: 1, look: [0.6, 0] }],
  fx: ['dust'], over(g, t, info) { const ti = wt(info, 'invisible', 2.0), im = impact(t, ti, { amp: 14, decay: 5 }); kText(g, t, 'INVISIBLE', E.W * V(0.7, 0.5), E.H * V(0.34, 0.2), { start: ti - 0.1, mode: 'slam', size: V(150, 130), color: S().ui.cream, glow: 28 }); } });

// s008 — "We'll go hour by hour."
plain('s008', (g, t, info) => {
  const M = mood('void'); backdrop(g, M.sky); const cx = E.W / 2, cy = E.H / 2, r = V(280, 300), sp = ease.in(clamp(t / info.dur));
  FX.stars(g, t, { count: 70 }); glow(g, cx, cy, r * 1.7, '#8fb8e8', 0.15); FX.clock(g, cx, cy, r, 7 * 3600 + t * 3600 * (1.2 + 5 * sp), { face: '#f2efe8' });
  for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i / 12) * 6.283, on = (i + 0.5) / 12 < ((t * (1.2 + 5 * sp)) / 12 + 0.6); seg(g, [[cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40)], [cx + Math.cos(a) * (r + 64), cy + Math.sin(a) * (r + 64)]], 5, S().ui.gold); }
  UI.badge(g, { str: 'HOUR BY HOUR', x: cx, y: E.H * V(0.88, 0.8), size: V(54, 54), a: ease.out(prog(t, 0.2, 0.6)) });
});

// s009 — "real physics, not movie magic."  blueprint: wand crossed out vs a light ray
plain('s009', (g, t, info) => {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, coral = S().ui.accent, tm = wt(info, 'movie', 1.6);
  const lx = E.W * V(0.27, 0.5), rx = E.W * V(0.73, 0.5), ly = E.H * V(0.5, 0.3), ry = E.H * V(0.5, 0.7);
  // physics (right): ray bending through a prism
  const on = ease.out(prog(t, 0.2, 0.9)); g.globalAlpha = on; const px = rx, py = ry;
  poly(g, [[px - 60, py + 70], [px + 60, py + 70], [px, py - 70]], alpha(c, 0.15)); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.moveTo(px - 60, py + 70); g.lineTo(px + 60, py + 70); g.lineTo(px, py - 70); g.closePath(); g.stroke();
  seg(g, [[px - 320, py + 20], [px - 30, py + 14]], 5, '#fff3dc'); ['#ff6f61', '#ffd47e', '#7fe0a0', '#7fb8ff'].forEach((cc, i) => seg(g, [[px + 30, py + 8], [px + 330, py - 40 + i * 28]], 5, cc)); g.globalAlpha = 1;
  text(g, 'REAL PHYSICS', px, py + 190, { size: V(46, 44), color: gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: on });
  // movie magic (left): wand with sparkles, struck out
  g.save(); g.translate(lx, ly); g.rotate(-0.6); seg(g, [[-130, 0], [130, 0]], 14, alpha(c, 0.9)); seg(g, [[100, 0], [130, 0]], 14, '#f2efe8'); g.restore();
  for (let i = 0; i < 7; i++) { const a = i * 0.9 + t * 1.4, d = 60 + (i % 3) * 30; FX.sparkle(g, lx + 110 + Math.cos(a) * d, ly - 80 + Math.sin(a) * d * 0.7, 14 + (i % 3) * 6, gold, 0.8); }
  const x = ease.out(prog(t, tm + 0.1, tm + 0.5)); text(g, 'MOVIE MAGIC', lx, ly + 190, { size: V(46, 44), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, spacing: 3 });
  if (x > 0) { seg(g, [[lx - 190, ly - 120], [lx - 190 + 380 * x, ly - 120 + 360 * x]], 12, coral); seg(g, [[lx + 190, ly - 120], [lx + 190 - 380 * x, ly - 120 + 360 * x]], 12, coral); }
});

// s010 — "by midnight, you'll know why this power is a trap."  the clock tower at midnight
shot('s010', { set: street, opts: { mood: 'night', night: true, lampsOn: true }, cam: { path: [[0, { z: 1.0, y: 120 }], [1, { z: 1.18, y: -60 }]] },
  behind(g, t, info, env, cam) { layer(g, cam, 0.6, (g) => { const x = E.W * 0.72, GY = env.GY; g.fillStyle = shade(env.M.wall, -0.5); g.fillRect(x - 90, GY - 900, 180, 900); poly(g, [[x - 110, GY - 900], [x + 110, GY - 900], [x, GY - 1040]], shade(env.M.wall, -0.6)); glow(g, x, GY - 790, 220, '#ffe2a8', 0.35); FX.clock(g, x, GY - 790, 62, 12 * 3600 - 20 * (1 - ease.inOut(info.dur ? 1 : 1)), { face: '#f2efe8' }); }); },
  chars: () => [{ who: 'YOU', x: 0.34, s: 1.5, pose: 'stand', facing: 1 }], fx: ['stars'],
  over(g, t, info) { const tt = wt(info, 'trap', 3.2); kText(g, t, 'A TRAP', E.W * 0.34, E.H * V(0.22, 0.2), { start: tt - 0.1, mode: 'slam', size: V(130, 120), color: S().ui.accent, glow: 24 }); } });

// s011 — the scariest part: a giant (ghost) face, eyes pushing in
closeup('s011', { ghost: true, set: room, opts: { kind: 'bedroom', night: true }, mood: 'night', cam: { z: [1.3, 1.6], x: -100 }, look: (t) => [Math.sin(t * 0.8) * 0.6, 0.1], ga: 0.2, veilA: 0.55 });
