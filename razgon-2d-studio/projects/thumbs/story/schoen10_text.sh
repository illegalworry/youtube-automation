#!/bin/sh
# Overlays German text on the 10 «Der schönste Mensch der Welt» stills and saves full-1080p thumbnails.
# run from projects/thumbs/ after: node render.mjs --project projects/thumbs --stills 1,3,5,7,9,11,13,15,17,19
S=build/stills; O=../schoenste-mensch/out/thumbs_why; mkdir -p $O
t() { python3 story/text2.py "$S/$1" "$O/$2" "$3" "$4" 70 40 "${6:-150}" "$5" 1920; }
t 1s_1.00.png   01_smug_alles_gratis.png        "ALLES|GRATIS."       "SEIT 3 JAHREN"     R
t 3s_3.00.png   02_shocked_nie_mehr_allein.png  "NIE MEHR|ALLEIN."    "24/7 BEOBACHTET"   L
t 5s_5.00.png   03_sad_keine_freunde.png        "KEINE|FREUNDE."      "NUR FANS"          L
t 7s_7.00.png   04_angry_sofort_gefeuert.png    "SOFORT|GEFEUERT."    "AM ERSTEN TAG"     R
t 9s_9.00.png   05_crazy_ueberall_ich.png       "ÜBERALL|ICH."        "OHNE ERLAUBNIS"    L
t 11s_11.00.png 06_shocked_niemand_hoert_zu.png "NIEMAND|HÖRT ZU."    "SIE STARREN NUR"   R
t 13s_13.00.png 07_smug_immer_unschuldig.png    "IMMER|UNSCHULDIG."   "HALO-EFFEKT"       L 140
t 15s_15.00.png 08_angry_lasst_mich_in_ruhe.png "LASST MICH|IN RUHE." "TAG UND NACHT"     L
t 17s_17.00.png 09_sad_ich_werde_alt.png        "ICH WERDE|ALT."      "UND DANN?"         R
t 19s_19.00.png 10_crazy_ich_bin_gefangen.png   "ICH BIN|GEFANGEN."   "IN MEINER WOHNUNG" R
