package routes

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"net/mail"
	"regexp"
	"server/lib/creds"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *Client) AuthUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Unwrap request into AuthUser
	authUser := &models.AuthUser{}
	if err := c.BindJSON(&authUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err := r.Validator.Struct(authUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err := r.validateAccount(ctx, authUser.Email, authUser.Username); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	// Delete existing authUser for user
	r.AuthUserCollection.DeleteMany(ctx, bson.M{
		"username": authUser.Username,
		"email":    authUser.Email,
	})

	authUser.Code, authUser.Expires = generateRandomCode()

	// Add AuthUser
	if _, err := r.AuthUserCollection.InsertOne(ctx, *authUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not added to auth base"})
		fmt.Println(err)
		return
	}

	// Send Email
	if err := r.MailClient.SendAuthCode(authUser.Email, fmt.Sprint(authUser.Code)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not send auth code"})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"expires": authUser.Expires,
	})
}

func (r *Client) RegisterUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Unwrap request into user
	user := &models.User{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// validate
	if err := r.Validator.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Validate email/username
	if err := r.validateAccount(ctx, user.Email, user.Username); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Validate auth code
	authUser := &models.AuthUser{}
	authCode, ok := c.GetQuery("code")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query val 'code' not supplied"})
		return
	}
	res := r.AuthUserCollection.FindOne(ctx, bson.M{
		"email":    user.Email,
		"username": user.Username,
	})
	if err := res.Decode(authUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	// Token expired
	if time.Now().After(authUser.Expires) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token expired"})
		return
	}
	// Incorrect code
	if authUser.Code != authCode {
		c.JSON(http.StatusConflict, gin.H{"error": "incorrect code"})
		return
	}

	user.UserID = primitive.NewObjectID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	// Insert user
	result, err := r.UserCollection.InsertOne(ctx, *user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not created"})
		fmt.Println(err)
		return
	}

	// Delete auth code entry
	r.AuthUserCollection.DeleteMany(ctx, bson.M{
		"username": user.Username,
		"email":    user.Email,
	})

	c.JSON(http.StatusOK, gin.H{
		"userID": result.InsertedID,
	})
}

func (r *Client) LoginUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find user
	username, uOk := c.GetQuery("username")
	password, pOk := c.GetQuery("password")
	if !uOk || !pOk {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing username or password query"})
		return
	}
	res := r.UserCollection.FindOne(ctx, bson.M{
		"username": username,
		"password": password,
	})
	if res.Err() != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username/password"})
		return
	}

	// Combination successful
	user := &models.User{}
	if err := res.Decode(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	// TODO: replace "123456" with secret token (from env)
	token, err := creds.NewSignedToken(user.Username, creds.InsecureToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.SetCookie("token", token, int(time.Now().Add(2*time.Hour).Unix()), "",
		"clovebook.com", true, true)

	c.Status(http.StatusOK)
}

func (r *Client) LogoutUser(c *gin.Context) {
	// Kill cookie
	c.SetCookie("token", "", -1, "", "clovebook.com", true, true)
	c.Status(http.StatusOK)
}

func (r *Client) GetUser(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) UpdateUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Unwrap request into user
	user := &models.User{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusInternalServerError, bson.M{"error": err})
	}
	// validate
	if err := r.Validator.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Authorize User
	claims, ok := creds.VerifyToken(c)
	if !ok {
		return
	}

	// Get Param useranme
	username, ok := c.Params.Get("username")
	if !ok {
		c.JSON(http.StatusInternalServerError, bson.M{"error": "username not supplied"})
		return
	}

	// Compare user auth to param username
	if claims.Username != username {
		c.Status(http.StatusUnauthorized)
		return
	}

	// Update user
	user.UpdatedAt = time.Now()
	if res := r.AuthUserCollection.FindOneAndUpdate(ctx, bson.M{"username": user.Username}, user); res.Err() != nil {
		c.JSON(http.StatusBadRequest, bson.M{"error": res.Err()})
		return
	}

	c.Status(http.StatusOK)
}

func (r *Client) DeleteUser(c *gin.Context) {
	c.Status(http.StatusServiceUnavailable)
}

func (r *Client) validateAccount(ctx context.Context, email, username string) error {

	if err := r.validateEmail(ctx, email); err != nil {
		return err
	}
	if err := r.validateUsername(ctx, username); err != nil {
		return err
	}
	return nil
}

func (r *Client) validateUsername(ctx context.Context, username string) error {
	// Username invalid
	reg := regexp.MustCompile("^[a-zA-Z0-9_]*$")
	if res := reg.Find([]byte(username)); res == nil {
		return fmt.Errorf("username %s invalid. username can only contain alphanumeric characters and underscores", username)
	}

	// Username taken
	if res := r.UserCollection.FindOne(ctx, bson.M{
		"username": username,
	}); res.Err() == nil {
		return fmt.Errorf("username taken: %s", username)
	}

	return nil
}

func (r *Client) validateEmail(ctx context.Context, email string) error {
	// Email invalid
	if _, err := mail.ParseAddress(email); err != nil {
		return err
	}

	// Email taken
	if res := r.UserCollection.FindOne(ctx, bson.M{
		"email": email,
	}); res.Err() == nil {
		return fmt.Errorf("email taken: %s", email)
	}

	return nil
}

func generateRandomCode() (code string, expires time.Time) {
	rand.Seed(time.Now().UnixNano())
	code = fmt.Sprint(1e5 + rand.Intn(1e6-1e5)) // [100000,999999]
	expires = time.Now().Add(15 * time.Minute)
	return
}
