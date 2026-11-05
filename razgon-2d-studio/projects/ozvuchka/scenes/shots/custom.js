// custom.js — hand-built shots: hook fist, maps, split view, family tree, Rome, end card.
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, backdrop, text, FX, UI, kText, drawFigure, POSES, bigFace, breathe, walkPose, wordTime, camPath, drift, camAdd, drawSpec, WHO, GYf } from '../_lib.js';
import { TEMU, BORTE, JAMUKA, HOELUN, TOGRUL, SORGAN, KHASAR } from '../cast.js';

// ---------- 001: baby fist with blood clot, then pull back to freezing midwives
export function fistShot(g, t, info) {
  const split = 2.7;
  if (t < split) {
    const M = mood('interiorWarm');
    blurLayer(g, 16, (g) => { backdrop(g, [shade(M.wall, -0.5), shade(M.wall, -0.3), shade(M.dark, -0.2)]); glow(g, E.W * 0.78, E.H * 0.3, 600, M.key, 0.35); });
    veil(g, '#120a10', 0.35);
    const k = ease.out(prog(t, 0, 2.6)), cx = E.W / 2 + 80 - 60 * k, cy = E.H * 0.52, s = V(1.9, 1.6) * (1 + 0.1 * k), ink = S().ink;
    g.save(); g.translate(cx, cy); g.scale(s, s);
    g.fillStyle = '#d8a890'; g.beginPath(); g.ellipse(0, 0, 150, 130, 0.2, 0, 7); g.fill();               // baby fist
    for (let i = 0; i < 4; i++) { g.fillStyle = '#c99a80'; g.beginPath(); g.ellipse(-60 + i * 40, -90 + Math.abs(i - 1.5) * 8, 28, 34, 0, 0, 7); g.fill(); }
    g.fillStyle = '#e8bca4'; g.beginPath(); g.ellipse(-110, 20, 38, 60, 0.5, 0, 7); g.fill();
    // blood clot glowing between the fingers
    const pulse = 0.8 + 0.2 * Math.sin(t * 5); glow(g, 20, 30, 150 * pulse, '#d01818', 0.55);
    g.fillStyle = '#7a0c10'; g.beginPath(); g.ellipse(20, 50, 46 * pulse, 34 * pulse, 0.3, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,120,110,.5)'; g.beginPath(); g.ellipse(8, 40, 14, 8, 0.3, 0, 7); g.fill();
    g.restore(); void ink;
    FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
  } else {
    const tt = t - split;
    drawSpec(g, tt, { ...info, dur: info.dur - split }, { set: 'ger', cam: 'pull', a: [
      ['fig', 'hoelun', .5, { s: 1.5, pose: 'lie', rot: -Math.PI / 2, dy: -10, expr: 'happy' }],
      ['fig', 'x', .24, { s: 1.9, pose: 'handsOnHead', expr: 'shocked', f: 1 }],
      ['fig', 'x', .78, { s: 1.9, pose: 'handsOnHead', expr: 'shocked', f: -1 }]], fx: ['dust', 'rays'] }, 1);
    const f = 1 - prog(tt, 0, 0.35); if (f > 0) { g.save(); g.fillStyle = `rgba(14,8,10,${f})`; g.fillRect(0, 0, E.W, E.H); g.restore(); }
  }
}

