// _actfx.js — action effects for 'act' shots. Each fx(g, t, ctx, o) draws in world space (inside layer(cam, 1)),
// unless o.screen is set (then screen space). ctx = {GY, M, cam, info, figs: {id: {x, y, s, f, head}}}.
import { E, S, ease, prog, clamp, lerp, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, rng, FONTS } from '/engine/core.js';
import { spring, smear } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import { wt, COL } from './_common.js';
import { car } from '../sets/city.js';

// tiny icon glyphs used in thought bubbles
export function icon(g, name, x, y, s, col) {
  const L = (pts, w = 0.12) => seg(g, pts.map(([a, b]) => [x + a * s, y + b * s]), w * s, col);
  g.save();
  switch (name) {
    case 'jam': rr(g, x - 0.4 * s, y - 0.3 * s, 0.8 * s, 0.75 * s, 0.12 * s); g.fillStyle = '#c0392b'; g.fill(); g.fillStyle = col; g.fillRect(x - 0.45 * s, y - 0.5 * s, 0.9 * s, 0.22 * s); break;
    case 'cal': g.strokeStyle = col; g.lineWidth = 0.1 * s; g.strokeRect(x - 0.45 * s, y - 0.4 * s, 0.9 * s, 0.8 * s); g.fillStyle = col; g.fillRect(x - 0.45 * s, y - 0.4 * s, 0.9 * s, 0.2 * s); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) g.fillRect(x - 0.3 * s + i * 0.25 * s, y - 0.05 * s + j * 0.2 * s, 0.12 * s, 0.1 * s); break;
    case 'gift': g.fillStyle = '#f29ac0'; g.fillRect(x - 0.4 * s, y - 0.25 * s, 0.8 * s, 0.65 * s); L([[0, -0.25], [0, 0.4]]); L([[-0.4, 0.05], [0.4, 0.05]]); L([[0, -0.25], [-0.25, -0.5], [0, -0.25], [0.25, -0.5]]); break;
    case 'pen': L([[-0.4, 0.4], [0.35, -0.35]], 0.14); L([[-0.4, 0.4], [-0.5, 0.5]], 0.06); break;
    case 'grid': g.strokeStyle = col; g.lineWidth = 0.06 * s; for (let i = 0; i < 4; i++) { g.strokeRect(x - 0.45 * s + i * 0.225 * s, y - 0.45 * s, 0.225 * s, 0.9 * s); g.strokeRect(x - 0.45 * s, y - 0.45 * s + i * 0.225 * s, 0.9 * s, 0.225 * s); } g.fillStyle = col; g.fillRect(x - 0.225 * s, y - 0.225 * s, 0.225 * s, 0.225 * s); break;
    case 'dog': circle(g, x, y, 0.32 * s, col); poly(g, [[x - 0.3 * s, y - 0.2 * s], [x - 0.42 * s, y + 0.25 * s], [x - 0.18 * s, y]], col); poly(g, [[x + 0.3 * s, y - 0.2 * s], [x + 0.42 * s, y + 0.25 * s], [x + 0.18 * s, y]], col); circle(g, x, y + 0.12 * s, 0.07 * s, '#1a1622'); break;
    case 'bridge': L([[-0.5, 0.3], [0.5, 0.3]]); g.strokeStyle = col; g.lineWidth = 0.1 * s; g.beginPath(); g.arc(x, y + 0.6 * s, 0.55 * s, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); L([[-0.25, 0.3], [-0.25, 0.05]], 0.06); L([[0.25, 0.3], [0.25, 0.05]], 0.06); L([[0, 0.3], [0, 0.0]], 0.06); break;
    case 'cure': g.fillStyle = col; g.fillRect(x - 0.12 * s, y - 0.42 * s, 0.24 * s, 0.84 * s); g.fillRect(x - 0.42 * s, y - 0.12 * s, 0.84 * s, 0.24 * s); break;
    case 'battery': g.strokeStyle = col; g.lineWidth = 0.08 * s; g.strokeRect(x - 0.45 * s, y - 0.25 * s, 0.8 * s, 0.5 * s); g.fillStyle = COL().good; g.fillRect(x - 0.4 * s, y - 0.2 * s, 0.55 * s, 0.4 * s); g.fillStyle = col; g.fillRect(x + 0.35 * s, y - 0.1 * s, 0.1 * s, 0.2 * s); break;
    case 'note': circle(g, x - 0.15 * s, y + 0.3 * s, 0.18 * s, col); L([[-0.0, 0.3], [0, -0.45], [0.35, -0.3]]); break;
    case 'chess': poly(g, [[x - 0.3 * s, y + 0.45 * s], [x + 0.3 * s, y + 0.45 * s], [x + 0.18 * s, y], [x - 0.18 * s, y]], col); circle(g, x, y - 0.15 * s, 0.2 * s, col); break;
    case 'bulb': circle(g, x, y - 0.1 * s, 0.32 * s, COL().gold); g.fillStyle = col; g.fillRect(x - 0.15 * s, y + 0.22 * s, 0.3 * s, 0.2 * s); break;
    case 'num': text(g, '418', x, y, { size: 0.55 * s, color: col, font: FONTS.ui, weight: 900 }); break;
    case 'q': text(g, '?', x, y, { size: 0.9 * s, color: col, font: FONTS.title, weight: 700 }); break;
    case 'x': L([[-0.3, -0.3], [0.3, 0.3]], 0.14); L([[-0.3, 0.3], [0.3, -0.3]], 0.14); break;
    case 'clock': ring(g, x, y, 0.4 * s, 0.08 * s, col); L([[0, 0], [0, -0.28]], 0.07); L([[0, 0], [0.2, 0]], 0.07); break;
    case 'pancake': g.fillStyle = '#d9a441'; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(x, y + 0.2 * s - i * 0.16 * s, 0.45 * s, 0.13 * s, 0, 0, 7); g.fill(); } break;
    default: circle(g, x, y, 0.2 * s, col);
  }
  g.restore();
}

