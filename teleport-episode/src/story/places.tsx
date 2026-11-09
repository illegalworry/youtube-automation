import React from 'react';
import {random} from 'remotion';
import {Svg} from '../engine/camera';
import {darken, lighten} from '../engine/color';
import {FONT, HAND} from '../kit/ui';
import {LIME} from './cast';

/* Locations made for "What if you could teleport?". Flat, big shapes, one light, a living detail. */

const G: React.FC<{id: string; s: [number, string][]; x2?: number; y2?: number; r?: boolean}> = ({id, s, x2 = 0, y2 = 1, r}) =>
	r ? (
		<radialGradient id={id}>
			{s.map(([o, c], i) => (
				<stop key={i} offset={o} stopColor={c} />
			))}
		</radialGradient>
	) : (
		<linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
			{s.map(([o, c], i) => (
				<stop key={i} offset={o} stopColor={c} />
			))}
		</linearGradient>
	);

export type SkyKind = 'day' | 'noon' | 'sunset' | 'dawn' | 'night' | 'storm' | 'warm';
const SKY: Record<SkyKind, [string, string, string]> = {
	day: ['#5fb4f0', '#a8dcf6', '#e8f6fb'],
	noon: ['#3f9be6', '#8fd0f6', '#e6f7ff'],
	sunset: ['#2b2f6b', '#e0607a', '#ffc27a'],
	dawn: ['#3a4a8a', '#f29a8a', '#ffe0b0'],
	night: ['#070a20', '#16204a', '#2a3466'],
	storm: ['#161a22', '#2b333f', '#46505c'],
	warm: ['#4fb0e8', '#9fd8f2', '#fff2c8'],
};
export const Sky: React.FC<{k: SkyKind; f: number; sun?: [number, number]; clouds?: boolean; id: string}> = ({k, f, sun, clouds = true, id}) => {
	const c = SKY[k];
	return (
		<Svg>
			<defs>
				<G id={id} s={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
			</defs>
			<rect x={-600} y={-500} width={3100} height={1700} fill={`url(#${id})`} />
			{sun ? (
				<>
					<circle cx={sun[0]} cy={sun[1]} r={180} fill={k === 'sunset' ? '#ffb070' : '#fff6c8'} opacity={0.35} style={{filter: 'blur(30px)'}} />
					<circle cx={sun[0]} cy={sun[1]} r={k === 'sunset' ? 90 : 70} fill={k === 'sunset' ? '#ffd27a' : '#fffbe6'} />
				</>
			) : null}
			{k === 'night'
				? Array.from({length: 70}).map((_, i) => (
						<circle key={i} cx={random(id + 'sx' + i) * 2400 - 240} cy={random(id + 'sy' + i) * 600 - 100} r={1 + random(id + 'sr' + i) * 2} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
					))
				: null}
			{clouds && k !== 'night'
				? Array.from({length: 6}).map((_, i) => {
						const x = ((random(id + 'cx' + i) * 2600 + f * (0.3 + i * 0.08)) % 2800) - 500;
						const y = 80 + random(id + 'cy' + i) * 260;
						const s = 0.6 + random(id + 'cs' + i) * 0.9;
						const col = k === 'storm' ? '#3a4350' : k === 'sunset' ? '#f29aa0' : '#ffffff';
						return (
							<g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={k === 'storm' ? 0.9 : 0.85}>
								<ellipse cx={0} cy={0} rx={120} ry={40} fill={col} />
								<ellipse cx={-50} cy={-22} rx={60} ry={42} fill={col} />
								<ellipse cx={40} cy={-30} rx={70} ry={50} fill={col} />
							</g>
						);
					})
				: null}
		</Svg>
	);
};

/* rolling hills + ground for outdoor scenes */
export const Hills: React.FC<{c?: string; far?: string; y?: number; id: string}> = ({c = '#6cc24a', far = '#9ad87a', y = 620, id}) => (
	<Svg>
		<path d={`M-600,${y} Q-200,${y - 140} 300,${y - 40} T1200,${y - 70} T2100,${y - 30} T2600,${y - 60} L2600,1300 L-600,1300 Z`} fill={far} />
		{Array.from({length: 9}).map((_, i) => (
			<g key={i} transform={`translate(${-300 + i * 330 + random(id + 't' + i) * 120},${y - 30 - random(id + 'ty' + i) * 30})`}>
				<rect x={-5} y={-10} width={10} height={40} fill="#5a4030" />
				<circle cx={0} cy={-26} r={30 + random(id + 'tr' + i) * 14} fill={darken(far, 0.18)} />
			</g>
		))}
		<path d={`M-600,${y + 120} Q100,${y + 40} 900,${y + 110} T2600,${y + 90} L2600,1300 L-600,1300 Z`} fill={c} />
	</Svg>
);

export const Ground: React.FC<{y?: number; c: string; stripes?: boolean}> = ({y = 900, c, stripes}) => (
	<Svg>
		<rect x={-600} y={y - 6} width={3100} height={700} fill={c} />
		<rect x={-600} y={y - 6} width={3100} height={8} fill={darken(c, 0.15)} />
		{stripes ? Array.from({length: 14}).map((_, i) => <ellipse key={i} cx={-400 + i * 240} cy={y + 60 + (i % 3) * 40} rx={60} ry={8} fill={darken(c, 0.08)} />) : null}
	</Svg>
);

/* --------------------------- school exam classroom --------------------------- */
export const ClassRoom: React.FC<{f: number; board?: string; clock?: string}> = ({f, board = 'FINAL EXAM', clock = '8:59'}) => (
	<Svg>
		<defs>
			<G id="cr-w" s={[[0, '#d9e6c8'], [1, '#c2d6ae']]} />
		</defs>
		<rect x={-600} y={-400} width={3100} height={1400} fill="url(#cr-w)" />
		<rect x={-600} y={640} width={3100} height={14} fill="#9ab884" />
		<rect x={380} y={140} width={1160} height={420} rx={10} fill="#6b4a2a" />
		<rect x={400} y={160} width={1120} height={380} fill="#2f4a3d" />
		<text x={960} y={300} textAnchor="middle" fontSize={96} fontFamily={HAND} fontWeight={700} fill="#f4f1e6">
			{board}
		</text>
		<text x={960} y={400} textAnchor="middle" fontSize={54} fontFamily={HAND} fill="#f6e7a1">
			9:00 — 11:00 · no phones!
		</text>
		<g transform="translate(1720,220)">
			<circle r={70} fill="#fff" stroke="#2b2f3a" strokeWidth={10} />
			<line x1={0} y1={0} x2={0} y2={-48} stroke="#2b2f3a" strokeWidth={8} strokeLinecap="round" />
			<line x1={0} y1={0} x2={34} y2={6} stroke="#2b2f3a" strokeWidth={8} strokeLinecap="round" transform={`rotate(${clock === '8:59' ? 355 + Math.sin(f / 4) : 0})`} />
			<line x1={0} y1={0} x2={0} y2={-58} stroke="#d94a3a" strokeWidth={3} transform={`rotate(${f * 6})`} />
		</g>
		<rect x={-600} y={900} width={3100} height={600} fill="#b98a5a" />
		{Array.from({length: 9}).map((_, i) => (
			<line key={i} x1={-600} y1={910 + i * i * 10} x2={2500} y2={910 + i * i * 10} stroke="#a37a4c" strokeWidth={2} />
		))}
	</Svg>
);
/* a row of exam desks with extras' heads (front layer) */
export const DeskRow: React.FC<{y?: number; n?: number; x0?: number; gap?: number}> = ({y = 800, n = 6, x0 = 60, gap = 340}) => (
	<Svg>
		{Array.from({length: n}).map((_, i) => (
			<g key={i} transform={`translate(${x0 + i * gap},${y})`}>
				<rect x={-110} y={0} width={220} height={16} rx={4} fill="#d8b07a" />
				<rect x={-100} y={16} width={12} height={110} fill="#6a5040" />
				<rect x={88} y={16} width={12} height={110} fill="#6a5040" />
				<rect x={-40} y={-8} width={80} height={10} fill="#fbfaf4" />
			</g>
		))}
	</Svg>
);

/* ------------------------------- bathroom shower ------------------------------ */
export const Shower: React.FC<{f: number; on?: number}> = ({f, on = 1}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill="#cfe6ec" />
		{Array.from({length: 24}).map((_, r) =>
			Array.from({length: 34}).map((__, c) => <rect key={r + '-' + c} x={-500 + c * 90} y={-200 + r * 90} width={86} height={86} fill="#e4f2f5" />),
		)}
		<rect x={-600} y={900} width={3100} height={500} fill="#9ec6cf" />
		{/* shower head */}
		<path d="M960,60 L960,150 Q960,170 990,175" stroke="#9aa3b5" strokeWidth={14} fill="none" />
		<path d="M940,170 L1060,170 L1040,200 L960,200 Z" fill="#b9c2d0" />
		{on > 0
			? Array.from({length: 26}).map((_, i) => {
					const x = 950 + (i % 13) * 9 + (i > 12 ? 4 : 0);
					const y = 210 + ((f * 34 + random('sh' + i) * 600) % 700);
					return <line key={i} x1={x + (y - 200) * (i % 13 - 6) * 0.05} y1={y} x2={x + (y - 160) * (i % 13 - 6) * 0.05} y2={y + 40} stroke="#7fc6e6" strokeWidth={4} strokeLinecap="round" opacity={0.75 * on} />;
				})
			: null}
		{/* curtain pulled aside */}
		<rect x={500} y={40} width={1000} height={10} rx={5} fill="#7a8494" />
		<path d="M520,50 q30,400 0,850 h120 q-30,-400 0,-850 z" fill={LIME} opacity={0.9} />
		<path d="M560,50 q-20,420 20,850" stroke={darken(LIME, 0.2)} strokeWidth={6} fill="none" />
	</Svg>
);

/* ------------------------------ outdoor variants ------------------------------ */
export const CarWash: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={500} y={300} width={980} height={600} fill="#2f6fd8" />
		<rect x={540} y={360} width={900} height={540} fill="#1b2f5a" />
		<text x={990} y={350} textAnchor="middle" fontSize={56} fontFamily={FONT} fill="#fff">
			SUPER WASH
		</text>
		{[0, 1, 2].map((i) => (
			<g key={i} transform={`translate(${700 + i * 280},640) rotate(${f * 14})`}>
				{Array.from({length: 10}).map((_, j) => (
					<rect key={j} x={-8} y={-130} width={16} height={130} fill={['#e86aa0', '#3fc1c9', '#ffd34a'][i]} transform={`rotate(${j * 36})`} opacity={0.85} />
				))}
			</g>
		))}
		{Array.from({length: 40}).map((_, i) => (
			<circle key={i} cx={560 + random('bub' + i) * 860} cy={900 - ((f * 3 + random('bubY' + i) * 500) % 520)} r={6 + random('bubR' + i) * 12} fill="#fff" opacity={0.6} />
		))}
	</Svg>
);

