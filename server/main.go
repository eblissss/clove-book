package main

import (
	"os"
	"server/routes"
	"time"

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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://clovebook.com", "http://localho.st:3000", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowHeaders:     []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Accept, Origin, Cache-Control, X-Requested-With"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Recipes
	r.POST("/recipes", c.CreateRecipe)
	r.GET("/recipes", c.SearchRecipes)
	r.GET("/recipes/:id", c.GetRecipe)
	r.GET("/recipes/popular", c.GetPopularRecipes)
	r.GET("/recipes/ingredients", c.SearchRecipesIngredients)
	r.PUT("/recipes/:id", c.UpdateRecipe)
	r.DELETE("/recipes/:id", c.DeleteRecipe)
	r.PUT("/users/:userID/favorites", c.UpdateFavorite)
	r.GET("/users/:userID/favorites", c.ViewFavorites)
	r.GET("/users/:userID/created", c.GetUsersRecipes)
	// Users
	r.POST("/users/auth", c.AuthUser)
	r.GET("/users/refresh", c.RefreshToken)
	r.POST("/users", c.RegisterUser)
	r.GET("/users/login", c.LoginUser)
	r.GET("/users/logout", c.LogoutUser)
	r.GET("/users/:userID", c.GetUser)
	r.PUT("/users/:userID", c.UpdateUser)
	r.DELETE("/users/:userID", c.DeleteUser)

	// Test
	r.GET("/test", routes.Test)

	//this runs the server and allows it to listen to requests.
	r.Run(":" + port)
}
