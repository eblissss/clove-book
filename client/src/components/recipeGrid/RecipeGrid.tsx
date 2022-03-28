import { Divider, Grid, Stack } from "@mui/material";
import React, { useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { RecipeCard } from "../recipeCard/RecipeCard";

interface RecipeGridProps {
	recipes: SimpleRecipe[];
	columns?: number;
}

function RecipeGrid({ recipes, columns }: RecipeGridProps) {
	return (
		<Grid
			container
			spacing={4}
			columns={columns}
			sx={{
				mt: "0px",
				justifyContent: "center",
			}}
		>
			{recipes?.map((recipe, i) => (
				<Grid item key={i} xs={"auto"} md={6} lg={4}>
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
