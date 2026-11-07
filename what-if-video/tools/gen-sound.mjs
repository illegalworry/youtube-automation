// Builds src/story/sound.json from sound-base.json (hand-placed cues) + automatic cues read from
// shots.tsx (a pop for every label/banner, a swoosh for every card, a chat blip for every speech bubble).
import fs from 'node:fs';
const base = JSON.parse(fs.readFileSync('src/story/sound-base.json', 'utf8'));
const src = fs.readFileSync('src/story/shots.tsx', 'utf8');
const sfx = [...base.sfx];
const seen = new Set();
const add = (at, off, type, gain) => {
	const k = `${at}:${Math.round(off / 12)}:${type}`;
	if (seen.has(k)) return;
	seen.add(k);
	sfx.push({at, off, type, ...(gain ? {gain} : {})});
};
for (const line of src.split('\n')) {
	const m = /<(Tag|Banner|Card|Chart|Money|Ticket|Coin|Msgs|Heart|Burst)\b.*?t0=\{c\.t\('(\d{3})(?:\+(\d+))?'\)\}/.exec(line);
	if (m) {
		const [, kind, at, off] = m;
		const o = Number(off ?? 0);
		if (kind === 'Tag' || kind === 'Banner') add(at, o, 'pop', 0.07);
		else if (kind === 'Card') add(at, o, 'swoosh', 0.1);
		else if (['Chart', 'Money', 'Ticket', 'Coin'].includes(kind)) add(at, o + 4, 'ding', 0.1);
		else if (kind === 'Burst') add(at, o, 'whooshUp', 0.12);
		else if (kind === 'Heart') add(at, o, 'heartbeat', 0.08);
		else if (kind === 'Msgs') add(at, o, 'chat', 0.1);
	}
	const s = /<Say\b.*?t0="(\d{3})(?:\+(\d+))?"/.exec(line);
	if (s) add(s[1], Number(s[2] ?? 0), 'chat', 0.1);
}
const amb = base.ambience.map((a) => ({...a, gain: Math.round(a.gain * 1.8 * 1000) / 1000}));
const music = [
	{from: '001', to: '003', style: 'piano', amp: 0.2},
	{from: '003', to: '007', style: 'pad-warm', amp: 0.12},
	{from: '007', to: '025', style: 'pizz', amp: 0.2},
	{from: '025', to: '043', style: 'disco', amp: 0.16},
	{from: '043', to: '066', style: 'pad-tense', amp: 0.12},
	{from: '066', to: '084', style: 'piano', amp: 0.18},
	{from: '084', to: '113', style: 'pad-tense', amp: 0.12},
	{from: '113', to: '125', style: 'pizz', amp: 0.2},
	{from: '125', to: '132', style: 'pad-tense', amp: 0.12},
	{from: '132', to: '150', style: 'pad-warm', amp: 0.13},
	{from: '150', to: '168', style: 'piano', amp: 0.2},
	{from: '168', to: '200', style: 'piano', amp: 0.2},
	{from: '200', to: '219', style: 'pad-warm', amp: 0.14},
	{from: '219', to: '238', style: 'pizz', amp: 0.2},
	{from: '238', to: 'end', style: 'piano', amp: 0.22},
];
fs.writeFileSync('src/story/sound.json', JSON.stringify({ambience: amb, music, sfx}, null, 1));
console.log('sfx:', sfx.length, 'music sections:', music.length);
