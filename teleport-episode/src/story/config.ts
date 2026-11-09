/* Story-level settings for "What if you could teleport?" */
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
	title: 'What if you could teleport?',
	hero: 'hero',
	bed: 'sfx/bed.wav',
	endCaption: ['WOULD YOU JUMP?', 'PART 2 IS COMING'],
};
