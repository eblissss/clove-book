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
	// r.POST("/api/recipes", routes.MakeRecipe)
	// r.GET("/api/recipes", routes.SearchRecipes)
	// r.DELETE("/api/recipes/:cookbookID", routes.DeleteRecipe)
	// r.PUT("/api/recipes/:cookbookID", routes.UpdateRecipe)
	// r.POST("/api/users/:username/favorites", routes.SaveFavorite)
	// r.GET("/api/users/:username/favorites", routes.ViewFavorites)

	// // Ingredients
	// r.GET("/api/users/:username/ingredients", routes.ViewIngredients)
	// r.POST("/api/users/:username/ingredients", routes.AddIngredients)
	// r.DELETE("/api/users/:username/ingredients", routes.DeleteIngredients)
	// r.PUT("/api/users/:username/ingredients", routes.UpdateIngredient) // What is the use case of this?

	// // Users
	r.POST("/api/users/auth", routes.AuthUser)
	r.POST("/api/users", routes.RegisterUser)
	r.GET("/api/users/login", routes.LoginUser)
	// r.GET("/api/users/logout", routes.LogOut)
	// r.GET("/api/users/:username", routes.GetUser)
	// r.PUT("/api/users/:username", routes.UpdateUsername)
	// r.DELETE("/api/users/:username", routes.DeleteUser)

	//this runs the server and allows it to listen to requests.
	r.Run(":" + port)
}
