// shots/01_hook.js — Act 1: bus, bakery, coffee, bus stop, the 0.1 s science, "Die Regel", title card.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, posesSpring, fg, travel, impact, kText } from '/engine/motion.js';
import { drawToon, bigToon, toonHeadPos } from '/engine/toon.js';
import { street, classroom, toonCar, toonTree, softEllipse } from '/engine/toonsets.js';
import { labelBox, sticker, counter, paperNote, toonTitle } from '/engine/toonui.js';
import { bus, baeckerei, regel, tueren } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, boardShot, hand, mark, line } from '../sets/kit.js';
import { SAM, FAHRER, KIND, EXTRAS, VERKAEUFERIN, NORMAL } from '../cast.js';

const STAR = (t, t0 = 0) => (t > t0 ? 'awe' : 'neutral');

// s001 — bus wide: Sam steps in from the left, passengers' heads turn one by one
registerShot('s001', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: -120, y: 60 }, { z: 1.3, x: -60, y: 70 }, 1);
  const { GY, CX, front } = bus(g, t, cam, { poleX: 820 });
  const k = travel(t, 0, 1.0, { accel: 0.1, brake: 0.4 }), sx = CX - 760 + 300 * k;
  layer(g, cam, 1, (g) => {
    [[-120, 0], [120, 2], [380, 3], [620, 1]].forEach(([dx, e], i) => T(g, { t, x: CX + dx, y: GY, facing: -1, outfit: EXTRAS[e], pose: breathe(POSES.stand, t, 1, i), expr: t > 0.5 + i * 0.18 ? 'awe' : 'neutral', look: t > 0.5 + i * 0.18 ? [-0.8, 0] : [0, 0], off: i }));
    T(g, { t, x: sx, y: GY, outfit: SAM, pose: t < 1 ? walkPose(t * 6) : breathe(POSES.relaxed, t), expr: 'smile' });
  });
  front(g);
} });

// s002 — two passengers chatting freeze mid-word, eyes slide to Sam
registerShot('s002', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.75, x: 60, y: 150 }, { z: 1.85, x: 110, y: 160 }, 2);
  const { GY, CX, front } = bus(g, t, cam, { poleX: -200 });
  const fr = 0.35;
  layer(g, cam, 1, (g) => {
    const a = { t, x: CX - 30, y: GY, facing: 1, outfit: EXTRAS[0], pose: t < fr ? POSES.talk : POSES.stand, expr: t < fr ? 'happy' : 'surprised', talk: t < fr ? 0.6 : 0, look: t > fr + 0.2 ? [-0.8, 0] : [0.5, 0] };
    const b = { t, x: CX + 200, y: GY, facing: -1, outfit: EXTRAS[1], pose: t < fr ? POSES.explain : POSES.stand, expr: t < fr ? 'grin' : 'surprised', talk: t < fr ? 0.5 : 0, look: t > fr + 0.25 ? [0.8, 0] : [0, 0], off: 1 };
    T(g, a); T(g, b);
    if (t > fr) { text(g, '…', CX + 90, GY - 400, { size: 70, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: 10, strokeColor: '#141418' }); }
  });
  front(g);
} });

// s003 — driver close-up: star eyes in the mirror, the indicator untouched
registerShot('s003', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bus', setOpt: { pole: false }, x: 0.4, toon: { outfit: FAHRER, expr: ex(t, 'neutral', [0.3, 'awe']), look: [0.6, -0.1] }, hit: 0.3, after: (g, x, y, r) => {
    const mx = E.W * 0.76, my = E.H * 0.22; rr(g, mx - 170, my - 70, 340, 140, 30); g.fillStyle = '#2a2d34'; g.fill(); rr(g, mx - 155, my - 56, 310, 112, 24); g.fillStyle = '#b9def3'; g.fill(); circle(g, mx + 40, my + 10, 34, '#131316'); rr(g, mx + 10, my + 40, 60, 40, 10); g.fillStyle = '#e8c04a'; g.fill();
    labelBox(g, t, 'BLINKER?', E.W * 0.76, E.H * 0.78, { start: 0.9 }); } });
} });

