import React, { useState } from "react";
import { useAppSelector } from "../../app/hooks";

import Scene from "../../components/scene/Scene";
import { selectTime } from "../../components/scene/sceneSlice";

import { LoginForm } from "./Forms/LoginForm";
import { SignupForm } from "./Forms/SignupForm";
import { ValidForm } from "./Forms/ValidForm";

// Still needed for movement
import "./Login.css";

// This will include both login and signup

export default function Login() {
	const time = useAppSelector(selectTime);

	const [useValid, setUseValid] = useState(false);

	return (
		<>
			<Scene />
			<div className={"loginDiv " + (time === "dawn" ? "centerDiv" : "")}>
				{useValid ? <ValidForm /> : <LoginForm />}
			</div>
			<div
				className={"signupDiv " + (time === "dawn" ? "centerDiv" : "")}
			>
				<SignupForm setUseValid={setUseValid} />
			</div>
		</>
	);
}
