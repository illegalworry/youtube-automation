// engine/director.js — turns the declarative story (story/shots.json "scenes" + "shots") into animated 3D.
//
// A SCENE is one continuous piece of action in one location; SHOTS are camera cuts over it (same action, new angles),
// so continuity between shots is automatic. All times are GLOBAL seconds (the voiceover timeline).
//
// scene = { id, set: 'park', setOpts: {}, light: 'day', fog, bloom,
//   actors: { max: { cast: 'max', at: [x,z] | [x,y,z] | 'spot:bench1', face: deg | 'bob' | [x,z], pose: 'sit', expr: 'smile', hold: 'phone' } },
//   acts:   [ { who: 'max', t: 3.2 | w: 'word' (+dt), do: 'walk', to: [x,z], path: [[x,z],...], speed, dur, face, expr, item, hand, target, react, say, layer } ],
//   props:  [ { id, item: 'car', at: [x,z], face: 90, y, s, opts: {...}, move: [[t, [x,z]], ...], show: [t0, t1], spin: 90 } ],
//   fx:     [ { t, type: 'confetti', at: 'max.head' | [x,y,z] } ],
//   talk:   [ { who, from, to } ]   (mouth moves on the voiceover words inside the window)
// }
// shot  = { id, start, end, scene: 'sc1', cam: {...camera3d spec}, speaker: 'max', text: [...ui overlays], in: {transition}, sfx: [...] }
import { E, clamp, lerp, ease, wordTime, talkAmount, registerShot, getShot } from './core.js';
import { THREE, stage, D2R } from './r3d.js';
import { makeAvatar } from './avatar.js';
import { CLIPS, full, blend, rampTravel } from './anim.js';
import { makeItem } from './items.js';
import { buildSet, setMeta } from './world.js';
import './sets-extra.js';   // more locations (forest, desert, winter, beach, space, cave, bedroom, kitchen, shop, castle, spooky, stage)
import { makeFx } from './fx3d.js';
import { evalCam, applyCam } from './camera3d.js';
import { drawText } from './ui.js';

const CAST = {}, SCENE_HOOKS = {}, SHOT_HOOKS = {};
export function defineCast(obj) { Object.assign(CAST, obj); }
export const castList = () => CAST;
// custom code on top of a declarative scene: sceneHook('sc1', { build(rt, kit), update(rt, t) })
export function sceneHook(id, h) { SCENE_HOOKS[id] = h; }
// per-shot extras: shotHook('s004', { update(rt, t, lt), overlay(g, lt, rt) })
export function shotHook(id, h) { SHOT_HOOKS[id] = h; }

const REACT = { punch: 'hit', uppercut: 'knockback', kick: 'knockback', slash: 'hit', push: 'stagger', throw: 'hit' };
const LAND_DUST = { fall: 1, faceplant: 1, knockback: 1, jump: 1 };
const TURN = 0.28, wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const lerpAng = (a, b, k) => a + wrap(b - a) * k;

