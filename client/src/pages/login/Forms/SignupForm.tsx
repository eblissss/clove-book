import React, { useState } from "react";
import md5 from "md5";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as VALID from "./validator";

import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
} from "@mui/material";

import { useAppDispatch } from "../../../app/hooks";
import { changeToNoon } from "../../../components/scene/sceneSlice";

import { doAuth } from "../../../api/requests";
import { NewUser } from "../../../api/models";

interface signupProps {
	userInfo: NewUser;
	setUseValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialError: NewUser = {
	username: "",
	email: "",
	password: "",
	firstName: "",
	lastName: "",
};

export function SignupForm({ userInfo, setUseValid }: signupProps) {
	const dispatch = useAppDispatch();

	const [errorMessages, setErrorMessages] = useState<NewUser>(initialError);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		userInfo.username = data.get("username") as string;
		userInfo.email = data.get("email") as string;
		userInfo.password = data.get("password") as string;
		userInfo.firstName = data.get("firstName") as string;
		userInfo.lastName = data.get("lastName") as string;

		setErrorMessages({
			email: VALID.isEmail(userInfo.email),
			username: VALID.isUsername(userInfo.username),
			password: VALID.isPassword(userInfo.password),
			firstName: VALID.isGoodName(userInfo.firstName),
			lastName: VALID.isGoodName(userInfo.lastName),
		});

		if (VALID.isEmail(userInfo.email)) return;
		if (VALID.isUsername(userInfo.username)) return;
		if (VALID.isPassword(userInfo.password)) return;
		if (VALID.isGoodName(userInfo.firstName)) return;
		if (VALID.isGoodName(userInfo.lastName)) return;

		userInfo.password = md5(userInfo.password);

		localStorage.setItem("userInfo-username", userInfo.username);
		localStorage.setItem("userInfo-email", userInfo.email);
		localStorage.setItem("userInfo-password", userInfo.password);
		localStorage.setItem("userInfo-firstName", userInfo.firstName);
		localStorage.setItem("userInfo-lastName", userInfo.lastName);
		localStorage.setItem("immediateValidate", "true");

		setUseValid(true);
		doAuth({ username: userInfo.username, email: userInfo.email });
		dispatch(changeToNoon());
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<Box
					component="div"
					sx={{
						bgcolor: "primary.light",
						marginTop: "8px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						borderRadius: "22px",
						textAlign: "center",
						justifyContent: "center",
						px: "10%",
						pb: "10%",
						pt: "5%",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography variant="h5" align="center">
						Sign Up
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} display="flex">
								<TextField
									error={errorMessages?.firstName !== ""}
									helperText={errorMessages?.firstName}
									className="Round"
									id="firstName"
									label="First Name"
									name="firstName"
									autoComplete="firstName"
									onChange={() => {
										setErrorMessages({
											...errorMessages,
											firstName: "",
										});
									}}
								/>
								<TextField
									error={errorMessages?.lastName !== ""}
									helperText={errorMessages?.lastName}
									className="Round"
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lastName"
									onChange={() => {
										setErrorMessages({
											...errorMessages,
											lastName: "",
										});
									}}
								/>
							</Grid>
							<Grid item xs={12} display="flex">
								<TextField
									error={errorMessages?.username !== ""}
									helperText={errorMessages?.username}
									className="Round"
									fullWidth
									id="username"
									label="Username"
									name="username"
									autoComplete="username"
									onChange={() => {
										setErrorMessages({
											...errorMessages,
											username: "",
										});
									}}
								/>
							</Grid>
							<Grid item xs={12} display="flex">
								<TextField
									error={errorMessages?.email !== ""}
									helperText={errorMessages?.email}
									className="Round"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									onChange={() => {
										setErrorMessages({
											...errorMessages,
											email: "",
										});
									}}
								/>
							</Grid>
							<Grid item xs={12} display="flex" mb="10px">
								<TextField
									error={errorMessages?.password !== ""}
									helperText={errorMessages?.password}
									className="Round"
									fullWidth
									id="password"
									label="Password"
									name="password"
									type="password"
									autoComplete="new-password"
									onChange={() => {
										setErrorMessages({
											...errorMessages,
											password: "",
										});
									}}
								/>
							</Grid>
						</Grid>
						<Button className="Submit" type="submit" fullWidth>
							Sign Up
						</Button>
						<Grid container justifyContent="center">
							<Typography variant="body2" align="center">
								Have a Account?
							</Typography>
							<Button
								className="OnLight"
								variant="contained"
								fullWidth
								sx={{
									borderRadius: "100px",
									mt: "10px",
									mb: "20px",
								}}
								onClick={() => {
									dispatch(changeToNoon());
								}}
							>
								Back
							</Button>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}
