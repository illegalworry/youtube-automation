// director.js — template-driven shots. Every shot in story/shots.json carries params.tpl + its own parameters;
// this file registers a draw function per shot id. Bespoke shots (other files) may override by id.
import { E, V, S, registerShot, getShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, talkAmount, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, measure, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import { camAdd, drift, spring, impact, posesSpring, kText, fg } from '/engine/motion.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { CAST } from '../cast.js';
import { drawSet, bgBlur, wt, COL, camPreset, toWorld, freezeLook, badgeTxt, fadeIO } from './_common.js';
import { seatBacks } from '../sets/theater.js';
import { railing } from '../sets/extra.js';
import { INSERTS } from './_inserts.js';
import './_inserts2.js';
import { DIAGRAMS } from './_bp.js';
import './_bp2.js';
import './_mem.js';
import { ACTFX } from './_actfx.js';

// talk window: true (whole shot) | [a, b] seconds | 'word' (from that word to the end)
function talkWin(v, info) { if (!v) return 0; const st = info.shot.start; let a = 0, b = info.dur; if (Array.isArray(v)) [a, b] = v; else if (typeof v === 'string') a = wt(info, v, 0) - 0.05; return talkAmount(info.globalT, st + a, st + b); }
// set options that change over time: soK: {rigDrop: [[0, 0], ['hits', 1]]}
function resolveSo(p, t, info) { const so = { ...(p.so || {}) }; for (const [k, fr] of Object.entries(p.soK || {})) so[k] = key(t, fr.map(([a, v]) => [typeof a === 'string' ? wt(info, a, 0) : a, v]), ease.inOut); return so; }
POSES.sitPhone = { ...POSES.sit, eF: POSES.phone.eF, hF: POSES.phone.hF, eB: POSES.phone.eB, hB: POSES.phone.hB };
POSES.sitReach = { ...POSES.sit, eF: POSES.reach.eF, hF: POSES.reach.hF };
POSES.sitTalk = { ...POSES.sit, eF: POSES.talk.eF, hF: POSES.talk.hF };
POSES.sitHold = { ...POSES.sit, eF: POSES.holdFront.eF, hF: POSES.holdFront.hF, eB: POSES.holdFront.eB, hB: POSES.holdFront.hB };
const GROUND_OFF = { street: 140, streetDusk: 140 };
const P = (name) => (typeof name === 'string' ? POSES[name] || POSES.stand : name);
// value keyed on time: 'smile' | [[0,'neutral'],[1.2,'smile']] ; word keys allowed: [['word','smile']]
function keyed(v, t, info) { if (!Array.isArray(v) || !Array.isArray(v[0])) return v; let cur = v[0][1]; for (const [k, val] of v) { const tk = typeof k === 'string' ? wt(info, k, 99) : k; if (t >= tk) cur = val; } return cur; }
function poseKeys(v, info) { if (!Array.isArray(v)) return [[0, P(v)]]; return v.map(([k, val]) => [typeof k === 'string' ? wt(info, k, 0) : k, P(val)]); }

// ---------------------------------------------------------------- act: staged wide / medium shots
function actShot(g, t, info) {
  const p = info, dur = info.dur, set = p.set || 'kitchen';
  // framing: z zoom + focus point (world x of the subject) ; ground maps lower as we zoom in
  const z = p.z ?? (p.fr === 'med' ? 1.5 : p.fr === 'close' ? 2.0 : 1.12);
  const fx = p.fx != null ? p.fx * E.W : E.W / 2, GYs = E.H * V(0.8, 0.68) + (GROUND_OFF[set] || 0);
  const gyTarget = E.H * lerp(0.8, 0.93, clamp((z - 1) / 0.9)) + (p.dy || 0);
  const base = { z, x: (fx - E.W / 2), y: GYs - E.H / 2 - (gyTarget - E.H / 2) / z };
  let cam = camPreset(p.cam || 'push', t, dur, base, p.camAmt ?? 1, p.seed || 3);
  if (p.hit) { const ih = impact(t, wt(info, p.hit, 0.3), { amp: p.hitAmp ?? 12 }); cam = camAdd(cam, ih); }
  const env = drawSet(g, t, set, cam, resolveSo(p, t, info)) || {};
  const GY = env.GY ?? GYs, M = env.M || mood('dusk'), rimDir = env.rim || [0, -1];
  const ctx = { GY, M, cam, info, figs: {} };
  const list = p.cast || [];
  // behind-figure fx
  (p.fx2 || []).filter(f => f.behind).forEach(f => ACTFX[f.k]?.(g, t, ctx, f));
  layer(g, cam, 1, (g) => {
    list.forEach((c, i) => {
      const of = CAST[c.c] || CAST.man, s = (c.s ?? 1) * 1.38, f = c.f ?? 1;
      let x = (c.x ?? 0.5) * E.W, y = GY + (c.y || 0);
      let pose = c.spring ? posesSpring(t, poseKeys(c.pose || 'stand', info)) : posesAt(t, poseKeys(c.pose || 'stand', info).map(([k, v]) => [k, v]));
      if (c.walk) { // walk: {at, dist (signed screen px; omit = keep going), run, speed}
        const spd = (c.walk.run ? 420 : 160) * (c.walk.speed ?? 1), t0 = wt(info, c.walk.at, 0), tt = Math.max(0, t - t0), d = c.walk.dist;
        const travelled = d == null ? tt * spd : Math.min(Math.abs(d), tt * spd), moving = t >= t0 && (d == null || tt * spd < Math.abs(d));
        x += travelled * (d == null ? f : Math.sign(d));
        if (moving) pose = walkPose(tt * 2 * Math.PI * (c.walk.run ? 1.6 : 0.9) * (c.walk.speed ?? 1), { run: c.walk.run }); }
      if (c.slide) { const t0 = wt(info, c.slide.at, 0), k = ease.inOut(prog(t, t0, t0 + (c.slide.dur ?? 1))); x += (c.slide.dx || 0) * k; y += (c.slide.dy || 0) * k; }
      if (c.lift) y -= key(t, c.lift.map(([a, v]) => [typeof a === 'string' ? wt(info, a, 0) : a, v]), ease.out);
      if (c.shake) { x += Math.sin(t * 47) * c.shake; y += Math.cos(t * 39) * c.shake * 0.5; }
      if (c.bob) y -= Math.abs(Math.sin(t * 8)) * c.bob;
      if (!c.still) pose = breathe(pose, t, 1, i * 1.7);
      const sitting = /sit/.test(typeof c.pose === 'string' ? c.pose : JSON.stringify(c.pose || '')) && c.chair !== false;
      if (sitting) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * s, y, s, '#24181e'); g.restore(); }
      const expr = keyed(c.expr || 'neutral', t, info);
      const talk = talkWin(c.talk, info);
      drawFigure(g, { x, y, s, facing: f, outfit: of, pose, expr, talk, rot: keyed(c.rot, t, info), look: c.look, prop: keyed(c.prop, t, info), blink: (t + i * 0.7) % (2.8 + i * 0.4) > 2.65 + i * 0.4, rim: { color: M.rim, dir: rimDir, w: 4.5 }, dim: c.dim, trail: c.trail, alpha: c.alpha });
      if (talk > 0) FX.rings(g, x + 10 * f * s, y - 210 * s, t, { count: 2, r0: 40 * s, r1: 80 * s, color: '#fff3e0', a: 0.25 });
      ctx.figs[c.c] = { x, y, s, f, head: [x + 4 * f * s, y - 208 * s] };
    });
    (p.fx2 || []).filter(f => !f.behind && !f.screen).forEach(f => ACTFX[f.k]?.(g, t, ctx, f));
  });
  if (set === 'hall') seatBacks(g, cam, GY);
  if (set === 'bank' && p.counterFg) layer(g, cam, 1.08, (g) => { const c = '#1a1a2a'; g.fillStyle = c; g.fillRect(-E.W, GY - 130, E.W * 3, 140); g.fillStyle = shade('#cfe0ff', -0.6); g.fillRect(-E.W, GY - 140, E.W * 3, 12); });
  if (set === 'balcony') railing(g, cam, GY, E.W / 2);
  if (p.desks) layer(g, cam, 1.12, (g) => p.desks.forEach(dx => { const c = '#22182a'; rr(g, dx * E.W - 110, GY - 110, 220, 16, 5); g.fillStyle = c; g.fill(); g.fillRect(dx * E.W - 100, GY - 96, 200, 96); }));
  // atmosphere + soft foreground
  FX.dust(g, t, { count: 34, color: M.key, a: 0.3 });
  if (p.fg) softFg(g, t, cam, p.fg, p.fgSide ?? 1, M);
  (p.fx2 || []).filter(f => f.screen).forEach(f => ACTFX[f.k]?.(g, t, ctx, f));
  overlays(g, t, info);
}
function softFg(g, t, cam, kind, side, M) {
  const X = side > 0 ? E.W * 0.9 : E.W * 0.1;
  fg(g, cam, (g) => { const [x, y] = toWorld(X, E.H * 0.95, cam, 1.8); const c = '#0b080d';
    if (kind === 'plant') { for (let i = 0; i < 6; i++) { g.save(); g.translate(x, y); g.rotate(-0.9 + i * 0.35); g.fillStyle = shade('#1d3326', -0.2); g.beginPath(); g.ellipse(0, -160, 34, 150, 0, 0, 7); g.fill(); g.restore(); } }
    else if (kind === 'cup') { rr(g, x - 70, y - 260, 140, 200, 20); g.fillStyle = c; g.fill(); ring(g, x + 80, y - 180, 40, 18, c); }
    else if (kind === 'head') { circle(g, x, y - 300, 130, c); g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 260, 200, 0, Math.PI, Math.PI * 2); g.fill(); }
    else if (kind === 'lamp') { seg(g, [[x, y + 200], [x, y - 520]], 18, c); glow(g, x, y - 560, 160, M.practical, 0.6); circle(g, x, y - 560, 50, shade(M.practical, -0.2)); }
    else { rr(g, x - 240, y - 220, 480, 400, 30); g.fillStyle = c; g.fill(); }
  }, { depth: 1.8, blur: 16 });
}

