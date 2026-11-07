import React from 'react';
import {interpolate, random} from 'remotion';
import {Layer, Svg, Rays} from '../kit/kit';
import {Bedroom, Kitchen} from '../kit/sets';
import {darken, lighten} from '../engine/color';

/* Locations made for this video. Each is a few depth layers: far (soft, moves little),
   mid, floor. The floor line is y = 900 everywhere so actors stand on it. */
export type BackdropKind = 'street' | 'casino' | 'stadium' | 'mountain' | 'sea' | 'highway' | 'mansion' | 'dining' | 'cafe' | 'void' | 'kitchen' | 'bedroom' | 'park';

const SKY: Record<string, [string, string, string]> = {
	morning: ['#7cc8ff', '#cfeeff', '#fff1c4'],
	day: ['#5ab4f5', '#a8dcff', '#e8f6ff'],
	dusk: ['#2a3b7a', '#e0709a', '#ffc58a'],
	pink: ['#6d6fd6', '#f59ac8', '#ffd3b0'],
	night: ['#070b22', '#16225a', '#2a3a82'],
	gold: ['#ffb45a', '#ffd89a', '#fff3d2'],
};

const Sky: React.FC<{id: string; tint: string; sun?: [number, number]}> = ({id, tint, sun}) => {
	const [a, b, c] = SKY[tint] ?? SKY.day;
	return (
		<>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={a} />
					<stop offset="0.6" stopColor={b} />
					<stop offset="1" stopColor={c} />
				</linearGradient>
			</defs>
			<rect x={-400} y={-400} width={2720} height={1500} fill={`url(#${id})`} />
			{sun ? (
				<>
					<circle cx={sun[0]} cy={sun[1]} r={150} fill="#fff6d0" opacity={0.25} />
					<circle cx={sun[0]} cy={sun[1]} r={70} fill="#fff6d0" opacity={0.95} />
				</>
			) : null}
			{tint === 'night' ? Array.from({length: 40}).map((_, i) => <circle key={i} cx={random('s' + i) * 2400 - 240} cy={random('t' + i) * 520} r={1 + random('r' + i) * 2} fill="#fff" opacity={0.5 + random('o' + i) * 0.5} />) : null}
		</>
	);
};

const Clouds: React.FC<{gf: number; y?: number; c?: string}> = ({gf, y = 180, c = '#ffffff'}) => (
	<>
		{[0, 1, 2, 3].map((i) => {
			const x = ((i * 640 + 200 - gf * (0.25 + i * 0.06)) % 2600) - 300;
			const yy = y + (i % 2) * 90 + i * 14;
			return (
				<g key={i} opacity={0.85} fill={c}>
					<ellipse cx={x} cy={yy} rx={120} ry={34} />
					<ellipse cx={x + 70} cy={yy - 20} rx={80} ry={34} />
					<ellipse cx={x - 70} cy={yy - 12} rx={70} ry={28} />
				</g>
			);
		})}
	</>
);

const Windows: React.FC<{x: number; y: number; w: number; h: number; seed: string; on?: number; c?: string; cols?: number; rows?: number}> = ({x, y, w, h, seed, on = 0.35, c = '#ffe7a3', cols = 4, rows = 6}) => {
	const cw = w / cols;
	const rh = h / rows;
	return (
		<>
			{Array.from({length: cols * rows}).map((_, i) => {
				const cx = i % cols;
				const ry = Math.floor(i / cols);
				const lit = random(seed + i) < on;
				return <rect key={i} x={x + cx * cw + cw * 0.2} y={y + ry * rh + rh * 0.22} width={cw * 0.6} height={rh * 0.5} rx={3} fill={lit ? c : 'rgba(30,45,90,0.55)'} opacity={lit ? 0.95 : 0.8} />;
			})}
		</>
	);
};

