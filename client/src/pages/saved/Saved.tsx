import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { getFavorites, getUser } from "../../api/requests";
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
		cookbookID: "0",
		name: "Vegan Cheesecake",
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
			// getUser(userID).then((data) => {
			// 	getFavorites(data.username, searchText).then((recipes) => {
			// 		setFavRecipes(recipes);
			// 		setLoading(false);
			// 	});
			// });
		} else if (collection === "My Recipes") {
			// probably something like getUserRecipes(userID)
		}
	}, [collection, searchText]);

	function updateCollection(collection: string) {
		setCollection(collection);
	}

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
							getCollection={updateCollection}
							props={{ flex: "1" }}
						/>
						<SearchBar
							searchFunc={search}
							paperProps={{ flex: "2" }}
						/>
					</Container>
					<RecipeGrid recipes={fakeJSON} columns={16} />
				</Container>
			</Container>
		</Box>
	);
}

export default Saved;
