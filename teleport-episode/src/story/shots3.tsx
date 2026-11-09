import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose, Stickman} from '../engine/Stickman';
import {SIT, env, gesture, idle, reach, walkTo} from '../kit/actions';
import {useShot, useSpeaking} from '../kit/core';
import type {ShotDef} from '../kit/coverage';
import {Layer, Stage, Svg, camOn, clamp, mixCam, CrowdRow, Extra} from '../kit/kit';
import {Kitchen, KitchenTable} from '../kit/sets';
import {Bubble, FONT, HAND} from '../kit/ui';
import {Chair, Desk} from '../engine/props';
import {CAST, LIME} from './cast';
import {FL, Hero, Person, headY, usePushOn, Stopwatch, Lemon, PhoneItem} from './common';
import {Onoma, PopBurst, Slam, Star, Tag, useW} from './fx';
import {Sky, Hills, Ground, LivingRoom, Couch, TV, TVStand, FloodTown, RainFX, Helicopter, lightning, Gym, Blanket, CareRoom} from './places';
import {Card, NewsFull, NewsScreen, Newspaper, Tally} from './boards';

const k01 = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

/* 251-253 day forty: homework, the TV turns red */
const TVRed: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const red = f > W('252', 'red');
	const cam = mixCam(camOn(700, 580, 1.3), camOn(1300, 470, 1.6), k01(f, W('252', 'red') - 6, W('252', 'red') + 14));
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#e7c9a0" light={{x: 70, y: 10, o: red ? 0.6 : 0.35, c: red ? '255,80,80' : undefined}}>
				<Layer depth={1.4}>
					<LivingRoom f={gf} rain />
				</Layer>
				<Layer depth={1}>
					<TVStand x={1350} />
					<Svg>
						<TV x={1350} y={560} id="tvred" glow={red ? '#ff3a3a' : '#6aa8ff'}>
							{red ? (
								<g>
									<rect width={420} height={250} fill="#c41e1e" opacity={0.8 + 0.2 * Math.sin(gf / 3)} />
									<text x={210} y={140} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#fff">
										BREAKING NEWS
									</text>
								</g>
							) : (
								<rect width={420} height={250} fill="#3a6fd2" />
							)}
						</TV>
						<Desk x={560} y={740} />
						<Hero x={560} seat={790} pose={{...SIT, armF: [70, 60], head: red ? -6 : 14}} look={red ? [1, -0.2] : [0.3, 0.6]} expr={red ? 'wide' : 'sleepy'} mouth={red ? 'open' : 'flat'} />
						<Chair x={560} y={800} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - 2} words={['DAY', '40']} top={110} size={130} life={W('252', 'red') - 2} />
		</AbsoluteFill>
	);
};
const NewsStorm: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return (
		<AbsoluteFill>
			<NewsFull t={f} mode="storm" />
			<Slam t={f - W('257', 0)} words={['HELICOPTERS', "CAN'T", 'FLY']} top={120} size={72} life={W('258', 0) - W('257', 0)} c="#ff6a5a" />
			<Slam t={f - W('258', 'dozens')} words={['DOZENS', 'ON', 'ROOFTOPS']} top={120} size={72} c="#ffd34a" />
		</AbsoluteFill>
	);
};

/* 259-272 you know that town; Sam: don't — cameras everywhere — everyone, forever */
const SamDont: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const up = W('263', 0);
	const samPose: Pose = f < up ? {...SIT, armF: [40, 80], armB: [30, 70]} : gesture('stop', idle(gf, 80), env(f, up, W('265', 0) + 30, 6, 8), gf);
	const samLook: [number, number] = f > W('262', 'then') ? [-0.7, 0] : [1, -0.2];
	const close = f > W('269', 0);
	const cam = sp === 'SAM' ? camOn(1250, 520, 1.7) : close ? camOn(760, headY() + 40, 2.0) : camOn(980, 560, 1.15);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#e7c9a0" light={{x: 70, y: 10, o: 0.45, c: '255,120,120'}}>
				<Layer depth={1.4}>
					<LivingRoom f={gf} rain />
				</Layer>
				<Layer depth={1.1}>
					<Couch x={1250} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						{f < up ? <Person who="sam" x={1250} seat={760} pose={samPose} facing={-1} look={samLook} expr="worried" mouth="frown" /> : <Person who="sam" x={1250} pose={samPose} facing={-1} look={[-0.7, 0]} expr="worried" />}
						<Hero x={760} pose={close ? gesture('think', idle(gf, 81), 1, gf) : idle(gf, 82)} look={close ? [0.2, 0.4] : [0.6, 0]} expr={close ? 'worried' : 'normal'} mouth="flat" />
						<Tag x={760} y={240} t={f - W('259', 0)} text="YOU KNOW THAT TOWN" size={40} life={W('261', 0) - W('259', 0)} />
						<Tag x={1250} y={300} t={f - W('264', 'cameras')} text="📷 CAMERAS EVERYWHERE" size={36} c="#ff6a5a" life={W('266', 0) - W('264', 'cameras')} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('265', 'everyone')} words={['EVERYONE', 'WILL', 'KNOW']} top={100} size={84} life={W('267', 0) - W('265', 'everyone')} c="#ff6a5a" />
			<Slam t={f - W('267', 0)} words={['EVERYONE.', 'FOREVER.']} top={100} size={110} life={W('269', 0) - W('267', 0)} c="#ff6a5a" />
			<Slam t={f - W('270', 'no')} words={['NO', 'MORE', 'HIDING']} top={860} size={74} life={W('271', 0) - W('270', 'no')} />
			<Slam t={f - W('271', 0)} words={['NO', 'MORE', 'NORMAL', 'LIFE']} top={860} size={74} life={W('272', 0) - W('271', 0)} />
			<Slam t={f - W('272', 'never')} words={['THE', 'JUMP', 'YOU', "CAN'T", 'TAKE', 'BACK']} top={860} size={74} c={LIME} />
		</AbsoluteFill>
	);
};
const NewsKid: React.FC = () => {
	const {f} = useShot();
	return (
		<AbsoluteFill>
			<NewsFull t={f + 200} mode="storm" headline="GIRL WAVES FOR HELP" />
		</AbsoluteFill>
	);
};

