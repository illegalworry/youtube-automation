import React from 'react';
import type {ShotDef} from '../kit/coverage';
import {AS, sc} from './engine2';
import {Burst, Chart, Chips, Coin, Glassy, Heart, Lights, LIME, GOLD, Money, Question, Roulette, Score, Tag, Ticket, Truck} from './gfx';

/* VERTICAL TEASER — "What if you became the luckiest human alive?" (9:16, ~60 s).
   The 16:9 shots are cropped to the centre 607 px column: everything important stays near
   x = 960, hero is big (s 1.25), text is short and stacked in two or three small plaques. */

const H = (x: number, o: Partial<AS> = {}): AS => ({who: 'hero', x, s: 1.25, ...o});
const A = (who: string, x: number, o: Partial<AS> = {}): AS => ({who, x, s: 1.1, ...o});
const mv = (t0: string, t1: string, x1: number, x0?: number) => ({t0, t1, x1, x0});
const T = {size: 40};

const S001 = sc({
	bg: 'void',
	cam: [[960, 600, 1.05], [960, 580, 1.2]],
	badge: 0,
	actors: () => [H(960, {ges: [{g: 'presentF', t0: '001+30', t1: '001e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('001+6')} t1={c.t('001e+10')} x={960} y={205} text="LUCKIEST HUMAN" {...T} />
			<Tag f={c.f} t0={c.t('001+18')} t1={c.t('001e+10')} x={960} y={965} text="ALIVE?" size={52} c={GOLD} />
			<Coin f={c.f} t0={c.t('001+10')} t1={c.t('001e+30')} x={1110} y={760} s={0.9} flips={4} />
		</>
	),
});

const S002 = sc({
	bg: 'street',
	tint: 'gold',
	cam: [[960, 580, 1.05], [960, 570, 1.2]],
	badge: 0,
	actors: () => [H(960, {ges: [{g: 'fist', t0: '002+90', t1: '002e'}]})],
	gfx: (c) => (
		<>
			<Coin f={c.f} t0={c.t('002')} t1={c.t('002+55')} x={960} y={420} s={0.8} />
			<Lights f={c.f} t0={c.t('002+30')} t1={c.t('002+85')} x={960} y={330} n={3} s={0.42} />
			<Ticket f={c.f} t0={c.t('002+70')} t1={c.t('002+118')} x={960} y={400} s={0.55} />
			<Money f={c.f} t0={c.t('002+110')} t1={c.t('002e+10')} x={960} y={900} n={3} s={0.7} />
			<Tag f={c.f} t0={c.t('002+110')} t1={c.t('002e+10')} x={960} y={205} text="ALL YOURS" {...T} />
		</>
	),
});

const S003 = sc({
	bg: 'street',
	whip: true,
	cam: [[960, 580, 1.05], [960, 570, 1.2]],
	badge: 0,
	actors: () => [H(900, {moves: [mv('003+40', '003e', 1020, 900)], ges: [{g: 'wave', t0: '003', t1: '003+35'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('003+6')} t1={c.t('003+45')} x={960} y={205} text="YOU WAKE UP" {...T} />
			<Lights f={c.f} t0={c.t('003+45')} t1={c.t('003e')} x={960} y={330} n={3} s={0.42} />
			<Tag f={c.f} t0={c.t('003+60')} t1={c.t('003e')} x={960} y={205} text="ALL GREEN" {...T} c="#3dff7a" />
		</>
	),
});

const S004 = sc({
	bg: 'street',
	tint: 'day',
	cam: [[960, 570, 1.1], [960, 560, 1.25]],
	badge: 0,
	actors: () => [H(960, {ges: [{g: 'handsOnHead', t0: '004+90', t1: '004e'}], expr: 'wide'})],
	gfx: (c) => (
		<>
			<Ticket f={c.f} t0={c.t('004+10')} t1={c.t('004e')} x={960} y={380} s={0.55} />
			<Tag f={c.f} t0={c.t('004+60')} t1={c.t('004e')} x={960} y={205} text="1 IN 292,000,000" size={36} />
			<Burst f={c.f} t0={c.t('004+100')} x={960} y={400} r={200} />
		</>
	),
});

const S005 = sc({
	bg: 'casino',
	whip: true,
	cam: [[960, 590, 1.05], [960, 580, 1.2]],
	badge: 0,
	actors: () => [H(900, {moves: [mv('005', '005+60', 960, 600)], ges: [{g: 'presentF', t0: '005+70', t1: '005e'}]}), A('dealer', 1230, {facing: -1})],
	gfx: (c) => (
		<>
			<Chips f={c.f} t0={c.t('005+70')} t1={c.t('005e')} x={1090} y={900} s={0.7} n={9} />
			<Tag f={c.f} t0={c.t('005+75')} t1={c.t('005e')} x={960} y={205} text="ALL ON RED" size={44} c="#ff5a5a" />
		</>
	),
});

const S006 = sc({
	bg: 'casino',
	cam: [[960, 600, 1.1], [960, 590, 1.25]],
	badge: 0,
	actors: () => [H(960, {ges: [{g: 'fist', t0: '006+30', t1: '006e'}], expr: 'wide'})],
	gfx: (c) => (
		<>
			<Roulette f={c.f} t0={c.t('006')} t1={c.t('006e')} x={960} y={770} s={0.6} spinEnd={30} />
			<Tag f={c.f} t0={c.t('006+4')} t1={c.t('006+30')} x={960} y={205} text="RED" size={46} c="#ff5a5a" />
			<Tag f={c.f} t0={c.t('006+32')} t1={c.t('006+55')} x={960} y={205} text="AGAIN" size={46} c="#ff5a5a" />
			<Tag f={c.f} t0={c.t('006+56')} t1={c.t('006e')} x={960} y={205} text="RED" size={46} c="#ff5a5a" />
		</>
	),
});

const S007 = sc({
	bg: 'highway',
	whip: true,
	cam: [[960, 590, 1.05], [960, 580, 1.2]],
	badge: 0,
	actors: () => [H(960, {moves: [mv('007+30', '007e', 1160, 760)], facing: 1})],
	gfx: (c) => <Tag f={c.f} t0={c.t('007+60')} t1={c.t('007e')} x={960} y={205} text="WITHOUT LOOKING" {...T} />,
});

const S008 = sc({
	bg: 'highway',
	cam: [[980, 590, 1.05], [980, 580, 1.2]],
	badge: 0,
	actors: () => [H(1090, {facing: 1, expr: 'wide', ges: [{g: 'stop', t0: '008+30', t1: '008e'}]})],
	gfx: (c) => (
		<>
			<Truck f={c.f} t0={c.t('008')} t1={c.t('008e')} stopX={830} from={-300} s={0.85} />
			<Tag f={c.f} t0={c.t('008+40')} t1={c.t('008e')} x={960} y={205} text="AN INCH AWAY" {...T} c={GOLD} />
		</>
	),
});

const S009 = sc({
	bg: 'stadium',
	whip: true,
	cam: [[960, 590, 1.05], [960, 580, 1.2]],
	badge: 0,
	actors: () => [H(960, {expr: 'worried', ges: [{g: 'scratch', t0: '009+40', t1: '009e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('009+10')} t1={c.t('009e')} x={960} y={205} text="SOMETHING STRANGE…" size={38} />
			<Question f={c.f} t0={c.t('009+60')} t1={c.t('009e')} x={1130} y={400} s={0.7} />
		</>
	),
});

const S010 = sc({
	bg: 'stadium',
	tint: 'cheer',
	cam: [[960, 580, 1.05], [960, 570, 1.2]],
	badge: 0,
	actors: () => [H(960)],
	gfx: (c) => (
		<>
			<Score f={c.f} t0={c.t('010')} t1={c.t('010e')} x={960} y={200} s={0.85} a={0} b={3} goalAt={c.t('010+40')} />
			<Burst f={c.f} t0={c.t('010+40')} x={960} y={330} r={240} />
			<Tag f={c.f} t0={c.t('010+30')} t1={c.t('010e')} x={960} y={205} text="LAST SECOND" size={36} c={GOLD} />
		</>
	),
});

const S011 = sc({
	bg: 'stadium',
	tint: 'cheer',
	cam: [[960, 590, 1.1], [960, 580, 1.25]],
	badge: 0,
	actors: () => [H(960, {mouth: 'flat', expr: 'normal'}), A('friend', 1220, {facing: -1, expr: 'wide', ges: [{g: 'handsOnHead', t0: '011+10', t1: '011e'}]})],
	gfx: (c) => <Tag f={c.f} t0={c.t('011+60')} t1={c.t('011e')} x={960} y={205} text="YOU FEEL NOTHING" {...T} c="#9ba58a" />,
});

const S012 = sc({
	bg: 'kitchen',
	whip: true,
	cam: [[960, 600, 1.05], [960, 590, 1.2]],
	badge: 0,
	actors: () => [H(900, {expr: 'sad', ges: [{g: 'think', t0: '012', t1: '012+80'}, {g: 'fist', t0: '012+100', t1: '012e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('012+10')} t1={c.t('012+100')} x={960} y={205} text="ONE BAD DAY" {...T} />
			<Tag f={c.f} t0={c.t('012+104')} t1={c.t('012e')} x={960} y={205} text="PLEASE" size={50} c="#ff9a8a" />
			<Glassy f={c.f} t0={c.t('012+110')} t1={c.t('012e')} fly={[1160, 700]} />
		</>
	),
});

const S013 = sc({
	bg: 'cafe',
	whip: true,
	cam: [[960, 610, 1.1], [960, 600, 1.25]],
	badge: 0,
	actors: () => [H(900, {sit: 810, facing: 1, expr: 'normal'}), A('girl', 1150, {sit: 810, facing: -1, mouth: 'smile', s: 1.25})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('013+6')} t1={c.t('013+100')} x={960} y={205} text="THEN YOU MEET HER" size={34} />
			<Heart f={c.f} t0={c.t('013+40')} t1={c.t('013+105')} x={1030} y={330} s={0.7} />
		</>
	),
});

const S013b = sc({
	bg: 'cafe',
	cam: [[960, 610, 1.2], [960, 600, 1.35]],
	badge: 0,
	actors: () => [H(900, {sit: 810, facing: 1, expr: 'worried'}), A('girl', 1150, {sit: 810, facing: -1, mouth: 'smile', s: 1.25})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('013+112')} t1={c.t('013e')} x={960} y={205} text="YOUR LUCK" {...T} />
			<Tag f={c.f} t0={c.t('013+125')} t1={c.t('013e')} x={960} y={965} text="CAN'T CONTROL HER" size={36} c={GOLD} />
		</>
	),
});

const S014 = sc({
	bg: 'cafe',
	cam: [[960, 600, 1.15], [960, 590, 1.3]],
	badge: 0,
	actors: () => [H(900, {sit: 810, facing: 1, expr: 'sad'}), A('girl', 1150, {sit: 810, facing: -1, mouth: 'flat', s: 1.25})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('014+10')} t1={c.t('014+80')} x={960} y={205} text="DAY NINE" {...T} />
			<Heart f={c.f} t0={c.t('014+60')} t1={c.t('014e')} x={1030} y={330} s={0.7} broken={c.f > c.t('014+90')} />
			<Tag f={c.f} t0={c.t('014+85')} t1={c.t('014e')} x={960} y={205} text="BREAKS THE SYSTEM" size={36} c="#ff9a8a" />
		</>
	),
});

const S015 = sc({
	bg: 'void',
	whip: true,
	cam: [[960, 580, 1.05], [960, 570, 1.2]],
	badge: undefined,
	actors: () => [H(960, {ges: [{g: 'point', t0: '015+20', t1: '015e'}], mouth: 'smile'})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('015+6')} t1={c.t('015e')} x={960} y={205} text="FULL VIDEO" {...T} c={LIME} />
			<Tag f={c.f} t0={c.t('015+22')} t1={c.t('015e')} x={960} y={965} text="ON MY CHANNEL" size={36} />
		</>
	),
});

const S016 = sc({
	bg: 'void',
	cam: [[960, 580, 1.1], [960, 570, 1.25]],
	actors: () => [H(960, {ges: [{g: 'presentF', t0: '016+10', t1: '016e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('016+4')} t1={c.t('016e+40')} x={960} y={200} text="WHAT IF YOU WERE" size={34} />
			<Tag f={c.f} t0={c.t('016+22')} t1={c.t('016e+40')} x={960} y={885} text="THE LUCKIEST" size={44} c={GOLD} />
			<Tag f={c.f} t0={c.t('016+40')} t1={c.t('016e+40')} x={960} y={965} text="HUMAN ALIVE?" size={44} c={GOLD} />
		</>
	),
});

export const SHOTS: ShotDef[] = [
	{at: '001', C: S001},
	{at: '002', C: S002},
	{at: '003', C: S003, whip: true},
	{at: '004', C: S004},
	{at: '005', C: S005, whip: true},
	{at: '006', C: S006},
	{at: '007', C: S007, whip: true},
	{at: '008', C: S008},
	{at: '009', C: S009, whip: true},
	{at: '010', C: S010},
	{at: '011', C: S011},
	{at: '012', C: S012, whip: true},
	{at: '013', C: S013, whip: true},
	{at: '013', off: 100, C: S013b},
	{at: '014', C: S014},
	{at: '015', C: S015, whip: true},
	{at: '016', C: S016},
];
