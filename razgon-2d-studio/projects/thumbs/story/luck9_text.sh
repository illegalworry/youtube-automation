#!/bin/sh
# Overlays English "why?" text on the 10 «What If You Were the Luckiest Human Alive?» stills and saves full-1080p thumbnails.
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9,11,13,15,17,19
S=build/stills; O=../luck9/out/thumbs_why; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 "${6:-150}" "$5" 1920; }
t 1s_1.00.png   01_smug_every_light_green.png    "EVERY LIGHT|WAS GREEN."   "NOT MOST. EVERY."       L
t 3s_3.00.png   02_shocked_red_three_times.png   "RED.|THREE TIMES."        "ALL-IN EVERY TIME"      R
t 5s_5.00.png   03_sad_i_felt_nothing.png        "I FELT|NOTHING."          "STADIUM GOES WILD"      L
t 7s_7.00.png   04_angry_truck_stopped.png       "THE TRUCK|STOPPED."       "FOR NO REASON"          L
t 9s_9.00.png   05_crazy_one_in_292m.png         "1 IN|292 MILLION."        "AND I WON"              L  135
t 11s_11.00.png 06_smug_nothing_hurts.png        "NOTHING|HURTS."           "FOR 9 DAYS"             R
t 13s_13.00.png 07_sad_i_want_bad_day.png        "I WANT|A BAD DAY."        "JUST ONE"               L
t 15s_15.00.png 08_shocked_she_said_no.png       "SHE SAID|NO."             "BEST FEELING IN 9 DAYS" L
t 17s_17.00.png 09_angry_i_did_nothing.png       "I DID|NOTHING."           "AND GOT RICH"           R
t 19s_19.00.png 10_crazy_almost_broke_me.png     "IT ALMOST|BROKE ME."      "NINE DAYS OF LUCK"      L
