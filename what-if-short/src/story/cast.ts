import type {Base} from '../kit/actions';

/* Characters of this video. The hero is the black-headed, glossy character in a lime
   hoodie with white drawstrings, half-lidded eyes and a small smile. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	hero: {color: '#b6ff1f', hair: 'none', rim: '#e6ff9a', rimW: 2.4, gloss: true, mouth: 'smile', lidL: 0.22, lidR: 0.22, shoe: '#f2f2f2'},
	friend: {color: '#ff6a5a', hair: 'cap', hairColor: '#2f6fd8', rim: '#ffe0c8', rimW: 2.4, shoe: '#f2f2f2'},
	girl: {color: '#8b5cf6', hair: 'ponytail', hairColor: '#ffd34a', rim: '#efe2ff', rimW: 2.4, shoe: '#efe2ff'},
	mom: {color: '#7a5cc4', hair: 'bob', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540'},
	dad: {color: '#3a7ad8', outfit: 'tee', hair: 'short', acc: ['mustache'], rim: '#e6f0ff', rimW: 2.4, shoe: '#2b2f3a'},
	grandma: {color: '#c9a0d8', hair: 'bun', acc: ['glasses'], rim: '#fff0ff', rimW: 2.4, shoe: '#4a3a50'},
	dealer: {color: '#2a2a34', outfit: 'suit', hair: 'none', rim: '#ffd9d9', rimW: 2.4, shoe: '#111'},
	suit: {color: '#3a4256', outfit: 'suit', hair: 'cap', hairColor: '#28304a', acc: ['mustache'], rim: '#e6ecff', rimW: 2.4, shoe: '#111'},
	seller: {color: '#3aa37a', outfit: 'apron', hair: 'bun', rim: '#e8fff2', rimW: 2.4, shoe: '#1d2b24'},
	teacher: {color: '#8e3a4f', outfit: 'suit', hair: 'bun', acc: ['glasses'], rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24'},
	stranger: {color: '#f2b21c', hair: 'spiky', hairColor: '#222', rim: '#fff0cc', rimW: 2.4, shoe: '#f2f2f2'},
	biker: {color: '#ff9a3a', hair: 'cap', hairColor: '#222', rim: '#fff0cc', rimW: 2.4, shoe: '#222'},
};
