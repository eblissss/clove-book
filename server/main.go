package main

import (
	"os"
	"server/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8000"
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(cors.Default())

	// Test
	r.GET("/test", routes.Test)

	// // Recipes
	// r.POST("/recipes", routes.MakeRecipe)
	// r.GET("/recipes", routes.SearchRecipes)
	// r.DELETE("/recipes/:cookbookID", routes.DeleteRecipe)
	// r.PUT("/recipes/:cookbookID", routes.UpdateRecipe)
	// r.POST("/users/:username/favorites", routes.SaveFavorite)
	// r.GET("/users/:username/favorites", routes.ViewFavorites)

	// // Ingredients
	// r.GET("/users/:username/ingredients", routes.ViewIngredients)
	// r.POST("/users/:username/ingredients", routes.AddIngredients)
	// r.DELETE("/users/:username/ingredients", routes.DeleteIngredients)
	// r.PUT("/users/:username/ingredients", routes.UpdateIngredient) // What is the use case of this?

	// // Users
	r.POST("/users/auth", routes.AuthUser)
	r.POST("/users", routes.RegisterUser)
	r.GET("/users/login", routes.LogInUser)
	// r.GET("/users/logout", routes.LogOut)
	// r.GET("/users/:username", routes.GetUser)
	// r.PUT("/users/:username", routes.UpdateUsername)
	// r.DELETE("/users/:username", routes.DeleteUser)

	//this runs the server and allows it to listen to requests.
	r.Run(":" + port)
}