export const Cow: React.FC<{x: number; y: number; s?: number; f: number; flip?: boolean}> = ({x, y, s = 1, f, flip}) => (
	<g transform={`translate(${x},${y}) scale(${(flip ? -1 : 1) * s},${s})`}>
		<ellipse cx={0} cy={-120} rx={130} ry={70} fill="#f6f4ee" />
		<ellipse cx={-40} cy={-140} rx={40} ry={30} fill="#1b1b22" />
		<ellipse cx={60} cy={-100} rx={30} ry={22} fill="#1b1b22" />
		{[-90, -50, 50, 90].map((lx, i) => (
			<rect key={i} x={lx - 9} y={-70} width={18} height={70} fill="#f6f4ee" />
		))}
		<g transform={`translate(140,-150) rotate(${Math.sin(f / 12) * 6})`}>
			<ellipse cx={20} cy={0} rx={45} ry={36} fill="#f6f4ee" />
			<ellipse cx={42} cy={14} rx={26} ry={18} fill="#f2a8b4" />
			<circle cx={14} cy={-8} r={6} fill="#111" />
			<path d="M-6,-30 l-14,-16 M30,-32 l10,-18" stroke="#c9b48a" strokeWidth={6} strokeLinecap="round" />
		</g>
		<path d={`M-128,-130 q-30,${20 + Math.sin(f / 6) * 10} -20,60`} stroke="#1b1b22" strokeWidth={5} fill="none" />
	</g>
);

