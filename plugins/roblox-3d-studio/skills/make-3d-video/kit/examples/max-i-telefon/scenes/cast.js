// scenes/cast.js — the characters of "Макс и украденный телефон"
import { defineCast } from '/engine/director.js';
defineCast({
  max:   { skin: '#f5cd30', face: 'smile', shirt: { color: '#2d7be0', style: 'hoodie', print: '★' }, pants: { color: '#2b2f3a', shoes: '#1d1d1f' }, hair: { style: 'spiky', color: '#3a2312' } },
  lily:  { skin: '#f2d3b0', face: 'happy', shirt: { color: '#ff66cc', style: 'tshirt', print: '♥' }, pants: { style: 'skirt', color: '#9a5aff', shoes: '#ffffff' }, hair: { style: 'ponytail', color: '#f2c14e' }, acc: ['backpack'], blush: true },
  bacon: { skin: '#f5cd30', face: 'smug', shirt: { color: '#4b974b', style: 'plain' }, pants: { color: '#1b4a9a', shoes: '#1d1d1f' }, hair: { style: 'curly', color: '#b5523b' } },
});
