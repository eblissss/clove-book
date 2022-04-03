export interface NewUser {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface User extends NewUser {
	userID: string;
	createdAt: string;
	updatedAt: string;
}

export interface Ingredient {
	name: string;
	amount: number;
	unit: string;
}

export interface Instruction {
	description: string;
}

export interface SimpleRecipe {
	spoonacularID: number;
	cookbookID: string;
	name: string;
	imageURL?: string;
	totalTime?: number;
	tags?: string[];
	savedAt: string;
}

export interface Recipe extends SimpleRecipe {
	author: string;
	authorID: string;
	cookTime: number;
	prepTime: number;
	totalTime: number;
	ingredients: Ingredient[];
	instructions: Instruction[];
	nutrients: RecipeNutrients;
	createdAt: string;
}

export interface Userpass {
	username: string;
	password: string;
}

export interface Useremail {
	username: string;
	email: string;
}

export interface Nutrient {
	name: string;
	amount: string;
	indented: boolean;
	percentOfDailyNeeds: number;
}

export interface RecipeNutrients {
	bad: Nutrient[];
	good: Nutrient[];
}