// s004 — the kid looks up at Sam, the scoop slides off and splats
registerShot('s004', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.8, x: 40, y: 190 }, { z: 1.9, x: 60, y: 200 }, 4);
  const { GY, CX, front } = bus(g, t, cam, { poleX: 900 });
  const drop = 1.2, fall = clamp(prog(t, drop, drop + 0.3));
  layer(g, cam, 1, (g) => {
    const kid = { t, x: CX - 140, y: GY, facing: 1, outfit: KIND, pose: { ...POSES.holdFront, hF: [26, -150], eF: [18, -128] }, expr: ex(t, 'awe', [drop + 0.3, 'surprised']), look: [0.6, -0.8] };
    T(g, kid);
    T(g, { t, x: CX + 170, y: GY, facing: -1, outfit: SAM, pose: breathe(POSES.relaxed, t), expr: 'smile', look: [-0.3, 0.4], off: 2 });
    const cx = CX - 140 + 30 * 0.74 * 1.3, cy = GY - 150 * 0.74 * 1.3;
    rr(g, cx - 8, cy - 4, 16, 40, 4); g.fillStyle = '#d9a35a'; g.fill();
    if (fall < 1) circle(g, cx + fall * 20, cy - 12 + fall * (GY - cy), 20, '#f6b8c8');
    else { g.fillStyle = '#f6b8c8'; g.beginPath(); g.ellipse(cx + 30, GY + 4, 46, 12, 0, 0, Math.PI * 2); g.fill(); }
  });
  front(g);
} });

// s005 — giant close-up of the kid staring, mouth "o"
registerShot('s005', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bus', setOpt: { pole: false }, x: 0.45, r: 240, toon: { outfit: KIND, expr: 'awe', look: [0.7, -0.5] }, push: 0.05 });
} });

// s006 — a stranger jumps up from his seat, sweeping an arm toward it
registerShot('s006', { draw(g, t, info) {
  const up = 0.35, cam = hitCam(mv(t, info.dur, { z: 1.55, x: -40, y: 130 }, { z: 1.6, x: -30, y: 130 }, 6), t, up + 0.1, 8);
  const { GY, CX, front } = bus(g, t, cam, { poleX: -700 });
  const k = clamp(prog(t, up, up + 0.3)), sitY = (1 - k) * 90;
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX - 180, y: GY + sitY * 0, facing: 1, outfit: EXTRAS[2], pose: t < up ? POSES.sit : posesSpring(t, [[up, POSES.jump], [up + 0.35, { ...POSES.reach, hF: [60, -150] }]]), expr: ex(t, 'neutral', [up, 'excited']), look: [1, -0.2] });
    T(g, { t, x: CX + 220, y: GY, facing: -1, outfit: SAM, pose: breathe(POSES.stand, t), expr: ex(t, 'smile', [up + 0.2, 'surprised']), off: 1 });
  });
  front(g);
} });

// s007 — stranger bows, "BITTE!", Sam holds the strap
registerShot('s007', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.7, x: 20, y: 150 }, { z: 1.78, x: 40, y: 155 }, 7);
  const { GY, CX, front } = bus(g, t, cam, { poleX: 760 });
  layer(g, cam, 1, (g) => {
    const s = { t, x: CX - 150, y: GY, facing: 1, outfit: EXTRAS[2], pose: { ...POSES.reach, head: [14, -196], sh: [8, -166], hF: [60, -120], eF: [36, -140] }, expr: 'happy' };
    T(g, s); bubbleOver(g, s, 'BITTE!', t, 0.2);
    T(g, { t, x: CX + 170, y: GY, facing: -1, outfit: SAM, pose: { ...POSES.stand, hB: [-10, -250], eB: [-12, -200] }, expr: 'confused', look: [-0.6, 0.2], off: 2 });
  });
  front(g);
} });

