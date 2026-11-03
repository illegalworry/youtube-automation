// Cold open → town reveal → day counter → game tile → red alarm → panic street → "okay, okay"
import { E, V, registerShot, layer, blurLayer, veil, ease, prog, clamp, wordTime, glow } from '/engine/core.js';
import { drawHero, bigHero, heroSpring, heroIdle, heroFlail } from '/engine/hero.js';
import { bedroom, cityRow, suburb, voidStage, cloud, sky } from '/engine/worldsets.js';
import { dayCard, gameTile, countdown, alertBanner, chatBubble, titleSlam } from '/engine/gameui.js';
import { camPath, camAdd, drift, impact, spring } from '/engine/motion.js';
import { HERO, NEIGHBOURS, NAME } from '../cast.js';

// s01 — giant close-up: eyes snap open on "eyes"
registerShot('s01', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.08 }]]), drift(t, 4, 1));
  blurLayer(g, 10, g => bedroom(g, t, { ...cam, y: -120 }, {}), null);
  veil(g, '#000', 0.08);
  const up = spring(t, 0.05, { freq: 2.2, damp: 0.5 }), hit = impact(t, 0.3, { amp: 10 });
  layer(g, camAdd(cam, hit), 1, g => bigHero(g, E.W / 2, E.H * V(0.42, 0.42) + (1 - up) * 200, V(560, 520), { outfit: HERO, expr: t < 0.3 ? 'sleepy' : 'shocked', pose: 'idle', t }));
}});

// s02 — the whole town; a sparkle beam sweeps, title slams on "video game"
registerShot('s02', { draw(g, t, info) {
  const cam = camPath(t, [[0, { z: 1.25, y: -40 }], [info.dur, { z: 1.0, y: 0 }]]);
  const { GY, CX } = cityRow(g, t, cam, { crowd: 26 });
  const bx = -300 + t * 1500; glow(g, bx, E.H * 0.45, 260, '#9ae6ff', 0.55);
  for (let i = 0; i < 18; i++) { const x = bx + Math.sin(i * 7.1) * 140, y = E.H * 0.2 + ((i * 97 + t * 400) % 600); g.fillStyle = ['#ffd23f', '#3fe05a', '#3fe0ff'][i % 3]; g.fillRect(x, y, 14, 14); }
  const tw = (wordTime('video', info.globalT - 0.5) ?? info.globalT + 0.9) - info.shot.start;
  titleSlam(g, t, ['WHOLE TOWN', 'VIDEO GAME'], { start: tw - 0.1, y: E.H * 0.36, size: V(120, 110) });
}});

// s03 — calendar: DAY 1 → DAY 5 (rapid page flips)
registerShot('s03', { draw(g, t, info) {
  voidStage(g, t, drift(t, 6, 2), {});
  const d = t < 0.5 ? 1 : 5;
  dayCard(g, t, { day: d, start: d === 1 ? 0 : 0.5, color: d === 1 ? '#ff7a2a' : '#8a4ad4', icon: d === 5 ? 'bars' : null, burst: d === 5 });
}});

// s04 — the game tile UI
registerShot('s04', { draw(g, t, info) {
  voidStage(g, t, {}, {});
  gameTile(g, t, { title: 'The WHOLE TOWN', hi: 'WHOLE TOWN', players: '12,408 playing', start: 0, press: 0.8,
    thumb: (g, x, y, w, h) => { g.save(); g.scale(w / E.W, h / E.H); cityRow(g, t, { z: 1.05 }, {}); g.restore(); } });
}});

// s05 — town flips to red alarm on "server", countdown slams on "thirty"
registerShot('s05', { draw(g, t, info) {
  const tS = (wordTime('thirty', info.globalT - 1) ?? info.globalT + 2.2) - info.shot.start;
  const hit = impact(t, tS, { amp: 16 });
  const cam = camAdd(camPath(t, [[0, { z: 1.0, x: -30 }], [info.dur, { z: 1.12, x: 30 }]]), hit);
  cityRow(g, t, cam, { crowd: 30 });
  countdown(g, t, { value: 30, start: tS - 0.05, y: V(200, 330) });
}});

// s06 — street panic, typed hazard banner, chat bubbles, ticking ring
registerShot('s06', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.12, y: 80, x: -40 }], [info.dur, { z: 1.2, y: 90, x: 40 }]]), drift(t, 6, 4));
  const { GY, CX } = suburb(g, t, cam, { car: true });
  layer(g, cam, 1, g => NEIGHBOURS.forEach((of, i) => {
    const x = CX - 520 + i * 340 + Math.sin(t * 3 + i) * 30;
    drawHero(g, { x, y: GY + 10, s: 1.05, outfit: of, pose: heroFlail('panic', t + i, 1), expr: ['scared', 'shocked', 'nervous', 'scared'][i], name: ['Pizza_Dad', 'xX_Dan_Xx', 'Lily_22', 'Grandma'][i], t });
  }));
  alertBanner(g, t, { str: 'Server closing in 30 seconds', start: 0.05 });
  countdown(g, t, { value: 30, start: 0.2, tickRate: 1, x: E.W / 2, y: V(250, 380), r: V(70, 90) });
  [['HELP!', 300, 0.4], ['mom??', 760, 0.7], ['what do we DO', 1250, 0.95], ['NOOO', 1650, 1.2]].forEach(([s, x, st]) => chatBubble(g, t, s, x, V(360, 640) + Math.sin(x) * 30, { start: st }));
}});

// s07 — "Okay, okay. Let me explain." — giant nervous close-up over the blurred red town
registerShot('s07', { draw(g, t, info) {
  blurLayer(g, 12, g => cityRow(g, t, { z: 1.3 }, {}));
  const cam = camAdd(camPath(t, [[0, { z: 1.0 }], [info.dur, { z: 1.06 }]]), drift(t, 5, 7));
  const pose = heroSpring(t, [[0, 'shrug'], [1.1, 'armsOut'], [1.7, 'shrug']]);
  layer(g, cam, 1, g => bigHero(g, E.W / 2, E.H * 0.4, V(470, 440), { outfit: HERO, expr: t > 1.9 ? 'worried' : 'nervous', pose: heroIdle(pose, t), t }));
  countdown(g, t, { value: 27, start: 0, tickRate: 1, x: V(200, 160), y: V(200, 300), r: V(80, 80) });
}});
