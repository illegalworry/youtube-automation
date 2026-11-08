/* A small scene builder for this video: a set, actors with entrances / gestures /
   expressions tied to line ids, date tags over heads, crowds, camera keys, extra layers. */
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import type {Expr, Mouth, Pose} from '../engine/Stickman';
import type {Cam} from '../engine/camera';
import {env, gesture, idle, run, walk, walkTo, type Gesture} from '../kit/actions';
import {Actor, useShot} from '../kit/core';
import {Extra, Layer, Stage, Svg, camOn, ease, mixCam, type Light} from '../kit/kit';
import {DateTag, tagY} from './places';

export type When = string | [string, number];
/* the vertical short crops these shots: their 16:9 screen captions would be cut, so it hides them */
export const NoScreen = createContext(false);
export type Ctx = {f: number; gf: number; dur: number; w: (x: When) => number; short?: boolean; vcam?: [number, number, number]};
/* the vertical short gives each shot its own camera (world x, y, zoom) so the people it is
   about stay inside the 9:16 window */
export const CamOverride = createContext<((c: Ctx) => [number, number, number]) | null>(null);
type XYZ = [number, number, number];

export type ActorSpec = {
	who: string;
	x: number;
	s?: number;
	floor?: number;
	facing?: 1 | -1;
	enter?: [When, number, number]; // at, frames, from x
	exit?: [When, number, number]; // at, frames, to x
	gest?: [Gesture, When, number?][];
	expr?: [When, Expr][];
	mouth?: [When, Mouth][];
	look?: [number, number];
	faceTurn?: number;
	tag?: string;
	tagOn?: When;
	tagDead?: When;
	tagRoll?: [When, string];
	glitch?: boolean;
	tagC?: string;
	lie?: number; // lying on a bed whose top is this y
	seat?: number;
	handItem?: React.ReactNode;
	handF?: 'point' | 'fist' | 'snap';
	armOver?: When; // front arm over face from this line (with a gesture like touchFace/facepalm)
	hidden?: [When, When]; // not drawn between
	blink?: When[]; // forced blinks
	pose?: (c: Ctx, base: Pose) => Pose;
	dx?: (c: Ctx) => number; // extra x motion
	fy?: (c: Ctx) => number; // floor over time (falls, jumps)
	squash?: (c: Ctx) => number;
};
export type CrowdSpec = {n: number; x0: number; x1: number; floor: number; s: number; seed: string; mode?: 'stand' | 'walk' | 'run' | 'panic'; dir?: 1 | -1; tags?: boolean; tagOn?: When; stagger?: number; dead?: When; fixed?: string; depth?: number; speed?: number};
export type Spec = {
	set: (c: Ctx) => React.ReactNode;
	setDepth?: number;
	bg?: string;
	light?: Light | false;
	cam: XYZ;
	cam2?: XYZ;
	keys?: [When, XYZ][];
	still?: boolean;
	actors?: ActorSpec[];
	crowd?: CrowdSpec[];
	back?: (c: Ctx) => React.ReactNode; // world, depth 1, behind actors
	front?: (c: Ctx) => React.ReactNode; // world, depth 1, over actors
	fg?: (c: Ctx) => React.ReactNode; // world, depth 0.6 (blurred foreground)
	screen?: (c: Ctx) => React.ReactNode; // screen space overlay
	dust?: string;
	shake?: [When, number?][];
};

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const fakeDate = (seed: string, y0 = 2027, y1 = 2105) => `${MON[Math.floor(random(seed + 'm') * 12)]} ${1 + Math.floor(random(seed + 'd') * 28)} ${y0 + Math.floor(random(seed + 'y') * (y1 - y0))}`;
export const SPIKE = 'SEP 9 2031';

const latest = <T,>(list: [When, T][] | undefined, c: Ctx, def: T): T => {
	let v = def;
	for (const [w, x] of list ?? []) if (c.f >= c.w(w)) v = x;
	return v;
};

