import React from 'react';
import {Blanket} from '../kit/sets';
import {Sleeper} from '../kit/kit';
import {Bubble, FONT, HAND} from '../kit/ui';
import type {ShotDef} from '../kit/coverage';
import {AS, C, sc} from './engine2';
import {
	Ancestors, Banner, Bird, Bolt, Bus, Burst, Atom, Calendar, Card, Chart, Chips, Coin, Egg, Glass, Glassy, HeadsGrid, Halving, Heart, Lights, LIME, GOLD, Msgs, Money, Pillow,
	Question, Roulette, Scent, Score, Ship, Tag, Ticket, Tree, Truck,
} from './gfx';

/* THE STORY OF NINE PERFECT DAYS — the hero is the black-headed kid in the lime hoodie.
   Every shot is data: backdrop + camera + actors (walks, gestures) + graphics, all tied
   to line ids from lines.json (timeline.json): '011' = the line's first frame, '011e' = its
   last frame, '011+20' = 20 frames after the start. */

const hero = (x: number, o: Partial<AS> = {}): AS => ({who: 'hero', x, s: 1.05, ...o});
const A = (who: string, x: number, o: Partial<AS> = {}): AS => ({who, x, s: 1, ...o});
const mv = (t0: string, t1: string, x1: number, x0?: number) => ({t0, t1, x1, x0});
const FL = 900;

/* a bubble that says a quoted line */
const Say: React.FC<{c: C; t0: string; t1: string; x: number; y: number; w?: number; text: string}> = ({c, t0, t1, x, y, w = 460, text}) => {
	const a = c.t(t0);
	if (c.f < a || c.f > c.t(t1)) return null;
	return (
		<Bubble x={x} y={y} w={w} h={90} t={c.f - a} tail={[0, 80]}>
			<text y={14} textAnchor="middle" fontSize={34} fontFamily={HAND} fontWeight={700} fill="#1b1e2a">
				{text}
			</text>
		</Bubble>
	);
};

const Table: React.FC<{x?: number; w?: number}> = ({x = 960, w = 1300}) => (
	<g>
		<rect x={x - w / 2} y={700} width={w} height={24} rx={8} fill="#b87a44" />
		<rect x={x - w / 2 + 20} y={724} width={w - 40} height={190} fill="#a66a38" />
		{[0, 1, 2, 3].map((i) => (
			<g key={i}>
				<ellipse cx={x - w / 2 + 160 + i * ((w - 320) / 3)} cy={694} rx={62} ry={12} fill="#fff" />
				<ellipse cx={x - w / 2 + 160 + i * ((w - 320) / 3)} cy={690} rx={36} ry={7} fill="#ee8a5a" />
			</g>
		))}
	</g>
);

/* ------------------------------------------------------------------ 1. hook */
const S001 = sc({
	bg: 'void',
	cam: [[960, 600, 1.0], [960, 560, 1.15]],
	badge: 0,
	actors: () => [hero(960, {moves: [mv('001', '001+40', 960, -260)], ges: [{g: 'presentF', t0: '002', t1: '002+80'}]})],
	gfx: (c) => (
		<>
			<Coin f={c.f} t0={c.t('001+4')} t1={c.t('001e+60')} x={1280} y={640} flips={4} face="H" />
			<Burst f={c.f} t0={c.t('001+38')} x={1280} y={640} />
			<Calendar f={c.f} t0={c.t('002+80')} t1={c.t('002e+40')} x={1380} y={330} />
		</>
	),
});

/* ----------------------------------------------------------- 2. bed, tonight */
const S003 = sc({
	bg: 'bedroom',
	night: true,
	tint: 'flat',
	cam: [[1300, 600, 1.0], [1420, 600, 1.25]],
	light: {x: 60, y: 10, o: 0.35, night: true},
	actors: () => [],
	badge: undefined,
	gfx: (c) => (
		<>
			<Sleeper x={1500} y={700} s={1.0} />
			<Tag f={c.f} t0={c.t('004')} t1={c.t('004e')} x={1100} y={270} text="LUCK" sub="not your body. not your brain." />
			<Burst f={c.f} t0={c.t('004+30')} x={1500} y={600} c={LIME} r={260} />
		</>
	),
	over: () => <Blanket night f={0} />,
});

/* --------------------------------------------------- 3. wake up before alarm */
const S007 = sc({
	bg: 'bedroom',
	tint: 'flat',
	cam: [[1100, 620, 1.0], [1000, 580, 1.2]],
	badge: 0,
	actors: () => [hero(1450, {moves: [mv('007+60', '008', 900)], ges: [{g: 'presentF', t0: '007+30', t1: '007+90'}], sit: undefined})],
	gfx: (c) => <Tag f={c.f} t0={c.t('007+20')} t1={c.t('008e')} x={900} y={250} text="1 MIN BEFORE THE ALARM" sub="you just feel rested" size={46} />,
});

/* -------------------------------------------------------------- 4. the egg */
const S009 = sc({
	bg: 'kitchen',
	cam: [[900, 600, 1.0], [980, 620, 1.35]],
	badge: 0,
	actors: () => [hero(700, {facing: 1, ges: [{g: 'think', t0: '009+10', t1: '009e'}, {g: 'presentF', t0: '010+40', t1: '010e'}]})],
	gfx: (c) => (
		<>
			<Egg f={c.f} t0={c.t('010')} t1={c.t('010e+30')} x={1050} y={700} s={1.5} />
			<Tag f={c.f} t0={c.t('010+30')} t1={c.t('010e+30')} x={1050} y={400} text="TWO YOLKS" size={50} />
		</>
	),
});

/* ------------------------------------------------------------ 5. the bus */
const S011 = sc({
	bg: 'street',
	whip: true,
	cam: [[900, 600, 1.0], [1000, 580, 1.15]],
	badge: 0,
	actors: () => [hero(480, {moves: [mv('011', '011+110', 920, -250)]})],
	gfx: (c) => <Bus f={c.f} t0={c.t('011+96')} t1={c.t('011e')} stopX={1380} from={2600} />,
});

/* ------------------------------------------------------- 6. green lights */
const S012 = sc({
	bg: 'street',
	cam: [[960, 560, 1.0], [1100, 560, 1.2]],
	badge: 0,
	actors: (c) => [hero(700, {moves: [mv('012', '013e', 1200, 300)], ges: [{g: 'wave', t0: '014', t1: '014e'}], expr: c.f > c.t('014') ? 'wide' : 'normal'})],
	gfx: (c) => (
		<>
			<Lights f={c.f} t0={c.t('012')} t1={c.t('013e')} x={960} y={420} n={5} />
			<Tag f={c.f} t0={c.t('013')} t1={c.t('013e+20')} x={960} y={190} text="EVERY. SINGLE. ONE." size={52} />
		</>
	),
});

