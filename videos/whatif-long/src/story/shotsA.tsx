/* Shots 001–132: the hook, day one, money, class, love, babies, hospitals, testing the rule. */
import React from 'react';
import {interpolate, spring} from 'remotion';
import {useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Callout, Caption, Split} from '../kit/graphics';
import {Accent, Bubble, FONT, RuleCard} from '../kit/ui';
import {Corridor, HallBack} from '../kit/sets';
import {Chair} from '../engine/props';
import {board, fakeDate, scene, SPIKE, type Ctx, type When} from './scene';
import {
	Baby, Bed, Bridge, City, Crib, DateTag, DeskFront, Hospital, Icon, Lab, Mirror, Nursery, Office, Paper, RoadBand, RollNumber, Room, SimpleCar, Tile, Title, Truck, WarRoom, WorldShapes, tagY,
} from './places';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const acc = (c: Ctx, w: When, text: string, dur = 80, y = 880, sub?: string) => <Accent text={text} t={c.f - c.w(w)} dur={dur} y={y} sub={sub} />;

/* a rule card on the shot timeline */
const rule = (title: string, text: string, strikeAt?: string, fix?: string): React.FC => {
	const C: React.FC = () => {
		const {f, at} = useShot();
		const strike = strikeAt ? interpolate(f, [at(strikeAt), at(strikeAt) + 14], [0, 1], cl) : 0;
		return <RuleCard n="" title={title} text={text} t={f} strike={strike} fix={fix} />;
	};
	return C;
};

/* hero thinking close-up with a thought bubble */
const think = (text: string, bg: 'day' | 'night', at: string) =>
	scene({
		set: (c) => <City f={c.gf} night={bg === 'night'} />,
		setDepth: 1.8,
		cam: [960, 560, 1.75],
		cam2: [930, 540, 1.95],
		actors: [{who: 'hero', x: 900, facing: 1, gest: [['think', at, 9999]], look: [0.6, -0.6], expr: [[at, 'worried']], tag: '?? ??? ????', glitch: true}],
		front: (c) => {
			const words = text.split(' ');
			const half = Math.ceil(words.length / 2);
			const l1 = words.slice(0, half).join(' ');
			const l2 = words.slice(half).join(' ');
			return (
				<Bubble x={1110} y={330} w={Math.max(l1.length, l2.length) * 24 + 70} h={150} t={c.f - 10} tail={[-160, 120]} thought>
					<text y={-8} textAnchor="middle" fontSize={38} fontFamily={FONT} fontWeight={800} fill="#1b1e2a">
						{l1}
					</text>
					<text y={38} textAnchor="middle" fontSize={38} fontFamily={FONT} fontWeight={800} fill="#1b1e2a">
						{l2}
					</text>
				</Bubble>
			);
		},
	});

/* phone in screen-space (svg group) */
const Phone: React.FC<{x: number; y: number; s?: number; children: React.ReactNode; title?: string; c?: string}> = ({x, y, s = 1, children, title, c = '#e86aa0'}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-250} y={-450} width={500} height={900} rx={60} fill="#15171f" />
		<rect x={-232} y={-430} width={464} height={860} rx={44} fill="#f4f1fa" />
		<rect x={-232} y={-430} width={464} height={100} rx={44} fill={c} />
		<rect x={-232} y={-380} width={464} height={50} fill={c} />
		{title ? (
			<text y={-362} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#fff">
				{title}
			</text>
		) : null}
		{children}
	</g>
);

/* ================================ HOOK ================================== */
const S001 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.05],
	keys: [
		['002', [1140, 500, 1.55]],
		[['003', 110], [1050, 520, 1.3]],
	],
	actors: [
		{who: 'hero', x: 780, facing: 1, enter: ['001', 50, -200], gest: [['point', ['001', 50], 60]], handF: 'point', look: [0.8, 0]},
		{who: 'friend', x: 1150, facing: -1, look: [-0.7, 0], tag: 'OCT 14 2058', tagOn: ['002', 25], expr: [['003', 'worried']]},
	],
	front: (c) => (!c.short ? <Callout f={c.f} t0={c.w(['003', 110])} t1={c.w(['003', 200])} from={[1150, tagY(900, 1) - 10]} to={[1450, 300]} text="THE DAY THEY DIE" c="#ff6a5a" /> : null),
	screen: (c) => <>{acc(c, ['003', 0], 'NOT AGE · NOT WEIGHT', 100, 860)}</>,
});

const S004 = scene({
	set: (c) => <City f={c.gf} dawn />,
	cam: [960, 540, 1.0],
	keys: [['005', [960, 560, 1.15]]],
	crowd: [{n: 9, x0: -100, x1: 2020, floor: 860, s: 0.72, seed: 'wake', tags: true, tagOn: ['004', 40], stagger: 60, depth: 1.25}],
	back: () => (
		<g>
			{/* stroller */}
			<rect x={1330} y={760} width={170} height={80} rx={30} fill="#2f6fd8" />
			<path d="M1330,780 Q1330,700 1420,700 L1420,780 Z" fill="#24509a" />
			<circle cx={1355} cy={870} r={24} fill="#141826" />
			<circle cx={1475} cy={870} r={24} fill="#141826" />
			<line x1={1500} y1={770} x2={1560} y2={690} stroke="#141826" strokeWidth={8} />
		</g>
	),
	actors: [
		{who: 'mom', x: 560, facing: 1, tag: 'MAY 2 2064', tagOn: ['005', 2], gest: [['wave', ['005', 0], 40]]},
		{who: 'boss', x: 950, facing: 1, tag: 'JAN 19 2049', tagOn: ['005', 30], gest: [['armsCrossed', ['005', 30], 80]]},
		{who: 'stranger', x: 1620, facing: -1, s: 0.98, look: [-0.6, 0.3]},
	],
	front: (c) => (
		<g>
			<Baby x={1400} y={760} s={0.9} f={c.gf} />
			<DateTag x={1400} y={650} text="AUG 3 2117" f={c.f} on={c.w(['005', 70])} s={0.8} />
		</g>
	),
});

