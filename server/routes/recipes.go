package routes

import (
	"context"
	"net/http"
	"server/lib/creds"
	"server/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func (r *Client) CreateRecipe(c *gin.Context) {
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

	recipe.CookbookID = primitive.NewObjectID()
	recipe.CreatedAt = time.Now()
	recipe.UpdatedAt = time.Now()

	_, err := r.RecipeCollection.InsertOne(ctx, recipe)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added"})
		return
	}

	stub := models.RecipeStub{
		CookbookID:    recipe.CookbookID,
		SpoonacularID: -1, // TODO: decide what id to assign to user recipes
		RecipeName:    recipe.RecipeName,
		IsUserRecipe:  true,
		TotalTime:     recipe.TotalTime,
		Tags:          recipe.Tags,
		Ingredients:   recipe.Ingredients,
	}

	_, err = r.StubCollection.InsertOne(ctx, stub)
	if err != nil {
		c.JSON(http.StatusInternalServerError,
			gin.H{"error": "Recipe could not be added to stubs"})
		return
	}

	c.JSON(http.StatusOK,
		gin.H{
			"insertedCID":    stub.CookbookID,
			"insertedRecipe": recipe,
			"insertedStub":   stub,
		})
}

// Kate wrote this
func (r *Client) SearchRecipes(c *gin.Context) {
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

func (r *Client) GetRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()

	id := c.Params.ByName("id")

	// Verify user is logged in
	cookie, err := c.Cookie("token")
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}
	if _, ok := creds.VerifyToken(c, cookie); !ok {
		c.Status(http.StatusUnauthorized)
		return
	}

	// successful parse means it's a spoonacular id
	if _, err := strconv.ParseInt(id, 10, 32); err == nil {
		r.getSpoonacularRecipe(ctx, c, id)
		return
	}

	r.getCookbookRecipe(ctx, c, id)
}

func (r *Client) getSpoonacularRecipe(ctx context.Context, c *gin.Context, id string) {}

func (r *Client) getCookbookRecipe(ctx context.Context, c *gin.Context, id string) {
	res := r.RecipeCollection.FindOne(ctx, bson.M{
		"cookbookID": id,
	})
	if res.Err() != nil {
		if res.Err() == mongo.ErrNoDocuments {
			c.Status(http.StatusNotFound)
			return
		}
		c.Status(http.StatusInternalServerError)
		return
	}

	recipe := &models.Recipe{}
	err := res.Decode(recipe)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, recipe)
}

func (r *Client) UpdateRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	param := c.Param("cookbookID")
	cookbookID, _ := primitive.ObjectIDFromHex(param)

	var recipe models.Recipe

	if err := c.BindJSON(&recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not fit into recipe struct"})
		return
	}
	if err := r.Validator.Struct(recipe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not be validated"})
		return
	}

	// left out properties that shouldn't be changed
	update := bson.M{
		"name":         recipe.RecipeName,
		"imageURL":     recipe.ImageURL,
		"cookTime":     recipe.CookTime,
		"prepTime":     recipe.PrepTime,
		"totalTime":    recipe.TotalTime,
		"tags":         recipe.Tags,
		"ingredients":  recipe.Ingredients,
		"instructions": recipe.Instructions,
		"updatedAt":    time.Now(),
	}
	result, err := r.RecipeCollection.UpdateOne(ctx, bson.M{"cookbookID": cookbookID}, bson.M{"$set": update})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be updated"})
		return
	}
	if result.MatchedCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipe to be updated not found"})
		return
	}

	update = bson.M{
		"imageURL":    recipe.ImageURL,
		"name":        recipe.RecipeName,
		"totalTime":   recipe.TotalTime,
		"tags":        recipe.Tags,
		"ingredients": recipe.Ingredients,
	}
	result, err = r.StubCollection.UpdateOne(ctx, bson.M{"cookbookID": cookbookID}, bson.M{"$set": update})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Stub could not be updated"})
		return
	}
	if result.MatchedCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stub to be updated not found"})
		return
	}

	c.JSON(http.StatusOK, bson.M{"updated": cookbookID})
}

func (r *Client) DeleteRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	param := c.Param("cookbookID")
	cookbookID, _ := primitive.ObjectIDFromHex(param)

	recipeDeleted, err := r.RecipeCollection.DeleteOne(ctx, bson.M{"cookbookID": cookbookID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be deleted"})
		return
	}
	if recipeDeleted.DeletedCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recipe to be deleted not found"})
		return
	}

	stubDeleted, err := r.StubCollection.DeleteOne(ctx, bson.M{"cookbookID": cookbookID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Stub could not be deleted"})
		return
	}
	if stubDeleted.DeletedCount == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stub to be deleted not found"})
		return
	}

	c.JSON(http.StatusOK, bson.M{"deleted": cookbookID})
}

func (r *Client) SaveFavorite(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) ViewFavorites(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}
