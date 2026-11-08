/* Native vertical cards for the 9:16 teaser (1080x1920). */
import React from 'react';
import {AbsoluteFill, interpolate, spring} from 'remotion';
import {ShotCtx} from '../kit/core';
import {Extra} from '../kit/kit';
import {Stickman} from '../engine/Stickman';
import {CAST} from './cast';
import {DateTag, RollNumber, tagY} from './places';
import {FONT} from '../kit/ui';
import {Grain, Vignette} from '../engine/camera';
import {SPIKE, fakeDate} from './scene';
import {idle} from '../kit/actions';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const Ctx: React.FC<{f: number; dur: number; children: React.ReactNode}> = ({f, dur, children}) => (
	<ShotCtx.Provider value={{f, gf: f + 5000, dur, start: 0, at: () => 0, end: () => 0}}>{children}</ShotCtx.Provider>
);

/* s01–s02: two billion people, one date */
export const CardSpike: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const dateAt = 129; // "September" (short line s02)
	const k = spring({frame: f - dateAt, fps: 30, config: {damping: 9}});
	const shake = f > dateAt && f < dateAt + 12 ? Math.sin(f * 3) * (dateAt + 12 - f) : 0;
	const push = 1 + 0.06 * (f / dur);
	return (
		<Ctx f={f} dur={dur}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #2a1030 0%, #120a22 60%, #05040e 100%)'}}>
				<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{transform: `scale(${push}) translate(${shake}px,0)`, transformOrigin: '50% 60%'}}>
					<RollNumber x={540} y={420} f={f} t0={4} t1={70} from={0} to={2000000000} size={118} />
					<text x={540} y={520} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={800} fill="#aab3d6" opacity={interpolate(f, [30, 45], [0, 1], cl)}>
						PEOPLE · ONE DEATH DATE
					</text>
					{f >= dateAt ? (
						<g transform={`translate(540,720) scale(${k})`}>
							<ellipse rx={420} ry={110} fill="#ff2a3a" opacity={0.25} style={{filter: 'blur(30px)'}} />
							<rect x={-400} y={-90} width={800} height={180} rx={40} fill="#3a0d14" stroke="#ff4a5a" strokeWidth={8} />
							<text y={36} textAnchor="middle" fontSize={104} fontFamily={FONT} fontWeight={900} fill="#fff">
								{SPIKE}
							</text>
						</g>
					) : null}
					{Array.from({length: 4}).map((_, r) =>
						Array.from({length: 3}).map((__, c) => {
							const i = r * 3 + c;
							const s = 0.5 + r * 0.14;
							const fl = 1180 + r * 190;
							const x = 240 + c * 300 + (r % 2) * 70;
							return (
								<g key={i} opacity={interpolate(f, [10 + i * 3, 20 + i * 3], [0, 1], cl)}>
									<Extra i={i} x={x} floor={fl} s={s} seed="card" pose={idle(f + 5000, i)} facing={i % 2 ? 1 : -1} />
									<DateTag x={x} y={tagY(fl, s)} s={s * 1.1} f={f} on={20 + i * 4} text={f >= dateAt + 4 + i ? SPIKE : fakeDate('cs' + i)} c={f >= dateAt + 4 + i ? '#ff8a8a' : '#ffffff'} />
								</g>
							);
						}),
					)}
				</svg>
				<Vignette strength={0.5} />
				<Grain opacity={0.1} />
			</AbsoluteFill>
		</Ctx>
	);
};

/* s12–s13: the call to the full video */
export const CardEnd: React.FC<{f: number; dur: number}> = ({f, dur}) => {
	const k = spring({frame: f, fps: 30, config: {damping: 12}});
	const k2 = spring({frame: f - 45, fps: 30, config: {damping: 10}});
	return (
		<Ctx f={f} dur={dur}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #2a3570 0%, #0b1030 65%, #04050f 100%)'}}>
				<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{transform: `scale(${1 + 0.05 * (f / dur)})`, transformOrigin: '50% 60%'}}>
					<ellipse cx={540} cy={1640} rx={260} ry={40} fill="#000" opacity={0.35} style={{filter: 'blur(8px)'}} />
					<Stickman id="endhero" x={540} y={1640 - 157 * 2.1} scale={2.1} pose={idle(f + 5000, 1)} {...CAST.hero} look={[0, -0.9]} expr="wide" faceTurn={0} blink={f % 80 < 4 ? 1 : 0} />
					<DateTag x={540} y={1640 - 321 * 2.1 - 150} s={2.1} f={f} text="?? ??? ????" glitch c="#ffe08a" />
					<g transform={`translate(540,330) scale(${k})`}>
						{['WHAT IF EVERYONE', 'COULD SEE THEIR', 'DEATH DATE?'].map((t, i) => (
							<text key={i} y={i * 100} textAnchor="middle" fontSize={88} fontFamily={FONT} fontWeight={900} fill={i === 2 ? '#ffc94a' : '#fff'} stroke="#0b0d1e" strokeWidth={6} paintOrder="stroke">
								{t}
							</text>
						))}
					</g>
					{f >= 45 ? (
						<g transform={`translate(540,1790) scale(${k2})`}>
							<rect x={-380} y={-60} width={760} height={110} rx={55} fill="#d94a3a" />
							<text y={18} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#fff">
								▶ FULL VIDEO ON THE CHANNEL
							</text>
						</g>
					) : null}
				</svg>
				<Vignette strength={0.45} />
				<Grain opacity={0.1} />
			</AbsoluteFill>
		</Ctx>
	);
};
