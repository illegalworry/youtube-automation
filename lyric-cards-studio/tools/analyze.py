"""Audio analysis for lyric videos: per-frame loudness envelope + onset (beat) times.
usage: python3 tools/analyze.py projects/<name> [fps]
writes projects/<name>/build/audio.json  {fps, duration, env:[0..1 per frame], beats:[sec]}"""
import sys, json, subprocess, os
import numpy as np
proj = sys.argv[1]; fps = int(sys.argv[2]) if len(sys.argv) > 2 else 60
cfg = json.load(open(os.path.join(proj, 'config.json')))
src = os.path.join(proj, cfg['audio'])
sr = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
hop = sr // fps; n = len(a) // hop
fr = a[:n * hop].reshape(n, hop)
rms = np.sqrt((fr ** 2).mean(1) + 1e-12)
db = 20 * np.log10(rms); lo, hi = np.percentile(db, 5), np.percentile(db, 99.5)
env = np.clip((db - lo) / (hi - lo), 0, 1)
# low-frequency spectral flux for kick/beat detection
win = 2048; hopb = 512
frames = [a[i:i + win] * np.hanning(win) for i in range(0, len(a) - win, hopb)]
spec = np.abs(np.fft.rfft(np.array(frames), axis=1))
band = spec[:, 1:int(160 / (sr / win))]  # < ~160 Hz
flux = np.maximum(0, np.diff(np.log1p(band), axis=0)).sum(1)
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
t = (np.arange(len(flux)) + 1) * hopb / sr
beats = []; last = -1
thr = np.convolve(flux, np.ones(43) / 43, 'same') + 1.2
for i in range(1, len(flux) - 1):
    if flux[i] > thr[i] and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1] and t[i] - last > 0.22:
        beats.append(round(float(t[i]), 3)); last = t[i]
# tempo grid (autocorrelation of full-band flux) — steadier than raw onsets for pulses
fl = np.maximum(0, np.diff(np.log1p(spec), axis=0)).sum(1); fl -= fl.mean()
ac = np.correlate(fl, fl, 'full')[len(fl) - 1:]; lags = np.arange(len(ac)) * hopb / sr
m = (lags > 0.3) & (lags < 1.2); period = float(lags[m][np.argmax(ac[m])])
best = (-1e9, 0)
for ph in np.arange(0, period, 0.005):
    g = np.arange(ph, t[-1], period); sc = np.interp(g, t, fl).sum()
    if sc > best[0]: best = (sc, ph)
grid = [round(float(x), 3) for x in np.arange(best[1], len(a) / sr, period)]
os.makedirs(os.path.join(proj, 'build'), exist_ok=True)
json.dump({'fps': fps, 'duration': len(a) / sr, 'env': [round(float(x), 3) for x in env], 'beats': beats, 'period': round(period, 4), 'grid': grid},
          open(os.path.join(proj, 'build', 'audio.json'), 'w'))
print(f'tempo {60/period:.1f} bpm; duration {len(a)/sr:.2f}s, {len(beats)} beats:', beats)
