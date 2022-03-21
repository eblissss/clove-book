package routes

import (
	"context"
	"net/http"
	"server/models"
	"time"
	"fmt"
	//"options"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	//"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
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

// Kate wrote this
func SearchMyRecipes (c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err:= recipeCollection.Find(ctx, bson.M{})
	foundRecipes := make([]*models.RecipeStub, 0)

	if err = cur.All(ctx, &foundRecipes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	fmt.Println(foundRecipes)
	
	// opts := options.Find().SetSort(bson.M{"score": 1})
	// filter := bson.M{"$text": bson.M{"$search": c.Query("query"), "score": bson.M{"$meta": "textScore" }, "limit": 5}}

	// cur, err := recipeCollection.Find(ctx, filter, opts)
	
	c.JSON(http.StatusOK, foundRecipes)
	
}
