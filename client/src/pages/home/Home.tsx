import React, { useEffect, useState } from "react";

import { Box, Container, Typography } from "@mui/material";
import { TabBar } from "../../components/tabBar/TabBar";
import SearchBar from "../../components/searchBar/SearchBar";
import IngredientPanel from "../../components/ingredientPanel/IngredientPanel";
import { SimpleRecipe } from "../../api/models";
import RecipeGrid, {
	RecipeStack,
} from "../../components/recipeGrid/RecipeGrid";
import RecipeModal from "../../components/recipeModal/RecipeModal";

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
	const [searching, setSearching] = useState(false);
	const [recipes, setRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [popularRecipes, setPopularRecipes] =
		useState<SimpleRecipe[]>(fakeJSON);

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

	// should probably cap search to every 200ms or so

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<RecipeModal />
			<TabBar tab="home" />
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px",
					display: "flex",
					minHeight: "calc(100vh - 59px)",
				}}
			>
				<Container sx={{ flex: "2" }}>
					<Typography variant="h3" component="h3">
						What are you looking for?
					</Typography>
					<SearchBar
						paperProps={{ m: "20px", ml: "0", mb: "40px" }}
					/>
					{searching ? (
						// This will be the search results
						<RecipeGrid recipes={fakeJSON} />
					) : (
						<>
							<Typography variant="h2" component="h2">
								Explore New Recipes
							</Typography>
							<RecipeGrid recipes={fakeJSON} />
						</>
					)}
				</Container>
				<Container
					sx={{
						flex: "1",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<IngredientPanel />
					<Container
						disableGutters
						maxWidth={false}
						sx={{
							mt: "20px",
							p: "20px",
							borderRadius: "15px",
							backgroundColor: "primary.main",
							maxWidth: "300px",
						}}
					>
						<Typography
							variant="h4"
							component="h4"
							sx={{ my: "20px", textAlign: "center" }}
						>
							Popular Dishes
						</Typography>
						<RecipeStack recipes={fakeJSON} />
					</Container>
				</Container>
			</Container>
		</Box>
	);
}

export default Home;
