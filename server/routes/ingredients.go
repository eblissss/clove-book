package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
)

// we are doing this client side!


func Test(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	raw := `{ "uid": 25, "email": "fuckyou" }`

	user := &models.User{}

	// unwraps json encoded string into the user struct created above
	err := json.Unmarshal([]byte(raw), user)
	fmt.Printf("%#v", *user)
	fmt.Println(err)

	c.JSON(http.StatusOK, "hi :)")
}

func (r *Client) ViewIngredients(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()



	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) AddIngredients(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) DeleteIngredients(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) UpdateIngredients(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	ings := make([]*string, 0)
	
	if err := c.BindJSON(&ings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := r.RecipeCollection.InsertOne(ctx, ings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Recipe could not be added"})
		return
	}

	c.Status(http.StatusServiceUnavailable)
}
