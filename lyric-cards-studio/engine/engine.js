// Lyric Cards engine: deterministic renderer. window.renderAt(t) draws the frame at time t (seconds).
(async () => {
const { clamp, lerp, eo, eio, prog, rnd, hexA, mixHex } = window.U;
const qs = new URLSearchParams(location.search);
const CFG = await (await fetch('/project/config.json')).json();
const AUDIO = await (await fetch('/project/build/audio.json')).json();
const SONG = window.SONG;
const FMT = qs.get('fmt') || 'square';
const [OW, OH] = CFG.formats[FMT];
const SH = Math.round(1080 * OH / OW);                     // stage height in design units (stage width = 1080)
const V = SH > 1300;                                         // vertical layout
const L = V ? { head: 170, lyr: 330, lyrH: 240, card: 1030, prog: 1660 } : { head: 34, lyr: 92, lyrH: 190, card: 590, prog: 968 };
const stage = document.getElementById('stage');
stage.style.height = SH + 'px'; stage.style.transform = `scale(${OW / 1080})`;
const $ = id => document.getElementById(id);
$('header').style.top = L.head + 'px';
$('lyrics').style.top = L.lyr + 'px'; $('lyrics').style.height = L.lyrH + 'px';
$('progress').style.top = L.prog + 'px';
$('artist').textContent = CFG.artist; $('title').textContent = CFG.title;
if (!CFG.title) document.querySelector('#header .dot').style.display = 'none';

// ---------- audio helpers ----------
const envAt = t => { const e = AUDIO.env; const i = clamp(t * AUDIO.fps, 0, e.length - 1); const a = Math.floor(i); return lerp(e[a], e[Math.min(a + 1, e.length - 1)], i - a); };
window.__GRID = AUDIO.grid;
const pulseAt = t => { let lb = -9; for (const b of AUDIO.grid) { if (b <= t) lb = b; else break; } return Math.exp(-(t - lb) * 5.5); };

// ---------- background painting (once) ----------
const BW = 1080 * 1.22, BH = SH * 1.22;
function paintBackground() {
  const c = document.createElement('canvas'); c.width = BW; c.height = BH; const g = c.getContext('2d');
  const R = rnd(7);
  const hz = BH * (V ? 0.60 : 0.62);
  let gr = g.createLinearGradient(0, 0, 0, hz);
  gr.addColorStop(0, '#0f0b2e'); gr.addColorStop(.38, '#2e1a5c'); gr.addColorStop(.66, '#7b3477'); gr.addColorStop(.86, '#ef6a6a'); gr.addColorStop(1, '#ffb27a');
  g.fillStyle = gr; g.fillRect(0, 0, BW, hz + 2);
  for (let i = 0; i < 260; i++) { const y = R() ** 1.6 * hz * .75; g.globalAlpha = .25 + R() * .75 * (1 - y / hz); g.fillStyle = '#fff'; g.beginPath(); g.arc(R() * BW, y, R() * 1.8 + .4, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  // low sun glow
  const sx = BW * .64; gr = g.createRadialGradient(sx, hz, 0, sx, hz, BW * .55);
  gr.addColorStop(0, 'rgba(255,214,150,.95)'); gr.addColorStop(.15, 'rgba(255,150,110,.55)'); gr.addColorStop(.5, 'rgba(200,70,120,.18)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, BW, BH);
  // mountain ranges (Ala-Too): far → near
  const ranges = [
    { base: hz - BH * .03, amp: BH * .26, col: '#8a4f8f', snow: .9, seed: 3 },
    { base: hz + 2, amp: BH * .19, col: '#5c3274', snow: .55, seed: 11 },
    { base: hz + 6, amp: BH * .1, col: '#331d4f', snow: 0, seed: 23 },
  ];
  for (const r of ranges) {
    const RR = rnd(r.seed); const pts = []; const n = 256; let hmin = 1e9;
    const ph = [RR() * 6, RR() * 6, RR() * 6, RR() * 6];
    for (let i = 0; i <= n; i++) {
      const x = i / n; let h = .55 * Math.abs(Math.sin(x * 3.1 + ph[0])) + .3 * Math.sin(x * 7.3 + ph[1]) ** 2 + .15 * Math.sin(x * 17 + ph[2]) + .07 * Math.sin(x * 41 + ph[3]) + (RR() - .5) * .03;
      const y = r.base - h * r.amp; pts.push([x * BW, y]); hmin = Math.min(hmin, y);
    }
    g.beginPath(); g.moveTo(0, BH); pts.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(BW, BH); g.closePath();
    gr = g.createLinearGradient(0, hmin, 0, r.base);
    if (r.snow) { gr.addColorStop(0, `rgba(255,236,245,${r.snow})`); gr.addColorStop(.22, r.col); } else gr.addColorStop(0, r.col);
    gr.addColorStop(1, mixHex(r.col, '#ff9a7a', .25));
    g.fillStyle = gr; g.fill();
  }
  // lake with reflection
  const lk = hz + 8, lb = BH * (V ? .80 : .84);
  g.save(); g.beginPath(); g.rect(0, lk, BW, lb - lk); g.clip();
  g.translate(0, 2 * lk); g.scale(1, -1); g.globalAlpha = .55; g.drawImage(c, 0, 0); g.restore();
  gr = g.createLinearGradient(0, lk, 0, lb); gr.addColorStop(0, 'rgba(255,170,130,.25)'); gr.addColorStop(1, 'rgba(20,10,40,.85)');
  g.fillStyle = gr; g.fillRect(0, lk, BW, lb - lk);
  for (let i = 0; i < 70; i++) { const y = lk + R() ** 2 * (lb - lk); g.fillStyle = `rgba(255,${190 + R() * 50},${150 + R() * 60},${.25 + R() * .35})`; g.fillRect(sx - 160 + (R() - .5) * 260 * (1 + (y - lk) / 200), y, 30 + R() * 120, 2); }
  // foreground shore + yurt
  g.fillStyle = '#140a24'; g.beginPath(); g.moveTo(0, BH); g.lineTo(0, lb - 30);
  for (let x = 0; x <= BW; x += 20) g.lineTo(x, lb - 22 + Math.sin(x / 140) * 18 + Math.sin(x / 47) * 5);
  g.lineTo(BW, BH); g.fill();
  const yx = BW * .24, yy = lb - 26, yw = 150;
  g.fillStyle = '#0d0619'; g.beginPath(); g.moveTo(yx - yw / 2, yy); g.lineTo(yx - yw / 2, yy - 52); g.quadraticCurveTo(yx, yy - 120, yx + yw / 2, yy - 52); g.lineTo(yx + yw / 2, yy); g.fill();
  g.fillStyle = '#ffb347'; g.fillRect(yx - 14, yy - 46, 28, 46);
  gr = g.createRadialGradient(yx, yy - 20, 0, yx, yy - 20, 160); gr.addColorStop(0, 'rgba(255,170,70,.55)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr; g.fillRect(yx - 170, yy - 190, 340, 260);
  for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,${200 + R() * 55},140,${.5 + R() * .5})`; g.beginPath(); g.arc(R() * BW, lb - 10 + R() * 60, 1.5 + R() * 2.5, 0, 7); g.fill(); }
  // blur pass
  const o = document.createElement('canvas'); o.width = BW; o.height = BH; const og = o.getContext('2d');
  og.filter = 'blur(7px)'; og.drawImage(c, 0, 0); og.filter = 'none';
  return o;
}

// night city at raspberry sunset (bg: "city")
function paintCity() {
  const c = document.createElement('canvas'); c.width = BW; c.height = BH; const g = c.getContext('2d');
  const R = rnd(21); const hz = BH * .66;
  let gr = g.createLinearGradient(0, 0, 0, hz);
  gr.addColorStop(0, '#120a2e'); gr.addColorStop(.4, '#3a1660'); gr.addColorStop(.7, '#a3286f'); gr.addColorStop(.9, '#ff5a7a'); gr.addColorStop(1, '#ffa07a');
  g.fillStyle = gr; g.fillRect(0, 0, BW, BH);
  for (let i = 0; i < 200; i++) { const y = R() ** 1.7 * hz * .6; g.globalAlpha = .2 + R() * .7; g.fillStyle = '#fff'; g.beginPath(); g.arc(R() * BW, y, R() * 1.6 + .4, 0, 7); g.fill(); }
  g.globalAlpha = 1;
  gr = g.createRadialGradient(BW * .5, hz, 0, BW * .5, hz, BW * .6); gr.addColorStop(0, 'rgba(255,190,150,.8)'); gr.addColorStop(.3, 'rgba(255,90,130,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, BW, BH);
  // two skyline layers with lit windows
  for (const [col, hmin, hmax, wmin, seed, lit] of [['#4a1d5e', .08, .3, 50, 3, .25], ['#1a0b2a', .05, .22, 70, 9, .45]]) {
    const RR = rnd(seed); let x = -20;
    while (x < BW) { const w = wmin + RR() * 90, h = BH * (hmin + RR() * (hmax - hmin)); g.fillStyle = col; g.fillRect(x, hz - h, w, h + BH); if (RR() < .2) g.fillRect(x + w / 2 - 3, hz - h - 40, 6, 40);
      for (let wy = hz - h + 14; wy < hz - 8; wy += 22) for (let wx = x + 8; wx < x + w - 10; wx += 16) if (RR() < lit) { g.fillStyle = RR() < .7 ? 'rgba(255,214,150,.9)' : 'rgba(255,140,200,.9)'; g.fillRect(wx, wy, 7, 10); }
      x += w + 4; }
  }
  // street & reflections
  gr = g.createLinearGradient(0, hz, 0, BH); gr.addColorStop(0, '#2a0f3a'); gr.addColorStop(1, '#0c0518'); g.fillStyle = gr; g.fillRect(0, hz, BW, BH - hz);
  for (let i = 0; i < 90; i++) { const y = hz + 10 + R() ** 1.5 * (BH - hz); g.fillStyle = `rgba(255,${120 + R() * 110},${150 + R() * 80},${.15 + R() * .35})`; g.fillRect(R() * BW, y, 4 + R() * 30, 3 + R() * 10); }
  for (let i = 0; i < 60; i++) { const x = R() * BW, y = hz - 20 + R() * 160, rr = 6 + R() * 22; gr = g.createRadialGradient(x, y, 0, x, y, rr); const cc = R() < .5 ? '255,200,140' : '255,90,160'; gr.addColorStop(0, `rgba(${cc},.8)`); gr.addColorStop(1, `rgba(${cc},0)`); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
  const o = document.createElement('canvas'); o.width = BW; o.height = BH; const og = o.getContext('2d'); og.filter = 'blur(8px)'; og.drawImage(c, 0, 0); og.filter = 'none'; return o;
}
const BG = CFG.bg === 'city' ? paintCity() : paintBackground();
const bgc = $('bg'); bgc.width = 1080; bgc.height = SH; const bgx = bgc.getContext('2d');

// ---------- particles ----------
const fxc = $('fx'); fxc.width = 1080; fxc.height = SH; const fx = fxc.getContext('2d');
const PR = rnd(99); const parts = Array.from({ length: 80 }, () => ({ x: PR() * 1080, y: PR() * SH, r: 1.5 + PR() ** 2 * 8, v: 8 + PR() * 26, s: PR() * 6, f: .3 + PR() * 1.2, c: PR() < .6 ? [255, 214, 150] : PR() < .5 ? [255, 140, 190] : [190, 170, 255] }));
const comets = [{ t: 8.6, x: 150, y: 150 }, { t: 19.6, x: 620, y: 110 }];

// grain tiles
const grc = $('grain'); grc.width = 540; grc.height = Math.round(SH / 2); const grx = grc.getContext('2d');
const tiles = Array.from({ length: 4 }, (_, k) => { const R = rnd(500 + k); const d = grx.createImageData(grc.width, grc.height); for (let i = 0; i < d.data.length; i += 4) { const v = R() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } return d; });

// ---------- lyrics ----------
await document.fonts.ready;
await Promise.all(['800 66px Manrope', '800 80px Unbounded', '700 20px Manrope', '600 20px Manrope'].map(f => document.fonts.load(f, 'АӨҮҢабв')));
const lines = SONG.lines.map((ln, i) => {
  const next = SONG.lines[i + 1];
  const t0 = ln.words[0][1], t1 = next ? next.words[0][1] : SONG.end + 1;
  const el = document.createElement('div'); el.className = 'line'; $('lyrics').appendChild(el);
  const words = ln.words.map((w, j) => {
    const s = document.createElement('span'); s.className = 'w'; s.textContent = w[0]; el.appendChild(s); el.appendChild(document.createTextNode(' '));
    const ws = w[1], we = j + 1 < ln.words.length ? Math.min(ln.words[j + 1][1], ws + .9) : Math.min(t1, ws + .9);
    return { s, ws, we, accent: w[2] };
  });
  let fs = V ? 70 : 66; el.style.fontSize = fs + 'px';
  while (el.offsetHeight > fs * 1.13 * 2 + 20 && fs > 40) { fs -= 2; el.style.fontSize = fs + 'px'; }
  el.style.top = (L.lyrH - el.offsetHeight) / 2 + 'px';
  return { el, words, t0, t1, card: ln.card };
});

function drawLyrics(t) {
  for (const ln of lines) {
    const a = prog(t, ln.t0 - .35, .3), x = prog(t, ln.t1 - .22, .28);
    const vis = a * (1 - x);
    if (vis <= 0.001) { ln.el.style.display = 'none'; continue; }
    ln.el.style.display = '';
    ln.el.style.opacity = vis;
    ln.el.style.filter = `blur(${(1 - a) * 10 + x * 12}px)`;
    ln.el.style.transform = `translateY(${(1 - eo(a)) * 18 - x * 22}px) scale(${1 + x * .04})`;
    for (const w of ln.words) {
      const ap = prog(t, w.ws - .1, .22), k = prog(t, w.ws, w.we - w.ws);
      const c = w.accent || '#ffffff';
      const p = lerp(-12, 112, k);
      w.s.style.backgroundImage = `linear-gradient(90deg, ${c} ${p - 12}%, rgba(255,255,255,${.34 + .26 * ap}) ${p + 12}%)`;
      const bump = Math.sin(Math.PI * prog(t, w.ws, .32));
      w.s.style.filter = `blur(${(1 - ap) * 5}px)` + (w.accent && ap > 0 ? ` drop-shadow(0 0 ${14 * ap}px ${hexA(c, .55)})` : ` drop-shadow(0 3px 10px rgba(0,0,0,${.35 * ap}))`);
      w.s.style.transform = `translateY(${(1 - eo(ap)) * 10 - bump * 5}px) scale(${1 + bump * .07})`;
    }
  }
}

// ---------- cards ----------
const POPS = $('pops');
const cards = lines.map((ln, i) => {
  const wrap = document.createElement('div'); wrap.className = 'cardwrap'; wrap.style.top = L.card + 'px';
  const glow = document.createElement('div'); glow.className = 'glow'; glow.style.background = ln.card.tint; wrap.appendChild(glow);
  const C = window.CARDS[ln.card.type](ln.card, { t0: ln.t0, t1: ln.t1, words: ln.words });
  wrap.appendChild(C.el); (C.extra || []).forEach(e => wrap.appendChild(e));
  $('cards').appendChild(wrap);
  const h = C.el.offsetHeight; C.el.style.top = -h / 2 + 'px'; glow.style.top = (-h / 2 + 20) + 'px'; glow.style.height = h + 'px';
  const sheen = C.el.querySelector('.sheen');
  const emo = (ln.card.emojis || []).map(e => { const d = document.createElement('div'); d.className = 'pop'; d.textContent = e.e; d.style.fontSize = (e.size || 54) + 'px'; POPS.appendChild(d); return { d, ...e }; });
  const bursts = (ln.card.burst || []).map((b, bi) => { const R = rnd(31 + i * 7 + bi); return { ...b, ps: Array.from({ length: b.n }, () => { const d = document.createElement('div'); d.className = 'pop'; d.textContent = b.e; POPS.appendChild(d); const an = R() * Math.PI * 2; return { d, vx: Math.cos(an) * (300 + R() * 420), vy: Math.sin(an) * (260 + R() * 380) - 260, sz: 26 + R() * 30, rot: (R() - .5) * 400, life: 1.1 + R() * .6 }; }) }; });
  return { wrap, glow, C, sheen, emo, bursts, h, ...ln };
});

function drawCards(t, pulse) {
  for (const c of cards) {
    const a = prog(t, c.t0 - .32, .55), x = prog(t, c.t1 - .24, .3);
    const on = a > 0 && x < 1;
    c.wrap.style.display = on ? '' : 'none';
    for (const e of c.emo) e.d.style.display = 'none';
    for (const b of c.bursts) for (const p of b.ps) p.d.style.display = 'none';
    if (!on) continue;
    const sp = 1 - Math.exp(-7 * a) * Math.cos(9 * a);           // springy 0→1
    const fl = t * 1.0 + c.t0;
    const sc = (V ? 1.32 : 1) * lerp(.78, 1, sp) * (1 + .1 * x) * (1 + .014 * pulse);
    const rx = (1 - sp) * 28 + Math.sin(fl * 1.1) * 3.5 - x * 10, ry = (1 - sp) * -18 + Math.sin(fl * .8 + 1) * 5.5;
    c.wrap.style.transform = `translate3d(0, ${Math.sin(fl * 1.3) * 7 - x * 30}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`;
    c.wrap.style.opacity = clamp(a * 2.2) * (1 - x);
    c.wrap.style.filter = (a < 1 || x > 0) ? `blur(${(1 - clamp(a * 1.6)) * 16 + x * 18}px)` : 'none';
    c.glow.style.opacity = .42 + .3 * pulse;
    if (c.sheen) { const sp2 = ((t - c.t0 + .1) % 3.2) / .9; c.sheen.style.left = lerp(-260, 900, clamp(sp2)) + 'px'; }
    c.C.update(t, pulse);
    // emoji pops around the card
    const cy = L.card, es = V ? 1.32 : 1;
    for (const e of c.emo) {
      const k = prog(t, e.at, .45); if (k <= 0) continue;
      const out = prog(t, c.t1 - .3, .25);
      const s = (1 - Math.exp(-8 * k) * Math.cos(12 * k)) * (1 - out);
      if (s <= 0.01) continue;
      e.d.style.display = '';
      const bob = Math.sin((t - e.at) * 3) * 8;
      e.d.style.transform = `translate(${540 + e.x * es - (e.size || 54) / 2}px, ${cy + e.y * es + bob - (e.size || 54) / 2}px) rotate(${Math.sin((t - e.at) * 2.4) * 12 - (1 - k) * 40}deg) scale(${s})`;
    }
    for (const b of c.bursts) for (const p of b.ps) {
      const dt = t - b.at; if (dt < 0 || dt > p.life) continue;
      p.d.style.display = '';
      const px = 540 + p.vx * dt * .9, py = cy + p.vy * dt + 520 * dt * dt;
      p.d.style.fontSize = p.sz + 'px';
      p.d.style.opacity = 1 - (dt / p.life) ** 2;
      p.d.style.transform = `translate(${px}px, ${py}px) rotate(${p.rot * dt}deg) scale(${Math.min(1, dt * 8)})`;
    }
  }
}

// ---------- transition streaks ----------
const STR = $('streaks'); const SR = rnd(4242);
const streaks = Array.from({ length: 16 }, () => { const d = document.createElement('div'); d.className = 'streak'; STR.appendChild(d); return { d, y: (SR() - .5) * 360, w: 120 + SR() * 320, sp: 2200 + SR() * 2600, o: SR() * .12, white: SR() < .35, dir: SR() < .5 ? 1 : -1 }; });
function drawStreaks(t) {
  let best = null;
  for (let i = 1; i < cards.length; i++) { const dt = t - (cards[i].t0 - .3); if (dt > -.05 && dt < .45) best = { dt, col: cards[i].card.tint }; }
  for (const s of streaks) {
    if (!best) { s.d.style.display = 'none'; continue; }
    const dt = best.dt - s.o; if (dt < 0 || dt > .32) { s.d.style.display = 'none'; continue; }
    s.d.style.display = '';
    const x = s.dir > 0 ? -400 + dt * s.sp : 1480 - dt * s.sp;
    s.d.style.width = s.w + 'px'; s.d.style.top = (L.card + s.y) + 'px';
    s.d.style.left = x + 'px';
    s.d.style.background = s.white ? 'rgba(255,255,255,.9)' : best.col;
    s.d.style.boxShadow = `0 0 12px ${best.col}`;
    s.d.style.opacity = Math.sin(Math.PI * dt / .32);
  }
}

// ---------- frame ----------
const fmtT = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const eqBars = [...document.querySelectorAll('.eq i')];
window.renderAt = (t) => {
  const pulse = pulseAt(t), env = envAt(t);
  // background with slow push-in
  const z = 1.0 + .06 * (t / SONG.end) + .006 * pulse;
  const dw = BW * z / 1.22 * 1.0, dh = BH * z / 1.22;
  bgx.drawImage(BG, (1080 - dw) / 2 + Math.sin(t * .2) * 10, (SH - dh) / 2 + Math.cos(t * .17) * 6, dw, dh);
  // tint following the active card
  let tc = cards[0].card.tint;
  for (let i = 1; i < cards.length; i++) { const k = prog(t, cards[i].t0 - .4, .8); if (k > 0) tc = mixHex(tc, cards[i].card.tint, k); }
  $('tint').style.background = `radial-gradient(ellipse at 50% 60%, ${hexA(tc, .55 + .15 * pulse)}, ${hexA(tc, .1)} 70%)`;
  // particles
  fx.clearRect(0, 0, 1080, SH); fx.globalCompositeOperation = 'lighter';
  for (const p of parts) {
    const y = ((p.y - t * p.v) % SH + SH) % SH, x = p.x + Math.sin(t * p.f + p.s) * 18;
    const al = (.25 + .45 * (.5 + .5 * Math.sin(t * p.f * 2 + p.s))) * (.7 + .5 * env);
    const gr = fx.createRadialGradient(x, y, 0, x, y, p.r * 2.2); gr.addColorStop(0, `rgba(${p.c},${al})`); gr.addColorStop(.4, `rgba(${p.c},${al * .5})`); gr.addColorStop(1, `rgba(${p.c},0)`);
    fx.fillStyle = gr; fx.beginPath(); fx.arc(x, y, p.r * 2.2, 0, 7); fx.fill();
  }
  for (const cm of comets) { const d = t - cm.t; if (d < 0 || d > .7) continue; const k = d / .7; const x = cm.x + k * 380, y = cm.y + k * 150; const gr = fx.createLinearGradient(x - 160, y - 63, x, y); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, `rgba(255,240,220,${Math.sin(Math.PI * k)})`); fx.strokeStyle = gr; fx.lineWidth = 3; fx.beginPath(); fx.moveTo(x - 160, y - 63); fx.lineTo(x, y); fx.stroke(); }
  fx.globalCompositeOperation = 'source-over';
  // grain
  grx.putImageData(tiles[Math.floor(t * 30) % 4], 0, 0);
  // header equaliser
  eqBars.forEach((b, i) => { b.style.height = (5 + 15 * clamp(envAt(t - i * .07) * (.6 + .5 * Math.abs(Math.sin(t * 7 + i * 1.7))))) + 'px'; });
  // progress
  const cur = CFG.clipOffset + t;
  const fr = cur / CFG.songLength;
  document.querySelector('#progress .fill').style.width = fr * 100 + '%';
  document.querySelector('#progress .knob').style.left = fr * 100 + '%';
  $('tcur').textContent = fmtT(cur); $('tleft').textContent = '-' + fmtT(CFG.songLength - cur);

  // optional drop / dips (dark build-up, flash on release)
  if (SONG.drop) {
    const D = SONG.drop; const b = t >= D.from && t < D.at ? eio(prog(t, D.from, D.at - D.from)) : 0;
    let dk = b * .75; for (const d of SONG.dips || []) dk = Math.max(dk, Math.sin(Math.PI * prog(t, d.from, d.at - d.from + .08)) * .55);
    dk = Math.max(dk, prog(t, SONG.end - 1, .95));
    let fl = t >= D.at ? Math.exp(-(t - D.at) * 5) * .85 : 0; for (const d of SONG.dips || []) if (t >= d.at) fl = Math.max(fl, Math.exp(-(t - d.at) * 7) * .4);
    $('dark').style.opacity = dk; $('flash').style.opacity = fl;
    const rp = t >= D.at ? Math.exp(-(t - D.at) * 4) * Math.cos((t - D.at) * 14) : 0;
    stage.style.transform = `scale(${OW / 1080})`;
    $('cards').style.transform = `scale(${1 + b * .05 + rp * .06})`; $('cards').style.filter = b ? `blur(${b * 3}px)` : 'none';
  }
  drawCards(t, pulse); drawStreaks(t); drawLyrics(t);
};
window.OUT = [OW, OH]; window.DUR = SONG.end; window.FPS = CFG.fps;
window.renderAt(0);
window.READY = true;
})().catch(e => { window.BOOT_ERROR = String(e && e.stack || e); console.error(e); });