/* 274-276 you look at Sam. hold the stopwatch. pop. */
const Decide: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const out = W('276', 0);
	const cam = mixCam(camOn(860, 520, 1.6), camOn(1000, 540, 1.3), k01(f, W('275', 0), out));
	return (
		<Stage cam={cam} bg="#e7c9a0" light={{x: 70, y: 10, o: 0.45, c: '255,120,120'}}>
			<Layer depth={1.4}>
				<LivingRoom f={gf} rain />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<Person who="sam" x={1250} facing={-1} pose={{...idle(gf, 83), armF: [80, 40]}} look={[-0.7, 0]} expr="worried" handItem={f > W('275', 'stopwatch') ? <Stopwatch /> : undefined} mouth="open" />
					<Hero x={780} pose={gesture('point', idle(gf, 84), env(f, W('275', 0), out, 6, 4), gf)} handF="point" look={[0.7, 0]} outAt={out} mouth="flat" expr="angry" />
					<PopBurst f={f} t0={out} x={780} y={headY() + 120} text="POP!" />
					<Tag x={1000} y={200} t={f - W('275', 0)} text="HOLD THE STOPWATCH." size={46} c={LIME} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* storm rooftop scene used by the rescue */
const RoofSet: React.FC<{f: number; level: number; shake?: number; children?: React.ReactNode; heli?: boolean}> = ({f, level, shake = 0, children, heli = true}) => {
	const L = lightning(f);
	return (
		<>
			<Layer depth={2.4}>
				<Sky k="storm" f={f} id="storm" />
				<AbsoluteFill style={{background: '#dfe8ff', opacity: L * 0.5}} />
			</Layer>
			<Layer depth={1.6}>
				<FloodTown f={f} level={level} />
				<Svg>{heli ? <Helicopter x={1500} y={200} f={f} s={0.6} /> : null}</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform={`translate(${Math.sin(f * 2.3) * shake},${Math.cos(f * 2.9) * shake * 0.5})`}>
						<path d="M520,900 L960,780 L1400,900 L1400,1300 L520,1300 Z" fill="#6a3a2a" />
						<path d="M500,906 L960,786 L1420,906" stroke="#3a1f14" strokeWidth={18} fill="none" />
						<rect x={1150} y={760} width={60} height={110} fill="#5a3a2a" />
						{children}
					</g>
					<rect x={-600} y={1000 - level * 0.4} width={3100} height={600} fill="#4a5a52" opacity={0.95} />
					{Array.from({length: 20}).map((_, i) => (
						<path key={i} d={`M${-500 + ((i * 150 + f * 7) % 2900)},${1010 - level * 0.4 + (i % 4) * 20} q30,-14 60,0`} stroke="#9fb4a8" strokeWidth={4} fill="none" />
					))}
				</Svg>
			</Layer>
			<Layer depth={0.9}>
				<RainFX f={f} seed="r1" n={110} />
			</Layer>
		</>
	);
};

/* 277-281 freezing rain, water roaring, the roof shaking; grab the girl and her dad; pop */
const Roof: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const tin = 2;
	const grab = W('280', 'grab');
	const out = W('281', 0);
	const k = env(f, grab, 9999, 8, 8);
	const cam = usePushOn(960, 600, 1.15, 1.4, 0, -20);
	const roofY = (x: number) => 900 - (1 - Math.abs(x - 960) / 440) * 120;
	return (
		<Stage cam={cam} bg="#2b333f" light={{night: true, o: 0.3}}>
			<RoofSet f={gf} level={60 + f * 0.3} shake={f > W('279', 0) ? 6 : 1.5}>
				<Hero x={900} fl={roofY(900)} pose={reach(reach({...idle(gf, 85), lean: 6}, 'F', [100, -60], k), 'B', [-90, -60], k)} inAt={tin} outAt={out} hood look={[0.4, 0]} expr="angry" mouth="flat" />
				<Person who="kid" x={1040} s={0.7} fl={roofY(1040)} facing={-1} pose={gesture('wave', idle(gf, 86), 1 - k, gf)} handItem={<rect x={-30} y={-30} width={50} height={40} fill="#c42b2b" transform={`rotate(${Math.sin(gf / 3) * 20})`} />} outAt={out} look={[-0.5, -0.2]} expr="wide" />
				<Person who="dad" x={760} fl={roofY(760)} pose={gesture('handsOnHead', idle(gf, 87), 1 - k, gf)} outAt={out} look={[0.5, 0]} expr="worried" />
			</RoofSet>
			<Layer depth={0.95}>
				<Svg>
					<PopBurst f={f} t0={tin} x={900} y={headY(1, 800) + 80} />
					<PopBurst f={f} t0={out} x={900} y={headY(1, 800) + 80} text="POP!" />
					<Tag x={600} y={180} t={f - W('277', 0)} text="FREEZING RAIN" size={40} c="#9fd0ff" life={W('279', 0) - W('277', 0)} />
					<Tag x={1300} y={240} t={f - W('278', 'water')} text="WATER ROARING" size={40} c="#9fd0ff" life={W('279', 0) - W('278', 'water')} />
					<Onoma x={1300} y={500} t={f - W('279', 'shaking')} text="RUMBLE" size={70} c="#ffd34a" life={40} />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 282-292 the rescue relay: hill, gym, back, man on a car, woman with a dog */
const Relay: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const T = [0, W('283', 0) - 3, W('285', 0) - 2, W('288', 0) - 2, W('292', 0) - 2];
	const i = T.filter((t) => f >= t).length - 1;
	const t0 = T[i];
	if (i === 0 || i === 3) {
		// dry hill (people dropped off) / dry hill again with the old man
		return (
			<Stage cam={camOn(960, 600, 1.2)} bg="#46505c" light={{night: true, o: 0.3}}>
				<Layer depth={2.4}>
					<Sky k="storm" f={gf} id="hill" />
				</Layer>
				<Layer depth={1.5}>
					<Hills id="dh" c="#3f6a3a" far="#2f4a2f" />
				</Layer>
				<Layer depth={1.2}>
					<Ground c="#4f7a3a" />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero x={900} pose={{...idle(gf, 88), lean: 20 * env(f, t0 + 2, t0 + 14, 3, 8)}} inAt={t0 + 1} hood expr="angry" mouth="flat" />
						{i === 0 ? (
							<>
								<Person who="kid" s={0.7} x={1040} pose={idle(gf, 89)} inAt={t0 + 1} look={[-0.5, 0]} expr="wide" />
								<Person who="dad" x={760} pose={idle(gf, 90)} inAt={t0 + 1} look={[0.5, 0]} expr="wide" />
							</>
						) : (
							<Person who="carman" x={1060} pose={gesture('handsOnHead', idle(gf, 91), 1, gf)} inAt={t0 + 1} look={[-0.5, 0]} expr="wide" />
						)}
						<PopBurst f={f} t0={t0 + 1} x={900} y={headY() + 120} />
						<Tag x={900} y={200} t={f - t0 - 4} text={i === 0 ? 'A DRY HILL' : 'POP.'} size={48} />
					</Svg>
				</Layer>
				<Layer depth={0.9}>
					<RainFX f={gf} seed="r2" n={60} o={0.4} />
				</Layer>
			</Stage>
		);
	}
	if (i === 1) {
		return (
			<Stage cam={usePushOnG(f, t0)} bg="#d8c8a0" light={{x: 50, y: 0, o: 0.4}}>
				<Layer depth={1.4}>
					<Gym f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Blanket x={1300} y={900} c="#d94a3a" w={260} />
						<Blanket x={500} y={900} c="#3d6fd6" w={260} />
						<Hero x={900} pose={{...idle(gf, 92), lean: 20 * env(f, t0 + 2, t0 + 14, 3, 8)}} inAt={t0 + 1} hood outAt={W('285', 0) - 2} mouth="flat" />
						<Person who="kid" s={0.7} x={1060} pose={idle(gf, 93)} inAt={t0 + 1} look={[-0.5, 0]} />
						<Person who="dad" x={740} pose={gesture('presentF', idle(gf, 94), 1, gf)} inAt={t0 + 1} look={[0.5, 0]} mouth="smile" />
						<PopBurst f={f} t0={t0 + 1} x={900} y={headY() + 120} />
						<Tag x={960} y={200} t={f - t0 - 4} text="A SCHOOL GYM" size={48} life={W('284', 0) - t0} />
						<Tag x={960} y={200} t={f - W('284', 0)} text="BLANKETS" size={48} c="#ffd34a" />
					</Svg>
				</Layer>
			</Stage>
		);
	}
	// back in the flood: old man on a car (i=2) / woman with a dog (i=4)
	const car = i === 2;
	return (
		<Stage cam={camOn(960, 620, 1.25)} bg="#2b333f" light={{night: true, o: 0.3}}>
			<RoofSet f={gf} level={90 + f * 0.3} shake={2}>
				{car ? null : (
					<>
						<Person who="woman" x={1080} fl={850} facing={-1} pose={{...idle(gf, 95), armF: [70, 80], armB: [60, 80]}} look={[-0.5, 0]} expr="worried" handItem={<Dog f={gf} />} />
						<Hero x={860} fl={850} pose={gesture('presentF', idle(gf, 96), env(f, W('291', 0), 999), gf)} inAt={t0 + 1} hood look={[0.5, 0]} />
					</>
				)}
			</RoofSet>
			{car ? (
				<Layer depth={1}>
					<Svg>
						<g transform={`translate(0,${Math.sin(gf / 9) * 8}) rotate(${Math.sin(gf / 13) * 3} 960 960)`}>
							<rect x={700} y={900} width={520} height={110} rx={40} fill="#3a6fd2" />
							<rect x={790} y={830} width={340} height={90} rx={30} fill="#2f5ab0" />
						</g>
						<Person who="carman" x={960} fl={835} pose={gesture('wave', idle(gf, 97), 1, gf)} look={[0, -0.4]} expr="wide" mouth="open" />
						<Hero x={820} fl={835} pose={reach(idle(gf, 98), 'F', [100, -60], env(f, t0 + 16, 999))} inAt={t0 + 1} hood outAt={W('288', 0) - 2} look={[0.5, 0]} />
					</Svg>
				</Layer>
			) : null}
			<Layer depth={0.95}>
				<Svg>
					<PopBurst f={f} t0={t0 + 1} x={860} y={headY(1, 850) + 120} />
					{car ? <Tag x={960} y={200} t={f - W('287', 0)} text="AN OLD MAN ON A CAR" size={44} /> : null}
					{!car ? <Tag x={1100} y={220} t={f - W('290', 0)} text="“TAKE THE DOG FIRST!”" size={40} c="#ffd34a" life={W('291', 0) - W('290', 0)} /> : null}
					{!car ? <Tag x={860} y={220} t={f - W('291', 0)} text="“I'M TAKING YOU BOTH.”" size={40} c={LIME} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
const usePushOnG = (f: number, t0: number) => mixCam(camOn(900, 580, 1.2), camOn(900, 560, 1.35), k01(f, t0, t0 + 90));
const Dog: React.FC<{f: number}> = ({f}) => (
	<g transform="translate(-10,-20)">
		<ellipse cx={0} cy={0} rx={40} ry={24} fill="#c9965a" />
		<circle cx={36} cy={-18} r={20} fill="#c9965a" />
		<ellipse cx={30} cy={-34} rx={8} ry={14} fill="#8a6a3a" transform={`rotate(${Math.sin(f / 4) * 15} 30 -34)`} />
		<circle cx={42} cy={-20} r={3} fill="#111" />
		<path d={`M-38,-6 q-16,${-10 + Math.sin(f / 2) * 8} -24,-16`} stroke="#c9965a" strokeWidth={6} fill="none" strokeLinecap="round" />
	</g>
);

/* 293-298 every jump: knees hit the ground, head spins; short hops only; back and forth */
const BackForth: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const step = 22;
	const n = Math.floor(f / step);
	const t0 = n * step;
	const st = env(f, t0 + 1, t0 + 10, 2, 8);
	const gym = n % 2 === 1;
	const spin = k01(f, W('294', 0), W('294', 0) + 30);
	const pose: Pose = {...idle(gf, 99), lean: 30 * st, armF: [60 * st + 10, 60], armB: [40 * st, 60], legF: [60 * st, 100 * st], legB: [-10, 90 * st]};
	return (
		<AbsoluteFill>
			<Stage cam={camOn(960, 620, 1.45)} bg={gym ? '#d8c8a0' : '#2b333f'} light={gym ? {x: 50, o: 0.4} : {night: true, o: 0.3}}>
				{gym ? (
					<Layer depth={1.4}>
						<Gym f={gf} />
					</Layer>
				) : (
					<RoofSet f={gf} level={100 + f * 0.3} heli={false} />
				)}
				<Layer depth={1}>
					<Svg>
						<g transform={`rotate(${Math.sin(gf / 5) * 6 * spin} 960 900)`}>
							<Hero key={n} x={960} fl={gym ? 900 : 790} pose={pose} inAt={t0} hood squash={0.12 * st} expr={spin > 0.5 ? 'sleepy' : 'angry'} mouth="frown" look={[Math.sin(gf / 4) * spin, Math.cos(gf / 4) * spin * 0.5]} />
						</g>
						<PopBurst f={f} t0={t0} x={960} y={gym ? 700 : 600} s={0.6} />
						<Onoma x={1160} y={gym ? 820 : 720} t={f - t0 - 2} text="THUD" size={56} c="#ffd34a" life={14} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('295', 0)} words={['SHORT', 'HOPS', 'ONLY']} top={100} size={84} life={W('297', 0) - W('295', 0)} />
			<Slam t={f - W('297', 0)} words={['BACK', '&', 'FORTH']} top={100} size={96} c="#ffd34a" />
		</AbsoluteFill>
	);
};

/* 299-304 Sam in your earbuds: jump 30, jump 31, you're bleeding */
const Earbuds: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const n = f > W('301', 0) ? 31 : 30;
	const bleed = k01(f, W('302', 'bleeding'), W('302', 'bleeding') + 20);
	const cam = usePushOn(820, headY() + 20, 2.1, 2.4, 0, 0);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#2b333f" light={{night: true, o: 0.3}}>
				<RoofSet f={gf} level={120} heli={false}>
					<Hero x={820} fl={830} pose={{...idle(gf, 100), lean: 10}} hood look={[0.3, 0.1]} expr="angry" mouth={f > W('303', 0) && f < W('304', 0) ? undefined : 'flat'} />
					<circle cx={780} cy={headY(1, 830) + 8} r={9} fill="#f2f2f2" />
					<path d={`M${850},${headY(1, 830) - 30} q6,${30 * bleed} 0,${60 * bleed}`} stroke="#c42b2b" strokeWidth={7} fill="none" strokeLinecap="round" />
				</RoofSet>
				<Layer depth={0.95}>
					<Svg>
						<Bubble x={1220} y={330} w={420} h={130} t={f - W('299', 'voice')}>
							<text y={-10} textAnchor="middle" fontSize={24} fontFamily={FONT} fill="#f08a3c">
								SAM (earbuds)
							</text>
							<text y={34} textAnchor="middle" fontSize={44} fontFamily={FONT} fontWeight={900} fill="#2b2f3a">
								{f > W('304', 0) ? 'YOU ARE NOT FINE.' : f > W('302', 0) ? "BRO, YOU'RE BLEEDING" : `JUMP ${n}`}
							</text>
						</Bubble>
						<Tag x={700} y={170} t={f - W('303', 0)} text="“I'M FINE.”" size={40} life={W('304', 0) - W('303', 0)} />
					</Svg>
				</Layer>
			</Stage>
		</AbsoluteFill>
	);
};

