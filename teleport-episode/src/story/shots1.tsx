import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose} from '../engine/Stickman';
import {SIT, env, gesture, idle, run, walk, walkTo} from '../kit/actions';
import {useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Callout} from '../kit/graphics';
import {Layer, Rays, Stage, Svg, camOn, clamp, mixCam, flash, Sleeper, CrowdRow} from '../kit/kit';
import {Bedroom, Blanket, Corridor, Kitchen} from '../kit/sets';
import {Bubble, FONT, HAND} from '../kit/ui';
import {LIME} from './cast';
import {FL, Hero, Person, headY, usePushOn, Toothbrush, PhoneItem, Notebook, Stopwatch, Chips, Croissant, Charger} from './common';
import {Digits, Hand, HopArc, Onoma, PopBurst, Slam, Star, Tag, useW} from './fx';
import {ClassRoom, DeskRow, Shower, Sky, Hills, Ground, CarWash, Lake, Cow, ParkingLot, Wedding, ParisBridge, ParisFar, Rooftop, Pizzeria, PizzaCounter, PizzaBox, Eiffel} from './places';
import {Card, Commute, Globe, HopMap, Napkin, PassportPages, PhotonPizza, Quantum, Rule, SpeedBars, TeaserCards, TitleCard} from './boards';

const k01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

/* 001-002 8:59, alarm didn't go off */
const Alarm: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const up = W('002', 'off');
	const cam = usePushOn(1400, 600, 1.35, 1.6, -80, 0);
	const awake = f >= up;
	const pose: Pose = gesture('handsOnHead', idle(gf, 2), env(f, up + 4, 999, 6, 6), gf);
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{awake ? <Hero x={1500} s={1} pose={pose} expr="wide" mouth="open" look={[-0.3, -0.2]} facing={-1} inAt={up} /> : <Sleeper x={1420} y={700} />}
					<Digits x={1085} y={520} text="8:59" s={0.9} blink f={f} />
				</Svg>
			</Layer>
			<Layer depth={1}>{!awake ? <Blanket f={gf} /> : null}</Layer>
			<Layer depth={0.95}>
				<Svg>
					<Onoma x={1220} y={420} t={f - up} text="!!" size={120} c="#ff5a4a" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 003-004 exam at 9, other side of the city, 40 min by bus; one sock */
const Panic: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const a = walkTo(f, 0, 40, 500, 1300, 1, 0.5);
	const b = walkTo(f, 50, 95, 1300, 700, 2, 0.5);
	const c = walkTo(f, 105, 150, 700, 1150, 3, 0.5);
	const w = f < 48 ? a : f < 100 ? b : c;
	const pose = blendPanic(w.pose, gf);
	const cam = usePushOn(960, 560, 1.12, 1.25);
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={w.x} pose={pose} facing={w.facing} vx={w.vx * 2} bob={w.bob} expr="wide" mouth="open" />
					<Tag x={560} y={180} t={f - W('003', '9')} text="EXAM · 9:00" size={50} c="#ff5a4a" />
					<Tag x={1380} y={240} t={f - W('003', 'other')} text="OTHER SIDE OF THE CITY" size={40} />
					<Tag x={960} y={360} t={f - W('003', '40')} text="40 MIN BY BUS" size={54} c="#ffd34a" />
					<Callout f={f} t0={W('004', 'one')} t1={9999} from={[w.x + 10, 895]} to={[w.x + 260, 760]} text="ONE SOCK" c={LIME} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const blendPanic = (p: Pose, gf: number): Pose => ({...p, armF: [120 + Math.sin(gf / 3) * 25, 40], armB: [-120 + Math.cos(gf / 3) * 25, 40]});

/* 005 squeeze eyes shut, picture the hallway, pop */
const Squeeze: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const shut = f >= W('005', 'squeeze') + 4 ? 1 : 0;
	const pop = W('005', 'pop');
	const cam = usePushOn(820, headY() + 10, 1.9, 2.3, 40, 0);
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
			<Layer depth={1.6}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={820} pose={{...idle(gf, 3), lean: -2, armF: [30, 100], armB: [-30, 100]}} lidL={shut} lidR={shut} mouth={shut ? 'flat' : 'open'} squash={shut ? 0.02 * Math.sin(gf) : 0} outAt={pop} handItem={<Toothbrush />} />
					<PopBurst f={f} t0={pop} x={820} y={headY() + 60} s={0.8} text="POP!" />
					<Bubble x={1110} y={430} w={300} h={210} t={f - W('005', 'picture')} thought tail={[-140, 120]}>
						<rect x={-130} y={-80} width={260} height={160} rx={10} fill="#f1e6c8" />
						{Array.from({length: 5}).map((_, i) => (
							<rect key={i} x={-120 + i * 50} y={-50} width={44} height={120} fill="#3d6fd6" />
						))}
						<text x={0} y={-56} textAnchor="middle" fontSize={22} fontFamily={FONT} fill="#2b2f3a">
							214
						</text>
					</Bubble>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 006-007 hallway: gray floor, buzzing lights, locker 214; still holding the toothbrush */
