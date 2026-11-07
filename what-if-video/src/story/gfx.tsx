import React from 'react';
import {Easing, interpolate, random} from 'remotion';
import {env} from '../kit/actions';
import {FONT, HAND} from '../kit/ui';

/* World-space motion graphics for the luck story. Every piece takes the shot-local frame f
   and a [t0, t1] window, pops in with a spring-ish overshoot, lives (wobble / pulse) and
   leaves. Colours: lime #b6ff1f is the hero accent, gold #ffd34a for luck. */
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const back = Easing.out(Easing.back(2.2));
export const LIME = '#b6ff1f';
export const GOLD = '#ffd34a';
export const INK = '#0b0f08';

export const pop = (f: number, t0: number) => interpolate(f, [t0, t0 + 12], [0, 1], {...cl, easing: back});
const vis = (f: number, t0: number, t1: number) => env(f, t0, t1, 8, 8);
type W = {f: number; t0: number; t1: number; x?: number; y?: number; s?: number};

/* tag: label pill that bounces in */
export const Tag: React.FC<W & {text: string; sub?: string; c?: string; size?: number; rot?: number}> = ({f, t0, t1, x = 960, y = 200, s = 1, text, sub, c = LIME, size = 54, rot = -2}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const p = pop(f, t0);
	const w = Math.max(260, text.length * size * 0.62 + 70);
	return (
		<g transform={`translate(${x},${y + Math.sin(f / 18) * 5}) rotate(${rot + Math.sin(f / 26) * 1.2}) scale(${s * p})`} opacity={k}>
			<rect x={-w / 2 + 6} y={-size * 0.85 + 10} width={w} height={size * 1.7 + (sub ? 40 : 0)} rx={size * 0.5} fill="#000" opacity={0.3} />
			<rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.7 + (sub ? 40 : 0)} rx={size * 0.5} fill="#0f1a08" stroke={c} strokeWidth={5} />
			<text x={0} y={size * 0.33} textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={c} letterSpacing={1}>
				{text}
			</text>
			{sub ? (
				<text x={0} y={size * 0.33 + 44} textAnchor="middle" fontSize={size * 0.5} fontFamily={FONT} fontWeight={600} fill="#e9f5d0">
					{sub}
				</text>
			) : null}
		</g>
	);
};

/* sparkle burst */
export const Burst: React.FC<Omit<W, "t1"> & {c?: string; n?: number; r?: number}> = ({f, t0, x = 960, y = 540, s = 1, c = GOLD, n = 14, r = 220}) => {
	const u = (f - t0) / 28;
	if (u < 0 || u > 1) return null;
	return (
		<g opacity={1 - u}>
			{Array.from({length: n}).map((_, i) => {
				const a = (i / n) * Math.PI * 2 + random('b' + i) * 0.5;
				const d = r * s * (0.25 + 0.75 * Math.sqrt(u)) * (0.7 + random('d' + i) * 0.5);
				return <path key={i} d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z" transform={`translate(${x + Math.cos(a) * d},${y + Math.sin(a) * d}) scale(${(1 - u) * 1.3 * s}) rotate(${u * 120})`} fill={c} />;
			})}
		</g>
	);
};

/* coin that is tossed, spins and lands showing H or T */
export const Coin: React.FC<W & {face?: 'H' | 'T'; flips?: number; height?: number}> = ({f, t0, t1, x = 960, y = 700, s = 1, face = 'H', flips = 3, height = 260}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const u = interpolate(f, [t0, t0 + 34], [0, 1], cl);
	const yy = y - Math.sin(u * Math.PI) * height * s;
	const rot = u * flips * Math.PI * 2;
	const sy = Math.abs(Math.cos(rot));
	const showH = Math.cos(rot) > 0 ? face === 'H' : face !== 'H';
	const done = u >= 1;
	return (
		<g transform={`translate(${x},${yy}) scale(${s})`} opacity={k}>
			<ellipse cx={0} cy={0} rx={60} ry={Math.max(4, 60 * (done ? 1 : sy))} fill={GOLD} stroke="#b9891a" strokeWidth={6} />
			{(done || sy > 0.3) && (
				<text x={0} y={(done ? 1 : sy) * 22} textAnchor="middle" fontSize={64 * (done ? 1 : sy)} fontFamily={FONT} fontWeight={900} fill="#8a6210" transform={`scale(1,1)`}>
					{done ? face : showH ? 'H' : 'T'}
				</text>
			)}
		</g>
	);
};

