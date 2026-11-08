/* Locations and graphics made for this video: death-date tags over heads, city, hospital,
   office, bank, war room, lab, nursery, bridge, road, observatory, mountains, shelter. */
import React from 'react';
import {interpolate, random, spring, Easing} from 'remotion';
import {Svg} from '../engine/camera';
import {darken, lighten, mix} from '../engine/color';
import {FONT, HAND} from '../kit/ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ------------------------------- date tag --------------------------------- */
/* Thin line of white glowing digits floating over a head. on = local frame it fades in;
   glitch > 0 scrambles it (the hero's own, unreadable date); dead = it greys out;
   roll = [frame0, frame1, fromText] — old text flips into the new one. */
export const DateTag: React.FC<{x: number; y: number; text: string; f: number; on?: number; s?: number; glitch?: boolean; dead?: number; c?: string; roll?: [number, number, string]}> = ({
	x,
	y,
	text,
	f,
	on = -999,
	s = 1,
	glitch,
	dead = 9999,
	c = '#ffffff',
	roll,
}) => {
	const t = f - on;
	if (t < 0) return null;
	const k = interpolate(t, [0, 14], [0, 1], clamp);
	const flick = t < 14 ? (random('dt' + Math.floor(f / 2) + x) > 0.4 ? 1 : 0.25) : 1;
	const bob = Math.sin(f / 26 + x / 90) * 5;
	const d = interpolate(f, [dead, dead + 16], [0, 1], clamp);
	let shown = text;
	if (glitch) {
		const ch = '0123456789?#';
		shown = text
			.split('')
			.map((q, i) => (q === ' ' ? ' ' : ch[Math.floor(random('g' + i + Math.floor(f / 3)) * ch.length)]))
			.join('');
	}
	let flip = 1;
	if (roll) {
		if (f < roll[1]) shown = roll[2];
		flip = Math.abs(interpolate(f, [roll[0], (roll[0] + roll[1]) / 2, roll[1]], [1, 0, 1], clamp));
		if (f >= (roll[0] + roll[1]) / 2) shown = text;
	}
	const col = mix(c, '#6b6f80', d);
	return (
		<g transform={`translate(${x},${y + bob - (1 - k) * 16}) scale(${s},${s * flip})`} opacity={k * flick * (1 - 0.35 * d)}>
			<rect x={-shown.length * 13 - 18} y={-36} width={shown.length * 26 + 36} height={56} rx={28} fill="#0b0d1e" opacity={0.38} style={{filter: 'blur(4px)'}} />
			<text textAnchor="middle" fontSize={38} fontFamily={FONT} fontWeight={500} letterSpacing={4} fill={col} style={{filter: `drop-shadow(0 0 ${8 - 6 * d}px ${glitch ? '#ffd34a' : '#bfe0ff'})`}}>
				{shown}
			</text>
			<line x1={-text.length * 12} y1={14} x2={text.length * 12} y2={14} stroke={col} strokeWidth={2} opacity={0.5} />
		</g>
	);
};
// where the tag sits over a standing actor at scale s on floor fl
export const tagY = (fl: number, s: number) => fl - 157 * s - 164 * s - 92 * s;

/* -------------------------------- helpers --------------------------------- */
const G: React.FC<{id: string; a: string; b: string; x2?: number; y2?: number}> = ({id, a, b, x2 = 0, y2 = 1}) => (
	<linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
		<stop offset="0" stopColor={a} />
		<stop offset="1" stopColor={b} />
	</linearGradient>
);
const Back: React.FC<{id: string; top: string; bot: string; floorY?: number; floor?: string}> = ({id, top, bot, floorY = 880, floor}) => (
	<>
		<defs>
			<G id={id} a={top} b={bot} />
		</defs>
		<rect x={-500} y={-400} width={2920} height={floorY + 400} fill={`url(#${id})`} />
		{floor ? <rect x={-500} y={floorY} width={2920} height={800} fill={floor} /> : null}
	</>
);

/* --------------------------------- city ----------------------------------- */
export const City: React.FC<{f: number; night?: boolean; dawn?: boolean; empty?: boolean; dim?: number}> = ({f, night, dawn, dim = 0}) => {
	const sky = night ? ['#070b1f', '#28306a'] : dawn ? ['#3a3f7a', '#ffb27a'] : ['#7ec4e8', '#d8f0f2'];
	const far = night ? '#1a1f45' : dawn ? '#5a4a7a' : '#9dbfd0';
	const mid = night ? '#262c5c' : dawn ? '#6a4e74' : '#7ea2b8';
	return (
		<Svg>
			<Back id={'cs' + (night ? 'n' : dawn ? 'd' : 'y')} top={sky[0]} bot={sky[1]} floorY={900} />
			{night ? Array.from({length: 60}).map((_, i) => <circle key={i} cx={random('cn' + i) * 2400 - 240} cy={random('cy' + i) * 380} r={1.4} fill="#fff" opacity={0.3 + 0.4 * Math.abs(Math.sin(f / 30 + i))} />) : null}
			{dawn ? <circle cx={1300} cy={760} r={140} fill="#ffe1a0" opacity={0.85} /> : null}
			{!night && !dawn ? <circle cx={1500} cy={170} r={70} fill="#fff7d8" opacity={0.9} /> : null}
			{Array.from({length: 18}).map((_, i) => {
				const w = 120 + random('bw' + i) * 120;
				const h = 220 + random('bh' + i) * 380;
				return <rect key={i} x={-300 + i * 150} y={900 - h - 120} width={w} height={h + 120} fill={far} />;
			})}
			{Array.from({length: 12}).map((_, i) => {
				const w = 200 + random('mw' + i) * 140;
				const h = 260 + random('mh' + i) * 260;
				const x = -360 + i * 230;
				return (
					<g key={i}>
						<rect x={x} y={900 - h} width={w} height={h} fill={mid} />
						{Array.from({length: Math.floor(h / 70)}).map((__, r) =>
							Array.from({length: Math.floor(w / 60)}).map((___, c) => (
								<rect key={`${r}-${c}`} x={x + 18 + c * 60} y={900 - h + 24 + r * 70} width={30} height={38} fill={night ? (random('l' + i + r + c) > 0.55 ? '#ffcf80' : '#1a1f45') : lighten(mid, 0.35)} opacity={night ? 0.85 : 0.6} />
							)),
						)}
					</g>
				);
			})}
			<rect x={-500} y={890} width={2920} height={30} fill={night ? '#3a3f66' : '#b8bcc4'} />
			<rect x={-500} y={920} width={2920} height={400} fill={night ? '#1d2245' : '#8a8f99'} />
			{Array.from({length: 14}).map((_, i) => (
				<rect key={i} x={-400 + i * 220} y={1010} width={110} height={10} fill={night ? '#5a5f86' : '#e8e8e0'} opacity={0.7} />
			))}
			{dim > 0 ? <rect x={-500} y={-400} width={2920} height={1800} fill="#0a0c20" opacity={dim} /> : null}
		</Svg>
	);
};

