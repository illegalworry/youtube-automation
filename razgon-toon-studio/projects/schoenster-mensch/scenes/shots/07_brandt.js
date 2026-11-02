// shots/07_brandt.js — Act 5: Brandt's offer, the accusation, the live press conference, the truth.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha, seg, poly, backdrop } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { posesSpring, fg, travel, kText, impact } from '/engine/motion.js';
import { street, garage, softEllipse } from '/engine/toonsets.js';
import { labelBox, sticker, paperNote } from '/engine/toonui.js';
import { agentur, tatort, pressesaal, tueren, regel, haustuer, wohnzimmer } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, line, cnt, stamp, heart, talk, mark } from '../sets/kit.js';
import { knockCode, FURCHTBAR } from './06_jonas.js';
import { SAM, JONAS, BRANDT, EXTRAS } from '../cast.js';

const PHONE_UP = { ...POSES.holdFront, hF: [34, -196], eF: [26, -160] };
// small portrait card of Jonas (photo pinned on boards, split screens)
function jonasCard(g, x, y, w, h, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); rr(g, -w / 2 - 8, -h / 2 - 8, w + 16, h + 16, 6); g.fillStyle = '#f6f1e6'; g.fill(); g.fillStyle = '#8cc4ea'; g.fillRect(-w / 2, -h / 2, w, h);
  g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); rr(g, -w * 0.32, h * 0.12, w * 0.64, h * 0.6, w * 0.12); g.fillStyle = '#3f9a5a'; g.fill(); circle(g, 0, -h * 0.08, w * 0.24, '#131316');
  g.fillStyle = '#f08a2c'; g.beginPath(); g.arc(0, -h * 0.12, w * 0.25, Math.PI, 0); g.fill(); g.fillRect(-w * 0.4, -h * 0.14, w * 0.2, h * 0.04); g.restore(); g.restore(); }
function contract(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -90, -120, 180, 240, 6); g.fillStyle = '#fbfaf5'; g.fill(); text(g, 'VERTRAG', 0, -88, { size: 28, font: FONTS.ui, weight: 900, color: '#2a2440' }); g.fillStyle = '#c9d6e8'; for (let i = 0; i < 6; i++) g.fillRect(-70, -50 + i * 22, 140, 4); seg(g, [[-60, 90], [60, 80]], 3, '#2a2440'); g.restore(); }

// s113 — the glass tower "BRANDT AGENTUR", tilt up
registerShot('s113', { draw(g, t, info) {
  const k = travel(t, 0, info.dur, { accel: 0.2, brake: 0.5 });
  agentur(g, t, { z: 0.9, x: 0, y: 200 - 1100 * k }, { tower: true });
  line(g, t, 'HERR BRANDT', E.W * 0.5, E.H * 0.86, { start: 0.4, size: 70, color: '#c9a2f0' });
} });

// s114 — top-floor office: Brandt behind the desk; "GRÖSSTE AGENTUR DER STADT"
registerShot('s114', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: 160, y: 60 }, { z: 1.35, x: 180, y: 75 }, 114);
  const { GY, CX, front } = agentur(g, t, cam, { deskX: 220 });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 260, y: GY - 60, s: 1.3, facing: -1, outfit: BRANDT, pose: posesSpring(t, [[0, POSES.sit], [0.8, { ...POSES.sit, hF: [40, -200], eF: [30, -170], hB: [-20, -200] }]]), expr: 'smirk' }));
  front(g);
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 340, y: GY + 30, outfit: SAM, expr: 'neutral', look: [0.7, 0], off: 2 }));
  labelBox(g, t, 'GRÖSSTE AGENTUR DER STADT', E.W * 0.5, E.H * 0.1, { start: 0.4, size: 44 });
} });

// s115 — Brandt slides a contract across; "10.000.000 €"
registerShot('s115', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.6, x: 160, y: 130 }, { z: 1.68, x: 140, y: 135 }, 115);
  const { GY, CX, front } = agentur(g, t, cam, { deskX: 220 });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 320, y: GY - 60, s: 1.3, facing: -1, outfit: BRANDT, pose: { ...POSES.sit, hF: [70, -150], eF: [40, -160] }, expr: 'sly', talk: talk(info, 0, 1) }));
  front(g);
  const k = ease.out(clamp(prog(t, 0.2, 0.8)));
  layer(g, cam, 1.02, (g) => { g.save(); g.translate(CX + 160 - 240 * k, GY - 218); g.transform(1, 0, -0.4, 0.3, 0, 0); contract(g, 0, 0, 1); g.restore(); });
  cnt(g, t, { from: 0, to: 10000000, start: wt(info, '10', 1.0) - 0.1, dur: 1.0, x: E.W * 0.5, y: E.H * 0.2, suffix: ' €', size: 110 });
  labelBox(g, t, 'SEIN ANGEBOT?', E.W * 0.15, E.H * 0.08, { start: 0.05, size: 36 });
} });

// s116 — "3 JAHRE"
registerShot('s116', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.3, x: 0, y: 40 }, { z: 1.34, x: 0, y: 40 }, 116), t, 0.1, 8);
  agentur(g, t, cam, { desk: false }); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, E.W, E.H);
  kText(g, t, '3 JAHRE', E.W / 2, E.H * 0.5, { start: 0.0, mode: 'slam', size: 170, font: FONTS.ui, weight: 900, color: '#f7c948' });
} });

