import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import STL from './story/short-timeline.json';
import {AngleCtx, L as EL, LINES, Line, ShotCtx, SpeakOverride, TalkOverride, TOTAL} from './kit/core';
import {SHOT_TIMES, TimedShot} from './kit/coverage';
import {clamp, ease} from './kit/kit';
import {Caption} from './kit/graphics';
import {ShotHost, VoiceTrack, whipAt} from './Long';
import {SHORT, Seg, Fx} from './story/short';
import {FONT} from './kit/ui';
import {STORY} from './story/config';

/* 9:16 version. Two modes (src/story/short.ts):
   crop  — shorts-only video: the same shots and voice as Long, each shot cropped to 9:16
           around ShotDef.focus (or replaced by its native vertical ShotDef.V).
   recut — "both" formats: a separate short voice timeline (short-timeline.json) laid over
           stretches of the long's shots, cropped per segment; cards can be native vertical. */
const W = 1080;
const H = 1920;
const BASE = H / 1080; // a 16:9 frame scaled to fill the height

type Crop = {cx?: number; cy?: number; z?: number};
const lerpCrop = (a: Crop = {}, b: Crop = a, k: number) => {
	const m = (x?: number, y?: number, d = 0) => (x ?? d) + ((y ?? x ?? d) - (x ?? d)) * k;
	return {cx: m(a.cx, b.cx, 960), cy: m(a.cy, b.cy, 540), z: m(a.z, b.z, 1)};
};
/* place a 1920x1080 child so that frame point (cx, cy) sits in the middle of the 9:16 canvas */
const CropBox: React.FC<{c: {cx: number; cy: number; z: number}; children: React.ReactNode}> = ({c, children}) => {
	const S = BASE * Math.max(1, c.z);
	const cx = Math.min(1920 - W / 2 / S, Math.max(W / 2 / S, c.cx));
	const cy = Math.min(1080 - H / 2 / S, Math.max(H / 2 / S, c.cy));
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<div style={{position: 'absolute', width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${W / 2 - cx * S}px, ${H / 2 - cy * S}px) scale(${S})`}}>{children}</div>
		</AbsoluteFill>
	);
};

/* ------------------------------- crop mode ------------------------------- */
const CropShot: React.FC<{s: TimedShot}> = ({s}) => {
	const f = useCurrentFrame();
	const dur = s.end - s.start;
	if (s.V) {
		const V = s.V;
		return <ShotHost start={s.start} end={s.end} C={V} own={s.own} />;
	}
	const fx = Array.isArray(s.focus) ? s.focus : [s.focus ?? 960, s.focus ?? 960];
	const k = interpolate(f, [0, dur], [0, 1], {...clamp, easing: ease});
	const z = (s.zoom ?? 1) * (1 + 0.04 * k); // never static: a slow push on every shot
	return (
		<CropBox c={{cx: fx[0] + (fx[1] - fx[0]) * k, cy: 540, z}}>
			<ShotHost start={s.start} end={s.end} C={s.C} own={s.own} />
		</CropBox>
	);
};

/* ------------------------------- segment fx ------------------------------- */
const rnd = (n: number) => {
	const x = Math.sin(n * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};
const FxWrap: React.FC<{fx: {at: number; fx: Fx}[]; seed: number; children: React.ReactNode}> = ({fx, seed, children}) => {
	const f = useCurrentFrame();
	let tx = 0, ty = 0, rot = 0, sc = 1, blur = 0, flash = 0, lime = 0;
	for (const h of fx) {
		const t = f - h.at;
		if (t < 0 || t > 16) continue;
		if (h.fx === 'whip') {
			const k = interpolate(t, [0, 8], [1, 0], {...clamp, easing: ease});
			const dir = rnd(seed) > 0.5 ? 1 : -1;
			tx += dir * 420 * k;
			blur = Math.max(blur, 28 * k);
			sc *= 1 + 0.12 * k;
		} else if (h.fx === 'punch' || h.fx === 'pop') {
			const k = interpolate(t, [0, 7], [1, 0], {...clamp, easing: ease});
			sc *= 1 + (h.fx === 'pop' ? 0.2 : 0.1) * k;
			if (h.fx === 'pop') lime = Math.max(lime, 0.35 * k);
		} else if (h.fx === 'shake') {
			const k = interpolate(t, [0, 14], [1, 0], clamp);
			tx += (rnd(seed + t) - 0.5) * 60 * k;
			ty += (rnd(seed + t + 50) - 0.5) * 60 * k;
			rot += (rnd(seed + t + 99) - 0.5) * 3 * k;
		} else if (h.fx === 'flash') {
			flash = Math.max(flash, interpolate(t, [0, 7], [0.85, 0], clamp));
		}
	}
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sc})`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>
			{flash > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
			{lime > 0 ? <AbsoluteFill style={{background: 'radial-gradient(circle, rgba(184,242,36,0) 30%, rgba(184,242,36,1) 100%)', opacity: lime}} /> : null}
		</AbsoluteFill>
	);
};

/* ------------------------------- subtitles ------------------------------- */
type Chunk = {from: number; to: number; words: {t: string; f: number}[]};
const buildChunks = (lines: Line[]): Chunk[] => {
	const out: Chunk[] = [];
	for (const l of lines) {
		const ws: {t: string; f: number; end: boolean}[] = [];
		for (const [w, o] of (l as unknown as {w: [string, number][]}).w) {
			if (/^[.,]/.test(w) && ws.length) {
				ws[ws.length - 1].t += w;
				ws[ws.length - 1].end = /[.?!,]$/.test(w);
				continue;
			}
			ws.push({t: w, f: l.from + o, end: /[.?!,]$/.test(w)});
		}
		for (const w of ws) w.t = w.t.replace(/^8\.59\.?$/, '8:59').replace(/[.,!]+$/, '').toUpperCase();
		let cur: Chunk | null = null;
		for (const w of ws) {
			if (!cur || cur.words.length >= 3) {
				cur = {from: w.f - 2, to: 0, words: []};
				out.push(cur);
			}
			cur.words.push({t: w.t, f: w.f});
			if (w.end) cur = null;
		}
	}
	out.forEach((c, i) => (c.to = i + 1 < out.length ? Math.min(out[i + 1].from, c.words[c.words.length - 1].f + 40) : c.words[c.words.length - 1].f + 40));
	return out;
};
const Subs: React.FC<{chunks: Chunk[]; top: number}> = ({chunks, top}) => {
	const f = useCurrentFrame();
	const {fps} = {fps: 30};
	const c = chunks.find((x) => f >= x.from && f < x.to);
	if (!c) return null;
	const k = interpolate(f - c.from, [0, 5], [0, 1], {...clamp, easing: ease});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', top, left: 50, right: 50, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px', transform: `scale(${0.75 + 0.25 * k}) rotate(${(1 - k) * -4}deg)`, opacity: k}}>
				{c.words.map((w, i) => {
					const on = f >= w.f && (i + 1 >= c.words.length || f < c.words[i + 1].f);
					const b = interpolate(f - w.f, [0, 3, 7], [1, 1.14, 1], clamp);
					return (
						<span key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1.08, color: on ? '#b8f224' : '#fff', WebkitTextStroke: '10px #0b0d1e', paintOrder: 'stroke', textShadow: '0 10px 0 rgba(0,0,0,.45)', display: 'inline-block', transform: `scale(${on ? b : 1})`}}>
							{w.t}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
const CHUNKS = SHORT.mode === 'recut' && (SHORT as {subs?: boolean}).subs ? buildChunks(STL.lines as Line[]) : [];

/* ------------------------------- recut mode ------------------------------ */
const SLINES = STL.lines as Line[];
const SL = (id: string) => {
	const l = SLINES.find((x) => x.id.startsWith(id));
	if (!l) throw new Error('no short line ' + id);
	return l;
};
const LEAD = 6;
const timed = () => {
	if (SHORT.mode !== 'recut') return [];
	const out: (Seg & {start: number; end: number; ep0: number})[] = [];
	SHORT.segs.forEach((s, i) => {
		const start = i === 0 ? 0 : s.at !== undefined ? SL(s.line).from + s.at : SL(s.line).from - LEAD;
		const prev = out[i - 1];
		const ep0 = s.cont && prev ? prev.ep0 + (start - prev.start) : s.ep ? (s.at !== undefined ? EL(s.ep).from + (s.off ?? 0) : EL(s.ep).from + (s.off ?? 0) - (i === 0 ? SL(s.line).from : LEAD)) : 0;
		out.push({...s, start, end: 0, ep0});
	});
	out.forEach((s, i) => (s.end = i + 1 < out.length ? out[i + 1].start : STL.total));
	return out;
};
const TIMED = timed();
const talkAt = (sp: string, f: number) => {
	for (const l of SLINES) {
		if (l.sp !== sp || f < l.from || f >= l.from + l.dur) continue;
		const i = f - l.from;
		return ((l.env[i] ?? 0) + (l.env[i + 1] ?? 0)) / 2;
	}
	return 0;
};
/* who the camera is on: the line owning the moment; a quick narrator beat (< 40 frames)
   stays on the previous face so dialogue never flashes the wide shot */
const speakerAt = (f: number) => {
	let k = -1;
	for (let i = 0; i < SLINES.length; i++) if (SLINES[i].from - LEAD <= f) k = i;
	while (k > 0 && SLINES[k].sp === 'N' && SLINES[k].dur < 40 && SLINES[k - 1].sp !== 'N') k--;
	return k >= 0 ? SLINES[k].sp : null;
};
const RecutSeg: React.FC<{seg: (typeof TIMED)[number]}> = ({seg}) => {
	const f = useCurrentFrame();
	const dur = seg.end - seg.start;
	if (seg.C) return <seg.C f={f} dur={dur} />;
	const at = (g: number) => SHOT_TIMES.find((s) => g >= s.start && g < s.end) ?? SHOT_TIMES[SHOT_TIMES.length - 1];
	// hold: stay inside the shot the segment opened on (its last frame freezes, the crop keeps moving)
	const gf = seg.hold ? Math.min(seg.ep0 + f, at(seg.ep0).end - 1) : seg.ep0 + f;
	const shot = at(gf);
	const ctx = {f: gf - shot.start, gf, dur: shot.end - shot.start, start: shot.start, at: (n: string) => EL(n).from - shot.start, end: (n: string) => EL(n).from + EL(n).dur - shot.start};
	const c = lerpCrop(seg.a, seg.b, interpolate(f, [0, dur], [0, 1], {...clamp, easing: ease}));
	const C = shot.C;
	return (
		<CropBox c={c}>
			<TalkOverride.Provider value={(sp, g) => talkAt(sp, g - seg.ep0 + seg.start)}>
				<SpeakOverride.Provider value={(g) => speakerAt(g - seg.ep0 + seg.start)}>
					<ShotCtx.Provider value={ctx}>
						<AngleCtx.Provider value={{k: 0, t: f, len: dur}}>
							<C />
						</AngleCtx.Provider>
					</ShotCtx.Provider>
				</SpeakOverride.Provider>
			</TalkOverride.Provider>
		</CropBox>
	);
};

export const SHORT_FRAMES = SHORT.mode === 'recut' ? STL.total : TOTAL;

export const Short: React.FC<{sound?: boolean}> = ({sound = true}) => {
	const f = useCurrentFrame();
	const lines = SHORT.mode === 'recut' ? SLINES : LINES;
	const last = lines[lines.length - 1];
	const w = (SHORT.mode as string) === 'crop' ? whipAt(f) : null;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id="whipBlurV" x="-20%" y="0%" width="140%" height="100%">
					<feGaussianBlur stdDeviation={`${w ? 50 * w.k : 0} 0`} />
				</filter>
			</svg>
			<AbsoluteFill style={w ? {transform: `translateX(${w.dir * 160 * w.k}px) scale(${1 + 0.1 * w.k})`, filter: 'url(#whipBlurV)'} : undefined}>
				{SHORT.mode === 'recut'
					? TIMED.map((s, i) => (
							<Sequence key={i} from={s.start} durationInFrames={s.end - s.start} name={s.line}>
								<FxWrap seed={i * 7 + 1} fx={[...(s.fx ?? []).map((x) => ({at: 0, fx: x})), ...(s.hits ?? [])]}>
									<RecutSeg seg={s} />
								</FxWrap>
							</Sequence>
						))
					: SHOT_TIMES.map((s, i) => (
							<Sequence key={i} from={s.start} durationInFrames={s.end - s.start} name={`shot ${i + 1} @${s.at}`}>
								<CropShot s={s} />
							</Sequence>
						))}
			</AbsoluteFill>
			{SHORT.hook && lines[1] ? <Caption f={f} from={0} to={lines[1].from - 4} top={190} lines={SHORT.hook} size={92} /> : null}
			{CHUNKS.length ? <Subs chunks={CHUNKS} top={1160} /> : null}
			{SHORT.mode === 'recut' && (SHORT as {end?: string[]}).end ? (
				<Caption f={f} from={SL((SHORT as {endFrom?: string}).endFrom ?? last.id).from} to={SHORT_FRAMES} top={300} lines={(SHORT as {end?: string[]}).end!} size={96} c="#b8f224" />
			) : STORY.endCaption && last ? <Caption f={f} from={last.from + last.dur + 8} to={SHORT_FRAMES} top={1450} lines={STORY.endCaption} size={72} /> : null}
			{sound ? (
				<>
					{SHORT.mode === 'recut'
						? SLINES.map((l) => (
								<Sequence key={l.id} from={l.from} durationInFrames={l.dur + 4}>
									<Audio src={staticFile(l.file)} startFrom={l.trimStart} />
								</Sequence>
							))
						: <VoiceTrack />}
					<Audio src={staticFile(SHORT.bed ?? STORY.bed)} />
				</>
			) : null}
			<AbsoluteFill style={{background: '#000', opacity: interpolate(f, [0, 6], [1, 0], {extrapolateRight: 'clamp'})}} />
		</AbsoluteFill>
	);
};
