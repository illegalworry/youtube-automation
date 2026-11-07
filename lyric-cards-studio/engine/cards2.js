// More UI cards (song «И»). Same contract as cards.js: (spec, ctx) => { el, extra?, update(t, pulse) }.
(() => {
const { clamp, lerp, eo, eio, prog, spring, mixHex } = window.U;
const { shell, show, popIn, icoBounce } = window.CARDKIT;
const C = window.CARDS;
const pop = (n, k) => { n.style.opacity = clamp(k * 3); n.style.transform = `scale(${spring(k)})`; };

// palette of raspberry colours that gets crossed out
C.palette = (s, ctx) => {
  const cols = ['#ff3d7f', '#e30b5c', '#c2185b', '#ff6f9c', '#b5004b'];
  const { el, r } = shell(s, 'white', null, `
    <div style="display:flex;gap:18px;justify-content:space-between;position:relative;margin:4px 0 22px">
      ${cols.map((k, i) => `<div data-r="s${i}" style="width:106px;text-align:center"><div style="height:106px;border-radius:30px;background:linear-gradient(160deg,${mixHex(k, '#ffffff', .3)},${k});box-shadow:0 10px 24px ${k}55"></div><div style="font-size:15px;font-weight:800;color:#8a7a95;margin-top:8px">${k.toUpperCase()}</div></div>`).join('')}
      <i data-r="x" style="position:absolute;left:0;top:50px;height:8px;border-radius:4px;background:#1d1330;box-shadow:0 0 0 3px #fff"></i>
    </div>
    <div class="row"><span>Малиновые</span><span style="position:relative;width:200px;height:38px"><span class="chip" data-r="c1" style="position:absolute;right:0;background:#f7d6e4;color:#c2185b">выбраны</span><span class="chip" data-r="c2" style="position:absolute;right:0;background:#1d1330;color:#fff">не нужны ✕</span></span></div>`);
  const ts = [1.62, 1.8, 2.04, 2.3, 2.56];
  return { el, update(t, p) {
    icoBounce(r, t, p);
    ts.forEach((a, i) => { const k = prog(t, a - .5, .45), f = prog(t, s.strike + .15 + i * .05, .3); r['s' + i].style.opacity = clamp(k * 3) * (1 - .55 * f); r['s' + i].style.transform = `translateY(${(1 - spring(k)) * 30 + f * 10}px) scale(${lerp(.6, 1, spring(k)) * (1 - .12 * f)})`; r['s' + i].style.filter = `grayscale(${f})`; });
    r.x.style.width = eo(prog(t, s.strike, .3)) * 628 + 'px';
    const k = prog(t, s.strike, .35); r.c1.style.opacity = 1 - clamp(k * 3); pop(r.c2, k);
  } };
};

// two heart halves join
C.halves = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#ff3d7f 0%,#c2187a 55%,#7a2cff 100%)', `
    <div style="display:flex;align-items:center;gap:30px">
      <svg width="230" height="210" viewBox="-30 -10 260 200" style="flex:none;overflow:visible">
        <path data-r="L" d="M100 170C40 120 0 90 0 50C0 20 22 0 50 0C72 0 90 12 100 30L92 60L106 90L94 120L100 170Z" fill="#fff"/>
        <path data-r="R" d="M100 30C110 12 128 0 150 0C178 0 200 20 200 50C200 90 160 120 100 170L94 120L106 90L92 60Z" fill="#ffd0e4"/>
      </svg>
      <div style="flex:1"><div class="lbl">моя половина</div><div class="big"><span data-r="n">50</span><span class="unit">%</span></div>
      <div style="position:relative;height:44px;margin-top:16px"><span class="chip" data-r="c1" style="position:absolute;background:rgba(255,255,255,.18)">ищу…</span><span class="chip" data-r="c2" style="position:absolute;background:#fff;color:#d42a72">нашлась ✓</span></div></div>
    </div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const k = eio(prog(t, ctx.t0, s.join - ctx.t0)), off = (1 - k) * 46, rot = (1 - k) * 14, b = t > s.join ? 1 + .06 * p : 1;
    r.L.setAttribute('transform', `translate(${-off} 0) rotate(${-rot} 100 170) translate(100 85) scale(${b}) translate(-100 -85)`);
    r.R.setAttribute('transform', `translate(${off} 0) rotate(${rot} 100 170) translate(100 85) scale(${b}) translate(-100 -85)`);
    r.n.textContent = Math.round(lerp(50, 100, k));
    const j = prog(t, s.join, .4); r.c1.style.opacity = 1 - clamp(j * 3); pop(r.c2, j);
  } };
};