/* ----------------------------------------------------- 7. the lottery ticket */
const S015 = sc({
	bg: 'street',
	tint: 'day',
	cam: [[860, 560, 1.15], [880, 540, 1.5]],
	badge: 0,
	actors: () => [hero(780, {ges: [{g: 'scratch', t0: '015', t1: '015+70'}, {g: 'touchFace', t0: '016+10', t1: '016e'}]})],
	gfx: (c) => <Ticket f={c.f} t0={c.t('015+60')} t1={c.t('016e')} x={1260} y={420} s={0.95} />,
});

/* --------------------------------------------------------- 8. the odds */
const S017 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [960, 520, 1.12]],
	actors: () => [hero(330, {s: 0.95, facing: 1, ges: [{g: 'handsOnHead', t0: '020', t1: '020e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('018')} t1={c.t('018e')} x={1150} y={250} text="1 IN 292,000,000" sub="matching every number" size={64} />
			<HeadsGrid f={c.f} t0={c.t('019')} t1={c.t('020e')} x={1150} y={330} n={28} cols={14} s={0.95} label="{n} HEADS IN A ROW" />
		</>
	),
});

/* ----------------------------------------------------------- 9. rich */
const S021 = sc({
	bg: 'street',
	tint: 'gold',
	cam: [[960, 580, 1.0], [980, 560, 1.15]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'fist', t0: '023', t1: '023e'}, {g: 'wave', t0: '024+50', t1: '024e'}]})],
	gfx: (c) => (
		<>
			<Money f={c.f} t0={c.t('021')} t1={c.t('024e')} x={1420} y={900} n={4} s={1.1} />
			<Banner f={c.f} t0={c.t('021+8')} t1={c.t('021e')} y={260} text="RICH" size={110} />
			<Banner f={c.f} t0={c.t('022')} t1={c.t('022e')} y={260} text="NOT NICE-DINNER RICH" size={70} c={GOLD} />
			<Banner f={c.f} t0={c.t('023')} t1={c.t('023e')} y={260} text="QUIT-YOUR-JOB RICH" size={70} c={GOLD} />
			<Banner f={c.f} t0={c.t('024')} t1={c.t('024+60')} y={260} text="BUY-A-HOUSE RICH" size={70} c={GOLD} />
		</>
	),
});

/* ------------------------------------------------------------- 10. casino */
const S025 = sc({
	bg: 'casino',
	whip: true,
	cam: [[900, 580, 1.0], [980, 580, 1.2]],
	badge: 0,
	actors: () => [hero(620, {moves: [mv('025', '026+40', 900, -250)], ges: [{g: 'presentF', t0: '027', t1: '027e'}]}), A('dealer', 1480, {facing: -1})],
	gfx: (c) => (
		<>
			<Chips f={c.f} t0={c.t('027')} t1={c.t('028+40')} x={1130} y={880} s={1.05} n={11} />
			<Tag f={c.f} t0={c.t('027')} t1={c.t('027e')} x={960} y={200} text="ALL ON RED" c="#ff5a5a" size={64} />
		</>
	),
});
const S028 = sc({
	bg: 'casino',
	cam: [[1100, 600, 1.0], [1160, 600, 1.35]],
	badge: 0,
	actors: (c) => [hero(700, {ges: [{g: 'fist', t0: '029', t1: '029e'}], expr: 'wide'}), A('dealer', 1520, {facing: -1, expr: c.f > c.t('030+40') ? 'worried' : 'normal'})],
	gfx: (c) => (
		<>
			<Roulette f={c.f} t0={c.t('028')} t1={c.t('030e')} x={1110} y={640} s={1.2} />
			<Tag f={c.f} t0={c.t('028+60')} t1={c.t('028e+10')} x={1110} y={310} text="RED" c="#ff5a5a" size={70} />
			<Tag f={c.f} t0={c.t('030')} t1={c.t('030e')} x={1110} y={310} text="RED AGAIN" c="#ff5a5a" size={70} />
		</>
	),
});
const S031 = sc({
	bg: 'casino',
	cam: [[1000, 580, 1.0], [1060, 580, 1.2]],
	badge: 0,
	actors: () => [hero(620, {ges: [{g: 'shrug', t0: '032', t1: '032e'}, {g: 'scratch', t0: '034', t1: '034e'}]}), A('suit', 1500, {facing: -1, faceTurn: 0.6, ges: [{g: 'armsCrossed', t0: '031', t1: '035'}, {g: 'point', t0: '035', t1: '035e'}], look: [-1, 0]}), A('dealer', 1150, {facing: -1, expr: 'worried'})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('032')} t1={c.t('033e')} x={960} y={190} text="NOTHING TO CATCH" size={54} />
			<Tag f={c.f} t0={c.t('034')} t1={c.t('034e')} x={960} y={190} text="NO FINGERPRINTS" size={54} c={GOLD} />
		</>
	),
});

/* ----------------------------------------------------------- 11. the road */
const S036 = sc({
	bg: 'highway',
	whip: true,
	cam: [[860, 600, 1.0], [1050, 590, 1.2]],
	badge: 0,
	actors: () => [hero(300, {moves: [mv('037', '038+10', 960, 200), mv('039', '040e', 1500)], expr: 'normal'}), A('biker', 1900, {moves: [{t0: '040', t1: '040+50', x1: -400}], facing: -1, uid: 'bk'})],
	gfx: (c) => (
		<>
			<Truck f={c.f} t0={c.t('038-8')} t1={c.t('038e')} stopX={560} from={-800} />
			<Bird f={c.f} t0={c.t('039')} t1={c.t('039e')} x={1000} y={640} s={1.2} />
			<Tag f={c.f} t0={c.t('038+20')} t1={c.t('038e')} x={960} y={190} text="STOPS AN INCH AWAY" size={54} />
		</>
	),
});
const S041 = sc({
	bg: 'highway',
	tint: 'x',
	cam: [[860, 560, 1.5], [900, 560, 1.9]],
	badge: 0,
	actors: () => [hero(860, {expr: 'normal', ges: [{g: 'shrug', t0: '041+40', t1: '041e'}]})],
	gfx: (c) => <Tag f={c.f} t0={c.t('041+30')} t1={c.t('042e')} x={1340} y={400} text="FEAR: 0%" size={54} c="#9ff0b0" />,
});