/* ------------------------------- hospital --------------------------------- */
export const Hospital: React.FC<{f: number; night?: boolean; flat?: number; beds?: number; monitor?: boolean}> = ({f, night, flat = 9999, beds = 2, monitor = true}) => {
	const dead = f >= flat;
	return (
		<Svg>
			<Back id={night ? 'hpn' : 'hpd'} top={night ? '#1f4a52' : '#7cc4bc'} bot={night ? '#2b5c62' : '#b8e2da'} floorY={880} floor={night ? '#24343a' : '#c8d4d2'} />
			<rect x={-500} y={700} width={2920} height={14} fill={night ? '#173a40' : '#5fa8a0'} />
			<rect x={150} y={150} width={420} height={300} rx={10} fill="#e9f4f1" />
			<rect x={170} y={170} width={380} height={260} fill={night ? '#0e1838' : '#ffd7a0'} />
			{night ? <circle cx={480} cy={230} r={24} fill="#eef1ff" /> : <circle cx={300} cy={380} r={50} fill="#fff1c8" />}
			<line x1={360} y1={170} x2={360} y2={430} stroke="#e9f4f1" strokeWidth={10} />
			{Array.from({length: beds}).map((_, i) => {
				const bx = 900 + i * 620;
				return (
					<g key={i}>
						<rect x={bx - 260} y={720} width={520} height={60} rx={14} fill="#f4f7f8" />
						<rect x={bx - 260} y={680} width={520} height={50} rx={22} fill="#dfe9ee" />
						<rect x={bx + 200} y={600} width={26} height={280} rx={8} fill="#9aa9b3" />
						<rect x={bx - 260} y={780} width={16} height={100} fill="#9aa9b3" />
						<rect x={bx + 230} y={780} width={16} height={100} fill="#9aa9b3" />
						<text x={bx - 220} y={660} fontSize={30} fontFamily={FONT} fill={night ? '#9ad8d0' : '#2f6f68'}>
							{i === 0 ? 'BED 4' : 'BED 5'}
						</text>
					</g>
				);
			})}
			{monitor ? (
				<g transform="translate(1260,330)">
					<rect x={-130} y={-90} width={260} height={180} rx={14} fill="#1b2030" />
					<rect x={-115} y={-75} width={230} height={150} rx={6} fill="#071410" />
					<path
						d={Array.from({length: 46})
							.map((_, i) => {
								const x = -110 + i * 5;
								const ph = (i + f * 2) % 46;
								const y = dead ? 0 : ph > 20 && ph < 24 ? (ph === 21 ? -45 : ph === 22 ? 30 : -10) : 0;
								return `${i ? 'L' : 'M'}${x},${y}`;
							})
							.join(' ')}
						stroke={dead ? '#ff4a4a' : '#4aff9a'}
						strokeWidth={4}
						fill="none"
					/>
					<text x={95} y={-45} textAnchor="end" fontSize={28} fontFamily={FONT} fill={dead ? '#ff4a4a' : '#4aff9a'}>
						{dead ? '0' : 72 + Math.round(Math.sin(f / 20) * 2)}
					</text>
				</g>
			) : null}
		</Svg>
	);
};
/* a person lying on their back (in a bed). x,y = hip point */
export const LyingPose = {lean: 0, head: -6, armB: [6, 8] as [number, number], armF: [10, 10] as [number, number], legB: [0, 0] as [number, number], legF: [3, 0] as [number, number]};

