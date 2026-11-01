# «Кыш» — Бегиш ft. Арсен · 9:16, 1080×1920, 120 fps, 90 Mbit/s

Dark night widget style (stars, aurora, snow, glowing dark cards), original characters:
a boy in a white ak-kalpak with a red scarf and his snowman friend. One illustrated scene per lyric line
(verse 1 + chorus), Kyrgyz subtitles with word highlight and Russian translation.

Audio (`audio_fx3.py`, then loudnorm −14 LUFS / −1 dBTP), effects follow the lyrics:
- 22.40–23.36 «Музга айлантып»: low-pass "freeze" + small dip.
- 37.45–40.26 «токтогонсуйт көмүрүң»: muffled, −2 dB; reopens on «Жылытсын музыкам», warm lift.
- 44.70–45.24 pull-back + riser; chorus from 45.24 +1…2 dB, sub-boom at 45.88; fade-out from 55.4.

Render: `NODE_PATH=$(npm root -g) node render3.js full <from> <to> parts/pN.mp4` (4 workers), concat + mux `final.wav`.
Rendered MP4s are not committed (GitHub 100 MB limit).
