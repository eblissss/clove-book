import * as THREE from "three";
import React, { useRef, useState } from "react";

interface TreeProps {
	position: [x: number, y: number, z: number];
	scale?: [x: number, y: number, z: number];
}

const nPiOver2 = -Math.PI / 2;

function Tree(props: TreeProps) {
	const tree = useRef<THREE.Mesh>(null!);

	return (
		<group ref={tree} {...props}>
			<mesh>
				<cylinderGeometry args={[0.4, 0.4, 4, 12]} />
				<meshStandardMaterial color={"#594833"} />
			</mesh>
			<mesh position={[0, 2.5, 0]}>
				<coneGeometry args={[1.5, 4, 14]} />
				<meshStandardMaterial color={"#234F1E"} />
			</mesh>
			<mesh position={[0, 3.5, 0]}>
				<coneGeometry args={[1.3, 3, 14]} />
				<meshStandardMaterial color={"#234F1E"} />
			</mesh>
		</group>
	);
}

export default Tree;
