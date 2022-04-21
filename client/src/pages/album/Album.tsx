import { Box, Container, LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { getUsersRecipes } from "../../api/requests";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RecipeGrid from "../../components/recipeGrid/RecipeGrid";
import {
	selectModal,
	setDeleted,
} from "../../components/recipeModal/modalSlice";
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
	const dispatch = useAppDispatch();

	const [myRecipes, setMyRecipes] = useState<SimpleRecipe[]>(fakeJSON);
	const [loading, setLoading] = useState(true);

	const userID = useAppSelector(selectUser).userID;
	const didDelete = useAppSelector(selectModal).deleted;

	useEffect(() => {
		if (userID !== "0") {
			search();
		}
	}, [userID]);

	useEffect(() => {
		if (didDelete) {
			setTimeout(search, 100);
			dispatch(setDeleted(false));
		}
	}, [didDelete]);

	function search() {
		setLoading(true);
		getUsersRecipes(userID).then((recipes) => {
			setMyRecipes(recipes);
			setLoading(false);
		});
	}

	return (
		<Box
			component="div"
			sx={{
				backgroundColor: "primary.main",
			}}
		>
			<RecipeModal />
			<TabBar tab="album" />
			<Container
				id="BACKGROUND"
				sx={{
					p: "30px 30px",
					display: "flex",
					minHeight: "calc(100vh - 59px)",
				}}
			>
				<Container
					disableGutters
					sx={{ flex: "2", width: "140px", p: "0px 80px" }}
				>
					{loading ? (
						<LinearProgress />
					) : (
						<RecipeGrid
							recipes={myRecipes}
							columns={Math.min(myRecipes.length, 4)}
						/>
					)}
				</Container>
			</Container>
		</Box>
	);
}

export default Saved;
