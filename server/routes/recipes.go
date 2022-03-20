package routes

import (
	"context"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	//"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
)

var recipeCollection *mongo.Collection = OpenCollection(Client, "recipes")

func DeleteRecipe(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	_ = c.Params.ByName("cookbookID")

	c.JSON(http.StatusOK, "hi :)")
}

func MakeRecipe(c *gin.Context) {
	

	c.JSON(http.StatusOK, gin.H{
		"cookbookID": 123,
	})
}

// Kate wrote this
func SearchMyRecipes (c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	
	opts := options.Find().SetSort(bson.M{"score": bson.M{"$meta": "textScore"})

	foundRecipes := make([]*models.RecipeStub, 0)
	filter := bson.M{"$text": bson.M{"$search": c.Query("query"), "score": bson.M{"$meta": "textScore" }, "limit": 5}}

	cur, err := recipeCollection.Find(ctx, filter, opts)
	
	// TODO check error?
	if err = cursor.All(ctx, &foundRecipes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	// Should it be an error if no matches found?
	
	c.JSON(http.StatusOK, gin.H{
		"cbID": res.Header,
	})
}
