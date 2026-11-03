// Channel art for "Tag X Toons": banner (2560×1440, safe area centre 1546×423) and avatar (centre square, circle crop).
import { E, registerShot, layer, blurLayer, veil, rr, circle, poly, text, FONTS, backdrop, alpha } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { drawToon, bigToon } from '/engine/toon.js';
import { street, softEllipse, cloud } from '/engine/toonsets.js';
import { SAM, JONAS, LEO, BRANDT, SAENGERIN, KIND, EXTRAS } from '/projects/schoenster-mensch/scenes/cast.js';

// calendar page "TAG" with a big gold X — the channel logo mark
function calendarX(g, x, y, s, rot = -0.08) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -150 + 10, -170 + 14, 300, 340, 28); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill();
  rr(g, -150, -170, 300, 340, 28); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#141418'; g.lineWidth = 12; g.stroke();
  g.save(); rr(g, -150, -170, 300, 340, 28); g.clip(); g.fillStyle = '#e0443a'; g.fillRect(-150, -170, 300, 96); g.restore();
  g.beginPath(); g.moveTo(-150, -74); g.lineTo(150, -74); g.stroke();
  for (const dx of [-80, 80]) { rr(g, dx - 12, -196, 24, 56, 12); g.fillStyle = '#141418'; g.fill(); }
  text(g, 'TAG', 0, -120, { size: 64, font: FONTS.ui, weight: 900, color: '#ffffff', spacing: 6 });
  text(g, 'X', 6, 64, { size: 230, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.25)' });
  text(g, 'X', 0, 54, { size: 230, font: FONTS.ui, weight: 900, color: '#f7c948', stroke: 30, strokeColor: '#141418' });
  g.restore();
}
function sparkle(g, x, y, s, c = '#fff6c8') { poly(g, [[x, y - 40 * s], [x + 10 * s, y - 10 * s], [x + 40 * s, y], [x + 10 * s, y + 10 * s], [x, y + 40 * s], [x - 10 * s, y + 10 * s], [x - 40 * s, y], [x - 10 * s, y - 10 * s]], c); }
function rays(g, cx, cy, a = 0.18, c = '#ffffff') { g.save(); g.globalAlpha = a; for (let i = 0; i < 18; i++) { const t = i / 18 * Math.PI * 2; poly(g, [[cx, cy], [cx + Math.cos(t) * 2600, cy + Math.sin(t) * 2600], [cx + Math.cos(t + 0.09) * 2600, cy + Math.sin(t + 0.09) * 2600]], c); } g.restore(); }

registerShot('banner', { draw(g, t) {
  const { GY, CX } = street(g, 0, { z: 1.0, x: 0, y: 0 }, { mood: 'sunny' });
  rays(g, E.W / 2, E.H * 0.5, 0.12);
  // cast on both sides (visible on desktop/TV, outside the mobile safe area)
  const left = [[SAM, 'joy', POSES.cheer], [JONAS, 'grin', POSES.crossArms], [KIND, 'excited', POSES.wave]];
  const right = [[LEO, 'smile', POSES.wave], [SAENGERIN, 'happy', POSES.cheer], [BRANDT, 'smirk', POSES.crossArms]];
  left.forEach(([o, e, p], i) => drawToon(g, { x: 110 + i * 110, y: GY + 20 + (i % 2) * 20, s: 1.15, facing: 1, outfit: o, pose: p, expr: e }));
  right.forEach(([o, e, p], i) => drawToon(g, { x: E.W - 110 - i * 110, y: GY + 20 + (i % 2) * 20, s: 1.15, facing: -1, outfit: o, pose: p, expr: e }));
  // logo panel in the safe area (x 380–1540, y 381–698)
  const px = E.W / 2, py = E.H / 2 + 6;
  rr(g, px - 560 + 8, py - 150 + 12, 1120, 300, 40); g.fillStyle = 'rgba(0,0,0,.25)'; g.fill();
  rr(g, px - 560, py - 150, 1120, 300, 40); g.fillStyle = alpha('#16161a', 0.92); g.fill(); g.strokeStyle = '#f7c948'; g.lineWidth = 8; g.stroke();
  calendarX(g, px - 400, py - 4, 0.72, -0.1);
  text(g, 'TAG X TOONS', px + 135, py - 42, { size: 100, font: FONTS.ui, weight: 900, color: '#f7c948', stroke: 18, strokeColor: '#141418', spacing: 4 });
  text(g, 'WAS WÄRE, WENN …?', px + 135, py + 56, { size: 52, font: FONTS.ui, weight: 900, color: '#ffffff', spacing: 3 });
  text(g, 'Animierte Gedankenexperimente · jede Woche neu', px + 135, py + 112, { size: 32, font: FONTS.ui, weight: 800, color: '#c9c3b8' });
  for (const [x, y, s] of [[px - 520, py - 190, 0.9], [px + 540, py - 170, 0.7], [px + 520, py + 180, 0.6]]) sparkle(g, x, y, s);
} });

registerShot('avatar', { draw(g, t) {
  backdrop(g, ['#7fbbe8', '#b7dcf3']);
  const cx = E.W / 2, cy = E.H / 2;
  rays(g, cx, cy, 0.22);
  softEllipse(g, cx, cy, 520, 520, '#fff3c8', 0.7);
  calendarX(g, cx, cy + 20, 1.45, -0.08);
  sparkle(g, cx - 330, cy - 260, 1.0); sparkle(g, cx + 320, cy - 280, 0.8); sparkle(g, cx + 330, cy + 250, 0.7); sparkle(g, cx - 320, cy + 260, 0.6);
} });
