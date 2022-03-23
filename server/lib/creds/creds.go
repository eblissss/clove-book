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
	jwt.StandardClaims
}

// TODO: replace "123456" with secret token (from env)
var InsecureToken = []byte("123456")

func VerifyToken(c *gin.Context) (claims *Claims, valid bool) {
	cookie, err := c.Cookie("token")
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return nil, false
	}

	claims = &Claims{}
	token, err := jwt.ParseWithClaims(cookie, claims, func(t *jwt.Token) (interface{}, error) { return InsecureToken, nil })
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
		return nil, false
	}

	return claims, true
}

func NewSignedToken(username string, key []byte) (string, error) {
	signed, err := NewToken(username).SignedString(key)
	if err != nil {
		return "", err
	}
	return signed, nil
}

func NewToken(username string) *jwt.Token {
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		&Claims{
			Username: username,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().Add(5 * time.Minute).Unix(),
				IssuedAt:  time.Now().Unix(),
			},
		})

	return token
}
