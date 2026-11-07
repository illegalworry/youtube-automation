// Parallel chunk renderer: several workers, each with its own browser, claim unrendered chunks.
// node tools/render-parallel.mjs Long [workers=4] [chunk=1200]; then run tools/render.mjs Long
// with the same --chunk to join the chunks and mix the sound.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, npx, readJson, say} from './lib.mjs';

const id = process.argv[2] ?? 'Long';
const workers = Number(process.argv[3]) || 4;
const chunk = Number(process.argv[4]) || 1200;
const total = readJson('src/story/timeline.json').total;
const dir = path.join(ROOT, 'out', `chunks_${id}`);
fs.mkdirSync(dir, {recursive: true});
const n = Math.ceil(total / chunk);
let next = 0;
const run = async (w) => {
	await new Promise((r) => setTimeout(r, (w - 1) * 60000)); // stagger starts: cold font loads time out when all browsers boot at once
	while (next < n) {
		const k = next++;
		const s = k * chunk;
		const e = Math.min(total - 1, s + chunk - 1);
		const f = path.join(dir, `c${String(k).padStart(2, '0')}.mp4`);
		if (fs.existsSync(f)) continue;
		const tmp = path.join(dir, `tmp_${k}.mp4`);
		const t0 = Date.now();
		say(`worker ${w}: chunk ${k + 1}/${n} frames ${s}-${e}`);
		for (let a = 1; a <= 3; a++) {
			const r = await npx(['remotion', 'render', 'out/bundle', id, tmp, `--frames=${s}-${e}`, '--muted', '--gl=angle', '--concurrency=1', '--crf=18', '--log=error', '--timeout=900000'], {quiet: false});
			if (r === 0) {
				fs.renameSync(tmp, f);
				say(`worker ${w}: chunk ${k + 1} done in ${Math.round((Date.now() - t0) / 60000)} min`);
				break;
			}
			say(`worker ${w}: chunk ${k + 1} failed (try ${a})`);
		}
	}
};
await Promise.all(Array.from({length: workers}, (_, i) => run(i + 1)));
say('ALL CHUNKS DONE');
