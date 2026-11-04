import React from "react";
import { useCtx } from "../ctx";
import { BLACK } from "../theme";
import type { Prop } from "../types";
import { rng } from "../util";
import { G, mat, shade } from "./geo";
import { Ball, Box, Cone, Cyl, Plane, Shadow } from "./prims";
import { SkyDome } from "./Sky";

// Предметы степи: юрты, кони, ошейник, знамя, костры, телеги, стены городов.
// Локальные оси: конь и телега смотрят в +z (к камере). rotation 90 = вправо, −90 = влево.

const FELT = "#f4efe3";
const DARK_WOOD = "#4a2f1d";

export const Yurt: React.FC<{ c?: string }> = ({ c }) => {
  const felt = c ?? FELT;
  return (
    <group>
      <Shadow p={[0, 0.01, 0]} s={[2.5, 2.5]} />
      <Cyl c={felt} p={[0, 0.8, 0]} s={[1.9, 1.6, 1.9]} />
      <Cone c={shade(felt, -0.03)} p={[0, 2.0, 0]} s={[2.15, 1.0, 2.15]} />
      {/* круг дымового отверстия */}
      <Cyl c="#2a2018" p={[0, 2.46, 0]} s={[0.3, 0.1, 0.3]} />
      <Cyl c={shade(felt, -0.12)} p={[0, 1.62, 0]} s={[1.95, 0.08, 1.95]} />
      {/* ленты по бокам */}
      <Cyl c="#c45a3b" p={[0, 1.15, 0]} s={[1.93, 0.07, 1.93]} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        return <Box key={i} c={shade(felt, -0.1)} p={[Math.sin(a) * 1.0, 2.0, Math.cos(a) * 1.0]} s={[0.04, 1.0, 0.04]} r={[0.0, a, 0]} />;
      })}
      {/* дверь: тёмное дерево с рамой */}
      <Box c={DARK_WOOD} p={[0, 0.62, 0.93]} s={[0.78, 1.25, 0.12]} />
      <Box c={shade(DARK_WOOD, 0.08)} p={[0, 0.62, 0.995]} s={[0.62, 1.1, 0.04]} />
      <Box c="#2a1a10" p={[0, 0.62, 1.02]} s={[0.04, 1.1, 0.02]} />
      <Ball c="#d9a441" p={[0.2, 0.6, 1.03]} s={0.035} />
    </group>
  );
};

export const Tent: React.FC<{ c?: string }> = ({ c }) => {
  const felt = c ?? "#e8dcc4";
  return (
    <group>
      <Shadow p={[0, 0.01, 0]} s={[1.8, 1.4]} />
      <Cone c={felt} p={[0, 0.85, 0]} s={[1.5, 1.7, 1.5]} r={[0, Math.PI / 4, 0]} />
      <Cone c="#2a1f18" p={[0, 0.5, 0.58]} s={[0.4, 1.0, 0.1]} />
      <Cyl c={DARK_WOOD} p={[0, 1.78, 0]} s={[0.03, 0.4, 0.03]} lo />
    </group>
  );
};

const Leg: React.FC<{ x: number; z: number; ang: number; c: string; hoof: string }> = ({ x, z, ang, c, hoof }) => (
  <group position={[x, 0.66, z]} rotation={[ang, 0, 0]}>
    <Cyl c={c} p={[0, -0.3, 0]} s={[0.105, 0.62, 0.105]} lo />
    <Cyl c={hoof} p={[0, -0.64, 0]} s={[0.12, 0.1, 0.12]} lo />
  </group>
);

