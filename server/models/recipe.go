package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Recipe struct {
	RecipeStub   `bson:",inline"`
	Nutrients    []NutritionDetail `json:"nutrients" bson:"nutrients"`
	Author       string            `json:"author" bson:"author"`
	CookTime     int64             `json:"cookTime" bson:"cookTime"`
	PrepTime     int64             `json:"prepTime" bson:"prepTime"`
	Instructions []Instruction     `json:"instructions" bson:"instructions"`
	CreatedAt    time.Time         `json:"createdAt" bson:"createdAt"`
	Url          string            `json:"url" bson:"url"`
}

type OldRecipe struct {
	RecipeStub   `bson:",inline"`
	Nutrients    *OldRecipeNutrients `json:"nutrients" bson:"nutrients"`
	Author       string              `json:"author" bson:"author"`
	CookTime     int64               `json:"cookTime" bson:"cookTime"`
	PrepTime     int64               `json:"prepTime" bson:"prepTime"`
	Instructions []Instruction       `json:"instructions" bson:"instructions"`
	CreatedAt    time.Time           `json:"createdAt" bson:"createdAt"`
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
	AuthorID      primitive.ObjectID `json:"authorID" bson:"authorID"`
	UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type Ingredient struct {
	IngredientName string  `json:"name" bson:"name"`
	Amount         float64 `json:"amount" bson:"amount"`
	Unit           string  `json:"unit" bson:"unit"`
}

type Instruction struct {
	Description string `json:"description" bson:"description"`
	// TODO: add array of ingredients?
}

type SpoonInstructions struct {
	StepList []SpoonStep `json:"steps"`
}

type SpoonStep struct {
	Description string `json:"step"`
}

type SpoonacularSearchRecipe struct {
	RecipeName    string `json:"title"`
	SpoonacularID int64  `json:"id"`
	ImageURL      string `json:"image"`
}

type SpoonacularSearchResponse struct {
	Recipes []SpoonacularSearchRecipe `json:"results"`
}

type SpoonacularRandomResponse struct {
	Recipes []SpoonacularSearchRecipe `json:"recipes"`
}

type SpoonacularRecipe struct {
	RecipeName    string              `json:"title"`
	SpoonacularID int64               `json:"id"`
	ImageURL      string              `json:"image"`
	TotalTime     int64               `json:"readyInMinutes"`
	Ingredients   []Ingredient        `json:"extendedIngredients"`
	Instructions  []SpoonInstructions `json:"analyzedInstructions"`
	Nutrition     *RecipeNutrients    `json:"nutrition"`
	Author        string              `json:"sourceName"`
	Url           string              `json:"sourceUrl"`
	// there has to be a better way to save tags
	IsCheap       bool `json:"cheap"`
	IsDairyFree   bool `json:"dairyFree"`
	IsGlutenFree  bool `json:"glutenFree"`
	IsKeto        bool `json:"ketogenic"`
	IsSustainable bool `json:"sustainable"`
	IsVegan       bool `json:"vegan"`
	IsVegetarian  bool `json:"vegetarian"`
	IsHealthy     bool `json:"veryHealthy"`
}

type FavoriteRecipes struct {
	UserID    primitive.ObjectID `json:"userID" bson:"user_id"`
	Favorites []string           `json:"favorites" bson:"favorites"`
}