// ---------------------------------------------------------------- actor timeline
class Actor {
  constructor(id, spec, rt) {
    this.id = id; this.spec = spec; this.rt = rt; this.seed = [...id].reduce((s, c) => s + c.charCodeAt(0), 0) % 97;
    const look = typeof spec.cast === 'object' ? spec.cast : { ...(CAST[spec.cast || id] || {}) };
    if (!CAST[spec.cast || id] && typeof spec.cast !== 'object') console.log(`ERROR missing cast "${spec.cast || id}" (defineCast in scenes/cast.js)`);
    this.av = makeAvatar({ ...look, ...(spec.look || {}), hold: null }); rt.stage.add(this.av.root);
    this.scale = this.av.root.scale.x; this.baseExpr = spec.expr || look.face || 'smile';
    this.initHold = spec.hold ?? look.hold ?? null;
  }
  compile(acts, sceneStart) {
    const rt = this.rt; const p0 = rt.resolveXYZ(this.spec.at ?? [0, 0]);
    this.moves = []; this.base = []; this.upper = []; this.heads = []; this.exprs = []; this.talks = []; this.items = { L: [], R: [] };
    this.p0 = p0; this.h0 = typeof this.spec.face === 'number' ? this.spec.face * D2R : null;
    if (this.initHold) { const h = typeof this.initHold === 'string' ? { item: this.initHold } : this.initHold; this.items[h.hand || 'R'].push({ t: -1e9, item: h.item }); }
    let cur = { ...p0 }, prevEnd = sceneStart, lastLoco = null;
    const list = acts.filter(a => a.who === this.id).map(a => ({ ...a }));
    for (const a of list) {   // resolve start times
      if (a.t == null && a.w) { const wt = wordTime(a.w, sceneStart); if (wt == null) console.log(`ERROR act word "${a.w}" not found for ${this.id}`); a.t = (wt ?? prevEnd) + (a.dt || 0); }
      if (a.t == null) a.t = prevEnd + (a.dt || 0);
      const clip = CLIPS[a.do] || (a.do === 'face' || a.do === 'turn' || a.do === 'teleport' || a.do === 'say' ? null : (console.log(`ERROR unknown action "${a.do}" (${this.id})`), CLIPS.idle));
      a.clip = clip;
      // movement
      const moving = !!(clip?.loco || a.do === 'jump' || a.do === 'teleport' || a.move);
      const pts = !moving ? null : a.path ? a.path.map(p => rt.resolveXYZ(p)) : a.to != null ? [rt.resolveXYZ(a.to)] : null;
      let dur = a.dur;
      if (a.do === 'teleport') { cur = pts ? pts[pts.length - 1] : cur; this.moves.push({ t0: a.t, t1: a.t, pts: [cur, cur], lens: [0], total: 0, travel: () => 1, teleport: true }); prevEnd = a.t; continue; }
      if (clip && clip.back && !pts && (a.dist ?? (a.do === 'knockback' ? 7 : a.do === 'hit' ? 1.2 : 0)) > 0) {   // pushed backwards (away from `from` or own facing)
        const d = a.dist ?? (a.do === 'knockback' ? 7 : 1.2); let h = this.headingAt(a.t);
        if (a.from && rt.actors[a.from]?.moves) { const o = rt.actors[a.from].posAt(a.t); h = Math.atan2(o.x - cur.x, o.z - cur.z); a.face = a.from; }
        const end = { x: cur.x - Math.sin(h) * d, y: cur.y, z: cur.z - Math.cos(h) * d };
        dur = dur ?? clip.dur; this.moves.push(mkMove(a.t, a.t + dur, [cur, end], clip.travel || ease.out, true)); cur = end;
      } else if (pts) {
        const path = [cur, ...pts], lens = []; let total = 0; for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i].x - path[i - 1].x, path[i].z - path[i - 1].z); lens.push(l); total += l; }
        const speed = a.speed ?? clip?.loco?.speed ?? 6; dur = dur ?? clip?.dur ?? Math.max(0.3, total / speed);
        if (a.do === 'jump') dur = a.dur ?? clip.dur * Math.max(1, Math.min(1.6, total / 10));
        const mv = mkMove(a.t, a.t + dur, path, clip?.travel || rampTravel(dur), !!clip?.back); mv.lens = lens; mv.total = total; mv.stride = clip?.loco?.stride || 4.2; mv.act = a;
        this.moves.push(mv); cur = path[path.length - 1];
      }
      dur = dur ?? clip?.dur ?? 0; a.dur = dur; a.end = a.t + dur;
      // facing
      const faceT = a.face ?? a.target ?? null;
      if (a.do === 'turn' || (faceT != null && !(this.moves.length && this.moves[this.moves.length - 1].act === a))) this.heads.push({ t: a.t, face: faceT ?? 0 });
      // expression: explicit act expr persists; clip expr is temporary
      if (a.expr) this.exprs.push({ t: a.t, expr: a.expr, until: 1e9 });
      else if (clip?.expr) this.exprs.push({ t: a.t, expr: clip.expr, until: clip.hold ? 1e9 : a.end + 0.35 });
      if (a.do === 'face') { prevEnd = a.t; continue; }
      if (a.do === 'say' || a.say || clip?.say) this.talks.push({ from: a.t, to: a.t + (a.do === 'say' ? (a.dur || 2) : dur) });
      if (a.do === 'say' || a.do === 'turn') { prevEnd = a.t + (a.dur || 0.3); continue; }
      // items
      if ('item' in a) { const hand = a.hand || 'R', when = a.t + dur * (clip?.attach ?? 0); this.items[hand].push({ t: when, item: a.item }); }
      if (a.drop) this.items[a.hand || 'R'].push({ t: a.t, item: null });
      if (clip?.release != null) { const tr = a.t + dur * clip.release, hand = a.hand || 'R'; const held = this.itemAtRaw(hand, tr - 1e-3); this.items[hand].push({ t: tr, item: null }); if (held) rt.projectiles.push({ item: held, actor: this, hand, t: tr, to: a.to ?? a.target, flight: a.flight || 0.7, arc: a.arc ?? 2.5 }); }
      // layer: upper-body gesture on top of locomotion
      const overLoco = lastLoco && a.t < lastLoco.end && a.t >= lastLoco.t;
      if (clip && (a.layer === 'upper' || (clip.upper && a.layer !== 'base' && overLoco))) { this.upper.push(a); }
      else if (clip) { a.side = a.hand === 'L' ? 'L' : 'R'; this.base.push(a); if (pts || clip.loco) lastLoco = a; prevEnd = a.end; }
      // impacts → reactions on the target + fx + camera shake
      if (clip?.impact != null && clip.impact > 0 || a.do === 'throw') {
        const ti = a.t + dur * (clip.impact ?? 0.5);
        if (a.target && rt.actors[a.target] && a.do !== 'throw') {
          rt.impacts.push({ t: ti, amp: a.do === 'kick' || a.do === 'uppercut' ? 0.5 : 0.35 });
          rt.autoFx.push({ t: ti, type: 'flash', at: a.target + '.chest' }, { t: ti, type: 'burst', at: a.target + '.chest', count: 10 });
          const re = a.react ?? (a.do === 'highFive' ? 'none' : REACT[a.do] || 'hit'); if (re !== 'none') rt.reactions.push({ who: a.target, t: ti, do: re, from: this.id, auto: true, ...(a.reactOpts || {}) });
        }
        if (LAND_DUST[a.do]) { rt.autoFx.push({ t: a.t + dur * clip.impact, type: 'dust', at: { actor: this.id, feet: true } }); if (a.do !== 'jump') rt.impacts.push({ t: a.t + dur * clip.impact, amp: 0.25 }); }
      }
      if (a.do === 'oof') rt.autoFx.push({ t: a.t, type: 'burst', at: this.id + '.chest', count: 8, color: '#ffffff' });
    }
    this.heads.sort((x, y) => x.t - y.t); this.exprs.sort((x, y) => x.t - y.t);
    for (const k of ['L', 'R']) this.items[k].sort((x, y) => x.t - y.t);
    this.base.sort((x, y) => x.t - y.t);
  }
  itemAtRaw(hand, t) { let it = null; for (const e of this.items[hand]) if (e.t <= t) it = e.item; return it; }
  // ---- root position
  posAt(t) {
    let p = this.p0;
    for (const m of this.moves) { if (t < m.t0) break; if (t >= m.t1) { p = m.pts[m.pts.length - 1]; continue; } return pointOnPath(m, m.travel(clamp((t - m.t0) / Math.max(1e-4, m.t1 - m.t0)))); }
    return p;
  }
  moveAt(t) { for (const m of this.moves) if (t >= m.t0 && t < m.t1 && !m.teleport) return m; return null; }
  // ---- facing (radians). Moves face their travel direction; acts with face/target turn smoothly.
  headingAt(t, depth = 0) {
    let best = null;   // latest event that started before t
    for (const m of this.moves) if (m.t0 <= t && !m.teleport && m.total > 0.05 && (!best || m.t0 >= best.t)) best = { t: m.t0, m };
    for (const h of this.heads) if (h.t <= t && (!best || h.t >= best.t)) best = { t: h.t, h };
    if (!best) return this.h0 ?? this.faceTo(this.spec.face, t, this.p0) ?? 0;
    let target;
    if (best.m) { const m = best.m, tt = Math.min(t, m.t1 - 1e-3); const a = this.posAt(Math.max(m.t0, tt - 0.12)), b = this.posAt(Math.min(m.t1, tt + 0.12)); target = Math.hypot(b.x - a.x, b.z - a.z) > 1e-4 ? Math.atan2(b.x - a.x, b.z - a.z) : this.headingAt(m.t0 - 1e-3, depth + 1); if (m.back) target += Math.PI; if (m.act?.face != null) target = this.faceTo(m.act.face, t) ?? target; }
    else target = this.faceTo(best.h.face, t) ?? 0;
    const k = (t - best.t) / TURN;
    if (k < 1 && depth < 12) { const prev = this.headingAt(best.t - 1e-3, depth + 1); return lerpAng(prev, target, ease.inOut(k)); }
    return target;
  }
  faceTo(f, t, from) {
    if (f == null) return null; if (typeof f === 'number') return f * D2R;
    const me = from || this.posAt(t); let o = null;
    if (typeof f === 'string' && this.rt.actors[f]) o = this.rt.actors[f].posAt(t);
    else if (f === 'camera') o = this.rt.camPos || { x: 0, z: 100 };
    else o = this.rt.resolveXYZ(f);
    return Math.atan2(o.x - me.x, o.z - me.z);
  }
  // ---- pose
  ctx(a, t) {
    const lt = t - a.t, dur = a.dur || 1, m = this.moves.find(mm => mm.act === a); let phase = 0;
    if (m) { const u = clamp((t - m.t0) / Math.max(1e-4, m.t1 - m.t0)); phase = (m.travel(u) * m.total) / (m.stride || 4) * Math.PI * 2; }
    else if (a.clip?.loco) phase = lt * (a.clip.loco.speed / a.clip.loco.stride) * Math.PI * 2;   // walking on the spot
    return { dur, u: clamp(lt / dur), t, phase, seed: this.seed, act: a, side: a.side || 'R' };
  }
  idlePose(t) { if (this.spec.pose) { const c = CLIPS[this.spec.pose]; return full(c ? c.fn(1, { dur: 1, u: 1, t, phase: 0, seed: this.seed, act: { pose: this.spec.pose } }) : {}); } return full(CLIPS.idle.fn(0, { t, seed: this.seed })); }
  evalBase(i, t) {
    if (i < 0) return this.idlePose(t);
    const a = this.base[i], c = a.clip, lt = t - a.t, idle = () => full(CLIPS.idle.fn(0, { t, seed: this.seed }));
    if (lt <= a.dur) return full(c.fn(Math.max(0, lt), this.ctx(a, t)));
    if (c.hold) return full(c.fn(a.dur, { ...this.ctx(a, a.t + a.dur), t }));
    const k = ease.inOut(clamp((lt - a.dur) / 0.3)); if (k >= 1) return idle();
    return blend(c.fn(a.dur, this.ctx(a, a.t + a.dur)), idle(), k);
  }
  poseAt(t) {
    let i = -1; for (let k = 0; k < this.base.length; k++) if (this.base[k].t <= t) i = k;
    let p = this.evalBase(i, t);
    if (i >= 0) { const a = this.base[i], bl = a.blend ?? a.clip.blend ?? (a.clip.impact != null && a.clip.impact < 0.1 ? 0.06 : 0.2), lt = t - a.t; if (lt < bl) p = blend(this.evalBase(i - 1, t), p, ease.inOut(lt / bl)); }
    for (const a of this.upper) {
      const lt = t - a.t; if (lt < 0) continue; const outT = a.clip.hold ? 1e9 : a.dur;
      const w = Math.min(ease.inOut(clamp(lt / 0.22)), 1 - ease.inOut(clamp((lt - outT) / 0.25))); if (w <= 0) continue;
      const up = full(a.clip.fn(Math.min(lt, a.dur), this.ctx(a, t)));
      for (const k of ['armL', 'armR', 'elbowL', 'elbowR', 'head']) p[k] = blend({ [k]: p[k] }, { [k]: up[k] }, w)[k];
    }
    const mv = this.moveAt(t); if (mv && this.av.rig.cape) p.cape = 10 + Math.min(70, (mv.total / Math.max(0.1, mv.t1 - mv.t0)) * 4);
    return p;
  }
  exprAt(t) { let e = this.baseExpr, et = -1e9; for (const x of this.exprs) if (x.t <= t && t < x.until && x.t >= et) { e = x.expr; et = x.t; } return e; }
  mouthAt(t, speaking) {
    const on = speaking || this.talks.some(w => t >= w.from && t <= w.to) || (this.rt.talk || []).some(w => w.who === this.id && t >= w.from && t <= w.to);
    if (!on) return 0; if (E.words.length) return talkAmount(t); return clamp(0.35 + 0.65 * Math.abs(Math.sin(t * 11)) * (0.6 + 0.4 * Math.sin(t * 4.3)));
  }
  blinkAt(t) { const per = 3.1 + (this.seed % 7) * 0.23, ph = ((t + this.seed * 0.37) % per); return ph < 0.12; }
  update(t, shot) {
    const p = this.posAt(t), av = this.av; av.root.position.set(p.x, p.y, p.z); av.root.rotation.y = this.headingAt(t);
    for (const hand of ['L', 'R']) { const it = this.itemAtRaw(hand, t); if (it !== (av.held(hand)?.name || null)) av.hold(it, hand); }
    const P = this.poseAt(t); this._poseT = t; this._air = P.air || 0; av.setPose(P);
    av.setFace(this.exprAt(t), this.mouthAt(t, shot?.speaker === this.id || (Array.isArray(shot?.speaker) && shot.speaker.includes(this.id))), this.blinkAt(t));
  }
}
function mkMove(t0, t1, pts, travel, back) { const lens = []; let total = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z); lens.push(l); total += l; } return { t0, t1, pts, lens, total, travel, back }; }
function pointOnPath(m, f) {
  if (m.total < 1e-6) { const a = m.pts[0], b = m.pts[m.pts.length - 1]; return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), z: lerp(a.z, b.z, f) }; }
  let d = clamp(f) * m.total; for (let i = 0; i < m.lens.length; i++) { if (d <= m.lens[i] || i === m.lens.length - 1) { const k = m.lens[i] > 0 ? clamp(d / m.lens[i]) : 1, a = m.pts[i], b = m.pts[i + 1]; return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k) }; } d -= m.lens[i]; }
  return m.pts[m.pts.length - 1];
}