const Skyline: React.FC<{seed: string; base: number; col: string; min: number; max: number; w0?: number; windows?: boolean; night?: boolean}> = ({seed, base, col, min, max, w0 = 120, windows, night}) => {
	const out: React.ReactNode[] = [];
	let x = -300;
	let i = 0;
	while (x < 2300) {
		const w = w0 + random(seed + 'w' + i) * 110;
		const h = min + random(seed + 'h' + i) * (max - min);
		out.push(<rect key={'b' + i} x={x} y={base - h} width={w} height={h + 400} fill={darken(col, (i % 3) * 0.04)} />);
		if (windows) out.push(<Windows key={'w' + i} x={x + 6} y={base - h + 10} w={w - 12} h={h - 20} seed={seed + i} on={night ? 0.5 : 0.15} cols={Math.max(2, Math.floor(w / 36))} rows={Math.max(3, Math.floor(h / 48))} />);
		x += w + 6 + random(seed + 'g' + i) * 16;
		i++;
	}
	return <>{out}</>;
};

const Tree: React.FC<{x: number; base: number; s?: number; c?: string; sway?: number}> = ({x, base, s = 1, c = '#3fae6a', sway = 0}) => (
	<g transform={`translate(${x},${base}) scale(${s})`}>
		<rect x={-9} y={-140} width={18} height={140} fill="#6b4a2f" />
		<g transform={`rotate(${sway} 0 -140)`}>
			<circle cx={0} cy={-190} r={72} fill={c} />
			<circle cx={-46} cy={-150} r={50} fill={darken(c, 0.08)} />
			<circle cx={46} cy={-152} r={52} fill={lighten(c, 0.06)} />
		</g>
	</g>
);

/* ---------------------------------- street ----------------------------------- */
const Street: React.FC<{tint: string; gf: number}> = ({tint, gf}) => {
	const night = tint === 'night' || tint === 'dusk';
	const facade = night ? '#2a3466' : tint === 'pink' ? '#c07fb5' : '#e9b98c';
	return (
		<>
			<Layer depth={3}>
				<Svg>
					<Sky id={'sk-' + tint} tint={tint} sun={tint === 'morning' ? [1500, 360] : tint === 'gold' ? [400, 420] : undefined} />
					{night ? null : <Clouds gf={gf} />}
				</Svg>
			</Layer>
			<Layer depth={2.2}>
				<Svg>
					<Skyline seed={'far' + tint} base={900} col={night ? '#1d2552' : tint === 'pink' ? '#9a79c9' : '#9fbfe0'} min={260} max={560} windows={false} />
				</Svg>
			</Layer>
			<Layer depth={1.55}>
				<Svg>
					<Skyline seed={'mid' + tint} base={910} col={facade} min={220} max={460} w0={170} windows night={night} />
					<Tree x={240} base={905} s={1.1} sway={Math.sin(gf / 40) * 2} />
					<Tree x={1620} base={905} s={0.95} sway={Math.sin(gf / 37) * 2} />
				</Svg>
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<rect x={-400} y={880} width={2720} height={90} fill={night ? '#4b5280' : '#d7d2c8'} />
					<rect x={-400} y={968} width={2720} height={400} fill={night ? '#23283f' : '#4a4d58'} />
					{Array.from({length: 14}).map((_, i) => (
						<rect key={i} x={-300 + i * 220 - ((gf * 0) % 220)} y={1040} width={110} height={10} rx={3} fill="#f5e58a" opacity={0.8} />
					))}
					<rect x={-400} y={968} width={2720} height={6} fill={night ? '#6a73a8' : '#fff'} opacity={0.5} />
				</Svg>
			</Layer>
		</>
	);
};

