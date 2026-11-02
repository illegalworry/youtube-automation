// shots/05_paris_price.js — Act 3: hiding in the park, Paris runway, the world map, billboards, the price.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha, seg, poly, backdrop } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { posesSpring, fg, travel, kText } from '/engine/motion.js';
import { street, bedroom, classroom, toonTree, softEllipse, lamplight } from '/engine/toonsets.js';
import { labelBox, sticker, paperNote } from '/engine/toonui.js';
import { park, paris, laufsteg, weltkarte, studio, party, regel, CONT } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, boardShot, hand, mark, line, cnt, plusMinus, heart, talk, stamp } from '../sets/kit.js';
import { SAM, EXTRAS, SAENGERIN, FOTOGRAF, NORMAL } from '../cast.js';

const PHONE_UP = { ...POSES.holdFront, hF: [34, -196], eF: [26, -160] };
const CAM_UP = { ...POSES.holdFront, hF: [30, -200], eF: [24, -166], hB: [20, -196], eB: [8, -160] };
// Sam's face poster (billboard)
function poster(g, x, y, w, h, t, o = {}) {
  rr(g, x - 10, y - 10, w + 20, h + 20, 8); g.fillStyle = '#2a2d34'; g.fill();
  g.fillStyle = o.bg || '#8cc4ea'; g.fillRect(x, y, w, h); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const r = h * 0.3, cx = x + w * 0.38, cy = y + h * 0.46;
  rr(g, cx - r * 1.3, cy + r * 0.8, r * 2.6, h, r * 0.5); g.fillStyle = '#e8c04a'; g.fill();
  g.fillStyle = '#131316'; g.fillRect(cx - r * 0.12, cy + r * 0.6, r * 0.24, r * 0.5);
  circle(g, cx, cy, r, '#131316');
  g.fillStyle = '#fff'; for (const dx of [-0.25, 0.25]) { g.beginPath(); g.ellipse(cx + dx * r, cy - r * 0.08, r * 0.08, r * 0.13, 0, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = '#fff'; g.lineWidth = r * 0.07; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy + r * 0.12, r * 0.3, 0.2, Math.PI - 0.2); g.stroke();
  g.restore();
  if (o.text !== false) text(g, o.text || 'SAM', x + w * 0.75, y + h * 0.5, { size: h * 0.16, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: h * 0.02, strokeColor: '#131316', spacing: 6 });
}

// s069 — Sam hides behind a tree, fans peek from every side; MINUS
registerShot('s069', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.45, x: 0, y: 110 }, { z: 1.52, x: 0, y: 115 }, 69);
  const { GY, CX, M } = park(g, t, cam);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX + 10, y: GY + 10, outfit: SAM, pose: { ...POSES.crouch }, expr: 'worried', look: [0, -0.3] });
  });
  layer(g, cam, 1.0, (g) => toonTree(g, CX, GY + 30, 1.3, M, 31, { trunk: 380, w: 200, h: 170 }));
  layer(g, cam, 1.0, (g) => { [[-250, 0, 0.3, 1], [260, 3, 0.6, -1], [-420, 5, 0.9, 1], [430, 1, 1.2, -1]].forEach(([dx, e, d, f], i) => { const k = ease.outBack(clamp(prog(t, d, d + 0.3))); T(g, { t, x: CX + dx * k + (1 - k) * f * -600, y: GY + 20, s: 1.2, facing: f, outfit: EXTRAS[e], pose: PHONE_UP, prop: 'phone', expr: 'excited', off: i }); }); });
  plusMinus(g, t, 0.05, false);
  line(g, t, 'KEIN VERSTECK', E.W * 0.5, E.H * 0.12, { start: 1.2, size: 60 });
} });

// s070 — Paris rooftops at sunset, the camera rises; "PARIS"
registerShot('s070', { draw(g, t, info) {
  const k = travel(t, 0, info.dur, { accel: 0.2, brake: 0.5 }), cam = { z: 1.05 + 0.05 * k, x: -60 + 60 * k, y: 220 - 260 * k };
  paris(g, t, cam);
  kText(g, t, 'PARIS', E.W / 2, E.H * 0.3, { start: 0.5, mode: 'drop', size: 150, font: FONTS.ui, weight: 900, color: '#ffffff' });
} });

