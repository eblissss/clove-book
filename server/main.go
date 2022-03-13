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

	// Recipes
	r.POST("/recipes")
	r.GET("/recipes")
	r.DELETE("/recipes/:cookbookID", routes.DeleteRecipe)
	r.PUT("/recipes/:cookbookID")
	r.POST("/users/:username/favorites")
	r.GET("/users/:username/favorites")

	// Ingredients
	r.GET("/users/:username/ingredients")
	r.POST("/users/:username/ingredients")
	r.DELETE("/users/:username/ingredients")
	r.PUT("/users/:username/ingredients")

	// Users
	r.POST("/users", routes.MakeUser)
	r.GET("/users/login")
	r.GET("/users/logout")
	r.GET("/users/:username")
	r.PUT("/users/:username")
	r.DELETE("/users/:username")

	//this runs the server and allows it to listen to requests.
	r.Run(":" + port)
}