const Hallway: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = 2;
	const raise = env(f, W('007', 'toothbrush') - 6, 999, 10, 10);
	const pose = {...idle(gf, 4), armF: [20 + 90 * raise, 90 - 60 * raise] as [number, number]};
	const cam = mixCam(camOn(960, 560, 1.05), camOn(700, 520, 1.5), k01(f, W('007', 0), W('007', 0) + 50));
	const buzz = 0.75 + 0.25 * (Math.floor(gf / 3) % 5 === 0 ? 0 : 1);
	return (
		<Stage cam={cam} bg="#f1e6c8" light={{x: 40, y: 0, o: 0.35 * buzz}}>
			<Layer depth={1.5}>
				<Corridor f={gf} />
				<Svg>
					<rect x={540} y={455} width={70} height={36} rx={5} fill="#fff" />
					<text x={575} y={483} textAnchor="middle" fontSize={28} fontFamily={FONT} fill="#2b2f3a">
						214
					</text>
					{[300, 900, 1500].map((x) => (
						<g key={x}>
							<rect x={x - 120} y={-60} width={240} height={20} fill="#fffbe8" opacity={buzz} />
							<rect x={x - 160} y={-40} width={320} height={260} fill="#fffbe8" opacity={0.06 * buzz} />
						</g>
					))}
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={700} pose={pose} expr="wide" mouth="open" look={[0.4, -0.3]} inAt={tin} handItem={<Toothbrush />} />
					<PopBurst f={f} t0={tin} x={700} y={headY() + 120} />
					<Tag x={420} y={970} t={f - W('006', 'gray')} text="GRAY FLOOR" size={36} life={W('007', 0) + 10 - W('006', 'gray')} />
					<Tag x={960} y={120} t={f - W('006', 'buzzing')} text="BUZZING LIGHTS" size={36} life={W('007', 0) + 10 - W('006', 'buzzing')} />
					<Callout f={f} t0={W('006', 'locker')} t1={W('007', 0) + 20} from={[575, 470]} to={[300, 300]} text="LOCKER 214" c={LIME} />
					<Callout f={f} t0={W('007', 'toothbrush')} t1={9999} from={[760, headY() + 60]} to={[1050, 360]} text="TOOTHBRUSH" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 008-012 janitor drops his mop: where did you come from? — the bus. fast bus. */
const Janitor: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const drop = W('008', 'drops');
	const mopA = interpolate(f, [drop, drop + 16], [-8, -88], {...clamp, easing: (t) => t * t});
	const JX = 1260;
	const HX = 700;
	const jp = gesture('point', idle(gf, 5), env(f, W('009', 0), W('009', 0) + 60, 6, 10), gf);
	const hp = gesture('shrug', gesture('point', idle(gf, 6), env(f, W('011', 'outside') - 4, W('011', 'outside') + 30, 6, 8), gf), env(f, W('012', 0), 999, 6, 6), gf);
	const wide = camOn(980, 560, 1.12);
	const cam = sp === 'JANITOR' ? camOn(JX - 60, 540, 1.7) : sp === 'HERO' ? camOn(HX + 60, 540, 1.7) : wide;
	return (
		<Stage cam={cam} bg="#f1e6c8" light={{x: 40, y: 0, o: 0.35}}>
			<Layer depth={1.5}>
				<Corridor f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform={`rotate(${mopA} ${JX + 70} 900)`}>
						<rect x={JX + 64} y={560} width={12} height={340} fill="#a87a4a" />
						<path d={`M${JX + 30},890 h80 l10,20 h-100 z`} fill="#d8d8e0" />
					</g>
					<Person who="janitor" x={JX} facing={-1} pose={jp} expr="wide" look={[-0.6, 0]} handF={f > W('009', 0) ? 'point' : undefined} />
					<Hero x={HX} pose={hp} look={[0.6, 0]} handItem={<Toothbrush />} handF={env(f, W('011', 'outside') - 4, W('011', 'outside') + 30, 6, 8) > 0.5 ? 'point' : undefined} />
					<Onoma x={JX + 200} y={760} t={f - drop - 12} text="CLACK!" size={64} c="#ffd34a" />
					<Tag x={HX + 40} y={320} t={f - W('012', 0)} text="FAST BUS." size={44} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 013-014 into the exam at 8:59:40; one sock, toothbrush, best grade */
const Exam: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const w = walkTo(f, 6, 70, -150, 760, 7, 0.32);
	const cam = usePushOn(900, 560, 1.05, 1.25, 60, 0);
	const g = W('014', 'best');
	return (
		<Stage cam={cam} bg="#d9e6c8" light={{x: 70, y: 10, o: 0.35}}>
			<Layer depth={1.4}>
				<ClassRoom f={gf} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					<CrowdRow n={5} x0={1000} x1={1900} floor={830} s={0.85} mode="stand" seed="ex" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={w.x} pose={w.pose} vx={w.vx} bob={w.bob} facing={w.facing} look={[0.5, 0]} />
				</Svg>
			</Layer>
			<Layer depth={0.95}>
				<DeskRow y={800} n={4} x0={1180} gap={240} />
				<Svg>
					<Digits x={560} y={260} text="8:59:40" s={0.75} c={LIME} />
					<Tag x={760} y={300} t={f - W('014', 'one')} text="ONE SOCK" size={34} life={g + 10 - W('014', 'one')} />
					<Tag x={1000} y={240} t={f - W('014', 'toothbrush')} text="TOOTHBRUSH" size={34} life={g + 10 - W('014', 'toothbrush')} />
					<g transform={`translate(1240,420) rotate(-10) scale(${f > g ? 1 + 1.2 * Math.max(0, 1 - (f - g) / 8) : 0})`} opacity={f > g ? 1 : 0}>
						<circle r={130} fill="none" stroke="#e23b3b" strokeWidth={14} />
						<text y={55} textAnchor="middle" fontSize={160} fontFamily={HAND} fontWeight={700} fill="#e23b3b">
							A+
						</text>
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 015-016 enjoy it — the last normal morning */
const LastNormal: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const t2 = W('016', 0);
	const gray = k01(f, t2, t2 + 20);
	const cam = usePushOn(780, headY() + 20, 1.9, 2.3, -30, 0);
	return (
		<AbsoluteFill style={{filter: `grayscale(${gray * 0.85}) brightness(${1 - gray * 0.2})`}}>
			<Stage cam={cam} bg="#d9e6c8" light={{x: 70, y: 10, o: 0.35}}>
				<Layer depth={1.6}>
					<ClassRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero x={780} pose={gesture('fist', idle(gf, 8), env(f, 0, t2, 6, 10), gf)} look={[0.3, 0]} mouth="smile" />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - t2 - 4} words={['THE', 'LAST', 'NORMAL', 'MORNING']} top={820} size={88} c="#ff6a5a" />
		</AbsoluteFill>
	);
};

/* 017-020 teaser */
const Teaser: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <TeaserCards t={f} ts={[W('017', 0), W('018', 0), W('019', 0), W('020', 0)]} />;
};
const Title: React.FC = () => {
	const {f} = useShot();
	return <TitleCard t={f} />;
};

/* 022-025 weekend testing in the bedroom; Sam with stopwatch, notebook, chips */
const Testing: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	// the hero pops between spots every ~1.6 s
	const spots = [620, 980, 760, 1100, 700, 900, 640, 1020];
	const step = 48;
	const i = Math.min(spots.length - 1, Math.floor(Math.max(0, f - 10) / step));
	const tin = 10 + i * step;
	const munch = f > W('025', 'eats') ? Math.abs(Math.sin(gf / 3)) : 0;
	const cam = usePushOn(1060, 580, 1.08, 1.22, 40, 0);
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Person who="sam" x={1480} seat={650} pose={{...SIT, armF: [f > W('025', 'eats') ? 140 - 40 * munch : 60, 80], armB: [40, 70]}} facing={-1} look={[-0.6, 0]} mouth={munch > 0.5 ? 'open' : 'line'} handItem={f > W('025', 'eats') ? <Chips /> : f > W('024', 'stopwatch') ? <Stopwatch /> : undefined} />
					{i < spots.length ? <Hero key={i} x={spots[i]} pose={idle(gf, i)} inAt={i ? tin : undefined} outAt={tin + step - 2} look={[0.4, 0]} expr={i % 2 ? 'wide' : 'normal'} /> : null}
					{i > 0 ? <PopBurst f={f} t0={tin} x={spots[i]} y={headY() + 120} s={0.6} /> : null}
					<Tag x={1480} y={300} t={f - W('024', 'sam')} text="SAM · BEST FRIEND" size={36} c="#f08a3c" />
					<Tag x={1700} y={420} t={f - W('024', 'notebook')} text="NOTEBOOK" size={28} />
					<Tag x={1300} y={420} t={f - W('024', 'stopwatch')} text="STOPWATCH" size={28} />
					<Tag x={1520} y={520} t={f - W('025', 'eats')} text="…MOSTLY CHIPS" size={34} c="#e23b3b" />
					<Tag x={700} y={150} t={f - W('023', 'weekend')} text="TEST WEEKEND" size={44} />
				</Svg>
			</Layer>
		</Stage>
	);
};