export const ParkingLot: React.FC = () => (
	<Svg>
		<rect x={-600} y={700} width={3100} height={800} fill="#5a5f6b" />
		{Array.from({length: 12}).map((_, i) => (
			<rect key={i} x={-300 + i * 240} y={760} width={10} height={140} fill="#f2f2f2" transform={`skewX(-20)`} />
		))}
		{[0, 1, 2, 3].map((i) => (
			<g key={i} transform={`translate(${-100 + i * 600},${720})`}>
				<rect x={0} y={-80} width={300} height={90} rx={30} fill={['#d94a3a', '#3a6fd2', '#e8e8ee', '#2a2f3a'][i]} />
				<rect x={50} y={-130} width={190} height={60} rx={20} fill={darken(['#d94a3a', '#3a6fd2', '#e8e8ee', '#2a2f3a'][i], 0.15)} />
				<circle cx={60} cy={12} r={28} fill="#16171d" />
				<circle cx={240} cy={12} r={28} fill="#16171d" />
			</g>
		))}
	</Svg>
);

export const Wedding: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<path d="M200,300 L960,140 L1720,300 Z" fill="#fbf7f0" />
		<rect x={200} y={300} width={1520} height={30} fill="#efe6d8" />
		{Array.from({length: 18}).map((_, i) => (
			<circle key={i} cx={220 + i * 88} cy={340 + Math.sin(i) * 6} r={9} fill={['#ffd34a', '#ff9ac0', '#9ad8ff'][i % 3]} opacity={0.6 + 0.4 * Math.sin(f / 6 + i)} />
		))}
		{/* cake table */}
		<rect x={1180} y={760} width={420} height={140} fill="#fbfaf4" />
		<rect x={1300} y={640} width={180} height={120} rx={8} fill="#fff3f6" stroke="#f2b8c8" strokeWidth={4} />
		<rect x={1330} y={560} width={120} height={80} rx={8} fill="#fff3f6" stroke="#f2b8c8" strokeWidth={4} />
		<rect x={1355} y={500} width={70} height={60} rx={6} fill="#fff3f6" stroke="#f2b8c8" strokeWidth={4} />
		<circle cx={1390} cy={492} r={10} fill="#e23b3b" />
	</Svg>
);

/* lake with pier, reeds, gentle waves; `front` draws the water surface over the actors */
export const Lake: React.FC<{f: number; front?: boolean; splash?: number}> = ({f, front, splash = -1}) =>
	front ? (
		<Svg>
			<rect x={-600} y={880} width={3100} height={600} fill="#2f7fb8" opacity={0.92} />
			{Array.from({length: 18}).map((_, i) => (
				<path key={i} d={`M${-500 + ((i * 190 + f * 2) % 2800)},${900 + (i % 4) * 34} q30,-10 60,0`} stroke="#bfe6ff" strokeWidth={4} fill="none" opacity={0.6} />
			))}
			{splash >= 0 && splash < 40
				? Array.from({length: 16}).map((_, i) => {
						const a = Math.PI * (0.1 + 0.8 * (i / 15));
						const k = splash / 40;
						return <circle key={i} cx={1300 + Math.cos(a) * 260 * k * (i % 2 ? 1 : -1)} cy={880 - Math.sin(a) * 300 * k + 500 * k * k} r={14 - 10 * k} fill="#d8f2ff" opacity={1 - k} />;
					})
				: null}
		</Svg>
	) : (
		<Svg>
			<rect x={-600} y={640} width={3100} height={900} fill="#3d8cc4" />
			<path d="M-600,640 Q300,600 900,640 T2500,630 L2500,660 L-600,660 Z" fill="#4f9b4a" />
			{Array.from({length: 22}).map((_, i) => (
				<line key={i} x1={-400 + i * 140} y1={720 + (i % 5) * 30} x2={-360 + i * 140} y2={720 + (i % 5) * 30} stroke="#bfe6ff" strokeWidth={3} opacity={0.5 + 0.3 * Math.sin(f / 10 + i)} />
			))}
			{/* grass bank on the left where the hero lands */}
			<path d="M-600,860 Q200,820 900,880 L900,1300 L-600,1300 Z" fill="#5fae48" />
			{Array.from({length: 14}).map((_, i) => (
				<path key={i} d={`M${600 + i * 22},880 q${6 + Math.sin(f / 15 + i) * 6},-60 ${2},-110`} stroke="#3d7a30" strokeWidth={5} fill="none" />
			))}
			{/* pier */}
			<rect x={1500} y={760} width={500} height={20} fill="#8a6a44" />
			{[1520, 1700, 1880].map((x) => (
				<rect key={x} x={x} y={780} width={16} height={110} fill="#6a5034" />
			))}
		</Svg>
	);

