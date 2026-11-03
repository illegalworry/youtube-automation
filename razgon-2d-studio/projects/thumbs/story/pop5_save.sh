#!/bin/sh
# Saves the 5 «different design» thumbnails (text is drawn in the scene, see scenes/shots/pop5.js).
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9
S=build/stills; O=../schoenste-mensch/out/thumbs_styles; mkdir -p $O
python3 - "$S" "$O" <<'P'
import sys
from PIL import Image, ImageEnhance
S, O = sys.argv[1], sys.argv[2]
for src, name in [('1s_1.00.png', '01_comic_shocked_10000_antraege.png'), ('3s_3.00.png', '02_wanted_smug_gesucht_zu_schoen.png'),
                  ('5s_5.00.png', '03_split_happy_sad_vorher_nachher.png'), ('7s_7.00.png', '04_eye_crazy_sie_sind_ueberall.png'),
                  ('9s_9.00.png', '05_sticker_angry_zu_schoen_fuer_den_job.png')]:
    im = Image.open(f'{S}/{src}').convert('RGB')
    im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(1.15)).enhance(1.05)
    im.save(f'{O}/{name}')
P