/* --------------------------------- office --------------------------------- */
export const Office: React.FC<{f: number; tint?: string; sign?: string; night?: boolean}> = ({f, tint = '#d9c7a6', sign, night}) => (
	<Svg>
		<Back id={'of' + tint.slice(1) + (night ? 'n' : '')} top={night ? darken(tint, 0.6) : lighten(tint, 0.15)} bot={night ? darken(tint, 0.45) : tint} floorY={880} floor={night ? '#2a2230' : darken(tint, 0.45)} />
		{[0, 1, 2].map((i) => (
			<g key={i}>
				<rect x={140 + i * 600} y={200} width={440} height={300} fill={night ? '#121a3a' : '#bfe2f2'} />
				{Array.from({length: 11}).map((_, j) => (
					<rect key={j} x={140 + i * 600} y={200 + j * 28} width={440} height={12} fill={night ? '#2a2f50' : '#f2efe6'} opacity={0.9} />
				))}
			</g>
		))}
		{sign ? (
			<g transform="translate(960,110)">
				<rect x={-(sign.length * 18 + 50)} y={-50} width={sign.length * 36 + 100} height={92} rx={10} fill="#11142c" stroke="#ffc94a" strokeWidth={3} />
				<text y={16} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#ffc94a" letterSpacing={1}>
					{sign}
				</text>
			</g>
		) : null}
		<g transform="translate(1780,880)">
			<rect x={-40} y={-90} width={80} height={90} rx={8} fill="#c9733a" />
			{[0, 1, 2, 3, 4].map((i) => (
				<ellipse key={i} cx={-30 + i * 15} cy={-150 - (i % 2) * 30} rx={22} ry={60} fill="#3aa37a" transform={`rotate(${-30 + i * 15 + Math.sin(f / 40 + i) * 3}, ${-30 + i * 15}, -90)`} />
			))}
		</g>
	</Svg>
);
/* office desk in front of people (drawn on the actor layer, after the actors behind it) */
export const DeskFront: React.FC<{x: number; w?: number; c?: string; y?: number}> = ({x, w = 560, c = '#7a5a3a', y = 760}) => (
	<g>
		<rect x={x - w / 2} y={y} width={w} height={22} rx={6} fill={lighten(c, 0.2)} />
		<rect x={x - w / 2 + 20} y={y + 22} width={w - 40} height={900 - y - 22} fill={c} />
		<rect x={x - w / 2 + 40} y={y + 50} width={w - 80} height={6} fill={darken(c, 0.25)} />
	</g>
);
export const Paper: React.FC<{x: number; y: number; rot?: number; title: string; stamp?: string; st?: number; c?: string}> = ({x, y, rot = -4, title, stamp, st = -1, c = '#c42b2b'}) => {
	const k = st >= 0 ? Math.min(1, st / 4) : 0;
	return (
		<g transform={`translate(${x},${y}) rotate(${rot})`}>
			<rect x={-110} y={-140} width={220} height={280} rx={6} fill="#fbf8ef" />
			<text y={-100} textAnchor="middle" fontSize={22} fontFamily={FONT} fontWeight={800} fill="#2b2a33">
				{title}
			</text>
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<rect key={i} x={-80} y={-70 + i * 30} width={160 - (i % 3) * 30} height={8} fill="#d8d2c2" />
			))}
			{stamp && st >= 0 ? (
				<g transform={`rotate(-14) scale(${1 + (1 - k) * 1.2})`} opacity={k}>
					<rect x={-100} y={-34} width={200} height={68} rx={8} fill="none" stroke={c} strokeWidth={7} />
					<text y={14} textAnchor="middle" fontSize={stamp.length > 7 ? 30 : 40} fontFamily={FONT} fontWeight={900} fill={c}>
						{stamp}
					</text>
				</g>
			) : null}
		</g>
	);
};

/* -------------------------------- war room -------------------------------- */
export const WarRoom: React.FC<{f: number; alarm?: boolean}> = ({f, alarm}) => {
	const red = alarm && Math.floor(f / 15) % 2 === 0;
	return (
		<Svg>
			<Back id="wr" top="#0b1228" bot="#16203f" floorY={880} floor="#0d1326" />
			<rect x={360} y={120} width={1200} height={520} rx={16} fill="#06101f" stroke="#2a4a7a" strokeWidth={6} />
			{Array.from({length: 13}).map((_, i) => (
				<line key={i} x1={380 + i * 90} y1={140} x2={380 + i * 90} y2={620} stroke="#1a3a6a" strokeWidth={1.5} />
			))}
			{Array.from({length: 6}).map((_, i) => (
				<line key={'h' + i} x1={380} y1={160 + i * 90} x2={1540} y2={160 + i * 90} stroke="#1a3a6a" strokeWidth={1.5} />
			))}
			<WorldShapes x={380} y={160} w={1160} h={440} c="#2a6a9a" />
			{Array.from({length: 14}).map((_, i) => {
				const p = (f / 40 + random('wd' + i)) % 1;
				return <circle key={i} cx={430 + random('wx' + i) * 1080} cy={200 + random('wy' + i) * 380} r={6 + 30 * p} fill="none" stroke="#ff5a4a" strokeWidth={3} opacity={1 - p} />;
			})}
			<rect x={-500} y={690} width={2920} height={10} fill="#2a4a7a" opacity={0.5} />
			{red ? <rect x={-500} y={-400} width={2920} height={1800} fill="#ff2020" opacity={0.12} /> : null}
		</Svg>
	);
};
/* simplified continents in a box (flat map) */
export const WorldShapes: React.FC<{x: number; y: number; w: number; h: number; c: string; hot?: number; hotC?: string}> = ({x, y, w, h, c, hot = 0, hotC = '#ff4a4a'}) => {
	const sx = w / 1000;
	const sy = h / 500;
	const P = [
		'M80,80 L230,60 L300,120 L260,200 L200,230 L170,300 L120,240 L60,160 Z', // N America
		'M210,290 L280,300 L300,380 L260,470 L220,430 L200,340 Z', // S America
		'M450,70 L560,60 L590,110 L520,150 L460,140 Z', // Europe
		'M470,170 L590,160 L620,260 L570,380 L520,360 L480,260 Z', // Africa
		'M600,60 L880,70 L940,160 L860,230 L760,250 L700,200 L620,160 Z', // Asia
		'M800,340 L900,330 L930,400 L840,420 Z', // Australia
	];
	return (
		<g transform={`translate(${x},${y}) scale(${sx},${sy})`}>
			{P.map((d, i) => (
				<path key={i} d={d} fill={c} opacity={0.85} />
			))}
			{hot > 0
				? [
						[700, 225], [735, 215], [760, 245], [640, 200], [600, 120], [520, 155], [200, 220], [230, 120], [880, 180], [860, 340], [470, 120], [250, 300], [790, 260], [670, 240],
					].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={(10 + (i % 3) * 6) * Math.min(1, hot * 1.6 - i * 0.05)} fill={hotC} opacity={0.75} />)
				: null}
		</g>
	);
};

