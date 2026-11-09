import json,re
P='/home/user/what-if-videos/episode'
TL=json.load(open(P+'/src/story/timeline.json'))
L={l['id'][:3]:l for l in TL['lines']}
norm=lambda s: re.sub(r'[^a-z0-9]','',s.lower())
def off(n,w=0):
    l=L[n]
    if isinstance(w,int): return l['w'][min(w,len(l['w'])-1)][1]
    for t,o in l['w']:
        if norm(t).startswith(norm(w)): return o
    raise Exception(f'{n} {w}')
amb=[('001','006','room',0.05),('006','013','hall',0.05),('013','017','room',0.04),('022','029','room',0.04),('029','032','room',0.04),('032','033','rain',0.05),
('039','041','wind',0.04),('044','046','fridge',0.05),('048','052','sea',0.05),('062','064','wind',0.04),('073','078','hall',0.04),('078','084','crowd',0.04),('084','088','room',0.04),
('090','093','wind',0.04),('093','099','street',0.05),('099','100','night',0.05),('103','106','street',0.04),('110','116','hall',0.04),('126','130','street',0.05),
('141','149','room',0.04),('153','159','fridge',0.04),('163','166','fridge',0.04),('166','171','night',0.06),('175','185','room',0.04),('185','190','sea',0.05),('190','198','room',0.04),
('207','219','sea',0.05),('219','224','wind',0.03),('228','230','wind',0.04),('230','247','sea',0.06),('247','251','night',0.05),('251','253','rain',0.04),('259','277','rain',0.04),
('277','282','rain',0.09),('282','283','rain',0.06),('283','285','hall',0.05),('285','293','rain',0.09),('293','307','rain',0.08),('311','317','crowd',0.05),('318','320','crowd',0.05),
('320','332','room',0.04),('332','357','fridge',0.04)]
music=[('001','017','pizz',0.16),('017','022','pad-tense',0.07),('022','122','pizz',0.15),('122','126','pad-warm',0.06),('126','141','pizz',0.13),('141','171','pad-tense',0.07),
('171','175','pizz',0.14),('175','251','piano',0.16),('251','307','pad-tense',0.08),('307','318','disco',0.13),('318','332','piano',0.15),('332','357','pad-tense',0.06),('357','end','pizz',0.15)]
S=[]
def s(n,w,t,**k): S.append(dict(at=n,off=off(n,w)+k.pop('d',0),type=t,**k))
# pops: every teleport
pops=[('005','pop'),('006',0),('022',0),('031',0),('032',0),('039','Sometimes'),('040','car'),('044','lands'),('048',0),('073',0),('076',0),('077',0),('078','pizza'),
('090','cow'),('090','parking'),('090','wedding'),('092',0),('099',0),('104','hop'),('127','pop'),('168','back'),('178','visit'),('230',0),('245','hop'),('276',0),('277',0),
('281',0),('282',0),('283',0),('285',0),('288',0),('292',0),('319','hop'),('345',0),('354',0)]
for n,w in pops: s(n,w,'pop',a=0.2); s(n,w,'whoosh',dur=0.5,a=0.12,d=-3)
s('002','alarm','alarm',dur=1.6,a=0.05); s('003',0,'steps',dur=4,a=0.14); s('005','squeeze','whooshUp',dur=1.0)
s('008','drops','thud',d=12); s('013',0,'steps',dur=2,a=0.12); s('014','best','stamp')
for n in ['026','035','041','046']: s(n,0,'swoosh'); s(n,0,'thud',a=0.3,d=6)
s('029','picture','pop'); s('032',0,'splash',a=0.2); s('033',0,'chat',a=0.06); s('034',0,'stamp',a=0.3)
s('044','throws','splash',a=0.12); s('051','fall','splash',a=0.3,d=10); s('051','fall','splash',a=0.25,d=16)
s('054','about','ding',d=8); s('061','Jump','whooshUp',dur=1.2); s('066',0,'ding'); s('067','two','ding')
for i in range(10): S.append(dict(at='070',off=off('070','add')+i*4,type='click',a=0.15))
s('072',0,'ding',a=0.15); s('080','hot','ding',a=0.08); s('082',0,'ring',dur=0.4,a=0.04)
s('087','superpower','whooshUp',dur=0.8); s('091',0,'clap',a=0.15); s('091',0,'clap',a=0.15,d=8)
s('093','yours','ding'); for_ = [('101','paris'),('101','rome'),('101','barcelona')]
for n,w in for_: s(n,w,'stamp',a=0.25)
s('105',0,'ding'); s('107',0,'heartbeat',dur=2,a=0.08); s('110','asleep','pop',a=0.06); s('112',0,'thud',a=0.2)
s('118','teleported','whooshUp',dur=1.6); s('121',0,'pop'); s('123','paperwork','whoosh',dur=1.0)
s('125','zero','stamp'); s('129',0,'click'); s('130','14','whooshUp',dur=2)
for n in ['133','134']: s(n,0,'swoosh')
s('135',0,'chat'); s('136',0,'chat'); s('138',0,'chat'); s('139',0,'sent'); s('140',0,'chat')
s('141','knock','thud',a=0.3); s('141','knock','thud',a=0.3,d=8); s('141','knock','thud',a=0.3,d=20); s('141','knock','thud',a=0.3,d=28)
s('148','slides','swoosh',a=0.08)
for w in ['vaults','server','borders']: s('150',w,'switch')
s('159',0,'ding',a=0.1); s('162',0,'thud'); s('168','back','steps',dur=1.5,a=0.1); s('172',0,'pop'); s('173',0,'chat')
s('189',0,'whooshUp',dur=1); s('194','airport','thud',a=0.2,d=10); s('194','plane','thud',a=0.2,d=10); s('194','car','thud',a=0.2,d=10)
s('204','savings','click'); s('205','two','chat'); s('205','trains','chat'); s('205','bus','chat'); s('205','ferry','chat'); s('206',0,'stamp',a=0.3)
s('207',0,'steps',dur=5,a=0.12); s('210',0,'steps',dur=2,a=0.12); s('211',0,'whooshUp',dur=1.2); s('211',0,'birds',dur=6)
s('230',0,'birds',dur=8); s('239',0,'ding',a=0.12); s('247',0,'heartbeat',dur=1.5,a=0.05)
s('252','red','alarm',dur=1.2,a=0.05); s('253',0,'siren',dur=6,a=0.025); s('263',0,'thud',a=0.2); s('267',0,'thud',a=0.3); s('268',0,'thud',a=0.3)
s('279','shaking','thud',a=0.4); s('279','shaking','thud',a=0.3,d=8)
for i in range(12): S.append(dict(at='293',off=i*22+2,type='thud',a=0.25))
for n in ['300','301']: s(n,0,'chat',a=0.08)
s('305','47','whooshUp',dur=1.5); 
for n in ['307','308','309','310']: s(n,0,'stamp',a=0.3)
s('313','beep','ding',a=0.08); s('314',0,'ding',a=0.08); s('315',0,'ding',a=0.08); s('315',0,'ding',a=0.08,d=4); s('315',0,'ding',a=0.08,d=8)
s('317',0,'whoosh',dur=1); s('321',0,'ding',a=0.08); s('330','winks','ding',a=0.1); s('340',0,'ding',a=0.08)
s('341',0,'steps',dur=2,a=0.12); s('344','ripples','whooshUp',dur=2.5,a=0.15); s('356','lemon','ding',a=0.12); s('358','jump','whooshUp',dur=1)
s('359',0,'pop'); s('360',0,'ding')
spec={"ambience":[dict(**{"from":a,"to":b,"kind":k,"gain":g}) for a,b,k,g in amb],
"music":[{"from":a,"to":b,"style":st,"amp":g} for a,b,st,g in music],"sfx":S}
json.dump(spec,open(P+'/src/story/sound.json','w'),indent=0)
print(len(S),'sfx')