const S006 = scene({
	set: (c) => <City f={c.gf} dawn />,
	setDepth: 1.9,
	cam: [960, 520, 1.9],
	cam2: [960, 470, 2.1],
	actors: [{who: 'hero', x: 960, facing: 1, faceTurn: 0.1, look: [0, -1], expr: [['007', 'worried']], gest: [['shrug', ['007', 20], 60]], tag: '?? ??? ????', glitch: true, tagOn: ['006', 4]}],
	screen: (c) => acc(c, ['007', 10], "YOU CAN'T SEE YOUR OWN", 70, 900),
});

const S008 = board((c) => {
	const big = c.f >= c.w('011');
	const fade = interpolate(c.f, [c.w('011'), c.w('011') + 12], [1, 0], cl);
	return (
		<g>
			<g opacity={fade}>
				<Tile x={420} y={520} t={c.f - c.w('008')} label="ECONOMY COLLAPSES" icon={<Icon n="chartDown" />} c="#ff6a5a" />
				<text x={420} y={260} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={c.f >= c.w('008') ? 1 : 0}>
					WEEK 1
				</text>
				<Tile x={960} y={520} t={c.f - c.w('009')} label="A NEW RELIGION" icon={<Icon n="temple" c="#ffc94a" />} c="#ffc94a" />
				<text x={960} y={260} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={c.f >= c.w('009') ? 1 : 0}>
					MONTH 1
				</text>
				<Tile x={1500} y={520} t={c.f - c.w('010')} label="SOMETHING TERRIFYING" icon={<text y={60} textAnchor="middle" fontSize={200} fontFamily={FONT} fontWeight={900} fill="#d8a8ff">?</text>} c="#d8a8ff" />
				<text x={1500} y={260} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#ffc94a" opacity={c.f >= c.w('010') ? 1 : 0}>
					YEAR 1
				</text>
			</g>
			{big ? (
				<g>
					<RollNumber x={960} y={520} f={c.f} t0={c.w('011')} t1={c.w('011') + 40} from={0} to={2000000000} size={170} />
					<Title x={960} y={660} t={c.f - c.w(['011', 30])} text="NUMBERS SHOW THE SAME DATE" size={54} c="#aab3d6" />
					<DateTag x={960} y={820} text={SPIKE} f={c.f} on={c.w(['011', 60])} s={1.8} c="#ff8a8a" />
				</g>
			) : null}
		</g>
	);
});

const S012 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [960, 600, 1.0],
	cam2: [960, 560, 1.12],
	crowd: [
		{n: 12, x0: -150, x1: 2070, floor: 880, s: 0.62, seed: 'tn', tags: true, depth: 1.3},
		{n: 6, x0: 100, x1: 1820, floor: 960, s: 0.9, seed: 'tn2', tags: true, depth: 1.05, mode: 'walk', dir: 1, speed: 1.2},
	],
	screen: (c) => (
		<>
			<Caption f={c.f} from={c.w(['012', 10])} to={c.w(['013', 70])} top={200} lines={['WHAT IF EVERYONE COULD SEE', 'THEIR DEATH DATE?']} size={78} />
		</>
	),
});

/* ============================== DAY ONE ================================= */
const S014 = scene({
	set: (c) => <City f={c.gf} dawn />,
	cam: [960, 480, 1.0],
	cam2: [1100, 560, 1.15],
	screen: (c) => (
		<>
			<Caption f={c.f} from={4} to={c.dur} top={340} lines={['6:14 AM', 'TOKYO']} size={110} />
		</>
	),
});

const S015 = scene({
	set: (c) => <Room f={c.gf} wall="#4fa39a" night />,
	cam: [980, 560, 1.15],
	keys: [
		[['016', 30], [1180, 470, 1.7]],
		['018', [820, 560, 1.9]],
		['019', [1150, 480, 1.75]],
	],
	actors: [
		{
			who: 'nurse',
			x: 820,
			facing: 1,
			look: [0.4, 0.3],
			expr: [['016', 'wide']],
			blink: ['018', ['018', 9]],
			pose: (c, p) => ({...p, armF: [60, 110], head: p.head + (c.f > c.w('016') ? -10 : 8)}),
			handItem: (
				<g>
					<rect x={-14} y={-26} width={28} height={34} rx={5} fill="#fbf8ef" />
					<path d="M14,-18 q14,6 0,16" stroke="#fbf8ef" strokeWidth={5} fill="none" />
				</g>
			),
		},
		{who: 'colleague', x: 1180, facing: -1, look: [-0.6, 0], tag: 'MAR 11 2061', tagOn: ['016', 40]},
	],
	front: () => <DeskFront x={1000} w={700} c="#6a8a88" y={790} />,
	screen: (c) => acc(c, ['019', 0], "IT'S STILL THERE", 60, 900),
});

const S020 = scene({
	set: (c) => <Hospital f={c.gf} night beds={2} />,
	cam: [1000, 560, 1.05],
	keys: [['021', [700, 560, 1.55]]],
	actors: [
		{who: 'nurse', x: 1240, facing: -1, enter: ['020', 40, 1500], look: [-0.7, 0.3], expr: [['021', 'worried']]},
		{who: 'patient', x: 980, s: 1, lie: 690, tag: 'TODAY', tagOn: ['021', 20], tagC: '#ff8a7a'},
	],
});

const S022 = board((c) => (
	<g>
		<WorldShapes x={360} y={200} w={1200} h={600} c="#2a6a9a" hot={interpolate(c.f, [10, c.dur - 10], [0, 1], cl)} hotC="#ffffff" />
		<Title x={960} y={960} t={c.f - 20} text="EVERY CONTINENT · WITHIN AN HOUR" size={56} c="#ffc94a" />
	</g>
));

const S023 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.0],
	cam2: [900, 540, 1.2],
	crowd: [
		{n: 10, x0: -200, x1: 2100, floor: 870, s: 0.7, seed: 'ev', tags: true, depth: 1.25, mode: 'walk', dir: -1, speed: 1.4},
	],
	actors: [
		{who: 'friend', x: 720, facing: 1, tag: 'JUN 30 2071', gest: [['point', '023', 80]], handF: 'point', look: [0.7, -0.4]},
		{who: 'stranger', x: 1180, facing: -1, tag: 'FEB 8 2044', gest: [['handsOnHead', '024', 60]], expr: [['024', 'wide']], look: [-0.5, -0.8]},
	],
});