/* ---------------------------------- lab ----------------------------------- */
export const Lab: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Back id="lab" top="#e6eef2" bot="#c8d6de" floorY={880} floor="#9aa9b3" />
		<rect x={-500} y={680} width={2920} height={20} fill="#7a8a96" />
		{[0, 1, 2].map((i) => (
			<g key={i} transform={`translate(${260 + i * 700},300)`}>
				<rect x={-160} y={-120} width={320} height={220} rx={12} fill="#1b2030" />
				<rect x={-145} y={-105} width={290} height={190} rx={6} fill="#0c1a2a" />
				{i === 0 ? (
					<g>
						<ellipse cx={0} cy={-10} rx={80} ry={66} fill="none" stroke="#5ad8ff" strokeWidth={4} />
						<path d="M-60,-10 Q-30,-50 0,-10 T60,-10" stroke="#5ad8ff" strokeWidth={3} fill="none" />
						<rect x={-80} y={-10 + Math.sin(f / 10) * 50} width={160} height={4} fill="#ff5ad8" opacity={0.7} />
					</g>
				) : i === 1 ? (
					<g>
						<ellipse cx={0} cy={-10} rx={90} ry={40} fill="none" stroke="#5ad8ff" strokeWidth={4} />
						<circle cx={Math.sin(f / 18) * 20} cy={-10} r={24} fill="#5ad8ff" />
						<circle cx={Math.sin(f / 18) * 20} cy={-10} r={10} fill="#0c1a2a" />
					</g>
				) : (
					<g>
						<path d="M-30,-80 L30,-80 L20,-40 L50,60 L-50,60 L-20,-40 Z" fill="none" stroke="#5ad8ff" strokeWidth={4} />
						<rect x={-44} y={20 + Math.sin(f / 14) * 4} width={88} height={36} fill="#5ad8ff" opacity={0.5} />
					</g>
				)}
			</g>
		))}
	</Svg>
);

/* -------------------------------- nursery --------------------------------- */
export const Nursery: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Back id="nur" top="#f6d8e2" bot="#fbe9ef" floorY={880} floor="#d8b8a8" />
		<rect x={-500} y={690} width={2920} height={12} fill="#e8a8bc" />
		{Array.from({length: 26}).map((_, i) => (
			<circle key={i} cx={-200 + i * 100} cy={110 + (i % 2) * 40} r={12} fill={i % 3 ? '#ffd34a' : '#8bd0f0'} opacity={0.5} />
		))}
	</Svg>
);
export const Crib: React.FC<{x: number; y?: number; c?: string}> = ({x, y = 880, c = '#f2f2f2'}) => (
	<g>
		<rect x={x - 130} y={y - 210} width={260} height={16} rx={6} fill={c} />
		<rect x={x - 130} y={y - 90} width={260} height={16} rx={6} fill={c} />
		{Array.from({length: 9}).map((_, i) => (
			<rect key={i} x={x - 124 + i * 31} y={y - 200} width={8} height={120} fill={c} />
		))}
		<rect x={x - 136} y={y - 220} width={14} height={220} rx={5} fill={darken(c, 0.12)} />
		<rect x={x + 122} y={y - 220} width={14} height={220} rx={5} fill={darken(c, 0.12)} />
	</g>
);
export const Baby: React.FC<{x: number; y: number; s?: number; c?: string; f: number}> = ({x, y, s = 1, c = '#ffd34a', f}) => (
	<g transform={`translate(${x},${y + Math.sin(f / 20) * 2}) scale(${s})`}>
		<ellipse cx={0} cy={30} rx={46} ry={30} fill={c} />
		<circle cx={0} cy={-14} r={34} fill="#000" stroke="#fff0cc" strokeWidth={2} />
		<ellipse cx={-11} cy={-16} rx={6} ry={8} fill="#fff" />
		<ellipse cx={11} cy={-16} rx={6} ry={8} fill="#fff" />
	</g>
);

