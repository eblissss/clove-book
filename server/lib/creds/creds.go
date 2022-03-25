package creds

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type Claims struct {
	Username string `json:"username"`
	UserID   string `json:"userID"`
	jwt.StandardClaims
}

// TODO: replace "123456" with secret token (from env)
var InsecureToken = []byte("123456")

func VerifyToken(c *gin.Context, jwtToken string) (claims *Claims, valid bool) {
	claims = &Claims{}
	token, err := jwt.ParseWithClaims(jwtToken, claims, func(t *jwt.Token) (interface{}, error) { return InsecureToken, nil })
	if err != nil {
		fmt.Println(err)
		if err == jwt.ErrSignatureInvalid {
			c.Status(http.StatusUnauthorized)
			return nil, false
		}
		c.Status(http.StatusBadRequest)
		return nil, false
	}
	if !token.Valid {
		c.Status(http.StatusUnauthorized)
		return claims, false
	}

	return claims, true
}

func NewSignedToken(username, userID string, key []byte, duration time.Duration) (string, error) {
	signed, err := NewToken(username, userID, duration).SignedString(key)
	if err != nil {
		return "", err
	}
	return signed, nil
}

func NewToken(username, userID string, duration time.Duration) *jwt.Token {
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		&Claims{
			Username: username,
			UserID:   userID,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().UTC().Add(duration).Unix(),
				IssuedAt:  time.Now().UTC().Unix(),
			},
		})

	return token
}
