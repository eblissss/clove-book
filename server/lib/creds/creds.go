package creds

import (
	"time"

	"github.com/golang-jwt/jwt"
)

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func NewSignedToken(username, key string) (string, error) {
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
