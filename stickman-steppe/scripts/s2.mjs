import { A, P, R, RS, S, yurt, camp } from "./lib.mjs";

const baby = { scale: 0.35 };
const row = (n, x0, x1, z, o = {}) => Array.from({ length: n }, (_, i) => A("N", x0 + ((x1 - x0) * i) / Math.max(1, n - 1), z, o));

// ── ГЛАВА 3: МЕРКИТЫ, ДЖАМУХА 325–497 ──
{
  const rs = [0, 1, 2].map((i) => R("Mk", -13 - i * 1.4, -1.5 + i * 1.4, 2, -1.5 + i * 1.4, i % 2 ? "#6a4a30" : "#3a2a20", { face: "angry", held: "torch" }));
  S(325.74, { c: ["w", "shake", [0, 0, 0]], tm: "sunset", a: rs.map((r) => r.a), p: [...rs.map((r) => r.h), ...camp()], sfx: [["whoosh", 0.3, 0.8]], note: "one dawn the Merkits attack your camp" });
}
S(328.52, { c: ["c", "dolly-in", "mk"], a: [A("Mk", 0, 0, { id: "mk", action: "angry", face: "angry" })], ti: ["REVENGE.", "bottom"], note: "wanted revenge for years" });
{
  const r = R("Mk", -2, 0.6, 12, 0.6, "#3a2a20", { face: "grin" });
  S(331.54, { c: ["w", "pan-right", [0, 0, 0]], tm: "sunset", a: [r.a, A("B", -2, 0.6, { action: "ride", to: [12, 0.6], y: 0.42, face: "scared", id: "borte" }), A("T", -6, 0.8, { action: "run", to: [2, 0.8], face: "scared", facing: 90 })], p: [r.h, P("horse", -2, 0.6, { to: [12, 0.6] })], sfx: [["whoosh", 0.3, 0.7]], note: "they carry your wife away" });
}
S(336.16, { c: ["w", "dolly-out", "temu"], tm: "sunset", a: [A("T", 0, 0.8, { action: "idle", face: "sad", facing: 90 })], p: [yurt(-6, -6, 1.3), yurt(6, -6, 1.4)], ti: ["NO ARMY.", "top"], note: "you have no army" });
S(337.84, { c: ["m", "pan-right", "togrul"], a: [A("T", -2.6, 0.5, { action: "idle", face: "worried", facing: 50 }), A("N", -4, 0.8, { action: "idle", face: "worried" }), A("N", -4.8, 0, { action: "idle", face: "worried" }), A("G", 2, 0.4, { action: "talk", talking: true, face: "neutral", facing: -50 })], p: [yurt(6.5, -5, 1.5), P("flag", 4.5, -2, { color: "#3b7be0" })], ti: ["TOGRUL, KHAN OF THE KERAITS.", "top", "medium"], note: "a handful of men and Togrul the Khan" });
S(344.0, { c: ["m", "dolly-in", "togrul"], a: [A("T", -1.1, 0.4, { action: "idle", face: "happy", facing: 50, held: "coin" }), A("G", 1.1, 0.4, { action: "idle", face: "happy", facing: -50 })], p: [P("box", -2.2, -0.6, { scale: 0.7 }), P("box", -2.9, -0.8, { scale: 0.7 }), yurt(5, -6, 1.4)], sfx: [["ding", 1.8, 0.5]], note: "you ride to him with gifts, he agrees" });
{
  const r = R("J", -9, 0.6, 1.2, 0.6, "#8a5a3a", { face: "happy" });
  S(347.24, { c: ["m", "pan-right", "jamuka"], a: [r.a, A("T", 2.6, 0.5, { action: "cheer", face: "happy", facing: -60 })], p: [r.h, yurt(-6, -6, 1.3)], ti: ["JAMUKA.", "top"], note: "your sworn brother Jamuka joins you" });
}
{
  const rs = [0, 1, 2, 3].map((i) => R(i === 0 ? "T" : "N", -12 - i * 1.5, -0.5 + i * 0.8, 3, -0.5 + i * 0.8, "#6a4a30", { face: "angry", held: "torch" }));
  S(353.34, { c: ["w", "pan-right", [0, 0, 0]], tm: "night", a: rs.map((r) => r.a), p: [...rs.map((r) => r.h), P("tent", 6, -5, { scale: 1.4 }), P("tent", 9, -6, { scale: 1.4 })], sfx: [["whoosh", 0.3, 0.8]], note: "attack the Merkits at night" });
}
S(356.0, { c: ["c", "push", "temu"], tm: "night", a: [A("T", 0, 0, { action: "talk", talking: true, face: "angry" })], p: [P("torch", 2, -0.6)], sfx: [["impact", 0.2, 0.6]], note: "shouting your wife's name" });
S(359.08, { c: ["m", "dolly-in", [0, 0, 0]], tm: "night", a: [A("B", -4, 0.5, { action: "run", to: [-0.6, 0.5], face: "happy", facing: 90 }), A("T", 1.2, 0.5, { action: "idle", face: "surprised", facing: -90, beats: [{ at: 1.6, action: "cheer", face: "happy" }] })], p: [P("torch", 3.6, -2), P("torch", -4.5, -2.6)], sfx: [["ding", 1.6, 0.5]], note: "she hears you and runs toward your voice" });
S(362.64, { c: ["m", "static", [0, 0, 0]], tm: "day", a: [A("B", -1, 0.4, { action: "idle", face: "worried" }), A("T", 1, 0.4, { action: "idle", face: "worried", facing: -40 }), A("N", 0, 0.7, { id: "jochi", scale: 0.3, shirt: "#f2b632", action: "idle", face: "happy" })], p: [yurt(-5, -6, 1.3)], ti: ["WHOSE CHILD?", "top"], sfx: [["rise", 0.3, 0.5]], note: "Borte gives birth and no one knows whose child" });
S(368.62, { c: ["c", "dolly-in", "temu", 25], a: [A("T", -0.5, 0, { action: "idle", face: "happy", facing: 40 }), A("N", 0.5, 0.2, { id: "jochi", scale: 0.3, shirt: "#f2b632", action: "idle", face: "happy" })], ti: ["JOCHI.", "bottom"], sfx: [["pop", 0.3]], note: "you accept him as your own, Jochi" });
S(372.16, { c: ["m", "static", "temu"], a: [A("T", -1.2, 0.5, { action: "idle", face: "neutral", facing: 20 })], cr: { count: 6, area: [1.5, -3, 6, -0.5], action: "talk", face: "smirk", facing: 90, seed: 33 }, note: "many whisper that you are weak" });
S(374.22, { c: ["c", "static", "temu"], a: [A("T", 0, 0, { action: "idle", face: "neutral" })], note: "you do not answer them" });
S(375.7, { c: ["c", "dolly-in", "temu"], a: [A("T", 0, 0, { action: "think", face: "neutral" })], ti: ["SILENCE IS STRENGTH.", "bottom"], note: "real strength is not in answering everyone" });
S(380.66, { c: ["w", "dolly-in", [0, 0, 0]], tm: "day", a: [A("T", 0, 0.5, { action: "idle", face: "happy" })], cr: { count: 14, area: [-6, -4, 6, -1.5], action: "walk", face: "happy", facing: 0, seed: 15 }, p: [...camp()], note: "over the years people are drawn to you" });
S(384.1, { l: "studio", sp: { left: { bg: "#f2dcc4", label: "HERDSMAN", camera: { shot: "medium" }, actors: [A("N", 0, 0, { shirt: "#c98a6a", action: "idle", face: "neutral" })] }, right: { bg: "#8aa5d6", label: "COMMANDER", camera: { shot: "medium" }, actors: [A("N", 0, 0, { shirt: "#c98a6a", action: "cheer", face: "grin", held: "none" })], props: [P("flag", 1.6, -1, { color: "#b0452f" })] } }, sfx: [["ding", 1.0, 0.5]], note: "simple herdsman can become a commander" });
S(389.18, { c: ["m", "dolly-in", "temu"], a: [A("T", -0.6, 0.4, { action: "point", face: "happy", facing: 60 }), A("N", 1.4, 0.4, { action: "cheer", face: "happy", facing: -50 }), A("Nb", 3, -0.4, { action: "angry", face: "angry", facing: -60 })], ti: ["SKILL, NOT BLOOD.", "top"], note: "you value skill, not bloodline" });
S(391.74, { c: ["m", "static", "temu"], a: [A("T", -1.2, 0.4, { action: "idle", face: "grin", facing: 50 }), A("N", 1.2, 0.4, { action: "cheer", face: "happy" }), A("N", 2.4, 0.2, { action: "cheer", face: "happy" })], p: [P("money", -0.2, 0.8), P("money", 1, 1.4)], sfx: [["cash", 0.4, 0.7]], note: "divide the spoils fairly" });
S(394.18, { c: ["m", "dolly-in", "temu"], a: [A("T", -0.8, 0.4, { action: "talk", talking: true, face: "happy", facing: 50 }), A("N", 1, 0.4, { action: "cheer", face: "grin", facing: -60 })], cr: { count: 6, area: [-4, -4, 5, -2], shirt: "#8a5cd8", action: "angry", face: "angry", facing: 0, seed: 44 }, ti: ["EVERY NAME.", "top"], note: "remember the name of every man, nobles hate this" });
S(399.36, { c: ["c", "dolly-in", "jamuka"], a: [A("J", 0, 0, { action: "idle", face: "angry", facing: 20 })], note: "first to grow unhappy is Jamuka" });
S(403.26, { c: ["m", "orbit", "jamuka"], a: [A("J", 0, 0.4, { action: "idle", face: "smirk" }), A("Nb", -2, -0.4, { action: "idle", face: "grin" }), A("Nb", 2, -0.4, { action: "idle", face: "grin" })], ti: ["THE OLD ORDER.", "top"], note: "he believes in the old order" });
S(405.4, { c: ["m", "static", "jamuka"], a: [A("J", 0, 0.3, { action: "point", face: "grin", facing: 0 })], p: [P("trophy", 2, 0)], note: "power belongs to those born noble" });
S(407.94, { l: "studio", sp: { left: { bg: "#e8a5a0", label: "BORN", camera: { shot: "medium" }, actors: [A("J", 0, 0, { action: "idle", face: "smirk" })] }, right: { bg: "#8fd6df", label: "EARNED", camera: { shot: "medium" }, actors: [A("T", 0, 0, { action: "cheer", face: "happy" })] } }, note: "you believe in a new one: earned" });
S(412.5, { c: ["w", "dolly-out", [0, 0, 0]], tm: "sunset", a: [A("T", -3.2, 0.5, { action: "idle", face: "neutral", facing: 90 }), A("J", 3.2, 0.5, { action: "idle", face: "neutral", facing: -90 })], cr: { count: 8, area: [-8, -3, -4, 0], action: "idle", face: "worried", facing: 90, seed: 1 }, note: "a fight over what kind of world will exist" });
S(417.86, { c: ["w", "static", [0, 0, 0]], a: [A("T", -2, 0.8, { action: "walk", to: [-9, 0.8], face: "neutral", facing: -90 }), A("J", 2, 0.8, { action: "walk", to: [9, 0.8], face: "neutral", facing: 90 })], p: [P("flag", -3, -2, { color: "#2bb3a3" }), P("flag", 3, -2, { color: "#ee5b4a" })], note: "you split your camps" });
S(420.04, { c: ["m", "dolly-in", [0, 1, 0]], tm: "sunset", a: [A("T", -1.4, 0.4, { action: "idle", face: "sad", facing: 80 }), A("J", 1.4, 0.4, { action: "idle", face: "sad", facing: -80 })], note: "part without a quarrel" });
{
  const l = [0, 1, 2].map((i) => RS("N", -8 + i * 1.2, -3 - (i % 2), 90, "#8a5a3a", { shirt: "#2bb3a3", face: "angry" }));
  const r = [0, 1, 2].map((i) => RS("N", 8 - i * 1.2, -3 - (i % 2), -90, "#6a4a30", { shirt: "#ee5b4a", face: "angry" }));
  S(424.16, { c: ["w", "dolly-in", [0, 0, -3]], tm: "sunset", a: [...l, ...r].map((x) => x.a), p: [...l, ...r].map((x) => x.h), sfx: [["rise", 0.3, 0.8]], note: "next time on the battlefield" });
}
S(427.24, { c: ["c", "push", "jamuka"], a: [A("J", 0, 0, { action: "angry", face: "angry" })], ti: ["GREATEST ENEMY.", "bottom"], sfx: [["impact", 0.3, 0.7]], note: "he will become your greatest enemy" });
S(429.76, { c: ["m", "static", [0, 0, 0]], a: [A("T", -1.4, 0.4, { action: "cheer", face: "grin" }), A("J", 1.8, 0.4, { action: "run", to: [8, 0.4], face: "scared", facing: 90 })], note: "you will defeat him and he will return" });
{
  const e = [0, 1].map((i) => R("J", -10 - i * 1.5, 0.4 + i * 0.8, 4, 0.4 + i * 0.8, "#8a5a3a", { id: i ? "jam2" : "jamuka", shirt: "#ee5b4a", face: "angry" }));
  S(432.42, { c: ["w", "pan-left", "temu"], a: [A("T", 4, 0.6, { action: "run", to: [-9, 0.6], face: "scared", facing: -90 }), ...e.map((x) => x.a)], p: e.map((x) => x.h), sfx: [["whoosh", 0.3, 0.8]], note: "he will beat you once, you survive only by luck" });
}
S(436.06, { c: ["m", "dolly-in", "jamuka"], a: [A("T", -1.4, 0.4, { action: "idle", face: "neutral", facing: 60 }), A("J", 1.4, 0.4, { action: "idle", face: "sad", facing: -60 })], ti: ["CAPTURED.", "top"], note: "in the end you capture him" });
S(438.5, { c: ["m", "static", [0, 1, 0]], a: [A("T", -1.4, 0.4, { action: "point", face: "happy", facing: 70 }), A("J", 1.4, 0.4, { action: "idle", face: "angry", facing: 140 })], note: "offer him a place at your side" });
S(441.92, { c: ["c", "static", "jamuka"], a: [A("J", 0, 0, { action: "idle", face: "angry", facing: 150 })], ti: ["REFUSED.", "bottom"], sfx: [["buzz", 0.3, 0.4]], note: "he will refuse" });
S(443.5, { c: ["m", "dolly-in", "jamuka"], tm: "sunset", a: [A("J", 0.8, 0.4, { action: "idle", face: "sad", facing: -30 }), A("T", -1.2, 0.4, { action: "idle", face: "sad", facing: 40 })], note: "to die without his blood being spilled" });
S(448.44, { c: ["c", "static", "temu"], a: [A("T", 0, 0, { action: "idle", face: "sad" })], sfx: [["heartbeat", 0.4, 0.7]], note: "you will grant his request" });
S(450.52, { c: ["w", "dolly-out", "temu"], tm: "sunset", a: [A("T", 0, 0.6, { action: "idle", face: "sad", facing: 60 })], ti: ["A FRIEND LOST.", "top"], note: "you lost a friend" });
{
  const rs = [0, 1, 2, 3, 4].map((i) => R(i ? "N" : "T", -13 - i * 1.5, -1 + i * 0.9, 12, -1 + i * 0.9, i % 2 ? "#6a4a30" : "#8a5a3a", { face: "angry" }));
  S(454.42, { c: ["w", "pan-right", [0, 0, 0]], a: rs.map((r) => r.a), p: [...rs.map((r) => r.h), P("banner", 6, -6)], ti: ["20 YEARS OF WAR.", "top"], sfx: [["whoosh", 0.3, 0.7]], note: "next 20 years you fight" });
}
S(456.88, { c: ["w", "static", [0, 0, 0]], a: [A("T", -4, 0.6, { action: "angry", face: "angry", facing: 90 }), ...[0, 1, 2, 3].map((i) => A("E", 1 + i * 1.2, 0.4 + (i % 2) * 0.8, { action: "run", to: [5 + i * 1.2, 0.4 + (i % 2) * 0.8], face: "scared", facing: 90 }))], ti: ["THE TATARS.", "top"], note: "you crush the Tatars" });
S(460.06, { c: ["w", "static", [0, 0, 0]], a: [A("T", -4, 0.6, { action: "angry", face: "angry", facing: 90 }), ...[0, 1, 2].map((i) => A("Mk", 1 + i * 1.4, 0.4 + (i % 2) * 0.8, { action: "run", to: [5 + i * 1.4, 0.4 + (i % 2) * 0.8], face: "scared", facing: 90 }))], ti: ["THE MERKITS.", "top"], note: "defeat the Merkits" });
S(461.6, { c: ["w", "static", [0, 0, 0]], a: [A("T", -4, 0.6, { action: "angry", face: "angry", facing: 90 }), ...[0, 1, 2].map((i) => A("N", 1 + i * 1.4, 0.4 + (i % 2) * 0.8, { shirt: "#b5849a", action: "run", to: [5 + i * 1.4, 0.4 + (i % 2) * 0.8], face: "scared", facing: 90 }))], ti: ["THE NAIMANS.", "top"], note: "conquer the Naimans" });
S(463.32, { c: ["m", "dolly-in", [0, 1, 0]], tm: "sunset", a: [A("T", -1.4, 0.4, { action: "angry", face: "angry", facing: 60 }), A("G", 1.4, 0.4, { action: "angry", face: "angry", facing: -60 })], p: [P("flag", -3.6, -1, { color: "#2bb3a3" }), P("flag", 3.6, -1, { color: "#3b7be0" })], note: "even Togrul your old protector becomes your enemy" });
S(468.44, { c: ["c", "static", "temu"], a: [A("T", 0, 0, { action: "idle", face: "neutral" })], note: "you do what no one before you has done" });
S(471.12, { c: ["m", "push", "temu"], a: [A("T", 0, 0.5, { action: "angry", face: "angry", facing: 0 })], p: [P("flag", -2.5, -1, { color: "#b0452f" }), P("flag", -1, -1.5, { color: "#3a5a8a" }), P("flag", 1, -1.5, { color: "#e8a838" }), P("flag", 2.5, -1, { color: "#4cb35a" })], ti: ["THE OLD SYSTEM BREAKS.", "top"], sfx: [["impact", 0.3, 0.7]], tr: "flash", note: "you break the old system" });
S(473.48, { c: ["w", "dolly-in", [0, 0, 0]], a: [A("T", 0, 1, { action: "idle", face: "happy" })], cr: { count: 18, area: [-6, -3.5, 6, 0], action: "idle", face: "neutral", facing: 0, seed: 77 }, ti: ["NO MORE TRIBES.", "bottom"], note: "tribes stop being the main unit" });
S(476.13, { c: ["w", "dolly-in", [0, 0, -2]], a: [A("T", 0, 2, { action: "idle", face: "grin" }), ...row(5, -6, -2.8, -2, { facing: 0 }), ...row(5, 2.8, 6, -2, { facing: 0, shirt: "#ee5b4a" }), ...row(3, -1.6, 1.6, -4, { facing: 0, shirt: "#f2b632" })], ti: ["10. 100. 1000.", "top"], note: "tens, hundreds, thousands" });
S(479.8, { c: ["m", "dolly-in", "temu"], a: [A("T", -1, 0.4, { action: "point", face: "happy", facing: 60 }), A("N", 1.4, 0.4, { action: "cheer", face: "happy", facing: -40 }), A("Nb", 3.4, -0.6, { action: "angry", face: "angry", facing: -60 })], ti: ["MERIT, NOT BIRTH.", "top"], note: "commanders chosen for merit, not birth" });
S(483.48, { c: ["m", "static", "temu"], a: [A("T", -1.2, 0.4, { action: "angry", face: "angry", facing: 60 }), A("N", 1.2, 0.4, { action: "scared", face: "scared", facing: -60 })], ti: ["BETRAYAL = DEATH.", "top"], sfx: [["buzz", 0.4, 0.5]], note: "betrayal is punished by death" });
S(485.84, { c: ["m", "static", "temu"], a: [A("T", -1, 0.4, { action: "talk", talking: true, face: "grin" }), A("N", 1.2, 0.4, { action: "cheer", face: "happy" }), A("N", 2.4, 0.2, { action: "cheer", face: "happy" })], p: [P("money", -0.4, 1.2), P("box", 3.5, -0.8, { scale: 0.7 })], sfx: [["cash", 0.3, 0.6]], note: "plunder is shared fairly" });
S(487.56, { c: ["c", "static", [0, 1, 0]], a: [A("T", -0.7, 0, { action: "idle", face: "happy", facing: 40 }), A("N", 0.7, 0, { action: "idle", face: "happy", facing: -40 })], ti: ["A PROMISE IS KEPT.", "bottom"], sfx: [["ding", 0.3, 0.4]], note: "a promise is kept" });
S(489.46, { c: ["m", "dolly-in", "temu"], a: [A("T", -0.8, 0.4, { action: "talk", talking: true, face: "neutral", facing: 30 }), A("N", 1.4, 0.4, { action: "idle", face: "neutral", held: "book", facing: -40 })], ti: ["THE YASA.", "top"], sfx: [["scribble", 0.4, 0.5]], note: "a code of rules later known as the Yasa" });
S(493.36, { c: ["m", "static", [0, 0, 0]], a: [A("T", -2, 0.4, { action: "idle", face: "neutral" }), A("N", -0.2, 0.4, { shirt: "#c98a6a", action: "idle", face: "neutral" }), A("Nb", 1.6, 0.4, { action: "idle", face: "neutral" })], ti: ["EQUAL FOR ALL.", "top"], note: "simple and harsh but applies to everyone equally" });

