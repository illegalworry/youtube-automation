// _t3.js — templates: café, thermal, evidence, bus stop, park phone, dinner, reflection, Plato, ending
import { E, layer, blurLayer, veil, ease, prog, clamp, lerp, mood, circle, ring, seg, rr, glow, alpha, text, FONTS, shade, linGrad, rng, poly } from '/engine/core.js';
import { drawGlow, bigGlow, idle, gPosesAt, blinkAt, gWalk, eyes, blobby } from '/engine/glow.js';
import * as G from '/engine/glowsets.js';
import * as UI from '/engine/glowui.js';
import { camPath, drift, camAdd, spring, kText, impact } from '/engine/motion.js';
import * as L from './_lib.js';
const { W, H, you, person, walker, cm, lw } = L;
export const T = {};
const exprAt = (t, keys) => { let e = keys[0][1]; for (const [k, v] of keys) if (t >= k) e = v; return e; };

T.cafe = (g, t, info, p) => {
  const cam = p.insert ? camAdd(camPath(t, [[0, { z: 1.5, x: 120, y: -60 }], [info.dur, { z: 1.62, x: 130, y: -70 }]]), drift(t, 3, 3)) : cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.07 });
  const r = L.cafe(g, t, cam, {}); const GY = r.GY;
  layer(g, cam, 1, (g) => {
    const scream = p.scream ? t > lw(info, p.screamW || '', 0.4) : false, watch = p.watch || scream;
    const pats = [[0.5, L.C.lilac, -1], [0.66, L.C.blue, 1], [0.84, L.C.coral, -1]];
    pats.forEach(([x, o, f], i) => { L.cafeTable(g, W * x + (i === 1 ? 80 : 0), GY, 1); person(g, { x: W * x + (f > 0 ? -70 : 70) + (i === 1 ? 80 : 0), y: GY, t, s: 1.35, outfit: o, seed: i, facing: f, pose: idle(scream ? (i === 1 ? 'handsOnHead' : 'scared') : watch ? 'stand' : 'sitFront', t), expr: scream ? 'shocked' : watch ? 'surprised' : 'content', look: watch ? [i === 1 ? -1 : -1, -0.3] : [f, 0.2], rimC: '#fff4e0', prop: !watch && i === 0 ? 'mug' : null, talk: scream ? 0.6 + 0.4 * Math.sin(t * 20 + i) : 0 }); });
    const yx = W * (p.youX ?? 0.34) + (p.run ? ease.in(prog(t, 0.2, 1.0)) * W * 0.7 : 0);
    you(g, { x: yx, y: GY, t, inv: 0.95, s: 1.6, expr: p.run ? 'scared' : exprAt(t, p.expr || [[0, 'sly']]), look: [1, 0.2], pose: p.run ? gWalk(t * 9, { run: true }) : idle(p.hold ? 'holdUp' : 'stand', t), turn: p.run ? 0.85 : 0.2, rimC: '#fff4e0' });
    // the croissant / lump inside the invisible body
    const hx = yx + 34, hy = GY - 330;
    if (p.hold) L.croissant(g, hx + 30, hy - 40, 0.7, p.bite ? clamp((t - 0.4) / 2.2) : 0);
    if (p.lump != null) { const k = typeof p.lump === 'number' ? p.lump : ease.inOut(prog(t, 0.6, info.dur - 0.5)); L.lump(g, yx, GY - 410 + k * 160, 30); if (watch) { glow(g, yx, GY - 280, 200, '#fff2c8', 0.25); } }
    if (scream) for (let i = 0; i < 2; i++) UI.bubble(g, W * (0.56 + i * 0.26), H * 0.28, { str: 'AAAH!', w: 200, h: 84, t, start: lw(info, p.screamW || '', 0.4) + i * 0.2, size: 34, tail: [-30, 50] });
  });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.08, { start: lw(info, p.tagW || '', 0.4) });
};

T.croissantClose = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: 0, y: -30 }, drift(t, 4, 5)); blurLayer(g, 7, (g) => L.cafe(g, t, cam, {})); veil(g, '#2a1a10', 0.1);
  const cx = W * 0.5, cy = H * 0.6, R = 230; g.save(); g.strokeStyle = alpha('#ffffff', 0.85); g.lineWidth = 5; g.shadowColor = '#bfe0ff'; g.shadowBlur = 20; g.beginPath(); g.arc(cx, cy - 160, R, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(cx - R * 1.45, H + 20); g.lineTo(cx - R * 1.45, cy + 160); g.quadraticCurveTo(cx - R * 1.45, cy + 40, cx - R * 0.9, cy + 40); g.lineTo(cx + R * 0.9, cy + 40); g.quadraticCurveTo(cx + R * 1.45, cy + 40, cx + R * 1.45, cy + 160); g.lineTo(cx + R * 1.45, H + 20); g.stroke(); g.restore();
  eyes(g, cx, cy - 160, R, { expr: p.ex || 'happy', blink: blinkAt(t, 3.2), turn: 0.1, look: [0, 0.5] }, '#ffffff');
  if (p.mode === 'bite') { const bites = ['bite', 'chew', 'swallow'].map((w, i) => lw(info, w, 0.3 + i * 0.8)); const nb = bites.filter(b => t > b).length; if (nb < 3) L.croissant(g, cx + 30, cy - 60 + 40 * Math.sin(t * 10) * (nb > 0 ? 0.1 : 0), 1.8, nb / 3); else { const k = ease.inOut(prog(t, bites[2] + 0.2, info.dur)); L.lump(g, cx, cy - 40 + k * 320, 46); } (['BITE', 'CHEW', 'SWALLOW']).forEach((s, i) => UI.tag(g, t, s, W * 0.84, H * (0.3 + i * 0.12), { start: bites[i], size: 30 })); }
  else { const k = ease.inOut(prog(t, 0.2, info.dur)); L.lump(g, cx, cy + 60 + k * 240, 46); }
};

T.digest = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = G.studio(g, t, cam, { mood: 'data', spot: 0.14 });
  const k = p.fade ? ease.inOut(prog(t, 0.6, info.dur - 0.3)) : 0;
  layer(g, cam, 1, (g) => { you(g, { x: W * 0.5, y: r.GY, t, inv: 0.95, s: 1.9, expr: 'worried', look: [0, 0.6], rimC: '#fff' }); g.save(); g.globalAlpha *= 1 - k; L.lump(g, W * 0.5 + 8, r.GY - 300, 40); g.restore(); });
  (p.tags || []).forEach(([s, w, x, y], i) => UI.tag(g, t, s, W * x, H * y, { start: lw(info, w, 0.3 + i * 0.6), size: 34 }));
  if (p.fade) UI.meterBar(g, t, { label: 'DIGESTING…', v: 1, x: W * 0.62, y: H * 0.86, w: W * 0.3, start: 0.3, suffix: ' %' });
  if (p.arrowLump) UI.arrow(g, t, [W * 0.7, H * 0.3], [W * 0.55, H * 0.42], { start: lw(info, 'food', 0.5) });
};

