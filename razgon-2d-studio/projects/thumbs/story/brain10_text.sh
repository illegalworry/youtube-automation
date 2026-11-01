#!/bin/sh
# Overlays text on the 10 «100% brain» stills and saves full-1080p thumbnails.
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9,11,13,15,17,19
S=build/stills; O=../brain-100/out/thumbs_why; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 150 "$5" 1920; }
t 1s_1.00.png   01_smug_time_stopped.png     "TIME|STOPPED."       "ONLY FOR ME"   L
t 3s_3.00.png   02_shocked_i_saw_nothing.png "I SAW|NOTHING."      "AT 100% BRAIN" L
t 5s_5.00.png   03_sad_always_hungry.png     "ALWAYS|HUNGRY."      "5000 KCAL A DAY" R
t 7s_7.00.png   04_crazy_head_on_fire.png    "HEAD|ON FIRE."       "100% BRAIN"          L
t 9s_9.00.png   05_shocked_3_seconds.png     "IT LASTED|3 SECONDS." "THEN THIS"    L
t 11s_11.00.png 06_crazy_cant_sleep.png      "I CAN'T|SLEEP."      "EVER AGAIN"    L
t 13s_13.00.png 07_angry_dont_touch_me.png   "DON'T|TOUCH ME."     "PURE ELECTRICITY" L
t 15s_15.00.png 08_sad_forgot_my_name.png    "I FORGOT|MY NAME."   "WHO AM I?"     R
t 17s_17.00.png 09_angry_too_loud.png        "TOO|LOUD."           "I HEAR EVERYTHING" L
t 19s_19.00.png 10_smug_banned_forever.png   "BANNED|FOREVER."     "FROM EVERY CASINO" R