// brutal + beautiful meters
C.meters = (s, ctx) => {
  const row = (id, name, col) => `<div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px"><span style="font-size:24px;font-weight:800">${name}</span><span class="big" style="font-size:52px"><span data-r="n${id}">0</span><span class="unit">%</span></span></div>
    <div class="track" style="height:16px"><div class="f" data-r="b${id}" style="background:${col}"></div></div></div>`;
  const { el, r } = shell(s, 'glass', null, row('A', 'Брутальность 😎', 'linear-gradient(90deg,#7fd4ff,#3d6bff)') + row('B', 'Красота ✨', 'linear-gradient(90deg,#ffb3d6,#ff3d7f)'));
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const a = lerp(eio(prog(t, ctx.t0, 1.6)) * 35, 100, eio(prog(t, s.a - .3, .45))), b = lerp(eio(prog(t, ctx.t0 + .6, 2)) * 25, 100, eio(prog(t, s.b - .3, .45)));
    r.nA.textContent = Math.round(a); r.bA.style.width = a + '%'; r.nB.textContent = Math.round(b); r.bB.style.width = b + '%';
    r.nA.parentNode.style.transform = `scale(${1 + Math.sin(Math.PI * prog(t, s.a, .35)) * .15})`; r.nB.parentNode.style.transform = `scale(${1 + Math.sin(Math.PI * prog(t, s.b, .35)) * .15})`;
  } };
};

// love receipt
C.receipt = (s, ctx) => {
  const items = [['Чувства', '∞'], ['Внимание', '24/7'], ['Объятия', '×100']];
  const { el, r } = shell(s, 'white', null, `
    ${items.map((it, i) => `<div data-r="i${i}" style="display:flex;justify-content:space-between;font-size:25px;font-weight:800;padding:11px 4px;border-bottom:2.5px dashed #e3d6e8"><span>${it[0]}</span><span style="color:#d42a72">${it[1]}</span></div>`).join('')}
    <div data-r="tot" style="display:flex;justify-content:space-between;align-items:center;padding-top:16px"><span class="lbl" style="opacity:1;font-size:24px">ИТОГО</span><span class="big" style="font-size:44px;color:#d42a72">ты ❤</span></div>
    <div data-r="stamp" style="position:absolute;right:20px;top:40px;padding:10px 20px;border:5px solid #ff3d7f;border-radius:16px;color:#ff3d7f;font-family:Unbounded;font-weight:800;font-size:28px;white-space:nowrap;background:rgba(255,61,127,.06)">МЕЖДУ НАМИ</div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    items.forEach((_, i) => { const k = prog(t, ctx.t0 + .2 + i * .35, .3); r['i' + i].style.opacity = clamp(k * 2); r['i' + i].style.transform = `translateX(${(1 - eo(k)) * -30}px)`; });
    const tk = prog(t, 11.95, .35); show(r.tot, tk);
    const st = prog(t, s.stamp, .28); r.stamp.style.opacity = st > 0 ? 1 : 0; r.stamp.style.transform = `rotate(-12deg) scale(${lerp(2.2, 1, eo(st))})`;
  } };
};

// cuteness rating
C.rating = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#ff7ac8 0%,#c45cff 100%)', `
    <div style="display:flex;justify-content:space-between;margin-bottom:18px">${[0, 1, 2, 3, 4].map(i => `<div data-r="h${i}" style="font-size:78px;line-height:1">🤍</div>`).join('')}</div>
    <div style="display:flex;align-items:center;justify-content:space-between"><div class="big"><span data-r="n">0</span><span class="unit">/ 10</span></div><span class="chip" data-r="st" style="background:#fff;color:#c2185b">так мило 💕</span></div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    for (let i = 0; i < 5; i++) { const k = prog(t, s.at + i * .13, .3); r['h' + i].textContent = k > 0 ? '💖' : '🤍'; r['h' + i].style.transform = `scale(${k > 0 ? spring(k) * (1 + .07 * p) : .85})`; }
    r.n.textContent = Math.round(eo(prog(t, s.at, .8)) * 10);
    const k = prog(t, 14.1, .4); r.st.style.opacity = clamp(k * 3); r.st.style.transform = `rotate(-6deg) scale(${spring(k)})`;
  } };
};

