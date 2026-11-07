"""Soundtrack v2 for the Dancing Plague short: an original, energetic saltarello-style street band,
town ambience (crowd babble, rhythmic stomping, shouts, birds, bells), evening ambience and SFX, all
synthesized with numpy and mixed in stereo under voice.mp3.  ->  mix_raw.wav (48 kHz stereo) + stems/

The tune's dotted-quarter beat is 0.5 s, the same 2 Hz step cycle the dancers use on screen.
Story beats: band cuts out on "No music", comes back as people join, peaks with the hired musicians,
is cut dead on "Music banned"; a quiet fife lament for the shrine; everything stops on "Silence".
"""
import numpy as np, subprocess, wave, os

SR = 48000
DUR = 2211 / 30
N = int(DUR * SR)
rng = np.random.default_rng(1518)
F = lambda f: f / 30
midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- dsp helpers ----------------
def fft_filter(x, lo=None, hi=None, order=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if hi: g *= 1 / (1 + (f / hi) ** order)
    if lo: g *= 1 - 1 / (1 + (f / max(lo, 1)) ** order)
    return np.fft.irfft(X * g, len(x)).astype(np.float32)
lp = lambda x, c, o=4: fft_filter(x, hi=c, order=o)
hp = lambda x, c, o=4: fft_filter(x, lo=c, order=o)
bp = lambda x, a, b, o=4: fft_filter(x, lo=a, hi=b, order=o)
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def tarr(d): return np.arange(int(d * SR)) / SR
def adsr(n, a=0.005, r=0.05):
    t = np.arange(n) / SR; d = n / SR
    return (np.minimum(1, t / max(a, 1e-4)) * np.clip((d - t) / max(r, 1e-4), 0, 1)).astype(np.float32)
def stereo(): return np.zeros((2, N), np.float32)
def place(buf, sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig)); s = sig[: j - i] * gain
    a = (pan + 1) * np.pi / 4; buf[0, i:j] += s * np.cos(a); buf[1, i:j] += s * np.sin(a)
def conv_reverb(x, dur=1.2, decay=3.5, wet=0.2, tone=4000):
    n = int(dur * SR); t = np.arange(n) / SR
    ir = lp(rng.standard_normal(n).astype(np.float32), tone) * np.exp(-t * decay); ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    ir /= np.sqrt((ir ** 2).sum())
    L = 1 << int(np.ceil(np.log2(x.shape[-1] + n)))
    out = np.empty_like(x)
    for c in range(x.shape[0]):
        y = np.fft.irfft(np.fft.rfft(x[c], L) * np.fft.rfft(ir, L), L)[: x.shape[-1]]
        out[c] = x[c] + wet * y.astype(np.float32)
    return out
def envelope(points, hard=()):
    """gain curve from (time, gain) points with linear ramps; `hard` = times of instant cuts (30 ms)."""
    t = np.arange(N) / SR; xs, ys = zip(*points); g = np.interp(t, xs, ys).astype(np.float32)
    return g

# ---------------- instruments ----------------
def fife(f, d, vib=0.006, breath=0.06):
    t = tarr(d); n = len(t)
    v = 1 + vib * np.sin(2 * np.pi * 5.6 * t) * np.clip((t - 0.07) / 0.1, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * v) / SR
    s = np.sin(ph) + 0.32 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph) + 0.05 * np.sin(4 * ph)
    s = s + breath * bp(rng.standard_normal(n).astype(np.float32), f * 1.5, f * 4)
    chiff = bp(rng.standard_normal(n).astype(np.float32), 2000, 6000) * np.exp(-t * 90) * 0.25
    return ((s + chiff) * adsr(n, 0.012, 0.03)).astype(np.float32)
def chanter(f, d):  # reedy bagpipe-ish lead an octave below the fife
    t = tarr(d); n = len(t); ph = 2 * np.pi * f * t * (1 + 0.002 * np.sin(2 * np.pi * 4.8 * t))
    s = sum((1.0 if k % 2 else 0.55) / k ** 0.85 * np.sin(k * ph) for k in range(1, 14))
    return lp((s * adsr(n, 0.01, 0.02)).astype(np.float32), 3800) * 0.35
