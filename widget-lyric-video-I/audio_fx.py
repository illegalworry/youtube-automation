import numpy as np, subprocess, sys
SR=44100
raw=subprocess.run(['ffmpeg','-v','error','-i','track.wav','-f','f32le','-ac','2','-ar',str(SR),'-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32).reshape(-1,2).astype(np.float64).copy()
N=len(x); t=np.arange(N)/SR
def lp_sweep(seg,fc):  # time-varying 2-pole lowpass (two cascaded one-pole), fc per sample
    a=np.exp(-2*np.pi*fc/SR); y=seg.copy()
    for _ in range(2):
        s=np.zeros(2); out=np.empty_like(y)
        for i in range(len(y)):
            s=(1-a[i])*y[i]+a[i]*s; out[i]=s
        y=out
    return y
def region(t0,t1): return slice(int(t0*SR),int(t1*SR))
def env(t0,t1,v0,v1,curve=1.0):
    r=region(t0,t1); n=r.stop-r.start; p=np.linspace(0,1,n)**curve; return r, v0+(v1-v0)*p
g=np.ones(N)
# 1) filter dip into section at 23.36 (22.66 -> 23.36)
r=region(22.66,23.36); n=r.stop-r.start; p=np.linspace(0,1,n)
x[r]=lp_sweep(x[r],18000*np.exp(np.log(900/18000)*p)); g[r]*=10**(-2.5*p/20)
# 2) break 40.26 -> 45.62: underwater lowpass rising, quieter, then riser; gap; drop 45.88
r=region(40.26,45.62); n=r.stop-r.start; p=np.linspace(0,1,n)
fc=np.where(p<.6,650+250*p/.6,900*np.exp(np.log(6000/900)*np.clip((p-.6)/.4,0,1)**1.6))
x[r]=lp_sweep(x[r],fc)
fade_in=np.clip((t[r]-40.26)/0.12,0,1)
g[r]*=10**((-5+3.5*p**2)/20)
# smooth the step in to the filtered part
# riser: filtered noise 43.14 -> 45.62
rng=np.random.default_rng(1); rr=region(43.14,45.62); m=rr.stop-rr.start; q=np.linspace(0,1,m)
nz=rng.standard_normal((m,2)); hp=nz-lp_sweep(nz,400+5000*q)   # rising highpass-ish noise
nz=hp*(q**2.2)[:,None]*0.16
x[rr]+=nz
# gap before the drop
gr=region(45.62,45.88); g[gr]=0
fo=region(45.56,45.62); g[fo]*=np.linspace(1,0,fo.stop-fo.start)
# drop: boost decays + sub boom impact
dr=region(45.88,51.53); d=t[dr]-45.88
g[dr]*=10**((2.0*np.exp(-d/3.0))/20)
br=region(45.88,47.4); d=t[br]-45.88
boom=np.sin(2*np.pi*(45*d+ (110-45)*(1-np.exp(-d*12))/12))*np.exp(-d*3.2)*0.38
x[br,0]+=boom; x[br,1]+=boom
# white impact noise burst
ir=region(45.88,46.5); d=t[ir]-45.88; x[ir]+=rng.standard_normal((ir.stop-ir.start,2))*(0.09*np.exp(-d*14))[:,None]
# 3) small lift at 23.36 section
lr=region(23.36,29.0); d=t[lr]-23.36; g[lr]*=10**((1.2*np.exp(-d/2.0))/20)
# 4) outro fade
of=region(55.3,N/SR); g[of]*=np.linspace(1,0,of.stop-of.start)**1.5
# smooth gain (avoid clicks) except the hard gap edges
k=int(0.004*SR); g2=np.convolve(g,np.ones(k)/k,mode='same')
y=x*g2[:,None]
y.astype(np.float32).tofile('fx.f32')
