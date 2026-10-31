// sets/theater.js — the Old City Theater. Views: 'stage' (on stage, Mia under the rig), 'hall' (from the back row, stage far + rows of heads).
// The stage spotlight is the key light; everything else is deep warm shadow with dusty velvet.
import { E, V, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, text, rng, FONTS } from '/engine/core.js';
import { ground, floor, label, FX } from './_kit.js';

export const THEATER_MOOD = 'interiorWarm';
const GOLD = '#d9a441', VELVET = '#6a1e2a';

// the lighting rig: truss + 12 lamps. y = truss line. drop: 0..1+ (fall), broken: strands gone
export function rig(g, cx, y, w, t, o = {}) {
  const lamps = 12, c = '#1a1620';
  // cables to the ceiling
  for (const dx of [-w / 2 + 40, w / 2 - 40]) { const n = o.strands ?? 16; for (let k = 0; k < Math.min(n, 4); k++) seg(g, [[cx + dx + k * 3, y - 2000], [cx + dx + k * 3, y]], 2, alpha('#b8b0a0', 0.6)); }
  g.fillStyle = c; g.fillRect(cx - w / 2, y - 18, w, 36);
  g.strokeStyle = alpha('#4a4250', 0.9); g.lineWidth = 4; g.beginPath(); for (let x = cx - w / 2; x < cx + w / 2; x += 36) { g.moveTo(x, y - 18); g.lineTo(x + 18, y + 18); g.lineTo(x + 36, y - 18); } g.stroke();
  for (let i = 0; i < lamps; i++) { const lx = cx - w / 2 + 30 + i * (w - 60) / (lamps - 1), sw = Math.sin(t * 1.3 + i) * (o.sway ?? 0.02);
    g.save(); g.translate(lx, y + 18); g.rotate(sw); g.fillStyle = '#121016'; rr(g, -16, 0, 32, 46, 6); g.fill(); circle(g, 0, 46, 13, o.on === false ? '#3a3440' : '#fff3d0'); g.restore();
    if (o.on !== false) glow(g, lx, y + 64, 60, '#ffd59a', 0.5); }
}

export function stageView(g, t, cam, o = {}) {
  const M = mood(THEATER_MOOD), GY = ground(), CX = E.W / 2;
  const rigY = GY - 760 + (o.rigDrop || 0) * 760;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = '#0c080c'; g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    // back curtain
    g.fillStyle = linGrad(g, 0, -200, 0, GY, [shade(VELVET, -0.6), shade(VELVET, -0.35), shade(VELVET, -0.55)]); g.fillRect(CX - 1300, -400, 2600, GY + 400);
    for (let x = CX - 1300; x < CX + 1300; x += 70) { g.fillStyle = alpha('#000', 0.22); g.fillRect(x, -400, 26, GY + 400); }
    if (o.banner !== false) { g.fillStyle = alpha('#000', 0.4); rr(g, CX - 330, GY - 600, 660, 70, 12); g.fill(); text(g, 'SCHOOL TALENT SHOW', CX, GY - 565, { size: 40, color: alpha(GOLD, 0.85), font: FONTS.title, weight: 700, spacing: 4 }); }
  });
  layer(g, cam, 0.7, (g) => {
    // spotlight cone + rig
    if (o.spot !== false) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [alpha('#fff3d6', 0), alpha('#fff3d6', 0.16)]); g.beginPath(); g.moveTo(CX + (o.spotX || 0) - 60, -E.H); g.lineTo(CX + (o.spotX || 0) + 60, -E.H); g.lineTo(CX + (o.spotX || 0) + 260, GY); g.lineTo(CX + (o.spotX || 0) - 260, GY); g.closePath(); g.fill(); g.restore(); }
    if (o.rig !== false && !(o.rigDrop >= 1)) rig(g, CX, rigY, 1300, t, { on: o.lightsOn, sway: o.sway, strands: o.strands });
  });
  layer(g, cam, 0.9, (g) => {
    // stage floor
    g.fillStyle = linGrad(g, 0, GY - 30, 0, GY + 120, ['#5a3a26', '#3a2418']); g.fillRect(-E.W, GY - 30, E.W * 3, 150);
    for (let x = -E.W; x < E.W * 2; x += 90) seg(g, [[x, GY - 30], [x + (x - CX) * 0.15, GY + 120]], 2, alpha('#000', 0.25));
    g.fillStyle = '#1a0f0c'; g.fillRect(-E.W, GY + 120, E.W * 3, 30);
    if (o.spot !== false) FX.pool(g, CX + (o.spotX || 0), GY + 30, 300, 50, '#fff3d6', 0.45);
    if (o.debris) debris(g, CX, GY + 40, t, o.debris);
    g.fillStyle = '#080506'; g.fillRect(-E.W, GY + 150, E.W * 3, E.H);
    // front row (empty) seats
    for (let x = CX - 1200; x < CX + 1200; x += 120) { rr(g, x, GY + 220, 100, 120, 20); g.fillStyle = shade(VELVET, -0.45); g.fill(); g.fillStyle = alpha(GOLD, 0.15); g.fillRect(x + 6, GY + 222, 88, 3); }
  });
  // gold side curtains (in front)
  layer(g, cam, 1.15, (g) => {
    for (const side of [-1, 1]) { const x0 = CX + side * 1010; g.fillStyle = linGrad(g, x0 - 200, 0, x0 + 200, 0, [shade(GOLD, -0.55), shade(GOLD, -0.2), shade(GOLD, -0.6)]); g.fillRect(x0 - (side < 0 ? 400 : 0) - 200 * (side < 0 ? 1 : 0), -E.H, 600, E.H * 3);
      for (let k = 0; k < 7; k++) { g.fillStyle = alpha('#000', 0.18); g.fillRect(x0 - 180 + k * 70 + (side < 0 ? -200 : 0), -E.H, 22, E.H * 3); } }
    g.fillStyle = linGrad(g, 0, -260, 0, 40, [shade(GOLD, -0.5), shade(GOLD, -0.15)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H + 40 - 0); for (let x = -E.W; x < E.W * 2; x += 120) { g.fillStyle = shade(GOLD, -0.3); g.beginPath(); g.arc(x + 60, 40, 60, 0, Math.PI); g.fill(); }
  });
  return { GY, CX, M, rim: [0, -1], rigY };
}
function debris(g, cx, y, t, amt) { const r = rng(5); for (let i = 0; i < 40 * amt; i++) { const x = cx + (r() - 0.5) * 900, s = 6 + r() * 26; g.save(); g.translate(x, y - r() * 30); g.rotate(r() * 3); g.fillStyle = r() < 0.3 ? alpha('#cfe8ff', 0.7) : '#1a1620'; g.fillRect(-s / 2, -s / 4, s, s / 2); g.restore(); } }