/* row / grid of coins that fills in one by one */
export const HeadsGrid: React.FC<W & {n: number; cols?: number; label?: string}> = ({f, t0, t1, x = 960, y = 300, s = 1, n, cols = 14, label}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const shown = Math.floor(interpolate(f, [t0 + 6, t1 - 20], [0, n], cl));
	return (
		<g opacity={k} transform={`translate(${x},${y}) scale(${s})`}>
			{Array.from({length: n}).map((_, i) => {
				const cx = ((i % cols) - (cols - 1) / 2) * 62;
				const cy = Math.floor(i / cols) * 62;
				const on = i < shown;
				return (
					<g key={i} transform={`translate(${cx},${cy}) scale(${on ? 1 : 0.2})`} opacity={on ? 1 : 0.15}>
						<circle r={26} fill={on ? GOLD : '#555'} stroke="#b9891a" strokeWidth={3} />
						<text y={9} textAnchor="middle" fontSize={26} fontFamily={FONT} fontWeight={900} fill="#8a6210">
							H
						</text>
					</g>
				);
			})}
			{label ? (
				<text x={0} y={Math.ceil(n / cols) * 62 + 40} textAnchor="middle" fontSize={52} fontFamily={FONT} fontWeight={900} fill={LIME}>
					{label.replace('{n}', String(shown))}
				</text>
			) : null}
		</g>
	);
};

/* a nine-day calendar that ticks */
export const Calendar: React.FC<W & {upTo?: number}> = ({f, t0, t1, x = 960, y = 300, s = 1, upTo = 9}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const p = pop(f, t0);
	return (
		<g transform={`translate(${x},${y}) scale(${s * p})`} opacity={k}>
			<rect x={-330} y={-100} width={660} height={260} rx={26} fill="#0f1a08" stroke={LIME} strokeWidth={6} />
			<rect x={-330} y={-100} width={660} height={64} rx={26} fill={LIME} />
			<text x={0} y={-52} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill={INK}>
				9 DAYS
			</text>
			{Array.from({length: 9}).map((_, i) => {
				const cx = -240 + (i % 5) * 120 + (i >= 5 ? 60 : 0);
				const cy = -2 + Math.floor(i / 5) * 90;
				const tick = f > t0 + 14 + i * 5 && i < upTo;
				return (
					<g key={i} transform={`translate(${cx},${cy})`}>
						<rect x={-38} y={-34} width={76} height={68} rx={12} fill={tick ? '#254012' : '#1b2a10'} stroke={tick ? LIME : '#3d5a20'} strokeWidth={3} />
						<text y={12} textAnchor="middle" fontSize={34} fontFamily={FONT} fontWeight={800} fill={tick ? LIME : '#8aa36a'}>
							{i + 1}
						</text>
					</g>
				);
			})}
		</g>
	);
};

/* egg with two yolks */
export const Egg: React.FC<W> = ({f, t0, t1, x = 1000, y = 700, s = 1}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const open = interpolate(f, [t0 + 14, t0 + 30], [0, 1], cl);
	return (
		<g transform={`translate(${x},${y}) scale(${s * pop(f, t0)})`} opacity={k}>
			<ellipse cx={0} cy={26} rx={120} ry={34} fill="#d9d9e0" />
			<ellipse cx={0} cy={16} rx={104} ry={26} fill="#fff" />
			{open > 0.1 ? (
				<>
					<circle cx={-34} cy={8} r={26 * open} fill="#ffb21a" />
					<circle cx={36} cy={14} r={26 * open} fill="#ffa000" />
					<circle cx={-42} cy={0} r={7 * open} fill="#fff" opacity={0.7} />
					<circle cx={28} cy={6} r={7 * open} fill="#fff" opacity={0.7} />
				</>
			) : (
				<ellipse cx={0} cy={-40} rx={52} ry={68} fill="#f4eede" stroke="#d9cfb3" strokeWidth={4} />
			)}
			<path d={`M-60,${-40 - 30 * open} l22,16 l22,-16 l22,16 l22,-16 l20,12`} stroke="#d9cfb3" strokeWidth={5} fill="none" opacity={1 - open} />
		</g>
	);
};

