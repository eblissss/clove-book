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
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var spoonacularBaseURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"

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

	// TODO: Verify user is actually the one who made recipe

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
		AuthorID:      recipe.AuthorID,
		UpdatedAt:     recipe.UpdatedAt,
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

	// Cookbook Ids must be 24 digits, spoonacular ids will never be objectid length
	_, err = primitive.ObjectIDFromHex(id)
	if err == nil {
		r.getCookbookRecipe(ctx, c, id)
		return
	}

	r.getSpoonacularRecipe(c, id)
}

func (r *Client) SearchRecipes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	MAX_RECIPES := 30

	query, _ := c.GetQuery("query")

	tagsQuery, _ := c.GetQuery("tags")
	tags := strings.Split(strings.ToLower(tagsQuery), ",")
	if len(tagsQuery) == 0 {
		tags = []string{}
	}

	fmt.Println(tags)

	options := new(options.FindOptions)
	options.SetLimit(int64(MAX_RECIPES))

	// still not fuzzy but partial at least
	search := bson.D{{Key: "name", Value: primitive.Regex{Pattern: query, Options: "i"}}}
	if len(tags) > 0 {
		search = bson.D{{Key: "name", Value: primitive.Regex{Pattern: query, Options: "i"}},
			{Key: "tags", Value: bson.M{"$all": tags}}}
	}

	cur, err := r.StubCollection.Find(ctx,
		search,
		// this is an order of magnitude faster but not fuzzy or partial
		// bson.M{"$text": bson.M{"$search": query}},
		options,
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

	cbAmount := len(foundRecipes)
	if cbAmount < MAX_RECIPES {
		if query == "" {
			spoonResults := r.getRandomSpoonacularRecipes(c, MAX_RECIPES-cbAmount)
			foundRecipes = append(foundRecipes, spoonResults...)
		} else {
			spoonResults := r.searchSpoonacularRecipes(c, query, tags, MAX_RECIPES-cbAmount)
			foundRecipes = append(foundRecipes, spoonResults...)
		}
	}

	c.JSON(http.StatusOK, foundRecipes)
}

func (r *Client) searchSpoonacularRecipes(c *gin.Context, query string, tags []string, amount int) []models.RecipeStub {

	isVegan := false
	isVegetarian := false
	isGlutenFree := false
	isDairyFree := false
	for _, a := range tags {
		if a == "vegan" {
			isVegan = true
		} else if a == "vegetarian" {
			isVegetarian = true
		} else if a == "gluten free" {
			isGlutenFree = true
		} else if a == "dairy free" {
			isDairyFree = true
		}
	}

	diet := ""
	if isVegan {
		diet = "&diet=vegan"
	} else if isVegetarian {
		diet = "&diet=vegetarian"
	}

	intolerances := ""
	if isGlutenFree && isDairyFree {
		intolerances = "&intolerances=gluten,dairy"
	} else if isGlutenFree {
		intolerances = "&intolerances=gluten"
	} else if isGlutenFree {
		intolerances = "&intolerances=dairy"
	}

	req, err := http.NewRequest("GET", spoonacularBaseURL+"/recipes/complexSearch?query="+query+
		"&number="+strconv.Itoa(amount)+diet+intolerances, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating spoonacular request"})
		return []models.RecipeStub{}
	}
	req.Header.Set("X-RapidAPI-Key", os.Getenv("API_KEY"))
	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get spoonacular recipes"})
		return []models.RecipeStub{}
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read spoonacular response"})
		return []models.RecipeStub{}
	}

	var searchResponse models.SpoonacularSearchResponse
	json.Unmarshal(body, &searchResponse)

	return r.fmtSpoonacularSearchRes(searchResponse)
}

func (r *Client) getRandomSpoonacularRecipes(c *gin.Context, amount int) []models.RecipeStub {
	req, err := http.NewRequest("GET", spoonacularBaseURL+"/recipes/random?number="+strconv.Itoa(amount), nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating spoonacular request"})
		return []models.RecipeStub{}
	}
	req.Header.Set("X-RapidAPI-Key", os.Getenv("API_KEY"))
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get spoonacular recipes"})
		return []models.RecipeStub{}
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read spoonacular response"})
		return []models.RecipeStub{}
	}

	var searchResponse models.SpoonacularRandomResponse
	json.Unmarshal(body, &searchResponse)

	searchRes := models.SpoonacularSearchResponse{
		Recipes: searchResponse.Recipes,
	}

	return r.fmtSpoonacularSearchRes(searchRes)
}

