import json,re
P='/home/user/what-if-videos/episode'
src=open(P+'/src/story/short.ts').read()
segs=re.findall(r"S\('(s\d\d)', '\d+', -?\d+, Z\([^)]*\), Z\([^)]*\), \[([^\]]*)\](?:, (\d+|undefined))?",src)
S=[]
def s(at,off,type,**k): S.append({"at":at,"off":off,"type":type,**k})
for i,(line,fx,at) in enumerate(segs):
    if i==0: continue
    off=int(at) if at and at!='undefined' else -6
    if "'whip'" in fx: s(line,off-4,'whoosh',amp=0.22,dur=0.8)
    elif "'pop'" in fx: s(line,off,'pop',amp=0.4)
    else: s(line,off-2,'swoosh',amp=0.12)
s('s01',3,'alarm',dur=1.3,amp=0.07)
s('s04',30,'whooshUp',dur=1.0,amp=0.18); s('s05',4,'pop',amp=0.55); s('s05',4,'thud',amp=0.35)
s('s07',3,'click',amp=0.25)
s('s08',34,'thud',amp=0.45)
s('s09',24,'ding',amp=0.2)
s('s10',29,'whooshUp',dur=0.6,amp=0.2); s('s10',47,'stamp',amp=0.4)
s('s12',24,'stamp',amp=0.3)
for o in range(45,95,6): s('s13',o,'click',amp=0.18)
s('s13',90,'ding',amp=0.2)
s('s14',165,'thud',amp=0.6); s('s14',196,'stamp',amp=0.45)
for o in (38,56,66,80): s('s15',o,'pop',amp=0.3)
s('s15',109,'pop',amp=0.35); s('s15',121,'pop',amp=0.35); s('s15',155,'pop',amp=0.3); s('s15',198,'ding',amp=0.25)
s('s16',53,'ding',amp=0.25); s('s16',60,'chat',amp=0.06,dur=1.5); s('s16',77,'stamp',amp=0.4)
for o in (86,94,102): s('s17',o,'thud',amp=0.4)
s('s18',0,'heartbeat',dur=3,amp=0.12)
s('s19',51,'whooshUp',dur=0.8,amp=0.25); s('s19',95,'thud',amp=0.45); s('s19',135,'stamp',amp=0.35)
s('s20',4,'ding',amp=0.25); s('s21',15,'pop',amp=0.35)
amb=[{"from":"s01","to":"s06","kind":"room","gain":0.04},{"from":"s06","to":"s10","kind":"hall","gain":0.04},
     {"from":"s15","to":"s16","kind":"wind","gain":0.03},{"from":"s16","to":"s17","kind":"crowd","gain":0.04}]
mus=[{"from":"s01","to":"s10","style":"pizz","bpm":118,"amp":0.075},{"from":"s10","to":"s15","style":"pad-tense","amp":0.04},
     {"from":"s15","to":"s17","style":"disco","amp":0.07},{"from":"s17","to":"s20","style":"pad-tense","amp":0.045},
     {"from":"s20","to":"end","style":"pizz","bpm":118,"amp":0.075}]
json.dump({"ambience":amb,"music":mus,"sfx":S},open(P+'/src/story/short-sound.json','w'),indent=1)
print(len(segs),'segs',len(S),'sfx')
