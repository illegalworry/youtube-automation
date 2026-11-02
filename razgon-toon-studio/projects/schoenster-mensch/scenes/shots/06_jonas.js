// shots/06_jonas.js — Act 4: Jonas — first grade, the knock code, "Du siehst furchtbar aus", pizza, jokes.
import { E, V, registerShot, layer, clamp, prog, ease, text, FONTS, rr, circle, alpha, seg } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { posesSpring, fg, travel } from '/engine/motion.js';
import { street, schoolLot, toonTree } from '/engine/toonsets.js';
import { labelBox, sticker } from '/engine/toonui.js';
import { haustuer, wohnzimmer } from '../sets/places.js';
import { T, bl, ex, mv, hitCam, wt, pop, bubbleOver, closeUp, line, talk } from '../sets/kit.js';
import { SAM, JONAS, SAM_KID, JONAS_KID } from '../cast.js';

// knock-code graphic: dots and dash light up at the given local times
export function knockCode(g, t, times, x = E.W / 2, y = E.H * 0.2, s = 1) {
  times.forEach((t0, i) => { const k = ease.outBack(clamp(prog(t, t0, t0 + 0.15))); if (k <= 0) return; const cx = x + (i - 1.5) * 120 * s;
    g.save(); g.translate(cx, y); g.scale(k, k); if (i < 3) { circle(g, 0, 0, 34 * s, '#141418'); circle(g, 0, 0, 26 * s, '#f7c948'); } else { rr(g, -60 * s, -22 * s, 120 * s, 44 * s, 22 * s); g.fillStyle = '#141418'; g.fill(); rr(g, -52 * s, -14 * s, 104 * s, 28 * s, 14 * s); g.fillStyle = '#f7c948'; g.fill(); } g.restore(); });
}
export const FURCHTBAR = 'DU SIEHST FURCHTBAR AUS.';

// s099 — morning: Jonas walks into the frame, hands in pockets
registerShot('s099', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 200, y: 100 }, { z: 1.5, x: 120, y: 110 }, 99);
  const { GY, CX } = street(g, t, cam, { mood: 'afternoon' });
  const k = travel(t, 0, 1.3);
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 700 - 600 * k, y: GY + 20, facing: -1, outfit: JONAS, pose: k < 1 ? walkPose(t * 5) : breathe(POSES.relaxed, t), expr: 'grin' }));
  line(g, t, 'NUR EINER IST ANDERS.', E.W * 0.5, E.H * 0.13, { start: 0.3, size: 62 });
} });

// s100 — flashback: kid Sam and kid Jonas in front of the school, "1. KLASSE"
registerShot('s100', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 0, y: 110 }, { z: 1.48, x: 20, y: 115 }, 100);
  const { GY, CX } = schoolLot(g, t, cam, { sign: 'GRUNDSCHULE' });
  layer(g, cam, 1, (g) => { T(g, { t, x: CX - 100, y: GY, outfit: SAM_KID, pose: POSES.wave, expr: 'happy' }); T(g, { t, x: CX + 100, y: GY, facing: -1, outfit: JONAS_KID, pose: POSES.cheer, expr: 'joy', off: 1 }); });
  g.fillStyle = 'rgba(255,230,180,.16)'; g.fillRect(0, 0, E.W, E.H);
  labelBox(g, t, '1. KLASSE', E.W * 0.5, E.H * 0.12, { start: 0.3 });
} });

// s101 — Sam's front door, morning: Jonas knocks
registerShot('s101', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.25, x: 100, y: 60 }, { z: 1.32, x: 90, y: 65 }, 101);
  const { GY, CX } = haustuer(g, t, cam);
  const knock = [0.5, 0.75, 1.0];
  layer(g, cam, 1, (g) => { const kn = knock.some(k => t > k && t < k + 0.12); T(g, { t, x: CX + 260, y: GY, facing: -1, outfit: JONAS, pose: kn ? { ...POSES.reach, hF: [70, -200] } : { ...POSES.reach, hF: [50, -210], eF: [30, -180] }, expr: 'grin' }); });
  labelBox(g, t, 'JEDEN MORGEN', E.W * 0.5, E.H * 0.12, { start: 0.1 });
} });

// s102 — insert: knuckles + "• • • —"
registerShot('s102', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 2.4, x: 40, y: -40 }, { z: 2.5, x: 40, y: -40 }, 102, 2);
  haustuer(g, t, cam);
  const hits = [0.1, 0.35, 0.6, 1.0], near = hits.reduce((m, h) => Math.min(m, Math.abs(t - h)), 9);
  circle(g, E.W * 0.6 + (near < 0.06 ? -30 : 0), E.H * 0.5, 120, '#131316');
  knockCode(g, t, hits, E.W / 2, E.H * 0.2, 1.2);
  line(g, t, 'DREIMAL KURZ, EINMAL LANG', E.W * 0.5, E.H * 0.86, { start: 0.2, size: 56 });
} });

