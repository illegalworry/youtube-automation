// YouTube thumbnail for "Was wäre, wenn du der schönste Mensch der Welt wärst?"
// Left: Sam's giant glowing face with a crown, phones pointed at it from below.
// Right: Jonas, unimpressed: "FURCHTBAR!". Top right: "ZU SCHÖN?"
import { E, registerShot, layer, blurLayer, veil, rr, circle, poly, text, FONTS, alpha } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { drawToon, bigToon, toonBubble, toonHeadPos } from '/engine/toon.js';
import { street, lamplight, softEllipse } from '/engine/toonsets.js';
import { SAM, JONAS } from '/projects/schoenster-mensch/scenes/cast.js';

function sparkle(g, x, y, s, c = '#fff6c8') { poly(g, [[x, y - 40 * s], [x + 10 * s, y - 10 * s], [x + 40 * s, y], [x + 10 * s, y + 10 * s], [x, y + 40 * s], [x - 10 * s, y + 10 * s], [x - 40 * s, y], [x - 10 * s, y - 10 * s]], c); }
function phone(g, x, y, rot, flash) {
  g.save(); g.translate(x, y); g.rotate(rot);
  circle(g, 0, 150, 70, '#131316');
  rr(g, -62, -110, 124, 230, 18); g.fillStyle = '#2a2d34'; g.fill(); rr(g, -52, -98, 104, 206, 12); g.fillStyle = '#bfe0ff'; g.fill();
  circle(g, 0, -10, 26, '#131316'); rr(g, -34, 20, 68, 70, 14); g.fillStyle = '#e8c04a'; g.fill();
  if (flash) { lamplight(g, 0, -80, 220, '#ffffff', 1.2); circle(g, -30, -84, 9, '#ffffff'); }
  g.restore();
}

registerShot('thumb', { draw(g, t) {
  blurLayer(g, 10, (g) => street(g, 0, { z: 1.25, x: 0, y: -60 }, { mood: 'afternoon' }));
  veil(g, '#ffe9b8', 0.18);
  // golden glow behind Sam
  const sx = E.W * 0.33, sy = E.H * 0.5;
  softEllipse(g, sx, sy, 620, 620, '#ffe08a', 0.9); softEllipse(g, sx, sy, 380, 380, '#ffffff', 0.5);
  g.save(); g.globalAlpha = 0.25; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; poly(g, [[sx, sy], [sx + Math.cos(a) * 1400, sy + Math.sin(a) * 1400], [sx + Math.cos(a + 0.1) * 1400, sy + Math.sin(a + 0.1) * 1400]], '#fff3c8'); } g.restore();
  // Sam's giant face
  const r = 300;
  bigToon(g, sx, sy + 40, r, { outfit: SAM, expr: 'smile', look: [0.3, -0.1], rimSide: 1, glow: '#fff3c8', tilt: -0.06, blink: false });
  // crown
  g.save(); g.translate(sx - 20, sy + 40 - r * 1.02); g.rotate(-0.12);
  poly(g, [[-150, 40], [-170, -90], [-80, -10], [0, -120], [80, -10], [170, -90], [150, 40]], '#f7c948');
  g.fillStyle = '#c8961a'; g.fillRect(-150, 20, 300, 26); for (const [cx, c] of [[-80, '#e0443a'], [0, '#3f63c8'], [80, '#3fae5a']]) circle(g, cx, 32, 13, c);
  g.strokeStyle = '#141418'; g.lineWidth = 8; g.beginPath(); g.moveTo(-150, 46); g.lineTo(-170, -90); g.lineTo(-80, -10); g.lineTo(0, -120); g.lineTo(80, -10); g.lineTo(170, -90); g.lineTo(150, 46); g.closePath(); g.stroke();
  g.restore();
  for (const [x, y, s] of [[sx - 360, sy - 220, 1.4], [sx + 330, sy - 300, 1.1], [sx + 380, sy + 60, 0.9], [sx - 400, sy + 120, 0.8], [sx + 120, sy - 420, 0.7]]) sparkle(g, x, y, s);
  // phones from the bottom edge
  phone(g, E.W * 0.06, E.H * 0.86, 0.25, true); phone(g, E.W * 0.6, E.H * 0.9, -0.3, true); phone(g, E.W * 0.17, E.H * 1.0, 0.1, false);
  // Jonas, unimpressed
  const j = { x: E.W * 0.83, y: E.H * 1.18, s: 3.3, facing: -1, outfit: JONAS, pose: POSES.crossArms, expr: 'sly', look: [-0.7, 0], rim: { dir: [0.8, -0.6] } };
  drawToon(g, j);
  const [hx, hy, hr] = toonHeadPos(j); toonBubble(g, hx - 40, hy - hr - 40, 'FURCHTBAR!', { size: 56, tail: 60 });
  // title
  const ty = E.H * 0.19, tx = E.W * 0.71;
  g.save(); g.translate(tx, ty); g.rotate(-0.05);
  text(g, 'ZU SCHÖN?', 10, 14, { size: 165, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.45)' });
  text(g, 'ZU SCHÖN?', 0, 0, { size: 165, font: FONTS.ui, weight: 900, color: '#f7c948', stroke: 30, strokeColor: '#141418', spacing: 2 });
  g.restore();
} });