export const ACTFX = {
  // thought bubbles orbiting a head: {who, n, icons, R, size, at}
  thoughts(g, t, ctx, o) {
    const f = ctx.figs[o.who || 'max']; if (!f) return; const [hx, hy] = f.head, n = o.n || 10, R = o.R || 150 * f.s, sz = o.size || 34 * f.s, t0 = wt(ctx.info, o.at, 0.1), C = COL();
    const icons = o.icons || ['jam', 'cal', 'pen', 'grid', 'gift', 'dog', 'note', 'chess', 'bulb', 'clock'];
    for (let i = 0; i < n; i++) { const k = spring(t, t0 + i * (o.step ?? 0.12), { freq: 2.4, damp: 0.5 }); if (k <= 0) continue;
      const a = -Math.PI * 0.95 + (i / Math.max(1, n - 1)) * Math.PI * 0.9 + Math.sin(t * 0.8 + i) * 0.04, r = R * (0.75 + (i % 2) * 0.28);
      const x = hx + Math.cos(a) * r * k, y = hy - 40 * f.s + Math.sin(a) * r * 0.75 * k;
      circle(g, x, y, sz * 0.95 * clamp(k, 0, 1.2), alpha('#f4efe6', 0.92)); glow(g, x, y, sz * 1.8, C.gold, 0.15);
      icon(g, icons[i % icons.length], x, y, sz * 1.1 * clamp(k), '#2a2236'); }
  },
  // speech bubble with a short text over a head: {who, s, at, dx}
  say(g, t, ctx, o) {
    const f = ctx.figs[o.who]; if (!f) return; const k = spring(t, wt(ctx.info, o.at, 0.2), { freq: 2.6, damp: 0.55 }); if (k <= 0) return;
    const [hx, hy] = f.head, x = hx + (o.dx ?? 120) * f.f, y = hy - 130 * f.s, sz = o.size || 40, w = Math.max(160, o.s.length * sz * 0.56 + 60);
    g.save(); g.translate(x, y); g.scale(clamp(k, 0, 1.2), clamp(k, 0, 1.2)); rr(g, -w / 2, -sz, w, sz * 2, sz); g.fillStyle = '#f4efe6'; g.fill(); poly(g, [[-20 * f.f, sz - 4], [-60 * f.f, sz + 34], [10 * f.f, sz - 4]], '#f4efe6');
    text(g, o.s, 0, 2, { size: sz, color: '#2a2236', font: FONTS.ui, weight: 900 }); g.restore();
  },
  // falling tray with fork, cup, soup; freeze: hang in the air with dotted landing arcs
  tray(g, t, ctx, o) {
    const x0 = o.x * E.W, y0 = ctx.GY - (o.h ?? 140), t0 = wt(ctx.info, o.at, 0.2), tt = o.freeze ? (o.ft ?? 0.35) + t * 0.02 : Math.max(0, t - t0), fall = 0.5 * 1600 * tt * tt;
    const items = [['tray', 0, 0], ['fork', -60, -40], ['cup', 50, -60], ['soup', 10, -30], ['bread', -30, -80]];
    items.forEach(([n, dx, dy], i) => { const x = x0 + dx * (1 + tt * 2) + (o.dir ?? 1) * tt * 120, y = Math.min(ctx.GY - 6, y0 + dy * (1 + tt) + fall * (1 - i * 0.04)), r = tt * (i % 2 ? 4 : -3);
      g.save(); g.translate(x, y); g.rotate(r);
      if (n === 'tray') { rr(g, -90, -8, 180, 16, 6); g.fillStyle = '#b84a3a'; g.fill(); }
      if (n === 'fork') { seg(g, [[-30, 0], [30, 0]], 6, '#d8dce6'); for (let k = 0; k < 3; k++) seg(g, [[30, -6 + k * 6], [46, -6 + k * 6]], 3, '#d8dce6'); }
      if (n === 'cup') { rr(g, -16, -22, 32, 40, 6); g.fillStyle = '#f2ece4'; g.fill(); }
      if (n === 'soup') { for (let k = 0; k < 9; k++) circle(g, Math.cos(k * 2.4) * (16 + k * 4), Math.sin(k * 1.7) * (10 + k * 2), 7 + (k % 3) * 3, '#e0a040'); }
      if (n === 'bread') { rr(g, -22, -14, 44, 28, 12); g.fillStyle = '#c98a4a'; g.fill(); }
      g.restore();
      if (o.freeze) { g.setLineDash([8, 10]); seg(g, [[x, y], [x + 40 * (o.dir ?? 1), ctx.GY - 4]], 2.5, alpha('#e8f0ff', 0.6)); g.setLineDash([]); ring(g, x + 40 * (o.dir ?? 1), ctx.GY - 4, 16, 3, alpha(COL().accent, 0.8)); } });
  },
  // a ball flying from a to b between word times: {from:[fx,fy], to:[fx,fy], at, dur, kind:'basket'|'dodge', catch}
  ball(g, t, ctx, o) {
    const t0 = wt(ctx.info, o.at, 0.2), d = o.dur ?? 0.5, k = clamp((t - t0) / d), a = [o.from[0] * E.W, ctx.GY - o.from[1]], b = [o.to[0] * E.W, ctx.GY - o.to[1]];
    if (t < t0) return; const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * (o.arc ?? 60), pk = clamp((t - 1 / 24 - t0) / d);
    const px = lerp(a[0], b[0], pk), py = lerp(a[1], b[1], pk) - Math.sin(pk * Math.PI) * (o.arc ?? 60), r = o.r ?? 26;
    smear(g, k < 1 ? x - px : 0, k < 1 ? y - py : 0, (g) => { circle(g, x, y, r, o.kind === 'dodge' ? '#c0392b' : '#e0742a'); seg(g, [[x - r, y], [x + r, y]], 2.5, '#2a1410'); seg(g, [[x, y - r], [x, y + r]], 2.5, '#2a1410'); });
    if (k >= 1 && o.ring !== false) FX.rings(g, x, y, t - t0 - d, { count: 2, r0: 20, r1: 120, speed: 1.6, color: '#fff3e0', a: 0.5 * (1 - prog(t, t0 + d, t0 + d + 0.8)) });
  },
  // 12 dodgeballs hanging around Max with arcs (freeze) then passing
  dodge(g, t, ctx, o) {
    const f = ctx.figs[o.who || 'max'], cx = f ? f.x : E.W / 2, r = rng(4), n = o.n ?? 12, C = COL(), pass = o.pass ? ease.in(prog(t, wt(ctx.info, o.pass, 0.5), wt(ctx.info, o.pass, 0.5) + 0.9)) : 0;
    for (let i = 0; i < n; i++) { const sx = (r() < 0.5 ? -1 : 1), bx = cx + sx * (140 + r() * 520), by = ctx.GY - 60 - r() * 420, ex = cx - sx * 420;
      const x = lerp(bx, ex, pass * (0.6 + r() * 0.4)), y = by + Math.sin(pass * 3) * 20 + (o.freeze ? Math.sin(t * 0.8 + i) * 3 : 0);
      if (o.arcs) { g.setLineDash([6, 10]); seg(g, [[bx + sx * 300, by - 80], [x, y], [cx + (i % 3 - 1) * 60, ctx.GY - 120 - (i % 4) * 40]], 2, alpha(C.blue, 0.55)); g.setLineDash([]); }
      circle(g, x, y, 22, '#c0392b'); circle(g, x - 7, y - 7, 6, alpha('#ffffff', 0.4)); }
  },
  // pencil rolls off a desk and is caught: {x, top, at, catchAt}
  pencil(g, t, ctx, o) {
    const x0 = o.x * E.W, top = ctx.GY - (o.top ?? 118), t0 = wt(ctx.info, o.at, 0.2), tc = o.catchAt != null ? wt(ctx.info, o.catchAt, 1) : 99;
    const tt = Math.max(0, Math.min(t, tc) - t0), y = top - 6 + 0.5 * 2600 * tt * tt * (t > t0 ? 1 : 0), x = x0 + tt * 90;
    g.save(); g.translate(x, Math.min(y, ctx.GY - 6)); g.rotate(t * 3 * (t < tc ? 1 : 0)); rr(g, -42, -6, 84, 12, 5); g.fillStyle = '#f2c21a'; g.fill(); poly(g, [[42, -6], [58, 0], [42, 6]], '#e8d0a0'); g.restore();
  },
  // gray car driving in: {x0, x1, at, dur, color, facing}
  car(g, t, ctx, o) { const k = ease.out(prog(t, wt(ctx.info, o.at, 0), wt(ctx.info, o.at, 0) + (o.dur ?? 2))); car(g, lerp(o.x0, o.x1, k) * E.W, ctx.GY + (o.dy ?? 0), o.s ?? 1.1, o.color || '#7c818c', o.facing ?? 1, { lights: o.lights }); },
  // stack of sandwiches counted on a table: {x, y, n, at}
  sandwiches(g, t, ctx, o) { for (let i = 0; i < o.n; i++) { const k = spring(t, wt(ctx.info, o.at, 0.2) + i * 0.25); if (k <= 0) continue; const x = o.x * E.W, y = ctx.GY - (o.y ?? 160) - i * 22 - (1 - clamp(k)) * 60; poly(g, [[x - 50, y], [x + 50, y], [x, y - 20]], '#e8c890'); seg(g, [[x - 40, y - 3], [x + 40, y - 3]], 5, '#6fbf5a'); } },
  // something hits a wall: rings + shake marks {x, y, at}
  bang(g, t, ctx, o) { const t0 = wt(ctx.info, o.at, 0.3); [0, 0.35, 0.7].forEach(dt => { if (t > t0 + dt) FX.rings(g, o.x * E.W, ctx.GY - o.y, t - t0 - dt, { count: 1, r0: 30, r1: 160, speed: 1.8, color: '#fff3e0', a: 0.6 * (1 - prog(t, t0 + dt, t0 + dt + 0.6)) }); }); },
  // three pens tossed and caught
  pens(g, t, ctx, o) { const f = ctx.figs[o.who || 'max']; if (!f) return; const [hx, hy] = f.head; for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1, x = hx + 60 * f.f + Math.sin(ph * 6.28) * 60, y = hy - 40 - Math.abs(Math.cos(ph * 3.14)) * 140; g.save(); g.translate(x, y); g.rotate(t * 6 + i); rr(g, -24, -4, 48, 8, 3); g.fillStyle = ['#3a6ea5', '#c0392b', '#2a2236'][i]; g.fill(); g.restore(); } },
  // phone held up recording (red dot) near a figure's hand: {who}
  rec(g, t, ctx, o) { const f = ctx.figs[o.who]; if (!f) return; const x = f.x + 40 * f.f * f.s, y = f.y - 190 * f.s; rr(g, x - 16, y - 28, 32, 56, 6); g.fillStyle = '#121018'; g.fill(); g.fillStyle = '#9fd8ff'; g.fillRect(x - 12, y - 22, 24, 40); glow(g, x, y, 80, '#9fd8ff', 0.4); if (t % 1 < 0.6) circle(g, x + 8, y - 16, 5, '#ff3a2a'); },
  // dotted arc + landing marker (prediction)
  arc(g, t, ctx, o) { const k = ease.out(prog(t, wt(ctx.info, o.at, 0.2), wt(ctx.info, o.at, 0.2) + 0.6)), a = [o.from[0] * E.W, ctx.GY - o.from[1]], b = [o.to[0] * E.W, ctx.GY - o.to[1]];
    g.setLineDash([10, 12]); g.strokeStyle = alpha(COL().blue, 0.8); g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 30 * k; i++) { const u = i / 30; const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * (o.h ?? 150); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]); if (k > 0.95) ring(g, b[0], b[1], 18, 4, COL().accent); },
  // world-space label: {x, y(above ground), s, at, color}
  label(g, t, ctx, o) { const a = ease.out(prog(t, wt(ctx.info, o.at, 0.2), wt(ctx.info, o.at, 0.2) + 0.3)); text(g, o.s, o.x * E.W, ctx.GY - o.y, { size: o.size || 34, color: COL()[o.color || 'gold'], font: FONTS.ui, weight: 900, alpha: a, glow: 12, glowColor: alpha(COL().gold, 0.5) }); },
  // contract paper on a table: {x, y, at}
  paper(g, t, ctx, o) { const k = ease.out(prog(t, wt(ctx.info, o.at, 0.2), wt(ctx.info, o.at, 0.2) + 0.8)); const x = lerp((o.x0 ?? o.x + 0.1) * E.W, o.x * E.W, k), y = ctx.GY - (o.y ?? 165); g.save(); g.translate(x, y); g.scale(1, 0.35); g.fillStyle = '#efe6d2'; g.fillRect(-60, -80, 120, 160); g.restore(); },
  // screen-space white flash or fade to black at a word: {at, kind:'flash'|'dark', len}
  flash(g, t, ctx, o) { const t0 = wt(ctx.info, o.at, 0.3), a = o.kind === 'dark' ? ease.inOut(prog(t, t0, t0 + (o.len ?? 0.8))) : clamp(1 - (t - t0) / (o.len ?? 0.35)) * (t >= t0 ? 1 : 0); if (a <= 0) return; g.fillStyle = o.kind === 'dark' ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a * 0.85})`; g.fillRect(0, 0, E.W, E.H); },
  // lightning for the thunder flashback (screen)
  storm(g, t, ctx, o) { const ph = t % 2.2; if (ph < 0.12) { g.fillStyle = `rgba(220,230,255,${0.35 * (1 - ph / 0.12)})`; g.fillRect(0, 0, E.W, E.H); } FX.rain(g, t, { count: 140 }); },
  // dust burst on the stage (impact): {at, x}
  burst(g, t, ctx, o) { const t0 = wt(ctx.info, o.at, 0.2); if (t < t0) return; const k = t - t0, r = rng(9); for (let i = 0; i < 70; i++) { const a = -Math.PI * r(), sp = 200 + r() * 700, x = (o.x ?? 0.5) * E.W + Math.cos(a) * sp * k, y = ctx.GY - 20 + Math.sin(a) * sp * k + 500 * k * k; circle(g, x, y, 4 + r() * 10 + k * 30, alpha(i % 4 ? '#c9b8a0' : '#cfe8ff', 0.5 * clamp(1 - k / 2.5))); } FX.fog(g, ctx.GY - 260, 300, '#c9b8a0', 0.4 * clamp(k * 2) * clamp(1.5 - k * 0.2)); },
  // chessboard on a desk top: {x, top}
  chess(g, t, ctx, o) { const x = o.x * E.W, y = ctx.GY - (o.top ?? 112), s = 18; for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#5a3a2a' : '#e8d8b8'; g.beginPath(); g.moveTo(x - 4 * s + i * s, y); g.lineTo(x - 4 * s + (i + 1) * s, y); g.lineTo(x - 4 * s + (i + 1) * s * 1.2 - s, y - 10); g.lineTo(x - 4 * s + i * s * 1.2 - s * 0.8, y - 10); g.fill(); } for (let i = 0; i < 6; i++) circle(g, x - 50 + i * 20, y - 18, 6, i % 2 ? '#f2efe8' : '#16131c'); },
  // zzz / growl lines near a figure: {who, s}
  marks(g, t, ctx, o) { const f = ctx.figs[o.who]; if (!f) return; for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; text(g, o.s || 'Z', f.head[0] + 40 + ph * 60, f.head[1] - 40 - ph * 110, { size: 30 + ph * 20, color: alpha('#f4efe6', 1 - ph), font: FONTS.title, weight: 700 }); } },
};
