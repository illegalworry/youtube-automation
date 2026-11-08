import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stickman} from './engine/Stickman';
import {Extra} from './kit/kit';
import {CAST} from './story/cast';
import {DateTag, tagY} from './story/places';
import {FONT} from './kit/ui';
import {Grain, Vignette} from './engine/camera';

/* 9:16 cover for the short: a crowd that all shares one red date, the hero (you) whose own
   number is unreadable, and three words. */
export const ThumbV: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #5a1426 0%, #1e0b24 55%, #07060f 100%)'}}>
		<svg viewBox="0 0 1080 1920" width={1080} height={1920}>
			{/* far crowd silhouettes */}
			{Array.from({length: 7}).map((_, i) => {
				const x = 80 + i * 155;
				const s = 0.5;
				const fl = 1130;
				return (
					<g key={'b' + i} opacity={0.75}>
						<Extra i={i} x={x} floor={fl} s={s} seed="tv" facing={i % 2 ? 1 : -1} expr="wide" />
						<DateTag x={x} y={tagY(fl, s)} s={0.55} f={60} text="SEP 9 2031" c="#ff8a8a" />
					</g>
				);
			})}
			{/* near crowd */}
			{[150, 930].map((x, i) => (
				<g key={'n' + i}>
					<Extra i={i + 9} x={x} floor={1640} s={1.05} seed="tvn" facing={i ? -1 : 1} expr="wide" />
					<DateTag x={x} y={tagY(1640, 1.05)} s={0.85} f={60} text="SEP 9 2031" c="#ff8a8a" />
				</g>
			))}
			{/* the hero */}
			<ellipse cx={540} cy={1785} rx={200} ry={30} fill="#000" opacity={0.4} style={{filter: 'blur(8px)'}} />
			<Stickman
				id="tvhero"
				x={540}
				y={1785 - 157 * 1.75}
				scale={1.75}
				pose={{lean: -4, head: -16, armB: [-12, 20], armF: [40, 120], legB: [-4, 0], legF: [4, 0]}}
				{...CAST.hero}
				expr="wide"
				mouth="open"
				look={[0, -1]}
				faceTurn={0.05}
				armOver
				handF="point"
			/>
			<g transform={`translate(540,${1785 - 321 * 1.75 - 140})`}>
				<ellipse rx={300} ry={70} fill="#ffc94a" opacity={0.25} style={{filter: 'blur(26px)'}} />
				<DateTag x={0} y={0} s={2.3} f={60} text="???" c="#ffe08a" />
			</g>
			{/* big red date */}
			<g transform="translate(540,640) rotate(-3)">
				<ellipse rx={470} ry={130} fill="#ff2a3a" opacity={0.35} style={{filter: 'blur(40px)'}} />
				<rect x={-440} y={-105} width={880} height={210} rx={46} fill="#3a0d14" stroke="#ff4a5a" strokeWidth={10} />
				<text y={44} textAnchor="middle" fontSize={124} fontFamily={FONT} fontWeight={900} fill="#fff">
					SEP 9 2031
				</text>
			</g>
		</svg>
		<div style={{position: 'absolute', left: 40, right: 40, top: 120, textAlign: 'center', fontFamily: FONT, fontWeight: 900, lineHeight: 1.02, WebkitTextStroke: '8px #0b0d1e', paintOrder: 'stroke', textShadow: '0 12px 30px rgba(0,0,0,.7)'}}>
			<div style={{fontSize: 150, color: '#fff'}}>2 BILLION</div>
			<div style={{fontSize: 100, color: '#ffc94a'}}>SAME DEATH DAY</div>
		</div>
		<Vignette strength={0.5} />
		<Grain opacity={0.08} />
	</AbsoluteFill>
);
