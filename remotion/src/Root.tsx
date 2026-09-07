import React from 'react';
import {Composition} from 'remotion';
import {BirocratieComparison, birocratieDefaultProps} from './compositions/BirocratieComparison';

const FPS = 30;
const DURATION_IN_FRAMES = 11 * FPS; // 10–11s, per planul de conținut

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* master 9:16 — Reels / TikTok / Shorts */}
			<Composition
				id="BirocratieComparison9x16"
				component={BirocratieComparison}
				durationInFrames={DURATION_IN_FRAMES}
				fps={FPS}
				width={1080}
				height={1920}
				defaultProps={birocratieDefaultProps}
			/>
			{/* derivată 1:1 — IG/FB feed. compoziție separată (nu crop post-randare) */}
			<Composition
				id="BirocratieComparison1x1"
				component={BirocratieComparison}
				durationInFrames={DURATION_IN_FRAMES}
				fps={FPS}
				width={1080}
				height={1080}
				defaultProps={birocratieDefaultProps}
			/>
		</>
	);
};
