// engine/gameui.js — the retention graphics of game-world "What if" videos (see references/retention-playbook.md).
// All elements are world-skinned: blocky = rounded dark glass panels, voxel = square grey bevelled panels + pixel font,
// royale = slanted panels with italic comic type. Every element pops in on a spring at `start` (shot seconds) and fades at `out`.
import { E, V, W, S, F, FONTS, clamp, lerp, prog, ease, rr, circle, poly, seg, alpha, shade, mix, text, measure, glow, linGrad } from './core.js';
import { starShape } from './hero.js';

const sp = (t, t0, f = 2.6, z = 0.45) => { const x = t - t0; if (x <= 0) return 0; const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x)); };
const fadeOut = (t, out) => (out == null ? 1 : 1 - clamp((t - out) / 0.25));
const UI = () => S().ui;
const isVox = () => W() === 'voxel', isRoy = () => W() === 'royale';
const panelFont = () => (isVox() ? FONTS.pixel : FONTS.ui);
const pf = (size) => (isVox() ? size * 0.62 : size);          // the pixel font is wide — shrink it
// world-skinned panel (dark game UI card)
export function panel(g, x, y, w, h, o = {}) {
  const ui = UI(), fill = o.fill || ui.panel;
  if (isVox()) { g.fillStyle = '#1a1a1a'; g.fillRect(x - 4, y - 4, w + 8, h + 8); g.fillStyle = fill; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x, y, w, 4); g.fillRect(x, y, 4, h); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y + h - 4, w, 4); g.fillRect(x + w - 4, y, 4, h); return; }
  if (isRoy()) { const k = h * 0.18; g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + w, y); g.lineTo(x + w - k, y + h); g.lineTo(x, y + h); g.closePath(); g.fillStyle = fill; g.fill(); g.lineWidth = 3; g.strokeStyle = o.line || ui.panelLine; g.stroke(); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + k, y + 3, w - k * 1.2, h * 0.35); return; }
  rr(g, x, y, w, h, o.r ?? Math.min(18, h * 0.3)); g.fillStyle = fill; g.fill(); g.lineWidth = 2.5; g.strokeStyle = o.line || ui.panelLine; g.stroke();
}
// big outlined game word (captions, onomatopoeia, titles): white fill, thick dark stroke, hard drop shadow
export function gameText(g, str, x, y, o = {}) {
  const { size = 80, color = '#ffffff', stroke = '#14161c', font = F('cap'), align = 'center', a = 1, sw = 0.2, shadow = 0.07, weight = 400 } = o;
  g.save(); g.globalAlpha *= a; g.font = `${weight} ${size}px "${font}"`; g.textAlign = align; g.textBaseline = 'middle'; g.lineJoin = 'round';
  if (shadow) { g.fillStyle = stroke; g.strokeStyle = stroke; g.lineWidth = size * sw; g.strokeText(str, x, y + size * shadow); g.fillText(str, x, y + size * shadow); }
  g.lineWidth = size * sw; g.strokeStyle = stroke; g.strokeText(str, x, y); g.fillStyle = color; g.fillText(str, x, y); g.restore();
}

// ================= CAPTIONS (always on, the #1 retention device) =================
// 1–2 word chunks, centred low, white with a thick outline; emphasised words are UPPERCASE + coloured.
// Emphasis: config.captionStyle.emph {"lava": "#ff4a3a"} and per shot "emph": {...}. Per shot "capMode": "type" = typewriter + cursor (system messages).
let _chunks = null;
function buildChunks(max) {
  const w = E.words || [], out = []; let cur = [];
  const flush = () => { if (cur.length) out.push(cur); cur = []; };
  for (let i = 0; i < w.length; i++) { const wd = w[i]; cur.push(wd); const next = w[i + 1]; const punct = /[.,!?…:;]$/.test(wd.word.trim()); const gap = next ? next.start - wd.end : 9;
    if (cur.length >= max || punct || gap > 0.35) flush(); }
  flush(); return out;
}
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');
export function gameCaptions(g, globalT, o = {}) {
  if (!E.words?.length) return;
  const max = o.max || 2; if (!_chunks || _chunks.max !== max) { _chunks = buildChunks(max); _chunks.max = max; }
  let ci = -1; for (let k = _chunks.length - 1; k >= 0; k--) { if (globalT >= _chunks[k][0].start - 0.06) { ci = k; break; } } if (ci < 0) return;
  const ch = _chunks[ci], nx = _chunks[ci + 1], endT = nx ? Math.min(nx[0].start - 0.06, ch[ch.length - 1].end + 0.9) : ch[ch.length - 1].end + 0.6; if (globalT > endT) return;
  const shot = E.shots.find(s => globalT >= s.start && globalT < s.end) || {};
  const emph = { ...(o.emph || {}), ...(shot.emph || {}) }, emphN = Object.fromEntries(Object.entries(emph).map(([k, v]) => [norm(k), v]));
  const size = o.size || V(84, 96), y = o.y ?? (shot.capY != null ? shot.capY * E.H : V(E.H * 0.74, E.H * 0.68));
  const parts = ch.map(w => { const raw = w.word.trim(), c = emphN[norm(raw)]; return { s: c ? raw.toUpperCase() : raw, c: c || '#ffffff', w }; });
  const font = F('cap'); g.save(); g.font = `400 ${size}px "${font}"`;
  const gap = size * 0.28, widths = parts.map(p => g.measureText(p.s).width), total = widths.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
  const k = Math.min(1, (E.W * 0.86) / total), sz = size * k; g.restore();
  const t0 = ch[0].start - 0.06, pop = 1 + 0.22 * (1 - clamp(sp(globalT, t0, 3.2, 0.5))) * (globalT - t0 < 0.5 ? 1 : 0);
  const typing = shot.capMode === 'type';
  g.save(); g.translate(E.W / 2, y); g.scale(pop, pop);
  let x = -total * k / 2;
  parts.forEach((p, i) => {
    let s = p.s; if (typing) { const n = Math.floor(clamp((globalT - p.w.start) / Math.max(0.12, p.w.end - p.w.start)) * s.length); s = globalT < p.w.start ? '' : s.slice(0, Math.max(1, n)); }
    gameText(g, s, x, 0, { size: sz, color: p.c, align: 'left', font });
    if (typing && i === parts.length - 1 && Math.floor(globalT * 3) % 2 === 0) { g.font = `400 ${sz}px "${font}"`; const cw = g.measureText(s).width; g.fillStyle = '#ffffff'; g.fillRect(x + cw + sz * 0.08, -sz * 0.36, sz * 0.36, sz * 0.72); }
    x += widths[i] * k + gap * k;
  });
  g.restore();
}