// s103 — the door opens; Jonas: "DU SIEHST FURCHTBAR AUS."
registerShot('s103', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.45, x: 40, y: 100 }, { z: 1.55, x: 60, y: 110 }, 103);
  const open = ease.inOut(clamp(prog(t, 0.2, 0.9)));
  const { GY, CX } = haustuer(g, t, cam, { open });
  const say = wt(info, 'du', 1.8);
  layer(g, cam, 1, (g) => {
    if (open > 0.5) T(g, { t, x: CX - 40, y: GY - 30, s: 1.25, outfit: SAM, pose: { ...POSES.stand, hF: [20, -230], eF: [24, -180] }, expr: 'sleepy', alpha: clamp((open - 0.5) * 3) });
    const j = { t, x: CX + 280, y: GY, facing: -1, outfit: JONAS, pose: breathe(POSES.crossArms, t), expr: t > say ? 'sly' : 'grin', talk: t > say ? talk(info, say) : 0 };
    T(g, j); bubbleOver(g, j, FURCHTBAR, t, say, { size: 30, dx: -60 });
  });
} });

// s104 — giant close-up: Jonas winks — he's lying
registerShot('s104', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'haustuer', x: 0.45, toon: { outfit: JONAS, expr: 'sly', look: [0.6, 0], tilt: 0.08 }, hit: 0.1, hitAmp: 5, after: () => line(g, t, 'ER LÜGT.', E.W * 0.78, E.H * 0.24, { start: 0.05, size: 80, color: '#f7c948' }) });
} });

// s105 — giant close-up: Sam's joy
registerShot('s105', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'haustuer', setOpt: { open: 1 }, x: 0.55, toon: { outfit: SAM, expr: ex(t, 'smile', [0.4, 'joy']), look: [-0.5, 0] }, after: () => line(g, t, 'UND GENAU DAS LIEBST DU.', E.W * 0.5, E.H * 0.9, { start: 0.3, size: 52 }) });
} });

// s106 — Sam and Jonas walking along the street; nobody's star eyes
registerShot('s106', { draw(g, t, info) {
  const wx = -300 + t * 200, cam = mv(t, info.dur, { z: 1.45, x: -240 * 0.9 + 60, y: 110 }, { z: 1.45, x: (-300 + info.dur * 200) * 0.9 + 60, y: 110 }, 106, 2);
  const { GY, CX, M } = street(g, t, cam, { mood: 'afternoon' });
  layer(g, cam, 1, (g) => { T(g, { t, x: CX + wx, y: GY, outfit: SAM, pose: walkPose(t * 5), expr: 'happy', look: [0.6, 0] }); T(g, { t, x: CX + wx + 190, y: GY, outfit: JONAS, pose: walkPose(t * 5 + 1.4), expr: 'grin', look: [-0.6, 0], talk: 0.3 * Math.abs(Math.sin(t * 6)) }); });
  fg(g, cam, (g) => toonTree(g, E.W / 2 + 500 + 400, 842 + 900, 1.6, M, 4, { trunk: 600, w: 300, h: 220 }), { depth: 1.8, blur: 16 });
  line(g, t, 'NUR EIN GESICHT', E.W * 0.5, E.H * 0.12, { start: wt(info, 'gesicht', 1.6) - 0.1, size: 60 });
} });

// s107 — living room: they argue over a pizza box, pointing
registerShot('s107', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.4, x: 0, y: 120 }, { z: 1.46, x: 10, y: 125 }, 107);
  const { GY, CX, front } = wohnzimmer(g, t, cam);
  layer(g, cam, 1, (g) => { const a = { t, x: CX - 220, y: GY - 70, outfit: SAM, pose: posesSpring(t, [[0, POSES.sit], [0.3, { ...POSES.sit, hF: [60, -150], eF: [40, -150] }]]), expr: 'angry', talk: talk(info, 0, 0.8) };
    const b = { t, x: CX + 220, y: GY - 70, facing: -1, outfit: JONAS, pose: posesSpring(t, [[0, POSES.sit], [0.5, { ...POSES.sit, hF: [60, -150], eF: [40, -150] }]]), expr: 'angry', talk: talk(info, 0.7) };
    T(g, a); T(g, b); bubbleOver(g, a, 'ANANAS!', t, 0.2, { size: 30 }); bubbleOver(g, b, 'NIEMALS!', t, 0.8, { size: 30, dx: -40 }); });
  front(g);
} });