export const Horse: React.FC<{ c?: string; t: number; moving: boolean; saddle?: boolean; seed?: number }> = ({ c, t, moving, saddle = true, seed = 0 }) => {
  const body = c ?? "#8a5a3a";
  const dark = shade(body, -0.16);
  const maneC = "#2b1d14";
  const g = moving ? Math.sin((t + seed) * 12) * 0.7 : 0;
  const idle = Math.sin((t + seed) * 1.6);
  const bobY = moving ? Math.abs(Math.sin((t + seed) * 12)) * 0.05 : 0;
  return (
    <group>
      <Shadow p={[0, 0.01, 0]} s={[0.7, 1.35]} />
      <group position={[0, bobY - 0.14, 0]}>
        {/* корпус: короткий и крепкий */}
        <Ball c={body} p={[0, 1.05, 0]} s={[0.46, 0.44, 0.95]} />
        <Ball c={shade(body, 0.04)} p={[0, 1.1, 0.5]} s={[0.36, 0.38, 0.4]} />
        <Ball c={body} p={[0, 1.08, -0.5]} s={[0.38, 0.4, 0.42]} />
        {/* шея и голова */}
        <group position={[0, 1.25, 0.82]} rotation={[0.55 + idle * 0.03, 0, 0]}>
          <Cyl c={body} p={[0, 0.3, 0]} s={[0.17, 0.62, 0.2]} />
          <Box c={maneC} p={[0, 0.3, -0.13]} s={[0.07, 0.66, 0.12]} />
          <Box c={maneC} p={[0, 0.58, 0.08]} s={[0.12, 0.1, 0.18]} />
        </group>
        <group position={[0, 1.7, 1.02]} rotation={[0.95 + idle * 0.04, 0, 0]}>
          <Box c={body} p={[0, 0.0, 0.1]} s={[0.22, 0.26, 0.5]} />
          <Box c={dark} p={[0, -0.07, 0.36]} s={[0.2, 0.19, 0.12]} />
          <Cone c={body} p={[0.075, 0.2, -0.04]} s={[0.07, 0.17, 0.07]} />
          <Cone c={body} p={[-0.075, 0.2, -0.04]} s={[0.07, 0.17, 0.07]} />
          <Ball c="#171210" p={[0.115, 0.06, 0.18]} s={0.03} e />
          <Ball c="#171210" p={[-0.115, 0.06, 0.18]} s={0.03} e />
        </group>
        {/* длинный хвост */}
        <group position={[0, 1.2, -0.92]} rotation={[0.3 + idle * 0.05, 0, 0]}>
          <Box c={maneC} p={[0, -0.35, -0.04]} s={[0.12, 0.75, 0.1]} />
        </group>
        {/* седло и стремена */}
        {saddle ? (
          <group position={[0, 1.4, 0.0]}>
            <Box c="#b0452f" p={[0, -0.04, 0]} s={[0.66, 0.05, 0.62]} />
            <Box c="#6b3a22" p={[0, 0.03, 0]} s={[0.42, 0.1, 0.5]} />
            <Box c="#6b3a22" p={[0, 0.12, -0.26]} s={[0.4, 0.2, 0.06]} />
            <Box c="#6b3a22" p={[0, 0.1, 0.25]} s={[0.12, 0.16, 0.06]} />
            {[0.34, -0.34].map((x, i) => (
              <group key={i} position={[x, -0.22, 0]}>
                <Box c="#3a2a1d" p={[0, 0.1, 0]} s={[0.025, 0.3, 0.025]} />
                <Cyl c="#8a8f98" p={[0, -0.08, 0]} s={[0.1, 0.03, 0.1]} r={[0, 0, Math.PI / 2]} lo />
              </group>
            ))}
          </group>
        ) : null}
      </group>
      <Leg x={0.17} z={0.5} ang={g} c={body} hoof={BLACK} />
      <Leg x={-0.17} z={0.5} ang={-g} c={dark} hoof={BLACK} />
      <Leg x={0.17} z={-0.5} ang={-g} c={body} hoof={BLACK} />
      <Leg x={-0.17} z={-0.5} ang={g} c={dark} hoof={BLACK} />
    </group>
  );
};

// Деревянная колодка: тяжёлая квадратная доска с отверстием для шеи. Ставится на героя через prop (x, y, z) или лежит.
export const Collar: React.FC = () => (
  <group>
    {/* тяжёлая квадратная доска ~1.3 × 1.3 с отверстием для шеи; видна сверху и спереди */}
    <Box c="#8a6244" p={[0, 0, 0.5]} s={[1.3, 0.14, 0.3]} />
    <Box c="#7a5538" p={[0, 0, -0.5]} s={[1.3, 0.14, 0.3]} />
    <Box c="#8a6244" p={[0.5, 0, 0]} s={[0.3, 0.14, 0.7]} />
    <Box c="#7a5538" p={[-0.5, 0, 0]} s={[0.3, 0.14, 0.7]} />
    <Box c="#a9784f" p={[0, 0.075, 0.5]} s={[1.3, 0.012, 0.3]} />
    <Box c="#5a3d28" p={[0.65, 0.0, 0]} s={[0.04, 0.16, 0.2]} />
    <Box c="#9b9fa8" p={[0.67, 0.0, 0.0]} s={[0.02, 0.1, 0.1]} />
  </group>
);

