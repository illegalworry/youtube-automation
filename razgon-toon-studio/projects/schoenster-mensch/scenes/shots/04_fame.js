// shots/04_fame.js — Act 2b: the first photo online, the phones on the street, the park.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha, seg, poly } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { posesSpring, fg, travel } from '/engine/motion.js';
import { street, bedroom, toonTree, softEllipse } from '/engine/toonsets.js';
import { labelBox, sticker } from '/engine/toonui.js';
import { park } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, phoneInsert, hand, line, cnt, plusMinus, heart, talk } from '../sets/kit.js';
import { SAM, EXTRAS, NORMAL } from '../cast.js';

const PHONE_UP = { ...POSES.holdFront, hF: [34, -196], eF: [26, -160] };
const clock = (g, t, str, x = E.W * 0.15, y = E.H * 0.14, t0 = 0.1) => labelBox(g, t, str, x, y, { start: t0, size: 56 });
// mini selfie of Sam for phone screens
function samPic(g, x, y, w, h) { g.fillStyle = '#8cc4ea'; g.fillRect(x, y, w, h); circle(g, x + w * 0.5, y + h * 0.42, w * 0.22, '#131316'); rr(g, x + w * 0.22, y + h * 0.62, w * 0.56, h * 0.5, w * 0.12); g.fillStyle = '#e8c04a'; g.fill(); circle(g, x + w * 0.44, y + h * 0.4, w * 0.025, '#fff'); circle(g, x + w * 0.56, y + h * 0.4, w * 0.025, '#fff'); }
function likesRow(g, x, y, w, n, t) { heart(g, x + 40, y + 10, 0.55, '#e8443a'); text(g, n, x + 80, y + 10, { size: 34, font: FONTS.ui, weight: 900, color: '#1b1b20', align: 'left' }); }

// s049 — bedroom evening: Sam on the bed with the phone, "20:00"
registerShot('s049', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: -100, y: 40 }, { z: 1.35, x: -120, y: 60 }, 49);
  const { GY, CX } = bedroom(g, t, cam, { night: false, mood: 'afternoon' });
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 160, y: GY - 60, outfit: SAM, pose: { ...POSES.sit, hF: [34, -170], eF: [28, -140] }, prop: 'phone', expr: 'smile', look: [0.4, 0.2] }));
  clock(g, t, '20:00');
  labelBox(g, t, 'DEIN ERSTES FOTO', E.W * 0.6, E.H * 0.14, { start: 0.4, size: 46 });
} });

// s050 — phone: the photo post, thumb taps POSTEN
registerShot('s050', { draw(g, t, info) {
  const tap = wt(info, 'postest', 1.0);
  phoneInsert(g, t, info, { setOpt: { night: false }, screen: (g, x, y, w, h) => { samPic(g, x + 20, y + 80, w - 40, w - 40);
    rr(g, x + 40, y + h - 150, w - 80, 90, 45); g.fillStyle = t > tap ? '#2f8f4a' : '#3fae5a'; g.fill(); text(g, t > tap ? 'GEPOSTET ✓' : 'POSTEN', x + w / 2, y + h - 105, { size: 40, font: FONTS.ui, weight: 900, color: '#fff' });
    if (t > tap - 0.3 && t < tap + 0.3) circle(g, x + w / 2 + 40, y + h - 100 + (t < tap ? 30 * (tap - t) : 0), 60, '#131316'); } });
  clock(g, t, '20:00');
} });

// s051 — phone: likes race to 100.000, "21:00"
registerShot('s051', { draw(g, t, info) {
  phoneInsert(g, t, info, { setOpt: { night: true }, screen: (g, x, y, w, h) => { samPic(g, x + 20, y + 80, w - 40, w - 40); } });
  cnt(g, t, { from: 0, to: 100000, start: 0.3, dur: 1.6, x: E.W * 0.78, y: E.H * 0.45, size: 100, label: 'LIKES', color: '#ef5a4a' });
  for (let i = 0; i < 6; i++) { const a = (t * 0.9 + i / 6) % 1; heart(g, E.W * (0.62 + 0.05 * Math.sin(i * 7)), E.H * (0.85 - a * 0.6), 0.6 + 0.2 * (i % 2), alpha('#e8443a', 1 - a)); }
  clock(g, t, '21:00');
} });