/* traffic lights, going green one by one */
export const Lights: React.FC<W & {n?: number}> = ({f, t0, t1, x = 960, y = 420, s = 1, n = 5}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{Array.from({length: n}).map((_, i) => {
				const cx = (i - (n - 1) / 2) * 190;
				const green = f > t0 + 8 + i * 9;
				return (
					<g key={i} transform={`translate(${cx},${(i % 2) * 30}) scale(${pop(f, t0 + i * 4)})`}>
						<rect x={-30} y={-90} width={60} height={150} rx={14} fill="#1b1d26" />
						<rect x={-6} y={60} width={12} height={170} fill="#2a2d3a" />
						<circle cy={-58} r={16} fill={green ? '#4a2a2a' : '#ff4a4a'} />
						<circle cy={-18} r={16} fill="#4a4a2a" />
						<circle cy={22} r={16} fill={green ? '#3dff7a' : '#1f3a2a'} />
						{green ? <circle cy={22} r={34} fill="#3dff7a" opacity={0.25} /> : null}
					</g>
				);
			})}
		</g>
	);
};

/* lottery ticket */
export const Ticket: React.FC<W & {nums?: number[]; check?: boolean}> = ({f, t0, t1, x = 960, y = 520, s = 1, nums = [7, 14, 23, 38, 52, 9], check = true}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) rotate(${-4 + Math.sin(f / 20) * 2}) scale(${s * pop(f, t0)})`} opacity={k}>
			<rect x={-250} y={-150} width={500} height={300} rx={22} fill="#000" opacity={0.28} transform="translate(8,12)" />
			<rect x={-250} y={-150} width={500} height={300} rx={22} fill="#fff6d6" stroke="#e0b948" strokeWidth={6} />
			<rect x={-250} y={-150} width={500} height={70} rx={22} fill="#e84a4a" />
			<text y={-100} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff" letterSpacing={3}>
				LOTTERY
			</text>
			{nums.map((n, i) => {
				const cx = -190 + i * 76;
				const hit = check && f > t0 + 22 + i * 8;
				return (
					<g key={i} transform={`translate(${cx},10)`}>
						<circle r={30} fill={hit ? LIME : '#fff'} stroke="#b9891a" strokeWidth={4} />
						<text y={12} textAnchor="middle" fontSize={32} fontFamily={FONT} fontWeight={900} fill={INK}>
							{n}
						</text>
					</g>
				);
			})}
			<text x={0} y={110} textAnchor="middle" fontSize={34} fontFamily={HAND} fontWeight={700} fill="#8a6a22">
				{check && f > t0 + 80 ? 'ALL SIX MATCH!' : 'good luck!'}
			</text>
		</g>
	);
};

/* money: stacks of bills with sparks */
export const Money: React.FC<W & {n?: number}> = ({f, t0, t1, x = 960, y = 800, s = 1, n = 4}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{Array.from({length: n}).map((_, i) => {
				const px = (i - (n - 1) / 2) * 150;
				const h = 60 + 40 * pop(f, t0 + i * 6);
				return (
					<g key={i} transform={`translate(${px},0)`}>
						<rect x={-60} y={-h} width={120} height={h} rx={8} fill="#3dbf6a" stroke="#1f7a40" strokeWidth={4} />
						<rect x={-60} y={-h * 0.6} width={120} height={10} fill="#2f9a55" />
						<text y={-h / 2 + 10} textAnchor="middle" fontSize={38} fontFamily={FONT} fontWeight={900} fill="#d9ffe6">
							$
						</text>
					</g>
				);
			})}
			{Array.from({length: 8}).map((_, i) => {
				const u = ((f - t0 + i * 9) % 60) / 60;
				return <text key={i} x={-300 + i * 85} y={-120 - u * 200} fontSize={36} fontFamily={FONT} fontWeight={900} fill={GOLD} opacity={1 - u}>$</text>;
			})}
		</g>
	);
};

/* roulette wheel, ball lands on red */
export const Roulette: React.FC<W & {spinEnd?: number}> = ({f, t0, t1, x = 960, y = 560, s = 1, spinEnd = 50}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const u = interpolate(f, [t0, t0 + spinEnd], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
	const rot = u * 900;
	const ballA = (1 - u) * 1400 + 20;
	const ballR = 150 - 26 * (1 - (1 - u) * (1 - u)) * 0 - (1 - u) * -20 - u * 28;
	return (
		<g transform={`translate(${x},${y}) scale(${s * pop(f, t0)})`} opacity={k}>
			<ellipse cx={0} cy={0} rx={200} ry={200} fill="#4a2a1a" stroke="#d8b24a" strokeWidth={10} />
			<g transform={`rotate(${rot})`}>
				{Array.from({length: 16}).map((_, i) => {
					const a0 = (i / 16) * Math.PI * 2;
					const a1 = ((i + 1) / 16) * Math.PI * 2;
					const c = i === 0 ? '#1f9a4a' : i % 2 ? '#d93a3a' : '#16161c';
					return <path key={i} d={`M0,0 L${Math.cos(a0) * 168},${Math.sin(a0) * 168} A168,168 0 0 1 ${Math.cos(a1) * 168},${Math.sin(a1) * 168} Z`} fill={c} stroke="#e8d28a" strokeWidth={2} />;
				})}
				<circle r={70} fill="#d8b24a" />
				<circle r={20} fill="#8a6210" />
			</g>
			<circle cx={Math.cos((ballA * Math.PI) / 180) * ballR} cy={Math.sin((ballA * Math.PI) / 180) * ballR} r={11} fill="#fff" stroke="#999" strokeWidth={2} />
		</g>
	);
};

/* casino chips stack */
export const Chips: React.FC<W & {n?: number}> = ({f, t0, t1, x = 960, y = 830, s = 1, n = 9}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{Array.from({length: n}).map((_, i) => (
				<g key={i} transform={`translate(0,${-i * 16 * pop(f, t0 + i * 2)})`}>
					<ellipse rx={64} ry={18} fill={i % 2 ? '#d93a3a' : '#fff'} stroke="#222" strokeWidth={3} />
					<ellipse rx={44} ry={11} fill="none" stroke={i % 2 ? '#fff' : '#d93a3a'} strokeWidth={4} strokeDasharray="10 8" />
				</g>
			))}
		</g>
	);
};

/* a vehicle sliding in and braking: truck (side view) */
export const Truck: React.FC<W & {stopX: number; from?: number}> = ({f, t0, t1, y = 900, s = 1, stopX, from = -700}) => {
	const k = interpolate(f, [t0, t1], [0, 1], cl);
	if (k <= 0 && f < t0) return null;
	const u = interpolate(f, [t0, t0 + 40], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
	const x = from + (stopX - from) * u;
	const shake = u < 1 ? Math.sin(f * 2) * 2 : 0;
	return (
		<g transform={`translate(${x},${y + shake}) scale(${s})`}>
			<ellipse cx={0} cy={4} rx={220} ry={16} fill="#000" opacity={0.25} />
			<rect x={-260} y={-260} width={310} height={230} rx={10} fill="#e8e6e0" stroke="#bbb" strokeWidth={4} />
			<path d="M50,-210 L170,-210 L220,-120 L220,-30 L50,-30 Z" fill="#d94a3a" />
			<path d="M80,-190 L160,-190 L196,-124 L80,-124 Z" fill="#bfe6ff" />
			<rect x={-260} y={-30} width={480} height={14} fill="#333" />
			{[-190, -100, 120].map((wx, i) => (
				<g key={i} transform={`translate(${wx},-10) rotate(${-u * 0 + f * (u < 1 ? 14 : 0)})`}>
					<circle r={36} fill="#222" />
					<circle r={16} fill="#999" />
					<line x1={-16} y1={0} x2={16} y2={0} stroke="#555" strokeWidth={4} />
				</g>
			))}
			{u < 1 ? (
				<g stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7}>
					<path d="M230,-80 l60,-10 M232,-50 l70,0 M230,-20 l60,12" />
				</g>
			) : null}
		</g>
	);
};

/* little bird landing on a hood */
export const Bird: React.FC<W> = ({f, t0, t1, x = 960, y = 600, s = 1}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const u = interpolate(f, [t0, t0 + 24], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
	const flap = u < 1 ? Math.sin(f * 1.4) * 22 : 0;
	return (
		<g transform={`translate(${x + (1 - u) * 300},${y - (1 - u) * 260}) scale(${s})`} opacity={k}>
			<ellipse rx={26} ry={18} fill="#4a7ad8" />
			<circle cx={20} cy={-10} r={12} fill="#4a7ad8" />
			<path d="M30,-10 l14,4 l-14,4 z" fill="#ffb21a" />
			<circle cx={23} cy={-12} r={2.5} fill="#fff" />
			<path d={`M-6,-4 q-30,${-30 + flap} -48,${-6 + flap}`} stroke="#3563c0" strokeWidth={12} fill="none" strokeLinecap="round" />
			<path d="M-22,6 l-22,10" stroke="#3563c0" strokeWidth={9} strokeLinecap="round" />
		</g>
	);
};

/* chalk name card for the history stories */
export const Card: React.FC<W & {title: string; year?: string; lines: string[]; tilt?: number; icon?: React.ReactNode}> = ({f, t0, t1, x = 960, y = 540, s = 1, title, year, lines, tilt = -2, icon}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const p = pop(f, t0);
	const sw = Math.sin(f / 30) * 1.2;
	return (
		<g transform={`translate(${x},${y}) rotate(${tilt + sw}) scale(${s * p})`} opacity={k}>
			<rect x={-420} y={-250} width={840} height={500} rx={30} fill="#000" opacity={0.3} transform="translate(10,14)" />
			<rect x={-420} y={-250} width={840} height={500} rx={30} fill="#16240e" stroke={LIME} strokeWidth={7} />
			<rect x={-420} y={-250} width={840} height={110} rx={30} fill={LIME} />
			<text x={-380} y={-176} fontSize={58} fontFamily={FONT} fontWeight={900} fill={INK}>
				{title}
			</text>
			{year ? (
				<text x={380} y={-176} textAnchor="end" fontSize={52} fontFamily={HAND} fontWeight={700} fill={INK}>
					{year}
				</text>
			) : null}
			{lines.map((l, i) => {
				const a = interpolate(f, [t0 + 12 + i * 12, t0 + 22 + i * 12], [0, 1], cl);
				return (
					<text key={i} x={-380 + (1 - a) * 40} y={-70 + i * 76} fontSize={52} fontFamily={HAND} fontWeight={700} fill="#f4f8e6" opacity={a}>
						{l}
					</text>
				);
			})}
			{icon ? <g transform="translate(300,70)">{icon}</g> : null}
		</g>
	);
};

/* simple icons for cards */
export const Bolt: React.FC = () => <path d="M20,-70 L-40,10 L-6,10 L-24,70 L44,-14 L8,-14 Z" fill={GOLD} stroke="#b9891a" strokeWidth={5} />;
export const Ship: React.FC = () => (
	<g>
		<path d="M-80,10 L80,10 L50,50 L-50,50 Z" fill="#e8e6e0" stroke="#999" strokeWidth={4} />
		<rect x={-40} y={-30} width={80} height={40} fill="#d94a3a" />
		<rect x={-8} y={-64} width={16} height={34} fill="#333" />
		<path d="M-100,60 q20,-14 40,0 t40,0 t40,0 t40,0 t40,0" stroke="#5ab4ff" strokeWidth={6} fill="none" />
	</g>
);
export const Atom: React.FC = () => (
	<g fill="none" stroke={GOLD} strokeWidth={6}>
		<ellipse rx={80} ry={28} />
		<ellipse rx={80} ry={28} transform="rotate(60)" />
		<ellipse rx={80} ry={28} transform="rotate(120)" />
		<circle r={12} fill={GOLD} />
	</g>
);

/* the crowd that halves: n of N figures still standing */
export const Halving: React.FC<W & {stages: {at: number; n: number; label: string}[]}> = ({f, t0, t1, x = 960, y = 450, s = 1, stages}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	let st = stages[0];
	for (const g of stages) if (f >= g.at) st = g;
	const total = 160;
	const standing = Math.max(1, Math.round((st.n / 1_000_000) * total));
	const keep = st.n >= 1_000_000 ? total : st.n === 1 ? 1 : Math.max(2, standing);
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{Array.from({length: total}).map((_, i) => {
				const cx = ((i % 20) - 9.5) * 62;
				const cy = Math.floor(i / 20) * 62;
				// deterministic "who stays" order
				const rank = Math.floor(random('h' + i) * total);
				const on = st.n === 1 ? i === 77 : rank < keep;
				return (
					<g key={i} transform={`translate(${cx},${cy}) scale(${on ? 1 : 0.5})`} opacity={on ? 1 : 0.18}>
						<circle cy={-14} r={11} fill={on ? '#0b0f08' : '#6a7a55'} stroke={on ? LIME : 'none'} strokeWidth={2} />
						<rect x={-9} y={-2} width={18} height={26} rx={7} fill={on ? LIME : '#6a7a55'} />
					</g>
				);
			})}
			<text x={0} y={Math.ceil(total / 20) * 62 + 56} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill={LIME}>
				{st.label}
			</text>
		</g>
	);
};

/* investment line that shoots up and triples */
export const Chart: React.FC<W & {label?: string; c?: string}> = ({f, t0, t1, x = 960, y = 420, s = 1, label = 'x3', c = LIME}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const u = interpolate(f, [t0 + 6, t0 + 50], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
	const pts = Array.from({length: 24}).map((_, i) => {
		const a = (i / 23) * u;
		return [a * 560, -a * a * 280 - a * 40 + Math.sin(i * 1.7) * 8 * (1 - a)];
	});
	return (
		<g transform={`translate(${x - 280},${y}) scale(${s * pop(f, t0)})`} opacity={k}>
			<rect x={-30} y={-380} width={660} height={430} rx={22} fill="#0f1a08" stroke={c} strokeWidth={5} />
			<line x1={0} y1={0} x2={600} y2={0} stroke="#3d5a20" strokeWidth={3} />
			<polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
			<text x={540} y={-330 + (1 - u) * 30} textAnchor="end" fontSize={86} fontFamily={FONT} fontWeight={900} fill={c} opacity={u}>
				{label}
			</text>
		</g>
	);
};

/* decision tree: branches that grow, some bright, some dim */
export const Tree: React.FC<W & {depth?: number}> = ({f, t0, t1, x = 960, y = 760, s = 1, depth = 4}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const nodes: React.ReactNode[] = [];
	const grow = (d: number, px: number, py: number, ang: number, len: number, id: string) => {
		if (d > depth) return;
		const g = interpolate(f, [t0 + d * 10, t0 + d * 10 + 14], [0, 1], cl);
		const ex = px + Math.sin(ang) * len * g;
		const ey = py - Math.cos(ang) * len * g;
		const good = random('tr' + id) > 0.35;
		nodes.push(<line key={id} x1={px} y1={py} x2={ex} y2={ey} stroke={good ? LIME : '#ff5a4a'} strokeWidth={Math.max(3, 15 - d * 3)} strokeLinecap="round" opacity={good ? 0.95 : 0.55} />);
		if (d === depth) nodes.push(<circle key={id + 'n'} cx={ex} cy={ey} r={10 * g} fill={good ? '#eaffb0' : '#ff9a8a'} />);
		grow(d + 1, ex, ey, ang - 0.45 - random('a' + id) * 0.2, len * 0.78, id + 'l');
		grow(d + 1, ex, ey, ang + 0.45 + random('b' + id) * 0.2, len * 0.78, id + 'r');
	};
	grow(0, 0, 0, 0, 230, 't');
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{nodes}
		</g>
	);
};

/* glass of water */
export const Glass: React.FC<W & {fill?: number; sun?: boolean}> = ({f, t0, t1, x = 960, y = 800, s = 1, fill = 1, sun}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s * pop(f, t0)})`} opacity={k}>
			{sun ? <circle cx={-190} cy={-330} r={80} fill={GOLD} /> : null}
			{sun ? <path d="M-260,-120 L-120,-120" stroke={GOLD} strokeWidth={6} /> : null}
			<path d="M-70,-220 L70,-220 L52,0 L-52,0 Z" fill="#bfe6ff" opacity={0.3} stroke="#e6f6ff" strokeWidth={6} />
			<path d={`M${-66 + (1 - fill) * 16},${-220 + (1 - fill) * 190} L${66 - (1 - fill) * 16},${-220 + (1 - fill) * 190} L52,0 L-52,0 Z`} fill="#4aa8f0" opacity={0.85} />
			<ellipse cx={0} cy={-220 + (1 - fill) * 190} rx={66 - (1 - fill) * 16} ry={8} fill="#8fd0ff" />
		</g>
	);
};