/* -------------------------------- highway / road ------------------------------ */
const Highway: React.FC<{gf: number; tint: string}> = ({gf, tint}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<Sky id={'hw-' + tint} tint={tint === 'x' ? 'gold' : tint} sun={[1400, 420]} />
				<Clouds gf={gf} y={200} />
			</Svg>
		</Layer>
		<Layer depth={2}>
			<Svg>
				<path d="M-200,820 L150,560 L420,760 L760,520 L1100,780 L1450,580 L1800,760 L2200,600 L2200,900 L-200,900 Z" fill="#b8744a" />
				<path d="M-200,860 L300,700 L640,840 L1000,690 L1400,850 L1800,720 L2200,860 L2200,900 L-200,900 Z" fill="#9c5f3b" />
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<rect x={-400} y={880} width={2720} height={500} fill="#3b3d46" />
				<rect x={-400} y={880} width={2720} height={14} fill="#c9a66f" />
				{Array.from({length: 12}).map((_, i) => (
					<rect key={i} x={-300 + i * 260 - ((gf * 14) % 260)} y={1010} width={150} height={14} rx={4} fill="#f5e58a" />
				))}
			</Svg>
		</Layer>
	</>
);

/* ----------------------------------- casino ------------------------------------ */
const Casino: React.FC<{gf: number}> = ({gf}) => (
	<>
		<Layer depth={2}>
			<Svg>
				<defs>
					<linearGradient id="cas-w" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#2a0f1d" />
						<stop offset="1" stopColor="#5a1830" />
					</linearGradient>
				</defs>
				<rect x={-400} y={-300} width={2720} height={1300} fill="url(#cas-w)" />
				{Array.from({length: 26}).map((_, i) => (
					<circle key={i} cx={-120 + i * 100} cy={110 + (i % 2) * 30} r={9} fill="#ffd34a" opacity={0.55 + 0.45 * Math.sin(gf / 6 + i)} />
				))}
				{[300, 960, 1620].map((x, i) => (
					<g key={i}>
						<line x1={x} y1={-300} x2={x} y2={180} stroke="#d8b24a" strokeWidth={4} />
						<path d={`M${x - 150},230 L${x},170 L${x + 150},230 Z`} fill="#ffd34a" opacity={0.9} />
						<ellipse cx={x} cy={236} rx={150} ry={20} fill="#fff3b0" opacity={0.4} />
					</g>
				))}
			</Svg>
		</Layer>
		<Layer depth={1.5}>
			<Svg>
				{Array.from({length: 6}).map((_, i) => (
					<g key={i} transform={`translate(${100 + i * 340},560)`}>
						<rect width={130} height={330} rx={14} fill="#2b2f4a" />
						<rect x={14} y={24} width={102} height={90} rx={6} fill="#101226" />
						{[0, 1, 2].map((k) => (
							<rect key={k} x={20 + k * 32} y={38} width={26} height={60} rx={4} fill={((Math.floor(gf / 8) + i + k) % 3 === 0 ? '#ff4a5a' : '#ffd34a')} opacity={0.9} />
						))}
						<circle cx={65} cy={170} r={22} fill="#d94a3a" />
					</g>
				))}
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<rect x={-400} y={880} width={2720} height={500} fill="#7a1230" />
				{Array.from({length: 30}).map((_, i) => (
					<circle key={i} cx={-300 + i * 90} cy={960 + (i % 3) * 40} r={5} fill="#d8b24a" opacity={0.35} />
				))}
			</Svg>
		</Layer>
	</>
);

/* ----------------------------------- stadium ----------------------------------- */
const Stadium: React.FC<{gf: number; cheer?: number}> = ({gf, cheer = 0}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<Sky id="st-sky" tint="dusk" />
				{[260, 700, 1220, 1660].map((x, i) => (
					<g key={i}>
						<rect x={x - 6} y={120} width={12} height={400} fill="#3a3f5a" />
						<rect x={x - 70} y={70} width={140} height={60} rx={8} fill="#fff7cf" />
						<circle cx={x} cy={100} r={130} fill="#fff7cf" opacity={0.18} />
					</g>
				))}
			</Svg>
		</Layer>
		<Layer depth={1.9}>
			<Svg>
				<path d="M-300,640 L2300,640 L2300,900 L-300,900 Z" fill="#33395e" />
				{Array.from({length: 9}).map((_, r) =>
					Array.from({length: 34}).map((__, k) => {
						const jump = cheer * Math.abs(Math.sin(gf / 4 + k * 1.7 + r)) * 14;
						return <circle key={r + '-' + k} cx={-260 + k * 68 + (r % 2) * 30} cy={660 + r * 28 - jump} r={14} fill={['#ff5a4a', '#ffd34a', '#fff', '#5ab4ff'][(k * 3 + r) % 4]} opacity={0.9} />;
					}),
				)}
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<rect x={-400} y={880} width={2720} height={500} fill="#2f9d4e" />
				{Array.from({length: 9}).map((_, i) => (
					<rect key={i} x={-400 + i * 330} y={880} width={165} height={500} fill="#37ad58" />
				))}
				<rect x={-400} y={880} width={2720} height={10} fill="#fff" opacity={0.6} />
			</Svg>
		</Layer>
	</>
);

