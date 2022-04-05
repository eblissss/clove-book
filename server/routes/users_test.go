package routes_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"server/routes"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestUsers(t *testing.T) {
	c, err := routes.NewTest()
	assert.NoError(t, err)
	code := ""

	// Auth user
	t.Run("AuthUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		body, err := json.Marshal(map[string]interface{}{
			"username": "test",
			"email":    "meme-email@meme.cum",
		})
		assert.NoError(t, err)

		ctx.Request = httptest.NewRequest(
			http.MethodPost,
			"/users/auth",
			io.NopCloser(bytes.NewReader(body)),
		)

		c.AuthUser(ctx)
		assert.Equal(t, http.StatusOK, w.Code)

		resp, err := ioutil.ReadAll(w.Result().Body)
		assert.NoError(t, err)
		code = string(resp)
	})

	// Register user
	t.Run("RegisterUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		ctx.Params = append(ctx.Params, gin.Param{Key: "code", Value: code})
		body, err := json.Marshal(map[string]interface{}{
			"username":  "test",
			"email":     "meme-email@meme.cum",
			"firstName": "meme",
			"lastName":  "machine",
			"password":  "some-password",
		})
		assert.NoError(t, err)
		fmt.Printf("Using code: %s\n", code)

		ctx.Request = httptest.NewRequest(
			http.MethodPost,
			"/users",
			io.NopCloser(bytes.NewReader(body)),
		)

		c.RegisterUser(ctx)
		assert.Equal(t, http.StatusOK, w.Code)

		resp, err := ioutil.ReadAll(w.Result().Body)
		fmt.Println(string(resp))
		assert.NoError(t, err)
	})
	// Delete user
	t.Run("DeleteUser", func(t *testing.T) {

	})
}
