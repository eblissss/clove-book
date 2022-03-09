import React from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../app/hooks";
import { changeToDawn } from "../../../components/scene/sceneSlice";

import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Container,
	FormControlLabel,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export function LoginForm() {
	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		console.log({
			email: data.get("email"),
			password: data.get("password"),
		});

		navigate("/home");
	};

	return (
		<>
			<Container component="main" maxWidth="sm">
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
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography
						variant="h5"
						align="center"
						sx={{ width: "80%" }}
					>
						Login
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
									sx={{
										width: "80%",
										margin: "10px auto",
										marginTop: "0px",
									}}
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
									sx={{
										width: "80%",
										margin: "10px auto",
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Checkbox
											value="stayLoggedIn"
											color="primary"
										/>
									}
									label="Stay Logged In"
								/>
							</Grid>
						</Grid>
						<Button
							variant="contained"
							type="submit"
							sx={{
								width: "80%",
								borderRadius: "100px",
								mt: "0px",
								mb: "20px",
							}}
						>
							Log In
						</Button>
						<Grid container justifyContent="center">
							<Typography
								variant="body2"
								align="center"
								sx={{ width: "80%" }}
							>
								New? Sign Up Below
							</Typography>
							<Button
								variant="contained"
								sx={{
									width: "80%",
									borderRadius: "100px",
									mt: "10px",
									mb: "20px",
								}}
								onClick={() => {
									dispatch(changeToDawn());
								}}
							>
								Goto Signup
							</Button>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}