// ---------------------------------------------------------------- scene runtime
export function sceneSpec(id) { const s = (E.story.scenes || []).find(x => x.id === id); if (!s) console.log(`ERROR missing scene "${id}"`); return s || { id, set: 'baseplate', actors: {}, acts: [] }; }
export function buildScene(spec) {
  const st = stage({ light: spec.light || setMeta(spec.set || 'baseplate').light || 'day', fog: spec.fog, bloom: spec.bloom, shadow: spec.shadow, clouds: spec.clouds, lightOverride: spec.lightOverride });
  const rt = { spec, stage: st, actors: {}, props: {}, fx: [], impacts: [], autoFx: [], reactions: [], projectiles: [], talk: spec.talk || [], camFocus: new THREE.Vector3(), camPos: null };
  const set = buildSet(spec.set || 'baseplate', st, spec.setOpts || {}); rt.spots = set.spots || {};
  const shots = E.shots.filter(s => s.scene === spec.id); rt.start = shots.length ? Math.min(...shots.map(s => s.start)) : 0;
  rt.resolveXYZ = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && 'x' in v) return v;
    if (typeof v === 'string') { const k = v.replace(/^spot:/, ''); if (rt.spots[k]) return rt.resolveXYZ(rt.spots[k]); if (rt.actors[k]) return rt.actors[k].posAt(rt._t || 0); console.log(`ERROR unknown spot "${v}"`); return { x: 0, y: 0, z: 0 }; }
    if (!Array.isArray(v)) return { x: 0, y: 0, z: 0 };
    return v.length >= 3 ? { x: v[0], y: v[1], z: v[2] } : { x: v[0], y: 0, z: v[1] };
  };
  for (const [id, a] of Object.entries(spec.actors || {})) rt.actors[id] = new Actor(id, a, rt);
  // compile twice: pass 1 collects reactions (hit → knockback etc.), pass 2 compiles with them
  const acts = (spec.acts || []).slice().sort((a, b) => (a.t ?? 1e9) - (b.t ?? 1e9));
  for (const A of Object.values(rt.actors)) A.compile(acts, rt.start);
  const reactions = rt.reactions.slice(); rt.impacts = []; rt.autoFx = []; rt.reactions = []; rt.projectiles = [];
  const all = acts.concat(reactions.filter(r => !acts.some(a => a.who === r.who && a.do === r.do && Math.abs((a.t ?? -99) - r.t) < 0.3)));
  all.sort((a, b) => (a.t ?? 1e9) - (b.t ?? 1e9));
  for (const A of Object.values(rt.actors)) A.compile(all, rt.start);
  // props
  for (const p of spec.props || []) {
    const obj = makeItem(p.item, p.opts || {}); const pos = rt.resolveXYZ(p.at || [0, 0]); obj.position.set(pos.x, p.y ?? pos.y, pos.z); obj.rotation.y = (p.face || 0) * D2R; if (p.s) obj.scale.setScalar(p.s);
    st.add(obj); rt.props[p.id || p.item + Object.keys(rt.props).length] = { obj, spec: p, base: obj.position.clone() };
  }
  for (const pr of rt.projectiles) { pr.obj = makeItem(pr.item); pr.obj.visible = false; st.add(pr.obj); }
  // fx
  const resolvePoint = (at, t) => {
    if (at && typeof at === 'object' && !Array.isArray(at) && at.actor) { const A = rt.actors[at.actor]; const p = A.posAt(t); return new THREE.Vector3(p.x, p.y + 0.2, p.z); }
    if (typeof at === 'string') { const [id, part] = at.split('.'); const A = rt.actors[id]; if (A) { const p = A.posAt(t), s = A.scale; const h = { head: 4.7, chest: 3.0, feet: 0.2, hand: 2.2 }[part || 'chest'] ?? 3; const hd = A.headingAt(t); const fwd = part === 'chest' || part === 'head' ? 0.6 * s : 0; return new THREE.Vector3(p.x + Math.sin(hd) * fwd, p.y + h * s, p.z + Math.cos(hd) * fwd); }
      const q = rt.resolveXYZ(at); return new THREE.Vector3(q.x, q.y + 1, q.z); }
    const q = rt.resolveXYZ(at); return new THREE.Vector3(q.x, Array.isArray(at) && at.length === 3 ? q.y : 1, q.z);
  };
  rt.resolvePoint = resolvePoint;
  for (const f of [...(spec.fx || []), ...rt.autoFx]) { const ff = { ...f }; if (ff.t == null && ff.w) ff.t = wordTime(ff.w, rt.start) ?? 0; rt.fx.push(makeFx(ff, rt)); }
  // camera helpers
  rt.point = (tg, t, look) => {
    if (Array.isArray(tg) && typeof tg[0] === 'string') { const v = new THREE.Vector3(); tg.forEach(x => v.add(rt.point(x, t, look))); return v.multiplyScalar(1 / tg.length); }
    if (typeof tg === 'string' && rt.actors[tg]) { const A = rt.actors[tg], p = A.posAt(t); const air = Math.abs(t - (A._poseT ?? -1)) < 1e-6 ? (A._air || 0) * 0.75 * A.scale : 0; return new THREE.Vector3(p.x, p.y + look * A.scale + air, p.z); }
    if (typeof tg === 'string' && rt.props[tg]) { const o = rt.props[tg].obj.position; return new THREE.Vector3(o.x, o.y + look * 0.6, o.z); }
    const q = rt.resolveXYZ(tg ?? [0, 0]); return new THREE.Vector3(q.x, Array.isArray(tg) && tg.length === 3 ? q.y : q.y + look, q.z);
  };
  rt.heading = (tg, t) => (typeof tg === 'string' && rt.actors[tg] ? rt.actors[tg].headingAt(t) : 0);
  rt.defaultTarget = Object.keys(rt.actors)[0] || [0, 0];
  rt.update = (t, shot) => {
    rt._t = t;
    for (const A of Object.values(rt.actors)) A.update(t, shot);
    for (const [id, P] of Object.entries(rt.props)) {
      const sp = P.spec; if (sp.show) P.obj.visible = t >= sp.show[0] && t < sp.show[1];
      if (sp.move) { const ks = sp.move.map(([tt, v]) => [tt, rt.resolveXYZ(v)]); let pos = ks[0][1], prev = pos; for (let i = 1; i < ks.length; i++) { if (t <= ks[i][0]) { const k = ease.inOut(clamp((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0]))); pos = { x: lerp(ks[i - 1][1].x, ks[i][1].x, k), y: lerp(ks[i - 1][1].y, ks[i][1].y, k), z: lerp(ks[i - 1][1].z, ks[i][1].z, k) }; break; } pos = ks[i][1]; }
        P.obj.position.set(pos.x, sp.y ?? pos.y, pos.z); const dt = 0.05, ahead = (() => { for (let i = 1; i < ks.length; i++) if (t + dt <= ks[i][0]) { const k = ease.inOut(clamp((t + dt - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0]))); return { x: lerp(ks[i - 1][1].x, ks[i][1].x, k), z: lerp(ks[i - 1][1].z, ks[i][1].z, k) }; } return null; })();
        if (ahead && Math.hypot(ahead.x - pos.x, ahead.z - pos.z) > 1e-3 && sp.face == null) P.obj.rotation.y = Math.atan2(ahead.x - pos.x, ahead.z - pos.z);
        const dist = (P.odo = Math.hypot(pos.x - P.base.x, pos.z - P.base.z)); P.obj.traverse(o => { if (o.name === 'wheel') o.rotation.x = dist / 1.0; }); }
      if (sp.spin != null || P.obj.getObjectByName('spin')) P.obj.traverse(o => { if (o.name === 'spin') o.rotation.y = t * (sp.spin ?? 120) * D2R; });
    }
    for (const pr of rt.projectiles) {
      const k = (t - pr.t) / pr.flight; if (k < 0) { pr.obj.visible = false; continue; }
      if (!pr.p0) { const A = pr.actor, p = A.posAt(pr.t), h = A.headingAt(pr.t), s = A.scale, side = pr.hand === 'L' ? 1 : -1; pr.p0 = new THREE.Vector3(p.x + (Math.cos(h) * 1.5 * side + Math.sin(h) * 1.2) * s, p.y + 4.4 * s, p.z + (-Math.sin(h) * 1.5 * side + Math.cos(h) * 1.2) * s); pr.p1 = resolvePoint(pr.to ?? [p.x + Math.sin(h) * 14, p.z + Math.cos(h) * 14], pr.t + pr.flight); }
      const kk = Math.min(1, k); pr.obj.visible = k < 1 || pr.stay !== false; pr.obj.position.lerpVectors(pr.p0, pr.p1, kk); pr.obj.position.y += 4 * pr.arc * kk * (1 - kk); pr.obj.rotation.set(kk * 8, kk * 5, 0);
    }
  };
  const hook = SCENE_HOOKS[spec.id]; if (hook?.build) hook.build(rt, { THREE });
  rt.dispose = () => st.dispose();
  return rt;
}

