import { Divider, Grid, Stack } from "@mui/material";
import React, { useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { RecipeCard } from "../recipeCard/RecipeCard";

interface RecipeGridProps {
	recipes: SimpleRecipe[];
}

function RecipeGrid({ recipes }: RecipeGridProps) {
	return (
		<Grid
			container
			spacing={4}
			sx={{
				mt: "0px",
			}}
		>
			{recipes?.map((recipe, i) => (
				<Grid item key={i}>
					<RecipeCard {...recipe} />
				</Grid>
			))}
		</Grid>
	);
}

export function RecipeStack({ recipes }: RecipeGridProps) {
	return (
		<Stack
			spacing={4}
			divider={<Divider orientation="horizontal" flexItem />}
		>
			{recipes.map((recipe, i) => (
				<RecipeCard {...recipe} key={i} />
			))}
		</Stack>
	);
}

export default RecipeGrid;
