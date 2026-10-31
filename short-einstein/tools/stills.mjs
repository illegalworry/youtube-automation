// Быстрые проверочные кадры: один бандл, много кадров.  node tools/stills.mjs 30 120 ... → checks/f<кадр>.png
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Video", chromiumOptions: { gl: "angle" } });
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: f, output: `checks/f${f}.png`, scale: 0.5, chromiumOptions: { gl: "angle" } });
  console.log("ok", f);
}
