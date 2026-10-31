// РОЛИК «The Clerk Who Broke Time»: шоты по таймингам голоса + голос + музыка + субтитры. Всё время — в секундах ГОЛОСА.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import plan from "./plan.json";
import { FPS, Scene3D, Room, Box, Sign, Clock, Bench, Plant, Desk, Chair, Shelf, Door, Doodle, Actor, pointKeys, bonkAt, useSec, HIP, HEAD_Z } from "./kit";

// Montserrat Black лежит локально (public/montserrat-900.woff2) — рендер не зависит от доступа к Google Fonts.
const fontFamily = "MontserratBlack";
if (typeof document !== "undefined") {
  const h = delayRender("font");
  new FontFace(fontFamily, `url(${staticFile("montserrat-900.woff2")})`, { weight: "900" }).load()
    .then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}
type V3 = [number, number, number];

// ===================================================================== помощники
// Появление с «бонком» на ударном слове (до этого предмета нет).
const Pop: React.FC<{ t: number; p: V3; amt?: number; children: React.ReactNode }> = ({ t, p, amt = 0.45, children }) => {
  const sec = useSec();
  return <group position={p} scale={sec < t ? 0.0001 : bonkAt(sec, t, amt)}>{children}</group>;
};
const Bonk: React.FC<{ t: number[]; p: V3; amt?: number; children: React.ReactNode }> = ({ t, p, amt = 0.35, children }) => {
  const sec = useSec();
  const s = t.reduce((k, tt) => k * bonkAt(sec, tt, amt), 1);
  return <group position={p} scale={s}>{children}</group>;
};
const Ball: React.FC<{ p: V3; r: number; c: string; glow?: boolean }> = ({ p, r, c, glow }) => (
  <mesh position={p} castShadow>
    <sphereGeometry args={[r, 32, 20]} />
    {glow ? <meshBasicMaterial color={new THREE.Color(c).multiplyScalar(1.6)} toneMapped={false} /> : <meshStandardMaterial color={c} roughness={0.35} />}
  </mesh>
);
const rest = (side: "f" | "b") => (side === "f" ? -0.2 : 0.2);
// «Штамп»: рука вверх-вниз несколько раз
const stampKeys = (t0: number, t1: number, step = 0.55): [number, number, number][] => {
  const k: [number, number, number][] = [[t0, rest("b"), HIP + 0.06]];
  for (let t = t0 + 0.2; t < t1; t += step) k.push([t, 0.34, HIP + 0.5], [t + step * 0.5, 0.34, HIP + 0.2]);
  k.push([t1 + 0.2, rest("b"), HIP + 0.06]);
  return k;
};

// ===================================================================== персонажи
const ALBERT = { body: "#8c8f99", hair: "spiky" as const };
const BOSS = { body: "#2f4f86", hair: "slick" as const, tie: "#c0392b" };

// ===================================================================== ЛОКАЦИЯ 1: университет
const Hallway: React.FC = () => (<>
  <Room wall="#cfd8c4" wain="#6f8a6a" floor="#8a6a4a" />
  <Door p={[0.95, 0, -1.95]} c="#7a4a2c" number="101" />
  <Bonk t={[3.5]} p={[0.95, 1.6, -1.86]}><Sign p={[0, 0, 0]} w={0.82} h={0.26} text="NO VACANCIES" bg="#c0392b" fg="#ffffff" sz={62} glow={0.35} /></Bonk>
  <Sign p={[-0.3, 2.35, -1.94]} w={1.5} h={0.32} text="UNIVERSITY" bg="#20354f" fg="#ffffff" sz={78} />
  <Sign p={[-1.7, 1.65, -1.94]} w={0.5} h={0.7} text="PHYSICS" bg="#f2c230" fg="#20354f" sz={60} glow={0.15} />
  <Sign p={[-2.4, 1.55, -1.94]} w={0.45} h={0.6} text="MATH" bg="#2f9e9a" fg="#ffffff" sz={70} glow={0.15} />
  <Clock p={[-1.7, 2.45, -1.94]} hh={9} mm={5} />
  <Bench p={[-1.9, 0, -1.6]} />
  <Shelf p={[2.3, 0, -1.75]} w={0.8} />
  <Plant p={[2.75, 0, -0.9]} h={0.8} />
  <Box p={[1.65, 0.2, -1.7]} s={[0.3, 0.4, 0.3]} c="#5d6670" />
  {/* резюме в руке Альберта */}
  <Box p={[-0.72, 0.86, -0.72]} s={[0.17, 0.23, 0.01]} c="#fbf7ea" line />
</>);