/* ---------------------------------- mountain ----------------------------------- */
const Mountain: React.FC<{gf: number}> = ({gf}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<Sky id="mt-sky" tint="day" sun={[1500, 260]} />
				<Clouds gf={gf} y={240} />
			</Svg>
		</Layer>
		<Layer depth={2.1}>
			<Svg>
				<path d="M-300,900 L300,420 L620,640 L1000,300 L1400,660 L1700,480 L2300,900 Z" fill="#8fa5c9" />
				<path d="M900,340 L1000,300 L1080,360 L1000,350 Z" fill="#fff" />
			</Svg>
		</Layer>
		<Layer depth={1.4}>
			<Svg>
				<path d="M-300,900 L100,520 L460,720 L760,420 L1180,760 L1560,560 L2300,900 Z" fill="#6c7f98" />
				<path d="M700,470 L760,420 L820,470 L760,462 Z" fill="#fff" />
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<path d="M-300,900 L-300,620 L420,560 L720,700 L1100,640 L1500,540 L2300,600 L2300,1100 L-300,1100 Z" fill="#7d6a5a" />
				<path d="M-300,880 L2300,880 L2300,1100 L-300,1100 Z" fill="#6a5849" />
				{Array.from({length: 14}).map((_, i) => (
					<ellipse key={i} cx={-200 + i * 190} cy={905 + (i % 3) * 14} rx={46} ry={12} fill="#5a4a3d" opacity={0.7} />
				))}
			</Svg>
		</Layer>
	</>
);

/* ------------------------------------- sea ------------------------------------- */
const Sea: React.FC<{gf: number}> = ({gf}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<Sky id="sea-sky" tint="day" sun={[1400, 300]} />
				<Clouds gf={gf} />
			</Svg>
		</Layer>
		<Layer depth={1.3}>
			<Svg>
				<rect x={-400} y={620} width={2720} height={700} fill="#1c6fb8" />
				{[0, 1, 2, 3, 4].map((i) => (
					<path
						key={i}
						d={`M-300,${700 + i * 60} ${Array.from({length: 16}).map((_, k) => `Q${-220 + k * 160 + 80},${700 + i * 60 - 30 - Math.sin((gf + i * 20) / 10 + k) * 26} ${-140 + k * 160 + 160},${700 + i * 60}`).join(' ')}`}
						stroke="#cfeaff"
						strokeWidth={5}
						fill="none"
						opacity={0.6}
					/>
				))}
			</Svg>
		</Layer>
	</>
);

/* --------------------------------- indoor rooms -------------------------------- */
const Room: React.FC<{id: string; wall: [string, string]; floor: string; trim?: string; children?: React.ReactNode; far?: React.ReactNode}> = ({id, wall, floor, trim = '#00000022', children, far}) => (
	<>
		<Layer depth={2}>
			<Svg>
				<defs>
					<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={wall[0]} />
						<stop offset="1" stopColor={wall[1]} />
					</linearGradient>
				</defs>
				<rect x={-400} y={-300} width={2720} height={1300} fill={`url(#${id})`} />
				{far}
			</Svg>
		</Layer>
		<Layer depth={1.4}>
			<Svg>{children}</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<rect x={-400} y={880} width={2720} height={500} fill={floor} />
				<rect x={-400} y={880} width={2720} height={12} fill={trim} />
			</Svg>
		</Layer>
	</>
);