const ActorNode: React.FC<{a: ActorSpec; c: Ctx; i: number}> = ({a, c, i}) => {
	const s = a.s ?? 1;
	const fl = a.fy ? a.fy(c) : (a.floor ?? 900);
	if (a.hidden && c.f >= c.w(a.hidden[0]) && c.f < c.w(a.hidden[1])) return null;
	let x = a.x;
	let pose: Pose = idle(c.gf, i * 3 + a.x / 100);
	let facing: 1 | -1 = a.facing ?? 1;
	let vx = 0;
	let bob = 0;
	if (a.enter) {
		const t0 = c.w(a.enter[0]);
		const wk = walkTo(c.f, t0, t0 + a.enter[1], a.enter[2], a.x, i, 0.32);
		x = wk.x;
		if (wk.moving) {
			pose = wk.pose;
			facing = wk.facing;
		}
		vx = wk.vx;
		bob = wk.bob;
		if (c.f < t0) x = a.enter[2];
	}
	if (a.exit && c.f >= c.w(a.exit[0])) {
		const t0 = c.w(a.exit[0]);
		const wk = walkTo(c.f, t0, t0 + a.exit[1], a.x, a.exit[2], i, 0.32);
		x = wk.x;
		if (wk.moving) {
			pose = wk.pose;
			facing = wk.facing;
		}
		vx = wk.vx;
		bob = wk.bob;
	}
	if (a.dx) x += a.dx(c);
	for (const [g, w, len] of a.gest ?? []) {
		const t0 = c.w(w);
		pose = gesture(g, pose, env(c.f, t0, t0 + (len ?? 50), 8, 10), c.f);
	}
	if (a.pose) pose = a.pose(c, pose);
	const expr = latest(a.expr, c, 'normal' as Expr);
	const mouth = latest(a.mouth, c, undefined as Mouth | undefined);
	const armOver = a.armOver ? c.f >= c.w(a.armOver) && c.f < c.w(a.armOver) + 60 : undefined;
	const tagX = x + (a.lie !== undefined ? -300 * s : 6 * facing);
	const ty = a.lie !== undefined ? a.lie - 110 * s : a.seat !== undefined ? a.seat - 164 * s - 92 * s : tagY(fl, s);
	// in the 9:16 short, a tag the narrow frame would cut is left out
	let tagFits = true;
	if (c.vcam) {
		const [X, , z] = c.vcam;
		const sx = 960 + (tagX - X) * z;
		tagFits = Math.abs(sx - 960) + 150 * s * z < 300;
	}
	const tag = a.tag && tagFits ? (
		<DateTag
			x={tagX}
			y={ty}
			text={a.tag}
			f={c.f}
			on={a.tagOn ? c.w(a.tagOn) : -999}
			s={s * 0.95}
			glitch={a.glitch}
			dead={a.tagDead ? c.w(a.tagDead) : 9999}
			c={a.tagC}
			roll={a.tagRoll ? [c.w(a.tagRoll[0]), c.w(a.tagRoll[0]) + 16, a.tagRoll[1]] : undefined}
		/>
	) : null;
	const body = (
		<Actor
			who={a.who}
			x={x}
			floor={fl}
			s={s}
			facing={facing}
			faceTurn={a.faceTurn ?? 0.45}
			look={a.look ?? [facing * 0.5, 0]}
			expr={expr}
			mouth={mouth}
			pose={a.lie !== undefined ? {lean: 0, head: -6 + Math.sin(c.gf / 30) * 3, armB: [4, 10], armF: [6, 12], legB: [0, 0], legF: [3, 0]} : pose}
			vx={vx}
			bob={bob}
			seat={a.seat}
			handItem={a.handItem}
			handF={a.handF}
			armOver={armOver}
			squash={a.squash ? a.squash(c) : undefined}
			shadow={a.lie === undefined}
			blink={(a.blink ?? []).some((b) => c.f >= c.w(b) && c.f < c.w(b) + 5) ? 1 : undefined}
			uid={`${a.who}${i}`}
		/>
	);
	if (a.lie !== undefined) {
		// hip at (x, lie); body rotated so the head points left
		return (
			<g>
				<g transform={`translate(${x},${a.lie}) rotate(-84) translate(${-x},${-(fl - 157 * s)})`}>{body}</g>
				{tag}
			</g>
		);
	}
	return (
		<g>
			{body}
			{tag}
		</g>
	);
};