const S025 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [960, 600, 1.15],
	keys: [
		['026', [1200, 560, 1.45]],
		['027', [960, 520, 1.5]],
	],
	actors: [
		{who: 'stranger', x: 960, facing: 1, tag: 'APR 22 2052', look: [0, -0.8], gest: [['handsOnHead', '027', 70], ['stop', ['027', 75], 60]], expr: [['027', 'worried']]},
		{
			who: 'friend',
			x: 1320,
			facing: -1,
			pose: (c, p) => ({...p, armF: [100, 30]}),
			handItem: (
				<g transform="rotate(10)">
					<rect x={-30} y={-50} width={60} height={100} rx={10} fill="#15171f" />
					<rect x={-24} y={-42} width={48} height={84} rx={6} fill="#5ad8ff" />
				</g>
			),
		},
	],
	back: () => (
		<g>
			<rect x={640} y={420} width={14} height={480} fill="#2a2f50" />
			<ellipse cx={700} cy={420} rx={70} ry={20} fill="#ffe8a0" />
			<path d="M640,430 L460,900 L940,900 L760,430 Z" fill="#ffe8a0" opacity={0.12} />
		</g>
	),
	front: (c) => (
		<g>
			{/* phone screen view: the person, but no number */}
			{c.f >= c.w('026') ? (
				<g transform={`translate(1420,330) scale(${spring({frame: c.f - c.w('026'), fps: 30, config: {damping: 14}})})`}>
					<rect x={-120} y={-170} width={240} height={340} rx={20} fill="#15171f" />
					<rect x={-104} y={-154} width={208} height={308} rx={12} fill="#2a3a6a" />
					<circle cx={0} cy={-20} r={40} fill="#000" />
					<rect x={-40} y={20} width={80} height={110} rx={20} fill="#3a9ad9" />
					<text y={-100} textAnchor="middle" fontSize={26} fontFamily={FONT} fontWeight={800} fill="#ff6a5a">
						NO NUMBER
					</text>
				</g>
			) : null}
			{/* hat over the head, tag still above it */}
			{c.f >= c.w('027') ? (
				<g transform={`translate(960,${interpolate(c.f, [c.w('027'), c.w('027') + 14], [300, 455], cl)})`}>
					<rect x={-48} y={-64} width={96} height={70} rx={8} fill="#2b1d24" />
					<rect x={-80} y={0} width={160} height={16} rx={8} fill="#2b1d24" />
				</g>
			) : null}
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '025', 'NO SHADOW', 55)}
			{acc(c, '026', 'NOT ON CAMERA', 50)}
			{acc(c, ['027', 20], "CAN'T COVER IT", 60)}
		</>
	),
});

const S028 = rule('THE RULE', "You can see everyone's date — except your own");

const S029 = scene({
	set: (c) => <Room f={c.gf} wall="#7cc4bc" window={false} floor="#e9f4f1" />,
	cam: [1060, 560, 1.2],
	cam2: [1200, 520, 1.45],
	back: (c) => (
		<g>
			<Mirror x={1060} y={260} w={520} h={560} />
			<clipPath id="mir29">
				<rect x={1060} y={260} width={520} height={560} rx={8} />
			</clipPath>
			<g clipPath="url(#mir29)" opacity={0.9}>
				<DateTag x={1440} y={tagY(900, 0.9) - 20} text="DEC 1 2066" f={c.f} s={0.85} />
			</g>
		</g>
	),
	actors: [
		{who: 'friend', x: 1440, s: 0.9, floor: 880, facing: -1, look: [-0.5, 0], tag: 'DEC 1 2066'},
		{who: 'hero', x: 820, facing: 1, look: [0.9, -0.4], expr: [['029', 'worried']], gest: [['touchFace', ['029', 20], 70]], armOver: ['029', 20]},
		{who: 'hero', x: 1240, facing: -1, s: 0.98, look: [-0.9, -0.4], faceTurn: 0.2, expr: [['029', 'worried']]},
	],
	screen: (c) => acc(c, ['029', 30], 'EXCEPT YOUR OWN', 70, 900),
});

const S030 = scene({
	set: (c) => <WarRoom f={c.gf} alarm={c.f > c.w('031')} />,
	cam: [960, 560, 1.0],
	cam2: [960, 600, 1.15],
	actors: [
		{who: 'leader', x: 620, facing: 1, tag: 'JUL 7 2039', gest: [['rubChin', '030', 70]]},
		{who: 'general', x: 900, facing: 1, tag: 'NOV 30 2045', gest: [['armsCrossed', '031', 70]]},
		{who: 'boss', x: 1200, facing: -1, tag: 'MAR 2 2058', gest: [['point', '031', 50]], handF: 'point'},
		{who: 'leader', x: 1460, facing: -1, s: 0.98, tag: 'AUG 16 2041', gest: [['handsOnHead', ['030', 40], 50]]},
	],
	front: () => <DeskFront x={1040} w={1200} c="#2a3348" y={780} />,
	screen: (c) => (
		<>
			{acc(c, '030', 'MASS HALLUCINATION?', 80)}
			{acc(c, '031', 'EMERGENCY MEETING', 60)}
		</>
	),
});

const S032 = board((c) => (
	<g>
		<Title x={960} y={170} t={c.f} text="SCIENTISTS CHECK EVERYTHING" size={56} c="#ffc94a" />
		<Tile x={420} y={560} t={c.f - 4} label="BRAIN SCANS" icon={<Icon n="brain" />} cross={c.f - c.w('033')} />
		<Tile x={960} y={560} t={c.f - 40} label="EYE TESTS" icon={<Icon n="eye" />} cross={c.f - c.w('033') - 4} />
		<Tile x={1500} y={560} t={c.f - 80} label="WATER SUPPLY" icon={<Icon n="water" />} cross={c.f - c.w('033') - 8} />
		{c.f >= c.w('033') ? (
			<text x={960} y={960} textAnchor="middle" fontSize={110 * spring({frame: c.f - c.w('033'), fps: 30, config: {damping: 9}})} fontFamily={FONT} fontWeight={900} fill="#ff6a5a">
				NOTHING.
			</text>
		) : null}
	</g>
));

