import React from "react";

import { useAppDispatch } from "../../../app/hooks";
import { changeToNoon } from "../../../components/scene/sceneSlice";

import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { doRegister } from "../../../api/requests";

interface signupProps {
	setUseValid: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SignupForm(props: signupProps) {
	const dispatch = useAppDispatch();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		console.log({
			email: data.get("email"),
			password: data.get("password"),
			usename: data.get("username"),
		});

		// send to backend
		const res = doRegister({
			email: data.get("email") as string,
			username: data.get("username") as string,
			password: data.get("password") as string,
			firstName: "jimothy",
			lastName: "jwtlover",
		})
			.then((data) => {
				console.log(data);
				props.setUseValid(true);
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<Container component="main" maxWidth="lg">
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
							<Grid item xs={12} display="flex">
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
								Have a Login?
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
								Go Back
							</Button>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}
