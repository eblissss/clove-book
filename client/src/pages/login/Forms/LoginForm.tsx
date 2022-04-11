import React from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../app/hooks";
import { changeToDawn } from "../../../components/scene/sceneSlice";
import { doLogin, getFavoriteIDs } from "../../../api/requests";

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
import { setInitialFavorites } from "../../../components/userFavs/favSlice";

interface cbJWT {
	userID: string;
	exp: string;
}

interface loginProps {
	setUseReset: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LoginForm({ setUseReset }: loginProps) {
	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const resetPassword = () => {
		setUseReset(true);
		dispatch(changeToDawn());
	};

	const gotoSignup = () => {
		setUseReset(false);
		dispatch(changeToDawn());
	};

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
					const expiry: string = (decoded as cbJWT)!.exp;
					localStorage.setItem("userID", userID);
					localStorage.setItem("expiry", expiry);
					localStorage.setItem("refresh", data.refreshToken);

					dispatch(setUserID(userID));

					getFavoriteIDs(userID, "").then((data) => {
						console.log(data);
						dispatch(setInitialFavorites({ data, userID }));
					});

					navigate("/home");
				}
			})
			.catch((err) => console.log(err));
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
					<Avatar
						sx={{ m: 1, bgcolor: "secondary.main", margin: "10px" }}
					>
						<LockOutlinedIcon />
					</Avatar>
					<Typography variant="h5" align="center">
						Log in to Clove
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
									//id="username"
									id="outlined-error-helper-text"
									label="Username"
									name="username"
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12} display="flex">
								<TextField
									className="Round"
									fullWidth
									//id="password"
									id="outlined-error-helper-text"
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
									label="Keep me logged in"
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
								className="OnLight"
								variant="contained"
								fullWidth
								onClick={gotoSignup}
							>
								Sign up
							</Button>
							<Button
								className="OnLight"
								variant="contained"
								fullWidth
								onClick={resetPassword}
							>
								Reset Password
							</Button>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}
