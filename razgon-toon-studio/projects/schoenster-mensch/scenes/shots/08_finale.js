// shots/08_finale.js — Act 5 end + Act 6: outside with Jonas, the fact check, the night call, the end screen.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha, seg, poly, backdrop } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { posesSpring, fg, travel, kText, impact } from '/engine/motion.js';
import { street, bedroom, classroom, toonTree, softEllipse } from '/engine/toonsets.js';
import { labelBox, sticker, paperNote, toonTitle, toonEnd } from '/engine/toonui.js';
import { regel } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, phoneInsert, boardShot, hand, mark, line, cnt, stamp, talk } from '../sets/kit.js';
import { FURCHTBAR } from './06_jonas.js';
import { SAM, JONAS, LEO, BRANDT, EXTRAS } from '../cast.js';

// --- outside at dusk ---
function dusk(g, t, info, cam0, cam1, seed, draw) {
  const cam = mv(t, info.dur, cam0, cam1, seed);
  const { GY, CX, M } = street(g, t, cam, { mood: 'sunset' });
  layer(g, cam, 0.95, (g) => { rr(g, CX - 900, GY - 520, 360, 480, 6); g.fillStyle = '#283a6a'; g.fill(); rr(g, CX - 860, GY - 460, 280, 420, 4); g.fillStyle = '#ffd98c'; g.fill(); text(g, 'BÜHNENEINGANG', CX - 720, GY - 545, { size: 26, font: FONTS.ui, weight: 900, color: '#ffffff' }); });
  layer(g, cam, 1, (g) => draw(g, GY, CX));
  return { GY, CX, M, cam };
}
// s163 — outside at dusk: Jonas waits at the stage door
registerShot('s163', { draw(g, t, info) {
  dusk(g, t, info, { z: 1.05, x: -200, y: 0 }, { z: 1.15, x: -160, y: 20 }, 163, (g, GY, CX) => { T(g, { t, x: CX - 400, y: GY + 20, facing: -1, outfit: JONAS, pose: POSES.crossArms, expr: 'smile' }); const k = travel(t, 0.3, info.dur); T(g, { t, x: CX - 720 + 160 * k, y: GY + 20, outfit: SAM, pose: k < 1 && t > 0.3 ? walkPose(t * 5) : POSES.stand, expr: 'surprised' }); });
  labelBox(g, t, 'DRAUSSEN', E.W * 0.5, E.H * 0.1, { start: 0.1 });
} });
// s164 — Jonas grins
registerShot('s164', { draw(g, t, info) { closeUp(g, t, info, { set: 'street', setOpt: { mood: 'sunset' }, x: 0.55, toon: { outfit: JONAS, expr: ex(t, 'smile', [0.15, 'grin']), look: [-0.6, 0] } }); } });
// s165 — "DU SIEHST FURCHTBAR AUS."
registerShot('s165', { draw(g, t, info) {
  dusk(g, t, info, { z: 1.65, x: -560, y: 140 }, { z: 1.72, x: -560, y: 145 }, 165, (g, GY, CX) => { T(g, { t, x: CX - 720, y: GY + 20, outfit: SAM, expr: 'surprised', look: [0.6, 0] }); const j = { t, x: CX - 420, y: GY + 20, facing: -1, outfit: JONAS, pose: POSES.crossArms, expr: 'sly', talk: talk(info) }; T(g, j); bubbleOver(g, j, FURCHTBAR, t, 0.1, { size: 30, dx: -80 }); });
} });
// s166 — Sam laughs loudly
registerShot('s166', { draw(g, t, info) { closeUp(g, t, info, { set: 'street', setOpt: { mood: 'sunset' }, x: 0.42, toon: { outfit: SAM, expr: 'joy', tilt: 0.06 * Math.sin(t * 10) }, hit: 0.15, hitAmp: 4, after: () => { line(g, t, 'HAHAHA!', E.W * 0.76, E.H * 0.3, { start: 0.2, size: 80, color: '#f7c948' }); line(g, t, 'RICHTIG LAUT.', E.W * 0.5, E.H * 0.9, { start: wt(info, 'richtig', 1.6) - 0.05, size: 56 }); } }); } });
// s168 — Jonas wags a finger: "DAS WAR LEICHTSINNIG."
registerShot('s168', { draw(g, t, info) {
  dusk(g, t, info, { z: 1.65, x: -560, y: 140 }, { z: 1.7, x: -540, y: 145 }, 168, (g, GY, CX) => { T(g, { t, x: CX - 720, y: GY + 20, outfit: SAM, expr: 'happy' }); const j = { t, x: CX - 420, y: GY + 20, facing: -1, outfit: JONAS, pose: { ...POSES.pointUp, hF: [40 + 10 * Math.sin(t * 14), -260] }, expr: 'determined', talk: talk(info) }; T(g, j); bubbleOver(g, j, 'DAS WAR LEICHTSINNIG.', t, 0.3, { size: 30, dx: -80 }); });
} });
// s169 — giant close-up: Sam's joy in the warm sunset — finally someone contradicts
registerShot('s169', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'street', setOpt: { mood: 'sunset' }, x: 0.4, push: 0.04, toon: { outfit: SAM, expr: ex(t, 'smile', [1.8, 'joy']), look: [0.4, 0], glow: '#ffe2a8' }, after: () => { line(g, t, 'ENDLICH WIDERSPRICHT JEMAND.', E.W * 0.62, E.H * 0.2, { start: 0.2, size: 52 }); labelBox(g, t, 'WUNDERBAR', E.W * 0.75, E.H * 0.82, { start: wt(info, 'wunderbar', 3.5) - 0.1 }); } });
} });
// s170/s171 — both walk away into the sunset
function walkAway(g, t, info, txt, color) {
  const k = t + (info.shot.id === 's171' ? 1.85 : 0);
  const { GY, CX, M } = street(g, t, mv(t, info.dur, { z: 1.0, x: 0, y: 0 }, { z: 1.04, x: 20, y: 0 }, 170), { mood: 'sunset' });
  layer(g, mv(t, info.dur, { z: 1.0, x: 0, y: 0 }, { z: 1.04, x: 20, y: 0 }, 170), 1, (g) => { const x = CX - 100 + k * 130; T(g, { t, x, y: GY + 20, s: 1.1, outfit: SAM, pose: walkPose(k * 5), expr: 'happy', look: [0.6, 0] }); T(g, { t, x: x + 160, y: GY + 20, s: 1.1, outfit: JONAS, pose: walkPose(k * 5 + 1.3), expr: 'grin', look: [-0.6, 0] }); });
  line(g, t, txt, E.W * 0.5, E.H * 0.14, { start: 0.1, size: 62, color });
}
registerShot('s170', { draw(g, t, info) { walkAway(g, t, info, 'SCHÖNE GESICHTER GIBT ES VIELE.', '#ffffff'); } });
registerShot('s171', { draw(g, t, info) { walkAway(g, t, info, 'EINEN JONAS GIBT ES NUR EINMAL.', '#f7c948'); } });

