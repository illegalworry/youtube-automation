import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Actor} from '../kit/core';
import {gesture, idle} from '../kit/actions';
import {Stage, camOn, Layer, Svg} from '../kit/kit';
import {Backdrop} from './places';
import {Coin, Burst, GOLD, LIME} from './gfx';

/* Thumbnail: the hero big on the right, the hook on the left. Rendered as a still. */
export const Thumb: React.FC = () => {
	const pose = gesture('presentF', idle(0, 3), 1, 0);
	return (
		<AbsoluteFill>
			<Stage cam={camOn(960, 540, 1, {farBlur: 0})} still grain={0.06} vig={0.35} light={{x: 70, y: 20, o: 0.45}}>
				<Backdrop kind="void" f={40} gf={40} />
				<Layer depth={1}>
					<Svg>
						<polygon points="1400,-100 900,1180 1900,1180" fill="#fff6c8" opacity={0.09} />
						<Burst f={14} t0={0} x={1020} y={250} c={GOLD} r={300} n={18} />
						<Actor who="hero" x={1380} floor={1330} s={2.7} facing={-1} faceTurn={0.2} look={[-0.6, -0.2]} expr="wide" mouth="smile" pose={pose} shadow={false} uid="thumb" />
						<Coin f={200} t0={0} t1={999} x={900} y={820} s={2.1} face="H" flips={0} />
					</Svg>
				</Layer>
			</Stage>
			<AbsoluteFill style={{padding: '70px 0 0 80px', fontFamily: "'Rubik', sans-serif", fontWeight: 900, textTransform: 'uppercase'}}>
				<div style={{fontSize: 330, lineHeight: 0.88, color: LIME, textShadow: '0 10px 0 #0b0f08, 0 0 60px rgba(182,255,31,0.35)', WebkitTextStroke: '10px #0b0f08', paintOrder: 'stroke fill'}}>9 DAYS</div>
				<div style={{fontSize: 120, lineHeight: 1, color: '#fff', marginTop: 20, WebkitTextStroke: '8px #0b0f08', paintOrder: 'stroke fill'}}>of perfect</div>
				<div style={{fontSize: 190, lineHeight: 0.95, color: GOLD, WebkitTextStroke: '9px #0b0f08', paintOrder: 'stroke fill'}}>LUCK</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
