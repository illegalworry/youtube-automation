#!/bin/sh
# Overlays text on the 10 «Most Beautiful Person» stills and saves full-1080p thumbnails.
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9,11,13,15,17,19
S=build/stills; O=../most-beautiful/out/thumbs_why; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 "${6:-150}" "$5" 1920; }
t 1s_1.00.png   01_smug_free_everything.png  "FREE|EVERYTHING."     "FOR A WHOLE YEAR"     L
t 3s_3.00.png   02_shocked_traffic_stopped.png "TRAFFIC|STOPPED."   "WHEN I CROSSED"       R
t 5s_5.00.png   03_sad_nobody_texts_me.png   "NOBODY|TEXTS ME."     "TOO PERFECT TO ASK"   R
t 7s_7.00.png   04_angry_they_hate_me.png    "THEY|HATE ME."        "FOR MY FACE"          L
t 9s_9.00.png   05_crazy_which_one_is_me.png "WHICH ONE|IS ME?"     "1,000,000 COPIES"     L 140
t 11s_11.00.png 06_shocked_10_years.png      "IT LASTED|10 YEARS."  "THEN THIS"            R
t 13s_13.00.png 07_smug_face_insured.png     "MY FACE|IS INSURED."  "FOR \$100,000,000"    R 140
t 15s_15.00.png 08_angry_cant_go_outside.png "I CAN'T|GO OUTSIDE."  "10,000 PHOTOS A DAY"  L 140
t 17s_17.00.png 09_sad_i_got_fired.png       "I GOT|FIRED."         "FOR BEING TOO PRETTY" L
t 19s_19.00.png 10_crazy_mirrors_scare_me.png "MIRRORS|SCARE ME."   "EVERY SINGLE MORNING" L 140
