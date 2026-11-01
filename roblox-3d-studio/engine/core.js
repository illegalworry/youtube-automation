// engine/core.js — shared runtime: timing, easing, deterministic noise, words, colours, 2D overlay text.
// 2D overlays use LOGICAL units (16:9 = 1920x1080, 9:16 = 1080x1920); the 3D world uses studs (avatar = 5 studs tall).
import { LOOKS } from './looks.js';

export const E = { W: 1920, H: 1080, PX: 1, fps: 24, vertical: false, style: null, styleId: 'bright', cfg: {}, words: [], shots: [], story: {} };
export const V = (h, v) => (E.vertical ? v : h);           // pick a value by aspect: V(landscape, vertical)

// ---------- math / timing ----------
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, k) => a + (b - a) * k;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const ease = {
  linear: x => clamp(x),
  in: x => (x = clamp(x)) ** 3,
  out: x => 1 - (1 - clamp(x)) ** 3,
  inOut: x => ((x = clamp(x)) < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  sine: x => -(Math.cos(Math.PI * clamp(x)) - 1) / 2,
  outBack: x => { x = clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; },
  outElastic: x => { x = clamp(x); return x === 0 || x === 1 ? x : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1; },
};
// keyframes: key(t, [[0, 1], [2, 1.2], [4, 1]], ease.inOut) -> number | array | object of numbers
export function key(t, frames, fn = ease.inOut) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i];
    if (t <= t1) { const [t0, v0] = frames[i - 1]; return mixVal(v0, v1, (frames[i][2] || fn)((t - t0) / (t1 - t0))); }
  }
  return frames[frames.length - 1][1];
}
export function mixVal(a, b, k) {
  if (typeof a === 'number') return lerp(a, b, k);
  if (Array.isArray(a)) return a.map((v, i) => mixVal(v, b[i], k));
  const o = {}; for (const kk in a) o[kk] = typeof a[kk] === 'number' || Array.isArray(a[kk]) ? mixVal(a[kk], b[kk] ?? a[kk], k) : (k < 0.5 ? a[kk] : b[kk] ?? a[kk]); return o;
}
export function rng(seed = 1) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export function noise(x, seed = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + seed * 57), hash(i + 1 + seed * 57), u) * 2 - 1; }
export const shake = (t, amp = 4, freq = 1.3, seed = 3) => [noise(t * freq, seed) * amp, noise(t * freq, seed + 9) * amp];
// talking mouth amount (0..1) driven by the real word timings when available
export function talkAmount(globalT, from = -1, to = 1e9) {
  if (globalT < from || globalT > to) return 0;
  const w = E.words.find(w => globalT >= w.start && globalT <= w.end);
  if (!w && E.words.length) return 0;
  return clamp(0.25 + 0.75 * Math.abs(Math.sin(globalT * 17)) * (0.6 + 0.4 * Math.sin(globalT * 5.3)));
}

// time (global seconds) when a word is spoken: wordTime('brain', 40) -> 43.78 (null if not found)
export function wordTime(match, after = 0) {
  const norm = x => x.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}']/gu, '');   // Unicode: works for Russian too
  const m = norm(match);
  const w = E.words.find(w => w.start >= after - 0.05 && norm(w.word).startsWith(m));
  return w ? w.start : null;
}

// ---------- colour ----------
export function rgb(c) {
  if (Array.isArray(c)) return c;
  if (c.startsWith('rgb')) { const m = c.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2], m[3] ?? 1]; }
  let h = c.slice(1); if (h.length === 3) h = [...h].map(x => x + x).join('');
  const n = parseInt(h.slice(0, 6), 16); return [n >> 16, (n >> 8) & 255, n & 255, h.length > 6 ? parseInt(h.slice(6), 16) / 255 : 1];
}
export const css = ([r, g, b, a = 1]) => `rgba(${r | 0},${g | 0},${b | 0},${+a.toFixed(3)})`;
export const mix = (c1, c2, k) => { const a = rgb(c1), b = rgb(c2); return css(a.map((v, i) => lerp(v, b[i] ?? 1, k))); };
export const alpha = (c, a) => { const x = rgb(c); return css([x[0], x[1], x[2], a]); };
export const shade = (c, k) => (k < 0 ? mix(c, '#000000', -k) : mix(c, '#ffffff', k));

// ---------- look (colour grade) ----------
export function setStyle(id) { E.styleId = LOOKS[id] ? id : 'bright'; E.style = LOOKS[E.styleId]; }
export const S = () => E.style;

// ---------- small 2D primitives for overlays ----------
export function rr(g, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
export function circle(g, x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, Math.PI * 2); g.fill(); }
export function linGrad(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => Array.isArray(c) ? gr.addColorStop(c[0], c[1]) : gr.addColorStop(i / Math.max(1, stops.length - 1), c)); return gr; }

// ---------- text ----------
export const FONTS = { title: 'Fredoka', ui: 'Nunito' };
export function text(g, str, x, y, o = {}) {
  const { size = 48, font = FONTS.title, weight = 700, color = '#fff', align = 'center', base = 'middle', glow: gl = 0, glowColor = 'rgba(255,140,60,.8)', spacing = 0, alpha: a = 1, stroke = 0, strokeColor = '#000', italic = false } = o;
  g.save(); g.globalAlpha *= a; g.font = `${italic ? 'italic ' : ''}${weight} ${size}px "${font}"`; g.textAlign = align; g.textBaseline = base;
  if ('letterSpacing' in g) g.letterSpacing = `${spacing}px`;
  if (stroke) { g.lineJoin = 'round'; g.lineWidth = stroke; g.strokeStyle = strokeColor; g.strokeText(str, x, y); }
  if (gl) { g.shadowColor = glowColor; g.shadowBlur = gl; }
  g.fillStyle = color; g.fillText(str, x, y); g.restore();
}
export function measure(g, str, size, font = FONTS.title, weight = 700) { g.save(); g.font = `${weight} ${size}px "${font}"`; const w = g.measureText(str).width; g.restore(); return w; }

// ---------- shot registry ----------
const SHOTS = {};
// registerShot('s012', { kind: '3d', init(THREEKIT, info) -> state, draw(state, t, info), overlay?(g, t, info, state), cacheKey? })
export function registerShot(id, def) { SHOTS[id] = { kind: '3d', ...def }; }
export const getShot = id => SHOTS[id];
export const allShots = () => SHOTS;
