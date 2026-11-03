// Rewind to last night → day one → rule 1 (jump) → rule 2 (lava) → rule 3 (die → respawn)
import { E, V, registerShot, layer, ease, prog, clamp, wordTime } from '/engine/core.js';
import { drawHero, heroSpring, heroIdle, heroPoseAt, heroFlail, forcefield, heroHeadPos } from '/engine/hero.js';
import { bedroom, suburb, obby, lavaPool } from '/engine/worldsets.js';
import { popupDialog, bigWord, ruleCard, gauge, onoma, diedPanel, floatText } from '/engine/gameui.js';
import { camPath, camAdd, drift, impact, spring } from '/engine/motion.js';
import { HERO, NAME } from '../cast.js';

// s08 — VHS "last night": hero asleep-ish in bed, a pop-up appears, cursor clicks YES
registerShot('s08', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.05 }], [info.dur, { z: 1.15, y: 30 }]]), drift(t, 4, 3));
  const { GY, CX, bedTop } = bedroom(g, t, cam, { night: true });
  layer(g, cam, 1, g => drawHero(g, { x: CX - 40, y: bedTop + 70, s: 1.0, outfit: HERO, pose: heroIdle('sit', t), expr: t > 1.2 ? 'surprised' : 'sleepy', shadow: false, t }));
  layer(g, cam, 1, g => { g.save(); g.fillStyle = '#3b6fd4'; g.fillRect(CX - 300, bedTop + 20, 520, 200); g.restore(); });   // blanket over the legs
  popupDialog(g, t, { title: 'Turn your town into a game?', body: 'Day 1 of 5 · cannot be undone', start: 1.1, click: 2.6, hi: 0, y: E.H * 0.42 });
}});

// s09 — Day one: sunny street, DAY 1 bounces in
registerShot('s09', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.1, y: 60, x: 60 }], [info.dur, { z: 1.25, y: 90, x: 0 }]]), drift(t, 5, 5));
  const { GY, CX } = suburb(g, t, cam, {});
  const pose = heroSpring(t, [[0, 'wave'], [1.3, 'think']]);
  layer(g, cam, 1, g => drawHero(g, { x: CX, y: GY + 10, s: 1.2, outfit: HERO, pose: heroIdle({ ...pose, aR: pose.aR + (t < 1.3 ? Math.sin(t * 12) * 0.25 : 0) }, t), expr: t < 1.3 ? 'happy' : 'confused', name: NAME, t }));
  bigWord(g, t, 'DAY 1', E.W / 2 + V(330, 0), V(300, 420), { start: 0.1, out: info.dur - 0.25, size: V(140, 150) });
}});

// s10 — Rule one: crouch → launch (spring + impact), gauge fills to 10x
registerShot('s10', { draw(g, t, info) {
  const tJ = 2.0, hop = t > tJ ? ease.in(clamp((t - tJ) / 0.7)) * 1400 : 0;
  const cam = camAdd(camPath(t, [[0, { z: 1.25, y: 90 }], [tJ, { z: 1.3, y: 100 }], [info.dur, { z: 1.1, y: -120 }]]), impact(t, tJ, { amp: 12 }));
  const { GY, CX } = suburb(g, t, cam, {});
  const pose = heroPoseAt(t, [[0, 'idle'], [1.3, 'crouch'], [tJ, 'jump']], 0.2);
  layer(g, cam, 1, g => drawHero(g, { x: CX, y: GY + 10, lift: -hop, s: 1.2, outfit: HERO, pose: heroIdle(pose, t), expr: t < 1.3 ? 'smile' : t < tJ ? 'determined' : 'excited', name: NAME, t, squash: t > 1.3 && t < tJ ? 0.06 : 0 }));
  ruleCard(g, t, { n: 1, str: 'Jump 10x higher!', start: 0.05, color: '#3b6fd4' });
  gauge(g, t, { value: 10, max: 10, label: 'JUMP', start: 0.6, fillDur: 1.2 });
}});

