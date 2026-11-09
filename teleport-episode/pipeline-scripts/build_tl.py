# Cut the original voiceover into per-line clips at frame boundaries (so they butt together
# exactly like the original) and write lines.json + timeline.json with word frames.
import json, subprocess, numpy as np, wave, os
P='/home/user/what-if-videos/episode'
SRC='/root/.claude/uploads/cfbd57ef-81bd-5292-a4c1-7f13fa60cda8/d532cc51-voiceover_full.mp3'
FPS=30; SR=48000; LEAD=15; SPF=SR//FPS
segs=json.load(open('/home/user/what-if-videos/work/segs.json'))
SP=json.load(open('/home/user/what-if-videos/scripts/speakers.json'))
raw=subprocess.run(['ffmpeg','-v','error','-i',SRC,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
a=np.frombuffer(raw,dtype=np.int16)
os.makedirs(P+'/public/vo',exist_ok=True)
for f in os.listdir(P+'/public/vo'): os.remove(P+'/public/vo/'+f)
# cut frames (in audio frames, 0 = audio start)
cuts=[]
for i,s in enumerate(segs):
    c=int(np.floor(s['s']*FPS))-3
    if i==0: c=0
    else: c=max(c,int(np.ceil(segs[i-1]['e']*FPS)), cuts[-1]+1)
    cuts.append(c)
nA=int(np.ceil(len(a)/SPF))
cuts.append(nA)
fr=np.array([np.sqrt(np.mean((a[k*SPF:(k+1)*SPF].astype(np.float32)/32768)**2)) if k*SPF<len(a) else 0 for k in range(nA)])
peak=np.percentile(fr,99.5)
lines=[];tl=[]
for i,s in enumerate(segs):
    sp=SP.get(str(s['i']),'N')
    lid=f"{s['i']:03d}_{sp}"
    c0,c1=cuts[i],cuts[i+1]
    pcm=a[c0*SPF:c1*SPF]
    with wave.open(f"{P}/public/vo/{lid}.wav",'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
    env=[round(float(min(1,v/peak)),2) for v in fr[c0:c1]]
    words=[[x[0],int(round(x[1]*FPS))-c0] for x in s['words']]
    lines.append({"id":lid,"sp":sp,"t":s['t']})
    tl.append({"id":lid,"sp":sp,"text":s['t'],"file":f"vo/{lid}.wav","trimStart":0,"from":LEAD+c0,"dur":c1-c0,"talk":int(round(s['e']*FPS))-c0,"env":env,"w":words})
total=LEAD+nA+5*FPS
json.dump(lines,open(P+'/src/story/lines.json','w'),ensure_ascii=False,indent=0)
json.dump({"fps":FPS,"total":total,"lines":tl},open(P+'/src/story/timeline.json','w'),ensure_ascii=False)
print(len(tl),'lines total',total,'frames',total/FPS,'s')
