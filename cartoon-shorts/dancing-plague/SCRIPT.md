# The Dancing Plague of 1518 — cartoon short (cartoon-short-kit)

Voice: ElevenLabs take supplied by the user (`voice.mp3`, 73.67 s). Word timings: faster-whisper `small` -> `work/words.json`.

## Facts used (sources)
- July 1518, Strasbourg: Frau Troffea begins dancing in the street; within about a week ~34 people join, within a month up to ~400
  (Waller, *A Time to Dance, a Time to Die*, 2008; Waller, "A forgotten plague", The Lancet 2009).
- Physicians blamed "hot blood" (natural causes) and prescribed more dancing; the council opened guild halls, built a stage,
  hired musicians and paid dancers (Strasbourg council records, cited by Waller).
- Reports of deaths are disputed ("reportedly").
- Ergot (moldy rye) theory: ergotism causes convulsions/cramps, not hours of coordinated dancing (Waller).
- Best-supported explanation: mass psychogenic illness under famine, disease and belief in St Vitus's curse.
- The council reversed course: music and public dancing banned; dancers taken to the shrine of St Vitus at Saverne
  and given red shoes; by early September the epidemic subsided.

## Pipeline
```
bash <kit>/tools/setup.sh .                     # three.js + toon base
cat web/toonbase.js web/roman.js web/medieval.js > web/toon.js
node render.mjs frames 0-2210                   # (run 4 chunks in parallel)
python3 audio.py                                # music + SFX -> mix_raw.wav
bash <kit>/tools/finish.sh "Dancing Plague 1518"
```
Files: `web/town.js` (Strasbourg square, cathedral, river, stage, shrine), `web/medieval.js` (1518 cast + props),
`web/story.js` (27 shots timed to the words), `audio.py` (original jig, cut on "No music", "Music banned" and "Silence").