// s117 — montage: Sam's face on every billboard in the city
function miniPoster(g, x, y, w, h) { rr(g, x - 6, y - 6, w + 12, h + 12, 4); g.fillStyle = '#2a2d34'; g.fill(); g.fillStyle = '#8cc4ea'; g.fillRect(x, y, w, h); g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); rr(g, x + w * 0.3, y + h * 0.6, w * 0.4, h * 0.6, w * 0.08); g.fillStyle = '#e8c04a'; g.fill(); circle(g, x + w * 0.5, y + h * 0.42, h * 0.24, '#131316'); g.strokeStyle = '#fff'; g.lineWidth = h * 0.025; g.beginPath(); g.arc(x + w * 0.5, y + h * 0.46, h * 0.09, 0.3, Math.PI - 0.3); g.stroke(); g.restore(); }
registerShot('s117', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 0.9, x: -300, y: -60 }, { z: 0.95, x: 300, y: -60 }, 117);
  const { GY, CX } = street(g, t, cam);
  layer(g, cam, 0.7, (g) => { [[-1400, -420], [-800, -520], [-200, -450], [400, -560], [1000, -470], [1600, -530]].forEach(([dx, dy], i) => { const k = ease.outBack(clamp(prog(t, 0.1 + i * 0.2, 0.4 + i * 0.2))); if (k <= 0) return; seg(g, [[CX + dx + 160, GY], [CX + dx + 160, GY + dy + 180]], 14, '#5a5f66'); g.save(); g.translate(CX + dx + 160, GY + dy + 100); g.scale(k, k); miniPoster(g, -160, -110, 320, 200); g.restore(); }); });
  labelBox(g, t, 'AUF JEDEM PLAKAT', E.W * 0.5, E.H * 0.88, { start: 0.3 });
} });

// s118 — giant close-up: Brandt smirks; "DER HAKEN"
registerShot('s118', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'agentur', setOpt: { desk: false }, x: 0.4, veil: '#2a2440', veilA: 0.12, toon: { outfit: BRANDT, expr: 'sly', look: [0.4, 0] }, after: () => kText(g, t, 'DER HAKEN', E.W * 0.76, E.H * 0.3, { start: 0.25, mode: 'slam', size: 90, font: FONTS.ui, weight: 900, color: '#ef5a4a' }) });
} });

// s119 — Brandt pins a photo of Jonas on the board; stamp "VERDÄCHTIG"
registerShot('s119', { draw(g, t, info) {
  const pin = 0.6, cam = hitCam(mv(t, info.dur, { z: 1.45, x: -320, y: 40 }, { z: 1.52, x: -320, y: 50 }, 119), t, pin, 8);
  const { GY, CX } = agentur(g, t, cam, { desk: false, board: (g, x, y, w, h) => { if (t > pin) { jonasCard(g, x + w / 2, y + h / 2, 160, 190, -0.06); circle(g, x + w / 2, y + h / 2 - 100, 12, '#e0443a'); } } });
  layer(g, cam, 1, (g) => T(g, { t, x: CX - 230, y: GY, outfit: BRANDT, facing: -1, pose: posesSpring(t, [[0, { ...POSES.reach, hF: [70, -200] }], [pin, { ...POSES.point, hF: [70, -240] }]]), expr: 'smirk', look: [-0.6, -0.3] }));
  stamp(g, t, pin + 0.3, 'VERDÄCHTIG', E.W * 0.68, E.H * 0.4, { size: 80 });
  labelBox(g, t, 'JONAS', E.W * 0.68, E.H * 0.18, { start: 0.1 });
} });

// s120 — the studio at night, the safe door open
registerShot('s120', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 40, y: 40 }, { z: 1.3, x: 80, y: 60 }, 120);
  tatort(g, t, cam, { open: ease.out(clamp(prog(t, 0.1, 0.8))) });
  labelBox(g, t, 'DIEBSTAHL IM STUDIO', E.W * 0.5, E.H * 0.12, { start: 0.2 });
} });

// s121 — clock "00:00"
registerShot('s121', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.3, x: 40, y: 40 }, { z: 1.36, x: 40, y: 40 }, 121);
  tatort(g, t, cam, {}); g.fillStyle = 'rgba(10,10,30,.35)'; g.fillRect(0, 0, E.W, E.H);
  const x = E.W / 2, y = E.H * 0.47, a = -Math.PI / 2 + clamp(prog(t, 0, 0.7)) * 0.2; circle(g, x, y, 230, '#ffffff'); circle(g, x, y, 214, '#f6f1e6'); for (let i = 0; i < 12; i++) { const b = i / 12 * Math.PI * 2; seg(g, [[x + Math.cos(b) * 180, y + Math.sin(b) * 180], [x + Math.cos(b) * 200, y + Math.sin(b) * 200]], 8, '#2a2440'); }
  seg(g, [[x, y], [x + Math.cos(-Math.PI / 2) * 120, y + Math.sin(-Math.PI / 2) * 120]], 16, '#2a2440'); seg(g, [[x, y], [x + Math.cos(a) * 170, y + Math.sin(a) * 170]], 10, '#e0443a'); circle(g, x, y, 14, '#2a2440');
  labelBox(g, t, '00:00', E.W * 0.5, E.H * 0.88, { start: 0.1, size: 60 });
} });