const Mansion: React.FC<{gf: number}> = ({gf}) => (
	<Room
		id="mn-w"
		wall={['#f3ece0', '#d9cdb8']}
		floor="#b9a07a"
		trim="#8a7050"
		far={
			<>
				{[0, 1, 2].map((i) => (
					<g key={i} transform={`translate(${260 + i * 640},120)`}>
						<rect width={300} height={560} fill="#9ed7ff" stroke="#fff" strokeWidth={12} />
						<rect x={146} width={8} height={560} fill="#fff" />
						<rect y={270} width={300} height={8} fill="#fff" />
					</g>
				))}
			</>
		}
	>
		<g>
			<line x1={960} y1={-200} x2={960} y2={140} stroke="#c9a74a" strokeWidth={4} />
			<ellipse cx={960} cy={190} rx={150} ry={50} fill="#ffe9a0" opacity={0.85} />
			{Array.from({length: 7}).map((_, i) => (
				<circle key={i} cx={840 + i * 40} cy={230 + (i % 2) * 20} r={7} fill="#fff6c8" opacity={0.7 + 0.3 * Math.sin(gf / 8 + i)} />
			))}
			<rect x={1300} y={600} width={420} height={280} rx={30} fill="#6a4a8a" />
			<rect x={1300} y={560} width={420} height={80} rx={30} fill="#7d5aa0" />
			<rect x={200} y={470} width={220} height={150} fill="#d4af37" />
			<rect x={216} y={486} width={188} height={118} fill="#3a6aa0" />
		</g>
	</Room>
);

const Dining: React.FC = () => (
	<Room
		id="dn-w"
		wall={['#ffd9a6', '#f2a76a']}
		floor="#8a5a3a"
		trim="#5a3a22"
		far={
			<>
				<rect x={760} y={140} width={400} height={300} fill="#ffe9b8" stroke="#8a5a3a" strokeWidth={14} />
				<circle cx={960} cy={290} r={80} fill="#ffb067" opacity={0.7} />
			</>
		}
	>
		<g>
			<rect x={300} y={690} width={1320} height={30} rx={8} fill="#a8703e" />
			<rect x={360} y={720} width={30} height={170} fill="#8a5a3a" />
			<rect x={1530} y={720} width={30} height={170} fill="#8a5a3a" />
			{[0, 1, 2, 3, 4].map((i) => (
				<g key={i}>
					<ellipse cx={420 + i * 280} cy={684} rx={70} ry={14} fill="#fff" />
					<ellipse cx={420 + i * 280} cy={680} rx={40} ry={8} fill="#e86a4a" />
				</g>
			))}
			<rect x={900} y={630} width={36} height={56} rx={8} fill="#7ad3a0" />
		</g>
	</Room>
);

const Cafe: React.FC<{gf: number}> = ({gf}) => (
	<Room
		id="cf-w"
		wall={['#6a4a3a', '#8a6048']}
		floor="#4a3226"
		trim="#2f1f17"
		far={
			<>
				<rect x={200} y={120} width={620} height={300} rx={10} fill="#232a2a" stroke="#c9a67a" strokeWidth={10} />
				<text x={510} y={200} textAnchor="middle" fontSize={54} fontFamily="'Caveat', cursive" fill="#fff">
					COFFEE
				</text>
				<text x={510} y={270} textAnchor="middle" fontSize={38} fontFamily="'Caveat', cursive" fill="#ffd79a">
					fresh every day
				</text>
				<rect x={1200} y={140} width={520} height={420} fill="#b9e4ff" stroke="#c9a67a" strokeWidth={12} opacity={0.9} />
			</>
		}
	>
		<g>
			<rect x={150} y={640} width={640} height={250} rx={12} fill="#a8703e" />
			<rect x={150} y={620} width={640} height={30} rx={8} fill="#d9a56a" />
			<rect x={560} y={540} width={110} height={90} rx={10} fill="#c7c9d3" />
			<circle cx={600} cy={500} r={14} fill="#fff" opacity={0.4 + 0.3 * Math.sin(gf / 9)} />
			<rect x={1100} y={720} width={500} height={20} rx={6} fill="#d9a56a" />
			<rect x={1330} y={740} width={30} height={150} fill="#8a5a3a" />
			<rect x={1210} y={690} width={34} height={30} rx={6} fill="#fff" />
			<rect x={1450} y={690} width={34} height={30} rx={6} fill="#fff" />
		</g>
	</Room>
);

