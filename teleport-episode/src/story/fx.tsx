import React from 'react';
import {AbsoluteFill, interpolate, random, spring} from 'remotion';
import {L, useShot} from '../kit/core';
import {clamp, ease} from '../kit/kit';
import {FONT, HAND} from '../kit/ui';
import {LIME} from './cast';

/* ---------- word timing: W('005', 'pop') = local frame where that word starts ---------- */
type WL = {w: [string, number][]; from: number};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export const wordFrame = (n: string, word: string | number, nth = 0) => {
	const l = L(n) as unknown as WL;
	if (typeof word === 'number') return l.from + (l.w[Math.min(word, l.w.length - 1)]?.[1] ?? 0);
	const k = norm(word);
	let c = 0;
	for (const [t, o] of l.w) if (norm(t).startsWith(k)) {
		if (c === nth) return l.from + o;
		c++;
	}
	return l.from;
};
export const useW = () => {
	const {start} = useShot();
	return (n: string, word: string | number = 0, nth = 0) => wordFrame(n, word, nth) - start;
};

/* 4-point sparkle (the star in the hero's eye) */
export const Star: React.FC<{x: number; y: number; r: number; c?: string; rot?: number; o?: number}> = ({x, y, r, c = LIME, rot = 0, o = 1}) => (
	<path transform={`translate(${x},${y}) rotate(${rot}) scale(${r / 11})`} d="M0,-11 Q1.6,-1.6 11,0 Q1.6,1.6 0,11 Q-1.6,1.6 -11,0 Q-1.6,-1.6 0,-11 Z" fill={c} opacity={o} />
);

/* Teleport burst at world point (x, y) at local frame t0: flash core, two rings, sparkles,
   and a speed-line ripple. Draw inside a world Svg. */
export const PopBurst: React.FC<{f: number; t0: number; x: number; y: number; s?: number; c?: string; text?: string}> = ({f, t0, x, y, s = 1, c = LIME, text}) => {
	const t = f - t0;
	if (t < -2 || t > 30) return null;
	const k = interpolate(t, [0, 18], [0, 1], {...clamp, easing: ease});
	const core = interpolate(t, [-2, 1, 8], [0, 1, 0], clamp);
	return (
		<g>
			<circle cx={x} cy={y} r={(70 + 40 * core) * s} fill={c} opacity={core * 0.55} style={{filter: 'blur(14px)'}} />
			<circle cx={x} cy={y} r={30 * s * core} fill="#fff" opacity={core} />
			<circle cx={x} cy={y} r={(30 + 230 * k) * s} fill="none" stroke={c} strokeWidth={14 * (1 - k) * s} opacity={1 - k} />
			<circle cx={x} cy={y} r={(20 + 150 * k) * s} fill="none" stroke="#fff" strokeWidth={6 * (1 - k) * s} opacity={(1 - k) * 0.8} />
			{Array.from({length: 10}).map((_, i) => {
				const a = (i / 10) * Math.PI * 2 + random('pb' + i + t0) * 0.5;
				const d = (40 + 220 * k * (0.6 + random('pd' + i) * 0.6)) * s;
				return <Star key={i} x={x + Math.cos(a) * d} y={y + Math.sin(a) * d * 0.8} r={(16 - 12 * k) * s} rot={t * 9 + i * 30} c={i % 3 ? c : '#fff'} o={1 - k * k} />;
			})}
			{Array.from({length: 12}).map((_, i) => {
				const a = (i / 12) * Math.PI * 2;
				const r0 = (60 + 120 * k) * s;
				const r1 = r0 + 70 * s * (1 - k);
				return <line key={'l' + i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke="#fff" strokeWidth={5 * s} strokeLinecap="round" opacity={(1 - k) * 0.9} />;
			})}
			{text ? <Onoma x={x + 120 * s} y={y - 140 * s} t={t} text={text} size={90 * s} /> : null}
		</g>
	);
};

/* comic sound word ("POP!") that slams in, wobbles and fades */
export const Onoma: React.FC<{x: number; y: number; t: number; text: string; size?: number; c?: string; rot?: number; life?: number}> = ({x, y, t, text, size = 90, c = LIME, rot = -10, life = 26}) => {
	if (t < 0 || t > life) return null;
	const sp = spring({frame: t, fps: 30, config: {damping: 7, stiffness: 220}});
	const o = interpolate(t, [life - 8, life], [1, 0], clamp);
	return (
		<g transform={`translate(${x},${y - t * 1.2}) rotate(${rot + Math.sin(t / 2) * 3}) scale(${sp})`} opacity={o}>
			<text textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill="#11131f" stroke="#11131f" strokeWidth={size * 0.22} strokeLinejoin="round">
				{text}
			</text>
			<text textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={c}>
				{text}
			</text>
		</g>
	);
};

/* scale/opacity of a figure that teleports in at tIn and/or out at tOut */
export const tele = (f: number, tIn?: number, tOut?: number) => {
	let sx = 1;
	let sy = 1;
	let o = 1;
	if (tIn !== undefined) {
		const k = interpolate(f, [tIn, tIn + 7], [0, 1], clamp);
		if (f < tIn) o = 0;
		sx = Math.min(sx, 0.15 + 0.85 * k + Math.sin(k * Math.PI) * 0.25);
		sy = Math.min(sy, 1.5 - 0.5 * k);
		if (k >= 1) {
			const b = interpolate(f, [tIn + 7, tIn + 16], [0, 1], clamp);
			sx = 1 + Math.sin(b * Math.PI) * 0.08;
			sy = 1 - Math.sin(b * Math.PI) * 0.08;
		}
	}
	if (tOut !== undefined && f >= tOut - 4) {
		const k = interpolate(f, [tOut - 4, tOut + 3], [0, 1], clamp);
		sx *= 1 - 0.9 * k;
		sy *= 1 + 0.6 * k;
		if (f >= tOut + 3) o = 0;
	}
	return {sx, sy, o};
};
export const TeleG: React.FC<{x: number; floor: number; t: {sx: number; sy: number; o: number}; children: React.ReactNode}> = ({x, floor, t, children}) =>
	t.o <= 0 ? null : <g transform={`translate(${x},${floor}) scale(${t.sx},${t.sy}) translate(${-x},${-floor})`}>{children}</g>;

/* Big screen-space title words that slam in one by one. */
export const Slam: React.FC<{t: number; words: string[]; top?: number; size?: number; c?: string; life?: number; step?: number; hl?: number}> = ({t, words, top = 120, size = 110, c = LIME, life = 9999, step = 5, hl = -1}) => {
	if (t < 0 || t > life) return null;
	const out = interpolate(t, [life - 8, life], [1, 0], clamp);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top, left: 40, right: 40, textAlign: 'center', opacity: out}}>
				{words.map((w, i) => {
					const k = spring({frame: t - i * step, fps: 30, config: {damping: 9, stiffness: 200}});
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								margin: `0 ${size * 0.14}px`,
								fontFamily: FONT,
								fontWeight: 900,
								fontSize: size,
								lineHeight: 1.1,
								color: i === hl || (hl === -1 && i === words.length - 1) ? c : '#fff',
								WebkitTextStroke: `${Math.max(3, size * 0.05)}px #0b0d1e`,
								paintOrder: 'stroke',
								textShadow: '0 10px 30px rgba(0,0,0,.55)',
								transform: `translateY(${(1 - k) * 50}px) scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * -8}deg)`,
								opacity: Math.min(1, k * 2),
							}}
						>
							{w}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/* world-space label pill that pops on a word and floats */
export const Tag: React.FC<{x: number; y: number; t: number; text: string; size?: number; c?: string; life?: number; dark?: boolean; rot?: number}> = ({x, y, t, text, size = 44, c = LIME, life = 9999, dark = true, rot = 0}) => {
	if (t < 0 || t > life) return null;
	const k = spring({frame: t, fps: 30, config: {damping: 10, stiffness: 190}});
	const o = interpolate(t, [life - 8, life], [1, 0], clamp);
	const w = text.length * size * 0.62 + size * 1.1;
	return (
		<g transform={`translate(${x},${y + Math.sin(t / 20) * 5}) rotate(${rot + Math.sin(t / 3) * 6 * Math.exp(-t / 8)}) scale(${k})`} opacity={o}>
			<rect x={-w / 2 + 6} y={-size * 0.85 + 10} width={w} height={size * 1.7} rx={size * 0.85} fill="#000" opacity={0.25} style={{filter: 'blur(6px)'}} />
			<rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.7} rx={size * 0.85} fill={dark ? '#11142c' : c} stroke={c} strokeWidth={size * 0.1} />
			<text y={size * 0.36} textAnchor="middle" fontSize={size} fontFamily={FONT} fontWeight={900} fill={dark ? '#fff' : '#11142c'}>
				{text}
			</text>
		</g>
	);
};

