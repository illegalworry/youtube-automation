import React from 'react';
import {Composition} from 'remotion';
import {Long, LONG_FRAMES} from './Long';
import {Short, SHORT_FRAMES} from './Short';
import {Sheet, SheetProps, sheetSize} from './Sheet';
import {PauseTime} from './reference/PauseTime';
import {Thumb} from './Thumb';
import {ThumbV} from './ThumbV';
import {CAVEAT_TTF, RUBIK_TTF} from './fonts-data';

/* open-licence fonts from public/fonts, loaded before the first frame renders */
// generous timeout: with several render tabs at once a cold font load can take a while;
// if it still fails the frame renders with the fallback font instead of crashing
// fonts are embedded as data URIs and registered synchronously; no delayRender: a reloaded
// render tab must never block on a font (it did on CI, every time)
[new FontFace('Rubik', `url(${RUBIK_TTF})`, {weight: '300 900'}), new FontFace('Caveat', `url(${CAVEAT_TTF})`, {weight: '400 700'})].forEach((f) => {
	document.fonts.add(f);
	f.load().catch(() => undefined);
});

// headings are heavy unless a text asks for another weight (the style's chunky lettering)
const css = document.createElement('style');
css.textContent = `text[font-family*="Rubik"]:not([font-weight]){font-weight:800}`;
document.head.appendChild(css);

const defaultSheet: SheetProps = {comp: 'Long', frames: [0, 30, 60, 90], cols: 4};

export const Root: React.FC = () => (
	<>
		<Composition id="Long" component={Long} durationInFrames={Math.max(1, LONG_FRAMES)} fps={30} width={1920} height={1080} />
		<Composition id="Short" component={Short} durationInFrames={Math.max(1, SHORT_FRAMES)} fps={30} width={1080} height={1920} />
		<Composition
			id="Sheet"
			component={Sheet}
			// as long as the videos: frozen scenes keep their Sequences alive
			durationInFrames={Math.max(LONG_FRAMES, SHORT_FRAMES, 1)}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={defaultSheet}
			calculateMetadata={({props}) => {
				const s = sheetSize(props);
				return {width: s.width, height: Math.ceil(s.height / 2) * 2};
			}}
		/>
		{/* the approved style reference: 10 s, built by hand, shows what "our level" means */}
		<Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1920} height={1080} />
		<Composition id="ThumbV" component={ThumbV} durationInFrames={1} fps={30} width={1080} height={1920} />
		<Composition id="Reference" component={PauseTime} durationInFrames={300} fps={30} width={1920} height={1080} />
	</>
);