// s071 — fashion show hall wide, spotlights sweep; "MODENSCHAU"
registerShot('s071', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: -100, y: -40 }, { z: 1.08, x: 0, y: -20 }, 71);
  const { front } = laufsteg(g, t, cam, {});
  front(g);
  labelBox(g, t, 'MODENSCHAU', E.W * 0.5, E.H * 0.42, { start: 0.15, size: 60 });
} });

// s072 — rows of seats, "200 PLÄTZE"
registerShot('s072', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.3, x: -300, y: 120 }, { z: 1.3, x: 100, y: 120 }, 72);
  const { front } = laufsteg(g, t, cam, {});
  front(g);
  cnt(g, t, { from: 0, to: 200, start: 0.05, dur: 0.8, x: E.W * 0.5, y: E.H * 0.2, label: 'PLÄTZE', size: 110 });
} });

// s073 — outside the doors: a huge crowd pushing, "2000"
registerShot('s073', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: 0, y: 0 }, { z: 1.08, x: 0, y: 20 }, 73);
  const { GY, CX } = paris(g, t, cam);
  layer(g, cam, 0.95, (g) => { rr(g, CX - 260, GY - 460, 520, 460, 10); g.fillStyle = '#2a2440'; g.fill(); rr(g, CX - 200, GY - 400, 400, 400, 6); g.fillStyle = '#fff3d0'; g.fill(); text(g, 'EINGANG', CX, GY - 500, { size: 46, font: FONTS.ui, weight: 900, color: '#ffffff' }); });
  for (let row = 0; row < 3; row++) layer(g, cam, 1 + row * 0.12, (g) => { for (let i = -9; i <= 9; i++) { const push = Math.sin(t * 6 + i + row) * 6; T(g, { t, x: CX + i * 120 + (row % 2) * 60 + push, y: GY + 40 + row * 70, s: 1.0 + row * 0.12, facing: i < 0 ? 1 : -1, outfit: EXTRAS[(i + 9 + row) % 7], pose: i % 3 ? PHONE_UP : POSES.cheer, prop: i % 3 ? 'phone' : null, expr: 'excited', off: i + row, rim: false }); } });
  cnt(g, t, { from: 0, to: 2000, start: 0.1, dur: 1.0, x: E.W * 0.5, y: E.H * 0.16, label: 'MENSCHEN', size: 110, color: '#ef5a4a' });
} });

// s074 — Sam walks the runway, tracking side shot
registerShot('s074', { draw(g, t, info) {
  const sx = -400 + t * 240, cam = { x: sx * 0.9, z: 1.45, y: 100 };
  const { GY, CX, front } = laufsteg(g, t, cam, { stars: true });
  layer(g, cam, 1, (g) => { softEllipse(g, CX + sx, GY - 30, 260, 50, '#fff6d8', 0.6); T(g, { t, x: CX + sx, y: GY - 40, outfit: SAM, pose: walkPose(t * 5.5), expr: 'smile' }); });
  front(g);
} });

// s075 — wide from the end of the runway, "20 m"
registerShot('s075', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 0.95, x: 0, y: -40 }, { z: 1.0, x: 0, y: -30 }, 75);
  const { GY, CX, front } = laufsteg(g, t, cam, { stars: true });
  layer(g, cam, 1, (g) => { T(g, { t, x: CX - 300 + t * 200, y: GY - 40, s: 1.1, outfit: SAM, pose: walkPose(t * 5.5), expr: 'smile' });
    g.strokeStyle = '#f7c948'; g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.moveTo(CX - 700, GY - 420); g.lineTo(CX + 700, GY - 420); g.stroke(); g.setLineDash([]);
    for (const x of [CX - 700, CX + 700]) seg(g, [[x, GY - 450], [x, GY - 390]], 6, '#f7c948'); });
  front(g);
  cnt(g, t, { from: 0, to: 20, start: 0.05, dur: 0.6, x: E.W * 0.5, y: E.H * 0.24, suffix: ' m', label: 'LAUFSTEG', size: 100 });
} });

