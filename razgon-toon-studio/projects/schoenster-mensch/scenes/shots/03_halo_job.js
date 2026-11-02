// shots/03_halo_job.js — Act 2a: the grade, the halo effect, the job interview, the restaurant.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha, seg } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { posesSpring, fg, travel } from '/engine/motion.js';
import { street, classroom } from '/engine/toonsets.js';
import { labelBox, sticker, paperNote } from '/engine/toonui.js';
import { buero, restaurant } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, boardShot, hand, mark, line, stamp, cnt, plusMinus, talk } from '../sets/kit.js';
import { SAM, JONAS, LEO, CHEF, LEHRER, KELLNER, NORMAL, EXTRAS } from '../cast.js';

const paper = (g, x, y, w, h, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -w / 2 + 4, -h / 2 + 6, w, h, 6); g.fillStyle = 'rgba(0,0,0,.2)'; g.fill(); rr(g, -w / 2, -h / 2, w, h, 6); g.fillStyle = '#fbfaf5'; g.fill(); g.fillStyle = '#c9d6e8'; for (let yy = -h / 2 + 30; yy < h / 2 - 10; yy += 22) g.fillRect(-w / 2 + 16, yy, w - 32, 2); g.restore(); };

// s028 — classroom: the teacher hands Sam the essay with a big smile; PLUS
registerShot('s028', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.3, x: 120, y: 80 }, { z: 1.42, x: 160, y: 100 }, 28);
  const { GY, CX } = classroom(g, t, cam);
  const k = travel(t, 0.2, 1.2), px = CX + 380 - 220 * k;
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX + 420, y: GY, facing: -1, outfit: LEHRER, pose: { ...POSES.reach, hF: [60 + 0 * k, -160] }, expr: 'happy', look: [-0.6, 0] });
    T(g, { t, x: CX + 70, y: GY, outfit: SAM, pose: posesSpring(t, [[0, POSES.stand], [1.1, POSES.reach]]), expr: ex(t, 'neutral', [1.2, 'surprised']), off: 1 });
    paper(g, px - 30, GY - 210, 70, 90, 0.1); text(g, '1', px - 30, GY - 210, { size: 56, font: FONTS.hand, weight: 400, color: '#e0443a' });
  });
  plusMinus(g, t, 0.05, true);
} });

// s029 — insert: the essay, four red circles, a huge red "1"
registerShot('s029', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.6, x: 0, y: 120 }, { z: 1.7, x: 0, y: 120 }, 29);
  classroom(g, t, cam);
  g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, 0, E.W, E.H);
  paper(g, E.W * 0.45, E.H * 0.52 + 6, 620, 800, -0.04);
  g.save(); g.translate(E.W * 0.45, E.H * 0.52); g.rotate(-0.04);
  hand(g, 'AUFSATZ', 0, -320, 50, '#2c4a8a');
  [[-160, -200], [120, -100], [-60, 30], [150, 170]].forEach(([x, y], i) => { const p = clamp(prog(t, 0.2 + i * 0.25, 0.45 + i * 0.25)); if (p <= 0) return; g.strokeStyle = '#e0443a'; g.lineWidth = 7; g.beginPath(); g.ellipse(x, y, 70, 30, 0, 0, p * Math.PI * 2); g.stroke(); });
  g.restore();
  text(g, '1', E.W * 0.75, E.H * 0.42, { size: 300, font: FONTS.hand, weight: 400, color: '#e0443a' });
  cnt(g, t, { from: 0, to: 4, start: 0.2, dur: 1.0, x: E.W * 0.75, y: E.H * 0.78, size: 90, label: 'FEHLER', color: '#ef5a4a' });
} });

// s030 — giant close-up: Sam thinking/worried; MINUS
registerShot('s030', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'classroom', x: 0.4, toon: { outfit: SAM, expr: ex(t, 'neutral', [0.9, 'thinking'], [2.4, 'worried']), look: [0.3, 0.4] }, after: () => { plusMinus(g, t, 0.05, false); line(g, t, 'VERDIENT?', E.W * 0.74, E.H * 0.66, { start: wt(info, 'verdient', 2.6) - 0.1, size: 80 }); } });
} });

