import React from 'react';
import {AbsoluteFill, interpolate, random, spring} from 'remotion';
import {Stickman} from '../engine/Stickman';
import {angle2D, useAngle, useShot} from '../kit/core';
import {clamp, ease} from '../kit/kit';
import {FONT, HAND} from '../kit/ui';
import {Grain, Vignette} from '../engine/camera';
import {CAST, LIME} from './cast';
import {Star} from './fx';
import {idle} from '../kit/actions';

/* Full-frame motion-graphics cards. The channel look: dark green radial background, lime accents. */
export const Card: React.FC<{children: React.ReactNode; tint?: string; grid?: boolean}> = ({children, tint = '#24420f', grid = true}) => {
	const {gf} = useShot();
	const ang = useAngle();
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${tint} 0%, #12220a 60%, #070c05 100%)`}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: angle2D(ang, gf), transformOrigin: '50% 45%'}}>
				{grid
					? Array.from({length: 26}).map((_, i) => (
							<g key={i} opacity={0.05}>
								<line x1={0} y1={i * 46} x2={1920} y2={i * 46} stroke="#fff" />
								<line x1={i * 76} y1={0} x2={i * 76} y2={1080} stroke="#fff" />
							</g>
						))
					: null}
				{Array.from({length: 14}).map((_, i) => (
					<Star key={'s' + i} x={(random('cs' + i) * 1920 + gf * 0.3 * (i % 3)) % 1920} y={(random('cy' + i) * 1080 - gf * 0.4 + 3000) % 1080} r={4 + (i % 4) * 2} o={0.15 + 0.15 * Math.sin(gf / 15 + i)} />
				))}
				{children}
			</svg>
			<Vignette strength={0.5} />
			<Grain opacity={0.08} />
		</AbsoluteFill>
	);
};

const sp = (t: number, d = 12, s = 170) => spring({frame: t, fps: 30, config: {damping: d, stiffness: s}});
const T: React.FC<{x: number; y: number; t: number; size?: number; c?: string; children: React.ReactNode; anchor?: 'middle' | 'start' | 'end'; w?: number; hand?: boolean}> = ({x, y, t, size = 60, c = '#fff', children, anchor = 'middle', w = 900, hand}) => {
	if (t < 0) return null;
	const k = sp(t);
	return (
		<g transform={`translate(${x},${y + (1 - k) * 40})`} opacity={Math.min(1, k * 1.6)}>
			<text textAnchor={anchor} fontSize={size} fontFamily={hand ? HAND : FONT} fontWeight={hand ? 700 : 900} fill={c} style={{paintOrder: 'stroke'}} stroke="#0b0d1e" strokeWidth={hand ? 0 : size * 0.06}>
				{children}
			</text>
		</g>
	);
};
export const Fig: React.FC<{who: string; x: number; y: number; s?: number; t: number; expr?: any; mouth?: any; pose?: any; look?: [number, number]; facing?: 1 | -1}> = ({who, x, y, s = 1, t, expr, mouth, pose, look = [0, 0], facing = 1}) => (
	<Stickman id={'fig' + who + x} x={x} y={y} scale={s} pose={pose ?? idle(t, x)} {...CAST[who]} expr={expr ?? 'normal'} mouth={mouth ?? CAST[who].mouth} look={look} faceTurn={0.2} facing={facing} />
);

/* title: WHAT IF YOU COULD TELEPORT? with the hero and a burst */
export const TitleCard: React.FC<{t: number}> = ({t}) => {
	const k = sp(t, 9, 160);
	const w = ['WHAT', 'IF', 'YOU', 'COULD'];
	return (
		<Card>
			<g transform={`translate(960,560) scale(${1 + t * 0.002})`}>
				<circle r={360 * k} fill={LIME} opacity={0.12} />
				<circle r={260 * k} fill="none" stroke={LIME} strokeWidth={6} opacity={0.4} strokeDasharray="20 18" transform={`rotate(${t * 0.6})`} />
			</g>
			{w.map((s, i) => (
				<T key={i} x={[470, 760, 1040, 1400][i]} y={260} t={t - i * 4} size={110}>
					{s}
				</T>
			))}
			<g transform={`translate(960,${880}) scale(${sp(t - 18, 7, 200)})`}>
				<text textAnchor="middle" fontSize={230} fontFamily={FONT} fontWeight={900} fill={LIME} stroke="#0b0d1e" strokeWidth={14} style={{paintOrder: 'stroke'}} transform={`rotate(${-3 + Math.sin(t / 10)})`}>
					TELEPORT?
				</text>
			</g>
			<g transform={`translate(0,${(1 - k) * 300})`}>
				<Fig who="hero" x={960} y={560} s={1.25} t={t} look={[0.2, -0.3]} pose={{...idle(t, 1), armF: [150, 30], armB: [-30, 20]}} />
			</g>
		</Card>
	);
};

