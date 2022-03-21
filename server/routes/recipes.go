package routes

import (
	"context"
	"fmt"
	"net/http"
	"server/models"
	"time"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	c.BindJSON(&stub); //TODO error check

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
	fmt.Println("Passed context creation")

	// GET api.clovebook.com/recipes?query=""&tags=""

	// query, exists := c.GetQuery("query")
	// if !exists {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "'query' required in endpiont"})
	// }

	//cur, err := r.RecipeCollection.Find(ctx, bson.M{})


	cur, err := r.RecipeCollection.Find(ctx,
	bson.M{"name": bson.M{"$regex": primitive.Regex{Pattern: ".*", Options: "i"}}})
	// // look into this
	if cur == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foundRecipes := make([]models.RecipeStub, 0)
	fmt.Println("Passed recipe finding")

	for cur.Next(ctx) {
		fmt.Println("Passed curnext")
        elem := models.RecipeStub{}
        
        if err := cur.Decode(&elem); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        }

        foundRecipes = append(foundRecipes, elem)
    }

	fmt.Println("boop")
	fmt.Printf("Passed recipe unwrapping\n")

	// opts := options.Find().SetSort(bson.M{"score": 1})
	// filter := bson.M{"$text": bson.M{"$search": c.Query("query"), "score": bson.M{"$meta": "textScore" }, "limit": 5}}

	// cur, err := recipeCollection.Find(ctx, filter, opts)

	c.JSON(http.StatusOK, foundRecipes)
}
