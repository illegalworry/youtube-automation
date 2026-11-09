// Teleport thumbnails in the niche's flat "What if" look (original character and scenes).
// usage: CHROMIUM_PATH=/opt/pw-browsers/chromium node make-style.mjs  -> out/style_*.jpg
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'out'); fs.mkdirSync(OUT, { recursive: true });
const FONT = fs.readFileSync(path.join(DIR, 'fonts/Poppins-Black.woff2')).toString('base64');
const W = 1280, H = 720; let n = 0; const id = p => `${p}${n++}`;
const INK = '#0b0a10', EYE = '#f5f1e8';

function rng(seed) { let a = seed; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; }

// ---------- character: big round head, coloured hood behind it, thin neck, hoodie cropped by frame ----------
function hero({ x, y, r, hoodie, hood, gaze = -1, expr = 'bored', star = false, rim = '#8fe9ff' }) {
  const hg = id('h'), rg = id('r');
  let s = `<defs><linearGradient id="${hg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hoodie}"/><stop offset="1" stop-color="${shade(hoodie, -0.35)}"/></linearGradient>
    <radialGradient id="${rg}" cx="${0.5 - gaze * 0.35}" cy="0.25" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>`;
  // body
  s += `<path d="M${x - 0.95 * r},${H + 20} L${x - 0.92 * r},${y + 1.75 * r} Q${x - 0.85 * r},${y + 1.32 * r} ${x - 0.25 * r},${y + 1.25 * r} L${x + 0.25 * r},${y + 1.25 * r} Q${x + 0.85 * r},${y + 1.32 * r} ${x + 0.92 * r},${y + 1.75 * r} L${x + 0.95 * r},${H + 20} Z" fill="url(#${hg})"/>`;
  s += `<path d="M${x - 0.32 * r},${y + 1.27 * r} Q${x},${y + 1.48 * r} ${x + 0.32 * r},${y + 1.27 * r}" fill="none" stroke="${shade(hoodie, -0.45)}" stroke-width="${0.08 * r}" stroke-linecap="round"/>`;
  for (const k of [-1, 1]) s += `<path d="M${x + k * 0.16 * r},${y + 1.38 * r} L${x + k * 0.19 * r},${y + 1.95 * r}" stroke="${EYE}" stroke-opacity="0.85" stroke-width="${0.035 * r}" stroke-linecap="round"/><circle cx="${x + k * 0.19 * r}" cy="${y + 1.97 * r}" r="${0.03 * r}" fill="${EYE}" opacity="0.85"/>`;
  // neck
  s += `<rect x="${x - 0.09 * r}" y="${y + 0.85 * r}" width="${0.18 * r}" height="${0.45 * r}" rx="${0.04 * r}" fill="${INK}"/>`;
  // hood behind the head
  s += `<circle cx="${x + gaze * 0.04 * r}" cy="${y - 0.04 * r}" r="${1.08 * r}" fill="${hood}"/>`;
  s += `<circle cx="${x + gaze * 0.04 * r}" cy="${y - 0.04 * r}" r="${1.08 * r}" fill="none" stroke="${rim}" stroke-opacity="0.5" stroke-width="${0.02 * r}"/>`;
  // head
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${rg})"/>`;
  // eyes
  const ex = x + gaze * 0.28 * r, ey = y - 0.06 * r, rx = 0.15 * r, ry = 0.1 * r;
  for (const k of [-1, 1]) {
    const cx = ex + k * 0.25 * r;
    if (expr === 'bored') {
      const t = -k * gaze * 0.02 * r;
      s += `<path d="M${cx - rx},${ey + t} L${cx + rx},${ey - t} A${rx} ${ry * 0.8} 0 0 1 ${cx - rx},${ey + t} Z" fill="${EYE}"/>`;
      s += `<rect x="${cx - rx * 1.15}" y="${ey - 0.065 * r + (k * gaze > 0 ? 0.01 * r : -0.01 * r)}" width="${rx * 2.3}" height="${0.045 * r}" rx="${0.02 * r}" fill="${EYE}" transform="rotate(${k * gaze * 4} ${cx} ${ey})"/>`;
      s += `<circle cx="${cx + gaze * rx * 0.45}" cy="${ey + ry * 0.25}" r="${0.05 * r}" fill="${INK}"/>`;
    } else {
      s += `<path d="M${cx - rx},${ey - 0.02 * r * k * gaze} L${cx + rx},${ey + 0.03 * r * k * gaze} A${rx} ${ry} 0 0 1 ${cx - rx},${ey - 0.02 * r * k * gaze} Z" fill="${EYE}"/>`;
      s += `<circle cx="${cx + gaze * rx * 0.4}" cy="${ey + ry * 0.4}" r="${0.055 * r}" fill="${INK}"/>`;
    }
  }
  if (star) { const sx = ex + gaze * 0.25 * r + 0.06 * r, sy = ey - 0.07 * r; s += `<circle cx="${sx}" cy="${sy}" r="${0.18 * r}" fill="#fff6d6" opacity="0.45" filter="url(#b6)"/>${spark(sx, sy, 0.17 * r, '#ffffff')}`; }
  // mouth
  const mx = x + gaze * 0.3 * r, my = y + 0.36 * r;
  if (expr === 'bored') s += `<path d="M${mx - 0.12 * r},${my + 0.01 * r} L${mx + 0.1 * r},${my - 0.015 * r}" stroke="${EYE}" stroke-width="${0.055 * r}" stroke-linecap="round"/>`;
  else s += `<path d="M${mx - 0.14 * r},${my} Q${mx - gaze * 0.02 * r},${my + 0.08 * r} ${mx + gaze * 0.16 * r},${my - 0.07 * r}" fill="none" stroke="${EYE}" stroke-width="${0.05 * r}" stroke-linecap="round"/>`;
  return s;
}
const spark = (x, y, s, c) => `<path d="M${x},${y - s} Q${x + s * 0.12},${y - s * 0.12} ${x + s},${y} Q${x + s * 0.12},${y + s * 0.12} ${x},${y + s} Q${x - s * 0.12},${y + s * 0.12} ${x - s},${y} Q${x - s * 0.12},${y - s * 0.12} ${x},${y - s} Z" fill="${c}"/>`;
function shade(hex, k) { const v = parseInt(hex.slice(1), 16); const f = c => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k); return '#' + [v >> 16, (v >> 8) & 255, v & 255].map(f).map(c => c.toString(16).padStart(2, '0')).join(''); }