/* teaser: three time stamps with icons */
export const TeaserCards: React.FC<{t: number; ts: [number, number, number, number]}> = ({t, ts}) => {
	const items: [string, string, string][] = [
		['1 WEEK', 'breakfast in Paris', '#5fb4f0'],
		['3 WEEKS', 'an agent knows your name', '#9aa3b5'],
		['40 DAYS', 'one jump. the whole world.', LIME],
	];
	return (
		<Card>
			{items.map(([a, b, c], i) => {
				const tt = t - ts[i];
				if (tt < 0) return null;
				const k = sp(tt, 11, 160);
				const x = 360 + i * 600;
				return (
					<g key={i} transform={`translate(${x},${520 + (1 - k) * 500}) rotate(${(i - 1) * 4 + (1 - k) * 20})`}>
						<rect x={-260} y={-300} width={520} height={600} rx={30} fill="#0e1a08" stroke={c} strokeWidth={8} />
						<text y={-180} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill={c}>
							{a}
						</text>
						<text y={230} textAnchor="middle" fontSize={40} fontFamily={HAND} fontWeight={700} fill="#fff">
							{b}
						</text>
						<g transform="translate(0,40)">
							{i === 0 ? (
								<>
									<path d="M-70,90 Q-26,-10 -10,-150 L0,-190 L10,-150 Q26,-10 70,90 L40,90 Q10,30 0,26 Q-10,30 -40,90 Z" fill="#cfe6ff" />
									<rect x={-35} y={-40} width={70} height={8} fill="#cfe6ff" />
								</>
							) : i === 1 ? (
								<>
									<circle cy={-40} r={70} fill="#2b2f3a" />
									<rect x={-80} y={20} width={160} height={90} rx={20} fill="#5d6472" />
									<rect x={-60} y={-60} width={120} height={26} rx={10} fill="#0b0d1e" />
								</>
							) : (
								<>
									<circle r={110} fill="none" stroke={LIME} strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(tt / 4)} />
									<Star x={0} y={0} r={70} />
								</>
							)}
						</g>
					</g>
				);
			})}
			{t > ts[3] ? <T x={960} y={1010} t={t - ts[3]} size={64} c="#ff6a5a">A JUMP YOU CAN NEVER TAKE BACK</T> : null}
		</Card>
	);
};

/* rule card in the channel colours */
export const Rule: React.FC<{t: number; n: number; text: string; sub?: string; tSub?: number; icon?: React.ReactNode; strike?: number}> = ({t, n, text, sub, tSub = 999, icon, strike = 0}) => {
	const k = sp(t, 12, 150);
	const write = interpolate(t, [8, 8 + text.length * 0.45], [0, 1], clamp);
	return (
		<Card>
			<g transform={`translate(960,${540 + (1 - k) * 700}) rotate(${(1 - k) * -10})`}>
				<rect x={-760} y={-400} width={1520} height={800} rx={30} fill="#1f3a16" stroke="#6b4a2a" strokeWidth={26} />
				{Array.from({length: 20}).map((_, i) => (
					<circle key={i} cx={(i * 397) % 1400 - 700} cy={(i * 211) % 700 - 350} r={60 + (i % 5) * 20} fill="#fff" opacity={0.012} />
				))}
				<g transform={`translate(0,-250) scale(${sp(t - 4, 7, 200)})`}>
					<rect x={-190} y={-62} width={380} height={110} rx={55} fill={LIME} />
					<text y={28} textAnchor="middle" fontSize={78} fontFamily={FONT} fontWeight={900} fill="#11140b">
						RULE {n}
					</text>
				</g>
				{icon ? <g transform={`translate(0,-20) scale(${sp(t - 8)})`}>{icon}</g> : null}
				<clipPath id={'rw' + n}>
					<rect x={-760} y={120} width={1520 * write} height={200} />
				</clipPath>
				<text y={200} textAnchor="middle" fontSize={text.length > 40 ? 52 : 64} fontFamily={HAND} fontWeight={700} fill="#f4f1e6" clipPath={`url(#rw${n})`}>
					{text}
				</text>
				{strike > 0 ? <line x1={-520} y1={186} x2={-520 + 1040 * strike} y2={186} stroke="#ff6a5a" strokeWidth={10} strokeLinecap="round" /> : null}
				{sub && t > tSub ? (
					<text y={300} textAnchor="middle" fontSize={48} fontFamily={HAND} fontWeight={700} fill={LIME} opacity={sp(t - tSub)}>
						{sub}
					</text>
				) : null}
			</g>
		</Card>
	);
};

/* spinning Earth with speed at the equator */
export const Globe: React.FC<{t: number; ts: {speed: number; sound: number; diff: number; jump: number}}> = ({t, ts}) => {
	const rot = t * 2.2;
	const k = sp(t, 14, 120);
	const n = Math.round(interpolate(t, [ts.speed, ts.speed + 40], [0, 1670], {...clamp, easing: ease}));
	return (
		<Card tint="#0f2a3a">
			<g transform={`translate(${t > ts.diff ? 760 : 960},560) scale(${k})`}>
				<circle r={330} fill="#2a6fd0" />
				<clipPath id="globe">
					<circle r={330} />
				</clipPath>
				<g clipPath="url(#globe)">
					{Array.from({length: 6}).map((_, i) => {
						const x = ((rot * 3 + i * 260) % 1560) - 780;
						return (
							<g key={i} transform={`translate(${x},${(i % 3) * 120 - 140})`}>
								<path d="M-90,-60 q60,-50 140,-10 q40,40 0,100 q-60,40 -120,10 q-50,-40 -20,-100 z" fill="#5fbf5a" />
							</g>
						);
					})}
					<ellipse rx={330} ry={18} fill="none" stroke="#ffe08a" strokeWidth={5} strokeDasharray="14 10" />
					<circle r={330} fill="url(#gshade)" />
				</g>
				<defs>
					<radialGradient id="gshade" cx="0.35" cy="0.3">
						<stop offset="0" stopColor="#fff" stopOpacity={0.25} />
						<stop offset="0.7" stopColor="#000" stopOpacity={0} />
						<stop offset="1" stopColor="#000" stopOpacity={0.45} />
					</radialGradient>
				</defs>
				<path d={`M-420,-40 A440,440 0 0,1 -60,-430`} fill="none" stroke={LIME} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
				<path d="M-80,-450 l40,22 l-46,20 z" fill={LIME} />
				{t > ts.diff
					? [-220, -110, 0, 110, 220].map((y, i) => {
							const w = Math.sqrt(330 * 330 - y * y) / 330;
							const kk = sp(t - ts.diff - i * 4);
							return (
								<g key={i} opacity={kk}>
									<line x1={w * 330 + 20} y1={y} x2={w * 330 + 20 + 180 * w * kk} y2={y} stroke={LIME} strokeWidth={8} strokeLinecap="round" />
									<path d={`M${w * 330 + 20 + 180 * w * kk},${y - 12} l22,12 l-22,12 z`} fill={LIME} />
								</g>
							);
						})
					: null}
			</g>
			<T x={960} y={140} t={t - 4} size={70}>THE EARTH SPINS</T>
			{t > ts.speed ? (
				<g>
					<T x={t > ts.diff ? 1500 : 1500} y={520} t={t - ts.speed} size={130} c={LIME}>{`${n.toLocaleString('en-US')}`}</T>
					<T x={1500} y={600} t={t - ts.speed - 6} size={50}>km/h at the equator</T>
				</g>
			) : null}
			{t > ts.sound && t < ts.diff ? <T x={1500} y={720} t={t - ts.sound} size={46} c="#ffb070">faster than sound (1,235 km/h)</T> : null}
			{t > ts.diff ? <T x={1500} y={760} t={t - ts.diff} size={44} hand>every spot: its own speed & direction</T> : null}
		</Card>
	);
};

