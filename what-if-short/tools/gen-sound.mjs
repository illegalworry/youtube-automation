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
const amb = base.ambience;
const music = [
	{from: '001', to: '005', style: 'pizz', amp: 0.22},
	{from: '005', to: '009', style: 'disco', amp: 0.18},
	{from: '009', to: '012', style: 'pad-tense', amp: 0.13},
	{from: '012', to: 'end', style: 'piano', amp: 0.24},
];
fs.writeFileSync('src/story/sound.json', JSON.stringify({ambience: amb, music, sfx}, null, 1));
console.log('sfx:', sfx.length, 'music sections:', music.length);