T.lesson = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); G.studio(g, t, cam, { mood: 'data', spot: 0.12 });
  UI.titleCard(g, t, { title: p.title, sub: p.sub, start: 0.1, dur: info.dur + 1, y: H * 0.42 });
  if (p.icon === 'clock') { L.clockFace(g, W * 0.5, H * 0.76, 90, 1, (t * 40) % 60); }
};

T.thermal = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.5, z1: p.zoom ? 1.75 : 1.6, y0: -70, y1: -80, x0: 160, x1: 170 });
  G.monitorRoom(g, t, cam, {}, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#0a0a4a', '#1a1a6a']); g.fillRect(x, y, w, h);
    for (let i = 0; i < 4; i++) { g.fillStyle = '#20206a'; g.fillRect(x + 20 + i * (w / 4), y + h * 0.15, w / 4 - 40, h * 0.7); }
    const hot = (px, py, s, k) => { g.save(); g.globalCompositeOperation = 'screen'; g.translate(px, py); g.scale(s, s); const gr = g.createRadialGradient(0, -60, 4, 0, -60, 90); gr.addColorStop(0, '#ffffa0'); gr.addColorStop(0.35, '#ff8a20'); gr.addColorStop(0.7, '#c82a6a'); gr.addColorStop(1, 'rgba(60,20,120,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, -60, 34, 80, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(0, -150, 30, 0, Math.PI * 2); g.fill(); g.restore(); };
    hot(x + w * 0.2, y + h * 0.85, 1, 1); hot(x + w * 0.82, y + h * 0.88, 1.1, 1); hot(x + w * (0.35 + 0.3 * prog(t, 0, info.dur)), y + h * 0.86, 1.05, 1);
    text(g, '● REC  THERMAL', x + 16, y + 22, { size: 18, font: FONTS.ui, weight: 900, color: '#ff5a5a', align: 'left' }); text(g, '36.6°C', x + w * (0.35 + 0.3 * prog(t, 0, info.dur)), y + h * 0.3, { size: 20, font: FONTS.ui, weight: 900, color: '#ffffff' }); });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.06, { start: lw(info, p.tagW || '', 0.6) });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.92, { start: lw(info, p.ktW || '', 0.4), mode: 'rise', size: 60 });
};

T.thermalDiag = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); const r = G.studio(g, t, cam, { mood: 'data', spot: 0.1 });
  layer(g, cam, 1, (g) => { L.cctv(g, W * 0.12, H * 0.12, 1.8, 0.35); you(g, { x: W * 0.62, y: r.GY, t, inv: 0.95, s: 1.8, expr: 'nervous', look: [-1, -0.2], rimC: '#fff' });
    if (p.mode === 'light') { for (let i = 0; i < 3; i++) { const y = H * (0.3 + i * 0.12), k = prog(t, 0.3 + i * 0.2, 1.4 + i * 0.2); L.lightRay(g, W * 0.24, H * 0.24, W * 1.05, y + 40, k, '#ffe27a', 6); } UI.tag(g, t, 'LIGHT?  NONE', W * 0.32, H * 0.6, { start: 1.2, size: 30 }); }
    else { glow(g, W * 0.62, r.GY - 300, 380, '#ff8a3a', 0.55); L.heat(g, W * 0.62, r.GY - 500, 200, t); for (let i = 0; i < 3; i++) { const k = prog(t, 0.4 + i * 0.2, 1.5 + i * 0.2); L.lightRay(g, W * 0.56, H * (0.4 + i * 0.1), W * 0.26, H * 0.24, k, '#ff8a3a', 8); } UI.tag(g, t, 'HEAT  ✓', W * 0.32, H * 0.6, { start: 1.4, size: 30 }); } });
};

T.evidence = (g, t, info, p) => {
  const m = p.mode;
  if (m === 'mud') { const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.08 }]]), drift(t, 3, 1)); layer(g, cam, 1, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, H, ['#6a5040', '#4a3428']); g.fillRect(-W, -H, W * 3, H * 3); const R = rng(4); for (let i = 0; i < 40; i++) { g.fillStyle = alpha('#3a2820', 0.5); g.beginPath(); g.ellipse(R() * W, R() * H, 30 + R() * 80, 10 + R() * 20, 0, 0, Math.PI * 2); g.fill(); } for (let i = 0; i < 7; i++) L.footprint(g, W * 0.1 + i * 270, H * 0.62 + (i % 2) * 120 - i * 30, 2.4, clamp((t - 0.2 - i * 0.3) * 4), false, '#2a1a14'); }); }
  else if (m === 'door') { const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const r = L.shop(g, t, cam, {}); layer(g, cam, 1, (g) => { const sp = spring(t, 0.4, { freq: 1.1, damp: 0.5 }); const op = clamp(sp) * 0.9; g.fillStyle = '#2a3446'; g.fillRect(W * 0.38 - 12, r.GY - 520, 424, 520); g.fillStyle = '#ffe8c0'; g.fillRect(W * 0.38, r.GY - 510, 400, 510); g.save(); g.translate(W * 0.38, 0); g.scale(1 - op, 1); g.fillStyle = alpha('#9ac0e0', 0.85); g.fillRect(0, r.GY - 510, 400, 510); rr(g, 330, r.GY - 300, 20, 90, 8); g.fillStyle = '#c8ccd2'; g.fill(); g.restore(); you(g, { x: W * 0.48, y: r.GY, t, inv: 0.96, s: 1.6, rimC: '#fff', pose: idle('reach', t), expr: 'nervous' }); }); UI.tag(g, t, 'PUSH', W * 0.48, H * 0.2, { start: 0.2, size: 34 }); }
  else { const cam = camAdd({ z: 1.0 }, drift(t, 3, 2)); blurLayer(g, 8, (g) => L.shop(g, t, cam, {})); g.fillStyle = alpha('#dff0ff', 0.35); g.fillRect(0, 0, W, H); for (let i = 0; i < 9; i++) { const R = rng(i + 3); L.fingerprint(g, W * (0.15 + R() * 0.7), H * (0.15 + R() * 0.7), 50 + R() * 30, clamp((t - 0.2 - i * 0.25) * 3), 'rgba(40,50,80,.7)'); } }
  if (p.tag) UI.tag(g, t, p.tag, W * 0.5, H * 0.1, { start: 0.3 });
};

