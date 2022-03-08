import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";

interface SkyProps {
	time: string;
}

function MovingSky(props: SkyProps): JSX.Element {
	const [inclination, setInclination] = React.useState(0.6);
	const [rayleigh, setRayleigh] = React.useState(0.5);

	// noon: inc = 0.6, rayl = 0.5
	// dawn: inc = 0.51, rayl = ~8
	useFrame((state, delta) => {
		if (props.time === "dawn" && inclination > 0.51) {
			setInclination((a) => a - delta * 0.1);
			setRayleigh((a) => a + delta * 8.3);
		} else if (props.time === "noon" && inclination < 0.6) {
			setInclination((a) => a + delta * 0.1);
			setRayleigh((a) => a - delta * 8.3);
		}
	});

	return (
		<Sky
			distance={4000}
			inclination={inclination}
			azimuth={3 / 4}
			turbidity={0.5}
			rayleigh={rayleigh}
			mieDirectionalG={0.4}
			mieCoefficient={0.01}
		></Sky>
	);
}

export default MovingSky;
