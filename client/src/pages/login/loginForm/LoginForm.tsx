import React from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useAppDispatch } from "../../../app/hooks";
import { changeToDawn } from "../../../components/scene/sceneSlice";

import { Box, Button, FilledInput, makeStyles, TextField } from "@mui/material";

// const useStyles = makeStyles((theme: any) => ({
// 	root: {
// 		"& .MuiFilledInput-root": {
// 			backgroundColor: "rgb(232, 241, 250)",
// 		},
// 		"& .MuiFilledInput-root:hover": {
// 			backgroundColor: "rgb(250, 232, 241)",
// 			// Reset on touch devices, it doesn't add specificity
// 			"@media (hover: none)": {
// 				backgroundColor: "rgb(232, 241, 250)",
// 			},
// 		},
// 		"& .MuiFilledInput-root.Mui-focused": {
// 			backgroundColor: "rgb(250, 241, 232)",
// 		},
// 	},
// }));

export function LoginForm() {
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
			<TextField
				id="username"
				label="Username"
				// placeholder="Username"
				variant="filled"
				InputProps={{ disableUnderline: true }}
				sx={{
					width: "80%",
					borderRadius: "100px",
					background: "white",
					margin: "20px auto",
					marginTop: "20px",
				}}
			/>
			<TextField
				id="password"
				label="Password"
				// placeholder="Password"
				variant="filled"
				// disableUnderline={true}
				sx={{
					width: "80%",
					borderRadius: "100px",
					backgroundColor: "white",
					margin: "20px auto",
					marginTop: "20px",
				}}
			/>
			<Button
				variant="contained"
				sx={{
					width: "80%",
					borderRadius: "100px",
					margin: "20px auto",
				}}
			>
				Log In
			</Button>
			<button
				className="but"
				onClick={() => {
					dispatch(changeToDawn());
				}}
			>
				Go To Sign Up
			</button>
		</Box>
	);
}