// draw one shot of a scene at local time lt
export function drawShot(rt, shot, lt) {
  const t = shot.start + lt, dur = shot.end - shot.start;
  const cam = smartCam(rt, shot);
  rt.update(t, shot);
  const c = evalCam(cam, lt, dur, rt, t); applyCam(rt.stage.camera, c); rt.camFocus = c.look; rt.camPos = c.pos; rt.stage.focusShadow(c.look);
  SCENE_HOOKS[rt.spec.id]?.update?.(rt, t, shot); SHOT_HOOKS[shot.id]?.update?.(rt, t, lt);
  for (const f of rt.fx) f.update(t);
}
// Smart camera: sample the shot (start / middle / end) and, if walls, props or other actors block the subject,
// swing the camera around (az offsets up to ±90°, smallest that works). Decided once per shot => deterministic.
// Disable per shot with cam.avoid = false.
const _ray = new THREE.Raycaster();
function smartCam(rt, shot) {
  rt._smart ||= {}; if (rt._smart[shot.id]) return rt._smart[shot.id];
  const cam = { ...(shot.cam || {}) };
  if (cam.avoid === false || cam.shot === 'ots' || cam.shot === 'pov' || cam.shot === 'top') return (rt._smart[shot.id] = cam);
  const tg = [].concat(cam.target ?? rt.defaultTarget).filter(x => typeof x === 'string' && rt.actors[x]);
  const skip = new Set(); for (const id of tg) rt.actors[id].av.root.traverse(o => skip.add(o));
  if (!rt._occ) { rt._occ = []; rt.stage.scene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.geometry && !(o.geometry.type === 'PlaneGeometry' && o.rotation.x !== 0)) rt._occ.push(o); }); }
  const occ = rt._occ.filter(o => !skip.has(o) && o.visible);
  const dur = shot.end - shot.start, us = [0.05, 0.5, 0.95];
  const hidden = (c, t) => {   // rays from the subject's feet / body / head (+ the aim point) to the lens
    const pts = [c.look]; for (const id of tg) { const p = rt.actors[id].posAt(t), s = rt.actors[id].scale; for (const h of [0.9, 2.8, 4.6]) pts.push(new THREE.Vector3(p.x, p.y + h * s, p.z)); }
    let n = 0; for (const p of pts) { const d = c.pos.distanceTo(p); _ray.set(p, c.pos.clone().sub(p).normalize()); _ray.near = 0.7; _ray.far = d - 0.4; if (_ray.intersectObjects(occ, false).length) n++; } return n;
  };
  const score = (off) => { let n = 0; const cc = { ...cam, az: (cam.az ?? (Array.isArray(cam.target) && cam.target.length > 1 ? 0 : 25)) + off, handheld: 0, shake: 0 }; for (const u of us) { const t = shot.start + u * dur; rt.update(t, shot); rt.stage.scene.updateMatrixWorld(true); const c = evalCam(cc, u * dur, dur, rt, t); n += hidden(c, t); if (cam.from || cam.to || cam.keys) { /* explicit moves: still checked at these samples */ } } return n; };
  let best = 0, bestN = score(0);
  if (bestN > 0) for (const off of [20, -20, 40, -40, 60, -60, 90, -90]) { const n = score(off); if (n < bestN) { bestN = n; best = off; if (!n) break; } }
  if (best) { cam.az = (cam.az ?? (Array.isArray(cam.target) && cam.target.length > 1 ? 0 : 25)) + best; if (cam.from?.az != null) cam.from = { ...cam.from, az: cam.from.az + best }; if (cam.to?.az != null) cam.to = { ...cam.to, az: cam.to.az + best }; }
  return (rt._smart[shot.id] = cam);
}

