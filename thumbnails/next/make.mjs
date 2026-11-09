// Thumbnails for: "What If You Were the Luckiest Human Alive?" and
// "What If You Could See Everyone's Death Date, except..."
// usage: CHROMIUM_PATH=/opt/pw-browsers/chromium node make.mjs -> out/*.jpg
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { W, H, hero, nightBg, text, vig, rng, shade, spark, render } from '../lib/style.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out');

const pill = (x, y, label, color, size = 40, bg = '#0b0a10') => {
  const w = label.length * size * 0.66 + size * 0.9, h = size * 1.45;
  return `<g><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${bg}" fill-opacity="0.85" stroke="${color}" stroke-width="3"/>
  <text x="${x}" y="${y + size * 0.36}" text-anchor="middle" font-family="P" font-weight="900" font-size="${size}" fill="${color}">${label}</text>
  <path d="M${x - 10},${y + h / 2} L${x},${y + h / 2 + 14} L${x + 10},${y + h / 2} Z" fill="${color}"/></g>`;
};
function bolt(x0, y0, x1, y1, seed, w = 1) {
  const r = rng(seed); let pts = [[x0, y0]];
  for (let i = 1; i < 9; i++) { const t = i / 9; pts.push([x0 + (x1 - x0) * t + (r() - 0.5) * 70, y0 + (y1 - y0) * t]); }
  pts.push([x1, y1]); const d = 'M' + pts.map(p => p.join(',')).join(' L');
  return `<path d="${d}" fill="none" stroke="#9fd8ff" stroke-width="${26 * w}" stroke-linejoin="round" opacity="0.6" filter="url(#b14)"/>
  <path d="${d}" fill="none" stroke="#e8f7ff" stroke-width="${9 * w}" stroke-linejoin="round" stroke-linecap="round"/>
  <ellipse cx="${x1}" cy="${y1}" rx="${70 * w}" ry="${16 * w}" fill="#ffd27a" opacity="0.8" filter="url(#b6)"/>
  <ellipse cx="${x1}" cy="${y1 + 4}" rx="${46 * w}" ry="${9 * w}" fill="#1a0c06"/>`;
}
function crowdPerson(x, y, s, col) {
  return `<rect x="${x - 0.08 * s}" y="${y + 0.8 * s}" width="${0.16 * s}" height="${0.4 * s}" fill="#0b0a10"/>
  <path d="M${x - 0.8 * s},${y + 2.6 * s} L${x - 0.75 * s},${y + 1.55 * s} Q${x - 0.7 * s},${y + 1.15 * s} ${x},${y + 1.12 * s} Q${x + 0.7 * s},${y + 1.15 * s} ${x + 0.75 * s},${y + 1.55 * s} L${x + 0.8 * s},${y + 2.6 * s} Z" fill="${col}"/>
  <circle cx="${x}" cy="${y}" r="${s}" fill="#0b0a10"/>`;
}

