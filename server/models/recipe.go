package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	RecipeName   string   `json:"name"`
	Author       string   `json:"author"`
	CookTime     int64    `json:"cookTime"`
	PrepTime     int64    `json:"prepTime"`
	TotalTime    int64    `json:"totalTime"`
	Tags         []string `json:"tags"`
	Ingredients  []string `json:"ingredients"`
}

// Recipestub for both user-created and other recipes
type RecipeStub struct {
	CookbookID    primitive.ObjectID `json:"cookbookID" bson:"cookbookID"`
	SpoonacularID int                `json:"spoonacularID" bson:"spoonacularID"`
	RecipeName    string             `json:"name"`
	IsUserRecipe  bool               `json:"userRecipe"`
	TotalTime     int64              `json:"totalTime"`
	Tags          []string           `json:"tags"`
	Ingredients   []string           `json:"ingredients"` // not sure about inclusion
}
