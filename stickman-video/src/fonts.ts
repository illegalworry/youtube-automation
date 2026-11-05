import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// Шрифт лежит локально в public/fonts (не зависит от доступа к fonts.gstatic.com)
export const FONT = "Montserrat";
const weights = ["700", "800", "900"];

// Ждём шрифт перед рисованием текста на 3D-текстурах (экраны, таблички)
let ready = false;
const readyPromise = Promise.all(
  weights.map((w) => {
    const face = new FontFace(FONT, `url(${staticFile(`fonts/Montserrat-${w}.ttf`)})`, { weight: w, style: "normal" });
    return face.load().then((f) => document.fonts.add(f));
  }),
).then(() => {
  ready = true;
});

export const useFontReady = () => {
  const [ok, setOk] = useState(ready);
  const [handle] = useState(() => (ready ? null : delayRender("font")));
  useEffect(() => {
    if (ready) {
      if (handle !== null) continueRender(handle);
      return;
    }
    readyPromise.then(() => {
      setOk(true);
      if (handle !== null) continueRender(handle);
    });
  }, [handle]);
  return ok;
};
