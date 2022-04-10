import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Avatar,
	Box,
	Button,
	Container,
	TextField,
	Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { sendResetEmail } from "../../../api/requests";
import { useDispatch } from "react-redux";
import { changeToNoon } from "../../../components/scene/sceneSlice";

interface resetProps {
	setUseReset: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ResetForm({ setUseReset }: resetProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		sendResetEmail(data.get("email") as string)
			.then(() => {
				setEmailSent(true);
			})
			.catch((err) => console.log(err));
	};

	const setUseResetFalse = () => {
		setUseReset(false);
	};

	const stopReset = () => {
		setTimeout(setUseResetFalse, 800);
		setEmailSent(false);
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
					<Typography variant="h5" align="center" gutterBottom>
						Reset Password
					</Typography>
					{!emailSent ? (
						<>
							<Typography variant="body2" align="center">
								Input your email to recover your password.
							</Typography>
							<Typography
								variant="body1"
								align="center"
								sx={{ mt: "20px" }}
							>
								Please enter your email.
							</Typography>
							<Box
								component="form"
								noValidate
								onSubmit={handleSubmit}
							>
								<TextField
									className="Round"
									fullWidth
									id="email"
									label="Email"
									name="email"
								/>
								<Button
									variant="contained"
									type="submit"
									className="Submit"
									fullWidth
								>
									Submit
								</Button>
							</Box>
							<Button
								className="OnLight"
								variant="contained"
								type="button"
								fullWidth
								sx={{
									borderRadius: "100px",
									my: "20px",
								}}
								onClick={stopReset}
							>
								Cancel
							</Button>
						</>
					) : (
						<>
							<Typography
								variant="body1"
								align="center"
								sx={{ mt: "20px" }}
							>
								An email has been sent with instructions to
								reset your password.
							</Typography>
							<Button
								className="OnLight"
								variant="contained"
								type="button"
								fullWidth
								sx={{
									borderRadius: "100px",
									my: "20px",
								}}
								onClick={() => {
									stopReset();
									navigate("/");
								}}
							>
								Go Back
							</Button>
						</>
					)}
				</Box>
			</Container>
		</>
	);
}
