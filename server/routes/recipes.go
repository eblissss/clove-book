package routes

import (
	"context"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (r *Client) MakeRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	var recipe models.Recipe
	var stub models.RecipeStub

	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.BindJSON(&stub) //TODO error check

	if err := r.Validator.Struct(recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recipeID, err := r.RecipeCollection.InsertOne(ctx, recipe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added"})
		return
	}

	stub.RecipeId = insertedId.string()

	r.StubCollection.InsertOne(ctx, stub)

	c.JSON(http.StatusOK, "yay")
}

func (r *Client) DeleteRecipe(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	_ = c.Params.ByName("cookbookID")

	c.JSON(http.StatusOK, "deleteplaceholder")
}

func (r *Client) UpdateRecipe(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) SaveFavorite(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) ViewFavorites(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

// Kate wrote this
func (r *Client) SearchMyRecipes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err := r.RecipeCollection.Find(ctx,
		// bson.M{"name": bson.M{"$regex": primitive.Regex{Pattern: ".*", Options: "i"}}},
		bson.M{},
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foundRecipes := make([]models.RecipeStub, 0)

	err = cur.All(ctx, &foundRecipes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// opts := options.Find().SetSort(bson.M{"score": 1})
	// filter := bson.M{"$text": bson.M{"$search": c.Query("query"), "score": bson.M{"$meta": "textScore" }, "limit": 5}}

	// cur, err := recipeCollection.Find(ctx, filter, opts)

	c.JSON(http.StatusOK, foundRecipes)
}
