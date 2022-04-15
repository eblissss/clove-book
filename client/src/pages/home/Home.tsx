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
import {
	getPopularRecipes,
	getRecipes,
	searchRecipesIngredients,
} from "../../api/requests";
import { useAppSelector } from "../../app/hooks";
import { selectSearch } from "../../components/searchBar/searchSlice";

const fakeJSON: SimpleRecipe[] = [];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		spoonacularID: 0,
		cookbookID: "000000000000000000000000",
		name: "Vegan Cheesecake",
		imageURL: "https://picsum.photos/200",
		totalTime: 10,
		tags: ["dessert", "grass"],
		updatedAt: "March 4th",
		ingredients: [],
		authorID: "000000000000000000000000",
	});
}

function Home() {
	const [searching, setSearching] = useState(false);
	const [recipes, setRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [popularRecipes, setPopularRecipes] =
		useState<SimpleRecipe[]>(fakeJSON);

	const searchInfo = useAppSelector(selectSearch);

	// TODO replace [] with combined tags
	useEffect(() => {
		getRecipes("", []).then((stuff) => setRecipes(stuff));
		getPopularRecipes().then((data) => setPopularRecipes(data));
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
			getRecipes(searchVal, combinedTags).then((stuff) => {
				console.log(searchInfo.sort);
				if (searchInfo.sort === "alpha") {
					stuff.sort((a, b) => (a.name > b.name ? 1 : -1));
				}
				if (searchInfo.sort === "newest") {
					stuff.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
				}

				setRecipes(stuff);
			});
		}
	}

	function ingredientSearch(ingredients: string[]) {
		setSearching(true);
		const searchVal = (
			document.getElementById("search") as HTMLInputElement
		).value;
		const combinedTags = [...searchInfo.searchTags, ...searchInfo.filters];
		const ingredientSet = new Set(ingredients);
		searchRecipesIngredients(searchVal, combinedTags, ingredients).then(
			(stuff) => {
				stuff.sort((a: SimpleRecipe, b: SimpleRecipe) => {
					let aCount = 0,
						bCount = 0;
					a.ingredients.forEach((ing) => {
						if (ingredientSet.has(ing.name)) aCount++;
					});
					b.ingredients.forEach((ing) => {
						if (ingredientSet.has(ing.name)) bCount++;
					});
					return bCount - aCount;
				});
				setRecipes(stuff);
			}
		);
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
					<Typography
						variant="h3"
						component="h3"
						sx={{ fontFamily: ["serif", "Libre Baskerville"] }}
					>
						What are you looking for?
					</Typography>
					<SearchBar
						searchFunc={search}
						paperProps={{ m: "20px", ml: "0", mb: "40px" }}
					/>
					{searching ? (
						<></>
					) : (
						<Typography
							variant="h3"
							component="h3"
							sx={{ fontFamily: ["serif", "Libre Baskerville"] }}
						>
							Explore New Recipes
						</Typography>
					)}
					<RecipeGrid recipes={recipes} columns={3} />
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
							pb: "28px",
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
						<RecipeStack recipes={popularRecipes} columns={0} />
					</Container>
				</Container>
			</Container>
		</Box>
	);
}

export default Home;
