package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	UserID    primitive.ObjectID `json:"userID" bson:"user_id"`
	Username  string             `json:"username" bson:"username"`
	FirstName string             `json:"firstName" bson:"first_name"`
	LastName  string             `json:"lastName" bson:"last_name"`
	Email     string             `json:"email" bson:"email"`
	Password  string             `json:"password" bson:"password"`
	CreatedAt time.Time          `json:"createdAt" bson:"created_at"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updated_at"`
}

// ingredients table will store.
type AuthUser struct {
	Username string    `json:"username" bson:"username"`
	Email    string    `json:"email" bson:"email"`
	Expires  time.Time `json:"expires" bson:"expires"`
	Code     string    `json:"code" bson:"code"`
}
