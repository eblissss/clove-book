import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

import { Ingredient, Instruction, Nutrient } from "../../api/models";

const defaultNutritions: string[] = ["Sugar", "Protein", "Sodium", "Calories"];

const allNutrients = [
	"Calories",
	"Fat",
	"Saturated Fat",
	"Carbohydrates",
	"Sugar",
	"Cholestorol",
	"Sodium",
	"Protein",
	"Fiber",
];

const defaultNutri: Nutrient[] = allNutrients.map((name) => ({
	name: name,
	amount: "",
	indented: defaultNutritions.includes(name),
	percentOfDailyNeeds: 0,
}));

interface Creation {
	ingredients: Ingredient[];
	instructions: Instruction[];
	nutrients: Nutrient[];
	tags: string[];
}

const initialState: Creation = {
	ingredients: [],
	instructions: [],
	nutrients: defaultNutri,
	tags: [],
};

export const creationSlice = createSlice({
	name: "creation",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
			state.ingredients = [...action.payload];
		},
		setInstructions: (state, action: PayloadAction<Instruction[]>) => {
			state.instructions = [...action.payload];
		},
		setNutrients: (state, action: PayloadAction<Nutrient[]>) => {
			state.nutrients = [...action.payload];
		},
		setRecipeTags: (state, action: PayloadAction<string[]>) => {
			state.tags = [...action.payload];
		},
	},
});

export const { setIngredients, setInstructions, setNutrients, setRecipeTags } =
	creationSlice.actions;

export const selectCreation = (state: RootState) => state.creation;

export default creationSlice.reducer;