// ================= RULE CARD ("RULE 1 · Jump 5x higher!") — top-left, text types in =================
const NUMW = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
export function ruleCard(g, t, o = {}) {
  const { n = 1, str = 'Jump 5x higher!', start = 0, out = null, typeDur = 0.6, color = ['#3b6fd4', '#3b6fd4', '#d9443a', '#2fb54a', '#8a4ad4', '#f08a2c'][o.n % 6 || 0], label = 'RULE', x = V(40, 40), y = V(40, 150) } = o;
  const k = sp(t, start), a = clamp((t - start) / 0.12) * fadeOut(t, out); if (a <= 0) return;
  const sc = V(1, 1.15), bw = 110 * sc, ph = 92 * sc;
  g.save(); g.globalAlpha *= a; g.translate(x - (1 - k) * 420, y);
  const shown = str.slice(0, Math.ceil(clamp((t - start - 0.15) / typeDur) * str.length));
  g.font = `900 ${pf(44 * sc)}px "${panelFont()}"`; const tw = Math.max(260 * sc, g.measureText(str).width + 60 * sc);
  panel(g, bw * 0.6, ph * 0.12, tw + bw * 0.5, ph * 0.86);
  text(g, `${label} ${NUMW[n] || n}`, bw * 1.05, ph * 0.36, { size: pf(26 * sc), font: panelFont(), weight: 900, color: UI().gold, align: 'left', spacing: 2 });
  text(g, shown, bw * 1.05, ph * 0.7, { size: pf(44 * sc), font: panelFont(), weight: 900, color: '#ffffff', align: 'left' });
  // the numbered block (tilted cube tile)
  g.save(); g.translate(bw / 2, ph / 2); g.rotate(-0.08 + 0.08 * clamp(k)); const s2 = bw * 0.92;
  if (isVox()) { g.fillStyle = shade(color, -0.3); g.fillRect(-s2 / 2 + 8, -s2 / 2 + 8, s2, s2); g.fillStyle = color; g.fillRect(-s2 / 2, -s2 / 2, s2, s2); }
  else { rr(g, -s2 / 2 + 6, -s2 / 2 + 8, s2, s2, 16); g.fillStyle = shade(color, -0.3); g.fill(); rr(g, -s2 / 2, -s2 / 2, s2, s2, 16); g.fillStyle = color; g.fill(); g.lineWidth = 4; g.strokeStyle = shade(color, -0.45); g.stroke(); rr(g, -s2 / 2 + 8, -s2 / 2 + 6, s2 - 16, s2 * 0.25, 8); g.fillStyle = 'rgba(255,255,255,.25)'; g.fill(); }
  text(g, label, 0, -s2 * 0.28, { size: pf(22 * sc), font: panelFont(), weight: 900, color: '#ffffff' });
  gameText(g, String(n), 0, s2 * 0.12, { size: s2 * 0.62, font: F('big'), sw: 0.14, shadow: 0.05 });
  g.restore(); g.restore();
}

