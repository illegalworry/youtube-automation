// Card library. Each card type: (spec, ctx) => { el, extra?, update(t, pulse) }. All motion is a pure function of t.
(() => {
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const eo = k => 1 - Math.pow(1 - k, 3);
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const prog = (t, a, d) => clamp((t - a) / d);
const spring = k => k <= 0 ? 0 : 1 - Math.exp(-7 * k) * Math.cos(10 * k);
const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const hexRgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const hexA = (h, a) => `rgba(${hexRgb(h).join(',')},${a})`;
const mixHex = (a, b, k) => { const A = hexRgb(a), B = hexRgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, '0')).join(''); };
window.U = { clamp, lerp, eo, eio, prog, spring, rnd, hexA, mixHex };

// Kyrgyz "кочкор мүйүз" (ram horn) ornament
const ORN = `<svg class="orn" viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M60 78V44C60 22 40 10 26 16C12 22 14 42 30 40C40 39 40 27 31 28"/><path d="M60 44C60 22 80 10 94 16C108 22 106 42 90 40C80 39 80 27 89 28"/><path d="M60 60C50 52 38 56 36 66M60 60C70 52 82 56 84 66"/></svg>`;

function shell(spec, theme, bg, inner) {
  const el = document.createElement('div'); el.className = 'card ' + theme; if (bg) el.style.background = bg;
  el.innerHTML = `<div class="sheen"></div><div class="hdr"><span class="kicker">${spec.kicker}</span><span class="ico" data-r="ico">${spec.icon}</span></div><div class="body" style="position:relative">${inner}</div>${ORN}`;
  const r = {}; el.querySelectorAll('[data-r]').forEach(n => r[n.dataset.r] = n);
  return { el, r };
}
const show = (n, k, dy = 14) => { n.style.opacity = clamp(k); n.style.transform = `translateY(${(1 - clamp(k)) * dy}px) scale(${lerp(.85, 1, spring(k))})`; };
const popIn = (n, k) => { n.style.opacity = clamp(k * 3); n.style.transform = `scale(${spring(k)})`; };
const icoBounce = (r, t, pulse) => { r.ico.style.transform = `translateY(${-pulse * 6}px) rotate(${Math.sin(t * 2.2) * 8}deg)`; };

const C = {};

