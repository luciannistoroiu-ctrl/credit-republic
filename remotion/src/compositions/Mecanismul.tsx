import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, easeOutCubic} from '../tokens';
import {QueueMark} from '../components/QueueMark';
import {KineticText} from '../components/KineticText';

/**
 * Ziua 04 — "obiceiul 04 (cel bun): îl lași pe algoritm + Florența să facă
 * verificarea" — unghi 01+06 (mecanismul, algoritm+om), registru uman/exact
 * hibrid, piesa-far a săptămânii. Mecanism: două jumătăți cu ritm opus (sus
 * rece/algoritm, jos cald/broker) care se topesc într-un singur cadru — iar
 * rezolvarea vizuală E rezultatul confirmat. Singurul loc din toată
 * campania unde apare albastrul de semnal, exact o dată.
 */
export type MecanismulProps = {
	text1: string;
	text2: string;
	labelTop: string;
	labelBottom: string;
	rateFrom: string;
	rateTo: string;
	rateFromValue: number;
	rateToValue: number;
	savingsAmount: string;
	daeNote: string;
	wordmark: string;
	cta: string;
};

export const mecanismulDefaultProps: MecanismulProps = {
	text1: 'am vorbit trei zile despre obiceiuri care te costă bani.',
	text2: 'al 4-lea obicei — cel bun — e să lași verificarea pe seama cuiva care o face în fiecare zi.',
	labelTop: 'algoritmul compară toate băncile în 4 minute',
	labelBottom: 'Florența Nistoroiu negociază la bancă',
	rateFrom: '7,90%',
	rateTo: '5,75%',
	rateFromValue: 7.9,
	rateToValue: 5.75,
	savingsAmount: '2.880 lei economisiți',
	daeNote: '*calcul estimativ orientativ; exemplul reprezentativ DAE variază după profil și bancă.',
	wordmark: 'credit republic',
	cta: 'verifică poziția ta — 4 minute, 0 lei',
};

const FPS = 30;
export const MECANISMUL_DURATION = 16 * FPS; // 480 cadre

// Labels trebuie să apară CÂT TIMP ecranul e încă despărțit (înainte de
// S_MERGE) — dacă S_LABELS > S_MERGE, ramura de split nu se mai randează
// deloc când labels ar trebui să apară, deci ele nu se văd niciodată.
const S_TEXT1 = 0;
const S_TEXT2 = 1.6 * FPS;
const S_LABELS = 2.5 * FPS;
const S_MERGE = 6.0 * FPS; // 3.5s cu labels vizibile înainte de topire — hold generos, lizibil
const S_COUNTER_SHOW = 7.0 * FPS;
const S_TICK_START = 8.0 * FPS;
const S_TICK_END = 10.0 * FPS;
const S_SAVINGS = 10.67 * FPS;
const S_LOCKUP = 13.0 * FPS;
const S_TAIL = 15.0 * FPS;