export const Arrows: React.FC = () => (
  <group>
    {[-0.07, -0.035, 0, 0.035, 0.07, 0.1].map((o, i) => (
      <group key={i} position={[o, 0.5 + i * 0.01, 0]} rotation={[0, 0, (i - 2.5) * 0.015]}>
        <Cyl c="#c8a26a" s={[0.012, 1.0, 0.012]} lo />
        <Cone c="#6f747d" p={[0, 0.54, 0]} s={[0.025, 0.09, 0.025]} />
        <Box c="#e8e2d6" p={[0, -0.45, 0]} s={[0.05, 0.12, 0.004]} />
      </group>
    ))}
    <Cyl c="#a85a3b" p={[0.01, 0.5, 0]} s={[0.12, 0.05, 0.12]} />
    <Cyl c="#a85a3b" p={[0.01, 0.1, 0]} s={[0.1, 0.03, 0.1]} />
  </group>
);

const flame = (t: number, i: number, a: number) => 1 + 0.18 * Math.sin(t * 9 + i * 2.1) * a;

export const Campfire: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Shadow p={[0, 0.01, 0]} s={[0.9, 0.9]} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i / 6) * Math.PI * 2;
      return <Ball key={i} c="#8d8f96" p={[Math.sin(a) * 0.5, 0.08, Math.cos(a) * 0.5]} s={[0.14, 0.1, 0.14]} lo />;
    })}
    <Cyl c="#5a3d28" p={[0, 0.14, 0]} s={[0.07, 0.8, 0.07]} r={[0, 0, 1.2]} lo />
    <Cyl c="#4a3220" p={[0, 0.16, 0]} s={[0.07, 0.8, 0.07]} r={[0.0, 1.5, 1.2]} lo />
    <Cone c="#f08a2c" e p={[0, 0.5, 0]} s={[0.38, 0.8 * flame(t, 0, 1), 0.38]} />
    <Cone c="#ffc94a" e p={[0.05, 0.45, 0.03]} s={[0.26, 0.6 * flame(t, 1, 1), 0.26]} />
    <Cone c="#fff1b0" e p={[0, 0.4, 0]} s={[0.14, 0.38 * flame(t, 2, 1), 0.14]} />
    {/* искры */}
    {Array.from({ length: 7 }).map((_, i) => {
      const ph = ((t * 0.9 + i * 0.37) % 1.4) / 1.4;
      return <Ball key={i} c="#ffd36b" e p={[Math.sin(i * 2.3 + t) * 0.25 * ph, 0.7 + ph * 1.6, Math.cos(i * 1.7) * 0.2 * ph]} s={0.025 * (1 - ph) + 0.005} />;
    })}
    <pointLight position={[0, 0.9, 0.3]} intensity={5 + Math.sin(t * 11) * 0.8} distance={7} color="#ffb04d" />
  </group>
);

export const Torch: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Cyl c="#6b4a2b" p={[0, 0.7, 0]} s={[0.04, 1.4, 0.04]} lo />
    <Cyl c="#2a1f18" p={[0, 1.42, 0]} s={[0.07, 0.14, 0.07]} lo />
    <Cone c="#f08a2c" e p={[0, 1.65, 0]} s={[0.17, 0.42 * flame(t, 0, 1), 0.17]} />
    <Cone c="#ffd86a" e p={[0, 1.6, 0]} s={[0.1, 0.26 * flame(t, 1, 1), 0.1]} />
    {Array.from({ length: 4 }).map((_, i) => {
      const ph = ((t * 1.1 + i * 0.4) % 1.2) / 1.2;
      return <Ball key={i} c="#ffd36b" e p={[Math.sin(i * 3 + t) * 0.15 * ph, 1.8 + ph * 0.8, 0]} s={0.02 * (1 - ph) + 0.004} />;
    })}
    <pointLight position={[0, 1.9, 0.2]} intensity={2.5} distance={5} color="#ffb04d" />
  </group>
);