/* 305-306 on jump 47 the last roof goes under: nobody on it */
const LastRoof: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	return (
		<AbsoluteFill>
			<Stage cam={usePushOn(960, 620, 1.05, 1.25)} bg="#2b333f" light={{night: true, o: 0.3}}>
				<RoofSet f={gf} level={140 + f * 2.2} heli />
			</Stage>
			<Slam t={f - W('305', '47')} words={['JUMP', '47']} top={100} size={110} c={LIME} life={W('306', 0) - W('305', '47')} />
			<Slam t={f - W('306', 0)} words={['NOBODY', 'ON', 'IT.']} top={100} size={100} />
		</AbsoluteFill>
	);
};
const TallyShot: React.FC = () => {
	const {f} = useShot();
	const W = useW();
	return <Tally t={f} ts={[W('307', 0), W('308', 0), W('309', 0), W('310', 0)]} />;
};

/* 311-316 on the gym floor, soaking wet; phone beeps; everyone is filming you */
const GymFloor: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const b1 = W('313', 'beep');
	const b2 = W('314', 0);
	const b3 = W('315', 0);
	const phones = f < b1 ? 0 : f < b2 ? 1 : f < b3 ? 2 : 9;
	const cam = f < b1 ? usePushOnF(f) : camOn(960, 560, 1.05);
	return (
		<Stage cam={cam} bg="#d8c8a0" light={{x: 50, y: 0, o: 0.4}}>
			<Layer depth={1.4}>
				<Gym f={gf} />
			</Layer>
			<Layer depth={1.1}>
				<Svg>
					{Array.from({length: 9}).map((_, i) => {
						const x = 200 + i * 190 + (i > 3 ? 120 : 0);
						const up = i < phones;
						return (
							<g key={i}>
								<Extra i={i} x={x} floor={830} s={0.85} seed="gym" facing={x < 960 ? 1 : -1} pose={up ? {...idle(gf, i), armF: [130, 20]} : idle(gf, i)} />
								{up ? <circle cx={x + (x < 960 ? 50 : -50)} cy={450} r={7} fill="#ff2b2b" opacity={Math.floor(gf / 8 + i) % 2 ? 1 : 0.3} /> : null}
							</g>
						);
					})}
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<g transform="translate(960,880) rotate(-84)">
						<Stickman id="lying" x={0} y={0} scale={1} pose={{lean: 0, head: -6, armB: [-20, 10], armF: [30, 10], legB: [0, 0], legF: [5, 0]}} {...CAST.hero} hood expr="sleepy" mouth="open" look={[0, -1]} faceTurn={0.1} />
					</g>
					{Array.from({length: 6}).map((_, i) => (
						<circle key={i} cx={760 + i * 70} cy={905 + (i % 2) * 6} r={6 + (i % 3) * 3} fill="#7fd0ff" opacity={0.7} />
					))}
					<Onoma x={760} y={420} t={f - b1} text="BEEP" size={50} c="#ff5a4a" life={20} />
					<Onoma x={1260} y={380} t={f - b2} text="BEEP" size={50} c="#ff5a4a" life={20} />
					<Onoma x={960} y={330} t={f - b3} text="BEEP BEEP BEEP" size={60} c="#ff5a4a" life={30} />
					<Tag x={960} y={180} t={f - W('316', 0)} text="EVERYONE IS FILMING YOU" size={46} c="#ff5a4a" />
					<Tag x={960} y={260} t={f - W('311', 'soaking')} text="SOAKING WET" size={40} c="#7fd0ff" life={W('312', 0) - W('311', 'soaking')} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const usePushOnF = (f: number) => mixCam(camOn(960, 760, 1.6), camOn(960, 760, 1.85), k01(f, 0, 150));
const Paper: React.FC = () => {
	const {f} = useShot();
	return <Newspaper t={f} />;
};

/* 318-324 reporters outside; hop straight into her room; the TV is on: it's you */
const GrandmaTV: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const hop = W('319', 'hop') + 4;
	const inside = f >= hop;
	const outCam = usePushOn(960, 600, 1.1, 1.25);
	if (!inside) {
		return (
			<Stage cam={outCam} bg="#a8dcf6" light={{x: 30, y: 0, o: 0.45}}>
				<Layer depth={2.2}>
					<Sky k="day" f={gf} sun={[1500, 200]} id="rep" />
				</Layer>
				<Layer depth={1.4}>
					<Svg>
						<rect x={560} y={360} width={800} height={540} fill="#e8d8b8" />
						<path d="M520,360 L960,140 L1400,360 Z" fill="#b8653a" />
						<rect x={900} y={660} width={120} height={240} fill="#6a4a2a" />
						<rect x={640} y={460} width={160} height={130} fill="#9fd2f0" />
						<rect x={1120} y={460} width={160} height={130} fill="#9fd2f0" />
					</Svg>
					<Ground c="#7fcf5a" />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<CrowdRow n={8} x0={100} x1={1820} floor={950} s={0.95} mode="stand" seed="rep" />
						{Array.from({length: 8}).map((_, i) => (
							<g key={i} transform={`translate(${210 + i * 215},700)`}>
								<rect x={-30} y={-20} width={60} height={40} rx={6} fill="#2b2f3a" />
								<circle cx={30} cy={0} r={14} fill="#5d6472" />
								<circle cx={-20} cy={-14} r={5} fill="#ff2b2b" opacity={Math.floor(gf / 8 + i) % 2} />
							</g>
						))}
						<Tag x={960} y={150} t={f - W('319', 'reporters')} text="REPORTERS" size={50} c="#ff5a4a" />
					</Svg>
				</Layer>
			</Stage>
		);
	}
	const cam = f < W('320', 0) ? camOn(800, 560, 1.2) : mixCam(camOn(1150, 380, 1.4), camOn(1150, 380, 1.7), k01(f, W('321', 0), W('323', 0) + 40));
	return (
		<Stage cam={cam} bg="#dbe8e2" light={{x: 20, y: 10, o: 0.45}}>
			<Layer depth={1.4}>
				<CareRoom f={gf} />
			</Layer>
			<Layer depth={1}>
				<Svg>
					<TV x={1150} y={330} w={460} h={270} id="gtv">
						<NewsScreen t={f} W={460} H={270} mode="hero" />
					</TV>
					<Chair x={1500} y={800} facing={-1} />
					<Person who="grandma" x={1500} seat={790} facing={-1} pose={{...SIT, armF: [40, 80]}} look={[-0.6, -0.4]} mouth="smile" />
					<Hero x={720} pose={idle(gf, 101)} inAt={hop} look={[0.8, -0.4]} expr={f > W('321', 0) ? 'wide' : 'normal'} mouth={f > W('321', 0) ? 'open' : 'smile'} />
					<PopBurst f={f} t0={hop} x={720} y={headY() + 120} s={0.7} />
					<Tag x={1150} y={110} t={f - W('321', 0)} text="IT'S YOU. AGAIN." size={44} c={LIME} life={W('323', 0) - W('321', 0)} />
					<Tag x={1150} y={110} t={f - W('324', 'who')} text="WHO IS THE TELEPORTING TEEN?" size={36} c="#ff5a4a" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 325-331 grandma points: that's my Nico; he takes me to see lemons; she winks */
const GrandmaWink: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const pt = env(f, W('325', 'points'), W('326', 0), 6, 8);
	const wink = f > W('330', 'winks') && f < W('330', 'winks') + 26 ? 1 : 0;
	const close = f > W('330', 0);
	const pat = env(f, W('328', 'pats'), W('329', 0) + 20, 6, 8);
	const gp: Pose = reach({...SIT, armF: [40 + 60 * pt, 60 - 50 * pt]}, 'B', [-40, -60], pat);
	const cam = close ? camOn(1500, 500, 2.0) : sp === 'GRANDMA' ? camOn(1450, 520, 1.6) : camOn(1180, 560, 1.15);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#dbe8e2" light={{x: 20, y: 10, o: 0.45}}>
				<Layer depth={1.4}>
					<CareRoom f={gf} />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<TV x={1150} y={330} w={460} h={270} id="gtv2">
							<NewsScreen t={f + 120} W={460} H={270} mode="hero" />
						</TV>
						<Chair x={1500} y={800} facing={-1} />
						<Person who="grandma" x={1500} seat={790} facing={-1} pose={gp} handF={pt > 0.5 ? 'point' : undefined} look={f > W('325', 'you') ? [-0.8, 0] : [-0.5, -0.6]} lidL={0} lidR={wink} mouth={f > W('325', 'smiles') ? 'smile' : 'line'} />
						<Person who="nurse" x={1780} facing={-1} pose={reach({...idle(gf, 102), lean: 14}, 'F', [140, -40], pat)} look={[-0.6, 0.3]} mouth={f > W('328', 'laughs') ? 'open' : 'smile'} />
						<Hero x={720} pose={idle(gf, 103)} look={[0.8, 0]} mouth="smile" />
						<Tag x={1500} y={300} t={f - W('329', 0)} text="“CONFUSED”" size={40} life={W('330', 0) - W('329', 0)} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('331', 0)} words={["SHE'S", 'NOT', 'CONFUSED', 'AT', 'ALL']} top={860} size={74} c="#b48ad8" />
		</AbsoluteFill>
	);
};

