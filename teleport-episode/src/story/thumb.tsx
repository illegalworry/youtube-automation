import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stickman} from '../engine/Stickman';
import {CAST, LIME} from './cast';
import {Star} from './fx';
import {Eiffel} from './places';
import {FONT} from '../kit/ui';

/* YouTube thumbnail: hero mid-teleport, Paris glowing behind, witnesses filming, "PARIS IN 40 SEC" */
export const Thumb: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse at 38% 45%, #4a7a12 0%, #1a2f08 45%, #060a03 100%)'}}>
		<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
			<defs>
				<radialGradient id="th-glow">
					<stop offset="0" stopColor={LIME} stopOpacity={0.55} />
					<stop offset="1" stopColor={LIME} stopOpacity={0} />
				</radialGradient>
			</defs>
			{/* Paris behind, glowing */}
			<g style={{filter: 'blur(3px)'}} opacity={0.9}>
				<circle cx={1450} cy={560} r={420} fill="#ffb070" opacity={0.18} />
				<Eiffel x={1450} y={1000} s={1.25} c="#2a1830" lit />
			</g>
			{/* witnesses, blurred */}
			<g style={{filter: 'blur(4px)'}}>
				<Stickman id="w1" x={1180} y={1000 - 157 * 0.9} scale={0.9} pose={{lean: -8, head: -6, armB: [-20, 30], armF: [120, 20], legB: [-4, 0], legF: [4, 0]}} {...CAST.girlpro} expr="wide" mouth="open" look={[-0.8, 0]} facing={-1} faceTurn={0.5} />
				<rect x={1085} y={640} width={40} height={70} rx={8} fill="#15171f" />
				<circle cx={1105} cy={652} r={6} fill="#ff2b2b" />
				<Stickman id="w2" x={1700} y={1020 - 157 * 0.85} scale={0.85} pose={{lean: -10, head: 0, armB: [-150, 20], armF: [150, 20], legB: [-4, 0], legF: [4, 0]}} {...CAST.sam} expr="wide" mouth="open" look={[-0.8, -0.2]} facing={-1} faceTurn={0.5} />
			</g>
			{/* teleport burst */}
			<circle cx={620} cy={560} r={520} fill="url(#th-glow)" />
			{Array.from({length: 16}).map((_, i) => {
				const a = (i / 16) * Math.PI * 2;
				return <line key={i} x1={620 + Math.cos(a) * 360} y1={560 + Math.sin(a) * 360} x2={620 + Math.cos(a) * 520} y2={560 + Math.sin(a) * 520} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.5} />;
			})}
			<circle cx={620} cy={560} r={400} fill="none" stroke={LIME} strokeWidth={14} opacity={0.6} />
			{[[300, 260, 40], [960, 300, 34], [250, 820, 30], [980, 820, 44], [820, 160, 26], [400, 120, 22]].map(([x, y, r], i) => (
				<Star key={i} x={x} y={y} r={r} rot={i * 20} c={i % 2 ? '#fff' : LIME} />
			))}
			{/* hero, big */}
			<Stickman id="th-hero" x={620} y={1250 - 157 * 2.6} scale={2.6} pose={{lean: -4, head: -4, armB: [-30, 40], armF: [140, 30], legB: [-4, 0], legF: [4, 0]}} {...CAST.hero} expr="normal" mouth="smirk" look={[0.4, -0.2]} faceTurn={0.35} rim="#efffc8" rimW={3} handF="snap" />
			{/* text, top right */}
			<g transform="translate(1340,170) rotate(-4)">
				<text textAnchor="middle" fontSize={150} fontFamily={FONT} fontWeight={900} fill="#fdfdfd" stroke="#030103" strokeWidth={18} style={{paintOrder: 'stroke'}}>
					PARIS IN
				</text>
				<text y={190} textAnchor="middle" fontSize={210} fontFamily={FONT} fontWeight={900} fill={LIME} stroke="#030103" strokeWidth={22} style={{paintOrder: 'stroke'}}>
					40 SEC
				</text>
			</g>
		</svg>
	</AbsoluteFill>
);
