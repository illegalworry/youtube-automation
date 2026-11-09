// Teleport thumbnails drawn in SVG and rendered with headless Chromium.
// usage: node make.mjs   -> out/*.jpg (1920x1080)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'out');
fs.mkdirSync(OUT, { recursive: true });
const W = 1280, H = 720;
let uid = 0; const id = p => `${p}${uid++}`;

// ---------- character ----------
function hero({ x, y, r, hoodie, gaze = [1, 0], rim = '#ffb070', rimSide = 1, expr = 'smug', torso = true }) {
  const [gx, gy] = gaze, g1 = id('hg'), rg = id('rg'), dark = shade(hoodie, -0.35);
  let s = `<defs>
    <linearGradient id="${g1}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(hoodie, 0.12)}"/><stop offset="1" stop-color="${shade(hoodie, -0.25)}"/></linearGradient>
    <radialGradient id="${rg}" cx="${0.5 + rimSide * 0.42}" cy="0.35" r="0.75"><stop offset="0" stop-color="${rim}" stop-opacity="0.55"/><stop offset="0.45" stop-color="${rim}" stop-opacity="0.12"/><stop offset="1" stop-color="${rim}" stop-opacity="0"/></radialGradient>
  </defs>`;
  if (torso) {
    s += `<path d="M${x - 0.88 * r},${H + 40} L${x - 0.88 * r},${y + 1.4 * r} Q${x - 0.82 * r},${y + 0.98 * r} ${x},${y + 0.95 * r} Q${x + 0.82 * r},${y + 0.98 * r} ${x + 0.88 * r},${y + 1.4 * r} L${x + 0.88 * r},${H + 40} Z" fill="url(#${g1})"/>`;
    s += `<ellipse cx="${x}" cy="${y + 0.99 * r}" rx="${0.46 * r}" ry="${0.17 * r}" fill="${dark}"/>`;
    for (const k of [-1, 1]) s += `<path d="M${x + k * 0.13 * r},${y + 1.12 * r} L${x + k * 0.17 * r},${y + 1.6 * r}" stroke="#f3eee6" stroke-opacity="0.75" stroke-width="${0.035 * r}" stroke-linecap="round"/>`;
  }
  s += `<rect x="${x - 0.11 * r}" y="${y + 0.75 * r}" width="${0.22 * r}" height="${0.32 * r}" fill="#0d0c12"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#0d0c12"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${rg})"/>`;
  s += `<path d="M${x + rimSide * r * Math.cos(-1.1)},${y + r * Math.sin(-1.1)} A${r} ${r} 0 0 ${rimSide > 0 ? 1 : 0} ${x + rimSide * r * Math.cos(0.9)},${y + r * Math.sin(0.9)}" fill="none" stroke="${rim}" stroke-opacity="0.85" stroke-width="${0.035 * r}" stroke-linecap="round"/>`;
  // eyes
  const ex = x + gx * r * 0.3, ey = y - 0.04 * r + gy * r * 0.1, rx = 0.17 * r, ry = 0.12 * r;
  for (const k of [-1, 1]) {
    const cx = ex + k * 0.23 * r;
    if (expr === 'smug') {
      const tilt = k * gx * 0.035 * r;
      s += `<path d="M${cx - rx},${ey + tilt} L${cx + rx},${ey - tilt} A${rx} ${ry} 0 0 1 ${cx - rx},${ey + tilt} Z" fill="#f6f1e8"/>`;
      s += `<circle cx="${cx + gx * rx * 0.45}" cy="${ey + ry * 0.48}" r="${0.065 * r}" fill="#0d0c12"/>`;
    } else {
      const ryy = expr === 'scared' ? ry * 1.25 : ry;
      s += `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ryy}" fill="#f6f1e8"/>`;
      s += `<circle cx="${cx + gx * rx * 0.45}" cy="${ey + gy * ryy * 0.45}" r="${0.07 * r}" fill="#0d0c12"/>`;
      if (expr === 'determined') s += `<path d="M${cx - rx * 1.1},${ey - ryy * 1.35 - k * gx * 0.02 * r} L${cx + rx * 1.1},${ey - ryy * 1.35 + k * gx * 0.06 * r}" stroke="#f6f1e8" stroke-width="${0.045 * r}" stroke-linecap="round"/>`;
    }
  }
  const mx = x + gx * r * 0.3, my = y + 0.4 * r;
  if (expr === 'smug') s += `<path d="M${mx - 0.16 * r},${my} Q${mx},${my + 0.09 * r} ${mx + gx * 0.18 * r},${my - 0.07 * r}" fill="none" stroke="#f6f1e8" stroke-width="${0.045 * r}" stroke-linecap="round"/>`;
  else if (expr === 'scared') s += `<ellipse cx="${mx}" cy="${my}" rx="${0.07 * r}" ry="${0.1 * r}" fill="#f6f1e8"/>`;
  else s += `<path d="M${mx - 0.12 * r},${my} L${mx + 0.12 * r},${my - 0.01 * r}" stroke="#f6f1e8" stroke-width="${0.045 * r}" stroke-linecap="round"/>`;
  return s;
}
const arm = (pts, w, color, hand = true) => {
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  let s = `<path d="${d}" fill="none" stroke="${shade(color, -0.2)}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w * 0.78}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (hand) { const [hx, hy] = pts.at(-1); s += `<circle cx="${hx}" cy="${hy}" r="${w * 0.42}" fill="#0d0c12"/>`; }
  return s;
};

// ---------- props ----------
function eiffel(cx, base, h, color) {
  const w = h * 0.5, P = (fx, fy) => `${cx + fx * w},${base - fy * h}`;
  let s = `<path d="M${P(-0.5, 0)} L${P(-0.13, 0.45)} L${P(-0.065, 0.75)} L${P(-0.018, 0.96)} L${P(0, 1.02)} L${P(0.018, 0.96)} L${P(0.065, 0.75)} L${P(0.13, 0.45)} L${P(0.5, 0)} L${P(0.3, 0)} Q${P(0, 0.34)} ${P(-0.3, 0)} Z" fill="${color}"/>`;
  s += `<rect x="${cx - 0.2 * w}" y="${base - 0.47 * h}" width="${0.4 * w}" height="${0.035 * h}" fill="${color}"/>`;
  s += `<rect x="${cx - 0.1 * w}" y="${base - 0.77 * h}" width="${0.2 * w}" height="${0.03 * h}" fill="${color}"/>`;
  return s;
}
function portal(cx, cy, r, inner, ring = '#6fe6ff') {
  const c = id('pc');
  let s = `<defs><clipPath id="${c}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 1.22}" fill="${ring}" opacity="0.22" filter="url(#blur30)"/>`;
  s += `<g clip-path="url(#${c})">${inner}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="${r * 0.18}" filter="url(#blur10)"/></g>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring}" stroke-width="${r * 0.09}" opacity="0.55" filter="url(#blur6)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e9fdff" stroke-width="${r * 0.035}"/>`;
  return s;
}
const sparks = (cx, cy, r, n, color, seed = 1) => { let s = '', a = seed; for (let i = 0; i < n; i++) { a = (a * 9301 + 49297) % 233280; const t = a / 233280; a = (a * 9301 + 49297) % 233280; const d = r * (1.05 + 0.35 * (a / 233280)); const ang = t * Math.PI * 2; s += `<circle cx="${cx + Math.cos(ang) * d}" cy="${cy + Math.sin(ang) * d}" r="${1.5 + 3 * ((i * 7) % 5) / 5}" fill="${color}" opacity="${0.4 + 0.5 * ((i * 3) % 4) / 4}"/>`; } return s; };