// s008 — giant close-up: Sam confused, "…?"
registerShot('s008', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bus', setOpt: { pole: false }, x: 0.44, toon: { outfit: SAM, expr: 'confused', look: [-0.6, -0.1], tilt: -0.05 }, after: (g) => line(g, t, 'NOCH NICHT MAL HALLO GESAGT', E.W * 0.5, E.H * 0.88, { start: 0.7, size: 54 }) });
} });

// s009 — bakery wide: Sam at the counter, two fingers; the clerk has star eyes
registerShot('s009', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.1, x: -80, y: -20 }, { z: 1.22, x: -20, y: 10 }, 9);
  const { GY, CX, front } = baeckerei(g, t, cam);
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 120, y: GY - 120, s: 1.2, facing: -1, outfit: VERKAEUFERIN, expr: ex(t, 'smile', [0.9, 'awe']), look: [-0.7, 0] }));
  front(g);
  layer(g, cam, 1.05, (g) => T(g, { t, x: CX - 300, y: GY + 120, s: 1.4, facing: 1, outfit: SAM, pose: posesSpring(t, [[0, POSES.stand], [1.0, { ...POSES.point, hF: [50, -200] }]]), expr: 'smile', off: 1 }));
  layer(g, cam, 1.05, (g) => { if (t > 1.1) sticker(g, t, '2', CX - 160, GY - 330, { start: 1.1, r: 60, color: '#3f63c8' }); });
} });

// s010 — insert: three rolls drop into the paper bag, sticker "3"
registerShot('s010', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.9, x: 0, y: 200 }, { z: 2.0, x: 0, y: 210 }, 10);
  baeckerei(g, t, cam, { counter: false });
  layer(g, cam, 1, (g) => { const bx = E.W / 2, by = 842 + 60;
    rr(g, bx - 130, by - 260, 260, 260, 10); g.fillStyle = '#d9b98a'; g.fill(); g.fillStyle = '#c9a77a'; g.fillRect(bx - 130, by - 260, 260, 26);
    [0.4, 0.8, 1.2].forEach((t0, i) => { const p = ease.in(clamp(prog(t, t0, t0 + 0.3))); if (t < t0) return; const y = by - 500 + p * 260 - i * 30; g.fillStyle = '#c98a45'; g.beginPath(); g.ellipse(bx - 60 + i * 60, Math.min(y, by - 250 - i * 10), 50, 30, 0, 0, Math.PI * 2); g.fill(); }); });
  sticker(g, t, '3', E.W * 0.72, E.H * 0.3, { start: 1.3, r: 90, color: '#3fae5a' });
} });

// s011 — Sam holds out a coin, the clerk waves it off; "0 €"
registerShot('s011', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.6, x: 0, y: 100 }, { z: 1.68, x: 10, y: 110 }, 11);
  const { GY, CX, front } = baeckerei(g, t, cam);
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 120, y: GY - 120, s: 1.2, facing: -1, outfit: VERKAEUFERIN, pose: posesSpring(t, [[0, POSES.stand], [0.3, POSES.wave]]), expr: 'happy' }));
  front(g);
  layer(g, cam, 1.05, (g) => { T(g, { t, x: CX - 260, y: GY + 120, s: 1.4, outfit: SAM, pose: { ...POSES.reach, hF: [70, -170] }, expr: 'confused', off: 1 }); circle(g, CX - 260 + 70 * 1.4 + 18, GY + 120 - 170 * 1.4 - 10, 16, '#f2c94a'); });
  sticker(g, t, '0 €', E.W * 0.73, E.H * 0.28, { start: 0.5, r: 90, color: '#3fae5a' });
} });

