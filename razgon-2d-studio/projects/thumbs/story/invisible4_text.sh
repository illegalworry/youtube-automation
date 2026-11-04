#!/bin/sh
# 5 flat pop-poster thumbs (scenes/shots/invisible4.js), 2K. run from projects/thumbs/ after:
#   node render.mjs --project projects/thumbs --stills 11,13,15,17,19 --scale 1.33334
S=build/stills; O=../invisible/out/thumbs_poster5; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 "$6" L 2560 "$5"; }
t 11s_11.00.png 01_no_reflection.png    "NO|REFLECTION." "DAY 1 INVISIBLE" ffee3a 150
t 13s_13.00.png 02_caught_on_camera.png "CAUGHT|ON CAMERA." "NOBODY CARED" 39ff88 150
t 15s_15.00.png 03_who_are_you.png      "WHO|ARE YOU?" "THE BANK ASKED" ffee3a 165
t 17s_17.00.png 04_mom_walked_past.png  "MY MOM|WALKED PAST." "I WAS RIGHT THERE" ffee3a 140
t 19s_19.00.png 05_head_not_found.png   "HEAD|NOT FOUND." "ERROR 404" ffee3a 160
