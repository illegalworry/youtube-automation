// cast.js — one outfit per recurring character. Each has ONE signature colour (hoodie) + one head item, kept all video.
export const MAX = { top: 'hoodie', color: '#3f9a5a', pants: '#24272e' };                                    // green hoodie, no hat (hero)
export const JAY = { top: 'hoodie', color: '#b8bcc2', head: 'cap', headColor: '#f08a2c', pants: '#2c3a5a' }; // grey hoodie, orange cap
export const LEO = { top: 'hoodie', color: '#d6533c', head: 'capBack', headColor: '#3a6ee0', pants: '#2c4a8a', kid: true }; // little brother
export const ZOE = { top: 'hoodie', color: '#e8c04a', head: 'afro' };
export const SAM = { top: 'hoodie', color: '#5bb4c8', head: 'headband', headColor: '#e0503a', pants: '#4a3a2c' };
export const MIA = { top: 'hoodie', color: '#9a5ad0', head: 'bun' };
export const RIVAL = { top: 'hoodie', color: '#9a5ad0', head: 'headgear', headColor: '#d63a32', gloves: '#d63a32' };
export const MAX_BOXING = { ...MAX, gloves: '#3f63c8' };
