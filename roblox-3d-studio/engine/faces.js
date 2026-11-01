// engine/faces.js — Roblox-style decal faces drawn on a canvas (transparent background, the head colour shows through).
// faceTexture(expr, mouth 0..2, blink bool, style) is cached, so swapping faces per frame is free.
import { canvasTex } from './r3d.js';

export const EXPRESSIONS = ['smile', 'happy', 'grin', 'laugh', 'neutral', 'sad', 'cry', 'angry', 'furious', 'surprised', 'shocked', 'scared',
  'worried', 'smug', 'wink', 'cool', 'determined', 'hurt', 'dead', 'dizzy', 'sleepy', 'love', 'thinking', 'evil', 'nervous', 'bored'];
const HAPPY = new Set(['smile', 'happy', 'grin', 'laugh', 'smug', 'wink', 'cool', 'love', 'evil']);
export const FACE_W = 512, FACE_H = 348;

function ell(g, x, y, rx, ry, fill) { g.fillStyle = fill; g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); g.fill(); }
function arc(g, x, y, r, a0, a1, w, col) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, a0, a1); g.stroke(); }
function line(g, pts, w, col) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.stroke(); }

export function drawFace(g, W, H, expr = 'smile', mouth = 0, blink = false, st = {}) {
  const ink = st.ink || '#141414', white = '#ffffff', tongue = '#d9445a', cx = W / 2, ey = H * 0.4, ex = W * 0.12, ew = W * 0.034, eh = H * 0.105;
  const my = H * 0.7, lw = W * 0.018;
  const L = cx - ex, R = cx + ex;
  // ---- eyes
  const ovalEyes = (sx = 1, sy = 1, dy = 0) => { ell(g, L, ey + dy, ew * sx, eh * sy, ink); ell(g, R, ey + dy, ew * sx, eh * sy, ink); ell(g, L - ew * 0.25 * sx, ey - eh * 0.45 * sy + dy, ew * 0.32 * sx, ew * 0.42 * sy, white); ell(g, R - ew * 0.25 * sx, ey - eh * 0.45 * sy + dy, ew * 0.32 * sx, ew * 0.42 * sy, white); };
  const closedHappy = () => { arc(g, L, ey + eh * 0.4, ew * 1.6, Math.PI * 1.15, Math.PI * 1.85, lw, ink); arc(g, R, ey + eh * 0.4, ew * 1.6, Math.PI * 1.15, Math.PI * 1.85, lw, ink); };
  const closedLine = () => { line(g, [[L - ew * 1.4, ey], [L + ew * 1.4, ey]], lw, ink); line(g, [[R - ew * 1.4, ey], [R + ew * 1.4, ey]], lw, ink); };
  const brows = (inner, outer, dy = 0) => { line(g, [[L - ew * 2.2, ey - eh * 1.45 - outer + dy], [L + ew * 1.6, ey - eh * 1.45 - inner + dy]], lw * 0.95, ink); line(g, [[R + ew * 2.2, ey - eh * 1.45 - outer + dy], [R - ew * 1.6, ey - eh * 1.45 - inner + dy]], lw * 0.95, ink); };
  const blinkable = !['laugh', 'cry', 'dead', 'dizzy', 'sleepy', 'love', 'cool', 'wink', 'hurt'].includes(expr);
  if (blink && blinkable) closedLine();
  else switch (expr) {
    case 'laugh': closedHappy(); break;
    case 'cry': arc(g, L, ey - eh * 0.2, ew * 1.6, Math.PI * 0.15, Math.PI * 0.85, lw, ink); arc(g, R, ey - eh * 0.2, ew * 1.6, Math.PI * 0.15, Math.PI * 0.85, lw, ink); brows(-H * 0.05, H * 0.03);
      g.fillStyle = '#5ab8ff'; for (const x of [L, R]) { g.beginPath(); g.moveTo(x - ew, ey + eh * 0.5); g.lineTo(x + ew, ey + eh * 0.5); g.lineTo(x + ew * 0.7, H * 0.98); g.lineTo(x - ew * 0.7, H * 0.98); g.fill(); } break;
    case 'dead': for (const x of [L, R]) { line(g, [[x - ew * 1.5, ey - eh * 0.7], [x + ew * 1.5, ey + eh * 0.7]], lw, ink); line(g, [[x + ew * 1.5, ey - eh * 0.7], [x - ew * 1.5, ey + eh * 0.7]], lw, ink); } break;
    case 'dizzy': for (const x of [L, R]) { g.strokeStyle = ink; g.lineWidth = lw * 0.6; g.beginPath(); for (let a = 0; a < 14; a += 0.2) { const r = a * ew * 0.13; g.lineTo(x + Math.cos(a) * r, ey + Math.sin(a) * r); } g.stroke(); } break;
    case 'sleepy': arc(g, L, ey - eh * 0.3, ew * 1.5, Math.PI * 0.15, Math.PI * 0.85, lw * 0.8, ink); arc(g, R, ey - eh * 0.3, ew * 1.5, Math.PI * 0.15, Math.PI * 0.85, lw * 0.8, ink); break;
    case 'love': for (const x of [L, R]) { const s = ew * 1.25; g.fillStyle = '#e8304a'; g.beginPath(); g.moveTo(x, ey + s * 1.1); g.bezierCurveTo(x - s * 2.2, ey - s * 0.4, x - s * 0.9, ey - s * 1.9, x, ey - s * 0.6); g.bezierCurveTo(x + s * 0.9, ey - s * 1.9, x + s * 2.2, ey - s * 0.4, x, ey + s * 1.1); g.fill(); } break;
    case 'cool': g.fillStyle = ink; g.beginPath(); g.roundRect(L - ew * 3.2, ey - eh * 0.9, ex * 2 + ew * 6.4, eh * 1.6, eh * 0.5); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(L - ew * 2.4, ey - eh * 0.6, ew * 1.2, eh * 0.4); g.fillRect(R - ew * 2.4, ey - eh * 0.6, ew * 1.2, eh * 0.4); break;
    case 'wink': ell(g, L, ey, ew, eh, ink); ell(g, L - ew * 0.25, ey - eh * 0.45, ew * 0.32, ew * 0.42, white); arc(g, R, ey + eh * 0.4, ew * 1.6, Math.PI * 1.15, Math.PI * 1.85, lw, ink); break;
    case 'hurt': line(g, [[L - ew * 1.4, ey - eh * 0.6], [L + ew * 1.2, ey], [L - ew * 1.4, ey + eh * 0.6]], lw, ink); line(g, [[R + ew * 1.4, ey - eh * 0.6], [R - ew * 1.2, ey], [R + ew * 1.4, ey + eh * 0.6]], lw, ink); break;
    case 'surprised': ovalEyes(1.15, 1.15); brows(H * 0.06, H * 0.06, -H * 0.03); break;
    case 'shocked': ell(g, L, ey, ew * 2.1, ew * 2.1, white); ell(g, R, ey, ew * 2.1, ew * 2.1, white); g.lineWidth = lw * 0.5; g.strokeStyle = ink; g.beginPath(); g.arc(L, ey, ew * 2.1, 0, 7); g.stroke(); g.beginPath(); g.arc(R, ey, ew * 2.1, 0, 7); g.stroke(); ell(g, L, ey, ew * 0.55, ew * 0.55, ink); ell(g, R, ey, ew * 0.55, ew * 0.55, ink); brows(H * 0.08, H * 0.08, -H * 0.04); break;
    case 'scared': ell(g, L, ey, ew * 1.7, eh * 1.0, white); ell(g, R, ey, ew * 1.7, eh * 1.0, white); g.lineWidth = lw * 0.45; g.strokeStyle = ink; g.beginPath(); g.ellipse(L, ey, ew * 1.7, eh, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(R, ey, ew * 1.7, eh, 0, 0, 7); g.stroke(); ell(g, L, ey + eh * 0.2, ew * 0.45, ew * 0.45, ink); ell(g, R, ey + eh * 0.2, ew * 0.45, ew * 0.45, ink); brows(H * 0.06, -H * 0.02);
      g.fillStyle = '#7cc8ff'; g.beginPath(); g.moveTo(W * 0.86, H * 0.18); g.quadraticCurveTo(W * 0.9, H * 0.34, W * 0.86, H * 0.36); g.quadraticCurveTo(W * 0.82, H * 0.34, W * 0.86, H * 0.18); g.fill(); break;
    case 'worried': case 'nervous': ovalEyes(0.95, 0.9); brows(H * 0.05, -H * 0.02); break;
    case 'sad': ovalEyes(0.95, 0.85, eh * 0.15); brows(H * 0.05, -H * 0.03); break;
    case 'angry': case 'determined': ovalEyes(1, 0.85, eh * 0.1); brows(-H * 0.06, H * 0.02); break;
    case 'furious': case 'evil': ovalEyes(1.05, 0.8, eh * 0.15); brows(-H * 0.1, H * 0.04); if (expr === 'evil') { ell(g, L, ey + eh * 0.15, ew * 0.4, ew * 0.4, '#ff3030'); ell(g, R, ey + eh * 0.15, ew * 0.4, ew * 0.4, '#ff3030'); } break;
    case 'smug': case 'bored': ell(g, L, ey + eh * 0.25, ew, eh * 0.6, ink); ell(g, R, ey + eh * 0.25, ew, eh * 0.6, ink); line(g, [[L - ew * 1.8, ey - eh * 0.25], [L + ew * 1.6, ey - eh * 0.25]], lw * 0.9, ink); line(g, [[R - ew * 1.6, ey - eh * 0.25], [R + ew * 1.8, ey - eh * 0.25]], lw * 0.9, ink); break;
    case 'thinking': ovalEyes(); line(g, [[L - ew * 2, ey - eh * 1.4], [L + ew * 1.6, ey - eh * 1.4]], lw * 0.9, ink); line(g, [[R - ew * 1.6, ey - eh * 1.8], [R + ew * 2, ey - eh * 2.1]], lw * 0.9, ink); break;
    case 'happy': case 'grin': ovalEyes(1.05, 1.0); break;
    default: ovalEyes();
  }
  if (st.blush || expr === 'love') { ell(g, L - ew * 3.2, ey + eh * 1.2, ew * 1.8, ew * 1.0, 'rgba(255,90,120,.35)'); ell(g, R + ew * 3.2, ey + eh * 1.2, ew * 1.8, ew * 1.0, 'rgba(255,90,120,.35)'); }
  // ---- mouth
  const openMouth = (k, happy) => {   // k 0..1 talking / shouting
    const w = W * (happy ? 0.13 : 0.1), h = H * (0.06 + 0.12 * k);
    g.fillStyle = '#2a0c10'; g.beginPath();
    if (happy) { g.moveTo(cx - w, my - h * 0.35); g.quadraticCurveTo(cx, my - h * 0.55, cx + w, my - h * 0.35); g.quadraticCurveTo(cx + w * 0.9, my + h, cx, my + h); g.quadraticCurveTo(cx - w * 0.9, my + h, cx - w, my - h * 0.35); }
    else g.ellipse(cx, my + h * 0.1, w * 0.75, h * 0.7, 0, 0, Math.PI * 2);
    g.fill(); g.save(); g.clip();
    g.fillStyle = white; g.fillRect(cx - w, my - h * 0.7, w * 2, h * 0.32);
    ell(g, cx, my + h * 0.95, w * 0.6, h * 0.45, tongue); g.restore();
    g.lineWidth = lw * 0.55; g.strokeStyle = ink; g.stroke();
  };
  const talk = mouth > 0.05 ? mouth : 0;
  switch (expr) {
    case 'smile': case 'wink': case 'love': talk ? openMouth(talk * 0.8, true) : arc(g, cx, my - H * 0.13, W * 0.12, Math.PI * 0.22, Math.PI * 0.78, lw, ink); break;
    case 'happy': case 'laugh': case 'grin': openMouth(Math.max(talk, expr === 'grin' ? 0.15 : 0.5), true); break;
    case 'cool': case 'smug': case 'evil': talk ? openMouth(talk * 0.7, true) : line(g, [[cx - W * 0.09, my + H * 0.01], [cx + W * 0.03, my + H * 0.02], [cx + W * 0.11, my - H * 0.05]], lw, ink); break;
    case 'sad': case 'cry': case 'hurt': talk || expr === 'cry' ? openMouth(Math.max(talk, 0.35), false) : arc(g, cx, my + H * 0.14, W * 0.1, Math.PI * 1.22, Math.PI * 1.78, lw, ink); break;
    case 'angry': case 'furious': if (talk || expr === 'furious') openMouth(Math.max(talk, 0.4), false); else arc(g, cx, my + H * 0.12, W * 0.09, Math.PI * 1.25, Math.PI * 1.75, lw, ink); break;
    case 'surprised': case 'shocked': ell(g, cx, my + H * 0.03, W * (expr === 'shocked' ? 0.05 : 0.035) * (1 + talk * 0.3), H * (expr === 'shocked' ? 0.12 : 0.075) * (1 + talk * 0.4), '#2a0c10'); break;
    case 'scared': case 'nervous': case 'worried': if (talk) openMouth(talk * 0.7, false); else line(g, [[cx - W * 0.09, my + H * 0.02], [cx - W * 0.045, my - H * 0.02], [cx, my + H * 0.02], [cx + W * 0.045, my - H * 0.02], [cx + W * 0.09, my + H * 0.02]], lw * 0.8, ink); break;
    case 'dead': case 'dizzy': line(g, [[cx - W * 0.07, my], [cx + W * 0.07, my]], lw, ink); ell(g, cx + W * 0.03, my + H * 0.07, W * 0.025, H * 0.06, tongue); break;
    case 'sleepy': ell(g, cx, my, W * 0.025, H * 0.035, '#2a0c10'); break;
    case 'thinking': talk ? openMouth(talk * 0.6, false) : line(g, [[cx - W * 0.02, my], [cx + W * 0.08, my - H * 0.02]], lw, ink); break;
    default: talk ? openMouth(talk * 0.7, false) : line(g, [[cx - W * 0.07, my], [cx + W * 0.07, my]], lw, ink);
  }
}
export const isHappy = (e) => HAPPY.has(e);
export function faceTexture(expr, mouth = 0, blink = false, st = {}) {
  const m = Math.round(Math.min(1, mouth) * 3) / 3;
  return canvasTex(FACE_W, FACE_H, (g, W, H) => drawFace(g, W, H, expr, m, blink, st), { key: `face_${expr}_${m}_${blink}_${st.ink || ''}_${st.blush || ''}` });
}
