import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {Pose, Stickman} from '../engine/Stickman';
import {SIT, env, gesture, idle, reach, walkTo} from '../kit/actions';
import {useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, mixCam} from '../kit/kit';
import {Kitchen, KitchenTable} from '../kit/sets';
import {Bubble, FONT, HAND, PhoneChat} from '../kit/ui';
import {Chair} from '../engine/props';
import {CAST, LIME} from './cast';
import {FL, Hero, Person, headY, usePushOn, PhoneItem, Lemon} from './common';
import {HopArc, Onoma, PopBurst, Slam, Star, Tag, useW} from './fx';
import {Sky, Hills, Ground, ParisBridge, ParisFar, Alley, DoorWall, CareRoom, Village, CliffSea, LemonTree, Terrace, Steps, Hedge} from './places';
import {Card, HopMap, Question, Unlocked, Viral} from './boards';

const k01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
const KNEEL: Pose = {lean: 0, head: -6, armB: [-10, 20], armF: [80, 10], legB: [0, 95], legF: [85, 88]};

/* 126-129 careless: pop onto the bridge at noon behind a proposal; her phone notices */
const Proposal: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = W('127', 'pop');
	const ph = W('129', 0);
	const cam = mixCam(camOn(1000, 560, 1.1), camOn(1180, 520, 1.55), k01(f, ph - 6, ph + 14));
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#8fd0f6" light={{x: 50, y: 0, o: 0.45}}>
				<Layer depth={2.4}>
					<Sky k="noon" f={gf} sun={[960, 90]} id="pn" />
				</Layer>
				<Layer depth={1.8}>
					<ParisFar k="day" />
				</Layer>
				<Layer depth={1.2}>
					<ParisBridge f={gf} k="noon" />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Person who="boyfriend" x={1150} seat={FL - 120} pose={KNEEL} facing={-1} look={[-0.6, -0.4]} mouth="smile" handItem={<circle cx={0} cy={-6} r={10} fill="none" stroke="#ffd34a" strokeWidth={5} />} />
						<Person who="girlpro" x={760} pose={{...idle(gf, 30), armF: [110, 20]}} look={[0.7, 0]} handItem={<PhoneItem glow />} mouth="open" />
						<Hero x={1420} pose={idle(gf, 31)} inAt={tin} facing={-1} look={[-0.5, 0]} />
						<PopBurst f={f} t0={tin} x={1420} y={headY() + 120} s={0.8} />
						{f > ph ? (
							<g opacity={k01(f, ph, ph + 8)}>
								<rect x={900} y={300} width={700} height={520} rx={20} fill="none" stroke="#fff" strokeWidth={6} />
								<circle cx={940} cy={340} r={12} fill="#ff2b2b" opacity={Math.floor(gf / 10) % 2} />
								<text x={965} y={350} fontSize={30} fontFamily={FONT} fill="#fff">
									REC
								</text>
								<rect x={1330} y={380} width={160} height={240} fill="none" stroke={LIME} strokeWidth={5} strokeDasharray="16 10" />
							</g>
						) : null}
						<Tag x={1420} y={300} t={f - W('128', 0)} text="SHE DOESN'T NOTICE" size={34} life={ph - W('128', 0)} />
						<Tag x={1180} y={220} t={f - ph} text="HER PHONE DOES." size={46} c="#ff5a4a" />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - 2} words={['THEN', 'YOU', 'GET', 'CARELESS']} top={100} size={84} life={tin - 4} c="#ff6a5a" />
		</AbsoluteFill>
	);
};

const ViralShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Viral t={f} ts={{views: W('130', '14') - 10, circle: W('133', 0), arrow: W('134', 0), fake: W('135', 0), who: W('136', 0)}} />;
};

/* 137-140 Sam texts you */
const Chat: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	return (
		<Card tint="#14324a">
			<PhoneChat t={f} title="Sam 🍟" x={700} y={560} s={1} msgs={[
				{at: W('138', 0), from: 'Sam', text: 'Bro, is that your hoodie?'},
				{at: W('139', 0), from: 'me', me: true, text: 'Lots of people have that hoodie.', reads: 1},
				{at: W('140', 0), from: 'Sam', text: 'It has MY KETCHUP STAIN on it.'},
			]} />
			<Stickman id="chat-h" x={1400} y={760} scale={1.3} pose={gesture('facepalm', idle(gf, 32), env(f, W('140', 'ketchup'), 999), gf)} {...CAST.hero} look={[-0.5, 0]} faceTurn={0.4} facing={-1} expr={f > W('140', 0) ? 'worried' : 'normal'} mouth={f > W('140', 0) ? 'frown' : 'smirk'} armOver={f > W('140', 'ketchup')} />
			{f > W('140', 'ketchup') ? <ellipse cx={1420} cy={600} rx={20} ry={14} fill="#c42b2b" /> : null}
		</Card>
	);
};

/* 141-143 knock at the door: a woman in a gray suit; she doesn't smile */
const Knock: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const kn = W('141', 'knock');
	const open = k01(f, W('142', 0) - 6, W('142', 0) + 10);
	const shake = f > kn && f < kn + 20 ? Math.sin(f * 2.5) * 6 : 0;
	const w = walkTo(f, kn + 10, W('142', 0) - 4, 300, 640, 33, 0.3);
	const cam = mixCam(camOn(900, 560, 1.15), camOn(960, 520, 1.6), k01(f, W('142', 0), W('143', 0)));
	return (
		<Stage cam={cam} bg="#e7d3b0" light={{x: 60, y: 10, o: 0.4}}>
			<Layer depth={1.3}>
				<Svg>
					<g transform={`translate(${shake},0)`}>
						<DoorWallInner open={open} />
					</g>
				</Svg>
			</Layer>
			<Layer depth={1.25}>
				<Svg>{open > 0.5 ? <Person who="hale" x={960} s={1.02} pose={{...idle(gf, 34), armF: [6, 10]}} mouth="flat" expr="angry" look={[-0.5, 0]} facing={-1} /> : null}</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={w.x} pose={w.pose} vx={w.vx} bob={w.bob} look={[0.6, 0]} expr={open > 0.5 ? 'wide' : 'normal'} />
					<Onoma x={1060} y={380} t={f - kn} text="KNOCK KNOCK" size={64} c="#fff" life={34} />
					<Tag x={960} y={180} t={f - W('141', 'three')} text="3 WEEKS LATER" size={40} life={kn - W('141', 'three') + 10} />
					<Tag x={1250} y={300} t={f - W('142', 'gray')} text="GRAY SUIT" size={38} />
					<Tag x={1250} y={380} t={f - W('143', 0)} text="NO SMILE" size={38} c="#ff6a5a" />
				</Svg>
			</Layer>
		</Stage>
	);
};
const DoorWallInner: React.FC<{open: number}> = ({open}) => (
	<g>
		<DoorWall open={open} />
	</g>
);