// s012 — insert: coffee cup slides across the counter, "FÜR DICH" handwritten
registerShot('s012', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 2.0, x: -60, y: 190 }, { z: 2.05, x: -50, y: 195 }, 12);
  baeckerei(g, t, cam, { counter: false });
  layer(g, cam, 1, (g) => { const k = ease.out(clamp(prog(t, 0, 0.45))), x = E.W / 2 + 400 - 400 * k, y = 842 + 30;
    rr(g, -E.W, y, E.W * 3, 40, 6); g.fillStyle = '#f2e9d8'; g.fill(); g.fillStyle = '#8a5a3a'; g.fillRect(-E.W, y + 40, E.W * 3, 400);
    g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x - 80, y - 220); g.lineTo(x + 80, y - 220); g.lineTo(x + 62, y); g.lineTo(x - 62, y); g.fill();
    g.fillStyle = '#c99a5a'; g.fillRect(x - 76, y - 150, 148, 70); text(g, 'FÜR DICH', x - 2, y - 114, { size: 32, font: FONTS.hand, weight: 400, color: '#2a1a10' });
    rr(g, x - 90, y - 246, 180, 30, 8); g.fillStyle = '#3a2a24'; g.fill();
    for (let i = 0; i < 3; i++) { const a = (t * 0.8 + i * 0.33) % 1; g.strokeStyle = alpha('#ffffff', 0.5 * (1 - a)); g.lineWidth = 6; g.beginPath(); g.moveTo(x - 30 + i * 30, y - 260 - a * 80); g.quadraticCurveTo(x - 10 + i * 30, y - 290 - a * 80, x - 30 + i * 30, y - 320 - a * 80); g.stroke(); } });
} });

// s013 — Sam grins with the cup; "GRATIS" sticker slaps on
registerShot('s013', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.75, x: -200, y: 140 }, { z: 1.8, x: -200, y: 140 }, 13), t, 0.12, 10);
  const { GY, CX } = baeckerei(g, t, cam, { counter: false });
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 200, y: GY, s: 1.35, outfit: SAM, pose: { ...POSES.holdFront, hF: [36, -170], eF: [26, -140] }, prop: 'cup', expr: 'grin', look: [0.5, -0.2] }));
  sticker(g, t, 'GRATIS', E.W * 0.68, E.H * 0.34, { start: 0.08, r: 120, color: '#3fae5a' });
} });

// s014 — bus stop: the bus waits with doors open, driver waves, Sam jogs over; "NUR FÜR DICH"
function busSide(g, x, base, t, doorOpen = 1) {
  const w = 1100, h = 420, y = base - h - 40;
  rr(g, x - w / 2, y, w, h, 40); g.fillStyle = '#e8c04a'; g.fill(); g.fillStyle = '#3a6ec8'; g.fillRect(x - w / 2, y + h - 120, w, 26);
  for (let i = 0; i < 5; i++) { rr(g, x - w / 2 + 60 + i * 190, y + 40, 160, 150, 14); g.fillStyle = '#2e3a52'; g.fill(); g.fillStyle = alpha('#ffffff', 0.15); g.fillRect(x - w / 2 + 90 + i * 190, y + 50, 30, 130); }
  const dx = x + w / 2 - 210; rr(g, dx, y + 40, 150, h - 60, 8); g.fillStyle = '#2e3a52'; g.fill(); g.fillStyle = '#d4a836'; g.fillRect(dx, y + 40, 75 * (1 - doorOpen), h - 60); g.fillRect(dx + 150 - 75 * (1 - doorOpen), y + 40, 75 * (1 - doorOpen), h - 60);
  for (const k of [-0.32, 0.28]) { circle(g, x + k * w, base - 20, 62, '#1b1c20'); circle(g, x + k * w, base - 20, 26, '#7a7d84'); }
  rr(g, x + w / 2 - 100, y + 6, 90, 40, 8); g.fillStyle = '#131316'; g.fill(); text(g, '42', x + w / 2 - 55, y + 27, { size: 28, font: FONTS.ui, weight: 900, color: '#ff9a3a' });
}
registerShot('s014', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: -160, y: 20 }, { z: 1.08, x: 40, y: 30 }, 14);
  const { GY, CX, M } = street(g, t, cam);
  layer(g, cam, 0.95, (g) => { busSide(g, CX + 260, GY - 40, t);
    const dr = { t, x: CX + 650, y: GY - 300, s: 0.9, facing: -1, outfit: FAHRER, pose: POSES.wave, expr: 'happy' }; T(g, dr); });
  const k = travel(t, 0, 2.0, { accel: 0.1, brake: 0.3 });
  layer(g, cam, 1, (g) => { g.fillStyle = '#3a3d44'; g.fillRect(CX - 560, GY - 420, 12, 420); circle(g, CX - 554, GY - 440, 40, '#3fae5a'); text(g, 'H', CX - 554, GY - 438, { size: 46, font: FONTS.ui, weight: 900, color: '#e8c04a' });
    T(g, { t, x: CX - 900 + 620 * k, y: GY + 40, outfit: SAM, pose: k < 1 ? walkPose(t * 9, { run: true }) : POSES.wave, expr: 'happy' }); });
  labelBox(g, t, 'NUR FÜR DICH', E.W * 0.5, E.H * 0.13, { start: 0.6 });
} });

