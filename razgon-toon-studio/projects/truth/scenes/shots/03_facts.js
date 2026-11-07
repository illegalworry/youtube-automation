import { E, V, registerShot, layer, clamp, prog, ease, text, rr, FONTS } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { camPath, camAdd, drift, impact, posesSpring, kText, spring } from '/engine/motion.js';
import { drawToon } from '/engine/toon.js';
import { classroom } from '/engine/toonsets.js';
import { sticker, labelBox } from '/engine/toonui.js';
import { LYOSHA } from '../cast.js';

const SC = () => V(1.75, 1.7);
const toggle = (t) => (g, x, y, w, h) => {
  const k = ease.outBack(clamp(prog(t, 0.9, 1.2))), cx = x + w / 2, cy = y + h / 2;
  g.fillStyle = '#d6dadf'; g.fillRect(x, y, w, h);
  text(g, 'ЛОЖЬ', cx, y + 60, { size: 70, font: FONTS.ui, weight: 900, color: '#24272e' });
  rr(g, cx - 130, cy - 10, 260, 110, 55); g.fillStyle = k > 0.5 ? '#9aa1a8' : '#2fb491'; g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cx + (k > 0.5 ? -75 : 75), cy + 45, 44, 0, 7); g.fill();
  text(g, k > 0.5 ? 'ВЫКЛ' : 'ВКЛ', cx, y + h - 40, { size: 50, font: FONTS.ui, weight: 900, color: k > 0.5 ? '#d6533c' : '#2fb491' });
};

// s005 — "это не странность, это отключённая функция": the lie switch on the board turns off.
registerShot('s005', { draw(g, t, info) {
  const im = impact(t, 1.0, { amp: 8 });
  const cam = camAdd(camAdd(camPath(t, [[0, { z: 1.15, x: 20 }], [info.dur, { z: 1.3, x: 40, y: 50 }]]), drift(t, 4, 3)), { x: im.x, y: im.y, r: im.r });
  const { GY, CX, front } = classroom(g, t, cam, { onBoard: toggle(t) });
  layer(g, cam, 1, (g) => { drawToon(g, { x: CX + 340, y: GY, s: SC(), facing: -1, outfit: LYOSHA, pose: posesSpring(t, [[0, breathe(POSES.stand, t)], [1.0, POSES.shrug]]), expr: t > 1.0 ? 'neutral' : 'worried', look: [-1, -0.2] }); });
  front(g);
} });

const card = (t, g, bars) => {
  g.fillStyle = '#fdf3dc'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  labelBox(g, t, 'НАШЕ «ЧТО, ЕСЛИ»', E.W / 2, V(150, 260), { start: 0, size: V(44, 52) });
  const x0 = E.W / 2 - V(560, 400), bw = V(1000, 780);
  bars.forEach(([name, val, col, delay], i) => {
    const y = V(380, 640) + i * V(230, 260), k = ease.out(clamp(prog(t, delay, delay + 0.9)));
    text(g, name, x0, y - 50, { size: V(60, 54), font: FONTS.ui, weight: 900, color: '#24272e', align: 'left' });
    rr(g, x0, y, bw, 90, 45); g.fillStyle = '#e8dcc0'; g.fill();
    rr(g, x0, y, Math.max(90, bw * val * k), 90, 45); g.fillStyle = col; g.fill();
    text(g, (val * k * 0.5).toFixed(1).replace('.', ',') + ' с', x0 + bw - 20, y - 50, { size: V(60, 54), font: FONTS.ui, weight: 900, color: col, align: 'right' });
  });
};

// s006 — "мозг тратит на ложь в пять раз больше времени": two bars, 0,1 s vs 0,5 s.
registerShot('s006', { draw(g, t, info) {
  const cam = camAdd({ z: 1 + 0.03 * ease.inOut(clamp(t / info.dur)) }, drift(t, 3, 9));
  layer(g, cam, 1, (g) => card(t, g, [['ПРАВДА', 0.2, '#2fb491', 0.3], ['ЛОЖЬ', 1.0, '#d6533c', 1.2]]));
  const k = clamp(prog(t, 2.0, 2.3)); if (k > 0) sticker(g, t, '×5', E.W / 2 + V(560, 330), V(520, 760), { start: 2.0, r: V(95, 80), color: '#e8c04a' });
} });

// s007 — "сегодня этот шаг выключили": the lie bar is cancelled.
registerShot('s007', { draw(g, t, info) {
  const im = impact(t, 0.7, { amp: 10 });
  const cam = camAdd({ z: 1.03 }, { x: im.x, y: im.y, r: im.r });
  layer(g, cam, 1, (g) => {
    card(t + 3, g, [['ПРАВДА', 0.2, '#2fb491', -9], ['ЛОЖЬ', 1.0, '#9aa1a8', -9]]);
    const y = V(380, 640) + V(230, 260) + 45;
    g.fillStyle = '#d6533c'; g.save(); g.translate(E.W / 2, y); g.rotate(-0.04); g.fillRect(-V(560, 400), -8 , V(1120, 800) * ease.out(clamp(prog(t, 0.6, 0.85))), 16); g.restore();
  });
  kText(g, t, 'ВЫКЛЮЧЕНО', E.W / 2, V(880, 1250), { start: 0.65, mode: 'slam', size: V(120, 110), font: 'Nunito', weight: 900, color: '#d6533c' });
} });
