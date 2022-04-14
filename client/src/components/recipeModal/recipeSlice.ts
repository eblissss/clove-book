import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../../api/models";
import { RootState } from "../../app/store";

export interface RecipeState {
	recipe: Recipe;
}

const initialState: RecipeState = {
	recipe: {
		cookbookID: "000000000000000000000000",
		spoonacularID: 0,
		ingredients: [
			{ name: "Spinach", amount: 1, unit: "cup" },
			{ name: "Grass", amount: 2, unit: "oz" },
			{ name: "Cheese", amount: 5, unit: "mb" },
		],
		instructions: [],
		name: "Chicken Paella",
		updatedAt: "5:04 PM, Friday 14th 2021",
		author: "jo",
		authorID: "1231",
		imageURL: "https://source.unsplash.com/random",
		totalTime: 15,
		tags: ["chicken", "mars", "vegan"],
		cookTime: 5,
		prepTime: 10,
		createdAt: "5:04 PM, Friday 14th 2021",
		nutrients: [],
	},
};

export const recipeSlice = createSlice({
	name: "recipe",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setRecipe: (state, action: PayloadAction<Recipe>) => {
			state.recipe = { ...action.payload };
		},
	},
});

export const { setRecipe } = recipeSlice.actions;
export const selectRecipe = (state: RootState) => state.recipe.recipe;

export default recipeSlice.reducer;
