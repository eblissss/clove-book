package routes

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"server/client/email"
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
var authUserCollection *mongo.Collection = OpenCollection(Client, "auth_users")
var mailClient = email.Must(email.New(os.Getenv("SENDGRID_KEY")))

func AuthUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Unwrap request into AuthUser
	user := &models.AuthUser{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Validate email
	if _, err := mail.ParseAddress(user.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	// Validate username
	if err := isValidUsername(ctx, user.Username); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	// Delete existing auth codes for user
	authUserCollection.DeleteMany(ctx, *user)

	rand.Seed(time.Now().UnixNano())
	user.Code = fmt.Sprint(1e5 + rand.Intn(1e6-1e5)) // [100000,999999]
	user.Expires = time.Now().Add(15 * time.Minute)

	// Add AuthUser
	if _, err := authUserCollection.InsertOne(ctx, *user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not added to auth base"})
		fmt.Println(err)
		return
	}

	// Send Email
	if err := mailClient.SendAuthCode(user.Email, fmt.Sprint(user.Code)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not send auth code"})
		fmt.Println(err)
		return
	}

	fmt.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{
		"expires": user.Expires,
	})
}

func RegisterUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Unwrap request into user
	user := &models.User{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Validate username
	if err := isValidUsername(ctx, user.Username); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	// Validate authCode code
	authUser := &models.AuthUser{}
	authCode := c.Params.ByName("code")
	if len(authCode) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "param 'code' not supplied"})
		return
	}
	res := authUserCollection.FindOne(ctx, bson.M{
		"email":    user.Email,
		"username": user.Username,
	})
	if err := res.Decode(authUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if authUser.Code != authCode {
		c.JSON(http.StatusConflict, gin.H{"error": "incorrect code"})
		return
	}

	user.UserID = primitive.NewObjectID()
	user.CreatedAt = time.Now().String()
	user.UpdatedAt = time.Now().String()

	// Insert user
	result, err := userCollection.InsertOne(ctx, *user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not created"})
		fmt.Println(err)
		return
	}
	if _, err = authUserCollection.DeleteOne(ctx, bson.M{
		"code":     authCode,
		"email":    user.Email,
		"username": user.Username,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userID": result.InsertedID,
	})
}

func LogInUser(c *gin.Context) {

	// 	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	// 	defer cancel()

	// 	user := &models.User{}
	// 	un := c.Params.ByName("username")
	// 	pw := c.Params.ByName("password")

	// 	err := userCollection.Find(ctx, bson.M{
	// 		"username": un,
	// 		"password": pw,
	// 	}).Decode(&user)

	// 	if err.Err() != nil {
	// 		err := fmt.Sprintf("Username not found: %s", Username)
	// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	// 		fmt.Println(err)
	// 		return
	// 	}

	// 	c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: gin.H{"data": user}})
}

func isValidUsername(ctx context.Context, username string) error {
	// Username invalid
	reg := regexp.MustCompile("^[a-zA-Z0-9_]*$")
	if res := reg.Find([]byte(username)); res == nil {
		return fmt.Errorf("username %s invalid. username can only contain alphanumeric characters and underscores", username)
	}
	// Username taken
	if res := userCollection.FindOne(ctx, bson.M{
		"username": username,
	}); res.Err() == nil {
		return fmt.Errorf("username taken: %s", username)
	}

	return nil
}
