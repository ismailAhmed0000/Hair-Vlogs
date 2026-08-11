package middleware

import (
	"strings"

	"hairvlogs-api/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

const LocalsUserID = "userID"

func Protected(jwtSecret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		header := c.Get("Authorization")
		if header == "" {
			return utils.Error(c, fiber.StatusUnauthorized, "missing authorization header")
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			return utils.Error(c, fiber.StatusUnauthorized, "invalid authorization header format")
		}

		claims, err := utils.ParseToken(parts[1], jwtSecret)
		if err != nil {
			return utils.Error(c, fiber.StatusUnauthorized, "invalid or expired token")
		}

		c.Locals(LocalsUserID, claims.UserID)
		return c.Next()
	}
}

func UserIDFromContext(c *fiber.Ctx) (uuid.UUID, bool) {
	id, ok := c.Locals(LocalsUserID).(uuid.UUID)
	return id, ok
}