// Format a spoonacular search result into stubs
func (r *Client) fmtSpoonacularSearchRes(searchRes models.SpoonacularSearchResponse) []models.RecipeStub {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	foundRecipes := make([]models.RecipeStub, 0)
	var foundRecipesInterface []interface{}

	spoonoid, err := primitive.ObjectIDFromHex("100000000000000000000000")

	for _, recipe := range searchRes.Recipes {
		stub := models.RecipeStub{
			CookbookID:    spoonoid,
			SpoonacularID: recipe.SpoonacularID,
			ImageURL:      recipe.ImageURL,
			RecipeName:    recipe.RecipeName,
			IsUserRecipe:  false,
			TotalTime:     1,
			Ingredients:   nil,
			AuthorID:      primitive.NilObjectID,
			UpdatedAt:     time.Time{},
		}
		foundRecipes = append(foundRecipes, stub)
		foundRecipesInterface = append(foundRecipesInterface, stub)
	}

	_, err = r.StubCollection.InsertMany(ctx, foundRecipesInterface)
	if err != nil {
		fmt.Println("Couldn't insert stubs, try again ", err)
	}

	return foundRecipes
}

func (r *Client) SearchRecipesIngredients(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// MAX_RECIPES := 30

	query, _ := c.GetQuery("query")
	ingredientsQuery, _ := c.GetQuery("ingredients")
	ingredientsQuery = strings.ToLower(ingredientsQuery)
	ingredients := strings.Split(ingredientsQuery, ",")
	ingredientRegex := strings.Join(ingredients, "|")

	cur, err := r.StubCollection.Find(ctx,
		bson.M{
			"name":             primitive.Regex{Pattern: query, Options: "i"},
			"ingredients.name": primitive.Regex{Pattern: ingredientRegex, Options: "i"},
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

	// Worry about spoonacular later
	// cbAmount := len(foundRecipes)
	// if cbAmount < MAX_RECIPES {
	// 	if query == "" {
	// 		spoonResults := r.getRandomSpoonacularRecipes(c, MAX_RECIPES-cbAmount)
	// 		foundRecipes = append(foundRecipes, spoonResults...)
	// 	} else {
	// 		spoonResults := r.searchSpoonacularRecipes(c, query, []string{}, MAX_RECIPES-cbAmount)
	// 		foundRecipes = append(foundRecipes, spoonResults...)
	// 	}
	// }

	c.JSON(http.StatusOK, foundRecipes)
}

func (r *Client) GetUsersRecipes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	paramId := c.Params.ByName("userID")
	id, err := primitive.ObjectIDFromHex(paramId)

	cur, err := r.StubCollection.Find(ctx,
		bson.M{
			"authorID": id,
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

// https://spoonacular.com/food-api/docs#Get-Recipe-Information
func (r *Client) getSpoonacularRecipe(c *gin.Context, id string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if id == "0" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get spoonacular recipe"})
		return
	}

	req, err := http.NewRequest("GET", spoonacularBaseURL+"/recipes/"+id+"/information?includeNutrition=true", nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error creating spoonacular request"})
		return
	}
	req.Header.Set("X-RapidAPI-Key", os.Getenv("API_KEY"))
	resp, err := http.DefaultClient.Do(req)
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

	var spoonRecipe models.SpoonacularRecipe
	json.Unmarshal(body, &spoonRecipe)

	spoonoid, err := primitive.ObjectIDFromHex("100000000000000000000000")

	newInstructions := []models.Instruction{}
	if len(spoonRecipe.Instructions) > 0 {
		for _, ins := range spoonRecipe.Instructions[0].StepList {
			newInstructions = append(newInstructions, models.Instruction{
				Description: ins.Description,
			})
		}
	}

	recipe := models.Recipe{
		RecipeStub: models.RecipeStub{
			CookbookID:    spoonoid,
			SpoonacularID: spoonRecipe.SpoonacularID,
			ImageURL:      spoonRecipe.ImageURL,
			RecipeName:    spoonRecipe.RecipeName,
			IsUserRecipe:  false,
			TotalTime:     spoonRecipe.TotalTime,
			Ingredients:   spoonRecipe.Ingredients,
			Tags:          []string{},
			AuthorID:      primitive.NilObjectID,
			UpdatedAt:     time.Time{},
		},
		Url:       spoonRecipe.Url,
		Nutrients: spoonRecipe.Nutrition.Nutrients,
		Author:    spoonRecipe.Author,

		CookTime:     -1,
		PrepTime:     -1,
		Instructions: newInstructions,
		CreatedAt:    time.Now(),
	}

	// this is dumb there has to be a better way but whatever no one has to know
	// TODO: standardize tag names?
	if spoonRecipe.IsCheap {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "cheap")
	}
	if spoonRecipe.IsDairyFree {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "dairy-free")
	}
	if spoonRecipe.IsGlutenFree {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "gluten-free")
	}
	if spoonRecipe.IsKeto {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "keto")
	}
	if spoonRecipe.IsSustainable {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "sustainable")
	}
	if spoonRecipe.IsVegan {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "vegan")
	}
	if spoonRecipe.IsVegetarian {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "vegetarian")
	}
	if spoonRecipe.IsHealthy {
		recipe.RecipeStub.Tags = append(recipe.RecipeStub.Tags, "healthy")
	}

	updateStub := bson.M{
		"imageURL":    recipe.RecipeStub.ImageURL,
		"name":        recipe.RecipeStub.RecipeName,
		"totalTime":   recipe.RecipeStub.TotalTime,
		"tags":        recipe.RecipeStub.Tags,
		"ingredients": recipe.RecipeStub.Ingredients,
	}
	_, err = r.StubCollection.UpdateOne(ctx, bson.M{
		"cookbookID":    recipe.RecipeStub.CookbookID,
		"spoonacularID": recipe.RecipeStub.SpoonacularID},
		bson.M{"$set": updateStub})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Stub could not be updated"})
		return
	}

	c.JSON(http.StatusOK, recipe)
}