// Белое знамя с девятью хвостами на высоком древке
export const Banner: React.FC<{ t: number; c?: string }> = ({ t, c }) => {
  const cloth = c ?? "#fbf8f0";
  return (
    <group>
      <Shadow p={[0, 0.01, 0]} s={[0.5, 0.5]} />
      <Cyl c="#6b4a2b" p={[0, 2.6, 0]} s={[0.055, 5.2, 0.055]} lo />
      <Box c="#6b4a2b" p={[0, 4.9, 0]} s={[1.0, 0.07, 0.07]} />
      <Ball c="#d9a441" p={[0, 5.3, 0]} s={0.13} rough={0.4} />
      <Cone c="#d9a441" p={[0, 5.15, 0]} s={[0.07, 0.25, 0.07]} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -0.42 + i * 0.105;
        const sw = Math.sin(t * 2.2 + i * 0.7) * 0.18;
        return (
          <group key={i} position={[x, 4.85, 0.02]} rotation={[0, 0, sw * 0.4]}>
            <Box c={cloth} p={[0, -0.7, 0]} s={[0.07, 1.4 - (i % 3) * 0.12, 0.012]} r={[sw * 0.3, 0, 0]} />
          </group>
        );
      })}
      <Box c={shade(cloth, -0.06)} p={[0, 4.78, 0.02]} s={[0.96, 0.14, 0.015]} />
    </group>
  );
};

// Простая деревянная телега, смотрит в +z (оглобли вперёд)
export const Cart: React.FC<{ c?: string; wool?: boolean }> = ({ c, wool }) => {
  const wood = c ?? "#8a6244";
  return (
    <group>
      <Shadow p={[0, 0.01, 0]} s={[1.2, 1.7]} />
      <Box c={wood} p={[0, 0.72, 0]} s={[1.3, 0.1, 2.1]} />
      <Box c={shade(wood, -0.08)} p={[0.65, 0.95, 0]} s={[0.07, 0.45, 2.1]} />
      <Box c={shade(wood, -0.08)} p={[-0.65, 0.95, 0]} s={[0.07, 0.45, 2.1]} />
      <Box c={shade(wood, -0.05)} p={[0, 0.95, -1.05]} s={[1.3, 0.45, 0.07]} />
      {wool ? <Ball c="#f4efe3" p={[0, 1.1, 0]} s={[0.62, 0.42, 0.9]} lo /> : null}
      {[1, -1].map((s) => (
        <group key={s} position={[0.72 * s, 0.5, 0.1]}>
          <Cyl c="#4a3220" s={[0.5, 0.08, 0.5]} r={[0, 0, Math.PI / 2]} />
          <Cyl c={shade(wood, -0.15)} s={[0.09, 0.1, 0.09]} r={[0, 0, Math.PI / 2]} />
        </group>
      ))}
      <Box c={shade(wood, -0.1)} p={[0.35, 0.6, 1.7]} s={[0.05, 0.05, 1.4]} />
      <Box c={shade(wood, -0.1)} p={[-0.35, 0.6, 1.7]} s={[0.05, 0.05, 1.4]} />
    </group>
  );
};

export const CityWall: React.FC<{ c?: string }> = ({ c }) => {
  const sand = c ?? "#d9bf8c";
  return (
    <group>
      <Box c={sand} p={[0, 1.8, 0]} s={[8, 3.6, 0.9]} />
      <Box c={shade(sand, -0.08)} p={[0, 3.7, 0]} s={[8.1, 0.2, 1.0]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Box key={i} c={sand} p={[-3.6 + i * 0.8, 3.95, 0]} s={[0.45, 0.35, 0.9]} />
      ))}
      <Box c={shade(sand, -0.22)} p={[0, 1.1, 0.46]} s={[1.3, 2.2, 0.05]} />
      <Ball c={shade(sand, -0.22)} p={[0, 2.2, 0.46]} s={[0.65, 0.5, 0.05]} />
    </group>
  );
};

export const Tower: React.FC<{ c?: string; t?: number }> = ({ c }) => {
  const sand = c ?? "#d9bf8c";
  return (
    <group>
      <Cyl c={sand} p={[0, 2.8, 0]} s={[1.3, 5.6, 1.3]} />
      <Cyl c={shade(sand, -0.1)} p={[0, 5.7, 0]} s={[1.5, 0.25, 1.5]} />
      <Ball c="#3f9a9f" p={[0, 6.3, 0]} s={[1.0, 0.95, 1.0]} />
      <Cyl c="#d9a441" p={[0, 7.3, 0]} s={[0.04, 0.8, 0.04]} lo />
      <Plane c={shade(sand, -0.3)} p={[0, 4.2, 0.66]} s={[0.3, 0.7, 1]} />
    </group>
  );
};

