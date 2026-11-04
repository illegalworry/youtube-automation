// Сравнение стилей: один и тот же пробный набор сцен в нескольких палитрах -> out/styles/<стиль>-<n>.jpg
// Запуск: node scripts/styles.mjs [golden pastel dusk night]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const themes = process.argv.slice(2).length ? process.argv.slice(2) : ["golden", "pastel", "dusk", "night"];
const sample = JSON.parse(readFileSync("data/style-sample.json", "utf8"));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
mkdirSync("out/styles", { recursive: true });
for (const theme of themes) {
  const project = { ...sample, theme };
  const composition = await selectComposition({ serveUrl, id: "Stickman", inputProps: { project }, chromiumOptions: { gl: process.env.GL ?? "angle" }, logLevel: "error" });
  for (const [i, s] of project.scenes.entries()) {
    const frame = Math.round((s.start + (s.end - s.start) * 0.55) * project.fps);
    const output = `out/styles/${theme}-${i + 1}.jpg`;
    await renderStill({ serveUrl, composition, frame, output, inputProps: { project }, imageFormat: "jpeg", jpegQuality: 82, scale: 0.5, chromiumOptions: { gl: process.env.GL ?? "angle" }, logLevel: "error" });
    console.log(output);
  }
}
