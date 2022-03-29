import * as requests from "./requests";

const setFilters = () => {
	// go through each filter from state
};

export const getRandomRecipes = () => requests.getRecipes("", [""]);

// get popular
export const getPopularRecipes = () =>
	requests.getRecipes("&sort=popularity", [""]);

// get with ingredients
// sort with max-used-ingredients
export const getIngredientRecipes = (ingredients: string) =>
	requests.getRecipes(
		`&sort=max-used-ingredients&includeIngredients=${ingredients}`,
		[""]
	);

// get own created recipes

// get by tag
export const getTaggedRecipes = (tag: string) =>
	requests.getRecipes("&sort=random", [tag]);
