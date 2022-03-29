import React from "react";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import BgImage from "../../assets/landing-bg.png";
import cloveImg from "../../assets/cloveB.png";

export default function Landing() {
	const theme = useTheme();

	return (
		<Box
			component="div"
			sx={{
				background: `linear-gradient(90deg,	rgba(163, 187, 198, 0.9) 0%, rgba(163, 187, 198, 0) 42.56%), url(${BgImage}) no-repeat center center fixed`,
				backgroundSize: "cover",
				width: "100%",
				height: "100vh",
			}}
		>
			<Container
				disableGutters
				sx={{
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					align: "center",
					left: "16%",
					top: "10%",
					width: "50vw",
				}}
			>
				<img src={cloveImg} width="100%" />
				<Box
					component="div"
					sx={{
						background: `linear-gradient(0deg, ${theme.palette.secondary.main} 50%, #00000000 100%)`,
						borderRadius: "0px 0px 25px 25px",
						alignSelf: "flex-start",
						width: "100%",
						textAlign: "center",
						px: "3rem",
						py: "1rem",
						mt: "1rem",
					}}
				>
					<Typography
						component="h2"
						variant="h2"
						sx={{
							color: "secondary.contrastText",
						}}
					>
						Dish It Out
					</Typography>
				</Box>
				<Button
					className="Submit"
					component={RouterLink}
					to="/login"
					sx={{
						alignSelf: "flex-start",
						width: "100%",
						p: "2rem",
						mt: "8rem",
					}}
				>
					<Typography
						component="h3"
						variant="h3"
						sx={{
							color: "secondary.contrastText",
						}}
					>
						Find Recipes
					</Typography>
				</Button>
			</Container>

			<Typography
				component="h4"
				variant="h4"
				sx={{
					position: "fixed",
					right: "20px",
					bottom: "20px",
					fontFamily: "Prociono",
					color: "secondary.contrastText",
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
						left: "190px",
						m: "0.7rem",
						p: "0.7rem",
						backgroundColor: "secondary.main",
						border: "none",
						borderRadius: "16px",
						"&:hover": {
							backgroundColor: "secondary.dark",
						},
					}}
				>
					<Typography
						component="h4"
						variant="h4"
						sx={{
							color: "secondary.contrastText",
						}}
					>
						Sign In
					</Typography>
				</Button>
			</Box>
		</Box>
	);
}