/* kitchen table conversation with Agent Hale (144-148, 153-158, 163-165) */
const HaleTalk: React.FC<{part: 1 | 2 | 3}> = ({part}) => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const HX = 640;
	const AX = 1300;
	let hp: Pose = idle(gf, 35);
	let ap: Pose = idle(gf, 36);
	let card = -1;
	if (part === 1) {
		ap = gesture('point', ap, env(f, W('145', 0), W('146', 0) + 20, 6, 8), gf);
		card = k01(f, W('148', 'slides'), W('148', 'slides') + 30);
		ap = reach(ap, 'F', [-60 - 300 * card, -80], env(f, W('148', 'slides') - 6, W('148', 'slides') + 34, 6, 8));
		hp = gesture('scratch', hp, env(f, W('147', 'pizza'), 999), gf);
	} else if (part === 2) {
		ap = gesture('presentF', ap, env(f, W('153', 0), W('154', 0) + 30), gf);
		hp = gesture('think', hp, env(f, W('155', 0), 999), gf);
	} else {
		hp = gesture('rubChin', hp, env(f, W('163', 0), W('164', 0)), gf);
		ap = gesture('point', ap, env(f, W('164', 0), W('165', 0) + 30), gf);
	}
	const leave = part === 3 ? walkTo(f, W('165', 'video') + 4, W('165', 'video') + 60, AX, 2300, 37, 0.32) : null;
	const ax = leave ? leave.x : AX;
	const cam = sp === 'HALE' ? camOn(AX - 40, 540, 1.7) : sp === 'HERO' ? camOn(HX + 40, 540, 1.7) : camOn(970, 580, 1.15);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#f3e6c4" light={{x: 70, y: 10, o: 0.35}}>
				<Layer depth={1.4}>
					<Kitchen />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero x={HX} pose={hp} look={[0.6, 0]} mouth={part === 2 ? 'flat' : undefined} expr={part === 2 && f > W('157', 0) ? 'worried' : 'normal'} />
						<Person who="hale" x={ax} facing={leave && leave.moving ? 1 : -1} pose={leave && leave.moving ? leave.pose : ap} vx={leave?.vx} bob={leave?.bob} look={[-0.6, 0]} mouth="flat" handF={part !== 2 ? 'point' : undefined} />
					</Svg>
				</Layer>
				<Layer depth={0.92}>
					<KitchenTable mugs={1} />
					<Svg>
						{card >= 0 && f > W('148', 'slides') - 2 ? (
							<g transform={`translate(${1100 - 300 * card},700) rotate(${-8 + 16 * card})`}>
								<rect x={-60} y={-14} width={120} height={28} rx={4} fill="#fbfaf4" stroke="#2b2f3a" strokeWidth={2} />
								<text y={8} textAnchor="middle" fontSize={16} fontFamily={FONT} fill="#2b2f3a">
									A. HALE · ███
								</text>
							</g>
						) : null}
						{part === 1 ? (
							<>
								<Tag x={AX} y={220} t={f - W('144', 'agent')} text="AGENT HALE" size={44} c="#9aa3b5" />
								<Tag x={960} y={150} t={f - W('146', 0)} text="0 STAMPS" size={44} c="#ff5a4a" life={W('147', 'pizza') - W('146', 0)} />
								<Tag x={960} y={150} t={f - W('147', 'paris')} text="PARIS → NAPLES: 40 MIN" size={42} c="#ffd34a" />
							</>
						) : null}
						{part === 2 ? (
							<>
								<Tag x={960} y={160} t={f - W('157', 0)} text="EVERY VAULT HAS A DOOR" size={42} life={W('158', 0) - W('157', 0)} />
								<Tag x={960} y={160} t={f - W('158', 0)} text="YOU DON'T NEED DOORS" size={48} c={LIME} />
							</>
						) : null}
						{part === 3 ? <Tag x={AX} y={220} t={f - W('164', 0)} text="THINK FAST." size={50} c="#ff6a5a" /> : null}
					</Svg>
				</Layer>
			</Stage>
			{part === 2 ? <Slam t={f - W('155', 0)} words={['THE', 'SCARY', 'PART:', "SHE'S", 'RIGHT.']} top={860} size={70} life={W('157', 0) - W('155', 0)} c="#ff6a5a" /> : null}
		</AbsoluteFill>
	);
};
const Hale1: React.FC = () => <HaleTalk part={1} />;
const Hale2: React.FC = () => <HaleTalk part={2} />;
const Hale3: React.FC = () => <HaleTalk part={3} />;

const UnlockShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return (
		<AbsoluteFill>
			<Unlocked t={f} ts={[W('150', 'vaults'), W('150', 'server'), W('150', 'borders')]} />
			<Slam t={f - W('152', 'worse')} words={['MUCH', 'WORSE', 'THAN', 'PAY']} top={900} size={70} c="#ff5a4a" />
		</AbsoluteFill>
	);
};

/* 159-162 billionaire by Friday — but every dollar belongs to somebody — you're a tool */
const Billionaire: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const red = f > W('160', 'belongs');
	const tool = W('161', 0);
	const n = Math.round(interpolate(f, [4, W('160', 0)], [0, 1e9], {...clamp, easing: (t) => t * t * t}));
	const pull = f > tool ? Math.sin(gf / 6) : 0;
	return (
		<AbsoluteFill>
			<Card tint={red ? '#3a1010' : '#3a3010'}>
				{Array.from({length: 40}).map((_, i) => {
					const y = ((f * (8 + (i % 4) * 3) + i * 61) % 1300) - 150;
					return (
						<g key={i} transform={`translate(${(i * 149) % 1920},${y}) rotate(${gf * 5 + i * 30})`}>
							<ellipse rx={26} ry={26} fill={red ? '#c42b2b' : '#ffd34a'} stroke={red ? '#7a1010' : '#c9962a'} strokeWidth={4} />
							<text y={10} textAnchor="middle" fontSize={28} fontFamily={FONT} fontWeight={900} fill={red ? '#fff' : '#8a6a1a'}>
								$
							</text>
						</g>
					);
				})}
				{f > tool
					? [-60, 0, 60].map((dx, i) => <line key={i} x1={960 + dx * 3} y1={0} x2={960 + dx + Math.sin(gf / 6 + i) * 10} y2={480 + i * 40 + pull * 10} stroke="#e8e4d8" strokeWidth={3} />)
					: null}
				<Stickman id="bil" x={960} y={760 - 157 * 1.3} scale={1.3} pose={f > tool ? {...idle(gf, 38), armF: [100 + pull * 40, 20], armB: [-100 - pull * 40, 20], head: pull * 10} : {...idle(gf, 39), armF: [150, 30], armB: [-150, 30]}} {...CAST.hero} look={[0, -0.5]} faceTurn={0.1} mouth={f > tool ? 'frown' : 'open'} expr={red ? 'worried' : 'wide'} />
				<text x={960} y={980} textAnchor="middle" fontSize={90} fontFamily={FONT} fontWeight={900} fill={red ? '#ff6a5a' : '#ffd34a'}>
					${n.toLocaleString('en-US')}
				</text>
			</Card>
			<Slam t={f - 4} words={['BILLIONAIRE', 'BY', 'FRIDAY']} top={80} size={84} life={W('160', 0) - 4} c="#ffd34a" hl={0} />
			<Slam t={f - W('160', 'belongs')} words={['BELONGS', 'TO', 'SOMEBODY']} top={80} size={84} life={tool - W('160', 'belongs')} c="#ff6a5a" hl={0} />
			<Slam t={f - W('162', 0)} words={["YOU'RE", 'A', 'TOOL.']} top={80} size={110} c="#ff6a5a" />
		</AbsoluteFill>
	);
};

