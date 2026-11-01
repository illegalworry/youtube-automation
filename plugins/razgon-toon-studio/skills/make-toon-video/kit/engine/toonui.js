// engine/toonui.js — flat on-screen graphics for the Toon look: no glows, clean bold type with dark outlines,
// black label boxes with gold text ("ROUND 1"), paper notes, stickers, counters, chapter titles and an end screen.
import { E, S, V, clamp, lerp, prog, ease, alpha, shade, rr, poly, circle, text, measure, FONTS } from './core.js';
import { spring } from './motion.js';

const popK = (t, start, o = {}) => spring(t, start, { freq: o.freq ?? 2.6, damp: o.damp ?? 0.5 });
const outK = (t, out) => (out == null ? 1 : 1 - ease.inOut(prog(t, out, out + 0.25)));

// labelBox(g, t, 'ROUND 1', x, y, {start, out, size, color, bg, border}) — black rounded box, gold caps text (pops with a spring)
export function labelBox(g, t, str, x, y, o = {}) {
  const k = popK(t, o.start ?? 0, o) * outK(t, o.out); if (k <= 0.001) return;
  const ui = S().ui, size = o.size || V(46, 54), w = measure(g, str, size, FONTS.ui, 900) + size * 1.1, h = size * 1.55;
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate(o.rot || 0);
  rr(g, -w / 2 + 4, -h / 2 + 6, w, h, h * 0.18); g.fillStyle = 'rgba(0,0,0,.25)'; g.fill();
  rr(g, -w / 2, -h / 2, w, h, h * 0.18); g.fillStyle = o.bg || '#16161a'; g.fill(); g.strokeStyle = o.border || alpha(ui.gold, 0.8); g.lineWidth = 3; g.stroke();
  text(g, str, 0, 2, { size, font: FONTS.ui, weight: 900, color: o.color || ui.gold, spacing: 2 });
  g.restore();
}
// big flat title: white (or gold) heavy letters with a thick dark outline and a hard drop shadow
export function toonTitle(g, t, lines, o = {}) {
  const ui = S().ui, y = o.y ?? E.H * 0.42, gap = o.gap ?? 1.08, start = o.start ?? 0;
  lines.forEach((ln, i) => {
    const size = o.size ? o.size * (i === lines.length - 1 ? 1 : 0.72) : V(i === lines.length - 1 ? 120 : 84, i === lines.length - 1 ? 104 : 76);
    const k = popK(t, start + i * 0.18, o) * outK(t, o.out); if (k <= 0.001) return;
    const yy = y + (i - (lines.length - 1) / 2) * size * gap;
    g.save(); g.translate(E.W / 2, yy); g.scale(k, k);
    text(g, ln, 6, 8, { size, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.35)', spacing: 2 });
    text(g, ln, 0, 0, { size, font: FONTS.ui, weight: 900, color: i === lines.length - 1 ? (o.color || ui.gold) : '#ffffff', stroke: size * 0.16, strokeColor: '#141418', spacing: 2 });
    g.restore();
  });
}
// tilted paper note / sticky label with handwriting ("SHOW $1", "DAY 3", "PROFIT?")
export function paperNote(g, t, str, x, y, o = {}) {
  const k = popK(t, o.start ?? 0, o) * outK(t, o.out); if (k <= 0.001) return;
  const size = o.size || V(46, 54), w = measure(g, str, size, FONTS.hand, 400) + size * 0.9, h = size * 1.45;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.05); g.scale(k, k);
  rr(g, -w / 2 + 3, -h / 2 + 5, w, h, 5); g.fillStyle = 'rgba(0,0,0,.2)'; g.fill();
  rr(g, -w / 2, -h / 2, w, h, 5); g.fillStyle = o.color || '#e3c48c'; g.fill(); g.strokeStyle = shade(o.color || '#e3c48c', -0.25); g.lineWidth = 2.5; g.stroke();
  text(g, str, 0, 2, { size, font: FONTS.hand, weight: 400, color: o.ink || '#1d1a16' });
  g.restore();
}
// round sticker / badge ("$4", "x10", "NEW") — coloured disc, white outline, bold number
export function sticker(g, t, str, x, y, o = {}) {
  const k = popK(t, o.start ?? 0, { freq: 3, damp: 0.38 }) * outK(t, o.out); if (k <= 0.001) return;
  const r = o.r || V(80, 90), c = o.color || S().ui.accent;
  g.save(); g.translate(x, y); g.rotate((o.rot ?? -0.12) * (2 - k)); g.scale(k, k);
  circle(g, 4, 7, r, 'rgba(0,0,0,.25)'); circle(g, 0, 0, r + 6, '#ffffff'); circle(g, 0, 0, r, c);
  const size = Math.min(r * 0.9, (r * 1.6) / Math.max(1, measure(g, str, 100, FONTS.ui, 900) / 100));
  text(g, str, 0, 3, { size, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: size * 0.1, strokeColor: shade(c, -0.45) });
  g.restore();
}
// counting number with a label under it (money, days, views) — flat, outlined
export function counter(g, t, o = {}) {
  const { from = 0, to = 100, start = 0, dur = 1.2, x = E.W / 2, y = E.H * 0.3, prefix = '', suffix = '', label = null, size = V(110, 120), decimals = 0 } = o;
  const k = popK(t, start) * outK(t, o.out); if (k <= 0.001) return;
  const v = lerp(from, to, ease.out(prog(t, start, start + dur))), str = prefix + v.toFixed(decimals) + suffix;
  g.save(); g.translate(x, y); g.scale(k, k);
  text(g, str, 5, 7, { size, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.3)' });
  text(g, str, 0, 0, { size, font: FONTS.ui, weight: 900, color: o.color || S().ui.gold, stroke: size * 0.14, strokeColor: '#141418' });
  if (label) text(g, label, 0, size * 0.78, { size: size * 0.32, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: size * 0.06, strokeColor: '#141418', spacing: 3 });
  g.restore();
}
// arrow pointing at something (hand-drawn feel), grows from `from` to `to`
export function arrow(g, t, from, to, o = {}) {
  const p = ease.out(prog(t, o.start ?? 0, (o.start ?? 0) + 0.4)) * outK(t, o.out); if (p <= 0) return;
  const x = lerp(from[0], to[0], p), y = lerp(from[1], to[1], p), a = Math.atan2(to[1] - from[1], to[0] - from[0]), c = o.color || '#ffffff', w = o.w || 9;
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#141418'; g.lineWidth = w + 6; g.beginPath(); g.moveTo(from[0], from[1]); g.quadraticCurveTo((from[0] + x) / 2, Math.min(from[1], y) - 40, x, y); g.stroke();
  g.strokeStyle = c; g.lineWidth = w; g.stroke();
  poly(g, [[x + Math.cos(a) * 26, y + Math.sin(a) * 26], [x + Math.cos(a + 2.4) * 22, y + Math.sin(a + 2.4) * 22], [x + Math.cos(a - 2.4) * 22, y + Math.sin(a - 2.4) * 22]], c); g.restore();
}
// end screen: question on a soft colour field + subscribe pill (characters are drawn by the shot itself)
export function toonEnd(g, t, o = {}) {
  const ui = S().ui; g.fillStyle = o.bg || '#8cc4ea'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  toonTitle(g, t, o.lines || ['WOULD YOU', 'PAY $1?'], { y: E.H * V(0.24, 0.24), color: o.color || ui.gold, size: o.size || V(150, 130) });
  const k = popK(t, 0.8); if (k > 0.01) { g.save(); g.translate(E.W * V(0.84, 0.5), E.H * V(0.1, 0.9)); g.scale(k, k); rr(g, -190, -44, 380, 88, 44); g.fillStyle = '#e8443a'; g.fill(); text(g, o.cta || 'SUBSCRIBE', 0, 2, { size: 44, font: FONTS.ui, weight: 900, color: '#fff', spacing: 2 }); g.restore(); }
}
