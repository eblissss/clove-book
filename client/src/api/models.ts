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
	ingredients: Ingredient[];
	updatedAt: string;
	authorID: string;
}

export interface Recipe extends SimpleRecipe {
	author: string;
	cookTime: number;
	prepTime: number;
	totalTime: number;
	instructions: Instruction[];
	nutrients: Nutrient[];
	createdAt: string;
	url?: string;
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

export const fakeJSON: SimpleRecipe = {
	spoonacularID: 0,
	cookbookID: "000000000000000000000000",
	name: "Vegan Cheesecake",
	imageURL: "https://picsum.photos/200",
	totalTime: 10,
	tags: ["dessert", "grass"],
	updatedAt: "March 4th",
	ingredients: [],
	authorID: "000000000000000000000000",
};