/* speed bars: 80 km = shove, Paris = race car */
export const SpeedBars: React.FC<{t: number; t2: number}> = ({t, t2}) => {
	const a = sp(t);
	const b = sp(t - t2);
	const bar = (y: number, w: number, k: number, label: string, val: string, c: string) => (
		<g transform={`translate(260,${y})`} opacity={Math.min(1, k * 2)}>
			<text x={0} y={-30} fontSize={52} fontFamily={FONT} fontWeight={900} fill="#fff">
				{label}
			</text>
			<rect x={0} y={0} width={1400} height={80} rx={40} fill="#0e1a08" />
			<rect x={0} y={0} width={w * k} height={80} rx={40} fill={c} />
			<text x={w * k + 30} y={58} fontSize={58} fontFamily={FONT} fontWeight={900} fill={c}>
				{val}
			</text>
		</g>
	);
	return (
		<Card>
			<T x={960} y={160} t={t} size={64}>YOU KEEP THE SPEED OF WHERE YOU LEFT</T>
			{bar(420, 260, a, '80 km jump', 'a shove', '#ffd34a')}
			{t > t2 ? bar(720, 1000, b, 'Bedroom → Paris', '≈250 km/h', '#ff5a4a') : null}
			{t > t2 + 20 ? (
				<g transform={`translate(${1500 - (t - t2) * 3},940) scale(0.9)`}>
					<path d="M-160,0 L-120,-50 L60,-60 L140,-20 L170,0 Z" fill="#e23b3b" />
					<circle cx={-100} cy={4} r={26} fill="#16171d" />
					<circle cx={110} cy={4} r={26} fill="#16171d" />
					{[0, 1, 2].map((i) => (
						<line key={i} x1={190 + i * 10} y1={-40 + i * 18} x2={300 + i * 30} y2={-40 + i * 18} stroke="#fff" strokeWidth={5} opacity={0.6} />
					))}
				</g>
			) : null}
		</Card>
	);
};

/* napkin math: 1000 km / 50 = 20 hops; x 2 s = 40 s */
export const Napkin: React.FC<{t: number; ts: [number, number, number]}> = ({t, ts}) => {
	const k = sp(t, 14, 120);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #8a5a34 0%, #5a3a1e 70%, #2a1a0a 100%)'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: `scale(${1.02 + t * 0.0008}) rotate(${Math.sin(t / 60)}deg)`}}>
				<g transform={`translate(960,${540 + (1 - k) * 600}) rotate(${-4 + (1 - k) * 20})`}>
					<rect x={-620} y={-400} width={1240} height={800} fill="#000" opacity={0.3} transform="translate(20,24)" style={{filter: 'blur(12px)'}} />
					<path d="M-620,-400 L620,-400 L620,400 L-620,400 Z" fill="#fbfaf2" />
					{Array.from({length: 12}).map((_, i) => (
						<circle key={i} cx={-620 + i * 113} cy={-400} r={18} fill="#fbfaf2" />
					))}
					<circle cx={400} cy={240} r={60} fill="#e8743a" opacity={0.18} />
					<text x={-520} y={-250} fontSize={84} fontFamily={HAND} fontWeight={700} fill="#2b3a8a">
						{'Paris ≈ 1000 km'.slice(0, Math.max(0, Math.floor((t - ts[0]) * 1)))}
					</text>
					<text x={-520} y={-80} fontSize={84} fontFamily={HAND} fontWeight={700} fill="#2b3a8a">
						{'÷ 50 km = 20 hops'.slice(0, Math.max(0, Math.floor((t - ts[1]) * 1)))}
					</text>
					<text x={-520} y={90} fontSize={84} fontFamily={HAND} fontWeight={700} fill="#2b3a8a">
						{'× 2 sec = 40 sec!'.slice(0, Math.max(0, Math.floor((t - ts[2]) * 1)))}
					</text>
					{t > ts[2] + 25 ? <ellipse cx={180} cy={62} rx={200} ry={70} fill="none" stroke="#d94a3a" strokeWidth={8} transform="rotate(-4 180 62)" strokeDasharray={1400} strokeDashoffset={1400 * (1 - interpolate(t, [ts[2] + 25, ts[2] + 40], [0, 1], clamp))} /> : null}
					{Array.from({length: 20}).map((_, i) => {
						const kk = interpolate(t, [ts[1] + 10 + i * 2, ts[1] + 14 + i * 2], [0, 1], clamp);
						return <path key={i} d={`M${-520 + i * 52},300 q26,-50 52,0`} stroke="#5aa828" strokeWidth={6} fill="none" opacity={kk} />;
					})}
				</g>
			</svg>
			<Vignette strength={0.5} />
		</AbsoluteFill>
	);
};

