# plan.py — builds story/shots.json (scene text, bars, transitions, sfx, ambience, music) from the draft timing + spec files
import json, re, os
B = os.path.dirname(os.path.abspath(__file__)) + '/../'
d = json.load(open(B + 'story/shots.json'))
W = json.load(open(B + 'timeline/words.json'))['words']
specs = ''
for n in (1, 2, 3): specs += open(B + f'scenes/shots/spec{n}.js').read() + '\n'
specs += open(B + 'scenes/shots/custom.js').read()
info = {}
for m in re.finditer(r"^\s*s(\d{3}): \{(.*)$", specs, re.M):
    info[int(m.group(1))] = m.group(2)

def word_t(word, after):
    w = word.lower()
    for x in W:
        if x['start'] >= after - 0.1 and re.sub(r"[^\w']", '', x['word'].lower()).startswith(re.sub(r"[^\w']", '', w)):
            return x['start']
    return None

SET_AMB = {'steppe': ('wind', -27), 'river': ('wind', -26), 'ger': ('roomtone', -26), 'city': ('murmur', -26), 'assembly': ('murmur', -26), 'grave': ('wind', -24), 'void': ('hum', -30)}
SCOPE = {1, 48, 49, 55, 75, 81, 82, 87, 89, 148, 157, 176, 190, 194, 195, 196, 197, 199, 202}
NONE = {8, 185, 199, 201, 204, 206, 207}
INS = {  # transition overrides
    9: ('dip', .5), 18: ('fade', .5), 29: ('dip', .4), 38: ('dip', .4), 47: ('whip', .35), 49: ('dip', .5), 53: ('fade', .6), 58: ('dip', .5), 80: ('whip', .35), 83: ('dip', .4),
    87: ('smash', .45), 88: ('whip', .35), 89: ('dip', .4), 93: ('push', .5), 98: ('fade', .5), 100: ('whip', .3), 102: ('whip', .3), 107: ('dip', .5), 108: ('whip', .3),
    128: ('push', .5), 133: ('whip', .3), 139: ('dip', .6), 143: ('fade', .5), 153: ('dipWhite', .6), 154: ('push', .5), 157: ('flash', .3), 162: ('dip', .6), 164: ('push', .5),
    170: ('dip', .5), 172: ('whip', .3), 173: ('whip', .3), 176: ('dip', .4), 179: ('fade', .6), 185: ('flash', .3), 187: ('dip', .6), 189: ('dip', .5), 190: ('smash', .45), 193: ('dip', .6), 196: ('whip', .3),
    198: ('fade', .8), 199: ('fade', .5), 202: ('dip', .7), 203: ('fade', .5), 204: ('cut', .1), 206: ('dip', .5), 207: ('fade', .6),
}
SFX_TAGS = {
    1: [(0.3, 'heartbeat', -10), (2.7, 'impact', -8)],
    8: [(0.3, 'riser', -14)], 9: [(0.0, 'impact', -6)],
    47: [(0.0, 'whoosh', -8)], 48: [(0.5, 'hit', -14)],
    80: [(0.0, 'swish', -8)], 87: [(0.9, 'hit', -6), (0.95, 'impact', -8)], 88: [(0.0, 'swish', -8)], 89: [(1.2, 'blip', -12)],
    62: [(2.3, 'hit', -8)], 63: [(0.3, 'pop', -10)],
    100: [(0.0, 'whoosh', -8), (0.5, 'kick', -10)], 102: [(0.0, 'swish', -8)], 107: [(0.0, 'whoosh', -8)], 108: [(0.0, 'swish', -8)],
    133: [(0.0, 'whoosh', -8)], 139: [(0.0, 'whoosh', -8)],
    153: [(0.0, 'flash', -8)], 157: [(0.0, 'impact', -6), (0.3, 'cheer', -14)], 170: [(0.0, 'impact', -6)], 172: [(0.0, 'swish', -10)], 173: [(0.0, 'swish', -10)],
    176: [(0.0, 'stinger', -10)], 185: [(0.0, 'flash', -8)], 189: [(0.0, 'impact', -6)], 190: [(0.9, 'hit', -6), (1.0, 'impact', -8)], 193: [(0.0, 'wind', -20)],
    196: [(0.0, 'kick', -10), (1.0, 'kick', -10), (2.0, 'kick', -10), (3.0, 'kick', -10)], 198: [(0.0, 'shimmer', -12)], 199: [(0.0, 'riser', -14)],
    201: [(0.5, 'counter', -14)], 204: [(1.4, 'pop', -10), (3.0, 'pop', -10)], 207: [(0.4, 'ding', -10)],
    44: [(0.0, 'riser', -16)], 82: [(0.0, 'buzz', -16)], 123: [(0.0, 'impact', -12)],
}
mus = [(0, 34, 'mystery', .45), (34, 74, 'calm', .3), (74, 122, 'hopeful', .3), (122, 150, 'dark', .55), (150, 257, 'sad', .4), (257, 320, 'tension', .6), (320, 352, 'hopeful', .4),
       (352, 370, 'action', .7), (370, 420, 'calm', .35), (420, 454, 'sad', .5), (454, 497, 'action', .6), (497, 526, 'triumph', .65), (526, 557, 'tension', .6), (557, 615, 'epic', .7),
       (615, 645, 'sad', .4), (645, 662, 'mystery', .4), (662, 690, 'epic', .55), (690, 701, 'calm', .35)]
