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

// ---------- character: big round head, coloured hood behind it, thin neck, hoodie cropped by frame ----------
export function hero({ x, y, r, hoodie, hood, gaze = -1, expr = 'bored', star = false, rim = '#8fe9ff' }) {
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
    } else if (expr === 'smile') {
      s += `<path d="M${cx - rx},${ey + 0.02 * r} Q${cx},${ey - ry * 1.6} ${cx + rx},${ey + 0.02 * r}" fill="none" stroke="${EYE}" stroke-width="${0.05 * r}" stroke-linecap="round"/>`;
    } else if (expr === 'shocked') {
      s += `<ellipse cx="${cx}" cy="${ey - 0.02 * r}" rx="${rx * 0.95}" ry="${ry * 1.55}" fill="${EYE}"/>`;
      s += `<circle cx="${cx + gaze * rx * 0.3}" cy="${ey - 0.02 * r}" r="${0.045 * r}" fill="${INK}"/>`;
    } else {
      s += `<path d="M${cx - rx},${ey - 0.02 * r * k * gaze} L${cx + rx},${ey + 0.03 * r * k * gaze} A${rx} ${ry} 0 0 1 ${cx - rx},${ey - 0.02 * r * k * gaze} Z" fill="${EYE}"/>`;
      s += `<circle cx="${cx + gaze * rx * 0.4}" cy="${ey + ry * 0.4}" r="${0.055 * r}" fill="${INK}"/>`;
    }
  }
  if (star) { const sx = ex + gaze * 0.25 * r + 0.06 * r, sy = ey - 0.07 * r; s += `<circle cx="${sx}" cy="${sy}" r="${0.18 * r}" fill="#fff6d6" opacity="0.45" filter="url(#b6)"/>${spark(sx, sy, 0.17 * r, '#ffffff')}`; }
  // mouth
  const mx = x + gaze * 0.3 * r, my = y + 0.36 * r;
  if (expr === 'bored') s += `<path d="M${mx - 0.12 * r},${my + 0.01 * r} L${mx + 0.1 * r},${my - 0.015 * r}" stroke="${EYE}" stroke-width="${0.055 * r}" stroke-linecap="round"/>`;
  else if (expr === 'smile') s += `<path d="M${mx - 0.18 * r},${my - 0.03 * r} Q${mx},${my + 0.16 * r} ${mx + 0.18 * r},${my - 0.03 * r} Z" fill="${EYE}"/>`;
  else if (expr === 'shocked') s += `<ellipse cx="${mx}" cy="${my + 0.03 * r}" rx="${0.08 * r}" ry="${0.11 * r}" fill="${EYE}"/>`;
  else s += `<path d="M${mx - 0.14 * r},${my} Q${mx - gaze * 0.02 * r},${my + 0.08 * r} ${mx + gaze * 0.16 * r},${my - 0.07 * r}" fill="none" stroke="${EYE}" stroke-width="${0.05 * r}" stroke-linecap="round"/>`;
  return s;
}
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