/* commute: 1 h a day = 10 days a year, you: 0 */
export const Commute: React.FC<{t: number; ts: [number, number, number]}> = ({t, ts}) => {
	const days = Math.round(interpolate(t, [ts[1], ts[1] + 40], [0, 10], clamp));
	return (
		<Card tint="#3a2a10">
			<T x={960} y={170} t={t} size={66}>MOST PEOPLE: ~1 HOUR A DAY COMMUTING</T>
			{Array.from({length: 10}).map((_, i) => {
				const k = interpolate(t, [ts[1] + i * 4, ts[1] + i * 4 + 10], [0, 1], clamp);
				return (
					<g key={i} transform={`translate(${330 + i * 140},${520}) scale(${k})`} opacity={k}>
						<rect x={-56} y={-70} width={112} height={130} rx={12} fill="#fbfaf4" />
						<rect x={-56} y={-70} width={112} height={34} rx={12} fill="#e23b3b" />
						<text y={40} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#2b2f3a">
							{i + 1}
						</text>
					</g>
				);
			})}
			{t > ts[1] ? <T x={960} y={720} t={t - ts[1]} size={92} c="#ffd34a">{`= ${days} FULL DAYS A YEAR`}</T> : null}
			{t > ts[1] + 30 ? <T x={960} y={820} t={t - ts[1] - 30} size={44} hand>staring at someone else&apos;s car</T> : null}
			{t > ts[2] ? (
				<g transform={`translate(960,960) scale(${sp(t - ts[2], 7, 220)})`}>
					<rect x={-260} y={-70} width={520} height={110} rx={55} fill={LIME} />
					<text y={18} textAnchor="middle" fontSize={70} fontFamily={FONT} fontWeight={900} fill="#11140b">
						YOU: 0
					</text>
				</g>
			) : null}
		</Card>
	);
};

/* quantum teleportation 2017: ground station -> satellite, photon state beam */
export const Quantum: React.FC<{t: number; ts: [number, number, number]}> = ({t, ts}) => {
	const beam = interpolate(t, [ts[0], ts[0] + 50], [0, 1], {...clamp, easing: ease});
	return (
		<Card tint="#101a3a">
			<T x={960} y={130} t={t} size={60}>2017 · QUANTUM TELEPORTATION</T>
			{/* earth curve */}
			<path d="M-100,1150 Q960,780 2020,1150 Z" fill="#2a6fd0" />
			<path d="M-100,1150 Q960,800 2020,1150" fill="none" stroke="#7fd0ff" strokeWidth={6} opacity={0.6} />
			{/* station */}
			<g transform="translate(560,900)">
				<rect x={-40} y={-30} width={80} height={60} fill="#cfd6e6" />
				<path d="M-60,-30 q60,-90 120,0 z" fill="#e8ecf4" />
				<line x1={0} y1={-60} x2={20} y2={-110} stroke="#e8ecf4" strokeWidth={6} />
			</g>
			{/* satellite */}
			<g transform={`translate(1420,${330 + Math.sin(t / 20) * 10}) rotate(-12)`}>
				<rect x={-50} y={-40} width={100} height={80} rx={8} fill="#e8c86a" />
				<rect x={-210} y={-26} width={150} height={52} fill="#2b4a9a" stroke="#9fb4ff" strokeWidth={3} />
				<rect x={60} y={-26} width={150} height={52} fill="#2b4a9a" stroke="#9fb4ff" strokeWidth={3} />
			</g>
			<line x1={580} y1={800} x2={580 + 820 * beam} y2={800 - 450 * beam} stroke={LIME} strokeWidth={4} strokeDasharray="12 10" />
			{beam > 0 && beam < 1 ? <Star x={580 + 820 * beam} y={800 - 450 * beam} r={30} rot={t * 10} /> : null}
			{beam >= 1 ? <circle cx={1420} cy={340} r={40 + 30 * Math.sin(t / 5)} fill={LIME} opacity={0.3} /> : null}
			{t > ts[0] + 20 ? <T x={1060} y={520} t={t - ts[0] - 20} size={54} c={LIME}>1,000+ km</T> : null}
			{t > ts[1] ? (
				<g>
					<T x={420} y={400} t={t - ts[1]} size={46} c="#ff8a8a">✕ a person</T>
					<T x={420} y={470} t={t - ts[1] - 10} size={46} c="#ff8a8a">✕ a particle</T>
					<T x={420} y={540} t={t - ts[1] - 22} size={46} c={LIME}>✓ its information</T>
				</g>
			) : null}
			{t > ts[2] ? <text x={1880} y={1050} textAnchor="end" fontSize={24} fontFamily={FONT} fill="#aab3d6">Ren et al., Nature (2017) · Micius satellite</text> : null}
		</Card>
	);
};

/* photon vs pizza split */
export const PhotonPizza: React.FC<{t: number; t2: number}> = ({t, t2}) => {
	const a = sp(t, 14, 150);
	const b = sp(t - t2, 14, 150);
	return (
		<AbsoluteFill style={{background: '#0c120a'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: `scale(${1 + t * 0.0012})`}}>
				<g transform={`translate(${-(1 - a) * 1000},0)`}>
					<polygon points="0,0 1010,0 910,1080 0,1080" fill="#101a3a" />
					<text x={470} y={180} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#fff">
						SCIENTISTS
					</text>
					<Star x={470} y={540} r={60 + 6 * Math.sin(t / 4)} c="#9fd8ff" rot={t * 3} />
					<text x={470} y={940} textAnchor="middle" fontSize={110} fontFamily={FONT} fontWeight={900} fill="#9fd8ff">
						1 photon
					</text>
				</g>
				{t > t2 ? (
					<g transform={`translate(${(1 - b) * 1000},0)`}>
						<polygon points="1010,0 1920,0 1920,1080 910,1080" fill="#24420f" />
						<text x={1440} y={180} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#fff">
							YOU
						</text>
						<g transform={`translate(1440,540) rotate(${t * 1.5})`}>
							<circle r={230} fill="#e8a84a" />
							<circle r={200} fill="#e8743a" />
							{Array.from({length: 9}).map((_, i) => (
								<circle key={i} cx={Math.cos(i * 0.7) * (60 + (i % 3) * 50)} cy={Math.sin(i * 0.7) * (60 + (i % 3) * 50)} r={30} fill="#c42b2b" />
							))}
							{[0, 1, 2, 3].map((i) => (
								<line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 4) * 230} y2={Math.sin((i * Math.PI) / 4) * 230} stroke="#e8a84a" strokeWidth={6} />
							))}
						</g>
						<text x={1440} y={940} textAnchor="middle" fontSize={90} fontFamily={FONT} fontWeight={900} fill={LIME}>
							1 pepperoni pizza
						</text>
					</g>
				) : null}
				{t > t2 ? <line x1={1010} y1={0} x2={910} y2={1080} stroke="#fff" strokeWidth={8} /> : null}
			</svg>
			<Grain opacity={0.1} />
		</AbsoluteFill>
	);
};

