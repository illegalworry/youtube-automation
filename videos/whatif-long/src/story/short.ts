import type React from 'react';
import {interpolate} from 'remotion';
import {CardEnd, CardSpike} from './shortCards';
import type {Ctx} from './scene';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type XYZ = [number, number, number];
/* a camera that glides from A to B over the segment (world x, y, zoom; zoom < 1 shows more) */
const glide = (a: XYZ, b: XYZ = a) => (c: Ctx): XYZ => {
	const k = interpolate(c.f, [0, c.dur], [0, 1], cl);
	return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};

/* 9:16 teaser for the long video ("recut"): its own ElevenLabs voice (short-timeline.json),
   each line laid over a stretch of a long shot and cropped, with native vertical cards.
   Seg: line = short line prefix; ep/off = long line + frames; a/b = crop at start/end. */
export type Seg = {
	line: string;
	at?: number;
	ep?: string;
	off?: number;
	cont?: boolean;
	hold?: boolean;
	a?: {cx?: number; cy?: number; z?: number};
	b?: {cx?: number; cy?: number; z?: number};
	C?: React.FC<{f: number; dur: number}>;
	cam?: (c: Ctx) => XYZ; // the shot's own camera for the vertical frame (crop stays centred)
};

export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string; caps?: [string, number, string[]][]} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string; caps?: [string, number, string[]][]} = {
	mode: 'recut',
	bed: 'sfx/short-bed.wav',
	segs: [
		{line: 's01', C: CardSpike},
		// mom and the boss with their dates
		{line: 's03', ep: '005', off: -10, cam: glide([760, 540, 0.8], [770, 530, 0.84])},
		// the friend and his date
		{line: 's04', ep: '003', off: 100, cam: glide([1150, 520, 1.1], [1150, 500, 1.25])},
		// the hero and his reflection: no number on him, the friend's is in the mirror
		{line: 's05', ep: '029', off: 10, cam: glide([1140, 560, 0.7], [1150, 550, 0.72])},
		// the thrill seeker on the bridge
		{line: 's06', ep: '113', off: 0, cam: glide([1070, 380, 1.1], [1060, 360, 1.2])},
		// he jumps and lands on the mattress truck: the camera follows the truck
		{
			line: 's07',
			ep: '119',
			off: 20,
			cam: (c) => {
				const tx = interpolate(c.f, [0, c.dur], [2300, -500]);
				const land = c.w(['119', 50]);
				const k = interpolate(c.f, [land - 10, land + 10], [0, 1], cl);
				return [960 + (tx + 40 - 960) * k, 560 + 80 * k, 0.95];
			},
		},
		// the girl and her teacher: the number flips
		{line: 's08', ep: '211', off: -45, cam: glide([980, 520, 0.92], [1040, 480, 1.05])},
		// the shelter: the teacher stays with the elderly
		{line: 's09', ep: '227', off: 40, cam: glide([900, 540, 0.82], [910, 530, 0.84])},
		// numbers start to move
		{line: 's10', ep: '239', off: 0, cam: glide([1080, 530, 0.8], [1090, 520, 0.82])},
		// the quiet morning: people step out
		{line: 's11', ep: '251', off: 50, cam: glide([720, 540, 0.95], [760, 520, 1.0])},
		{line: 's12', C: CardEnd},
	],
	// short on-screen accents: [line, frames into it, words]
	caps: [
		['s03', 10, ['A NUMBER', 'ABOVE EVERY HEAD']],
		['s04', 4, ['THE DAY', 'THEY WILL DIE']],
		['s05', 30, ['EXCEPT', 'YOUR OWN']],
		['s06', 4, ['CHEAT IT?']],
		['s07', 4, ['THEY SURVIVE.', 'EVERY TIME.']],
		['s08', 40, ['ONE NUMBER', 'CHANGED']],
		['s09', 30, ['NOBODY', 'EXPECTED THIS']],
		['s11', 20, ['THE ENDING IS', "NOT WHAT YOU THINK"]],
	],
};
