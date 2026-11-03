// engine/glowui.js — on-screen graphics in the Glow look: calm, clean, rounded, few words.
//   pill / countPill   dark rounded pill with an orange number ("57 %"), pops in with a spring, can count up
//   statCard           dark navy card: spaced-caps labels, rising bars (with icons), "≈ 3×" outline badge, citation
//   cite               tiny grey study citation in the bottom-right corner ("Zadro, Williams & Richardson 2004")
//   tag                small spaced-caps label on a soft dark plate (place names, "DAY 3", "YOU")
//   chapter            chapter title lower-left with a thin line ("The ethics of invisibility")
//   titleCard          big clean title (spaced caps) + optional subtitle, over a darkened/blurred scene
//   bubble             white speech/thought bubble with text, icon or "…"
//   meterBar           horizontal percentage bar with label + value
//   arrow              hand-drawn curved arrow toward a target
//   endCard            closing question + subscribe pill
// All times: t = seconds into the shot; start = when the element appears (use wordTime() to sync to the narration).
import { E, V, S, clamp, lerp, ease, prog, alpha, shade, mix, rr, seg, poly, circle, ring, text, measure, FONTS, linGrad, radGrad, glow } from './core.js';

const springK = (t, t0, f = 3.2, d = 7) => { const x = t - t0; if (x <= 0) return 0; return 1 - Math.exp(-d * x) * Math.cos(f * 2 * Math.PI * x * 0.5); };
const fadeOut = (t, end, d = 0.3) => (end == null ? 1 : clamp((end - t) / d));
// value formatting: 57 → "57 %"(suffix), 0.25 → "0.25"
const fmt = (v, dec) => (dec ? v.toFixed(dec) : Math.round(v).toString());

// pill(g, t, '57 %', x, y, { start, end, size, color, bg })
export function pill(g, t, str, x, y, o = {}) {
  const { start = 0, end = null, size = V(44, 52), color = S().ui.gold, bg = S().ui.pill, font = FONTS.sans } = o;
  const k = springK(t, start), a = clamp((t - start) / 0.12) * fadeOut(t, end); if (a <= 0) return;
  const w = measure(g, str, size, font, 800) + size * 1.0, h = size * 1.45;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k);
  g.fillStyle = alpha('#000', 0.25); rr(g, -w / 2 + 3, -h / 2 + 5, w, h, h / 2); g.fill();
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = bg; g.fill(); g.strokeStyle = S().ui.pillLine; g.lineWidth = 2; g.stroke();
  text(g, str, 0, 2, { size, font, weight: 800, color }); g.restore();
}
// countPill(g, t, { from:0, to:57, suffix:' %', start, dur:0.8, x, y, dec })
export function countPill(g, t, o = {}) { const { from = 0, to = 100, suffix = ' %', prefix = '', start = 0, dur = 0.8, x = E.W * 0.8, y = E.H * 0.16, dec = 0 } = o; const v = lerp(from, to, ease.out(prog(t, start, start + dur))); pill(g, t, `${prefix}${fmt(v, dec)}${suffix}`, x, y, o); }

