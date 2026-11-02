// engine/toon.js — the Toon character rig: big round black head on a thin neck, filled hoodie torso
// (hood, drawstrings, kangaroo pocket, cuffs), coloured sleeves with round black hands, track pants with a
// side stripe, white sneakers, and a cream edge line on the lit side. Uses the same 11-point skeleton as
// rig2d.js, so POSES, posesAt, posesSpring, walkPose and breathe all work unchanged.
// Local space: feet on y=0, up is -y, the figure faces +x. Full height ≈ 250 units at s = 1.
import { E, S, clamp, lerp, seg, circle, ring, alpha, shade, mix, rr, poly, FONTS } from './core.js';
import { POSES } from './rig2d.js';

const TK = () => S().toon || { pants: '#262a33', stripe: '#efe4c4', shoe: '#f4f4f0', sole: '#c9c6bf', hand: S().ink, hair: '#1c1612', shadow: 'rgba(25,28,36,.26)' };
const HEAD_R = 30, NECK = 15, ARM_W = 14.5, LEG_W = 15.5;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
const unit = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
const along = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

// head centre in local space: pushed up along the neck so a thin neck shows under the big head
function headC(p, hs = 1) { const d = unit(sub(p.head, p.sh)); return add(p.sh, mul(d, NECK + HEAD_R * hs)); }