/* ---------------------------------- bridge -------------------------------- */
export const Bridge: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Back id="brg" top="#5ab0e8" bot="#c8ecf8" floorY={1080} />
		<path d="M-500,640 Q200,560 900,640 T2420,620 L2420,1080 L-500,1080 Z" fill="#7aa8a0" opacity={0.6} />
		<rect x={-500} y={980} width={2920} height={300} fill="#2a5a8a" />
		{Array.from({length: 20}).map((_, i) => (
			<rect key={i} x={((i * 160 + f * 2) % 2600) - 400} y={1000 + (i % 3) * 25} width={90} height={5} fill="#8ac8f0" opacity={0.6} />
		))}
		<rect x={-500} y={470} width={2920} height={50} fill="#8a3a2a" />
		<rect x={-500} y={430} width={2920} height={14} fill="#a84a3a" />
		{Array.from({length: 26}).map((_, i) => (
			<rect key={i} x={-480 + i * 120} y={440} width={10} height={30} fill="#a84a3a" />
		))}
		{[150, 1750].map((x) => (
			<rect key={x} x={x - 50} y={520} width={100} height={500} fill="#6a2a20" />
		))}
	</Svg>
);
/* road under the bridge: grey band the truck drives on */
export const RoadBand: React.FC<{y?: number}> = ({y = 900}) => (
	<g>
		<rect x={-500} y={y} width={2920} height={90} fill="#4a4f5a" />
		{Array.from({length: 16}).map((_, i) => (
			<rect key={i} x={-400 + i * 200} y={y + 42} width={100} height={8} fill="#f2f2e0" />
		))}
	</g>
);
export const Truck: React.FC<{x: number; y?: number; mattress?: boolean; c?: string; s?: number}> = ({x, y = 940, mattress, c = '#2f6fd8', s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-300} y={-200} width={430} height={170} rx={8} fill={mattress ? '#e8e2d2' : c} />
		{mattress ? [0, 1, 2, 3].map((i) => <rect key={i} x={-300} y={-200 - i * 34} width={430} height={30} rx={14} fill={['#f2a8c4', '#a8d8f2', '#f2e2a8', '#c4f2a8'][i]} stroke="#fff" strokeWidth={3} />) : null}
		<rect x={140} y={-160} width={150} height={130} rx={16} fill={c} />
		<rect x={170} y={-140} width={90} height={56} rx={8} fill="#bfe6ff" />
		{[-220, 40, 220].map((wx) => (
			<g key={wx}>
				<circle cx={wx} cy={-20} r={36} fill="#141826" />
				<circle cx={wx} cy={-20} r={15} fill="#8a92a8" />
			</g>
		))}
	</g>
);
export const SimpleCar: React.FC<{x: number; y?: number; c?: string; s?: number; dir?: 1 | -1}> = ({x, y = 960, c = '#d94a3a', s = 1, dir = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
		<path d="M-170,-40 L-150,-90 L-80,-140 L70,-140 L130,-90 L180,-80 L180,-30 L-170,-30 Z" fill={c} />
		<path d="M-70,-128 L60,-128 L105,-90 L-120,-90 Z" fill="#bfe6ff" />
		<rect x={170} y={-74} width={14} height={14} fill="#fff4b0" />
		{[-100, 110].map((wx) => (
			<g key={wx}>
				<circle cx={wx} cy={-26} r={30} fill="#141826" />
				<circle cx={wx} cy={-26} r={12} fill="#8a92a8" />
			</g>
		))}
	</g>
);

/* -------------------------------- observatory ------------------------------ */
export const Observatory: React.FC<{f: number}> = ({f}) => (
	<Svg>
		<Back id="obs" top="#03061a" bot="#1a1f50" floorY={900} />
		{Array.from({length: 140}).map((_, i) => (
			<circle key={i} cx={random('os' + i) * 2600 - 340} cy={random('oy' + i) * 760} r={0.8 + random('or' + i) * 1.8} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(f / 25 + i))} />
		))}
		<path d="M-500,820 Q300,700 900,800 T2420,760 L2420,1300 L-500,1300 Z" fill="#0c0f2a" />
		<g transform="translate(1500,800)">
			<rect x={-160} y={-60} width={320} height={160} fill="#c8ccd8" />
			<path d="M-170,-60 A170,170 0 0 1 170,-60 Z" fill="#e2e6ee" />
			<rect x={-30} y={-230} width={60} height={170} fill="#1a1f40" transform="rotate(20)" />
		</g>
		<path d={`M${-200 + ((f * 6) % 2800)},${120 + ((f * 2) % 300)} l-160,-50`} stroke="#fff" strokeWidth={3} opacity={0.6} strokeLinecap="round" />
	</Svg>
);
export const Telescope: React.FC<{x: number; y?: number}> = ({x, y = 900}) => (
	<g>
		<line x1={x} y1={y - 150} x2={x - 50} y2={y} stroke="#9aa9b3" strokeWidth={8} />
		<line x1={x} y1={y - 150} x2={x + 50} y2={y} stroke="#9aa9b3" strokeWidth={8} />
		<line x1={x} y1={y - 150} x2={x} y2={y} stroke="#9aa9b3" strokeWidth={8} />
		<g transform={`translate(${x},${y - 160}) rotate(-35)`}>
			<rect x={-40} y={-26} width={240} height={52} rx={10} fill="#e2e6ee" />
			<rect x={190} y={-32} width={30} height={64} rx={6} fill="#3a4256" />
		</g>
	</g>
);

/* ------------------------------- mountains -------------------------------- */
export const Mountains: React.FC<{f: number; dusk?: boolean}> = ({f, dusk}) => (
	<Svg>
		<Back id={dusk ? 'mtd' : 'mty'} top={dusk ? '#4a3a7a' : '#8ad0f0'} bot={dusk ? '#ffa880' : '#e8f6f2'} floorY={900} />
		<path d="M-500,800 L0,330 L320,600 L700,250 L1100,640 L1500,300 L1900,620 L2420,380 L2420,900 L-500,900 Z" fill={dusk ? '#5a4a7a' : '#7a9ab0'} />
		<path d="M640,310 L700,250 L760,310 L730,300 L700,320 Z M1440,360 L1500,300 L1560,360 L1500,350 Z" fill="#fff" />
		<path d="M-500,880 Q400,760 960,840 T2420,820 L2420,1300 L-500,1300 Z" fill={dusk ? '#3a5a4a' : '#6aa86a'} />
		<path d="M760,1300 Q900,900 960,830 Q1020,900 1160,1300 Z" fill="#c8b48a" />
		{Array.from({length: 12}).map((_, i) => (
			<g key={i} transform={`translate(${-300 + i * 220 + (i % 2) * 60},${890 + (i % 3) * 10})`}>
				<path d={`M0,0 L-34,0 L0,-${110 + (i % 3) * 20} L34,0 Z`} fill={dusk ? '#24402e' : '#2f6a40'} transform={`rotate(${Math.sin(f / 50 + i) * 1.5})`} />
			</g>
		))}
	</Svg>
);