// s108 — Sam tells a joke, Jonas laughs
registerShot('s108', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.5, x: 60, y: 130 }, { z: 1.56, x: 70, y: 135 }, 108);
  const { GY, CX, front } = wohnzimmer(g, t, cam);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX - 220, y: GY - 70, outfit: SAM, pose: { ...POSES.sit, hF: [50, -190], eF: [36, -160] }, expr: 'grin', talk: t < 0.8 ? 0.5 : 0 });
    T(g, { t, x: CX + 220, y: GY - 70, facing: -1, outfit: JONAS, pose: posesSpring(t, [[0, POSES.sit], [0.8, { ...POSES.sitBack, hF: [20, -150] }]]), expr: ex(t, 'smile', [0.8, 'happy']) });
    if (t > 0.9) text(g, 'HAHA', CX + 260, GY - 380 - (t - 0.9) * 40, { size: 50, font: FONTS.ui, weight: 900, color: '#f7c948', stroke: 8, strokeColor: '#141418' }); });
  front(g);
} });

// s109 — a bad joke: Jonas laughs even louder, falls back
registerShot('s109', { draw(g, t, info) {
  const cam = hitCam(mv(t, info.dur, { z: 1.7, x: 200, y: 160 }, { z: 1.76, x: 210, y: 165 }, 109), t, 0.3, 8);
  const { GY, CX, front } = wohnzimmer(g, t, cam);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX + 220, y: GY - 70, facing: -1, outfit: JONAS, pose: posesSpring(t, [[0, POSES.sitBack], [0.25, POSES.lie]]), rot: -0.4 * ease.outBack(clamp(prog(t, 0.25, 0.6))), expr: 'joy' });
    for (let i = 0; i < 3; i++) { const n = (t * 1.2 + i * 0.33) % 1; text(g, 'HAHA', CX + 160 + i * 80, GY - 360 - n * 160, { size: 54 + i * 8, font: FONTS.ui, weight: 900, color: alpha('#f7c948', 1 - n), stroke: 8, strokeColor: alpha('#141418', 1 - n) }); } });
  front(g);
  line(g, t, 'NOCH LAUTER', E.W * 0.3, E.H * 0.14, { start: 0.3, size: 60 });
} });

// s110 — Jonas: "SAM, HAST DU HEUTE WIEDER NICHTS GELERNT?"
registerShot('s110', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.55, x: 0, y: 130 }, { z: 1.62, x: 0, y: 135 }, 110);
  const { GY, CX, front } = wohnzimmer(g, t, cam);
  layer(g, cam, 1, (g) => { T(g, { t, x: CX - 220, y: GY - 70, outfit: SAM, pose: POSES.sit, expr: ex(t, 'smile', [2.6, 'grin']) });
    const j = { t, x: CX + 220, y: GY - 70, facing: -1, outfit: JONAS, pose: { ...POSES.sit, hF: [50, -200], eF: [36, -170] }, expr: 'sly', talk: talk(info) }; T(g, j); bubbleOver(g, j, 'SAM, WIEDER NICHTS GELERNT?', t, 0.15, { size: 28, dx: -120 }); });
  front(g);
} });

// s111 — Sam laughs for the first time in weeks
registerShot('s111', { draw(g, t, info) {
  closeUp(g, t, info, { set: 'wohnzimmer', setOpt: { table: false }, x: 0.45, toon: { outfit: SAM, expr: 'joy', tilt: 0.05 * Math.sin(t * 9) }, after: () => labelBox(g, t, 'ZUM ERSTEN MAL SEIT WOCHEN', E.W * 0.5, E.H * 0.9, { start: 0.6, size: 44 }) });
} });

// s112 — Jonas with his phone face-down on the table; "KEIN FOTO"
registerShot('s112', { draw(g, t, info) {
  const cam = mv(t, info.dur, { z: 1.8, x: 120, y: 260 }, { z: 1.9, x: 130, y: 270 }, 112);
  const { GY, CX, front } = wohnzimmer(g, t, cam, { phoneDown: true });
  layer(g, cam, 1, (g) => T(g, { t, x: CX + 220, y: GY - 70, facing: -1, outfit: JONAS, pose: POSES.sitBack, expr: 'happy', look: [-0.6, 0] }));
  front(g);
  sticker(g, t, 'KEIN FOTO', E.W * 0.74, E.H * 0.3, { start: 0.5, r: 120, color: '#3f9a5a' });
  line(g, t, 'DER EINZIGE', E.W * 0.3, E.H * 0.14, { start: 0.2, size: 60 });
} });