def ks(f, d, bright=0.6, decay=0.994):  # Karplus-Strong pluck (lute)
    P = max(2, int(round(SR / f))); n = int(d * SR)
    y = np.zeros(n + 2 * P, np.float32); exc = rng.uniform(-1, 1, P).astype(np.float32)
    for _ in range(int((1 - bright) * 6)): exc = 0.5 * (exc + np.roll(exc, 1))
    y[P: 2 * P] = exc
    for k in range(2 * P, n + 2 * P, P):
        m = min(P, n + 2 * P - k); y[k: k + m] = decay * 0.5 * (y[k - P: k - P + m] + y[k - P - 1: k - P - 1 + m])
    out = y[P: P + n]; return (out * adsr(n, 0.001, 0.05)).astype(np.float32)
def drone_track(roots=(50, 57, 62)):
    t = np.arange(N) / SR; s = np.zeros(N, np.float32)
    for m in roots:
        f = midi(m); ph = 2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.13 * t)
        s += sum(np.sin(k * ph) / k ** 1.1 for k in range(1, 10)).astype(np.float32) * (0.6 if m < 55 else 0.4)
    return lp(s, 1500) * (1 + 0.04 * np.sin(2 * np.pi * 3.1 * t)).astype(np.float32)
def fdrum(acc=1.0):
    t = tarr(0.35); f = 62 + 45 * np.exp(-t * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (9 if acc > 0.8 else 14))
    skin = lp(rng.standard_normal(len(t)).astype(np.float32), 1500) * np.exp(-t * 45) * 0.35
    return ((body + skin) * acc).astype(np.float32)
def davul():
    t = tarr(0.5); f = 48 + 40 * np.exp(-t * 20)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * 1.2 + hp(rng.standard_normal(len(t)).astype(np.float32), 1500) * np.exp(-t * 120) * 0.3).astype(np.float32)
JINGLE = [5230, 6120, 7350, 8410, 9020]
def tamb(acc=1.0):
    t = tarr(0.18); n = len(t)
    j = sum(np.sin(2 * np.pi * (f * rng.uniform(0.98, 1.02)) * t + rng.uniform(0, 6)) for f in JINGLE) * np.exp(-t * 26) * 0.12
    s = hp(rng.standard_normal(n).astype(np.float32), 5500) * np.exp(-t * 40) * 0.5
    return ((j + s) * acc).astype(np.float32)
def clap():
    t = tarr(0.25); n = len(t); s = np.zeros(n, np.float32); src = bp(rng.standard_normal(n).astype(np.float32), 900, 2600)
    for k, dt in enumerate([0, 0.007, 0.015]):
        i = int(dt * SR); e = np.exp(-np.arange(n - i) / SR * (60 if k < 2 else 22)); s[i:] += src[i:] * e
    return s * 0.7
def bell(f0=196, d=4.0):
    t = tarr(d)
    s = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t * k) for r, a, k in [(0.5, .5, .6), (1, 1, .9), (1.19, .6, 1.4), (1.5, .45, 1.2), (2.0, .4, 1.8), (2.52, .25, 2.4), (3.01, .2, 3)])
    return lp((s * np.minimum(1, t / 0.004)).astype(np.float32), 3000) * 0.3