T.tagsYou = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const r = G.studio(g, t, cam, { mood: p.mood || 'data', spot: 0.16 });
  layer(g, cam, 1, (g) => { you(g, { x: W * 0.5, y: r.GY, t, inv: 0.95, s: 1.8, expr: exprAt(t, p.expr || [[0, 'sad']]), look: [0, 0.4], pose: idle(p.pose || 'stand', t), rimC: '#fff' }); if (p.shiver) { /* teeth chatter lines */ for (const s of [-1, 1]) seg(g, [[W * 0.5 + s * 170, r.GY - 420 + Math.sin(t * 30) * 4], [W * 0.5 + s * 200, r.GY - 440]], 5, alpha('#cfe8ff', 0.7)); } });
  const pos = [[0.2, 0.3], [0.8, 0.3], [0.2, 0.55], [0.8, 0.55], [0.2, 0.78], [0.8, 0.78]];
  (p.tags || []).forEach(([s, w], i) => UI.tag(g, t, s, W * pos[i][0], H * pos[i][1], { start: lw(info, w, 0.3 + i * 0.6), size: 36 }));
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.12, { start: lw(info, p.ktW || '', 0.3), mode: p.ktMode || 'rise', size: p.ktSize || 76, color: p.ktColor || '#ffffff' });
};

T.busStop = (g, t, info, p) => {
  const cam = cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.07 }); const r = G.street(g, t, cam, { mood: p.mood || 'day', lamp: false, dof: 4 });
  layer(g, cam, 1, (g) => { L.busShelter(g, W * 0.58, r.GY - 46, 1);
    const sc = p.scream ? lw(info, 'screams', 0.3) : 99, run = p.scream ? ease.in(prog(t, sc + 0.6, sc + 1.6)) : 0, gone = p.empty;
    if (!gone) { const wx = W * 0.62 + run * W * 0.6; person(g, { x: wx, y: r.GY - 46, t, s: 1.45, outfit: L.WOMAN, facing: run > 0 ? 1 : -1, pose: run > 0 ? gWalk(t * 9, { run: true }) : idle(t > sc ? 'scared' : p.startle ? 'stand' : 'phone', t), prop: t < sc && !p.startle ? 'phone' : null, turn: run > 0 ? 0.85 : 0.2, expr: t > sc ? 'scared' : p.startle ? 'surprised' : 'calm', look: p.startle ? [-1, 0] : [0, 0.6], rimC: r.M.rim, talk: t > sc && run < 0.5 ? 0.8 : 0 });
      if (t > sc + 0.3 || p.bags) { const k = ease.in(prog(t, sc + 0.3, sc + 0.7)); rr(g, W * 0.6 - 20, r.GY - 46 - 120 + k * 120 - 60, 70, 80, 10); g.fillStyle = '#e8d8b8'; g.fill(); circle(g, W * 0.6 + 30, r.GY - 46 - 60 + k * 120 - 70 + 30, 20, '#e86a5a'); circle(g, W * 0.6 + 70, r.GY - 46 + k * 30 - 30, 18, '#f2c14a'); } }
    you(g, { x: W * 0.36 + (p.approach ? ease.out(prog(t, 0.2, 2.5)) * W * 0.12 : p.near ? W * 0.12 : 0), y: r.GY - 30, t, inv: 0.95, s: 1.45, pose: p.approach ? gWalk(t * 5.4 * (1 - prog(t, 2.2, 2.5))) : idle(p.pose || 'stand', t), turn: p.approach ? 0.6 : 0.2, expr: exprAt(t, p.expr || [[0, 'worried']]), look: [1, 0], rimC: r.M.rim, shiver: 1 });
    if (p.voice) (p.voice).forEach(([s, w], i) => UI.bubble(g, W * 0.5, H * 0.2, { str: s, w: s.length * 22 + 80, h: 90, t, start: lw(info, w, 0.3 + i), end: i < p.voice.length - 1 ? lw(info, p.voice[i + 1][1], 9) : null, size: 36, tail: [-40, 60] }));
  });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
};

T.earClose = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: 40 }, drift(t, 5, 5)); blurLayer(g, 7, (g) => { const r = G.street(g, t, cam, { mood: 'day' }); layer(g, cam, 1, (g) => L.busShelter(g, W * 0.58, r.GY - 46, 1)); });
  const flip = p.ex === 'scared'; bigGlow(g, W * 0.6, H * 0.64, 250, { outfit: p.outfit || L.WOMAN, expr: p.ex || 'surprised', look: [-1, 0], blink: blinkAt(t, 3), rim: { color: '#fff4e0' }, rimSide: -1, turn: 0.3, talk: flip ? 0.7 : 0 });
  for (let i = 0; i < 3; i++) { const k = ((t * 0.9 + i / 3) % 1); g.save(); g.strokeStyle = alpha('#ffffff', 0.8 * (1 - k)); g.lineWidth = 6; g.beginPath(); g.arc(W * 0.24, H * 0.5, 40 + k * 140, -0.6, 0.6); g.stroke(); g.restore(); }
  if (p.bub) UI.bubble(g, W * 0.22, H * 0.26, { str: p.bub, w: p.bub.length * 22 + 80, h: 90, t, start: 0.2, size: 34, tail: [40, 60] });
  if (p.tag) UI.tag(g, t, p.tag, W * 0.24, H * 0.72, { start: lw(info, p.tagW || '', 0.6), size: 30 });
};

T.lineup = (g, t, info, p) => { // police officer / doctor / best friend each recoiling
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); const r = G.street(g, t, cam, { mood: 'day', dof: 4 });
  const who = [[L.COP, 'officer'], [L.DOC, 'doctor'], [L.FRIEND, 'friend']];
  layer(g, cam, 1, (g) => { you(g, { x: W * 0.14, y: r.GY + 30, t, inv: 0.95, s: 1.5, expr: 'worried', look: [1, 0], rimC: r.M.rim, pose: idle('give', t) });
    who.forEach(([o, w], i) => { if (i >= (p.n ?? 3)) return; const s0 = lw(info, w, 0.2 + i * 0.7); if (t < s0 - 0.05 && i > 0) return; const sc = t > s0 + 0.5; person(g, { x: W * (0.42 + i * 0.2), y: r.GY + 30, t, s: 1.5, outfit: o, facing: -1, seed: i, pose: idle(sc ? 'scared' : 'stand', t), expr: sc ? 'scared' : 'calm', look: [-1, 0], rimC: r.M.rim, alpha: clamp((t - s0 + 0.1) * 5) }); UI.tag(g, t, ['POLICE OFFICER', 'DOCTOR', 'BEST FRIEND'][i], W * (0.42 + i * 0.2), H * 0.12, { start: s0, size: 26 }); }); });
};

