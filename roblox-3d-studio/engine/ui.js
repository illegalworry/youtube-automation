// engine/ui.js — 2D overlays drawn on top of the 3D frame (logical units, see core.js):
// word-by-word captions, title cards, kinetic pop text, name tags, end card. Chunky Roblox-style type with thick outline.
import { E, V, clamp, lerp, prog, ease, alpha, text, measure, rr, FONTS } from './core.js';

const fadeIO = (t, dur, inT = 0.3, outT = 0.3) => clamp(Math.min(t / inT, (dur - t) / outT));
const spring = (t, o = {}) => { if (t <= 0) return 0; const w = 2 * Math.PI * (o.freq ?? 2.4), d = o.damp ?? 0.45; return 1 - Math.exp(-d * w * t) * Math.cos(w * Math.sqrt(1 - d * d) * t); };
const fit = (g, str, size, maxW) => Math.min(size, maxW / Math.max(1, measure(g, str, size) / size));

// captions (config.captions = true): groups of up to `max` words, current word highlighted and popped
export function captions(g, globalT, o = {}) {
  const words = E.words; if (!words.length) return; const { y = V(E.H - 140, E.H * 0.74), size = V(64, 82), max = 3, color = '#ffffff', hi = '#ffd23f' } = o;
  let i = -1; for (let k = words.length - 1; k >= 0; k--) if (globalT >= words[k].start - 0.05) { if (globalT <= words[k].end + 0.35) i = k; break; } if (i < 0) return;
  const st = Math.floor(i / max) * max, group = words.slice(st, st + max), strs = group.map(w => w.word.trim().toUpperCase());
  const w0 = strs.map(s => measure(g, s, size)).reduce((a, b) => a + b, 0) + size * 0.3 * (strs.length - 1);
  const sz = size * Math.min(1, (E.W * 0.9) / w0), gap = sz * 0.3, widths = strs.map(s => measure(g, s, sz)), total = widths.reduce((a, b) => a + b, 0) + gap * (strs.length - 1);
  let x = E.W / 2 - total / 2;
  strs.forEach((s, k) => { const cur = st + k === i; const pop = cur ? 1 + 0.12 * ease.out(prog(globalT, group[k].start, group[k].start + 0.12)) : 1; g.save(); g.translate(x + widths[k] / 2, y); g.scale(pop, pop); text(g, s, 0, 0, { size: sz, color: cur ? hi : color, stroke: sz * 0.2, strokeColor: '#111', weight: 700 }); g.restore(); x += widths[k] + gap; });
}

// overlay item from shot.text: { at, dur, str, style: 'title'|'pop'|'slam'|'lower'|'tag'|'banner'|'end', sub, color, x, y }
export function drawText(g, lt, it) {
  const t = lt - (it.at || 0), dur = it.dur || 2.5; if (t < 0 || t > dur) return;
  const style = it.style || 'pop', col = it.color || '#ffd23f';
  if (style === 'title') {
    const a = fadeIO(t, dur, 0.4, 0.4), s = 1 + 0.03 * t, size = fit(g, it.str, V(130, 110), E.W * 0.86), k = spring(t, { freq: 1.8, damp: 0.5 });
    g.save(); g.globalAlpha = a; g.translate(E.W / 2, it.y ?? E.H * 0.42); g.scale(s * (0.6 + 0.4 * k), s * (0.6 + 0.4 * k)); g.rotate(-0.03);
    text(g, it.str, 0, 0, { size, color: col, stroke: size * 0.22, strokeColor: '#111' });
    if (it.sub) text(g, it.sub, 0, size * 0.95, { size: size * 0.42, color: '#fff', stroke: size * 0.1, strokeColor: '#111', font: FONTS.ui, weight: 900 });
    g.restore(); return;
  }
  if (style === 'pop' || style === 'slam') {
    const k = spring(t, { freq: style === 'slam' ? 3 : 2.2, damp: 0.42 }), a = fadeIO(t, dur, 0.05, 0.25), size = fit(g, it.str, it.size || V(96, 84), E.W * 0.85);
    const sc = style === 'slam' ? lerp(2.4, 1, clamp(k, 0, 1.2)) : 0.3 + 0.7 * k;
    g.save(); g.globalAlpha = a; g.translate(it.x ?? E.W / 2, it.y ?? V(E.H * 0.2, E.H * 0.22)); g.scale(sc, sc); g.rotate((it.tilt ?? -4) * Math.PI / 180);
    text(g, it.str, 0, 0, { size, color: col, stroke: size * 0.2, strokeColor: '#111' }); g.restore(); return;
  }
  if (style === 'lower' || style === 'tag') {   // name plate in the lower left
    const k = ease.out(clamp(t / 0.35)) * fadeIO(t, dur, 0.01, 0.3), size = V(46, 50), w = measure(g, it.str, size, FONTS.ui, 900) + 60, x = V(90, 60) - (1 - k) * 80, y = E.H - V(200, 520);
    g.save(); g.globalAlpha = k; rr(g, x, y - size * 0.8, w, size * 1.6, 14); g.fillStyle = alpha('#111', 0.82); g.fill(); g.fillStyle = col; g.fillRect(x, y - size * 0.8, 10, size * 1.6);
    text(g, it.str, x + 34, y, { size, color: '#fff', font: FONTS.ui, weight: 900, align: 'left' });
    if (it.sub) text(g, it.sub, x + 34, y + size * 1.3, { size: size * 0.6, color: col, font: FONTS.ui, weight: 800, align: 'left', stroke: 6, strokeColor: '#111' });
    g.restore(); return;
  }
  if (style === 'banner') {   // full-width strip ("3 HOURS LATER…")
    const k = ease.inOut(clamp(t / 0.3)) * fadeIO(t, dur, 0.01, 0.3), h = V(130, 150), y = it.y ?? E.H / 2;
    g.save(); g.globalAlpha = k; g.fillStyle = alpha('#111', 0.8); g.fillRect(0, y - h / 2, E.W * k, h);
    text(g, it.str, E.W / 2, y, { size: fit(g, it.str, V(70, 64), E.W * 0.9), color: col, stroke: 10, strokeColor: '#000' }); g.restore(); return;
  }
  if (style === 'end') {
    const a = fadeIO(t, dur, 0.5, 0.01); g.save(); g.globalAlpha = a; g.fillStyle = alpha('#000', 0.45); g.fillRect(0, 0, E.W, E.H);
    text(g, it.str || 'THANKS FOR WATCHING!', E.W / 2, E.H * 0.4, { size: fit(g, it.str || 'THANKS FOR WATCHING!', V(100, 84), E.W * 0.86), color: col, stroke: 20, strokeColor: '#111' });
    if (it.sub) text(g, it.sub, E.W / 2, E.H * 0.4 + V(120, 110), { size: V(52, 48), color: '#fff', stroke: 10, strokeColor: '#111', font: FONTS.ui, weight: 900 });
    g.restore();
  }
}
