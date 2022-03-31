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
import { Ingredient, Recipe, RecipeNutrients } from "../../api/models";
import IngredientList from "./IngredientList";
import StepList from "./StepsList";
import NutritionList from "./NutritionList";
import { getUser } from "../../api/requests";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../user/userSlice";
import { store } from "../../app/store";

function Create() {
	const user = useAppSelector(selectUser);

	const saveRecipe = () => {
		const authorID = user.userID;

		let author = "";
		getUser(user.userID).then((data) => {
			author = data.username;
		});

		// Get stuff from inputs
		const name = (document.getElementById("recipeName") as HTMLInputElement)
			.value;
		const imageURL = (
			document.getElementById("recipeImage") as HTMLInputElement
		).value;

		const prepTime = parseInt(
			(document.getElementById("recipePrepTime") as HTMLInputElement)
				.value
		);
		const cookTime = parseInt(
			(document.getElementById("recipeCookTime") as HTMLInputElement)
				.value
		);
		const totalTime = prepTime + cookTime;

		// GET TAGS
		const tags: string[] = [];

		const createdAt = new Date().toISOString();

		const creationStuff = store.getState().creation;
		const ingredients = creationStuff.ingredients;
		const instructions = creationStuff.instructions;
		const nutrients = creationStuff.nutrients;

		const nutrition: RecipeNutrients = {
			good: [],
			bad: [],
		};
		nutrients.forEach((nutrient) => {
			switch (nutrient.name) {
				case "Calories":
				case "Fat":
				case "Saturated Fat":
				case "Carbohydrates":
				case "Sugar":
				case "Cholestorol":
				case "Sodium":
					nutrition.bad.push(nutrient);
					break;
				case "Protein":
				case "Fiber":
					nutrition.good.push(nutrient);
					break;
				default:
					break;
			}
		});

		const data: Recipe = {
			author: author,
			authorID: authorID,
			cookTime: cookTime,
			cookbookID: 0,
			createdAt: createdAt,
			ingredients: ingredients,
			instructions: instructions,
			name: name,
			prepTime: prepTime,
			savedAt: createdAt,
			spoonacularID: 0,
			totalTime: totalTime,
			imageURL: imageURL,
			readyInMinutes: totalTime,
			tags: tags,
		};
	};

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
				maxWidth="md"
				sx={{
					p: "30px",
					minHeight: "calc(100vh - 59px)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "start",
					width: "auto",
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
				{/* IMAGE URL BOX */}
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
						Image URL:
					</Typography>
					<TextField
						id="recipeImage"
						className="recipeInput"
						placeholder="https://..."
						sx={{ flex: 3 }}
					></TextField>
				</Box>
				{/* TIME BOX */}
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
						justifyContent: "flex-start",
					}}
				>
					<Container
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Prep Time:
						</Typography>
						<TextField
							id="recipePrepTime"
							className="recipeInput"
							placeholder="20m"
							sx={{ width: "10rem" }}
						></TextField>
					</Container>
					<Container sx={{ display: "flex", alignItems: "center" }}>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
						>
							Cook Time:
						</Typography>
						<TextField
							id="recipeCookTime"
							className="recipeInput"
							placeholder="10m"
							sx={{ width: "10rem" }}
						></TextField>
					</Container>
				</Box>
				{/* INGREDIENT LIST */}
				<IngredientList />
				{/* STEPS LIST */}
				<StepList />
				{/* NUTRITION LIST */}
				<NutritionList />
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
