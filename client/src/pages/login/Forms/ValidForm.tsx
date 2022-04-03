import React from "react";
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
import { doLogin, doRegister } from "../../../api/requests";
import { NewUser } from "../../../api/models";
import { setUserID } from "../../user/userSlice";
import { useDispatch } from "react-redux";

interface validProps {
	userInfo: NewUser;
	setUseValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const removeStorage = () => {
	localStorage.removeItem("userInfo-username");
	localStorage.removeItem("userInfo-email");
	localStorage.removeItem("userInfo-password");
	localStorage.removeItem("userInfo-firstName");
	localStorage.removeItem("userInfo-lastName");
	localStorage.removeItem("immediateValidate");
};

export function ValidForm({ userInfo, setUseValid }: validProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const code = data.get("code") as string;
		console.log(code);

		// validate
		doRegister(userInfo, code)
			.then((data) => {
				console.log(data);
				removeStorage();
				doLogin({
					username: userInfo.username,
					password: userInfo.password,
				})
					.then((res) => {
						console.log(res);
						dispatch(setUserID(data.userID));
						navigate("/home");
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err));
	};

	const stopRegister = () => {
		removeStorage();
		setUseValid(false);
		navigate("/");
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
						Register
					</Typography>
					<Typography variant="body2" align="center">
						Check your inbox for a confirmation email with the
						verification code.
					</Typography>

					<Typography variant="body2" align="center">
						After confirming your email, you will be able to log in.
					</Typography>
					<Typography
						variant="body1"
						align="center"
						sx={{ mt: "20px" }}
					>
						Please enter the code here.
					</Typography>
					<Box component="form" noValidate onSubmit={handleSubmit}>
						<TextField
							className="Round"
							fullWidth
							id="code"
							label="Code"
							name="code"
							type="number"
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
						onClick={stopRegister}
					>
						Cancel Registration
					</Button>
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
							navigate("/");
						}}
					>
						Go Back
					</Button>
				</Box>
			</Container>
		</>
	);
}