/* 166-170 so now you hide: alleys, over your shoulder */
const Hide: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = W('168', 'back') - 4;
	const look = f > W('169', 0) && f < W('170', 0) ? (Math.floor((f - W('169', 0)) / 18) % 2 ? 1 : -1) : 1;
	const wide = k01(f, W('170', 0), W('170', 0) + 60);
	const cam = mixCam(camOn(800, 560, 1.6), camOn(960, 560, 1.0), wide);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#1b1f33" light={{night: true, x: 20, y: 10, o: 0.35}}>
				<Layer depth={1.3}>
					<Alley f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero x={800} pose={{...idle(gf, 40), lean: -4, head: look * 4}} facing={look as 1 | -1} inAt={tin} hood expr="worried" mouth="flat" look={[look * 0.8, 0]} />
						<PopBurst f={f} t0={tin} x={800} y={headY() + 120} s={0.6} c="#7f9cff" />
						<Tag x={1300} y={240} t={f - W('168', 'bathrooms')} text="BATHROOMS · BACK ALLEYS" size={36} c="#7f9cff" life={W('170', 0) - W('168', 'bathrooms')} />
						<Tag x={960} y={200} t={f - W('170', 'nowhere')} text="NOWHERE FEELS SAFE" size={48} c="#ff6a5a" />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - 2} words={['SO', 'NOW', 'YOU', 'HIDE']} top={110} size={96} life={W('167', 0) + 20} c="#7f9cff" />
			<Slam t={f - W('167', 0)} words={['NO', 'MORE', 'BRIDGES', 'AT', 'NOON']} top={110} size={70} life={tin - W('167', 0)} c="#ff6a5a" />
		</AbsoluteFill>
	);
};

const Q1: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Question t={f - W('172', 0) + 6} lines={['IF YOU COULD TELEPORT RIGHT NOW,', 'WHERE WOULD YOU GO FIRST?']} sub="DROP IT IN THE COMMENTS ↓" tSub={W('173', 0) - W('172', 0) + 6} />;
};

/* 175-178 care home, grandma Rosa, 900 km, every Sunday */
const CareHome: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = W('178', 'visit') - 6;
	const cam = mixCam(camOn(1000, 580, 1.1), camOn(1050, 560, 1.4), k01(f, W('176', 0), W('177', 0)));
	return (
		<Stage cam={cam} bg="#dbe8e2" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.4}>
				<CareRoom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chair x={1150} y={800} facing={-1} />
					<Person who="grandma" x={1150} seat={790} facing={-1} pose={{...SIT, armF: [40, 80], armB: [30, 80], head: 4 + Math.sin(gf / 40) * 3}} look={[-0.4, 0.2]} mouth="smile" blink={0} />
					<Hero x={760} pose={gesture('wave', idle(gf, 41), env(f, tin + 10, tin + 50), gf)} inAt={tin} look={[0.6, 0]} />
					<PopBurst f={f} t0={tin} x={760} y={headY() + 120} s={0.6} />
					<Tag x={420} y={180} t={f - W('175', 'care')} text="SUNNY HILLS CARE HOME" size={36} />
					<Tag x={1150} y={300} t={f - W('176', 'rosa')} text="GRANDMA ROSA" size={44} c="#b48ad8" />
					<Tag x={1150} y={390} t={f - W('176', '900')} text="900 KM AWAY" size={36} />
					<Tag x={700} y={240} t={f - W('177', 'twice')} text="BEFORE: 2× A YEAR" size={38} life={W('178', 0) - W('177', 'twice')} />
					<Tag x={700} y={240} t={f - W('178', 'every')} text="NOW: EVERY SUNDAY" size={42} c={LIME} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const SundayMap: React.FC = () => {
	const {f} = useShot();
	return <HopMap t={f} hops={18} km="900 KM" title="EVERY SUNDAY · NOBODY ASKS" tIn={2} />;
};

/* 181-184 dementia: she calls you the nice boy; one thing she never forgets */
const Dementia: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const cam = usePushOn(1000, 520, 1.55, 1.8, 0, 0);
	return (
		<Stage cam={cam} bg="#dbe8e2" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.6}>
				<CareRoom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chair x={1150} y={800} facing={-1} />
					<Person who="grandma" x={1150} seat={790} facing={-1} pose={{...SIT, armF: [60, 70], armB: [30, 80]}} look={[-0.6, 0]} mouth="smile" expr={f < W('184', 0) ? 'worried' : 'normal'} />
					<Hero x={820} seat={790} pose={{...SIT, armF: [50, 70]}} look={[0.6, 0]} mouth="flat" />
					<Chair x={820} y={800} />
					<Tag x={960} y={200} t={f - W('181', 'dementia')} text="DEMENTIA" size={46} c="#b48ad8" life={W('182', 0) + 30 - W('181', 'dementia')} />
					<g opacity={f > W('182', 'name') ? 1 : 0}>
						<Bubble x={1150} y={300} w={150} h={110} t={f - W('182', 'name')} thought tail={[0, 90]}>
							<text y={22} textAnchor="middle" fontSize={70} fontFamily={FONT} fontWeight={900} fill="#2b2f3a">
								?
							</text>
						</Bubble>
					</g>
					<Tag x={820} y={260} t={f - W('183', 'nice')} text="“THE NICE BOY”" size={40} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 185-189 a lemon tree: memory of a village on a cliff, her father, left at 17, 63 years */