const EyeIcon = () => (
	<g>
		<path d="M-170,0 Q0,-130 170,0 Q0,130 -170,0 Z" fill="#fff" />
		<circle r={62} fill="#2a6fd0" />
		<circle r={28} fill="#0b0d1e" />
		<circle cx={-18} cy={-20} r={12} fill="#fff" />
	</g>
);
const Rule1: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Rule t={f + 4} n={1} text="big jumps: only places you've SEEN with your own eyes" sub="not photos · not videos" tSub={W('028', 0) + 4} icon={<EyeIcon />} />;
};

/* 029-031 staring at a Maldives picture for 10 minutes; close your eyes; pop */
const Maldives: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const shut = f >= W('030', 'eyes') ? 1 : 0;
	const pop = W('031', 0);
	const cam = mixCam(camOn(400, 600, 1.4), camOn(330, headY(1, 900) + 40, 2.0), k01(f, W('030', 0) - 10, W('030', 0) + 20));
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={330} pose={{...idle(gf, 9), armF: [70, 70], head: 6}} look={[0.8, 0.3]} lidL={shut} lidR={shut} handItem={<PhoneItem glow />} outAt={pop} mouth={shut ? 'flat' : 'smile'} />
					<PopBurst f={f} t0={pop} x={330} y={headY() + 100} text="POP!" />
					<Bubble x={640} y={340} w={360} h={240} t={f - W('029', 'picture')}>
						<rect x={-160} y={-100} width={320} height={110} fill="#7fd0f0" />
						<rect x={-160} y={10} width={320} height={90} fill="#f6e2b0" />
						<circle cx={100} cy={-60} r={26} fill="#fff6c8" />
						<path d="M-110,20 q20,-90 10,-120 M-110,-90 q-40,0 -60,20 M-110,-90 q40,-10 50,20" stroke="#3a7a30" strokeWidth={8} fill="none" />
						<text x={0} y={80} textAnchor="middle" fontSize={30} fontFamily={HAND} fontWeight={700} fill="#2b2f3a">
							Maldives
						</text>
					</Bubble>
					<Tag x={640} y={560} t={f - W('029', '10')} text="10 MINUTES" size={36} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 032 land in your own shower, fully dressed */
const ShowerShot: React.FC = () => {
	const {f, gf} = useShot();
	const cam = usePushOn(990, 560, 1.25, 1.5, 0, 0);
	return (
		<Stage cam={cam} bg="#cfe6ec" light={{x: 50, y: 0, o: 0.4}}>
			<Layer depth={1.3}>
				<Shower f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={1000} pose={{...idle(gf, 10), armF: [140, 30], armB: [-140, 30]}} expr="wide" mouth="open" look={[0, -1]} inAt={4} />
					<PopBurst f={f} t0={4} x={1000} y={headY() + 120} />
					<Onoma x={1260} y={360} t={f - 14} text="SPLASH!" size={80} c="#7fd0ff" life={40} />
					<Tag x={1000} y={160} t={f - 30} text="FULLY DRESSED" size={44} c="#7fd0ff" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 033-034 Sam writes it down: No Maldives */
const NotePage: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	const t1 = W('034', 0);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #6a5038 0%, #2a1a0a 100%)'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: `scale(${1.05 + f * 0.002}) rotate(${-2 + f * 0.02}deg)`}}>
				<rect x={360} y={80} width={1200} height={920} fill="#fbfaf4" />
				{Array.from({length: 18}).map((_, i) => (
					<line key={i} x1={360} y1={180 + i * 48} x2={1560} y2={180 + i * 48} stroke="#bcd" strokeWidth={2} />
				))}
				<line x1={470} y1={80} x2={470} y2={1000} stroke="#e8a0a0" strokeWidth={3} />
				<Hand x={520} y={220} t={f} text="TELEPORT TESTS — Sat" size={64} c="#2b3a8a" speed={1.5} />
				<Hand x={520} y={360} t={f - 6} text="1. Maldives (photo) →" size={60} c="#2b3a8a" speed={1.5} />
				<Hand x={1060} y={360} t={f - 30} text="shower" size={60} c="#d94a3a" speed={1.2} />
				{f > t1 ? <Hand x={600} y={520} t={f - t1} text="NO MALDIVES" size={110} c="#d94a3a" rot={-6} speed={1.6} /> : null}
				{f > t1 + 16 ? <ellipse cx={920} cy={490} rx={400} ry={90} fill="none" stroke="#d94a3a" strokeWidth={8} transform="rotate(-6 920 490)" strokeDasharray={2000} strokeDashoffset={2000 * (1 - k01(f, t1 + 16, t1 + 32))} /> : null}
			</svg>
		</AbsoluteFill>
	);
};

const Compass = () => (
	<g>
		<circle r={140} fill="#fbfaf4" stroke="#6b4a2a" strokeWidth={10} />
		<path d="M0,-110 L24,0 L0,110 L-24,0 Z" fill="#e23b3b" />
		<path d="M0,0 L24,0 L0,110 L-24,0 Z" fill="#2b2f3a" />
		<circle r={14} fill="#6b4a2a" />
	</g>
);
const Rule2: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Rule t={f + 4} n={2} text="short jumps (under ~50 km): you can go BLIND" sub="lands roughly where you aim · ± a few hundred meters" tSub={W('038', 'give')} icon={<Compass />} />;
};

/* 039-040 sometimes a field; once a car wash */
const FieldWash: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const cut = W('040', 0) - 4;
	const second = f >= cut;
	const tin = second ? cut + 6 : 4;
	const cam = second ? camOn(1000, 600, 1.2) : camOn(900, 600, 1.05);
	return (
		<Stage cam={cam} bg="#a8dcf6" light={{x: 30, y: 0, o: 0.45}}>
			<Layer depth={2}>
				<Sky k="day" f={gf} sun={[1500, 200]} id="fw" />
			</Layer>
			<Layer depth={1.5}>{second ? <Ground c="#8a8f9e" /> : <Hills id="fwh" />}</Layer>
			<Layer depth={1.2}>{second ? <CarWash f={gf} /> : <Ground c="#6cc24a" stripes />}</Layer>
			<Layer depth={1}>
				<Svg>
					{!second ? <Cow x={1400} y={900} f={gf} s={0.8} flip /> : null}
					<Hero key={second ? 'b' : 'a'} x={second ? 1000 : 760} pose={second ? {...idle(gf, 11), armF: [150, 20], armB: [-150, 20]} : gesture('shrug', idle(gf, 12), env(f, tin + 14, 999), gf)} expr={second ? 'wide' : 'normal'} mouth={second ? 'open' : 'line'} inAt={tin} look={[0.5, 0]} />
					<PopBurst f={f} t0={tin} x={second ? 1000 : 760} y={headY() + 120} />
					<Tag x={760} y={240} t={f - W('039', 'field')} text="A FIELD" size={48} life={cut - 4 - W('039', 'field')} />
					<Tag x={1000} y={200} t={f - W('040', 'car')} text="A CAR WASH" size={48} c="#3fc1c9" />
				</Svg>
			</Layer>
		</Stage>
	);
};

