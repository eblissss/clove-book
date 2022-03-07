import React, { useState } from "react";
import "./Login.css";
import Scene from "../../components/scene/Scene";

import { useAppDispatch } from "../../app/hooks";
import { changeToDawn, changeToNoon } from "../../components/scene/sceneSlice";

// This will include both login and signup

export default function Login() {
	const dispatch = useAppDispatch();

	const [centerDiv, setCenterDiv] = useState("login");

	return (
		<>
			<Scene />
			<div
				className={
					"loginDiv " + (centerDiv === "login" ? "" : "centerDiv")
				}
			>
				<button
					className="but"
					onClick={() => {
						dispatch(changeToDawn());
						setCenterDiv("signup");
					}}
				>
					Go To Sign Up
				</button>
			</div>
			<div
				className={
					"signupDiv " + (centerDiv === "login" ? "" : "centerDiv")
				}
			>
				<button
					className="but"
					role="button"
					onClick={() => {
						dispatch(changeToNoon());
						setCenterDiv("login");
					}}
				>
					Go To Login
				</button>
			</div>
		</>
	);
}
