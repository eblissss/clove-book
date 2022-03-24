export interface NewUser {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface User extends NewUser {
	userID: number;
	createdAt: string;
	updatedAt: string;
}

export interface Ingredient {
	name: string;
	amount: number;
	unit: string;
}

interface Instruction {
	number: number;
	description: string;
	ingredients: Ingredient[];
}

export interface SimpleRecipe {
	spoonacularID: number;
	cookbookID: number;
	name: string;
	imageURL?: string;
	readyInMinutes?: number;
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
