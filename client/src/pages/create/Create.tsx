import {
	Box,
	Button,
	Container,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";

import React, { useEffect, useState } from "react";

import { TabBar } from "../../components/tabBar/TabBar";
import { Recipe, RecipeNutrients } from "../../api/models";
import IngredientList from "./IngredientList";
import StepList from "./StepsList";
import NutritionList from "./NutritionList";
import { addRecipe, getUser, updateRecipe } from "../../api/requests";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../user/userSlice";
import { store } from "../../app/store";
import CreateSuccess from "./CreateSuccess";
import { useDispatch } from "react-redux";
import {
	selectCreationUpdate,
	setCreationEditing,
} from "./creationUpdateSlice";
import {
	defaultNutri,
	setIngredients,
	setInstructions,
	setNutrients,
	setRecipeTags,
} from "./creationSlice";
import TagsInput from "./TagsInput";
import { selectRecipe } from "../../components/recipeModal/recipeSlice";

function Create() {
	const dispatch = useDispatch();

	const user = useAppSelector(selectUser);
	const editing = useAppSelector(selectCreationUpdate).editing;
	const recipeInfo = useAppSelector(selectRecipe);

	useEffect(() => {
		if (editing) {
			fillText();
		}
	}, []);

	const [openSuccess, setOpenSuccess] = useState(false);

	const saveRecipe = () => {
		const authorID = user.userID;

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

		const createdAt = new Date().toISOString();

		const creationStuff = store.getState().creation;
		const ingredients = creationStuff.ingredients;
		const instructions = creationStuff.instructions;
		const nutrients = creationStuff.nutrients;
		const tags = creationStuff.tags;

		const nutrition: RecipeNutrients = {
			good: [],
			bad: [],
		};
		nutrients.forEach((nutrient) => {
			switch (nutrient.name) {
				case "Calories":
				case "Fat":
					nutrition.bad.push(nutrient);
					break;
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

		getUser(user.userID).then((res) => {
			const author = res.username;

			const data: Recipe = {
				author: author,
				authorID: authorID,
				cookTime: cookTime,
				cookbookID: recipeInfo.cookbookID,
				updatedAt: createdAt,
				ingredients: ingredients,
				instructions: instructions,
				name: name,
				prepTime: prepTime,
				createdAt: createdAt,
				spoonacularID: 0,
				totalTime: totalTime,
				imageURL: imageURL,
				tags: tags,
				nutrients: nutrition,
			};
			console.log(data);

			if (!editing) {
				addRecipe(data).then(() => {
					setOpenSuccess(true);
					resetText();
				});
			} else {
				updateRecipe(editing, data).then(() => {
					setOpenSuccess(true);
					resetText();
					dispatch(setCreationEditing(""));
				});
			}
		});
	};

	const fillText = () => {
		console.log(recipeInfo);
		// TOP STUFF
		(document.getElementById("recipeName") as HTMLInputElement).value =
			recipeInfo.name;
		(document.getElementById("recipeImage") as HTMLInputElement).value =
			"" + recipeInfo.imageURL;
		(document.getElementById("recipePrepTime") as HTMLInputElement).value =
			"" + recipeInfo.prepTime;
		(document.getElementById("recipeCookTime") as HTMLInputElement).value =
			"" + recipeInfo.cookTime;

		// LISTS
		dispatch(
			setIngredients(recipeInfo.ingredients ? recipeInfo.ingredients : [])
		);
		dispatch(
			setInstructions(
				recipeInfo.instructions ? recipeInfo.instructions : []
			)
		);
		dispatch(
			setNutrients(
				recipeInfo.nutrients
					? recipeInfo.nutrients.good.concat(recipeInfo.nutrients.bad)
					: defaultNutri
			)
		);
		dispatch(setRecipeTags(recipeInfo.tags!));
	};

	const resetText = () => {
		(document.getElementById("recipeName") as HTMLInputElement).value = "";
		(document.getElementById("recipeImage") as HTMLInputElement).value = "";
		(document.getElementById("recipePrepTime") as HTMLInputElement).value =
			"";
		(document.getElementById("recipeCookTime") as HTMLInputElement).value =
			"";

		// LISTS
		dispatch(setIngredients([]));
		dispatch(setInstructions([]));
		dispatch(setNutrients(defaultNutri));
		dispatch(setRecipeTags([]));
	};

	const cancelEditing = () => {
		resetText();
		dispatch(setCreationEditing(""));
	};

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			{openSuccess ? <CreateSuccess /> : <></>}
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
				{!editing ? (
					<Typography component="h3" variant="h3">
						Create a New Recipe
					</Typography>
				) : (
					<Typography component="h3" variant="h3">
						Editing a Recipe
						<IconButton onClick={cancelEditing}>
							<CancelIcon />
						</IconButton>
					</Typography>
				)}
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
						sx={{ mr: "1rem", width: "auto", textAlign: "right" }}
					>
						Recipe Name:
					</Typography>
					<TextField
						autoFocus
						fullWidth
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
						sx={{ mr: "1rem", width: "auto", textAlign: "right" }}
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
						disableGutters
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
							sx={{ mr: "5px", textAlign: "right" }}
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
					<Container
						disableGutters
						sx={{ display: "flex", alignItems: "center" }}
					>
						<Typography
							variant="h6"
							component="h6"
							fontWeight={700}
							sx={{ mr: "5px" }}
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

				{/* TAGS BOX */}
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
						Tags:
					</Typography>
					<TagsInput />
				</Box>

				<Button
					fullWidth
					id="createSubmit"
					type="button"
					onClick={saveRecipe}
					className="Classic"
					sx={{ mt: "1rem" }}
				>
					{!editing ? "Publish Recipe" : "Update Recipe"}
				</Button>
			</Container>
		</Box>
	);
}

export default Create;
