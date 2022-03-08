import React from "react";
import { useAppSelector } from "../../app/hooks";

import Scene from "../../components/scene/Scene";
import { selectTime } from "../../components/scene/sceneSlice";

import { LoginForm } from "./loginForm/LoginForm";
import { SignupForm } from "./signupForm/SignupForm";

import "./Login.css";

// This will include both login and signup

export default function Login() {
	const time = useAppSelector(selectTime);

	return (
		<>
			<Scene />
			<div className={"loginDiv " + (time === "dawn" ? "centerDiv" : "")}>
				<LoginForm />
			</div>
			<div
				className={"signupDiv " + (time === "dawn" ? "centerDiv" : "")}
			>
				<SignupForm />
			</div>
		</>
	);
}
