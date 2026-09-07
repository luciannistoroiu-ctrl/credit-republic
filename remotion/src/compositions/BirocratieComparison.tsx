import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {colors, fonts, easeOutCubic} from '../tokens';
import {QueueMark} from '../components/QueueMark';

/**
 * Ziua 3 — "obiceiul 03: alergi la 5 sucursale în loc de o singură aplicare"
 * Singura piesă remotion din seria "obiceiurile care îți scumpesc creditul" —
 * vezi social-creator/js/motion-engine.js pentru varianta /animatie-video a
 * celorlalte 3 zile. Copy-ul sursă e presetul p_07_un_singur_dosar din
 * social-creator/js/copy-engine.js — pasat aici ca props, nu retastat, ca
 * să rămână o singură sursă de adevăr pentru text pe ambele pipeline-uri.
 */
export type BirocratieComparisonProps = {
	fromCount: number;
	toCount: number;
	fromLabel: string;
	toLabel: string;
	headlineOld: string;
	headlineNew: string;
	supportLine: string;
	ctaText: string;
	footerNote: string;
};

export const birocratieDefaultProps: BirocratieComparisonProps = {
	fromCount: 5,
	toCount: 1,
	fromLabel: 'sucursale',
	toLabel: 'aplicare online',
	headlineOld: 'pe cont propriu: 5 sucursale, 5 formulare, zile pierdute la coadă.',
	headlineNew: 'prin credit republic: 1 aplicare online, toate băncile comparate.',
	supportLine: 'Florența Nistoroiu (broker AVBS) preia actele. tu nu mai bați niciun drum.',
	ctaText: 'precalifică-te, fără drumuri',
	footerNote: 'credit republic · neobroker de credite',
};

const PillIcon: React.FC<{delayFrames: number; size: number}> = ({delayFrames, size}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const appear = spring({frame: frame - delayFrames, fps, config: {damping: 200}});
	return (
		<div
			style={{
				width: size,
				height: size * 0.4,
				borderRadius: 999,
				background: colors.plum,
				opacity: 0.4 * appear,
				transform: `scale(${appear})`,
			}}
		/>
	);
};

// Ținta numărătorii e un prop (fromCount → toCount), nu o valoare hardcodată
// ca în startCounterAnimation() din motion-engine.js — de-asta piesa asta e
// în remotion: aceeași funcție servește orice pereche de cifre din seriile
// viitoare, fără patch-uri.
const useCountdown = (from: number, to: number, startFrame: number, durationFrames: number) => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame - startFrame, [0, durationFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const eased = easeOutCubic(progress);
	const value = from - (from - to) * eased;
	return Math.max(to, Math.round(value));
};