const Memory: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const leave = walkTo(f, W('188', 0), W('188', 0) + 70, 760, -250, 42, 0.3);
	const kidX = f > W('188', 0) ? leave.x : 760;
	const cam = usePushOn(1000, 520, 1.0, 1.2, 60, -20);
	return (
		<AbsoluteFill style={{filter: 'sepia(0.55) saturate(1.1)'}}>
			<Stage cam={cam} bg="#f6d8a0" light={{x: 30, y: 10, o: 0.5}}>
				<Layer depth={2.4}>
					<Sky k="warm" f={gf} sun={[300, 200]} id="mem" />
				</Layer>
				<Layer depth={1.8}>
					<CliffSea f={gf} />
				</Layer>
				<Layer depth={1.4}>
					<Village f={gf} />
				</Layer>
				<Layer depth={1.1}>
					<Terrace />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<LemonTree x={1300} y={900} s={f > W('187', 'planted') ? 0.75 : 0.75} f={gf} />
						{f > W('187', 'father') && f < W('188', 0) ? <Person who="oldman" x={1060} pose={gesture('presentF', idle(gf, 43), 1, gf)} facing={1} look={[0.5, -0.3]} mouth="smile" /> : null}
						<Person who="kid" x={kidX} s={0.75} pose={f > W('188', 0) ? leave.pose : idle(gf, 44)} facing={f > W('188', 0) ? -1 : 1} vx={leave.vx} bob={leave.bob} look={[0.5, -0.3]} />
						<Tag x={700} y={200} t={f - W('186', 'italy')} text="SOUTH OF ITALY" size={44} />
						<Tag x={1300} y={300} t={f - W('187', 'father')} text="PLANTED BY HER FATHER" size={36} />
						<Tag x={500} y={300} t={f - W('188', '17')} text="AGE 17" size={44} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('185', 'lemon')} words={['A', 'LEMON', 'TREE']} top={90} size={100} c="#ffe03a" life={W('186', 0) - W('185', 'lemon') + 10} />
			<Slam t={f - W('189', 0)} words={['63', 'YEARS']} top={380} size={170} c="#ffe03a" />
		</AbsoluteFill>
	);
};

/* 190-192 the lemons were as big as your fist; every single Sunday; I'd give anything */
const GrandmaTalk: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const fist = env(f, W('190', 'fist') - 8, W('191', 0), 6, 10);
	const dream = f > W('192', 0);
	const cam = usePushOn(1120, 560, 1.75, 2.05, -20, 0);
	return (
		<Stage cam={cam} bg="#dbe8e2" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.6}>
				<CareRoom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Chair x={1150} y={800} facing={-1} />
					<Person who="grandma" x={1150} seat={790} facing={-1} pose={{...SIT, armF: [60 + 70 * fist, 80 - 60 * fist], armB: [30, 80]}} handF={fist > 0.5 ? 'fist' : undefined} look={[-0.4, -0.3]} lidL={dream ? 0.8 : 0} lidR={dream ? 0.8 : 0} mouth="smile" />
					<Bubble x={900} y={330} w={220} h={170} t={f - W('190', 'lemons')} thought tail={[120, 110]}>
						<Lemon s={3} />
					</Bubble>
					<Tag x={1150} y={180} t={f - W('191', 0)} text="EVERY. SINGLE. SUNDAY." size={40} c="#b48ad8" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 193-195 too weak to travel: airport, plane, hours in a car */
const TooWeak: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	const ic: [string, string][] = [
		['airport', 'AIRPORT'],
		['plane', 'PLANE'],
		['car', 'HOURS IN A CAR'],
	];
	return (
		<AbsoluteFill>
			<Card tint="#2a2a3a">
				<text x={960} y={160} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
					TOO WEAK TO TRAVEL
				</text>
				{ic.map(([w, l], i) => {
					const t = f - W('194', w);
					if (t < 0) return null;
					const k = Math.min(1, t / 8);
					const x = 420 + i * 540;
					return (
						<g key={i} transform={`translate(${x},540) scale(${0.6 + 0.4 * k})`} opacity={k}>
							<circle r={170} fill="#11142c" stroke="#5d6472" strokeWidth={8} />
							{i === 0 ? <path d="M-90,60 h180 v-80 h-40 v-40 h-100 v40 h-40 z" fill="#cfd6e6" /> : i === 1 ? <path d="M-120,0 L120,-20 Q150,0 120,20 L-120,0 M-20,-10 L-60,-90 L-30,-90 L40,-10 M-20,10 L-60,90 L-30,90 L40,10 M-110,-6 L-130,-50 L-110,-50 L-80,-4" fill="#cfd6e6" stroke="#cfd6e6" strokeWidth={10} /> : <g><rect x={-110} y={-40} width={220} height={70} rx={20} fill="#cfd6e6" /><circle cx={-60} cy={40} r={24} fill="#2b2f3a" /><circle cx={60} cy={40} r={24} fill="#2b2f3a" /></g>}
							<text y={250} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff">
								{l}
							</text>
							{t > 10 ? <path d="M-120,-120 L120,120 M120,-120 L-120,120" stroke="#ff4a4a" strokeWidth={22} strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - Math.min(1, (t - 10) / 8))} /> : null}
						</g>
					);
				})}
			</Card>
			<Slam t={f - W('195', 0)} words={['TOO', 'MUCH.']} top={880} size={90} c="#ff6a5a" />
		</AbsoluteFill>
	);
};