// s11 — Rule two: the obby, red platforms are lava
registerShot('s11', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.45, x: 100, y: -170 }], [info.dur, { z: 1.6, x: 140, y: -190 }]]), drift(t, 6, 8));
  const { platforms } = obby(g, t, cam, {});
  const [px, py, pw] = platforms[2];
  layer(g, cam, 1, g => drawHero(g, { x: px + pw / 2, y: py, s: 0.8, outfit: HERO, pose: heroIdle(heroSpring(t, [[0, 'idle'], [1.2, 'handsOnHead']]), t), expr: t < 1.2 ? 'surprised' : 'worried', look: [1, 0], name: NAME, t }));
  ruleCard(g, t, { n: 2, str: 'Red = LAVA!', start: 0.05, color: '#d9443a' });
  const tl = (wordTime('lava', info.globalT - 1) ?? info.globalT + 1.6) - info.shot.start;
  onoma(g, t, 'SIZZLE!', E.W * 0.68, E.H * 0.42, { start: tl, color: '#ffb02a' });
}});

// s12 — Rule three: drop into the lava tub → BONK → world drains grey → You died
registerShot('s12', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.2, y: 60 }], [info.dur, { z: 1.3, y: 80 }]]), impact(t, 0.9, { amp: 18 }));
  const { GY, CX } = suburb(g, t, cam, { car: false });
  layer(g, cam, 1, g => lavaPool(g, CX - 260, GY + 20, 520, { outline: '#3a0a10' }, t));
  const fall = clamp(t / 0.9), y = GY - 760 + ease.in(fall) * 700;
  if (t < 0.95) layer(g, cam, 1, g => drawHero(g, { x: CX, y, s: 1.1, outfit: HERO, pose: heroFlail('flail', t, 1), expr: 'scared', t }));
  else layer(g, cam, 1, g => drawHero(g, { x: CX + 40, y: GY - 50, s: 1.1, outfit: HERO, pose: 'fall', rot: 1.4, expr: 'dead', alpha: 1 - clamp((t - 1.4) / 0.4) }));
  onoma(g, t, 'AAAAH!', E.W * 0.32, E.H * 0.3, { start: 0.1, out: 0.9, color: '#ffffff' });
  onoma(g, t, 'BONK!', E.W * 0.62, E.H * 0.38, { start: 0.9, color: '#ffd23f', rot: 0.1 });
  diedPanel(g, t, { start: 1.0, from: 3, rate: 1.4 });
}});

// s13 — respawn in bed inside a sparkly forcefield
registerShot('s13', { draw(g, t, info) {
  const cam = camAdd(camPath(t, [[0, { z: 1.25, y: 40 }], [info.dur, { z: 1.35, y: 30 }]]), drift(t, 4, 9));
  const { CX, bedTop } = bedroom(g, t, cam, {});
  const k = spring(t, 0.05, { freq: 2.4, damp: 0.45 });
  layer(g, cam, 1, g => {
    drawHero(g, { x: CX - 40, y: bedTop + 60, s: 1.05 * clamp(k, 0, 1.3), outfit: HERO, pose: heroIdle(heroSpring(t, [[0, 'idle'], [0.8, 'cheer']]), t), expr: t < 0.8 ? 'surprised' : 'excited', name: NAME, hp: 1, shadow: false, t });
    const [hx, hy] = heroHeadPos({ x: CX - 40, y: bedTop + 60, s: 1.05 });
    forcefield(g, CX - 40, hy + 110, 230 * clamp(k, 0, 1.2), t);
  });
  ruleCard(g, t, { n: 3, str: 'You just respawn!', start: 0.1, color: '#2fb54a' });
  floatText(g, t, '+1 LIFE', E.W * 0.66, E.H * 0.4, { start: 0.9, color: '#3fe05a' });
}});
