// _bp2.js — blueprint diagrams for the 100% brain story. Merged into DIAGRAMS.
import { E, V, S, ease, prog, clamp, lerp, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, rng, FONTS } from '/engine/core.js';
import { spring, kText } from '/engine/motion.js';
import * as UI from '/engine/ui2d.js';
import { POSES, walkPose } from '/engine/rig2d.js';
import { wt, COL } from './_common.js';
import { icon } from './_actfx.js';
import { DIAGRAMS } from './_bp.js';

const BP = () => UI.bpStroke();
const lab = (g, t, info, s, x, y, at, o = {}) => { const st = wt(info, at, o.fb ?? 0.3); const k = ease.out(prog(t, st - 0.05, st + 0.3)); if (k <= 0) return 0; text(g, s, x, y + (1 - k) * 20, { size: o.size || 44, color: o.color || COL().cream, font: FONTS.ui, weight: 900, alpha: k, spacing: 2, align: o.align || 'center', glow: o.glow ?? 10, glowColor: alpha(o.color || COL().cream, 0.4) }); return k; };
const big = (g, t, info, s, x, y, at, o = {}) => kText(g, t, s, x, y, { start: wt(info, at, o.fb ?? 0.3) - 0.08, mode: o.mode || 'slam', size: o.size || 110, color: o.color || COL().gold, glow: 24, glowColor: alpha(o.color || COL().gold, 0.6), font: FONTS.ui, weight: 900, out: info.dur - 0.3 });
export function brain(g, x, y, r, c, lit = 0) { g.strokeStyle = c; g.lineWidth = r * 0.06; for (const dx of [-0.32, 0.32]) { g.beginPath(); g.ellipse(x + dx * r, y, r * 0.44, r * 0.62, 0, 0, 7); g.stroke(); } for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x - r * 0.3, y - r * 0.3 + i * r * 0.3, r * 0.18, 0, Math.PI); g.stroke(); g.beginPath(); g.arc(x + r * 0.3, y - r * 0.3 + i * r * 0.3, r * 0.18, Math.PI, Math.PI * 2); g.stroke(); } if (lit) glow(g, x, y, r * 1.6, c, 0.25 * lit); }
const fig = (g, x, y, s, c, pose = POSES.stand, facing = 1) => UI.lineFigure(g, { x, y, s, pose, color: c, facing });
const C = () => COL();
const colOf = (n) => (n ? C()[n] || n : C().gold);