// s122 — the empty safe, "50.000 €"
registerShot('s122', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 2.0, x: 120, y: -50 }, { z: 2.1, x: 120, y: -50 }, 122, 2);
  tatort(g, t, cam, {});
  cnt(g, t, { from: 0, to: 50000, start: 0.1, dur: 0.9, x: E.W * 0.5, y: E.H * 0.2, suffix: ' €', size: 120, color: '#5fd39a' });
} });

// s123 — smash: the counter crashes, "WEG"
registerShot('s123', { draw(g, t, info) {
  const im = impact(t, 0.02, { amp: 18 }); g.save(); g.translate(im.x, im.y);
  tatort(g, t, { z: 2.0, x: 120, y: -50 }, {}); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-50, -50, E.W + 100, E.H + 100);
  text(g, 'WEG!', E.W / 2, E.H * 0.5, { size: 220, font: FONTS.ui, weight: 900, color: '#ef5a4a', stroke: 26, strokeColor: '#141418' }); g.restore();
} });

// s124 — giant close-up: Sam, determined — "DU WEISST DIE WAHRHEIT"
registerShot('s124', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'agentur', setOpt: { desk: false }, x: 0.42, toon: { outfit: SAM, expr: 'determined', look: [0.5, 0] }, after: () => line(g, t, 'DU WEISST DIE WAHRHEIT.', E.W * 0.5, E.H * 0.9, { start: 0.2, size: 56 }) });
} });

// s125/s126 — flashback night: gaming on the couch; the clock spins, "DIE GANZE NACHT"
function gaming(g, t, info, spin) {
  const cam = mv(t, info.dur, { z: 1.5, x: 0, y: 130 }, { z: 1.56, x: 0, y: 130 }, 125, 2);
  const { GY, CX, front } = wohnzimmer(g, t, cam, { tv: true, pizza: true });
  layer(g, cam, 1, (g) => { const ctrl = { ...POSES.sit, hF: [36, -150], eF: [30, -130], hB: [26, -150], eB: [10, -130] };
    T(g, { t, x: CX - 160, y: GY - 70, outfit: SAM, pose: ctrl, expr: 'excited', look: [-0.2, 0.3] }); T(g, { t, x: CX + 160, y: GY - 70, outfit: JONAS, pose: ctrl, expr: 'determined', look: [-0.2, 0.3], off: 1 }); });
  front(g);
  g.fillStyle = 'rgba(255,220,160,.12)'; g.fillRect(0, 0, E.W, E.H);
  if (spin) { const x = E.W * 0.84, y = E.H * 0.24; circle(g, x, y, 100, '#ffffff'); circle(g, x, y, 92, '#f6f1e6'); const a = t * 6; seg(g, [[x, y], [x + Math.cos(a / 12) * 50, y + Math.sin(a / 12) * 50]], 10, '#2a2440'); seg(g, [[x, y], [x + Math.cos(a) * 75, y + Math.sin(a) * 75]], 6, '#e0443a'); labelBox(g, t, 'DIE GANZE NACHT', E.W * 0.4, E.H * 0.12, { start: 0.1 }); }
  else labelBox(g, t, 'JONAS WAR BEI DIR', E.W * 0.5, E.H * 0.12, { start: 0.15 });
}
registerShot('s125', { draw(g, t, info) { gaming(g, t, info, false); } });
registerShot('s126', { draw(g, t, info) { gaming(g, t, info, true); } });

// s127 — press hall: rows of cameras, LIVE
registerShot('s127', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: -100, y: 0 }, { z: 1.08, x: 0, y: 20 }, 127);
  const { front } = pressesaal(g, t, cam, { cams: true, flash: true });
  front(g);
  labelBox(g, t, 'DIE PRESSE WARTET', E.W * 0.5, E.H * 0.9, { start: 0.2 });
} });

// s128 — "20.000.000 ZUSCHAUER"
registerShot('s128', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.15, x: 0, y: 0 }, { z: 1.2, x: 0, y: 10 }, 128);
  const { front } = pressesaal(g, t, cam, { cams: true, flash: true }); front(g);
  g.fillStyle = 'rgba(10,15,40,.35)'; g.fillRect(0, 0, E.W, E.H);
  labelBox(g, t, '● LIVEÜBERTRAGUNG', E.W * 0.5, E.H * 0.25, { start: 0.05, bg: '#e8443a', color: '#ffffff', border: '#ffffff' });
  cnt(g, t, { from: 0, to: 20000000, start: wt(info, '20', 1.2) - 0.1, dur: 1.2, x: E.W * 0.5, y: E.H * 0.52, label: 'ZUSCHAUER', size: 130 });
} });