// s076 — timer "30 s" over the walk
registerShot('s076', { draw(g, t, info) {
  const sx = -100 + t * 240, cam = { x: sx * 0.9, z: 1.6, y: 140 };
  const { GY, CX, front } = laufsteg(g, t, cam, { stars: true });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + sx, y: GY - 40, outfit: SAM, pose: walkPose(t * 5.5), expr: 'smile' }));
  front(g);
  const p = clamp(prog(t, 0.05, 1.2)), x = E.W * 0.82, y = E.H * 0.22; circle(g, x, y, 92, '#ffffff'); circle(g, x, y, 84, '#131316'); g.fillStyle = '#f7c948'; g.beginPath(); g.moveTo(x, y); g.arc(x, y, 78, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); g.fill(); text(g, '30 s', x, y + 4, { size: 54, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: 8, strokeColor: '#131316' });
} });

// s077 — insert: an eye blinking; "15× / MIN"
registerShot('s077', { draw(g, t, info) {
  backdrop(g, ['#3a2f5a', '#5a4a80']);
  const blink = (t % 0.9) > 0.78, x = E.W * 0.38, y = E.H * 0.5;
  g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, y, 300, blink ? 14 : 170, 0, 0, Math.PI * 2); g.fill();
  if (!blink) { circle(g, x + 30, y, 110, '#3f63c8'); circle(g, x + 30, y, 60, '#131316'); circle(g, x + 60, y - 30, 22, '#ffffff'); }
  g.strokeStyle = '#131316'; g.lineWidth = 16; g.beginPath(); g.ellipse(x, y, 300, blink ? 14 : 170, 0, 0, Math.PI * 2); g.stroke();
  cnt(g, t, { from: 0, to: 15, start: 0.3, dur: 1.2, x: E.W * 0.77, y: E.H * 0.42, suffix: '×', label: 'PRO MINUTE', size: 140 });
  labelBox(g, t, 'NORMAL', E.W * 0.77, E.H * 0.18, { start: 0.1, size: 44 });
} });

// s078 — the audience frozen: star eyes, nobody blinks
registerShot('s078', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.9, x: -100, y: 520 }, { z: 2.0, x: -80, y: 525 }, 78, 1);
  const { front } = laufsteg(g, t, cam, { stars: true });
  front(g);
  cnt(g, t, { from: 15, to: 0, start: 0.2, dur: 0.8, x: E.W * 0.5, y: E.H * 0.18, label: 'BLINZELN', size: 110, color: '#ef5a4a' });
} });

// s079 — the photographer: mouth open, finger hovering, not pressing
registerShot('s079', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'laufsteg', setOpt: { front: false }, x: 0.4, veil: '#2a2440', veilA: 0.1, toon: { outfit: FOTOGRAF, expr: 'awe', look: [0.7, -0.2] }, after: (g, x, y, r) => {
    const cx = x + r * 0.95, cy = y + r * 0.2; rr(g, cx - 150, cy - 90, 300, 180, 20); g.fillStyle = '#2a2d34'; g.fill(); circle(g, cx + 40, cy, 70, '#131316'); circle(g, cx + 40, cy, 40, '#3a4a6a'); rr(g, cx - 120, cy - 120, 70, 34, 8); g.fillStyle = '#4a4f58'; g.fill();
    circle(g, cx - 85, cy - 150 - Math.sin(t * 3) * 6, 26, '#131316'); line(g, t, 'KLICK?', E.W * 0.8, E.H * 0.18, { start: 1.0, size: 60 }); } });
} });