// ---------- map helpers
const EURASIA = [[.06,.52],[.08,.42],[.12,.38],[.1,.33],[.16,.28],[.22,.27],[.28,.24],[.36,.22],[.46,.2],[.58,.19],[.7,.2],[.82,.21],[.92,.25],[.96,.32],[.93,.4],[.9,.46],[.94,.52],[.88,.58],[.84,.66],[.78,.72],[.72,.7],[.68,.64],[.64,.72],[.6,.78],[.56,.7],[.5,.62],[.44,.6],[.38,.66],[.34,.62],[.3,.56],[.26,.6],[.22,.55],[.16,.58],[.1,.58]];
const MX = (u) => (0.04 + u * 0.92) * E.W, MY = (v) => (0.14 + v * 0.74) * E.H;
function mapBase(g, t) {
  const M = mood('void'), ui = S().ui;
  g.fillStyle = M.sky[0]; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); UI.blueprint(g, { a: 0.1 });
  const path = () => { g.beginPath(); EURASIA.forEach(([u, v], i) => i ? g.lineTo(MX(u), MY(v)) : g.moveTo(MX(u), MY(v))); g.closePath(); };
  g.save(); path(); g.fillStyle = '#16233c'; g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.6); g.lineWidth = 3; g.stroke(); g.restore();
  g.fillStyle = '#0b1324'; g.beginPath(); g.ellipse(MX(.47), MY(.47), 38, 24, 0, 0, 7); g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.5); g.lineWidth = 2; g.stroke();
  return path;
}
function grow(g, path, k, t) {
  const ui = S().ui, cx = MX(.75), cy = MY(.36);
  const r = lerp(14, E.W * 0.74, ease.inOut(k));
  g.save(); path(); g.clip();
  g.fillStyle = radGrad(g, cx, cy, 0, r, [alpha(ui.gold, 0.55), alpha(ui.gold, 0.35), alpha(ui.gold, 0.0)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.strokeStyle = alpha(ui.gold, 0.9); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r * 0.82, 0, 7); g.stroke();
  g.restore();
  glow(g, cx, cy, 90 + 30 * Math.sin(t * 4), ui.gold, 0.9); circle(g, cx, cy, 9, '#fff3d0');
}
export function mapShot(g, t, info) {
  const path = mapBase(g, t), k = prog(t, 0.5, info.dur - 0.4);
  grow(g, path, k, t);
  kText(g, t, 'LARGEST LAND EMPIRE IN HISTORY', E.W / 2, E.H * 0.1, { start: Math.max(0.2, wordTime('largest', info.globalT - 0.5) - info.globalT + t), mode: 'spread', size: V(60, 54), color: S().ui.gold, glow: 24, glowColor: 'rgba(255,170,60,.6)', spacing: 5 });
}
export function empireGrow(g, t, info) {
  const path = mapBase(g, t), k = prog(t, 0.3, info.dur - 0.3), ui = S().ui;
  grow(g, path, k, t);
  const lab = (str, x, y, at) => { const st = Math.max(0.2, wordTime(at, info.globalT - 0.5) - info.globalT + t); const a = ease.out(prog(t, st, st + 0.4)); text(g, str, x, y, { size: V(40, 36), color: ui.cream, alpha: a, spacing: 4, glow: 14, glowColor: alpha(ui.cream, 0.5) }); };
  lab('PACIFIC OCEAN', E.W * 0.86, E.H * 0.72, 'Pacific'); lab('CASPIAN SEA', MX(.47), MY(.47) + 70, 'Caspian');
  const a = ease.out(prog(t, 0.4, 0.9));
  seg(g, [[MX(.75), MY(.36)], [MX(.93), MY(.4)]], 3, alpha(ui.gold, a)); seg(g, [[MX(.75), MY(.36)], [MX(.47), MY(.47)]], 3, alpha(ui.gold, a));
}
export function ancestors(g, t, info) {
  const M = mood('void'), ui = S().ui; g.fillStyle = M.sky[0]; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); UI.blueprint(g, { a: 0.08 });
  const levels = 7, k = prog(t, 0.2, info.dur - 0.5) * levels;
  for (let l = 0; l < levels; l++) {
    const n = 2 ** l, a = clamp(k - l), y = E.H * (0.18 + l * 0.11);
    for (let i = 0; i < n; i++) {
      const x = E.W * (0.05 + 0.9 * (i + 0.5) / n); const px = E.W * (0.05 + 0.9 * (Math.floor(i / 2) + 0.5) / (n / 2));
      if (l > 0) seg(g, [[px, y - E.H * 0.11], [x, y]], 2, alpha(ui.gold, 0.5 * a));
      glow(g, x, y, 20 + 4 * Math.sin(t * 3 + i), ui.gold, 0.5 * a); circle(g, x, y, Math.max(2, 9 - l), alpha('#fff3d0', a));
    }
  }
  kText(g, t, 'ANCESTOR OF MILLIONS', E.W / 2, E.H * 0.1, { start: 0.2, mode: 'rise', size: V(60, 54), color: ui.gold, glow: 22, glowColor: 'rgba(255,170,60,.6)', spacing: 5 });
}

