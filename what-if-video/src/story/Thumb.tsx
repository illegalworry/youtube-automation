import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Actor} from '../kit/core';
import {gesture, idle} from '../kit/actions';
import {Stage, camOn, Layer, Svg} from '../kit/kit';
import {GOLD, LIME} from './gfx';

/* Thumbnail in the genre of the channel's competitors: one punchy hook (not the title),
   a huge sly hero face, saturated background, props about the topic. */
const Dice: React.FC<{x: number; y: number; r: number; s?: number; pips: number[][]}> = ({x, y, r, s = 1, pips}) => (
	<g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
		<rect x={-70} y={-70} width={140} height={140} rx={26} fill="#000" opacity={0.3} transform="translate(8,12)" />
		<rect x={-70} y={-70} width={140} height={140} rx={26} fill="#fff" stroke="#0b0b14" strokeWidth={7} />
		{pips.map((p, i) => (
			<circle key={i} cx={p[0] * 36} cy={p[1] * 36} r={12} fill="#d93a3a" />
		))}
	</g>
);
const Clover: React.FC<{x: number; y: number; r: number; s?: number}> = ({x, y, r, s = 1}) => (
	<g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
		{[0, 90, 180, 270].map((a) => (
			<path key={a} transform={`rotate(${a})`} d="M0,0 C-50,-20 -50,-80 0,-60 C50,-80 50,-20 0,0 Z" fill="#3ddc6a" stroke="#0b3a18" strokeWidth={6} />
		))}
		<path d="M0,0 Q10,70 40,110" stroke="#0b3a18" strokeWidth={9} fill="none" strokeLinecap="round" />
	</g>
);
const Coin: React.FC<{x: number; y: number; r: number; s?: number}> = ({x, y, r, s = 1}) => (
	<g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
		<circle r={62} fill="#000" opacity={0.3} transform="translate(6,10)" />
		<circle r={60} fill={GOLD} stroke="#0b0b14" strokeWidth={7} />
		<circle r={44} fill="none" stroke="#c9961a" strokeWidth={5} />
		<text y={20} textAnchor="middle" fontSize={58} fontFamily="'Rubik',sans-serif" fontWeight={900} fill="#9a6b0c">$</text>
	</g>
);

