"""Synthesized music bed + SFX for the Dancing Plague short, mixed under voice.mp3."""
import numpy as np, subprocess, wave

SR = 48000
DUR = 2211 / 30
N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def load_voice():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "voice.mp3", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).copy()
    out = np.zeros(N, np.float32); out[:min(N, len(v))] = v[:N]; return out

def env(n, a=0.005, r=0.2, sus=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e

def lp(x, k):  # one-pole low-pass, k in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y

def lp_fast(x, cutoff):
    # FFT brick-ish low-pass (fast, fine for beds)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)

def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 - 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)

def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if i < N and j > i: buf[i:j] += sig[: j - i] * gain

midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- music: an original street jig (D dorian, 6/8 feel) ----------------
music = np.zeros(N, np.float32)
BPM = 132; beat = 60 / BPM
def pluck(f, dur=0.35, bright=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((bright ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6))
    return (s * env(n, 0.003, dur * 0.35)).astype(np.float32)
def fife(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * f * t + 0.004 * np.sin(2 * np.pi * 6 * t) * f / 100
    s = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph) + 0.04 * rng.standard_normal(n)
    a = np.minimum(1, t / 0.02) * np.minimum(1, (dur - t) / 0.04).clip(0)
    return (s * a).astype(np.float32)
def drone(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * k * t + k) / k ** 1.2 for k in range(1, 9))
    return lp_fast((s * np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.3).clip(0)).astype(np.float32), 1400)
def brass(fs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in fs:
        ph = 2 * np.pi * f * t + 0.003 * np.sin(2 * np.pi * 5 * t)
        s += sum(np.sin((k + 1) * ph) / (k + 1) ** 1.3 for k in range(8))
    a = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.15).clip(0)
    return lp_fast((s * a).astype(np.float32), 1800) / len(fs)
def tabor(kind):
    n = int(0.25 * SR); t = np.arange(n) / SR
    if kind == "low":
        f = 80 + 60 * np.exp(-t * 25); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12)).astype(np.float32)
    return hp_fast((rng.standard_normal(n) * np.exp(-t * 35) * 0.7 + np.sin(2 * np.pi * 230 * t) * np.exp(-t * 25) * 0.4).astype(np.float32), 250)
D = 62
TUNE = [(0, 1), (2, .5), (3, .5), (5, 1), (3, .5), (2, .5), (0, 1), (-2, .5), (0, .5), (2, 2),
        (5, 1), (7, .5), (9, .5), (10, 1), (9, .5), (7, .5), (5, 1), (3, .5), (2, .5), (0, 2)]
def tune_level(t):
    # gain curve over story time: quiet hook bed, NO music on "No music", loud on the hired musicians, cut on "Music banned"
    pts = [(0, .55), (12.4, .55), (12.5, 0), (15.2, 0), (15.6, .5), (23.4, .45), (26.6, .35), (35.6, .4), (35.9, 1.0), (39.6, 1.0), (40.0, .55),
           (47.9, .4), (62.3, .45), (62.5, 0), (99, 0)]
    xs, ys = zip(*pts); return float(np.interp(t, xs, ys))
