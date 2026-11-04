import React, { useMemo } from "react";
import * as THREE from "three";
import { G } from "./geo";
import { rng } from "../util";

const skyTex = (top: string, horizon: string) => {
  const cv = document.createElement("canvas");
  cv.width = 4;
  cv.height = 256;
  const c = cv.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, top);
  g.addColorStop(1, horizon);
  c.fillStyle = g;
  c.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// Небо-градиент и мягкие облака далеко за холмами
export const SkyDome: React.FC<{ top: string; horizon: string; seed: number }> = ({ top, horizon, seed }) => {
  const tex = useMemo(() => skyTex(shadeTop(top), horizon), [top, horizon]);
  const clouds = useMemo(() => {
    const r = rng(seed + 11);
    return Array.from({ length: 7 }).map(() => ({ x: -70 + r() * 140, y: 22 + r() * 22, w: 14 + r() * 16 }));
  }, [seed]);
  return (
    <group position={[0, 0, -70]} scale={1.7}>
      <mesh geometry={G.plane} position={[0, 40, -118]} scale={[420, 160, 1]}>
        <meshBasicMaterial map={tex} fog={false} toneMapped={false} depthWrite={false} />
      </mesh>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, -112]}>
          <mesh geometry={G.sphereLo} scale={[c.w, c.w * 0.18, 1]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.55} fog={false} toneMapped={false} />
          </mesh>
          <mesh geometry={G.sphereLo} position={[c.w * 0.3, c.w * 0.05, 0]} scale={[c.w * 0.6, c.w * 0.16, 1]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} fog={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const shadeTop = (hex: string) => {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * 1.15), Math.max(0, hsl.l - 0.1));
  return `#${c.getHexString()}`;
};