// ---------- 082: a fly the guard-collar prevents you from brushing away
export function flyOver(g, t, info) {
  const fx = E.W * 0.5 + Math.sin(t * 3.1) * 260, fy = E.H * 0.38 + Math.sin(t * 5.3) * 70 + Math.sin(t * 17) * 8;
  for (let i = 1; i <= 6; i++) circle(g, fx - i * 8, fy + Math.sin((t - i * 0.03) * 22) * 6, 3, 'rgba(10,8,14,.35)');
  circle(g, fx, fy, 8, '#120e16'); const wf = Math.abs(Math.sin(t * 90)); g.fillStyle = 'rgba(230,240,255,.6)';
  g.beginPath(); g.ellipse(fx - 3, fy - 9, 5, 12 * wf + 1, -0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(fx + 5, fy - 9, 5, 12 * wf + 1, 0.4, 0, 7); g.fill();
}

// ---------- 185: brutal vs protective, split screen
export function divided(g, t, info) {
  const mid = E.W / 2 + Math.sin(t * 0.8) * 8;
  g.save(); g.beginPath(); g.rect(0, 0, mid, E.H); g.clip();
  const cam = { z: 1.05 + 0.02 * t / info.dur };
  const base = SETS_city(g, t, cam); FX.fog(g, GYf() - 200, 300, '#ff6a30', 0.3);
  drawFigure(g, { x: E.W * 0.2, y: base.GY, s: 1.5, facing: 1, outfit: WHO.x, pose: POSES.handsOnHead, expr: 'scared', rim: { color: '#ff9a50', dir: [0, -1] } });
  FX.dust(g, t, { count: 60, color: '#ff9a50', a: 0.4 }); g.restore();
  g.save(); g.beginPath(); g.rect(mid, 0, E.W - mid, E.H); g.clip();
  const b2 = SETS_steppe(g, t, cam);
  drawFigure(g, { x: E.W * 0.62, y: b2.GY, s: 1.5, facing: 1, outfit: WHO.merch, pose: walkPose(t * 5), expr: 'smile', rim: { color: b2.M.rim, dir: [0, -1] } });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 }); g.restore();
  seg(g, [[mid, 0], [mid, E.H]], 4, alpha(S().ui.gold, 0.9));
  UI.readout && kText(g, t, 'DESTROY', E.W * 0.25, E.H * 0.16, { start: 0.3, mode: 'slam', size: 70, color: '#ff7a5a', glow: 20 });
  kText(g, t, 'PROTECT', E.W * 0.75, E.H * 0.16, { start: 0.9, mode: 'slam', size: 70, color: S().ui.gold, glow: 20 });
}
import { city as SETS_city, steppe as _st } from '../_lib.js';
function SETS_steppe(g, t, cam) { return _st(g, t, cam, { mood: 'golden', sun: true }); }

