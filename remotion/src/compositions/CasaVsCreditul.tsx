import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, easeOutCubic} from '../tokens';
import {QueueMark} from '../components/QueueMark';
import {StructureLine} from '../components/StructureLine';
import {KineticText} from '../components/KineticText';

/**
 * Ziua 01 — "obiceiul 01: cauți apartamentul cu lupa, creditul din fugă"
 * Unghi 05 (casa vs creditul), registru observațional, fără CTA.
 * Mecanism: două lumi, o singură tăietură — atenția lentă (cream) vs.
 * graba (plum) — contrastul de ritm ÎNSUȘI e argumentul.
 */
export type CasaVsCreditulProps = {
	line1a: string;
	line1b: string;
	line2a: string;
	line2b: string;
	thesis: string;
	wordmark: string;
	tagline: string;
};

export const casaVsCreditulDefaultProps: CasaVsCreditulProps = {
	line1a: 'cauți apartamentul',
	line1b: '6 luni.',
	line2a: 'alegi creditul',
	line2b: 'în 20 de minute.',
	thesis: 'inerția e cel mai scump comision pe care îl plătești când cumperi o casă.',
	wordmark: 'credit republic',
	tagline: 'neobroker de credite',
};

const FPS = 30;
export const CASA_VS_CREDITUL_DURATION = 14 * FPS; // 420 cadre

// beat sheet (@30fps) — vezi remotion/bar.md pt regula "o tăietură = o schimbare de stare"
const S_LINE1A = 0;
const S_LINE1B = 1.6 * FPS;
const S_CUT = 3.2 * FPS; // singura tăietură dură a filmului
const S_LINE2A = 3.6 * FPS;
const S_LINE2B = 5.2 * FPS;
const S_THESIS = 6.4 * FPS;
const S_LOCKUP = 9.6 * FPS;
const S_TAIL = 12.4 * FPS;