// ---------------------------------------------------------------- overlays: kinetic text, readouts, badges, freeze
function overlays(g, t, info) {
  const p = info, C = COL();
  if (p.freeze) freezeLook(g, t, { badge: p.badge ?? '100%' });
  else if (p.badge) badgeTxt(g, p.badge, ease.out(prog(t, 0.2, 0.6)));
  (p.txt || []).forEach((tx, i) => {
    const st = wt(info, tx.at, 0.15 + i * 0.4) - 0.08, size = tx.size ?? 96, col = C[tx.color || 'gold'] || tx.color;
    const out = tx.out != null ? tx.out : info.dur - 0.32;
    kText(g, t, tx.s, (tx.x ?? 0.5) * E.W, (tx.y ?? 0.5) * E.H, { start: st, mode: tx.mode || 'drop', size, color: col, glow: 22, glowColor: alpha(col, 0.6), out, font: tx.font === 'ui' ? FONTS.ui : FONTS.title, weight: tx.font === 'ui' ? 900 : 700, spacing: tx.sp ?? 4, stagger: tx.stagger ?? 0.03, align: tx.align || 'center' });
    if (tx.strike) { const k = ease.out(prog(t, wt(info, tx.strike, 1), wt(info, tx.strike, 1) + 0.25)); if (k > 0) { const w = measure(g, tx.s, size) + tx.s.length * 4; seg(g, [[(tx.x ?? 0.5) * E.W - w / 2 - 20, (tx.y ?? 0.5) * E.H + 10], [(tx.x ?? 0.5) * E.W - w / 2 - 20 + (w + 40) * k, (tx.y ?? 0.5) * E.H - 10]], 12, C.accent); } }
  });
  (p.ro || []).forEach((r, i) => UI.readout(g, { label: r.label, value: r.value, x: (r.x ?? 0.08) * E.W, y: (r.y ?? 0.84) * E.H, color: C[r.color || 'gold'], a: ease.out(prog(t, wt(info, r.at, 0.3 + i * 0.4), wt(info, r.at, 0.3 + i * 0.4) + 0.3)) * fadeIO(t, info.dur, 0.01, 0.25), align: r.align || 'left', size: r.size }));
}