// ---------- 204: when would you have broken? collar / Borte
export function brokenChoices(g, t, info) {
  const M = mood('void'), ui = S().ui; g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0b1020', '#1a1228']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W / 2, E.H * 0.55, 700, '#6a4a9a', 0.18);
  kText(g, t, 'WHEN WOULD YOU HAVE BROKEN?', E.W / 2, E.H * 0.12, { start: 0.1, mode: 'drop', size: V(58, 52), color: ui.gold, glow: 22, glowColor: 'rgba(255,170,60,.6)', spacing: 4 });
  const tc = Math.max(1.3, wordTime('collar', info.globalT - 0.5) - info.globalT + t - 0.1), tb = Math.max(2.8, wordTime('Borte', info.globalT - 0.5) - info.globalT + t - 0.1);
  const a1 = ease.outBack(prog(t, tc, tc + 0.45)), a2 = ease.outBack(prog(t, tb, tb + 0.45));
  g.save(); g.translate(E.W * 0.3, E.H * 0.58); g.scale(a1, a1); g.rotate(-0.08); rr(g, -190, -30, 380, 60, 12); g.fillStyle = '#7a5532'; g.fill(); g.fillStyle = 'rgba(255,220,170,.35)'; g.fillRect(-182, -24, 364, 8); g.fillStyle = '#120a10'; g.beginPath(); g.arc(0, 0, 54, 0, 7); g.fill(); g.restore();
  text(g, 'THE COLLAR', E.W * 0.3, E.H * 0.8, { size: 38, color: ui.cream, alpha: a1, spacing: 4 });
  g.save(); g.translate(E.W * 0.7, E.H * 0.58); g.scale(a2, a2); bigFace(g, 0, 20, 150, { outfit: BORTE, expr: 'sad', rimColor: '#ffb070', rimSide: -1 }); g.restore();
  text(g, 'LOSING BORTE', E.W * 0.7, E.H * 0.8, { size: 38, color: ui.cream, alpha: a2, spacing: 4 });
}

// ---------- 206: ancient Rome — the arena silhouette
export function romeShot(g, t, info) {
  const M = mood('golden'), GY = GYf(), cam = { z: 1.0 + 0.1 * t / info.dur };
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, E.W * 0.5, GY - 330, 80, '#fff3dc', M.key, 5.5); });
  layer(g, cam, 0.5, (g) => {
    const cx = E.W / 2, w = 1500, top = GY - 380, c = shade(M.wall, -0.45);
    g.fillStyle = c; g.beginPath(); g.moveTo(cx - w / 2, GY); g.lineTo(cx - w / 2 + 60, top); g.lineTo(cx + w / 2 - 60, top); g.lineTo(cx + w / 2, GY); g.closePath(); g.fill();
    for (let tier = 0; tier < 3; tier++) for (let i = 0; i < 16; i++) { const ax = cx - w / 2 + 70 + i * (w - 140) / 16 + 20, ay = top + 30 + tier * 110; g.fillStyle = shade(M.dark, -0.5); g.beginPath(); g.moveTo(ax - 22, ay + 80); g.lineTo(ax - 22, ay + 30); g.arc(ax, ay + 30, 22, Math.PI, 0); g.lineTo(ax + 22, ay + 80); g.fill(); g.fillStyle = alpha(M.practical, 0.35); g.fillRect(ax - 8, ay + 50, 16, 28); }
    for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) circle(g, cx + sx * (w * 0.3 + k * 90), top - 14, 6, shade(c, 0.1));
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.2), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY, E.W * 3, E.H); });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 }); FX.lensStreak(g, E.W / 2, E.H * 0.3, E.W * 1.2, M.key, 0.2);
  kText(g, t, 'ANCIENT ROME', E.W / 2, E.H * 0.16, { start: Math.max(0.2, wordTime('Rome', info.globalT - 0.5) - info.globalT + t - 0.1), mode: 'drop', size: V(96, 90), color: S().ui.gold, glow: 28, glowColor: 'rgba(255,140,50,.7)', spacing: 6 });
}

// ---------- 207: arena waiting + end screen
export function endCard(g, t, info) {
  UI.endScreen(g, t, { question: 'Would you have survived?', cast: [TEMU, BORTE, JAMUKA, HOELUN, TOGRUL, SORGAN, KHASAR], moodColors: ['#140e1c', '#2a1a2e', '#4a2a2a'] });
}
