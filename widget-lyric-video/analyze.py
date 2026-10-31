import librosa, numpy as np, sys
y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
dur=len(y)/sr
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
print("dur",dur,"tempo",tempo)
hop=512
rms=librosa.feature.rms(y=y,hop_length=hop)[0]
S=np.abs(librosa.stft(y,hop_length=hop))
f=librosa.fft_frequencies(sr=sr)
bass=S[(f<150)].mean(0)
onset=librosa.onset.onset_strength(y=y,sr=sr,hop_length=hop)
cent=librosa.feature.spectral_centroid(S=S,sr=sr)[0]
t=librosa.frames_to_time(np.arange(len(rms)),sr=sr,hop_length=hop)
def n(x): return (x-x.min())/(x.max()-x.min())
print("sec  rms  bass onset cent")
for s in range(0,int(dur),2):
    m=(t>=s)&(t<s+2)
    print(f"{s:4d} {rms[m].mean():.3f} {n(bass)[m].mean():.2f} {onset[m].mean():.2f} {cent[m].mean():5.0f} "+"#"*int(rms[m].mean()*150))
score=n(rms)*0.4+n(bass)*0.3+n(onset)*0.3
best=[]
for L in (40,):
  for s in np.arange(0,dur-L,0.5):
    m=(t>=s)&(t<s+L); best.append((score[m].mean(),s))
best.sort(reverse=True); print("best windows",best[:10])
np.save(sys.argv[2],np.array(beats))
