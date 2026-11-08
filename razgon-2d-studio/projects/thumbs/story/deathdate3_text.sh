#!/bin/sh
# Overlays text on the 3 death-date stills and saves full-1080p thumbnails.
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5
S=build/stills; O=../death-date/out/thumbs_why; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 150 "$5" 1920; }
t 1s_1.00.png 01_terror_she_saw_my_date.png "SHE SAW|MY DATE."   "SHE WON'T TELL ME" L
t 3s_3.00.png 02_maniac_i_cant_die.png      "I CAN'T|DIE."       "TRIED 47 TIMES"    L
t 5s_5.00.png 03_cry_2_billion_one_day.png  "2 BILLION|ONE DAY." "INCLUDING YOU?"    R