// statCard(g, t, { x, y, w, h, bars:[{label, v (0..1), color, icon(g,x,y,s)}], badge:'≈ 3×', cite:'…', start, end, title })
export function statCard(g, t, o = {}) {
  const ui = S().ui, { x = E.W * 0.6, y = E.H * 0.3, w = V(360, 520), h = V(400, 560), bars = [], badge = null, cite = null, start = 0, end = null, title = null } = o;
  const k = springK(t, start, 2.6, 6), a = clamp((t - start) / 0.18) * fadeOut(t, end); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x + w / 2, y + h / 2); g.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k); g.translate(-w / 2, -h / 2);
  g.fillStyle = alpha('#000', 0.3); rr(g, 6, 10, w, h, 22); g.fill();
  rr(g, 0, 0, w, h, 22); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 2; g.stroke();
  const pad = w * 0.09, base = h - (cite ? h * 0.2 : h * 0.12), top = h * (badge ? 0.34 : 0.18) + (title ? h * 0.08 : 0), n = Math.max(1, bars.length), bw = (w - pad * 2) / n * 0.46;
  if (title) text(g, title, w / 2, h * 0.09, { size: V(22, 28), font: FONTS.sans, weight: 700, color: ui.sub, spacing: 3 });
  if (badge) { const bs = V(30, 38), bwid = measure(g, badge, bs, FONTS.sans, 800) + bs * 1.2, by = h * (title ? 0.2 : 0.12); rr(g, pad, by, bwid, bs * 1.5, bs * 0.75); g.strokeStyle = ui.gold; g.lineWidth = 2.5; g.stroke(); text(g, badge, pad + bwid / 2, by + bs * 0.78, { size: bs, font: FONTS.sans, weight: 800, color: ui.cream }); }
  bars.forEach((b, i) => {
    const cx = pad + (i + 0.5) * ((w - pad * 2) / n), p = ease.out(prog(t, start + 0.25 + i * 0.25, start + 1.0 + i * 0.25)), bh = (base - top) * (b.v ?? 0.5) * p, col = b.color || [ui.bar1, ui.bar2][i % 2];
    rr(g, cx - bw / 2, base - bh, bw, Math.max(bh, 2), 6); g.fillStyle = col; g.fill();
    text(g, b.label || '', cx, base - bh - V(22, 28), { size: V(20, 26), font: FONTS.sans, weight: 700, color: ui.text, spacing: 2, alpha: clamp(p * 3) });
    if (b.icon) b.icon(g, cx, base + V(26, 32), 1); else if (b.value) text(g, b.value, cx, base + V(26, 32), { size: V(22, 28), font: FONTS.sans, weight: 700, color: col });
  });
  seg(g, [[pad * 0.6, base], [w - pad * 0.6, base]], 2, alpha(ui.text, 0.25));
  if (cite) text(g, cite, w / 2, h - h * 0.07, { size: V(15, 20), font: FONTS.ui, weight: 800, color: alpha(ui.sub, 0.9) });
  g.restore();
}
// tiny icons for statCard bars
export const icons = {
  flower: (g, x, y, s = 1) => { for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; circle(g, x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 6 * s, '#e86a5a'); } circle(g, x, y, 5 * s, '#f2c14a'); },
  eyes: (g, x, y, s = 1) => { for (const dx of [-9, 9]) { g.fillStyle = '#f4f1ea'; g.beginPath(); g.ellipse(x + dx * s, y, 5 * s, 8 * s, 0, 0, Math.PI * 2); g.fill(); } },
  coin: (g, x, y, s = 1) => { circle(g, x, y, 11 * s, '#e8b84a'); ring(g, x, y, 7 * s, 2 * s, '#b8862a'); },
  person: (g, x, y, s = 1) => { circle(g, x, y - 8 * s, 7 * s, '#f4f1ea'); rr(g, x - 8 * s, y, 16 * s, 14 * s, 5 * s); g.fillStyle = '#f4f1ea'; g.fill(); },
  heart: (g, x, y, s = 1) => { g.fillStyle = '#e86a7a'; g.beginPath(); g.moveTo(x, y + 9 * s); g.bezierCurveTo(x - 16 * s, y - 2 * s, x - 8 * s, y - 14 * s, x, y - 5 * s); g.bezierCurveTo(x + 8 * s, y - 14 * s, x + 16 * s, y - 2 * s, x, y + 9 * s); g.fill(); },
  clock: (g, x, y, s = 1) => { circle(g, x, y, 11 * s, '#f4f1ea'); seg(g, [[x, y], [x, y - 7 * s], [x, y], [x + 5 * s, y + 2 * s]], 2 * s, '#34343e'); },
};

// cite(g, 'Zadro, Williams & Richardson 2004', { a, start })
export function cite(g, str, o = {}) { const { a = 0.75, start = 0, t = 1, x = E.W - V(36, 40), y = E.H - V(28, 140), size = V(18, 24) } = o; const k = clamp((t - start) / 0.4); if (k <= 0) return; text(g, str, x, y, { size, font: FONTS.ui, weight: 800, color: '#d8dce8', align: 'right', alpha: a * k }); }