// ===================================================================== ЛОКАЦИЯ 2: патентное бюро (шоты 2–6, 9)
type OfficeShot = "intro" | "desk" | "papers" | "board" | "emc" | "clocks" | "tramp" | "end";
const Office: React.FC<{ shot: OfficeShot }> = ({ shot }) => {
  const sec = useSec();
  const fastClock = shot === "clocks" && sec > 32.4;
  return (<>
    <Room wall="#e2b77a" wain="#8a5a3a" floor="#6b4a36" sky="#cfe6ff" />
    {/* часы на стене — «ружьё» ролика */}
    <Bonk t={shot === "end" ? [61.4] : shot === "desk" ? [11.8, 13.8] : []} p={[-1.75, 2.15, -1.94]}><Clock p={[0, 0, 0]} r={0.22} hh={10} mm={Math.floor(sec * 4) % 60} /></Bonk>
    <Bonk t={shot === "end" ? [61.5] : []} p={[-1.1, 2.2, -1.94]}><Clock p={[0, 0, 0]} r={0.16} hh={3} mm={fastClock ? Math.floor(sec) % 60 : 40} /></Bonk>
    {shot === "clocks" ? (<>
      <Sign p={[-1.75, 1.78, -1.94]} w={0.42} h={0.16} text="YOU" bg="#20354f" fg="#ffffff" sz={80} />
      <Pop t={32.6} p={[-1.1, 1.86, -1.94]}><Sign p={[0, 0, 0]} w={0.42} h={0.16} text="FAST" bg="#c0392b" fg="#ffffff" sz={80} /></Pop>
    </>) : null}
    <Bonk t={shot === "end" ? [61.6] : []} p={[2.6, 1.6, -1.94]}><Clock p={[0, 0, 0]} r={0.14} hh={7} mm={20} /></Bonk>
    {/* вывеска и календарь */}
    <Bonk t={shot === "intro" ? [7.7] : []} p={[2.0, 2.55, -1.94]}><Sign p={[0, 0, 0]} w={1.3} h={0.28} text="PATENT OFFICE" bg="#20354f" fg="#f2c230" sz={70} /></Bonk>
    <Bonk t={shot === "intro" ? [5.8] : []} p={[-0.7, 2.45, -1.94]}><Sign p={[0, 0, 0]} w={0.42} h={0.3} text="1905" bg="#fbf7ea" fg="#c0392b" sz={110} glow={0.2} /></Bonk>
    {/* доска */}
    <Box p={[0.55, 1.6, -1.95]} s={[1.9, 1.05, 0.05]} c="#24493a" r={0.9} />
    <Box p={[0.55, 1.05, -1.9]} s={[1.9, 0.04, 0.08]} c="#8a5a3a" />
    {shot === "papers" ? (
      <group position={[0.55, 1.75, -1.91]} rotation={[0, 0, sec > 18.6 ? Math.min(Math.PI, (sec - 18.6) * 9) : 0]}>
        <Sign p={[0, 0, 0]} w={0.9} h={0.25} text="PHYSICS" bg="#24493a" fg="#ffffff" sz={95} glow={0.3} />
      </group>) : null}
    {shot === "board" ? (<>
      <Pop t={20.3} p={[0.05, 1.85, -1.91]}><Sign p={[0, 0, 0]} w={0.7} h={0.24} text="ATOMS" bg="#24493a" fg="#ffffff" sz={95} glow={0.3} /></Pop>
      <Pop t={22.1} p={[1.05, 1.85, -1.91]}><Sign p={[0, 0, 0]} w={0.7} h={0.24} text="LIGHT" bg="#24493a" fg="#f2c230" sz={95} glow={0.3} /></Pop>
      <Pop t={25.3} p={[0.55, 1.4, -1.91]}><Sign p={[0, 0, 0]} w={1.0} h={0.26} text="NOBEL PRIZE" bg="#c8a24a" fg="#20180f" sz={80} glow={0.35} /></Pop>
    </>) : null}
    {shot === "emc" ? <Pop t={27.3} p={[0.55, 1.62, -1.91]} amt={0.6}><Sign p={[0, 0, 0]} w={1.5} h={0.6} text="E=mc²" bg="#24493a" fg="#ffffff" sz={190} glow={0.4} /></Pop> : null}
    {shot === "end" || shot === "intro" || shot === "desk" ? <Sign p={[0.55, 1.75, -1.91]} w={0.9} h={0.22} text="INVENTIONS" bg="#24493a" fg="#ffffff" sz={80} glow={0.25} /> : null}
    {/* стол Альберта */}
    <Desk p={[0.25, 0, -1.25]} w={1.3} />
    <Chair p={[1.15, 0, -1.55]} rotY={-0.5} c="#7a3b22" />
    <Bonk t={shot === "desk" ? [12.7] : []} p={[0.1, 0.84, -1.3]}>
      <Box p={[0, 0, 0]} s={[0.36, 0.13, 0.28]} c="#2a2d33" />
      <Box p={[0, 0.13, -0.08]} s={[0.24, 0.16, 0.01]} c="#fbf7ea" />
    </Bonk>
    {[0, 1, 2].map((i) => <Box key={i} p={[0.62, 0.8 + i * 0.04, -1.25 + (i % 2) * 0.02]} s={[0.24, 0.035, 0.32]} c={i % 2 ? "#efe6d2" : "#fbf7ea"} />)}
    <Bonk t={shot === "desk" ? [11.8, 13.8] : []} p={[-0.25, 0.95, -1.35]}><Clock p={[0, 0, 0]} r={0.09} hh={2} mm={15} /></Bonk>
    <Box p={[-0.25, 0.83, -1.38]} s={[0.12, 0.08, 0.06]} c="#7a3b22" />
    {shot === "papers" || shot === "board" || shot === "emc" ? (
      <Pop t={shot === "papers" ? 16.9 : 0} p={[0.68, 0.98, -1.15]}><Sign p={[0, 0, 0]} w={0.42} h={0.16} text="4 PAPERS" bg="#fbf7ea" fg="#c0392b" sz={70} glow={0.2} /></Pop>) : null}
    {/* фон */}
    <Shelf p={[2.4, 0, -1.75]} w={0.9} />
    <Box p={[-2.55, 0.65, -1.7]} s={[0.55, 1.3, 0.5]} c="#7d8592" r={0.5} />
    {[0.35, 0.75, 1.15].map((y) => <Box key={y} p={[-2.55, y, -1.44]} s={[0.4, 0.02, 0.02]} c="#c9ccd1" metal={0.8} line={false} />)}
    <Plant p={[2.7, 0, -0.6]} h={0.9} />
    <Desk p={[-1.7, 0, 0.6]} rotY={0.3} w={1.1} />
  </>);
};

