// thumbs.js — 5 YouTube thumbnails (text is added later in PIL). Bright background, big knowing face, one explanatory prop.
import { E, S, registerShot, mood, ease, clamp, lerp, alpha, shade, mix, rr, circle, ring, poly, seg, glow, text, rng, FONTS } from '/engine/core.js';
import { bigFace, drawFigure, POSES, EXPR } from '/engine/rig2d.js';
EXPR.smug = { eyes: 'dot', brows: 'angry', mouth: 'smirk' };
import * as FX from '/engine/fx2d.js';
import { bgBlur } from './_common.js';
import { CAST } from '../cast.js';
import { drawBand } from './_inserts2.js';

// competitor-style character: full big head (not cropped) on a thin neck + narrow hoodie torso; small flat
// half-lidded eyes shifted toward the gaze; tiny smirk; thin cyan band; soft rim light, no outline ring.
const face = (g, x, y, r, expr, o = {}) => {
  const dir = o.dir ?? 1, col = o.hoodie || '#d64a33', ink = '#0b0a0f';
  glow(g, x, y, r * 2.3, o.halo || '#ffd59a', o.haloA ?? 0.35);
  // torso + hood behind the neck
  g.fillStyle = shade(col, -0.15); g.beginPath(); g.moveTo(x - r * 0.75, E.H + 20); g.quadraticCurveTo(x - r * 0.7, y + r * 1.05, x, y + r * 1.0); g.quadraticCurveTo(x + r * 0.7, y + r * 1.05, x + r * 0.75, E.H + 20); g.closePath(); g.fill();
  g.fillStyle = shade(col, -0.45); g.beginPath(); g.ellipse(x, y + r * 1.02, r * 0.42, r * 0.16, 0, 0, Math.PI * 2); g.fill();
  seg(g, [[x - r * 0.12, y + r * 1.25], [x - r * 0.18, E.H]], r * 0.03, alpha('#f4efe6', 0.6)); seg(g, [[x + r * 0.12, y + r * 1.25], [x + r * 0.18, E.H]], r * 0.03, alpha('#f4efe6', 0.6));
  g.fillStyle = ink; g.fillRect(x - r * 0.13, y + r * 0.8, r * 0.26, r * 0.3);                       // neck
  circle(g, x, y, r, ink);                                                                            // head
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  const rg = g.createRadialGradient(x + dir * r * 0.9, y - r * 0.6, r * 0.1, x + dir * r * 0.9, y - r * 0.6, r * 1.1); rg.addColorStop(0, alpha(o.rim || '#ffe2b0', 0.35)); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2);
  if (o.band !== false) { g.fillStyle = '#5ff2e8'; g.beginPath(); g.moveTo(x - r, y - r * 0.5); g.quadraticCurveTo(x, y - r * 0.62, x + r, y - r * 0.5); g.lineTo(x + r, y - r * 0.32); g.quadraticCurveTo(x, y - r * 0.44, x - r, y - r * 0.32); g.closePath(); g.fill(); glow(g, x, y - r * 0.45, r, '#5ff2e8', 0.12); }
  g.restore();
  if (o.band !== false) { g.fillStyle = '#4ad8ce'; g.beginPath(); g.moveTo(x - dir * r * 0.97, y - r * 0.42); g.quadraticCurveTo(x - dir * r * 1.3, y - r * 0.3, x - dir * r * 1.38, y - r * 0.02); g.lineTo(x - dir * r * 1.24, y - r * 0.02); g.quadraticCurveTo(x - dir * r * 1.18, y - r * 0.24, x - dir * r * 0.97, y - r * 0.3); g.fill(); }
  const ex = x + dir * r * 0.24, ey = y - r * 0.02, sp = r * 0.44, W2 = '#f6f2ea';
  for (const k of [-1, 1]) {
    const cx = ex + k * sp / 2;
    if (expr === 'smug') { g.fillStyle = W2; g.beginPath(); g.ellipse(cx, ey, r * 0.165, r * 0.095, 0, 0, Math.PI); g.fill(); g.fillStyle = ink; circle(g, cx + dir * r * 0.07, ey + r * 0.035, r * 0.055, ink); seg(g, [[cx - r * 0.2, ey - r * 0.01 - k * dir * r * 0.02], [cx + r * 0.2, ey + r * 0.01 + k * dir * r * 0.02]], r * 0.04, W2); }
    else { circle(g, cx, ey, r * (expr === 'shocked' ? 0.18 : 0.16), W2); circle(g, cx + dir * r * 0.05, ey + r * 0.01, r * 0.08, ink); }
  }
  if (o.star) { const sx = ex + sp / 2 * (dir > 0 ? -1 : 1), sy = ey; glow(g, sx, sy, r * 0.5, '#fff3c0', 0.7); FX.sparkle(g, sx, sy, r * 0.28, '#ffffff', 1); }
  const mx = x + dir * r * 0.3, my = y + r * 0.38; g.strokeStyle = W2; g.lineCap = 'round'; g.lineWidth = r * 0.05; g.beginPath();
  if (expr === 'smug') { g.moveTo(mx - r * 0.14, my); g.quadraticCurveTo(mx + r * 0.02, my + r * 0.07, mx + r * 0.16 * dir, my - r * 0.06); g.stroke(); }
  else if (expr === 'shocked') { g.ellipse(mx, my, r * 0.08, r * 0.11, 0, 0, Math.PI * 2); g.fillStyle = W2; g.fill(); }
  else { g.moveTo(mx - r * 0.14, my); for (let i = 1; i <= 4; i++) g.lineTo(mx - r * 0.14 + i * r * 0.07, my + (i % 2 ? -1 : 1) * r * 0.03); g.stroke(); }
};
const tint = (g, c, a = 0.25) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha(c, a); g.fillRect(0, 0, E.W, E.H); g.restore(); };
const lift = (g, a = 0.12) => { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(255,220,180,${a})`; g.fillRect(0, 0, E.W, E.H); g.restore(); };

// set 'brain' — «What if you used 100% of your brain» (approved sample: 1_100.png = brain.1)
const BRAIN = {
  // 100%. — a brain gauge pinned past the red
  1(g, t) {
    bgBlur(g, t, 'cafe', {}, { z: 1.4, blur: 18, veil: 0.1, y: -160 }); lift(g);
    const cx = 1420, cy = 720, R = 360;
    circle(g, cx, cy, R + 40, alpha('#0c0c14', 0.85)); ring(g, cx, cy, R + 40, 14, '#f4efe6');
    const segs = 9; for (let i = 0; i < segs; i++) { const a0 = Math.PI + i / segs * Math.PI, a1 = a0 + Math.PI / segs - 0.03; g.strokeStyle = ['#3fb950', '#3fb950', '#8fd14f', '#d9e04a', '#f2c21a', '#f29a1a', '#f2601a', '#e8321a', '#c0101a'][i]; g.lineWidth = 70; g.beginPath(); g.arc(cx, cy, R - 40, a0, a1); g.stroke(); }
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; seg(g, [[cx + Math.cos(a) * (R - 110), cy + Math.sin(a) * (R - 110)], [cx + Math.cos(a) * (R - 140), cy + Math.sin(a) * (R - 140)]], 6, '#f4efe6'); }
    const na = Math.PI * 2.08; glow(g, cx + Math.cos(na) * R * 0.7, cy + Math.sin(na) * R * 0.7, 200, '#ff3a1a', 0.7);
    seg(g, [[cx, cy], [cx + Math.cos(na) * (R - 20), cy + Math.sin(na) * (R - 20)]], 18, '#ff3a1a'); circle(g, cx, cy, 34, '#f4efe6');
    for (let i = 0; i < 4; i++) seg(g, [[cx + 300 + i * 14, cy - 140 + i * 30], [cx + 340 + i * 14, cy - 150 + i * 30]], 6, alpha('#ffffff', 0.7));
    text(g, 'BRAIN', cx, cy + 130, { size: 64, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 8 });
    FX.sparkle(g, cx + R * 0.85, cy - 30, 70, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.3, star: true });
  },
  // TOO LOUD. — sound rings, voices and forks crowding the head
  2(g, t) {
    bgBlur(g, t, 'canteen', {}, { z: 1.3, blur: 16, veil: 0.12, y: -150 }); lift(g, 0.1);
    const x = 620, y = 700, r = 330, cols = ['#f2c21a', '#d64a33', '#5ff2e8', '#f29ac0'];
    for (let i = 0; i < 5; i++) { g.strokeStyle = alpha(cols[i % 4], 0.85 - i * 0.13); g.lineWidth = 16 - i * 2; g.beginPath(); g.arc(x, y, r + 70 + i * 70, 0, Math.PI * 2); g.stroke(); }
    const r2 = rng(5); const words = ['BLAH', 'HAHA', 'CLINK', 'HEY!', 'BZZZ', 'LOL', '!!!'];
    words.forEach((w, i) => { const a = -2.6 + i * 0.75, d = r + 260 + (i % 2) * 90, bx = x + Math.cos(a) * d * 1.4, by = y + Math.sin(a) * d * 0.8; if (bx > E.W - 80 || by < 60 || (bx > 900 && by < 360)) return; g.save(); g.translate(bx, by); g.rotate((r2() - 0.5) * 0.4); rr(g, -120, -50, 240, 100, 40); g.fillStyle = '#f4efe6'; g.fill(); text(g, w, 0, 4, { size: 48, color: '#2a2236', font: FONTS.ui, weight: 900 }); g.restore(); });
    for (let i = 0; i < 4; i++) { const fx = 1380 + i * 120, fy = 820 - (i % 2) * 140; g.save(); g.translate(fx, fy); g.rotate(-0.8 + i * 0.5); seg(g, [[-70, 0], [60, 0]], 14, '#d8dce6'); for (let k = 0; k < 3; k++) seg(g, [[60, -14 + k * 14], [100, -14 + k * 14]], 7, '#d8dce6'); g.restore(); }
    face(g, x, y - 60, 300, 'scared', { halo: '#ff6a3a', haloA: 0.35 });
  },
  // TOO EASY. — a test, every answer ticked, 100 stamp
  3(g, t) {
    bgBlur(g, t, 'exam', {}, { z: 1.3, blur: 16, veil: 0.1, y: -140 }); lift(g, 0.12);
    g.save(); g.translate(1400, 600); g.rotate(0.08); g.fillStyle = '#f6f1e6'; g.fillRect(-330, -420, 660, 860); g.fillStyle = '#c0392b'; g.fillRect(-330, -420, 660, 14);
    for (let i = 0; i < 8; i++) { seg(g, [[-270, -320 + i * 92], [-270 + 360 * (0.6 + (i % 3) * 0.15), -320 + i * 92]], 12, alpha('#8a8a9a', 0.55)); seg(g, [[200, -320 + i * 92], [222, -298 + i * 92], [266, -346 + i * 92]], 12, '#3fb950'); }
    g.save(); g.translate(60, 260); g.rotate(-0.25); ring(g, 0, 0, 150, 16, '#e8321a'); text(g, '100', 0, 6, { size: 120, color: '#e8321a', font: FONTS.ui, weight: 900 }); g.restore(); g.restore();
    FX.clock(g, 1020, 300, 110, 9 * 3600 + 9 * 60, {});
    face(g, 500, 650, 300, 'smug', { halo: '#f2c21a', haloA: 0.35, star: true });
  },
  // 2 SECONDS. — the giant screen falling on Leo, Max's shocked face
  4(g, t) {
    bgBlur(g, t, 'stage', { lightsOn: true }, { z: 1.1, blur: 8, veil: 0.08, y: -60, x: 0 }); lift(g, 0.06);
    const sx = 1380, sy = 380; g.save(); g.translate(sx, sy); g.rotate(-0.18); rr(g, -420, -170, 840, 340, 12); g.fillStyle = '#0c0c12'; g.fill(); g.fillStyle = '#1d5a78'; g.fillRect(-400, -150, 800, 300); glow(g, 0, 0, 500, '#5ff2e8', 0.25); text(g, 'LUMEN', 40, 0, { size: 110, color: '#e8fbff', font: FONTS.title, weight: 700, spacing: 12 }); g.restore();
    for (let i = 0; i < 6; i++) seg(g, [[sx - 380 + i * 150, sy - 260 - i * 6], [sx - 380 + i * 150, sy - 400 - i * 6]], 6, alpha('#ffffff', 0.55));
    g.fillStyle = alpha('#000', 0.35); g.beginPath(); g.ellipse(1400, 980, 380, 50, 0, 0, 7); g.fill();
    drawFigure(g, { x: 1330, y: 990, s: 1.1, outfit: CAST.leo, pose: POSES.lie, rot: -1.57, expr: 'sleepy', rim: { color: '#ffe2b0', dir: [0, -1] } });
    poly(g, [[1640, 760], [1720, 620], [1800, 760]], '#f2c21a'); text(g, '!', 1720, 715, { size: 80, color: '#1a1622', font: FONTS.ui, weight: 900 });
    face(g, 470, 650, 300, 'shocked', { halo: '#ff4a3a', haloA: 0.3 });
  },
  // I KNEW. — 5:59, the alarm hasn't rung yet
  5(g, t) {
    bgBlur(g, t, 'bedroom', {}, { z: 1.3, blur: 14, veil: 0.05, y: -140 }); lift(g, 0.08);
    const x = 1400, y = 560; rr(g, x - 380, y - 190, 760, 380, 60); g.fillStyle = '#121016'; g.fill(); g.fillStyle = '#0a0a0e'; g.fillRect(x - 320, y - 130, 640, 260);
    glow(g, x, y, 520, '#ff3a2a', 0.3); text(g, '5:59', x, y + 6, { size: 230, color: '#ff4a3a', font: FONTS.ui, weight: 900, glow: 34, glowColor: 'rgba(255,74,58,.8)' });
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) seg(g, [[x + s * (420 + i * 30), y - 150 + i * 90], [x + s * (470 + i * 30), y - 170 + i * 90]], 8, alpha('#ffd0c0', 0.5));
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.35 });
  },
};

// set 'forget' — «What If You NEVER Forgot Anything?»
const FORGET = {
  // NO DELETE. — MEMORY storage bar, full to the red
  1(g, t) {
    bgBlur(g, t, 'library', {}, { z: 1.35, blur: 16, veil: 0.08, y: -150 }); lift(g, 0.16); tint(g, '#ff9a3a', 0.45);
    const px = 1020, py = 270, pw = 840, ph = 560, cx = px + pw / 2;
    glow(g, cx, py + ph / 2, 620, '#ff5a2a', 0.22);
    rr(g, px, py, pw, ph, 56); g.fillStyle = alpha('#0c0c14', 0.9); g.fill(); g.lineWidth = 14; g.strokeStyle = '#f4efe6'; g.stroke();
    text(g, 'MEMORY', cx, py + 95, { size: 70, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 10 });
    const bx = px + 70, by = py + 175, bw = pw - 170, bh = 190, n = 10, gap = 12, sw = (bw - 24 - gap * (n - 1)) / n;
    rr(g, bx, by, bw, bh, 30); g.lineWidth = 12; g.strokeStyle = '#f4efe6'; g.stroke(); rr(g, bx + bw + 6, by + bh / 2 - 45, 34, 90, 10); g.fillStyle = '#f4efe6'; g.fill();
    const C = ['#3fb950', '#5cc24f', '#8fd14f', '#d9e04a', '#f2c21a', '#f29a1a', '#f2601a', '#e8321a', '#d01a1a', '#c0101a'];
    for (let i = 0; i < n; i++) { rr(g, bx + 12 + i * (sw + gap), by + 14, sw, bh - 28, 10); g.fillStyle = C[i]; g.fill(); }
    glow(g, bx + bw - 40, by + bh / 2, 260, '#ff2a1a', 0.6);
    for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.45; seg(g, [[bx + bw + 60 + Math.cos(a) * 20, by + bh / 2 + Math.sin(a) * 60], [bx + bw + 60 + Math.cos(a) * 60, by + bh / 2 + Math.sin(a) * 120]], 8, alpha('#ffe0c0', 0.85)); }
    text(g, '99.9%', cx, py + ph - 95, { size: 130, color: '#ff4a2a', font: FONTS.ui, weight: 900, glow: 30, glowColor: 'rgba(255,60,30,.8)' });
    FX.sparkle(g, bx + bw - 20, by + 10, 80, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.3, star: true });
  },
  // EVERY DAY. — a calendar, every single day ticked + REC
  2(g, t) {
    bgBlur(g, t, 'bedroomDay', {}, { z: 1.3, blur: 16, veil: 0.05, y: -140 }); lift(g, 0.16); tint(g, '#ffb03a', 0.5);
    glow(g, 1440, 600, 600, '#ffd06a', 0.35);
    g.save(); g.translate(1450, 640); g.rotate(0.07); g.scale(0.86, 0.86);
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-360, -400, 740, 840);
    g.fillStyle = '#f6f1e6'; g.fillRect(-380, -420, 740, 840); g.fillStyle = '#d63a2a'; g.fillRect(-380, -420, 740, 170);
    for (let i = 0; i < 6; i++) circle(g, -300 + i * 120, -420, 18, '#2a2236');
    text(g, '2009', -10, -330, { size: 100, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 6 });
    const cw = 98, ch = 112;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { if (r * 7 + c >= 31) continue; const x = -345 + c * cw, y = -225 + r * ch; g.strokeStyle = alpha('#8a8a9a', 0.4); g.lineWidth = 3; g.strokeRect(x, y, cw, ch); text(g, String(r * 7 + c + 1), x + 18, y + 22, { size: 24, color: '#6a6a7a', font: FONTS.ui, weight: 800, align: 'left' }); seg(g, [[x + 26, y + 66], [x + 44, y + 86], [x + 78, y + 44]], 11, '#3fb950'); }
    g.restore();
    rr(g, 1540, 90, 300, 100, 50); g.fillStyle = alpha('#0c0c14', 0.85); g.fill(); glow(g, 1600, 140, 90, '#ff2a1a', 0.7); circle(g, 1600, 140, 26, '#ff2a1a');
    text(g, 'REC', 1720, 142, { size: 64, color: '#f4efe6', font: FONTS.ui, weight: 900, spacing: 4 });
    face(g, 500, 650, 300, 'smug', { halo: '#f2c21a', haloA: 0.35, star: true });
  },
  // ALL OF IT. — π recited to 10,000 digits on a glowing board
  3(g, t) {
    bgBlur(g, t, 'class', {}, { z: 1.3, blur: 16, veil: 0.06, y: -140 }); lift(g, 0.14); tint(g, '#3affd0', 0.35);
    const px = 1000, py = 200, pw = 860, ph = 720;
    glow(g, px + pw / 2, py + ph / 2, 650, '#5ff2e8', 0.3);
    rr(g, px, py, pw, ph, 40); g.fillStyle = alpha('#06121a', 0.9); g.fill(); g.lineWidth = 12; g.strokeStyle = '#f4efe6'; g.stroke();
    text(g, 'π', px + 60, py + 130, { size: 200, color: '#ffd628', font: FONTS.serif, weight: 700, align: 'left', glow: 30, glowColor: 'rgba(255,214,40,.8)' });
    text(g, '= 3.14159', px + 210, py + 140, { size: 110, color: '#e8fbff', font: FONTS.ui, weight: 900, align: 'left' });
    const D = '2653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198';
    let k = 0; for (let r = 0; r < 9; r++) { const a = 1 - r * 0.1, s = 46 - r * 1.5; text(g, D.slice(k, k + 24), px + 60, py + 270 + r * 50, { size: s, color: '#9fe8ff', font: FONTS.ui, weight: 800, align: 'left', alpha: a, spacing: 2 }); k += 24; }
    FX.sparkle(g, px + pw - 60, py + 60, 80, '#fff3c0', 1);
    face(g, 500, 650, 300, 'smug', { halo: '#ff9a3a', haloA: 0.3, star: true });
  },
  // IT HURTS. — a storm of old memories (polaroids), shocked face
  4(g, t) {
    bgBlur(g, t, 'streetDusk', {}, { z: 1.3, blur: 14, veil: 0.04, y: -120 }); lift(g, 0.14);
    glow(g, 1400, 520, 700, '#ff7a3a', 0.3);
    const pol = (x, y, s, rot, kind, sky) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = alpha('#000', 0.35); g.fillRect(-112, -122, 240, 280); g.fillStyle = '#f6f1e6'; g.fillRect(-120, -130, 240, 280); g.fillStyle = sky; g.fillRect(-100, -110, 200, 190);
      if (kind === 'sad') { circle(g, 0, -10, 60, '#0b0a0f'); circle(g, -20, -20, 9, '#f6f2ea'); circle(g, 20, -20, 9, '#f6f2ea'); g.strokeStyle = '#f6f2ea'; g.lineWidth = 7; g.beginPath(); g.arc(0, 30, 22, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); seg(g, [[-20, -8], [-24, 20]], 5, '#7fd0ff'); }
      if (kind === 'heart') { g.fillStyle = '#e8321a'; g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(-90, -20, -40, -90, 0, -40); g.bezierCurveTo(40, -90, 90, -20, 0, 40); g.fill(); seg(g, [[0, -40], [-12, -10], [10, 5], [0, 40]], 7, '#f6f1e6'); }
      if (kind === 'sun') { circle(g, 40, -50, 30, '#ffe27a'); poly(g, [[-100, 80], [-30, -10], [40, 80]], '#2f6a4a'); poly(g, [[0, 80], [60, 10], [100, 80]], '#3f8a5a'); }
      if (kind === 'cake') { g.fillStyle = '#f29ac0'; g.fillRect(-60, 10, 120, 60); g.fillStyle = '#fff'; g.fillRect(-60, 5, 120, 14); seg(g, [[0, 5], [0, -30]], 8, '#5ff2e8'); glow(g, 0, -40, 30, '#ffd06a', 0.9); }
      if (kind === 'fig') { circle(g, -30, -20, 30, '#0b0a0f'); circle(g, 40, -10, 26, '#0b0a0f'); g.fillStyle = '#0b0a0f'; g.fillRect(-50, 15, 40, 65); g.fillRect(22, 20, 36, 60); }
      g.restore(); };
    pol(1180, 230, 0.8, -0.3, 'sun', '#7fc6ff'); pol(1750, 250, 0.8, 0.25, 'cake', '#3a2a5a'); pol(1820, 760, 0.85, -0.2, 'fig', '#ffb07a'); pol(1130, 830, 0.8, 0.28, 'heart', '#2a2a40');
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; seg(g, [[1470 + Math.cos(a) * 330, 540 + Math.sin(a) * 300], [1470 + Math.cos(a) * 400, 540 + Math.sin(a) * 360]], 8, alpha('#ffffff', 0.6)); }
    pol(1470, 540, 1.45, 0.06, 'sad', '#6a7aa0');
    face(g, 500, 650, 300, 'shocked', { halo: '#ff4a3a', haloA: 0.3 });
  },
  // NOPE. — "Delete memory?" error dialog, DELETE button dead
  5(g, t) {
    bgBlur(g, t, 'lab', {}, { z: 1.3, blur: 14, veil: 0.04, y: -140 }); lift(g, 0.16); tint(g, '#7a4aff', 0.6); glow(g, 450, 600, 700, '#b04aff', 0.25);
    const px = 1000, py = 260, pw = 860, ph = 560, cx = px + pw / 2;
    glow(g, cx, py + ph / 2, 650, '#5fa8ff', 0.35);
    g.fillStyle = alpha('#000', 0.35); rr(g, px + 18, py + 22, pw, ph, 24); g.fill();
    rr(g, px, py, pw, ph, 24); g.fillStyle = '#eef1f6'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#0c0c14'; g.stroke();
    g.save(); rr(g, px, py, pw, 100, 24); g.clip(); g.fillStyle = '#2a6ae0'; g.fillRect(px, py, pw, 100); g.restore();
    text(g, 'brain.exe', px + 40, py + 52, { size: 46, color: '#ffffff', font: FONTS.ui, weight: 800, align: 'left' });
    rr(g, px + pw - 90, py + 22, 60, 56, 10); g.fillStyle = '#e8321a'; g.fill(); seg(g, [[px + pw - 74, py + 36], [px + pw - 46, py + 64]], 7, '#fff'); seg(g, [[px + pw - 46, py + 36], [px + pw - 74, py + 64]], 7, '#fff');
    circle(g, px + 130, py + 230, 70, '#e8321a'); seg(g, [[px + 100, py + 200], [px + 160, py + 260]], 16, '#fff'); seg(g, [[px + 160, py + 200], [px + 100, py + 260]], 16, '#fff');
    text(g, 'Delete memory?', px + 240, py + 205, { size: 66, color: '#1a1622', font: FONTS.ui, weight: 900, align: 'left' });
    text(g, 'Access denied. Forever.', px + 240, py + 275, { size: 44, color: '#5a5a6a', font: FONTS.ui, weight: 700, align: 'left' });
    rr(g, px + 80, py + 380, 330, 110, 20); g.fillStyle = '#c9ccd4'; g.fill(); text(g, 'DELETE', px + 245, py + 437, { size: 52, color: '#8a8d96', font: FONTS.ui, weight: 900 });
    seg(g, [[px + 60, py + 470], [px + 430, py + 400]], 14, '#e8321a');
    rr(g, px + 450, py + 380, 330, 110, 20); g.fillStyle = '#3fb950'; g.fill(); g.lineWidth = 8; g.strokeStyle = '#1e7a32'; g.stroke(); text(g, 'KEEP ALL', px + 615, py + 437, { size: 52, color: '#ffffff', font: FONTS.ui, weight: 900 });
    g.save(); g.translate(px + 260, py + 460); poly(g, [[0, 0], [0, 80], [20, 62], [36, 96], [50, 90], [34, 56], [60, 56]], '#ffffff'); g.lineWidth = 5; g.strokeStyle = '#0c0c14'; g.stroke(); g.restore();
    face(g, 500, 650, 300, 'smug', { halo: '#5ff2e8', haloA: 0.35, star: true });
  },
};
const SETS_T = { brain: BRAIN, forget: FORGET };
for (const s of E.shots) if (s.params?.tpl === 'thumb') registerShot(s.id, { draw(g, t, info) { SETS_T[info.set || 'brain'][info.k](g, t); } });