/* ------------------------------ indoor room -------------------------------- */
export const Room: React.FC<{f: number; wall: string; night?: boolean; window?: boolean; floor?: string}> = ({f, wall, night, window = true, floor}) => (
	<Svg>
		<Back id={'rm' + wall.slice(1) + (night ? 'n' : '')} top={night ? darken(wall, 0.55) : lighten(wall, 0.1)} bot={night ? darken(wall, 0.4) : wall} floorY={880} floor={floor ?? (night ? '#2a2440' : '#b98a5a')} />
		<rect x={-500} y={700} width={2920} height={14} fill={darken(wall, night ? 0.6 : 0.2)} />
		{window ? (
			<g>
				<rect x={1300} y={160} width={400} height={320} rx={8} fill="#f1ece0" />
				<rect x={1318} y={178} width={364} height={284} fill={night ? '#0b1030' : '#ffd7a0'} />
				{night ? <circle cx={1600} cy={240} r={26} fill="#eef1ff" /> : <circle cx={1420} cy={400} r={44} fill="#fff1c8" />}
				<line x1={1500} y1={178} x2={1500} y2={462} stroke="#f1ece0" strokeWidth={10} />
			</g>
		) : null}
		{night ? <ellipse cx={500} cy={300} rx={260} ry={200} fill="#ffcf80" opacity={0.12 + 0.02 * Math.sin(f / 9)} /> : null}
	</Svg>
);
export const Bed: React.FC<{x: number; w?: number; c?: string; sheet?: string}> = ({x, w = 760, c = '#3a3050', sheet = '#d9d4e6'}) => (
	<g>
		<rect x={x - w / 2} y={700} width={w} height={150} rx={20} fill={c} />
		<rect x={x + w / 2 - 40} y={540} width={40} height={320} rx={12} fill={c} />
		<rect x={x - w / 2 + 20} y={660} width={w - 60} height={90} rx={36} fill={sheet} />
		<rect x={x + w / 2 - 200} y={620} width={150} height={60} rx={26} fill="#fff" />
	</g>
);
export const Mirror: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
	<g>
		<rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={18} fill="#c9a24a" />
		<rect x={x} y={y} width={w} height={h} rx={8} fill="#bfe6ff" opacity={0.55} />
		<polygon points={`${x + 40},${y + h} ${x + 110},${y + h} ${x + w * 0.6},${y} ${x + w * 0.6 - 70},${y}`} fill="#fff" opacity={0.25} />
	</g>
);

/* ------------------------------- graphics --------------------------------- */
/* line chart of deaths per day with one spike; draw = 0..1 how far the line is drawn,
   spike = 0..1 height of the spike, shrink = 0..1 how much it has gone down */
export const DeathChart: React.FC<{draw: number; spike: number; label?: string; f: number}> = ({draw, spike, label, f}) => {
	const W = 1400, H = 560, X0 = 260, Y0 = 820;
	const sx = 0.32;
	const pts: string[] = [];
	const n = 200;
	for (let i = 0; i <= n * draw; i++) {
		const u = i / n;
		let y = 120 + Math.sin(u * 30) * 6 + random('dc' + i) * 10;
		const d = Math.abs(u - sx);
		if (d < 0.01) y += spike * (H - 140) * (1 - d / 0.01);
		pts.push(`${X0 + u * W},${Y0 - y}`);
	}
	return (
		<g>
			<line x1={X0} y1={Y0} x2={X0 + W} y2={Y0} stroke="#aab3d6" strokeWidth={4} />
			<line x1={X0} y1={Y0} x2={X0} y2={Y0 - H} stroke="#aab3d6" strokeWidth={4} />
			{['2026', '2031', '2050', '2075', '2100', '2126'].map((t, i) => (
				<text key={t} x={X0 + [0, sx, 0.47, 0.64, 0.82, 1][i] * W} y={Y0 + 46} textAnchor="middle" fontSize={28} fontFamily={FONT} fill="#aab3d6">
					{t}
				</text>
			))}
			<text x={X0 - 20} y={Y0 - H - 20} fontSize={28} fontFamily={FONT} fill="#aab3d6">
				DEATHS PER DAY
			</text>
			<path d={'M' + pts.join(' L')} stroke="#5ad8ff" strokeWidth={6} fill="none" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 8px #5ad8ff)'}} />
			{label && spike > 0.2 ? (
				<g transform={`translate(${X0 + sx * W + 40},${Y0 - 120 - spike * (H - 140) + 40})`} opacity={Math.min(1, (spike - 0.2) * 3)}>
					<rect x={0} y={-50} width={420} height={80} rx={40} fill="#3a0d14" stroke="#ff4a5a" strokeWidth={4} />
					<text x={210} y={4} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">
						{label}
					</text>
				</g>
			) : null}
			{spike > 0.9 ? <circle cx={X0 + sx * W} cy={Y0 - 120 - spike * (H - 140)} r={16 + 6 * Math.sin(f / 4)} fill="#ff4a5a" /> : null}
		</g>
	);
};