// батут с шаром (шот 6): шар падает на «ball», ткань прогибается, шарик скатывается на «Mass bending»
const Trampoline: React.FC = () => {
  const sec = useSec();
  const drop = Math.min(1, Math.max(0, (sec - 37.4) / 0.4));
  const dip = drop >= 1 ? 0.22 + 0.04 * Math.exp(-(sec - 37.8) * 3) * Math.cos((sec - 37.8) * 14) : 0;
  const by = drop < 1 ? 2.4 - 1.72 * drop * drop : 0.68 - dip;
  const ang = Math.max(0, sec - 42.4) * 2.6, rr = Math.max(0.22, 0.48 - Math.max(0, sec - 42.4) * 0.13);
  const marble = sec < 42.4 ? [0.48, 0.0] : [Math.cos(ang) * rr, Math.sin(ang) * rr];
  const md = sec < 42.4 ? 0 : (1 - rr / 0.48) * dip;
  const C: V3 = [0.1, 0, -0.1];
  return (<group position={C}>
    <mesh position={[0, 0.5, 0]}><torusGeometry args={[0.62, 0.05, 12, 48]} /><meshStandardMaterial color="#2f6fd6" /></mesh>
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
      <mesh rotation={[0, 0, 0]}><circleGeometry args={[0.6, 48]} /><meshStandardMaterial color="#1d1f23" side={THREE.DoubleSide} /></mesh>
    </group>
    {dip > 0 ? <mesh position={[0, 0.5 - dip / 2, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.6, dip, 48, 1, true]} /><meshStandardMaterial color="#2a2d33" side={THREE.DoubleSide} /></mesh> : null}
    {[0, 1, 2, 3, 4, 5].map((i) => <Box key={i} p={[Math.cos((i * Math.PI) / 3) * 0.6, 0.25, Math.sin((i * Math.PI) / 3) * 0.6]} s={[0.05, 0.5, 0.05]} c="#8d939b" line={false} />)}
    <Ball p={[0, by, 0]} r={0.18} c="#3b2b6e" />
    <Ball p={[marble[0], 0.55 - md, marble[1]]} r={0.05} c="#e46b2b" />
  </group>);
};

