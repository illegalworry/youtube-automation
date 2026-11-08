import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Actor} from './kit/core';
import {Layer, Stage, Svg, camOn} from './kit/kit';
import {City, DateTag} from './story/places';
import {FONT} from './kit/ui';

/* YouTube thumbnail: a friend with a glowing death date, the hero (you) with nothing readable. */
export const Thumb: React.FC = () => (
	<AbsoluteFill>
		<Stage cam={camOn(1000, 520, 1.55, {farBlur: 8})} bg="#070b1f" light={{x: 70, y: 20, o: 0.5, night: true}} still>
			<Layer depth={1.8}>
				<City f={40} night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<ellipse cx={1180} cy={400} rx={260} ry={90} fill="#ff4a5a" opacity={0.25} style={{filter: 'blur(30px)'}} />
					<Actor who="friend" x={1180} facing={-1} s={1} expr="worried" look={[-0.7, -0.3]} faceTurn={0.5} />
					<g transform="translate(1180,462) scale(1.5)">
						<DateTag x={0} y={0} text="TODAY" f={60} c="#ff6a6a" />
					</g>
					<Actor who="hero" x={830} facing={1} s={1.02} expr="wide" mouth="open" look={[0.6, -0.9]} faceTurn={0.3} pose={{lean: -4, head: -14, armB: [-10, 20], armF: [40, 120], legB: [-4, 0], legF: [4, 0]}} armOver handF="point" />
					<g transform="translate(830,462) scale(1.2)">
						<DateTag x={0} y={0} text="?? ??? ????" f={13} glitch c="#ffe08a" />
					</g>
				</Svg>
			</Layer>
		</Stage>
		<div style={{position: 'absolute', left: 60, top: 60, fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1, color: '#fff', WebkitTextStroke: '6px #0b0d1e', paintOrder: 'stroke', textShadow: '0 10px 30px rgba(0,0,0,.7)'}}>
			I CAN'T
			<br />
			<span style={{color: '#ffc94a'}}>SEE MINE</span>
		</div>
	</AbsoluteFill>
);
