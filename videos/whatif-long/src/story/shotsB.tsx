/* Shots 133–280: the spike, three groups, the cruel twist, religions, the girl in Portugal,
   the moving numbers, the quiet day, our world, the question, the next video. */
import React from 'react';
import {interpolate, spring} from 'remotion';
import {useShot} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Callout, Caption, Split} from '../kit/graphics';
import {Accent, Bubble, FONT, HAND, RuleCard} from '../kit/ui';
import {ClassroomEve, HallBack} from '../kit/sets';
import {board, scene, SPIKE, type Ctx, type When} from './scene';
import {
	Chalk, City, DateTag, DeathChart, DeskFront, Icon, Mirror, Mountains, Observatory, Office, Room, RollNumber, Telescope, Tile, Title, WarRoom, WorldShapes, tagY,
} from './places';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const acc = (c: Ctx, w: When, text: string, dur = 80, y = 880, sub?: string) => <Accent text={text} t={c.f - c.w(w)} dur={dur} y={y} sub={sub} />;
const HT = '?? ??? ????';

const Monitor: React.FC<{x: number; y: number; f: number; kind: number}> = ({x, y, f, kind}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-150} y={-100} width={300} height={190} rx={12} fill="#1b2030" />
		<rect x={-136} y={-86} width={272} height={162} rx={6} fill="#0c1a2a" />
		{kind === 0
			? Array.from({length: 12}).map((_, i) => <rect key={i} x={-120 + (i % 4) * 62} y={-72 + Math.floor(i / 4) * 50} width={52} height={40} fill="#2a4a7a" opacity={(f / 6 + i) % 12 < 6 ? 1 : 0.4} />)
			: kind === 1
				? Array.from({length: 7}).map((_, i) => <rect key={i} x={-120} y={-70 + i * 20} width={((f * 7 + i * 37) % 220) + 20} height={8} fill="#5ad8ff" opacity={0.7} />)
				: <path d={`M-120,40 ${Array.from({length: 24}).map((_, i) => `L${-120 + i * 10},${40 - (i === 8 ? 100 : Math.sin(i + f / 10) * 10)}`).join(' ')}`} stroke="#5ad8ff" strokeWidth={4} fill="none" />}
	</g>
);

/* ================================ THE SPIKE ================================ */
const S133 = scene({
	set: (c) => <Office f={c.gf} tint="#5a6ab0" night />,
	cam: [960, 560, 1.05],
	keys: [
		['135', [1060, 500, 1.3]],
		['136', [960, 520, 1.2]],
	],
	actors: [{who: 'scientist', x: 800, seat: 790, facing: 1, look: [0.8, -0.3], tag: 'NOV 22 2069', pose: (c, p) => ({...p, armF: [70, 60 + Math.sin(c.f / 2) * 10], armB: [60, 70], legB: [88, 85], legF: [92, 90]})}],
	back: (c) => (
		<g>
			<Monitor x={1000} y={560} f={c.f} kind={0} />
			<Monitor x={1330} y={560} f={c.f} kind={1} />
			<Monitor x={1165} y={360} f={c.f} kind={2} />
		</g>
	),
	front: (c) => (
		<g>
			<DeskFront x={1100} w={800} c="#2a3348" y={690} />
			{/* photos flying into the screen */}
			{c.f >= c.w('135')
				? Array.from({length: 10}).map((_, i) => {
						const t = (c.f - c.w('135') - i * 8) / 40;
						if (t < 0 || t > 1) return null;
						return (
							<g key={i} transform={`translate(${interpolate(t, [0, 1], [-100 + i * 40, 1160])},${interpolate(t, [0, 1], [200 + (i % 3) * 120, 380])}) scale(${1 - t * 0.7}) rotate(${i * 13})`}>
								<rect x={-50} y={-40} width={100} height={80} fill="#fbf8ef" />
								<circle cy={-8} r={16} fill="#000" />
								<text y={30} textAnchor="middle" fontSize={14} fontFamily={FONT} fill="#2b2a33">
									20{40 + i * 5}
								</text>
							</g>
						);
					})
				: null}
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '133', '6 MONTHS IN', 60)}
			{acc(c, '134', 'SEOUL', 50)}
			{acc(c, '136', 'MILLIONS OF DATES · ONE GRAPH', 100)}
		</>
	),
});

