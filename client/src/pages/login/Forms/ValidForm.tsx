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
import { doRegister } from "../../../api/requests";
import { NewUser } from "../../../api/models";

interface validProps {
	userInfo: NewUser;
}

export function ValidForm({ userInfo }: validProps) {
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
				navigate("/home");
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
						justifyContent: "center",
						px: "10%",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography variant="h5" align="center" gutterBottom>
						Register
					</Typography>
					<Typography variant="body2" align="center">
						A confirmation email has been sent to your inbox.
					</Typography>

					<Typography variant="body2" align="center">
						After confirming, you will be able to login.
					</Typography>
					<Typography
						variant="body1"
						align="center"
						sx={{ mt: "20px" }}
					>
						Please enter the code receieved.
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