// s129 — countdown "60 s"
registerShot('s129', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 0, y: 60 }, { z: 1.45, x: 0, y: 60 }, 129);
  pressesaal(g, t, cam, {}); g.fillStyle = 'rgba(10,15,40,.4)'; g.fillRect(0, 0, E.W, E.H);
  const v = Math.max(0, 60 - Math.floor(t * 1.0)); const x = E.W / 2, y = E.H * 0.5; circle(g, x, y, 200, '#ffffff'); circle(g, x, y, 186, '#131316');
  g.fillStyle = '#e0443a'; g.beginPath(); g.moveTo(x, y); g.arc(x, y, 176, -Math.PI / 2, -Math.PI / 2 + (v / 60) * Math.PI * 2); g.fill(); circle(g, x, y, 130, '#131316');
  text(g, v + ' s', x, y + 6, { size: 110, font: FONTS.ui, weight: 900, color: '#ffffff' }); labelBox(g, t, 'NOCH', x, y - 260, { start: 0.05 });
} });

// s130 — backstage: Brandt leans in and whispers to Sam
registerShot('s130', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.65, x: 0, y: 150 }, { z: 1.75, x: 0, y: 155 }, 130);
  const { GY, CX } = pressesaal(g, t, cam, { backstage: true });
  const say = wt(info, 'sag', 1.2);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX - 130, y: GY, outfit: SAM, expr: ex(t, 'neutral', [say, 'worried']), look: [0.6, 0] });
    const b = { t, x: CX + 110, y: GY, facing: -1, outfit: BRANDT, pose: { ...POSES.stand, head: [24, -200], sh: [10, -172], hF: [30, -210], eF: [24, -170] }, expr: 'sly', talk: talk(info, say), look: [-1, 0] }; T(g, b);
    bubbleOver(g, b, 'SAG, DU HAST JONAS GESEHEN.', t, say, { size: 28, dx: -100 }); });
  labelBox(g, t, 'BRANDT FLÜSTERT', E.W * 0.5, E.H * 0.1, { start: 0.1, size: 42 });
} });

// s131 — "MIT DEM GELD."
registerShot('s131', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.9, x: 80, y: 200 }, { z: 1.96, x: 90, y: 200 }, 131);
  const { GY, CX } = pressesaal(g, t, cam, { backstage: true });
  layer(g, cam, 1, (g) => { const b = { t, x: CX + 110, y: GY, facing: -1, outfit: BRANDT, pose: { ...POSES.stand, head: [24, -200], sh: [10, -172], hF: [50, -170], eF: [30, -160] }, prop: 'cash', expr: 'sly', talk: talk(info) }; T(g, b); bubbleOver(g, b, 'MIT DEM GELD.', t, 0.05, { size: 32, dx: -40 }); });
} });

// s132 — giant close-up: Brandt, "DIR GLAUBT JEDER."
registerShot('s132', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'pressesaal', setOpt: { backstage: true }, x: 0.58, toon: { outfit: BRANDT, expr: 'sly', talk: talk(info), look: [-0.6, 0] }, after: () => line(g, t, 'DIR GLAUBT JEDER.', E.W * 0.28, E.H * 0.22, { start: 0.05, size: 62 }) });
} });

// s133 — giant close-up: Sam worried; "ER HAT RECHT."
registerShot('s133', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'pressesaal', setOpt: { backstage: true }, x: 0.42, toon: { outfit: SAM, expr: ex(t, 'worried', [1.3, 'scared']), look: [0.4, 0.2] }, after: () => { line(g, t, 'ER HAT RECHT.', E.W * 0.74, E.H * 0.25, { start: 0.1, size: 60 }); line(g, t, 'DAS IST DAS SCHLIMMSTE.', E.W * 0.5, E.H * 0.9, { start: wt(info, 'das', 1.2) - 0.05, size: 52, color: '#ef5a4a' }); } });
} });

// s134 — heart graphic pulsing, "70 / MIN"
registerShot('s134', { draw(g, t, info) {
  backdrop(g, ['#3a1f2a', '#5a2a3a']);
  const beat = (t * 70 / 60) % 1, k = 1 + 0.18 * Math.exp(-beat * 8);
  heart(g, E.W * 0.35, E.H * 0.5, 5 * k, '#e8443a');
  g.strokeStyle = '#ffffff'; g.lineWidth = 6; g.beginPath(); for (let x = 0; x < E.W; x += 8) { const p = ((x / E.W) * 3 - t * 1.2) % 1, yy = E.H * 0.85 - (Math.abs(p - 0.5) < 0.03 ? 80 * Math.sin((p - 0.47) * 100) : 0); x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke();
  cnt(g, t, { from: 0, to: 70, start: 0.1, dur: 0.9, x: E.W * 0.72, y: E.H * 0.45, label: 'HERZSCHLÄGE / MIN', size: 160, color: '#ffffff' });
} });

// s135 — giant close-up: Sam, the heartbeat pulses the frame
registerShot('s135', { draw(g, t, info) {
  const beat = (t * 70 / 60) % 1, k = Math.exp(-beat * 8);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(1 + 0.015 * k, 1 + 0.015 * k); g.translate(-E.W / 2, -E.H / 2);
  closeUp(g, t, info, { set: 'pressesaal', setOpt: { backstage: true }, x: 0.5, push: 0.06, toon: { outfit: SAM, expr: 'nervous', look: [0, 0] } }); g.restore();
  g.fillStyle = alpha('#e8443a', 0.12 * k); g.fillRect(0, 0, E.W, E.H);
  line(g, t, 'JEDEN EINZELNEN', E.W * 0.5, E.H * 0.12, { start: 0.3, size: 60 });
} });

// s136 — callback: the hallway doors swing open
registerShot('s136', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.15, x: -60, y: 40 }, { z: 1.25, x: 0, y: 50 }, 136);
  const { GY, CX } = tueren(g, t, cam, { open: (i) => ease.outBack(clamp(prog(t, 0.2 + Math.abs(i) * 0.12, 0.6 + Math.abs(i) * 0.12))) });
  layer(g, cam, 1, (g) => T(g, { t, x: CX, y: GY + 30, outfit: SAM, expr: 'neutral' }));
  line(g, t, 'DEIN GESICHT ÖFFNET JEDE TÜR.', E.W * 0.5, E.H * 0.12, { start: 0.2, size: 56 });
} });

