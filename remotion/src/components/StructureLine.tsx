import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * Reper de grid vertical, edge-to-edge — singurul dispozitiv structural
 * permis pe lângă conținut, ca spațiul negativ să citească intențional,
 * nu ca void needucat (vezi bar.md, mecanismul 7). Se randează DEASUPRA
 * fundalului plat dar SUB conținut — pune-l primul copil în layer-ul de
 * conținut, nu în fundalul opac (altfel e acoperit complet).
 */
export const StructureLine: React.FC<{dark: boolean}> = ({dark}) => (
	<AbsoluteFill style={{alignItems: 'center'}}>
		<div
			style={{
				width: 1,
				height: '100%',
				background: dark ? 'rgba(255,248,240,0.14)' : 'rgba(43,38,64,0.12)',
			}}
		/>
	</AbsoluteFill>
);
