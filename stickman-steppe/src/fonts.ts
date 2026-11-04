import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// Шрифт лежит в public/fonts — не зависит от интернета и сертификатов
export const FONT = "StickmanMontserrat";

const faces = [700, 800, 900].map((w) => new FontFace(FONT, `url(${staticFile(`fonts/Montserrat-${w}.ttf`)})`, { weight: String(w) }));
let ready = false;
const readyPromise = Promise.all(
  faces.map((f) =>
    f
      .load()
      .then((l) => document.fonts.add(l))
      .catch(() => undefined),
  ),
).then(() => {
  ready = true;
});

// Ждём шрифт перед рисованием текста на 3D-текстурах (экраны, таблички)
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
