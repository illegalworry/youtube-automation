// Помощники для раскадровки: каст, предметы, всадники, сцены.
export const C = {
  T: { id: "temu", shirt: "#2bb3a3", hair: "none", print: "dino" }, // Темучжин — главный герой, бирюзовая футболка с динозавром
  Y: { id: "yesuge", shirt: "#8a5cd8", hair: "cap", hairColor: "#3a2a20" },
  M: { id: "hoelun", shirt: "#e86aa6", hair: "bun", hairColor: "#3a2a20" },
  B: { id: "borte", shirt: "#f2b632", hair: "bob", hairColor: "#3a2a20" },
  J: { id: "jamuka", shirt: "#ee5b4a", hair: "cap", hairColor: "#222222" },
  G: { id: "togrul", shirt: "#3b7be0", hair: "puff", hairColor: "#d6d6d6" },
  S: { id: "sorgan", shirt: "#8a6f3d", hair: "headband", hairColor: "#c9a24a" },
  K: { id: "bektor", shirt: "#4cb35a", hair: "puff", hairColor: "#3a2a20" },
  Ka: { id: "kasar", shirt: "#9fb2d9", hair: "bob", hairColor: "#3a2a20" },
  Sh: { id: "shah", shirt: "#d9a441", hair: "cap", hairColor: "#7a1f1f" },
  E: { shirt: "#6b4a3a", hair: "cap", hairColor: "#2a1f18" }, // враги (татары)
  Mk: { shirt: "#5b6f8a", hair: "cap", hairColor: "#1c1c1c" }, // меркиты
  L: { shirt: "#b5b5bd", hair: "bob", hairColor: "#ededed" }, // старейшины
  W: { shirt: "#c98a6a", hair: "bun", hairColor: "#3a2a20" }, // повитухи, женщины
  N: { shirt: "#a8d5f2", hair: "cap", hairColor: "#2a1f18" }, // воины/простые люди
  Nb: { shirt: "#8a5cd8", hair: "puff", hairColor: "#c9b9f0" }, // знать
  Z: { shirt: "#4cb35a", hair: "none" }, // купцы
};
let n = 0;
export const A = (k, x, z, o = {}) => ({ ...C[k], id: o.id ?? C[k].id ?? `${k}${++n}`, x, z, ...o });
export const P = (type, x, z, o = {}) => ({ type, x, z, ...o });
export const yurt = (x, z, scale = 1.3, o = {}) => P("yurt", x, z, { scale, ...o });
export const camp = () => [yurt(-6.5, -5, 1.3), yurt(6, -6, 1.5), yurt(0.5, -9, 1.2)];
// Всадник: герой верхом (y подъёма) + конь, едут из (x,z) в (tx,tz) синхронно
export const R = (k, x, z, tx, tz, color = "#8a5a3a", o = {}) => ({
  a: A(k, x, z, { action: "ride", to: [tx, tz], y: 0.42, face: "grin", ...o }),
  h: P("horse", x, z, { to: [tx, tz], color }),
});
// Стоящий конь с всадником (без движения)
export const RS = (k, x, z, rot = 0, color = "#8a5a3a", o = {}) => ({
  a: A(k, x, z, { action: "ride", y: 0.42, facing: rot, ...o }),
  h: P("horse", x, z, { rotation: rot, color }),
});
const SH = { w: "wide", m: "medium", c: "close", e: "extreme" };
const MOVES = ["dolly-in", "static", "dolly-out", "pan-right", "dolly-in", "pan-left"];
export const scenes = [];
// S(t, {...}): t — начало сцены (секунды из transcript). l — локация, c — камера [shot, move, target, angle, height]
export const S = (t, o = {}) => scenes.push({ t, ...o });
export const build = (duration, base) => {
  const sorted = [...scenes].sort((a, b) => a.t - b.t);
  // не три одинаковых плана подряд: третий меняем
  const shots = [];
  sorted.forEach((s, i) => {
    const sh = (s.c ?? [])[0] ?? "m";
    const a = shots[i - 1], b = shots[i - 2];
    if (!s.sp && s.l !== "studio" && sh === a && sh === b) {
      s.c = [sh === "m" ? ((s.a?.length ?? 0) <= 2 && !s.cr ? "c" : "w") : "m", ...(s.c ?? []).slice(1)];
      shots.push(s.c[0]);
    } else shots.push(sh);
  });
  const fitRides = (s, len) => {
    for (const a of s.a ?? []) {
      if (a.action === "ride" && a.to) {
        const d = Math.hypot(a.to[0] - a.x, a.to[1] - a.z);
        a.speed = +Math.min(7, Math.max(1.2, d / (len * 0.92))).toFixed(2);
      }
    }
    for (const p of s.p ?? []) {
      if (p.type === "horse" && p.to && !p.speed) {
        const d = Math.hypot(p.to[0] - p.x, p.to[1] - p.z);
        p.speed = +Math.min(7, Math.max(1.2, d / (len * 0.92))).toFixed(2);
      }
    }
  };
  return sorted.map((s, i) => {
    const start = i === 0 ? 0 : +(s.t - 0.12).toFixed(2);
    const end = i + 1 < sorted.length ? +(sorted[i + 1].t - 0.12).toFixed(2) : duration;
    const len = end - start;
    fitRides(s, len);
    const actors = s.a ?? [];
    const hero = actors.find((a) => a.id === "temu") ?? actors.find((a) => !a.id.startsWith("crowd"));
    const [shot = "m", move, target, angle = 0, height = 0] = s.c ?? [];
    const camera = { shot: SH[shot] ?? shot, move: move ?? MOVES[i % MOVES.length], angle, height };
    if (target !== undefined) camera.target = target;
    else if (hero && !s.sp) camera.target = hero.id;
    const sc = { start, end, note: s.note ?? "", location: s.l ?? "steppe", camera };
    if (s.bg) sc.bg = s.bg;
    if (s.tm) sc.time = s.tm;
    if (s.v) sc.variant = s.v;
    if (actors.length) sc.actors = actors;
    if (s.cr) sc.crowd = s.cr;
    if (s.p?.length) sc.props = s.p;
    if (s.sp) {
      sc.split = s.sp;
      delete sc.camera.target;
    }
    if (s.ti) {
      const [text, position = "top", size = "big"] = s.ti;
      sc.title = { text, at: 0.25, until: +Math.min(len - 0.15, 3.2).toFixed(2), position, size };
    }
    if (s.sfx) sc.sfx = s.sfx.map(([name, at = 0.3, volume = 1]) => ({ name, at, volume }));
    if (s.tr) sc.transition = s.tr;
    return sc;
  });
};