/* scoreboard */
export const Score: React.FC<W & {a: number; b: number; goalAt?: number}> = ({f, t0, t1, x = 960, y = 200, s = 1, a, b, goalAt}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const scored = goalAt !== undefined && f >= goalAt;
	return (
		<g transform={`translate(${x},${y}) scale(${s * pop(f, t0)})`} opacity={k}>
			<rect x={-250} y={-70} width={500} height={150} rx={20} fill="#0f1220" stroke="#fff" strokeWidth={5} />
			<text x={-120} y={30} textAnchor="middle" fontSize={92} fontFamily={FONT} fontWeight={900} fill={scored ? GOLD : '#fff'}>
				{scored ? a + 3 : a}
			</text>
			<text x={0} y={22} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#8a93b8">
				:
			</text>
			<text x={120} y={30} textAnchor="middle" fontSize={92} fontFamily={FONT} fontWeight={900} fill="#fff">
				{b}
			</text>
			<text x={0} y={-30} textAnchor="middle" fontSize={26} fontFamily={FONT} fontWeight={700} fill="#ff6a5a" letterSpacing={3}>
				{scored ? 'GOAL!' : '89:00'}
			</text>
		</g>
	);
};

/* chat bubbles that arrive one by one */
export const Msgs: React.FC<W & {msgs: {text: string; me?: boolean; at: number}[]}> = ({f, t0, t1, x = 960, y = 300, s = 1, msgs}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			<rect x={-250} y={-80} width={500} height={80 + msgs.length * 100} rx={34} fill="#0f1a08" stroke={LIME} strokeWidth={5} />
			{msgs.map((m, i) => {
				const p = pop(f, t0 + m.at);
				return (
					<g key={i} transform={`translate(${m.me ? 40 : -40},${i * 100 + 10}) scale(${p})`}>
						<rect x={-190} y={-34} width={380} height={68} rx={30} fill={m.me ? LIME : '#2a3a1a'} />
						<text y={12} textAnchor="middle" fontSize={32} fontFamily={FONT} fontWeight={700} fill={m.me ? INK : '#f2ffd9'}>
							{m.text}
						</text>
					</g>
				);
			})}
		</g>
	);
};

