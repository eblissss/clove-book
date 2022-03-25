import React from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../app/hooks";
import { changeToDawn } from "../../../components/scene/sceneSlice";
import { doLogin } from "../../../api/requests";

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
import md5 from "md5";
import { setUserID } from "../../user/userSlice";
import { decodeToken } from "react-jwt";

interface cbJWT {
	userID: string;
}

export function LoginForm() {
	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		console.log({
			username: data.get("username"),
			password: data.get("password"),
		});

		// Check if user/pass is empty

		const res = doLogin({
			username: data.get("username") as string,
			password: md5(data.get("password") as string),
		})
			.then((data) => {
				console.log(data);
				if (data !== undefined) {
					const decoded = decodeToken(data.refreshToken);
					const userID: string = (decoded as cbJWT)!.userID;
					console.log(decoded);
					console.log(userID);

					dispatch(setUserID(userID));

					navigate("/home");
				}
			})
			.catch((err) => console.log(err));

		// check with backend
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
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography variant="h5" align="center">
						Log In
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
						<Button className="Submit" type="submit" fullWidth>
							Log In
						</Button>
						<Grid container justifyContent="center">
							<Typography variant="body2" align="center">
								No Account? 🥺
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
