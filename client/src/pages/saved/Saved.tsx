import { Box, Container, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { getFavorites } from "../../api/requests";
import { useAppSelector } from "../../app/hooks";
import RecipeGrid from "../../components/recipeGrid/RecipeGrid";
import RecipeModal from "../../components/recipeModal/RecipeModal";
import SearchBar from "../../components/searchBar/SearchBar";

import { TabBar } from "../../components/tabBar/TabBar";
import { selectUser } from "../user/userSlice";
import MenuSelector from "./menuSelector";

const fakeJSON: SimpleRecipe[] = [];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		spoonacularID: 0,
		cookbookID: "624f4f2df4b2bf0444631525",
		name: "hello",
		imageURL: "https://source.unsplash.com/random",
		totalTime: 10,
		tags: ["dessert", "grass"],
		savedAt: "March 4th",
	});
}

function Saved() {
	const [collection, setCollection] = useState("Favorites");
	const [favRecipes, setFavRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [myRecipes, setMyRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [searchText, setSearchText] = useState("");
	const [loading, setLoading] = useState(true);

	const userID = useAppSelector(selectUser).userID;

	useEffect(() => {
		if (collection === "Favorites") {
			setLoading(true);
			getFavorites(userID, searchText).then((recipes) => {
				setFavRecipes(recipes);
				setLoading(false);
			});
		} else if (collection === "My Recipes") {
			// probably something like getUserRecipes(userID)
		}
	}, [collection, searchText]);

	function search() {
		const searchVal = (
			document.getElementById("search") as HTMLInputElement
		).value;
		setSearchText(searchVal);
	}

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.light",
			}}
		>
			<RecipeModal />
			<TabBar tab="saved" />
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px",
					display: "flex",
					minHeight: "calc(100vh - 59px)",
				}}
			>
				<Container sx={{ flex: "2" }}>
					<Container
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<MenuSelector
							getCollection={setCollection}
							props={{ flex: "1" }}
						/>
						<SearchBar
							searchFunc={search}
							paperProps={{ flex: "2" }}
						/>
					</Container>
					{console.log(collection)}
					{loading ? (
						<LinearProgress />
					) : (
						<RecipeGrid
							recipes={
								collection === "Favorites"
									? favRecipes
									: myRecipes
							}
							columns={4}
						/>
					)}
				</Container>
			</Container>
		</Box>
	);
}

export default Saved;