// ---------- faces ----------
// Expressions: neutral smile grin happy joy surprised shocked scared worried nervous angry determined sad cry
//              smirk sly squint wince sleepy thinking confused awe excited
export const TEXPR = {
  neutral: { eyes: 'oval', mouth: 'smile' }, smile: { eyes: 'oval', mouth: 'bigSmile' }, grin: { eyes: 'oval', mouth: 'grin' },
  happy: { eyes: 'arc', mouth: 'grin' }, joy: { eyes: 'arc', mouth: 'grinBig', brows: 'up' }, excited: { eyes: 'star', mouth: 'grinBig' },
  surprised: { eyes: 'round', mouth: 'o', brows: 'up' }, shocked: { eyes: 'roundBig', mouth: 'oBig', brows: 'up' }, awe: { eyes: 'round', mouth: 'o' },
  scared: { eyes: 'roundBig', mouth: 'wavy', brows: 'worried' }, worried: { eyes: 'oval', mouth: 'wavy', brows: 'worried' },
  nervous: { eyes: 'oval', mouth: 'flat', brows: 'worried', sweat: true }, angry: { eyes: 'oval', mouth: 'frown', brows: 'angry' },
  determined: { eyes: 'half', mouth: 'flat', brows: 'angry' }, sad: { eyes: 'oval', mouth: 'frown', brows: 'worried' },
  cry: { eyes: 'arcDown', mouth: 'frown', brows: 'worried', tears: true }, smirk: { eyes: 'oval', mouth: 'smirk' }, sly: { eyes: 'half', mouth: 'smirk' },
  squint: { eyes: 'chevron', mouth: 'grin' }, wince: { eyes: 'chevron', mouth: 'wavy' }, sleepy: { eyes: 'line', mouth: 'flat' },
  thinking: { eyes: 'oval', mouth: 'flatSmall', brows: 'one', look: [0.6, -0.7] }, confused: { eyes: 'oval', mouth: 'wavy', brows: 'one' },
};
// toonFace(g, hx, hy, r, { expr, talk, blink, look:[x,y], front, side:1|-1, color })
export function toonFace(g, hx, hy, r, o = {}) {
  const ex = { ...(TEXPR[o.expr] || TEXPR.neutral), ...(o.override || {}) };
  const col = o.color || S().feature, ink = S().ink, sd = o.side ?? 1;
  const look = o.look || ex.look || [0, 0];
  const fx = hx + (o.front ? 0 : sd * r * 0.3) + look[0] * r * 0.08, fy = hy + look[1] * r * 0.06;
  const gap = o.front ? r * 0.27 : r * 0.21, ey = fy - r * 0.06;
  const eyes = [[fx - gap, 0.9], [fx + gap, 1]].map(([x, k]) => [x, o.front ? 1 : (sd > 0 ? k : 1.9 - k)]);
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  const lw = r * 0.075;
  for (const [x, k] of eyes) {
    const ew = r * 0.085 * k, eh = r * 0.13;
    if (o.blink || ex.eyes === 'line') { seg(g, [[x - ew * 1.3, ey], [x + ew * 1.3, ey]], lw, col); continue; }
    g.fillStyle = col; g.strokeStyle = col; g.lineWidth = lw;
    switch (ex.eyes) {
      case 'arc': g.beginPath(); g.arc(x, ey + eh * 0.5, ew * 1.4, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); break;
      case 'arcDown': g.beginPath(); g.arc(x, ey - eh * 0.4, ew * 1.4, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); break;
      case 'round': g.beginPath(); g.ellipse(x, ey, ew * 1.35, eh * 1.15, 0, 0, Math.PI * 2); g.fill(); break;
      case 'roundBig': g.beginPath(); g.ellipse(x, ey, ew * 1.7, eh * 1.4, 0, 0, Math.PI * 2); g.fill(); circle(g, x + look[0] * ew * 0.4, ey + look[1] * eh * 0.3, ew * 0.55, ink); break;
      case 'half': g.save(); g.beginPath(); g.rect(x - ew * 2, ey - eh * 0.15, ew * 4, eh * 2); g.clip(); g.beginPath(); g.ellipse(x, ey, ew * 1.1, eh, 0, 0, Math.PI * 2); g.fill(); g.restore(); seg(g, [[x - ew * 1.3, ey - eh * 0.2], [x + ew * 1.3, ey - eh * 0.2]], lw * 0.8, col); break;
      case 'chevron': { const d = (x < fx ? 1 : -1); g.beginPath(); g.moveTo(x - d * ew * 1.2, ey - eh * 0.8); g.lineTo(x + d * ew * 1.0, ey); g.lineTo(x - d * ew * 1.2, ey + eh * 0.8); g.stroke(); break; }
      case 'star': { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? eh * 0.45 : eh * 1.15; g.lineTo(x + Math.cos(a) * rr2, ey + Math.sin(a) * rr2); } g.closePath(); g.fill(); break; }
      default: g.beginPath(); g.ellipse(x, ey, ew, eh, 0, 0, Math.PI * 2); g.fill();
    }
  }
  const by = ey - r * 0.27, bw = r * 0.13;
  const brow = (x, a) => seg(g, [[x - bw, by + a], [x + bw, by - a]], lw * 0.85, col);
  if (ex.brows === 'worried') { brow(eyes[0][0], r * 0.05); brow(eyes[1][0], -r * 0.05); }   // inner ends raised
  if (ex.brows === 'angry') { brow(eyes[0][0], -r * 0.06); brow(eyes[1][0], r * 0.06); }    // inner ends lowered
  if (ex.brows === 'up') eyes.forEach(([x]) => seg(g, [[x - bw, by - r * 0.04], [x + bw, by - r * 0.04]], lw * 0.85, col));
  if (ex.brows === 'one') { brow(eyes[0][0], 0); seg(g, [[eyes[1][0] - bw, by - r * 0.1], [eyes[1][0] + bw, by - r * 0.04]], lw * 0.85, col); }
  const mx = fx + (o.front ? 0 : sd * r * 0.03), my = fy + r * 0.34, talk = o.talk || 0;
  g.fillStyle = col; g.strokeStyle = col; g.lineWidth = lw;
  if (talk > 0.05) { g.beginPath(); g.ellipse(mx, my, r * 0.13, r * (0.04 + 0.15 * talk), 0, 0, Math.PI * 2); g.fill(); }
  else switch (ex.mouth) {
    case 'bigSmile': g.beginPath(); g.arc(mx, my - r * 0.16, r * 0.2, 0.45, Math.PI - 0.45); g.stroke(); break;
    case 'grin': g.beginPath(); g.moveTo(mx - r * 0.17, my - r * 0.05); g.quadraticCurveTo(mx, my + r * 0.24, mx + r * 0.17, my - r * 0.05); g.closePath(); g.fill(); break;
    case 'grinBig': g.beginPath(); g.moveTo(mx - r * 0.24, my - r * 0.08); g.quadraticCurveTo(mx, my + r * 0.34, mx + r * 0.24, my - r * 0.08); g.closePath(); g.fill(); break;
    case 'o': g.beginPath(); g.ellipse(mx, my, r * 0.07, r * 0.095, 0, 0, Math.PI * 2); g.fill(); break;
    case 'oBig': g.beginPath(); g.ellipse(mx, my + r * 0.02, r * 0.11, r * 0.15, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = ink; g.beginPath(); g.ellipse(mx, my + r * 0.04, r * 0.055, r * 0.09, 0, 0, Math.PI * 2); g.fill(); break;
    case 'flat': seg(g, [[mx - r * 0.13, my], [mx + r * 0.13, my]], lw, col); break;
    case 'flatSmall': seg(g, [[mx - r * 0.08, my], [mx + r * 0.08, my]], lw, col); break;
    case 'frown': g.beginPath(); g.arc(mx, my + r * 0.16, r * 0.15, Math.PI + 0.55, Math.PI * 2 - 0.55); g.stroke(); break;
    case 'smirk': g.beginPath(); g.moveTo(mx - r * 0.12, my); g.quadraticCurveTo(mx + r * 0.04, my + r * 0.06, mx + r * 0.17, my - r * 0.07); g.stroke(); break;
    case 'wavy': { g.beginPath(); for (let i = 0; i <= 14; i++) { const u = i / 14, x = mx - r * 0.17 + u * r * 0.34, y = my + Math.sin(u * Math.PI * 3) * r * 0.035; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); break; }
    default: g.beginPath(); g.arc(mx, my - r * 0.11, r * 0.14, 0.45, Math.PI - 0.45); g.stroke();
  }
  if (ex.tears) { g.fillStyle = '#8fd0ff'; for (const [x] of eyes) { g.beginPath(); g.ellipse(x, ey + r * 0.26, r * 0.045, r * 0.09, 0, 0, Math.PI * 2); g.fill(); } }
  if (ex.sweat) { g.fillStyle = '#9fd8ff'; g.beginPath(); g.ellipse(hx - sd * r * 0.62, hy - r * 0.42, r * 0.075, r * 0.12, 0, 0, Math.PI * 2); g.fill(); }
  g.restore();
}

