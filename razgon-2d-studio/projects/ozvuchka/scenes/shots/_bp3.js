// _bp3.js — blueprint diagrams for "Win Every Argument". Merged into DIAGRAMS.
import { E, ease, prog, clamp, lerp, alpha, mix, rr, circle, ring, poly, seg, glow, text, FONTS } from '/engine/core.js';
import { spring, kText } from '/engine/motion.js';
import * as UI from '/engine/ui2d.js';
import { POSES } from '/engine/rig2d.js';
import { wt, COL } from './_common.js';
import { DIAGRAMS } from './_bp.js';
import { brain } from './_bp2.js';

const BP = () => UI.bpStroke();
const C = () => COL();
const lab = (g, t, info, s, x, y, at, o = {}) => { const st = wt(info, at, o.fb ?? 0.3); const k = ease.out(prog(t, st - 0.05, st + 0.3)); if (k <= 0) return 0; text(g, s, x, y + (1 - k) * 20, { size: o.size || 44, color: o.color || C().cream, font: FONTS.ui, weight: 900, alpha: k, spacing: 2, align: o.align || 'center', glow: 10, glowColor: alpha(o.color || C().cream, 0.4) }); return k; };
const big = (g, t, info, s, x, y, at, o = {}) => kText(g, t, s, x, y, { start: wt(info, at, o.fb ?? 0.3) - 0.08, mode: o.mode || 'slam', size: o.size || 110, color: o.color || C().gold, glow: 24, glowColor: alpha(o.color || C().gold, 0.6), font: FONTS.ui, weight: 900, out: info.dur - 0.3 });
const fig = (g, x, y, s, c, pose = POSES.stand, facing = 1) => UI.lineFigure(g, { x, y, s, pose, color: c, facing });
function eye(g, x, y, r, open, c) { g.strokeStyle = c; g.lineWidth = 6; g.beginPath(); g.ellipse(x, y, r, r * 0.55 * open + 2, 0, 0, 7); g.stroke(); if (open > 0.3) { circle(g, x, y, r * 0.3 * open, c); } }
function bubble(g, x, y, w, h, c, a = 1, tail = 1) { g.globalAlpha = a; rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); poly(g, [[x - 20 * tail, y + h / 2 - 2], [x - 50 * tail, y + h / 2 + 40], [x + 10 * tail, y + h / 2 - 2]], c); g.globalAlpha = 1; }

