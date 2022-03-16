import { Divider, Stack } from "@mui/material";
import React, { useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { RecipeCard } from "../recipeCard/RecipeCard";

interface RecipeGridProps {
	recipes: SimpleRecipe[];
}

function RecipeStack({ recipes }: RecipeGridProps) {
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

export default RecipeStack;