T.trust = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const r = G.street(g, t, cam, { mood: p.mood || 'park', lamp: false, dof: 5 });
  layer(g, cam, 1, (g) => { L.busShelter(g, W * 0.58, r.GY - 46, 1); you(g, { x: W * 0.5, y: r.GY - 30, t, inv: 0.95, s: 1.5, pose: idle(p.sit ? 'sitFront' : 'stand', t), expr: 'sad', look: [0, 0.6], rimC: r.M.rim }); });
  if (p.meter) { const s0 = lw(info, 'trust', 0.6), v = lerp(0.9, 0.04, ease.inOut(prog(t, s0, s0 + 1.4))); UI.meterBar(g, t, { label: 'TRUST', v, x: W * 0.12, y: H * 0.14, w: W * 0.32, start: 0.2, color: v < 0.3 ? '#ff6a5c' : S_gold() }); }
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.4), mode: 'rise', size: 76 });
};
const S_gold = () => '#ffad45';

T.parkBench = (g, t, info, p) => {
  const moodName = p.mood || 'park'; const cam = cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.08 }); const r = G.park(g, t, cam, { mood: moodName });
  if (p.timelapse) veil(g, '#1a1a40', 0.5 * ease.inOut(prog(t, 0.2, info.dur)));
  layer(g, cam, 1, (g) => { const x = r.benchX - 60; you(g, { x, y: r.GY, t, inv: 0.95, s: 1.35, pose: idle(p.phone ? 'sitPhone' : 'sitFront', t), expr: exprAt(t, p.expr || [[0, 'sad']]), look: p.phone ? [0.4, 0.8] : [0.3, 0.2], rimC: r.M.rim, shiver: 1 });
    if (p.phone) { const k = p.lift ? ease.out(prog(t, 0.3, 1.3)) : 1; L.phoneProp(g, x + 70, lerp(r.GY + 10, r.seatY - 120, k), 0.9, 0.7); }
    if (p.hidden) { L.phoneProp(g, r.benchX + 40, r.GY - 14, 0.6, 0.2); UI.arrow(g, t, [r.benchX + 260, r.GY - 200], [r.benchX + 70, r.GY - 40], { start: 0.6 }); }
    for (const s of [-1, 1]) seg(g, [[x + s * 80, r.seatY - 300 + Math.sin(t * 30) * 3], [x + s * 100, r.seatY - 316]], 4, alpha('#ffffff', 0.5)); });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.8, H * 0.14, { start: lw(info, p.pillW || '', 0.5) });
};

const chatBubble = (g, x, y, w, s, mine, a) => { if (a <= 0) return; g.save(); g.globalAlpha *= a; rr(g, x, y, w, 46, 18); g.fillStyle = mine ? '#4a8af2' : '#e2e4ea'; g.fill(); text(g, s, x + 16, y + 24, { size: 19, font: FONTS.ui, weight: 800, color: mine ? '#fff' : '#2a2a34', align: 'left' }); g.restore(); };
T.phone = (g, t, info, p) => {
  const cam = camAdd({ z: 1.08 }, drift(t, 4, 3)); blurLayer(g, 8, (g) => (p.bg === 'home' ? L.room(g, t, cam, { mood: 'home', night: true, lamp: 1 }) : G.park(g, t, cam, {}))); veil(g, '#101428', 0.25);
  const k = spring(t, 0.05, { freq: 1.2, damp: 0.7 }); const cy = H * 0.52 + (1 - k) * 80;
  L.bigPhone(g, W * 0.5, cy, H * 0.88, (g, x, y, w, h) => {
    g.fillStyle = '#1e2236'; g.fillRect(x, y, w, h); text(g, p.time || '3:00 PM', x + w / 2, y + 80, { size: 38, font: FONTS.sans, weight: 700, color: '#ffffff' });
    const m = p.mode;
    if (m === 'missing') { text(g, 'Last seen', x + w / 2, y + 170, { size: 22, font: FONTS.ui, weight: 800, color: '#8e97b4' }); text(g, '7:12 AM', x + w / 2, y + 220, { size: 52, font: FONTS.sans, weight: 800, color: '#ffad45' }); }
    if (m === 'list') { [['Work', 'not checked in', 'work'], ['Messages', '0 replies', 'reply'], ['Posts', 'nothing new', 'post']].forEach(([a, b, w2], i) => { const al = clamp((t - lw(info, w2, 0.3 + i * 0.8)) * 4); g.save(); g.globalAlpha *= al; rr(g, x + 20, y + 140 + i * 110, w - 40, 90, 16); g.fillStyle = '#2c3250'; g.fill(); text(g, a, x + 44, y + 172 + i * 110, { size: 24, font: FONTS.ui, weight: 900, color: '#fff', align: 'left' }); text(g, b, x + 44, y + 206 + i * 110, { size: 19, font: FONTS.ui, weight: 800, color: '#8e97b4', align: 'left' }); text(g, '✕', x + w - 50, y + 186 + i * 110, { size: 30, font: FONTS.ui, weight: 900, color: '#ff6a5c' }); g.restore(); }); }
    if (m === 'zero') { const v = Math.round(lerp(9, 0, ease.out(prog(t, 0.2, 1.0)))); text(g, String(v), x + w / 2, y + h * 0.42, { size: 160, font: FONTS.sans, weight: 800, color: '#ffffff' }); text(g, 'new messages', x + w / 2, y + h * 0.42 + 110, { size: 30, font: FONTS.ui, weight: 900, color: '#8e97b4' }); }
    if (m === 'call') { text(g, 'Recent calls', x + w / 2, y + 160, { size: 24, font: FONTS.ui, weight: 900, color: '#8e97b4' }); text(g, 'No calls today', x + w / 2, y + 260, { size: 30, font: FONTS.ui, weight: 900, color: '#ffffff', alpha: clamp(t - 0.4) }); }
    if (m === 'chat') { text(g, 'The Group (12)', x + w / 2, y + 140, { size: 24, font: FONTS.ui, weight: 900, color: '#ffffff' }); const msgs = ['lol did you see this', 'pizza tonight?', '😂😂', 'who is coming saturday', 'new meme just dropped', 'ok see u all there', 'haha', 'send the pics!']; const off = Math.max(0, (t - 1) * 90); g.save(); g.beginPath(); g.rect(x, y + 170, w, h - 190); g.clip(); msgs.forEach((s, i) => chatBubble(g, x + 20 + (i % 3 === 2 ? 60 : 0), y + 190 + i * 62 - off + 200, w - 100, s, i % 3 === 2, clamp((t - i * 0.35) * 3))); g.restore(); }
    if (m === 'scroll') { const off = (t * 260) % 300; g.save(); g.beginPath(); g.rect(x, y + 120, w, h - 120); g.clip(); for (let i = 0; i < 6; i++) { const yy = y + 130 + i * 300 - off; rr(g, x + 16, yy, w - 32, 270, 14); g.fillStyle = '#f2f2f6'; g.fill(); blobby(g, x + w / 2, yy + 220, 1.6, ['#e88a84', '#8ac0e8', '#c8a8e8', '#f2c14a', '#8ae8a8', '#e8a8c8'][i], { shadow: false }); } g.restore(); }
    if (m === 'like') { rr(g, x + 16, y + 130, w - 32, 420, 14); g.fillStyle = '#f2f2f6'; g.fill(); blobby(g, x + w / 2, y + 470, 2.2, '#f2c14a', { wave: 1, shadow: false }); const tap = t > 0.8; L.heart(g, x + 60, y + 600, 2.4, tap ? '#ff4a6a' : '#8e97b4'); if (tap) { const k2 = spring(t, 0.8); L.heart(g, x + w / 2, y + 340, 6 * clamp(k2) * (1.4 - 0.4 * clamp(k2)), alpha('#ff4a6a', clamp(1.6 - (t - 0.8)))); } rr(g, x + w - 150, y + 580, 120, 44, 22); g.fillStyle = '#3a3e56'; g.fill(); text(g, 'CALL', x + w - 90, y + 602, { size: 18, font: FONTS.ui, weight: 900, color: '#8e97b4' }); L.strike(g, x + w - 90, y + 602, 120, ease.out(prog(t, 1.4, 1.8))); }
  });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.8, H * 0.2, { start: lw(info, p.pillW || '', 0.3) });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
};