const scenes = {
  // 1A — bored hero, winning ticket again
  luck_jackpot() {
    let s = nightBg('#1e1240', '#3b1d52', 5, [520, 430, 320, '#ffc83a']);
    const r = rng(8);
    for (let i = 0; i < 46; i++) { const x = r() * 900, y = r() * H, c = ['#ffd23f', '#ff4d6d', '#4fd8ff', '#7cff8a', '#ffffff'][i % 5]; s += `<rect x="${x}" y="${y}" width="${10 + r() * 10}" height="${5 + r() * 6}" rx="2" fill="${c}" opacity="${0.6 + r() * 0.4}" transform="rotate(${r() * 180} ${x} ${y})"/>`; }
    s += `<g transform="translate(470 470) rotate(-9)">
      <rect x="-250" y="-140" width="500" height="280" rx="22" fill="#ffd23f" opacity="0.45" filter="url(#b40)"/>
      <defs><linearGradient id="tk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#f0a818"/></linearGradient></defs>
      <rect x="-230" y="-125" width="460" height="250" rx="20" fill="url(#tk)" stroke="#08070c" stroke-width="8"/>
      <rect x="-208" y="-104" width="416" height="208" rx="12" fill="none" stroke="#a86a00" stroke-width="4" stroke-dasharray="14 10"/>
      <text x="0" y="-38" text-anchor="middle" font-family="P" font-weight="900" font-size="64" fill="#d6261e" stroke="#08070c" stroke-width="4" paint-order="stroke">JACKPOT</text>
      ${[-120, 0, 120].map(cx => `<circle cx="${cx}" cy="48" r="46" fill="#fff6d0" stroke="#a86a00" stroke-width="5"/><text x="${cx}" y="72" text-anchor="middle" font-family="P" font-weight="900" font-size="66" fill="#d6261e">7</text>`).join('')}
    </g>`;
    s += spark(700, 330, 34, '#ffffff') + spark(255, 360, 24, '#fff3c0') + spark(640, 600, 20, '#ffffff');
    s += hero({ x: 1040, y: 380, r: 175, gaze: -1, expr: 'bored', star: true });
    s += vig + text('JACKPOT.', 40, 140, 122, '#ffffff') + text('AGAIN.', 40, 268, 122, '#ffd23f');
    return s;
  },
  // 1B — lightning keeps missing
  luck_lightning() {
    let s = nightBg('#0b0f26', '#241a44', 13, [820, 520, 300, '#9fd8ff']);
    s += `<rect x="0" y="600" width="${W}" height="120" fill="#0d0a1a"/>`;
    s += bolt(520, -20, 610, 618, 3, 1.15) + bolt(1220, -20, 1160, 622, 9, 0.9) + bolt(760, -20, 700, 640, 21, 0.75);
    s += hero({ x: 905, y: 340, r: 170, gaze: -1, expr: 'bored' });
    s += vig + text('MISSED.', 40, 140, 124, '#ffffff') + text('100 TIMES.', 40, 268, 110, '#ffd23f');
    return s;
  },
  // 2A — best friend: "TODAY"
  death_friend() {
    let s = nightBg('#120f2a', '#2a1630', 17, [600, 380, 260, '#ff3b30']);
    s += `<g filter="url(#b6)" opacity="0.75">${crowdPerson(150, 500, 55, '#3a2f5a')}${crowdPerson(340, 530, 45, '#4a2f4a')}</g>${pill(150, 405, '2071', '#ffffff', 30)}${pill(340, 450, '2058', '#ffffff', 26)}`;
    s += hero({ x: 600, y: 460, r: 120, hoodie: '#ff8a1f', gaze: 1, expr: 'happy' });
    s += pill(600, 300, 'TODAY', '#ff3b30', 52);
    s += `<circle cx="600" cy="300" r="140" fill="#ff3b30" opacity="0.18" filter="url(#b40)"/>`;
    s += hero({ x: 1050, y: 410, r: 175, gaze: -1, expr: 'shocked' });
    s += vig + text('HE HAS', 40, 130, 112, '#ffffff') + text('1 DAY.', 40, 250, 118, '#ff3b30');
    return s;
  },
  // 2B — everyone has a date, except you
  death_mine() {
    let s = nightBg('#100c26', '#2b1840', 29, [880, 300, 280, '#ff3b30']);
    const crowd = [[150, 400, 52, '2063'], [380, 450, 46, '2047'], [1190, 520, 48, '2091'], [590, 500, 40, '2039']];
    s += `<g filter="url(#b6)" opacity="0.8">` + crowd.map(([x, y, sc]) => crowdPerson(x, y, sc, '#3a2f5a')).join('') + `</g>` + crowd.map(([x, y, sc, d]) => pill(x, y - sc - 48, d, '#ffffff', 30)).join('');
    s += hero({ x: 880, y: 440, r: 175, gaze: 0, expr: 'shocked' });
    const gl = '??.??.????';
    s += `<g transform="translate(880 205)">
      <rect x="-250" y="-55" width="500" height="110" rx="55" fill="#0b0a10" fill-opacity="0.9" stroke="#ff3b30" stroke-width="4"/>
      <text x="-5" y="22" text-anchor="middle" font-family="P" font-weight="900" font-size="64" fill="#29e6ff" opacity="0.8">${gl}</text>
      <text x="5" y="22" text-anchor="middle" font-family="P" font-weight="900" font-size="64" fill="#ff2a2a" opacity="0.9">${gl}</text>
      <text x="0" y="22" text-anchor="middle" font-family="P" font-weight="900" font-size="64" fill="#ffffff">${gl}</text>
      <rect x="-180" y="-8" width="150" height="7" fill="#ff3b30"/><rect x="40" y="10" width="120" height="6" fill="#29e6ff"/>
      <path d="M-10,55 L0,70 L10,55 Z" fill="#ff3b30"/></g>`;
    s += `<circle cx="880" cy="205" r="200" fill="#ff3b30" opacity="0.16" filter="url(#b40)"/>`;
    s += vig + text('EVERYONE.', 40, 125, 104, '#ffffff') + text('BUT ME?', 40, 640, 112, '#ffd23f');
    return s;
  },
};
await render(scenes, OUT);
