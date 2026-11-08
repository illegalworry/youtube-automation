import type {Base} from '../kit/actions';

/* Characters of "What if you could see everyone's death date". Nobody but the narrator
   speaks, so `sp` is never used for lip flap; the hero is "you" (yellow, no visible date). */
export type CastMember = Base & {sp?: string};

const R = {rimW: 2.4};
export const CAST: Record<string, CastMember> = {
	hero: {color: '#f2b21c', hair: 'short', rim: '#fff0cc', ...R},
	friend: {color: '#d94a3a', hair: 'cap', hairColor: '#2f6fd8', rim: '#ffe0c8', shoe: '#f2f2f2', ...R},
	mom: {color: '#7a5cc4', hair: 'bob', rim: '#ffe6c8', shoe: '#2c2540', ...R},
	boss: {color: '#3a4256', outfit: 'suit', hair: 'short', acc: ['glasses'], rim: '#e6ecff', shoe: '#111', ...R},
	nurse: {color: '#4fb3a9', outfit: 'coat', hair: 'bun', rim: '#e0fff8', shoe: '#eef3f2', ...R},
	colleague: {color: '#5a8fd8', outfit: 'coat', hair: 'short', rim: '#e6f0ff', shoe: '#2c3a40', ...R},
	patient: {color: '#a9c2d8', outfit: 'gown', hair: 'grey', rim: '#eef4ff', shoe: '#a9c2d8', ...R},
	doctor: {color: '#eef3f2', outfit: 'coat', hair: 'short', acc: ['glasses'], rim: '#d8fff2', shoe: '#2c3a40', ...R},
	scientist: {color: '#eef3f2', outfit: 'coat', hair: 'ponytail', hairColor: '#3aa37a', acc: ['glasses'], rim: '#d8fff2', shoe: '#2c3a40', ...R},
	leader: {color: '#2b2f3a', outfit: 'suit', hair: 'grey', rim: '#e6ecff', shoe: '#111', ...R},
	banker: {color: '#3aa37a', outfit: 'suit', hair: 'short', acc: ['mustache'], rim: '#e8fff2', shoe: '#1d2b24', ...R},
	client: {color: '#e8743a', hair: 'spiky', rim: '#ffe6d6', shoe: '#2b1d24', ...R},
	soldier: {color: '#5d6b3a', hair: 'cap', hairColor: '#4a5530', rim: '#eef4d8', shoe: '#1d1f14', ...R},
	wife: {color: '#e86aa0', hair: 'ponytail', hairColor: '#e86aa0', rim: '#ffe0ee', shoe: '#2c2540', ...R},
	husband: {color: '#2f6fd8', hair: 'short', rim: '#e0ecff', shoe: '#1b2540', ...R},
	dad: {color: '#3aa37a', hair: 'short', acc: ['glasses'], rim: '#e8fff2', shoe: '#1d2b24', ...R},
	seeker: {color: '#ff5a3a', hair: 'spiky', acc: ['headphones'], rim: '#ffe6d6', shoe: '#f2f2f2', ...R},
	spy: {color: '#1d2030', outfit: 'coat', hair: 'cap', hairColor: '#1d2030', rim: '#c8d0ff', shoe: '#111', ...R},
	general: {color: '#4a5530', outfit: 'suit', hair: 'grey', acc: ['mustache'], rim: '#eef4d8', shoe: '#111', ...R},
	girl: {color: '#8b5cf6', hair: 'ponytail', hairColor: '#ffd34a', rim: '#efe2ff', shoe: '#efe2ff', ...R},
	teacher: {color: '#8e3a4f', outfit: 'suit', hair: 'bun', acc: ['glasses'], rim: '#ffe6d6', shoe: '#2b1d24', ...R},
	grandpa: {color: '#6b7f8e', outfit: 'tee', hair: 'grey', acc: ['glasses'], rim: '#eef4ff', shoe: '#2b2f3a', ...R},
	grandma: {color: '#c48a5a', outfit: 'gown', hair: 'grey', rim: '#fff0e0', shoe: '#2b2f3a', ...R},
	stranger: {color: '#3a9ad9', outfit: 'coat', hair: 'short', rim: '#e0f2ff', shoe: '#1b2540', ...R},
	preacher: {color: '#f2f2f2', outfit: 'gown', hair: 'grey', rim: '#fff8e0', shoe: '#c9a24a', ...R},
};
