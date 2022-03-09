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
		});

		props.setUseValid(true);
	};

	return (
		<>
			<Container
				component="main"
				maxWidth="lg"
				sx={{
					alignItems: "center",
					justifyContent: "center",
					direction: "column",
				}}
			>
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
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									sx={{
										width: "80%",
										m: "0px auto",
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
						</Grid>
						<Button
							className="Submit"
							type="submit"
							sx={{
								width: "80%",
								borderRadius: "100px",
								m: "20px",
								backgroundColor: "tertiary.main",
								boxShadow: "rgba(0, 0, 0, 0.1) 0 2px 4px 0",
								color: "#fff",
								fontFamily: [
									"sans-serif",
									"BlinkMacSystemFont",
									"-apple-system",
									"Akzidenz Grotesk BQ Medium",
								],
								fontSize: "16px",
								fontWeight: 400,
								padding: "10px 25px",
								transition: "transform 150ms, box-shadow 150ms",
							}}
							onClick={() => {
								dispatch(changeToNoon());
							}}
						>
							Sign Up
						</Button>
					</Box>
				</Box>
			</Container>
		</>
	);
}
