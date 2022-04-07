package routes_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"server/models"
	"server/routes"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestRecipes(t *testing.T) {
	c, err := routes.NewTest()
	assert.NoError(t, err)

	SetupRegisterUser(t, c, SetupAuthUser(t, c))
	token := SetupLoginUser(t, c)

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
		body, err := json.Marshal(recipe)
		assert.NoError(t, err)
		ctx.Request = httptest.NewRequest(
			http.MethodPost,
			"/recipes",
			io.NopCloser(bytes.NewReader(body)),
		)
		ctx.Request.AddCookie(token)

		c.CreateRecipe(ctx)

		assert.Equal(t, http.StatusOK, w.Code)
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

		ctx.Request = httptest.NewRequest(
			http.MethodGet,
			fmt.Sprintf("/recipes/%s", id),
			nil,
		)
		ctx.Request.AddCookie(token)

		c.GetRecipe(ctx)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("UpdateRecipe", func(t *testing.T) {})

	t.Run("UpdateFavorites", func(t *testing.T) {})
	t.Run("ViewFavorites", func(t *testing.T) {})
	t.Run("DeleteRecipe", func(t *testing.T) {})

}
