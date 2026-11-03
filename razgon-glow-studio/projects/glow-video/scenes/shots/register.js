// register.js — every shot in story/shots.json is drawn by the template named in its params.tpl
import { E, registerShot, text } from '/engine/core.js';
import { T as T1 } from '../_t1.js';
import { T as T2 } from '../_t2.js';
import { T as T3 } from '../_t3.js';
import * as L from '../_lib.js';
const T = { ...T1, ...T2, ...T3 };
for (const s of E.shots) {
  const p = { ...(s.params || {}) }, fn = T[p.tpl];
  if (p.outfitRef) p.outfit = p.outfitRef.reduce((o, k) => o[k], L);
  if (!fn) { console.log('ERROR missing template', s.id, p.tpl); continue; }
  registerShot(s.id, { draw(g, t, info) { fn(g, t, info, p); } });
}