T.dinner = (g, t, info, p) => {
  const cam = cm(t, info, { z0: p.z0 ?? 1.0, z1: p.z1 ?? 1.06, x0: p.x0 ?? -20, x1: p.x1 ?? 20 }); const flick = p.flicker ? (Math.sin(t * 23) > 0.5 && t > 0.8 ? 0.35 : 0) : 0;
  const tvOn = p.tv ? t > lw(info, 'tv', 0.4) : !!p.tvOn;
  const r = L.room(g, t, cam, { mood: 'home', night: true, window: true, windowX: W * 0.36, frame: true, frameX: W * 0.66, lamp: 1, lampX: W * 0.92, plant: false,
    extraBack: (g, M, GY) => { L.tvSet(g, W * 0.06, GY - 520, 300, 190, tvOn, t); seg(g, [[W * 0.5, -H], [W * 0.5, GY - 640]], 3, '#3a3030'); poly(g, [[W * 0.5 - 70, GY - 600], [W * 0.5 + 70, GY - 600], [W * 0.5 + 30, GY - 650], [W * 0.5 - 30, GY - 650]], '#e8c88a'); glow(g, W * 0.5, GY - 580, 400, '#ffd59a', 0.5 * (1 - flick * 2)); } });
  if (flick) veil(g, '#000', flick);
  layer(g, cam, 1, (g) => { const GY = r.GY, ty = GY - 170;
    const sitters = [[0.42, MOMk(), 1], [0.58, L.DAD, -1], [0.66, L.SIB, -1]];
    const look = p.lookUp ? t > lw(info, 'looking', 0.5) : false;
    sitters.forEach(([x, o, f], i) => { const laugh = p.laugh && i === 1 && t > lw(info, 'laughs', 0.4); const talk = (p.say === 0 && i === 0) || (p.say === 1 && i === 1); person(g, { x: W * x, y: GY, t, s: i === 2 ? 1.6 : 1.45, outfit: o, facing: f, seed: i, pose: idle(look && i === 1 ? 'wave' : 'sitFront', t), expr: look ? 'joy' : laugh ? 'happy' : talk ? 'calm' : 'content', look: look ? [1.0, -0.1] : tvOn ? [-1, -0.2] : [f, 0.3], rimC: r.M.rim, talk: talk ? 0.5 + 0.5 * Math.sin(t * 16) : 0 }); });
    rr(g, W * 0.36, ty, W * 0.36, 26, 10); g.fillStyle = '#8a5a3a'; g.fill(); seg(g, [[W * 0.38, ty + 20], [W * 0.38, GY]], 12, '#5a3a28'); seg(g, [[W * 0.7, ty + 20], [W * 0.7, GY]], 12, '#5a3a28'); for (let i = 0; i < 4; i++) { g.fillStyle = '#f2efe8'; g.beginPath(); g.ellipse(W * (0.42 + i * 0.08), ty - 4, 44, 12, 0, 0, Math.PI * 2); g.fill(); }
    // empty chair
    L.cafeTable ? 0 : 0; G.chair(g, W * 0.5, GY, 1.6, { color: '#6a4a3a' }); if (p.chairTag) UI.tag(g, t, 'YOUR CHAIR', W * 0.5, GY - 330, { start: 0.5, size: 26 });
    if (p.glass) { const x = W * 0.71, wob = Math.sin(t * 8) * 0.06; g.save(); g.translate(x, ty); g.rotate(wob); rr(g, -14, -60, 28, 60, 6); g.fillStyle = alpha('#cfe8ff', 0.7); g.fill(); g.restore(); }
    if (p.you !== false) { const yx = W * (p.youX ?? 0.86); you(g, { x: yx, y: GY, t, inv: 0.95, s: 1.5, facing: -1, expr: exprAt(t, p.expr || [[0, 'sad']]), look: [-1, 0.1], rimC: r.M.rim, alpha: p.youA ?? 1, pose: idle(p.youPose || 'stand', t), talk: p.whisper ? 0.4 : 0 }); if (p.whisper) UI.bubble(g, yx - 90, GY - 470, { str: '…', w: 120, h: 70, t, start: 0.2, tail: [30, 40] }); }
  });
  if (p.bub) UI.bubble(g, W * p.bub[2], H * 0.26, { str: p.bub[0], w: p.bub[0].length * 22 + 80, h: 90, t, start: lw(info, p.bub[1], 0.3), size: 34, tail: [0, 60] });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
  if (p.pill) UI.pill(g, t, p.pill, W * 0.84, H * 0.14, { start: lw(info, p.pillW || '', 0.5) });
};
const MOMk = () => L.MOM;

