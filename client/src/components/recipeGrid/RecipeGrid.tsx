import { Divider, Grid, Stack } from "@mui/material";
import React, { useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { RecipeCard } from "../recipeCard/RecipeCard";
import Masonry from "@mui/lab/Masonry";

interface RecipeGridProps {
	recipes: SimpleRecipe[];
	columns?: number;
}

function RecipeGrid({ recipes, columns }: RecipeGridProps) {
	return (
		<Masonry
			columns={3}
			spacing={2}
			sx={{
				mt: "10px",
				justifyContent: "top",
			}}
		>
			{recipes?.map((recipe, i) => (
				<RecipeCard key={i} {...recipe} />
			))}
		</Masonry>

		// <Grid
		// 	container
		// 	spacing={3}
		// 	columns={columns}
		// 	sx={{
		// 		mt: "0px",
		// 		justifyContent: "center",
		// 	}}
		// >
		// 	{recipes?.map((recipe, i) => (
		// 		<Grid item key={i} xs={"auto"} md={6} lg={4}>
		// 			<RecipeCard {...recipe} />
		// 		</Grid>
		// 	))}
		// </Grid>
	);
}

export function RecipeStack({ recipes }: RecipeGridProps) {
	return (
		<Stack
			spacing={3}
			divider={<Divider orientation="horizontal" flexItem />}
		>
			{recipes.map((recipe, i) => (
				<RecipeCard {...recipe} key={i} />
			))}
		</Stack>
	);
}

export default RecipeGrid;