/* ----------------------------------------------------------- 12. history */
const S043 = sc({
	bg: 'void',
	whip: true,
	cam: [[960, 560, 1.0], [1000, 560, 1.15]],
	actors: () => [hero(660, {faceTurn: 0.5, ges: [{g: 'think', t0: '043+10', t1: '044e'}]})],
	gfx: (c) => (
		<>
			<Question f={c.f} t0={c.t('043+20')} t1={c.t('044e')} x={1280} y={470} s={1.1} />
			<Tag f={c.f} t0={c.t('044')} t1={c.t('044e')} x={1100} y={190} text="PEOPLE WHO LOOK LIKE YOU" size={50} />
		</>
	),
});
const S045 = sc({
	bg: 'void',
	cam: [[1100, 540, 1.0], [1000, 540, 1.12]],
	actors: () => [hero(330, {s: 0.9, faceTurn: 0.6, look: [1, 0]})],
	gfx: (c) => (
		<>
			<Card f={c.f} t0={c.t('045')} t1={c.t('049e')} x={1130} y={520} title="TSUTOMU YAMAGUCHI" year="1945" lines={['Hiroshima — bomb. Survived.', 'Nagasaki — second bomb.', 'Survived. Again.']} icon={<Atom />} />
		</>
	),
});
const S050 = sc({
	bg: 'void',
	cam: [[960, 540, 1.0], [980, 540, 1.2]],
	actors: () => [hero(480, {ges: [{g: 'think', t0: '050', t1: '050e'}, {g: 'scratch', t0: '052', t1: '052e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('050')} t1={c.t('050e')} x={1250} y={300} text="LUCKY?" c={GOLD} size={110} />
			<Tag f={c.f} t0={c.t('050+60')} t1={c.t('051e')} x={1250} y={470} text="OR UNLUCKY?" c="#ff6a5a" size={80} />
			<Banner f={c.f} t0={c.t('052')} t1={c.t('052e')} y={900} text="HOLD ON TO THIS QUESTION" size={58} />
		</>
	),
});
const S053 = sc({
	bg: 'void',
	cam: [[1100, 540, 1.0], [1000, 540, 1.1]],
	actors: () => [hero(330, {s: 0.9, faceTurn: 0.6, look: [1, 0]})],
	gfx: (c) => <Card f={c.f} t0={c.t('053')} t1={c.t('055e')} x={1130} y={520} title="VIOLET JESSUP" year="1911–16" lines={['Olympic — collision.', 'Titanic — sank.', 'Britannic — sank. She lived.']} icon={<Ship />} tilt={2} />,
});
const S056 = sc({
	bg: 'void',
	cam: [[1100, 540, 1.0], [1000, 540, 1.1]],
	actors: () => [hero(330, {s: 0.9, faceTurn: 0.6, look: [1, 0], ges: [{g: 'handsOnHead', t0: '056+60', t1: '056e'}]})],
	gfx: (c) => <Card f={c.f} t0={c.t('056')} t1={c.t('057e')} x={1130} y={520} title="ROY SULLIVAN" lines={['Park ranger.', 'Struck by lightning', 'SEVEN times. Survived.']} icon={<Bolt />} />,
});
const S058 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [980, 560, 1.15]],
	badge: 0,
	actors: () => [hero(960, {moves: [mv('061', '062e', 1500)], ges: [{g: 'handsOnHead', t0: '060+10', t1: '061'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('058')} t1={c.t('059e')} x={650} y={260} text="HALF TERRIBLE" c="#ff6a5a" size={58} rot={-4} />
			<Tag f={c.f} t0={c.t('058+30')} t1={c.t('059e')} x={1280} y={260} text="HALF WONDERFUL" c={LIME} size={58} rot={3} />
			<Tag f={c.f} t0={c.t('060')} t1={c.t('061')} x={960} y={160} text="STAND IN THE STORM" size={52} />
			<Tag f={c.f} t0={c.t('062')} t1={c.t('063e')} x={1100} y={190} text="YOU ONLY GET THE WALKING OUT" size={52} c={GOLD} />
		</>
	),
});

/* ------------------------------------------------------- 13. fair to luck */
const S064 = sc({
	bg: 'void',
	cam: [[960, 540, 1.0], [960, 540, 1.15]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'shrug', t0: '064+20', t1: '064e'}, {g: 'presentF', t0: '065', t1: '065e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('064')} t1={c.t('065e')} x={960} y={200} text="BEING FAIR TO THE UNIVERSE" size={52} />
		</>
	),
});
const S066 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [960, 540, 1.12]],
	actors: () => [],
	gfx: (c) => (
		<>
			<Halving
				f={c.f}
				t0={c.t('066')}
				t1={c.t('069e')}
				x={960}
				y={300}
				stages={[
					{at: c.t('066'), n: 1_000_000, label: '1,000,000 FLIP A COIN'},
					{at: c.t('067'), n: 500_000, label: '500,000 STILL STANDING'},
					{at: c.t('068'), n: 1000, label: '1,000 AFTER 10 ROUNDS'},
					{at: c.t('069'), n: 1, label: 'ONE PERSON LEFT'},
				]}
			/>
		</>
	),
});
const S070 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [980, 540, 1.2]],
	actors: () => [A('stranger', 960, {s: 1.1, ges: [{g: 'presentF', t0: '070', t1: '071'}, {g: 'fist', t0: '072', t1: '072e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('070')} t1={c.t('070e')} x={640} y={240} text="INTERVIEWS" size={54} />
			<Tag f={c.f} t0={c.t('071')} t1={c.t('071e')} x={1300} y={240} text="A BOOK" size={54} />
			<Tag f={c.f} t0={c.t('072')} t1={c.t('072e')} x={960} y={190} text="NOT A ROUTINE. ARITHMETIC." size={52} c={GOLD} />
			<Banner f={c.f} t0={c.t('073')} t1={c.t('074e')} y={900} text="SOMEBODY ALWAYS WINS" size={56} />
		</>
	),
});
const S075 = sc({
	bg: 'void',
	cam: [[1000, 540, 1.0], [960, 540, 1.1]],
	actors: () => [hero(300, {s: 0.9, look: [1, 0]})],
	gfx: (c) => <Card f={c.f} t0={c.t('075')} t1={c.t('077e')} x={1130} y={520} title="SURVIVORSHIP BIAS" lines={['We only hear from', 'the ones who walked out.', 'The rest aren’t invited.']} />,
});
const S078 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [960, 520, 1.25]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'presentF', t0: '081', t1: '081e'}, {g: 'fist', t0: '082', t1: '082e'}]})],
	back: () => (
		<>
			<polygon points="960,-100 560,900 1360,900" fill="#fff6c8" opacity={0.14} />
		</>
	),
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('078')} t1={c.t('079e')} x={960} y={170} text="NO CORRIDOR. NOBODY FALLS BEHIND." size={44} />
			<Tag f={c.f} t0={c.t('080')} t1={c.t('080e')} x={620} y={330} text="THE FILTER IS GONE" size={48} c="#ff6a5a" />
			<Tag f={c.f} t0={c.t('081')} t1={c.t('083e')} x={1300} y={330} text="ON STAGE FOREVER" size={48} c={GOLD} />
		</>
	),
});

