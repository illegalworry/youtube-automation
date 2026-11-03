#!/bin/sh
# Text for the 10 «grayscale world» thumbnails (scenes/shots/invisible2.js). Last arg of text2.py = accent colour (line 2 + tag).
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9,11,13,15,17,19
S=build/stills; O=../invisible/out/thumbs_gray; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 "${6:-150}" "$5" 1920 "$7"; }
t 1s_1.00.png   01_smug_1000_people.png      "1000 PEOPLE.|0 NOTICED."  "IN ONE DAY"        L 140 ff4a2e
t 3s_3.00.png   02_sad_everyone_danced.png   "EVERYONE|DANCED."         "RIGHT THROUGH ME"  L 150 ff3aa8
t 5s_5.00.png   03_angry_only_my_eyes.png    "ONLY MY|EYES LEFT."       "FLOATING IN THE DARK" L 150 ff9a1a
t 7s_7.00.png   04_sad_hand_up.png           "HAND UP.|FOR 3 HOURS."    "NOBODY CALLED ON ME" L 135 ff4a2e
t 9s_9.00.png   05_smug_i_entered_vault.png  "I ENTERED|THE VAULT."     "NO ALARM RANG"     R 135 ffcf3a
t 11s_11.00.png 06_sad_no_one_came.png       "NO ONE|CAME."             "MY BIRTHDAY"       R 150 ff8a1a
t 13s_13.00.png 07_shocked_not_one_call.png  "NOT ONE|CALL."            "A WHOLE YEAR"      L 150 ff4a2e
t 15s_15.00.png 08_crazy_i_went_blind.png    "I WENT|BLIND."            "SCIENCE SAYS SO"   L 150 b45cff
t 17s_17.00.png 09_smug_a_hoodie_walked_in.png "A HOODIE|WALKED IN."    "NOBODY BLINKED"    L 135 ff4a2e
t 19s_19.00.png 10_smug_skipped_the_line.png "SKIPPED|THE LINE."       "FOR A WHOLE YEAR"  L 140 ff4a2e