// s137 — the doors slam shut; "BEWEIST NICHTS"
registerShot('s137', { draw(g, t, info) {
  const slam = 0.35, cam = hitCam(mv(t, info.dur, { z: 1.25, x: 0, y: 50 }, { z: 1.3, x: 0, y: 55 }, 137), t, slam, 14);
  const { GY, CX } = tueren(g, t, cam, { open: () => 1 - ease.in(clamp(prog(t, 0, slam))) });
  layer(g, cam, 1, (g) => T(g, { t, x: CX, y: GY + 30, outfit: SAM, expr: ex(t, 'neutral', [slam, 'surprised']) }));
  kText(g, t, 'BEWEIST NICHTS', E.W / 2, E.H * 0.16, { start: slam, mode: 'slam', size: 100, font: FONTS.ui, weight: 900, color: '#ef5a4a' });
} });

// s138 — split: the contract (10 Mio) vs. a photo of Jonas
registerShot('s138', { draw(g, t, info) {
  backdrop(g, ['#2a2440', '#3a3460']);
  const k1 = pop(t, 0.05), k2 = pop(t, wt(info, 'jonas', 0.8) - 0.1);
  g.fillStyle = '#9a5ad0'; g.fillRect(0, 0, E.W / 2 - 6, E.H); g.fillStyle = '#3f9a5a'; g.fillRect(E.W / 2 + 6, 0, E.W / 2, E.H);
  if (k1 > 0) { g.save(); g.translate(E.W * 0.25, E.H * 0.48); g.scale(k1, k1); contract(g, 0, 0, 1.8, -0.06); g.restore(); labelBox(g, t, '10 MIO €', E.W * 0.25, E.H * 0.84, { start: 0.1 }); }
  if (k2 > 0) { g.save(); g.translate(E.W * 0.75, E.H * 0.46); g.scale(k2, k2); jonasCard(g, 0, 0, 300, 360, 0.05); g.restore(); labelBox(g, t, 'JONAS', E.W * 0.75, E.H * 0.84, { start: k2 > 0 ? wt(info, 'jonas', 0.8) : 9 }); }
  line(g, t, 'ODER', E.W / 2, E.H * 0.48, { start: wt(info, 'oder', 0.5) - 0.05, size: 90, color: '#f7c948' });
} });

// s139 — a row of pretty faces slides past
registerShot('s139', { draw(g, t, info) {
  const cam = { z: 1.2, x: -600 + t * 420, y: 40 };
  const { GY, CX } = regel(g, t, cam, { sky: ['#e8a0b4', '#f6d2dc', '#fff0f4'] });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 12; i++) T(g, { t, x: CX - 1400 + i * 260, y: GY, s: 1.2, outfit: { ...EXTRAS[i % 7], face: 'sunglasses' }, pose: i % 2 ? POSES.relaxed : POSES.wave, expr: 'smile', off: i }); });
  line(g, t, 'SCHÖNE GESICHTER GIBT ES VIELE.', E.W * 0.5, E.H * 0.13, { start: 0.2, size: 60 });
} });

// s140 — only Jonas stays: "NUR EINMAL"
registerShot('s140', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 0, y: 100 }, { z: 1.55, x: 0, y: 120 }, 140);
  const { GY, CX } = regel(g, t, cam);
  layer(g, cam, 1, (g) => { softEllipse(g, CX, GY - 160, 300, 320, '#fff3c8', 0.5); T(g, { t, x: CX, y: GY, outfit: JONAS, pose: POSES.crossArms, expr: 'grin' }); });
  line(g, t, 'EINEN JONAS GIBT ES NUR EINMAL.', E.W * 0.5, E.H * 0.13, { start: 0.15, size: 60, color: '#f7c948' });
} });

// s141 — Sam walks onto the stage to the podium, cameras flash
registerShot('s141', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: -60, y: 0 }, { z: 1.08, x: 0, y: 20 }, 141);
  const { GY, CX, front } = pressesaal(g, t, cam, { cams: true, flash: true });
  const k = travel(t, 0, info.dur);
  layer(g, cam, 0.995, (g) => T(g, { t, x: CX - 700 + 520 * k, y: GY - 50, outfit: SAM, pose: walkPose(t * 5), expr: 'nervous' }));
  front(g);
} });