/* ------------------------------------------------------------- 14. day four */
const S084 = sc({
	bg: 'mansion',
	whip: true,
	cam: [[900, 580, 1.0], [1000, 580, 1.15]],
	badge: 0,
	actors: () => [hero(560, {moves: [mv('084', '085', 800, 480)], ges: [{g: 'scratch', t0: '084+60', t1: '084e'}, {g: 'shrug', t0: '087', t1: '087e'}], expr: 'normal', look: [0.5, -0.3]}), A('friend', 1500, {moves: [{t0: '088', t1: '089e', x1: 1250, x0: 2250}], facing: -1}), A('seller', 1800, {moves: [{t0: '089', t1: '090e', x1: 1480, x0: 2400}], facing: -1})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('085')} t1={c.t('086e')} x={1000} y={200} text="A DESIGNER PICKED IT" size={50} />
			<Tag f={c.f} t0={c.t('087')} t1={c.t('087e')} x={1000} y={200} text="THE MONEY JUST ARRIVED" size={50} c={GOLD} />
			<Tag f={c.f} t0={c.t('088')} t1={c.t('090e')} x={1000} y={200} text="FRIENDS ARRIVED TOO. SMILING." size={50} />
		</>
	),
});
const S091 = sc({
	bg: 'mansion',
	cam: [[960, 560, 1.0], [880, 540, 1.3]],
	badge: 0,
	actors: () => [hero(620, {ges: [{g: 'touchFace', t0: '091', t1: '092e'}, {g: 'shrug', t0: '093', t1: '094e'}]}), A('suit', 1360, {facing: -1, ges: [{g: 'presentF', t0: '091', t1: '092e'}, {g: 'point', t0: '093', t1: '095e'}]})],
	gfx: (c) => (
		<>
			<Chart f={c.f} t0={c.t('092+10')} t1={c.t('093e')} x={1100} y={420} s={0.62} label="x3" />
			<Chart f={c.f} t0={c.t('094+10')} t1={c.t('095e')} x={1100} y={420} s={0.62} label="x3 AGAIN" c={GOLD} />
			<Tag f={c.f} t0={c.t('094')} t1={c.t('094e')} x={960} y={170} text="A PLAN SO BAD…" size={50} c="#ff6a5a" />
		</>
	),
});
const S096 = sc({
	bg: 'mansion',
	cam: [[780, 560, 1.4], [800, 560, 1.7]],
	badge: 0,
	actors: () => [hero(800, {expr: 'worried', mouth: 'flat', ges: [{g: 'rubChin', t0: '096', t1: '097e'}]})],
	gfx: (c) => (
		<>
			<Banner f={c.f} t0={c.t('096')} t1={c.t('096e')} y={300} text="WHAT DID I DO?" size={70} c="#ffffff" />
			<Banner f={c.f} t0={c.t('096+40')} t1={c.t('097e')} y={400} text="NOTHING." size={100} c="#ff6a5a" />
			<Tag f={c.f} t0={c.t('098')} t1={c.t('098e')} x={1280} y={290} text="RISK: ERASED" size={50} c={LIME} />
		</>
	),
});

/* --------------------------------------------------------------- 15. the tree */
const S099 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [960, 520, 1.15]],
	actors: () => [hero(350, {s: 0.95, look: [1, -0.3], ges: [{g: 'think', t0: '099', t1: '100e'}]})],
	gfx: (c) => (
		<>
			<Tree f={c.f} t0={c.t('100')} t1={c.t('105e')} x={1180} y={880} s={1.25} depth={5} />
			<Tag f={c.f} t0={c.t('099')} t1={c.t('100e')} x={1180} y={190} text="EVERY CHOICE HAS A TREE" size={50} />
			<Tag f={c.f} t0={c.t('102')} t1={c.t('103e')} x={1180} y={190} text="A BUNDLE OF POSSIBLE EVENINGS" size={46} c={GOLD} />
			<Tag f={c.f} t0={c.t('106')} t1={c.t('106e')} x={1180} y={190} text="THE BAD ONES MAKE THE GOOD ONES GOOD" size={42} c="#ff9a8a" />
		</>
	),
});
const S107 = sc({
	bg: 'highway',
	tint: 'x',
	cam: [[900, 600, 1.0], [1050, 590, 1.2]],
	badge: 0,
	actors: () => [hero(420, {moves: [mv('107', '108e', 1000)], ges: [{g: 'wave', t0: '109', t1: '109e'}, {g: 'shrug', t0: '112', t1: '112e'}]})],
	gfx: (c) => (
		<>
			<Glass f={c.f} t0={c.t('108')} t1={c.t('112e')} x={1400} y={840} s={1.4} fill={c.f < c.t('109') ? 1 : 0.85} sun />
			<Tag f={c.f} t0={c.t('107')} t1={c.t('107e')} x={960} y={190} text="COMPARE, DON’T MEASURE" size={50} />
			<Tag f={c.f} t0={c.t('110')} t1={c.t('111e')} x={960} y={190} text="LUCK DELETES THE DESERT" size={50} c={GOLD} />
		</>
	),
});

/* ---------------------------------------------------------- 16. day five */
const S113 = sc({
	bg: 'stadium',
	whip: true,
	cam: [[960, 580, 1.0], [980, 570, 1.18]],
	badge: 0,
	actors: () => [hero(700, {facing: 1, ges: [], expr: 'normal'}), A('friend', 1130, {facing: -1, expr: 'wide', ges: [{g: 'fist', t0: '115', t1: '117e'}, {g: 'handsOnHead', t0: '116', t1: '116e'}], squash: 0}), A('stranger', 1550, {facing: -1, expr: 'worried', s: 0.8})],
	gfx: (c) => (
		<>
			<Score f={c.f} t0={c.t('113')} t1={c.t('119e')} x={960} y={210} a={0} b={3} />
			<Tag f={c.f} t0={c.t('118')} t1={c.t('119e')} x={700} y={420} text="YOU ALREADY KNOW" size={46} c={LIME} />
		</>
	),
});
const S120 = sc({
	bg: 'stadium',
	tint: 'cheer',
	cam: [[960, 560, 1.0], [960, 560, 1.3]],
	badge: 0,
	actors: () => [hero(800, {expr: 'normal', mouth: 'smile'}), A('friend', 1100, {facing: -1, expr: 'wide', ges: [{g: 'handsOnHead', t0: '121', t1: '122e'}]})],
	gfx: (c) => (
		<>
			<Score f={c.f} t0={c.t('120')} t1={c.t('124e')} x={960} y={210} a={0} b={3} goalAt={c.t('120+60')} />
			<Burst f={c.f} t0={c.t('120+60')} x={960} y={300} r={320} />
			<Tag f={c.f} t0={c.t('122')} t1={c.t('124e')} x={820} y={400} text="YOU FEEL NOTHING" size={50} c="#9ba58a" />
		</>
	),
});