// ================= COUNTDOWN RING ("60") =================
export function countdown(g, t, o = {}) {
  const { x = E.W / 2, y = V(170, 300), r = V(120, 140), value = 60, start = 0, out = null, color = '#ff3b3b', tickRate = 0, label = null } = o;
  const k = sp(t, start), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  const v = tickRate ? Math.max(0, Math.ceil(value - (t - start) * tickRate)) : value, beat = tickRate ? 1 - ((t - start) * tickRate % 1) : 0;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(0.4 + 0.6 * k + beat * 0.05, 0.4 + 0.6 * k + beat * 0.05);
  glow(g, 0, 0, r * 1.7, color, 0.35 + 0.2 * Math.sin(t * 8));
  circle(g, 0, 0, r, alpha(shade(color, -0.75), 0.85)); g.lineWidth = r * 0.05; g.strokeStyle = color; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
  for (let i = 0; i < 60; i++) { const an = i / 60 * Math.PI * 2, L = i % 5 ? 0.08 : 0.15; seg(g, [[Math.cos(an) * r * 0.86, Math.sin(an) * r * 0.86], [Math.cos(an) * r * (0.86 - L), Math.sin(an) * r * (0.86 - L)]], i % 5 ? 2 : 4, alpha('#ffd0d0', 0.85)); }
  if (tickRate) { g.lineWidth = r * 0.07; g.strokeStyle = '#ffffff'; g.beginPath(); g.arc(0, 0, r * 0.98, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (v / value)); g.stroke(); }
  gameText(g, String(v), 0, r * 0.04, { size: r * 0.95, color, stroke: shade(color, -0.7), font: F('big'), sw: 0.12, shadow: 0 });
  if (label) text(g, label, 0, r * 1.3, { size: r * 0.22, font: panelFont(), weight: 900, color: '#ffffff' });
  g.restore();
}
// ================= STARBURST (behind numbers, prices, "DAY 7") =================
export function starburst(g, x, y, r, col = '#d9443a', t = 0, o = {}) { const n = o.points || 14; g.save(); g.translate(x, y); g.rotate(t * (o.spin ?? 0.4)); g.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, rr2 = i % 2 ? r * 0.7 : r; g.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } g.closePath(); g.fillStyle = col; g.fill(); g.lineWidth = r * 0.04; g.strokeStyle = shade(col, -0.45); g.stroke(); g.restore(); }
// ================= DAY CARD (tear-off calendar page) =================
export function dayCard(g, t, o = {}) {
  const { day = 1, x = E.W / 2, y = E.H / 2 - V(40, 120), s = V(1, 1.2), start = 0, out = null, color = '#ff5a2a', burst = false, icon = null, label = 'DAY', tilt = 0.06 } = o;
  const k = sp(t, start, 2.4, 0.4), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  if (burst) starburst(g, 0, 20, 300 * clamp(k, 0, 1.2), '#d9443a', t, { points: 12 });
  g.rotate(tilt * (1 - k) * 4 + tilt); g.scale(0.3 + 0.7 * k, 0.3 + 0.7 * k);
  const w = 300, h = 330;
  if (isVox()) { g.fillStyle = '#1a1a1a'; g.fillRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12); g.fillStyle = '#f4f4f4'; g.fillRect(-w / 2, -h / 2, w, h); g.fillStyle = color; g.fillRect(-w / 2, -h / 2, w, 90); }
  else { rr(g, -w / 2 + 10, -h / 2 + 14, w, h, 26); g.fillStyle = 'rgba(0,0,0,.25)'; g.fill(); rr(g, -w / 2, -h / 2, w, h, 26); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#2a2f3a'; g.stroke(); g.save(); rr(g, -w / 2, -h / 2, w, h, 26); g.clip(); g.fillStyle = color; g.fillRect(-w / 2, -h / 2, w, 92); g.restore(); for (const rx of [-80, 80]) { rr(g, rx - 10, -h / 2 - 22, 20, 44, 10); g.fillStyle = '#5a6070'; g.fill(); } }
  text(g, label, 0, -h / 2 + 50, { size: pf(46), font: panelFont(), weight: 900, color: '#ffffff', spacing: 3 });
  gameText(g, String(day), -16, 40, { size: 190, color: '#2a2f3a', stroke: '#2a2f3a', sw: 0, shadow: 0, font: F('big') });
  if (icon === 'drop') { g.beginPath(); g.moveTo(90, 40); g.quadraticCurveTo(122, 90, 90, 104); g.quadraticCurveTo(58, 90, 90, 40); g.fillStyle = '#ff3b3b'; g.fill(); }
  else if (icon === 'bars') for (let i = 0; i < 4; i++) { g.fillStyle = i < 2 ? '#ff3b3b' : '#cfd3da'; g.fillRect(70 + i * 16, 100 - i * 14, 11, 10 + i * 14); }
  else if (icon === 'skull' || icon === 'clock' || typeof icon === 'string') { circle(g, 96, 76, 32, '#2a2f3a'); text(g, icon === 'skull' ? '☠' : icon === 'clock' ? '60' : icon, 96, 78, { size: 30, font: FONTS.ui, weight: 900, color: '#ff4a3a' }); }
  g.restore();
}
// ================= GAME TILE ("Discover" card with PLAY button) =================
// thumb(g, x, y, w, h) draws the thumbnail (e.g. a mini cityRow). players: "7,900,000,000 playing"
export function gameTile(g, t, o = {}) {
  const { title = 'The WHOLE WORLD', players = '7,900,000,000 playing', x = E.W / 2, y = E.H / 2, w = V(1180, 940), h = V(640, 620), start = 0, out = null, thumb = null, press = null, hi = 'WHOLE WORLD' } = o;
  const k = sp(t, start, 2.2, 0.5), a = clamp((t - start) / 0.15) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); const sc = 0.85 + 0.15 * k; g.scale(sc, sc);
  g.fillStyle = 'rgba(10,14,24,.75)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  text(g, '≡  Discover', -w / 2 - 10, -h / 2 - 50, { size: 30, font: FONTS.ui, weight: 900, color: '#ffffff', align: 'left' });
  rr(g, -w * 0.12, -h / 2 - 72, w * 0.4, 44, 22); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill(); text(g, '🔍 Search', -w * 0.1 + 12, -h / 2 - 50, { size: 22, font: FONTS.ui, weight: 800, color: 'rgba(255,255,255,.6)', align: 'left' });
  rr(g, -w / 2, -h / 2, w, h, 26); g.fillStyle = '#1b2233'; g.fill(); g.lineWidth = 6; g.strokeStyle = UI().cyan || '#3fe0ff'; g.stroke();
  g.save(); rr(g, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 18); g.clip(); if (thumb) { g.save(); g.translate(-w / 2 + 14, -h / 2 + 14); thumb(g, 0, 0, w - 28, h - 28); g.restore(); } g.restore();
  g.fillStyle = linGrad(g, 0, -h / 2, 0, -h / 2 + 150, ['rgba(10,14,24,.8)', 'rgba(10,14,24,0)']); rr(g, -w / 2 + 14, -h / 2 + 14, w - 28, 150, 18); g.fill();
  const [pre, post] = title.includes(hi) ? title.split(hi) : [title, ''];
  g.font = `400 54px "${F('cap')}"`; const w1 = g.measureText(pre).width, w2 = g.measureText(hi).width;
  gameText(g, pre, -w / 2 + 40, -h / 2 + 64, { size: 54, align: 'left', shadow: 0.04 }); if (title.includes(hi)) gameText(g, hi, -w / 2 + 40 + w1, -h / 2 + 64, { size: 54, align: 'left', color: UI().gold, shadow: 0.04 }); if (post) gameText(g, post, -w / 2 + 40 + w1 + w2, -h / 2 + 64, { size: 54, align: 'left', shadow: 0.04 });
  circle(g, -w / 2 + 52, -h / 2 + 112, 9, '#3ee05a'); text(g, players, -w / 2 + 70, -h / 2 + 112, { size: 26, font: FONTS.ui, weight: 900, color: '#ffd23f', align: 'left' });
  const pk = press != null ? 1 - 0.12 * Math.exp(-Math.max(0, t - press) * 10) * (t > press ? 1 : 0) : 1;
  g.save(); g.translate(w / 2 - 150, -h / 2 + 80); g.scale(pk, pk); rr(g, -110, -40, 220, 80, 16); g.fillStyle = '#2fb54a'; g.fill(); g.lineWidth = 4; g.strokeStyle = '#ffffff'; g.stroke(); gameText(g, '▶PLAY', 0, 2, { size: 46, shadow: 0, sw: 0.1 }); g.restore();
  g.restore();
}
// ================= ALERT BANNER ("Server shutting down in 60 seconds") — top, hazard stripes =================
export function alertBanner(g, t, o = {}) {
  const { str = 'Server shutting down in 60 seconds', start = 0, out = null, y = V(46, 140), color = '#ff3b3b' } = o;
  const k = sp(t, start, 2.6, 0.55), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.font = `900 ${pf(34)}px "${panelFont()}"`; const w = g.measureText(str).width + 170, h = 64, x = E.W / 2 - w / 2, yy = y - (1 - k) * 120;
  panel(g, x, yy, w, h, { fill: 'rgba(20,10,14,.92)', line: color });
  g.save(); g.beginPath(); g.rect(x, yy, 54, h); g.rect(x + w - 54, yy, 54, h); g.clip(); for (let i = -4; i < 30; i++) { g.fillStyle = i % 2 ? '#ffd23f' : '#1a1a1a'; poly(g, [[x + i * 18 + (t * 40) % 36, yy], [x + i * 18 + 18 + (t * 40) % 36, yy], [x + i * 18 - 18 + (t * 40) % 36, yy + h], [x + i * 18 - 36 + (t * 40) % 36, yy + h]], i % 2 ? '#ffd23f' : '#1a1a1a'); } g.restore();
  circle(g, x + 88, yy + h / 2, 17, color); text(g, '!', x + 88, yy + h / 2 + 1, { size: 28, font: FONTS.ui, weight: 900, color: '#fff' });
  text(g, str, x + 116, yy + h / 2 + 2, { size: pf(34), font: panelFont(), weight: 900, color: '#ffffff', align: 'left' });
  g.restore();
}
// ================= GAUGE (vertical power meter: 1x … 5x) =================
export function gauge(g, t, o = {}) {
  const { x = E.W - V(110, 110), y = V(120, 320), h = V(420, 520), value = 1, max = 5, label = 'JUMP', start = 0, out = null, fillDur = 0.8 } = o;
  const k = sp(t, start), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  const v = lerp(0, value / max, ease.out(clamp((t - start - 0.15) / fillDur))), done = v >= value / max - 0.001;
  g.save(); g.globalAlpha *= a; g.translate(x + (1 - k) * 200, y);
  panel(g, -50, -10, 100, h + 20, { r: 26 }); text(g, done ? `${value}x!` : label, 0, 22, { size: done ? 30 : 22, font: panelFont(), weight: 900, color: done ? '#1a1a1a' : '#ffffff' });
  if (done) { rr(g, -44, 4, 88, 40, 10); g.fillStyle = UI().gold; g.fill(); text(g, `${value}x!`, 0, 25, { size: pf(30), font: panelFont(), weight: 900, color: '#1a1a1a' }); }
  const ty = 60, th = h - 80; rr(g, -14, ty, 28, th, 14); g.fillStyle = 'rgba(255,255,255,.12)'; g.fill();
  rr(g, -14, ty + th * (1 - v), 28, th * v, 14); g.fillStyle = linGrad(g, 0, ty + th, 0, ty, ['#3fb0ff', '#7ae0ff', UI().gold]); g.fill();
  for (let i = 1; i <= max; i++) { const yy = ty + th * (1 - i / max); seg(g, [[18, yy], [28, yy]], 3, '#ffffff'); text(g, `${i}x`, 50, yy, { size: pf(20), font: panelFont(), weight: 900, color: '#ffffff', align: 'left' }); }
  g.restore();
}
// ================= small chat bubbles over a crowd ("HELP!", "mom??") =================
export function chatBubble(g, t, str, x, y, o = {}) {
  const { start = 0, out = null, size = V(24, 30), color = '#ffffff', ink = '#1a1f2a' } = o; const k = sp(t, start, 3, 0.5), a = clamp((t - start) / 0.08) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(k, k); g.font = `900 ${size}px "${FONTS.ui}"`; const w = g.measureText(str).width + size * 1.2, h = size * 1.6;
  rr(g, -w / 2, -h, w, h, h * 0.35); g.fillStyle = color; g.fill(); g.lineWidth = 3; g.strokeStyle = ink; g.stroke(); poly(g, [[-8, -2], [8, -2], [-4, 12]], color); text(g, str, 0, -h / 2, { size, font: FONTS.ui, weight: 900, color: ink }); g.restore();
}
// ================= "You died / Respawning in 3" =================
export function diedPanel(g, t, o = {}) {
  const { start = 0, out = null, from = 3, rate = 1, title = 'You died', sub = 'Respawning in', x = E.W / 2, y = V(280, 520) } = o;
  const k = sp(t, start, 2.4, 0.5), a = clamp((t - start) / 0.12) * fadeOut(t, out); if (a <= 0) return;
  const n = Math.max(1, Math.ceil(from - (t - start) * rate)), frac = ((t - start) * rate) % 1;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k); const w = 540, h = 180;
  panel(g, -w / 2, -h / 2, w, h, { fill: 'rgba(24,28,40,.95)' }); g.fillStyle = '#ff3b3b'; g.fillRect(-w / 2 + 20, -h / 2, w - 40, 6);
  text(g, title, 0, -h * 0.16, { size: pf(62), font: panelFont(), weight: 900, color: '#ffffff' });
  text(g, sub, -30, h * 0.24, { size: pf(34), font: panelFont(), weight: 900, color: 'rgba(255,255,255,.7)' });
  const cx = 150; g.lineWidth = 5; g.strokeStyle = UI().gold; g.beginPath(); g.arc(cx, h * 0.24, 24, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - frac)); g.stroke(); text(g, String(n), cx, h * 0.24 + 1, { size: 30, font: FONTS.ui, weight: 900, color: UI().gold });
  g.restore();
}
// ================= leaderboard / player list =================
export function leaderboard(g, t, o = {}) {
  const { rows = [['Player_1', 1], ['PinkPony22', 7], ['OofLord', 12]], head = ['Players', 'Stage'], x = E.W - V(360, 380), y = V(30, 140), start = 0, out = null, hi = 0 } = o;
  const k = sp(t, start), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x + (1 - k) * 300, y); const w = 330, rh = 40;
  panel(g, 0, 0, w, rh * (rows.length + 1) + 16); text(g, head[0], 18, 26, { size: pf(20), font: panelFont(), weight: 900, color: 'rgba(255,255,255,.7)', align: 'left' }); text(g, head[1], w - 18, 26, { size: pf(20), font: panelFont(), weight: 900, color: 'rgba(255,255,255,.7)', align: 'right' });
  rows.forEach(([n, v], i) => { const yy = 26 + (i + 1) * rh; if (i === hi) { g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(8, yy - rh / 2, w - 16, rh); } text(g, n, 18, yy, { size: pf(22), font: panelFont(), weight: 900, color: '#ffffff', align: 'left' }); text(g, String(v), w - 18, yy, { size: pf(22), font: panelFont(), weight: 900, color: UI().gold, align: 'right' }); });
  g.restore();
}
// ================= comic onomatopoeia ("SQUAWK!", "BONK!", "AAAAH!") =================
export function onoma(g, t, str, x, y, o = {}) {
  const { start = 0, out = null, size = V(70, 84), color = '#9ae6ff', rot = -0.12, shake = 1 } = o; const k = sp(t, start, 3, 0.4), a = clamp((t - start) / 0.06) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x + Math.sin(t * 40) * 3 * shake * Math.exp(-(t - start) * 3), y); g.rotate(rot); g.scale(k, k);
  const font = isRoy() ? FONTS.comic : F('big'); [...str].forEach((c, i, arr) => { g.font = `400 ${size}px "${font}"`; const w = g.measureText(str).width, cw = g.measureText(str.slice(0, i)).width; gameText(g, c, -w / 2 + cw, Math.sin(i * 1.3 + t * 8) * size * 0.05, { size, color, font, align: 'left', sw: 0.18 }); });
  g.restore();
}
// ================= BIG WORD: each letter a different colour, bouncing in ("OBBY!", "LAVA!") =================
export function bigWord(g, t, str, x, y, o = {}) {
  const { start = 0, out = null, size = V(150, 160), colors = ['#ff4a3a', '#ffd23f', '#3fb34a', '#3b8aff', '#b46aff', '#ff8a2a'], stagger = 0.06, rot = -0.04 } = o;
  const a = fadeOut(t, out); if (a <= 0 || t < start) return; const font = F('big');
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.font = `400 ${size}px "${font}"`; const W0 = g.measureText(str).width; let cx = -W0 / 2;
  [...str].forEach((c, i) => { const w = g.measureText(c).width, k = sp(t, start + i * stagger, 2.8, 0.42); if (k > 0) { g.save(); g.translate(cx + w / 2, (1 - k) * -size); g.scale(clamp(k, 0, 1.3), clamp(k, 0, 1.3)); g.rotate((i % 2 ? 0.08 : -0.08)); gameText(g, c, 0, 0, { size, color: colors[i % colors.length], font, sw: 0.16, shadow: 0.08 }); g.restore(); } cx += w; });
  g.restore();
}
// ================= TITLE SLAM (white + gold chunky title, e.g. "WHOLE WORLD") =================
export function titleSlam(g, t, lines, o = {}) {
  const { start = 0, out = null, y = E.H * 0.5, size = V(120, 120), color = '#ffffff', hi = UI().gold, hiLine = lines.length - 1 } = o; const a = fadeOut(t, out); if (a <= 0) return;
  lines.forEach((ln, i) => { const k = sp(t, start + i * 0.12, 2.6, 0.45); if (k <= 0) return; g.save(); g.globalAlpha *= a * clamp((t - start - i * 0.12) / 0.06); g.translate(E.W / 2, y + (i - (lines.length - 1) / 2) * size * 1.0); const s = lerp(2.2, 1, clamp(k, 0, 1.2)); g.scale(s, s); gameText(g, ln, 0, 0, { size, color: i === hiLine ? hi : color, font: F('big'), sw: 0.16, shadow: 0.08 }); g.restore(); });
}
// ================= pop-up dialog ("It all started with a pop-up") with optional cursor click =================
export function popupDialog(g, t, o = {}) {
  const { title = 'Turn the world into a game?', body = 'This cannot be undone.', buttons = ['YES', 'NO'], start = 0, out = null, click = null, hi = 0, x = E.W / 2, y = E.H / 2 } = o;
  const k = sp(t, start, 2.4, 0.5), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(0.5 + 0.5 * k, 0.5 + 0.5 * k); const w = V(760, 860), h = 360;
  panel(g, -w / 2, -h / 2, w, h, { fill: 'rgba(28,34,50,.97)' }); g.fillStyle = UI().cyan || '#3fe0ff'; g.fillRect(-w / 2 + 16, -h / 2 + 12, w - 32, 6);
  gameText(g, title, 0, -h / 2 + 90, { size: pf(V(46, 50)), font: isVox() ? FONTS.pixel : F('cap'), sw: 0.12, shadow: 0.04 });
  text(g, body, 0, -h / 2 + 160, { size: pf(30), font: panelFont(), weight: 800, color: 'rgba(255,255,255,.7)' });
  buttons.forEach((b, i) => { const bx = (i - (buttons.length - 1) / 2) * 280, by = h / 2 - 80, pressed = click != null && t > click && t < click + 0.25 && i === hi; g.save(); g.translate(bx, by); const s = pressed ? 0.9 : 1; g.scale(s, s); panel(g, -115, -38, 230, 76, { fill: i === hi ? '#2fb54a' : '#5a6070', line: '#ffffff' }); gameText(g, b, 0, 2, { size: pf(40), font: isVox() ? FONTS.pixel : F('cap'), sw: 0.1, shadow: 0 }); g.restore(); });
  if (click != null) { const cx = lerp(w * 0.5, (hi - (buttons.length - 1) / 2) * 280 + 30, ease.inOut(clamp((t - click + 0.7) / 0.6))), cy = lerp(h * 0.6, h / 2 - 60, ease.inOut(clamp((t - click + 0.7) / 0.6))); cursor(g, cx, cy, t > click && t < click + 0.2); }
  g.restore();
}
export function cursor(g, x, y, down = false) { g.save(); g.translate(x, y); if (down) g.scale(0.85, 0.85); poly(g, [[0, 0], [0, 44], [12, 33], [21, 52], [30, 48], [21, 30], [36, 30]], '#ffffff'); g.lineWidth = 3; g.strokeStyle = '#1a1a1a'; g.beginPath(); [[0, 0], [0, 44], [12, 33], [21, 52], [30, 48], [21, 30], [36, 30]].forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); g.stroke(); g.restore(); }
// ================= floating "+100" / "-1 ❤" numbers =================
export function floatText(g, t, str, x, y, o = {}) { const { start = 0, dur = 1.2, color = UI().gold, size = V(56, 64) } = o; const u = (t - start) / dur; if (u < 0 || u > 1) return; gameText(g, str, x, y - ease.out(u) * 120, { size: size * (1 + 0.3 * (1 - clamp(u * 6))), color, a: 1 - clamp((u - 0.7) / 0.3) }); }
// ================= red circle + arrow (YouTube highlight) =================
export function highlight(g, t, x, y, r, o = {}) { const { start = 0, out = null, color = '#ff3b3b', arrow = true } = o; const p = ease.out(clamp((t - start) / 0.4)), a = fadeOut(t, out); if (p <= 0 || a <= 0) return; g.save(); g.globalAlpha *= a; g.lineWidth = 10; g.lineCap = 'round'; g.strokeStyle = color; g.beginPath(); g.ellipse(x, y, r * 1.2, r, -0.1, -0.5, -0.5 + Math.PI * 2 * p * 1.05); g.stroke(); if (arrow && p > 0.6) { const ax = x + r * 2.2, ay = y + r * 1.4, k = clamp((p - 0.6) / 0.4); seg(g, [[ax + 80 * (1 - k), ay + 60 * (1 - k)], [x + r * 1.3, y + r * 0.8]], 12, color); poly(g, [[x + r * 1.15, y + r * 0.7], [x + r * 1.55, y + r * 0.75], [x + r * 1.3, y + r * 1.05]], color); } g.restore(); }

