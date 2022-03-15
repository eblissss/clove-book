package email

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strconv"
)

type Client struct {
	user string
	pass string
	host string
	port int
}

func New() (*Client, error) {
	user, ok := os.LookupEnv("SMTP_USERNAME")
	if !ok {
		return nil, fmt.Errorf("env: SMTP_USERNAME not found")
	}
	pass, ok := os.LookupEnv("SMTP_PASSWORD")
	if !ok {
		return nil, fmt.Errorf("env: SMTP_PASSWORD not found")
	}
	host, ok := os.LookupEnv("SMTP_HOST")
	if !ok {
		return nil, fmt.Errorf("env: SMTP_HOST not found")
	}
	portStr, ok := os.LookupEnv("SMTP_PORT")
	if !ok {
		return nil, fmt.Errorf("env: SMTP_PORT not found")
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("env: %v", err)
	}

	return &Client{
		user: user,
		pass: pass,
		host: host,
		port: port,
	}, nil
}

func (c *Client) SendEmail() error {
	from := "john.doe@example.com"

	to := []string{
		"roger.roe@example.com",
	}

	msg := []byte("From: john.doe@example.com\r\n" +
		"To: roger.roe@example.com\r\n" +
		"Subject: Test mail\r\n\r\n" +
		"Email body\r\n")

	auth := smtp.PlainAuth("", c.user, c.pass, c.host)

	err := smtp.SendMail(fmt.Sprintf("%s:%s", c.host, c.port), auth, from, to, msg)

	if err != nil {
		log.Fatal(err)
	}

	return nil
}
