import { LinearScale, ScatterPlot } from "@material-ui/icons";
import React, { useState } from "react";
import Tree from "../meshes/Tree";

const NUM_TREES = 150;
const BACK_TREES = 40;

const trees: JSX.Element[] = new Array<JSX.Element>(NUM_TREES + BACK_TREES);

for (let i = 0; i < NUM_TREES; i++) {
	const xPos = Math.random() * 40 - 20;
	const zPos = Math.random() * 10 - 16;
	const scale = (Math.random() + 0.5) / 2;
	trees[i] = (
		<Tree position={[xPos, 1, zPos]} scale={[scale, scale, scale]} />
	);
}

for (let i = NUM_TREES; i < NUM_TREES + BACK_TREES; i++) {
	const xPos = (i - NUM_TREES) * (120 / BACK_TREES) - 60;
	trees[i] = <Tree position={[xPos, 1, -40]} />;
}

function Trees(): JSX.Element {
	return <>{trees}</>;
}

export default Trees;
