import { Box, Button, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import BgImage from "../../assets/landing-bg.jpg";

export default function Landing() {
	return (
		<Box
			component="div"
			sx={{
				background: `linear-gradient(90deg,	rgba(163, 187, 198, 0.9) 0%, rgba(163, 187, 198, 0) 42.56%), url(${BgImage}) no-repeat center center fixed`,
				backgroundSize: "cover",
				color: "white",
				position: "absolute",
				top: 0,
				width: "100vw",
				height: "100vh",
			}}
		>
			<Typography
				component="h1"
				variant="h1"
				sx={{
					position: "absolute",
					width: "700px",
					height: "130px",
					left: "10%",
					top: "10%",
					fontFamily: ["serif", "Prociono"],
				}}
			>
				Cook Book
			</Typography>
			<Box
				component="div"
				sx={{
					position: "absolute",
					width: "440px",
					height: "100px",
					left: "10%",
					top: "30%",
					background: `linear-gradient(0deg, ${green[300]} 50%, #00000000 100%)`,
					borderRadius: "0px 0px 25px 25px",
					fontFamily: ["serif", "Prociono"],
					fontSize: "50px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				Make Food
			</Box>
			<Button
				component={RouterLink}
				to="/example"
				sx={{
					position: "absolute",
					width: "40%",
					minWidth: "260px",
					height: "3em",
					textAlign: "center",
					left: "10%",
					top: "60%",
					lineHeight: "100%",
					backgroundColor: "secondary.dark",
					opacity: "0.7",
					border: "7px solid #ffffff",
					boxSizing: "border-box",
					borderRadius: "32px",
					color: "secondary.contrastText",
					fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
					fontWeight: "500",
					fontSize: "200%",
					transition: "opacity 400ms ease",
					"&:hover": {
						backgroundColor: "secondary.dark",
						opacity: "0.9",
					},
				}}
			>
				Find Recipes
			</Button>
			<Typography
				component="h4"
				variant="h4"
				sx={{
					position: "fixed",
					width: "300px",
					height: "40px",
					right: "20px",
					bottom: "20px",
					fontFamily: "Prociono",
				}}
			>
				(c) 2022 PoopGroup
			</Typography>
			<Box
				component="div"
				sx={{
					position: "fixed",
					width: "380px",
					height: "87px",
					right: "0px",
					top: "0px",
					background:
						"linear-gradient(270deg, rgba(163, 187, 198, 0.6) 0%, rgba(163, 187, 198, 0) 50%)",
				}}
			>
				<Button
					component={RouterLink}
					to="/login"
					sx={{
						position: "absolute",
						width: "176px",
						height: "57px",
						right: "14px",
						top: "14px",
						backgroundColor: "secondary.main",
						border: "none",
						borderRadius: "16px",
						color: "secondary.contrastText",
						fontFamily: "Overlock",
						fontSize: "32px",
						"&:hover": {
							backgroundColor: "secondary.dark",
						},
					}}
				>
					Sign In
				</Button>
			</Box>
		</Box>
	);
}