export const Thumb: React.FC = () => {
	const pose = gesture('presentF', idle(0, 3), 1, 0);
	return (
		<AbsoluteFill>
			<Stage cam={camOn(960, 540, 1, {farBlur: 0})} still grain={0.05} vig={0.4} light={{x: 80, y: 30, o: 0.35}}>
				<Layer depth={1}>
					<Svg>
						<defs>
							<radialGradient id="tbg" cx="0.68" cy="0.45" r="0.85">
								<stop offset="0" stopColor="#ffb13a" />
								<stop offset="0.35" stopColor="#d6337a" />
								<stop offset="0.75" stopColor="#3a1a8a" />
								<stop offset="1" stopColor="#120a3a" />
							</radialGradient>
						</defs>
						<rect x={-50} y={-50} width={2020} height={1180} fill="url(#tbg)" />
						{Array.from({length: 14}).map((_, i) => (
							<polygon key={i} points={`1280,520 ${1280 + Math.cos((i / 14) * 6.283) * 1800},${520 + Math.sin((i / 14) * 6.283) * 1800} ${1280 + Math.cos(((i + 0.5) / 14) * 6.283) * 1800},${520 + Math.sin(((i + 0.5) / 14) * 6.283) * 1800}`} fill="#fff3b0" opacity={0.09} />
						))}
						{Array.from({length: 40}).map((_, i) => (
							<path key={i} d="M0,-16 L5,-5 L16,0 L5,5 L0,16 L-5,5 L-16,0 L-5,-5 Z" transform={`translate(${random('x' + i) * 1920},${random('y' + i) * 1080}) scale(${0.4 + random('s' + i) * 1.1})`} fill="#fff6c8" opacity={0.35 + random('o' + i) * 0.55} />
						))}
						{/* jackpot panel */}
						<g transform="translate(1640,200) rotate(7) scale(0.85)">
							<rect x={-190} y={-100} width={380} height={200} rx={26} fill="#16122e" stroke="#ffd34a" strokeWidth={9} />
							{[-110, 0, 110].map((dx) => (
								<g key={dx}>
									<rect x={dx - 48} y={-62} width={96} height={124} rx={14} fill="#fff" />
									<text x={dx} y={36} textAnchor="middle" fontSize={110} fontFamily="'Rubik',sans-serif" fontWeight={900} fill="#d93a3a">7</text>
								</g>
							))}
						</g>
						<Dice x={870} y={880} r={-14} s={1.25} pips={[[-1, -1], [0, 0], [1, 1]]} />
						<Dice x={1010} y={960} r={18} s={0.95} pips={[[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]]} />
						<Clover x={1860} y={900} r={12} s={1.3} />
						<Coin x={1180} y={140} r={-18} s={1.0} />
						<Coin x={1730} y={620} r={14} s={0.9} />
						<Coin x={740} y={600} r={8} s={0.75} />
						<Actor who="hero" x={1420} floor={1450} s={3.25} facing={-1} faceTurn={0.25} look={[-0.7, -0.15]} expr="normal" mouth="smirk" pose={pose} shadow={false} uid="thumb" />
					</Svg>
				</Layer>
			</Stage>
			<AbsoluteFill style={{padding: '60px 0 0 70px', fontFamily: "'Rubik', sans-serif", fontWeight: 900, textTransform: 'uppercase', transform: 'rotate(-3deg)', transformOrigin: '0 0'}}>
				<div style={{fontSize: 210, lineHeight: 0.9, color: '#fff', WebkitTextStroke: '14px #0b0b14', paintOrder: 'stroke fill', textShadow: '0 12px 0 #0b0b14'}}>PERFECT</div>
				<div style={{fontSize: 285, lineHeight: 0.95, color: GOLD, WebkitTextStroke: '16px #0b0b14', paintOrder: 'stroke fill', textShadow: '0 14px 0 #0b0b14'}}>LUCK?</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 80, bottom: 70, fontFamily: "'Rubik', sans-serif", fontWeight: 900, fontSize: 84, color: '#0b0b14', background: LIME, padding: '6px 34px', borderRadius: 18, transform: 'rotate(-3deg)', boxShadow: '0 8px 0 #0b0b14'}}>DAY 1 → DAY 9</div>
		</AbsoluteFill>
	);
};

/* ---- variants in the competitors' genre: punchline text + big sly hero + scene from the video ---- */
import {Backdrop} from './places';
import {Chips, Roulette, Burst as Sparks} from './gfx';

const Punch: React.FC<{a: string; b: string; sa?: number; sb?: number}> = ({a, b, sa = 200, sb = 250}) => (
	<AbsoluteFill style={{padding: '55px 0 0 65px', fontFamily: "'Rubik', sans-serif", fontWeight: 900, textTransform: 'uppercase', transform: 'skewX(-7deg) rotate(-2deg)', transformOrigin: '0 0'}}>
		<div style={{fontSize: sa, lineHeight: 0.92, color: '#fff', WebkitTextStroke: '15px #0b0b14', paintOrder: 'stroke fill', textShadow: '0 12px 0 #0b0b14', letterSpacing: -4}}>{a}</div>
		<div style={{fontSize: sb, lineHeight: 0.92, color: GOLD, WebkitTextStroke: '16px #0b0b14', paintOrder: 'stroke fill', textShadow: '0 14px 0 #0b0b14', letterSpacing: -4}}>{b}</div>
	</AbsoluteFill>
);