// s015 — a normal person walks past; tiny judging labels pop over heads; "0,1 s"
registerShot('s015', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: -120, y: 60 }, { z: 1.3, x: 60, y: 70 }, 15);
  const { GY, CX } = street(g, t, cam);
  const nx = CX - 500 + t * 260;
  layer(g, cam, 1, (g) => {
    [[-300, 0, 1], [150, 3, -1], [520, 6, -1]].forEach(([dx, e, f], i) => { const o = { t, x: CX + dx, y: GY, facing: f, outfit: EXTRAS[e], expr: 'squint', look: [(nx > CX + dx ? 1 : -1) * 0.7, 0], off: i }; T(g, o); bubbleOver(g, o, ['HM.', 'OK.', 'NAJA.'][i], t, 0.6 + i * 0.4, { size: 28 }); });
    T(g, { t, x: nx, y: GY + 40, outfit: NORMAL, pose: walkPose(t * 6), expr: 'neutral' });
  });
  labelBox(g, t, '0,1 SEKUNDEN', E.W * 0.5, E.H * 0.14, { start: 0.2, size: 60 });
} });

// s016 — whiteboard: "Willis & Todorov, 2006"
registerShot('s016', { draw(g, t, info) {
  boardShot(g, t, info, (g, x, y, w, h) => {
    hand(g, 'ERSTER EINDRUCK', x + w * 0.5, y + 60, 50);
    const p = clamp(prog(t, 0.3, 1.4)); g.strokeStyle = '#2c4a8a'; g.lineWidth = 6; g.beginPath(); g.arc(x + 150, y + h * 0.58, 70, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); g.stroke(); seg2(g, x + 150, y + h * 0.58, p);
    hand(g, '0,1 s', x + 150, y + h * 0.58 + 110, 40, '#e0443a');
  });
  paperNote(g, t, 'Willis & Todorov', E.W * 0.6, E.H * 0.42, { start: 0.5, rot: -0.05 });
  counter(g, t, { from: 1990, to: 2006, start: 1.4, dur: 0.9, x: E.W * 0.62, y: E.H * 0.68, size: 100 });
} });
function seg2(g, x, y, p) { g.strokeStyle = '#e0443a'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); const a = -Math.PI / 2 + p * Math.PI * 2; g.lineTo(x + Math.cos(a) * 55, y + Math.sin(a) * 55); g.stroke(); }

