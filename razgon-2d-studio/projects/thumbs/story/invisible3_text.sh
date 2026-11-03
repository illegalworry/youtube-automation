#!/bin/sh
# 2 polished grayscale thumbs (scenes/shots/invisible3.js). run from projects/thumbs/ after:
#   node render.mjs --project projects/thumbs --stills 1,3
S=build/stills; O=../invisible/out/thumbs_gray2; mkdir -p $O
python3 story/text2.py $S/1s_1.00.png $O/01_shocked_i_entered_the_vault.png "I ENTERED|THE VAULT." "NO ALARM RANG" 70 40 145 R 1920 ffcf3a
python3 story/text2.py $S/3s_3.00.png $O/02_angry_no_one_came.png "NO ONE|CAME." "MY BIRTHDAY" 70 40 155 R 1920 ff8a1a
