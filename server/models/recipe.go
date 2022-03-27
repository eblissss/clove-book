package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Recipe struct {
	RecipeStub
	Nutrients    *RecipeNutrients
	Author       string             `json:"author" bson:"author"`
	AuthorID     primitive.ObjectID `json:"authorID" bson:"authorID"`
	CookTime     int64              `json:"cookTime" bson:"cookTime"`
	PrepTime     int64              `json:"prepTime" bson:"prepTime"`
	Instructions []Instruction      `json:"instructions" bson:"instructions"`
	CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Recipestub for both user-created and other recipes
type RecipeStub struct {
	CookbookID    primitive.ObjectID `json:"cookbookID" bson:"cookbookID"`
	SpoonacularID int64              `json:"spoonacularID" bson:"spoonacularID"`
	ImageURL      string             `json:"imageURL" bson:"imageURL"`
	RecipeName    string             `json:"name" bson:"name"`
	IsUserRecipe  bool               `json:"userRecipe" bson:"userRecipe"`
	TotalTime     int64              `json:"totalTime" bson:"totalTime"`
	Tags          []string           `json:"tags" bson:"tags"`
	Ingredients   []Ingredient       `json:"ingredients" bson:"ingredients"` // not sure about inclusion
}

type Ingredient struct {
	IngredientName string  `json:"name" bson:"name"`
	Amount         float64 `json:"amount" bson:"amount"`
	Unit           string  `json:"unit" bson:"unit"`
}

type Instruction struct {
	Number      int64  `json:"number" bson:"number"` // not sure this is necessary when instructions are in an array and have an index?
	Description string `json:"description" bson:"description"`
	// TODO: add array of ingredients?
}
