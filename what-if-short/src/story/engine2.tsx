import React from 'react';
import {interpolate} from 'remotion';
import {Pose, POSES} from '../engine/Stickman';
import {env, gesture, idle, walkTo, SIT} from '../kit/actions';
import {Actor, useShot} from '../kit/core';
import {HeroBadge, Layer, Stage, Svg, camOn, usePush} from '../kit/kit';
import {Backdrop, BackdropKind} from './places';

/* Declarative scene interpreter. Every shot in shots.tsx is a small data record:
   backdrop + camera + actors (walks, gestures tied to line ids) + graphics (tied to line ids).
   Time specs: '011' = first frame of line 011, '011e' = its last frame, '011+20' / '011e-10' = offsets. */
export type C = {f: number; gf: number; dur: number; at: (n: string) => number; end: (n: string) => number; t: (s: string) => number};

export type Move = {t0: string; t1: string; x1: number; x0?: number};
export type Ges = {g: Parameters<typeof gesture>[0]; t0: string; t1: string};
export type AS = {
	who: string;
	x: number;
	floor?: number;
	s?: number;
	facing?: 1 | -1;
	expr?: React.ComponentProps<typeof Actor>['expr'];
	mouth?: React.ComponentProps<typeof Actor>['mouth'];
	look?: [number, number];
	faceTurn?: number;
	moves?: Move[];
	ges?: Ges[];
	sit?: number; // seat y
	pose?: Pose; // fixed base pose
	hood?: boolean;
	squash?: number;
	uid?: string;
	armOver?: boolean;
	handF?: 'fist' | 'point' | 'snap';
	hideLegs?: boolean;
	chestText?: string;
};

const ARM_OVER = new Set(['touchFace', 'rubChin', 'facepalm', 'scratch', 'think', 'handsOnHead']);

export const place = (c: C, a: AS, i = 0) => {
	let x = a.x;
	let pose: Pose = a.pose ?? (a.sit !== undefined ? SIT : idle(c.gf, i + 1));
	let moving = false;
	let vx = 0;
	let bob = 0;
	let dirn: 1 | -1 = a.facing ?? 1;
	let mv = false;
	for (const m of a.moves ?? []) {
		const t0 = c.t(m.t0);
		const t1 = c.t(m.t1);
		const xs = m.x0 ?? x;
		if (c.f >= t0 && c.f <= t1) {
			const w = walkTo(c.f, t0, t1, xs, m.x1, i + 3, 0.32);
			x = w.x;
			pose = w.pose;
			moving = w.moving;
			vx = w.vx;
			bob = w.bob;
			dirn = w.facing;
			mv = true;
			break;
		}
		if (c.f > t1) {
			x = m.x1;
			if (a.facing === undefined) dirn = (m.x1 >= xs ? 1 : -1) as 1 | -1;
		} else {
			x = xs;
			break;
		}
	}
	let over = !!a.armOver;
	let handF = a.handF;
	for (const g of a.ges ?? []) {
		const k = env(c.f, c.t(g.t0), c.t(g.t1), 7, 9);
		if (k > 0) {
			pose = gesture(g.g, pose, k, c.f);
			if (k > 0.5 && ARM_OVER.has(g.g)) over = true;
			if (k > 0.5 && g.g === 'point') handF = 'point';
		}
	}
	return {x, pose, moving, vx, bob, dir: mv ? dirn : a.facing ?? dirn, over, handF};
};

export const ActorR: React.FC<{c: C; a: AS; i?: number}> = ({c, a, i = 0}) => {
	const p = place(c, a, i);
	return (
		<Actor
			who={a.who}
			x={p.x}
			floor={a.floor ?? 900}
			s={a.s ?? 1}
			seat={a.sit}
			facing={p.dir}
			faceTurn={a.faceTurn ?? (p.moving ? 0.55 : 0.3)}
			look={a.look ?? [0.6 * p.dir, 0]}
			expr={a.expr}
			mouth={a.mouth}
			pose={p.pose}
			vx={p.vx}
			bob={p.bob}
			armOver={p.over}
			handF={p.handF}
			hood={a.hood}
			squash={a.squash}
			hideLegs={a.hideLegs}
			chestText={a.chestText}
			uid={a.uid ?? `${a.who}${i}`}
		/>
	);
};

export type SC = {
	bg: BackdropKind;
	night?: boolean;
	tint?: string; // backdrop variant key
	cam: [number, number, number] | [[number, number, number], [number, number, number]];
	light?: {x?: number; y?: number; o?: number; night?: boolean; c?: string};
	dust?: string;
	actors?: (c: C) => AS[];
	gfx?: (c: C) => React.ReactNode; // world-space SVG, drawn on the subject plane (over actors)
	back?: (c: C) => React.ReactNode; // world-space SVG behind the actors
	fore?: (c: C) => React.ReactNode; // near foreground (depth 0.6)
	over?: (c: C) => React.ReactNode; // raw layer-1 children drawn above actors (e.g. <Blanket/>)
	badge?: number; // actor index carrying the day badge
	still?: boolean;
	whip?: boolean;
	bgc?: string;
};

export const useC = (): C => {
	const s = useShot();
	const t = (spec: string) => {
		const m = /^(\d{3})(e?)([+-]\d+)?$/.exec(spec);
		if (!m) throw new Error('bad time spec ' + spec);
		return (m[2] ? s.end(m[1]) : s.at(m[1])) + (m[3] ? parseInt(m[3], 10) : 0);
	};
	return {f: s.f, gf: s.gf, dur: s.dur, at: s.at, end: s.end, t};
};

export const sc = (cfg: SC): React.FC => {
	const cams = Array.isArray(cfg.cam[0]) ? (cfg.cam as [number, number, number][]) : [cfg.cam as [number, number, number], [cfg.cam[0] as number, cfg.cam[1] as number, (cfg.cam[2] as number) * 1.12] as [number, number, number]];
	const Comp: React.FC = () => {
		const c = useC();
		const cam = usePush(camOn(...cams[0]), camOn(...cams[1]));
		const actors = cfg.actors ? cfg.actors(c) : [];
		const hero = cfg.badge !== undefined ? actors[cfg.badge] : undefined;
		const hp = hero ? place(c, hero, cfg.badge) : null;
		return (
			<Stage cam={cam} bg={cfg.bgc ?? '#0c1208'} light={cfg.light ?? {x: 24, y: 10, o: 0.4, night: cfg.night}} dust={cfg.dust} still={cfg.still}>
				<Backdrop kind={cfg.bg} f={c.f} gf={c.gf} night={cfg.night} tint={cfg.tint} />
				{cfg.back ? (
					<Layer depth={1}>
						<Svg>{cfg.back(c)}</Svg>
					</Layer>
				) : null}
				<Layer depth={1}>
					<Svg>
						{actors.map((a, i) => (
							<ActorR key={i} c={c} a={a} i={i} />
						))}
						{cfg.gfx ? cfg.gfx(c) : null}
						{hero && hp ? <HeroBadge x={hp.x} y={(hero.sit ?? (hero.floor ?? 900) - 157 * (hero.s ?? 1)) - 164 * (hero.s ?? 1) - 115} s={0.8} /> : null}
					</Svg>
				</Layer>
				{cfg.over ? <Layer depth={1}>{cfg.over(c)}</Layer> : null}
				{cfg.fore ? (
					<Layer depth={0.6}>
						<Svg>{cfg.fore(c)}</Svg>
					</Layer>
				) : null}
			</Stage>
		);
	};
	return Comp;
};

export {POSES, interpolate};