export const CasaVsCreditul: React.FC<CasaVsCreditulProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const isWorldB = frame >= S_CUT;

	// World A — lumina/detaliul se mișcă o singură dată, lent, o direcție
	const beamDrift = interpolate(frame, [S_LINE1A, S_CUT], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const hingeZoom = interpolate(frame, [S_LINE1B, S_CUT], [1, 1.5], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// tăietura dură — un flash scurt de blur motivează schimbarea de stare
	const cutBlur = interpolate(frame, [S_CUT - 2, S_CUT, S_CUT + 4], [0, 14, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// intrarea semnului-coadă în World B — singura ei mișcare, cu blur motivat de viteză
	const markEnterProgress = interpolate(frame, [S_LINE2A, S_LINE2A + 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const markEnterEased = easeOutCubic(markEnterProgress);
	const markEnterBlur = interpolate(markEnterProgress, [0, 1], [10, 0]);

	// lockup final — pulsul de respirație, unica mișcare permisă după 9.6s
	const breathe = 1 + Math.sin(((frame - S_LOCKUP) / fps) * Math.PI) * 0.02;
	const lockupAppear = spring({frame: frame - S_LOCKUP, fps, config: {damping: 200}});

	// fade-ul final e conținutul dizolvându-se în plum solid, nu tot canvas-ul
	// devenind transparent (altfel PNG-ul exportă un gri spălăcit fără fundal)
	const tailFade = interpolate(frame, [S_TAIL, S_TAIL + 48], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: colors.plum}}>
			<AbsoluteFill style={{background: isWorldB ? colors.plum : colors.cream, opacity: tailFade}}>
			<StructureLine dark={isWorldB} />
			<AbsoluteFill style={{filter: cutBlur > 0.5 ? `blur(${cutBlur}px)` : undefined}}>
				{!isWorldB && (
					<AbsoluteFill>
						{/* World A — fereastră/lumină, o singură mișcare: drift diagonal lent.
						    Compoziția e ancorată pe detaliul-hinge (~42% din înălțime) — lumina
						    cade pe el, textul stă imediat sub el, nu izolat la marginea cadrului. */}
						<div
							style={{
								position: 'absolute',
								top: `${-6 + beamDrift * 6}%`,
								left: '-20%',
								width: '140%',
								height: '78%',
								background:
									'linear-gradient(115deg, transparent 14%, rgba(255,255,255,0.85) 44%, transparent 76%)',
								transform: 'rotate(-8deg)',
							}}
						/>
						{/* detaliul-hinge — un cadru de usa simplu, ancora reala de rack-focus */}
						<div
							style={{
								position: 'absolute',
								top: '42%',
								left: '50%',
								transform: `translate(-50%, -50%) scale(${hingeZoom})`,
								display: 'flex',
								alignItems: 'center',
								gap: 14,
							}}
						>
							<div style={{width: 30, height: 150, borderRadius: 15, background: colors.plum, opacity: 0.72}} />
						</div>

						<Sequence from={S_LINE1A} durationInFrames={S_LINE1B - S_LINE1A} layout="none">
							<div style={{position: 'absolute', top: '58%', left: '50%', transform: 'translateX(-50%)', width: '82%', textAlign: 'center'}}>
								<span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 108, color: colors.plum}}>
									{props.line1a}
								</span>
							</div>
						</Sequence>
						<Sequence from={S_LINE1B} durationInFrames={S_CUT - S_LINE1B} layout="none">
							<div style={{position: 'absolute', top: '58%', left: '50%', transform: 'translateX(-50%)', width: '82%', textAlign: 'center'}}>
								<span style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 108, color: colors.plum}}>
									{props.line1b}
								</span>
							</div>
						</Sequence>
					</AbsoluteFill>
				)}

				{isWorldB && (
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
						{/* semnul-coadă — intră rapid o singură dată, apoi devine hero-ul lockup-ului */}
						{frame < S_LOCKUP && frame >= S_LINE2A && (
							<div
								style={{
									position: 'absolute',
									top: '30%',
									opacity: markEnterEased,
									filter: `blur(${markEnterBlur}px)`,
									transform: `translateX(${(1 - markEnterEased) * 120}px)`,
								}}
							>
								<QueueMark size={170} background="dark" />
							</div>
						)}

						<Sequence from={S_LINE2A} durationInFrames={S_LINE2B - S_LINE2A} layout="none">
							<div style={{position: 'absolute', bottom: '38%', fontFamily: fonts.display, fontWeight: 800, fontSize: 108, color: colors.cream}}>
								{props.line2a}
							</div>
						</Sequence>
						<Sequence from={S_LINE2B} durationInFrames={S_THESIS - S_LINE2B} layout="none">
							<div style={{position: 'absolute', bottom: '38%', fontFamily: fonts.display, fontWeight: 800, fontSize: 108, color: colors.cream}}>
								{props.line2b}
							</div>
						</Sequence>

						<Sequence from={S_THESIS} durationInFrames={S_LOCKUP - S_THESIS} layout="none">
							<div style={{maxWidth: width * 0.78, textAlign: 'center'}}>
								<KineticText
									text={props.thesis}
									style={{
										fontFamily: fonts.body,
										fontSize: 40,
										color: colors.cream,
										justifyContent: 'center',
										lineHeight: 1.4,
									}}
								/>
							</div>
						</Sequence>

						<Sequence from={S_LOCKUP} durationInFrames={CASA_VS_CREDITUL_DURATION - S_LOCKUP} layout="none">
							<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: lockupAppear}}>
								<div style={{transform: `scale(${breathe})`}}>
									<QueueMark size={210} background="dark" />
								</div>
								<span style={{fontFamily: fonts.display, fontWeight: 700, fontSize: 44, color: colors.cream}}>
									{props.wordmark}
								</span>
								<span
									style={{
										fontFamily: fonts.body,
										fontSize: 17,
										color: colors.cream,
										opacity: 0.7,
										padding: '6px 18px',
										border: `1px solid rgba(255,248,240,0.35)`,
										borderRadius: 999,
									}}
								>
									{props.tagline}
								</span>
							</div>
						</Sequence>
					</AbsoluteFill>
				)}
			</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