// s017 — same pavement, now Sam walks: everyone stops dead with star eyes; "BEWUNDERT"
registerShot('s017', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: -120, y: 60 }, { z: 1.35, x: 60, y: 70 }, 17);
  const { GY, CX } = street(g, t, cam);
  const sx = CX - 500 + t * 230;
  layer(g, cam, 1, (g) => {
    [[-300, 0, 1], [150, 3, -1], [520, 6, -1]].forEach(([dx, e, f], i) => { const hit = 0.4 + i * 0.25; T(g, { t, x: CX + dx, y: GY, facing: f, outfit: EXTRAS[e], pose: t > hit ? posesSpring(t, [[hit, POSES.stand], [hit + 0.1, POSES.handsOnHead]]) : POSES.stand, expr: t > hit ? 'awe' : 'neutral', look: [(sx > CX + dx ? 1 : -1) * 0.7, 0], off: i }); });
    T(g, { t, x: sx, y: GY + 40, outfit: SAM, pose: walkPose(t * 6), expr: 'smile' });
    softEllipse(g, sx, GY - 200, 260, 300, '#fff1b8', 0.25);
  });
  labelBox(g, t, 'BEWUNDERT', E.W * 0.5, E.H * 0.14, { start: wt(info, 'bewundert', 1.8) - 0.1 });
} });

// s018 — "DIE REGEL" drops in on the bright backdrop, Sam centre
registerShot('s018', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.3, x: 0, y: 70 }, { z: 1.36, x: 0, y: 70 }, 18), t, 0.2, 12);
  const { GY, CX } = regel(g, t, cam);
  layer(g, cam, 1, (g) => T(g, { t, x: CX, y: GY, outfit: SAM, pose: POSES.shrug, expr: 'thinking' }));
  kText(g, t, 'DIE REGEL', E.W / 2, E.H * 0.2, { start: 0.05, mode: 'slam', size: 120, font: FONTS.ui, weight: 900, color: '#f7c948' });
} });

// s019 — hallway of doors: every door swings open by itself as Sam walks past
registerShot('s019', { draw(g, t, info) {
  const sx = -500 + t * 330, cam = camAdd({ x: sx * 0.85, z: 1.25, y: 60 }, drift(t, 3, 19));
  const { GY, CX, front } = tueren(g, t, cam, { open: (i) => clamp((sx + 260 - i * 420) / 200), frames: [-200 + 900] });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + sx, y: GY + 30, outfit: SAM, pose: walkPose(t * 6), expr: 'smile' }));
  front(g);
} });

// s020 — giant close-up: Sam in front of the open doorway — empty behind
registerShot('s020', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'tueren', setOpt: { open: () => 1 }, bgCam: { z: 1.6, x: 0, y: -120 }, x: 0.38, toon: { outfit: SAM, expr: ex(t, 'neutral', [0.6, 'thinking']), look: [0.7, 0] }, after: () => labelBox(g, t, 'BEWEIST NICHTS', E.W * 0.72, E.H * 0.3, { start: 0.5 }) });
} });

// s021–s023 — three checks, each crossed out
function checkShot(id, word, idx) {
  registerShot(id, { draw(g, t, info) {
    const cam = hitCam(mv(t, info.dur, { z: 1.2, x: (idx - 1) * 60, y: 40 }, { z: 1.26, x: (idx - 1) * 60 + 20, y: 40 }, 21 + idx), t, 0.32, 9);
    regel(g, t, cam);
    const words = ['KÖNNEN?', 'EHRLICHKEIT?', 'WAHRHEIT?'];
    words.forEach((w, i) => { if (i > idx) return; const x = E.W * (0.22 + i * 0.28), y = E.H * 0.48;
      const on = i === idx; g.save(); g.globalAlpha = on ? 1 : 0.55; sticker(g, on ? t : 9, w, x, y, { start: 0, r: 175, color: ['#3f63c8', '#9a5ad0', '#d6533c'][i], rot: 0 }); g.restore();
      mark(g, on ? t : 9, 0.3, x, y, 240, false, 0.1); });
  } });
}
checkShot('s021', 'Können', 0); checkShot('s022', 'Ehrlichkeit', 1); checkShot('s023', 'Wahrheit', 2);

// s024 — crowd wide: everyone nods at once, "JA!" "KLAR!"
registerShot('s024', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.15, x: 0, y: 40 }, { z: 1.22, x: 30, y: 50 }, 24);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 7; i++) { const dx = (i - 3) * 230, nod = Math.max(0, Math.sin(t * 9)) * 6; const o = { t, x: CX + dx, y: GY + (i % 2) * 30, s: 1.2, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[i], pose: { ...POSES.stand, head: [3 + nod * 0.5, -208 + nod] }, expr: 'happy', off: i }; T(g, o); if (i % 3 === 0) bubbleOver(g, o, ['JA!', 'KLAR!', 'STIMMT!'][i / 3], t, 0.3 + i * 0.06, { size: 28 }); }
  });
} });

