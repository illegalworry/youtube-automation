// Neon object scenes for the kinetic engine. type: (spec, ctx) => { el, update(t, pulse, env, pal) }. Pure functions of t.
(() => {
const { clamp, lerp, eo, eio, prog, spring, rnd, hexA, mixHex } = window.U;
const refs = el => { const r = {}; el.querySelectorAll('[data-r]').forEach(n => r[n.dataset.r] = n); return r; };
function neo(c1, c2, ttl, right, inner) {
  const el = document.createElement('div'); el.className = 'neo';
  el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  el.style.boxShadow = `0 0 40px ${hexA(c1, .55)}, 0 0 90px ${hexA(c2, .35)}, 0 40px 80px rgba(0,0,0,.5)`;
  el.innerHTML = `<div class="in"><div class="ttl"><span>${ttl}</span><span>${right || ''}</span></div>${inner}</div>`;
  return { el, r: refs(el) };
}
function free(w, h, inner) {
  const el = document.createElement('div'); el.className = 'free';
  el.style.cssText = `left:${-w / 2}px;top:${-h / 2}px;width:${w}px;height:${h}px`;
  el.innerHTML = inner; return { el, r: refs(el) };
}
// deterministic particle burst inside a container (coords relative to container's top-left)
function burst(parent, seed, n, chars, cx, cy, at, opt = {}) {
  const R = rnd(seed); const ps = Array.from({ length: n }, () => {
    const d = document.createElement('div'); d.className = 'pop'; d.textContent = chars[Math.floor(R() * chars.length)]; parent.appendChild(d);
    const a = R() * Math.PI * 2, v = (opt.speed || 600) * (.4 + R() * .8);
    return { d, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (opt.up || 250), sz: (opt.size || 40) * (.6 + R() * .8), rot: (R() - .5) * 500, life: .9 + R() * .7 };
  });
  return t => { for (const p of ps) { const dt = t - at; if (dt < 0 || dt > p.life) { p.d.style.display = 'none'; continue; }
    p.d.style.display = ''; p.d.style.fontSize = p.sz + 'px'; p.d.style.opacity = 1 - (dt / p.life) ** 2;
    p.d.style.transform = `translate(${cx + p.vx * dt - p.sz / 2}px, ${cy + p.vy * dt + 700 * dt * dt - p.sz / 2}px) rotate(${p.rot * dt}deg) scale(${Math.min(1, dt * 8)})`; } };
}
const O = {};

// 1. raspberry swatches, crossed out
O.swatches = (s, c) => {
  const cols = ['#ff2d75', '#e30b5c', '#c2185b', '#ff5c8a', '#b5004b'];
  const { el, r } = neo('#ff2d75', '#7a1cff', 'ПАЛИТРА · МАЛИНОВЫЙ', '🎨', `
    <div style="position:relative;height:300px">
      ${cols.map((k, i) => `<div data-r="s${i}" style="position:absolute;left:${i * 160}px;top:10px;width:138px;height:210px;border-radius:30px;background:linear-gradient(160deg,${mixHex(k, '#ffffff', .25)},${k});box-shadow:0 0 30px ${hexA(k, .6)}"><div style="position:absolute;bottom:-46px;left:0;right:0;text-align:center;font-size:22px;font-weight:800;opacity:.7">${k.toUpperCase()}</div></div>`).join('')}
      <div data-r="x1" style="position:absolute;left:390px;top:115px;width:0;height:16px;border-radius:8px;background:#fff;box-shadow:0 0 20px #ff2d75,0 0 50px #ff2d75;transform-origin:center"></div>
      <div data-r="x2" style="position:absolute;left:390px;top:115px;width:0;height:16px;border-radius:8px;background:#fff;box-shadow:0 0 20px #ff2d75,0 0 50px #ff2d75;transform-origin:center"></div>
    </div>
    <div style="text-align:center;margin-top:8px"><span class="chip" data-r="no" style="background:#fff;color:#e30b5c">не нужны ✕</span></div>`);
  const ts = [1.62, 1.84, 2.04, 2.3, 2.56];
  return { el, update(t) {
    ts.forEach((a, i) => { const k = prog(t, a, .45), f = prog(t, s.strike + .3 + i * .04, .8);
      r['s' + i].style.opacity = clamp(k * 3) * (1 - f);
      r['s' + i].style.transform = `translateY(${(1 - spring(k)) * 80 + f * f * 500}px) rotate(${(1 - k) * 15 + f * (i - 2) * 40}deg) scale(${lerp(.6, 1, spring(k))})`; });
    const x = eo(prog(t, s.strike, .25)), y = eo(prog(t, s.strike + .1, .25));
    [[r.x1, x, 22], [r.x2, y, -22]].forEach(([n, k, a]) => { n.style.width = k * 820 + 'px'; n.style.marginLeft = -k * 410 + 'px'; n.style.transform = `rotate(${a}deg)`; n.style.opacity = 1 - prog(t, s.strike + .45, .3); });
    const n = prog(t, s.strike, .4); r.no.style.opacity = clamp(n * 3); r.no.style.transform = `scale(${spring(n)})`;
  } };
};

// 2. heart halves join
O.halves = (s, c) => {
  const { el, r } = free(900, 640, `
    <svg width="900" height="520" viewBox="-250 -20 700 220" style="overflow:visible">
      <defs><linearGradient id="hh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8ab8"/><stop offset="1" stop-color="#e30b5c"/></linearGradient>
      <filter id="hgl"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <path data-r="L" d="M100 170C40 120 0 90 0 50C0 20 22 0 50 0C72 0 90 12 100 30L92 60L106 90L94 120L100 170Z" fill="url(#hh)" stroke="#fff" stroke-width="3" filter="url(#hgl)"/>
      <path data-r="R" d="M100 30C110 12 128 0 150 0C178 0 200 20 200 50C200 90 160 120 100 170L94 120L106 90L92 60Z" fill="url(#hh)" stroke="#fff" stroke-width="3" filter="url(#hgl)"/>
    </svg>
    <div style="text-align:center;margin-top:10px"><span class="chip" data-r="lab" style="background:rgba(255,255,255,.12);border:2px solid #ff8ab8;box-shadow:0 0 24px #ff2d75">½ + ½ = ❤</span></div>`);
  const b = burst(el, 5, 14, ['💖', '✨', '💗'], 450, 260, s.join, { size: 46 });
  return { el, update(t, p) {
    const k = eio(prog(t, c.t0, s.join - c.t0));
    const off = (1 - k) * 150, rot = (1 - k) * 14;
    const beat = t > s.join ? 1 + .06 * p : 1;
    r.L.setAttribute('transform', `translate(${-off} 0) rotate(${-rot} 100 170) translate(100 85) scale(${beat}) translate(-100 -85)`);
    r.R.setAttribute('transform', `translate(${off} 0) rotate(${rot} 100 170) translate(100 85) scale(${beat}) translate(-100 -85)`);
    const j = prog(t, s.join, .5); r.lab.style.opacity = clamp(j * 3); r.lab.style.transform = `scale(${spring(j)})`;
    b(t);
  } };
};

// 3. brutal + beautiful meters
O.meters = (s, c) => {
  const row = (id, name, emo, col) => `<div style="margin-bottom:34px"><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:14px"><span style="font-size:34px;font-weight:800">${name} <span data-r="e${id}" style="display:inline-block">${emo}</span></span><span class="big" style="font-size:72px;color:${col};text-shadow:0 0 24px ${col}"><span data-r="n${id}">0</span>%</span></div>
    <div style="height:30px;border-radius:15px;background:rgba(255,255,255,.1);overflow:hidden"><div data-r="b${id}" style="height:100%;border-radius:15px;background:linear-gradient(90deg,${mixHex(col, '#ffffff', .4)},${col});box-shadow:0 0 24px ${col}"></div></div></div>`;
  const { el, r } = neo('#5ce1ff', '#ff2d75', 'ЕЙ НУЖНО · САМОЕ', '🔥', row('A', 'Брутальность', '😎', '#5ce1ff') + row('B', 'Красота', '✨', '#ff2d75'));
  return { el, update(t) {
    const a = lerp(eio(prog(t, c.t0, 1.6)) * 35, 100, eio(prog(t, s.a - .3, .45)));
    const b = lerp(eio(prog(t, c.t0 + .6, 2)) * 25, 100, eio(prog(t, s.b - .3, .45)));
    r.nA.textContent = Math.round(a); r.bA.style.width = a + '%'; r.nB.textContent = Math.round(b); r.bB.style.width = b + '%';
    r.eA.style.transform = `scale(${1 + Math.sin(Math.PI * prog(t, s.a, .4)) * .6})`; r.eB.style.transform = `scale(${1 + Math.sin(Math.PI * prog(t, s.b, .4)) * .6}) rotate(${t * 90}deg)`;
  } };
};

// 4. love receipt printing out, stamped
O.receipt = (s, c) => {
  const line = (a, b) => `<div style="display:flex;justify-content:space-between;font-size:32px;font-weight:800;padding:12px 0;border-bottom:3px dashed #e5d5e0"><span>${a}</span><span>${b}</span></div>`;
  const { el, r } = free(660, 700, `
    <div style="position:absolute;left:-20px;right:-20px;top:0;height:34px;border-radius:17px;background:#1a0c2a;box-shadow:0 0 30px #ffc24a, inset 0 -4px 0 #ffc24a"></div>
    <div data-r="paper" style="position:absolute;left:30px;right:30px;top:17px;background:#fffaf3;color:#2a1530;padding:40px 40px 50px;clip-path:polygon(0 0,100% 0,100% calc(100% - 20px),95% 100%,90% calc(100% - 20px),85% 100%,80% calc(100% - 20px),75% 100%,70% calc(100% - 20px),65% 100%,60% calc(100% - 20px),55% 100%,50% calc(100% - 20px),45% 100%,40% calc(100% - 20px),35% 100%,30% calc(100% - 20px),25% 100%,20% calc(100% - 20px),15% 100%,10% calc(100% - 20px),5% 100%,0 calc(100% - 20px))">
      <div style="text-align:center;font-size:24px;font-weight:800;letter-spacing:.2em;opacity:.55">ЧЕК № 001</div>
      <div class="big" style="text-align:center;font-size:58px;margin:12px 0 22px;color:#e30b5c">ЛЮБОВЬ</div>
      ${line('Чувства', '∞')}${line('Внимание', '24/7')}${line('Объятия', '×100')}
      <div style="display:flex;justify-content:space-between;font-size:40px;font-weight:900;padding-top:20px"><span>ИТОГО</span><span>ты ❤</span></div>
    </div>
    <div data-r="stamp" style="position:absolute;left:150px;top:330px;padding:16px 30px;border:7px solid #ff2d75;border-radius:20px;color:#ff2d75;font-family:Unbounded;font-weight:900;font-size:44px;white-space:nowrap;background:rgba(255,45,117,.08)">МЕЖДУ НАМИ</div>`);
  return { el, update(t) {
    const k = eio(prog(t, c.t0 + .05, 1.6));
    r.paper.style.transform = `translateY(${(k - 1) * 80}px)`;
    r.paper.style.clipPath = r.paper.style.clipPath; r.paper.style.maskImage = `linear-gradient(180deg,#000 ${k * 100}%,transparent ${k * 100 + 1}%)`; r.paper.style.webkitMaskImage = r.paper.style.maskImage;
    const st = prog(t, s.stamp, .3); r.stamp.style.opacity = st > 0 ? 1 : 0; r.stamp.style.transform = `rotate(-14deg) scale(${lerp(2.4, 1, eo(st))})`;
  } };
};

// 5. cuteness rating
O.cute = (s, c) => {
  const { el, r } = neo('#ff9ad5', '#c08bff', 'МИЛОТА · РЕЙТИНГ', '🥹', `
    <div style="display:flex;justify-content:center;gap:22px;margin:4px 0 26px">${[0, 1, 2, 3, 4].map(i => `<div data-r="h${i}" style="font-size:96px;line-height:1">🤍</div>`).join('')}</div>
    <div style="display:flex;align-items:center;justify-content:space-between"><div class="big" style="font-size:120px;color:#ff9ad5;text-shadow:0 0 30px #ff9ad5"><span data-r="n">0</span><span style="font-size:56px;opacity:.7">/10</span></div>
    <span class="chip" data-r="st" style="background:#fff;color:#c2185b;transform:rotate(-8deg)">так мило 💕</span></div>`);
  return { el, update(t, p) {
    for (let i = 0; i < 5; i++) { const k = prog(t, s.at + i * .14, .3); r['h' + i].textContent = k > 0 ? '💖' : '🤍'; r['h' + i].style.transform = `scale(${k > 0 ? spring(k) * (1 + .08 * p) : .85})`; }
    const n = Math.round(eo(prog(t, s.at, .9)) * 10); r.n.textContent = n;
    const st = prog(t, s.at + .6, .4); r.st.style.opacity = clamp(st * 3); r.st.style.transform = `rotate(-8deg) scale(${spring(st)})`;
  } };
};

// 6. spinning vinyl with radial visualiser
O.vinyl = (s, c) => {
  const NB = 48;
  const { el, r } = free(760, 760, `
    <div data-r="bars" style="position:absolute;left:380px;top:360px">${Array.from({ length: NB }, (_, i) => `<i data-r="v${i}" style="position:absolute;left:-5px;top:0;width:10px;border-radius:5px;background:linear-gradient(#fff,#c08bff);box-shadow:0 0 10px #c08bff;transform-origin:5px 0;transform:rotate(${i * 360 / NB}deg) translateY(255px)"></i>`).join('')}</div>
    <div data-r="disc" style="position:absolute;left:140px;top:120px;width:480px;height:480px;border-radius:50%;background:repeating-radial-gradient(circle,#141018 0 3px,#221a2c 4px 6px);box-shadow:0 0 0 4px #2b1e3a,0 0 60px rgba(192,139,255,.55)">
      <div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,rgba(255,255,255,0),rgba(255,255,255,.18) 30deg,rgba(255,255,255,0) 70deg,rgba(255,255,255,0) 200deg,rgba(255,255,255,.12) 230deg,rgba(255,255,255,0) 260deg)"></div>
      <div style="position:absolute;left:150px;top:150px;width:180px;height:180px;border-radius:50%;background:linear-gradient(135deg,#c08bff,#ff2d75);display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:22px;line-height:1.1">ДУШЕВНАЯ<br>МУЗЫКА<i style="position:absolute;left:82px;top:82px;width:16px;height:16px;border-radius:50%;background:#0b0710"></i></div>
    </div>
    <div data-r="arm" style="position:absolute;left:640px;top:70px;width:16px;height:330px;border-radius:8px;background:linear-gradient(#ddd,#888);transform-origin:8px 8px;box-shadow:0 0 14px rgba(255,255,255,.4)"><i style="position:absolute;left:-14px;bottom:-12px;width:44px;height:60px;border-radius:10px;background:#bbb"></i></div>
    <div style="position:absolute;left:0;right:0;top:640px;text-align:center"><span class="chip" data-r="her" style="background:#fff;color:#7a1cff">♪ всё для неё ❤</span></div>`);
  return { el, update(t, p, env) {
    r.disc.style.transform = `rotate(${(t - c.t0) * 160}deg)`;
    r.arm.style.transform = `rotate(${lerp(-8, 22, eio(prog(t, c.t0, .7)))}deg)`;
    for (let i = 0; i < NB; i++) { const h = 14 + 70 * clamp(env * (.45 + .55 * Math.abs(Math.sin(i * 2.1 + t * 7)))) * eo(prog(t, c.t0 + .3, .5)); r['v' + i].style.height = h + 'px'; }
    const k = prog(t, s.her, .4); r.her.style.opacity = clamp(k * 3); r.her.style.transform = `scale(${spring(k)})`;
  } };
};

// 7. power battery charging (shakes through the drop build-up)
O.power = (s, c) => {
  const { el, r } = neo('#ffc24a', '#ff4d2e', 'ЗАРЯД · ВСЁ ОСИЛЮ', '⚡', `
    <div style="display:flex;align-items:center;gap:16px">
      <div style="flex:1;height:190px;border-radius:34px;border:6px solid #fff;padding:12px;display:flex;gap:10px;box-shadow:0 0 30px rgba(255,194,74,.6)">${Array.from({ length: 10 }, (_, i) => `<div data-r="c${i}" style="flex:1;border-radius:12px;background:#ffc24a"></div>`).join('')}</div>
      <div style="width:22px;height:70px;border-radius:0 10px 10px 0;background:#fff"></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:28px"><div class="big" style="font-size:96px;color:#ffc24a;text-shadow:0 0 30px #ffc24a"><span data-r="n">0</span>%</div><span class="chip" data-r="ok" style="background:#ffc24a;color:#2a1000">ОСИЛЮ ✓</span></div>`);
  return { el, update(t, p) {
    const v = eio(prog(t, c.t0, s.done - c.t0 + .1)) * 100; r.n.textContent = Math.round(v);
    const fl = t > 19.3 ? (Math.sin(t * 60) > 0 ? 1 : .4) : 1;
    for (let i = 0; i < 10; i++) { const on = v >= (i + 1) * 10 - 5; r['c' + i].style.opacity = on ? fl : .12; r['c' + i].style.boxShadow = on ? '0 0 18px #ffc24a' : 'none'; r['c' + i].style.background = i > 6 ? '#ff7a2e' : '#ffc24a'; }
    const k = prog(t, s.done, .4); r.ok.style.opacity = clamp(k * 3); r.ok.style.transform = `scale(${spring(k)})`;
  } };
};

// 8. giant caramel candy (lands on the drop)
O.candy = (s, c) => {
  const { el, r } = free(900, 700, `
    <div data-r="cd" style="position:absolute;left:450px;top:300px">
      <div style="position:absolute;left:-400px;top:-120px;width:200px;height:240px;clip-path:polygon(100% 30%,0 0,20% 50%,0 100%,100% 70%);background:repeating-linear-gradient(100deg,#ffd86b 0 18px,#ff8a2e 18px 36px)"></div>
      <div style="position:absolute;left:200px;top:-120px;width:200px;height:240px;clip-path:polygon(0 30%,100% 0,80% 50%,100% 100%,0 70%);background:repeating-linear-gradient(80deg,#ffd86b 0 18px,#ff8a2e 18px 36px)"></div>
      <div style="position:absolute;left:-220px;top:-150px;width:440px;height:300px;border-radius:50%;background:radial-gradient(ellipse at 35% 30%,#fff3c4 0,#ffc24a 22%,#e07b12 65%,#8a3a00 100%);box-shadow:0 0 80px rgba(255,176,46,.8),inset -20px -30px 50px rgba(90,30,0,.5)">
        <div style="position:absolute;left:70px;top:44px;width:150px;height:60px;border-radius:50%;background:rgba(255,255,255,.65);filter:blur(6px);transform:rotate(-15deg)"></div>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;top:520px;text-align:center"><span class="chip" data-r="lab" style="background:linear-gradient(90deg,#ffd86b,#ff8a2e);color:#3a1400">🍬 сладость 100%</span></div>`);
  const b = burst(el, 8, 18, ['✨', '🍬', '⭐'], 450, 300, c.t0, { size: 52, speed: 800 });
  return { el, update(t, p) {
    const k = prog(t, c.t0, .55);
    r.cd.style.transform = `scale(${spring(k) * (1 + .05 * p)}) rotate(${Math.sin(t * 1.6) * 10 + (1 - k) * -40}deg)`;
    const l = prog(t, 21.2, .4); r.lab.style.opacity = clamp(l * 3); r.lab.style.transform = `scale(${spring(l)})`;
    b(t);
  } };
};

// 9. wild neon grass
O.grass = (s, c) => {
  const R = rnd(77); const N = 64;
  const blades = Array.from({ length: N }, (_, i) => ({ x: 20 + i * 13.6 + (R() - .5) * 8, h: 160 + R() * 220, w: 10 + R() * 10, ph: R() * 6, col: R() < .5 ? '#9dff5c' : R() < .5 ? '#3dffa8' : '#d4ff5c' }));
  const { el, r } = free(900, 640, `
    <svg width="900" height="560" viewBox="0 0 900 560" style="position:absolute;top:0;overflow:visible">
      <defs><filter id="gg"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <ellipse cx="450" cy="540" rx="460" ry="40" fill="rgba(157,255,92,.25)" filter="url(#gg)"/>
      <g filter="url(#gg)">${blades.map((b, i) => `<path data-r="g${i}" fill="${b.col}" opacity=".9"/>`).join('')}</g>
      ${Array.from({ length: 14 }, (_, i) => `<circle data-r="f${i}" r="6" fill="#f6ff9c" filter="url(#gg)"/>`).join('')}
    </svg>
    <div style="position:absolute;left:0;right:0;top:580px;text-align:center"><span class="chip" data-r="w" style="background:#9dff5c;color:#0d2a00">🌿 дикая</span></div>`);
  const FR = rnd(31); const ff = Array.from({ length: 14 }, () => ({ x: FR() * 900, y: 120 + FR() * 360, s: FR() * 6 }));
  return { el, update(t, p) {
    const grow = eo(prog(t, c.t0, 1)), wild = eio(prog(t, s.wild, .6));
    blades.forEach((b, i) => {
      const h = b.h * lerp(.15, .7, grow) * (1 + .5 * wild); const sway = Math.sin(t * (2 + 3 * wild) + b.ph + i * .2) * (14 + 40 * wild) + p * 6;
      const tipx = b.x + sway, tipy = 540 - h;
      r['g' + i].setAttribute('d', `M${b.x - b.w / 2} 540 Q${b.x - b.w / 4 + sway * .4} ${540 - h * .55} ${tipx} ${tipy} Q${b.x + b.w / 4 + sway * .4} ${540 - h * .5} ${b.x + b.w / 2} 540Z`);
    });
    ff.forEach((f, i) => { const n = r['f' + i]; n.setAttribute('cx', f.x + Math.sin(t * 1.3 + f.s) * 40); n.setAttribute('cy', f.y + Math.cos(t * 1.1 + f.s) * 30); n.setAttribute('opacity', wild * (.4 + .6 * Math.abs(Math.sin(t * 3 + f.s)))); });
    const w = prog(t, s.wild, .4); r.w.style.opacity = clamp(w * 3); r.w.style.transform = `scale(${spring(w)})`;
  } };
};

// 10. spinning lollipop + taste meter
O.lolli = (s, c) => {
  const { el, r } = free(900, 700, `
    <div style="position:absolute;left:438px;top:300px;width:24px;height:300px;border-radius:12px;background:linear-gradient(90deg,#eee,#fff,#ccc)"></div>
    <div data-r="pop" style="position:absolute;left:250px;top:40px;width:400px;height:400px;border-radius:50%;background:conic-gradient(#ff5fb0,#fff,#ff5fb0,#ffd0e8,#ff2d75,#fff,#ff5fb0,#ffd0e8,#ff5fb0);box-shadow:0 0 80px rgba(255,95,176,.8),inset -24px -30px 60px rgba(120,0,60,.45)">
      <div style="position:absolute;inset:40px;border-radius:50%;background:repeating-radial-gradient(circle,rgba(255,255,255,.0) 0 16px,rgba(255,255,255,.35) 18px 22px)"></div></div>
    <div style="position:absolute;left:150px;right:150px;top:600px;height:26px;border-radius:13px;background:rgba(255,255,255,.12)"><div data-r="bar" style="height:100%;border-radius:13px;background:linear-gradient(90deg,#ffd0e8,#ff2d75);box-shadow:0 0 24px #ff5fb0"></div></div>
    <div style="position:absolute;left:0;right:0;top:640px;text-align:center"><span class="chip" data-r="tt" style="background:#fff;color:#c2185b">вкус: сладкий 😋</span></div>`);
  return { el, update(t, p) {
    r.pop.style.transform = `rotate(${(t - c.t0) * 120}deg) scale(${1 + .04 * p})`;
    r.bar.style.width = eio(prog(t, c.t0 + .2, s.taste - c.t0)) * 100 + '%';
    const k = prog(t, s.taste, .4); r.tt.style.opacity = clamp(k * 3); r.tt.style.transform = `scale(${spring(k)})`;
  } };
};

// 11. rocket — flying away, altitude counter
O.rocket = (s, c) => {
  const R = rnd(55);
  const { el, r } = free(900, 720, `
    ${Array.from({ length: 6 }, (_, i) => `<div data-r="c${i}" style="position:absolute;width:${200 + R() * 160}px;height:${80 + R() * 40}px;border-radius:60px;background:rgba(255,255,255,.4);filter:blur(12px)"></div>`).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<div data-r="l${i}" style="position:absolute;width:4px;border-radius:2px;background:linear-gradient(rgba(92,225,255,0),#5ce1ff)"></div>`).join('')}
    <div data-r="rk" style="position:absolute;left:330px;top:200px;font-size:240px;line-height:1;transform-origin:center">🚀</div>
    <div style="position:absolute;left:0;right:0;top:560px;text-align:center"><div class="big" style="font-size:96px;text-shadow:0 0 30px #5ce1ff"><span data-r="n">0</span><span style="font-size:44px"> м</span></div></div>`);
  const cl = Array.from({ length: 6 }, () => ({ x: R() * 800 - 80, y: R() * 600, v: 500 + R() * 400 }));
  const ln = Array.from({ length: 12 }, () => ({ x: 100 + R() * 700, l: 60 + R() * 160, v: 1200 + R() * 800, o: R() * 2 }));
  return { el, update(t, p) {
    const k = prog(t, s.go, 2.1);
    r.rk.style.transform = `translate(${Math.sin(t * 30) * 4 * (k > 0)}px, ${-eio(k) * 60 + Math.sin(t * 3) * 10}px) rotate(-45deg) scale(${1 + .04 * p})`;
    r.n.textContent = Math.round(eio(k) * 10000).toLocaleString('ru-RU');
    cl.forEach((q, i) => { const y = ((q.y + (t - c.t0) * q.v * (.3 + k)) % 800) - 100; r['c' + i].style.transform = `translate(${q.x}px, ${y}px)`; });
    ln.forEach((q, i) => { const y = (((t + q.o) * q.v) % 900) - 150; const n = r['l' + i]; n.style.height = q.l + 'px'; n.style.transform = `translate(${q.x}px, ${y}px)`; n.style.opacity = clamp(k * 4); });
  } };
};

// 12. floating thoughts merge into one
O.thoughts = (s, c) => {
  const items = [['?', -280, -150, 150], ['где?', 230, -190, 170], ['она', -250, 120, 160], ['…', 270, 110, 140], ['💭', 0, -260, 140], ['❓', 0, 200, 130]];
  const { el, r } = free(900, 700, `
    ${items.map((it, i) => `<div data-r="b${i}" style="position:absolute;left:450px;top:330px;width:${it[3]}px;height:${it[3]}px;margin:${-it[3] / 2}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.35),rgba(192,139,255,.18));border:3px solid rgba(255,255,255,.6);box-shadow:0 0 30px #7a3dff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:${it[0].length > 2 ? 38 : 60}px">${it[0]}</div>`).join('')}
    <div data-r="spin" style="position:absolute;left:390px;top:270px;width:120px;height:120px;border-radius:50%;border:10px solid rgba(255,255,255,.15);border-top-color:#2be3ff;box-shadow:0 0 30px #2be3ff"></div>
    <div data-r="hz" style="position:absolute;left:450px;top:330px;font-size:230px;line-height:1;width:300px;height:300px;margin:-150px;text-align:center">💜</div>
    <div style="position:absolute;left:0;right:0;top:620px;text-align:center"><span class="chip" data-r="st" style="background:rgba(255,255,255,.12);border:2px solid #2be3ff;box-shadow:0 0 20px #2be3ff">мысли: поиск…</span></div>`);
  return { el, update(t, p) {
    const m = eio(prog(t, s.merge - .15, .5));
    items.forEach((it, i) => { const a = prog(t, c.t0 + i * .25, .5); const x = it[1] + Math.sin(t * 1.1 + i) * 26, y = it[2] + Math.cos(t * .9 + i * 2) * 22;
      r['b' + i].style.opacity = clamp(a * 3) * (1 - m); r['b' + i].style.transform = `translate(${x * (1 - m)}px, ${y * (1 - m)}px) scale(${spring(a) * (1 - m * .7)})`; });
    r.spin.style.transform = `rotate(${t * 400}deg)`; r.spin.style.opacity = 1 - prog(t, s.merge - .2, .2);
    const h = prog(t, s.merge, .5); r.hz.style.opacity = clamp(h * 3); r.hz.style.transform = `scale(${spring(h) * (1 + .08 * p)})`;
    r.st.textContent = t >= s.merge ? 'половина найдена 💜' : 'мысли: поиск…';
  } };
};

// 13. hands pulling together
O.hands = (s, c) => {
  const { el, r } = free(900, 640, `
    <svg width="900" height="400" style="position:absolute;top:120px;overflow:visible"><path data-r="rope" fill="none" stroke="#ff2d75" stroke-width="8" stroke-linecap="round" style="filter:drop-shadow(0 0 10px #ff2d75)"/></svg>
    <div data-r="L" style="position:absolute;left:0;top:220px;font-size:190px;line-height:1">🫱</div>
    <div data-r="R" style="position:absolute;left:0;top:220px;font-size:190px;line-height:1">🫲</div>
    <div data-r="sh" style="position:absolute;left:330px;top:180px;font-size:240px;line-height:1">🤝</div>
    <div style="position:absolute;left:0;right:0;top:560px;text-align:center"><span class="chip" data-r="st" style="background:#fff;color:#c2185b">тянет: <span data-r="n">0</span>%</span></div>`);
  const b = burst(el, 13, 16, ['💗', '✨', '💞'], 450, 300, s.snap, { size: 50, speed: 700 });
  return { el, update(t, p) {
    const k = eio(prog(t, s.pull, s.snap - s.pull)); const sn = prog(t, s.snap, .4);
    const gap = lerp(330, 110, k) * (1 - eo(sn));
    const lx = 450 - gap - 95, rx = 450 + gap - 95;
    const wob = Math.sin(t * 18) * 6 * (k > 0 && sn === 0);
    r.L.style.transform = `translate(${lx + wob}px, 0) rotate(${-8 + Math.sin(t * 3) * 4}deg)`; r.R.style.transform = `translate(${rx - wob}px, 0) rotate(${8 - Math.sin(t * 3) * 4}deg)`;
    r.L.style.opacity = r.R.style.opacity = 1 - clamp(sn * 3);
    const sag = lerp(80, 0, k) + Math.sin(t * 4) * 8;
    r.rope.setAttribute('d', `M${lx + 150} 200 Q450 ${200 + sag} ${rx + 40} 200`); r.rope.style.opacity = 1 - clamp(sn * 3);
    r.sh.style.opacity = clamp(sn * 3); r.sh.style.transform = `scale(${spring(sn) * (1 + .06 * p)})`;
    r.n.textContent = t >= s.snap ? 100 : Math.round(lerp(30, 95, k));
    b(t);
  } };
};

// 14. ECG heartbeat — veins on fire
O.ecg = (s, c) => {
  const { el, r } = free(1000, 700, `
    <div data-r="ht" style="position:absolute;left:350px;top:0;width:300px;height:300px;font-size:240px;line-height:300px;text-align:center">❤️</div>
    <svg width="1000" height="260" viewBox="0 0 1000 260" style="position:absolute;top:300px;overflow:visible"><path data-r="ln" fill="none" stroke="#ff3b4f" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 10px #ff3b4f) drop-shadow(0 0 26px #ff3b4f)"/></svg>
    <div style="position:absolute;left:0;right:0;top:590px;text-align:center"><span class="big" style="font-size:90px;text-shadow:0 0 30px #ff3b4f"><span data-r="n">120</span></span><span style="font-size:36px;font-weight:800;opacity:.75"> уд/мин</span></div>`);
  return { el, update(t, p) {
    r.ht.style.transform = `scale(${1 + .22 * p})`;
    const span = 2.4, N = 200; let d = '';
    for (let i = 0; i <= N; i++) {
      const u = i / N; const tt = t - span + u * span;
      let y = 130;
      // spikes on beat grid
      for (const bt of window.__GRID) { const dt = tt - bt; if (dt > -.08 && dt < .2) { y += dt < 0 ? 18 * Math.sin(Math.PI * (dt + .08) / .08) : dt < .05 ? -110 * Math.sin(Math.PI * dt / .05) * (1 + .4 * prog(t, s.vein, .5)) : dt < .1 ? 60 * Math.sin(Math.PI * (dt - .05) / .05) : -14 * Math.sin(Math.PI * (dt - .1) / .1); } }
      const fade = u; d += (i ? 'L' : 'M') + (u * 1000).toFixed(1) + ' ' + y.toFixed(1);
    }
    r.ln.setAttribute('d', d);
    r.n.textContent = Math.round(lerp(120, 186, eio(prog(t, c.t0, s.vein - c.t0 + .5))));
  } };
};

window.OBJECTS = O;
})();
