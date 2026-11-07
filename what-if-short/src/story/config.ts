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
	title: 'The Luckiest Human Alive (Short)',
	hero: 'hero',
	counter: {
		label: 'DAY',
		color: '#b6ff1f',
		keys: [
			{line: '001', v: 1},
			{line: '005', off: 0, v: 2, roll: 14},
			{line: '007', off: 0, v: 3, roll: 14},
			{line: '009', off: 20, v: 5, roll: 14},
			{line: '012', off: 0, v: 8, roll: 14},
			{line: '014', off: 80, v: 9, roll: 14},
		],
	},
	bed: 'sfx/bed.wav',
	endCaption: undefined,
};
