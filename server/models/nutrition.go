package models

type RecipeNutrients struct {
	// Calories string `json:"calories"`
	// Carbs    string `json:"carbs"`
	// Fat      string `json:"fat"`
	// Protein  string `json:"protein"`
	// Bad      []*NutritionDetail `json:"bad"`
	// Good     []*NutritionDetail `json:"good"`
	Nutrients []NutritionDetail `json:"nutrients"`
}

type OldRecipeNutrients struct {
	Bad  []NutritionDetail `json:"bad" bson:"bad"`
	Good []NutritionDetail `json:"good" bson:"good"`
}

type NutritionDetail struct {
	Name                string  `json:"name"`
	Amount              string  `json:"amount"`
	Indented            bool    `json:"indented"`
	PercentOfDailyNeeds float32 `json:"percentOfDailyNeeds"`
}