// s052 — night: 1.000.000, "00:00", phone buzzing
registerShot('s052', { draw(g, t, info) {
  phoneInsert(g, t, info, { setOpt: { night: true }, dim: 0.25, shake: 3, screen: (g, x, y, w, h) => { samPic(g, x + 20, y + 80, w - 40, w - 40); for (let i = 0; i < 4; i++) { rr(g, x + 20, y + 20 + i * 70 + (t * 60 % 70), w - 40, 60, 12); g.fillStyle = alpha('#ffffff', 0.92); g.fill(); text(g, '❤ neue Likes', x + w / 2, y + 50 + i * 70 + (t * 60 % 70), { size: 26, font: FONTS.ui, weight: 800, color: '#e8443a' }); } } });
  cnt(g, t, { from: 100000, to: 1000000, start: 0.1, dur: 1.2, x: E.W * 0.78, y: E.H * 0.45, size: 92, label: 'LIKES', color: '#ef5a4a' });
  clock(g, t, '00:00');
} });

// s053 — battery drains to 0 %
registerShot('s053', { draw(g, t, info) {
  phoneInsert(g, t, info, { setOpt: { night: true }, dim: 0.3, screenBg: '#1b1b20', screen: (g, x, y, w, h) => { const p = 1 - clamp(prog(t, 0.1, 1.0)), bx = x + w / 2 - 110, by = y + h / 2 - 60;
    rr(g, bx, by, 220, 120, 16); g.strokeStyle = '#ffffff'; g.lineWidth = 8; g.stroke(); rr(g, bx + 220, by + 40, 18, 40, 4); g.fillStyle = '#fff'; g.fill();
    rr(g, bx + 12, by + 12, 196 * Math.max(0.02, p), 96, 8); g.fillStyle = p < 0.2 ? '#e0443a' : '#3fae5a'; g.fill();
    text(g, Math.round(p * 100) + ' %', x + w / 2, by + 190, { size: 60, font: FONTS.ui, weight: 900, color: p < 0.2 ? '#e0443a' : '#fff' }); } });
  labelBox(g, t, 'AKKU LEER', E.W * 0.8, E.H * 0.2, { start: 0.9 });
} });

// s054 — mailbox overflowing, "VOLL"
registerShot('s054', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.6, x: 0, y: 100 }, { z: 1.7, x: 0, y: 110 }, 54);
  const { GY, CX } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => { const x = CX + 120, y = GY - 140; rr(g, x - 150, y - 200, 300, 200, 60); g.fillStyle = '#3f63c8'; g.fill(); g.fillStyle = '#2c4a8a'; g.fillRect(x - 150, y - 100, 300, 100); g.fillStyle = '#5a5f66'; g.fillRect(x - 12, y, 24, 160);
    for (let i = 0; i < 14; i++) { const p = clamp(prog(t, i * 0.06, i * 0.06 + 0.4)), a = i * 2.4; if (p <= 0) continue; const ex_ = x + Math.cos(a) * 160 * p, ey = y - 140 - Math.abs(Math.sin(a)) * 220 * p + p * p * 180;
      g.save(); g.translate(ex_, ey); g.rotate(a); rr(g, -40, -26, 80, 52, 4); g.fillStyle = '#f6f1e6'; g.fill(); g.strokeStyle = '#c9b48a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -26); g.lineTo(0, 4); g.lineTo(40, -26); g.stroke(); g.restore(); } });
  labelBox(g, t, 'MAILBOX: VOLL', E.W * 0.5, E.H * 0.14, { start: 0.3 });
} });