const HandsIcon = () => (
	<g>
		<rect x={-200} y={-60} width={110} height={120} rx={20} fill="#3d6fd6" />
		<rect x={-40} y={-80} width={60} height={110} rx={10} fill="#15171f" />
		<rect x={-32} y={-72} width={44} height={84} rx={4} fill="#7fd0ff" />
		<rect x={80} y={-14} width={140} height={34} rx={17} fill="#f08a3c" />
	</g>
);
const Rule3: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Rule t={f + 4} n={3} text="whatever you're touching comes with you" sub="your backpack · your phone · Sam's arm" tSub={W('043', 0)} icon={<HandsIcon />} />;
};

/* 044-045 Sam lands in the kitchen and throws up into the sink. warn me. */
const SamSick: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const tin = W('044', 'lands') - 4;
	const go = W('044', 'throws');
	const sx = walkTo(f, go - 18, go, 900, 520, 3, 0.4);
	const bend = env(f, go, W('045', 0) - 4, 6, 10);
	const samPose: Pose = f < W('045', 0) ? {...sx.pose, lean: sx.pose.lean + 50 * bend, head: 20 * bend} : gesture('point', idle(gf, 13), env(f, W('045', 'warn'), 999, 6, 6), gf);
	const cam = sp === 'SAM' ? camOn(560, 560, 1.7) : usePushOnInline(f);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 50, y: 10, o: 0.4}}>
			<Layer depth={1.4}>
				<Kitchen />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Person who="sam" x={f < W('045', 0) ? sx.x : 560} pose={samPose} facing={f < W('045', 0) ? -1 : 1} expr={bend > 0.3 ? 'sleepy' : 'angry'} mouth={bend > 0.3 ? 'open' : undefined} inAt={tin} look={[0.6, 0]} handF={f > W('045', 'warn') ? 'point' : undefined} />
					<Hero x={1200} pose={gesture('scratch', idle(gf, 14), env(f, W('045', 0), 999), gf)} facing={-1} inAt={tin} look={[-0.6, 0]} mouth="flat" />
					<PopBurst f={f} t0={tin} x={1050} y={headY() + 120} />
					<Onoma x={400} y={560} t={f - go - 4} text="BLEH!" size={70} c="#9fe05a" />
					<Tag x={560} y={260} t={f - W('045', 'warn')} text="WARN ME." size={56} c="#f08a3c" />
				</Svg>
			</Layer>
		</Stage>
	);
};
const usePushOnInline = (f: number) => mixCam(camOn(900, 560, 1.1), camOn(760, 560, 1.3), interpolate(f, [0, 120], [0, 1], clamp));

const Skull = () => (
	<g>
		<circle r={110} fill="#fbfaf4" />
		<rect x={-60} y={60} width={120} height={70} rx={14} fill="#fbfaf4" />
		<circle cx={-40} cy={-6} r={30} fill="#1f3a16" />
		<circle cx={40} cy={-6} r={30} fill="#1f3a16" />
		<path d="M0,30 l-14,24 h28 z" fill="#1f3a16" />
	</g>
);
const Rule4: React.FC = () => {
	const {f} = useShot();
	return <Rule t={f + 4} n={4} text="the one that almost kills you" icon={<Skull />} />;
};

/* 047 first long jump: 80 km to grandpa's lake */
const LakeThink: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const cam = usePushOn(700, 520, 1.5, 1.8, 40, -10);
	return (
		<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
			<Layer depth={1.5}>
				<Bedroom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={600} pose={gesture('think', idle(gf, 15), env(f, 0, 999), gf)} look={[0.6, -0.5]} lidL={f > W('047', 'lake') ? 1 : 0} lidR={f > W('047', 'lake') ? 1 : 0} />
					<Tag x={600} y={180} t={f - W('047', 'Saturday')} text="SATURDAY" size={40} />
					<Tag x={1050} y={150} t={f - W('047', '80')} text="80 KM" size={60} c="#ffd34a" />
					<Bubble x={980} y={400} w={380} h={240} t={f - W('047', 'lake')} thought tail={[-170, 140]}>
						<rect x={-170} y={-100} width={340} height={100} fill="#9fd2f0" />
						<rect x={-170} y={0} width={340} height={100} fill="#3d8cc4" />
						<rect x={40} y={-14} width={120} height={10} fill="#8a6a44" />
						<line x1={120} y1={-60} x2={20} y2={30} stroke="#2b2f3a" strokeWidth={3} />
						<circle cx={120} cy={-50} r={16} fill="#000" />
						<rect x={108} y={-36} width={24} height={30} rx={6} fill="#6b7f8e" />
						<text x={0} y={80} textAnchor="middle" fontSize={26} fontFamily={HAND} fontWeight={700} fill="#fff">
							grandpa&apos;s lake
						</text>
					</Bubble>
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 048-051 you arrive running, stumble three steps, face first into the water */
const LakeRun: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = 2;
	const fall = W('051', 'fall');
	const x = interpolate(f, [tin, fall], [-100, 1180], clamp) + interpolate(f, [fall, fall + 14], [0, 140], clamp);
	const vx = f < fall ? (1280 / Math.max(1, fall - tin)) : 0;
	const tilt = interpolate(f, [W('050', 0), fall, fall + 14], [0, 30, 95], clamp);
	const sink = interpolate(f, [fall + 6, fall + 20], [0, 120], clamp);
	const pose = run(gf * 0.55);
	const cam = mixCam(camOn(x + 120, 600, 1.2), camOn(1250, 640, 1.35), k01(f, fall - 30, fall));
	return (
		<Stage cam={cam} bg="#a8dcf6" light={{x: 40, y: 0, o: 0.45}}>
			<Layer depth={2.2}>
				<Sky k="day" f={gf} sun={[400, 180]} id="lk" />
			</Layer>
			<Layer depth={1.4}>
				<Lake f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform={`translate(0,${sink}) rotate(${tilt} ${x} 900)`}>
						<Hero x={x} pose={{...pose, armF: [150, 20], armB: [-60, 40]}} vx={vx} expr="wide" mouth="open" inAt={tin} look={[0.6, 0.2]} />
					</g>
					<PopBurst f={f} t0={tin} x={-60} y={headY() + 120} />
				</Svg>
			</Layer>
			<Layer depth={0.98}>
				<Lake f={gf} front splash={f - fall - 8} />
				<Svg>
					<Tag x={700} y={200} t={f - W('049', 0)} text="NOT WALKING. RUNNING." size={46} c="#ff6a5a" life={W('051', 0) - W('049', 0)} />
					<Onoma x={1300} y={520} t={f - fall - 8} text="SPLOOSH!" size={96} c="#7fd0ff" life={44} />
				</Svg>
			</Layer>
		</Stage>
	);
};

const GlobeShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Globe t={f} ts={{speed: W('054', 'about') + 8, sound: W('054', 'faster'), diff: W('057', 'every'), jump: W('058', 0)}} />;
};
const Speed: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <SpeedBars t={f} t2={W('061', 'Jump')} />;
};