export const Dome: React.FC<{ c?: string }> = ({ c }) => {
  const sand = c ?? "#d9bf8c";
  return (
    <group>
      <Box c={sand} p={[0, 1.4, 0]} s={[3.0, 2.8, 3.0]} />
      <Cyl c={shade(sand, -0.08)} p={[0, 2.95, 0]} s={[1.5, 0.35, 1.5]} />
      <Ball c="#3f9a9f" p={[0, 3.25, 0]} s={[1.45, 1.35, 1.45]} />
      <Cyl c="#d9a441" p={[0, 4.9, 0]} s={[0.04, 0.8, 0.04]} lo />
      <Plane c={shade(sand, -0.3)} p={[-0.7, 1.5, 1.51]} s={[0.5, 1.0, 1]} />
      <Plane c={shade(sand, -0.3)} p={[0.7, 1.5, 1.51]} s={[0.5, 1.0, 1]} />
    </group>
  );
};

export const SteppeProp: React.FC<{ prop: Prop; t: number; moving: boolean }> = ({ prop, t, moving }) => {
  switch (prop.type) {
    case "yurt":
      return <Yurt c={prop.color} />;
    case "tent":
      return <Tent c={prop.color} />;
    case "horse":
      return <Horse c={prop.color} t={t} moving={moving} saddle={prop.label !== "bare"} seed={prop.x * 0.3} />;
    case "collar":
      return <Collar />;
    case "arrows":
      return <Arrows />;
    case "campfire":
      return <Campfire t={t} />;
    case "torch":
      return <Torch t={t} />;
    case "banner":
      return <Banner t={t} c={prop.color} />;
    case "cart":
      return <Cart c={prop.color} wool={prop.label === "wool"} />;
    case "citywall":
      return <CityWall c={prop.color} />;
    case "tower":
      return <Tower c={prop.color} />;
    case "dome":
      return <Dome c={prop.color} />;
    case "flag":
      return <Flag prop={prop} t={t} />;
    default:
      return null;
  }
};

// Небольшой клановый флаг (цвет клана — color)
const Flag: React.FC<{ prop: Prop; t: number }> = ({ prop, t }) => {
  const col = prop.color ?? "#b0452f";
  return (
    <group>
      <Cyl c="#6b4a2b" p={[0, 1.6, 0]} s={[0.04, 3.2, 0.04]} lo />
      <Box c={col} p={[0.45, 2.85, 0]} s={[0.9, 0.55, 0.02]} r={[0, Math.sin(t * 2.4) * 0.12, 0]} />
      <Box c={shade(col, -0.18)} p={[0.45, 2.85, 0.015]} s={[0.9, 0.1, 0.02]} r={[0, Math.sin(t * 2.4) * 0.12, 0]} />
    </group>
  );
};