/* ---------------------------------------------------------- 17. day six */
const S125 = sc({
	bg: 'mountain',
	whip: true,
	cam: [[960, 580, 1.0], [1040, 570, 1.2]],
	badge: 0,
	actors: () => [hero(500, {moves: [mv('125+30', '126e', 1500)], expr: 'normal'})],
	gfx: (c) => <Tag f={c.f} t0={c.t('126')} t1={c.t('126e')} x={960} y={190} text="NO ROPE" size={60} c="#ff6a5a" />,
});
const S127 = sc({
	bg: 'sea',
	whip: true,
	cam: [[900, 640, 1.0], [980, 640, 1.2]],
	badge: 0,
	actors: () => [hero(700, {moves: [mv('127', '127e+30', 1300, 400)], hideLegs: false})],
	gfx: (c) => <Tag f={c.f} t0={c.t('127')} t1={c.t('127e')} x={960} y={190} text="ROUGH WATER" size={60} c="#7acbff" />,
});
const S128 = sc({
	bg: 'highway',
	tint: 'x',
	whip: true,
	cam: [[960, 580, 1.0], [960, 560, 1.2]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'wave', t0: '128', t1: '128e'}, {g: 'shrug', t0: '129', t1: '129e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('128')} t1={c.t('128e')} x={960} y={190} text="TOO FAST. WINDOWS DOWN." size={54} />
			<Tag f={c.f} t0={c.t('129')} t1={c.t('129e')} x={960} y={190} text="NOTHING EVEN COMES CLOSE" size={54} c={GOLD} />
		</>
	),
});
const S130 = sc({
	bg: 'mountain',
	cam: [[960, 560, 1.2], [960, 540, 1.5]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'think', t0: '130+30', t1: '130e'}, {g: 'fist', t0: '131+30', t1: '131e'}]})],
	back: (c) => <path d={`M960,200 Q${900 + Math.sin(c.f / 20) * 20},500 960,740`} stroke="#ffd34a" strokeWidth={9} fill="none" strokeLinecap="round" />,
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('130+60')} t1={c.t('130e')} x={960} y={140} text="WHY PEOPLE CLIMB" size={48} />
			<Tag f={c.f} t0={c.t('131')} t1={c.t('131e')} x={1340} y={420} text="TO FEEL THE ROPE" size={54} c={GOLD} />
		</>
	),
});

/* ------------------------------------------------------------- 18. dinner */
const dinner = (hx = 560): AS[] => [
	hero(hx, {sit: 800, facing: 1, pose: undefined, mouth: 'smile'}),
	A('mom', 960, {sit: 800, facing: -1}),
	A('dad', 1360, {sit: 800, facing: -1}),
	A('grandma', 1700, {sit: 800, facing: -1}),
];
const S132 = sc({
	bg: 'dining',
	whip: true,
	cam: [[960, 600, 1.0], [1040, 600, 1.15]],
	badge: 0,
	actors: () => dinner().map((a, i) => (i === 2 ? {...a, ges: [{g: 'presentF', t0: '134', t1: '135e'}]} : a)),
	gfx: (c) => (
		<>
			<Table />
			<Tag f={c.f} t0={c.t('133')} t1={c.t('133e')} x={960} y={300} text="MOM COOKED ALL DAY" size={46} c={GOLD} />
			<Tag f={c.f} t0={c.t('134')} t1={c.t('135e')} x={1360} y={300} text="THE BIKE STORY ×100" size={46} />
		</>
	),
});
const S136 = sc({
	bg: 'dining',
	cam: [[700, 620, 1.3], [640, 620, 1.55]],
	badge: 0,
	actors: () => dinner().map((a, i) => (i === 0 ? {...a, expr: 'sad', look: [0.4, 0.6], ges: [{g: 'scratch', t0: '137+40', t1: '137e'}]} : a)),
	gfx: (c) => (
		<>
			<Table />
			<Tag f={c.f} t0={c.t('137')} t1={c.t('137e')} x={700} y={260} text="NO STORY OF YOUR OWN" size={46} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('139')} t1={c.t('139e')} x={700} y={260} text="SOMETHING WONDERFUL." size={46} />
			<Tag f={c.f} t0={c.t('140')} t1={c.t('140e')} x={700} y={260} text="AND THEN… SOMETHING WONDERFUL." size={46} c={GOLD} />
		</>
	),
});
const S141 = sc({
	bg: 'dining',
	cam: [[960, 600, 1.0], [960, 590, 1.2]],
	badge: 0,
	actors: () => dinner(700).map((a, i) => (i === 1 ? {...a, ges: [{g: 'presentF', t0: '141', t1: '143e'}]} : a)),
	gfx: (c) => (
		<>
			<Table />
			<Tag f={c.f} t0={c.t('142')} t1={c.t('142e')} x={560} y={240} text="THE FLAT TIRE" size={50} />
			<Tag f={c.f} t0={c.t('143')} t1={c.t('143+90')} x={1000} y={240} text="THE WRONG TRAIN" size={50} />
			<Tag f={c.f} t0={c.t('143+90')} t1={c.t('144e')} x={1400} y={240} text="THE LOST WALLET" size={50} c={GOLD} />
			<Banner f={c.f} t0={c.t('144')} t1={c.t('144e')} y={170} text="THE MESS IS THE MEMORY" size={62} />
		</>
	),
});
const S145 = sc({
	bg: 'dining',
	cam: [[1000, 620, 1.2], [1100, 620, 1.45]],
	badge: 0,
	actors: () => [hero(1200, {sit: 800, facing: 1, expr: 'normal'}), A('grandma', 1500, {sit: 800, facing: -1, ges: [{g: 'presentF', t0: '145', t1: '145e'}]}), A('mom', 700, {sit: 800, facing: 1})],
	gfx: (c) => (
		<>
			<Table x={1100} w={1100} />
			<Say c={c} t0="146" t1="146e" x={1500} y={350} text="You look tired, sweetheart." />
			<Say c={c} t0="147" t1="148" x={1200} y={350} w={500} text="I'm not. That's the problem." />
			<Say c={c} t0="148+90" t1="149e" x={1200} y={350} w={420} text="I never am." />
		</>
	),
});