def vowel(f0, d, formants=((730, 90), (1090, 110), (2440, 160)), glide=-0.15, breathy=0.15):
    t = tarr(d); n = len(t); f = f0 * (1 + glide * t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > 5000: break
        a = sum(1 / (1 + ((fk - F_) / bw) ** 2) for F_, bw in formants) / k ** 0.3
        s += a * np.sin(k * ph)
    s += breathy * bp(rng.standard_normal(n).astype(np.float32), 600, 3000) * np.exp(-t * 18)
    return (s * adsr(n, 0.02, 0.08)).astype(np.float32)
def hey(n_voices=6):  # crowd shout "Hey!"
    out = np.zeros(int(0.45 * SR), np.float32)
    for v in range(n_voices):
        f0 = rng.uniform(150, 330); d = rng.uniform(0.22, 0.32); s = vowel(f0, d, ((550, 90), (1800, 150), (2600, 200)), glide=-0.2, breathy=0.4)
        i = int(rng.uniform(0, 0.05) * SR); out[i:i + len(s)] += s[: len(out) - i] * rng.uniform(0.6, 1)
    return out / n_voices * 2.2
def step_sample():
    t = tarr(0.12); n = len(t)
    return (lp(rng.standard_normal(n).astype(np.float32), rng.uniform(1200, 2400)) * np.exp(-t * rng.uniform(40, 70)) * 0.8
            + np.sin(2 * np.pi * rng.uniform(80, 120) * t) * np.exp(-t * 35) * 0.6).astype(np.float32)
STEPS = [step_sample() for _ in range(12)]
def whoosh(d=0.45, up=True):
    t = tarr(d); n = len(t); env = np.sin(np.pi * t / d) ** 2
    s = noise(d); lo = lp(s, 900); hi = bp(s, 900, 4000) * (t / d if up else 1 - t / d)
    return ((lo * 0.7 + hi * 0.5) * env).astype(np.float32)
def pop(f=600):
    t = tarr(0.12); ff = f * (1 + 1.5 * np.exp(-t * 60))
    return (np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 35) * 0.8).astype(np.float32)
def thunk(f0=90, d=0.35):
    t = tarr(d)
    return (np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + lp(noise(d), 1200) * np.exp(-t * 30) * 0.5).astype(np.float32)
def coin():
    t = tarr(0.5); return (np.sin(2 * np.pi * 2637 * t) * np.exp(-t * 8) * 0.4 + np.sin(2 * np.pi * 3951 * t) * np.exp(-t * 11) * 0.3 + np.sin(2 * np.pi * 5274 * t) * np.exp(-t * 15) * 0.15).astype(np.float32)
def ting():
    t = tarr(1.2); return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 4), (3136, 6), (4186, 8)]) * 0.3).astype(np.float32)
def whoomp():
    t = tarr(0.8); s = lp(noise(0.8), 700) * np.minimum(1, t / 0.05) * np.exp(-t * 4)
    return (s * 1.4 + hp(noise(0.8), 3000) * 0.25 * np.exp(-t * 2.5)).astype(np.float32)
def buzzer():
    t = tarr(0.45); s = np.sign(np.sin(2 * np.pi * 110 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * 116 * t)) * 0.5
    return lp((s * adsr(len(t), 0.01, 0.05)).astype(np.float32), 1800) * 0.35
def sting():
    t = tarr(2.4); low = np.sin(2 * np.pi * 41 * t) * np.exp(-t * 1.4) * 1.1
    hit = lp(noise(2.4), 900) * np.exp(-t * 6) * 0.8
    choir = sum(vowel(midi(m), 2.0, glide=0.0, breathy=0.05) for m in (50, 53, 57, 62))
    s = (low + hit).astype(np.float32); s[: len(choir)] += choir * 0.5 * np.exp(-np.arange(len(choir)) / SR * 1.2)
    return s
def snap():
    t = tarr(0.5); return (hp(noise(0.5), 800) * np.exp(-t * 18) * 1.3 + np.pad(thunk(130, 0.4), (0, len(t) - int(0.4 * SR))) * 0.5).astype(np.float32)
def whistle(d=0.5):
    t = tarr(d); f = 2650 * (1 + 0.03 * np.sign(np.sin(2 * np.pi * 28 * t)))
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * adsr(len(t), 0.01, 0.04) * 0.35 + bp(noise(d), 2000, 4000) * 0.06).astype(np.float32)
def sizzle(d=1.2):
    t = tarr(d); return (hp(noise(d), 3500) * 0.35 * np.minimum(1, t / 0.05) * np.exp(-t * 1.8) * (0.7 + 0.3 * rng.random(len(t)))).astype(np.float32)
def yawn(d=1.0, f0=220): return vowel(f0, d, ((650, 100), (1000, 120), (2500, 200)), glide=-0.45, breathy=0.5) * np.sin(np.pi * tarr(d) / d).astype(np.float32)
def cough():
    out = np.zeros(int(0.7 * SR), np.float32)
    for k in range(2):
        n = int(0.16 * SR); t = np.arange(n) / SR; c = bp(rng.standard_normal(n).astype(np.float32), 300, 2500) * np.exp(-t * 20)
        out[int(k * 0.27 * SR): int(k * 0.27 * SR) + n] += c
    return out