const S137 = board((c) => {
	const draw = interpolate(c.f, [c.w('137'), c.w('139') + 30], [0, 1], cl);
	const spike = interpolate(c.f, [c.w('141'), c.w('141') + 30], [0, 1], {...cl, easing: (t) => 1 - (1 - t) ** 3});
	return (
		<g>
			<DeathChart draw={draw} spike={spike} label={c.f >= c.w('143') ? '≈ 2,000,000,000' : undefined} f={c.f} />
			{c.f >= c.w('140') ? <Title x={960} y={140} t={c.f - c.w('140')} text="EXCEPT FOR ONE SPIKE" size={60} c="#ff6a5a" /> : <Title x={960} y={140} t={c.f - c.w('138')} text="A SMOOTH CURVE" size={60} c="#5ad8ff" />}
			{c.f >= c.w('144') ? (
				<g transform={`translate(1380,320) scale(${spring({frame: c.f - c.w('144'), fps: 30, config: {damping: 10}})})`}>
					<rect x={-300} y={-70} width={600} height={140} rx={30} fill="#3a0d14" stroke="#ff4a5a" strokeWidth={6} />
					<text y={26} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#fff">
						{SPIKE}
					</text>
				</g>
			) : null}
			<Title x={1380} y={470} t={c.f - c.w('145')} text="LESS THAN 5 YEARS AWAY" size={44} c="#ffc94a" />
		</g>
	);
});

const S146 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [960, 560, 1.0],
	cam2: [960, 540, 1.1],
	crowd: [{n: 9, x0: -100, x1: 2020, floor: 880, s: 0.75, seed: 'vir', tags: true, depth: 1.2}],
	front: (c) => (
		<g>
			{Array.from({length: 9}).map((_, i) => {
				const t = c.f - i * 5;
				if (t < 0) return null;
				const k = spring({frame: t, fps: 30, config: {damping: 10}});
				return (
					<g key={i} transform={`translate(${-100 + ((i + 0.5) * 2120) / 9},${560 + Math.sin(c.f / 10 + i) * 6}) scale(${k * 0.8})`}>
						<rect x={-34} y={-56} width={68} height={112} rx={10} fill="#15171f" />
						<rect x={-28} y={-48} width={56} height={92} rx={6} fill="#3a0d14" />
						<path d="M-20,30 L-6,30 L-2,-30 L4,30 L20,30" stroke="#ff4a5a" strokeWidth={4} fill="none" />
					</g>
				);
			})}
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '146', 'VIRAL IN UNDER AN HOUR', 70)}
		</>
	),
});

const S147 = board((c) => (
	<g>
		<Title x={960} y={170} t={c.f} text="THE WORLD SPLITS IN THREE" size={64} c="#ffc94a" />
		<Tile x={420} y={580} t={c.f - 10} label="IT'S A WAR" icon={<Icon n="shield" c="#ff6a5a" />} c="#ff6a5a" />
		<Tile x={960} y={580} t={c.f - 22} label="IT'S FROM SPACE" icon={<Icon n="asteroid" c="#aab3d6" />} c="#d8a8ff" />
		<Tile x={1500} y={580} t={c.f - 34} label="JUST GET OUT" icon={<Icon n="home" c="#4aff9a" />} c="#4aff9a" />
	</g>
));

const S148 = scene({
	set: (c) => <WarRoom f={c.gf} alarm />,
	cam: [960, 560, 1.0],
	keys: [
		['151', [960, 560, 1.15]],
		['152', [760, 480, 1.6]],
		['153', [1160, 480, 1.6]],
	],
	actors: [
		{who: 'leader', x: 760, facing: 1, tag: SPIKE, tagOn: ['152', 0], tagC: '#ff8a8a', expr: [['152', 'worried']], gest: [['rubChin', '149', 60]]},
		{who: 'general', x: 1160, facing: -1, tag: 'MAR 4 2052', tagOn: ['153', 0], gest: [['point', '148', 60], ['armsCrossed', '153', 60]], handF: 'point'},
	],
	front: () => <DeskFront x={960} w={1000} c="#2a3348" y={780} />,
	screen: (c) => (
		<>
			{acc(c, '148', 'GROUP 1: A WAR', 80)}
			{acc(c, '150', 'WHAT ELSE COULD IT BE?', 50)}
			{acc(c, ['151', 10], "CHECKING THEIR OWN LEADERS' DATES", 80)}
		</>
	),
});

const S154 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [1000, 560, 1.1],
	keys: [['155', [1200, 470, 1.6]]],
	actors: [
		{
			who: 'spy',
			x: 700,
			facing: 1,
			look: [0.8, -0.3],
			pose: (c, p) => ({...p, armF: [110, 40], armB: [90, 60]}),
			handItem: (
				<g>
					<rect x={-34} y={-24} width={68} height={48} rx={8} fill="#2b2f3a" />
					<circle cx={10} r={14} fill="#5ad8ff" />
				</g>
			),
		},
		{who: 'general', x: 1240, facing: -1, look: [-0.4, 0], tag: 'MAR 4 2052', gest: [['armsCrossed', '154', 120]]},
	],
	front: (c) => (
		<g>
			{[c.w(['154', 50]), c.w(['154', 80])].map((t, i) => (c.f >= t && c.f < t + 4 ? <rect key={i} x={-500} y={-400} width={2920} height={1900} fill="#fff" opacity={0.6} /> : null))}
			{!c.short && <Callout f={c.f} t0={c.w('156')} t1={c.dur} from={[1246, tagY(900, 1) - 10]} to={[1500, 260]} text="TOP SECRET" c="#ff6a5a" />}
		</g>
	),
	screen: (c) => acc(c, '154', 'SPIES PHOTOGRAPH FACES', 70),
});

