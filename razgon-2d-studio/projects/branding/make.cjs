const { chromium } = require('playwright');
const fs = require('fs');
const LIME = '#B6FF1A', DARK = '#0A0E06';
const FONT = `font-family:'Arial Black','Impact','Helvetica Neue',sans-serif;font-weight:900;`;
// big black head, thin neck, lime hoodie, half-lidded eyes looking right
const char = (id) => `
<g id="${id}">
  <rect x="-22" y="170" width="44" height="90" rx="14" fill="#0b0b0b"/>
  <path d="M-150 420 Q-150 250 -60 250 L60 250 Q150 250 150 420 Z" fill="${LIME}"/>
  <path d="M-58 252 Q0 300 58 252" fill="none" stroke="#6fa300" stroke-width="10" stroke-linecap="round"/>
  <line x1="-22" y1="290" x2="-22" y2="350" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <line x1="22" y1="290" x2="22" y2="350" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <circle cx="0" cy="0" r="190" fill="#0b0b0b"/>
  <ellipse cx="-95" cy="-60" rx="40" ry="90" fill="${LIME}" opacity=".18" transform="rotate(25 -95 -60)"/>
  <g fill="#fff"><path d="M-80 -14 Q-52 -34 -22 -14 L-26 4 Q-52 14 -78 4Z"/><path d="M38 -14 Q66 -34 96 -14 L92 4 Q66 14 40 4Z"/></g>
  <path d="M-62 62 Q-20 94 24 66" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <path d="M70 -4 l5 -14 l5 14 l14 5 l-14 5 l-5 14 l-5 -14 l-14 -5z" fill="${LIME}"/>
</g>`;
const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<defs><radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#4f7a0a"/><stop offset="1" stop-color="#0A0E06"/></radialGradient></defs>
<rect width="800" height="800" fill="url(#g)"/>
<text x="575" y="290" font-size="210" fill="#B6FF1A" style="${FONT}" text-anchor="middle" transform="rotate(12 575 290)">?</text>
<g transform="translate(375 360) scale(.78)">${char('c')}</g>
<rect x="258" y="680" width="234" height="130" fill="${LIME}"/>
</svg>`;
const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="1440" viewBox="0 0 2560 1440">
<defs>
<radialGradient id="bg" cx="30%" cy="50%" r="80%"><stop offset="0" stop-color="#2a3f08"/><stop offset="1" stop-color="${DARK}"/></radialGradient>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${LIME}" stop-opacity=".55"/><stop offset="1" stop-color="${LIME}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="2560" height="1440" fill="url(#bg)"/>
<circle cx="720" cy="700" r="520" fill="url(#glow)"/>
<g fill="${LIME}" opacity=".10" style="${FONT}">
 <text x="160" y="300" font-size="260" transform="rotate(-12 160 300)">?</text>
 <text x="2300" y="360" font-size="300" transform="rotate(14 2300 360)">?</text>
 <text x="2200" y="1250" font-size="240" transform="rotate(-10 2200 1250)">?</text>
 <text x="220" y="1250" font-size="200" transform="rotate(10 220 1250)">?</text>
 <text x="1280" y="1380" font-size="180">?</text>
</g>
<!-- safe area guide: x507-2053 y508-932 -->
<g transform="translate(700 625) scale(.66)">${char('c')}</g>
<text x="1000" y="780" font-size="215" fill="${LIME}" style="${FONT}" stroke="#000" stroke-width="14" paint-order="stroke" letter-spacing="-4">IFLAB<tspan fill="#fff">?</tspan></text>
<rect x="1010" y="830" width="880" height="64" rx="8" fill="#e5252a" transform="rotate(-1.5 1010 830)"/>
<text x="1040" y="878" font-size="40" fill="#fff" style="${FONT}" letter-spacing="3" transform="rotate(-1.5 1010 830)">WHAT IF? WE TEST IT.</text>
</svg>`;
(async () => {
  fs.writeFileSync('avatar.svg', avatar); fs.writeFileSync('banner.svg', banner);
  const b = await chromium.launch(); 
  for (const [n, w, h] of [['avatar', 800, 800], ['banner', 2560, 1440]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(`<body style="margin:0">${fs.readFileSync(n + '.svg', 'utf8')}</body>`);
    await p.screenshot({ path: n + '.png' });
  }
  await b.close();
})();