Object.assign(DIAGRAMS, {
  // generic labelled bars: {title, titleAt, rows:[{l, v, val, at, col}]}
  bars(g, t, info) {
    const rows = info.rows || [], x = E.W * 0.34, w = E.W * 0.5;
    if (info.title) lab(g, t, info, info.title, E.W / 2, E.H * 0.16, info.titleAt ?? 0.1, { size: 56, color: C().cream });
    rows.forEach((r, i) => { const st = wt(info, r.at, 0.3 + i * 0.8), k = ease.out(prog(t, st - 0.05, st + (r.v > 0.5 ? 1.0 : 0.4))), y = E.H * (0.42 + i * Math.min(0.24, 0.42 / Math.max(1, rows.length - 1))), col = colOf(r.col) || BP();
      text(g, r.l, x - 30, y, { size: 42, color: r.col ? col : BP(), font: FONTS.ui, weight: 900, align: 'right', alpha: clamp(k * 3) });
      rr(g, x, y - 28, w, 56, 28); g.fillStyle = alpha(r.col ? col : BP(), 0.12); g.fill(); const ww = Math.max(56, w * Math.min(1, r.v) * k); rr(g, x, y - 28, ww, 56, 28); g.fillStyle = r.col ? col : BP(); g.fill(); glow(g, x + ww, y, 60, r.col ? col : BP(), 0.35 * k);
      if (r.v > 1 && k > 0.95) { for (let j = 0; j < 3; j++) seg(g, [[x + w + 14 + j * 16, y - 20], [x + w + 24 + j * 16, y + 20]], 5, col); }
      text(g, r.val, x + Math.min(w, ww) + (r.v > 1 ? 80 : 24), y + 2, { size: 54, color: r.col ? col : BP(), font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(k * 3) }); });
  },
  // working memory slots: normal 4 vs you 40: {n1, n2, at1, at2}
  slots(g, t, info) {
    const c = BP(), n1 = info.n1 ?? 4, n2 = info.n2 ?? 40, t1 = wt(info, info.at1, 0.2), t2 = wt(info, info.at2, 1.4), icons = ['bulb', 'note', 'chess', 'grid', 'pen', 'cal', 'gift', 'jam', 'clock', 'dog'];
    fig(g, E.W * 0.25, E.H * 0.9, 1.6, alpha(c, 0.8)); fig(g, E.W * 0.7, E.H * 0.9, 1.6, C().gold);
    for (let i = 0; i < n1; i++) { const k = spring(t, t1 + i * 0.12); if (k <= 0) continue; const a = -Math.PI * 0.85 + i / Math.max(1, n1 - 1) * Math.PI * 0.7, x = E.W * 0.25 + Math.cos(a) * 200 * k, y = E.H * 0.42 + Math.sin(a) * 140 * k; circle(g, x, y, 40, alpha(c, 0.9)); icon(g, icons[i], x, y, 46, '#0b1324'); }
    for (let i = 0; i < n2; i++) { const k = spring(t, t2 + i * 0.03); if (k <= 0) continue; const ring_ = Math.floor(i / 14), j = i % 14, a = -Math.PI + (j + 0.5) / 14 * Math.PI, R = (170 + ring_ * 80) * k, x = E.W * 0.7 + Math.cos(a) * R * 1.3, y = E.H * 0.5 + Math.sin(a) * R; circle(g, x, y, 22, C().gold); icon(g, icons[i % icons.length], x, y, 26, '#0b1324'); }
    lab(g, t, info, `NORMAL: ${n1}`, E.W * 0.25, E.H * 0.12, info.at1, { color: c, size: 52 }); if (n2) lab(g, t, info, `YOU: ${n2}`, E.W * 0.7, E.H * 0.12, info.at2, { color: C().gold, size: 52, fb: 1.4 });
  },
  // light bulbs: 20 W dim vs 60 W bright: {at1, at2}
  bulb(g, t, info) {
    const c = BP(); [[E.W * 0.3, '20 W', info.at1, 0.25, c, 'NORMAL'], [E.W * 0.7, info.w2 || '60 W', info.at2, 1, C().gold, 'YOURS']].forEach(([x, s, at, b, col, n], i) => { const st = wt(info, at, 0.4 + i * 1.6), k = ease.out(prog(t, st - 0.1, st + 0.4)); if (k <= 0 && i) return;
      glow(g, x, E.H * 0.42, 220 + 260 * b, col, (0.15 + 0.45 * b) * k); g.strokeStyle = col; g.lineWidth = 8; g.beginPath(); g.arc(x, E.H * 0.4, 130, Math.PI * 0.75, Math.PI * 2.25); g.lineTo(x + 60, E.H * 0.62); g.lineTo(x - 60, E.H * 0.62); g.closePath(); g.stroke();
      g.fillStyle = alpha(col, 0.15 + 0.5 * b * k); g.fill(); for (let j = 0; j < 3; j++) seg(g, [[x - 60, E.H * 0.65 + j * 22], [x + 60, E.H * 0.65 + j * 22]], 8, col); seg(g, [[x - 30, E.H * 0.5], [x - 15, E.H * 0.42], [x, E.H * 0.5], [x + 15, E.H * 0.42], [x + 30, E.H * 0.5]], 5, col);
      big(g, t, info, s, x, E.H * 0.16, at, { size: 100, color: col, fb: 0.4 + i * 1.6 }); lab(g, t, info, n, x, E.H * 0.86, at, { color: col, fb: 0.4 + i * 1.6 }); });
  },
  // the 10% myth: a brain with only 10% lit, the rest locked; mode 'all' lights everything: {at, mode}
  myth(g, t, info) {
    const c = BP(), x = E.W * 0.42, y = E.H * 0.52, r = 330, all = info.mode === 'all', st = wt(info, info.at, 0.4), k = all ? ease.inOut(prog(t, st, st + 1.2)) : 0, rr2 = rng(7);
    brain(g, x, y, r, alpha(c, 0.7)); for (let i = 0; i < 60; i++) { const a = rr2() * 6.28, d = Math.sqrt(rr2()), px = x + Math.cos(a) * r * 0.62 * d, py = y + Math.sin(a) * r * 0.55 * d, on = i < 6 || rr2() < k; circle(g, px, py, 11, on ? C().gold : alpha(c, 0.35)); if (on) glow(g, px, py, 40, C().gold, 0.4 * (0.6 + 0.4 * Math.sin(t * 4 + i))); }
    if (!all) { const lk = ease.out(prog(t, wt(info, info.lockAt || 'Locked', 1.5), wt(info, info.lockAt || 'Locked', 1.5) + 0.4)); if (lk > 0) { rr(g, x + r * 0.7 - 50, y - 40, 100, 80, 12); g.strokeStyle = alpha(C().accent, lk); g.lineWidth = 8; g.stroke(); g.beginPath(); g.arc(x + r * 0.7, y - 40, 34, Math.PI, 0); g.stroke(); } big(g, t, info, '10%', E.W * 0.8, E.H * 0.3, info.at || '10', { size: 150 }); lab(g, t, info, '90% LOCKED?', E.W * 0.8, E.H * 0.5, info.lockAt || 'Locked', { color: C().accent, size: 50, fb: 1.5 }); }
    else { lab(g, t, info, 'ACTIVE ALL OVER', E.W * 0.8, E.H * 0.34, info.at, { color: C().gold, size: 50 }); lab(g, t, info, 'EVEN ASLEEP', E.W * 0.8, E.H * 0.46, info.at2 || 'sleep', { color: C().cream, size: 44, fb: 1.6 }); if (info.myth) { const q = ease.out(prog(t, 0.2, 0.6)); kText(g, t, 'MYTH', E.W * 0.8, E.H * 0.72, { start: wt(info, info.myth, 0.3), mode: 'slam', size: 120, color: C().accent, glow: 24, font: FONTS.ui, weight: 900 }); } }
  },
  // 86 billion neurons: a field of dots, then all fire: {at, fire}
  neurons(g, t, info) {
    const c = BP(), r = rng(9), f = wt(info, info.fire || 'fire', 99), k = ease.out(prog(t, f, f + 0.5));
    for (let i = 0; i < 160; i++) { const x = E.W * 0.08 + r() * E.W * 0.84, y = E.H * 0.26 + r() * E.H * 0.62, on = k > 0 && (r() < k); circle(g, x, y, 7, on ? C().gold : alpha(c, 0.5)); seg(g, [[x, y], [x + (r() - 0.5) * 90, y + (r() - 0.5) * 70]], 2, alpha(on ? C().gold : c, 0.4)); if (on) glow(g, x, y, 30, C().gold, 0.5 * (0.6 + 0.4 * Math.sin(t * 9 + i))); }
    big(g, t, info, '86 BILLION', E.W / 2, E.H * 0.13, info.at || '86', { size: 110 }); if (k > 0) lab(g, t, info, 'ALL FIRING', E.W / 2, E.H * 0.94, info.fire || 'fire', { color: C().accent, size: 46 });
  },
  // the rule: brain LOUD, body the same: {parts:[[label, value, word, dy, color]]}
  rule2(g, t, info) {
    const c = BP(), x = E.W * 0.38, y = E.H * 0.92; fig(g, x, y, 3.0, alpha(c, 0.7)); const bk = ease.out(prog(t, wt(info, 'louder', 0.4), wt(info, 'louder', 0.4) + 0.5)); brain(g, x + 10, y - 640, 70 + 20 * bk, C().gold, 1 + bk);
    for (let i = 0; i < 4 * bk; i++) { g.strokeStyle = alpha(C().gold, 0.6 - i * 0.12); g.lineWidth = 5; g.beginPath(); g.arc(x + 10, y - 640, 120 + i * 40 + (t * 40) % 40, 0, 7); g.stroke(); }
    const parts = info.parts || [['BRAIN', 'LOUDER', 'louder', -640, 'gold'], ['STOMACH', 'SAME', 'stomach', -360, 'accent'], ['BLOOD', 'SAME', 'blood', -470, 'accent'], ['LEGS', 'SAME', 'legs', -150, 'accent']];
    parts.forEach(([n, v, w, dy, col], i) => { const cc = C()[col] || col, k = lab(g, t, info, `${n}  ${v}`, E.W * 0.6, y + dy, w, { color: cc, size: 46, align: 'left', fb: 0.3 + i * 0.5 }); if (k > 0) { g.setLineDash([6, 8]); seg(g, [[x + 60, y + dy], [E.W * 0.58, y + dy]], 2, alpha(cc, 0.6 * k)); g.setLineDash([]); } });
  },
  // the filter: world noise -> funnel -> a few signals (normal) / all through (yours): {mode}
  filter(g, t, info) {
    const c = BP(), yours = info.mode === 'yours', r = rng(2), fx = E.W * 0.5, top = E.H * 0.18;
    poly(g, [[fx - 300, top + 120], [fx + 300, top + 120], [fx + 60, top + 380], [fx - 60, top + 380]], alpha(c, 0.08)); g.strokeStyle = yours ? alpha(C().accent, 0.5) : c; g.lineWidth = 6; g.setLineDash(yours ? [14, 14] : []); g.beginPath(); g.moveTo(fx - 300, top + 120); g.lineTo(fx - 60, top + 380); g.moveTo(fx + 300, top + 120); g.lineTo(fx + 60, top + 380); g.stroke(); g.setLineDash([]);
    for (let i = 0; i < 40; i++) { const ph = (t * 0.5 + r()) % 1, sx = E.W * 0.1 + r() * E.W * 0.8, pass = yours || i % 8 === 0, y = lerp(top - 40, E.H * 0.92, ph), x = ph < 0.33 ? lerp(sx, fx + (sx - fx) * 0.4, ph * 3) : pass ? fx + (sx - fx) * 0.12 * (1 + (ph - 0.33)) : fx + (sx - fx) * 0.4;
      if (!pass && ph > 0.33) continue; circle(g, x, y, 9, pass && ph > 0.4 ? (yours ? C().accent : C().gold) : alpha(c, 0.7)); }
    lab(g, t, info, yours ? 'YOURS: EVERYTHING GETS THROUGH' : 'NORMAL BRAIN: FILTERS MOST OUT', E.W / 2, E.H * 0.1, info.at || 0.2, { color: yours ? C().accent : C().cream, size: 50 });
  },
  // the rig: built for 4 projectors, carrying 8: {at1, at2}
  rigload(g, t, info) {
    const c = BP(), x0 = E.W * 0.15, x1 = E.W * 0.85, y = E.H * 0.35; seg(g, [[x0, y], [x1, y]], 14, c); for (const x of [x0 + 40, x1 - 40]) seg(g, [[x, 0], [x, y]], 4, c);
    const t1 = wt(info, info.at1 || 'four', 0.3), t2 = wt(info, info.at2 || 'eight', 1.4);
    for (let i = 0; i < 8; i++) { const extra = i % 2 === 1, k = spring(t, extra ? t2 + i * 0.05 : t1 + i * 0.05); if (k <= 0) continue; const x = lerp(x0 + 90, x1 - 90, i / 7), yy = y + 20 + (1 - clamp(k)) * -60; rr(g, x - 40, yy, 80, 60, 8); g.strokeStyle = extra ? C().accent : C().gold; g.lineWidth = 5; g.stroke(); circle(g, x, yy + 30, 12, extra ? C().accent : C().gold); }
    const sag = 40 * ease.inOut(prog(t, t2 + 0.4, t2 + 1.4)); g.strokeStyle = alpha(C().accent, sag / 40); g.lineWidth = 4; g.setLineDash([10, 10]); g.beginPath(); g.moveTo(x0, y + 120); g.quadraticCurveTo(E.W / 2, y + 120 + sag * 2, x1, y + 120); g.stroke(); g.setLineDash([]);
    big(g, t, info, 'BUILT FOR 4', E.W * 0.3, E.H * 0.72, info.at1 || 'four', { size: 80, color: C().gold }); big(g, t, info, 'CARRIES 8', E.W * 0.7, E.H * 0.72, info.at2 || 'eight', { size: 80, color: C().accent, fb: 1.4 });
  },
  // race vs the clock: {dist, speed, need, have, at1..}
  race(g, t, info) {
    const c = BP(), x0 = E.W * 0.12, x1 = E.W * 0.88, y = E.H * 0.7, k = clamp(t / (info.runDur ?? info.dur)), px = lerp(x0, x1, ease.inOut(k));
    seg(g, [[x0, y], [x1, y]], 4, c); UI.lineFigure(g, { x: info.run === false ? x0 : px, y, s: 1.4, pose: info.run === false ? POSES.stand : walkPose(t * 10, { run: true }), color: C().gold });
    UI.lineFigure(g, { x: x1, y, s: 1.4, pose: POSES.stand, color: alpha(c, 0.9), facing: -1 });
    if (info.fall) { const fy = lerp(E.H * 0.08, y - 40, ease.in(clamp(t / (info.fallDur ?? info.dur)))); rr(g, x1 - 160, fy - 14, 320, 28, 6); g.fillStyle = C().accent; g.fill(); }
    UI.dimension(g, t, { x1: x0, y1: y + 60, x2: x1, y2: y + 60, str: info.dist || '18 m', start: wt(info, info.distAt, 0.1) - 0.3 });
    (info.labels || []).forEach((l, i) => big(g, t, info, l.s, E.W * (l.x ?? 0.5), E.H * (l.y ?? (0.2 + i * 0.15)), l.at, { size: l.size || 90, color: colOf(l.col), fb: 0.4 + i * 0.8, mode: l.mode }));
  },
  // 40 plans, 39 fail: {n, at}
  plans40(g, t, info) {
    const c = BP(), n = info.n || 40; for (let i = 0; i < n; i++) { const x = E.W * 0.14 + (i % 10) * E.W * 0.08, y = E.H * 0.24 + Math.floor(i / 10) * E.H * 0.15, k = ease.out(prog(t, 0.1 + i * 0.03, 0.4 + i * 0.03)); if (k <= 0) continue;
      g.setLineDash([6, 6]); seg(g, [[x - 30, y + 40], [x, y - 20 * k], [x + 30, y + 40 * (i % 2 ? -1 : 1) * 0.3]], 3, alpha(c, 0.7)); g.setLineDash([]);
      const fail = t > wt(info, info.failAt || 'same', 1.5) && i < n - 1, win = i === n - 1 && t > wt(info, info.winAt || '40th', 2.5); if (fail) { seg(g, [[x - 20, y - 20], [x + 20, y + 20]], 5, C().accent); seg(g, [[x + 20, y - 20], [x - 20, y + 20]], 5, C().accent); } if (win) { circle(g, x, y, 30, alpha(C().gold, 0.3)); ring(g, x, y, 30, 5, C().gold); glow(g, x, y, 90, C().gold, 0.5); } }
    if (info.big) big(g, t, info, info.big, E.W / 2, E.H * 0.9, info.bigAt || 0.3, { size: 80, color: colOf(info.bigCol) });
  },
  // spreadsheets in a dream: rows of cells floating
  dream(g, t, info) {
    const c = BP(), r = rng(5); for (let k = 0; k < 6; k++) { const x = E.W * (0.1 + (k % 3) * 0.3) + Math.sin(t * 0.5 + k) * 20, y = E.H * (0.2 + Math.floor(k / 3) * 0.4) + Math.cos(t * 0.4 + k) * 20; for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) { g.strokeStyle = alpha(c, 0.6); g.lineWidth = 2; g.strokeRect(x + j * 70, y + i * 40, 70, 40); if (r() < 0.4) text(g, String(Math.floor(r() * 99)), x + j * 70 + 35, y + i * 40 + 22, { size: 20, color: alpha(C().gold, 0.8), font: FONTS.ui, weight: 900 }); } }
    for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; text(g, 'Z', E.W * 0.85 + ph * 60, E.H * 0.2 - ph * 100, { size: 50 + ph * 30, color: alpha(C().cream, 1 - ph), font: FONTS.title, weight: 700 }); }
  },
});
// make the old fall diagram's speed label optional and sound distance configurable
const oldFall = DIAGRAMS.fall; DIAGRAMS.fall = (g, t, info) => oldFall(g, t, { ...info, at2: info.at2 || 99 });
