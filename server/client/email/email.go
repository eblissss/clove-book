package email

import (
	"fmt"
	"log"

	sendgrid "github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

//go:generate faux -i IFace -o ../../mocks/client/email/email.go
type IFace interface {
	SendEmail(toEmail, subject, msg string) error
	SendAuthCode(toEmail, code string) error
}

type Client struct {
	sg *sendgrid.Client
}

func Must(c *Client, err error) *Client {
	if err != nil {
		panic(err)
	}
	return c
}

func New(key string) (*Client, error) {
	return &Client{
		sg: sendgrid.NewSendClient(key),
	}, nil
}

func (c *Client) SendEmail(toEmail, subject, msg string) error {
	from := mail.NewEmail("Amelia", "amelia@clovebook.com")
	to := mail.NewEmail(toEmail, toEmail)
	message := mail.NewSingleEmail(from, subject, to, "", msg)
	response, err := c.sg.Send(message)

	if err != nil {
		log.Println(err)
	} else {
		fmt.Println(response.StatusCode)
		fmt.Println(response.Body)
		fmt.Println(response.Headers)
	}
	return nil
}

func (c *Client) SendPasswordResetCode(toEmail, code string) error {
	subject := "Reset your password"
	msg := fmt.Sprintf(
		`<h1>Hey!</h1>
		<p>Please reset your password by using the code %s</p>
		<br/>
		<p>Amelia</p>`,
		code)
	err := c.SendEmail(toEmail, subject, msg)
	if err != nil {
		return err
	}

	return nil
}

func (c *Client) SendAuthCode(toEmail, code string) error {
	subject := "Authenticate your account"
	msg := fmt.Sprintf(
		`<h1>Hey!</h1>
		<p>Please verify your email by using the code %s</p>
		<br/>
		<p>Amelia</p>`,
		code)
	err := c.SendEmail(toEmail, subject, msg)
	if err != nil {
		return err
	}

	return nil
}

var _ IFace = (*Client)(nil)
