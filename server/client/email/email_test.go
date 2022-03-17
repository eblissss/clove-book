package email_test

import (
	"os"
	"server/client/email"
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestSendEmailReal(t *testing.T) {
	// Comment out line to run
	t.Skip("Skipping SendEmailReal test...")
	godotenv.Load("../../.env")

	key, ok := os.LookupEnv("SENDGRID_KEY")
	assert.True(t, ok)

	c := email.Must(email.New(key))
	err := c.SendAuthCode("accrazed@gmail.com", "123456")
	assert.NoError(t, err)
}
