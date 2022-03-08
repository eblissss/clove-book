import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectTime } from "./sceneSlice";
import styles from "./Scene.module.css";

import Trees from "./objects/Trees";
import Ground from "./objects/Ground";
import MovingSky from "./objects/MovingSky";

function Scene() {
	const time = useAppSelector(selectTime);

	return (
		<Suspense fallback={<></>}>
			<div className={styles.back}>
				<Canvas
					className={styles.canvas}
					camera={{
						fov: 75,
						near: 0.1,
						far: 1000,
						position: [0, 2, 0],
						rotation: [0, 0, 0],
					}}
				>
					<MovingSky time={time} />
					{/* <axesHelper args={[5]} />
					<ambientLight intensity={0.5} />
					<pointLight
						position={[0, 10, 0]}
						intensity={0.3}
					></pointLight>
					<Suspense fallback={<></>}>
						<Ground />
					</Suspense>
					<Trees /> */}
				</Canvas>
			</div>
		</Suspense>
	);
}

export default Scene;
