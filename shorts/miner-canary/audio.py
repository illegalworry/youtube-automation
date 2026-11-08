"""Synthesized score + SFX for "The Miner Who Weighed 20 Grams", mixed under voice.mp3.
Mix rule: voice unchanged, music +3 dB, SFX -6 dB. Picture timings come from web/story.js (30 fps)."""
import numpy as np, subprocess, wave

SR = 48000
TOTAL = 2334
DUR = TOTAL / 30
N = int(DUR * SR)
rng = np.random.default_rng(11)
F = lambda f: f / 30
midi = lambda m: 440 * 2 ** ((m - 69) / 12)

def load_voice():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "voice.mp3", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).copy(); out = np.zeros(N, np.float32); out[:min(N, len(v))] = v[:N]; return out
def tt(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if hi: X *= 1 / (1 + (f / hi) ** 4)
    if lo: X *= 1 - 1 / (1 + (f / lo) ** 4)
    return np.fft.irfft(X, len(x)).astype(np.float32)
def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if 0 <= i < N and j > i: buf[i:j] += sig[: j - i] * gain
def fade_io(s, a=0.01, r=0.05):
    n = len(s); e = np.ones(n, np.float32); ia, ir = int(a * SR), int(r * SR)
    if ia: e[:ia] = np.linspace(0, 1, ia)
    if ir: e[-ir:] *= np.linspace(1, 0, ir)
    return s * e

# ---------------- instruments ----------------
def harp(f, d=1.2, bright=0.55):
    t = tt(d); s = sum((bright ** k) * np.sin(2 * np.pi * f * (k + 1) * t + k) / (k + 1) for k in range(7))
    return (s * np.minimum(1, t / 0.003) * np.exp(-t / (d * 0.32))).astype(np.float32)
def whistle(f, d, vib=0.006):
    t = tt(d); ph = 2 * np.pi * f * t + vib * f / 5.5 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.25)
    s = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.03 * filt(noise(d), 800, 5000)
    return fade_io(s.astype(np.float32), 0.05, min(0.12, d * 0.3)) * 0.7
def pad(fs, d):
    t = tt(d); s = np.zeros(len(t))
    for f in fs:
        for det in (-0.12, 0.12): s += np.sin(2 * np.pi * (f + det) * t) + 0.3 * np.sin(4 * np.pi * (f + det) * t)
    return fade_io(filt((s / len(fs)).astype(np.float32), None, 1600), 0.4, 0.5)
def bass(f, d):
    t = tt(d); return (np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.01) * np.exp(-t / (d * 0.6))).astype(np.float32)
def tick(f=2200, d=0.05):
    t = tt(d); return (np.sin(2 * np.pi * f * t) * np.exp(-t * 90)).astype(np.float32)

music = np.zeros(N, np.float32)
# 1) Welsh-folk lilt in G major, 6/8, 0 s .. "And then silence" (32.6 s)
BPM = 116; q8 = 60 / BPM / 2  # an eighth note
prog = [(55, [55, 59, 62]), (60, [60, 64, 67]), (62, [62, 66, 69]), (55, [55, 59, 62]), (52, [52, 55, 59]), (60, [60, 64, 67]), (62, [62, 66, 69]), (55, [55, 59, 62])]
melody = [79, 78, 76, 74, 76, 78, 79, None, 74, 76, 74, 71, 72, 74, 76, 74, 72, 71, 69, None, 71, 72, 74, 71]  # one note per dotted quarter
STOP = 32.55
t0 = 0.0; bar = 0
while t0 < STOP:
    root, ch = prog[bar % len(prog)]
    place(music, bass(midi(root - 12), q8 * 6), t0, 0.32)
    for k in range(6):  # harp arpeggio 6/8
        tk = t0 + k * q8
        if tk >= STOP: break
        place(music, harp(midi(ch[[0, 1, 2, 1, 2, 1][k]] + 12), 0.9), tk, 0.16)
    for h in range(2):
        m = melody[(bar * 2 + h) % len(melody)]
        if m and bar >= 2 and t0 + h * 3 * q8 < STOP - 0.3: place(music, whistle(midi(m), q8 * 3 * 0.95), t0 + h * 3 * q8, 0.07)
    bar += 1; t0 += q8 * 6