// s142 — giant close-up: Sam nervous, swallows; "DEIN MUND IST TROCKEN"
registerShot('s142', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'pressesaal', setOpt: { podium: false }, x: 0.45, toon: { outfit: SAM, expr: 'nervous', look: [0.3, 0.3] }, hit: 0.7, hitAmp: 3, after: () => line(g, t, 'MUND TROCKEN', E.W * 0.77, E.H * 0.24, { start: 0.3, size: 60 }) });
} });

// s143 — Brandt in the wings smiles
registerShot('s143', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.7, x: 420, y: 130 }, { z: 1.76, x: 430, y: 135 }, 143);
  const { GY, CX } = pressesaal(g, t, cam, { podium: false, live: false });
  layer(g, cam, 1, (g) => { g.fillStyle = '#8f2a31'; g.fillRect(CX + 650, -E.H, 400, E.H * 3); T(g, { t, x: CX + 480, y: GY - 50, facing: -1, outfit: BRANDT, pose: POSES.crossArms, expr: ex(t, 'neutral', [0.2, 'smirk']) }); });
} });

// s144 — giant close-up: Brandt smirks — he expects the lie
registerShot('s144', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'pressesaal', setOpt: { podium: false }, x: 0.6, toon: { outfit: BRANDT, expr: 'sly', look: [-0.6, 0] }, after: () => line(g, t, 'ER ERWARTET DIE LÜGE.', E.W * 0.32, E.H * 0.85, { start: 0.15, size: 56 }) });
} });

// s145 — Sam at the mic, determined
function atMic(g, t, info, o = {}) {
  const cam = mv(t, info.dur, o.c0 || { z: 1.75, x: 0, y: 20 }, o.c1 || { z: 1.85, x: 0, y: 30 }, o.seed || 145);
  const { GY, CX, front } = pressesaal(g, t, cam, { podiumX: 40 });
  layer(g, cam, 0.99, (g) => T(g, { t, x: CX - 40, y: GY - 40, s: 1.4, outfit: SAM, pose: o.pose || breathe(POSES.stand, t), prop: o.prop, expr: o.expr || 'determined', talk: o.talk ? talk(info) : 0, look: o.look || [0.3, 0] }));
  front(g);
  if ((t * 3) % 1 < 0.08) { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, 0, E.W, E.H); }
}
registerShot('s145', { draw(g, t, info) { atMic(g, t, info, { expr: ex(t, 'nervous', [0.6, 'determined']) }); line(g, t, 'DU SAGST DIE WAHRHEIT.', E.W * 0.5, E.H * 0.88, { start: 0.3, size: 60 }); } });
// s146 — "JONAS WAR BEI MIR."
registerShot('s146', { draw(g, t, info) {
  const cam = hitCam({ z: 1, x: 0, y: 0 }, t, 0.15, 6);
  atMic(g, t, info, { talk: true, c0: { z: 2.1, x: 0, y: 0 }, c1: { z: 2.2, x: 0, y: 0 }, seed: 146 });
  line(g, t, '„JONAS WAR BEI MIR.“', E.W * 0.5, E.H * 0.88, { start: 0.05, size: 70, color: '#f7c948' });
} });
// s147 — "MEINE TÜRKAMERA HAT ES AUFGENOMMEN."
registerShot('s147', { draw(g, t, info) { atMic(g, t, info, { talk: true, c0: { z: 1.9, x: -40, y: 10 }, c1: { z: 1.95, x: -30, y: 15 }, seed: 147 }); line(g, t, '„MEINE TÜRKAMERA…“', E.W * 0.5, E.H * 0.88, { start: 0.05, size: 64 }); } });
// s148 — Sam raises the phone toward the cameras
registerShot('s148', { draw(g, t, info) { atMic(g, t, info, { pose: posesSpring(t, [[0, POSES.stand], [0.3, { ...POSES.pointUp, hF: [40, -270] }]]), prop: 'phone', c0: { z: 1.6, x: 0, y: -20 }, c1: { z: 1.5, x: 0, y: -10 }, seed: 148 }); } });

