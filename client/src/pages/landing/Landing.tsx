import React from "react";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

import cloveImg from "../../assets/clove_lightbg.svg";

import BgImage from "../../assets/clove3d.png";
export default function Landing() {
	const theme = useTheme();

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
				backgroundSize: "cover",
				width: "100%",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			{/* THIS IS THE SPINNING IMAGE */}
			<Box
				component="div"
				sx={{
					position: "absolute",
					right: 0,
					bottom: 0,
					overflow: "hidden",
					width: "100%",
					height: "100%",
				}}
			>
				<Box
					component="div"
					sx={{
						position: "absolute",
						animation: "spin infinite 200s linear",
						"@keyframes spin": {
							"0%": {
								transform: "rotate(0deg)",
							},
							"100%": {
								transform: "rotate(360deg)",
							},
						},
					}}
				>
					<img src={BgImage}></img>
				</Box>
			</Box>

			<Container
				disableGutters
				sx={{
					//backgroundColor: "#64ab42",
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					align: "center",
					alignSelf: "center",
					textAlign: "center",
					top: "5%",
					width: "100%",
				}}
			>
				<img src={cloveImg} width="100%" />
				<Box
					component="div"
					sx={{
						//background: `linear-gradient(0deg, ${theme.palette.secondary.main} 50%, #00000000 100%)`,
						borderRadius: "0px 0px 25px 25px",
						alignSelf: "center",
						width: "70%",
						textAlign: "center",
						align: "center",
						px: "3rem",
						py: "0.25rem",
						//mt: "1rem",
					}}
				>
					<Typography
						component="h2"
						variant="h2"
						sx={{
							color: "primary.dark",
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
						width: "70%",
						textAlign: "center",
						align: "center",
						p: "2rem",
						mt: "10%",
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
						"linear-gradient(270deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 50%)",
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
