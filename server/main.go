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

	c := routes.New()

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(cors.Default())

	// Test
	r.GET("/test", routes.Test)

	// Recipes
	r.POST("/recipes", c.MakeRecipe)
	r.GET("/recipes", c.SearchMyRecipes)
	r.DELETE("/recipes/:cookbookID", c.DeleteRecipe)
	r.PUT("/recipes/:cookbookID", c.UpdateRecipe)
	r.PUT("/users/:username/favorites", c.SaveFavorite)
	r.GET("/users/:username/favorites", c.ViewFavorites)

	// Ingredients
	r.GET("/users/:username/ingredients", c.ViewIngredients)
	r.POST("/users/:username/ingredients", c.AddIngredients)
	r.DELETE("/users/:username/ingredients", c.DeleteIngredients)
	r.PUT("/users/:username/ingredients", c.UpdateIngredients)

	// Users
	r.POST("/users/auth", c.AuthUser)
	r.POST("/users", c.RegisterUser)
	r.GET("/users/login", c.LoginUser)
	r.GET("/users/logout", c.LogoutUser)
	r.GET("/users/:username", c.GetUser)
	r.PUT("/users/:username", c.UpdateUser)
	r.DELETE("/users/:username", c.DeleteUser)

	//this runs the server and allows it to listen to requests.
	r.Run(":" + port)
}
