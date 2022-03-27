import React from "react";
import md5 from "md5";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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

export function SignupForm({ userInfo, setUseValid }: signupProps) {
	const dispatch = useAppDispatch();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		// console.log({
		// 	email: data.get("email"),
		// 	password: md5(data.get("password") as string),
		// 	username: data.get("username"),
		// 	firstName: data.get("firstName"),
		// 	lastName: data.get("lastName"),
		// });

		// VALIDATE HERE

		setUseValid(true);

		userInfo.username = data.get("username") as string;
		userInfo.email = data.get("email") as string;
		userInfo.password = md5(data.get("password") as string);
		userInfo.firstName = data.get("firstName") as string;
		userInfo.lastName = data.get("lastName") as string;

		doAuth({ username: userInfo.username, email: userInfo.email });
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<Box
					component="div"
					sx={{
						bgcolor: "primary.light",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						borderRadius: "22px",
						textAlign: "center",
						px: "10%",
						pb: "10%",
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
									className="Round"
									id="firstName"
									label="First Name"
									name="firstName"
									autoComplete="firstName"
								/>
								<TextField
									className="Round"
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lastName"
								/>
							</Grid>
							<Grid item xs={12} display="flex">
								<TextField
									className="Round"
									fullWidth
									id="username"
									label="Username"
									name="username"
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12} display="flex">
								<TextField
									className="Round"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12} display="flex" margin="10px">
								<TextField
									className="Round"
									fullWidth
									id="password"
									label="Password"
									name="password"
									type="password"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<Button
							className="Submit"
							type="submit"
							fullWidth
							onClick={() => {
								dispatch(changeToNoon());
							}}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="center">
							<Typography variant="body2" align="center">
								Have a Account?
							</Typography>
							<Button
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