out = []
for s in d['shots']:
    n = int(s['id'][1:]); line = info.get(n, ''); st = s['start']
    setn = (re.search(r"set: '(\w+)'", line) or [None, 'steppe'])[1]
    if 'draw:' in line or n in (1, 8, 185, 199, 201, 204, 206, 207): setn = {1: 'ger', 8: 'void', 185: 'steppe', 199: 'void', 201: 'void', 204: 'void', 206: 'city', 207: 'void'}.get(n, setn)
    s['set'] = setn
    figs = re.findall(r"F\('(\w+)'", line); its = re.findall(r"I\('(\w+)'", line)
    face = re.search(r"face: \{ who: '(\w+)'", line)
    s['scene'] = (f"giant face close-up of {face.group(1)}" if face else f"{setn}: " + ', '.join(dict.fromkeys(figs + its)) or setn)
    s['bars'] = 'scope' if n in SCOPE else ('none' if n in NONE else None)
    t, du = INS.get(n, ('cut', 0.4)); s['in'] = {'type': t, 'dur': du} if t != 'cut' else {'type': 'cut'}
    if t == 'whip': s['in']['dir'] = 1
    if re.search(r"mb: 3", line): s['mb'] = 3
    sf = [{'at': a, 'name': nm, 'gain': g} for a, nm, g in SFX_TAGS.get(n, [])]
    m = re.search(r"txt: \['([^']*)', \{([^}]*)\}", line)
    if m:
        at = re.search(r"at: '([^']+)'", m.group(2)); mode = re.search(r"mode: '(\w+)'", m.group(2))
        tt = word_t(at.group(1), st) if at else None
        a = max(0.1, (tt - st) - 0.05) if tt is not None else 0.4
        sf.append({'at': round(a, 2), 'name': 'hit' if mode and mode.group(1) == 'slam' else 'pop', 'gain': -9 if mode and mode.group(1) == 'slam' else -13})
    s['sfx'] = sf
    nm, g = SET_AMB.get(setn, ('wind', -27))
    if 'rain' in line or "'storm'" in line: nm, g = 'rain', -24
    s['amb'] = {'name': nm, 'gain': g}
    out.append(s)
d['shots'] = out; d['music'] = [{'start': a, 'end': min(b, d['duration']) if b > d['duration'] - 1 else b, 'mood': m, 'intensity': i} for a, b, m, i in mus]
d['music'][-1]['end'] = d['duration']
d['title'] = 'Genghis Khan: You Are Born'; d['sfx'] = []
json.dump(d, open(B + 'story/shots.json', 'w'), indent=1, ensure_ascii=False)
print(len(out), 'shots', d['duration'])
