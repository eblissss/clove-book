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

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	// Test
	router.GET("/test", routes.Test)

	// Recipes
	router.POST("/recipes")
	router.GET("/recipes")
	router.DELETE("/recipes/:cookbookID")
	router.PUT("/recipes/:cookbookID")
	router.POST("/users/:username/favorites")
	router.GET("/users/:username/favorites")

	// Ingredients
	router.GET("/users/:username/ingredients")
	router.POST("/users/:username/ingredients")
	router.DELETE("/users/:username/ingredients")
	router.PUT("/users/:username/ingredients")

	// Users
	router.POST("/users")
	router.GET("/users/login")
	router.GET("/users/logout")
	router.GET("/users/:username")
	router.PUT("/users/:username")
	router.DELETE("/users/:username")

	//this runs the server and allows it to listen to requests.
	router.Run(":" + port)
}