// --- fact check on the whiteboard ---
registerShot('s172', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.2, x: -60, y: 0 }, { z: 1.35, x: -100, y: -60 }, 172), t, 0.3, 8);
  classroom(g, t, cam, { onBoard: (g, x, y, w, h) => hand(g, '?', x + w / 2, y + h / 2, 160, '#e0443a') });
  kText(g, t, 'FAKTEN-CHECK', E.W / 2, E.H * 0.18, { start: 0.2, mode: 'slam', size: 110, font: FONTS.ui, weight: 900, color: '#f7c948' });
} });
registerShot('s173', { draw(g, t, info) { boardShot(g, t, info, (g, x, y, w, h) => { hand(g, 'SCHÖNHEIT ÖFFNET TÜREN', x + w * 0.45, y + h * 0.45, 56); mark(g, t, 0.6, x + w * 0.88, y + h * 0.45, 70, true); }); line(g, t, 'WAHR', E.W * 0.5, E.H * 0.86, { start: 0.6, size: 70, color: '#5fd39a' }); } });
registerShot('s174', { draw(g, t, info) {
  boardShot(g, t, info, (g, x, y, w, h) => { hand(g, 'STUDIE', x + w * 0.5, y + 50, 46); });
  paperNote(g, t, 'Dion, Berscheid & Walster', E.W * 0.5, E.H * 0.45, { start: 0.6, size: 64, rot: -0.03 });
  cnt(g, t, { plain: true, from: 1950, to: 1972, start: 0.05, dur: 0.6, x: E.W * 0.5, y: E.H * 0.72, size: 110 });
} });
registerShot('s175', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.45, x: 0, y: 110 }, { z: 1.52, x: 0, y: 115 }, 175);
  const { GY, CX } = classroom(g, t, cam);
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 60, y: GY, outfit: SAM, pose: POSES.relaxed, expr: 'smile' }));
  labelBox(g, t, 'KLÜGER', E.W * 0.28, E.H * 0.3, { start: wt(info, 'klüger', 1.4) - 0.1 });
  labelBox(g, t, 'FREUNDLICHER', E.W * 0.74, E.H * 0.3, { start: wt(info, 'freundlicher', 2.2) - 0.1 });
  line(g, t, 'ATTRAKTIVE MENSCHEN GELTEN ALS…', E.W * 0.5, E.H * 0.1, { start: 0.1, size: 50 });
} });
registerShot('s176', { draw(g, t, info) {
  boardShot(g, t, info, (g, x, y, w, h) => { hand(g, 'GESICHTER', x + w * 0.5, y + 50, 46); });
  paperNote(g, t, 'Langlois & Roggman', E.W * 0.5, E.H * 0.45, { start: 0.4, size: 64, rot: 0.03 });
  cnt(g, t, { plain: true, from: 1980, to: 1990, start: 0.05, dur: 0.5, x: E.W * 0.5, y: E.H * 0.72, size: 110 });
} });
// s177 — three faces slide together into one averaged face
registerShot('s177', { draw(g, t, info) {
  boardShot(g, t, info, (g, x, y, w, h) => {
    const m = ease.inOut(clamp(prog(t, 0.6, 1.8))), cy = y + h * 0.5;
    [-1, 0, 1].forEach((k, i) => { const cx = x + w / 2 + k * 260 * (1 - m); g.save(); g.globalAlpha = 1 - m * 0.6; circle(g, cx, cy, 80 + i * 6, ['#3a3a44', '#131316', '#2a2a34'][i]); g.fillStyle = '#fff'; for (const d of [-25, 25]) { g.beginPath(); g.ellipse(cx + d + k * 6, cy - 10 + k * 4, 8, 13, 0, 0, Math.PI * 2); g.fill(); } g.restore(); });
    if (m > 0.95) { circle(g, x + w / 2, cy, 84, '#131316'); g.fillStyle = '#fff'; for (const d of [-25, 25]) { g.beginPath(); g.ellipse(x + w / 2 + d, cy - 10, 8, 13, 0, 0, Math.PI * 2); g.fill(); } g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.arc(x + w / 2, cy + 10, 26, 0.3, Math.PI - 0.3); g.stroke(); }
    hand(g, 'GEMITTELT = ANZIEHENDER', x + w / 2, y + h - 40, 44, '#c8961a');
  });
} });
// s178 — golden spiral; "KEIN SICHERER BELEG"
registerShot('s178', { draw(g, t, info) {
  boardShot(g, t, info, (g, x, y, w, h) => {
    hand(g, 'GOLDENER SCHNITT?', x + w * 0.5, y + 46, 46);
    const p = clamp(prog(t, 0.3, 2.0)), cx = x + w * 0.5, cy = y + h * 0.58; g.strokeStyle = '#c8961a'; g.lineWidth = 6; g.beginPath(); for (let a = 0; a < p * Math.PI * 4; a += 0.05) { const r = 4 * Math.exp(0.306 * a); const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * 0.9; a ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
  });
  stamp(g, t, wt(info, 'keinen', 3.0), 'KEIN SICHERER BELEG', E.W * 0.5, E.H * 0.8, { size: 70 });
} });
registerShot('s179', { draw(g, t, info) { boardShot(g, t, info, (g, x, y, w, h) => { hand(g, 'GESICHT = EHRLICHKEIT?', x + w * 0.45, y + h * 0.45, 56); mark(g, t, 0.9, x + w * 0.9, y + h * 0.45, 80, false); }); line(g, t, 'FALSCH', E.W * 0.5, E.H * 0.86, { start: 0.9, size: 70, color: '#ef5a4a' }); } });
registerShot('s180', { draw(g, t, info) { boardShot(g, t, info, (g, x, y, w, h) => { hand(g, 'NUR GLAUBWÜRDIGER', x + w * 0.45, y + h * 0.45, 56); mark(g, t, 0.5, x + w * 0.9, y + h * 0.45, 70, true); }); } });
registerShot('s181', { draw(g, t, info) { const cam = hitCam({ z: 1, x: 0, y: 0 }, t, 0.25, 8); boardShot(g, t, info, (g, x, y, w, h) => { hand(g, 'DER REST:', x + w * 0.5, y + 60, 50); }); stamp(g, t, 0.25, 'FIKTION', E.W * 0.5, E.H * 0.55, { size: 130, color: '#9a5ad0' }); } });
// s182 — "WAS IST SCHÖN?"
registerShot('s182', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 0, y: 40 }, { z: 1.3, x: 0, y: 50 }, 182);
  const { GY, CX } = regel(g, t, cam);
  layer(g, cam, 1, (g) => { [[-520, 0], [-260, 3], [0, -1], [260, 5], [520, 1]].forEach(([dx, e], i) => T(g, { t, x: CX + dx, y: GY, s: 1.15, outfit: e < 0 ? SAM : EXTRAS[e], pose: breathe(POSES.stand, t, 1, i), expr: 'smile', off: i })); });
  toonTitle(g, t, ['ABER WAS BEDEUTET', 'EIGENTLICH SCHÖN?'], { y: E.H * 0.24, start: 0.2, size: 96 });
} });

