import React from "react";
import "./Login.css";
import Scene from "../../components/scene/Scene";

import { useAppDispatch } from "../../app/hooks";
import { changeToDawn } from "../../components/scene/sceneSlice";

// This will include both login and signup

export default function Login() {
	const dispatch = useAppDispatch();

	return (
		<>
			<Scene />
			<div id="loginMain">
				<button
					className="but"
					onClick={() => dispatch(changeToDawn())}
				>
					DAWN
				</button>
				<iframe
					title="vid"
					id="ytplayer"
					width="1000"
					height="180"
					src="https://www.youtube.com/embed/dNl4-w9ZrBs?autoplay=1"
				></iframe>
			</div>
		</>
	);
}