function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255]; const f = v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k); return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join(''); }
const DEFS = `<defs>
  <filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="blur16" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="blur10" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="blur6" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
</defs>`;
const vignette = `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
const label = (txt, x, y, size, fill = '#ffd628') => `<text x="${x + 6}" y="${y + 8}" font-family="Inter" font-weight="900" font-size="${size}" fill="#000" stroke="#000" stroke-width="${size * 0.16}" stroke-linejoin="round" opacity="0.8">${txt}</text>
<text x="${x}" y="${y}" font-family="Inter" font-weight="900" font-size="${size}" fill="${fill}" stroke="#0a0a0a" stroke-width="${size * 0.12}" stroke-linejoin="round" paint-order="stroke">${txt}</text>`;

function bedroom(tint = '#0d1836') {
  return `<rect width="${W}" height="${H}" fill="${tint}"/>
  <g filter="url(#blur16)">
    <rect x="70" y="70" width="330" height="270" rx="10" fill="#2c4f96"/><rect x="230" y="70" width="10" height="270" fill="${tint}"/><rect x="70" y="200" width="330" height="10" fill="${tint}"/>
    <circle cx="160" cy="130" r="40" fill="#cfe0ff" opacity="0.8"/>
    <rect x="0" y="560" width="${W}" height="160" fill="#09112a"/>
    <rect x="980" y="430" width="300" height="160" rx="20" fill="#1c2c5c"/><rect x="1000" y="400" width="120" height="50" rx="16" fill="#33477e"/>
    <rect x="460" y="120" width="60" height="90" rx="6" fill="#23376a"/><rect x="560" y="140" width="80" height="70" rx="6" fill="#1f3060"/>
  </g>`;
}

// ---------- scenes ----------
const scenes = {
  // 1. Paris on the palm
  palm(txt) {
    const pcx = 905, pcy = 300, pr = 172;
    const inner = `<defs><linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b3fbf"/><stop offset="0.5" stop-color="#ff6f61"/><stop offset="0.85" stop-color="#ffc56b"/></linearGradient></defs>
      <rect x="${pcx - pr}" y="${pcy - pr}" width="${pr * 2}" height="${pr * 2}" fill="url(#sky1)"/>
      <circle cx="${pcx + 55}" cy="${pcy + 70}" r="58" fill="#ffe7a8" filter="url(#blur16)"/><circle cx="${pcx + 55}" cy="${pcy + 70}" r="34" fill="#fff4cf"/>
      <path d="M${pcx - pr},${pcy + 120} Q${pcx - 60},${pcy + 95} ${pcx},${pcy + 118} T${pcx + pr},${pcy + 108} L${pcx + pr},${pcy + pr} L${pcx - pr},${pcy + pr} Z" fill="#3a2350"/>
      ${eiffel(pcx - 18, pcy + 132, 255, '#24163a')}`;
    return `${bedroom()}
      ${hero({ x: 350, y: 330, r: 195, hoodie: '#ef7a1a', gaze: [1, -0.1], rim: '#ffb46b', rimSide: 1, expr: 'smug' })}
      <ellipse cx="${pcx}" cy="530" rx="190" ry="60" fill="#ffb46b" opacity="0.35" filter="url(#blur30)"/>
      ${arm([[500, 560], [650, 600], [830, 520]], 74, '#ef7a1a', false)}
      <path d="M812,520 Q900,570 1000,540 Q1040,528 1046,500 Q1050,486 1034,488 Q1024,510 990,514 Q900,528 830,490 Z" fill="#0d0c12"/>
      <ellipse cx="905" cy="508" rx="110" ry="16" fill="#ffb46b" opacity="0.45" filter="url(#blur10)"/>
      ${portal(pcx, pcy, pr, inner)}
      ${sparks(pcx, pcy, pr, 26, '#bff6ff', 3)}
      ${vignette}${txt ? label('40 SEC', 40, 118, 120) : ''}`;
  },
  // 2. Hand in the vault
  vault(txt) {
    const pcx = 860, pcy = 345, pr = 255;
    let bars = '';
    for (let row = 0; row < 4; row++) for (let i = 0; i < 6 - (row % 2); i++) {
      const bx = pcx - 230 + i * 92 + (row % 2) * 46, by = pcy + 175 - row * 36;
      bars += `<path d="M${bx},${by} L${bx + 82},${by} L${bx + 70},${by - 30} L${bx + 12},${by - 30} Z" fill="url(#gold)" stroke="#9a6409" stroke-width="2"/><path d="M${bx + 12},${by - 30} L${bx + 70},${by - 30} L${bx + 64},${by - 24} L${bx + 18},${by - 24} Z" fill="#fff0a8" opacity="0.7"/>`;
    }
    const inner = `<defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#d99a18"/></linearGradient>
      <radialGradient id="vaultbg" cx="0.5" cy="0.6" r="0.7"><stop offset="0" stop-color="#8a5a16"/><stop offset="1" stop-color="#2a1806"/></radialGradient></defs>
      <rect x="${pcx - pr}" y="${pcy - pr}" width="${pr * 2}" height="${pr * 2}" fill="url(#vaultbg)"/>
      <circle cx="${pcx + 170}" cy="${pcy - 95}" r="120" fill="none" stroke="#c9a15a" stroke-width="18" opacity="0.5"/><circle cx="${pcx + 170}" cy="${pcy - 95}" r="80" fill="none" stroke="#c9a15a" stroke-width="8" opacity="0.4"/>
      <rect x="${pcx - pr}" y="${pcy + 30}" width="${pr * 2}" height="14" fill="#4a2e0c"/>
      ${bars}
      <ellipse cx="${pcx}" cy="${pcy + 90}" rx="260" ry="120" fill="#ffd36a" opacity="0.28" filter="url(#blur30)"/>`;
    return `${bedroom('#0c1530')}
      ${hero({ x: 320, y: 300, r: 185, hoodie: '#2f6fe0', gaze: [1, 0.35], rim: '#ffcf5a', rimSide: 1, expr: 'smug' })}
      ${portal(pcx, pcy, pr, inner, '#7fe9ff')}
      ${arm([[455, 520], [640, 500], [905, 455]], 70, '#2f6fe0')}
      ${sparks(pcx, pcy, pr, 30, '#c6f7ff', 7)}
      ${vignette}${txt ? label('$1,000,000,000', 36, 96, 74) : ''}`;
  },
  // 3. Girl in the red jacket
  rescue(txt) {
    const pcx = 820, pcy = 295, pr = 235;
    const inner = `<defs><linearGradient id="gymw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c27c"/><stop offset="1" stop-color="#d88f45"/></linearGradient></defs>
      <rect x="${pcx - pr}" y="${pcy - pr}" width="${pr * 2}" height="${pr * 2}" fill="url(#gymw)"/>
      ${[0, 1, 2].map(i => `<ellipse cx="${pcx - 140 + i * 140}" cy="${pcy - 200}" rx="40" ry="10" fill="#fff6dc"/><ellipse cx="${pcx - 140 + i * 140}" cy="${pcy - 180}" rx="90" ry="40" fill="#fff2cc" opacity="0.35" filter="url(#blur16)"/>`).join('')}
      <rect x="${pcx + 90}" y="${pcy - 120}" width="90" height="62" fill="#fff" opacity="0.85" rx="4"/><rect x="${pcx + 120}" y="${pcy - 82}" width="30" height="20" fill="none" stroke="#e05a2a" stroke-width="5"/>
      <path d="M${pcx - pr},${pcy + 70} L${pcx + pr},${pcy + 70} L${pcx + pr},${pcy + pr} L${pcx - pr},${pcy + pr} Z" fill="#b8723a"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<line x1="${pcx - pr}" y1="${pcy + 90 + i * 28}" x2="${pcx + pr}" y2="${pcy + 90 + i * 28}" stroke="#9a5c2c" stroke-width="3"/>`).join('')}
      ${hero({ x: pcx + 35, y: pcy + 10, r: 118, hoodie: '#7a8496', gaze: [-1, 0.75], rim: '#ffd59a', rimSide: 1, expr: 'determined' })}`;
    let waves = '';
    for (let i = 0; i < 14; i++) { const y = 400 + i * 24, o = (i * 37) % 90; waves += `<path d="M${-40 + o},${y} q40,-10 80,0 t80,0 t80,0" fill="none" stroke="#3f78b8" stroke-width="3" opacity="0.35"/><path d="M${700 + o},${y + 8} q40,-10 80,0 t80,0 t80,0" fill="none" stroke="#3f78b8" stroke-width="3" opacity="0.3"/>`; }
    return `<defs><linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d22"/><stop offset="1" stop-color="#14264d"/></linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16406f"/><stop offset="1" stop-color="#061631"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#night)"/>
      <g filter="url(#blur10)"><path d="M0,400 L0,330 L90,330 L90,300 L170,300 L170,350 L260,350 L300,320 L340,350 L340,400 Z" fill="#0c1834"/><path d="M1060,400 L1060,320 L1150,280 L1240,320 L1240,300 L1290,300 L1290,400 Z" fill="#0c1834"/></g>
      <rect x="0" y="390" width="${W}" height="${H - 390}" fill="url(#water)"/>${waves}
      <ellipse cx="${pcx}" cy="535" rx="260" ry="40" fill="#ffc77a" opacity="0.3" filter="url(#blur16)"/>
      ${portal(pcx, pcy, pr, inner, '#6fe6ff')}
      ${arm([[742, 420], [640, 470], [528, 492]], 52, '#7a8496')}
      <g>
        <path d="M352,700 L352,640 Q356,598 420,592 Q484,598 488,640 L488,700 Z" fill="#e3262b"/>
        ${arm([[470, 610], [505, 548], [514, 500]], 34, '#e3262b')}
        ${hero({ x: 420, y: 538, r: 66, hoodie: '#e3262b', gaze: [1, -0.8], rim: '#ffc77a', rimSide: 1, expr: 'scared', torso: false })}
      </g>
      <ellipse cx="420" cy="642" rx="130" ry="22" fill="none" stroke="#9fd0ff" stroke-width="4" opacity="0.5"/><ellipse cx="420" cy="642" rx="185" ry="34" fill="none" stroke="#9fd0ff" stroke-width="3" opacity="0.28"/>
      <rect x="0" y="642" width="${W}" height="${H - 642}" fill="#0a2448" opacity="0.92"/>
      ${sparks(pcx, pcy, pr, 26, '#c6f7ff', 11)}
      ${vignette}${txt ? label('47', 40, 150, 150) : ''}`;
  },
};

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
for (const [name, fn] of Object.entries(scenes)) for (const txt of [false, true]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${DEFS}${fn(txt)}</svg>`;
  await page.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
  const file = path.join(OUT, `${name}${txt ? '_text' : ''}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H } });
  console.log('wrote', file);
}
await browser.close();