def snore(d=1.1):
    t = tarr(d); buzz = (np.mod(np.cumsum(60 + 25 * np.sin(np.pi * t / d)) / SR, 1) < 0.3).astype(np.float32)
    return (lp(buzz * 0.5 + noise(d) * 0.15, 700) * np.sin(np.pi * t / d) ** 2).astype(np.float32)
def chirp():  # one small bird phrase
    out = []
    for _ in range(rng.integers(2, 6)):
        d = rng.uniform(0.04, 0.09); t = tarr(d); f0 = rng.uniform(3200, 5200); f = f0 * (1 - rng.uniform(0.2, 0.4) * t / d)
        out.append(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d)); out.append(np.zeros(int(rng.uniform(0.03, 0.08) * SR)))
    return np.concatenate(out).astype(np.float32) * 0.25
def tick():
    t = tarr(0.04); return (hp(noise(0.04), 2500) * np.exp(-t * 200) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 150) * 0.4).astype(np.float32)

# ---------------- the tune (original): 12/8, eighth = 1/6 s ----------------
E8 = 1 / 6; BAR = 12 * E8  # 2 s per bar, dotted quarter = 0.5 s
D = 62  # D4 for the chanter, fife plays an octave up
A_PART = [[(7, 2), (5, 1), (3, 2), (2, 1), (0, 3), (7, 3)], [(9, 2), (7, 1), (5, 2), (3, 1), (2, 3), (-2, 3)],
          [(0, 2), (2, 1), (3, 2), (5, 1), (7, 2), (9, 1), (10, 3)], [(12, 2), (10, 1), (7, 2), (5, 1), (7, 6)],
          [(7, 2), (5, 1), (3, 2), (2, 1), (0, 3), (7, 3)], [(9, 2), (7, 1), (5, 2), (3, 1), (2, 3), (-2, 3)],
          [(3, 2), (5, 1), (7, 2), (5, 1), (3, 2), (2, 1), (3, 3)], [(2, 2), (0, 1), (-2, 2), (2, 1), (0, 6)]]
B_PART = [[(12, 1), (12, 1), (12, 1), (10, 1), (12, 1), (14, 1), (12, 3), (7, 3)], [(10, 1), (10, 1), (10, 1), (9, 1), (10, 1), (12, 1), (10, 3), (5, 3)],
          [(7, 1), (9, 1), (10, 1), (12, 1), (10, 1), (7, 1), (5, 1), (7, 1), (9, 1), (7, 3)], [(3, 2), (2, 1), (3, 2), (5, 1), (7, 6)],
          [(12, 1), (12, 1), (12, 1), (10, 1), (12, 1), (14, 1), (12, 3), (7, 3)], [(10, 1), (10, 1), (10, 1), (9, 1), (10, 1), (12, 1), (10, 3), (5, 3)],
          [(7, 1), (9, 1), (10, 1), (12, 1), (14, 1), (15, 1), (14, 3), (10, 3)], [(12, 2), (7, 1), (3, 2), (2, 1), (0, 6)]]
A_CH = [0, -2, 3, 7, 0, -2, 3, 0]; B_CH = [0, -2, 7, 0, 0, -2, 7, 0]
CHORD = {0: (0, 3, 7), -2: (-2, 2, 5), 3: (3, 7, 10), 7: (7, 10, 14)}
SCALE = [-2, 0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17]
def third_below(s):
    i = min(range(len(SCALE)), key=lambda k: abs(SCALE[k] - s)); return SCALE[max(0, i - 2)]