// Слоистый фон степи: небо, дальние холмы, средний план, трава на переднем плане. Параллакс получается от движения камеры.
export const SteppeBackdrop: React.FC<{ theme: ReturnType<typeof useCtx>["theme"]; seed: number; river?: boolean; city?: boolean }> = ({ theme, seed, river, city }) => {
  const r = rng(seed);
  const far = shade(theme.ground, -0.12);
  const mid = shade(theme.ground, -0.05);
  const rock = "#a89a86";
  const reeds = Array.from({ length: 48 }).map((_, i) => ({ x: -16 + r() * 32, z: 1.5 + r() * 3.5, h: 0.5 + r() * 0.5, k: r() }));
  return (
    <group>
      <SkyDome top={theme.sky} horizon={theme.fog} seed={seed} />
      {/* земля */}
      <mesh geometry={G.plane} rotation={[-Math.PI / 2, 0, 0]} scale={[220, 220, 1]} position={[0, 0, -40]}>
        <primitive object={mat(theme.ground)} attach="material" />
      </mesh>
      <mesh geometry={G.plane} rotation={[-Math.PI / 2, 0, 0]} scale={[60, 8, 1]} position={[0, 0.003, 3]}>
        <primitive object={mat(shade(theme.ground, 0.04))} attach="material" />
      </mesh>
      {/* дальние холмы, слой 1 */}
      {[-60, -35, -8, 22, 48].map((x, i) => (
        <Ball key={`f${i}`} c={shade(far, i % 2 ? 0.02 : -0.02)} p={[x, -2.5, -75 - (i % 2) * 5]} s={[24 + (i % 3) * 6, 11 + (i % 2) * 4, 8]} lo />
      ))}
      {/* скалистые холмы, слой 2 */}
      {[-30, 12, 36].map((x, i) => (
        <group key={`r${i}`} position={[x, 0, -40 - i * 4]}>
          <Ball c={mid} p={[0, -1, 0]} s={[14, 5, 6]} lo />
          <Box c={rock} p={[-2, 2.0, 1]} s={[2.4, 2.8, 1.8]} r={[0.0, 0.5, 0.08]} />
          <Box c={shade(rock, -0.08)} p={[1, 1.6, 1.4]} s={[2.0, 2.2, 1.6]} r={[0.0, -0.4, -0.06]} />
          <Box c={shade(rock, 0.06)} p={[3.4, 1.1, 1.0]} s={[1.4, 1.5, 1.2]} r={[0, 0.9, 0]} />
        </group>
      ))}
      {/* средний план: пологие холмы */}
      {[-24, -6, 16, 30].map((x, i) => (
        <Ball key={`m${i}`} c={shade(mid, i % 2 ? 0.03 : -0.01)} p={[x, -1.4, -22 - (i % 2) * 3]} s={[11, 3.2, 5]} lo />
      ))}
      {/* одинокое дерево */}
      <group position={[14, 0, -14]}>
        <Cyl c="#7a5a3e" p={[0, 1.2, 0]} s={[0.16, 2.4, 0.16]} lo />
        <Ball c={theme.leaf} p={[0, 3.0, 0]} s={[1.5, 1.1, 1.5]} lo />
        <Ball c={shade(theme.leaf, 0.06)} p={[0.8, 2.6, 0.3]} s={[0.9, 0.7, 0.9]} lo />
      </group>
      {river ? (
        <group>
          <mesh geometry={G.plane} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -9]} scale={[120, 9, 1]}>
            <primitive object={mat("#7fb6d6", { rough: 0.2 })} attach="material" />
          </mesh>
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} c="#bfe0f0" p={[-14 + i * 3.1, 0.03, -9 + ((i * 7) % 5) * 0.6 - 1.2]} s={[1.2, 0.01, 0.06]} />
          ))}
          <Box c={shade(theme.ground, -0.08)} p={[0, 0.02, -4.4]} s={[120, 0.02, 0.5]} />
        </group>
      ) : null}
      {city ? (
        <group position={[0, 0, -22]}>
          <CityWall />
          <group position={[-5, 0, 0.3]}>
            <Tower />
          </group>
          <group position={[5, 0, 0.3]}>
            <Tower />
          </group>
          <group position={[-2, 0, -2.5]}>
            <Dome />
          </group>
          <group position={[3, 0, -3]}>
            <Dome c="#e4c795" />
          </group>
        </group>
      ) : null}
      {/* трава переднего плана: пучки лезвий */}
      {reeds.map((g, i) => (
        <group key={i} position={[g.x, 0, g.z]}>
          {[-0.08, 0, 0.08].map((o, j) => (
            <Cone key={j} c={shade(theme.leaf, (g.k - 0.5) * 0.12)} p={[o, g.h / 2, 0]} s={[0.05, g.h, 0.05]} r={[0, 0, o * 1.4]} />
          ))}
        </group>
      ))}
      {/* кусты высокой травы, дальний слой */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = -22 + r() * 44;
        const z = -6 - r() * 8;
        return (
          <group key={`t${i}`} position={[x, 0, z]}>
            {[-0.1, 0, 0.1].map((o, j) => (
              <Cone key={j} c={shade(theme.leaf, -0.06)} p={[o, 0.45, 0]} s={[0.07, 0.9 + r() * 0.3, 0.07]} r={[0, 0, o * 1.6]} />
            ))}
          </group>
        );
      })}
    </group>
  );
};