const S157 = scene({
	set: (c) => <Observatory f={c.gf} />,
	cam: [960, 560, 1.0],
	keys: [['161', [700, 600, 1.4]]],
	actors: [{who: 'scientist', x: 640, facing: 1, look: [0.6, -0.9], tag: 'JUL 19 2063', gest: [['rubChin', '163', 70]], expr: [['162', 'worried']]}],
	back: () => <Telescope x={820} />,
	front: (c) => (
		<g>
			{[
				['158', 'asteroid', 500],
				['159', 'sun', 960],
				['160', 'gamma', 1420],
			].map(([w, n, x]) => {
				const t = c.f - c.w(w as string);
				if (t < 0) return null;
				const k = spring({frame: t, fps: 30, config: {damping: 10}});
				const gone = c.f >= c.w('162') ? interpolate(c.f, [c.w('162'), c.w('162') + 10], [1, 0], cl) : 1;
				return (
					<g key={n as string} transform={`translate(${x},${220 + Math.sin(c.f / 20 + (x as number)) * 8}) scale(${k * 0.8})`} opacity={gone}>
						<Icon n={n as string} c="#aab3d6" />
					</g>
				);
			})}
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '157', 'GROUP 2: SOMETHING FROM SPACE', 80)}
			{acc(c, '162', 'THEY FIND NOTHING', 50)}
		</>
	),
});

const S164 = board((c) => (
	<g>
		<WorldShapes x={360} y={160} w={1200} h={600} c="#2a6a9a" hot={interpolate(c.f, [c.w('165'), c.w('168') + 40], [0, 1], cl)} />
		<Title x={960} y={110} t={c.f} text="NOT SPREAD EVENLY" size={56} c="#ffc94a" />
		<Title x={600} y={880} t={c.f - c.w('166')} text="COASTAL CITIES" size={48} c="#ff6a5a" />
		<Title x={1320} y={880} t={c.f - c.w('167')} text="LOW-LYING COUNTRIES" size={48} c="#ff6a5a" />
		<Title x={960} y={980} t={c.f - c.w('168')} text="WHOLE REGIONS · ONE DATE" size={40} c="#aab3d6" />
	</g>
));

const S169 = scene({
	set: (c) => <Mountains f={c.gf} />,
	setDepth: 1.5,
	cam: [960, 560, 1.0],
	cam2: [1060, 520, 1.15],
	crowd: [
		{n: 8, x0: -500, x1: 900, floor: 900, s: 0.8, seed: 'mig', tags: true, mode: 'walk', dir: 1, speed: 1.6, fixed: SPIKE, depth: 1.1},
		{n: 7, x0: -300, x1: 1200, floor: 860, s: 0.6, seed: 'mig2', tags: true, mode: 'walk', dir: 1, speed: 1.2, fixed: SPIKE, depth: 1.3},
	],
	screen: (c) => (
		<>
			{acc(c, '169', 'GROUP 3: JUST GET OUT', 80)}
			{acc(c, '172', 'TO MOUNTAINS', 40)}
			{acc(c, '173', 'TO OTHER CONTINENTS', 50)}
		</>
	),
});

const S174 = scene({
	set: (c) => <Mountains f={c.gf} dusk={c.f > c.w('177')} />,
	setDepth: 1.5,
	cam: [960, 560, 1.05],
	keys: [
		['175', [900, 500, 1.45]],
		['177', [960, 560, 1.15]],
		['178', [800, 480, 1.6]],
	],
	actors: [
		{who: 'dad', x: 700, facing: 1, enter: ['174', 120, -300], tag: SPIKE, tagC: '#ff8a8a'},
		{who: 'mom', x: 960, facing: 1, enter: ['174', 130, -100], tag: SPIKE, tagC: '#ff8a8a', expr: [['175', 'worried']]},
		{who: 'girl', x: 1160, s: 0.72, facing: 1, enter: ['174', 140, 100], tag: SPIKE, tagC: '#ff8a8a'},
	],
	screen: (c) => (
		<>
			{acc(c, '175', "THEIR NUMBERS DON'T CHANGE", 80)}
			{acc(c, '176', 'BANGLADESH → NEPAL', 90)}
			{acc(c, '178', 'SEPTEMBER 9TH FOLLOWS THEM', 90)}
		</>
	),
});

