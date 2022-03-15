import { Box, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React from "react";

interface PanelProps {
	boxProps?: any;
}

function IngredientPanel(props: PanelProps) {
	return (
		<Box
			component="div"
			sx={{
				width: "30%",
				backgroundColor: "primary.main",
				borderRadius: "15px",
				textAlign: "center",
				p: "20px",
				...props.boxProps,
			}}
		>
			<Typography
				gutterBottom
				variant="h5"
				component="h3"
				sx={{
					color: "primary.contrastText",
					py: "10px",
				}}
			>
				Tell us what you have
			</Typography>
			<TextField
				multiline
				minRows={12}
				placeholder="lentils"
				variant="filled"
				sx={{
					"& .MuiInputBase-input": {
						position: "relative",
						border: "1px solid primary.light",
						fontSize: 16,
						padding: "10px 12px",
						backgroundColor: "primary.dark",
						borderRadius: "15px",
						display: "inline-block",
						fontFamily: ["Sen"],
						"&:hover": {
							borderColor: "primary.main",
						},
						"&:focus": {
							borderColor: "primary.main",
						},
					},
				}}
			></TextField>
		</Box>
	);
}

export default IngredientPanel;