/* digital clock face (8:59 etc.) */
export const Digits: React.FC<{x: number; y: number; text: string; s?: number; c?: string; blink?: boolean; f?: number}> = ({x, y, text, s = 1, c = '#ff5a4a', blink, f = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-(text.length * 36 + 40)} y={-80} width={(text.length * 36 + 40) * 2} height={160} rx={26} fill="#15161f" stroke="#2c2f3d" strokeWidth={8} />
		<text y={42} textAnchor="middle" fontSize={120} fontFamily={FONT} fontWeight={800} fill={c} opacity={blink && Math.floor(f / 8) % 2 ? 0.35 : 1} style={{filter: `drop-shadow(0 0 12px ${c})`}}>
			{text}
		</text>
	</g>
);

/* handwritten note text */
export const Hand: React.FC<{x: number; y: number; text: string; t: number; size?: number; c?: string; rot?: number; speed?: number}> = ({x, y, text, t, size = 56, c = '#2b2f3a', rot = -3, speed = 1.2}) => {
	const n = Math.max(0, Math.min(text.length, Math.floor(t * speed)));
	if (t < 0) return null;
	return (
		<text x={x} y={y} transform={`rotate(${rot} ${x} ${y})`} fontSize={size} fontFamily={HAND} fontWeight={700} fill={c}>
			{text.slice(0, n)}
		</text>
	);
};

/* lime arc trail from a to b (a blind hop path) */
export const HopArc: React.FC<{a: [number, number]; b: [number, number]; k: number; h?: number; c?: string; w?: number}> = ({a, b, k, h = 120, c = LIME, w = 6}) => {
	const mx = (a[0] + b[0]) / 2;
	const my = Math.min(a[1], b[1]) - h;
	const d = `M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`;
	const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.25 + h;
	return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeDasharray={`${len * k} ${len}`} strokeLinecap="round" />;
};