func (r *Client) GetPopularRecipes(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	popularIds := [20]string{"624900e1c116048b1d3750b0", "624905de96a29b2293938153", "62490c15b9e2b95d03d100aa", "624a0cbd8dd7ab1c8e9711b8",
		"0", "0", "0", "0", "0", "0",
		"0", "0", "0", "0", "0", "0", "0", "0", "0", "0"}

	objectIds := make([]primitive.ObjectID, len(popularIds))
	for i := range popularIds {
		id, err := primitive.ObjectIDFromHex(popularIds[i])
		if err == nil {
			objectIds = append(objectIds, id)
		}
	}

	// Find instead of findOne
	cur, err := r.CookbookCollection.Find(ctx,
		bson.M{"cookbookID": bson.M{"$in": objectIds}},
	)

	if err != nil {
		c.Status(http.StatusInternalServerError)
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

func (r *Client) getCookbookRecipe(ctx context.Context, c *gin.Context, id string) {
	objID, _ := primitive.ObjectIDFromHex(id)
	res := r.CookbookCollection.FindOne(ctx, bson.M{
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
		"nutrients":    recipe.Nutrients,
		"updatedAt":    time.Now(),
	}
	result, err := r.CookbookCollection.UpdateOne(ctx, bson.M{"cookbookID": cookbookID}, bson.M{"$set": update})

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

	recipeDeleted, err := r.CookbookCollection.DeleteOne(ctx, bson.M{"cookbookID": cookbookID})
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

	cbIds := make([]primitive.ObjectID, len(ids))
	spIds := make([]int64, len(ids))
	for i := range ids {
		id, err := primitive.ObjectIDFromHex(ids[i])
		if err == nil {
			cbIds = append(cbIds, id)
		} else {
			idInt, err := strconv.Atoi(ids[i])
			if err != nil {
				fmt.Println("yeah atoi failed lol")
			}
			spIds = append(spIds, int64(idInt))
		}
	}

	cur, err := r.StubCollection.Find(ctx,
		bson.M{
			"name": primitive.Regex{Pattern: query, Options: "i"},
			"$or": []interface{}{
				bson.M{"cookbookID": bson.M{"$in": cbIds}},
				bson.M{"spoonacularID": bson.M{"$in": spIds}},
			},
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
