// sets/props.js — project-specific pieces live here; the locations themselves come from /engine/toonsets.js.
import { rr, text, FONTS } from '/engine/core.js';
import { cardboardBox } from '/engine/toonsets.js';
// the ticket stand: a big cardboard box with a cash tin on top
export function ticketStand(g, x, GY, s = 1) {
  cardboardBox(g, x - 95 * s, GY, 190 * s, 170 * s);
  rr(g, x - 30 * s, GY - 196 * s, 90 * s, 26 * s, 3 * s); g.fillStyle = '#e8e4da'; g.fill();
  g.fillStyle = '#7a5a3a'; g.fillRect(x - 30 * s, GY - 198 * s, 90 * s, 5 * s);
}