// s055 — banking app: money climbs; PLUS
registerShot('s055', { draw(g, t, info) {
  phoneInsert(g, t, info, { setOpt: { night: true }, dx: -260, screen: (g, x, y, w, h) => { g.fillStyle = '#16244a'; g.fillRect(x, y, w, 180); text(g, 'KONTO', x + w / 2, y + 100, { size: 44, font: FONTS.ui, weight: 900, color: '#fff' });
    for (let i = 0; i < 6; i++) { rr(g, x + 20, y + 220 + i * 80, w - 40, 64, 12); g.fillStyle = '#eef6ee'; g.fill(); text(g, '+ ' + (500 * (i + 1)).toLocaleString('de-DE') + ' €', x + w / 2, y + 252 + i * 80, { size: 30, font: FONTS.ui, weight: 900, color: '#2f8f4a' }); } } });
  cnt(g, t, { from: 0, to: 48000, start: 0.2, dur: 1.5, x: E.W * 0.7, y: E.H * 0.5, size: 96, suffix: ' €', color: '#5fd39a' });
  plusMinus(g, t, 0.05, true);
} });

// s056 — giant close-up: Sam sad in the phone glow; comments only "WOW", "SCHÖN"; MINUS
registerShot('s056', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bedroom', veil: '#1b2447', veilA: 0.2, x: 0.38, toon: { outfit: SAM, expr: ex(t, 'neutral', [0.5, 'sad']), look: [0.5, 0.4] }, after: () => {
    ['WOW', 'SCHÖN', 'HÜBSCH', 'WOW', 'MEGA'].forEach((w, i) => { const a = clamp(prog(t, 0.2 + i * 0.3, 1.6 + i * 0.3)); if (a <= 0 || a >= 1) return; g.save(); g.globalAlpha = 1 - a; rr(g, E.W * 0.62 + (i % 2) * 140, E.H * (0.8 - a * 0.5) - 30, 200, 60, 30); g.fillStyle = '#ffffff'; g.fill(); text(g, w, E.W * 0.62 + (i % 2) * 140 + 100, E.H * (0.8 - a * 0.5) + 2, { size: 30, font: FONTS.ui, weight: 900, color: '#1b1b20' }); g.restore(); });
    plusMinus(g, t, 0.05, false); line(g, t, 'WAS DENKST DU?', E.W * 0.38, E.H * 0.9, { start: wt(info, 'denkst', 1.6) - 0.1, size: 52 }); } });
} });

// s057 — street: a man stops dead and raises his phone
registerShot('s057', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.3, x: -60, y: 70 }, { z: 1.4, x: 40, y: 80 }, 57);
  const { GY, CX } = street(g, t, cam);
  const stop = 0.9, mk = travel(t, 0, stop);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX + 600 - 380 * mk, y: GY + 20, facing: -1, outfit: EXTRAS[2], pose: t < stop ? walkPose(t * 6) : posesSpring(t, [[stop, POSES.stand], [stop + 0.4, PHONE_UP]]), prop: t > stop + 0.3 ? 'phone' : null, expr: ex(t, 'neutral', [stop, 'awe']), look: [-0.8, 0] });
    T(g, { t, x: CX - 300 + t * 120, y: GY + 40, outfit: SAM, pose: walkPose(t * 6), expr: 'smile' });
  });
} });

// s058 — medium: the man films; Sam uncomfortable
registerShot('s058', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.7, x: 40, y: 150 }, { z: 1.78, x: 60, y: 150 }, 58);
  const { GY, CX, M } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX - 160, y: GY, outfit: SAM, pose: posesSpring(t, [[0, POSES.stand], [0.6, { ...POSES.stand, hF: [30, -200], eF: [26, -160] }]]), expr: ex(t, 'neutral', [0.5, 'nervous']), look: [0.7, 0] });
    T(g, { t, x: CX + 180, y: GY, facing: -1, outfit: EXTRAS[2], pose: PHONE_UP, prop: 'phone', expr: 'awe', off: 1 });
    if ((t * 2) % 1 < 0.5) circle(g, CX + 120, GY - 330, 10, '#e0443a');
  });
  line(g, t, 'OHNE ZU FRAGEN', E.W * 0.5, E.H * 0.15, { start: wt(info, 'ohne', 1.0) - 0.1, size: 60 });
  fg(g, cam, (g) => toonTree(g, E.W / 2 + 900, 842 + 900, 1.6, M, 4, { trunk: 600, w: 300, h: 220 }), { depth: 1.8, blur: 16 });
} });