// s032 — NORMAL and SAM side by side; labels pop over Sam: KLÜGER, NETTER, EHRLICHER
const HALO = ['KLÜGER', 'NETTER', 'EHRLICHER'];
function haloPair(g, t, info, drop) {
  const cam = mv(t, info.dur, { z: 1.45, x: 0, y: 110 }, { z: 1.52, x: 0, y: 115 }, 32);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX - 260, y: GY, outfit: NORMAL, expr: 'neutral', off: 2 });
    T(g, { t, x: CX + 260, y: GY, facing: -1, outfit: SAM, pose: drop ? posesSpring(t, [[0, POSES.stand], [0.5, POSES.shrug]]) : breathe(POSES.stand, t), expr: drop ? 'smirk' : 'smile' });
    g.strokeStyle = '#f7c948'; g.lineWidth = 10; g.beginPath(); g.ellipse(CX + 260, GY - 330, 60, 16, 0, 0, Math.PI * 2); if (!drop || t < 0.3) g.stroke();
  });
  const times = drop ? [0, 0, 0] : [wt(info, 'klüger', 0.9), wt(info, 'netter', 1.6), wt(info, 'ehrlicher', 2.3)];
  HALO.forEach((w, i) => { const y0 = E.H * (0.16 + i * 0.12), fall = drop ? ease.in(clamp(prog(t, 0.2 + i * 0.15, 0.8 + i * 0.15))) : 0;
    if (drop && ((t * 14) | 0) % 2 && t < 0.25) return;
    g.save(); g.globalAlpha = 1 - fall; labelBox(g, drop ? 9 : t, w, E.W * 0.68, y0 + fall * 600, { start: times[i] - 0.05, rot: fall * 0.6 }); g.restore(); });
}
registerShot('s032', { draw(g, t, info) { haloPair(g, t, info, false); } });
// s033 — the labels flicker and drop off; Sam shrugs
registerShot('s033', { draw(g, t, info) { haloPair(g, t, info, true); } });

// s034 — office tower, "BEWERBUNGSTAG", Sam walks in with a folder
registerShot('s034', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: -100, y: -60 }, { z: 1.1, x: 0, y: 0 }, 34);
  const { GY, CX } = buero(g, t, cam, { lobby: true });
  const k = travel(t, 0, info.dur, { accel: 0.1, brake: 0.2 });
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 600 + 520 * k, y: GY + 40, outfit: SAM, pose: walkPose(t * 6), prop: 'book', expr: 'smile' }));
  labelBox(g, t, 'BEWERBUNGSTAG', E.W * 0.5, E.H * 0.12, { start: 0.15 });
} });

// s035 — glass office: Sam enters, the boss behind the desk is already smiling
registerShot('s035', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: -40, y: 50 }, { z: 1.32, x: 0, y: 60 }, 35);
  const { GY, CX, front } = buero(g, t, cam, { deskX: 280 });
  const k = travel(t, 0, 0.9);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX + 330, y: GY - 60, s: 1.25, facing: -1, outfit: CHEF, pose: POSES.sit, expr: 'grin', look: [-0.8, 0] }); });
  front(g);
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 760 + 330 * k, y: GY + 30, outfit: SAM, pose: k < 1 ? walkPose(t * 6) : breathe(POSES.stand, t), prop: 'book', expr: 'smile', off: 1 }));
} });

// s036 — giant close-up: the boss grins with star eyes
registerShot('s036', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'buero', setOpt: { desk: false }, x: 0.58, toon: { outfit: CHEF, expr: ex(t, 'grin', [0.5, 'awe']), look: [-0.6, 0] }, hit: 0.5, hitAmp: 5 });
} });

// s037 — insert: the CV envelope, still sealed; slow push
registerShot('s037', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 2.4, x: 260, y: 140 }, { z: 2.7, x: 260, y: 150 }, 37, 1);
  buero(g, t, cam, { deskX: 240, monitor: false });
  layer(g, cam, 1.02, (g) => { const x = E.W / 2 + 260, y = 842 - 222; g.save(); g.translate(x, y); g.transform(1, 0, -0.35, 0.35, 0, 0);
    rr(g, -170, -110, 340, 220, 8); g.fillStyle = '#e9dcc0'; g.fill(); g.strokeStyle = '#c9b48a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-170, -110); g.lineTo(0, 10); g.lineTo(170, -110); g.stroke(); circle(g, 0, 10, 26, '#c4473b'); g.restore();
    text(g, 'LEBENSLAUF', x, y - 70, { size: 34, font: FONTS.hand, weight: 400, color: '#2a2a30' }); });
  line(g, t, 'UNGELESEN', E.W * 0.5, E.H * 0.86, { start: 0.6, size: 72, color: '#f7c948' });
} });

// s038 — the boss stamps "EINGESTELLT"
registerShot('s038', { draw(g, t, info) {
  const hit = 0.4, cam = hitCam(mv(t, info.dur, { z: 1.7, x: 240, y: 120 }, { z: 1.75, x: 250, y: 120 }, 38), t, hit, 12);
  const { GY, CX, front } = buero(g, t, cam, { deskX: 240, monitor: false });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 380, y: GY - 60, s: 1.25, facing: -1, outfit: CHEF, pose: posesSpring(t, [[0, { ...POSES.reach, hF: [40, -260], eF: [30, -220] }], [hit - 0.08, { ...POSES.reach, hF: [70, -140] }]]), expr: 'joy' }));
  front(g);
  layer(g, cam, 1.02, (g) => { paper(g, CX + 140, GY - 230, 220, 60, 0); });
  stamp(g, t, hit, 'EINGESTELLT', E.W * 0.5, E.H * 0.3, { color: '#3fae5a', size: 90 });
} });

