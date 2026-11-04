// Собирает data/project.json из сцен scripts/s1.mjs + s2.mjs. Запуск: node scripts/build-project.mjs
import { writeFileSync } from "node:fs";
import { build } from "./lib.mjs";
import "./s1.mjs";
import "./s2.mjs";

const DURATION = 700;
const project = {
  fps: 30,
  width: 1920,
  height: 1080,
  duration: DURATION,
  theme: "pastel",
  letterbox: true,
  subtitles: false,
  audio: {
    voice: "audio/voice.mp3",
    musicParts: [
      { from: 0, src: "music/mystery.wav" },
      { from: 32.62, src: "music/calm.wav" },
      { from: 122.72, src: "music/tense.wav" },
      { from: 307.18, src: "music/calm.wav", offset: 40 },
      { from: 380.54, src: "music/mystery.wav", offset: 30 },
      { from: 497.44, src: "music/upbeat.wav" },
      { from: 526.58, src: "music/tense.wav", offset: 60 },
      { from: 619.58, src: "music/mystery.wav", offset: 70 },
      { from: 681.88, src: "music/calm.wav", offset: 60 },
    ],
    musicDb: -22,
    sfxDb: -13,
  },
  scenes: build(DURATION),
};
writeFileSync("data/project.json", JSON.stringify(project, null, 1));
console.log(`${project.scenes.length} scenes`);
