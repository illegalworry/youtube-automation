// Shared drawing kit for niche-style "What if" thumbnails (flat round-head character, night bg, bold text).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const LIB = path.dirname(fileURLToPath(import.meta.url));
const FONT = fs.readFileSync(path.join(LIB, '../teleport/fonts/Poppins-Black.woff2')).toString('base64');
export const W = 1280, H = 720; let n = 0; const id = p => `${p}${n++}`;
const INK = '#0b0a10', EYE = '#f5f1e8';

export function rng(seed) { let a = seed; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; }

// ---------- character (channel's main hero): black round head with a soft gloss, white crescent eyes
// without pupils, optional lime sparkle in one eye, thin long neck, hoodie with collar + two drawstrings ----------
export const LIME = '#b6ff1c';
export function hero({ x, y, r, hoodie = LIME, gaze = 0, expr = 'smile', star = false, starColor = LIME, gloss = true }) {
  const g = gaze * 0.12 * r, hg = id('h');
  let s = `<defs><linearGradient id="${hg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hoodie}"/><stop offset="1" stop-color="${shade(hoodie, -0.18)}"/></linearGradient></defs>`;
  // hoodie (rounded block cropped by the frame)
  const top = y + 1.31 * r, hw = 0.8 * r;
  s += `<path d="M${x - hw},${H + 20} L${x - hw},${top + 0.55 * r} Q${x - hw},${top} ${x - 0.3 * r},${top} L${x + 0.3 * r},${top} Q${x + hw},${top} ${x + hw},${top + 0.55 * r} L${x + hw},${H + 20} Z" fill="url(#${hg})"/>`;
  s += `<path d="M${x - 0.31 * r},${top} Q${x},${top + 0.17 * r} ${x + 0.31 * r},${top}" fill="none" stroke="${shade(hoodie, -0.45)}" stroke-width="${0.05 * r}" stroke-linecap="round"/>`;
  for (const k of [-1, 1]) s += `<path d="M${x + k * 0.11 * r},${top + 0.2 * r} L${x + k * 0.11 * r},${top + 0.53 * r}" stroke="#ffffff" stroke-width="${0.035 * r}" stroke-linecap="round"/>`;
  // neck + head
  s += `<rect x="${x - 0.115 * r}" y="${y + 0.9 * r}" width="${0.23 * r}" height="${0.45 * r}" fill="${INK}"/>`;
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
  if (gloss) s += `<ellipse cx="${x - 0.5 * r}" cy="${y - 0.31 * r}" rx="${0.22 * r}" ry="${0.45 * r}" fill="#ffffff" opacity="0.1" transform="rotate(25 ${x - 0.5 * r} ${y - 0.31 * r})"/>`;
  // eyes: flat top, round bottom, no pupils
  const ex = x + 0.04 * r + g, ey = y - 0.04 * r, rx = 0.15 * r;
  for (const k of [-1, 1]) {
    const cx = ex + k * 0.31 * r;
    if (expr === 'shocked') s += `<ellipse cx="${cx}" cy="${ey}" rx="${rx * 0.75}" ry="${rx * 0.95}" fill="#ffffff"/>`;
    else if (expr === 'happy') s += `<path d="M${cx - rx},${ey + 0.03 * r} Q${cx},${ey - 0.16 * r} ${cx + rx},${ey + 0.03 * r}" fill="none" stroke="#ffffff" stroke-width="${0.05 * r}" stroke-linecap="round"/>`;
    else {
      const lid = expr === 'bored' ? 0.035 * r : 0, t = k * 0.015 * r;
      s += `<path d="M${cx - rx},${ey - 0.03 * r + lid - t} L${cx + rx},${ey - 0.03 * r + lid + t} Q${cx + rx * 0.9},${ey + 0.1 * r} ${cx},${ey + 0.1 * r} Q${cx - rx * 0.9},${ey + 0.1 * r} ${cx - rx},${ey - 0.03 * r + lid - t} Z" fill="#ffffff"/>`;
    }
  }
  if (star) { const sx = ex + 0.31 * r + 0.02 * r, sy = ey + 0.03 * r; s += star4(sx, sy, 0.11 * r, starColor); }
  // mouth
  const mx = x - 0.07 * r + g, my = y + 0.36 * r;
  if (expr === 'shocked') s += `<ellipse cx="${mx + 0.05 * r}" cy="${my + 0.02 * r}" rx="${0.07 * r}" ry="${0.1 * r}" fill="#ffffff"/>`;
  else if (expr === 'bored') s += `<path d="M${mx - 0.12 * r},${my} L${mx + 0.14 * r},${my - 0.01 * r}" stroke="#ffffff" stroke-width="${0.045 * r}" stroke-linecap="round"/>`;
  else if (expr === 'happy') s += `<path d="M${mx - 0.2 * r},${my - 0.03 * r} Q${mx},${my + 0.18 * r} ${mx + 0.2 * r},${my - 0.03 * r} Z" fill="#ffffff"/>`;
  else s += `<path d="M${mx - 0.23 * r},${my - 0.02 * r} Q${mx},${my + 0.12 * r} ${mx + 0.23 * r},${my}" fill="none" stroke="#ffffff" stroke-width="${0.045 * r}" stroke-linecap="round"/>`;
  return s;
}
export const star4 = (x, y, s, c) => `<path d="M${x},${y - s * 1.6} Q${x + s * 0.18},${y - s * 0.18} ${x + s},${y} Q${x + s * 0.18},${y + s * 0.18} ${x},${y + s * 1.6} Q${x - s * 0.18},${y + s * 0.18} ${x - s},${y} Q${x - s * 0.18},${y - s * 0.18} ${x},${y - s * 1.6} Z" fill="${c}"/>`;
export const spark = (x, y, s, c) => `<path d="M${x},${y - s} Q${x + s * 0.12},${y - s * 0.12} ${x + s},${y} Q${x + s * 0.12},${y + s * 0.12} ${x},${y + s} Q${x - s * 0.12},${y + s * 0.12} ${x - s},${y} Q${x - s * 0.12},${y - s * 0.12} ${x},${y - s} Z" fill="${c}"/>`;
export function shade(hex, k) { const v = parseInt(hex.slice(1), 16); const f = c => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k); return '#' + [v >> 16, (v >> 8) & 255, v & 255].map(f).map(c => c.toString(16).padStart(2, '0')).join(''); }

