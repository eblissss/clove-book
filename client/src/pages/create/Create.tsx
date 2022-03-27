import {
	Box,
	Button,
	Container,
	List,
	TextField,
	Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import { TabBar } from "../../components/tabBar/TabBar";
import { Ingredient } from "../../api/models";
import IngredientList from "./IngredientList";
import StepList from "./StepsList";

function Create() {
	const saveRecipe = () => {};

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<TabBar tab="create" />
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px",
					minHeight: "calc(100vh - 59px)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "start",
					width: "auto",
					maxWidth: "70%",
				}}
			>
				<Typography component="h3" variant="h3">
					Create a New Recipe
				</Typography>
				{/* RECIPE NAME BOX */}
				<Box
					component="div"
					sx={{
						backgroundColor: "primary.main",
						p: "6px 10px",
						m: "20px",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						width: "100%",
						justifyContent: "space-around",
					}}
				>
					<Typography
						variant="h6"
						component="h6"
						fontWeight={700}
						sx={{ mr: "1rem", flex: 1 }}
					>
						Recipe Name:
					</Typography>
					<TextField
						id="recipeName"
						className="recipeInput"
						placeholder="lentils"
						sx={{ flex: 3 }}
					></TextField>
				</Box>
				{/* INGREDIENT LIST */}
				<IngredientList />
				{/* STEPS LIST */}
				<StepList />
				<Button
					fullWidth
					onClick={saveRecipe}
					className="Classic"
					sx={{ mt: "1rem" }}
				>
					Publish Recipe
				</Button>
			</Container>
		</Box>
	);
}

export default Create;
