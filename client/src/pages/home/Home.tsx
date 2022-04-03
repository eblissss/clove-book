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
import { getRandomRecipes } from "../../api/customRequests";
import { getRecipes } from "../../api/requests";
import { useAppSelector } from "../../app/hooks";
import { selectSearch } from "../../components/searchBar/searchSlice";

const fakeJSON: SimpleRecipe[] = [];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		spoonacularID: 0,
		cookbookID: "0",
		name: "Vegan Cheesecake",
		imageURL: "https://source.unsplash.com/random",
		totalTime: 10,
		tags: ["dessert", "grass"],
		savedAt: "March 4th",
	});
}

function Home() {
	const [searching, setSearching] = useState(false);
	const [recipes, setRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [popularRecipes, setPopularRecipes] =
		useState<SimpleRecipe[]>(fakeJSON);

	const searchInfo = useAppSelector(selectSearch);

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
	function search() {
		const searchVal = (
			document.getElementById("search") as HTMLInputElement
		).value;
		console.log(searchVal);

		if (searchVal === "") {
			setSearching(false);
			setRecipes(fakeJSON);
		} else {
			setSearching(true);
			const combinedTags = [
				...searchInfo.searchTags,
				...searchInfo.filters,
			];
			getRecipes(searchVal, combinedTags).then((stuff) =>
				setRecipes(stuff)
			);
		}
	}

	function ingredientSearch(ingredients: string[]) {
		console.log(ingredients);
	}

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
						searchFunc={search}
						paperProps={{ m: "20px", ml: "0", mb: "40px" }}
					/>
					{searching ? (
						<></>
					) : (
						<Typography variant="h2" component="h2">
							Explore New Recipes
						</Typography>
					)}
					<RecipeGrid recipes={recipes} columns={12} />
				</Container>
				<Container
					sx={{
						flex: "1",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<IngredientPanel searchFunc={ingredientSearch} />
					<Container
						disableGutters
						maxWidth={false}
						sx={{
							mt: "20px",
							p: "15px 28px",
							borderRadius: "15px",
							backgroundColor: "primary.main",
							maxWidth: "300px",
						}}
					>
						<Typography
							variant="h5"
							component="h5"
							sx={{ mb: "10px", textAlign: "center" }}
						>
							Featured Dishes
						</Typography>
						<RecipeStack recipes={popularRecipes} />
					</Container>
				</Container>
			</Container>
		</Box>
	);
}

export default Home;
