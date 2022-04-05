package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"server/lib/creds"
	"server/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var spoonacularBaseURL = "https://api.spoonacular.com"

func (r *Client) CreateRecipe(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	var recipe models.Recipe

	if err := c.BindJSON(&recipe); err != nil {
		fmt.Println(err)
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
		ImageURL:      recipe.ImageURL,
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

	query, _ := c.GetQuery("query")
	// pattern := fmt.Sprintf("%s", query)

	cur, err := r.StubCollection.Find(ctx,
		// still not fuzzy but partial at least
		bson.D{{Key: "name", Value: primitive.Regex{Pattern: query, Options: "i"}}},

		// this is an order of magnitude faster but not fuzzy or partial
		// bson.M{"$text": bson.M{"$search": query}},
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

func (r *Client) searchSpoonacularRecipes(ctx context.Context, c *gin.Context, query string, tags []string) {
	resp, err := http.Get(spoonacularBaseURL + "/recipes/complexSearch?query=" + query +
		"&apiKey=" + os.Getenv("API_KEY"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get spoonacular recipes"})
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read spoonacular response"})
		return
	}

	var searchResponse models.SpoonacularSearchResponse
	json.Unmarshal(body, &searchResponse)

	foundRecipes := fmtSpoonacularSearchRes(searchResponse)

	c.JSON(http.StatusOK, foundRecipes)
}

func (r *Client) getRandomSpoonacularRecipes(ctx context.Context, c *gin.Context) {
	resp, err := http.Get(spoonacularBaseURL + "/recipes/random?apiKey=" +
		os.Getenv("API_KEY"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get spoonacular recipes"})
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read spoonacular response"})
		return
	}

	var searchResponse models.SpoonacularSearchResponse
	json.Unmarshal(body, &searchResponse)

	foundRecipes := fmtSpoonacularSearchRes(searchResponse)

	c.JSON(http.StatusOK, foundRecipes)
}

// Format a spoonacular search result into stubs
func fmtSpoonacularSearchRes(searchRes models.SpoonacularSearchResponse) []models.RecipeStub {
	foundRecipes := make([]models.RecipeStub, len(searchRes.Recipes))

	for _, recipe := range searchRes.Recipes {
		stub := models.RecipeStub{
			CookbookID:    primitive.NilObjectID,
			SpoonacularID: recipe.SpoonacularID,
			ImageURL:      recipe.ImageURL,
			RecipeName:    recipe.RecipeName,
			IsUserRecipe:  false,
			TotalTime:     0,
			Ingredients:   nil,
		}
		foundRecipes = append(foundRecipes, stub)
	}

	return foundRecipes
}

// https://spoonacular.com/food-api/docs#Get-Recipe-Information
func (r *Client) getSpoonacularRecipe(ctx context.Context, c *gin.Context, id string) {
	resp, err := http.Get(spoonacularBaseURL + "/recipes/" + id + "/information?apiKey=" +
		os.Getenv("API_KEY") + "&includeNutrition=true")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get spoonacular recipe"})
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read spoonacular recipe"})
		return
	}

	var recipe models.SpoonacularRecipe
	json.Unmarshal(body, &recipe)

	stub := models.RecipeStub{
		CookbookID:    primitive.NilObjectID,
		SpoonacularID: recipe.SpoonacularID,
		ImageURL:      recipe.ImageURL,
		RecipeName:    recipe.RecipeName,
		IsUserRecipe:  false,
		TotalTime:     recipe.TotalTime,
		Ingredients:   recipe.Ingredients,
	}

	// this is dumb there has to be a better way but whatever no one has to know
	// TODO: standardize tag names?
	if recipe.IsCheap {
		stub.Tags = append(stub.Tags, "cheap")
	}
	if recipe.IsDairyFree {
		stub.Tags = append(stub.Tags, "dairy free")
	}
	if recipe.IsGlutenFree {
		stub.Tags = append(stub.Tags, "gluten free")
	}
	if recipe.IsKeto {
		stub.Tags = append(stub.Tags, "keto")
	}
	if recipe.IsSustainable {
		stub.Tags = append(stub.Tags, "sustainable")
	}
	if recipe.IsVegan {
		stub.Tags = append(stub.Tags, "vegan")
	}
	if recipe.IsVegetarian {
		stub.Tags = append(stub.Tags, "vegetarian")
	}
	if recipe.IsHealthy {
		stub.Tags = append(stub.Tags, "healthy")
	}

	c.JSON(http.StatusOK, stub)
}

func (r *Client) getPopularRecipes(ctx context.Context, c *gin.Context) {

	popularIds := [20]string{"0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
		"0", "0", "0", "0", "0", "0", "0", "0", "0", "0"}

	objectIds := make([]primitive.ObjectID, len(popularIds))
	for i := range popularIds {
		id, err := primitive.ObjectIDFromHex(popularIds[i])
		if err == nil {
			objectIds = append(objectIds, id)
		}
	}

	// Find instead of findOne
	res := r.RecipeCollection.FindOne(ctx,
		bson.M{"cookbookID": bson.M{"$in": objectIds}},
	)
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

func (r *Client) getCookbookRecipe(ctx context.Context, c *gin.Context, id string) {
	objID, _ := primitive.ObjectIDFromHex(id)
	res := r.RecipeCollection.FindOne(ctx, bson.M{
		"cookbookID": objID,
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

	param := c.Params.ByName("id")
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

	param := c.Params.ByName("id")
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

func (r *Client) UpdateFavorite(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	param := c.Params.ByName("userID")
	userID, _ := primitive.ObjectIDFromHex(param)

	set, _ := c.GetQuery("set")
	cookbookID, _ := c.GetQuery("cookbookID")

	var fav models.FavoriteRecipes

	res := r.FavoriteCollection.FindOne(ctx, bson.M{
		"user_id": userID,
	})

	noPrevFavorites := false

	if res.Err() != nil {
		if res.Err() == mongo.ErrNoDocuments {
			noPrevFavorites = true
			if set == "true" {
				fav = models.FavoriteRecipes{UserID: userID, Favorites: []string{cookbookID}}
			} else {
				fav = models.FavoriteRecipes{UserID: userID, Favorites: []string{}}
			}
		} else {
			c.Status(http.StatusInternalServerError)
			return
		}
	}

	if !noPrevFavorites {
		fav := models.FavoriteRecipes{}
		err := res.Decode(&fav)
		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}

		if set == "true" {
			fav.Favorites = append(fav.Favorites, cookbookID)
		} else {
			for i, v := range fav.Favorites {
				if v == cookbookID {
					fav.Favorites = append(fav.Favorites[:i], fav.Favorites[i+1:]...)
					break
				}
			}
		}

		result, err := r.FavoriteCollection.UpdateOne(ctx, bson.M{"user_id": userID}, bson.M{"$set": fav})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Favorite could not be updated"})
			return
		}
		if result.MatchedCount == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User list to be updated not found"})
			return
		}

	} else {
		_, err := r.FavoriteCollection.InsertOne(ctx, fav)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Favorite could not be added"})
			return
		}
	}

	c.JSON(http.StatusOK, bson.M{"updated": cookbookID})
}

func (r *Client) ViewFavorites(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	param := c.Params.ByName("userID")
	userID, _ := primitive.ObjectIDFromHex(param)

	query, _ := c.GetQuery("query")

	queryOnlyID, _ := c.GetQuery("onlyID")
	onlyID := (queryOnlyID == "true")

	res := r.FavoriteCollection.FindOne(ctx, bson.M{
		"user_id": userID,
	})

	if res.Err() != nil {
		if res.Err() == mongo.ErrNoDocuments {
			c.Status(http.StatusNotFound)
			return
		} else {
			c.Status(http.StatusInternalServerError)
			return
		}
	}

	fav := models.FavoriteRecipes{}
	err := res.Decode(&fav)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	if onlyID {
		c.JSON(http.StatusOK, fav.Favorites)
		return
	}

	r.GetManyRecipes(c, fav.Favorites, query)
}

func (r *Client) GetManyRecipes(c *gin.Context, ids []string, query string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// this only does our cookbook database right now

	objectIds := make([]primitive.ObjectID, len(ids))
	for i := range ids {
		id, err := primitive.ObjectIDFromHex(ids[i])
		if err == nil {
			objectIds = append(objectIds, id)
		}
	}

	cur, err := r.StubCollection.Find(ctx,
		bson.M{
			"name":       primitive.Regex{Pattern: query, Options: "i"},
			"cookbookID": bson.M{"$in": objectIds},
		},
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