// --- the night call (cliffhanger) ---
registerShot('s183', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.3, x: 300, y: 80 }, { z: 1.45, x: 320, y: 90 }, 183);
  const { GY, CX } = bedroom(g, t, cam, { night: true });
  layer(g, cam, 1, (g) => { T(g, { t, x: CX + 250, y: GY - 95, outfit: SAM, pose: POSES.stand, rot: -Math.PI / 2, expr: 'sleepy', shadow: false, look: [0, -0.5] });
    const bz = Math.sin(t * 70) * 4; rr(g, CX + 575 + bz, GY - 192, 90, 22, 6); g.fillStyle = '#2a2d34'; g.fill(); if ((t * 4) % 1 < 0.5) softEllipse(g, CX + 620, GY - 186, 120, 50, '#9fd0ff', 0.6); });
  g.fillStyle = 'rgba(10,15,40,.3)'; g.fillRect(0, 0, E.W, E.H);
  labelBox(g, t, 'NACHTS', E.W * 0.15, E.H * 0.1, { start: 0.1 });
} });
registerShot('s184', { draw(g, t, info) { phoneInsert(g, t, info, { setOpt: { night: true }, dim: 0.4, shake: 2, screenBg: '#1b1b20', screen: (g, x, y, w, h) => { text(g, 'UNBEKANNTE', x + w / 2, y + 200, { size: 44, font: FONTS.ui, weight: 900, color: '#fff' }); text(g, 'NUMMER', x + w / 2, y + 256, { size: 44, font: FONTS.ui, weight: 900, color: '#fff' }); circle(g, x + w / 2, y + 420, 80, '#3a3d44'); text(g, '?', x + w / 2, y + 424, { size: 90, font: FONTS.ui, weight: 900, color: '#fff' }); circle(g, x + w * 0.25, y + h - 110, 56, '#e0443a'); circle(g, x + w * 0.75, y + h - 110, 56, '#3fae5a'); } }); } });
// s185/s186 — a silhouette whispering into a phone: "GUT GEMACHT."
function silhouette(g, t, info, bubble) {
  backdrop(g, ['#0f1428', '#1b2447']);
  const cx = E.W * 0.42, cy = E.H * 0.55; softEllipse(g, cx, cy, 500, 500, '#3a4a8a', 0.5);
  T(g, { t, x: cx, y: E.H * 0.98, s: 2.6, outfit: { top: 'hoodie', color: '#1a1c24', head: 'hood', headColor: '#1a1c24', pants: '#1a1c24' }, pose: PHONE, prop: 'phone', expr: 'sly', rim: { dir: [0.8, -0.5], color: '#9fb6ff', w: 3 }, talk: bubble ? talk(info) : 0 });
  if (bubble) bubbleOver(g, { x: cx, y: E.H * 0.98, s: 2.6, pose: PHONE, outfit: { head: 'hood' } }, 'GUT GEMACHT.', t, 0.05, { size: 40, dx: 160, dy: 20 });
  else line(g, t, 'EINE STIMME FLÜSTERT…', E.W * 0.72, E.H * 0.2, { start: 0.2, size: 52 });
}
const PHONE = { ...POSES.phone };
registerShot('s185', { draw(g, t, info) { silhouette(g, t, info, false); } });
registerShot('s186', { draw(g, t, info) { silhouette(g, t, info, true); } });
// s187 — Sam shocked; a second silhouette with the same face in the window
registerShot('s187', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bedroom', veil: '#0f1428', veilA: 0.35, x: 0.35, hit: 0.05, hitAmp: 10, toon: { outfit: SAM, expr: 'shocked', look: [0.8, 0] }, after: () => {
    const a = clamp(prog(t, 0.8, 1.6)), x = E.W * 0.78, y = E.H * 0.45; g.save(); g.globalAlpha = a; rr(g, x - 200, y - 230, 400, 460, 10); g.fillStyle = '#0a0d1c'; g.fill(); rr(g, x - 184, y - 214, 368, 428, 6); g.fillStyle = '#1b2447'; g.fill();
    rr(g, x - 110, y + 70, 220, 200, 50); g.fillStyle = '#e8c04a'; g.fill(); circle(g, x, y - 20, 95, '#131316'); g.fillStyle = '#fff'; for (const d of [-30, 30]) { g.beginPath(); g.ellipse(x + d, y - 30, 9, 15, 0, 0, Math.PI * 2); g.fill(); } g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.arc(x, y - 10, 30, 0.3, Math.PI - 0.3); g.stroke(); g.restore();
    line(g, t, 'NICHT DER EINZIGE…', E.W * 0.5, E.H * 0.9, { start: 0.4, size: 60, color: '#ef5a4a' }); } });
} });