const S034 = scene({
	set: (c) => <Hospital f={c.f} beds={1} flat={c.w(['034', 75])} />,
	cam: [1050, 560, 1.1],
	keys: [
		[['034', 60], [1150, 420, 1.6]],
		['035', [760, 580, 1.55]],
	],
	actors: [
		{who: 'patient', x: 980, lie: 690, tag: 'TODAY', tagC: '#ff8a7a', tagDead: ['034', 75], blink: []},
		{who: 'nurse', x: 1420, facing: -1, look: [-0.7, 0.3], expr: [['034', 'worried'], [['034', 80], 'sad']], gest: [['touchFace', ['034', 90], 80]], armOver: ['034', 90]},
	],
	screen: (c) => (
		<>
			<Caption f={c.f} from={2} to={c.w(['034', 70])} top={120} lines={['4:37 PM']} size={90} />
			{acc(c, '035', 'EXACTLY ON HIS DATE', 70)}
		</>
	),
});

const S036 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [960, 560, 1.0],
	cam2: [960, 520, 1.12],
	crowd: [
		{n: 11, x0: -160, x1: 2080, floor: 880, s: 0.72, seed: 'dd', tags: true, depth: 1.2, dead: '036'},
	],
	actors: [{who: 'stranger', x: 960, s: 1.05, facing: 1, tag: 'TODAY', tagC: '#ff8a7a', tagDead: ['037', 10], look: [0, -0.6]}],
});

const S038 = board((c) => (
	<g>
		<RollNumber x={960} y={470} f={c.f} t0={c.w('038') + 10} t1={c.w('038') + 70} from={0} to={170000} size={220} />
		<Title x={960} y={590} t={c.f - c.w(['038', 30])} text="DEAD BY MIDNIGHT" size={54} c="#aab3d6" />
		{c.f >= c.w('039') ? (
			<g opacity={interpolate(c.f, [c.w('039'), c.w('039') + 10], [0, 1], cl)}>
				<rect x={460} y={680} width={1000} height={60} rx={30} fill="#11142c" stroke="#ffc94a" strokeWidth={4} />
				<rect x={470} y={690} width={980 * interpolate(c.f, [c.w('039'), c.w('039') + 30], [0, 1], cl)} height={40} rx={20} fill="#ffc94a" />
				<text x={960} y={800} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={800} fill="#ffc94a">
					≈ AN ORDINARY DAY ON EARTH
				</text>
			</g>
		) : null}
		<Title x={960} y={930} t={c.f - c.w('040')} text="EVERY ONE ON THEIR DATE" size={58} c="#ff6a5a" />
		<text x={1860} y={1040} textAnchor="end" fontSize={22} fontFamily={FONT} fill="#aab3d6" opacity={c.f > c.w('039') ? 0.85 : 0}>
			~61 million deaths a year worldwide ≈ 170,000 a day (WHO)
		</text>
	</g>
));

const S041 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.0],
	keys: [['043', [960, 560, 1.12]]],
	shake: [['043', 10]],
	crowd: [
		{n: 9, x0: -300, x1: 2000, floor: 870, s: 0.7, seed: 'pn', tags: true, depth: 1.25, mode: 'stand'},
	],
	actors: [
		{who: 'friend', x: 760, facing: 1, tag: 'JUN 30 2071', gest: [['shrug', '041', 60], ['handsOnHead', '043', 80]], expr: [['043', 'wide']]},
		{who: 'boss', x: 1160, facing: -1, tag: 'JAN 19 2049', gest: [['stop', '042', 60]], expr: [['043', 'wide']], exit: [['043', 20], 50, 2300]},
	],
	screen: (c) => (
		<>
			{acc(c, '041', 'NOBODY CAN PROVE THEY ARE REAL', 70)}
			{acc(c, '042', '…OR THAT THEY ARE WRONG', 70)}
		</>
	),
});

/* ================================ MONEY ================================= */
const S044 = board((c) => (
	<g>
		<Title x={960} y={300} t={c.f - 6} text="THE FIRST THING TO BREAK" size={60} c="#aab3d6" />
		{c.f >= c.w('045') ? (
			<text x={960} y={560} textAnchor="middle" fontSize={190 * spring({frame: c.f - c.w('045'), fps: 30, config: {damping: 9}})} fontFamily={FONT} fontWeight={900} fill="#4aff9a">
				MONEY
			</text>
		) : null}
		{c.f >= c.w('046') ? (
			<g opacity={interpolate(c.f, [c.w('046'), c.w('046') + 10], [0, 1], cl)}>
				<text x={960} y={720} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={800} fill="#ffc94a">
					LIFE INSURANCE = A BET
				</text>
				<rect x={560} y={790} width={800} height={46} rx={23} fill="#11142c" stroke="#5ad8ff" strokeWidth={3} />
				<rect x={566} y={796} width={788 * interpolate(c.f, [c.w('047'), c.w('047') + 40], [0.3, 0.92], cl)} height={34} rx={17} fill="#5ad8ff" />
				<text x={960} y={900} textAnchor="middle" fontSize={34} fontFamily={FONT} fill="#aab3d6">
					THEY BET YOU LIVE LONGER THAN YOU EXPECT
				</text>
			</g>
		) : null}
	</g>
));

const S048 = scene({
	set: (c) => <Office f={c.gf} tint="#b8c8e0" sign="LIFE INSURANCE" />,
	cam: [960, 560, 1.0],
	keys: [
		['049', [700, 560, 1.4]],
		['050', [1350, 560, 1.4]],
		['051', [960, 540, 1.1]],
	],
	actors: [
		{who: 'banker', x: 960, facing: 1, look: [-0.6, 0], gest: [['presentF', '049', 60], ['facepalm', '051', 70]], armOver: '051'},
		{who: 'client', x: 640, facing: 1, enter: ['049', 30, -250], tag: 'NOV 2 2027', gest: [['point', ['049', 30], 60]], handF: 'point', expr: [['049', 'wide']]},
		{who: 'stranger', x: 1340, facing: -1, enter: ['050', 30, 2200], tag: 'MAY 9 2090', gest: [['wave', ['050', 30], 50]], mouth: [['050', 'smile']]},
	],
	front: (c) => (
		<g>
			<DeskFront x={960} w={520} c="#4a5a7a" y={770} />
			<Paper x={1180} y={700} title="POLICY" st={c.f >= c.w(['050', 40]) ? c.f - c.w(['050', 40]) : -1} stamp="CANCELLED" />
			<Paper x={760} y={700} title="POLICY" rot={5} st={c.f >= c.w(['051', 20]) ? c.f - c.w(['051', 20]) : -1} stamp="CLOSED" />
		</g>
	),
	screen: (c) => acc(c, '051', 'WITHIN 72 HOURS: NO NEW POLICIES', 120),
});

