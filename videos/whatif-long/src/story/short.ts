import type React from 'react';
import {CardEnd, CardSpike} from './shortCards';

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
};

export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string; caps?: [string, number, string[]][]} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string; caps?: [string, number, string[]][]} = {
	mode: 'recut',
	bed: 'sfx/short-bed.wav',
	segs: [
		{line: 's01', C: CardSpike},
		{line: 's03', ep: '004', off: 30, a: {cx: 960, cy: 520, z: 1}, b: {cx: 900, cy: 500, z: 1.15}},
		{line: 's04', ep: '003', off: 100, a: {cx: 1080, cy: 500, z: 1.0}, b: {cx: 1100, cy: 480, z: 1.1}},
		{line: 's05', ep: '029', off: 10, a: {cx: 980, cy: 540, z: 1.0}, b: {cx: 1120, cy: 520, z: 1.1}},
		{line: 's06', ep: '113', off: 0, a: {cx: 960, cy: 420, z: 1.3}, b: {cx: 960, cy: 380, z: 1.5}},
		{line: 's07', ep: '119', off: 20, a: {cx: 960, cy: 600, z: 1.0}, b: {cx: 820, cy: 640, z: 1.0}},
		{line: 's08', ep: '211', off: -45, a: {cx: 1150, cy: 560, z: 1.0}, b: {cx: 1150, cy: 540, z: 1.08}},
		{line: 's09', ep: '227', off: 40, a: {cx: 900, cy: 540, z: 1.0}, b: {cx: 1120, cy: 520, z: 1.05}},
		{line: 's10', ep: '239', off: 0, a: {cx: 1250, cy: 520, z: 1.0}, b: {cx: 1000, cy: 520, z: 1.05}},
		{line: 's11', ep: '251', off: 50, a: {cx: 960, cy: 520, z: 1.0}, b: {cx: 960, cy: 500, z: 1.1}},
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