// ---------- outfits ----------
// outfit = { top: 'hoodie'|'tee'|'jacket'|'sweater'|'tank'|'none', color, color2 (trim/second colour),
//            pants: colour, stripe: colour|false, shoes: colour,
//            head: 'cap'|'capBack'|'beanie'|'headband'|'hood'|'afro'|'bun'|'ponytail'|'short'|'spiky'|'headgear'|'none', headColor, hairColor,
//            face: 'glasses'|'sunglasses'|null, gloves: colour (boxing gloves) | null, headphones: colour (around the neck), kid: bool }
const isHood = (o) => (o.top || 'hoodie') === 'hoodie';
function headwear(g, o, hx, hy, r, C, layer) {
  const c = o.headColor || '#f08a2c', hair = o.hairColor || TK().hair;
  const cc = C(c), dk = C(shade(c, -0.22)), hi = C(shade(c, 0.25)), hr = C(hair), sd = 1;
  switch (o.head) {
    case 'cap': case 'capBack': {
      if (layer !== 'front') return;
      const b = o.head === 'capBack' ? -1 : 1;
      g.fillStyle = cc; g.beginPath(); g.ellipse(hx - sd * r * 0.04, hy - r * 0.3, r * 1.03, r * 0.8, 0, Math.PI, Math.PI * 2); g.fill();
      g.fillStyle = dk; g.beginPath(); g.moveTo(hx + b * r * 0.35, hy - r * 0.42); g.quadraticCurveTo(hx + b * r * 1.25, hy - r * 0.5, hx + b * r * 1.55, hy - r * 0.28); g.lineTo(hx + b * r * 0.3, hy - r * 0.22); g.closePath(); g.fill();
      if (!o._sil) { g.strokeStyle = alpha(shade(c, 0.35), 0.9); g.lineWidth = r * 0.07; g.beginPath(); g.ellipse(hx - r * 0.12, hy - r * 0.42, r * 0.62, r * 0.45, 0, Math.PI * 1.15, Math.PI * 1.55); g.stroke(); circle(g, hx - r * 0.04, hy - r * 1.08, r * 0.09, dk); }
      break; }
    case 'beanie': if (layer !== 'front') return;
      g.fillStyle = cc; g.beginPath(); g.ellipse(hx, hy - r * 0.22, r * 1.05, r * 0.98, 0, Math.PI, Math.PI * 2); g.fill();
      rr(g, hx - r * 1.08, hy - r * 0.38, r * 2.16, r * 0.34, r * 0.14); g.fillStyle = dk; g.fill(); break;
    case 'headband': {
      if (layer === 'back') { g.strokeStyle = cc; g.lineWidth = r * 0.17; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx - r * 0.85, hy - r * 0.4); g.quadraticCurveTo(hx - r * 1.45, hy - r * 0.45, hx - r * 1.7, hy - r * 0.05); g.stroke(); g.beginPath(); g.moveTo(hx - r * 0.85, hy - r * 0.36); g.quadraticCurveTo(hx - r * 1.35, hy - r * 0.15, hx - r * 1.5, hy + r * 0.25); g.stroke(); return; }
      if (layer !== 'front') return;
      g.save(); g.beginPath(); g.arc(hx, hy, r * (o._sil ? 1.08 : 1.02), 0, Math.PI * 2); g.clip(); g.fillStyle = cc; g.beginPath(); g.moveTo(hx - r * 1.2, hy - r * 0.62); g.lineTo(hx + r * 1.2, hy - r * 0.48); g.lineTo(hx + r * 1.2, hy - r * 0.22); g.lineTo(hx - r * 1.2, hy - r * 0.34); g.closePath(); g.fill(); g.restore(); break; }
    case 'headgear': if (layer !== 'front') return;
      g.save(); g.beginPath(); g.arc(hx, hy, r * 1.12, 0, Math.PI * 2); g.arc(hx + r * 0.36, hy + r * 0.04, r * 0.74, 0, Math.PI * 2, true); g.fillStyle = cc; g.fill('evenodd'); g.restore();
      if (!o._sil) { g.strokeStyle = dk; g.lineWidth = r * 0.08; g.beginPath(); g.arc(hx + r * 0.36, hy + r * 0.04, r * 0.78, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(hx - r * 0.1, hy - r * 0.3, r * 0.82, Math.PI * 1.05, Math.PI * 1.6); g.strokeStyle = alpha(hi, 0.7); g.stroke(); }
      break;
    case 'hood': {
      const hc = o.headColor || o.color || '#3f9a5a';
      if (layer === 'back') { circle(g, hx - r * 0.12, hy + r * 0.04, r * 1.22, C(shade(hc, -0.08))); return; }
      if (layer === 'front' && !o._sil) { g.strokeStyle = shade(hc, 0.12); g.lineWidth = r * 0.16; g.beginPath(); g.arc(hx - r * 0.12, hy + r * 0.04, r * 1.12, Math.PI * 0.75, Math.PI * 1.7); g.stroke(); }
      break; }
    case 'afro': if (layer === 'back') { g.fillStyle = hr; for (let i = 0; i < 11; i++) { const a = Math.PI * (0.78 + i * 0.13); circle(g, hx - r * 0.08 + Math.cos(a) * r * 0.98, hy - r * 0.1 + Math.sin(a) * r * 0.98, r * (0.36 + 0.05 * Math.sin(i * 2.3)), hr); } circle(g, hx - r * 0.1, hy - r * 0.25, r * 1.05, hr); }
      break;
    case 'bun': if (layer === 'back') { circle(g, hx - r * 0.25, hy - r * 1.05, r * 0.42, hr); } if (layer === 'front' && !o._sil) { g.strokeStyle = alpha('#ffffff', 0.12); g.lineWidth = r * 0.06; g.beginPath(); g.arc(hx - r * 0.25, hy - r * 1.05, r * 0.3, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); } break;
    case 'ponytail': if (layer === 'back') { g.strokeStyle = hr; g.lineWidth = r * 0.42; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx - r * 0.7, hy - r * 0.55); g.quadraticCurveTo(hx - r * 1.65, hy - r * 0.35, hx - r * 1.4, hy + r * 0.75); g.stroke(); } break;
    case 'short': if (layer === 'front') { g.save(); g.beginPath(); g.arc(hx, hy, r * (o._sil ? 1.1 : 1.04), 0, Math.PI * 2); g.clip(); g.fillStyle = hr; g.beginPath(); g.ellipse(hx - r * 0.2, hy - r * 0.62, r * 1.1, r * 0.55, -0.15, 0, Math.PI * 2); g.fill(); g.restore(); } break;
    case 'spiky': if (layer === 'back') { g.fillStyle = hr; g.beginPath(); for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.0 + i * 0.125), rr2 = i % 2 ? r * 1.4 : r * 0.92; g.lineTo(hx + Math.cos(a) * rr2, hy + Math.sin(a) * rr2); } g.closePath(); g.fill(); } break;
  }
}