T.busRide = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const v = p.v || 'bus'; let r;
  if (v === 'bus') r = L.busInterior(g, t, cam, {}); else if (v === 'store') r = L.shop(g, t, cam, {}); else r = L.lockers(g, t, cam, {});
  layer(g, cam, 1, (g) => { const GY = r.GY; const xs = [0.18, 0.38, 0.62, 0.82];
    xs.forEach((x, i) => { if (v === 'bus' && i !== 1) L.seatRow(g, W * x, GY, 1.2); if (i === 1) person(g, { x: W * x, y: GY, t, s: 1.5, outfit: L.YOU, expr: 'calm', look: [0.4, 0], rimC: '#fff4e0', pose: idle('stand', t), seed: 9 }); else person(g, { x: W * x, y: GY, t, s: 1.45, outfit: L.CROWD[(i * 3 + 1) % 10], seed: i, facing: i < 1 ? 1 : -1, pose: idle(v === 'bus' ? 'sitPhone' : 'phone', t), prop: 'phone', expr: 'bored', look: [0, 0.8], rimC: '#fff4e0' }); }); });
  UI.tag(g, t, p.label || 'YESTERDAY', W * 0.5, H * 0.08, { start: 0.1 });
};

T.bigVisible = (g, t, info, p) => {
  const cam = camAdd({ z: 1.1, x: -40, y: -40 }, drift(t, 5, 5)); blurLayer(g, 8, (g) => G.street(g, t, cam, { mood: p.mood || 'park' })); veil(g, '#101428', 0.1);
  const inv = p.fade ? ease.inOut(prog(t, 0.6, info.dur - 0.2)) * 0.85 : 0;
  g.save(); g.globalAlpha = 1 - inv; bigGlow(g, W * (p.cx ?? 0.5), H * 0.64, 250, { outfit: L.YOU, expr: exprAt(t, p.expr || [[0, 'calm']]), look: p.look || [0, 0], blink: blinkAt(t, 3.3), rim: { color: '#fff4e0' }, rimSide: -1, turn: 0.1 }); g.restore();
  if (p.nameTag) { const k = spring(t, 0.4, { freq: 1.4, damp: 0.6 }); g.save(); g.translate(W * 0.5, H * 0.92); g.rotate(-0.05); g.scale(k, k); rr(g, -200, -80, 400, 150, 14); g.fillStyle = '#e84a4a'; g.fill(); text(g, 'HELLO, MY NAME IS', 0, -50, { size: 26, font: FONTS.sans, weight: 800, color: '#fff' }); rr(g, -180, -24, 360, 80, 8); g.fillStyle = '#ffffff'; g.fill(); seg(g, [[-120, 30], [120, 30]], 4, '#c8c8d0'); g.restore(); }
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.3), mode: p.ktMode || 'rise', size: p.ktSize || 80, font: p.serif ? FONTS.serif : undefined, weight: p.serif ? 900 : undefined });
  if (p.pill) UI.countPill(g, t, { from: 10, to: 0, suffix: ' people', start: lw(info, p.pillW || 'how', 0.4), dur: 1.4, x: W * 0.8, y: H * 0.16 });
};

T.party = (g, t, info, p) => { // a room full of people; you alone in the middle (visible, fading)
  const cam = cm(t, info, { z0: 1.0, z1: p.z1 ?? 1.08 }); const r = L.room(g, t, cam, { mood: 'home', night: true, lamp: 1, frame: true, plant: true, window: true, windowX: W * 0.4 });
  const fade = p.fadeAll ? ease.inOut(prog(t, 1.0, info.dur - 0.4)) * 0.9 : 0;
  layer(g, cam, 1, (g) => { const xs = [0.08, 0.2, 0.32, 0.68, 0.8, 0.92]; xs.forEach((x, i) => person(g, { x: W * x, y: r.GY + (i % 2) * 30, t, s: 1.35, seed: i, outfit: L.CROWD[(i * 3) % 10], facing: x < 0.5 ? (i % 2 ? 1 : -1) : (i % 2 ? -1 : 1), pose: idle(p.phones ? 'phone' : i % 3 ? 'holdFront' : 'shrug', t), prop: p.phones ? 'phone' : i % 3 ? 'mug' : null, expr: p.phones ? 'bored' : 'happy', look: p.phones ? [0, 0.8] : [x < 0.5 ? 1 : -1, 0], rimC: r.M.rim, invisible: fade, edgeColor: '#ffe6c0', talk: !p.phones && i % 2 ? 0.4 : 0 }));
    if (p.you !== false) { const yinv = p.youFade ? ease.inOut(prog(t, 0.6, info.dur - 0.3)) * 0.94 : 0; G.lightPool(g, W * 0.5, r.GY, 300, '#ffe2b0', 0.25, 0.3); person(g, { x: W * 0.5, y: r.GY + 20, t, s: 1.5, outfit: L.YOU, expr: 'sad', look: [0, 0.4], rimC: r.M.rim, invisible: yinv, edgeColor: '#eef8ff', seed: 9 }); } });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.12, { start: lw(info, p.ktW || '', 0.4), mode: 'rise', size: 72 });
};

T.talkPair = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = p.set === 'office' ? G.kitchen(g, t, cam, { menu: { title: 'MENU', rows: [['TEA', '1'], ['COFFEE', '2']] } }) : G.street(g, t, cam, { mood: 'day', dof: 4 });
  layer(g, cam, 1, (g) => { const GY = r.GY; person(g, { x: W * 0.36, y: GY, t, s: 1.6, outfit: p.a || L.C.mustard, facing: 1, expr: p.ea || 'calm', look: [1, 0], rimC: r.M.rim, seed: 1, talk: p.speaker === 0 ? 0.6 + 0.4 * Math.sin(t * 15) : 0 }); person(g, { x: W * 0.62, y: GY, t, s: 1.6, outfit: p.b || L.C.slate, facing: -1, expr: p.eb || 'bored', look: p.bLookDown ? [0, 0.9] : [-1, 0], pose: idle(p.bPhone ? 'phone' : 'stand', t), prop: p.bPhone ? 'phone' : null, rimC: r.M.rim, seed: 2, talk: p.speaker === 1 ? 0.6 + 0.4 * Math.sin(t * 15) : 0 }); });
  if (p.bub) UI.bubble(g, W * (p.speaker === 0 ? 0.32 : 0.68), H * 0.18, { str: p.bub, w: p.bub.length * 26 + 90, h: 96, t, start: lw(info, p.bubW || '', 0.4), size: 40, tail: [p.speaker === 0 ? 30 : -30, 60] });
  if (p.bub2) UI.bubble(g, W * 0.32, H * 0.18, { str: p.bub2, w: p.bub2.length * 22 + 90, h: 90, t, start: 0.2, size: 32, tail: [30, 60] });
};

