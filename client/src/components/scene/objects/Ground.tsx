import { Fog, RepeatWrapping } from "three";
import React, { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import grassImg from "../../../assets/grass2.jpg";

const GROUND_RES = 50;

function Ground(props: JSX.IntrinsicElements["mesh"]) {
	const ref = useRef<THREE.Mesh>(null!);

	const maps = useTexture({ map: grassImg });
	maps.map.wrapS = maps.map.wrapT = RepeatWrapping;
	maps.map.repeat.set(5, 5);
	maps.map.needsUpdate = true;

	const {
		scene,
		camera,
		gl: { domElement },
	} = useThree();

	useEffect(() => {
		scene.fog = new Fog("f1f1f1", -10, 80);
	}, []);

	return (
		<mesh
			{...props}
			position={[0, 0, 0]}
			ref={ref}
			rotation={[-Math.PI / 2, 0, 0]}
			scale={[100, 100, 1]}
		>
			<planeGeometry args={[1, 1, GROUND_RES, GROUND_RES]} />
			<meshStandardMaterial {...maps} roughness={0.5} />
		</mesh>
	);
}

export default Ground;