/* 196-197 the nurse tells your mom in the hallway; you hear it anyway */
const Overhear: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const cam = mixCam(camOn(760, 560, 1.4), camOn(1350, 540, 1.7), k01(f, W('197', 0) - 6, W('197', 0) + 10));
	return (
		<Stage cam={cam} bg="#dbe8e2" light={{x: 30, y: 10, o: 0.4}}>
			<Layer depth={1.4}>
				<Svg>
					<rect x={-600} y={-400} width={3100} height={1400} fill="#cfe0d8" />
					<rect x={-600} y={600} width={3100} height={10} fill="#a9c4b8" />
					<rect x={-600} y={900} width={3100} height={600} fill="#b8a888" />
					{[200, 1700].map((x) => (
						<rect key={x} x={x} y={300} width={240} height={600} fill="#e8eef0" stroke="#9ab" strokeWidth={8} />
					))}
					<rect x={1180} y={-400} width={60} height={1300} fill="#a9c4b8" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Person who="nurse" x={620} pose={gesture('presentF', idle(gf, 45), env(f, W('196', 0), 999), gf)} look={[0.6, 0]} facing={1} mouth="frown" />
					<Person who="mom" x={880} facing={-1} pose={gesture('facepalm', idle(gf, 46), env(f, W('196', 'time'), 999), gf)} armOver expr="sad" look={[-0.6, 0.3]} />
					<Hero x={1360} facing={-1} pose={{...idle(gf, 47), lean: -10, head: -8}} expr="sad" mouth="frown" look={[-1, 0]} />
					<Tag x={760} y={250} t={f - W('196', 'much')} text="NOT MUCH TIME" size={44} c="#ff6a5a" />
				</Svg>
			</Layer>
			<Layer depth={0.85}>
				<Svg>
					<rect x={1160} y={-400} width={90} height={1500} fill="#9ab8aa" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 198-202 blind hops land a few hundred meters off: on a cliff that means the sea */
const CliffRisk: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const t0 = W('198', 'blind');
	const dots = Array.from({length: 9}).map((_, i) => ({x: 900 + (random('cr' + i) - 0.5) * 1100, at: t0 + 12 + i * 6}));
	return (
		<AbsoluteFill>
			<Card tint="#123a5a" grid={false}>
				<rect x={0} y={640} width={1920} height={440} fill="#2a8fd0" />
				<path d="M0,1080 L0,420 L700,420 Q760,430 780,520 L860,640 L1080,640 Q1060,560 1120,480 L1200,420 L1920,420 L1920,1080 Z" fill="#c9a77a" />
				<rect x={0} y={400} width={700} height={24} fill="#7fbf5a" />
				<rect x={1200} y={400} width={720} height={24} fill="#7fbf5a" />
				<g transform="translate(1500,400) scale(0.45)">
					<LemonTree x={0} y={0} f={gf} />
				</g>
				{dots.map((d, i) => {
					const t = f - d.at;
					if (t < 0) return null;
					const sea = d.x > 760 && d.x < 1180;
					const y = sea ? 700 : 400;
					return (
						<g key={i}>
							<HopArc a={[200, 400]} b={[d.x, y]} k={Math.min(1, t / 8)} h={280} c={sea ? '#ff5a4a' : LIME} w={4} />
							{t > 8 ? sea ? <path d={`M${d.x - 20},${y - 20} l40,40 M${d.x + 20},${y - 20} l-40,40`} stroke="#ff4a4a" strokeWidth={10} strokeLinecap="round" /> : <circle cx={d.x} cy={y} r={12} fill={LIME} /> : null}
						</g>
					);
				})}
				<Stickman id="cr-h" x={200} y={400 - 157 * 0.6} scale={0.6} pose={idle(gf, 48)} {...CAST.hero} look={[0.6, 0]} faceTurn={0.4} />
				<Stickman id="cr-g" x={290} y={400 - 157 * 0.55} scale={0.55} pose={idle(gf, 49)} {...CAST.grandma} look={[0.6, 0]} faceTurn={0.4} />
				<text x={960} y={140} textAnchor="middle" fontSize={56} fontFamily={FONT} fontWeight={900} fill="#fff">
					A FEW HUNDRED METERS OFF = THE SEA
				</text>
			</Card>
			<Slam t={f - W('200', 0)} words={['NOT', 'WITH', 'GRANDMA.']} top={880} size={80} life={W('201', 'every') - W('200', 0)} c="#ff6a5a" />
			<Slam t={f - W('201', 'every')} words={['EVERY', 'LANDING:', 'PERFECT']} top={880} size={80} life={W('202', 0) - W('201', 'every')} />
			<Slam t={f - W('202', 0)} words={['SEE', 'THE', 'TREE', 'YOURSELF']} top={880} size={80} c="#ffe03a" />
		</AbsoluteFill>
	);
};

/* 203-206 the slow way: savings, two trains, a bus, a ferry, two days */
const SlowWay: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const items: [string, number, string][] = [
		['two', 0, 'TRAIN'],
		['trains', 1, 'TRAIN'],
		['bus', 2, 'BUS'],
		['ferry', 3, 'FERRY'],
	];
	const icon = (k: number) =>
		k === 3 ? (
			<g>
				<path d="M-110,10 L110,10 L80,60 L-80,60 Z" fill="#e8ecf4" />
				<rect x={-50} y={-40} width={100} height={50} fill="#d94a3a" />
				<path d={`M-160,70 q40,-14 80,0 t80,0 t80,0 t80,0`} stroke="#7fd0ff" strokeWidth={6} fill="none" transform={`translate(${Math.sin(gf / 6) * 10},0)`} />
			</g>
		) : k === 2 ? (
			<g>
				<rect x={-120} y={-60} width={240} height={110} rx={20} fill="#ffd34a" />
				{[0, 1, 2, 3].map((i) => (
					<rect key={i} x={-100 + i * 52} y={-44} width={40} height={36} rx={6} fill="#7fd0ff" />
				))}
				<circle cx={-70} cy={54} r={22} fill="#2b2f3a" />
				<circle cx={70} cy={54} r={22} fill="#2b2f3a" />
			</g>
		) : (
			<g>
				<rect x={-130} y={-60} width={260} height={100} rx={40} fill={k ? '#3d6fd6' : '#d94a3a'} />
				{[0, 1, 2, 3].map((i) => (
					<rect key={i} x={-100 + i * 54} y={-40} width={40} height={30} rx={6} fill="#cfe6ff" />
				))}
				<rect x={-140} y={46} width={280} height={8} fill="#2b2f3a" />
			</g>
		);
	return (
		<AbsoluteFill>
			<Card tint="#2a3a1a">
				<text x={960} y={150} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
					THE SLOW WAY
				</text>
				<line x1={200} y1={560} x2={1720} y2={560} stroke="#fff" strokeWidth={6} strokeDasharray="20 16" opacity={0.4} />
				{items.map(([w, k, l], i) => {
					const t = f - W('205', w);
					if (t < 0) return null;
					const kk = Math.min(1, t / 8);
					return (
						<g key={i} transform={`translate(${330 + i * 420},${560 + (1 - kk) * 80}) scale(${kk})`}>
							{icon(k)}
							<text y={170} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff">
								{l}
							</text>
						</g>
					);
				})}
				{f > W('204', 'savings') ? (
					<g transform="translate(1680,260)">
						<ellipse rx={80} ry={60} fill="#f2a8c4" />
						<text y={16} textAnchor="middle" fontSize={50} fontFamily={FONT} fontWeight={900} fill="#c42b6b">
							$0
						</text>
					</g>
				) : null}
			</Card>
			<Slam t={f - W('204', 'savings')} words={['YOUR', 'SAVINGS']} top={880} size={74} life={W('205', 0) - W('204', 'savings')} c="#f2a8c4" />
			<Slam t={f - W('206', 0)} words={['2', 'DAYS']} top={850} size={130} c="#ffd34a" />
		</AbsoluteFill>
	);
};