export const BirocratieComparison: React.FC<BirocratieComparisonProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const isVertical = height > width;

	// beat sheet (@30fps): 0-3s / 3-6s / 6-9s / 9-11s — vezi planul de conținut
	const s1 = 0 * fps;
	const s2 = 3 * fps;
	const s3 = 6 * fps;
	const s4 = 9 * fps;
	const total = 11 * fps;

	const countdown = useCountdown(props.fromCount, props.toCount, s2, 2.4 * fps);
	// exit-apoi-enter secvențial, nu crossfade simultan — la un singur cadru static
	// (scroll oprit, screenshot) un crossfade suprapune două headline-uri lizibile
	// deodată; secvențial garantează că niciun cadru nu arată ambele variante.
	const oldOpacity = interpolate(frame, [s2, s2 + 8], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const newOpacity = interpolate(frame, [s2 + 8, s2 + 18], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const ctaAppear = spring({frame: frame - s4, fps, config: {damping: 200}});
	const fadeOutTail = interpolate(frame, [total - 15, total], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: colors.cream,
				fontFamily: fonts.body,
				opacity: fadeOutTail,
			}}
		>
			{/* ancoră de brand — mic, colț sus, prezent tot filmul (consistent cu ziua 02) */}
			<div style={{position: 'absolute', top: isVertical ? '6%' : '8%', left: isVertical ? '8%' : '6%'}}>
				<QueueMark size={isVertical ? 44 : 38} background="light" />
			</div>
			<AbsoluteFill style={{padding: isVertical ? '0 8%' : '0 8%'}}>
				{/* headline — poziționat fix aproape de vârf, nu centrat ca bloc — vezi
				    notă despre distribuția verticală pe tot canvas-ul, nu doar scala */}
				<div style={{position: 'absolute', top: isVertical ? '17%' : '20%', left: '8%', right: '8%'}}>
					<h1
						style={{
							position: 'absolute',
							margin: 0,
							fontFamily: fonts.display,
							fontWeight: 800,
							fontSize: isVertical ? 92 : 60,
							lineHeight: 1.15,
							color: colors.plum,
							opacity: oldOpacity,
						}}
					>
						{props.headlineOld}
					</h1>
					<h1
						style={{
							position: 'absolute',
							margin: 0,
							fontFamily: fonts.display,
							fontWeight: 800,
							fontSize: isVertical ? 92 : 60,
							lineHeight: 1.15,
							color: colors.plum,
							opacity: newOpacity,
						}}
					>
						{props.headlineNew}
					</h1>
				</div>

				{/* Sequence 1 — 5 pastile reprezentând drumurile la sucursale */}
				<Sequence from={s1} durationInFrames={s3 - s1} layout="none">
					<div style={{position: 'absolute', top: '44%', left: '8%', right: '8%', display: 'flex', gap: 14, flexWrap: 'wrap'}}>
						{Array.from({length: props.fromCount}).map((_, i) => (
							<PillIcon key={i} delayFrames={s1 + i * 6} size={isVertical ? 130 : 100} />
						))}
					</div>
				</Sequence>

				{/* Sequence 2 — numărătoarea parametrizată fromCount → toCount */}
				<Sequence from={s2} durationInFrames={total - s2} layout="none">
					<div
						style={{
							position: 'absolute',
							top: '55%',
							left: '8%',
							display: 'flex',
							alignItems: 'baseline',
							gap: 16,
							border: `2px solid ${colors.coral}`,
							borderRadius: 999,
							padding: '10px 32px 10px 28px',
						}}
					>
						<span
							style={{
								fontFamily: fonts.display,
								fontWeight: 800,
								fontSize: isVertical ? 128 : 104,
								color: colors.coral,
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							{countdown}
						</span>
						<span style={{fontFamily: fonts.body, fontSize: 26, color: colors.plum, opacity: 0.7}}>
							{countdown === props.fromCount ? props.fromLabel : props.toLabel}
						</span>
					</div>
				</Sequence>

				{/* Sequence 3 — linia de sprijin cu Florența Nistoroiu (nume, nu chip vizual) */}
				<Sequence from={s3} durationInFrames={s4 - s3} layout="none">
					<p
						style={{
							position: 'absolute',
							top: '73%',
							left: '8%',
							right: '8%',
							margin: 0,
							fontFamily: fonts.body,
							fontSize: isVertical ? 34 : 24,
							color: colors.plum,
							opacity: 0.85,
							maxWidth: 560,
						}}
					>
						{props.supportLine}
					</p>
				</Sequence>

				{/* Sequence 4 — lockup: CTA + footer, semnal albastru absent — rezervat piesei mecanismului.
				    Poziționat aproape de baza cadrului, nu doar mai jos în flux — asta închide
				    golul din treimea de jos semnalat de criticul de craft. */}
				<Sequence from={s4} durationInFrames={total - s4} layout="none">
					<div style={{position: 'absolute', top: '85%', left: '8%', display: 'flex', flexDirection: 'column', gap: 18, opacity: ctaAppear}}>
						<span
							style={{
								alignSelf: 'flex-start',
								padding: '14px 30px',
								borderRadius: 999,
								background: colors.coral,
								color: colors.cream,
								fontFamily: fonts.display,
								fontWeight: 700,
								fontSize: 34,
							}}
						>
							{props.ctaText}
						</span>
						<span style={{fontFamily: fonts.body, fontSize: 17, color: colors.plum, opacity: 0.6}}>
							{props.footerNote}
						</span>
					</div>
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