// ---------------------------------------------------------------- face: giant close-ups
function faceShot(g, t, info) {
  const p = info, who = CAST[p.who] || CAST.max, dur = info.dur;
  bgBlur(g, t, p.set || 'kitchen', resolveSo(p, t, info), { z: p.bgZ ?? 1.6, x: (p.side ?? 0) * -220 + (p.bgX ?? 0), y: p.bgY ?? -140, blur: 14, veil: p.dark ?? 0.36 });
  const M = mood(p.mood || ({ living: 'interiorWarm', bank: 'interiorCool', party: 'night', leoKitchen: 'dusk', livingEve: 'dusk', bedroom: 'night', street: 'night', lab: 'interiorCool', gym: 'interiorCool', hall: 'interiorWarm', stage: 'interiorWarm', track: 'golden', cafe: 'golden', market: 'interiorCool', hospital: 'day', music: 'dusk', fair: 'night', clinic: 'interiorCool', clinicNight: 'night', balcony: 'dusk', streetDusk: 'dusk', kitchenEve: 'dusk', kitchenNight: 'night' }[p.set] || 'interiorWarm'));
  const push = p.cam === 'crash' ? 1 + 0.18 * ease.out(prog(t, 0, 0.5)) : p.cam === 'pull' ? 1.08 - 0.08 * ease.inOut(t / dur) : 1 + 0.06 * ease.inOut(t / dur);
  const r = V(300, 330) * (p.r ?? 1) * push * (who.kid ? 0.9 : 1);
  const sx = E.W / 2 + (p.side ?? 0) * E.W * 0.2, sy = E.H * V(0.6, 0.55) + (p.dy || 0);
  const d = drift(t, 8, 5); let hx = sx + d.x, hy = sy + d.y;
  if (p.hit) { const ih = impact(t, wt(info, p.hit, 0.3), { amp: 16 }); hx += ih.x; hy += ih.y; }
  if (p.shake) { hx += Math.sin(t * 40) * p.shake; hy += Math.cos(t * 33) * p.shake; }
  const talk = talkWin(p.talk, info);
  const expr = keyed(p.expr || 'neutral', t, info);
  if (p.pulse) { const k = (Math.sin(t * 7) + 1) / 2; glow(g, hx, hy, r * 2.2, '#ff4a3a', 0.12 + 0.12 * k); }
  bigFace(g, hx, hy, r, { outfit: who, expr, talk, blink: !p.noBlink && (t % 3.3) > 3.18, look: keyed(p.look || [0, 0], t, info), rimColor: M.rim, rimSide: p.rimSide ?? ((p.side ?? 0) > 0 ? 1 : -1), tilt: p.tilt || 0 });
  if (talk > 0) FX.rings(g, hx, hy, t, { count: 3, r0: r * 1.1, r1: r * 1.55, color: '#fff3e0', a: 0.28 });
  if (p.sweat) for (let i = 0; i < 2; i++) { const ph = (t * 0.7 + i * 0.5) % 1; g.fillStyle = alpha('#9fd8ff', 0.9 * (1 - ph)); g.beginPath(); g.ellipse(hx + (i ? r * 0.75 : -r * 0.8), hy - r * 0.3 + ph * r * 0.6, r * 0.05, r * 0.08, 0, 0, 7); g.fill(); }
  if (p.gray) { const k = ease.inOut(prog(t, 0.2, dur)); g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${0.9 * k})`; g.fillRect(0, 0, E.W, E.H); g.restore(); g.fillStyle = radialVignette(g, k); g.fillRect(0, 0, E.W, E.H); }
  if (p.thoughts) ACTFX.thoughts(g, t, { figs: { x: { head: [hx - (p.side ?? 0) * -r * 0.45, hy + r * 0.35], s: 1 } }, info }, { who: 'x', n: p.thoughts, icons: p.icons, R: r * 1.8, size: r * 0.17, step: p.thoughtStep });
  if (p.spark) { const st = wt(info, p.spark, 0.6), k = ease.outBack(prog(t, st, st + 0.5)) * (p.sparkOut ? 1 - ease.inOut(prog(t, wt(info, p.sparkOut, 9), wt(info, p.sparkOut, 9) + 0.5)) : 1) * (p.sparkBig ? 2.2 : 1); if (k > 0) { glow(g, hx + r * 0.9, hy - r * 0.9, r * 1.2 * k, COL().gold, 0.6); FX.sparkle(g, hx + r * 0.9, hy - r * 0.9, r * 0.35 * k, '#fff6d0', 1); } }
  FX.dust(g, t, { count: 20, color: M.key, a: 0.25 });
  overlays(g, t, info);
}
function radialVignette(g, k) { const gr = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.3, E.W / 2, E.H / 2, E.W * 0.7); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${0.75 * k})`); return gr; }

