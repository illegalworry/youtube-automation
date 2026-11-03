"""Adds music sections, ambience beds and SFX cues to story/shots.json (only the sound keys are touched)."""
import json, re, pathlib
P = pathlib.Path(__file__).resolve().parent.parent
S = json.load(open(P / 'story/shots.json'))
words = json.load(open(P / 'timeline/words.json')); words = words.get('words', words) if isinstance(words, dict) else words
norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower())
def lw(shot, w, fb):
    if not w: return fb
    for x in words:
        if x['start'] >= shot['start'] - 0.3 and norm(x['word']).startswith(norm(w)):
            return max(0.0, x['start'] - shot['start']) if x['start'] < shot['end'] + 0.3 else fb
    return fb

AMB = {}
for k in 'street walkStreet crossing signal dogClose crowdPast busStop lineup bankOutside breath bigPerson earClose talkPair crowdPhones title'.split(): AMB[k] = ('city', -25)
for k in 'bank cafe busRide party'.split(): AMB[k] = ('murmur', -27)
for k in 'shop evidence'.split(): AMB[k] = ('roomtone', -26)
for k in 'bedroom hallway dinner alone writer book question dots clock carpet dream'.split(): AMB[k] = ('roomtone', -29)
for k in 'park parkBench parkAlone porch greek trust'.split(): AMB[k] = ('wind', -28)
for k in 'reddit thermal cave'.split(): AMB[k] = ('hum', -30)
AMB['fogRule'] = ('rain', -25); AMB['endCard'] = ('rain', -26); AMB['palace'] = ('roomtone', -28); AMB['venue'] = ('murmur', -28)

for s in S['shots']:
    p, d, cues = s['params'], s['end'] - s['start'], []
    tpl = p['tpl']
    if tpl in AMB:
        n, gdb = AMB[tpl]
        if p.get('mood') == 'rainy': n, gdb = ('wind', -24) if p.get('snow') else ('rain', -25)
        s['amb'] = {'name': n, 'gain': gdb}
    else: s['amb'] = None
    add = lambda at, name, gain, **kw: cues.append({'at': round(max(0, min(at, d - 0.05)), 2), 'name': name, 'gain': gain, **kw})
    if p.get('chapter'): add(0.15, 'clock', -16, dur=1.6); add(0.2, 'ding', -15)
    if p.get('kt'):
        at = lw(s, p.get('ktW', ''), 0.4)
        add(at, 'impact' if p.get('ktMode') == 'slam' else 'swish', -8 if p.get('ktMode') == 'slam' else -14)
    if p.get('pill'): add(lw(s, p.get('pillW', ''), 0.5), 'pop', -13)
    if p.get('tag'): add(lw(s, p.get('tagW', ''), 0.4), 'blip', -16)
    for key in ('pills', 'tags', 'items', 'labels', 'icons'):
        for it in p.get(key) or []:
            w = it[1] if len(it) > 1 and isinstance(it[1], str) else ''
            add(lw(s, w, 0.5), 'pop', -15)
    if isinstance(p.get('inv'), list) or p.get('invW') or tpl == 'bigYou' and isinstance(p.get('inv'), list): add(0.4, 'shimmer', -14)
    if tpl == 'bedroom' and p.get('mode') == 'wake': add(0.5, 'shimmer', -14)
    if tpl == 'title': add(0.0, 'stinger', -9, minor=False)
    if tpl == 'lesson': add(0.1, 'stinger', -11)
    if p.get('blind'): add(lw(s, p.get('blindW', ''), 1.0), 'slowmo', -12)
    if tpl == 'eye' and p.get('mode') in ('catch', 'through', 'none', 'retina'): add(lw(s, p.get('w', ''), 0.4), 'whoosh', -15)
    if tpl == 'through': add(0.3, 'whoosh', -15)
    if p.get('heart'): add(0.6, 'heartbeat', -10, dur=2.5)
    if tpl == 'fogRule': add(lw(s, p.get('w', ''), 0.3), 'swish', -18)
    if tpl == 'walkStreet' and p.get('ev') == 'bump': add(lw(s, p.get('hitW', ''), 1.6), 'hit', -8)
    if tpl == 'walkStreet' and p.get('ev') == 'cyclist': add(0.1, 'whoosh', -8); add(lw(s, p.get('hitW', ''), 0.9), 'hit', -10)
    if tpl == 'crossing' and p.get('car'): add(0.2, 'carpass', -8)
    if p.get('dog') or (tpl == 'dogClose' and p.get('bark')): add(0.6, 'kick', -16)
    if tpl == 'bankOutside': add(1.0, 'swish', -14)
    if p.get('lift') and not p.get('drop') and not p.get('guardLook'): add(lw(s, 'lifts', 1.5), 'shimmer', -12)
    if p.get('guardLook'): add(lw(s, 'looks', 0.3), 'stinger', -10)
    if p.get('drop'): add(lw(s, 'drop', 0.4), 'hit', -10); add(0.6, 'footstep', -12)
    if p.get('prints'): add(lw(s, 'evidence', 0.8), 'blip', -13)
    if tpl == 'reddit': add(0.4, 'blip', -16)
    if tpl == 'strikes': add(0.6, 'swish', -14)
    if tpl == 'croissantClose' and p.get('mode') == 'bite':
        for w in ('bite', 'chew', 'swallow'): add(lw(s, w, 0.5), 'pop', -12)
    if p.get('scream'): add(lw(s, p.get('screamW', 'screams'), 0.4), 'stinger', -9)
    if tpl in ('cafe', 'busStop') and (p.get('run') or p.get('scream')): add(0.8, 'whoosh', -12)
    if tpl == 'thermal' and p.get('zoom'): add(0.2, 'buzz', -18)
    if tpl == 'evidence': add(0.3, 'pop' if p.get('mode') != 'door' else 'swish', -13)
    if tpl == 'trust' and p.get('meter'): add(0.8, 'slowmo', -14)
    if tpl == 'parkBench' and p.get('lift'): add(0.3, 'phonebuzz', -14)
    if tpl == 'phone':
        add(0.05, 'swish', -15)
        if p.get('mode') == 'zero': add(0.2, 'counter', -14)
        if p.get('mode') == 'chat': add(0.4, 'phonebuzz', -15)
        if p.get('mode') == 'like': add(0.8, 'pop', -12)
    if tpl == 'dinner' and p.get('tv'): add(lw(s, 'tv', 0.4), 'blip', -12)
    if tpl == 'dinner' and p.get('flicker'): add(0.8, 'glitch', -14)
    if tpl == 'board' and p.get('erase'): add(1.0, 'swish', -12)
    if tpl == 'cave' and p.get('vanish'): add(lw(s, 'invisible', 1.4), 'shimmer', -10)
    if tpl == 'cave' and not p.get('vanish'): add(0.4, 'ding', -14)
    if tpl == 'palace': add(lw(s, 'kills', 2.4), 'hit', -12); add(lw(s, 'throne', 4.0), 'stinger', -12)
    if tpl == 'bigQuestion' and p.get('eyes'): add(lw(s, 'watching', 1.5), 'pop', -10)
    if tpl == 'doors' and p.get('openRight'): add(0.5, 'shimmer', -11)
    if tpl == 'porch' and p.get('knock'):
        for k in range(3): add(p['knock'] + k * 0.35, 'kick', -6)
        add(p['open'], 'shimmer', -10)
    if tpl == 'endCard': add(p.get('cardT', 1.0), 'stinger', -12, minor=False)
    # de-duplicate cues landing within 0.12 s of each other
    cues.sort(key=lambda c: c['at']); out = []
    for c in cues:
        if not out or c['at'] - out[-1]['at'] > 0.12 or c['name'] != out[-1]['name']: out.append(c)
    s['sfx'] = out