// s025 — "GLAUBEN" ≠ "BEWEIS", a little balance tips toward BEWEIS
registerShot('s025', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 0, y: 40 }, { z: 1.28, x: 0, y: 50 }, 25);
  const { GY, CX } = regel(g, t, cam);
  const a = -0.18 * ease.outBack(clamp(prog(t, 0.9, 1.4)));
  layer(g, cam, 1, (g) => { const bx = CX, by = GY - 300;
    g.fillStyle = '#5a5f66'; poly3(g, bx, GY, by); g.save(); g.translate(bx, by); g.rotate(-a);
    g.fillStyle = '#3a3d44'; g.fillRect(-460, -10, 920, 20);
    for (const [dx, str, c] of [[-400, 'GLAUBEN', '#9a5ad0'], [400, 'BEWEIS', '#3f9a5a']]) { g.save(); g.translate(dx, 0); g.rotate(a); g.strokeStyle = '#3a3d44'; g.lineWidth = 4; g.beginPath(); g.moveTo(-90, 120); g.lineTo(0, 0); g.lineTo(90, 120); g.stroke(); rr(g, -150, 120, 300, 30, 10); g.fillStyle = '#5a5f66'; g.fill(); labelBox(g, t, str, 0, 70, { start: dx < 0 ? 0.1 : 0.4, bg: c, color: '#ffffff', border: '#ffffff' }); g.restore(); }
    g.restore(); });
  line(g, t, '≠', E.W / 2, E.H * 0.2, { start: 0.6, size: 120 });
} });
function poly3(g, x, base, top) { g.beginPath(); g.moveTo(x - 80, base); g.lineTo(x - 14, top); g.lineTo(x + 14, top); g.lineTo(x + 80, base); g.fill(); }

// s026 — TITLE over the street, Sam glowing in the centre
registerShot('s026', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: 0, y: 0 }, { z: 1.12, x: 0, y: 40 }, 26);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 1, (g) => { softEllipse(g, CX, GY - 180, 420, 420, '#fff1b8', 0.55 + 0.1 * Math.sin(t * 3));
    for (let i = 0; i < 5; i++) { const dx = [-600, -380, 400, 640, 820][i]; T(g, { t, x: CX + dx, y: GY + 20, s: 1.15, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[i], expr: 'awe', look: [dx < 0 ? 0.8 : -0.8, 0], off: i }); }
    T(g, { t, x: CX, y: GY + 40, s: 1.4, outfit: SAM, pose: breathe(POSES.relaxed, t), expr: 'smile' }); });
  toonTitle(g, t, ['WAS WÄRE, WENN DU DER', 'SCHÖNSTE MENSCH', 'DER WELT WÄRST?'], { y: E.H * 0.24, start: 1.1, size: 96 });
} });

// s027 — the title holds; "UND WAS, WENN DAS NICHT REICHT?" — Sam's smile turns worried
registerShot('s027', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.6, x: 0, y: 130 }, { z: 1.7, x: 0, y: 140 }, 27);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 1, (g) => { softEllipse(g, CX, GY - 180, 380, 380, '#fff1b8', 0.4 * (1 - clamp(prog(t, 0.6, 1.4))));
    T(g, { t, x: CX, y: GY + 40, s: 1.4, outfit: SAM, pose: posesSpring(t, [[0, POSES.relaxed], [0.8, POSES.think]]), expr: ex(t, 'smile', [0.8, 'worried']), look: [0.3, -0.3] }); });
  labelBox(g, t, 'UND WAS, WENN DAS NICHT REICHT?', E.W * 0.5, E.H * 0.16, { start: 0.2, size: 46 });
} });
