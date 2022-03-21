package routes

import (
	"context"
	"fmt"
	"log"
	"os"
	"server/client/email"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Client struct {
	UserCollection     *mongo.Collection
	AuthUserCollection *mongo.Collection
	RecipeCollection   *mongo.Collection
	StubCollection   *mongo.Collection
	MailClient         *email.Client
	Validator          *validator.Validate
}

func New() *Client {
	mongoClient := DBinstance()
	userCollection := OpenCollection(mongoClient, "users")
	authUserCollection := OpenCollection(mongoClient, "auth_users")
	recipeCollection := OpenCollection(mongoClient, "recipes")
	stubCollection := OpenCollection(mongoClient, "recipestub")
	validate := validator.New()

	mailClient := email.Must(email.New(os.Getenv("SENDGRID_KEY")))

	return &Client{
		UserCollection:     userCollection,
		AuthUserCollection: authUserCollection,
		RecipeCollection:   recipeCollection,
		StubCollection:		stubCollection,
		MailClient:         mailClient,
		Validator:          validate,
	}

}

//DBinstance func
func DBinstance() *mongo.Client {
	godotenv.Load(".env")

	MongoDb := os.Getenv("MONGODB_URL")

	client, err := mongo.NewClient(options.Client().ApplyURI(MongoDb))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB!")

	return client
}

//OpenCollection is a  function makes a connection with a collection in the database
func OpenCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	var collection *mongo.Collection = client.Database("CookBookMainCluster").Collection(collectionName)

	return collection
}