i0 = int((STOP - 0.04) * SR); music[i0:] = 0
# 2) tension after the silence: low pulse + rising drone, sway .. "never wake up"
T1, T2 = F(1020), F(1500)
d = T2 - T1; t = tt(d)
drone = (np.sin(2 * np.pi * 49 * t) + 0.6 * np.sin(2 * np.pi * 73.4 * t) + 0.35 * np.sin(2 * np.pi * (98 + 4 * t / d) * t)) * np.minimum(1, t / 1.5)
drone = filt(drone.astype(np.float32), None, 500) * (0.6 + 0.4 * t / d)
place(music, drone, T1, 0.12)
for k, tb in enumerate(np.arange(F(1068), T2 - 0.3, 0.62)): place(music, bass(midi(31), 0.4), tb, 0.35 + 0.15 * (k % 2 == 0))
place(music, pad([midi(50), midi(53), midi(57)], F(1500) - F(1336)) , F(1336), 0.05)
# 3) thimble analogy: curious pizzicato, 51 s .. 57 s
for k, m in enumerate([67, 71, 74, 71, 72, 76, 79, 76, 74, 71, 67, 71, 74, 79, 78, 79]):
    place(music, harp(midi(m), 0.35, 0.3), F(1532) + k * 0.33, 0.15)
place(music, pad([midi(55), midi(59), midi(62)], F(1698) - F(1532)), F(1532), 0.035)
# 4) heart / poison: soft minor pad
place(music, pad([midi(52), midi(55), midi(59)], F(1920) - F(1700)), F(1700), 0.06)
# 5) rescue -> hope: rising harp + whistle reprise, 64 s .. end
q = 0.26
for k, m in enumerate([55, 59, 62, 67, 59, 62, 67, 71, 62, 67, 71, 74, 67, 71, 74, 79]): place(music, harp(midi(m), 0.6), F(1922) + k * q * 0.9, 0.14)
place(music, pad([midi(55), midi(59), midi(62)], F(2112) - F(1981)), F(1981), 0.05)
t0 = F(2062); bar = 0
while t0 < DUR - 1.2:
    root, ch = prog[bar % len(prog)]
    place(music, bass(midi(root - 12), q8 * 6), t0, 0.28)
    for k in range(6): place(music, harp(midi(ch[[0, 1, 2, 1, 2, 1][k]] + 12), 0.9), t0 + k * q8, 0.15)
    for h in range(2):
        m = melody[(bar * 2 + h) % len(melody)]
        if m: place(music, whistle(midi(m), q8 * 3 * 0.95), t0 + h * 3 * q8, 0.065)
    bar += 1; t0 += q8 * 6
# the joke lands dry: music ducks out on "Detectors don't sing", one last chord after
iA, iB = int(F(2296) * SR), int(F(2300) * SR); music[iA:iB] *= np.linspace(1, 0, iB - iA); music[iB:] = 0
place(music, harp(midi(67), 1.5), F(2326), 0.0)

# ---------------- SFX ----------------
sfx = np.zeros(N, np.float32)
def chirp_phrase(d=1.0, seed=0, pitch=1.0):
    r = np.random.default_rng(seed); out = np.zeros(int(d * SR), np.float32); tcur = 0.0
    while tcur < d - 0.12:
        nd = r.uniform(0.04, 0.11); t = tt(nd); f0 = r.uniform(2600, 4200) * pitch; f1 = f0 * r.uniform(0.75, 1.35)
        f = f0 + (f1 - f0) * t / nd + 180 * np.sin(2 * np.pi * r.uniform(25, 45) * t)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / nd) ** 1.5
        i = int(tcur * SR); out[i:i + len(s)] += s[: len(out) - i].astype(np.float32); tcur += nd + r.uniform(0.0, 0.05)
        if r.random() < 0.15: tcur += 0.12
    return out
def sing(a, b, g=0.22, seed=0):
    tcur = F(a); k = 0
    while tcur < F(b) - 0.3:
        dd = min(1.4, F(b) - tcur); place(sfx, chirp_phrase(dd, seed + k), tcur, g); tcur += dd + 0.35; k += 1
def thunk(f0=90, d=0.3):
    t = tt(d); return (np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + filt(noise(d), None, 1200) * np.exp(-t * 30) * 0.5).astype(np.float32)
def clink(f=1700, d=0.5):
    t = tt(d); return (sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (8 + 4 * k)) / k for k in (1, 2.7, 4.1)) + filt(noise(d), 2000) * np.exp(-t * 60) * 0.6).astype(np.float32)
def pick_hit():
    d = 0.35; t = tt(d); return (clink(2300, d) * 0.5 + filt(noise(d), 300, 4000) * np.exp(-t * 25) * 0.9 + thunk(110, d) * 0.4).astype(np.float32)
def whoosh(d=0.5, hi=1500):
    t = tt(d); return (filt(noise(d), None, hi) * np.sin(np.pi * t / d) ** 2 * 0.6).astype(np.float32)
