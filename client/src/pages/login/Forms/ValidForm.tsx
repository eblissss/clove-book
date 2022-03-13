import React from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export function ValidForm() {
	const navigate = useNavigate();

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
					<Typography
						variant="h5"
						align="center"
						sx={{ width: "80%" }}
					>
						Register
					</Typography>
					<Typography
						variant="body2"
						align="center"
						sx={{ width: "80%", m: "10px" }}
					>
						A confirmation email has been sent to your inbox.
					</Typography>
					<Typography
						variant="body2"
						align="center"
						sx={{ width: "80%", mb: "10px" }}
					>
						After confirming, you will be able to login.
					</Typography>
					<Button
						variant="contained"
						type="button"
						sx={{
							width: "80%",
							borderRadius: "100px",
							mt: "0px",
							mb: "20px",
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