const Crowd: React.FC<{k: CrowdSpec; c: Ctx}> = ({k, c}) => {
	const out: React.ReactNode[] = [];
	const t0 = k.tagOn ? c.w(k.tagOn) : -999;
	for (let i = 0; i < k.n; i++) {
		const r = random(k.seed + i);
		let x = k.x0 + ((k.x1 - k.x0) * (i + 0.5)) / k.n + (r - 0.5) * 40;
		const fl = k.floor + (r - 0.5) * 12;
		let pose: Pose = idle(c.gf, i);
		let facing: 1 | -1 = r > 0.5 ? 1 : -1;
		const mode = k.mode ?? 'stand';
		if (mode !== 'stand') {
			facing = k.dir ?? 1;
			const sp = (k.speed ?? (mode === 'walk' ? 2 : 5)) * (0.8 + r * 0.5);
			const ph = c.gf * (mode === 'walk' ? 0.25 : 0.45) + r * 6;
			x += facing * c.f * sp;
			pose = mode === 'walk' ? walk(ph) : mode === 'panic' ? {...run(ph), armF: [150, 20], armB: [-140, 20]} : run(ph);
		}
		out.push(<Extra key={'e' + i} i={i} x={x} floor={fl} s={k.s} pose={pose} seed={k.seed} facing={facing} expr={mode === 'panic' ? 'wide' : undefined} />);
		// in the 9:16 short, a crowd tag that would be cut by the narrow frame is left out
		let tagFits = true;
		if (c.vcam) {
			const [X, , z] = c.vcam;
			const d = k.depth ?? 1.2;
			const sc = 1 + (z - 1) / d;
			const sx = 960 + (x - 960) * sc - ((X - 960) * z) / d;
			tagFits = false; // background tags clutter the narrow frame and get cut; only the main people keep theirs
		}
		if (k.tags && tagFits)
			out.push(
				<DateTag
					key={'t' + i}
					x={x}
					y={tagY(fl, k.s)}
					s={k.s * 0.95}
					f={c.f}
					on={t0 + (k.stagger ?? 0) * random(k.seed + 'o' + i) * 1}
					text={k.fixed && random(k.seed + 'fx' + i) < 0.8 ? k.fixed : fakeDate(k.seed + i)}
					dead={k.dead ? c.w(k.dead) + random(k.seed + 'k' + i) * 30 : 9999}
				/>,
			);
	}
	return <>{out}</>;
};

export const scene = (sp: Spec): React.FC => {
	const C: React.FC = () => {
		const {f, gf, at, dur} = useShot();
		const noScreen = useContext(NoScreen);
		const w = (x: When) => (typeof x === 'string' ? at(x) : at(x[0]) + x[1]);
		const camOv = useContext(CamOverride);
		const c: Ctx = {f, gf, dur, w, short: noScreen};
		const A = camOn(...sp.cam);
		let cam: Cam = sp.cam2 ? mixCam(A, camOn(...sp.cam2), interpolate(f, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease})) : A;
		if (sp.keys) {
			let cur = cam;
			for (const [wk, xyz] of sp.keys) {
				const t0 = w(wk);
				const k = interpolate(f, [t0 - 6, t0 + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
				if (k > 0) cur = mixCam(cur, camOn(...xyz), k);
			}
			cam = cur;
		}
		if (camOv) {
			c.vcam = camOv(c);
			cam = camOn(...c.vcam);
		}
		for (const [wk, amp] of sp.shake ?? []) {
			const t0 = w(wk);
			if (f >= t0 && f < t0 + 14) {
				const a = (amp ?? 14) * (1 - (f - t0) / 14);
				cam = {...cam, x: cam.x + Math.sin(f * 2.3) * a, y: cam.y + Math.cos(f * 3.1) * a * 0.6};
			}
		}
		const crowdsAt = (d: number) => (sp.crowd ?? []).filter((k) => (k.depth ?? 1.2) === d).map((k, i) => <Crowd key={i} k={k} c={c} />);
		const depths = Array.from(new Set((sp.crowd ?? []).map((k) => k.depth ?? 1.2))).sort((a, b) => b - a);
		return (
			<>
				<Stage cam={cam} bg={sp.bg ?? '#101225'} light={sp.light ?? {x: 25, y: 12, o: 0.38}} dust={sp.dust} still={sp.still}>
					<Layer depth={sp.setDepth ?? 1.6}>{sp.set(c)}</Layer>
					{depths.map((d) => (
						<Layer key={d} depth={d}>
							<Svg>{crowdsAt(d)}</Svg>
						</Layer>
					))}
					<Layer depth={1}>
						<Svg>
							{sp.back ? sp.back(c) : null}
							{(sp.actors ?? []).map((a, i) => (
								<ActorNode key={i} a={a} c={c} i={i} />
							))}
							{sp.front ? sp.front(c) : null}
						</Svg>
					</Layer>
					{sp.fg ? (
						<Layer depth={0.6}>
							<Svg>{sp.fg(c)}</Svg>
						</Layer>
					) : null}
				</Stage>
				{sp.screen && !noScreen ? <AbsoluteFill style={{pointerEvents: 'none'}}>{sp.screen(c)}</AbsoluteFill> : null}
			</>
		);
	};
	return C;
};

/* full-frame board (infographic) builder: children get the ctx */
import {Board} from '../kit/ui';
export const board = (draw: (c: Ctx) => React.ReactNode, tint?: string): React.FC => {
	const C: React.FC = () => {
		const {f, gf, at, dur} = useShot();
		const w = (x: When) => (typeof x === 'string' ? at(x) : at(x[0]) + x[1]);
		return <Board tint={tint}>{draw({f, gf, dur, w})}</Board>;
	};
	return C;
};