tt = 0.0; bar = 0
while tt < 62.5:
    # tune
    x = tt
    for semi, L in TUNE:
        d = L * beat * 2
        g = tune_level(x)
        if g > 0.01: place(music, fife(midi(D + 12 + semi), d * 0.92), x, 0.08 * g)
        x += d
    # drone + tabor under it
    seg = x - tt
    k = int(seg / beat)
    for i in range(k):
        tb = tt + i * beat; g = tune_level(tb)
        if g > 0.01:
            place(music, tabor("low" if i % 3 == 0 else "hi"), tb, (0.5 if i % 3 == 0 else 0.22) * g)
            if i % 3 == 0: place(music, pluck(midi(D - 12 if (i // 6) % 2 == 0 else D - 14), 0.5, 0.4), tb, 0.3 * g)
    dr = drone(midi(D - 12), seg)
    lvl = np.array([tune_level(tt + j / SR) for j in range(0, len(dr), 480)])
    dr *= np.repeat(lvl, 480)[: len(dr)]
    place(music, dr, tt, 0.05)
    tt = x
# hard stop on "Music banned"
i0 = int(62.42 * SR); music[i0:] = 0
# soft, tired after-music: a slow low pad for the shrine and September, gone on "Silence"
pad_t0, pad_t1 = 64.5, 72.7
n = int((pad_t1 - pad_t0) * SR); tp = np.arange(n) / SR
pad = sum(np.sin(2 * np.pi * midi(m) * tp) for m in (50, 57, 62, 65)) * np.minimum(1, tp / 1.5) * np.minimum(1, (pad_t1 - pad_t0 - tp) / 0.6).clip(0)
place(music, lp_fast(pad.astype(np.float32), 900), pad_t0, 0.035)

# ---------------- sfx ----------------
sfx = np.zeros(N, np.float32)
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def thunk(f0=90, d=0.3):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + lp_fast(noise(d), 1200) * np.exp(-t * 30) * 0.5).astype(np.float32)
def rumble(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 160) * 3 * np.minimum(1, t / 0.15) * np.exp(-t / (d * 0.45))
    return s.astype(np.float32)
def crash(d=1.2):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k in range(14):
        tk = rng.uniform(0, d * 0.6); i = int(tk * SR); g = thunk(rng.uniform(60, 160), 0.35) * rng.uniform(0.3, 0.9)
        s[i:i + len(g)] += g[: n - i]
    s += lp_fast(noise(d), 2500) * np.exp(-t * 3) * 0.25
    return s
def cuckoo():
    out = []
    for f, d in [(740, 0.16), (587, 0.24)]:
        n = int(d * SR); t = np.arange(n) / SR
        out.append(np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.01) * np.exp(-t * 6)); out.append(np.zeros(int(0.06 * SR)))
    return np.concatenate(out).astype(np.float32)
def scrape(d=0.8):
    n = int(d * SR); t = np.arange(n) / SR
    s = noise(d) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) * np.sin(np.pi * t / d)
    s = hp_fast(lp_fast(s, 5000), 1500)
    ring = np.sin(2 * np.pi * 1870 * t) * np.exp(-t * 3) * 0.2
    return (s * 0.6 + ring).astype(np.float32)
def ting():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 4), (3136, 6), (4186, 8)]) * 0.3).astype(np.float32)
def sting():
    n = int(2.0 * SR); t = np.arange(n) / SR
    low = np.sin(2 * np.pi * 41 * t) * np.exp(-t * 1.5) * 1.2
    hit = lp_fast(noise(2.0), 900) * np.exp(-t * 6) * 0.8
    stab = brass([midi(45), midi(48), midi(51)], 1.4); s = low + hit; s[: len(stab)] += stab * 2.2 * np.exp(-np.arange(len(stab)) / SR * 2)
    return s.astype(np.float32)
def creak(d=0.6, f0=140):
    n = int(d * SR); t = np.arange(n) / SR
    rate = f0 * (1 + 0.35 * np.sin(2 * np.pi * 1.3 * t / d))
    ph = np.cumsum(rate) / SR; pulses = (np.mod(ph, 1) < 0.08).astype(np.float32)
    s = lp_fast(pulses * (0.6 + 0.4 * rng.random(n).astype(np.float32)), 2200) * np.sin(np.pi * t / d)
    return hp_fast(s, 200) * 2.5
def snap():
    d = 0.5; n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(noise(d), 800) * np.exp(-t * 18) * 1.4 + np.pad(thunk(120, 0.4), (0, n - int(0.4 * SR))) * 0.6).astype(np.float32)
def splash(d=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 4000) * (np.exp(-t * 4) * np.minimum(1, t / 0.01)) + lp_fast(noise(d), 400) * np.exp(-t * 7) * 1.5
    return s.astype(np.float32)
def whoosh(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 1500) * np.sin(np.pi * t / d) ** 2 * 0.6).astype(np.float32)
def snore(d=1.1):
    n = int(d * SR); t = np.arange(n) / SR
    buzz = (np.mod(np.cumsum(60 + 25 * np.sin(np.pi * t / d)) / SR, 1) < 0.3).astype(np.float32)
    return (lp_fast(buzz * 0.5 + noise(d) * 0.15, 700) * np.sin(np.pi * t / d) ** 2).astype(np.float32)
def leaves(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(lp_fast(noise(d), 6000), 2500) * (0.3 + 0.3 * np.sin(2 * np.pi * 0.7 * t) ** 2) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)).astype(np.float32)
def water(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 900) * 0.5 + hp_fast(lp_fast(noise(d), 3000), 1200) * 0.15 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t))).astype(np.float32)

F = lambda f: f / 30
def chime():
    n = int(1.4 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(1318, 3), (1976, 4), (2637, 6)]) * 0.25).astype(np.float32)
def step(): return (lp_fast(noise(0.08), 1800) * np.exp(-np.arange(int(0.08 * SR)) / SR * 50)).astype(np.float32)
def coin():
    n = int(0.5 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 9) * 0.4 + np.sin(2 * np.pi * 3900 * t) * np.exp(-t * 12) * 0.3).astype(np.float32)
def yawn(d=1.0, f0=220):
    n = int(d * SR); t = np.arange(n) / SR; f = f0 * (1.3 - 0.6 * t / d)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 2
    return lp_fast((s * 0.5 + noise(d) * 0.15 * np.sin(np.pi * t / d)).astype(np.float32), 1500)