// tag(g, t, 'YOU', x, y, { start, end, size, plate })
export function tag(g, t, str, x, y, o = {}) {
  const { start = 0, end = null, size = V(28, 34), color = S().ui.cream, plate = true, spacing = 4 } = o; const a = clamp((t - start) / 0.25) * fadeOut(t, end); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; const w = measure(g, str, size, FONTS.sans, 700) + str.length * spacing + size * 1.2, h = size * 1.6, dy = (1 - ease.out(clamp((t - start) / 0.35))) * 10;
  if (plate) { rr(g, x - w / 2, y - h / 2 + dy, w, h, h / 2); g.fillStyle = alpha('#141626', 0.6); g.fill(); }
  text(g, str, x, y + dy + 1, { size, font: FONTS.sans, weight: 700, color, spacing }); g.restore();
}

// chapter(g, t, { title:'The ethics of invisibility', num:'Chapter 3', start, dur })
export function chapter(g, t, o = {}) {
  const { title = 'Chapter', num = null, start = 0, dur = 3.2, x = V(90, 70), y = E.H - V(130, 330) } = o; const a = clamp((t - start) / 0.4) * clamp((start + dur - t) / 0.5); if (a <= 0) return;
  const p = ease.out(clamp((t - start) / 0.7));
  g.save(); g.globalAlpha *= a; const sz = V(54, 60);
  if (num) text(g, num.toUpperCase(), x, y - sz * 1.05, { size: V(22, 26), font: FONTS.sans, weight: 700, color: alpha(S().ui.cream, 0.75), align: 'left', spacing: 5 });
  seg(g, [[x, y + sz * 0.72], [x + measure(g, title, sz, FONTS.sans, 700) * p, y + sz * 0.72]], 3, S().ui.gold);
  text(g, title, x, y, { size: sz, font: FONTS.sans, weight: 700, color: S().ui.cream, align: 'left', glow: 18, glowColor: 'rgba(0,0,0,.45)' }); g.restore();
}

// titleCard(g, t, { title:'WHAT IF YOU COULD TURN INVISIBLE?', sub, start, dur })
export function titleCard(g, t, o = {}) {
  const { title = 'WHAT IF…?', sub = null, start = 0, dur = 3, y = E.H * V(0.44, 0.42), size = V(76, 72), maxW = E.W * 0.82 } = o;
  const a = clamp((t - start) / 0.5) * clamp((start + dur - t) / 0.5); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.fillStyle = radGrad(g, E.W / 2, y, 0, E.W * 0.6, [alpha('#0a0c18', 0.55), alpha('#0a0c18', 0)]); g.fillRect(0, 0, E.W, E.H);
  const words = title.split(' '), lines = []; let cur = '';
  for (const w of words) { const tryS = cur ? cur + ' ' + w : w; if (measure(g, tryS, size, FONTS.sans, 800) + tryS.length * 4 > maxW && cur) { lines.push(cur); cur = w; } else cur = tryS; } lines.push(cur);
  const rise = (1 - ease.out(clamp((t - start) / 0.9))) * 18;
  lines.forEach((ln, i) => text(g, ln, E.W / 2, y + (i - (lines.length - 1) / 2) * size * 1.15 + rise, { size, font: FONTS.sans, weight: 800, color: '#ffffff', spacing: 4, glow: 30, glowColor: 'rgba(0,0,0,.5)' }));
  if (sub) text(g, sub, E.W / 2, y + (lines.length / 2) * size * 1.15 + size * 0.5, { size: size * 0.42, font: FONTS.sans, weight: 600, color: alpha(S().ui.cream, 0.85), spacing: 6 });
  g.restore();
}

// bubble(g, x, y, { str, w, h, tail:[dx,dy], thought, start, t, icon(g,x,y) })
export function bubble(g, x, y, o = {}) {
  const { str = null, w = 160, h = 92, tail = [-40, 60], thought = false, start = 0, t = 1, size = 34, color = '#f6f3ee', ink = '#33343f', icon = null, end = null } = o;
  const k = springK(t, start, 3, 7), a = clamp((t - start) / 0.12) * fadeOut(t, end); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(0.5 + 0.5 * k, 0.5 + 0.5 * k);
  g.fillStyle = alpha('#000', 0.2); rr(g, -w / 2 + 3, -h / 2 + 5, w, h, h / 2); g.fill();
  g.fillStyle = color; if (thought) { circle(g, tail[0] * 0.55, h / 2 + tail[1] * 0.35, 12, color); circle(g, tail[0] * 0.9, h / 2 + tail[1] * 0.75, 7, color); } else poly(g, [[tail[0] * 0.2 - 14, h / 2 - 6], [tail[0] * 0.2 + 14, h / 2 - 6], [tail[0], h / 2 + tail[1] * 0.6]], color);
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fill();
  if (icon) icon(g, 0, 0); else if (str) text(g, str, 0, 2, { size, font: FONTS.sans, weight: 700, color: ink }); else for (let i = 0; i < 3; i++) circle(g, (i - 1) * 24, 0, 7, alpha(ink, 0.4 + 0.6 * ((Math.floor(t * 3) % 3) === i ? 1 : 0)));
  g.restore();
}