def pop():
    t = tt(0.12); return (np.sin(2 * np.pi * (500 + 900 * t / 0.12) * t) * np.exp(-t * 35)).astype(np.float32)
def ambience_mine(d):
    t = tt(d); s = filt(noise(d), None, 120) * 2.2 + filt(noise(d), 400, 1200) * 0.05
    return s.astype(np.float32)
def drip():
    t = tt(0.25); f = 1200 + 900 * np.exp(-t * 30); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 22)).astype(np.float32)
def wind_birds(d):
    t = tt(d); s = filt(noise(d), 200, 900) * (0.3 + 0.2 * np.sin(2 * np.pi * 0.2 * t))
    for k in range(int(d * 1.2)): place_local(s, chirp_phrase(0.3, 100 + k, 0.8) * 0.15, rng.uniform(0, d - 0.4))
    return s.astype(np.float32)
def place_local(buf, sig, t0):
    i = int(t0 * SR); j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i]
def winch(d):
    t = tt(d); f = 70 + 20 * np.minimum(1, t / 0.8); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + 0.3 * np.sign(np.sin(2 * np.pi * np.cumsum(f * 2) / SR))
    return filt((s * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)).astype(np.float32), None, 900) * 0.6
def steps(d, rate=4.2, f0=140):
    out = np.zeros(int(d * SR), np.float32)
    for k in range(int(d * rate)): place_local(out, thunk(f0 + rng.uniform(-15, 15), 0.15) * 0.8 + filt(noise(0.15), 800, 4000) * np.exp(-tt(0.15) * 40) * 0.3, k / rate + rng.uniform(0, 0.02))
    return out
def hiss(d):
    t = tt(d); return (filt(noise(d), 3000, 9000) * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.3) * 0.5).astype(np.float32)
def water_run(d):
    t = tt(d); return (filt(noise(d), 500, 5000) * 0.35 * np.minimum(1, t / 0.15)).astype(np.float32)
def fill_tone(d, f0, f1):
    t = tt(d); f = f0 + (f1 - f0) * t / d; s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * (np.sin(2 * np.pi * 9 * t) > 0)) * 0.25
    return fade_io(filt(s.astype(np.float32), None, 2500), 0.05, 0.1)
def splash(d=0.5):
    t = tt(d); return (filt(noise(d), 400, 6000) * np.exp(-t * 9) * 0.6).astype(np.float32)
def heartbeat(f0=55, d=0.25):
    t = tt(d); return (np.sin(2 * np.pi * f0 * t) * np.exp(-t * 18)).astype(np.float32)
def boom(d=2.2):
    t = tt(d); return (filt(noise(d), None, 90) * 4 * np.exp(-t * 1.6) + np.sin(2 * np.pi * 38 * t) * np.exp(-t * 2)).astype(np.float32)
def beep(f=2000, d=0.09):
    t = tt(d); return fade_io((np.sin(2 * np.pi * f * t) * 0.5).astype(np.float32), 0.005, 0.02)
def creak(d=0.5, f0=150):
    t = tt(d); rate = f0 * (1 + 0.3 * np.sin(2 * np.pi * 1.4 * t / d)); ph = np.cumsum(rate) / SR
    s = (np.mod(ph, 1) < 0.08).astype(np.float32) * np.sin(np.pi * t / d); return filt(s, 200, 2400) * 2.0

MINE = [(0, 171), (406, 515), (595, 963), (1020, 1529), (1699, 1980)]
for a, b in MINE:
    s = ambience_mine(F(b + 1) - F(a)); place(sfx, fade_io(s, 0.15, 0.15), F(a), 0.5)
    for k in range(int((F(b) - F(a)) / 1.9)): place(sfx, drip(), F(a) + 0.6 + k * 1.9 + rng.uniform(0, 0.6), 0.12)
place(sfx, fade_io(ambience_mine(F(595) - F(516)), 0.1, 0.1), F(516), 0.25)
place(sfx, fade_io(wind_birds(F(406) - F(172)), 0.2, 0.15), F(172), 0.5)
place(sfx, fade_io(wind_birds(F(1699) - F(1530)), 0.2, 0.15), F(1530), 0.4)
place(sfx, fade_io(wind_birds(F(2333) - F(1981)), 0.2, 0.4), F(1981), 0.4)
# Betty sings (only while her beak moves on screen)
sing(0, 40, 0.24, 1); sing(98, 171, 0.24, 2); sing(406, 434, 0.2, 3); sing(595, 640, 0.2, 4); sing(692, 963, 0.13, 5)
sing(2062, 2112, 0.24, 6); sing(2113, 2229, 0.14, 7); sing(2299, 2333, 0.26, 8)
# pickaxe strikes: frame where swing passes 0.7 of the 22 f cycle (two men, phases 0 and 9), foreman 26 f cycle phase 5
for a, b in [(0, 171), (692, 963), (1068, 1082)]:
    for f in range(a, b + 1):
        for ph, per, g in [(0, 22, 0.5), (9, 22, 0.42), (5, 26, 0.38)]:
            if (f + ph) % per == int(0.7 * per): place(sfx, pick_hit(), F(f), g * (0.55 if a == 692 and f < 746 else 1))