/* 207-209 a hundred steps up a cliff; a very confused old man; Rosa? lemon tree? big lemons? */
const StepsShot: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const floorAt = (x: number) => 1000 - ((x + 600) / 60) * 40;
	const climb = interpolate(f, [0, W('207', 'ask') - 4], [-300, 520], clamp);
	const hx = climb;
	const ox = 780;
	const hp: Pose = f < W('207', 'ask') - 4 ? {...idle(gf, 50), legF: [40 + Math.sin(gf / 4) * 30, 60], legB: [-10, 30], lean: 10} : gesture('fist', gesture('shrug', idle(gf, 51), env(f, W('208', 0), W('209', 0)), gf), env(f, W('209', 0), 999), gf);
	const cam = sp === 'HERO' ? camOn(hx + 100, floorAt(hx) - 340, 1.6) : camOn(hx + 120, floorAt(hx) - 280, 1.2);
	return (
		<Stage cam={cam} bg="#c9a77a" light={{x: 30, y: 0, o: 0.45}}>
			<Layer depth={1.2}>
				<Steps />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={hx} fl={floorAt(hx)} pose={hp} look={[0.6, -0.2]} handF={f > W('209', 0) ? 'fist' : undefined} mouth={f > W('207', 'rosa') ? undefined : 'flat'} />
					{f > W('207', 'old') - 20 ? <Person who="oldman" x={ox} fl={floorAt(ox)} facing={-1} pose={gesture('scratch', idle(gf, 52), env(f, W('208', 0), 999), gf)} look={[-0.6, 0.2]} expr="worried" mouth="frown" /> : null}
					<Tag x={hx} y={floorAt(hx) - 500} t={f - W('207', 'hundred')} text="100 STEPS" size={40} life={W('207', 'old') - W('207', 'hundred')} />
					<Tag x={ox} y={floorAt(ox) - 470} t={f - W('207', 'confused')} text="???" size={50} c="#ffd34a" />
					<Tag x={hx - 40} y={floorAt(hx) - 470} t={f - W('207', 'terrible')} text="TERRIBLE ITALIAN" size={34} life={W('208', 0) - W('207', 'terrible')} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 210-218 behind an empty house: the tree. huge. ancient. lemons. ten minutes memorizing it */
const TreeReveal: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const rv = W('211', 0);
	const w = walkTo(f, 0, rv, 100, 640, 53, 0.3);
	const ow = walkTo(f, 0, rv, 300, 900, 54, 0.3);
	const mem = W('215', 0);
	const shut = f > mem + 20 && f < W('216', 0) ? 1 : 0;
	const cam = f < rv ? camOn(500, 560, 1.2) : f < mem ? mixCam(camOn(1250, 420, 0.95), camOn(1300, 380, 1.05), k01(f, rv, mem)) : camOn(820, 520, 1.5);
	const smell = f > W('218', 0);
	return (
		<Stage cam={cam} bg="#9fd8f2" light={{x: 20, y: 10, o: 0.5}}>
			<Layer depth={2.4}>
				<Sky k="warm" f={gf} sun={[300, 180]} id="tr" />
			</Layer>
			<Layer depth={1.8}>
				<CliffSea f={gf} />
			</Layer>
			<Layer depth={1.1}>
				<Terrace />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<LemonTree x={1350} y={900} s={1.05} f={gf} glow={k01(f, rv, rv + 30)} />
					<Person who="oldman" x={ow.x} pose={f < rv ? ow.pose : gesture('presentF', idle(gf, 55), env(f, rv, rv + 60), gf)} vx={ow.vx} bob={ow.bob} look={[0.6, -0.2]} mouth="smile" />
					<Hero x={w.x} pose={f < rv ? w.pose : {...idle(gf, 56), head: -12}} vx={w.vx} bob={w.bob} look={[0.6, -0.8]} expr={f > rv && f < mem ? 'wide' : 'normal'} mouth={f > rv && f < mem ? 'open' : 'smile'} lidL={shut} lidR={shut} />
					{smell
						? [0, 1, 2].map((i) => <path key={i} d={`M${1200 - i * 40},${560 + i * 30} q-60,${-20 + Math.sin(gf / 6 + i) * 20} -120,0 t-120,0`} stroke="#ffe03a" strokeWidth={6} fill="none" opacity={0.8} />)
						: null}
					<Tag x={1350} y={120} t={f - W('212', 0)} text="HUGE." size={56} life={W('214', 0) - W('212', 0)} />
					<Tag x={1650} y={220} t={f - W('213', 0)} text="ANCIENT." size={56} life={W('214', 0) - W('213', 0)} />
					<Tag x={640} y={260} t={f - W('215', 'ten')} text="10 MINUTES" size={40} life={W('216', 0) - W('215', 'ten')} />
					<Tag x={640} y={260} t={f - W('216', 0)} text="EVERY LEAF" size={40} life={W('217', 0) - W('216', 0)} c="#7fcf5a" />
					<Tag x={640} y={260} t={f - W('217', 0)} text="THE BLUE SEA" size={40} life={W('218', 0) - W('217', 0)} c="#7fd0ff" />
					<Tag x={640} y={260} t={f - W('218', 0)} text="THE SMELL" size={40} c="#ffe03a" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 219-223 back for her: Sunday, a walk in the garden, behind the hedge, close your eyes */
const Garden: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const hand = W('222', 'hand');
	const shut = f > W('223', 'eyes') + 6 ? 1 : 0;
	const nurseWave = env(f, W('221', 0), W('222', 0), 6, 10);
	const cam = f < W('222', 0) ? camOn(900, 580, 1.1) : camOn(960, 520, 1.6);
	const hp = f > hand ? reach(idle(gf, 57), 'F', [70, -40], 1) : idle(gf, 58);
	const gp = f > hand ? reach({...idle(gf, 59), lean: 6}, 'F', [80, -40], 1) : {...idle(gf, 60), lean: 8};
	return (
		<Stage cam={cam} bg="#a8dcf6" light={{x: 30, y: 0, o: 0.45}}>
			<Layer depth={2.2}>
				<Sky k="day" f={gf} sun={[1600, 200]} id="gd" />
			</Layer>
			<Layer depth={1.4}>
				<Ground c="#7fcf5a" />
			</Layer>
			<Layer depth={1.05}>
				<Svg>{f < W('222', 0) ? <Person who="nurse" x={300} pose={gesture('wave', idle(gf, 61), nurseWave, gf)} look={[0.6, 0]} mouth="smile" /> : null}</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Hero x={880} pose={hp} look={[0.6, 0]} mouth="smile" />
					<Person who="grandma" x={1040} facing={-1} pose={gp} look={[-0.5, 0]} lidL={shut} lidR={shut} mouth="smile" />
					<Tag x={960} y={200} t={f - W('220', 0)} text="SUNDAY" size={50} life={W('221', 0) - W('220', 0)} />
					<Tag x={500} y={260} t={f - W('221', 'walk')} text="“JUST A WALK”" size={40} life={W('222', 0) - W('221', 'walk')} />
				</Svg>
			</Layer>
			<Layer depth={0.9}>
				<Svg>
					<g transform="translate(0,140)">
						<Hedge f={gf} />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};

const TinyMap: React.FC = () => {
	const {f} = useShot();
	return <HopMap t={f} hops={140} km="10 KM EACH" title="FOR HER: TINY HOPS" tIn={4} tiny label2="THE TREE" />;
};

/* 228-229 hold her hand the whole way, catch her every time */
const HoldHands: React.FC = () => {
	const {f, gf} = useShot();
	const step = 30;
	const n = Math.floor(f / step);
	const t0 = n * step;
	const st = env(f, t0 + 2, t0 + 14, 3, 8);
	const bgs = ['#7fcf5a', '#c9a77a', '#6cc24a', '#b8a888', '#7fcf5a', '#d8b884'];
	const cam = usePushOn(960, 560, 1.35, 1.5);
	return (
		<Stage cam={cam} bg="#a8dcf6" light={{x: 30, y: 0, o: 0.45}}>
			<Layer depth={2.2}>
				<Sky k="day" f={gf} sun={[1500, 200]} id="hh" />
			</Layer>
			<Layer depth={1.5}>
				<Hills id={'hh' + (n % 3)} c={bgs[n % 6]} far={bgs[(n + 2) % 6]} />
			</Layer>
			<Layer depth={1.2}>
				<Ground c={bgs[n % 6]} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g key={n}>
						<Hero x={900} pose={reach({...idle(gf, 62), lean: -6 * st}, 'F', [70, -40], 1)} look={[0.6, 0]} inAt={t0} mouth="smile" />
						<Person who="grandma" x={1040} facing={-1} pose={reach({...idle(gf, 63), lean: 8 + 10 * st}, 'F', [80, -40], 1)} lidL={1} lidR={1} inAt={t0} mouth="smile" />
					</g>
					<PopBurst f={f} t0={t0} x={970} y={headY() + 140} s={0.35} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 230-240 arrival at the tree: she opens her eyes, touches the trunk (Papa), the lemon, your name */
const Arrival: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = 4;
	const open = f > W('232', 'opens') + 4;
	const walkS = W('234', 'walks');
	const gw = walkTo(f, walkS, W('234', 'puts') - 2, 900, 1150, 64, 0.18);
	const touch = env(f, W('234', 'puts'), W('236', 0) - 4, 10, 10);
	const pick = env(f, W('236', 0), 9999, 10, 10);
	const nose = env(f, W('236', 'holds'), 9999, 10, 10);
	const turn = f > W('238', 0);
	let gp: Pose = f < walkS ? {...idle(gf, 65), lean: 8} : gw.pose;
	gp = reach(gp, 'F', [80, -150], touch);
	if (pick > 0) gp = nose > 0 ? gesture('touchFace', gp, nose, gf) : reach(gp, 'F', [40, -330], pick);
	const laugh = f > W('237', 'laughing');
	const cry = f > W('237', 0) && !laugh;
	const gx = f < walkS ? 900 : gw.x;
	const cam = f < W('234', 0) ? usePushOnL(f, W('234', 0)) : f < W('238', 0) ? camOn(1180, 480, 1.7) : camOn(1000, 500, 1.55);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#9fd8f2" light={{x: 20, y: 10, o: 0.55}}>
				<Layer depth={2.4}>
					<Sky k="warm" f={gf} sun={[300, 180]} id="ar" />
				</Layer>
				<Layer depth={1.8}>
					<CliffSea f={gf} />
				</Layer>
				<Layer depth={1.1}>
					<Terrace />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<LemonTree x={1350} y={900} s={1.05} f={gf} glow={0.5} />
						<Hero x={720} pose={turn ? gesture('touchFace', idle(gf, 66), env(f, W('239', 0), 999), gf) : idle(gf, 67)} look={[0.6, -0.1]} inAt={tin} mouth={turn ? 'open' : 'smile'} expr={turn ? 'wide' : 'normal'} />
						<Person who="grandma" x={gx} facing={turn ? -1 : 1} pose={turn ? {...idle(gf, 68), armF: [40, 60]} : gp} vx={gw.vx * 0.5} bob={gw.bob * 0.5} inAt={tin} lidL={open ? 0 : 1} lidR={open ? 0 : 1} mouth={laugh ? 'open' : cry ? 'frown' : 'smile'} expr={cry ? 'sad' : 'normal'} look={turn ? [-0.6, 0] : [0.5, -0.4]} handItem={pick > 0.5 || turn ? <Lemon /> : undefined} />
						<PopBurst f={f} t0={tin} x={820} y={headY() + 140} s={0.5} />
						{cry
							? [0, 1].map((i) => <circle key={i} cx={gx + 18 + i * 22} cy={headY() + 30 + ((f * 3 + i * 20) % 60)} r={5} fill="#7fd0ff" />)
							: null}
						<Tag x={500} y={200} t={f - W('231', 'warm')} text="WARM SUN" size={36} life={W('232', 0) - W('231', 'warm')} c="#ffd27a" />
						<Tag x={900} y={150} t={f - W('231', 'salty')} text="SALTY AIR" size={36} life={W('232', 0) - W('231', 'salty')} c="#7fd0ff" />
						<Tag x={1300} y={200} t={f - W('231', 'lemons')} text="LEMONS" size={36} life={W('232', 0) - W('231', 'lemons')} c="#ffe03a" />
						<Tag x={1200} y={330} t={f - W('235', 0)} text="“PAPA…”" size={44} c="#ffe8b0" life={W('236', 0) - W('235', 0)} />
						<Tag x={1000} y={300} t={f - W('238', 'nico')} text="“NICO, MY NICO”" size={44} c="#b48ad8" life={W('239', 0) - W('238', 'nico') + 6} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('239', 0)} words={['YOUR', 'NAME.']} top={100} size={130} />
			<Slam t={f - W('240', 'first')} words={['FIRST', 'TIME', 'IN', 'A', 'YEAR']} top={860} size={70} c="#ffe03a" />
		</AbsoluteFill>
	);
};
const usePushOnL = (f: number, end: number) => mixCam(camOn(900, 560, 1.2), camOn(900, 520, 1.45), k01(f, 0, end));

/* 241-244 one hour; her stories: father, the sea, the boy she kissed (not grandpa) */
const Stories: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const laugh = f > W('244', 0);
	const cam = usePushOn(1000, 600, 1.25, 1.45, 30, 0);
	const icons: [string, React.ReactNode][] = [
		['father', <Stickman key="a" id="st-f" x={0} y={30} scale={0.35} pose={idle(gf, 69)} {...CAST.oldman} look={[0, 0]} faceTurn={0} />],
		['sea', <g key="b"><rect x={-60} y={-10} width={120} height={60} fill="#2a8fd0" /><path d="M-60,0 q20,-10 40,0 t40,0 t40,0" stroke="#fff" strokeWidth={5} fill="none" /></g>],
		['boy', <path key="c" d="M0,30 C-50,0 -40,-50 0,-25 C40,-50 50,0 0,30 Z" fill="#ff5a7a" />],
	];
	return (
		<Stage cam={cam} bg="#e0607a" light={{x: 30, y: 40, o: 0.55, c: '255,180,140'}}>
			<Layer depth={2.4}>
				<Sky k="sunset" f={gf} sun={[300, 600]} id="sto" />
			</Layer>
			<Layer depth={1.8}>
				<CliffSea f={gf} k="sunset" />
			</Layer>
			<Layer depth={1.1}>
				<Terrace />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<LemonTree x={1400} y={900} s={1} f={gf} />
					<Hero x={820} seat={830} pose={{...SIT, legF: [80, 60], legB: [80, 60], armF: [60, 70]}} look={[0.6, -0.1]} mouth="smile" />
					<Person who="grandma" x={1050} seat={830} facing={-1} pose={laugh ? {...SIT, lean: -18, armF: [60, 100], legF: [80, 60], legB: [80, 60]} : {...SIT, armF: [70 + 20 * Math.sin(gf / 10), 60], legF: [80, 60], legB: [80, 60]}} look={[-0.6, 0]} mouth={laugh ? 'open' : 'smile'} />
					{icons.map(([w, ic], i) => (
						<g key={i} opacity={f > W('243', w) ? 1 : 0}>
							<Bubble x={760 + i * 220} y={380 - (i % 2) * 40} w={180} h={140} t={f - W('243', w)} thought tail={[100 - i * 80, 100]}>
								{ic}
							</Bubble>
						</g>
					))}
					<Tag x={960} y={150} t={f - W('241', 'one')} text="ONE HOUR" size={48} life={W('243', 0) - W('241', 'one')} />
					<Tag x={1220} y={230} t={f - W('243', 'definitely')} text="NOT GRANDPA" size={40} c="#ff5a7a" />
					<Tag x={1050} y={330} t={f - W('244', 0)} text="“DON'T TELL YOUR MOTHER”" size={36} c="#b48ad8" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 245-246 hop her home: 140 jumps */
const HopHome: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const out = W('245', 'hop') + 4;
	const cam = usePushOn(1000, 560, 1.25, 1.4);
	return (
		<Stage cam={cam} bg="#e0607a" light={{x: 30, y: 40, o: 0.55, c: '255,180,140'}}>
			<Layer depth={2.4}>
				<Sky k="sunset" f={gf} sun={[300, 640]} id="hph" />
			</Layer>
			<Layer depth={1.8}>
				<CliffSea f={gf} k="sunset" />
			</Layer>
			<Layer depth={1.1}>
				<Terrace />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<LemonTree x={1400} y={900} s={1} f={gf} />
					<Hero x={900} pose={reach(idle(gf, 70), 'F', [70, -40], 1)} look={[0.6, 0]} outAt={out} mouth="smile" />
					<Person who="grandma" x={1040} facing={-1} pose={reach(idle(gf, 71), 'F', [80, -40], 1)} outAt={out} handItem={<Lemon />} lidL={1} lidR={1} mouth="smile" />
					<PopBurst f={f} t0={out} x={970} y={headY() + 140} text="POP!" />
					<Tag x={970} y={200} t={f - W('246', 0)} text="140 JUMPS HOME" size={50} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 247-250 that night she sleeps with the lemon on her pillow; the nurse can't figure it out */
const NightLemon: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const nurse = f > W('248', 0) && f < W('249', 0);
	const end = f > W('249', 0);
	const cam = nurse ? camOn(900, 560, 1.3) : end ? usePushL2(f, W('249', 0)) : camOn(1600, 640, 1.9);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#2c3456" light={{night: true, o: 0.35}}>
				<Layer depth={1.4}>
					<CareRoom f={gf} night />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<g transform="translate(1600,690) rotate(84)">
							<Stickman id="gm-sleep" x={0} y={0} scale={0.95} pose={{lean: 0, head: -10 + Math.sin(gf / 30) * 3, armB: [4, 10], armF: [6, 12], legB: [0, 0], legF: [3, 0]}} {...CAST.grandma} expr="sleepy" mouth="smile" look={[0, 0]} faceTurn={0.2} />
						</g>
						<rect x={1150} y={690} width={560} height={70} rx={30} fill="#9a86c8" />
						<g transform="translate(1790,640)">
							<circle r={60} fill="#ffe03a" opacity={0.25 + 0.1 * Math.sin(gf / 8)} style={{filter: 'blur(10px)'}} />
							<Lemon s={1.6} />
						</g>
						{nurse || end ? <Person who="nurse" x={680} pose={gesture('scratch', idle(gf, 72), 1, gf)} look={[0.6, 0]} expr="worried" mouth="frown" o={nurse ? 1 : 0} /> : null}
						{end ? <Hero x={420} pose={idle(gf, 73)} look={[0.6, 0]} mouth="smile" /> : null}
						<Tag x={1790} y={480} t={f - W('247', 'lemon')} text="ON HER PILLOW" size={36} c="#ffe03a" life={W('248', 0) - W('247', 'lemon')} />
						{nurse ? <Tag x={680} y={300} t={f - W('248', 0) - 10} text="???" size={60} c="#ffd34a" /> : null}
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('250', 'made')} words={['MADE', 'FOR', 'SOMETHING']} top={110} size={96} />
		</AbsoluteFill>
	);
};
const usePushL2 = (f: number, s: number) => mixCam(camOn(700, 560, 1.15), camOn(600, 520, 1.4), k01(f, s, s + 120));