// ---------- shared ----------
const DEFS = `<defs>
 <style>@font-face{font-family:P;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:900}</style>
 <filter id="b40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
 <filter id="b14" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
 <filter id="b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
 <filter id="tsh" x="-10%" y="-20%" width="130%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.75"/></filter>
 <radialGradient id="vig" cx="0.5" cy="0.5" r="0.78"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient>
</defs>`;
const text = (t, x, y, size, fill, anchor = 'start') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="P" font-weight="900" font-size="${size}" letter-spacing="-1" fill="${fill}" stroke="#08070c" stroke-width="${size * 0.07}" stroke-linejoin="round" paint-order="stroke" filter="url(#tsh)">${t}</text>`;
function nightBg(top, bottom, seed, glow) {
  const g = id('bg'), r = rng(seed); let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${g})"/>`;
  s += `<g filter="url(#b14)" opacity="0.6">`; for (let i = 0; i < 5; i++) s += `<ellipse cx="${r() * W}" cy="${80 + r() * 220}" rx="${160 + r() * 200}" ry="${14 + r() * 14}" fill="#c9a6d8" opacity="${0.12 + r() * 0.15}"/>`; s += `</g>`;
  if (glow) s += `<circle cx="${glow[0]}" cy="${glow[1]}" r="${glow[2]}" fill="${glow[3]}" opacity="0.35" filter="url(#b40)"/>`;
  s += `<g filter="url(#b6)" opacity="0.55"><path d="M0,${H} L0,560 ${Array.from({ length: 16 }, (_, i) => `L${i * 85},${520 + r() * 60} L${i * 85 + 85},${520 + r() * 60}`).join(' ')} L${W},${H} Z" fill="#120d24"/></g>`;
  for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H; s += `<line x1="${x}" y1="${y}" x2="${x - 2}" y2="${y + 10 + r() * 8}" stroke="#ffffff" stroke-opacity="${0.25 + r() * 0.4}" stroke-width="2" stroke-linecap="round"/>`; }
  return s;
}
const vig = `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
function portalRing(cx, cy, rx, ry, inner, seed = 3) {
  const c = id('pc'), r = rng(seed);
  let s = `<defs><clipPath id="${c}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.35}" ry="${ry * 1.35}" fill="#4fd8ff" opacity="0.35" filter="url(#b40)"/>`;
  s += `<g clip-path="url(#${c})">${inner}<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#04131f" stroke-opacity="0.5" stroke-width="${rx * 0.2}" filter="url(#b14)"/></g>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#4fd8ff" stroke-width="${rx * 0.12}" opacity="0.6" filter="url(#b6)"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e8fdff" stroke-width="${rx * 0.035}"/>`;
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = 1.04 + r() * 0.3; s += `<circle cx="${cx + Math.cos(a) * rx * d}" cy="${cy + Math.sin(a) * ry * d}" r="${1.5 + r() * 3.5}" fill="#c9f7ff" opacity="${0.4 + r() * 0.6}"/>`; }
  return s;
}
function eiffel(cx, base, h, color) {
  const w = h * 0.5, P = (fx, fy) => `${cx + fx * w},${base - fy * h}`;
  return `<path d="M${P(-0.5, 0)} L${P(-0.13, 0.45)} L${P(-0.065, 0.75)} L${P(-0.018, 0.96)} L${P(0, 1.02)} L${P(0.018, 0.96)} L${P(0.065, 0.75)} L${P(0.13, 0.45)} L${P(0.5, 0)} L${P(0.3, 0)} Q${P(0, 0.34)} ${P(-0.3, 0)} Z" fill="${color}"/><rect x="${cx - 0.2 * w}" y="${base - 0.47 * h}" width="${0.4 * w}" height="${0.035 * h}" fill="${color}"/><rect x="${cx - 0.1 * w}" y="${base - 0.77 * h}" width="${0.2 * w}" height="${0.03 * h}" fill="${color}"/>`;
}
function plane(x, y, s, ang) {
  const g = id('pl');
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c3d6"/></linearGradient></defs>
  <g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})">
    <path d="M-170,-6 L-120,-70 L-95,-70 L-110,-8 Z" fill="#c8d1e2"/>
    <path d="M-10,8 L-70,95 L-35,95 L50,10 Z" fill="#aeb9cf"/>
    <path d="M-180,-14 Q-180,-30 -150,-30 L140,-30 Q205,-28 215,0 Q205,26 140,28 L-150,28 Q-180,28 -180,14 Z" fill="url(#${g})"/>
    <path d="M-10,-6 L-80,-75 L-48,-75 L45,-8 Z" fill="#d7deeb"/>
    ${Array.from({ length: 9 }, (_, i) => `<circle cx="${-120 + i * 28}" cy="-6" r="7" fill="#33435f"/>`).join('')}
    <path d="M165,-18 Q192,-14 200,-2 L168,-2 Z" fill="#33435f"/>
  </g>`;
}

// ---------- scenes ----------
const scenes = {
  // A: hero bored by a passing airliner
  planes() {
    let s = nightBg('#1b1440', '#3a1f55', 4, [980, 360, 300, '#4fd8ff']);
    s += `<path d="M-40,390 L560,322" stroke="#ffffff" stroke-opacity="0.25" stroke-width="70" stroke-linecap="round" filter="url(#b14)"/>`;
    for (let i = 0; i < 5; i++) s += `<line x1="${60 + i * 40}" y1="${360 + i * 14}" x2="${300 + i * 40}" y2="${335 + i * 14}" stroke="#ffffff" stroke-opacity="${0.35 - i * 0.05}" stroke-width="4" stroke-linecap="round"/>`;
    s += plane(560, 330, 1.05, -7);
    s += portalRing(990, 395, 215, 270, `<rect x="700" y="80" width="600" height="640" fill="#0b2d4a"/><circle cx="990" cy="395" r="220" fill="#1f6f9e" opacity="0.6" filter="url(#b40)"/>`, 6);
    s += hero({ x: 990, y: 400, r: 165, hoodie: '#e2463a', hood: '#f08a6e', gaze: -1, expr: 'bored' });
    s += vig + text('PLANES?', 44, 150, 128, '#ffffff') + text('CUTE.', 44, 285, 128, '#ffd23f');
    return s;
  },
  // B: anywhere in 0.1 sec — portal with Paris at sunset
  anywhere() {
    let s = nightBg('#101a3e', '#22184a', 9, [900, 360, 320, '#ff8a5c']);
    const inner = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3ec4"/><stop offset="0.55" stop-color="#ff6e5a"/><stop offset="0.9" stop-color="#ffcf6e"/></linearGradient></defs>
      <rect x="620" y="60" width="580" height="620" fill="url(#sky)"/><circle cx="960" cy="455" r="70" fill="#fff0c0" filter="url(#b14)"/><circle cx="960" cy="455" r="44" fill="#fff6dc"/>
      <path d="M620,520 Q760,490 900,515 T1200,505 L1200,700 L620,700 Z" fill="#331d4c"/>${eiffel(880, 540, 330, '#22143a')}`;
    s += portalRing(915, 330, 215, 262, inner, 12);
    s += hero({ x: 330, y: 430, r: 205, hoodie: '#2f6fe0', hood: '#f2a65a', gaze: 1, expr: 'smug', star: true, rim: '#ffd9a0' });
    s += vig + text('ANYWHERE.', 40, 128, 120, '#ffffff') + text('0.1 SEC.', 1225, 605, 118, '#ff3b30', 'end');
    return s;
  },
  // C: 10,000 km in 0 seconds — globe with a jump arc
  globe() {
    let s = nightBg('#0f1636', '#251a4c', 21, [520, 380, 320, '#4fb4ff']);
    const gx = 520, gy = 440, gr = 235, gc = id('gc');
    s += `<defs><clipPath id="${gc}"><circle cx="${gx}" cy="${gy}" r="${gr}"/></clipPath><radialGradient id="sea" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stop-color="#5ab8f0"/><stop offset="1" stop-color="#173f8f"/></radialGradient></defs>`;
    s += `<circle cx="${gx}" cy="${gy}" r="${gr + 18}" fill="#7fd6ff" opacity="0.35" filter="url(#b14)"/><circle cx="${gx}" cy="${gy}" r="${gr}" fill="url(#sea)"/>`;
    s += `<g clip-path="url(#${gc})" fill="#5fcf7a"><path d="M300,240 Q360,190 430,215 Q470,260 440,300 Q400,330 410,380 Q380,420 330,390 Q290,340 300,240 Z"/><path d="M520,200 Q600,180 650,230 Q700,280 660,320 Q610,330 580,300 Q540,280 520,200 Z"/><path d="M560,380 Q640,360 690,420 Q700,500 640,560 Q590,580 570,520 Q540,450 560,380 Z"/><path d="M330,470 Q380,450 420,500 Q430,560 380,600 Q340,590 330,540 Z"/></g>`;
    s += `<circle cx="${gx}" cy="${gy}" r="${gr}" fill="none" stroke="#c9eeff" stroke-opacity="0.5" stroke-width="4"/>`;
    s += `<path d="M400,345 Q520,90 650,500" fill="none" stroke="#ffd23f" stroke-width="12" stroke-dasharray="4 26" stroke-linecap="round"/>`;
    for (const [px, py] of [[400, 345], [650, 500]]) s += `<circle cx="${px}" cy="${py}" r="34" fill="#ff3b30" opacity="0.35" filter="url(#b6)"/><path d="M${px},${py} C${px - 26},${py - 30} ${px - 26},${py - 62} ${px},${py - 62} C${px + 26},${py - 62} ${px + 26},${py - 30} ${px},${py} Z" fill="#ff3b30" stroke="#08070c" stroke-width="5"/><circle cx="${px}" cy="${py - 42}" r="9" fill="#fff"/>`;
    s += portalRing(1015, 410, 180, 240, `<rect x="800" y="140" width="440" height="560" fill="#0b2d4a"/>`, 31);
    s += hero({ x: 1015, y: 420, r: 150, hoodie: '#f0a020', hood: '#9b7cf0', gaze: -1, expr: 'bored', rim: '#c9b6ff' });
    s += vig + text('10,000 KM.', 40, 120, 104, '#ffffff') + text('0 SEC.', 40, 232, 104, '#ffd23f');
    return s;
  },
};

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
for (const [name, fn] of Object.entries(scenes)) {
  await page.setContent(`<html><body style="margin:0;background:#000"><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${DEFS}${fn()}</svg></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `style_${name}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H } });
  console.log('wrote', file);
}
await browser.close();