export const ThumbA: React.FC = () => {
	const pose = gesture('point', idle(0, 5), 1, 0);
	return (
		<AbsoluteFill>
			<Stage cam={camOn(960, 540, 1, {farBlur: 0})} still grain={0.05} vig={0.45} light={{x: 70, y: 20, o: 0.4}}>
				<Backdrop kind="casino" f={20} gf={20} />
				<Layer depth={1}>
					<Svg>
						<Roulette f={80} t0={0} t1={999} x={470} y={800} s={1.9} spinEnd={30} />
						<Chips f={80} t0={0} t1={999} x={900} y={1010} s={1.7} n={13} />
						<Sparks f={14} t0={0} x={1500} y={260} c={GOLD} r={330} n={18} />
						<Actor who="hero" x={1470} floor={1480} s={3.2} facing={-1} faceTurn={0.25} look={[-0.8, 0.1]} expr="normal" mouth="smirk" pose={pose} shadow={false} uid="thumbA" />
					</Svg>
				</Layer>
			</Stage>
			<Punch a="I ALREADY" b="WON." sa={190} sb={330} />
		</AbsoluteFill>
	);
};

export const ThumbB: React.FC = () => {
	const pose = gesture('presentF', idle(0, 7), 1, 0);
	return (
		<AbsoluteFill>
			<Stage cam={camOn(960, 540, 1, {farBlur: 0})} still grain={0.05} vig={0.4} light={{x: 60, y: 20, o: 0.4}}>
				<Layer depth={1}>
					<Svg>
						<defs>
							<radialGradient id="tbB" cx="0.7" cy="0.5" r="0.9">
								<stop offset="0" stopColor="#9a7bff" />
								<stop offset="0.4" stopColor="#4a22c4" />
								<stop offset="1" stopColor="#0c0630" />
							</radialGradient>
						</defs>
						<rect x={-50} y={-50} width={2020} height={1180} fill="url(#tbB)" />
						{Array.from({length: 16}).map((_, i) => (
							<polygon key={i} points={`1400,560 ${1400 + Math.cos((i / 16) * 6.283) * 1900},${560 + Math.sin((i / 16) * 6.283) * 1900} ${1400 + Math.cos(((i + 0.5) / 16) * 6.283) * 1900},${560 + Math.sin(((i + 0.5) / 16) * 6.283) * 1900}`} fill="#e6dcff" opacity={0.1} />
						))}
						{/* three green lights in a row */}
						{[0, 1, 2].map((i) => (
							<g key={i} transform={`translate(${780 + i * 150},${760 - i * 40})`}>
								<rect x={-36} y={-100} width={72} height={170} rx={16} fill="#14161f" stroke="#0b0b14" strokeWidth={6} />
								<circle cy={-62} r={19} fill="#3a2020" />
								<circle cy={-18} r={19} fill="#3a3a20" />
								<circle cy={26} r={20} fill="#3dff7a" />
								<circle cy={26} r={44} fill="#3dff7a" opacity={0.3} />
								<rect x={-7} y={70} width={14} height={200} fill="#14161f" />
							</g>
						))}
						<Actor who="hero" x={1500} floor={1480} s={3.2} facing={-1} faceTurn={0.25} look={[-0.7, -0.1]} expr="normal" mouth="smirk" pose={pose} shadow={false} uid="thumbB" />
						<g transform="translate(330,860) rotate(-8) scale(0.9)">
							<rect x={-170} y={-95} width={340} height={190} rx={24} fill="#16122e" stroke={GOLD} strokeWidth={9} />
							{[-105, 0, 105].map((dx) => (
								<g key={dx}>
									<rect x={dx - 45} y={-62} width={90} height={124} rx={12} fill="#fff" />
									<text x={dx} y={36} textAnchor="middle" fontSize={108} fontFamily="'Rubik',sans-serif" fontWeight={900} fill="#d93a3a">7</text>
								</g>
							))}
						</g>
					</Svg>
				</Layer>
			</Stage>
			<Punch a="TOO" b="LUCKY?" sa={200} sb={290} />
		</AbsoluteFill>
	);
};