// s059/s060 — first a woman, then a group join with phones
function joinShot(id, n) {
  registerShot(id, { draw(g, t, info) {
    const cam = mv(t, info.dur, { z: 1.5 - n * 0.08, x: 60, y: 120 }, { z: 1.45 - n * 0.08, x: 60, y: 120 }, 59 + n);
    const { GY, CX } = street(g, t, cam);
    layer(g, cam, 1, (g) => {
      T(g, { t, x: CX - 180, y: GY, outfit: SAM, pose: { ...POSES.stand, hF: [30, -200], eF: [26, -160] }, expr: 'nervous', look: [0.7, 0] });
      const people = n === 0 ? [[160, 2, 0], [340, 3, 0.15]] : [[160, 2, 0], [340, 3, 0], [500, 0, 0.1], [640, 1, 0.2], [780, 5, 0.3]];
      people.forEach(([dx, e, d], i) => { const k = ease.outBack(clamp(prog(t, d, d + 0.35))); T(g, { t, x: CX + dx + (1 - k) * 400, y: GY, facing: -1, outfit: EXTRAS[e], pose: PHONE_UP, prop: 'phone', expr: 'awe', off: i }); });
    });
  } });
}
joinShot('s059', 0); joinShot('s060', 1);

// s061 — wide: a ring of phones around Sam, "30 HANDYS"
registerShot('s061', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.15, x: 0, y: 40 }, { z: 1.28, x: 20, y: 60 }, 61);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    const back = [[-460, -70], [-250, -95], [250, -95], [460, -70], [-620, -40], [620, -40]];
    back.forEach(([dx, dy], i) => T(g, { t, x: CX + dx, y: GY + dy, s: 1.05, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[i % 7], pose: breathe(PHONE_UP, t, 1, i), prop: 'phone', expr: 'awe', off: i }));
    T(g, { t, x: CX, y: GY - 20, s: 1.25, outfit: SAM, pose: breathe(POSES.crossArms, t), expr: 'nervous', look: [0.3, -0.2] });
    const front_ = [[-520, 90], [-260, 120], [270, 120], [530, 90]];
    front_.forEach(([dx, dy], i) => T(g, { t, x: CX + dx, y: GY + dy, s: 1.45, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[(i + 3) % 7], pose: breathe(PHONE_UP, t, 1, i + 7), prop: 'phone', expr: 'awe', off: i + 3 }));
  });
  cnt(g, t, { from: 0, to: 30, start: 0.2, dur: 1.0, x: E.W * 0.5, y: E.H * 0.16, label: 'HANDYS' });
  labelBox(g, t, 'NACH 1 MINUTE', E.W * 0.15, E.H * 0.12, { start: 0.1, size: 40 });
} });

// s062–s063 — the crowd chants the same sentences
function chant(id, words) {
  registerShot(id, { draw(g, t, info) {
    const cam = mv(t, info.dur, { z: 1.4, x: -40, y: 100 }, { z: 1.5, x: 20, y: 110 }, id.length);
    const { GY, CX } = street(g, t, cam);
    const crowd = [[-560, 0], [-380, 3], [-200, 5], [220, 1], [400, 6], [580, 4]];
    layer(g, cam, 1, (g) => {
      T(g, { t, x: CX, y: GY + 20, outfit: SAM, pose: POSES.crossArms, expr: 'worried' });
      crowd.forEach(([dx, e], i) => { const o = { t, x: CX + dx, y: GY + (i % 2) * 30, s: 1.2, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[e], pose: breathe(PHONE_UP, t, 1, i), prop: 'phone', expr: 'excited', talk: talk(info), off: i };
        T(g, o); const w = words[i % words.length]; if (w) bubbleOver(g, o, w.str, t, w.t + i * 0.05, { size: 26 }); });
    });
  } });
}
chant('s062', [{ str: 'WUNDERSCHÖN!', t: 0.2 }, null, { str: 'WOW!', t: 0.4 }]);
chant('s063', [{ str: 'WUNDERSCHÖN!', t: 0.1 }, { str: 'PERFEKT!', t: 1.1 }, null, { str: 'PERFEKT!', t: 1.3 }]);