// register every shot of shots.json that has a `scene` and no hand-written registerShot()
export function autoRegister() {
  for (const shot of E.shots) {
    if (getShot(shot.id) || !shot.scene) continue;
    registerShot(shot.id, {
      kind: '3d', cacheKey: 'scene:' + shot.scene,
      init: () => buildScene(sceneSpec(shot.scene)),
      draw: (rt, lt) => drawShot(rt, shot, lt),
      overlay: (g, lt, info, rt) => { for (const it of shot.text || []) drawText(g, lt, it); SHOT_HOOKS[shot.id]?.overlay?.(g, lt, rt); },
    });
  }
}

// timing of everything that should make a sound (used by `render.mjs --events` -> tools/auto_sfx.py)
export function sceneEvents() {
  const out = [];
  for (const spec of E.story.scenes || []) {
    let rt; try { rt = buildScene(spec); } catch (e) { out.push({ scene: spec.id, error: e.message }); continue; }
    for (const A of Object.values(rt.actors)) {
      for (const m of A.moves) if (!m.teleport && m.total > 0.3) out.push({ scene: spec.id, who: A.id, type: 'move', do: m.act?.do || (m.back ? 'pushed' : 'move'), t0: m.t0, t1: m.t1, dist: m.total, stride: m.stride || 4.2 });
      for (const a of [...A.base, ...A.upper]) out.push({ scene: spec.id, who: A.id, type: 'act', do: a.do, t: a.t, end: a.end, impact: a.clip?.impact != null ? a.t + a.dur * a.clip.impact : null, release: a.clip?.release != null ? a.t + a.dur * a.clip.release : null, target: a.target || null });
    }
    for (const f of [...(spec.fx || [])]) out.push({ scene: spec.id, type: 'fx', fx: f.type, t: f.t ?? (f.w ? wordTime(f.w, rt.start) : null) });
    rt.dispose();
  }
  return out;
}