/* --------------------------------- Paris ---------------------------------- */
export const Eiffel: React.FC<{x: number; y: number; s?: number; c?: string; lit?: boolean}> = ({x, y, s = 1, c = '#3a3550', lit}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-150,0 Q-60,-160 -22,-420 L-12,-640 L0,-700 L12,-640 L22,-420 Q60,-160 150,0 L90,0 Q30,-120 0,-130 Q-30,-120 -90,0 Z" fill={c} />
		<rect x={-70} y={-250} width={140} height={14} fill={c} />
		<rect x={-40} y={-440} width={80} height={10} fill={c} />
		{lit ? Array.from({length: 30}).map((_, i) => <circle key={i} cx={(random('ef' + i) - 0.5) * 220 * (1 - random('efy' + i))} cy={-random('efy' + i) * 650} r={2.5} fill="#ffe08a" />) : null}
	</g>
);
export const ParisFar: React.FC<{k: SkyKind}> = ({k}) => {
	const c = k === 'sunset' ? '#5a3a5e' : k === 'dawn' ? '#7a6a8e' : '#7d8fa8';
	return (
		<Svg>
			{Array.from({length: 16}).map((_, i) => (
				<g key={i} transform={`translate(${-400 + i * 180},${640})`}>
					<rect x={0} y={-90 - (i % 3) * 30} width={160} height={200} fill={c} />
					<path d={`M-6,${-90 - (i % 3) * 30} L80,${-140 - (i % 3) * 30} L166,${-90 - (i % 3) * 30} Z`} fill={darken(c, 0.15)} />
				</g>
			))}
			<Eiffel x={1450} y={660} s={0.95} c={darken(c, 0.25)} lit={k === 'sunset'} />
		</Svg>
	);
};
/* stone bridge over the river: deck at y=900, balustrade, lamps; river below */
export const ParisBridge: React.FC<{f: number; k: SkyKind}> = ({f, k}) => {
	const stone = k === 'sunset' ? '#c99a7a' : '#d8c8a8';
	return (
		<Svg>
			<rect x={-600} y={700} width={3100} height={300} fill={k === 'sunset' ? '#6a4a7a' : '#4f86b0'} />
			{Array.from({length: 16}).map((_, i) => (
				<line key={i} x1={-400 + ((i * 170 + f) % 2800)} y1={740 + (i % 4) * 30} x2={-350 + ((i * 170 + f) % 2800)} y2={740 + (i % 4) * 30} stroke="#fff" strokeWidth={3} opacity={0.35} />
			))}
			<rect x={-600} y={890} width={3100} height={500} fill={darken(stone, 0.1)} />
			<rect x={-600} y={760} width={3100} height={24} rx={6} fill={stone} />
			{Array.from({length: 40}).map((_, i) => (
				<rect key={i} x={-580 + i * 80} y={784} width={26} height={106} rx={10} fill={lighten(stone, 0.08)} />
			))}
			<rect x={-600} y={880} width={3100} height={16} fill={darken(stone, 0.2)} />
			{[300, 1100, 1900].map((x) => (
				<g key={x}>
					<rect x={x - 8} y={500} width={16} height={260} fill="#2b2f3a" />
					<circle cx={x} cy={490} r={26} fill={k === 'sunset' ? '#ffe08a' : '#f2f2f2'} opacity={k === 'sunset' ? 1 : 0.6} />
					{k === 'sunset' ? <circle cx={x} cy={490} r={70} fill="#ffd27a" opacity={0.25} style={{filter: 'blur(10px)'}} /> : null}
				</g>
			))}
		</Svg>
	);
};

/* rooftop with chimneys and a skyline */
export const Rooftop: React.FC<{f: number; city: 'paris' | 'home'}> = ({f, city}) => (
	<Svg>
		{city === 'paris' ? <Eiffel x={1300} y={700} s={0.8} c="#4a2f52" lit /> : null}
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={-400 + i * 200} y={560 + (i % 4) * 40} width={180} height={500} fill={city === 'paris' ? '#5a3a5e' : '#3d3a62'} />
		))}
		{Array.from({length: 40}).map((_, i) => (
			<rect key={'w' + i} x={-380 + (i % 14) * 200 + (i % 3) * 40} y={620 + Math.floor(i / 14) * 80 + (i % 4) * 40} width={20} height={26} fill="#ffd27a" opacity={0.4 + 0.4 * Math.sin(f / 30 + i)} />
		))}
		<path d="M-600,900 L2500,900 L2500,1400 L-600,1400 Z" fill={city === 'paris' ? '#6a6a86' : '#8a5a4a'} />
		<path d="M-600,900 L2500,900 L2500,920 L-600,920 Z" fill="#2b2f3a" />
		<rect x={300} y={760} width={70} height={140} fill={city === 'paris' ? '#c97a5a' : '#6a3a2a'} />
		<rect x={290} y={750} width={90} height={18} fill="#4a3a3a" />
		<rect x={1600} y={780} width={60} height={120} fill={city === 'paris' ? '#c97a5a' : '#6a3a2a'} />
	</Svg>
);