// ===================================================================== ЛОКАЦИЯ 3: крыша-обсерватория, 1919, ночь
const Rooftop: React.FC = () => {
  const sec = useSec();
  const moonX = interpolate(sec, [45.9, 46.9], [-0.4, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const star: V3 = [-1.5, 3.3, -6], ctrl: V3 = [0.15, 3.1, -5.2], end: V3 = [0.35, 1.45, -1.25];
  const dots = Array.from({ length: 22 }, (_, i) => {
    const k = i / 21, a = (1 - k) * (1 - k), b = 2 * k * (1 - k), c = k * k;
    return [star[0] * a + ctrl[0] * b + end[0] * c, star[1] * a + ctrl[1] * b + end[1] * c, star[2] * a + ctrl[2] * b + end[2] * c] as V3;
  });
  const shown = Math.floor(interpolate(sec, [47.1, 48.6], [0, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (<>
    <Box p={[0, -0.05, 0]} s={[9, 0.1, 6]} c="#4a4f5c" line={false} />
    <Box p={[0, 0.3, -2.3]} s={[9, 0.6, 0.2]} c="#7a4a3a" />
    <Box p={[-2.4, 0.9, -1.8]} s={[0.6, 1.8, 0.6]} c="#8a4630" />
    <Box p={[2.5, 1.2, -2.0]} s={[0.8, 1.0, 0.8]} c="#5d6670" />
    <Box p={[2.5, 0.35, -2.0]} s={[0.1, 0.7, 0.1]} c="#2a2d33" />
    <Box p={[-1.6, 0.2, -1.2]} s={[0.4, 0.4, 0.4]} c="#b8784a" /><Box p={[-1.55, 0.55, -1.2]} s={[0.3, 0.3, 0.3]} c="#c98d5a" />
    <Box p={[1.9, 0.35, -0.5]} s={[0.15, 0.7, 0.15]} c="#2a2d33" />
    <Box p={[1.9, 0.75, -0.5]} s={[0.2, 0.2, 0.2]} c="#ffc477" e="#ffb04a" ei={1.6} />
    {/* телескоп */}
    <group position={[0.35, 0, -1.25]}>
      {[-1, 0, 1].map((s) => <Box key={s} p={[s * 0.18, 0.55, s === 0 ? -0.18 : 0.1]} s={[0.04, 1.1, 0.04]} c="#7a4a2c" rot={[s === 0 ? -0.2 : 0.12, 0, s * 0.18]} />)}
      <mesh position={[0, 1.3, -0.15]} rotation={[-0.75, 0, 0]} castShadow><cylinderGeometry args={[0.07, 0.11, 0.9, 20]} /><meshStandardMaterial color="#c8a24a" metalness={0.5} roughness={0.35} /></mesh>
    </group>
    <Pop t={45.0} p={[-1.0, 1.55, -2.15]}><Sign p={[0, 0, 0]} w={0.6} h={0.3} text="1919" bg="#20354f" fg="#f2c230" sz={110} glow={0.5} /></Pop>
    <Pop t={49.6} p={[1.55, 1.75, -2.15]}><Sign p={[0, 0, 0]} w={1.0} h={0.36} text="LIGHT BENDS!" bg="#fbf7ea" fg="#20180f" sz={70} glow={0.45} /></Pop>
    {/* солнце и затмение */}
    <mesh position={[0.9, 3.0, -6.5]}><circleGeometry args={[0.55, 48]} /><meshBasicMaterial color={[1.6, 1.25, 0.5]} toneMapped={false} /></mesh>
    <mesh position={[moonX, 3.0, -6.45]}><circleGeometry args={[0.52, 48]} /><meshBasicMaterial color="#0a0d1c" /></mesh>
    {/* звёзды */}
    {Array.from({ length: 26 }, (_, i) => <Ball key={i} p={[((i * 37) % 90) / 10 - 4.5, 2.2 + ((i * 53) % 25) / 10, -7]} r={0.025} c="#fffbe8" glow />)}
    <Ball p={star} r={0.07} c="#fff3b0" glow />
    {dots.slice(0, shown).map((p, i) => <Ball key={"d" + i} p={p} r={0.022} c="#fff3b0" glow />)}
  </>);
};

// ===================================================================== ЛОКАЦИЯ 4: улица сегодня
const Street: React.FC = () => {
  const sec = useSec();
  const pinX = interpolate(sec, [57.8, 59.6], [0.25, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const err = sec > 56.8;
  return (<>
    <Box p={[0, -0.05, -0.3]} s={[9, 0.1, 2.6]} c="#3b3f46" line={false} />
    <Box p={[0, 0.02, -2.0]} s={[9, 0.14, 1.0]} c="#b9b2a4" />
    <Box p={[0, 0.02, 1.4]} s={[9, 0.14, 1.0]} c="#b9b2a4" />
    {[-3, -1.6, -0.2, 1.2, 2.6].map((x) => <Box key={x} p={[x, 0.01, -0.3]} s={[0.6, 0.02, 0.08]} c="#f2f0e6" line={false} />)}
    {/* дома */}
    <Box p={[-2.4, 1.8, -3.0]} s={[1.8, 3.6, 1.0]} c="#d07a3a" />
    <Box p={[0.75, 2.2, -3.0]} s={[2.3, 4.4, 1.0]} c="#4f8f95" />
    <Box p={[3.1, 1.5, -3.0]} s={[1.6, 3.0, 1.0]} c="#d65a7a" />
    {[-2.8, -2.0].flatMap((x) => [2.2, 3.0].map((y) => <Box key={x + "_" + y} p={[x, y, -2.48]} s={[0.4, 0.5, 0.04]} c="#bfe0ff" e="#bfe0ff" ei={0.3} />))}
    {[2.7, 3.5].map((x) => <Box key={x} p={[x, 2.3, -2.48]} s={[0.4, 0.5, 0.04]} c="#bfe0ff" e="#bfe0ff" ei={0.3} />)}
    {/* карта-билборд: метка уезжает */}
    <Box p={[0.75, 1.85, -2.46]} s={[1.7, 1.05, 0.05]} c="#2a2d33" />
    <Sign p={[0.75, 1.85, -2.42]} w={1.6} h={0.95} text="" bg={err ? "#f3d6d0" : "#d9efd2"} fg="#000" glow={0.3} />
    <Box p={[0.75, 1.85, -2.41]} s={[1.5, 0.06, 0.01]} c="#ffffff" line={false} /><Box p={[0.45, 1.85, -2.41]} s={[0.06, 0.85, 0.01]} c="#ffffff" line={false} />
    <Box p={[pinX, 1.95, -2.38]} s={[0.1, 0.16, 0.03]} c="#c0392b" />
    <Pop t={58.6} p={[0.75, 1.1, -2.4]}><Sign p={[0, 0, 0]} w={1.2} h={0.3} text="10 KM / DAY" bg="#c0392b" fg="#ffffff" sz={90} glow={0.4} /></Pop>
    {/* спутник GPS */}
    <Bonk t={[54.5, 56.1]} p={[-1.0, 3.3, -2.6]} amt={0.4}>
      <Box p={[0, 0, 0]} s={[0.3, 0.3, 0.3]} c="#c8a24a" metal={0.4} />
      <Box p={[-0.42, 0, 0]} s={[0.5, 0.22, 0.02]} c="#2f6fd6" /><Box p={[0.42, 0, 0]} s={[0.5, 0.22, 0.02]} c="#2f6fd6" />
      <Sign p={[0, -0.28, 0.02]} w={0.4} h={0.16} text="GPS" bg="#20354f" fg="#ffffff" sz={90} glow={0.4} />
    </Bonk>
    {/* улица */}
    <Box p={[-1.9, 1.3, -1.8]} s={[0.07, 2.6, 0.07]} c="#2a2d33" /><Box p={[-1.75, 2.6, -1.8]} s={[0.4, 0.08, 0.15]} c="#2a2d33" />
    <Box p={[-1.6, 2.53, -1.8]} s={[0.2, 0.06, 0.12]} c="#fff0c8" e="#fff0c8" ei={0.8} line={false} />
    <Bench p={[2.3, 0.09, -2.0]} c="#3f8a4b" w={1.3} />
    <Plant p={[-2.7, 0.09, -1.8]} h={1.0} /><Plant p={[3.2, 0.09, -1.8]} h={0.9} />
    <group position={[2.6, 0, -0.1]}>
      <Box p={[0, 0.35, 0]} s={[1.6, 0.4, 0.75]} c="#f2c230" /><Box p={[-0.1, 0.72, 0]} s={[0.9, 0.35, 0.7]} c="#f2c230" />
      <Box p={[-0.1, 0.72, 0.36]} s={[0.8, 0.26, 0.01]} c="#bfe0ff" line={false} />
      {[-0.5, 0.5].map((x) => <mesh key={x} position={[x, 0.15, 0.38]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.06, 20]} /><meshStandardMaterial color="#1d1f23" /></mesh>)}
    </group>
    {/* телефон в руке */}
    <group position={[-0.62, 0.95, -0.55]}>
      <Box p={[0, 0, 0]} s={[0.13, 0.22, 0.02]} c="#1d1f23" />
      <Sign p={[0, 0, 0.012]} w={0.11} h={0.19} text={err ? "!" : "GPS"} bg={err ? "#c0392b" : "#3f8a4b"} fg="#ffffff" sz={err ? 300 : 140} glow={0.6} />
    </group>
  </>);
};

// ===================================================================== актёры по шотам
const A1: Actor = { pos: [-0.4, 0, -0.8], seed: 1, look: ALBERT,
  expr: [[0, "grin"], [0.6, "proud"], [1.9, "realize"], [2.6, "nervous"], [3.5, "shock"]],
  handF: [[0, -0.32, HIP + 0.42]] };
const P1: Actor = { pos: [0.6, 0, -1.25], seed: 4, look: { body: "#6b4a8a", hair: "bowl" },
  expr: [[0, "stern"], [1.3, "smug"], [2.6, "stern"], [3.5, "smug"]], handB: pointKeys(2.9, 0.5, 0.9, 0.9, "b") };

const BOSS2: Actor = { pos: [0.8, 0, -0.6], seed: 2, look: BOSS,
  expr: [[3.9, "smug"], [5.2, "proud"], [7.7, "smug"], [9.5, "stern"], [11.8, "blank"], [12.7, "smug"], [13.8, "blank"]],
  handF: [[3.9, -0.2, HIP + 0.06], [5.0, -0.2, HIP + 0.06], [5.2, -0.36, HEAD_Z + 0.08], [6.0, -0.36, HEAD_Z + 0.08], [6.2, -0.2, HIP + 0.06]],
  handB: pointKeys(9.5, -0.3, 0.3, 0.8, "b") };
const ALB2: Actor = { pos: [-0.6, 0, -0.85], seed: 1, look: ALBERT,
  expr: [[3.9, "blank"], [5.8, "neutral"], [8.1, "blank"], [9.5, "grin"], [11.8, "blank"], [12.7, "nervous"], [13.8, "blank"]],
  handB: stampKeys(4.2, 11.6) };

const BOSS3: Actor = { ...BOSS2, expr: [[14.5, "smug"], [16.2, "blank"], [17.2, "realize"], [19.0, "shock"]], handF: undefined,
  handB: [[14.5, 0.2, HIP + 0.06]] };
const ALB3: Actor = { ...ALB2, expr: [[14.5, "grin"], [15.5, "proud"], [16.9, "smug"], [17.9, "laugh"], [19.0, "grin"]],
  handB: stampKeys(14.6, 16.6, 0.3) };

const BOSS4: Actor = { pos: [1.2, 0, -0.6], seed: 2, look: BOSS,
  expr: [[19.6, "blank"], [20.3, "realize"], [22.1, "nervous"], [23.3, "blank"], [25.3, "shock"], [26.3, "realize"], [27.3, "shock"]] };
const ALB4: Actor = { pos: [-0.55, 0, -0.85], seed: 1, look: ALBERT,
  expr: [[19.6, "grin"], [20.3, "proud"], [21.5, "smug"], [22.1, "grin"], [24.6, "laugh"], [25.3, "proud"], [26.3, "smug"], [27.3, "proud"], [28.2, "grin"]],
  handB: [...pointKeys(20.3, 0.55, 1.0, 0.9, "b"), ...pointKeys(22.1, 1.0, 1.0, 1.0, "b").slice(1), ...pointKeys(25.3, 0.8, 0.6, 0.8, "b").slice(1), ...pointKeys(27.3, 0.9, 0.8, 1.2, "b").slice(1)] };

const ALB5: Actor = { pos: [-0.55, 0, -0.9], seed: 1, look: ALBERT,
  expr: [[29.1, "grin"], [29.4, "laugh"], [30.2, "smug"], [31.5, "grin"], [32.4, "laugh"], [34.3, "proud"], [35.2, "smug"]],
  walk: [[29.1, -0.55, -0.9], [32.4, -0.55, -0.9], [33.1, 0.9, -0.5], [33.8, -1.2, -0.5], [34.5, 0.9, -0.5], [35.2, -0.55, -0.9]],
  handF: pointKeys(30.2, -0.9, 1.0, 1.0, "f") };
const BOSS5: Actor = { pos: [0.45, 0, -0.95], seed: 2, look: BOSS,
  expr: [[29.1, "blank"], [30.2, "realize"], [31.5, "nervous"], [33.9, "shock"], [34.6, "nervous"], [35.2, "shock"], [36.0, "blank"]] };

const ALB6: Actor = { pos: [-0.75, 0, -0.95], seed: 1, look: ALBERT,
  expr: [[36.8, "smug"], [37.8, "grin"], [39.1, "proud"], [40.3, "smug"], [41.1, "grin"], [42.5, "proud"], [44.2, "laugh"]],
  handB: pointKeys(41.1, 0.9, -0.2, 1.4, "b") };
const BOSS6: Actor = { pos: [0.95, 0, -0.95], seed: 2, look: BOSS,
  expr: [[36.8, "blank"], [37.8, "shock"], [39.1, "nervous"], [41.1, "blank"], [42.5, "realize"], [43.5, "shock"], [44.2, "realize"]] };

const AST1: Actor = { pos: [-0.6, 0, -0.75], seed: 5, look: { body: "#d65a7a", hair: "long" },
  expr: [[44.9, "neutral"], [46.3, "realize"], [47.1, "nervous"], [48.1, "shock"], [49.6, "laugh"], [51.8, "proud"]],
  handF: pointKeys(46.3, -0.2, 1.2, 1.2, "f") };
const AST2: Actor = { pos: [1.15, 0, -0.75], seed: 6, look: { body: "#6aa84f", hair: "bowl", lanyard: true },
  expr: [[44.9, "blank"], [46.6, "realize"], [48.1, "shock"], [49.1, "grin"], [50.9, "laugh"]] };
const ALB7: Actor = { pos: [0.35, 0, -0.2], seed: 1, look: ALBERT,
  walk: [[44.9, 3.6, -0.5], [49.6, 3.6, -0.5], [50.4, 0.3, -0.5]],
  expr: [[44.9, "neutral"], [50.5, "proud"], [51.4, "grin"], [51.8, "laugh"], [52.9, "proud"]],
  handB: [[50.6, 0.2, HIP + 0.06], [50.9, 0.38, HEAD_Z + 0.25], [52.6, 0.38, HEAD_Z + 0.25], [52.9, 0.2, HIP + 0.06]] };

const YOU8: Actor = { pos: [-0.3, 0, -0.6], seed: 7, look: { body: "#e46b2b", hair: "long" },
  expr: [[53.5, "neutral"], [54.5, "grin"], [55.8, "smug"], [56.8, "realize"], [57.8, "nervous"], [58.6, "shock"], [59.6, "nervous"]],
  handF: [[53.5, -0.32, HIP + 0.55]] };
const ALB8: Actor = { pos: [0.9, 0, -1.3], seed: 1, look: ALBERT,
  expr: [[53.5, "smug"], [55.5, "proud"], [56.8, "stern"], [58.6, "smug"]], handB: pointKeys(54.5, -0.6, 1.2, 1.0, "f").map(([t, x, z]) => [t, -x, z] as [number, number, number]) };

const BOSS9: Actor = { pos: [-1.3, 0, -1.0], seed: 2, look: BOSS,
  expr: [[60.1, "blank"], [60.6, "neutral"], [61.4, "realize"], [62.2, "shock"]], handF: pointKeys(61.4, -0.5, 1.3, 1.2, "f") };
const ALB9: Actor = { pos: [-0.3, 0, -0.7], seed: 1, look: ALBERT,
  expr: [[60.1, "grin"], [60.6, "smug"], [61.7, "proud"], [62.4, "laugh"]] };

const Cast: React.FC<{ a: Actor[] }> = ({ a }) => <>{a.map((x, i) => <Doodle key={i} a={x} />)}</>;

// ===================================================================== ШОТЫ
const SHOTS: { t0: number; t1: number; el: React.ReactNode }[] = [
  { t0: 0.0, t1: 3.9, el: (
    <Scene3D t0={0} cam={[[0, [-0.1, 1.3, 1.9], [0.15, 0.8, -1.3], 74], [3.9, [0.15, 1.28, 1.6], [0.2, 0.8, -1.3], 74]]} focus={[-0.4, 1.0, -0.8]}>
      <Hallway /><Cast a={[A1, P1]} />
    </Scene3D>) },
  { t0: 3.9, t1: 8.8, el: (
    <Scene3D t0={3.9} cam={[[3.9, [0.3, 1.35, 2.1], [0.15, 0.85, -1.4], 76], [8.8, [0.05, 1.32, 1.8], [0.15, 0.85, -1.4], 76]]} focus={[0.8, 1.0, -0.6]}>
      <Office shot="intro" /><Cast a={[BOSS2, ALB2]} />
    </Scene3D>) },
  { t0: 8.8, t1: 14.5, el: (
    <Scene3D t0={8.8} cam={[[8.8, [-1.3, 1.25, 1.3], [0.0, 0.8, -1.3], 72], [14.5, [-1.05, 1.25, 1.1], [0.0, 0.8, -1.3], 72]]} focus={[-0.6, 1.0, -0.85]}>
      <Office shot="desk" /><Cast a={[BOSS2, ALB2]} />
    </Scene3D>) },
  { t0: 14.5, t1: 19.6, el: (
    <Scene3D t0={14.5} cam={[[14.5, [1.3, 1.3, 1.7], [0.1, 0.9, -1.4], 74], [19.6, [1.0, 1.3, 1.5], [0.1, 0.9, -1.4], 74]]} focus={[-0.6, 1.0, -0.85]}>
      <Office shot="papers" /><Cast a={[BOSS3, ALB3]} />
    </Scene3D>) },
  { t0: 19.6, t1: 26.3, el: (
    <Scene3D t0={19.6} cam={[[19.6, [0.35, 1.3, 2.1], [0.35, 1.0, -1.5], 76], [26.3, [0.5, 1.3, 1.8], [0.4, 1.0, -1.5], 76]]} focus={[-0.55, 1.0, -0.85]}>
      <Office shot="board" /><Cast a={[BOSS4, ALB4]} />
    </Scene3D>) },
  { t0: 26.3, t1: 29.1, el: (
    <Scene3D t0={26.3} cam={[[26.3, [-0.6, 1.25, 1.7], [0.3, 1.0, -1.6], 72], [29.1, [-0.4, 1.28, 1.5], [0.3, 1.0, -1.6], 72]]} focus={[-0.55, 1.0, -0.85]}>
      <Office shot="emc" /><Cast a={[BOSS4, ALB4]} />
    </Scene3D>) },
  { t0: 29.1, t1: 36.8, el: (
    <Scene3D t0={29.1} cam={[[29.1, [-0.6, 1.32, 1.9], [-0.55, 0.95, -1.6], 76], [36.8, [-0.35, 1.3, 1.65], [-0.45, 0.95, -1.6], 76]]} focus={[0.45, 1.0, -0.95]}>
      <Office shot="clocks" /><Cast a={[ALB5, BOSS5]} />
    </Scene3D>) },
  { t0: 36.8, t1: 44.9, el: (
    <Scene3D t0={36.8} cam={[[36.8, [0.2, 1.55, 2.2], [0.1, 0.6, -0.6], 74], [44.9, [0.05, 1.5, 1.9], [0.1, 0.6, -0.6], 74]]} focus={[0.1, 0.65, -0.1]}>
      <Office shot="tramp" /><Trampoline /><Cast a={[ALB6, BOSS6]} />
    </Scene3D>) },
  { t0: 44.9, t1: 53.5, el: (
    <Scene3D t0={44.9} light="night" bg="#141b3a" cam={[[44.9, [0.2, 1.25, 2.1], [0.25, 0.8, -2.0], 76], [53.5, [0.4, 1.28, 1.8], [0.35, 0.78, -2.0], 76]]} focus={[0.3, 1.0, -0.6]}>
      <Rooftop /><Cast a={[AST1, AST2, ALB7]} />
    </Scene3D>) },
  { t0: 53.5, t1: 60.1, el: (
    <Scene3D t0={53.5} bg="#9fd0ff" cam={[[53.5, [0.1, 1.3, 2.3], [0.25, 0.75, -2.0], 76], [60.1, [0.3, 1.3, 2.0], [0.3, 0.72, -2.0], 76]]} focus={[-0.3, 1.0, -0.6]}>
      <Street /><Cast a={[YOU8, ALB8]} />
    </Scene3D>) },
  { t0: 60.1, t1: 62.9, el: (
    <Scene3D t0={60.1} cam={[[60.1, [-0.5, 1.3, 1.7], [-0.9, 0.8, -1.6], 74], [62.9, [-0.7, 1.3, 1.5], [-0.9, 0.8, -1.6], 74]]} focus={[-1.3, 1.0, -1.0]}>
      <Office shot="end" /><Cast a={[BOSS9, ALB9]} />
    </Scene3D>) },
];

// ===================================================================== субтитры
const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = plan.groups.find((x) => f >= x.start && f < Math.max(x.end, x.start + 6));
  if (!g) return null;
  const s = spring({ frame: f - g.start, fps, config: { damping: 11, stiffness: 240, mass: 0.55 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 600 }}>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: "white", textAlign: "center", maxWidth: 920,
        transform: `scale(${interpolate(s, [0, 1], [0.72, 1])})`, WebkitTextStroke: "16px black", paintOrder: "stroke fill",
        textShadow: "0 6px 0 rgba(0,0,0,0.55)", textTransform: "uppercase" }}>{g.text}</div>
    </AbsoluteFill>
  );
};

export const TOTAL = Math.round(SHOTS[SHOTS.length - 1].t1 * FPS);
export const Video: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t0 * FPS)} durationInFrames={Math.round((s.t1 - s.t0) * FPS)}>{s.el}</Sequence>
      ))}
      <Audio src={staticFile(plan.voice)} />
      <Audio src={staticFile("music.wav")} loop
        volume={(f) => interpolate(f, [0, 20, durationInFrames - 45, durationInFrames], [0, 0.11, 0.11, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Caption />
    </AbsoluteFill>
  );
};
