import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {easeOutCubic} from '../tokens';

/**
 * Reveal cuvânt-cu-cuvânt, stagger fix de 0.12s/cuvânt — aceeași constantă
 * ca splitKineticText() din social-creator/js/motion-engine.js, ca piesele
 * remotion să se simtă din aceeași familie cu cele /animatie-video.
 *
 * IMPORTANT: se folosește frame-ul curent RELATIV — dacă acest component e
 * randat într-un <Sequence from={X}>, useCurrentFrame() e deja rebazat la 0
 * chiar la acel X (comportament Remotion standard). `delayFrames` e un
 * offset local suplimentar (implicit 0), NU frame-ul absolut al secvenței —
 * pasarea unui frame absolut aici anulează reveal-ul (diferența devine
 * mereu negativă și rămâne clampată la progres 0).
 */
export const KineticText: React.FC<{
	text: string;
	delayFrames?: number;
	style?: React.CSSProperties;
	accentWord?: string;
	accentColor?: string;
}> = ({text, delayFrames = 0, style, accentWord, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const staggerFrames = 0.12 * fps;
	const words = text.split(' ');

	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style}}>
			{words.map((word, i) => {
				const wordStart = delayFrames + i * staggerFrames;
				const progress = interpolate(frame - wordStart, [0, 8], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const eased = easeOutCubic(progress);
				const isAccent = accentWord && word.replace(/[.,!?]/g, '') === accentWord;
				return (
					<span
						key={i}
						style={{
							opacity: eased,
							transform: `translateY(${(1 - eased) * 10}px)`,
							color: isAccent ? accentColor : undefined,
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};
