package utils

import "github.com/gofiber/fiber/v2"

func Error(c *fiber.Ctx, status int, message string) error {
	return c.Status(status).JSON(fiber.Map{
		"error": message,
	})
}

func Success(c *fiber.Ctx, status int, data interface{}) error {
	return c.Status(status).JSON(data)
}
