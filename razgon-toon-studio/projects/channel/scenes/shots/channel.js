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
  g.fillStyle = '#7fbbe8'; g.fillRect(0, 0, E.W, E.H);   // flat single-colour background
  // centred bold text in the mobile safe area (x 380–1540, y 381–698), decor outside it for desktop/TV
  const cx = E.W / 2;
  calendarX(g, 190, E.H / 2 + 10, 0.72, -0.14); calendarX(g, E.W - 190, E.H / 2 + 10, 0.72, 0.14);
  for (const [x, y, k] of [[400, 320, 0.8], [1520, 320, 0.8], [470, 770, 0.6], [1450, 770, 0.6]]) sparkle(g, x, y, k, '#ffffff');
  text(g, 'TAG X TOONS', cx + 7, 462, { size: 122, font: FONTS.ui, weight: 900, color: 'rgba(0,0,0,.28)', spacing: 10 });
  text(g, 'TAG X TOONS', cx, 452, { size: 122, font: FONTS.ui, weight: 900, color: '#f7c948', stroke: 26, strokeColor: '#141418', spacing: 10 });
  text(g, 'WAS WÄRE, WENN …?', cx, 560, { size: 46, font: FONTS.ui, weight: 900, color: '#ffffff', stroke: 12, strokeColor: '#141418', spacing: 8 });
  // subscribe button
  const bw = 500, bh = 76, by = 648;
  rr(g, cx - bw / 2 + 6, by - bh / 2 + 8, bw, bh, bh / 2); g.fillStyle = 'rgba(0,0,0,.28)'; g.fill();
  rr(g, cx - bw / 2, by - bh / 2, bw, bh, bh / 2); g.fillStyle = '#e8443a'; g.fill(); g.strokeStyle = '#141418'; g.lineWidth = 8; g.stroke();
  // bell
  const bx = cx - bw / 2 + 58; g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(bx - 22, by + 16); g.quadraticCurveTo(bx - 20, by - 26, bx, by - 26); g.quadraticCurveTo(bx + 20, by - 26, bx + 22, by + 16); g.closePath(); g.fill(); circle(g, bx, by + 22, 7, '#ffffff');
  text(g, 'ABONNIEREN', cx + 34, by + 3, { size: 44, font: FONTS.ui, weight: 900, color: '#ffffff', spacing: 6 });
} });

registerShot('avatar', { draw(g, t) {
  backdrop(g, ['#7fbbe8', '#b7dcf3']);
  const cx = E.W / 2, cy = E.H / 2;
  rays(g, cx, cy, 0.22);
  softEllipse(g, cx, cy, 520, 520, '#fff3c8', 0.7);
  calendarX(g, cx, cy + 20, 1.45, -0.08);
  sparkle(g, cx - 330, cy - 260, 1.0); sparkle(g, cx + 320, cy - 280, 0.8); sparkle(g, cx + 330, cy + 250, 0.7); sparkle(g, cx - 320, cy + 260, 0.6);
} });
