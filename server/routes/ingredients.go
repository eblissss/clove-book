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