FORM = ['A', 'A', 'B', 'B']  # 16-bar parts -> 32 s, then repeat
for k in ['fife', 'fife2', 'chanter', 'lute', 'bass', 'fdrum', 'tamb', 'clap', 'davul']: pass
L = {k: stereo() for k in ['fife', 'fife2', 'chanter', 'lute', 'bass', 'fdrum', 'tamb', 'clap', 'davul']}
bar_i = 0; t0 = 0.0
while t0 < 63.0:
    part = FORM[(bar_i // 8) % 4]; b = bar_i % 8
    mel, ch = (A_PART[b], A_CH[b]) if part == 'A' else (B_PART[b], B_CH[b])
    x = t0
    for s_, l in mel:
        d = l * E8
        place(L['fife'], fife(midi(D + 12 + s_), d * 0.93), x, 0.30, 0.15)
        place(L['chanter'], chanter(midi(D + s_), d * 0.97), x, 0.55, -0.2)
        place(L['fife2'], fife(midi(D + 12 + third_below(s_)), d * 0.9, breath=0.04), x, 0.2, 0.45)
        x += d
    root = ch; tones = CHORD[ch]
    for e in range(12):
        te = t0 + e * E8 + rng.normal(0, 0.003)
        if e in (0, 6): place(L['bass'], ks(midi(D - 24 + root), 0.6, 0.4, 0.996), te, 0.9, 0)
        if e in (3, 9): place(L['bass'], ks(midi(D - 24 + root + 7), 0.5, 0.4, 0.996), te, 0.7, 0)
        if e in (2, 5, 8, 11):
            for k_, tn in enumerate(tones): place(L['lute'], ks(midi(D - 12 + tn), 0.35, 0.7, 0.993), te + k_ * 0.008, 0.38, -0.35)
        if e in (0, 3, 6, 9): place(L['fdrum'], fdrum(1.0 if e in (0, 6) else 0.7), te, 0.9, 0.05)
        if e in (5, 11): place(L['fdrum'], fdrum(0.45), te, 0.8, 0.05)
        place(L['tamb'], tamb(0.9 if e in (2, 5, 8, 11) else 0.4), te, 0.35, 0.5)
        if e in (3, 9): place(L['clap'], clap(), te, 0.5, -0.1); place(L['clap'], clap(), te + 0.012, 0.35, 0.3)
        if e == 0: place(L['davul'], davul(), te, 0.9, 0)
        if e == 6 and bar_i % 2: place(L['davul'], davul(), te, 0.7, 0)
    bar_i += 1; t0 += BAR
drone = drone_track()

# layer gain envelopes over story time (seconds)
def sec(*pairs): return envelope(list(pairs))
CUT1a, CUT1b = 12.45, 15.35     # "No music, no party, just dancing." -> band out
BAN = 62.42                       # "Music banned." -> band dead
G = {
 'fife':    sec((0, .9), (5.9, .9), (6.4, .35), (8.2, .3), (CUT1a, .3), (CUT1a + .03, 0), (16.6, 0), (17.6, .7), (18.3, 1), (23.4, 1), (23.6, .25), (26.5, .25), (27, .55), (32.8, .55), (33.1, 1), (40.6, 1), (41, .35), (47.6, .35), (48, .2), (59.9, .2), (60.2, .5), (BAN, .5), (BAN + .03, 0), (99, 0)),
 'fife2':   sec((0, 0), (18.2, 0), (18.4, .8), (23.4, .8), (23.6, 0), (33, 0), (33.2, .6), (35.5, .6), (35.8, 1), (40.6, 1), (40.9, 0), (99, 0)),
 'chanter': sec((0, .8), (5.9, .8), (6.4, 0), (17.2, 0), (18.3, .9), (23.4, .9), (23.6, 0), (33.0, 0), (33.2, .9), (40.6, .9), (41, 0), (99, 0)),
 'lute':    sec((0, .9), (CUT1a, .9), (CUT1a + .03, 0), (16.2, 0), (16.8, .8), (40.6, .9), (41, .8), (54, .7), (54.4, .5), (BAN, .5), (BAN + .03, 0), (99, 0)),
 'bass':    sec((0, 1), (CUT1a, 1), (CUT1a + .03, 0), (16.2, 0), (16.8, .9), (54, .9), (54.4, .4), (60.2, .8), (BAN, .8), (BAN + .03, 0), (99, 0)),
 'fdrum':   sec((0, 1), (6.0, 1), (6.3, .4), (8.2, .4), (CUT1a, .5), (CUT1a + .03, 0), (CUT1b, 0), (CUT1b + .05, .7), (18.3, 1), (40.6, 1), (41, .55), (47.6, .55), (48, .7), (54, .6), (54.4, .2), (60.0, .2), (60.3, 1), (BAN, 1), (BAN + .03, 0), (99, 0)),
 'tamb':    sec((0, .9), (5.9, .9), (6.2, .3), (CUT1a, .5), (CUT1a + .03, 0), (16.6, 0), (17.2, .8), (40.6, .9), (41, .5), (47.6, .5), (48, 0), (59.9, 0), (60.3, .8), (BAN, .8), (BAN + .03, 0), (99, 0)),
 'clap':    sec((0, .7), (5.9, .7), (6.2, 0), (18.2, 0), (18.4, 1), (23.4, 1), (23.6, 0), (35.6, 0), (35.8, 1), (40.6, 1), (40.9, 0), (99, 0)),
 'davul':   sec((0, .9), (5.9, .9), (6.2, 0), (18.2, 0), (18.4, 1), (23.4, 1), (23.6, .6), (26.5, .6), (26.8, 0), (32.9, 0), (33.1, 1), (40.6, 1), (41, 0), (47.6, 0), (48, .5), (54, .5), (54.4, 0), (60.2, 0), (60.4, 1), (BAN, 1), (BAN + .03, 0), (99, 0)),
}
music = stereo()
for k, buf in L.items(): music += buf * G[k]
dg = sec((0, .7), (5.9, .7), (6.4, .3), (CUT1a, .3), (CUT1a + .03, 0), (CUT1b, 0), (16, .5), (18.3, .8), (23.4, .8), (23.6, 1.0), (26.6, .6), (40.6, .8), (41, .45), (47.6, .45), (48, .8), (54, .7), (54.4, .3), (60.2, .7), (BAN, .7), (BAN + .03, 0), (99, 0))
music[0] += drone * dg * 0.07; music[1] += drone * dg * 0.07
# pickup hit at the very start + a roll into "Music banned"
place(music, davul(), 0.0, 1.0); place(music, fdrum(1.0), 0.0, 1.0)
for k in range(16): place(music, fdrum(0.3 + 0.7 * k / 16), 61.0 + k * (1.4 / 16), 0.8)
# lament: slow solo fife over the shrine and September (A part, 3x slower), out before "Silence"
x = 64.6
for b in range(2):
    for s_, l in A_PART[b]:
        d = l * E8 * 2.6
        if x + d > 72.5: break
        place(music, fife(midi(D + s_), d * 0.95, vib=0.008, breath=0.1), x, 0.16, -0.1); x += d
music = conv_reverb(music, 1.3, 3.2, 0.22)

# ---------------- ambience ----------------
amb = stereo()
def babble(d, voices=10, excited=0.0):
    n = int(d * SR); out = np.zeros((2, n), np.float32)
    for v in range(voices):
        src = rng.standard_normal(n).astype(np.float32); c = rng.uniform(450, 1300) * (1 + 0.4 * excited)
        s = bp(src, c * 0.6, c * 2.2)
        am = lp(rng.standard_normal(n).astype(np.float32), 5 + 3 * excited); am = np.clip(am / (np.abs(am).max() + 1e-6), 0, 1) ** 1.5
        s *= am; a = (rng.uniform(-0.8, 0.8) + 1) * np.pi / 4; out[0] += s * np.cos(a); out[1] += s * np.sin(a)
    return out / np.sqrt(voices)
bab = babble(DUR, 14, 0.4)
crowd_lvl = sec((0, 1), (5.9, 1), (6.3, .25), (8.2, .2), (15.3, .2), (18.3, .6), (18.6, 1.2), (23.4, 1.1), (26.6, .6), (33, .8), (40.6, 1.2), (41, .45), (47.6, .45), (54, .35), (54.2, 0), (60.1, 0), (60.3, .5), (63.4, .5), (64.1, .15), (64.6, 0), (99, 0))
amb += bab * crowd_lvl * 0.16
# rhythmic stomping on cobbles, density = how many dancers are on screen
def stomps(a, b, per_beat, gain, pan_w=0.7):
    t = a
    while t < b:
        for _ in range(per_beat):
            place(amb, STEPS[rng.integers(len(STEPS))], t + rng.normal(0, 0.018), gain * rng.uniform(0.5, 1), rng.uniform(-pan_w, pan_w))
        t += 0.25
stomps(0.0, 5.9, 8, 0.12)            # hook crowd
stomps(11.6, 15.4, 1, 0.35, 0.1)     # Frau Troffea alone, no music: just her feet
stomps(15.4, 18.2, 3, 0.18)
stomps(18.3, 23.5, 12, 0.1)          # 400 people
stomps(23.5, 26.6, 4, 0.12)
stomps(26.6, 33.4, 2, 0.12)
stomps(35.6, 40.6, 10, 0.1)
stomps(40.6, 47.3, 2, 0.08)
stomps(62.9, 63.7, 4, 0.12)          # until the guard stops them
# shouts on the downbeats of the wildest bars
for tt in [2.0, 4.0, 18.4, 20.4, 22.4, 33.2, 36.0, 38.0, 39.95]: place(amb, hey(7), tt, 0.5, rng.uniform(-0.3, 0.3))
# birds in the day scenes, crickets + wind for the evening
for _ in range(60):
    tt = rng.uniform(0, 54)
    if CUT1a < tt < CUT1b: continue
    place(amb, chirp(), tt, rng.uniform(0.35, 0.7), rng.uniform(-0.9, 0.9))
for tt in [6.4, 7.7]: place(amb, bell(196, 5.0), tt, 0.6, -0.4)
place(amb, bell(147, 6.0), 65.0, 0.45, 0.5)  # chapel bell at the shrine
wind = lp(noise(DUR), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * np.arange(N) / SR)).astype(np.float32)
wl = sec((0, .25), (54, .25), (64.6, .4), (64.8, 1), (72.7, 1), (72.85, 0), (99, 0))
amb[0] += wind * wl * 0.12; amb[1] += np.roll(wind, 4000) * wl * 0.12
crick = np.zeros(N, np.float32); tt = 64.7
while tt < 72.6:
    for k in range(3): place_t = tt + k * 0.05; i = int(place_t * SR); n = int(0.03 * SR); crick[i:i + n] += np.sin(2 * np.pi * 4600 * np.arange(n) / SR) * np.sin(np.pi * np.arange(n) / n) * 0.08
    tt += rng.uniform(0.45, 0.7)
amb[0] += crick; amb[1] += np.roll(crick, 2400) * 0.8
# the "quiet room": room tone + a clock
room = lp(noise(F(1804) - F(1620)), 300) * 0.05; place(amb, room, F(1620), 1.0)
tt = F(1622)
while tt < F(1800): place(amb, tick(), tt, 0.25, 0.4); tt += 1.0
for tt in np.arange(64.7, 72.5, 4.2): place(amb, chirp(), tt + rng.uniform(0, 1), 0.3, rng.uniform(-0.8, 0.8))
amb = conv_reverb(amb, 0.8, 5, 0.12)

# ---------------- sfx ----------------
sfx = stereo()
CUTS = [189, 244, 373, 463, 548, 619, 703, 798, 926, 1018, 1071, 1191, 1223, 1296, 1351, 1435, 1535, 1620, 1805, 1863, 1898, 1941, 1992, 2032, 2087, 2181]
for c in CUTS: place(sfx, whoosh(0.4), F(c) - 0.3, 0.22, rng.uniform(-0.4, 0.4))
place(sfx, whoosh(0.9), F(40), 0.4)                       # crane up to the aerial
place(sfx, whoosh(0.5), F(186), 0.6)                      # flash to Strasbourg
for k in range(11): place(sfx, STEPS[k % 12], F(297) + k * 0.3, 0.45)  # she walks out of her door
for i in range(14): place(sfx, pop(500 + 40 * i), F(466 + i * 4.2), 0.22, rng.uniform(-0.6, 0.6))  # joiners arriving
place(sfx, thunk(70, 0.4), F(585), 0.6)                   # "400"
for f_, g in [(716, 0.9), (744, 0.8), (768, 0.8)]: place(sfx, thunk(65, 0.45), F(f_), g)
place(sfx, snore(1.2), F(776), 0.3)
place(sfx, pop(800), F(858), 0.4); place(sfx, ting(), F(860), 0.3)   # the doctor's flask
place(sfx, whoomp(), F(892), 0.8); place(sfx, sizzle(1.1), F(894), 0.7)  # "Hot blood"
place(sfx, whoosh(0.35), F(986), 0.4)
place(sfx, thunk(95, 0.3), F(1035), 0.6)
for k in range(3): place(sfx, coin(), F(1106) + k * 0.13, 0.5, -0.2 + k * 0.2)
place(sfx, thunk(60, 0.5), F(1203), 0.8)                  # "worse"
place(sfx, pop(420), F(1297), 0.4); place(sfx, ting(), F(1303), 0.25)  # moldy rye
place(sfx, buzzer(), F(1330), 0.5)                        # "Probably not"
place(sfx, thunk(150, 0.25), F(1377), 0.5)
place(sfx, pop(520), F(1493), 0.45)                       # hunger bowl
place(sfx, cough(), F(1515), 0.7, 0.1)
place(sfx, ting(), F(1536), 0.25)                         # halo glint
place(sfx, sting(), F(1582), 0.6)                         # the saint's curse
for f_, f0, g in [(1716, 230, .55), (1752, 180, .45), (1754, 280, .4), (1774, 200, .4), (1777, 320, .35)]: place(sfx, yawn(1.0, f0), F(f_), g, rng.uniform(-0.5, 0.5))
place(sfx, thunk(80, 0.45), F(1843), 1.0)                 # the council's fist
place(sfx, snap(), F(1873), 0.9)                          # drumstick snapped
place(sfx, whistle(0.45), F(1899), 0.5, -0.2)             # guard
place(sfx, thunk(90, 0.3), F(1909), 0.7)                  # dancers freeze
for k in range(int((F(2031) - F(1941)) / 0.33)): place(sfx, STEPS[k % 12], F(1941) + k * 0.33, 0.25, rng.uniform(-0.3, 0.3))
leaves = bp(noise(F(2180) - F(2032)), 2500, 7000) * 0.06; place(sfx, leaves, F(2032), 1.0)
for k in range(8): place(sfx, STEPS[k % 12], F(2112) + k * 0.3, 0.3)
place(sfx, whoosh(0.3), F(2150), 0.3)

# ---------------- mix ----------------
def load_voice():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "voice.mp3", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).copy(); out = np.zeros(N, np.float32); out[:min(N, len(v))] = v[:N]; return out
voice = load_voice()
rms = lambda x: float(np.sqrt(np.mean(x ** 2) + 1e-12))
act = np.abs(voice) > 0.02; v_rms = rms(voice[act])
def norm(bus, target):  # RMS over the parts where the bus is on
    m = np.abs(bus).max(axis=0) > 1e-4; r = rms(bus[:, m]) if m.any() else 1; return bus * (target * v_rms / r)