function legPath(p, near) { const h = p.hip, k = near ? p.kF : p.kB, f = near ? p.fF : p.fB; return [h, k, [f[0], f[1] - 6]]; }
function offsetLine(pts, d) {
  return pts.map((pt, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], u = unit(sub(b, a)); return [pt[0] - u[1] * d, pt[1] + u[0] * d]; });
}
function shoe(g, f, C, col, sole, grow, sil) {
  const x = f[0] - 9 - grow, y = f[1] - 11 - grow, w = 28 + grow * 2, h = 11 + grow * 2;
  g.fillStyle = C(col); g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + 3); g.quadraticCurveTo(x, y, x + 6, y); g.lineTo(x + w * 0.55, y + 1); g.quadraticCurveTo(x + w, y + h * 0.35, x + w, y + h - 2); g.lineTo(x + w, y + h); g.closePath(); g.fill();
  if (!sil) { g.fillStyle = sole; g.fillRect(x, y + h - 3, w, 3); }
}
function sleevePath(sh, e, h) { return [sh, e, along(e, h, 0.8)]; }

// one full pass of the body. sil = silhouette pass (edge light): everything in one colour, grown by `grow`.
function parts(g, o, p, of, sil, rimCol = '#fff', grow = 0) {
  const tk = TK(), ink = o.ink || S().ink, C = (c) => (sil ? rimCol : c), G = grow;
  const hs = of.kid ? 1.18 : 1, HR = HEAD_R * hs, hc = headC(p, hs);
  const top = of.top || 'hoodie', col = of.color || '#3f9a5a', dark = shade(col, -0.32), line = shade(col, -0.5);
  const pants = of.pants || tk.pants, stripe = of.stripe === false ? null : of.stripe || tk.stripe, shoeC = of.shoes || tk.shoe;
  const handC = tk.hand || ink, sleeveOf = top === 'tank' || top === 'none' ? null : top === 'tee' ? 'short' : 'long';
  const ofx = { ...of, _sil: sil };
  // --- far side (behind the torso): far arm, far leg
  const farArm = () => {
    const pts = sleevePath(p.sh, p.eB, p.hB);
    if (sleeveOf === 'long') { if (!sil) seg(g, pts, ARM_W + 2.6, shade(line, -0.1)); seg(g, pts, ARM_W + G * 2, C(shade(col, -0.2))); }
    else { seg(g, [p.sh, p.eB, p.hB], ARM_W - 3 + G * 2, C(shade(ink, 0.05))); if (sleeveOf === 'short') seg(g, [p.sh, along(p.sh, p.eB, 0.6)], ARM_W + 1 + G * 2, C(shade(col, -0.2))); }
    if (of.gloves) circle(g, p.hB[0], p.hB[1], 12 + G, C(shade(of.gloves, -0.2))); else circle(g, p.hB[0], p.hB[1], 7.4 + G, C(shade(handC, 0.06)));
  };
  const leg = (near) => {
    const pts = legPath(p, near), pc = near ? pants : shade(pants, -0.18);
    if (!sil) seg(g, pts, LEG_W + 2.4, shade(pants, -0.45));
    seg(g, pts, LEG_W + G * 2, C(pc));
    if (!sil && stripe) seg(g, offsetLine(pts, -(LEG_W / 2 - 2.2)), 2.2, near ? stripe : shade(stripe, -0.2), 'butt');
    shoe(g, near ? p.fF : p.fB, C, near ? shoeC : shade(shoeC, -0.12), tk.sole, G, sil);
  };
  farArm(); leg(false); leg(true);
  // --- back hair / hood up / headband tails
  headwear(g, ofx, hc[0], hc[1], HR + G, C, 'back');
  // --- torso
  const u = unit(sub(p.hip, p.sh)), n = [-u[1], u[0]];       // n points to the figure's back (-x) when upright
  const tw = 21 + G, bw = 20 + G, s0 = add(p.sh, mul(u, -2 - G)), b0 = add(p.hip, mul(u, (top === 'tee' || top === 'tank' ? 4 : 13) + G));
  const P1 = add(s0, mul(n, tw)), P2 = add(s0, mul(n, -tw)), P3 = add(b0, mul(n, -bw)), P4 = add(b0, mul(n, bw));
  const torso = () => { g.beginPath(); g.moveTo(P1[0] + u[0] * 9, P1[1] + u[1] * 9); g.quadraticCurveTo(P1[0], P1[1], (P1[0] + P2[0]) / 2 - u[0] * 3, (P1[1] + P2[1]) / 2 - u[1] * 3); g.quadraticCurveTo(P2[0], P2[1], P2[0] + u[0] * 9, P2[1] + u[1] * 9); g.lineTo(P3[0], P3[1]); g.lineTo(P4[0], P4[1]); g.closePath(); };
  if (top !== 'none') {
    // neck goes under the hood/collar
    seg(g, [add(p.sh, mul(u, 2)), along(p.sh, hc, 0.75)], 8 + G * 2, C(ink));
    if (isHood(of) && of.head !== 'hood') { g.fillStyle = C(shade(col, -0.16)); g.beginPath(); g.ellipse(p.sh[0] + n[0] * 8 - u[0] * 3, p.sh[1] + n[1] * 8 - u[1] * 3, 16 + G, 10 + G, Math.atan2(n[1], n[0]), 0, Math.PI * 2); g.fill(); }
    g.fillStyle = C(top === 'tank' ? col : col); torso(); g.fill();
    if (!sil) {
      g.strokeStyle = line; g.lineWidth = 2.2; torso(); g.stroke();
      g.save(); torso(); g.clip();
      // soft shading on the back side + hem band
      g.fillStyle = alpha(dark, 0.45); g.beginPath(); g.moveTo(P1[0], P1[1]); g.lineTo(P4[0], P4[1]); g.lineTo(P4[0] - n[0] * 9, P4[1] - n[1] * 9); g.lineTo(P1[0] - n[0] * 7, P1[1] - n[1] * 7); g.closePath(); g.fill();
      if (top === 'hoodie' || top === 'sweater') { const h0 = add(b0, mul(u, -7)); g.fillStyle = shade(col, -0.18); g.beginPath(); g.moveTo(P4[0], P4[1]); g.lineTo(P3[0], P3[1]); g.lineTo(h0[0] - n[0] * 30, h0[1] - n[1] * 30); g.lineTo(h0[0] + n[0] * 30, h0[1] + n[1] * 30); g.closePath(); g.fill(); }
      if (top === 'hoodie') {   // kangaroo pocket on the front-lower torso
        const pc = add(along(p.sh, p.hip, 0.78), mul(n, -4)); const pw = 14, ph = 11;
        g.fillStyle = shade(col, -0.1); g.strokeStyle = alpha(line, 0.7); g.lineWidth = 1.6;
        g.beginPath(); g.moveTo(pc[0] - n[0] * pw - u[0] * ph * 0.4, pc[1] - n[1] * pw - u[1] * ph * 0.4); g.lineTo(pc[0] + n[0] * pw * 0.8 - u[0] * ph, pc[1] + n[1] * pw * 0.8 - u[1] * ph); g.lineTo(pc[0] + n[0] * pw + u[0] * ph, pc[1] + n[1] * pw + u[1] * ph); g.lineTo(pc[0] - n[0] * pw * 1.1 + u[0] * ph, pc[1] - n[1] * pw * 1.1 + u[1] * ph); g.closePath(); g.fill(); g.stroke();
      }
      if (top === 'jacket') { seg(g, [add(s0, mul(n, -6)), add(b0, mul(n, -6))], 2, of.color2 || shade(col, 0.4)); }
      if (top === 'tee' && of.color2) { seg(g, [add(along(p.sh, p.hip, 0.35), mul(n, 14)), add(along(p.sh, p.hip, 0.35), mul(n, -14))], 6, of.color2); }
      g.restore();
      if (top === 'hoodie') {   // drawstrings
        for (const d of [-4, -11]) { const a = add(add(p.sh, mul(u, 3)), mul(n, d)); seg(g, [a, add(a, mul(u, 24))], 1.8, alpha('#ffffff', 0.92)); }
      }
    }
  } else { seg(g, [p.sh, p.hip], 15 + G * 2, C(ink)); seg(g, [p.sh, along(p.sh, hc, 0.75)], 8 + G * 2, C(ink)); }
  if (of.headphones && !sil) { const a = add(p.sh, mul(u, 2)); g.strokeStyle = shade(of.headphones, -0.3); g.lineWidth = 3; g.beginPath(); g.ellipse(a[0], a[1] - 2, 13, 6, 0, 0, Math.PI); g.stroke(); circle(g, a[0] + 11, a[1] + 1, 6.5, of.headphones); circle(g, a[0] - 11, a[1] - 1, 6, shade(of.headphones, -0.2)); }
  // --- head
  circle(g, hc[0], hc[1], HR + G, C(ink));
  headwear(g, ofx, hc[0], hc[1], HR + G * 0.5, C, 'front');
  if (!sil) {
    toonFace(g, hc[0], hc[1], HR, { expr: o.expr, talk: o.talk, blink: o.blink, look: o.look, override: o.face });
    if (of.face === 'glasses') { g.strokeStyle = S().feature; g.lineWidth = 2.2; for (const dx of [0.08, 0.5]) { g.beginPath(); g.arc(hc[0] + HR * dx, hc[1] - HR * 0.06, HR * 0.2, 0, Math.PI * 2); g.stroke(); } }
    if (of.face === 'sunglasses') { g.fillStyle = '#05060a'; rr(g, hc[0] - HR * 0.05, hc[1] - HR * 0.24, HR * 0.38, HR * 0.3, HR * 0.1); g.fill(); rr(g, hc[0] + HR * 0.38, hc[1] - HR * 0.24, HR * 0.36, HR * 0.3, HR * 0.1); g.fill(); g.fillStyle = 'rgba(160,230,255,.7)'; g.fillRect(hc[0] + HR * 0.02, hc[1] - HR * 0.19, HR * 0.1, HR * 0.05); }
  }
  // --- near arm (on top of the torso)
  const pts = sleevePath(p.sh, p.eF, p.hF);
  if (sleeveOf === 'long') { if (!sil) seg(g, pts, ARM_W + 2.6, line); seg(g, pts, ARM_W + G * 2, C(col)); if (!sil) seg(g, [along(pts[1], pts[2], 0.82), pts[2]], ARM_W, shade(col, -0.14)); }
  else { seg(g, [p.sh, p.eF, p.hF], ARM_W - 3 + G * 2, C(ink)); if (sleeveOf === 'short') { if (!sil) seg(g, [p.sh, along(p.sh, p.eF, 0.62)], ARM_W + 3.6, line); seg(g, [p.sh, along(p.sh, p.eF, 0.6)], ARM_W + 1 + G * 2, C(col)); } }
  if (of.gloves) { circle(g, p.hF[0], p.hF[1], 12.5 + G, C(of.gloves)); if (!sil) { g.strokeStyle = alpha('#ffffff', 0.35); g.lineWidth = 2; g.beginPath(); g.arc(p.hF[0] - 2, p.hF[1] - 2, 8, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); } }
  else circle(g, p.hF[0], p.hF[1], 7.6 + G, C(handC));
  if (o.prop) toonProp(g, o.prop, p, sil, C, G, o.facing ?? 1);
}