// s080 — next morning: newsstand, every paper shows Sam
registerShot('s080', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.5, x: 0, y: 80 }, { z: 1.58, x: 20, y: 85 }, 80);
  const { GY, CX } = street(g, t, cam, { mood: 'afternoon' });
  layer(g, cam, 1, (g) => { rr(g, CX - 520, GY - 480, 1040, 480, 10); g.fillStyle = '#3f9a5a'; g.fill(); rr(g, CX - 540, GY - 540, 1080, 70, 8); g.fillStyle = '#2f7a45'; g.fill(); text(g, 'KIOSK', CX, GY - 505, { size: 44, font: FONTS.ui, weight: 900, color: '#fff' });
    for (let i = 0; i < 5; i++) { const x = CX - 470 + i * 190; rr(g, x, GY - 440, 170, 230, 4); g.fillStyle = '#f6f1e6'; g.fill(); text(g, ['WOW!', 'SAM!', 'WER?', 'SCHÖN', 'TOP'][i], x + 85, GY - 410, { size: 28, font: FONTS.ui, weight: 900, color: '#e0443a' }); poster(g, x + 15, GY - 380, 140, 140, t, { text: false }); } });
  labelBox(g, t, 'AM NÄCHSTEN MORGEN', E.W * 0.5, E.H * 0.12, { start: 0.05 });
} });

// s081 — world map, pins pop all over, "100 LÄNDER"
registerShot('s081', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: 0, y: 0 }, { z: 1.08, x: 0, y: 0 }, 81, 2);
  weltkarte(g, t, cam);
  layer(g, cam, 0.8, (g) => { let n = 0; CONT.forEach((c, ci) => c.forEach(([x, y], i) => { const t0 = 0.15 + (n++) * 0.045, k = ease.outBack(clamp(prog(t, t0, t0 + 0.2))); if (k <= 0) return; const px = E.W / 2 + x * 1.2 + 30, py = E.H / 2 + y * 1.0 + 20;
    g.save(); g.translate(px, py); g.scale(k, k); poster(g, -40, -90, 80, 60, t, { text: false }); seg(g, [[0, -30], [0, 0]], 4, '#2a2d34'); g.restore(); })); });
  cnt(g, t, { from: 0, to: 100, start: 0.2, dur: 1.4, x: E.W * 0.5, y: E.H * 0.13, label: 'LÄNDER', size: 100 });
} });

// s082 — music studio: the singer points at Sam, "IN MEIN VIDEO!"
registerShot('s082', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.5, x: 0, y: 110 }, { z: 1.58, x: 20, y: 115 }, 82);
  const { GY, CX } = studio(g, t, cam);
  layer(g, cam, 1, (g) => { seg(g, [[CX - 330, GY], [CX - 330, GY - 280]], 8, '#2a2d34'); rr(g, CX - 350, GY - 330, 40, 60, 16); g.fillStyle = '#5a5f66'; g.fill();
    const s = { t, x: CX - 180, y: GY, outfit: SAENGERIN, pose: posesSpring(t, [[0, POSES.stand], [0.3, { ...POSES.point, hF: [60, -190] }]]), expr: 'excited', talk: talk(info) };
    T(g, s); bubbleOver(g, s, 'IN MEIN VIDEO!', t, 0.3, { size: 32 });
    T(g, { t, x: CX + 220, y: GY, facing: -1, outfit: SAM, expr: 'surprised', off: 1 }); });
} });

// s083 — a crane lifts a giant poster up a building
registerShot('s083', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 0.95, x: 0, y: -80 }, { z: 1.0, x: 0, y: -160 }, 83);
  const { GY, CX } = street(g, t, cam);
  const k = travel(t, 0.1, info.dur - 0.3);
  layer(g, cam, 0.7, (g) => { rr(g, CX - 380, -900, 760, GY + 860, 4); g.fillStyle = '#d6dfe6'; g.fill(); for (let y = -860; y < GY - 160; y += 110) for (let x = CX - 340; x < CX + 340; x += 120) { g.fillStyle = '#8fb4dc'; g.fillRect(x, y, 90, 70); }
    seg(g, [[CX + 600, GY], [CX + 600, -800]], 26, '#e8a040'); seg(g, [[CX + 600, -800], [CX - 200, -800]], 22, '#e8a040');
    const py = GY - 200 - 800 * k; seg(g, [[CX + 50, -800], [CX + 50, py - 260]], 4, '#2a2d34'); poster(g, CX - 300, py - 260, 700, 420, t);
    labelBox(g, t, 'KONZERN', CX + 600, -830 + 0, { start: 0.2, size: 40 }); });
} });

