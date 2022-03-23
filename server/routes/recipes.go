package routes

import (
	"context"
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

	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not fit into recipe struct"})
		return
	}

	if err := r.Validator.Struct(recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not be validated"})
		return
	}

	res, err := r.RecipeCollection.InsertOne(ctx, recipe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added"})
		return
	}

	stub := models.RecipeStub{
		CookbookID:    res.InsertedID.(primitive.ObjectID),
		SpoonacularID: -1, // TODO: decide what id to assign to user recipes
		RecipeName:    recipe.RecipeName,
		IsUserRecipe:  true,
		TotalTime:     recipe.TotalTime,
		Tags:          recipe.Tags,
		Ingredients:   recipe.Ingredients,
	}

	_, err = r.StubCollection.InsertOne(ctx, stub)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added to stubs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"insertedCID": stub.CookbookID, "insertedRecipe": recipe, "insertedStub": stub})
	return
}

func (r *Client) DeleteRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	toDelete, qerr := c.GetQuery("cookbookID")
	//fmt.Println
	if !qerr {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipe not specified"})
		return
	}

	deleted, err := r.RecipeCollection.DeleteOne(ctx, r.RecipeCollection.FindOne(ctx, bson.M{"_id": toDelete}))
	if deleted.DeletedCount == 0 || err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipe to delete does not exist"})
		return
	}

	c.JSON(http.StatusOK, bson.M{"deleted": toDelete})
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

	cur, err := r.StubCollection.Find(ctx,
		bson.M{"name": bson.M{"$regex": primitive.Regex{Pattern: ".*", Options: "i"}}},
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

	c.JSON(http.StatusOK, foundRecipes)
}
