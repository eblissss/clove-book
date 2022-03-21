package routes

import (
	"context"
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/bson"
)

func (r *Client) MakeRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	var recipe models.Recipe

	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := r.Validator.Struct(recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := r.RecipeCollection.InsertOne(ctx, recipe); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added"})
		return
	}

	c.JSON(http.StatusOK, "yay")
}

func (r *Client) DeleteRecipe(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	_ = c.Params.ByName("cookbookID")

	c.JSON(http.StatusOK, "hi :)")
}

// Kate wrote this
func (r *Client) SearchMyRecipes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	fmt.Println("Passed context creation")

	// GET api.clovebook.com/recipes?query=""&tags=""

	// query, exists := c.GetQuery("query")
	// if !exists {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "'query' required in endpiont"})
	// }

	cur, err := r.RecipeCollection.Find(ctx,
		bson.M{
			"$regex": primitive.Regex{
				Pattern: ".*",
				Options: "i",
			},
		},
	)

	foundRecipes := make([]*models.RecipeStub, 0)
	fmt.Println("Passed recipe finding")

	if err = cur.All(ctx, &foundRecipes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Passed recipe unwrapping: %v\n", foundRecipes)

	// opts := options.Find().SetSort(bson.M{"score": 1})
	// filter := bson.M{"$text": bson.M{"$search": c.Query("query"), "score": bson.M{"$meta": "textScore" }, "limit": 5}}

	// cur, err := recipeCollection.Find(ctx, filter, opts)

	c.JSON(http.StatusOK, foundRecipes)

}