const S179: React.FC = () => {
	const {f} = useShot();
	return (
		<Split
			f={f}
			a={{label: 'SHOWING THE FUTURE?', num: '?', color: '#5ad8ff', icon: <Icon n="eye" />}}
			b={{label: 'OR CREATING IT?', num: '?', color: '#ff6a5a', icon: <Icon n="gamma" />}}
		/>
	);
};

const S182 = board((c) => (
	<g>
		<RollNumber x={960} y={340} f={c.f} t0={c.w('183')} t1={c.w('183') + 40} from={0} to={2000000000} size={130} />
		<Title x={960} y={430} t={c.f - c.w(['183', 30])} text="PEOPLE · THE SAME DAY" size={48} c="#aab3d6" />
		<Tile x={420} y={760} t={c.f - c.w('185')} label="QUIT THEIR JOBS" icon={<Icon n="building" c="#aab3d6" />} c="#ffc94a" w={340} />
		<Tile x={960} y={760} t={c.f - c.w('186')} label="STOP PAYING DEBTS" icon={<text y={60} textAnchor="middle" fontSize={160} fontFamily={FONT} fontWeight={900} fill="#4aff9a">$</text>} c="#ffc94a" w={340} />
		<Tile x={1500} y={760} t={c.f - c.w('187')} label="SPEND EVERYTHING" icon={<Icon n="food" c="#5ad8ff" />} c="#ffc94a" w={340} />
		<Title x={960} y={160} t={c.f - c.w('182')} text="THINK ABOUT IT" size={56} c="#ffc94a" />
	</g>
));

const S188 = scene({
	set: (c) => <City f={c.gf} dim={0.25} />,
	cam: [960, 560, 1.0],
	keys: [['192', [1100, 520, 1.3]]],
	crowd: [{n: 7, x0: -100, x1: 2000, floor: 870, s: 0.7, seed: 'col', tags: true, depth: 1.25, fixed: SPIKE}],
	back: (c) => (
		<g>
			<g transform="translate(560,640)">
				<Icon n="factory" c="#4a4f6a" />
				{c.f >= c.w('190') ? (
					<g transform={`rotate(-8) scale(${spring({frame: c.f - c.w('190'), fps: 30, config: {damping: 9}})})`}>
						<rect x={-130} y={-30} width={260} height={64} rx={8} fill="#c42b2b" />
						<text y={16} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">
							CLOSED
						</text>
					</g>
				) : null}
			</g>
			<g transform="translate(1280,560)">
				<rect x={-180} y={-120} width={360} height={240} rx={14} fill="#11142c" stroke="#ffc94a" strokeWidth={5} />
				<text y={-50} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#ffc94a">
					BREAD
				</text>
				<RollNumber x={0} y={60} f={c.f} t0={c.w('192')} t1={c.w('192') + 40} from={2} to={19} size={110} fmt={(v) => '$' + v.toFixed(2)} c="#ff6a5a" />
				{c.f < c.w('192') ? (
					<text y={60} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#fff">
						$2.00
					</text>
				) : null}
			</g>
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '189', 'NOT A DISASTER — THE PREDICTION OF ONE', 120)}
			{acc(c, '191', 'SUPPLY CHAINS BREAK', 50)}
		</>
	),
});

const S193 = scene({
	set: (c) => <City f={c.gf} dim={0.3} />,
	setDepth: 1.9,
	cam: [960, 560, 1.75],
	cam2: [930, 540, 1.95],
	actors: [{who: 'hero', x: 900, facing: 1, gest: [['think', '193', 9999]], look: [0.6, -0.6], expr: [['195', 'worried']], tag: HT, glitch: true}],
	front: (c) => (
		<>
			<Bubble x={1110} y={330} w={560} h={170} t={c.f - c.w('194')} tail={[-220, 120]} thought>
				<text y={-8} textAnchor="middle" fontSize={36} fontFamily={FONT} fontWeight={800} fill="#1b1e2a">
					{c.f >= c.w('195') ? 'WHAT IF THE CATASTROPHE' : 'NOT PREDICTING'}
				</text>
				<text y={38} textAnchor="middle" fontSize={36} fontFamily={FONT} fontWeight={800} fill={c.f >= c.w('195') ? '#c42b2b' : '#1b1e2a'}>
					{c.f >= c.w('195') ? 'IS US?' : 'A CATASTROPHE?'}
				</text>
			</Bubble>
		</>
	),
});

