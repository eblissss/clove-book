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

func (r *Client) Test(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// CODE TO REMOVE DUPLICATES
	cur, err := r.StubCollection.Find(ctx, bson.D{})

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

	allKeys := make(map[int64]bool)
	for _, stub := range foundRecipes {
		if _, value := allKeys[stub.SpoonacularID]; !value {
			allKeys[stub.SpoonacularID] = true
		} else {
			if stub.SpoonacularID > 0 {
				fmt.Println("Deleted: ", stub.RecipeName)
				fmt.Println(stub.SpoonacularID)
				r.StubCollection.DeleteOne(ctx, bson.M{"spoonacularID": stub.SpoonacularID})
			}
		}
	}

	oid, _ := primitive.ObjectIDFromHex("100000000000000000000000")

	allKeys2 := make(map[primitive.ObjectID]bool)
	for _, stub := range foundRecipes {
		if _, value := allKeys2[stub.CookbookID]; !value {
			allKeys2[stub.CookbookID] = true
		} else {
			if stub.CookbookID != oid {
				fmt.Println("Deleted: ", stub.RecipeName)
				fmt.Println(stub.CookbookID)
				r.StubCollection.DeleteOne(ctx, bson.M{"cookbookID": stub.CookbookID})
			}
		}
	}

	// Delete bad recipes
	// toDelete := [20]string{"omega cake", "cheese", "cheesey", "beans, but better",
	// 	"Test Fraction Recipe", "test fract 2", " ", "", "0", "0",
	// 	"0", "0", "0", "0", "0", "0", "0", "0", "0", "0"}

	// _, err = r.StubCollection.DeleteMany(ctx,
	// 	bson.M{"name": bson.M{"$in": toDelete}})

	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// r.StubCollection.DeleteMany(ctx, bson.M{"name": ""})

	// CODE TO RESTORE STUBS
	// cur, err = r.RecipeCollection.Find(ctx, bson.D{})

	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// var foundRecipesInterface []interface{}

	// recipeKeys := make(map[primitive.ObjectID]bool)
	// var recipe models.Recipe
	// for cur.Next(ctx) {
	// 	_ = cur.Decode(&recipe)

	// 	if _, value := recipeKeys[recipe.CookbookID]; !value {
	// 		recipeKeys[recipe.CookbookID] = true

	// 		stub := models.RecipeStub{
	// 			CookbookID:    recipe.CookbookID,
	// 			SpoonacularID: recipe.SpoonacularID,
	// 			ImageURL:      recipe.ImageURL,
	// 			RecipeName:    recipe.RecipeName,
	// 			IsUserRecipe:  true,
	// 			TotalTime:     recipe.TotalTime,
	// 			Ingredients:   recipe.Ingredients,
	// 			AuthorID:      recipe.AuthorID,
	// 			UpdatedAt:     recipe.UpdatedAt,
	// 		}
	// 		foundRecipesInterface = append(foundRecipesInterface, stub)
	// 		fmt.Println("Adding ", stub.RecipeName)
	// 	}
	// }

	// _, err = r.StubCollection.InsertMany(ctx, foundRecipesInterface)
	// if err != nil {
	// 	fmt.Println("Couldn't insert stubs", err)
	// }

	c.JSON(http.StatusOK, "Hi :)")
}

// Code to transfer collections
// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()

// 	cur, err := r.RecipeCollection.Find(ctx, bson.D{{}})

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	foundRecipes := make([]models.OldRecipe, 0)

// 	err = cur.All(ctx, &foundRecipes)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	var foundRecipesInterface []interface{}

// 	for _, oldRecipe := range foundRecipes {
// 		newNutrients := append(oldRecipe.Nutrients.Bad, oldRecipe.Nutrients.Good...)

// 		recipe := models.Recipe{
// 			RecipeStub:   oldRecipe.RecipeStub,
// 			Nutrients:    newNutrients, // CHANGE THIS one
// 			Author:       oldRecipe.Author,
// 			CookTime:     oldRecipe.CookTime,
// 			PrepTime:     oldRecipe.PrepTime,
// 			Instructions: oldRecipe.Instructions,
// 			CreatedAt:    oldRecipe.CreatedAt,
// 		}
// 		foundRecipesInterface = append(foundRecipesInterface, recipe)
// 	}

// 	_, err = r.CookbookCollection.InsertMany(ctx, foundRecipesInterface)
// 	if err != nil {
// 		fmt.Println("Couldn't insert recipe", err)
// 	}

// 	cur, err = r.CookbookCollection.Find(ctx, bson.D{{}})

// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	foundCB := make([]models.Recipe, 0)

// 	err = cur.All(ctx, &foundCB)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	fmt.Println(foundCB)

// 	c.JSON(http.StatusOK, foundRecipes)