/* 062-063 learn to hop: 50 km at a time, small stumble each landing */
const Hops: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const step = 34;
	const n = Math.floor(Math.max(0, f - 4) / step);
	const xs = (i: number) => 300 + i * 250;
	const tin = 4 + n * step;
	const st = env(f, tin + 2, tin + 12, 3, 8);
	const x = xs(n);
	const cam = camOn(380 + ((f - 4) / step) * 250, 600, 1.2);
	return (
		<Stage cam={cam} bg="#a8dcf6" light={{x: 30, y: 0, o: 0.45}}>
			<Layer depth={2.2}>
				<Sky k="day" f={gf} sun={[1600, 160]} id="hp" />
			</Layer>
			<Layer depth={1.5}>
				<Hills id="hph" />
			</Layer>
			<Layer depth={1.2}>
				<Ground c="#6cc24a" stripes />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{n > 0 ? <HopArc a={[xs(n - 1), 760]} b={[x, 760]} k={k01(f, tin - 6, tin)} h={220} /> : null}
					<Hero key={n} x={x + 30 * st} pose={{...idle(gf, n), lean: 22 * st, armF: [70 * st, 30], armB: [-70 * st, 30]}} inAt={tin} outAt={tin + step - 2} vx={st * 10} expr={st > 0.3 ? 'wide' : 'normal'} look={[0.6, 0]} />
					<PopBurst f={f} t0={tin} x={x} y={headY() + 120} s={0.6} />
					<Tag x={xs(n) + 80} y={200} t={f - W('062', '50')} text="50 KM PER HOP" size={52} />
					<Tag x={xs(n) + 80} y={300} t={f - W('063', 'catch')} text="LET THE GROUND CATCH YOU" size={38} c="#ffd34a" />
				</Svg>
			</Layer>
		</Stage>
	);
};

const NapkinShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Napkin t={f} ts={[W('065', 0), W('066', 0), W('067', 'two')]} />;
};

/* 068 life gets ridiculously convenient */
const Convenient: React.FC = () => {
	const {f, gf} = useShot();
	const cam = usePushOn(960, 560, 1.15, 1.35);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
				<Layer depth={1.4}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero x={900} pose={{...idle(gf, 16), armF: [160, 20], armB: [-160, 20], lean: -6}} lidL={0.6} lidR={0.6} mouth="smile" />
						{Array.from({length: 6}).map((_, i) => (
							<Star key={i} x={900 + Math.cos(gf / 20 + i) * 200} y={420 + Math.sin(gf / 20 + i) * 80} r={14} rot={gf * 4} />
						))}
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - 8} words={['RIDICULOUSLY', 'CONVENIENT']} top={120} size={100} />
		</AbsoluteFill>
	);
};
const CommuteShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Commute t={f} ts={[W('069', 0), W('070', 'add'), W('072', 0)]} />;
};

/* 073-077 never late, ever; forget your charger? pop. got it. */
const NeverLate: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = W('073', 0);
	const out = W('076', 0);
	const back = W('077', 0) - 2;
	const pat = env(f, W('075', 0), out, 6, 4);
	const cam = mixCam(camOn(820, 560, 1.15), camOn(820, headY() + 60, 1.8), k01(f, W('075', 0) - 10, W('075', 0) + 10));
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#d9e6c8" light={{x: 70, y: 10, o: 0.35}}>
				<Layer depth={1.4}>
					<ClassRoom f={gf} board="HISTORY" clock="8:00" />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero key={f < back ? 'a' : 'b'} x={820} pose={f < back ? gesture('scratch', {...idle(gf, 17), armB: [10 + 20 * pat, 60]}, pat, gf) : {...idle(gf, 18), armF: [110, 40]}} inAt={f < back ? tin : back} outAt={f < back ? out : undefined} handItem={f >= back ? <Charger /> : undefined} mouth="smile" look={[0.5, 0]} expr={pat > 0.5 ? 'worried' : 'normal'} />
						<PopBurst f={f} t0={tin} x={820} y={headY() + 120} s={0.7} />
						<PopBurst f={f} t0={out} x={820} y={headY() + 120} s={0.7} text="POP" />
						<PopBurst f={f} t0={back} x={820} y={headY() + 120} s={0.7} />
						<Tag x={1060} y={headY() - 20} t={f - back - 4} text="GOT IT." size={44} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('073', 'never')} words={['NEVER', 'LATE.']} top={90} size={96} life={W('075', 0) - 4 - W('073', 'never')} />
			<Slam t={f - W('074', 0)} words={['EVER.']} top={210} size={96} life={W('075', 0) - 4 - W('074', 0)} />
		</AbsoluteFill>
	);
};

/* 078-080 pizza in Naples: 20 hops, still hot */
const PizzaRun: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = W('078', 'pizza');
	const cam = usePushOn(1100, 580, 1.1, 1.35, -60, 0);
	return (
		<Stage cam={cam} bg="#f3d9a8" light={{x: 80, y: 30, o: 0.45, c: '255,200,140'}}>
			<Layer depth={1.4}>
				<Pizzeria f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={1000} pose={{...idle(gf, 19), armF: [60, 60], armB: [-10, 60]}} inAt={tin} handItem={<PizzaBox x={20} y={10} s={0.8} open={k01(f, W('080', 0), W('080', 0) + 12)} steam={k01(f, W('080', 'hot'), W('080', 'hot') + 10)} f={gf} />} mouth="smile" look={[0.3, -0.2]} />
					<PopBurst f={f} t0={tin} x={1000} y={headY() + 120} />
					<Tag x={1000} y={180} t={f - W('078', 'naples')} text="NAPLES, ITALY" size={46} c="#2f8a4a" />
					<Tag x={620} y={300} t={f - W('079', 0)} text="20 HOPS" size={60} />
					<Tag x={1300} y={360} t={f - W('080', 'hot')} text="STILL HOT" size={50} c="#ff8a3a" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 081-083 the guy at the counter: every Friday at 7. you live around here? kind of. */
const PizzaGuy: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const cam = sp === 'PIZZA' ? camOn(1400, 540, 1.75) : sp === 'HERO' ? camOn(700, 540, 1.75) : camOn(1050, 560, 1.2);
	return (
		<Stage cam={cam} bg="#f3d9a8" light={{x: 80, y: 30, o: 0.45, c: '255,200,140'}}>
			<Layer depth={1.4}>
				<Pizzeria f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Person who="pizza" x={1400} facing={-1} pose={gesture('rubChin', idle(gf, 20), env(f, W('082', 0), W('082', 0) + 40), gf)} look={[-0.6, 0]} expr={f > W('082', 0) ? 'worried' : 'normal'} />
					<Hero x={700} pose={gesture('shrug', idle(gf, 21), env(f, W('083', 0), 999), gf)} look={[0.6, 0]} mouth="smirk" />
				</Svg>
			</Layer>
			<Layer depth={0.9}>
				<PizzaCounter />
				<Svg>
					<Tag x={1050} y={170} t={f - W('081', 'friday')} text="EVERY FRIDAY · 7 PM" size={44} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 084-087 40 extra minutes of sleep; mom is proud; you've just got a superpower */
const SleepIn: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const mom = walkTo(f, W('085', 0) - 4, W('085', 0) + 30, -200, 420, 4, 0.3);
	const wink = f > W('087', 0) ? 1 : 0;
	const cam = mixCam(camOn(1400, 640, 1.4), camOn(1100, 600, 1.15), k01(f, W('085', 0) - 6, W('085', 0) + 16));
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#a9cfe0" light={{x: 60, y: 20, o: 0.4}}>
				<Layer depth={1.4}>
					<Bedroom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						{f < W('086', 0) ? <Sleeper x={1420} y={700} /> : <Hero x={1560} seat={680} pose={{...SIT, lean: -10, armF: [150, 30]}} lidL={wink} lidR={0} look={[-0.6, 0]} mouth="smirk" />}
						<Person who="mom" x={mom.x} pose={gesture('presentF', mom.pose, env(f, W('085', 'finally'), 999), gf)} vx={mom.vx} bob={mom.bob} mouth="smile" look={[0.6, 0]} />
					</Svg>
				</Layer>
				<Layer depth={1}>{f < W('086', 0) ? <Blanket f={gf} /> : null}</Layer>
				<Layer depth={0.95}>
					<Svg>
						<Tag x={1500} y={420} t={f - W('084', '40')} text="+40 MIN SLEEP" size={46} life={W('085', 0) + 4 - W('084', '40')} />
						<Tag x={420} y={300} t={f - W('085', 'together')} text="SO PROUD" size={40} c="#e86aa0" life={W('086', 0) - W('085', 'together')} />
						<Tag x={1300} y={300} t={f - W('086', 0)} text="YOU HAVEN'T." size={48} c="#ff6a5a" life={W('087', 0) - W('086', 0)} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('087', 'superpower')} words={['SUPERPOWER']} top={120} size={130} />
		</AbsoluteFill>
	);
};