// music player
C.player = (s, ctx) => {
  const NB = 34;
  const { el, r } = shell(s, 'glass', null, `
    <div style="display:flex;gap:24px;align-items:center;margin-bottom:20px">
      <div data-r="cov" style="width:120px;height:120px;border-radius:26px;flex:none;background:conic-gradient(from 30deg,#ff6fae,#9b5cff,#5ce1ff,#ff6fae);display:flex;align-items:center;justify-content:center;font-size:56px;box-shadow:0 10px 30px rgba(155,92,255,.5)">♪</div>
      <div style="flex:1"><div style="font-size:34px;font-weight:800">Душевная музыка</div><div class="lbl" style="font-size:22px;margin-top:4px;position:relative;height:30px"><span data-r="a1" style="position:absolute">загрузка…</span><span data-r="a2" style="position:absolute;color:#ffb3d6;opacity:1">для неё ❤</span></div></div>
      <div data-r="pl" style="width:76px;height:76px;border-radius:50%;background:#fff;color:#7a2cff;display:flex;align-items:center;justify-content:center;font-size:30px;flex:none">▶</div>
    </div>
    <div style="display:flex;align-items:center;gap:4px;height:56px">${Array.from({ length: NB }, (_, i) => `<i data-r="w${i}" style="flex:1;border-radius:3px;background:#fff"></i>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;margin-top:10px" class="lbl"><span data-r="tc">0:00</span><span>3:14</span></div>`);
  const H = Array.from({ length: NB }, (_, i) => .3 + .7 * Math.abs(Math.sin(i * 1.9) * Math.cos(i * .7)));
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const pk = prog(t, ctx.t0 + .1, .3); r.pl.style.transform = `scale(${1 - Math.sin(Math.PI * pk) * .15})`; r.pl.textContent = pk >= 1 ? '❚❚' : '▶';
    r.cov.style.transform = `rotate(${(t - ctx.t0) * 30}deg)`;
    const fr = clamp((t - ctx.t0) / 3);
    for (let i = 0; i < NB; i++) { const n = r['w' + i]; n.style.height = (8 + 48 * H[i] * (.6 + .4 * Math.abs(Math.sin(t * 6 + i)))) + 'px'; n.style.opacity = i / NB <= fr ? 1 : .3; }
    r.tc.textContent = '0:' + String(Math.floor(fr * 30)).padStart(2, '0');
    const k = prog(t, s.her, .4); r.a1.style.opacity = 1 - clamp(k * 3); pop(r.a2, k);
  } };
};

// battery charging
C.battery = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#ff9a2e 0%,#ff4d2e 100%)', `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:22px"><div style="flex:1;height:120px;border-radius:26px;border:5px solid #fff;padding:9px;display:flex;gap:8px">${Array.from({ length: 10 }, (_, i) => `<div data-r="c${i}" style="flex:1;border-radius:9px;background:#fff"></div>`).join('')}</div><div style="width:16px;height:50px;border-radius:0 8px 8px 0;background:#fff"></div></div>
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="big"><span data-r="n">0</span><span class="unit">%</span></div><span class="chip" data-r="ok" style="background:#fff;color:#e2401a">ОСИЛЮ ✓</span></div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const v = eio(prog(t, ctx.t0, s.done - ctx.t0 + .1)) * 100; r.n.textContent = Math.round(v);
    const fl = t > 19.3 ? (Math.sin(t * 50) > 0 ? 1 : .35) : 1;
    for (let i = 0; i < 10; i++) r['c' + i].style.opacity = v >= (i + 1) * 10 - 5 ? fl : .18;
    pop(r.ok, prog(t, s.done, .4));
  } };
};

