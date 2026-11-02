// sets/kit.js — small helpers shared by all shot files of this project.
import { E, V, layer, blurLayer, veil, rr, circle, seg, poly, text, FONTS, S, alpha, shade, clamp, prog, ease, talkAmount, wordTime } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, spring } from '/engine/motion.js';
import { drawToon, bigToon, toonBubble, toonHeadPos } from '/engine/toon.js';
import { classroom, street, bedroom, schoolLot, garage } from '/engine/toonsets.js';
import { PLACES } from './places.js';

export const SET = { ...PLACES, classroom, street, bedroom, schoolLot, garage };
export const bl = (t, per = 3, off = 0) => (t + off) % per > per - 0.12;
// expression timeline: ex(t, 'smile', [1.2, 'shocked'], [2, 'joy'])
export function ex(t, first, ...keys) { let e = first; for (const [k, v] of keys) if (t >= k) e = v; return e; }
// two-key camera move with drift
export function mv(t, dur, a, b, seed = 1, amp = 4) { return camAdd(camPath(t, [[0, a], [dur, b]]), drift(t, amp, seed)); }
export function hitCam(cam, t, tHit, amp = 10) { const im = impact(t, tHit, { amp }); return camAdd(cam, { x: im.x, y: im.y, r: im.r }); }
// local time (in shot) when a word is spoken, or fallback
export function wt(info, word, fb = 0) { const w = wordTime(word, info.shot.start - 0.1); return w == null || w > info.shot.end ? fb : w - info.shot.start; }
export const talk = (info, a = 0, b = 1e9) => talkAmount(info.globalT, info.shot.start + a, info.shot.start + b);
export const pop = (t, t0, d = 0.18) => ease.outBack(clamp(prog(t, t0, t0 + d)));
// draw a toon with sensible defaults
let _seed = 0;
export function T(g, o) { const t = o.t ?? 0; drawToon(g, { s: 1.3, facing: 1, blink: bl(t, o.per ?? 3, o.off ?? 0), ...o, pose: o.pose ?? breathe(POSES.stand, t, 1, o.off ?? 0) }); }
export function bubbleOver(g, o, str, t, t0 = 0, opt = {}) { const k = pop(t, t0); if (k <= 0) return; const [hx, hy, hr] = toonHeadPos(o); toonBubble(g, hx + (opt.dx ?? 30), hy - hr - (opt.dy ?? 30), str, { k, size: opt.size ?? 34, tail: opt.tail ?? -20 }); }

// giant close-up over the blurred set
export function closeUp(g, t, info, o) {
  const bgCam = o.bgCam || { z: 1.5, x: o.bgX ?? 150, y: o.bgY ?? -150 };
  blurLayer(g, o.blur ?? 14, (g) => SET[o.set](g, t, bgCam, o.setOpt || {})); veil(g, o.veil ?? '#ffffff', o.veilA ?? 0.06);
  const im = o.hit != null ? impact(t, o.hit, { amp: o.hitAmp ?? 8 }) : { x: 0, y: 0 };
  g.save(); g.translate(im.x, im.y);
  const push = o.push ?? 0.03, r = V(o.r ?? 260, 290) * (1 + push * t), x = E.W * (o.x ?? 0.42), y = E.H * (o.y ?? 0.52);
  bigToon(g, x, y, r, { rimSide: o.x > 0.5 ? -1 : 1, blink: bl(t, o.per ?? 2.8), tilt: o.tilt ?? 0, ...o.toon });
  if (o.after) o.after(g, x, y, r);
  g.restore();
}