/* icon tile on a board: pops in at t (local frames), optional red cross at x */
export const Tile: React.FC<{x: number; y: number; t: number; label: string; icon: React.ReactNode; cross?: number; check?: number; c?: string; w?: number}> = ({x, y, t, label, icon, cross = -1, check = -1, c = '#5ad8ff', w = 380}) => {
	if (t < 0) return null;
	const k = spring({frame: t, fps: 30, config: {damping: 12, stiffness: 160}});
	const ck = cross >= 0 ? interpolate(cross, [0, 8], [0, 1], clamp) : 0;
	const chk = check >= 0 ? interpolate(check, [0, 8], [0, 1], clamp) : 0;
	return (
		<g transform={`translate(${x},${y + Math.sin((t + x) / 30) * 4}) scale(${k})`}>
			<rect x={-w / 2} y={-200} width={w} height={400} rx={30} fill="#11142c" stroke={c} strokeWidth={5} />
			<g transform="translate(0,-40)">{icon}</g>
			<text y={150} textAnchor="middle" fontSize={label.length > 14 ? 30 : 38} fontFamily={FONT} fontWeight={800} fill="#fff">
				{label}
			</text>
			{ck > 0 ? (
				<g stroke="#ff4a5a" strokeWidth={16} strokeLinecap="round">
					<line x1={-120} y1={-150} x2={-120 + 240 * ck} y2={-150 + 240 * ck} />
					<line x1={120} y1={-150} x2={120 - 240 * Math.max(0, ck * 2 - 1)} y2={-150 + 240 * Math.max(0, ck * 2 - 1)} />
				</g>
			) : null}
			{chk > 0 ? <path d="M-80,-30 L-20,40 L100,-110" stroke="#4aff9a" strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray={340} strokeDashoffset={340 * (1 - chk)} /> : null}
		</g>
	);
};

/* simple flat icons (~200 px, centred) */
export const Icon: React.FC<{n: string; c?: string}> = ({n, c = '#5ad8ff'}) => {
	switch (n) {
		case 'chartDown':
			return <path d="M-100,-80 L-40,-20 L0,-50 L100,60 M60,60 L100,60 L100,20" stroke="#ff4a5a" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
		case 'chartUp':
			return <path d="M-100,60 L-40,0 L0,30 L100,-80 M60,-80 L100,-80 L100,-40" stroke="#4aff9a" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
		case 'temple':
			return (
				<g fill={c}>
					<path d="M-110,-40 L0,-110 L110,-40 Z" />
					{[-80, -27, 27, 80].map((x) => (
						<rect key={x} x={x - 12} y={-30} width={24} height={110} />
					))}
					<rect x={-120} y={80} width={240} height={20} />
				</g>
			);
		case 'people':
			return (
				<g fill={c}>
					{[-70, 0, 70].map((x, i) => (
						<g key={x} transform={`translate(${x},${i === 1 ? -14 : 0})`}>
							<circle cy={-50} r={30} />
							<path d="M-45,60 Q-45,-10 0,-10 Q45,-10 45,60 Z" />
						</g>
					))}
				</g>
			);
		case 'brain':
			return <path d="M-90,20 Q-110,-60 -40,-80 Q0,-110 40,-80 Q110,-60 90,20 Q80,70 30,70 L30,90 L-30,90 L-30,70 Q-80,70 -90,20 Z M0,-80 L0,60" stroke={c} strokeWidth={12} fill="none" strokeLinejoin="round" />;
		case 'eye':
			return (
				<g>
					<path d="M-110,0 Q0,-90 110,0 Q0,90 -110,0 Z" stroke={c} strokeWidth={12} fill="none" />
					<circle r={34} fill={c} />
				</g>
			);
		case 'water':
			return <path d="M0,-100 Q70,-10 70,30 A70,70 0 0 1 -70,30 Q-70,-10 0,-100 Z" fill={c} />;
		case 'car':
			return (
				<g transform="scale(0.8)">
					<SimpleCar x={0} y={60} c={c} />
				</g>
			);
		case 'bullet':
			return <path d="M-100,-24 L40,-24 Q100,-24 110,0 Q100,24 40,24 L-100,24 Z M-60,-24 L-60,24" fill={c} stroke="#11142c" strokeWidth={6} />;
		case 'building':
			return (
				<g>
					<rect x={-60} y={-100} width={120} height={200} fill={c} />
					{Array.from({length: 4}).map((_, r) => [0, 1].map((cc) => <rect key={r + '-' + cc} x={-40 + cc * 50} y={-80 + r * 45} width={30} height={30} fill="#11142c" />))}
					<path d="M80,-60 q20,40 0,80" stroke="#fff" strokeWidth={6} fill="none" />
				</g>
			);
		case 'asteroid':
			return (
				<g>
					<path d="M60,-60 L-80,60" stroke="#ffa84a" strokeWidth={14} strokeLinecap="round" opacity={0.6} />
					<circle cx={70} cy={-70} r={50} fill={c} />
					<circle cx={55} cy={-80} r={10} fill="#11142c" />
				</g>
			);
		case 'sun':
			return (
				<g>
					{Array.from({length: 12}).map((_, i) => (
						<line key={i} x1={0} y1={0} x2={Math.cos((i / 12) * 6.28) * 110} y2={Math.sin((i / 12) * 6.28) * 110} stroke="#ffc94a" strokeWidth={10} />
					))}
					<circle r={62} fill="#ffc94a" />
				</g>
			);
		case 'gamma':
			return (
				<g>
					<circle r={30} fill="#d8a8ff" />
					{[0, 1, 2].map((i) => (
						<circle key={i} r={50 + i * 30} fill="none" stroke="#d8a8ff" strokeWidth={6} opacity={0.7 - i * 0.2} />
					))}
					<line x1={-120} y1={0} x2={120} y2={0} stroke="#fff" strokeWidth={6} />
				</g>
			);
		case 'factory':
			return (
				<g fill={c}>
					<path d="M-110,100 L-110,-10 L-50,-50 L-50,-10 L10,-50 L10,-10 L70,-50 L70,-110 L100,-110 L100,100 Z" />
				</g>
			);
		case 'chain':
			return (
				<g stroke={c} strokeWidth={14} fill="none">
					<rect x={-110} y={-30} width={110} height={60} rx={30} />
					<rect x={10} y={-30} width={110} height={60} rx={30} transform="rotate(20,60,0)" />
				</g>
			);
		case 'food':
			return (
				<g>
					<path d="M-90,-20 L90,-20 L70,90 L-70,90 Z" fill={c} />
					<circle cx={-30} cy={-40} r={30} fill="#ff4a5a" />
					<circle cx={30} cy={-46} r={26} fill="#ffc94a" />
				</g>
			);
		case 'pill':
			return (
				<g transform="rotate(-35)">
					<rect x={-100} y={-38} width={200} height={76} rx={38} fill={c} />
					<rect x={0} y={-38} width={100} height={76} rx={38} fill="#fff" />
				</g>
			);
		case 'home':
			return <path d="M-100,0 L0,-90 L100,0 L70,0 L70,90 L-70,90 L-70,0 Z" fill={c} />;
		case 'pray':
			return <path d="M-10,90 L-10,-60 Q-10,-100 -40,-60 L-80,40 Q-60,80 -10,90 Z M10,90 L10,-60 Q10,-100 40,-60 L80,40 Q60,80 10,90 Z" fill={c} />;
		case 'heart':
			return <path d="M0,90 L-90,0 Q-130,-60 -70,-90 Q-20,-110 0,-60 Q20,-110 70,-90 Q130,-60 90,0 Z" fill="#ff5a7a" />;
		case 'shield':
			return <path d="M0,-100 L90,-60 Q90,60 0,100 Q-90,60 -90,-60 Z" fill={c} />;
		case 'camera':
			return (
				<g>
					<rect x={-100} y={-60} width={200} height={130} rx={18} fill={c} />
					<rect x={-40} y={-84} width={80} height={30} rx={8} fill={c} />
					<circle cy={4} r={42} fill="#11142c" />
					<circle cy={4} r={24} fill={c} />
				</g>
			);
		case 'shadow':
			return (
				<g>
					<circle cy={-50} r={34} fill={c} />
					<rect x={-28} y={-12} width={56} height={100} rx={20} fill={c} />
					<ellipse cy={96} rx={90} ry={16} fill="#000" opacity={0.6} />
				</g>
			);
		case 'hat':
			return (
				<g fill={c}>
					<rect x={-60} y={-80} width={120} height={110} rx={10} />
					<rect x={-110} y={24} width={220} height={22} rx={10} />
				</g>
			);
		default:
			return <circle r={80} fill={c} />;
	}
};