// s084 — tilt up: the giant billboard of Sam's face, tiny people below; "20 m HOCH"
registerShot('s084', { draw(g, t, info) {
  const k = travel(t, 0, info.dur, { accel: 0.15, brake: 0.6 }), cam = { z: 0.85, x: 0, y: 200 - 500 * k };
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 0.8, (g) => { seg(g, [[CX - 300, GY], [CX - 300, GY - 420]], 24, '#5a5f66'); seg(g, [[CX + 300, GY], [CX + 300, GY - 420]], 24, '#5a5f66'); poster(g, CX - 700, GY - 1250, 1400, 840, t); });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 6; i++) T(g, { t, x: CX - 500 + i * 200, y: GY + 20, s: 0.7, facing: i % 2 ? -1 : 1, outfit: EXTRAS[i], pose: PHONE_UP, prop: 'phone', expr: 'awe' }); });
  cnt(g, t, { from: 0, to: 20, start: 0.4, dur: 0.8, x: E.W * 0.86, y: E.H * 0.5, suffix: ' m', label: 'HOCH', size: 100 });
} });

// s085 — billboard close: the huge smile shimmers; "NUR DU."
registerShot('s085', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 2.2, x: -120, y: -520 }, { z: 2.35, x: -120, y: -520 }, 85, 1);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 0.8, (g) => poster(g, CX - 700, GY - 1250, 1400, 840, t));
  for (let i = 0; i < 7; i++) { const a = (t * 1.3 + i * 0.37) % 1, x = E.W * (0.2 + 0.1 * i), y = E.H * (0.3 + 0.08 * Math.sin(i * 3)); g.save(); g.globalAlpha = Math.sin(a * Math.PI); g.fillStyle = '#ffffff'; poly(g, [[x, y - 30], [x + 8, y - 8], [x + 30, y], [x + 8, y + 8], [x, y + 30], [x - 8, y + 8], [x - 30, y], [x - 8, y - 8]], '#fff6c8'); g.restore(); }
  line(g, t, 'NUR DU.', E.W * 0.5, E.H * 0.85, { start: 0.05, size: 72 });
  line(g, t, 'UND DEIN LÄCHELN.', E.W * 0.5, E.H * 0.85 + 0, { start: wt(info, 'lächeln', 1.0) - 0.4, size: 72, color: '#f7c948' });
} });

// s086 — evening: "DER PREIS"
registerShot('s086', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.0, x: 0, y: -60 }, { z: 1.06, x: 0, y: -60 }, 86), t, 0.25, 12);
  const { GY, CX } = street(g, t, cam, { mood: 'sunset' });
  layer(g, cam, 0.8, (g) => { seg(g, [[CX - 300, GY], [CX - 300, GY - 420]], 24, '#5a5f66'); seg(g, [[CX + 300, GY], [CX + 300, GY - 420]], 24, '#5a5f66'); poster(g, CX - 700, GY - 1250, 1400, 840, t); });
  g.fillStyle = 'rgba(20,20,40,.35)'; g.fillRect(0, 0, E.W, E.H);
  kText(g, t, 'DER PREIS', E.W / 2, E.H * 0.5, { start: 0.15, mode: 'slam', size: 150, font: FONTS.ui, weight: 900, color: '#ef5a4a' });
} });

// s087 — Sam alone under the billboard in the evening; nobody looks at the real Sam
registerShot('s087', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 0.9, x: 0, y: -100 }, { z: 0.94, x: 0, y: -110 }, 87);
  const { GY, CX } = street(g, t, cam, { mood: 'sunset' });
  layer(g, cam, 0.8, (g) => { seg(g, [[CX - 300, GY], [CX - 300, GY - 420]], 24, '#5a5f66'); seg(g, [[CX + 300, GY], [CX + 300, GY - 420]], 24, '#5a5f66'); poster(g, CX - 700, GY - 1250, 1400, 840, t); });
  layer(g, cam, 1, (g) => { T(g, { t, x: CX + 120, y: GY + 30, s: 0.9, outfit: SAM, pose: POSES.sad, expr: 'sad' });
    [[-600, 1], [-400, 1], [500, -1]].forEach(([dx, f], i) => T(g, { t, x: CX + dx + f * t * 60, y: GY + 30, s: 0.9, facing: f, outfit: EXTRAS[i + 2], pose: PHONE_UP, prop: 'phone', expr: 'awe', look: [0, -1] })); });
} });