// ── ГЛАВА 4: ИМПЕРИЯ 497–620 ──
S(497.56, { c: ["w", "rise", [0, 0, -2]], tm: "day", a: [A("T", 0, 1.6, { action: "idle", face: "neutral", facing: 0 })], cr: { count: 22, area: [-7, -5, 7, -1], action: "idle", face: "happy", facing: 0, seed: 52 }, p: [yurt(-8, -9, 1.5), yurt(8, -9, 1.5), yurt(0, -12, 1.8), P("flag", -4, -3, { color: "#b0452f" }), P("flag", 4, -3, { color: "#3a5a8a" })], ti: ["1206.", "top"], note: "1206, leaders of all tribes gather" });
S(502.0, { l: "river", c: ["m", "dolly-in", "temu"], tm: "day", a: [A("T", 0, 0.6, { action: "idle", face: "happy", facing: 15 })], p: [yurt(-5, -3, 1.3)], note: "near the source of the Onon, where you were born" });
S(506.76, { c: ["w", "rise", [0, 2, -2]], tm: "day", a: [A("T", 0, 1.6, { action: "idle", face: "happy", facing: 0 })], cr: { count: 18, area: [-7, -4, 7, -1], action: "cheer", face: "grin", facing: 0, seed: 11 }, p: [P("banner", 0, -4, { scale: 1.2 })], sfx: [["rise", 0.2, 0.8]], note: "they raise a white banner with nine tails" });
S(510.44, { c: ["m", "dolly-in", "temu"], tm: "day", a: [A("T", 0, 0.4, { action: "cheer", face: "grin", facing: 0 })], cr: { count: 12, area: [-6, -4, 6, -2], action: "cheer", face: "happy", facing: 0, seed: 81 }, p: [P("banner", 3.2, -2)], ti: ["GENGHIS KHAN.", "top"], sfx: [["sparkle", 0.3, 0.6]], note: "they proclaim you Genghis Khan" });
S(512.88, { c: ["c", "dolly-in", "temu"], tm: "day", a: [A("T", 0, 0, { action: "idle", face: "neutral" })], ti: ["RULER OF THE OCEANS.", "bottom"], note: "universal ruler" });
S(517.22, { c: ["m", "static", "temu"], a: [A("T", 0, 0.4, { action: "idle", face: "neutral" })], ti: ["44.", "top"], note: "you are 44 years old" });
S(519.58, { c: ["m", "dolly-out", "temu"], tm: "sunset", a: [A("T", 0, 0.5, { action: "walk", to: [0, 1.6], face: "neutral" })], p: [P("collar", -1.4, -1.6, { scale: 1.1 })], note: "behind you the collar, the hunger, betrayals" });
S(523.96, { c: ["w", "rise", [0, 0, -4]], tm: "sunset", a: [A("T", 0, 1, { action: "idle", face: "neutral", facing: 180 })], ti: ["THE WHOLE WORLD.", "top"], sfx: [["rise", 0.2, 0.8]], note: "ahead of you the whole world" });
S(526.7, { l: "city", c: ["m", "dolly-in", "shah"], tm: "day", a: [A("Sh", 1.6, 0.4, { action: "idle", face: "smirk", facing: -40 }), A("T", -1.4, 0.4, { action: "wave", face: "happy", facing: 50 })], note: "you do not want war with the Shah of Khwarezm" });
S(529.46, { c: ["m", "static", "temu"], a: [A("T", 0, 0.4, { action: "idle", face: "happy" })], p: [P("coin", -2, 0.4), P("money", 2, 0.4), P("box", 3.4, -0.4, { scale: 0.7 })], ti: ["TRADE.", "top"], sfx: [["cash", 0.3, 0.7]], note: "you want trade" });
{
  const c1 = P("cart", -7, 0.5, { rotation: 90, to: [9, 0.5], speed: 1.8 });
  const c2 = P("cart", -9.4, 0.5, { rotation: 90, to: [9, 0.5], speed: 1.8, color: "#a07850" });
  S(530.9, { c: ["w", "pan-right", [0, 0, 0]], a: [A("N", -6, 1.6, { action: "walk", to: [9, 1.6], face: "happy", facing: 90, speed: 1 }), A("T", 0, 5, { id: "env", shirt: "#4cb35a", action: "wave", face: "happy" })], p: [c1, c2], note: "send a caravan with an offer of peace" });
}
S(536.04, { l: "city", c: ["m", "dolly-in", "gov"], a: [A("Sh", 1.4, 0.3, { id: "gov", shirt: "#c97a2c", action: "angry", face: "angry", facing: -50 }), A("Z", -1.4, 0.5, { action: "scared", face: "scared", facing: 60 }), A("Z", -2.4, 0.2, { action: "scared", face: "scared", facing: 60, shirt: "#b5849a" })], p: [P("box", -3.4, -0.6, { scale: 0.7 })], ti: ["MERCHANTS KILLED.", "top"], sfx: [["buzz", 0.3, 0.5]], note: "governor orders the merchants killed" });
S(541.02, { l: "city", c: ["w", "pan-right", [0, 0, 0]], a: [A("Z", -6, 0.8, { action: "walk", to: [2, 0.8], face: "neutral", facing: 90 }), A("Z", -7.4, 1.4, { action: "walk", to: [1, 1.4], face: "neutral", facing: 90, shirt: "#b5849a" })], note: "new envoys demand the guilty man" });
S(545.16, { l: "city", c: ["m", "shake", "shah"], a: [A("Sh", 1.2, 0.4, { action: "angry", face: "angry", facing: -50 }), A("Z", -1.2, 0.4, { action: "fall", face: "scared", facing: 60 })], sfx: [["impact", 0.3], ["thud", 1.0, 0.8]], note: "the Shah kills your envoys too" });
S(547.66, { c: ["c", "push", "temu"], a: [A("T", 0, 0, { action: "angry", face: "angry" })], ti: ["MORE THAN AN INSULT.", "bottom"], note: "no longer just an insult" });
S(550.52, { c: ["c", "dolly-in", "temu"], tm: "sunset", a: [A("T", 0, 0, { action: "idle", face: "angry" })], ti: ["TREATY = SACRED.", "bottom"], sfx: [["heartbeat", 0.3, 0.8]], note: "a treaty is sacred" });
{
  const rs = [0, 1, 2, 3].map((i) => R(i ? "N" : "T", -13 - i * 1.7, -1 + (i % 2) * 1.2, 12, -1 + (i % 2) * 1.2, i % 2 ? "#6a4a30" : "#8a5a3a", { face: "neutral" }));
  S(555.56, { c: ["w", "pan-right", [0, 0, 0]], a: rs.map((r) => r.a), p: [...rs.map((r) => r.h), P("banner", 4, -6)], ti: ["1219.", "top"], sfx: [["whoosh", 0.3, 0.6]], note: "in 1219 you march" });
}
S(557.98, { c: ["w", "dolly-in", [0, 0, -2]], a: [A("T", 0, 2.2, { action: "idle", face: "grin", facing: 180 }), ...row(6, -6, -1.4, -2, { facing: 180 }), ...row(6, 1.4, 6, -2, { facing: 180 }), ...row(4, -3, 3, -4, { facing: 180 })], note: "organized better than any in the world" });
{
  const r = R("N", -10, 0.4, 9, 0.4, "#8a5a3a", { face: "happy" });
  S(561.1, { c: ["w", "pan-right", [0, 0, 0]], a: [r.a], p: [r.h, P("rock", 4, -4, { scale: 2 })], note: "scouts who know the roads" });
}
S(565.36, { c: ["m", "static", "temu"], a: [A("N", -2, 0.4, { action: "talk", talking: true, face: "grin", facing: 60 }), A("T", 1.2, 0.4, { action: "idle", face: "happy", facing: -50 })], ti: ["COMMUNICATION.", "top"], note: "it has communication" });
{
  const r = R("N", -13, 0.5, 13, 0.5, "#6a4a30", { face: "grin" });
  S(567.04, { c: ["w", "pan-right", [0, 0, 0]], a: [r.a], p: [r.h, P("tree", -2, -4)], sfx: [["whoosh", 0.5, 0.8]], note: "riders carry news faster than an enemy can prepare" });
}
S(571.26, { c: ["w", "dolly-in", [0, 0, -2]], a: [A("T", 0, 2.2, { action: "idle", face: "grin" }), ...row(7, -6, 6, -2, { facing: 180 }), ...row(7, -6, 6, -3.6, { facing: 180 })], ti: ["DISCIPLINE.", "top"], note: "a discipline no one else possesses" });
S(574.24, { l: "city", c: ["m", "dolly-in", "temu"], tm: "day", a: [A("T", -1.4, 0.4, { action: "idle", face: "neutral", facing: 50 }), A("Z", 1.2, 0.4, { action: "cheer", face: "happy" })], cr: { count: 6, area: [2.5, -3, 6, -1], action: "cheer", face: "happy", facing: 0, seed: 3 }, ti: ["SURRENDER: LIVE.", "top"], note: "cities that surrender live" });
S(576.4, { l: "city", c: ["w", "shake", [0, 0, -3]], tm: "sunset", a: [], cr: { count: 8, area: [-5, -3, 5, 0], action: "scared", face: "scared", facing: 0, seed: 6 }, p: [P("torch", -4, 1), P("torch", 4, 1), P("torch", 0, 2)], ti: ["RESIST: VANISH.", "top"], tr: "flash", sfx: [["impact", 0.2, 0.7]], note: "cities that resist vanish" });
S(578.78, { c: ["w", "pan-right", [0, 0, 0]], a: [A("N", -7, 0.6, { action: "run", to: [8, 0.6], face: "scared", facing: 90 })], sfx: [["whoosh", 0.3, 0.6]], note: "the news runs ahead of you" });
S(580.72, { l: "city", c: ["m", "dolly-in", [0, 1, 0]], a: [A("Z", -1.4, 0.4, { action: "scared", face: "scared" }), A("Z", 0, 0.8, { action: "scared", face: "scared", shirt: "#b5849a" }), A("Z", 1.4, 0.4, { action: "scared", face: "scared" })], ti: ["FEAR IS A WEAPON.", "top"], note: "fear becomes your weapon" });
S(582.22, { l: "city", c: ["w", "dolly-in", [0, 0, 0]], a: [...[0, 1, 2].map((i) => A("Z", -2 + i * 1.6, 0.4, { action: "cheer", face: "scared", facing: 0, shirt: ["#4cb35a", "#b5849a", "#8a6f3d"][i] }))], p: [P("arrows", 3, 1, { scale: 0.7 })], note: "a fortress opens its gates without an arrow fired" });
S(586.5, { c: ["m", "dolly-in", "temu"], tm: "day", a: [A("T", 0, 0.4, { action: "idle", face: "happy" })], p: [yurt(-5, -5, 1.4), P("cart", 4.5, -2, { rotation: 70 })], ti: ["BUT YOU BUILD.", "top"], note: "but you do not only destroy, you build" });
{
  const r1 = R("N", -13, 0.5, 13, 0.5, "#6a4a30", { face: "grin", held: "torch" });
  const r2 = R("N", 13, -0.9, -13, -0.9, "#8a5a3a", { face: "grin", held: "torch" });
  S(589.51, { c: ["w", "static", [0, 0, 0]], tm: "night", a: [r1.a, r2.a], p: [r1.h, r2.h], ti: ["DAY AND NIGHT.", "top"], sfx: [["whoosh", 0.3, 0.6]], note: "messengers ride day and night" });
}
S(593.54, { c: ["m", "pan-right", "temu"], tm: "day", a: [A("T", -1.2, 0.4, { action: "idle", face: "happy", facing: 50 }), A("Z", 1.4, 0.4, { action: "cheer", face: "happy" })], p: [P("cart", 4, -1, { rotation: 80 }), P("box", -3, -1, { scale: 0.7 })], note: "you protect merchants" });
S(594.92, { c: ["w", "dolly-in", [0, 0, -2]], tm: "day", a: [A("T", 0, 1.4, { action: "idle", face: "happy", facing: 0 })], cr: { count: 12, area: [-6, -4, 6, -1.5], action: "idle", face: "happy", facing: 0, seed: 91 }, p: [P("tent", -7, -7, { scale: 1.3, color: "#c9b9f0" }), P("tent", 7, -7, { scale: 1.3, color: "#9fd8cf" })], ti: ["EVERY FAITH.", "top"], note: "you allow every faith, what matters is loyalty" });
S(600.18, { c: ["m", "dolly-in", "temu"], a: [A("T", -0.9, 0.4, { action: "point", face: "happy", facing: 50 }), A("N", 1.2, 0.4, { action: "idle", face: "happy", held: "book", facing: -50 }), A("N", 2.6, 0.2, { action: "idle", face: "happy", held: "book", shirt: "#c98a6a" })], ti: ["SCHOLARS & SCRIBES.", "top"], sfx: [["scribble", 0.5, 0.5]], note: "you bring in scholars and scribes, writing's power" });
S(606.62, { c: ["w", "pan-right", [0, 0, 0]], tm: "day", a: [A("Z", -8, 0.8, { action: "walk", to: [8, 0.8], face: "happy", held: "coin", facing: 90 })], p: [P("tree", -4, -4), P("rock", 3, -3)], note: "a merchant can cross with gold through half the world" });
S(613.28, { c: ["c", "static", "temu"], a: [A("T", 0, 0, { action: "think", face: "smirk" })], ti: ["THE PARADOX.", "bottom"], note: "the paradox of your power" });
S(615.5, { l: "studio", sp: { left: { bg: "#e8a5a0", label: "RESIST", camera: { shot: "medium" }, actors: [A("Z", 0, 0, { action: "scared", face: "scared" })] }, right: { bg: "#b9d9a8", label: "SUBMIT", camera: { shot: "medium" }, actors: [A("Z", 0, 0, { action: "cheer", face: "happy" })] } }, note: "destroy those who resist, protect those who submit" });