/* big question mark */
export const Question: React.FC<W & {c?: string}> = ({f, t0, t1, x = 960, y = 300, s = 1, c = LIME}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<text x={x} y={y + Math.sin(f / 10) * 8} textAnchor="middle" fontSize={260 * s * pop(f, t0)} fontFamily={FONT} fontWeight={900} fill={c} opacity={k} transform={`rotate(${Math.sin(f / 16) * 5} ${x} ${y})`}>
			?
		</text>
	);
};

/* heart that cracks / beats */
export const Heart: React.FC<W & {broken?: boolean}> = ({f, t0, t1, x = 960, y = 400, s = 1, broken}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const beat = 1 + 0.08 * Math.sin(f / 4);
	return (
		<g transform={`translate(${x},${y}) scale(${s * beat * pop(f, t0)})`} opacity={k}>
			<path d="M0,60 C-120,-20 -80,-100 0,-50 C80,-100 120,-20 0,60 Z" fill="#ff4a6a" />
			{broken ? <path d="M0,-50 L-14,-10 L12,10 L-8,60" stroke="#0b0f08" strokeWidth={7} fill="none" strokeLinecap="round" /> : null}
		</g>
	);
};

/* generations of ancestors: dots that multiply, then collapse onto one dot ("you") */
export const Ancestors: React.FC<W> = ({f, t0, t1, x = 960, y = 700, s = 1}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const rows = 7;
	const dots: React.ReactNode[] = [];
	for (let r = 0; r < rows; r++) {
		const n = 2 ** r;
		const a = interpolate(f, [t0 + r * 16, t0 + r * 16 + 14], [0, 1], cl);
		for (let i = 0; i < n; i++) {
			const cx = (i - (n - 1) / 2) * (900 / Math.max(n, 6)) * (n > 6 ? 1.05 : 1.6);
			const cy = -r * 70;
			dots.push(<circle key={r + '-' + i} cx={cx} cy={cy} r={Math.max(4, 14 - r * 1.5) * a} fill={r === 0 ? LIME : '#7ab030'} opacity={0.4 + 0.6 * a} />);
			if (r > 0) dots.push(<line key={'l' + r + i} x1={cx} y1={cy} x2={(Math.floor(i / 2) - (n / 2 - 1) / 2) * (900 / Math.max(n / 2, 6)) * (n / 2 > 6 ? 1.05 : 1.6)} y2={cy + 70} stroke="#4a7a20" strokeWidth={2} opacity={0.5 * a} />);
		}
	}
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{dots}
			<circle r={22} cy={0} fill="none" stroke={LIME} strokeWidth={4} opacity={0.5 + 0.5 * Math.sin(f / 6)} />
		</g>
	);
};

