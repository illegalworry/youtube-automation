"""Builds story/shots.json from the plan below. Each entry: (anchor, template, params, scene description).
anchor = int (sentence index → its start), 'w:word@sec' (first word starting at/after sec), or float seconds.
Shots start 0.15 s before their anchor and run until the next shot starts."""
import json, re, pathlib
P = pathlib.Path(__file__).resolve().parent.parent
sents = json.load(open(P / 'timeline/sentences.json')); sents = sents.get('sentences', sents) if isinstance(sents, dict) else sents
words = json.load(open(P / 'timeline/words.json')); words = words.get('words', words) if isinstance(words, dict) else words
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower())
def at(a):
    if isinstance(a, int): return sents[a]['start']
    if isinstance(a, float): return a
    w, t = a[2:].split('@'); t = float(t)
    for x in words:
        if x['start'] >= t - 0.05 and norm(x['word']).startswith(norm(w)): return x['start']
    raise SystemExit(f'word not found: {a}')
def text_between(t0, t1): return ' '.join(x['word'].strip() for x in words if t0 - 0.01 <= x['start'] < t1 - 0.01)

PLAN = [
 # ---------------- hook ----------------
 (0.0, 'street', dict(inv=[0, 0.94], invT=[0.6, 2.2], walkers=5, expr=[[0, 'calm'], [1.6, 'surprised']], look=[0, 0.4]), 'busy street: you fade into a glowing outline, walkers never turn'),
 (1, 'bigYou', dict(set='street', inv=0.94, expr=[[0, 'open'], [0.9, 'scared']], blind=1.0, blindW='blind'), 'close-up of the invisible head; the world goes dark on "blind"'),
 (2, 'parkAlone', {}, 'dusk park: friends walk away, the outline stays alone'),
 (3, 'porch', dict(ex='sad', youX=0.58), 'night porch, closed door, the outline waits; nobody comes'),
 (4, 'title', dict(title='WHAT IF YOU TURNED INVISIBLE?', sub='HOUR BY HOUR'), 'title card over a blurred street'),
 (5, 'studio', dict(inv=0, pills=[['1 PERSON', 'person', 0.22, 0.2], ['1 DAY', 'day', 0.5, 0.12], ['1 CHANGE', 'thing', 0.78, 0.2]], expr=[[0, 'calm']]), 'studio: you, visible teal hoodie; pills one person / one day / one change'),
 (6, 'bigYou', dict(set='studio', inv=[0, 0.94], invT=[0.4, 2.2], expr=[[0, 'calm'], [1.8, 'awe']]), 'close-up: your face fades to an outline'),
 (7, 'clock', dict(from_=[7, 12], to=[23, 59], night=False, pill='HOUR BY HOUR'), 'a wall clock spins through the day'),
 (8, 'board', dict(lines=['REAL PHYSICS', 'NOT MOVIE MAGIC']), 'classroom board: REAL PHYSICS / not movie magic'),
 (9, 'street', dict(mood='rainy', walkers=2, expr=[[0, 'worried']], tag='MIDNIGHT', pill='A TRAP', pillW='trap'), 'rainy night street, the outline alone; pill A TRAP'),
 (10, 'fogRule', dict(str='not science', w='nothing'), 'fogged window: a finger writes "not science"'),
 # ---------------- 7:12 AM ----------------
 (11, 'bedroom', dict(mode='wake', chapter='7:12 AM', chTitle='It starts'), 'morning bedroom: you sit on the bed and fade out'),
 (12, 'bedroom', dict(mode='down', expr=[[0, 'look'], [0.8, 'shocked']]), 'you look down at nothing'),
 (13, 'carpet', dict(tag='NO HANDS. NO FEET.'), 'top-down: the outline over the carpet; no hands, no feet'),
 (14, 'carpet', dict(big=True, z0=1.0, z1=1.12), 'push in: the carpet pattern straight through your stomach'),
 (15, 'bigYou', dict(set='bedroom', mood='day', inv=0.94, expr=[[0, 'worried'], [2.0, 'joy']]), 'close-up: worry flips into excitement'),
 (17, 'dream', {}, 'a kid in bed imagines being an invisible outline'),
 (18, 'dream', dict(q='What would I do?'), 'the kid’s question appears'),
 (19, 'venue', dict(v='cinema', label='ANY CINEMA'), 'outline strolls past the cinema rows'),
 ('w:any@57.5', 'venue', dict(v='concert', label='ANY CONCERT'), 'concert with spotlights; outline in front of the crowd'),
 ('w:any@59.3', 'venue', dict(v='lockers', label='ANY LOCKER ROOM'), 'locker room; nobody notices the outline'),
 (20, 'power', {}, 'top-secret meeting; the outline listens behind the table'),
 (21, 'shop', dict(floatItem=True, cctv=True, label='ANY SHOP'), 'shop aisle: a can floats into the air; the CCTV sees nobody'),
 (22, 'bedroom', dict(mode='joy', pill='10 MIN', pillW='10'), 'you jump on the bed, joyful; pill 10 MIN'),
 (23, 'bigYou', dict(set='bedroom', mood='day', inv=0.94, expr=[[0, 'joy'], [1.5, 'open'], [3.0, 'worried']], blur=2.6), 'close-up: eyes open wider; something is wrong'),
 # ---------------- the physics of seeing ----------------
 (24, 'fogRule', dict(str='Rule 1', w='first', sub='nobody tells you', subT=1.0), 'fogged glass: Rule 1'),
 (25, 'eye', dict(mode='catch', w='catch'), 'eye diagram: a ray of light enters'),
 (26, 'eye', dict(mode='retina', w='hits'), 'the ray hits the retina; arrow to the brain; a picture appears'),
 (27, 'through', dict(tags=[['NO STOP', "doesn't", 0.78, 0.3]]), 'rays pass straight through an invisible body'),
 (28, 'eye', dict(mode='through', w='passes', labels=False), 'the ray passes straight through the eye'),
 (29, 'eye', dict(mode='none', w='flies', kt='out the back of your head', ktW='out'), 'invisible eye: light flies out the back'),
 (30, 'eye', dict(mode='none', w='nothing', meter=0.0, labels=False, kt='NOTHING CAUGHT', ktW='nothing'), 'meter LIGHT ABSORBED 0%'),
 (31, 'eye', dict(mode='none', w='nothing', meter=0.0, labels=False, kt='NOTHING ABSORBED', ktW='absorbed'), 'still nothing absorbed'),
 (32, 'bigYou', dict(set='studio', inv=0.94, expr=[[0, 'open']], blind=0.8, blindW='blind', kt='BLIND', ktW='blind', ktMode='slam'), 'close-up goes dark: BLIND'),
 (33, 'writer', {}, 'a Victorian writer at his desk by lamplight'),
 (34, 'book', dict(pill='1897', pillW='1897', tag='H. G. WELLS', tagW='wells', cite='H. G. Wells, The Invisible Man (1897)'), 'book cover: THE INVISIBLE MAN, 1897'),
 (36, 'question', {}, 'readers in a parlour, puzzled; a big ?'),
 (37, 'wellsMan', dict(bub='How does he see?'), 'the bandaged invisible man in dark glasses'),
 (38, 'studio', dict(inv=0.94, expr=[[0, 'sly']], pose=[[0, 'shrug']], kt="WE'LL CHEAT A LITTLE", ktW='cheat'), 'studio: the outline shrugs slyly'),
 (39, 'bigYou', dict(set='studio', inv=0.94, expr=[[0, 'open']], ringEyes=1.2), 'close-up: a ring highlights the eyes'),
 (40, 'dots', dict(ruler=True), 'hallway: just two dark dots floating at head height; ruler ≈1.7 m'),
 (41, 'dots', dict(z0=1.3, z1=1.6, ringT=0.4, tag='REMEMBER THESE', tagW='remember'), 'push in on the dots'),
 # ---------------- 8 AM ----------------
 (43, 'bedroom', dict(mode='dressed', chapter='8:00 AM', chTitle='Getting dressed'), 'clothes float onto your invisible body'),
 (45, 'hallway', dict(mode='mirror', youX=0.3), 'hallway mirror reflects an empty hoodie'),
 (46, 'hallway', dict(mode='clothes', mirror=False, youX=0.5, z0=1.05, z1=1.15), 'a hoodie and jeans stand in the hallway, nobody inside'),
 (47, 'items', dict(items=[['HOODIE', 'body'], ['PHONE', 'stuff']], kt='BODY ✓   STUFF ✗', ktW='stuff'), 'studio: body vs stuff'),
 (48, 'items', {}, 'clothes, phone, keys, shoes pop up around the outline'),
 (49, 'hallway', dict(mode='drop', mirror=False, youX=0.5, pill='1 OPTION', pillW='one'), 'clothes drop to the floor'),
 (50, 'street', dict(walkers=2, expr=[[0, 'nervous']], youX=0.3, youWalk=True), 'you step outside with nothing on'),
 (51, 'book', dict(tag='WELLS KNEW', tagW='wells'), 'the Wells book again'),
 (52, 'street', dict(mood='rainy', snow=True, walkers=3, expr=[[0, 'sad']], tag='LONDON, WINTER'), 'snowy London night street; the outline shivers'),
 (53, 'trade', {}, 'stat card: UNSEEN vs EXPOSED'),
 (54, 'bigYou', dict(set='street', mood='rainy', snow=True, inv=0.94, expr=[[0, 'sad']]), 'close-up in falling snow'),
 # ---------------- 9 AM ----------------
 (55, 'street', dict(walkers=6, chapter='9:00 AM', chTitle='Outside', expr=[[0, 'look'], [2.5, 'confused']]), 'busy morning street; nobody cares'),
 (57, 'walkStreet', dict(ev='bump', hit=1.6, hitW='straight'), 'a walker on her phone bumps straight into you'),
 (58, 'walkStreet', dict(ev='cyclist', hit=0.9, hitW='knocks'), 'a cyclist almost knocks you flat'),
 (59, 'crossing', {}, 'you wait at the crossing, worried'),
 (60, 'crossing', dict(car=True, carT=0.4), 'a car whizzes past without stopping'),
 (61, 'signal', {}, 'the green walking man becomes an empty outline'),
 (62, 'street', dict(dog=True, dogT=0.6, walkers=1, expr=[[0, 'look'], [1.0, 'shocked']], youX=0.42), 'a dog stops dead and barks at you'),
 (63, 'dogClose', dict(bark=True, kt="DOGS DON'T NEED TO SEE", ktW='dogs'), 'close: the dog barking'),
 (64, 'dogClose', dict(sniff=True, kt='THEY SMELL YOU', ktW='smell'), 'scent lines from you to the dog nose'),
 (65, 'dogClose', dict(sniff=True, bark=True), 'sniffing, barking'),
 (66, 'breath', dict(tag='COLD MORNING', tagW='cold'), 'close: little clouds of breath out of nowhere'),
 (67, 'street', dict(walkers=6, breath=True), 'a ghost breathing on a busy street'),
 (68, 'bigYou', dict(set='street', inv=0.94, expr=[[0, 'thinking']]), 'close-up: thinking'),
 (69, 'street', dict(walkers=6, phones=True, expr=[[0, 'confused']], tag='NOBODY LOOKS SCARED'), 'walkers stare at their phones'),
 (70, 'bigPerson', dict(bub='Did you see that?', strike=True, outfit=['C', 'mustard'], expr='bored', look=[0, 0.8]), 'close-up of a bored walker; "did you see that?" crossed out'),
 (71, 'street', dict(walkers=5, prints=True, dog=True, breath=True, expr=[[0, 'sad']], youX=0.4), 'footprints, breath and a barking dog; people keep walking'),
 (72, 'bigPerson', dict(outfit=['C', 'coral'], expr='neutral', look=[1, 0], arrow=True), 'close-up: a walker looks straight past you'),
 (73, 'crowdPast', dict(ex='sad'), 'you alone in the crowd; that feels familiar'),
 # ---------------- 10:30 bank ----------------
 (74, 'bankOutside', dict(chapter='10:30 AM', chTitle='The bank'), 'bank doors slide open for someone else; you slip in behind'),
 (76, 'bank', dict(x0=-120, x1=-60, ex='sly'), 'inside the bank'),
 (77, 'bank', dict(insert=True), 'insert: the pile of cash'),
 (78, 'bank', dict(labels=[['CASH', 'cash', 0.3, 0.3], ['GUARD', 'guard', 0.58, 0.22], ['VAULT', 'vault', 0.82, 0.2]], z0=1.0, z1=1.08), 'pan: cash, guard on his phone, open vault'),
 (79, 'bigYou', dict(set='bank', inv=0.94, expr=[[0, 'sly']]), 'close-up: nobody could stop you'),
 (80, 'strikes', dict(items=[['THE HONEST TRUTH', 'part', 0.5, False]]), 'dark title: the part people don’t admit'),
 (81, 'reddit', {}, 'a monitor shows a Reddit thread'),
 (82, 'reddit', dict(hi=True), 'top answer highlighted: steal as much money as possible'),
 (83, 'strikes', dict(items=[['SAVE SOMEONE', 'save', 0.5, True]]), 'SAVE SOMEONE crossed out'),
 (84, 'strikes', dict(items=[['FIGHT CRIME', 'fight', 0.5, True]]), 'FIGHT CRIME crossed out'),
 (85, 'strikes', dict(items=[['TAKE MONEY', 'take', 0.5, False]]), 'TAKE MONEY slams in'),
 (86, 'bank', dict(reach=True, youX=0.3, z0=1.1, z1=1.2, x0=-150, x1=-120), 'you reach for the cash'),
 (87, 'bank', dict(lift=True, youX=0.3, z0=1.0, z1=1.1), 'the stack lifts and floats at waist height'),
 (88, 'bank', dict(guardLook=True, lift=True, youX=0.3, z0=1.25, z1=1.3, x0=140, x1=160), 'the guard looks up, shocked'),
 (89, 'bank', dict(drop=True, run=True, lift=True, youX=0.3), 'you drop it and run'),
 (90, 'bank', dict(prints=True, kt='EVIDENCE', ktW='evidence', youX=0.1, insert=True), 'fingerprints bloom on the cash: EVIDENCE'),
 # ---------------- 12 PM café ----------------
 (92, 'cafe', dict(chapter='12:00 PM', chTitle='Lunch', hold=True, expr=[[0, 'sly']]), 'café: a croissant lifts off the counter'),
 (94, 'cafe', dict(hold=True, insert=False, z0=1.08, z1=1.14), 'easy, nobody can see you'),
 (95, 'croissantClose', dict(mode='float', ex='happy'), 'close: the croissant is not invisible'),
 (96, 'croissantClose', dict(mode='bite'), 'bite, chew, swallow; a lump drops'),
 ('w:slowly@303', 'croissantClose', dict(mode='fall', ex='worried'), 'the soggy lump floats down slowly to your stomach'),
 (97, 'digest', dict(tags=[['BODY: INVISIBLE', 'body', 0.22, 0.3]]), 'diagram: body invisible'),
 (98, 'digest', dict(tags=[['BODY: INVISIBLE', 'body', 0.22, 0.3], ['FOOD: VISIBLE', 'food', 0.78, 0.3]], arrowLump=True), 'food visible'),
 (99, 'digest', dict(fade=True), 'the lump slowly digests into you'),
 (100, 'cafe', dict(lump=0.5, watch=True, z0=1.0, z1=1.05), 'every meal turns into a show'),
 (101, 'cafe', dict(lump=0.6, watch=True, z0=1.05, z1=1.12), 'customers watch a croissant digest in mid-air'),
 (102, 'cafe', dict(lump=0.6, scream=True, screamW='screaming'), 'people finally start screaming'),
 (103, 'cafe', dict(lump=0.6, scream=True, screamW='not', z0=1.1, z1=1.15), 'your lunch hangs in the middle of the room'),
 (104, 'cafe', dict(lump=0.6, run=True), 'you run'),
 (105, 'lesson', dict(title='LESSON 3', sub='WAIT AFTER EVERY MEAL', icon='clock'), 'title card: Lesson 3, a waiting clock'),
 # ---------------- 1 PM shop ----------------
 (107, 'shop', dict(chapter='1:00 PM', chTitle='The shop', youX=0.4, expr=[[0, 'content']], cctv=False), 'shop aisle: you think, fine'),
 (109, 'shop', dict(cctv=True, youX=0.4, expr=[[0, 'sly']]), 'CCTV camera, nobody detected'),
 (110, 'tagsYou', dict(kt='WRONG AGAIN', ktW='wrong', ktMode='slam', ktColor='#ff6a5c', expr=[[0, 'shocked']]), 'WRONG AGAIN'),
 (111, 'thermalDiag', dict(mode='light'), 'camera light misses the invisible body'),
 (112, 'through', dict(warm=True, tags=[['STILL WARM', 'warm', 0.75, 0.3]]), 'the outline glows warm'),
 (113, 'through', dict(warm=True, heart=True, tags=[['ALIVE', 'alive', 0.22, 0.3], ['HEARTBEAT', 'heart', 0.78, 0.3], ['HEAT', 'heat', 0.5, 0.12]]), 'heart beating, heat rising'),
 (114, 'thermalDiag', dict(mode='light'), 'cameras look for bounced light'),
 (115, 'thermalDiag', dict(mode='heat'), 'thermal cameras look for heat'),
 (116, 'thermal', dict(tag='THERMAL CAMERA', zoom=True), 'monitor: an orange body walks the aisle'),
 (117, 'evidence', dict(mode='mud', tag='FOOTPRINTS'), 'footprints appear in mud'),
 (118, 'evidence', dict(mode='door'), 'a shop door swings open by itself'),
 (119, 'evidence', dict(mode='prints', tag='FINGERPRINTS'), 'fingerprints bloom on glass'),
 (120, 'tagsYou', dict(tags=[['FOOTPRINTS', 'seen'], ['HEAT', 'seen'], ['PRINTS', 'untraceable']], kt='TRACEABLE', ktW='untraceable', expr=[[0, 'worried']]), 'traceable'),
 (121, 'tagsYou', dict(kt='NOT THE PERFECT THIEF', ktW='perfect', expr=[[0, 'sad']]), 'not the perfect thief'),
 (122, 'tagsYou', dict(tags=[['NAKED', 'naked'], ['HALF-BLIND', 'half'], ['HUNGRY', 'hungry'], ['FREEZING', 'freezing'], ['EASY TO TRACK', 'easy']], expr=[[0, 'sad']], shiver=True), 'naked, half-blind, hungry, freezing, easy to track'),
 # ---------------- 2 PM bus stop ----------------
 (123, 'busStop', dict(chapter='2:00 PM', chTitle='Asking for help', expr=[[0, 'sad']]), 'bus stop; you shiver at the side'),
 (125, 'busStop', dict(approach=True, expr=[[0, 'worried']]), 'you walk up to the woman'),
 (126, 'busStop', dict(near=True, startle=True, voice=[['Excuse me.', 'excuse'], ["Please don't panic.", 'please'], ['I need help.', 'need']], expr=[[0, 'worried']]), 'speech bubbles from nowhere'),
 (129, 'earClose', dict(ex='surprised', tag='NO ONE THERE', tagW='person'), 'close: she hears no person'),
 (130, 'earClose', dict(ex='scared', bub='…help?'), 'a voice right next to her ear'),
 (131, 'busStop', dict(near=True, scream=True, expr=[[0, 'worried'], [1.0, 'sad']]), 'she screams, drops her shopping and runs'),
 (132, 'lineup', dict(n=1), 'try it with anyone'),
 (133, 'lineup', dict(n=3), 'a police officer, a doctor, your best friend all recoil'),
 (136, 'bigPerson', dict(outfit=['FRIEND'], expr='scared', look=[-0.6, 0], bub='How can I help?', strike=True), 'friend close-up, scared; "how can I help?" crossed out'),
 (137, 'tagsYou', dict(kt='FEAR', ktW='fear', ktMode='slam', ktSize=120, ktColor='#ff6a5c', expr=[[0, 'sad']]), 'FEAR'),
 (138, 'earClose', dict(ex='scared', outfit=['COP']), 'a voice without a face'),
 (139, 'alone', dict(kt='LIKE A HORROR MOVIE', ktW='horror', lamp=0, expr=[[0, 'sad']]), 'a dark room, a voice from nowhere: horror movie'),
 (140, 'fogRule', dict(str='Rule 5', w='rule', sub='no face, no listening', subT=0.8), 'fogged glass: Rule 5'),
 (141, 'trust', dict(mood='day'), 'you talk; nobody listens'),
 (142, 'trust', dict(meter=True, mood='park'), 'TRUST meter drains'),
 (143, 'trust', dict(sit=True, mood='park', kt="YOU'RE ON YOUR OWN", ktW='own'), 'alone at the empty stop'),
 # ---------------- 3 PM park ----------------
 (144, 'parkBench', dict(chapter='3:00 PM', chTitle='The park', expr=[[0, 'sad']]), 'park bench, shivering'),
 (146, 'parkBench', dict(phone=True, lift=True, expr=[[0, 'look']], z0=1.1, z1=1.2), 'you check your phone; it floats up'),
 (147, 'parkBench', dict(hidden=True, z0=1.2, z1=1.3), 'the phone hidden under the bench'),
 (148, 'phone', dict(mode='missing', pill='MISSING', pillW='missing'), 'phone: last seen 7:12 AM'),
 (149, 'phone', dict(mode='list'), 'phone: work, messages, posts — all crossed'),
 (152, 'phone', dict(mode='zero'), 'phone: 0 new messages'),
 (153, 'parkBench', dict(expr=[[0, 'calm']], phone=True, pill='ONLY A FEW HOURS', pillW='few'), 'okay, only a few hours'),
 (155, 'parkBench', dict(timelapse=True, expr=[[0, 'sad']]), 'you wait; the light fades'),
 # ---------------- 7 PM dinner ----------------
 (156, 'dinner', dict(chapter='7:00 PM', chTitle='Home'), 'home kitchen: family dinner, you watch from the corner'),
 (158, 'dinner', dict(chairTag=True, z0=1.15, z1=1.2, x0=-40, x1=-30), 'your empty chair'),
 (159, 'dinner', dict(say=0, bub=["Where's…?", 'where', 0.42]), 'somebody asks where you are'),
 (160, 'dinner', dict(say=1, bub=['Probably out.', 'probably', 0.58]), 'probably out'),
 (161, 'dinner', dict(z0=1.06, z1=1.08, expr=[[0, 'sad']]), 'and that’s it'),
 (162, 'dinner', dict(tv=True), 'the TV goes on'),
 (163, 'dinner', dict(tvOn=True, laugh=True), 'someone laughs'),
 (164, 'dinner', dict(tvOn=True, glass=True, z0=1.2, z1=1.25, x0=120, x1=140, expr=[[0, 'sly']]), 'a glass at the table edge'),
 (165, 'dinner', dict(tvOn=True, whisper=True, z0=1.25, z1=1.3, x0=300, x1=320), 'you could whisper'),
 (166, 'dinner', dict(tvOn=True, flicker=True), 'the lights could flicker'),
 (167, 'bigYou', dict(set='room', inv=0.94, expr=[[0, 'thinking']]), 'close-up: what if you don’t?'),
 (168, 'dinner', dict(tvOn=True, z0=1.1, z1=0.98, youX=0.9, expr=[[0, 'sad']]), 'pull back: you stay quiet in the corner'),
 (169, 'phone', dict(mode='call', time='8:00 PM', bg='home', chapter='8:00 PM'), 'phone: no calls from work'),
 (171, 'phone', dict(mode='chat', time='9:00 PM', bg='home', chapter='9:00 PM'), 'group chat full of messages, none about you'),
 # ---------------- the turn ----------------
 (173, 'board', dict(lines=['LIGHT', 'HEAT', 'SMELL'], erase=1.0, after='?'), 'the physics board is wiped clean'),
 (174, 'bigYou', dict(set='room', inv=0.94, expr=[[0, 'thinking']]), 'close-up: the uncomfortable thought'),
 (175, 'bedroom', dict(mode='wake'), 'this morning, fading out'),
 (176, 'bigVisible', dict(kt='Were you visible yesterday?', ktW='were', serif=True, ktSize=64), 'visible you, close-up; the question'),
 (177, 'busRide', dict(v='bus', label='YESTERDAY'), 'yesterday on the bus'),
 ('w:the@517.3', 'busRide', dict(v='bus', label='THE BUS'), 'nobody looks up on the bus'),
 ('w:the@518.2', 'busRide', dict(v='store', label='THE STORE'), 'the store; cashier on her phone'),
 ('w:the@519.0', 'busRide', dict(v='hall', label='SCHOOL / WORK'), 'the hallway'),
 (179, 'bigVisible', dict(pill=True, pillW='how', expr=[[0, 'sad']]), 'how many people looked at you? counts to 0'),
 (180, 'bigPerson', dict(outfit=['C', 'pink'], expr='bored', look=[1, 0], mood='park'), 'a face looking past you'),
 (181, 'bigVisible', dict(expr=[[0, 'open']], look=[0, 0]), 'at you — straight into the lens'),
 (182, 'bigVisible', dict(nameTag=True, expr=[[0, 'sad']]), 'a blank name tag'),
 (183, 'party', dict(youFade=True, kt='COMPLETELY ALONE', ktW='alone'), 'a room full of people; you fade in the middle'),
 (184, 'phone', dict(mode='scroll', bg='home', time='YESTERDAY'), 'scrolling past faces'),
 (185, 'talkPair', dict(speaker=1, bub='Fine.', bubW='fine', ea='calm', eb='sad'), '"Fine."'),
 (186, 'talkPair', dict(speaker=0, bub='Cool.', bubW='cool', bPhone=True, bLookDown=True, ea='bored'), '"Cool." without looking up'),
 (187, 'phone', dict(mode='like', bg='home', time='YESTERDAY'), 'a like instead of a call'),
 (188, 'crowdPhones', {}, 'surrounded by people'),
 (189, 'crowdPhones', dict(kt="WE DON'T SEE EACH OTHER", ktW='see'), 'everyone lit by phones'),
 (190, 'crowdPhones', dict(fade=True), 'the crowd slowly turns into outlines'),
 (191, 'street', dict(walkers=5, prints=True, expr=[[0, 'sad']], youX=0.4), 'footprints on the pavement, nobody screams'),
 (192, 'crowdPast', dict(ex='sad', pill='7:12 AM', pillW='712'), 'people learned to look past you long before'),
 (193, 'crowdPast', dict(ex='sad', kt='THE REAL TRAP', ktW='real', ktMode='slam'), 'THE REAL TRAP'),
 (194, 'bigVisible', dict(expr=[[0, 'sad']]), 'it doesn’t make you disappear'),
 (195, 'bigVisible', dict(fade=True, expr=[[0, 'sad']]), 'you were already fading'),
 # ---------------- Plato ----------------
 (196, 'greek', dict(chapter='The Ring of Gyges', chTitle='An old idea'), 'ancient hills, a shepherd and his sheep'),
 (197, 'greek', {}, 'Plato’s shepherd; ≈2,400 years ago'),
 (198, 'cave', {}, 'a gold ring glows in a cave'),
 (199, 'cave', dict(vanish=True), 'he turns the ring and vanishes'),
 (200, 'cave', dict(vanish=True, close=True), 'what does he do with it?'),
 (201, 'palace', {}, 'palace: queen, king, throne'),
 (202, 'plato', dict(bub=True), 'Plato with a scroll and a question'),
 (203, 'bigQuestion', dict(lines=[['Never seen. Never caught.', 'never', 0.36], ['Would you still be good?', 'would', 0.56]]), 'the question in serif text'),
 (204, 'bigQuestion', dict(set='kitchen', lines=[['Or only good because', 'or', 0.3], ['someone is watching?', 'someone', 0.44]], eyes=True), 'watching eyes appear'),
 (205, 'alone', dict(kt='IT CUTS BOTH WAYS', ktW='cuts'), 'empty room under moonlight'),
 (206, 'alone', dict(expr=[[0, 'calm'], [2.0, 'determined']], kt='WHO YOU REALLY ARE', ktW='who'), 'nobody watching: who you really are'),
 (207, 'alone', dict(strike=True, tags=[['LIKES', 'likes', 0.22, 0.3], ['YOUR BOSS', 'boss', 0.5, 0.2], ['YOUR PARENTS', 'parents', 0.78, 0.3]]), 'likes, boss, parents crossed out'),
 (208, 'bigYou', dict(set='room', inv=0.94, expr=[[0, 'calm']], kt='JUST YOU', ktW='just'), 'just you, alone'),
 # ---------------- 11:59 PM ----------------
 (209, 'clock', dict(from_=[23, 55], to=[23, 59], pill='11:59 PM', kt='ONE CHOICE', ktW='one'), 'the clock nearly at midnight'),
 (210, 'doors', {}, 'two doors: stay invisible / be seen again'),
 (211, 'doors', dict(meter='THIS MORNING', v=0.85, meterW='most'), 'this morning: most choose invisible'),
 (212, 'doors', dict(meter='BY MIDNIGHT', v=0.05, meterW='midnight', lookR=True), 'by midnight almost nobody'),
 (213, 'doors', dict(lookR=True, openRight=True), 'the lit door opens a crack'),
 (214, 'alone', dict(kt="IT'S THE OPPOSITE", ktW='opposite', lamp=1, inv=0.5), 'you half-visible again'),
 (215, 'dinner', dict(tvOn=False, lookUp=True, youA=1, youX=0.88, expr=[[0, 'happy']], bub=['There you are!', 'name', 0.5]), 'the family looks up, glad you’re there'),
 (216, 'porch', dict(knock=0.6, open=1.4, x0=-60, x1=-80, z0=1.1, z1=1.16), 'you knock; the door opens with warm light'),
 # ---------------- recap + end ----------------
 (217, 'recap', dict(kt="SO, THAT'S THE ANSWER", ktW='answer'), 'recap title'),
 (218, 'recap', dict(icons=[['BLIND', 'sight']]), 'recap: blind'),
 (219, 'recap', dict(icons=[['NAKED', 'naked'], ['FREEZING', 'freezing'], ['THERMAL', 'thermal'], ['DOGS', 'dog']]), 'recap: naked, freezing, thermal, dogs'),
 (220, 'recap', dict(icons=[['LUNCH', 'lunch'], ['VOICE', 'voice']]), 'recap: lunch, voice'),
 (221, 'porch', dict(ex='sad', youX=0.55, x0=0, x1=-20), 'the hardest part of all?'),
 (222, 'endCard', dict(card='Would anyone notice?', cardT=2.2), 'rainy street; the outline fades; end card'),
]