// 1) Radar search — "did you wait for me all my life?"
C.radar = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#2a1b7a 0%,#6b2fd6 55%,#b3399b 100%)', `
  <div style="display:flex;gap:34px;align-items:center">
    <div style="width:200px;height:200px;position:relative;flex:none;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.14),rgba(255,255,255,.04) 70%);border:2px solid rgba(255,255,255,.4);overflow:hidden">
      <div style="position:absolute;inset:34px;border-radius:50%;border:1.5px solid rgba(255,255,255,.25)"></div>
      <div style="position:absolute;inset:68px;border-radius:50%;border:1.5px solid rgba(255,255,255,.25)"></div>
      <div style="position:absolute;left:99px;top:0;bottom:0;width:1.5px;background:rgba(255,255,255,.18)"></div>
      <div style="position:absolute;top:99px;left:0;right:0;height:1.5px;background:rgba(255,255,255,.18)"></div>
      <div data-r="sweep" style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(255,111,174,0) 0deg,rgba(255,111,174,0) 250deg,rgba(255,170,215,.85) 360deg)"></div>
      ${[0, 1, 2, 3].map(i => `<div data-r="b${i}" style="position:absolute;width:10px;height:10px;margin:-5px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff"></div>`).join('')}
      <div data-r="rip" style="position:absolute;left:100px;top:100px;width:20px;height:20px;margin:-10px;border-radius:50%;border:3px solid #ff9ad0"></div>
      <div data-r="heart" style="position:absolute;left:100px;top:100px;font-size:62px;width:80px;height:80px;margin:-40px;text-align:center;line-height:80px">💗</div>
    </div>
    <div style="flex:1">
      <div class="lbl">совпадение</div>
      <div class="big"><span data-r="num">0</span><span class="unit">%</span></div>
      <div class="track" style="margin:16px 0 18px;height:14px"><div class="f" data-r="bar" style="background:linear-gradient(90deg,#ffd36b,#ff6fae)"></div></div>
      <div style="position:relative;height:42px"><span class="chip" data-r="st1" style="position:absolute;background:rgba(255,255,255,.16)">сканирую сердце…</span><span class="chip" data-r="st2" style="position:absolute;background:#fff;color:#d42a72">Это ты ✓</span></div>
    </div>
  </div>`);
  const bl = [[40, 60], [130, 34], [215, 70], [300, 50]];
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const ang = (t - ctx.t0) * 240;
    r.sweep.style.transform = `rotate(${ang}deg)`;
    bl.forEach(([a, d], i) => { const x = 100 + Math.cos((a - 90) * Math.PI / 180) * d, y = 100 + Math.sin((a - 90) * Math.PI / 180) * d; const since = ((ang - a) % 360 + 360) % 360; r['b' + i].style.left = x + 'px'; r['b' + i].style.top = y + 'px'; r['b' + i].style.opacity = t < s.found ? Math.exp(-since / 70) : 0; });
    const f = prog(t, s.found, .6);
    let v = t < s.found ? Math.round(lerp(4, 97, eio(prog(t, ctx.t0 + .1, s.found - ctx.t0 - .2))) + (t < s.found - .2 ? Math.sin(t * 40) * 2 : 0)) : 100;
    r.num.textContent = Math.max(0, Math.min(100, v));
    r.num.parentNode.style.transform = `scale(${1 + Math.sin(Math.PI * f) * .12})`; r.num.parentNode.style.transformOrigin = 'left center';
    r.bar.style.width = clamp(v / 100) * 100 + '%';
    r.st1.style.opacity = 1 - clamp(f * 4); popIn(r.st2, f);
    r.heart.style.transform = `scale(${spring(f) * (1 + p * .12)})`; r.heart.style.opacity = clamp(f * 4);
    const rk = prog(t, s.found, .9); r.rip.style.transform = `scale(${1 + rk * 9})`; r.rip.style.opacity = rk > 0 ? 1 - rk : 0;
  } };
};

// 2) Walking sensor — "look, she walks without touching the ground"
C.sensor = (s, ctx) => {
  const { el, r } = shell(s, 'white', null, `
  <div style="display:flex;gap:26px;align-items:stretch">
    <div style="flex:1">
      <div class="lbl">над землёй</div>
      <div class="big" style="background:linear-gradient(90deg,#2d6bff,#9b5cff);-webkit-background-clip:text;color:transparent"><span data-r="num">0</span><span class="unit" style="color:#2d6bff">см</span></div>
      <div class="row" style="margin-top:22px"><span>Режим</span><span style="position:relative;height:38px;width:170px"><span class="chip" data-r="m1" style="position:absolute;right:0;background:#e3dbe9;color:#6b5a7b">обычный</span><span class="chip" data-r="m2" style="position:absolute;right:0;background:linear-gradient(90deg,#4aa8ff,#a46bff);color:#fff">парит ✨</span></span></div>
    </div>
    <div style="width:210px;position:relative;flex:none;border-radius:26px;background:linear-gradient(#e6f1ff,#f6ecfc);overflow:hidden">
      <div style="position:absolute;bottom:30px;left:18px;right:18px;height:4px;border-radius:2px;background:#cbbfd8"></div>
      <div data-r="shadow" style="position:absolute;bottom:22px;left:65px;width:80px;height:16px;border-radius:50%;background:rgba(70,30,110,.28)"></div>
      <div data-r="gauge" style="position:absolute;left:30px;bottom:34px;width:0;border-left:3px dashed #8fb6ff;height:0"></div>
      <div data-r="fig" style="position:absolute;left:55px;bottom:30px;font-size:96px;line-height:1">💃</div>
    </div>
  </div>`);
  const toast = document.createElement('div'); toast.className = 'toast';
  toast.innerHTML = `<div class="av">Д</div><div style="flex:1"><div class="nm">Досум<span>сейчас</span></div><div class="msg">Эй, досум! Карачы 👀</div></div>`;
  toast.style.top = '-270px';
  return { el, extra: [toast], update(t, p) {
    icoBounce(r, t, p);
    const tk = prog(t, s.toast, .5), to = prog(t, s.rise - .2, .4);
    toast.style.opacity = clamp(tk * 3) * (1 - to);
    toast.style.transform = `translateY(${(1 - spring(tk)) * -70 - to * 40}px) scale(${lerp(.9, 1, spring(tk))})`;
    const h = lerp(0, 15, eio(prog(t, s.rise, 1.1)));
    r.num.textContent = Math.round(h);
    const walk = t < s.rise ? Math.abs(Math.sin((t - ctx.t0) * Math.PI * 1.16)) * 6 : 0;
    const hover = h * 6.5 + (h > 0 ? Math.sin(t * 3) * 5 : 0);
    r.fig.style.transform = `translateY(${-hover - walk}px) rotate(${Math.sin(t * 2.3) * 4}deg)`;
    r.shadow.style.transform = `scale(${1 - h / 24})`; r.shadow.style.opacity = 1 - h / 22;
    r.gauge.style.height = Math.max(0, hover - 4) + 'px';
    const m = prog(t, s.fly, .35); r.m1.style.opacity = 1 - clamp(m * 3); popIn(r.m2, m);
  } };
};

// 3) Navigator — "follow her, don't look at anyone else"
C.navigator = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(125deg,#0d1f57 0%,#1f47c9 60%,#3c7bff 100%)', `
  <div style="display:flex;justify-content:space-between;align-items:flex-end">
    <div><div class="lbl">до неё</div><div class="big"><span data-r="num">120</span><span class="unit">м</span></div></div>
    <span class="chip" style="background:rgba(255,255,255,.16);margin-bottom:8px">🚶‍♂️ <span data-r="eta">80 сек</span></span>
  </div>
  <div style="position:relative;height:66px;margin:18px 0 16px">
    <div style="position:absolute;top:31px;left:30px;right:30px;border-top:4px dashed rgba(255,255,255,.3)"></div>
    <div data-r="line" style="position:absolute;top:31px;left:30px;height:4px;border-radius:2px;background:linear-gradient(90deg,#7fd4ff,#ffb15c);box-shadow:0 0 12px #7fd4ff"></div>
    <div data-r="her" style="position:absolute;top:6px;right:0;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#ff6fae,#ff3d8b);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 0 0 6px rgba(255,111,174,.25),0 6px 16px rgba(0,0,0,.3)">👧</div>
    <div data-r="me" style="position:absolute;top:6px;left:0;width:56px;height:56px;border-radius:50%;background:#e8f6ff;color:#0d2a6b;display:flex;align-items:center;justify-content:center;font-family:Unbounded;font-weight:800;font-size:22px;box-shadow:0 0 0 6px rgba(127,212,255,.3),0 6px 16px rgba(0,0,0,.3)">Я</div>
  </div>
  <div class="row"><span data-r="lab" style="position:relative">Смотреть на других<i data-r="strike" style="position:absolute;left:0;top:50%;height:3px;background:#ff6fae;border-radius:2px"></i></span><div class="toggle" data-r="tg"><i data-r="knob"></i></div></div>`);
  const W = 628 - 56;
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const k = eio(prog(t, s.go, 2.3));
    const d = Math.round(lerp(120, 2, k));
    r.num.textContent = d; r.eta.textContent = Math.max(1, Math.round(d / 1.5)) + ' сек';
    r.me.style.left = lerp(0, W - 64, k) + 'px'; r.line.style.width = lerp(0, W - 64, k) + 'px';
    r.me.style.transform = `translateY(${-Math.abs(Math.sin((t - s.go) * 9)) * 6 * (k > 0 && k < 1)}px)`;
    r.her.style.transform = `scale(${1 + p * .12})`;
    const g = prog(t, s.toggle, .3);
    r.tg.style.background = `linear-gradient(90deg, ${mixHex('#34c759', '#5a6890', g)}, ${mixHex('#34c759', '#5a6890', g)})`;
    r.knob.style.left = lerp(36, 4, eo(g)) + 'px';
    r.strike.style.width = eo(prog(t, s.toggle + .15, .4)) * 100 + '%'; r.lab.style.opacity = 1 - .4 * g;
  } };
};

// 4) Long hair blown back
C.hair = (s, ctx) => {
  const strands = 8;
  const { el, r } = shell(s, 'glass', null, `
  <div style="display:flex;gap:28px;align-items:center">
    <svg width="220" height="220" viewBox="0 0 220 220" style="flex:none;border-radius:30px;background:linear-gradient(160deg,rgba(255,255,255,.18),rgba(255,255,255,.04))">
      <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1430"/><stop offset=".55" stop-color="#6c3a9e"/><stop offset="1" stop-color="#e2b6ff"/></linearGradient></defs>
      ${Array.from({ length: strands }, (_, i) => `<path data-r="h${i}" fill="none" stroke="url(#hg)" stroke-width="${10 - i * .5}" stroke-linecap="round"/>`).join('')}
      <path d="M40 220C44 182 62 168 86 164C104 162 118 172 124 220Z" fill="#1d0f2b"/>
      <circle cx="80" cy="96" r="36" fill="#1d0f2b"/>
      <path d="M46 92C40 106 44 112 50 114" stroke="#1d0f2b" stroke-width="10" stroke-linecap="round"/>
    </svg>
    <div style="flex:1">
      <div class="lbl">длина волос</div>
      <div class="big"><span data-r="num">0</span><span class="unit">см</span></div>
      <div class="track" style="margin:14px 0 18px;height:14px"><div class="f" data-r="bar" style="background:linear-gradient(90deg,#c9a2ff,#ff9ad5)"></div></div>
      <div class="row"><span>Ветер</span><span style="display:flex;align-items:center;gap:10px"><span data-r="arrow" style="display:inline-block;font-size:26px">➜</span><span data-r="wt">штиль</span></span></div>
    </div>
  </div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const g = eio(prog(t, s.grow, 1.6)); const len = lerp(25, 115, g);
    r.num.textContent = Math.round(len); r.bar.style.width = len / 120 * 100 + '%';
    const w = .12 + .88 * eio(prog(t, s.back, .6));
    for (let i = 0; i < strands; i++) {
      const sx = 92 + i * 4, sy = 66 + i * 5, Lh = (60 + 120 * g) * (1 - i * .03);
      const ang = (lerp(92, 12, w) - i * 2.5) * Math.PI / 180;
      let d = `M${sx} ${sy}`, px = sx, py = sy; const n = 7;
      for (let j = 1; j <= n; j++) {
        const u = j / n; const wave = Math.sin(u * 5 - t * (5 + 4 * w) + i * .8) * (5 + 13 * w) * u;
        const x = sx + Math.cos(ang) * Lh * u + -Math.sin(ang) * wave + (1 - w) * u * u * 24;
        const y = sy + Math.sin(ang) * Lh * u + Math.cos(ang) * wave;
        d += ` Q${px} ${py} ${(px + x) / 2} ${(py + y) / 2}`; px = x; py = y;
      }
      r['h' + i].setAttribute('d', d + ` L${px} ${py}`);
    }
    const a = prog(t, s.back, .4);
    r.wt.textContent = a > 0 ? 'назад · 7 м/с' : 'штиль';
    r.arrow.style.opacity = .3 + .7 * a; r.arrow.style.transform = `translateX(${a > 0 ? Math.sin(t * 8) * 4 : 0}px)`;
  } };
};