/* bus pulling up and opening doors */
export const Bus: React.FC<W & {stopX: number; from?: number; leaveAt?: number}> = ({f, t0, t1, y = 900, s = 1, stopX, from = 2500, leaveAt}) => {
	if (f < t0) return null;
	const arrive = interpolate(f, [t0, t0 + 36], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
	const leave = leaveAt !== undefined ? interpolate(f, [leaveAt, leaveAt + 50], [0, 1], {...cl, easing: Easing.in(Easing.cubic)}) : 0;
	const x = from + (stopX - from) * arrive - leave * 2600;
	const door = interpolate(f, [t0 + 36, t0 + 46], [0, 1], cl) * (1 - leave);
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<ellipse cx={0} cy={6} rx={330} ry={16} fill="#000" opacity={0.25} />
			<rect x={-330} y={-250} width={660} height={230} rx={34} fill="#f2b21c" stroke="#c98a10" strokeWidth={5} />
			<rect x={-310} y={-220} width={440} height={96} rx={10} fill="#bfe6ff" />
			{[-190, -70].map((wx, i) => (
				<line key={i} x1={wx} y1={-220} x2={wx} y2={-124} stroke="#f2b21c" strokeWidth={8} />
			))}
			<rect x={150} y={-228} width={150} height={190} rx={8} fill="#2a2d3a" />
			<rect x={158 + door * 58} y={-220} width={64 - door * 58 + 0.1} height={176} fill="#bfe6ff" opacity={0.9} />
			<rect x={228} y={-220} width={64 - door * 58} height={176} fill="#bfe6ff" opacity={0.9} />
			<text x={-100} y={-146} fontSize={0} />
			<rect x={-330} y={-34} width={660} height={14} fill="#c98a10" />
			{[-220, 200].map((wx, i) => (
				<g key={i} transform={`translate(${wx},-12) rotate(${f * (arrive < 1 || leave > 0 ? 12 : 0)})`}>
					<circle r={44} fill="#222" />
					<circle r={20} fill="#aaa" />
					<line x1={-20} y1={0} x2={20} y2={0} stroke="#555" strokeWidth={5} />
				</g>
			))}
		</g>
	);
};