def cough():
    out = np.zeros(int(0.7 * SR), np.float32)
    for k in range(2):
        n = int(0.16 * SR); t = np.arange(n) / SR; c = lp_fast(noise(0.16), 2000) * np.exp(-t * 20)
        out[int(k * 0.28 * SR): int(k * 0.28 * SR) + n] += c
    return out
def sizzle(d): return (hp_fast(noise(d), 3000) * 0.3 * np.minimum(1, np.arange(int(d * SR)) / SR / 0.1) * np.exp(-np.arange(int(d * SR)) / SR / d * 2)).astype(np.float32)
def crowd(d, dens=1.0):
    n = int(d * SR); s = np.zeros(n, np.float32)
    for _ in range(int(d * 14 * dens)):
        i = rng.integers(0, max(1, n - int(0.1 * SR))); st = step() * rng.uniform(0.2, 0.7); s[i:i + len(st)] += st[: n - i]
    s += lp_fast(noise(d), 500) * 0.12 * dens
    a = np.minimum(1, np.arange(n) / SR / 0.3) * np.minimum(1, (d - np.arange(n) / SR) / 0.3).clip(0)
    return (s * a).astype(np.float32)
def thud(): return thunk(70, 0.4)

place(sfx, crowd(F(188)), 0, 0.5)                       # hook: hundreds of feet on cobbles
place(sfx, whoosh(0.8), F(40), 0.4)                       # pull up to the aerial
place(sfx, whoosh(0.5), F(186), 0.6)                      # flash to Strasbourg
place(sfx, chime(), F(196), 0.35)                         # cathedral bells
place(sfx, chime(), F(214), 0.25)
for k in range(11): place(sfx, step(), F(297) + k * 0.3, 0.5)  # she walks out
for k in range(24): place(sfx, step(), F(349) + k * 0.25, 0.45)  # she starts to dance (no music)
place(sfx, crowd(F(547) - F(463), 0.5), F(463), 0.45)
place(sfx, crowd(F(618) - F(548), 2.0), F(548), 0.6)
place(sfx, crowd(F(702) - F(619), 0.8), F(619), 0.55)
place(sfx, thud(), F(716), 0.9); place(sfx, thud(), F(744), 0.8); place(sfx, thud(), F(768), 0.7)
place(sfx, snore(1.2), F(775), 0.3)
place(sfx, ting(), F(858), 0.35)                          # the doctor's flask
place(sfx, sizzle(1.0), F(893), 0.8)                      # "Hot blood"
place(sfx, whoosh(0.4), F(986), 0.4)
place(sfx, thunk(95, 0.3), F(1035), 0.6)                  # council opens the halls
for k in range(3): place(sfx, coin(), F(1108) + k * 0.13, 0.5)
place(sfx, crowd(F(1222) - F(1191), 2.5), F(1191), 0.7)
place(sfx, whoosh(0.4), F(1200), 0.5)
place(sfx, ting(), F(1300), 0.3)                          # moldy rye reveal
place(sfx, thunk(120, 0.25), F(1332), 0.5)                # "Probably not" (the X)
place(sfx, creak(0.5, 160), F(1377), 0.5)                 # cramps
place(sfx, cough(), F(1515), 0.6)
place(sfx, sting(), F(1582), 0.55)                        # the saint's curse
place(sfx, yawn(1.0, 230), F(1716), 0.5)
place(sfx, yawn(0.9, 180), F(1752), 0.4); place(sfx, yawn(0.9, 260), F(1754), 0.35)
place(sfx, yawn(0.9, 200), F(1774), 0.35); place(sfx, yawn(0.9, 300), F(1777), 0.3)
place(sfx, thunk(80, 0.4), F(1843), 0.9)                  # council's fist
place(sfx, snap(), F(1873), 0.8)                          # drumstick snapped
place(sfx, thunk(90, 0.3), F(1909), 0.7)                  # dancing stops dead
for k in range(int((F(2031) - F(1941)) / 0.33)): place(sfx, step(), F(1941) + k * 0.33, 0.3)
place(sfx, leaves(F(2180) - F(2032)), F(2032), 0.3)
for k in range(8): place(sfx, step(), F(2112) + k * 0.3, 0.35)
place(sfx, whoosh(0.3), F(2150), 0.3)
# Silence: everything under the voice is cut at the word
cut = int(F(2183) * SR)

voice = load_voice()
# duck the bed under the voice (envelope follower)
ve = np.abs(voice); k = int(0.05 * SR)
ve = np.convolve(ve, np.ones(k) / k, "same"); duck = 1 - 0.45 * np.clip(ve / (ve.max() * 0.25), 0, 1)
music[cut:] = 0; sfx[cut:] = 0
mix = voice + music * duck * 1.4 + sfx * 0.5
mix = np.tanh(mix * 0.95) / np.tanh(0.95)
fade = int(0.04 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open("mix_raw.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", len(pcm) / SR)
