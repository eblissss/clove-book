import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useAppDispatch } from "../../../app/hooks";
import { changeToNoon } from "../../../components/scene/sceneSlice";

import { Box, TextField } from "@mui/material";

export function SignupForm() {
	const dispatch = useAppDispatch();

	return (
		<Box
			component="div"
			sx={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: "#444",
				width: "100%",
				height: "100%",
				borderRadius: "20px",
			}}
		>
			<TextField id="email" label="Email" variant="outlined" />
			<TextField id="password" label="Password" variant="outlined" />
			<button
				className="but"
				onClick={() => {
					dispatch(changeToNoon());
				}}
			>
				Go To Login
			</button>
		</Box>
	);
}