// ---------------------------------------------------------------- card: kinetic lines over a blurred set / void
function cardShot(g, t, info) {
  const p = info, C = COL();
  if (p.set && p.set !== 'void') bgBlur(g, t, p.set, p.so || {}, { z: 1.3, blur: 18, veil: 0.55 }); else drawSet(g, t, 'void', { z: 1 + 0.03 * t / info.dur });
  if (p.ink) { g.fillStyle = alpha('#05040a', 0.35); g.fillRect(0, 0, E.W, E.H); }
  overlays(g, t, info);
}

// ---------------------------------------------------------------- PLUS / MINUS motif
function pmShot(g, t, info) {
  const p = info, C = COL(), plus = p.kind !== 'minus', col = plus ? C.good : C.accent;
  bgBlur(g, t, p.set || 'class', p.so || {}, { z: 1.4, blur: 20, veil: 0.6 });
  const st = 0.02, ih = impact(t, st + 0.12, { amp: 14 });
  g.save(); g.translate(ih.x, ih.y);
  const k = spring(t, st, { freq: 2.6, damp: 0.5 }), cx = E.W / 2, cy = E.H * (p.sub ? 0.42 : 0.5);
  glow(g, cx, cy, 420 * clamp(k), col, 0.35);
  g.save(); g.translate(cx - 330, cy); g.scale(clamp(k, 0, 1.3), clamp(k, 0, 1.3)); circle(g, 0, 0, 74, alpha(col, 0.18)); ring(g, 0, 0, 74, 8, col);
  seg(g, [[-36, 0], [36, 0]], 16, col); if (plus) seg(g, [[0, -36], [0, 36]], 16, col); g.restore();
  kText(g, t, plus ? 'PLUS' : 'MINUS', cx + 70, cy, { start: st, mode: 'slam', size: 150, color: col, glow: 30, glowColor: alpha(col, 0.7), spacing: 10, out: info.dur - 0.25 });
  if (p.sub) kText(g, t, p.sub, cx, cy + 170, { start: wt(info, p.subAt, 0.35), mode: 'rise', size: 58, color: C.cream, font: FONTS.ui, weight: 900, spacing: 3, out: info.dur - 0.25 });
  g.restore();
}