/* =============================== RELIGIONS =============================== */
const S196 = scene({
	set: (c) => <HallBack f={c.gf} disco={0} />,
	cam: [960, 560, 1.0],
	keys: [
		['197', [960, 440, 1.35]],
		['200', [960, 560, 1.0]],
	],
	crowd: [
		{n: 9, x0: 0, x1: 1920, floor: 1000, s: 0.9, seed: 'rel', tags: true, depth: 0.95},
	],
	back: (c) => (
		<g>
			<g transform="translate(960,190)">
				<rect x={-420} y={-60} width={840} height={110} rx={14} fill="#f2e6c8" />
				<text y={20} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#8a5a2a" letterSpacing={6}>
					THE APPOINTED
				</text>
			</g>
			<ellipse cx={960} cy={300} rx={500} ry={80} fill="#ffe8a0" opacity={0.15 + 0.05 * Math.sin(c.f / 12)} />
		</g>
	),
	actors: [{who: 'preacher', x: 960, floor: 760, facing: 1, faceTurn: 0.1, look: [0, 0], tag: 'APR 30 2060', gest: [['presentF', '197', 90], ['wave', '199', 60], ['handsOnHead', '200', 30]]}],
	screen: (c) => (
		<>
			{acc(c, '198', 'A FIXED PURPOSE · A FIXED END', 90)}
			{acc(c, '199', 'SO FEAR IS POINTLESS', 70)}
			{acc(c, '200', 'MILLIONS JOIN', 50)}
		</>
	),
});

const S201 = scene({
	set: (c) => <Room f={c.gf} wall="#3a2a5a" night window={false} />,
	cam: [960, 560, 1.0],
	keys: [
		['203', [960, 560, 1.1]],
		['205', [700, 480, 1.6]],
		['207', [960, 520, 1.25]],
	],
	back: () => (
		<g>
			{[480, 960, 1440].map((x) => (
				<Mirror key={x} x={x - 140} y={250} w={280} h={520} />
			))}
			<g transform="translate(960,150)">
				<text textAnchor="middle" fontSize={56} fontFamily={HAND} fontWeight={700} fill="#f6e7a1">
					The Unwritten
				</text>
			</g>
		</g>
	),
	actors: [
		{who: 'girl', x: 480, s: 0.95, facing: 1, faceTurn: 0.05, look: [0, -0.9], tag: SPIKE, gest: [['handsOnHead', '204', 60]], expr: [['206', 'sad']]},
		{who: 'stranger', x: 960, facing: 1, faceTurn: 0.05, look: [0, -0.9], tag: 'FEB 14 2070', gest: [['fist', '202', 60]]},
		{who: 'friend', x: 1440, facing: 1, faceTurn: 0.05, look: [0, -0.9], tag: SPIKE, gest: [['facepalm', '206', 60]], armOver: '206'},
	],
	screen: (c) => (
		<>
			{acc(c, '201', 'A TEST?', 60)}
			{acc(c, '205', 'TRYING TO SEE THEIR OWN DATE', 70)}
			{acc(c, '206', 'NOBODY EVER DOES', 50)}
		</>
	),
});

/* ============================ THE GIRL ============================ */
const S208 = scene({
	set: () => <ClassroomEve />,
	cam: [960, 560, 1.0],
	keys: [
		['209', [900, 560, 1.25]],
		['210', [1140, 470, 1.6]],
		['212', [1140, 470, 1.9]],
	],
	actors: [
		{who: 'girl', x: 800, s: 0.85, facing: 1, look: [0.7, -0.8], gest: [['point', '210', 120]], handF: 'point', expr: [['211', 'wide']]},
		{who: 'teacher', x: 1120, s: 1.15, facing: -1, look: [-0.6, 0.4], tag: '2068', tagRoll: ['211', SPIKE], expr: [['213', 'worried']]},
	],
	screen: (c) => (
		<>
			{acc(c, '208', '2 YEARS BEFORE THE SPIKE', 60)}
			{acc(c, '209', 'PORTUGAL · AGE 7', 80)}
			{acc(c, '211', 'IT MOVED', 50)}
		</>
	),
});

const S213 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.0],
	keys: [
		['215', [960, 560, 1.15]],
		['218', [960, 480, 1.45]],
	],
	crowd: [{n: 8, x0: -100, x1: 2020, floor: 870, s: 0.72, seed: 'town', tags: true, depth: 1.2, fixed: SPIKE}],
	actors: [
		{who: 'teacher', x: 960, facing: 1, tag: '2068', mouth: [['218', 'smile']]},
		{who: 'grandpa', x: 620, facing: 1, enter: ['215', 50, -200], tag: SPIKE, gest: [['point', ['215', 60], 70]], handF: 'point'},
		{who: 'mom', x: 1300, facing: -1, enter: ['216', 40, 2200], tag: SPIKE, gest: [['handsOnHead', '218', 50]], expr: [['218', 'wide']]},
		{who: 'girl', x: 800, s: 0.72, facing: 1, look: [0.6, -0.6], mouth: [['214', 'smirk']]},
	],
	screen: (c) => (
		<>
			{acc(c, '213', 'NOBODY BELIEVES HER', 60)}
			{acc(c, '217', 'THE WHOLE TOWN CHECKS', 60)}
			{acc(c, '219', 'FIRST CONFIRMED CASE IN HISTORY', 100)}
		</>
	),
});