place(sfx, whoosh(0.8), F(104), 0.4)                   # pull back
place(sfx, whoosh(0.4, 3000), F(170), 0.7)             # flash into the valley
place(sfx, winch(F(296) - F(246)), F(246), 0.7); place(sfx, clink(900, 0.6), F(250), 0.6)
for f in (298, 312, 331): place(sfx, pop(), F(f), 0.7)
place(sfx, thunk(160, 0.2), F(312), 0.3)
place(sfx, clink(2400, 0.4), F(350), 0.4)              # cage handle
place(sfx, whoosh(0.35, 2500), F(443), 0.5)            # punch in on "boss"
place(sfx, whoosh(1.6, 900), F(522), 0.6)              # rise through the rock
place(sfx, whoosh(0.5), F(636), 0.5)
place(sfx, whoosh(0.3), F(745), 0.3)
place(sfx, creak(0.6, 140), F(1024), 0.6); place(sfx, creak(0.6, 120), F(1046), 0.5)
place(sfx, clink(1300, 0.9), F(1095), 1.0); place(sfx, thunk(70, 0.5), F(1095), 0.9)
place(sfx, steps(F(1250) - F(1161), 5.0), F(1161), 0.5)
place(sfx, fade_io(hiss(F(1500) - F(1340)), 0.5, 0.5), F(1340), 0.12)   # the gas you cannot hear... barely
place(sfx, boom(), F(1496), 0.6)
place(sfx, water_run(F(1665) - F(1588)), F(1588), 0.6); place(sfx, fill_tone(1.5, 600, 1500), F(1590), 0.5)
place(sfx, fade_io(water_run(F(1698) - F(1666)), 0.02, 0.1), F(1666), 0.5)
for k in range(5): place(sfx, splash(0.35), F(1636) + k * 0.47, 0.35)
for f in range(1699, 1828):                            # Betty's tiny fast heart / your slow one
    if f < 1748 or True:
        if int(f * 1.5 / (2 * np.pi)) != int((f - 1) * 1.5 / (2 * np.pi)): place(sfx, heartbeat(140, 0.08), F(f), 0.3)
    if f >= 1748 and int(f * 0.16 / (2 * np.pi)) != int((f - 1) * 0.16 / (2 * np.pi)): place(sfx, heartbeat(48, 0.3), F(f), 0.9); place(sfx, heartbeat(44, 0.3), F(f) + 0.18, 0.6)
t = tt(1.2); place(sfx, (np.sin(2 * np.pi * np.cumsum(3000 - 2200 * t / 1.2) / SR) * np.exp(-t * 2) * 0.4).astype(np.float32), F(1852), 0.35)  # Betty falters
place(sfx, steps(F(1980) - F(1920), 5.4), F(1920), 0.55)
place(sfx, whoosh(0.4, 3000), F(1979), 0.5)
place(sfx, fade_io(hiss(F(2060) - F(1990)), 0.1, 0.2), F(1990), 0.5)  # oxygen
place(sfx, whoosh(0.4, 3000), F(2111), 0.5)
place(sfx, thunk(120, 0.25), F(2262), 0.6)
for f in range(2245, 2334, 16): place(sfx, beep(2100), F(f), 0.25)

voice = load_voice()
ve = np.abs(voice); k = int(0.06 * SR); ve = np.convolve(ve, np.ones(k) / k, "same")
duck = 1 - 0.5 * np.clip(ve / (ve.max() * 0.25), 0, 1)
MUS_DB, SFX_DB = 3.0, -6.0
mix = voice + music * duck * 0.23 * 10 ** (MUS_DB / 20) + sfx * (0.5 + 0.5 * duck) * 1.4 * 10 ** (SFX_DB / 20)
mix = np.tanh(mix * 0.95) / np.tanh(0.95)
fd = int(0.05 * SR); mix[-fd:] *= np.linspace(1, 0, fd)
for name, x in [("mix_raw.wav", mix), ("work/music.wav", music), ("work/sfx.wav", sfx)]:
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(name, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", N / SR)
