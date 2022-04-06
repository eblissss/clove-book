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
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

const (
	USERNAME = "test"
	PASSWORD = "some-password"
	EMAIL    = "meme-email@meme.cum"
)

func TestUsers(t *testing.T) {
	c, err := routes.NewTest()
	assert.NoError(t, err)
	code := ""
	userID := ""
	var token *http.Cookie

	// Auth user
	t.Run("AuthUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		body, err := json.Marshal(map[string]interface{}{
			"username": USERNAME,
			"email":    EMAIL,
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
		code = strings.Replace(string(resp), "\"", "", -1)
	})

	// Register user
	t.Run("RegisterUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		body, err := json.Marshal(map[string]interface{}{
			"username":  USERNAME,
			"email":     EMAIL,
			"firstName": "meme",
			"lastName":  "machine",
			"password":  PASSWORD,
		})
		assert.NoError(t, err)

		ctx.Request = httptest.NewRequest(
			http.MethodPost,
			fmt.Sprintf("/users?code=%s", code),
			io.NopCloser(bytes.NewReader(body)),
		)

		c.RegisterUser(ctx)
		assert.Equal(t, http.StatusOK, w.Code)

		resp, err := ioutil.ReadAll(w.Result().Body)
		assert.NoError(t, err)
		r := make(map[string]interface{})
		json.Unmarshal(resp, &r)

		var ok bool
		userID, ok = r["userID"].(string)
		assert.True(t, ok)
	})

	// Login user
	t.Run("LoginUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		assert.NoError(t, err)

		ctx.Request = httptest.NewRequest(
			http.MethodGet,
			fmt.Sprintf("/users/login?username=%s&password=%s", USERNAME, PASSWORD),
			nil,
		)

		c.LoginUser(ctx)
		assert.Equal(t, http.StatusOK, w.Code)
		token = w.Result().Cookies()[0]
	})

	// Get user
	t.Run("GetUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		ctx.Params = append(ctx.Params, gin.Param{Key: "userID", Value: userID})
		ctx.Request = httptest.NewRequest(
			http.MethodGet,
			fmt.Sprintf("/users/%s", userID),
			nil,
		)
		ctx.Request.AddCookie(token)

		c.GetUser(ctx)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	// Update user
	t.Run("UpdateUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		body, err := json.Marshal(map[string]interface{}{
			"lastName": "automata",
		})
		assert.NoError(t, err)

		ctx.Params = append(ctx.Params, gin.Param{Key: "userID", Value: userID})
		ctx.Request = httptest.NewRequest(
			http.MethodPut,
			fmt.Sprintf("/users/%s", userID),
			bytes.NewReader(body),
		)
		ctx.Request.AddCookie(token)

		c.UpdateUser(ctx)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	// Delete user
	t.Run("DeleteUser", func(t *testing.T) {
		w := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(w)

		ctx.Params = append(ctx.Params, gin.Param{Key: "userID", Value: userID})
		ctx.Request = httptest.NewRequest(
			http.MethodDelete,
			fmt.Sprintf("/users/%s", userID),
			nil,
		)
		ctx.Request.AddCookie(token)

		c.DeleteUser(ctx)

		assert.Equal(t, http.StatusOK, w.Code)
	})
}