const S220 = board((c) => (
	<g>
		<Title x={960} y={170} t={c.f} text="WHAT DID SHE DO?" size={64} c="#ffc94a" />
		<Tile x={420} y={580} t={c.f - c.w('222')} label="MOVED?" icon={<Icon n="home" />} cross={c.f - c.w('225')} />
		<Tile x={960} y={580} t={c.f - c.w('223')} label="MEDICINE?" icon={<Icon n="pill" />} cross={c.f - c.w('225') - 4} />
		<Tile x={1500} y={580} t={c.f - c.w('224')} label="PRAYED?" icon={<Icon n="pray" />} cross={c.f - c.w('225') - 8} />
		<Title x={960} y={960} t={c.f - c.w('226')} text="NOTHING FOR HERSELF" size={60} c="#4aff9a" />
	</g>
));

const S227 = scene({
	set: (c) => <Room f={c.gf} wall="#8a6a4a" night={c.f < c.w('231')} />,
	cam: [960, 580, 1.05],
	keys: [
		['229', [960, 520, 1.2]],
		['231', [700, 470, 1.6]],
	],
	actors: [
		{who: 'grandpa', x: 1160, seat: 790, facing: -1, look: [-0.6, 0], tag: SPIKE, pose: (c, p) => ({...p, legB: [88, 85], legF: [92, 90], armF: [30, 60]})},
		{who: 'grandma', x: 1460, seat: 790, facing: -1, look: [-0.6, 0], tag: SPIKE, pose: (c, p) => ({...p, legB: [88, 85], legF: [92, 90], armF: [30, 60]})},
		{who: 'teacher', x: 700, facing: 1, enter: ['227', 60, -250], tag: '2068', tagRoll: ['231', SPIKE], gest: [['presentF', '228', 60], ['fist', '230', 50]], expr: [['231', 'wide']], mouth: [['231', 'smile']]},
	],
	back: () => (
		<g>
			{[1160, 1460].map((x) => (
				<g key={x}>
					<rect x={x - 70} y={800} width={140} height={14} fill="#5a3a2a" />
					<rect x={x - 60} y={814} width={10} height={86} fill="#5a3a2a" />
					<rect x={x + 50} y={814} width={10} height={86} fill="#5a3a2a" />
				</g>
			))}
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '227', 'A SHELTER FOR THE ELDERLY', 80)}
			{acc(c, '230', 'SHE STAYED', 50)}
			{acc(c, '231', 'THE NEXT MORNING', 60)}
		</>
	),
});

const S232 = board((c) => (
	<g>
		<Title x={960} y={160} t={c.f} text="NOBODY KNOWS WHY" size={60} c="#aab3d6" />
		<Chalk x={960} y={400} text="Maybe her choice changed a chain of events…" t={c.f - c.w('233')} size={56} />
		<Chalk x={960} y={540} text="Maybe her shelter saves the town…" t={c.f - c.w('234')} size={56} />
		<Chalk x={960} y={680} text="Maybe the numbers were never fixed." t={c.f - c.w('235')} size={56} c="#ffc94a" />
		<Title x={960} y={880} t={c.f - c.w('236')} text="NOT DESTINY — THE MOST LIKELY FUTURE" size={50} c="#4aff9a" />
	</g>
), '#1b2b24');

const S237 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.0],
	keys: [
		['239', [960, 560, 1.15]],
		['241', [800, 520, 1.45]],
	],
	actors: [
		{who: 'friend', x: 680, facing: 1, tag: 'AUG 2 2074', tagRoll: ['241', SPIKE]},
		{who: 'grandma', x: 900, facing: -1, tag: 'MAY 1 2049', tagRoll: [['241', 20], SPIKE]},
		{who: 'stranger', x: 1300, facing: -1, tag: 'JUN 9 2081', tagRoll: ['239', SPIKE], gest: [['wave', '239', 50]]},
		{who: 'boss', x: 1600, facing: -1, tag: SPIKE, expr: [['242', 'sad']], gest: [['armsCrossed', '242', 80]]},
	],
	front: (c) => {
		const k = Math.max(0, Math.min(1, (c.f - c.w(['241', 10])) / 40));
		return (
			<g>
				{k > 0 ? <path d={`M760,800 Q790,${780 - 20 * k} 830,800`} stroke="#ffc94a" strokeWidth={6} fill="none" /> : null}
			</g>
		);
	},
	screen: (c) => (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{c.f >= c.w('239') ? (
					<RollNumber x={1250} y={170} f={c.f} t0={c.w('239')} t1={c.w('240') + 30} from={1000} to={300000} size={76} c="#4aff9a" fmt={(v) => Math.round(v).toLocaleString('en-US') + ' MOVED'} />
				) : null}
			</svg>
			{acc(c, '241', 'FOR SOMEONE ELSE', 80)}
			{acc(c, '242', 'NEVER FOR THEMSELVES ONLY', 80)}
		</>
	),
});

