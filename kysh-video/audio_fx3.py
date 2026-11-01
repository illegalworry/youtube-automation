import numpy as np, subprocess
SR=44100
raw=subprocess.run(['ffmpeg','-v','error','-i','track.wav','-f','f32le','-ac','2','-ar',str(SR),'-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32).reshape(-1,2).astype(np.float64).copy(); N=len(x); t=np.arange(N)/SR
def lp(seg,fc):
    a=np.exp(-2*np.pi*fc/SR); y=seg.copy()
    for _ in range(2):
        s=np.zeros(2); out=np.empty_like(y)
        for i in range(len(y)): s=(1-a[i])*y[i]+a[i]*s; out[i]=s
        y=out
    return y
R=lambda a,b: slice(int(a*SR),int(b*SR))
g=np.ones(N)
def sweep(t0,t1,f0,f1,shape):   # lowpass whose cutoff follows f0->f1 by shape(p) and back
    r=R(t0,t1); p=np.linspace(0,1,r.stop-r.start); f=np.exp(np.log(f0)+(np.log(f1)-np.log(f0))*shape(p)); x[r]=lp(x[r],f)
# "Музга айлантып" freeze: 22.40 -> 23.36 dip to 1800 Hz then snap open
sweep(22.40,23.36,18000,1800,lambda p:np.sin(np.pi*np.clip(p/0.9,0,1)*0.5)**1.2*(p<0.97))
r=R(22.40,23.36); p=np.linspace(0,1,r.stop-r.start); g[r]*=10**(-1.5*np.sin(np.pi*p*0.5)/20)
# "токтогонсуйт көмүрүң" ember dying: 37.45 -> 39.60 down to 2200 Hz, -2 dB; reopens 39.60 -> 40.26
sweep(37.45,39.60,18000,2200,lambda p:np.clip(p/0.6,0,1)**0.8)
sweep(39.60,40.26,2200,18000,lambda p:p**1.5)
r=R(37.45,40.26); p=np.linspace(0,1,r.stop-r.start); g[r]*=10**((-2.2*np.sin(np.pi*np.clip(p/0.85,0,1))**0.7)/20)
# "Жылытсын музыкам" warm lift
r=R(40.26,43.14); d=t[r]-40.26; g[r]*=10**((1.0*np.sin(np.pi*d/2.88))/20)
# pre-chorus pull back 44.70 -> 45.24 (after "көрүнүп"), small riser
r=R(44.70,45.24); p=np.linspace(0,1,r.stop-r.start); g[r]*=10**((-2.5*p)/20)
rng=np.random.default_rng(3); rr=R(43.14,45.86); m=rr.stop-rr.start; q=np.linspace(0,1,m)
nz=rng.standard_normal((m,2)); nz=(nz-lp(nz,500+6000*q))*(q**2.4)[:,None]*0.09; x[rr]+=nz
# chorus: +2 dB settling to +1, sub boom + sparkle at 45.88
r=R(45.24,56.66); d=t[r]-45.24; g[r]*=10**((1.0+1.0*np.exp(-d/2.5))/20)
br=R(45.88,47.3); d=t[br]-45.88; boom=np.sin(2*np.pi*(42*d+(100-42)*(1-np.exp(-d*12))/12))*np.exp(-d*3.4)*0.32; x[br]+=boom[:,None]
ir=R(45.88,46.4); d=t[ir]-45.88; x[ir]+=rng.standard_normal((ir.stop-ir.start,2))*(0.05*np.exp(-d*16))[:,None]
# outro fade
of=R(55.4,N/SR); g[of]*=np.linspace(1,0,of.stop-of.start)**1.6
k=int(0.006*SR); g=np.convolve(g,np.ones(k)/k,mode='same')
(x*g[:,None]).astype(np.float32).tofile('fx.f32')
