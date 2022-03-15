import React, { useEffect, useState } from "react";

import { Box, Container, Grid, Typography } from "@mui/material";
import { TabBar } from "../../components/tabBar/TabBar";
import { RecipeCard } from "../../components/recipeCard/RecipeCard";
import SearchBar from "../../components/searchBar/SearchBar";
import IngredientPanel from "../../components/ingredientPanel/IngredientPanel";

import { Recipe } from "../../api/requests";
import { SimpleRecipe } from "../../api/models";

const fakeJSON: SimpleRecipe[] = [];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		sID: 0,
		cbID: 0,
		name: "Vegan Cheesecake",
		imageURL: "https://source.unsplash.com/random",
		readyInMinutes: 10,
		tags: ["dessert", "grass"],
		savedAt: "March 4th",
	});
}

function Home() {
	const [recipes, setRecipes] = useState<SimpleRecipe[]>(fakeJSON);

	useEffect(() => {
		/*
		Recipe.getRandoms()
			.then((data) => {
				setRecipes(data);
			})
			.catch((err) => {
				console.log(err);
			})
		return () => {};
		*/
	}, []);

	return (
		<>
			<TabBar tab="home" />
			<Box
				id="BACKGROUND"
				component="div"
				sx={{
					position: "absolute",
					minHeight: "calc(100vh - 59px)",
					width: "100vw",
					top: "59px",
					backgroundColor: "primary.light",
					p: "30px",
				}}
			>
				<Typography
					variant="h2"
					component="h2"
					sx={{
						color: "primary.contrastText",
						m: "20px",
						fontFamily: ["Sen"],
					}}
				>
					What are you looking for?
				</Typography>
				<SearchBar paperProps={{ m: "20px", width: "50%" }} />

				<Typography
					variant="h2"
					component="h2"
					sx={{
						color: "primary.contrastText",
						m: "20px",
						mt: "40px",
						fontFamily: ["Sen"],
					}}
				>
					Explore New Recipes
				</Typography>
				<Container sx={{ py: 4, float: "left" }} maxWidth="sm">
					<Grid container spacing={4}>
						{fakeJSON.map((recipe, i) => (
							<Grid item key={i} xs={12} sm={8} md={6}>
								<RecipeCard
									{...recipe}
									// boxProps={{ ml: `${50 * i}px`, mt: "50px" }}
								/>
							</Grid>
						))}
					</Grid>
				</Container>
				<Container
					sx={{
						py: 4,
						float: "right",
						width: "300px",
						position: "relative",
						bottom: "280px",
						right: "50px",
					}}
				>
					<IngredientPanel boxProps={{ width: "300px" }} />
				</Container>
			</Box>
		</>
	);
}

export default Home;