// s039 — Leo leans out from behind his monitor, whispering
registerShot('s039', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.55, x: -120, y: 100 }, { z: 1.62, x: -140, y: 105 }, 39);
  const { GY, CX, front } = buero(g, t, cam, { deskX: -60 });
  const lean = ease.outBack(clamp(prog(t, 0.2, 0.7)));
  layer(g, cam, 1, (g) => { T(g, { t, x: CX - 180 + 90 * lean, y: GY - 60, s: 1.25, outfit: LEO, pose: { ...POSES.sit, head: [3 + 30 * lean, -200], hF: [30, -200], eF: [26, -170] }, expr: 'sly', look: [1, 0] }); });
  front(g);
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 260, y: GY + 20, facing: -1, outfit: SAM, expr: 'smile', look: [-0.6, 0], off: 1 }));
  labelBox(g, t, 'LEO, DEIN NEUER KOLLEGE', E.W * 0.5, E.H * 0.12, { start: 0.3, size: 42 });
} });

// s040 — Leo: "WIE MACHST DU DAS?"
registerShot('s040', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'buero', setOpt: { desk: false }, x: 0.4, toon: { outfit: LEO, expr: 'confused', talk: talk(info), look: [0.7, 0] }, after: () => { const k = pop(t, 0.1); if (k > 0) { /* bubble */ } line(g, t, 'WIE MACHST DU DAS?', E.W * 0.72, E.H * 0.24, { start: 0.1, size: 60 }); } });
} });

// s041 — Sam shrugs, palms up
registerShot('s041', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.7, x: 120, y: 150 }, { z: 1.76, x: 130, y: 155 }, 41), t, 0.45, 5);
  const { GY, CX } = buero(g, t, cam, { desk: false });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 140, y: GY, outfit: SAM, pose: posesSpring(t, [[0, POSES.stand], [0.4, POSES.shrug]]), expr: ex(t, 'neutral', [0.45, 'smirk']) }));
  fg(g, cam, (g) => { const x = E.W / 2 - 900, y = 842; rr(g, x - 200, y - 260, 500, 900, 30); g.fillStyle = '#5a5f66'; g.fill(); }, { depth: 1.8, blur: 16 });
} });

// s042 — giant close-up: Sam, innocent: "ICH HAB NICHTS GEMACHT."
registerShot('s042', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'buero', setOpt: { desk: false }, x: 0.6, toon: { outfit: SAM, expr: 'smile', talk: talk(info), look: [-0.4, 0] }, after: () => line(g, t, 'ICH HAB NICHTS GEMACHT.', E.W * 0.3, E.H * 0.2, { start: 0.1, size: 56 }) });
} });

// s043 — restaurant: the waiter leads Sam and Jonas to the window table, "RESERVIERT"
registerShot('s043', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.1, x: -120, y: 20 }, { z: 1.2, x: -40, y: 40 }, 43);
  const { GY, CX, front } = restaurant(g, t, cam, { reserved: true, tableX: 200 });
  const k = travel(t, 0, 1.8);
  front(g);
  layer(g, cam, 1.05, (g) => {
    T(g, { t, x: CX - 700 + 560 * k, y: GY + 60, s: 1.3, outfit: KELLNER, pose: k < 1 ? walkPose(t * 6) : POSES.explain, expr: 'happy', look: [-0.5, 0] });
    T(g, { t, x: CX - 900 + 540 * k, y: GY + 70, outfit: SAM, pose: k < 1 ? walkPose(t * 6 + 1) : POSES.stand, expr: 'smile', off: 1 });
    T(g, { t, x: CX - 1100 + 540 * k, y: GY + 80, outfit: JONAS, pose: k < 1 ? walkPose(t * 6 + 2) : POSES.relaxed, expr: 'squint', off: 2 });
  });
} });

// s044 — the waiter sets down a dessert; "AUFS HAUS"
registerShot('s044', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.8, x: 180, y: 120 }, { z: 1.9, x: 200, y: 125 }, 44);
  const { GY, CX, front } = restaurant(g, t, cam, { tableX: 200 });
  front(g);
  const k = ease.out(clamp(prog(t, 0.2, 0.8)));
  layer(g, cam, 1.02, (g) => { const x = CX + 220, y = GY - 172 - (1 - k) * 160;
    g.fillStyle = '#f6f1e6'; g.beginPath(); g.ellipse(x, y, 90, 18, 0, 0, Math.PI * 2); g.fill();
    rr(g, x - 50, y - 70, 100, 70, 14); g.fillStyle = '#8a4a2c'; g.fill(); rr(g, x - 50, y - 70, 100, 20, 10); g.fillStyle = '#f6f1e6'; g.fill(); circle(g, x, y - 82, 14, '#e0443a'); });
  sticker(g, t, 'AUFS HAUS', E.W * 0.75, E.H * 0.3, { start: 0.85, r: 130, color: '#e8a040' });
} });

