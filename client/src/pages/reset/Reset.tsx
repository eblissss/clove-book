import {
	Box,
	Button,
	CardMedia,
	Container,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useEffect } from "react";
import { doResetPassword } from "../../api/requests";
import md5 from "md5";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import cloveImg from "../../assets/cloveB.png";

let email = "";
let code = "";

function Reset() {
	const navigate = useNavigate();

	useEffect(() => {
		// get info from url
		const url = new URL(window.location.href);
		if (url.searchParams.has("email")) {
			email = url.searchParams.get("email")!;
		} else {
			navigate("/");
		}
		if (url.searchParams.has("code")) {
			code = url.searchParams.get("code")!;
		} else {
			navigate("/");
		}
	}, []);

	const resetPassword = () => {
		const passA = md5(
			(document.getElementById("newPassword1") as HTMLInputElement).value
		);
		const passB = md5(
			(document.getElementById("newPassword2") as HTMLInputElement).value
		);

		if (passA !== passB) {
			return;
		}

		doResetPassword(code, email, passA).then(() => {
			navigate("/");
		});
	};

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<Button
				component={RouterLink}
				to="/"
				sx={{
					alignSelf: "left",
					maxHeight: "59px",
				}}
			>
				<CardMedia
					image={cloveImg}
					sx={{ height: "59px", width: "135px", mt: "10px" }}
				/>
			</Button>
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px",
					minHeight: "calc(100vh - 59px)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "start",
				}}
			>
				<Container
					disableGutters
					maxWidth="xs"
					sx={{
						display: "inline-flex",
						flexDirection: "column",
					}}
				>
					<Typography
						component="h3"
						variant="h3"
						sx={{
							textAlign: "center",
							// fontFamily: ["serif", "Libre Baskerville"],
						}}
					>
						Reset Password
					</Typography>

					<Box
						component="div"
						sx={{
							display: "inline-flex",
							flexWrap: "wrap",
							backgroundColor: "primary.dark",
							p: "6px",
							m: "20px",
							borderRadius: "8px",
							boxShadow:
								"rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
						}}
					>
						<TextField
							className="Round"
							margin="dense"
							id="newPassword1"
							label="New Password"
							type="password"
							fullWidth
						/>
						<TextField
							className="Round"
							margin="dense"
							id="newPassword2"
							label="Repeat New Password"
							type="password"
							fullWidth
						/>
					</Box>
					<Container
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Button
							className="Submit"
							sx={{
								m: "20px",
								p: "10px 20px",
							}}
							onClick={resetPassword}
						>
							Reset Password
						</Button>
						<IconButton
							sx={{
								m: "20px",
								backgroundColor: "primary.main",
								color: "primary.dark",
								"&:hover": {
									color: "primary.dark",
								},
							}}
							onClick={() => {
								navigate("/");
							}}
						>
							<CloseIcon />
						</IconButton>
					</Container>
				</Container>
			</Container>
		</Box>
	);
}

export default Reset;
