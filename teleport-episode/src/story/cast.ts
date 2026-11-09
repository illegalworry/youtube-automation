import type {Base} from '../kit/actions';

/* Characters of "What if you could teleport?". The hero is the channel character:
   black glossy head, flat-topped half-oval eyes with a lime sparkle, wide smile, lime hoodie. */
export type CastMember = Base & {sp?: string};

export const LIME = '#b8f224';

export const CAST: Record<string, CastMember> = {
	hero: {color: LIME, eyes: 'half', spark: LIME, gloss: true, mouth: 'smile', rim: '#efffc8', rimW: 2.4, shoe: '#f4f4f0'},
	sam: {color: '#f08a3c', hair: 'cap', hairColor: '#2f6fd8', rim: '#ffe6cc', rimW: 2.4, shoe: '#f2f2f2'},
	janitor: {color: '#4f6b8a', outfit: 'coat', hair: 'cap', hairColor: '#2c3e57', acc: ['mustache'], rim: '#e0ecff', rimW: 2.4, shoe: '#222'},
	pizza: {color: '#d94a3a', outfit: 'apron', hair: 'short', acc: ['mustache'], rim: '#ffe0d6', rimW: 2.4, shoe: '#222'},
	teacher: {color: '#8e3a4f', outfit: 'suit', hair: 'bun', acc: ['glasses'], rim: '#ffe6d6', rimW: 2.4, shoe: '#2b1d24'},
	hale: {color: '#5d6472', outfit: 'suit', hair: 'bob', rim: '#e8ecf4', rimW: 2.4, shoe: '#15161a'},
	grandma: {color: '#b48ad8', outfit: 'gown', hair: 'grey', hairColor: '#eceef4', acc: ['glasses'], rim: '#f6ecff', rimW: 2.4, shoe: '#6a4a8a', sp: 'GRANDMA'},
	nurse: {color: '#5cc8b6', outfit: 'coat', hair: 'ponytail', hairColor: '#2c6f66', rim: '#e0fff8', rimW: 2.4, shoe: '#f2f2f2'},
	mom: {color: '#7a5cc4', hair: 'bob', rim: '#ffe6c8', rimW: 2.4, shoe: '#2c2540'},
	oldman: {color: '#e7d3a8', outfit: 'tee', hair: 'grey', hairColor: '#f0f0f0', acc: ['mustache'], rim: '#fff4dc', rimW: 2.4, shoe: '#3a2a1a'},
	stranger: {color: '#8d93a3', hair: 'ponytail', hairColor: '#1b1b22', rim: '#e8ecff', rimW: 2.4, shoe: '#4a5a6a'},
	kid: {color: '#e23b3b', hair: 'ponytail', hairColor: '#ffd34a', rim: '#ffe0e0', rimW: 2.4, shoe: '#f2f2f2'},
	dad: {color: '#2f6fd8', hair: 'short', rim: '#e0ecff', rimW: 2.4, shoe: '#222'},
	woman: {color: '#3aa37a', hair: 'bob', rim: '#e0fff0', rimW: 2.4, shoe: '#222'},
	carman: {color: '#9aa3b5', outfit: 'tee', hair: 'grey', hairColor: '#dcdcdc', acc: ['glasses'], rim: '#eef4ff', rimW: 2.4, shoe: '#222'},
	anchor: {color: '#24305a', outfit: 'suit', hair: 'short', rim: '#e0e8ff', rimW: 2.4, shoe: '#111'},
	girlpro: {color: '#e86aa0', hair: 'ponytail', hairColor: '#6a3a1a', rim: '#ffe6f0', rimW: 2.4, shoe: '#f2f2f2'},
	boyfriend: {color: '#3a4256', outfit: 'suit', hair: 'short', rim: '#e6ecff', rimW: 2.4, shoe: '#111'},
};
