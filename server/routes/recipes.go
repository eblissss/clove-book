package routes

import (
	"context"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

var recipeCollection *mongo.Collection = OpenCollection(Client, "recipes")

func MakeRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	var recipe models.Recipe

	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := validate.Struct(recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := recipeCollection.InsertOne(ctx, recipe); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added"})
		return
	}

	c.JSON(http.StatusOK, "yay")
}

func DeleteRecipe(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	_ = c.Params.ByName("cookbookID")

	c.JSON(http.StatusOK, "hi :)")
}
