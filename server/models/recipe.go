package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	RecipeName  string   `json:"name"`
	Author      string   `json:"author"`
	CookTime    int64    `json:"cookTime"`
	PrepTime    int64    `json:"prepTime"`
	TotalTime   int64    `json:"totalTime"`
	Tags        []string `json:"tags"`
	Ingredients []string `json:"ingredients"` // TODO: change to array of json objects to include quantities
	// TODO: add instructions
}

// Recipestub for both user-created and other recipes
type RecipeStub struct {
	CookbookID    primitive.ObjectID `json:"cookbookID" bson:"cookbookID"`
	SpoonacularID int                `json:"spoonacularID" bson:"spoonacularID"`
	RecipeName    string             `json:"name" bson:"name"`
	IsUserRecipe  bool               `json:"userRecipe" bson:"userRecipe"`
	TotalTime     int64              `json:"totalTime" bson:"totalTime"`
	Tags          []string           `json:"tags" bson:"tags"`
	Ingredients   []string           `json:"ingredients" bson:"ingredients"` // not sure about inclusion
}