T.crowdPhones = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.1 }); const r = G.street(g, t, cam, { mood: p.mood || 'park', dof: 4 });
  const fade = p.fade ? ease.inOut(prog(t, 1.0, info.dur - 0.2)) * 0.92 : 0;
  layer(g, cam, 1, (g) => { for (let row = 0; row < 2; row++) for (let i = 0; i < 7; i++) { const x = W * (0.06 + i * 0.145 + row * 0.07), y = r.GY + row * 70 - 30; person(g, { x, y, t, s: 1.15 + row * 0.2, outfit: L.CROWD[(i * 3 + row * 5) % 10], seed: i + row * 7, facing: i % 2 ? 1 : -1, pose: idle('phone', t), prop: 'phone', expr: 'bored', look: [0, 0.8], rimC: r.M.rim, invisible: fade * (0.6 + 0.4 * ((i + row) % 3) / 2), edgeColor: '#ffe6d8', dim: row ? 0 : 0.3 }); if (!fade) glow(g, x + 20, y - 300 * (1.15 + row * 0.2) / 1.5, 60, '#9ac0ff', 0.2); } });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.12, { start: lw(info, p.ktW || '', 0.4), mode: 'rise', size: 70 });
};

T.greek = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.08 }); const r = L.greek(g, t, cam, { temple: true });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) L.sheep(g, W * (0.55 + i * 0.1), r.GY - 10 + (i % 2) * 30, 1.1, t + i); person(g, { x: W * 0.3, y: r.GY, t, s: 1.6, outfit: L.SHEP, facing: 1, expr: 'calm', look: [1, 0.2], pose: idle('holdFront', t), rimC: r.M.rim }); seg(g, [[W * 0.3 + 70, r.GY], [W * 0.3 + 80, r.GY - 420]], 8, '#6a4a2a'); });
  UI.pill(g, t, '≈ 2,400 YEARS AGO', W * 0.76, H * 0.12, { start: lw(info, '2400', 0.6), size: 38 }); UI.cite(g, 'Plato, Republic, Book II', { t, start: lw(info, 'plato', 1.5) });
  if (p.chapter) UI.chapter(g, t, { num: p.chapter, title: p.chTitle || '', start: 0.2, dur: info.dur - 0.2 });
};

T.cave = (g, t, info, p) => {
  const cam = p.close ? camAdd(camPath(t, [[0, { z: 1.4, y: 160 }], [info.dur, { z: 1.6, y: 180 }]]), drift(t, 3, 2)) : cm(t, info, { z0: 1.0, z1: 1.1 }); const r = L.cave(g, t, cam, {});
  const inv = p.vanish ? ease.inOut(prog(t, lw(info, 'invisible', 1.4), lw(info, 'invisible', 1.4) + 1.0)) * 0.94 : 0;
  layer(g, cam, 1, (g) => { const turn = p.vanish ? prog(t, 0.4, 1.4) : 0; person(g, { x: W * 0.46, y: r.GY, t, s: 1.6, outfit: L.SHEP, facing: 1, expr: inv > 0.5 ? 'awe' : 'awe', look: [0.6, 0.4], pose: idle(p.vanish ? 'holdUp' : 'crouch', t), rimC: '#ffd27a', invisible: inv, edgeColor: '#ffe2a0' });
    if (!p.vanish) L.ringGold(g, W * 0.56, r.GY - 20, 22, t); else { const hx = W * 0.46 + 70, hy = r.GY - 330; L.ringGold(g, hx, hy, 14 + 4 * Math.sin(turn * 10), t); } });
};

T.palace = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.08 }); const r = L.palace(g, t, cam, {});
  const tq = lw(info, 'seduces', 1.0), tk = lw(info, 'kills', 2.4), tt = lw(info, 'throne', 4.0);
  layer(g, cam, 1, (g) => { const kingGone = ease.in(prog(t, tk + 0.2, tk + 0.9));
    person(g, { x: W * 0.3, y: r.GY, t, s: 1.5, outfit: L.QUEEN, facing: 1, expr: t > tq ? 'love' : 'calm', look: [1, 0], rimC: '#ffd59a', seed: 1 });
    if (kingGone < 1) person(g, { x: W * 0.5, y: r.GY, t, s: 1.55, outfit: L.KING, facing: -1, pose: idle(t > tk ? 'scared' : 'sitFront', t), expr: t > tk ? 'shocked' : 'bored', rimC: '#ffd59a', alpha: 1 - kingGone, seed: 2 });
    const sx = t > tt ? W * 0.5 : lerp(W * 0.86, W * 0.62, ease.inOut(prog(t, 0, tq)));
    drawGlow(g, { x: sx, y: r.GY, s: 1.55, outfit: { ...L.SHEP, hat: t > tt ? 'crown' : undefined, hatColor: '#f2c14a' }, facing: -1, invisible: t > tt ? 0.5 : 0.94, edgeColor: '#ffe2a0', expr: 'sly', look: [-1, 0], pose: idle(t > tt ? 'sitFront' : 'stand', t), rim: { color: '#ffd59a', dir: [-0.6, -0.8] }, blink: blinkAt(t, 3) }); });
  [['PALACE', 'palace'], ['QUEEN', 'queen'], ['KING', 'king'], ['THRONE', 'throne']].forEach(([s, w], i) => UI.tag(g, t, s, W * (0.2 + i * 0.2), H * 0.08, { start: lw(info, w, 0.3 + i * 1.2), size: 26 }));
};

T.plato = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.02, z1: 1.08 }); const r = L.greek(g, t, cam, { temple: true });
  layer(g, cam, 1, (g) => { person(g, { x: W * 0.32, y: r.GY, t, s: 1.7, outfit: L.PLATO, facing: 1, expr: 'thinking', look: [1, -0.3], pose: idle('pointUp', t), prop: 'paper', rimC: r.M.rim }); });
  UI.tag(g, t, 'PLATO', W * 0.32, H * 0.12, { start: 0.3 });
  if (p.bub) UI.bubble(g, W * 0.66, H * 0.3, { str: '?', w: 160, h: 130, t, start: lw(info, 'question', 0.8), size: 80, tail: [-80, 60], thought: true });
};

T.bigQuestion = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); blurLayer(g, 8, (g) => (p.set === 'kitchen' ? G.kitchen(g, t, cam, { menu: { title: 'HONESTY BOX', rows: [['TEA', '30p'], ['COFFEE', '50p']], img: eyesPoster } }) : L.palace(g, t, cam, {}))); veil(g, '#0a0c18', 0.45);
  (p.lines || []).forEach(([s, w, y], i) => kText(g, t, s, W * 0.5, H * y, { start: lw(info, w, 0.3 + i * 1.2), mode: 'rise', size: p.size || 60, font: FONTS.serif, weight: 900, color: '#ffffff' }));
  if (p.eyes) { const k = spring(t, lw(info, 'watching', 1.5), { freq: 1.3, damp: 0.6 }); g.save(); g.globalAlpha *= clamp(k); for (const dx of [-90, 90]) { g.fillStyle = '#f4f1ea'; g.beginPath(); g.ellipse(W * 0.5 + dx, H * 0.7, 46 * k, 70 * k, 0, 0, Math.PI * 2); g.fill(); circle(g, W * 0.5 + dx + 10, H * 0.72, 18 * k, '#1a1a22'); } g.restore(); }
};
const eyesPoster = (g, x, y, w, h) => { g.fillStyle = '#2e3452'; g.fillRect(x, y, w, h); for (const dx of [-0.17, 0.17]) { g.fillStyle = '#f2efe8'; g.beginPath(); g.ellipse(x + w * (0.5 + dx), y + h * 0.5, w * 0.08, h * 0.22, 0, 0, Math.PI * 2); g.fill(); } };

