package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Recipe struct {
	RecipeName   string        `json:"name"`
	Author       string        `json:"author"`
	CookTime     int64         `json:"cookTime"`
	PrepTime     int64         `json:"prepTime"`
	TotalTime    int64         `json:"totalTime"`
	Tags         []string      `json:"tags"`
	Ingredients  []Ingredient  `json:"ingredients"`
	Instructions []Instruction `json:"instructions"`
}

// Recipestub for both user-created and other recipes
type RecipeStub struct {
	CookbookID    primitive.ObjectID `json:"cookbookID" bson:"cookbookID"`
	SpoonacularID int64              `json:"spoonacularID" bson:"spoonacularID"`
	RecipeName    string             `json:"name" bson:"name"`
	IsUserRecipe  bool               `json:"userRecipe" bson:"userRecipe"`
	TotalTime     int64              `json:"totalTime" bson:"totalTime"`
	Tags          []string           `json:"tags" bson:"tags"`
	Ingredients   []Ingredient       `json:"ingredients" bson:"ingredients"` // not sure about inclusion
}

type Ingredient struct {
	IngredientName string  `json:"name"`
	Amount         float64 `json:"amount"`
	Unit           string  `json:"unit"`
}

type Instruction struct {
	Number      int64  `json:"number"` // not sure this is necessary when instructions are in an array and have an index?
	Description string `json:"description"`
	// TODO: add array of ingredients?
}