/* ------------------------------------------------------------ 19. day seven */
const S150 = sc({
	bg: 'street',
	tint: 'day',
	whip: true,
	cam: [[960, 580, 1.0], [980, 570, 1.18]],
	badge: 0,
	actors: () => [hero(1300, {facing: -1, ges: [{g: 'wave', t0: '150+40', t1: '150e'}]}), A('girl', 600, {moves: [{t0: '150', t1: '150+90', x1: 1000, x0: -260}], facing: 1, expr: 'sad', mouth: 'frown'})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('151')} t1={c.t('151e')} x={960} y={190} text="FROM BEFORE THE MONEY" size={50} />
			<Tag f={c.f} t0={c.t('153')} t1={c.t('154e')} x={960} y={190} text="HER BUSINESS IS FAILING" size={50} c="#ff9a8a" />
		</>
	),
});
const S155 = sc({
	bg: 'street',
	tint: 'day',
	cam: [[960, 580, 1.0], [980, 570, 1.2]],
	badge: 0,
	actors: (c) => [hero(900, {facing: 1, ges: [{g: 'presentF', t0: '155', t1: '156e'}]}), A('girl', 1200, {facing: -1, expr: c.f > c.t('158') ? 'normal' : 'sad', mouth: c.f > c.t('158') ? 'smile' : 'frown', ges: [{g: 'wave', t0: '159', t1: '159e'}]})],
	gfx: (c) => (
		<>
			<Money f={c.f} t0={c.t('156')} t1={c.t('157e')} x={1050} y={900} n={3} s={0.9} />
			<Chart f={c.f} t0={c.t('158')} t1={c.t('159e')} x={1050} y={430} s={0.55} label="SHOP SAVED" />
			<Heart f={c.f} t0={c.t('159')} t1={c.t('159e')} x={1050} y={260} s={0.8} />
		</>
	),
});
const S160 = sc({
	bg: 'street',
	tint: 'dusk',
	cam: [[900, 580, 1.0], [1000, 570, 1.25]],
	badge: 0,
	actors: () => [hero(500, {facing: 1, expr: 'worried', look: [1, 0], ges: [{g: 'touchFace', t0: '162', t1: '163e'}]}), A('girl', 1400, {facing: -1, ges: [{g: 'presentF', t0: '161', t1: '163e'}]})],
	gfx: (c) => (
		<>
			<Say c={c} t0="161" t1="161e" x={1400} y={400} w={560} text="Honestly, I don't think I did anything." />
			<Say c={c} t0="162" t1="163e" x={1400} y={400} w={560} text="It was all him." />
		</>
	),
});
const S164 = sc({
	bg: 'void',
	cam: [[960, 560, 1.2], [960, 540, 1.5]],
	badge: 0,
	actors: () => [hero(960, {expr: 'sad', mouth: 'flat', ges: [{g: 'think', t0: '165', t1: '166e'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('165')} t1={c.t('165e')} x={960} y={160} text="NOBODY’S HERO" size={54} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('166')} t1={c.t('166e')} x={960} y={160} text="NOBODY’S ANYTHING" size={54} c="#ff9a8a" />
			<Banner f={c.f} t0={c.t('167')} t1={c.t('167e+20')} y={900} text="A WEATHER SYSTEM. NOT A PERSON." size={60} />
		</>
	),
});

/* ------------------------------------------------------------ 20. day eight */
const S168 = sc({
	bg: 'kitchen',
	whip: true,
	cam: [[900, 600, 1.0], [980, 600, 1.2]],
	badge: 0,
	actors: () => [hero(700, {ges: [{g: 'think', t0: '169', t1: '170+40'}, {g: 'presentF', t0: '171', t1: '172+90'}, {g: 'fist', t0: '173', t1: '173e'}]})],
	gfx: (c) => (
		<>
			<Coin f={c.f} t0={c.t('171+30')} t1={c.t('171e')} x={1000} y={620} face="T" flips={4} />
			<Coin f={c.f} t0={c.t('172+60')} t1={c.t('172e')} x={1000} y={620} face="H" flips={4} />
			<Tag f={c.f} t0={c.t('169')} t1={c.t('170e')} x={960} y={190} text="ONE THING THAT CAN GO WRONG" size={46} />
			<Glassy f={c.f} t0={c.t('173+30')} t1={c.t('174e')} fly={[1500, 700]} />
			<Pillow f={c.f} t0={c.t('174')} t1={c.t('174e')} x={1560} y={780} />
		</>
	),
});
const S175 = sc({
	bg: 'cafe',
	whip: true,
	cam: [[1000, 600, 1.0], [1100, 600, 1.2]],
	badge: 0,
	actors: () => [hero(1100, {sit: 800, facing: 1, expr: 'normal'}), A('girl', 1450, {sit: 800, facing: -1, mouth: 'smile', ges: [{g: 'wave', t0: '177', t1: '177+60'}]})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('176')} t1={c.t('177e')} x={960} y={190} text="THE GIRL FROM THE COFFEE SHOP" size={46} />
			<Say c={c} t0="177+10" t1="177e" x={1450} y={360} w={360} text="Ha-ha-ha!" />
			<Tag f={c.f} t0={c.t('178')} t1={c.t('178e')} x={960} y={190} text="YOU NEVER ASKED HER NAME" size={46} c="#ff9a8a" />
		</>
	),
});
const S179 = sc({
	bg: 'cafe',
	cam: [[1000, 620, 1.1], [1150, 620, 1.4]],
	badge: 0,
	actors: () => [hero(1100, {sit: 800, facing: 1, expr: 'worried', ges: [{g: 'handsOnHead', t0: '182+20', t1: '183e'}]}), A('girl', 1450, {sit: 800, facing: -1, mouth: 'smile'})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('181')} t1={c.t('181e')} x={1300} y={300} text="…AND SHE SMILES" size={46} c={GOLD} />
			<Tag f={c.f} t0={c.t('182')} t1={c.t('183e')} x={1300} y={300} text="SCARED. FINALLY." size={56} c={LIME} />
		</>
	),
});
const S184 = sc({
	bg: 'void',
	cam: [[960, 560, 1.0], [960, 540, 1.15]],
	badge: 0,
	actors: () => [hero(450, {s: 1.0, look: [1, -0.2], ges: [{g: 'think', t0: '184', t1: '185e'}]})],
	gfx: (c) => (
		<>
			<Question f={c.f} t0={c.t('184')} t1={c.t('184e')} x={1250} y={460} s={1.2} />
			<Coin f={c.f} t0={c.t('184+60')} t1={c.t('185e')} x={900} y={500} face="H" flips={3} s={0.8} />
			<Lights f={c.f} t0={c.t('185')} t1={c.t('185e')} x={1260} y={330} n={2} s={0.7} />
			<Chart f={c.f} t0={c.t('185+40')} t1={c.t('185e')} x={1500} y={330} s={0.4} label="$" />
			<Tag f={c.f} t0={c.t('186')} t1={c.t('187')} x={1250} y={250} text="A PERSON IS NOT A COIN" size={52} />
			<Tag f={c.f} t0={c.t('187')} t1={c.t('189e')} x={1250} y={250} text="A PERSON IS A MIND" size={56} c={GOLD} />
			<Tag f={c.f} t0={c.t('190')} t1={c.t('190e')} x={1250} y={250} text="A RISK YOU COULD STILL LOSE" size={46} />
		</>
	),
});
const S191 = sc({
	bg: 'cafe',
	cam: [[1000, 620, 1.1], [1150, 620, 1.35]],
	badge: 0,
	actors: () => [hero(1100, {sit: 800, facing: 1, expr: 'worried', ges: [{g: 'scratch', t0: '192', t1: '193e'}]}), A('girl', 1450, {sit: 800, facing: -1, expr: 'normal', mouth: 'flat'})],
	gfx: (c) => (
		<>
			<Say c={c} t0="192+10" t1="193e" x={1100} y={360} w={520} text="Dinner? …tonight? Maybe?" />
			<Say c={c} t0="195" t1="196" x={1450} y={360} w={400} text="I can't. I'm sorry." />
		</>
	),
});
const S196 = sc({
	bg: 'cafe',
	cam: [[1100, 600, 1.4], [1100, 600, 1.8]],
	badge: 0,
	actors: () => [hero(1100, {sit: 800, facing: 1, expr: 'sad', mouth: 'flat', squash: 0.0, ges: [{g: 'touchFace', t0: '197', t1: '199e'}]})],
	gfx: (c) => (
		<>
			<Heart f={c.f} t0={c.t('197')} t1={c.t('199e')} x={1300} y={400} s={0.9} broken={c.f > c.t('197+30')} />
			<Banner f={c.f} t0={c.t('197')} t1={c.t('198+60')} y={260} text="SHARP. HEAVY. REAL." size={64} c="#ffffff" />
			<Tag f={c.f} t0={c.t('199')} t1={c.t('199e')} x={1100} y={200} text="THE HURT IS WONDERFUL" size={52} c={LIME} />
		</>
	),
});
const S200 = sc({
	bg: 'street',
	tint: 'pink',
	whip: true,
	cam: [[960, 570, 1.0], [980, 560, 1.18]],
	badge: 0,
	actors: () => [hero(960, {moves: [mv('202', '207e', 1500, 500)], expr: 'normal', ges: [{g: 'handsOnHead', t0: '200', t1: '201e'}]})],
	gfx: (c) => (
		<>
			<Burst f={c.f} t0={c.t('200+10')} x={960} y={400} c={LIME} r={300} />
			<Tag f={c.f} t0={c.t('201')} t1={c.t('201e')} x={960} y={190} text="STILL A PERSON WHO CAN LOSE" size={50} />
			<Scent f={c.f} t0={c.t('204')} t1={c.t('204e')} x={1500} y={620} s={1.3} />
			<Tag f={c.f} t0={c.t('205')} t1={c.t('205e')} x={960} y={190} text="A VERY SPECIFIC PINK" size={52} c="#ff9ac8" />
			<Tag f={c.f} t0={c.t('203')} t1={c.t('203e')} x={960} y={190} text="CRACKED SIDEWALK" size={52} c={GOLD} />
		</>
	),
});
const S208 = sc({
	bg: 'void',
	whip: true,
	cam: [[1100, 540, 1.0], [1000, 540, 1.15]],
	actors: () => [hero(330, {s: 0.9, faceTurn: 0.6, look: [1, 0]})],
	gfx: (c) => (
		<>
			<Card f={c.f} t0={c.t('208+30')} t1={c.t('210e')} x={1130} y={520} title="YAMAGUCHI" year="1945" lines={['The luckiest man?', 'Or the unluckiest?']} icon={<Atom />} />
			<Banner f={c.f} t0={c.t('211')} t1={c.t('212e')} y={900} text="THE ANSWER: HE WAS ALIVE" size={64} />
		</>
	),
});
const S213 = sc({
	bg: 'void',
	cam: [[960, 540, 1.0], [960, 520, 1.15]],
	actors: () => [hero(960, {s: 0.7, floor: 900, ges: [{g: 'think', t0: '213', t1: '214e'}]})],
	gfx: (c) => (
		<>
			<Ancestors f={c.f} t0={c.t('214')} t1={c.t('218e')} x={960} y={720} s={0.85} />
			<Tag f={c.f} t0={c.t('213')} t1={c.t('213e')} x={960} y={160} text="THE ODDS OF YOU" size={56} />
			<Tag f={c.f} t0={c.t('216')} t1={c.t('217e')} x={960} y={160} text="A STAGGERINGLY SMALL CHANCE" size={52} c={GOLD} />
			<Tag f={c.f} t0={c.t('218')} t1={c.t('218e')} x={960} y={160} text="YOU GET TO TRY" size={64} c={LIME} />
		</>
	),
});