// ---------- props held in the hands ----------
// 'phone' | {type:'sign', text, w, h} | 'cash' | 'headphones' | 'box' | 'cup' | 'book' | 'mic' | {type, hand:'B'}
export function toonProp(g, prop, p, sil = false, C = (c) => c, G = 0, facing = 1) {
  const t = typeof prop === 'string' ? { type: prop } : prop, h = t.hand === 'B' ? p.hB : p.hF, ink = S().ink;
  switch (t.type) {
    case 'sign': {
      const w = t.w || 92, hh = t.h || 46, cx = (p.hF[0] + p.hB[0]) / 2 + (t.dx || 8), cy = (p.hF[1] + p.hB[1]) / 2 - hh * 0.25 + (t.dy || 0);
      g.save(); g.translate(cx, cy); g.rotate(t.rot ?? -0.04); if (facing < 0) g.scale(-1, 1);
      rr(g, -w / 2 - G, -hh / 2 - G, w + G * 2, hh + G * 2, 4); g.fillStyle = C(t.color || '#e3c48c'); g.fill();
      if (!sil) { g.strokeStyle = '#b48d58'; g.lineWidth = 2; rr(g, -w / 2, -hh / 2, w, hh, 4); g.stroke(); g.font = `400 ${t.size || 25}px "${FONTS.hand}"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#1d1a16'; g.fillText(t.text || 'SHOW $1', 0, 2); }
      g.restore(); break; }
    case 'cash': g.save(); g.translate(h[0] + 8, h[1] - 6); g.rotate(-0.35); rr(g, -18 - G, -9 - G, 36 + G * 2, 18 + G * 2, 2); g.fillStyle = C('#8fcf86'); g.fill(); if (!sil) { g.strokeStyle = '#4f9a52'; g.lineWidth = 1.6; g.strokeRect(-15, -6, 30, 12); ring(g, 0, 0, 4.5, 1.6, '#4f9a52'); } g.restore(); break;
    case 'phone': rr(g, h[0] - 3 - G, h[1] - 26 - G, 16 + G * 2, 27 + G * 2, 3); g.fillStyle = C('#22232a'); g.fill(); if (!sil) { g.fillStyle = t.glow || '#9fd8ff'; g.fillRect(h[0] - 1, h[1] - 24, 12, 20); } break;
    case 'headphones': { const c = t.color || '#e0883a'; g.strokeStyle = C(shade(c, -0.35)); g.lineWidth = 3.5 + G * 2; g.beginPath(); g.arc(h[0] + 2, h[1] + 14, 16, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
      for (const dx of [-15, 17]) { g.fillStyle = C(c); g.beginPath(); g.ellipse(h[0] + dx, h[1] + 16, 7 + G, 10 + G, 0, 0, Math.PI * 2); g.fill(); if (!sil) { g.strokeStyle = shade(c, -0.35); g.lineWidth = 1.6; g.stroke(); } } break; }
    case 'box': { const w = t.w || 60, hh = t.h || 44, cx = (p.hF[0] + p.hB[0]) / 2 + 6, cy = (p.hF[1] + p.hB[1]) / 2 - 6; rr(g, cx - w / 2 - G, cy - hh / 2 - G, w + G * 2, hh + G * 2, 2); g.fillStyle = C('#c99a62'); g.fill(); if (!sil) { g.fillStyle = '#b5864f'; g.fillRect(cx - 4, cy - hh / 2, 8, hh); } break; }
    case 'cup': rr(g, h[0] - 2 - G, h[1] - 20 - G, 15 + G * 2, 20 + G * 2, 2); g.fillStyle = C(t.color || '#f2efe8'); g.fill(); if (!sil) { g.fillStyle = '#c96a3a'; g.fillRect(h[0] - 2, h[1] - 14, 15, 6); } break;
    case 'book': rr(g, h[0] - 4 - G, h[1] - 26 - G, 26 + G * 2, 32 + G * 2, 2); g.fillStyle = C(t.color || '#3a6ea5'); g.fill(); if (!sil) { g.fillStyle = '#f2efe8'; g.fillRect(h[0] + 18, h[1] - 24, 3, 28); } break;
    case 'mic': seg(g, [h, [h[0] + 6, h[1] - 18]], 5 + G * 2, C('#2a2a30')); circle(g, h[0] + 7, h[1] - 22, 7 + G, C('#9a9aa4')); break;
    case 'ball': circle(g, h[0] + 12, h[1] - 6, 13 + G, C(t.color || '#e8783a')); if (!sil) { g.strokeStyle = '#7a3a1a'; g.lineWidth = 1.6; g.beginPath(); g.arc(h[0] + 12, h[1] - 6, 13, 0, Math.PI * 2); g.moveTo(h[0] - 1, h[1] - 6); g.lineTo(h[0] + 25, h[1] - 6); g.stroke(); } break;
  }
}

// ---------- main draw ----------
// drawToon(g, { x, y, s, facing, pose, rot, outfit, expr, talk, blink, look, rim:{dir:[x,y], color, w}|false, alpha, prop, shadow, trail })
export function drawToon(g, o) {
  const st = S(), p = o.pose || POSES.stand, of = o.outfit || {}, s = (o.s ?? 1) * (of.kid ? 0.74 : 1), f = o.facing ?? 1;
  const rim = o.rim === false ? null : { dir: [0.75, -0.65], w: st.rimWidth || 3, color: st.outline || '#f7eccb', ...(o.rim || {}) };
  g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
  if (o.shadow !== false && !o.rot) toonShadow(g, o.x, o.y + 2, 46 * s, 9 * s, o.shadowA);
  const tf = (dx = 0, dy = 0) => { g.translate(o.x + dx, o.y + dy); g.scale(f * s, s); if (o.rot) { g.translate(p.hip[0], p.hip[1]); g.rotate(o.rot); g.translate(-p.hip[0], -p.hip[1]); } };
  if (o.trail) { const { count = 3, dx = -40, dy = 0, a = 0.2 } = o.trail; for (let i = count; i >= 1; i--) { g.save(); g.globalAlpha *= a * (1 - i / (count + 1)); g.translate(dx * i, dy * i); tf(); parts(g, o, p, of, true, rim?.color || '#fff', 0); g.restore(); } }
  if (rim) { g.save(); tf(rim.dir[0] * rim.w * f, rim.dir[1] * rim.w); parts(g, o, p, of, true, rim.color, 1.1); g.restore(); }
  g.save(); tf(); parts(g, o, p, of, false); g.restore();
  g.restore();
}
// soft contact shadow (radial falloff, never a hard ellipse)
export function toonShadow(g, x, y, rx, ry, a) {
  const c = a != null ? `rgba(20,22,30,${a})` : TK().shadow;
  g.save(); g.translate(x, y); g.scale(1, ry / rx); const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, c); gr.addColorStop(0.6, alpha(c, 0.6 * (a ?? 0.26))); gr.addColorStop(1, alpha(c, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill(); g.restore();
}
// world position of the head centre [x, y, r] (for bubbles, rings, labels)
export function toonHeadPos(o) {
  const p = o.pose || POSES.stand, of = o.outfit || {}, s = (o.s ?? 1) * (of.kid ? 0.74 : 1), f = o.facing ?? 1, hs = of.kid ? 1.18 : 1;
  let [x, y] = headC(p, hs);
  if (o.rot) { const [hx, hy] = p.hip, c = Math.cos(o.rot), sn = Math.sin(o.rot); [x, y] = [hx + (x - hx) * c - (y - hy) * sn, hy + (x - hx) * sn + (y - hy) * c]; }
  return [o.x + x * f * s, o.y + y * s, HEAD_R * hs * s];
}

// ---------- giant close-up (head + thin neck + hoodie shoulders) ----------
// bigToon(g, cx, cy, r, { outfit, expr, talk, blink, look, rimColor, rimSide: -1|1, tilt, front, side, glow })
export function bigToon(g, cx, cy, r, o = {}) {
  const st = S(), ink = st.ink, of = o.outfit || {}, col = of.color || '#3f9a5a', rc = o.rimColor || st.outline || '#f7eccb', side = o.rimSide ?? 1;
  const top = of.top || 'hoodie';
  g.save(); g.translate(cx, cy); if (o.tilt) g.rotate(o.tilt);
  if (o.glow) { const gr = g.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 2.2); gr.addColorStop(0, alpha(o.glow, 0.55)); gr.addColorStop(1, alpha(o.glow, 0)); g.fillStyle = gr; g.fillRect(-r * 3, -r * 3, r * 6, r * 6); }
  // shoulders + torso
  const sy = r * 1.36, sw = r * 1.25;
  const body = () => { g.beginPath(); g.moveTo(-sw, r * 3.2); g.lineTo(-sw, sy + r * 0.45); g.quadraticCurveTo(-sw, sy, -sw * 0.55, sy - r * 0.04); g.lineTo(sw * 0.55, sy - r * 0.04); g.quadraticCurveTo(sw, sy, sw, sy + r * 0.45); g.lineTo(sw, r * 3.2); g.closePath(); };
  g.save(); g.translate(side * r * 0.045, -r * 0.03); g.fillStyle = rc; g.scale(1.012, 1.0); body(); g.fill(); g.restore();
  g.fillStyle = top === 'none' ? ink : col; body(); g.fill();
  if (top !== 'none') { g.save(); body(); g.clip(); g.fillStyle = alpha(shade(col, -0.35), 0.5); g.fillRect(-side * sw - r, sy - r, r * 1.35, r * 3); g.restore(); }
  // neck (thin) + rim on it
  rr(g, -r * 0.13 + side * r * 0.03, r * 0.8, r * 0.26, sy - r * 0.6, r * 0.08); g.fillStyle = rc; g.fill();
  rr(g, -r * 0.13, r * 0.8, r * 0.26, sy - r * 0.6, r * 0.08); g.fillStyle = ink; g.fill();
  if (top === 'hoodie') {
    const hc = shade(col, -0.12);
    g.fillStyle = hc; g.beginPath(); g.ellipse(0, sy + r * 0.02, r * 0.62, r * 0.2, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = ink; g.beginPath(); g.ellipse(0, sy - r * 0.02, r * 0.2, r * 0.08, 0, 0, Math.PI * 2); g.fill();
    for (const dx of [-0.16, 0.16]) seg(g, [[dx * r, sy + r * 0.12], [dx * r * 1.1, sy + r * 0.9]], r * 0.035, '#ffffff');
  }
  if (of.headphones) { g.strokeStyle = shade(of.headphones, -0.3); g.lineWidth = r * 0.06; g.beginPath(); g.ellipse(0, sy - r * 0.05, r * 0.5, r * 0.18, 0, 0, Math.PI); g.stroke(); for (const dx of [-0.5, 0.5]) { g.fillStyle = of.headphones; g.beginPath(); g.ellipse(dx * r, sy + r * 0.05, r * 0.16, r * 0.22, 0, 0, Math.PI * 2); g.fill(); } }
  // head with an edge-light crescent on the lit side
  const ofx = { ...of, _sil: false }, Cid = (c) => c;
  headwear(g, ofx, 0, 0, r, Cid, 'back');
  g.save(); g.beginPath(); g.arc(0, 0, r * 1.035, 0, Math.PI * 2); g.arc(-side * r * 0.04, r * 0.01, r, 0, Math.PI * 2, true); g.fillStyle = rc; g.fill('evenodd'); g.restore();
  circle(g, 0, 0, r, ink);
  headwear(g, ofx, 0, 0, r, Cid, 'front');
  toonFace(g, 0, 0, r, { expr: o.expr, talk: o.talk, blink: o.blink, look: o.look, front: o.front ?? true, side: o.side ?? 1, override: o.face });
  if (of.face === 'sunglasses') { g.fillStyle = '#05060a'; rr(g, -r * 0.6, -r * 0.28, r * 0.52, r * 0.34, r * 0.1); g.fill(); rr(g, r * 0.08, -r * 0.28, r * 0.52, r * 0.34, r * 0.1); g.fill(); }
  if (of.face === 'glasses') { g.strokeStyle = st.feature; g.lineWidth = r * 0.05; for (const dx of [-0.28, 0.28]) { g.beginPath(); g.arc(dx * r, -r * 0.06, r * 0.22, 0, Math.PI * 2); g.stroke(); } }
  g.restore();
}

// speech / thought bubble (white, rounded, small tail) for quoted lines
export function toonBubble(g, x, y, str, o = {}) {
  const size = o.size || 34; g.save(); g.font = `800 ${size}px "${FONTS.ui}"`; const w = Math.max(size * 2, g.measureText(str).width + size * 1.2), h = size * 1.9;
  const k = o.k ?? 1; g.translate(x, y); g.scale(k, k);
  g.fillStyle = 'rgba(0,0,0,.18)'; rr(g, -w / 2 + 4, -h + 6, w, h, h / 2.2); g.fill();
  g.fillStyle = o.fill || '#ffffff'; rr(g, -w / 2, -h, w, h, h / 2.2); g.fill();
  g.beginPath(); g.moveTo(-size * 0.4 + (o.tail || 0), -2); g.lineTo(size * 0.1 + (o.tail || 0), size * 0.7); g.lineTo(size * 0.45 + (o.tail || 0), -2); g.fill();
  g.fillStyle = o.color || '#1b1b20'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, -h / 2 + 1); g.restore();
}
