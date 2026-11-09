import React from 'react';
import {Pose} from '../engine/Stickman';
import {Actor, useShot} from '../kit/core';
import {camOn, usePush} from '../kit/kit';
import {TeleG, tele} from './fx';

export const FL = 900;
export const headY = (s = 1, fl = FL) => fl - 321 * s;
export const badgeY = (s = 1, fl = FL) => fl - 321 * s - 110 * s;

type PP = {
	who: string;
	x: number;
	s?: number;
	fl?: number;
	pose?: Pose;
	facing?: 1 | -1;
	expr?: any;
	mouth?: any;
	look?: [number, number];
	inAt?: number;
	outAt?: number;
	handItem?: React.ReactNode;
	armOver?: boolean;
	handF?: any;
	vx?: number;
	bob?: number;
	lidL?: number;
	lidR?: number;
	faceTurn?: number;
	seat?: number;
	uid?: string;
	squash?: number;
	blink?: number;
	hood?: boolean;
	hideLegs?: boolean;
	shadow?: boolean;
	o?: number;
};
/* any cast member, with optional teleport in/out (squash + stretch) */
export const Person: React.FC<PP> = ({who, x, s = 1, fl = FL, inAt, outAt, o = 1, ...rest}) => {
	const {f} = useShot();
	const t = tele(f, inAt, outAt);
	for (const k of Object.keys(rest)) if ((rest as any)[k] === undefined) delete (rest as any)[k];
	const body = <Actor who={who} x={x} floor={fl} s={s} uid={rest.uid ?? who + Math.round(x)} {...(rest as any)} />;
	if (t.o <= 0) return null;
	return (
		<g opacity={o}>
			<TeleG x={x} floor={rest.seat !== undefined ? rest.seat + 157 * s : fl} t={t}>
				{body}
			</TeleG>
		</g>
	);
};
export const Hero: React.FC<Omit<PP, 'who'>> = (p) => <Person who="hero" {...p} />;

/* slow push between two framings across the shot */
export const usePushOn = (x: number, y: number, z0: number, z1: number, dx = 0, dy = 0) => usePush(camOn(x, y, z0), camOn(x + dx, y + dy, z1));

/* toothbrush, phone, notebook, stopwatch, chips… drawn at the hand */
export const Toothbrush = () => (
	<g transform="rotate(-60)">
		<rect x={-4} y={-50} width={8} height={60} rx={4} fill="#3fc1c9" />
		<rect x={-6} y={-62} width={12} height={16} rx={3} fill="#fff" />
	</g>
);
export const PhoneItem: React.FC<{glow?: boolean}> = ({glow}) => (
	<g transform="rotate(-20)">
		<rect x={-14} y={-46} width={28} height={50} rx={6} fill="#15171f" />
		<rect x={-11} y={-42} width={22} height={40} rx={3} fill={glow ? '#7fd0ff' : '#3d6fd6'} />
	</g>
);
export const Notebook = () => (
	<g transform="rotate(-10)">
		<rect x={-26} y={-40} width={52} height={64} rx={4} fill="#fbfaf4" stroke="#2f6fd8" strokeWidth={3} />
		{[0, 1, 2, 3].map((i) => (
			<line key={i} x1={-18} y1={-26 + i * 12} x2={18} y2={-26 + i * 12} stroke="#9ab" strokeWidth={2} />
		))}
	</g>
);
export const Stopwatch = () => (
	<g>
		<circle cx={0} cy={-18} r={22} fill="#e8ecf4" stroke="#2b2f3a" strokeWidth={4} />
		<rect x={-5} y={-48} width={10} height={10} fill="#2b2f3a" />
		<line x1={0} y1={-18} x2={10} y2={-30} stroke="#d94a3a" strokeWidth={3} />
	</g>
);
export const Chips = () => (
	<g transform="rotate(10)">
		<path d="M-22,-50 L22,-50 L26,10 L-26,10 Z" fill="#e23b3b" />
		<ellipse cx={0} cy={-20} rx={14} ry={10} fill="#ffd34a" />
	</g>
);
export const Croissant = () => (
	<g transform="rotate(-20)">
		<path d="M-34,0 Q-20,-30 0,-32 Q20,-30 34,0 Q18,-10 0,-10 Q-18,-10 -34,0 Z" fill="#e2a24a" stroke="#b8782a" strokeWidth={3} />
	</g>
);
export const Lemon: React.FC<{s?: number}> = ({s = 1}) => <ellipse cx={0} cy={-12 * s} rx={20 * s} ry={15 * s} fill="#ffe03a" stroke="#e8b81a" strokeWidth={3} />;
export const Charger = () => (
	<g>
		<rect x={-12} y={-30} width={24} height={30} rx={4} fill="#f2f2f2" />
		<rect x={-6} y={-40} width={4} height={10} fill="#999" />
		<rect x={2} y={-40} width={4} height={10} fill="#999" />
		<path d="M0,0 q0,30 -30,40" stroke="#f2f2f2" strokeWidth={5} fill="none" />
	</g>
);