S['music'] = [
    {'start': 0.0, 'end': 11.8, 'mood': 'mystery', 'intensity': 0.4},
    {'start': 11.8, 'end': 36.1, 'mood': 'wonder', 'intensity': 0.5},
    {'start': 36.1, 'end': 80.9, 'mood': 'playful', 'intensity': 0.5},
    {'start': 80.9, 'end': 137.7, 'mood': 'mystery', 'intensity': 0.35},
    {'start': 137.7, 'end': 236.6, 'mood': 'playful', 'intensity': 0.35},
    {'start': 236.6, 'end': 334.1, 'mood': 'tension', 'intensity': 0.45},
    {'start': 334.1, 'end': 384.4, 'mood': 'mystery', 'intensity': 0.45},
    {'start': 384.4, 'end': 463.4, 'mood': 'sad', 'intensity': 0.35},
    {'start': 463.4, 'end': 505.1, 'mood': 'sad', 'intensity': 0.3},
    {'start': 505.1, 'end': 574.5, 'mood': 'calm', 'intensity': 0.3},
    {'start': 574.5, 'end': 621.3, 'mood': 'mystery', 'intensity': 0.4},
    {'start': 621.3, 'end': 649.8, 'mood': 'hopeful', 'intensity': 0.45},
    {'start': 649.8, 'end': S['duration'], 'mood': 'calm', 'intensity': 0.35},
]
json.dump(S, open(P / 'story/shots.json', 'w'), indent=1, ensure_ascii=False)
print('cues:', sum(len(s['sfx']) for s in S['shots']), 'amb shots:', sum(1 for s in S['shots'] if s['amb']))
