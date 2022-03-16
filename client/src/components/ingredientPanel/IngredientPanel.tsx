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
				backgroundColor: "primary.main",
				borderRadius: "15px",
				textAlign: "center",
				p: "20px",
				maxWidth: "300px",
				...props.boxProps,
			}}
		>
			<Typography
				variant="h5"
				component="h3"
				sx={{
					pb: "10px",
				}}
			>
				Tell us what you have
			</Typography>
			<TextField
				multiline
				minRows={12}
				placeholder="lentils"
				variant="filled"
			></TextField>
		</Box>
	);
}

export default IngredientPanel;
