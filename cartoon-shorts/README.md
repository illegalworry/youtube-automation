# cartoon-shorts — Remotion-проект для скилла `cartoon-3d-short`

Рабочий проект для скилла из [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts)
(установлен в `../.claude/skills/cartoon-3d-short/`). Внутри полный исходник эталонного шортса
«The Bridge That Fell for a Song» (`src/videos/bridge/`, композиция `BridgeShort`, 1080x1920, 30 fps).

## Установка
```bash
cartoon-shorts/setup.sh   # npm ci + pip (numpy, scipy, pillow) + референс-кадры скилла
```
Чтобы сделать новый шортс, скажите в Claude Code: *«Используй скилл cartoon short и сделай шортс про …»*.

## Команды
| Что | Команда |
|---|---|
| Проверка типов | `npm run check` |
| Тестовые кадры | `REMOTION_TMP=/tmp/remotion-tmp node scripts/bridge-stills.mjs out/bridge/x_ 100,1200 0.5` |
| Видео 2K | `npm run render` (на Linux `remotion.config.ts` сам включает программный WebGL, локальный Chromium, таймаут 10 мин и 2 вкладки) |
| Проверка кадров | `python scripts/short_qa.py final.mp4 out/<name>/qa shots.json` |

Полезные переменные окружения для `bridge-stills.mjs`: `BRIDGE_ENTRY` (точка входа песочницы), `COMP` (id композиции),
`STILL_PROPS='{"post":{"ink":false}}'` (inputProps для A/B-переключателей), `REMOTION_GL`, `BROWSER_EXECUTABLE`, `STILL_DEBUG=1` (все логи браузера).

## Отличия от оригинального шаблона (чтобы работало в Linux-облаке без GPU)
- **`@react-three/postprocessing` закреплён ровно на 3.0.4.** В 3.1+ EffectComposer создаётся асинхронно
  (useEffect → setState), и в режиме Remotion `frameloop="never"` кадр остаётся пустым (только цвет фона).
  `three` закреплён на 0.186.x (postprocessing 6.39 требует `< 0.187`). **Не обновляйте эти версии, не проверив тестовый кадр.**
- `bridge-stills.mjs`: на Linux использует `/opt/pw-browsers/chromium` и `gl: "swangle"` (программный WebGL); на других системах — Chrome + `angle`, как в оригинале.
- `Bridge.tsx`: `null` → `<></>` в дочерних элементах EffectComposer (из-за типов 3.0.4).
- `bridge_merge.py`: ROOT — папка проекта.
- `remotion.config.ts`: настройки CLI-рендера для Linux.

## Референс-кадры
`references/frames` и `references/sheets` (закрытые учебные материалы скилла) не хранятся в этом репозитории; `setup.sh` скачивает их из оригинального.

## Ограничения этой среды
- Без GPU рендер программный: 25–55 с на тестовый кадр и ~17 с на кадр видео при масштабе 0.5 и 2 вкладках.
  Полный шортс в 2K (~2000 кадров) займёт здесь много часов, поэтому финальный рендер лучше делать на машине с видеокартой.
- **CC0-модели Kenney** (`public/bridge/kenney/*.glb`: tree_oak, lantern, stall-red, banner-red, windmill, canoe и др., список в
  `src/videos/bridge/world.ts`) не включены: kenney.nl заблокирован сетевой политикой облака. Сцена рендерится и без них
  (загрузчик пропускает отсутствующие модели), только без этих объектов. Скачайте Nature Kit и Fantasy Town Kit
  с kenney.nl и положите `.glb` в `public/bridge/kenney/` (они в .gitignore).
- Озвучка (`voice.wav` + `words.json`) ваша: ElevenLabs/Piper + тайминги слов из Whisper.