// s088 — party: Sam sings off-key into a hairbrush, everyone smiles politely
registerShot('s088', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.35, x: -40, y: 90 }, { z: 1.42, x: -20, y: 95 }, 88);
  const { GY, CX } = party(g, t, cam);
  layer(g, cam, 1, (g) => {
    T(g, { t, x: CX - 200, y: GY, outfit: SAM, pose: { ...POSES.holdFront, hF: [26, -200], eF: [24, -160] }, prop: 'mic', expr: 'happy', talk: 0.6 + 0.4 * Math.sin(t * 13) });
    for (let i = 0; i < 4; i++) { const n = (t * 1.6 + i * 0.25) % 1; text(g, '♪', CX - 120 + n * 200 + i * 20, GY - 380 - n * 160, { size: 56, font: FONTS.ui, weight: 900, color: alpha('#e0443a', 1 - n) }); }
    [[150, 0], [340, 3], [530, 6]].forEach(([dx, e], i) => T(g, { t, x: CX + dx, y: GY, s: 1.2, facing: -1, outfit: EXTRAS[e], expr: 'wince', look: [-0.6, 0], off: i }));
  });
  line(g, t, 'NIE WIEDER DIE WAHRHEIT', E.W * 0.5, E.H * 0.12, { start: 0.6, size: 56 });
} });

// s089 — friends give thumbs up with star eyes
registerShot('s089', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.6, x: 260, y: 130 }, { z: 1.66, x: 280, y: 135 }, 89);
  const { GY, CX } = party(g, t, cam);
  layer(g, cam, 1, (g) => { [[150, 0], [340, 3], [530, 6]].forEach(([dx, e], i) => { const o = { t, x: CX + dx, y: GY, s: 1.2, facing: -1, outfit: EXTRAS[e], pose: posesSpring(t, [[0, POSES.stand], [0.2 + i * 0.12, POSES.cheer]]), expr: 'excited', off: i }; T(g, o); bubbleOver(g, o, ['SUPER!', 'TOLL!', 'BRAVO!'][i], t, 0.3 + i * 0.12, { size: 28 }); }); });
} });

// s090 — paper note "DAS WAR SCHLECHT" gets crossed out
registerShot('s090', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 0, y: 40 }, { z: 1.26, x: 0, y: 45 }, 90);
  party(g, t, cam); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, E.W, E.H);
  paperNote(g, t, 'DAS WAR SCHLECHT.', E.W / 2, E.H * 0.48, { start: 0.1, size: 90, rot: -0.04 });
  const p = clamp(prog(t, 0.9, 1.4)); if (p > 0) { g.strokeStyle = '#e0443a'; g.lineWidth = 18; g.lineCap = 'round'; g.beginPath(); g.moveTo(E.W * 0.22, E.H * 0.5); g.lineTo(E.W * (0.22 + 0.56 * p), E.H * (0.5 - 0.04 * p)); g.stroke(); }
  line(g, t, 'SAGT NIEMAND', E.W / 2, E.H * 0.78, { start: 1.0, size: 64 });
} });

// s091 — whiteboard: brain drawing, "BELOHNUNGSSYSTEM" lights up gold
registerShot('s091', { draw(g, t, info) {
  boardShot(g, t, info, (g, x, y, w, h) => {
    const cx = x + w * 0.3, cy = y + h * 0.55, on = clamp(prog(t, wt(info, 'belohnungssystem', 1.6) - 0.2, wt(info, 'belohnungssystem', 1.6) + 0.4));
    g.fillStyle = '#f2c4c8'; g.beginPath(); g.ellipse(cx, cy, 170, 110, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#c47a84'; g.lineWidth = 6; g.stroke();
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(cx - 110 + i * 55, cy - 20 + (i % 2) * 30, 40, 0.3, 2.6); g.stroke(); }
    if (on > 0) { g.save(); g.globalAlpha = on; circle(g, cx + 40, cy + 30, 50, '#f7c948'); g.restore(); }
    hand(g, 'BELOHNUNGS-', x + w * 0.72, y + h * 0.42, 52, on > 0 ? '#c8961a' : '#2c4a8a'); hand(g, 'SYSTEM', x + w * 0.72, y + h * 0.62, 52, on > 0 ? '#c8961a' : '#2c4a8a');
  });
  labelBox(g, t, 'DER GRUND?', E.W * 0.5, E.H * 0.1, { start: 0.05 });
} });

