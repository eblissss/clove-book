package routes

import (
	"context"
	"fmt"
	"net/http"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var userCollection *mongo.Collection = OpenCollection(Client, "users")

func MakeUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	newUser := &models.User{}

	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err := validate.Struct(newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if res := userCollection.FindOne(ctx, bson.M{
		"username": newUser.Username,
	}); res.Err() == nil {
		err := fmt.Sprintf("username taken: %s", newUser.Username)
		c.JSON(http.StatusConflict, gin.H{"error": err})
		fmt.Println(err)
		return
	}

	newUser.UserID = primitive.NewObjectID()
	newUser.CreatedAt = time.Now().String()
	newUser.UpdatedAt = time.Now().String()

	result, err := userCollection.InsertOne(ctx, *newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not created"})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userID": result.InsertedID,
	})
}

func LogIn(c *gin.Context) {
	
	// ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	// defer cancel()

	// user := &models.User{}
	// un = c.Params.ByName("username")
	// pw = c.Params.ByName("password")

	// err := userCollection.Find(ctx, bson.M{
	// 	"username": un,
	// 	"password": pw
	// }).Decode(&user)

	// if err.Err() != nil {
	// 	err := fmt.Sprintf("Username not found: %s", Username)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	// 	fmt.Println(err)
	// 	return
	// }

	c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: M.{"data": user}})
}