// s045 — the waiter trips over Jonas's foot, the tray wobbles
registerShot('s045', { draw(g, t, info) {
  const trip = 0.55, cam = hitCam(mv(t, info.dur, { z: 1.45, x: -60, y: 110 }, { z: 1.5, x: -40, y: 110 }, 45), t, trip, 10);
  const { GY, CX } = restaurant(g, t, cam, { table: false });
  const k = travel(t, 0, trip);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX - 220, y: GY + 20, outfit: JONAS, pose: { ...POSES.sitBack, fF: [70, 0] }, expr: ex(t, 'neutral', [trip, 'wince']) });
    const wx = CX + 200 - 260 * k;
    T(g, { t, x: wx, y: GY + 20, facing: -1, outfit: KELLNER, pose: t < trip ? walkPose(t * 6) : posesSpring(t, [[trip, POSES.fall], [trip + 0.6, POSES.reach]]), rot: t > trip ? -0.15 * Math.sin((t - trip) * 6) * Math.exp(-(t - trip) * 2) : 0, expr: ex(t, 'happy', [trip, 'scared']) });
    const tx = wx - 90, ty = GY - 300 + (t > trip ? Math.sin((t - trip) * 14) * 14 : 0);
    g.save(); g.translate(tx, ty); g.rotate(t > trip ? Math.sin((t - trip) * 9) * 0.3 : 0); rr(g, -90, -8, 180, 14, 6); g.fillStyle = '#c9ccd2'; g.fill(); rr(g, -40, -50, 30, 42, 6); g.fillStyle = alpha('#cfe6f4', 0.9); g.fill(); rr(g, 10, -40, 50, 32, 6); g.fillStyle = '#8a4a2c'; g.fill(); g.restore();
  });
} });

// s046 — the waiter bows to Sam apologising; Jonas behind holds his foot
registerShot('s046', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.5, x: 40, y: 110 }, { z: 1.56, x: 60, y: 115 }, 46);
  const { GY, CX, front } = restaurant(g, t, cam, { tableX: -40 });
  layer(g, cam, 0.98, (g) => T(g, { t, x: CX - 300, y: GY - 20, s: 1.15, outfit: JONAS, pose: { ...POSES.sit, hF: [40, -60], eF: [30, -90] }, expr: 'wince', look: [0.6, 0.5] }));
  front(g);
  layer(g, cam, 1.04, (g) => {
    T(g, { t, x: CX + 120, y: GY + 60, outfit: SAM, expr: 'confused', look: [0.6, 0], off: 1 });
    const w = { t, x: CX + 400, y: GY + 60, facing: -1, outfit: KELLNER, pose: { ...POSES.stand, head: [30, -180], sh: [16, -160], hF: [20, -110], hB: [10, -110] }, expr: 'nervous', look: [-0.8, 0.3] };
    T(g, w); bubbleOver(g, w, 'VERZEIHUNG!', t, 0.2, { size: 30 });
  });
} });

// s047 — giant close-up: Jonas, sly, one eyebrow up
registerShot('s047', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'restaurant', setOpt: { table: false }, x: 0.42, toon: { outfit: JONAS, expr: ex(t, 'neutral', [0.5, 'sly']), look: [0.3, -0.1], tilt: 0.06 }, after: () => labelBox(g, t, 'JONAS — DEIN BESTER FREUND', E.W * 0.7, E.H * 0.86, { start: 0.3, size: 40 }) });
} });

// s048 — Jonas points at his foot: "HALLO?! DAS WAR MEIN FUSS."
registerShot('s048', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.75, x: -150, y: 150 }, { z: 1.82, x: -160, y: 155 }, 48);
  const { GY, CX } = restaurant(g, t, cam, { table: false });
  layer(g, cam, 1, (g) => { const j = { t, x: CX - 160, y: GY, outfit: JONAS, pose: posesSpring(t, [[0, POSES.stand], [0.2, { ...POSES.point, hF: [40, -60], eF: [30, -110] }]]), expr: 'angry', talk: talk(info), look: [0.2, 0.6] }; T(g, j); bubbleOver(g, j, 'HALLO?! MEIN FUSS!', t, 0.15, { size: 32 });
    T(g, { t, x: CX + 140, y: GY, facing: -1, outfit: SAM, expr: 'grin', off: 1 }); });
} });