/* phone with the viral clip: views roll, red circles, arrows, comments */
export const Viral: React.FC<{t: number; ts: {views: number; circle: number; arrow: number; fake: number; who: number}}> = ({t, ts}) => {
	const k = sp(t, 14, 130);
	const views = interpolate(t, [ts.views, ts.views + 60], [0, 14_000_000], {...clamp, easing: ease});
	const fmt = views >= 1e6 ? (views / 1e6).toFixed(1) + 'M' : Math.round(views / 1000) + 'K';
	const slow = Math.floor(t / 2) % 2;
	return (
		<Card tint="#3a1010">
			<g transform={`translate(960,${560 + (1 - k) * 600}) rotate(${(1 - k) * 12 - 2})`}>
				<rect x={-460} y={-420} width={920} height={860} rx={60} fill="#15171f" />
				<rect x={-430} y={-390} width={860} height={500} rx={20} fill="#6a8ab8" />
				<clipPath id="vclip">
					<rect x={-430} y={-390} width={860} height={500} rx={20} />
				</clipPath>
				<g clipPath="url(#vclip)">
					<rect x={-430} y={-390} width={860} height={300} fill="#8fc0e8" />
					<path d="M-430,-30 L430,-30 L430,110 L-430,110 Z" fill="#c8b48a" />
					{Array.from({length: 18}).map((_, i) => (
						<rect key={i} x={-430 + i * 50} y={-90} width={18} height={60} rx={6} fill="#e2d2b0" />
					))}
					<Stickman id="vg1" x={-200} y={-90} scale={0.62} pose={{lean: 2, head: 0, armB: [-10, 20], armF: [100, 60], legB: [-3, 0], legF: [4, 0]}} {...CAST.girlpro} look={[0.4, 0]} faceTurn={0.5} />
					<Stickman id="vg2" x={-40} y={-80} scale={0.62} pose={{lean: 10, head: 0, armB: [40, 60], armF: [70, 30], legB: [80, 90], legF: [-4, 0]}} {...CAST.boyfriend} facing={-1} look={[-0.4, 0]} faceTurn={0.5} />
					<g opacity={interpolate(t, [0, 6], [0, 1], clamp)}>
						<Stickman id="vh" x={240} y={-90} scale={0.62} pose={idle(t, 3)} {...CAST.hero} look={[-0.3, 0]} faceTurn={0.4} facing={-1} />
						<circle cx={240} cy={-120} r={60 + 6 * slow} fill={LIME} opacity={0.25} />
					</g>
					{t > ts.circle ? <ellipse cx={240} cy={-140} rx={110} ry={150} fill="none" stroke="#ff2b2b" strokeWidth={10} strokeDasharray={900} strokeDashoffset={900 * (1 - interpolate(t, [ts.circle, ts.circle + 12], [0, 1], clamp))} /> : null}
					{t > ts.arrow ? (
						<g transform={`translate(${60 + Math.sin(t / 3) * 8},-300) rotate(35)`} opacity={sp(t - ts.arrow)}>
							<rect x={0} y={-12} width={120} height={24} fill="#ff2b2b" />
							<path d="M120,-36 L170,0 L120,36 Z" fill="#ff2b2b" />
						</g>
					) : null}
					<text x={-400} y={-340} fontSize={30} fontFamily={FONT} fontWeight={900} fill="#fff" opacity={0.85}>
						{slow ? '▶ 0.25x SLOW-MO' : '▶ REPLAY'}
					</text>
				</g>
				<text x={-420} y={170} fontSize={36} fontFamily={FONT} fontWeight={900} fill="#fff">
					hoodie guy appears out of thin air?!
				</text>
				<text x={-420} y={230} fontSize={44} fontFamily={FONT} fontWeight={900} fill="#ff5a4a">
					{fmt} views
				</text>
				{t > ts.fake ? <Comment x={-400} y={270} t={t - ts.fake} text="FAKE. 100% CGI" c="#ff8a8a" /> : null}
				{t > ts.fake + 8 ? <Comment x={-400} y={340} t={t - ts.fake - 8} text="obviously edited lol" c="#ff8a8a" /> : null}
				{t > ts.who ? <Comment x={20} y={270} t={t - ts.who} text="WHO IS HE??" c={LIME} /> : null}
				{t > ts.who + 8 ? <Comment x={20} y={340} t={t - ts.who - 8} text="zoom in on the hoodie" c={LIME} /> : null}
			</g>
		</Card>
	);
};
const Comment: React.FC<{x: number; y: number; t: number; text: string; c: string}> = ({x, y, t, text, c}) => {
	const k = sp(t, 12, 200);
	return (
		<g transform={`translate(${x},${y}) scale(${k})`}>
			<rect x={0} y={0} width={380} height={56} rx={28} fill="#262a36" />
			<circle cx={28} cy={28} r={18} fill={c} />
			<text x={58} y={38} fontSize={26} fontFamily={FONT} fontWeight={700} fill="#fff">
				{text}
			</text>
		</g>
	);
};