// ── ГЛАВА 5: СМЕРТЬ И ФИНАЛ 619–700 ──
S(619.7, { c: ["m", "dolly-in", "temu"], tm: "sunset", a: [A("T", 0, 0.4, { action: "idle", face: "sad", facing: 20 })], ti: ["65.", "top"], note: "you are about 65, an old man" });
S(622.98, { c: ["w", "dolly-out", "temu"], tm: "sunset", a: [A("T", 0, 1, { action: "idle", face: "sleepy", facing: 90 })], p: [P("horse", 3, -1.5, { rotation: -80 })], note: "your body is worn down, but you cannot stop" });
{
  const rs = [0, 1, 2].map((i) => R(i ? "N" : "T", -13 - i * 1.7, -1 + (i % 2) * 1.2, 12, -1 + (i % 2) * 1.2, "#8a5a3a", { face: "neutral" }));
  S(627.98, { c: ["w", "pan-right", [0, 0, 0]], a: rs.map((r) => r.a), p: [...rs.map((r) => r.h), P("banner", 5, -6)], ti: ["1227.", "top"], note: "1227, you lead the army against the Tanguts" });
}
S(632.84, { c: ["m", "static", "temu"], a: [A("T", 0, 0.4, { action: "ride", y: 0.42, facing: 90, face: "worried", beats: [{ at: 1.6, action: "fall", face: "scared", y: 0 }] })], p: [P("horse", 0, 0.4, { rotation: 90 })], sfx: [["thud", 2.3, 0.9]], note: "you fall from your horse and never fully recover" });
S(637.18, { c: ["m", "dolly-in", [0, 0, 0]], a: [A("N", -1.6, 0.4, { action: "shrug", face: "neutral", held: "book", facing: 40 }), A("N", 0, -0.4, { action: "shrug", face: "worried", held: "book", shirt: "#c98a6a" }), A("N", 1.6, 0.4, { action: "shrug", face: "neutral", held: "book", shirt: "#b5849a", facing: -40 })], ti: ["NO ONE KNOWS.", "top"], note: "chroniclers tell it differently" });
S(641.84, { c: ["m", "static", [0, 0, 0]], tm: "night", a: [A("T", -1.4, 0.4, { action: "lie", face: "sleepy" }), A("N", 1, 0.4, { action: "talk", talking: true, face: "worried", facing: -40 }), A("N", 2.2, 0, { action: "talk", face: "worried", facing: -40 })], p: [yurt(-5, -5, 1.4), P("campfire", 4, -1.5)], note: "you want your death kept secret" });
S(644.98, { c: ["w", "dolly-in", [0, 0, 0]], tm: "night", a: [...[0, 1, 2, 3].map((i) => A("N", -2.4 + i * 1.6, 0.6, { action: "walk", to: [-0.2 + i * 1.6, 0.6], face: "sad", facing: 90, held: i % 2 ? "torch" : "none" }))], note: "buried in secret" });
S(646.34, { c: ["w", "rise", [0, 1.5, -4]], tm: "night", p: [P("tree", 0, -6, { scale: 1.4 })], ti: ["LOCATION UNKNOWN.", "bottom"], note: "the location remains unknown" });
S(649.22, { c: ["m", "static", [0, 0, 0]], tm: "night", a: [A("N", -2, 0.4, { action: "idle", face: "neutral", facing: 40, shirt: "#6b4a3a" }), A("N", 0.4, 0.2, { action: "fall", face: "scared" }), A("N", 2, 0.4, { action: "lie", face: "sleepy" })], p: [P("torch", -3.4, -0.5)], note: "everyone who saw the road was killed" });
S(652.76, { c: ["w", "static", [0, 0, 0]], tm: "sunset", p: [...[0, 1, 2, 3, 4, 5].map((i) => P("horse", -10 - i * 1.6, -1 - (i % 3) * 1.4, { to: [12, -1 - (i % 3) * 1.4], speed: 4, color: i % 2 ? "#6a4a30" : "#8a5a3a" }))], sfx: [["whoosh", 0.4, 0.8]], note: "a herd of horses driven over the grave" });
S(658.16, { c: ["w", "rise", [0, 1.5, -4]], tm: "sunset", p: [P("tree", 0, -6, { scale: 1.3 }), P("banner", 5, -4)], ti: ["YOUR EMPIRE LIVES ON.", "bottom"], note: "no one knows where you lie, your empire lives on" });
S(663.1, { c: ["w", "pan-right", [0, 2, -4]], tm: "day", p: [P("banner", -5, -4), P("banner", 5, -4)], a: [], ti: ["PACIFIC TO CASPIAN.", "top"], note: "stretch from the Pacific to the Caspian" });
S(667.78, { c: ["w", "dolly-in", [0, 1.5, -3]], tm: "day", p: [P("flag", -5, -3, { color: "#b0452f" }), P("flag", -2.5, -4, { color: "#3a5a8a" }), P("flag", 0, -3, { color: "#e8a838" }), P("flag", 2.5, -4, { color: "#4cb35a" }), P("flag", 5, -3, { color: "#8a5cd8" })], a: [], note: "sons and grandsons rule half the known world" });
S(671.48, { c: ["w", "dolly-in", [0, 0, -2]], tm: "day", a: [A("T", 0, 2, { action: "idle", face: "happy" })], cr: { count: 24, area: [-7, -5, 7, -1], action: "wave", face: "happy", facing: 0, seed: 123 }, ti: ["ANCESTOR OF MILLIONS.", "top"], note: "ancestor of millions" });
S(675.56, { c: ["w", "dolly-out", "temu"], tm: "sunset", a: [A("T", 0, 1, { scale: 0.6, action: "idle", face: "sad", facing: 0 })], note: "a boy whose father was murdered, left on the steppe to die" });
S(682.0, { l: "studio", bg: "#f7c59f", c: ["c", "dolly-in", "temu"], a: [A("T", 0, 0, { action: "talk", talking: true, face: "grin" })], ti: ["A QUESTION.", "bottom"], tr: "fade", sfx: [["pop", 0.3]], note: "now, a question for you" });
S(683.82, { l: "studio", bg: "#cfe7f2", c: ["c", "static", "temu"], a: [A("T", 0, 0, { action: "idle", face: "smirk" })], ti: ["WOULD YOU SURVIVE?", "bottom"], note: "would you have survived?" });
S(685.16, { l: "studio", bg: "#3a3550", c: ["e", "push", "temu"], a: [A("T", 0, 0, { action: "idle", face: "worried" })], sfx: [["heartbeat", 0.3, 0.8]], note: "at which moment would you have broken?" });
S(687.44, { l: "studio", bg: "#e6d5b8", c: ["m", "static", "temu"], a: [A("T", 0, 0, { collar: true, action: "idle", face: "sad", scale: 0.9 })], ti: ["THE COLLAR?", "top"], note: "the wooden collar" });
S(688.9, { l: "studio", bg: "#f7e3a8", c: ["m", "static", "borte"], a: [A("B", 0, 0, { action: "idle", face: "worried" })], ti: ["LOSING BORTE?", "top"], note: "losing Borte" });
S(690.3, { l: "studio", bg: "#e8a5a0", c: ["m", "static", "jamuka"], a: [A("J", 0, 0, { action: "idle", face: "sad", facing: 40 })], ti: ["A FRIEND'S BETRAYAL?", "top"], note: "betrayal of your closest friend" });
S(692.36, { l: "studio", bg: "#f7c59f", c: ["c", "dolly-in", "temu"], a: [A("T", 0, 0, { action: "wave", face: "happy" })], ti: ["TELL ME BELOW.", "bottom"], sfx: [["pop", 0.3]], note: "tell me in the comments" });
S(693.68, { l: "studio", bg: "#e8cf9a", c: ["m", "dolly-in", "temu"], a: [A("T", 0, 0, { action: "point", face: "smirk", facing: 60 })], p: [P("rock", 2.6, -1.2, { scale: 1.2, color: "#c9b48a" })], ti: ["NEXT: ANCIENT ROME.", "top"], sfx: [["rise", 0.3, 0.7]], note: "next video you will be born in ancient Rome" });
S(696.2, { l: "studio", bg: "#b0452f", c: ["m", "push", "temu"], a: [A("T", 0, 0, { action: "idle", face: "scared", facing: 0 })], ti: ["THE ARENA WAITS.", "top"], tr: "fade", sfx: [["impact", 0.3, 0.8]], note: "the arena is waiting for you" });