// ---------- shared ----------
export const DEFS = `<defs>
 <style>@font-face{font-family:P;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:900}</style>
 <filter id="b40" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
 <filter id="b14" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
 <filter id="b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
 <filter id="tsh" x="-10%" y="-20%" width="130%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.75"/></filter>
 <radialGradient id="vig" cx="0.5" cy="0.5" r="0.78"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/></radialGradient>
</defs>`;
export const text = (t, x, y, size, fill, anchor = 'start') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="P" font-weight="900" font-size="${size}" letter-spacing="-1" fill="${fill}" stroke="#08070c" stroke-width="${size * 0.07}" stroke-linejoin="round" paint-order="stroke" filter="url(#tsh)">${t}</text>`;
export function nightBg(top, bottom, seed, glow) {
  const g = id('bg'), r = rng(seed); let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${g})"/>`;
  s += `<g filter="url(#b14)" opacity="0.6">`; for (let i = 0; i < 5; i++) s += `<ellipse cx="${r() * W}" cy="${80 + r() * 220}" rx="${160 + r() * 200}" ry="${14 + r() * 14}" fill="#c9a6d8" opacity="${0.12 + r() * 0.15}"/>`; s += `</g>`;
  if (glow) s += `<circle cx="${glow[0]}" cy="${glow[1]}" r="${glow[2]}" fill="${glow[3]}" opacity="0.35" filter="url(#b40)"/>`;
  s += `<g filter="url(#b6)" opacity="0.55"><path d="M0,${H} L0,560 ${Array.from({ length: 16 }, (_, i) => `L${i * 85},${520 + r() * 60} L${i * 85 + 85},${520 + r() * 60}`).join(' ')} L${W},${H} Z" fill="#120d24"/></g>`;
  for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H; s += `<line x1="${x}" y1="${y}" x2="${x - 2}" y2="${y + 10 + r() * 8}" stroke="#ffffff" stroke-opacity="${0.25 + r() * 0.4}" stroke-width="2" stroke-linecap="round"/>`; }
  return s;
}
export const vig = `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
export function portalRing(cx, cy, rx, ry, inner, seed = 3) {
  const c = id('pc'), r = rng(seed);
  let s = `<defs><clipPath id="${c}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath></defs>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 1.35}" ry="${ry * 1.35}" fill="#4fd8ff" opacity="0.35" filter="url(#b40)"/>`;
  s += `<g clip-path="url(#${c})">${inner}<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#04131f" stroke-opacity="0.5" stroke-width="${rx * 0.2}" filter="url(#b14)"/></g>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#4fd8ff" stroke-width="${rx * 0.12}" opacity="0.6" filter="url(#b6)"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e8fdff" stroke-width="${rx * 0.035}"/>`;
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = 1.04 + r() * 0.3; s += `<circle cx="${cx + Math.cos(a) * rx * d}" cy="${cy + Math.sin(a) * ry * d}" r="${1.5 + r() * 3.5}" fill="#c9f7ff" opacity="${0.4 + r() * 0.6}"/>`; }
  return s;
}
export function eiffel(cx, base, h, color) {
  const w = h * 0.5, P = (fx, fy) => `${cx + fx * w},${base - fy * h}`;
  return `<path d="M${P(-0.5, 0)} L${P(-0.13, 0.45)} L${P(-0.065, 0.75)} L${P(-0.018, 0.96)} L${P(0, 1.02)} L${P(0.018, 0.96)} L${P(0.065, 0.75)} L${P(0.13, 0.45)} L${P(0.5, 0)} L${P(0.3, 0)} Q${P(0, 0.34)} ${P(-0.3, 0)} Z" fill="${color}"/><rect x="${cx - 0.2 * w}" y="${base - 0.47 * h}" width="${0.4 * w}" height="${0.035 * h}" fill="${color}"/><rect x="${cx - 0.1 * w}" y="${base - 0.77 * h}" width="${0.2 * w}" height="${0.03 * h}" fill="${color}"/>`;
}
export function plane(x, y, s, ang) {
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


export const id2 = id;
export async function render(scenes, outDir, prefix = '') {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
  for (const [name, fn] of Object.entries(scenes)) {
    await page.setContent(`<html><body style="margin:0;background:#000"><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${DEFS}${fn()}</svg></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, `${prefix}${name}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H } });
    console.log('wrote', file);
  }
  await browser.close();
}