/* 332-341 Hale again, with a newspaper: impossible to hide and impossible to use. smart kid. */
const HaleEnd: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const HX = 640;
	const AX = 1300;
	const leave = walkTo(f, W('341', 0), W('341', 0) + 60, AX, 2300, 104, 0.32);
	const smile = f > W('339', 0);
	const paper = f > W('334', 0) && f < W('341', 0);
	const cam = sp === 'HALE' ? camOn(AX - 40, 540, 1.7) : f > W('339', 0) && f < W('341', 0) ? camOn(AX - 20, 470, 2.2) : camOn(970, 580, 1.15);
	return (
		<AbsoluteFill>
			<Stage cam={cam} bg="#2a2a48" light={{night: true, o: 0.4, x: 50}}>
				<Layer depth={1.4}>
					<Kitchen night />
				</Layer>
				<Layer depth={1}>
					<Svg>
						<Hero x={HX} pose={idle(gf, 105)} look={[0.6, 0]} mouth={f > W('340', 0) ? 'smile' : 'flat'} />
						<Person who="hale" x={leave.x} facing={leave.moving ? 1 : -1} pose={leave.moving ? leave.pose : {...idle(gf, 106), armF: paper ? [70, 50] : [8, 10]}} vx={leave.vx} bob={leave.bob} look={[-0.6, 0]} mouth={smile ? 'smile' : 'flat'} handItem={paper ? <g transform="rotate(-10)"><rect x={-40} y={-60} width={80} height={100} fill="#f2ecdc" /><circle cx={0} cy={-20} r={16} fill="#000" /><rect x={-30} y={10} width={60} height={6} fill="#555" /></g> : undefined} />
					</Svg>
				</Layer>
				<Layer depth={0.92}>
					<KitchenTable night mugs={1} />
					<Svg>
						<Tag x={960} y={150} t={f - W('333', 0)} text="NO CARD THIS TIME" size={40} life={W('334', 0) - W('333', 0)} />
						<Tag x={960} y={150} t={f - W('336', 'impossible')} text="IMPOSSIBLE TO HIDE" size={44} c="#ffd34a" life={W('336', 'use') - W('336', 'impossible') + 30} />
						<Tag x={960} y={240} t={f - W('336', 'use') + 6} text="IMPOSSIBLE TO USE" size={44} c={LIME} life={W('337', 0) + 30 - W('336', 'use')} />
						<Tag x={960} y={150} t={f - W('337', 'whole')} text="THE WHOLE WORLD IS WATCHING" size={40} life={W('338', 0) + 10 - W('337', 'whole')} />
					</Svg>
				</Layer>
			</Stage>
			<Slam t={f - W('340', 0)} words={['SMART', 'KID.']} top={120} size={120} />
		</AbsoluteFill>
	);
};

