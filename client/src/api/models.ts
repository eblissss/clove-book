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
	sID: number;
	cbID: number;
	name: string;
	imageURL?: string;
	readyInMinutes?: number;
	tags?: string[];
	savedAt: string;
}

export interface Recipe extends SimpleRecipe {
	username: string;
	ingredients: Ingredient[];
	instructions: Instruction[];
}