// caramel product card
C.candy = (s, ctx) => {
  const { el, r } = shell(s, 'white', null, `
    <div style="display:flex;gap:26px;align-items:center">
      <div style="width:200px;height:200px;border-radius:34px;flex:none;background:radial-gradient(circle at 40% 35%,#fff3c4,#ffd36b 45%,#ff9a2e);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(255,150,40,.45)"><div data-r="cd" style="font-size:130px;line-height:1">🍬</div></div>
      <div style="flex:1"><div class="lbl">ты</div><div class="big" style="font-size:58px;color:#e07b12;position:relative;height:64px"><span data-r="q" style="position:absolute">???</span><span data-r="nm" style="position:absolute">Карамель</span></div>
        <div data-r="st" style="font-size:34px;margin:12px 0 14px;letter-spacing:4px">⭐⭐⭐⭐⭐</div>
        <div class="row"><span>Сладость</span><span style="color:#e07b12;font-weight:800"><span data-r="n">0</span>%</span></div></div>
    </div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    r.cd.style.transform = `rotate(${Math.sin(t * 2) * 14}deg) scale(${spring(prog(t, ctx.t0, .5)) * (1 + .06 * p)})`;
    const k = prog(t, s.name, .4); r.q.style.opacity = 1 - clamp(k * 3); pop(r.nm, k); r.nm.style.transformOrigin = 'left center';
    r.st.style.clipPath = `inset(0 ${100 - eo(prog(t, ctx.t0 + .3, 1)) * 100}% 0 0)`;
    r.n.textContent = Math.round(eio(prog(t, ctx.t0 + .2, 1.2)) * 100);
  } };
};

// wild grass
C.grass = (s, ctx) => {
  const N = 40, B = Array.from({ length: N }, (_, i) => ({ x: 8 + i * 15.6, h: 50 + ((i * 37) % 23) * 3.4, ph: i * 1.3 }));
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#1f9d57 0%,#2fd27a 60%,#b6f25c 100%)', `
    <div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div class="lbl">высота травы</div><div class="big"><span data-r="n">0</span><span class="unit">см</span></div></div><span class="chip" data-r="w" style="background:#fff;color:#178a49;margin-bottom:8px">🌿 дикая</span></div>
    <svg width="628" height="150" viewBox="0 0 628 150" style="margin-top:12px;display:block"><rect x="0" y="140" width="628" height="10" rx="5" fill="rgba(255,255,255,.35)"/>${B.map((b, i) => `<path data-r="g${i}" fill="${i % 3 ? '#e9ffd1' : '#ffffff'}" opacity=".95"/>`).join('')}</svg>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const g = eo(prog(t, ctx.t0, 1)), wd = eio(prog(t, s.wild, .6));
    B.forEach((b, i) => { const h = b.h * lerp(.3, .75, g) * (1 + .45 * wd), sw = Math.sin(t * (2 + 3 * wd) + b.ph) * (5 + 14 * wd), tx = b.x + sw;
      r['g' + i].setAttribute('d', `M${b.x - 5} 142 Q${b.x - 2 + sw * .4} ${142 - h * .55} ${tx} ${142 - h} Q${b.x + 2 + sw * .4} ${142 - h * .5} ${b.x + 5} 142Z`); });
    r.n.textContent = Math.round(lerp(15, 45, g) * (1 + .9 * wd)); pop(r.w, prog(t, s.wild, .4));
  } };
};