/* vaults / server rooms / borders, all unlocked */
export const Unlocked: React.FC<{t: number; ts: [number, number, number]}> = ({t, ts}) => {
	const icons = [
		(o: number) => (
			<g>
				<rect x={-110} y={-110} width={220} height={220} rx={20} fill="#9aa3b5" />
				<circle r={70} fill="#6b7280" />
				<g transform={`rotate(${o * 180})`}>
					{[0, 1, 2, 3].map((i) => (
						<rect key={i} x={-6} y={-60} width={12} height={50} fill="#d8dce6" transform={`rotate(${i * 90})`} />
					))}
				</g>
			</g>
		),
		(o: number) => (
			<g>
				{[0, 1, 2].map((i) => (
					<g key={i}>
						<rect x={-90} y={-110 + i * 75} width={180} height={65} rx={8} fill="#2b2f3a" />
						{[0, 1, 2, 3].map((j) => (
							<circle key={j} cx={-60 + j * 20} cy={-78 + i * 75} r={5} fill={(j + i + Math.floor(o * 10)) % 2 ? LIME : '#ff5a4a'} />
						))}
					</g>
				))}
			</g>
		),
		(o: number) => (
			<g>
				<rect x={-140} y={-20} width={280} height={24} fill="#d94a3a" transform={`rotate(${-70 * o} -140 -8)`} />
				<rect x={-150} y={-60} width={30} height={170} fill="#2b2f3a" />
				<rect x={120} y={-60} width={30} height={170} fill="#2b2f3a" />
				<path d="M-20,110 l20,-40 l20,40 z" fill="#fff" />
			</g>
		),
	];
	const names = ['VAULTS', 'SERVER ROOMS', 'BORDERS'];
	return (
		<Card tint="#2a2a36">
			<T x={960} y={170} t={t} size={60}>NOTHING IS LOCKED FOR YOU</T>
			{icons.map((ic, i) => {
				const tt = t - ts[i];
				if (tt < 0) return null;
				const k = sp(tt, 9, 200);
				const open = interpolate(tt, [12, 26], [0, 1], clamp);
				return (
					<g key={i} transform={`translate(${420 + i * 540},540) scale(${k})`}>
						<circle r={190} fill="#11142c" stroke={open >= 1 ? LIME : '#5d6472'} strokeWidth={8} />
						{ic(open)}
						<g transform="translate(120,-120)">
							<rect x={-36} y={-10} width={72} height={60} rx={10} fill={open >= 1 ? LIME : '#e8c86a'} />
							<path d={`M-22,-10 v-24 a22,22 0 0 1 44,0 v${open >= 1 ? -18 : 24}`} stroke={open >= 1 ? LIME : '#e8c86a'} strokeWidth={10} fill="none" />
						</g>
						<text y={280} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff">
							{names[i]}
						</text>
					</g>
				);
			})}
		</Card>
	);
};

/* question to the viewer */
export const Question: React.FC<{t: number; lines: string[]; sub?: string; tSub?: number}> = ({t, lines, sub, tSub = 30}) => (
	<Card>
		<g transform={`translate(960,520) scale(${sp(t, 8, 160)})`}>
			<text textAnchor="middle" y={180} fontSize={520} fontFamily={FONT} fontWeight={900} fill={LIME} opacity={0.12} transform={`rotate(${Math.sin(t / 12) * 6})`}>
				?
			</text>
		</g>
		{lines.map((l, i) => (
			<T key={i} x={960} y={400 + i * 120} t={t - i * 8} size={92} c={i === lines.length - 1 ? LIME : '#fff'}>
				{l}
			</T>
		))}
		{sub && t > tSub ? (
			<g transform={`translate(960,820) scale(${sp(t - tSub, 8, 200)})`}>
				<rect x={-330} y={-60} width={660} height={100} rx={50} fill="#11140b" stroke={LIME} strokeWidth={6} />
				<text y={14} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff">
					{sub}
				</text>
			</g>
		) : null}
		<Fig who="hero" x={1620} y={820} s={1} t={t} pose={{...idle(t, 2), armF: [60, 110], head: 8}} look={[-0.3, 0]} mouth="smile" />
	</Card>
);

/* route map with hop dots */
export const HopMap: React.FC<{t: number; hops: number; km: string; title: string; dots?: number; tIn?: number; label2?: string; tiny?: boolean}> = ({t, hops, km, title, tIn = 10, label2, tiny}) => {
	const A: [number, number] = [380, 760];
	const B: [number, number] = [1560, 360];
	const prog = interpolate(t, [tIn, tIn + Math.min(90, hops * 3)], [0, 1], clamp);
	const shown = Math.floor(prog * hops);
	return (
		<Card tint="#1f3a2a">
			<path d="M100,900 Q400,600 700,700 T1300,420 T1800,260 L1900,1080 L100,1080 Z" fill="#2f5a2a" opacity={0.6} />
			<path d="M1650,200 Q1820,300 1900,500 L1920,0 L1500,0 Z" fill="#2a6fd0" opacity={0.7} />
			<T x={960} y={140} t={t} size={60}>{title}</T>
			{Array.from({length: hops}).map((_, i) => {
				const a = i / hops;
				const b = (i + 1) / hops;
				const p = (u: number): [number, number] => [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u + Math.sin(u * 7) * 40];
				if (i >= shown) return null;
				return <path key={i} d={`M${p(a)[0]},${p(a)[1]} Q${(p(a)[0] + p(b)[0]) / 2},${Math.min(p(a)[1], p(b)[1]) - (tiny ? 8 : 40)} ${p(b)[0]},${p(b)[1]}`} stroke={LIME} strokeWidth={tiny ? 3 : 6} fill="none" />;
			})}
			<circle cx={A[0]} cy={A[1]} r={22} fill="#fff" />
			<text x={A[0]} y={A[1] + 70} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">
				HOME
			</text>
			<g transform={`translate(${B[0]},${B[1]}) scale(${prog >= 1 ? 1 + 0.1 * Math.sin(t / 4) : 1})`}>
				<path d="M0,-50 c-30,0 -46,24 -46,46 c0,36 46,70 46,70 c0,0 46,-34 46,-70 c0,-22 -16,-46 -46,-46 z" fill="#ff5a4a" />
				<circle cy={-6} r={16} fill="#fff" />
			</g>
			<text x={B[0]} y={B[1] + 110} textAnchor="middle" fontSize={40} fontFamily={FONT} fontWeight={900} fill="#fff">
				{label2 ?? 'GRANDMA'}
			</text>
			<g transform="translate(960,960)">
				<rect x={-330} y={-60} width={660} height={100} rx={50} fill="#11140b" stroke={LIME} strokeWidth={6} />
				<text y={14} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff">
					{`${km} · ${Math.max(0, shown)} HOPS`}
				</text>
			</g>
		</Card>
	);
};

