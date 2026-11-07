// Kinetic Neon engine (9:16): big word-by-word typography, neon objects, camera punches, drop build/flash.
(async () => {
const { clamp, lerp, eo, eio, prog, spring, rnd, hexA, mixHex } = window.U;
const CFG = await (await fetch('/project/config.json')).json();
const AUDIO = await (await fetch('/project/build/audio.json')).json();
const SONG = window.SONG;
const [OW, OH] = CFG.formats.vertical;
const $ = id => document.getElementById(id);
$('stage').style.transform = `scale(${OW / 1080})`;
$('artist').textContent = CFG.artist;

const envAt = t => { const e = AUDIO.env; const i = clamp(t * AUDIO.fps, 0, e.length - 1); const a = Math.floor(i); return lerp(e[a], e[Math.min(a + 1, e.length - 1)], i - a); };
const lastBeat = t => { let lb = -9; for (const b of AUDIO.grid) { if (b <= t) lb = b; else break; } return lb; };
const halfPulse = t => { const P = AUDIO.period / 2; let best = 9; for (const b of AUDIO.grid) { for (const x of [b, b + P]) if (x <= t && t - x < best) best = t - x; } return Math.exp(-best * 7); };
const pulseAt = t => Math.exp(-(t - lastBeat(t)) * 5.5);
window.__GRID = AUDIO.grid;
const D = SONG.drop;
const inDrop = t => t >= D.from && t < D.at;

// palettes by section
const palAt = t => {
  let cur = SONG.sections[0].cols;
  for (let i = 1; i < SONG.sections.length; i++) { const k = prog(t, SONG.sections[i].at - .3, .6); if (k > 0) cur = cur.map((c, j) => mixHex(c, SONG.sections[i].cols[j], k)); }
  return cur;
};

// ---------- background ----------
const bg = $('bg'); bg.width = 1080; bg.height = 1920; const g = bg.getContext('2d');
const R = rnd(11);
const stars = Array.from({ length: 160 }, () => ({ x: R() * 1080, y: R() * 1100, r: R() * 1.6 + .3, f: R() * 6 }));
const dust = Array.from({ length: 70 }, () => ({ x: R() * 1080, y: R() * 1920, r: 2 + R() ** 2 * 10, v: 20 + R() * 60, s: R() * 6 }));
const rain = Array.from({ length: 26 }, () => ({ x: R() * 1080, l: 80 + R() * 220, v: 900 + R() * 900, o: R() * 3 }));
function drawBg(t, pulse, env, pal) {
  g.globalCompositeOperation = 'source-over'; g.fillStyle = '#06030d'; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = 'lighter';
  const blobs = [[540 + Math.sin(t * .31) * 320, 700 + Math.cos(t * .23) * 260, 760, pal[0]], [540 + Math.cos(t * .27 + 2) * 360, 1250 + Math.sin(t * .2 + 1) * 240, 820, pal[1]], [540 + Math.sin(t * .19 + 4) * 300, 380 + Math.cos(t * .29 + 3) * 200, 600, pal[2]]];
  for (const [x, y, r, c] of blobs) { const gr = g.createRadialGradient(x, y, 0, x, y, r * (1 + .06 * pulse)); gr.addColorStop(0, hexA(c, .42 + .12 * env)); gr.addColorStop(.5, hexA(c, .14)); gr.addColorStop(1, hexA(c, 0)); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920); }
  for (const s of stars) { g.fillStyle = `rgba(255,255,255,${.25 + .5 * (.5 + .5 * Math.sin(t * 2 + s.f))})`; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); }
  // synthwave grid floor
  const hz = 1480; g.strokeStyle = hexA(pal[0], .22 + .2 * pulse); g.lineWidth = 2;
  for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(540 + i * 30, hz); g.lineTo(540 + i * 260, 1920); g.stroke(); }
  for (let j = 0; j < 12; j++) { const k = ((j + (t * 1.2) % 1) / 12); const y = hz + Math.pow(k, 2.2) * 440; g.globalAlpha = k; g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  g.globalAlpha = 1;
  const hg = g.createLinearGradient(0, hz - 60, 0, hz + 40); hg.addColorStop(0, hexA(pal[1], 0)); hg.addColorStop(.6, hexA(pal[1], .35)); hg.addColorStop(1, hexA(pal[1], 0)); g.fillStyle = hg; g.fillRect(0, hz - 60, 1080, 100);
  for (const d of dust) { const y = ((d.y - t * d.v) % 1920 + 1920) % 1920, x = d.x + Math.sin(t + d.s) * 20; const gr = g.createRadialGradient(x, y, 0, x, y, d.r * 2); gr.addColorStop(0, `rgba(255,230,240,${.35 + .3 * env})`); gr.addColorStop(1, 'rgba(255,230,240,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, d.r * 2, 0, 7); g.fill(); }
  for (const r of rain) { const y = ((t + r.o) * r.v) % 2400 - 300; const gr = g.createLinearGradient(0, y, 0, y + r.l); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, hexA(pal[2], .55)); g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(r.x, y); g.lineTo(r.x, y + r.l); g.stroke(); }
  g.globalCompositeOperation = 'source-over';
  const vg = g.createRadialGradient(540, 900, 300, 540, 900, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}

// grain
const grc = $('grain'); grc.width = 540; grc.height = 960; const grx = grc.getContext('2d');
const tiles = Array.from({ length: 4 }, (_, k) => { const r = rnd(900 + k); const d = grx.createImageData(540, 960); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } return d; });

// ---------- text ----------
await document.fonts.ready;
await Promise.all(['800 100px Manrope', '900 100px Unbounded', '700 30px Manrope'].map(f => document.fonts.load(f, 'АБВабвЁё')));
const TEXT = $('text');
const phrases = SONG.phrases.map((ph, i) => {
  const next = SONG.phrases[i + 1];
  const t0 = ph.rows[0][0][1], t1 = next ? next.rows[0][0][1] : SONG.end + 1;
  const el = document.createElement('div'); el.className = 'phrase'; TEXT.appendChild(el);
  const words = [];
  ph.rows.forEach((row, ri) => {
    const r = document.createElement('div'); r.className = 'krow'; el.appendChild(r);
    const accRow = row.some(w => w[2]);
    for (const w of row) {
      const s = document.createElement('span'); s.className = 'kw' + (w[2] ? ' acc' : ''); s.textContent = w[0]; r.appendChild(s);
      if (w[2]) s.style.backgroundImage = `linear-gradient(180deg, #fff 0%, ${w[2]} 55%, ${mixHex(w[2], '#000000', .25)} 100%)`;
      words.push({ s, ws: w[1], acc: w[2], ri });
    }
    const base = accRow ? 150 : 104; r.style.fontSize = base + 'px';
    const fit = Math.min(base, base * 960 / r.scrollWidth); r.style.fontSize = Math.floor(fit) + 'px';
  });
  el.style.top = (720 - el.offsetHeight) / 2 + 'px';
  return { el, words, t0, t1, rows: ph.rows.length, obj: ph.obj };
});
function drawText(t, pulse) {
  for (const ph of phrases) {
    const x = prog(t, ph.t1 - .16, .26);
    if (t < ph.t0 - .1 || x >= 1) { ph.el.style.display = 'none'; continue; }
    ph.el.style.display = '';
    const hold = t - ph.t0;
    ph.el.style.transform = `scale(${1 + hold * .012})`;
    for (const w of ph.words) {
      const a = prog(t, w.ws - .05, .3);
      if (a <= 0) { w.s.style.opacity = 0; continue; }
      const sp = spring(a), xo = clamp(x - w.ri * .06, 0, 1);
      const dx = 14 * (1 - a) + (w.acc ? 3 * pulse : 0);
      const dir = w.ri % 2 ? 1 : -1;
      w.s.style.opacity = clamp(a * 3) * (1 - xo);
      w.s.style.transform = `translate(${(1 - eo(a)) * 60 * dir}px, ${-xo * 120}px) scale(${lerp(1.7, 1, sp) * (1 + xo * .25)})`;
      const glow = w.acc ? ` drop-shadow(0 0 ${14 + 16 * pulse}px ${hexA(w.acc, .7)})` : ' drop-shadow(0 6px 18px rgba(0,0,0,.55))';
      const rgb = dx > .6 ? ` drop-shadow(${dx}px 0 0 rgba(255,30,90,.7)) drop-shadow(${-dx * 2}px 0 0 rgba(40,220,255,.6))` : '';
      const bl = (1 - clamp(a * 1.4)) * 16 + xo * 20;
      w.s.style.filter = (bl > .05 ? `blur(${bl}px)` : '') + rgb + glow;
    }
  }
}

// ---------- objects ----------
const OBJ = $('objs'), POPS = $('pops');
const objs = phrases.map((ph, i) => {
  const wrap = document.createElement('div'); wrap.className = 'obj'; OBJ.appendChild(wrap);
  const O = window.OBJECTS[ph.obj.type](ph.obj, { t0: ph.t0, t1: ph.t1, POPS });
  wrap.appendChild(O.el);
  if (O.el.classList.contains('neo')) O.el.style.top = -O.el.offsetHeight / 2 + 'px';
  return { wrap, O, ...ph };
});
function drawObjs(t, pulse, env, pal) {
  for (const o of objs) {
    const a = prog(t, o.t0 - .22, .6), x = prog(t, o.t1 - .2, .3);
    const on = a > 0 && x < 1; o.wrap.style.display = on ? '' : 'none';
    if (o.O.hide) o.O.hide();
    if (!on) continue;
    const sp = spring(a);
    o.wrap.style.transform = `translate3d(0, ${(1 - sp) * 220 + Math.sin(t * 1.2) * 8 + x * 80}px, 0) rotateX(${(1 - sp) * 35 + Math.sin(t * .9) * 3}deg) rotateY(${Math.sin(t * .7 + 1) * 5}deg) scale(${lerp(.7, 1, sp) * (1 + .02 * pulse) * (1 - x * .25)})`;
    o.wrap.style.opacity = clamp(a * 2.5) * (1 - x);
    o.wrap.style.filter = (a < 1 || x > 0) ? `blur(${(1 - clamp(a * 1.5)) * 18 + x * 22}px)` : 'none';
    o.O.update(t, pulse, env, pal);
  }
}

// ---------- visualiser ----------
const vz = $('vizc'); vz.width = 900; vz.height = 110; const vx = vz.getContext('2d');
const NB = 60;
function drawViz(t, pal) {
  vx.clearRect(0, 0, 900, 110);
  const fr = t / SONG.end;
  for (let i = 0; i < NB; i++) {
    const u = i / (NB - 1); const tt = t + (u - .5) * 1.2;
    const h = 8 + 90 * clamp(envAt(tt) * (.55 + .45 * Math.abs(Math.sin(i * 1.7 + t * 6)))) ;
    const x = i * 15; const played = u <= fr;
    const gr = vx.createLinearGradient(0, 55 - h / 2, 0, 55 + h / 2); gr.addColorStop(0, played ? pal[2] : 'rgba(255,255,255,.25)'); gr.addColorStop(.5, played ? '#fff' : 'rgba(255,255,255,.35)'); gr.addColorStop(1, played ? pal[0] : 'rgba(255,255,255,.25)');
    vx.fillStyle = gr; vx.beginPath(); vx.roundRect(x, 55 - h / 2, 9, h, 4.5); vx.fill();
  }
}
const fmtT = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const eq = [...document.querySelectorAll('.eq i')];
const accents = phrases.flatMap(p => p.words.filter(w => w.acc).map(w => w.ws));

window.renderAt = t => {
  const env = envAt(t), pal = palAt(t);
  let pulse = Math.max(pulseAt(t), halfPulse(t) * .5);
  // drop build: darker, slower, zooming in; release flash at D.at
  const build = inDrop(t) ? eio(prog(t, D.from, D.at - D.from)) : 0;
  const rel = prog(t, D.at, .8);
  if (build) pulse *= .3;
  drawBg(t, pulse, env, pal);
  // camera
  let punch = 0; for (const a of accents) { const d = t - a; if (d >= 0 && d < 1) punch = Math.max(punch, Math.exp(-d * 7)); }
  const lb = t - lastBeat(t); const sh = Math.exp(-lb * 9) * (build ? 0 : 1);
  const R2 = rnd(Math.floor(t * 60) + 3);
  const shx = (R2() - .5) * 10 * sh + (build ? (R2() - .5) * 14 * build : 0), shy = (R2() - .5) * 8 * sh + (build ? (R2() - .5) * 10 * build : 0);
  const relPunch = t >= D.at ? Math.exp(-(t - D.at) * 4) * Math.cos((t - D.at) * 14) : 0;
  const sc = 1 + .035 * punch + .012 * pulse + .07 * build + .09 * relPunch;
  $('cam').style.transform = `translate(${shx}px, ${shy}px) rotate(${(R2() - .5) * .6 * sh + Math.sin(t * .5) * .4}deg) scale(${sc})`;
  $('cam').style.filter = build ? `blur(${build * 3}px) saturate(${1 - .5 * build})` : (rel > 0 && rel < 1 ? `saturate(${1 + .6 * (1 - rel)}) brightness(${1 + .25 * (1 - rel)})` : 'none');
  // darkness (drop + dips + end)
  let dk = build * .8;
  for (const d of SONG.dips) dk = Math.max(dk, Math.sin(Math.PI * prog(t, d.from, d.at - d.from + .08)) * .6);
  dk = Math.max(dk, prog(t, SONG.end - 1.0, .95));
  $('dark').style.opacity = dk;
  // flash + shockwave
  let fl = t >= D.at ? Math.exp(-(t - D.at) * 5) * .95 : 0;
  for (const d of SONG.dips) if (t >= d.at) fl = Math.max(fl, Math.exp(-(t - d.at) * 7) * .5);
  for (const s of SONG.sections) if (s.at > 0 && t >= s.at && s.at !== D.at) fl = Math.max(fl, Math.exp(-(t - s.at) * 9) * .25);
  $('flash').style.opacity = fl;
  const rk = prog(t, D.at, .9); $('ring').style.opacity = rk > 0 && rk < 1 ? (1 - rk) : 0; $('ring').style.transform = `scale(${1 + rk * 12})`; $('ring').style.borderWidth = (14 * (1 - rk) + 1) + 'px';
  // header eq + glow colour
  eq.forEach((b, i) => { b.style.height = (8 + 32 * clamp(envAt(t - i * .06) * (.5 + .6 * Math.abs(Math.sin(t * 6 + i * 1.3))))) + 'px'; b.style.background = `linear-gradient(#fff, ${pal[0]})`; b.style.boxShadow = `0 0 12px ${pal[0]}`; });
  $('header').style.textShadow = `0 0 ${20 + 20 * pulse}px ${hexA(pal[0], .95)}, 0 0 60px ${hexA(pal[0], .5)}`;
  drawViz(t, pal);
  $('tcur').textContent = fmtT(t); $('tend').textContent = fmtT(SONG.end);
  grx.putImageData(tiles[Math.floor(t * 30) % 4], 0, 0);
  drawObjs(t, pulse, env, pal); drawText(t, pulse);
};
window.OUT = [OW, OH]; window.DUR = SONG.end; window.FPS = CFG.fps;
window.renderAt(0); window.READY = true;
})().catch(e => { window.BOOT_ERROR = String(e && e.stack || e); console.error(e); });
