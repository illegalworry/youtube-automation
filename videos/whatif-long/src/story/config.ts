/* Story-level settings for this video. */
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
	title: 'What if you could see everyone’s death date?',
	hero: 'hero',
	bed: 'sfx/bed.wav',
	endCaption: ['WHOSE DATE WOULD YOU WANT TO SEE?', 'TELL ME IN THE COMMENTS'],
};