// rows of the audience seen from the back of the hall (stage drawn small far away)
export function hallView(g, t, cam, o = {}) {
  const M = mood(THEATER_MOOD), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.35, (g) => {
    g.fillStyle = '#0a0608'; g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    // balcony boxes + chandelier
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const x = CX + s * (760 + k * 140); rr(g, x - 60, 120 + k * 40, 120, 70, 10); g.fillStyle = shade(VELVET, -0.5); g.fill(); g.fillStyle = alpha(GOLD, 0.4); g.fillRect(x - 60, 120 + k * 40, 120, 6); }
    if (o.chandelier !== false) { seg(g, [[CX, -E.H], [CX, 60]], 3, '#1a1418'); for (let k = -3; k <= 3; k++) circle(g, CX + k * 26, 80 + Math.abs(k) * -4, 6, '#ffe7b0'); glow(g, CX, 80, 200, M.practical, o.houseLights ? 0.5 : 0.18); }
    // the stage, small
    g.save(); g.translate(CX, E.H * 0.33); g.scale(0.36, 0.36); g.translate(-CX, -GY);
    stageView(g, t, { x: 0, y: 0, z: 1 }, { ...o, banner: o.banner });
    g.restore();
  });
  // rows of heads (far to near)
  const rows = 9;
  for (let j = 0; j < rows; j++) {
    const k = j / (rows - 1), d = 0.55 + k * 0.45, y = lerpN(E.H * 0.56, GY - 40, Math.pow(k, 1.3)), sc = 0.55 + k * 1.15;
    layer(g, cam, d, (g) => {
      g.fillStyle = shade(VELVET, -0.55 - k * 0.1); g.fillRect(-E.W * 1.2, y - 18 * sc, E.W * 3.4, 60 * sc);
      if (j === rows - 1) return;                                    // the last row is Max's (characters drawn by the shot)
      const r = rng(30 + j), gap = o.aisle ?? 140;
      for (let x = -E.W * 0.6; x < E.W * 1.6; x += (34 + r() * 14) * sc) {
        if (Math.abs(x - CX - 40) < gap * sc * 0.5) continue;        // central aisle
        if (r() < (o.empty ?? 0.08)) continue;
        const hx = x + r() * 6, hy = y - 24 * sc - (r() < 0.2 ? 6 * sc : 0);
        circle(g, hx, hy, 13 * sc, '#0e0a10');
        g.fillStyle = alpha(M.key, 0.35); g.beginPath(); g.arc(hx, hy, 13 * sc, Math.PI * 1.15, Math.PI * 1.85); g.lineWidth = 2; g.strokeStyle = alpha(M.key, 0.35); g.stroke();
        if (o.turn && r() < 0.95) { const a = Math.min(1, o.turn); circle(g, hx - 4 * sc, hy - 2 * sc, 2.4 * sc * a, '#f4efe6'); circle(g, hx + 4 * sc, hy - 2 * sc, 2.4 * sc * a, '#f4efe6'); }
        if (o.phones && r() < o.phones) { rr(g, hx + 8 * sc, hy - 30 * sc, 10 * sc, 16 * sc, 2); g.fillStyle = '#cfe8ff'; g.fill(); glow(g, hx + 13 * sc, hy - 22 * sc, 26 * sc, '#cfe8ff', 0.5); }
      }
      if (o.gray && j === 2) { const gx = CX - 260; circle(g, gx, y - 30 * sc, 15 * sc, '#0e0a10'); g.fillStyle = '#6c717c'; g.fillRect(gx - 26 * sc, y - 20 * sc, 52 * sc, 20 * sc); g.beginPath(); g.ellipse(gx, y - 40 * sc, 26 * sc, 5 * sc, 0, 0, 7); g.fill(); g.fillRect(gx - 12 * sc, y - 58 * sc, 24 * sc, 18 * sc); }
    });
  }
  return { GY, CX, M, rim: [0, -1] };
}
// the back row of seats, drawn in front of the characters sitting there
export function seatBacks(g, cam, GY, o = {}) {
  layer(g, cam, 1.05, (g) => { for (let x = -E.W * 0.4; x < E.W * 1.4; x += 150) { rr(g, x, GY - 120, 130, 140, 24); g.fillStyle = shade(VELVET, -0.62); g.fill(); g.fillStyle = alpha(GOLD, 0.18); g.fillRect(x + 8, GY - 118, 114, 3); } });
}
const lerpN = (a, b, k) => a + (b - a) * k;
