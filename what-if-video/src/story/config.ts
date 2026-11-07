/* Story-level settings. */
export type CounterKeyDef = {line: string; off?: number; v: number; roll?: number};

export const STORY: {
	title: string;
	hero: string;
	counter?: {label: string; color?: string; keys: CounterKeyDef[]};
	heroAge?: (counter: number) => number;
	heroGrow?: number;
	bed: string;
	musicVolume?: number;
	endCaption?: string[];
} = {
	title: 'Nine Days of Perfect Luck',
	hero: 'hero',
	counter: {
		label: 'DAY',
		color: '#b6ff1f',
		keys: [
			{line: '001', v: 1},
			{line: '025', off: 0, v: 2, roll: 14},
			{line: '036', off: 0, v: 3, roll: 14},
			{line: '084', off: 0, v: 4, roll: 14},
			{line: '113', off: 0, v: 5, roll: 14},
			{line: '125', off: 0, v: 6, roll: 14},
			{line: '150', off: 0, v: 7, roll: 14},
			{line: '168', off: 0, v: 8, roll: 14},
			{line: '191', off: 70, v: 9, roll: 14},
			{line: '219', off: 40, v: 10, roll: 14},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: ['WOULD YOU TAKE PERFECT LUCK?', 'TELL ME IN THE COMMENTS'],
};