// ---------------------------------------------------------------- title card over the house at dawn
function titleShot(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.08 - 0.06 * ease.inOut(t / info.dur), y: -30 * ease.inOut(t / info.dur) };
  layer(g, cam, 0.15, (g) => { g.fillStyle = (() => { const gr = g.createLinearGradient(0, 0, 0, E.H); M.sky.forEach((c, i) => gr.addColorStop(i / (M.sky.length - 1), c)); return gr; })(); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.sun(g, E.W * 0.5, E.H * 0.7, 90, '#fff3dc', M.key, 5); FX.godRays(g, E.W * 0.5, E.H * 0.7, { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t }); });
  layer(g, cam, 0.4, (g) => FX.skyline(g, { x: -300, y: E.H * 0.76, w: E.W + 600, maxH: 380, color: '#2a1f36', windowColor: alpha(M.practical, 0.7), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#140f1a'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H); FX.facade(g, { x: E.W * 0.12, y: E.H * 0.82, w: 360, h: 300, color: '#1e1626', win: M.practical, dark: '#120d18', cols: 3, rows: 2, lit: 0.5, seed: 3, door: true }); poly(g, [[E.W * 0.12 - 30, E.H * 0.82 - 300], [E.W * 0.12 + 180, E.H * 0.82 - 440], [E.W * 0.12 + 390, E.H * 0.82 - 300]], '#1a1220'); FX.tree(g, E.W * 0.85, E.H * 0.82, 2.4, '#120d18'); });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.4 });
  UI.titleCard(g, t, { lines: info.lines || ['WHAT IF YOU USED', '100% OF YOUR BRAIN?'], dur: info.dur + 0.3, y: E.H * 0.42 });
}

// ---------------------------------------------------------------- FACT / FICTION cards
function factShot(g, t, info) {
  const p = info, C = COL(), fact = p.kind !== 'fiction', col = fact ? C.good : C.accent;
  UI.blueprint(g);
  const st = 0.05;
  g.save(); const k = spring(t, st, { freq: 2.4, damp: 0.5 }); g.translate(E.W / 2, E.H * 0.3); g.rotate(-0.06); g.scale(clamp(k, 0, 1.3), clamp(k, 0, 1.3));
  rr(g, -230, -70, 460, 140, 18); g.strokeStyle = col; g.lineWidth = 10; g.stroke(); text(g, fact ? 'FACT' : 'FICTION', 0, 4, { size: 92, color: col, glow: 20, glowColor: alpha(col, 0.6), spacing: 8 }); g.restore();
  (p.lines || []).forEach((ln, i) => kText(g, t, ln.s, E.W / 2, E.H * (0.56 + i * 0.13), { start: wt(info, ln.at, 0.5 + i * 0.6), mode: 'rise', size: ln.size ?? 70, color: C[ln.color || 'cream'], font: FONTS.ui, weight: 900, spacing: 3, glow: 12, out: info.dur - 0.25 }));
  if (p.d && DIAGRAMS[p.d]) DIAGRAMS[p.d](g, t, info, { mini: true });
}

// ---------------------------------------------------------------- end screen
function endShot(g, t, info) {
  bgBlur(g, t, info.set || 'bedroom', { laptopOn: true }, { z: 1.2, blur: 16, veil: 0.5 });
  UI.endScreen(g, t, { question: info.q || 'WHAT DO YOU THINK?', cast: (info.cast || ['max', 'mia', 'leo', 'lee', 'black']).map(k => CAST[k]), dur: info.dur });
}

const TPL = {
  act: actShot, face: faceShot, card: cardShot, pm: pmShot, title: titleShot, fact: factShot, end: endShot,
  ins: (g, t, info) => { (INSERTS[info.obj] || INSERTS._missing)(g, t, info); overlays(g, t, info); },
  bp: (g, t, info) => { UI.blueprint(g); (DIAGRAMS[info.d] || DIAGRAMS._missing)(g, t, info); overlays(g, t, info); },
};
for (const s of E.shots) {
  const tp = s.params?.tpl; if (!tp || tp === '3d' || !TPL[tp]) continue;
  registerShot(s.id, { draw(g, t, info) { TPL[tp](g, t, info); } });
}
