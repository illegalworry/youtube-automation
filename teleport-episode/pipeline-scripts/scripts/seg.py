import json,re
d=json.load(open('/home/user/what-if-videos/work/words.json'))
W=[w for s in d for w in s['words']]
lines=[];cur=[]
for w in W:
    cur.append(w)
    t=w['w'].strip()
    if re.search(r'[.?!]["\']?$',t) and not re.fullmatch(r'\d+\.\d*',t.rstrip('.')) or (len(cur)>=26 and t.endswith(',')):
        lines.append(cur);cur=[]
if cur: lines.append(cur)
out=[]
for i,l in enumerate(lines):
    out.append({"i":i+1,"s":l[0]['s'],"e":l[-1]['e'],"t":''.join(x['w'] for x in l).strip(),"words":[[x['w'].strip(),x['s'],x['e']] for x in l]})
json.dump(out,open('/home/user/what-if-videos/work/segs.json','w'),ensure_ascii=False)
for o in out: print(f"{o['i']:03d} {o['s']:7.2f} {o['e']-o['s']:5.2f} {o['t']}")
