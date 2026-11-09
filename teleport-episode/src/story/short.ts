import type React from 'react';

/* How the vertical version is made.
   crop  — shorts-only video: Short = the same shots as Long, cropped to 9:16 around
           ShotDef.focus — an x on the SCREEN after the shot camera (default 960 = centre,
           where the shot camera already puts the hero/speaker). The 9:16 window shows only
           ~607 px of the 1920 width (960 ± 300): keep faces, hands, badges inside it.
           Cards/charts get a native vertical ShotDef.V (Board vertical, Split vertical).
   recut — "long + short": the short has its own (shorter) script and voice
           (short-lines.json -> short-timeline.json); each short line is laid over a stretch
           of a long shot. Segment fields:
             line  short line id prefix ('s04'); at = start this many frames INTO the line
             ep    long line id prefix whose shot is played; off = frames into it
             cont  continue the previous segment's footage; hold = freeze on the shot's last frame
             a, b  9:16 crop at segment start / end: {cx, cy, z}
             C     a native vertical card instead of long footage */
export type Fx = 'whip' | 'punch' | 'shake' | 'flash' | 'pop';
export type Seg = {
	line: string;
	at?: number;
	ep?: string;
	off?: number;
	cont?: boolean;
	hold?: boolean;
	a?: {cx?: number; cy?: number; z?: number};
	b?: {cx?: number; cy?: number; z?: number};
	C?: React.FC<{f: number; dur: number}>;
	fx?: Fx[];
	/* extra in-segment hits: frames from segment start */
	hits?: {at: number; fx: Fx}[];
};

const S = (line: string, ep: string, off: number, a: Seg['a'], b: Seg['b'], fx: Fx[] = ['punch'], at?: number, hits?: Seg['hits']): Seg => ({line, ep, off, a, b, fx, at, hits});
const Z = (z: number, cx = 960, cy = 540) => ({z, cx, cy});

export const SHORT: {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string; end?: string[]; endFrom?: string; subs?: boolean} = {
	mode: 'recut',
	hook: ['WHAT IF', 'YOU COULD TELEPORT?'],
	bed: 'sfx/short-bed.wav',
	end: ['FULL VIDEO', 'ON MY CHANNEL'],
	endFrom: 's20',
	subs: true,
	segs: [
		S('s01', '001', 0, Z(1.0), Z(1.35), []),
		S('s02', '003', 11, Z(1.25), Z(1.0), ['whip']),
		S('s03', '003', 47, Z(1.0, 820), Z(1.2, 860), ['punch']),
		S('s03', '004', 16, Z(1.3, 960, 640), Z(1.6, 960, 760), ['punch'], 70),
		S('s04', '005', 0, Z(1.0), Z(1.35, 960, 470), ['whip']),
		S('s05', '005', 118, Z(1.2), Z(1.0), ['flash', 'shake']),
		S('s06', '006', 0, Z(1.0), Z(1.25), ['whip']),
		S('s07', '007', 42, Z(1.35, 960, 500), Z(1.1), ['punch']),
		S('s08', '008', 0, Z(1.0), Z(1.3), ['whip'], undefined, [{at: 34, fx: 'shake'}]),
		S('s09', '012', 0, Z(1.4, 960, 480), Z(1.15), ['punch']),
		S('s10', '021', 0, Z(1.0), Z(1.3), ['whip', 'flash']),
		S('s11', '052', 0, Z(1.6, 960, 640), Z(1.45, 960, 620), ['punch']),
		S('s12', '052', 53, Z(1.45, 960, 620), Z(1.65, 960, 650), ['punch']),
		S('s13', '053', 0, Z(1.45, 960, 600), Z(1.6, 960, 620), ['whip']),
		S('s13', '054', 93, Z(1.25, 1450, 560), Z(1.1, 1450, 540), ['punch'], 38),
		S('s14', '057', 60, Z(1.25, 1480, 560), Z(1.1, 1450, 540), ['whip']),
		S('s14', '094', 20, Z(1.0), Z(1.25), ['whip'], 106),
		S('s14', '061', 97, Z(1.0, 1550, 600), Z(1.15, 1550, 620), ['shake', 'flash'], 160),
		S('s15', '062', 0, Z(1.0), Z(1.25), ['whip']),
		S('s15', '066', 0, Z(1.1, 780, 500), Z(1.0, 800, 520), ['punch'], 104),
		S('s15', '067', 66, Z(1.0, 760), Z(1.2, 760), ['pop'], 118),
		S('s15', '078', 15, Z(1.2), Z(1.0), ['whip'], 150),
		S('s15', '080', 22, Z(1.0), Z(1.3), ['punch'], 186),
		S('s16', '131', 0, Z(1.0), Z(1.25), ['whip', 'flash']),
		S('s16', '130', 50, Z(1.3), Z(1.0), ['punch'], 70, [{at: 6, fx: 'shake'}]),
		S('s17', '141', 0, Z(1.0), Z(1.3), ['whip'], undefined, [{at: 82, fx: 'shake'}]),
		S('s17', '142', 0, Z(1.35, 960, 480), Z(1.1), ['punch'], 92),
		S('s18', '144', 0, Z(1.2, 960, 700), Z(1.45, 960, 720), ['punch']),
		S('s19', '150', 20, Z(1.0, 560), Z(1.15, 600), ['whip']),
		S('s19', '019', 58, Z(1.2, 1500), Z(1.0, 1500), ['punch'], 40),
		S('s19', '020', 40, Z(1.0, 1450), Z(1.25, 1500), ['flash'], 104),
		{...S('s20', '021', 30, Z(1.4, 960, 610), Z(1.6, 960, 640), ['whip']), hold: true},
	],
};
