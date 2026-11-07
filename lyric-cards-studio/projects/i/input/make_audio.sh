#!/bin/sh
# Rebuild input/song.wav from input/full.m4a: low-pass "drop" 19.30–20.34 with noise riser and sub impact,
# short dip before the second half (29.70–30.00), fade-out, loudness to about -11 LUFS.
cd "$(dirname "$0")"
ffmpeg -v error -y -i full.m4a -f lavfi -t 1.15 -i "anoisesrc=color=pink:amplitude=0.5:seed=7" -f lavfi -t 1.6 -i "sine=frequency=48:sample_rate=44100" -filter_complex "
[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[a][b];
[a]volume='if(between(t,19.30,20.34),max(0,1-(t-19.30)/0.35),1)*if(between(t,29.70,30.0),0.35,1)':eval=frame[dry];
[b]lowpass=f=420,lowpass=f=420,volume='if(between(t,19.30,20.34),min(1,(t-19.30)/0.35)*1.7,0)':eval=frame[wet];
[1:a]aformat=sample_rates=44100:channel_layouts=stereo,highpass=f=800,volume='0.05+0.5*pow(t/1.15,3)':eval=frame,afade=t=out:st=1.05:d=0.1,adelay=19200|19200[rise];
[2:a]aformat=sample_rates=44100:channel_layouts=stereo,volume='1.6*exp(-t*2.6)':eval=frame,afade=t=in:d=0.01,adelay=20340|20340[boom];
[dry][wet][rise][boom]amix=inputs=4:normalize=0:duration=first,afade=t=in:d=0.04,afade=t=out:st=39.5:d=1.1,loudnorm=I=-10.5:TP=-1.0:LRA=9[o]" -map "[o]" -ar 44100 -c:a pcm_s16le song.wav