const ParisMap: React.FC = () => {
	const {f} = useShot();
	return <HopMap t={f} hops={20} km="≈1,000 KM" title="FIRST TRIP TO PARIS: 20 BLIND HOPS" label2="PARIS" />;
};

/* 090-092 cow field, parking lot, a stranger's wedding next to the cake. Congratulations. Pop! */
const BlindLandings: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tc = W('090', 'cow') - 4;
	const tp = W('090', 'parking') - 4;
	const tw = W('090', 'wedding') - 4;
	const out = W('092', 0);
	const sc = f < tp ? 0 : f < tw ? 1 : 2;
	const tin = [tc, tp, tw][sc];
	const HX = [760, 900, 1050][sc];
	const pose = sc === 2 ? gesture('wave', idle(gf, 22), env(f, W('091', 0), out, 6, 4), gf) : {...idle(gf, 23), armF: [130, 30], armB: [-120, 30]} as Pose;
	const cam = sc === 2 ? mixCam(camOn(1150, 600, 1.3), camOn(1150, 580, 1.5), k01(f, tw, out)) : camOn(HX + 100, 600, 1.25);
	return (
		<Stage cam={cam} bg="#a8dcf6" light={{x: 40, y: 0, o: 0.45}}>
			<Layer depth={2.2}>
				<Sky k="day" f={gf} sun={[1500, 180]} id="bl" />
			</Layer>
			<Layer depth={1.5}>{sc === 0 ? <Hills id="blh" /> : sc === 1 ? <ParkingLot /> : <Hills id="blh2" c="#7fcf5a" />}</Layer>
			<Layer depth={1.2}>{sc === 0 ? <Ground c="#6cc24a" stripes /> : sc === 1 ? <Ground c="#5a5f6b" /> : <Ground c="#7fcf5a" />}</Layer>
			<Layer depth={1.1}>
				{sc === 2 ? (
					<>
						<Wedding f={gf} />
						<Svg>
							<CrowdRow n={5} x0={150} x1={900} floor={880} s={0.9} mode="dance" seed="wed" />
						</Svg>
					</>
				) : null}
			</Layer>
			<Layer depth={1}>
				<Svg>
					{sc === 0 ? (
						<>
							<Cow x={1250} y={900} f={gf} s={0.9} flip />
							<Cow x={400} y={880} f={gf + 20} s={0.7} />
						</>
					) : null}
					<Hero key={sc} x={HX} pose={pose} inAt={tin} outAt={sc === 2 ? out : undefined} expr={sc < 2 ? 'wide' : 'normal'} mouth={sc === 2 ? 'smile' : 'open'} look={[0.5, 0]} />
					<PopBurst f={f} t0={tin} x={HX} y={headY() + 120} s={0.7} />
					<PopBurst f={f} t0={out} x={HX} y={headY() + 120} s={0.7} text="POP!" />
					{sc === 0 ? <Onoma x={1300} y={480} t={f - tc - 12} text="MOO?" size={60} c="#fff" /> : null}
					{sc === 2 ? <Tag x={1100} y={250} t={f - W('091', 0)} text="CONGRATULATIONS!" size={44} c="#ff9ac0" /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 093-094 once you've stood on that bridge, it's yours forever. Paris is one memory away */
const Bridge: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const mem = W('093', 'yours');
	const cam = usePushOn(900, 560, 1.15, 1.45, 60, -10);
	return (
		<Stage cam={cam} bg="#8fd0f6" light={{x: 70, y: 10, o: 0.4}}>
			<Layer depth={2.4}>
				<Sky k="day" f={gf} sun={[400, 200]} id="br" />
			</Layer>
			<Layer depth={1.8}>
				<ParisFar k="day" />
			</Layer>
			<Layer depth={1.2}>
				<ParisBridge f={gf} k="day" />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={900} pose={gesture('presentF', idle(gf, 24), env(f, 10, mem, 10, 10), gf)} look={[0.7, -0.5]} mouth="smile" />
					{f > mem ? (
						<g>
							<circle cx={900} cy={headY() - 10} r={60 + 40 * k01(f, mem, mem + 20)} fill="none" stroke={LIME} strokeWidth={6} opacity={1 - k01(f, mem, mem + 20)} />
							<Star x={900 + 90} y={headY() - 90} r={30} rot={gf * 3} />
						</g>
					) : null}
					<Tag x={1300} y={240} t={f - mem} text="SAVED FOREVER" size={46} />
					<Tag x={900} y={150} t={f - W('094', 'one')} text="ONE MEMORY AWAY" size={50} c={LIME} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 095-098 weekends: croissant in Paris at 8 am = 2 am back home */
const Croissants: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const bite = f > W('096', 'croissant') ? Math.abs(Math.sin(gf / 5)) : 0;
	const cam = usePushOn(820, 560, 1.3, 1.55, 40, 0);
	return (
		<Stage cam={cam} bg="#ffe0b0" light={{x: 70, y: 10, o: 0.45}}>
			<Layer depth={2.4}>
				<Sky k="dawn" f={gf} sun={[1600, 420]} id="cr" />
			</Layer>
			<Layer depth={1.6}>
				<ParisFar k="dawn" />
			</Layer>
			<Layer depth={1.2}>
				<Ground c="#b8a888" />
				<Svg>
					{Array.from({length: 26}).map((_, i) => (
						<rect key={i} x={-500 + i * 120} y={910 + (i % 2) * 40} width={110} height={34} rx={6} fill="#a89878" />
					))}
					<path d="M1080,500 L1500,500 L1460,560 L1120,560 Z" fill="#d94a3a" />
					{Array.from({length: 7}).map((_, i) => (
						<rect key={i} x={1120 + i * 50} y={500} width={25} height={60} fill="#fbf7f0" />
					))}
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<rect x={900} y={760} width={200} height={14} rx={6} fill="#2b2f3a" />
					<rect x={994} y={774} width={12} height={126} fill="#2b2f3a" />
					<circle cx={960} cy={744} r={16} fill="#fbf7f0" />
					<Hero x={760} pose={{...idle(gf, 25), armF: [100 + 30 * bite, 80]}} handItem={<Croissant />} mouth={bite > 0.6 ? 'open' : 'smile'} look={[0.4, 0]} />
					<Digits x={500} y={300} text="8:00" s={0.6} c={LIME} />
					<Tag x={500} y={410} t={f - W('096', 'paris')} text="PARIS" size={36} />
					{f > W('097', 0) ? (
						<g>
							<Digits x={1380} y={300} text="2:00" s={0.6} c="#7f9cff" />
							<Tag x={1380} y={410} t={f - W('097', 0)} text="BACK HOME" size={36} c="#7f9cff" />
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 099 back in bed before anyone notices */
const BackInBed: React.FC = () => {
	const {f, gf} = useShot();
	const cam = usePushOn(1420, 640, 1.35, 1.55);
	return (
		<Stage cam={cam} bg="#1d2550" light={{night: true, o: 0.3}}>
			<Layer depth={1.4}>
				<Bedroom f={gf} night />
			</Layer>
			<Layer depth={1}>
				<Svg>{f > 8 ? <Sleeper x={1420} y={700} expr="sleepy" /> : null}</Svg>
			</Layer>
			<Layer depth={1}>{f > 8 ? <Blanket f={gf} night /> : null}</Layer>
			<Layer depth={0.95}>
				<Svg>
					<PopBurst f={f} t0={6} x={1550} y={640} s={0.8} />
					<Onoma x={1650} y={420} t={f - 18} text="z z z" size={60} c="#cfd8ff" life={80} rot={-4} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 100-102 collect cities like stickers */
const Stickers: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const cities: [string, number, number, string, string][] = [
		['PARIS', 760, 380, 'paris', '#3d6fd6'],
		['ROME', 1120, 700, 'rome', '#d94a3a'],
		['BARCELONA', 540, 760, 'barcelona', '#ffd34a'],
	];
	return (
		<Card tint="#1a3a4a">
			<path d="M300,200 Q600,120 900,220 Q1200,160 1500,260 Q1650,500 1500,700 Q1300,900 1100,860 Q900,980 700,900 Q400,940 320,700 Q200,450 300,200 Z" fill="#2f5a2a" opacity={0.8} />
			{cities.map(([n, x, y, w, c], i) => {
				const t = f - W('101', w);
				if (t < 0) return null;
				const k = Math.min(1, t / 6);
				return (
					<g key={i} transform={`translate(${x},${y}) rotate(${(i - 1) * 8}) scale(${1 + (1 - k) * 1.5})`} opacity={k}>
						<circle r={80} fill={c} stroke="#fff" strokeWidth={10} />
						<text y={130} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff">
							{n}
						</text>
						<Star x={0} y={0} r={40} c="#fff" rot={gf * 2} />
					</g>
				);
			})}
			{f > W('102', 0) ? (
				<g>
					<circle cx={1500} cy={500} r={14} fill={LIME} />
					<circle cx={1500} cy={500} r={30 + 10 * Math.sin(gf / 5)} fill="none" stroke={LIME} strokeWidth={4} />
					<text x={960} y={1000} textAnchor="middle" fontSize={56} fontFamily={HAND} fontWeight={700} fill={LIME}>
						each one: a dot in your head that never fades
					</text>
				</g>
			) : null}
			<text x={960} y={110} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
				CITIES LIKE STICKERS
			</text>
		</Card>
	);
};

/* 103-105 sunset on a Paris roof, hop home, watch it again: two sunsets */
const Sunsets: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const cut = W('104', 'hop') + 4;
	const home = f >= cut;
	const cam = usePushOn(900, 600, 1.2, 1.4, 50, 0);
	return (
		<Stage cam={cam} bg="#e0607a" light={{x: 50, y: 40, o: 0.5, c: '255,180,140'}}>
			<Layer depth={2.4}>
				<Sky k="sunset" f={gf} sun={[home ? 1300 : 1000, home ? 640 : 560]} id={home ? 'ss2' : 'ss1'} />
			</Layer>
			<Layer depth={1.4}>
				<Rooftop f={gf} city={home ? 'home' : 'paris'} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero key={home ? 'h' : 'p'} x={760} seat={760} pose={{...SIT, armB: [-30, 30], armF: [20, 40]}} look={[0.6, -0.2]} mouth="smile" inAt={home ? cut : undefined} outAt={home ? undefined : cut - 4} />
					<PopBurst f={f} t0={cut - 4} x={760} y={680} s={0.7} />
					<Tag x={760} y={300} t={f - 6} text={home ? 'HOME' : 'PARIS'} size={44} c={home ? '#7f9cff' : '#ffd27a'} />
				</Svg>
			</Layer>
			<Layer depth={0.95}>
				<Svg>
					<Tag x={1200} y={180} t={f - W('105', 0)} text="2 SUNSETS · 1 EVENING" size={52} c="#ffd27a" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 106-109 jet lag: clocks orbit the dizzy hero */
const JetLag: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const dz = k01(f, W('109', 0), W('109', 0) + 30);
	return (
		<AbsoluteFill>
			<Card tint="#2a1a4a">
				<g transform={`translate(960,${560}) rotate(${Math.sin(gf / 9) * 6 * dz})`}>
					{Array.from({length: 6}).map((_, i) => {
						const a = gf / (14 - dz * 6) + (i * Math.PI) / 3;
						const sp = 0.5 + 0.5 * Math.min(1, Math.max(0, (f - W('108', 0)) / 20));
						return (
							<g key={i} transform={`translate(${Math.cos(a) * 380},${Math.sin(a) * 160 - 120}) scale(${sp})`}>
								<circle r={60} fill="#fbfaf4" stroke="#2b2f3a" strokeWidth={8} />
								<line x1={0} y1={0} x2={0} y2={-40} stroke="#2b2f3a" strokeWidth={6} transform={`rotate(${gf * (6 + i * 3)})`} />
								<line x1={0} y1={0} x2={26} y2={0} stroke="#d94a3a" strokeWidth={6} transform={`rotate(${gf * (2 + i)})`} />
							</g>
						);
					})}
				</g>
			</Card>
			<AbsoluteFill>
				<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
					<g transform={`rotate(${Math.sin(gf / 7) * 8 * dz} 960 900)`}>
						<HeroFree x={960} f={gf} expr={dz > 0.3 ? 'sleepy' : 'worried'} />
					</g>
				</svg>
			</AbsoluteFill>
			<Slam t={f - W('107', 0)} words={['JET', 'LAG']} top={60} size={130} c="#ff8a5a" />
		</AbsoluteFill>
	);
};
const HeroFree: React.FC<{x: number; f: number; expr: any}> = ({x, f, expr}) => <Hero x={x} s={1.1} pose={gesture('handsOnHead', idle(f, 26), 1, f)} expr={expr} mouth="frown" look={[Math.sin(f / 5) * 0.6, Math.cos(f / 5) * 0.4]} />;

/* 110-115 asleep in math class, twice. late night? early morning. in France. */
const MathClass: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const wake = f > W('114', 0) - 6;
	const tw = W('111', 0);
	const nod = f > tw && f < tw + 20 ? Math.sin(((f - tw) / 20) * Math.PI) : 0;
	const hero: Pose = wake ? {...SIT, armF: [60, 80], head: 0} : {...SIT, lean: 40 - 30 * nod, head: 30, armF: [80, 110], armB: [60, 100]};
	const cam = sp === 'TEACHER' ? camOn(1360, 520, 1.7) : sp === 'HERO' ? camOn(800, 600, 1.7) : camOn(1000, 580, 1.15);
	return (
		<Stage cam={cam} bg="#d9e6c8" light={{x: 70, y: 10, o: 0.35}}>
			<Layer depth={1.4}>
				<ClassRoom f={gf} board="MATH: x² + 7x = ?" clock="9:00" />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Person who="teacher" x={1380} facing={-1} pose={gesture('armsCrossed', idle(gf, 27), env(f, W('112', 0) - 10, 999), gf)} look={[-0.6, 0.2]} expr={f > W('112', 0) ? 'angry' : 'normal'} />
					<Hero x={800} seat={790} pose={hero} lidL={wake ? 0.5 : 1} lidR={wake ? 0.5 : 1} mouth={wake ? 'smirk' : 'open'} look={[0.6, 0]} />
				</Svg>
			</Layer>
			<Layer depth={0.95}>
				<DeskRow y={770} n={1} x0={860} />
				<Svg>
					{!wake ? <Onoma x={760} y={430} t={(f % 40) + 0} text="z" size={60} c="#9aa3b5" life={40} rot={-10} /> : null}
					<Tag x={1000} y={200} t={f - tw} text="TWICE." size={56} c="#ff6a5a" life={W('112', 0) - tw} />
					<Tag x={800} y={300} t={f - W('115', 0)} text="IN FRANCE." size={48} c="#3d6fd6" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 116-119 teleportation is technically real */
const QuantumShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	const t0 = W('118', 0);
	if (f < t0 - 4) {
		return (
			<AbsoluteFill>
				<Card tint="#101a3a">
					<g transform={`translate(960,600) scale(${1 + f * 0.003})`}>
						<circle r={220} fill="none" stroke={LIME} strokeWidth={6} strokeDasharray="20 16" transform={`rotate(${f * 2})`} />
						<Star x={0} y={0} r={110} rot={f * 2} />
					</g>
				</Card>
				<Slam t={f - W('116', 'wild')} words={['SOMETHING', 'WILD']} top={140} size={100} life={W('117', 0) - W('116', 'wild')} />
				<Slam t={f - W('117', 0)} words={['TELEPORTATION', 'IS', 'REAL']} top={140} size={100} />
			</AbsoluteFill>
		);
	}
	return <Quantum t={f - t0} ts={[W('118', 'teleported') - t0, W('119', 0) - t0, 10]} />;
};
const PhotonShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <PhotonPizza t={f} t2={W('121', 0)} />;
};

/* 122-123 every superpower has a price. yours is paperwork */
const Price: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const t2 = W('123', 'paperwork');
	return (
		<AbsoluteFill>
			<Card tint="#3a2a10">
				{f > t2
					? Array.from({length: 24}).map((_, i) => {
							const y = ((f - t2) * (10 + (i % 5) * 2) + i * 47) % 1300 - 200;
							return (
								<g key={i} transform={`translate(${(i * 173) % 1920},${y}) rotate(${(gf * (i % 2 ? 3 : -3) + i * 40) % 360})`}>
									<rect x={-50} y={-66} width={100} height={132} fill="#fbfaf4" stroke="#c9b48a" strokeWidth={3} />
									{[0, 1, 2, 3].map((j) => (
										<rect key={j} x={-36} y={-46 + j * 22} width={72} height={6} fill="#9a9384" />
									))}
								</g>
							);
						})
					: null}
			</Card>
			<Slam t={f - 4} words={['EVERY', 'SUPERPOWER', 'HAS', 'A', 'PRICE']} top={260} size={90} life={t2 - 2} hl={4} c="#ffd34a" />
			<Slam t={f - t2} words={['PAPERWORK.']} top={420} size={170} c="#ffd34a" />
		</AbsoluteFill>
	);
};
const Passport: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <PassportPages t={f} t2={W('125', 'zero')} />;
};

export const SHOTS1: ShotDef[] = [
	{at: '001', C: Alarm},
	{at: '003', C: Panic},
	{at: '005', C: Squeeze},
	{at: '006', C: Hallway, whip: true},
	{at: '008', C: Janitor},
	{at: '013', C: Exam, whip: true},
	{at: '015', C: LastNormal},
	{at: '017', C: Teaser, whip: true},
	{at: '021', C: Title},
	{at: '022', C: Testing, whip: true},
	{at: '026', C: Rule1},
	{at: '029', C: Maldives, whip: true},
	{at: '032', C: ShowerShot},
	{at: '033', C: NotePage},
	{at: '035', C: Rule2, whip: true},
	{at: '039', C: FieldWash, whip: true},
	{at: '041', C: Rule3, whip: true},
	{at: '044', C: SamSick, whip: true},
	{at: '046', C: Rule4, whip: true},
	{at: '047', C: LakeThink},
	{at: '048', C: LakeRun, whip: true},
	{at: '052', C: GlobeShot, whip: true},
	{at: '059', C: Speed},
	{at: '062', C: Hops, whip: true},
	{at: '064', C: NapkinShot, whip: true},
	{at: '068', C: Convenient, whip: true},
	{at: '069', C: CommuteShot},
	{at: '073', C: NeverLate, whip: true},
	{at: '078', C: PizzaRun, whip: true},
	{at: '081', C: PizzaGuy},
	{at: '084', C: SleepIn, whip: true},
	{at: '088', C: ParisMap, whip: true},
	{at: '090', C: BlindLandings, whip: true},
	{at: '093', C: Bridge, whip: true},
	{at: '095', C: Croissants},
	{at: '099', C: BackInBed, whip: true},
	{at: '100', C: Stickers, whip: true},
	{at: '103', C: Sunsets, whip: true},
	{at: '106', C: JetLag, whip: true},
	{at: '110', C: MathClass, whip: true},
	{at: '116', C: QuantumShot, whip: true},
	{at: '120', C: PhotonShot},
	{at: '122', C: Price, whip: true},
	{at: '124', C: Passport},
];
