// _lib.js — shared helpers for every shot: character resolver, ghost (invisible) figure, camera spec, shot builders.
import { E, V, registerShot, mood, S, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, rng, noise, shake, talkAmount, wordTime, rr, seg, poly, circle, ring, linGrad, radGrad, glow, alpha, shade, mix, rgb, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { camPath, travel, drift, camAdd, spring, impact, posesSpring, fg, kText } from '/engine/motion.js';
import { CASTS, YOU } from './cast.js';
export { E, V, registerShot, mood, S, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, rng, noise, shake, talkAmount, wordTime, rr, seg, poly, circle, ring, linGrad, radGrad, glow, alpha, shade, mix, rgb, text, FONTS, drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos, FX, UI, camPath, travel, drift, camAdd, spring, impact, posesSpring, fg, kText, CASTS, YOU };

export const GYf = () => E.H * V(0.8, 0.68);
export const CXf = () => E.W / 2;
export const SC = () => V(1.5, 1.7);                       // medium-shot figure scale
const lum = (c) => { const [r, g, b] = rgb(c); return 0.3 * r + 0.6 * g + 0.1 * b; };
export const poseOf = (p) => (typeof p === 'string' ? POSES[p] || POSES.stand : p || POSES.stand);

// word time relative to the shot start (seconds into the shot); falls back to `dflt`
export const wt = (info, word, dflt = 0.5, after) => { const w = wordTime(word, after ?? info.shot.start); return w == null ? dflt : Math.max(0, w - info.shot.start); };

// ---------- the invisible hero ----------
// Ghost = a faint glass-like silhouette plus two dark dots (the only part that still "works").
export function eyesAt(g, o, openK = 1, lookv) {
  const [hx, hy, hr] = headPos(o), f = o.facing ?? 1, s = (o.s ?? 1);
  const L = lookv || o.look || [0, 0];
  const ex = hx + f * hr * 0.22 + L[0] * 3 * s, ey = hy - hr * 0.1 + L[1] * 3 * s, sp = hr * 0.52, rr0 = hr * 0.13;
  for (const dx of [0, sp]) {
    const x = ex + f * dx;
    glow(g, x, ey, rr0 * 4.5, '#cfe0ff', 0.12 * (o.eyeGlow ?? 1));
    g.save(); g.fillStyle = '#05060a'; g.beginPath(); g.ellipse(x, ey, rr0, Math.max(0.6, rr0 * openK), 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(210,225,255,.55)'; g.lineWidth = Math.max(1, rr0 * 0.28); g.beginPath(); g.ellipse(x, ey, rr0 * 1.25, Math.max(0.8, rr0 * 1.25 * openK), 0, 0, 7); g.stroke(); g.restore();
  }
}
export function ghost(g, o) {
  const M = o.M || mood('night'), bright = lum(M.wall) > 135;
  const col = bright ? '#eef4ff' : '#d9e4ff', a = o.ga == null ? (bright ? 0.2 : 0.2) : (bright ? Math.min(0.6, o.ga * 1.6) : o.ga);
  const pose = poseOf(o.pose);
  const base = { ...o, pose, outfit: { top: 'none', head: 'none' }, ink: col, inkFar: col, alpha: a, rim: { color: bright ? '#0f1830' : '#ffffff', dir: [0, -1], w: bright ? 3 : 2.2 }, expr: 'neutral', shadow: false, prop: null };
  if (a > 0.003) { g.save(); drawFigure(g, base); g.restore(); }
  if (o.eyes !== false) eyesAt(g, { ...o, pose }, o.eyeOpen ?? ((o.blink ?? false) ? 0.1 : 1));
}
// hoodie + jeans pieces only (the stuff stays visible when the body does not)
export function clothes(g, o) {
  const p = poseOf(o.pose), s = o.s ?? 1, f = o.facing ?? 1, hood = o.hood || '#d64a33', jeans = o.jeans || '#2c3a5a';
  g.save(); g.globalAlpha *= o.alpha ?? 1; g.translate(o.x, o.y); g.scale(f * s, s);
  seg(g, [p.hip, p.kB, p.fB, [p.fB[0] + 12, p.fB[1]]], 13, shade(jeans, -0.3)); seg(g, [p.hip, p.kF, p.fF, [p.fF[0] + 13, p.fF[1]]], 14, jeans);
  seg(g, [p.fB, [p.fB[0] + 12, p.fB[1]]], 9, '#e8e4ee'); seg(g, [p.fF, [p.fF[0] + 13, p.fF[1]]], 10, '#f2eef6');
  seg(g, [p.sh, p.eB, p.hB], 14, shade(hood, -0.3)); seg(g, [p.sh, p.hip], 28, hood);
  seg(g, [p.sh, p.eF, p.hF], 15, hood);
  g.fillStyle = shade(hood, -0.2); g.beginPath(); g.ellipse(p.sh[0] - 6, p.sh[1] - 8, 20, 12, -0.25, 0, 7); g.fill();            // hood at the neck
  seg(g, [[p.sh[0] + 6, p.sh[1] + 4], [p.sh[0] + 6, p.sh[1] + 28]], 2.5, '#f4efe6');                                                    // drawstring
  seg(g, [[p.hip[0] - 14, p.hip[1] + 20], [p.hip[0] + 14, p.hip[1] + 20]], 3, shade(jeans, 0.25)); g.restore();
}

// ---------- characters ----------
const px = (v) => (Math.abs(v) <= 4 ? v * E.W : v);
// draw one character spec in the current layer. env = {GY, M}
export function drawChar(g, ch, t, env, info) {
  const GY = env.GY, M = env.M, s = ch.s ?? SC(), f = ch.facing ?? 1;
  let x = px(ch.x ?? 0.5), y = ch.y ?? GY, pose = ch.pose;
  if (ch.walk) {
    const w = ch.walk, k = ease.linear((t - (w.t0 ?? 0)) / ((w.t1 ?? info.dur) - (w.t0 ?? 0)));
    x = lerp(px(w.x0), px(w.x1), w.ease ? ease.inOut(k) : k);
    const sp = w.run ? 1.6 : 0.95; pose = walkPose(t * Math.PI * 2 * sp * (w.rate ?? 1) + (w.ph ?? 0), { run: !!w.run });
    if (w.bob !== false) y += 0;
  } else if (Array.isArray(pose)) pose = ch.spring ? posesSpring(t, pose.map(([a, b]) => [a, poseOf(b)])) : posesAt(t, pose.map(([a, b]) => [a, poseOf(b)]), ch.blend ?? 0.35);
  else pose = poseOf(pose);
  if (ch.breathe !== false && !ch.walk) pose = breathe(pose, t, 1, ch.seed ?? 0);
  const rim = { color: M.rim, dir: ch.rimDir ?? [0, -1], w: 4 };
  const o = { x, y, s, facing: f, pose, M, look: ch.look, rot: ch.rot };
  if (ch.who === 'YOU' && (ch.ghost ?? true)) {
    const ga = typeof ch.ga === 'function' ? ch.ga(t) : ch.ga;
    ghost(g, { ...o, ga, blink: (t % 3.4) > 3.3, eyeOpen: ch.eyeOpen, eyes: ch.eyes, eyeGlow: ch.eyeGlow });
    if (ch.clothes) clothes(g, { ...o, alpha: ch.clothesA ?? 1 });
    return o;
  }
  const outfit = typeof ch.who === 'string' ? CASTS[ch.who] : ch.who;
  drawFigure(g, { ...o, outfit, expr: ch.expr || 'neutral', talk: ch.talk, blink: ((t + (ch.seed ?? 0)) % (3.1 + (ch.seed ?? 0) * 0.3)) > (3.0 + (ch.seed ?? 0) * 0.3), prop: ch.prop, rim, alpha: ch.alpha, trail: ch.trail, shadow: ch.shadow });
  return o;
}

// ---------- camera ----------
export function makeCam(spec, t, dur, seed = 1) {
  const sp = spec || {};
  if (sp.path) return camAdd(camPath(t, sp.path.map(([p, c]) => [p * dur, c])), sp.still ? {} : drift(t, sp.drift ?? 5, seed));
  const k = ease.sine(t / dur), g = (a, d) => (Array.isArray(a) ? lerp(a[0], a[1], k) : (a ?? d));
  const base = { z: g(sp.z, 1), x: g(sp.x, 0), y: g(sp.y, 0), r: g(sp.r, 0) };
  return camAdd(base, sp.still ? {} : drift(t, sp.drift ?? 4, seed));
}

// ---------- shot builders ----------
// shot(id, { set: fn(g,t,cam,opts)->env, opts, cam, chars: [...] | (t,info,env)=>[...], mid(g,t,info,env,cam), over(g,t,info,env,cam), fx: ['dust',..], fgl: (g,cam,env)=>.. , veil })
export function shot(id, o) {
  registerShot(id, { draw(g, t, info) {
    let cam = makeCam(o.cam, t, info.dur, (id.charCodeAt(3) || 1) + (id.charCodeAt(2) || 0));
    if (o.camAdd) cam = camAdd(cam, o.camAdd(t, info));
    const sceneT = o.freezeBg ? 0 : t;
    const env = o.set ? o.set(g, sceneT, cam, typeof o.opts === 'function' ? o.opts(t, info) : (o.opts || {})) : { GY: GYf(), CX: CXf(), M: mood('night') };
    o.behind?.(g, t, info, env, cam);
    const chars = typeof o.chars === 'function' ? o.chars(t, info, env) : (o.chars || []);
    layer(g, cam, 1, (g) => { o.mid0?.(g, t, info, env, cam); for (const ch of chars) drawChar(g, ch, t, env, info); o.mid?.(g, t, info, env, cam); });
    if (o.fgl) fg(g, cam, (g) => o.fgl(g, t, info, env, cam), { depth: o.fgDepth ?? 1.7, blur: o.fgBlur ?? 14 });
    for (const f of (o.fx || [])) fxDo(g, t, f, env);
    if (o.veil) veil(g, o.veil[0], o.veil[1]);
    o.over?.(g, t, info, env, cam);
  } });
}
function fxDo(g, t, f, env) {
  const [n, a] = Array.isArray(f) ? f : [f, {}];
  if (n === 'dust') FX.dust(g, t, { count: 36, color: alpha(env.M.key, 1), a: 0.32, ...a });
  else if (n === 'rain') FX.rain(g, t, a);
  else if (n === 'snow') FX.snow(g, t, a);
  else if (n === 'streak') FX.lensStreak(g, E.W / 2, E.H * 0.3, E.W * 1.2, env.M.key, 0.16, ...(a.h ? [a.h] : []));
  else if (n === 'stars') FX.stars(g, t, a);
}
// closeup: giant face over a blurred set
export function closeup(id, o) {
  registerShot(id, { draw(g, t, info) {
    const M = mood(o.mood || 'interiorCool'), cam = makeCam(o.cam || { z: [1.5, 1.6], x: -120 }, t, info.dur, 7);
    if (o.set) blurLayer(g, o.blur ?? 14, (g) => o.set(g, t, cam, o.opts || {})); else backdrop(g, M.sky);
    veil(g, o.veilC || '#120a10', o.veilA ?? 0.4);
    const r = (o.r ?? V(300, 330)) * (1 + 0.04 * ease.sine(t / info.dur)), cx = E.W / 2 + (o.dx ?? 0), cy = E.H * V(0.6, 0.55);
    const tk = typeof o.talk === 'function' ? o.talk(t, info) : (o.talk || 0);
    const ex = typeof o.expr === 'function' ? o.expr(t, info) : o.expr || 'neutral', lk = typeof o.look === 'function' ? o.look(t, info) : o.look;
    if (o.ghost) ghostFace(g, cx, cy, r, { M, look: lk, t, a: typeof o.ga === 'function' ? o.ga(t, info) : (o.ga ?? 0.22), open: typeof o.open === 'function' ? o.open(t, info) : o.open });
    else bigFace(g, cx, cy, r, { outfit: typeof o.who === 'string' ? CASTS[o.who] : o.who, expr: ex, talk: tk, look: lk, rimColor: M.rim, rimSide: o.side ?? -1, blink: (t % 3) > 2.9, tilt: o.tilt });
    if (tk > 0 && o.rings) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.7, color: '#fff3e0', a: 0.3 });
    o.over?.(g, t, info, { cx, cy, r, M });
    FX.dust(g, t, { count: 24, a: 0.25 });
  } });
}
// giant ghost head: faint glass circle + two big dark dots
export function ghostFace(g, cx, cy, r, o = {}) {
  const M = o.M || mood('night'), L = o.look || [0, 0], a = o.a ?? 0.22, op = o.open ?? 1;
  g.save(); g.translate(cx, cy);
  g.fillStyle = alpha('#dfe8ff', a * 0.55); g.beginPath(); g.ellipse(0, r * 1.62, r * 1.25, r * 0.85, 0, Math.PI, Math.PI * 2); g.fill();
  circle(g, 0, 0, r, alpha('#dfe8ff', a)); ring(g, 0, 0, r, r * 0.02, alpha('#ffffff', Math.min(1, a * 2.2)));
  for (const dx of [-0.3, 0.3]) { const x = dx * r + L[0] * r * 0.1, y = -r * 0.06 + L[1] * r * 0.1;
    glow(g, x, y, r * 0.34, '#cfe0ff', 0.22 * op);
    g.fillStyle = '#05060a'; g.beginPath(); g.ellipse(x, y, r * 0.105, Math.max(1, r * 0.125 * op), 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(215,228,255,.7)'; g.lineWidth = r * 0.02; g.beginPath(); g.ellipse(x, y, r * 0.14, Math.max(1.5, r * 0.165 * op), 0, 0, 7); g.stroke(); }
  g.restore();
}
// insert: big thing on a blurred, darkened set background.  draw(g,t,info,ctx)
export function insert(id, o) {
  registerShot(id, { draw(g, t, info) {
    const cam = makeCam(o.cam || { z: [1.4, 1.5], x: [100, 60] }, t, info.dur, 11), M = mood(o.mood || 'interiorCool');
    if (o.bg) o.bg(g, t, info, M); else if (o.set) blurLayer(g, o.blur ?? 16, (g) => o.set(g, o.freeze ? 0 : t, cam, o.opts || {})); else backdrop(g, M.sky);
    if (o.veil !== false) veil(g, o.veilC || '#120a10', o.veilA ?? 0.4);
    o.draw(g, t, info, { M, cam });
    for (const f of (o.fx || [])) fxDo(g, t, f, { M });
    o.over?.(g, t, info, { M, cam });
  } });
}
// plain full-screen custom (blueprint/UI/etc)
export function plain(id, draw) { registerShot(id, { draw }); }

// triptych: three sub-scenes wiped one after another inside one shot. fns[i](g, tLocal, info)
export function tri(id, fns, o = {}) {
  registerShot(id, { draw(g, t, info) {
    const n = fns.length, seg = info.dur / n, i = Math.min(n - 1, Math.floor(t / seg)), lt = t - i * seg, w = o.wipe ?? 0.22;
    g.save(); fns[i](g, lt, { ...info, dur: seg, i }); g.restore();
    if (i > 0 && lt < w) { const k = ease.out(lt / w); g.save(); g.beginPath(); g.rect(0, 0, E.W * (1 - k), E.H); g.clip(); fns[i - 1](g, seg + lt, { ...info, dur: seg, i: i - 1 }); g.restore(); }
    if (i > 0 && lt < w) { const k = ease.out(lt / w); g.fillStyle = 'rgba(255,240,220,.7)'; g.fillRect(E.W * (1 - k) - 3, 0, 6, E.H); }
  } });
}

// time-of-day card (the "8 a.m." beats)
export function timeCard(id, hh, mm, ampm, o = {}) {
  registerShot(id, { draw(g, t, info) {
    const M = mood(o.mood || 'day'), cam = { z: 1 + 0.03 * t, x: -10 * t };
    layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); if (o.sun !== false) FX.sun(g, E.W * (o.sunX ?? 0.72), E.H * (o.sunY ?? 0.5), 80, '#fff3dc', M.key, 4); if (o.moon) FX.moon(g, E.W * 0.72, E.H * 0.3, 70); if (o.stars) FX.stars(g, t, { count: 90 }); });
    layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * V(0.82, 0.7), w: E.W + 400, maxH: V(360, 600), color: shade(M.dark, 0.05), windowColor: alpha(M.practical, o.stars || o.moon ? 0.95 : 0.55), lit: o.stars || o.moon ? 0.6 : 0.2, seed: o.seed ?? 9 }));
    layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.dark, -0.2); g.fillRect(-E.W, E.H * V(0.82, 0.7), E.W * 3, E.H); });
    const cx = E.W * V(0.3, 0.5), cy = E.H * V(0.5, 0.3), r = V(210, 250), s0 = ((o.from ?? (hh - 1)) % 12) * 3600, s1 = (hh % 12) * 3600 + mm * 60;
    const T = lerp(s0, s1, ease.inOut(prog(t, 0, Math.min(info.dur * 0.8, 1.0))));
    g.save(); g.fillStyle = radGrad(g, E.W * V(0.66, 0.5), E.H * V(0.5, 0.6), 0, 700, ['rgba(8,6,16,.62)', 'rgba(8,6,16,0)']); g.fillRect(0, 0, E.W, E.H); g.restore();
    glow(g, cx, cy, r * 1.8, M.key, 0.15); FX.clock(g, cx, cy, r, T, { face: '#f2efe8' });
    const lbl = `${hh}${mm ? ':' + String(mm).padStart(2, '0') : ''}`;
    kText(g, t, lbl, E.W * V(0.66, 0.5), E.H * V(0.46, 0.6), { start: 0.05, mode: 'slam', size: V(260, 230), font: FONTS.title, color: S().ui.cream, glow: 30, align: 'center' });
    kText(g, t, ampm, E.W * V(0.66, 0.5), E.H * V(0.46, 0.6) + V(170, 150), { start: 0.25, mode: 'rise', size: V(84, 80), color: S().ui.gold, glow: 20, spacing: 6 });
    if (o.sub) kText(g, t, o.sub, E.W * V(0.66, 0.5), E.H * V(0.46, 0.6) + V(300, 280), { start: 0.9, mode: 'rise', size: V(76, 72), color: S().ui.cream, glow: 18, spacing: 4 });
    FX.dust(g, t, { count: 24, a: 0.3 });
  } });
}
