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

	// Recipes
	r.POST("/recipes", c.MakeRecipe)
	r.GET("/recipes", c.SearchMyRecipes)
	r.PUT("/recipes/:cookbookID", c.UpdateRecipe)
	r.DELETE("/recipes/:cookbookID", c.DeleteRecipe)
	r.PUT("/users/:userID/favorites", c.SaveFavorite)
	r.GET("/users/:userID/favorites", c.ViewFavorites)

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
