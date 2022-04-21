import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

interface PanelProps {
	searchFunc: any;
	boxProps?: any;
}

function IngredientPanel({ searchFunc, boxProps }: PanelProps) {
	const useFunc: React.MouseEventHandler<HTMLButtonElement> = () => {
		const text = (
			document.getElementById("ingredientField") as HTMLInputElement
		).value;
		// split on newline (both unix and windows)
		const ingredients = text.split(/\r?\n/);

		searchFunc(ingredients);
	};

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
				borderRadius: "15px",
				textAlign: "center",
				p: "15px 28px",
				maxWidth: "300px",
				...boxProps,
			}}
		>
			<Typography
				variant="h5"
				component="h3"
				sx={{
					pb: "10px",
					whiteSpace: "break-spaces",
				}}
			>
				Search by {"\n"}ingredients
			</Typography>
			<TextField
				multiline
				minRows={12}
				id="ingredientField"
				placeholder="one ingredient per line"
				variant="filled"
			></TextField>
			<Button
				fullWidth
				onClick={useFunc}
				className="Classic"
				sx={{
					mt: "1rem",
				}}
			>
				Find Dishes
			</Button>
		</Box>
	);
}

export default IngredientPanel;
