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

const fakeJSON: SimpleRecipe[] = [];
for (let i = 0; i < 12; i++) {
	fakeJSON.push({
		spoonacularID: 0,
		cookbookID: "624f4f2df4b2bf0444631525",
		name: "hello",
		imageURL: "https://source.unsplash.com/random",
		totalTime: 10,
		tags: ["dessert", "grass"],
		updatedAt: "March 4th",
		ingredients: [],
		authorID: "000000000000000000000000",
	});
}

function Saved() {
	const [favRecipes, setFavRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [loading, setLoading] = useState(true);

	const userID = useAppSelector(selectUser).userID;

	useEffect(() => {
		search();
	}, []);

	function search() {
		const searchVal = (
			document.getElementById("search") as HTMLInputElement
		).value;

		setLoading(true);
		getFavorites(userID, searchVal).then((recipes) => {
			setFavRecipes(recipes);
			setLoading(false);
		});
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
				<Container
					disableGutters
					sx={{ flex: "2", width: "140px", p: "0px 80px" }}
				>
					<Container
						disableGutters
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<SearchBar
							searchFunc={search}
							paperProps={{ flex: "2" }}
						/>
					</Container>
					{loading ? (
						<LinearProgress />
					) : (
						<RecipeGrid recipes={favRecipes} columns={4} />
					)}
				</Container>
			</Container>
		</Box>
	);
}

export default Saved;