// s092 — people crowd around Sam to please, offering cups and snacks
registerShot('s092', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 0, y: 100 }, { z: 1.46, x: 0, y: 100 }, 92);
  const { GY, CX } = party(g, t, cam);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX, y: GY + 10, outfit: SAM, expr: 'nervous' });
    [[-420, 0, 'cup'], [-230, 3, 'box'], [240, 6, 'cup'], [440, 1, 'cash']].forEach(([dx, e, p], i) => { const k = ease.outBack(clamp(prog(t, 0.05 * i, 0.05 * i + 0.4))); T(g, { t, x: CX + dx * (1.6 - 0.6 * k), y: GY, s: 1.2, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[e], pose: { ...POSES.reach, hF: [64, -170] }, prop: p, expr: 'excited', off: i }); }); });
} });

// s093 — applause; "APPLAUS" ≠ "EHRLICHKEIT"
registerShot('s093', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: 0, y: 60 }, { z: 1.3, x: 0, y: 60 }, 93);
  const { GY, CX } = party(g, t, cam);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX, y: GY + 10, outfit: SAM, pose: POSES.shrug, expr: 'worried' });
    [[-500, 0], [-300, 3], [300, 6], [500, 1]].forEach(([dx, e], i) => { const clap = Math.abs(Math.sin(t * 12 + i)) * 20; T(g, { t, x: CX + dx, y: GY, s: 1.2, facing: dx < 0 ? 1 : -1, outfit: EXTRAS[e], pose: { ...POSES.holdFront, hF: [30 - clap * 0.5, -170], hB: [20 + clap * 0.5, -168] }, expr: 'happy', off: i }); }); });
  labelBox(g, t, 'APPLAUS', E.W * 0.3, E.H * 0.14, { start: 0.1, bg: '#3fae5a', color: '#fff', border: '#fff' });
  line(g, t, 'STATT', E.W * 0.5, E.H * 0.14, { start: 0.6, size: 50 });
  labelBox(g, t, 'EHRLICHKEIT', E.W * 0.7, E.H * 0.14, { start: 0.9 });
  mark(g, t, 1.2, E.W * 0.7, E.H * 0.14, 90, false, 0.12);
} });

// s094 — a calendar: 365 days, "NEIN: 0"
registerShot('s094', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.1, x: 0, y: 30 }, { z: 1.16, x: 0, y: 30 }, 94);
  regel(g, t, cam);
  const x = E.W * 0.32, y = E.H * 0.5; rr(g, x - 230, y - 250, 460, 500, 24); g.fillStyle = '#ffffff'; g.fill(); rr(g, x - 230, y - 250, 460, 110, 24); g.fillStyle = '#e0443a'; g.fill(); g.fillStyle = '#e0443a'; g.fillRect(x - 230, y - 180, 460, 40);
  const day = Math.min(365, Math.floor(1 + 364 * ease.inOut(clamp(prog(t, 0.2, 2.0)))));
  text(g, 'TAG', x, y - 190, { size: 44, font: FONTS.ui, weight: 900, color: '#ffffff' }); text(g, String(day), x, y + 60, { size: 190, font: FONTS.ui, weight: 900, color: '#1b1b20' });
  labelBox(g, t, 'EIN GANZES JAHR', E.W * 0.32, E.H * 0.1, { start: 0.05 });
  cnt(g, t, { from: 0, to: 0, start: 1.0, dur: 0.1, x: E.W * 0.72, y: E.H * 0.48, label: 'MAL „NEIN“', size: 220, color: '#ef5a4a' });
} });

