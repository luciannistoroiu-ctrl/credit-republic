import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../tokens';
import {QueueMark} from '../components/QueueMark';
import {KineticText} from '../components/KineticText';

/**
 * Ziua 02 — "obiceiul 02: crezi că un refuz e verdictul întregii piețe"
 * Unghi 03 (venitul variabil), registru UMAN — căldură, CTA moale.
 * Mecanism: un singur cadru continuu, fără cameră, fără tăietură — trei
 * răspunsuri diferite la aceeași întrebare, developed unul câte unul.
 */
export type VenitulVariabilProps = {
	hook1: string;
	hook2: string;
	item1Label: string;
	item1Detail: string;
	item2Label: string;
	item2Detail: string;
	item3Label: string;
	item3Detail: string;
	cta: string;
};

export const venitulVariabilDefaultProps: VenitulVariabilProps = {
	hook1: 'o bancă ți-a spus nu.',
	hook2: 'nu înseamnă că piața a spus nu.',
	item1Label: '100%',
	item1Detail: 'unele bănci iau în calcul 100% din dividende',
	item2Label: '50%',
	item2Detail: 'altele doar 50%',
	item3Label: '1–2 ani',
	item3Detail: 'vechimea minimă pe PFA variază',
	cta: 'vezi unde te califici',
};

const FPS = 30;
export const VENITUL_VARIABIL_DURATION = 13 * FPS; // 390 cadre

const S_HOOK1 = 0;
const S_HOOK2 = 2.4 * FPS;
const S_ITEM1 = 4.8 * FPS;
const S_ITEM2 = 6.0 * FPS;
const S_ITEM3 = 7.2 * FPS;
const S_LOCKUP = 9.6 * FPS;

const ChecklistRow: React.FC<{label: string; detail: string; delayFrames: number}> = ({label, detail, delayFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const appear = spring({frame: frame - delayFrames, fps, config: {damping: 200}});
	if (frame < delayFrames) return null;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 20,
				opacity: appear,
				transform: `translateX(${(1 - appear) * -24}px)`,
			}}
		>
			<span
				style={{
					fontFamily: fonts.display,
					fontWeight: 800,
					fontSize: 40,
					color: colors.cream,
					background: colors.plum,
					borderRadius: 999,
					padding: '8px 20px',
					minWidth: 92,
					textAlign: 'center',
				}}
			>
				{label}
			</span>
			<span style={{fontFamily: fonts.body, fontSize: 32, color: colors.plum, opacity: 0.85, maxWidth: 520}}>
				{detail}
			</span>
		</div>
	);
};

export const VenitulVariabil: React.FC<VenitulVariabilProps> = (props) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const lockupAppear = spring({frame: frame - S_LOCKUP, fps, config: {damping: 200}});
	const breathe = 1 + Math.sin(((frame - S_LOCKUP) / fps) * Math.PI) * 0.02;

	return (
		<AbsoluteFill style={{background: colors.cream}}>
			{/* fără linia structurală aici — conținutul e aliniat la stânga (nu centrat),
			    iar checklist-ul însuși dă ritmul; o linie dead-center ar tăia arbitrar
			    printr-un bloc de text stânga-aliniat, fără să servească drept ax real. */}
			{/* ancora de brand — mic, colț sus, prezent tot filmul, ca deschiderea sa nu fie orfana */}
			<div style={{position: 'absolute', top: '7%', left: '9%'}}>
				<QueueMark size={46} background="light" />
			</div>

			<AbsoluteFill style={{padding: '0 9%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 46}}>
				{/* hook — kinetic type, o singură dată, rămâne pe ecran tot filmul (căldura registrului uman: nu dispare brusc) */}
				<div style={{minHeight: 190}}>
					{frame >= S_HOOK1 && (
						<Sequence from={S_HOOK1} layout="none">
							<KineticText
								text={props.hook1}
								style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: colors.plum, lineHeight: 1.12}}
							/>
						</Sequence>
					)}
					{frame >= S_HOOK2 && (
						<Sequence from={S_HOOK2} layout="none">
							<KineticText
								text={props.hook2}
								style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: colors.plum, lineHeight: 1.12, marginTop: 6}}
							/>
						</Sequence>
					)}
				</div>

				{/* checklist — 3 răspunsuri diferite, unul câte unul, aceeași întrebare */}
				<div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
					<ChecklistRow label={props.item1Label} detail={props.item1Detail} delayFrames={S_ITEM1} />
					<ChecklistRow label={props.item2Label} detail={props.item2Detail} delayFrames={S_ITEM2} />
					<ChecklistRow label={props.item3Label} detail={props.item3Detail} delayFrames={S_ITEM3} />
				</div>

				{/* lockup CTA — în același flux ca restul conținutului (nu ancorat separat
				    la marginea de jos), ca să nu lase un gol necontrolat sub checklist */}
				<Sequence from={S_LOCKUP} durationInFrames={VENITUL_VARIABIL_DURATION - S_LOCKUP} layout="none">
					<div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: lockupAppear, transform: `scale(${breathe})`}}>
						<span
							style={{
								fontFamily: fonts.display,
								fontWeight: 700,
								fontSize: 38,
								color: colors.cream,
								background: colors.coral,
								borderRadius: 999,
								padding: '16px 34px',
							}}
						>
							{props.cta}
						</span>
					</div>
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
