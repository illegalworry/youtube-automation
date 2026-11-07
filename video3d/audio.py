# Builds mix.wav: your voiceover + soft generated music pad + simple synthesized SFX, normalised. No external plugins.
import numpy as np, subprocess, wave, sys
SR = 44100; DUR = 22.96; N = int(SR * DUR)
def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)
t = np.arange(N) / SR
voice = np.zeros(N, np.float32); v = load('voice.mp3'); voice[:min(N, len(v))] = v[:N]
# music: warm pad (playful, then a darker minor from 16.4 s), slow chord changes + soft pluck bass
def note(f): return 440 * 2 ** ((f - 69) / 12)
prog1 = [[57, 64, 69], [53, 60, 65], [48, 55, 64], [55, 62, 67]]; prog2 = [[57, 60, 64], [53, 57, 60], [52, 56, 59], [57, 60, 64]]
music = np.zeros(N)
for i in range(int(DUR / 2.4) + 1):
    t0, t1 = i * 2.4, min(DUR, (i + 1) * 2.4)
    if t0 >= DUR: break
    ch = (prog2 if t0 >= 16.4 else prog1)[i % 4]; a, b = int(t0 * SR), int(t1 * SR); tt = np.arange(b - a) / SR
    env = np.minimum(1, tt / 0.5) * np.minimum(1, (t1 - t0 - tt) / 0.6 + 0.001)
    seg = sum(np.sin(2 * np.pi * note(n) * tt) + 0.4 * np.sin(2 * np.pi * note(n) * 2 * tt) * 0.5 for n in ch) * env
    seg += 0.8 * np.sin(2 * np.pi * note(ch[0] - 12) * tt) * env
    music[a:b] += seg
for k in range(int(DUR * 2)):  # soft plucks on each beat of 120 bpm eighths (very quiet)
    tp = k * 0.5; a = int(tp * SR); m = min(N - a, int(0.3 * SR))
    if m > 0: n = [69, 72, 76, 72][k % 4] + (-2 if tp >= 16.4 and k % 4 == 2 else 0); tt = np.arange(m) / SR; music[a:a + m] += 0.5 * np.sin(2 * np.pi * note(n) * tt) * np.exp(-tt * 9)
music = music / np.abs(music).max() * 0.08
fade = np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 1.2); music *= fade
# SFX
sfx = np.zeros(N)
def add(t0, sig, g=1.0):
    a = int(t0 * SR); m = min(len(sig), N - a)
    if m > 0: sfx[a:a + m] += sig[:m] * g
rng = np.random.default_rng(3)
def whoosh(d=0.45):
    tt = np.arange(int(d * SR)) / SR; n = rng.standard_normal(len(tt)); k = np.convolve(n, np.ones(40) / 40, mode='same') * np.sin(np.pi * tt / d) ** 2; return k * 0.6
def thud(d=0.5, f0=95):
    tt = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * (f0 * np.exp(-tt * 7)) * tt) * np.exp(-tt * 6) + 0.25 * rng.standard_normal(len(tt)) * np.exp(-tt * 40)
def pop(f=900, d=0.14):
    tt = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * (1 + tt * 3) * tt) * np.exp(-tt * 28)
def blip(f=1200, d=0.12):
    tt = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 22) * 0.6
def tick(d=0.05):
    tt = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(tt)) * np.exp(-tt * 120) * 0.3
add(0.0, blip(1000, 0.1), 0.5)                      # start
add(2.55, pop(), 0.8); add(3.55, whoosh(0.4), 0.6)  # "?" bubble, time-skip dip
add(4.65, thud(0.55, 90), 1.0)                     # "НОРМАЛЬНО" slams
add(6.35, pop(1100), 0.7); add(7.85, blip(700), 0.7)# bubbles
add(9.7, thud(0.3, 140), 0.8); add(9.75, blip(900), 0.5)  # switch flips
add(11.75, whoosh(0.35), 0.7); add(12.3, blip(1300), 0.6); add(13.1, blip(1500), 0.6); add(13.8, pop(1300), 0.8)  # card
add(15.3, thud(0.6, 80), 1.1)                      # ВЫКЛЮЧЕНО
add(17.3, pop(1000), 0.8)                          # Rita bubble
add(19.4, thud(0.7, 70), 1.2); [add(19.9 + i * 0.5, tick(), 1.0) for i in range(5)]  # cliffhanger
sfx = sfx / max(1e-6, np.abs(sfx).max()) * 0.5
mix = voice * 1.0 + music * 1.0 + sfx * 0.33
mix = mix / max(1, np.abs(mix).max() / 0.95)
with wave.open('build/mix_raw.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'build/mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', 'build/mix.wav'], check=True)
print('audio ok')