// s064 — everyone freezes, mouths open: "DU BIST…"; Sam waits
registerShot('s064', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.5, x: 0, y: 110 }, { z: 1.5, x: 0, y: 110 }, 64, 1);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX, y: GY + 20, outfit: SAM, pose: POSES.shrug, expr: ex(t, 'neutral', [0.9, 'confused']), look: [0.5, 0] });
    [[-460, 0], [-250, 3], [260, 1], [470, 6]].forEach(([dx, e], i) => { const o = { t, x: CX + dx, y: GY, s: 1.2, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[e], pose: PHONE_UP, prop: 'phone', expr: 'surprised', blink: false }; T(g, o); if (i === 1) bubbleOver(g, o, 'DU BIST…', t, 0.05, { size: 30 }); });
  });
  line(g, t, '…JA?', E.W * 0.62, E.H * 0.24, { start: 0.95, size: 70 });
} });

// s065 — giant close-up: Sam confused, "…WAS EIGENTLICH?"
registerShot('s065', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'street', x: 0.4, hit: 0.15, hitAmp: 6, toon: { outfit: SAM, expr: 'confused', look: [0.5, -0.2], tilt: -0.06 }, after: () => line(g, t, 'WAS EIGENTLICH?', E.W * 0.73, E.H * 0.28, { start: 0.05, size: 72 }) });
} });

// s066 — park wide: path through round trees, "30 MIN"
registerShot('s066', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: -200, y: 0 }, { z: 1.08, x: 100, y: 20 }, 66);
  const { GY, CX } = park(g, t, cam);
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 500 + t * 160, y: GY + 20, outfit: NORMAL, pose: walkPose(t * 5), expr: 'smile' }));
  cnt(g, t, { from: 0, to: 30, start: 0.6, dur: 1.4, x: E.W * 0.5, y: E.H * 0.18, label: 'MINUTEN', size: 100 });
  labelBox(g, t, 'NORMAL', E.W * 0.15, E.H * 0.1, { start: 0.3, size: 40 });
} });

// s067 — the selfie queue along the path, "3 STD"; camera slides along the queue
registerShot('s067', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: 500, y: 60 }, { z: 1.2, x: -100, y: 50 }, 67);
  const { GY, CX } = park(g, t, cam);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX - 500, y: GY + 20, outfit: SAM, pose: { ...POSES.stand, hF: [40, -230], eF: [30, -180] }, expr: 'sleepy' });
    for (let i = 0; i < 10; i++) T(g, { t, x: CX - 300 + i * 190, y: GY + 20 + (i % 2) * 14, s: 1.2, facing: -1, outfit: EXTRAS[i % 7], pose: breathe(PHONE_UP, t, 1, i), prop: 'phone', expr: 'excited', off: i });
  });
  cnt(g, t, { from: 0, to: 3, start: 0.1, dur: 0.8, x: E.W * 0.5, y: E.H * 0.16, label: 'STUNDEN', size: 100, color: '#ef5a4a' });
  labelBox(g, t, 'BEI DIR', E.W * 0.15, E.H * 0.1, { start: 0.1, size: 40 });
} });

// s068 — selfie flashes, Sam squinting
registerShot('s068', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'park', x: 0.45, toon: { outfit: SAM, expr: 'squint', look: [0, 0] }, after: () => { for (const t0 of [0.15, 0.55, 0.85]) { const a = 1 - clamp(prog(t, t0, t0 + 0.2)); if (t > t0 && a > 0) { g.fillStyle = alpha('#ffffff', a * 0.8); g.fillRect(0, 0, E.W, E.H); } } labelBox(g, t, 'SELFIES', E.W * 0.75, E.H * 0.2, { start: 0.1 }); } });
} });