// handheld phone filling the middle of the frame; screen(g, x, y, w, h)
export function phoneInsert(g, t, info, o) {
  blurLayer(g, 16, (g) => SET[o.set || 'bedroom'](g, t, { z: 1.4, x: 100, y: -60 }, o.setOpt || {})); veil(g, '#000', o.dim ?? 0.12);
  const k = ease.out(clamp(prog(t, 0, 0.35))), w = 440, h = 820, x = E.W / 2 - w / 2 + (o.dx ?? 0), y = E.H / 2 - h / 2 + 90 + (1 - k) * 200 + Math.sin(t * 1.3) * 4;
  g.save(); if (o.shake) g.translate(Math.sin(t * 60) * o.shake, Math.cos(t * 53) * o.shake);
  circle(g, x + w * 0.5, y + h + 40, 150, S().ink);                                   // mitten hand
  rr(g, x - 6, y - 6, w + 12, h + 12, 58); g.fillStyle = shade('#2a2d34', 0.2); g.fill();
  rr(g, x, y, w, h, 52); g.fillStyle = '#16171c'; g.fill();
  rr(g, x + 18, y + 18, w - 36, h - 36, 38); g.fillStyle = o.screenBg || '#f4f4f6'; g.fill();
  g.save(); rr(g, x + 18, y + 18, w - 36, h - 36, 38); g.clip(); o.screen(g, x + 18, y + 18, w - 36, h - 36); g.restore();
  rr(g, x + w / 2 - 50, y + 26, 100, 22, 11); g.fillStyle = '#16171c'; g.fill();
  circle(g, x + w * 0.5, y + h + 40, 150, S().ink); g.restore();
  if (o.after) o.after(g);
}
// classroom zoomed onto the whiteboard; draw(g, x, y, w, h)
export function boardShot(g, t, info, draw, o = {}) {
  const z0 = o.z ?? 2.5, cam = mv(t, info.dur, { x: -133, y: -163, z: z0 }, { x: -133 + (o.dx ?? 10), y: -160, z: z0 + 0.12 }, o.seed ?? 3, 2);
  classroom(g, t, cam, { onBoard: (g, x, y, w, h) => draw(g, x, y, w, h) });
}
// hand-written board text
export const hand = (g, str, x, y, size = 56, color = '#2c4a8a') => text(g, str, x, y, { size, font: FONTS.hand, weight: 400, color });
// a big red X / green check drawn on
export function mark(g, t, t0, x, y, s = 60, good = false, lw = 0.22) { const p = clamp(prog(t, t0, t0 + 0.25)); if (p <= 0) return; g.save(); g.lineCap = 'round'; g.lineWidth = s * lw; g.strokeStyle = good ? '#3fae5a' : '#e0443a';
  if (good) { g.beginPath(); g.moveTo(x - s * 0.6, y); g.lineTo(x - s * 0.6 + s * 0.4 * Math.min(1, p * 2), y + s * 0.4 * Math.min(1, p * 2)); if (p > 0.5) g.lineTo(x - s * 0.2 + s * 0.9 * (p - 0.5) * 2, y + s * 0.4 - s * 0.9 * (p - 0.5) * 2); g.stroke(); }
  else { g.beginPath(); g.moveTo(x - s / 2, y - s / 2); g.lineTo(x - s / 2 + s * Math.min(1, p * 2), y - s / 2 + s * Math.min(1, p * 2)); if (p > 0.5) { g.moveTo(x + s / 2, y - s / 2); g.lineTo(x + s / 2 - s * (p - 0.5) * 2, y - s / 2 + s * (p - 0.5) * 2); } g.stroke(); } g.restore(); }
// rubber stamp text (rotated box)
export function stamp(g, t, t0, str, x, y, o = {}) { const k = clamp(prog(t, t0, t0 + 0.12)); if (k <= 0) return; const sc = 1 + (1 - k) * 1.2, c = o.color || '#e0443a', size = o.size || 64;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.12); g.scale(sc, sc); g.globalAlpha = k; g.font = `900 ${size}px "${FONTS.ui}"`; const w = g.measureText(str).width + size * 0.8, h = size * 1.5;
  g.strokeStyle = c; g.lineWidth = size * 0.1; rr(g, -w / 2, -h / 2, w, h, 10); g.stroke(); text(g, str, 0, 2, { size, font: FONTS.ui, weight: 900, color: c, spacing: 3 }); g.restore(); }
// heart icon
export function heart(g, x, y, s, c = '#e8443a') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.beginPath(); g.moveTo(0, 30); g.bezierCurveTo(-60, -10, -30, -55, 0, -25); g.bezierCurveTo(30, -55, 60, -10, 0, 30); g.fill(); g.restore(); }
// screen-space flat label line (white heavy outlined) for short German lines
export function line(g, t, str, x, y, o = {}) { const k = pop(t, o.start ?? 0); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); const size = o.size || 64;
  text(g, str, 4, 6, { size, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.3)', spacing: 2 }); text(g, str, 0, 0, { size, font: FONTS.ui, weight: 900, color: o.color || '#ffffff', stroke: size * 0.16, strokeColor: '#141418', spacing: 2 }); g.restore(); }
export { POSES, breathe, camPath, camAdd, drift, impact, spring };
// counter with German number formatting (1.000.000, 0,1)
import { counter as _counter } from '/engine/toonui.js';
export function cnt(g, t, o) {
  const { from = 0, to = 100, start = 0, dur = 1.2, decimals = 0 } = o;
  const v = from + (to - from) * ease.out(clamp(prog(t, start, start + dur)));
  const str = (o.prefix || '') + v.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (o.suffix || '');
  if (t < start) return;
  const k = ease.outBack(clamp(prog(t, start, start + 0.25))), size = o.size || 110, x = o.x ?? E.W / 2, y = o.y ?? E.H * 0.3;
  g.save(); g.translate(x, y); g.scale(k, k);
  text(g, str, 5, 7, { size, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.3)' });
  text(g, str, 0, 0, { size, font: FONTS.ui, weight: 900, color: o.color || S().ui.gold, stroke: size * 0.14, strokeColor: '#141418' });
  if (o.label) text(g, o.label, 0, size * 0.78, { size: size * 0.32, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: size * 0.06, strokeColor: '#141418', spacing: 3 });
  g.restore();
}
// PLUS / MINUS badge
export function plusMinus(g, t, t0, plus, x = E.W * 0.82, y = E.H * 0.2) { const k = pop(t, t0, 0.22); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.rotate(-0.08);
  rr(g, -150, -60, 300, 120, 24); g.fillStyle = plus ? '#3fae5a' : '#e0443a'; g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 8; g.stroke();
  text(g, plus ? '+ PLUS' : '− MINUS', 0, 4, { size: 56, font: FONTS.ui, weight: 900, color: '#ffffff' }); g.restore(); }
