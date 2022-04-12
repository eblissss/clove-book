package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r *Client) Test(c *gin.Context) {
	// ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	// defer cancel()

	// r.StubCollection.DeleteMany(ctx, bson.M{"cookbookID": primitive.NilObjectID})
	c.JSON(http.StatusOK, "Hi :)")
}
