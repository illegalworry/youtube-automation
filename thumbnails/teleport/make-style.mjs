// Teleport thumbnails in the niche's flat "What if" look (original character and scenes).
// usage: CHROMIUM_PATH=/opt/pw-browsers/chromium node make-style.mjs  -> out/style_*.jpg
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'out');
import { W, H, hero, nightBg, portalRing, eiffel, plane, text, vig, rng, spark, render, id2 as id } from '../lib/style.mjs';

// ---------- scenes ----------
const scenes = {
  // A: hero bored by a passing airliner
  planes() {
    let s = nightBg('#1b1440', '#3a1f55', 4, [980, 360, 300, '#4fd8ff']);
    s += `<path d="M-40,390 L560,322" stroke="#ffffff" stroke-opacity="0.25" stroke-width="70" stroke-linecap="round" filter="url(#b14)"/>`;
    for (let i = 0; i < 5; i++) s += `<line x1="${60 + i * 40}" y1="${360 + i * 14}" x2="${300 + i * 40}" y2="${335 + i * 14}" stroke="#ffffff" stroke-opacity="${0.35 - i * 0.05}" stroke-width="4" stroke-linecap="round"/>`;
    s += plane(560, 330, 1.05, -7);
    s += portalRing(990, 395, 215, 270, `<rect x="700" y="80" width="600" height="640" fill="#0b2d4a"/><circle cx="990" cy="395" r="220" fill="#1f6f9e" opacity="0.6" filter="url(#b40)"/>`, 6);
    s += hero({ x: 990, y: 385, r: 165, gaze: -1, expr: 'bored' });
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
    s += hero({ x: 330, y: 400, r: 205, gaze: 1, expr: 'smile', star: true });
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
    s += hero({ x: 1015, y: 400, r: 150, gaze: -1, expr: 'bored' });
    s += vig + text('10,000 KM.', 40, 120, 104, '#ffffff') + text('0 SEC.', 40, 232, 104, '#ffd23f');
    return s;
  },
};

await render(scenes, OUT, 'style_');