// ================= VHS overlay ("◀◀ REW" timecode, scanlines) — use with the `rewind` transition and flashbacks =================
export function vhs(g, t, o = {}) {
  const { mode = 'rew', time = '6:41:04', a = 1, noise = mode === 'rew' ? 1 : 0.35 } = o; if (a <= 0) return;
  g.save(); g.globalAlpha *= a;
  for (let y = 0; y < E.H; y += 6) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, y, E.W, 2); }
  if (noise > 0) for (let i = 0; i < 6 * noise; i++) { const yy = ((t * 900 + i * 337) % (E.H + 200)) - 100, h = 8 + (i * 13) % 40; g.fillStyle = `rgba(255,255,255,${0.08 + 0.1 * noise})`; g.fillRect(0, yy, E.W, h); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, yy + h, E.W, 4); }
  const lab = mode === 'rew' ? 'REW' : mode === 'ff' ? 'FF' : mode === 'pause' ? 'PAUSE' : 'PLAY', sz = V(40, 46), x0 = V(70, 60), y0 = V(70, 160);
  g.fillStyle = '#ffffff'; const triR = (x, dir) => poly(g, [[x, y0 - sz * 0.42], [x, y0 + sz * 0.42], [x + dir * sz * 0.62, y0]], '#ffffff');
  if (mode === 'rew') { triR(x0 + sz * 0.62, -1); triR(x0 + sz * 1.24, -1); } else if (mode === 'ff') { triR(x0, 1); triR(x0 + sz * 0.62, 1); } else if (mode === 'pause') { g.fillRect(x0, y0 - sz * 0.42, sz * 0.25, sz * 0.84); g.fillRect(x0 + sz * 0.45, y0 - sz * 0.42, sz * 0.25, sz * 0.84); } else triR(x0, 1);
  text(g, lab, x0 + sz * (mode === 'rew' || mode === 'ff' ? 1.6 : 1.0), y0 + 2, { size: sz, font: FONTS.pixel, weight: 400, color: '#ffffff', align: 'left', glow: 10, glowColor: 'rgba(255,255,255,.6)' });
  text(g, time, E.W - V(70, 60), V(70, 160), { size: V(32, 36), font: FONTS.pixel, weight: 400, color: '#ffffff', align: 'right' });
  text(g, 'SP', E.W - V(80, 70), E.H - V(70, 260), { size: V(30, 34), font: FONTS.pixel, weight: 400, color: '#ffffff', align: 'right' });
  g.restore();
}

