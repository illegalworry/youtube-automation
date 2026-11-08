# The Miner Who Weighed 20 Grams

Vertical cartoon short (1080x1920, 30 fps, 77.8 s), built with cartoon-short-kit (three.js in headless Chromium).
Voice: user's recording `voice.mp3`. Word timings: `work/words.json` (faster-whisper small.en).

## Facts used (from the narration)
- Canaries were carried into British coal mines as carbon-monoxide detectors; a canary weighs about 15-30 g.
- CO is colourless and odourless; poisoning causes drowsiness, then unconsciousness and death.
- Small birds have very fast heart and breathing rates, so they absorb the gas much sooner than a person.
- Special resuscitation cages with an oxygen cylinder (Haldane-type) were used to revive the bird.
- The UK phased canaries out of its pits in 1986 in favour of electronic detectors.

## Shot list (frames)
hook 0-171 · valley 172-296 · kit 297-405 · betty 406-485 · laugh 486-515 · cut-away 516-594 · canary 595-691 ·
hour/hack 692-853 · glance 854-963 · silence 964-1019 · sway 1020-1067 · drop 1068-1116 · up 1117-1160 ·
feel 1161-1335 · CO 1336-1529 · tap 1530-1665 · thimble 1666-1698 · heart 1699-1827 · poison 1828-1919 ·
grab 1920-1980 · haldane 1981-2112 · 1986 2113-2229 · detect 2230-2333

## Build
    node render.mjs frames 0-2333          # (split into ranges to run in parallel; RESUME=1 skips done frames)
    python3 audio.py                       # music + SFX + voice -> mix_raw.wav
    bash finish.sh "The Miner Who Weighed 20 Grams"
