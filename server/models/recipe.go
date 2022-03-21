package models

type Recipe struct {
	RecipeName  string   `json:"name"`
	Author      string   `json:"author"`
	CookTime    int64    `json:"cookTime"`
	PrepTime    int64    `json:"prepTime"`
	TotalTime   int64    `json:"totalTime"`
	Tags        []string `json:"tags"`
	Ingredients []string `json:"ingredients"`
	IsUserRecipe bool 	 `json:"isUserRecipe"`
}

// Recipestub for both user-created and other recipes
type RecipeStub struct {
	RecipeId     int      `json:""`
	RecipeName   string   `json:"name"`
	IsUserRecipe bool     `json:"userRecipe"`
	IsMyRecipe   bool     `json:"myRecipe"`
	TotalTime    int64    `json:"totalTime"`
	Tags         []string `json:"tags"`
	Ingredients  []string `json:"ingredients"` // not sure about inclusion
}