// ================= WORLD HUDs =================
// voxel: item hotbar + hearts
export function hotbar(g, t, o = {}) {
  const { items = ['pickaxe', 'sword', 'cube', 'apple', 'torch', '', '', '', ''], sel = 0, y = E.H - V(70, 300), hp = 10, max = 10, hunger = null } = o;
  const n = items.length, cell = V(78, 92), x0 = E.W / 2 - n * cell / 2;
  for (let i = 0; i < n; i++) { const x = x0 + i * cell; g.fillStyle = 'rgba(30,30,30,.75)'; g.fillRect(x, y - cell / 2, cell, cell); g.strokeStyle = '#8b8b8b'; g.lineWidth = 4; g.strokeRect(x + 2, y - cell / 2 + 2, cell - 4, cell - 4); if (i === sel) { g.strokeStyle = '#ffffff'; g.lineWidth = 7; g.strokeRect(x - 2, y - cell / 2 - 2, cell + 4, cell + 4); } itemIcon(g, items[i], x + cell / 2, y, cell * 0.6); }
  for (let i = 0; i < max; i++) heartPix(g, x0 + 18 + i * cell * 0.42, y - cell / 2 - 34, cell * 0.17, i < hp ? (i + 0.5 < hp ? 1 : 0.5) : 0);
}
function heartPix(g, x, y, s, fill) { const P = [[1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [2, 4], [3, 4], [4, 4], [3, 5]]; const u = s / 3; for (const [i, j] of P) { g.fillStyle = '#1a1a1a'; g.fillRect(x + i * u - u * 0.3, y + j * u - u * 0.3, u * 1.6, u * 1.6); } for (const [i, j] of P) { g.fillStyle = (fill >= 1 || (fill > 0 && i < 3.5)) ? '#ff2a2a' : '#4a1a1a'; g.fillRect(x + i * u, y + j * u, u, u); } }
export function itemIcon(g, kind, x, y, s) {
  const P = (c, ...rects) => { g.fillStyle = c; for (const [a, b, w, h] of rects) g.fillRect(x + a * s / 8, y + b * s / 8, w * s / 8, h * s / 8); };
  if (kind === 'pickaxe') { P('#8a5a32', [-1, -1, 2, 2], [0, 0, 2, 2], [1, 1, 2, 2], [2, 2, 2, 2]); P('#5ae8ff', [-4, -4, 6, 2], [-4, -2, 2, 4]); }
  else if (kind === 'sword') { P('#5ae8ff', [-3, -4, 2, 2], [-2, -3, 2, 2], [-1, -2, 2, 2], [0, -1, 2, 2]); P('#8a5a32', [1, 1, 2, 2], [2, 2, 2, 2]); P('#3a3a3a', [-0.5, 1.5, 3, 1]); }
  else if (kind === 'cube') { P('#7ccc3e', [-3, -3, 6, 2]); P('#8a5a36', [-3, -1, 6, 4]); }
  else if (kind === 'apple') { P('#e02a2a', [-3, -2, 6, 5], [-2, -3, 4, 1]); P('#3a8a2a', [0, -4, 2, 1]); }
  else if (kind === 'torch') { P('#8a5a32', [-1, -1, 2, 5]); P('#ffd06a', [-1, -3, 2, 2]); }
  else if (kind === 'potion') { P('#c8c8c8', [-1, -4, 2, 2]); P('#ff4aa8', [-3, -2, 6, 5]); }
}
// royale: health + shield bars bottom-left, storm timer + players alive top-right, kill feed
export function hpShield(g, t, o = {}) {
  const { hp = 100, shield = 50, x = V(60, 60), y = E.H - V(110, 330), w = V(420, 420) } = o;
  g.save(); g.translate(x, y); const bar = (yy, v, col, lab) => { g.save(); g.transform(1, 0, -0.25, 1, 0, 0); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(40, yy, w, 30); g.fillStyle = col; g.fillRect(40, yy, w * clamp(v / 100), 30); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(40, yy, w * clamp(v / 100), 8); g.restore(); text(g, String(Math.round(v)), w + 70, yy + 16, { size: 30, font: FONTS.comic, weight: 400, color: '#ffffff', align: 'left', stroke: 6, strokeColor: '#1a1630' }); };
  bar(0, shield, '#3aa8ff', 'S'); bar(40, hp, '#4ae04a', 'H'); g.restore();
}
export function stormTimer(g, t, o = {}) {
  const { time = '1:30', alive = 37, x = E.W - V(60, 60), y = V(60, 160) } = o;
  panel(g, x - 330, y - 34, 330, 68); text(g, '⛈ ' + time, x - 300, y + 2, { size: 34, font: FONTS.comic, color: '#d6a8ff', align: 'left' }); text(g, `👤 ${alive}`, x - 26, y + 2, { size: 34, font: FONTS.comic, color: '#ffffff', align: 'right' });
}
export function killFeed(g, t, rows = [], o = {}) { const { x = E.W - V(60, 60), y = V(140, 260), start = 0 } = o; rows.forEach((r, i) => { const a = clamp((t - start - i * 0.4) / 0.15); if (a <= 0) return; g.save(); g.globalAlpha *= a; text(g, r, x, y + i * 40, { size: 26, font: FONTS.ui, weight: 900, color: '#ffffff', align: 'right', stroke: 5, strokeColor: 'rgba(0,0,0,.7)' }); g.restore(); }); }
export function winBanner(g, t, o = {}) {
  const { str = '#1 WINNER', sub = 'LAST ONE STANDING', start = 0, out = null } = o; const k = sp(t, start, 2.2, 0.45), a = clamp((t - start) / 0.1) * fadeOut(t, out); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(E.W / 2, E.H * 0.4); g.scale(lerp(2.5, 1, clamp(k, 0, 1.2)), lerp(2.5, 1, clamp(k, 0, 1.2)));
  for (let i = 0; i < 16; i++) { g.save(); g.rotate(i * Math.PI / 8 + t * 0.3); g.fillStyle = 'rgba(255,220,80,.18)'; poly(g, [[0, 0], [-40, -700], [40, -700]], 'rgba(255,220,80,.16)'); g.restore(); }
  gameText(g, str, 0, 0, { size: V(150, 130), color: '#ffcc2a', font: isRoy() ? FONTS.comic : F('big'), sw: 0.14, shadow: 0.08 }); text(g, sub, 0, V(110, 100), { size: V(44, 44), font: isRoy() ? FONTS.comic : FONTS.ui, weight: 900, color: '#ffffff', stroke: 8, strokeColor: '#1a1630' });
  g.restore();
}
// end screen: question + subscribe pill + comment bubble (draw the cast yourself behind it)
export function gameEnd(g, t, o = {}) {
  const { question = 'What would YOU do?', start = 0 } = o; const k1 = sp(t, start + 0.1), k2 = sp(t, start + 0.5);
  if (k1 > 0) { g.save(); g.translate(E.W / 2, V(170, 360)); g.scale(clamp(k1, 0, 1.2), clamp(k1, 0, 1.2)); gameText(g, question, 0, 0, { size: V(92, 84), font: F('big'), color: '#ffffff' }); g.restore(); }
  if (k2 > 0) { g.save(); g.translate(E.W / 2, V(310, 560)); g.scale(clamp(k2, 0, 1.2), clamp(k2, 0, 1.2)); rr(g, -190, -46, 380, 92, 46); g.fillStyle = '#e0302a'; g.fill(); g.lineWidth = 5; g.strokeStyle = '#fff'; g.stroke(); gameText(g, 'SUBSCRIBE', 0, 3, { size: 52, sw: 0.1, shadow: 0 }); g.restore(); }
}