/* ------------------------------------------------------------ 21. day ten */
const S219 = sc({
	bg: 'street',
	whip: true,
	cam: [[960, 580, 1.0], [1060, 580, 1.2]],
	badge: 0,
	actors: () => [hero(500, {moves: [mv('220+30', '221', 1800, 600)], ges: [{g: 'handsOnHead', t0: '222', t1: '223e'}], expr: 'normal'}), A('stranger', 1500, {facing: -1, expr: 'worried'})],
	gfx: (c) => (
		<>
			<Bus f={c.f} t0={c.t('220')} t1={c.t('221e')} stopX={1300} from={2400} leaveAt={c.t('220+20')} />
			<Tag f={c.f} t0={c.t('219')} t1={c.t('219e')} x={960} y={190} text="THE GLOW IS GONE" size={54} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('221')} t1={c.t('221e')} x={960} y={190} text="MISSED THE BUS" size={60} c={GOLD} />
			<Say c={c} t0="223" t1="224e" x={1500} y={430} w={440} text="Are you okay?" />
		</>
	),
});
const S225 = sc({
	bg: 'street',
	tint: 'gold',
	cam: [[900, 560, 1.0], [960, 560, 1.18]],
	badge: 0,
	actors: () => [hero(900, {ges: [{g: 'wave', t0: '224+30', t1: '225e'}, {g: 'presentF', t0: '228', t1: '229e'}]})],
	gfx: (c) => (
		<>
			<Say c={c} t0="224+20" t1="225e" x={900} y={330} w={470} text="I'm really great." />
			<Tag f={c.f} t0={c.t('225+60')} t1={c.t('225e')} x={1500} y={300} text="MONEY: GONE" size={46} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('226')} t1={c.t('226e')} x={1500} y={300} text="MANSION: GONE" size={46} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('227')} t1={c.t('227e')} x={1500} y={300} text="JUST A GIRL YOU ASKED" size={46} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('228')} t1={c.t('229e')} x={1500} y={300} text="A BRUISE. A COLD COFFEE." size={46} c={LIME} />
		</>
	),
});
const S230 = sc({
	bg: 'street',
	tint: 'gold',
	cam: [[900, 570, 1.0], [960, 560, 1.2]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'think', t0: '230', t1: '231e'}, {g: 'point', t0: '233', t1: '233e'}]})],
	gfx: (c) => <Msgs f={c.f} t0={c.t('230')} t1={c.t('233e')} x={1400} y={240} s={0.95} msgs={[{text: 'Lunch? I’ll pay.', at: 0}, {text: 'You owe me.', at: 40}, {text: 'Deal. I’m picking!', at: 140, me: true}]} />,
});
const S234 = sc({
	bg: 'dining',
	whip: true,
	cam: [[960, 600, 1.0], [980, 590, 1.2]],
	badge: 0,
	actors: () => [hero(800, {sit: 800, facing: 1, expr: 'wide', mouth: 'smile'}), A('friend', 1300, {sit: 800, facing: -1})],
	gfx: (c) => (
		<>
			<Table x={1050} w={1000} />
			<Tag f={c.f} t0={c.t('234')} t1={c.t('234e')} x={960} y={200} text="IT MIGHT BE TERRIBLE" size={52} />
			<Tag f={c.f} t0={c.t('235')} t1={c.t('235+90')} x={960} y={200} text="THE FOOD COULD BE COLD" size={52} c="#9ac8ff" />
			<Tag f={c.f} t0={c.t('235+90')} t1={c.t('235e')} x={960} y={200} text="THE ORDER FORGOTTEN" size={52} c="#ff9a8a" />
			<Tag f={c.f} t0={c.t('236')} t1={c.t('236e')} x={960} y={200} text="RAIN. NO UMBRELLA." size={52} c="#7acbff" />
			<Banner f={c.f} t0={c.t('237')} t1={c.t('237e+20')} y={940} text="AND YOU CAN'T WAIT" size={70} />
		</>
	),
});
const S238 = sc({
	bg: 'park',
	tint: 'x',
	whip: true,
	cam: [[900, 580, 1.0], [1060, 570, 1.2]],
	badge: 0,
	actors: () => [hero(700, {moves: [mv('238', '241e+60', 1250, 400)]}), A('friend', 900, {moves: [{t0: '238', t1: '241e+60', x1: 1480, x0: 600}], facing: 1})],
	gfx: (c) => (
		<>
			<Tag f={c.f} t0={c.t('238')} t1={c.t('239e')} x={960} y={190} text="THE ENDING IS STILL A SECRET" size={54} c={GOLD} />
			<Tag f={c.f} t0={c.t('240')} t1={c.t('241e')} x={960} y={190} text="THE LUCKIEST STILL GET TO FIND OUT" size={46} c={LIME} />
		</>
	),
});
const S242 = sc({
	bg: 'void',
	cam: [[960, 580, 1.15], [960, 560, 1.4]],
	badge: 0,
	actors: () => [hero(960, {ges: [{g: 'presentF', t0: '242', t1: '242e'}, {g: 'wave', t0: '243+40', t1: '244e'}]})],
	gfx: (c) => (
		<>
			<Question f={c.f} t0={c.t('243')} t1={c.t('244e')} x={1380} y={470} s={1.1} />
		</>
	),
});