const S243 = board((c) => {
	const spike = interpolate(c.f, [c.w('243') + 20, c.w('245') + 30], [1, 0.42], cl);
	return (
		<g>
			<DeathChart draw={1} spike={spike} label={c.f >= c.w('245') ? 'NO LONGER 2 BILLION' : SPIKE} f={c.f} />
			<Title x={960} y={140} t={c.f - c.w('244')} text="NOT TO ZERO" size={60} c="#ffc94a" />
		</g>
	);
});

const S246 = scene({
	set: (c) => <City f={c.gf} dawn />,
	cam: [960, 520, 1.0],
	cam2: [960, 560, 1.12],
	actors: [
		{who: 'teacher', x: 600, facing: 1, enter: ['251', 70, -250], tag: '2068', tagOn: '246', expr: [['252', 'normal']], mouth: [['252', 'smile']]},
		{who: 'girl', x: 800, s: 0.72, facing: 1, enter: ['251', 80, -150], mouth: [['252', 'smile']]},
		{who: 'grandpa', x: 1300, facing: -1, enter: [['251', 20], 70, 2200], mouth: [['252', 'smile']]},
		{who: 'mom', x: 1520, facing: -1, enter: [['251', 30], 70, 2300], mouth: [['252', 'smile']]},
	],
	screen: (c) => (
		<>
			<Caption f={c.f} from={c.w('246')} to={c.w('248')} top={180} lines={['SEPTEMBER 9, 2031']} size={84} />
			{acc(c, '247', 'UNUSUALLY QUIET', 60)}
			{acc(c, '252', 'THE NUMBERS WERE NEVER THE POINT', 120)}
		</>
	),
});

/* ============================== OUR WORLD ================================ */
const S253 = scene({
	set: (c) => <City f={c.gf} />,
	cam: [960, 560, 1.0],
	keys: [
		['256', [700, 520, 1.5]],
		['257', [1000, 520, 1.5]],
		['258', [1320, 520, 1.5]],
		['259', [960, 560, 1.05]],
	],
	actors: [
		{who: 'hero', x: 420, facing: 1, look: [0.7, 0], gest: [['rubChin', '253', 60]]},
		{who: 'mom', x: 700, facing: -1, enter: ['255', 40, 600], tag: '?? ??? ????', glitch: true, tagOn: '256', tagDead: '259', gest: [['wave', '256', 40]]},
		{who: 'friend', x: 1000, facing: -1, tag: HT, glitch: true, tagOn: '257', tagDead: '259', gest: [['wave', '257', 30]]},
		{who: 'stranger', x: 1320, facing: -1, tag: HT, glitch: true, tagOn: '258', tagDead: '259', gest: [['presentF', '258', 70]]},
	],
	back: () => (
		<g>
			<rect x={1460} y={520} width={180} height={380} fill="#5a3a2a" />
			<rect x={1480} y={540} width={140} height={360} fill="#7a5a3a" />
			<circle cx={1600} cy={720} r={9} fill="#ffc94a" />
		</g>
	),
	screen: (c) => (
		<>
			{acc(c, '254', "WE'RE ALREADY LIVING IN IT", 80)}
			{acc(c, '259', "YOU JUST CAN'T SEE IT", 60)}
			{acc(c, '260', 'NEITHER CAN THEY', 50)}
		</>
	),
});