const S052 = board((c) => {
	const h = interpolate(c.f, [c.w('053'), c.w('053') + 40], [0, 1], cl);
	return (
		<g>
			<Title x={960} y={170} t={c.f} text="PENSION FUNDS" size={64} c="#ffc94a" />
			<text x={960} y={240} textAnchor="middle" fontSize={34} fontFamily={FONT} fill="#aab3d6" opacity={c.f > 20 ? 1 : 0}>
				BUILT ON GUESSES ABOUT HOW LONG WE LIVE
			</text>
			{[0, 1, 2, 3, 4].map((i) => {
				const plan = 120 + i * 40;
				const real = plan + h * (60 + i * 70);
				return (
					<g key={i}>
						<rect x={480 + i * 200} y={860 - plan} width={70} height={plan} fill="#5ad8ff" opacity={interpolate(c.f, [10 + i * 6, 20 + i * 6], [0, 1], cl)} />
						<rect x={560 + i * 200} y={860 - real} width={70} height={real} fill="#ff6a5a" opacity={h > 0 ? 1 : 0} />
					</g>
				);
			})}
			<line x1={440} y1={860} x2={1500} y2={860} stroke="#aab3d6" strokeWidth={4} />
			<text x={560} y={920} fontSize={30} fontFamily={FONT} fill="#5ad8ff">
				PLANNED
			</text>
			<text x={760} y={920} fontSize={30} fontFamily={FONT} fill="#ff6a5a" opacity={h > 0 ? 1 : 0}>
				PERFECT INFORMATION
			</text>
			{c.f >= c.w('055') ? <Title x={960} y={340} t={c.f - c.w('055')} text="+ TRILLIONS OWED" size={70} c="#ff6a5a" /> : null}
		</g>
	);
});

const S056 = scene({
	set: (c) => <Office f={c.gf} tint="#c8b88a" sign="BANK" />,
	cam: [960, 560, 1.05],
	keys: [
		['057', [760, 540, 1.45]],
		['058', [1150, 540, 1.45]],
		['059', [960, 560, 1.15]],
	],
	actors: [
		{who: 'client', x: 760, facing: 1, tag: 'MAR 3 2030', gest: [['presentF', '057', 60]], expr: [['058', 'sad']]},
		{who: 'banker', x: 1160, facing: -1, look: [-0.7, 0], gest: [['stop', '058', 60]], expr: [['057', 'worried']]},
	],
	front: (c) => (
		<g>
			<DeskFront x={980} w={520} c="#5a4a3a" y={770} />
			<Paper x={960} y={640} rot={-2} title="30-YEAR MORTGAGE" st={c.f >= c.w(['058', 4]) ? c.f - c.w(['058', 4]) : -1} stamp="DENIED" />
			{!c.short && <Callout f={c.f} t0={c.w(['057', 40])} t1={c.w('058') + 30} from={[760, tagY(900, 1) - 10]} to={[420, 300]} text="4 YEARS LEFT" c="#ff6a5a" />}
		</g>
	),
	screen: (c) => acc(c, '059', 'YOUR DATE = YOUR CREDIT SCORE', 90),
});

const S060 = scene({
	set: (c) => <Office f={c.gf} tint="#d8c8e8" sign="LONG-TERM CANDIDATES PREFERRED" />,
	cam: [960, 560, 1.0],
	keys: [
		['061', [720, 560, 1.4]],
		['063', [960, 380, 1.2]],
		['064', [960, 560, 1.05]],
	],
	actors: [
		{who: 'boss', x: 960, facing: -1, look: [-0.6, 0], gest: [['stop', '061', 60], ['presentF', '064', 50]]},
		{who: 'client', x: 640, facing: 1, enter: ['060', 30, -200], tag: 'JUL 8 2028', expr: [['061', 'sad']], exit: [['062', 0], 60, -300]},
		{who: 'stranger', x: 1330, facing: -1, tag: 'MAY 9 2090', mouth: [['064', 'smile']], gest: [['wave', '064', 50]]},
	],
	screen: (c) => (
		<>
			{acc(c, '060', 'THEN YOUR RESUME', 60)}
			{acc(c, ['061', 10], 'GONE IN 18 MONTHS?', 80)}
		</>
	),
});

const S065 = scene({
	set: (c) => <City f={c.gf} dim={0.35} />,
	cam: [960, 560, 1.0],
	cam2: [960, 560, 1.12],
	crowd: [
		{n: 5, x0: -100, x1: 820, floor: 880, s: 0.8, seed: 'lg', tags: true, depth: 1.15},
		{n: 5, x0: 1100, x1: 2020, floor: 880, s: 0.8, seed: 'sh', tags: true, depth: 1.15},
	],
	back: () => (
		<g>
			<rect x={950} y={600} width={20} height={300} fill="#c9a24a" />
			<rect x={950} y={600} width={20} height={20} fill="#ffe08a" />
		</g>
	),
	screen: (c) => acc(c, '066', 'A NEW CLASS SYSTEM', 90),
});

const S067: React.FC = () => {
	const {f, at} = useShot();
	return (
		<Split
			f={f}
			a={{label: 'THE LONGS', num: '2090+', color: '#4aff9a', who: 'stranger', expr: 'normal'}}
			b={{label: 'THE SHORTS', num: '2028', color: '#ff6a5a', who: 'client', expr: f > at('069') ? 'sad' : 'worried'}}
		/>
	);
};

const S070 = board((c) => (
	<g>
		<Title x={960} y={180} t={c.f - 4} text="10 YEARS AWAY = UNTOUCHABLE" size={60} c="#ffc94a" />
		<Tile x={420} y={600} t={c.f - c.w('072')} label="CAR CRASH" icon={<Icon n="car" c="#5ad8ff" />} cross={c.f - c.w('073')} />
		<Tile x={960} y={600} t={c.f - c.w('072') - 6} label="BULLET" icon={<Icon n="bullet" c="#c9a24a" />} cross={c.f - c.w('074')} />
		<Tile x={1500} y={600} t={c.f - c.w('072') - 12} label="FALL" icon={<Icon n="building" c="#aab3d6" />} cross={c.f - c.w('075')} />
	</g>
));