export const SHOTS2: ShotDef[] = [
	{at: '126', C: Proposal, whip: true},
	{at: '130', C: ViralShot, whip: true},
	{at: '137', C: Chat},
	{at: '141', C: Knock, whip: true},
	{at: '144', C: Hale1},
	{at: '149', C: UnlockShot},
	{at: '153', C: Hale2},
	{at: '159', C: Billionaire},
	{at: '163', C: Hale3},
	{at: '166', C: Hide, whip: true},
	{at: '171', C: Q1, whip: true},
	{at: '175', C: CareHome, whip: true},
	{at: '179', C: SundayMap},
	{at: '181', C: Dementia},
	{at: '185', C: Memory, whip: true},
	{at: '190', C: GrandmaTalk, whip: true},
	{at: '193', C: TooWeak},
	{at: '196', C: Overhear},
	{at: '198', C: CliffRisk, whip: true},
	{at: '203', C: SlowWay},
	{at: '207', C: StepsShot, whip: true},
	{at: '210', C: TreeReveal},
	{at: '219', C: Garden, whip: true},
	{at: '224', C: TinyMap},
	{at: '228', C: HoldHands},
	{at: '230', C: Arrival, whip: true},
	{at: '241', C: Stories},
	{at: '245', C: HopHome},
	{at: '247', C: NightLemon, whip: true},
];
