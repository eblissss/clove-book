import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { SimpleRecipe } from "../../api/models";
import RecipeGrid from "../../components/recipeGrid/RecipeGrid";
import RecipeModal from "../../components/recipeModal/RecipeModal";
import SearchBar from "../../components/searchBar/SearchBar";

import { TabBar } from "../../components/tabBar/TabBar";
import MenuSelector from "./menuSelector";

const fakeJSON: SimpleRecipe[] = [];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		spoonacularID: 0,
		cookbookID: 0,
		name: "Vegan Cheesecake",
		imageURL: "https://source.unsplash.com/random",
		readyInMinutes: 10,
		tags: ["dessert", "grass"],
		savedAt: "March 4th",
	});
}

function Saved() {
	const [collection, setCollection] = useState("My Recipes");

	function updateCollection(collection: string) {
		setCollection(collection);
		console.log(collection);
	}

	function search() {
		const searchVal = (
			document.getElementById("search") as HTMLInputElement
		).value;

		console.log(searchVal);
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
					<RecipeGrid recipes={fakeJSON} />
				</Container>
			</Container>
		</Box>
	);
}

export default Saved;