const S076 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.0],
	keys: [['077', [1000, 520, 1.3]]],
	actors: [
		{who: 'soldier', x: 520, facing: 1, tag: 'APR 1 2088', mouth: [['077', 'smile']]},
		{who: 'soldier', x: 800, facing: 1, tag: 'SEP 17 2079'},
		{who: 'soldier', x: 1080, facing: 1, tag: 'JAN 3 2095', mouth: [['077', 'smile']]},
		{who: 'general', x: 1400, facing: -1, enter: ['076', 70, 2200], gest: [['point', ['077', 20], 60]], handF: 'point'},
	],
	screen: (c) => acc(c, ['077', 40], 'MOST VALUABLE PEOPLE ON EARTH', 80),
});

const S078 = scene({
	set: (c) => <Office f={c.gf} tint="#e0a87a" sign="HIRING BY DATE" />,
	cam: [960, 560, 1.0],
	cam2: [960, 520, 1.15],
	crowd: [{n: 6, x0: 200, x1: 1720, floor: 900, s: 0.92, seed: 'job', tags: true, depth: 1.08}],
	screen: (c) => <>{acc(c, '078', 'FIREFIGHTERS · MINERS · WELDERS · TEST PILOTS', 110)}</>,
});

const S080 = think('CAN YOU REALLY NOT DIE?', 'day', '080');

/* ================================= LOVE ================================== */
const S083 = scene({
	set: (c) => <Room f={c.gf} wall="#5a6ab0" night />,
	cam: [1060, 600, 1.05],
	keys: [
		['085', [1130, 560, 1.7]],
		['086', [820, 520, 1.7]],
		['087', [1000, 580, 1.25]],
	],
	back: () => <Bed x={1100} w={900} c="#3a3050" sheet="#c9c4e0" />,
	actors: [
		{who: 'husband', x: 1420, s: 1, lie: 690, tag: '2071', tagOn: ['085', 10], expr: [['086', 'worried']]},
		{who: 'wife', x: 800, seat: 720, facing: 1, look: [0.8, 0.2], expr: [['086', 'sad']], tag: '2029', tagOn: ['086', 10], gest: [['touchFace', '087', 80]], armOver: '087'},
	],
	front: () => (
		<path d="M760,760 Q1100,700 1560,740 L1560,820 Q1100,840 760,820 Z" fill="#3a5fb0" />
	),
	screen: (c) => acc(c, '088', 'WHAT DO YOU EVEN SAY?', 60),
});

const S089 = board((c) => {
	const t = c.f;
	const filter = c.f >= c.w('091');
	const opp = c.f >= c.w('093');
	return (
		<g>
			<Phone x={960} y={560} s={0.95} title="MATCH">
				<g>
					<rect x={-200} y={-300} width={400} height={480} rx={26} fill="#fff" />
					<circle cx={0} cy={-150} r={70} fill="#000" />
					<rect x={-70} y={-80} width={140} height={160} rx={40} fill={opp ? '#ff5a3a' : '#e86aa0'} />
					<text y={130} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#2b2a33">
						{opp ? 'DATE: 2027' : 'DATE: 2071'}
					</text>
				</g>
				{filter ? (
					<g transform={`translate(0,250) scale(${spring({frame: c.f - c.w('091'), fps: 30, config: {damping: 12}})})`}>
						<rect x={-200} y={-40} width={400} height={80} rx={40} fill={opp ? '#ff5a3a' : '#3a9ad9'} />
						<text y={12} textAnchor="middle" fontSize={30} fontFamily={FONT} fontWeight={800} fill="#fff">
							{opp ? 'SHORT DATES ONLY' : 'DATE MATCH ± 1 YEAR'}
						</text>
					</g>
				) : (
					<g transform="translate(0,250)">
						<rect x={-200} y={-40} width={400} height={80} rx={40} fill="#d8d2e8" />
						<text y={12} textAnchor="middle" fontSize={30} fontFamily={FONT} fill="#7a7090">
							+ NEW FILTER
						</text>
					</g>
				)}
				<g transform={`translate(0,360)`}>
					<circle cx={-90} r={40} fill="#ff6a5a" />
					<circle cx={90} r={40} fill="#4aff9a" />
				</g>
			</Phone>
			{c.f >= c.w('095') ? (
				<g transform={`translate(1500,420) scale(${spring({frame: c.f - c.w('095'), fps: 30, config: {damping: 9}}) * (1 + 0.06 * Math.sin(t / 5))})`}>
					<Icon n="heart" />
				</g>
			) : null}
			<Title x={1500} y={640} t={c.f - c.w('096')} text="KNOWN ENDING" size={54} c="#ffc94a" />
			<Title x={420} y={300} t={c.f - c.w('091')} text="SAME DATE" size={54} c="#5ad8ff" />
			<Title x={420} y={380} t={c.f - c.w('092')} text="NOBODY LEFT ALONE" size={40} c="#aab3d6" />
		</g>
	);
}, '#2a1a40');

/* =============================== BABIES ================================== */
const S097 = scene({
	set: (c) => <Nursery f={c.gf} />,
	cam: [960, 600, 1.0],
	keys: [['099', [600, 560, 1.55]]],
	back: (c) => (
		<g>
			{[1150, 1500].map((x, i) => (
				<g key={x}>
					<Crib x={x} />
					<Baby x={x} y={760} s={0.8} f={c.gf + i * 20} c={i ? '#8bd0f0' : '#ffd34a'} />
					<DateTag x={x} y={640} text={i ? 'FEB 2 2119' : 'JUN 21 2108'} f={c.f} on={c.w(['098', 20 + i * 15])} s={0.8} />
				</g>
			))}
		</g>
	),
	actors: [
		{
			who: 'mom',
			x: 600,
			facing: 1,
			look: [0.5, 0.6],
			expr: [['099', 'sad']],
			pose: (c, p) => ({...p, armF: [70, 80], armB: [50, 90]}),
		},
	],
	front: (c) => (
		<g>
			<Baby x={690} y={700} s={0.7} f={c.gf} c="#f2f2f2" />
			<DateTag x={690} y={610} text="OCT 2027" f={c.f} on={c.w(['099', 40])} s={0.8} c="#ff8a7a" />
		</g>
	),
	screen: (c) => acc(c, '099', 'LAGOS · 11 MONTHS', 80),
});