// taste profile
C.taste = (s, ctx) => {
  const rows = [['Сладко', '#ff3d7f', 100], ['Нежно', '#c45cff', 92], ['Горько', '#8a7a95', 0]];
  const { el, r } = shell(s, 'white', null, `
    ${rows.map((q, i) => `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:23px;font-weight:800;margin-bottom:8px"><span>${q[0]}</span><span style="color:${q[1]}"><span data-r="n${i}">0</span>%</span></div><div class="track" style="height:14px"><div class="f" data-r="b${i}" style="background:${q[1]}"></div></div></div>`).join('')}
    <div style="text-align:right"><span class="chip" data-r="ok" style="background:#ffe1ee;color:#d42a72">на вкус: сладкая 😋</span></div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    rows.forEach((q, i) => { const v = eio(prog(t, ctx.t0 + .15 + i * .3, 1)) * q[2]; r['n' + i].textContent = Math.round(v); r['b' + i].style.width = v + '%'; });
    pop(r.ok, prog(t, s.taste, .4));
  } };
};

// boarding pass "fly away"
C.boarding = (s, ctx) => {
  const { el, r } = shell(s, 'white', null, `
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div><div class="lbl">откуда</div><div class="big" style="font-size:46px;color:#2d6bff">Земля</div></div>
      <div style="flex:1;position:relative;height:50px;margin:0 20px 10px"><div style="position:absolute;top:24px;left:0;right:0;border-top:3px dashed #b9c9ef"></div><div data-r="pl" style="position:absolute;top:0;font-size:40px;line-height:1">✈️</div></div>
      <div style="text-align:right"><div class="lbl">куда</div><div class="big" style="font-size:46px;color:#d42a72">к ней</div></div>
    </div>
    <div class="row" style="margin-top:22px"><span>Высота</span><span class="big" style="font-size:34px;color:#2d6bff"><span data-r="n">0</span> м</span></div>
    <div class="row" style="margin-top:10px"><span>Рейс</span><span data-r="f" style="color:#d42a72">как всегда ✓</span></div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const k = eio(prog(t, s.go, 1.9)); r.pl.style.left = `calc(${k * 100}% - ${k * 40}px)`; r.pl.style.transform = `translateY(${-Math.sin(Math.PI * k) * 14}px) rotate(${-10 + k * 10}deg)`;
    r.n.textContent = Math.round(k * 10000).toLocaleString('ru-RU');
    pop(r.f, prog(t, 29.08, .4));
  } };
};

// search: "where are my thoughts"
C.search = (s, ctx) => {
  const Q = 'где мои мысли?';
  const { el, r } = shell(s, 'glass', null, `
    <div class="row" style="background:rgba(255,255,255,.92);color:#1d1330;font-size:28px;justify-content:flex-start;gap:14px;padding:18px 22px"><span>🔍</span><span data-r="q"></span><i data-r="cur" style="width:3px;height:30px;background:#7a2cff"></i></div>
    <div style="display:flex;align-items:center;gap:18px;margin-top:22px;height:84px">
      <div data-r="sp" style="width:56px;height:56px;border-radius:50%;border:6px solid rgba(255,255,255,.25);border-top-color:#fff;flex:none"></div>
      <div style="position:relative;flex:1;height:84px"><div data-r="l1" style="position:absolute;top:22px;font-size:26px;font-weight:700;opacity:.8">Ищу… результатов: 0</div>
      <div data-r="l2" class="row" style="position:absolute;left:0;right:0;top:0;background:#fff;color:#1d1330"><span>💜 Половина</span><span style="color:#7a2cff">1 результат</span></div></div>
    </div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const n = Math.floor(clamp((t - s.type1 - .1) / 1.6) * Q.length); r.q.textContent = Q.slice(0, n);
    r.cur.style.opacity = Math.sin(t * 12) > 0 ? 1 : 0;
    r.sp.style.transform = `rotate(${t * 420}deg)`; const f = prog(t, s.found, .4);
    r.sp.style.opacity = 1 - clamp(f * 3); r.l1.style.opacity = .8 * (1 - clamp(f * 3)); pop(r.l2, f);
  } };
};