/* big rolling number, screen-centred group (use inside an svg) */
export const RollNumber: React.FC<{x: number; y: number; f: number; t0: number; t1: number; from: number; to: number; size?: number; c?: string; fmt?: (v: number) => string}> = ({
	x,
	y,
	f,
	t0,
	t1,
	from,
	to,
	size = 180,
	c = '#ffffff',
	fmt = (v) => Math.round(v).toLocaleString('en-US'),
}) => {
	if (f < t0) return null;
	const v = interpolate(f, [t0, t1], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
	const pop = f > t1 && f < t1 + 10 ? 1 + 0.12 * Math.exp(-(f - t1) / 3) : 1;
	return (
		<text x={x} y={y} textAnchor="middle" fontSize={size * pop} fontFamily={FONT} fontWeight={900} fill={c} style={{filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.5))'}}>
			{fmt(v)}
		</text>
	);
};

/* board title that slides in letter-group by word */
export const Title: React.FC<{x: number; y: number; t: number; text: string; size?: number; c?: string}> = ({x, y, t, text, size = 64, c = '#ffffff'}) => {
	if (t < 0) return null;
	const words = text.split(' ');
	let off = 0;
	const widths = words.map((w) => w.length * size * 0.72 + size * 0.38);
	const total = widths.reduce((a, b) => a + b, 0);
	return (
		<g>
			{words.map((w, i) => {
				const k = interpolate(t, [i * 3, i * 3 + 9], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
				const wx = x - total / 2 + off + widths[i] / 2;
				off += widths[i];
				return (
					<text key={i} x={wx} y={y + (1 - k) * 30} textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={c} opacity={k}>
						{w}
					</text>
				);
			})}
		</g>
	);
};

export const Chalk: React.FC<{x: number; y: number; text: string; t: number; size?: number; c?: string}> = ({x, y, text, t, size = 60, c = '#f4f1e6'}) => {
	if (t < 0) return null;
	const n = Math.floor(interpolate(t, [0, text.length * 1.2], [0, text.length], clamp));
	return (
		<text x={x} y={y} textAnchor="middle" fontSize={size} fontFamily={HAND} fontWeight={700} fill={c}>
			{text.slice(0, n)}
		</text>
	);
};