const S100 = scene({
	set: (c) => <Room f={c.gf} wall="#e8c88a" />,
	cam: [960, 560, 1.3],
	cam2: [940, 540, 1.6],
	actors: [{who: 'dad', x: 900, facing: 1, look: [0.5, 0.6], expr: [['100', 'sad']], pose: (c, p) => ({...p, armF: [70, 80], armB: [50, 90], head: p.head + 8}), blink: [['100', 40], ['100', 80]]}],
	front: (c) => (
		<g>
			<Baby x={990} y={700} s={0.7} f={c.gf} c="#8bd0f0" />
			<DateTag x={990} y={610} text="2134" f={c.f} on={4} s={0.9} />
			{c.f > c.w(['100', 50]) ? (
				[0, 1].map((i) => <ellipse key={i} cx={918 + i * 6} cy={600 + ((c.f * 3 + i * 20) % 60)} rx={4} ry={7} fill="#8bd0f0" />)
			) : null}
			{!c.short && <Callout f={c.f} t0={c.w('101')} t1={c.dur} from={[990, 600]} to={[1130, 330]} text="WILL LIVE TO 108" align="center" />}
		</g>
	),
	screen: (c) => acc(c, '100', 'OHIO', 50),
});

const S102 = scene({
	set: (c) => <Hospital f={c.f} beds={1} flat={c.w(['106', 50])} />,
	cam: [1000, 560, 1.05],
	keys: [
		['105', [900, 580, 1.4]],
		['106', [1150, 420, 1.5]],
	],
	actors: [
		{who: 'patient', x: 980, lie: 690, tag: 'TODAY', tagC: '#ff8a7a', tagDead: ['106', 50]},
		{who: 'doctor', x: 1320, facing: -1, exit: ['103', 50, 2300], gest: [['shrug', '103', 40]]},
		{who: 'nurse', x: 1540, facing: -1, exit: [['103', 10], 50, 2400]},
	],
	screen: (c) => (
		<>
			{acc(c, '102', 'HOSPITALS CHANGE', 60)}
			{acc(c, '105', 'SURVIVES SURGERY…', 70)}
			{acc(c, '106', '3 HOURS LATER', 80)}
		</>
	),
});

const S107 = rule('THE DATE', "isn't a prediction", '108', "It's an appointment");

const S109 = think('CAN YOU DIE BEFORE YOUR DATE?', 'day', '109');

/* ============================== TESTING ================================== */
const S113 = scene({
	set: (c) => <Bridge f={c.gf} />,
	setDepth: 1.3,
	cam: [960, 420, 1.15],
	keys: [['114', [960, 380, 1.45]]],
	actors: [
		{who: 'seeker', x: 960, floor: 430, s: 0.85, tag: 'JUN 5 2091', gest: [['wave', '113', 60], ['handsOnHead', '114', 40]], mouth: [['113', 'smile']]},
		{who: 'friend', x: 640, floor: 430, s: 0.8, facing: 1, pose: (c, p) => ({...p, armF: [100, 30]}), tag: 'APR 11 2077'},
	],
	screen: (c) => acc(c, '113', 'THRILL SEEKERS · LONG DATES', 70),
});

const S115 = board((c) => (
	<g>
		<Phone x={960} y={560} s={0.95} title="● LIVE" c="#d94a3a">
			<rect x={-210} y={-300} width={420} height={600} rx={20} fill="#1b1e2a" />
			<circle cx={0} cy={-120} r={70} fill="#000" stroke="#ffe6d6" strokeWidth={3} />
			<rect x={-70} y={-50} width={140} height={200} rx={40} fill="#ff5a3a" />
			<DateTag x={0} y={-230} text="JUN 5 2091" f={c.f} s={0.8} />
			<text x={-190} y={270} fontSize={28} fontFamily={FONT} fill="#fff">
				VIEWERS {Math.round(interpolate(c.f, [0, c.dur], [1200, 980000], cl)).toLocaleString('en-US')}
			</text>
			{c.f >= c.w('118') ? (
				<text y={40} textAnchor="middle" fontSize={110 * spring({frame: c.f - c.w('118'), fps: 30, config: {damping: 8}})} fontFamily={FONT} fontWeight={900} fill="#ffc94a" transform="rotate(-10)">
					CLICK!
				</text>
			) : null}
		</Phone>
		<Title x={400} y={420} t={c.f - c.w('116')} text="THEY SURVIVE" size={56} c="#4aff9a" />
		<Title x={400} y={500} t={c.f - c.w('117')} text="EVERY TIME" size={56} c="#ffc94a" />
		<Title x={1520} y={460} t={c.f - c.w('118')} text="THE GUN JAMS" size={56} c="#ff6a5a" />
	</g>
), '#2a1020');

const S119 = scene({
	set: (c) => <Bridge f={c.gf} />,
	setDepth: 1.25,
	cam: [960, 600, 1.0],
	shake: [[['119', 52], 12]],
	back: (c) => {
		const tx = interpolate(c.f, [0, c.dur], [2300, -500]);
		return (
			<g>
				<RoadBand y={900} />
				<Truck x={tx} y={960} mattress c="#2f6fd8" s={0.95} />
			</g>
		);
	},
	actors: [
		{
			who: 'seeker',
			x: 960,
			s: 0.85,
			tag: 'JUN 5 2091',
			expr: [['119', 'wide'], [['119', 60], 'normal']],
			mouth: [[['119', 60], 'smile']],
			pose: (c, p) => (c.f < c.w(['119', 50]) ? {...p, armF: [160, 20], armB: [-160, 20], legF: [30, 40], legB: [-20, 30]} : p),
			dx: (c) => {
				const tx = interpolate(c.f, [0, c.dur], [2300, -500]);
				return c.f > c.w(['119', 50]) ? tx - 960 + 20 : 0;
			},
			fy: (c) => interpolate(c.f, [c.w(['119', 20]), c.w(['119', 50])], [430, 642], {...cl, easing: (t) => t * t}),
		},
	],
	front: (c) => (c.f > c.w(['119', 48]) && c.f < c.w(['119', 70]) ? <text x={interpolate(c.f, [0, c.dur], [2300, -500]) - 60} y={700} fontSize={70} fontFamily={FONT} fontWeight={900} fill="#ffc94a">FWUMP!</text> : null),
});

