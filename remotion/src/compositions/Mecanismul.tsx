import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, easeOutCubic} from '../tokens';
import {QueueMark} from '../components/QueueMark';
import {KineticText} from '../components/KineticText';

/**
 * Ziua 04 — "obiceiul 04 (cel bun): îl lași pe algoritm + Florența să facă
 * verificarea" — unghi 01+06 (mecanismul, algoritm+om), registru uman/exact
 * hibrid, piesa-far a săptămânii. Mecanism, versiune simplificată (fără
 * split-screen): intro scurt → semnul-coadă → numărătoarea până la rezultatul
 * confirmat. Singurul loc din toată campania unde apare albastrul de semnal,
 * exact o dată, pe cifra finală — fără suma economisită afișată.
 */
export type MecanismulProps = {
	introText: string;
	rateFrom: string;
	rateTo: string;
	rateFromValue: number;
	rateToValue: number;
	daeNote: string;
	wordmark: string;
	cta: string;
};

export const mecanismulDefaultProps: MecanismulProps = {
	introText: 'lasă verificarea pe seama cuiva care o face în fiecare zi.',
	rateFrom: '7,90%',
	rateTo: '4,75%',
	rateFromValue: 7.9,
	rateToValue: 4.75,
	daeNote: '*calcul estimativ orientativ; exemplul reprezentativ DAE variază după profil și bancă.',
	wordmark: 'credit republic',
	cta: 'verifică poziția ta — 4 minute, 0 lei',
};

const FPS = 30;
export const MECANISMUL_DURATION = 12 * FPS; // 360 cadre

const S_TEXT1 = 0;
const S_TEXT_OUT = 3.2 * FPS; // introducerea dispare complet...
const S_MARK = 3.8 * FPS; // ...înainte să înceapă să apară semnul-coadă (exit-apoi-enter, nu simultan)
const S_COUNTER_SHOW = 4.8 * FPS;
const S_TICK_START = 5.8 * FPS;
const S_TICK_END = 7.8 * FPS;
const S_LOCKUP = 9.6 * FPS;
const S_TAIL = 11.2 * FPS;

export const Mecanismul: React.FC<MecanismulProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	// intro — dispare complet înainte de orice altceva, o singură mișcare pe cadru
	const introOpacity = interpolate(frame, [S_TEXT_OUT, S_MARK], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const markAppear = spring({frame: frame - S_MARK, fps, config: {damping: 200}});

	// numărătoarea — ease-out cubic, identic cu startCounterAnimation() din motion-engine.js
	const tickProgress = interpolate(frame, [S_TICK_START, S_TICK_END], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const tickEased = easeOutCubic(tickProgress);
	const rateNow = props.rateFromValue - (props.rateFromValue - props.rateToValue) * tickEased;
	const rateSettled = tickProgress >= 1;

	const daeAppear = spring({frame: frame - S_TICK_END, fps, config: {damping: 200}});
	const lockupAppear = spring({frame: frame - S_LOCKUP, fps, config: {damping: 200}});
	const breathe = 1 + Math.sin(((frame - S_LOCKUP) / fps) * Math.PI) * 0.02;

	const tailFade = interpolate(frame, [S_TAIL, MECANISMUL_DURATION], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: colors.cream, opacity: tailFade}}>
			{/* intro — o singură linie, dispare complet înainte să apară semnul-coadă */}
			{frame < S_MARK && (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 9%', opacity: introOpacity}}>
					<KineticText
						text={props.introText}
						style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 76, color: colors.plum, lineHeight: 1.22}}
					/>
				</AbsoluteFill>
			)}

			{/* semnul-coadă, contorul, CTA — ancore fixe pe toată înălțimea, nu un bloc centrat */}
			{frame >= S_MARK && (
				<AbsoluteFill>
					<div
						style={{
							position: 'absolute',
							top: '10%',
							left: 0,
							right: 0,
							display: 'flex',
							justifyContent: 'center',
							opacity: markAppear,
						}}
					>
						<QueueMark size={120} background="light" />
					</div>

					{frame >= S_COUNTER_SHOW && (
						<div
							style={{
								position: 'absolute',
								top: '32%',
								left: 0,
								right: 0,
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<span
								style={{
									fontFamily: fonts.display,
									fontWeight: 800,
									fontSize: 170,
									fontVariantNumeric: 'tabular-nums',
									color: rateSettled ? colors.signal : colors.plum,
								}}
							>
								{rateSettled ? props.rateTo : `${rateNow.toFixed(2).replace('.', ',')}%`}
							</span>
						</div>
					)}

					{/* singura apariție a albastrului de semnal e pe cifra de mai sus, exact o dată */}
					{rateSettled && (
						<p
							style={{
								position: 'absolute',
								top: '55%',
								left: '10%',
								right: '10%',
								margin: 0,
								textAlign: 'center',
								fontFamily: fonts.body,
								fontSize: 17,
								color: colors.plum,
								opacity: 0.55 * daeAppear,
							}}
						>
							{props.daeNote}
						</p>
					)}

					{frame >= S_LOCKUP && (
						<div
							style={{
								position: 'absolute',
								top: '74%',
								left: 0,
								right: 0,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 20,
								opacity: lockupAppear,
								transform: `scale(${breathe})`,
							}}
						>
							<span
								style={{
									fontFamily: fonts.display,
									fontWeight: 700,
									fontSize: 36,
									color: colors.plum,
								}}
							>
								{props.wordmark}
							</span>
							<span
								style={{
									fontFamily: fonts.display,
									fontWeight: 700,
									fontSize: 38,
									color: colors.cream,
									background: colors.coral,
									borderRadius: 999,
									padding: '20px 42px',
									maxWidth: width * 0.8,
									textAlign: 'center',
								}}
							>
								{props.cta}
							</span>
						</div>
					)}
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