const phone = (
	<g transform="rotate(10)">
		<rect x={-26} y={-44} width={52} height={88} rx={9} fill="#15171f" />
		<rect x={-20} y={-36} width={40} height={72} rx={5} fill="#5ad8ff" />
	</g>
);
const S261 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [960, 560, 1.0],
	keys: [
		['264', [760, 520, 1.6]],
		['267', [960, 560, 1.15]],
	],
	actors: [
		{who: 'hero', x: 760, facing: 1, look: [0.3, 0.8], pose: (c, p) => (c.f < c.w('268') ? {...p, armF: [100, 40], head: p.head + 14} : p), handItem: phone},
		{who: 'friend', x: 1100, facing: -1, look: [-0.3, 0.8], pose: (c, p) => ({...p, armF: [100, 40], head: p.head + 14}), handItem: phone, tag: 'JUN 30 2071'},
		{who: 'boss', x: 1400, facing: -1, look: [-0.3, 0.8], pose: (c, p) => ({...p, armF: [100, 40], head: p.head + 14}), handItem: phone, tag: 'JAN 19 2049'},
		{who: 'stranger', x: 450, facing: 1, look: [0.3, 0.8], pose: (c, p) => ({...p, armF: [100, 40], head: p.head + 14}), handItem: phone, tag: 'APR 22 2052'},
	],
	screen: (c) => (
		<>
			{acc(c, '262', 'THEY KNEW HOW MUCH TIME THEY HAD', 90)}
			{acc(c, '264', 'SCROLLING', 22)}
			{acc(c, '265', 'WAITING', 26)}
			{acc(c, '266', 'POSTPONING', 34)}
			{acc(c, '268', 'THEY STOPPED WAITING', 80)}
		</>
	),
});

const S269 = scene({
	set: (c) => <City f={c.gf} dawn />,
	cam: [960, 560, 1.0],
	keys: [
		['270', [840, 520, 1.5]],
		['272', [960, 560, 1.1]],
	],
	actors: [
		{who: 'mom', x: 1240, facing: -1, enter: ['269', 60, 2200], mouth: [['269', 'smile']]},
		{who: 'hero', x: 1040, facing: 1, enter: ['269', 50, 400], look: [0.8, 0], mouth: [['269', 'smile']], tag: HT, glitch: true, gest: [['wave', '272', 40], ['point', '273', 50]], handF: 'point'},
	],
	front: (c) => (
		<g>
			<Bubble x={760} y={300} w={620} h={150} t={c.f - c.w('270')} tail={[200, 120]} thought>
				<text y={-6} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#1b1e2a">
					WHOSE DATE
				</text>
				<text y={36} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill="#1b1e2a">
					WOULD YOU SEE?
				</text>
			</Bubble>
		</g>
	),
	screen: (c) => (
		<>
			<Caption f={c.f} from={c.w('272')} to={c.dur} top={760} lines={['TELL ME IN', 'THE COMMENTS']} size={70} />
		</>
	),
});

const S275 = scene({
	set: (c) => <City f={c.gf} night />,
	cam: [960, 560, 1.0],
	cam2: [960, 540, 1.1],
	crowd: [{n: 7, x0: 100, x1: 1820, floor: 880, s: 0.8, seed: 'thought', depth: 1.1}],
	front: (c) =>
		c.f >= c.w('276') ? (
			<g>
				{Array.from({length: 7}).map((_, i) => (
					<Bubble key={i} x={100 + ((i + 0.5) * 1720) / 7} y={470 - (i % 2) * 40} w={140} h={80} t={c.f - c.w('276') - i * 6} tail={[0, 70]} thought>
						<text y={12} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={900} fill="#1b1e2a">
							{['?!', '…', '!!', '#@', '?', '…', '!'][i]}
						</text>
					</Bubble>
				))}
			</g>
		) : null,
	screen: (c) => (
		<>
			<Caption f={c.f} from={c.w('277')} to={c.dur} top={120} lines={['NEXT: EVERYONE HEARS', 'EACH OTHER’S THOUGHTS']} size={70} />
		</>
	),
});

export const SHOTS_B: ShotDef[] = [
	{at: '133', C: S133, whip: true},
	{at: '137', C: S137, whip: true},
	{at: '146', C: S146, whip: true},
	{at: '147', C: S147, whip: true},
	{at: '148', C: S148, whip: true},
	{at: '154', C: S154, whip: true},
	{at: '157', C: S157, whip: true},
	{at: '164', C: S164, whip: true},
	{at: '169', C: S169, whip: true},
	{at: '174', C: S174, whip: true},
	{at: '179', C: S179, whip: true},
	{at: '182', C: S182, whip: true},
	{at: '188', C: S188, whip: true},
	{at: '193', C: S193, whip: true},
	{at: '196', C: S196, whip: true},
	{at: '201', C: S201, whip: true},
	{at: '208', C: S208, whip: true},
	{at: '213', C: S213, whip: true},
	{at: '220', C: S220, whip: true},
	{at: '227', C: S227, whip: true},
	{at: '232', C: S232, whip: true},
	{at: '237', C: S237, whip: true},
	{at: '243', C: S243, whip: true},
	{at: '246', C: S246, whip: true},
	{at: '253', C: S253, whip: true},
	{at: '261', C: S261, whip: true},
	{at: '269', C: S269, whip: true},
	{at: '275', C: S275, whip: true},
];
export {RuleCard};
