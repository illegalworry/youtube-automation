# CPU-расшифровка (faster-whisper) для машин без видеокарты. Формат выхода тот же, что у transcribe.mts.
import json, sys, os, shutil, re
from faster_whisper import WhisperModel
src, lang, model_name = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else "small.en")
model = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=4)
import subprocess, numpy as np
raw = subprocess.run(["ffmpeg","-v","error","-i",src,"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True,check=True).stdout
audio = np.frombuffer(raw, dtype=np.float32)
segments, info = model.transcribe(audio, language=lang, word_timestamps=True, vad_filter=False, beam_size=1)
words = []
for seg in segments:
    for w in seg.words:
        t = w.word.strip()
        if t:
            words.append({"text": t, "start": round(w.start, 3), "end": round(w.end, 3)})
    print(f"  ...{seg.end:.0f}s", flush=True)
duration = round(len(audio)/16000, 3)
ext = os.path.splitext(src)[1].lower()
os.makedirs("public/audio", exist_ok=True); os.makedirs("data", exist_ok=True)
voice = f"audio/voice{ext}"
shutil.copyfile(src, os.path.join("public", voice))
lines, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    gap = (words[i+1]["start"] - w["end"]) if i + 1 < len(words) else 99
    if re.search(r"[.!?]$", w["text"]) or gap > 0.8 or len(cur) >= 22:
        lines.append(f"[{cur[0]['start']:.2f} - {cur[-1]['end']:.2f}] " + " ".join(x["text"] for x in cur)); cur = []
json.dump({"duration": duration, "voice": voice, "language": lang, "words": words}, open("data/transcript.json", "w"), ensure_ascii=False, indent=2)
open("data/transcript.txt", "w").write(f"duration: {duration:.2f} s\nvoice: {voice}\n\n" + "\n".join(lines) + "\n")
print(f"done: {len(words)} words, {len(lines)} lines")