/* ------------------------------- pizzeria (Naples) ------------------------------ */
export const Pizzeria: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill="#f3d9a8" />
		{Array.from({length: 30}).map((_, i) => (
			<rect key={i} x={-600 + i * 110} y={480} width={110} height={420} fill={i % 2 ? '#2f8a4a' : '#f6f2e8'} />
		))}
		<rect x={-600} y={470} width={3100} height={14} fill="#d94a3a" />
		{/* wood oven */}
		<path d="M1260,640 Q1260,330 1560,330 Q1860,330 1860,640 Z" fill="#c9653a" />
		<path d="M1440,640 Q1440,520 1560,520 Q1680,520 1680,640 Z" fill="#2a120a" />
		<path d={`M1470,640 Q${1500 + Math.sin(f / 3) * 10},${560 + Math.sin(f / 2) * 8} 1530,640 Q${1560 + Math.sin(f / 4) * 8},${540} 1600,640 Q${1625},${575 + Math.sin(f / 3) * 10} 1650,640 Z`} fill="#ffb03a" />
		<circle cx={1560} cy={610} r={90} fill="#ff8a3a" opacity={0.25 + 0.1 * Math.sin(f / 5)} style={{filter: 'blur(20px)'}} />
		<text x={500} y={300} textAnchor="middle" fontSize={84} fontFamily={HAND} fontWeight={700} fill="#d94a3a">
			Pizzeria Napoli
		</text>
		<text x={500} y={380} textAnchor="middle" fontSize={40} fontFamily={HAND} fill="#2f8a4a">
			dal 1952
		</text>
		<rect x={-600} y={900} width={3100} height={600} fill="#a8805a" />
	</Svg>
);
export const PizzaCounter: React.FC = () => (
	<Svg>
		<rect x={700} y={700} width={1400} height={30} fill="#e9dcc4" />
		<rect x={720} y={730} width={1380} height={240} fill="#7a4a2a" />
		<rect x={720} y={760} width={1380} height={14} fill="#d94a3a" />
	</Svg>
);
export const PizzaBox: React.FC<{x: number; y: number; s?: number; open?: number; steam?: number; f?: number}> = ({x, y, s = 1, open = 0, steam = 0, f = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-70} y={-20} width={140} height={22} fill="#e2c08a" stroke="#a8804a" strokeWidth={3} />
		<g transform={`translate(-70,-20) rotate(${-110 * open})`}>
			<rect x={0} y={-4} width={140} height={8} fill="#e2c08a" stroke="#a8804a" strokeWidth={3} />
		</g>
		{open > 0.3 ? <ellipse cx={0} cy={-22} rx={60} ry={10} fill="#e8743a" /> : null}
		{steam > 0
			? [0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-40 q${10 * Math.sin(f / 6 + i)},-20 0,-40 q${-10 * Math.sin(f / 6 + i)},-20 0,-40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.6 * steam} />)
			: null}
	</g>
);

/* ------------------------------- living room / TV ------------------------------ */
export const LivingRoom: React.FC<{f: number; rain?: boolean; night?: boolean}> = ({f, rain, night}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill={night ? '#3a3552' : '#e7c9a0'} />
		<rect x={-600} y={640} width={3100} height={12} fill={night ? '#2a2540' : '#c9a07a'} />
		<rect x={1380} y={160} width={380} height={300} fill={rain ? '#3a4458' : '#9fd2f0'} stroke="#fff" strokeWidth={14} />
		{rain ? Array.from({length: 30}).map((_, i) => <line key={i} x1={1390 + random('lr' + i) * 360} y1={170 + ((f * 18 + random('lry' + i) * 300) % 280)} x2={1386 + random('lr' + i) * 360} y2={190 + ((f * 18 + random('lry' + i) * 300) % 280)} stroke="#a9c2f2" strokeWidth={2} opacity={0.7} />) : null}
		<rect x={-600} y={900} width={3100} height={600} fill={night ? '#2a2440' : '#9a6a44'} />
		{/* rug */}
		<ellipse cx={900} cy={960} rx={700} ry={50} fill={night ? '#4a3a6a' : '#c94a5a'} opacity={0.8} />
	</Svg>
);
export const Couch: React.FC<{x?: number; c?: string}> = ({x = 1180, c = '#3d6fd6'}) => (
	<Svg>
		<rect x={x - 330} y={640} width={660} height={160} rx={40} fill={darken(c, 0.1)} />
		<rect x={x - 300} y={760} width={600} height={80} rx={24} fill={c} />
		<rect x={x - 360} y={700} width={80} height={180} rx={30} fill={darken(c, 0.2)} />
		<rect x={x + 280} y={700} width={80} height={180} rx={30} fill={darken(c, 0.2)} />
		<rect x={x - 300} y={840} width={600} height={40} fill={darken(c, 0.3)} />
	</Svg>
);
/* TV set in the world; children are drawn in screen-local coords 0..W x 0..H */
export const TV: React.FC<{x: number; y: number; w?: number; h?: number; children?: React.ReactNode; glow?: string; id: string}> = ({x, y, w = 420, h = 250, children, glow = '#6aa8ff', id}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2 - 60} y={-h / 2 - 60} width={w + 120} height={h + 120} fill={glow} opacity={0.18} style={{filter: 'blur(30px)'}} />
		<rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={10} fill="#15161f" />
		<clipPath id={id}>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} />
		</clipPath>
		<g clipPath={`url(#${id})`}>
			<rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#0b0d1e" />
			<g transform={`translate(${-w / 2},${-h / 2})`}>{children}</g>
		</g>
		<rect x={-40} y={h / 2 + 14} width={80} height={30} fill="#2b2f3a" />
		<rect x={-120} y={h / 2 + 40} width={240} height={14} rx={6} fill="#2b2f3a" />
	</g>
);
export const TVStand: React.FC<{x: number}> = ({x}) => (
	<Svg>
		<rect x={x - 260} y={720} width={520} height={180} rx={10} fill="#5a3a2a" />
		<rect x={x - 240} y={740} width={230} height={70} rx={6} fill="#6a4a34" />
		<rect x={x + 10} y={740} width={230} height={70} rx={6} fill="#6a4a34" />
	</Svg>
);

