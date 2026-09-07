import React from 'react';
import {Composition} from 'remotion';
import {BirocratieComparison, birocratieDefaultProps} from './compositions/BirocratieComparison';
import {CasaVsCreditul, casaVsCreditulDefaultProps, CASA_VS_CREDITUL_DURATION} from './compositions/CasaVsCreditul';
import {VenitulVariabil, venitulVariabilDefaultProps, VENITUL_VARIABIL_DURATION} from './compositions/VenitulVariabil';
import {Mecanismul, mecanismulDefaultProps, MECANISMUL_DURATION} from './compositions/Mecanismul';

const FPS = 30;
const DURATION_IN_FRAMES = 11 * FPS; // 10–11s, per planul de conținut

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* ziua 01 — casa vs creditul */}
			<Composition
				id="CasaVsCreditul9x16"
				component={CasaVsCreditul}
				durationInFrames={CASA_VS_CREDITUL_DURATION}
				fps={FPS}
				width={1080}
				height={1920}
				defaultProps={casaVsCreditulDefaultProps}
			/>
			<Composition
				id="CasaVsCreditul1x1"
				component={CasaVsCreditul}
				durationInFrames={CASA_VS_CREDITUL_DURATION}
				fps={FPS}
				width={1080}
				height={1080}
				defaultProps={casaVsCreditulDefaultProps}
			/>

			{/* ziua 02 — venitul variabil */}
			<Composition
				id="VenitulVariabil9x16"
				component={VenitulVariabil}
				durationInFrames={VENITUL_VARIABIL_DURATION}
				fps={FPS}
				width={1080}
				height={1920}
				defaultProps={venitulVariabilDefaultProps}
			/>
			<Composition
				id="VenitulVariabil1x1"
				component={VenitulVariabil}
				durationInFrames={VENITUL_VARIABIL_DURATION}
				fps={FPS}
				width={1080}
				height={1080}
				defaultProps={venitulVariabilDefaultProps}
			/>

			{/* ziua 03 — birocrația */}
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

			{/* ziua 04 — mecanismul (hero, semnal albastru o singură dată) */}
			<Composition
				id="Mecanismul9x16"
				component={Mecanismul}
				durationInFrames={MECANISMUL_DURATION}
				fps={FPS}
				width={1080}
				height={1920}
				defaultProps={mecanismulDefaultProps}
			/>
			<Composition
				id="Mecanismul1x1"
				component={Mecanismul}
				durationInFrames={MECANISMUL_DURATION}
				fps={FPS}
				width={1080}
				height={1080}
				defaultProps={mecanismulDefaultProps}
			/>
		</>
	);
};