// door-camera footage frame: fisheye-ish, REC dot, timestamp
function footage(g, t, info, stampStr, inner) {
  const cam = { z: 1.15, x: 60, y: 30 };
  const { GY, CX } = haustuer(g, t, cam, { mood: 'nightOut' });
  layer(g, cam, 1, (g) => inner && inner(g, GY, CX));
  g.fillStyle = 'rgba(40,60,90,.28)'; g.fillRect(0, 0, E.W, E.H);
  for (let y = 0; y < E.H; y += 6) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, y, E.W, 2); }
  const v = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.3, E.W / 2, E.H / 2, E.W * 0.65); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.75)'); g.fillStyle = v; g.fillRect(0, 0, E.W, E.H);
  if ((t * 1.5) % 1 < 0.6) circle(g, 90, 90, 22, '#e8443a'); text(g, 'REC', 170, 92, { size: 44, font: FONTS.ui, weight: 900, color: '#ffffff' });
  text(g, 'TÜRKAMERA', E.W - 200, 92, { size: 36, font: FONTS.ui, weight: 900, color: '#ffffff' });
  text(g, stampStr, E.W - 170, E.H - 80, { size: 64, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: 8, strokeColor: '#000' });
}
// s149 — footage: "23:41"
registerShot('s149', { draw(g, t, info) { footage(g, t, info, '23:41', (g, GY, CX) => { const k = travel(t, 0.3, 2.4); T(g, { t, x: CX + 800 - 520 * k, y: GY, facing: -1, outfit: JONAS, pose: k < 1 ? walkPose(t * 5) : POSES.stand, expr: 'smile', rim: false }); }); labelBox(g, t, '23:41', E.W * 0.5, E.H * 0.14, { start: wt(info, '23', 1.4) - 0.1, size: 70 }); } });
// s150/s151 — footage: knock • • • then —
registerShot('s150', { draw(g, t, info) { footage(g, t, info, '23:41', (g, GY, CX) => T(g, { t, x: CX + 280, y: GY, facing: -1, outfit: JONAS, pose: [0.1, 0.35, 0.6].some(k => t > k && t < k + 0.12) ? { ...POSES.reach, hF: [70, -200] } : { ...POSES.reach, hF: [50, -210], eF: [30, -180] }, expr: 'grin', rim: false })); knockCode(g, t, [0.1, 0.35, 0.6, 99], E.W / 2, E.H * 0.2, 1.1); } });
registerShot('s151', { draw(g, t, info) { footage(g, t, info, '23:41', (g, GY, CX) => T(g, { t, x: CX + 280, y: GY, facing: -1, outfit: JONAS, pose: t > 0.15 && t < 0.5 ? { ...POSES.reach, hF: [70, -200] } : { ...POSES.reach, hF: [50, -210], eF: [30, -180] }, expr: 'grin', rim: false })); knockCode(g, t, [-1, -1, -1, 0.15], E.W / 2, E.H * 0.2, 1.1); } });
// s152 — footage: Jonas, quietly: "DU SIEHST FURCHTBAR AUS."
registerShot('s152', { draw(g, t, info) { const say = wt(info, 'du', 1.2); footage(g, t, info, '23:42', (g, GY, CX) => { const j = { t, x: CX + 280, y: GY, facing: -1, outfit: JONAS, pose: POSES.relaxed, expr: 'smile', talk: t > say ? talk(info, say) : 0, rim: false }; T(g, j); bubbleOver(g, j, FURCHTBAR, t, say, { size: 30, dx: -60 }); }); line(g, t, 'EINE LEISE STIMME', E.W * 0.5, E.H * 0.16, { start: 0.1, size: 56 }); } });
// s153 — footage fast-forward: the timestamp races to 06:00
registerShot('s153', { draw(g, t, info) {
  const p = clamp(prog(t, 0.2, 2.0)), mins = Math.floor(23 * 60 + 42 + p * (6 * 60 + 18)) % (24 * 60), str = String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
  footage(g, t, info, str, (g, GY, CX) => { if (p < 0.98) { /* door stays shut, light passes */ } });
  text(g, '▶▶', E.W / 2, E.H / 2, { size: 160, font: FONTS.ui, weight: 900, color: alpha('#ffffff', 0.8) });
  labelBox(g, t, 'BIS 6 UHR MORGENS', E.W * 0.5, E.H * 0.82, { start: 1.0 });
} });

// s154 — the hall goes silent, wide
registerShot('s154', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.0, x: 0, y: 0 }, { z: 1.03, x: 0, y: 0 }, 154, 1);
  const { GY, CX, front } = pressesaal(g, t, cam, { cams: true, podiumX: 40 });
  layer(g, cam, 0.99, (g) => T(g, { t, x: CX - 40, y: GY - 50, outfit: SAM, pose: { ...POSES.pointUp, hF: [40, -270] }, prop: 'phone', expr: 'determined' }));
  front(g);
  line(g, t, 'STILLE.', E.W * 0.5, E.H * 0.88, { start: 0.1, size: 64 });
} });

// s155 — "20.000.000 HÖREN"
registerShot('s155', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.1, x: 0, y: 0 }, { z: 1.15, x: 0, y: 0 }, 155);
  const { front } = pressesaal(g, t, cam, { cams: true }); front(g);
  g.fillStyle = 'rgba(10,15,40,.4)'; g.fillRect(0, 0, E.W, E.H);
  cnt(g, t, { from: 0, to: 20000000, start: 0.1, dur: 1.0, x: E.W * 0.5, y: E.H * 0.45, label: 'MENSCHEN HÖREN', size: 130 });
} });

// s156 — "EINEN FREUND."
registerShot('s156', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 0, y: 40 }, { z: 1.28, x: 0, y: 40 }, 156);
  const { GY, CX } = regel(g, t, cam);
  layer(g, cam, 1, (g) => { softEllipse(g, CX, GY - 160, 300, 320, '#fff3c8', 0.5); T(g, { t, x: CX, y: GY, outfit: JONAS, pose: POSES.relaxed, expr: 'smile' }); });
  kText(g, t, 'EINEN FREUND.', E.W / 2, E.H * 0.18, { start: 0.05, mode: 'drop', size: 110, font: FONTS.ui, weight: 900, color: '#f7c948' });
} });