// 5) Confession dialog → love story loading
C.dialog = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#5a1aa0 0%,#c4246f 60%,#ff5a8a 100%)', `
  <div data-r="A" style="text-align:center">
    <div data-r="env" style="font-size:66px;line-height:1">💌</div>
    <div style="font-size:32px;font-weight:800;margin:14px 0 24px">${s.question}</div>
    <div style="display:flex;gap:14px"><div class="btn" style="background:rgba(255,255,255,.18)">Промолчу</div><div class="btn" data-r="yes" style="background:#fff;color:#d42a72">Сказать ❤<i data-r="rip" style="position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px;border-radius:50%;background:rgba(255,61,139,.35)"></i></div></div>
  </div>
  <div data-r="B" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center">
    <div class="lbl">история любви</div>
    <div style="display:flex;align-items:center;justify-content:space-between"><div class="big"><span data-r="num">0</span><span class="unit">%</span></div><span class="chip" style="background:rgba(255,255,255,.2)">начинается…</span></div>
    <div class="track" style="height:16px;margin-top:20px"><div class="f" data-r="bar" style="background:linear-gradient(90deg,#ffd36b,#fff);box-shadow:0 0 14px #ffd36b"></div></div>
    <div class="lbl" style="margin-top:16px" data-r="dl">Отправлено ✓✓</div>
  </div>
  <svg data-r="cur" width="44" height="52" viewBox="0 0 22 26" style="position:absolute;left:0;top:0;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4))"><path d="M2 2L2 20L7 15.5L10.5 23L14 21.5L10.5 14.5L17 14Z" fill="#fff" stroke="#222" stroke-width="1.4" stroke-linejoin="round"/></svg>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    r.env.style.transform = `translateY(${-p * 8}px) rotate(${Math.sin(t * 3) * 6}deg)`;
    const m = eio(prog(t, s.click - .85, .8));
    const cx = lerp(560, 455, m), cy = lerp(300, 215, m);
    const ck = prog(t, s.click, .35);
    r.cur.style.transform = `translate(${cx}px, ${cy}px) scale(${1 - Math.sin(Math.PI * ck) * .15})`;
    r.cur.style.opacity = clamp((t - (s.click - 1.2)) * 3) * (1 - prog(t, s.start - .1, .2));
    r.yes.style.transform = `scale(${1 - Math.sin(Math.PI * ck) * .07})`;
    r.rip.style.transform = `scale(${ck * 12})`; r.rip.style.opacity = ck > 0 ? 1 - ck : 0;
    const sw = prog(t, s.start - .05, .4);
    r.A.style.opacity = 1 - sw; r.A.style.filter = `blur(${sw * 10}px)`; r.A.style.transform = `translateY(${-sw * 24}px)`;
    show(r.B, sw, 24);
    const v = eio(prog(t, s.start + .15, 1.3)) * 34; r.num.textContent = Math.round(v); r.bar.style.width = v + '%';
  } };
};

