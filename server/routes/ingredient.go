package routes

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func Test(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 60*time.Second)

	defer cancel()

	c.JSON(http.StatusOK, "hi :)")
}