/* --------------------------------- care home --------------------------------- */
export const CareRoom: React.FC<{f: number; night?: boolean}> = ({f, night}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill={night ? '#2c3456' : '#dbe8e2'} />
		<rect x={-600} y={600} width={3100} height={300} fill={night ? '#252c4a' : '#c4d8cf'} />
		<rect x={-600} y={596} width={3100} height={10} fill={night ? '#1b2140' : '#a9c4b8'} />
		<rect x={260} y={140} width={420} height={330} fill={night ? '#0b1030' : '#9fd2f0'} stroke="#fff" strokeWidth={14} />
		{night ? <circle cx={580} cy={220} r={28} fill="#eef1ff" /> : <circle cx={360} cy={250} r={40} fill="#fff6c8" />}
		<line x1={470} y1={140} x2={470} y2={470} stroke="#fff" strokeWidth={10} />
		{/* plant */}
		<rect x={760} y={780} width={90} height={110} rx={10} fill="#c9653a" />
		{Array.from({length: 7}).map((_, i) => (
			<ellipse key={i} cx={805 + Math.cos(i) * 40} cy={740 - i * 12} rx={22} ry={50} fill="#4f9b4a" transform={`rotate(${-50 + i * 16 + Math.sin(f / 30 + i) * 3} ${805} 780)`} />
		))}
		{/* bed */}
		<rect x={1100} y={720} width={760} height={120} rx={14} fill="#c9ccd8" />
		<rect x={1840} y={560} width={30} height={330} rx={8} fill="#9aa0ae" />
		<rect x={1100} y={640} width={30} height={250} rx={8} fill="#9aa0ae" />
		<rect x={1130} y={680} width={710} height={70} rx={30} fill={night ? '#d9d4e6' : '#f6f2e8'} />
		<rect x={1700} y={640} width={130} height={60} rx={24} fill="#fff" />
		<rect x={-600} y={900} width={3100} height={600} fill={night ? '#3a3852' : '#b8a888'} />
	</Svg>
);

/* --------------------------- Italian cliff village --------------------------- */
export const LemonTree: React.FC<{x: number; y: number; s?: number; f: number; glow?: number}> = ({x, y, s = 1, f, glow = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{glow > 0 ? <circle cx={0} cy={-420} r={420} fill="#fff2a0" opacity={0.25 * glow} style={{filter: 'blur(40px)'}} /> : null}
		<path d="M-50,0 Q-30,-150 -60,-260 Q-20,-240 0,-300 Q30,-240 70,-270 Q30,-150 50,0 Z" fill="#6a4a2a" />
		<path d="M-20,-200 Q-120,-300 -180,-330 M20,-220 Q120,-300 190,-320" stroke="#6a4a2a" strokeWidth={26} strokeLinecap="round" fill="none" />
		{Array.from({length: 22}).map((_, i) => {
			const a = random('lt' + i) * Math.PI * 2;
			const r = 120 + random('ltr' + i) * 200;
			return <circle key={i} cx={Math.cos(a) * r * 1.2} cy={-430 + Math.sin(a) * r * 0.6 + Math.sin(f / 30 + i) * 3} r={110 + random('lts' + i) * 40} fill={i % 3 ? '#3f8a3a' : '#4f9e46'} />;
		})}
		{Array.from({length: 26}).map((_, i) => {
			const a = random('lm' + i) * Math.PI * 2;
			const r = 60 + random('lmr' + i) * 280;
			return <ellipse key={'l' + i} cx={Math.cos(a) * r * 1.15} cy={-420 + Math.sin(a) * r * 0.55 + Math.sin(f / 25 + i) * 4} rx={26} ry={20} fill="#ffe03a" stroke="#e8b81a" strokeWidth={3} />;
		})}
	</g>
);
export const CliffSea: React.FC<{f: number; k?: SkyKind}> = ({f, k = 'warm'}) => (
	<Svg>
		<rect x={-600} y={560} width={3100} height={900} fill={k === 'warm' ? '#2a8fd0' : '#3a7ab8'} />
		{Array.from({length: 26}).map((_, i) => (
			<path key={i} d={`M${-500 + ((i * 140 + f * 1.5) % 2900)},${600 + (i % 6) * 50} q20,-8 40,0`} stroke="#d8f2ff" strokeWidth={3} fill="none" opacity={0.6} />
		))}
		<circle cx={300} cy={640} r={260} fill="#fff6c8" opacity={0.15} style={{filter: 'blur(30px)'}} />
	</Svg>
);
export const Village: React.FC<{f: number}> = ({f}) => (
	<Svg>
		{/* cliff mass */}
		<path d="M-600,1300 L-600,620 Q-200,560 200,600 Q600,520 1000,560 Q1500,500 1900,560 L2500,560 L2500,1300 Z" fill="#c9a77a" />
		<path d="M-600,1300 L-600,700 Q0,660 400,700 L500,1300 Z" fill="#b8956a" />
		{Array.from({length: 14}).map((_, i) => {
			const x = -300 + i * 190;
			const y = 520 - (i % 3) * 40;
			const c = ['#fbf7f0', '#f6e2c4', '#f2c9a8', '#fbf0d8'][i % 4];
			return (
				<g key={i}>
					<rect x={x} y={y} width={150} height={120} fill={c} />
					<rect x={x + 20} y={y + 30} width={30} height={40} fill="#3f7ab8" />
					<rect x={x + 90} y={y + 30} width={30} height={40} fill="#3f7ab8" />
					<path d={`M${x - 8},${y} L${x + 75},${y - 40} L${x + 158},${y} Z`} fill="#c9653a" />
				</g>
			);
		})}
	</Svg>
);
export const Terrace: React.FC = () => (
	<Svg>
		<rect x={-600} y={890} width={3100} height={600} fill="#d8b884" />
		<rect x={-600} y={886} width={3100} height={10} fill="#a8885a" />
		{Array.from({length: 30}).map((_, i) => (
			<rect key={i} x={-600 + i * 110} y={900 + (i % 2) * 30} width={100} height={26} rx={4} fill="#caa874" />
		))}
		{/* old wall of the empty house */}
		<rect x={-400} y={360} width={700} height={540} fill="#efe3c8" />
		<rect x={-80} y={560} width={150} height={330} fill="#6a4a2a" />
		<rect x={140} y={460} width={100} height={110} fill="#3f6a8a" />
		<path d="M-420,360 L-50,250 L320,360 Z" fill="#b8653a" />
	</Svg>
);
export const Steps: React.FC = () => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill="#c9a77a" />
		{Array.from({length: 22}).map((_, i) => (
			<rect key={i} x={-600 + i * 60} y={1000 - i * 40} width={3100} height={40} fill={i % 2 ? '#e2c89a' : '#d8bc8a'} />
		))}
	</Svg>
);

