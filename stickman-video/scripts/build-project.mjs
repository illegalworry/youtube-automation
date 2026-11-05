// Генератор раскадровки: первые ~93 с ролика про Тэмуджина
import { writeFileSync } from "node:fs";

const RED = "#e8704f", DARK = "#2b2230";
const hero = (o = {}) => ({ id: "temu", shirt: RED, pants: "#3a3f66", sleeves: "long", hair: "bun", hairColor: DARK, print: "dino", ...o });
const father = (o = {}) => ({ id: "yesuge", shirt: "#3a5a8c", pants: "#2b2f45", sleeves: "long", hair: "none", ...o });
const mother = (o = {}) => ({ id: "hoelun", shirt: "#c0507a", sleeves: "long", hair: "bun", hairColor: "#4a2a30", ...o });
const mid1 = (o = {}) => ({ id: "mid1", shirt: "#b99ad8", sleeves: "short", hair: "bob", hairColor: "#6a4a3a", ...o });
const mid2 = (o = {}) => ({ id: "mid2", shirt: "#e9c46a", sleeves: "short", hair: "headband", hairColor: "#3a2a22", ...o });
const old1 = (o = {}) => ({ id: "old1", shirt: "#8a8f98", sleeves: "long", hair: "none", ...o });
const old2 = (o = {}) => ({ id: "old2", shirt: "#6c7a6a", sleeves: "long", hair: "cap", hairColor: "#555", ...o });
const tatar = (o = {}) => ({ id: "tatar", shirt: "#7a8a5a", sleeves: "short", hair: "cap", hairColor: "#333", ...o });
const bro = (o = {}) => ({ id: "bro", shirt: "#4aa3a2", sleeves: "short", hair: "puff", hairColor: DARK, scale: 0.6, ...o });