// meterBar(g, t, { label:'HONEST', v:0.57, x, y, w, start, color, showValue })
export function meterBar(g, t, o = {}) {
  const ui = S().ui, { label = '', v = 0.5, x = E.W * 0.2, y = E.H * 0.8, w = E.W * 0.6, h = V(26, 32), start = 0, color = ui.gold, end = null, suffix = ' %' } = o;
  const a = clamp((t - start) / 0.25) * fadeOut(t, end); if (a <= 0) return; const p = ease.out(prog(t, start + 0.15, start + 1.1));
  g.save(); g.globalAlpha *= a; rr(g, x, y, w, h, h / 2); g.fillStyle = alpha('#141626', 0.6); g.fill(); rr(g, x + 3, y + 3, Math.max(h - 6, (w - 6) * v * p), h - 6, (h - 6) / 2); g.fillStyle = color; g.fill();
  if (label) text(g, label, x, y - h * 0.9, { size: V(24, 30), font: FONTS.sans, weight: 700, color: ui.cream, align: 'left', spacing: 3 });
  text(g, `${Math.round(v * p * 100)}${suffix}`, x + w, y - h * 0.9, { size: V(28, 34), font: FONTS.sans, weight: 800, color, align: 'right' }); g.restore();
}

// arrow(g, t, [x0,y0], [x1,y1], { start, bend, color, w })
export function arrow(g, t, p0, p1, o = {}) {
  const { start = 0, bend = 0.25, color = S().ui.cream, w = 5, dur = 0.5 } = o; const p = ease.out(prog(t, start, start + dur)); if (p <= 0) return;
  const mx = (p0[0] + p1[0]) / 2 - (p1[1] - p0[1]) * bend, my = (p0[1] + p1[1]) / 2 + (p1[0] - p0[0]) * bend;
  const pt = (u) => [(1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * mx + u * u * p1[0], (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * my + u * u * p1[1]];
  g.save(); g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 30; i++) { const q = pt((i / 30) * p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke();
  if (p > 0.95) { const a = pt(p), b = pt(p - 0.05), ang = Math.atan2(a[1] - b[1], a[0] - b[0]); for (const d of [-0.5, 0.5]) seg(g, [a, [a[0] - Math.cos(ang + d) * 22, a[1] - Math.sin(ang + d) * 22]], w, color); }
  g.restore();
}

// endCard(g, t, { question:'Would you stay honest?', cta:'SUBSCRIBE', start })
export function endCard(g, t, o = {}) {
  const { question = 'What would you do?', cta = 'SUBSCRIBE', start = 0 } = o; const a = clamp((t - start) / 0.5); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.fillStyle = alpha('#0a0c18', 0.45); g.fillRect(0, 0, E.W, E.H);
  text(g, question, E.W / 2, E.H * V(0.38, 0.36), { size: V(66, 64), font: FONTS.serif, weight: 900, italic: true, color: '#ffffff', glow: 24, glowColor: 'rgba(0,0,0,.5)' });
  const k = springK(t, start + 0.6), pw = V(300, 360), ph = V(74, 86); g.translate(E.W / 2, E.H * V(0.56, 0.52)); g.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k);
  rr(g, -pw / 2, -ph / 2, pw, ph, ph / 2); g.fillStyle = '#d8453a'; g.fill(); text(g, cta, 0, 2, { size: V(32, 38), font: FONTS.sans, weight: 800, color: '#fff', spacing: 3 }); g.restore();
}
