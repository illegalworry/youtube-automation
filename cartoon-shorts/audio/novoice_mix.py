# Music + SFX mix without a voice, cut to N seconds. Usage: python audio/novoice_mix.py audio <seconds> out.wav
import sys, os
AUD = sys.argv[1]; DUR = float(sys.argv[2]); OUT = sys.argv[3]
sys.path.insert(0, AUD)
import numpy as np
from dsp import SR, dbg, write_wav, integrated, true_peak
import music, sfx, mix
m, _ = music.render(music.build(), ref=-20.0)
s, _ = sfx.render(-16.0)
y = m * dbg(-1.0) + s
n = int(DUR * SR); y = y[:, :n].copy()
G = -15.0 - mix.lufs(y)
for _ in range(5):
    z, _g = mix.limiter(y * dbg(G)); L = mix.lufs(z)
    if abs(L + 15) < 0.05: break
    G += -15 - L
f = int(0.8 * SR); z[:, -f:] *= np.linspace(1, 0, f)[None, :]
write_wav(OUT, z); print("LUFS", round(mix.lufs(z), 2), "TP", round(true_peak(z), 2))