T.alone = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.1 }); const r = L.room(g, t, cam, { mood: 'home', night: true, window: true, windowX: W * 0.42, frame: false, plant: false, lamp: p.lamp ?? 0 });
  layer(g, cam, 1, (g) => { G.lightPool(g, W * 0.5, r.GY, 420, '#dfe6ff', 0.3, 0.3); you(g, { x: W * 0.5, y: r.GY + 20, t, inv: p.inv ?? 0.94, s: 1.6, expr: exprAt(t, p.expr || [[0, 'calm']]), look: [0, 0.2], pose: idle(p.pose || 'stand', t), rimC: '#dfe6ff' }); });
  (p.tags || []).forEach(([s, w, x, y], i) => { const s0 = lw(info, w, 0.3 + i * 0.7); UI.tag(g, t, s, W * x, H * y, { start: s0, size: 34 }); if (p.strike) L.strike(g, W * x, H * y, s.length * 26 + 50, ease.out(prog(t, s0 + 0.4, s0 + 0.8))); });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.4), mode: p.ktMode || 'rise', size: 76 });
};

T.doors = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.06 }); const r = G.studio(g, t, cam, { mood: 'data', spot: 0.1 });
  layer(g, cam, 1, (g) => { const GY = r.GY; L.doorway(g, W * 0.18, GY, 220, 460, 0.05, '#2a2e44', '#3a4a7a'); L.doorway(g, W * 0.68, GY, 220, 460, p.openRight ? ease.out(prog(t, 0.5, 1.5)) : 0.15, '#8a5a3a', '#ffd59a'); you(g, { x: W * 0.5, y: GY + 10, t, inv: 0.94, s: 1.6, expr: 'thinking', look: [p.lookR ? 1 : Math.sin(t * 1.2), 0], rimC: '#fff' }); });
  UI.tag(g, t, 'STAY INVISIBLE', W * 0.24, H * 0.12, { start: lw(info, 'invisible', 0.5), size: 30 }); UI.tag(g, t, 'BE SEEN AGAIN', W * 0.74, H * 0.12, { start: lw(info, 'seen', 1.5), size: 30 });
  if (p.meter) { const s0 = lw(info, p.meterW || '', 0.4); UI.meterBar(g, t, { label: p.meter, v: p.v, x: W * 0.3, y: H * 0.88, w: W * 0.4, start: s0, color: p.v > 0.5 ? '#9ac0f2' : '#ff6a5c' }); }
};

T.recap = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.05 }); G.studio(g, t, cam, { mood: 'data', spot: 0.1 });
  const icons = p.icons || [];
  icons.forEach(([s, w], i) => { const s0 = lw(info, w, 0.3 + i * 0.6), k = spring(t, s0, { freq: 1.4, damp: 0.6 }); if (t < s0) return; const n = icons.length, x = W * ((i + 0.5) / n), y = H * 0.48; g.save(); g.translate(x, y); g.scale(k, k); circle(g, 0, 0, 120, alpha('#2a3256', 0.95)); ring(g, 0, 0, 120, 3, alpha('#ffad45', 0.6)); drawIcon(g, s, t); text(g, s, 0, 180, { size: 30, font: FONTS.sans, weight: 800, color: '#fff6e8', spacing: 3 }); g.restore(); });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.3), mode: 'rise', size: 70 });
};
function drawIcon(g, s, t) {
  if (s === 'BLIND') { g.fillStyle = '#f2efe8'; g.beginPath(); g.ellipse(0, 0, 70, 40, 0, 0, Math.PI * 2); g.fill(); circle(g, 0, 0, 26, '#3a4a7a'); seg(g, [[-70, -50], [70, 50]], 10, '#ff6a5c'); }
  else if (s === 'NAKED' || s === 'FREEZING') { drawGlow(g, { x: 0, y: 80, s: 0.48, outfit: L.YOU, invisible: 0.95, edgeColor: s === 'FREEZING' ? '#9ad8ff' : '#ffffff', rim: false, expr: s === 'FREEZING' ? 'sad' : 'nervous' }); if (s === 'FREEZING') for (let i = 0; i < 6; i++) circle(g, -60 + i * 24, -70 + (i % 2) * 30, 5, '#ffffff'); }
  else if (s === 'THERMAL') { const gr = g.createRadialGradient(0, 0, 4, 0, 0, 80); gr.addColorStop(0, '#ffffa0'); gr.addColorStop(0.4, '#ff8a20'); gr.addColorStop(1, 'rgba(160,30,120,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, 10, 40, 70, 0, 0, Math.PI * 2); g.fill(); }
  else if (s === 'DOGS') L.dog(g, -20, 60, 0.7, { t, bark: Math.sin(t * 9) > 0 ? 1 : 0 });
  else if (s === 'LUNCH') { L.croissant(g, 0, 0, 1.1); }
  else if (s === 'VOICE') { for (let i = 0; i < 3; i++) { g.strokeStyle = '#ffffff'; g.lineWidth = 8; g.beginPath(); g.arc(-40, 0, 30 + i * 26, -0.7, 0.7); g.stroke(); } }
  else if (s === 'TRACKED') { L.footprint(g, -25, 20, 1.6, 1, false, '#e8d8c8'); L.footprint(g, 25, -20, 1.6, 1, true, '#e8d8c8'); }
}

T.endCard = (g, t, info, p) => {
  const cam = cm(t, info, { z0: 1.0, z1: 1.1 }); const r = G.street(g, t, cam, { mood: 'rainy', dof: 4 });
  layer(g, cam, 1, (g) => { you(g, { x: W * 0.5, y: r.GY + 30, t, inv: 0.95, s: 1.5, expr: 'sad', look: [0, 0.2], rimC: r.M.rim, alpha: 1 - ease.inOut(prog(t, 2.5, info.dur - 0.6)) * 0.7 }); });
  if (p.card) UI.endCard(g, t, { question: p.card, start: p.cardT ?? 1.0, cta: 'SUBSCRIBE' });
  if (p.kt) kText(g, t, p.kt, W * 0.5, H * 0.14, { start: lw(info, p.ktW || '', 0.3), mode: 'rise', size: 64 });
};