/* sidewalk bakery smell, sky etc: tiny wavy scent lines */
export const Scent: React.FC<W> = ({f, t0, t1, x = 960, y = 600, s = 1}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
			{[-30, 0, 30].map((dx, i) => (
				<path key={i} d={`M${dx},0 q-16,-30 0,-60 q16,-30 0,-60`} stroke="#ffd79a" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} transform={`translate(0,${-((f / 2 + i * 14) % 40)})`} />
			))}
		</g>
	);
};

/* simple props */
export const Pillow: React.FC<W> = ({f, t0, t1, x = 1500, y = 760, s = 1}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${s * pop(f, t0)})`} opacity={k}>
			<rect x={-110} y={-80} width={220} height={150} rx={50} fill="#f4a0c4" stroke="#d96a98" strokeWidth={5} />
			<circle cx={-70} cy={-40} r={6} fill="#d96a98" />
		</g>
	);
};

export const Glassy: React.FC<W & {fly: [number, number]}> = ({f, t0, t1, s = 1, fly}) => {
	const u = interpolate(f, [t0, t0 + 24], [0, 1], cl);
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const x = fly[0] + (1 - Math.min(1, u)) * -500;
	const y = fly[1] - Math.sin(u * Math.PI) * 120;
	const bounce = u >= 1 ? (f - t0 - 24) / 18 : 0;
	return (
		<g transform={`translate(${u >= 1 ? fly[0] - bounce * 220 : x},${u >= 1 ? fly[1] + Math.sin(Math.min(1, bounce) * Math.PI) * 30 : y}) rotate(${u * 420}) scale(${s})`} opacity={k}>
			<path d="M-18,-26 L18,-26 L12,24 L-12,24 Z" fill="#bfe6ff" stroke="#fff" strokeWidth={3} opacity={0.8} />
		</g>
	);
};

export const Banner: React.FC<W & {text: string; c?: string; size?: number}> = ({f, t0, t1, x = 960, y = 960, text, c = LIME, size = 70}) => {
	const k = vis(f, t0, t1);
	if (k <= 0) return null;
	const words = text.split(' ');
	return (
		<g opacity={k} transform={`translate(${x},${y})`}>
			{words.map((w, i) => {
				const p = pop(f, t0 + i * 5);
				const off = words.slice(0, i).reduce((a, b) => a + b.length + 1, 0) * size * 0.58 - (text.length * size * 0.58) / 2;
				return (
					<text key={i} x={off} y={0} fontSize={size} fontFamily={FONT} fontWeight={900} fill={c} stroke="#0b0f08" strokeWidth={10} paintOrder="stroke" opacity={Math.min(1, p * 1.5)} transform={`translate(0,${(1 - p) * 30})`}>
						{w}
					</text>
				);
			})}
		</g>
	);
};