export const SHOTS: ShotDef[] = [
	{at: '001', C: S001},
	{at: '003', C: S003, whip: true},
	{at: '007', C: S007, whip: true},
	{at: '009', C: S009},
	{at: '011', C: S011, whip: true},
	{at: '012', C: S012},
	{at: '015', C: S015},
	{at: '017', C: S017, whip: true},
	{at: '021', C: S021, whip: true},
	{at: '025', C: S025, whip: true},
	{at: '028', C: S028},
	{at: '031', C: S031},
	{at: '036', C: S036, whip: true},
	{at: '041', C: S041},
	{at: '043', C: S043, whip: true},
	{at: '045', C: S045},
	{at: '050', C: S050},
	{at: '053', C: S053},
	{at: '056', C: S056},
	{at: '058', C: S058},
	{at: '064', C: S064},
	{at: '066', C: S066},
	{at: '070', C: S070},
	{at: '075', C: S075},
	{at: '078', C: S078},
	{at: '084', C: S084, whip: true},
	{at: '091', C: S091},
	{at: '096', C: S096},
	{at: '099', C: S099, whip: true},
	{at: '107', C: S107, whip: true},
	{at: '113', C: S113, whip: true},
	{at: '120', C: S120},
	{at: '125', C: S125, whip: true},
	{at: '127', C: S127, whip: true},
	{at: '128', C: S128, whip: true},
	{at: '130', C: S130, whip: true},
	{at: '132', C: S132, whip: true},
	{at: '136', C: S136},
	{at: '141', C: S141},
	{at: '145', C: S145},
	{at: '150', C: S150, whip: true},
	{at: '155', C: S155},
	{at: '160', C: S160},
	{at: '164', C: S164, whip: true},
	{at: '168', C: S168, whip: true},
	{at: '175', C: S175, whip: true},
	{at: '179', C: S179},
	{at: '184', C: S184, whip: true},
	{at: '191', C: S191, whip: true},
	{at: '196', C: S196},
	{at: '200', C: S200, whip: true},
	{at: '208', C: S208, whip: true},
	{at: '213', C: S213},
	{at: '219', C: S219, whip: true},
	{at: '225', C: S225},
	{at: '230', C: S230},
	{at: '234', C: S234, whip: true},
	{at: '238', C: S238, whip: true},
	{at: '242', C: S242, whip: true},
];