/* hedge in the care-home garden */
export const Hedge: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={-600} y={560} width={3100} height={360} rx={60} fill="#3f8a3a" />
		{Array.from({length: 40}).map((_, i) => (
			<circle key={i} cx={-560 + i * 80} cy={570 + Math.sin(i * 1.7) * 14} r={60} fill={i % 2 ? '#4a9a44' : '#3f8a3a'} />
		))}
		{Array.from({length: 12}).map((_, i) => (
			<circle key={'f' + i} cx={-400 + i * 230} cy={640 + (i % 3) * 60} r={10} fill={['#ffd34a', '#ff9ac0', '#fff'][i % 3]} opacity={0.8 + 0.2 * Math.sin(f / 10 + i)} />
		))}
	</Svg>
);

/* ------------------------------------ flood ------------------------------------ */
export const FloodTown: React.FC<{f: number; level?: number}> = ({f, level = 0}) => (
	<Svg>
		{Array.from({length: 9}).map((_, i) => {
			const x = -300 + i * 300;
			const h = 260 + (i % 3) * 60;
			return (
				<g key={i}>
					<rect x={x} y={760 - h} width={240} height={h + 400} fill={['#6a5a5a', '#5a6470', '#7a6a58'][i % 3]} />
					<path d={`M${x - 20},${760 - h} L${x + 120},${700 - h} L${x + 260},${760 - h} Z`} fill="#3a2f2f" />
					<rect x={x + 40} y={800 - h} width={50} height={60} fill="#ffd27a" opacity={0.25} />
					<rect x={x + 150} y={800 - h} width={50} height={60} fill="#ffd27a" opacity={0.25} />
				</g>
			);
		})}
		<rect x={-600} y={620 - level} width={3100} height={900} fill="#4a5a52" opacity={0.95} />
		{Array.from({length: 30}).map((_, i) => (
			<path key={i} d={`M${-500 + ((i * 120 + f * 6) % 2900)},${640 - level + (i % 7) * 40} q30,-14 60,0`} stroke="#9fb4a8" strokeWidth={4} fill="none" opacity={0.7} />
		))}
		{[0, 1].map((i) => (
			<rect key={'d' + i} x={((f * (4 + i * 3) + i * 900) % 2700) - 400} y={650 - level + i * 80} width={80 + i * 40} height={14} rx={4} fill="#6a4a2a" transform={`rotate(${Math.sin(f / 9 + i) * 8})`} />
		))}
	</Svg>
);
export const RainFX: React.FC<{f: number; n?: number; seed: string; o?: number}> = ({f, n = 90, seed, o = 0.6}) => (
	<Svg>
		{Array.from({length: n}).map((_, i) => {
			const x = random(seed + 'x' + i) * 2600 - 340 + ((f * 6) % 120);
			const y = ((random(seed + 'y' + i) * 1400 + f * (40 + random(seed + 'v' + i) * 20)) % 1500) - 300;
			return <line key={i} x1={x} y1={y} x2={x - 12} y2={y + 46} stroke="#b9cbe6" strokeWidth={2.5} opacity={o} />;
		})}
	</Svg>
);
export const Helicopter: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
	<g transform={`translate(${x + Math.sin(f / 9) * 30},${y + Math.sin(f / 7) * 18}) rotate(${Math.sin(f / 11) * 8}) scale(${s})`}>
		<ellipse cx={0} cy={0} rx={110} ry={50} fill="#e23b3b" />
		<ellipse cx={40} cy={-6} rx={40} ry={30} fill="#9fd2f0" />
		<rect x={-260} y={-12} width={170} height={18} fill="#c92b2b" />
		<rect x={-80} y={-70} width={10} height={24} fill="#333" />
		<rect x={-75 - 170 * Math.abs(Math.sin(f * 1.2))} y={-76} width={340 * Math.abs(Math.sin(f * 1.2))} height={8} fill="#222" />
		<line x1={-60} y1={50} x2={60} y2={50} stroke="#333" strokeWidth={6} />
		<circle cx={0} cy={0} r={300} fill="#fff" opacity={0.04 + 0.04 * (Math.floor(f / 4) % 2)} />
	</g>
);
/* lightning flash value at frame f (0..1) */
export const lightning = (f: number, seed = 1) => {
	const p = (f + seed * 37) % 110;
	return p < 3 ? 1 - p / 3 : p > 8 && p < 11 ? 0.6 * (1 - (p - 8) / 3) : 0;
};