// s157 — applause breaks out, everyone stands
registerShot('s157', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.1, x: 0, y: 140 }, { z: 1.16, x: 0, y: 150 }, 157), t, 0.1, 6);
  const { GY, CX, front } = pressesaal(g, t, cam, { podiumX: 40, flash: true, cams: true });
  layer(g, cam, 0.99, (g) => T(g, { t, x: CX - 40, y: GY - 50, outfit: SAM, pose: POSES.stand, expr: 'surprised' }));
  front(g);
  layer(g, cam, 1.25, (g) => { for (let i = -6; i <= 6; i++) { const clap = Math.abs(Math.sin(t * 12 + i)) * 18; T(g, { t, x: CX + i * 170, y: GY + 380, s: 1.25, facing: i < 0 ? 1 : -1, outfit: EXTRAS[(i + 7) % 7], pose: i % 3 ? { ...POSES.holdFront, hF: [30 - clap * 0.5, -200], hB: [20 + clap * 0.5, -198] } : POSES.cheer, expr: 'joy', rim: false, off: i }); } });
  labelBox(g, t, 'APPLAUS!', E.W * 0.5, E.H * 0.1, { start: 0.1 });
} });

// s158 — giant close-up: Brandt shocked, turning pale
registerShot('s158', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'pressesaal', setOpt: { podium: false }, x: 0.45, hit: 0.1, hitAmp: 8, toon: { outfit: { ...BRANDT, face: null }, expr: 'shocked', look: [0, 0] }, after: (g, x, y, r) => { const p = clamp(prog(t, 0.2, 1.0)); g.save(); g.globalAlpha = 0.5 * p; g.fillStyle = '#e8e8f0'; g.beginPath(); g.arc(x, y - r * 0.05, r * 0.98, 0, Math.PI * 2); g.fill(); g.restore(); line(g, t, 'BRANDT WIRD BLASS.', E.W * 0.76, E.H * 0.86, { start: 0.2, size: 52 }); } });
} });

// s159 — the contract rips in two; "VERTRAG GEPLATZT"
registerShot('s159', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 0, y: 30 }, { z: 1.25, x: 0, y: 30 }, 159);
  agentur(g, t, cam, { desk: false }); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, E.W, E.H);
  const rip = 0.4, d = ease.out(clamp(prog(t, rip, rip + 0.5))) * 160;
  for (const side of [-1, 1]) { g.save(); g.translate(E.W / 2 + side * d, E.H * 0.5 + d * 0.3); g.rotate(side * d * 0.002); g.beginPath(); g.rect(side < 0 ? -200 : 0, -300, 200, 600); g.clip(); contract(g, 0, 0, 2.2); g.restore(); }
  stamp(g, t, rip + 0.3, 'VERTRAG GEPLATZT', E.W * 0.5, E.H * 0.85, { size: 70 });
} });

// s160 — "10 MIO?" → "WEG!"
registerShot('s160', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.2, x: 0, y: 30 }, { z: 1.25, x: 0, y: 30 }, 160);
  agentur(g, t, cam, { desk: false }); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, 0, E.W, E.H);
  const weg = wt(info, 'weg', 1.3);
  if (t < weg) cnt(g, t, { from: 10000000, to: 10000000, start: 0.05, dur: 0.1, x: E.W / 2, y: E.H * 0.45, suffix: ' €', size: 140 });
  else { const im = impact(t, weg, { amp: 14 }); g.save(); g.translate(im.x, im.y); text(g, '0 €', E.W / 2, E.H * 0.45, { size: 180, font: FONTS.ui, weight: 900, color: '#ef5a4a', stroke: 22, strokeColor: '#141418' }); g.restore(); line(g, t, 'WEG!', E.W / 2, E.H * 0.75, { start: weg, size: 100 }); }
} });

// s161 — Sam walks off stage, reflective
registerShot('s161', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.3, x: 200, y: 70 }, { z: 1.35, x: 300, y: 70 }, 161);
  const { GY, CX } = pressesaal(g, t, cam, { podiumX: -300, live: false });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 100 + t * 120, y: GY - 50, outfit: SAM, pose: walkPose(t * 4), expr: 'thinking' }));
  line(g, t, 'DU HÄTTEST JONAS OPFERN KÖNNEN.', E.W * 0.5, E.H * 0.12, { start: 0.2, size: 52 });
  line(g, t, 'ALLES BEHALTEN.', E.W * 0.5, E.H * 0.22, { start: wt(info, 'alles', 1.8) - 0.05, size: 52, color: '#f7c948' });
} });

// s162 — Brandt alone in the empty wings
registerShot('s162', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 0, y: 100 }, { z: 1.5, x: 0, y: 110 }, 162);
  const { GY, CX } = pressesaal(g, t, cam, { backstage: true });
  layer(g, cam, 1, (g) => T(g, { t, x: CX, y: GY, outfit: BRANDT, pose: POSES.sad, expr: 'angry', look: [0, 0.5] }));
  g.fillStyle = 'rgba(10,10,30,.3)'; g.fillRect(0, 0, E.W, E.H);
  line(g, t, 'DANN WÄRST DU WIE BRANDT.', E.W * 0.5, E.H * 0.13, { start: 0.2, size: 60 });
} });
