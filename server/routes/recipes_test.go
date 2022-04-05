package routes_test

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"server/models"
	"server/routes"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestRecipes(t *testing.T) {
	c := routes.New()

	t.Run("CreateRecipe", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		id := primitive.NewObjectID()

		recipe := models.Recipe{
			RecipeStub: models.RecipeStub{
				RecipeName: "TEST_NAME_CREATE_RECIPE",
				CookbookID: id,
			},
			Author: "Amelia",
		}
		reqBody, err := json.Marshal(recipe)
		assert.NoError(t, err)
		ctx.Request = httptest.NewRequest(
			http.MethodPost,
			"/recipes",
			io.NopCloser(strings.NewReader(string(reqBody))))

		c.CreateRecipe(ctx)

		assert.Equal(t, http.StatusOK, w.Code)

		_, err = c.RecipeCollection.DeleteMany(context.Background(), bson.M{"name": "TEST_NAME_CREATE_RECIPE"})
		assert.NoError(t, err)
	})

	t.Run("GetRecipe", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		id := primitive.NewObjectID()
		recipe := models.Recipe{
			RecipeStub: models.RecipeStub{
				RecipeName: "TEST_NAME_GET_RECIPE",
				CookbookID: id,
			},
			Author: "Amelia",
		}

		_, err := c.RecipeCollection.InsertOne(context.Background(), recipe)
		assert.NoError(t, err)
		ctx.Params = append(ctx.Params, gin.Param{Key: "id", Value: id.String()})

		c.GetRecipe(ctx)

		assert.Equal(t, http.StatusOK, w.Code)

		_, err = c.RecipeCollection.DeleteMany(context.Background(), bson.M{"name": "TEST_NAME_GET_RECIPE"})
		assert.NoError(t, err)

	})

}