// s095 — night bedroom: Sam at the mirror, thinking
function mirror(g, x, y, w, h, inner) { rr(g, x - 16, y - 16, w + 32, h + 32, w * 0.5); g.fillStyle = '#c99a5a'; g.fill(); rr(g, x, y, w, h, w * 0.46); g.fillStyle = '#b9d0e6'; g.fill(); g.save(); rr(g, x, y, w, h, w * 0.46); g.clip(); if (inner) inner(); g.fillStyle = 'rgba(255,255,255,.18)'; poly(g, [[x + w * 0.1, y + h], [x + w * 0.4, y], [x + w * 0.55, y], [x + w * 0.25, y + h]], 'rgba(255,255,255,.16)'); g.restore(); }
registerShot('s095', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.35, x: -60, y: 90 }, { z: 1.45, x: -40, y: 100 }, 95);
  const { GY, CX } = bedroom(g, t, cam, { night: true });
  layer(g, cam, 0.99, (g) => mirror(g, CX + 120, GY - 560, 300, 520, () => { g.save(); g.translate(2 * (CX + 270), 0); g.scale(-1, 1); T(g, { t, x: CX + 220, y: GY + 80, s: 1.1, outfit: SAM, pose: POSES.think, expr: 'thinking', rim: false }); g.restore(); }));
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 160, y: GY + 20, outfit: SAM, pose: POSES.think, expr: 'thinking', look: [0.8, -0.1] }));
  line(g, t, 'WAS ZÄHLT WIRKLICH?', E.W * 0.5, E.H * 0.12, { start: 1.2, size: 60 });
} });

// s096 — mirror close: "WER MAG DICH?" / "WER NUR DEIN GESICHT?"
registerShot('s096', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bedroom', veil: '#1b2447', veilA: 0.25, x: 0.5, r: 230, toon: { outfit: SAM, expr: 'worried', look: [0, 0] } });
  labelBox(g, t, 'WER MAG DICH?', E.W * 0.22, E.H * 0.3, { start: 0.1, size: 48 });
  labelBox(g, t, 'WER NUR DEIN GESICHT?', E.W * 0.78, E.H * 0.8, { start: wt(info, 'wer', 1.3) > 0.5 ? wt(info, 'und', 1.3) : 1.3, size: 48 });
} });

// s097 — rain on the window, Sam alone on the bed; "NIE FEHLER = NIE LERNEN"
function rainOver(g, t, a = 0.5) { g.save(); g.strokeStyle = alpha('#cfe0ff', a); g.lineWidth = 3; for (let i = 0; i < 80; i++) { const x = (i * 97.3 + t * 300) % (E.W + 200) - 100, y = (i * 53.7 + t * 1400) % (E.H + 200) - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 40); g.stroke(); } g.restore(); }
registerShot('s097', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: -40, y: 60 }, { z: 1.32, x: -40, y: 70 }, 97);
  const { GY, CX } = bedroom(g, t, cam, { night: true });
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 120, y: GY - 60, outfit: SAM, pose: POSES.sit, expr: 'sad', look: [0.3, 0.5] }));
  g.fillStyle = 'rgba(30,40,80,.18)'; g.fillRect(0, 0, E.W, E.H); rainOver(g, t, 0.35);
  labelBox(g, t, 'KEINE FEHLER = KEIN LERNEN', E.W * 0.5, E.H * 0.12, { start: 0.3, size: 48 });
} });

// s098 — giant close-up: Sam sad in the rain light; "EINSAM" + "GEFÄHRLICH"
registerShot('s098', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'bedroom', veil: '#1b2447', veilA: 0.3, x: 0.4, toon: { outfit: SAM, expr: ex(t, 'sad', [1.8, 'cry']), look: [0.4, 0.3] } });
  rainOver(g, t, 0.25);
  labelBox(g, t, 'EINSAM', E.W * 0.75, E.H * 0.35, { start: wt(info, 'einsam', 0.6) - 0.05 });
  labelBox(g, t, 'GEFÄHRLICH', E.W * 0.75, E.H * 0.52, { start: wt(info, 'gefährlich', 1.4) - 0.05 });
} });