// --- end screen ---
function endScreen(g, t, info, lines, cta) {
  toonEnd(g, t + (info.shot.id === 's188' ? 0 : 2), { lines, bg: '#8cc4ea', cta, size: 104 });
  const GY = E.H * 0.82; g.fillStyle = '#86b965'; g.fillRect(0, GY, E.W, E.H);
  [[LEO, 'smile'], [JONAS, 'grin'], [SAM, 'joy'], [BRANDT, 'smirk']].forEach(([o, e], i) => T(g, { t, x: E.W / 2 + (i - 1.5) * 240, y: GY, s: 1.4, facing: i < 2 ? 1 : -1, outfit: o, pose: breathe(i === 2 ? POSES.cheer : POSES.stand, t, 1, i), expr: e, off: i }));
}
registerShot('s188', { draw(g, t, info) { endScreen(g, t, info, ['WAS DENKST DU?', 'AB IN DIE KOMMENTARE!'], 'KOMMENTIEREN'); } });
registerShot('s189', { draw(g, t, info) { endScreen(g, t, info, ['WELCHE SUPERKRAFT', 'ALS NÄCHSTES?'], 'KOMMENTIEREN'); } });
registerShot('s190', { draw(g, t, info) { endScreen(g, t, info, ['LIKE & ABONNIEREN', 'FÜR TEIL 2!'], 'ABONNIEREN'); } });