/* breaking news screen content (local coords W x H) */
export const NewsScreen: React.FC<{t: number; W: number; H: number; mode: 'storm' | 'hero'; headline?: string}> = ({t, W, H, mode, headline}) => {
	const s = W / 1920;
	return (
		<g transform={`scale(${s})`}>
			<rect width={1920} height={1080} fill={mode === 'storm' ? '#2b333f' : '#3a4458'} />
			{mode === 'storm' ? (
				<g>
					{Array.from({length: 7}).map((_, i) => (
						<g key={i}>
							<rect x={100 + i * 260} y={500 - (i % 3) * 50} width={200} height={500} fill={['#6a5a5a', '#5a6470', '#7a6a58'][i % 3]} />
							<path d={`M${80 + i * 260},${500 - (i % 3) * 50} L${200 + i * 260},${440 - (i % 3) * 50} L${320 + i * 260},${500 - (i % 3) * 50} Z`} fill="#3a2f2f" />
						</g>
					))}
					<rect x={0} y={640 - Math.min(80, t * 0.4)} width={1920} height={600} fill="#4a5a52" />
					{Array.from({length: 40}).map((_, i) => (
						<line key={i} x1={(i * 97 + t * 8) % 1920} y1={(i * 53 + t * 40) % 1080} x2={(i * 97 + t * 8) % 1920 - 10} y2={(i * 53 + t * 40) % 1080 + 40} stroke="#b9cbe6" strokeWidth={3} />
					))}
					<g transform={`translate(${1250},${380 - Math.min(80, t * 0.4)})`}>
						<Stickman id="tvkid" x={0} y={0} scale={0.6} pose={{lean: 0, head: 0, armB: [-20, 10], armF: [160 + Math.sin(t / 3) * 20, 20], legB: [-3, 0], legF: [4, 0]}} {...CAST.kid} look={[0, -1]} faceTurn={0.1} />
						<rect x={10 + Math.sin(t / 3) * 20} y={-260} width={50} height={40} fill="#e23b3b" transform={`rotate(${Math.sin(t / 3) * 20})`} />
					</g>
				</g>
			) : (
				<g>
					<rect width={1920} height={1080} fill="#2a3448" />
					{Array.from({length: 40}).map((_, i) => (
						<line key={i} x1={(i * 97) % 1920} y1={(i * 53 + t * 30) % 1080} x2={(i * 97) % 1920 - 10} y2={(i * 53 + t * 30) % 1080 + 40} stroke="#b9cbe6" strokeWidth={3} />
					))}
					<Stickman id="tvhero" x={900} y={560} scale={1.3} pose={{lean: 6, head: 0, armB: [60, 80], armF: [70, 70], legB: [-10, 10], legF: [14, 10]}} {...CAST.hero} look={[0.3, 0]} faceTurn={0.4} mouth="flat" />
					<Stickman id="tvkid2" x={990} y={600} scale={0.7} pose={{lean: -20, head: 0, armB: [-40, 60], armF: [-60, 40], legB: [70, 60], legF: [80, 60]}} {...CAST.kid} facing={-1} look={[0, 0]} faceTurn={0.3} />
				</g>
			)}
			<rect x={0} y={820} width={1920} height={260} fill="#c41e1e" />
			<rect x={0} y={820} width={520} height={110} fill="#fff" />
			<text x={40} y={900} fontSize={70} fontFamily={FONT} fontWeight={900} fill="#c41e1e">
				{mode === 'storm' ? 'BREAKING' : 'LIVE'}
			</text>
			<text x={560} y={905} fontSize={70} fontFamily={FONT} fontWeight={900} fill="#fff">
				{headline ?? (mode === 'storm' ? 'DAM CRACKS · TOWN FLOODING' : 'WHO IS THE TELEPORTING TEEN?')}
			</text>
			<text x={-((t * 6) % 2400) + 1920} y={1030} fontSize={50} fontFamily={FONT} fontWeight={700} fill="#ffe0e0">
				{mode === 'storm' ? 'Storm warning · Helicopters grounded · Dozens trapped on rooftops · Water still rising' : '47 jumps · 23 people · two dogs · one very angry cat'}
			</text>
		</g>
	);
};
export const NewsFull: React.FC<{t: number; mode: 'storm' | 'hero'; headline?: string}> = ({t, mode, headline}) => {
	const k = sp(t, 12, 170);
	return (
		<AbsoluteFill style={{background: '#111'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: `scale(${(0.9 + 0.1 * k) * (1 + t * 0.0015)})`}}>
				<NewsScreen t={t} W={1920} H={1080} mode={mode} headline={headline} />
				{Array.from({length: 54}).map((_, i) => (
					<rect key={i} x={0} y={i * 20} width={1920} height={2} fill="#000" opacity={0.12} />
				))}
			</svg>
			<Vignette strength={0.6} />
			<Grain opacity={0.15} />
		</AbsoluteFill>
	);
};

