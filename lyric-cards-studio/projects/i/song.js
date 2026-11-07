// «И» — kinetic neon lyric video. Each phrase: rows of words [text, start, accent?] + one big object scene.
// Times are seconds in input/song.wav (= the original clip, untrimmed).
const RASP = '#ff2d75', GOLD = '#ffc24a', LIME = '#9dff5c', CYAN = '#5ce1ff', LILAC = '#c08bff', RED = '#ff3b4f';
window.SONG = {
  end: 40.59,
  drop: { from: 19.30, at: 20.34 },          // matches input/make_audio.sh
  dips: [{ from: 29.70, at: 30.0 }],
  sections: [ // background palette by time
    { at: 0, cols: ['#ff2d75', '#7a1cff', '#ff7ab0'] },
    { at: 10.1, cols: ['#ff4f9a', '#5b2bff', '#ff9a5c'] },
    { at: 20.34, cols: ['#ffb02e', '#ff4d2e', '#ffd86b'] },
    { at: 24.7, cols: ['#ff5fb0', '#ffb02e', '#8a3dff'] },
    { at: 27.9, cols: ['#3d7bff', '#5ce1ff', '#c08bff'] },
    { at: 30.0, cols: ['#7a3dff', '#2be3ff', '#ff4fa3'] },
    { at: 37.9, cols: ['#ff2244', '#a0105a', '#ff6a6a'] },
  ],
  phrases: [
    { rows: [[['Эй,', 0.05], ['не', 1.08], ['нужны', 1.16]], [['эти', 1.62], ['цвета', 2.04]], [['малиновые', 2.56, RASP]]], obj: { type: 'swatches', strike: 3.0 } },
    { rows: [[['половина', 3.52, RASP]]], obj: { type: 'halves', join: 4.15 } },
    { rows: [[['Она', 5.20], ['нуждается', 6.06]], [['в', 6.90], ['самом', 7.16]], [['брутальном', 7.50, CYAN]], [['и в самом', 8.12]], [['красивом', 8.72, RASP]]], obj: { type: 'meters', a: 7.50, b: 8.72 } },
    { rows: [[['Не', 10.24], ['без', 11.08]], [['корыстная', 11.26, GOLD]], [['любовь', 12.00, RASP]], [['между', 12.58], ['нами', 12.80]]], obj: { type: 'receipt', stamp: 12.58 } },
    { rows: [[['и', 13.34], ['это', 13.54], ['так', 13.78]], [['мило', 14.10, '#ff9ad5']]], obj: { type: 'cute', at: 13.6 } },
    { rows: [[['Душевная', 15.66, LILAC]], [['музыка,', 16.52, LILAC]], [['всё', 17.22], ['для', 17.42], ['неё', 17.68, RASP]]], obj: { type: 'vinyl', her: 17.68 } },
    { rows: [[['и', 18.16], ['всё', 18.36], ['я', 18.68]], [['осилю', 18.96, GOLD]]], obj: { type: 'power', done: 18.96 } },
    { rows: [[['Ты', 20.34]], [['карамель', 21.20, GOLD]]], obj: { type: 'candy' } },
    { rows: [[['и', 22.18]], [['дикая', 23.50, LIME]], [['трава', 24.04, LIME]]], obj: { type: 'grass', wild: 23.50 } },
    { rows: [[['сладкая', 24.84, '#ff9ad5']], [['на', 26.66], ['вкус', 26.90]]], obj: { type: 'lolli', taste: 26.90 } },
    { rows: [[['улетаю', 27.96, CYAN]], [['как', 28.86], ['всегда', 29.08]]], obj: { type: 'rocket', go: 27.96 } },
    { rows: [[['Не', 30.00], ['понятно', 31.30], ['где', 31.66]], [['мысли', 31.98, LILAC]], [['половины', 34.06, CYAN]]], obj: { type: 'thoughts', merge: 34.06 } },
    { rows: [[['за', 34.94], ['руку', 36.30, RASP]], [['так', 36.84], ['тянет', 37.02, RASP]]], obj: { type: 'hands', pull: 36.30, snap: 37.02 } },
    { rows: [[['завалила', 37.92, RED]], [['вены', 39.34, RED]]], obj: { type: 'ecg', vein: 39.34 } },
  ],
};
