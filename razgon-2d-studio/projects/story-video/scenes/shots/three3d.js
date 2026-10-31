// three3d.js — low-poly 3D establishing shots: the Old City Theater and Max's street. params: {tpl:'3d', s3:'theater'|'town', move:{...}}
import { E, V, registerShot, mood, ease, prog, lerp } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { CAST } from '../cast.js';
import { freezeLook, badgeTxt } from './_common.js';

function theater(T, p) {
  const M = mood('interiorWarm'), st = T.stage({ mood: 'interiorWarm', sky: '#07050a', fov: 38, fog: [16, 60], fogColor: '#0a0608', keyPos: [0, 14, 4], keyIntensity: 1.2, ambient: 0.5, shadowSize: 18 });
  st.add(T.ground(60, 60, '#1a1014'));
  st.add(T.box(16, 1.1, 7, '#5a3a26', 0, 0.55, -9));                                         // stage
  st.add(T.box(18, 12, 0.4, '#3a1018', 0, 6, -12.6));                                        // back curtain
  for (const s of [-1, 1]) { st.add(T.box(3, 12, 0.6, '#b8862e', s * 8.6, 6, -6)); st.add(T.box(0.8, 12, 0.8, '#d9a441', s * 7.3, 6, -5.6)); }
  st.add(T.box(18, 1.6, 0.8, '#b8862e', 0, 11.4, -5.6));                                      // valance
  const rigG = new T.THREE.Group(); rigG.add(T.box(12, 0.35, 0.35, '#1a1620', 0, 0, 0)); for (let i = 0; i < 12; i++) { const l = T.cyl(0.18, 0.24, 0.45, '#121016', -5.5 + i, -0.35, 0); rigG.add(l); const bulb = T.sphere(0.12, T.basic('#fff3d0'), -5.5 + i, -0.6, 0); rigG.add(bulb); }
  for (const s of [-1, 1]) rigG.add(T.cyl(0.02, 0.02, 10, '#b8b0a0', s * 5.5, 5, 0)); rigG.position.set(0, 9.5, -9); st.add(rigG);
  const sh = T.shaft(3, 9, '#fff3d6', 0.09); sh.position.set(0, 5, -9); st.add(sh);
  const spot = new T.THREE.SpotLight(0xfff0d0, 120, 30, 0.35, 0.5, 1.2); spot.position.set(0, 12, -6); spot.target.position.set(0, 1, -9); spot.castShadow = true; st.add(spot, spot.target);
  for (let i = 0; i < 6; i++) { const f = T.figure3D(i === 2 ? CAST.leob : CAST.kidb, { rim: M.rim, pose: POSES.stand, s: 0.9 }); f.position.set(-5 + i * 2, 1.1, -9.5); f.rotation.y = Math.PI / 2; st.add(f); }
  const scr = T.box(9, 4, 0.3, '#0c1828', 0, -2.6, 0.3); rigG.add(scr); const glowP = T.plane ? null : null; rigG.add(T.box(8.6, 3.6, 0.05, T.basic('#1d5a78'), 0, -2.6, 0.5));
  st.add(T.crowd3D({ rows: 14, perRow: 40, width: 20, step: 1.0, rise: 0.32, z0: -3.5, colors: ['#1e1418', '#2a1a20', '#24161c'], seed: 9 }));
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) st.add(T.box(2, 1.2, 1.2, '#3a1018', s * 11, 6 + k * 0.4, -1 + k * 4));
  return { stage: st, rigG };
}
function town(T, p) {
  const M = mood(p.mood || 'night'), st = T.stage({ mood: p.mood || 'night', fov: 40, fog: [30, 110], keyPos: [-10, 14, 10], keyIntensity: 2.2, ambient: 1.6 });
  const fill = new T.THREE.PointLight(0xffd59a, 60, 30, 1.5); fill.position.set(2, 5, 4); st.add(fill);
  st.add(T.ground(120, 120, M.road, T.tiles(M.road, 10, [12, 12])));
  for (let i = -6; i <= 6; i++) { const b = T.building(5, 7 + ((i * 37) % 5) * 2, 6, { color: '#2a2640', win: M.practical, lit: 0.45, seed: 40 + i }); b.position.set(i * 6.2, (7 + ((i * 37) % 5) * 2) / 2, -12); st.add(b); }
  for (let i = -5; i <= 5; i++) { st.add(T.box(0.5, 0.1, 3, '#d8d0c4', i * 6, 0.02, 0)); }
  for (const x of [-14, -4, 6, 16]) { st.add(T.cyl(0.07, 0.09, 4.5, '#15121c', x, 2.25, -4)); st.add(T.sphere(0.25, T.basic('#ffd59a'), x, 4.6, -4)); const s = T.shaft(2.6, 4.5, M.practical, 0.07); s.position.set(x, 2.3, -4); st.add(s); }
  const car = new T.THREE.Group(); car.add(T.box(4.2, 0.9, 1.8, '#7c818c', 0, 0.75, 0)); car.add(T.box(2.4, 0.7, 1.6, '#6c717c', -0.2, 1.5, 0)); for (const [x, z] of [[-1.4, 0.9], [1.4, 0.9], [-1.4, -0.9], [1.4, -0.9]]) { const w = T.cyl(0.38, 0.38, 0.25, '#0c0c12', x, 0.38, z); w.rotation.x = Math.PI / 2; car.add(w); } car.add(T.sphere(0.15, T.basic('#fff6d8'), 2.1, 0.8, 0.6), T.sphere(0.15, T.basic('#fff6d8'), 2.1, 0.8, -0.6)); st.add(car);
  st.add(T.tree3D(-20, -7, 1.3, '#1a1626'), T.tree3D(12, -7, 1.1, '#1a1626'));
  return { stage: st, car };
}

const BUILD = { theater, town };
for (const s of E.shots) {
  const p = s.params || {}; if (p.tpl !== '3d') continue;
  registerShot(s.id, {
    kind: '3d',
    init(T, info) { return BUILD[p.s3](T, p); },
    draw(st, t, info, T) {
      const d = info.dur, m = p.move || {};
      if (p.s3 === 'theater') {
        if (m.type === 'dolly') T.dolly(st.stage.camera, t, [[0, { pos: m.from || [0, 6, 14], look: [0, 3, -9] }], [d, { pos: m.to || [0, 4, 8], look: [0, 3.5, -9] }]]);
        else T.orbit(st.stage.camera, t, { target: [0, 3, -6], radius: m.radius || 16, height: m.h || [7, 5], from: m.from ?? -0.5, to: m.to ?? 0.35, dur: d });
        if (p.rigShake) st.rigG.rotation.z = Math.sin(t * 9) * 0.01;
      } else {
        const k = ease.out(prog(t, 0, d)); st.car.position.set(lerp(m.carFrom ?? -30, m.carTo ?? 2, k), 0, 2.5);
        T.dolly(st.stage.camera, t, [[0, { pos: m.from || [-10, 3, 16], look: [0, 1.5, 0] }], [d, { pos: m.to || [4, 2.2, 11], look: [2, 1.2, 0] }]]);
      }
    },
    overlay(g, t, info) { if (p.freeze) freezeLook(g, t, {}); if (p.label) UI.readout(g, { value: p.label, x: E.W * 0.06, y: E.H * 0.88, a: Math.min(1, t / 0.4, (info.dur - t) / 0.3) }); },
  });
}