// two avatars pulled by the hand
C.pull = (s, ctx) => {
  const { el, r } = shell(s, 'grad', 'linear-gradient(135deg,#ff4f7a 0%,#d42a72 60%,#8a2cd6 100%)', `
    <div style="position:relative;height:120px;margin-bottom:18px">
      <svg width="628" height="120" style="position:absolute;left:0;top:0"><path data-r="rope" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 10"/></svg>
      <div class="avatar" data-r="a1" style="top:14px;background:linear-gradient(135deg,#4f7dff,#7fd4ff);font-size:24px">Я</div>
      <div class="avatar" data-r="a2" style="top:14px;background:linear-gradient(135deg,#ffd36b,#ff9a5c);font-size:24px">Ты</div>
      <div data-r="h" style="position:absolute;left:274px;top:20px;font-size:76px;line-height:1">🤝</div>
    </div>
    <div class="row"><span>Тянет к тебе</span><span class="big" style="font-size:34px"><span data-r="n">0</span>%</span></div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    const k = eio(prog(t, s.pull - .8, s.snap - s.pull + .8)), sn = prog(t, s.snap, .4);
    const x1 = lerp(20, 190, k), x2 = lerp(516, 346, k);
    r.a1.style.left = x1 + 'px'; r.a2.style.left = x2 + 'px';
    r.rope.setAttribute('d', `M${x1 + 92} 60 Q314 ${60 + lerp(40, 0, k) + Math.sin(t * 4) * 6} ${x2} 60`); r.rope.style.opacity = 1 - clamp(sn * 3);
    r.h.style.opacity = clamp(sn * 3); r.h.style.transform = `scale(${spring(sn) * (1 + .08 * p)})`;
    r.n.textContent = t >= s.snap ? 100 : Math.round(lerp(20, 92, k));
  } };
};

// heart monitor
C.pulse = (s, ctx) => {
  const { el, r } = shell(s, 'white', null, `
    <div style="display:flex;align-items:center;gap:20px">
      <svg width="400" height="120" viewBox="0 0 400 120" style="flex:none"><path data-r="ln" fill="none" stroke="#ff3b4f" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>
      <div style="flex:1;text-align:right"><div class="big" style="font-size:72px;color:#ff3b4f"><span data-r="n">120</span></div><div class="lbl">уд/мин</div></div>
    </div>
    <div class="row" style="margin-top:18px;background:#ffe0e4"><span>Доза любви</span><span style="color:#ff3b4f;font-weight:800"><span data-r="d">0</span>%</span></div>
    <div data-r="w" class="btn" style="display:block;margin-top:14px;background:#ff3b4f;color:#fff">Осторожно: в самое сердце</div>`);
  return { el, update(t, p) {
    icoBounce(r, t, p);
    let d = ''; const span = 1.8;
    for (let i = 0; i <= 120; i++) { const u = i / 120, tt = t - span + u * span; let y = 64;
      for (const bt of window.__GRID || []) { const dt = tt - bt; if (dt > -.06 && dt < .16) y += dt < 0 ? 8 * Math.sin(Math.PI * (dt + .06) / .06) : dt < .04 ? -52 * Math.sin(Math.PI * dt / .04) : dt < .08 ? 26 * Math.sin(Math.PI * (dt - .04) / .04) : -6 * Math.sin(Math.PI * (dt - .08) / .08); }
      d += (i ? 'L' : 'M') + (u * 400).toFixed(1) + ' ' + y.toFixed(1); }
    r.ln.setAttribute('d', d);
    r.n.textContent = Math.round(lerp(120, 186, eio(prog(t, ctx.t0, s.vein - ctx.t0 + .5))));
    r.d.textContent = Math.round(eio(prog(t, ctx.t0 + .2, 1.6)) * 100);
    pop(r.w, prog(t, s.vein, .4));
  } };
};
})();
