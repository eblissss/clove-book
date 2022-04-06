package routes

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"net/mail"
	"reflect"
	"regexp"
	"server/lib/creds"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	// Test
	if r.IsTest {
		c.JSON(http.StatusOK, authUser.Code)
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

func (r *Client) RefreshToken(c *gin.Context) {
	_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// If we're before 30 seconds of expire time, exit
	accessToken, err := c.Cookie("token")
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}
	accessClaims, _ := creds.VerifyToken(c, accessToken)
	if time.Now().Before(time.Unix(accessClaims.ExpiresAt, 0).Add(-24 * time.Hour)) {
		c.Status(http.StatusTooEarly)
		return
	}

	refreshToken, ok := c.GetQuery("refreshToken")
	if !ok {
		c.Status(http.StatusBadRequest)
		return
	}
	refreshClaims, ok := creds.VerifyToken(c, refreshToken)
	if !ok {
		c.Status(http.StatusUnauthorized)
		return
	}

	newAccessToken, err := creds.NewSignedToken(
		refreshClaims.Username, refreshClaims.UserID, creds.InsecureToken, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	c.SetCookie("token", newAccessToken, int(time.Now().Add(24*time.Hour).Unix()), "",
		"clovebook.com", true, true)

	newRefreshToken, err := creds.NewSignedToken(
		refreshClaims.Username, refreshClaims.UserID, creds.InsecureToken, 48*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"refreshToken": newRefreshToken,
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
	_, err := r.UserCollection.InsertOne(ctx, *user)
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
		"userID": user.UserID,
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
		fmt.Println(res.Err())
		return
	}

	// Combination successful
	user := &models.User{}
	if err := res.Decode(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println(user.Username)

	accessToken, err := creds.NewSignedToken(
		user.Username, user.UserID.Hex(), creds.InsecureToken, 24*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	c.SetCookie("token", accessToken, int(time.Now().Add(2*time.Hour).Unix()), "",
		"clovebook.com", true, true)

	refreshToken, err := creds.NewSignedToken(
		user.Username, user.UserID.Hex(), creds.InsecureToken, 48*time.Hour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"refreshToken": refreshToken,
	})
}

func (r *Client) LogoutUser(c *gin.Context) {
	// Kill cookie
	c.SetCookie("token", "", -1, "", "clovebook.com", true, true)

	c.Status(http.StatusOK)
}

func (r *Client) GetUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	id, ok := r.verifyUser(c)
	if !ok {
		return
	}

	res := r.UserCollection.FindOne(ctx, bson.M{
		"user_id": id,
	})
	if res.Err() != nil {
		if res.Err() == mongo.ErrNoDocuments {
			fmt.Println(res.Err().Error())
			c.Status(http.StatusNotFound)
			return
		}
		c.Status(http.StatusInternalServerError)
		return
	}

	user := &models.User{}
	res.Decode(user)

	c.JSON(http.StatusOK, user)
}

func (r *Client) UpdateUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Unwrap request into newUser
	newUser := &models.User{}
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusInternalServerError, bson.M{"error": err})
		fmt.Println(err)
	}
	// validate
	if err := r.Validator.Struct(newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	userID, ok := r.verifyUser(c)
	if !ok {
		return
	}

	// Get current user
	res := r.UserCollection.FindOne(ctx, bson.M{"user_id": userID})
	if res.Err() != nil {
		fmt.Println(res.Err())
		c.JSON(http.StatusBadRequest, bson.M{"error": res.Err().Error()})
	}
	user := &models.User{}
	if err := res.Decode(user); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, bson.M{"error": err.Error()})
	}

	// Black magic :relieved:
	// Basically only overwrites non-zero fields from request
	vNewUser := reflect.ValueOf(newUser).Elem()
	vUser := reflect.ValueOf(user).Elem()
	for field := 0; field < vNewUser.NumField(); field++ {
		// TODO: skip if fields are reserved / not allowed to change (i.e. id, created at)
		if vNewUser.Field(field).IsZero() {
			continue
		}
		vUser.Field(field).Set(vNewUser.Field(field))
	}
	newUser = vUser.Addr().Interface().(*models.User)
	newUser.UpdatedAt = time.Now()

	// Verify valid username / email
	if _, err := mail.ParseAddress(newUser.Email); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, bson.M{"error": err.Error()})
	}
	if ok := usernameValid(newUser.Username); !ok {
		fmt.Println("invalid username")
		c.JSON(http.StatusBadRequest, bson.M{"error": fmt.Errorf(
			"username %s invalid. username can only contain alphanumeric characters and underscores",
			userID).Error()})
	}

	// Update user
	if _, err := r.UserCollection.ReplaceOne(ctx,
		bson.M{"user_id": user.UserID},
		newUser,
	); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, bson.M{"error": err.Error()})
	}
	c.Status(http.StatusOK)
}

func (r *Client) DeleteUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	userID, ok := r.verifyUser(c)
	if !ok {
		return
	}

	// Delete user recipes
	_, err := r.RecipeCollection.DeleteMany(ctx, bson.M{
		"authorID": userID,
	})
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	// Delete user stubs
	_, err = r.StubCollection.DeleteMany(ctx, bson.M{
		"authorID": userID,
	})
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	userRes := r.UserCollection.FindOneAndDelete(ctx, bson.M{
		"user_id": userID,
	})
	if userRes.Err() != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusOK)
}

func (r *Client) verifyUser(c *gin.Context) (*primitive.ObjectID, bool) {
	// Authorize User
	cookie, err := c.Cookie("token")
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return nil, false
	}
	claims, ok := creds.VerifyToken(c, cookie)
	if !ok {
		return nil, false
	}

	// Get Param user ID
	userID, ok := c.Params.Get("userID")
	if !ok {
		c.JSON(http.StatusInternalServerError, bson.M{"error": "user ID not supplied"})
		return nil, false
	}

	// Compare user auth to param username
	if claims.UserID != userID {
		c.Status(http.StatusUnauthorized)
		return nil, false
	}

	id, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return nil, false
	}

	return &id, true
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
	if userValid := usernameValid(username); !userValid {
		return fmt.Errorf(
			"username %s invalid. username can only contain alphanumeric characters and underscores",
			username)
	}

	// Username taken
	if res := r.UserCollection.FindOne(ctx, bson.M{
		"username": username,
	}); res.Err() == nil {
		return fmt.Errorf("username taken: %s", username)
	}

	return nil
}

func usernameValid(username string) bool {
	reg := regexp.MustCompile("^[a-zA-Z0-9_]*$")
	if res := reg.Find([]byte(username)); res == nil {
		return false
	}
	return true
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