// 6) Getting acquainted — avatars come together
C.contact = (s, ctx) => {
  const { el, r } = shell(s, 'white', null, `
  <div style="position:relative;height:126px;margin-bottom:14px">
    <div data-r="dash" style="position:absolute;top:60px;border-top:3px dashed #d3c4df"></div>
    <span class="chip" data-r="dist" style="position:absolute;top:0;background:#f0e8f3;color:#6b5a7b;transform-origin:center">8 м</span>
    <div class="avatar" data-r="a1" style="top:16px;background:linear-gradient(135deg,#4f7dff,#7fd4ff);font-size:24px">Мен</div>
    <div class="avatar" data-r="a2" style="top:16px;background:linear-gradient(135deg,#ff5fa2,#ffa25c);font-size:24px">Сен</div>
    <div data-r="ht" style="position:absolute;top:-6px;left:284px;font-size:60px;line-height:1">💞</div>
  </div>
  <div class="row" style="flex-direction:column;align-items:stretch;gap:12px">
    <div style="display:flex;justify-content:space-between"><span>Симпатия</span><span data-r="st" style="color:#d42a72">ждёт…</span></div>
    <div class="track" style="height:14px"><div class="f" data-r="bar" style="background:linear-gradient(90deg,#ffa25c,#ff3d8b)"></div></div>
  </div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const k = eio(prog(t, ctx.t0 + .05, s.meet - ctx.t0 + .1));
    const x1 = lerp(14, 214, k), x2 = lerp(522, 322, k);
    r.a1.style.left = x1 + 'px'; r.a2.style.left = x2 + 'px';
    r.a1.style.transform = `translateY(${-Math.abs(Math.sin(t * 7)) * 6 * (k < 1)}px)`; r.a2.style.transform = `translateY(${-Math.abs(Math.sin(t * 7 + 1)) * 6 * (k < 1)}px)`;
    r.dash.style.left = (x1 + 92) + 'px'; r.dash.style.width = Math.max(0, x2 - x1 - 92) + 'px';
    r.dist.textContent = Math.round(8 * (1 - k)) + ' м'; r.dist.style.left = ((x1 + x2) / 2 + 46 - 34) + 'px'; r.dist.style.opacity = 1 - prog(t, s.meet - .15, .2);
    const h = prog(t, s.meet, .5); r.ht.style.transform = `scale(${spring(h) * (1 + p * .15)})`; r.ht.style.opacity = clamp(h * 4);
    const v = eio(prog(t, s.like, s.mutual - s.like + .5)) * 100; r.bar.style.width = v + '%';
    r.st.textContent = t >= s.mutual ? 'взаимно ✓' : t >= s.like ? Math.round(v) + '%' : 'ждёт…';
    r.st.style.transform = `scale(${1 + Math.sin(Math.PI * prog(t, s.mutual, .35)) * .25})`;
  } };
};

// 7) Eye contact — sparks fly
C.eyes = (s, ctx) => {
  const eye = side => `<div data-r="e${side}" style="position:absolute;${side === 'L' ? 'left:90px' : 'right:90px'};top:18px;width:150px;height:104px;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#fff,#ffe9ef);overflow:hidden;box-shadow:0 10px 24px rgba(120,0,40,.35),inset 0 -6px 12px rgba(255,120,160,.25)">
      <div data-r="i${side}" style="position:absolute;left:47px;top:24px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 50% 50%,#120720 0 34%,#5b2a86 36%,#a35cff 80%,#6b2fd6 100%)"><i style="position:absolute;left:12px;top:10px;width:14px;height:14px;border-radius:50%;background:#fff"></i></div>
      <div data-r="l${side}" style="position:absolute;left:0;right:0;top:0;background:#ff7a5c"></div></div>`;
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#ff8a3d 0%,#ff4a6e 55%,#d42a9a 100%)', `
  <div style="position:relative;height:140px">
    ${eye('L')}${eye('R')}
    <div data-r="beam" style="position:absolute;top:68px;left:314px;height:6px;border-radius:3px;background:linear-gradient(90deg,#fff6c9,#fff,#fff6c9);box-shadow:0 0 18px #fff3a0,0 0 40px #ffd36b"></div>
    <div data-r="sp" style="position:absolute;top:30px;left:284px;font-size:64px;line-height:1">⚡</div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px">
    <div><div class="lbl">взгляды</div><div style="font-size:32px;font-weight:800;position:relative;height:44px;width:330px"><span data-r="t1" style="position:absolute;white-space:nowrap">ищут друг друга…</span><span data-r="t2" style="position:absolute;white-space:nowrap">встретились ✓</span></div></div>
    <div class="big" style="font-size:58px"><span data-r="num">0.0</span><span class="unit">сек</span></div>
  </div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const lk = eio(prog(t, s.look, .4));
    const wx = Math.sin(t * 2.7) * 26 * (1 - lk), wy = Math.cos(t * 1.9) * 10 * (1 - lk);
    r.iL.style.transform = `translate(${wx + lk * 40}px, ${wy}px)`; r.iR.style.transform = `translate(${wx - lk * 40}px, ${wy}px)`;
    const bl = Math.max(Math.sin(Math.PI * prog(t, ctx.t0 + .15, .22)), Math.sin(Math.PI * prog(t, s.spark + .75, .2)));
    r.lL.style.height = r.lR.style.height = bl * 104 + 'px';
    const bk = eio(prog(t, s.look + .2, s.spark - s.look - .2));
    r.beam.style.width = bk * 230 + 'px'; r.beam.style.marginLeft = -bk * 115 + 'px'; r.beam.style.opacity = .4 + .6 * bk;
    const sk = prog(t, s.spark, .5); r.sp.style.transform = `scale(${spring(sk) * (1 + p * .2)}) rotate(${Math.sin(t * 9) * 10}deg)`; r.sp.style.opacity = clamp(sk * 4);
    r.t1.style.opacity = 1 - clamp(sk * 4); popIn(r.t2, sk);
    r.num.textContent = Math.max(0, t - s.look).toFixed(1);
  } };
};

window.CARDS = C;
})();