const Park: React.FC<{gf: number}> = ({gf}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<Sky id="pk-sky" tint="morning" sun={[300, 300]} />
				<Clouds gf={gf} />
			</Svg>
		</Layer>
		<Layer depth={1.5}>
			<Svg>
				{[200, 560, 1000, 1400, 1800].map((x, i) => (
					<Tree key={i} x={x} base={900} s={1 + (i % 2) * 0.25} sway={Math.sin(gf / 40 + i) * 2} />
				))}
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<rect x={-400} y={880} width={2720} height={500} fill="#4fb35a" />
				<rect x={-400} y={890} width={2720} height={60} fill="#d8c9a0" />
			</Svg>
		</Layer>
	</>
);

const Void: React.FC<{gf: number}> = ({gf}) => (
	<>
		<Layer depth={3}>
			<Svg>
				<defs>
					<radialGradient id="vd" cx="0.35" cy="0.3" r="0.9">
						<stop offset="0" stopColor="#3f5a10" />
						<stop offset="0.6" stopColor="#16240a" />
						<stop offset="1" stopColor="#070b04" />
					</radialGradient>
				</defs>
				<rect x={-400} y={-300} width={2720} height={1700} fill="url(#vd)" />
				{Array.from({length: 18}).map((_, i) => {
					const x = random('vx' + i) * 2200 - 140;
					const y = ((random('vy' + i) * 1400 - gf * (0.3 + random('vs' + i) * 0.5)) % 1400 + 1400) % 1400 - 150;
					return <circle key={i} cx={x} cy={y} r={6 + random('vr' + i) * 26} fill="#b6ff1f" opacity={0.05 + random('vo' + i) * 0.1} />;
				})}
			</Svg>
		</Layer>
		<Layer depth={1.1}>
			<Svg>
				<ellipse cx={960} cy={930} rx={900} ry={60} fill="#b6ff1f" opacity={0.07} />
				<rect x={-400} y={900} width={2720} height={500} fill="#0c1408" opacity={0.7} />
				<rect x={-400} y={900} width={2720} height={3} fill="#b6ff1f" opacity={0.5} />
			</Svg>
		</Layer>
	</>
);

export const Backdrop: React.FC<{kind: BackdropKind; f: number; gf: number; night?: boolean; tint?: string}> = ({kind, gf, night, tint}) => {
	switch (kind) {
		case 'street':
			return <Street tint={tint ?? (night ? 'night' : 'morning')} gf={gf} />;
		case 'highway':
			return <Highway gf={gf} tint={tint ?? 'day'} />;
		case 'casino':
			return <Casino gf={gf} />;
		case 'stadium':
			return <Stadium gf={gf} cheer={tint === 'cheer' ? 1 : 0} />;
		case 'mountain':
			return <Mountain gf={gf} />;
		case 'sea':
			return <Sea gf={gf} />;
		case 'mansion':
			return <Mansion gf={gf} />;
		case 'dining':
			return <Dining />;
		case 'cafe':
			return <Cafe gf={gf} />;
		case 'park':
			return <Park gf={gf} />;
		case 'kitchen':
			return (
				<Layer depth={1.6}>
					<Kitchen night={night} />
				</Layer>
			);
		case 'bedroom':
			return (
				<Layer depth={tint?.includes('flat') ? 1 : 1.6}>
					<Bedroom night={night} f={gf} ring={!!tint?.includes('ring')} />
				</Layer>
			);
		default:
			return <Void gf={gf} />;
	}
};

export {Rays, interpolate};
