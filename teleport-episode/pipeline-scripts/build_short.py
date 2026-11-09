# Short (recut) timeline: split the short voiceover into sentence lines s01..,
# cut clips at frame boundaries into public/vo-short, write short-timeline.json
import json,re,subprocess,os,numpy as np,wave,sys
P='/home/user/what-if-videos/episode'
SRC='/root/.claude/uploads/cfbd57ef-81bd-5292-a4c1-7f13fa60cda8/762e7ac3-Q2D_teleport.mp3'
FPS=30;SR=48000;SPF=SR//FPS;LEAD=0
d=json.load(open('/home/user/what-if-videos/short/words.json'))
W=[w for s in d for w in s['words']]
L=[];cur=[]
for w in W:
    cur.append(w);t=w['w'].strip()
    if re.search(r'[.?!]$',t) and not re.fullmatch(r'\d+\.\d*',t.rstrip('.')): L.append(cur);cur=[]
if cur:L.append(cur)
SP={'Where did you come from?':'JANITOR','Fast bus.':'HERO','Nothing is locked for someone like you.':'HALE'}
raw=subprocess.run(['ffmpeg','-v','error','-i',SRC,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
a=np.frombuffer(raw,dtype=np.int16);nA=int(np.ceil(len(a)/SPF))
fr=np.array([np.sqrt(np.mean((a[k*SPF:(k+1)*SPF].astype(np.float32)/32768)**2)) if k*SPF<len(a) else 0 for k in range(nA)])
peak=np.percentile(fr,99.5)
cuts=[]
for i,l in enumerate(L):
    c=0 if i==0 else max(int(np.floor(l[0]['s']*FPS))-3,int(np.ceil(L[i-1][-1]['e']*FPS)),cuts[-1]+1)
    cuts.append(c)
cuts.append(nA)
os.makedirs(P+'/public/vo-short',exist_ok=True)
tl=[]
for i,l in enumerate(L):
    t=''.join(x['w'] for x in l).strip();sp=SP.get(t,'N');lid=f"s{i+1:02d}_{sp}"
    c0,c1=cuts[i],cuts[i+1]
    with wave.open(f"{P}/public/vo-short/{lid}.wav",'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(a[c0*SPF:c1*SPF].tobytes())
    tl.append({"id":lid,"sp":sp,"text":t,"file":f"vo-short/{lid}.wav","trimStart":0,"from":LEAD+c0,"dur":c1-c0,"talk":int(round(l[-1]['e']*FPS))-c0,
      "env":[round(float(min(1,v/peak)),2) for v in fr[c0:c1]],"w":[[x['w'].strip(),int(round(x['s']*FPS))-c0] for x in l]})
    print(f"{lid:12s} {c0/FPS:6.2f} {(c1-c0)/FPS:5.2f} {t}")
total=LEAD+nA+int(1.5*FPS)
json.dump({"fps":FPS,"total":total,"lines":tl},open(P+'/src/story/short-timeline.json','w'),ensure_ascii=False)
print('total',total,total/FPS)