/* 342-356 quiet kitchen; the air ripples; pop: a girl in a gray hoodie; you're doing it wrong; pop; a lemon */
const Stranger: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const sp = useSpeaking(gf);
	const rip = W('344', 'ripples');
	const tin = W('345', 0);
	const out = W('354', 0);
	const lem = W('356', 'lemon');
	const SX = 1300;
	const HX = 640;
	const lookAround = f > W('348', 0) && f < W('349', 0) ? Math.sin((f - W('348', 0)) / 10) : 0;
	const cam = f > W('355', 0) ? mixCam(camOn(SX - 120, 690, 1.6), camOn(SX - 120, 690, 2.3), k01(f, lem - 10, lem + 40)) : sp === 'STRANGER' ? camOn(SX - 40, 540, 1.7) : sp === 'HERO' ? camOn(HX + 40, 540, 1.7) : f < rip ? usePushQ(f) : camOn(980, 560, 1.2);
	return (
		<Stage cam={cam} bg="#2a2a48" light={{night: true, o: 0.4, x: 50}}>
			<Layer depth={1.4}>
				<Kitchen night />
			</Layer>
			<Layer depth={1}>
				<Svg>
					{f > rip && f < tin + 6
						? [0, 1, 2, 3].map((i) => {
								const k = ((f - rip) / 30 + i / 4) % 1;
								return <ellipse key={i} cx={SX} cy={600} rx={40 + 220 * k} ry={(40 + 220 * k) * 1.4} fill="none" stroke="#cfd8ff" strokeWidth={4} opacity={(1 - k) * 0.6} />;
							})
						: null}
					<Person who="stranger" x={SX} facing={-1} pose={{...idle(gf, 107), head: lookAround * 14}} inAt={tin} outAt={out} hood look={[lookAround ? lookAround : -0.6, 0]} mouth={f > W('351', 0) ? 'smirk' : 'flat'} />
					<Hero x={HX} seat={f < tin ? 790 : undefined} pose={f < tin ? {...SIT, armF: [60, 70]} : idle(gf, 108)} look={[0.6, 0]} expr={f > tin ? 'wide' : 'sleepy'} mouth={f > tin ? 'open' : 'flat'} />
					{f < tin ? <Chair x={HX} y={800} /> : null}
					<PopBurst f={f} t0={tin} x={SX} y={headY() + 120} c="#cfd8ff" text="POP." />
					<PopBurst f={f} t0={out} x={SX} y={headY() + 120} c="#cfd8ff" text="POP." />
					{f > tin && f < out
						? [0, 1, 2].map((i) => <circle key={i} cx={SX - 20 + i * 30} cy={905 + ((f * 2 + i * 9) % 20)} r={4} fill="#7fd0ff" opacity={0.7} />)
						: null}
					<Tag x={SX} y={200} t={f - W('347', 'gray')} text="GRAY HOODIE" size={38} life={W('348', 0) - W('347', 'gray')} />
					<Tag x={SX} y={280} t={f - W('347', 'wet')} text="WET SHOES" size={38} c="#7fd0ff" life={W('348', 0) - W('347', 'wet')} />
					<Tag x={SX} y={200} t={f - W('352', 'six')} text="6 YEARS" size={50} c="#cfd8ff" life={out - W('352', 'six')} />
				</Svg>
			</Layer>
			<Layer depth={0.92}>
				<KitchenTable night mugs={1} />
				<Svg>
					{f > out + 4 ? (
						<g transform={`translate(${SX - 120},690)`}>
							<circle r={70} fill="#ffe03a" opacity={0.25 + 0.1 * Math.sin(gf / 6)} style={{filter: 'blur(12px)'}} />
							<Lemon s={1.4} />
						</g>
					) : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
const usePushQ = (f: number) => mixCam(camOn(700, 560, 1.4), camOn(760, 560, 1.6), k01(f, 0, 140));

/* 357-360 the question: stay invisible or jump? */
const Final: React.FC = () => {
	const {f, gf} = useShot();
	const W = useW();
	const a = k01(f, 4, 18);
	const b = k01(f, W('358', 'jump') - 4, W('358', 'jump') + 10);
	const sub = f > W('359', 0);
	return (
		<AbsoluteFill style={{background: '#0c120a'}}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{transform: `scale(${1 + f * 0.0006})`}}>
				<g transform={`translate(${-(1 - a) * 1000},0)`}>
					<polygon points="0,0 1010,0 910,1080 0,1080" fill="#1d2440" />
					<text x={470} y={170} textAnchor="middle" fontSize={70} fontFamily={FONT} fontWeight={900} fill="#9fb4ff">
						STAY INVISIBLE
					</text>
					<Stickman id="fin-a" x={470} y={720} scale={1.9} pose={{...idle(gf, 109), head: 8}} {...CAST.hero} hood look={[0, 0.4]} faceTurn={0} mouth="flat" expr="sad" />
					<text x={470} y={1000} textAnchor="middle" fontSize={44} fontFamily={HAND} fontWeight={700} fill="#cfd8ff">
						keep your normal life
					</text>
				</g>
				{b > 0 ? (
					<g transform={`translate(${(1 - b) * 1000},0)`}>
						<polygon points="1010,0 1920,0 1920,1080 910,1080" fill="#24420f" />
						<text x={1440} y={170} textAnchor="middle" fontSize={90} fontFamily={FONT} fontWeight={900} fill={LIME}>
							JUMP
						</text>
						<circle cx={1440} cy={520} r={260} fill={LIME} opacity={0.12} />
						{Array.from({length: 8}).map((_, i) => (
							<Star key={i} x={1440 + Math.cos(gf / 20 + i) * 250} y={520 + Math.sin(gf / 20 + i) * 160} r={14} rot={gf * 4} />
						))}
						<Stickman id="fin-b" x={1440} y={720} scale={1.9} pose={{...idle(gf, 110), armF: [160, 20], armB: [-150, 20]}} {...CAST.hero} look={[0, -0.3]} faceTurn={0} mouth="smile" />
						<text x={1440} y={1000} textAnchor="middle" fontSize={44} fontFamily={HAND} fontWeight={700} fill="#efffc8">
							the whole world knows your name
						</text>
					</g>
				) : null}
				{b > 0 ? <line x1={1010} y1={0} x2={910} y2={1080} stroke="#fff" strokeWidth={8} /> : null}
				{sub ? (
					<g transform={`translate(960,540) scale(${k01(f, W('359', 0), W('359', 0) + 10)})`}>
						<rect x={-420} y={-80} width={840} height={160} rx={80} fill="#11140b" stroke={LIME} strokeWidth={8} />
						<text y={22} textAnchor="middle" fontSize={64} fontFamily={FONT} fontWeight={900} fill="#fff">
							👍 LIKE · 🔔 SUBSCRIBE
						</text>
					</g>
				) : null}
			</svg>
		</AbsoluteFill>
	);
};

export const SHOTS3: ShotDef[] = [
	{at: '251', C: TVRed, whip: true},
	{at: '253', C: NewsStorm},
	{at: '259', C: SamDont},
	{at: '273', C: NewsKid},
	{at: '274', C: Decide},
	{at: '277', C: Roof, whip: true},
	{at: '282', C: Relay},
	{at: '293', C: BackForth},
	{at: '299', C: Earbuds},
	{at: '305', C: LastRoof},
	{at: '307', C: TallyShot, whip: true},
	{at: '311', C: GymFloor, whip: true},
	{at: '317', C: Paper},
	{at: '318', C: GrandmaTV, whip: true},
	{at: '325', C: GrandmaWink},
	{at: '332', C: HaleEnd, whip: true},
	{at: '342', C: Stranger},
	{at: '357', C: Final, whip: true},
];