music = norm(music, 0.30); amb = norm(amb, 0.11)
sfx = sfx * (0.55 * np.abs(voice).max() / np.abs(sfx).max())  # sfx peaks at about half the voice peak
# sidechain duck from the voice (30 ms attack, 300 ms release)
ve = np.abs(voice); k = int(0.03 * SR); ve = np.convolve(ve, np.ones(k) / k, "same")
dn = np.clip(ve / (v_rms * 0.6), 0, 1); rel = np.exp(-1 / (0.3 * SR / 64)); d_ = dn[::64].copy()
for i in range(1, len(d_)): d_[i] = max(d_[i], d_[i - 1] * rel)
duck = np.repeat(d_, 64)[:N]
music *= 1 - 0.55 * duck; amb *= 1 - 0.35 * duck
# "Silence": everything but the voice stops on the word
cut = int(F(2183) * SR); fade = int(0.05 * SR)
for b_ in (music, amb, sfx): b_[:, cut - fade:cut] *= np.linspace(1, 0, fade); b_[:, cut:] = 0
mix = voice[None, :] + music + amb + sfx
mix = np.tanh(mix * 0.9) / np.tanh(0.9)
mix[:, -int(0.04 * SR):] *= np.linspace(1, 0, int(0.04 * SR))
os.makedirs("stems", exist_ok=True)
def wr(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16).T.copy()
    with wave.open(path, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
wr("mix_raw.wav", mix)
for name, b_ in [("music", music), ("ambience", amb), ("sfx", sfx)]: wr(f"stems/{name}.wav", b_ / max(1e-6, np.abs(b_).max()) * 0.9)
print("ok", N / SR)