// [фраза.start, note, сцена без start/end]
const P = [
  [0.0, "You are born with a blood clot clenched in your fist.", {
    location: "room", time: "night", transition: "fade", camera: { shot: "medium", move: "dolly-in" },
    props: [{ type: "bed", x: 0, z: -1.2, rotation: 0 }, { type: "lamp", x: -3.5, z: -3 }],
    actors: [hero({ x: 0.3, z: 0.3, scale: 0.55, action: "lie", face: "scared", facing: "camera", held: "coin" }), mid1({ x: -1.6, z: 0.3, action: "idle", face: "worried", facing: 60 })],
    title: { text: "BLOOD CLOT.", at: 1.2, until: 3.0, position: "top", size: "big" }, sfx: [{ name: "heartbeat", at: 0.2, volume: 1 }] }],
  [3.64, "The midwives freeze.", {
    location: "room", time: "night", transition: "flash", camera: { shot: "medium", move: "push", target: [0, 1.4, 0] },
    actors: [mid1({ x: -1.2, z: 0, action: "scared", face: "scared", facing: 25 }), mid2({ x: 1.2, z: 0, action: "scared", face: "surprised", facing: -25 })],
    sfx: [{ name: "impact", at: 0.1, volume: 1 }] }],
  [5.32, "The old men whisper that it is a sign that this boy will command men.", {
    location: "cafe", time: "night", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: [0, 0.9, 0] },
    actors: [old1({ x: -1.1, z: 0, action: "talk", talking: true, face: "worried", facing: 55 }), old2({ x: 1.1, z: 0, action: "think", face: "surprised", facing: -55 })],
    title: { text: "A SIGN.", at: 2.6, until: 4.4, position: "bottom", size: "big" } }],
  [10.46, "But a sign promises nothing.", {
    location: "studio", bg: "#4a4560", transition: "cut", camera: { shot: "close", move: "dolly-in", target: "old1" },
    actors: [old1({ x: 0, z: 0, action: "shrug", face: "smirk", facing: "camera" })],
    title: { text: "NOTHING.", at: 0.4, until: 1.8, position: "right", size: "big" } }],
  [12.94, "By the time you are nine, your father will be poisoned.", {
    location: "park", time: "day", transition: "whip", camera: { shot: "wide", move: "dolly-in", target: [0, 0.8, 0] },
    actors: [hero({ x: -2.4, z: 0.8, scale: 0.7, action: "idle", face: "worried", facing: 40 }),
      father({ x: 0.4, z: 0, action: "idle", face: "happy", held: "cup", facing: "camera", beats: [{ at: 1.3, action: "fall", face: "surprised" }, { at: 2.0, action: "lie", face: "sleepy" }] })],
    title: { text: "AGE 9.", at: 0.2, until: 1.6, position: "top", size: "big" }, sfx: [{ name: "thud", at: 1.9, volume: 1 }] }],
  [16.3, "Your own tribe will abandon your family to die on the step.", {
    location: "park", time: "sunset", transition: "cut", camera: { shot: "medium", move: "dolly-out", target: [0, 1, 0] },
    actors: [mother({ x: -1.2, z: 1.4, action: "cry", face: "sad", facing: "camera" }), hero({ x: 0.2, z: 1.6, scale: 0.7, action: "scared", face: "scared", facing: "camera" }), bro({ x: 1.5, z: 1.5, action: "scared", face: "sad", facing: "camera" })],
    crowd: { count: 12, area: [-7, -3, 7, -1.5], action: "walk", face: "neutral", facing: "away", seed: 5 },
    title: { text: "ABANDONED.", at: 0.8, until: 2.8, position: "top", size: "big" }, sfx: [{ name: "swoosh", at: 0.2, volume: 1 }] }],
  [20.16, "At sixteen, you will walk through an enemy camp with a wooden board locked around your neck,", {
    location: "park", time: "sunset", transition: "cut", camera: { shot: "wide", move: "pan-right", target: "temu" },
    actors: [hero({ x: -3, z: 1, scale: 0.9, action: "walk", face: "worried", facing: 90, to: [2.5, 1], held: "sign", heldText: "" })],
    crowd: { count: 14, area: [-6, -3, 6, -0.5], action: "angry", face: "angry", facing: "camera", seed: 8 },
    title: { text: "AGE 16.", at: 0.3, until: 2.0, position: "top", size: "big" } }],
  [23.5, "and anyone will be free to strike you.", {
    location: "park", time: "sunset", transition: "cut", camera: { shot: "close", move: "shake", target: "temu" },
    actors: [hero({ x: 0, z: 1, scale: 0.9, action: "scared", face: "scared", facing: "camera", held: "sign", heldText: "" }), { id: "foe", x: 1.4, z: 0.6, shirt: "#8a2a2a", sleeves: "short", hair: "cap", hairColor: "#222", action: "angry", face: "angry", facing: -70 }],
    title: { text: "FREE TO STRIKE.", at: 0.6, until: 3.2, position: "left", size: "medium" }, sfx: [{ name: "impact", at: 2.0, volume: 0.8 }] }],
  [27.32, "And from that position, you will build the largest land empire in history.", {
    location: "plaza", time: "day", transition: "flash", camera: { shot: "wide", move: "rise", target: [0, 1.4, 0] },
    screen: { lines: ["LARGEST", "LAND EMPIRE"] },
    actors: [hero({ x: 0, z: 1.2, action: "cheer", face: "grin", facing: "camera" })],
    crowd: { count: 14, area: [-6, -3.5, 6, -0.5], action: "cheer", face: "happy", facing: "camera", seed: 2 },
    title: { text: "EMPIRE.", at: 1.8, until: 4.0, position: "bottom", size: "big" }, sfx: [{ name: "rise", at: 0.2, volume: 1 }] }],
  [32.68, "Here is how.", {
    location: "studio", bg: "#f2c9a0", transition: "whip", camera: { shot: "medium", move: "push", target: "temu" },
    actors: [hero({ x: 2.2, z: 0, action: "point", face: "smirk", facing: "camera" })],
    title: { text: "HERE'S HOW.", at: 0.1, until: 1.4, position: "left", size: "big" } }],
  [34.24, "The year is around 1162.", {
    location: "studio", bg: "#9fc7d4", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: [0, 1.4, 0] },
    props: [{ type: "screen", x: 0, z: -1, y: 0.8, lines: ["AROUND", "1162"] }],
    actors: [], sfx: [{ name: "tick", at: 0.2, volume: 1 }] }],
  [36.88, "You are born by the Onon River.", {
    location: "park", time: "day", transition: "fade", camera: { shot: "wide", move: "pan-right", target: [0, 1, 0] },
    props: [{ type: "sign", x: 2.5, z: -0.5, lines: ["ONON", "RIVER"] }],
    actors: [mother({ x: -1.2, z: 0.4, action: "idle", face: "happy", facing: 40 }), hero({ x: -0.2, z: 0.4, scale: 0.4, action: "idle", face: "happy", facing: "camera" })] }],
  [38.76, "At the edge of a world no one is writing books about yet.", {
    location: "park", time: "sunset", transition: "cut", camera: { shot: "wide", move: "dolly-out", target: [0, 1, -2] },
    actors: [{ id: "lone", x: 4, z: -1.5, shirt: "#9aa5b1", sleeves: "short", hair: "none", action: "idle", face: "neutral", facing: "away" }] }],
  [42.08, "There are no kings here, no cities, no laws.", {
    location: "park", time: "day", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: "lone" },
    props: [{ type: "sign", x: -2.5, z: -0.5, lines: ["NO KINGS", "NO CITIES", "NO LAWS"], scale: 1.4 }],
    actors: [{ id: "lone", x: 1.5, z: 0.5, shirt: "#9aa5b1", sleeves: "short", hair: "none", action: "shrug", face: "neutral", facing: -40 }],
    sfx: [{ name: "buzz", at: 0.4, volume: 0.8 }] }],
  [45.68, "Only pastures, horse herds, and tribes", {
    location: "park", time: "day", transition: "cut", camera: { shot: "wide", move: "pan-left", target: [0, 1, 0] },
    actors: [], crowd: { count: 9, area: [-6, -2.5, 6, 1], action: "idle", face: "neutral", facing: "away", seed: 11 } }],
  [48.5, "that have been slaughtering each other for generations over every stream.", {
    location: "park", time: "sunset", transition: "whip", camera: { shot: "medium", move: "shake", target: [0, 1, 0] },
    actors: [{ id: "clanA", x: -3, z: 0, shirt: "#a23b3b", sleeves: "short", hair: "cap", hairColor: "#222", action: "run", face: "angry", facing: 90, to: [-0.4, 0] },
      { id: "clanB", x: 3, z: 0, shirt: "#3b7aa2", sleeves: "short", hair: "none", action: "run", face: "angry", facing: -90, to: [0.4, 0] }],
    sfx: [{ name: "impact", at: 2.2, volume: 1 }] }],
  [52.6, "Your father's name is Yesuge.", {
    location: "studio", bg: "#a9c4e8", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: "yesuge" },
    actors: [father({ x: 0, z: 0, action: "idle", face: "neutral", facing: "camera" })],
    title: { text: "YESUGE.", at: 0.4, until: 1.6, position: "left", size: "big" } }],
  [54.62, "He is the leader of a small clan.", {
    location: "park", time: "day", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: "yesuge" },
    actors: [father({ x: 0, z: 0.8, action: "idle", face: "grin", facing: "camera" })],
    crowd: { count: 6, area: [-3, -2.5, 3, -1], action: "idle", face: "neutral", facing: "camera", seed: 4 } }],
  [56.48, "A warrior and a raider with far too many enemies.", {
    location: "park", time: "sunset", transition: "cut", camera: { shot: "wide", move: "dolly-in", target: "yesuge" },
    actors: [father({ x: -2, z: 0.8, action: "angry", face: "angry", facing: 70 })],
    crowd: { count: 10, area: [1, -2, 6, 0.5], action: "angry", face: "angry", facing: -70, seed: 9 } }],
  [60.24, "On the very day you are born, he returns from a raid with a captured Tatar named Temujin.", {
    location: "street", time: "day", transition: "cut", camera: { shot: "medium", move: "pan-right", target: [0, 1.2, 0] },
    actors: [father({ x: -3, z: 0.5, action: "walk", face: "grin", facing: 90, to: [1, 0.5] }), tatar({ x: -4.4, z: 0.5, action: "walk", face: "scared", facing: 90, to: [-0.4, 0.5] })],
    title: { text: "TEMUJIN.", at: 2.6, until: 4.6, position: "bottom", size: "big" } }],
  [65.66, "So that is the name you are given.", {
    location: "studio", bg: "#f6d9a8", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: "temu" },
    actors: [hero({ x: 0, z: 0, scale: 0.6, action: "idle", face: "happy", facing: "camera" })], sfx: [{ name: "ding", at: 0.4, volume: 1 }] }],
  [67.72, "It is not yet Genghis Khan.", {
    location: "studio", bg: "#c9b6e4", transition: "cut", camera: { shot: "wide", move: "dolly-in", target: [0, 1.2, 0] },
    props: [{ type: "screen", x: 0, z: -1, y: 0.8, lines: ["NOT YET", "GENGHIS KHAN"] }], actors: [] }],
  [69.8, "That name you will have to earn, and the price will be enormous.", {
    location: "studio", bg: "#e7a98f", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: "temu" },
    props: [{ type: "money", x: 2.4, z: 0.2 }],
    actors: [hero({ x: -0.6, z: 0, action: "think", face: "worried", facing: "camera" })],
    title: { text: "THE PRICE.", at: 1.8, until: 3.4, position: "right", size: "big" }, sfx: [{ name: "cash", at: 1.8, volume: 0.9 }] }],
  [74.24, "You are taught what the step demands.", {
    location: "park", time: "day", transition: "whip", camera: { shot: "medium", move: "dolly-in", target: [0, 1.2, 0] },
    actors: [father({ x: -1.1, z: 0, action: "talk", talking: true, face: "happy", facing: 55 }), hero({ x: 1.1, z: 0, scale: 0.7, action: "idle", face: "neutral", facing: -55 })] }],
  [76.62, "At five, you ride.", {
    location: "park", time: "day", transition: "cut", camera: { shot: "wide", move: "pan-right", target: "temu" },
    actors: [hero({ x: -4, z: 0.5, scale: 0.6, action: "run", face: "grin", facing: 90, to: [4, 0.5] })],
    title: { text: "AGE 5.", at: 0.2, until: 1.2, position: "top", size: "big" }, sfx: [{ name: "whoosh", at: 0.2, volume: 1 }] }],
  [78.48, "At six, you shoot a small bow.", {
    location: "park", time: "day", transition: "cut", camera: { shot: "medium", move: "push", target: "temu" },
    actors: [hero({ x: -0.5, z: 0, scale: 0.65, action: "point", face: "grin", facing: 75 })],
    props: [{ type: "box", x: 3.2, z: 0, scale: 0.6 }],
    title: { text: "AGE 6.", at: 0.2, until: 1.4, position: "top", size: "big" }, sfx: [{ name: "pop", at: 1.1, volume: 1 }] }],
  [80.82, "You know what a coming blizzard smells like.", {
    location: "studio", bg: "#bcd7e6", transition: "cut", camera: { shot: "close", move: "dolly-in", target: "temu" },
    actors: [hero({ x: 0, z: 0, scale: 0.7, action: "think", face: "worried", facing: "camera" })] }],
  [83.08, "You know how horses behave when wolves are near.", {
    location: "park", time: "night", transition: "cut", camera: { shot: "medium", move: "dolly-in", target: "temu" },
    actors: [hero({ x: 0, z: 0.5, scale: 0.7, action: "scared", face: "worried", facing: 50 })], sfx: [{ name: "heartbeat", at: 0.2, volume: 0.8 }] }],
  [86.48, "You cannot read because your people have no writing.", {
    location: "room", time: "day", transition: "cut", camera: { shot: "close", move: "static", target: "temu" },
    actors: [hero({ x: 0, z: 0, scale: 0.7, action: "shrug", face: "worried", facing: "camera", held: "book" })],
    title: { text: "NO WRITING.", at: 0.8, until: 2.4, position: "right", size: "medium" }, sfx: [{ name: "buzz", at: 0.6, volume: 0.7 }] }],
  [89.42, "But you know how to listen, and that will matter more.", {
    location: "studio", bg: "#e8704f", transition: "fade", camera: { shot: "extreme", move: "dolly-in", target: "temu" },
    actors: [hero({ x: 0, z: 0, scale: 0.8, action: "idle", face: "smirk", facing: "camera" })], sfx: [{ name: "ding", at: 1.8, volume: 0.8 }] }],
];

const DURATION = 93.0;
const starts = P.map(([t], i) => (i === 0 ? 0 : +Math.max(0, t - 0.15).toFixed(2)));
const scenes = P.map(([, note, s], i) => ({
  start: starts[i], end: i === P.length - 1 ? DURATION : starts[i + 1], note, ...s,
}));

const project = {
  fps: 30, width: 1920, height: 1080, duration: DURATION, theme: "pastel", letterbox: true, subtitles: false,
  audio: {
    voice: "audio/voice.mp3",
    musicParts: [{ from: 0, src: "music/tense.wav" }, { from: starts[9], src: "music/calm.wav" }, { from: starts[24], src: "music/mystery.wav" }],
    musicDb: -22, sfxDb: -13,
  },
  scenes,
};
writeFileSync("data/project.json", JSON.stringify(project, null, 2));
console.log(`scenes: ${scenes.length}`);