/* rescue tally */
export const Tally: React.FC<{t: number; ts: [number, number, number, number]}> = ({t, ts}) => {
	const rows: [string, string, string][] = [
		['47', 'JUMPS', LIME],
		['23', 'PEOPLE', '#fff'],
		['2', 'DOGS', '#ffd34a'],
		['1', 'VERY ANGRY CAT', '#ff8a5a'],
	];
	return (
		<Card tint="#1a2a3a">
			{rows.map(([n, l, c], i) => {
				const tt = t - ts[i];
				if (tt < 0) return null;
				const k = sp(tt, 8, 220);
				return (
					<g key={i} transform={`translate(${560},${240 + i * 200}) scale(${k})`}>
						<text x={0} y={0} textAnchor="end" fontSize={170} fontFamily={FONT} fontWeight={900} fill={c}>
							{n}
						</text>
						<text x={40} y={-10} fontSize={90} fontFamily={FONT} fontWeight={900} fill="#fff">
							{l}
						</text>
						{i === 3 ? (
							<g transform="translate(980,-60)">
								<ellipse cx={0} cy={20} rx={70} ry={44} fill="#f08a3c" />
								<circle cx={70} cy={-20} r={40} fill="#f08a3c" />
								<path d="M44,-50 l10,-30 l16,26 M84,-54 l16,-28 l6,32" fill="#f08a3c" />
								<path d="M56,-26 l16,6 M80,-20 l16,-6" stroke="#111" strokeWidth={5} />
								<path d={`M-70,10 q-40,${-30 + Math.sin(tt / 3) * 20} -20,-70`} stroke="#f08a3c" strokeWidth={14} fill="none" strokeLinecap="round" />
							</g>
						) : null}
					</g>
				);
			})}
		</Card>
	);
};

/* newspaper with the hero's face */
export const Newspaper: React.FC<{t: number}> = ({t}) => {
	const k = sp(t, 12, 120);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #4a4030 0%, #1e1a12 80%)'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<g transform={`translate(960,540) rotate(${(1 - k) * 720 - 3}) scale(${0.2 + 0.8 * k + t * 0.001})`}>
					<rect x={-560} y={-400} width={1120} height={800} fill="#f2ecdc" />
					<text y={-300} textAnchor="middle" fontSize={70} fontFamily="Georgia, serif" fontWeight={900} fill="#1b1b1b">
						THE DAILY HERALD
					</text>
					<line x1={-520} y1={-270} x2={520} y2={-270} stroke="#1b1b1b" strokeWidth={4} />
					<text y={-180} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#1b1b1b">
						TELEPORTING TEEN
					</text>
					<text y={-100} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={800} fill="#1b1b1b">
						SAVES 23 IN FLOOD
					</text>
					<rect x={-500} y={-50} width={460} height={400} fill="#c8c0ac" />
					<Stickman id="np" x={-270} y={260} scale={1.2} pose={{lean: 0, head: 0, armB: [-8, 10], armF: [8, 10], legB: [0, 0], legF: [0, 0]}} {...CAST.hero} look={[0, 0]} faceTurn={0} mouth="flat" />
					{Array.from({length: 11}).map((_, i) => (
						<rect key={i} x={20} y={-40 + i * 36} width={460 - (i % 4) * 40} height={14} fill="#9a9384" />
					))}
				</g>
			</svg>
			<Vignette strength={0.5} />
		</AbsoluteFill>
	);
};

/* passport, zero stamps (wraps the kit IdCard look but with stamps grid) */
export const PassportPages: React.FC<{t: number; t2: number}> = ({t, t2}) => {
	const k = sp(t, 14, 120);
	const flags = ['#0055a4', '#009246', '#c60b1e', '#000', '#ffce00', '#d52b1e', '#003580', '#ff9933', '#00966e', '#ce1126', '#002395'];
	return (
		<Card tint="#2a1020">
			<T x={960} y={150} t={t} size={64}>11 COUNTRIES THIS MONTH</T>
			{flags.map((c, i) => {
				const kk = sp(t - 6 - i * 3, 9, 220);
				return (
					<g key={i} transform={`translate(${260 + i * 140},290) scale(${kk})`}>
						<rect x={-50} y={-34} width={100} height={68} rx={8} fill={c} stroke="#fff" strokeWidth={4} />
					</g>
				);
			})}
			<g transform={`translate(960,${700 + (1 - k) * 500})`}>
				<rect x={-500} y={-260} width={1000} height={520} rx={20} fill="#7a1f2b" />
				<rect x={-480} y={-240} width={470} height={480} fill="#f3ead6" />
				<rect x={10} y={-240} width={470} height={480} fill="#f3ead6" />
				{Array.from({length: 6}).map((_, i) => (
					<rect key={i} x={-450 + (i % 2) * 220 + (i > 3 ? 490 : 0)} y={-200 + Math.floor((i % 4) / 2) * 220} width={180} height={180} rx={14} fill="none" stroke="#d9c9a6" strokeWidth={4} strokeDasharray="10 8" />
				))}
				{t > t2 ? (
					<g transform={`translate(240,0) rotate(-12) scale(${1 + (1 - sp(t - t2, 9, 220)) * 1.4})`} opacity={Math.min(1, sp(t - t2) * 1.4)}>
						<rect x={-200} y={-80} width={400} height={160} rx={14} fill="none" stroke="#c42b2b" strokeWidth={10} />
						<text y={30} textAnchor="middle" fontSize={84} fontFamily={FONT} fontWeight={900} fill="#c42b2b">
							0 STAMPS
						</text>
					</g>
				) : null}
			</g>
		</Card>
	);
};
