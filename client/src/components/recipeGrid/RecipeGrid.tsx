import { Divider, Stack } from "@mui/material";
import React from "react";
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
			columns={columns}
			spacing={3}
			sx={{
				mt: "10px",
				justifyContent: "top",
			}}
		>
			{recipes?.map((recipe, i) => (
				<RecipeCard key={i} {...recipe} />
			))}
		</Masonry>
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