Object.assign(DIAGRAMS, {
  // reply gap: speaker stops -> 0.2 s -> answer; a blink takes the same: {at}
  blink(g, t, info) { const c = BP(); fig(g, E.W * 0.22, E.H * 0.86, 1.8, alpha(c, 0.8), POSES.talk, 1); fig(g, E.W * 0.78, E.H * 0.86, 1.8, alpha(c, 0.8), POSES.talk, -1);
    const st = wt(info, info.at || 'two', 0.6); bubble(g, E.W * 0.3, E.H * 0.3, 300, 110, c, 1 - ease.out(prog(t, st - 0.3, st))); const k = ease.out(prog(t, st, st + 0.6));
    seg(g, [[E.W * 0.34, E.H * 0.48], [lerp(E.W * 0.34, E.W * 0.66, k), E.H * 0.48]], 6, C().gold); if (k >= 1) { bubble(g, E.W * 0.7, E.H * 0.3, 300, 110, C().gold, 1, -1); }
    big(g, t, info, '0.2 s', E.W / 2, E.H * 0.56, info.at || 'two', { size: 100 });
    const bt = wt(info, info.blink || 'blink', 2), bk = t > bt && t < bt + 0.25 ? 1 - Math.sin((t - bt) / 0.25 * Math.PI) : 1; eye(g, E.W / 2, E.H * 0.18, 70, bk, C().cream); lab(g, t, info, '= A BLINK', E.W / 2 + 230, E.H * 0.18, info.blink || 'blink', { color: C().cream, size: 44 }); },
  // conversation turns: B starts planning while A is still talking (2009, 10 languages): {at}
  turns(g, t, info) { const c = BP(), x0 = E.W * 0.12, x1 = E.W * 0.88, ya = E.H * 0.4, yb = E.H * 0.6, cut = E.W * 0.6, k = clamp(t / 2.2);
    text(g, 'A', x0 - 50, ya, { size: 50, color: c, font: FONTS.ui, weight: 900 }); text(g, 'B', x0 - 50, yb, { size: 50, color: C().gold, font: FONTS.ui, weight: 900 });
    rr(g, x0, ya - 30, Math.min(cut - x0, (x1 - x0) * k), 60, 30); g.fillStyle = alpha(c, 0.8); g.fill();
    const pk = ease.out(prog(t, wt(info, info.plan || 'planning', 1.2), wt(info, info.plan || 'planning', 1.2) + 0.8)); if (pk > 0) { g.setLineDash([10, 10]); rr(g, cut - 380, yb - 30, 380 * pk, 60, 30); g.strokeStyle = C().gold; g.lineWidth = 4; g.stroke(); g.setLineDash([]); lab(g, t, info, 'PLANNING', cut - 190, yb + 70, info.plan || 'planning', { color: C().gold, size: 34, fb: 1.2 }); }
    const sk = ease.out(prog(t, 1.9, 2.6)); if (k * (x1 - x0) > cut - x0 + 40) { rr(g, cut + 40, yb - 30, (x1 - cut - 40) * sk, 60, 30); g.fillStyle = C().gold; g.fill(); }
    UI.dimension(g, t, { x1: cut, y1: E.H * 0.25, x2: cut + 40, y2: E.H * 0.25, str: '200 ms', start: wt(info, info.at || '200', 1) });
    lab(g, t, info, '10 LANGUAGES', E.W / 2, E.H * 0.82, info.lang || '10', { color: C().cream, size: 48, fb: 0.6 }); },
  // persuade + judge (Mercier & Sperber 2011): two figures trade arguments, a third weighs them: {at}
  judge(g, t, info) { const c = BP(), C0 = C(); fig(g, E.W * 0.2, E.H * 0.86, 1.6, alpha(c, 0.85), POSES.explain, 1); fig(g, E.W * 0.8, E.H * 0.86, 1.6, alpha(c, 0.85), POSES.explain, -1); fig(g, E.W * 0.5, E.H * 0.66, 1.3, C0.gold, POSES.think, 1);
    for (let i = 0; i < 4; i++) { const ph = (t * 0.5 + i / 4) % 1, left = i % 2 === 0, x = left ? lerp(E.W * 0.26, E.W * 0.44, ph) : lerp(E.W * 0.74, E.W * 0.56, ph); circle(g, x, E.H * 0.5 - Math.sin(ph * Math.PI) * 80, 14, alpha(c, 1 - ph)); }
    const bx = E.W * 0.5, by = E.H * 0.2, tilt = Math.sin(t * 1.2) * 0.12; seg(g, [[bx, by + 120], [bx, by - 10]], 6, C0.gold); g.save(); g.translate(bx, by); g.rotate(tilt); seg(g, [[-200, 0], [200, 0]], 6, C0.gold); for (const s of [-1, 1]) { seg(g, [[s * 200, 0], [s * 200, 60]], 3, C0.gold); g.beginPath(); g.arc(s * 200, 60, 50, 0, Math.PI); g.strokeStyle = C0.gold; g.lineWidth = 5; g.stroke(); } g.restore();
    lab(g, t, info, 'PERSUADE', E.W * 0.2, E.H * 0.34, info.a1 || 'persuade', { color: c, size: 46 }); lab(g, t, info, 'PERSUADE', E.W * 0.8, E.H * 0.34, info.a1 || 'persuade', { color: c, size: 46 }); lab(g, t, info, 'JUDGE', E.W * 0.5, E.H * 0.94, info.a2 || 'judge', { color: C0.gold, size: 52, fb: 1.5 });
    if (info.year) big(g, t, info, info.year, E.W * 0.12, E.H * 0.12, info.year, { size: 70, mode: 'rise' }); },
  // backfire effect: a figure digging in (arrow pushes back) -> 2019 RARE; mind changes slowly: {at}
  backfire(g, t, info) { const c = BP(), C0 = C(), st = wt(info, info.at || 'rare', 99), k = ease.out(prog(t, st, st + 0.6)); fig(g, E.W * 0.62, E.H * 0.86, 2.0, alpha(c, 0.85), k > 0.5 ? POSES.think : POSES.crossArms, -1);
    const ax = lerp(E.W * 0.18, E.W * 0.5, ease.inOut(clamp((t % 2.4) / 1.2))) ; seg(g, [[E.W * 0.1, E.H * 0.45], [ax, E.H * 0.45]], 8, C0.cream); poly(g, [[ax, E.H * 0.45 - 24], [ax + 40, E.H * 0.45], [ax, E.H * 0.45 + 24]], C0.cream); lab(g, t, info, 'CORRECTION', E.W * 0.22, E.H * 0.38, 0.2, { color: C0.cream, size: 40 });
    if (k < 1) { g.globalAlpha = 1 - k; for (let i = 0; i < 3; i++) seg(g, [[E.W * 0.66 + i * 26, E.H * 0.9], [E.W * 0.7 + i * 26, E.H * 0.96]], 6, C0.accent); text(g, 'DIG IN?', E.W * 0.8, E.H * 0.3, { size: 60, color: C0.accent, font: FONTS.ui, weight: 900 }); g.globalAlpha = 1; }
    if (k > 0) { big(g, t, info, 'RARE', E.W * 0.82, E.H * 0.3, info.at || 'rare', { size: 120 }); lab(g, t, info, 'WOOD & PORTER · 2019', E.W * 0.5, E.H * 0.12, info.at2 || '2019', { color: C0.cream, size: 40, fb: 0.4 }); }
    else lab(g, t, info, 'THE BACKFIRE EFFECT', E.W * 0.5, E.H * 0.12, info.at2 || 'backfire', { color: C0.cream, size: 52, fb: 0.4 }); },
  // the trap: every argument Max throws ends up inside a big circle labelled HIS STORY
  trap(g, t, info) { const c = BP(), C0 = C(), cx = E.W * 0.64, cy = E.H * 0.5, R = 300; fig(g, E.W * 0.16, E.H * 0.86, 1.6, C0.gold, POSES.explain, 1);
    ring(g, cx, cy, R, 6, c); glow(g, cx, cy, R * 1.2, c, 0.15); lab(g, t, info, 'HIS STORY', cx, cy - R - 50, info.at || 'story', { color: c, size: 52, fb: 0.5 });
    for (let i = 0; i < 7; i++) { const t0 = 0.3 + i * 0.45, k = ease.inOut(prog(t, t0, t0 + 0.9)); if (k <= 0) continue; const a = -0.8 + i * 0.27, ex = cx + Math.cos(a + 3.14) * R * 0.4 * (i % 3) / 2, ey = cy + Math.sin(a) * R * 0.5;
      const x = lerp(E.W * 0.22, ex, k), y = lerp(E.H * 0.5, ey, k) - Math.sin(k * Math.PI) * 120; circle(g, x, y, 16, k >= 1 ? alpha(C0.gold, 0.5) : C0.gold); if (k >= 1) ring(g, x, y, 26, 3, alpha(c, 0.6)); }
    lab(g, t, info, 'ALREADY INSIDE', cx, cy + R + 60, info.at2 || 'inside', { color: C0.accent, size: 46, fb: 2.5 }); },
  // a nervous reach: 2 s arc of a hand, five word boxes fill the same 2 s
  reach(g, t, info) { const c = BP(), C0 = C(), st = wt(info, info.at || 'reach', 0.3), k = clamp((t - st) / 2);
    g.strokeStyle = alpha(c, 0.5); g.lineWidth = 4; g.setLineDash([10, 10]); g.beginPath(); g.arc(E.W * 0.3, E.H * 0.62, 260, Math.PI, Math.PI * 2); g.stroke(); g.setLineDash([]);
    const a = Math.PI + Math.PI * k; circle(g, E.W * 0.3 + Math.cos(a) * 260, E.H * 0.62 + Math.sin(a) * 260, 26, C0.gold); lab(g, t, info, '2 s', E.W * 0.3, E.H * 0.7, info.at || 'two', { color: C0.gold, size: 70 });
    const w0 = wt(info, info.words || 'five', 2.5); ['YOU', 'WIN.', 'I', 'HATE', 'IT.'].forEach((s, i) => { const kk = ease.outBack(prog(t, w0 + i * 0.12, w0 + i * 0.12 + 0.3)); if (kk <= 0) return; rr(g, E.W * 0.56 + i * 150 - 65, E.H * 0.45 - 45, 130, 90, 14); g.strokeStyle = C0.gold; g.lineWidth = 4; g.stroke(); text(g, '?', E.W * 0.56 + i * 150, E.H * 0.45, { size: 50 * kk, color: C0.cream, font: FONTS.ui, weight: 900 }); });
    lab(g, t, info, '= 5 WORDS', E.W * 0.74, E.H * 0.62, info.words || 'five', { color: C0.cream, size: 56, fb: 2.6 }); },
});