export const Mecanismul: React.FC<MecanismulProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	const isMerged = frame >= S_MERGE;

	// topirea — singura tăietură/tranziție dură a filmului, un wipe moale, nu instant
	const mergeProgress = interpolate(frame, [S_MERGE, S_MERGE + 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// numărătoarea — ease-out cubic, identic cu startCounterAnimation() din motion-engine.js
	const tickProgress = interpolate(frame, [S_TICK_START, S_TICK_END], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const tickEased = easeOutCubic(tickProgress);
	const rateNow = props.rateFromValue - (props.rateFromValue - props.rateToValue) * tickEased;
	const rateSettled = tickProgress >= 1;

	const savingsAppear = spring({frame: frame - S_SAVINGS, fps, config: {damping: 200}});
	const lockupAppear = spring({frame: frame - S_LOCKUP, fps, config: {damping: 200}});
	const breathe = 1 + Math.sin(((frame - S_LOCKUP) / fps) * Math.PI) * 0.02;

	const tailFade = interpolate(frame, [S_TAIL, MECANISMUL_DURATION], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{background: colors.plum, opacity: tailFade}}>
			{/* --- faza 1: split sus/jos, se dizolvă la S_MERGE --- */}
			{!isMerged && (
				<AbsoluteFill>
					<AbsoluteFill style={{top: 0, height: '50%', background: '#211D33'}}>
						{/* grilaj rece — algoritm, o singură mișcare: linii care avansează */}
						<AlgorithmGrid />
						{frame >= S_LABELS && (
							<div style={{position: 'absolute', bottom: '10%', left: '8%', right: '8%'}}>
								<span
									style={{
										display: 'inline-block',
										fontFamily: fonts.body,
										fontSize: 24,
										color: colors.cream,
										background: 'rgba(255,248,240,0.12)',
										borderRadius: 999,
										padding: '10px 22px',
									}}
								>
									{props.labelTop}
								</span>
							</div>
						)}
					</AbsoluteFill>
					<AbsoluteFill style={{top: '50%', height: '50%', background: colors.cream}}>
						{/* panou cald — broker, static, lumină difuză coral */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: 'radial-gradient(circle at 30% 30%, rgba(255,107,74,0.18), transparent 60%)',
							}}
						/>
						{frame >= S_LABELS && (
							<div style={{position: 'absolute', top: '10%', left: '8%', right: '8%'}}>
								<span
									style={{
										display: 'inline-block',
										fontFamily: fonts.body,
										fontSize: 24,
										color: colors.plum,
										background: 'rgba(43,38,64,0.08)',
										borderRadius: 999,
										padding: '10px 22px',
									}}
								>
									{props.labelBottom}
								</span>
							</div>
						)}
					</AbsoluteFill>
					{/* linia despărțitoare — structural, se subțiază spre 0 chiar la topire */}
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: 0,
							right: 0,
							height: 2,
							background: colors.coral,
							transform: `scaleY(${1 - mergeProgress})`,
						}}
					/>

					<div style={{position: 'absolute', top: '6%', left: '8%', right: '8%'}}>
						<KineticText
							text={props.text1}
							style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: colors.cream, lineHeight: 1.25}}
						/>
					</div>
					{frame >= S_TEXT2 && (
						<div style={{position: 'absolute', top: '58%', left: '8%', right: '8%'}}>
							<KineticText
								text={props.text2}
								delayFrames={S_TEXT2}
								style={{fontFamily: fonts.body, fontSize: 26, color: colors.plum, lineHeight: 1.3}}
							/>
						</div>
					)}
				</AbsoluteFill>
			)}

			{/* --- faza 2: unificat, cream — semnul-coadă, contorul, CTA.
			    Ancore fixe pe toată înălțimea (5%–90%), nu un bloc centrat —
			    vezi lecția din ziua 03 despre distribuția verticală. --- */}
			{isMerged && (
				<AbsoluteFill style={{background: colors.cream}}>
					<div style={{position: 'absolute', top: '6%', left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
						<QueueMark size={110} background="light" />
					</div>

					{frame >= S_COUNTER_SHOW && (
						<div
							style={{
								position: 'absolute',
								top: '24%',
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
									fontSize: 160,
									fontVariantNumeric: 'tabular-nums',
									color: rateSettled ? colors.signal : colors.plum,
								}}
							>
								{rateSettled ? props.rateTo : `${rateNow.toFixed(2).replace('.', ',')}%`}
							</span>
						</div>
					)}

					{/* singura apariție a albastrului de semnal e pe cifra de mai sus —
					    pastila de economii rămâne coral, ca să nu dubleze accentul */}
					{rateSettled && (
						<div style={{position: 'absolute', top: '44%', left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
							<span
								style={{
									opacity: savingsAppear,
									fontFamily: fonts.display,
									fontWeight: 700,
									fontSize: 32,
									color: colors.cream,
									background: colors.coral,
									borderRadius: 999,
									padding: '10px 26px',
								}}
							>
								{props.savingsAmount}
							</span>
						</div>
					)}

					{frame >= S_SAVINGS && (
						<p
							style={{
								position: 'absolute',
								top: '54%',
								left: '10%',
								right: '10%',
								margin: 0,
								textAlign: 'center',
								fontFamily: fonts.body,
								fontSize: 17,
								color: colors.plum,
								opacity: 0.55 * savingsAppear,
							}}
						>
							{props.daeNote}
						</p>
					)}

					{frame >= S_LOCKUP && (
						<div
							style={{
								position: 'absolute',
								top: '85%',
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

const AlgorithmGrid: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const shift = ((frame / fps) * 40) % 60;
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				backgroundImage:
					'repeating-linear-gradient(90deg, rgba(255,248,240,0.10) 0px, rgba(255,248,240,0.10) 1px, transparent 1px, transparent 60px)',
				backgroundPositionX: `${shift}px`,
			}}
		/>
	);
};
