#!/bin/sh
# Overlays English text on the 10 «Invisible and nobody noticed» stills and saves full-1080p thumbnails.
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9,11,13,15,17,19
S=build/stills; O=../invisible/out/thumbs_why; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 "${6:-150}" "$5" 1920; }
t 1s_1.00.png   01_smug_empty_mirror.png     "EMPTY|MIRROR."        "DAY 1 INVISIBLE"  L
t 3s_3.00.png   02_shocked_locked_out.png    "LOCKED|OUT."          "OF MY OWN PHONE"  L
t 5s_5.00.png   03_sad_everything_free.png   "EVERYTHING|FREE."     "UNTIL DAY 9"      R
t 7s_7.00.png   04_angry_one_camera.png      "ONE CAMERA|SAW ME."   "THEN IT GOT WORSE" R
t 9s_9.00.png   05_shocked_not_one_call.png  "NOT ONE|CALL."        "A WHOLE YEAR"     L
t 11s_11.00.png 06_crazy_i_went_blind.png    "I WENT|BLIND."        "SCIENCE SAYS SO"  L
t 13s_13.00.png 07_angry_nearly_hit.png      "NEARLY|HIT."          "3 TIMES A DAY"    R
t 15s_15.00.png 08_sad_no_one_came.png       "NO ONE|CAME."         "MY BIRTHDAY"      R
t 17s_17.00.png 09_crazy_no_one_turned.png   "NO ONE|TURNED."       "AFTER 1 HOUR"     L
t 19s_19.00.png 10_smug_i_entered_the_vault.png "I ENTERED|THE VAULT." "NO ALARM RANG" R 135
