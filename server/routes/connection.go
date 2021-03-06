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
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Client struct {
	UserCollection          *mongo.Collection
	AuthUserCollection      *mongo.Collection
	ResetPasswordCollection *mongo.Collection
	RecipeCollection        *mongo.Collection
	StubCollection          *mongo.Collection
	FavoriteCollection      *mongo.Collection
	CookbookCollection      *mongo.Collection
	// SpoonClient        *spoonacular.Client
	MailClient *email.Client
	Validator  *validator.Validate
	IsTest     bool
}

func New() *Client {
	mongoClient := DBinstance()
	userCollection := OpenCollection(mongoClient, "users")
	authUserCollection := OpenCollection(mongoClient, "auth_users")
	recipeCollection := OpenCollection(mongoClient, "recipes")
	stubCollection := OpenCollection(mongoClient, "stubs")
	favoriteCollection := OpenCollection(mongoClient, "favorites")
	resetPasswordCollection := OpenCollection(mongoClient, "reset_password")
	cookbookCollection := OpenCollection(mongoClient, "cookbook")
	validate := validator.New()

	// spoonClient := spoonacular.New()

	mailClient := email.Must(email.New(os.Getenv("SENDGRID_KEY")))

	GuaranteeTextIndex(recipeCollection, "name")

	return &Client{
		UserCollection:          userCollection,
		AuthUserCollection:      authUserCollection,
		ResetPasswordCollection: resetPasswordCollection,
		RecipeCollection:        recipeCollection,
		StubCollection:          stubCollection,
		FavoriteCollection:      favoriteCollection,
		CookbookCollection:      cookbookCollection,
		MailClient:              mailClient,
		Validator:               validate,
		// SpoonClient:        spoonClient,
	}
}

func NewTest() (*Client, error) {
	mongoClient := DBinstance()
	userCollection := OpenCollection(mongoClient, "TEST_users")
	err := userCollection.Drop(context.Background())
	if err != nil {
		return nil, err
	}
	authUserCollection := OpenCollection(mongoClient, "TEST_auth_users")
	err = authUserCollection.Drop(context.Background())
	if err != nil {
		return nil, err
	}
	recipeCollection := OpenCollection(mongoClient, "TEST_recipes")
	err = recipeCollection.Drop(context.Background())
	if err != nil {
		return nil, err
	}
	stubCollection := OpenCollection(mongoClient, "TEST_stubs")
	err = stubCollection.Drop(context.Background())
	if err != nil {
		return nil, err
	}
	favoriteCollection := OpenCollection(mongoClient, "TEST_favorites")
	err = favoriteCollection.Drop(context.Background())
	if err != nil {
		return nil, err
	}
	resetPasswordCollection := OpenCollection(mongoClient, "TEST_users")
	err = resetPasswordCollection.Drop(context.Background())
	if err != nil {
		return nil, err
	}
	validate := validator.New()

	// spoonClient := spoonacular.New()

	mailClient := email.Must(email.New(os.Getenv("SENDGRID_KEY")))

	GuaranteeTextIndex(recipeCollection, "name")

	return &Client{
		UserCollection:          userCollection,
		AuthUserCollection:      authUserCollection,
		ResetPasswordCollection: resetPasswordCollection,
		RecipeCollection:        recipeCollection,
		StubCollection:          stubCollection,
		FavoriteCollection:      favoriteCollection,
		MailClient:              mailClient,
		Validator:               validate,
		IsTest:                  true,
		// SpoonClient:        spoonClient,
	}, nil
}

//DBinstance func
func DBinstance() *mongo.Client {
	godotenv.Load()

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

// Create a text index (or dont if already exists) for the collection
func GuaranteeTextIndex(collection *mongo.Collection, indexCol string) error {

	index := mongo.IndexModel{
		Keys: bson.D{primitive.E{Key: indexCol, Value: "text"}},
	}

	opts := options.CreateIndexes().SetMaxTime(5 * time.Second)

	indexName, err := collection.Indexes().CreateOne(context.Background(), index, opts)
	if err != nil {
		_ = fmt.Errorf("Could not create index query")
		return err
	}
	fmt.Println("Created index", indexName)

	return nil
}
