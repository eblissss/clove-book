import { Box, Divider, Stack } from "@mui/material";
import React, { useState } from "react";
import { SimpleRecipe } from "../../api/models";
import { RecipeCard } from "../recipeCard/RecipeCard";
import Masonry from "@mui/lab/Masonry";

interface RecipeGridProps {
	recipes: SimpleRecipe[];
	columns: number;
}

function RecipeGrid({ recipes, columns }: RecipeGridProps) {
	// const [columnsReal, setColumns] = useState(3);

	// resizes but laggy
	// function updateColumns() {
	// 	const newCols = window.innerWidth / 500;
	// 	setColumns(columns + newCols);
	// }

	// window.onresize = updateColumns;

	return (
		<Box component="div" sx={{ marginRight: "-1.35em" }}>
			<Masonry
				columns={columns}
				spacing={3}
				sx={{
					mt: "10px",
					justifyContent: "flex-start",
					alignItems: "top",
					overflow: "hidden",
				}}
			>
				{recipes?.map((recipe, i) => (
					<RecipeCard key={i} {...recipe} />
				))}
			</Masonry>
		</Box>
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