const S120 = board((c) => (
	<g>
		<g transform={`translate(960,420) rotate(${c.f * 0.6})`}>
			{Array.from({length: 8}).map((_, i) => (
				<path key={i} d="M0,0 Q120,-60 220,0" stroke="#d8a8ff" strokeWidth={10} fill="none" opacity={0.6} transform={`rotate(${i * 45})`} />
			))}
		</g>
		<circle cx={960} cy={420} r={60} fill="#11142c" stroke="#ffc94a" strokeWidth={6} />
		<Title x={960} y={720} t={c.f - 6} text="THE UNIVERSE BENDS ITSELF" size={64} c="#d8a8ff" />
		<Title x={960} y={820} t={c.f - c.w('121') - 20} text="TO KEEP YOU ALIVE UNTIL YOUR APPOINTMENT" size={44} c="#ffc94a" />
	</g>
), '#1a1040');

const S122 = scene({
	set: (c) => <City f={c.gf} />,
	setDepth: 1.9,
	cam: [900, 560, 1.5],
	cam2: [920, 540, 1.65],
	actors: [{who: 'hero', x: 760, facing: 1, gest: [['point', ['123', 0], 90], ['rubChin', '122', 50]], handF: 'point', look: [0.7, 0], mouth: [['123', 'smile']], tag: '?? ??? ????', glitch: true}],
	front: (c) => {
		const k = spring({frame: c.f - c.w('123'), fps: 30, config: {damping: 8}});
		return c.f >= c.w('123') ? (
			<g transform={`translate(1150,520) scale(${k})`}>
				<circle r={120} fill="#3d6fd6" />
				<path d="M-50,60 L-50,-10 L-10,-10 L20,-80 Q45,-80 40,-40 L35,-10 L65,-10 Q85,-10 80,15 L65,60 Z" fill="#fff" />
				<rect x={-80} y={-10} width={24} height={70} fill="#fff" />
			</g>
		) : null;
	},
	screen: (c) => acc(c, '124', 'IT GETS STRANGER', 60),
});

const S125 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 600, 1.0],
	keys: [['127', [900, 600, 1.35]]],
	shake: [[['126', 90], 14]],
	back: (c) => {
		const cx = interpolate(c.f, [c.w(['126', 40]), c.w(['126', 100])], [2400, 1100], cl);
		const cx2 = interpolate(c.f, [0, c.dur], [-600, 2600]);
		return (
			<g>
				<SimpleCar x={cx2} y={1000} c="#3aa37a" dir={1} />
				<SimpleCar x={cx} y={1060} c="#d94a3a" dir={-1} />
			</g>
		);
	},
	actors: [{who: 'client', x: 860, floor: 1000, facing: 1, enter: ['126', 40, 400], tag: 'MAY 2066', gest: [['wave', '126', 30]], expr: [[['126', 88], 'wide']], squash: (c) => (c.f > c.w(['126', 90]) && c.f < c.w(['126', 100]) ? 0.15 : 0)}],
	front: (c) => (c.f > c.w(['126', 88]) && c.f < c.w(['126', 130]) ? <text x={1000} y={760} fontSize={80} fontFamily={FONT} fontWeight={900} fill="#ffc94a" transform="rotate(-8,1000,760)">SCREECH!</text> : null),
	screen: (c) => (
		<>
			{acc(c, '126', 'BRAZIL', 50)}
			{acc(c, '127', 'HE SURVIVES', 50)}
		</>
	),
});

const S128 = scene({
	set: (c) => <Hospital f={c.gf} beds={1} />,
	cam: [900, 600, 1.2],
	cam2: [820, 600, 1.5],
	actors: [{who: 'client', x: 980, lie: 690, tag: 'MAY 2066', expr: [['128', 'sad']], blink: [['129', 20]]}],
	screen: (c) => (
		<>
			{acc(c, '128', '40 YEARS · PARALYZED', 90)}
			{acc(c, '129', 'ALIVE — GUARANTEED', 70)}
			{acc(c, '130', 'WHAT KIND OF LIFE — NOT', 80)}
		</>
	),
});

const S131 = rule('THE NUMBERS', "don't feel like a gift", '132', 'They feel like a sentence');

export const SHOTS_A: ShotDef[] = [
	{at: '001', C: S001},
	{at: '004', C: S004, whip: true},
	{at: '006', C: S006},
	{at: '008', C: S008, whip: true},
	{at: '012', C: S012, whip: true},
	{at: '014', C: S014, whip: true},
	{at: '015', C: S015},
	{at: '020', C: S020, whip: true},
	{at: '022', C: S022, whip: true},
	{at: '023', C: S023, whip: true},
	{at: '025', C: S025, whip: true},
	{at: '028', C: S028},
	{at: '029', C: S029, whip: true},
	{at: '030', C: S030, whip: true},
	{at: '032', C: S032, whip: true},
	{at: '034', C: S034, whip: true},
	{at: '036', C: S036, whip: true},
	{at: '038', C: S038, whip: true},
	{at: '041', C: S041, whip: true},
	{at: '044', C: S044, whip: true},
	{at: '048', C: S048, whip: true},
	{at: '052', C: S052, whip: true},
	{at: '056', C: S056, whip: true},
	{at: '060', C: S060, whip: true},
	{at: '065', C: S065, whip: true},
	{at: '067', C: S067},
	{at: '070', C: S070, whip: true},
	{at: '076', C: S076, whip: true},
	{at: '078', C: S078, whip: true},
	{at: '080', C: S080, whip: true},
	{at: '083', C: S083, whip: true},
	{at: '089', C: S089, whip: true},
	{at: '097', C: S097, whip: true},
	{at: '100', C: S100, whip: true},
	{at: '102', C: S102, whip: true},
	{at: '107', C: S107, whip: true},
	{at: '109', C: S109, whip: true},
	{at: '113', C: S113, whip: true},
	{at: '115', C: S115, whip: true},
	{at: '119', C: S119, whip: true},
	{at: '120', C: S120, whip: true},
	{at: '122', C: S122, whip: true},
	{at: '125', C: S125, whip: true},
	{at: '128', C: S128, whip: true},
	{at: '131', C: S131, whip: true},
];
export {fakeDate, Lab, Corridor, HallBack, Chair, SimpleCar};
