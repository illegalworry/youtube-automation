"""Kokoro (onnx) TTS + faster-whisper word timings.
Usage: python voice_kokoro.py SCRIPT.md OUTDIR [--speed 1.15] [--voice am_michael]
Needs kokoro-v1.0.onnx and voices-v1.0.bin in OUTDIR.
Writes OUTDIR/voice.wav (48 kHz mono) and OUTDIR/words.json [{"w","s","e"}].
"""
import sys, re, json, argparse, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("script"); ap.add_argument("out")
ap.add_argument("--speed", type=float, default=1.15)
ap.add_argument("--voice", default="am_michael")
a = ap.parse_args()

md = open(a.script, encoding="utf-8").read()
vo = md.split("## Voice-over", 1)[1].split("\n## ", 1)[0]
paras = [p.strip() for p in vo.split("\n\n")[1:] if p.strip()]
k = Kokoro(f"{a.out}/kokoro-v1.0.onnx", f"{a.out}/voices-v1.0.bin")
sr, chunks = 24000, []
for p in paras:
    s, sr = k.create(p, voice=a.voice, speed=a.speed, lang="en-us")
    chunks += [s, np.zeros(int(sr * 0.28), dtype=np.float32)]
y = np.concatenate(chunks)
import subprocess, tempfile, os
tmp = a.out + "/_raw.wav"; sf.write(tmp, y, sr)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-ar", "48000", "-ac", "1", a.out + "/voice.wav"], check=True)
os.remove(tmp)
m = WhisperModel("small.en", compute_type="int8")
raw = subprocess.run(["ffmpeg","-loglevel","error","-i",a.out+"/voice.wav","-ar","16000","-ac","1","-f","f32le","-"],capture_output=True,check=True).stdout
segs, _ = m.transcribe(np.frombuffer(raw, dtype=np.float32), word_timestamps=True)
words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for sg in segs for w in sg.words]
json.dump(words, open(a.out + "/words.json", "w"), ensure_ascii=False, indent=1)
print(len(words), "words, %.1f s" % (len(y) / sr))