/* ------------------------------------ gym ------------------------------------ */
export const Gym: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill="#d8c8a0" />
		<rect x={-600} y={-400} width={3100} height={560} fill="#b8a880" />
		{Array.from({length: 7}).map((_, i) => (
			<g key={i}>
				<rect x={-300 + i * 380} y={60} width={160} height={14} fill="#f6f2e8" />
				<rect x={-300 + i * 380} y={74} width={160} height={30} fill="#fff8d8" opacity={0.6 + 0.1 * Math.sin(f / 20 + i)} />
			</g>
		))}
		<rect x={760} y={200} width={400} height={240} fill="#fff" stroke="#d94a3a" strokeWidth={8} />
		<rect x={890} y={330} width={140} height={100} fill="none" stroke="#d94a3a" strokeWidth={6} />
		<circle cx={960} cy={480} r={30} fill="none" stroke="#f08a3c" strokeWidth={6} />
		{Array.from({length: 12}).map((_, i) => (
			<rect key={'w' + i} x={-600 + i * 260} y={620} width={240} height={280} fill={i % 2 ? '#2f6fd8' : '#3a7ae0'} opacity={0.35} />
		))}
		<rect x={-600} y={900} width={3100} height={600} fill="#d8a868" />
		{Array.from({length: 20}).map((_, i) => (
			<line key={'p' + i} x1={-600} y1={920 + i * i * 3} x2={2500} y2={920 + i * i * 3} stroke="#c8985a" strokeWidth={2} />
		))}
		<path d="M-600,1010 Q960,960 2500,1010" stroke="#fff" strokeWidth={6} fill="none" />
	</Svg>
);
export const Blanket: React.FC<{x: number; y: number; c: string; w?: number}> = ({x, y, c, w = 180}) => (
	<path d={`M${x - w / 2},${y} q${w / 4},-40 ${w / 2},-10 q${w / 4},-30 ${w / 2},10 l-10,40 q-${w / 2},20 -${w - 20},0 z`} fill={c} />
);

/* ------------------------------------ alley ------------------------------------ */
export const Alley: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill="#1b1f33" />
		<rect x={-600} y={-400} width={900} height={1400} fill="#2a2f48" />
		<rect x={1620} y={-400} width={900} height={1400} fill="#2a2f48" />
		{Array.from({length: 14}).map((_, i) => (
			<rect key={i} x={-560 + (i % 2) * 2180 + Math.floor(i / 2) * 20} y={-200 + Math.floor(i / 2) * 130} width={80} height={10} fill="#3a4060" />
		))}
		<rect x={1700} y={260} width={120} height={160} fill="#ffd27a" opacity={0.15 + 0.1 * (Math.floor(f / 7) % 3 === 0 ? 1 : 0)} />
		<rect x={-600} y={900} width={3100} height={600} fill="#24283a" />
		{/* dumpster */}
		<rect x={1250} y={720} width={300} height={180} rx={8} fill="#2f6a4a" />
		<rect x={1240} y={700} width={320} height={30} rx={6} fill="#24543a" />
		{/* lamp */}
		<rect x={300} y={140} width={14} height={300} fill="#3a3f55" />
		<path d="M260,140 h100 l-20,30 h-60 z" fill="#3a3f55" />
		<path d="M280,170 L180,900 L520,900 L340,170 Z" fill="#ffe3a0" opacity={0.08 + 0.02 * Math.sin(f / 4)} />
		{/* puddles */}
		<ellipse cx={800} cy={960} rx={180} ry={18} fill="#3a4a7a" opacity={0.6} />
	</Svg>
);

/* front door interior (knock) */
export const DoorWall: React.FC<{open?: number}> = ({open = 0}) => (
	<Svg>
		<rect x={-600} y={-400} width={3100} height={1400} fill="#e7d3b0" />
		<rect x={-600} y={640} width={3100} height={12} fill="#c9a07a" />
		<rect x={800} y={280} width={320} height={620} fill="#3a3f55" />
		<rect x={800} y={280} width={320 * (1 - open)} height={620} fill="#8a4a2a" />
		{open < 0.5 ? <circle cx={1080 - 280 * open} cy={600} r={14} fill="#e8c86a" /> : null}
		<rect x={780} y={262} width={360} height={22} fill="#6a3a1a" />
		<rect x={-600} y={900} width={3100} height={600} fill="#9a6a44" />
		<rect x={300} y={300} width={200} height={260} fill="#fbf7f0" stroke="#c9a07a" strokeWidth={10} />
		<circle cx={400} cy={410} r={50} fill="#f2b21c" opacity={0.5} />
	</Svg>
);
