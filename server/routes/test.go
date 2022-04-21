package routes

import (
	"context"
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (r *Client) Test(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

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
			fmt.Println("Deleted: ", stub.RecipeName)
			if stub.SpoonacularID != -1 {
				r.StubCollection.DeleteOne(ctx, bson.M{"spoonacularID": stub.SpoonacularID})
			}
		}
	}

	// r.StubCollection.DeleteMany(ctx, bson.M{"name": "Carrot Soup 2"})

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
