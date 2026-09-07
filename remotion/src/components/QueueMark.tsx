import React from 'react';
import {colors} from '../tokens';

/**
 * Identity anchor comun întregii serii — vezi design-system.md.
 * Două bare-pastilă offset diagonal, geometria din cr_semn_light.svg /
 * cr_semn_dark.svg. Nu se contopește niciodată într-o singură bară.
 *
 * IMPORTANT: bara translucidă din spate trebuie să contrasteze cu fundalul,
 * nu să-l copieze — cr_semn_light.svg (fundal deschis) o pune plum, iar
 * cr_semn_dark.svg (fundal închis) o pune cream. O culoare hardcodată aici
 * devine invizibilă pe fundalul opus (plum 35% peste plum ≈ nimic).
 */
export const QueueMark: React.FC<{
	size?: number;
	solidColor?: string;
	background?: 'light' | 'dark';
	scale?: number;
}> = ({size = 96, solidColor = colors.coral, background = 'light', scale = 1}) => {
	const barW = size;
	const barH = size * 0.38;
	const r = barH / 2;
	const mutedColor = background === 'dark' ? colors.cream : colors.plum;

	return (
		<div
			style={{
				position: 'relative',
				width: barW * 1.18,
				height: barH * 2.1,
				transform: `scale(${scale})`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: barW,
					height: barH,
					borderRadius: r,
					background: mutedColor,
					opacity: 0.35,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					right: 0,
					width: barW,
					height: barH,
					borderRadius: r,
					background: solidColor,
				}}
			/>
		</div>
	);
};