def fix(p):
    p = dict(p)
    if 'from_' in p: p['from'] = p.pop('from_')
    if 'outfit' in p and isinstance(p['outfit'], list): p['outfitRef'] = p.pop('outfit')
    return p

DUR = round(sents[-1]['end'] + 1.6, 2)
starts = [max(0.0, round(at(a) - (0 if i == 0 else 0.15), 2)) for i, (a, *_ ) in enumerate(PLAN)]
assert all(b > a + 0.5 for a, b in zip(starts, starts[1:])), [(i, a, b) for i, (a, b) in enumerate(zip(starts, starts[1:])) if b <= a + 0.5]
shots = []
TR = {'title': {'type': 'fade', 'dur': 0.5}, 'bedroom': None}
for i, ((a, tpl, p, scene), s0) in enumerate(zip(PLAN, starts)):
    s1 = starts[i + 1] if i + 1 < len(starts) else DUR
    pp = fix(p); pp['tpl'] = tpl
    tr = {'type': 'cut'}
    if pp.get('chapter'): tr = {'type': 'dip', 'dur': 0.5}
    if tpl in ('title', 'lesson', 'endCard'): tr = {'type': 'fade', 'dur': 0.5}
    shots.append({'id': f's{i+1:03d}', 'start': s0, 'end': s1, 'line': text_between(s0 + 0.15 if i else 0, s1 + 0.15), 'scene': scene, 'set': tpl, 'bars': None, 'in': tr, 'params': pp, 'sfx': [], 'amb': None, 'notes': ''})
out = {'title': 'What If You Turned Invisible?', 'duration': DUR, 'shots': shots, 'music': [], 'sfx': []}
old = P / 'story/shots.json'
if old.exists():
    try: prev = json.load(open(old)); out['music'] = prev.get('music', []); out['sfx'] = prev.get('sfx', [])
    except Exception: pass
json.dump(out, open(old, 'w'), indent=1, ensure_ascii=False)
d = [s['end'] - s['start'] for s in shots]; d.sort()
print(len(shots), 'shots, duration', DUR, 'median', round(d[len(d) // 2], 2), 'max', round(d[-1], 2))
